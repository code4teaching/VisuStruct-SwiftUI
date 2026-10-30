/**
 * VisuObject: Abschnitts-Kommentare in Klassen wie im Unterricht:
 * `// Attribute`, `// Referenzattribute`, `// Konstruktor`, `// Methoden`.
 * Referenzattribute haben eine eigene Klasse des Projekts als Typ (auch `ArrayList<Spieler>` oder `Spieler[]`).
 * Neue Mitglieder aus dem Klassendiagramm landen im passenden Abschnitt; die Reihenfolge innerhalb bleibt.
 */

import { associationTarget, parseClasses, type UmlClass, type UmlMember } from './classModel'

export type Section = 'fields' | 'refs' | 'ctors' | 'methods'
export type SectionLabels = Record<Section, string>

const order: Section[] = ['fields', 'refs', 'ctors', 'methods']

/** Alle Sprachen: So erkennt VisuObject die Kommentare auch nach einem Sprachwechsel wieder. */
const known: SectionLabels[] = [
  { fields: 'Attribute', refs: 'Referenzattribute', ctors: 'Konstruktor', methods: 'Methoden' },
  { fields: 'Attributes', refs: 'Reference attributes', ctors: 'Constructor', methods: 'Methods' },
  { fields: 'Atributos', refs: 'Atributos de referência', ctors: 'Construtor', methods: 'Métodos' },
]

const norm = (s: string) => s.trim().toLowerCase().replace(/[:.]$/, '')
const knownWords = new Set(known.flatMap((k) => Object.values(k)).flatMap((w) => [norm(w), norm(w) + 'en', norm(w) + 's', norm(w) + 'es']))
/** `// Attribute`, `// Konstruktoren:` … */
const isSectionLine = (line: string) => {
  const m = /^\s*\/\/\s*(.+?)\s*$/.exec(line)
  return !!m && knownWords.has(norm(m[1]))
}

export function sectionOf(m: UmlMember, classNames: Set<string>): Section {
  if (m.kind === 'constructor') return 'ctors'
  if (m.kind === 'method') return 'methods'
  return classNames.has(associationTarget(m.type).name) ? 'refs' : 'fields'
}

const lineStart = (s: string, pos: number) => s.lastIndexOf('\n', pos - 1) + 1
const lineEnd = (s: string, pos: number) => {
  const i = s.indexOf('\n', pos)
  return i < 0 ? s.length : i + 1
}

/** Hat die Klasse schon Abschnitts-Kommentare? */
export function hasSections(source: string, cls: UmlClass): boolean {
  const open = source.indexOf('{', cls.headerTo)
  return source
    .slice(open + 1, cls.bodyEnd)
    .split('\n')
    .some(isSectionLine)
}

/**
 * Klassenrumpf neu ordnen: die vier Kommentare und darunter die Mitglieder ihres Abschnitts.
 * Kommentare und Annotationen direkt über einem Mitglied wandern mit. Anderes im Rumpf
 * (z. B. eine innere Klasse) kommt unverändert ans Ende. Interfaces bleiben, wie sie sind.
 */
export function withSections(source: string, cls: UmlClass, classNames: Set<string>, labels: SectionLabels): string {
  if (cls.kind !== 'class') return source
  const open = source.indexOf('{', cls.headerTo)
  if (open < 0 || open > cls.bodyEnd) return source
  // Innere Klassen: lieber nichts verschieben.
  if (parseClasses(source).some((c) => c.from > open && c.from < cls.bodyEnd)) return source
  const bodyFrom = lineEnd(source, open)
  const bodyTo = lineStart(source, cls.bodyEnd)
  if (bodyFrom > bodyTo || !/^\s*$/.test(source.slice(open + 1, bodyFrom)) || !/^\s*$/.test(source.slice(bodyTo, cls.bodyEnd))) return source
  const indent = /^[ \t]*/.exec(source.slice(lineStart(source, cls.from)))![0] + '    '
  const groups = new Map<Section, string[]>(order.map((s) => [s, []]))
  const taken: [number, number][] = []
  const seen = new Set<number>()
  for (const m of cls.members) {
    if (seen.has(m.from)) continue
    seen.add(m.from)
    let from = lineStart(source, m.from)
    if (!/^\s*$/.test(source.slice(from, m.from))) return source
    const to = lineEnd(source, m.to)
    if (!/^\s*$/.test(source.slice(m.to, to))) return source
    // Javadoc, Kommentare und Annotationen darüber gehören dazu (aber keine Abschnitts-Kommentare).
    for (;;) {
      if (from <= bodyFrom) break
      const prev = lineStart(source, from - 1)
      const line = source.slice(prev, from)
      if (isSectionLine(line) || !/^\s*(\/\/|\/\*|\*|@)/.test(line)) break
      from = prev
    }
    taken.push([from, to])
    groups.get(sectionOf(m, classNames))!.push(source.slice(from, to).replace(/\s+$/, ''))
  }
  // Was übrig bleibt (ohne Leerzeilen und alte Abschnitts-Kommentare).
  taken.sort((a, b) => a[0] - b[0])
  let rest = ''
  let at = bodyFrom
  for (const [f, t] of [...taken, [bodyTo, bodyTo] as [number, number]]) {
    if (f > at) rest += source.slice(at, f)
    at = Math.max(at, t)
  }
  const extra = rest
    .split('\n')
    .filter((l) => !isSectionLine(l))
    .join('\n')
    .trim()
  const blocks = order.map((s) => {
    const items = groups.get(s)!
    const sep = s === 'fields' || s === 'refs' ? '\n' : '\n\n'
    return `${indent}// ${labels[s]}` + (items.length ? '\n' + items.join(sep) : '')
  })
  if (extra) blocks.push(indent + extra)
  return source.slice(0, bodyFrom) + blocks.join('\n\n') + '\n' + source.slice(bodyTo)
}

/** Nur einsortieren, wenn die Klasse schon Abschnitte hat. */
export function keepSections(source: string, className: string, classNames: Set<string>, labels: SectionLabels): string {
  const cls = parseClasses(source).find((c) => c.name === className)
  return cls && hasSections(source, cls) ? withSections(source, cls, classNames, labels) : source
}
