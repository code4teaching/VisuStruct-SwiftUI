import { progress } from '../learn/progress'
import { compareEntries, programBaseName, todayFolder, uniqueBaseName, validFolderName } from '../core/workspace'
import { t } from './i18n'
import { icons } from './icons'
import { sidebarIcon } from './learnPanel'
import {
  browserWorkspace,
  canPickFolder,
  forgetFolder,
  pickFolder,
  reopenFolder,
  storedFolder,
  type Workspace,
  type WsDir,
} from './workspaceStore'

/**
 * Spalte „Dateien“: ein Workspace als Baum. Oben die Klassen (z. B. 11FI1), darunter je Tag ein Ordner
 * (beim Speichern automatisch angelegt), darin die Programme: Struktogramm (.visustruct) und Code (.java).
 */

/** Wo ein Programm im Workspace liegt. */
export interface WorkspaceFile {
  dir: WsDir
  /** Name ohne Endung; dazu gehören `<base>.visustruct` und `<base>.java`. */
  base: string
  /** Für die Anzeige, z. B. `11FI1/2026-10-23/Rechner`. */
  path: string
}

/** Lernstand im Workspace (ein Lernstand je Workspace). */
export const progressFile = 'lernstand.json'

export interface FilesHost {
  open(xml: string, file: WorkspaceFile, java: string | undefined): void
  hide(): void
  message(text: string): void
  /** Lernstand aus dem Workspace übernommen: Lernbereich neu zeichnen. */
  progressLoaded(): void
}

const modeKey = 'visustruct.files.mode'
const classKey = 'visustruct.files.class'
const expandedKey = 'visustruct.files.expanded'

function storedList(key: string): string[] {
  try {
    const list: unknown = JSON.parse(stored(key) ?? '[]')
    return Array.isArray(list) ? list.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

function stored(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function store(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    /* ohne Speicher: nur für diese Sitzung */
  }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

interface AskOptions {
  title: string
  hint?: string
  /** Knöpfe, die ihren Text zurückgeben (z. B. vorhandene Klassen). */
  choices?: string[]
  /** Eingabefeld mit diesem Platzhalter. */
  input?: string
  ok?: string
  danger?: boolean
}

/** Rückfrage im Fenster selbst (`window.prompt`/`confirm` sind in eingebetteten Ansichten gesperrt). */
function ask(o: AskOptions): Promise<string | undefined> {
  return new Promise((resolve) => {
    const box = document.createElement('div')
    box.className = 'confirm'
    const choices = (o.choices ?? []).map((c) => `<button class="files-choice" data-choice="${esc(c)}">${icons.folder}<span>${esc(c)}</span></button>`).join('')
    box.innerHTML = `<form class="confirm-card files-ask" role="dialog" aria-label="${esc(o.title)}">
      <p><strong>${esc(o.title)}</strong></p>
      ${o.hint ? `<p class="hint">${esc(o.hint)}</p>` : ''}
      ${choices ? `<div class="files-choices">${choices}</div>` : ''}
      ${o.input !== undefined ? `<input type="text" name="name" autocomplete="off" placeholder="${esc(o.input)}">` : ''}
      <div class="group"><button type="button" data-cancel>${esc(t('close_unsaved_cancel'))}</button><button type="submit" class="${o.danger ? 'danger' : 'primary'}">${esc(o.ok ?? 'OK')}</button></div>
    </form>`
    const form = box.querySelector('form')!
    const field = form.querySelector('input')
    const done = (value: string | undefined) => {
      box.remove()
      resolve(value)
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      if (!field) return done('')
      if (field.value.trim()) done(field.value)
      else field.focus()
    })
    box.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const choice = target.closest<HTMLElement>('[data-choice]')?.dataset.choice
      if (choice !== undefined) done(choice)
      else if (target === box || target.closest('[data-cancel]')) done(undefined)
    })
    box.addEventListener('keydown', (e) => e.key === 'Escape' && done(undefined))
    document.body.append(box)
    ;(field ?? form.querySelector<HTMLButtonElement>('[data-cancel]'))!.focus()
  })
}

export class FilesPanel {
  readonly element: HTMLElement
  private body!: HTMLElement
  private workspace?: Workspace
  /** Gemerkter Ordner, für den der Browser erst wieder fragen muss. */
  private pending?: FileSystemDirectoryHandle
  private className = stored(classKey) ?? undefined
  /** Aufgeklappte Ordner als Pfade, z. B. `11FI1/2026-10-23`. */
  private expanded = new Set<string>(storedList(expandedKey))
  private rendering = 0
  /** Workspace, mit dem der Lernstand gerade abgeglichen wird. */
  private progressWorkspace?: Workspace
  private progressTimer?: number

  constructor(private host: FilesHost) {
    this.element = document.createElement('aside')
    this.element.className = 'files'
    this.build()
    progress.onChange(() => this.progressChanged())
    void this.restore()
  }

  private rememberExpanded() {
    store(expandedKey, JSON.stringify([...this.expanded]))
  }

  get ready(): boolean {
    return !!this.workspace
  }

  /** Neu aufbauen, z. B. nach einem Sprachwechsel. */
  build() {
    this.element.innerHTML = `
      <div class="files-head">
        <h2>${esc(t('web_files_title'))}</h2>
        <button class="icon" data-files="new-folder" data-tip="${esc(t('web_files_new_folder'))}" aria-label="${esc(t('web_files_new_folder'))}">${icons.newFolder}</button>
        <button class="icon" data-files="switch" data-tip="${esc(t('web_files_switch'))}" aria-label="${esc(t('web_files_switch'))}">${icons.open}</button>
        <button class="learn-hide" data-files="hide" title="${esc(t('web_files_hide'))}" aria-label="${esc(t('web_files_hide'))}">${sidebarIcon}</button>
      </div>
      <div class="files-body"></div>
    `
    this.body = this.element.querySelector('.files-body')!
    const on = (name: string, f: () => void) => this.element.querySelector(`[data-files=${name}]`)!.addEventListener('click', f)
    on('hide', () => this.host.hide())
    on('new-folder', () => void this.newFolder())
    on('switch', () => void this.switchWorkspace())
    this.body.addEventListener('click', (e) => void this.onTreeClick(e))
    void this.render()
  }

  // MARK: - Workspace wählen

  private async restore() {
    if (stored(modeKey) === 'browser') {
      this.workspace = browserWorkspace()
    } else if (canPickFolder()) {
      const folder = await storedFolder()
      if (folder?.ready) this.workspace = await reopenFolder(folder.handle)
      else this.pending = folder?.handle
    }
    await this.render()
  }

  private async connectFolder() {
    try {
      this.workspace = await pickFolder()
      this.pending = undefined
      store(modeKey, 'folder')
      this.className = undefined
      store(classKey, null)
    } catch {
      /* abgebrochen */
    }
    await this.render()
  }

  private async reconnect() {
    if (!this.pending) return
    this.workspace = await reopenFolder(this.pending)
    if (this.workspace) this.pending = undefined
    await this.render()
  }

  private async useBrowser() {
    this.workspace = browserWorkspace()
    store(modeKey, 'browser')
    await this.render()
  }

  /** Anderen Ordner wählen (bzw. am iPad: zurück zur Auswahl). */
  private async switchWorkspace() {
    if (canPickFolder()) return this.connectFolder()
    this.workspace = undefined
    store(modeKey, null)
    await forgetFolder()
    await this.render()
  }

  // MARK: - Lernstand

  /** Neuer Workspace: `lernstand.json` einlesen, zusammenführen und gleich zurückschreiben. */
  private async syncProgress(ws: Workspace | undefined) {
    this.progressWorkspace = ws
    if (!ws) return
    try {
      if (await ws.root.has(progressFile)) {
        if (progress.mergeFile(await ws.root.read(progressFile))) this.host.progressLoaded()
      }
      await this.writeProgress(ws)
    } catch {
      /* Ordner nicht lesbar: Lernstand bleibt im Browser */
    }
  }

  private async writeProgress(ws: Workspace) {
    if (ws !== this.progressWorkspace) return
    try {
      const fresh = !(await ws.root.has(progressFile))
      await ws.root.write(progressFile, progress.toFile())
      if (fresh) await this.render()
    } catch {
      /* z. B. Zugriff nach dem Neuladen noch nicht erlaubt */
    }
  }

  /** Änderungen im Lernbereich gesammelt (nach einer Sekunde Ruhe) in die Datei schreiben. */
  private progressChanged() {
    const ws = this.progressWorkspace
    if (!ws) return
    window.clearTimeout(this.progressTimer)
    this.progressTimer = window.setTimeout(() => void this.writeProgress(ws), 1000)
  }

  // MARK: - Baum

  async render() {
    const ticket = ++this.rendering
    const ws = this.workspace
    if (ws !== this.progressWorkspace) void this.syncProgress(ws)
    this.element.querySelector<HTMLButtonElement>('[data-files=new-folder]')!.hidden = !ws
    this.element.querySelector<HTMLButtonElement>('[data-files=switch]')!.hidden = !ws
    if (!ws) {
      this.body.innerHTML = this.startHTML()
      return
    }
    const rows: string[] = []
    const walk = async (dir: WsDir, path: string, depth: number) => {
      const entries = (await dir.list()).sort(compareEntries)
      for (const entry of entries) {
        const full = path ? `${path}/${entry.name}` : entry.name
        if (entry.kind === 'directory') {
          const open = this.expanded.has(full)
          const isClass = depth === 0 && entry.name === this.className
          rows.push(
            `<div class="files-row dir${isClass ? ' current' : ''}" style="--depth:${depth}" data-path="${esc(full)}" data-kind="dir">
              <button class="files-name" aria-expanded="${open}">${open ? '▾' : '▸'} ${icons.folder}<span>${esc(entry.name)}</span>${isClass ? `<small>${esc(t('web_files_current_class'))}</small>` : ''}</button>
              <button class="icon files-delete" data-tip="${esc(t('web_files_delete'))}" aria-label="${esc(t('web_files_delete'))}">${icons.trash}</button>
            </div>`,
          )
          if (open) await walk(await dir.dir(entry.name), full, depth + 1)
        } else if (/\.(visustruct|java|json)$/i.test(entry.name)) {
          // Zu einem Programm gehören .visustruct und .java: angezeigt wird das Programm einmal.
          if (/\.java$/i.test(entry.name) && entries.some((e) => e.name === entry.name.replace(/\.java$/i, '.visustruct'))) continue
          const program = /\.(visustruct|java)$/i.test(entry.name)
          rows.push(
            `<div class="files-row file" style="--depth:${depth}" data-path="${esc(full)}" data-kind="${program ? 'program' : 'file'}">
              <button class="files-name"${program ? '' : ' disabled'}>${program ? icons.diagram : icons.fileText}<span>${esc(program ? entry.name.replace(/\.(visustruct|java)$/i, '') : entry.name)}</span></button>
              ${program ? `<button class="icon files-delete" data-tip="${esc(t('web_files_delete'))}" aria-label="${esc(t('web_files_delete'))}">${icons.trash}</button>` : ''}
            </div>`,
          )
        }
      }
    }
    try {
      await walk(ws.root, '', 0)
    } catch (err) {
      rows.push(`<p class="files-error">${esc((err as Error).message)}</p>`)
    }
    if (ticket !== this.rendering) return
    const where = ws.kind === 'folder' ? `📁 ${esc(ws.root.name)}` : esc(t('web_files_in_browser'))
    const hint = this.className ? t('web_files_save_hint_fmt', `${this.className}/${todayFolder()}`) : t('web_files_class_hint')
    this.body.innerHTML = `
      <p class="files-where">${where}</p>
      <div class="files-tree" role="tree">${rows.join('') || `<p class="files-empty">${esc(t('web_files_empty'))}</p>`}</div>
      <p class="files-hint">${esc(hint)}</p>
    `
  }

  private startHTML(): string {
    if (this.pending) {
      return `<p class="files-hint">${esc(t('web_files_reconnect_hint'))}</p>
        <button class="primary files-start" data-start="reconnect">${icons.open} ${esc(t('web_files_reconnect_fmt', this.pending.name))}</button>
        <button class="files-start" data-start="pick">${esc(t('web_files_switch'))}</button>`
    }
    if (canPickFolder()) {
      return `<p class="files-hint">${esc(t('web_files_connect_hint'))}</p>
        <button class="primary files-start" data-start="pick">${icons.open} ${esc(t('web_files_connect'))}</button>`
    }
    return `<p class="files-hint">${esc(t('web_files_browser_hint'))}</p>
      <button class="primary files-start" data-start="browser">${esc(t('web_files_browser'))}</button>`
  }

  private async onTreeClick(e: Event) {
    const target = e.target as HTMLElement
    const start = target.closest<HTMLElement>('[data-start]')?.dataset.start
    if (start === 'pick') return this.connectFolder()
    if (start === 'reconnect') return this.reconnect()
    if (start === 'browser') return this.useBrowser()
    const row = target.closest<HTMLElement>('.files-row')
    if (!row || !this.workspace) return
    const path = row.dataset.path!
    if (target.closest('.files-delete')) return this.remove(row)
    if (row.dataset.kind === 'dir') {
      // Ein Ordner ganz oben ist eine Klasse: dort wird gespeichert.
      if (!path.includes('/')) {
        this.className = path
        store(classKey, path)
      }
      if (this.expanded.has(path)) this.expanded.delete(path)
      else this.expanded.add(path)
      this.rememberExpanded()
      return this.render()
    }
    if (row.dataset.kind === 'program') return this.openProgram(path)
  }

  private async locate(path: string): Promise<{ dir: WsDir; name: string }> {
    const parts = path.split('/')
    let dir = this.workspace!.root
    for (const part of parts.slice(0, -1)) dir = await dir.dir(part)
    return { dir, name: parts.at(-1)! }
  }

  private async openProgram(path: string) {
    try {
      const { dir, name } = await this.locate(path)
      const base = name.replace(/\.(visustruct|java)$/i, '')
      const xml = (await dir.has(`${base}.visustruct`)) ? await dir.read(`${base}.visustruct`) : undefined
      const java = (await dir.has(`${base}.java`)) ? await dir.read(`${base}.java`) : undefined
      if (xml === undefined && java === undefined) return
      const file = { dir, base, path: path.replace(/\.(visustruct|java)$/i, '') }
      this.host.open(xml ?? '', file, java)
    } catch (err) {
      this.host.message((err as Error).message)
    }
  }

  private async remove(row: HTMLElement) {
    const path = row.dataset.path!
    const program = row.dataset.kind === 'program'
    const label = program ? path.replace(/\.(visustruct|java)$/i, '') : path
    if ((await ask({ title: t('web_files_delete_confirm_fmt', label), ok: t('web_files_delete'), danger: true })) === undefined) return
    try {
      const { dir, name } = await this.locate(path)
      if (program) {
        const base = name.replace(/\.(visustruct|java)$/i, '')
        for (const ext of ['.visustruct', '.java']) if (await dir.has(base + ext)) await dir.remove(base + ext)
      } else {
        await dir.remove(name)
        if (path === this.className) {
          this.className = undefined
          store(classKey, null)
        }
      }
    } catch (err) {
      this.host.message((err as Error).message)
    }
    await this.render()
  }

  private async newFolder() {
    if (!this.workspace) return
    const name = validFolderName((await ask({ title: t('web_files_folder_prompt'), input: '11FI1', ok: t('web_files_create') })) ?? '')
    if (!name) return
    try {
      await this.workspace.root.dir(name, true)
      // Der erste Ordner wird gleich die Klasse.
      if (!this.className) {
        this.className = name
        store(classKey, name)
      }
    } catch (err) {
      this.host.message((err as Error).message)
    }
    await this.render()
  }

  // MARK: - Speichern

  /**
   * Programm speichern: in seinen bisherigen Ordner, sonst in Klasse/Tagesordner (wird angelegt).
   * `undefined`, wenn noch kein Workspace oder keine Klasse gewählt ist.
   */
  /** Speichern ohne Klasse: vorhandene Klasse wählen oder neue anlegen. Die Wahl bleibt eingestellt. */
  private async askClass(): Promise<boolean> {
    const ws = this.workspace!
    const classes = (await ws.root.list())
      .filter((e) => e.kind === 'directory')
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    const answer = await ask({
      title: t('web_files_ask_class'),
      hint: t(classes.length ? 'web_files_ask_class_hint' : 'web_files_ask_class_new_hint'),
      choices: classes,
      input: t('web_files_class_placeholder'),
      ok: t('web_files_create_save'),
    })
    const name = classes.includes(answer ?? '') ? answer! : validFolderName(answer ?? '')
    if (!name) return false
    await ws.root.dir(name, true)
    this.className = name
    store(classKey, name)
    return true
  }

  async save(title: string, xml: string, java: string | undefined, file?: WorkspaceFile): Promise<WorkspaceFile | undefined> {
    const ws = this.workspace
    if (!ws) return undefined
    let target = file
    if (!target) {
      if (!this.className && !(await this.askClass())) return undefined
      const className = this.className!
      const day = todayFolder()
      const dir = await (await ws.root.dir(className, true)).dir(day, true)
      const base = uniqueBaseName(programBaseName(title, t('web_files_default_name')), (await dir.list()).map((e) => e.name))
      target = { dir, base, path: `${className}/${day}/${base}` }
      this.expanded.add(className)
      this.expanded.add(`${className}/${day}`)
      this.rememberExpanded()
    }
    await target.dir.write(`${target.base}.visustruct`, xml)
    if (java !== undefined) await target.dir.write(`${target.base}.java`, java)
    await this.render()
    return target
  }
}
