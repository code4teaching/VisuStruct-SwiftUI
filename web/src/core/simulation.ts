/**
 * Port von `VisuStructSimulationEngine.swift`: führt ein Struktogramm Schritt für Schritt aus.
 * Verzweigungen und Schleifen ersetzen sich beim Ausführen durch die Schritte ihres Rumpfs.
 */
import { ElementType, type VSCase, type VSDocument, type VSElement } from './model'

export type SimValue =
  | { kind: 'int'; value: number }
  | { kind: 'double'; value: number }
  | { kind: 'string'; value: string }
  | { kind: 'intArray'; value: number[] }
  | { kind: 'doubleArray'; value: number[] }
  | { kind: 'stringArray'; value: string[] }

export type SimValueType = 'int' | 'double' | 'string'

export type StepKind =
  | 'statement'
  | 'branch'
  | 'switchSelection'
  | 'forLoopStart'
  | 'forLoopCondition'
  | 'forLoopIncrement'
  | 'whileLoop'
  | 'doUntilLoop'
  | 'doUntilCondition'
  | 'infiniteLoop'

export interface SimStep {
  path: number[]
  text: string
  kind: StepKind
  cases?: VSCase[]
  loopBody?: VSElement[]
  forParts?: string[]
}

export interface InputRequest {
  variableName: string
  valueType: SimValueType
  prompt: string
}

/** Meldungen der Simulation, unabhängig von der Sprache. */
export type SimNotice =
  | { kind: 'finished' }
  | { kind: 'infiniteLoopWithoutBody' }
  | { kind: 'unsupportedStatement'; text: string }
  | { kind: 'invalidExpression'; text: string }
  | { kind: 'unknownVariable'; text: string }
  | { kind: 'divisionByZero' }
  | { kind: 'wholeNumberExpected' }
  | { kind: 'numberExpected' }
  | { kind: 'other'; text: string }

export interface SimState {
  stepIndex: number
  variables: Map<string, SimValue>
  outputLines: string[]
  inputRequest?: InputRequest
  /** Fehler zur letzten Eingabe (z. B. keine Zahl). */
  inputErrorNotice?: SimNotice
  lastTrace?: string
  /** Hinweis nach dem letzten Schritt (Ende, Fehler). */
  notice?: SimNotice
  /** Nach einem Fehler bleibt die Simulation auf dem fehlerhaften Schritt stehen. */
  isHalted: boolean
}

export function noticeEnglish(n: SimNotice): string {
  switch (n.kind) {
    case 'finished': return 'Simulation finished.'
    case 'infiniteLoopWithoutBody': return 'Infinite loop has no body.'
    case 'unsupportedStatement': return `Unsupported statement: ${n.text}`
    case 'invalidExpression': return `Invalid expression: ${n.text}`
    case 'unknownVariable': return `Unknown variable: ${n.text}`
    case 'divisionByZero': return 'Division by zero.'
    case 'wholeNumberExpected': return 'Please enter a whole number.'
    case 'numberExpected': return 'Please enter a number.'
    case 'other': return n.text
  }
}

export function noticeGerman(n: SimNotice): string {
  switch (n.kind) {
    case 'finished': return 'Simulation beendet.'
    case 'infiniteLoopWithoutBody': return 'Die Endlosschleife hat keinen Rumpf.'
    case 'unsupportedStatement': return `Nicht unterstützte Anweisung: ${n.text}`
    case 'invalidExpression': return `Ungültiger Ausdruck: ${n.text}`
    case 'unknownVariable': return `Unbekannte Variable: ${n.text}`
    case 'divisionByZero': return 'Division durch null.'
    case 'wholeNumberExpected': return 'Bitte eine ganze Zahl eingeben.'
    case 'numberExpected': return 'Bitte eine Zahl eingeben.'
    case 'other': return n.text
  }
}

class SimulationError extends Error {
  constructor(readonly notice: SimNotice) {
    super(noticeEnglish(notice))
  }
}

const unsupported = (text: string) => new SimulationError({ kind: 'unsupportedStatement', text })
const invalid = (text: string) => new SimulationError({ kind: 'invalidExpression', text })
const unknownVar = (text: string) => new SimulationError({ kind: 'unknownVariable', text })
const divByZero = () => new SimulationError({ kind: 'divisionByZero' })

function toNotice(error: unknown): SimNotice {
  if (error instanceof SimulationError) return error.notice
  return { kind: 'other', text: error instanceof Error ? error.message : String(error) }
}

// MARK: - Werte

/** `%.12g` wie in C. */
function formatG12(value: number): string {
  if (value === 0) return '0'
  if (!Number.isFinite(value)) return Number.isNaN(value) ? 'nan' : value > 0 ? 'inf' : '-inf'
  const exp = Math.floor(Math.log10(Math.abs(Number(value.toPrecision(12)))))
  if (exp < -4 || exp >= 12) {
    const [mantissa, e] = value.toExponential(11).split('e')
    const m = mantissa.includes('.') ? mantissa.replace(/0+$/, '').replace(/\.$/, '') : mantissa
    const n = Number(e)
    return `${m}e${n < 0 ? '-' : '+'}${String(Math.abs(n)).padStart(2, '0')}`
  }
  const fixed = value.toFixed(Math.max(0, 11 - exp))
  return fixed.includes('.') ? fixed.replace(/0+$/, '').replace(/\.$/, '') : fixed
}

function formatDouble(value: number): string {
  if (Number.isFinite(value) && Math.round(value) === value) return value.toFixed(1)
  return formatG12(value)
}

export function describeValue(v: SimValue): string {
  switch (v.kind) {
    case 'int': return String(v.value)
    case 'double': return formatDouble(v.value)
    case 'string': return v.value
    case 'intArray': return '[' + v.value.map(String).join(', ') + ']'
    case 'doubleArray': return '[' + v.value.map(formatDouble).join(', ') + ']'
    case 'stringArray': return '[' + v.value.join(', ') + ']'
  }
}

function asDouble(v: SimValue): number {
  return v.kind === 'int' || v.kind === 'double' ? v.value : NaN
}

const int = (value: number): SimValue => ({ kind: 'int', value })
const dbl = (value: number): SimValue => ({ kind: 'double', value })

// MARK: - Zeichenklassen

const isWhitespace = (c: string | undefined) => c !== undefined && /\s/u.test(c)
const isLetter = (c: string) => /\p{L}/u.test(c)
const isNumberChar = (c: string) => /\p{N}/u.test(c)

function isIdentifier(text: string): boolean {
  const chars = Array.from(text)
  if (chars.length === 0 || !(isLetter(chars[0]) || chars[0] === '_')) return false
  return chars.every((c) => isLetter(c) || isNumberChar(c) || c === '_')
}

function valueTypeKeyword(text: string): SimValueType | undefined {
  switch (text.toLowerCase()) {
    case 'int': return 'int'
    case 'double': return 'double'
    case 'string': return 'string'
    default: return undefined
  }
}

function valueTypeOf(v: SimValue): SimValueType {
  return v.kind === 'int' ? 'int' : v.kind === 'double' ? 'double' : 'string'
}

function unquotedString(text: string): string | undefined {
  const chars = Array.from(text)
  if (chars.length < 2 || chars[0] !== '"' || chars[chars.length - 1] !== '"') return undefined
  return chars.slice(1, -1).join('').replaceAll('\\"', '"').replaceAll('\\n', '\n')
}

function normalizeNumericExpression(expression: string): string {
  return expression.replaceAll('(int)', '').replaceAll('(double)', '').trim()
}

/** Für jedes Zeichen: liegt es außerhalb von Klammern und String-Literalen? */
function topLevelMask(chars: string[]): boolean[] {
  const mask = new Array<boolean>(chars.length).fill(false)
  let depth = 0
  let inString = false
  let escaped = false
  chars.forEach((c, i) => {
    if (inString) {
      if (escaped) escaped = false
      else if (c === '\\') escaped = true
      else if (c === '"') inString = false
      return
    }
    switch (c) {
      case '"': inString = true; break
      case '(': case '[': depth += 1; break
      case ')': case ']': depth -= 1; break
      default: mask[i] = depth === 0
    }
  })
  return mask
}

function splitTopLevel(expression: string, separator: string): string[] {
  const chars = Array.from(expression)
  const sep = Array.from(separator)
  const mask = topLevelMask(chars)
  const parts: string[] = []
  let current: string[] = []
  let i = 0
  while (i < chars.length) {
    const end = i + sep.length
    if (end <= chars.length && sep.every((s, k) => chars[i + k] === s) && mask.slice(i, end).every(Boolean)) {
      parts.push(current.join('').trim())
      current = []
      i = end
      continue
    }
    current.push(chars[i])
    i += 1
  }
  parts.push(current.join('').trim())
  return parts
}

/** Erster Vergleichsoperator außerhalb von Klammern und Strings. */
function splitComparison(expression: string): { lhs: string; op: string; rhs: string } | undefined {
  const chars = Array.from(expression)
  const mask = topLevelMask(chars)
  for (let i = 0; i < chars.length; i++) {
    if (!mask[i]) continue
    let op: string | undefined
    if (i + 1 < chars.length && mask[i + 1]) {
      const pair = chars[i] + chars[i + 1]
      if (['>=', '<=', '==', '!='].includes(pair)) op = pair
    }
    if (op === undefined && (chars[i] === '<' || chars[i] === '>')) op = chars[i]
    if (op === undefined) continue
    const lhs = chars.slice(0, i).join('').trim()
    const rhs = chars.slice(i + op.length).join('').trim()
    return { lhs, op, rhs }
  }
  return undefined
}

/** Index der `)`, die die `(` bei `openIndex` schließt. */
function matchingCloseParenthesis(chars: string[], openIndex: number): number | undefined {
  let depth = 0
  let inString = false
  let escaped = false
  for (let i = openIndex; i < chars.length; i++) {
    const c = chars[i]
    if (inString) {
      if (escaped) escaped = false
      else if (c === '\\') escaped = true
      else if (c === '"') inString = false
      continue
    }
    if (c === '"') inString = true
    else if (c === '(') depth += 1
    else if (c === ')') {
      depth -= 1
      if (depth === 0) return i
    }
  }
  return undefined
}

/** `(a || b)` → `a || b`; `(a) && (b)` bleibt unverändert. */
function innerOfOuterParentheses(text: string): string | undefined {
  const chars = Array.from(text)
  if (chars[0] !== '(' || chars[chars.length - 1] !== ')' || matchingCloseParenthesis(chars, 0) !== chars.length - 1) {
    return undefined
  }
  return chars.slice(1, -1).join('').trim()
}

/** Java-Stil `name.equals("Anna")`. */
function parseEqualsCall(text: string): { lhs: string; rhs: string } | undefined {
  const chars = Array.from(text)
  const marker = Array.from('.equals(')
  if (chars[chars.length - 1] !== ')') return undefined
  const mask = topLevelMask(chars)
  for (let i = 0; i < chars.length; i++) {
    if (!mask[i] || i + marker.length > chars.length) continue
    if (!marker.every((m, k) => chars[i + k] === m)) continue
    const openIndex = i + marker.length - 1
    if (matchingCloseParenthesis(chars, openIndex) !== chars.length - 1) continue
    return {
      lhs: chars.slice(0, i).join('').trim(),
      rhs: chars.slice(openIndex + 1, -1).join('').trim(),
    }
  }
  return undefined
}

function stripConditionKeyword(text: string): string {
  const trimmed = text.trim()
  for (const keyword of ['if', 'while', 'until', 'switch']) {
    if (!trimmed.startsWith(keyword)) continue
    const after = trimmed.slice(keyword.length)
    if (!(after === '' || isWhitespace(after[0]) || after[0] === '(')) continue
    let stripped = after.trim()
    const inner = innerOfOuterParentheses(stripped)
    if (inner !== undefined) stripped = inner
    return stripped === '' ? 'true' : stripped
  }
  return trimmed === '' ? 'true' : trimmed
}

interface ArrayElementAccess {
  arrayName: string
  indexExpression: string
}

function parseArrayElementAccess(text: string): ArrayElementAccess | undefined {
  const trimmed = text.trim()
  const open = trimmed.indexOf('[')
  if (!trimmed.endsWith(']') || open < 0) return undefined
  const name = trimmed.slice(0, open).trim()
  if (!isIdentifier(name)) return undefined
  return { arrayName: name, indexExpression: trimmed.slice(open + 1, -1) }
}

function isAssignableTarget(text: string): boolean {
  return isIdentifier(text) || parseArrayElementAccess(text) !== undefined
}

function splitByPlusOutsideQuotes(expression: string): string[] {
  const parts: string[] = []
  let current = ''
  let inString = false
  let escaped = false
  for (const c of expression) {
    if (escaped) {
      current += c
      escaped = false
      continue
    }
    if (c === '\\') {
      current += c
      escaped = true
      continue
    }
    if (c === '"') {
      inString = !inString
      current += c
      continue
    }
    if (c === '+' && !inString) {
      parts.push(current)
      current = ''
      continue
    }
    current += c
  }
  if (inString) throw invalid(expression)
  parts.push(current)
  return parts
}

// MARK: - Zahlenausdrücke

type Token =
  | { t: 'number'; literal: string; value: number }
  | { t: 'identifier'; name: string }
  | { t: '+' | '-' | '*' | '/' | '%' | '.' | '(' | ')' | '[' | ']' }

function tokenize(expression: string): Token[] {
  const chars = Array.from(expression)
  const tokens: Token[] = []
  let i = 0
  while (i < chars.length) {
    const c = chars[i]
    if (isWhitespace(c)) {
      i += 1
      continue
    }
    if (isNumberChar(c) || (c === '.' && i + 1 < chars.length && isNumberChar(chars[i + 1]))) {
      const start = i
      let dots = 0
      while (i < chars.length) {
        if (chars[i] === '.') {
          dots += 1
          if (dots > 1) throw invalid(expression)
        } else if (!isNumberChar(chars[i])) {
          break
        }
        i += 1
      }
      const literal = chars.slice(start, i).join('')
      if (literal === '.' || !/^[0-9]*\.?[0-9]*$/.test(literal)) throw invalid(expression)
      tokens.push({ t: 'number', literal, value: Number(literal) })
      continue
    }
    if (isLetter(c) || c === '_') {
      const start = i
      while (i < chars.length && (isLetter(chars[i]) || isNumberChar(chars[i]) || chars[i] === '_')) i += 1
      tokens.push({ t: 'identifier', name: chars.slice(start, i).join('') })
      continue
    }
    if ('+-*/%.()[]'.includes(c)) {
      tokens.push({ t: c as '+' })
      i += 1
      continue
    }
    throw invalid(expression)
  }
  return tokens
}

class NumericParser {
  private index = 0
  constructor(private tokens: Token[], private variables: Map<string, SimValue>) {}

  parseInt(): number {
    const value = this.expression()
    if (this.index !== this.tokens.length) throw invalid('')
    if (!Number.isFinite(value)) throw invalid('')
    return Math.trunc(value)
  }

  parseDouble(): number {
    const value = this.expression()
    if (this.index !== this.tokens.length) throw invalid('')
    return value
  }

  private get current(): Token | undefined {
    return this.tokens[this.index]
  }

  /** Wie `current`, aber ohne Typverengung durch TypeScript nach vorherigen Prüfungen. */
  private kind(): Token['t'] | undefined {
    return this.tokens[this.index]?.t
  }

  private isIdent(name: string): boolean {
    const c = this.current
    return c?.t === 'identifier' && c.name === name
  }

  private expression(): number {
    let value = this.term()
    for (let tok = this.current; tok && (tok.t === '+' || tok.t === '-'); tok = this.current) {
      this.index += 1
      const rhs = this.term()
      value = tok.t === '+' ? value + rhs : value - rhs
    }
    return value
  }

  private term(): number {
    let value = this.factor()
    for (let tok = this.current; tok && (tok.t === '*' || tok.t === '/' || tok.t === '%'); tok = this.current) {
      this.index += 1
      const rhs = this.factor()
      if (tok.t === '*') {
        value *= rhs
      } else {
        if (rhs === 0) throw divByZero()
        value = tok.t === '/' ? value / rhs : value % rhs
      }
    }
    return value
  }

  private factor(): number {
    const token = this.current
    if (!token) throw invalid('')
    this.index += 1
    switch (token.t) {
      case 'number':
        return token.value
      case 'identifier': {
        const name = token.name
        if (name === 'Math' && this.kind() === '.') {
          this.index += 1
          if (!this.isIdent('random')) throw invalid(name)
          this.index += 1
          if (this.kind() !== '(') throw invalid('Math.random')
          this.index += 1
          if (this.kind() !== ')') throw invalid('Math.random')
          this.index += 1
          return Math.random()
        }
        const value = this.variables.get(name)
        if (!value) throw unknownVar(name)
        if (this.kind() === '.') {
          this.index += 1
          if (!this.isIdent('length')) throw invalid(name)
          this.index += 1
          if (this.kind() === '(') {
            this.index += 1
            if (this.kind() !== ')') throw invalid(`${name}.length`)
            this.index += 1
          }
          if (value.kind === 'intArray' || value.kind === 'doubleArray' || value.kind === 'stringArray') {
            return value.value.length
          }
          throw invalid(name)
        }
        if (this.kind() === '[') {
          this.index += 1
          const elementIndex = Math.trunc(this.expression())
          if (this.kind() !== ']') throw invalid(name)
          this.index += 1
          if (value.kind === 'intArray' || value.kind === 'doubleArray') {
            if (!(elementIndex >= 0 && elementIndex < value.value.length)) throw invalid(`${name}[${elementIndex}]`)
            return value.value[elementIndex]
          }
          throw invalid(name)
        }
        const numeric = asDouble(value)
        if (!Number.isFinite(numeric)) throw invalid(name)
        return numeric
      }
      case '-':
        return -this.factor()
      case '(': {
        const value = this.expression()
        if (this.kind() !== ')') throw invalid('')
        this.index += 1
        return value
      }
      default:
        throw invalid('')
    }
  }
}

// MARK: - Schritte

function stripTrailingSemicolon(text: string): string {
  let result = text.trim()
  while (result.endsWith(';')) result = result.slice(0, -1).trim()
  return result
}

function paddedForParts(parts: string[]): string[] {
  const result = parts.slice(0, 3)
  while (result.length < 3) result.push('')
  return result
}

function normalizedForParts(rawParts: string[]): string[] {
  const stripped = rawParts.map((p) => stripTrailingSemicolon(p).trim())
  if (stripped.length === 1 && stripped[0].includes(';')) {
    return paddedForParts(stripped[0].split(';').map((p) => p.trim()))
  }
  return paddedForParts(stripped)
}

function buildSteps(elements: VSElement[], pathPrefix: number[] = []): SimStep[] {
  const steps: SimStep[] = []
  elements.forEach((element, index) => {
    const path = [...pathPrefix, index]
    const text = element.textLines.join(' ').trim()
    switch (element.type) {
      case ElementType.anweisung:
        // Leere Anweisung und Platzhalter „ø“ werden übersprungen
        if (text !== '' && text !== 'ø') steps.push({ path, text, kind: 'statement' })
        break
      case ElementType.verzweigung:
        steps.push({ path, text: text || 'true', kind: 'branch', cases: element.cases })
        break
      case ElementType.fallauswahl:
        steps.push({ path, text: text || '0', kind: 'switchSelection', cases: element.cases })
        break
      case ElementType.forSchleife:
        steps.push({
          path,
          text,
          kind: 'forLoopStart',
          loopBody: element.loopBody,
          forParts: normalizedForParts(element.textLines),
        })
        break
      case ElementType.whileSchleife:
        steps.push({ path, text: text || 'true', kind: 'whileLoop', loopBody: element.loopBody })
        break
      case ElementType.doUntilSchleife:
        steps.push({ path, text: text || 'true', kind: 'doUntilLoop', loopBody: element.loopBody })
        break
      case ElementType.endlosschleife:
        steps.push({ path, text: text || 'true', kind: 'infiniteLoop', loopBody: element.loopBody })
        break
    }
  })
  return steps
}

function parseInputValue(rawValue: string, valueType: SimValueType): SimValue {
  const trimmed = rawValue.trim().replaceAll(',', '.')
  switch (valueType) {
    case 'int':
      if (!/^[+-]?[0-9]+$/.test(trimmed)) throw new SimulationError({ kind: 'wholeNumberExpected' })
      return int(Number(trimmed))
    case 'double':
      if (!/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)([eE][+-]?[0-9]+)?$/.test(trimmed)) {
        throw new SimulationError({ kind: 'numberExpected' })
      }
      return dbl(Number(trimmed))
    case 'string':
      return { kind: 'string', value: rawValue }
  }
}

function freshState(): SimState {
  return { stepIndex: 0, variables: new Map(), outputLines: [], isHalted: false }
}

type SwitchSelector = { kind: 'int'; value: number } | { kind: 'text'; value: string }

function matchingCaseIndex(selector: SwitchSelector, cases: VSCase[]): number | undefined {
  for (let i = 0; i < cases.length; i++) {
    const label = cases[i].name.trim()
    if (label.toLowerCase() === 'default') continue
    if (selector.kind === 'int') {
      if (/^[+-]?[0-9]+$/.test(label) && Number(label) === selector.value) return i
    } else if (unquotedString(label) === selector.value || label === selector.value) {
      return i
    }
  }
  return undefined
}

// MARK: - Engine

export class SimulationEngine {
  steps: SimStep[]
  state: SimState = freshState()

  constructor(document: VSDocument) {
    this.steps = buildSteps(document.elements)
  }

  get currentStepPath(): number[] | undefined {
    return this.steps[this.state.stepIndex]?.path
  }

  get canStep(): boolean {
    return !this.state.isHalted && !this.state.inputRequest && this.state.stepIndex < this.steps.length
  }

  /** Englischer Text von `notice` (Tests). */
  get message(): string | undefined {
    return this.state.notice && noticeEnglish(this.state.notice)
  }

  reset(document?: VSDocument): void {
    if (document) this.steps = buildSteps(document.elements)
    this.state = freshState()
  }

  step(): void {
    const state = this.state
    if (!this.canStep) {
      if (!state.inputRequest && !state.isHalted) state.notice = { kind: 'finished' }
      return
    }
    const step = this.steps[state.stepIndex]
    try {
      switch (step.kind) {
        case 'statement':
          this.executeStatement(step.text)
          break
        case 'branch': return this.executeBranch(step)
        case 'switchSelection': return this.executeSwitchSelection(step)
        case 'forLoopStart': return this.executeForLoopStart(step)
        case 'forLoopCondition': return this.executeForLoopCondition(step)
        case 'forLoopIncrement': return this.executeForLoopIncrement(step)
        case 'whileLoop': return this.executeWhileLoop(step)
        case 'doUntilLoop': return this.enterDoUntilLoop(step)
        case 'doUntilCondition': return this.executeDoUntilCondition(step)
        case 'infiniteLoop': return this.enterInfiniteLoop(step)
      }
      if (state.inputRequest) {
        state.notice = undefined
        return
      }
      state.stepIndex += 1
      state.notice = this.finishedIfAtEnd()
    } catch (error) {
      state.notice = toNotice(error)
      state.isHalted = true
    }
  }

  provideInput(rawValue: string): void {
    const request = this.state.inputRequest
    if (!request) return
    try {
      const value = parseInputValue(rawValue, request.valueType)
      this.assignValue(value, request.variableName)
      this.state.lastTrace = `${request.variableName} = input -> ${describeValue(value)}`
    } catch (error) {
      this.state.inputErrorNotice = toNotice(error)
      return
    }
    this.state.inputRequest = undefined
    this.state.inputErrorNotice = undefined
    this.state.stepIndex += 1
    this.state.notice = this.finishedIfAtEnd()
  }

  private finishedIfAtEnd(): SimNotice | undefined {
    return this.state.stepIndex >= this.steps.length ? { kind: 'finished' } : undefined
  }

  /** Ersetzt den aktuellen Schritt durch `replacement`. */
  private splice(replacement: SimStep[]): void {
    this.steps.splice(this.state.stepIndex, 1, ...replacement)
  }

  private noticeAfterEntering(bodySteps: SimStep[]): SimNotice | undefined {
    return bodySteps.length > 0 ? undefined : this.finishedIfAtEnd()
  }

  private executeBranch(step: SimStep): void {
    const cases = step.cases
    if (!cases || cases.length < 2) throw unsupported(step.text)
    const condition = stripConditionKeyword(step.text)
    const result = this.evaluateBool(condition)
    const selected = result ? 0 : 1
    const branchSteps = buildSteps(cases[selected].elements, [...step.path, selected])
    this.splice(branchSteps)
    this.state.lastTrace = `${condition} -> ${result}`
    this.state.notice = this.noticeAfterEntering(branchSteps)
  }

  private executeSwitchSelection(step: SimStep): void {
    const cases = step.cases
    if (!cases || cases.length === 0) throw unsupported(step.text)
    const selector = stripConditionKeyword(step.text)
    const value = this.evaluateSwitchSelector(selector)
    const selected = matchingCaseIndex(value, cases) ?? cases.length - 1
    const caseSteps = buildSteps(cases[selected].elements, [...step.path, selected])
    this.splice(caseSteps)
    this.state.lastTrace = `${selector} -> ${cases[selected].name}`
    this.state.notice = this.noticeAfterEntering(caseSteps)
  }

  private executeForLoopStart(step: SimStep): void {
    const parts = normalizedForParts(step.forParts ?? [step.text])
    if (parts[0] !== '') this.executeStatement(parts[0])
    this.splice([{ path: step.path, text: parts[1], kind: 'forLoopCondition', loopBody: step.loopBody, forParts: parts }])
  }

  private executeForLoopCondition(step: SimStep): void {
    const parts = normalizedForParts(step.forParts ?? [step.text])
    const condition = parts[1] === '' ? 'true' : parts[1]
    const shouldEnter = this.evaluateBool(condition)
    this.state.lastTrace = `${condition} -> ${shouldEnter}`
    if (shouldEnter) {
      const bodySteps = buildSteps(step.loopBody ?? [], [...step.path, 0])
      this.splice([
        ...bodySteps,
        { path: step.path, text: parts[2], kind: 'forLoopIncrement', loopBody: step.loopBody, forParts: parts },
        { path: step.path, text: parts[1], kind: 'forLoopCondition', loopBody: step.loopBody, forParts: parts },
      ])
    } else {
      this.splice([])
      this.state.notice = this.finishedIfAtEnd()
    }
  }

  private executeForLoopIncrement(step: SimStep): void {
    const increment = step.text.trim()
    if (increment !== '') this.executeIncrement(increment)
    this.splice([])
  }

  private executeWhileLoop(step: SimStep): void {
    const condition = stripConditionKeyword(step.text)
    const shouldEnter = this.evaluateBool(condition)
    this.state.lastTrace = `${condition} -> ${shouldEnter}`
    if (shouldEnter) {
      const bodySteps = buildSteps(step.loopBody ?? [], [...step.path, 0])
      this.splice([...bodySteps, { path: step.path, text: step.text, kind: 'whileLoop', loopBody: step.loopBody }])
      this.state.notice = this.noticeAfterEntering(bodySteps)
    } else {
      this.splice([])
      this.state.notice = this.finishedIfAtEnd()
    }
  }

  private enterDoUntilLoop(step: SimStep): void {
    const bodySteps = buildSteps(step.loopBody ?? [], [...step.path, 0])
    this.splice([...bodySteps, { path: step.path, text: step.text, kind: 'doUntilCondition', loopBody: step.loopBody }])
    this.state.notice = this.noticeAfterEntering(bodySteps)
  }

  private executeDoUntilCondition(step: SimStep): void {
    const condition = stripConditionKeyword(step.text)
    const shouldRepeat = this.evaluateBool(condition)
    this.state.lastTrace = `${condition} -> ${shouldRepeat}`
    if (shouldRepeat) {
      const bodySteps = buildSteps(step.loopBody ?? [], [...step.path, 0])
      this.splice([...bodySteps, { path: step.path, text: step.text, kind: 'doUntilCondition', loopBody: step.loopBody }])
    } else {
      this.splice([])
      this.state.notice = this.finishedIfAtEnd()
    }
  }

  private enterInfiniteLoop(step: SimStep): void {
    const bodySteps = buildSteps(step.loopBody ?? [], [...step.path, 0])
    this.splice([...bodySteps, { path: step.path, text: step.text, kind: 'infiniteLoop', loopBody: step.loopBody }])
    this.state.lastTrace = 'true -> true'
    this.state.notice = bodySteps.length > 0 ? undefined : { kind: 'infiniteLoopWithoutBody' }
  }

  // MARK: Anweisungen

  private executeStatement(rawText: string): void {
    const state = this.state
    const text = rawText.trim()
    const lower = text.toLowerCase()
    if (lower.startsWith('input:')) {
      state.inputRequest = this.parseInputRequest(text)
      state.inputErrorNotice = undefined
      return
    }

    if (lower.startsWith('output:') || lower.startsWith('print:')) {
      const expression = text.slice(lower.startsWith('output:') ? 'output:'.length : 'print:'.length)
      const rendered = this.renderOutputExpression(expression)
      const output = this.evaluateOutputExpression(expression)
      state.outputLines.push(output)
      state.lastTrace = `${rendered} -> ${output}`
      return
    }

    if (text.endsWith('++') || text.endsWith('--') || text.includes('+=') || text.includes('-=')) {
      this.executeIncrement(text)
      return
    }

    const equalsIndex = text.indexOf('=')
    if (equalsIndex < 0) throw unsupported(text)
    const left = text.slice(0, equalsIndex).trim()
    const expression = text.slice(equalsIndex + 1)
    const array = this.parseArrayDeclaration(left, expression)
    if (array) {
      state.variables.set(array.name, array.value)
      state.lastTrace = `${array.name} = new ${array.typeName}[${array.count}]`
      return
    }

    const target = this.parseAssignmentTarget(left)
    let rendered: string
    try {
      rendered = this.renderNumericExpression(expression)
    } catch {
      rendered = expression.trim()
    }
    let targetType = target.valueType
    if (!targetType) {
      try {
        targetType = this.inferTargetValueType(target.variableName)
      } catch {
        targetType = 'int'
      }
    }
    const value = this.evaluateExpression(expression, targetType)
    this.assignValue(value, target.variableName)
    state.lastTrace = `${target.variableName} = ${rendered} -> ${describeValue(value)}`
  }

  private executeIncrement(text: string): void {
    const vars = this.state.variables
    for (const [suffix, sign] of [['++', 1], ['--', -1]] as const) {
      if (!text.endsWith(suffix)) continue
      const name = text.slice(0, -2).trim()
      const old = vars.get(name)
      if (!isIdentifier(name) || !old) throw unsupported(text)
      const op = sign > 0 ? '+' : '-'
      if (old.kind === 'int') {
        vars.set(name, int(old.value + sign))
        this.state.lastTrace = `${name} = ${old.value} ${op} 1 -> ${old.value + sign}`
        return
      }
      if (old.kind === 'double') {
        const result = old.value + sign
        vars.set(name, dbl(result))
        this.state.lastTrace = `${name} = ${describeValue(old)} ${op} 1 -> ${describeValue(dbl(result))}`
        return
      }
      throw unsupported(text)
    }

    for (const [operator, sign] of [['+=', 1], ['-=', -1]] as const) {
      const at = text.indexOf(operator)
      if (at < 0) continue
      const name = text.slice(0, at).trim()
      const rhs = text.slice(at + 2)
      const old = vars.get(name)
      if (!isIdentifier(name) || !old) throw unsupported(text)
      const op = sign > 0 ? '+' : '-'
      if (old.kind === 'int') {
        const amount = this.evaluateInt(rhs)
        const result = old.value + sign * amount
        vars.set(name, int(result))
        this.state.lastTrace = `${name} = ${old.value} ${op} ${amount} -> ${result}`
        return
      }
      if (old.kind === 'double') {
        const amount = this.evaluateDouble(rhs)
        const result = old.value + sign * amount
        vars.set(name, dbl(result))
        this.state.lastTrace = `${name} = ${describeValue(old)} ${op} ${describeValue(dbl(amount))} -> ${describeValue(dbl(result))}`
        return
      }
      throw unsupported(text)
    }

    this.executeStatement(text)
  }

  private parseAssignmentTarget(text: string): { variableName: string; valueType?: SimValueType } {
    const parts = text.split(/\s+/u).filter(Boolean)
    let name: string
    let valueType: SimValueType | undefined
    if (parts.length === 1) {
      name = parts[0]
    } else if (parts.length === 2 && valueTypeKeyword(parts[0])) {
      name = parts[1]
      valueType = valueTypeKeyword(parts[0])
    } else if (parts.length === 3 && parts[0] === 'const' && valueTypeKeyword(parts[1])) {
      name = parts[2]
      valueType = valueTypeKeyword(parts[1])
    } else {
      throw unsupported(text)
    }
    if (!isAssignableTarget(name)) throw unsupported(text)
    return { variableName: name, valueType }
  }

  private parseInputRequest(text: string): InputRequest {
    const afterColon = text.slice('input:'.length).trim()
    // Wie Swift `split(maxSplits: 2)`: zwei Wörter, dann der Rest.
    const match = /^(\S+)(?:\s+(\S+))?(?:\s+([\s\S]*))?$/u.exec(afterColon)
    if (!match) throw unsupported(text)
    const parts = [match[1], match[2], match[3]].filter((p): p is string => p !== undefined)
    let target: string
    let valueType: SimValueType
    let promptRaw: string
    const explicitType = valueTypeKeyword(parts[0])
    if (parts.length >= 2 && explicitType) {
      target = parts[1]
      valueType = explicitType
      promptRaw = (parts[2] ?? '').trim()
    } else {
      target = parts[0]
      valueType = this.inferTargetValueType(target)
      promptRaw = (parts[1] ?? '').trim()
    }
    if (!isAssignableTarget(target)) throw unsupported(text)
    const prompt = unquotedString(promptRaw) ?? promptRaw
    return { variableName: target, valueType, prompt: prompt === '' ? `${target}:` : prompt }
  }

  private parseArrayDeclaration(
    left: string,
    expression: string,
  ): { name: string; typeName: string; count: number; value: SimValue } | undefined {
    const leftParts = left.split(/\s+/u).filter(Boolean)
    if (leftParts.length !== 2 || !leftParts[0].endsWith('[]')) return undefined
    const typeName = leftParts[0].slice(0, -2)
    const valueType = valueTypeKeyword(typeName)
    const name = leftParts[1]
    if (!valueType || !isIdentifier(name)) throw unsupported(left)

    const trimmed = expression.trim()
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const items = trimmed.slice(1, -1).split(',').map((s) => s.trim())
      let value: SimValue
      switch (valueType) {
        case 'int':
          value = { kind: 'intArray', value: items.map((i) => this.evaluateInt(i)) }
          break
        case 'double':
          value = { kind: 'doubleArray', value: items.map((i) => this.evaluateDouble(i)) }
          break
        case 'string':
          value = { kind: 'stringArray', value: items.map((i) => unquotedString(i) ?? this.evaluateOutputExpression(i)) }
          break
      }
      return { name, typeName, count: items.length, value }
    }

    const prefix = `new ${typeName}[`
    if (!trimmed.startsWith(prefix) || !trimmed.endsWith(']')) throw unsupported(expression)
    const sizeExpression = trimmed.slice(prefix.length, -1)
    const count = this.evaluateInt(sizeExpression)
    if (count < 0) throw invalid(sizeExpression)
    const value: SimValue =
      valueType === 'int'
        ? { kind: 'intArray', value: new Array(count).fill(0) }
        : valueType === 'double'
          ? { kind: 'doubleArray', value: new Array(count).fill(0) }
          : { kind: 'stringArray', value: new Array(count).fill('') }
    return { name, typeName, count, value }
  }

  private arrayIndex(expression: string): number {
    const index = this.evaluateInt(expression)
    if (index < 0) throw invalid(expression)
    return index
  }

  private evaluateReference(text: string): SimValue | undefined {
    const trimmed = text.trim()
    const direct = this.state.variables.get(trimmed)
    if (direct) return direct
    const access = parseArrayElementAccess(trimmed)
    if (!access) return undefined
    return this.valueInArray(access.arrayName, this.arrayIndex(access.indexExpression))
  }

  private valueInArray(name: string, index: number): SimValue {
    const value = this.state.variables.get(name)
    if (!value) throw unknownVar(name)
    if (value.kind !== 'intArray' && value.kind !== 'doubleArray' && value.kind !== 'stringArray') throw invalid(name)
    if (index >= value.value.length) throw invalid(`${name}[${index}]`)
    switch (value.kind) {
      case 'intArray': return int(value.value[index])
      case 'doubleArray': return dbl(value.value[index])
      case 'stringArray': return { kind: 'string', value: value.value[index] }
    }
  }

  private inferTargetValueType(target: string): SimValueType {
    const trimmed = target.trim()
    const direct = this.state.variables.get(trimmed)
    if (direct) return valueTypeOf(direct)
    const access = parseArrayElementAccess(trimmed)
    if (access) {
      const value = this.state.variables.get(access.arrayName)
      if (!value) throw unknownVar(access.arrayName)
      if (value.kind === 'intArray') return 'int'
      if (value.kind === 'doubleArray') return 'double'
      if (value.kind === 'stringArray') return 'string'
      throw invalid(access.arrayName)
    }
    throw unsupported(target)
  }

  private assignValue(value: SimValue, target: string): void {
    const trimmed = target.trim()
    const access = parseArrayElementAccess(trimmed)
    if (!access) {
      this.state.variables.set(trimmed, value)
      return
    }
    const index = this.arrayIndex(access.indexExpression)
    const old = this.state.variables.get(access.arrayName)
    if (!old) throw unknownVar(access.arrayName)
    let updated: SimValue
    if (old.kind === 'intArray' && value.kind === 'int') {
      updated = { kind: 'intArray', value: [...old.value] }
    } else if (old.kind === 'doubleArray' && (value.kind === 'double' || value.kind === 'int')) {
      updated = { kind: 'doubleArray', value: [...old.value] }
    } else if (old.kind === 'stringArray' && value.kind === 'string') {
      updated = { kind: 'stringArray', value: [...old.value] }
    } else {
      throw invalid(trimmed)
    }
    if (index >= updated.value.length) throw invalid(trimmed)
    ;(updated.value as unknown[])[index] = value.value
    this.state.variables.set(access.arrayName, updated)
  }

  // MARK: Ausdrücke

  private evaluateOutputExpression(expression: string): string {
    return splitByPlusOutsideQuotes(expression)
      .map((part) => {
        const trimmed = part.trim()
        const literal = unquotedString(trimmed)
        if (literal !== undefined) return literal
        const ref = this.evaluateReference(trimmed)
        if (ref) return describeValue(ref)
        return describeValue(this.evaluateNumeric(trimmed))
      })
      .join('')
  }

  private renderOutputExpression(expression: string): string {
    return splitByPlusOutsideQuotes(expression)
      .map((part) => {
        const trimmed = part.trim()
        if (unquotedString(trimmed) !== undefined) return trimmed
        const ref = this.evaluateReference(trimmed)
        if (ref) return describeValue(ref)
        try {
          return this.renderNumericExpression(trimmed)
        } catch {
          return trimmed
        }
      })
      .join(' + ')
  }

  private evaluateExpression(expression: string, valueType: SimValueType): SimValue {
    switch (valueType) {
      case 'int':
        return int(this.evaluateInt(expression))
      case 'double':
        return dbl(this.evaluateDouble(expression))
      case 'string': {
        const trimmed = expression.trim()
        const literal = unquotedString(trimmed)
        if (literal !== undefined) return { kind: 'string', value: literal }
        const ref = this.evaluateReference(trimmed)
        if (ref) return { kind: 'string', value: describeValue(ref) }
        return { kind: 'string', value: this.evaluateOutputExpression(expression) }
      }
    }
  }

  private evaluateNumeric(expression: string): SimValue {
    const value = this.evaluateDouble(expression)
    return Number.isFinite(value) && Math.round(value) === value ? int(value) : dbl(value)
  }

  private parser(expression: string): NumericParser {
    return new NumericParser(tokenize(normalizeNumericExpression(expression)), this.state.variables)
  }

  private evaluateInt(expression: string): number {
    return this.parser(expression).parseInt()
  }

  private evaluateDouble(expression: string): number {
    return this.parser(expression).parseDouble()
  }

  /** Bedingungen wie in Java: `||` vor `&&` vor `!`, Klammern, Vergleiche von Zahlen und Strings, `a.equals(b)`. */
  private evaluateBool(expression: string): boolean {
    const trimmed = expression.trim()
    if (trimmed === 'true') return true
    if (trimmed === 'false') return false

    const orParts = splitTopLevel(trimmed, '||')
    if (orParts.length > 1) return orParts.some((p) => this.evaluateBool(p))

    const andParts = splitTopLevel(trimmed, '&&')
    if (andParts.length > 1) return andParts.every((p) => this.evaluateBool(p))

    if (trimmed.startsWith('!') && !trimmed.startsWith('!=')) return !this.evaluateBool(trimmed.slice(1))

    const inner = innerOfOuterParentheses(trimmed)
    if (inner !== undefined) return this.evaluateBool(inner)

    const call = parseEqualsCall(trimmed)
    if (call) return this.evaluateComparison(call.lhs, '==', call.rhs)

    const comparison = splitComparison(trimmed)
    if (comparison) return this.evaluateComparison(comparison.lhs, comparison.op, comparison.rhs)

    if (this.stringOperand(trimmed) !== undefined) throw invalid(trimmed)
    return this.evaluateDouble(trimmed) !== 0
  }

  private evaluateComparison(lhs: string, op: string, rhs: string): boolean {
    const ls = this.stringOperand(lhs)
    const rs = this.stringOperand(rhs)
    let left: string | number
    let right: string | number
    if (ls !== undefined || rs !== undefined) {
      if (ls === undefined || rs === undefined) throw invalid(`${lhs} ${op} ${rhs}`)
      left = ls
      right = rs
    } else {
      left = this.evaluateDouble(lhs)
      right = this.evaluateDouble(rhs)
    }
    switch (op) {
      case '==': return left === right
      case '!=': return left !== right
      case '<': return left < right
      case '<=': return left <= right
      case '>': return left > right
      case '>=': return left >= right
      default: throw invalid(`${lhs} ${op} ${rhs}`)
    }
  }

  /** String-Literal oder String-Variable (auch Element eines String-Arrays); sonst `undefined`. */
  private stringOperand(text: string): string | undefined {
    const trimmed = text.trim()
    const literal = unquotedString(trimmed)
    if (literal !== undefined) return literal
    const ref = this.evaluateReference(trimmed)
    return ref?.kind === 'string' ? ref.value : undefined
  }

  private evaluateSwitchSelector(selector: string): SwitchSelector {
    const trimmed = selector.trim()
    const literal = unquotedString(trimmed)
    if (literal !== undefined) return { kind: 'text', value: literal }
    const variable = this.state.variables.get(trimmed)
    if (variable) {
      switch (variable.kind) {
        case 'int': return { kind: 'int', value: variable.value }
        case 'double': return { kind: 'int', value: Math.trunc(variable.value) }
        case 'string': return { kind: 'text', value: variable.value }
        default: throw invalid(trimmed)
      }
    }
    if (/^[+-]?[0-9]+$/.test(trimmed)) return { kind: 'int', value: Number(trimmed) }
    return { kind: 'int', value: this.evaluateInt(trimmed) }
  }

  private renderNumericExpression(expression: string): string {
    return tokenize(normalizeNumericExpression(expression))
      .map((token) => {
        if (token.t === 'number') return token.literal
        if (token.t === 'identifier') {
          const value = this.state.variables.get(token.name)
          if (!value) throw unknownVar(token.name)
          return describeValue(value)
        }
        return token.t
      })
      .join(' ')
      .replaceAll('( ', '(')
      .replaceAll(' )', ')')
      .replaceAll(' . ', '.')
      .replaceAll('[ ', '[')
      .replaceAll(' ]', ']')
  }
}
