import { describe, expect, it } from 'vitest'
import { countLoopLines, countVar, readCountLoop, setCountField } from 'visublocks'
import { elementWithForDepth, replaceBlockValue, withCountLoopDefaults } from '../src/ui/blockView'
import { ElementType, makeElement, type VSDocument } from '../src/core/model'

describe('VisuBlocks: Zählschleife', () => {
  it('liest einfache for-Köpfe', () => {
    expect(readCountLoop(['int i = 0', 'i < 10', 'i++'])).toEqual({ v: 'i', start: '0', op: '<', end: '10', step: '1' })
    expect(readCountLoop(['int j = 1; j <= 5; j += 2'])).toEqual({ v: 'j', start: '1', op: '<=', end: '5', step: '2' })
    expect(readCountLoop(['int i = 10', 'i > 0', 'i--'])).toEqual({ v: 'i', start: '10', op: '>', end: '0', step: '1' })
    expect(readCountLoop(['int i = 0', 'i < mbot.getDistance()', 'i = i + 3'])?.end).toBe('mbot.getDistance()')
    // leere Schleife → Standard
    expect(readCountLoop(['', '', ''], 'k')).toEqual({ v: 'k', start: '0', op: '<', end: '10', step: '1' })
  })

  it('lässt kompliziertere Köpfe als Text', () => {
    expect(readCountLoop(['int i = 0', 'i < anzahl', 'i++'])?.end).toBe('anzahl')
    expect(readCountLoop(['int i = 0', 'j < 10', 'i++'])).toBeUndefined()
    expect(readCountLoop(['int i = 0', 'i < 10', 'i--'])).toBeUndefined()
    expect(readCountLoop(['int i = 0', 'i < 10', 'i *= 2'])).toBeUndefined()
  })

  it('schreibt den Java-Kopf aus den Zahlen', () => {
    const c = readCountLoop(['', '', ''])!
    expect(countLoopLines(c)).toEqual(['int i = 0', 'i < 10', 'i++'])
    expect(countLoopLines(setCountField(c, 2, '2')!)).toEqual(['int i = 0', 'i < 10', 'i += 2'])
    expect(countLoopLines({ v: 'i', start: '10', op: '>=', end: '1', step: '3' })).toEqual(['int i = 10', 'i >= 1', 'i -= 3'])
    expect(setCountField(c, 0, '2.5')).toBeUndefined()
    expect(setCountField(c, 2, '0')).toBeUndefined()
    expect(setCountField(c, 1, 'mbot.getTimer()')?.end).toBe('mbot.getTimer()')
    expect(countVar(1)).toBe('j')
  })

  it('Start 0 im Block ergibt im Code int i = 0, auch in leeren und verschachtelten Schleifen', () => {
    const inner = makeElement(ElementType.forSchleife, { textLines: ['', '', ''], loopBody: [] })
    const outer = makeElement(ElementType.forSchleife, { textLines: ['', '', ''], loopBody: [inner] })
    const doc = { elements: [outer] } as unknown as VSDocument
    expect(elementWithForDepth(doc, [0, 0, 0]).depth).toBe(1)
    expect(replaceBlockValue(doc, [0], 0, '0')).toEqual(['int i = 0', 'i < 10', 'i++'])
    expect(replaceBlockValue(doc, [0, 0, 0], 1, '5')).toEqual(['int j = 0', 'j < 5', 'j++'])
    expect(replaceBlockValue(doc, [0], 0, '"Hallo"')).toBeUndefined()
    // neue Schleife aus „Elemente“ im Rumpf der äußeren: gleich mit j
    const fresh = makeElement(ElementType.forSchleife, { textLines: ['', '', ''], loopBody: [] })
    expect(withCountLoopDefaults(doc, [0, 0, 1], fresh).textLines).toEqual(['int j = 0', 'j < 10', 'j++'])
    expect(withCountLoopDefaults(doc, [1], fresh).textLines).toEqual(['int i = 0', 'i < 10', 'i++'])
  })
})
