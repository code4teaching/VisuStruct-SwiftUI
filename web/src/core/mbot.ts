import { showLabel } from './mbotLink'

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
  /** Text für den Bildschirm (`showText`). */
  text?: string
}

interface CommandSpec {
  args: number
  /** Werte, wenn die Klammern leer bleiben: `mbot.forward()` fährt einen Schritt (10 cm), `turnRight()` dreht 90°. */
  defaults?: number[]
  python?: (a: number[], text: string) => string
  label: (a: number[], text: string) => string
  /** Das letzte Argument ist ein Text, z. B. `mbot.showText("Hallo")`; `args` zählt nur die Zahlen davor. */
  text?: boolean
  /** Erlaubte Texte (sonst ist der Befehl ungültig). */
  choices?: readonly string[]
  /** Sind die Zahlen erlaubt? (z. B. LED-Nummer 1–5) */
  valid?: (a: number[]) => boolean
}

/** Der CyberPi hat fünf LEDs; in Java zählen sie wie Arrays ab 0 (`mbot.led(0)` bis `mbot.led(4)`), die Firmware ab 1. */
export const MBOT_LED_COUNT = 5
const ledNumber = (nr: number) => Number.isInteger(nr) && nr >= 0 && nr < MBOT_LED_COUNT

/** Farben für `mbot.led(i).setColor("grün")`, deutsch und englisch; „aus“ schaltet die LED aus. */
export const MBOT_LED_COLORS: Record<string, [number, number, number]> = {
  rot: [255, 0, 0], red: [255, 0, 0],
  orange: [255, 100, 0],
  gelb: [255, 200, 0], yellow: [255, 200, 0],
  grün: [0, 255, 0], green: [0, 255, 0],
  türkis: [0, 200, 200], cyan: [0, 200, 200],
  blau: [0, 0, 255], blue: [0, 0, 255],
  lila: [160, 0, 255], purple: [160, 0, 255],
  pink: [255, 0, 120],
  weiß: [255, 255, 255], white: [255, 255, 255],
  aus: [0, 0, 0], off: [0, 0, 0],
}

/**
 * Vorführungen der Firmware (`cyberpi.emotion.*`): LEDs, Ton und kleine Bewegungen, am echten mBot2 getestet mit `smile`.
 * `sprint` fehlt absichtlich, weil der Roboter dabei losfährt.
 */
export const MBOT_EMOTIONS = ['smile', 'hello', 'yeah', 'proud', 'wow', 'yummy', 'naughty', 'uh_oh', 'hurt', 'sad', 'angry', 'startle', 'shiver', 'dizzy', 'sleepy', 'zzz', 'wake_up', 'blink', 'yes', 'no', 'look_up', 'look_down', 'look_left', 'look_right', 'look_around'] as const

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
  /**
   * Räder einzeln, Leistung in Prozent (−100 … 100); er fährt weiter, bis ein anderer Fahrbefehl oder `stop()` kommt.
   * Der rechte Motor ist am mBot2 gespiegelt eingebaut, deshalb das Minus.
   */
  drive: { args: 2, python: ([l, r]) => `mbot2.drive_power(${n(l)}, ${n(-r)})`, label: ([l, r]) => `Räder links ${n(l)} %, rechts ${n(r)} %` },
  setLed: { args: 3, python: ([r, g, b]) => `cyberpi.led.on(${n(r)}, ${n(g)}, ${n(b)})`, label: ([r, g, b]) => `LEDs (${n(r)}, ${n(g)}, ${n(b)})` },
  ledOff: { args: 0, python: () => 'cyberpi.led.off()', label: () => 'LEDs aus' },
  /** `mbot.led(i).setColor("grün")`: eine LED (0–4); aus ist `on(0, 0, 0)`. */
  ledColor: {
    args: 1,
    text: true,
    choices: Object.keys(MBOT_LED_COLORS),
    valid: ([nr]) => ledNumber(nr),
    python: ([nr], color) => `cyberpi.led.on(${MBOT_LED_COLORS[color].join(', ')}, id=${nr + 1})`,
    label: ([nr], color) => `LED ${nr}: ${color}`,
  },
  playTone: { args: 2, python: ([hz, ms]) => `cyberpi.audio.play_tone(${n(hz)}, ${n(ms / 1000)})`, label: ([hz, ms]) => `Ton ${n(hz)} Hz, ${n(ms)} ms` },
  pause: { args: 1, label: ([ms]) => `${n(ms)} ms warten` },
  resetTimer: { args: 0, python: () => 'cyberpi.timer.reset()', label: () => 'Stoppuhr auf 0' },
  emotion: { args: 0, text: true, choices: MBOT_EMOTIONS, python: (_, name) => `cyberpi.emotion.${name}()`, label: (_, name) => `Gefühl: ${name}` },
  showText: { args: 0, text: true, python: (_, text) => showLabel(text), label: (_, text) => `Bildschirm: ${text}` },
}

/** Messwert eines Sensors: Zahl, wahr/falsch oder Text (Farbname bei `getColor()`). */
export type MBotSensorValue = number | boolean | string

interface SensorSpec {
  python: string
  /** Wert in der Simulation, wenn weder Welt noch Regler ihn liefern */
  simulated: MBotSensorValue
}

/** Farben, die der Quad-RGB-Sensor im Simulator erkennt (Felder `r g b y` in einer Weltkarte). */
export const MBOT_COLORS = ['red', 'green', 'blue', 'yellow'] as const
export type MBotColor = (typeof MBOT_COLORS)[number]

/** Farbnamen von `mbot.getColor()`: wie bei `setColor`, Deutsch oder Englisch je nach Sprache der Lektionen. */
const COLOR_NAMES: Record<string, { de: string; en: string }> = {
  red: { de: 'rot', en: 'red' },
  green: { de: 'grün', en: 'green' },
  blue: { de: 'blau', en: 'blue' },
  yellow: { de: 'gelb', en: 'yellow' },
  cyan: { de: 'türkis', en: 'cyan' },
  purple: { de: 'lila', en: 'purple' },
  white: { de: 'weiß', en: 'white' },
  black: { de: 'schwarz', en: 'black' },
}
let colorLanguage: 'de' | 'en' = 'en'

/** Sprache der Farbnamen, die `mbot.getColor()` liefert (Deutsch nur bei deutschen Lektionen). */
export function setMBotColorLanguage(language: string) {
  colorLanguage = language === 'de' ? 'de' : 'en'
}

export const mbotColorLanguage = () => colorLanguage

/** `red`, `rot` oder eine Antwort des echten Sensors → Farbname in der aktuellen Sprache. */
export function mbotColorName(color: string): string {
  const key = color.trim().toLowerCase()
  const entry = COLOR_NAMES[key] ?? Object.values(COLOR_NAMES).find((e) => e.de === key)
  return entry ? entry[colorLanguage] : key
}
const press = (key: string): SensorSpec => ({ python: `cyberpi.controller.is_press('${key}')`, simulated: false })

/**
 * Sensoren (Ausdrücke ohne Argumente): Zahlen oder Wahrheitswerte.
 * Der Python-Text liest den Wert am echten mBot2 (Modus 1, Antwort `{"ret":…}`).
 */
export const MBOT_SENSORS: Record<string, SensorSpec> = {
  getDistance: { python: 'mbuild.ultrasonic2.get(1)', simulated: 100 },
  getLine: { python: "mbuild.quad_rgb_sensor.get_line_sta('all', 1)", simulated: 0 },
  // die beiden mittleren Fühler (L1, R1) des Liniensensors
  isLineLeft: { python: "mbuild.quad_rgb_sensor.is_line('L1', 1)", simulated: false },
  isLineRight: { python: "mbuild.quad_rgb_sensor.is_line('R1', 1)", simulated: false },
  /** Farbe unter dem mBot2 als Text: `mbot.getColor().equals("rot")` */
  getColor: { python: "mbuild.quad_rgb_sensor.get_color_sta('L1', 1)", simulated: 'white' },
  isButtonA: press('a'),
  isButtonB: press('b'),
  isJoystickUp: press('up'),
  isJoystickDown: press('down'),
  isJoystickLeft: press('left'),
  isJoystickRight: press('right'),
  getBrightness: { python: 'cyberpi.get_bri()', simulated: 50 },
  getLoudness: { python: "cyberpi.get_loudness('maximum')", simulated: 0 },
  getPitch: { python: 'cyberpi.get_pitch()', simulated: 0 },
  getRoll: { python: 'cyberpi.get_roll()', simulated: 0 },
  isShaken: { python: 'cyberpi.is_shake()', simulated: false },
  getBattery: { python: 'cyberpi.get_battery()', simulated: 100 },
  /** Sekunden seit dem Start bzw. seit `resetTimer()` */
  getTimer: { python: 'cyberpi.timer.get()', simulated: 0 },
}

/** Messwerte des Roboters nach Namen (`getDistance` → 38, `isButtonA` → true). */
export type MBotSensorValues = Partial<Record<string, MBotSensorValue>>

/** Welche Sensoren kommen in diesem Text vor (z. B. im ganzen Diagramm)? */
export function usedMBotSensors(text: string): string[] {
  const found = new Set<string>()
  for (const m of text.matchAll(/\bmbot\s*\.\s*([A-Za-z_]\w*)\s*\(\s*\)/gu)) if (m[1] in MBOT_SENSORS) found.add(m[1])
  return [...found]
}

/** `mbot.forward(10)` → Name und Argumenttexte; `undefined`, wenn es kein mBot-Befehl ist. */
export function parseMBotCommand(text: string): { method: string; args: string[] } | undefined {
  // `mbot.led(i).setColor("grün")` wird zu `ledColor(i, "grün")`
  const led = /^mbot\s*\.\s*led\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)\s*\.\s*setColor\s*\(([\s\S]*)\)\s*;?$/u.exec(text.trim())
  if (led) return { method: 'ledColor', args: [led[1].trim(), led[2].trim()] }
  const m = /^mbot\s*\.\s*([A-Za-z_]\w*)\s*\(([\s\S]*)\)\s*;?$/u.exec(text.trim())
  if (!m) return undefined
  const inner = m[2].trim()
  return { method: m[1], args: inner === '' ? [] : splitArgs(inner) }
}

/** Argumente prüfen und leere Klammern mit den Standardwerten füllen; `undefined` bei falscher Anzahl. */
export function mbotArguments(method: string, args: number[]): number[] | undefined {
  const spec = MBOT_COMMANDS[method]
  if (!spec) return undefined
  const values = args.length === 0 && spec.defaults ? spec.defaults : args
  if (values.length !== spec.args) return undefined
  return !spec.valid || spec.valid(values) ? values : undefined
}

export function makeMBotAction(method: string, args: number[], text = ''): MBotAction {
  const spec = MBOT_COMMANDS[method]
  return {
    method,
    args,
    python: spec.python?.(args, text),
    waitMs: method === 'pause' ? Math.max(0, args[0]) : undefined,
    label: spec.label(args, text),
    ...(spec.text ? { text } : {}),
  }
}

/**
 * Alle Befehle als Liste wie `setLed 255 0 0`, `pause 500`, `showText "Hallo"` (zum Prüfen von LEDs, Tönen und Bildschirm).
 * Anders als `driveSignature` wird nichts zusammengefasst.
 */
export function actionSignature(actions: { method: string; args: number[]; text?: string }[]): string[] {
  return actions.map((a) => [a.method, ...a.args.map(n), ...(a.text !== undefined ? [JSON.stringify(a.text)] : [])].join(' '))
}

/** Erwartete Befehle einer Übung, z. B. `befehle: 3 x (setLed 255 0 0, pause 500, ledOff, pause 500)`; Texte in Anführungszeichen. */
export function parseActionSpec(spec: string): string[] {
  let i = 0
  const src = spec.trim()
  const list = (): string[] => {
    const items: string[] = []
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
      const step = /^([A-Za-z]+)((?:\s+-?\d+(?:\.\d+)?)*)(?:\s+("(?:[^"\\]|\\.)*"))?/u.exec(src.slice(i))
      if (!step) throw new Error(`Unbekannt in „${spec}“: ${src.slice(i)}`)
      i += step[0].length
      const spec_ = MBOT_COMMANDS[step[1]]
      if (!spec_) throw new Error(`Unbekannter Befehl in „${spec}“: ${step[1]}`)
      const nums = step[2].trim() === '' ? [] : step[2].trim().split(/\s+/).map(Number)
      const args = mbotArguments(step[1], nums)
      if (!args) throw new Error(`Falsche Anzahl Zahlen in „${spec}“: ${step[1]}`)
      items.push(actionSignature([{ method: step[1], args, text: spec_.text ? JSON.parse(step[3] ?? '""') : undefined }])[0])
    }
  }
  const items = list()
  if (i < src.length) throw new Error(`Zu viele „)“ in „${spec}“`)
  return items
}

/** Ersetzt `mbot.getDistance()` usw. durch Zahlen, damit der Rechner sie wie Literale liest. */
export function substituteMBotSensors(expression: string, read: (name: string) => MBotSensorValue): string {
  if (!expression.includes('mbot')) return expression
  return expression.replace(/\bmbot\s*\.\s*([A-Za-z_]\w*)\s*\(\s*\)/gu, (all, name: string) => {
    if (!(name in MBOT_SENSORS)) return all
    const value = read(name)
    return typeof value === 'string' ? JSON.stringify(name === 'getColor' ? mbotColorName(value) : value) : String(value)
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
