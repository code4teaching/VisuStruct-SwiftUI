import { t } from './i18n'
import { generateLiveJava, livePlaceholderEnd, livePlaceholderStart, type LiveSpan } from '../core/codeGenerator'
import type { VSDocument } from '../core/model'
import { sidebarIcon } from './learnPanel'

/** Ansicht „Code live“: rechts neben dem Struktogramm der Java-Code, der bei jeder Änderung mitwächst. */

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Eine Codezeile als HTML; Platzhalter grau. */
function lineHTML(line: string): string {
  let out = ''
  let rest = line
  for (;;) {
    const start = rest.indexOf(livePlaceholderStart)
    if (start < 0) break
    const end = rest.indexOf(livePlaceholderEnd, start)
    if (end < 0) break
    out += esc(rest.slice(0, start)) + `<span class="ph">${esc(rest.slice(start + 1, end))}</span>`
    rest = rest.slice(end + 1)
  }
  return out + esc(rest)
}

const samePath = (a: number[], b: number[]) => a.length === b.length && a.every((x, i) => x === b[i])

/** Innerstes Element, zu dem die Zeile gehört. */
function spanAtLine(spans: LiveSpan[], line: number): LiveSpan | undefined {
  let best: LiveSpan | undefined
  for (const s of spans) {
    if (line < s.from || line > s.to) continue
    if (!best || s.to - s.from < best.to - best.from || (s.to - s.from === best.to - best.from && s.path.length > best.path.length)) best = s
  }
  return best
}

export class LiveCodePanel {
  readonly element: HTMLElement
  private view!: HTMLElement
  private spans: LiveSpan[] = []
  private highlighted?: string
  private html = ''

  constructor(
    private onHide: () => void,
    /** Klick auf eine Zeile wählt das Element im Struktogramm aus. */
    private onSelect: (path: number[]) => void,
  ) {
    this.element = document.createElement('aside')
    this.element.className = 'livecode'
    this.build()
  }

  /** Neu aufbauen, z. B. nach einem Sprachwechsel. */
  build() {
    this.element.innerHTML = `
      <div class="livecode-head">
        <h2>${esc(t('web_live_title'))} <small>Java</small></h2>
        <button class="learn-hide" title="${esc(t('web_live_hide'))}" aria-label="${esc(t('web_live_hide'))}">${sidebarIcon}</button>
      </div>
      <p class="hint">${esc(t('web_live_hint'))}</p>
      <pre class="code-view livecode-view" tabindex="0" dir="ltr"></pre>
    `
    this.view = this.element.querySelector('.livecode-view')!
    this.element.querySelector('.learn-hide')!.addEventListener('click', () => this.onHide())
    this.view.addEventListener('click', (e) => {
      const row = (e.target as HTMLElement).closest<HTMLElement>('.ln')
      if (!row || !this.view.classList.contains('selectable')) return
      const span = spanAtLine(this.spans, Number(row.dataset.line))
      if (span) this.onSelect(span.path)
    })
    this.highlighted = undefined
    this.html = ''
  }

  /** `highlight`: ausgewähltes Element bzw. Schritt der Simulation; `selectable`: Zeilen anklickbar. */
  refresh(doc: VSDocument, highlight: number[] | undefined, selectable: boolean) {
    // Dieselben Wörter wie im Struktogramm und im Objektinspektor.
    const live = generateLiveJava(doc, {
      condition: t('canvas_stub_condition'),
      selector: t('web_live_ph_selector'),
      code: t('web_live_ph_code'),
      start: t('inspector_for_init'),
      step: t('inspector_for_step'),
    })
    this.spans = live.spans
    const span = highlight && live.spans.find((s) => samePath(s.path, highlight))
    this.view.classList.toggle('selectable', selectable)
    const html = live.text
      .split('\n')
      .map((line, i) => {
        const marked = span && i >= span.from && i <= span.to
        return `<div class="ln${marked ? ' sel' : ''}" data-line="${i}">${lineHTML(line) || ' '}</div>`
      })
      .join('')
    // Unverändert nicht neu aufbauen: Sonst geht ein Klick verloren, wenn das Verlassen des Objektinspektors
    // zwischen Drücken und Loslassen neu zeichnet, und markierter Text bleibt markiert.
    if (html !== this.html) this.view.innerHTML = html
    this.html = html
    // Nur scrollen, wenn sich die Markierung bewegt hat, sonst springt die Ansicht beim Tippen.
    const key = span ? `${span.from}-${span.to}` : undefined
    if (key && key !== this.highlighted) {
      this.view.querySelector(`.ln[data-line="${span!.from}"]`)?.scrollIntoView({ block: 'nearest' })
    }
    this.highlighted = key
  }
}
