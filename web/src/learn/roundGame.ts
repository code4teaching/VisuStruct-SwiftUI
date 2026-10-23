/**
 * Rundenspiele zu Swing (Block `::: spiel zuhoerer|vertrag|layout`): In jeder Runde Code zeigen, eine
 * Frage mit Antworten stellen und die richtige Antwort erklären.
 *
 * - `zuhoerer` („Wer hört zu?“): Ein nachgebautes Fenster mit den Knöpfen aus dem Code. Nach der Antwort
 *   werden die Klicks abgespielt: Das Ereignis läuft zum Zuhörer, dessen Zeilen leuchten auf.
 * - `vertrag` („Vertrag erfüllt?“): Klassen, die ein Interface erfüllen sollen.
 * - `layout` („Wo landet der Knopf?“): Die Antworten sind kleine Fenster (`grid: A B / C D`, …).
 * - `bombe` („Bombe entschärfen“): Code mit genau einer falschen Zeile und ein Countdown (`zeit:` Sekunden je
 *   Runde). Man tippt auf die Zeile; `fehler:` ist ihre Nummer (ab 1), `besser:` die richtige Zeile. Mit `daten: csv`
 *   ist der „Code“ eine CSV-Datei statt Java.
 * - `frage`: Code (auch leer) und eine Frage mit Antworten. `\n` in einer Antwort beginnt eine neue Zeile; solche
 *   Antworten erscheinen als kleine Datei.
 *
 * Format (Schlüsselwörter wie in den anderen Blöcken auf Deutsch, auch in den Übersetzungen):
 *
 *     titel: Spiel: Vertrag erfüllt?
 *     intro: Ludwig zeigt dir …
 *     antworten: erfüllt | nicht erfüllt      (für alle Runden, dann je Runde `richtig: …`)
 *     frage: …                                 (für alle Runden, je Runde überschreibbar)
 *
 *     runde:
 *         Code, mit vier Leerzeichen eingerückt
 *     klicks: A, B                             (nur zuhoerer: Beschriftungen der Knöpfe)
 *     fehler: 2                                (nur bombe, statt Antworten)
 *     besser: System.out.println(i);           (nur bombe)
 *     - Antwort
 *     - [x] richtige Antwort
 *     > Erklärung
 */

export type RoundGameKind = 'zuhoerer' | 'vertrag' | 'layout' | 'bombe' | 'frage'

export interface RoundOption {
  text: string
  right: boolean
}

export interface Round {
  code: string
  question: string
  options: RoundOption[]
  explanation: string
  /** Beschriftungen der geklickten Knöpfe (nur `zuhoerer`). */
  clicks: string[]
  /** Nur `bombe`: Nummer der falschen Zeile (ab 1) und die richtige Zeile. */
  wrongLine?: number
  fix?: string
}

export interface RoundGame {
  kind: RoundGameKind
  title: string
  intro: string
  /** Nur `bombe`: Sekunden je Runde. */
  seconds?: number
  /** Nur `bombe`: Was in den Runden steht, Java (Standard) oder eine CSV-Datei. */
  data?: 'csv'
  rounds: Round[]
}

export class RoundGameError extends Error {}

export function isRoundGameKind(arg: string): arg is RoundGameKind {
  return arg === 'zuhoerer' || arg === 'vertrag' || arg === 'layout' || arg === 'bombe' || arg === 'frage'
}

export function parseRoundGame(kind: RoundGameKind, lines: string[], file: string): RoundGame {
  const fail = (msg: string): never => {
    throw new RoundGameError(`${file}: ${msg}`)
  }
  let title = ''
  let intro = ''
  let question = ''
  let answers: string[] = []
  let seconds: number | undefined
  let data: 'csv' | undefined
  const rounds: (Round & { rightText?: string })[] = []
  let current: (Round & { rightText?: string }) | undefined
  let inCode = false
  for (const raw of lines) {
    const line = raw.trim()
    if (current && inCode && (/^ {4}|^\t/.test(raw) || line === '')) {
      current.code += (current.code ? '\n' : '') + raw.replace(/^( {4}|\t)/, '')
      continue
    }
    inCode = false
    if (!line) continue
    const key = /^(titel|intro|antworten|frage|runde|klicks|richtig|zeit|fehler|besser|daten):\s*(.*)$/.exec(line)
    if (key) {
      const [, name, value] = key
      if (name === 'runde') {
        current = { code: '', question, options: [], explanation: '', clicks: [] }
        rounds.push(current)
        inCode = true
      } else if (!current) {
        if (name === 'titel') title = value
        else if (name === 'intro') intro = value
        else if (name === 'antworten') answers = value.split('|').map((a) => a.trim())
        else if (name === 'frage') question = value
        else if (name === 'zeit') seconds = Number(value)
        else if (name === 'daten') data = value === 'csv' ? value : fail(`„daten:“ kennt nur „csv“.`)
        else fail(`„${name}:“ gehört in eine Runde.`)
      } else if (name === 'frage') current.question = value
      else if (name === 'fehler') current.wrongLine = Number(value)
      else if (name === 'besser') current.fix = value
      else if (name === 'klicks') current.clicks = value.split(',').map((c) => c.trim()).filter(Boolean)
      else if (name === 'richtig') current.rightText = value
      else fail(`„${name}:“ gehört vor die erste Runde.`)
      continue
    }
    if (!current) fail(`Unbekannte Zeile vor der ersten Runde: „${line}“`)
    const round = current!
    const option = /^-\s+(\[x\]\s+)?(.+)$/.exec(line)
    if (option) round.options.push({ text: option[2].trim().replaceAll('\\n', '\n'), right: !!option[1] })
    else if (line.startsWith('>')) round.explanation += (round.explanation ? ' ' : '') + line.slice(1).trim()
    else fail(`Unbekannte Zeile im Spiel: „${line}“`)
  }
  if (!title) fail('Das Spiel braucht eine Zeile „titel:“.')
  if (!rounds.length) fail('Das Spiel braucht mindestens eine „runde:“.')
  rounds.forEach((round, i) => {
    round.code = round.code.replace(/\n+$/, '')
    if (kind === 'bombe') {
      const lines = round.code.split('\n')
      const n = round.wrongLine
      if (!n || !Number.isInteger(n) || n < 1 || n > lines.length || !lines[n - 1].trim()) fail(`Runde ${i + 1}: „fehler:“ muss eine Zeile des Codes sein.`)
      if (!round.fix) fail(`Runde ${i + 1}: „besser:“ fehlt.`)
      if (round.options.length) fail(`Runde ${i + 1}: Bei „bombe“ gibt es keine Antworten, man tippt auf die Zeile.`)
      if (!round.question) fail(`Runde ${i + 1}: keine Frage.`)
      return
    }
    if (!round.options.length) {
      if (!answers.length) fail(`Runde ${i + 1}: keine Antworten.`)
      if (!round.rightText || !answers.includes(round.rightText)) fail(`Runde ${i + 1}: „richtig:“ muss eine der Antworten sein.`)
      round.options = answers.map((text) => ({ text, right: text === round.rightText }))
    }
    if (round.options.filter((o) => o.right).length !== 1) fail(`Runde ${i + 1}: genau eine Antwort muss richtig sein.`)
    if (!round.question) fail(`Runde ${i + 1}: keine Frage.`)
    if (kind === 'layout') round.options.forEach((o) => parseLayoutPicture(o.text, `Runde ${i + 1}`, fail))
    if (kind === 'zuhoerer') {
      try {
        const window = parseSwingWindow(round.code)
        for (const c of round.clicks) if (!window.buttons.some((b) => b.caption === c)) fail(`Runde ${i + 1}: Knopf „${c}“ gibt es nicht.`)
        simulate(window, round.clicks)
      } catch (err) {
        if (err instanceof RoundGameError) throw err
        fail(`Runde ${i + 1}: ${(err as Error).message}`)
      }
    }
    delete round.rightText
  })
  if (kind === 'bombe' && !(seconds && seconds > 0)) fail('„bombe“ braucht „zeit:“ mit den Sekunden je Runde.')
  return { kind, title, intro, ...(kind === 'bombe' ? { seconds, ...(data ? { data } : {}) } : {}), rounds }
}

// MARK: - Layout-Bilder

export type LayoutPicture =
  | { kind: 'grid'; rows: string[][] }
  | { kind: 'flow'; rows: string[][] }
  | { kind: 'border'; areas: Partial<Record<'N' | 'S' | 'W' | 'E' | 'C', string>> }

/** `grid: A B / C D`, `flow: A B C`, `border: N=A C=B S=C`. */
export function parseLayoutPicture(text: string, where = '', fail: (msg: string) => never = (m) => { throw new RoundGameError(m) }): LayoutPicture {
  const m = /^(grid|flow|border):\s*(.+)$/.exec(text)
  if (!m) return fail(`${where}: Antwort „${text}“ ist kein Fensterbild (grid:, flow: oder border:).`)
  if (m[1] === 'border') {
    const areas: Partial<Record<'N' | 'S' | 'W' | 'E' | 'C', string>> = {}
    for (const part of m[2].split(/\s+/)) {
      const a = /^([NSWEC])=(.+)$/.exec(part)
      if (!a) fail(`${where}: „${part}“ im BorderLayout-Bild verstehe ich nicht (z. B. N=A).`)
      areas[a![1] as 'N'] = a![2]
    }
    return { kind: 'border', areas }
  }
  const rows = m[2].split('/').map((r) => r.trim().split(/\s+/).filter(Boolean))
  return { kind: m[1] as 'grid' | 'flow', rows }
}

// MARK: - Nachgebautes Fenster für „Wer hört zu?“

export interface SwingButton {
  name: string
  caption: string
}

export interface SwingListener {
  button: string
  /** Zeilen des Zuhörers im Code (ab 0, einschließlich). */
  from: number
  to: number
  statements: SwingStatement[]
}

/** Eine Anweisung im Zuhörer: einfach (`text.setText(…)`) oder `if (…) { … } else { … }`. */
export type SwingStatement = string | { condition: string; then: SwingStatement[]; otherwise: SwingStatement[] }

export interface SwingWindow {
  title: string
  buttons: SwingButton[]
  /** Beschriftungen (JLabel) mit ihrem Starttext, in der Reihenfolge im Code. */
  labels: { name: string; text: string }[]
  ints: Record<string, number>
  listeners: SwingListener[]
}

const str = '"((?:[^"\\\\]|\\\\.)*)"'

/**
 * Liest Knöpfe, Beschriftungen, int-Variablen und Zuhörer aus einfachem Swing-Code. Ein Zuhörer steht direkt am
 * Knopf (`knopf.addActionListener(e -> …)`) oder als Variable (`ActionListener z = e -> …;`), die mit
 * `knopf.addActionListener(z);` an mehreren Knöpfen hängen kann.
 */
export function parseSwingWindow(code: string): SwingWindow {
  const lines = code.split('\n')
  const win: SwingWindow = { title: '', buttons: [], labels: [], ints: {}, listeners: [] }
  const named = new Map<string, Omit<SwingListener, 'button'>>()
  /** Zuhörer ab Zeile i, `rest` ist der Text hinter dem Pfeil; `end` schließt einen Block ab (`});` oder `};`). */
  const lambda = (i: number, rest: string, end: string): Omit<SwingListener, 'button'> => {
    if (rest.startsWith('{')) {
      let j = i + 1
      const body: string[] = []
      while (j < lines.length && lines[j].trim() !== end) body.push(lines[j++].trim())
      if (j >= lines.length) throw new Error(`Dem Zuhörer fehlt „${end}“.`)
      return { from: i, to: j, statements: parseStatements(body.join(' ')) }
    }
    const inner = end === '});' ? rest.replace(/\)\s*;\s*$/, '') : rest.replace(/;\s*$/, '')
    return { from: i, to: i, statements: parseStatements(inner) }
  }
  const button = (name: string) => {
    if (!win.buttons.some((b) => b.name === name)) throw new Error(`Knopf ${name} ist nicht angelegt.`)
    return name
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    let m: RegExpExecArray | null
    if ((m = new RegExp(`^JFrame\\s+\\w+\\s*=\\s*new JFrame\\(${str}\\)`).exec(line))) win.title = m[1]
    else if ((m = new RegExp(`^JButton\\s+(\\w+)\\s*=\\s*new JButton\\(${str}\\)`).exec(line))) win.buttons.push({ name: m[1], caption: m[2] })
    else if ((m = new RegExp(`^JLabel\\s+(\\w+)\\s*=\\s*new JLabel\\(${str}`).exec(line))) win.labels.push({ name: m[1], text: m[2] })
    else if ((m = /^(?:static\s+)?int\s+(\w+)\s*=\s*(-?\d+)\s*;/.exec(line))) win.ints[m[1]] = Number(m[2])
    else if ((m = /^ActionListener\s+(\w+)\s*=\s*\w+\s*->\s*(.*)$/.exec(line))) {
      const listener = lambda(i, m[2], '};')
      named.set(m[1], listener)
      i = listener.to
    } else if ((m = /^(\w+)\.addActionListener\(\s*(\w+)\s*\)\s*;$/.exec(line))) {
      const listener = named.get(m[2])
      if (!listener) throw new Error(`Zuhörer ${m[2]} ist nicht angelegt.`)
      win.listeners.push({ button: button(m[1]), ...listener })
    } else if ((m = /^(\w+)\.addActionListener\(\s*\w+\s*->\s*(.*)$/.exec(line))) {
      const listener = lambda(i, m[2], '});')
      win.listeners.push({ button: button(m[1]), ...listener })
      i = listener.to
    }
  }
  return win
}

/** Zerlegt den Rumpf eines Zuhörers in Anweisungen, `if`/`else` mit oder ohne geschweifte Klammern. */
function parseStatements(text: string): SwingStatement[] {
  const out: SwingStatement[] = []
  let pos = 0
  const skip = () => {
    while (pos < text.length && /\s/.test(text[pos])) pos++
  }
  /** Text bis zur passenden schließenden Klammer; `pos` steht auf der öffnenden. */
  const balanced = (open: string, close: string): string => {
    let depth = 0
    let quote = false
    const start = pos + 1
    for (; pos < text.length; pos++) {
      const c = text[pos]
      if (quote) {
        if (c === '\\') pos++
        else if (c === '"') quote = false
      } else if (c === '"') quote = true
      else if (c === open) depth++
      else if (c === close && --depth === 0) return text.slice(start, pos++)
    }
    throw new Error(`Es fehlt „${close}“.`)
  }
  /** Eine einfache Anweisung bis zum Semikolon außerhalb von Klammern und Text. */
  const simple = (): string => {
    let depth = 0
    let quote = false
    const start = pos
    for (; pos < text.length; pos++) {
      const c = text[pos]
      if (quote) {
        if (c === '\\') pos++
        else if (c === '"') quote = false
      } else if (c === '"') quote = true
      else if (c === '(') depth++
      else if (c === ')') depth--
      else if (c === ';' && depth === 0) return text.slice(start, pos++).trim()
    }
    return text.slice(start).trim()
  }
  const one = (): SwingStatement[] => {
    skip()
    if (text[pos] === '{') return parseStatements(balanced('{', '}'))
    if (/^if\s*\(/.test(text.slice(pos))) {
      pos = text.indexOf('(', pos)
      const condition = balanced('(', ')').trim()
      const then = one()
      skip()
      let otherwise: SwingStatement[] = []
      if (/^else\b/.test(text.slice(pos))) {
        pos += 4
        otherwise = one()
      }
      return [{ condition, then, otherwise }]
    }
    const s = simple()
    return s ? [s] : []
  }
  for (skip(); pos < text.length; skip()) out.push(...one())
  return out
}

export interface ClickStep {
  button: string
  /** Zuhörer, der lief; `undefined`: Niemand hört zu. */
  listener?: SwingListener
  /** Texte aller Beschriftungen und Knöpfe nach dem Klick (Name → Text). */
  texts: Record<string, string>
  console: string[]
}

export interface SwingState {
  texts: Record<string, string>
  ints: Record<string, number>
}

export function startState(win: SwingWindow): SwingState {
  const texts: Record<string, string> = {}
  for (const b of win.buttons) texts[b.name] = b.caption
  for (const l of win.labels) texts[l.name] = l.text
  return { texts, ints: { ...win.ints } }
}

/** Ein Klick auf den Knopf mit dieser Beschriftung (verändert `state`). */
export function click(win: SwingWindow, state: SwingState, caption: string): ClickStep {
  const button = win.buttons.find((b) => b.caption === caption) ?? win.buttons.find((b) => state.texts[b.name] === caption)
  if (!button) throw new Error(`Knopf „${caption}“ gibt es nicht.`)
  return clickButton(win, state, button.name)
}

/** Klick auf den Knopf mit diesem Variablennamen. */
export function clickButton(win: SwingWindow, state: SwingState, name: string): ClickStep {
  const listener = win.listeners.find((l) => l.button === name)
  const output: string[] = []
  // `e.getActionCommand()` ist wie in Java die Beschriftung des Knopfs beim Klick.
  const event: SwingEvent = { source: name, command: state.texts[name] }
  for (const s of listener?.statements ?? []) run(s, state, output, event)
  return { button: name, listener, texts: { ...state.texts }, console: output }
}

export function simulate(win: SwingWindow, clicks: string[]): ClickStep[] {
  const state = startState(win)
  return clicks.map((c) => click(win, state, c))
}

interface SwingEvent {
  source: string
  command: string
}

function run(statement: SwingStatement, state: SwingState, output: string[], event: SwingEvent) {
  if (typeof statement !== 'string') {
    for (const s of condition(statement.condition, state, event) ? statement.then : statement.otherwise) run(s, state, output, event)
    return
  }
  let m: RegExpExecArray | null
  if ((m = /^(\w+)\.setText\((.*)\)$/.exec(statement))) {
    if (!(m[1] in state.texts)) throw new Error(`${m[1]} ist keine Beschriftung und kein Knopf.`)
    state.texts[m[1]] = String(evaluate(m[2], state, event))
  } else if ((m = /^System\.out\.println\((.*)\)$/.exec(statement))) output.push(String(evaluate(m[1], state, event)))
  else if ((m = /^(\w+)\s*(\+\+|--)$/.exec(statement))) state.ints[intName(m[1], state)] += m[2] === '++' ? 1 : -1
  else if ((m = /^(\w+)\s*([+-]?=)\s*(.+)$/.exec(statement))) {
    const name = intName(m[1], state)
    const value = Number(evaluate(m[3], state, event))
    state.ints[name] = m[2] === '=' ? value : m[2] === '+=' ? state.ints[name] + value : state.ints[name] - value
  } else throw new Error(`Diese Anweisung kann das Spiel nicht nachspielen: „${statement}“`)
}

/** `e.getSource() == knopf`, `text.equals("+")`, `zahl > 3` */
function condition(text: string, state: SwingState, event: SwingEvent): boolean {
  let m: RegExpExecArray | null
  if ((m = /^e\.getSource\(\)\s*(==|!=)\s*(\w+)$/.exec(text))) {
    if (!(m[2] in state.texts)) throw new Error(`${m[2]} ist kein Knopf.`)
    return (event.source === m[2]) === (m[1] === '==')
  }
  if ((m = /^(!?)(.+)\.equals\((.+)\)$/.exec(text))) return (String(evaluate(m[2], state, event)) === String(evaluate(m[3], state, event))) !== (m[1] === '!')
  if ((m = /^(.+?)\s*(==|!=|<=|>=|<|>)\s*(.+)$/.exec(text))) {
    const a = Number(evaluate(m[1], state, event))
    const b = Number(evaluate(m[3], state, event))
    return { '==': a === b, '!=': a !== b, '<=': a <= b, '>=': a >= b, '<': a < b, '>': a > b }[m[2]]!
  }
  throw new Error(`Diese Bedingung kann das Spiel nicht nachspielen: „${text}“`)
}

function intName(name: string, state: SwingState): string {
  if (!(name in state.ints)) throw new Error(`Variable ${name} ist nicht angelegt.`)
  return name
}

/** `"Text" + zahl`, `"" + (a + b)`, `zahl * 2`, `e.getActionCommand()`: von links nach rechts wie in Java. */
function evaluate(expr: string, state: SwingState, event?: SwingEvent): string | number {
  const tokens = expr.match(new RegExp(`${str}|\\d+|e\\.getActionCommand\\(\\)|\\w+(?:\\.getText\\(\\))?|[-+*/()]`, 'g')) ?? []
  let pos = 0
  const atom = (): string | number => {
    const tok = tokens[pos++]
    if (tok === undefined) throw new Error(`Unvollständiger Ausdruck „${expr}“`)
    if (tok === '(') {
      const v = sum()
      pos++
      return v
    }
    if (tok.startsWith('"')) return JSON.parse(tok)
    if (/^\d+$/.test(tok)) return Number(tok)
    if (tok === 'e.getActionCommand()') {
      if (!event) throw new Error('e.getActionCommand() gibt es nur im Zuhörer.')
      return event.command
    }
    if (tok.endsWith('.getText()')) return state.texts[tok.slice(0, -10)] ?? ''
    if (tok in state.ints) return state.ints[tok]
    throw new Error(`Unbekannt: „${tok}“`)
  }
  const product = (): string | number => {
    let v = atom()
    while (tokens[pos] === '*' || tokens[pos] === '/') {
      const op = tokens[pos++]
      const r = Number(atom())
      v = op === '*' ? Number(v) * r : Math.trunc(Number(v) / r)
    }
    return v
  }
  const sum = (): string | number => {
    let v = product()
    while (tokens[pos] === '+' || tokens[pos] === '-') {
      const op = tokens[pos++]
      const r = product()
      if (op === '+') v = typeof v === 'string' || typeof r === 'string' ? `${v}${r}` : v + r
      else v = Number(v) - Number(r)
    }
    return v
  }
  return sum()
}
