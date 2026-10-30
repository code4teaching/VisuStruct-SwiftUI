/**
 * VisuObject: Aufteilung wie in WebGoatCode. Projekt, Java-Code und Klassendiagramm liegen flach
 * nebeneinander; jeder Bereich klappt mit „–“ ein, übrig bleibt ein schmaler Streifen mit seinem Namen.
 * Schieber ändern die Breite des Projekts und das Verhältnis von Code und Diagramm (Doppelklick = Standard).
 * Am Handy liegen die Bereiche untereinander, dort gelten die Spalten nicht (siehe styles.css).
 */

export type PaneId = 'explorer' | 'code' | 'diagram'

const key = 'visuobject.layout'
/** Alter Schalter aus der ersten Fassung: `0` = Projekt eingeklappt. */
const oldExplorerKey = 'visuobject.explorer'
const strip = '40px'
const defaults = { explorer: 260, split: 45 }

const clamp = (n: number, min: number, max: number, fallback: number) => (Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback)
const clampExplorer = (n: number) => clamp(n, 180, 480, defaults.explorer)
const clampSplit = (n: number) => clamp(n, 20, 80, defaults.split)

export class ObjectLayout {
  private collapsed = new Set<PaneId>()
  /** Breite des Projekts in px. */
  private explorer = defaults.explorer
  /** Anteil des Codes an Code + Diagramm in Prozent. */
  private split = defaults.split

  constructor(
    private root: HTMLElement,
    private changed: () => void,
  ) {
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? 'null') as { collapsed?: PaneId[]; explorer?: number; split?: number } | null
      if (saved) {
        for (const id of saved.collapsed ?? []) if (id === 'explorer' || id === 'code' || id === 'diagram') this.collapsed.add(id)
        this.explorer = clampExplorer(Number(saved.explorer ?? defaults.explorer))
        this.split = clampSplit(Number(saved.split ?? defaults.split))
      } else if (localStorage.getItem(oldExplorerKey) === '0') this.collapsed.add('explorer')
    } catch {
      /* ohne gespeicherte Aufteilung geht es auch */
    }
    for (const b of root.querySelectorAll<HTMLElement>('[data-collapse]')) b.addEventListener('click', () => this.toggle(b.dataset.collapse as PaneId, true))
    for (const b of root.querySelectorAll<HTMLElement>('[data-expand]')) b.addEventListener('click', () => this.toggle(b.dataset.expand as PaneId, false))
    const explorerSplitter = root.querySelector<HTMLElement>('.vo-splitter[data-split=explorer]')!
    const codeSplitter = root.querySelector<HTMLElement>('.vo-splitter[data-split=code]')!
    this.splitter(explorerSplitter, {
      at: (ev) => ev.clientX - root.getBoundingClientRect().left,
      get: () => this.explorer,
      set: (n) => (this.explorer = clampExplorer(n)),
      reset: defaults.explorer,
      step: 20,
    })
    this.splitter(codeSplitter, {
      at: (ev) => {
        const code = root.querySelector<HTMLElement>('[data-pane=code]')!.getBoundingClientRect()
        const diagram = root.querySelector<HTMLElement>('[data-pane=diagram]')!.getBoundingClientRect()
        return ((ev.clientX - code.left) / (diagram.right - code.left)) * 100
      },
      get: () => this.split,
      set: (n) => (this.split = clampSplit(n)),
      reset: defaults.split,
      step: 5,
    })
    this.apply()
  }

  isCollapsed(id: PaneId): boolean {
    return this.collapsed.has(id)
  }

  /** Bereich ein- oder ausklappen; der letzte offene Bereich bleibt offen. */
  toggle(id: PaneId, hide = !this.collapsed.has(id)) {
    if (hide && !this.collapsed.has(id) && this.collapsed.size >= 2) return
    if (hide) this.collapsed.add(id)
    else this.collapsed.delete(id)
    this.apply()
    // Fokus dorthin, wo man weitermacht: aufgeklappt in den Bereich, eingeklappt auf den Streifen.
    const pane = this.root.querySelector<HTMLElement>(`[data-pane=${id}]`)!
    if (hide) pane.querySelector<HTMLElement>('.vo-strip')?.focus()
    else pane.querySelector<HTMLElement>('[data-collapse]')?.focus()
  }

  private apply() {
    const c = this.collapsed
    const bothRightGone = c.has('code') && c.has('diagram')
    const explorer = c.has('explorer') ? strip : bothRightGone ? '1fr' : `${this.explorer}px`
    const code = c.has('code') ? strip : `minmax(0, ${this.split}fr)`
    const diagram = c.has('diagram') ? strip : `minmax(0, ${100 - this.split}fr)`
    this.root.style.setProperty('--vo-cols', `${explorer} 1px ${code} 1px ${diagram}`)
    for (const pane of this.root.querySelectorAll<HTMLElement>('[data-pane]')) pane.classList.toggle('collapsed', c.has(pane.dataset.pane as PaneId))
    const explorerSplitter = this.root.querySelector<HTMLElement>('.vo-splitter[data-split=explorer]')!
    const codeSplitter = this.root.querySelector<HTMLElement>('.vo-splitter[data-split=code]')!
    explorerSplitter.classList.toggle('fixed', c.has('explorer') || bothRightGone)
    codeSplitter.classList.toggle('fixed', c.has('code') || c.has('diagram'))
    explorerSplitter.setAttribute('aria-valuenow', String(this.explorer))
    codeSplitter.setAttribute('aria-valuenow', String(this.split))
    try {
      localStorage.setItem(key, JSON.stringify({ collapsed: [...c], explorer: this.explorer, split: this.split }))
    } catch {
      /* nicht schlimm */
    }
    this.changed()
  }

  private splitter(el: HTMLElement, o: { at(ev: PointerEvent): number; get(): number; set(n: number): void; reset: number; step: number }) {
    el.addEventListener('pointerdown', (ev) => {
      if (el.classList.contains('fixed')) return
      ev.preventDefault()
      el.setPointerCapture(ev.pointerId)
      this.root.classList.add('vo-resizing')
      const move = (m: PointerEvent) => {
        o.set(o.at(m))
        this.apply()
      }
      const up = () => {
        this.root.classList.remove('vo-resizing')
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerup', up)
        el.removeEventListener('pointercancel', up)
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerup', up)
      el.addEventListener('pointercancel', up)
    })
    el.addEventListener('dblclick', () => {
      o.set(o.reset)
      this.apply()
    })
    el.addEventListener('keydown', (ev) => {
      const d = ev.key === 'ArrowLeft' ? -o.step : ev.key === 'ArrowRight' ? o.step : 0
      if (!d) return
      ev.preventDefault()
      o.set(o.get() + d)
      this.apply()
    })
  }
}
