/**
 * VisuObject: Vorschläge nach dem Punkt für die eigenen Klassen des Projekts.
 * `Spieler s1 = new Spieler(); s1.` → Methoden und Attribute von Spieler (samt Oberklassen),
 * aber nur, was von der Stelle aus sichtbar ist: public überall, Package nur im selben Package,
 * protected im selben Package oder in Unterklassen, private nur in der Klasse selbst.
 */

import type { UmlMember } from './classModel'
import { membersOf, type JavaMember, type MemberLanguage, type OwnTypes } from './javaMembers'

export interface TypeInfo {
  name: string
  pkg: string
  superclass?: string
  interfaces: string[]
  members: UmlMember[]
}

export interface Place {
  /** Klasse, in der der Cursor steht. */
  cls?: string
  pkg: string
}

function toJavaMember(m: UmlMember): JavaMember {
  return {
    name: m.name,
    kind: m.kind === 'field' ? 'field' : 'method',
    params: m.params.length > 0,
    returns: m.type,
    description: m.kind === 'field' ? '' : m.params.map((p) => `${p.name}: ${p.type}`).join(', '),
  }
}

export function ownTypes(classes: TypeInfo[], here: Place, lang: MemberLanguage = 'de'): OwnTypes {
  const byName = new Map(classes.map((c) => [c.name, c]))
  const isSubclass = (sub: string | undefined, sup: string) => {
    const seen = new Set<string>()
    for (let c = sub ? byName.get(sub) : undefined; c && !seen.has(c.name); c = c.superclass ? byName.get(c.superclass) : undefined) {
      if (c.name === sup) return true
      seen.add(c.name)
    }
    return false
  }
  /** `inherited`: Mitglied einer Oberklasse; private wird nicht vererbt (`h.name` geht auch in Tier nicht, wenn h ein Hund ist). */
  const visible = (m: UmlMember, owner: TypeInfo, inherited: boolean) => {
    if (m.visibility === '+') return true
    if (m.visibility === '-') return !inherited && here.cls === owner.name
    if (owner.pkg === here.pkg) return true
    return m.visibility === '#' && isSubclass(here.cls, owner.name)
  }
  /** Eigene Klasse, dann Oberklassen und Interfaces; eine Oberklasse wie JFrame aus der Liste der Standardklassen. */
  const collect = (type: string, isStatic: boolean): JavaMember[] | undefined => {
    const start = byName.get(type)
    if (!start) return undefined
    const out: JavaMember[] = []
    const seen = new Set<string>()
    const keys = new Set<string>()
    const visit = (name: string, inherited: boolean) => {
      if (seen.has(name)) return
      seen.add(name)
      const c = byName.get(name)
      if (!c) {
        if (!isStatic) for (const m of membersOf(name, lang)) if (!keys.has(m.name)) (keys.add(m.name), out.push(m))
        return
      }
      for (const m of c.members) {
        if (m.kind === 'constructor' || m.isStatic !== isStatic || !visible(m, c, inherited)) continue
        // Überschriebene Methoden nur einmal (die der Unterklasse).
        const key = `${m.kind}:${m.name}:${m.params.map((p) => p.type).join(',')}`
        if (keys.has(key)) continue
        keys.add(key)
        out.push(toJavaMember(m))
      }
      if (c.superclass) visit(c.superclass, true)
      for (const i of c.interfaces) visit(i, true)
    }
    visit(type, false)
    return out
  }
  return { members: (type) => collect(type, false), statics: (type) => collect(type, true), thisType: here.cls }
}
