import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { LiveLabels } from '../src/core/codeGenerator'
import { setTextLines, insertAfterSibling } from '../src/core/editing'
import { parseLiveJava } from '../src/core/javaParser'
import { documentFromJava, mergeLiveJava, plainLiveJava, type JavaForm } from '../src/core/liveSource'
import { ElementType, makeElement, type VSDocument } from '../src/core/model'
import { decodeDocument } from '../src/core/xmlCodec'
import { indentJava } from '../src/core/javaIndent'

const labels: LiveLabels = { condition: 'Bedingung', selector: 'Wert', code: 'Dein Code', start: 'Startwert', step: 'Schritt', end: 'Ende' }
const parse = (src: string, subprograms?: Set<string>) => parseLiveJava(src, labels, { subprograms })
const doc = (src: string): VSDocument => documentFromJava({ caption: '', elements: [] }, parse(src))
const forms: JavaForm[] = [
  { asClass: false, withMain: false },
  { asClass: false, withMain: true },
  { asClass: true, withMain: false },
  { asClass: true, withMain: true },
]
const types = (src: string) => parse(src).elements.map((e) => e.type)

/** Alle Struktogramme im Repo: Beispiele, Lektionen, Übungen. */
function diagramFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue
    const path = join(dir, name)
    if (statSync(path).isDirectory()) diagramFiles(path, out)
    else if (name.endsWith('.visustruct')) out.push(path)
  }
  return out
}

describe('Java tippen → Struktogramm', () => {
  it('der Knopf „Einrücken“ lässt erzeugten Code unverändert', () => {
    for (const file of diagramFiles(join(__dirname, '..', '..'))) {
      const original = decodeDocument(readFileSync(file, 'utf8'))
      for (const form of forms) {
        const code = plainLiveJava(original, labels, form)
        expect(indentJava(code), `${file} ${JSON.stringify(form)}`).toBe(code)
      }
    }
  })

  it('jedes Struktogramm im Repo: Code → Struktogramm → derselbe Code', () => {
    const files = diagramFiles(join(__dirname, '..', '..'))
    expect(files.length).toBeGreaterThan(100)
    for (const file of files) {
      const original = decodeDocument(readFileSync(file, 'utf8'))
      for (const form of forms) {
        const code = plainLiveJava(original, labels, form)
        const back = documentFromJava(original, parse(code))
        expect(plainLiveJava(back, labels, form), `${file} ${JSON.stringify(form)}`).toBe(code)
        expect(back.caption, file).toBe(original.caption)
      }
      const code = plainLiveJava(original, labels)
      const parsed = parse(code)
      // Fehlendes `;` erzeugt der Generator selbst bei Pseudocode wie „Switch on the kettle“.
      expect(parsed.problems.filter((p) => p.arg !== ';'), file).toEqual([])
    }
  })

  it('Grundformen werden zu den passenden Kästen', () => {
    const src = [
      'int x = 5;',
      'System.out.println("Hallo " + x);',
      'if (x > 3) { x--; } else { x++; }',
      'while (x < 10) { x++; }',
      'do { x--; } while (x > 0);',
      'for (int i = 0; i < 3; i++) { x += i; }',
      'while (true) { break; }',
      'switch (x) { case 1 -> { x = 2; } default -> { x = 0; } }',
    ].join('\n')
    expect(types(src)).toEqual([
      ElementType.anweisung,
      ElementType.anweisung,
      ElementType.verzweigung,
      ElementType.whileSchleife,
      ElementType.doUntilSchleife,
      ElementType.forSchleife,
      ElementType.endlosschleife,
      ElementType.fallauswahl,
    ])
    const els = parse(src).elements
    expect(els[0].textLines).toEqual(['int x = 5'])
    expect(els[1].textLines).toEqual(['output: "Hallo " + x'])
    expect(els[5].textLines).toEqual(['int i = 0', 'i < 3', 'i++'])
    expect(els[7].cases?.map((c) => c.name)).toEqual(['1', 'default'])
  })

  it('println ist schon beim Tippen eine Ausgabe', () => {
    expect(parse('System.out.println();').elements[0].textLines).toEqual(['output: '])
    expect(parse('System.out.println(').elements[0].textLines).toEqual(['output: '])
    expect(parse('System.out.println("Hal').elements[0].textLines).toEqual(['output: "Hal'])
    expect(plainLiveJava(doc('System.out.println();'), labels)).toBe('System.out.println();')
  })

  it('Eingabe mit Hinweis wird ein Eingabe-Kasten', () => {
    const els = parse('System.out.println("Wie alt bist du?");\nint alter = scanner.nextInt();').elements
    expect(els.map((e) => e.textLines)).toEqual([['input: int alter "Wie alt bist du?"']])
    expect(parse('System.out.println("n: ");\nint n = scanner.nextInt();').elements[0].textLines).toEqual(['input: int n'])
    expect(parse('String w = scanner.nextLine();').elements[0].textLines).toEqual(['input: String w'])
  })

  it('Klasse mit main und Unterprogramm-Kopf', () => {
    const cls = parse('import java.util.Scanner;\npublic class A {\n  public static void main(String[] args) {\n    int x = 1;\n  }\n}')
    expect(cls.caption).toBeUndefined()
    expect(cls.elements[0].textLines).toEqual(['int x = 1'])
    const method = parse('public static int quadrat(int x) {\n    return x * x;\n}')
    expect(method.caption).toBe('int quadrat(int x)')
    expect(method.elements[0].textLines).toEqual(['return x * x'])
  })

  it('Klasse und main: Titel = Klassenname, in beide Richtungen', () => {
    const doc0: VSDocument = { caption: 'Rechner', elements: [makeElement(ElementType.anweisung, { textLines: ['input: int x'] })] }
    expect(plainLiveJava(doc0, labels, { asClass: true, withMain: true })).toBe(
      [
        'import java.util.Scanner;',
        '',
        'public class Rechner {',
        '    public static void main(String[] args) {',
        '        Scanner scanner = new Scanner(System.in);',
        '',
        '        System.out.println("x: ");',
        '        int x = scanner.nextInt();',
        '    }',
        '}',
      ].join('\n'),
    )
    // Der Import steht auch um `main` herum ganz oben, im Snippet in der ersten Zeile.
    expect(plainLiveJava(doc0, labels, { asClass: false, withMain: true }).split('\n').slice(0, 3)).toEqual([
      'import java.util.Scanner;',
      '',
      'public static void main(String[] args) {',
    ])
    expect(plainLiveJava(doc0, labels).split('\n')[0]).toBe('import java.util.Scanner;')
    // Klassenname tippen ändert den Titel …
    expect(documentFromJava(doc0, parse('public class Taschenrechner {\n}')).caption).toBe('Taschenrechner')
    // … aber aus „Mein Programm“ wird `Mein_Programm`, und der Titel bleibt.
    expect(documentFromJava({ ...doc0, caption: 'Mein Programm' }, parse('public class Mein_Programm {\n}')).caption).toBe('Mein Programm')
    // Klasse ohne main: Anweisungen direkt in der Klasse.
    expect(parse('public class A {\n    int x = 1;\n}').elements[0].textLines).toEqual(['int x = 1'])
  })

  it('Scanner ohne import ist ein Fehler, wie bei javac', () => {
    const keys = (src: string) => parse(src).problems.map((p) => p.key)
    expect(keys('Scanner scanner = new Scanner(System.in);\nint x = scanner.nextInt();')).toEqual(['web_parse_missing_import'])
    expect(keys('import java.util.Scanner;\nScanner scanner = new Scanner(System.in);')).toEqual([])
    expect(keys('import java.util.*;\npublic class A {\n    public static void main(String[] args) {\n        Scanner s = new Scanner(System.in);\n    }\n}')).toEqual([])
    // Nur im Kommentar oder in einem Text zählt nicht.
    expect(keys('// import java.util.Scanner;\nScanner s = new Scanner(System.in);')).toEqual(['web_parse_missing_import'])
    expect(keys('System.out.println("Scanner");')).toEqual([])
  })

  it('Aufruf eines Unterprogramms aus einem anderen Reiter', () => {
    expect(parse('int y = quadrat(4);', new Set(['quadrat'])).elements[0].type).toBe(ElementType.aufruf)
    expect(parse('int y = quadrat(4);').elements[0].type).toBe(ElementType.anweisung)
  })

  it('klassisches switch mit break', () => {
    const els = parse('switch (n) {\n  case 1:\n    x = 1;\n    break;\n  default:\n    x = 0;\n}').elements
    expect(els[0].cases?.map((c) => [c.name, c.elements.map((e) => e.textLines[0])])).toEqual([
      ['1', ['x = 1']],
      ['default', ['x = 0']],
    ])
  })

  it('unfertiger Code beim Tippen: Struktogramm entsteht trotzdem', () => {
    // Nach `if (x > 0) {` ist die Verzweigung schon da.
    const open = parse('if (x > 0) {')
    expect(open.elements.map((e) => e.type)).toEqual([ElementType.verzweigung])
    expect(open.problems.map((p) => p.arg)).toEqual(['}'])
    // Fehlende `)` und fehlendes `;`.
    const half = parse('if (x > 0 {\n    System.out.println(x)\n}')
    expect(half.elements[0].textLines).toEqual(['x > 0'])
    expect(half.elements[0].cases![0].elements[0].textLines).toEqual(['output: x'])
    expect(half.problems.map((p) => p.arg)).toEqual([')', ';'])
    // Nur das Schlüsselwort.
    expect(types('while')).toEqual([ElementType.whileSchleife])
    expect(types('for (int i = 0; i <')).toEqual([ElementType.forSchleife])
    // Offene Zeichenkette.
    const str = parse('System.out.println("Hallo')
    expect(str.elements).toHaveLength(1)
    expect(str.problems.some((p) => p.key === 'web_parse_unclosed_string')).toBe(true)
    // Zu viele Klammern.
    expect(parse('x = 1;\n}').problems.map((p) => p.key)).toEqual(['web_parse_extra'])
  })

  it('Swing: Lambda und anonyme Klasse mit Rumpf sind eine Anweisung', () => {
    const lambda = parse('knopf.addActionListener(e -> {\n    knopf.setText("Ich wurde geklickt");\n});\nfenster.setVisible(true);')
    expect(lambda.problems).toEqual([])
    expect(lambda.elements.map((e) => e.textLines)).toEqual([
      ['knopf.addActionListener(e -> { knopf.setText("Ich wurde geklickt"); })'],
      ['fenster.setVisible(true)'],
    ])
    const anonym = parse(
      'knopf.addActionListener(new ActionListener() {\n    public void actionPerformed(ActionEvent e) {\n        knopf.setText("Ich wurde geklickt");\n    }\n});',
    )
    expect(anonym.problems).toEqual([])
    expect(anonym.elements).toHaveLength(1)
    // Noch nicht fertig getippt: Die fehlende `}` wird gemeldet.
    expect(parse('knopf.addActionListener(e -> {\n    knopf.setText("x");').problems.map((p) => p.arg)).toContain('}')
  })

  it('try/catch/finally ist ein Anweisungskasten', () => {
    const r = parse('try {\n    int z = Integer.parseInt(text);\n} catch (NumberFormatException e) {\n    System.out.println("Keine Zahl");\n} finally {\n    fertig = true;\n}\nSystem.out.println("Weiter");')
    expect(r.problems).toEqual([])
    expect(r.elements.map((e) => e.textLines)).toEqual([
      ['try { int z = Integer.parseInt(text); } catch (NumberFormatException e) { System.out.println("Keine Zahl"); } finally { fertig = true; }'],
      ['output: "Weiter"'],
    ])
    expect(parse('try {\n    int z = 1;').problems.map((p) => p.arg)).toEqual(['}'])
  })

  it('Platzhalter wie „Bedingung“ gelten als leer und werden markiert', () => {
    const src = 'if (Bedingung) {\n    // Dein Code\n}'
    const p = parse(src)
    expect(p.elements[0].textLines).toEqual([''])
    expect(p.placeholders.map((r) => src.slice(r.from, r.to))).toEqual(['Bedingung', '// Dein Code'])
    expect(p.elements[0].cases![0].elements[0].textLines).toEqual(['ø'])
  })

  it('Zeilen der Elemente für die Markierung', () => {
    const p = parse('int x = 1;\nwhile (x < 3) {\n    x++;\n}')
    expect(p.spans).toEqual([
      { path: [0], from: 0, to: 0 },
      { path: [1], from: 1, to: 3 },
      { path: [1, 0, 0], from: 2, to: 2 },
    ])
  })
})

describe('Struktogramm ändern → getippter Code bleibt', () => {
  const typed = [
    '// Mein erstes Programm',
    'int x = 1; // Startwert',
    '',
    'while (x < 10) {',
    '    // verdoppeln',
    '    x = x * 2;',
    '}',
    'System.out.println(x);',
  ].join('\n')
  const before = doc(typed)

  it('Text eines Kastens ändern: Kommentare bleiben', () => {
    const after = setTextLines(before, [1, 0, 0], ['x = x * 3'])
    expect(mergeLiveJava(typed, before, after, labels)).toBe(typed.replace('x = x * 2;', 'x = x * 3;'))
    // Der Kommentar am Zeilenende wandert mit.
    const start = setTextLines(before, [0], ['int x = 2'])
    expect(mergeLiveJava(typed, before, start, labels)).toBe(typed.replace('int x = 1;', 'int x = 2;'))
  })

  it('Element einfügen und löschen', () => {
    const added = insertAfterSibling(before, makeElement(ElementType.anweisung, { textLines: ['output: "fertig"'] }), [2])
    expect(mergeLiveJava(typed, before, added, labels)).toBe(typed + '\nSystem.out.println("fertig");')
    const removed: VSDocument = { ...before, elements: before.elements.slice(0, 2) }
    expect(mergeLiveJava(typed, before, removed, labels)).toBe(typed.split('\n').slice(0, -1).join('\n'))
  })

  it('unveränderter erzeugter Code wird einfach neu erzeugt', () => {
    const code = plainLiveJava(before, labels)
    const after = setTextLines(before, [0], ['int x = 3'])
    expect(mergeLiveJava(code, before, after, labels)).toBe(plainLiveJava(after, labels))
  })

  it('Farben der Kästen bleiben beim Tippen erhalten', () => {
    const colored: VSDocument = { ...before, elements: before.elements.map((e, i) => (i === 1 ? { ...e, backgroundColor: { r: 1, g: 0, b: 0, a: 1 } } : e)) }
    const next = documentFromJava(colored, parse(typed.replace('x < 10', 'x < 20')))
    expect(next.elements[1].backgroundColor).toEqual({ r: 1, g: 0, b: 0, a: 1 })
    expect(next.elements[1].textLines).toEqual(['x < 20'])
  })
})

describe('Scanner ohne Variable', () => {
  const L = { code: 'Dein Code' } as Parameters<typeof parseLiveJava>[1]
  const main = (body: string) => `import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n${body}\n  }\n}`
  const keys = (src: string) => parseLiveJava(src, L).problems.filter((p) => p.key === 'web_parse_missing_scanner').map((p) => [p.key, p.arg])

  it('meldet eingabe.next() ohne angelegten Scanner', () => {
    expect(keys(main('    String s = eingabe.next();'))).toEqual([['web_parse_missing_scanner', 'Scanner eingabe = new Scanner(System.in);']])
  })

  it('nimmt angelegte Scanner, Attribute und Parameter an', () => {
    expect(keys(main('    Scanner eingabe = new Scanner(System.in);\n    String s = eingabe.next();\n    while (eingabe.hasNextInt()) eingabe.nextInt();'))).toEqual([])
    expect(keys(`import java.util.Scanner;\n\npublic class Main {\n  static Scanner sc = new Scanner(System.in);\n\n  static int lies(Scanner in) {\n    return in.nextInt();\n  }\n\n  public static void main(String[] args) {\n    String s = sc.nextLine();\n  }\n}`)).toEqual([])
  })
})
