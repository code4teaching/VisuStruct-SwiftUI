/**
 * VisuObject: Klassen aus Java-Code für das Klassendiagramm lesen und das Diagramm wieder in Java schreiben.
 * Kein vollständiger Java-Parser: nur der Aufbau (Klassen, Attribute, Methoden-Köpfe), Methodenrümpfe werden übersprungen.
 * Jeder Teil kennt seine Stelle im Code, damit eine Änderung im Diagramm nur diese Stelle neu schreibt.
 */

export type Visibility = '+' | '-' | '#' | '~'

export interface UmlParam {
  name: string
  type: string
}

export interface UmlMember {
  kind: 'field' | 'method' | 'constructor'
  name: string
  /** Typ des Attributs bzw. Ergebnistyp der Methode (leer beim Konstruktor). */
  type: string
  params: UmlParam[]
  visibility: Visibility
  isStatic: boolean
  isAbstract: boolean
  /** Ganze Deklaration im Code, mit Rumpf bzw. `;`. */
  from: number
  to: number
  /** Kopf: bei Attributen bis zum Namen (ohne `= …;`), bei Methoden bis zur `)`. */
  headerFrom: number
  headerTo: number
  /** Teil einer Zeile wie `int a, b;`: dann wird beim Ändern nur der Name ersetzt. */
  shared: boolean
  nameFrom: number
  nameTo: number
}

export interface UmlClass {
  name: string
  kind: 'class' | 'interface'
  isAbstract: boolean
  superclass?: string
  interfaces: string[]
  members: UmlMember[]
  from: number
  to: number
  /** Kopf bis vor `{`. */
  headerFrom: number
  headerTo: number
  nameFrom: number
  nameTo: number
  /** Stelle der schließenden `}`. */
  bodyEnd: number
}

export interface UmlRelation {
  kind: 'extends' | 'implements' | 'association'
  from: string
  to: string
  /** Bei Assoziationen: Name des Attributs und Multiplizität am Ziel. */
  role?: string
  multiplicity?: string
}

interface Token {
  text: string
  from: number
  to: number
  /** Bezeichner oder Schlüsselwort. */
  word: boolean
}

/** Zerlegt den Code in Wörter und Zeichen; Kommentare, Zeichenketten und Zeichen fallen weg (als ein Token "…"). */
export function tokenize(source: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < source.length) {
    const c = source[i]
    if (/\s/.test(c)) {
      i++
    } else if (source.startsWith('//', i)) {
      const end = source.indexOf('\n', i)
      i = end < 0 ? source.length : end
    } else if (source.startsWith('/*', i)) {
      const end = source.indexOf('*/', i + 2)
      i = end < 0 ? source.length : end + 2
    } else if (c === '"' || c === "'") {
      const start = i++
      while (i < source.length && source[i] !== c && source[i] !== '\n') i += source[i] === '\\' ? 2 : 1
      i++
      tokens.push({ text: '"…"', from: start, to: Math.min(i, source.length), word: false })
    } else if (/[\p{L}_$]/u.test(c)) {
      const start = i
      while (i < source.length && /[\p{L}\p{N}_$]/u.test(source[i])) i++
      tokens.push({ text: source.slice(start, i), from: start, to: i, word: true })
    } else if (/\d/.test(c)) {
      const start = i
      while (i < source.length && /[\w.]/.test(source[i])) i++
      tokens.push({ text: source.slice(start, i), from: start, to: i, word: false })
    } else {
      tokens.push({ text: c, from: i, to: i + 1, word: false })
      i++
    }
  }
  return tokens
}

const modifierWords = new Set(['public', 'private', 'protected', 'static', 'final', 'abstract', 'synchronized', 'native', 'transient', 'volatile', 'default', 'strictfp', 'sealed'])

/** Index hinter der passenden schließenden Klammer (`{`/`}`, `(`/`)`, `<`/`>`). */
function skipBalanced(tokens: Token[], i: number, open: string, close: string): number {
  let depth = 0
  for (; i < tokens.length; i++) {
    if (tokens[i].text === open) depth++
    else if (tokens[i].text === close && --depth === 0) return i + 1
  }
  return tokens.length
}

/** Typ-Text aus Tokens, ohne Leerzeichen außer nach Kommas: `ArrayList<Hund>`, `Map<String, Integer>`, `int[]`. */
function typeText(tokens: Token[]): string {
  return tokens.map((t) => (t.text === ',' ? ', ' : t.text)).join('')
}

/** Teilt an Kommas, die nicht in `<>`, `()` oder `[]` stehen. */
function splitTopLevel(tokens: Token[]): Token[][] {
  const parts: Token[][] = [[]]
  let depth = 0
  for (const t of tokens) {
    if (t.text === '<' || t.text === '(' || t.text === '[' || t.text === '{') depth++
    else if (t.text === '>' || t.text === ')' || t.text === ']' || t.text === '}') depth--
    if (t.text === ',' && depth === 0) parts.push([])
    else parts[parts.length - 1].push(t)
  }
  return parts.filter((p) => p.length > 0)
}

/** Lässt Annotationen wie `@Override` oder `@SuppressWarnings("x")` weg. */
function withoutAnnotations(tokens: Token[]): Token[] {
  const out: Token[] = []
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].text === '@' && tokens[i + 1]?.word && tokens[i + 1].text !== 'interface') {
      i++
      if (tokens[i + 1]?.text === '(') i = skipBalanced(tokens, i + 1, '(', ')') - 1
      continue
    }
    out.push(tokens[i])
  }
  return out
}

function visibilityOf(mods: Set<string>, fallback: Visibility): Visibility {
  if (mods.has('public')) return '+'
  if (mods.has('private')) return '-'
  if (mods.has('protected')) return '#'
  return fallback
}

function parseParams(tokens: Token[]): UmlParam[] {
  return splitTopLevel(tokens).map((part) => {
    const p = withoutAnnotations(part).filter((t) => t.text !== 'final')
    const name = p[p.length - 1]
    // `String... namen` bleibt als Typ `String...`
    return { name: name?.word ? name.text : '', type: typeText(p.slice(0, -1)) }
  })
}

/** Liest eine Deklaration im Klassenrumpf (ohne `;` bzw. Rumpf). */
function parseMember(decl: Token[], className: string, inInterface: boolean, end: number): UmlMember[] {
  const tokens = withoutAnnotations(decl)
  const mods = new Set<string>()
  let i = 0
  while (i < tokens.length && modifierWords.has(tokens[i].text)) mods.add(tokens[i++].text)
  // Generische Methode `public <T> void f()`: Typparameter überspringen.
  if (tokens[i]?.text === '<') i = skipBalanced(tokens, i, '<', '>')
  const rest = tokens.slice(i)
  if (rest.length === 0 || decl.length === 0) return []
  const headerFrom = decl[0].from
  const paren = rest.findIndex((t) => t.text === '(')
  const equals = rest.findIndex((t) => t.text === '=')
  const isMethod = paren > 0 && (equals < 0 || paren < equals)
  const fallback: Visibility = inInterface ? '+' : '~'
  if (isMethod) {
    const nameToken = rest[paren - 1]
    if (!nameToken.word) return []
    const close = skipBalanced(rest, paren, '(', ')')
    const isConstructor = paren === 1 && nameToken.text === className
    return [
      {
        kind: isConstructor ? 'constructor' : 'method',
        name: nameToken.text,
        type: isConstructor ? '' : typeText(rest.slice(0, paren - 1)),
        params: parseParams(rest.slice(paren + 1, close - 1)),
        visibility: visibilityOf(mods, fallback),
        isStatic: mods.has('static'),
        isAbstract: mods.has('abstract') || (inInterface && !mods.has('default') && !mods.has('static')),
        from: headerFrom,
        to: end,
        headerFrom,
        headerTo: rest[close - 1]?.to ?? end,
        shared: false,
        nameFrom: nameToken.from,
        nameTo: nameToken.to,
      },
    ]
  }
  // Attribut(e): Typ, dann ein oder mehrere Namen, jeweils evtl. mit `= …`.
  const declarators = splitTopLevel(rest)
  const first = declarators[0]
  const firstEq = first.findIndex((t) => t.text === '=')
  const firstHead = firstEq < 0 ? first : first.slice(0, firstEq)
  // Name ist das letzte Wort vor `=` (`int[] zahlen`, `int zahlen[]`).
  let nameIndex = firstHead.length - 1
  while (nameIndex > 0 && !firstHead[nameIndex].word) nameIndex--
  if (nameIndex < 1) return []
  const baseType = typeText(firstHead.slice(0, nameIndex))
  const shared = declarators.length > 1
  const members: UmlMember[] = []
  declarators.forEach((d, k) => {
    const eq = d.findIndex((t) => t.text === '=')
    const head = eq < 0 ? d : d.slice(0, eq)
    const nameTok = k === 0 ? firstHead[nameIndex] : head.find((t) => t.word)
    if (!nameTok) return
    const brackets = head.filter((t) => t.from > nameTok.from && t.text === '[').length
    members.push({
      kind: 'field',
      name: nameTok.text,
      type: baseType + '[]'.repeat(brackets),
      params: [],
      visibility: visibilityOf(mods, fallback),
      isStatic: mods.has('static'),
      isAbstract: false,
      from: headerFrom,
      to: end,
      headerFrom,
      headerTo: k === 0 ? (head[head.length - 1]?.to ?? nameTok.to) : nameTok.to,
      shared,
      nameFrom: nameTok.from,
      nameTo: nameTok.to,
    })
  })
  return members
}

function parseClassBody(tokens: Token[], start: number, cls: UmlClass): number {
  let decl: Token[] = []
  let i = start
  while (i < tokens.length) {
    const t = tokens[i]
    if (t.text === '}') {
      cls.bodyEnd = t.from
      return i + 1
    }
    if (t.text === ';') {
      cls.members.push(...parseMember(decl, cls.name, cls.kind === 'interface', t.to))
      decl = []
      i++
      continue
    }
    if (t.text === '{') {
      const hasEquals = decl.some((d) => d.text === '=')
      const close = skipBalanced(tokens, i, '{', '}')
      if (hasEquals) {
        // `int[] a = {1, 2};` oder ein Lambda: weiter bis zum `;`.
        decl.push(...tokens.slice(i, close))
        i = close
        continue
      }
      const words = decl.map((d) => d.text)
      if (words.includes('class') || words.includes('interface') || words.includes('enum')) {
        // Innere Klasse: überspringen (vorerst nicht im Diagramm).
      } else if (decl.length > 0) {
        cls.members.push(...parseMember(decl, cls.name, cls.kind === 'interface', tokens[close - 1]?.to ?? t.to))
      }
      decl = []
      i = close
      continue
    }
    decl.push(t)
    i++
  }
  cls.bodyEnd = tokens.length > 0 ? tokens[tokens.length - 1].to : 0
  return i
}

/** Alle Klassen und Interfaces auf oberster Ebene, in der Reihenfolge im Code. */
export function parseClasses(source: string): UmlClass[] {
  const tokens = tokenize(source)
  const classes: UmlClass[] = []
  let decl: Token[] = []
  let i = 0
  while (i < tokens.length) {
    const t = tokens[i]
    if (t.text === ';') {
      decl = []
      i++
      continue
    }
    if (t.text !== '{') {
      decl.push(t)
      i++
      continue
    }
    const head = withoutAnnotations(decl)
    const k = head.findIndex((d) => d.text === 'class' || d.text === 'interface')
    const nameToken = k >= 0 ? head[k + 1] : undefined
    if (!nameToken?.word) {
      i = skipBalanced(tokens, i, '{', '}')
      decl = []
      continue
    }
    // Kopf beginnt beim ersten Modifizierer (nicht bei `import …`, das schon mit `;` endete).
    let s = k
    while (s > 0 && (modifierWords.has(head[s - 1].text) || head[s - 1].text === '@')) s--
    const cls: UmlClass = {
      name: nameToken.text,
      kind: head[k].text === 'interface' ? 'interface' : 'class',
      isAbstract: head.slice(s, k).some((d) => d.text === 'abstract'),
      interfaces: [],
      members: [],
      from: decl[decl.indexOf(head[s])]?.from ?? head[s].from,
      to: 0,
      headerFrom: decl[decl.indexOf(head[s])]?.from ?? head[s].from,
      headerTo: head[head.length - 1].to,
      nameFrom: nameToken.from,
      nameTo: nameToken.to,
      bodyEnd: 0,
    }
    // `extends A` (Interfaces: `extends A, B`) und `implements A, B`, Typparameter weglassen.
    let j = k + 2
    if (head[j]?.text === '<') j = skipBalanced(head, j, '<', '>')
    let clause = ''
    for (; j < head.length; j++) {
      const w = head[j]
      if (w.text === 'extends' || w.text === 'implements') clause = w.text
      else if (w.text === '<') j = skipBalanced(head, j, '<', '>') - 1
      else if (w.word && clause === 'extends' && cls.kind === 'class') cls.superclass ??= w.text
      else if (w.word && clause) cls.interfaces.push(w.text)
    }
    i = parseClassBody(tokens, i + 1, cls)
    cls.to = tokens[i - 1]?.to ?? source.length
    classes.push(cls)
    decl = []
  }
  return classes
}

/** Elementtyp von Behältern: `Hund[]`, `ArrayList<Hund>`, `List<Hund>` → `Hund` mit `0..*`. */
export function associationTarget(type: string): { name: string; many: boolean } {
  const array = /^([\p{L}_$][\p{L}\p{N}_$]*)(\[\])+$/u.exec(type)
  if (array) return { name: array[1], many: true }
  const generic = /^(?:ArrayList|LinkedList|List|Set|HashSet|TreeSet|Collection|Queue|Deque|ArrayDeque|Stack|Vector)<([\p{L}_$][\p{L}\p{N}_$]*)>$/u.exec(type)
  if (generic) return { name: generic[1], many: true }
  return { name: type, many: false }
}

/** Pfeile im Klassendiagramm: Vererbung, Realisierung und Assoziationen aus Attributen. */
export function relations(classes: UmlClass[]): UmlRelation[] {
  const names = new Set(classes.map((c) => c.name))
  const out: UmlRelation[] = []
  for (const c of classes) {
    if (c.superclass && names.has(c.superclass)) out.push({ kind: 'extends', from: c.name, to: c.superclass })
    for (const i of c.interfaces) if (names.has(i)) out.push({ kind: c.kind === 'interface' ? 'extends' : 'implements', from: c.name, to: i })
    for (const m of c.members) {
      if (m.kind !== 'field') continue
      const target = associationTarget(m.type)
      if (names.has(target.name)) out.push({ kind: 'association', from: c.name, to: target.name, role: m.name, multiplicity: target.many ? '0..*' : '1' })
    }
  }
  return out
}

// MARK: - UML-Schreibweise

/** Zeile im Klassendiagramm: `- name: String`, `+ bellen(laut: int): void`, `+ Hund(name: String)`. */
export function umlText(m: UmlMember): string {
  const params = m.params.map((p) => `${p.name}: ${p.type}`).join(', ')
  if (m.kind === 'field') return `${m.visibility} ${m.name}: ${m.type}`
  if (m.kind === 'constructor') return `${m.visibility} ${m.name}(${params})`
  return `${m.visibility} ${m.name}(${params}): ${m.type}`
}

export interface UmlLine {
  kind: 'field' | 'method'
  visibility?: Visibility
  name: string
  type?: string
  params: UmlParam[]
  isStatic: boolean
}

const identifier = /^[\p{L}_$][\p{L}\p{N}_$]*$/u

/**
 * Getippte Zeile in UML-Schreibweise lesen. Erlaubt auch Java-Stil (`String name`, `void bellen()`),
 * damit Anfänger nicht scheitern. `static` davor oder unterstrichen geht nicht zu tippen, also: Wort `static`.
 */
export function parseUmlLine(text: string): UmlLine | undefined {
  let s = text.trim().replace(/;$/, '').trim()
  if (!s) return undefined
  let visibility: Visibility | undefined
  if (/^[+\-#~]/.test(s)) {
    visibility = s[0] as Visibility
    s = s.slice(1).trim()
  }
  let isStatic = false
  const words = s.split(/\s+/)
  while (['static', 'public', 'private', 'protected'].includes(words[0])) {
    const w = words.shift()!
    if (w === 'static') isStatic = true
    else visibility ??= w === 'public' ? '+' : w === 'private' ? '-' : '#'
  }
  s = words.join(' ')
  const paren = s.indexOf('(')
  if (paren >= 0) {
    const close = s.lastIndexOf(')')
    if (close < paren) return undefined
    let name = s.slice(0, paren).trim()
    let type = s.slice(close + 1).trim().replace(/^:\s*/, '') || undefined
    // Java-Stil `void bellen()`
    const javaStyle = /^(.+)\s+([\p{L}_$][\p{L}\p{N}_$]*)$/u.exec(name)
    if (javaStyle) {
      type ??= javaStyle[1].replace(/\s+/g, '')
      name = javaStyle[2]
    }
    if (!identifier.test(name)) return undefined
    const params = s
      .slice(paren + 1, close)
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => {
        const uml = /^([\p{L}_$][\p{L}\p{N}_$]*)\s*:\s*(.+)$/u.exec(p)
        if (uml) return { name: uml[1], type: uml[2].replace(/\s+/g, '') }
        const java = /^(.+)\s+([\p{L}_$][\p{L}\p{N}_$]*)$/u.exec(p)
        return java ? { name: java[2], type: java[1].replace(/\s+/g, '') } : { name: p, type: 'int' }
      })
    return { kind: 'method', visibility, name, type: type?.replace(/\s+/g, ''), params, isStatic }
  }
  const uml = /^([\p{L}_$][\p{L}\p{N}_$]*)\s*(?::\s*(.+))?$/u.exec(s)
  if (uml) return { kind: 'field', visibility, name: uml[1], type: uml[2]?.replace(/\s+/g, ''), params: [], isStatic }
  const java = /^(.+?)\s+([\p{L}_$][\p{L}\p{N}_$]*)$/u.exec(s)
  if (java) return { kind: 'field', visibility, name: java[2], type: java[1].replace(/\s+/g, ''), params: [], isStatic }
  return undefined
}

const javaVisibility: Record<Visibility, string> = { '+': 'public ', '-': 'private ', '#': 'protected ', '~': '' }

/** Standardwert für `return` im neuen Methodenrumpf, damit der Code gleich übersetzt. */
function defaultValue(type: string): string {
  if (/^(int|long|short|byte)$/.test(type)) return '0'
  if (/^(double|float)$/.test(type)) return '0.0'
  if (type === 'boolean') return 'false'
  if (type === 'char') return "' '"
  return 'null'
}

function javaHeader(line: UmlLine, cls: UmlClass, abstract: boolean): string {
  const inInterface = cls.kind === 'interface'
  const vis = inInterface ? '' : javaVisibility[line.visibility ?? (line.kind === 'field' ? '-' : '+')]
  const stat = line.isStatic ? 'static ' : ''
  if (line.kind === 'field') return `${vis}${stat}${line.type ?? 'int'} ${line.name}`
  const params = line.params.map((p) => `${p.type} ${p.name}`).join(', ')
  if (line.name === cls.name) return `${vis}${line.name}(${params})`
  return `${vis}${stat}${abstract && !inInterface ? 'abstract ' : ''}${line.type ?? 'void'} ${line.name}(${params})`
}

// MARK: - Diagramm → Code

const lineStart = (source: string, pos: number) => source.lastIndexOf('\n', pos - 1) + 1

/** Bereich auf ganze Zeilen erweitern, wenn davor und danach nur Leerraum steht. */
function wholeLines(source: string, from: number, to: number): [number, number] {
  const start = lineStart(source, from)
  const before = source.slice(start, from)
  let end = to
  while (end < source.length && (source[end] === ' ' || source[end] === '\t')) end++
  if (/^\s*$/.test(before) && (end === source.length || source[end] === '\n')) return [start, Math.min(end + 1, source.length)]
  return [from, to]
}

/** Einrückung der Mitglieder einer Klasse (wie das erste Mitglied, sonst vier Leerzeichen). */
function memberIndent(source: string, cls: UmlClass): string {
  const first = cls.members[0]
  if (first) {
    const start = lineStart(source, first.from)
    const ws = /^[ \t]*/.exec(source.slice(start))![0]
    if (start + ws.length === first.from) return ws
  }
  const classIndent = /^[ \t]*/.exec(source.slice(lineStart(source, cls.from)))![0]
  return classIndent + '    '
}

const splice = (source: string, from: number, to: number, text: string) => source.slice(0, from) + text + source.slice(to)

export function addClass(source: string, name: string, kind: 'class' | 'interface' = 'class'): string {
  const text = `public ${kind} ${name} {\n}\n`
  if (!source.trim()) return text
  return source.replace(/\s*$/, '') + '\n\n' + text
}

export function deleteClass(source: string, cls: UmlClass): string {
  const [from, to] = wholeLines(source, cls.from, cls.to)
  // Leere Zeile davor mitnehmen, sonst bleiben zwei stehen.
  const prev = source.slice(0, from).match(/\n\s*\n$/)
  return splice(source, prev ? from - prev[0].length + 1 : from, to, '')
}

/** Klasse umbenennen: Name im Kopf und alle Konstruktoren. */
export function renameClass(source: string, cls: UmlClass, name: string): string {
  const spots = [cls, ...cls.members.filter((m) => m.kind === 'constructor')].map((x) => [x.nameFrom, x.nameTo] as const)
  for (const [from, to] of spots.sort((a, b) => b[0] - a[0])) source = splice(source, from, to, name)
  return source
}

/** Oberklasse setzen oder entfernen (nur bei Klassen); `implements` bleibt. */
export function setSuperclass(source: string, cls: UmlClass, superclass: string | undefined): string {
  const head = source.slice(cls.headerFrom, cls.headerTo)
  const nameEnd = cls.nameTo - cls.headerFrom
  const before = head.slice(0, nameEnd)
  let after = head.slice(nameEnd).replace(/\s*\bextends\s+[\p{L}_$][\p{L}\p{N}_$<>,\s]*?(?=\s*\bimplements\b|\s*$)/u, '')
  if (superclass) after = ` extends ${superclass}` + after
  return splice(source, cls.headerFrom, cls.headerTo, before + after)
}

/** Interface hinzufügen: `implements` bei Klassen, `extends` bei Interfaces. */
export function addInterface(source: string, cls: UmlClass, name: string): string {
  if (cls.interfaces.includes(name)) return source
  const head = source.slice(cls.headerFrom, cls.headerTo)
  const word = cls.kind === 'interface' ? 'extends' : 'implements'
  const list = new RegExp(`\\b${word}\\s+[\\p{L}_$][\\p{L}\\p{N}_$<>,\\s]*?(?=\\s*$)`, 'u')
  const changed = list.test(head) ? head.replace(list, (m) => `${m.replace(/\s+$/, '')}, ${name}`) : `${head.replace(/\s+$/, '')} ${word} ${name}${/\s$/.test(head) ? ' ' : ''}`
  return splice(source, cls.headerFrom, cls.headerTo, changed)
}

/** Interface aus `implements` (bzw. `extends` beim Interface) streichen; leere Liste fällt weg. */
export function removeInterface(source: string, cls: UmlClass, name: string): string {
  if (!cls.interfaces.includes(name)) return source
  const head = source.slice(cls.headerFrom, cls.headerTo)
  const word = cls.kind === 'interface' ? 'extends' : 'implements'
  const list = new RegExp(`\\s*\\b${word}\\s+([\\p{L}_$][\\p{L}\\p{N}_$<>,\\s]*?)(?=\\s*$)`, 'u')
  const changed = head.replace(list, (_m, names: string) => {
    const rest = names.split(',').map((n) => n.trim()).filter((n) => n && n !== name)
    return rest.length ? ` ${word} ${rest.join(', ')}` : ''
  })
  return splice(source, cls.headerFrom, cls.headerTo, changed)
}

/** Typ eines Attributs ändern, mit neuem Startwert (oder keinem). Modifizierer und Name bleiben. */
export function setFieldType(source: string, member: UmlMember, type: string, init?: string): string {
  if (member.kind !== 'field' || member.shared) return source
  const head = source.slice(member.headerFrom, member.headerTo)
  const typeAt = head.lastIndexOf(member.type, member.nameFrom - member.headerFrom)
  if (typeAt < 0) return source
  const newHead = head.slice(0, typeAt) + type + head.slice(typeAt + member.type.length)
  return splice(source, member.headerFrom, member.to, `${newHead}${init ? ` = ${init}` : ''};`)
}

/** Abstrakt an- oder ausschalten (nur bei Klassen). */
export function setAbstract(source: string, cls: UmlClass, abstract: boolean): string {
  const head = source.slice(cls.headerFrom, cls.headerTo)
  const changed = abstract ? head.replace(/\bclass\b/, 'abstract class') : head.replace(/\babstract\s+/, '')
  return splice(source, cls.headerFrom, cls.headerTo, changed)
}

/** Neues Attribut (hinter dem letzten Attribut) oder neue Methode (vor der schließenden Klammer). */
export function addMember(source: string, cls: UmlClass, text: string): string {
  const line = parseUmlLine(text)
  if (!line) return source
  const indent = memberIndent(source, cls)
  const header = javaHeader(line, cls, cls.kind === 'interface')
  if (line.kind === 'field') {
    const lastField = [...cls.members].reverse().find((m) => m.kind === 'field')
    const at = lastField ? wholeLines(source, lastField.from, lastField.to)[1] : afterBrace(source, cls)
    const prefix = source[at - 1] === '\n' ? '' : '\n'
    return splice(source, at, at, `${prefix}${indent}${header};\n`)
  }
  let decl: string
  if (cls.kind === 'interface') decl = `${indent}${header};\n`
  else {
    const type = line.type ?? 'void'
    const isConstructor = line.name === cls.name
    const body = !isConstructor && type !== 'void' ? `${indent}    return ${defaultValue(type)};\n` : `${indent}    // Dein Code\n`
    decl = `${indent}${header} {\n${body}${indent}}\n`
  }
  const closeLine = lineStart(source, cls.bodyEnd)
  if (!/^\s*$/.test(source.slice(closeLine, cls.bodyEnd))) return splice(source, cls.bodyEnd, cls.bodyEnd, '\n' + decl)
  // Leerzeile vor der neuen Methode, außer direkt hinter `{` oder wenn schon eine da ist.
  const before = source.slice(0, closeLine)
  const blank = /\n[ \t]*\n$/.test(before) || /\{[ \t]*\n$/.test(before) ? '' : '\n'
  return splice(source, closeLine, closeLine, blank + decl)
}

/** Stelle hinter der `{` der Klasse (nächste Zeile, wenn die Klammer am Zeilenende steht). */
function afterBrace(source: string, cls: UmlClass): number {
  const brace = source.indexOf('{', cls.headerTo) + 1
  const rest = /^[ \t]*\n/.exec(source.slice(brace))
  return rest ? brace + rest[0].length : brace
}

/** Mitglied neu schreiben; Rumpf und `= …` bleiben. Wechsel Attribut ↔ Methode: löschen und neu anlegen. */
export function replaceMember(source: string, cls: UmlClass, member: UmlMember, text: string): string {
  const line = parseUmlLine(text)
  if (!line) return source
  const wasField = member.kind === 'field'
  if (wasField !== (line.kind === 'field')) {
    const without = deleteMember(source, member)
    const again = parseClasses(without).find((c) => c.name === cls.name)
    return again ? addMember(without, again, text) : without
  }
  if (member.shared) return splice(source, member.nameFrom, member.nameTo, line.name)
  line.visibility ??= member.visibility
  if (line.kind === 'field') line.type ??= member.type
  else if (member.kind !== 'constructor') line.type ??= member.type
  const header = javaHeader(line, cls, member.isAbstract)
  // Bei Attributen nur Kopf ohne `= …`; Modifizierer wie `final` behalten.
  const old = source.slice(member.headerFrom, member.headerTo)
  const keep = /\bfinal\s+/.test(old) && !/\bfinal\b/.test(header) ? header.replace(/^((?:public|private|protected)\s+)?/, '$1final ') : header
  return splice(source, member.headerFrom, member.headerTo, keep)
}

export function deleteMember(source: string, member: UmlMember): string {
  if (member.shared) return source
  const [from, to] = wholeLines(source, member.from, member.to)
  return splice(source, from, to, '')
}

// MARK: - Beispiel

/** Start-Code wie im Spickzettel Java OOP & UML: Tier, Hund, Besitzer. */
export const exampleJava = `public class Tier {
    private String name;
    private int alter;

    public Tier(String name, int alter) {
        this.name = name;
        this.alter = alter;
    }

    public String getName() {
        return name;
    }

    public void lautGeben() {
        System.out.println("...");
    }
}

public class Hund extends Tier {
    private String rasse;

    public Hund(String name, int alter, String rasse) {
        super(name, alter);
        this.rasse = rasse;
    }

    public void lautGeben() {
        System.out.println("Wuff");
    }
}

public class Besitzer {
    private String name;
    private ArrayList<Hund> hunde;

    public void gassiGehen() {
        for (Hund h : hunde) {
            h.lautGeben();
        }
    }
}
`
