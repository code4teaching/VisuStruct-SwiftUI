/**
 * Spiel „Wahr oder falsch?“ (Block `::: spiel` im Lernbereich): Werte und eine Bedingung zeigen,
 * die Antwort prüfen und die Auswertung Schritt für Schritt erklären.
 */

export type GameVar = { name: string; kind: 'int'; min: number; max: number } | { name: string; kind: 'boolean' }

export interface BoolGame {
  vars: GameVar[]
  /** Bedingungen vom leichten zum schweren. */
  conditions: string[]
}

export type Values = Record<string, number | boolean>

export class GameFormatError extends Error {}

/** Zeilen `alter: 8..20`, `schueler: boolean` und `? bedingung`. */
export function parseBoolGame(lines: string[], file: string): BoolGame {
  const vars: GameVar[] = []
  const conditions: string[] = []
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('?')) {
      const condition = line.slice(1).trim()
      evaluate(condition, sampleValues(vars)) // Fehler früh melden
      conditions.push(condition)
      continue
    }
    const m = /^([A-Za-z_]\w*)\s*:\s*(?:(-?\d+)\s*\.\.\s*(-?\d+)|(boolean))$/.exec(line)
    if (!m) throw new GameFormatError(`${file}: Unbekannte Zeile im Spiel: „${line}“`)
    vars.push(m[4] ? { name: m[1], kind: 'boolean' } : { name: m[1], kind: 'int', min: Number(m[2]), max: Number(m[3]) })
  }
  if (!conditions.length) throw new GameFormatError(`${file}: Das Spiel braucht mindestens eine Zeile „? bedingung“.`)
  return { vars, conditions }
}

function sampleValues(vars: GameVar[]): Values {
  return Object.fromEntries(vars.map((v) => [v.name, v.kind === 'boolean' ? true : v.min]))
}

// MARK: - Auswerten

type Token = { kind: 'num'; value: number } | { kind: 'bool'; value: boolean } | { kind: 'name'; value: string } | { kind: 'op'; value: string }

function tokenize(text: string): Token[] {
  const out: Token[] = []
  const re = /\s*(?:(\d+)|(true|false)\b|([A-Za-z_]\w*)|(&&|\|\||==|!=|<=|>=|<|>|!|\(|\)))/y
  let pos = 0
  while (pos < text.length) {
    if (/^\s*$/.test(text.slice(pos))) break
    re.lastIndex = pos
    const m = re.exec(text)
    if (!m) throw new GameFormatError(`Unerwartetes Zeichen in „${text}“ bei „${text.slice(pos)}“`)
    pos = re.lastIndex
    if (m[1] !== undefined) out.push({ kind: 'num', value: Number(m[1]) })
    else if (m[2] !== undefined) out.push({ kind: 'bool', value: m[2] === 'true' })
    else if (m[3] !== undefined) out.push({ kind: 'name', value: m[3] })
    else out.push({ kind: 'op', value: m[4] })
  }
  return out
}

/** Bedingung mit diesen Werten auswerten (nur ganze Zahlen, Wahrheitswerte, Vergleiche, !, && und ||). */
export function evaluate(text: string, values: Values): boolean {
  const tokens = tokenize(text)
  let i = 0
  const peek = () => tokens[i]
  const isOp = (v: string) => peek()?.kind === 'op' && peek()!.value === v
  const fail = (): never => {
    throw new GameFormatError(`Bedingung nicht lesbar: „${text}“`)
  }

  const primary = (): number | boolean => {
    const tok = tokens[i++] ?? fail()
    if (tok.kind === 'num' || tok.kind === 'bool') return tok.value
    if (tok.kind === 'name') {
      if (!(tok.value in values)) throw new GameFormatError(`Unbekannte Variable „${tok.value}“ in „${text}“`)
      return values[tok.value]
    }
    if (tok.value === '(') {
      const v = or()
      if (!isOp(')')) fail()
      i++
      return v
    }
    if (tok.value === '!') {
      const v = primary()
      if (typeof v !== 'boolean') fail()
      return !v
    }
    return fail()
  }
  const comparison = (): number | boolean => {
    const left = primary()
    const op = peek()
    if (op?.kind === 'op' && ['==', '!=', '<', '<=', '>', '>='].includes(op.value)) {
      i++
      const right = primary()
      switch (op.value) {
        case '==':
          return left === right
        case '!=':
          return left !== right
      }
      if (typeof left !== 'number' || typeof right !== 'number') fail()
      const [a, b] = [left as number, right as number]
      return op.value === '<' ? a < b : op.value === '<=' ? a <= b : op.value === '>' ? a > b : a >= b
    }
    return left
  }
  const and = (): number | boolean => {
    let v = comparison()
    while (isOp('&&')) {
      i++
      const r = comparison()
      v = (v as boolean) && (r as boolean)
    }
    return v
  }
  const or = (): number | boolean => {
    let v = and()
    while (isOp('||')) {
      i++
      const r = and()
      v = (v as boolean) || (r as boolean)
    }
    return v
  }
  const result = or()
  if (i !== tokens.length || typeof result !== 'boolean') return fail()
  return result
}

// MARK: - Erklären

/**
 * Auswertung in Zwischenschritten, z. B. `alter >= 12 && alter < 18` →
 * `15 >= 12 && 15 < 18` → `true && true` → `true`.
 */
export function explain(text: string, values: Values): string[] {
  const steps = [text]
  const substituted = text.replace(/\b[A-Za-z_]\w*\b/g, (name) => (name in values ? String(values[name]) : name))
  if (substituted !== text) steps.push(substituted)
  // Jeden Vergleich durch sein Ergebnis ersetzen.
  const compared = substituted.replace(/(-?\d+|true|false)\s*(==|!=|<=|>=|<|>)\s*(-?\d+|true|false)/g, (m) => String(evaluate(m, {})))
  if (compared !== steps[steps.length - 1]) steps.push(compared)
  const result = String(evaluate(text, values))
  if (result !== steps[steps.length - 1]) steps.push(result)
  return steps
}

// MARK: - Runden

/** Zahlen, mit denen in der Bedingung verglichen wird: dort und knapp daneben sind die spannenden Fälle. */
function edgeValues(condition: string, name: string): number[] {
  const out: number[] = []
  const re = new RegExp(`\\b${name}\\s*(?:==|!=|<=|>=|<|>)\\s*(-?\\d+)|(-?\\d+)\\s*(?:==|!=|<=|>=|<|>)\\s*${name}\\b`, 'g')
  for (const m of condition.matchAll(re)) {
    const c = Number(m[1] ?? m[2])
    out.push(c - 1, c, c + 1)
  }
  return out
}

export interface Round {
  condition: string
  values: Values
  answer: boolean
}

/** Runde `index` von `count`: je später, desto schwerer die Bedingung. */
export function makeRound(game: BoolGame, index: number, count: number, random: () => number = Math.random): Round {
  const n = game.conditions.length
  const base = Math.floor((index * n) / count)
  const pick = Math.min(n - 1, base + (random() < 0.5 ? 0 : 1))
  const condition = game.conditions[pick]
  const values: Values = {}
  for (const v of game.vars) {
    if (v.kind === 'boolean') {
      values[v.name] = random() < 0.5
      continue
    }
    const edges = edgeValues(condition, v.name).filter((x) => x >= v.min && x <= v.max)
    values[v.name] = edges.length && random() < 0.6 ? edges[Math.floor(random() * edges.length)] : v.min + Math.floor(random() * (v.max - v.min + 1))
  }
  return { condition, values, answer: evaluate(condition, values) }
}

/** Nur die Variablen, die in der Bedingung vorkommen. */
export function usedValues(round: Round): [string, number | boolean][] {
  return Object.entries(round.values).filter(([name]) => new RegExp(`\\b${name}\\b`).test(round.condition))
}
