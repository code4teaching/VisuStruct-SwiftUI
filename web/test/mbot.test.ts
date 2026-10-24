import { describe, expect, it } from 'vitest'
import type { LiveLabels } from '../src/core/codeGenerator'
import { memberCompletionsAt } from '../src/core/javaMembers'
import { parseLiveJava } from '../src/core/javaParser'
import { documentFromJava } from '../src/core/liveSource'
import { parseMBotCommand, substituteMBotSensors } from '../src/core/mbot'
import { SimulationEngine } from '../src/core/simulation'

const labels: LiveLabels = { condition: 'Bedingung', selector: 'Wert', code: 'Dein Code', start: 'Startwert', step: 'Schritt', end: 'Ende' }

function run(java: string, sensors: Record<string, number> = {}) {
  const parsed = parseLiveJava(java, labels, {})
  expect(parsed.problems).toEqual([])
  const engine = new SimulationEngine(documentFromJava({ caption: '', elements: [] }, parsed))
  engine.robotSensors = sensors
  for (let i = 0; i < 1000 && engine.canStep; i++) engine.step()
  expect(engine.state.isHalted, engine.message).toBe(false)
  return engine.state
}

const main = (body: string) => `public class Main {\n  public static void main(String[] args) {\n${body}\n  }\n}`

describe('mBot2', () => {
  it('erkennt Befehle mit Argumenten', () => {
    expect(parseMBotCommand('mbot.setLed(255, 0, x + 1)')).toEqual({ method: 'setLed', args: ['255', '0', 'x + 1'] })
    expect(parseMBotCommand('mbot.stop()')).toEqual({ method: 'stop', args: [] })
    expect(parseMBotCommand('x = 3')).toBe(undefined)
  })

  it('ersetzt Sensoren durch Zahlen', () => {
    expect(substituteMBotSensors('mbot.getDistance() < 20', () => 15)).toBe('15 < 20')
    expect(substituteMBotSensors('mbot.unknown()', () => 1)).toBe('mbot.unknown()')
  })

  it('fährt ein Quadrat und merkt sich die Python-Zeilen', () => {
    const state = run(main(`    for (int i = 0; i < 4; i++) {\n      mbot.forward(20);\n      mbot.turnRight(90);\n    }`))
    expect(state.robotActions.map((a) => a.python)).toEqual(Array(4).fill(['mbot2.straight(20)', 'mbot2.turn(90)']).flat())
    expect(state.outputLines[0]).toBe('🤖 mBot2: 20 cm vorwärts')
  })

  it('liest den Abstand in Bedingungen und Variablen', () => {
    const state = run(main(`    int abstand = mbot.getDistance();\n    if (mbot.getDistance() < 20) {\n      mbot.stop();\n    } else {\n      mbot.forward(abstand - 20);\n    }`), { getDistance: 15 })
    expect(state.robotActions.map((a) => a.method)).toEqual(['stop'])
    expect(run(main(`    int abstand = mbot.getDistance();\n    if (mbot.getDistance() < 20) {\n      mbot.stop();\n    } else {\n      mbot.forward(abstand - 20);\n    }`)).robotActions[0].python).toBe('mbot2.straight(80)')
  })

  it('meldet falsche Befehle als Fehler', () => {
    const engine = new SimulationEngine(documentFromJava({ caption: '', elements: [] }, parseLiveJava(main('    mbot.fly(3);'), labels, {})))
    engine.step()
    expect(engine.state.isHalted).toBe(true)
  })

  it('schlägt nach mbot. die Befehle vor', () => {
    const code = main('    mbot.')
    const names = memberCompletionsAt(code, code.indexOf('mbot.') + 5)?.members.map((m) => m.name)
    expect(names).toContain('forward')
    expect(names).toContain('getDistance')
  })
})
