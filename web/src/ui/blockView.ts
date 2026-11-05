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
 * Texte und Werte ändert man (noch) in den Eigenschaften.
 */

/** Ein Wort auf einem Block: Text, Schlüsselwort (fett), Wert (weißes Feld) oder Sensor (türkiser Baustein). */
export interface BlockToken {
  kind: 'text' | 'kw' | 'lit' | 'str' | 'sensor'
  text: string
}

const sensorCalls = new Set(visuBotSensors.map((s) => s.text.match(/^mbot\.(\w+)\(\)/)?.[1]).filter((n): n is string => !!n))

/** Zeile → Wörter: führendes Schlüsselwort, Zeichenketten, Zahlen und Sensorabfragen (`mbot.getDistance()`). */
export function blockTokens(line: string): BlockToken[] {
  const out: BlockToken[] = []
  const split = keywordSplit(line)
  let rest = line
  if (split) {
    out.push({ kind: 'kw', text: split.keyword })
    rest = split.rest ? ` ${split.rest}` : ''
  }
  const re = /("(?:[^"\\]|\\.)*")|(mbot\.(\w+)\(\))|(\b\d+(?:\.\d+)?\b)|\b(true|false|null)\b/g
  let at = 0
  const text = (s: string) => {
    if (!s) return
    const last = out[out.length - 1]
    if (last?.kind === 'text') last.text += s
    else out.push({ kind: 'text', text: s })
  }
  for (const m of rest.matchAll(re)) {
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

export interface BlockViewOptions {
  /** Zeiger auf einem Block: auswählen und ggf. Ziehen beginnen. */
  press: (path: number[], event: PointerEvent) => void
  /** Texte der Knöpfe/Beschriftungen (übersetzt). */
  labels: { start: string; else: string; empty: string; hint: string; trash: string }
}

/**
 * Wohin ein gezogener Block fällt: vor/hinter einen Block, an die Stelle eines leeren Platzes, ans Ende,
 * in die Bedingung (Sensor) oder in den Papierkorb (nur beim Verschieben).
 */
export type BlockDrop =
  | { kind: 'before' | 'after' | 'replace' | 'condition'; path: number[] }
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

  constructor(private options: BlockViewOptions) {
    this.element = document.createElement('div')
    this.element.className = 'blocks-view'
    this.element.hidden = true
    this.element.addEventListener('pointerdown', (e) => {
      if (!this.enabled) return
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

  /** Ablegestelle zeigen (Linie bzw. hervorgehobener Block); `undefined` räumt auf. */
  showDrop(drop: BlockDrop | undefined) {
    this.element.querySelectorAll('.bk-drop').forEach((e) => e.classList.remove('bk-drop'))
    this.element.querySelector('.bk-drop-line')?.remove()
    this.element.querySelector('.bk-trash')?.classList.toggle('bk-trash-hot', drop?.kind === 'trash')
    if (!drop || drop.kind === 'trash') return
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
    box.dataset.path = JSON.stringify(path)
    this.boxes.push({ path, el: box })
    if (isPlaceholderElement(e)) {
      box.className = 'bk-empty'
      box.textContent = this.options.labels.empty
      return box
    }
    const lines = canvasTextLines(e)
    switch (e.type) {
      case ElementType.forSchleife:
      case ElementType.whileSchleife:
      case ElementType.endlosschleife:
        box.className = 'bk bk-c bk-loop'
        box.append(this.head(lines), this.body(e.loopBody ?? [], [...path, 0]), this.foot([]))
        break
      case ElementType.doUntilSchleife:
        // Bedingung erst am Ende geprüft: oben „do“, unten „while …“ wie im Struktogramm
        box.className = 'bk bk-c bk-loop'
        box.append(this.head(['do']), this.body(e.loopBody ?? [], [...path, 0]), this.foot(lines))
        break
      case ElementType.verzweigung: {
        box.className = 'bk bk-c bk-if'
        const cases = e.cases ?? []
        box.append(this.head(lines))
        cases.forEach((c, i) => {
          if (i > 0) box.append(this.clause(i === 1 && cases.length === 2 ? this.options.labels.else : c.name))
          box.append(this.body(c.elements, [...path, i]))
        })
        box.append(this.foot([]))
        break
      }
      case ElementType.fallauswahl:
        box.className = 'bk bk-c bk-if'
        box.append(this.head(lines))
        ;(e.cases ?? []).forEach((c, i) => {
          box.append(this.clause(c.name.toLowerCase() === 'default' ? 'default' : `case ${c.name}`), this.body(c.elements, [...path, i]))
        })
        box.append(this.foot([]))
        break
      case ElementType.aussprung:
        box.className = 'bk bk-cap'
        box.append(this.head(lines))
        break
      case ElementType.aufruf:
        box.className = 'bk bk-simple bk-call'
        box.append(this.head(lines))
        break
      default: {
        box.className = 'bk bk-simple bk-stmt'
        const group = blockGroup(e)
        if (group) {
          box.dataset.botColor = visuBotGroupColor(group)
          const icon = visuBotGroupIcon[group]
          if (icon) lines[0] = `${icon} ${lines[0]}`
        }
        box.append(this.head(lines))
      }
    }
    return box
  }

  private head(lines: string[]): HTMLElement {
    const head = document.createElement('div')
    head.className = 'bk-head'
    for (const line of lines) {
      const row = document.createElement('span')
      row.className = 'bk-line'
      for (const token of blockTokens(line)) row.append(this.word(token))
      head.append(row)
    }
    return head
  }

  private foot(lines: string[]): HTMLElement {
    const foot = this.head(lines)
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
