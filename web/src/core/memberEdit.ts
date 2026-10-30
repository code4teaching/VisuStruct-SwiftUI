/**
 * VisuObject: Klassen, Attribute und Methoden aus dem Objektinspektor ändern.
 * Geschrieben wird nur die betroffene Deklaration; Methodenrümpfe, Kommentare und Startwerte bleiben.
 * Dazu die Erzeuger aus dem Eclipse-Menü „Source“: Konstruktor aus Attributen, Getter/Setter, toString().
 */

import type { UmlClass, UmlMember, UmlParam, Visibility } from './classModel'

const splice = (source: string, from: number, to: number, text: string) => source.slice(0, from) + text + source.slice(to)
const javaVisibility: Record<Visibility, string> = { '+': 'public ', '-': 'private ', '#': 'protected ', '~': '' }
const lineStart = (source: string, pos: number) => source.lastIndexOf('\n', pos - 1) + 1

/** Einrückung der Mitglieder (wie die erste Deklaration), sonst vier Leerzeichen. */
function indentOf(source: string, cls: UmlClass): string {
  const first = cls.members[0]
  if (first) {
    const start = lineStart(source, first.from)
    const ws = /^[ \t]*/.exec(source.slice(start))![0]
    if (start + ws.length === first.from) return ws
  }
  return '    '
}

/** Annotationen vor einer Deklaration (`@Override` …) bleiben beim Umschreiben stehen. */
function annotations(source: string, from: number, to: number): string {
  return /^(\s*@[\w.]+(\([^)]*\))?\s*)*/.exec(source.slice(from, to))![0]
}

// MARK: - Attribute

export interface FieldInfo {
  visibility: Visibility
  name: string
  type: string
  isStatic: boolean
  isFinal: boolean
  /** Startwert ohne `=`, leer = keiner. */
  init: string
}

export function fieldInfo(source: string, m: UmlMember): FieldInfo {
  const head = source.slice(m.headerFrom, m.nameFrom)
  const tail = source.slice(m.nameTo, m.to)
  const init = m.shared ? '' : (/^\s*=\s*([\s\S]*?)\s*;?\s*$/.exec(tail)?.[1] ?? '')
  return { visibility: m.visibility, name: m.name, type: m.type, isStatic: m.isStatic, isFinal: /\bfinal\b/.test(head), init }
}

export function fieldDeclaration(f: FieldInfo): string {
  return `${javaVisibility[f.visibility]}${f.isStatic ? 'static ' : ''}${f.isFinal ? 'final ' : ''}${f.type} ${f.name}${f.init.trim() ? ` = ${f.init.trim()}` : ''};`
}

/** Attribut neu schreiben. Bei `int a, b;` geht nur der Name. */
export function setField(source: string, m: UmlMember, change: Partial<FieldInfo>): string {
  if (m.shared) return change.name && change.name !== m.name ? splice(source, m.nameFrom, m.nameTo, change.name) : source
  const next = { ...fieldInfo(source, m), ...change }
  return splice(source, m.from, m.to, annotations(source, m.from, m.to) + fieldDeclaration(next))
}

// MARK: - Methoden

export interface MethodInfo {
  visibility: Visibility
  name: string
  /** Ergebnistyp, leer beim Konstruktor. */
  type: string
  params: UmlParam[]
  isStatic: boolean
  isAbstract: boolean
}

export function methodInfo(m: UmlMember): MethodInfo {
  return { visibility: m.visibility, name: m.name, type: m.type, params: m.params, isStatic: m.isStatic, isAbstract: m.isAbstract }
}

/** `name: Typ, n: int` oder Java-Stil `Typ name, int n` → Parameter. */
export function parseParams(text: string): UmlParam[] | undefined {
  const out: UmlParam[] = []
  for (const part of text.split(',').map((p) => p.trim()).filter(Boolean)) {
    const uml = /^([\p{L}_$][\p{L}\p{N}_$]*)\s*:\s*(.+)$/u.exec(part)
    const java = /^(.+?)\s+([\p{L}_$][\p{L}\p{N}_$]*)$/u.exec(part)
    if (uml) out.push({ name: uml[1], type: uml[2].replace(/\s+/g, '') })
    else if (java) out.push({ name: java[2], type: java[1].replace(/\s+/g, '') })
    else return undefined
  }
  return out
}

export const paramsText = (params: UmlParam[]) => params.map((p) => `${p.name}: ${p.type}`).join(', ')

/**
 * Kopf einer Methode neu schreiben; der Rumpf bleibt. `abstract` an: Rumpf wird `;`,
 * `abstract` aus: aus `;` wird ein leerer Rumpf. In Interfaces ohne Sichtbarkeit und ohne `abstract`.
 */
export function setMethod(source: string, cls: UmlClass, m: UmlMember, change: Partial<MethodInfo>): string {
  const next = { ...methodInfo(m), ...change }
  const inInterface = cls.kind === 'interface'
  const isConstructor = m.kind === 'constructor'
  const vis = inInterface ? '' : javaVisibility[next.visibility]
  const mods = `${vis}${next.isStatic && !isConstructor ? 'static ' : ''}${next.isAbstract && !inInterface && !isConstructor ? 'abstract ' : ''}`
  const params = next.params.map((p) => `${p.type} ${p.name}`).join(', ')
  const head = isConstructor ? `${mods}${m.name}(${params})` : `${mods}${next.type || 'void'} ${next.name}(${params})`
  const keep = annotations(source, m.headerFrom, m.headerTo)
  let out = splice(source, m.headerFrom, m.headerTo, keep + head)
  const shift = keep.length + head.length - (m.headerTo - m.headerFrom)
  const restFrom = m.headerTo + shift
  const restTo = m.to + shift
  const rest = out.slice(restFrom, restTo)
  const wantsBody = !(next.isAbstract || (inInterface && !next.isStatic))
  if (!wantsBody && /^\s*(throws[^{;]*)?\{/.test(rest)) out = splice(out, restFrom, restTo, ';')
  else if (wantsBody && /^\s*;/.test(rest)) {
    const indent = indentOf(source, cls)
    const ret = next.type && next.type !== 'void' && !isConstructor ? `${indent}    return ${next.type === 'boolean' ? 'false' : /^(int|long|short|byte|double|float|char)$/.test(next.type) ? '0' : 'null'};\n` : ''
    out = splice(out, restFrom, restTo, ` {\n${ret}${indent}}`)
  }
  return out
}

// MARK: - Klasse

/** Javadoc direkt über der Klasse (ohne `/** … *\/`), leer = keiner. */
export function classDoc(source: string, cls: UmlClass): string {
  const before = source.slice(0, cls.headerFrom)
  const m = /\/\*\*([\s\S]*?)\*\/\s*$/.exec(before)
  if (!m) return ''
  return m[1]
    .split('\n')
    .map((l) => l.replace(/^\s*\*\s?/, ''))
    .join('\n')
    .trim()
}

export function setClassDoc(source: string, cls: UmlClass, text: string): string {
  const before = source.slice(0, cls.headerFrom)
  const m = /\/\*\*[\s\S]*?\*\/\s*$/.exec(before)
  const indent = /[ \t]*$/.exec(before)![0]
  const doc = text.trim() ? `/**\n${text.trim().split('\n').map((l) => ` * ${l}`.trimEnd()).join('\n')}\n */\n${indent}` : ''
  if (m) return splice(source, m.index, cls.headerFrom, doc)
  return splice(source, cls.headerFrom, cls.headerFrom, doc)
}

// MARK: - Source-Menü wie in Eclipse

/** Vor der schließenden Klammer der Klasse einfügen, mit Leerzeile davor. */
function insertAtEnd(source: string, cls: UmlClass, block: string): string {
  const indent = indentOf(source, cls)
  const lines = block
    .split('\n')
    .map((l) => (l ? indent + l : l))
    .join('\n')
  const at = lineStart(source, cls.bodyEnd)
  const onOwnLine = /^\s*$/.test(source.slice(at, cls.bodyEnd))
  const pos = onOwnLine ? at : cls.bodyEnd
  const prefix = onOwnLine ? '' : '\n'
  const blank = cls.members.length ? '\n' : ''
  return splice(source, pos, pos, `${prefix}${blank}${lines}\n`)
}

const instanceFields = (cls: UmlClass) => cls.members.filter((m) => m.kind === 'field' && !m.isStatic)
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Konstruktor mit allen Attributen (ohne static), wie „Generate Constructor using Fields“. */
export function addFieldConstructor(source: string, cls: UmlClass): string {
  const fields = instanceFields(cls)
  const params = fields.map((f) => `${f.type} ${f.name}`).join(', ')
  const body = fields.map((f) => `    this.${f.name} = ${f.name};`).join('\n')
  return insertAtEnd(source, cls, `public ${cls.name}(${params}) {\n${body}${body ? '\n' : ''}}`)
}

/** Getter und Setter für alle Attribute ohne; `final`-Attribute bekommen keinen Setter. */
export function addGettersSetters(source: string, cls: UmlClass): string {
  const methods = new Set(cls.members.filter((m) => m.kind === 'method').map((m) => m.name))
  const blocks: string[] = []
  for (const f of instanceFields(cls)) {
    const isFinal = /\bfinal\b/.test(source.slice(f.headerFrom, f.nameFrom))
    const getter = `${f.type === 'boolean' ? 'is' : 'get'}${capital(f.name)}`
    const setter = `set${capital(f.name)}`
    if (!methods.has(getter)) blocks.push(`public ${f.type} ${getter}() {\n    return ${f.name};\n}`)
    if (!isFinal && !methods.has(setter)) blocks.push(`public void ${setter}(${f.type} ${f.name}) {\n    this.${f.name} = ${f.name};\n}`)
  }
  return blocks.length ? insertAtEnd(source, cls, blocks.join('\n\n')) : source
}

/** `toString()` wie „Generate toString()“ in Eclipse: `Hund [name=…, rasse=…]`. */
export function addToString(source: string, cls: UmlClass): string {
  if (cls.members.some((m) => m.kind === 'method' && m.name === 'toString' && m.params.length === 0)) return source
  const parts = instanceFields(cls).map((f, i) => `"${i ? ', ' : ''}${f.name}=" + ${f.name}`)
  const expr = parts.length ? `"${cls.name} [" + ${parts.join(' + ')} + "]"` : `"${cls.name} []"`
  return insertAtEnd(source, cls, `@Override\npublic String toString() {\n    return ${expr};\n}`)
}
