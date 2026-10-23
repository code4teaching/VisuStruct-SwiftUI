import { describe, expect, it } from 'vitest'
import {
  appendCaseToFallauswahl,
  caseIndexInMultiway,
  elementAt,
  multiwayAncestorPath,
  newEmptyDocument,
  removeCaseFromFallauswahl,
  sanitizedSelection,
  setFallauswahlCaseName,
} from '../src/core/editing'
import * as L from '../src/core/lineEditorText'
import { ElementType, makeElement, type VSDocument } from '../src/core/model'

// Port von MultiwayPathTests.swift und LineEditorTextTests.swift, dazu Fälle hinzufügen/entfernen/umbenennen.

function multiwayDocument(): VSDocument {
  const statement = makeElement(ElementType.anweisung, { textLines: ['x = 1'] })
  const inner = makeElement(ElementType.fallauswahl, {
    textLines: ['y'],
    cases: [
      { name: '1', elements: [statement] },
      { name: 'default', elements: [statement] },
    ],
  })
  const outer = makeElement(ElementType.fallauswahl, {
    textLines: ['x'],
    cases: [
      { name: '1', elements: [statement] },
      { name: 'default', elements: [inner] },
    ],
  })
  return { ...newEmptyDocument(), elements: [statement, outer] }
}

describe('Fallauswahl', () => {
  it('findet die innerste Fallauswahl', () => {
    const doc = multiwayDocument()
    expect(multiwayAncestorPath(undefined, doc)).toBeUndefined()
    expect(multiwayAncestorPath([0], doc)).toBeUndefined()
    expect(multiwayAncestorPath([1], doc)).toEqual([1])
    expect(multiwayAncestorPath([1, 0, 0], doc)).toEqual([1])
    expect(multiwayAncestorPath([1, 1, 0], doc)).toEqual([1, 1, 0])
    expect(multiwayAncestorPath([1, 1, 0, 1, 0], doc)).toEqual([1, 1, 0])
  })

  it('Spaltenindex', () => {
    expect(caseIndexInMultiway([1], [1])).toBeUndefined()
    expect(caseIndexInMultiway(undefined, [1])).toBeUndefined()
    expect(caseIndexInMultiway([1, 1, 0], [1])).toBe(1)
  })

  it('fügt Fälle vor default ein, entfernt und benennt sie', () => {
    let doc = multiwayDocument()
    const added = appendCaseToFallauswahl(doc, [1])
    doc = added.doc
    expect(elementAt(doc, [1]).cases!.map((c) => c.name)).toEqual(['1', '2', 'default'])
    expect(added.path).toEqual([1, 1, 0])
    expect(elementAt(doc, added.path).textLines).toEqual(['ø'])
    doc = setFallauswahlCaseName(doc, [1], 1, '  zwei ')
    expect(elementAt(doc, [1]).cases![1].name).toBe('zwei')
    expect(() => setFallauswahlCaseName(doc, [1], 1, '  ')).toThrow()
    const removed = removeCaseFromFallauswahl(doc, [1], 2)
    expect(elementAt(removed.doc, [1]).cases!.map((c) => c.name)).toEqual(['1', 'zwei'])
    expect(removed.path).toEqual([1, 1, 0])
    expect(() => removeCaseFromFallauswahl(removed.doc, [1], 0)).toThrow()
  })

  it('bereinigt die Auswahl', () => {
    const doc = multiwayDocument()
    expect(sanitizedSelection(undefined, doc)).toEqual([0])
    expect(sanitizedSelection([9], doc)).toEqual([0])
    expect(sanitizedSelection([1, 0, 0], doc)).toEqual([1, 0, 0])
    expect(sanitizedSelection([0], { caption: '', elements: [] })).toBeUndefined()
  })
})

describe('Zeileneditor', () => {
  it('erkennt die Art', () => {
    expect(L.ioMode('input: int age')).toBe('input')
    expect(L.ioMode('  OUTPUT: x')).toBe('output')
    expect(L.ioMode('print: x')).toBe('output')
    expect(L.ioMode('x = 1')).toBe('statement')
  })

  it('tauscht das Präfix und behält den Inhalt', () => {
    expect(L.applyingIOMode('input', 'print: age')).toBe('input: age')
    expect(L.applyingIOMode('output', 'age')).toBe('output: age')
    expect(L.applyingIOMode('statement', 'input:  age ')).toBe('age')
    expect(L.applyingIOMode('input', '')).toBe('input: ')
  })

  it('behält beim Tippen Leerzeichen', () => {
    expect(L.strippingPrefixForEditing('input:', 'input: age ')).toBe('age ')
    expect(L.strippingPrefixForEditing('if', 'if (a > 3)')).toBe('a > 3')
    expect(L.strippingPrefixForEditing('if', 'if a > 3 ')).toBe('a > 3 ')
    expect(L.strippingPrefixForEditing('while', 'until x == 1')).toBe('x == 1')
    expect(L.strippingPrefixForEditing('if', 'iffy')).toBe('iffy')
  })

  it('setzt das Präfix', () => {
    expect(L.prefixingForEditing('while', '')).toBe('while ')
    expect(L.prefixingForEditing('while', 'i < 3')).toBe('while i < 3')
  })

  it('normalisiert Anführungszeichen', () => {
    expect(L.normalizingQuotes('print: „Hallo“ ‚x’')).toBe('print: "Hallo" \'x\'')
  })

  it('Felder der Zählschleife', () => {
    expect(L.paddedForLoopParts([])).toEqual(['', '', ''])
    expect(L.paddedForLoopParts(['a', 'b', 'c', 'd'])).toEqual(['a', 'b', 'c'])
    expect(L.normalizedForLoopPart('int i = 0;; ')).toBe('int i = 0')
  })
})
