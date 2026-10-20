import { ElementType, type VSDocument, type VSElement } from './model'
import { SimulationEngine, type SimNotice, type SubprogramResolver } from './simulation'

/** Automatische Prüfung einer Übung: Diagramm mit festen Eingaben simulieren und die Ausgabe vergleichen. */

export interface ExerciseTest {
  inputs: string[]
  expected: string[]
}

export interface RunResult {
  outputs: string[]
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
  for (let i = 0; i < maxCheckSteps; i++) {
    const { state } = engine
    if (state.inputRequest) {
      const next = queue.shift()
      if (next === undefined) return { outputs: [...state.outputLines], missingInput: true }
      engine.provideInput(next)
      if (state.inputErrorNotice) return { outputs: [...state.outputLines], error: state.inputErrorNotice }
      continue
    }
    if (state.isHalted) return { outputs: [...state.outputLines], error: state.notice }
    if (!engine.canStep) {
      return { outputs: [...state.outputLines], unusedInputs: queue.length || undefined }
    }
    engine.step()
  }
  return { outputs: [...engine.state.outputLines], tooManySteps: true }
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
    const passed = !result.error && !result.missingInput && !result.tooManySteps && sameOutput(result.outputs, test.expected)
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
