import { ElementType, type VSDocument, type VSElement } from './model'
import { actionSignature, driveSignature } from './mbot'
import { ROBOT_STEP_MS, RobotWorld, type RobotWorldSetup } from './robotWorld'
import { SimulationEngine, type SimNotice, type SubprogramResolver } from './simulation'

/** Automatische Prüfung einer Übung: Diagramm mit festen Eingaben simulieren und die Ausgabe vergleichen. */

export interface ExerciseTest {
  inputs: string[]
  expected: string[]
  /** Dateien, die das Programm speichern soll, mit ihren Zeilen. */
  files?: { name: string; lines: string[] }[]
  /** VisuBot: erwartete Fahrt (`driveSignature`), z. B. `['forward 50', 'turnRight 90']`. */
  drive?: string[]
  /** VisuBot: Welt (Name einer Weltkarte in `lessons/welten`); der Roboter darf nicht anstoßen und muss ins Ziel, falls sie eins hat. */
  world?: string
  /**
   * VisuBot: Messwerte der Sensoren, z. B. `{ getLoudness: [0, 80] }`. Mehrere Werte kommen nacheinander,
   * jeder für `SENSOR_PHASE_STEPS` Schritte, der letzte bleibt (so lässt sich „warte, bis es laut ist“ prüfen).
   */
  sensors?: Record<string, (number | boolean)[]>
  /** VisuBot: Sollen die LEDs am Ende leuchten (`true`) oder aus sein (`false`)? */
  led?: boolean
  /** VisuBot: Soll ein Ton erklingen? */
  tone?: boolean
  /** VisuBot: Fährt er überhaupt (egal wie weit)? */
  drives?: boolean
  /** VisuBot: Text, der am Ende auf dem Bildschirm steht (`mbot.showText`). */
  screen?: string
  /** VisuBot: genau diese Befehle für LEDs, Ton, Pausen und Bildschirm (`actionSignature`, ohne Fahren). */
  actions?: string[]
}

/** So viele Schritte gilt ein Messwert aus `ExerciseTest.sensors`, bevor der nächste kommt. */
export const SENSOR_PHASE_STEPS = 40

export interface RunResult {
  outputs: string[]
  /** Gespeicherte Dateien (Name → Inhalt). */
  files?: Map<string, string>
  /** VisuBot: tatsächliche Fahrt (`driveSignature`). */
  drive?: string[]
  /** VisuBot: Steht der Roboter am Ende im Ziel, wie oft ist er angestoßen? */
  atGoal?: boolean
  bumps?: number
  /** VisuBot: Leuchten die LEDs am Ende, kam ein Ton? */
  led?: boolean
  tone?: boolean
  screen?: string
  /** VisuBot: Befehle ohne Fahren (`actionSignature`). */
  actions?: string[]
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

/** Fahrbefehle; alle anderen (LEDs, Ton, Pause, Bildschirm) prüft `ExerciseTest.actions`. */
const DRIVING = new Set(['forward', 'backward', 'turnLeft', 'turnRight', 'stop', 'drive'])

export function runWithInputs(
  doc: VSDocument,
  inputs: string[],
  subprograms?: SubprogramResolver,
  world?: RobotWorldSetup,
  sensors?: ExerciseTest['sensors'],
): RunResult {
  const engine = new SimulationEngine(doc, subprograms)
  const queue = [...inputs]
  // Sensoren wie im Simulator: die Welt fährt mit, damit `mbot.getDistance()` passende Werte liefert.
  const robot = new RobotWorld(world)
  let applied = 0
  for (let i = 0; i < maxCheckSteps; i++) {
    const { state } = engine
    for (; applied < state.robotActions.length; applied++) robot.apply(state.robotActions[applied])
    // jeder Schritt dauert etwas; mit `mbot.drive` fährt der Roboter dabei weiter
    if (i > 0) robot.tick(ROBOT_STEP_MS)
    engine.robotSensors = { ...robot.sensors(), ...sensorsAt(sensors, i) }
    const done = () => ({
      outputs: [...state.outputLines],
      files: new Map(state.files),
      drive: state.robotActions.length ? driveSignature(state.robotActions) : undefined,
      ...(world ? { atGoal: robot.atGoal(), bumps: robot.bumps } : {}),
      led: robot.leds.some((c) => c !== undefined),
      tone: state.robotActions.some((a) => a.method === 'playTone'),
      screen: robot.screen,
      actions: actionSignature(state.robotActions.filter((a) => !DRIVING.has(a.method))),
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

/** Messwerte im Schritt `step`: je Sensor der Wert seiner Phase, ab der letzten Phase bleibt er. */
function sensorsAt(sensors: ExerciseTest['sensors'], step: number): Record<string, number | boolean> {
  const phase = Math.floor(step / SENSOR_PHASE_STEPS)
  return Object.fromEntries(Object.entries(sensors ?? {}).map(([name, values]) => [name, values[Math.min(phase, values.length - 1)]]))
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

/** `subprograms` findet Unterprogramme für Aufrufe, z. B. in anderen Reitern; `worlds` die Weltkarten der VisuBot-Übungen. */
export function checkExercise(
  doc: VSDocument,
  tests: ExerciseTest[],
  subprograms?: SubprogramResolver,
  worlds?: (name: string) => RobotWorldSetup | undefined,
): TestOutcome[] {
  return tests.map((test) => {
    const world = test.world ? worlds?.(test.world) : undefined
    if (test.world && !world) throw new Error(`Weltkarte „${test.world}“ fehlt.`)
    const result = runWithInputs(doc, test.inputs, subprograms, world, test.sensors)
    const filesRight = (test.files ?? []).every((f) => sameOutput(fileLines(result.files?.get(f.name)), f.lines))
    const driveRight = !test.drive || sameOutput(result.drive ?? [], test.drive)
    // Hat die Welt ein Ziel, muss der Roboter hin; anstoßen darf er nie.
    const worldRight = !test.world || (result.bumps === 0 && (!(world?.goals?.length || world?.targets?.length) || result.atGoal === true))
    const robotRight =
      (test.led === undefined || result.led === test.led) &&
      (test.tone === undefined || result.tone === test.tone) &&
      (test.screen === undefined || result.screen === test.screen) &&
      (test.drives === undefined || (result.drive?.length ?? 0) > 0 === test.drives) &&
      (!test.actions || sameOutput(result.actions ?? [], test.actions))
    const passed =
      !result.error &&
      !result.missingInput &&
      !result.tooManySteps &&
      sameOutput(result.outputs, test.expected) &&
      filesRight &&
      driveRight &&
      worldRight &&
      robotRight
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
