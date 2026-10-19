import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { generateCode, generateJavaClassFile, sanitizedJavaClassName, type CodeTarget } from '../src/core/codeGenerator'
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
