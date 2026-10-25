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
    if (rx[1] !== ((HEAD + rx[2] + rx[3]) & 0xff)) {
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

/** Eine Verbindung für die ganze Seite (bleibt beim Neuaufbau der Oberfläche erhalten). */
export class MBotLink {
  private port?: SerialPortLike
  private writer?: WritableStreamDefaultWriter<Uint8Array>
  private reader?: ReadableStreamDefaultReader<Uint8Array>
  private rx: number[] = []
  private idx = 1
  private waiting = new Map<number, { resolve: (v: number | boolean | null) => void; reject: (e: Error) => void }>()
  private queue: Promise<unknown> = Promise.resolve()
  /** Wird bei Verbinden, Trennen und Fehlern gerufen. */
  onChange?: () => void
  error?: string

  get connected() {
    return this.writer !== undefined
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
    void this.readLoop()
    // Das Öffnen setzt den CyberPi zurück
    await new Promise((r) => setTimeout(r, 3000))
    this.onChange?.()
    await this.run("cyberpi.display.show_label('Hallo VisuBot!', 24, 'center')")
  }

  async disconnect(error?: string) {
    const port = this.port
    const writer = this.writer
    const reader = this.reader
    this.port = this.writer = this.reader = undefined
    this.error = error
    for (const w of this.waiting.values()) w.reject(new Error(error ?? 'getrennt'))
    this.waiting.clear()
    try {
      writer?.releaseLock()
      await reader?.cancel()
      await port?.close()
    } catch {
      /* schon weg */
    }
    this.onChange?.()
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
        if (this.port) void this.disconnect((e as Error).message)
      } finally {
        reader.releaseLock()
      }
      if (!this.writer) break
    }
  }
}

export const mbotLink = new MBotLink()
