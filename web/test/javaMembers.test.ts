import { describe, expect, it } from 'vitest'
import { declaredType, memberCompletionsAt, receiverType } from '../src/core/javaMembers'
import { memberCompletion } from '../src/ui/javaEditor'

/** Vorschläge am Ende von `code`. */
function names(code: string, lang: 'de' | 'en' | 'pt' = 'de') {
  return memberCompletionsAt(code, code.length, lang)?.members.map((m) => m.name)
}

const program = (body: string) => `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        ${body}`

describe('Vorschläge nach dem Punkt', () => {
  it('Scanner mit beliebigem Namen: nextInt, nextLine …', () => {
    const list = names(program('Scanner eingabe = new Scanner(System.in);\n        int x = eingabe.'))
    expect(list).toEqual(expect.arrayContaining(['nextInt', 'nextLine', 'nextDouble', 'hasNextLine', 'next']))
  })

  it('angefangener Name: from zeigt hinter den Punkt', () => {
    const code = program('Scanner sc = new Scanner(System.in);\n        sc.nex')
    expect(memberCompletionsAt(code, code.length)?.from).toBe(code.length - 3)
  })

  it('String, String-Array und Element', () => {
    const decl = 'String name = "Ludwig";\n        String[] namen = {"a"};\n        '
    expect(names(program(decl + 'name.'))).toEqual(expect.arrayContaining(['length', 'charAt', 'equals', 'substring']))
    expect(names(program(decl + 'namen.'))).toEqual(['length'])
    expect(names(program(decl + 'namen[0].'))).toContain('charAt')
    expect(names(program(decl + 'args.'))).toEqual(['length'])
  })

  it('Ketten: eingabe.nextLine(). → String-Methoden, System.out. → println', () => {
    expect(names(program('Scanner e = new Scanner(System.in);\n        e.nextLine().'))).toContain('trim')
    expect(names(program('System.'))).toEqual(expect.arrayContaining(['out', 'in']))
    expect(names(program('System.out.'))).toEqual(expect.arrayContaining(['println', 'print', 'printf']))
    expect(names(program('"Hallo".'))).toContain('toUpperCase')
  })

  it('Klassen mit Punkt: Math, Integer, Color', () => {
    expect(names(program('double z = Math.'))).toEqual(expect.arrayContaining(['random', 'sqrt', 'pow', 'PI']))
    expect(names(program('int z = Integer.'))).toContain('parseInt')
    expect(names(program('knopf.setBackground(Color.'))).toContain('RED')
  })

  it('Swing: JFrame, JButton, JLabel, JTextField mit geerbten Methoden', () => {
    const swing = 'JFrame fenster = new JFrame("Hallo");\n        JButton knopf = new JButton("OK");\n        JTextField feld = new JTextField(10);\n        JLabel l = new JLabel();\n        '
    expect(names(program(swing + 'fenster.'))).toEqual(expect.arrayContaining(['setSize', 'setVisible', 'add', 'setLayout', 'setDefaultCloseOperation', 'setTitle']))
    expect(names(program(swing + 'knopf.'))).toEqual(expect.arrayContaining(['addActionListener', 'setText', 'setBackground']))
    expect(names(program(swing + 'feld.'))).toEqual(expect.arrayContaining(['getText', 'setText']))
    expect(names(program(swing + 'l.'))).toContain('setText')
    expect(names(program(swing + 'fenster.setDefaultCloseOperation(JFrame.'))).toEqual(['EXIT_ON_CLOSE'])
  })

  it('Typen aus for-each, catch und var', () => {
    expect(declaredType('for (String wort : woerter) {', 'wort')).toBe('String')
    expect(declaredType('} catch (NumberFormatException fehler) {', 'fehler')).toBe('NumberFormatException')
    expect(names('try { } catch (NumberFormatException fehler) {\n  fehler.')).toContain('getMessage')
    expect(declaredType('var sc = new Scanner(System.in);', 'sc')).toBe('Scanner')
    expect(declaredType('int[][] feld = new int[3][3];', 'feld')).toBe('int[][]')
    expect(receiverType('int[][] feld;', 'feld[0]')?.type).toBe('int[]')
  })

  it('Unbekanntes und Zahlen: keine Liste (die normalen Vorschläge bleiben)', () => {
    expect(names(program('int zahl = 3;\n        zahl.'))).toBeUndefined()
    expect(names(program('unbekannt.'))).toBeUndefined()
    expect(names(program('double d = 3.'))).toBeUndefined()
  })

  it('Beschreibung in der eingestellten Sprache, Englisch als Rückfall', () => {
    const code = program('Scanner eingabe = new Scanner(System.in);\n        eingabe.')
    const de = memberCompletionsAt(code, code.length, 'de')!.members.find((m) => m.name === 'nextInt')!
    const en = memberCompletionsAt(code, code.length, 'en')!.members.find((m) => m.name === 'nextInt')!
    expect(de.description).toBe('Ganze Zahl einlesen')
    expect(en.description).toBe('Read a whole number')
  })

  it('Vorschlag: Klammern, Felder ohne Klammern', () => {
    const code = program('Scanner eingabe = new Scanner(System.in);\n        String t = "";\n        String[] a = {};\n        ')
    const at = (expr: string) => memberCompletionsAt(code + expr, (code + expr).length)!.members
    const nextInt = memberCompletion(at('eingabe.').find((m) => m.name === 'nextInt')!)
    expect(nextInt.label).toBe('nextInt()')
    expect(nextInt.apply).toBe('nextInt()')
    expect(nextInt.detail).toBe('int · Ganze Zahl einlesen')
    expect(memberCompletion(at('t.').find((m) => m.name === 'charAt')!).label).toBe('charAt(…)')
    expect(memberCompletion(at('a.')[0]).apply).toBe('length')
  })
})
