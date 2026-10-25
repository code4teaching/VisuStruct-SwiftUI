/**
 * Verbindung zum echten mBot2 über USB (Web Serial, nur Chrome/Edge). Die Makeblock-Firmware des CyberPi
 * führt Python-Zeilen aus, die in einen Rahmen verpackt sind:
 * `F3, Kopfsumme, Länge (2 Byte), 28, Modus, Nummer (2 Byte), Textlänge (2 Byte), Text, Summe, F4`.
 * Modus 4 führt nur aus (Fahrbefehle antworten erst, wenn sie fertig sind), Modus 1 liefert den Wert zurück.
 * Die Antwort trägt dieselbe Nummer und enthält `{"ret":…}`. Getestet mit Holgers mBot2 (Oktober 2026).
 */

const HEAD = 0xf3
const FOOT = 0xf4
const SCRIPT = 0x28
export const RUN = 4
export const ASK = 1

/** Rahmen um einen Inhalt legen. */
export function frame(body: number[]): Uint8Array {
  const len = body.length
  const head = (HEAD + (len & 0xff) + (len >> 8)) & 0xff
  const sum = body.reduce((a, b) => a + b, 0) & 0xff
  return Uint8Array.from([HEAD, head, len & 0xff, len >> 8, ...body, sum, FOOT])
}

/** Python-Zeile als Rahmen mit Modus und Nummer. */
export function pythonFrame(code: string, mode: number, idx: number): Uint8Array {
  const text = Array.from(new TextEncoder().encode(code))
  return frame([SCRIPT, mode, idx & 0xff, (idx >> 8) & 0xff, text.length & 0xff, text.length >> 8, ...text])
}

export interface ScriptAnswer {
  idx: number
  /** Wert aus `{"ret":…}`: Zahl, Wahrheitswert oder `null` (Python `None`). */
  value: number | boolean | null
}

/**
 * Sucht vollständige Rahmen in `rx` und gibt die Antworten auf Python-Zeilen zurück; verbrauchte Bytes werden entfernt.
 * Textausgaben des CyberPi außerhalb von Rahmen (z. B. nach dem Neustart) werden übersprungen.
 */
export function readAnswers(rx: number[]): ScriptAnswer[] {
  const answers: ScriptAnswer[] = []
  for (;;) {
    const start = rx.indexOf(HEAD)
    if (start < 0) {
      rx.length = 0
      break
    }
    rx.splice(0, start)
    if (rx.length < 4) break
    const len = rx[2] | (rx[3] << 8)
    // Kein Rahmen, nur ein zufälliges F3 im Text: weitersuchen
    if (rx[1] !== ((HEAD + rx[2] + rx[3]) & 0xff) || len > 4096) {
      rx.splice(0, 1)
      continue
    }
    if (rx.length < len + 6) break
    const body = rx.slice(4, 4 + len)
    rx.splice(0, len + 6)
    if (body[0] !== SCRIPT || body.length < 6) continue
    const text = new TextDecoder().decode(Uint8Array.from(body.slice(6)))
    const m = /"ret"\s*:\s*([^}]*)\}/.exec(text)
    if (m) answers.push({ idx: body[2] | (body[3] << 8), value: pythonValue(m[1].trim()) })
  }
  return answers
}

function pythonValue(text: string): number | boolean | null {
  if (text === 'True') return true
  if (text === 'False') return false
  const n = Number(text)
  return text !== '' && Number.isFinite(n) ? n : null
}

// Web Serial ist nicht in den TypeScript-Typen; nur das Nötigste.
interface SerialPortLike {
  open(options: { baudRate: number }): Promise<void>
  close(): Promise<void>
  readable: ReadableStream<Uint8Array> | null
  writable: WritableStream<Uint8Array> | null
}
interface SerialLike {
  requestPort(): Promise<SerialPortLike>
}

const serial = (): SerialLike | undefined => (typeof navigator === 'undefined' ? undefined : (navigator as unknown as { serial?: SerialLike }).serial)

/** Kann dieser Browser einen mBot2 über USB ansprechen? */
export const canConnectMBot = () => serial() !== undefined

/** Mehrere Python-Anweisungen als eine Zeile (der CyberPi nimmt nur eine). JSON-Strings sind auch gültige Python-Strings. */
export const pyLines = (...lines: string[]) => `exec(${JSON.stringify(lines.join('; '))})`

/**
 * Bildschirm leeren und Text in der Mitte zeigen. Ohne Pinselfarbe: `display.set_brush` wirkt am CyberPi
 * unzuverlässig (Texte kamen rot, lila, grün oder blau statt in der gewählten Farbe, auch mit Pausen).
 * Beim Verbinden startet der CyberPi neu, dann ist die Schrift weiß.
 */
export const showLabel = (text: string, size = 24) => pyLines('cyberpi.display.clear()', `cyberpi.display.show_label(${JSON.stringify(text)}, ${size}, 'center')`)

/**
 * Logo nach dem Verbinden (und nach „mBot2 testen“ → Text): „VisuBot“ groß.
 * Grafik (screen.set_pixel, Sprite) zeigt über USB nichts, Farben gehen nicht zuverlässig. Am echten mBot2 getestet (Oktober 2026).
 */
export const HELLO = showLabel('VisuBot', 32)

export class MBotLink {
  private port?: SerialPortLike
  private writer?: WritableStreamDefaultWriter<Uint8Array>
  private reader?: ReadableStreamDefaultReader<Uint8Array>
  private loop?: Promise<void>
  private rx: number[] = []
  private idx = 1
  private waiting = new Map<number, { resolve: (v: number | boolean | null) => void; reject: (e: Error) => void }>()
  private queue: Promise<unknown> = Promise.resolve()
  private listeners = new Set<() => void>()
  error?: string
  /** Port ist offen, der CyberPi startet noch neu. */
  connecting = false

  /** `fn` bei Verbinden, Trennen und Fehlern rufen; gibt eine Abmeldung zurück. */
  listen(fn: () => void): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  private changed() {
    for (const fn of this.listeners) fn()
  }

  get connected() {
    return this.writer !== undefined && !this.connecting
  }

  /** Fragt nach dem USB-Anschluss, öffnet ihn und wartet den Neustart des CyberPi ab. */
  async connect() {
    const s = serial()
    if (!s) throw new Error('Web Serial')
    const port = await s.requestPort()
    await port.open({ baudRate: 115200 })
    this.port = port
    this.writer = port.writable!.getWriter()
    this.error = undefined
    this.connecting = true
    this.changed()
    this.loop = this.readLoop()
    // Seite schließen oder neu laden: Anschluss freigeben
    window.addEventListener('pagehide', () => void this.disconnect(), { once: true })
    // Das Öffnen setzt den CyberPi zurück
    await new Promise((r) => setTimeout(r, 3000))
    if (!this.writer) return
    // Textausgaben vom Neustart verwerfen
    this.rx.length = 0
    this.connecting = false
    this.changed()
    await this.run(HELLO)
  }

  /**
   * Sauber trennen wie beim Auswerfen: Motoren anhalten, LEDs aus, Abschied auf dem Bildschirm,
   * dann Leser und Schreiber freigeben und den Anschluss schließen. So lässt er sich ohne Neustart wieder verbinden.
   */
  async disconnect(error?: string) {
    if (!this.port) {
      this.error = error
      return this.changed()
    }
    if (!error && this.writer && !this.connecting) {
      for (const code of ["mbot2.EM_stop('ALL')", 'cyberpi.led.off()', showLabel('Bis bald!')])
        await this.send(code, RUN, 2000).catch(() => undefined)
    }
    const port = this.port
    const writer = this.writer
    const reader = this.reader
    const loop = this.loop
    this.port = this.writer = this.reader = this.loop = undefined
    this.error = error
    this.connecting = false
    for (const w of this.waiting.values()) w.reject(new Error(error ?? 'getrennt'))
    this.waiting.clear()
    try {
      await reader?.cancel()
      await loop
      await writer?.close()
    } catch {
      /* Leitung schon weg */
    }
    try {
      writer?.releaseLock()
      await port.close()
    } catch (e) {
      console.warn('[mBot2] Schließen', (e as Error).message)
    }
    this.changed()
  }

  /** Python-Zeile ausführen; kehrt zurück, wenn der Roboter fertig ist (Fahren dauert). */
  run(code: string): Promise<void> {
    return this.send(code, RUN, 30000).then(() => undefined)
  }

  /** Wert eines Python-Ausdrucks, z. B. eines Sensors. */
  ask(code: string): Promise<number | boolean | null> {
    return this.send(code, ASK, 3000)
  }

  private send(code: string, mode: number, timeoutMs: number): Promise<number | boolean | null> {
    // Immer nur eine Zeile unterwegs: der CyberPi arbeitet sie nacheinander ab.
    const next = this.queue.then(
      () =>
        new Promise<number | boolean | null>((resolve, reject) => {
          if (!this.writer) return reject(new Error('nicht verbunden'))
          const idx = this.idx
          this.idx = (this.idx % 0xffff) + 1
          const timer = setTimeout(() => {
            this.waiting.delete(idx)
            reject(new Error('keine Antwort'))
          }, timeoutMs)
          this.waiting.set(idx, {
            resolve: (v) => (clearTimeout(timer), resolve(v)),
            reject: (e) => (clearTimeout(timer), reject(e)),
          })
          this.writer.write(pythonFrame(code, mode, idx)).catch((e: Error) => {
            this.waiting.delete(idx)
            reject(e)
          })
        }),
    )
    this.queue = next.catch(() => undefined)
    return next
  }

  private async readLoop() {
    while (this.port?.readable) {
      const reader = this.port.readable.getReader()
      this.reader = reader
      try {
        for (;;) {
          const { value, done } = await reader.read()
          if (done) break
          this.rx.push(...value)
          for (const a of readAnswers(this.rx)) {
            const w = this.waiting.get(a.idx)
            this.waiting.delete(a.idx)
            w?.resolve(a.value)
          }
        }
      } catch (e) {
        // Störungen auf der Leitung (z. B. beim Neustart des CyberPi) sind harmlos: mit neuem Leser weiter
        const harmless = ['BufferOverrunError', 'FramingError', 'BreakError', 'ParityError'].includes((e as Error).name)
        console.warn('[mBot2] Lesefehler', (e as Error).name, (e as Error).message)
        if (!harmless && this.port) void this.disconnect((e as Error).message)
      } finally {
        reader.releaseLock()
      }
      if (!this.writer) break
    }
  }
}

/** Eine Verbindung für die ganze Seite (bleibt beim Neuaufbau der Oberfläche erhalten). */
export const mbotLink = new MBotLink()
