import type { VSDocument } from './model'
import type { MBotSensorValues } from './mbot'
import { ROBOT_STEP_MS, RobotWorld, type Point, type Pose, type RobotWorldSetup } from './robotWorld'
import { SimulationEngine, type SimNotice, type SubprogramResolver } from './simulation'

/** Ein Bild der Fahrt: wo der mBot2 steht, seine Spur, LEDs und Bildschirm, dazu ein Ton in diesem Schritt. */
export interface PreviewFrame {
  pose: Pose
  trail: Point[]
  leds: RobotWorld['leds']
  screen: string | undefined
  tone?: [number, number]
}

export interface PreviewResult {
  frames: PreviewFrame[]
  /** Warum die Vorschau aufhört: Ende, Eingabe nötig, Fehler oder zu viele Schritte (Endlosschleife?). */
  stop: 'end' | 'input' | 'error' | 'limit'
  notice?: SimNotice
  bumps: number
  /** Strecke der Spur in cm. */
  distance: number
}

export const maxPreviewSteps = 5000

/**
 * mBot2-Vorschau beim Bearbeiten: das Programm im Hintergrund ganz durchrechnen, wie in der Simulation
 * (die Welt liefert die Sensorwerte), und jedes Bild der Fahrt merken.
 */
export function previewRun(doc: VSDocument, subprograms: SubprogramResolver | undefined, setup: RobotWorldSetup, controls: MBotSensorValues = {}): PreviewResult {
  const engine = new SimulationEngine(doc, subprograms)
  const robot = new RobotWorld(setup)
  const frame = (tone?: [number, number]): PreviewFrame => ({
    pose: { ...robot.pose },
    trail: robot.trail.map((p) => ({ ...p })),
    leds: [...robot.leds],
    screen: robot.screen,
    tone,
  })
  const frames: PreviewFrame[] = [frame()]
  let applied = 0
  const result = (stop: PreviewResult['stop'], notice?: SimNotice): PreviewResult => ({
    frames,
    stop,
    notice,
    bumps: robot.bumps,
    distance: Math.round(robot.trail.slice(1).reduce((sum, p, i) => sum + Math.hypot(p.x - robot.trail[i].x, p.y - robot.trail[i].y), 0)),
  })
  for (let i = 0; i < maxPreviewSteps; i++) {
    const { state } = engine
    if (state.inputRequest) return result('input')
    if (state.isHalted) return result('error', state.notice)
    if (!engine.canStep) return result('end')
    engine.robotSensors = { ...controls, ...robot.sensors() }
    engine.step()
    // jeder neue Befehl ist ein Bild; mit `mbot.drive` fährt er auch ohne Befehl weiter
    for (; applied < state.robotActions.length; applied++) {
      const action = state.robotActions[applied]
      robot.apply(action)
      frames.push(frame(action.method === 'playTone' ? [action.args[0], action.args[1]] : undefined))
    }
    const moving = robot.wheels.some((p) => p !== 0)
    robot.tick(ROBOT_STEP_MS)
    if (moving) frames.push(frame())
  }
  return result('limit')
}
