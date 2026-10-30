/**
 * VisuObject-Debugger: Parser für das Java, das in der FOS 12 vorkommt (Klassen, Objekte, Vererbung,
 * Arrays, ArrayList, Schleifen, Exceptions). Kein vollständiges Java: Generics werden gelesen und
 * übergangen, Lambdas, innere Klassen und Annotationen außer `@Override` gibt es nicht.
 * Jeder Knoten kennt seine Datei und Zeile (ab 0), damit der Debugger die Zeile gelb markieren kann.
 */

export interface Pos {
  file: string
  line: number
}

export type TypeRef = { name: string; dims: number; args: TypeRef[] }

export type Expr = (
  | { k: 'lit'; value: { t: 'int' | 'double' | 'char' | 'string' | 'bool' | 'null'; v: number | string | boolean | null } }
  | { k: 'name'; name: string }
  | { k: 'this' }
  | { k: 'super' }
  | { k: 'field'; target: Expr; name: string }
  | { k: 'call'; target?: Expr; name: string; args: Expr[]; isSuper?: boolean }
  | { k: 'new'; type: TypeRef; args: Expr[] }
  | { k: 'newArray'; type: TypeRef; sizes: Expr[]; init?: Expr }
  | { k: 'arrayInit'; items: Expr[] }
  | { k: 'index'; target: Expr; index: Expr }
  | { k: 'unary'; op: string; expr: Expr }
  | { k: 'incdec'; op: '++' | '--'; prefix: boolean; target: Expr }
  | { k: 'binary'; op: string; left: Expr; right: Expr }
  | { k: 'assign'; op: string; target: Expr; value: Expr }
  | { k: 'cond'; test: Expr; then: Expr; else: Expr }
  | { k: 'cast'; type: TypeRef; expr: Expr }
  | { k: 'instanceof'; expr: Expr; type: TypeRef }
) &
  Pos

export type Stmt = (
  | { k: 'block'; body: Stmt[] }
  | { k: 'local'; type: TypeRef; vars: { name: string; dims: number; init?: Expr }[] }
  | { k: 'expr'; expr: Expr }
  | { k: 'if'; test: Expr; then: Stmt; else?: Stmt }
  | { k: 'while'; test: Expr; body: Stmt }
  | { k: 'do'; body: Stmt; test: Expr }
  | { k: 'for'; init: Stmt[]; test?: Expr; update: Expr[]; body: Stmt }
  | { k: 'foreach'; type: TypeRef; name: string; iter: Expr; body: Stmt }
  | { k: 'switch'; expr: Expr; cases: { labels: Expr[] | 'default'; body: Stmt[]; arrow: boolean }[] }
  | { k: 'break' }
  | { k: 'continue' }
  | { k: 'return'; value?: Expr }
  | { k: 'throw'; value: Expr }
  | { k: 'try'; body: Stmt; catches: { types: TypeRef[]; name: string; body: Stmt }[]; finally?: Stmt }
  | { k: 'ctorCall'; isSuper: boolean; args: Expr[] }
  | { k: 'empty' }
) &
  Pos

export interface FieldDecl extends Pos {
  name: string
  type: TypeRef
  isStatic: boolean
  init?: Expr
}

export interface MethodDecl extends Pos {
  name: string
  /** Leer beim Konstruktor. */
  returns?: TypeRef
  params: { name: string; type: TypeRef }[]
  isStatic: boolean
  isAbstract: boolean
  isConstructor: boolean
  body?: Stmt & { k: 'block' }
  /** Zeile der schließenden Klammer (für den letzten Schritt einer Methode). */
  endLine: number
}

export interface ClassDecl extends Pos {
  name: string
  kind: 'class' | 'interface' | 'enum'
  superclass?: string
  interfaces: string[]
  isAbstract: boolean
  fields: FieldDecl[]
  methods: MethodDecl[]
  enumConstants: string[]
}

export class JavaSyntaxError extends Error {
  constructor(
    message: string,
    readonly pos: Pos,
  ) {
    super(message)
  }
}

// MARK: - Zerlegen in Wörter

interface Tok {
  t: 'id' | 'num' | 'str' | 'char' | 'op' | 'eof'
  v: string
  line: number
}

const ops = ['>>>=', '<<=', '>>=', '>>>', '...', '->', '::', '++', '--', '&&', '||', '==', '!=', '<=', '>=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<']

function tokenize(src: string, file: string): Tok[] {
  const out: Tok[] = []
  let i = 0
  let line = 0
  while (i < src.length) {
    const c = src[i]
    if (c === '\n') {
      line++
      i++
    } else if (/\s/.test(c)) i++
    else if (src.startsWith('//', i)) {
      while (i < src.length && src[i] !== '\n') i++
    } else if (src.startsWith('/*', i)) {
      const end = src.indexOf('*/', i + 2)
      const stop = end < 0 ? src.length : end + 2
      for (let j = i; j < stop; j++) if (src[j] === '\n') line++
      i = stop
    } else if (/[\p{L}_$]/u.test(c)) {
      let j = i + 1
      while (j < src.length && /[\p{L}\p{N}_$]/u.test(src[j])) j++
      out.push({ t: 'id', v: src.slice(i, j), line })
      i = j
    } else if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] ?? ''))) {
      const m = /^(0[xX][0-9a-fA-F_]+[lL]?|[0-9][0-9_]*(\.[0-9_]*)?([eE][+-]?[0-9]+)?[fFdDlL]?|\.[0-9]+([eE][+-]?[0-9]+)?[fFdD]?)/.exec(src.slice(i))!
      out.push({ t: 'num', v: m[0], line })
      i += m[0].length
    } else if (c === '"' || c === "'") {
      let j = i + 1
      let text = ''
      while (j < src.length && src[j] !== c) {
        if (src[j] === '\n') throw new JavaSyntaxError(c === '"' ? 'string' : 'char', { file, line })
        if (src[j] === '\\') {
          const n = src[j + 1]
          text += n === 'n' ? '\n' : n === 't' ? '\t' : n === 'r' ? '\r' : n === '0' ? '\0' : n === 'u' ? String.fromCharCode(parseInt(src.slice(j + 2, j + 6), 16)) : n
          j += n === 'u' ? 6 : 2
        } else text += src[j++]
      }
      if (j >= src.length) throw new JavaSyntaxError(c === '"' ? 'string' : 'char', { file, line })
      out.push({ t: c === '"' ? 'str' : 'char', v: text, line })
      i = j + 1
    } else {
      const op = ops.find((o) => src.startsWith(o, i)) ?? c
      out.push({ t: 'op', v: op, line })
      i += op.length
    }
  }
  out.push({ t: 'eof', v: '', line })
  return out
}

// MARK: - Parser

const modifiers = new Set(['public', 'private', 'protected', 'static', 'final', 'abstract', 'synchronized', 'transient', 'volatile', 'native', 'strictfp', 'default'])
const primitives = new Set(['int', 'long', 'short', 'byte', 'double', 'float', 'boolean', 'char', 'void', 'var'])

class Parser {
  private i = 0
  constructor(
    private toks: Tok[],
    private file: string,
  ) {}

  private get tok() {
    return this.toks[this.i]
  }
  private peek(n = 1) {
    return this.toks[Math.min(this.i + n, this.toks.length - 1)]
  }
  private pos(tok = this.tok): Pos {
    return { file: this.file, line: tok.line }
  }
  private is(v: string, tok = this.tok) {
    return (tok.t === 'op' || tok.t === 'id') && tok.v === v
  }
  private eat(v: string) {
    if (this.is(v)) {
      this.i++
      return true
    }
    return false
  }
  private expect(v: string) {
    if (!this.eat(v)) this.fail(`expected:${v}`)
  }
  private fail(what: string): never {
    throw new JavaSyntaxError(what, this.pos())
  }
  private ident(): string {
    if (this.tok.t !== 'id') this.fail('identifier')
    return this.toks[this.i++].v
  }

  unit(): ClassDecl[] {
    const out: ClassDecl[] = []
    if (this.eat('package')) this.skipTo(';')
    while (this.is('import')) this.skipTo(';')
    while (this.tok.t !== 'eof') {
      if (this.eat(';')) continue
      out.push(this.classDecl())
    }
    return out
  }

  private skipTo(v: string) {
    while (this.tok.t !== 'eof' && !this.is(v)) this.i++
    this.expect(v)
  }

  private mods(): Set<string> {
    const out = new Set<string>()
    for (;;) {
      if (this.tok.t === 'op' && this.tok.v === '@') {
        this.i++
        this.ident()
        if (this.is('(')) this.skipParens()
      } else if (this.tok.t === 'id' && modifiers.has(this.tok.v) && !(this.tok.v === 'default' && this.is(':', this.peek()))) out.add(this.toks[this.i++].v)
      else return out
    }
  }

  private skipParens() {
    let depth = 0
    do {
      if (this.is('(')) depth++
      else if (this.is(')')) depth--
      this.i++
    } while (depth > 0 && this.tok.t !== 'eof')
  }

  private classDecl(): ClassDecl {
    const mods = this.mods()
    const pos = this.pos()
    const kind = this.eat('class') ? 'class' : this.eat('interface') ? 'interface' : this.eat('enum') ? 'enum' : this.fail('class')
    const name = this.ident()
    if (this.is('<')) this.typeArgs()
    const decl: ClassDecl = { ...pos, name, kind, interfaces: [], isAbstract: mods.has('abstract') || kind === 'interface', fields: [], methods: [], enumConstants: [] }
    if (this.eat('extends')) {
      const list = [this.type().name]
      while (this.eat(',')) list.push(this.type().name)
      if (kind === 'interface') decl.interfaces = list
      else decl.superclass = list[0]
    }
    if (this.eat('implements')) {
      decl.interfaces.push(this.type().name)
      while (this.eat(',')) decl.interfaces.push(this.type().name)
    }
    this.expect('{')
    if (kind === 'enum') {
      while (this.tok.t === 'id') {
        decl.enumConstants.push(this.ident())
        if (this.is('(')) this.skipParens()
        if (!this.eat(',')) break
      }
      this.eat(';')
    }
    while (!this.eat('}')) {
      if (this.tok.t === 'eof') this.fail('expected:}')
      if (this.eat(';')) continue
      this.member(decl)
    }
    return decl
  }

  private member(cls: ClassDecl) {
    const start = this.tok
    const mods = this.mods()
    if (this.is('class') || this.is('interface') || this.is('enum')) this.fail('innerClass')
    if (this.is('{')) {
      // Initialisierungsblock: wie ein Konstruktor-Vorspann nicht unterstützt.
      this.fail('initializer')
    }
    if (this.is('<')) this.typeArgs()
    const pos = this.pos(start)
    // Konstruktor: Name der Klasse direkt vor `(`.
    if (this.tok.t === 'id' && this.tok.v === cls.name && this.is('(', this.peek())) {
      this.i++
      const params = this.params()
      if (this.eat('throws')) this.skipThrows()
      const body = this.block()
      cls.methods.push({ ...pos, name: cls.name, params, isStatic: false, isAbstract: false, isConstructor: true, body, endLine: this.toks[this.i - 1].line })
      return
    }
    const type = this.type()
    const name = this.ident()
    if (this.is('(')) {
      const params = this.params()
      while (this.eat('[')) this.expect(']')
      if (this.eat('throws')) this.skipThrows()
      const isAbstract = mods.has('abstract') || (cls.kind === 'interface' && !this.is('{'))
      const body = this.is('{') ? this.block() : (this.expect(';'), undefined)
      cls.methods.push({ ...pos, name, returns: type, params, isStatic: mods.has('static'), isAbstract, isConstructor: false, body, endLine: this.toks[this.i - 1].line })
      return
    }
    // Attribute, auch `int a, b = 2;`
    let first = true
    let varName = name
    for (;;) {
      if (!first) varName = this.ident()
      first = false
      let dims = 0
      while (this.eat('[')) {
        this.expect(']')
        dims++
      }
      const t = dims ? { ...type, dims: type.dims + dims } : type
      const init = this.eat('=') ? (this.is('{') ? this.arrayInit() : this.expr()) : undefined
      cls.fields.push({ ...pos, name: varName, type: t, isStatic: mods.has('static') || cls.kind === 'interface', init })
      if (!this.eat(',')) break
    }
    this.expect(';')
  }

  private skipThrows() {
    this.type()
    while (this.eat(',')) this.type()
  }

  private params() {
    this.expect('(')
    const out: { name: string; type: TypeRef }[] = []
    if (!this.eat(')')) {
      do {
        this.mods()
        let type = this.type()
        if (this.eat('...')) type = { ...type, dims: type.dims + 1 }
        const name = this.ident()
        while (this.eat('[')) {
          this.expect(']')
          type = { ...type, dims: type.dims + 1 }
        }
        out.push({ name, type })
      } while (this.eat(','))
      this.expect(')')
    }
    return out
  }

  private typeArgs(): TypeRef[] {
    this.expect('<')
    const out: TypeRef[] = []
    if (this.eat('>')) return out
    do {
      if (this.eat('?')) {
        if (this.eat('extends') || this.eat('super')) out.push(this.type())
        else out.push({ name: 'Object', dims: 0, args: [] })
      } else out.push(this.type())
    } while (this.eat(','))
    // `>>` am Ende verschachtelter Generics: das zweite `>` bleibt stehen.
    if (this.is('>>')) this.toks[this.i] = { ...this.tok, v: '>' }
    else if (this.is('>>>')) this.toks[this.i] = { ...this.tok, v: '>>' }
    else this.expect('>')
    return out
  }

  type(): TypeRef {
    let name = this.ident()
    let args: TypeRef[] = []
    if (this.is('<')) args = this.typeArgs()
    while (this.is('.') && this.peek().t === 'id') {
      this.i++
      name = this.ident()
      if (this.is('<')) args = this.typeArgs()
    }
    let dims = 0
    while (this.is('[') && this.is(']', this.peek())) {
      this.i += 2
      dims++
    }
    return { name, dims, args }
  }

  /** Steht hier eine Deklaration `Typ name`? (ohne etwas zu verbrauchen) */
  private looksLikeDecl(): boolean {
    const save = this.i
    try {
      this.mods()
      if (this.tok.t !== 'id') return false
      const first = this.tok.v
      if (['return', 'new', 'throw', 'this', 'super', 'true', 'false', 'null'].includes(first)) return false
      this.type()
      return this.tok.t === 'id' && (this.is('=', this.peek()) || this.is(';', this.peek()) || this.is(',', this.peek()) || this.is(':', this.peek()) || this.is('[', this.peek()))
    } catch {
      return false
    } finally {
      this.i = save
    }
  }

  block(): Stmt & { k: 'block' } {
    const pos = this.pos()
    this.expect('{')
    const body: Stmt[] = []
    while (!this.eat('}')) {
      if (this.tok.t === 'eof') this.fail('expected:}')
      body.push(this.stmt())
    }
    return { ...pos, k: 'block', body }
  }

  private localDecl(): Stmt {
    const pos = this.pos()
    this.mods()
    const type = this.type()
    const vars: { name: string; dims: number; init?: Expr }[] = []
    do {
      const name = this.ident()
      let dims = 0
      while (this.eat('[')) {
        this.expect(']')
        dims++
      }
      const init = this.eat('=') ? (this.is('{') ? this.arrayInit() : this.expr()) : undefined
      vars.push({ name, dims, init })
    } while (this.eat(','))
    return { ...pos, k: 'local', type, vars }
  }

  stmt(): Stmt {
    const pos = this.pos()
    const v = this.tok.t === 'id' || this.tok.t === 'op' ? this.tok.v : ''
    if (v === '{') return this.block()
    if (this.eat(';')) return { ...pos, k: 'empty' }
    if (this.eat('if')) {
      this.expect('(')
      const test = this.expr()
      this.expect(')')
      const then = this.stmt()
      return { ...pos, k: 'if', test, then, else: this.eat('else') ? this.stmt() : undefined }
    }
    if (this.eat('while')) {
      this.expect('(')
      const test = this.expr()
      this.expect(')')
      return { ...pos, k: 'while', test, body: this.stmt() }
    }
    if (this.eat('do')) {
      const body = this.stmt()
      this.expect('while')
      this.expect('(')
      const test = this.expr()
      this.expect(')')
      this.expect(';')
      return { ...pos, k: 'do', body, test }
    }
    if (this.eat('for')) {
      this.expect('(')
      // for (Typ x : liste)
      const save = this.i
      try {
        this.mods()
        const type = this.type()
        const name = this.ident()
        if (this.eat(':')) {
          const iter = this.expr()
          this.expect(')')
          return { ...pos, k: 'foreach', type, name, iter, body: this.stmt() }
        }
      } catch {
        /* keine for-each-Schleife */
      }
      this.i = save
      const init: Stmt[] = []
      if (!this.is(';')) {
        if (this.looksLikeDecl()) init.push(this.localDecl())
        else
          do {
            const p = this.pos()
            init.push({ ...p, k: 'expr', expr: this.expr() })
          } while (this.eat(','))
      }
      this.expect(';')
      const test = this.is(';') ? undefined : this.expr()
      this.expect(';')
      const update: Expr[] = []
      if (!this.is(')'))
        do update.push(this.expr())
        while (this.eat(','))
      this.expect(')')
      return { ...pos, k: 'for', init, test, update, body: this.stmt() }
    }
    if (this.eat('switch')) {
      this.expect('(')
      const expr = this.expr()
      this.expect(')')
      this.expect('{')
      const cases: { labels: Expr[] | 'default'; body: Stmt[]; arrow: boolean }[] = []
      while (!this.eat('}')) {
        let labels: Expr[] | 'default'
        if (this.eat('default')) labels = 'default'
        else {
          this.expect('case')
          labels = [this.expr()]
          while (this.eat(',')) labels.push(this.expr())
        }
        if (this.eat('->')) {
          const body = this.is('{') ? [this.block()] : [this.stmt()]
          cases.push({ labels, body, arrow: true })
          continue
        }
        this.expect(':')
        const body: Stmt[] = []
        while (!this.is('case') && !this.is('default') && !this.is('}')) body.push(this.stmt())
        cases.push({ labels, body, arrow: false })
      }
      return { ...pos, k: 'switch', expr, cases }
    }
    if (this.eat('break')) {
      if (this.tok.t === 'id') this.i++
      this.expect(';')
      return { ...pos, k: 'break' }
    }
    if (this.eat('continue')) {
      if (this.tok.t === 'id') this.i++
      this.expect(';')
      return { ...pos, k: 'continue' }
    }
    if (this.eat('return')) {
      const value = this.is(';') ? undefined : this.expr()
      this.expect(';')
      return { ...pos, k: 'return', value }
    }
    if (this.eat('throw')) {
      const value = this.expr()
      this.expect(';')
      return { ...pos, k: 'throw', value }
    }
    if (this.eat('try')) {
      if (this.is('(')) this.fail('tryResources')
      const body = this.block()
      const catches: { types: TypeRef[]; name: string; body: Stmt }[] = []
      while (this.eat('catch')) {
        this.expect('(')
        this.mods()
        const types = [this.type()]
        while (this.eat('|')) types.push(this.type())
        const name = this.ident()
        this.expect(')')
        catches.push({ types, name, body: this.block() })
      }
      const fin = this.eat('finally') ? this.block() : undefined
      return { ...pos, k: 'try', body, catches, finally: fin }
    }
    if ((v === 'this' || v === 'super') && this.is('(', this.peek())) {
      this.i++
      const args = this.args()
      this.expect(';')
      return { ...pos, k: 'ctorCall', isSuper: v === 'super', args }
    }
    if (v === 'class' || v === 'interface') this.fail('innerClass')
    if (this.looksLikeDecl()) {
      const decl = this.localDecl()
      this.expect(';')
      return decl
    }
    const expr = this.expr()
    this.expect(';')
    return { ...pos, k: 'expr', expr }
  }

  private args(): Expr[] {
    this.expect('(')
    const out: Expr[] = []
    if (!this.eat(')')) {
      do out.push(this.expr())
      while (this.eat(','))
      this.expect(')')
    }
    return out
  }

  private arrayInit(): Expr {
    const pos = this.pos()
    this.expect('{')
    const items: Expr[] = []
    while (!this.eat('}')) {
      items.push(this.is('{') ? this.arrayInit() : this.expr())
      if (!this.eat(',')) {
        this.expect('}')
        break
      }
    }
    return { ...pos, k: 'arrayInit', items }
  }

  expr(): Expr {
    return this.assign()
  }

  private assign(): Expr {
    const left = this.cond()
    const op = this.tok.v
    if (this.tok.t === 'op' && ['=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=', '>>>='].includes(op)) {
      const pos = this.pos()
      this.i++
      if (left.k !== 'name' && left.k !== 'field' && left.k !== 'index') this.fail('assignTarget')
      return { ...pos, k: 'assign', op, target: left, value: this.assign() }
    }
    return left
  }

  private cond(): Expr {
    const test = this.binary(0)
    if (this.is('?')) {
      const pos = this.pos()
      this.i++
      const then = this.assign()
      this.expect(':')
      return { ...pos, k: 'cond', test, then, else: this.assign() }
    }
    return test
  }

  private static levels: string[][] = [['||'], ['&&'], ['|'], ['^'], ['&'], ['==', '!='], ['<', '>', '<=', '>=', 'instanceof'], ['<<', '>>', '>>>'], ['+', '-'], ['*', '/', '%']]

  private binary(level: number): Expr {
    if (level >= Parser.levels.length) return this.unary()
    let left = this.binary(level + 1)
    for (;;) {
      const op = this.tok.v
      if (!(this.tok.t === 'op' || op === 'instanceof') || !Parser.levels[level].includes(op)) return left
      const pos = this.pos()
      this.i++
      if (op === 'instanceof') {
        left = { ...pos, k: 'instanceof', expr: left, type: this.type() }
        if (this.tok.t === 'id') this.i++ // Pattern `instanceof Hund h` wird nicht gebunden
        continue
      }
      left = { ...pos, k: 'binary', op, left, right: this.binary(level + 1) }
    }
  }

  private unary(): Expr {
    const pos = this.pos()
    if (this.is('++') || this.is('--')) {
      const op = this.toks[this.i++].v as '++' | '--'
      return { ...pos, k: 'incdec', op, prefix: true, target: this.unary() }
    }
    if (this.is('!') || this.is('-') || this.is('+') || this.is('~')) {
      const op = this.toks[this.i++].v
      return { ...pos, k: 'unary', op, expr: this.unary() }
    }
    // Cast: `(int) x`, `(Hund) tier`
    if (this.is('(') && this.peek().t === 'id') {
      const save = this.i
      this.i++
      try {
        const type = this.type()
        if (this.eat(')')) {
          const primitive = primitives.has(type.name)
          const next = this.tok
          const castable = primitive
            ? !(next.t === 'op' && ['+', '-', '*', '/', ')', ';', ',', '.', '==', '<', '>'].includes(next.v) && !['(', '-', '+', '!', '~'].includes(next.v)) ||
              next.t !== 'op' ||
              ['(', '-', '!', '~'].includes(next.v)
            : next.t !== 'op' || next.v === '('
          if (castable && (primitive || /^[A-Z]/.test(type.name))) return { ...pos, k: 'cast', type, expr: this.unary() }
        }
      } catch {
        /* kein Cast */
      }
      this.i = save
    }
    return this.postfix(this.primary())
  }

  private postfix(e: Expr): Expr {
    for (;;) {
      const pos = this.pos()
      if (this.eat('.')) {
        if (this.eat('new')) this.fail('innerClass')
        const name = this.ident()
        if (this.is('(')) e = { ...pos, k: 'call', target: e, name, args: this.args(), isSuper: e.k === 'super' }
        else e = { ...pos, k: 'field', target: e, name }
      } else if (this.is('[')) {
        this.i++
        const index = this.expr()
        this.expect(']')
        e = { ...pos, k: 'index', target: e, index }
      } else if (this.is('++') || this.is('--')) {
        const op = this.toks[this.i++].v as '++' | '--'
        e = { ...pos, k: 'incdec', op, prefix: false, target: e }
      } else if (this.is('::') || this.is('->')) this.fail('lambda')
      else return e
    }
  }

  private primary(): Expr {
    const tok = this.tok
    const pos = this.pos()
    if (tok.t === 'num') {
      this.i++
      const text = tok.v.replace(/_/g, '')
      if (/^0[xX]/.test(text)) return { ...pos, k: 'lit', value: { t: 'int', v: parseInt(text.replace(/[lL]$/, ''), 16) } }
      if (/[.eEfFdD]/.test(text) && !/^0[xX]/.test(text)) return { ...pos, k: 'lit', value: { t: 'double', v: parseFloat(text.replace(/[fFdD]$/, '')) } }
      return { ...pos, k: 'lit', value: { t: 'int', v: parseInt(text.replace(/[lL]$/, ''), 10) } }
    }
    if (tok.t === 'str') {
      this.i++
      return { ...pos, k: 'lit', value: { t: 'string', v: tok.v } }
    }
    if (tok.t === 'char') {
      this.i++
      return { ...pos, k: 'lit', value: { t: 'char', v: tok.v.charCodeAt(0) || 0 } }
    }
    if (this.eat('(')) {
      const e = this.expr()
      this.expect(')')
      return e
    }
    if (tok.t !== 'id') this.fail('expression')
    if (this.eat('true')) return { ...pos, k: 'lit', value: { t: 'bool', v: true } }
    if (this.eat('false')) return { ...pos, k: 'lit', value: { t: 'bool', v: false } }
    if (this.eat('null')) return { ...pos, k: 'lit', value: { t: 'null', v: null } }
    if (this.eat('this')) return { ...pos, k: 'this' }
    if (this.eat('super')) return { ...pos, k: 'super' }
    if (this.eat('new')) {
      const name = this.ident()
      let args: TypeRef[] = []
      if (this.is('<')) args = this.typeArgs()
      const type: TypeRef = { name, dims: 0, args }
      if (this.is('[')) {
        const sizes: Expr[] = []
        let dims = 0
        while (this.eat('[')) {
          if (this.eat(']')) {
            dims++
            continue
          }
          sizes.push(this.expr())
          this.expect(']')
          dims++
        }
        const init = this.is('{') ? this.arrayInit() : undefined
        return { ...pos, k: 'newArray', type: { ...type, dims }, sizes, init }
      }
      const a = this.args()
      if (this.is('{')) this.fail('anonymousClass')
      return { ...pos, k: 'new', type, args: a }
    }
    const name = this.ident()
    if (this.is('(')) return { ...pos, k: 'call', name, args: this.args() }
    return { ...pos, k: 'name', name }
  }
}

/** Eine Datei lesen; Fehler als `JavaSyntaxError` mit Zeile. */
export function parseJava(source: string, file: string): ClassDecl[] {
  return new Parser(tokenize(source, file), file).unit()
}
