import type { LayoutNode, Rect } from '../core/layout'
import { normalizingQuotes } from '../core/lineEditorText'
import { ElementType } from '../core/model'
import { diagramFontFamily } from '../core/textMeasurement'

/** Text direkt im Struktogramm bearbeiten (Doppelklick/Doppeltipp), ohne Umweg über den Objektinspektor. */

export interface InlineField {
  value: string
  placeholder: string
  label: string
}

export interface InlineEditOptions {
  host: HTMLElement
  /** Fläche im Diagramm (Diagramm-Koordinaten, ohne Zoom). */
  rect: Rect
  zoom: number
  fontSize: number
  lineHeight: number
  /** Festes Schlüsselwort davor (`if`, `while`, `for`, `input:` …), nicht bearbeitbar. */
  prefix?: string
  /** Ein Feld: Textfeld (Umschalt+Enter = neue Zeile). Mehrere: Eingabezeilen nebeneinander (Zählschleife). */
  fields: InlineField[]
  /** Text mittig wie bei Anweisungen. */
  center: boolean
  /** `undefined` = abgebrochen (Escape). */
  onDone(values: string[] | undefined): void
}

export interface InlineEditor {
  element: HTMLElement
  /** Bearbeitung beenden; `save` übernimmt den Text. */
  finish(save: boolean): void
}

/** Rand bei Aufruf (`callSideBarInset` im Renderer). */
const callBar = 14

/** Fläche, in der der Text eines Elements steht (dort erscheint das Eingabefeld). */
export function textRect(node: LayoutNode, lineHeight: number): Rect {
  const r = node.frame
  switch (node.element.type) {
    case ElementType.aufruf:
      return { x: r.x + callBar, y: r.y, width: Math.max(40, r.width - 2 * callBar), height: r.height }
    case ElementType.aussprung:
      return { x: r.x + callBar, y: r.y, width: Math.max(40, r.width - callBar), height: r.height }
    case ElementType.verzweigung:
      return { x: r.x, y: r.y, width: r.width, height: node.headerBandHeight }
    case ElementType.fallauswahl:
      return { x: r.x, y: r.y, width: r.width, height: Math.max(lineHeight + 8, node.headerBandHeight - caseBandHeight(lineHeight)) }
    case ElementType.forSchleife:
    case ElementType.whileSchleife:
    case ElementType.endlosschleife: {
      const bodyTop = node.children[0]?.frame.y ?? r.y + r.height
      return { x: r.x, y: r.y, width: r.width, height: Math.max(lineHeight + 8, bodyTop - r.y) }
    }
    case ElementType.doUntilSchleife:
      return { x: r.x, y: r.y + r.height - node.headerBandHeight, width: r.width, height: node.headerBandHeight }
    default:
      return r
  }
}

/** Höhe des Bands mit den Fallnamen unter dem Dach der Fallauswahl (wie im Renderer). */
export function caseBandHeight(lineHeight: number): number {
  return Math.max(26, lineHeight + 10)
}

/** Fallauswahl: Index des Falls, wenn der Punkt auf einer Fallbeschriftung liegt. */
export function caseLabelAt(node: LayoutNode, x: number, y: number, lineHeight: number): number | undefined {
  if (node.element.type !== ElementType.fallauswahl) return undefined
  const bottom = node.frame.y + node.headerBandHeight
  if (y > bottom || y < bottom - caseBandHeight(lineHeight)) return undefined
  const i = node.caseColumnFrames.findIndex((c) => x >= c.x && x <= c.x + c.width)
  return i >= 0 ? i : undefined
}

/** Fläche einer Fallbeschriftung. */
export function caseLabelRect(node: LayoutNode, index: number, lineHeight: number): Rect {
  const col = node.caseColumnFrames[index]
  const band = caseBandHeight(lineHeight)
  return { x: col.x, y: node.frame.y + node.headerBandHeight - band, width: col.width, height: band }
}

export function openInlineEditor(o: InlineEditOptions): InlineEditor {
  const z = o.zoom
  const box = document.createElement('div')
  box.className = 'inline-edit'
  if (o.center) box.classList.add('inline-edit-center')
  const minH = 40
  const top = o.rect.y * z
  const height = Math.max(minH, o.rect.height * z)
  Object.assign(box.style, {
    left: `${o.rect.x * z}px`,
    top: `${top - Math.max(0, (minH - o.rect.height * z) / 2)}px`,
    width: `${Math.max(o.fields.length > 1 ? 300 : 120, o.rect.width * z)}px`,
    minHeight: `${height}px`,
    fontFamily: diagramFontFamily,
    fontSize: `${o.fontSize * z}px`,
    lineHeight: `${o.lineHeight * z}px`,
  })
  if (o.prefix) {
    const p = document.createElement('span')
    p.className = 'inline-edit-prefix'
    p.textContent = o.prefix
    box.append(p)
  }
  const inputs: (HTMLInputElement | HTMLTextAreaElement)[] = []
  o.fields.forEach((f, i) => {
    const multi = o.fields.length === 1
    const input = multi ? document.createElement('textarea') : document.createElement('input')
    input.value = f.value
    input.placeholder = f.placeholder
    input.spellcheck = false
    input.setAttribute('autocomplete', 'off')
    input.setAttribute('autocapitalize', 'off')
    input.setAttribute('autocorrect', 'off')
    input.setAttribute('aria-label', f.label)
    if (input instanceof HTMLTextAreaElement) input.rows = Math.max(1, f.value.split('\n').length)
    if (i > 0) {
      const sep = document.createElement('span')
      sep.className = 'inline-edit-sep'
      sep.textContent = ';'
      box.append(sep)
    }
    box.append(input)
    inputs.push(input)
  })

  const fit = (input: HTMLInputElement | HTMLTextAreaElement) => {
    if (!(input instanceof HTMLTextAreaElement)) return
    input.rows = Math.max(1, input.value.split('\n').length)
    input.style.height = 'auto'
    input.style.height = `${input.scrollHeight}px`
  }

  let done = false
  const finish = (save: boolean) => {
    if (done) return
    done = true
    box.remove()
    o.onDone(save ? inputs.map((i) => i.value) : undefined)
  }

  for (const input of inputs as HTMLInputElement[]) {
    input.addEventListener('input', () => {
      // Typografische Anführungszeichen sofort durch gerade ersetzen (gleiche Länge, Cursor bleibt).
      const normalized = normalizingQuotes(input.value)
      if (normalized !== input.value) {
        const pos = input.selectionStart
        input.value = normalized
        input.setSelectionRange(pos, pos)
      }
      fit(input)
    })
    input.addEventListener('keydown', (ev) => {
      ev.stopPropagation()
      if (ev.key === 'Escape') {
        ev.preventDefault()
        finish(false)
      } else if (ev.key === 'Enter' && !(ev.shiftKey && o.fields.length === 1) && !ev.isComposing) {
        ev.preventDefault()
        finish(true)
      }
    })
  }
  // Daneben tippen übernimmt; Wechsel zwischen den Feldern der Zählschleife nicht.
  box.addEventListener('focusout', (ev) => {
    const next = ev.relatedTarget
    if (next instanceof Node && box.contains(next)) return
    // Kurz warten: Manche Browser verschieben den Fokus beim Öffnen noch einmal.
    setTimeout(() => {
      if (!done && !box.contains(document.activeElement)) finish(true)
    }, 0)
  })
  // Zeiger im Feld gehört dem Feld, nicht dem Struktogramm darunter.
  for (const type of ['pointerdown', 'click', 'dblclick', 'contextmenu'] as const) {
    box.addEventListener(type, (ev) => ev.stopPropagation())
  }

  o.host.append(box)
  inputs.forEach(fit)
  const first = inputs[0]
  first.focus({ preventScroll: true })
  first.select()
  box.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  return { element: box, finish }
}
