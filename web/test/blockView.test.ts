// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import type { LiveLabels } from '../src/core/codeGenerator'
import { parseLiveJava } from '../src/core/javaParser'
import { documentFromJava } from '../src/core/liveSource'
import { blockGroup, blockTokens, BlockView } from '../src/ui/blockView'
import { ElementType, makeElement } from '../src/core/model'

const labels: LiveLabels = { condition: 'Bedingung', selector: 'Wert', code: 'Dein Code', start: 'Startwert', step: 'Schritt', end: 'Ende' }
const main = (body: string) => `public class Main {\n  public static void main(String[] args) {\n${body}\n  }\n}`
const docOf = (java: string) => {
  const parsed = parseLiveJava(java, labels, {})
  expect(parsed.problems).toEqual([])
  return documentFromJava({ caption: '', elements: [] }, parsed)
}

describe('Blöcke (VisuBot)', () => {
  it('teilt eine Zeile in Schlüsselwort, Werte und Sensoren', () => {
    expect(blockTokens('while mbot.getDistance() > 20')).toEqual([
      { kind: 'kw', text: 'while' },
      { kind: 'text', text: ' ' },
      { kind: 'sensor', text: 'mbot.getDistance()' },
      { kind: 'text', text: ' > ' },
      { kind: 'lit', text: '20' },
    ])
    expect(blockTokens('mbot.showText("Hallo 1")')).toEqual([
      { kind: 'text', text: 'mbot.showText(' },
      { kind: 'str', text: '"Hallo 1"' },
      { kind: 'text', text: ')' },
    ])
    // Befehle sind keine Sensoren, Ziffern in Namen keine Werte
    expect(blockTokens('mbot.stop(); x2 = 3')).toEqual([
      { kind: 'text', text: 'mbot.stop(); x2 = ' },
      { kind: 'lit', text: '3' },
    ])
  })

  it('kennt die Gruppe jedes mBot2-Befehls', () => {
    const st = (text: string) => makeElement(ElementType.anweisung, { textLines: [text] })
    expect(blockGroup(st('mbot.forward(50)'))).toBe('drive')
    expect(blockGroup(st('mbot.led(2).setColor("rot")'))).toBe('leds')
    expect(blockGroup(st('mbot.pause(100)'))).toBe('wait')
    expect(blockGroup(st('x = 1'))).toBeUndefined()
  })

  it('zeichnet Schleifen und Verzweigungen als Klammerblöcke mit Pfaden', () => {
    const doc = docOf(main('for (int i = 0; i < 4; i++) {\n  mbot.forward(50);\n  if (mbot.getDistance() < 10) {\n    mbot.stop();\n  } else {\n    mbot.turnRight(90);\n  }\n}'))
    const selected: number[][] = []
    const view = new BlockView({ select: (p) => selected.push(p), labels: { start: 'Start', else: 'else', empty: 'leer', hint: '' } })
    view.render(doc, [0, 0, 1], false)
    const root = view.element
    const loop = root.querySelector('.bk-loop')!
    expect(loop.querySelector(':scope > .bk-head')!.textContent).toContain('for')
    const stmt = loop.querySelector<HTMLElement>('.bk-stmt')!
    expect(stmt.dataset.path).toBe('[0,0,0]')
    expect(stmt.dataset.botColor).toBe('fahren')
    const branch = loop.querySelector<HTMLElement>('.bk-if')!
    expect(branch.classList.contains('bk-sel')).toBe(true)
    expect(branch.querySelector('.tk-sensor')!.textContent).toBe('mbot.getDistance()')
    expect(branch.querySelector('.bk-clause')!.textContent).toBe('else')
    expect(branch.querySelectorAll(':scope > .bk-body')).toHaveLength(2)
    branch.querySelectorAll<HTMLElement>('.bk-stmt')[1].dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(selected).toEqual([[0, 0, 1, 1, 0]])

    // In der Simulation: laufender Schritt hervorgehoben, Klicks wählen nichts aus
    view.render(doc, [0, 0, 0], true)
    expect(root.querySelector('.bk-exec')!.getAttribute('data-path')).toBe('[0,0,0]')
    root.querySelector<HTMLElement>('.bk-stmt')!.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(selected).toHaveLength(1)
  })
})
