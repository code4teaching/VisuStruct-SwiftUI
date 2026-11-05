import { describe, expect, it } from 'vitest'
import { caseBandHeight, caseLabelAt, caseLabelRect, textRect } from '../src/ui/inlineEdit'
import type { LayoutNode } from '../src/core/layout'
import { ElementType, makeElement } from '../src/core/model'

const node = (type: ElementType, extra: Partial<LayoutNode> = {}): LayoutNode => ({
  idPath: [0],
  element: makeElement(type),
  frame: { x: 10, y: 20, width: 300, height: 120 },
  headerBandHeight: 60,
  topBandHeight: 0,
  loopBodyLeadingInset: 20,
  caseColumnFrames: [],
  children: [],
  ...extra,
})

describe('Text direkt im Struktogramm bearbeiten', () => {
  it('Anweisung: ganzes Feld', () => {
    expect(textRect(node(ElementType.anweisung), 20)).toEqual({ x: 10, y: 20, width: 300, height: 120 })
  })

  it('Schleife: nur der Kopf über dem Rumpf', () => {
    const body = node(ElementType.anweisung, { frame: { x: 30, y: 60, width: 280, height: 80 } })
    expect(textRect(node(ElementType.whileSchleife, { children: [body] }), 20)).toEqual({ x: 10, y: 20, width: 300, height: 40 })
  })

  it('Do-while: der Fuß', () => {
    expect(textRect(node(ElementType.doUntilSchleife, { headerBandHeight: 30 }), 20)).toEqual({ x: 10, y: 110, width: 300, height: 30 })
  })

  it('Fallauswahl: Fallname unter dem Dach erkennen', () => {
    const cols = [
      { x: 10, y: 80, width: 100, height: 60 },
      { x: 110, y: 80, width: 100, height: 60 },
      { x: 210, y: 80, width: 100, height: 60 },
    ]
    const fa = node(ElementType.fallauswahl, { caseColumnFrames: cols })
    const band = caseBandHeight(20)
    expect(caseLabelAt(fa, 150, 80 - 5, 20)).toBe(1)
    expect(caseLabelAt(fa, 150, 80 - band - 5, 20)).toBeUndefined()
    expect(caseLabelAt(node(ElementType.verzweigung, { caseColumnFrames: cols }), 150, 75, 20)).toBeUndefined()
    expect(caseLabelRect(fa, 2, 20)).toEqual({ x: 210, y: 80 - band, width: 100, height: band })
  })
})
