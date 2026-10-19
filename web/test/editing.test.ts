import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  deleteAtPath,
  elementAt,
  insertAfterSibling,
  moveAfterSibling,
  moveReplacingPlaceholder,
  newEmptyDocument,
  replaceAtPath,
} from '../src/core/editing'
import { LayoutEngine, diagramDisplayMetrics, type LayoutNode } from '../src/core/layout'
import { ElementType } from '../src/core/model'
import { paletteElement } from '../src/core/palette'
import { decodeDocument, encodeDocument } from '../src/core/xmlCodec'
import { displayElement, flattenNodes } from '../src/ui/renderer'

const examples = join(__dirname, '..', '..', 'VisuStruct-Dateien')

describe('Bearbeiten', () => {
  it('ersetzt den Platzhalter und fügt dahinter ein', () => {
    let doc = newEmptyDocument()
    doc = replaceAtPath(doc, [0], paletteElement('verzweigung'))
    doc = insertAfterSibling(doc, paletteElement('anweisung'), [0])
    expect(doc.elements.map((e) => e.type)).toEqual([ElementType.verzweigung, ElementType.anweisung])
    // Platzhalter im true-Zweig durch eine Schleife ersetzen
    doc = replaceAtPath(doc, [0, 0, 0], paletteElement('whileSchleife'))
    expect(elementAt(doc, [0, 0, 0]).type).toBe(ElementType.whileSchleife)
    expect(elementAt(doc, [0, 0, 0, 0, 0]).textLines).toEqual(['ø'])
  })

  it('verschiebt Elemente und setzt leere Zweige wieder auf ø', () => {
    let doc = newEmptyDocument()
    doc = replaceAtPath(doc, [0], paletteElement('verzweigung'))
    doc = insertAfterSibling(doc, { ...paletteElement('anweisung'), textLines: ['x = 1'] }, [0])
    doc = moveReplacingPlaceholder(doc, [1], [0, 1, 0])
    expect(doc.elements.length).toBe(1)
    expect(elementAt(doc, [0, 1, 0]).textLines).toEqual(['x = 1'])
    doc = moveAfterSibling(doc, [0, 1, 0], [0])
    expect(elementAt(doc, [0, 1, 0]).textLines).toEqual(['ø'])
    expect(elementAt(doc, [1]).textLines).toEqual(['x = 1'])
    doc = deleteAtPath(doc, [1])
    expect(doc.elements.length).toBe(1)
  })

  it('bearbeitete Dateien bleiben im Swift-Format lesbar', () => {
    const doc = decodeDocument(readFileSync(join(examples, 'Collatz.visustruct'), 'utf8'))
    const edited = insertAfterSibling(doc, paletteElement('fallauswahl'), [0])
    expect(decodeDocument(encodeDocument(edited))).toEqual(edited)
  })
})

describe('Layout', () => {
  it('Collatz: Kinder liegen innerhalb ihrer Eltern, Geschwister gleich breit', () => {
    const doc = decodeDocument(readFileSync(join(examples, 'Collatz.visustruct'), 'utf8'))
    const engine = new LayoutEngine(diagramDisplayMetrics(true))
    const layout = engine.layout({ ...doc, elements: doc.elements.map(displayElement) })
    const check = (n: LayoutNode) => {
      for (const c of n.children) {
        expect(c.frame.x).toBeGreaterThanOrEqual(n.frame.x - 1e-6)
        expect(c.frame.x + c.frame.width).toBeLessThanOrEqual(n.frame.x + n.frame.width + 1e-6)
        expect(c.frame.y + c.frame.height).toBeLessThanOrEqual(n.frame.y + n.frame.height + 1e-6)
        check(c)
      }
    }
    layout.elements.forEach(check)
    expect(new Set(layout.elements.map((n) => n.frame.width)).size).toBe(1)
    for (const n of flattenNodes(layout.elements)) expect(Number.isFinite(n.frame.height)).toBe(true)
  })
})
