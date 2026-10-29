import { describe, expect, it } from 'vitest'
import { addInterface, parseClasses, removeInterface, setFieldType } from '../src/core/classModel'
import { associations, ensureImport, fieldNameFor, isMany, renameInfo, withInfo } from '../src/core/umlRelations'

const code = `class Besitzer {
    private ArrayList<Hund> hunde = new ArrayList<>();
}
class Hund {
    private Besitzer besitzer;
    private String name;
}
interface Laut {}
class Katze {}
`

describe('umlRelations', () => {
  it('erkennt viele an der Obergrenze', () => {
    expect(['1', '0..1'].map(isMany)).toEqual([false, false])
    expect(['*', '0..*', '1..*', '2', '1..n'].map(isMany)).toEqual([true, true, true, true, true])
  })

  it('macht aus zwei Attributen, die aufeinander zeigen, eine Linie mit zwei Pfeilen', () => {
    const [r, ...rest] = associations(parseClasses(code))
    expect(rest).toEqual([])
    expect(r).toMatchObject({ from: 'Besitzer', to: 'Hund', role: 'hunde', multiplicity: '0..*', navFrom: 'navigable', navTo: 'navigable', sourceRole: 'besitzer', sourceMultiplicity: '1' })
  })

  it('nimmt das Attribut mit UML-Zusatz nach vorne (Raute am Ganzen)', () => {
    const [r] = associations(parseClasses(code), { 'Hund.besitzer': { kind: 'composition', multiplicity: '0..1' } })
    expect(r).toMatchObject({ key: 'Hund.besitzer', from: 'Hund', kind: 'composition', multiplicity: '0..1' })
    // Eine Multiplizität, die nicht zum Typ passt, gilt nicht.
    const [s] = associations(parseClasses(code), { 'Besitzer.hunde': { name: 'führt aus', multiplicity: '1' } })
    expect(s).toMatchObject({ from: 'Besitzer', name: 'führt aus', multiplicity: '0..*' })
  })

  it('schreibt UML-Zusatz ohne leere Felder', () => {
    let uml = withInfo({}, 'A.b', { kind: 'aggregation', name: '' })
    expect(uml).toEqual({ 'A.b': { kind: 'aggregation' } })
    uml = withInfo(uml, 'A.b', { kind: 'association' })
    expect(uml).toEqual({})
    expect(renameInfo({ 'A.b': { name: 'x' } }, 'A.b', 'A.c')).toEqual({ 'A.c': { name: 'x' } })
  })

  it('findet freie Attributnamen', () => {
    const hund = parseClasses(code).find((c) => c.name === 'Hund')!
    expect(fieldNameFor(hund, 'Besitzer', false)).toBe('besitzer2')
    expect(fieldNameFor(hund, 'Katze', true)).toBe('katzeListe')
  })

  it('ergänzt Imports nur einmal', () => {
    const text = 'package a;\n\nimport java.util.List;\n\npublic class X {}\n'
    const once = ensureImport(text, 'b.Y')
    expect(once).toBe('package a;\n\nimport java.util.List;\nimport b.Y;\n\npublic class X {}\n')
    expect(ensureImport(once, 'b.Y')).toBe(once)
    expect(ensureImport('package a;\n\npublic class X {}\n', 'b.Y')).toBe('package a;\n\nimport b.Y;\n\npublic class X {}\n')
  })

  it('ändert implements und den Typ eines Attributs', () => {
    const katze = () => parseClasses(source).find((c) => c.name === 'Katze')!
    let source = code
    source = addInterface(source, katze(), 'Laut')
    expect(source).toContain('class Katze implements Laut {}')
    source = addInterface(source, katze(), 'Comparable')
    expect(source).toContain('class Katze implements Laut, Comparable {}')
    source = removeInterface(source, katze(), 'Laut')
    expect(source).toContain('class Katze implements Comparable {}')
    source = removeInterface(source, katze(), 'Comparable')
    expect(source).toContain('class Katze {}')
    const hund = parseClasses(code).find((c) => c.name === 'Hund')!
    const field = hund.members.find((m) => m.name === 'besitzer')!
    expect(setFieldType(code, field, 'ArrayList<Besitzer>', 'new ArrayList<>()')).toContain('private ArrayList<Besitzer> besitzer = new ArrayList<>();')
    const besitzer = parseClasses(code).find((c) => c.name === 'Besitzer')!
    expect(setFieldType(code, besitzer.members[0], 'Hund')).toContain('    private Hund hunde;\n')
  })
})

describe('dependencies', () => {
  it('new in einer Methode ist «create», ein Parameter «use», ein Attribut keine Abhängigkeit', async () => {
    const { parseClasses } = await import('../src/core/classModel')
    const { dependencies } = await import('../src/core/umlRelations')
    const texts: Record<string, string> = {
      Spielstarter: 'public class Spielstarter {\n    public static void main(String[] args) {\n        Ratespiel spiel = new Ratespiel();\n        // new Punkte() zählt nicht\n    }\n}\n',
      Ratespiel: 'public class Ratespiel {\n    private Punkte punkte;\n    public void zeige(Anzeige a) {\n    }\n}\n',
      Punkte: 'public class Punkte {\n}\n',
      Anzeige: 'public class Anzeige {\n}\n',
    }
    const classes = Object.values(texts).flatMap((x) => parseClasses(x))
    const deps = dependencies(classes, (c) => texts[c.name])
    expect(deps).toEqual([
      { from: 'Spielstarter', to: 'Ratespiel', kind: 'create', methods: ['main()'] },
      { from: 'Ratespiel', to: 'Anzeige', kind: 'use', methods: ['zeige()'] },
    ])
  })
})
