/**
 * Spiel „Wo landet der mBot2?“ (Block `::: spiel fahrt`): Jede Runde zeigt Java-Code für den mBot2 und eine kleine
 * Karte. Man tippt auf das Feld, auf dem der mBot2 am Ende steht; danach fährt er die Strecke vor.
 *
 * Format (Schlüsselwörter auf Deutsch, auch in den Übersetzungen):
 *
 *     titel: Spiel: Wo landet der mBot2?
 *     intro: …
 *     frage: Tippe auf das Feld, auf dem der mBot2 am Ende steht.   (für alle Runden, je Runde überschreibbar)
 *     feld: 30                                                     (Zentimeter je Feld, 10, 20 oder 30; Standard 30)
 *
 *     runde:
 *         mbot.forward(60);                 Code, mit vier Leerzeichen eingerückt
 *     karte: ..... | ..... | ..^..          Zeilen von hinten nach vorn, Zeichen wie in den Weltkarten
 *     ziel: 2,0                             Spalte,Zeile ab 0, wo er am Ende steht (der Test rechnet nach)
 *     > Erklärung
 *
 * Kartenzeichen: `.` Boden, `#` Wand, `=` schwarzes Feld, `r g b y` farbige Felder, `^ > v <` Start mit Blickrichtung.
 */

import { parseWorldMap, type Pose, type RobotWorldSetup } from '../core/robotWorld'
import { previewRun, type PreviewResult } from '../core/robotPreview'
import { parseLiveJava } from '../core/javaParser'
import { documentFromJava } from '../core/liveSource'
import type { LiveLabels } from '../core/codeGenerator'

export interface DriveRound {
  code: string
  /** Kartenzeilen, oben ist hinten. */
  map: string[]
  /** Spalte und Zeile (ab 0) des Zielfelds. */
  target: { col: number; row: number }
  question: string
  explanation: string
}

export interface DriveGame {
  title: string
  intro: string
  /** Zentimeter je Feld. */
  field: number
  rounds: DriveRound[]
}

export class DriveGameError extends Error {}

export function parseDriveGame(lines: string[], file: string): DriveGame {
  const fail = (msg: string): never => {
    throw new DriveGameError(`${file}: ${msg}`)
  }
  let title = ''
  let intro = ''
  let question = ''
  let field = 30
  const rounds: (Omit<DriveRound, 'target'> & { target?: DriveRound['target'] })[] = []
  let current: (typeof rounds)[number] | undefined
  let inCode = false
  for (const raw of lines) {
    const line = raw.trim()
    if (current && inCode && (/^ {4}|^\t/.test(raw) || line === '')) {
      current.code += (current.code ? '\n' : '') + raw.replace(/^( {4}|\t)/, '')
      continue
    }
    inCode = false
    if (!line) continue
    const key = /^(titel|intro|frage|feld|runde|karte|ziel):\s*(.*)$/.exec(line)
    if (key) {
      const [, name, value] = key
      if (name === 'runde') {
        current = { code: '', map: [], question, explanation: '' }
        rounds.push(current)
        inCode = true
      } else if (!current) {
        if (name === 'titel') title = value
        else if (name === 'intro') intro = value
        else if (name === 'frage') question = value
        else if (name === 'feld') field = [10, 20, 30].includes(Number(value)) ? Number(value) : fail('„feld:“ ist 10, 20 oder 30 (Zentimeter).')
        else fail(`„${name}:“ gehört in eine Runde.`)
      } else if (name === 'frage') current.question = value
      else if (name === 'karte') current.map = value.split('|').map((r) => r.trim())
      else if (name === 'ziel') {
        const m = /^(\d+)\s*,\s*(\d+)$/.exec(value)
        if (!m) fail(`„ziel: ${value}“ muss Spalte,Zeile sein, zum Beispiel „ziel: 2,0“.`)
        current.target = { col: Number(m![1]), row: Number(m![2]) }
      } else fail(`„${name}:“ gehört vor die erste Runde.`)
      continue
    }
    if (current && line.startsWith('>')) current.explanation += (current.explanation ? ' ' : '') + line.slice(1).trim()
    else fail(`Unbekannte Zeile im Spiel: „${line}“`)
  }
  if (!title) fail('Das Spiel braucht eine Zeile „titel:“.')
  if (!rounds.length) fail('Das Spiel braucht mindestens eine „runde:“.')
  rounds.forEach((round, i) => {
    round.code = round.code.replace(/\n+$/, '')
    if (!round.code.trim()) fail(`Runde ${i + 1}: Code fehlt.`)
    if (!round.map.length || round.map.some((r) => r.length !== round.map[0].length)) fail(`Runde ${i + 1}: „karte:“ fehlt oder die Zeilen sind verschieden lang.`)
    if (round.map.join('').replace(/[^\^><v]/g, '').length !== 1) fail(`Runde ${i + 1}: Die Karte braucht genau einen Start (^ > v <).`)
    if (/[^.#=rgby^><v]/.test(round.map.join(''))) fail(`Runde ${i + 1}: Unbekanntes Zeichen in der Karte.`)
    if (!round.target) fail(`Runde ${i + 1}: „ziel:“ fehlt.`)
    if (round.target!.row >= round.map.length || round.target!.col >= round.map[0].length) fail(`Runde ${i + 1}: „ziel:“ liegt außerhalb der Karte.`)
    if (!round.question) fail(`Runde ${i + 1}: keine Frage.`)
  })
  return { title, intro, field, rounds: rounds as DriveRound[] }
}

/** Die Welt einer Runde: jedes Kartenzeichen ist ein Feld von `field` cm. */
export function driveWorld(round: DriveRound, field: number): RobotWorldSetup {
  return parseWorldMap([`raster: ${field / 10}`, ...round.map].join('\n'))
}

/** Feld (Spalte, Zeile) unter einer Lage, oder undefined außerhalb der Karte. */
export function cellOf(pose: Pose, round: DriveRound, field: number): { col: number; row: number } | undefined {
  const width = round.map[0].length * field
  const depth = round.map.length * field
  const col = Math.floor((pose.x + width / 2) / field)
  const row = Math.floor((depth / 2 - pose.y) / field)
  if (col < 0 || row < 0 || col >= round.map[0].length || row >= round.map.length) return undefined
  return { col, row }
}

const labels: LiveLabels = { condition: 'Bedingung', selector: 'Wert', code: 'Dein Code', start: 'Startwert', step: 'Schritt', end: 'Ende' }

export interface DriveResult {
  run: PreviewResult
  end: Pose
  cell?: { col: number; row: number }
  problems: string[]
}

/** Den Code der Runde in der Welt durchfahren, wie die Vorschau im Editor. */
export function driveRound(round: DriveRound, field: number): DriveResult {
  const parsed = parseLiveJava(round.code, labels)
  const problems = parsed.problems.map((p) => (typeof p === 'string' ? p : JSON.stringify(p)))
  const doc = documentFromJava({ caption: '', elements: [] }, parsed)
  const run = previewRun(doc, undefined, driveWorld(round, field))
  const end = run.frames[run.frames.length - 1].pose
  return { run, end, cell: cellOf(end, round, field), problems }
}
