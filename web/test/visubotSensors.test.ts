import { describe, expect, it } from 'vitest'
import type { LiveLabels } from '../src/core/codeGenerator'
import { checkExercise } from '../src/core/exerciseCheck'
import { parseLiveJava } from '../src/core/javaParser'
import { documentFromJava } from '../src/core/liveSource'
import { actionSignature, parseActionSpec, usedMBotSensors } from '../src/core/mbot'
import { parseWorldMap, RobotWorld } from '../src/core/robotWorld'
import { SimulationEngine } from '../src/core/simulation'
import { parseSensorTest } from '../src/learn/lessonFormat'

const labels: LiveLabels = { condition: 'Bedingung', selector: 'Wert', code: 'Dein Code', start: 'Startwert', step: 'Schritt', end: 'Ende' }
const main = (body: string) => `public class Main {\n  public static void main(String[] args) {\n${body}\n  }\n}`
const docOf = (java: string) => {
  const parsed = parseLiveJava(java, labels, {})
  expect(parsed.problems).toEqual([])
  return documentFromJava({ caption: '', elements: [] }, parsed)
}

function run(java: string, sensors: Record<string, number | boolean> = {}) {
  const engine = new SimulationEngine(docOf(java))
  engine.robotSensors = sensors
  for (let i = 0; i < 1000 && engine.canStep; i++) engine.step()
  expect(engine.state.isHalted, engine.message).toBe(false)
  return engine.state
}

describe('mBot2-Sensoren', () => {
  it('liest Wahrheitswerte wie Taste A in Bedingungen', () => {
    const code = main('    if (mbot.isButtonA()) {\n      mbot.forward();\n    } else {\n      mbot.turnRight();\n    }')
    expect(run(code, { isButtonA: true }).robotActions.map((a) => a.method)).toEqual(['forward'])
    expect(run(code).robotActions.map((a) => a.method)).toEqual(['turnRight'])
    const negated = main('    if (!mbot.isButtonB() && mbot.getBrightness() < 30) {\n      mbot.setLed(255, 255, 255);\n    }')
    expect(run(negated, { getBrightness: 10 }).robotActions.map((a) => a.method)).toEqual(['setLed'])
    expect(run(negated, { getBrightness: 10, isButtonB: true }).robotActions).toEqual([])
  })

  it('speichert einen Sensorwert in einer boolean-Variable', () => {
    const state = run(main('    boolean laut = mbot.getLoudness() > 50;\n    boolean rot = mbot.isRed();\n    System.out.println(laut);\n    System.out.println(rot);'), { getLoudness: 80, isRed: true })
    expect(state.outputLines).toEqual(['true', 'true'])
  })

  it('findet die benutzten Sensoren', () => {
    expect(usedMBotSensors('if (mbot.isRed() || mbot.getPitch() > 20) mbot.forward(); mbot.isRed()').sort()).toEqual(['getPitch', 'isRed'])
  })

  it('erkennt farbige Felder unter dem Sensor', () => {
    const world = new RobotWorld(parseWorldMap('...\n.r.\n...\n.^.'))
    expect(world.sensors().isRed).toBe(false)
    world.drive(10)
    expect(world.colorUnder()).toBe('red')
    expect(world.sensors()).toMatchObject({ isRed: true, isGreen: false, getLine: 0 })
  })

  it('prüft Übungen mit Messwerten, auch nacheinander', () => {
    const wait = docOf(main('    while (mbot.getLoudness() < 50) {\n      mbot.pause(100);\n    }\n    mbot.forward(30);'))
    const test = parseSensorTest('getLoudness=0/80 -> forward 30')
    expect(checkExercise(wait, [test])[0].passed).toBe(true)
    const light = docOf(main('    if (mbot.getBrightness() < 30) {\n      mbot.setLed(255, 255, 255);\n    } else {\n      mbot.ledOff();\n    }'))
    const tests = [parseSensorTest('getBrightness=10 -> ledOn, none'), parseSensorTest('getBrightness=80 -> ledOff')]
    expect(checkExercise(light, tests).map((o) => o.passed)).toEqual([true, true])
    expect(checkExercise(light, [parseSensorTest('getBrightness=80 -> ledOn')])[0].passed).toBe(false)
    expect(() => parseSensorTest('getFoo=1 -> forward')).toThrow()
  })

  it('zeigt Text mit Zahlen und Sensorwerten auf dem Bildschirm', () => {
    const state = run(main('    int i = 3;\n    mbot.showText("Abstand: " + mbot.getDistance());\n    mbot.showText(i);'), { getDistance: 42 })
    expect(state.robotActions.map((a) => a.text)).toEqual(['Abstand: 42', '3'])
    expect(state.robotActions[0].python).toBe(`cyberpi.display.show_label("Abstand: 42", 24, 'center')`)
    expect(actionSignature(state.robotActions)).toEqual(['showText "Abstand: 42"', 'showText "3"'])
  })

  it('liest erwartete Befehle mit Wiederholung und Text', () => {
    expect(parseActionSpec('2 x (setLed 0 0 255, pause 500), showText "Los, los!"')).toEqual(['setLed 0 0 255', 'pause 500', 'setLed 0 0 255', 'pause 500', 'showText "Los, los!"'])
    expect(() => parseActionSpec('setLed 1 2')).toThrow()
  })
})
