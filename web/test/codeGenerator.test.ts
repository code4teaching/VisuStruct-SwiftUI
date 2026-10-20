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
    expect(js).toContain('number = Math.trunc(number / 2);')
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

  it('Verzweigung allein im false-Zweig wird zu else if bzw. elif', () => {
    const stmt = (t: string) => makeElement(ElementType.anweisung, { textLines: [t] })
    const branch = (cond: string, yes: string, no: ReturnType<typeof stmt>[]) =>
      makeElement(ElementType.verzweigung, { textLines: [cond], cases: [{ name: 'true', elements: [stmt(yes)] }, { name: 'false', elements: no }] })
    const chain = branch('wahl == 1', 'output: "Wasser"', [branch('wahl == 2', 'output: "Saft"', [stmt('output: "Kakao"')])])
    const doc = { caption: '', elements: [stmt('int wahl = 2'), chain] }
    expect(generateCode(doc, 'java')).toContain(
      'if (wahl == 1) {\n    System.out.println("Wasser");\n} else if (wahl == 2) {\n    System.out.println("Saft");\n} else {\n    System.out.println("Kakao");\n}',
    )
    expect(generateCode(doc, 'javascript')).toContain('} else if (wahl == 2) {')
    expect(generateCode(doc, 'python')).toContain('if wahl == 1:\n    print("Wasser")\nelif wahl == 2:\n    print("Saft")\nelse:\n    print("Kakao")')
    // Steht noch etwas neben der inneren Verzweigung, bleibt der Block verschachtelt.
    const mixed = branch('wahl == 1', 'output: "Wasser"', [stmt('output: "Moment"'), branch('wahl == 2', 'output: "Saft"', [stmt('ø')])])
    expect(generateCode({ caption: '', elements: [stmt('int wahl = 2'), mixed] }, 'java')).toContain('} else {\n    System.out.println("Moment");\n    if (wahl == 2) {')
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

  it('Unterprogramme mit Kopfzeile werden zu Methoden und Funktionen', () => {
    const stmt = (t: string) => makeElement(ElementType.anweisung, { textLines: [t] })
    const call = (t: string) => makeElement(ElementType.aufruf, { textLines: [t] })
    const quadrat = { caption: 'int quadrat(int x)', elements: [stmt('int y = x * x'), stmt('return y')] }
    const zeige = { caption: 'void zeige(String text)', elements: [stmt('input: int n "Zahl?"'), stmt('output: text + n')] }
    const main = { caption: 'Main', elements: [call('int q = quadrat(3)'), call('zeige("q=")'), stmt('output: q')] }
    expect(generateCode(quadrat, 'java')).toBe('public static int quadrat(int x) {\n    int y = x * x;\n    return y;\n}')
    expect(generateCode(main, 'python', {}, [quadrat])).toBe(
      'def quadrat(x):\n    y = x * x\n    return y\n\nq = quadrat(3)\nzeige("q=")\nprint(q)',
    )
    expect(generateCode(main, 'javascript', {}, [quadrat])).toContain('function quadrat(x) {\n    let y = x * x;\n    return y;\n}\n\nlet q = quadrat(3);')
    const javaClass = generateJavaClassFile(main, 'Main', {}, [quadrat, zeige])
    expect(javaClass).toContain('    static Scanner scanner = new Scanner(System.in);\n')
    expect(javaClass.split('new Scanner(System.in)').length - 1).toBe(1)
    expect(javaClass).toContain('    public static int quadrat(int x) {\n        int y = x * x;\n        return y;\n    }\n')
    expect(javaClass).toContain('    public static void zeige(String text) {\n')
    const leeren = { caption: 'void leeren(boolean[] reihe, int[][] tabelle)', elements: [stmt('reihe[0] = false')] }
    expect(generateCode(leeren, 'java')).toContain('public static void leeren(boolean[] reihe, int[][] tabelle) {')
    expect(generateCode(leeren, 'python')).toContain('def leeren(reihe, tabelle):')
    // Ohne Unterprogramme bleibt die Klasse wie bisher.
    expect(generateJavaClassFile(main, 'Main')).not.toContain('public static int')
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

  it('JavaScript schneidet int / int wie Java ab', () => {
    const s = (t: string) => makeElement(ElementType.anweisung, { textLines: [t] })
    const js = generateCode(
      { caption: '', elements: [s('int a = 7'), s('int b = 2'), s('int q = a / b'), s('q /= 2'), s('double e = a / 2.0'), s('print: "x/y " + a / b')] },
      'javascript',
    )
    expect(js).toContain('let q = Math.trunc(a / b);')
    expect(js).toContain('q = Math.trunc(q / 2);')
    expect(js).toContain('a / 2.0')
    expect(js).toContain('"x/y " + Math.trunc(a / b)')
    // Wie in Java von links nach rechts: (x * x) / 2 und (a / b) * 2.5
    const chains = generateCode(
      { caption: '', elements: [s('int x = 3'), s('int b = 2'), s('int y = x * x / 2'), s('double d = x / b * 2.5'), s('double e = 2.5 * x / b'), s('int r = x * b % 2')] },
      'javascript',
    )
    expect(chains).toContain('let y = Math.trunc(x * x / 2);')
    expect(chains).toContain('let d = Math.trunc(x / b) * 2.5;')
    expect(chains).toContain('let e = 2.5 * x / b;')
    expect(chains).toContain('let r = x * b % 2;')
  })
})

describe('Codegenerierung: 2D-Arrays', () => {
  const stmt = (t: string) => makeElement(ElementType.anweisung, { textLines: [t] })
  const doc = {
    caption: 'Kino',
    elements: [
      stmt('boolean[][] sitze = new boolean[3][4]'),
      stmt('int[][] t = {{1, 2}, {3, 4}}'),
      makeElement(ElementType.forSchleife, { textLines: ['int r = 0', 'r < sitze.length', 'r++'], loopBody: [
        makeElement(ElementType.forSchleife, { textLines: ['int p = 0', 'p < sitze[r].length', 'p++'], loopBody: [stmt('sitze[r][p] = true')] }),
      ] }),
    ],
  }

  it('übersetzt Anlegen und Längen in alle Zielsprachen', () => {
    const java = generateCode(doc, 'java')
    expect(java).toContain('boolean[][] sitze = new boolean[3][4];')
    expect(java).toContain('r < sitze.length;')
    const python = generateCode(doc, 'python')
    expect(python).toContain('sitze = [[False] * 4 for _ in range(3)]')
    expect(python).toContain('t = [[1, 2], [3, 4]]')
    expect(python).toContain('for p in range(len(sitze[r])):')
    const js = generateCode(doc, 'javascript')
    expect(js).toContain('let sitze = Array.from({ length: 3 }, () => new Array(4).fill(false));')
    expect(js).toContain('let t = [[1, 2], [3, 4]];')
  })
})

describe('Codegenerierung: String-Methoden', () => {
  const doc = {
    caption: 'Wort',
    elements: [
      makeElement(ElementType.anweisung, {
        textLines: ['output: w.length() + w.charAt(w.length() - 1) + w.substring(1, 3) + w.substring(2) + w.indexOf("a") + w.trim().toUpperCase()'],
      }),
      makeElement(ElementType.anweisung, { textLines: ['boolean b = w.contains("x")'] }),
    ],
  }

  it('übersetzt sie nach Python und JavaScript', () => {
    const python = generateCode(doc, 'python')
    expect(python).toContain('len(w)')
    expect(python).toContain('w[len(w) - 1]')
    expect(python).toContain('w[1:3]')
    expect(python).toContain('w[2:]')
    expect(python).toContain('w.find("a")')
    expect(python).toContain('w.strip().upper()')
    expect(python).toContain('("x" in w)')
    const js = generateCode(doc, 'javascript')
    expect(js).toContain('w.length + w.charAt(w.length - 1)')
    expect(js).toContain('w.includes("x")')
  })
})
