import { describe, expect, it } from 'vitest'
import { addClass, addMember, deleteClass, deleteMember, exampleJava, parseClasses, parseUmlLine, relations, renameClass, replaceMember, setAbstract, setSuperclass, umlText } from '../src/core/classModel'

const byName = (source: string, name: string) => parseClasses(source).find((c) => c.name === name)!

describe('Klassendiagramm aus Java', () => {
  it('liest das Beispiel Tier, Hund, Besitzer', () => {
    const classes = parseClasses(exampleJava)
    expect(classes.map((c) => c.name)).toEqual(['Tier', 'Hund', 'Besitzer'])
    expect(classes[0].members.map(umlText)).toEqual(['- name: String', '- alter: int', '+ Tier(name: String, alter: int)', '+ getName(): String', '+ lautGeben(): void'])
    expect(classes[1].superclass).toBe('Tier')
    expect(relations(classes)).toEqual([
      { kind: 'extends', from: 'Hund', to: 'Tier' },
      { kind: 'association', from: 'Besitzer', to: 'Hund', role: 'hunde', multiplicity: '0..*' },
    ])
  })

  it('kennt Interfaces, abstrakte Klassen, static und Arrays', () => {
    const src = `interface Haustier { void streicheln(); }
abstract class Tier implements Haustier {
  protected static int anzahl = 0;
  int[] werte = {1, 2}, mehr;
  @Override public void streicheln() { if (true) { } }
  abstract String laut();
}
class Zoo { private Tier[] tiere; Tier chef; }`
    const [h, tier, zoo] = parseClasses(src)
    expect(h.kind).toBe('interface')
    expect(h.members[0]).toMatchObject({ name: 'streicheln', isAbstract: true, visibility: '+' })
    expect(tier.isAbstract).toBe(true)
    expect(tier.interfaces).toEqual(['Haustier'])
    expect(tier.members.map(umlText)).toEqual(['# anzahl: int', '~ werte: int[]', '~ mehr: int[]', '+ streicheln(): void', '~ laut(): String'])
    expect(tier.members[0].isStatic).toBe(true)
    expect(tier.members[1].shared).toBe(true)
    expect(tier.members[4].isAbstract).toBe(true)
    expect(relations([h, tier, zoo]).map((r) => `${r.from}-${r.kind}-${r.to}${r.multiplicity ? ' ' + r.multiplicity : ''}`)).toEqual([
      'Tier-implements-Haustier',
      'Zoo-association-Tier 0..*',
      'Zoo-association-Tier 1',
    ])
  })

  it('übersteht halb getippten Code und Kommentare', () => {
    const src = `// class Falsch {}\npublic class Auto {\n  private String marke; /* } */\n  public void fahren() {\n    String s = "}";\n`
    const [auto] = parseClasses(src)
    expect(auto.name).toBe('Auto')
    expect(auto.members.map((m) => m.name)).toEqual(['marke', 'fahren'])
  })
})

describe('UML-Zeile lesen', () => {
  it('versteht UML- und Java-Schreibweise', () => {
    expect(parseUmlLine('- name: String')).toMatchObject({ kind: 'field', visibility: '-', name: 'name', type: 'String' })
    expect(parseUmlLine('int alter')).toMatchObject({ kind: 'field', name: 'alter', type: 'int' })
    expect(parseUmlLine('+ bellen(laut: int, wie: String): boolean')).toMatchObject({
      kind: 'method',
      name: 'bellen',
      type: 'boolean',
      params: [{ name: 'laut', type: 'int' }, { name: 'wie', type: 'String' }],
    })
    expect(parseUmlLine('public void fressen(int menge)')).toMatchObject({ kind: 'method', visibility: '+', name: 'fressen', type: 'void', params: [{ name: 'menge', type: 'int' }] })
    expect(parseUmlLine('static zaehler: int')).toMatchObject({ isStatic: true, name: 'zaehler' })
    expect(parseUmlLine('')).toBeUndefined()
  })
})

describe('Java aus dem Klassendiagramm', () => {
  it('legt Klassen an und schreibt Attribute und Methoden hinein', () => {
    let src = addClass('', 'Hund')
    expect(src).toBe('public class Hund {\n}\n')
    src = addMember(src, byName(src, 'Hund'), '- name: String')
    src = addMember(src, byName(src, 'Hund'), '+ bellen(): void')
    src = addMember(src, byName(src, 'Hund'), '- alter: int')
    src = addMember(src, byName(src, 'Hund'), '+ getAlter(): int')
    expect(src).toBe(`public class Hund {
    private String name;
    private int alter;

    public void bellen() {
        // Dein Code
    }

    public int getAlter() {
        return 0;
    }
}
`)
    src = addClass(src, 'Tier')
    src = setSuperclass(src, byName(src, 'Hund'), 'Tier')
    expect(src.startsWith('public class Hund extends Tier {')).toBe(true)
    src = setSuperclass(src, byName(src, 'Hund'), undefined)
    expect(src.startsWith('public class Hund {')).toBe(true)
    src = setAbstract(src, byName(src, 'Tier'), true)
    expect(src).toContain('public abstract class Tier {')
  })

  it('ändert nur den Kopf: Rumpf und Startwert bleiben', () => {
    let src = exampleJava
    const tier = byName(src, 'Tier')
    src = replaceMember(src, tier, tier.members[1], '- alter: double')
    src = replaceMember(src, byName(src, 'Tier'), byName(src, 'Tier').members[4], '+ lautGeben(wie: String): void')
    expect(src).toContain('    private double alter;\n')
    expect(src).toContain('    public void lautGeben(String wie) {\n        System.out.println("...");')
    // ohne Sichtbarkeit getippt: alte bleibt
    src = replaceMember(src, byName(src, 'Tier'), byName(src, 'Tier').members[0], 'spitzname: String')
    expect(src).toContain('    private String spitzname;\n')
  })

  it('benennt Klasse samt Konstruktor um und löscht Teile', () => {
    let src = renameClass(exampleJava, byName(exampleJava, 'Tier'), 'Lebewesen')
    expect(src).toContain('public class Lebewesen {')
    expect(src).toContain('public Lebewesen(String name, int alter) {')
    const getter = byName(src, 'Lebewesen').members.find((m) => m.name === 'getName')!
    src = deleteMember(src, getter)
    expect(src).not.toContain('getName')
    src = deleteClass(src, byName(src, 'Besitzer'))
    expect(parseClasses(src).map((c) => c.name)).toEqual(['Lebewesen', 'Hund'])
    expect(src.endsWith('}\n')).toBe(true)
  })

  it('Interface-Methoden ohne Rumpf', () => {
    let src = addClass('', 'Haustier', 'interface')
    src = addMember(src, byName(src, 'Haustier'), 'streicheln(): void')
    expect(src).toBe('public interface Haustier {\n    void streicheln();\n}\n')
  })
})

describe('Modifier der Klasse', () => {
  it('public und final setzen und lesen', async () => {
    const { classModifiers, setFinal, setPublic, setAbstract } = await import('../src/core/classModel')
    let src = 'public abstract class Tier {\n}\n'
    const c = () => parseClasses(src)[0]
    src = setFinal(src, c(), true)
    expect(src).toBe('public final class Tier {\n}\n')
    expect(classModifiers(src, c())).toEqual({ isPublic: true, isFinal: true })
    src = setPublic(src, c(), false)
    expect(src).toBe('final class Tier {\n}\n')
    src = setPublic(setFinal(src, c(), false), parseClasses(setFinal(src, c(), false))[0], true)
    expect(src).toBe('public class Tier {\n}\n')
    expect(setAbstract(src, c(), true)).toBe('public abstract class Tier {\n}\n')
  })
})

describe('Neue Attribute', () => {
  it('ohne Sichtbarkeit private, Methoden public', () => {
    let src = 'public class Hund {\n}\n'
    src = addMember(src, parseClasses(src)[0], 'name: String')
    src = addMember(src, parseClasses(src)[0], 'bellen(): void')
    expect(src).toContain('private String name;')
    expect(src).toContain('public void bellen()')
  })
})
