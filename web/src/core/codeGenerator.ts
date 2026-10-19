/**
 * Port von `VisuStructCodeGenerator.swift` und `CodeGeneration/*.swift`:
 * Quellcode (Java, Python, JavaScript) aus dem Struktogramm.
 */
import { ElementType, type VSDocument, type VSElement } from './model'

export type CodeTarget = 'java' | 'python' | 'javascript'

export interface CodeOptions {
  baseIndent: number
  indentPerLevel: number
  /** Diagramm-Texte zusätzlich als Kommentar (`/* … *\/` bzw. `""" … """`). */
  includeDiagramTextAsComments: boolean
  /** `else` auch ausgeben, wenn der Nein-Zweig nur leer (ø) ist. */
  includeEmptyElseBranch: boolean
  /** Interner Heuristik-Kontext für JavaScript (Ganzzahldivision). */
  jsIntVariables?: Set<string>
}

export const defaultCodeOptions: CodeOptions = {
  baseIndent: 0,
  indentPerLevel: 4,
  includeDiagramTextAsComments: false,
  includeEmptyElseBranch: true,
}

export function generateCode(document: VSDocument, target: CodeTarget, options: Partial<CodeOptions> = {}): string {
  const opts: CodeOptions = { ...defaultCodeOptions, ...options, jsIntVariables: new Set() }
  let out = ''
  if (target === 'javascript') {
    // Schul-tauglich: Strict-Modus immer am Anfang des Snippets.
    out += '"use strict";\n\n'
    opts.jsIntVariables = inferIntegerVariablesForJavaScript(document)
  }
  if (target === 'python' && documentContainsJavaMathRandom(document)) out += 'import random\n\n'
  if (target === 'java' && documentContainsJavaInput(document)) {
    // Snippet-Modus: Import als Kommentar (damit es auch beim Einfügen in `main` nicht „falsch“ steht).
    out += '// import java.util.Scanner;\n'
    out += 'Scanner scanner = new Scanner(System.in);\n\n'
  }
  const sink = { out }
  for (const el of document.elements) emit(el, target, opts, opts.baseIndent, sink)
  out = sink.out
  if (out.trim() === '') {
    const empty = commentPrefix(target, true)
    return target === 'javascript' ? '"use strict";\n\n' + empty : empty
  }
  return postProcessLengthSyntax(out.replace(/^[\n\r]+|[\n\r]+$/g, ''), target)
}

// MARK: - Hilfen

type Sink = { out: string }

const sp = (n: number) => (n > 0 ? ' '.repeat(n) : '')

/** Wie Swift `regexGroups`: alle Gruppen, fehlende als "". */
function groups(re: RegExp, s: string): string[] | undefined {
  const m = re.exec(s)
  return m ? Array.from(m, (g) => g ?? '') : undefined
}

function commentPrefix(target: CodeTarget, forEmpty: boolean): string {
  if (!forEmpty) return ''
  return target === 'python' ? '# empty element' : '// empty element'
}

const isDiagramEmptyPlaceholderText = (s: string) => s.trim() === 'ø'

function emptyElementCommentLine(indent: number, target: CodeTarget): string {
  return sp(indent) + (target === 'python' ? '# empty element\n' : '// empty element\n')
}

function isElementVisuallyEmptyPlaceholderOnly(el: VSElement): boolean {
  switch (el.type) {
    case ElementType.leerElement:
      return true
    case ElementType.anweisung:
    case ElementType.aufruf:
      return el.textLines.map((l) => l.trim()).every((l) => l === '' || isDiagramEmptyPlaceholderText(l))
    default:
      return false
  }
}

function isIfElseFalseBranchVisuallyEmpty(elements: VSElement[]): boolean {
  return elements.every(isElementVisuallyEmptyPlaceholderOnly)
}

function blockComment(lines: string[], target: CodeTarget, indent: number): string {
  const trimmed = lines.map((l) => l.replace(/^[ \t]+|[ \t]+$/g, '')).filter((l) => l !== '')
  if (trimmed.length === 0) return ''
  if (target === 'python') {
    return sp(indent) + '"""\n' + trimmed.map((t) => sp(indent) + t + '\n').join('') + sp(indent) + '"""\n'
  }
  if (trimmed.length === 1) return sp(indent) + '/* ' + trimmed[0] + ' */\n'
  return sp(indent) + '/*\n' + trimmed.map((t) => sp(indent) + ' * ' + t + '\n').join('') + sp(indent) + ' */\n'
}

const isCStyleSemicolonTarget = (t: CodeTarget) => t === 'java' || t === 'javascript'

/** Semikolon-Heuristik für Java/JavaScript: ergänzt `;`, wenn sinnvoll und noch nicht vorhanden. */
export function formatCStyleStatementLine(rawLine: string): string {
  const line = rawLine.trim()
  if (line === '') return ''
  if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*') || line.startsWith('#')) return line
  if (line.startsWith('{') || line.startsWith('}')) return line
  if (line.endsWith('{')) return line
  if (line.endsWith(';')) return line
  const lower = line.toLowerCase()
  for (const kw of ['if ', 'else', 'for ', 'while ', 'do ', 'switch ', 'case ', 'default']) {
    if (lower.startsWith(kw)) return line
  }
  return line + ';'
}

/** Bedingung/Ausdruck für Klammern: mehrzeilig mit Leerzeichen zusammenfassen. */
function conditionText(lines: string[]): string {
  const parts = lines.map((l) => l.trim()).filter((l) => l !== '')
  return stripStructureKeywordPrefix(parts.length === 0 ? 'true' : parts.join(' '))
}

function stripStructureKeywordPrefix(text: string): string {
  const trimmed = text.trim()
  for (const keyword of ['if', 'while', 'until', 'switch']) {
    const stripped = stripKeywordPrefix(keyword, trimmed)
    if (stripped !== undefined) return stripped === '' ? 'true' : stripped
  }
  return trimmed
}

function stripKeywordPrefix(keyword: string, text: string): string | undefined {
  if (!text.toLowerCase().startsWith(keyword)) return undefined
  const after = text.slice(keyword.length)
  if (!(after === '' || /^\s/.test(after) || after[0] === '(')) return undefined
  let content = after.trim()
  if (content.startsWith('(') && content.endsWith(')') && content.length >= 2) content = content.slice(1, -1).trim()
  return content
}

function stripTrailingSemicolon(s: string): string {
  let x = s.trim()
  while (x.endsWith(';')) x = x.slice(0, -1).trim()
  return x
}

// MARK: - Ein-/Ausgabe

/** Diagramm-Präfixe für Ausgabe: `output:` bzw. älteres `print:`. */
function expressionAfterOutputDiagramPrefix(raw: string): string | undefined {
  const t = raw.trim()
  const lower = t.toLowerCase()
  let expr: string
  if (lower.startsWith('output:')) expr = t.slice(7).trim()
  else if (lower.startsWith('print:')) expr = t.slice(6).trim()
  else return undefined
  return expr === '' ? undefined : expr
}

interface InputLineParse {
  type: string
  name: string
  /** Optionaler Eingabe-Hinweis in `"…"`. */
  customPrompt?: string
}

const isIndexedTarget = (p: InputLineParse) => p.name.includes('[') && p.name.includes(']')

/** `input:`-Rest: `int pin`, `int pin "Hinweis"`, Kurzform `pin "Hinweis"` (implizit `int`), bisher `zahl` / `int zahl`. */
function parseInputLineAfterColon(rest: string): InputLineParse | undefined {
  const trimmed = rest.trim()
  if (trimmed === '') return undefined
  const typed = groups(
    /^\s*(integer|int|long|float|double|string|boolean|char|bool)\s+([a-zA-Z_]\w*(?:\s*\[[^\]]+\])?)(?:\s+"([^"]*)")?\s*$/i,
    trimmed,
  )
  if (typed) {
    const name = typed[2].replaceAll(' ', '')
    if (name === '') return undefined
    const c = (typed[3] ?? '').trim()
    return { type: normalizeInputTypeKeyword(typed[1]), name, customPrompt: c === '' ? undefined : c }
  }
  const quoted = groups(/^\s*([a-zA-Z_]\w*(?:\s*\[[^\]]+\])?)\s+"([^"]*)"\s*$/i, trimmed)
  if (quoted) {
    const target = quoted[1].replaceAll(' ', '')
    const notName = ['int', 'integer', 'long', 'float', 'double', 'string', 'boolean', 'char', 'bool', 'void']
    if (notName.includes(target.toLowerCase())) return undefined
    return { type: target.includes('[') ? 'String' : 'int', name: target, customPrompt: quoted[2].trim() }
  }
  const pair = parseInputTypeAndName(trimmed)
  if (pair) return { type: normalizeInputTypeKeyword(pair[0]), name: pair[1] }
  return undefined
}

function normalizeInputTypeKeyword(raw: string): string {
  switch (raw.trim().toLowerCase()) {
    case 'integer':
    case 'int':
      return 'int'
    case 'long': return 'long'
    case 'float': return 'float'
    case 'double': return 'double'
    case 'string': return 'String'
    case 'boolean':
    case 'bool':
      return 'boolean'
    case 'char': return 'char'
    default: return raw
  }
}

/** Nach `input:`: `int zahl` wie bisher, oder Kurzform `zahl` → Typ `int`. */
function parseInputTypeAndName(rest: string): [string, string] | undefined {
  const parts = rest.split(/[ \t]+/).filter(Boolean)
  if (parts.length === 0) return undefined
  if (parts.length >= 2) return [parts[0], parts[1]]
  const incomplete = ['int', 'double', 'string', 'boolean', 'char', 'long', 'float', 'short', 'byte', 'void', 'bool', 'integer']
  if (incomplete.includes(parts[0].toLowerCase())) return undefined
  return ['int', parts[0]]
}

/** Ohne `output:`/`print:`-Präfix: Zeile beginnt mit `"…"` → Ausgabe. */
function emitBareLeadingStringAsPrintIfNeeded(raw: string, target: CodeTarget, indent: number): string | undefined {
  const t = stripTrailingSemicolon(raw).trim()
  if (!t.startsWith('"')) return undefined
  switch (target) {
    case 'java': return sp(indent) + 'System.out.println(' + t + ');\n'
    case 'javascript': return sp(indent) + 'console.log(' + t + ');\n'
    case 'python': return sp(indent) + 'print(' + t + ')\n'
  }
}

/** Zeichenkette für `"…"`-Literale (Java, JavaScript und Python escapen gleich). */
function escapeForDoubleQuotedLiteral(s: string): string {
  return s.replaceAll('\\', '\\\\').replaceAll('"', '\\"').replaceAll('\n', '\\n').replaceAll('\r', '\\r')
}

function inputParseFrom(raw: string): InputLineParse | undefined {
  const t = raw.trim()
  if (!t.toLowerCase().startsWith('input:')) return undefined
  const rest = t.slice(6).trim()
  if (rest === '') return undefined
  return parseInputLineAfterColon(rest)
}

function emitJavaInputLineIfNeeded(raw: string, indent: number): string | undefined {
  const p = inputParseFrom(raw)
  if (!p) return undefined
  const promptText = p.customPrompt ? p.customPrompt : p.name + ': '
  const promptOut = sp(indent) + 'System.out.println("' + escapeForDoubleQuotedLiteral(promptText) + '");\n'
  const decl = (type: string) => (isIndexedTarget(p) ? p.name : `${type} ${p.name}`)
  switch (p.type) {
    case 'int': return promptOut + sp(indent) + `${decl('int')} = scanner.nextInt();\n`
    case 'double': return promptOut + sp(indent) + `${decl('double')} = scanner.nextDouble();\n`
    // `next()` statt `nextLine()` (vermeidet die Newline-Falle nach `nextInt()`).
    case 'String': return promptOut + sp(indent) + `${decl('String')} = scanner.next();\n`
    default: return undefined
  }
}

function emitJavaScriptInputLineIfNeeded(raw: string, indent: number): string | undefined {
  const p = inputParseFrom(raw)
  if (!p) return undefined
  const useCustom = !!p.customPrompt
  // `prompt` trägt den eigenen Hinweis; sonst zusätzlich `console.log`.
  const hint = useCustom ? '' : sp(indent) + 'console.log("' + escapeForDoubleQuotedLiteral(p.name + ': ') + '");\n'
  const promptExpr = (fallback: string) => {
    const label = useCustom ? p.customPrompt! : p.name + ': '
    return `(prompt("${escapeForDoubleQuotedLiteral(label)}") ?? "${fallback}")`
  }
  const target = isIndexedTarget(p) ? p.name : `let ${p.name}`
  switch (p.type) {
    case 'int': return hint + sp(indent) + `${target} = parseInt(${promptExpr('0')}, 10);\n`
    case 'double': return hint + sp(indent) + `${target} = Number(${promptExpr('0')});\n`
    case 'String': return hint + sp(indent) + `${target} = ${promptExpr('')};\n`
    default: return undefined
  }
}

function emitPythonInputLineIfNeeded(raw: string, indent: number): string | undefined {
  const p = inputParseFrom(raw)
  if (!p) return undefined
  const useCustom = !!p.customPrompt
  const hint = useCustom ? '' : sp(indent) + 'print("' + escapeForDoubleQuotedLiteral(p.name + ': ') + '")\n'
  const input = `input("${escapeForDoubleQuotedLiteral(useCustom ? p.customPrompt! : p.name + ': ')}")`
  switch (p.type) {
    case 'int': return hint + sp(indent) + `${p.name} = int(${input})\n`
    case 'double': return hint + sp(indent) + `${p.name} = float(${input})\n`
    case 'String': return hint + sp(indent) + `${p.name} = ${input}\n`
    default: return undefined
  }
}

function emitPrintLineIfNeeded(raw: string, target: CodeTarget, indent: number): string | undefined {
  const expr = expressionAfterOutputDiagramPrefix(raw)
  if (expr === undefined) return undefined
  switch (target) {
    case 'java': return sp(indent) + 'System.out.println(' + expr + ');\n'
    case 'javascript': return sp(indent) + 'console.log(' + expr + ');\n'
    case 'python': return sp(indent) + 'print(' + expr + ')\n'
  }
}

// MARK: - Java-ähnliche Zeilen

/** Kopf einer C-`for`-Schleife: mehrere Felder mit `; `. Eine Zeile bleibt unverändert. */
function cStyleForLoopHeaderText(lines: string[]): string {
  const parts = lines.map(stripTrailingSemicolon).filter((p) => p !== '')
  if (parts.length === 0) return ';;'
  return parts.join('; ')
}

function javaScriptForLoopHeaderText(lines: string[]): string {
  const header = cStyleForLoopHeaderText(lines)
  const parts = header.split(';')
  const translated = javaScriptForInitializerFromJavaTypedDeclaration(parts[0])
  if (translated !== undefined) parts[0] = translated
  return parts.join(';')
}

function javaScriptForInitializerFromJavaTypedDeclaration(raw: string): string | undefined {
  const g = groups(/^(\s*)(?:integer|int|long|float|double|string|boolean|char|bool)\s+(\w+)(?:\s*=\s*(.*))?\s*$/i, raw)
  if (!g) return undefined
  const name = g[2].trim()
  if (name === '') return undefined
  const rhs = (g[3] ?? '').trim()
  if (raw.includes('=') && rhs !== '') return g[1] + `let ${name} = ${rhs}`
  return g[1] + `let ${name}`
}

function parseJavaStyleForInit(s: string): { name: string; value: number } | undefined {
  for (const re of [/^\s*(?:int|long)\s+(\w+)\s*=\s*(-?\d+)\s*$/, /^\s*(\w+)\s*=\s*(-?\d+)\s*$/]) {
    const g = groups(re, s)
    if (g) return { name: g[1], value: Number(g[2]) }
  }
  return undefined
}

function parseJavaStyleForCondition(s: string, expectedVar: string): string | undefined {
  let g = groups(/^\s*(\w+)\s*<\s*(\d+)\s*$/, s)
  if (g && g[1] === expectedVar) return String(Number(g[2]))
  g = groups(/^\s*(\w+)\s*<=\s*(\d+)\s*$/, s)
  if (g && g[1] === expectedVar) return String(Number(g[2]) + 1)
  g = groups(/^\s*(\w+)\s*<\s*([a-zA-Z_]\w*)\.length(?:\(\))?\s*$/, s)
  if (g && g[1] === expectedVar) return `len(${g[2]})`
  return undefined
}

function isJavaStyleSimpleIncrement(s: string, varName: string): boolean {
  const g = groups(/^\s*(\w+)\s*\+\+\s*$/, s) ?? groups(/^\s*(\w+)\s*\+=\s*1\s*$/, s)
  return g?.[1] === varName
}

/** Aus drei Java-ähnlichen Zeilen → `for name in range(…):`, wenn die Heuristik passt. */
function pythonForLineFromJavaLikeLoopFields(lines: string[]): string | undefined {
  const raw = lines.map((l) => stripTrailingSemicolon(l).trim())
  if (raw.filter((r) => r !== '').length <= 1) return undefined
  const parts = raw.slice(0, 3)
  while (parts.length < 3) parts.push('')
  const [initS, condS, stepS] = parts
  if (initS === '' || condS === '' || stepS === '') return undefined
  const init = parseJavaStyleForInit(initS)
  if (!init) return undefined
  const stop = parseJavaStyleForCondition(condS, init.name)
  if (stop === undefined || !isJavaStyleSimpleIncrement(stepS, init.name)) return undefined
  return init.value === 0 ? `for ${init.name} in range(${stop}):` : `for ${init.name} in range(${init.value}, ${stop}):`
}

interface ConstTypedLineParse {
  rawType: string
  name: string
  rhs?: string
}

/** `const int PIN` bzw. `const double PI = 3.14`. */
function parseConstTypedLine(rawLine: string): ConstTypedLineParse | undefined {
  const line = stripTrailingSemicolon(rawLine).trim()
  if (line === '') return undefined
  const g = groups(/^\s*const\s+(integer|int|long|float|double|string|boolean|char|bool)\s+(\w+)(?:\s*=\s*(.*))?$/i, line)
  if (!g) return undefined
  const name = g[2].trim()
  if (name === '') return undefined
  if (!line.includes('=')) return { rawType: g[1].trim(), name }
  const rhs = (g[3] ?? '').trim()
  if (rhs === '') return undefined
  return { rawType: g[1].trim(), name, rhs }
}

function emitConstTypedLineIfNeeded(raw: string, target: CodeTarget, indent: number): string | undefined {
  const p = parseConstTypedLine(raw)
  if (!p) return undefined
  const jt = normalizeInputTypeKeyword(p.rawType)
  const r = p.rhs?.trim()
  switch (target) {
    case 'java':
      return sp(indent) + formatCStyleStatementLine(r ? `final ${jt} ${p.name} = ${r}` : `final ${jt} ${p.name}`) + '\n'
    case 'javascript':
      if (r) return sp(indent) + formatCStyleStatementLine(`const ${p.name} = ${r}`) + '\n'
      // `const` verlangt in JS einen Initialwert.
      return sp(indent) + `let ${p.name};  // from diagram: const ${jt} ${p.name}\n`
    case 'python':
      if (r) return sp(indent) + `${p.name} = ${pythonRhsFromJavaRhs(r)}  # const ${jt}\n`
      return sp(indent) + `${p.name} = None  # const ${jt}, uninitialized\n`
  }
}

/** Eine Zeile `Typ name = ausdruck` (Schulsyntax). */
function parseJavaStyleSimpleAssignment(rawLine: string): { name: string; rhs: string; isArray: boolean } | undefined {
  const line = stripTrailingSemicolon(rawLine).trim()
  if (line === '') return undefined
  // `integer` vor `int`, damit nicht nur der Präfix `int` von `integer` passt.
  const g = groups(
    /^\s*(?:integer|int|long|float|double|string|boolean|char|bool)(?:\s*\[\s*\]\s+(\w+)|\s+(\w+)(\s*\[\s*\])?)\s*=\s*(.*)$/i,
    line,
  )
  if (!g) return undefined
  const name = g[1] === '' ? g[2] : g[1]
  const rhs = g[4].trim()
  if (rhs === '') return undefined
  return { name, rhs, isArray: g[1] !== '' || g[3] !== '' }
}

function javaIntCastExpression(rhs: string): string | undefined {
  const g = groups(/^\s*\(\s*int(?:eger)?\s*\)\s*\(?\s*(.+?)\s*\)?\s*$/i, rhs)
  const e = g?.[1].trim()
  return e ? e : undefined
}

function pythonRhsFromJavaRhs(rhs: string): string {
  const t = rhs.trim()
  if (t === 'null') return 'None'
  const cast = javaIntCastExpression(t)
  if (cast !== undefined) return `int(${pythonRhsFromJavaRhs(cast)})`
  return t.replace(/\bMath\.random\s*\(\s*\)/gi, 'random.random()')
}

const normalizeJavaScriptMathRandomCall = (s: string) => s.replace(/\bMath\.random\b(?!\s*\()/gi, 'Math.random()')

function arrayLiteralFromJavaInitializer(rhs: string): string {
  const t = rhs.trim()
  return t.startsWith('{') && t.endsWith('}') ? '[' + t.slice(1, -1) + ']' : rhs
}

function javaNewArraySizeExpression(rhs: string): string | undefined {
  const g = groups(/^\s*new\s+(?:byte|short|int|long|float|double|boolean|char|string)\s*\[\s*(.+)\s*\]\s*$/i, rhs)
  const size = g?.[1].trim()
  return size ? size : undefined
}

function javaScriptRhsFromJavaRhs(rhs: string, isArray: boolean): string {
  const t = rhs.trim()
  if (isArray) {
    const size = javaNewArraySizeExpression(t)
    return size !== undefined ? `new Array(${size})` : arrayLiteralFromJavaInitializer(t)
  }
  const cast = javaIntCastExpression(t)
  if (cast !== undefined) return `Math.floor(${javaScriptRhsFromJavaRhs(cast, false)})`
  return normalizeJavaScriptMathRandomCall(t)
}

function pythonRhsFromJavaRhsArray(rhs: string, isArray: boolean): string {
  const t = rhs.trim()
  if (isArray) {
    const size = javaNewArraySizeExpression(t)
    return size !== undefined ? `[None] * ${size}` : arrayLiteralFromJavaInitializer(t)
  }
  return pythonRhsFromJavaRhs(t)
}

/** JavaScript: `int x = 5` → `let x = 5;`. Python: `x = 5`. Java: allgemeiner Pfad. */
function emitTranslatedJavaLikeAssignmentIfNeeded(raw: string, target: CodeTarget, indent: number): string | undefined {
  if (target === 'java') return undefined
  const p = parseJavaStyleSimpleAssignment(raw)
  if (!p) return undefined
  if (target === 'javascript') {
    return sp(indent) + formatCStyleStatementLine(`let ${p.name} = ${javaScriptRhsFromJavaRhs(p.rhs, p.isArray)}`) + '\n'
  }
  return sp(indent) + `${p.name} = ${pythonRhsFromJavaRhsArray(p.rhs, p.isArray)}\n`
}

function walkElements(elements: VSElement[], visit: (e: VSElement) => void) {
  for (const e of elements) {
    visit(e)
    if (e.loopBody) walkElements(e.loopBody, visit)
    for (const c of e.cases ?? []) walkElements(c.elements, visit)
  }
}

function inferIntegerVariablesForJavaScript(doc: VSDocument): Set<string> {
  const isIntegerType = (t: string) => ['int', 'integer', 'long', 'short', 'byte'].includes(t.trim().toLowerCase())
  const out = new Set<string>()
  walkElements(doc.elements, (e) => {
    for (const raw of e.textLines) {
      const t = raw.trim()
      if (t === '') continue
      if (t.toLowerCase().startsWith('input:')) {
        const p = parseInputLineAfterColon(t.slice(6).trim())
        // Array-Ziele ignorieren (z. B. a[i]).
        if (p && isIntegerType(p.type) && !p.name.includes('[')) out.add(p.name)
        continue
      }
      const c = parseConstTypedLine(t)
      if (c && isIntegerType(c.rawType)) {
        out.add(c.name)
        continue
      }
      const g = groups(/^\s*(integer|int|long|short|byte)\s+([a-zA-Z_]\w*)\s*=/i, t)
      if (g) out.add(g[2].trim())
    }
  })
  return out
}

function javaScriptIntegerDivisionIfNeeded(raw: string, intVariables: Set<string>): string | undefined {
  const t = stripTrailingSemicolon(raw).trim()
  if (t === '') return undefined
  // x = x / y (einfaches Muster, ohne weitere Operatoren)
  const g = groups(/^\s*([a-zA-Z_]\w*)\s*=\s*([a-zA-Z_]\w*|\d+)\s*\/\s*([a-zA-Z_]\w*|\d+)\s*$/, t)
  if (g) {
    const [, lhs, a, b] = g
    if (!intVariables.has(lhs) || lhs !== a) return undefined
    return `${lhs} = Math.floor(${a} / ${b})`
  }
  const g2 = groups(/^\s*([a-zA-Z_]\w*)\s*\/=\s*([a-zA-Z_]\w*|\d+)\s*$/, t)
  if (g2 && intVariables.has(g2[1])) return `${g2[1]} = Math.floor(${g2[1]} / ${g2[2]})`
  return undefined
}

function documentContainsJavaInput(doc: VSDocument): boolean {
  let found = false
  walkElements(doc.elements, (e) => {
    if (e.type === ElementType.anweisung && e.textLines.some((l) => l.trim().toLowerCase().startsWith('input:'))) found = true
  })
  return found
}

function documentContainsJavaMathRandom(doc: VSDocument): boolean {
  let found = false
  walkElements(doc.elements, (e) => {
    if (e.textLines.some((l) => /\bMath\.random\s*\(/i.test(l))) found = true
  })
  return found
}

function caseLabelToken(name: string, target: CodeTarget): string {
  const t = name.trim()
  if (t === '') return target === 'python' ? '""' : '0'
  if (target === 'java' || /^\p{N}+$/u.test(t)) return t
  return '"' + t.replaceAll('"', '\\"') + '"'
}

function forcedCaseComment(name: string, target: CodeTarget): string {
  const t = name.trim()
  if (t === '') return ''
  switch (target) {
    case 'java': return '/* ' + t + ' */'
    case 'python': return '  # ' + t
    case 'javascript': return ' /* ' + t + ' */'
  }
}

// MARK: - Ausgabe der Elemente

function emitInstructionLike(textLines: string[], target: CodeTarget, options: CodeOptions, indent: number, sink: Sink) {
  const body = textLines.map((l) => l.trim())
  if (body.every((l) => l === '')) return
  if (options.includeDiagramTextAsComments) {
    const forDiagram = body.filter((l) => l !== '' && !isDiagramEmptyPlaceholderText(l))
    if (forDiagram.length > 0) sink.out += blockComment(forDiagram, target, indent)
  }
  for (const raw of body) {
    if (raw === '') continue
    if (isDiagramEmptyPlaceholderText(raw)) {
      sink.out += emptyElementCommentLine(indent, target)
      continue
    }
    const special =
      (target === 'java' ? emitJavaInputLineIfNeeded(raw, indent) : undefined) ??
      (target === 'javascript' ? emitJavaScriptInputLineIfNeeded(raw, indent) : undefined) ??
      (target === 'python' ? emitPythonInputLineIfNeeded(raw, indent) : undefined) ??
      emitPrintLineIfNeeded(raw, target, indent) ??
      emitConstTypedLineIfNeeded(raw, target, indent) ??
      emitTranslatedJavaLikeAssignmentIfNeeded(raw, target, indent) ??
      emitBareLeadingStringAsPrintIfNeeded(raw, target, indent)
    if (special !== undefined) {
      sink.out += special
      continue
    }
    let line = raw
    if (isCStyleSemicolonTarget(target)) {
      const transformed =
        target === 'javascript' ? javaScriptIntegerDivisionIfNeeded(raw, options.jsIntVariables ?? new Set()) : undefined
      line = formatCStyleStatementLine(transformed ?? raw)
    }
    if (line === '') continue
    sink.out += sp(indent) + line + '\n'
  }
}

function emitConditionHeader(
  prefix: string,
  suffix: string,
  textLines: string[],
  target: CodeTarget,
  options: CodeOptions,
  indent: number,
  sink: Sink,
) {
  if (options.includeDiagramTextAsComments) sink.out += blockComment(textLines, target, indent)
  sink.out += sp(indent) + prefix + conditionText(textLines) + suffix
}

/** Leere Blöcke: Python braucht `pass`. */
function emitBlockBody(elements: VSElement[], target: CodeTarget, options: CodeOptions, indent: number, sink: Sink) {
  if (elements.length === 0) {
    if (target === 'python') sink.out += sp(indent) + 'pass\n'
    return
  }
  for (const el of elements) emit(el, target, options, indent, sink)
}

function emit(element: VSElement, target: CodeTarget, options: CodeOptions, indent: number, sink: Sink) {
  const step = options.indentPerLevel
  const py = target === 'python'
  const body = (els: VSElement[], i: number) => emitBlockBody(els, target, options, i, sink)
  const header = (prefix: string, suffix: string) =>
    emitConditionHeader(prefix, suffix, element.textLines, target, options, indent, sink)
  const commentIfWanted = (i = indent) => {
    if (options.includeDiagramTextAsComments) sink.out += blockComment(element.textLines, target, i)
  }

  switch (element.type) {
    case ElementType.leerElement:
      sink.out += emptyElementCommentLine(indent, target)
      return

    case ElementType.anweisung:
    case ElementType.aufruf:
      emitInstructionLike(element.textLines, target, options, indent, sink)
      return

    case ElementType.aussprung: {
      const hint = conditionText(element.textLines)
      if (element.textLines.some((l) => l.trim() !== '')) commentIfWanted()
      if (py) sink.out += sp(indent) + (hint === '' ? 'break\n' : `break  # ${hint}\n`)
      else sink.out += sp(indent) + (hint === '' ? 'break;\n' : `break; // ${hint}\n`)
      return
    }

    case ElementType.verzweigung: {
      const cases = element.cases
      if (!cases || cases.length < 2) return
      const omitElse = !options.includeEmptyElseBranch && isIfElseFalseBranchVisuallyEmpty(cases[1].elements)
      if (py) {
        header('if ', ':\n')
        body(cases[0].elements, indent + step)
        if (!omitElse) {
          sink.out += sp(indent) + 'else:\n'
          body(cases[1].elements, indent + step)
        }
      } else {
        header('if (', ') {\n')
        body(cases[0].elements, indent + step)
        if (omitElse) {
          sink.out += sp(indent) + '}\n'
        } else {
          sink.out += sp(indent) + '} else {\n'
          body(cases[1].elements, indent + step)
          sink.out += sp(indent) + '}\n'
        }
      }
      return
    }

    case ElementType.fallauswahl: {
      const cases = element.cases
      if (!cases || cases.length === 0) return
      header(py ? 'match ' : 'switch (', py ? ':\n' : ') {\n')
      cases.forEach((c, i) => {
        const isLast = i === cases.length - 1
        if (target === 'java') {
          const label = isLast
            ? 'default -> { ' + forcedCaseComment(c.name, target) + '\n'
            : 'case ' + caseLabelToken(c.name, target) + ' -> {\n'
          sink.out += sp(indent + step) + label
          body(c.elements, indent + step * 2)
          sink.out += sp(indent + step) + '}\n'
        } else if (py) {
          const line = isLast ? 'case _:' + forcedCaseComment(c.name, target) : 'case ' + caseLabelToken(c.name, target) + ':'
          sink.out += sp(indent + step) + line + '\n'
          body(c.elements, indent + step * 2)
        } else {
          const line = isLast ? 'default:' + forcedCaseComment(c.name, target) : 'case ' + caseLabelToken(c.name, target) + ':'
          sink.out += sp(indent + step) + line + '\n'
          body(c.elements, indent + step * 2)
          // Immer `break;`: kein Fallthrough.
          sink.out += sp(indent + step * 2) + 'break;\n'
        }
      })
      if (!py) sink.out += sp(indent) + '}\n'
      return
    }

    case ElementType.forSchleife:
      if (target === 'java') {
        commentIfWanted()
        sink.out += sp(indent) + 'for (' + cStyleForLoopHeaderText(element.textLines) + ') {\n'
      } else if (py) {
        const pyLine = pythonForLineFromJavaLikeLoopFields(element.textLines)
        if (pyLine !== undefined) {
          commentIfWanted()
          sink.out += sp(indent) + pyLine + '\n'
        } else {
          header('for ', ':\n')
        }
      } else {
        commentIfWanted()
        sink.out += sp(indent) + 'for (' + javaScriptForLoopHeaderText(element.textLines) + ') {\n'
      }
      body(element.loopBody ?? [], indent + step)
      if (!py) sink.out += sp(indent) + '}\n'
      return

    case ElementType.whileSchleife:
      header(py ? 'while ' : 'while (', py ? ':\n' : ') {\n')
      body(element.loopBody ?? [], indent + step)
      if (!py) sink.out += sp(indent) + '}\n'
      return

    case ElementType.doUntilSchleife: {
      const cond = conditionText(element.textLines)
      if (py) {
        sink.out += sp(indent) + 'while True:\n'
        const bodyStart = indent + step
        body(element.loopBody ?? [], bodyStart)
        commentIfWanted(bodyStart)
        sink.out += sp(bodyStart) + 'if not (' + cond + '):\n'
        sink.out += sp(bodyStart + step) + 'break\n'
      } else {
        sink.out += sp(indent) + 'do {\n'
        body(element.loopBody ?? [], indent + step)
        commentIfWanted()
        sink.out += sp(indent) + '} while (' + cond + ');\n'
      }
      return
    }

    case ElementType.endlosschleife: {
      const extra = conditionText(element.textLines)
      const plain = extra === '' || extra === 'true'
      if (!plain) commentIfWanted()
      if (py) sink.out += sp(indent) + (plain ? 'while True:\n' : `while True:  # ${extra}\n`)
      else sink.out += sp(indent) + (plain ? 'while (true) {\n' : `while (true) /* ${extra} */ {\n`)
      body(element.loopBody ?? [], indent + step)
      if (!py) sink.out += sp(indent) + '}\n'
      return
    }
  }
}

// MARK: - Nachbearbeitung: `.length` / `.length()` zielsprachentauglich (Heuristik)

function postProcessLengthSyntax(s: string, target: CodeTarget): string {
  switch (target) {
    case 'javascript':
      return s.replace(/\.length\(\)/g, '.length')
    case 'python':
      return s.replace(/\b([a-zA-Z_]\w*)\.length(?:\(\))?\b/g, 'len($1)')
    case 'java':
      return replaceIdentifierDotLengthWithParensInJava(s)
  }
}

function javaArrayDeclarationNames(s: string): Set<string> {
  const type = '(?:byte|short|int|long|float|double|boolean|char|String)'
  const patterns = [
    new RegExp(`\\b(?:final\\s+)?${type}\\s*\\[\\s*\\]\\s+([a-zA-Z_]\\w*)\\b`, 'g'),
    new RegExp(`\\b(?:final\\s+)?${type}\\s+([a-zA-Z_]\\w*)\\s*\\[\\s*\\]`, 'g'),
  ]
  const names = new Set<string>()
  for (const re of patterns) for (const m of s.matchAll(re)) names.add(m[1].toLowerCase())
  return names
}

/** `String`: `s.length()`; Array: `a.length` — nur wenn `a` im erzeugten Code als Array deklariert ist. */
function replaceIdentifierDotLengthWithParensInJava(s: string): string {
  const arrays = javaArrayDeclarationNames(s)
  return s.replace(/\b([a-zA-Z_]\w*)\.length(?!\()/g, (m, id: string) => (arrays.has(id.toLowerCase()) ? m : `${id}.length()`))
}

// MARK: - Java: vollständige Klasse (.java)

const javaReserved = new Set(
  (
    'abstract assert boolean break byte case catch char class const continue default do double else enum extends final ' +
    'finally float for goto if implements import instanceof int interface long native new package private protected ' +
    'public return short static strictfp super switch synchronized this throw throws transient try void volatile while ' +
    'true false null var record sealed permits yield module open opens requires exports to uses provides with transitive'
  ).split(' '),
)

/** Gültiger Java-Klassenname aus freiem Text (z. B. Diagrammtitel). */
export function sanitizedJavaClassName(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed === '') return 'Main'
  let result = ''
  Array.from(trimmed).forEach((ch, idx) => {
    if (idx === 0) {
      if (/\p{L}/u.test(ch) || ch === '_' || ch === '$') result += ch
      else if (/\p{Nd}/u.test(ch)) result += '_' + ch
      else result += '_'
    } else if (/[\p{L}\p{M}\p{N}]/u.test(ch) || ch === '_' || ch === '$') {
      result += ch
    } else {
      result += '_'
    }
  })
  result = result.replace(/_{2,}/g, '_').replace(/^_+|_+$/g, '')
  if (result === '') return 'Main'
  // Das Trimmen oben entfernt auch den `_` vor einer führenden Ziffer.
  if (/^\p{Nd}/u.test(result)) result = '_' + result
  if (javaReserved.has(result.toLowerCase())) result = '_' + result
  return result
}

/** Vollständige `.java`-Datei: `public class` mit `main`, erzeugtes Snippet eingerückt im Rumpf. */
export function generateJavaClassFile(document: VSDocument, className: string, options: Partial<CodeOptions> = {}): string {
  const opts = { ...defaultCodeOptions, ...options }
  const name = sanitizedJavaClassName(className)
  const snippet = generateCode(document, 'java', opts)
  const innerBase = opts.indentPerLevel * 2
  const hasInput = documentContainsJavaInput(document)
  const bodyNoPrelude = hasInput ? stripJavaSnippetScannerPrelude(snippet) : snippet
  const prefix = sp(innerBase)
  const indentedBody =
    bodyNoPrelude.trim() === ''
      ? ''
      : bodyNoPrelude
          .split('\n')
          .map((line) => (line.trim() === '' ? prefix : prefix + line))
          .join('\n')

  let out = ''
  if (hasInput) out += 'import java.util.Scanner;\n\n'
  out += `public class ${name} {\n`
  out += sp(opts.indentPerLevel) + 'public static void main(String[] args) {\n'
  if (hasInput) {
    out += sp(innerBase) + 'Scanner scanner = new Scanner(System.in);\n'
    if (indentedBody !== '') out += '\n'
  }
  out += indentedBody
  if (indentedBody !== '' && !indentedBody.endsWith('\n')) out += '\n'
  out += sp(opts.indentPerLevel) + '}\n'
  out += '}\n'
  return out
}

/** Entfernt die im Snippet-Modus vorangestellte Scanner-Zeile (und den Kommentar-„Import“). */
function stripJavaSnippetScannerPrelude(snippet: string): string {
  const lines = snippet.split('\n')
  let i = 0
  if (lines[i] === '// import java.util.Scanner;') i++
  while (i < lines.length && lines[i].trim() === '') i++
  if (lines[i] === 'Scanner scanner = new Scanner(System.in);') i++
  while (i < lines.length && lines[i].trim() === '') i++
  return i >= lines.length ? '' : lines.slice(i).join('\n')
}
