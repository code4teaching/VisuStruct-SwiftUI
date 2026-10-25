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
import { icons } from './icons'
import { FilesPanel, type WorkspaceFile } from './filesPanel'
import { LearnPanel, sidebarIcon, type LearnHost } from './learnPanel'
import { LiveCodePanel } from './liveCodePanel'
import type { LiveTarget } from '../core/codeGenerator'
import type { Exercise } from '../learn/lessonFormat'
import { progress } from '../learn/progress'
import { codeKeywords, currentLanguage, offeredLanguages, setCodeKeywords, setLanguage, t, type LanguageCode } from './i18n'
import * as Export from './exporter'
import { SimulationPanel } from './simulationPanel'
import { mbotLinkText, setVisuBotMode, toggleMBotLink, visuBotEnabled, visuBotMode, visuBotSensors, visuBotTemplates, VisuBotView } from './visubotView'
import { canConnectMBot, mbotLink } from '../core/mbotLink'
import { lessons, tasks, useVisuBotContent, world, type VisuBotMode } from '../learn/content'
import type { RobotWorldSetup } from '../core/robotWorld'
import { parseSubprogramHeader, subprogramName } from '../core/simulation'

type DropTarget =
  | { kind: 'before' | 'after' | 'replace'; path: number[]; frame: Rect }
  | { kind: 'rootAppend'; frame: Rect }
  /** VisuBot: Sensorwert in die Bedingung (bzw. den Text) eines Elements schreiben */
  | { kind: 'condition'; path: number[]; frame: Rect }

/**
 * Aus der Palette: neues Element (auch die VisuBot-Befehle) samt Name für das Ziehbild,
 * oder ein VisuBot-Sensor wie `mbot.getDistance()`, der in eine Bedingung wandert.
 */
type DragSource =
  | { kind: 'palette'; make: () => VSElement; label: string }
  | { kind: 'sensor'; text: string; label: string }
  | { kind: 'move'; path: number[] }

/** Elemente, in deren Text ein Sensorwert passt: Bedingungen und Anweisungen (`int abstand = mbot.getDistance()`). */
const takesSensor = [ElementType.verzweigung, ElementType.whileSchleife, ElementType.doUntilSchleife, ElementType.anweisung]

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
/** Aus `package.json`, siehe `vite.config.ts`. */
declare const __APP_VERSION__: string

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
  /** Programm im Workspace (Spalte „Dateien“): Speichern schreibt dorthin, mit .java daneben. */
  workspace?: WorkspaceFile
  dirty: boolean
  undoStack: VSDocument[]
  redoStack: VSDocument[]
  selected?: number[]
  /** Reiter gehört zu einer Übung im Lernbereich; ihr Stand wird im Browser gemerkt. */
  exerciseId?: string
}

/** Unter dieser Breite der Struktogramm-Spalte stehen die Elemente kompakt. */
const compactPaletteBelow = 760

/** `VisuStructUIScaleStep`: Textgröße des Struktogramms. */
const zoomSteps = [
  { value: 1, label: 'settings_ui_scale_small' },
  { value: 1.22, label: 'settings_ui_scale_medium' },
  { value: 1.5, label: 'settings_ui_scale_large' },
  { value: 1.82, label: 'settings_ui_scale_extra_large' },
]

/** Schriftgröße in Code live (Code, Konsole), unabhängig vom Struktogramm. */
const codeSizes = [
  { value: 14, label: 'settings_ui_scale_small' },
  { value: 17, label: 'settings_ui_scale_medium' },
  { value: 20, label: 'settings_ui_scale_large' },
  { value: 24, label: 'settings_ui_scale_extra_large' },
]

function applyCodeSize(px: number) {
  document.documentElement.style.setProperty('--code-size', `${px}px`)
}

const isMac = /Mac|iPhone|iPad/.test(navigator.platform)
/** Tastenkürzel im Tooltip, z. B. „Strg+S“ bzw. „⌘S“. */
/** Startseite (oder ein Abschnitt ihrer Fußzeile) in der passenden Sprache der Webseite. */
function siteURL(section?: 'contact' | 'privacy'): string {
  const code = currentLanguage()
  const lang = code === 'pt-PT' ? 'pt' : code === 'de' ? 'de' : 'en'
  // Auf visustruct.org liegt die Web-App unter /app/, sonst (Vorschau, Einzeldatei) zur echten Seite
  const base = /\/app\/(index\.html)?$/.test(location.pathname) ? '../' : 'https://visustruct.org/'
  return `${base}${lang}/index.html${section ? `#${section}` : ''}`
}

/** Symbolknopf; der Name (mit Tastenkürzel) erscheint als Tooltip. */
function iconButton(action: string, label: string, icon: string, keys?: string): string {
  const tip = keys ? `${label} (${keys})` : label
  return `<button class="icon" data-action="${action}" data-tip="${e(tip)}" aria-label="${e(label)}">${icon}</button>`
}

function shortcut(key: string, shift = false): string {
  if (isMac) return `${shift ? '⇧' : ''}⌘${key}`
  return [t('web_key_ctrl'), ...(shift ? [t('web_key_shift')] : []), key].join('+')
}
const e = escapeHTML
const zoomKey = 'visustruct.ui.scale.canvas'
const codeSizeKey = 'visustruct.ui.scale.code'
const learnKey = 'visustruct.learn.open'
const filesKey = 'visustruct.files.open'
const filesWidthKey = 'visustruct.files.width'
const learnWidthKey = 'visustruct.learn.width'
const liveKey = 'visustruct.live.open'
const liveWidthKey = 'visustruct.live.width'
const editorHiddenKey = 'visustruct.editor.hidden'
const compactPaletteKey = 'visustruct.palette.compact'
const gearIcon =
  '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'

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
  private exportButton!: HTMLButtonElement
  private closeExport?: (ev: PointerEvent) => void
  private learn: LearnPanel
  private shell: HTMLElement
  private railButton?: HTMLButtonElement
  private liveRailButton?: HTMLButtonElement
  private editorRailButton?: HTMLButtonElement
  /** Werkzeugleiste über allen Spalten. */
  private topbar = h('div', { class: 'topbar' })
  /** Fußzeile unter allen Spalten. */
  private bottombar = h('div', { class: 'bottombar' })
  private editorHidden = false
  private files!: FilesPanel
  private filesRailButton?: HTMLButtonElement
  private closeSettings?: (ev: PointerEvent) => void
  private escapeSettings?: (ev: KeyboardEvent) => void
  private exerciseSaveTimer?: number
  private paletteObserver?: ResizeObserver
  private resizeObserver?: ResizeObserver
  private renderedHostSize = { width: -1, height: -1 }
  /** Im Simulationsmodus markierter Schritt (ersetzt die Auswahl). */
  private simPath?: number[]
  private sim!: SimulationPanel
  private simButton!: HTMLButtonElement
  private coding = false
  private code!: CodePanel
  private codeButton!: HTMLButtonElement
  /** Ansicht „Code live“ rechts neben dem Editor. */
  private liveCoding = false
  /** Laufende Eingabe in „Code live“: fasst Tastendrücke zu Rückgängig-Schritten zusammen. */
  private codeTyping?: { tab: Tab; start: number; last: number }
  private live: LiveCodePanel

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
  /** VisuBot-Modus: Welt mit dem mBot2 im Simulationspanel (bleibt beim Neuaufbau erhalten). */
  private visuBot?: VisuBotView
  private stopLinkListener?: () => void

  constructor(private root: HTMLElement) {
    this.tabs.push(this.makeTab())
    useVisuBotContent(visuBotMode())
    // Lernbereich links neben dem Editor; bleibt beim Neuaufbau der Oberfläche (Sprachwechsel) erhalten.
    this.learn = new LearnPanel(this.learnHost())
    this.shell = document.createElement('div')
    this.shell.className = 'shell'
    root.replaceWith(this.shell)
    this.live = new LiveCodePanel(
      () => this.setLiveCoding(false),
      (path) => {
        this.selected = path
        this.render()
      },
      (doc, path) => this.commitFromCode(doc, path),
      (redo) => (redo ? this.redo() : this.undo()),
    )
    this.live.onRobotRun = (stepping) => this.runRobot(stepping)
    this.files = new FilesPanel({
      open: (xml, file, java) => this.openFromWorkspace(xml, file, java),
      hide: () => this.setFilesOpen(false),
      message: (text) => this.showMessage(text),
      progressLoaded: () => this.learn.render(),
    })
    // Oben die Werkzeugleiste, darunter vier Spalten: Dateien | Lernen | Struktogramm | Code live, jede einklappbar.
    const columns = h('div', { class: 'columns' })
    columns.append(
      this.filesRail(),
      this.files.element,
      this.panelResizer(this.files.element, 'files-resizer', filesWidthKey, t('web_files_resize'), 1),
      this.learnRail(),
      this.learn.element,
      this.learnResizer(),
      this.editorRail(),
      root,
      this.liveResizer(),
      this.live.element,
      this.liveRail(),
    )
    this.shell.append(this.topbar, columns, this.bottombar)
    const learnOpen = storedValue(learnKey)
    // Link „Zu den Lektionen“ der Webseite: …/app/?learn. Danach aus der Adresse nehmen,
    // sonst öffnet jedes Neuladen den Lernbereich wieder, obwohl man ihn eingeklappt hat.
    const params = new URLSearchParams(location.search)
    const fromSite = params.has('learn')
    if (fromSite) {
      params.delete('learn')
      const query = params.toString()
      history.replaceState(history.state, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`)
    }
    this.setLearning(fromSite || (learnOpen === null ? window.innerWidth > 1100 : learnOpen === '1'), fromSite)
    this.setFilesOpen(storedValue(filesKey) === '1')
    const z = Number(storedValue(zoomKey))
    if (zoomSteps.some((s) => s.value === z)) this.zoom = z
    this.setLiveCoding(storedValue(liveKey) === '1')
    this.setEditorHidden(storedValue(editorHiddenKey) === '1')
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
    // Nicht jede Vorschau mit `window.claude` kennt `use` (z. B. die Dateiansicht der Claude-App): dann ohne.
    const claude = (window as { claude?: { use?: (name: string) => Promise<unknown> } }).claude
    if (typeof claude?.use === 'function')
      claude
        .use('downloads')
        .then((d) => (this.downloads = d as App['downloads']))
        .catch(() => undefined)
  }

  // MARK: - UI

  private buildUI() {
    this.root.className = 'app'
    this.root.innerHTML = `
      <header class="toolbar">
        <a class="brand" href="${e(siteURL())}" title="${e(t('web_site_home'))}"><span class="logo"></span>VisuStruct <small>${e(t('web_brand_suffix'))}</small></a>
        <div class="group">
          ${iconButton('new', t('toolbar_new'), icons.newFile)}
          ${iconButton('open', t('menu_open'), icons.open, shortcut('O'))}
          ${iconButton('save', t('menu_save'), icons.save, shortcut('S'))}
        </div>
        <div class="group settings">
          <button class="icon" data-action="settings" aria-haspopup="true" aria-expanded="false" data-tip="${e(t('action_settings'))}" aria-label="${e(t('action_settings'))}">${gearIcon}</button>
          <div class="settings-menu" role="group" aria-label="${e(t('action_settings'))}" hidden>
            <section>
              <h3>${e(t('web_settings_display'))}</h3>
              <label>${e(t('web_scale_canvas'))}
                <select data-action="zoom">${zoomSteps.map((z) => `<option value="${z.value}">${e(t(z.label))}</option>`).join('')}</select>
              </label>
              <label>${e(t('web_scale_code'))}
                <select data-action="code-size">${codeSizes.map((z) => `<option value="${z.value}">${e(t(z.label))}</option>`).join('')}</select>
              </label>
              <label>${e(t('settings_language_title'))}
                <select data-action="language" title="${e(t('web_language_title'))}">${offeredLanguages
                  .map((l) => `<option value="${l.code}" lang="${l.code === 'java' ? 'en' : l.code}">${e(l.name)}</option>`)
                  .join('')}</select>
              </label>
              <label class="check">
                <input type="checkbox" data-action="compact-palette" />
                <span>${e(t('web_palette_compact'))}<small>${e(t('web_palette_compact_hint'))}</small></span>
              </label>
            </section>
            <section>
              <h3>${e(t('web_live_title'))}</h3>
              <label>${e(t('web_live_language'))}
                <select data-action="live-language">${['Java', 'JavaScript', 'Python']
                  .map((name) => `<option value="${name.toLowerCase()}">${name}</option>`)
                  .join('')}</select>
              </label>
              <label class="check">
                <input type="checkbox" data-action="keywords" />
                <span>${e(t('web_keywords_title'))}<small>${e(t('web_keywords_hint'))}</small></span>
              </label>
            </section>
            <section class="java-only">
              <h3>Java</h3>
              <label class="check">
                <input type="checkbox" data-action="java-class" />
                <span>${e(t('web_live_java_class'))}<small>${e(t('web_live_java_class_hint'))}</small></span>
              </label>
              <label class="check">
                <input type="checkbox" data-action="java-main" />
                <span>${e(t('web_live_java_main'))}<small>public static void main(String[] args)</small></span>
              </label>
              <label class="check">
                <input type="checkbox" data-action="java-swing" />
                <span>${e(t('web_live_swing'))}<small>${e(t('web_live_swing_hint'))}</small></span>
              </label>
            </section>
            <section>
              <h3>VisuBot</h3>
              <label>${e(t('web_visubot_mode'))}
                <select data-action="visubot">${(['off', 'course', 'series'] as const)
                  .map((m) => `<option value="${m}">${e(t(`web_visubot_mode_${m}`))}</option>`)
                  .join('')}</select>
                <small>${e(t('web_visubot_mode_hint'))}</small>
              </label>
              <div class="settings-mbot-link">
                <button type="button" data-action="mbot-link-settings"></button>
                <small></small>
              </div>
            </section>
            <footer>
              <button type="button" class="about-button" data-action="about">ⓘ ${e(t('about_nav_title'))}</button>
              <span class="settings-version">${e(t('web_about_version_fmt').replace('%@', __APP_VERSION__))}</span>
            </footer>
          </div>
        </div>
      </header>
      <aside class="palette">
        <h2>${e(t('palette_header'))}</h2>
        <p class="hint">${e(t('web_palette_hint'))}</p>
        <ul class="palette-basic"></ul>
        <h3 class="palette-visubot-title" hidden>🤖 ${e(t('web_visubot_commands'))}</h3>
        <ul class="palette-visubot" hidden></ul>
        <h3 class="palette-visubot-title palette-visubot-sensors-title" hidden>📡 ${e(t('web_visubot_sensors'))}</h3>
        <ul class="palette-visubot palette-visubot-sensors" hidden></ul>
      </aside>
      <div class="diagram-tools" role="toolbar" aria-label="${e(t('web_diagram_tools'))}">
        ${iconButton('undo', t('toolbar_undo'), icons.undo, shortcut('Z'))}
        ${iconButton('redo', t('toolbar_redo'), icons.redo, shortcut('Z', true))}
        <span class="sep"></span>
        ${iconButton('cut', t('ctx_cut'), icons.cut, shortcut('X'))}
        ${iconButton('copy', t('ctx_copy'), icons.copy, shortcut('C'))}
        ${iconButton('paste', t('ctx_paste'), icons.paste, shortcut('V'))}
        ${iconButton('delete', t('action_delete_selection'), icons.trash, t('web_key_delete'))}
        <span class="sep"></span>
        <div class="menu-host">
          ${iconButton('export', t('web_export_title'), icons.share)}
          <div class="export-menu" role="menu" hidden>
            <button role="menuitem" data-export="png">${e(t('web_export_png'))}</button>
            <button role="menuitem" data-export="svg">${e(t('web_export_svg'))}</button>
            <button role="menuitem" data-export="pdf">${e(t('web_export_pdf'))}</button>
            <button role="menuitem" data-export="visustruct">${e(t('web_export_visustruct'))}</button>
            <button role="menuitem" data-export="print">${e(t('menu_print'))} (${shortcut('P')})</button>
          </div>
        </div>
        ${iconButton('code', t('a11y_generate_code'), icons.code)}
        <button class="mbot-link" data-action="mbot-link" hidden></button>
        <button class="sim-toggle" data-action="simulate" aria-pressed="false" data-tip="${e(t('web_simulation_start_title'))}" aria-label="${e(t('web_simulation_start'))}">${icons.play}<span>${e(t('web_simulation_start'))}</span></button>
        <button class="icon learn-hide editor-hide" data-action="hide-editor" title="${e(t('web_editor_hide'))}" aria-label="${e(t('web_editor_hide'))}">${sidebarIcon}</button>
      </div>
      <main class="workspace">
        <nav class="tabs" aria-label="${e(t('web_tabs_label'))}"></nav>
        <input class="caption" placeholder="${e(t('diagram_title_placeholder'))}" aria-label="${e(t('diagram_title_label'))}" />
        <div class="canvas" dir="ltr"></div>
      </main>
      <aside class="inspector"></aside>
      <footer class="statusbar">
        <span class="status"></span>
        <nav class="site-links" aria-label="VisuStruct">
          <a href="${e(siteURL())}">${e(t('web_site_home'))}</a>
          <a href="${e(siteURL('contact'))}" target="_blank" rel="noopener">${e(t('web_site_imprint'))}</a>
          <a href="${e(siteURL('privacy'))}" target="_blank" rel="noopener">${e(t('web_site_privacy'))}</a>
        </nav>
      </footer>
      <input type="file" accept=".visustruct,.strk,.xml" hidden />
    `
    // Die Werkzeugleiste steht über allen Spalten, nicht im Editor.
    this.topbar.replaceChildren(this.root.querySelector('.toolbar')!)
    // Die Fußzeile ebenso unter allen Spalten.
    this.bottombar.replaceChildren(this.root.querySelector('.statusbar')!)
    const $ = <T extends Element>(s: string) =>
      (this.root.querySelector(s) ?? this.topbar.querySelector(s) ?? this.bottombar.querySelector(s)) as T
    this.canvasHost = $('.canvas')
    this.inspector = $('.inspector')
    this.captionInput = $('.caption')
    this.undoButton = $('[data-action=undo]')
    this.redoButton = $('[data-action=redo]')
    this.deleteButton = $('[data-action=delete]')
    this.statusLine = $('.status')
    this.simButton = $('[data-action=simulate]')
    $('[data-action=hide-editor]').addEventListener('click', () => this.setEditorHidden(true))
    this.sim = new SimulationPanel(
      () => this.doc,
      (path) => {
        this.simPath = path
        if (this.simulating) this.renderDiagramOnly()
        this.scrollToSimPath()
      },
      (name) => this.findSubprogram(name),
      () => this.setSimulating(false),
      (transcript) => {
        if (this.simulating && this.liveCoding) this.live.showTranscript(transcript)
      },
    )
    this.root.append(this.sim.element)
    if (visuBotEnabled()) {
      this.visuBot ??= new VisuBotView()
      this.sim.setRobot(this.visuBot)
    } else {
      this.visuBot?.dispose()
      this.visuBot = undefined
    }
    this.simButton.addEventListener('click', () => this.setSimulating(!this.simulating))
    this.codeButton = $('[data-action=code]')
    this.code = new CodePanel(
      () => this.doc,
      (filename, text) => this.offerDownload(filename, new Blob([text], { type: 'text/plain' })),
      () => this.setCoding(false),
      (on) => this.commit({ ...this.doc, pseudocode: on || undefined }),
      () => this.tabs.filter((tab) => tab !== this.tab && parseSubprogramHeader(tab.doc.caption)).map((tab) => tab.doc),
    )
    this.root.append(this.code.element)
    this.codeButton.addEventListener('click', () => this.setCoding(!this.coding))

    // Schmale Struktogramm-Spalte: Elemente kompakt (Symbol, Name klein darunter).
    this.paletteObserver?.disconnect()
    // In den Einstellungen lässt sie sich auch dauerhaft einschalten.
    const updatePalette = () =>
      this.root.classList.toggle('compact-palette', storedValue(compactPaletteKey) === '1' || this.root.getBoundingClientRect().width < compactPaletteBelow)
    this.paletteObserver = new ResizeObserver(updatePalette)
    this.paletteObserver.observe(this.root)
    const compactPalette = $<HTMLInputElement>('[data-action=compact-palette]')
    compactPalette.checked = storedValue(compactPaletteKey) === '1'
    compactPalette.addEventListener('change', () => {
      storeValue(compactPaletteKey, compactPalette.checked ? '1' : '0')
      updatePalette()
    })

    const addPaletteItem = (list: HTMLUListElement, icon: PaletteItem, label: string, make: () => VSElement, data: string) => {
      const li = document.createElement('li')
      li.className = 'palette-item'
      li.dataset.item = data
      li.append(this.paletteIcon(icon), document.createTextNode(label))
      li.addEventListener('pointerdown', (e) => this.beginDrag(e, { kind: 'palette', make, label }))
      // Tastatur/Klick ohne Ziehen: hinter der Auswahl einfügen (bzw. Platzhalter ersetzen).
      li.tabIndex = 0
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') this.insertNearSelection(make())
      })
      list.append(li)
    }
    const list = $<HTMLUListElement>('.palette-basic')
    for (const { item } of paletteItems) addPaletteItem(list, item, typeName(paletteElement(item).type), () => paletteElement(item), item)

    // VisuBot: fertige mBot2-Kästen unter den normalen Elementen.
    const robotOn = visuBotEnabled()
    this.root.classList.toggle('visubot-mode', robotOn)
    const robotList = $<HTMLUListElement>('.palette-visubot')
    robotList.hidden = !robotOn
    $<HTMLElement>('.palette-visubot-title').hidden = !robotOn
    if (robotOn) {
      const icon = { [ElementType.verzweigung]: 'verzweigung', [ElementType.whileSchleife]: 'whileSchleife' } as Partial<Record<ElementType, PaletteItem>>
      for (const tpl of visuBotTemplates) addPaletteItem(robotList, icon[tpl.type] ?? 'anweisung', t(tpl.key), tpl.make, tpl.key)
      // Sensoren: Werte zum Einbauen in eine Bedingung, keine eigenen Kästen
      const sensorList = $<HTMLUListElement>('.palette-visubot-sensors')
      sensorList.replaceChildren()
      for (const sensor of visuBotSensors) {
        const label = t(sensor.key)
        const li = document.createElement('li')
        li.className = 'palette-item palette-sensor'
        li.dataset.item = sensor.key
        li.title = sensor.text
        const code = document.createElement('code')
        code.textContent = sensor.text
        li.append(document.createTextNode(label), code)
        li.addEventListener('pointerdown', (e) => this.beginDrag(e, { kind: 'sensor', text: sensor.text, label: sensor.text }))
        li.tabIndex = 0
        li.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') this.insertSensor(sensor.text)
        })
        sensorList.append(li)
      }
    }
    $<HTMLElement>('.palette-visubot-sensors').hidden = !robotOn
    $<HTMLElement>('.palette-visubot-sensors-title').hidden = !robotOn

    this.tabStrip = $('.tabs')
    this.exportButton = $<HTMLButtonElement>('[data-action=export]')
    const exportMenu = $<HTMLElement>('.export-menu')
    this.exportButton.setAttribute('aria-haspopup', 'menu')
    this.exportButton.addEventListener('click', () => {
      exportMenu.hidden = !exportMenu.hidden
      if (!exportMenu.hidden) exportMenu.querySelector('button')?.focus()
    })
    exportMenu.addEventListener('click', (ev) => {
      const kind = (ev.target as HTMLElement).closest<HTMLElement>('[data-export]')?.dataset.export as ExportKind | undefined
      if (!kind) return
      exportMenu.hidden = true
      void this.exportDiagram(kind)
    })
    exportMenu.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Escape') return
      exportMenu.hidden = true
      this.exportButton.focus()
    })
    if (this.closeExport) document.removeEventListener('pointerdown', this.closeExport)
    this.closeExport = (ev: PointerEvent) => {
      if (!exportMenu.hidden && !exportMenu.parentElement!.contains(ev.target as Node)) exportMenu.hidden = true
    }
    document.addEventListener('pointerdown', this.closeExport)
    const language = $<HTMLSelectElement>('[data-action=language]')
    language.value = currentLanguage()
    language.addEventListener('change', () => void this.changeLanguage(() => setLanguage(language.value as LanguageCode), 'language'))
    // Echter mBot2: Knopf in der Werkzeugleiste (neben der Simulation) und in den Einstellungen
    const linkButtons = [$<HTMLButtonElement>('[data-action=mbot-link]'), $<HTMLButtonElement>('[data-action=mbot-link-settings]')]
    const linkInfo = $<HTMLElement>('.settings-mbot-link small')
    const showLink = () => {
      const on = mbotLink.connected
      const label = mbotLink.connecting ? t('web_visubot_connecting') : on ? t('web_visubot_disconnect') : t('web_visubot_connect')
      linkButtons[0].hidden = !visuBotEnabled() || !canConnectMBot()
      linkButtons[0].classList.toggle('connected', on)
      const icon = mbotLink.connecting ? '⏳' : on ? '🟢' : '🔌'
      linkButtons[0].textContent = `${icon} mBot2`
      linkButtons[0].title = label
      linkButtons[1].textContent = `${icon} ${label}`
      linkButtons[1].disabled = !canConnectMBot()
      linkButtons[1].parentElement!.hidden = !visuBotEnabled()
      linkInfo.textContent = canConnectMBot() ? mbotLinkText() : t('web_visubot_no_serial')
    }
    for (const b of linkButtons) b.addEventListener('click', () => void toggleMBotLink())
    this.stopLinkListener?.()
    this.stopLinkListener = mbotLink.listen(showLink)
    showLink()
    const visuBot = $<HTMLSelectElement>('[data-action=visubot]')
    visuBot.value = visuBotMode()
    visuBot.addEventListener('change', () =>
      void this.changeLanguage(async () => {
        setVisuBotMode(visuBot.value as VisuBotMode)
        useVisuBotContent(visuBot.value as VisuBotMode)
      }, 'visubot'),
    )
    const keywords = $<HTMLInputElement>('[data-action=keywords]')
    keywords.checked = codeKeywords()
    keywords.addEventListener('change', () => void this.changeLanguage(() => setCodeKeywords(keywords.checked), 'keywords'))
    const liveLanguage = $<HTMLSelectElement>('[data-action=live-language]')
    liveLanguage.value = this.live.language
    const javaClass = $<HTMLInputElement>('[data-action=java-class]')
    const javaMain = $<HTMLInputElement>('[data-action=java-main]')
    const javaSwing = $<HTMLInputElement>('[data-action=java-swing]')
    javaSwing.checked = this.live.swingSupport
    javaSwing.addEventListener('change', () => this.live.setSwingSupport(javaSwing.checked))
    const showJavaForm = () => {
      javaClass.checked = this.live.javaForm.asClass
      javaMain.checked = this.live.javaForm.withMain
      // Die Java-Einstellungen nur zeigen, wenn Java gewählt ist.
      $<HTMLElement>('.settings-menu .java-only').hidden = this.live.language !== 'java'
    }
    showJavaForm()
    liveLanguage.addEventListener('change', () => {
      this.live.setTarget(liveLanguage.value as LiveTarget)
      showJavaForm()
    })
    for (const box of [javaClass, javaMain]) {
      box.addEventListener('change', () => this.live.setJavaForm({ asClass: javaClass.checked, withMain: javaMain.checked }))
    }
    const zoom = $<HTMLSelectElement>('[data-action=zoom]')
    zoom.value = String(this.zoom)
    zoom.addEventListener('change', () => {
      this.zoom = Number(zoom.value)
      storeValue(zoomKey, zoom.value)
      this.renderDiagramOnly()
    })
    const codeSize = $<HTMLSelectElement>('[data-action=code-size]')
    const storedSize = Number(storedValue(codeSizeKey))
    codeSize.value = String(codeSizes.some((s) => s.value === storedSize) ? storedSize : codeSizes[0].value)
    applyCodeSize(Number(codeSize.value))
    codeSize.addEventListener('change', () => {
      storeValue(codeSizeKey, codeSize.value)
      applyCodeSize(Number(codeSize.value))
    })
    this.setupSettingsMenu($('[data-action=settings]'), $('.settings-menu'))
    $('[data-action=about]').addEventListener('click', () => {
      $<HTMLElement>('.settings-menu').hidden = true
      this.showAbout()
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
      // Der Titel ist in „Code live“ der Klassenname.
      this.refreshLive()
    })
    this.captionInput.addEventListener('change', () => {
      if (captionBefore && captionBefore.caption !== this.doc.caption) this.pushUndo(captionBefore)
      captionBefore = this.doc
    })

    this.canvasHost.addEventListener('pointerdown', (e) => this.onCanvasPointerDown(e))
    this.resizeObserver?.disconnect()
    // Nur bei echter Größenänderung neu zeichnen, sonst schaukeln sich Scrollbalken (Windows) gegenseitig auf
    this.resizeObserver = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = this.canvasHost
      if (clientWidth === this.renderedHostSize.width && clientHeight === this.renderedHostSize.height) return
      this.renderDiagramOnly()
    })
    this.resizeObserver.observe(this.canvasHost)
  }

  /** Sprache wechseln wie in den App-Einstellungen: Oberfläche neu aufbauen, Reiter und Verlauf bleiben. */
  /** Sprache oder Code-Keywords umstellen und alle Texte neu aufbauen; das Einstellungsmenü bleibt offen. */
  private async changeLanguage(change: () => Promise<void>, control: string) {
    this.setSimulating(false)
    this.setCoding(false)
    await change()
    applyCanvasStubTexts()
    this.sim.end()
    this.live.build()
    this.files.build()
    this.buildUI()
    this.render()
    this.learn.render()
    this.labelLearnRail()
    this.labelLiveRail()
    this.labelEditorRail()
    this.labelFilesRail()
    this.topbar.querySelector<HTMLButtonElement>('[data-action=settings]')?.click()
    this.topbar.querySelector<HTMLElement>(`[data-action=${control}]`)?.focus()
  }

  // MARK: - Dateien

  private setFilesOpen(on: boolean) {
    this.shell.classList.toggle('files-open', on)
    storeValue(filesKey, on ? '1' : '0')
    this.keepAColumnOpen()
    if (this.canvasHost) this.renderDiagramOnly()
  }

  private filesRail(): HTMLElement {
    this.filesRailButton = h('button', { class: 'learn-rail files-rail' }) as HTMLButtonElement
    this.labelFilesRail()
    this.filesRailButton.addEventListener('click', () => this.setFilesOpen(true))
    return this.filesRailButton
  }

  private labelFilesRail() {
    if (!this.filesRailButton) return
    this.filesRailButton.title = t('web_files_show')
    this.filesRailButton.innerHTML = `${sidebarIcon}<span>📁 ${e(t('web_files_title'))}</span>`
  }

  /** Programm aus dem Workspace öffnen; gespeicherter Code (.java) behält seine Kommentare. */
  private openFromWorkspace(xml: string, file: WorkspaceFile, java: string | undefined) {
    const already = this.tabs.find((tab) => tab.workspace?.dir === file.dir && tab.workspace.base === file.base)
    if (already) {
      this.tabIndex = this.tabs.indexOf(already)
      this.render()
      return
    }
    if (xml) this.loadXML(xml, `${file.base}.visustruct`)
    else if (java !== undefined) {
      if (this.dirty || this.tab.fileName || this.tab.exerciseId) this.addTab()
      this.doc = this.live.documentFromJavaText(java)
      this.tab.fileName = `${file.base}.visustruct`
      this.resetHistory()
    }
    this.tab.workspace = file
    this.tab.fileHandle = undefined
    if (java !== undefined) {
      this.live.adoptJava(this.doc, java)
      this.setLiveCoding(true)
    }
    this.render()
  }

  /** Speichern in den Workspace: in den Ordner des Programms, sonst Klasse/Tagesordner. `false` = dort nicht möglich. */
  private async saveToWorkspace(): Promise<boolean> {
    if (!this.files.ready || (this.tab.fileHandle && !this.tab.workspace)) return false
    const title = this.doc.caption.trim() || tabTitle(this.tab)
    const java = this.live.language === 'java' ? this.live.javaFor(this.doc, this.tab) : undefined
    try {
      const place = await this.files.save(title, encodeDocument(this.doc), java, this.tab.workspace)
      if (!place) {
        this.setFilesOpen(true)
        return true
      }
      this.tab.workspace = place
      this.tab.fileName = `${place.base}.visustruct`
      this.dirty = false
      this.render()
      this.showMessage(t('web_files_saved_fmt', place.path))
    } catch (err) {
      this.showMessage((err as Error).message)
    }
    return true
  }

  // MARK: - Lernbereich

  private setLearning(on: boolean, remember = true) {
    this.shell.classList.toggle('learning', on)
    if (remember) storeValue(learnKey, on ? '1' : '0')
    this.keepAColumnOpen()
    if (this.canvasHost) this.renderDiagramOnly()
  }

  // MARK: - Spalte Struktogramm

  /** Struktogramm-Spalte einklappen, z. B. um nur Code live (wie in einer IDE) oder nur Lektionen zu sehen. */
  private setEditorHidden(hidden: boolean) {
    this.editorHidden = hidden
    this.shell.classList.toggle('editor-hidden', hidden)
    storeValue(editorHiddenKey, hidden ? '1' : '0')
    // Ohne Struktogramm soll der Code zu sehen sein, nicht eine leere Fläche.
    if (hidden && !this.liveCoding && !this.shell.classList.contains('learning')) this.setLiveCoding(true)
    if (!hidden && this.canvasHost) this.render()
  }

  /** Mindestens eine Spalte bleibt offen; sonst kommt das Struktogramm zurück. */
  private keepAColumnOpen() {
    if (this.editorHidden && !this.liveCoding && !this.shell.classList.contains('learning') && !this.shell.classList.contains('files-open')) {
      this.setEditorHidden(false)
    }
  }

  private editorRail(): HTMLElement {
    this.editorRailButton = h('button', { class: 'learn-rail editor-rail' }) as HTMLButtonElement
    this.labelEditorRail()
    this.editorRailButton.addEventListener('click', () => this.setEditorHidden(false))
    return this.editorRailButton
  }

  private labelEditorRail() {
    if (!this.editorRailButton) return
    this.editorRailButton.title = t('web_editor_show')
    this.editorRailButton.innerHTML = `${sidebarIcon}<span>✎ ${e(t('web_editor_title'))}</span>`
  }

  /** „Über VisuStruct“ wie in der App (dieselben Texte aus `Localizable.strings`). */
  private showAbout() {
    const link = (label: string, href: string, text: string) =>
      `<p class="about-link"><span>${e(t(label))}</span> <a href="${href}" target="_blank" rel="noopener">${text}</a></p>`
    const dialog = h('dialog', { class: 'about', 'aria-labelledby': 'about-title' }) as HTMLDialogElement
    dialog.innerHTML = `
      <header>
        <h2 id="about-title">${e(t('about_nav_title'))}</h2>
        <button type="button" data-action="about-done">${e(t('about_done'))}</button>
      </header>
      <div class="about-body">
        <div class="about-head">
          <span class="logo" aria-hidden="true"></span>
          <div>
            <h3>VisuStruct <small>${e(t('web_brand_suffix'))}</small></h3>
            <p class="about-version">${e(t('web_about_version_fmt').replace('%@', __APP_VERSION__))}</p>
            <p class="about-author">Holger Sebastiao</p>
            ${link('about_web_label', 'https://www.visustruct.org', 'www.visustruct.org')}
            ${link('about_developer_label', 'https://www.sebastiao.org', 'www.sebastiao.org')}
            ${link('about_project_github_label', 'https://github.com/code4teaching/VisuStruct', 'code4teaching/VisuStruct')}
          </div>
        </div>
        <h4>${e(t('about_dateiformat_heading'))}</h4>
        <p>${e(t('about_dateiformat_part1'))}<code>.visustruct</code>${e(t('about_dateiformat_part2'))}</p>
        <p>${e(t('about_dateiformat_strk'))}</p>
        <h4>${e(t('web_about_software'))}</h4>
        <p>${e(t('web_about_software_text'))} <a href="licenses.txt" target="_blank" rel="noopener">${e(t('web_about_licenses'))}</a></p>
        <p class="about-copy">${e(t('about_copyright'))}</p>
      </div>`
    dialog.querySelector('[data-action=about-done]')!.addEventListener('click', () => dialog.close())
    // Klick auf den abgedunkelten Rand schließt ebenfalls.
    dialog.addEventListener('click', (ev) => ev.target === dialog && dialog.close())
    dialog.addEventListener('close', () => dialog.remove())
    document.body.append(dialog)
    dialog.showModal()
  }

  /** Schmale Leiste am Rand, solange der Lernbereich eingeklappt ist. */
  /** Zahnrad oben rechts: Textgröße und Sprache. Schließt bei Klick daneben und mit Escape. */
  private setupSettingsMenu(button: HTMLButtonElement, menu: HTMLElement) {
    const show = (open: boolean) => {
      menu.hidden = !open
      button.setAttribute('aria-expanded', String(open))
    }
    button.addEventListener('click', () => show(menu.hidden))
    // Nach einem Sprachwechsel wird die Leiste neu gebaut: alten Zuhörer entfernen.
    if (this.closeSettings) document.removeEventListener('pointerdown', this.closeSettings)
    if (this.escapeSettings) document.removeEventListener('keydown', this.escapeSettings)
    this.closeSettings = (ev: PointerEvent) => {
      if (!menu.hidden && !button.parentElement!.contains(ev.target as Node)) show(false)
    }
    document.addEventListener('pointerdown', this.closeSettings)
    // Am Dokument statt am Menü: Safari gibt einem angeklickten Haken keinen Fokus.
    this.escapeSettings = (ev: KeyboardEvent) => {
      if (ev.key !== 'Escape' || menu.hidden) return
      show(false)
      button.focus()
    }
    document.addEventListener('keydown', this.escapeSettings)
  }

  private learnRail(): HTMLElement {
    this.railButton = h('button', { class: 'learn-rail' }) as HTMLButtonElement
    this.labelLearnRail()
    this.railButton.addEventListener('click', () => this.setLearning(true))
    return this.railButton
  }

  /** Wie beim Lernbereich: eingeklappt bleibt „Code live“ als schmale Leiste am rechten Rand. */
  private liveRail(): HTMLElement {
    this.liveRailButton = h('button', { class: 'learn-rail live-rail' }) as HTMLButtonElement
    this.labelLiveRail()
    this.liveRailButton.addEventListener('click', () => this.setLiveCoding(true))
    return this.liveRailButton
  }

  private labelLiveRail() {
    if (!this.liveRailButton) return
    this.liveRailButton.title = t('web_live_show')
    this.liveRailButton.innerHTML = `${sidebarIcon}<span>&lt;/&gt; ${e(t('web_live_title'))}</span>`
  }

  private labelLearnRail() {
    if (!this.railButton) return
    this.railButton.title = t('web_learn_show')
    this.railButton.innerHTML = `${sidebarIcon}<span>🎓 ${e(t('web_learn_title'))}</span>`
  }

  private learnHost(): LearnHost {
    return {
      collapse: () => this.setLearning(false),
      showEditor: () => {
        if (this.editorHidden) this.setEditorHidden(false)
      },
      showLiveCode: () => {
        if (!this.liveCoding) this.setLiveCoding(true)
      },
      showJava: () => this.openJavaColumn(),
      showFiles: () => {
        if (!this.shell.classList.contains('files-open')) this.setFilesOpen(true)
      },
      openExercise: (ex: Exercise, doc: VSDocument) => {
        // Java-Übungen tippt man in „Programmieren“. Geschlossen wird nichts, so wächst das Struktogramm sichtbar mit.
        if (ex.code === 'java') this.openJavaColumn()
        else this.setEditorHidden(false)
        const existing = this.tabs.findIndex((tab) => tab.exerciseId === ex.id)
        if (existing >= 0) {
          this.switchTab(existing)
          this.setSimulating(false)
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
        this.setEditorHidden(false)
        // Tab nach der Diagrammüberschrift benennen, nicht nach der Datei (l1-tee)
        this.loadXML(encodeDocument(doc), doc.caption.trim() ? `${doc.caption.trim()}.visustruct` : fileName)
      },
      exerciseDocument: (id: string) => {
        const own = this.tabs.find((tab) => tab.exerciseId === id)
        if (own) return own.doc
        // Ohne „Übung öffnen“ gebaut: Das offene Struktogramm wird zur Übung, statt eine Fehlermeldung zu zeigen.
        const tab = this.tab
        if (tab.exerciseId || this.isPristine(tab)) return undefined
        tab.exerciseId = id
        progress.updateExercise(id, { xml: encodeDocument(tab.doc) })
        return tab.doc
      },
      subprogramsFor: (id: string) => {
        const own = this.tabs.find((tab) => tab.exerciseId === id)
        return (name) => this.findSubprogram(name, own)
      },
      stopSimulation: () => this.setSimulating(false),
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
        // Kleine Diagramme nicht über ihre natürliche Größe hinaus vergrößern.
        const width = image.svg.getAttribute('width')
        if (width) image.svg.style.maxWidth = `${width}px`
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
    const host = this.canvasHost
    this.renderedHostSize = { width: host.clientWidth, height: host.clientHeight }
    // Abgerundet, damit das Diagramm den sichtbaren Bereich nie um Bruchteile eines Pixels überragt
    // (sonst erscheinen bei 125 % Skalierung unter Windows Scrollbalken ohne Grund)
    const size = {
      width: Math.max(320, this.layout.canvasSize.width, Math.floor(host.clientWidth / z)),
      height: Math.max(240, this.layout.canvasSize.height + 60, Math.floor(host.clientHeight / z)),
    }
    this.renderer.usesSimulationHighlight = this.simulating
    this.renderer.fillsSelection = this.liveCoding
    this.svg = this.renderer.render(this.layout, size, this.simulating ? this.simPath : this.selected)
    // Textgröße wie `canvasScaleStep`: Layout und Linien wachsen gleichmäßig mit.
    this.svg.setAttribute('width', String(Math.floor(size.width * z)))
    this.svg.setAttribute('height', String(Math.floor(size.height * z)))
    this.overlay = el('g', { class: 'drop-overlay' })
    this.svg.append(this.overlay)
    this.canvasHost.replaceChildren(this.svg)

    if (document.activeElement !== this.captionInput) this.captionInput.value = this.doc.caption
    this.undoButton.disabled = this.simulating || this.undoStack.length === 0
    this.redoButton.disabled = this.simulating || this.redoStack.length === 0
    this.deleteButton.disabled = this.simulating || !this.selected || !canDeleteElement(this.doc, this.selected)
    this.captionInput.readOnly = this.simulating
    this.codeButton.disabled = this.simulating
    this.exportButton.disabled = this.simulating
    if (this.coding) this.code.refresh()
    this.refreshLive()
    this.renderTabs()
    this.renderInspector()
    this.updateStatus()
  }

  private refreshLive() {
    if (!this.liveCoding) return
    this.live.refresh(this.doc, this.simulating ? this.simPath : this.selected, {
      owner: this.tab,
      subprograms: new Set(this.tabs.filter((tab) => tab !== this.tab).flatMap((tab) => parseSubprogramHeader(tab.doc.caption)?.name ?? [])),
      editable: !this.simulating,
      resolve: (name) => this.findSubprogram(name),
    })
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
    box.replaceChildren(h('h2', {}, `${t('web_inspector_title')} · ${typeName(element.type)}`))

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
    // Beschriftung statt Symbol allein: „Simulation starten“ wird zu „Simulation beenden“.
    this.simButton.innerHTML = `${on ? icons.stop : icons.play}<span>${e(t(on ? 'web_simulation_end' : 'web_simulation_start'))}</span>`
    this.simButton.dataset.tip = t(on ? 'web_simulation_end_title' : 'web_simulation_start_title')
    this.simButton.setAttribute('aria-label', t(on ? 'web_simulation_end' : 'web_simulation_start'))
    if (on) {
      this.setCoding(false)
      this.setEditorHidden(false)
      // VisuBot: Die Simulation zeigt die Welten der Übung in diesem Reiter (sonst die freie Fläche).
      this.visuBot?.setWorlds(exerciseWorlds(this.tab.exerciseId))
      this.sim.begin()
    } else {
      this.sim.end()
      this.simPath = undefined
      if (!this.selected && this.doc.elements.length > 0) this.selected = [0]
    }
    this.render()
  }

  /**
   * ▶ in Programmieren mit mBot2-Befehlen: Simulation öffnen und dort ausführen, damit die 3D-Welt
   * (und der verbundene mBot2) mitfährt und der aktuelle Befehl in Struktogramm und Code markiert ist.
   */
  private runRobot(stepping: boolean): boolean {
    if (!this.visuBot || !/\bmbot\s*\./u.test(JSON.stringify(this.tabs.map((tab) => tab.doc)))) return false
    if (this.simulating) this.sim.reset()
    else this.setSimulating(true)
    if (stepping) this.sim.step()
    else this.sim.play()
    return true
  }

  // MARK: - Code

  private setCoding(on: boolean) {
    if (on === this.coding) return
    // Beide Code-Spalten nebeneinander wären zu eng.
    if (on) {
      this.setLiveCoding(false)
      this.setEditorHidden(false)
    }
    this.coding = on
    this.root.classList.toggle('coding', on)
    this.codeButton.setAttribute('aria-pressed', String(on))
    if (on) this.code.refresh()
    else this.code.close()
    this.renderDiagramOnly()
  }

  // MARK: - Code live

  /** Übungen mit `code: java`: Spalte Programmieren öffnen und auf Java stellen, wie über das Zahnrad. */
  private openJavaColumn() {
    if (this.live.language !== 'java') {
      const sel = '[data-action=live-language]'
      const select = this.topbar.querySelector<HTMLSelectElement>(sel) ?? this.root.querySelector<HTMLSelectElement>(sel)
      if (select) {
        select.value = 'java'
        select.dispatchEvent(new Event('change'))
      } else this.live.setTarget('java')
    }
    if (!this.liveCoding) this.setLiveCoding(true)
  }

  private setLiveCoding(on: boolean) {
    if (on && this.coding) this.setCoding(false)
    this.liveCoding = on
    this.shell.classList.toggle('live', on)
    if (!on) this.live.hideConsole()
    storeValue(liveKey, on ? '1' : '0')
    this.keepAColumnOpen()
    if (this.canvasHost) this.render()
  }

  /** Markierten Schritt sichtbar halten, wenn das Diagramm größer als das Fenster ist. */
  /** Ein anderer Reiter, dessen Titel oder Dateiname zum Aufruf passt, z. B. `zeigeTitel()`. */
  /** Senkrechte Trennlinie: Breite des Lernbereichs mit Maus, Finger oder Pfeiltasten ändern, Doppelklick setzt zurück. */
  private learnResizer(): HTMLElement {
    return this.panelResizer(this.learn.element, 'learn-resizer', learnWidthKey, t('web_learn_resize'), 1)
  }

  /** Wie beim Lernbereich, nur am anderen Rand: Ziehen nach links macht den Code breiter. */
  private liveResizer(): HTMLElement {
    return this.panelResizer(this.live.element, 'live-resizer', liveWidthKey, t('web_live_resize'), -1)
  }

  /** `side`: 1 = Bereich liegt am Anfang der Zeile (links), -1 = am Ende (rechts). */
  private panelResizer(panel: HTMLElement, className: string, widthKey: string, title: string, side: 1 | -1): HTMLElement {
    const bar = h('div', { class: className, role: 'separator', 'aria-orientation': 'vertical', tabindex: '0', title })
    // Höchstens so breit, dass die Spalte daneben noch 240 px behält; feste Breiten anderer Bereiche zählen mit.
    const clamp = (width: number) => {
      const total = panel.parentElement?.getBoundingClientRect().width ?? 0
      if (total === 0) return clampPanelWidth(width)
      const others = [this.files.element, this.learn.element, this.live.element]
        .filter((p) => p !== panel && p.offsetParent !== null && getComputedStyle(p).flexGrow === '0')
        .reduce((sum, p) => sum + p.getBoundingClientRect().width, 0)
      const min = parseFloat(getComputedStyle(panel).minWidth) || 200
      return Math.round(Math.max(min, Math.min(width, total - others - 240)))
    }
    const apply = (width: number | undefined, remember: boolean) => {
      panel.style.width = width === undefined ? '' : `${clamp(width)}px`
      if (remember) storeValue(widthKey, width === undefined ? '' : String(clamp(width)))
    }
    const saved = Number(storedValue(widthKey))
    if (saved > 0) apply(saved, false)
    // Im Rechts-nach-links-Layout sind die Seiten vertauscht.
    const sign = () => (getComputedStyle(this.shell).direction === 'rtl' ? -side : side)
    bar.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return
      e.preventDefault()
      bar.setPointerCapture(e.pointerId)
      const startX = e.clientX
      const startWidth = panel.getBoundingClientRect().width
      const s = sign()
      this.shell.classList.add('resizing')
      const move = (ev: PointerEvent) => apply(startWidth + s * (ev.clientX - startX), false)
      const up = (ev: PointerEvent) => {
        bar.removeEventListener('pointermove', move)
        bar.removeEventListener('pointerup', up)
        bar.removeEventListener('pointercancel', up)
        this.shell.classList.remove('resizing')
        apply(startWidth + s * (ev.clientX - startX), true)
      }
      bar.addEventListener('pointermove', move)
      bar.addEventListener('pointerup', up)
      bar.addEventListener('pointercancel', up)
    })
    bar.addEventListener('dblclick', () => apply(undefined, true))
    bar.addEventListener('keydown', (e) => {
      const step = e.key === 'ArrowRight' ? 20 : e.key === 'ArrowLeft' ? -20 : 0
      if (!step) return
      e.preventDefault()
      apply(panel.getBoundingClientRect().width + sign() * step, true)
    })
    return bar
  }

  private findSubprogram(name: string, current: Tab | undefined = this.tab): VSDocument | undefined {
    const key = subprogramKey(name)
    if (key === '') return undefined
    const match = this.tabs.find(
      (tab) => tab !== current && (subprogramKey(tab.doc.caption) === key || subprogramKey(tabTitle(tab)) === key),
    )
    return match?.doc
  }

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
    this.codeTyping = undefined
    this.pushUndo(this.doc)
    this.doc = next
    this.dirty = true
    if (select) this.selected = select
    this.render()
  }

  /**
   * Getippter Code in „Code live“ ergab ein neues Struktogramm. Wer am Stück tippt, bekommt einen
   * Rückgängig-Schritt pro kurzer Pause statt einen pro Buchstabe.
   */
  private commitFromCode(next: VSDocument, select?: number[]) {
    const now = Date.now()
    const typing = this.codeTyping
    if (!typing || typing.tab !== this.tab || now - typing.last > 1000 || now - typing.start > 5000) {
      this.pushUndo(this.doc)
      this.codeTyping = { tab: this.tab, start: now, last: now }
    } else typing.last = now
    this.doc = next
    this.dirty = true
    this.selected = sanitizedSelection(select ?? this.selected, next)
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
    this.codeTyping = undefined
    this.redoStack.push(this.doc)
    this.doc = prev
    this.dirty = true
    this.selected = sanitizedSelection(this.selected, this.doc)
    this.render()
  }

  private redo() {
    const next = this.redoStack.pop()
    if (!next) return
    this.codeTyping = undefined
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
  /**
   * VisuBot: Sensorwert in den Text eines Elements schreiben (ohne Ziel: in das gewählte Element).
   * Leere Bedingung → nur der Wert; sonst kommt er hinten dazu. Den Vergleich (`< 20`) schreiben die Schüler selbst.
   */
  private insertSensor(text: string, path = this.selected) {
    if (!path || isPlaceholderSlot(this.doc, path)) return
    const el = elementAt(this.doc, path)
    if (!takesSensor.includes(el.type)) return
    const old = (el.textLines ?? []).join(' ').trim()
    this.commit(setTextLines(this.doc, path, [old ? `${old} ${text}` : text]), path)
    // Gleich weiterschreiben können, z. B. ` < 20`
    const ta = this.inspector.querySelector('textarea')
    if (ta) {
      ta.focus()
      ta.setSelectionRange(ta.value.length, ta.value.length)
    }
  }

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
    // Eine Übung bleibt in ihrem Reiter, auch wenn sie noch leer ist.
    if (this.dirty || this.tab.fileName || this.tab.exerciseId) this.addTab()
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
    if (!this.downloads && (await this.saveToWorkspace())) return
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
    // Die Datei selbst zum Weitergeben, z. B. per Mail oder in die Lernplattform; ändert nicht, wo gespeichert wird.
    if (kind === 'visustruct') {
      const base = Export.exportFilenameBase(this.doc, tabTitle(this.tab))
      return this.offerDownload(`${base}.visustruct`, new Blob([encodeDocument(this.doc)], { type: 'application/xml' }))
    }
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
    // Auch der Code-Editor in „Code live“ (contenteditable): Löschen und ⌘Z gehören dort dem Text.
    const typing =
      e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement || (e.target as HTMLElement | null)?.isContentEditable === true
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
    else if (!d.active && d.source.kind === 'palette') this.insertNearSelection(d.source.make())
    else if (!d.active && d.source.kind === 'sensor') this.insertSensor(d.source.text)
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
    if (source.kind === 'palette' || source.kind === 'sensor') {
      g.textContent = source.label
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
    if (source.kind === 'sensor') {
      // Nur auf ein Element mit Bedingung oder eine Anweisung, nicht dazwischen
      if (!node || isPlaceholderSlot(this.doc, node.idPath)) return undefined
      return takesSensor.includes(elementAt(this.doc, node.idPath).type) ? { kind: 'condition', path: node.idPath, frame: node.frame } : undefined
    }
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
    if (t.kind === 'replace' || t.kind === 'condition') {
      this.overlay.append(el('rect', { x: f.x + 2, y: f.y + 2, width: f.width - 4, height: f.height - 4, class: 'drop-replace' }))
      return
    }
    const y = t.kind === 'before' ? f.y : f.y + f.height
    this.overlay.append(el('rect', { x: f.x, y: y - 3, width: f.width, height: 6, rx: 3, class: 'drop-line' }))
  }

  private applyDrop(source: DragSource, t: DropTarget) {
    const doc = this.doc
    try {
      if (source.kind === 'sensor') {
        if (t.kind === 'condition') this.insertSensor(source.text, t.path)
        return
      }
      if (t.kind === 'condition') return
      if (source.kind === 'palette') {
        const element = source.make()
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

type ExportKind = 'png' | 'svg' | 'pdf' | 'print' | 'visustruct'

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

/** Gleiche Namen für Aufruf und Reiter: ohne `()`, ohne Groß- und Kleinschreibung. */
function subprogramKey(text: string): string {
  return subprogramName(text).toLowerCase()
}

function tabTitle(tab: Tab): string {
  if (tab.fileName) return tab.fileName.replace(/\.(visustruct|strk)$/i, '')
  return tab.doc.caption.trim() || t('tab_title_format', tab.serial)
}

/** Breite des Lernbereichs: mindestens 260 px, dem Editor bleiben mindestens 420 px. */
function clampPanelWidth(width: number): number {
  return Math.round(Math.max(200, Math.min(width, window.innerWidth - 300)))
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

/** Welten einer VisuBot-Übung (`welt:`), in der Reihenfolge der Tests. */
function exerciseWorlds(id: string | undefined): RobotWorldSetup[] {
  if (!id) return []
  for (const block of [...lessons.flatMap((l) => l.steps.flatMap((s) => s.blocks)), ...tasks.flatMap((t) => t.blocks)]) {
    if (block.kind !== 'exercise' || block.exercise.id !== id) continue
    return block.exercise.tests.flatMap((test) => {
      const setup = test.world ? world(test.world) : undefined
      return setup ? [setup] : []
    })
  }
  return []
}
