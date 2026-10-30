/**
 * VisuObject: Objektdiagramm. Ein Objekt hat die Attribute seiner Klasse (samt Oberklassen, ohne static);
 * ein Referenzattribut zeigt mit dem Namen eines anderen Objekts auf dieses (`team = t1`, `spieler = [s1, s2]`).
 */

import { associationTarget, type UmlClass } from './classModel'

export interface ObjectField {
  name: string
  type: string
  /** Klasse, auf die ein Referenzattribut zeigt. */
  target?: string
  /** Liste oder Array von Referenzen. */
  many: boolean
}

/** Attribute eines Objekts der Klasse `cls`, Oberklassen zuerst (wie in Java im Speicher). */
export function objectFields(classes: UmlClass[], cls: string): ObjectField[] {
  const byName = new Map(classes.map((c) => [c.name, c]))
  const chain: UmlClass[] = []
  const seen = new Set<string>()
  for (let c = byName.get(cls); c && !seen.has(c.name); c = c.superclass ? byName.get(c.superclass) : undefined) {
    seen.add(c.name)
    chain.unshift(c)
  }
  const out: ObjectField[] = []
  for (const c of chain)
    for (const m of c.members) {
      if (m.kind !== 'field' || m.isStatic || out.some((f) => f.name === m.name)) continue
      const t = associationTarget(m.type)
      out.push({ name: m.name, type: m.type, many: t.many, ...(byName.has(t.name) ? { target: t.name } : {}) })
    }
  return out
}

/** Startwert wie in Java, wenn ein Objekt neu entsteht. */
export function javaDefault(type: string): string {
  if (/^(int|long|short|byte)$/.test(type)) return '0'
  if (/^(double|float)$/.test(type)) return '0.0'
  if (type === 'boolean') return 'false'
  if (type === 'char') return "''"
  return 'null'
}

/** Namen der Objekte, auf die ein Wert zeigt: `t1` oder `[s1, s2]`; `null` und leer = keine. */
export function refNames(value: string | undefined): string[] {
  const v = (value ?? '').trim()
  if (!v || v === 'null') return []
  const inner = /^\[(.*)\]$/s.exec(v)?.[1] ?? v
  return inner
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^[\p{L}_$][\p{L}\p{N}_$]*$/u.test(s) && s !== 'null')
}

/** Neuer Wert nach dem Verbinden: Einzelreferenz ersetzt, Liste hängt an (ohne doppelt). */
export function linkedValue(field: ObjectField, value: string | undefined, target: string): string {
  if (!field.many) return target
  const names = refNames(value)
  return `[${(names.includes(target) ? names : [...names, target]).join(', ')}]`
}

/** Ist `cls` die Klasse `target` oder erbt davon (bzw. implementiert es)? */
export function isA(classes: UmlClass[], cls: string, target: string): boolean {
  const byName = new Map(classes.map((c) => [c.name, c]))
  const seen = new Set<string>()
  const walk = (name: string | undefined): boolean => {
    if (!name || seen.has(name)) return false
    if (name === target) return true
    seen.add(name)
    const c = byName.get(name)
    return !!c && (walk(c.superclass) || c.interfaces.some(walk))
  }
  return walk(cls)
}

/** Freier Name wie in Java üblich: `spieler1`, `spieler2` … */
export function freeObjectName(cls: string, taken: string[]): string {
  const base = cls.charAt(0).toLowerCase() + cls.slice(1)
  for (let n = 1; ; n++) if (!taken.includes(`${base}${n}`)) return `${base}${n}`
}
