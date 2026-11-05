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
 * Stufe 1: nur ansehen und auswählen – bearbeitet wird über die Eigenschaften und die Palette (Klick fügt ein).
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
  /** Klick auf einen Block: diesen Pfad auswählen. */
  select: (path: number[]) => void
  /** Texte der Knöpfe/Beschriftungen (übersetzt). */
  labels: { start: string; else: string; empty: string; hint: string }
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
      e.preventDefault()
      this.options.select(JSON.parse(box.dataset.path!) as number[])
    })
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
    this.element.replaceChildren(hint, stack)
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
