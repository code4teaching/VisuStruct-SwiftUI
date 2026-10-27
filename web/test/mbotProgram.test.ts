import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { MBOT_COMMANDS, MBOT_SENSORS } from '../src/core/mbot'
import { frame, pythonFrame, RUN, UPLOAD_PREPARE, uploadFrames } from '../src/core/mbotLink'
import { javaConcatenation, mbotProgram } from '../src/core/mbotProgram'
import { ElementType, type VSDocument } from '../src/core/model'
import { diagram, lessons, tasks, useContentLanguage, useVisuBotContent } from '../src/learn/content'
// Rahmen, die mBlock 5 beim Hochladen schickt (aus github.com/weare2plus3/cyberpi-uploader, MIT)
import fixture from './mbotUpload.fixture.json'

const hex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')

describe('Übertragen auf den mBot2', () => {
  it('schickt dieselben Rahmen wie mBlock', () => {
    expect(hex(frame([0x0d, 0x00, 0x00]))).toBe(fixture.PING)
    expect(hex(pythonFrame(UPLOAD_PREPARE[0], RUN, 0))).toBe(fixture.EXEC1)
    expect(hex(pythonFrame(UPLOAD_PREPARE[1], RUN, 0))).toBe(fixture.EXEC2)
    const source = new TextDecoder().decode(Uint8Array.from(fixture.source.match(/../g)!.map((h) => parseInt(h, 16))))
    expect(uploadFrames(source).map(hex)).toEqual(fixture.frames)
  })

  it('verkettet Text wie Java', () => {
    expect(javaConcatenation('mbot.showText("Akku: " + mbot.getBattery() + " %")')).toBe('mbot.showText("Akku: " + str(mbot.getBattery()) + " %")')
    expect(javaConcatenation('mbot.showText(a + b + "x")')).toBe('mbot.showText(str(a + b) + "x")')
    expect(javaConcatenation('x = "a" + len(t)')).toBe('x = "a" + str(len(t))')
    expect(javaConcatenation('if a + 1 > 3:')).toBe('if a + 1 > 3:')
    expect(javaConcatenation('print("Summe: " + str(summe))')).toBe('print("Summe: " + str(summe))')
    expect(javaConcatenation('mbot.forward(i * 10 + 5)')).toBe('mbot.forward(i * 10 + 5)')
  })

  it('macht aus der Fallauswahl if/elif, MicroPython kennt kein match', () => {
    const doc: VSDocument = {
      caption: '',
      elements: [
        {
          type: ElementType.fallauswahl,
          textLines: ['mbot.getColor()'],
          cases: [
            { name: 'rot', elements: [{ type: ElementType.anweisung, textLines: ['mbot.turnRight()'] }] },
            { name: 'blau', elements: [{ type: ElementType.anweisung, textLines: ['mbot.turnLeft()'] }] },
            { name: 'sonst', elements: [{ type: ElementType.anweisung, textLines: ['mbot.forward()'] }] },
          ],
        },
      ],
    } as VSDocument
    const r = mbotProgram(doc, [], 'de')
    expect('source' in r && r.source).toContain('    wahl1 = mbot.getColor()\n    if wahl1 == "rot":\n        mbot.turnRight()\n    elif wahl1 == "blau":')
    expect('source' in r && r.source).not.toContain('match ')
  })

  it('kennt jeden Befehl und Sensor und startet mit Taste A', () => {
    const r = mbotProgram({ caption: '', elements: [{ type: ElementType.anweisung, textLines: ['mbot.forward()'] }] } as VSDocument, [], 'de')
    if (!('source' in r)) throw new Error(r.error)
    for (const name of [...Object.keys(MBOT_COMMANDS).filter((n) => n !== 'ledColor'), ...Object.keys(MBOT_SENSORS)]) expect(r.source).toContain(`    def ${name}(self`)
    expect(r.source).toContain('@event.is_press("a")')
    expect(r.source).toContain('A = Start')
    expect(r.source).toContain('def programm():\n    mbot.forward()')
    expect(r.source).toContain('"red": "rot"')
    const en = mbotProgram({ caption: '', elements: [{ type: ElementType.anweisung, textLines: ['mbot.forward()'] }] } as VSDocument, [], 'en')
    expect('source' in en && en.source).toContain('"red": "red"')
  })

  it('lehnt leere Programme und Eingaben ab', () => {
    expect(mbotProgram({ caption: '', elements: [] } as VSDocument, [], 'de')).toEqual({ error: 'empty' })
    expect(mbotProgram({ caption: '', elements: [{ type: ElementType.anweisung, textLines: ['input: int zahl'] }] } as VSDocument, [], 'de')).toEqual({ error: 'input' })
  })

  describe('Musterlösungen', () => {
    beforeAll(() => {
      useVisuBotContent('on')
      useContentLanguage('de')
    })
    afterAll(() => useVisuBotContent('off'))

    it('jede VisuBot-Musterlösung wird ein Programm (außer mit Eingabe)', () => {
      const blocks = [...lessons.flatMap((l) => l.steps.flatMap((s) => s.blocks)), ...tasks.flatMap((t) => t.blocks)]
      let count = 0
      for (const b of blocks) {
        if (b.kind !== 'exercise' || !b.exercise.solution) continue
        const r = mbotProgram(diagram(b.exercise.solution)!, b.exercise.subprograms.map((f) => diagram(f)!), 'de')
        if ('error' in r) {
          expect(r.error, b.exercise.id).toBe('input')
          continue
        }
        expect(r.source, b.exercise.id).not.toMatch(/\bmatch |empty element\n(?!\s*pass)/u)
        count++
      }
      expect(count).toBeGreaterThan(50)
    })
  })
})
