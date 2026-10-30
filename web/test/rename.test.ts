import { describe, expect, it } from 'vitest'
import { ElementType, makeElement, type VSDocument } from '../src/core/model'
import { checkNewName, documentVariableNames, nameAt, renameInDocument, renameInText, variableNames } from '../src/core/rename'

describe('Umbenennen', () => {
  it('ändert nur genau dieselbe Schreibweise, ganze Wörter', () => {
    const code = 'int zahl = 3;\nint Zahl = zahl + 1;\nint zahlen = zahl;'
    expect(renameInText(code, 'zahl', 'anzahl')).toEqual({ text: 'int anzahl = 3;\nint Zahl = anzahl + 1;\nint zahlen = anzahl;', count: 3 })
  })

  it('lässt Zeichenketten, Zeichen, Kommentare und Felder hinter dem Punkt', () => {
    const code = 'int length = 2; // length\nSystem.out.println("length " + length + feld.length + \'x\');\n/* length */'
    const r = renameInText(code, 'length', 'laenge')
    expect(r.count).toBe(2)
    expect(r.text).toBe('int laenge = 2; // length\nSystem.out.println("length " + laenge + feld.length + \'x\');\n/* length */')
  })

  it('findet den Namen unter dem Cursor, aber keine Schlüsselwörter', () => {
    const code = 'int zahl = 3;'
    expect(nameAt(code, 6)?.name).toBe('zahl')
    expect(nameAt(code, 8)?.name).toBe('zahl')
    expect(nameAt(code, 1)).toBeUndefined()
  })

  it('nennt Variablen, keine Typen, Klassen oder Methoden', () => {
    const names = variableNames(['Scanner sc = new Scanner(System.in);', 'int zahl = sc.nextInt();', 'String[] namen;', 'zahl = Math.max(zahl, Zahl);'])
    expect(names).toEqual(['sc', 'zahl', 'namen', 'Zahl'])
  })

  it('benennt im ganzen Struktogramm um, auch in Kopf und Schleifen', () => {
    const doc: VSDocument = {
      caption: 'summe(int zahl)',
      elements: [
        makeElement(ElementType.anweisung, { textLines: ['int Zahl = zahl'] }),
        makeElement(ElementType.whileSchleife, { textLines: ['zahl > 0'], loopBody: [makeElement(ElementType.anweisung, { textLines: ['zahl = zahl - 1'] })] }),
      ],
    }
    const r = renameInDocument(doc, 'zahl', 'wert')
    expect(r.count).toBe(5)
    expect(r.doc.caption).toBe('summe(int wert)')
    expect(r.doc.elements[0].textLines).toEqual(['int Zahl = wert'])
    expect(r.doc.elements[1].loopBody![0].textLines).toEqual(['wert = wert - 1'])
    expect(documentVariableNames(r.doc)).toContain('Zahl')
  })

  it('prüft den neuen Namen', () => {
    expect(checkNewName('Zahl', 'zahl', ['zahl', 'Zahl'])).toEqual({ ok: true, warning: 'exists' })
    expect(checkNewName('zahl', 'int', [])).toEqual({ ok: false, reason: 'keyword' })
    expect(checkNewName('zahl', '2te', [])).toEqual({ ok: false, reason: 'invalid' })
    expect(checkNewName('zahl', 'größe', [])).toEqual({ ok: true })
  })
})
