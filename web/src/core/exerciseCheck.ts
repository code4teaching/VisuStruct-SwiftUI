import { ElementType, type VSDocument, type VSElement } from './model'
import { driveSignature } from './mbot'
import { RobotWorld } from './robotWorld'
import { SimulationEngine, type SimNotice, type SubprogramResolver } from './simulation'

/** Automatische Prüfung einer Übung: Diagramm mit festen Eingaben simulieren und die Ausgabe vergleichen. */

export interface ExerciseTest {
  inputs: string[]
  expected: string[]
  /** Dateien, die das Programm speichern soll, mit ihren Zeilen. */
  files?: { name: string; lines: string[] }[]
  /** VisuBot: erwartete Fahrt (`driveSignature`), z. B. `['forward 50', 'turnRight 90']`. */
  drive?: string[]
}

export interface RunResult {
  outputs: string[]
  /** Gespeicherte Dateien (Name → Inhalt). */
  files?: Map<string, string>
  /** VisuBot: tatsächliche Fahrt (`driveSignature`). */
  drive?: string[]
  /** Fehler der Simulation (z. B. unbekannte Variable). */
  error?: SimNotice
  /** Das Diagramm wollte mehr Eingaben, als der Test hat. */
  missingInput?: boolean
  /** Eingaben blieben übrig. */
  unusedInputs?: number
  /** Abbruch nach zu vielen Schritten (vermutlich Endlosschleife). */
  tooManySteps?: boolean
}

export const maxCheckSteps = 100_000

export function runWithInputs(doc: VSDocument, inputs: string[], subprograms?: SubprogramResolver): RunResult {
  const engine = new SimulationEngine(doc, subprograms)
  const queue = [...inputs]
  // Sensoren wie im Simulator: die Welt fährt mit, damit `mbot.getDistance()` passende Werte liefert.
  const world = new RobotWorld()
  let applied = 0
  for (let i = 0; i < maxCheckSteps; i++) {
    const { state } = engine
    for (; applied < state.robotActions.length; applied++) world.apply(state.robotActions[applied])
    engine.robotSensors = world.sensors()
    const done = () => ({
      outputs: [...state.outputLines],
      files: new Map(state.files),
      drive: state.robotActions.length ? driveSignature(state.robotActions) : undefined,
    })
    if (state.inputRequest) {
      const next = queue.shift()
      if (next === undefined) return { ...done(), missingInput: true }
      engine.provideInput(next)
      if (state.inputErrorNotice) return { ...done(), error: state.inputErrorNotice }
      continue
    }
    if (state.isHalted) return { ...done(), error: state.notice }
    if (!engine.canStep) {
      return { ...done(), unusedInputs: queue.length || undefined }
    }
    engine.step()
  }
  return { outputs: [...engine.state.outputLines], files: new Map(engine.state.files), drive: driveSignature(engine.state.robotActions), tooManySteps: true }
}

/** Zeilen einer gespeicherten Datei; der Zeilenumbruch am Ende beginnt keine neue Zeile. Fehlt die Datei: keine Zeilen. */
export function fileLines(content: string | undefined): string[] {
  return content === undefined || content === '' ? [] : content.replace(/\n$/, '').split('\n')
}

/** Gleiche Ausgabe: Zeile für Zeile, Leerraum am Rand egal, `1.0` gleich `1`. */
export function sameOutput(actual: string[], expected: string[]): boolean {
  if (actual.length !== expected.length) return false
  return actual.every((line, i) => normalize(line) === normalize(expected[i]))
}

function normalize(line: string): string {
  const t = line.trim().replace(/\s+/g, ' ')
  return /^-?\d+\.0+$/.test(t) ? t.replace(/\.0+$/, '') : t
}

export interface TestOutcome {
  test: ExerciseTest
  result: RunResult
  passed: boolean
}

/** `subprograms` findet Unterprogramme für Aufrufe, z. B. in anderen Reitern. */
export function checkExercise(doc: VSDocument, tests: ExerciseTest[], subprograms?: SubprogramResolver): TestOutcome[] {
  return tests.map((test) => {
    const result = runWithInputs(doc, test.inputs, subprograms)
    const filesRight = (test.files ?? []).every((f) => sameOutput(fileLines(result.files?.get(f.name)), f.lines))
    const driveRight = !test.drive || sameOutput(result.drive ?? [], test.drive)
    const passed =
      !result.error && !result.missingInput && !result.tooManySteps && sameOutput(result.outputs, test.expected) && filesRight && driveRight
    return { test, result, passed }
  })
}

/** Welche Elementarten im Diagramm vorkommen (für „braucht: verzweigung“). */
export function usedElementTypes(doc: VSDocument): Set<ElementType> {
  const found = new Set<ElementType>()
  const visit = (els: VSElement[]) => {
    for (const e of els) {
      found.add(e.type)
      if (e.loopBody) visit(e.loopBody)
      for (const c of e.cases ?? []) visit(c.elements)
    }
  }
  visit(doc.elements)
  return found
}

/** Wie tief Schleifen höchstens ineinander stecken (für „schleifentiefe: 2“). */
export function loopDepth(elements: VSElement[]): number {
  const loops = [ElementType.forSchleife, ElementType.whileSchleife, ElementType.doUntilSchleife, ElementType.endlosschleife]
  let best = 0
  for (const e of elements) {
    const inner = Math.max(loopDepth(e.loopBody ?? []), ...(e.cases ?? []).map((c) => loopDepth(c.elements)))
    best = Math.max(best, inner + (loops.includes(e.type) ? 1 : 0))
  }
  return best
}
