/**
 * Verbindung zum echten mBot2 über USB (Web Serial, nur Chrome/Edge). Die Makeblock-Firmware des CyberPi
 * führt Python-Zeilen aus, die in einen Rahmen verpackt sind:
 * `F3, Kopfsumme, Länge (2 Byte), 28, Modus, Nummer (2 Byte), Textlänge (2 Byte), Text, Summe, F4`.
 * Modus 4 führt nur aus (Fahrbefehle antworten erst, wenn sie fertig sind), Modus 1 liefert den Wert zurück.
 * Die Antwort trägt dieselbe Nummer und enthält `{"ret":…}`. Getestet mit Holgers mBot2 (Oktober 2026).
 */

import type { MBotSensorValue } from './mbot'

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
  /** Wert aus `{"ret":…}`: Zahl, Wahrheitswert, Text oder `null` (Python `None`). */
  value: MBotSensorValue | null
}

/**
 * Sucht vollständige Rahmen in `rx` und gibt die Antworten auf Python-Zeilen zurück; verbrauchte Bytes werden entfernt.
 * Textausgaben des CyberPi außerhalb von Rahmen (z. B. nach dem Neustart) werden übersprungen.
 */
export function readAnswers(rx: number[]): ScriptAnswer[] {
  return readFrames(rx).flatMap((body) => scriptAnswer(body) ?? [])
}

/** Inhalt einer Antwort auf eine Python-Zeile, sonst `undefined`. */
function scriptAnswer(body: number[]): ScriptAnswer | undefined {
  if (body[0] !== SCRIPT || body.length < 6) return undefined
  const text = new TextDecoder().decode(Uint8Array.from(body.slice(6)))
  const m = /"ret"\s*:\s*([^}]*)\}/.exec(text)
  return m ? { idx: body[2] | (body[3] << 8), value: pythonValue(m[1].trim()) } : undefined
}

/** Alle vollständigen Rahmen aus `rx` (nur der Inhalt); verbrauchte Bytes werden entfernt. */
export function readFrames(rx: number[]): number[][] {
  const bodies: number[][] = []
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
    bodies.push(rx.slice(4, 4 + len))
    rx.splice(0, len + 6)
  }
  return bodies
}

function pythonValue(text: string): MBotSensorValue | null {
  if (text === 'True') return true
  if (text === 'False') return false
  // Text, z. B. ein Farbname: "red" oder 'red'
  const quoted = /^["'](.*)["']$/.exec(text)
  if (quoted) return quoted[1]
  const n = Number(text)
  return text !== '' && Number.isFinite(n) ? n : null
}

/**
 * Programm fest auf dem CyberPi speichern, wie „Hochladen“ in mBlock (Ablauf aus github.com/weare2plus3/cyberpi-uploader, MIT):
 * Upload-Modus (`0D 00 00`), REPL aus, Dateikopf mit Größe, XOR-Prüfsumme und Pfad, dann Blöcke zu 80 Byte.
 * Die Datei landet in einem Zwischenplatz, den die Firmware beim nächsten Neustart übernimmt.
 */
export const UPLOAD_PATH = '/flash/_xx_main.py'
const UPLOAD_MODE = [0x0d, 0x00, 0x00]
const FILE_SERVICE = 0x5e
const BLOCK = 80
export const UPLOAD_PREPARE = ['try:\n    import config\nexcept:\n    pass', 'try:\n    config.write_config("repl_enable", False)\nexcept:\n    pass']

const le = (value: number, bytes: number) => Array.from({ length: bytes }, (_, i) => (value >>> (8 * i)) & 0xff)

/** XOR der 32-Bit-Wörter (little endian, mit Nullen aufgefüllt), wie mBlock. */
export function fileChecksum(data: Uint8Array): number[] {
  let x = 0
  for (let i = 0; i < data.length; i += 4) x = (x ^ ((data[i] ?? 0) | ((data[i + 1] ?? 0) << 8) | ((data[i + 2] ?? 0) << 16) | ((data[i + 3] ?? 0) << 24))) >>> 0
  return le(x, 4)
}

const fileFrame = (cmd: number, payload: number[]) => frame([0x01, 0x00, FILE_SERVICE, cmd, ...le(payload.length, 2), ...payload])

/** Python-Datei in Rahmen: Kopf, dann Blöcke zu 80 Byte und ein letzter Block mit 4 Byte (wie mBlock; mit Zeilenumbrüchen aufgefüllt). */
export function uploadFrames(source: string, path = UPLOAD_PATH): Uint8Array[] {
  const raw = new TextEncoder().encode(source)
  const pad = (4 - (raw.length % BLOCK) + BLOCK) % BLOCK
  const data = new Uint8Array(raw.length + pad).fill(0x0a)
  data.set(raw)
  const frames = [fileFrame(0x01, [0x00, ...le(data.length, 4), ...fileChecksum(data), ...Array.from(new TextEncoder().encode(path))])]
  const end = data.length - 4
  for (let off = 0; off < end; off += BLOCK) frames.push(fileFrame(0x02, [...le(off, 4), ...data.subarray(off, Math.min(off + BLOCK, end))]))
  frames.push(fileFrame(0x02, [...le(end, 4), ...data.subarray(end)]))
  return frames
}

const isModeEcho = (body: number[]) => body.length === 3 && body[0] === 0x0d
const isFileAck = (body: number[]) => body.length === 7 || body.some((b, i) => b === FILE_SERVICE && body[i + 1] === 0xf0)

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
 * Die Schrift hat dann die Farbe, die der CyberPi gerade hat (einfarbig, nicht immer weiß; Holger: in Ordnung).
 */
export const showLabel = (text: string, size = 24) => pyLines('cyberpi.display.clear()', `cyberpi.display.show_label(${JSON.stringify(text)}, ${size}, 'center')`)

/**
 * Logo nach dem Verbinden (und nach „mBot2 testen“ → Text): „VisuBot“ groß, einfarbig.
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
  private frameWaiters: { match: (body: number[]) => boolean; resolve: () => void }[] = []
  private waiting = new Map<number, { resolve: (v: MBotSensorValue | null) => void; reject: (e: Error) => void }>()
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
  ask(code: string): Promise<MBotSensorValue | null> {
    return this.send(code, ASK, 3000)
  }

  /**
   * Programm auf den CyberPi übertragen (verbindet vorher, wenn nötig). Danach startet der CyberPi neu und
   * das Programm bleibt gespeichert, auch ohne Kabel. `progress` bekommt erledigte und alle Schritte.
   */
  async upload(source: string, progress: (done: number, total: number) => void = () => {}) {
    if (!this.port) await this.connect()
    if (!this.writer) throw new Error(this.error ?? 'nicht verbunden')
    const files = uploadFrames(source)
    const total = 6 + files.length + 3
    let done = 0
    const step = () => progress(++done, total)
    const prepare = async () => {
      await this.sendFrame(frame(UPLOAD_MODE), isModeEcho)
      step()
      for (const code of UPLOAD_PREPARE) {
        await this.send(code, RUN, 3000)
        step()
      }
    }
    await prepare()
    await prepare()
    for (const f of files) {
      await this.sendFrame(f, isFileAck)
      step()
    }
    done = total - 3
    await prepare()
    await this.restart()
  }

  /** Rahmen schicken und auf die passende Antwort warten (bis zu drei Versuche). */
  private sendFrame(data: Uint8Array, match: (body: number[]) => boolean): Promise<void> {
    const next = this.queue.then(async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        if (!this.writer) throw new Error('nicht verbunden')
        let resolve = () => {}
        const answered = new Promise<void>((r) => (resolve = r))
        const waiter = { match, resolve }
        this.frameWaiters.push(waiter)
        await this.writer.write(data)
        const ok = await Promise.race([answered.then(() => true), new Promise<boolean>((r) => setTimeout(() => r(false), 3000))])
        this.frameWaiters = this.frameWaiters.filter((w) => w !== waiter)
        if (ok) return
      }
      throw new Error('keine Antwort')
    })
    this.queue = next.catch(() => undefined)
    return next
  }

  /** Anschluss schließen und wieder öffnen: das setzt den CyberPi zurück, er übernimmt das neue Programm. */
  private async restart() {
    const port = this.port!
    await this.disconnect('restart')
    this.error = undefined
    await new Promise((r) => setTimeout(r, 300))
    await port.open({ baudRate: 115200 })
    await new Promise((r) => setTimeout(r, 500))
    await port.close()
    this.changed()
  }

  private send(code: string, mode: number, timeoutMs: number): Promise<MBotSensorValue | null> {
    // Immer nur eine Zeile unterwegs: der CyberPi arbeitet sie nacheinander ab.
    const next = this.queue.then(
      () =>
        new Promise<MBotSensorValue | null>((resolve, reject) => {
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
          for (const body of readFrames(this.rx)) {
            const f = this.frameWaiters.findIndex((w) => w.match(body))
            if (f >= 0) this.frameWaiters.splice(f, 1)[0].resolve()
            const a = scriptAnswer(body)
            if (!a) continue
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
