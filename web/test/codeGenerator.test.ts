import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { generateCode, generateJavaClassFile, sanitizedJavaClassName, type CodeTarget } from '../src/core/codeGenerator'
import { ElementType, makeElement } from '../src/core/model'
import { decodeDocument } from '../src/core/xmlCodec'

// Port von CodeGeneratorTests.swift.

const examples = join(__dirname, '..', '..', 'VisuStruct-Dateien')
const text = (name: string) => readFileSync(join(examples, name), 'utf8')
const example = (name: string) => decodeDocument(text(name))

describe('Codegenerierung', () => {
  it('Java-Klasse entspricht den mitgelieferten .java-Dateien', () => {
    for (const name of ['Collatz', 'Fibonacci']) {
      expect(generateJavaClassFile(example(`${name}.visustruct`), name), name).toBe(text(`${name}.java`))
    }
  })

  it('Java-Klasse mit Eingabe importiert Scanner genau einmal', () => {
    const generated = generateJavaClassFile(example('2026-04-23-NumberEven.visustruct'), 'NumberEven')
    expect(generated.startsWith('import java.util.Scanner;\n\npublic class NumberEven {\n')).toBe(true)
    expect(generated.split('new Scanner(System.in)').length - 1).toBe(1)
    expect(generated).toContain('if (number % 2 == 0) {')
  })

  it('Collatz in Python und JavaScript', () => {
    const doc = example('Collatz.visustruct')
    const python = generateCode(doc, 'python')
    expect(python).toContain('while number != 1:')
    expect(python).toContain('print(number)')
    expect(python).not.toContain('{')
    const js = generateCode(doc, 'javascript')
    expect(js.startsWith('"use strict";')).toBe(true)
    expect(js).toContain('while (number != 1) {')
    expect(js).toContain('console.log(number);')
    // int-Variable: Ganzzahldivision wie in Java
    expect(js).toContain('number = Math.floor(number / 2);')
  })

  it('Python: Java-Schreibweise wird übersetzt', () => {
    const stmt = (t: string) => makeElement(ElementType.anweisung, { textLines: [t] })
    const doc = {
      caption: '',
      elements: [
        stmt('int n = 7'),
        stmt('boolean ok = true'),
        makeElement(ElementType.forSchleife, {
          textLines: ['int i = 1', 'i <= n', 'i++'],
          loopBody: [stmt('n--')],
        }),
        makeElement(ElementType.verzweigung, {
          textLines: ['n > 2 && !ok || n == 0'],
          cases: [
            { name: 'true', elements: [stmt('print: "Hälfte: " + n / 2')] },
            { name: 'false', elements: [stmt('ø')] },
          ],
        }),
      ],
    }
    const python = generateCode(doc, 'python')
    expect(python).toContain('ok = True')
    expect(python).toContain('for i in range(1, n + 1):')
    expect(python).toContain('    n -= 1')
    expect(python).toContain('if n > 2 and not ok or n == 0:')
    expect(python).toContain('print("Hälfte: " + str(n // 2))')
    expect(python).toMatch(/else:\n {4}# empty element\n {4}pass/)
  })

  it('Pseudocode bekommt einen Hinweis über dem Code', () => {
    const doc = { caption: '', pseudocode: true, elements: [makeElement(ElementType.anweisung, { textLines: ['Tasse hinstellen'] })] }
    expect(generateCode(doc, 'python', { pseudocodeNote: 'Pseudocode' })).toBe('# Pseudocode\n\nTasse hinstellen')
    expect(generateCode(doc, 'java', { pseudocodeNote: 'Pseudocode' }).startsWith('// Pseudocode\n\n')).toBe(true)
    expect(generateCode({ ...doc, pseudocode: undefined }, 'python')).toBe('Tasse hinstellen')
    const withInput = { ...doc, elements: [makeElement(ElementType.anweisung, { textLines: ['input: int n'] })] }
    const javaClass = generateJavaClassFile(withInput, 'Tee', { pseudocodeNote: 'Pseudocode' })
    expect(javaClass.split('new Scanner(System.in)').length - 1).toBe(1)
    expect(javaClass).toContain('        // Pseudocode\n')
  })

  it('bereinigt Java-Klassennamen', () => {
    expect(sanitizedJavaClassName('Fibonacci')).toBe('Fibonacci')
    const s = sanitizedJavaClassName('2 Summe bilden!')
    expect(s).not.toBe('')
    expect(s).not.toContain(' ')
    expect(/^\d/.test(s)).toBe(false)
  })

  it('leeres Dokument erzeugt einen Platzhalter', () => {
    for (const target of ['java', 'python', 'javascript'] as CodeTarget[]) {
      expect(generateCode({ caption: '', elements: [] }, target).trim(), target).not.toBe('')
    }
  })

  it('Eingabe, Fallauswahl und Schleifen in allen Sprachen', () => {
    const doc = example('SummeBilden/switch-case.visustruct')
    expect(generateCode(doc, 'python')).toMatch(/match .*:\n/)
    expect(generateCode(doc, 'javascript')).toContain('break;')
    const pin = example('2026-04-23-CheckPin.visustruct')
    expect(generateCode(pin, 'javascript')).toContain('prompt(')
    expect(generateCode(pin, 'python')).toContain('input(')
    expect(generateCode(example('SummeBilden/for-loop.visustruct'), 'python')).toMatch(/for \w+ in range\(/)
  })
})
