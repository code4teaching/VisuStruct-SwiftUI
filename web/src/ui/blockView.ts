import { canvasTextLines, keywordSplit } from '../core/diagramText'
import { isPlaceholderElement } from '../core/editing'
import { ElementType, type VSDocument, type VSElement } from '../core/model'
import { samePath } from './renderer'
import { countLoopLines, countVar, declaredVariables, insertExpression, isRepeatLoop, javaTypes, randomJava, randomPattern, readCountLoop, readRandom, setCountField, usesVariable, type CountLoop } from 'visublocks'
import { visuBotGroupColor, visuBotGroupIcon, visuBotSensors, visuBotTemplates } from './visubotView'

/**
 * Blöcke (VisuBot): dasselbe Struktogramm als Scratch-artige Blöcke, Aussehen wie der Block-Modus von VisuMicro.
 * Anweisungen sind Stapelblöcke, Schleifen und Verzweigungen Klammerblöcke („C-Blöcke“) mit Maul.
 * Die Farben sind die des Struktogramms (Anweisung gelb, Schleife rosa, Verzweigung blau); mBot2-Befehle
 * tragen zusätzlich den Streifen und das Symbol ihrer Gruppe wie in der Palette.
 * Blöcke lassen sich auswählen, aus der Palette hineinziehen, verschieben und in den Papierkorb werfen;
 * Zahlen und Texte (weiße Felder) ändert man per Klick direkt im Block.
 */

/** Ein Wort auf einem Block: Text, Schlüsselwort (fett), Wert (weißes Feld) oder Sensor (türkiser Baustein). */
export interface BlockToken {
  kind: 'text' | 'kw' | 'lit' | 'str' | 'sensor' | 'var' | 'random'
  text: string
  /** Variable, die gerade angelegt oder gesetzt wird: Baustein, aber kein Feld */
  fixed?: boolean
  /** Zufallszahl: von, bis */
  from?: string
  to?: string
}

const sensorCalls = new Set(visuBotSensors.map((s) => s.text.match(/^mbot\.(\w+)\(\)/)?.[1]).filter((n): n is string => !!n))

/**
 * Stellen in einer Zeile, die im Block besonders aussehen: Zufallszahl, Zeichenkette, Sensor (bzw. andere
 * `mbot.…()`), Zahl, true/false/null und angelegte Variablen.
 */
const scanPattern = () =>
  new RegExp(
    `(${randomPattern().source})|("(?:[^"\\\\]|\\\\.)*")|(mbot\\.(\\w+)\\(\\))|(\\b\\d+(?:\\.\\d+)?\\b)|\\b(true|false|null)\\b|\\b([A-Za-z_]\\w*)\\b`,
    'g',
  )

/** Eine besondere Stelle: `field` = man kann sie per Klick ändern oder etwas darauf ziehen */
interface Hit {
  start: number
  end: number
  kind: 'random' | 'str' | 'sensor' | 'lit' | 'var'
  text: string
  field: boolean
}

/** mBot2-Befehle, deren Zahl man in der leeren Klammer ergänzt (aus „Elemente“ kommen sie als `mbot.forward()`) */
const emptyArgCommands = new Set(['forward', 'backward', 'turnRight', 'turnLeft'])

const typeBefore = new RegExp(`\\b(?:${javaTypes.join('|')})\\s+$`)

function scan(line: string, vars: ReadonlySet<string>): Hit[] {
  const out: Hit[] = []
  for (const m of line.matchAll(scanPattern())) {
    const start = m.index ?? 0
    const end = start + m[0].length
    const hit = (kind: Hit['kind'], field = true) => out.push({ start, end, kind, text: m[0], field })
    if (m[1]) hit('random')
    else if (m[4]) hit('str')
    else if (m[5]) {
      // andere mbot-Aufrufe (mbot.stop()) sind kein Sensor; Befehle mit leerer Klammer (`mbot.forward()`)
      // bekommen dort ein leeres Feld, damit Kinder die Zahl nur noch eintippen
      if (sensorCalls.has(m[6])) hit('sensor')
      else if (emptyArgCommands.has(m[6])) out.push({ start: end - 1, end: end - 1, kind: 'lit', text: '', field: true })
    } else if (m[7] || m[8]) hit('lit')
    else if (m[9] && vars.has(m[9]) && line[start - 1] !== '.') {
      // Name, der gerade angelegt (`int zahl`) oder gesetzt (`zahl = …`) wird: Baustein, aber kein Feld
      const target = typeBefore.test(line.slice(0, start)) || /^\s*=(?!=)/.test(line.slice(end))
      hit('var', !target)
    }
  }
  return out
}

/** Felder einer Zeile in Block-Reihenfolge: jede Zufallszahl hat zwei (von, bis) */
interface ValueField {
  hit: Hit
  /** bei der Zufallszahl: 0 = von, 1 = bis */
  part?: 0 | 1
}

function valueFields(line: string, vars: ReadonlySet<string>): ValueField[] {
  const out: ValueField[] = []
  for (const hit of scan(line, vars)) {
    if (!hit.field || hit.kind === 'sensor') continue
    if (hit.kind === 'random') out.push({ hit, part: 0 }, { hit, part: 1 })
    else out.push({ hit })
  }
  return out
}

const noVars: ReadonlySet<string> = new Set()

/**
 * Den `index`-ten Wert (Zahl, Text, true/false/null, Variable, von/bis einer Zufallszahl) in den Zeilen
 * eines Elements ersetzen. Die Werte stehen in den Blöcken in derselben Reihenfolge wie im gespeicherten
 * Text (auch bei `for` und `while`). Ein Operator bekommt Klammern, wenn er sie braucht.
 */
export function replaceValue(lines: string[], index: number, value: string, vars = noVars): string[] | undefined {
  let n = 0
  for (let l = 0; l < lines.length; l++) {
    for (const f of valueFields(lines[l], vars)) {
      if (n++ !== index) continue
      const out = [...lines]
      if (f.part !== undefined) {
        // Zufallszahl: nur ganze Zahlen als Grenzen
        const r = readRandom(f.hit.text)
        if (!r || !/^-?\d+$/.test(value.trim())) return undefined
        const v = Number(value)
        out[l] = lines[l].slice(0, f.hit.start) + randomJava(f.part === 0 ? v : r.from, f.part === 1 ? v : r.to) + lines[l].slice(f.hit.end)
      } else out[l] = insertExpression(lines[l], f.hit.start, f.hit.end, value)
      return out
    }
  }
  return undefined
}

/** Den `index`-ten Sensor (`mbot.getDistance()` …) in den Zeilen eines Elements ersetzen. */
export function replaceSensor(lines: string[], index: number, value: string, vars = noVars): string[] | undefined {
  let n = 0
  for (let l = 0; l < lines.length; l++) {
    for (const hit of scan(lines[l], vars)) {
      if (hit.kind !== 'sensor' || n++ !== index) continue
      const out = [...lines]
      out[l] = insertExpression(lines[l], hit.start, hit.end, value)
      return out
    }
  }
  return undefined
}

/** Alle Zeilen des Programms (für die angelegten Variablen) */
function allLines(els: VSElement[], out: string[] = []): string[] {
  for (const e of els) {
    out.push(...e.textLines)
    if (e.loopBody) allLines(e.loopBody, out)
    for (const c of e.cases ?? []) allLines(c.elements, out)
  }
  return out
}

/** Variablen, die in Anweisungen angelegt werden (ohne Zählvariablen von Schleifen) */
export function statementVariables(doc: VSDocument): string[] {
  const lines: string[] = []
  const walk = (els: VSElement[]) => {
    for (const e of els) {
      if (e.type === ElementType.anweisung) lines.push(...e.textLines)
      if (e.loopBody) walk(e.loopBody)
      for (const c of e.cases ?? []) walk(c.elements)
    }
  }
  walk(doc.elements)
  return declaredVariables(lines)
}

/** Namen der angelegten Variablen im ganzen Programm (`int zahl = 0`, auch Zählvariablen) */
export const programVariables = (doc: VSDocument): string[] => declaredVariables(allLines(doc.elements))

/** Element am Pfad und Zahl der umgebenden for-Schleifen (für den Namen der Zählvariable: i, j, k …) */
export function elementWithForDepth(doc: VSDocument, path: number[]): { element?: VSElement; depth: number } {
  let els = doc.elements
  let depth = 0
  for (let k = 0; k < path.length; k += 2) {
    const e = els[path[k]]
    if (!e || k === path.length - 1) return { element: e, depth }
    if (e.type === ElementType.forSchleife) depth++
    const next = e.loopBody && path[k + 1] === 0 ? e.loopBody : e.cases?.[path[k + 1]]?.elements
    if (!next) return { depth }
    els = next
  }
  return { depth }
}

/** Zählschleife eines for-Elements (leere Schleife → Standard mit passender Variable), sonst `undefined` */
export function countLoopOf(element: VSElement, depth: number): CountLoop | undefined {
  return element.type === ElementType.forSchleife ? readCountLoop(element.textLines, countVar(depth)) : undefined
}

/**
 * Wert Nummer `index` im Block am Pfad ersetzen. Zählschleifen haben die Felder Start, Ende, Schritt und
 * schreiben den ganzen Java-Kopf neu (`0` beim Start → `int i = 0`); sonst wie `replaceValue`.
 */
export function replaceBlockValue(doc: VSDocument, path: number[], index: number, value: string): string[] | undefined {
  const { element, depth } = elementWithForDepth(doc, path)
  if (!element) return undefined
  const loop = countLoopOf(element, depth)
  if (loop) {
    const next = setCountField(loop, index, value)
    return next && countLoopLines(next)
  }
  return replaceValue(element.textLines, index, value, new Set(programVariables(doc)))
}

/** Sensor Nummer `index` im Block am Pfad ersetzen (auch durch einen Operator oder eine Variable) */
export function replaceBlockSensor(doc: VSDocument, path: number[], index: number, value: string): string[] | undefined {
  const { element } = elementWithForDepth(doc, path)
  return element && replaceSensor(element.textLines, index, value, new Set(programVariables(doc)))
}

/** Neue for-Schleife aus der Palette in den Blöcken: gleich „von 0 bis unter 10 in Schritten von 1“ */
export function withCountLoopDefaults(doc: VSDocument, path: number[], element: VSElement): VSElement {
  if (element.type !== ElementType.forSchleife || element.textLines.some((l) => l.trim() !== '')) return element
  const { depth } = elementWithForDepth(doc, [...path.slice(0, -1), Number.MAX_SAFE_INTEGER])
  return { ...element, textLines: countLoopLines(readCountLoop([], countVar(depth))!) }
}

/** Eingabe im Wertfeld → Java-Text: Zahl bzw. true/false/null bleibt, Text kommt in Anführungszeichen. */
export function valueText(kind: 'lit' | 'str', input: string): string | undefined {
  if (kind === 'str') return JSON.stringify(input)
  const v = input.trim().replace(',', '.')
  return /^-?\d+(\.\d+)?$/.test(v) || /^(true|false|null)$/.test(v) ? v : undefined
}

/** Zeile → Wörter: führendes Schlüsselwort, Zeichenketten, Zahlen, Sensoren, Variablen und Zufallszahlen. */
export function blockTokens(line: string, vars = noVars): BlockToken[] {
  const out: BlockToken[] = []
  const split = keywordSplit(line)
  let rest = line
  if (split) {
    out.push({ kind: 'kw', text: split.keyword })
    rest = split.rest ? ` ${split.rest}` : ''
  }
  let at = 0
  const text = (s: string) => {
    if (!s) return
    const last = out[out.length - 1]
    if (last?.kind === 'text') last.text += s
    else out.push({ kind: 'text', text: s })
  }
  for (const h of scan(rest, vars)) {
    text(rest.slice(at, h.start))
    if (h.kind === 'random') {
      const r = readRandom(h.text)!
      out.push({ kind: 'random', text: h.text, from: String(r.from), to: String(r.to) })
    } else out.push(h.kind === 'var' && !h.field ? { kind: 'var', text: h.text, fixed: true } : { kind: h.kind, text: h.text })
    at = h.end
  }
  text(rest.slice(at))
  return out
}

const commandGroups = new Map<string, string>()
for (const tpl of visuBotTemplates) {
  const name = tpl.make().textLines[0]?.match(/^mbot\.(\w+)/)?.[1]
  if (name && !commandGroups.has(name)) commandGroups.set(name, tpl.group)
}

/** Gruppe eines mBot2-Befehls (`mbot.forward(50)` → `drive`), sonst `undefined`. */
export function blockGroup(element: VSElement): string | undefined {
  if (element.type !== ElementType.anweisung) return undefined
  const name = element.textLines.join(' ').trim().match(/^mbot\.(\w+)/)?.[1]
  return name ? commandGroups.get(name) : undefined
}

/** Pfad des Elements und laufende Nummer seiner Werte */
interface ValueSlot {
  path: number[]
  n: number
  /** laufende Nummer der Sensoren */
  s: number
}

const iconPrefix = new RegExp(`^(?:${Object.values(visuBotGroupIcon).map((i) => i.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\s+(?=mbot\\.)`, 'u')

/**
 * Bis 0.15.19 schrieben die Blöcke das Gruppensymbol versehentlich in den Befehl (`🚗 mbot.forward(50)`).
 * Entfernt es aus allen Anweisungen; `undefined`, wenn nichts zu tun ist.
 */
export function withoutBlockIcons(doc: VSDocument): VSDocument | undefined {
  let changed = false
  const clean = (els: VSElement[]): VSElement[] =>
    els.map((e) => {
      const textLines = e.type === ElementType.anweisung ? e.textLines.map((l) => l.replace(iconPrefix, '')) : e.textLines
      if (textLines.some((l, i) => l !== e.textLines[i])) changed = true
      return {
        ...e,
        textLines,
        loopBody: e.loopBody && clean(e.loopBody),
        cases: e.cases?.map((c) => ({ ...c, elements: clean(c.elements) })),
      }
    })
  const elements = clean(doc.elements)
  return changed ? { ...doc, elements } : undefined
}

export interface BlockViewOptions {
  /** Zeiger auf einem Block: auswählen und ggf. Ziehen beginnen. */
  press: (path: number[], event: PointerEvent) => void
  /** Wert Nummer `index` im Element `path` ändern (`text` ist schon Java: `50`, `"Hallo"`). */
  editValue: (path: number[], index: number, text: string) => void
  /** Texte der Knöpfe/Beschriftungen (übersetzt). */
  labels: {
    start: string
    else: string
    empty: string
    hint: string
    trash: string
    /** Zählschleife: „zähle mit“ i „von“ 0 „bis unter“/„bis“/„bis über“ 10 „in Schritten von“ 1 */
    count: string
    countFrom: string
    countBelow: string
    countTo: string
    countAbove: string
    countStep: string
    /** „wiederhole“ [10] „mal“ */
    repeat: string
    repeatTimes: string
    /** „Zufallszahl von“ [1] „bis“ [10] */
    randomFrom: string
    randomTo: string
  }
}

/**
 * Wohin ein gezogener Block fällt: vor/hinter einen Block, an die Stelle eines leeren Platzes, ans Ende,
 * in die Bedingung (Sensor) oder in den Papierkorb (nur beim Verschieben).
 */
export type BlockDrop =
  | { kind: 'before' | 'after' | 'replace' | 'condition'; path: number[] }
  /** Sensor auf ein Feld: Wert bzw. Sensor Nummer `index` im Element `path` ersetzen */
  | { kind: 'slot'; path: number[]; slot: 'value' | 'sensor'; index: number }
  | { kind: 'rootAppend' }
  | { kind: 'trash' }

export interface BlockDropQuery {
  /** Verschieben: dieser Block (er kann nicht in sich selbst fallen) */
  moving?: number[]
  /** Sensor: passt er in diesen Block? (Bedingung oder Anweisung) */
  sensor?: (path: number[]) => boolean
}

const pathOf = (el: Element | null | undefined): number[] | undefined =>
  el instanceof HTMLElement && el.dataset.path ? (JSON.parse(el.dataset.path) as number[]) : undefined
const startsWith = (path: number[], prefix: number[]) => path.length >= prefix.length && prefix.every((v, i) => path[i] === v)
const upperHalf = (el: Element, clientY: number) => {
  const r = el.getBoundingClientRect()
  return clientY < r.top + r.height / 2
}

export class BlockView {
  readonly element: HTMLDivElement
  private boxes: { path: number[]; el: HTMLElement }[] = []
  private enabled = true
  /** gerade offenes Wertfeld: solange wird nicht neu gezeichnet */
  private editing = false
  /** Schachtelung der for-Schleifen beim Zeichnen (Zählvariable i, j, k …) */
  private forDepth = 0
  /** angelegte Variablen des Programms (orange Bausteine) */
  private vars: ReadonlySet<string> = new Set()
  private pending?: () => void

  constructor(private options: BlockViewOptions) {
    this.element = document.createElement('div')
    this.element.className = 'blocks-view'
    this.element.hidden = true
    this.element.addEventListener('pointerdown', (e) => {
      if (!this.enabled) return
      if ((e.target as Element).closest('.bk-input')) return
      const field = (e.target as Element).closest<HTMLElement>('[data-value]')
      if (field && !this.editing) {
        // Wert anklicken: direkt im Block ändern, nicht ziehen
        e.preventDefault()
        e.stopPropagation()
        this.editField(field)
        return
      }
      const box = (e.target as Element).closest<HTMLElement>('[data-path]')
      if (!box) return
      this.options.press(pathOf(box)!, e)
    })
  }

  /** Ablegestelle unter dem Zeiger (`target` = Element unter dem Zeiger, sonst `elementFromPoint`). */
  dropAt(clientX: number, clientY: number, query: BlockDropQuery, target?: Element | null): BlockDrop | undefined {
    const hit = target ?? document.elementFromPoint(clientX, clientY)
    if (!hit || !this.element.contains(hit)) return undefined
    if (hit.closest('.bk-trash')) return query.moving ? { kind: 'trash' } : undefined
    const drop = this.rawDrop(hit, clientY, query)
    if (!drop || !query.moving || !('path' in drop)) return drop
    // nicht in sich selbst ablegen
    return startsWith(drop.path, query.moving) ? undefined : drop
  }

  private rawDrop(hit: Element, clientY: number, query: BlockDropQuery): BlockDrop | undefined {
    const box = hit.closest<HTMLElement>('[data-path]')
    if (query.sensor) {
      // genau auf ein weißes Feld oder einen Sensor: diesen ersetzen
      const field = hit.closest<HTMLElement>('[data-value], [data-sensor]')
      if (field) {
        const slot = field.dataset.value ? 'value' : 'sensor'
        const { path, index } = JSON.parse(field.dataset.value ?? field.dataset.sensor!) as { path: number[]; index: number }
        return { kind: 'slot', path, slot, index }
      }
      const path = pathOf(box)
      return path && !box!.classList.contains('bk-empty') && query.sensor(path) ? { kind: 'condition', path } : undefined
    }
    if (!box) {
      if (hit.closest('.bk-hat')) return { kind: 'before', path: [0] }
      return hit.closest('.bk-stack, .blocks-view') ? { kind: 'rootAppend' } : undefined
    }
    const path = pathOf(box)!
    if (box.classList.contains('bk-empty')) return { kind: 'replace', path }
    const part = hit.closest('.bk-head, .bk-foot, .bk-clause, .bk-body')
    const own = part && part.closest('[data-path]') === box ? part : undefined
    if (!box.classList.contains('bk-c') || !own) return { kind: upperHalf(box, clientY) ? 'before' : 'after', path }
    if (own.classList.contains('bk-clause')) return this.firstInto(own.nextElementSibling)
    if (own.classList.contains('bk-body')) {
      // freie Fläche im Maul: hinter den letzten Block darin
      const last = [...own.children].filter((c) => c instanceof HTMLElement && c.dataset.path).pop()
      const lastPath = pathOf(last)
      if (!lastPath) return undefined
      return last!.classList.contains('bk-empty') ? { kind: 'replace', path: lastPath } : { kind: 'after', path: lastPath }
    }
    if (own.classList.contains('bk-foot')) return { kind: 'after', path }
    // Kopf: obere Hälfte davor, untere Hälfte als ersten Block ins Maul
    return upperHalf(own, clientY) ? { kind: 'before', path } : this.firstInto(own.parentElement?.querySelector(':scope > .bk-body'))
  }

  private firstInto(body: Element | null | undefined): BlockDrop | undefined {
    const first = body?.firstElementChild
    const path = pathOf(first)
    if (!path) return undefined
    return first!.classList.contains('bk-empty') ? { kind: 'replace', path } : { kind: 'before', path }
  }

  /** Wertfeld durch ein Eingabefeld ersetzen; Enter oder Verlassen übernimmt, Escape bricht ab. */
  private editField(field: HTMLElement) {
    const { path, index } = JSON.parse(field.dataset.value!) as { path: number[]; index: number }
    const kind = field.classList.contains('tk-str') ? 'str' : 'lit'
    const shown = field.textContent ?? ''
    const input = document.createElement('input')
    input.className = `bk-input tk-${kind}`
    input.value = kind === 'str' ? (JSON.parse(shown) as string) : shown
    const fit = () => (input.style.width = `calc(${Math.max(2, input.value.length + 1)}ch + 18px)`)
    fit()
    input.setAttribute('aria-label', shown)
    input.addEventListener('input', fit)
    this.editing = true
    let done = false
    const finish = (save: boolean) => {
      if (done) return
      done = true
      this.editing = false
      const text = save ? valueText(kind, input.value) : undefined
      if (text !== undefined && text !== shown) this.options.editValue(path, index, text)
      else if (this.pending) this.pending()
      else input.replaceWith(field)
    }
    input.addEventListener('keydown', (e) => {
      e.stopPropagation()
      if (e.key === 'Enter') finish(true)
      else if (e.key === 'Escape') finish(false)
    })
    input.addEventListener('blur', () => finish(true))
    field.replaceWith(input)
    input.focus()
    input.select()
  }

  /** Ablegestelle zeigen (Linie bzw. hervorgehobener Block); `undefined` räumt auf. */
  showDrop(drop: BlockDrop | undefined) {
    this.element.querySelectorAll('.bk-drop').forEach((e) => e.classList.remove('bk-drop'))
    this.element.querySelector('.bk-drop-line')?.remove()
    this.element.querySelector('.bk-trash')?.classList.toggle('bk-trash-hot', drop?.kind === 'trash')
    if (!drop || drop.kind === 'trash') return
    if (drop.kind === 'slot') {
      const key = JSON.stringify({ path: drop.path, index: drop.index })
      const attr = drop.slot === 'value' ? 'data-value' : 'data-sensor'
      for (const f of this.element.querySelectorAll<HTMLElement>(`[${attr}]`)) {
        if (f.getAttribute(attr) === key) f.classList.add('bk-drop')
      }
      return
    }
    const stack = this.element.querySelector<HTMLElement>('.bk-stack')
    if (!stack) return
    let box: HTMLElement | undefined
    let below = true
    if (drop.kind === 'rootAppend') {
      box = [...stack.children].filter((c): c is HTMLElement => c instanceof HTMLElement && !!c.dataset.path).pop()
    } else {
      box = this.boxes.find((b) => samePath(b.path, drop.path))?.el
      if (box && (drop.kind === 'replace' || drop.kind === 'condition')) {
        box.classList.add('bk-drop')
        return
      }
      below = drop.kind === 'after'
    }
    if (!box) return
    const s = stack.getBoundingClientRect()
    const r = box.getBoundingClientRect()
    const line = document.createElement('div')
    line.className = 'bk-drop-line'
    line.style.left = `${r.left - s.left}px`
    line.style.top = `${(below ? r.bottom : r.top) - s.top - 3}px`
    line.style.width = `${Math.max(r.width, 120)}px`
    stack.append(line)
  }

  /** Beim Verschieben eines Blocks: Papierkorb zeigen. */
  setMoving(on: boolean) {
    this.element.classList.toggle('bk-moving', on)
  }

  /** Neu zeichnen; `mark` ist die Auswahl bzw. in der Simulation der laufende Schritt. */
  render(doc: VSDocument, mark: number[] | undefined, simulating: boolean, zoom = 1) {
    if (this.editing) {
      this.pending = () => this.render(doc, mark, simulating, zoom)
      return
    }
    this.pending = undefined
    this.enabled = !simulating
    this.boxes = []
    this.forDepth = 0
    this.vars = new Set(programVariables(doc))
    this.element.style.setProperty('--bk-zoom', String(zoom))
    this.element.classList.toggle('bk-simulating', simulating)
    const hint = document.createElement('p')
    hint.className = 'bk-hint'
    hint.textContent = this.options.labels.hint
    const hat = document.createElement('div')
    hat.className = 'bk bk-hat'
    const head = document.createElement('div')
    head.className = 'bk-head'
    head.append(this.word({ kind: 'kw', text: `🏁 ${this.options.labels.start}` }))
    hat.append(head)
    const stack = document.createElement('div')
    stack.className = 'bk-stack'
    stack.append(hat, ...this.list(doc.elements, []))
    const trash = document.createElement('div')
    trash.className = 'bk-trash'
    trash.textContent = `🗑️ ${this.options.labels.trash}`
    this.element.replaceChildren(hint, stack, trash)
    for (const { path, el } of this.boxes) {
      if (mark && samePath(path, mark)) el.classList.add(simulating ? 'bk-exec' : 'bk-sel')
    }
  }

  /** Den markierten Block sichtbar machen (Simulation). */
  scrollTo(path: number[]) {
    const box = this.boxes.find((b) => samePath(b.path, path))
    box?.el.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  private list(elements: VSElement[], parent: number[]): HTMLElement[] {
    return elements.map((e, i) => this.block(e, [...parent, i]))
  }

  private block(e: VSElement, path: number[]): HTMLElement {
    const box = document.createElement('div')
    // Werte im Block zählen wie im gespeicherten Text (für das Ändern per Klick)
    const v: ValueSlot = { path, n: 0, s: 0 }
    box.dataset.path = JSON.stringify(path)
    this.boxes.push({ path, el: box })
    if (isPlaceholderElement(e)) {
      box.className = 'bk-empty'
      box.textContent = this.options.labels.empty
      return box
    }
    // Kopie: das Symbol der Gruppe gehört nur auf den Block, nie in den gespeicherten Befehl
    const lines = [...canvasTextLines(e)]
    switch (e.type) {
      case ElementType.forSchleife: {
        box.className = 'bk bk-c bk-loop'
        const loop = countLoopOf(e, this.forDepth)
        const repeat = loop && isRepeatLoop(loop) && !usesVariable(allLines(e.loopBody ?? []), loop.v)
        const head = loop ? (repeat ? this.repeatHead(loop, v) : this.countHead(loop, v)) : this.head(lines, v)
        this.forDepth++
        const body = this.body(e.loopBody ?? [], [...path, 0])
        this.forDepth--
        box.append(head, body, this.foot([], v))
        break
      }
      case ElementType.whileSchleife:
      case ElementType.endlosschleife:
        box.className = 'bk bk-c bk-loop'
        box.append(this.head(lines, v), this.body(e.loopBody ?? [], [...path, 0]), this.foot([], v))
        break
      case ElementType.doUntilSchleife:
        // Bedingung erst am Ende geprüft: oben „do“, unten „while …“ wie im Struktogramm
        box.className = 'bk bk-c bk-loop'
        box.append(this.head(['do'], v), this.body(e.loopBody ?? [], [...path, 0]), this.foot(lines, v))
        break
      case ElementType.verzweigung: {
        box.className = 'bk bk-c bk-if'
        const cases = e.cases ?? []
        box.append(this.head(lines, v))
        cases.forEach((c, i) => {
          if (i > 0) box.append(this.clause(i === 1 && cases.length === 2 ? this.options.labels.else : c.name))
          box.append(this.body(c.elements, [...path, i]))
        })
        box.append(this.foot([], v))
        break
      }
      case ElementType.fallauswahl:
        box.className = 'bk bk-c bk-if'
        box.append(this.head(lines, v))
        ;(e.cases ?? []).forEach((c, i) => {
          box.append(this.clause(c.name.toLowerCase() === 'default' ? 'default' : `case ${c.name}`), this.body(c.elements, [...path, i]))
        })
        box.append(this.foot([], v))
        break
      case ElementType.aussprung:
        box.className = 'bk bk-cap'
        box.append(this.head(lines, v))
        break
      case ElementType.aufruf:
        box.className = 'bk bk-simple bk-call'
        box.append(this.head(lines, v))
        break
      default: {
        box.className = 'bk bk-simple bk-stmt'
        const group = blockGroup(e)
        if (group) {
          box.dataset.botColor = visuBotGroupColor(group)
          const icon = visuBotGroupIcon[group]
          if (icon) lines[0] = `${icon} ${lines[0]}`
        }
        box.append(this.head(lines, v))
      }
    }
    return box
  }

  private head(lines: string[], v?: ValueSlot): HTMLElement {
    const head = document.createElement('div')
    head.className = 'bk-head'
    for (const line of lines) {
      const row = document.createElement('span')
      row.className = 'bk-line'
      for (const token of blockTokens(line, this.vars)) {
        if (token.kind === 'random') {
          row.append(this.randomWord(token, v))
          continue
        }
        const word = this.word(token)
        if (v && (token.kind === 'lit' || token.kind === 'str' || (token.kind === 'var' && !token.fixed))) {
          word.dataset.value = JSON.stringify({ path: v.path, index: v.n++ })
        }
        if (v && token.kind === 'sensor') word.dataset.sensor = JSON.stringify({ path: v.path, index: v.s++ })
        // Ja/Nein-Sensoren (isButtonA, isLineLeft …) sechseckig wie Bedingungen in Scratch, Messwerte rund
        if (token.kind === 'sensor' && /^mbot\.is/.test(token.text)) word.classList.add('tk-bool')
        row.append(word)
      }
      head.append(row)
    }
    return head
  }

  /** Zufallszahl als runder Operator-Baustein: „Zufallszahl von [1] bis [10]“ mit zwei Feldern */
  private randomWord(token: BlockToken, v?: ValueSlot): HTMLElement {
    const l = this.options.labels
    const pill = document.createElement('span')
    pill.className = 'tk tk-op'
    const field = (text: string) => {
      const w = this.word({ kind: 'lit', text })
      if (v) w.dataset.value = JSON.stringify({ path: v.path, index: v.n++ })
      return w
    }
    pill.append(`${l.randomFrom} `, field(token.from!), ` ${l.randomTo} `, field(token.to!))
    return pill
  }

  /** Feld des Kopfs einer Zählschleife: Zahl, Sensor oder Variable */
  private loopField(text: string, index: number, v: ValueSlot): HTMLElement {
    const sensor = /^mbot\./.test(text)
    const w = this.word({ kind: sensor ? 'sensor' : /^[A-Za-z_]/.test(text) ? 'var' : 'lit', text })
    if (sensor) w.dataset.sensor = JSON.stringify({ path: v.path, index: 0 })
    else w.dataset.value = JSON.stringify({ path: v.path, index })
    return w
  }

  /** „wiederhole [10] mal“: Zählschleife, deren Variable im Rumpf nicht vorkommt; Feld 1 = Ende */
  private repeatHead(c: CountLoop, v: ValueSlot): HTMLElement {
    const l = this.options.labels
    const head = document.createElement('div')
    head.className = 'bk-head'
    const row = document.createElement('span')
    row.className = 'bk-line'
    row.append(this.word({ kind: 'kw', text: l.repeat }), this.word({ kind: 'text', text: ' ' }), this.loopField(c.end, 1, v), this.word({ kind: 'text', text: ` ${l.repeatTimes}` }))
    head.append(row)
    return head
  }

  /** Zählschleife: „zähle mit i von [0] bis unter [10] in Schritten von [1]“, Felder 0 Start, 1 Ende, 2 Schritt */
  private countHead(c: CountLoop, v: ValueSlot): HTMLElement {
    const l = this.options.labels
    const head = document.createElement('div')
    head.className = 'bk-head'
    const row = document.createElement('span')
    row.className = 'bk-line'
    const field = (text: string, index: number) => this.loopField(text, index, v)
    const to = c.op === '<' ? l.countBelow : c.op === '>' ? l.countAbove : l.countTo
    row.append(
      this.word({ kind: 'kw', text: l.count }),
      this.word({ kind: 'text', text: ' ' }),
      this.word({ kind: 'var', text: c.v }),
      this.word({ kind: 'text', text: ` ${l.countFrom} ` }),
      field(c.start, 0),
      this.word({ kind: 'text', text: ` ${to} ` }),
      field(c.end, 1),
      this.word({ kind: 'text', text: ` ${l.countStep} ` }),
      field(c.step, 2),
    )
    head.append(row)
    return head
  }

  private foot(lines: string[], v?: ValueSlot): HTMLElement {
    const foot = this.head(lines, v)
    foot.className = 'bk-foot'
    return foot
  }

  private clause(label: string): HTMLElement {
    const c = document.createElement('div')
    c.className = 'bk-head bk-clause'
    c.append(this.word({ kind: 'kw', text: label }))
    return c
  }

  private body(elements: VSElement[], parent: number[]): HTMLElement {
    const body = document.createElement('div')
    body.className = 'bk-body'
    body.append(...this.list(elements, parent))
    return body
  }

  private word(token: BlockToken): HTMLElement {
    const span = document.createElement('span')
    span.className = `tk tk-${token.kind}`
    span.textContent = token.text
    return span
  }
}
