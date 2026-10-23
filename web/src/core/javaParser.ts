import type { LiveLabels, LiveSpan } from './codeGenerator'
import { placeholderElement } from './editing'
import { ElementType, makeElement, type VSCase, type VSElement } from './model'
import { parseSubprogramHeader } from './simulation'

/**
 * Gegenrichtung zu „Code live“: Java-Code, den man tippt, wird zum Struktogramm.
 * Der Leser ist absichtlich nachsichtig, denn beim Tippen ist Code fast immer unfertig:
 * Offene Blöcke gelten als geschlossen, fehlende Teile werden zu Platzhaltern, und eine Zeile,
 * die nicht passt, wird eine Anweisung mit dem getippten Text. Was fehlt, steht in `problems`.
 */

/** Hinweis zu einer Stelle im Code (Zeichenpositionen, `to` ausschließlich). `key` ist ein Text aus `i18n`. */
export interface JavaProblem {
  from: number
  to: number
  key: JavaProblemKey
  /** Setzt `%@` im Text, z. B. das fehlende Zeichen. */
  arg?: string
}

export type JavaProblemKey =
  | 'web_parse_missing'
  | 'web_parse_extra'
  | 'web_parse_missing_semicolon'
  | 'web_parse_unclosed_string'
  | 'web_parse_else_without_if'
  | 'web_parse_case_outside_switch'
  | 'web_parse_missing_do_while'
  | 'web_parse_more_methods'
  | 'web_parse_missing_import'

export interface ParsedJava {
  /** Kopfzeile eines Unterprogramms, z. B. `int quadrat(int x)`; `undefined` = Hauptprogramm. */
  caption?: string
  /** Name aus `public class Name`, falls der Code eine Klasse ist. */
  className?: string
  elements: VSElement[]
  /** Zeilen jedes Elements im getippten Code (ab 0), Pfade wie in `editing.ts`. */
  spans: LiveSpan[]
  /** Platzhalter-Wörter wie „Bedingung“ (Zeichenpositionen): grau, beim Tippen ersetzt. */
  placeholders: { from: number; to: number }[]
  problems: JavaProblem[]
}

export interface JavaParseOptions {
  /** Namen der Unterprogramme aus den anderen Reitern: ihr Aufruf wird ein Aufruf-Kasten. */
  subprograms?: Set<string>
}

// MARK: - Zerlegen in Wörter

type TokKind = 'id' | 'num' | 'str' | 'op' | 'comment'

interface Tok {
  kind: TokKind
  text: string
  start: number
  end: number
  line: number
}

const multiOps = ['>>>=', '<<=', '>>=', '>>>', '->', '::', '++', '--', '==', '!=', '<=', '>=', '&&', '||', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<']

function tokenize(src: string, problems: JavaProblem[]): Tok[] {
  const out: Tok[] = []
  let i = 0
  let line = 0
  const push = (kind: TokKind, start: number, end: number, startLine: number) =>
    out.push({ kind, text: src.slice(start, end), start, end, line: startLine })
  while (i < src.length) {
    const c = src[i]
    if (c === '\n') {
      line++
      i++
      continue
    }
    if (/\s/.test(c)) {
      i++
      continue
    }
    const start = i
    const startLine = line
    if (c === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') i++
      push('comment', start, i, startLine)
      continue
    }
    if (c === '/' && src[i + 1] === '*') {
      const close = src.indexOf('*/', i + 2)
      i = close < 0 ? src.length : close + 2
      for (let k = start; k < i; k++) if (src[k] === '\n') line++
      push('comment', start, i, startLine)
      continue
    }
    if (c === '"' || c === "'") {
      i++
      while (i < src.length && src[i] !== c && src[i] !== '\n') i += src[i] === '\\' ? 2 : 1
      if (src[i] === c) i++
      else problems.push({ from: start, to: Math.min(i, src.length), key: 'web_parse_unclosed_string', arg: c })
      push('str', start, Math.min(i, src.length), startLine)
      continue
    }
    const num = /^\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?[lLfFdD]?/.exec(src.slice(i, i + 64))
    if (num) {
      i += num[0].length
      push('num', start, i, startLine)
      continue
    }
    const id = /^[\p{L}_$][\p{L}\p{N}_$]*/u.exec(src.slice(i, i + 256))
    if (id) {
      i += id[0].length
      push('id', start, i, startLine)
      continue
    }
    const op = multiOps.find((o) => src.startsWith(o, i)) ?? c
    i += op.length
    push('op', start, i, startLine)
  }
  return out
}

// MARK: - Lesen

const statementKeywords = new Set(['if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'return', 'try'])
const modifiers = new Set(['public', 'private', 'protected', 'static', 'final', 'abstract'])
const declTypes = '(?:int|long|short|byte|float|double|boolean|char|String)'

type SwitchCase = VSCase & { isDefault?: boolean }

/** Ein Element mit seinen Zeilen im Code, solange die Pfade noch nicht feststehen. */
interface Built {
  element: VSElement
  from: number
  to: number
  /** Ausgabe eines reinen Textes: kann mit der folgenden Eingabe zu einem Kasten werden. */
  prompt?: string
}

class Parser {
  private toks: Tok[]
  private comments: Tok[]
  private i = 0
  readonly problems: JavaProblem[] = []
  readonly placeholders: { from: number; to: number }[] = []
  private lines = new Map<VSElement, [number, number]>()

  constructor(
    private src: string,
    private labels: LiveLabels,
    private opts: JavaParseOptions,
  ) {
    const all = tokenize(src, this.problems)
    this.toks = all.filter((t) => t.kind !== 'comment')
    this.comments = all.filter((t) => t.kind === 'comment')
  }

  // Hilfen

  private get tok(): Tok | undefined {
    return this.toks[this.i]
  }
  private is(text: string, t = this.tok) {
    return t !== undefined && t.text === text && t.kind !== 'str'
  }
  private next(): Tok {
    return this.toks[this.i++]
  }
  private eat(text: string): Tok | undefined {
    return this.is(text) ? this.next() : undefined
  }
  private prev(): Tok | undefined {
    return this.toks[this.i - 1]
  }
  private problem(key: JavaProblemKey, t: { start: number; end: number } | undefined, arg?: string) {
    const at = t ?? { start: this.src.length, end: this.src.length }
    this.problems.push({ from: at.start, to: Math.max(at.end, at.start + 1), key, arg })
  }
  /** Fehlendes Zeichen direkt hinter einem Wort melden. */
  private missingAfter(t: Tok | undefined, what: string) {
    const at = t ? t.end : this.src.length
    this.problems.push({ from: Math.max(0, at - 1), to: at, key: 'web_parse_missing', arg: what })
  }

  /** Text zwischen zwei Positionen ohne Kommentare, Zeilenumbrüche zu Leerzeichen. */
  private text(from: number, to: number): string {
    let s = ''
    let k = from
    for (const c of this.comments) {
      if (c.end <= from || c.start >= to) continue
      s += this.src.slice(k, Math.max(k, c.start))
      k = Math.max(k, c.end)
    }
    s += this.src.slice(k, Math.max(k, to))
    return s.replace(/\s*\n\s*/g, ' ').trim()
  }

  /** Ein Platzhalter-Wort (z. B. „Bedingung“) gilt als leer und wird grau gezeigt. */
  private slot(from: number, to: number, label: string): string {
    const t = this.text(from, to)
    if (t === label) {
      const at = this.src.indexOf(label, from)
      if (at >= 0) this.placeholders.push({ from: at, to: at + label.length })
      return ''
    }
    return t
  }

  private record(element: VSElement, from: number, to: number): Built {
    this.lines.set(element, [from, to])
    return { element, from, to }
  }

  private lineOf(t: Tok | undefined) {
    return t?.line ?? this.toks[this.toks.length - 1]?.line ?? 0
  }

  // Programm

  className?: string
  /** Getippte Imports ohne Leerzeichen, z. B. `importjava.util.Scanner;`. */
  private imports: string[] = []

  /** Wie javac: `Scanner` ohne `import java.util.Scanner;` (oder `java.util.*`) ist ein Fehler, ebenso `Files` und `Path` ohne `java.nio.file`. */
  checkImports() {
    for (const [name, pkg] of [['Scanner', 'java.util'], ['Files', 'java.nio.file'], ['Path', 'java.nio.file'], ['Paths', 'java.nio.file']]) {
      const known = this.imports.some((i) => i === `import${pkg}.${name};` || i === `import${pkg}.*;`)
      // `Files.readString(…)`: nur als Klasse vor einem Punkt, damit eine Variable `path` o. Ä. nicht zählt.
      const use = this.toks.find((t, k) => t.kind === 'id' && t.text === name && (name === 'Scanner' || this.toks[k + 1]?.text === '.'))
      if (!known && use) {
        this.problem('web_parse_missing_import', use, pkg === 'java.util' ? `import ${pkg}.${name};` : `import ${pkg}.*;`)
        return
      }
    }
  }

  parseProgram(): { caption?: string; elements: VSElement[] } {
    const elements: Built[] = []
    let caption: string | undefined
    let sawMethod = false
    while (this.tok) {
      if (this.is('import') || this.is('package')) {
        const start = this.i
        this.skipPast(';')
        this.imports.push(this.toks.slice(start, this.i).map((t) => t.text).join(''))
        continue
      }
      const cls = this.classStart()
      if (cls !== undefined) {
        this.className ??= cls.name
        this.i = cls.index
        const inner = this.parseClassBody()
        elements.push(...inner.elements)
        caption ??= inner.caption
        continue
      }
      const method = this.methodStart()
      if (method) {
        if (sawMethod) this.problem('web_parse_more_methods', this.tok)
        const body = this.parseMethod(method)
        if (!sawMethod) {
          caption = method.caption
          elements.push(...body)
        }
        sawMethod = true
        continue
      }
      if (this.is('}')) {
        this.problem('web_parse_extra', this.next(), '}')
        continue
      }
      elements.push(...this.parseStatement())
    }
    return { caption, elements: this.finishList(elements) }
  }

  private skipPast(text: string) {
    while (this.tok && !this.is(text)) this.next()
    this.eat(text)
  }

  /** `public class Name {`: Name und Index hinter `{`. */
  private classStart(): { name: string; index: number } | undefined {
    let k = this.i
    while (this.toks[k] && modifiers.has(this.toks[k].text)) k++
    if (this.toks[k]?.text !== 'class' || this.toks[k + 1]?.kind !== 'id') return undefined
    const name = this.toks[k + 1].text
    k += 2
    while (this.toks[k] && this.toks[k].text !== '{') k++
    return { name, index: k + 1 }
  }

  private parseClassBody(): { caption?: string; elements: Built[] } {
    let main: Built[] | undefined
    let other: { caption?: string; body: Built[] } | undefined
    let extra = false
    // Klasse ohne `main`: Anweisungen stehen direkt in der Klasse.
    const loose: Built[] = []
    while (this.tok && !this.is('}')) {
      const method = this.methodStart()
      if (!method) {
        if (this.is('{')) loose.push(...this.parseBlock().elements)
        else loose.push(...this.parseStatement())
        continue
      }
      const start = this.tok
      const body = this.parseMethod(method)
      if (method.name === 'main') main ??= body
      else if (!other) other = { caption: method.caption, body }
      else extra = true
      if ((main && other) || extra) this.problem('web_parse_more_methods', start)
    }
    this.eat('}')
    if (main) return { elements: main }
    if (loose.length > 0 || !other) return { elements: loose }
    return { caption: other.caption, elements: other.body }
  }

  /** `[public static] int quadrat(int x) {`: Name und Kopfzeile, Index steht danach auf `{`. */
  private methodStart(): { name: string; caption?: string } | undefined {
    let k = this.i
    let mods = 0
    while (this.toks[k] && modifiers.has(this.toks[k].text)) {
      k++
      mods++
    }
    const type = this.toks[k]
    if (type?.kind !== 'id' || statementKeywords.has(type.text) || type.text === 'new') return undefined
    k++
    while (this.toks[k]?.text === '[' && this.toks[k + 1]?.text === ']') k += 2
    const name = this.toks[k]
    if (name?.kind !== 'id' || this.toks[k + 1]?.text !== '(') return undefined
    // Ohne `public`/`static` nur, wenn danach wirklich ein Rumpf `{` folgt (sonst ist es eine Anweisung).
    let depth = 0
    let close = k + 1
    for (; this.toks[close]; close++) {
      const t = this.toks[close].text
      if (t === '(') depth++
      else if (t === ')' && --depth === 0) break
      else if (t === ';' || t === '{' || t === '}') break
    }
    // `throws IOException, Exception` nach der Parameterliste gehört zur Kopfzeile.
    let bodyAt = close + 1
    if (this.toks[close]?.text === ')' && this.toks[bodyAt]?.text === 'throws') {
      bodyAt++
      while (this.toks[bodyAt]?.kind === 'id' && (this.toks[bodyAt + 1]?.text === ',' || this.toks[bodyAt + 1]?.text === '{' || this.toks[bodyAt + 1]?.text === '.')) {
        bodyAt += this.toks[bodyAt + 1].text === '{' ? 1 : 2
      }
    }
    const after = this.toks[bodyAt]
    const hasBody = this.toks[close]?.text === ')' && after?.text === '{'
    if (!hasBody && !(mods > 0 && (after === undefined || this.toks[close] === undefined))) return undefined
    const paramsEnd = this.toks[close]?.text === ')' ? this.toks[close].start : this.src.length
    const params = this.text(this.toks[k + 1].end, paramsEnd)
    const typeText = this.text(type.start, this.toks[k - 1].end).replace(/\s+/g, '')
    const header = `${typeText} ${name.text}(${params.replace(/\s*,\s*/g, ', ')})`
    this.i = Math.min(hasBody ? bodyAt : close + 1, this.toks.length)
    return { name: name.text, caption: name.text === 'main' || !parseSubprogramHeader(header) ? undefined : header }
  }

  private parseMethod(_method: { name: string }): Built[] {
    if (!this.is('{')) {
      this.missingAfter(this.prev(), '{')
      return []
    }
    return this.parseBlock().elements
  }

  // Blöcke

  /** `{ … }`; fehlt die schließende Klammer, endet der Block am Ende des Codes. */
  private parseBlock(): { elements: Built[]; end: number } {
    const open = this.next()
    const elements: Built[] = []
    while (this.tok && !this.is('}')) {
      if (this.is('case') || this.is('default')) break
      elements.push(...this.parseStatement())
    }
    const close = this.eat('}')
    if (!close) this.problem('web_parse_missing', open, '}')
    if (elements.length === 0) {
      // Leerer Block mit `// Dein Code`: Der Platzhalter steht in dieser Zeile.
      const until = close?.start ?? this.src.length
      const c = this.comments.find((c) => c.start > open.end && c.start < until && this.isCodePlaceholder(c))
      if (c) elements.push(this.record(placeholderElement(), c.line, c.line))
    }
    return { elements, end: this.lineOf(close ?? this.prev()) }
  }

  /** Rumpf nach `if (…)`, `for (…)` usw.: Block oder eine einzelne Anweisung. */
  private parseBody(): { elements: VSElement[]; end: number } {
    if (this.is('{')) {
      const b = this.parseBlock()
      return { elements: this.finishList(b.elements), end: b.end }
    }
    if (!this.tok || this.is('}')) {
      this.missingAfter(this.prev(), '{')
      return { elements: [placeholderElement()], end: this.lineOf(this.prev()) }
    }
    const one = this.parseStatement()
    return { elements: this.finishList(one), end: one.length ? one[one.length - 1].to : this.lineOf(this.prev()) }
  }

  /** Ausgabe + Eingabe zusammenfassen; leere Liste wird zum Platzhalter `ø`. */
  private finishList(list: Built[]): VSElement[] {
    const out: Built[] = []
    for (const b of list) {
      const last = out[out.length - 1]
      const input = b.element.type === ElementType.anweisung ? /^input: (\S+(?: \S+)?)$/.exec(b.element.textLines[0]) : null
      if (input && last?.prompt !== undefined) {
        const name = input[1].split(' ').pop()!
        if (last.prompt !== `${name}: `) b.element.textLines = [`${b.element.textLines[0]} "${last.prompt}"`]
        out.pop()
        this.lines.delete(last.element)
        out.push(this.record(b.element, last.from, b.to))
        continue
      }
      out.push(b)
    }
    if (out.length === 0) return [placeholderElement()]
    return out.map((b) => b.element)
  }

  // Anweisungen

  private parseStatement(): Built[] {
    const t = this.tok!
    switch (t.kind === 'id' ? t.text : '') {
      case 'if':
        return [this.parseIf()]
      case 'while':
        return [this.parseWhile()]
      case 'do':
        return [this.parseDo()]
      case 'for':
        return [this.parseFor()]
      case 'switch':
        return [this.parseSwitch()]
      case 'try':
        return this.parseTry()
      case 'break': {
        this.next()
        const semi = this.eat(';')
        if (!semi) this.missingAfter(t, ';')
        const hint = this.trailingComment(semi ?? t)
        return [this.record(makeElement(ElementType.aussprung, { textLines: [hint] }), t.line, t.line)]
      }
      case 'else':
        this.problem('web_parse_else_without_if', this.next())
        return []
      case 'case':
      case 'default':
        this.problem('web_parse_case_outside_switch', this.next())
        while (this.tok && !this.is(':') && !this.is('->') && !this.is(';')) this.next()
        this.next()
        return []
    }
    if (this.is('{')) {
      const b = this.parseBlock()
      return b.elements
    }
    if (this.is(';')) {
      this.next()
      return [this.record(makeElement(ElementType.anweisung), t.line, t.line)]
    }
    return this.parseSimple()
  }

  /**
   * `try { … } catch (…) { … } finally { … }`: Im Struktogramm gibt es dafür keinen Kasten, deshalb wird alles
   * zusammen ein Anweisungskasten (wie ein Lambda mit Rumpf). Fehlt eine `}`, wird sie gemeldet.
   */
  private parseTry(): Built[] {
    const first = this.next()
    let last = first
    /** Klammerpaar ab dem aktuellen Wort überspringen; `false`, wenn die schließende Klammer fehlt. */
    const skipPair = (open: string, close: string): boolean => {
      const start = this.next()
      last = start
      let depth = 1
      while (this.tok) {
        const t = this.next()
        last = t
        if (t.kind === 'str') continue
        if (t.text === open) depth++
        else if (t.text === close && --depth === 0) return true
      }
      this.missingAfter(last, close)
      return false
    }
    let complete = true
    if (this.is('(')) complete = skipPair('(', ')')
    if (complete && this.is('{')) complete = skipPair('{', '}')
    else if (complete) this.missingAfter(last, '{')
    while (complete && (this.is('catch') || this.is('finally'))) {
      const isCatch = this.next().text === 'catch'
      last = this.prev()!
      if (isCatch) {
        if (this.is('(')) complete = skipPair('(', ')')
        else this.missingAfter(last, '(')
      }
      if (complete && this.is('{')) complete = skipPair('{', '}')
      else if (complete) this.missingAfter(last, '{')
    }
    const raw = this.text(first.start, last.end).replace(/\s+/g, ' ')
    return [this.record(makeElement(ElementType.anweisung, { textLines: [raw] }), first.line, last.line)]
  }

  /** Kommentar direkt hinter einem Wort in derselben Zeile, z. B. `break; // fertig`. */
  private trailingComment(after: Tok): string {
    const c = this.comments.find((c) => c.start >= after.end && c.line === after.line)
    const nextTok = this.toks.find((x) => x.start >= after.end)
    if (!c || (nextTok && nextTok.start < c.start)) return ''
    return c.text.replace(/^\/\/|^\/\*|\*\/$/g, '').trim()
  }

  /** Bedingung in `( … )`. Fehlt `(` oder `)`, endet sie vor `{` bzw. am Zeilenende. */
  private parenthesized(keyword: Tok, label: string): { text: string; close?: Tok } {
    const open = this.eat('(')
    if (!open) this.missingAfter(keyword, '(')
    const startTok = this.tok
    let depth = 0
    let lastTok: Tok | undefined
    while (this.tok) {
      const t = this.tok
      if (!open && t.line !== keyword.line) break
      if (t.text === '{' || t.text === '}' || t.text === ';') break
      if (t.text === '(') depth++
      if (t.text === ')') {
        if (depth === 0) break
        depth--
      }
      lastTok = this.next()
    }
    const close = open ? this.eat(')') : undefined
    if (open && !close) this.missingAfter(lastTok ?? open, ')')
    const from = open ? open.end : (startTok?.start ?? keyword.end)
    const to = close ? close.start : (lastTok?.end ?? from)
    return { text: this.slot(from, to, label), close }
  }

  private parseIf(): Built {
    const kw = this.next()
    const cond = this.parenthesized(kw, this.labels.condition)
    const yes = this.parseBody()
    let no: VSElement[] = [placeholderElement()]
    let end = yes.end
    if (this.is('else')) {
      this.next()
      if (this.is('if')) {
        const nested = this.parseIf()
        no = [nested.element]
        end = nested.to
      } else {
        const b = this.parseBody()
        no = b.elements
        end = b.end
      }
    }
    const element = makeElement(ElementType.verzweigung, {
      textLines: [cond.text],
      cases: [
        { name: 'true', elements: yes.elements },
        { name: 'false', elements: no },
      ],
    })
    return this.record(element, kw.line, end)
  }

  private parseWhile(): Built {
    const kw = this.next()
    const cond = this.parenthesized(kw, this.labels.condition)
    const body = this.parseBody()
    const endless = cond.text === 'true'
    const element = makeElement(endless ? ElementType.endlosschleife : ElementType.whileSchleife, {
      textLines: [endless ? '' : cond.text],
      loopBody: body.elements,
    })
    return this.record(element, kw.line, body.end)
  }

  private parseDo(): Built {
    const kw = this.next()
    const body = this.parseBody()
    let cond = ''
    let end = body.end
    const w = this.eat('while')
    if (w) {
      cond = this.parenthesized(w, this.labels.condition).text
      const semi = this.eat(';')
      if (!semi) this.missingAfter(this.prev(), ';')
      end = this.lineOf(this.prev())
    } else {
      this.problem('web_parse_missing_do_while', kw)
    }
    return this.record(makeElement(ElementType.doUntilSchleife, { textLines: [cond], loopBody: body.elements }), kw.line, end)
  }

  private parseFor(): Built {
    const kw = this.next()
    const open = this.eat('(')
    if (!open) this.missingAfter(kw, '(')
    const fields: string[] = []
    const labels = [this.labels.start, this.labels.condition, this.labels.step]
    let from = open?.end ?? this.tok?.start ?? kw.end
    let depth = 0
    let close: Tok | undefined
    let last: Tok | undefined
    while (this.tok) {
      const t = this.tok
      if (t.text === '{' || t.text === '}') break
      if (!open && t.line !== kw.line) break
      if (t.text === '(') depth++
      if (t.text === ')') {
        if (depth === 0) {
          close = this.next()
          break
        }
        depth--
      }
      if (t.text === ';' && depth === 0) {
        fields.push(this.slot(from, t.start, labels[fields.length] ?? ''))
        this.next()
        from = t.end
        continue
      }
      last = this.next()
    }
    if (open && !close) this.missingAfter(last ?? this.prev() ?? open, ')')
    const tail = close ? close.start : (last?.end ?? this.prev()?.end ?? from)
    fields.push(this.slot(from, Math.max(from, tail), labels[fields.length] ?? ''))
    // Kopf `int x : liste` oder unvollständig: wie im Objektinspektor drei Felder.
    let textLines = fields
    if (fields.length === 1 && fields[0] !== '' && !fields[0].includes(':')) textLines = [fields[0], '', '']
    while (textLines.length < 3 && textLines.length > 1) textLines.push('')
    const body = this.parseBody()
    return this.record(makeElement(ElementType.forSchleife, { textLines, loopBody: body.elements }), kw.line, body.end)
  }

  private parseSwitch(): Built {
    const kw = this.next()
    const sel = this.parenthesized(kw, this.labels.selector)
    const cases: SwitchCase[] = []
    let end = this.lineOf(this.prev())
    const open = this.eat('{')
    if (!open) this.missingAfter(this.prev(), '{')
    else {
      while (this.tok && !this.is('}')) {
        if (!this.is('case') && !this.is('default')) {
          // Anweisung vor dem ersten `case`: einem Fall ohne Namen zuordnen wäre verwirrend, also melden.
          this.problem('web_parse_case_outside_switch', this.tok)
          this.parseStatement()
          continue
        }
        cases.push(this.parseCase())
      }
      const close = this.eat('}')
      if (!close) this.problem('web_parse_missing', open, '}')
      end = this.lineOf(close ?? this.prev())
    }
    if (!cases.some((c) => c.isDefault)) cases.push({ name: 'default', elements: [placeholderElement()], isDefault: true })
    // `default` steht immer als letzter Fall.
    const ordered = [...cases.filter((c) => !c.isDefault), ...cases.filter((c) => c.isDefault)].map(({ name, elements }) => ({ name, elements }))
    return this.record(makeElement(ElementType.fallauswahl, { textLines: [sel.text], cases: ordered }), kw.line, end)
  }

  private parseCase(): SwitchCase {
    const kw = this.next()
    const isDefault = kw.text === 'default'
    const labelStart = this.tok?.start ?? kw.end
    let labelEnd = labelStart
    while (this.tok && !this.is('->') && !this.is(':') && !this.is('{') && !this.is('}')) labelEnd = this.next().end
    const arrow = this.eat('->') ?? this.eat(':')
    if (!arrow) this.missingAfter(this.prev(), '->')
    let name = isDefault ? 'default' : this.text(labelStart, labelEnd)
    let elements: Built[] = []
    if (arrow?.text === '->') {
      if (this.is('{')) {
        // `default -> { /* Name */`: der Name des letzten Falls steht als Kommentar dahinter.
        if (isDefault) name = this.trailingComment(this.tok!) || name
        elements = this.parseBlock().elements
      } else if (this.tok && !this.is('}')) elements = this.parseStatement()
    } else {
      if (isDefault && arrow) name = this.trailingComment(arrow) || name
      while (this.tok && !this.is('case') && !this.is('default') && !this.is('}')) elements.push(...this.parseStatement())
      // Klassisches `break;` am Ende eines Falls gehört zur Fallauswahl selbst.
      const last = elements[elements.length - 1]
      if (last?.element.type === ElementType.aussprung && last.element.textLines.every((l) => l === '')) elements.pop()
    }
    return { name, elements: this.finishList(elements), isDefault }
  }

  /** Eine einfache Anweisung bis `;`. Fehlt das Semikolon, endet sie am Zeilenende. */
  private parseSimple(): Built[] {
    const first = this.next()
    let last = first
    // Offene Klammern dieser Anweisung. Steht die innerste `{` in der Anweisung (Lambda `e -> { … }` oder
    // anonyme Klasse `new ActionListener() { … }`), gehören `;` und neue Zeilen darin noch dazu.
    const open: string[] = first.text === '(' || first.text === '[' || first.text === '{' ? [first.text] : []
    const inBraces = () => open.length > 0 && open[open.length - 1] === '{' && first.text !== '{'
    let semi: Tok | undefined
    while (this.tok) {
      const t = this.tok
      if (t.text === ';' && t.kind === 'op' && !inBraces()) {
        semi = this.next()
        break
      }
      if (t.line !== last.line && !inBraces()) {
        if (open.length === 0 || (t.kind === 'id' && statementKeywords.has(t.text)) || t.text === '}') break
      }
      if (t.text === '}' && open.length === 0) break
      if (t.text === '(' || t.text === '[' || t.text === '{') open.push(t.text)
      if (t.text === ')' || t.text === ']' || t.text === '}') open.pop()
      last = this.next()
    }
    if (!semi) this.missingAfter(last, ';')
    this.checkBrackets(first, last)
    const raw = this.text(first.start, last.end)
    const built = this.simpleElement(raw)
    if (!built) return []
    const b = this.record(built.element, first.line, last.line)
    b.prompt = built.prompt
    return [b]
  }

  /** Runde und eckige Klammern innerhalb einer Anweisung. */
  private checkBrackets(first: Tok, last: Tok) {
    const stack: Tok[] = []
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' }
    const closing: Record<string, string> = { '(': ')', '[': ']', '{': '}' }
    for (let k = this.toks.indexOf(first); k >= 0 && k < this.toks.length && this.toks[k].start <= last.start; k++) {
      const t = this.toks[k]
      if (t.kind !== 'op') continue
      if (closing[t.text]) stack.push(t)
      else if (pairs[t.text]) {
        if (stack.length && stack[stack.length - 1].text === pairs[t.text]) stack.pop()
        else this.problem('web_parse_extra', t, t.text)
      }
    }
    if (stack.length) this.missingAfter(last, closing[stack[stack.length - 1].text])
  }

  /** Anweisungstext → Kasten. `undefined` = gehört nicht ins Struktogramm (z. B. `Scanner scanner = …`). */
  private simpleElement(raw: string): { element: VSElement; prompt?: string } | undefined {
    if (/^(?:(?:private|public|static|final)\s+)*Scanner\s+\w+\s*=\s*new\s+Scanner\s*\(\s*System\.in\s*\)$/.test(raw)) return undefined
    const anweisung = (text: string) => makeElement(ElementType.anweisung, { textLines: [text] })
    // Auch unfertig (`System.out.println(` beim Tippen) und leer schon eine Ausgabe.
    const out = /^System\.out\.println\s*\(([\s\S]*?)\)?$/.exec(raw)
    if (out) {
      const expr = out[1].trim()
      if (expr === '') return { element: anweisung('output: ') }
      const literal = /^"((?:[^"\\]|\\.)*)"$/.exec(expr)
      const prompt = literal ? unescapeJava(literal[1]) : undefined
      return { element: anweisung(`output: ${expr}`), prompt: prompt !== undefined && !prompt.includes('"') ? prompt : undefined }
    }
    const input = new RegExp(`^(?:(${declTypes})\\s+)?([A-Za-z_]\\w*(?:\\s*\\[[^\\]]+\\])*)\\s*=\\s*\\w+\\.(nextInt|nextDouble|nextLine|next|nextBoolean)\\s*\\(\\s*\\)$`).exec(raw)
    if (input) {
      const kind = { nextInt: 'int', nextDouble: 'double', nextLine: 'String', next: 'String', nextBoolean: 'boolean' }[input[3]]!
      const name = input[2].replace(/\s+/g, '')
      // Ohne Typ nur bei Array-Zellen, sonst würde der erzeugte Code die Variable ein zweites Mal anlegen.
      if ((input[1] === kind || (!input[1] && name.includes('['))) && kind) return { element: anweisung(`input: ${kind} ${name}`) }
    }
    const final = new RegExp(`^final\\s+(${declTypes}\\s+[\\s\\S]*)$`).exec(raw)
    if (final) return { element: anweisung(`const ${final[1]}`) }
    const call = /^(?:(?:\w+\s+)?\w+\s*=\s*)?([A-Za-z_]\w*)\s*\(/.exec(raw)
    if (call && this.opts.subprograms?.has(call[1])) return { element: makeElement(ElementType.aufruf, { textLines: [raw] }) }
    return { element: anweisung(raw) }
  }

  // Ergebnis

  /** Pfade wie in `editing.ts` und die Zeilen dazu. */
  spansFor(elements: VSElement[], prefix: number[] = [], out: LiveSpan[] = []): LiveSpan[] {
    elements.forEach((e, i) => {
      const path = [...prefix, i]
      const lines = this.lines.get(e)
      if (lines) out.push({ path, from: lines[0], to: lines[1] })
      if (e.loopBody) this.spansFor(e.loopBody, [...path, 0], out)
      e.cases?.forEach((c, k) => this.spansFor(c.elements, [...path, k], out))
    })
    return out
  }

  private isCodePlaceholder(c: Tok) {
    return c.text.startsWith('//') && c.text.slice(2).trim() === this.labels.code
  }

  /** `// Dein Code` in leeren Blöcken ist ein Platzhalter. */
  markPlaceholderComments() {
    for (const c of this.comments) if (this.isCodePlaceholder(c)) this.placeholders.push({ from: c.start, to: c.end })
  }
}

function unescapeJava(s: string): string {
  return s.replace(/\\(.)/g, (_, c: string) => ({ n: '\n', r: '\r', t: '\t' })[c] ?? c)
}

export function parseLiveJava(source: string, labels: LiveLabels, opts: JavaParseOptions = {}): ParsedJava {
  const p = new Parser(source, labels, opts)
  const { caption, elements } = p.parseProgram()
  p.markPlaceholderComments()
  p.checkImports()
  const spans = p.spansFor(elements)
  const problems = p.problems.sort((a, b) => a.from - b.from)
  return { caption, className: p.className, elements, spans, placeholders: p.placeholders.sort((a, b) => a.from - b.from), problems }
}
