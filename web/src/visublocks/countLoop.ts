/**
 * VisuBlocks: Zählschleife für Kinder.
 * VisuBlocks wird entwickelt von Christian Klein und Holger Sebastiao (MIT-Lizenz).
 *
 * Der Block zeigt „zähle mit i von [0] bis unter [10] in Schritten von [1]“; eingetippt werden nur Zahlen
 * (das Ende darf auch ein Sensor sein). Daraus entsteht der Java-Kopf `for (int i = 0; i < 10; i++)`.
 * Die Regel kennt kein DOM und kein Struktogramm, damit VisuBot und VisuMicro sie gleich nutzen können.
 */

export type CountOp = '<' | '<=' | '>' | '>='

export interface CountLoop {
  /** Zählvariable (`i`) */
  v: string
  /** Startwert, ganze Zahl */
  start: string
  op: CountOp
  /** Ende: ganze Zahl oder Sensor (`mbot.getDistance()`) */
  end: string
  /** Schrittweite, immer positiv; die Richtung steckt in `op` */
  step: string
}

/** Felder des Blocks in dieser Reihenfolge (Index wie beim Ändern per Klick) */
export const countLoopFields = ['start', 'end', 'step'] as const

/** Neue Zählschleife: von 0 bis unter 10 in Schritten von 1 */
export const defaultCountLoop = (v = 'i'): CountLoop => ({ v, start: '0', op: '<', end: '10', step: '1' })

/** Zählvariable nach Schachtelung: i, j, k, m, n */
export const countVar = (depth: number) => 'ijkmn'[depth] ?? `i${depth}`

const name = String.raw`[A-Za-z_]\w*`
const int = String.raw`-?\d+`

/**
 * Drei Teile des `for`-Kopfs (oder eine Zeile `a; b; c`) lesen. Leere Schleife → Standard.
 * `undefined`, wenn der Kopf keine einfache Zählschleife ist (dann bleibt er Text).
 */
export function readCountLoop(lines: string[], v = 'i'): CountLoop | undefined {
  const parts = (lines.length === 1 ? lines[0].split(';') : lines).map((l) => l.trim())
  if (parts.every((p) => p === '')) return defaultCountLoop(v)
  if (parts.length !== 3) return undefined
  const [init, cond, step] = parts
  const i = init.match(new RegExp(`^(?:int\\s+)?(${name})\\s*=\\s*(${int})$`))
  if (!i) return undefined
  const c = cond.match(new RegExp(`^(${name})\\s*(<=|>=|<|>)\\s*(${int}|mbot\\.\\w+\\(\\))$`))
  if (!c || c[1] !== i[1]) return undefined
  const op = c[2] as CountOp
  const up = op === '<' || op === '<='
  const s = readStep(step, i[1])
  if (!s || s.up !== up) return undefined
  return { v: i[1], start: i[2], op, end: c[3], step: s.by }
}

function readStep(step: string, v: string): { up: boolean; by: string } | undefined {
  const t = step.replace(/\s+/g, '')
  if (t === `${v}++` || t === `++${v}`) return { up: true, by: '1' }
  if (t === `${v}--` || t === `--${v}`) return { up: false, by: '1' }
  const m = t.match(new RegExp(`^${v}(?:([+-])=|=${v}([+-]))(\\d+)$`))
  if (!m || Number(m[3]) <= 0) return undefined
  return { up: (m[1] ?? m[2]) === '+', by: m[3] }
}

/** Zählschleife → drei Teile des Java-Kopfs (`int i = 0`, `i < 10`, `i++`) */
export function countLoopLines(c: CountLoop): string[] {
  const up = c.op === '<' || c.op === '<='
  const step = c.step === '1' ? `${c.v}${up ? '++' : '--'}` : `${c.v} ${up ? '+=' : '-='} ${c.step}`
  return [`int ${c.v} = ${c.start}`, `${c.v} ${c.op} ${c.end}`, step]
}

/**
 * Feld Nummer `index` (0 Start, 1 Ende, 2 Schritt) auf `text` setzen. Start und Ende sind ganze Zahlen
 * (das Ende auch ein Sensor), der Schritt eine positive ganze Zahl; sonst `undefined`.
 */
export function setCountField(c: CountLoop, index: number, text: string): CountLoop | undefined {
  const t = text.trim()
  switch (countLoopFields[index]) {
    case 'start':
      return new RegExp(`^${int}$`).test(t) ? { ...c, start: String(Number(t)) } : undefined
    case 'end':
      if (/^mbot\.\w+\(\)$/.test(t)) return { ...c, end: t }
      return new RegExp(`^${int}$`).test(t) ? { ...c, end: String(Number(t)) } : undefined
    case 'step':
      return /^\d+$/.test(t) && Number(t) > 0 ? { ...c, step: String(Number(t)) } : undefined
  }
  return undefined
}
