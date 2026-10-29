import {
  addMember,
  deleteClass,
  deleteMember,
  parseClasses,
  parseUmlLine,
  relations,
  renameClass,
  replaceMember,
  setAbstract,
  setSuperclass,
  umlText,
  type UmlMember,
  type UmlRelation,
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
import { gearIcon } from './app'
import { currentLanguage, t } from './i18n'
import { icons } from './icons'
import { JavaEditor } from './javaEditor'
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
const explorerKey = 'visuobject.explorer'
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
const sidebarIcon = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></svg>'

export class ObjectApp {
  private shell: HTMLElement
  private editor!: JavaEditor
  private canvas!: HTMLElement
  private lines!: SVGSVGElement
  private frames!: SVGSVGElement
  private status!: HTMLElement
  private tree!: HTMLElement
  private fileLabel!: HTMLElement
  private project: JavaProject
  /** Geöffnete Datei (Pfad unter `src/`). */
  private active?: string
  /** Im Explorer gewähltes Package: Dort landen neue Klassen. */
  private currentPackage?: string
  private classes: ProjectClass[] = []
  private positions = new Map<string, Point>()
  private selection?: Selection
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
    this.shell = document.createElement('div')
    this.shell.className = 'shell visuobject'
    this.shell.classList.toggle('vo-explorer-hidden', stored(explorerKey) === '0')
    root.replaceWith(this.shell)
    this.build()
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
        <button class="vo-explorer-rail" data-action="show-explorer" aria-label="${e(t('web_visuobject_explorer_show'))}" data-tip="${e(t('web_visuobject_explorer_show'))}">${sidebarIcon}<span>${e(t('web_visuobject_explorer'))}</span></button>
        <section class="vo-explorer">
          <header class="vo-head">
            <h2>${e(t('web_visuobject_explorer'))}</h2>
            <button class="icon" data-action="hide-explorer" aria-label="${e(t('web_visuobject_explorer_hide'))}" data-tip="${e(t('web_visuobject_explorer_hide'))}">${sidebarIcon}</button>
          </header>
          <div class="vo-tree-tools">
            <button class="text-button" data-action="add-package" data-tip="${e(t('web_visuobject_add_package_tip'))}">+ ${e(t('web_visuobject_add_package'))}</button>
            <button class="text-button" data-action="tree-add-class" data-tip="${e(t('web_visuobject_add_class_tip'))}">+ ${e(t('web_visuobject_add_class'))}</button>
          </div>
          <div class="vo-tree" role="tree" aria-label="${e(t('web_visuobject_explorer'))}"></div>
        </section>
        <section class="vo-code">
          <header class="vo-head"><h2>${e(t('web_visuobject_code'))}</h2><span class="vo-file mono"></span></header>
          <div class="livecode-editor vo-editor"></div>
        </section>
        <section class="vo-diagram">
          <h2>${e(t('web_visuobject_diagram'))}</h2>
          <div class="vo-tools">
            <button class="text-button" data-action="add-class" data-tip="${e(t('web_visuobject_add_class_tip'))}">+ ${e(t('web_visuobject_add_class'))}</button>
            <button class="text-button" data-action="add-interface" data-tip="${e(t('web_visuobject_add_interface_tip'))}">+ ${e(t('web_visuobject_add_interface'))}</button>
            <button class="text-button" data-action="layout" data-tip="${e(t('web_visuobject_layout_tip'))}">${e(t('web_visuobject_layout'))}</button>
            <small class="vo-hint">${e(t('web_visuobject_edit_hint'))}</small>
          </div>
          <div class="vo-canvas" tabindex="-1"><svg class="vo-frames" aria-hidden="true"></svg><svg class="vo-lines" aria-hidden="true"></svg></div>
          <p class="vo-status" role="status"></p>
        </section>
      </main>`
    this.canvas = this.shell.querySelector('.vo-canvas')!
    this.lines = this.canvas.querySelector('.vo-lines')!
    this.frames = this.canvas.querySelector('.vo-frames')!
    this.status = this.shell.querySelector('.vo-status')!
    this.tree = this.shell.querySelector('.vo-tree')!
    this.fileLabel = this.shell.querySelector('.vo-file')!
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
    on('hide-explorer', () => this.setExplorer(false))
    on('show-explorer', () => this.setExplorer(true))
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
    this.tree.addEventListener('keydown', (ev) => this.onTreeKey(ev))
  }

  private chooseWorld(world: WorldChoice) {
    if (world === 'object') return
    setVisuBotMode(world)
    location.href = `${location.pathname}?${world === 'on' ? 'visubot' : 'visustruct'}${location.hash}`
  }

  private setExplorer(on: boolean) {
    this.shell.classList.toggle('vo-explorer-hidden', !on)
    store(explorerKey, on ? '1' : '0')
    this.drawLines()
    if (on) this.tree.querySelector<HTMLElement>('[tabindex="0"]')?.focus()
    else this.shell.querySelector<HTMLElement>('[data-action=show-explorer]')!.focus()
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
    this.fileLabel.textContent = file ? `src/${file.path}` : t('web_visuobject_no_file')
    store(activeKey, this.active ?? '')
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
    if (!parseUmlLine(text)) return this.message(t('web_visuobject_bad_line', text))
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
    if (!cls) {
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
        <marker id="vo-triangle" viewBox="0 0 12 12" refX="12" refY="6" markerWidth="14" markerHeight="14" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0 0 L12 6 L0 12 z" class="vo-hollow"/></marker>
        <marker id="vo-arrow" viewBox="0 0 12 12" refX="12" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0 0 L12 6 L0 12" class="vo-open"/></marker>
      </defs>`,
    ]
    const rels = relations(this.classes)
    // Mehrere Assoziationen zwischen denselben Klassen leicht versetzen.
    const pairCount = new Map<string, number>()
    for (const r of rels) {
      const a = boxes.get(r.from)
      const b = boxes.get(r.to)
      if (!a || !b || a === b) continue
      const key = [r.from, r.to].sort().join('|')
      const n = pairCount.get(key) ?? 0
      pairCount.set(key, n + 1)
      parts.push(this.relationSVG(r, a, b, n * 14))
    }
    this.lines.innerHTML = parts.join('')
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

  private relationSVG(r: UmlRelation, a: HTMLElement, b: HTMLElement, offset: number): string {
    const rect = (el: HTMLElement) => ({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight })
    const ra = rect(a)
    const rb = rect(b)
    const ca = { x: ra.x + ra.w / 2, y: ra.y + ra.h / 2 }
    const cb = { x: rb.x + rb.w / 2, y: rb.y + rb.h / 2 }
    // Senkrecht zur Linie versetzen, damit zwei Linien nicht übereinander liegen.
    const len = Math.hypot(cb.x - ca.x, cb.y - ca.y) || 1
    const nx = (-(cb.y - ca.y) / len) * offset
    const ny = ((cb.x - ca.x) / len) * offset
    const from = edgePoint(ra, { x: ca.x + nx, y: ca.y + ny }, { x: cb.x + nx, y: cb.y + ny })
    const to = edgePoint(rb, { x: cb.x + nx, y: cb.y + ny }, { x: ca.x + nx, y: ca.y + ny })
    const cls = r.kind === 'implements' ? 'vo-rel dashed' : 'vo-rel'
    const marker = r.kind === 'association' ? 'vo-arrow' : 'vo-triangle'
    let svg = `<line class="${cls}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" marker-end="url(#${marker})"/>`
    if (r.kind === 'association') {
      // Rolle und Multiplizität am Ziel, etwas neben der Linie.
      const ux = (from.x - to.x) / len
      const uy = (from.y - to.y) / len
      const px = to.x + ux * 26 - uy * 16
      const py = to.y + uy * 26 + ux * 16
      const qx = to.x + ux * 26 + uy * 16
      const qy = to.y + uy * 26 - ux * 16
      svg += `<text class="vo-label-svg" x="${px}" y="${py}" text-anchor="middle" dominant-baseline="middle">${e(r.multiplicity ?? '')}</text>`
      svg += `<text class="vo-label-svg role" x="${qx}" y="${qy}" text-anchor="middle" dominant-baseline="middle">${e(r.role ?? '')}</text>`
    }
    return svg
  }
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
