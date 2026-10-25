/**
 * mBot2 (Makeblock, mit CyberPi) im Struktogramm. Befehle stehen als Anweisung `mbot.forward(10)`,
 * Sensoren als Ausdruck `mbot.getDistance()`. Die Simulation merkt sich jeden Befehl als `MBotAction`;
 * mit angeschlossenem Roboter schickt die Oberfläche den Python-Text an den CyberPi.
 */

export interface MBotAction {
  method: string
  args: number[]
  /** Zeile für die Makeblock-Firmware; `undefined`, wenn der Browser selbst wartet (`pause`). */
  python?: string
  /** Wartezeit im Browser in Millisekunden (nur `pause`). */
  waitMs?: number
  /** Kurz für die Konsole, z. B. „10 cm vorwärts“. */
  label: string
}

interface CommandSpec {
  args: number
  /** Werte, wenn die Klammern leer bleiben: `mbot.forward()` fährt einen Schritt (10 cm), `turnRight()` dreht 90°. */
  defaults?: number[]
  python?: (a: number[]) => string
  label: (a: number[]) => string
}

/** Ein Schritt von `mbot.forward()` ohne Zahl. */
export const MBOT_STEP_CM = 10

const n = (v: number) => String(Math.round(v * 100) / 100)

/** Befehle (Anweisungen). Drehen: positiver Winkel bei `mbot2.turn` dreht nach rechts. */
export const MBOT_COMMANDS: Record<string, CommandSpec> = {
  forward: { args: 1, defaults: [MBOT_STEP_CM], python: ([cm]) => `mbot2.straight(${n(cm)})`, label: ([cm]) => `${n(cm)} cm vorwärts` },
  backward: { args: 1, defaults: [MBOT_STEP_CM], python: ([cm]) => `mbot2.straight(${n(-cm)})`, label: ([cm]) => `${n(cm)} cm rückwärts` },
  turnLeft: { args: 1, defaults: [90], python: ([deg]) => `mbot2.turn(${n(-deg)})`, label: ([deg]) => `${n(deg)}° nach links drehen` },
  turnRight: { args: 1, defaults: [90], python: ([deg]) => `mbot2.turn(${n(deg)})`, label: ([deg]) => `${n(deg)}° nach rechts drehen` },
  stop: { args: 0, python: () => `mbot2.EM_stop("ALL")`, label: () => 'anhalten' },
  setLed: { args: 3, python: ([r, g, b]) => `cyberpi.led.on(${n(r)}, ${n(g)}, ${n(b)})`, label: ([r, g, b]) => `LEDs (${n(r)}, ${n(g)}, ${n(b)})` },
  ledOff: { args: 0, python: () => 'cyberpi.led.off()', label: () => 'LEDs aus' },
  playTone: { args: 2, python: ([hz, ms]) => `cyberpi.audio.play_tone(${n(hz)}, ${n(ms / 1000)})`, label: ([hz, ms]) => `Ton ${n(hz)} Hz, ${n(ms)} ms` },
  pause: { args: 1, label: ([ms]) => `${n(ms)} ms warten` },
}

interface SensorSpec {
  python: string
  /** Wert in der Simulation ohne Roboter */
  simulated: number
}

/** Sensoren (Ausdrücke ohne Argumente). */
export const MBOT_SENSORS: Record<string, SensorSpec> = {
  getDistance: { python: 'mbuild.ultrasonic2.get(1)', simulated: 100 },
  getLine: { python: "mbuild.quad_rgb_sensor.get_line_sta('all', 1)", simulated: 0 },
  getBrightness: { python: 'cyberpi.get_bri()', simulated: 50 },
  getLoudness: { python: 'cyberpi.get_loudness()', simulated: 0 },
}

/** `mbot.forward(10)` → Name und Argumenttexte; `undefined`, wenn es kein mBot-Befehl ist. */
export function parseMBotCommand(text: string): { method: string; args: string[] } | undefined {
  const m = /^mbot\s*\.\s*([A-Za-z_]\w*)\s*\(([\s\S]*)\)\s*;?$/u.exec(text.trim())
  if (!m) return undefined
  const inner = m[2].trim()
  return { method: m[1], args: inner === '' ? [] : splitArgs(inner) }
}

/** Argumente prüfen und leere Klammern mit den Standardwerten füllen; `undefined` bei falscher Anzahl. */
export function mbotArguments(method: string, args: number[]): number[] | undefined {
  const spec = MBOT_COMMANDS[method]
  if (!spec) return undefined
  if (args.length === spec.args) return args
  if (args.length === 0 && spec.defaults) return spec.defaults
  return undefined
}

export function makeMBotAction(method: string, args: number[]): MBotAction {
  const spec = MBOT_COMMANDS[method]
  return {
    method,
    args,
    python: spec.python?.(args),
    waitMs: method === 'pause' ? Math.max(0, args[0]) : undefined,
    label: spec.label(args),
  }
}

/** Ersetzt `mbot.getDistance()` usw. durch Zahlen, damit der Rechner sie wie Literale liest. */
export function substituteMBotSensors(expression: string, read: (name: string) => number): string {
  if (!expression.includes('mbot')) return expression
  return expression.replace(/\bmbot\s*\.\s*([A-Za-z_]\w*)\s*\(\s*\)/gu, (all, name: string) => {
    return name in MBOT_SENSORS ? String(read(name)) : all
  })
}

/** Argumente an Kommas auf oberster Ebene trennen (nicht in Klammern oder Texten). */
function splitArgs(text: string): string[] {
  const parts: string[] = []
  let depth = 0
  let quote = false
  let start = 0
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quote) {
      if (c === '\\') i++
      else if (c === '"') quote = false
    } else if (c === '"') quote = true
    else if (c === '(' || c === '[') depth++
    else if (c === ')' || c === ']') depth--
    else if (c === ',' && depth === 0) {
      parts.push(text.slice(start, i).trim())
      start = i + 1
    }
  }
  parts.push(text.slice(start).trim())
  return parts
}

/**
 * Gefahrene Strecke als Liste wie `forward 50`, `turnRight 90`: aufeinanderfolgende Fahrten bzw. Drehungen
 * zusammengefasst, LEDs und Töne zählen nicht. So ist `5 × forward()` dasselbe wie `forward(50)`.
 */
export function driveSignature(actions: { method: string; args: number[] }[]): string[] {
  const out: { kind: 'drive' | 'turn'; value: number }[] = []
  for (const a of actions) {
    const value = { forward: a.args[0], backward: -a.args[0], turnRight: a.args[0], turnLeft: -a.args[0] }[a.method]
    if (value === undefined) continue
    const kind = a.method === 'forward' || a.method === 'backward' ? 'drive' : 'turn'
    const last = out[out.length - 1]
    if (last && last.kind === kind) last.value += value
    else out.push({ kind, value })
  }
  return out.flatMap(({ kind, value }) => {
    const v = kind === 'turn' ? ((((value + 180) % 360) + 360) % 360) - 180 : value
    if (Math.abs(v) < 1e-6) return []
    const r = Math.round(Math.abs(v) * 100) / 100
    if (kind === 'drive') return [`${v > 0 ? 'forward' : 'backward'} ${r}`]
    return [v === -180 ? 'turnRight 180' : `${v > 0 ? 'turnRight' : 'turnLeft'} ${r}`]
  })
}

/**
 * Erwartete Fahrt einer Übung, z. B. `fahrt: 4 x (forward 50, turnRight 90)`. Teile durch Kommas getrennt,
 * `n x (…)` wiederholt; ohne Zahl gelten die Werte von `mbot.forward()` bzw. `turnRight()`.
 */
export function parseDriveSpec(spec: string): { method: string; args: number[] }[] {
  let i = 0
  const src = spec.trim()
  const list = (): { method: string; args: number[] }[] => {
    const items: { method: string; args: number[] }[] = []
    for (;;) {
      while (src[i] === ' ' || src[i] === ',') i++
      if (i >= src.length || src[i] === ')') return items
      const rep = /^(\d+)\s*[x×]\s*\(/u.exec(src.slice(i))
      if (rep) {
        i += rep[0].length
        const inner = list()
        if (src[i] !== ')') throw new Error(`„)“ fehlt in „${spec}“`)
        i++
        for (let k = 0; k < Number(rep[1]); k++) items.push(...inner)
        continue
      }
      const step = /^([A-Za-z]+)(?:\s+(-?\d+(?:\.\d+)?))?/u.exec(src.slice(i))
      if (!step) throw new Error(`Unbekannt in „${spec}“: ${src.slice(i)}`)
      i += step[0].length
      const args = mbotArguments(step[1], step[2] === undefined ? [] : [Number(step[2])])
      if (!args) throw new Error(`Unbekannter Befehl in „${spec}“: ${step[1]}`)
      items.push({ method: step[1], args })
    }
  }
  const items = list()
  if (i < src.length) throw new Error(`Zu viele „)“ in „${spec}“`)
  return items
}

/** Fahrt kurz zum Anzeigen: Wiederholungen als `4 x (forward 50, turnRight 90)`, auch verschachtelt. */
export function compressDrive(drive: string[]): string {
  const n = drive.length
  for (let unit = 1; unit <= n / 2; unit++) {
    if (n % unit !== 0) continue
    const times = n / unit
    if (drive.every((s, i) => s === drive[i % unit])) {
      const inner = compressDrive(drive.slice(0, unit))
      return `${times} x ${unit === 1 ? inner : `(${inner})`}`
    }
  }
  return drive.join(', ')
}

/**
 * Teile des mBot2 im 3D-Modell, z. B. für `fokus:` im Lektionsblock `::: mbot2` und `[Wort]{teil=cyberpi}` im Text.
 * Die ersten acht gehören zum CyberPi; `cyberpi` allein ist sein Gehäuse.
 */
export const MBOT_PARTS = [
  'cyberpi',
  'screen',
  'joystick',
  'buttons',
  'leds',
  'lightSensor',
  'microphone',
  'shield',
  'powerSwitch',
  'motors',
  'wheels',
  'ultrasonic',
  'lineSensor',
  'caster',
  'chassis',
] as const

export type MBotPart = (typeof MBOT_PARTS)[number]

export const isMBotPart = (name: string): name is MBotPart => (MBOT_PARTS as readonly string[]).includes(name)
