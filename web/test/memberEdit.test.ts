import { describe, expect, it } from 'vitest'
import { parseClasses } from '../src/core/classModel'
import { addFieldConstructor, addGettersSetters, addToString, classDoc, fieldInfo, parseParams, setClassDoc, setField, setMethod } from '../src/core/memberEdit'

const src = `/**
 * Ein Hund.
 */
public class Hund {
    private String name = "Bello";
    private static int anzahl;

    public void bellen() {
        System.out.println("Wuff");
    }
}
`
const cls = (s: string) => parseClasses(s)[0]

describe('memberEdit', () => {
  it('liest und schreibt Attribute mit Startwert und final', () => {
    const f = cls(src).members[0]
    expect(fieldInfo(src, f)).toEqual({ visibility: '-', name: 'name', type: 'String', isStatic: false, isFinal: false, init: '"Bello"' })
    const out = setField(src, f, { isFinal: true, visibility: '#' })
    expect(out).toContain('    protected final String name = "Bello";\n')
    expect(fieldInfo(out, cls(out).members[0]).isFinal).toBe(true)
  })

  it('ändert den Methodenkopf, der Rumpf bleibt; abstract macht ;', () => {
    const m = cls(src).members[2]
    let out = setMethod(src, cls(src), m, { type: 'String', name: 'laut', params: parseParams('mal: int')! })
    expect(out).toContain('public String laut(int mal) {\n        System.out.println("Wuff");')
    out = setMethod(out, cls(out), cls(out).members[2], { isAbstract: true })
    expect(out).toContain('public abstract String laut(int mal);')
    out = setMethod(out, cls(out), cls(out).members[2], { isAbstract: false })
    expect(out).toContain('public String laut(int mal) {\n        return null;\n    }')
  })

  it('Javadoc lesen und schreiben', () => {
    expect(classDoc(src, cls(src))).toBe('Ein Hund.')
    const out = setClassDoc(src, cls(src), 'Ein treuer Hund.\n@author Holger')
    expect(out.startsWith('/**\n * Ein treuer Hund.\n * @author Holger\n */\npublic class Hund {')).toBe(true)
    expect(setClassDoc(out, cls(out), '').startsWith('public class Hund {')).toBe(true)
  })

  it('erzeugt Konstruktor, Getter/Setter und toString wie Eclipse', () => {
    let out = addFieldConstructor(src, cls(src))
    expect(out).toContain('    public Hund(String name) {\n        this.name = name;\n    }\n}')
    out = addGettersSetters(out, cls(out))
    expect(out).toContain('public String getName() {\n        return name;\n    }')
    expect(out).toContain('public void setName(String name) {\n        this.name = name;\n    }')
    expect(addGettersSetters(out, cls(out))).toBe(out)
    out = addToString(out, cls(out))
    expect(out).toContain('return "Hund [" + "name=" + name + "]";')
    expect(parseClasses(out)[0].members.map((m) => m.name)).toEqual(['name', 'anzahl', 'bellen', 'Hund', 'getName', 'setName', 'toString'])
  })
})
