/**
 * VisuObject: Beziehungen im Klassendiagramm.
 * Was Java kennt, steht im Code: ein Attribut vom Typ der anderen Klasse ist die Assoziation,
 * sein Name die Rolle, eine Liste oder ein Array heißt „viele“. Was nur UML kennt
 * (Aggregation, Komposition, Name mit Leserichtung, genaue Multiplizitäten, Rolle ohne Attribut)
 * steht in `uml` am Projekt, Schlüssel `Klasse.attribut`.
 */

import { associationTarget, relations, type UmlClass, type UmlMember } from './classModel'

export type AssocKind = 'association' | 'aggregation' | 'composition'
/** Navigierbarkeit eines Endes: Pfeilspitze, Kreuz × oder ohne Kennzeichnung (offen). */
export type EndNav = 'navigable' | 'non-navigable' | 'unspecified'

/** Zusatz aus UML zu einem Attribut. */
export interface AssocInfo {
  kind?: AssocKind
  name?: string
  /** Leserichtung des Namens: von der Klasse mit dem Attribut zum Typ (Zugrichtung) oder zurück. */
  reading?: 'forward' | 'backward'
  /** Ende beim Typ des Attributs; ohne Angabe navigierbar. */
  targetEnd?: EndNav
  /** Ende bei der Klasse mit dem Attribut, wenn es dort kein Gegen-Attribut gibt; ohne Angabe offen. */
  sourceEnd?: EndNav
  /** Alte Fassung: `false` hieß „ohne Pfeil“. */
  navigable?: boolean
  multiplicity?: string
  sourceMultiplicity?: string
  /** Rolle am anderen Ende, wenn es dort kein Attribut gibt. */
  sourceRole?: string
}

export type UmlInfo = Record<string, AssocInfo>

/** Eine Assoziation im Diagramm: Attribut in `from`, evtl. das Gegenstück in `to` (beide Richtungen). */
export interface Assoc {
  key: string
  from: string
  to: string
  kind: AssocKind
  name?: string
  reading?: 'forward' | 'backward'
  /** Ende an `to`. */
  navTo: EndNav
  /** Ende an `from`: navigierbar, wenn `to` ein Attribut vom Typ `from` hat. */
  navFrom: EndNav
  role: string
  multiplicity: string
  sourceRole?: string
  sourceMultiplicity?: string
  field: UmlMember
  back?: { key: string; field: UmlMember }
}

export interface Generalization {
  kind: 'extends' | 'implements'
  from: string
  to: string
}

export const multiplicities = ['1', '0..1', '0..*', '1..*', '*']

/** Obergrenze größer als 1: Dann gehört eine Liste in den Code. */
export function isMany(multiplicity: string): boolean {
  const upper = multiplicity.trim().split('..').pop()!.trim()
  return upper === '*' || upper === 'n' || (/^\d+$/.test(upper) && Number(upper) > 1)
}

export const relationKey = (cls: string, field: string) => `${cls}.${field}`

export function generalizations(classes: UmlClass[]): Generalization[] {
  return relations(classes).filter((r): r is Generalization => r.kind !== 'association')
}

/** Assoziationen aus den Attributen; zwei Attribute, die aufeinander zeigen, werden eine Linie mit zwei Pfeilen. */
export function associations(classes: UmlClass[], uml: UmlInfo = {}): Assoc[] {
  const names = new Set(classes.map((c) => c.name))
  const raw: { cls: UmlClass; field: UmlMember; target: string; many: boolean }[] = []
  for (const cls of classes)
    for (const field of cls.members) {
      if (field.kind !== 'field' || field.isStatic) continue
      const target = associationTarget(field.type)
      if (names.has(target.name) && target.name !== cls.name) raw.push({ cls, field, target: target.name, many: target.many })
    }
  const used = new Set<(typeof raw)[number]>()
  const out: Assoc[] = []
  const multiplicity = (stored: string | undefined, many: boolean) => (stored && isMany(stored) === many ? stored : many ? '0..*' : '1')
  // Was die ganze Beziehung betrifft (nicht nur ein Ende), entscheidet, welches Attribut vorne steht.
  const hasInfo = (x: (typeof raw)[number]) => {
    const i = uml[relationKey(x.cls.name, x.field.name)]
    return !!i && (i.kind !== undefined || i.name !== undefined || i.reading !== undefined || i.navigable !== undefined || i.targetEnd !== undefined || i.sourceEnd !== undefined)
  }
  for (const first of raw) {
    if (used.has(first)) continue
    used.add(first)
    // Gegenstück nur, wenn es in beiden Richtungen genau ein Attribut gibt.
    const backs = raw.filter((b) => !used.has(b) && b.cls.name === first.target && b.target === first.cls.name)
    let back = backs.length === 1 && raw.filter((x) => x.cls.name === first.cls.name && x.target === first.target).length === 1 ? backs[0] : undefined
    if (back) used.add(back)
    // Vorne steht das Attribut mit UML-Zusatz (z. B. die Raute am Ganzen), sonst das zuerst gefundene.
    let r = first
    if (back && !hasInfo(first) && hasInfo(back)) [r, back] = [back, first]
    const key = relationKey(r.cls.name, r.field.name)
    const info = uml[key] ?? {}
    const backInfo = back ? (uml[relationKey(back.cls.name, back.field.name)] ?? {}) : {}
    out.push({
      key,
      from: r.cls.name,
      to: r.target,
      kind: info.kind ?? 'association',
      name: info.name,
      // Ein Name liest sich in Zugrichtung, solange niemand umdreht.
      reading: info.reading ?? (info.name ? 'forward' : undefined),
      navTo: info.targetEnd ?? (info.navigable === false ? 'unspecified' : 'navigable'),
      navFrom: back ? 'navigable' : (info.sourceEnd ?? 'unspecified'),
      role: r.field.name,
      multiplicity: multiplicity(info.multiplicity, r.many),
      sourceRole: back ? back.field.name : info.sourceRole,
      sourceMultiplicity: back ? multiplicity(backInfo.multiplicity, back.many) : info.sourceMultiplicity,
      field: r.field,
      back: back && { key: relationKey(back.cls.name, back.field.name), field: back.field },
    })
  }
  return out
}

/** Neues Attribut zu einer Klasse: Name klein wie die Klasse, bei vielen in der Mehrzahl mit -s, nicht doppelt. */
export function fieldNameFor(cls: UmlClass, target: string, many: boolean): string {
  const base = target.charAt(0).toLowerCase() + target.slice(1) + (many ? 'Liste' : '')
  let name = base
  for (let n = 2; cls.members.some((m) => m.name === name); n++) name = base + n
  return name
}

/** Java-Typ zur Multiplizität: eine Liste bei vielen, sonst die Klasse selbst. */
export function fieldTypeFor(target: string, many: boolean): { type: string; init?: string } {
  return many ? { type: `ArrayList<${target}>`, init: 'new ArrayList<>()' } : { type: target }
}

/** `import a.b.C;` einfügen, wenn er fehlt (hinter `package` bzw. den anderen Imports). */
export function ensureImport(text: string, qualified: string): string {
  if (!qualified.includes('.')) return text
  const escaped = qualified.replace(/\./g, '\\.')
  const pkg = qualified.slice(0, qualified.lastIndexOf('.'))
  if (new RegExp(`^\\s*import\\s+(${escaped}|${pkg.replace(/\./g, '\\.')}\\.\\*)\\s*;`, 'm').test(text)) return text
  const imports = [...text.matchAll(/^[ \t]*import\s+[\w.*]+\s*;[ \t]*\n/gm)]
  if (imports.length) {
    const last = imports[imports.length - 1]
    const at = last.index! + last[0].length
    return text.slice(0, at) + `import ${qualified};\n` + text.slice(at)
  }
  const pkgLine = /^\s*package\s+[\w.]+\s*;[ \t]*\n/.exec(text)
  if (pkgLine) return text.slice(0, pkgLine[0].length) + `\nimport ${qualified};\n` + text.slice(pkgLine[0].length).replace(/^(?!\n)/, '\n')
  return `import ${qualified};\n\n${text}`
}

/** Zusatz neu schreiben; leere Felder fallen weg, ein leerer Eintrag verschwindet. */
export function withInfo(uml: UmlInfo, key: string, change: Partial<AssocInfo>): UmlInfo {
  const next: AssocInfo = { ...uml[key], ...change }
  for (const k of Object.keys(next) as (keyof AssocInfo)[]) if (next[k] === undefined || next[k] === '') delete next[k]
  if (next.kind === 'association') delete next.kind
  delete next.navigable
  if (next.targetEnd === 'navigable') delete next.targetEnd
  if (next.sourceEnd === 'unspecified') delete next.sourceEnd
  const out = { ...uml }
  if (Object.keys(next).length) out[key] = next
  else delete out[key]
  return out
}

/** Schlüssel umbenennen, z. B. wenn die Rolle (das Attribut) einen neuen Namen bekommt. */
export function renameInfo(uml: UmlInfo, from: string, to: string): UmlInfo {
  if (!uml[from] || from === to) return uml
  const out = { ...uml, [to]: uml[from] }
  delete out[from]
  return out
}
