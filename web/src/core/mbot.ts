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
