import { canvasTextLines, keywordSplit } from '../core/diagramText'
import { isPlaceholderElement } from '../core/editing'
import { ElementType, type VSDocument, type VSElement } from '../core/model'
import { samePath } from './renderer'
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
  kind: 'text' | 'kw' | 'lit' | 'str' | 'sensor'
  text: string
}

const sensorCalls = new Set(visuBotSensors.map((s) => s.text.match(/^mbot\.(\w+)\(\)/)?.[1]).filter((n): n is string => !!n))

/** Zeichenketten, Sensorabfragen (bzw. andere `mbot.…()`), Zahlen und true/false/null. */
const valuePattern = () => /("(?:[^"\\]|\\.)*")|(mbot\.(\w+)\(\))|(\b\d+(?:\.\d+)?\b)|\b(true|false|null)\b/g

/**
 * Den `index`-ten Wert (Zahl, Text, true/false/null) in den Zeilen eines Elements ersetzen. Die Werte
 * stehen in den Blöcken in derselben Reihenfolge wie im gespeicherten Text (auch bei `for` und `while`).
 */
export function replaceValue(lines: string[], index: number, value: string): string[] | undefined {
  let n = 0
  for (let l = 0; l < lines.length; l++) {
    for (const m of lines[l].matchAll(valuePattern())) {
      if (m[2]) continue
      if (n++ !== index) continue
      const i = m.index ?? 0
      const out = [...lines]
      out[l] = lines[l].slice(0, i) + value + lines[l].slice(i + m[0].length)
      return out
    }
  }
  return undefined
}

/** Den `index`-ten Sensor (`mbot.getDistance()` …) in den Zeilen eines Elements ersetzen. */
export function replaceSensor(lines: string[], index: number, value: string): string[] | undefined {
  let n = 0
  for (let l = 0; l < lines.length; l++) {
    for (const m of lines[l].matchAll(valuePattern())) {
      if (!m[2] || !sensorCalls.has(m[3])) continue
      if (n++ !== index) continue
      const i = m.index ?? 0
      const out = [...lines]
      out[l] = lines[l].slice(0, i) + value + lines[l].slice(i + m[0].length)
      return out
    }
  }
  return undefined
}

/** Eingabe im Wertfeld → Java-Text: Zahl bzw. true/false/null bleibt, Text kommt in Anführungszeichen. */
export function valueText(kind: 'lit' | 'str', input: string): string | undefined {
  if (kind === 'str') return JSON.stringify(input)
  const v = input.trim().replace(',', '.')
  return /^-?\d+(\.\d+)?$/.test(v) || /^(true|false|null)$/.test(v) ? v : undefined
}

/** Zeile → Wörter: führendes Schlüsselwort, Zeichenketten, Zahlen und Sensorabfragen (`mbot.getDistance()`). */
export function blockTokens(line: string): BlockToken[] {
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
  for (const m of rest.matchAll(valuePattern())) {
    const i = m.index ?? 0
    if (m[2] && !sensorCalls.has(m[3])) continue
    text(rest.slice(at, i))
    if (m[1]) out.push({ kind: 'str', text: m[1] })
    else if (m[2]) out.push({ kind: 'sensor', text: m[2] })
    else out.push({ kind: 'lit', text: m[0] })
    at = i + m[0].length
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
  labels: { start: string; else: string; empty: string; hint: string; trash: string }
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
      case ElementType.forSchleife:
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
      for (const token of blockTokens(line)) {
        const word = this.word(token)
        if (v && (token.kind === 'lit' || token.kind === 'str')) {
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
