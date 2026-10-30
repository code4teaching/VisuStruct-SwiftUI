/**
 * Port von `VisuStructCodeGenerator.swift` und `CodeGeneration/*.swift`:
 * Quellcode (Java, Python, JavaScript) aus dem Struktogramm.
 */
import { ElementType, type VSDocument, type VSElement } from './model'
import { parseSubprogramHeader, type SubprogramHeader } from './simulation'

export type CodeTarget = 'java' | 'python' | 'javascript'

export interface CodeOptions {
  baseIndent: number
  indentPerLevel: number
  /** Diagramm-Texte zusätzlich als Kommentar (`/* … *\/` bzw. `""" … """`). */
  includeDiagramTextAsComments: boolean
  /** `else` auch ausgeben, wenn der Nein-Zweig nur leer (ø) ist. */
  includeEmptyElseBranch: boolean
  /** Kommentar über dem Code, wenn das Diagramm als Pseudocode markiert ist. */
  pseudocodeNote: string
  /** Interner Heuristik-Kontext für JavaScript und Python (Ganzzahldivision). */
  jsIntVariables?: Set<string>
  /** Elementtyp deklarierter Arrays (`int[] zahlen` → `int`), für Eingaben in `zahlen[i]`. */
  arrayElementTypes?: Map<string, string>
  /** Text-Variablen: In Python ohne `str(…)` verketten. */
  stringVariables?: Set<string>
  /** Python ohne `match` (MicroPython auf dem mBot2 kennt es nicht): Fallauswahl als `if`/`elif`/`else`. */
  pythonWithoutMatch?: boolean
  /** Nur für die Ansicht „Code live“: graue Platzhalter statt `true`/„empty element“, Zeilen je Element. */
  live?: LiveContext
}

export const defaultCodeOptions: CodeOptions = {
  baseIndent: 0,
  indentPerLevel: 4,
  includeDiagramTextAsComments: false,
  includeEmptyElseBranch: true,
  pseudocodeNote: 'Pseudocode – not a runnable program',
}

/**
 * `subprograms`: Unterprogramme mit Kopfzeile aus anderen Reitern. Python und JavaScript stellen ihre
 * Definitionen vor das Hauptprogramm; in Java gehören sie als Methoden in die Klasse (`generateJavaClassFile`).
 */
export function generateCode(
  document: VSDocument,
  target: CodeTarget,
  options: Partial<CodeOptions> = {},
  subprograms: VSDocument[] = [],
): string {
  const opts = documentOptions(document, target, options)
  let out = ''
  // Schul-tauglich: Strict-Modus immer am Anfang des Snippets.
  if (target === 'javascript') out += '"use strict";\n\n'
  const all = [document, ...(target === 'java' ? [] : subprograms)]
  if (target === 'python' && all.some(documentContainsJavaMathRandom)) out += 'import random\n\n'
  if (target !== 'java') out += fileHelperClasses(all, target)
  if (target === 'java' && documentContainsJavaInput(document)) {
    // Snippet-Modus: Import als Kommentar (damit es auch beim Einfügen in `main` nicht „falsch“ steht).
    out += '// import java.util.Scanner;\n'
    out += 'Scanner scanner = new Scanner(System.in);\n\n'
  }
  // Nach Import/Scanner, damit die Java-Klasse den Vorspann weiterhin erkennt.
  if (document.pseudocode) out += (target === 'python' ? '# ' : '// ') + opts.pseudocodeNote + '\n\n'
  if (target !== 'java') {
    for (const sub of subprograms) {
      if (sub === document) continue
      const header = parseSubprogramHeader(sub.caption)
      if (header) out += subprogramDefinition(sub, header, target, options, 0) + '\n'
    }
  }
  const header = parseSubprogramHeader(document.caption)
  const sink = { out: '' }
  if (header) sink.out = subprogramDefinition(document, header, target, options, opts.baseIndent)
  else for (const el of document.elements) emit(el, target, opts, opts.baseIndent, sink)
  out += sink.out
  if (out.trim() === '') {
    const empty = commentPrefix(target, true)
    return target === 'javascript' ? '"use strict";\n\n' + empty : empty
  }
  return postProcessLengthSyntax(out.replace(/^[\n\r]+|[\n\r]+$/g, ''), target)
}

function documentOptions(document: VSDocument, target: CodeTarget, options: Partial<CodeOptions>): CodeOptions {
  const opts: CodeOptions = {
    ...defaultCodeOptions,
    ...options,
    jsIntVariables: new Set(),
    arrayElementTypes: inferArrayElementTypes(document),
    stringVariables: inferStringVariables(document),
  }
  if (target !== 'java') opts.jsIntVariables = inferIntegerVariables(document)
  return opts
}

const javaTypeName = (type: SubprogramHeader['returnType']) =>
  type === 'string' ? 'String' : type === undefined ? 'void' : type

function javaMethodHeader(header: SubprogramHeader): string {
  const params = header.params.map((p) => `${javaTypeName(p.type)}${'[]'.repeat(p.dims ?? 0)} ${p.name}`).join(', ')
  return `public static ${javaTypeName(header.returnType)} ${header.name}(${params}) {`
}

/** Kopfzeile wie `int quadrat(int x)` als Java-Methode, Python-`def` oder JavaScript-`function`. */
function subprogramDefinition(
  document: VSDocument,
  header: SubprogramHeader,
  target: CodeTarget,
  options: Partial<CodeOptions>,
  indent: number,
): string {
  const opts = documentOptions(document, target, options)
  for (const p of header.params) {
    if (p.dims) continue
    if (p.type === 'int') opts.jsIntVariables!.add(p.name)
    if (p.type === 'string') opts.stringVariables!.add(p.name)
  }
  const names = header.params.map((p) => p.name).join(', ')
  const sink = { out: '' }
  for (const el of document.elements) emit(el, target, opts, indent + opts.indentPerLevel, sink)
  if (sink.out.trim() === '') sink.out = sp(indent + opts.indentPerLevel) + (target === 'python' ? 'pass\n' : '\n')
  switch (target) {
    case 'java':
      return `${sp(indent)}${javaMethodHeader(header)}\n${sink.out}${sp(indent)}}\n`
    case 'python':
      return `${sp(indent)}def ${header.name}(${names}):\n${sink.out}`
    case 'javascript':
      return `${sp(indent)}function ${header.name}(${names}) {\n${sink.out}${sp(indent)}}\n`
  }
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
function emitBareLeadingStringAsPrintIfNeeded(
  raw: string,
  target: CodeTarget,
  indent: number,
  intVariables: Set<string>,
  stringVariables: Set<string>,
): string | undefined {
  const t = stripTrailingSemicolon(raw).trim()
  if (!t.startsWith('"')) return undefined
  switch (target) {
    case 'java': return sp(indent) + 'System.out.println(' + t + ');\n'
    case 'javascript': return sp(indent) + 'console.log(' + t + ');\n'
    case 'python': return sp(indent) + 'print(' + pythonConcatenation(t, intVariables, stringVariables) + ')\n'
  }
}

/** Zeichenkette für `"…"`-Literale (Java, JavaScript und Python escapen gleich). */
function escapeForDoubleQuotedLiteral(s: string): string {
  return s.replaceAll('\\', '\\\\').replaceAll('"', '\\"').replaceAll('\n', '\\n').replaceAll('\r', '\\r')
}

function inputParseFrom(raw: string, arrayTypes: Map<string, string>): InputLineParse | undefined {
  const t = raw.trim()
  if (!t.toLowerCase().startsWith('input:')) return undefined
  const rest = t.slice(6).trim()
  if (rest === '') return undefined
  const p = parseInputLineAfterColon(rest)
  // Kurzform `input: zahlen[i]`: Typ aus der Array-Deklaration statt immer `String`.
  if (p && isIndexedTarget(p) && !/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s/i.test(rest)) {
    const declared = arrayTypes.get(p.name.slice(0, p.name.indexOf('[')).trim())
    if (declared) return { ...p, type: declared }
  }
  return p
}

function inferStringVariables(doc: VSDocument): Set<string> {
  const out = new Set<string>()
  walkElements(doc.elements, (e) => {
    for (const raw of e.textLines) {
      const t = raw.trim()
      if (t.toLowerCase().startsWith('input:')) {
        const p = parseInputLineAfterColon(t.slice(6).trim())
        if (p?.type === 'String' && !isIndexedTarget(p)) out.add(p.name)
        continue
      }
      const g = groups(/^\s*(?:const\s+)?string\s+([a-zA-Z_]\w*)\s*=/i, t)
      if (g) out.add(g[1])
      // String-Arrays als `name[]`, damit `spalten[i] + 1` in Python Text bleibt.
      const a = groups(/^\s*string\s*\[\s*\]\s*([a-zA-Z_]\w*)\s*=/i, t)
      if (a) out.add(a[1] + '[]')
    }
  })
  return out
}

function inferArrayElementTypes(doc: VSDocument): Map<string, string> {
  const out = new Map<string, string>()
  walkElements(doc.elements, (e) => {
    for (const raw of e.textLines) {
      const g =
        groups(/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s*\[\s*\]\s*([a-zA-Z_]\w*)/i, raw) ??
        groups(/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s+([a-zA-Z_]\w*)\s*\[\s*\]/i, raw)
      if (g) out.set(g[2], normalizeInputTypeKeyword(g[1]))
    }
  })
  return out
}

function emitJavaInputLineIfNeeded(raw: string, indent: number, arrayTypes: Map<string, string>): string | undefined {
  const p = inputParseFrom(raw, arrayTypes)
  if (!p) return undefined
  const promptText = p.customPrompt ? p.customPrompt : p.name + ': '
  const promptOut = sp(indent) + 'System.out.println("' + escapeForDoubleQuotedLiteral(promptText) + '");\n'
  const decl = (type: string) => (isIndexedTarget(p) ? p.name : `${type} ${p.name}`)
  switch (p.type) {
    case 'int': return promptOut + sp(indent) + `${decl('int')} = scanner.nextInt();\n`
    case 'double': return promptOut + sp(indent) + `${decl('double')} = scanner.nextDouble();\n`
    // `next()` statt `nextLine()` (vermeidet die Newline-Falle nach `nextInt()`).
    case 'String': return promptOut + sp(indent) + `${decl('String')} = scanner.next();\n`
    case 'boolean': return promptOut + sp(indent) + `${decl('boolean')} = scanner.nextBoolean();\n`
    default: return undefined
  }
}

function emitJavaScriptInputLineIfNeeded(raw: string, indent: number, arrayTypes: Map<string, string>): string | undefined {
  const p = inputParseFrom(raw, arrayTypes)
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
    case 'boolean': return hint + sp(indent) + `${target} = ${promptExpr('')}.trim().toLowerCase() === "true";\n`
    default: return undefined
  }
}

function emitPythonInputLineIfNeeded(raw: string, indent: number, arrayTypes: Map<string, string>): string | undefined {
  const p = inputParseFrom(raw, arrayTypes)
  if (!p) return undefined
  const useCustom = !!p.customPrompt
  const hint = useCustom ? '' : sp(indent) + 'print("' + escapeForDoubleQuotedLiteral(p.name + ': ') + '")\n'
  const input = `input("${escapeForDoubleQuotedLiteral(useCustom ? p.customPrompt! : p.name + ': ')}")`
  switch (p.type) {
    case 'int': return hint + sp(indent) + `${p.name} = int(${input})\n`
    case 'double': return hint + sp(indent) + `${p.name} = float(${input})\n`
    case 'String': return hint + sp(indent) + `${p.name} = ${input}\n`
    case 'boolean': return hint + sp(indent) + `${p.name} = ${input}.strip().lower() in ("true", "wahr")\n`
    default: return undefined
  }
}

// MARK: - Dateien

const fileName = String.raw`("(?:[^"\\]|\\.)*"|[A-Za-z_]\w*)`
const fileReaders: [RegExp, string][] = [
  [new RegExp(String.raw`^new\s+Scanner\s*\(\s*new\s+File\s*\(\s*${fileName}\s*\)\s*\)$`), 'Scanner'],
  [new RegExp(String.raw`^new\s+BufferedReader\s*\(\s*new\s+FileReader\s*\(\s*${fileName}\s*\)\s*\)$`), 'BufferedReader'],
  [new RegExp(String.raw`^new\s+PrintWriter\s*\(\s*(?:new\s+(?:File|FileWriter)\s*\(\s*)?${fileName}\s*\)?\s*\)$`), 'PrintWriter'],
]

/** `new Scanner(new File("a.txt"))` → `Scanner`, `"a.txt"`; ebenso `BufferedReader` und `PrintWriter`. */
export function fileConstructor(rhs: string): { kind: 'Scanner' | 'BufferedReader' | 'PrintWriter'; name: string } | undefined {
  const t = rhs.trim()
  for (const [re, kind] of fileReaders) {
    const m = re.exec(t)
    if (m) return { kind: kind as 'Scanner', name: m[1] }
  }
  return undefined
}

/**
 * Python und JavaScript kennen `Scanner`, `BufferedReader` und `PrintWriter` nicht; der erzeugte Code bekommt kleine
 * Klassen mit denselben Methodennamen (siehe `fileHelperClasses`). Hier: Anlegen, `println`/`print` und `Files.writeString`.
 */
function emitFileLineIfNeeded(
  raw: string,
  target: CodeTarget,
  indent: number,
  intVariables: Set<string>,
  stringVariables: Set<string>,
): string | undefined {
  if (target === 'java') return undefined
  const t = stripTrailingSemicolon(raw).trim()
  const decl = /^(?:(?:Scanner|BufferedReader|PrintWriter)\s+)?([A-Za-z_]\w*)\s*=\s*(new\s[\s\S]+)$/.exec(t)
  const made = decl && fileConstructor(decl[2])
  if (decl && made) {
    const declared = /^(?:Scanner|BufferedReader|PrintWriter)\s/.test(t)
    return target === 'python'
      ? sp(indent) + `${decl[1]} = ${made.kind}(${made.name})\n`
      : sp(indent) + `${declared ? 'let ' : ''}${decl[1]} = new ${made.kind}(${made.name});\n`
  }
  const write = /^([A-Za-z_]\w*)\.(println|print)\s*\(([\s\S]*)\)$/.exec(t)
  if (write && write[1] !== 'System') {
    const expr = write[3].trim()
    const value = target === 'python' && expr !== '' ? pythonConcatenation(expr, intVariables, stringVariables) : expr
    return sp(indent) + `${write[1]}.${write[2]}(${value})${target === 'javascript' ? ';' : ''}\n`
  }
  const files = /^Files\.writeString\s*\(\s*(?:Path\.of|Paths\.get)\s*\(\s*("(?:[^"\\]|\\.)*")\s*\)\s*,\s*([\s\S]+)\)$/.exec(t)
  if (files) {
    const text = files[2].trim()
    return target === 'python'
      ? sp(indent) + `open(${files[1]}, "w", encoding="utf-8").write(${pythonConcatenation(text, intVariables, stringVariables)})\n`
      : sp(indent) + `require("fs").writeFileSync(${files[1]}, ${text});\n`
  }
  return undefined
}

/** Welche Datei-Klassen ein Diagramm anlegt. */
function usedFileClasses(docs: VSDocument[]): Set<'Scanner' | 'BufferedReader' | 'PrintWriter'> {
  const used = new Set<'Scanner' | 'BufferedReader' | 'PrintWriter'>()
  for (const doc of docs) {
    walkElements(doc.elements, (e) => {
      for (const l of e.textLines) {
        const m = /=\s*(new\s.+?);?\s*$/.exec(l)
        const made = m && fileConstructor(m[1])
        if (made) used.add(made.kind)
      }
    })
  }
  return used
}

const pythonFileHelpers: Record<string, string> = {
  Scanner: `class Scanner:
    def __init__(self, name):
        self.lines = open(name, encoding="utf-8").read().splitlines()
    def hasNextLine(self):
        return len(self.lines) > 0
    def nextLine(self):
        return self.lines.pop(0)
    def close(self):
        pass
`,
  BufferedReader: `class BufferedReader:
    def __init__(self, name):
        self.lines = open(name, encoding="utf-8").read().splitlines()
    def readLine(self):
        return self.lines.pop(0) if self.lines else None
    def close(self):
        pass
`,
  PrintWriter: `class PrintWriter:
    def __init__(self, name):
        self.file = open(name, "w", encoding="utf-8")
    def println(self, text=""):
        self.file.write(str(text) + "\\n")
    def print(self, text):
        self.file.write(str(text))
    def close(self):
        self.file.close()
`,
}

const javaScriptFileHelpers: Record<string, string> = {
  Scanner: `class Scanner {
  constructor(name) { this.lines = require("fs").readFileSync(name, "utf8").split(/\\r?\\n/); if (this.lines.at(-1) === "") this.lines.pop(); }
  hasNextLine() { return this.lines.length > 0; }
  nextLine() { return this.lines.shift(); }
  close() {}
}
`,
  BufferedReader: `class BufferedReader {
  constructor(name) { this.lines = require("fs").readFileSync(name, "utf8").split(/\\r?\\n/); if (this.lines.at(-1) === "") this.lines.pop(); }
  readLine() { return this.lines.length > 0 ? this.lines.shift() : null; }
  close() {}
}
`,
  PrintWriter: `class PrintWriter {
  constructor(name) { this.name = name; this.text = ""; }
  println(text = "") { this.text += text + "\\n"; }
  print(text) { this.text += text; }
  close() { require("fs").writeFileSync(this.name, this.text); }
}
`,
}

/** Kleine Klassen für Python und JavaScript, die wie Javas `Scanner`, `BufferedReader` und `PrintWriter` heißen. */
function fileHelperClasses(docs: VSDocument[], target: 'python' | 'javascript'): string {
  const used = usedFileClasses(docs)
  if (used.size === 0) return ''
  const helpers = target === 'python' ? pythonFileHelpers : javaScriptFileHelpers
  return [...used].map((k) => helpers[k]).join('\n') + '\n'
}

function emitPrintLineIfNeeded(
  raw: string,
  target: CodeTarget,
  indent: number,
  intVariables: Set<string>,
  stringVariables: Set<string>,
): string | undefined {
  // `System.out.print(…)`: Ausgabe ohne neue Zeile.
  const print = /^System\s*\.\s*out\s*\.\s*print\s*\(([\s\S]*)\)$/.exec(stripTrailingSemicolon(raw).trim())
  if (print) {
    const value = print[1].trim()
    switch (target) {
      case 'java': return sp(indent) + 'System.out.print(' + value + ');\n'
      case 'javascript': return sp(indent) + 'process.stdout.write(String(' + value + '));\n'
      case 'python': return sp(indent) + 'print(' + (value === '' ? '' : pythonConcatenation(value, intVariables, stringVariables) + ', ') + 'end="")\n'
    }
  }
  const expr = expressionAfterOutputDiagramPrefix(raw)
  if (expr === undefined) {
    // Leere Ausgabe (`output:` ohne Text): eine Leerzeile.
    if (!/^\s*(?:output|print):\s*$/i.test(raw)) return undefined
    return sp(indent) + { java: 'System.out.println();', javascript: 'console.log();', python: 'print()' }[target] + '\n'
  }
  switch (target) {
    case 'java': return sp(indent) + 'System.out.println(' + expr + ');\n'
    case 'javascript': return sp(indent) + 'console.log(' + expr + ');\n'
    case 'python': return sp(indent) + 'print(' + pythonConcatenation(expr, intVariables, stringVariables) + ')\n'
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

/** Felder einer `for`-Schleife: drei Zeilen oder eine Zeile `int i = 0; i < n; i++` (auch mit `for (…)`). */
function forLoopFields(lines: string[]): [string, string, string] | undefined {
  const raw = lines.map((l) => stripTrailingSemicolon(l).trim()).filter((l) => l !== '')
  let parts = raw
  if (raw.length === 1) {
    let one = raw[0]
    const kw = stripKeywordPrefix('for', one)
    if (kw !== undefined) one = kw
    parts = one.split(';').map((p) => p.trim())
  }
  if (parts.length !== 3 || parts.some((p) => p === '')) return undefined
  return [parts[0], parts[1], parts[2]]
}

interface PythonForLoop {
  /** `for i in range(…):` – oder `undefined`, wenn nur eine `while`-Schleife passt. */
  rangeLine?: string
  variable: string
  init: string
  condition: string
  increment: string
}

/** Schrittweite aus `i++`, `i--`, `i += 2`, `i -= 2`, `i = i + 2`, `i = i - 2`. */
function forLoopStepSize(s: string, name: string): number | undefined {
  let g = groups(/^\s*(\w+)\s*(\+\+|--)\s*$/, s) ?? groups(/^\s*(\+\+|--)\s*(\w+)\s*$/, s)
  if (g) {
    const [v, op] = g[1] === '++' || g[1] === '--' ? [g[2], g[1]] : [g[1], g[2]]
    return v === name ? (op === '++' ? 1 : -1) : undefined
  }
  g = groups(/^\s*(\w+)\s*(\+|-)=\s*(\d+)\s*$/, s)
  if (g) return g[1] === name ? (g[2] === '+' ? 1 : -1) * Number(g[3]) : undefined
  g = groups(/^\s*(\w+)\s*=\s*(\w+)\s*(\+|-)\s*(\d+)\s*$/, s)
  if (g) return g[1] === name && g[2] === name ? (g[3] === '+' ? 1 : -1) * Number(g[4]) : undefined
  return undefined
}

/** `n` → `n + 1`, `10` → `11`. */
function shiftedBound(bound: string, by: number): string {
  if (/^-?\d+$/.test(bound)) return String(Number(bound) + by)
  const simple = /^[\w.()[\]]+$/.test(bound) ? bound : `(${bound})`
  return by > 0 ? `${simple} + ${by}` : `${simple} - ${-by}`
}

/** Zählschleife für Python: `range(…)`, wenn Kopf und Schritt passen; sonst Bausteine für `while`. */
function pythonForLoop(lines: string[], intVariables: Set<string>): PythonForLoop | undefined {
  const fields = forLoopFields(lines)
  if (!fields) return undefined
  const [initS, condS, stepS] = fields
  const init = groups(/^\s*(?:integer|int|long|short|byte|double|float)?\s*([a-zA-Z_]\w*)\s*=\s*(.+)$/i, initS)
  if (!init) return undefined
  const name = init[1]
  const loop: PythonForLoop = { variable: name, init: `${name} = ${pythonExpression(init[2], intVariables)}`, condition: condS, increment: stepS }
  const cond = groups(/^\s*(\w+)\s*(<=|<|>=|>)\s*(.+)$/, condS)
  const step = forLoopStepSize(stepS, name)
  if (!cond || cond[1] !== name || step === undefined || step === 0) return loop
  const start = pythonExpression(init[2], intVariables)
  let stop = pythonExpression(cond[3], intVariables)
  const op = cond[2]
  if (step > 0 && op === '<=') stop = shiftedBound(stop, 1)
  else if (step < 0 && op === '>=') stop = shiftedBound(stop, -1)
  else if (!(step > 0 && op === '<') && !(step < 0 && op === '>')) return loop
  const args = step === 1 ? (start === '0' ? [stop] : [start, stop]) : [start, stop, String(step)]
  loop.rangeLine = `for ${name} in range(${args.join(', ')}):`
  return loop
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

function emitConstTypedLineIfNeeded(
  raw: string,
  target: CodeTarget,
  indent: number,
  intVariables: Set<string>,
): string | undefined {
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
      if (r) return sp(indent) + `${p.name} = ${pythonRhsFromJavaRhs(r, intVariables)}  # const ${jt}\n`
      return sp(indent) + `${p.name} = None  # const ${jt}, uninitialized\n`
  }
}

/** Eine Zeile `Typ name = ausdruck` (Schulsyntax). */
function parseJavaStyleSimpleAssignment(rawLine: string): { name: string; rhs: string; isArray: boolean } | undefined {
  const line = stripTrailingSemicolon(rawLine).trim()
  if (line === '') return undefined
  if (parseGridDeclaration(line)) return undefined
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
  const g = groups(/^\s*\(\s*int(?:eger)?\s*\)\s*(.+?)\s*$/i, rhs)
  const e = g?.[1].trim()
  // `(int) wort.charAt(i)` liefert den Zeichencode, das übernimmt `convertCharCasts`.
  if (!e || isCharOperand(e)) return undefined
  return e.startsWith('(') && matchingClose(e, 0) === e.length - 1 ? e.slice(1, -1).trim() : e
}

/** Index der schließenden Klammer zu `s[open]` (rund oder eckig), sonst -1. */
function matchingClose(s: string, open: number): number {
  let depth = 0
  for (let i = open; i < s.length; i++) {
    if (s[i] === '(' || s[i] === '[') depth++
    else if ((s[i] === ')' || s[i] === ']') && --depth === 0) return i
  }
  return -1
}

/** Ein einzelnes Zeichen: `'A'` oder `wort.charAt(i)`. */
const isCharOperand = (e: string) => /^'.'$/u.test(e) || /\.charAt\(.*\)$/.test(e)

/** Ende des Operanden ab `start`: `(…)`, `'A'`, eine Zahl oder ein Name mit `.methode(…)` und `[…]`; sonst -1. */
function operandEnd(s: string, start: number): number {
  if (s[start] === '(') {
    const close = matchingClose(s, start)
    return close < 0 ? -1 : close + 1
  }
  if (s[start] === "'") return s[start + 2] === "'" ? start + 3 : -1
  const head = /^(?:[A-Za-z_]\w*|\d+)/.exec(s.slice(start))
  if (!head) return -1
  let i = start + head[0].length
  for (;;) {
    const member = /^\.[A-Za-z_]\w*/.exec(s.slice(i))
    if (member) i += member[0].length
    else if (s[i] === '(' || s[i] === '[') {
      const close = matchingClose(s, i)
      if (close < 0) return -1
      i = close + 1
    } else return i
  }
}

/**
 * Umwandlungen zwischen Zeichen und Zeichencode wie in Java: `(int) wort.charAt(i)` → Python `ord(…)`,
 * JavaScript `….charCodeAt(0)`; `(char) code` → Python `chr(code)`, JavaScript `String.fromCharCode(code)`.
 */
function convertCharCasts(s: string, target: 'python' | 'javascript'): string {
  return mapOutsideStringLiterals(s, (code) => {
    const re = /\(\s*(int|char)\s*\)\s*/g
    let out = ''
    let last = 0
    for (let m = re.exec(code); m; m = re.exec(code)) {
      const start = m.index + m[0].length
      const end = operandEnd(code, start)
      if (end < 0) continue
      const operand = code.slice(start, end)
      if (m[1] === 'int' && !isCharOperand(operand)) continue
      const inner = convertCharCasts(operand.startsWith('(') ? operand.slice(1, -1).trim() : operand, target)
      const replacement = m[1] === 'int'
        ? (target === 'python' ? `ord(${inner})` : `${inner}.charCodeAt(0)`)
        : (target === 'python' ? `chr(${inner})` : `String.fromCharCode(${inner})`)
      out += code.slice(last, m.index) + replacement
      last = end
      re.lastIndex = end
    }
    return out + code.slice(last)
  })
}

function pythonRhsFromJavaRhs(rhs: string, intVariables: Set<string> = new Set()): string {
  const t = rhs.trim()
  if (t === 'null') return 'None'
  const cast = javaIntCastExpression(t)
  if (cast !== undefined) return `int(${pythonRhsFromJavaRhs(cast, intVariables)})`
  return pythonExpression(t, intVariables)
}

/** Teile außerhalb von `"…"`-Literalen umwandeln, Literale unverändert lassen. */
function mapOutsideStringLiterals(s: string, f: (code: string) => string): string {
  let out = ''
  let code = ''
  let i = 0
  while (i < s.length) {
    if (s[i] !== '"') {
      code += s[i++]
      continue
    }
    out += f(code)
    code = ''
    let j = i + 1
    while (j < s.length && s[j] !== '"') j += s[j] === '\\' ? 2 : 1
    out += s.slice(i, j + 1)
    i = j + 1
  }
  return out + f(code)
}

/**
 * Java-Schreibweise in einem Ausdruck nach Python: `&&` → `and`, `||` → `or`, `!` → `not`, `true` → `True`,
 * `a.equals(b)` → `a == b`, `Math.random()` → `random.random()`, `/` zwischen ganzen Zahlen → `//`.
 */
function pythonExpression(expression: string, intVariables: Set<string>): string {
  const withEquals = expression.replace(/\.equals\(\s*("(?:[^"\\]|\\.)*"|[^()"]*?)\s*\)/g, ' == $1')
  const isInt = (operand: string) => /^\d+$/.test(operand) || intVariables.has(operand)
  return mapOutsideStringLiterals(withEquals, (code) =>
    code
      .replace(/\bMath\.random\s*\(\s*\)/gi, 'random.random()')
      .replace(/===/g, '==')
      .replace(/!==/g, '!=')
      .replace(/\s*&&\s*/g, ' and ')
      .replace(/\s*\|\|\s*/g, ' or ')
      .replace(/!(?!=)\s*/g, 'not ')
      .replace(/\btrue\b/g, 'True')
      .replace(/\bfalse\b/g, 'False')
      .replace(/\bnull\b/g, 'None')
      .replace(/(?<![\w.])([a-zA-Z_]\w*|\d+)\s*\/\s*([a-zA-Z_]\w*|\d+)(?![\w.(\[])/g, (m, a: string, b: string) =>
        isInt(a) && isInt(b) ? `${a} // ${b}` : m,
      ),
  )
}

/** Teile einer Verkettung mit `+` außerhalb von Klammern und Strings. */
function splitTopLevelPlus(expression: string): string[] {
  const parts: string[] = []
  let depth = 0
  let current = ''
  let inString = false
  for (let i = 0; i < expression.length; i++) {
    const c = expression[i]
    if (inString) {
      current += c
      if (c === '\\' && i + 1 < expression.length) current += expression[++i]
      else if (c === '"') inString = false
      continue
    }
    if (c === '"') inString = true
    else if (c === '(' || c === '[') depth++
    else if (c === ')' || c === ']') depth--
    else if (c === '+' && depth === 0) {
      parts.push(current.trim())
      current = ''
      continue
    }
    current += c
  }
  parts.push(current.trim())
  return parts
}

const isDoubleQuotedLiteral = (s: string) => /^"(?:[^"\\]|\\.)*"$/.test(s)

/** `"Summe: " + summe` → `"Summe: " + str(summe)`: Python verkettet Text nicht mit Zahlen. Sonst nur übersetzt. */
function pythonConcatenation(expression: string, intVariables: Set<string>, stringVariables: Set<string>): string {
  const parts = splitTopLevelPlus(expression)
  const isText = (p: string) =>
    isDoubleQuotedLiteral(p) || stringVariables.has(p) || stringVariables.has(p.replace(/^([A-Za-z_]\w*)\[[^[\]]*\]$/u, '$1[]'))
  if (parts.length < 2 || !parts.some(isText) || parts.some((p) => p === '')) {
    return pythonExpression(expression, intVariables)
  }
  return parts.map((p) => (isText(p) ? p : `str(${pythonExpression(p, intVariables)})`)).join(' + ')
}

/** Python: `i++` → `i += 1`, `x /= 2` → `x //= 2` (ganze Zahl), sonst der Ausdruck übersetzt. */
function pythonStatementLine(raw: string, intVariables: Set<string>, stringVariables: Set<string> = new Set()): string {
  const t = stripTrailingSemicolon(raw).trim()
  const inc = groups(/^(\w+(?:\[[^\]]*\])?)\s*(\+\+|--)$/, t) ?? groups(/^(\+\+|--)\s*(\w+(?:\[[^\]]*\])?)$/, t)
  if (inc) {
    const [target, op] = inc[1] === '++' || inc[1] === '--' ? [inc[2], inc[1]] : [inc[1], inc[2]]
    return `${pythonExpression(target, intVariables)} ${op === '++' ? '+=' : '-='} 1`
  }
  const div = groups(/^(\w+)\s*\/=\s*(.+)$/, t)
  if (div && intVariables.has(div[1])) return `${div[1]} //= ${pythonExpression(div[2], intVariables)}`
  const assign = groups(/^([\w[\]. ]+?)\s*(=|\+=|-=|\*=|\/=|%=)\s*(.+)$/, t)
  if (assign && !assign[3].startsWith('=')) {
    const [, target, op, rhs] = assign
    let value: string
    if (op === '+=' && stringVariables.has(target.trim())) {
      const parts = splitTopLevelPlus(rhs)
      value = pythonConcatenation(`"" + ${rhs}`, intVariables, stringVariables).replace(/^"" \+ /, '')
      if (parts.length === 1 && !isDoubleQuotedLiteral(rhs.trim()) && !stringVariables.has(rhs.trim())) {
        value = `str(${pythonExpression(rhs, intVariables)})`
      }
    } else if (op === '=' && javaIntCastExpression(rhs) === undefined && rhs.trim() !== 'null') {
      value = pythonConcatenation(rhs, intVariables, stringVariables)
    } else {
      value = op === '=' ? pythonRhsFromJavaRhs(rhs, intVariables) : pythonExpression(rhs, intVariables)
    }
    return `${target} ${op} ${value}`
  }
  return pythonExpression(t, intVariables)
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

interface GridDeclaration {
  elementType: string
  name: string
  rhs: string
}

/** `boolean[][] sitze = …` (2D-Array). */
function parseGridDeclaration(line: string): GridDeclaration | undefined {
  const g = groups(/^\s*(int|double|string|boolean)\s*\[\s*\]\s*\[\s*\]\s*([a-zA-Z_]\w*)\s*=\s*(.+)$/i, stripTrailingSemicolon(line).trim())
  return g ? { elementType: g[1].toLowerCase(), name: g[2], rhs: g[3].trim() } : undefined
}

/** `new boolean[3][4]` → `['3', '4']`. */
function gridSizeExpressions(rhs: string): [string, string] | undefined {
  const g = groups(/^\s*new\s+(?:int|double|string|boolean)\s*\[\s*(.+?)\s*\]\s*\[\s*(.+?)\s*\]\s*$/i, rhs)
  return g ? [g[1], g[2]] : undefined
}

const nestedArrayLiteral = (rhs: string) => rhs.replaceAll('{', '[').replaceAll('}', ']')

function gridDefault(elementType: string, target: 'python' | 'javascript'): string {
  if (elementType === 'boolean') return target === 'python' ? 'False' : 'false'
  if (elementType === 'string') return '""'
  if (elementType === 'double') return '0.0'
  return '0'
}

function gridRhs(d: GridDeclaration, target: 'python' | 'javascript', intVariables: Set<string>): string {
  const size = gridSizeExpressions(d.rhs)
  if (target === 'javascript') {
    return size
      ? `Array.from({ length: ${size[0]} }, () => new Array(${size[1]}).fill(${gridDefault(d.elementType, target)}))`
      : nestedArrayLiteral(d.rhs)
  }
  return size
    ? `[[${gridDefault(d.elementType, target)}] * ${pythonExpression(size[1], intVariables)} for _ in range(${pythonExpression(size[0], intVariables)})]`
    : pythonExpression(nestedArrayLiteral(d.rhs), intVariables)
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

function pythonRhsFromJavaRhsArray(rhs: string, isArray: boolean, intVariables: Set<string>): string {
  const t = rhs.trim()
  if (isArray) {
    const size = javaNewArraySizeExpression(t)
    return size !== undefined ? `[None] * ${size}` : pythonExpression(arrayLiteralFromJavaInitializer(t), intVariables)
  }
  return pythonRhsFromJavaRhs(t, intVariables)
}

/** JavaScript: `int x = 5` → `let x = 5;`. Python: `x = 5`. Java: allgemeiner Pfad. */
function emitTranslatedJavaLikeAssignmentIfNeeded(
  raw: string,
  target: CodeTarget,
  indent: number,
  intVariables: Set<string>,
  stringVariables: Set<string>,
): string | undefined {
  if (target === 'java') return undefined
  const grid = parseGridDeclaration(raw)
  if (grid) {
    const value = gridRhs(grid, target, intVariables)
    return target === 'javascript' ? sp(indent) + `let ${grid.name} = ${value};\n` : sp(indent) + `${grid.name} = ${value}\n`
  }
  const p = parseJavaStyleSimpleAssignment(raw)
  if (!p) return undefined
  if (target === 'javascript') {
    return sp(indent) + formatCStyleStatementLine(`let ${p.name} = ${javaScriptRhsFromJavaRhs(p.rhs, p.isArray)}`) + '\n'
  }
  const plain = !p.isArray && javaIntCastExpression(p.rhs) === undefined && p.rhs.trim() !== 'null'
  const value = plain
    ? pythonConcatenation(p.rhs, intVariables, stringVariables)
    : pythonRhsFromJavaRhsArray(p.rhs, p.isArray, intVariables)
  return sp(indent) + `${p.name} = ${value}\n`
}

function walkElements(elements: VSElement[], visit: (e: VSElement) => void) {
  for (const e of elements) {
    visit(e)
    if (e.loopBody) walkElements(e.loopBody, visit)
    for (const c of e.cases ?? []) walkElements(c.elements, visit)
  }
}

function inferIntegerVariables(doc: VSDocument): Set<string> {
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

/** Wie in Java: `/` zwischen ganzen Zahlen schneidet in JavaScript mit `Math.trunc` ab, auch bei `x /= y`. */
function javaScriptIntegerDivision(code: string, intVariables: Set<string>): string {
  const isInt = (operand: string) => /^\d+$/.test(operand) || intVariables.has(operand)
  // Ganze Ketten wie `x * x / 2` von links nach rechts auswerten: In Java ist das `(x * x) / 2`, nicht `x * (x / 2)`.
  const operand = String.raw`(?:[a-zA-Z_]\w*|\d+(?:\.\d+)?)`
  const chain = new RegExp(String.raw`(?<![\w.*/%]\s*)${operand}(?:\s*[*/%]\s*${operand})+(?![\w.(\[])`, 'g')
  const foldChain = (m: string) => {
    const tokens = m.split(/\s*([*/%])\s*/)
    if (!tokens.some((t) => t === '/')) return m
    let result = tokens[0]
    let resultIsInt = isInt(tokens[0])
    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i]
      const next = tokens[i + 1]
      if (op === '/' && resultIsInt && isInt(next)) result = `Math.trunc(${result} / ${next})`
      else result = `${result} ${op} ${next}`
      resultIsInt = resultIsInt && isInt(next)
    }
    return result
  }
  return mapOutsideStringLiterals(code, (part) =>
    part
      .replace(chain, foldChain)
      .replace(/(?<![\w.])([a-zA-Z_]\w*)\s*\/=\s*([a-zA-Z_]\w*|\d+)(?![\w.(\[])/g, (m, a: string, b: string) =>
        isInt(a) && isInt(b) ? `${a} = Math.trunc(${a} / ${b})` : m,
      ),
  )
}

function documentContainsJavaInput(doc: VSDocument): boolean {
  let found = false
  walkElements(doc.elements, (e) => {
    if (e.type === ElementType.anweisung && e.textLines.some((l) => l.trim().toLowerCase().startsWith('input:'))) found = true
  })
  return found
}

/**
 * Imports für Dateien: `Files`/`Path` aus `java.nio.file`, `File`, `PrintWriter`, `FileReader` und `BufferedReader` aus
 * `java.io`, dazu `java.util.Scanner` für einen Scanner auf einer Datei.
 */
export function fileImports(doc: VSDocument): string[] {
  let nio = false
  let io = false
  let scanner = false
  walkElements(doc.elements, (e) => {
    for (const l of e.textLines) {
      if (/\bFiles\s*\./.test(l)) nio = true
      if (/\bnew\s+(?:File|PrintWriter|FileReader|FileWriter|BufferedReader)\s*\(/.test(l)) io = true
      if (/\bnew\s+Scanner\s*\(\s*new\s+File\b/.test(l)) scanner = true
    }
  })
  return [...(io ? ['import java.io.*;'] : []), ...(nio ? ['import java.nio.file.*;'] : []), ...(scanner ? ['import java.util.Scanner;'] : [])]
}

/** Arbeitet das Programm mit Dateien? Dann kann eine IOException kommen, und Java verlangt `throws` an der Methode. */
export function documentReadsFiles(doc: VSDocument): boolean {
  return fileImports(doc).length > 0
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
  if (target === 'java' || /^\p{N}+$/u.test(t) || isDoubleQuotedLiteral(t)) return t
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
  if (body.every((l) => l === '')) {
    // Neue, noch leere Anweisung: eine leere Anweisung (Python: `pass`).
    if (options.live) sink.out += sp(indent) + (target === 'python' ? 'pass' : ';') + '\n'
    return
  }
  if (options.includeDiagramTextAsComments) {
    const forDiagram = body.filter((l) => l !== '' && !isDiagramEmptyPlaceholderText(l))
    if (forDiagram.length > 0) sink.out += blockComment(forDiagram, target, indent)
  }
  for (const raw of body) {
    if (raw === '') continue
    if (isDiagramEmptyPlaceholderText(raw)) {
      sink.out += options.live ? livePlaceholderLine(indent, options.live) : emptyElementCommentLine(indent, target)
      continue
    }
    const ints = options.jsIntVariables ?? new Set<string>()
    const arrays = options.arrayElementTypes ?? new Map<string, string>()
    const texts = options.stringVariables ?? new Set<string>()
    const special =
      (target === 'java' ? emitJavaInputLineIfNeeded(raw, indent, arrays) : undefined) ??
      (target === 'javascript' ? emitJavaScriptInputLineIfNeeded(raw, indent, arrays) : undefined) ??
      (target === 'python' ? emitPythonInputLineIfNeeded(raw, indent, arrays) : undefined) ??
      emitFileLineIfNeeded(raw, target, indent, ints, texts) ??
      emitPrintLineIfNeeded(raw, target, indent, ints, texts) ??
      emitConstTypedLineIfNeeded(raw, target, indent, ints) ??
      emitTranslatedJavaLikeAssignmentIfNeeded(raw, target, indent, ints, texts) ??
      emitBareLeadingStringAsPrintIfNeeded(raw, target, indent, ints, texts)
    if (special !== undefined) {
      sink.out += target === 'javascript' ? javaScriptIntegerDivision(special, ints) : special
      continue
    }
    let line = raw
    if (isCStyleSemicolonTarget(target)) {
      line = formatCStyleStatementLine(target === 'javascript' ? javaScriptIntegerDivision(raw, ints) : raw)
    } else if (target === 'python') {
      line = pythonStatementLine(raw, ints, texts)
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
  livePlaceholder = options.live?.labels.condition,
) {
  if (options.includeDiagramTextAsComments) sink.out += blockComment(textLines, target, indent)
  if (livePlaceholder !== undefined && isBlank(textLines)) {
    sink.out += sp(indent) + prefix + livePlaceholderText(livePlaceholder) + suffix
    return
  }
  const condition = conditionText(textLines)
  const ints = options.jsIntVariables ?? new Set<string>()
  const text =
    target === 'python'
      ? pythonExpression(condition, ints)
      : target === 'javascript'
        ? javaScriptIntegerDivision(condition, ints)
        : condition
  sink.out += sp(indent) + prefix + text + suffix
}

/** Leere Blöcke: Python braucht `pass`. */
function emitBlockBody(elements: VSElement[], target: CodeTarget, options: CodeOptions, indent: number, sink: Sink) {
  const before = sink.out.length
  for (const el of elements) emit(el, target, options, indent, sink)
  if (options.live && sink.out.length === before) sink.out += livePlaceholderLine(indent, options.live)
  if (target !== 'python') return
  // Nur Kommentare (z. B. „# empty element“) zählen in Python nicht als Anweisung.
  const emitted = sink.out.slice(before).split('\n').map((l) => l.trim())
  if (emitted.every((l) => l === '' || l.startsWith('#'))) sink.out += sp(indent) + 'pass\n'
}

/** Steht im false-Zweig nur eine weitere Verzweigung, wird daraus `else if` (Python: `elif`) statt eines verschachtelten Blocks. */
function elseIfBranch(elements: VSElement[], options: CodeOptions): VSElement | undefined {
  // Mit Diagrammtext als Kommentar stünde der Kommentar zwischen `}` und `else if`: dann verschachtelt lassen.
  if (options.includeDiagramTextAsComments || elements.length !== 1) return undefined
  const only = elements[0]
  return only.type === ElementType.verzweigung && (only.cases?.length ?? 0) >= 2 ? only : undefined
}

function emitIfChain(element: VSElement, target: CodeTarget, options: CodeOptions, indent: number, sink: Sink, isElseIf: boolean) {
  const cases = element.cases
  if (!cases || cases.length < 2) return
  const py = target === 'python'
  const inner = indent + options.indentPerLevel
  const omitElse = !options.includeEmptyElseBranch && isIfElseFalseBranchVisuallyEmpty(cases[1].elements)
  const next = omitElse ? undefined : elseIfBranch(cases[1].elements, options)
  if (py) {
    emitConditionHeader(isElseIf ? 'elif ' : 'if ', ':\n', element.textLines, target, options, indent, sink)
    emitBlockBody(cases[0].elements, target, options, inner, sink)
    if (next) emitIfChain(next, target, options, indent, sink, true)
    else if (!omitElse) {
      sink.out += sp(indent) + 'else:\n'
      emitBlockBody(cases[1].elements, target, options, inner, sink)
    }
    return
  }
  emitConditionHeader(isElseIf ? '} else if (' : 'if (', ') {\n', element.textLines, target, options, indent, sink)
  emitBlockBody(cases[0].elements, target, options, inner, sink)
  if (next) {
    const start = sink.out.length
    emitIfChain(next, target, options, indent, sink, true)
    recordLiveSpan(options, next, sink, start)
  } else if (omitElse) sink.out += sp(indent) + '}\n'
  else {
    sink.out += sp(indent) + '} else {\n'
    emitBlockBody(cases[1].elements, target, options, inner, sink)
    sink.out += sp(indent) + '}\n'
  }
}

function emit(element: VSElement, target: CodeTarget, options: CodeOptions, indent: number, sink: Sink) {
  const start = sink.out.length
  emitElement(element, target, options, indent, sink)
  recordLiveSpan(options, element, sink, start)
}

function emitElement(element: VSElement, target: CodeTarget, options: CodeOptions, indent: number, sink: Sink) {
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
      sink.out += options.live ? livePlaceholderLine(indent, options.live) : emptyElementCommentLine(indent, target)
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

    case ElementType.verzweigung:
      emitIfChain(element, target, options, indent, sink, false)
      return

    case ElementType.fallauswahl: {
      const cases = element.cases
      if (!cases || cases.length === 0) return
      if (py && options.pythonWithoutMatch) {
        const choice = `wahl${indent / step + 1}`
        emitConditionHeader(choice + ' = ', '\n', element.textLines, target, options, indent, sink)
        cases.forEach((c, i) => {
          const isLast = i === cases.length - 1
          if (isLast && i === 0) sink.out += sp(indent) + 'if True:' + forcedCaseComment(c.name, target) + '\n'
          else if (isLast) sink.out += sp(indent) + 'else:' + forcedCaseComment(c.name, target) + '\n'
          else sink.out += sp(indent) + (i === 0 ? 'if ' : 'elif ') + choice + ' == ' + caseLabelToken(c.name, target) + ':\n'
          body(c.elements, indent + step)
        })
        return
      }
      emitConditionHeader(
        py ? 'match ' : 'switch (',
        py ? ':\n' : ') {\n',
        element.textLines,
        target,
        options,
        indent,
        sink,
        options.live?.labels.selector,
      )
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
        const head = options.live ? liveForLoopHeaderText(element.textLines, options.live.labels) : cStyleForLoopHeaderText(element.textLines)
        sink.out += sp(indent) + 'for (' + head + ') {\n'
      } else if (py) {
        const ints = options.jsIntVariables ?? new Set<string>()
        const loop = pythonForLoop(element.textLines, ints)
        if (loop?.rangeLine !== undefined) {
          commentIfWanted()
          sink.out += sp(indent) + loop.rangeLine + '\n'
        } else if (loop) {
          // Kein passendes `range`: Startwert, `while` mit Bedingung, Schritt am Ende des Rumpfs.
          commentIfWanted()
          sink.out += sp(indent) + loop.init + '\n'
          sink.out += sp(indent) + 'while ' + pythonExpression(loop.condition, ints) + ':\n'
          for (const el of element.loopBody ?? []) emit(el, target, options, indent + step, sink)
          sink.out += sp(indent + step) + pythonStatementLine(loop.increment, ints) + '\n'
          return
        } else if (options.live) {
          sink.out += sp(indent) + livePythonForLoopHeaderText(element.textLines, options.live.labels, ints) + '\n'
        } else {
          header('for ', ':\n')
        }
      } else {
        commentIfWanted()
        const head = options.live
          ? liveJavaScriptForLoopHeaderText(element.textLines, options.live.labels)
          : javaScriptForLoopHeaderText(element.textLines)
        sink.out += sp(indent) + 'for (' + head + ') {\n'
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
      const cond =
        options.live && isBlank(element.textLines)
          ? livePlaceholderText(options.live.labels.condition)
          : conditionText(element.textLines)
      if (py) {
        sink.out += sp(indent) + 'while True:\n'
        const bodyStart = indent + step
        body(element.loopBody ?? [], bodyStart)
        commentIfWanted(bodyStart)
        const expression = cond.includes(livePlaceholderStart) ? cond : pythonExpression(cond, options.jsIntVariables ?? new Set())
        sink.out += sp(bodyStart) + 'if not (' + expression + '):\n'
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

// MARK: - Ansicht „Code live“

/** Platzhalter stehen zwischen diesen Zeichen; die Ansicht zeigt sie grau und ohne die Zeichen. */
export const livePlaceholderStart = '\uE000'
export const livePlaceholderEnd = '\uE001'

/** Platzhalter-Wörter in der Sprache der Oberfläche, z. B. „Bedingung“. */
export interface LiveLabels {
  condition: string
  selector: string
  code: string
  start: string
  step: string
  /** Obergrenze von `range(…)` in Python. */
  end: string
}

/** Zeilen eines Elements im erzeugten Code (ab 0, `to` einschließlich). */
export interface LiveSpan {
  path: number[]
  from: number
  to: number
}

export interface LiveCode {
  /** Code mit Platzhalter-Markierungen (`livePlaceholderStart` … `livePlaceholderEnd`). */
  text: string
  spans: LiveSpan[]
}

interface LiveContext {
  target: LiveTarget
  labels: LiveLabels
  paths: Map<VSElement, number[]>
  spans: LiveSpan[]
}

const livePlaceholderText = (label: string) => livePlaceholderStart + label + livePlaceholderEnd
/** Leerer Block: `// Dein Code`; Python braucht dort eine Anweisung, also `pass  # Dein Code`. */
const livePlaceholderLine = (indent: number, live: LiveContext) =>
  sp(indent) + livePlaceholderText(live.target === 'python' ? `pass  # ${live.labels.code}` : `// ${live.labels.code}`) + '\n'
const isBlank = (lines: string[]) => lines.every((l) => l.trim() === '')

/** `for (Startwert; Bedingung; Schritt)`: leere Felder werden zu Platzhaltern. */
function liveForLoopHeaderText(lines: string[], labels: LiveLabels): string {
  if (isBlank(lines) || lines.length === 3) {
    const placeholders = [labels.start, labels.condition, labels.step]
    return placeholders
      .map((label, i) => {
        const field = stripTrailingSemicolon(lines[i] ?? '')
        return field === '' ? livePlaceholderText(label) : field
      })
      .join('; ')
  }
  return cStyleForLoopHeaderText(lines)
}

/** Wie `javaScriptForLoopHeaderText`: `int i = 0` wird zu `let i = 0`, Platzhalter bleiben. */
function liveJavaScriptForLoopHeaderText(lines: string[], labels: LiveLabels): string {
  const parts = liveForLoopHeaderText(lines, labels).split(';')
  const translated = parts[0].includes(livePlaceholderStart) ? undefined : javaScriptForInitializerFromJavaTypedDeclaration(parts[0])
  if (translated !== undefined) parts[0] = translated
  return parts.join(';')
}

/**
 * Unvollständige Zählschleife in Python: `for i in range(Start, Ende):`, fehlende Teile als Platzhalter.
 * (Vollständige Köpfe übersetzt `pythonForLoop`.)
 */
function livePythonForLoopHeaderText(lines: string[], labels: LiveLabels, intVariables: Set<string>): string {
  const [initS = '', condS = '', stepS = ''] = lines.length === 3 ? lines.map((l) => stripTrailingSemicolon(l)) : []
  const init = groups(/^\s*(?:integer|int|long|short|byte|double|float)?\s*([a-zA-Z_]\w*)\s*=\s*(.+)$/i, initS)
  const name = init?.[1] ?? groups(/^\s*([a-zA-Z_]\w*)\s*(?:<=|<|>=|>)/, condS)?.[1]
  const start = init ? pythonExpression(init[2], intVariables) : livePlaceholderText(labels.start)
  const cond = groups(/^\s*(\w+)\s*(<=|<)\s*(.+)$/, condS)
  let stop = livePlaceholderText(labels.end)
  if (cond && (name === undefined || cond[1] === name)) {
    stop = pythonExpression(cond[3], intVariables)
    if (cond[2] === '<=') stop = shiftedBound(stop, 1)
  }
  const step = name === undefined ? undefined : forLoopStepSize(stepS, name)
  const args = [start, stop, ...(step !== undefined && step !== 1 ? [String(step)] : [])]
  return `for ${name ?? livePlaceholderText(labels.selector)} in range(${args.join(', ')}):`
}

/** Pfade wie in `editing.ts`: `[i, Zweig, j, …]`, Schleifenrumpf = Zweig 0. */
function elementPaths(elements: VSElement[], prefix: number[] = [], out = new Map<VSElement, number[]>()) {
  elements.forEach((e, i) => {
    const path = [...prefix, i]
    if (!out.has(e)) out.set(e, path)
    if (e.loopBody) elementPaths(e.loopBody, [...path, 0], out)
    e.cases?.forEach((c, k) => elementPaths(c.elements, [...path, k], out))
  })
  return out
}

function recordLiveSpan(options: CodeOptions, element: VSElement, sink: Sink, start: number) {
  const live = options.live
  const path = live?.paths.get(element)
  if (!live || !path || sink.out.length === start) return
  const lineAt = (offset: number) => sink.out.slice(0, offset).split('\n').length - 1
  live.spans.push({ path, from: lineAt(start), to: lineAt(sink.out.length - 1) })
}

/** Zielsprachen der Ansicht „Code live“. */
export type LiveTarget = 'java' | 'javascript' | 'python'

/**
 * Code für die Ansicht „Code live“: wie das Code-Snippet, aber für Anfänger lesbar, solange noch etwas fehlt
 * (leere Anweisung `;`, `if (Bedingung)`, `// Dein Code` in leeren Blöcken), und mit den Zeilen jedes Elements.
 */
export function generateLiveCode(document: VSDocument, target: LiveTarget, labels: LiveLabels): LiveCode {
  const live: LiveContext = { target, labels, paths: elementPaths(document.elements), spans: [] }
  const opts = documentOptions(document, target, { includeEmptyElseBranch: true, live })
  const header = parseSubprogramHeader(document.caption)
  let prelude = ''
  if (target === 'java') {
    const files = fileImports(document)
    for (const line of files) prelude += line + '\n'
    if (documentContainsJavaInput(document)) {
      if (!files.includes('import java.util.Scanner;')) prelude += 'import java.util.Scanner;\n'
      prelude += 'Scanner scanner = new Scanner(System.in);\n\n'
    } else if (files.length) prelude += '\n'
    if (header) prelude += javaMethodHeader(header) + '\n'
  } else {
    if (header) {
      for (const p of header.params) {
        if (p.dims) continue
        if (p.type === 'int') opts.jsIntVariables!.add(p.name)
        if (p.type === 'string') opts.stringVariables!.add(p.name)
      }
    }
    const names = header?.params.map((p) => p.name).join(', ')
    if (target === 'javascript') {
      prelude += '"use strict";\n\n'
      prelude += fileHelperClasses([document], 'javascript')
      if (header) prelude += `function ${header.name}(${names}) {\n`
    } else {
      if (documentContainsJavaMathRandom(document)) prelude += 'import random\n\n'
      prelude += fileHelperClasses([document], 'python')
      if (header) prelude += `def ${header.name}(${names}):\n`
    }
  }
  const sink = { out: '' }
  emitBlockBody(document.elements, target, opts, header ? opts.indentPerLevel : 0, sink)
  if (header && target !== 'python') sink.out += '}\n'
  const offset = prelude.split('\n').length - 1
  return {
    text: postProcessLengthSyntax((prelude + sink.out).replace(/\n+$/, ''), target),
    spans: live.spans.map((s) => ({ ...s, from: s.from + offset, to: s.to + offset })),
  }
}

export const generateLiveJava = (document: VSDocument, labels: LiveLabels) => generateLiveCode(document, 'java', labels)

// MARK: - Nachbearbeitung: `.length` / `.length()` zielsprachentauglich (Heuristik)

function postProcessLengthSyntax(s: string, target: CodeTarget): string {
  switch (target) {
    case 'javascript':
      return javaScriptStringMethods(convertCharCasts(s, 'javascript')).replace(/\.length\(\)/g, '.length').replace(/\.contains\(/g, '.includes(')
    case 'python':
      return pythonStringMethodsDeep(convertCharCasts(s, 'python')).replace(/\b([a-zA-Z_]\w*(?:\[[^[\]]*\])?)\.length(?:\(\)|\b)/g, 'len($1)')
    case 'java':
      return replaceIdentifierDotLengthWithParensInJava(s)
  }
}

/** Java-String-Methoden nach Python: `w.charAt(i)` → `w[i]`, `w.substring(a, b)` → `w[a:b]`, `w.contains(x)` → `(x in w)` usw. */
function pythonStringMethodsDeep(s: string): string {
  // Ketten wie `w.trim().toLowerCase()` brauchen mehrere Durchgänge.
  for (let i = 0; i < 5; i++) {
    const next = javaStaticCalls(pythonStringMethods(s), 'python')
    if (next === s) break
    s = next
  }
  return s
}

const pythonRenamed: Record<string, string> = {
  indexOf: 'find',
  lastIndexOf: 'rfind',
  toUpperCase: 'upper',
  toLowerCase: 'lower',
  trim: 'strip',
  startsWith: 'startswith',
  endsWith: 'endswith',
}

function pythonStringMethods(s: string): string {
  return rewriteMethodCalls(s, ['charAt', 'substring', 'contains', 'isEmpty', 'equalsIgnoreCase', 'compareTo', 'repeat', 'concat', ...Object.keys(pythonRenamed)], (target, method, args) => {
    switch (method) {
      case 'charAt':
        return `${target}[${args}]`
      case 'substring': {
        const parts = splitTopLevelComma(args)
        return parts.length === 2 ? `${target}[${parts[0].trim()}:${parts[1].trim()}]` : `${target}[${args.trim()}:]`
      }
      case 'contains':
        return `(${args.trim()} in ${target})`
      case 'isEmpty':
        return `(len(${target}) == 0)`
      case 'equalsIgnoreCase':
        return `(${target}.lower() == ${args.trim()}.lower())`
      case 'compareTo':
        return `((${target} > ${args.trim()}) - (${target} < ${args.trim()}))`
      case 'repeat':
        return `(${target} * ${args.trim()})`
      case 'concat':
        return `(${target} + ${args.trim()})`
      default:
        return `${target}.${pythonRenamed[method]}(${args})`
    }
  })
}

/** Java-String-Methoden, die es in JavaScript nicht gibt: `w.isEmpty()`, `w.equalsIgnoreCase(x)`, `w.compareTo(x)`; `replace` ersetzt wie in Java alle Stellen. */
function javaScriptStringMethods(s: string): string {
  for (let i = 0; i < 5; i++) {
    const next = javaStaticCalls(
      rewriteMethodCalls(s, ['isEmpty', 'equalsIgnoreCase', 'compareTo', 'replace'], (target, method, args) => {
        switch (method) {
          case 'isEmpty':
            return `(${target}.length === 0)`
          case 'equalsIgnoreCase':
            return `(${target}.toLowerCase() === ${args.trim()}.toLowerCase())`
          case 'compareTo':
            return `${target}.localeCompare(${args.trim()})`
          default:
            return `${target}.replaceAll(${args})`
        }
      }),
      'javascript',
    )
    if (next === s) break
    s = next
  }
  return s
}

/** `Integer.parseInt(x)`, `Double.parseDouble(x)`, `String.valueOf(x)` und `Files.readString(Path.of(x))` in Python und JavaScript. */
function javaStaticCalls(s: string, target: 'python' | 'javascript'): string {
  const file = /\bFiles\.readString\(\s*(?:Path\.of|Paths\.get)\(\s*("(?:[^"\\]|\\.)*")\s*\)\s*\)/g
  if (target === 'python') {
    return s
      .replace(file, 'open($1, encoding="utf-8").read()')
      .replace(/\bInteger\.parseInt\(/g, 'int(')
      .replace(/\bDouble\.parseDouble\(/g, 'float(')
      .replace(/\bString\.valueOf\(/g, 'str(')
  }
  return s
    .replace(file, 'require("fs").readFileSync($1, "utf8")')
    .replace(/\bInteger\.parseInt\(/g, 'parseInt(')
    .replace(/\bDouble\.parseDouble\(/g, 'parseFloat(')
    .replace(/\bString\.valueOf\(/g, 'String(')
}

/** Teilt Argumente am Komma außerhalb von Klammern. */
function splitTopLevelComma(args: string): string[] {
  let depth = 0
  const comma = [...args].findIndex((c) => (c === '(' ? (depth += 1, false) : c === ')' ? (depth -= 1, false) : c === ',' && depth === 0))
  return comma < 0 ? [args] : [args.slice(0, comma), args.slice(comma + 1)]
}

/** Ersetzt Aufrufe `ziel.methode(…)` der genannten Methoden; das Ziel ist ein Name, ein Fach, eine Kette oder ein String. */
function rewriteMethodCalls(s: string, methods: string[], replace: (target: string, method: string, args: string) => string): string {
  const re = new RegExp(`([A-Za-z_]\\w*(?:\\[[^[\\]]*\\]|\\.\\w+\\(\\))*|"(?:[^"\\\\]|\\\\.)*")\\.(${methods.join('|')})\\(`, 'g')
  let out = ''
  let last = 0
  for (let m = re.exec(s); m; m = re.exec(s)) {
    const open = m.index + m[0].length - 1
    let depth = 0
    let close = -1
    for (let i = open; i < s.length; i++) {
      if (s[i] === '(') depth += 1
      else if (s[i] === ')' && --depth === 0) {
        close = i
        break
      }
    }
    if (close < 0) break
    const args = rewriteMethodCalls(s.slice(open + 1, close), methods, replace)
    out += s.slice(last, m.index) + replace(m[1], m[2], args)
    last = close + 1
    re.lastIndex = close + 1
  }
  return out + s.slice(last)
}

function javaArrayDeclarationNames(s: string): Set<string> {
  const type = '(?:byte|short|int|long|float|double|boolean|char|String)'
  const patterns = [
    new RegExp(`\\b(?:final\\s+)?${type}\\s*\\[\\s*\\](?:\\s*\\[\\s*\\])?\\s+([a-zA-Z_]\\w*)\\b`, 'g'),
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
export function generateJavaClassFile(
  document: VSDocument,
  className: string,
  options: Partial<CodeOptions> = {},
  subprograms: VSDocument[] = [],
): string {
  const opts = { ...defaultCodeOptions, ...options }
  const name = sanitizedJavaClassName(className)
  const methodDocs = [document, ...subprograms]
    .filter((d, i, all) => all.indexOf(d) === i)
    .map((d) => ({ d, header: parseSubprogramHeader(d.caption) }))
    .filter((m): m is { d: VSDocument; header: SubprogramHeader } => m.header !== undefined)
  const methods = methodDocs.map((m) => subprogramDefinition(m.d, m.header, 'java', options, opts.indentPerLevel))
  const ownHeader = parseSubprogramHeader(document.caption)
  // Mit Methoden braucht jede denselben Scanner, deshalb steht er dann als Feld in der Klasse.
  const methodInput = methodDocs.some((m) => documentContainsJavaInput(m.d))
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
  const scannerField = methods.length > 0 && (hasInput || methodInput)
  // `Files.readString` kann eine IOException werfen; Java verlangt dann `throws` an der Methode.
  const imports = [...new Set([document, ...methodDocs.map((m) => m.d)].flatMap(fileImports))]
  const files = imports.length > 0
  if ((hasInput || methodInput) && !imports.includes('import java.util.Scanner;')) imports.push('import java.util.Scanner;')
  for (const line of imports) out += line + '\n'
  if (imports.length) out += '\n'
  out += `public class ${name} {\n`
  if (scannerField) out += sp(opts.indentPerLevel) + 'static Scanner scanner = new Scanner(System.in);\n\n'
  // Ein Unterprogramm allein ist nur eine Methode, ohne `main`.
  if (!ownHeader) {
    out += sp(opts.indentPerLevel) + `public static void main(String[] args)${files ? ' throws Exception' : ''} {\n`
    if (hasInput && !scannerField) {
      out += sp(innerBase) + 'Scanner scanner = new Scanner(System.in);\n'
      if (indentedBody !== '') out += '\n'
    }
    out += indentedBody
    if (indentedBody !== '' && !indentedBody.endsWith('\n')) out += '\n'
    out += sp(opts.indentPerLevel) + '}\n'
  }
  for (const [i, m] of methods.entries()) out += (i > 0 || !ownHeader ? '\n' : '') + m
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
