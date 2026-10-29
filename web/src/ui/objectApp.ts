import {
  addClass,
  addMember,
  deleteClass,
  deleteMember,
  exampleJava,
  parseClasses,
  parseUmlLine,
  relations,
  renameClass,
  replaceMember,
  setAbstract,
  setSuperclass,
  umlText,
  type UmlClass,
  type UmlMember,
  type UmlRelation,
} from '../core/classModel'
import { gearIcon } from './app'
import { currentLanguage, t } from './i18n'
import { icons } from './icons'
import { JavaEditor } from './javaEditor'
import { setVisuBotMode, worldChooserHTML, type WorldChoice } from './visubotView'

/**
 * Welt VisuObject (Stufe 1): links Java-Code, rechts das Klassendiagramm. Beide hängen zusammen:
 * Tippen baut das Diagramm neu, eine Änderung im Diagramm schreibt nur die betroffene Stelle im Code neu.
 * Siehe docs/visuobject/PLAN.md.
 */

const codeKey = 'visuobject.code'
const positionsKey = 'visuobject.positions'
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

/** Was im Diagramm ausgewählt ist: eine Klasse, evtl. eines ihrer Mitglieder (Index in `members`). */
interface Selection {
  cls: string
  member?: number
}

export class ObjectApp {
  private shell: HTMLElement
  private editor!: JavaEditor
  private canvas!: HTMLElement
  private lines!: SVGSVGElement
  private status!: HTMLElement
  private classes: UmlClass[] = []
  private positions = new Map<string, Point>()
  private selection?: Selection
  private history: string[] = []
  private future: string[] = []
  private lastTyping = 0
  /** Gerade bearbeitetes Eingabefeld im Diagramm: dann nicht neu zeichnen. */
  private editing = false

  constructor(root: HTMLElement) {
    document.documentElement.classList.add('visuobject-theme')
    history.replaceState(history.state, '', `${location.pathname}?visuobject${location.hash}`)
    try {
      const saved = JSON.parse(stored(positionsKey) ?? '{}') as Record<string, Point>
      for (const [name, p] of Object.entries(saved)) if (Number.isFinite(p?.x) && Number.isFinite(p?.y)) this.positions.set(name, p)
    } catch {
      /* alte oder kaputte Positionen: neu anordnen */
    }
    this.shell = document.createElement('div')
    this.shell.className = 'shell visuobject'
    root.replaceWith(this.shell)
    this.build()
    this.editor.setText(stored(codeKey) ?? exampleJava)
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
          ${button('open', t('menu_open'), icons.open)}
          ${button('save', t('menu_save'), icons.save)}
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
        <section class="vo-code">
          <h2>${e(t('web_visuobject_code'))}</h2>
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
          <div class="vo-canvas" tabindex="-1"><svg class="vo-lines" aria-hidden="true"></svg></div>
          <p class="vo-status" role="status"></p>
        </section>
      </main>`
    this.canvas = this.shell.querySelector('.vo-canvas')!
    this.lines = this.canvas.querySelector('svg')!
    this.status = this.shell.querySelector('.vo-status')!
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
    on('new', () => this.setCode(''))
    on('example', () => this.setCode(exampleJava))
    on('open', () => this.open())
    on('save', () => this.save())
    on('undo', () => this.undo(false))
    on('redo', () => this.undo(true))
    on('add-class', () => this.newClass('class'))
    on('add-interface', () => this.newClass('interface'))
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
    this.canvas.addEventListener('dblclick', (ev) => this.onDoubleClick(ev))
    this.canvas.addEventListener('click', (ev) => this.onClick(ev))
  }

  private chooseWorld(world: WorldChoice) {
    if (world === 'object') return
    setVisuBotMode(world)
    location.href = `${location.pathname}?${world === 'on' ? 'visubot' : 'visustruct'}${location.hash}`
  }

  // MARK: - Code

  /** Code von außen (Diagramm, Neu, Beispiel, Öffnen): mit Rückgängig. */
  private setCode(text: string) {
    if (text === this.editor.text) return
    this.remember()
    this.editor.setText(text)
    this.refresh()
  }

  private remember() {
    this.history.push(this.editor.text)
    if (this.history.length > maxUndoSteps) this.history.shift()
    this.future = []
  }

  private typed() {
    // Schnelles Tippen zählt als ein Schritt für Rückgängig.
    const now = Date.now()
    if (now - this.lastTyping > 1500) this.remember()
    this.lastTyping = now
    this.refresh()
  }

  private undo(redo: boolean) {
    const from = redo ? this.future : this.history
    const to = redo ? this.history : this.future
    const text = from.pop()
    if (text === undefined) return
    to.push(this.editor.text)
    this.lastTyping = 0
    this.editor.setText(text)
    this.refresh()
  }

  private refresh() {
    store(codeKey, this.editor.text)
    this.classes = parseClasses(this.editor.text)
    if (this.selection && !this.findClass(this.selection.cls)) this.selection = undefined
    if (!this.editing) this.render()
  }

  private findClass(name: string): UmlClass | undefined {
    return this.classes.find((c) => c.name === name)
  }

  /** Cursor im Code: passende Klasse bzw. passendes Mitglied im Diagramm markieren. */
  private caretMoved() {
    const pos = this.editor.caret
    const cls = this.classes.find((c) => pos >= c.from && pos <= c.to)
    const member = cls?.members.findIndex((m) => pos >= m.from && pos <= m.to)
    const next = cls ? { cls: cls.name, member: member !== undefined && member >= 0 ? member : undefined } : undefined
    if (next?.cls === this.selection?.cls && next?.member === this.selection?.member) return
    this.selection = next
    if (!this.editing) this.render()
  }

  /** Im Diagramm gewählt: dieselbe Stelle im Code zeigen. */
  private showInCode(from: number, to: number) {
    const view = this.editor.view
    const end = Math.min(to, view.state.doc.length)
    view.dispatch({ selection: { anchor: Math.min(from, end), head: end }, scrollIntoView: true })
  }

  private message(text: string) {
    this.status.textContent = text
  }

  // MARK: - Datei

  private open() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.java,.txt,text/plain'
    input.addEventListener('change', () => {
      const file = input.files?.[0]
      if (!file) return
      file
        .text()
        .then((text) => this.setCode(text.replace(/\r\n/g, '\n')))
        .catch(() => this.message(t('web_visuobject_open_failed')))
    })
    input.click()
  }

  private save() {
    const name = (this.classes.find((c) => /\bpublic\b/.test(this.editor.text.slice(c.headerFrom, c.headerTo)))?.name ?? this.classes[0]?.name ?? 'Klassen') + '.java'
    const url = URL.createObjectURL(new Blob([this.editor.text], { type: 'text/x-java' }))
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  // MARK: - Diagramm → Code

  private change(run: (source: string) => string, select?: Selection) {
    const next = run(this.editor.text)
    if (select) this.selection = select
    this.message('')
    this.setCode(next)
  }

  private newClass(kind: 'class' | 'interface') {
    const base = t(kind === 'class' ? 'web_visuobject_new_class_name' : 'web_visuobject_new_interface_name')
    let name = base
    for (let n = 2; this.findClass(name); n++) name = base + n
    this.change((s) => addClass(s, name, kind), { cls: name })
    const cls = this.findClass(name)
    if (cls) this.showInCode(cls.nameFrom, cls.nameTo)
    this.startEditing(this.canvas.querySelector<HTMLElement>(`.uml-class[data-class="${CSS.escape(name)}"] .uml-name`)!)
  }

  /** Eingabe im Diagramm übernehmen. `target` sagt, was bearbeitet wurde. */
  private commit(target: HTMLElement, value: string) {
    const box = target.closest<HTMLElement>('.uml-class')!
    const cls = this.findClass(box.dataset.class!)
    if (!cls) return
    const text = value.trim()
    if (target.classList.contains('uml-name')) {
      if (text === cls.name) return
      if (!identifier.test(text) || this.findClass(text)) return this.message(t('web_visuobject_bad_name', text))
      const p = this.positions.get(cls.name)
      if (p) this.positions.set(text, p)
      this.change((s) => renameClass(s, cls, text), { cls: text })
      return
    }
    const add = target.dataset.add
    if (add) {
      if (!text) return
      const line = parseUmlLine(text)
      if (!line) return this.message(t('web_visuobject_bad_line', text))
      // „+ Attribut“ ohne Klammern bleibt ein Attribut, „+ Methode“ ohne Klammern wird eine Methode.
      const typed = add === 'method' && line.kind === 'field' ? `${text}()` : text
      this.change((s) => addMember(s, cls, typed), { cls: cls.name })
      return
    }
    const index = Number(target.dataset.member)
    const member = cls.members[index]
    if (!member) return
    if (!text) {
      this.change((s) => deleteMember(s, member), { cls: cls.name })
      return
    }
    if (text === umlText(member)) return
    if (!parseUmlLine(text)) return this.message(t('web_visuobject_bad_line', text))
    this.change((s) => replaceMember(s, cls, member, text), { cls: cls.name, member: index })
  }

  private startEditing(target: HTMLElement | null) {
    if (!target || this.editing) return
    const isName = target.classList.contains('uml-name')
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
    }
    input.addEventListener('keydown', (ev) => {
      ev.stopPropagation()
      if (ev.key === 'Enter') finish(true)
      else if (ev.key === 'Escape') finish(false)
    })
    input.addEventListener('input', () => (input.size = Math.max(input.value.length, input.placeholder.length, 8)))
    input.addEventListener('blur', () => finish(true))
    input.focus()
    input.select()
  }

  private onKey(ev: KeyboardEvent) {
    if (this.editing || this.editor.hasFocus) return
    const target = ev.target as HTMLElement
    if (target.closest('input, select, textarea')) return
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
      if (member) this.change((s) => deleteMember(s, member), { cls: cls.name })
      else this.change((s) => deleteClass(s, cls))
    } else if (ev.key === 'Enter' || ev.key === 'F2') {
      ev.preventDefault()
      const box = this.canvas.querySelector(`.uml-class[data-class="${CSS.escape(cls.name)}"]`)
      this.startEditing(box?.querySelector<HTMLElement>(sel.member !== undefined ? `[data-member="${sel.member}"]` : '.uml-name') ?? null)
    }
  }

  // MARK: - Maus

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

  private onClick(ev: MouseEvent) {
    if (this.drag?.moved || this.editing) return
    const target = ev.target as HTMLElement
    if (target.closest('input, select, label')) return
    const action = target.closest<HTMLElement>('[data-class-action]')
    const box = target.closest<HTMLElement>('.uml-class')
    const cls = box && this.findClass(box.dataset.class!)
    if (action && cls) {
      if (action.dataset.classAction === 'delete') this.change((s) => deleteClass(s, cls))
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
      const box = this.canvas.querySelector(`.uml-class[data-class="${CSS.escape(cls.name)}"]`)
      this.startEditing(box?.querySelector<HTMLElement>(index !== undefined ? `[data-member="${index}"]` : '.uml-name') ?? null)
      return
    }
    this.selection = { cls: cls.name, member: index }
    const member = index !== undefined ? cls.members[index] : undefined
    if (member) this.showInCode(member.headerFrom, member.headerTo)
    else this.showInCode(cls.nameFrom, cls.nameTo)
    this.render()
    this.canvas.focus({ preventScroll: true })
  }

  private lastClick = { spot: '', time: 0 }

  private onDoubleClick(ev: MouseEvent) {
    // Der Klick davor hat neu gezeichnet: dieselbe Stelle im neuen Kasten suchen.
    const target = (ev.target as HTMLElement).closest<HTMLElement>('.uml-name, [data-member]')
    const name = target?.closest<HTMLElement>('.uml-class')?.dataset.class
    if (!target || !name) return
    const box = this.canvas.querySelector(`.uml-class[data-class="${CSS.escape(name)}"]`)
    const selector = target.dataset.member !== undefined ? `[data-member="${target.dataset.member}"]` : '.uml-name'
    this.startEditing(box?.querySelector<HTMLElement>(selector) ?? null)
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

  private classBox(cls: UmlClass): HTMLElement {
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
            <button class="icon" data-class-action="delete" data-tip="${e(t('web_visuobject_delete_class'))}" aria-label="${e(t('web_visuobject_delete_class'))}">${icons.trash}</button>
          </div>`
        : sel
          ? `<div class="uml-tools"><button class="icon" data-class-action="delete" data-tip="${e(t('web_visuobject_delete_class'))}" aria-label="${e(t('web_visuobject_delete_class'))}">${icons.trash}</button></div>`
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
      this.change((s) => setSuperclass(s, cls, value), { cls: cls.name })
    })
    box.querySelector<HTMLInputElement>('[data-tool=abstract]')?.addEventListener('change', (ev) => {
      const on = (ev.target as HTMLInputElement).checked
      this.change((s) => setAbstract(s, cls, on), { cls: cls.name })
    })
    return box
  }

  /** Klassen ohne Position anordnen: Oberklassen und Interfaces oben, Unterklassen darunter. */
  private placeNew(boxes: Map<string, HTMLElement>) {
    const missing = this.classes.filter((c) => !this.positions.has(c.name))
    if (missing.length === 0) return
    const parents = (c: UmlClass) => [c.superclass, ...c.interfaces].filter((n): n is string => !!n && boxes.has(n))
    const level = new Map<string, number>()
    const depth = (c: UmlClass, seen: Set<string>): number => {
      if (level.has(c.name)) return level.get(c.name)!
      if (seen.has(c.name)) return 0
      seen.add(c.name)
      const up = parents(c).map((n) => depth(this.findClass(n)!, seen))
      const d = up.length ? Math.max(...up) + 1 : 0
      level.set(c.name, d)
      return d
    }
    for (const c of this.classes) depth(c, new Set())
    const gap = 48
    const rows: UmlClass[][] = []
    for (const c of this.classes) (rows[level.get(c.name)!] ??= []).push(c)
    // Neue Klassen in die Zeile ihrer Ebene, hinter die schon platzierten.
    // Ebenen untereinander; jede neue Klasse an die erste freie Stelle ihrer Ebene, ohne andere zu überdecken.
    const width = Math.max(this.canvas.clientWidth, 400) - 16
    const taken: { x: number; y: number; w: number; h: number }[] = []
    for (const [name, box] of boxes) {
      const p = this.positions.get(name)
      if (p) taken.push({ x: p.x, y: p.y, w: box.offsetWidth, h: box.offsetHeight })
    }
    const free = (x: number, y: number, w: number, h: number) =>
      taken.every((r) => x + w + gap <= r.x || r.x + r.w + gap <= x || y + h + gap <= r.y || r.y + r.h + gap <= y)
    let top = 16
    for (const row of rows) {
      if (!row) continue
      let bottom = top
      for (const c of row) {
        const box = boxes.get(c.name)!
        const w = box.offsetWidth
        const h = box.offsetHeight
        let spot = this.positions.get(c.name)
        for (let y = top; !spot && y < top + 3000; y += 20)
          for (let x = 16; x === 16 || x + w <= width; x += 20)
            if (free(x, y, w, h)) {
              spot = { x, y }
              break
            }
        spot ??= { x: 16, y: top }
        if (!this.positions.has(c.name)) {
          this.positions.set(c.name, spot)
          taken.push({ ...spot, w, h })
          box.style.left = `${spot.x}px`
          box.style.top = `${spot.y}px`
        }
        bottom = Math.max(bottom, spot.y + h)
      }
      top = bottom + gap * 1.5
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
    this.lines.setAttribute('width', String(width))
    this.lines.setAttribute('height', String(height))
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
      svg += `<text class="vo-label" x="${px}" y="${py}" text-anchor="middle" dominant-baseline="middle">${e(r.multiplicity ?? '')}</text>`
      svg += `<text class="vo-label role" x="${qx}" y="${qy}" text-anchor="middle" dominant-baseline="middle">${e(r.role ?? '')}</text>`
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
