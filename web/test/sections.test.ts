import { describe, expect, it } from 'vitest'
import { addMember, parseClasses } from '../src/core/classModel'
import { keepSections, withSections } from '../src/core/sections'

const de = { fields: 'Attribute', refs: 'Referenzattribute', ctors: 'Konstruktor', methods: 'Methoden' }
const names = new Set(['Spieler', 'Mannschaft'])
const src = `public class Spieler {
    public int getPunkte() {
        return punkte;
    }

    private int punkte;
    /** Das Team. */
    private Mannschaft team;

    @Override
    public String toString() {
        return "";
    }
    public Spieler() {
    }
}
`

describe('Abschnitts-Kommentare', () => {
  it('ordnet Attribute, Referenzattribute, Konstruktor und Methoden', () => {
    const out = withSections(src, parseClasses(src)[0], names, de)
    expect(out).toBe(`public class Spieler {
    // Attribute
    private int punkte;

    // Referenzattribute
    /** Das Team. */
    private Mannschaft team;

    // Konstruktor
    public Spieler() {
    }

    // Methoden
    public int getPunkte() {
        return punkte;
    }

    @Override
    public String toString() {
        return "";
    }
}
`)
    // Zweimal ordnen ändert nichts mehr.
    expect(withSections(out, parseClasses(out)[0], names, de)).toBe(out)
  })
  it('neues Attribut aus dem Diagramm landet unter seinem Kommentar', () => {
    const start = withSections(src, parseClasses(src)[0], names, de)
    let next = addMember(start, parseClasses(start)[0], '- level: int')
    next = keepSections(next, 'Spieler', names, de)
    expect(next).toContain('// Attribute\n    private int punkte;\n    private int level;\n\n    // Referenzattribute')
    next = keepSections(addMember(next, parseClasses(next)[0], '- mitspieler: ArrayList<Spieler>'), 'Spieler', names, de)
    expect(next).toContain('private Mannschaft team;\n    private ArrayList<Spieler> mitspieler;\n\n    // Konstruktor')
  })
  it('leere Klasse bekommt alle vier Kommentare; ohne Kommentare bleibt alles', () => {
    const empty = 'public class A {\n}\n'
    expect(withSections(empty, parseClasses(empty)[0], names, de)).toBe('public class A {\n    // Attribute\n\n    // Referenzattribute\n\n    // Konstruktor\n\n    // Methoden\n}\n')
    expect(keepSections(src, 'Spieler', names, de)).toBe(src)
  })
})
