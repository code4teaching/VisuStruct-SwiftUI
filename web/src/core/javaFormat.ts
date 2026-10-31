/**
 * Java-Code formatieren wie „Formatieren“ in Eclipse, aber vorsichtig: Es ändert nur Leerraum zwischen den
 * Wörtern und Zeichen, nie den Code selbst. Jede Block-Klammer `{`/`}` bekommt ihre eigene Zeile (`} else {`
 * bleibt zusammen), jede Anweisung eine eigene Zeile, um Operatoren wie `>=` und `=` steht ein Leerzeichen.
 * Danach rückt `indentJava` ein. Zeilen werden nur getrennt, nie zusammengezogen.
 */
import { indentJava } from './javaIndent'

export interface FormatEdit {
  from: number
  to: number
  insert: string
}

type Kind = 'word' | 'num' | 'str' | 'comment' | 'op' | 'other'

interface Token {
  kind: Kind
  text: string
  from: number
  to: number
  /** Zeile (ab 1), in der das Zeichen beginnt. */
  line: number
}

// Längste zuerst. `>>` und `>>>` fehlen absichtlich: Sie schließen oft zwei Generics wie `List<List<String>>`.
const operators = ['>>>=', '<<=', '>>=', '...', '->', '::', '++', '--', '&&', '||', '==', '!=', '<=', '>=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<']
const alwaysBinary = new Set(['=', '==', '!=', '<=', '>=', '&&', '||', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=', '>>>=', '->', '&', '|', '^', '<<'])
const arithmetic = new Set(['+', '-', '*', '/', '%'])
/** Wörter, nach denen ein `-` oder `+` zur Zahl gehört (`return -1`). */
const notValue = new Set(['return', 'case', 'throw', 'new', 'else', 'do', 'yield', 'assert', 'instanceof'])
const primitive = new Set(['byte', 'short', 'int', 'long', 'float', 'double', 'char', 'boolean'])
const control = new Set(['if', 'for', 'while', 'switch', 'catch', 'synchronized', 'try'])
const joinAfterBrace = new Set(['else', 'catch', 'finally'])

function tokenize(text: string): Token[] {
  const tokens: Token[] = []
  let line = 1
  let i = 0
  const push = (kind: Kind, end: number) => {
    tokens.push({ kind, text: text.slice(i, end), from: i, to: end, line })
    for (let k = i; k < end; k++) if (text[k] === '\n') line++
    i = end
  }
  while (i < text.length) {
    const c = text[i]
    const rest = text.slice(i, i + 4)
    if (c === '\n') {
      line++
      i++
    } else if (/\s/.test(c)) i++
    else if (rest.startsWith('//')) {
      const end = text.indexOf('\n', i)
      push('comment', end < 0 ? text.length : end)
    } else if (rest.startsWith('/*')) {
      const end = text.indexOf('*/', i + 2)
      push('comment', end < 0 ? text.length : end + 2)
    } else if (rest.startsWith('"""')) {
      const end = text.indexOf('"""', i + 3)
      push('str', end < 0 ? text.length : end + 3)
    } else if (c === '"' || c === "'") {
      let k = i + 1
      while (k < text.length && text[k] !== c && text[k] !== '\n') k += text[k] === '\\' ? 2 : 1
      push('str', Math.min(text.length, k + 1))
    } else if (/[\d]/.test(c) || (c === '.' && /\d/.test(text[i + 1] ?? ''))) {
      const m = /^(?:0[xXbB][\da-fA-F_]+|[\d_]*\.?[\d_]*(?:[eE][+-]?\d+)?)[a-zA-Z]*/.exec(text.slice(i))!
      push('num', i + Math.max(1, m[0].length))
    } else if (/[\p{L}_$]/u.test(c)) {
      const m = /^[\p{L}\p{N}_$]+/u.exec(text.slice(i))!
      push('word', i + m[0].length)
    } else {
      const op = operators.find((o) => text.startsWith(o, i))
      push(op ? 'op' : 'other', i + (op?.length ?? 1))
    }
  }
  return tokens
}

/** Endet hier ein Wert, sodass ein folgendes `-` rechnet statt ein Vorzeichen zu sein? */
function endsValue(tokens: Token[], i: number): boolean {
  const t = tokens[i]
  if (!t) return false
  if (t.kind === 'num' || t.kind === 'str') return true
  if (t.kind === 'word') return !notValue.has(t.text)
  if (t.text === ']') return true
  // `(int) -x` ist eine Typumwandlung mit Vorzeichen.
  if (t.text === ')') return !(primitive.has(tokens[i - 1]?.text ?? '') && tokens[i - 2]?.text === '(')
  return false
}

const upper = (t: Token | undefined) => t?.kind === 'word' && /^\p{Lu}/u.test(t.text)

/** Änderungen am Leerraum, nur in den Zeilen `fromLine`…`toLine` (ab 1). */
export function formatJavaEdits(text: string, fromLine = 1, toLine = Number.MAX_SAFE_INTEGER): FormatEdit[] {
  const tokens = tokenize(text)
  const n = tokens.length
  const binary: boolean[] = new Array(n).fill(false)
  const blockBrace: boolean[] = new Array(n).fill(false)
  const match: number[] = new Array(n).fill(-1)
  const afterDo: boolean[] = new Array(n).fill(false)
  const statementEnd: boolean[] = new Array(n).fill(false)

  // Klammern zuordnen: Block-Klammern gegen Array-Initialisierer, Klammertiefe je Block für `for (…;…;…)`.
  const frames: { at: number; block: boolean; paren: number }[] = [{ at: -1, block: true, paren: 0 }]
  let generic = 0
  let ternary = 0
  tokens.forEach((t, i) => {
    const prev = tokens[i - 1]
    const top = frames.at(-1)!
    if (t.kind === 'comment') return
    if (t.text === '(') top.paren++
    else if (t.text === ')') top.paren = Math.max(0, top.paren - 1)
    else if (t.text === '{') {
      const p = prev?.text ?? ''
      const init = ['=', ',', ']', '('].includes(p) || (p === '{' && !blockBrace[i - 1])
      blockBrace[i] = !init
      afterDo[i] = p === 'do'
      frames.push({ at: i, block: !init, paren: 0 })
    } else if (t.text === '}') {
      if (frames.length > 1) {
        const open = frames.pop()!
        blockBrace[i] = open.block
        match[i] = open.at
        match[open.at] = i
        afterDo[i] = afterDo[open.at]
      } else blockBrace[i] = true
    } else if (t.text === ';') {
      statementEnd[i] = top.block && top.paren === 0
      ternary = 0
    } else if (t.text === '?' && prev?.text !== '<' && ![')', ';', ',', undefined].includes(tokens[i + 1]?.text)) {
      // Ein Fragezeichen am Ende wie in `if (Alter über 18?)` ist Pseudocode, kein `a ? b : c`.
      binary[i] = true
      ternary++
    } else if (t.text === ':') {
      // `a ? b : c` und `for (int x : zahlen)`, aber nicht `case 1:`.
      binary[i] = ternary > 0 || top.paren > 0
      if (ternary > 0) ternary--
    } else if (t.text === '<') {
      const next = tokens[i + 1]
      if ((upper(prev) || prev?.text === '.') && (upper(next) || next?.text === '>' || next?.text === '?')) generic++
      else binary[i] = !(prev?.text === '<' || next?.text === '<')
    } else if (t.text === '>') {
      if (generic > 0) generic--
      else binary[i] = !(prev?.text === '>' || tokens[i + 1]?.text === '>')
    } else if (alwaysBinary.has(t.text)) binary[i] = true
    else if (arithmetic.has(t.text)) binary[i] = endsValue(tokens, i - 1)
  })

  const edits: FormatEdit[] = []
  for (let i = 1; i < n; i++) {
    const a = tokens[i - 1]
    const b = tokens[i]
    const gap = text.slice(a.to, b.from)
    if (gap.includes('\n') || a.line < fromLine || a.line > toLine) continue
    if (a.kind === 'comment') continue
    let want: string | undefined
    if (b.kind === 'comment') want = undefined
    else if (blockBrace[i - 1] && a.text === '{' && match[i - 1] !== i) want = '\n'
    else if (blockBrace[i] && b.text === '}' && match[i] !== i - 1) want = '\n'
    else if (blockBrace[i - 1] && a.text === '}') {
      if (joinAfterBrace.has(b.text) || (b.text === 'while' && afterDo[i - 1])) want = ' '
      else if (![')', ';', ',', '.'].includes(b.text)) want = '\n'
    } else if (statementEnd[i - 1]) want = '\n'
    else if (b.text === ',' || b.text === ';') want = ''
    else if (a.text === ',') want = ' '
    else if (a.text === ';') want = b.text === ')' ? '' : ' '
    else if (a.text === '(' || b.text === ')') want = ''
    else if (b.text === '(' && control.has(a.text)) want = ' '
    else if (b.text === '{' && blockBrace[i]) want = ' '
    else if (binary[i - 1] || binary[i]) want = ' '
    if (want !== undefined && want !== gap) edits.push({ from: a.to, to: b.from, insert: want })
  }
  return edits
}

/** Code formatieren und einrücken; nur die Zeilen `fromLine`…`toLine` (ab 1) werden angefasst. */
export function formatJava(text: string, fromLine = 1, toLine = Number.MAX_SAFE_INTEGER): string {
  const edits = formatJavaEdits(text, fromLine, toLine)
  let out = ''
  let pos = 0
  for (const e of edits) {
    out += text.slice(pos, e.from) + e.insert
    pos = e.to
  }
  out += text.slice(pos)
  // Die angefassten Zeilen nach dem Trennen: Neue Zeilenumbrüche verschieben das Ende nach unten.
  const lines = text.split('\n').length
  const added = edits.reduce((sum, e) => sum + (e.insert === '\n' ? 1 : 0), 0)
  const to = toLine >= lines ? Number.MAX_SAFE_INTEGER : toLine + added
  return indentJava(out, fromLine, to)
}
