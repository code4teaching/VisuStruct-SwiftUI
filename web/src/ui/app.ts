import { canvasTextLines, setCanvasStubTexts } from '../core/diagramText'
import {
  appendCaseToFallauswahl,
  canDeleteElement,
  deleteAtPath,
  elementAt,
  insertAfterSibling,
  insertAt,
  insertBeforeSibling,
  isPlaceholderSlot,
  moveAfterSibling,
  moveBeforeSibling,
  moveReplacingPlaceholder,
  newEmptyDocument,
  multiwayAncestorPath,
  caseIndexInMultiway,
  removeCaseFromFallauswahl,
  replaceAtPath,
  sanitizedSelection,
  setFallauswahlCaseName,
  setTextLines,
  tryElementAt,
} from '../core/editing'
import * as LineEditor from '../core/lineEditorText'
import { diagramDisplayMetrics, LayoutEngine, type Layout, type LayoutNode, type Rect } from '../core/layout'
import { ElementType, type VSDocument, type VSElement } from '../core/model'
import { paletteElement, paletteItems, type PaletteItem } from '../core/palette'
import { createCanvasMeasure } from '../core/textMeasurement'
import { decodeDocument, encodeDocument } from '../core/xmlCodec'
import { DiagramRenderer, displayElement, el, flattenNodes, samePath } from './renderer'
import { CodePanel } from './codePanel'
import { LearnPanel, type LearnHost } from './learnPanel'
import type { Exercise } from '../learn/lessonFormat'
import { progress } from '../learn/progress'
import { currentLanguage, languages, setLanguage, t, type LanguageCode } from './i18n'
import * as Export from './exporter'
import { SimulationPanel } from './simulationPanel'

type DropTarget =
  | { kind: 'before' | 'after' | 'replace'; path: number[]; frame: Rect }
  | { kind: 'rootAppend'; frame: Rect }

type DragSource = { kind: 'palette'; item: PaletteItem } | { kind: 'move'; path: number[] }

interface DragState {
  source: DragSource
  pointerId: number
  startX: number
  startY: number
  active: boolean
  ghost?: HTMLElement
  target?: DropTarget
}

// Minimal-Typen der File System Access API (Chrome/Edge); Safari/Firefox fallen auf Download zurück.
interface FileHandle {
  name: string
  getFile(): Promise<File>
  createWritable(): Promise<{ write(data: Blob): Promise<void>; close(): Promise<void> }>
}
type PickerWindow = Window & {
  showOpenFilePicker?: (o: object) => Promise<FileHandle[]>
  showSaveFilePicker?: (o: object) => Promise<FileHandle>
}
const pickerTypes = () => [{ description: t('web_file_type'), accept: { 'application/xml': ['.visustruct', '.strk'] } }]

/** `element_*` aus Localizable.strings. */
const typeName = (type: ElementType) => t(`element_${ElementType[type]}`)

/** `InspectorElementHints.conditionHintLine`: Beispiel über dem Editor. */
const conditionHints: Partial<Record<ElementType, string>> = {
  [ElementType.verzweigung]: 'age >= 18',
  [ElementType.whileSchleife]: 'i < 10',
  [ElementType.doUntilSchleife]: 'again == 1',
  [ElementType.fallauswahl]: 'day',
}

/** Hinweis unter der Art (wie im Swift-Inspector, Englisch und code-nah). */
const ioModeHints: Record<LineEditor.StatementIOMode, string> = {
  statement: 'int number = 5  |  double x = 1.5  |  String text = "Your text"  |  boolean ok = true  |  const double PI = 3.14',
  input: 'input: int age "Enter age"  |  input: double price "Enter price"  |  input: String name "Enter name"',
  output: 'output: number  |  output: "Your text"  |  output: "Your age: " + age',
}

/** `lineEditorFixedPrefixLabel`: Schlüsselwort vor dem Editor, das nicht mitgetippt wird. */
function fixedPrefix(el: VSElement): string | undefined {
  switch (el.type) {
    case ElementType.anweisung: {
      const mode = LineEditor.ioMode(el.textLines.join('\n'))
      return mode === 'input' ? 'input:' : mode === 'output' ? 'output:' : undefined
    }
    case ElementType.verzweigung: return 'if'
    case ElementType.whileSchleife:
    case ElementType.doUntilSchleife:
      return 'while'
    case ElementType.fallauswahl: return 'switch'
    default: return undefined
  }
}

/** `InspectorElementHints.lineEditorPlaceholder`. */
function placeholderFor(el: VSElement): string {
  switch (el.type) {
    case ElementType.anweisung: {
      const mode = LineEditor.ioMode(el.textLines.join('\n'))
      return mode === 'input' ? 'int age "Enter age"' : mode === 'output' ? '"Your age: " + age' : t('inspector_placeholder_statement')
    }
    case ElementType.verzweigung:
    case ElementType.whileSchleife:
    case ElementType.doUntilSchleife:
    case ElementType.endlosschleife:
      return t('inspector_placeholder_condition')
    case ElementType.fallauswahl: return t('inspector_placeholder_selector')
    case ElementType.aufruf: return t('inspector_placeholder_call')
    case ElementType.aussprung: return t('inspector_placeholder_break')
    default: return ''
  }
}

/** Kleines DOM-Hilfsmittel für den Inspector. */
function h(tag: string, attrs: Record<string, string> = {}, ...children: (Node | string)[]): HTMLElement {
  const e = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v)
  e.append(...children)
  return e
}

/** Ein Reiter wie `DiagramSheetTab.swift`: Dokument, Verlauf, Auswahl, verknüpfte Datei. */
interface Tab {
  doc: VSDocument
  serial: number
  /** Dateiname mit Endung; `undefined` = unbenannt. */
  fileName?: string
  fileHandle?: FileHandle
  dirty: boolean
  undoStack: VSDocument[]
  redoStack: VSDocument[]
  selected?: number[]
  /** Reiter gehört zu einer Übung im Lernbereich; ihr Stand wird im Browser gemerkt. */
  exerciseId?: string
}

/** `VisuStructUIScaleStep`: Textgröße des Struktogramms. */
const zoomSteps = [
  { value: 1, label: 'settings_ui_scale_small' },
  { value: 1.22, label: 'settings_ui_scale_medium' },
  { value: 1.5, label: 'settings_ui_scale_large' },
  { value: 1.82, label: 'settings_ui_scale_extra_large' },
]

const isMac = /Mac|iPhone|iPad/.test(navigator.platform)
/** Tastenkürzel im Tooltip, z. B. „Strg+S“ bzw. „⌘S“. */
function shortcut(key: string, shift = false): string {
  if (isMac) return `${shift ? '⇧' : ''}⌘${key}`
  return [t('web_key_ctrl'), ...(shift ? [t('web_key_shift')] : []), key].join('+')
}
const e = escapeHTML
const zoomKey = 'visustruct.ui.scale.canvas'
const learnKey = 'visustruct.learn.open'

/** Wie `VisuStructEditHistory.defaultMaxSteps`. */
const maxUndoSteps = 80

export class App {
  private tabs: Tab[] = []
  private tabIndex = 0
  private nextTabSerial = 1
  private clipboard?: VSElement
  private zoom = 1
  private get tab(): Tab {
    return this.tabs[this.tabIndex]
  }
  private get doc() {
    return this.tab.doc
  }
  private set doc(v: VSDocument) {
    this.tab.doc = v
  }
  private get fileName(): string {
    return this.tab.fileName ?? `${tabTitle(this.tab)}.visustruct`
  }
  private get fileHandle() {
    return this.tab.fileHandle
  }
  private set fileHandle(v: FileHandle | undefined) {
    this.tab.fileHandle = v
  }
  private get dirty() {
    return this.tab.dirty
  }
  private set dirty(v: boolean) {
    this.tab.dirty = v
  }
  private get undoStack() {
    return this.tab.undoStack
  }
  private get redoStack() {
    return this.tab.redoStack
  }
  private get selected() {
    return this.tab.selected
  }
  private set selected(v: number[] | undefined) {
    this.tab.selected = v
  }
  private simulating = false
  private exportSelect!: HTMLSelectElement
  private learn: LearnPanel
  private shell: HTMLElement
  private learning = false
  private learnButton?: HTMLButtonElement
  private exerciseSaveTimer?: number
  private resizeObserver?: ResizeObserver
  /** Im Simulationsmodus markierter Schritt (ersetzt die Auswahl). */
  private simPath?: number[]
  private sim!: SimulationPanel
  private simButton!: HTMLButtonElement
  private coding = false
  private code!: CodePanel
  private codeButton!: HTMLButtonElement

  private measure = createCanvasMeasure()
  private metrics = diagramDisplayMetrics(true)
  private engine = new LayoutEngine(this.metrics, this.measure)
  private renderer = new DiagramRenderer(this.metrics, this.measure)
  private layout?: Layout
  private flat: LayoutNode[] = []

  private canvasHost!: HTMLElement
  private svg?: SVGSVGElement
  private overlay?: SVGGElement
  private inspector!: HTMLElement
  private captionInput!: HTMLInputElement
  private undoButton!: HTMLButtonElement
  private redoButton!: HTMLButtonElement
  private deleteButton!: HTMLButtonElement
  private statusLine!: HTMLElement
  private drag?: DragState
  /** Nur in der claude.ai-Vorschau: Dateien über die `downloads`-Fähigkeit anbieten. */
  private downloads: { save(o: { filename: string; data: Blob }): Promise<unknown> } | null = null
  private readonly inViewer = 'claude' in window

  constructor(private root: HTMLElement) {
    this.tabs.push(this.makeTab())
    // Lernbereich links neben dem Editor; bleibt beim Neuaufbau der Oberfläche (Sprachwechsel) erhalten.
    this.learn = new LearnPanel(this.learnHost())
    this.shell = document.createElement('div')
    this.shell.className = 'shell'
    root.replaceWith(this.shell)
    this.shell.append(this.learn.element, root)
    const learnOpen = storedValue(learnKey)
    // Link „Zu den Lektionen“ der Webseite: …/app/?learn
    const fromSite = new URLSearchParams(location.search).has('learn')
    this.setLearning(fromSite || (learnOpen === null ? window.innerWidth > 1100 : learnOpen === '1'), false)
    const z = Number(storedValue(zoomKey))
    if (zoomSteps.some((s) => s.value === z)) this.zoom = z
    this.buildUI()
    this.render()
    window.addEventListener('pointermove', (e) => this.onPointerMove(e))
    window.addEventListener('pointerup', (e) => this.onPointerUp(e))
    window.addEventListener('pointercancel', () => this.endDrag())
    window.addEventListener('keydown', (e) => this.onKeyDown(e))
    window.addEventListener('beforeunload', (e) => {
      if (this.tabs.some((t) => t.dirty && !t.exerciseId)) e.preventDefault()
    })
    this.setupFileDrop()
    const claude = (window as { claude?: { use(name: string): Promise<unknown> } }).claude
    claude?.use('downloads').then((d) => (this.downloads = d as App['downloads']))
  }

  // MARK: - UI

  private buildUI() {
    this.root.className = 'app'
    this.root.innerHTML = `
      <header class="toolbar">
        <div class="brand"><span class="logo"></span>VisuStruct <small>${e(t('web_brand_suffix'))}</small></div>
        <div class="group">
          <button data-action="new" title="${e(t('a11y_new_diagram_tab'))}">${e(t('toolbar_new'))}</button>
          <button data-action="open" title="${e(t('menu_open'))} (${shortcut('O')})">${e(t('menu_open'))}</button>
          <button data-action="save" title="${e(t('menu_save'))} (${shortcut('S')})">${e(t('menu_save'))}</button>
          <select data-action="export" title="${e(t('web_export_title'))}">
            <option value="">${e(t('web_export'))}</option>
            <option value="png">${e(t('web_export_png'))}</option>
            <option value="svg">${e(t('web_export_svg'))}</option>
            <option value="pdf">${e(t('web_export_pdf'))}</option>
            <option value="print">${e(t('menu_print'))} (${shortcut('P')})</option>
          </select>
        </div>
        <div class="group">
          <button data-action="undo" title="${e(t('toolbar_undo'))} (${shortcut('Z')})" aria-label="${e(t('toolbar_undo'))}">↶</button>
          <button data-action="redo" title="${e(t('toolbar_redo'))} (${shortcut('Z', true)})" aria-label="${e(t('toolbar_redo'))}">↷</button>
          <button data-action="cut" title="${e(t('ctx_cut'))} (${shortcut('X')})" aria-label="${e(t('ctx_cut'))}">✂︎</button>
          <button data-action="copy" title="${e(t('ctx_copy'))} (${shortcut('C')})" aria-label="${e(t('ctx_copy'))}">⧉</button>
          <button data-action="paste" title="${e(t('ctx_paste'))} (${shortcut('V')})" aria-label="${e(t('ctx_paste'))}">📋︎</button>
          <button data-action="delete" title="${e(t('action_delete_selection'))} (${e(t('web_key_delete'))})">${e(t('web_delete'))}</button>
        </div>
        <div class="group">
          <select data-action="zoom" title="${e(t('settings_ui_scale_section'))}">${zoomSteps
            .map((z) => `<option value="${z.value}">${e(t('web_zoom_option_fmt', t(z.label)))}</option>`)
            .join('')}</select>
          <select data-action="language" title="${e(t('web_language_title'))}" aria-label="${e(t('web_language_title'))}">${languages
            .map((l) => `<option value="${l.code}" lang="${l.code === 'java' ? 'en' : l.code}">${e(l.name)}</option>`)
            .join('')}</select>
        </div>
        <div class="group">
          <button data-action="learn" aria-pressed="false" title="${e(t('web_learn_toggle_title'))}">🎓 ${e(t('web_learn_title'))}</button>
          <button data-action="code" aria-pressed="false" title="${e(t('a11y_generate_code'))}">{ } Code</button>
          <button data-action="simulate" class="sim-toggle" aria-pressed="false" title="${e(t('web_simulation_start_title'))}">▶︎ ${e(t('action_simulation'))}</button>
        </div>
      </header>
      <aside class="palette">
        <h2>${e(t('palette_header'))}</h2>
        <p class="hint">${e(t('web_palette_hint'))}</p>
        <ul></ul>
      </aside>
      <main class="workspace">
        <nav class="tabs" aria-label="${e(t('web_tabs_label'))}"></nav>
        <input class="caption" placeholder="${e(t('diagram_title_placeholder'))}" aria-label="${e(t('diagram_title_label'))}" />
        <div class="canvas" dir="ltr"></div>
      </main>
      <aside class="inspector"></aside>
      <footer class="status"></footer>
      <input type="file" accept=".visustruct,.strk,.xml" hidden />
    `
    const $ = <T extends Element>(s: string) => this.root.querySelector(s) as T
    this.canvasHost = $('.canvas')
    this.inspector = $('.inspector')
    this.captionInput = $('.caption')
    this.undoButton = $('[data-action=undo]')
    this.redoButton = $('[data-action=redo]')
    this.deleteButton = $('[data-action=delete]')
    this.statusLine = $('.status')
    this.simButton = $('[data-action=simulate]')
    this.sim = new SimulationPanel(
      () => this.doc,
      (path) => {
        this.simPath = path
        if (this.simulating) this.renderDiagramOnly()
        this.scrollToSimPath()
      },
    )
    this.root.append(this.sim.element)
    this.simButton.addEventListener('click', () => this.setSimulating(!this.simulating))
    this.codeButton = $('[data-action=code]')
    this.code = new CodePanel(
      () => this.doc,
      (filename, text) => this.offerDownload(filename, new Blob([text], { type: 'text/plain' })),
      () => this.setCoding(false),
    )
    this.root.append(this.code.element)
    this.codeButton.addEventListener('click', () => this.setCoding(!this.coding))

    const list = $<HTMLUListElement>('.palette ul')
    for (const { item } of paletteItems) {
      const label = typeName(paletteElement(item).type)
      const li = document.createElement('li')
      li.className = 'palette-item'
      li.dataset.item = item
      li.append(this.paletteIcon(item), document.createTextNode(label))
      li.addEventListener('pointerdown', (e) => this.beginDrag(e, { kind: 'palette', item }))
      // Tastatur/Klick ohne Ziehen: hinter der Auswahl einfügen (bzw. Platzhalter ersetzen).
      li.tabIndex = 0
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') this.insertNearSelection(paletteElement(item))
      })
      list.append(li)
    }

    this.learnButton = $('[data-action=learn]')
    this.learnButton.addEventListener('click', () => this.setLearning(!this.learning))
    this.learnButton.setAttribute('aria-pressed', String(this.learning))
    this.tabStrip = $('.tabs')
    this.exportSelect = $<HTMLSelectElement>('[data-action=export]')
    this.exportSelect.addEventListener('change', () => {
      const kind = this.exportSelect.value as ExportKind | ''
      this.exportSelect.value = ''
      if (kind) void this.exportDiagram(kind)
    })
    const language = $<HTMLSelectElement>('[data-action=language]')
    language.value = currentLanguage()
    language.addEventListener('change', () => void this.changeLanguage(language.value as LanguageCode))
    const zoom = $<HTMLSelectElement>('[data-action=zoom]')
    zoom.value = String(this.zoom)
    zoom.addEventListener('change', () => {
      this.zoom = Number(zoom.value)
      storeValue(zoomKey, zoom.value)
      this.renderDiagramOnly()
    })
    $('[data-action=cut]').addEventListener('click', () => this.cutSelection())
    $('[data-action=copy]').addEventListener('click', () => this.copySelection())
    $('[data-action=paste]').addEventListener('click', () => this.paste())

    const fileInput = $<HTMLInputElement>('input[type=file]')
    fileInput.addEventListener('change', async () => {
      const f = fileInput.files?.[0]
      fileInput.value = ''
      if (f) this.loadXML(await f.text(), f.name)
    })

    $('[data-action=new]').addEventListener('click', () => this.addTab())
    $('[data-action=open]').addEventListener('click', () => this.open(fileInput))
    $('[data-action=save]').addEventListener('click', () => this.save())
    this.undoButton.addEventListener('click', () => this.undo())
    this.redoButton.addEventListener('click', () => this.redo())
    this.deleteButton.addEventListener('click', () => this.deleteSelection())

    let captionBefore: VSDocument | undefined
    this.captionInput.addEventListener('focus', () => (captionBefore = this.doc))
    this.captionInput.addEventListener('input', () => {
      this.doc = { ...this.doc, caption: this.captionInput.value }
      this.dirty = true
      this.updateStatus()
    })
    this.captionInput.addEventListener('change', () => {
      if (captionBefore && captionBefore.caption !== this.doc.caption) this.pushUndo(captionBefore)
      captionBefore = this.doc
    })

    this.canvasHost.addEventListener('pointerdown', (e) => this.onCanvasPointerDown(e))
    this.resizeObserver?.disconnect()
    this.resizeObserver = new ResizeObserver(() => this.renderDiagramOnly())
    this.resizeObserver.observe(this.canvasHost)
  }

  /** Sprache wechseln wie in den App-Einstellungen: Oberfläche neu aufbauen, Reiter und Verlauf bleiben. */
  private async changeLanguage(code: LanguageCode) {
    this.setSimulating(false)
    this.setCoding(false)
    await setLanguage(code)
    applyCanvasStubTexts()
    this.sim.end()
    this.buildUI()
    this.render()
    this.learn.render()
  }

  // MARK: - Lernbereich

  private setLearning(on: boolean, remember = true) {
    this.learning = on
    this.shell.classList.toggle('learning', on)
    this.learnButton?.setAttribute('aria-pressed', String(on))
    if (remember) storeValue(learnKey, on ? '1' : '0')
    if (this.canvasHost) this.renderDiagramOnly()
  }

  private learnHost(): LearnHost {
    return {
      openExercise: (ex: Exercise, doc: VSDocument) => {
        const existing = this.tabs.findIndex((tab) => tab.exerciseId === ex.id)
        if (existing >= 0) {
          this.switchTab(existing)
          return
        }
        const tab = this.makeTab()
        tab.doc = doc
        tab.exerciseId = ex.id
        tab.selected = doc.elements.length > 0 ? [0] : undefined
        // Ein unberührter leerer Reiter wird ersetzt statt einen weiteren zu öffnen.
        if (this.isPristine(this.tab)) this.tabs[this.tabIndex] = tab
        else this.tabs.push(tab)
        this.tabIndex = this.tabs.indexOf(tab)
        this.setSimulating(false)
        this.render()
      },
      openDiagram: (doc: VSDocument, fileName: string) => {
        // Tab nach der Diagrammüberschrift benennen, nicht nach der Datei (l1-tee)
        this.loadXML(encodeDocument(doc), doc.caption.trim() ? `${doc.caption.trim()}.visustruct` : fileName)
      },
      exerciseDocument: (id: string) => this.tabs.find((tab) => tab.exerciseId === id)?.doc,
      resetExercise: (id: string, doc: VSDocument) => {
        const tab = this.tabs.find((x) => x.exerciseId === id)
        if (!tab) return
        tab.undoStack.push(tab.doc)
        tab.doc = doc
        tab.redoStack = []
        tab.selected = [0]
        if (tab === this.tab) this.render()
      },
      preview: (doc: VSDocument) => {
        const image = Export.renderExportSVG(doc, this.metrics, this.measure, 0)
        if (!image) return undefined
        image.svg.removeAttribute('width')
        image.svg.removeAttribute('height')
        return image.svg
      },
    }
  }

  private isPristine(tab: Tab): boolean {
    return !tab.dirty && !tab.fileName && !tab.exerciseId && tab.undoStack.length === 0
  }

  /** Stand einer Übung merken (kurz verzögert, damit Tippen flüssig bleibt). */
  private rememberExercise() {
    const tab = this.tab
    if (!tab.exerciseId) return
    clearTimeout(this.exerciseSaveTimer)
    this.exerciseSaveTimer = window.setTimeout(() => {
      if (tab.exerciseId) progress.updateExercise(tab.exerciseId, { xml: encodeDocument(tab.doc) })
    }, 300)
  }

  /** Kleine Vorschau des Elements als Symbol in der Palette. */
  private paletteIcon(item: PaletteItem): SVGSVGElement {
    const s = el('svg', { viewBox: '0 0 28 20', width: 28, height: 20, class: 'icon' })
    const stroke = { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }
    s.append(el('rect', { x: 1, y: 1, width: 26, height: 18, ...stroke }))
    const path = (d: string) => s.append(el('path', { d, ...stroke }))
    switch (item) {
      case 'verzweigung':
        path('M1 1 L14 10 L27 1 M14 10 V19')
        break
      case 'fallauswahl':
        path('M1 1 L20 10 L27 1 M1 10 H27 M10 10 V19 M20 10 V19')
        break
      case 'forZaehlSchleife':
      case 'whileSchleife':
        path('M7 7 H27 M7 7 V19')
        break
      case 'doUntilSchleife':
        path('M7 1 V13 H27')
        break
      case 'endlosschleife':
        path('M7 6 H27 M7 6 V14 H27')
        break
      case 'aufruf':
        path('M5 1 V19 M23 1 V19')
        break
      case 'aussprung':
        path('M6 1 L1 10 L6 19')
        break
    }
    return s
  }

  // MARK: - Rendering

  private render() {
    const displayDoc: VSDocument = { ...this.doc, elements: this.doc.elements.map(displayElement) }
    this.layout = this.engine.layout(displayDoc)
    this.flat = flattenNodes(this.layout.elements)
    if (this.selected && !tryElementAt(this.doc, this.selected)) this.selected = undefined

    // Wie `DiagramCanvasView`: mindestens so groß wie Struktur und sichtbarer Bereich (Ablegen unterhalb = ans Ende).
    const z = this.zoom
    const size = {
      width: Math.max(320, this.layout.canvasSize.width, this.canvasHost.clientWidth / z),
      height: Math.max(240, this.layout.canvasSize.height + 60, this.canvasHost.clientHeight / z),
    }
    this.renderer.usesSimulationHighlight = this.simulating
    this.svg = this.renderer.render(this.layout, size, this.simulating ? this.simPath : this.selected)
    // Textgröße wie `canvasScaleStep`: Layout und Linien wachsen gleichmäßig mit.
    this.svg.setAttribute('width', String(size.width * z))
    this.svg.setAttribute('height', String(size.height * z))
    this.overlay = el('g', { class: 'drop-overlay' })
    this.svg.append(this.overlay)
    this.canvasHost.replaceChildren(this.svg)

    if (document.activeElement !== this.captionInput) this.captionInput.value = this.doc.caption
    this.undoButton.disabled = this.simulating || this.undoStack.length === 0
    this.redoButton.disabled = this.simulating || this.redoStack.length === 0
    this.deleteButton.disabled = this.simulating || !this.selected || !canDeleteElement(this.doc, this.selected)
    this.captionInput.readOnly = this.simulating
    this.codeButton.disabled = this.simulating
    this.exportSelect.disabled = this.simulating
    if (this.coding) this.code.refresh()
    this.renderTabs()
    this.renderInspector()
    this.updateStatus()
  }

  private updateStatus() {
    this.rememberExercise()
    document.title = `${this.dirty ? '• ' : ''}${this.fileName} – VisuStruct Web`
    this.statusLine.textContent = `${this.fileName}${this.dirty ? ` (${t('web_status_modified')})` : ''}`
  }

  /** Wie `InspectorPanelBody` in Swift: Art (Anweisung/Ein-/Ausgabe), festes Schlüsselwort, Zählschleife, Fälle. */
  private renderInspector() {
    const path = this.selected
    const element = path ? tryElementAt(this.doc, path) : undefined
    const box = this.inspector
    if (!path || !element) {
      box.replaceChildren(
        h('h2', {}, t('web_inspector_title')),
        h('p', { class: 'hint' }, t('inspector_no_selection')),
        h('p', { class: 'hint' }, t('web_inspector_help_drop')),
        h('p', { class: 'hint' }, t('web_inspector_help_files')),
      )
      return
    }
    box.replaceChildren(h('h2', {}, typeName(element.type)))

    if (element.type === ElementType.anweisung) {
      const mode = LineEditor.ioMode(element.textLines.join('\n'))
      const seg = h('div', { class: 'segmented', role: 'group', 'aria-label': t('inspector_io_mode_title') })
      for (const [m, label] of [['statement', t('inspector_io_mode_statement')], ['input', t('inspector_io_mode_input')], ['output', t('inspector_io_mode_output')]] as const) {
        const b = h('button', { 'aria-pressed': String(m === mode) }, label)
        b.addEventListener('click', () => {
          // Aktuellen Text lesen: das Textfeld kann ihn seit dem Aufbau geändert haben.
          const current = tryElementAt(this.doc, path)?.textLines.join('\n') ?? ''
          if (m === LineEditor.ioMode(current)) return
          const text = LineEditor.applyingIOMode(m, current)
          this.commit(setTextLines(this.doc, path, text.split('\n')))
          this.inspector.querySelector('textarea')?.focus()
        })
        seg.append(b)
      }
      box.append(seg, h('p', { class: 'hint mono-hint' }, ioModeHints[mode]))
    }

    if (element.type === ElementType.forSchleife) {
      const row = h('div', { class: 'for-fields' })
      const parts = LineEditor.paddedForLoopParts(element.textLines)
      const labels = [
        [t('inspector_for_init'), t('inspector_for_placeholder_init')],
        [t('inspector_for_condition'), t('inspector_for_placeholder_condition')],
        [t('inspector_for_step'), t('inspector_for_placeholder_step')],
      ]
      labels.forEach(([label, placeholder], i) => {
        const input = h('input', { placeholder, spellcheck: 'false', autocomplete: 'off' }) as HTMLInputElement
        input.value = parts[i]
        this.liveEdit(input, (value) => {
          const el = tryElementAt(this.doc, path)
          if (!el) return undefined
          const lines = LineEditor.paddedForLoopParts(el.textLines)
          lines[i] = LineEditor.normalizedForLoopPart(value)
          return setTextLines(this.doc, path, lines)
        })
        row.append(h('label', {}, label, input))
      })
      box.append(row)
    } else if (element.type !== ElementType.leerElement) {
      const hint = conditionHints[element.type]
      if (hint) box.append(h('p', { class: 'hint mono-hint' }, hint))
      const prefix = fixedPrefix(element)
      const ta = h('textarea', { rows: '3', spellcheck: 'false' }) as HTMLTextAreaElement
      const text = element.textLines.join('\n')
      ta.value = prefix ? LineEditor.strippingPrefixForEditing(prefix, text) : text
      ta.placeholder = placeholderFor(element)
      // Platzhalter „ø“ markieren, damit Tippen ihn ersetzt.
      ta.addEventListener('focus', () => {
        if (ta.value.trim() === 'ø') ta.select()
      })
      this.liveEdit(ta, (value) => {
        const p = fixedPrefix(tryElementAt(this.doc, path) ?? element)
        const stored = p ? LineEditor.prefixingForEditing(p, LineEditor.strippingPrefixForEditing(p, value)) : value
        return setTextLines(this.doc, path, stored.split('\n'))
      })
      const row = h('div', { class: 'editor-row' })
      if (prefix) row.append(h('span', { class: 'fixed-prefix' }, prefix))
      row.append(ta)
      box.append(row)
    }

    this.renderCaseControls(path)
  }

  /** Fallname und „Fall hinzufügen/entfernen“, wenn die Auswahl in einer Fallauswahl liegt. */
  private renderCaseControls(path: number[]) {
    const fa = multiwayAncestorPath(path, this.doc)
    if (!fa) return
    const cases = tryElementAt(this.doc, fa)?.cases ?? []
    const caseIdx = caseIndexInMultiway(path, fa)
    const section = h('div', { class: 'case-controls' })
    if (caseIdx !== undefined && cases[caseIdx]) {
      const input = h('input', { placeholder: t('web_case_name_placeholder'), spellcheck: 'false', autocomplete: 'off' }) as HTMLInputElement
      input.value = cases[caseIdx].name
      this.liveEdit(input, (value) => (value.trim() === '' ? undefined : setFallauswahlCaseName(this.doc, fa, caseIdx, value)))
      section.append(h('label', {}, t('web_case_name'), input))
    }
    const add = h('button', {}, `＋ ${t('inspector_add_case')}`)
    add.addEventListener('click', () => {
      const r = appendCaseToFallauswahl(this.doc, fa)
      this.commit(r.doc, r.path)
    })
    const remove = h('button', { class: 'danger-text' }, `－ ${t('inspector_remove_case')}`) as HTMLButtonElement
    remove.disabled = cases.length <= 2 || caseIdx === undefined
    remove.addEventListener('click', () => {
      if (caseIdx === undefined) return
      const r = removeCaseFromFallauswahl(this.doc, fa, caseIdx)
      this.commit(r.doc, r.path)
    })
    section.append(h('div', { class: 'group' }, add, remove))
    this.inspector.append(section)
  }

  /** Eingabefeld, das beim Tippen das Diagramm ändert; ein Rückgängig-Schritt pro Bearbeitung. */
  private liveEdit(field: HTMLInputElement | HTMLTextAreaElement, apply: (value: string) => VSDocument | undefined) {
    let before: VSDocument | undefined
    field.addEventListener('focus', () => (before = this.doc))
    field.addEventListener('input', () => {
      // Typografische Anführungszeichen sofort durch gerade ersetzen (gleiche Länge, Cursor bleibt).
      const normalized = LineEditor.normalizingQuotes(field.value)
      if (normalized !== field.value) {
        const pos = field.selectionStart
        field.value = normalized
        field.setSelectionRange(pos, pos)
      }
      const next = apply(normalized)
      if (!next) return
      this.doc = next
      this.dirty = true
      this.renderDiagramOnly()
    })
    field.addEventListener('blur', () => {
      if (before && before !== this.doc) this.pushUndo(before)
      before = undefined
      // Inspector nicht neu aufbauen: ein Klick auf einen seiner Knöpfe soll sein Ziel behalten.
      this.renderDiagramOnly()
    })
  }

  /** Beim Tippen: nur das Diagramm neu zeichnen, damit das Textfeld den Fokus behält. */
  private renderDiagramOnly() {
    const sel = this.selected
    const keepInspector = this.inspector
    const placeholder = document.createElement('aside')
    this.inspector = placeholder
    this.render()
    this.inspector = keepInspector
    this.selected = sel
  }

  // MARK: - Simulation

  /** Wie `SimulationController.begin/end`: Diagramm nur anzeigen, rechts das Simulationsfeld. */
  private setSimulating(on: boolean) {
    if (on === this.simulating) return
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    this.endDrag()
    this.simulating = on
    this.root.classList.toggle('simulating', on)
    this.simButton.setAttribute('aria-pressed', String(on))
    this.simButton.textContent = on ? `✎ ${t('action_diagram')}` : `▶︎ ${t('action_simulation')}`
    this.simButton.title = t(on ? 'web_simulation_end_title' : 'web_simulation_start_title')
    if (on) {
      this.setCoding(false)
      this.sim.begin()
    } else {
      this.sim.end()
      this.simPath = undefined
      if (!this.selected && this.doc.elements.length > 0) this.selected = [0]
    }
    this.render()
  }

  // MARK: - Code

  private setCoding(on: boolean) {
    if (on === this.coding) return
    this.coding = on
    this.root.classList.toggle('coding', on)
    this.codeButton.setAttribute('aria-pressed', String(on))
    if (on) this.code.refresh()
    else this.code.close()
    this.renderDiagramOnly()
  }

  /** Markierten Schritt sichtbar halten, wenn das Diagramm größer als das Fenster ist. */
  private scrollToSimPath() {
    const path = this.simPath
    if (!this.simulating || !path) return
    const node = this.flat.find((n) => samePath(n.idPath, path))
    if (!node) return
    const host = this.canvasHost
    const z = this.zoom
    const f = { x: node.frame.x * z, y: node.frame.y * z, width: node.frame.width * z, height: node.frame.height * z }
    const pad = 24
    if (f.y < host.scrollTop) host.scrollTop = Math.max(0, f.y - pad)
    else if (f.y + Math.min(f.height, host.clientHeight - 2 * pad) > host.scrollTop + host.clientHeight) {
      host.scrollTop = f.y - pad
    }
    if (f.x < host.scrollLeft || f.x > host.scrollLeft + host.clientWidth - pad) host.scrollLeft = Math.max(0, f.x - pad)
  }

  // MARK: - Dokument

  private commit(next: VSDocument, select?: number[]) {
    this.pushUndo(this.doc)
    this.doc = next
    this.dirty = true
    if (select) this.selected = select
    this.render()
  }

  private pushUndo(prev: VSDocument) {
    this.undoStack.push(prev)
    while (this.undoStack.length > maxUndoSteps) this.undoStack.shift()
    this.tab.redoStack = []
  }

  private undo() {
    const prev = this.undoStack.pop()
    if (!prev) return
    this.redoStack.push(this.doc)
    this.doc = prev
    this.dirty = true
    this.selected = sanitizedSelection(this.selected, this.doc)
    this.render()
  }

  private redo() {
    const next = this.redoStack.pop()
    if (!next) return
    this.undoStack.push(this.doc)
    this.doc = next
    this.dirty = true
    this.selected = sanitizedSelection(this.selected, this.doc)
    this.render()
  }

  private resetHistory() {
    this.setSimulating(false)
    this.tab.undoStack = []
    this.tab.redoStack = []
    this.selected = undefined
    this.dirty = false
    this.render()
  }

  // MARK: - Reiter (DiagramSheetTabsModel.swift)

  private tabStrip!: HTMLElement

  private makeTab(): Tab {
    return { doc: newEmptyDocument(), serial: this.nextTabSerial++, dirty: false, undoStack: [], redoStack: [], selected: [0] }
  }

  private addTab(tab = this.makeTab()) {
    this.setSimulating(false)
    this.tabs.push(tab)
    this.tabIndex = this.tabs.length - 1
    this.render()
  }

  private switchTab(index: number) {
    if (index === this.tabIndex || !this.tabs[index]) return
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    this.setSimulating(false)
    this.tabIndex = index
    this.render()
  }

  private async closeTab(index: number) {
    if (this.tabs.length <= 1) return
    const tab = this.tabs[index]
    if (tab.dirty && !tab.exerciseId) {
      this.switchTab(index)
      if (!(await this.confirmDiscard())) return
    }
    this.setSimulating(false)
    this.tabs.splice(index, 1)
    if (this.tabIndex > index || this.tabIndex >= this.tabs.length) this.tabIndex = Math.max(0, this.tabIndex - 1)
    this.render()
  }

  private renderTabs() {
    const strip = this.tabStrip
    strip.replaceChildren()
    this.tabs.forEach((tab, i) => {
      const item = document.createElement('div')
      item.className = 'tab' + (i === this.tabIndex ? ' active' : '')
      item.setAttribute('role', 'tab')
      item.setAttribute('aria-selected', String(i === this.tabIndex))
      const label = document.createElement('button')
      label.className = 'tab-label'
      label.textContent = (tab.dirty ? '• ' : '') + tabTitle(tab)
      label.title = tab.fileName ?? tabTitle(tab)
      label.addEventListener('click', () => this.switchTab(i))
      item.append(label)
      if (this.tabs.length > 1) {
        const close = document.createElement('button')
        close.className = 'tab-close'
        close.textContent = '✕'
        close.title = t('a11y_close_tab')
        close.setAttribute('aria-label', `${t('a11y_close_tab')}: ${tabTitle(tab)}`)
        close.addEventListener('click', () => this.closeTab(i))
        item.append(close)
      }
      strip.append(item)
    })
    const add = document.createElement('button')
    add.className = 'tab-add'
    add.textContent = '+'
    add.title = t('a11y_new_diagram_tab')
    add.setAttribute('aria-label', t('a11y_new_diagram_tab'))
    add.addEventListener('click', () => this.addTab())
    strip.append(add)
  }

  // MARK: - Zwischenablage (Element)

  private copySelection() {
    const el = this.selected && tryElementAt(this.doc, this.selected)
    if (!el) return false
    this.clipboard = structuredClone(el)
    this.showMessage(t('web_copied'))
    return true
  }

  private cutSelection() {
    if (this.selected && canDeleteElement(this.doc, this.selected) && this.copySelection()) this.deleteSelection()
  }

  private paste() {
    if (this.clipboard) this.insertNearSelection(structuredClone(this.clipboard))
  }

  private deleteSelection() {
    if (!this.selected || !canDeleteElement(this.doc, this.selected)) return
    this.commit(deleteAtPath(this.doc, this.selected))
    this.selected = undefined
    this.render()
  }

  /** Einfügen ohne Ziehen: Platzhalter ersetzen bzw. hinter der Auswahl (oder ans Ende) einfügen. */
  private insertNearSelection(element: VSElement) {
    const path = this.selected
    if (path && isPlaceholderSlot(this.doc, path)) return this.commit(replaceAtPath(this.doc, path, element), path)
    if (path) {
      const next = [...path.slice(0, -1), path[path.length - 1] + 1]
      return this.commit(insertAfterSibling(this.doc, element, path), next)
    }
    if (this.doc.elements.length === 1 && isPlaceholderSlot(this.doc, [0])) {
      return this.commit(replaceAtPath(this.doc, [0], element), [0])
    }
    this.commit(insertAt(this.doc, [], this.doc.elements.length, element), [this.doc.elements.length])
  }

  // MARK: - Dateien

  /** Rückfrage im Fenster selbst (`window.confirm` ist in eingebetteten Ansichten gesperrt). */
  private confirmDiscard(): Promise<boolean> {
    if (!this.dirty) return Promise.resolve(true)
    return new Promise((resolve) => {
      const box = document.createElement('div')
      box.className = 'confirm'
      box.innerHTML = `<div class="confirm-card" role="alertdialog" aria-label="${e(t('close_unsaved_title'))}">
        <p><strong>${e(t('close_unsaved_title'))}</strong></p>
        <p class="hint">${e(t('web_discard_message_fmt', this.fileName))}</p>
        <div class="group"><button data-r="0">${e(t('close_unsaved_cancel'))}</button><button data-r="1" class="danger">${e(t('close_unsaved_discard'))}</button></div>
      </div>`
      box.addEventListener('click', (e) => {
        const r = (e.target as HTMLElement).dataset.r
        if (r === undefined && e.target !== box) return
        box.remove()
        resolve(r === '1')
      })
      document.body.append(box)
      box.querySelector<HTMLButtonElement>('[data-r="0"]')!.focus()
    })
  }

  private showMessage(text: string) {
    this.statusLine.textContent = text
    this.statusLine.classList.add('message')
    setTimeout(() => {
      this.statusLine.classList.remove('message')
      this.updateStatus()
    }, 6000)
  }

  /** Wie `openIncomingDocument`: ungespeicherte Änderungen oder eine verknüpfte Datei → neuer Reiter. */
  private loadXML(xml: string, name: string, handle?: FileHandle) {
    let doc: VSDocument
    try {
      doc = decodeDocument(xml)
    } catch (err) {
      this.showMessage(t('web_err_unreadable_fmt', name, (err as Error).message))
      return
    }
    if (this.dirty || this.tab.fileName) this.addTab()
    this.doc = doc
    this.tab.fileName = name.replace(/\.(strk|xml)$/i, '.visustruct')
    this.fileHandle = handle && /\.visustruct$/i.test(name) ? handle : undefined
    this.resetHistory()
  }

  private async open(fallback: HTMLInputElement) {
    const w = window as PickerWindow
    if (!w.showOpenFilePicker || this.inViewer) return fallback.click()
    try {
      const [handle] = await w.showOpenFilePicker({ types: pickerTypes() })
      const file = await handle.getFile()
      this.loadXML(await file.text(), file.name, handle)
    } catch {
      /* abgebrochen */
    }
  }

  private async save() {
    const blob = new Blob([encodeDocument(this.doc)], { type: 'application/xml' })
    const w = window as PickerWindow
    try {
      if (this.downloads) {
        // Die Vorschau erlaubt nur bekannte Endungen; die echte Web-App speichert direkt als .visustruct.
        const filename = this.fileName + '.txt'
        await this.downloads.save({ filename, data: blob })
        this.tab.fileName ??= this.fileName
        this.dirty = false
        this.render()
        this.showMessage(t('web_saved_txt_fmt', filename))
        return
      }
      if (!this.fileHandle && w.showSaveFilePicker && !this.inViewer) {
        this.fileHandle = await w.showSaveFilePicker({ suggestedName: this.fileName, types: pickerTypes() })
        this.tab.fileName = this.fileHandle.name
      }
      if (this.fileHandle) {
        const out = await this.fileHandle.createWritable()
        await out.write(blob)
        await out.close()
      } else {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = this.fileName
        a.click()
        setTimeout(() => URL.revokeObjectURL(a.href), 1000)
      }
      this.tab.fileName ??= this.fileName
      this.dirty = false
      this.render()
    } catch {
      /* abgebrochen */
    }
  }

  /** Datei zum Herunterladen anbieten (in der Vorschau über die `downloads`-Fähigkeit). */
  // MARK: - Export (wie `DiagramExporter`)

  private async exportDiagram(kind: ExportKind) {
    const image = Export.renderExportSVG(this.doc, this.metrics, this.measure)
    if (!image) {
      this.showMessage(t(kind === 'print' ? 'err_diagram_too_small_print' : 'err_diagram_too_small_export'))
      return
    }
    const base = Export.exportFilenameBase(this.doc, tabTitle(this.tab))
    // Wie `displayScale` × Textgröße: scharf auch auf hochauflösenden Bildschirmen.
    const scale = Math.max(2, window.devicePixelRatio || 1) * this.zoom
    try {
      switch (kind) {
        case 'svg': {
          image.svg.setAttribute('width', String(image.width * this.zoom))
          image.svg.setAttribute('height', String(image.height * this.zoom))
          await this.offerDownload(`${base}.svg`, new Blob([Export.svgMarkup(image)], { type: 'image/svg+xml' }))
          break
        }
        case 'png': {
          const canvas = await Export.rasterize(image, scale)
          await this.offerDownload(`${base}.png`, await Export.canvasToPNG(canvas))
          break
        }
        case 'pdf': {
          const canvas = await Export.rasterize(image, Math.max(scale, 3))
          const pdf = await Export.buildDiagramPDF(Export.canvasRGB(canvas), canvas.width, canvas.height, image, Export.exportVisibleDiagramTitle(this.doc))
          await this.offerDownload(`${base}.pdf`, pdf)
          break
        }
        case 'print':
          this.printDiagram(image)
          break
      }
    } catch (err) {
      this.showMessage(t('web_export_failed_fmt', err instanceof Error ? err.message : String(err)))
    }
  }

  /** Drucken: nur das Export-Bild auf die Seite (siehe `@media print` in styles.css). */
  private printDiagram(image: Export.ExportImage) {
    const sheet = document.createElement('div')
    sheet.className = 'print-sheet'
    image.svg.removeAttribute('width')
    image.svg.removeAttribute('height')
    sheet.append(image.svg)
    document.body.append(sheet)
    const cleanup = () => sheet.remove()
    window.addEventListener('afterprint', cleanup, { once: true })
    try {
      window.print()
    } catch {
      cleanup()
      this.showMessage(`${t('err_print_unavailable')} ${t('web_print_hint')}`)
      return
    }
    // Manche Browser senden kein `afterprint`.
    setTimeout(cleanup, 60_000)
  }

  private async offerDownload(filename: string, blob: Blob) {
    try {
      if (this.downloads) {
        try {
          await this.downloads.save({ filename, data: blob })
          this.showMessage(t('web_saved_fmt', filename))
        } catch {
          // Die Vorschau erlaubt nur bekannte Endungen.
          await this.downloads.save({ filename: filename + '.txt', data: blob })
          this.showMessage(t('web_saved_txt_fmt', filename + '.txt'))
        }
        return
      }
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    } catch {
      this.showMessage(t('err_save_failed_fmt', filename))
    }
  }

  private setupFileDrop() {
    window.addEventListener('dragover', (e) => {
      if (e.dataTransfer?.types.includes('Files')) {
        e.preventDefault()
        this.root.classList.add('file-drag')
      }
    })
    window.addEventListener('dragleave', (e) => {
      if (e.relatedTarget === null) this.root.classList.remove('file-drag')
    })
    window.addEventListener('drop', async (e) => {
      this.root.classList.remove('file-drag')
      const f = e.dataTransfer?.files[0]
      if (!f) return
      e.preventDefault()
      this.loadXML(await f.text(), f.name)
    })
  }

  private onKeyDown(e: KeyboardEvent) {
    const mod = e.metaKey || e.ctrlKey
    const typing = e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement
    if (mod && e.key.toLowerCase() === 's') {
      e.preventDefault()
      this.save()
    } else if (mod && e.key.toLowerCase() === 'p') {
      e.preventDefault()
      if (!this.simulating) void this.exportDiagram('print')
    } else if (mod && e.key.toLowerCase() === 'o') {
      e.preventDefault()
      this.open(this.root.querySelector('input[type=file]')!)
    } else if (typing || this.simulating) {
      return
    } else if (mod && e.key.toLowerCase() === 'z') {
      e.preventDefault()
      if (e.shiftKey) this.redo()
      else this.undo()
    } else if (mod && e.key.toLowerCase() === 'c' && !getSelection()?.toString()) {
      if (this.copySelection()) e.preventDefault()
    } else if (mod && e.key.toLowerCase() === 'x') {
      e.preventDefault()
      this.cutSelection()
    } else if (mod && e.key.toLowerCase() === 'v') {
      e.preventDefault()
      this.paste()
    } else if (mod && e.key.toLowerCase() === 'y') {
      e.preventDefault()
      this.redo()
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      this.deleteSelection()
    } else if (e.key === 'Escape') {
      if (this.drag) this.endDrag()
      else {
        this.selected = undefined
        this.render()
      }
    }
  }

  // MARK: - Auswahl und Drag & Drop (Zeiger-Ereignisse: Maus, Stift und Finger gleich)

  private svgPoint(clientX: number, clientY: number): { x: number; y: number } | undefined {
    if (!this.svg) return undefined
    const r = this.svg.getBoundingClientRect()
    const x = clientX - r.left
    const y = clientY - r.top
    if (x < 0 || y < 0 || x > r.width || y > r.height) return undefined
    return { x: x / this.zoom, y: y / this.zoom }
  }

  /** Tiefster Knoten unter dem Punkt (Kinder liegen über ihren Eltern). */
  private nodeAt(x: number, y: number): LayoutNode | undefined {
    for (let i = this.flat.length - 1; i >= 0; i--) {
      const f = this.flat[i].frame
      if (x >= f.x && x <= f.x + f.width && y >= f.y && y <= f.y + f.height) return this.flat[i]
    }
    return undefined
  }

  private onCanvasPointerDown(e: PointerEvent) {
    if (this.simulating) return
    const p = this.svgPoint(e.clientX, e.clientY)
    if (!p) return
    // Offene Texteingabe abschließen (zählt dann als ein Rückgängig-Schritt).
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    const node = this.nodeAt(p.x, p.y)
    const wasSelected = node && this.selected && samePath(node.idPath, this.selected)
    this.selected = node?.idPath
    this.render()
    // Verschieben mit Maus/Stift; mit dem Finger würde es mit dem Scrollen kollidieren.
    if (node && e.pointerType !== 'touch' && !(isPlaceholderSlot(this.doc, node.idPath) && !wasSelected)) {
      this.beginDrag(e, { kind: 'move', path: node.idPath })
    }
  }

  private beginDrag(e: PointerEvent, source: DragSource) {
    if (e.button !== 0 || this.simulating) return
    e.preventDefault()
    this.drag = { source, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, active: false }
  }

  private onPointerMove(e: PointerEvent) {
    const d = this.drag
    if (!d || e.pointerId !== d.pointerId) return
    if (!d.active) {
      if (Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 5) return
      d.active = true
      d.ghost = this.makeGhost(d.source)
      document.body.append(d.ghost)
      this.root.classList.add('dragging')
    }
    d.ghost!.style.transform = `translate(${e.clientX + 12}px, ${e.clientY + 12}px)`
    this.autoScroll(e.clientX, e.clientY)
    const p = this.svgPoint(e.clientX, e.clientY)
    d.target = p ? this.dropTargetAt(p.x, p.y, d.source) : undefined
    this.showDropTarget(d.target)
  }

  private onPointerUp(e: PointerEvent) {
    const d = this.drag
    if (!d || e.pointerId !== d.pointerId) return
    if (d.active && d.target) this.applyDrop(d.source, d.target)
    else if (!d.active && d.source.kind === 'palette') this.insertNearSelection(paletteElement(d.source.item))
    this.endDrag()
  }

  private endDrag() {
    this.drag?.ghost?.remove()
    this.drag = undefined
    this.root.classList.remove('dragging')
    this.showDropTarget(undefined)
  }

  private makeGhost(source: DragSource): HTMLElement {
    const g = document.createElement('div')
    g.className = 'drag-ghost'
    if (source.kind === 'palette') {
      g.textContent = paletteItems.find((p) => p.item === source.item)!.label
    } else {
      const e = elementAt(this.doc, source.path)
      g.textContent = `${typeName(e.type)}: ${canvasTextLines(e)[0]}`
    }
    return g
  }

  private autoScroll(clientX: number, clientY: number) {
    const r = this.canvasHost.getBoundingClientRect()
    const edge = 40
    const step = 12
    if (clientY > r.bottom - edge && clientY < r.bottom + edge) this.canvasHost.scrollTop += step
    else if (clientY < r.top + edge && clientY > r.top - edge) this.canvasHost.scrollTop -= step
    if (clientX > r.right - edge && clientX < r.right + edge) this.canvasHost.scrollLeft += step
    else if (clientX < r.left + edge && clientX > r.left - edge) this.canvasHost.scrollLeft -= step
  }

  private dropTargetAt(x: number, y: number, source: DragSource): DropTarget | undefined {
    const roots = this.layout?.elements ?? []
    const node = this.nodeAt(x, y)
    if (!node) {
      const last = roots[roots.length - 1]
      if (!last) return undefined
      const bottom = last.frame.y + last.frame.height
      if (y > bottom) {
        if (source.kind === 'move' && source.path.length === 1 && source.path[0] === roots.length - 1) return undefined
        return { kind: 'rootAppend', frame: { x: last.frame.x, y: bottom, width: last.frame.width, height: 0 } }
      }
      if (y < roots[0].frame.y) return { kind: 'before', path: [0], frame: roots[0].frame }
      return undefined
    }
    const path = node.idPath
    if (source.kind === 'move' && path.length >= source.path.length && source.path.every((v, i) => path[i] === v)) {
      return undefined // nicht in sich selbst ablegen
    }
    if (isPlaceholderSlot(this.doc, path)) return { kind: 'replace', path, frame: node.frame }
    const upper = y < node.frame.y + node.frame.height / 2
    return { kind: upper ? 'before' : 'after', path, frame: node.frame }
  }

  private showDropTarget(t: DropTarget | undefined) {
    if (!this.overlay) return
    this.overlay.replaceChildren()
    if (!t) return
    const f = t.frame
    if (t.kind === 'replace') {
      this.overlay.append(el('rect', { x: f.x + 2, y: f.y + 2, width: f.width - 4, height: f.height - 4, class: 'drop-replace' }))
      return
    }
    const y = t.kind === 'before' ? f.y : f.y + f.height
    this.overlay.append(el('rect', { x: f.x, y: y - 3, width: f.width, height: 6, rx: 3, class: 'drop-line' }))
  }

  private applyDrop(source: DragSource, t: DropTarget) {
    const doc = this.doc
    try {
      if (source.kind === 'palette') {
        const element = paletteElement(source.item)
        switch (t.kind) {
          case 'replace':
            return this.commit(replaceAtPath(doc, t.path, element), t.path)
          case 'before':
            return this.commit(insertBeforeSibling(doc, element, t.path), t.path)
          case 'after':
            return this.commit(insertAfterSibling(doc, element, t.path), [...t.path.slice(0, -1), t.path[t.path.length - 1] + 1])
          case 'rootAppend':
            return this.commit(insertAt(doc, [], doc.elements.length, element), [doc.elements.length])
        }
      }
      const from = source.path
      switch (t.kind) {
        case 'replace':
          return this.commit(moveReplacingPlaceholder(doc, from, t.path))
        case 'before':
          return this.commit(moveBeforeSibling(doc, from, t.path))
        case 'after':
          return this.commit(moveAfterSibling(doc, from, t.path))
        case 'rootAppend': {
          const moving = elementAt(doc, from)
          return this.commit(insertAt(deleteAtPath(doc, from), [], Number.MAX_SAFE_INTEGER, moving))
        }
      }
    } catch (err) {
      console.warn('Ablegen nicht möglich', err)
    } finally {
      if (source.kind === 'move') {
        this.selected = undefined
        this.render()
      }
    }
  }
}

type ExportKind = 'png' | 'svg' | 'pdf' | 'print'

/** Wie `DiagramCanvasView.displayTextLines`: Texte leerer Elemente in der gewählten Sprache. */
export function applyCanvasStubTexts() {
  setCanvasStubTexts({
    [ElementType.anweisung]: t('canvas_stub_anweisung'),
    [ElementType.verzweigung]: t('canvas_stub_condition'),
    [ElementType.fallauswahl]: t('canvas_stub_fallauswahl'),
    [ElementType.forSchleife]: t('canvas_stub_for'),
    [ElementType.whileSchleife]: t('canvas_stub_while'),
    [ElementType.doUntilSchleife]: t('canvas_stub_while'),
    [ElementType.endlosschleife]: t('canvas_stub_endless'),
    [ElementType.aussprung]: t('canvas_stub_break'),
    [ElementType.aufruf]: t('canvas_stub_call'),
  })
}

function tabTitle(tab: Tab): string {
  if (tab.fileName) return tab.fileName.replace(/\.(visustruct|strk)$/i, '')
  return tab.doc.caption.trim() || t('tab_title_format', tab.serial)
}

function storedValue(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function storeValue(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ohne Speicher: nur für diese Sitzung */
  }
}

function escapeHTML(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
}
