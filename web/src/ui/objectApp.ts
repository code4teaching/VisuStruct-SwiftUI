import {
  addInterface,
  addMember,
  deleteClass,
  deleteMember,
  parseClasses,
  parseUmlLine,
  removeInterface,
  renameClass,
  replaceMember,
  setAbstract,
  setFieldType,
  setSuperclass,
  umlText,
  type UmlClass,
  type UmlMember,
} from '../core/classModel'
import {
  addFile,
  addPackage,
  classFileText,
  exampleProject,
  fileNameOf,
  filesIn,
  isPackageName,
  moveFile,
  packageOf,
  packagesOf,
  pathFor,
  projectClasses,
  projectFromFiles,
  projectFromJSON,
  projectToJSON,
  removeFile,
  removePackage,
  renamePackage,
  updateFile,
  type JavaProject,
  type ProjectClass,
} from '../core/javaProject'
import {
  associations,
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
  type Generalization,
} from '../core/umlRelations'
import { gearIcon } from './app'
import { currentLanguage, t } from './i18n'
import { icons } from './icons'
import { JavaEditor } from './javaEditor'
import { ObjectLayout } from './objectLayout'
import { setVisuBotMode, worldChooserHTML, type WorldChoice } from './visubotView'

/**
 * Welt VisuObject: links der Package Explorer (Projekt › src › Packages › Dateien › Klassen › Mitglieder),
 * in der Mitte der Java-Code der geöffneten Datei, rechts das Klassendiagramm aller Dateien.
 * Tippen baut das Diagramm neu, eine Änderung im Diagramm schreibt nur die betroffene Stelle im Code neu.
 * Siehe docs/visuobject/PLAN.md.
 */

const projectKey = 'visuobject.project'
/** Stufe 1 hatte nur eine Datei. */
const oldCodeKey = 'visuobject.code'
const activeKey = 'visuobject.active'
const positionsKey = 'visuobject.positions'
const treeKey = 'visuobject.tree'
const tabsKey = 'visuobject.tabs'
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
  private treeSelection?: NodeId
  private open = new Map<NodeId, boolean>()
  private history: string[] = []
  private future: string[] = []
  private lastTyping = 0
  /** Gerade bearbeitetes Eingabefeld im Diagramm oder Explorer: dann nicht neu zeichnen. */
  private editing = false

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
          <div class="vo-tree-tools">
            <button class="text-button" data-action="add-package" data-tip="${e(t('web_visuobject_add_package_tip'))}">+ ${e(t('web_visuobject_add_package'))}</button>
            <button class="text-button" data-action="tree-add-class" data-tip="${e(t('web_visuobject_add_class_tip'))}">+ ${e(t('web_visuobject_add_class'))}</button>
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
              <button class="text-button" data-action="add-class" data-tip="${e(t('web_visuobject_add_class_tip'))}">+ ${e(t('web_visuobject_add_class'))}</button>
              <button class="text-button" data-action="add-interface" data-tip="${e(t('web_visuobject_add_interface_tip'))}">+ ${e(t('web_visuobject_add_interface'))}</button>
              <button class="text-button" data-action="layout" data-tip="${e(t('web_visuobject_layout_tip'))}">${e(t('web_visuobject_layout'))}</button>
            </div>
            <button class="vo-collapse" data-collapse="diagram" aria-label="${e(t('web_visuobject_pane_hide'))}" data-tip="${e(t('web_visuobject_pane_hide'))}">–</button>
          </header>
          <div class="vo-stage">
            <div class="vo-canvas" tabindex="-1"><svg class="vo-frames" aria-hidden="true"></svg><svg class="vo-lines"></svg></div>
            <aside class="vo-inspector" aria-label="${e(t('web_visuobject_inspector'))}" hidden></aside>
          </div>
          <footer class="vo-foot"><p class="vo-status" role="status"></p><small class="vo-hint">${e(t('web_visuobject_edit_hint'))}</small></footer>
        </section>
      </main>`
    this.canvas = this.shell.querySelector('.vo-canvas')!
    this.lines = this.canvas.querySelector('.vo-lines')!
    this.frames = this.canvas.querySelector('.vo-frames')!
    this.status = this.shell.querySelector('.vo-status')!
    this.inspector = this.shell.querySelector('.vo-inspector')!
    this.tree = this.shell.querySelector('.vo-tree')!
    this.tabs = this.shell.querySelector('.vo-tabs')!
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
      },
      t('web_visuobject_code'),
    )
    const on = (action: string, run: () => void) => this.shell.querySelector(`[data-action=${action}]`)!.addEventListener('click', run)
    on('new', () => this.setProject({ name: t('web_visuobject_project_name'), files: [], packages: [] }, undefined))
    on('example', () => this.setProject(exampleProject(), 'tiere/Tier.java'))
    on('open', () => this.openFiles())
    on('save', () => void this.save())
    on('undo', () => this.undo(false))
    on('redo', () => this.undo(true))
    on('add-class', () => this.newClass('class'))
    on('tree-add-class', () => this.newClass('class'))
    on('add-interface', () => this.newClass('interface'))
    on('add-package', () => this.newPackage())
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
    this.tree.addEventListener('click', (ev) => this.onTreeClick(ev))
    this.tabs.addEventListener('click', (ev) => this.onTabClick(ev))
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
        return `<div class="vo-tab${on ? ' active' : ''}" data-tab="${e(path)}">
          <button role="tab" aria-selected="${on}" tabindex="${on ? 0 : -1}" data-tip="src/${e(path)}">${e(fileNameOf(path))}</button>
          <button class="vo-tab-close" data-close aria-label="${e(t('web_visuobject_close_tab', fileNameOf(path)))}" tabindex="-1">×</button>
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
    this.classes = projectClasses(this.project)
    if (this.selection && !this.findClass(this.selection.cls)) this.selection = undefined
    if (this.relSelection && !this.findRelation(this.relSelection)) this.relSelection = undefined
    if (!this.editing) {
      this.render()
      this.renderTree()
    }
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

  private message(text: string) {
    this.status.textContent = text
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
        this.setProject(project, project.files[0]?.path)
        return
      }
      const saved = files.find((f) => /\.visuobject$/i.test(f.name))
      if (saved) {
        const project = projectFromJSON(await saved.text())
        if (!project) throw new Error('format')
        this.setProject(project, project.files[0]?.path)
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

  /** Als ZIP wie in Eclipse oder BlueJ: `Projekt/src/paket/Klasse.java`. */
  private async save() {
    const { projectToZip } = await import('./projectZip')
    const data = projectToZip(this.project)
    download(`${this.project.name || 'Projekt'}.zip`, data.slice().buffer, 'application/zip')
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

  private newClass(kind: 'class' | 'interface') {
    const name = this.uniqueClassName(t(kind === 'class' ? 'web_visuobject_new_class_name' : 'web_visuobject_new_interface_name'))
    const pkg = this.currentPackage ?? (this.active ? packageOf(this.active) : (packagesOf(this.project)[0] ?? ''))
    const path = pathFor(pkg, `${name}.java`)
    this.selection = { cls: name }
    this.open.set(`pkg:${pkg}`, true)
    this.setProject(addFile(this.project, path, classFileText(pkg, name, kind)), path)
    const cls = this.findClass(name)
    if (cls) this.showInCode(cls)
    const box = this.canvas.querySelector<HTMLElement>(`.uml-class[data-class="${CSS.escape(name)}"]`)
    box?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    this.startEditing(box?.querySelector<HTMLElement>('.uml-name') ?? null)
  }

  private newPackage() {
    const base = t('web_visuobject_new_package_name')
    let name = base
    for (let n = 2; packagesOf(this.project).includes(name); n++) name = base + n
    this.currentPackage = name
    this.treeSelection = `pkg:${name}`
    this.setProject(addPackage(this.project, name))
    this.startEditing(this.tree.querySelector<HTMLElement>(`[data-node="pkg:${CSS.escape(name)}"] .vo-label`))
  }

  /** Klasse umbenennen; heißt die Datei wie die Klasse, heißt sie danach wie der neue Name. */
  private renameClassTo(cls: ProjectClass, name: string) {
    if (name === cls.name) return
    if (!identifier.test(name) || this.findClass(name)) return this.message(t('web_visuobject_bad_name', name))
    const file = this.project.files.find((f) => f.path === cls.path)!
    let next = updateFile(this.project, cls.path, renameClass(file.text, cls, name))
    let path = cls.path
    if (fileNameOf(cls.path) === `${cls.name}.java`) {
      path = pathFor(cls.pkg, `${name}.java`)
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
      if (text && text !== this.project.name) this.setProject({ ...this.project, name: text })
    } else if (kind === 'pkg') {
      if (!text || text === id) return
      if (!isPackageName(text) || packagesOf(this.project).includes(text)) return this.message(t('web_visuobject_bad_package', text))
      if (this.currentPackage === id) this.currentPackage = text
      this.treeSelection = `pkg:${text}`
      this.open.set(`pkg:${text}`, true)
      this.setProject(renamePackage(this.project, id, text), this.active && packageOf(this.active) === id ? pathFor(text, fileNameOf(this.active)) : this.active)
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
    // Projekt, src, Packages und Klassen offen; Dateien zu, außer der geöffneten.
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
    const packages = packagesOf(this.project)
      .map((pkg) => {
        const files = filesIn(this.project, pkg).map((f) => fileRow(f.path, 3)).join('')
        const label = pkg || t('web_visuobject_default_package')
        return row(`pkg:${pkg}`, 2, `<span class="vo-badge package${files ? '' : ' empty'}" aria-hidden="true"></span>`, label, { children: files, value: pkg, action: true })
      })
      .join('')
    const src = row('src', 1, '<span class="vo-badge folder" aria-hidden="true"></span>', 'src', { children: packages || `<li class="vo-tree-empty">${e(t('web_visuobject_tree_empty'))}</li>` })
    this.tree.innerHTML = `<ul role="group">${row('project', 0, '<span class="vo-badge project" aria-hidden="true"></span>', this.project.name, { children: src })}</ul>`
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
    if (target.closest('[data-toggle]')) return this.toggle(id)
    if (target.closest('[data-delete]')) return this.deleteNode(id)
    // Doppelklick selbst erkennen (der erste Klick zeichnet neu): Name ändern.
    const now = Date.now()
    const twice = this.treeClick.node === id && now - this.treeClick.time < 450
    this.treeClick = { node: id, time: twice ? 0 : now }
    if (twice && !id.startsWith('member:') && id !== 'src') {
      this.startEditing(this.tree.querySelector<HTMLElement>(`[data-node="${CSS.escape(id)}"] > .vo-row .vo-label`))
      return
    }
    this.selectNode(id)
  }

  private selectNode(id: NodeId) {
    const [kind, ...rest] = id.split(':')
    const value = rest.join(':')
    this.treeSelection = undefined
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
      this.currentPackage = cls.pkg
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
    const target = ev.target as HTMLElement
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
    this.currentPackage = cls.pkg
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
    const fields = cls.members.map((m, i) => (m.kind === 'field' ? row(m, i) : '')).join('')
    const methods = cls.members.map((m, i) => (m.kind !== 'field' ? row(m, i) : '')).join('')
    const others = this.classes.filter((c) => c.kind === 'class' && c.name !== cls.name)
    const deleteButton = `<button class="icon" data-class-action="delete" data-tip="${e(t('web_visuobject_delete_class'))}" aria-label="${e(t('web_visuobject_delete_class'))}">${icons.trash}</button>`
    const tools =
      sel && cls.kind === 'class'
        ? `<div class="uml-tools">
            <label>${e(t('web_visuobject_superclass'))}
              <select data-tool="superclass">
                <option value="">${e(t('web_visuobject_no_superclass'))}</option>
                ${others.map((c) => `<option${c.name === cls.superclass ? ' selected' : ''}>${e(c.name)}</option>`).join('')}
                ${cls.superclass && !others.some((c) => c.name === cls.superclass) ? `<option selected>${e(cls.superclass)}</option>` : ''}
              </select>
            </label>
            <label><input type="checkbox" data-tool="abstract"${cls.isAbstract ? ' checked' : ''}> ${e(t('web_visuobject_abstract'))}</label>
            ${deleteButton}
          </div>`
        : sel
          ? `<div class="uml-tools">${deleteButton}</div>`
          : ''
    const add = (kind: 'field' | 'method') =>
      sel ? `<li class="uml-add" data-add="${kind}">+ ${e(t(kind === 'field' ? 'web_visuobject_add_field' : 'web_visuobject_add_method'))}</li>` : ''
    box.innerHTML = `
      ${sel && sel.member === undefined ? `<button class="uml-connect" data-connect aria-label="${e(t('web_visuobject_connect'))}" data-tip="${e(t('web_visuobject_connect'))}" tabindex="-1"></button>` : ''}
      <header class="uml-head">${cls.kind === 'interface' ? '<small>«interface»</small>' : cls.isAbstract ? '<small>{abstract}</small>' : ''}<span class="uml-name" data-value="${e(cls.name)}">${e(cls.name)}</span></header>
      ${cls.kind === 'interface' && !fields ? '' : `<ul class="uml-fields">${fields}${add('field')}</ul>`}
      <ul class="uml-methods">${methods}${add('method')}</ul>
      ${tools}`
    box.querySelector<HTMLSelectElement>('[data-tool=superclass]')?.addEventListener('change', (ev) => {
      const value = (ev.target as HTMLSelectElement).value || undefined
      this.changeFile(cls.path, (s) => setSuperclass(s, cls, value), { cls: cls.name })
    })
    box.querySelector<HTMLInputElement>('[data-tool=abstract]')?.addEventListener('change', (ev) => {
      const on = (ev.target as HTMLInputElement).checked
      this.changeFile(cls.path, (s) => setAbstract(s, cls, on), { cls: cls.name })
    })
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
    const packages = packagesOf(this.project).filter((pkg) => this.classes.some((c) => c.pkg === pkg && boxes.has(c.name)))
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
          x += w + gap
          rowH = Math.max(rowH, h)
        }
        blockW = Math.max(blockW, x - gap)
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
    this.lines.innerHTML = parts.join('')
    this.renderInspector()
  }

  /** UML-Package: Rahmen um seine Klassen mit Reiter oben links. */
  private packageFrames(boxes: Map<string, HTMLElement>): string {
    const out: string[] = []
    for (const pkg of packagesOf(this.project)) {
      if (!pkg) continue
      const els = this.classes.filter((c) => c.pkg === pkg).map((c) => boxes.get(c.name)).filter((b): b is HTMLElement => !!b)
      if (els.length === 0) continue
      const x = Math.min(...els.map((b) => b.offsetLeft)) - 16
      const y = Math.min(...els.map((b) => b.offsetTop)) - 16
      const right = Math.max(...els.map((b) => b.offsetLeft + b.offsetWidth)) + 16
      const bottom = Math.max(...els.map((b) => b.offsetTop + b.offsetHeight)) + 16
      const tab = Math.max(70, pkg.length * 7.6 + 20)
      const current = this.currentPackage === pkg ? ' current' : ''
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
    let svg = `<line class="vo-rel" x1="${start.x}" y1="${start.y}" x2="${to.x}" y2="${to.y}"${r.navigable ? ' marker-end="url(#vo-arrow)"' : ''}${r.backNavigable ? ' marker-start="url(#vo-arrow)"' : ''}/>`
    if (diamond) {
      const p = (along: number, side: number) => `${from.x + u.x * along + n.x * side},${from.y + u.y * along + n.y * side}`
      svg += `<polygon class="vo-diamond${r.kind === 'composition' ? ' filled' : ''}" points="${p(0, 0)} ${p(10, 6)} ${p(20, 0)} ${p(10, -6)}"/>`
    }
    // Beschriftung an einem Ende: Multiplizität auf der einen, Rolle auf der anderen Seite, gleich weit weg.
    const end = (at: Point, dir: Point, along: number, multiplicity?: string, role?: string) => {
      const base = { x: at.x + dir.x * along, y: at.y + dir.y * along }
      const text = (side: number, value: string | undefined, cls: string) => {
        if (!value) return ''
        const x = base.x + n.x * side
        const y = base.y + n.y * side
        const anchor = Math.abs(n.x) < 0.35 ? 'middle' : n.x * side > 0 ? 'start' : 'end'
        return `<text class="vo-label-svg ${cls}" x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="middle">${e(value)}</text>`
      }
      return text(12, multiplicity, 'mult') + text(-12, role, 'role')
    }
    const room = Math.min(30, length / 3)
    svg += end(to, { x: -u.x, y: -u.y }, room, r.multiplicity, r.role)
    svg += end(from, u, diamond ? Math.min(42, length / 3) : room, r.sourceMultiplicity, r.sourceRole)
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
  private addAssociationField(project: JavaProject, from: string, to: string, many: boolean): { project: JavaProject; field: string } {
    const cls = projectClasses(project).find((c) => c.name === from)!
    const field = fieldNameFor(cls, to, many)
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
  private createRelation(from: string, to: string, kind: AssocKind | 'extends' | 'implements') {
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
      next = kind === 'association' ? added.project : this.setUml(added.project, relationKey(from, added.field), { kind })
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
        next = this.setUml(next, key, { reading: value === 'forward' || value === 'backward' ? value : undefined })
        break
      case 'navigable': {
        if (value === 'both' && !r.back) {
          const added = this.addAssociationField(next, r.to, r.from, isMany(r.sourceMultiplicity ?? '1'))
          next = this.setUml(added.project, key, { navigable: undefined, sourceRole: undefined, sourceMultiplicity: undefined })
          if (r.sourceMultiplicity && r.sourceMultiplicity !== (isMany(r.sourceMultiplicity) ? '0..*' : '1')) next = this.setUml(next, relationKey(r.to, added.field), { multiplicity: r.sourceMultiplicity })
        } else if (value !== 'both') {
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
          next = this.setUml(next, key, { navigable: value === 'none' ? false : undefined })
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
  private renderInspector() {
    const rel = this.relSelection ? this.findRelation(this.relSelection) : undefined
    if (!rel) {
      this.inspector.hidden = true
      this.inspector.innerHTML = ''
      return
    }
    if (this.inspector.contains(document.activeElement) && !this.inspector.hidden && this.inspector.dataset.rel === this.relSelection) return
    this.inspector.dataset.rel = this.relSelection
    this.inspector.hidden = false
    const head = `<header class="vo-inspector-head"><h3>${e(t('web_visuobject_inspector'))}</h3><button class="vo-collapse" data-inspector="close" aria-label="${e(t('web_visuobject_inspector_close'))}">×</button></header>`
    const remove = `<button class="text-button vo-danger" data-inspector="delete">${icons.trash} ${e(t('web_visuobject_rel_delete'))}</button>`
    if (!('key' in rel)) {
      const text = t(rel.kind === 'implements' ? 'web_visuobject_rel_implements_text' : 'web_visuobject_rel_extends_text', rel.from, rel.to)
      this.inspector.innerHTML = `${head}<p class="vo-inspector-kind">${e(t(rel.kind === 'implements' ? 'web_visuobject_rel_implements' : 'web_visuobject_rel_extends'))}</p><p>${e(text)}</p>${remove}`
    } else {
      const option = (value: string, label: string, current: string) => `<option value="${e(value)}"${value === current ? ' selected' : ''}>${e(label)}</option>`
      const kinds = (['association', 'aggregation', 'composition'] as const).map((k) => option(k, t(`web_visuobject_rel_${k}`).replace(/\s*\(.*\)$/, ''), rel.kind)).join('')
      const nav = rel.back ? 'both' : rel.navigable ? 'to' : 'none'
      const navs = [option('to', `${rel.from} → ${rel.to}`, nav), option('both', `${rel.from} ↔ ${rel.to}`, nav), option('none', t('web_visuobject_rel_undirected', rel.from, rel.to), nav)].join('')
      const reading = rel.reading ?? ''
      const readings = [option('', t('web_visuobject_rel_reading_none'), reading), option('forward', `${rel.from} ▶ ${rel.to}`, reading), option('backward', `${rel.to} ▶ ${rel.from}`, reading)].join('')
      const list = `<datalist id="vo-multiplicities">${multiplicities.map((m) => `<option value="${m}">`).join('')}</datalist>`
      const endFields = (title: string, roleKey: string, role: string | undefined, multKey: string, mult: string | undefined, roleHint: string) => `
        <fieldset>
          <legend>${e(title)}</legend>
          <label>${e(t('web_visuobject_rel_role'))}<input data-field="${roleKey}" value="${e(role ?? '')}" spellcheck="false" autocomplete="off"><small>${e(roleHint)}</small></label>
          <label>${e(t('web_visuobject_rel_multiplicity'))}<input data-field="${multKey}" list="vo-multiplicities" value="${e(mult ?? '')}" spellcheck="false" autocomplete="off" placeholder="1"></label>
        </fieldset>`
      this.inspector.innerHTML = `${head}
        <label>${e(t('web_visuobject_rel_kind'))}<select data-field="kind">${kinds}</select></label>
        <label>${e(t('web_visuobject_rel_name'))}<input data-field="name" value="${e(rel.name ?? '')}" placeholder="${e(t('web_visuobject_rel_name_ph'))}" autocomplete="off"></label>
        <label>${e(t('web_visuobject_rel_reading'))}<select data-field="reading">${readings}</select></label>
        <label>${e(t('web_visuobject_rel_navigable'))}<select data-field="navigable">${navs}</select></label>
        ${endFields(t('web_visuobject_rel_end', rel.to), 'role', rel.role, 'multiplicity', rel.multiplicity, t('web_visuobject_rel_role_field', rel.from, rel.role))}
        ${endFields(t('web_visuobject_rel_end', rel.from), 'sourceRole', rel.sourceRole, 'sourceMultiplicity', rel.sourceMultiplicity, rel.back ? t('web_visuobject_rel_role_field', rel.to, rel.back.field.name) : t('web_visuobject_rel_role_only_uml'))}
        ${list}
        ${remove}`
    }
    for (const el of this.inspector.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-field]')) {
      el.addEventListener('change', () => {
        const current = this.relSelection && this.findRelation(this.relSelection)
        if (current && 'key' in current) this.changeAssoc(current, el.dataset.field!, el.value)
      })
      if (el instanceof HTMLInputElement) el.addEventListener('keydown', (ev) => ev.key === 'Enter' && el.blur())
    }
    this.inspector.querySelector('[data-inspector=delete]')!.addEventListener('click', () => this.deleteRelation(this.relSelection!))
    this.inspector.querySelector('[data-inspector=close]')!.addEventListener('click', () => {
      this.relSelection = undefined
      this.render()
    })
  }

  // MARK: - Beziehung ziehen

  /** Vom Griff am gewählten Kasten zu einer anderen Klasse ziehen, dann die Art wählen. */
  private startConnect(ev: PointerEvent, from: string) {
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
      if (target) this.showRelationMenu(from, target.dataset.class!, local(m))
    }
    move(ev)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  private showRelationMenu(from: string, to: string, at: Point) {
    const a = this.findClass(from)
    const b = this.findClass(to)
    if (!a || !b) return
    const choices: [AssocKind | 'extends' | 'implements', string][] = []
    if (a.kind === 'class') choices.push(['association', 'web_visuobject_rel_association'], ['aggregation', 'web_visuobject_rel_aggregation'], ['composition', 'web_visuobject_rel_composition'])
    if (a.kind === 'class' && b.kind === 'class' && a.superclass !== to) choices.push(['extends', 'web_visuobject_rel_extends'])
    if (b.kind === 'interface' && !a.interfaces.includes(to)) choices.push([a.kind === 'interface' ? 'extends' : 'implements', a.kind === 'interface' ? 'web_visuobject_rel_extends' : 'web_visuobject_rel_implements'])
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
      this.createRelation(from, to, kind as AssocKind | 'extends' | 'implements')
    })
    document.addEventListener('pointerdown', outside, true)
    document.addEventListener('keydown', escape, true)
    menu.querySelector<HTMLElement>('button')?.focus()
  }
}

/** Kleines Symbol im Menü: Linie mit offener Pfeilspitze, hohler oder gefüllter Raute, hohlem Dreieck. */
function relationIcon(kind: string): string {
  const line = (x1: number, x2: number, dashed = false) => `<line x1="${x1}" y1="7" x2="${x2}" y2="7"${dashed ? ' stroke-dasharray="3 2"' : ''}/>`
  const shape =
    kind === 'association'
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
