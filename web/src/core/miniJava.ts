/**
 * VisuObject-Debugger: führt das Java aus `miniJavaParser` selbst aus, Anweisung für Anweisung.
 * Jede Anweisung meldet sich vorher mit einem `step`-Ereignis (Generator), so kann der Debugger
 * anhalten, schrittweise weitergehen und dabei Variablen und Objekte zeigen. Echtes Java läuft
 * weiter über ▶ Start (CheerpJ); hier zählt, dass Schülerprogramme der FOS 12 gleich ablaufen.
 */

import { JavaSyntaxError, missingImport, parseJava, type ClassDecl, type Expr, type MethodDecl, type Pos, type Stmt, type TypeRef } from './miniJavaParser'

// MARK: - Werte

export class JDouble {
  constructor(readonly v: number) {}
}
export class JChar {
  constructor(readonly code: number) {}
}
export class JObject {
  fields = new Map<string, Val>()
  /** Nachricht und Aufrufstapel bei Exceptions, Name und Nummer bei enum-Konstanten. */
  native: { message?: Val; trace?: string[]; enumName?: string; ordinal?: number } = {}
  constructor(
    readonly cls: RtClass,
    readonly id: number,
  ) {}
}
export class JArray {
  constructor(
    readonly elem: TypeRef,
    public items: Val[],
    readonly id: number,
  ) {}
}
export class JList {
  items: Val[] = []
  constructor(readonly id: number) {}
}
export class JMap {
  entries = new Map<string, [Val, Val]>()
  constructor(readonly id: number) {}
}
export class JNative {
  buf = ''
  constructor(
    readonly kind: 'out' | 'err' | 'in' | 'Scanner' | 'Random' | 'StringBuilder',
    readonly id: number,
  ) {}
}
export class ClassRef {
  constructor(readonly name: string) {}
}

export type Val = number | boolean | string | null | undefined | JDouble | JChar | JObject | JArray | JList | JMap | JNative | ClassRef

export interface RtClass {
  name: string
  decl?: ClassDecl
  sup?: RtClass
  interfaces: string[]
  statics: Map<string, Val>
  staticTypes: Map<string, TypeRef>
  builtin?: boolean
  /** Voller Name für die Ausgabe, z. B. `java.lang.ArithmeticException`. */
  javaName?: string
}

interface Variable {
  v: Val
  type: TypeRef
}

interface Frame {
  cls: RtClass
  method?: MethodDecl
  self?: JObject
  scopes: Map<string, Variable>[]
  pos: Pos
  /** Titel im Aufrufstapel, z. B. `Spieler.punkte()` oder `new Spieler()`. */
  title: string
}

type Done = undefined | { k: 'break' } | { k: 'continue' } | { k: 'return'; v: Val }
const BREAK = { k: 'break' } as const
const CONTINUE = { k: 'continue' } as const

export type Ev = { k: 'step'; pos: Pos; depth: number } | { k: 'input' } | { k: 'sleep'; ms: number }
type G<T> = Generator<Ev, T, string | null | undefined>

/** Fehler, die echtes Java schon beim Übersetzen meldet oder die der Debugger nicht kann. */
export class MiniJavaError extends Error {
  constructor(
    readonly code: 'syntax' | 'symbol' | 'unsupported' | 'nomain' | 'type' | 'import',
    readonly detail: string,
    readonly pos?: Pos,
  ) {
    super(`${code}: ${detail}`)
  }
}

/** Eine geworfene Java-Exception. */
export class JavaThrow extends Error {
  constructor(readonly obj: JObject) {
    super(obj.cls.name)
  }
}

const T = (name: string, dims = 0): TypeRef => ({ name, dims, args: [] })
const intTypes = new Set(['int', 'long', 'short', 'byte', 'Integer', 'Long', 'Short', 'Byte'])
const doubleTypes = new Set(['double', 'float', 'Double', 'Float'])
const listTypes = new Set(['ArrayList', 'List', 'LinkedList', 'Collection', 'Iterable'])
const mapTypes = new Set(['HashMap', 'Map', 'TreeMap', 'LinkedHashMap'])

const builtinExceptions: [string, string, string][] = [
  ['Throwable', 'Object', 'java.lang'],
  ['Exception', 'Throwable', 'java.lang'],
  ['Error', 'Throwable', 'java.lang'],
  ['StackOverflowError', 'Error', 'java.lang'],
  ['RuntimeException', 'Exception', 'java.lang'],
  ['IOException', 'Exception', 'java.io'],
  ['InterruptedException', 'Exception', 'java.lang'],
  ['ArithmeticException', 'RuntimeException', 'java.lang'],
  ['NullPointerException', 'RuntimeException', 'java.lang'],
  ['ClassCastException', 'RuntimeException', 'java.lang'],
  ['IllegalArgumentException', 'RuntimeException', 'java.lang'],
  ['NumberFormatException', 'IllegalArgumentException', 'java.lang'],
  ['IllegalStateException', 'RuntimeException', 'java.lang'],
  ['UnsupportedOperationException', 'RuntimeException', 'java.lang'],
  ['IndexOutOfBoundsException', 'RuntimeException', 'java.lang'],
  ['ArrayIndexOutOfBoundsException', 'IndexOutOfBoundsException', 'java.lang'],
  ['StringIndexOutOfBoundsException', 'IndexOutOfBoundsException', 'java.lang'],
  ['NegativeArraySizeException', 'RuntimeException', 'java.lang'],
  ['NoSuchElementException', 'RuntimeException', 'java.util'],
  ['InputMismatchException', 'NoSuchElementException', 'java.util'],
  ['ConcurrentModificationException', 'RuntimeException', 'java.util'],
]
const staticBuiltins = new Set(['Math', 'System', 'Integer', 'Double', 'String', 'Character', 'Boolean', 'Long', 'Float', 'Arrays', 'Collections', 'Thread', 'Objects', 'List'])

/** Kommazahl wie Java `Double.toString`: `5.0`, `0.1`, `1.0E7`. */
export function formatDouble(v: number): string {
  if (Number.isNaN(v)) return 'NaN'
  if (!Number.isFinite(v)) return v > 0 ? 'Infinity' : '-Infinity'
  if (v === 0) return Object.is(v, -0) ? '-0.0' : '0.0'
  const a = Math.abs(v)
  if (a >= 1e-3 && a < 1e7) {
    const s = String(v)
    return s.includes('.') || s.includes('e') ? s : `${s}.0`
  }
  const [m, ex] = v.toExponential().split('e')
  return `${m.includes('.') ? m : `${m}.0`}E${Number(ex)}`
}

const javaHash = (id: number) => ((0x1b6d3586 + id * 0x9e3779b) >>> 0).toString(16)

function stringHash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h
}

const num = (v: Val): number => (typeof v === 'number' ? v : v instanceof JDouble ? v.v : v instanceof JChar ? v.code : NaN)
const isNum = (v: Val) => typeof v === 'number' || v instanceof JDouble || v instanceof JChar
const inInt = (x: number) => x >= -2147483648 && x <= 2147483647

/** Wert passend zum Typ der Variablen (int → double, char ↔ int, Cast). */
export function castTo(v: Val, type: TypeRef | undefined): Val {
  if (!type || type.dims || v === null || v === undefined) return v
  const n = type.name
  if (doubleTypes.has(n)) return isNum(v) ? new JDouble(num(v)) : v
  if (intTypes.has(n)) {
    if (v instanceof JChar) return v.code
    if (v instanceof JDouble) {
      if (Number.isNaN(v.v)) return 0
      const t = Math.trunc(v.v)
      return n === 'int' || n === 'Integer' ? Math.max(-2147483648, Math.min(2147483647, t)) : t
    }
    if (typeof v === 'number' && (n === 'byte' || n === 'Byte')) return (v << 24) >> 24
    if (typeof v === 'number' && (n === 'short' || n === 'Short')) return (v << 16) >> 16
    return v
  }
  if (n === 'char' || n === 'Character') return typeof v === 'number' || v instanceof JDouble ? new JChar(Math.trunc(num(v)) & 0xffff) : v
  return v
}

export function defaultValue(type: TypeRef): Val {
  if (type.dims) return null
  if (type.name === 'int' || type.name === 'long' || type.name === 'short' || type.name === 'byte') return 0
  if (type.name === 'double' || type.name === 'float') return new JDouble(0)
  if (type.name === 'boolean') return false
  if (type.name === 'char') return new JChar(0)
  return null
}

const typeText = (t: TypeRef): string => `${t.name}${t.args.length ? `<${t.args.map(typeText).join(', ')}>` : ''}${'[]'.repeat(t.dims)}`

// MARK: - Ansichten für den Debugger

export interface VarView {
  name: string
  type: string
  value: string
  /** Objekt, auf das die Variable zeigt (für das Objektdiagramm). */
  ref?: number
}
export interface FrameView {
  title: string
  pos: Pos
  vars: VarView[]
}
export interface HeapObject {
  id: number
  name: string
  cls: string
  fields: { name: string; type: string; value: string }[]
}

export type RunState =
  | { k: 'paused'; pos: Pos }
  | { k: 'running' }
  | { k: 'input' }
  | { k: 'sleep'; ms: number }
  | { k: 'done' }
  | { k: 'exception'; text: string; pos?: Pos }
  | { k: 'error'; error: MiniJavaError }

export interface SeqEvent {
  k: 'call' | 'create' | 'return'
  /** Teilnehmer: `o12` (Objekt) oder `cMain` (Klasse, statisch); bei `return` leer. */
  from: string
  to: string
  label: string
  /** Zeile des Aufrufs. */
  pos: Pos
  /** Rückkehr aus einem Konstruktor: nicht als Pfeil zeichnen. */
  hidden?: boolean
}
export interface SeqParticipant {
  key: string
  cls: string
  label: string
  isStatic: boolean
}

export type StepMode = 'run' | 'into' | 'over' | 'out'

export interface MiniJavaIO {
  out(text: string, err?: boolean): void
}

// MARK: - Interpreter

export class MiniJava {
  readonly classes = new Map<string, RtClass>()
  private frames: Frame[] = []
  private nextId = 1
  private quiet = 0
  private gen?: G<void>
  private send: string | null | undefined
  private mode: StepMode = 'run'
  private startDepth = 0
  private prevKey = ''
  private pauseRequested = false
  /** Objekt-Nummer → Name im Objektdiagramm (bleibt beim Weiterschalten gleich). */
  private names = new Map<number, string>()
  private tempNames = new Map<number, string>()
  /** Mitschnitt für das Sequenzdiagramm: Aufrufe eigener Methoden, `new`, Rückgaben. */
  private seq: SeqEvent[] = []
  private seqParticipants = new Map<string, { key: string; cls: string; id?: number }>()
  private seqLimit = 3000
  private stdin = new JNative('in', 0)
  finished = false

  constructor(
    files: { path: string; source: string }[],
    private io: MiniJavaIO,
  ) {
    const object: RtClass = { name: 'Object', interfaces: [], statics: new Map(), staticTypes: new Map(), builtin: true, javaName: 'java.lang.Object' }
    this.classes.set('Object', object)
    for (const [name, sup, pkg] of builtinExceptions)
      this.classes.set(name, { name, sup: this.classes.get(sup), interfaces: [], statics: new Map(), staticTypes: new Map(), builtin: true, javaName: `${pkg}.${name}` })
    const decls: ClassDecl[] = []
    for (const f of files) {
      try {
        decls.push(...parseJava(f.source, f.path))
      } catch (err) {
        if (err instanceof JavaSyntaxError) throw new MiniJavaError('syntax', err.message, err.pos)
        throw err
      }
    }
    for (const d of decls) this.classes.set(d.name, { name: d.name, decl: d, interfaces: d.interfaces, statics: new Map(), staticTypes: new Map() })
    const own = new Set(decls.map((d) => d.name))
    for (const f of files) {
      const missing = missingImport(f.source, f.path, own)
      if (missing) throw new MiniJavaError('import', missing.line, missing.pos)
    }
    for (const d of decls) {
      const c = this.classes.get(d.name)!
      const sup = d.superclass ?? (d.kind === 'class' ? 'Object' : undefined)
      if (sup) {
        c.sup = this.classes.get(sup)
        if (!c.sup) throw new MiniJavaError('symbol', sup, d)
      }
    }
  }

  // MARK: Steuerung

  /** Programm vorbereiten: `main` der Klasse `mainClass` (oder der ersten mit main). */
  start(mainClass?: string) {
    const candidates = [...this.classes.values()].filter((c) => c.decl?.methods.some(isMain))
    const cls = candidates.find((c) => c.name === mainClass) ?? candidates[0]
    if (!cls) throw new MiniJavaError('nomain', '')
    this.gen = this.program(cls)
    this.finished = false
  }

  /** Wie es weitergehen soll: bis zum Haltepunkt, in die nächste Anweisung, darüber, heraus. */
  go(mode: StepMode) {
    this.mode = mode
    this.startDepth = this.frames.length
    this.pauseRequested = false
  }

  pause() {
    this.pauseRequested = true
  }

  /** Antwort auf `input` (eine Zeile aus der Konsole; `null` = Eingabe beendet). */
  input(line: string | null) {
    this.send = line
  }

  /** Höchstens `budget` Anweisungen ausführen. Haltepunkte als `Datei:Zeile` (Zeile ab 0). */
  run(breakpoints: Set<string>, budget = 5000): RunState {
    if (!this.gen || this.finished) return { k: 'done' }
    for (let n = 0; n < budget; n++) {
      let r: IteratorResult<Ev, void>
      try {
        r = this.gen.next(this.send)
      } catch (err) {
        this.finished = true
        if (err instanceof ProgramExit) return { k: 'done' }
        if (err instanceof JavaThrow) return { k: 'exception', text: this.uncaught(err.obj), pos: this.frames.at(-1)?.pos }
        if (err instanceof MiniJavaError) return { k: 'error', error: err }
        if (err instanceof RangeError) return { k: 'exception', text: 'Exception in thread "main" java.lang.StackOverflowError' }
        throw err
      }
      this.send = undefined
      if (r.done) {
        this.finished = true
        return { k: 'done' }
      }
      const ev = r.value
      if (ev.k === 'input') return { k: 'input' }
      if (ev.k === 'sleep') return { k: 'sleep', ms: ev.ms }
      const key = `${ev.pos.file}:${ev.pos.line}`
      const fresh = key !== this.prevKey
      this.prevKey = key
      const hit =
        this.pauseRequested || this.mode === 'into' || (this.mode === 'over' && ev.depth <= this.startDepth) || (this.mode === 'out' && ev.depth < this.startDepth) || (fresh && breakpoints.has(key))
      if (hit) {
        this.pauseRequested = false
        return { k: 'paused', pos: ev.pos }
      }
    }
    return { k: 'running' }
  }

  private uncaught(obj: JObject): string {
    const head = `Exception in thread "main" ${this.throwableText(obj)}`
    return [head, ...(obj.native.trace ?? []).map((t) => `\tat ${t}`)].join('\n')
  }

  // MARK: Ansichten

  /** Aufrufstapel, oberste Methode zuerst, mit ihren Variablen. */
  stack(): FrameView[] {
    this.nameObjects()
    return [...this.frames].reverse().map((f) => {
      const vars: VarView[] = []
      if (f.self) vars.push({ name: 'this', type: f.self.cls.name, value: this.show(f.self), ref: f.self.id })
      for (const scope of f.scopes) for (const [name, v] of scope) vars.push({ name, type: typeText(v.type), value: this.show(v.v), ...(v.v instanceof JObject ? { ref: v.v.id } : {}) })
      return { title: f.title, pos: f.pos, vars }
    })
  }

  /** Alle erreichbaren Objekte eigener Klassen (für das Objektdiagramm). */
  heap(): HeapObject[] {
    return this.nameObjects().map((o) => ({
      id: o.id,
      name: (this.names.get(o.id) ?? this.tempNames.get(o.id))!,
      cls: o.cls.name,
      fields: [...o.fields].map(([name, v]) => ({ name, type: typeText(this.fieldType(o.cls, name) ?? T('Object')), value: this.show(v) })),
    }))
  }

  private fieldType(cls: RtClass | undefined, name: string): TypeRef | undefined {
    for (let c = cls; c; c = c.sup) {
      const f = c.decl?.fields.find((x) => x.name === name && !x.isStatic)
      if (f) return f.type
    }
    return undefined
  }

  /** Objekte erreichbar von statischen Attributen und Variablen; Namen nach der Variablen (`s1`), dem Attribut (`team`) oder der Klasse. */
  private nameObjects(): JObject[] {
    const found: JObject[] = []
    const seen = new Set<number>()
    const taken = new Set(this.names.values())
    this.tempNames.clear()
    // Name nach einer Variablen bleibt; nach einem Attribut oder der Klasse (in einer Liste, `this` im Konstruktor) nur vorläufig.
    const give = (o: JObject, base: string, keep: boolean) => {
      if (this.names.has(o.id)) return
      const real = /^[\p{L}_$][\p{L}\p{N}_$]*$/u.test(base)
      let name = real ? base : o.cls.name.charAt(0).toLowerCase() + o.cls.name.slice(1)
      if (taken.has(name)) {
        let n = 2
        while (taken.has(`${name}${n}`)) n++
        name = `${name}${n}`
      }
      taken.add(name)
      ;(real && keep ? this.names : this.tempNames).set(o.id, name)
    }
    const queue: [Val, string, boolean?][] = []
    const visit = (v: Val, base: string, keep: boolean) => {
      if (v instanceof JObject) {
        if (v.cls.builtin || v.native.enumName !== undefined || seen.has(v.id)) return
        seen.add(v.id)
        give(v, base, keep)
        found.push(v)
        for (const [f, x] of v.fields) queue.push([x, f])
      } else if (v instanceof JArray || v instanceof JList) {
        for (const x of v.items) if (x instanceof JObject) queue.push([x, ''])
      } else if (v instanceof JMap) for (const [k, x] of v.entries.values()) queue.push([k, ''], [x, ''])
    }
    for (const f of this.frames) {
      if (f.self) queue.push([f.self, ''])
      for (const scope of f.scopes) for (const [name, v] of scope) queue.push([v.v, name, true])
    }
    for (const c of this.classes.values()) for (const [name, v] of c.statics) queue.push([v, name, true])
    // Erst die direkt benannten Objekte (Variablen), dann was an Attributen hängt.
    for (let i = 0; i < queue.length; i++) {
      const [v, base, keep] = queue[i]
      // Ohne Namen erst später besuchen: Vielleicht zeigt noch eine Variable darauf.
      if (base === '' && v instanceof JObject && !this.names.has(v.id) && queue.slice(i + 1).some(([x, b]) => x === v && b !== '')) continue
      visit(v, base, !!keep)
    }
    return found.sort((a, b) => a.id - b.id)
  }

  /** Wert für Anzeige und Objektdiagramm: Objekte mit ihrem Namen, Texte in Anführungszeichen. */
  show(v: Val): string {
    if (v === undefined) return '?'
    if (v === null) return 'null'
    if (typeof v === 'string') return JSON.stringify(v)
    if (typeof v === 'number' || typeof v === 'boolean') return String(v)
    if (v instanceof JDouble) return formatDouble(v.v)
    if (v instanceof JChar) return v.code ? `'${String.fromCharCode(v.code)}'` : "''"
    if (v instanceof JObject) {
      if (v.native.enumName !== undefined) return v.native.enumName
      if (v.cls.builtin) return v.cls.name
      return this.names.get(v.id) ?? this.tempNames.get(v.id) ?? `${v.cls.name}@${javaHash(v.id)}`
    }
    if (v instanceof JArray || v instanceof JList) {
      const items = v.items.slice(0, 30).map((x) => this.show(x))
      return `[${items.join(', ')}${v.items.length > 30 ? ', …' : ''}]`
    }
    if (v instanceof JMap) return `{${[...v.entries.values()].map(([k, x]) => `${this.show(k)}=${this.show(x)}`).join(', ')}}`
    if (v instanceof JNative) return v.kind === 'StringBuilder' ? JSON.stringify(v.buf) : v.kind
    return v.name
  }

  // MARK: Sequenzdiagramm

  private seqKey(of: JObject | RtClass) {
    return of instanceof JObject ? `o${of.id}` : `c${of.name}`
  }

  private record(k: 'call' | 'create', to: JObject | RtClass, label: () => string): boolean {
    if (this.quiet || this.seq.length >= this.seqLimit) return false
    const caller = this.frames.at(-1)
    const from = caller ? this.seqKey(caller.self ?? caller.cls) : ''
    const key = this.seqKey(to)
    if (!this.seqParticipants.has(key)) this.seqParticipants.set(key, to instanceof JObject ? { key, cls: to.cls.name, id: to.id } : { key, cls: to.name })
    this.nameObjects()
    this.seq.push({ k, from, to: key, label: label(), pos: caller?.pos ?? { file: '', line: 0 } })
    return true
  }

  private recordReturn(label: string, exception: boolean, hidden = false) {
    if (this.seq.length >= this.seqLimit + 1000) return
    this.seq.push({ k: 'return', from: '', to: '', label: exception ? '⚡' : label, pos: this.frames.at(-1)?.pos ?? { file: '', line: 0 }, ...(hidden && !exception ? { hidden } : {}) })
  }

  /** Mitschnitt mit Namen wie im Objektdiagramm: `s1 : Spieler`, ohne Namen `:Spieler`, statisch der Klassenname. */
  sequence(): { participants: SeqParticipant[]; events: SeqEvent[]; truncated: boolean } {
    this.nameObjects()
    const participants = [...this.seqParticipants.values()].map((p) => ({
      key: p.key,
      cls: p.cls,
      label: p.id === undefined ? p.cls : `${this.names.get(p.id) ?? this.tempNames.get(p.id) ?? ''} : ${p.cls}`,
      isStatic: p.id === undefined,
    }))
    return { participants, events: [...this.seq], truncated: this.seq.length >= this.seqLimit }
  }

  // MARK: Ablauf

  private get frame(): Frame {
    return this.frames[this.frames.length - 1]
  }

  private *step(at: Pos): G<void> {
    const pos = { file: at.file, line: at.line }
    if (this.frames.length) this.frame.pos = pos
    if (!this.quiet) yield { k: 'step', pos, depth: this.frames.length }
  }

  private *program(cls: RtClass): G<void> {
    this.quiet++
    try {
      for (const c of this.classes.values()) yield* this.initStatics(c)
    } finally {
      this.quiet--
    }
    const main = cls.decl!.methods.find(isMain)!
    this.seqParticipants.set(`c${cls.name}`, { key: `c${cls.name}`, cls: cls.name })
    yield* this.invoke(main, cls, undefined, [new JArray(T('String'), [], this.id())])
  }

  private id() {
    return this.nextId++
  }

  private *initStatics(c: RtClass): G<void> {
    const d = c.decl
    if (!d) return
    if (d.kind === 'enum')
      d.enumConstants.forEach((name, ordinal) => {
        const o = new JObject(c, this.id())
        o.native = { enumName: name, ordinal }
        c.statics.set(name, o)
        c.staticTypes.set(name, T(c.name))
      })
    for (const f of d.fields)
      if (f.isStatic) {
        c.statics.set(f.name, defaultValue(f.type))
        c.staticTypes.set(f.name, f.type)
      }
    const frame: Frame = { cls: c, scopes: [new Map()], pos: d, title: `${c.name} (static)` }
    this.frames.push(frame)
    try {
      for (const f of d.fields) if (f.isStatic && f.init) c.statics.set(f.name, castTo(yield* this.initValue(f.init, f.type), f.type))
    } finally {
      this.frames.pop()
    }
  }

  private *initValue(e: Expr, type: TypeRef): G<Val> {
    return e.k === 'arrayInit' ? yield* this.arrayFrom(e, type) : yield* this.eval(e)
  }

  private *arrayFrom(e: Expr & { k: 'arrayInit' }, type: TypeRef): G<JArray> {
    const elem = { ...type, dims: type.dims - 1 }
    const items: Val[] = []
    for (const x of e.items) items.push(castTo(x.k === 'arrayInit' ? yield* this.arrayFrom(x, elem) : yield* this.eval(x), elem))
    return new JArray(elem, items, this.id())
  }

  // MARK: Methoden und Konstruktoren

  private *invoke(m: MethodDecl, owner: RtClass, self: JObject | undefined, args: Val[]): G<Val> {
    if (!m.body) throw new MiniJavaError('unsupported', `abstract ${m.name}`, m)
    if (this.frames.length > 900) throw new JavaThrow(this.exception('StackOverflowError'))
    const scope = new Map<string, Variable>()
    m.params.forEach((p, i) => scope.set(p.name, { v: castTo(args[i], p.type), type: p.type }))
    const title = m.isConstructor ? `new ${owner.name}()` : `${owner.name}.${m.name}()`
    const recorded = this.frames.length > 0 && this.record('call', self ? self : owner, () => `${m.name}(${args.map((a) => this.show(a)).join(', ')})`)
    this.frames.push({ cls: owner, method: m, self, scopes: [scope], pos: m, title })
    let done = false
    try {
      const r = yield* this.execBody(m.body.body)
      let v: Val = undefined
      if (r?.k === 'return') v = castTo(r.v, m.returns)
      else yield* this.step({ file: m.file, line: m.endLine })
      done = true
      this.frames.pop()
      if (recorded) this.recordReturn(m.returns && m.returns.name !== 'void' ? this.show(v) : '', false)
      return v
    } finally {
      if (!done) {
        this.frames.pop()
        if (recorded) this.recordReturn('', true)
      }
    }
  }

  private *execBody(body: Stmt[]): G<Done> {
    for (const s of body) {
      const r = yield* this.exec(s)
      if (r) return r
    }
    return undefined
  }

  private *construct(cls: RtClass, args: Val[], pos: Pos): G<JObject> {
    if (cls.decl?.isAbstract) throw new MiniJavaError('type', `abstract ${cls.name}`, pos)
    const obj = new JObject(cls, this.id())
    const chain: RtClass[] = []
    for (let c: RtClass | undefined = cls; c; c = c.sup) chain.unshift(c)
    for (const c of chain) for (const f of c.decl?.fields ?? []) if (!f.isStatic) obj.fields.set(f.name, defaultValue(f.type))
    const recorded = this.record('create', obj, () => `new ${cls.name}(${args.map((a) => this.show(a)).join(', ')})`)
    let done = false
    try {
      yield* this.runCtor(cls, obj, args, pos)
      done = true
    } finally {
      if (recorded) this.recordReturn('', !done, true)
    }
    return obj
  }

  private *runCtor(cls: RtClass, obj: JObject, args: Val[], pos: Pos): G<void> {
    if (cls.builtin) {
      if (args.length) obj.native.message = typeof args[0] === 'string' || args[0] === null ? args[0] : yield* this.str(args[0])
      obj.native.trace = this.trace()
      return
    }
    const decl = cls.decl!
    const ctors = decl.methods.filter((m) => m.isConstructor)
    if (!ctors.length) {
      if (args.length) throw new MiniJavaError('symbol', `${cls.name}(${args.length})`, pos)
      if (cls.sup) yield* this.runCtor(cls.sup, obj, [], pos)
      this.frames.push({ cls, self: obj, scopes: [new Map()], pos: decl, title: `new ${cls.name}()` })
      try {
        yield* this.fieldInits(cls, obj)
      } finally {
        this.frames.pop()
      }
      return
    }
    const m = this.pick(ctors, args)
    if (!m) throw new MiniJavaError('symbol', `${cls.name}(${args.length})`, pos)
    const scope = new Map<string, Variable>()
    m.params.forEach((p, i) => scope.set(p.name, { v: castTo(args[i], p.type), type: p.type }))
    this.frames.push({ cls, method: m, self: obj, scopes: [scope], pos: m, title: `new ${cls.name}()` })
    try {
      let body = m.body!.body
      const first = body[0]
      if (first?.k === 'ctorCall') {
        yield* this.step(first)
        const a: Val[] = []
        for (const x of first.args) a.push(yield* this.eval(x))
        body = body.slice(1)
        if (first.isSuper) {
          if (cls.sup) yield* this.runCtor(cls.sup, obj, a, first)
          yield* this.fieldInits(cls, obj)
        } else yield* this.runCtor(cls, obj, a, first)
      } else {
        if (cls.sup) yield* this.runCtor(cls.sup, obj, [], m)
        yield* this.fieldInits(cls, obj)
      }
      const r = yield* this.execBody(body)
      if (r?.k !== 'return') yield* this.step({ file: m.file, line: m.endLine })
    } finally {
      this.frames.pop()
    }
  }

  private *fieldInits(cls: RtClass, obj: JObject): G<void> {
    for (const f of cls.decl?.fields ?? [])
      if (!f.isStatic && f.init) {
        yield* this.step(f)
        obj.fields.set(f.name, castTo(yield* this.initValue(f.init, f.type), f.type))
      }
  }

  /** Passende Methode zu den Argumenten (Überladen: genauester Treffer). */
  private pick(methods: MethodDecl[], args: Val[]): MethodDecl | undefined {
    let best: MethodDecl | undefined
    let bestScore = -1
    for (const m of methods) {
      if (m.params.length !== args.length) continue
      let score = 0
      for (let i = 0; i < args.length && score >= 0; i++) {
        const s = this.fits(args[i], m.params[i].type)
        score = s < 0 ? -1 : score + s
      }
      if (score > bestScore) {
        best = m
        bestScore = score
      }
    }
    return best
  }

  /** Passt der Wert zum Parametertyp? 2 = genau, 1 = umwandelbar, -1 = nein. */
  private fits(v: Val, t: TypeRef): number {
    const n = t.name
    if (t.dims) return v === null ? 1 : v instanceof JArray ? 2 : -1
    if (intTypes.has(n)) return typeof v === 'number' ? 2 : v instanceof JChar ? 1 : -1
    if (doubleTypes.has(n)) return v instanceof JDouble ? 2 : isNum(v) ? 1 : -1
    if (n === 'char' || n === 'Character') return v instanceof JChar ? 2 : -1
    if (n === 'boolean' || n === 'Boolean') return typeof v === 'boolean' ? 2 : -1
    if (n === 'String') return typeof v === 'string' ? 2 : v === null ? 1 : -1
    if (n === 'Object') return 0
    if (listTypes.has(n)) return v instanceof JList ? 2 : v === null ? 1 : -1
    if (mapTypes.has(n)) return v instanceof JMap ? 2 : v === null ? 1 : -1
    const cls = this.classes.get(n)
    if (cls) return v === null ? 1 : v instanceof JObject && this.isA(v.cls, n) ? (v.cls.name === n ? 2 : 1) : -1
    return 0
  }

  private isA(cls: RtClass | undefined, name: string): boolean {
    const seen = new Set<string>()
    const walk = (c: RtClass | undefined): boolean => {
      if (!c || seen.has(c.name)) return false
      if (c.name === name) return true
      seen.add(c.name)
      return walk(c.sup) || c.interfaces.some((i) => walk(this.classes.get(i)))
    }
    return name === 'Object' || walk(cls)
  }

  /** Methode suchen: Klasse, dann Oberklassen, dann Interfaces (default-Methoden). */
  private findMethod(cls: RtClass | undefined, name: string, args: Val[], wantBody = true): { m: MethodDecl; owner: RtClass } | undefined {
    const seen = new Set<string>()
    const ifaces: RtClass[] = []
    for (let c = cls; c; c = c.sup) {
      const m = this.pick(c.decl?.methods.filter((x) => x.name === name && !x.isConstructor && (!wantBody || x.body)) ?? [], args)
      if (m) return { m, owner: c }
      for (const i of c.interfaces) ifaces.push(this.classes.get(i)!)
    }
    while (ifaces.length) {
      const c = ifaces.shift()
      if (!c || seen.has(c.name)) continue
      seen.add(c.name)
      const m = this.pick(c.decl?.methods.filter((x) => x.name === name && (!wantBody || x.body)) ?? [], args)
      if (m) return { m, owner: c }
      for (const i of c.interfaces) ifaces.push(this.classes.get(i)!)
    }
    return undefined
  }

  private trace(): string[] {
    return [...this.frames].reverse().map((f) => {
      const name = f.method ? (f.method.isConstructor ? '<init>' : f.method.name) : '<clinit>'
      return `${f.cls.name}.${name}(${f.pos.file.split('/').pop()}:${f.pos.line + 1})`
    })
  }

  private exception(name: string, message?: string): JObject {
    const o = new JObject(this.classes.get(name)!, this.id())
    o.native = { message: message ?? null, trace: this.trace() }
    return o
  }

  private fail(name: string, message?: string): never {
    throw new JavaThrow(this.exception(name, message))
  }

  private throwableText(o: JObject): string {
    const msg = o.native.message
    const name = o.cls.javaName ?? o.cls.name
    return msg === null || msg === undefined ? name : `${name}: ${msg}`
  }

  // MARK: Anweisungen

  private *exec(s: Stmt): G<Done> {
    switch (s.k) {
      case 'block': {
        this.frame.scopes.push(new Map())
        try {
          return yield* this.execBody(s.body)
        } finally {
          this.frame.scopes.pop()
        }
      }
      case 'empty':
        return undefined
      case 'local':
        yield* this.step(s)
        yield* this.declare(s)
        return undefined
      case 'expr':
        yield* this.step(s)
        yield* this.eval(s.expr)
        return undefined
      case 'if':
        yield* this.step(s)
        if (yield* this.test(s.test)) return yield* this.exec(s.then)
        return s.else ? yield* this.exec(s.else) : undefined
      case 'while':
        for (;;) {
          yield* this.step(s)
          if (!(yield* this.test(s.test))) return undefined
          const r = yield* this.exec(s.body)
          if (r?.k === 'break') return undefined
          if (r?.k === 'return') return r
        }
      case 'do':
        for (;;) {
          const r = yield* this.exec(s.body)
          if (r?.k === 'break') return undefined
          if (r?.k === 'return') return r
          yield* this.step(s.test)
          if (!(yield* this.test(s.test))) return undefined
        }
      case 'for': {
        this.frame.scopes.push(new Map())
        try {
          yield* this.step(s)
          for (const init of s.init) {
            if (init.k === 'local') yield* this.declare(init)
            else if (init.k === 'expr') yield* this.eval(init.expr)
          }
          for (;;) {
            if (s.test && !(yield* this.test(s.test))) return undefined
            const r = yield* this.exec(s.body)
            if (r?.k === 'break') return undefined
            if (r?.k === 'return') return r
            yield* this.step(s)
            for (const u of s.update) yield* this.eval(u)
          }
        } finally {
          this.frame.scopes.pop()
        }
      }
      case 'foreach': {
        yield* this.step(s)
        const iter = yield* this.eval(s.iter)
        if (iter === null) this.fail('NullPointerException')
        const items = iter instanceof JArray || iter instanceof JList ? [...iter.items] : iter instanceof JMap ? [...iter.entries.values()].map((e) => e[0]) : undefined
        if (!items) throw new MiniJavaError('type', 'for-each', s)
        for (let i = 0; i < items.length; i++) {
          if (i > 0) yield* this.step(s)
          if (iter instanceof JList && iter.items.length !== items.length) this.fail('ConcurrentModificationException')
          this.frame.scopes.push(new Map([[s.name, { v: castTo(items[i], s.type), type: s.type }]]))
          try {
            const r = yield* this.exec(s.body)
            if (r?.k === 'break') return undefined
            if (r?.k === 'return') return r
          } finally {
            this.frame.scopes.pop()
          }
        }
        return undefined
      }
      case 'switch': {
        yield* this.step(s)
        const v = yield* this.eval(s.expr)
        let start = -1
        for (let i = 0; i < s.cases.length && start < 0; i++) {
          const labels = s.cases[i].labels
          if (labels === 'default') continue
          for (const l of labels) {
            const lv = v instanceof JObject && v.native.enumName !== undefined && l.k === 'name' ? v.cls.statics.get(l.name) : yield* this.eval(l)
            if (this.same(v, lv)) start = i
          }
        }
        if (start < 0) start = s.cases.findIndex((c) => c.labels === 'default')
        if (start < 0) return undefined
        this.frame.scopes.push(new Map())
        try {
          for (let i = start; i < s.cases.length; i++) {
            const r = yield* this.execBody(s.cases[i].body)
            if (r?.k === 'break') return undefined
            if (r) return r
            if (s.cases[i].arrow) return undefined
          }
        } finally {
          this.frame.scopes.pop()
        }
        return undefined
      }
      case 'break':
        yield* this.step(s)
        return BREAK
      case 'continue':
        yield* this.step(s)
        return CONTINUE
      case 'return':
        yield* this.step(s)
        return { k: 'return', v: s.value ? yield* this.eval(s.value) : undefined }
      case 'throw': {
        yield* this.step(s)
        const v = yield* this.eval(s.value)
        if (!(v instanceof JObject)) this.fail('NullPointerException')
        throw new JavaThrow(v)
      }
      case 'try': {
        let result: Done
        try {
          try {
            result = yield* this.exec(s.body)
          } catch (err) {
            if (!(err instanceof JavaThrow)) throw err
            const c = s.catches.find((x) => x.types.some((t) => this.isA(err.obj.cls, t.name)))
            if (!c) throw err
            this.frame.scopes.push(new Map([[c.name, { v: err.obj, type: c.types[0] }]]))
            try {
              result = yield* this.exec(c.body)
            } finally {
              this.frame.scopes.pop()
            }
          }
        } finally {
          if (s.finally) {
            const r = yield* this.exec(s.finally)
            if (r) return r
          }
        }
        return result
      }
      case 'ctorCall':
        throw new MiniJavaError('syntax', 'ctorCall', s)
    }
  }

  private *declare(s: Stmt & { k: 'local' }): G<void> {
    for (const v of s.vars) {
      const type = v.dims ? { ...s.type, dims: s.type.dims + v.dims } : s.type
      const value = v.init ? castTo(yield* this.initValue(v.init, type), type) : undefined
      this.frame.scopes[this.frame.scopes.length - 1].set(v.name, { v: value, type })
    }
  }

  private *test(e: Expr): G<boolean> {
    const v = yield* this.eval(e)
    if (typeof v !== 'boolean') throw new MiniJavaError('type', 'boolean', e)
    return v
  }

  // MARK: Ausdrücke

  private lookupVar(name: string): Variable | undefined {
    const scopes = this.frame.scopes
    for (let i = scopes.length - 1; i >= 0; i--) {
      const v = scopes[i].get(name)
      if (v) return v
    }
    return undefined
  }

  private staticOwner(cls: RtClass | undefined, name: string): RtClass | undefined {
    const seen = new Set<string>()
    const walk = (c: RtClass | undefined): RtClass | undefined => {
      if (!c || seen.has(c.name)) return undefined
      seen.add(c.name)
      if (c.statics.has(name)) return c
      return walk(c.sup) ?? c.interfaces.map((i) => walk(this.classes.get(i))).find(Boolean)
    }
    return walk(cls)
  }

  /** Ort zum Lesen und Schreiben: Variable, Attribut, statisches Attribut oder Array-Element. */
  private *place(e: Expr): G<{ get(): Val; set(v: Val): void; type?: TypeRef }> {
    if (e.k === 'name') {
      const local = this.lookupVar(e.name)
      if (local) return { get: () => local.v, set: (v) => (local.v = v), type: local.type }
      const self = this.frame.self
      if (self?.fields.has(e.name)) return { get: () => self.fields.get(e.name), set: (v) => self.fields.set(e.name, v), type: this.fieldType(self.cls, e.name) }
      const owner = this.staticOwner(this.frame.cls, e.name)
      if (owner) return { get: () => owner.statics.get(e.name), set: (v) => owner.statics.set(e.name, v), type: owner.staticTypes.get(e.name) }
      if (this.classes.has(e.name) || staticBuiltins.has(e.name)) return { get: () => new ClassRef(e.name), set: () => {} }
      throw new MiniJavaError('symbol', e.name, e)
    }
    if (e.k === 'field') {
      const target = yield* this.eval(e.target)
      if (target instanceof JObject && target.fields.has(e.name)) return { get: () => target.fields.get(e.name), set: (v) => target.fields.set(e.name, v), type: this.fieldType(target.cls, e.name) }
      const owner = target instanceof ClassRef ? this.staticOwner(this.classes.get(target.name), e.name) : target instanceof JObject ? this.staticOwner(target.cls, e.name) : undefined
      if (owner) return { get: () => owner.statics.get(e.name), set: (v) => owner.statics.set(e.name, v), type: owner.staticTypes.get(e.name) }
      const v = this.builtinField(target, e.name, e)
      return {
        get: () => v,
        set: () => {
          throw new MiniJavaError('type', e.name, e)
        },
      }
    }
    if (e.k === 'index') {
      const arr = yield* this.eval(e.target)
      const i = num(yield* this.eval(e.index))
      if (arr === null) this.fail('NullPointerException')
      if (!(arr instanceof JArray)) throw new MiniJavaError('type', '[]', e)
      if (i < 0 || i >= arr.items.length) this.fail('ArrayIndexOutOfBoundsException', `Index ${i} out of bounds for length ${arr.items.length}`)
      return { get: () => arr.items[i], set: (v) => (arr.items[i] = v), type: arr.elem }
    }
    const v = yield* this.eval(e)
    return {
      get: () => v,
      set: () => {
        throw new MiniJavaError('syntax', 'assignTarget', e)
      },
    }
  }

  private builtinField(target: Val, name: string, pos: Pos): Val {
    if (target === null) this.fail('NullPointerException', `Cannot read field "${name}" because value is null`)
    if (target instanceof JArray && name === 'length') return target.items.length
    if (target instanceof ClassRef) {
      const key = `${target.name}.${name}`
      switch (key) {
        case 'System.out':
          return new JNative('out', 0)
        case 'System.err':
          return new JNative('err', 0)
        case 'System.in':
          return this.stdin
        case 'Math.PI':
          return new JDouble(Math.PI)
        case 'Math.E':
          return new JDouble(Math.E)
        case 'Integer.MAX_VALUE':
          return 2147483647
        case 'Integer.MIN_VALUE':
          return -2147483648
        case 'Long.MAX_VALUE':
          return Number.MAX_SAFE_INTEGER
        case 'Double.MAX_VALUE':
          return new JDouble(Number.MAX_VALUE)
        case 'Double.MIN_VALUE':
          return new JDouble(Number.MIN_VALUE)
      }
    }
    throw new MiniJavaError('symbol', name, pos)
  }

  private *eval(e: Expr): G<Val> {
    switch (e.k) {
      case 'lit': {
        const { t, v } = e.value
        return t === 'double' ? new JDouble(v as number) : t === 'char' ? new JChar(v as number) : (v as Val)
      }
      case 'name': {
        const local = this.lookupVar(e.name)
        if (local) {
          if (local.v === undefined) throw new MiniJavaError('type', `uninit:${e.name}`, e)
          return local.v
        }
        return (yield* this.place(e)).get()
      }
      case 'this':
        if (!this.frame.self) throw new MiniJavaError('type', 'static:this', e)
        return this.frame.self
      case 'super':
        if (!this.frame.self) throw new MiniJavaError('type', 'static:super', e)
        return this.frame.self
      case 'field':
      case 'index':
        return (yield* this.place(e)).get()
      case 'assign': {
        const p = yield* this.place(e.target)
        let v: Val
        if (e.op === '=') v = e.value.k === 'arrayInit' && p.type ? yield* this.arrayFrom(e.value, p.type) : yield* this.eval(e.value)
        else {
          const old = p.get()
          v = yield* this.binary(e.op.slice(0, -1), old, yield* this.eval(e.value), e)
        }
        v = castTo(v, p.type)
        p.set(v)
        return v
      }
      case 'incdec': {
        const p = yield* this.place(e.target)
        const old = p.get()
        if (!isNum(old)) this.fail('NullPointerException')
        const d = e.op === '++' ? 1 : -1
        const nv = old instanceof JDouble ? new JDouble(old.v + d) : old instanceof JChar ? new JChar((old.code + d) & 0xffff) : inInt(num(old)) ? (num(old) + d) | 0 : num(old) + d
        p.set(castTo(nv, p.type))
        return e.prefix ? nv : old
      }
      case 'unary': {
        const v = yield* this.eval(e.expr)
        if (e.op === '!') return !v
        if (e.op === '-') return v instanceof JDouble ? new JDouble(-v.v) : inInt(num(v)) ? -num(v) | 0 : -num(v)
        if (e.op === '~') return ~num(v)
        return v instanceof JChar ? v.code : v
      }
      case 'binary': {
        if (e.op === '&&') return (yield* this.test(e.left)) && (yield* this.test(e.right))
        if (e.op === '||') return (yield* this.test(e.left)) || (yield* this.test(e.right))
        const a = yield* this.eval(e.left)
        const b = yield* this.eval(e.right)
        return yield* this.binary(e.op, a, b, e)
      }
      case 'cond':
        return (yield* this.test(e.test)) ? yield* this.eval(e.then) : yield* this.eval(e.else)
      case 'cast': {
        const v = yield* this.eval(e.expr)
        const n = e.type.name
        if (v instanceof JObject && this.classes.has(n) && !this.isA(v.cls, n)) this.fail('ClassCastException', `class ${v.cls.name} cannot be cast to class ${n}`)
        return castTo(v, e.type)
      }
      case 'instanceof': {
        const v = yield* this.eval(e.expr)
        if (v === null) return false
        const n = e.type.name
        if (v instanceof JObject) return this.isA(v.cls, n)
        if (typeof v === 'string') return n === 'String' || n === 'Object' || n === 'CharSequence'
        if (v instanceof JList) return listTypes.has(n) || n === 'Object'
        return n === 'Object'
      }
      case 'new':
        return yield* this.create(e)
      case 'newArray': {
        if (e.init && e.init.k === 'arrayInit') return yield* this.arrayFrom(e.init, e.type)
        const sizes: number[] = []
        for (const s of e.sizes) sizes.push(num(yield* this.eval(s)))
        const make = (level: number, type: TypeRef): JArray => {
          const n = sizes[level]
          if (n < 0) this.fail('NegativeArraySizeException', String(n))
          const elem = { ...type, dims: type.dims - 1 }
          const items = Array.from({ length: n }, () => (level + 1 < sizes.length ? make(level + 1, elem) : defaultValue(elem)))
          return new JArray(elem, items, this.id())
        }
        return make(0, e.type)
      }
      case 'arrayInit':
        return yield* this.arrayFrom(e, T('Object', 1))
      case 'call':
        return yield* this.call(e)
    }
  }

  private *binary(op: string, a: Val, b: Val, pos: Pos): G<Val> {
    if (op === '+' && (typeof a === 'string' || typeof b === 'string')) return (yield* this.str(a)) + (yield* this.str(b))
    if (op === '==') return this.same(a, b)
    if (op === '!=') return !this.same(a, b)
    if (typeof a === 'boolean' && typeof b === 'boolean') {
      if (op === '&') return a && b
      if (op === '|') return a || b
      if (op === '^') return a !== b
    }
    if (!isNum(a) || !isNum(b)) {
      if (a === null || b === null) this.fail('NullPointerException')
      throw new MiniJavaError('type', op, pos)
    }
    const x = num(a)
    const y = num(b)
    const dbl = a instanceof JDouble || b instanceof JDouble
    const ints = inInt(x) && inInt(y)
    switch (op) {
      case '+':
        return dbl ? new JDouble(x + y) : ints ? (x + y) | 0 : x + y
      case '-':
        return dbl ? new JDouble(x - y) : ints ? (x - y) | 0 : x - y
      case '*':
        return dbl ? new JDouble(x * y) : ints ? Math.imul(x, y) : x * y
      case '/':
        if (dbl) return new JDouble(x / y)
        if (y === 0) this.fail('ArithmeticException', '/ by zero')
        return ints ? Math.trunc(x / y) | 0 : Math.trunc(x / y)
      case '%':
        if (dbl) return new JDouble(x % y)
        if (y === 0) this.fail('ArithmeticException', '/ by zero')
        return x % y
      case '<':
        return x < y
      case '>':
        return x > y
      case '<=':
        return x <= y
      case '>=':
        return x >= y
      case '&':
        return x & y
      case '|':
        return x | y
      case '^':
        return x ^ y
      case '<<':
        return x << y
      case '>>':
        return x >> y
      case '>>>':
        return x >>> y
    }
    throw new MiniJavaError('unsupported', op, pos)
  }

  private same(a: Val, b: Val): boolean {
    if (isNum(a) && isNum(b)) return num(a) === num(b)
    return a === b
  }

  /** Text eines Werts wie `String.valueOf` (ruft eigenes `toString()` auf). */
  private *str(v: Val): G<string> {
    if (v === null || v === undefined) return 'null'
    if (typeof v === 'string') return v
    if (typeof v === 'number' || typeof v === 'boolean') return String(v)
    if (v instanceof JDouble) return formatDouble(v.v)
    if (v instanceof JChar) return String.fromCharCode(v.code)
    if (v instanceof JObject) {
      const own = this.findMethod(v.cls, 'toString', [])
      if (own) return yield* this.str(yield* this.invoke(own.m, own.owner, v, []))
      if (v.native.enumName !== undefined) return v.native.enumName
      if (v.cls.builtin) return this.throwableText(v)
      return `${v.cls.name}@${javaHash(v.id)}`
    }
    if (v instanceof JList) {
      const parts: string[] = []
      for (const x of v.items) parts.push(x === v ? '(this Collection)' : yield* this.str(x))
      return `[${parts.join(', ')}]`
    }
    if (v instanceof JMap) {
      const parts: string[] = []
      for (const [k, x] of v.entries.values()) parts.push(`${yield* this.str(k)}=${yield* this.str(x)}`)
      return `{${parts.join(', ')}}`
    }
    if (v instanceof JArray) {
      const code = v.elem.dims ? '[L' : (({ int: 'I', double: 'D', char: 'C', boolean: 'Z', long: 'J' } as Record<string, string>)[v.elem.name] ?? `L${v.elem.name};`)
      return `[${code}@${javaHash(v.id)}`
    }
    if (v instanceof JNative) return v.kind === 'StringBuilder' ? v.buf : `java.util.${v.kind}@${javaHash(v.id)}`
    return `class ${v.name}`
  }

  private *equalsVal(a: Val, b: Val): G<boolean> {
    if (a instanceof JObject && !a.cls.builtin) {
      const own = this.findMethod(a.cls, 'equals', [b])
      if (own) return (yield* this.invoke(own.m, own.owner, a, [b])) === true
    }
    if (typeof a === 'string' || a === null) return a === b
    return this.same(a, b) && a instanceof JDouble === b instanceof JDouble
  }

  private *create(e: Expr & { k: 'new' }): G<Val> {
    const args: Val[] = []
    for (const a of e.args) args.push(yield* this.eval(a))
    const n = e.type.name
    const cls = this.classes.get(n)
    if (cls) return yield* this.construct(cls, args, e)
    if (n === 'ArrayList' || n === 'LinkedList') {
      const l = new JList(this.id())
      if (args[0] instanceof JList) l.items = [...args[0].items]
      return l
    }
    if (n === 'HashMap' || n === 'TreeMap' || n === 'LinkedHashMap') return new JMap(this.id())
    if (n === 'Scanner') return new JNative('Scanner', this.id())
    if (n === 'Random') return new JNative('Random', this.id())
    if (n === 'StringBuilder') {
      const sb = new JNative('StringBuilder', this.id())
      if (typeof args[0] === 'string') sb.buf = args[0]
      return sb
    }
    if (n === 'String') return args.length ? yield* this.str(args[0] instanceof JArray ? args[0].items.map((c) => (c instanceof JChar ? String.fromCharCode(c.code) : '')).join('') : args[0]) : ''
    if (n === 'Object') return new JObject(this.classes.get('Object')!, this.id())
    throw new MiniJavaError('unsupported', `new ${n}`, e)
  }

  // MARK: Aufrufe

  private *call(e: Expr & { k: 'call' }): G<Val> {
    const args = () => this.evalArgs(e.args)
    if (!e.target) {
      const a = yield* args()
      const self = this.frame.self
      const found = this.findMethod(self?.cls ?? this.frame.cls, e.name, a) ?? (self ? this.findMethod(this.frame.cls, e.name, a) : undefined)
      if (!found) throw new MiniJavaError('symbol', `${e.name}()`, e)
      if (!found.m.isStatic && !self) throw new MiniJavaError('type', `static:${e.name}`, e)
      return yield* this.invoke(found.m, found.owner, found.m.isStatic ? undefined : self, a)
    }
    if (e.target.k === 'super') {
      const a = yield* args()
      const found = this.findMethod(this.frame.cls.sup, e.name, a)
      if (found) return yield* this.invoke(found.m, found.owner, this.frame.self, a)
      return yield* this.objectMethod(this.frame.self!, e.name, a, e, true)
    }
    const target = yield* this.eval(e.target)
    const a = yield* args()
    if (target === null || target === undefined) this.fail('NullPointerException', `Cannot invoke "${e.name}()" because value is null`)
    if (typeof target === 'string') return yield* this.stringMethod(target, e.name, a, e)
    if (target instanceof JObject) {
      const found = this.findMethod(target.cls, e.name, a)
      if (found) return yield* this.invoke(found.m, found.owner, found.m.isStatic ? undefined : target, a)
      return yield* this.objectMethod(target, e.name, a, e)
    }
    if (target instanceof JList) return yield* this.listMethod(target, e.name, a, e)
    if (target instanceof JMap) return yield* this.mapMethod(target, e.name, a, e)
    if (target instanceof JNative) return yield* this.nativeMethod(target, e.name, a, e)
    if (target instanceof ClassRef) {
      const cls = this.classes.get(target.name)
      if (cls && !cls.builtin) {
        if (cls.decl?.kind === 'enum' && e.name === 'values')
          return new JArray(
            T(cls.name),
            cls.decl.enumConstants.map((c) => cls.statics.get(c)),
            this.id(),
          )
        if (cls.decl?.kind === 'enum' && e.name === 'valueOf') {
          const v = cls.statics.get(String(a[0]))
          if (!(v instanceof JObject)) this.fail('IllegalArgumentException', `No enum constant ${cls.name}.${a[0]}`)
          return v
        }
        const found = this.findMethod(cls, e.name, a)
        if (!found) throw new MiniJavaError('symbol', `${target.name}.${e.name}()`, e)
        return yield* this.invoke(found.m, found.owner, undefined, a)
      }
      return yield* this.staticBuiltin(target.name, e.name, a, e)
    }
    if (target instanceof JArray) {
      if (e.name === 'clone') return new JArray(target.elem, [...target.items], this.id())
      if (e.name === 'length') throw new MiniJavaError('symbol', 'length()', e)
    }
    if (isNum(target) || typeof target === 'boolean') {
      if (e.name === 'equals') return yield* this.equalsVal(target, a[0])
      if (e.name === 'toString') return yield* this.str(target)
      if (e.name === 'compareTo') return Math.sign(num(target) - num(a[0]))
      if (e.name === 'intValue') return Math.trunc(num(target))
      if (e.name === 'doubleValue') return new JDouble(num(target))
    }
    throw new MiniJavaError('symbol', `${e.name}()`, e)
  }

  private *evalArgs(list: Expr[]): G<Val[]> {
    const out: Val[] = []
    for (const a of list) out.push(yield* this.eval(a))
    return out
  }

  private *objectMethod(o: JObject, name: string, a: Val[], pos: Pos, viaSuper = false): G<Val> {
    switch (name) {
      case 'toString':
        if (viaSuper) return o.cls.builtin || this.isA(o.cls, 'Throwable') ? this.throwableText(o) : `${o.cls.name}@${javaHash(o.id)}`
        return yield* this.str(o)
      case 'equals':
        return o === a[0]
      case 'hashCode':
        return parseInt(javaHash(o.id), 16) | 0
      case 'getClass':
        return new ClassRef(o.cls.name)
      case 'getMessage':
      case 'getLocalizedMessage':
        return o.native.message ?? null
      case 'printStackTrace':
        this.io.out(`${this.throwableText(o)}\n${(o.native.trace ?? []).map((t) => `\tat ${t}\n`).join('')}`, true)
        return undefined
      case 'name':
        if (o.native.enumName !== undefined) return o.native.enumName
        break
      case 'ordinal':
        if (o.native.ordinal !== undefined) return o.native.ordinal
        break
      case 'compareTo':
        if (o.native.ordinal !== undefined && a[0] instanceof JObject) return o.native.ordinal - (a[0].native.ordinal ?? 0)
        break
    }
    throw new MiniJavaError('symbol', `${o.cls.name}.${name}()`, pos)
  }

  private index(i: Val, size: number, pos: Pos, inclusive = false): number {
    const n = num(i)
    if (!(n >= 0 && (inclusive ? n <= size : n < size))) this.fail('IndexOutOfBoundsException', `Index ${n} out of bounds for length ${size}`)
    void pos
    return n
  }

  private *stringMethod(s: string, name: string, a: Val[], pos: Pos): G<Val> {
    const sIdx = (i: Val, inclusive = false) => {
      const n = num(i)
      if (!(n >= 0 && (inclusive ? n <= s.length : n < s.length))) this.fail('StringIndexOutOfBoundsException', `index ${n}, length ${s.length}`)
      return n
    }
    const arg = typeof a[0] === 'string' ? a[0] : a[0] instanceof JChar ? String.fromCharCode(a[0].code) : yield* this.str(a[0])
    switch (name) {
      case 'length':
        return s.length
      case 'charAt':
        return new JChar(s.charCodeAt(sIdx(a[0])))
      case 'equals':
        return s === a[0]
      case 'equalsIgnoreCase':
        return typeof a[0] === 'string' && s.toLowerCase() === a[0].toLowerCase()
      case 'compareTo':
      case 'compareToIgnoreCase': {
        const x = name === 'compareTo' ? s : s.toLowerCase()
        const y = name === 'compareTo' ? arg : arg.toLowerCase()
        for (let i = 0; i < Math.min(x.length, y.length); i++) if (x[i] !== y[i]) return x.charCodeAt(i) - y.charCodeAt(i)
        return x.length - y.length
      }
      case 'substring': {
        const from = sIdx(a[0], true)
        const to = a.length > 1 ? sIdx(a[1], true) : s.length
        if (to < from) this.fail('StringIndexOutOfBoundsException', `begin ${from}, end ${to}, length ${s.length}`)
        return s.substring(from, to)
      }
      case 'indexOf':
        return s.indexOf(arg, a.length > 1 ? num(a[1]) : 0)
      case 'lastIndexOf':
        return s.lastIndexOf(arg)
      case 'contains':
        return s.includes(arg)
      case 'startsWith':
        return s.startsWith(arg)
      case 'endsWith':
        return s.endsWith(arg)
      case 'isEmpty':
        return s.length === 0
      case 'isBlank':
        return s.trim().length === 0
      case 'toUpperCase':
        return s.toUpperCase()
      case 'toLowerCase':
        return s.toLowerCase()
      case 'trim':
      case 'strip':
        return s.trim()
      case 'concat':
        return s + arg
      case 'replace': {
        const to = typeof a[1] === 'string' ? a[1] : a[1] instanceof JChar ? String.fromCharCode(a[1].code) : yield* this.str(a[1])
        return s.split(arg).join(to)
      }
      case 'replaceAll':
        return s.replace(new RegExp(arg, 'g'), String(a[1]))
      case 'matches':
        return new RegExp(`^(?:${arg})$`).test(s)
      case 'split':
        return new JArray(
          T('String'),
          (s === '' ? [''] : s.split(new RegExp(arg))).filter((x, i, all) => x !== '' || i < all.length - 1 || all.length === 1),
          this.id(),
        )
      case 'toCharArray':
        return new JArray(
          T('char'),
          [...s].map((c) => new JChar(c.charCodeAt(0))),
          this.id(),
        )
      case 'repeat':
        return s.repeat(num(a[0]))
      case 'hashCode':
        return stringHash(s)
      case 'toString':
      case 'intern':
        return s
      case 'chars':
        break
    }
    throw new MiniJavaError('unsupported', `String.${name}()`, pos)
  }

  private *listMethod(l: JList, name: string, a: Val[], pos: Pos): G<Val> {
    switch (name) {
      case 'add':
        if (a.length === 2) l.items.splice(this.index(a[0], l.items.length, pos, true), 0, a[1])
        else l.items.push(a[0])
        return a.length === 2 ? undefined : true
      case 'addAll':
        if (a[0] instanceof JList) l.items.push(...a[0].items)
        return true
      case 'get':
        return l.items[this.index(a[0], l.items.length, pos)]
      case 'set': {
        const i = this.index(a[0], l.items.length, pos)
        const old = l.items[i]
        l.items[i] = a[1]
        return old
      }
      case 'size':
        return l.items.length
      case 'isEmpty':
        return l.items.length === 0
      case 'clear':
        l.items = []
        return undefined
      case 'remove': {
        if (typeof a[0] === 'number') return l.items.splice(this.index(a[0], l.items.length, pos), 1)[0]
        for (let i = 0; i < l.items.length; i++)
          if (yield* this.equalsVal(a[0], l.items[i])) {
            l.items.splice(i, 1)
            return true
          }
        return false
      }
      case 'contains':
      case 'indexOf':
        for (let i = 0; i < l.items.length; i++) if (yield* this.equalsVal(a[0], l.items[i])) return name === 'contains' ? true : i
        return name === 'contains' ? false : -1
      case 'getFirst':
      case 'getLast':
      case 'removeFirst':
      case 'removeLast': {
        if (!l.items.length) this.fail('NoSuchElementException')
        const first = name.endsWith('First')
        const v = first ? l.items[0] : l.items[l.items.length - 1]
        if (name.startsWith('remove')) l.items.splice(first ? 0 : l.items.length - 1, 1)
        return v
      }
      case 'addFirst':
        l.items.unshift(a[0])
        return undefined
      case 'addLast':
        l.items.push(a[0])
        return undefined
      case 'toString':
        return yield* this.str(l)
      case 'sort':
        l.items = yield* this.sorted(l.items)
        return undefined
    }
    throw new MiniJavaError('unsupported', `ArrayList.${name}()`, pos)
  }

  private key(v: Val): string {
    if (typeof v === 'string') return `s${v}`
    if (isNum(v)) return `n${num(v)}`
    if (v instanceof JObject && v.native.enumName !== undefined) return `e${v.cls.name}.${v.native.enumName}`
    if (v instanceof JObject || v instanceof JList || v instanceof JArray) return `o${v.id}`
    return String(v)
  }

  private *mapMethod(m: JMap, name: string, a: Val[], pos: Pos): G<Val> {
    const k = this.key(a[0])
    switch (name) {
      case 'put': {
        const old = m.entries.get(k)?.[1] ?? null
        m.entries.set(k, [a[0], a[1]])
        return old
      }
      case 'get':
        return m.entries.get(k)?.[1] ?? null
      case 'getOrDefault':
        return m.entries.has(k) ? m.entries.get(k)![1] : a[1]
      case 'containsKey':
        return m.entries.has(k)
      case 'containsValue':
        for (const [, v] of m.entries.values()) if (yield* this.equalsVal(a[0], v)) return true
        return false
      case 'remove': {
        const old = m.entries.get(k)?.[1] ?? null
        m.entries.delete(k)
        return old
      }
      case 'size':
        return m.entries.size
      case 'isEmpty':
        return m.entries.size === 0
      case 'clear':
        m.entries.clear()
        return undefined
      case 'keySet':
      case 'values': {
        const l = new JList(this.id())
        l.items = [...m.entries.values()].map((e) => (name === 'keySet' ? e[0] : e[1]))
        return l
      }
      case 'toString':
        return yield* this.str(m)
    }
    throw new MiniJavaError('unsupported', `HashMap.${name}()`, pos)
  }

  private *nativeMethod(n: JNative, name: string, a: Val[], pos: Pos): G<Val> {
    if (n.kind === 'out' || n.kind === 'err') {
      const err = n.kind === 'err'
      if (name === 'println') this.io.out(`${a.length ? yield* this.str(a[0]) : ''}\n`, err)
      else if (name === 'print') this.io.out(yield* this.str(a[0]), err)
      else if (name === 'printf' || name === 'format') this.io.out(yield* this.format(String(a[0]), a.slice(1)), err)
      else if (name === 'flush') return undefined
      else throw new MiniJavaError('unsupported', `System.out.${name}()`, pos)
      return undefined
    }
    if (n.kind === 'Scanner') return yield* this.scan(name, pos)
    if (n.kind === 'Random') {
      if (name === 'nextInt') {
        if (!a.length) return (Math.random() * 4294967296 - 2147483648) | 0
        const lo = a.length > 1 ? num(a[0]) : 0
        const hi = a.length > 1 ? num(a[1]) : num(a[0])
        if (hi <= lo) this.fail('IllegalArgumentException', 'bound must be positive')
        return lo + Math.floor(Math.random() * (hi - lo))
      }
      if (name === 'nextDouble') return new JDouble(Math.random())
      if (name === 'nextBoolean') return Math.random() < 0.5
    }
    if (n.kind === 'StringBuilder') {
      switch (name) {
        case 'append':
          n.buf += yield* this.str(a[0])
          return n
        case 'toString':
          return n.buf
        case 'length':
          return n.buf.length
        case 'reverse':
          n.buf = [...n.buf].reverse().join('')
          return n
        case 'charAt':
          return new JChar(n.buf.charCodeAt(num(a[0])))
        case 'insert':
          n.buf = n.buf.slice(0, num(a[0])) + (yield* this.str(a[1])) + n.buf.slice(num(a[0]))
          return n
        case 'setLength':
          n.buf = n.buf.slice(0, num(a[0]))
          return undefined
        case 'deleteCharAt':
          n.buf = n.buf.slice(0, num(a[0])) + n.buf.slice(num(a[0]) + 1)
          return n
      }
    }
    if (name === 'close') return undefined
    throw new MiniJavaError('unsupported', `${n.kind}.${name}()`, pos)
  }

  /** Scanner wie in Java: Wörter aus dem Puffer, `nextLine` liest bis zum Zeilenende (auch das leere Rest-Ende nach `nextInt`). */
  private *scan(name: string, pos: Pos): G<Val> {
    const sc = this.stdin
    const more = function* (): G<boolean> {
      const line = yield { k: 'input' }
      if (line === null || line === undefined) return false
      sc.buf += `${line}\n`
      return true
    }
    const token = function* (self: MiniJava, consume: boolean): G<string | undefined> {
      for (;;) {
        const m = /^\s*(\S+)/.exec(sc.buf)
        if (m && (m[0].length < sc.buf.length || sc.buf.endsWith('\n'))) {
          if (consume) sc.buf = sc.buf.slice(m[0].length)
          return m[1]
        }
        if (!(yield* more())) return undefined
        void self
      }
    }
    switch (name) {
      case 'nextLine': {
        if (!sc.buf.includes('\n') && !(yield* more())) this.fail('NoSuchElementException', 'No line found')
        const i = sc.buf.indexOf('\n')
        const line = sc.buf.slice(0, i)
        sc.buf = sc.buf.slice(i + 1)
        return line
      }
      case 'next':
      case 'nextInt':
      case 'nextLong':
      case 'nextDouble':
      case 'nextBoolean': {
        const t = yield* token(this, false)
        if (t === undefined) this.fail('NoSuchElementException')
        let v: Val
        if (name === 'next') v = t
        else if (name === 'nextInt' || name === 'nextLong') v = /^[+-]?\d+$/.test(t) ? parseInt(t, 10) : undefined
        else if (name === 'nextDouble') v = /^[+-]?(\d+([.,]\d*)?|[.,]\d+)$/.test(t) ? new JDouble(parseFloat(t.replace(',', '.'))) : undefined
        else v = /^(true|false)$/i.test(t) ? t.toLowerCase() === 'true' : undefined
        if (v === undefined) this.fail('InputMismatchException', `For input string: "${t}"`)
        yield* token(this, true)
        return v
      }
      case 'hasNext':
      case 'hasNextInt':
      case 'hasNextDouble':
      case 'hasNextLine': {
        if (name === 'hasNextLine') return sc.buf.includes('\n') || (yield* more())
        const t = yield* token(this, false)
        if (t === undefined) return false
        if (name === 'hasNextInt') return /^[+-]?\d+$/.test(t)
        if (name === 'hasNextDouble') return /^[+-]?(\d+([.,]\d*)?|[.,]\d+)$/.test(t)
        return true
      }
      case 'close':
        return undefined
    }
    throw new MiniJavaError('unsupported', `Scanner.${name}()`, pos)
  }

  /** `printf` / `String.format`: %d %s %f %.2f %c %b %n %x %e %% mit Breite und `-`/`0`. */
  private *format(fmt: string, args: Val[]): G<string> {
    let i = 0
    let out = ''
    const re = /%([-#+ 0,(]*)(\d+)?(?:\.(\d+))?([a-zA-Z%])/g
    let last = 0
    for (let m = re.exec(fmt); m; m = re.exec(fmt)) {
      out += fmt.slice(last, m.index)
      last = re.lastIndex
      const [, flags, width, prec, conv] = m
      let s: string
      if (conv === 'n') s = '\n'
      else if (conv === '%') s = '%'
      else {
        if (i >= args.length) this.fail('IllegalArgumentException', `Format specifier '${m[0]}'`)
        const v = args[i++]
        switch (conv.toLowerCase()) {
          case 'd':
            if (v instanceof JDouble) this.fail('IllegalArgumentException', `d != java.lang.Double`)
            s = String(Math.trunc(num(v)))
            if (flags.includes(',')) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            break
          case 'f':
            s = num(v).toFixed(prec ? Number(prec) : 6)
            if (flags.includes(',')) {
              const [int, frac] = s.split('.')
              s = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (frac ? `,${frac}` : '')
            } else s = s.replace('.', ',')
            break
          case 'e':
            s = num(v)
              .toExponential(prec ? Number(prec) : 6)
              .replace('.', ',')
            break
          case 'x':
            s = (num(v) >>> 0).toString(16)
            break
          case 'c':
            s = v instanceof JChar ? String.fromCharCode(v.code) : String.fromCharCode(num(v))
            break
          case 'b':
            s = String(v !== null && v !== false)
            break
          default:
            s = yield* this.str(v)
            if (prec) s = s.slice(0, Number(prec))
        }
        if (flags.includes('+') && /^\d/.test(s) && /[df]/i.test(conv)) s = `+${s}`
        if (conv === conv.toUpperCase() && conv !== '%') s = s.toUpperCase()
      }
      if (width && s.length < Number(width)) {
        const pad = Number(width) - s.length
        s = flags.includes('-') ? s + ' '.repeat(pad) : flags.includes('0') ? s.replace(/^([+-]?)/, `$1${'0'.repeat(pad)}`) : ' '.repeat(pad) + s
      }
      out += s
    }
    return out + fmt.slice(last)
  }

  private *sorted(items: Val[]): G<Val[]> {
    const out = [...items]
    for (let i = 1; i < out.length; i++) for (let j = i; j > 0 && (yield* this.compare(out[j - 1], out[j])) > 0; j--) [out[j - 1], out[j]] = [out[j], out[j - 1]]
    return out
  }

  private *compare(a: Val, b: Val): G<number> {
    if (isNum(a) && isNum(b)) return num(a) - num(b)
    if (typeof a === 'string' && typeof b === 'string') return a < b ? -1 : a > b ? 1 : 0
    if (a instanceof JObject) {
      const own = this.findMethod(a.cls, 'compareTo', [b])
      if (own) return num(yield* this.invoke(own.m, own.owner, a, [b]))
      if (a.native.ordinal !== undefined && b instanceof JObject) return a.native.ordinal - (b.native.ordinal ?? 0)
    }
    this.fail('ClassCastException', 'not Comparable')
  }

  private *staticBuiltin(cls: string, name: string, a: Val[], pos: Pos): G<Val> {
    const x = num(a[0])
    const dbl = (v: number) => new JDouble(v)
    switch (`${cls}.${name}`) {
      case 'Math.abs':
        return a[0] instanceof JDouble ? dbl(Math.abs(x)) : Math.abs(x)
      case 'Math.max':
      case 'Math.min': {
        const r = name === 'max' ? Math.max(x, num(a[1])) : Math.min(x, num(a[1]))
        return a[0] instanceof JDouble || a[1] instanceof JDouble ? dbl(r) : r
      }
      case 'Math.pow':
        return dbl(Math.pow(x, num(a[1])))
      case 'Math.sqrt':
        return dbl(Math.sqrt(x))
      case 'Math.cbrt':
        return dbl(Math.cbrt(x))
      case 'Math.random':
        return dbl(Math.random())
      case 'Math.round':
        return Math.floor(x + 0.5)
      case 'Math.floor':
        return dbl(Math.floor(x))
      case 'Math.ceil':
        return dbl(Math.ceil(x))
      case 'Math.sin':
      case 'Math.cos':
      case 'Math.tan':
      case 'Math.log':
      case 'Math.log10':
      case 'Math.exp':
        return dbl((Math as unknown as Record<string, (v: number) => number>)[name](x))
      case 'Math.toRadians':
        return dbl((x * Math.PI) / 180)
      case 'Math.toDegrees':
        return dbl((x * 180) / Math.PI)
      case 'Math.floorMod':
        return ((x % num(a[1])) + num(a[1])) % num(a[1])
      case 'Integer.parseInt':
      case 'Integer.valueOf':
      case 'Long.parseLong': {
        if (typeof a[0] === 'number') return a[0]
        const s = String(a[0])
        if (!/^[+-]?\d+$/.test(s)) this.fail('NumberFormatException', `For input string: "${s}"`)
        return parseInt(s, 10)
      }
      case 'Double.parseDouble':
      case 'Double.valueOf': {
        if (isNum(a[0])) return dbl(x)
        const s = String(a[0]).trim()
        if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?[dDfF]?$/.test(s)) this.fail('NumberFormatException', `For input string: "${s}"`)
        return dbl(parseFloat(s))
      }
      case 'Boolean.parseBoolean':
        return String(a[0]).toLowerCase() === 'true'
      case 'Integer.toString':
      case 'Double.toString':
      case 'String.valueOf':
      case 'Objects.toString':
        if (a[0] instanceof JArray && a[0].elem.name === 'char') return a[0].items.map((c) => String.fromCharCode(num(c))).join('')
        return yield* this.str(a[0])
      case 'Integer.compare':
      case 'Double.compare':
        return Math.sign(x - num(a[1]))
      case 'Integer.toBinaryString':
        return (x >>> 0).toString(2)
      case 'Integer.toHexString':
        return (x >>> 0).toString(16)
      case 'Integer.sum':
        return (x + num(a[1])) | 0
      case 'Objects.equals':
        return a[0] === null ? a[1] === null : yield* this.equalsVal(a[0], a[1])
      case 'String.format':
        return yield* this.format(String(a[0]), a.slice(1))
      case 'String.join': {
        const parts: string[] = []
        const items = a[1] instanceof JList || a[1] instanceof JArray ? a[1].items : a.slice(1)
        for (const p of items) parts.push(yield* this.str(p))
        return parts.join(String(a[0]))
      }
      case 'Character.isDigit':
        return /\p{Nd}/u.test(String.fromCharCode(x))
      case 'Character.isLetter':
        return /\p{L}/u.test(String.fromCharCode(x))
      case 'Character.isLetterOrDigit':
        return /[\p{L}\p{Nd}]/u.test(String.fromCharCode(x))
      case 'Character.isUpperCase':
        return /\p{Lu}/u.test(String.fromCharCode(x))
      case 'Character.isLowerCase':
        return /\p{Ll}/u.test(String.fromCharCode(x))
      case 'Character.isWhitespace':
        return /\s/.test(String.fromCharCode(x))
      case 'Character.toUpperCase':
        return new JChar(String.fromCharCode(x).toUpperCase().charCodeAt(0))
      case 'Character.toLowerCase':
        return new JChar(String.fromCharCode(x).toLowerCase().charCodeAt(0))
      case 'Character.getNumericValue':
        return parseInt(String.fromCharCode(x), 36)
      case 'Arrays.toString': {
        if (a[0] === null) return 'null'
        const arr = a[0] as JArray
        const parts: string[] = []
        for (const v of arr.items) parts.push(yield* this.str(v))
        return `[${parts.join(', ')}]`
      }
      case 'Arrays.sort':
      case 'Collections.sort': {
        const arr = a[0] as JArray | JList
        arr.items = yield* this.sorted(arr.items)
        return undefined
      }
      case 'Arrays.fill':
        ;(a[0] as JArray).items.fill(castTo(a[1], (a[0] as JArray).elem))
        return undefined
      case 'Arrays.asList':
      case 'List.of': {
        const l = new JList(this.id())
        l.items = a.length === 1 && a[0] instanceof JArray ? [...a[0].items] : a
        return l
      }
      case 'Collections.reverse':
        ;(a[0] as JList).items.reverse()
        return undefined
      case 'Collections.shuffle':
        ;(a[0] as JList).items.sort(() => Math.random() - 0.5)
        return undefined
      case 'Collections.max':
      case 'Collections.min': {
        const items = (a[0] as JList).items
        if (!items.length) this.fail('NoSuchElementException')
        const s = yield* this.sorted(items)
        return name === 'max' ? s[s.length - 1] : s[0]
      }
      case 'Thread.sleep':
        yield { k: 'sleep', ms: x }
        return undefined
      case 'System.currentTimeMillis':
        return Date.now()
      case 'System.nanoTime':
        return Math.round(performance.now() * 1e6)
      case 'System.exit':
        throw new ProgramExit()
    }
    throw new MiniJavaError('unsupported', `${cls}.${name}()`, pos)
  }
}

/** `System.exit` beendet das Programm still. */
class ProgramExit extends Error {}

function isMain(m: MethodDecl) {
  return m.name === 'main' && m.isStatic && m.params.length === 1 && m.params[0].type.name === 'String' && m.params[0].type.dims === 1
}

/** `System.exit`: der Lauf endet wie ein normales Ende. */
export function isProgramExit(err: unknown) {
  return err instanceof ProgramExit
}
