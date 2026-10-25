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

  it('zeigt Gefühle und lehnt unbekannte ab', () => {
    const state = run(main('    mbot.emotion("smile");'))
    expect(state.robotActions[0].python).toBe('cyberpi.emotion.smile()')
    expect(actionSignature(state.robotActions)).toEqual(['emotion "smile"'])
    const engine = new SimulationEngine(docOf(main('    mbot.emotion("tanzen");')))
    for (let i = 0; i < 10 && engine.canStep; i++) engine.step()
    expect(engine.state.isHalted).toBe(true)
  })

  it('liest erwartete Befehle mit Wiederholung und Text', () => {
    expect(parseActionSpec('2 x (setLed 0 0 255, pause 500), showText "Los, los!"')).toEqual(['setLed 0 0 255', 'pause 500', 'setLed 0 0 255', 'pause 500', 'showText "Los, los!"'])
    expect(() => parseActionSpec('setLed 1 2')).toThrow()
  })
})

describe('mBot2-Motoren mit Geschwindigkeit', () => {
  it('fährt mit drive weiter, bis stop kommt, und lenkt mit verschiedenen Rädern', () => {
    const world = new RobotWorld()
    world.apply({ method: 'drive', args: [50, 50], label: '' })
    world.tick(1000)
    expect(world.pose.y).toBeCloseTo(10)
    world.apply({ method: 'stop', args: [], label: '' })
    world.tick(1000)
    expect(world.pose.y).toBeCloseTo(10)
    world.apply({ method: 'drive', args: [10, 40], label: '' })
    world.tick(500)
    expect(world.pose.heading).toBeGreaterThan(180) // nach links gedreht
    expect(world.timer).toBe(2.5)
    world.apply({ method: 'resetTimer', args: [], label: '' })
    expect(world.timer).toBe(0)
  })

  it('bleibt vor einer Wand stehen und zählt das Anstoßen einmal', () => {
    const world = new RobotWorld(parseWorldMap('###\n...\n.^.'))
    world.apply({ method: 'drive', args: [100, 100], label: '' })
    world.tick(3000)
    expect(world.bumps).toBe(1)
    expect(world.distance()).toBeLessThan(2)
  })

  it('liest Linien aus der Weltkarte und meldet die mittleren Fühler', () => {
    const setup = parseWorldMap('.....\n.....\n..^..\nlinie: 2,2 2,0')
    expect(setup.lines).toHaveLength(1)
    const sensors = new RobotWorld(setup).sensors()
    expect(sensors.isLineLeft).toBe(true)
    expect(sensors.isLineRight).toBe(true)
  })

  it('prüft Bildschirmtext und ob er überhaupt fährt', () => {
    const test = parseSensorTest('getBattery=15 -> drives, screen "Akku: 15 %, leer"')
    expect(test.screen).toBe('Akku: 15 %, leer')
    expect(test.drives).toBe(true)
    const doc = docOf(main('    mbot.showText("Akku: " + mbot.getBattery() + " %, leer");\n    mbot.forward();'))
    expect(checkExercise(doc, [test])[0].passed).toBe(true)
    expect(checkExercise(docOf(main('    mbot.showText("Akku");')), [test])[0].passed).toBe(false)
  })
})
