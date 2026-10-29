import { describe, expect, it } from 'vitest'
import { exampleProject, projectClasses } from '../src/core/javaProject'
import { classSource } from '../src/ui/objectNew'

const zoo = projectClasses(exampleProject())
const tier = zoo.find((c) => c.name === 'Tier')!

describe('objectNew', () => {
  it('schreibt eine Klasse wie der Eclipse-Assistent', () => {
    const text = classSource({ kind: 'class', pkg: 'haus', name: 'Katze', isPublic: true, isAbstract: false, isFinal: false, superclass: tier, interfaces: [], main: true, constructors: true, inherited: true, comment: true, author: 'Holger' })
    expect(text).toContain('package haus;')
    expect(text).toContain('import tiere.Tier;')
    expect(text).toContain('@author Holger')
    expect(text).toContain('public class Katze extends Tier {')
    expect(text).toContain('public Katze(String name, int alter) {\n        super(name, alter);')
    expect(text).toContain('public static void main(String[] args) {')
    expect(projectClasses({ name: 'x', packages: [], files: [{ path: 'haus/Katze.java', text }] })[0].superclass).toBe('Tier')
  })

  it('Interface mit extends, Klasse mit geerbten Methoden', () => {
    const iface = classSource({ kind: 'interface', pkg: '', name: 'Laut', isPublic: true, isAbstract: false, isFinal: false, interfaces: [], main: false, constructors: false, inherited: false, comment: false, author: '' })
    expect(iface).toBe('public interface Laut {\n}\n')
    const laut = projectClasses({ name: 'x', packages: [], files: [{ path: 'Laut.java', text: 'public interface Laut {\n    int lautstaerke();\n}\n' }] })[0]
    const cls = classSource({ kind: 'class', pkg: '', name: 'Kuh', isPublic: false, isAbstract: false, isFinal: true, interfaces: [laut], main: false, constructors: false, inherited: true, comment: false, author: '' })
    expect(cls).toContain('final class Kuh implements Laut {')
    expect(cls).toContain('@Override\n    public int lautstaerke() {\n        return 0;')
  })
})
