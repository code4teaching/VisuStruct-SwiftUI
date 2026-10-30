import {
  addInterface,
  addMember,
  classModifiers,
  deleteClass,
  deleteMember,
  parseClasses,
  parseUmlLine,
  removeInterface,
  renameClass,
  replaceMember,
  setAbstract,
  setFieldType,
  setFinal,
  setPublic,
  setSuperclass,
  umlText,
  type UmlClass,
  type UmlMember,
  type Visibility,
} from '../core/classModel'
import {
  addFile,
  addPackage,
  addSourceFolder,
  barePackage,
  classFileText,
  defaultRoot,
  diskPath,
  exampleProject,
  fileNameOf,
  filesIn,
  isFolderName,
  isPackageName,
  moveFile,
  packageKey,
  packageOf,
  packagesOf,
  pathFor,
  projectClasses,
  projectFromFiles,
  projectFromJSON,
  projectToJSON,
  removeFile,
  removePackage,
  removeSourceFolder,
  renamePackage,
  renameSourceFolder,
  rootOf,
  sourceFoldersOf,
  updateFile,
  type JavaProject,
  type ProjectClass,
} from '../core/javaProject'
import {
  associations,
  dependencies,
  ensureImport,
  fieldNameFor,
  fieldTypeFor,
  generalizations,
  isMany,
  multiplicities,
  relationKey,
  renameInfo,
  withInfo,
  type Assoc,
  type AssocInfo,
  type AssocKind,
  type Dependency,
  type EndNav,
  type Generalization,
} from '../core/umlRelations'
import { gearIcon } from './app'
import { currentLanguage, t } from './i18n'
import { icons } from './icons'
import { JavaEditor } from './javaEditor'
import type { OwnTypes } from '../core/javaMembers'
import { ownTypes } from '../core/ownTypes'
import { ObjectLayout } from './objectLayout'
import { setVisuBotMode, worldChooserHTML, type WorldChoice } from './visubotView'
import { classSource, newWizard, type NewKind } from './objectNew'
import { addFieldConstructor, addGettersSetters, addToString, classDoc, fieldInfo, paramsText, parseParams, setClassDoc, setField, setMethod, type FieldInfo, type MethodInfo } from '../core/memberEdit'
import { freeProjectName, listProjects, readProject, safeFolderName, workspaceFolderName, writeProject, type Positions } from './objectWorkspace'
import { canPickFolder, pickFolder, reopenFolder, storedFolder, type WsDir } from './workspaceStore'

/**
 * Welt VisuObject: links der Package Explorer (Projekt › src › Packages › Dateien › Klassen › Mitglieder),
 * in der Mitte der Java-Code der geöffneten Datei, rechts das Klassendiagramm aller Dateien.
 * Tippen baut das Diagramm neu, eine Änderung im Diagramm schreibt nur die betroffene Stelle im Code neu.
 * Siehe docs/visuobject/PLAN.md.
 */

declare const __APP_VERSION__: string

const projectKey = 'visuobject.project'
/** Stufe 1 hatte nur eine Datei. */
const oldCodeKey = 'visuobject.code'
const activeKey = 'visuobject.active'
const positionsKey = 'visuobject.positions'
const treeKey = 'visuobject.tree'
const tabsKey = 'visuobject.tabs'
/** Zuletzt geöffnetes Projekt im Workspace. */
const wsProjectKey = 'visuobject.wsProject'
/** `0`: Objektinspektor eingeklappt. */
const inspectorKey = 'visuobject.inspector'
/** Höhe des Objektinspektors in px, leer = so hoch wie sein Inhalt. */
const inspectorHeightKey = 'visuobject.inspectorHeight'
/** `1`: ohne Workspace-Ordner arbeiten, nicht mehr fragen. */
const noWorkspaceKey = 'visuobject.noWorkspace'
/** Gemerkter Workspace-Ordner, getrennt vom Ordner „VisuStruct-Dateien“. */
const workspaceSlot = 'visuobject-workspace'
const maxUndoSteps = 80

type Point = { x: number; y: number }

const e = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
const identifier = /^[\p{L}_$][\p{L}\p{N}_$]*$/u

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

/** Was im Diagramm ausgewählt ist: eine Klasse, evtl. eines ihrer Mitglieder (Index in `members`). */
interface Selection {
  cls: string
  member?: number
}

/** Knoten im Package Explorer: `project`, `src`, `pkg:tiere`, `file:tiere/Hund.java`, `class:Hund`. */
type NodeId = string

const chevron = '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'

export class ObjectApp {
  private shell: HTMLElement
  private editor!: JavaEditor
  private canvas!: HTMLElement
  private lines!: SVGSVGElement
  private frames!: SVGSVGElement
  private status!: HTMLElement
  private tree!: HTMLElement
  private tabs!: HTMLElement
  /** Offene Dateien als Reiter über dem Code. */
  private openTabs: string[] = []
  private project: JavaProject
  /** Geöffnete Datei (Pfad unter `src/`). */
  private active?: string
  /** Im Explorer gewähltes Package: Dort landen neue Klassen. */
  private currentPackage?: string
  private classes: ProjectClass[] = []
  private positions = new Map<string, Point>()
  private selection?: Selection
  /** Gewählte Beziehung: `assoc:Klasse.attribut` oder `gen:extends:Hund:Tier`. */
  private relSelection?: string
  private inspector!: HTMLElement
  /** Gewähltes Werkzeug der Leiste über dem Diagramm. */
  private tool: Tool = 'select'
  /** Beziehungswerkzeug: erste Klasse ist angeklickt, die zweite fehlt noch. */
  private pendingFrom?: string
  /** Der Klick nach einem Werkzeug-Einsatz wählt nichts aus. */
  private suppressClick = false
  /** `Klasse.attribut` aller Attribute, die als Rolle an einer Linie stehen. */
  private roleFields = new Set<string>()
  private treeSelection?: NodeId
  private open = new Map<NodeId, boolean>()
  private history: string[] = []
  private future: string[] = []
  private lastTyping = 0
  /** Gerade bearbeitetes Eingabefeld im Diagramm oder Explorer: dann nicht neu zeichnen. */
  private editing = false
  /** Workspace-Ordner wie in Eclipse (nur Chrome/Edge); ohne ihn bleibt das Projekt im Browser. */
  private workspace?: WsDir
  /** Gemerkter Ordner, für den der Browser erst wieder fragen muss. */
  private pendingFolder?: FileSystemDirectoryHandle
  private projects: string[] = []
  /** Ordner des geöffneten Projekts im Workspace; nach dem Umbenennen bis zum Speichern noch der alte. */
  private folder?: string
  /** Stand beim letzten Speichern bzw. Laden: Projekt als JSON und Text je Datei. */
  private saved?: string
  private savedFiles = new Map<string, string>()
  private wsBox!: HTMLElement

  constructor(root: HTMLElement) {
    document.documentElement.classList.add('visuobject-theme')
    history.replaceState(history.state, '', `${location.pathname}?visuobject${location.hash}`)
    try {
      const saved = JSON.parse(stored(positionsKey) ?? '{}') as Record<string, Point>
      for (const [name, p] of Object.entries(saved)) if (Number.isFinite(p?.x) && Number.isFinite(p?.y)) this.positions.set(name, p)
      const tree = JSON.parse(stored(treeKey) ?? '{}') as Record<string, boolean>
      for (const [id, on] of Object.entries(tree)) this.open.set(id, !!on)
    } catch {
      /* alte oder kaputte Einstellungen: Standard */
    }
    const old = stored(oldCodeKey)
    this.project = projectFromJSON(stored(projectKey) ?? '') ?? (old !== null ? projectFromFiles('Projekt', [{ name: '', text: old }]) : exampleProject())
    const active = stored(activeKey)
    this.active = this.project.files.some((f) => f.path === active) ? active! : this.project.files[0]?.path
    try {
      const tabs = JSON.parse(stored(tabsKey) ?? '[]') as unknown
      if (Array.isArray(tabs)) this.openTabs = tabs.filter((p): p is string => typeof p === 'string' && this.project.files.some((f) => f.path === p))
    } catch {
      /* ohne Reiter */
    }
    this.shell = document.createElement('div')
    this.shell.className = 'shell visuobject'
    root.replaceWith(this.shell)
    this.build()
    new ObjectLayout(this.shell.querySelector('.vo-columns')!, () => this.drawLines())
    this.showActive()
    this.refresh()
    window.addEventListener('keydown', (ev) => this.onKey(ev))
    window.addEventListener('resize', () => this.drawLines())
    window.addEventListener('beforeunload', (ev) => {
      if (this.isDirty()) ev.preventDefault()
    })
    void this.restoreWorkspace()
  }

  // MARK: - Aufbau

  private build() {
    const button = (action: string, label: string, icon: string, tip = label) =>
      `<button class="icon" data-action="${action}" data-tip="${e(tip)}" aria-label="${e(label)}">${icon}</button>`
    this.shell.innerHTML = `
      <header class="toolbar">
        <a class="brand" href="${e(siteURL())}" title="${e(t('web_site_home'))}"><span class="logo"></span><span>Visu<span class="visuobject-obj">Object</span></span> <small>${e(t('web_visuobject_subtitle'))}</small></a>
        <div class="group">
          ${button('new', t('toolbar_new'), icons.newFile, t('web_visuobject_new_tip'))}
          ${button('open', t('menu_open'), icons.open, t('web_visuobject_open_tip'))}
          ${button('save', t('menu_save'), icons.save, t('web_visuobject_save_tip'))}
          ${button('undo', t('toolbar_undo'), icons.undo)}
          ${button('redo', t('toolbar_redo'), icons.redo)}
          <button class="text-button" data-action="example" data-tip="${e(t('web_visuobject_example_tip'))}">${e(t('web_visuobject_example'))}</button>
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
      <main class="vo-columns">
        <section class="vo-pane vo-explorer" data-pane="explorer">
          <button class="vo-strip" data-expand="explorer" aria-label="${e(t('web_visuobject_explorer_show'))}">${e(t('web_visuobject_explorer'))}</button>
          <header class="vo-bar">
            <h2 class="vo-bar-title">${e(t('web_visuobject_explorer'))}</h2>
            <button class="vo-collapse" data-collapse="explorer" aria-label="${e(t('web_visuobject_explorer_hide'))}" data-tip="${e(t('web_visuobject_explorer_hide'))}">–</button>
          </header>
          <div class="vo-ws" hidden></div>
          <div class="vo-tree-tools">
            <div class="vo-new">
              <button class="text-button" data-action="new-menu" aria-haspopup="menu" aria-expanded="false" data-tip="${e(t('web_visuobject_new_menu_tip'))}">+ ${e(t('web_visuobject_new_menu'))} ▾</button>
              <div class="vo-new-menu" role="menu" hidden>
                ${(['project', 'folder', 'package', 'class', 'interface'] as const).map((k) => `<button role="menuitem" data-new="${k}"><span class="vo-badge ${{ project: 'project', folder: 'folder source', package: 'package', class: 'type class', interface: 'type interface' }[k]}" aria-hidden="true">${k === 'class' ? 'C' : k === 'interface' ? 'I' : ''}</span>${e(t(`web_visuobject_new_${k}`))}</button>`).join('')}
              </div>
            </div>
          </div>
          <div class="vo-tree" role="tree" aria-label="${e(t('web_visuobject_explorer'))}"></div>
        </section>
        <div class="vo-splitter" data-split="explorer" role="separator" aria-orientation="vertical" aria-label="${e(t('web_visuobject_resize'))}" data-tip="${e(t('web_visuobject_resize'))}" tabindex="0"></div>
        <section class="vo-pane vo-code" data-pane="code">
          <button class="vo-strip" data-expand="code" aria-label="${e(t('web_visuobject_pane_show'))}">${e(t('web_visuobject_code'))}</button>
          <header class="vo-bar">
            <div class="vo-tabs" role="tablist" aria-label="${e(t('web_visuobject_code'))}"></div>
            <button class="vo-collapse" data-collapse="code" aria-label="${e(t('web_visuobject_pane_hide'))}" data-tip="${e(t('web_visuobject_pane_hide'))}">–</button>
          </header>
          <div class="livecode-editor vo-editor"></div>
        </section>
        <div class="vo-splitter" data-split="code" role="separator" aria-orientation="vertical" aria-label="${e(t('web_visuobject_resize'))}" data-tip="${e(t('web_visuobject_resize'))}" tabindex="0"></div>
        <section class="vo-pane vo-diagram" data-pane="diagram">
          <button class="vo-strip" data-expand="diagram" aria-label="${e(t('web_visuobject_pane_show'))}">${e(t('web_visuobject_diagram'))}</button>
          <header class="vo-bar">
            <h2 class="vo-bar-title">${e(t('web_visuobject_diagram'))}</h2>
            <div class="vo-bar-actions">
              <button class="text-button" data-action="layout" data-tip="${e(t('web_visuobject_layout_tip'))}">${e(t('web_visuobject_layout'))}</button>
            </div>
            <button class="vo-collapse" data-collapse="diagram" aria-label="${e(t('web_visuobject_pane_hide'))}" data-tip="${e(t('web_visuobject_pane_hide'))}">–</button>
          </header>
          <div class="vo-palette" role="toolbar" aria-label="${e(t('web_visuobject_tools'))}">
            ${paletteTools.map((tool, i) => `${i === 3 ? '<span class="vo-palette-sep" aria-hidden="true"></span>' : ''}<button class="vo-tool" data-tool="${tool}" aria-pressed="${tool === 'select'}" data-tip="${e(t(`web_visuobject_tool_${tool}_tip`))}">${toolIcon(tool)}<span>${e(t(`web_visuobject_tool_${tool}`))}</span></button>`).join('')}
          </div>
          <div class="vo-stage">
            <div class="vo-canvas" tabindex="-1"><svg class="vo-frames" aria-hidden="true"></svg><svg class="vo-lines"></svg></div>
          </div>
          <div class="vo-hsplit" role="separator" aria-orientation="horizontal" tabindex="0" aria-label="${e(t('web_visuobject_inspector_resize'))}" data-tip="${e(t('web_visuobject_inspector_resize'))}"></div>
          <section class="vo-dock" aria-label="${e(t('web_visuobject_inspector'))}">
            <header class="vo-bar vo-dock-bar">
              <h3 class="vo-bar-title">${e(t('web_visuobject_inspector'))}</h3>
              <button class="vo-collapse" data-inspector="toggle" aria-expanded="true" aria-label="${e(t('web_visuobject_inspector_hide'))}" data-tip="${e(t('web_visuobject_inspector_hide'))}">–</button>
            </header>
            <div class="vo-inspector"></div>
          </section>
          <footer class="vo-foot"><p class="vo-status" role="status"></p><small class="vo-hint">${e(t('web_visuobject_edit_hint'))}</small></footer>
        </section>
      </main>`
    this.canvas = this.shell.querySelector('.vo-canvas')!
    this.lines = this.canvas.querySelector('.vo-lines')!
    this.frames = this.canvas.querySelector('.vo-frames')!
    this.status = this.shell.querySelector('.vo-status')!
    this.inspector = this.shell.querySelector('.vo-inspector')!
    // Der Objektinspektor hat einen festen Platz unter dem Diagramm und klappt mit „–“ ein.
    const dock = this.shell.querySelector<HTMLElement>('.vo-dock')!
    const dockToggle = dock.querySelector<HTMLButtonElement>('[data-inspector=toggle]')!
    const setDock = (open: boolean, redraw = true) => {
      dock.classList.toggle('collapsed', !open)
      dockToggle.textContent = open ? '–' : '+'
      dockToggle.setAttribute('aria-expanded', String(open))
      const label = t(open ? 'web_visuobject_inspector_hide' : 'web_visuobject_inspector_show')
      dockToggle.setAttribute('aria-label', label)
      dockToggle.dataset.tip = label
      store(inspectorKey, open ? '1' : '0')
      if (redraw) this.drawLines()
    }
    dockToggle.addEventListener('click', () => setDock(dock.classList.contains('collapsed')))
    dock.querySelector('.vo-dock-bar')!.addEventListener('dblclick', () => setDock(dock.classList.contains('collapsed')))
    setDock(stored(inspectorKey) !== '0', false)
    // Grenze zwischen Diagramm und Objektinspektor nach oben oder unten schieben (Doppelklick = Standard).
    const split = this.shell.querySelector<HTMLElement>('.vo-hsplit')!
    const pane = this.shell.querySelector<HTMLElement>('[data-pane=diagram]')!
    const setHeight = (h: number | undefined) => {
      if (h === undefined) {
        this.inspector.style.removeProperty('height')
        this.inspector.style.removeProperty('max-height')
        store(inspectorHeightKey, '')
      } else {
        const max = Math.max(120, pane.clientHeight - 200)
        const value = Math.round(Math.min(max, Math.max(60, h)))
        this.inspector.style.height = `${value}px`
        this.inspector.style.maxHeight = 'none'
        store(inspectorHeightKey, String(value))
      }
      this.drawLines()
    }
    const savedHeight = Number(stored(inspectorHeightKey))
    if (savedHeight > 0) {
      this.inspector.style.height = `${savedHeight}px`
      this.inspector.style.maxHeight = 'none'
    }
    split.addEventListener('pointerdown', (ev) => {
      if (dock.classList.contains('collapsed')) return
      ev.preventDefault()
      split.setPointerCapture(ev.pointerId)
      const startY = ev.clientY
      const startH = this.inspector.offsetHeight
      const move = (m: PointerEvent) => setHeight(startH - (m.clientY - startY))
      const up = () => {
        split.removeEventListener('pointermove', move)
        split.removeEventListener('pointerup', up)
        split.removeEventListener('pointercancel', up)
      }
      split.addEventListener('pointermove', move)
      split.addEventListener('pointerup', up)
      split.addEventListener('pointercancel', up)
    })
    split.addEventListener('dblclick', () => setHeight(undefined))
    split.addEventListener('keydown', (ev) => {
      const d = ev.key === 'ArrowUp' ? 20 : ev.key === 'ArrowDown' ? -20 : 0
      if (!d) return
      ev.preventDefault()
      setHeight(this.inspector.offsetHeight + d)
    })
    this.tree = this.shell.querySelector('.vo-tree')!
    this.tabs = this.shell.querySelector('.vo-tabs')!
    this.wsBox = this.shell.querySelector('.vo-ws')!
    this.wsBox.addEventListener('click', (ev) => void this.onWorkspaceClick(ev))
    this.editor = new JavaEditor(
      this.shell.querySelector('.vo-editor')!,
      {
        onChange: () => this.typed(),
        onCaret: () => this.caretMoved(),
        onUndo: (redo) => this.undo(redo),
        words: () => ({
          condition: t('canvas_stub_condition'),
          selector: t('web_live_ph_selector'),
          code: t('web_live_ph_code'),
          start: t('inspector_for_init'),
          step: t('inspector_for_step'),
          branch: t('element_verzweigung'),
          branchElse: t('element_verzweigung'),
          switchCase: t('element_fallauswahl'),
          forLoop: t('element_forSchleife'),
          whileLoop: t('element_whileSchleife'),
          doLoop: t('element_doUntilSchleife'),
          output: t('inspector_io_mode_output'),
          input: t('inspector_io_mode_input'),
        }),
        breakpointLine: () => undefined,
        onBreakpoints: () => undefined,
        ownTypes: (pos) => this.ownTypesAt(pos),
      },
      t('web_visuobject_code'),
    )
    const on = (action: string, run: () => void) => this.shell.querySelector(`[data-action=${action}]`)!.addEventListener('click', run)
    on('new', () => void this.newProject({ name: t('web_visuobject_project_name'), files: [], packages: [] }))
    on('example', () => void this.newProject(exampleProject(), 'tiere/Tier.java'))
    on('open', () => this.openFiles())
    on('save', () => void this.save())
    on('undo', () => this.undo(false))
    on('redo', () => this.undo(true))
    const newButton = this.shell.querySelector<HTMLButtonElement>('[data-action=new-menu]')!
    const newMenu = this.shell.querySelector<HTMLElement>('.vo-new-menu')!
    const showNewMenu = (show: boolean) => {
      newMenu.hidden = !show
      newButton.setAttribute('aria-expanded', String(show))
      if (show) newMenu.querySelector<HTMLElement>('button')?.focus()
    }
    newButton.addEventListener('click', () => showNewMenu(newMenu.hidden))
    newMenu.addEventListener('click', (ev) => {
      const kind = (ev.target as HTMLElement).closest<HTMLElement>('[data-new]')?.dataset.new as NewKind | undefined
      if (!kind) return
      showNewMenu(false)
      void this.newFromWizard(kind)
    })
    newMenu.addEventListener('keydown', (ev) => {
      const items = [...newMenu.querySelectorAll<HTMLElement>('button')]
      const i = items.indexOf(document.activeElement as HTMLElement)
      if (ev.key === 'Escape') {
        showNewMenu(false)
        newButton.focus()
      } else if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
        ev.preventDefault()
        items[(i + (ev.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length]?.focus()
      }
    })
    document.addEventListener('pointerdown', (ev) => {
      if (!newMenu.hidden && !(ev.target as HTMLElement).closest('.vo-new')) showNewMenu(false)
    })
    on('layout', () => {
      this.positions.clear()
      this.savePositions()
      this.render()
    })
    const settings = this.shell.querySelector<HTMLButtonElement>('[data-action=settings]')!
    const menu = this.shell.querySelector<HTMLElement>('.settings-menu')!
    settings.addEventListener('click', () => {
      menu.hidden = !menu.hidden
      settings.setAttribute('aria-expanded', String(!menu.hidden))
    })
    document.addEventListener('pointerdown', (ev) => {
      if (!menu.hidden && !(ev.target as HTMLElement).closest('.settings')) menu.hidden = true
    })
    for (const b of menu.querySelectorAll<HTMLButtonElement>('[data-world]')) b.addEventListener('click', () => this.chooseWorld(b.dataset.world as WorldChoice))
    this.canvas.addEventListener('pointerdown', (ev) => this.onPointerDown(ev))
    this.canvas.addEventListener('click', (ev) => this.onClick(ev))
    this.canvas.addEventListener('contextmenu', (ev) => {
      const el = (ev.target as Element).closest<SVGElement>('[data-end]')
      if (!el) return
      ev.preventDefault()
      if (this.relSelection !== el.dataset.rel) this.selectRelation(el.dataset.rel!)
      this.openEnd(el.dataset.rel!, el.dataset.end as 'a' | 'b', ev)
    })
    this.tree.addEventListener('click', (ev) => this.onTreeClick(ev))
    this.tabs.addEventListener('click', (ev) => this.onTabClick(ev))
    for (const b of this.shell.querySelectorAll<HTMLButtonElement>('.vo-tool')) b.addEventListener('pointerdown', (ev) => this.onToolDown(ev, b.dataset.tool as Tool))
    this.tree.addEventListener('keydown', (ev) => this.onTreeKey(ev))
  }

  private chooseWorld(world: WorldChoice) {
    if (world === 'object') return
    setVisuBotMode(world)
    location.href = `${location.pathname}?${world === 'on' ? 'visubot' : 'visustruct'}${location.hash}`
  }

  // MARK: - Projekt und Code

  private get activeFile() {
    return this.project.files.find((f) => f.path === this.active)
  }

  /** Geöffnete Datei in den Editor. */
  private showActive() {
    const file = this.activeFile
    this.editor.setText(file?.text ?? '')
    this.editor.setReadOnly(!file)
    if (file && !this.openTabs.includes(file.path)) this.openTabs.push(file.path)
    this.renderTabs()
    store(activeKey, this.active ?? '')
  }

  /** Reiter wie in WebGoatCode: eine pro offener Datei, × schließt sie. */
  private renderTabs() {
    this.openTabs = this.openTabs.filter((p) => this.project.files.some((f) => f.path === p))
    store(tabsKey, JSON.stringify(this.openTabs))
    if (this.openTabs.length === 0) {
      this.tabs.innerHTML = `<span class="vo-no-file">${e(t('web_visuobject_no_file'))}</span>`
      return
    }
    this.tabs.innerHTML = this.openTabs
      .map((path) => {
        const on = path === this.active
        // Wie in VS Code: ● statt ×, solange die Datei nicht gespeichert ist.
        const dirty = this.isDirty(path)
        return `<div class="vo-tab${on ? ' active' : ''}" data-tab="${e(path)}">
          <button role="tab" aria-selected="${on}" tabindex="${on ? 0 : -1}" data-tip="${e(diskPath(path))}">${e(fileNameOf(path))}</button>
          <button class="vo-tab-close${dirty ? ' unsaved' : ''}" data-close aria-label="${e(t('web_visuobject_close_tab', fileNameOf(path)) + (dirty ? `, ${t('web_visuobject_unsaved')}` : ''))}" tabindex="-1"><span class="vo-x">×</span><span class="vo-dot" aria-hidden="true">●</span></button>
        </div>`
      })
      .join('')
  }

  private onTabClick(ev: MouseEvent) {
    const target = ev.target as HTMLElement
    const path = target.closest<HTMLElement>('[data-tab]')?.dataset.tab
    if (!path) return
    if (target.closest('[data-close]')) return this.closeTab(path)
    this.treeSelection = `file:${path}`
    this.openFile(path)
  }

  private closeTab(path: string) {
    const i = this.openTabs.indexOf(path)
    if (i < 0) return
    this.openTabs.splice(i, 1)
    if (path === this.active) {
      this.active = this.openTabs[Math.min(i, this.openTabs.length - 1)]
      this.lastTyping = 0
      this.showActive()
      this.refresh()
    } else this.renderTabs()
  }

  private snapshot(): string {
    return JSON.stringify({ project: this.project, active: this.active })
  }

  private remember() {
    this.history.push(this.snapshot())
    if (this.history.length > maxUndoSteps) this.history.shift()
    this.future = []
  }

  /** Projekt von außen ändern (Diagramm, Explorer, Neu, Beispiel, Öffnen): mit Rückgängig. */
  private setProject(next: JavaProject, active = this.active) {
    this.remember()
    this.lastTyping = 0
    this.project = next
    this.active = next.files.some((f) => f.path === active) ? active : next.files[0]?.path
    this.showActive()
    this.refresh()
  }

  private openFile(path: string) {
    if (path === this.active) return
    this.active = path
    this.lastTyping = 0
    this.showActive()
    const pkg = packageOf(path)
    this.currentPackage = pkg
    this.open.set(`pkg:${pkg}`, true)
    this.refresh()
  }

  private typed() {
    const file = this.activeFile
    if (!file) return
    // Schnelles Tippen zählt als ein Schritt für Rückgängig.
    const now = Date.now()
    if (now - this.lastTyping > 1500) this.remember()
    this.lastTyping = now
    this.project = updateFile(this.project, file.path, this.editor.text)
    this.refresh()
    // Klasse im Code umbenannt: kurz nach dem Tippen heißen Reiter und Datei mit (wie in Eclipse beim Speichern).
    clearTimeout(this.renameTimer)
    this.renameTimer = window.setTimeout(() => this.syncFileName(), 700)
  }

  private renameTimer?: number

  /** Heißt die Datei wie keine ihrer Klassen mehr, bekommt sie den Namen der (ersten öffentlichen) Klasse. */
  private syncFileName() {
    const file = this.activeFile
    if (!file || this.editing) return
    const old = fileNameOf(file.path).replace(/\.java$/i, '')
    const inFile = this.classes.filter((c) => c.path === file.path)
    if (inFile.length === 0 || inFile.some((c) => c.name === old)) return
    const name = (/\bpublic\s+(?:abstract\s+|final\s+)*(?:class|interface|enum)\s+(\w+)/.exec(file.text)?.[1] ?? inFile[0].name)
    if (!identifier.test(name) || inFile.filter((c) => c.name === name).length !== 1) return
    const to = pathFor(packageOf(file.path), `${name}.java`)
    if (this.project.files.some((f) => f.path === to)) return
    let next = moveFile(this.project, file.path, to)
    // Platz im Diagramm und UML-Zusätze gehören jetzt zum neuen Namen.
    const p = this.positions.get(old)
    if (p && !this.positions.has(name)) this.positions.set(name, p)
    for (const key of Object.keys(next.uml ?? {})) if (key.startsWith(`${old}.`)) next = { ...next, uml: renameInfo(next.uml!, key, name + key.slice(old.length)) }
    this.openTabs = this.openTabs.map((t) => (t === file.path ? to : t))
    if (this.treeSelection === `file:${file.path}`) this.treeSelection = `file:${to}`
    if (this.isOpen(`file:${file.path}`)) this.open.set(`file:${to}`, true)
    this.project = next
    this.active = to
    store(activeKey, to)
    this.savePositions()
    this.refresh()
  }

  private undo(redo: boolean) {
    const from = redo ? this.future : this.history
    const to = redo ? this.history : this.future
    const snap = from.pop()
    if (snap === undefined) return
    to.push(this.snapshot())
    const data = JSON.parse(snap) as { project: JavaProject; active?: string }
    this.project = data.project
    this.active = data.active
    this.lastTyping = 0
    this.showActive()
    this.refresh()
  }

  private refresh() {
    store(projectKey, projectToJSON(this.project))
    this.renderTabs()
    this.classes = projectClasses(this.project)
    if (this.selection && !this.findClass(this.selection.cls)) this.selection = undefined
    if (this.relSelection && !this.findRelation(this.relSelection) && !this.findDependency(this.relSelection)) this.relSelection = undefined
    if (!this.editing) {
      this.render()
      this.renderTree()
    }
  }

  /** Eigene Klassen für Vorschläge nach dem Punkt; die offene Datei frisch aus dem Editor gelesen. */
  private ownTypesAt(pos: number): OwnTypes | undefined {
    const file = this.activeFile
    if (!file) return undefined
    const text = this.editor.view.state.doc.toString()
    const pkg = barePackage(packageOf(file.path))
    const mine = parseClasses(text).map((c) => ({ ...c, pkg }))
    const names = new Set(mine.map((c) => c.name))
    const here = mine.find((c) => c.headerFrom <= pos && pos <= c.bodyEnd)
    const lang = currentLanguage() === 'de' ? 'de' : currentLanguage() === 'pt-PT' ? 'pt' : 'en'
    return ownTypes([...mine, ...this.classes.filter((c) => c.path !== file.path && !names.has(c.name))], { cls: here?.name, pkg }, lang)
  }

  private findClass(name: string): ProjectClass | undefined {
    return this.classes.find((c) => c.name === name)
  }

  /** Cursor im Code: passende Klasse bzw. passendes Mitglied im Diagramm markieren. */
  private caretMoved() {
    const pos = this.editor.caret
    const cls = this.classes.find((c) => c.path === this.active && pos >= c.from && pos <= c.to)
    const member = cls?.members.findIndex((m) => pos >= m.from && pos <= m.to)
    const next = cls ? { cls: cls.name, member: member !== undefined && member >= 0 ? member : undefined } : undefined
    if (next?.cls === this.selection?.cls && next?.member === this.selection?.member) return
    this.selection = next
    if (!this.editing) {
      this.render()
      this.renderTree()
    }
  }

  /** Klasse bzw. Mitglied im Code zeigen: Datei öffnen und markieren. */
  private showInCode(cls: ProjectClass, member?: UmlMember) {
    if (cls.path !== this.active) {
      this.active = cls.path
      this.lastTyping = 0
      this.showActive()
    }
    const view = this.editor.view
    const [from, to] = member ? [member.headerFrom, member.headerTo] : [cls.nameFrom, cls.nameTo]
    const end = Math.min(to, view.state.doc.length)
    view.dispatch({ selection: { anchor: Math.min(from, end), head: end }, scrollIntoView: true })
  }

  /** Meldung unter dem Diagramm: rot bei Fehlern, grau bei Hinweisen. */
  private message(text: string, hint = false) {
    this.status.textContent = text
    this.status.classList.toggle('hint', hint)
  }

  // MARK: - Datei

  private openFiles() {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '.zip,.java,.visuobject,application/zip,text/plain'
    input.addEventListener('change', () => void this.readFiles([...(input.files ?? [])]))
    input.click()
  }

  private async readFiles(files: File[]) {
    if (files.length === 0) return
    try {
      const zip = files.find((f) => /\.zip$/i.test(f.name))
      if (zip) {
        const { projectFromZip } = await import('./projectZip')
        const project = projectFromZip(new Uint8Array(await zip.arrayBuffer()), zip.name.replace(/\.zip$/i, ''))
        await this.newProject(project)
        return
      }
      const saved = files.find((f) => /\.visuobject$/i.test(f.name))
      if (saved) {
        const project = projectFromJSON(await saved.text())
        if (!project) throw new Error('format')
        await this.newProject(project)
        return
      }
      // Einzelne .java-Dateien kommen ins aktuelle Projekt (Package aus der `package`-Zeile).
      const added = projectFromFiles(this.project.name, await Promise.all(files.map(async (f) => ({ name: f.name, text: await f.text() }))))
      let next = this.project
      for (const f of added.files) next = addFile(next, f.path, f.text)
      this.setProject(next, added.files[0]?.path)
    } catch {
      this.message(t('web_visuobject_open_failed'))
    }
  }

  /** In den Workspace, ohne ihn als ZIP. */
  private async save() {
    if (this.workspace) await this.writeCurrent()
    else await this.downloadZip()
  }

  /** Als ZIP wie in Eclipse oder BlueJ: `Projekt/src/paket/Klasse.java`. */
  private async downloadZip() {
    const { projectToZip } = await import('./projectZip')
    const data = projectToZip(this.project)
    download(`${this.project.name || 'Projekt'}.zip`, data.slice().buffer, 'application/zip')
  }

  // MARK: - Workspace

  /** Ungespeichert: das ganze Projekt oder eine Datei (nur mit Workspace). */
  private isDirty(path?: string): boolean {
    if (!this.workspace || this.saved === undefined) return false
    if (path === undefined) return this.saved !== projectToJSON(this.project)
    return this.savedFiles.get(path) !== this.project.files.find((f) => f.path === path)?.text
  }

  private markSaved() {
    this.saved = projectToJSON(this.project)
    this.savedFiles = new Map(this.project.files.map((f) => [f.path, f.text]))
  }

  /** Beim Start: gemerkten Workspace wieder öffnen; braucht der Browser einen Klick, wartet ein Knopf. */
  private async restoreWorkspace() {
    if (!canPickFolder()) return
    const folder = await storedFolder(workspaceSlot)
    if (folder?.ready) {
      const ws = await reopenFolder(folder.handle)
      if (ws) return this.useWorkspace(ws.root, true)
    }
    this.pendingFolder = folder?.handle
    this.renderWorkspace()
  }

  /** `restoring`: nach dem Neuladen; ungespeicherte Änderungen aus dem Browser bleiben dann erhalten. */
  private async useWorkspace(root: WsDir, restoring = false) {
    this.workspace = root
    this.pendingFolder = undefined
    store(noWorkspaceKey, '0')
    try {
      this.projects = await listProjects(root)
      const last = stored(wsProjectKey)
      const local = this.project
      if (restoring && last && this.projects.includes(last)) {
        const view = { active: this.active, tabs: [...this.openTabs], positions: new Map(this.positions) }
        await this.loadProject(last)
        // Nach dem Neuladen wie vorher: dieselben Reiter und Kästen.
        this.positions = view.positions
        this.savePositions()
        // Was seit dem letzten Speichern getippt wurde, steht noch im Browser (mit Workspace immer dessen Projekt).
        if (projectToJSON(local) !== this.saved) {
          this.project = local
        }
        this.openTabs = view.tabs.filter((p) => this.project.files.some((f) => f.path === p))
        this.active = this.project.files.some((f) => f.path === view.active) ? view.active : this.project.files[0]?.path
        this.showActive()
        this.refresh()
      } else if (!this.projects.some((p) => p.toLowerCase() === safeFolderName(local.name).toLowerCase()) && local.files.length) {
        // Das Projekt aus dem Browser kommt mit in den neuen Workspace.
        this.folder = safeFolderName(local.name)
        await this.writeCurrent(false)
      } else if (this.projects.length) await this.loadProject(this.projects.includes(last ?? '') ? last! : this.projects[0])
      else {
        this.folder = safeFolderName(local.name)
        await this.writeCurrent(false)
      }
    } catch (err) {
      this.message(t('web_visuobject_ws_failed', String((err as Error)?.message ?? err)))
    }
    this.renderWorkspace()
    this.refresh()
  }

  private async loadProject(name: string) {
    const { project, positions } = await readProject(this.workspace!, name)
    this.folder = name
    this.project = project
    this.markSaved()
    this.message('')
    this.history = []
    this.future = []
    this.lastTyping = 0
    this.selection = undefined
    this.relSelection = undefined
    this.treeSelection = undefined
    this.currentPackage = undefined
    this.positions = new Map(Object.entries(positions))
    this.savePositions()
    this.openTabs = []
    this.active = project.files[0]?.path
    store(wsProjectKey, name)
    this.showActive()
    this.refresh()
  }

  /** Geöffnetes Projekt in seinen Ordner schreiben; nach dem Umbenennen zieht es in den neuen Ordner. */
  private async writeCurrent(report = true): Promise<boolean> {
    const root = this.workspace
    if (!root) return false
    const target = safeFolderName(this.project.name)
    const old = this.folder
    const names = new Set(this.classes.map((c) => c.name))
    const positions: Positions = Object.fromEntries([...this.positions].filter(([n]) => names.has(n)))
    if (target !== old && this.projects.some((p) => p !== old && p.toLowerCase() === target.toLowerCase())) {
      this.message(t('web_visuobject_ws_taken', this.project.name))
      return false
    }
    try {
      await writeProject(root, target, this.project, positions)
      if (old && old !== target && this.projects.includes(old)) await root.remove(old)
      this.folder = target
      this.projects = await listProjects(root)
      store(wsProjectKey, target)
      this.markSaved()
      if (report) this.message(t('web_visuobject_ws_saved', root.name, target), true)
      this.refresh()
      return true
    } catch (err) {
      this.message(t('web_visuobject_ws_failed', String((err as Error)?.message ?? err)))
      return false
    }
  }

  /** Anderes Projekt öffnen; das geöffnete wird vorher gespeichert (wie „Save all“ in Eclipse). */
  private async switchProject(name: string) {
    if (!this.workspace || name === this.folder) return
    if (this.isDirty() && !(await this.writeCurrent(false))) return
    try {
      await this.loadProject(name)
    } catch (err) {
      this.message(t('web_visuobject_ws_failed', String((err as Error)?.message ?? err)))
    }
  }

  /** Neu, Beispiel, ZIP öffnen: im Workspace ein eigenes Projekt, sonst ersetzt es das alte (mit Rückgängig). */
  private async newProject(project: JavaProject, active?: string, named = false) {
    if (!this.workspace) {
      this.setProject(project, active ?? project.files[0]?.path)
      if (project.files.length === 0 && !named) this.editProjectName()
      return
    }
    if (this.isDirty() && !(await this.writeCurrent(false))) return
    const name = freeProjectName(safeFolderName(project.name), this.projects)
    this.project = { ...project, name }
    this.folder = name
    this.history = []
    this.future = []
    this.openTabs = []
    this.positions.clear()
    this.savePositions()
    this.active = project.files.some((f) => f.path === active) ? active : project.files[0]?.path
    this.showActive()
    this.refresh()
    if (!(await this.writeCurrent(false))) return
    this.message(t('web_visuobject_ws_created', name), true)
    if (project.files.length === 0 && !named) this.editProjectName()
  }

  // MARK: - Neu (wie in Eclipse)

  /** Source Folder und Package, in die etwas Neues kommt: das markierte, sonst das der offenen Datei. */
  private get currentPlace(): { root: string; pkg: string } {
    const key = this.currentPackage ?? (this.active ? packageOf(this.active) : (packagesOf(this.project)[0] ?? ''))
    return { root: rootOf(key), pkg: barePackage(key) }
  }

  private async newFromWizard(kind: NewKind) {
    const here = this.currentPlace
    const freeName = (base: string, taken: (n: string) => boolean) => {
      let name = base
      for (let n = 2; taken(name); n++) name = base + n
      return name
    }
    const result = await newWizard(kind, {
      roots: sourceFoldersOf(this.project),
      packagesIn: (root) => packagesOf(this.project, root).map(barePackage),
      classes: this.classes,
      root: here.root,
      pkg: here.pkg,
      suggest: (k) =>
        k === 'project'
          ? freeProjectName(t('web_visuobject_project_name'), this.workspace ? [...this.projects, this.folder ?? ''] : [])
          : k === 'folder'
            ? freeName('test', (n) => sourceFoldersOf(this.project).includes(n))
            : k === 'package'
              ? freeName(t('web_visuobject_new_package_name'), (n) => packagesOf(this.project).includes(packageKey(here.root, n)))
              : this.uniqueClassName(t(k === 'class' ? 'web_visuobject_new_class_name' : 'web_visuobject_new_interface_name')),
      check: (k, name, root, pkg) => {
        if (!name) return t('web_visuobject_new_name_missing')
        if (k === 'project') return this.workspace && this.projects.some((p) => p !== this.folder && p.toLowerCase() === safeFolderName(name).toLowerCase()) ? t('web_visuobject_ws_taken', name) : undefined
        if (k === 'folder') return !isFolderName(name) || sourceFoldersOf(this.project).includes(name) ? t('web_visuobject_bad_folder', name) : undefined
        if (k === 'package') return !isPackageName(name) || packagesOf(this.project).includes(packageKey(root, name)) ? t('web_visuobject_bad_package', name) : undefined
        if (!identifier.test(name)) return t('web_visuobject_bad_name', name)
        if (this.findClass(name) || this.project.files.some((f) => f.path === pathFor(packageKey(root, pkg), `${name}.java`))) return t('web_visuobject_new_exists', name)
        if (name.charAt(0) !== name.charAt(0).toUpperCase()) return t('web_visuobject_new_upper')
        return undefined
      },
    })
    if (!result) return
    const { name, root, pkg } = result
    if (kind === 'project') return this.newProject({ name, files: [], packages: [] }, undefined, true)
    this.message('')
    if (kind === 'folder') {
      this.currentPackage = packageKey(name, '')
      this.treeSelection = `root:${name}`
      this.open.set(`root:${name}`, true)
      return this.setProject(addSourceFolder(this.project, name))
    }
    if (kind === 'package') {
      const key = packageKey(root, name)
      this.currentPackage = key
      this.treeSelection = `pkg:${key}`
      this.open.set(`root:${root}`, true)
      return this.setProject(addPackage(this.project, key))
    }
    const key = packageKey(root, pkg)
    const path = pathFor(key, `${name}.java`)
    this.currentPackage = key
    this.selection = { cls: name }
    this.open.set(`root:${root}`, true)
    this.open.set(`pkg:${key}`, true)
    this.setProject(addFile(this.project, path, classSource(result.options!)), path)
    const cls = this.findClass(name)
    if (cls) this.showInCode(cls)
    this.canvas.querySelector<HTMLElement>(`.uml-class[data-class="${CSS.escape(name)}"]`)?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  /** Wie bei „+ Package“: Der Name des neuen Projekts ist gleich zum Überschreiben markiert. */
  private editProjectName() {
    this.treeSelection = 'project'
    this.renderTree()
    this.startEditing(this.tree.querySelector<HTMLElement>('[data-node="project"] > .vo-row .vo-label'))
  }

  private renderWorkspace() {
    const box = this.wsBox
    box.hidden = !canPickFolder()
    const save = this.shell.querySelector<HTMLElement>('[data-action=save]')!
    save.dataset.tip = t(this.workspace ? 'web_visuobject_save_ws_tip' : 'web_visuobject_save_tip')
    if (box.hidden) return
    const btn = (action: string, label: string, cls = 'text-button', tip?: string) =>
      `<button class="${cls}" data-ws="${action}"${tip ? ` data-tip="${e(tip)}"` : ''}>${e(label)}</button>`
    if (this.workspace) {
      box.className = 'vo-ws'
      box.innerHTML = `<span class="vo-ws-name" data-tip="${e(t('web_visuobject_ws_title'))}"><span class="vo-badge folder" aria-hidden="true"></span>${e(this.workspace.name)}</span>
        ${btn('zip', t('web_visuobject_ws_zip'), 'text-button', t('web_visuobject_ws_zip_tip'))}
        ${btn('switch', t('web_visuobject_ws_switch'), 'text-button')}`
    } else if (this.pendingFolder) {
      box.className = 'vo-ws'
      box.innerHTML = `${btn('reopen', t('web_visuobject_ws_reopen', this.pendingFolder.name), 'text-button primary')}${btn('switch', t('web_visuobject_ws_switch'), 'text-button')}`
    } else if (stored(noWorkspaceKey) === '1') {
      box.className = 'vo-ws'
      box.innerHTML = btn('open', t('web_visuobject_ws_choose'), 'text-button', t('web_visuobject_ws_hint'))
    } else {
      box.className = 'vo-ws ask'
      box.innerHTML = `<p><strong>${e(t('web_visuobject_ws_question'))}</strong></p>
        <p class="hint">${e(t('web_visuobject_ws_hint'))}</p>
        ${btn('create', t('web_visuobject_ws_create', workspaceFolderName), 'text-button primary')}
        ${btn('open', t('web_visuobject_ws_open'))}
        ${btn('skip', t('web_visuobject_ws_skip'))}`
    }
  }

  private async onWorkspaceClick(ev: MouseEvent) {
    const action = (ev.target as HTMLElement).closest<HTMLElement>('[data-ws]')?.dataset.ws
    if (!action) return
    if (action === 'zip') return this.downloadZip()
    if (action === 'skip') {
      store(noWorkspaceKey, '1')
      return this.renderWorkspace()
    }
    try {
      if (action === 'reopen' && this.pendingFolder) {
        const ws = await reopenFolder(this.pendingFolder)
        if (ws) await this.useWorkspace(ws.root, true)
        return
      }
      if (this.isDirty() && !(await this.writeCurrent(false))) return
      const ws = await pickFolder(action === 'create' ? workspaceFolderName : undefined, workspaceSlot)
      store(wsProjectKey, '')
      await this.useWorkspace(ws.root)
    } catch (err) {
      // Abbrechen im Ordner-Dialog ist kein Fehler.
      if ((err as DOMException)?.name !== 'AbortError') this.message(t('web_visuobject_ws_failed', String((err as Error)?.message ?? err)))
    }
  }

  // MARK: - Diagramm → Code

  /** Datei der Klasse ändern; sie wird dabei geöffnet. */
  private changeFile(path: string, run: (source: string) => string, select?: Selection) {
    const file = this.project.files.find((f) => f.path === path)
    if (!file) return
    if (select) this.selection = select
    this.message('')
    this.setProject(updateFile(this.project, path, run(file.text)), path)
  }

  private uniqueClassName(base: string): string {
    let name = base
    for (let n = 2; this.findClass(name) || this.project.files.some((f) => fileNameOf(f.path) === `${name}.java`); n++) name = base + n
    return name
  }

  private newClass(kind: 'class' | 'interface', at?: Point) {
    const name = this.uniqueClassName(t(kind === 'class' ? 'web_visuobject_new_class_name' : 'web_visuobject_new_interface_name'))
    if (at) {
      this.positions.set(name, { x: Math.max(0, Math.round(at.x)), y: Math.max(0, Math.round(at.y)) })
    }
    const pkg = this.currentPackage ?? (this.active ? packageOf(this.active) : (packagesOf(this.project)[0] ?? ''))
    const path = pathFor(pkg, `${name}.java`)
    this.selection = { cls: name }
    this.open.set(`pkg:${pkg}`, true)
    this.setProject(addFile(this.project, path, classFileText(pkg, name, kind)), path)
    this.savePositions()
    const cls = this.findClass(name)
    if (cls) this.showInCode(cls)
    const box = this.canvas.querySelector<HTMLElement>(`.uml-class[data-class="${CSS.escape(name)}"]`)
    box?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    this.startEditing(box?.querySelector<HTMLElement>('.uml-name') ?? null)
  }

  /** Klasse umbenennen; heißt die Datei wie die Klasse, heißt sie danach wie der neue Name. */
  private renameClassTo(cls: ProjectClass, name: string) {
    if (name === cls.name) return
    if (!identifier.test(name) || this.findClass(name)) return this.message(t('web_visuobject_bad_name', name))
    const file = this.project.files.find((f) => f.path === cls.path)!
    let next = updateFile(this.project, cls.path, renameClass(file.text, cls, name))
    let path = cls.path
    if (fileNameOf(cls.path) === `${cls.name}.java`) {
      path = pathFor(packageOf(cls.path), `${name}.java`)
      if (!next.files.some((f) => f.path === path)) next = moveFile(next, cls.path, path)
      else path = cls.path
    }
    const p = this.positions.get(cls.name)
    if (p) this.positions.set(name, p)
    for (const key of Object.keys(next.uml ?? {})) if (key.startsWith(`${cls.name}.`)) next = { ...next, uml: renameInfo(next.uml!, key, name + key.slice(cls.name.length)) }
    this.selection = { cls: name }
    this.message('')
    this.setProject(next, path)
  }

  /** Klasse löschen; bleibt in der Datei keine Klasse übrig, verschwindet die Datei. */
  private deleteClassFromProject(cls: ProjectClass) {
    const file = this.project.files.find((f) => f.path === cls.path)!
    const text = deleteClass(file.text, cls)
    const empty = parseClasses(text).length === 0
    this.selection = undefined
    this.message('')
    this.setProject(empty ? removeFile(this.project, cls.path) : updateFile(this.project, cls.path, text))
  }

  /** Eingabe im Diagramm oder Explorer übernehmen. `target` sagt, was bearbeitet wurde. */
  private commit(target: HTMLElement, value: string) {
    const text = value.trim()
    const node = target.closest<HTMLElement>('[data-node]')?.dataset.node
    if (node) return this.commitTree(node, text)
    const box = target.closest<HTMLElement>('.uml-class')
    const cls = box && this.findClass(box.dataset.class!)
    if (!cls) return
    if (target.classList.contains('uml-name')) return this.renameClassTo(cls, text)
    const add = target.dataset.add
    if (add) {
      if (!text) return
      const line = parseUmlLine(text)
      if (!line) return this.message(t('web_visuobject_bad_line', text))
      // „+ Attribut“ ohne Klammern bleibt ein Attribut, „+ Methode“ ohne Klammern wird eine Methode.
      const typed = add === 'method' && line.kind === 'field' ? `${text}()` : text
      this.changeFile(cls.path, (s) => addMember(s, cls, typed), { cls: cls.name })
      return
    }
    const index = Number(target.dataset.member)
    const member = cls.members[index]
    if (!member) return
    if (!text) {
      this.changeFile(cls.path, (s) => deleteMember(s, member), { cls: cls.name })
      return
    }
    if (text === umlText(member)) return
    const line = parseUmlLine(text)
    if (!line) return this.message(t('web_visuobject_bad_line', text))
    if (member.kind === 'field' && line.kind === 'field' && line.name !== member.name && this.project.uml?.[relationKey(cls.name, member.name)]) {
      const file = this.project.files.find((f) => f.path === cls.path)!
      this.selection = { cls: cls.name, member: index }
      this.setProject({ ...updateFile(this.project, cls.path, replaceMember(file.text, cls, member, text)), uml: renameInfo(this.project.uml!, relationKey(cls.name, member.name), relationKey(cls.name, line.name)) }, cls.path)
      return
    }
    this.changeFile(cls.path, (s) => replaceMember(s, cls, member, text), { cls: cls.name, member: index })
  }

  private commitTree(node: NodeId, text: string) {
    const [kind, ...rest] = node.split(':')
    const id = rest.join(':')
    if (kind === 'project') {
      if (!text || text === this.project.name) return
      const taken = this.projects.some((p) => p !== this.folder && p.toLowerCase() === safeFolderName(text).toLowerCase())
      if (taken) return this.message(t('web_visuobject_ws_taken', text))
      this.setProject({ ...this.project, name: text })
    } else if (kind === 'root') {
      if (!text || text === id || id === defaultRoot) return
      if (!isFolderName(text) || sourceFoldersOf(this.project).includes(text)) return this.message(t('web_visuobject_bad_folder', text))
      if (this.currentPackage && rootOf(this.currentPackage) === id) this.currentPackage = packageKey(text, barePackage(this.currentPackage))
      this.treeSelection = `root:${text}`
      const moved = (p?: string) => (p && rootOf(p) === id ? `${text}:${p.slice(id.length + 1)}` : p)
      this.openTabs = this.openTabs.map((p) => moved(p)!)
      this.setProject(renameSourceFolder(this.project, id, text), moved(this.active))
    } else if (kind === 'pkg') {
      const to = packageKey(rootOf(id), text)
      if (!text || to === id) return
      if (!isPackageName(text) || packagesOf(this.project).includes(to)) return this.message(t('web_visuobject_bad_package', text))
      if (this.currentPackage === id) this.currentPackage = to
      this.treeSelection = `pkg:${to}`
      this.open.set(`pkg:${to}`, true)
      this.setProject(renamePackage(this.project, id, to), this.active && packageOf(this.active) === id ? pathFor(to, fileNameOf(this.active)) : this.active)
    } else if (kind === 'file') {
      const name = text.replace(/\.java$/i, '')
      const cls = this.classes.find((c) => c.path === id && `${c.name}.java` === fileNameOf(id))
      if (cls) return this.renameClassTo(cls, name)
      if (!identifier.test(name)) return this.message(t('web_visuobject_bad_name', name))
      const to = pathFor(packageOf(id), `${name}.java`)
      if (to !== id && !this.project.files.some((f) => f.path === to)) this.setProject(moveFile(this.project, id, to), to)
    } else if (kind === 'class') {
      const cls = this.findClass(id)
      if (cls) this.renameClassTo(cls, text)
    }
  }

  private startEditing(target: HTMLElement | null) {
    if (!target || this.editing) return
    const isName = target.classList.contains('uml-name') || target.classList.contains('vo-label')
    const input = document.createElement('input')
    input.className = 'uml-input'
    input.spellcheck = false
    input.autocapitalize = 'off'
    input.setAttribute('autocomplete', 'off')
    input.setAttribute('aria-label', t(isName ? 'web_visuobject_name_label' : 'web_visuobject_member_label'))
    if (target.dataset.add) input.placeholder = t(target.dataset.add === 'field' ? 'web_visuobject_field_ph' : 'web_visuobject_method_ph')
    input.value = target.dataset.add ? '' : (target.dataset.value ?? target.textContent ?? '')
    input.size = Math.max(input.value.length, input.placeholder.length, 8)
    target.replaceChildren(input)
    this.editing = true
    let done = false
    const finish = (keep: boolean) => {
      if (done) return
      done = true
      this.editing = false
      if (keep) this.commit(target, input.value)
      this.render()
      this.renderTree()
    }
    input.addEventListener('keydown', (ev) => {
      ev.stopPropagation()
      if (ev.key === 'Enter') finish(true)
      else if (ev.key === 'Escape') finish(false)
    })
    input.addEventListener('click', (ev) => ev.stopPropagation())
    input.addEventListener('input', () => (input.size = Math.max(input.value.length, input.placeholder.length, 8)))
    input.addEventListener('blur', () => finish(true))
    input.focus()
    input.select()
  }

  private onKey(ev: KeyboardEvent) {
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 's') {
      ev.preventDefault()
      void this.save()
      return
    }
    if (ev.key === 'Escape' && this.endPop) {
      this.closeEnd()
      return
    }
    if (ev.key === 'Escape' && this.tool !== 'select') {
      this.setTool('select')
      return
    }
    if (this.editing || this.editor.hasFocus) return
    const target = ev.target as HTMLElement
    if (target.closest('input, select, textarea, .vo-tree')) return
    const mod = ev.metaKey || ev.ctrlKey
    if (mod && ev.key.toLowerCase() === 'z') {
      ev.preventDefault()
      this.undo(ev.shiftKey)
      return
    }
    if (!this.canvas.contains(document.activeElement) && document.activeElement !== document.body) return
    if (this.relSelection && (ev.key === 'Delete' || ev.key === 'Backspace')) {
      ev.preventDefault()
      this.deleteRelation(this.relSelection)
      return
    }
    const sel = this.selection
    const cls = sel && this.findClass(sel.cls)
    if (!cls) return
    if (ev.key === 'Delete' || ev.key === 'Backspace') {
      ev.preventDefault()
      const member = sel.member !== undefined ? cls.members[sel.member] : undefined
      if (member) this.changeFile(cls.path, (s) => deleteMember(s, member), { cls: cls.name })
      else this.deleteClassFromProject(cls)
    } else if (ev.key === 'Enter' || ev.key === 'F2') {
      ev.preventDefault()
      const box = this.canvas.querySelector(`.uml-class[data-class="${CSS.escape(cls.name)}"]`)
      this.startEditing(box?.querySelector<HTMLElement>(sel.member !== undefined ? `[data-member="${sel.member}"]` : '.uml-name') ?? null)
    }
  }

  // MARK: - Package Explorer

  private isOpen(id: NodeId): boolean {
    // Projekt, src, Packages und Klassen offen; Dateien zu, außer der geöffneten. Andere Projekte öffnet erst ein Klick.
    if (id.startsWith('wsproject:')) return false
    const value = this.open.get(id)
    if (value !== undefined) return value
    if (id.startsWith('file:')) return id === `file:${this.active}`
    return true
  }

  private toggle(id: NodeId) {
    this.open.set(id, !this.isOpen(id))
    store(treeKey, JSON.stringify(Object.fromEntries(this.open)))
    this.renderTree()
  }

  private renderTree() {
    const focused = (document.activeElement as HTMLElement | null)?.closest<HTMLElement>('[data-node]')?.dataset.node
    const sel = this.treeSelection ?? (this.selection ? `class:${this.selection.cls}` : this.active ? `file:${this.active}` : undefined)
    const row = (id: NodeId, depth: number, badge: string, label: string, opts: { children?: string; value?: string; extra?: string; title?: string; action?: boolean } = {}) => {
      const hasChildren = opts.children !== undefined
      const isOpen = hasChildren && this.isOpen(id)
      const selected = id === sel
      return `<li role="treeitem" data-node="${e(id)}"${hasChildren ? ` aria-expanded="${isOpen}"` : ''} aria-selected="${selected}">
        <div class="vo-row${selected ? ' selected' : ''}${id === `file:${this.active}` ? ' active' : ''}" style="--depth:${depth}" tabindex="${selected ? 0 : -1}"${opts.title ? ` title="${e(opts.title)}"` : ''}>
          ${hasChildren ? `<button class="vo-twisty" data-toggle tabindex="-1" aria-label="${e(t(isOpen ? 'web_visuobject_collapse' : 'web_visuobject_expand'))}">${chevron}</button>` : '<span class="vo-twisty-space"></span>'}
          ${badge}<span class="vo-label" data-value="${e(opts.value ?? label)}">${e(label)}</span>${opts.extra ?? ''}
          ${opts.action ? `<button class="icon vo-row-delete" data-delete tabindex="-1" aria-label="${e(t('web_visuobject_delete'))}" data-tip="${e(t('web_visuobject_delete'))}">${icons.trash}</button>` : ''}
        </div>
        ${isOpen && opts.children ? `<ul role="group">${opts.children}</ul>` : ''}
      </li>`
    }
    const memberRow = (cls: ProjectClass, m: UmlMember, i: number, depth: number) => {
      const vis = { '+': 'public', '-': 'private', '#': 'protected', '~': 'package' }[m.visibility]
      const params = m.params.map((p) => p.type).join(', ')
      const label = m.kind === 'field' ? m.name : `${m.name}(${params})`
      const type = m.kind === 'constructor' ? '' : `<span class="vo-type">: ${e(m.type)}</span>`
      return row(`member:${cls.name}:${i}`, depth, `<span class="vo-badge ${m.kind === 'field' ? 'field' : 'method'} ${vis}${m.isStatic ? ' static' : ''}" aria-hidden="true"></span>`, label, { extra: type, title: umlText(m) })
    }
    const classRow = (cls: ProjectClass, depth: number) => {
      const letter = cls.kind === 'interface' ? 'I' : cls.isAbstract ? 'A' : 'C'
      const members = cls.members.map((m, i) => memberRow(cls, m, i, depth + 1)).join('')
      return row(`class:${cls.name}`, depth, `<span class="vo-badge type ${cls.kind}${cls.isAbstract ? ' abstract' : ''}" aria-hidden="true">${letter}</span>`, cls.name, { children: members })
    }
    const fileRow = (path: string, depth: number) => {
      const inFile = this.classes.filter((c) => c.path === path)
      return row(`file:${path}`, depth, '<span class="vo-badge file" aria-hidden="true">J</span>', fileNameOf(path), { children: inFile.map((c) => classRow(c, depth + 1)).join(''), action: true })
    }
    const packagesIn = (root: string) =>
      packagesOf(this.project, root)
        .map((pkg) => {
          const files = filesIn(this.project, pkg).map((f) => fileRow(f.path, 3)).join('')
          const bare = barePackage(pkg)
          const label = bare || t('web_visuobject_default_package')
          return row(`pkg:${pkg}`, 2, `<span class="vo-badge package${files ? '' : ' empty'}" aria-hidden="true"></span>`, label, { children: files, value: bare, action: true })
        })
        .join('')
    // Source Folders wie in Eclipse: `src`, dazu z. B. `test`.
    const src = sourceFoldersOf(this.project)
      .map((root) =>
        row(`root:${root}`, 1, '<span class="vo-badge folder source" aria-hidden="true"></span>', root, {
          children: packagesIn(root) || `<li class="vo-tree-empty">${e(t('web_visuobject_tree_empty'))}</li>`,
          action: root !== defaultRoot,
        }),
      )
      .join('')
    const current = row('project', 0, '<span class="vo-badge project" aria-hidden="true"></span>', this.project.name, { children: src, extra: this.isDirty() ? `<span class="vo-dirty" aria-label="${e(t('web_visuobject_unsaved'))}"> ●</span>` : '' })
    // Im Workspace stehen alle Projekte untereinander wie in Eclipse; nur das geöffnete klappt auf.
    const others = this.workspace ? this.projects.filter((p) => p !== this.folder) : []
    const all = [...others.map((name) => ({ name, html: row(`wsproject:${name}`, 0, '<span class="vo-badge project closed" aria-hidden="true"></span>', name, { children: '', title: t('web_visuobject_ws_open_project', name) }) })), { name: this.folder ?? this.project.name, html: current }]
    all.sort((a, b) => a.name.localeCompare(b.name))
    this.tree.innerHTML = `<ul role="group">${all.map((x) => x.html).join('')}</ul>`
    if (!this.tree.querySelector('[tabindex="0"]')) this.tree.querySelector<HTMLElement>('.vo-row')?.setAttribute('tabindex', '0')
    if (focused) this.tree.querySelector<HTMLElement>(`[data-node="${CSS.escape(focused)}"] > .vo-row`)?.focus({ preventScroll: true })
  }

  private treeClick = { node: '', time: 0 }

  private onTreeClick(ev: MouseEvent) {
    if (this.editing) return
    const target = ev.target as HTMLElement
    const item = target.closest<HTMLElement>('[data-node]')
    const id = item?.dataset.node
    if (!item || !id) return
    if (target.closest('[data-toggle]')) return id.startsWith('wsproject:') ? void this.switchProject(id.slice(10)) : this.toggle(id)
    if (target.closest('[data-delete]')) return this.deleteNode(id)
    // Doppelklick selbst erkennen (der erste Klick zeichnet neu): Name ändern.
    const now = Date.now()
    const twice = this.treeClick.node === id && now - this.treeClick.time < 450
    this.treeClick = { node: id, time: twice ? 0 : now }
    if (twice && !id.startsWith('member:') && !id.startsWith('wsproject:') && id !== `root:${defaultRoot}`) {
      this.startEditing(this.tree.querySelector<HTMLElement>(`[data-node="${CSS.escape(id)}"] > .vo-row .vo-label`))
      return
    }
    this.selectNode(id)
  }

  private selectNode(id: NodeId) {
    const [kind, ...rest] = id.split(':')
    const value = rest.join(':')
    this.treeSelection = undefined
    if (kind === 'wsproject') return void this.switchProject(value)
    if (kind === 'pkg') {
      this.currentPackage = value
      this.treeSelection = id
    } else if (kind === 'file') {
      this.currentPackage = packageOf(value)
      this.treeSelection = id
      this.openFile(value)
    } else if (kind === 'class' || kind === 'member') {
      const [name, index] = value.split(':')
      const cls = this.findClass(name)
      if (!cls) return
      const member = index !== undefined ? cls.members[Number(index)] : undefined
      this.selection = { cls: cls.name, member: index !== undefined ? Number(index) : undefined }
      this.currentPackage = packageOf(cls.path)
      this.showInCode(cls, member)
      if (index !== undefined) this.treeSelection = id
    } else {
      this.treeSelection = id
    }
    this.render()
    this.renderTree()
  }

  private deleteNode(id: NodeId) {
    const [kind, ...rest] = id.split(':')
    const value = rest.join(':')
    this.treeSelection = undefined
    if (kind === 'file') this.setProject(removeFile(this.project, value))
    else if (kind === 'root') {
      if (this.currentPackage && rootOf(this.currentPackage) === value) this.currentPackage = undefined
      this.setProject(removeSourceFolder(this.project, value))
    }
    else if (kind === 'pkg') {
      if (this.currentPackage === value) this.currentPackage = undefined
      this.setProject(removePackage(this.project, value))
    }
  }

  /** Pfeiltasten wie in einem Dateibaum: hoch/runter, rechts öffnet, links schließt, Eingabe wählt. */
  private onTreeKey(ev: KeyboardEvent) {
    if (this.editing) return
    const rows = [...this.tree.querySelectorAll<HTMLElement>('.vo-row')]
    const current = (document.activeElement as HTMLElement | null)?.closest<HTMLElement>('.vo-row')
    const index = current ? rows.indexOf(current) : -1
    const id = current?.closest<HTMLElement>('[data-node]')?.dataset.node
    const focus = (i: number) => {
      const next = rows[Math.max(0, Math.min(rows.length - 1, i))]
      for (const r of rows) r.tabIndex = -1
      next.tabIndex = 0
      next.focus()
    }
    if (ev.key === 'ArrowDown') focus(index + 1)
    else if (ev.key === 'ArrowUp') focus(index - 1)
    else if (id && ev.key === 'ArrowRight' && current?.querySelector('[data-toggle]') && !this.isOpen(id)) this.toggle(id)
    else if (id && ev.key === 'ArrowLeft' && current?.querySelector('[data-toggle]') && this.isOpen(id)) this.toggle(id)
    else if (id && ev.key === 'Enter') this.selectNode(id)
    else if (id && ev.key === 'F2') this.startEditing(current!.querySelector<HTMLElement>('.vo-label'))
    else if (id && (ev.key === 'Delete' || ev.key === 'Backspace') && current?.querySelector('[data-delete]')) this.deleteNode(id)
    else return
    ev.preventDefault()
  }

  // MARK: - Maus im Diagramm

  private drag?: { name: string; box: HTMLElement; start: Point; origin: Point; moved: boolean }

  private onPointerDown(ev: PointerEvent) {
    this.closeEnd()
    const target = ev.target as HTMLElement
    if (this.tool !== 'select' && ev.button === 0 && !target.closest('.vo-dock, .vo-relmenu, input, select, button:not(.uml-connect)')) {
      this.suppressClick = true
      return this.useTool(ev)
    }
    const handle = target.closest<HTMLElement>('[data-connect]')
    if (handle && ev.button === 0) return this.startConnect(ev, handle.closest<HTMLElement>('.uml-class')!.dataset.class!)
    if (target.closest('input, select, button, label')) return
    const box = target.closest<HTMLElement>('.uml-class')
    if (!box || ev.button !== 0) return
    const origin = this.positions.get(box.dataset.class!) ?? { x: box.offsetLeft, y: box.offsetTop }
    this.drag = { name: box.dataset.class!, box, start: { x: ev.clientX, y: ev.clientY }, origin, moved: false }
    const move = (m: PointerEvent) => {
      const d = this.drag
      if (!d) return
      const dx = m.clientX - d.start.x
      const dy = m.clientY - d.start.y
      if (!d.moved && Math.hypot(dx, dy) < 4) return
      d.moved = true
      const p = { x: Math.max(0, Math.round(d.origin.x + dx)), y: Math.max(0, Math.round(d.origin.y + dy)) }
      this.positions.set(d.name, p)
      d.box.style.left = `${p.x}px`
      d.box.style.top = `${p.y}px`
      this.drawLines()
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      if (this.drag?.moved) this.savePositions()
      // Klick nach dem Ziehen nicht als Auswahl werten.
      setTimeout(() => (this.drag = undefined), 0)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  private lastClick = { spot: '', time: 0 }

  private onClick(ev: MouseEvent) {
    if (this.suppressClick) {
      this.suppressClick = false
      return
    }
    if (this.drag?.moved || this.editing) return
    const target = ev.target as HTMLElement
    if (target.closest('input, select, label')) return
    const action = target.closest<HTMLElement>('[data-class-action]')
    const box = target.closest<HTMLElement>('.uml-class')
    const cls = box && this.findClass(box.dataset.class!)
    if (action && cls) {
      if (action.dataset.classAction === 'delete') this.deleteClassFromProject(cls)
      return
    }
    const add = target.closest<HTMLElement>('[data-add]')
    if (add) {
      this.startEditing(add)
      return
    }
    const rel = target.closest<SVGElement>('[data-rel]')?.dataset.rel
    const endEl = target.closest<SVGElement>('[data-end]')
    if (rel && !cls && endEl && this.relSelection === rel) {
      this.openEnd(rel, endEl.dataset.end as 'a' | 'b', ev, endEl.dataset.part as 'role' | 'mult' | undefined)
      return
    }
    if (rel && !cls) {
      this.selectRelation(rel)
      return
    }
    if (!cls) {
      this.relSelection = undefined
      this.selection = undefined
      this.render()
      this.renderTree()
      return
    }
    const row = target.closest<HTMLElement>('[data-member]')
    const index = row ? Number(row.dataset.member) : undefined
    // Doppelklick selbst erkennen: Der erste Klick zeichnet neu, dann meldet der Browser kein `dblclick`.
    const spot = `${cls.name}|${index ?? (target.closest('.uml-name') ? 'name' : '')}`
    const now = Date.now()
    const twice = spot === this.lastClick.spot && now - this.lastClick.time < 450 && !spot.endsWith('|')
    this.lastClick = { spot, time: twice ? 0 : now }
    if (twice) {
      const again = this.canvas.querySelector(`.uml-class[data-class="${CSS.escape(cls.name)}"]`)
      this.startEditing(again?.querySelector<HTMLElement>(index !== undefined ? `[data-member="${index}"]` : '.uml-name') ?? null)
      return
    }
    this.selection = { cls: cls.name, member: index }
    this.relSelection = undefined
    this.treeSelection = undefined
    this.currentPackage = packageOf(cls.path)
    this.showInCode(cls, index !== undefined ? cls.members[index] : undefined)
    this.render()
    this.renderTree()
    this.canvas.focus({ preventScroll: true })
  }

  // MARK: - Zeichnen

  private savePositions() {
    const names = new Set(this.classes.map((c) => c.name))
    store(positionsKey, JSON.stringify(Object.fromEntries([...this.positions].filter(([n]) => names.has(n)))))
  }

  private render() {
    for (const old of this.canvas.querySelectorAll('.uml-class, .vo-empty')) old.remove()
    if (this.classes.length === 0) {
      const empty = document.createElement('p')
      empty.className = 'vo-empty'
      empty.textContent = t('web_visuobject_empty')
      this.canvas.append(empty)
      this.drawLines()
      return
    }
    this.roleFields = new Set(associations(this.classes, this.project.uml).flatMap((r) => [r.key, ...(r.back ? [r.back.key] : [])]))
    const boxes = new Map<string, HTMLElement>()
    for (const cls of this.classes) {
      if (boxes.has(cls.name)) continue
      const box = this.classBox(cls)
      boxes.set(cls.name, box)
      this.canvas.append(box)
    }
    this.placeNew(boxes)
    this.drawLines()
  }

  private classBox(cls: ProjectClass): HTMLElement {
    const sel = this.selection?.cls === cls.name ? this.selection : undefined
    const box = document.createElement('div')
    box.className = `uml-class${sel ? ' selected' : ''}${cls.kind === 'interface' ? ' interface' : ''}${cls.isAbstract ? ' abstract' : ''}`
    box.dataset.class = cls.name
    const p = this.positions.get(cls.name)
    if (p) {
      box.style.left = `${p.x}px`
      box.style.top = `${p.y}px`
    }
    const row = (m: UmlMember, i: number) => {
      const text = umlText(m)
      const cls2 = `uml-member${m.isStatic ? ' static' : ''}${m.isAbstract ? ' abstract' : ''}${sel?.member === i ? ' selected' : ''}`
      return `<li class="${cls2}" data-member="${i}" data-value="${e(text)}">${e(text)}</li>`
    }
    // Attribute, die auf eine andere Klasse zeigen, sind in UML die Rolle an der Linie, nicht im Kasten.
    const fields = cls.members.map((m, i) => (m.kind === 'field' && !this.roleFields.has(relationKey(cls.name, m.name)) ? row(m, i) : '')).join('')
    const methods = cls.members.map((m, i) => (m.kind !== 'field' ? row(m, i) : '')).join('')
    const add = (kind: 'field' | 'method') =>
      sel ? `<li class="uml-add" data-add="${kind}">${e(t(kind === 'field' ? 'web_visuobject_add_field' : 'web_visuobject_add_method'))}</li>` : ''
    box.innerHTML = `
      ${sel && sel.member === undefined ? `<button class="uml-connect" data-connect aria-label="${e(t('web_visuobject_connect'))}" data-tip="${e(t('web_visuobject_connect'))}" tabindex="-1"></button>` : ''}
      <header class="uml-head">${cls.kind === 'interface' ? '<small>«interface»</small>' : cls.isAbstract ? '<small>{abstract}</small>' : ''}<span class="uml-name" data-value="${e(cls.name)}">${e(cls.name)}</span></header>
      ${cls.kind === 'interface' && !fields ? '' : `<ul class="uml-fields">${fields}${add('field')}</ul>`}
      <ul class="uml-methods">${methods}${add('method')}</ul>`
    return box
  }

  /**
   * Klassen ohne Position anordnen: jedes Package als eigener Block, die Blöcke nebeneinander,
   * solange sie in die Breite passen, sonst darunter. Im Block stehen Oberklassen und Interfaces oben.
   * Eine neue Klasse in einem schon gezeichneten Package kommt neben ihre Geschwister.
   */
  private placeNew(boxes: Map<string, HTMLElement>) {
    if (this.classes.every((c) => this.positions.has(c.name))) return
    const parents = (c: ProjectClass) => [c.superclass, ...c.interfaces].filter((n): n is string => !!n && boxes.has(n))
    const level = new Map<string, number>()
    const depth = (c: ProjectClass, seen: Set<string>): number => {
      if (level.has(c.name)) return level.get(c.name)!
      if (seen.has(c.name)) return 0
      seen.add(c.name)
      // Nur Eltern im selben Package zählen für die Ebene im Block.
      const up = parents(c)
        .map((n) => this.findClass(n)!)
        .filter((p) => p.pkg === c.pkg)
        .map((p) => depth(p, seen))
      const d = up.length ? Math.max(...up) + 1 : 0
      level.set(c.name, d)
      return d
    }
    for (const c of this.classes) depth(c, new Set())
    type Rect = { x: number; y: number; w: number; h: number }
    const gap = 48
    const width = Math.max(this.canvas.clientWidth, 400) - 24
    const apart = (a: Rect, b: Rect, m: number) => a.x + a.w + m <= b.x || b.x + b.w + m <= a.x || a.y + a.h + m <= b.y || b.y + b.h + m <= a.y
    const size = (c: ProjectClass) => ({ w: boxes.get(c.name)!.offsetWidth, h: boxes.get(c.name)!.offsetHeight })
    const put = (c: ProjectClass, x: number, y: number) => {
      this.positions.set(c.name, { x, y })
      const box = boxes.get(c.name)!
      box.style.left = `${x}px`
      box.style.top = `${y}px`
    }
    // Rahmen eines Packages mit Reiter: 16 px Rand, oben 24 px mehr für den Namen.
    const frameOf = (pkg: string): Rect | undefined => {
      const rs = this.classes.filter((c) => c.pkg === pkg && boxes.has(c.name) && this.positions.has(c.name)).map((c) => ({ ...this.positions.get(c.name)!, ...size(c) }))
      if (rs.length === 0) return undefined
      const x = Math.min(...rs.map((r) => r.x)) - 16
      const y = Math.min(...rs.map((r) => r.y)) - 40
      return { x, y, w: Math.max(...rs.map((r) => r.x + r.w)) + 16 - x, h: Math.max(...rs.map((r) => r.y + r.h)) + 16 - y }
    }
    const packages = this.diagramPackages().filter((pkg) => this.classes.some((c) => c.pkg === pkg && boxes.has(c.name)))
    for (const pkg of packages) {
      const fresh = this.classes.filter((c) => c.pkg === pkg && boxes.has(c.name) && !this.positions.has(c.name))
      if (fresh.length === 0) continue
      const others = packages.filter((p) => p !== pkg).map(frameOf).filter((r): r is Rect => !!r)
      const own = frameOf(pkg)
      if (own) {
        // Neben die Geschwister, ohne in ein anderes Package zu ragen.
        for (const c of fresh) {
          const { w, h } = size(c)
          const taken = this.classes.filter((o) => o.pkg === pkg && this.positions.has(o.name) && boxes.has(o.name)).map((o) => ({ ...this.positions.get(o.name)!, ...size(o) }))
          let spot: { x: number; y: number } | undefined
          for (let y = own.y + 40; !spot && y < own.y + 4000; y += 20)
            for (let x = own.x + 16; x === own.x + 16 || x + w <= width; x += 20) {
              const r = { x, y, w, h }
              const outer = { x: x - 16, y: y - 40, w: w + 32, h: h + 56 }
              if (taken.every((t) => apart(r, t, gap)) && others.every((o) => apart(outer, o, 24))) {
                spot = { x, y }
                break
              }
            }
          spot ??= { x: own.x + 16, y: own.y + own.h + gap }
          put(c, spot.x, spot.y)
        }
        continue
      }
      // Ganzer Block: Reihen nach Ebene, in der Reihe nebeneinander.
      const rows: ProjectClass[][] = []
      for (const c of fresh) (rows[level.get(c.name)!] ??= []).push(c)
      const local = new Map<string, { x: number; y: number }>()
      let y = 0
      let blockW = 0
      for (const row of rows) {
        if (!row) continue
        let x = 0
        let rowH = 0
        for (const c of row) {
          const { w, h } = size(c)
          local.set(c.name, { x, y })
          // Breiter Abstand nebeneinander: Platz für Rolle und Multiplizität an der Linie.
          x += w + gap * 3
          rowH = Math.max(rowH, h)
        }
        blockW = Math.max(blockW, x - gap * 3)
        y += rowH + gap * 1.5
      }
      const blockH = y - gap * 1.5
      const outerW = blockW + 32
      const outerH = blockH + 56
      let spot: { x: number; y: number } | undefined
      for (let oy = 4; !spot && oy < 20000; oy += 20)
        for (let ox = 16; ox === 16 || ox + outerW <= width; ox += 20)
          if (others.every((o) => apart({ x: ox, y: oy, w: outerW, h: outerH }, o, 32))) {
            spot = { x: ox, y: oy }
            break
          }
      spot ??= { x: 16, y: 4 }
      for (const c of fresh) put(c, spot.x + 16 + local.get(c.name)!.x, spot.y + 40 + local.get(c.name)!.y)
    }
    this.savePositions()
  }

  private drawLines() {
    const boxes = new Map<string, HTMLElement>()
    for (const b of this.canvas.querySelectorAll<HTMLElement>('.uml-class')) boxes.set(b.dataset.class!, b)
    let width = 0
    let height = 0
    for (const b of boxes.values()) {
      width = Math.max(width, b.offsetLeft + b.offsetWidth + 40)
      height = Math.max(height, b.offsetTop + b.offsetHeight + 40)
    }
    for (const svg of [this.lines, this.frames]) {
      svg.setAttribute('width', String(width))
      svg.setAttribute('height', String(height))
    }
    this.frames.innerHTML = this.packageFrames(boxes)
    const parts: string[] = [
      `<defs>
        <marker id="vo-triangle" viewBox="0 0 12 12" refX="0" refY="6" markerWidth="12" markerHeight="12" overflow="visible" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0 -1 L12 6 L0 13 z" class="vo-hollow"/></marker>
        <marker id="vo-arrow" viewBox="0 0 12 12" refX="12" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0 0 L12 6 L0 12" class="vo-open"/></marker>
      </defs>`,
    ]
    const assocs = associations(this.classes, this.project.uml)
    const gens = generalizations(this.classes)
    // Mehrere Linien zwischen denselben Klassen leicht versetzen.
    const pairCount = new Map<string, number>()
    const offset = (a: string, b: string) => {
      const key = [a, b].sort().join('|')
      const n = pairCount.get(key) ?? 0
      pairCount.set(key, n + 1)
      return n * 16
    }
    for (const g of gens) {
      const a = boxes.get(g.from)
      const b = boxes.get(g.to)
      if (a && b && a !== b) parts.push(this.generalizationSVG(g, a, b, offset(g.from, g.to)))
    }
    for (const r of assocs) {
      const a = boxes.get(r.from)
      const b = boxes.get(r.to)
      if (a && b && a !== b) parts.push(this.associationSVG(r, a, b, offset(r.from, r.to)))
    }
    for (const d of this.dependencies()) {
      const a = boxes.get(d.from)
      const b = boxes.get(d.to)
      if (a && b && a !== b) parts.push(this.dependencySVG(d, a, b, offset(d.from, d.to)))
    }
    this.lines.innerHTML = parts.join('')
    this.renderInspector()
  }

  /** Java-Packages fürs Diagramm: Gleich benannte Packages in `src` und `test` sind dasselbe Package. */
  private diagramPackages(): string[] {
    return [...new Set(packagesOf(this.project).map(barePackage))]
  }

  /** UML-Package: Rahmen um seine Klassen mit Reiter oben links. */
  private packageFrames(boxes: Map<string, HTMLElement>): string {
    const out: string[] = []
    for (const pkg of this.diagramPackages()) {
      if (!pkg) continue
      const els = this.classes.filter((c) => c.pkg === pkg).map((c) => boxes.get(c.name)).filter((b): b is HTMLElement => !!b)
      if (els.length === 0) continue
      const x = Math.min(...els.map((b) => b.offsetLeft)) - 16
      const y = Math.min(...els.map((b) => b.offsetTop)) - 16
      const right = Math.max(...els.map((b) => b.offsetLeft + b.offsetWidth)) + 16
      const bottom = Math.max(...els.map((b) => b.offsetTop + b.offsetHeight)) + 16
      const tab = Math.max(70, pkg.length * 7.6 + 20)
      const current = this.currentPackage !== undefined && barePackage(this.currentPackage) === pkg ? ' current' : ''
      out.push(`<g class="vo-package${current}">
        <path d="M${x} ${y - 24} h${tab} v24 h${right - x - tab} v${bottom - y} h${-(right - x)} z" class="vo-package-frame"/>
        <line x1="${x}" y1="${y}" x2="${x + tab}" y2="${y}" class="vo-package-frame"/>
        <text x="${x + 10}" y="${y - 8}" class="vo-package-name">${e(pkg)}</text>
      </g>`)
    }
    return out.join('')
  }

  /** Linie zwischen den Rändern zweier Kästen, senkrecht um `offset` versetzt. */
  private segment(a: HTMLElement, b: HTMLElement, offset: number) {
    const rect = (el: HTMLElement) => ({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight })
    const ra = rect(a)
    const rb = rect(b)
    const ca = { x: ra.x + ra.w / 2, y: ra.y + ra.h / 2 }
    const cb = { x: rb.x + rb.w / 2, y: rb.y + rb.h / 2 }
    const len = Math.hypot(cb.x - ca.x, cb.y - ca.y) || 1
    const nx = (-(cb.y - ca.y) / len) * offset
    const ny = ((cb.x - ca.x) / len) * offset
    const from = edgePoint(ra, { x: ca.x + nx, y: ca.y + ny }, { x: cb.x + nx, y: cb.y + ny })
    const to = edgePoint(rb, { x: cb.x + nx, y: cb.y + ny }, { x: ca.x + nx, y: ca.y + ny })
    const l = Math.hypot(to.x - from.x, to.y - from.y) || 1
    // u: Einheitsvektor von `from` nach `to`, n: senkrecht dazu
    return { from, to, length: l, u: { x: (to.x - from.x) / l, y: (to.y - from.y) / l }, n: { x: -(to.y - from.y) / l, y: (to.x - from.x) / l } }
  }

  private hitLine(id: string, from: Point, to: Point, label: string): string {
    return `<line class="vo-hit" data-rel="${e(id)}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"><title>${e(label)}</title></line>`
  }

  private dependencies(): Dependency[] {
    return dependencies(this.classes, (c) => this.project.files.find((f) => f.path === (c as ProjectClass).path)?.text)
  }

  private findDependency(id: string): Dependency | undefined {
    return this.dependencies().find((d) => `dep:${d.from}:${d.to}` === id)
  }

  /** Abhängigkeit: gestrichelte Linie mit offener Pfeilspitze und «create» bzw. «use» in der Mitte. */
  private dependencySVG(d: Dependency, a: HTMLElement, b: HTMLElement, offset: number): string {
    const { from, to, n } = this.segment(a, b, offset)
    const id = `dep:${d.from}:${d.to}`
    const selected = this.relSelection === id ? ' selected' : ''
    const mid = { x: (from.x + to.x) / 2 + n.x * 12, y: (from.y + to.y) / 2 + n.y * 12 }
    const anchor = Math.abs(n.x) < 0.35 ? 'middle' : n.x > 0 ? 'start' : 'end'
    const label = t(`web_visuobject_dep_${d.kind}_text`, d.from, d.to, d.methods.join(', '))
    return `<g class="vo-relation vo-dependency${selected}">
      <line class="vo-rel dashed" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" marker-end="url(#vo-arrow)"/>
      <text class="vo-label-svg name" x="${mid.x}" y="${mid.y}" text-anchor="${anchor}" dominant-baseline="middle">«${d.kind}»</text>
      ${this.hitLine(id, from, to, label)}
    </g>`
  }

  private generalizationSVG(g: Generalization, a: HTMLElement, b: HTMLElement, offset: number): string {
    const { from, to, u } = this.segment(a, b, offset)
    // Linie endet an der Grundseite des hohlen Dreiecks, die Spitze berührt die Oberklasse.
    const base = { x: to.x - u.x * 12, y: to.y - u.y * 12 }
    const id = `gen:${g.kind}:${g.from}:${g.to}`
    const selected = this.relSelection === id ? ' selected' : ''
    const label = t(g.kind === 'implements' ? 'web_visuobject_rel_implements_text' : 'web_visuobject_rel_extends_text', g.from, g.to)
    return `<g class="vo-relation${selected}">
      <line class="vo-rel${g.kind === 'implements' ? ' dashed' : ''}" x1="${from.x}" y1="${from.y}" x2="${base.x}" y2="${base.y}" marker-end="url(#vo-triangle)"/>
      ${this.hitLine(id, from, to, label)}
    </g>`
  }

  /**
   * Assoziation: Raute am Ganzen (Aggregation hohl, Komposition gefüllt), Pfeilspitzen je nach Navigierbarkeit,
   * an jedem Ende Multiplizität und Rolle gleich weit von der Klasse auf beiden Seiten der Linie,
   * in der Mitte der Name mit Leserichtung.
   */
  private associationSVG(r: Assoc, a: HTMLElement, b: HTMLElement, offset: number): string {
    const { from, to, length, u, n } = this.segment(a, b, offset)
    const id = `assoc:${r.key}`
    const selected = this.relSelection === id ? ' selected' : ''
    const diamond = r.kind !== 'association'
    const start = diamond ? { x: from.x + u.x * 20, y: from.y + u.y * 20 } : from
    let svg = `<line class="vo-rel" x1="${start.x}" y1="${start.y}" x2="${to.x}" y2="${to.y}"${r.navTo === 'navigable' ? ' marker-end="url(#vo-arrow)"' : ''}${r.navFrom === 'navigable' ? ' marker-start="url(#vo-arrow)"' : ''}/>`
    // Nicht navigierbar: kleines Kreuz × kurz vor der Klasse.
    const cross = (at: Point, dir: Point) => {
      const c = { x: at.x + dir.x * 12, y: at.y + dir.y * 12 }
      const a = { x: (dir.x + n.x) * 5, y: (dir.y + n.y) * 5 }
      const b = { x: (dir.x - n.x) * 5, y: (dir.y - n.y) * 5 }
      return `<path class="vo-rel" d="M${c.x - a.x} ${c.y - a.y} L${c.x + a.x} ${c.y + a.y} M${c.x - b.x} ${c.y - b.y} L${c.x + b.x} ${c.y + b.y}"/>`
    }
    if (r.navTo === 'non-navigable') svg += cross(to, { x: -u.x, y: -u.y })
    if (r.navFrom === 'non-navigable') svg += cross(start, u)
    if (diamond) {
      const p = (along: number, side: number) => `${from.x + u.x * along + n.x * side},${from.y + u.y * along + n.y * side}`
      svg += `<polygon class="vo-diamond${r.kind === 'composition' ? ' filled' : ''}" points="${p(0, 0)} ${p(10, 6)} ${p(20, 0)} ${p(10, -6)}"/>`
    }
    // Beschriftung an einem Ende: Multiplizität auf der einen, Rolle auf der anderen Seite, gleich weit weg.
    // Ist die Linie markiert, stehen leere Felder hellgrau da; ein Klick darauf bearbeitet das Ende (wie in Astah).
    const end = (at: Point, dir: Point, along: number, endId: 'a' | 'b', multiplicity?: string, role?: string) => {
      // Waagerechte Linie: Text beginnt dicht an der Klasse und wächst von ihr weg.
      const flat = Math.abs(n.x) < 0.35
      const base = flat ? { x: at.x + dir.x * 8, y: at.y + dir.y * 8 } : { x: at.x + dir.x * along, y: at.y + dir.y * along }
      const text = (side: number, value: string | undefined, cls: 'mult' | 'role') => {
        const empty = !value
        if (empty && !selected) return ''
        const x = base.x + n.x * side
        const y = base.y + n.y * side
        const anchor = flat ? (dir.x > 0 ? 'start' : 'end') : n.x * side > 0 ? 'start' : 'end'
        const shown = empty ? t(cls === 'role' ? 'web_visuobject_rel_role' : 'web_visuobject_end_mult_ph') : value
        return `<text class="vo-label-svg ${cls}${empty ? ' placeholder' : ''}${selected ? ' editable' : ''}" data-rel="${e(id)}" data-end="${endId}" data-part="${cls}" x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="middle">${e(shown!)}</text>`
      }
      // Unsichtbarer Kreis am Ende: Rechtsklick dort öffnet das Ende auch ohne Markierung.
      const c = { x: at.x + dir.x * 16, y: at.y + dir.y * 16 }
      const hit = `<circle class="vo-end-hit" data-rel="${e(id)}" data-end="${endId}" cx="${c.x}" cy="${c.y}" r="16"><title>${e(t('web_visuobject_end_tip'))}</title></circle>`
      return hit + text(12, multiplicity, 'mult') + text(-12, role, 'role')
    }
    const room = Math.min(30, length / 3)
    // Rolle mit Sichtbarkeit, denn das Attribut steht nicht mehr im Kasten.
    svg += end(to, { x: -u.x, y: -u.y }, room, 'b', r.multiplicity, `${r.field.visibility}${r.role}`)
    svg += end(from, u, diamond ? Math.min(42, length / 3) : room, 'a', r.sourceMultiplicity, r.back ? `${r.back.field.visibility}${r.back.field.name}` : r.sourceRole)
    if (r.name) {
      // Leserichtung als Dreieck, das in Richtung der gelesenen Klasse zeigt.
      const dir = r.reading === 'backward' ? { x: -u.x, y: -u.y } : u
      const arrow = !r.reading ? '' : Math.abs(dir.x) >= Math.abs(dir.y) ? (dir.x > 0 ? ' ▶' : '◀ ') : dir.y > 0 ? ' ▼' : ' ▲'
      const text = arrow === '◀ ' ? `◀ ${r.name}` : `${r.name}${arrow}`
      const free = this.freeMiddle(from, to, [r.from, r.to])
      const mid = { x: free.x + n.x * 14, y: free.y + n.y * 14 }
      const anchor = Math.abs(n.x) < 0.35 ? 'middle' : n.x > 0 ? 'start' : 'end'
      svg += `<text class="vo-label-svg name" x="${mid.x}" y="${mid.y}" text-anchor="${anchor}" dominant-baseline="middle">${e(text)}</text>`
    }
    const label = t(`web_visuobject_rel_${r.kind}`) + `: ${r.from} – ${r.to}`
    return `<g class="vo-relation${selected}">${svg}${this.hitLine(id, from, to, label)}</g>`
  }

  /** Mitte des längsten Stücks der Linie, das durch keinen anderen Kasten läuft (für den Namen). */
  private freeMiddle(from: Point, to: Point, ends: string[]): Point {
    const others = [...this.canvas.querySelectorAll<HTMLElement>('.uml-class')]
      .filter((b) => !ends.includes(b.dataset.class!))
      .map((b) => ({ x: b.offsetLeft - 8, y: b.offsetTop - 8, w: b.offsetWidth + 16, h: b.offsetHeight + 16 }))
    // Die Enden gehören Multiplizität und Rolle.
    const len = Math.hypot(to.x - from.x, to.y - from.y)
    if (len > 120) {
      const k = 48 / len
      ;[from, to] = [
        { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k },
        { x: to.x - (to.x - from.x) * k, y: to.y - (to.y - from.y) * k },
      ]
    }
    const steps = 40
    let best = { start: 0, length: 0 }
    let run = -1
    for (let i = 0; i <= steps; i++) {
      const x = from.x + ((to.x - from.x) * i) / steps
      const y = from.y + ((to.y - from.y) * i) / steps
      const blocked = others.some((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h)
      if (!blocked && run < 0) run = i
      if ((blocked || i === steps) && run >= 0) {
        const end = blocked ? i - 1 : i
        if (end - run > best.length) best = { start: run, length: end - run }
        run = -1
      }
    }
    const at = (best.start + best.length / 2) / steps
    return { x: from.x + (to.x - from.x) * at, y: from.y + (to.y - from.y) * at }
  }

  // MARK: - Beziehungen bearbeiten

  private findRelation(id: string): Assoc | Generalization | undefined {
    if (id.startsWith('assoc:')) return associations(this.classes, this.project.uml).find((r) => `assoc:${r.key}` === id || `assoc:${r.back?.key}` === id)
    return generalizations(this.classes).find((g) => `gen:${g.kind}:${g.from}:${g.to}` === id)
  }

  private selectRelation(id: string) {
    this.relSelection = id
    this.selection = undefined
    this.treeSelection = undefined
    this.message('')
    this.render()
    this.renderTree()
    this.canvas.focus({ preventScroll: true })
  }

  /** Datei mit der Klasse `name` frisch lesen und ändern; so passen die Stellen auch nach einer vorigen Änderung. */
  private editClass(project: JavaProject, name: string, run: (text: string, cls: UmlClass) => string): JavaProject {
    for (const f of project.files) {
      const cls = parseClasses(f.text).find((c) => c.name === name)
      if (cls) return updateFile(project, f.path, run(f.text, cls))
    }
    return project
  }

  private fieldOf(cls: UmlClass, name: string) {
    return cls.members.find((m) => m.kind === 'field' && m.name === name)
  }

  /** Import ergänzen, wenn `user` die Klasse `used` aus einem anderen Package braucht. */
  private importFor(project: JavaProject, user: string, used: string): JavaProject {
    const a = this.findClass(user)
    const b = this.findClass(used)
    if (!a || !b || a.pkg === b.pkg || !b.pkg) return project
    return this.editClass(project, user, (text) => ensureImport(text, `${b.pkg}.${b.name}`))
  }

  /** Attribut für eine Assoziation anlegen (Typ der Klasse oder Liste davon). */
  private addAssociationField(project: JavaProject, from: string, to: string, many: boolean, wanted?: string): { project: JavaProject; field: string } {
    const cls = projectClasses(project).find((c) => c.name === from)!
    // Eine schon eingetragene Rolle wird der Name des Attributs.
    const field = wanted && identifier.test(wanted) && !cls.members.some((m) => m.name === wanted) ? wanted : fieldNameFor(cls, to, many)
    const { type, init } = fieldTypeFor(to, many)
    let next = this.editClass(project, from, (text, c) => addMember(text, c, `- ${field}: ${type}`))
    if (init) {
      next = this.editClass(next, from, (text, c) => {
        const m = this.fieldOf(c, field)
        return m ? setFieldType(text, m, type, init) : text
      })
      next = this.editClass(next, from, (text) => ensureImport(text, 'java.util.ArrayList'))
    }
    return { project: this.importFor(next, from, to), field }
  }

  private setUml(project: JavaProject, key: string, change: Partial<AssocInfo>): JavaProject {
    return { ...project, uml: withInfo(project.uml ?? {}, key, change) }
  }

  /** Neue Beziehung aus dem Ziehen von Klasse zu Klasse. */
  private createRelation(from: string, to: string, kind: RelationTool) {
    const a = this.findClass(from)
    const b = this.findClass(to)
    if (!a || !b) return
    let next = this.project
    let id: string
    if (kind === 'extends' && a.kind === 'class') {
      next = this.importFor(this.editClass(next, from, (text, c) => setSuperclass(text, c, to)), from, to)
      id = `gen:extends:${from}:${to}`
    } else if (kind === 'extends' || kind === 'implements') {
      next = this.importFor(this.editClass(next, from, (text, c) => addInterface(text, c, to)), from, to)
      id = `gen:${a.kind === 'interface' ? 'extends' : 'implements'}:${from}:${to}`
    } else {
      const added = this.addAssociationField(next, from, to, false)
      const key = relationKey(from, added.field)
      next = kind === 'association' ? added.project : kind === 'link' ? this.setUml(added.project, key, { targetEnd: 'unspecified' }) : this.setUml(added.project, key, { kind })
      id = `assoc:${relationKey(from, added.field)}`
    }
    this.relSelection = id
    this.selection = undefined
    this.message('')
    this.setProject(next, a.path)
    this.canvas.focus({ preventScroll: true })
  }

  private deleteRelation(id: string) {
    const rel = this.findRelation(id)
    if (!rel) return
    let next = this.project
    if ('key' in rel) {
      const drop = (p: JavaProject, cls: string, field: string) =>
        this.editClass(p, cls, (text, c) => {
          const m = this.fieldOf(c, field)
          return m ? deleteMember(text, m) : text
        })
      next = drop(next, rel.from, rel.role)
      if (rel.back) next = drop(next, rel.to, rel.back.field.name)
      const uml = { ...(next.uml ?? {}) }
      delete uml[rel.key]
      if (rel.back) delete uml[rel.back.key]
      next = { ...next, uml }
    } else if (rel.kind === 'extends' && this.findClass(rel.from)?.kind === 'class') {
      next = this.editClass(next, rel.from, (text, c) => setSuperclass(text, c, undefined))
    } else {
      next = this.editClass(next, rel.from, (text, c) => removeInterface(text, c, rel.to))
    }
    this.relSelection = undefined
    this.setProject(next)
  }

  /** Eine Einstellung im Objektinspektor ändern. */
  private changeAssoc(r: Assoc, what: string, value: string) {
    let next = this.project
    let key = r.key
    const rename = (cls: string, oldName: string, name: string): boolean => {
      if (!identifier.test(name)) {
        this.message(t('web_visuobject_bad_name', name))
        return false
      }
      const c = this.findClass(cls)
      if (c && c.members.some((m) => m.name === name)) {
        this.message(t('web_visuobject_bad_name', name))
        return false
      }
      next = this.editClass(next, cls, (text, fresh) => {
        const m = this.fieldOf(fresh, oldName)
        return m ? replaceMember(text, fresh, m, `${m.visibility} ${name}: ${m.type}`) : text
      })
      next = { ...next, uml: renameInfo(next.uml ?? {}, relationKey(cls, oldName), relationKey(cls, name)) }
      return true
    }
    /** Multiplizität am Attribut `field` von `cls` (Typ `target`): bei Wechsel einzeln ↔ viele den Typ ändern. */
    const multiplicity = (cls: string, field: string, target: string, value: string, metaKey: string) => {
      const many = isMany(value)
      next = this.editClass(next, cls, (text, fresh) => {
        const m = this.fieldOf(fresh, field)
        if (!m) return text
        const current = isMany(r.key === metaKey ? r.multiplicity : (r.sourceMultiplicity ?? '1'))
        if (current === many) return text
        const { type, init } = fieldTypeFor(target, many)
        return setFieldType(text, m, type, init)
      })
      if (many) next = this.editClass(next, cls, (text) => ensureImport(text, 'java.util.ArrayList'))
      const derived = many ? '0..*' : '1'
      next = this.setUml(next, metaKey, { multiplicity: value === derived ? undefined : value })
    }
    switch (what) {
      case 'kind':
        next = this.setUml(next, key, { kind: value as AssocKind })
        break
      case 'name':
        next = this.setUml(next, key, { name: value.trim() || undefined })
        break
      case 'reading':
        // Umdrehen: gegen die Zugrichtung lesen und zurück.
        next = this.setUml(next, key, { reading: r.reading === 'backward' ? undefined : 'backward' })
        break
      case 'targetEnd':
        next = this.setUml(next, key, { targetEnd: value as EndNav, navigable: undefined })
        break
      case 'sourceEnd': {
        if (value === 'navigable' && !r.back) {
          // Navigierbar zurück heißt im Code: die andere Klasse bekommt ein Attribut.
          const added = this.addAssociationField(next, r.to, r.from, isMany(r.sourceMultiplicity ?? '1'), r.sourceRole)
          next = this.setUml(added.project, key, { sourceEnd: undefined, sourceRole: undefined, sourceMultiplicity: undefined })
          if (r.sourceMultiplicity && r.sourceMultiplicity !== (isMany(r.sourceMultiplicity) ? '0..*' : '1')) next = this.setUml(next, relationKey(r.to, added.field), { multiplicity: r.sourceMultiplicity })
        } else if (value !== 'navigable') {
          if (r.back) {
            const back = r.back
            next = this.editClass(next, r.to, (text, c) => {
              const m = this.fieldOf(c, back.field.name)
              return m ? deleteMember(text, m) : text
            })
            const uml = { ...(next.uml ?? {}) }
            delete uml[back.key]
            next = { ...next, uml }
            next = this.setUml(next, key, { sourceRole: r.sourceRole, sourceMultiplicity: r.sourceMultiplicity })
          }
          next = this.setUml(next, key, { sourceEnd: value as EndNav })
        }
        break
      }
      case 'role':
        if (value === r.role) return
        if (!rename(r.from, r.role, value)) return
        key = relationKey(r.from, value)
        break
      case 'multiplicity':
        if (!value.trim()) return
        multiplicity(r.from, r.role, r.to, value.trim(), key)
        break
      case 'sourceRole':
        if (r.back) {
          if (value === r.back.field.name) return
          if (!rename(r.to, r.back.field.name, value)) return
        } else next = this.setUml(next, key, { sourceRole: value.trim() || undefined })
        break
      case 'sourceMultiplicity':
        if (!value.trim()) return
        if (r.back) multiplicity(r.to, r.back.field.name, r.from, value.trim(), r.back.key)
        else next = this.setUml(next, key, { sourceMultiplicity: value.trim() })
        break
    }
    this.relSelection = `assoc:${key}`
    this.message('')
    this.setProject(next)
    const now = this.findRelation(this.relSelection)
    if (now && 'key' in now && `assoc:${now.key}` !== this.relSelection) {
      this.relSelection = `assoc:${now.key}`
      this.render()
    }
  }

  /** Objektinspektor rechts im Diagramm: zeigt die gewählte Beziehung. */
  /**
   * Kleines Feld an einem Ende der Linie wie in Astah: Rolle, Multiplizität als Knöpfe, Navigierbarkeit.
   * Ende A ist die Klasse, bei der die Linie beginnt, Ende B die, bei der sie endet.
   */
  private openEnd(id: string, which: 'a' | 'b', ev: MouseEvent, part?: 'role' | 'mult') {
    this.closeEnd()
    const rel = this.findRelation(id)
    if (!rel || !('key' in rel)) return
    const isA = which === 'a'
    const keys = isA ? { role: 'sourceRole', mult: 'sourceMultiplicity', nav: 'sourceEnd' } : { role: 'role', mult: 'multiplicity', nav: 'targetEnd' }
    const role = (isA ? rel.sourceRole : rel.role) ?? ''
    const mult = (isA ? rel.sourceMultiplicity : rel.multiplicity) ?? ''
    const nav = isA ? rel.navFrom : rel.navTo
    const cls = isA ? rel.from : rel.to
    const pop = document.createElement('div')
    pop.className = 'vo-endpop'
    pop.setAttribute('role', 'dialog')
    pop.setAttribute('aria-label', t(isA ? 'web_visuobject_rel_end_a' : 'web_visuobject_rel_end_b', cls))
    pop.innerHTML = `<p><b>${e(t(isA ? 'web_visuobject_rel_end_a' : 'web_visuobject_rel_end_b', cls))}</b></p>
      <label>${e(t('web_visuobject_rel_role'))}<input data-end-field="role" value="${e(role)}" spellcheck="false" autocomplete="off" placeholder="${e(t('web_visuobject_end_role_ph'))}"></label>
      <div class="vo-endpop-row" role="group" aria-label="${e(t('web_visuobject_rel_multiplicity'))}"><span>${e(t('web_visuobject_rel_multiplicity'))}</span>${multiplicities.map((m) => `<button type="button" data-mult="${m}" aria-pressed="${m === mult}">${m}</button>`).join('')}<input data-end-field="mult" value="${e(mult)}" size="4" spellcheck="false" autocomplete="off" aria-label="${e(t('web_visuobject_rel_multiplicity'))}"></div>
      <div class="vo-endpop-row" role="group" aria-label="${e(t('web_visuobject_rel_navigable'))}"><span>${e(t('web_visuobject_rel_navigable'))}</span>${(['navigable', 'non-navigable', 'unspecified'] as const).map((v) => `<button type="button" data-nav="${v}" aria-pressed="${v === nav}">${e(t(`web_visuobject_rel_nav_${v}`))}</button>`).join('')}</div>`
    const stage = this.shell.querySelector<HTMLElement>('.vo-stage')!
    const r = stage.getBoundingClientRect()
    stage.append(pop)
    const x = Math.min(Math.max(8, ev.clientX - r.left + 8), r.width - pop.offsetWidth - 8)
    const y = Math.min(Math.max(8, ev.clientY - r.top + 8), r.height - pop.offsetHeight - 8)
    pop.style.left = `${Math.max(8, x)}px`
    pop.style.top = `${Math.max(8, y)}px`
    const apply = (field: string, value: string) => {
      const current = this.findRelation(id)
      if (current && 'key' in current) this.changeAssoc(current, field, value)
      // Nach dem Neuzeichnen bleibt das Feld offen, mit dem neuen Stand.
      const focusPart = (document.activeElement as HTMLElement | null)?.dataset?.endField as 'role' | 'mult' | undefined
      if (this.relSelection) this.reopenEnd(this.relSelection, which, pop, focusPart)
    }
    for (const input of pop.querySelectorAll<HTMLInputElement>('[data-end-field]')) {
      input.addEventListener('change', () => apply(input.dataset.endField === 'role' ? keys.role : keys.mult, input.value.trim()))
      input.addEventListener('keydown', (k) => {
        k.stopPropagation()
        if (k.key === 'Enter') input.blur()
        if (k.key === 'Escape') this.closeEnd()
      })
    }
    for (const b of pop.querySelectorAll<HTMLButtonElement>('[data-mult]')) b.addEventListener('click', () => apply(keys.mult, b.dataset.mult!))
    for (const b of pop.querySelectorAll<HTMLButtonElement>('[data-nav]')) b.addEventListener('click', () => apply(keys.nav, b.dataset.nav!))
    pop.addEventListener('pointerdown', (p) => p.stopPropagation())
    pop.addEventListener('click', (c) => c.stopPropagation())
    this.endPop = pop
    const first = pop.querySelector<HTMLInputElement>(`[data-end-field="${part === 'mult' ? 'mult' : 'role'}"]`)
    first?.focus()
    first?.select()
  }

  /** Feld am Ende nach einer Änderung an derselben Stelle neu öffnen. */
  private reopenEnd(id: string, which: 'a' | 'b', old: HTMLElement, part?: 'role' | 'mult') {
    const r = this.shell.querySelector<HTMLElement>('.vo-stage')!.getBoundingClientRect()
    const fake = { clientX: r.left + parseFloat(old.style.left) - 8, clientY: r.top + parseFloat(old.style.top) - 8 } as MouseEvent
    this.openEnd(id, which, fake, part)
  }

  private endPop?: HTMLElement

  private closeEnd() {
    this.endPop?.remove()
    this.endPop = undefined
  }

  /**
   * Objektinspektor unter dem Diagramm. Ende A ist die Klasse, bei der die Linie beginnt (dort steht das Attribut),
   * Ende B die Klasse, bei der sie endet.
   */
  private renderInspector() {
    const dep = this.relSelection?.startsWith('dep:') ? this.findDependency(this.relSelection) : undefined
    if (dep) return this.renderDependency(dep)
    const rel = this.relSelection ? this.findRelation(this.relSelection) : undefined
    if (this.endPop && (!rel || !this.endPop.isConnected)) this.closeEnd()
    const selectedClass = !rel && this.selection ? this.findClass(this.selection.cls) : undefined
    if (selectedClass) return this.renderClassInspector(selectedClass)
    if (!rel) {
      delete this.inspector.dataset.rel
      this.inspector.innerHTML = `<p class="vo-inspector-empty">${e(t('web_visuobject_inspector_empty'))}</p>`
      return
    }
    // Fokus nach dem Neuzeichnen wieder auf dasselbe Feld (z. B. nach Tab ins nächste).
    const focused = this.inspector.contains(document.activeElement) ? ((document.activeElement as HTMLElement).dataset.field ?? (document.activeElement as HTMLElement).dataset.inspector) : undefined
    this.inspector.dataset.rel = this.relSelection
    const remove = `<button class="text-button vo-danger" data-inspector="delete">${icons.trash} ${e(t('web_visuobject_rel_delete'))}</button>`
    if (!('key' in rel)) {
      const text = t(rel.kind === 'implements' ? 'web_visuobject_rel_implements_text' : 'web_visuobject_rel_extends_text', rel.from, rel.to)
      this.inspector.innerHTML = `<div class="vo-inspector-row"><p class="vo-inspector-kind">${e(t(rel.kind === 'implements' ? 'web_visuobject_rel_implements' : 'web_visuobject_rel_extends'))}</p><p>${e(text)}</p>${remove}</div>`
    } else {
      const option = (value: string, label: string, current: string) => `<option value="${e(value)}"${value === current ? ' selected' : ''}>${e(label)}</option>`
      const kinds = (['association', 'aggregation', 'composition'] as const).map((k) => option(k, t(`web_visuobject_rel_${k}`).replace(/\s*\(.*\)$/, ''), rel.kind)).join('')
      const navs = (current: EndNav) => (['navigable', 'non-navigable', 'unspecified'] as const).map((v) => option(v, t(`web_visuobject_rel_nav_${v}`), current)).join('')
      const [first, second] = rel.reading === 'backward' ? [rel.to, rel.from] : [rel.from, rel.to]
      const reading = rel.name
        ? `<p class="vo-reading">${e(t('web_visuobject_rel_reading'))}: <b>${e(first)} ▶ ${e(second)}</b> <button class="text-button" data-inspector="flip">${e(t('web_visuobject_rel_reading_flip'))}</button></p>`
        : `<p class="vo-reading"><small>${e(t('web_visuobject_rel_reading_auto'))}</small></p>`
      const list = `<datalist id="vo-multiplicities">${multiplicities.map((m) => `<option value="${m}">`).join('')}</datalist>`
      const endFields = (title: string, roleKey: string, role: string | undefined, multKey: string, mult: string | undefined, roleHint: string, navKey: string, nav: EndNav) => `
        <fieldset>
          <legend>${e(title)}</legend>
          <label>${e(t('web_visuobject_rel_role'))}<input data-field="${roleKey}" value="${e(role ?? '')}" spellcheck="false" autocomplete="off"></label>
          <label>${e(t('web_visuobject_rel_multiplicity'))}<input data-field="${multKey}" list="vo-multiplicities" value="${e(mult ?? '')}" spellcheck="false" autocomplete="off" placeholder="1"></label>
          <label class="vo-wide">${e(t('web_visuobject_rel_navigable'))}<select data-field="${navKey}">${navs(nav)}</select></label>
          <small class="vo-wide">${e(roleHint)}</small>
        </fieldset>`
      this.inspector.innerHTML = `
        <div class="vo-inspector-row">
          <label>${e(t('web_visuobject_rel_kind'))}<select data-field="kind">${kinds}</select></label>
          <label>${e(t('web_visuobject_rel_name'))}<input data-field="name" value="${e(rel.name ?? '')}" placeholder="${e(t('web_visuobject_rel_name_ph'))}" autocomplete="off"></label>
          ${reading}
          ${remove}
        </div>
        <div class="vo-inspector-ends">
          ${endFields(t('web_visuobject_rel_end_a', rel.from), 'sourceRole', rel.sourceRole, 'sourceMultiplicity', rel.sourceMultiplicity, rel.back ? t('web_visuobject_rel_role_field', rel.to, rel.back.field.name) : t('web_visuobject_rel_role_only_uml'), 'sourceEnd', rel.navFrom)}
          ${endFields(t('web_visuobject_rel_end_b', rel.to), 'role', rel.role, 'multiplicity', rel.multiplicity, t('web_visuobject_rel_role_field', rel.from, rel.role), 'targetEnd', rel.navTo)}
        </div>
        ${list}`
    }
    for (const el of this.inspector.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-field]')) {
      el.addEventListener('change', () => {
        const current = this.relSelection && this.findRelation(this.relSelection)
        if (current && 'key' in current) this.changeAssoc(current, el.dataset.field!, el.value)
      })
      if (el instanceof HTMLInputElement) el.addEventListener('keydown', (ev) => ev.key === 'Enter' && el.blur())
    }
    this.inspector.querySelector('[data-inspector=delete]')!.addEventListener('click', () => this.deleteRelation(this.relSelection!))
    if (focused) this.inspector.querySelector<HTMLElement>(`[data-field="${focused}"], [data-inspector="${focused}"]`)?.focus({ preventScroll: true })
    this.inspector.querySelector('[data-inspector=flip]')?.addEventListener('click', () => {
      const current = this.relSelection && this.findRelation(this.relSelection)
      if (current && 'key' in current) this.changeAssoc(current, 'reading', '')
    })
  }

  /** Gewählter Reiter im Klassen-Inspektor. */
  private classTab: 'class' | 'fields' | 'methods' = 'class'

  /**
   * Klassen-Inspektor wie in Eclipse/Astah mit drei Reitern: Klasse (Name, Package, Modifier, Oberklasse,
   * Interfaces, Javadoc), Attribute und Methoden als Tabellen, dazu die Erzeuger aus „Source“.
   * Jede Änderung schreibt sofort an die passende Stelle im Code.
   */
  private renderClassInspector(cls: ProjectClass) {
    const active = document.activeElement as HTMLElement | null
    const focused = this.inspector.contains(active) ? (active?.dataset.field ? `${active.dataset.row ?? ''}|${active.dataset.field}` : undefined) : undefined
    const text = this.project.files.find((f) => f.path === cls.path)?.text ?? ''
    const mods = classModifiers(text, cls)
    const isClass = cls.kind === 'class'
    const option = (value: string, label: string, on: boolean) => `<option value="${e(value)}"${on ? ' selected' : ''}>${e(label)}</option>`
    const visOptions = (v: Visibility, withPackage = true) =>
      (['+', '-', '#', '~'] as const)
        .filter((x) => withPackage || x !== '~')
        .map((x) => option(x, `${x} ${{ '+': 'public', '-': 'private', '#': 'protected', '~': 'package' }[x]}`, x === v))
        .join('')
    const fields = cls.members.map((m, i) => ({ m, i })).filter((x) => x.m.kind === 'field')
    const methods = cls.members.map((m, i) => ({ m, i })).filter((x) => x.m.kind !== 'field')
    const tab = (id: typeof this.classTab, label: string) => `<button role="tab" data-class-tab="${id}" aria-selected="${this.classTab === id}">${e(label)}</button>`
    const types = `<datalist id="vo-types">${['int', 'double', 'boolean', 'char', 'long', 'String', ...this.classes.map((c) => c.name), ...this.classes.map((c) => `ArrayList<${c.name}>`)].map((x) => `<option value="${e(x)}">`).join('')}</datalist>`
    let body = ''
    if (this.classTab === 'class') {
      const supers = this.classes.filter((c) => c.kind === 'class' && c.name !== cls.name)
      const ifaces = this.classes.filter((c) => c.kind === 'interface' && c.name !== cls.name)
      const here = packageOf(cls.path)
      const places = sourceFoldersOf(this.project).flatMap((root) => {
        const list = packagesOf(this.project, root)
        return list.includes(packageKey(root, '')) ? list : [...list, packageKey(root, '')]
      })
      body = `
      <div class="vo-inspector-row">
        <label>${e(t('web_visuobject_new_name'))}<input data-field="name" value="${e(cls.name)}" spellcheck="false" autocomplete="off"></label>
        <label>${e(t('web_visuobject_new_package'))}<select data-field="package">${places.map((k) => option(k, `${rootOf(k)} › ${barePackage(k) || t('web_visuobject_default_package')}`, k === here)).join('')}</select></label>
        <label>${e(t('web_visuobject_new_modifiers'))}<select data-field="visibility">${option('public', 'public', mods.isPublic)}${option('package', t('web_visuobject_new_package_private'), !mods.isPublic)}</select></label>
        ${isClass ? `<label class="check"><input type="checkbox" data-field="abstract"${cls.isAbstract ? ' checked' : ''}> abstract</label><label class="check"><input type="checkbox" data-field="final"${mods.isFinal ? ' checked' : ''}> final</label>` : ''}
      </div>
      <div class="vo-inspector-row">
        ${isClass ? `<label>${e(t('web_visuobject_new_superclass'))}<select data-field="superclass">${option('', 'java.lang.Object', !cls.superclass)}${supers.map((c) => option(c.name, c.pkg ? `${c.name} (${c.pkg})` : c.name, c.name === cls.superclass)).join('')}</select></label>` : ''}
        ${ifaces.length ? `<fieldset class="vo-inspector-ifaces"><legend>${e(t(isClass ? 'web_visuobject_new_interfaces' : 'web_visuobject_new_extends_interfaces'))}</legend>${ifaces.map((c) => `<label class="check"><input type="checkbox" data-field="iface" value="${e(c.name)}"${cls.interfaces.includes(c.name) ? ' checked' : ''}> ${e(c.name)}</label>`).join('')}</fieldset>` : ''}
      </div>
      <label class="vo-doc">${e(t('web_visuobject_insp_doc'))}<textarea data-field="doc" rows="2" spellcheck="true" placeholder="${e(t('web_visuobject_insp_doc_ph'))}">${e(classDoc(text, cls))}</textarea></label>
      <div class="vo-inspector-row"><button class="text-button vo-danger" data-inspector="delete-class">${icons.trash} ${e(t('web_visuobject_delete_class'))}</button></div>`
    } else if (this.classTab === 'fields') {
      const rows = fields
        .map(({ m, i }) => {
          const f = fieldInfo(text, m)
          return `<tr data-member-row="${i}">
            <td><select data-row="${i}" data-field="f-vis" aria-label="${e(t('web_visuobject_insp_visibility'))}">${visOptions(f.visibility)}</select></td>
            <td><input data-row="${i}" data-field="f-name" value="${e(f.name)}" spellcheck="false" autocomplete="off" aria-label="${e(t('web_visuobject_new_name'))}"></td>
            <td><input data-row="${i}" data-field="f-type" value="${e(f.type)}" list="vo-types" spellcheck="false" autocomplete="off" aria-label="${e(t('web_visuobject_insp_type'))}"></td>
            <td class="c"><input type="checkbox" data-row="${i}" data-field="f-static"${f.isStatic ? ' checked' : ''} aria-label="static"></td>
            <td class="c"><input type="checkbox" data-row="${i}" data-field="f-final"${f.isFinal ? ' checked' : ''} aria-label="final"${m.shared ? ' disabled' : ''}></td>
            <td><input data-row="${i}" data-field="f-init" value="${e(f.init)}" spellcheck="false" autocomplete="off" placeholder="—" aria-label="${e(t('web_visuobject_insp_init'))}"${m.shared ? ' disabled' : ''}></td>
            <td><button class="icon" data-row="${i}" data-inspector="delete-member" aria-label="${e(t('web_visuobject_delete'))}" data-tip="${e(t('web_visuobject_delete'))}">${icons.trash}</button></td>
          </tr>`
        })
        .join('')
      body = `<table class="vo-members"><thead><tr><th>${e(t('web_visuobject_insp_visibility'))}</th><th>${e(t('web_visuobject_new_name'))}</th><th>${e(t('web_visuobject_insp_type'))}</th><th>static</th><th>final</th><th>${e(t('web_visuobject_insp_init'))}</th><th></th></tr></thead><tbody>${rows || `<tr><td colspan="7" class="vo-inspector-empty">${e(t('web_visuobject_insp_no_fields'))}</td></tr>`}</tbody></table>
        <div class="vo-inspector-row"><button class="text-button" data-inspector="add-field">+ ${e(t('web_visuobject_insp_add_field'))}</button></div>`
    } else {
      const canAbstract = isClass
      const rows = methods
        .map(({ m, i }) => {
          const ctor = m.kind === 'constructor'
          return `<tr data-member-row="${i}">
            <td><select data-row="${i}" data-field="m-vis" aria-label="${e(t('web_visuobject_insp_visibility'))}"${isClass ? '' : ' disabled'}>${visOptions(m.visibility)}</select></td>
            <td><input data-row="${i}" data-field="m-name" value="${e(m.name)}" spellcheck="false" autocomplete="off" aria-label="${e(t('web_visuobject_new_name'))}"${ctor ? ' disabled' : ''}></td>
            <td><input data-row="${i}" data-field="m-params" value="${e(paramsText(m.params))}" spellcheck="false" autocomplete="off" placeholder="—" aria-label="${e(t('web_visuobject_insp_params'))}"></td>
            <td><input data-row="${i}" data-field="m-type" value="${e(ctor ? '' : m.type)}" list="vo-types" spellcheck="false" autocomplete="off" placeholder="${ctor ? e(t('web_visuobject_insp_constructor')) : 'void'}" aria-label="${e(t('web_visuobject_insp_return'))}"${ctor ? ' disabled' : ''}></td>
            <td class="c"><input type="checkbox" data-row="${i}" data-field="m-static"${m.isStatic ? ' checked' : ''} aria-label="static"${ctor ? ' disabled' : ''}></td>
            <td class="c"><input type="checkbox" data-row="${i}" data-field="m-abstract"${m.isAbstract ? ' checked' : ''} aria-label="abstract"${ctor || !canAbstract ? ' disabled' : ''}></td>
            <td><button class="icon" data-row="${i}" data-inspector="delete-member" aria-label="${e(t('web_visuobject_delete'))}" data-tip="${e(t('web_visuobject_delete'))}">${icons.trash}</button></td>
          </tr>`
        })
        .join('')
      body = `<table class="vo-members"><thead><tr><th>${e(t('web_visuobject_insp_visibility'))}</th><th>${e(t('web_visuobject_new_name'))}</th><th>${e(t('web_visuobject_insp_params'))}</th><th>${e(t('web_visuobject_insp_return'))}</th><th>static</th><th>abstract</th><th></th></tr></thead><tbody>${rows || `<tr><td colspan="7" class="vo-inspector-empty">${e(t('web_visuobject_insp_no_methods'))}</td></tr>`}</tbody></table>
        <div class="vo-inspector-row">
          <button class="text-button" data-inspector="add-method">+ ${e(t('web_visuobject_insp_add_method'))}</button>
          ${isClass ? `<span class="vo-insp-sep" aria-hidden="true"></span><span class="vo-insp-label">${e(t('web_visuobject_insp_generate'))}</span>
          <button class="text-button" data-inspector="gen-constructor" data-tip="${e(t('web_visuobject_insp_gen_constructor_tip'))}">${e(t('web_visuobject_insp_gen_constructor'))}</button>
          <button class="text-button" data-inspector="gen-accessors" data-tip="${e(t('web_visuobject_insp_gen_accessors_tip'))}">${e(t('web_visuobject_insp_gen_accessors'))}</button>
          <button class="text-button" data-inspector="gen-tostring">toString()</button>` : ''}
        </div>`
    }
    this.inspector.dataset.rel = `class:${cls.name}`
    this.inspector.innerHTML = `
      <div class="vo-insp-head">
        <p class="vo-inspector-kind">${e(t(isClass ? 'web_visuobject_new_class' : 'web_visuobject_new_interface'))} <b>${e(cls.name)}</b></p>
        <div class="vo-insp-tabs" role="tablist">${tab('class', t(isClass ? 'web_visuobject_new_class' : 'web_visuobject_new_interface'))}${tab('fields', `${t('web_visuobject_insp_fields')} (${fields.length})`)}${tab('methods', `${t('web_visuobject_insp_methods')} (${methods.length})`)}</div>
      </div>
      ${body}${types}`
    const edit = (run: (source: string, c: UmlClass) => string, extra?: (p: JavaProject) => JavaProject) => {
      this.message('')
      let next = this.editClass(this.project, cls.name, run)
      if (extra) next = extra(next)
      this.setProject(next, cls.path)
    }
    const member = (c: UmlClass, el: HTMLElement) => c.members[Number(el.dataset.row)]
    for (const b of this.inspector.querySelectorAll<HTMLElement>('[data-class-tab]'))
      b.addEventListener('click', () => {
        this.classTab = b.dataset.classTab as typeof this.classTab
        this.renderInspector()
      })
    for (const el of this.inspector.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[data-field]')) {
      el.addEventListener('change', () => {
        const field = el.dataset.field!
        const on = el instanceof HTMLInputElement && el.checked
        const value = el.value.trim()
        if (field === 'name') {
          if (value && value !== cls.name) this.renameClassTo(cls, value)
        } else if (field === 'package') {
          const to = pathFor(el.value, fileNameOf(cls.path))
          if (to === cls.path) return
          if (this.project.files.some((f) => f.path === to)) return this.message(t('web_visuobject_new_exists', fileNameOf(to)))
          this.openTabs = this.openTabs.map((p) => (p === cls.path ? to : p))
          this.currentPackage = el.value
          this.setProject(moveFile(this.project, cls.path, to), to)
        } else if (field === 'visibility') edit((src, c) => setPublic(src, c, el.value === 'public'))
        else if (field === 'abstract')
          edit((src, c) => {
            const base = on ? setFinal(src, c, false) : src
            return setAbstract(base, parseClasses(base).find((x) => x.name === c.name) ?? c, on)
          })
        else if (field === 'final') edit((src, c) => setFinal(src, c, on))
        else if (field === 'superclass') {
          const sup = el.value || undefined
          edit((src, c) => setSuperclass(src, c, sup), (p) => (sup ? this.importFor(p, cls.name, sup) : p))
        } else if (field === 'iface') {
          const name = el.value
          edit((src, c) => (on ? addInterface(src, c, name) : removeInterface(src, c, name)), (p) => (on ? this.importFor(p, cls.name, name) : p))
        } else if (field === 'doc') edit((src, c) => setClassDoc(src, c, el.value))
        else if (field.startsWith('f-')) {
          if ((field === 'f-name' && !identifier.test(value)) || (field === 'f-type' && !value)) return this.message(t('web_visuobject_bad_name', value))
          const change: Partial<FieldInfo> =
            field === 'f-vis' ? { visibility: el.value as Visibility } : field === 'f-name' ? { name: value } : field === 'f-type' ? { type: value } : field === 'f-static' ? { isStatic: on } : field === 'f-final' ? { isFinal: on } : { init: el.value }
          const old = cls.members[Number(el.dataset.row)]?.name
          edit(
            (src, c) => setField(src, member(c, el), change),
            (p) => (field === 'f-name' && old && p.uml?.[relationKey(cls.name, old)] ? { ...p, uml: renameInfo(p.uml, relationKey(cls.name, old), relationKey(cls.name, value)) } : p),
          )
        } else if (field.startsWith('m-')) {
          let change: Partial<MethodInfo>
          if (field === 'm-params') {
            const params = parseParams(el.value)
            if (!params) return this.message(t('web_visuobject_insp_bad_params', el.value))
            change = { params }
          } else if (field === 'm-name') {
            if (!identifier.test(value)) return this.message(t('web_visuobject_bad_name', value))
            change = { name: value }
          } else change = field === 'm-vis' ? { visibility: el.value as Visibility } : field === 'm-type' ? { type: value || 'void' } : field === 'm-static' ? { isStatic: on } : { isAbstract: on }
          edit((src, c) => {
            const out = setMethod(src, c, member(c, el), change)
            // Abstrakte Methode in einer normalen Klasse: Die Klasse muss dann auch abstract sein.
            if (field === 'm-abstract' && on && !c.isAbstract) {
              const again = parseClasses(out).find((x) => x.name === c.name)
              return again ? setAbstract(setFinal(out, again, false), parseClasses(setFinal(out, again, false)).find((x) => x.name === c.name)!, true) : out
            }
            return out
          })
        }
      })
      if (el instanceof HTMLInputElement && el.type === 'text') el.addEventListener('keydown', (ev) => ev.key === 'Enter' && el.blur())
    }
    const on = (action: string, run: (b: HTMLElement) => void) => {
      for (const b of this.inspector.querySelectorAll<HTMLElement>(`[data-inspector="${action}"]`)) b.addEventListener('click', () => run(b))
    }
    on('delete-class', () => this.deleteClassFromProject(cls))
    on('delete-member', (b) => edit((src, c) => deleteMember(src, member(c, b))))
    on('add-field', () => edit((src, c) => addMember(src, c, `- ${this.freeMember(cls, 'attribut')}: int`)))
    on('add-method', () => edit((src, c) => addMember(src, c, `+ ${this.freeMember(cls, 'methode')}(): void`)))
    on('gen-constructor', () => edit((src, c) => addFieldConstructor(src, c)))
    on('gen-accessors', () => edit((src, c) => addGettersSetters(src, c)))
    on('gen-tostring', () => edit((src, c) => addToString(src, c)))
    if (focused) {
      const [row, field] = focused.split('|')
      this.inspector.querySelector<HTMLElement>(row ? `[data-row="${row}"][data-field="${field}"]` : `[data-field="${field}"]`)?.focus({ preventScroll: true })
    }
  }

  /** Freier Name für ein neues Mitglied: `attribut`, `attribut2` … */
  private freeMember(cls: ProjectClass, base: string): string {
    let name = base
    for (let n = 2; cls.members.some((m) => m.name === name); n++) name = base + n
    return name
  }

  /** Abhängigkeit im Inspektor: erklären, warum es keine Assoziation ist, und sie auf Wunsch zu einer machen. */
  private renderDependency(d: Dependency) {
    this.closeEnd()
    this.inspector.dataset.rel = this.relSelection
    this.inspector.innerHTML = `<div class="vo-inspector-row">
        <p class="vo-inspector-kind">${e(t('web_visuobject_dep_title', d.kind))}</p>
        <p>${e(t(`web_visuobject_dep_${d.kind}_text`, d.from, d.to, d.methods.join(', ')))}</p>
      </div>
      <p class="vo-inspector-empty">${e(t('web_visuobject_dep_hint', d.from, d.to))}</p>
      <div class="vo-inspector-row"><button class="text-button" data-inspector="to-assoc">${e(t('web_visuobject_dep_to_assoc', d.to))}</button></div>`
    this.inspector.querySelector('[data-inspector=to-assoc]')!.addEventListener('click', () => {
      const added = this.addAssociationField(this.project, d.from, d.to, false)
      this.relSelection = `assoc:${relationKey(d.from, added.field)}`
      this.setProject(added.project, this.findClass(d.from)?.path)
    })
  }

  // MARK: - Werkzeugleiste

  private setTool(tool: Tool) {
    this.tool = tool
    this.pendingFrom = undefined
    for (const el of this.canvas.querySelectorAll('.uml-class.source')) el.classList.remove('source')
    for (const b of this.shell.querySelectorAll<HTMLElement>('.vo-tool')) b.setAttribute('aria-pressed', String(b.dataset.tool === tool))
    this.canvas.dataset.tool = tool
    this.message(tool === 'select' ? '' : t(`web_visuobject_tool_${tool}_tip`), true)
  }

  /** Werkzeug anklicken wählt es; Klasse oder Interface lässt sich auch direkt auf die Fläche ziehen. */
  private onToolDown(ev: PointerEvent, tool: Tool) {
    if (ev.button !== 0) return
    if (tool !== 'class' && tool !== 'interface') return this.setTool(this.tool === tool ? 'select' : tool)
    ev.preventDefault()
    const start = { x: ev.clientX, y: ev.clientY }
    let ghost: HTMLElement | undefined
    const move = (m: PointerEvent) => {
      if (!ghost && Math.hypot(m.clientX - start.x, m.clientY - start.y) < 6) return
      if (!ghost) {
        ghost = document.createElement('div')
        ghost.className = `vo-tool-ghost${tool === 'interface' ? ' interface' : ''}`
        ghost.innerHTML = `${tool === 'interface' ? '<small>«interface»</small>' : ''}<b>${e(t(tool === 'class' ? 'web_visuobject_new_class_name' : 'web_visuobject_new_interface_name'))}</b>`
        document.body.append(ghost)
      }
      ghost.style.left = `${m.clientX}px`
      ghost.style.top = `${m.clientY}px`
    }
    const up = (m: PointerEvent) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      if (!ghost) return this.setTool(this.tool === tool ? 'select' : tool)
      ghost.remove()
      const r = this.canvas.getBoundingClientRect()
      if (m.clientX < r.left || m.clientX > r.right || m.clientY < r.top || m.clientY > r.bottom) return
      this.setTool('select')
      this.newClass(tool, { x: m.clientX - r.left + this.canvas.scrollLeft - 60, y: m.clientY - r.top + this.canvas.scrollTop - 14 })
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  /** Mit gewähltem Werkzeug auf die Fläche: Klasse anlegen oder Beziehung beginnen bzw. beenden. */
  private useTool(ev: PointerEvent) {
    ev.preventDefault()
    const tool = this.tool
    const r = this.canvas.getBoundingClientRect()
    const at = { x: ev.clientX - r.left + this.canvas.scrollLeft, y: ev.clientY - r.top + this.canvas.scrollTop }
    if (tool === 'class' || tool === 'interface') {
      this.setTool('select')
      this.newClass(tool, { x: at.x - 60, y: at.y - 14 })
      return
    }
    const box = (ev.target as HTMLElement).closest<HTMLElement>('.uml-class')
    if (!box) {
      if (this.pendingFrom) this.setTool(tool)
      return
    }
    const name = box.dataset.class!
    if (this.pendingFrom && this.pendingFrom !== name) {
      const from = this.pendingFrom
      this.connectWith(from, name, tool as RelationTool)
      return
    }
    this.startConnect(ev, name, tool as RelationTool)
  }

  /** Beziehung mit dem Werkzeug anlegen, wenn sie zwischen diesen Klassen geht. */
  private connectWith(from: string, to: string, kind: RelationTool) {
    const a = this.findClass(from)
    const b = this.findClass(to)
    this.setTool('select')
    if (!a || !b) return
    if (!relationChoices(a, b).includes(kind)) return this.message(t(`web_visuobject_tool_not_${kind}`, from, to))
    this.createRelation(from, to, kind)
  }

  // MARK: - Beziehung ziehen

  /** Vom Griff am gewählten Kasten zu einer anderen Klasse ziehen, dann die Art wählen. */
  private startConnect(ev: PointerEvent, from: string, kind?: RelationTool) {
    ev.preventDefault()
    const ghost = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    ghost.setAttribute('class', 'vo-rel ghost')
    this.lines.append(ghost)
    const box = this.canvas.querySelector<HTMLElement>(`.uml-class[data-class="${CSS.escape(from)}"]`)!
    const local = (m: PointerEvent) => {
      const r = this.canvas.getBoundingClientRect()
      return { x: m.clientX - r.left + this.canvas.scrollLeft, y: m.clientY - r.top + this.canvas.scrollTop }
    }
    const start = { x: box.offsetLeft + box.offsetWidth, y: box.offsetTop + box.offsetHeight / 2 }
    const targetAt = (m: PointerEvent) => {
      const el = document.elementFromPoint(m.clientX, m.clientY)?.closest<HTMLElement>('.uml-class')
      return el && el.dataset.class !== from ? el : undefined
    }
    const move = (m: PointerEvent) => {
      const p = local(m)
      ghost.setAttribute('x1', String(start.x))
      ghost.setAttribute('y1', String(start.y))
      ghost.setAttribute('x2', String(p.x))
      ghost.setAttribute('y2', String(p.y))
      for (const el of this.canvas.querySelectorAll('.uml-class.drop')) el.classList.remove('drop')
      targetAt(m)?.classList.add('drop')
    }
    const up = (m: PointerEvent) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      ghost.remove()
      const target = targetAt(m)
      target?.classList.remove('drop')
      if (target && kind) this.connectWith(from, target.dataset.class!, kind)
      else if (target) this.showRelationMenu(from, target.dataset.class!, local(m))
      else if (kind) {
        // Nicht gezogen: jetzt die zweite Klasse anklicken.
        this.pendingFrom = from
        this.canvas.querySelector(`.uml-class[data-class="${CSS.escape(from)}"]`)?.classList.add('source')
        this.message(t('web_visuobject_tool_pick_second', from), true)
      }
    }
    move(ev)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  private showRelationMenu(from: string, to: string, at: Point) {
    const a = this.findClass(from)
    const b = this.findClass(to)
    if (!a || !b) return
    const choices = relationChoices(a, b).map((kind): [RelationTool, string] => [kind, kind === 'association' ? 'web_visuobject_rel_directed' : `web_visuobject_rel_${kind}`])
    if (choices.length === 0) return this.message(t('web_visuobject_rel_impossible', from, to))
    const menu = document.createElement('div')
    menu.className = 'vo-relmenu'
    menu.setAttribute('role', 'menu')
    menu.style.left = `${at.x}px`
    menu.style.top = `${at.y}px`
    menu.innerHTML = `<p>${e(t('web_visuobject_rel_menu', from, to))}</p>` + choices.map(([kind, label]) => `<button role="menuitem" data-kind="${kind}">${relationIcon(kind)}${e(t(label))}</button>`).join('')
    this.canvas.append(menu)
    const close = () => {
      menu.remove()
      document.removeEventListener('pointerdown', outside, true)
      document.removeEventListener('keydown', escape, true)
    }
    const outside = (ev: Event) => {
      if (!menu.contains(ev.target as Node)) close()
    }
    const escape = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        ev.stopPropagation()
        close()
      }
    }
    menu.addEventListener('click', (ev) => {
      const kind = (ev.target as HTMLElement).closest<HTMLElement>('[data-kind]')?.dataset.kind
      if (!kind) return
      close()
      this.createRelation(from, to, kind as RelationTool)
    })
    document.addEventListener('pointerdown', outside, true)
    document.addEventListener('keydown', escape, true)
    menu.querySelector<HTMLElement>('button')?.focus()
  }
}

/** `link`: Assoziation ohne Navigation (einfache Linie), `association`: gerichtet mit Pfeil. */
type RelationTool = AssocKind | 'link' | 'extends' | 'implements'
type Tool = 'select' | 'class' | 'interface' | RelationTool
const paletteTools: Tool[] = ['select', 'class', 'interface', 'link', 'association', 'aggregation', 'composition', 'extends', 'implements']

/** Welche Beziehungen von `a` nach `b` gehen: Attribute nur in Klassen, erben nur Klasse von Klasse bzw. Interface von Interface. */
function relationChoices(a: UmlClass, b: UmlClass): RelationTool[] {
  const out: RelationTool[] = []
  if (a.kind === 'class') out.push('link', 'association', 'aggregation', 'composition')
  if (a.kind === b.kind && (a.kind === 'class' ? a.superclass !== b.name : !a.interfaces.includes(b.name))) out.push('extends')
  if (a.kind === 'class' && b.kind === 'interface' && !a.interfaces.includes(b.name)) out.push('implements')
  return out
}

/** Symbol in der Werkzeugleiste. */
function toolIcon(tool: Tool): string {
  if (tool === 'select')
    return '<svg class="vo-relicon" viewBox="0 0 28 18" width="28" height="18" aria-hidden="true"><path d="M10 2 L10 15 L13.2 11.8 L15.6 16.5 L17.6 15.5 L15.2 10.9 L19.5 10.9 z" fill="currentColor"/></svg>'
  if (tool === 'class' || tool === 'interface')
    return `<svg class="vo-relicon" viewBox="0 0 28 18" width="28" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4" y="1.5" width="20" height="15" rx="1"/><line x1="4" y1="7" x2="24" y2="7"/><line x1="4" y1="11.5" x2="24" y2="11.5"/>${tool === 'interface' ? '<text x="14" y="5.6" font-size="4.5" text-anchor="middle" fill="currentColor" stroke="none">«I»</text>' : ''}</svg>`
  return relationIcon(tool)
}

/** Kleines Symbol im Menü: Linie mit offener Pfeilspitze, hohler oder gefüllter Raute, hohlem Dreieck. */
function relationIcon(kind: string): string {
  const line = (x1: number, x2: number, dashed = false) => `<line x1="${x1}" y1="7" x2="${x2}" y2="7"${dashed ? ' stroke-dasharray="3 2"' : ''}/>`
  const shape =
    kind === 'link'
      ? line(1, 27)
      : kind === 'association'
      ? `${line(1, 27)}<path d="M21 2 L27 7 L21 12" fill="none"/>`
      : kind === 'aggregation' || kind === 'composition'
        ? `${line(13, 27)}<path d="M1 7 L7 3 L13 7 L7 11 z" fill="${kind === 'composition' ? 'currentColor' : 'none'}"/>`
        : `${line(1, 18, kind === 'implements')}<path d="M18 1.5 L27 7 L18 12.5 z" fill="none"/>`
  return `<svg class="vo-relicon" viewBox="0 0 28 14" width="28" height="14" aria-hidden="true" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">${shape}</svg>`
}

/** Schnittpunkt der Strecke von der Mitte `inside` Richtung `toward` mit dem Rand des Rechtecks. */
function edgePoint(r: { x: number; y: number; w: number; h: number }, inside: Point, toward: Point): Point {
  const dx = toward.x - inside.x
  const dy = toward.y - inside.y
  const sx = dx === 0 ? Infinity : r.w / 2 / Math.abs(dx)
  const sy = dy === 0 ? Infinity : r.h / 2 / Math.abs(dy)
  const s = Math.min(sx, sy, 1)
  return { x: Math.round(inside.x + dx * s), y: Math.round(inside.y + dy * s) }
}
