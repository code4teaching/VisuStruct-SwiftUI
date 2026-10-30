import {
  addNode,
  connect,
  emptyFlow,
  FLOW_FILL,
  FLOW_GRID,
  FLOW_LINE_HEIGHT,
  FLOW_SHAPES,
  flowBox,
  flowFromJSON,
  flowPorts,
  flowToJSON,
  freePort,
  hasInput,
  moveNode,
  portPoint,
  portSide,
  removeEdge,
  removeNode,
  routeEdge,
  setText,
  swapYesNo,
  type FlowBox,
  type FlowDoc,
  type FlowNode,
  type FlowPort,
  type FlowShape,
} from '../core/flowModel'
import { gearIcon } from './app'
import { buildDiagramPDF, canvasRGB, canvasToPNG, exportFilenameSlug, rasterize, svgMarkup, type ExportImage } from './exporter'
import { currentLanguage, t } from './i18n'
import { icons } from './icons'
import { setVisuBotMode, setVisuObjectWorld, worldChooserHTML, type WorldChoice } from './visubotView'

/**
 * Welt VisuFlow (…/app/?visuflow): einen PAP (flowchart) frei zeichnen. Symbole aus der Leiste ziehen oder antippen,
 * Text eintippen, Pfeile vom Punkt am Ausgang zum nächsten Symbol ziehen, als Datei speichern und als Bild/PDF exportieren.
 */

declare const __APP_VERSION__: string

const SVG = 'http://www.w3.org/2000/svg'
const docKey = 'visuflow.doc'
const maxUndoSteps = 100
const fontSize = 14
const font = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
const ink = '#1c1c1e'

const e = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

function stored(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ohne Speicher nur für diese Sitzung */
  }
}

function siteURL(): string {
  const code = currentLanguage()
  const lang = code === 'pt-PT' ? 'pt' : code === 'de' ? 'de' : 'en'
  const base = /\/app\/(index\.html)?$/.test(location.pathname) ? '../' : 'https://visustruct.org/'
  return `${base}${lang}/index.html`
}

function download(name: string, data: BlobPart, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function s(tag: string, attrs: Record<string, string | number> = {}): SVGElement {
  const el = document.createElementNS(SVG, tag)
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v))
  return el
}

let measureCtx: CanvasRenderingContext2D | null | undefined
function measure(text: string): number {
  if (measureCtx === undefined) measureCtx = document.createElement('canvas').getContext('2d')
  if (!measureCtx) return text.length * fontSize * 0.55
  measureCtx.font = font
  return measureCtx.measureText(text).width
}

const shapeName = (shape: FlowShape) => t(`web_visuflow_shape_${shape}`)
const defaultText = (shape: FlowShape) => t(`web_visuflow_text_${shape}`)

/** Umriss eines Symbols nach DIN 66001. */
function shapePath(shape: FlowShape, b: { x: number; y: number; w: number; h: number }): SVGElement {
  const l = b.x - b.w / 2
  const r = b.x + b.w / 2
  const top = b.y - b.h / 2
  const bot = b.y + b.h / 2
  if (shape === 'verzweigung') return s('path', { d: `M${b.x} ${top} L${r} ${b.y} L${b.x} ${bot} L${l} ${b.y} Z` })
  if (shape === 'ein') return s('path', { d: `M${l + 14} ${top} L${r} ${top} L${r - 14} ${bot} L${l} ${bot} Z` })
  if (shape === 'unterprogramm') return s('path', { d: `M${l} ${top} H${r} V${bot} H${l} Z M${l + 10} ${top} V${bot} M${r - 10} ${top} V${bot}` })
  return s('rect', { x: l, y: top, width: b.w, height: b.h, rx: shape === 'anweisung' ? 2 : b.h / 2 })
}

function textLines(box: FlowBox): SVGElement {
  const text = s('text', { 'text-anchor': 'middle', 'font-size': fontSize, fill: ink })
  box.lines.forEach((line, i) => {
    const span = s('tspan', { x: box.x, y: box.y + 5 + (i - (box.lines.length - 1) / 2) * FLOW_LINE_HEIGHT })
    span.textContent = line
    text.append(span)
  })
  return text
}

/** Kleines Symbol für die Leiste. */
function paletteIcon(shape: FlowShape): string {
  const svg = s('svg', { viewBox: '0 0 64 36', width: 64, height: 36, 'aria-hidden': 'true' })
  const p = shapePath(shape, { x: 32, y: 18, w: shape === 'verzweigung' ? 54 : 56, h: shape === 'verzweigung' ? 32 : 26 })
  p.setAttribute('fill', FLOW_FILL[shape])
  p.setAttribute('stroke', ink)
  p.setAttribute('stroke-width', '1.5')
  svg.append(p)
  return svg.outerHTML
}

/** Beispiel aus Lektion 1: Tee kochen mit Schleife „Tee noch zu heiß?“. */
function exampleFlow(): FlowDoc {
  let doc = emptyFlow(t('web_visuflow_example_title'))
  const ids: string[] = []
  const add = (shape: FlowShape, x: number, y: number, text: string) => {
    const r = addNode(doc, shape, x, y, text)
    doc = r.doc
    ids.push(r.id)
  }
  add('start', 240, 60, defaultText('start'))
  add('anweisung', 240, 160, t('web_visuflow_example_water'))
  add('anweisung', 240, 260, t('web_visuflow_example_bag'))
  add('verzweigung', 240, 380, t('web_visuflow_example_hot'))
  add('anweisung', 480, 380, t('web_visuflow_example_wait'))
  add('anweisung', 240, 500, t('web_visuflow_example_drink'))
  add('ende', 240, 600, defaultText('ende'))
  const [start, water, bag, hot, wait, drink, end] = ids
  doc = connect(doc, start, 'out', water)
  doc = connect(doc, water, 'out', bag)
  doc = connect(doc, bag, 'out', hot)
  doc = swapYesNo(doc, hot)
  doc = connect(doc, hot, 'ja', wait)
  doc = connect(doc, wait, 'out', hot)
  doc = connect(doc, hot, 'nein', drink)
  doc = connect(doc, drink, 'out', end)
  return doc
}

function startFlow(): FlowDoc {
  return addNode(emptyFlow(), 'start', 240, 60, defaultText('start')).doc
}

type Selection = { kind: 'node' | 'edge'; id: string }

export class FlowApp {
  private shell: HTMLElement
  private svg!: SVGSVGElement
  private scroller!: HTMLElement
  private status!: HTMLElement
  private titleInput!: HTMLInputElement
  private doc: FlowDoc
  private selection?: Selection
  private history: string[] = []
  private future: string[] = []
  private editor?: HTMLTextAreaElement
  /** Pfeil, der gerade gezogen wird. */
  private dragLine?: SVGElement

  constructor(root: HTMLElement) {
    document.documentElement.classList.add('visuflow-theme')
    history.replaceState(history.state, '', `${location.pathname}?visuflow${location.hash}`)
    this.doc = flowFromJSON(stored(docKey) ?? '') ?? exampleFlow()
    this.shell = document.createElement('div')
    this.shell.className = 'shell visuflow'
    root.replaceWith(this.shell)
    this.build()
    this.render()
    window.addEventListener('keydown', (ev) => this.onKey(ev))
  }

  // MARK: - Aufbau

  private build() {
    const button = (action: string, label: string, icon: string, tip = label) =>
      `<button class="icon" data-action="${action}" data-tip="${e(tip)}" aria-label="${e(label)}">${icon}</button>`
    const palette = FLOW_SHAPES.map(
      (shape) => `<button class="vf-shape" data-shape="${shape}" data-tip="${e(t(`web_visuflow_shape_${shape}_tip`))}">${paletteIcon(shape)}<span>${e(shapeName(shape))}</span></button>`,
    ).join('')
    this.shell.innerHTML = `
      <header class="toolbar">
        <a class="brand" href="${e(siteURL())}" title="${e(t('web_site_home'))}"><span class="vf-logo" aria-hidden="true"></span><span>Visu<span class="visuflow-flow">Flow</span></span> <small>${e(t('web_visuflow_subtitle'))}</small></a>
        <div class="group">
          ${button('new', t('toolbar_new'), icons.newFile, t('web_visuflow_new_tip'))}
          ${button('open', t('menu_open'), icons.open, t('web_visuflow_open_tip'))}
          ${button('save', t('menu_save'), icons.save, t('web_visuflow_save_tip'))}
          ${button('undo', t('toolbar_undo'), icons.undo)}
          ${button('redo', t('toolbar_redo'), icons.redo)}
          ${button('delete', t('web_visuflow_delete'), icons.trash, t('web_visuflow_delete_tip'))}
          <button class="text-button" data-action="swap" data-tip="${e(t('web_visuflow_swap_tip'))}" disabled>${e(t('web_visuflow_swap'))}</button>
          <button class="text-button" data-action="example" data-tip="${e(t('web_visuflow_example_tip'))}">${e(t('web_visuflow_example'))}</button>
        </div>
        <div class="group vf-export">
          <button class="text-button" data-action="export" aria-haspopup="true" aria-expanded="false">${e(t('web_export'))}</button>
          <div class="vf-menu" role="menu" hidden>
            <button role="menuitem" data-export="png">${e(t('web_export_png'))}</button>
            <button role="menuitem" data-export="svg">${e(t('web_export_svg'))}</button>
            <button role="menuitem" data-export="pdf">${e(t('web_export_pdf'))}</button>
          </div>
        </div>
        <div class="group settings">
          <button class="icon" data-action="settings" aria-haspopup="true" aria-expanded="false" data-tip="${e(t('action_settings'))}" aria-label="${e(t('action_settings'))}">${gearIcon}</button>
          <div class="settings-menu" role="group" aria-label="${e(t('action_settings'))}" hidden>
            <section data-action="world">
              <h3>${e(t('web_visubot_world_title'))}</h3>
              ${worldChooserHTML()}
            </section>
            <footer>
              <span class="settings-version">${e(t('web_about_version_fmt').replace('%@', __APP_VERSION__))}</span>
            </footer>
          </div>
        </div>
      </header>
      <main class="vf-main">
        <aside class="vf-palette" aria-labelledby="vf-palette-heading">
          <h2 id="vf-palette-heading">${e(t('web_visuflow_palette'))}</h2>
          <div class="vf-shapes">${palette}</div>
          <p class="vf-hint">${e(t('web_visuflow_palette_hint'))}</p>
        </aside>
        <section class="vf-stage">
          <div class="vf-titlebar"><input class="vf-title" type="text" aria-label="${e(t('web_visuflow_title_label'))}" placeholder="${e(t('web_visuflow_title_ph'))}"></div>
          <div class="vf-scroll">
            <svg class="vf-canvas" xmlns="${SVG}" role="img" aria-label="${e(t('web_visuflow_canvas_label'))}"></svg>
          </div>
          <p class="vf-status" role="status"></p>
        </section>
      </main>
      <input type="file" accept=".visuflow,.json,application/json" hidden>`
    const $ = <T extends Element = HTMLElement>(q: string) => this.shell.querySelector<T>(q)!
    this.svg = $<SVGSVGElement>('.vf-canvas')
    this.scroller = $('.vf-scroll')
    this.status = $('.vf-status')
    this.titleInput = $<HTMLInputElement>('.vf-title')
    const on = (action: string, run: () => void) => $(`[data-action=${action}]`).addEventListener('click', run)
    on('new', () => this.replace(startFlow()))
    on('example', () => this.replace(exampleFlow()))
    on('open', () => $<HTMLInputElement>('input[type=file]').click())
    on('save', () => this.save())
    on('undo', () => this.undo(false))
    on('redo', () => this.undo(true))
    on('delete', () => this.deleteSelection())
    on('swap', () => {
      if (this.selection?.kind === 'node') this.change(swapYesNo(this.doc, this.selection.id))
    })
    const fileInput = $<HTMLInputElement>('input[type=file]')
    fileInput.addEventListener('change', async () => {
      const f = fileInput.files?.[0]
      fileInput.value = ''
      if (!f) return
      const doc = flowFromJSON(await f.text())
      if (!doc) return this.showStatus(t('web_visuflow_open_error'))
      if (!doc.title) doc.title = f.name.replace(/\.(visuflow|json)$/i, '')
      this.replace(doc)
    })

    let titleBefore: string | undefined
    this.titleInput.addEventListener('focus', () => (titleBefore = flowToJSON(this.doc)))
    this.titleInput.addEventListener('input', () => {
      this.doc = { ...this.doc, title: this.titleInput.value }
      store(docKey, flowToJSON(this.doc))
    })
    this.titleInput.addEventListener('change', () => {
      if (titleBefore !== undefined && titleBefore !== flowToJSON(this.doc)) this.pushUndo(titleBefore)
      titleBefore = flowToJSON(this.doc)
    })

    // Export
    const exportButton = $<HTMLButtonElement>('[data-action=export]')
    const exportMenu = $('.vf-menu')
    const showExport = (show: boolean) => {
      exportMenu.hidden = !show
      exportButton.setAttribute('aria-expanded', String(show))
    }
    exportButton.addEventListener('click', () => showExport(exportMenu.hidden))
    exportMenu.addEventListener('click', (ev) => {
      const kind = (ev.target as HTMLElement).closest<HTMLElement>('[data-export]')?.dataset.export
      if (!kind) return
      showExport(false)
      void this.export(kind as 'png' | 'svg' | 'pdf')
    })
    // Einstellungen mit der Welten-Auswahl
    const settings = $<HTMLButtonElement>('[data-action=settings]')
    const menu = $('.settings-menu')
    settings.addEventListener('click', () => {
      menu.hidden = !menu.hidden
      settings.setAttribute('aria-expanded', String(!menu.hidden))
    })
    document.addEventListener('pointerdown', (ev) => {
      const target = ev.target as HTMLElement
      if (!menu.hidden && !target.closest('.settings')) menu.hidden = true
      if (!exportMenu.hidden && !target.closest('.vf-export')) showExport(false)
    })
    for (const b of menu.querySelectorAll<HTMLButtonElement>('[data-world]')) b.addEventListener('click', () => this.chooseWorld(b.dataset.world as WorldChoice))

    for (const b of this.shell.querySelectorAll<HTMLButtonElement>('.vf-shape')) this.setupPaletteButton(b)
    this.svg.addEventListener('pointerdown', (ev) => this.onPointerDown(ev))
    this.svg.addEventListener('dblclick', (ev) => {
      const id = (ev.target as Element).closest<SVGElement>('[data-node]')?.dataset.node
      if (id) this.editText(id)
    })
  }

  private chooseWorld(world: WorldChoice) {
    if (world === 'flow') return
    if (world === 'object') {
      setVisuObjectWorld()
      location.href = `${location.pathname}?visuobject${location.hash}`
      return
    }
    setVisuBotMode(world)
    location.href = `${location.pathname}?${world === 'on' ? 'visubot' : 'visustruct'}${location.hash}`
  }

  // MARK: - Zustand und Rückgängig

  private pushUndo(before: string) {
    this.history.push(before)
    if (this.history.length > maxUndoSteps) this.history.shift()
    this.future = []
  }

  private change(next: FlowDoc, select?: Selection | null) {
    if (next === this.doc) return
    this.pushUndo(flowToJSON(this.doc))
    this.doc = next
    if (select !== undefined) this.selection = select ?? undefined
    this.afterChange()
  }

  private replace(doc: FlowDoc) {
    this.change(doc, null)
    this.scroller.scrollTo(0, 0)
  }

  private afterChange() {
    store(docKey, flowToJSON(this.doc))
    if (this.selection && !this.find(this.selection)) this.selection = undefined
    this.render()
  }

  private find(sel: Selection) {
    return sel.kind === 'node' ? this.doc.nodes.find((n) => n.id === sel.id) : this.doc.edges.find((x) => x.id === sel.id)
  }

  private undo(redo: boolean) {
    this.closeEditor(true)
    const from = redo ? this.future : this.history
    const to = redo ? this.history : this.future
    const text = from.pop()
    if (text === undefined) return
    to.push(flowToJSON(this.doc))
    this.doc = flowFromJSON(text) ?? this.doc
    this.afterChange()
  }

  private deleteSelection() {
    const sel = this.selection
    if (!sel) return
    this.change(sel.kind === 'node' ? removeNode(this.doc, sel.id) : removeEdge(this.doc, sel.id), null)
  }

  private save() {
    const base = exportFilenameSlug(this.doc.title) || 'PAP'
    download(`${base}.visuflow`, flowToJSON(this.doc), 'application/json')
    this.showStatus(t('web_visuflow_saved', `${base}.visuflow`))
  }

  // MARK: - Zeichnen

  private boxes(doc = this.doc) {
    return new Map(doc.nodes.map((n) => [n.id, flowBox(n, measure)]))
  }

  /** Zeichnet den Plan; `exporting` ohne Punkte an den Ausgängen und ohne Auswahl. */
  private drawInto(svg: SVGSVGElement, exporting: boolean) {
    const boxes = this.boxes()
    const yes = t('web_learn_pap_yes')
    const no = t('web_learn_pap_no')
    svg.innerHTML = `<defs><marker id="vf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="${ink}"/></marker></defs>`
    const edges = s('g', { class: 'vf-edges' })
    const labels = s('g', { class: 'vf-labels', 'font-size': 12, 'font-weight': 600 })
    const nodes = s('g', { class: 'vf-nodes' })
    const ports = s('g', { class: 'vf-ports' })
    let lane = 0
    for (const edge of this.doc.edges) {
      const from = this.doc.nodes.find((n) => n.id === edge.from)!
      const a = boxes.get(edge.from)!
      const b = boxes.get(edge.to)!
      const side = portSide(this.doc, from, edge.port)
      const back = b.y - b.h / 2 < portPoint(a, side)[1] + FLOW_GRID
      const pts = routeEdge(a, side, b, back ? lane++ : 0)
      const points = pts.map((p) => p.join(',')).join(' ')
      const g = s('g', { 'data-edge': edge.id, class: `vf-edge${!exporting && this.selection?.kind === 'edge' && this.selection.id === edge.id ? ' selected' : ''}` })
      if (!exporting) g.append(s('polyline', { points, class: 'vf-edge-hit', fill: 'none', stroke: 'transparent', 'stroke-width': 16 }))
      g.append(s('polyline', { points, class: 'vf-edge-line', fill: 'none', stroke: ink, 'stroke-width': 2, 'marker-end': 'url(#vf-arrow)' }))
      edges.append(g)
    }
    for (const node of this.doc.nodes) {
      const b = boxes.get(node.id)!
      const selected = !exporting && this.selection?.kind === 'node' && this.selection.id === node.id
      const g = s('g', { 'data-node': node.id, class: `vf-node${selected ? ' selected' : ''}` })
      const p = shapePath(node.shape, b)
      p.setAttribute('fill', FLOW_FILL[node.shape])
      p.setAttribute('stroke', ink)
      p.setAttribute('stroke-width', '2')
      g.append(p, textLines(b))
      nodes.append(g)
      for (const port of flowPorts(node.shape)) {
        const side = portSide(this.doc, node, port)
        const [px, py] = portPoint(b, side)
        const used = this.doc.edges.some((x) => x.from === node.id && x.port === port)
        if (port !== 'out' && (used || !exporting)) {
          const lbl = s('text', side === 'bottom' ? { x: px + 7, y: py + 15 } : { x: px + 6, y: py - 7 })
          lbl.setAttribute('fill', port === 'ja' ? '#248a3d' : '#d70015')
          lbl.textContent = port === 'ja' ? yes : no
          labels.append(lbl)
        }
        if (exporting) continue
        const pg = s('g', { 'data-port': port, 'data-from': node.id, class: `vf-port${used ? ' used' : ''}` })
        pg.append(s('circle', { cx: px, cy: py, r: 16, fill: 'transparent' }), s('circle', { cx: px, cy: py, r: 6, class: 'vf-port-dot' }))
        ports.append(pg)
      }
    }
    svg.append(edges, nodes, labels, ports)
    return boxes
  }

  private render() {
    this.closeEditor(true)
    const boxes = this.drawInto(this.svg, false)
    let w = 0
    let h = 0
    for (const b of boxes.values()) {
      w = Math.max(w, b.x + b.w / 2)
      h = Math.max(h, b.y + b.h / 2)
    }
    // Platz zum Weiterzeichnen nach rechts und unten.
    const width = Math.max(this.scroller.clientWidth, w + 300)
    const height = Math.max(this.scroller.clientHeight, h + 300)
    this.svg.setAttribute('width', String(width))
    this.svg.setAttribute('height', String(height))
    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    if (document.activeElement !== this.titleInput) this.titleInput.value = this.doc.title
    const sel = this.selection
    const node = sel?.kind === 'node' ? this.doc.nodes.find((n) => n.id === sel.id) : undefined
    this.shell.querySelector<HTMLButtonElement>('[data-action=swap]')!.disabled = node?.shape !== 'verzweigung'
    this.shell.querySelector<HTMLButtonElement>('[data-action=delete]')!.disabled = !sel
    this.shell.querySelector<HTMLButtonElement>('[data-action=undo]')!.disabled = this.history.length === 0
    this.shell.querySelector<HTMLButtonElement>('[data-action=redo]')!.disabled = this.future.length === 0
    this.showStatus(t(this.doc.nodes.length === 0 ? 'web_visuflow_status_empty' : sel?.kind === 'edge' ? 'web_visuflow_status_edge' : sel ? 'web_visuflow_status_node' : 'web_visuflow_status_idle'))
  }

  private showStatus(text: string) {
    this.status.textContent = text
  }

  // MARK: - Leiste

  /** Symbol antippen hängt es an das gewählte an, Ziehen legt es auf die Fläche. */
  private setupPaletteButton(button: HTMLButtonElement) {
    const shape = button.dataset.shape as FlowShape
    button.addEventListener('pointerdown', (ev) => {
      if (ev.button !== 0) return
      ev.preventDefault()
      const start = { x: ev.clientX, y: ev.clientY }
      let ghost: HTMLElement | undefined
      const move = (m: PointerEvent) => {
        if (!ghost && Math.hypot(m.clientX - start.x, m.clientY - start.y) < 6) return
        if (!ghost) {
          ghost = document.createElement('div')
          ghost.className = 'vf-ghost'
          ghost.innerHTML = paletteIcon(shape)
          document.body.append(ghost)
        }
        ghost.style.left = `${m.clientX}px`
        ghost.style.top = `${m.clientY}px`
      }
      const up = (u: PointerEvent) => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
        window.removeEventListener('pointercancel', up)
        if (!ghost) return this.appendShape(shape)
        ghost.remove()
        if (u.type === 'pointercancel') return
        const r = this.scroller.getBoundingClientRect()
        if (u.clientX < r.left || u.clientX > r.right || u.clientY < r.top || u.clientY > r.bottom) return
        const p = this.toCanvas(u)
        const { doc, id } = addNode(this.doc, shape, p.x, p.y, defaultText(shape))
        this.change(doc, { kind: 'node', id })
        this.editText(id)
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      window.addEventListener('pointercancel', up)
    })
    button.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Enter' && ev.key !== ' ') return
      ev.preventDefault()
      this.appendShape(shape)
    })
  }

  /** Neues Symbol unter (oder bei „nein“ rechts neben) das gewählte und gleich mit einem Pfeil verbinden. */
  private appendShape(shape: FlowShape) {
    const sel = this.selection
    const from = sel?.kind === 'node' ? this.doc.nodes.find((n) => n.id === sel.id) : undefined
    const port = from && hasInput(shape) ? freePort(this.doc, from) : undefined
    const probe = flowBox({ id: '', shape, x: 0, y: 0, text: defaultText(shape) }, measure)
    let x = 240
    let y = 60
    if (from && port) {
      const b = flowBox(from, measure)
      if (portSide(this.doc, from, port) === 'right') {
        x = b.x + b.w / 2 + 3 * FLOW_GRID + probe.w / 2
        y = b.y
      } else {
        x = b.x
        y = b.y + b.h / 2 + 3 * FLOW_GRID + probe.h / 2
      }
    } else if (this.doc.nodes.length) {
      const boxes = [...this.boxes().values()]
      const low = boxes.reduce((a, b) => (b.y + b.h / 2 > a.y + a.h / 2 ? b : a))
      x = from ? flowBox(from, measure).x : low.x
      y = low.y + low.h / 2 + 3 * FLOW_GRID + probe.h / 2
    }
    let { doc, id } = addNode(this.doc, shape, x, y, defaultText(shape))
    if (from && port) doc = connect(doc, from.id, port, id)
    this.change(doc, { kind: 'node', id })
    const node = this.svg.querySelector(`[data-node="${id}"]`)
    node?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
    this.editText(id)
  }

  // MARK: - Zeichenfläche

  private toCanvas(ev: { clientX: number; clientY: number }) {
    const r = this.svg.getBoundingClientRect()
    return { x: ev.clientX - r.left, y: ev.clientY - r.top }
  }

  private nodeAt(p: { x: number; y: number }, except?: string): FlowNode | undefined {
    const boxes = this.boxes()
    return [...this.doc.nodes].reverse().find((n) => {
      const b = boxes.get(n.id)!
      return n.id !== except && Math.abs(p.x - b.x) <= b.w / 2 + 4 && Math.abs(p.y - b.y) <= b.h / 2 + 4
    })
  }

  private onPointerDown(ev: PointerEvent) {
    if (ev.button !== 0) return
    const target = ev.target as Element
    const port = target.closest<SVGElement>('[data-port]')
    if (port) return this.dragArrow(ev, port.dataset.from!, port.dataset.port as FlowPort)
    const nodeId = target.closest<SVGElement>('[data-node]')?.dataset.node
    if (nodeId) return this.dragNode(ev, nodeId)
    const edgeId = target.closest<SVGElement>('[data-edge]')?.dataset.edge
    this.closeEditor(true)
    this.selection = edgeId ? { kind: 'edge', id: edgeId } : undefined
    this.render()
  }

  private dragNode(ev: PointerEvent, id: string) {
    ev.preventDefault()
    const wasSelected = this.selection?.kind === 'node' && this.selection.id === id
    this.closeEditor(true)
    this.selection = { kind: 'node', id }
    this.render()
    const node = this.doc.nodes.find((n) => n.id === id)!
    const start = this.toCanvas(ev)
    const before = flowToJSON(this.doc)
    const origin = { x: node.x, y: node.y }
    let moved = false
    const move = (m: PointerEvent) => {
      const p = this.toCanvas(m)
      if (!moved && Math.hypot(p.x - start.x, p.y - start.y) < 5) return
      moved = true
      this.doc = moveNode(this.doc, id, origin.x + p.x - start.x, origin.y + p.y - start.y)
      this.render()
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      if (moved) {
        if (flowToJSON(this.doc) !== before) this.pushUndo(before)
        this.afterChange()
      } else if (wasSelected) this.editText(id)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  /** Pfeil vom Ausgang ziehen und über dem Zielsymbol loslassen. */
  private dragArrow(ev: PointerEvent, from: string, port: FlowPort) {
    ev.preventDefault()
    this.closeEditor(true)
    const node = this.doc.nodes.find((n) => n.id === from)!
    const [sx, sy] = portPoint(flowBox(node, measure), portSide(this.doc, node, port))
    this.dragLine = s('line', { x1: sx, y1: sy, x2: sx, y2: sy, class: 'vf-drag-line', 'marker-end': 'url(#vf-arrow)' })
    this.svg.append(this.dragLine)
    this.showStatus(t('web_visuflow_status_connect'))
    let hover: SVGElement | null = null
    const move = (m: PointerEvent) => {
      const p = this.toCanvas(m)
      this.dragLine!.setAttribute('x2', String(p.x))
      this.dragLine!.setAttribute('y2', String(p.y))
      const target = this.nodeAt(p, from)
      hover?.classList.remove('drop-target')
      hover = target && hasInput(target.shape) ? this.svg.querySelector<SVGElement>(`[data-node="${target.id}"]`) : null
      hover?.classList.add('drop-target')
    }
    const up = (u: PointerEvent) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      this.dragLine?.remove()
      this.dragLine = undefined
      const target = u.type === 'pointercancel' ? undefined : this.nodeAt(this.toCanvas(u), from)
      if (target && hasInput(target.shape)) this.change(connect(this.doc, from, port, target.id), { kind: 'node', id: target.id })
      else this.render()
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  // MARK: - Text eintippen

  private editText(id: string) {
    this.closeEditor(true)
    const node = this.doc.nodes.find((n) => n.id === id)
    if (!node) return
    const b = flowBox(node, measure)
    const area = document.createElement('textarea')
    area.className = 'vf-editor'
    area.value = node.text
    area.setAttribute('aria-label', t('web_visuflow_edit_label'))
    const inner = node.shape === 'verzweigung' ? 0.62 : 0.92
    const w = Math.max(110, b.w * inner)
    area.style.left = `${this.svg.getBoundingClientRect().left - this.scroller.getBoundingClientRect().left + this.scroller.scrollLeft + b.x - w / 2}px`
    area.style.top = `${this.svg.getBoundingClientRect().top - this.scroller.getBoundingClientRect().top + this.scroller.scrollTop + b.y - Math.max(28, b.lines.length * FLOW_LINE_HEIGHT + 10) / 2}px`
    area.style.width = `${w}px`
    area.style.height = `${Math.max(28, b.lines.length * FLOW_LINE_HEIGHT + 10)}px`
    area.dataset.node = id
    this.scroller.append(area)
    this.editor = area
    area.focus()
    area.select()
    const fit = () => {
      area.style.height = 'auto'
      area.style.height = `${area.scrollHeight}px`
    }
    area.addEventListener('input', fit)
    area.addEventListener('keydown', (k) => {
      k.stopPropagation()
      if (k.key === 'Enter' && !k.shiftKey) {
        k.preventDefault()
        this.closeEditor(true)
      } else if (k.key === 'Escape') {
        k.preventDefault()
        this.closeEditor(false)
      }
    })
    area.addEventListener('blur', () => this.closeEditor(true))
  }

  private closeEditor(commit: boolean) {
    const area = this.editor
    if (!area) return
    this.editor = undefined
    area.remove()
    const id = area.dataset.node!
    const node = this.doc.nodes.find((n) => n.id === id)
    const text = area.value.trim()
    if (commit && node && text !== node.text) this.change(setText(this.doc, id, text))
  }

  // MARK: - Tastatur

  private onKey(ev: KeyboardEvent) {
    const typing = (ev.target as HTMLElement).closest?.('input, textarea, [contenteditable]')
    const mod = ev.ctrlKey || ev.metaKey
    if (mod && ev.key.toLowerCase() === 's') {
      ev.preventDefault()
      return this.save()
    }
    if (typing) return
    if (mod && ev.key.toLowerCase() === 'z') {
      ev.preventDefault()
      return this.undo(ev.shiftKey)
    }
    if (mod && ev.key.toLowerCase() === 'y') {
      ev.preventDefault()
      return this.undo(true)
    }
    const sel = this.selection
    if (!sel) return
    if (ev.key === 'Delete' || ev.key === 'Backspace') {
      ev.preventDefault()
      return this.deleteSelection()
    }
    if (sel.kind !== 'node') return
    if (ev.key === 'Enter' || ev.key === 'F2') {
      ev.preventDefault()
      return this.editText(sel.id)
    }
    const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[ev.key]
    if (!step) return
    ev.preventDefault()
    const node = this.doc.nodes.find((n) => n.id === sel.id)!
    this.change(moveNode(this.doc, sel.id, node.x + step[0] * FLOW_GRID, node.y + step[1] * FLOW_GRID))
  }

  // MARK: - Export

  /** Plan ohne Auswahl und Punkte, zugeschnitten, mit Titel oben. */
  private exportImage(): ExportImage | undefined {
    if (this.doc.nodes.length === 0) return undefined
    const svg = document.createElementNS(SVG, 'svg') as SVGSVGElement
    const boxes = this.drawInto(svg, true)
    let x0 = Infinity
    let y0 = Infinity
    let x1 = -Infinity
    let y1 = -Infinity
    for (const b of boxes.values()) {
      x0 = Math.min(x0, b.x - b.w / 2)
      y0 = Math.min(y0, b.y - b.h / 2)
      x1 = Math.max(x1, b.x + b.w / 2)
      y1 = Math.max(y1, b.y + b.h / 2)
    }
    // Pfeile laufen rechts außen vorbei, Beschriftungen stehen neben den Ausgängen.
    for (const pl of svg.querySelectorAll('polyline')) {
      for (const pair of (pl.getAttribute('points') ?? '').split(' ')) {
        const [px, py] = pair.split(',').map(Number)
        x0 = Math.min(x0, px)
        x1 = Math.max(x1, px + 4)
        y0 = Math.min(y0, py)
        y1 = Math.max(y1, py)
      }
    }
    x1 += 30
    const margin = 20
    const title = this.doc.title.trim()
    const titleH = title ? 32 : 0
    const width = Math.ceil(x1 - x0 + 2 * margin)
    const height = Math.ceil(y1 - y0 + 2 * margin + titleH)
    svg.setAttribute('xmlns', SVG)
    svg.setAttribute('width', String(width))
    svg.setAttribute('height', String(height))
    svg.setAttribute('viewBox', `${x0 - margin} ${y0 - margin - titleH} ${width} ${height}`)
    svg.setAttribute('font-family', font.replace(/^\d+px /, ''))
    const bg = s('rect', { x: x0 - margin, y: y0 - margin - titleH, width, height, fill: '#ffffff' })
    svg.insertBefore(bg, svg.firstChild!.nextSibling)
    if (title) {
      const text = s('text', { x: x0 - margin + 12, y: y0 - margin - titleH + 26, 'font-size': 16, 'font-weight': 700, fill: ink })
      text.textContent = title
      svg.append(text)
    }
    return { svg, width, height }
  }

  private async export(kind: 'png' | 'svg' | 'pdf') {
    const image = this.exportImage()
    if (!image) return this.showStatus(t('web_visuflow_status_empty'))
    const base = exportFilenameSlug(this.doc.title) || 'PAP'
    if (kind === 'svg') return download(`${base}.svg`, svgMarkup(image), 'image/svg+xml')
    const canvas = await rasterize(image, kind === 'png' ? 2 : 3)
    if (kind === 'png') return download(`${base}.png`, await canvasToPNG(canvas), 'image/png')
    const pdf = await buildDiagramPDF(canvasRGB(canvas), canvas.width, canvas.height, image, this.doc.title.trim() || 'PAP')
    download(`${base}.pdf`, pdf, 'application/pdf')
  }
}
