/**
 * VisuObject: Objektdiagramm wie in Astah. Objekte `s1 : Spieler` mit den Werten ihrer Attribute;
 * ein Referenzattribut ist eine Linie zum Objekt, dessen Name im Wert steht. Selbst gezeichnet
 * (gespeichert im Projekt) oder später live aus dem Debugger (`live`, nur lesen).
 */

import type { ProjectClass, UmlObject } from '../core/javaProject'
import type { FrameView } from '../core/miniJava'
import { freeObjectName, isA, javaDefault, linkedValue, objectFields, refNames, type ObjectField } from '../core/objectModel'
import { t } from './i18n'
import { icons } from './icons'

export type { Point }

const e = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
const identifier = /^[\p{L}_$][\p{L}\p{N}_$]*$/u

type Point = { x: number; y: number }
type Rect = { x: number; y: number; w: number; h: number }

export interface ObjectDiagramHost {
  canvas: HTMLElement
  lines: SVGSVGElement
  inspector: HTMLElement
  classes(): ProjectClass[]
  objects(): UmlObject[]
  setObjects(objects: UmlObject[]): void
  message(text: string): void
}

export interface LiveState {
  objects: UmlObject[]
  /** Geänderte Werte seit dem letzten Halt: `objektId.attribut`. */
  changed: Set<string>
  /** Aufrufstapel, oberste Methode zuerst; `frame` ist die gewählte Zeile. */
  frames: FrameView[]
  frame: number
  /** Geänderte Variablen: `Methode|Name`. */
  changedVars: Set<string>
  onFrame(index: number): void
  move(id: string, p: Point): void
}

export class ObjectDiagram {
  selected?: string
  /** Stand aus dem Debugger: wird gezeigt statt der gezeichneten Objekte; nur verschieben, nicht ändern. */
  live?: LiveState
  private suppressClick = false
  private lastClick = { id: '', time: 0 }

  constructor(private host: ObjectDiagramHost) {
    host.canvas.addEventListener('pointerdown', (ev) => this.onPointerDown(ev))
    host.canvas.addEventListener('click', (ev) => this.onClick(ev))
  }

  private get objects(): UmlObject[] {
    return this.live?.objects ?? this.host.objects()
  }

  private find(id: string | undefined) {
    return id ? this.objects.find((o) => o.id === id) : undefined
  }

  private change(id: string, change: Partial<UmlObject>) {
    this.host.setObjects(this.host.objects().map((o) => (o.id === id ? { ...o, ...change } : o)))
  }

  private fields(o: UmlObject): ObjectField[] {
    return objectFields(this.host.classes(), o.cls)
  }

  private valueOf(o: UmlObject, f: ObjectField): string {
    return o.values[f.name] ?? javaDefault(f.type)
  }

  // MARK: - Zeichnen

  render() {
    const { canvas } = this.host
    for (const old of canvas.querySelectorAll('.uml-object, .vo-empty')) old.remove()
    if (this.objects.length === 0) {
      const empty = document.createElement('p')
      empty.className = 'vo-empty'
      empty.textContent = t(this.host.classes().some((c) => c.kind === 'class' && !c.isAbstract) ? 'web_visuobject_obj_empty' : 'web_visuobject_obj_no_classes')
      canvas.append(empty)
    }
    for (const o of this.objects) canvas.append(this.box(o))
    this.drawLinks()
    this.renderInspector()
  }

  private box(o: UmlObject): HTMLElement {
    const box = document.createElement('div')
    const selected = this.selected === o.id && !this.live
    const known = this.host.classes().some((c) => c.name === o.cls)
    box.className = `uml-class uml-object${selected ? ' selected' : ''}${known ? '' : ' unknown'}`
    box.dataset.obj = o.id
    box.style.left = `${o.x}px`
    box.style.top = `${o.y}px`
    const rows = this.fields(o)
      .map((f) => {
        const changed = this.live?.changed.has(`${o.id}.${f.name}`)
        return `<li class="uml-member${changed ? ' changed' : ''}">${e(f.name)} = ${e(this.valueOf(o, f))}</li>`
      })
      .join('')
    box.innerHTML = `${selected ? `<button class="uml-connect" data-obj-connect aria-label="${e(t('web_visuobject_obj_link'))}" data-tip="${e(t('web_visuobject_obj_link'))}" tabindex="-1"></button>` : ''}
      <header class="uml-head"><span class="uml-objname">${e(o.name)} : ${e(o.cls)}</span></header>
      <ul class="uml-fields">${rows}</ul>`
    return box
  }

  /** Links: vom Objekt mit dem Referenzattribut zum Objekt, dessen Name im Wert steht; am Ziel der Attributname. */
  private drawLinks() {
    const { canvas, lines } = this.host
    const boxes = new Map<string, HTMLElement>()
    for (const b of canvas.querySelectorAll<HTMLElement>('.uml-object')) boxes.set(b.dataset.obj!, b)
    let width = 0
    let height = 0
    for (const b of boxes.values()) {
      width = Math.max(width, b.offsetLeft + b.offsetWidth + 40)
      height = Math.max(height, b.offsetTop + b.offsetHeight + 40)
    }
    lines.setAttribute('width', String(width))
    lines.setAttribute('height', String(height))
    const rect = (b: HTMLElement): Rect => ({ x: b.offsetLeft, y: b.offsetTop, w: b.offsetWidth, h: b.offsetHeight })
    const parts: string[] = []
    const pairs = new Map<string, number>()
    for (const o of this.objects) {
      const from = boxes.get(o.id)
      if (!from) continue
      for (const f of this.fields(o)) {
        if (!f.target) continue
        for (const name of refNames(this.valueOf(o, f))) {
          const target = this.objects.find((x) => x.name === name)
          const to = target && boxes.get(target.id)
          if (!to || to === from) continue
          const key = [o.id, target.id].sort().join('|')
          const n = pairs.get(key) ?? 0
          pairs.set(key, n + 1)
          const ra = rect(from)
          const rb = rect(to)
          const ca = { x: ra.x + ra.w / 2, y: ra.y + ra.h / 2 }
          const cb = { x: rb.x + rb.w / 2, y: rb.y + rb.h / 2 }
          const len = Math.hypot(cb.x - ca.x, cb.y - ca.y) || 1
          const nx = (-(cb.y - ca.y) / len) * n * 14
          const ny = ((cb.x - ca.x) / len) * n * 14
          const a = edgePoint(ra, { x: ca.x + nx, y: ca.y + ny }, { x: cb.x + nx, y: cb.y + ny })
          const b = edgePoint(rb, { x: cb.x + nx, y: cb.y + ny }, { x: ca.x + nx, y: ca.y + ny })
          const ux = (a.x - b.x) / (Math.hypot(a.x - b.x, a.y - b.y) || 1)
          const uy = (a.y - b.y) / (Math.hypot(a.x - b.x, a.y - b.y) || 1)
          const label = { x: b.x + ux * 22 - uy * 10, y: b.y + uy * 22 + ux * 10 }
          const changed = this.live?.changed.has(`${o.id}.${f.name}`)
          parts.push(`<line class="vo-rel vo-objlink${changed ? ' changed' : ''}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`)
          parts.push(`<text class="vo-label-svg role" x="${label.x}" y="${label.y}" text-anchor="middle" dominant-baseline="middle">${e(f.name)}</text>`)
        }
      }
    }
    lines.innerHTML = parts.join('')
  }

  // MARK: - Objektinspektor

  renderInspector() {
    const { inspector } = this.host
    if (this.live) return this.renderDebugger(this.live)
    const o = this.find(this.selected)
    if (!o) {
      delete inspector.dataset.rel
      inspector.innerHTML = `<p class="vo-inspector-empty">${e(t('web_visuobject_obj_hint'))}</p>`
      return
    }
    inspector.dataset.rel = `obj:${o.id}`
    const classes = this.host.classes().filter((c) => c.kind === 'class')
    const others = this.objects.filter((x) => x.id !== o.id)
    const field = (f: ObjectField) => {
      const value = this.valueOf(o, f)
      if (f.target && !f.many) {
        const choices = others.filter((x) => isA(this.host.classes(), x.cls, f.target!))
        return `<select data-objval="${e(f.name)}"><option value="null"${value === 'null' ? ' selected' : ''}>null</option>${choices.map((x) => `<option value="${e(x.name)}"${x.name === value ? ' selected' : ''}>${e(x.name)}</option>`).join('')}</select>`
      }
      return `<input data-objval="${e(f.name)}" value="${e(value)}" spellcheck="false" autocomplete="off"${f.many ? ' placeholder="[s1, s2]"' : ''}>`
    }
    const rows = this.fields(o)
      .map((f) => `<tr><td><code>${e(f.name)} : ${e(f.type)}</code></td><td>${field(f)}</td></tr>`)
      .join('')
    inspector.innerHTML = `
      <div class="vo-inspector-row">
        <label>${e(t('web_visuobject_obj_name'))}<input data-field="name" value="${e(o.name)}" spellcheck="false" autocomplete="off"></label>
        <label>${e(t('web_visuobject_obj_class'))}<select data-field="cls">${classes.map((c) => `<option value="${e(c.name)}"${c.name === o.cls ? ' selected' : ''}>${e(c.name)}</option>`).join('')}</select></label>
      </div>
      <table class="vo-members vo-obj-values"><thead><tr><th>${e(t('web_visuobject_obj_attribute'))}</th><th>${e(t('web_visuobject_obj_value'))}</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="2" class="vo-inspector-empty">${e(t('web_visuobject_insp_no_fields'))}</td></tr>`}</tbody></table>
      <div class="vo-inspector-row"><button class="text-button vo-danger" data-obj-delete>${icons.trash} ${e(t('web_visuobject_obj_delete'))}</button></div>`
    inspector.querySelector<HTMLInputElement>('[data-field=name]')!.addEventListener('change', (ev) => {
      const name = (ev.target as HTMLInputElement).value.trim()
      if (!identifier.test(name)) return this.host.message(t('web_visuobject_obj_bad_name', name))
      if (others.some((x) => x.name === name)) return this.host.message(t('web_visuobject_obj_name_taken', name))
      this.host.message('')
      // Referenzen auf den alten Namen mitnehmen.
      const old = o.name
      this.host.setObjects(
        this.host.objects().map((x) => {
          const values = Object.fromEntries(
            Object.entries(x.values).map(([k, v]) => [k, refNames(v).includes(old) ? v.replace(new RegExp(`(^|[\\s,\\[])${old}(?=$|[\\s,\\]])`, 'gu'), `$1${name}`) : v]),
          )
          return x.id === o.id ? { ...x, name, values } : { ...x, values }
        }),
      )
    })
    inspector.querySelector<HTMLSelectElement>('[data-field=cls]')!.addEventListener('change', (ev) => this.change(o.id, { cls: (ev.target as HTMLSelectElement).value }))
    for (const el of inspector.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-objval]'))
      el.addEventListener('change', () => this.change(o.id, { values: { ...o.values, [el.dataset.objval!]: el.value.trim() } }))
    inspector.querySelector('[data-obj-delete]')!.addEventListener('click', () => this.remove(o.id))
  }

  /** Beim Debuggen: Aufrufstapel und Variablen der gewählten Methode (wie in Eclipse). */
  private renderDebugger(live: LiveState) {
    const { inspector } = this.host
    delete inspector.dataset.rel
    const frame = live.frames[live.frame]
    const stack = live.frames
      .map(
        (f, i) =>
          `<li><button class="vo-dbg-frame${i === live.frame ? ' on' : ''}" data-frame="${i}"><code>${e(f.title)}</code> <small>${e(t('web_visuobject_dbg_line_fmt', f.pos.file.split('/').pop() ?? '', String(f.pos.line + 1)))}</small></button></li>`,
      )
      .join('')
    const vars = (frame?.vars ?? [])
      .map(
        (v) =>
          `<tr class="${live.changedVars.has(`${frame.title}|${v.name}`) ? 'changed' : ''}"><td><code>${e(v.name)}</code></td><td><code>${e(v.type)}</code></td><td><code>${e(v.value)}</code></td></tr>`,
      )
      .join('')
    inspector.innerHTML = `
      <div class="vo-dbg">
        <section class="vo-dbg-stack"><h3>${e(t('web_visuobject_dbg_stack'))}</h3><ol>${stack || `<li class="vo-inspector-empty">${e(t('web_visuobject_obj_live_hint'))}</li>`}</ol></section>
        <section class="vo-dbg-vars"><h3>${e(t('web_visuobject_dbg_vars'))}</h3>
          <table class="vo-members"><thead><tr><th>${e(t('web_visuobject_dbg_var_name'))}</th><th>${e(t('web_visuobject_dbg_var_type'))}</th><th>${e(t('web_visuobject_obj_value'))}</th></tr></thead>
          <tbody>${vars || `<tr><td colspan="3" class="vo-inspector-empty">${e(t('web_visuobject_dbg_no_vars'))}</td></tr>`}</tbody></table>
        </section>
      </div>`
    for (const b of inspector.querySelectorAll<HTMLButtonElement>('[data-frame]')) b.addEventListener('click', () => live.onFrame(Number(b.dataset.frame)))
  }

  // MARK: - Bearbeiten

  /** Neues Objekt der Klasse an einer freien Stelle, Werte wie in Java nach `new`. */
  add(cls: string) {
    const objects = this.host.objects()
    const name = freeObjectName(
      cls,
      objects.map((o) => o.name),
    )
    const taken = [...this.host.canvas.querySelectorAll<HTMLElement>('.uml-object')].map((b) => ({ x: b.offsetLeft, y: b.offsetTop, w: b.offsetWidth, h: b.offsetHeight }))
    let spot: Point = { x: 24, y: 24 }
    search: for (let y = 24; y < 4000; y += 40)
      for (let x = 24; x < Math.max(400, this.host.canvas.clientWidth - 200); x += 40)
        if (taken.every((r) => x + 200 + 40 <= r.x || r.x + r.w + 40 <= x || y + 110 + 30 <= r.y || r.y + r.h + 30 <= y)) {
          spot = { x, y }
          break search
        }
    const id = `o${Date.now().toString(36)}`
    this.selected = id
    this.host.setObjects([...objects, { id, name, cls, x: spot.x, y: spot.y, values: {} }])
  }

  remove(id: string) {
    const gone = this.host.objects().find((o) => o.id === id)
    if (!gone) return
    this.selected = undefined
    // Referenzen auf das gelöschte Objekt werden null bzw. fallen aus der Liste.
    this.host.setObjects(
      this.host
        .objects()
        .filter((o) => o.id !== id)
        .map((o) => ({
          ...o,
          values: Object.fromEntries(
            Object.entries(o.values).map(([k, v]) => {
              const names = refNames(v)
              if (!names.includes(gone.name)) return [k, v]
              return [k, /^\[/.test(v.trim()) ? `[${names.filter((n) => n !== gone.name).join(', ')}]` : 'null']
            }),
          ),
        })),
    )
  }

  onKey(ev: KeyboardEvent): boolean {
    if (this.live || !this.selected) return false
    if (ev.key === 'Delete' || ev.key === 'Backspace') {
      ev.preventDefault()
      this.remove(this.selected)
      return true
    }
    return false
  }

  private select(id: string | undefined) {
    this.selected = id
    this.render()
    this.host.canvas.focus({ preventScroll: true })
  }

  // MARK: - Maus

  private onPointerDown(ev: PointerEvent) {
    if (ev.button !== 0) return
    const target = ev.target as HTMLElement
    const handle = target.closest<HTMLElement>('[data-obj-connect]')
    const box = target.closest<HTMLElement>('.uml-object')
    if (handle && box && !this.live) return this.startLink(ev, box)
    if (box) this.drag(ev, box)
  }

  private onClick(ev: MouseEvent) {
    if (this.suppressClick) {
      this.suppressClick = false
      return
    }
    if (this.live) return
    const box = (ev.target as HTMLElement).closest<HTMLElement>('.uml-object')
    const id = box?.dataset.obj
    const now = Date.now()
    const twice = !!id && this.lastClick.id === id && now - this.lastClick.time < 450
    this.lastClick = { id: id ?? '', time: twice ? 0 : now }
    this.select(id)
    if (twice) this.host.inspector.querySelector<HTMLInputElement>('[data-field=name]')?.select()
  }

  private drag(ev: PointerEvent, box: HTMLElement) {
    const o = this.find(box.dataset.obj)
    if (!o) return
    const start = { x: ev.clientX, y: ev.clientY }
    let moved = false
    let p: Point = { x: o.x, y: o.y }
    const move = (m: PointerEvent) => {
      const dx = m.clientX - start.x
      const dy = m.clientY - start.y
      if (!moved && Math.hypot(dx, dy) < 4) return
      moved = true
      p = { x: Math.max(0, Math.round(o.x + dx)), y: Math.max(0, Math.round(o.y + dy)) }
      box.style.left = `${p.x}px`
      box.style.top = `${p.y}px`
      this.drawLinks()
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      if (!moved) return
      this.suppressClick = true
      if (this.live) {
        Object.assign(o, p)
        return this.live.move(o.id, p)
      }
      this.selected = o.id
      this.change(o.id, p)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  /** Vom Griff zu einem anderen Objekt ziehen: passendes Referenzattribut bekommt dessen Namen. */
  private startLink(ev: PointerEvent, box: HTMLElement) {
    ev.preventDefault()
    const from = this.find(box.dataset.obj)
    if (!from) return
    const { canvas, lines } = this.host
    const ghost = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    ghost.setAttribute('class', 'vo-rel ghost')
    lines.append(ghost)
    const start = { x: box.offsetLeft + box.offsetWidth, y: box.offsetTop + box.offsetHeight / 2 }
    const targetAt = (m: PointerEvent) => {
      const el = document.elementFromPoint(m.clientX, m.clientY)?.closest<HTMLElement>('.uml-object')
      return el && el !== box ? el : undefined
    }
    const move = (m: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      ghost.setAttribute('x1', String(start.x))
      ghost.setAttribute('y1', String(start.y))
      ghost.setAttribute('x2', String(m.clientX - r.left + canvas.scrollLeft))
      ghost.setAttribute('y2', String(m.clientY - r.top + canvas.scrollTop))
      for (const el of canvas.querySelectorAll('.uml-object.drop')) el.classList.remove('drop')
      targetAt(m)?.classList.add('drop')
    }
    const up = (m: PointerEvent) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      ghost.remove()
      const el = targetAt(m)
      el?.classList.remove('drop')
      this.suppressClick = true
      const to = el && this.find(el.dataset.obj)
      if (!to) return
      const classes = this.host.classes()
      const fits = this.fields(from).filter((f) => f.target && isA(classes, to.cls, f.target))
      // Erst ein freies Attribut nehmen (null), sonst eine Liste, sonst das erste passende.
      const field = fits.find((f) => !f.many && refNames(this.valueOf(from, f)).length === 0) ?? fits.find((f) => f.many) ?? fits[0]
      if (!field) return this.host.message(t('web_visuobject_obj_no_ref', from.cls, to.cls))
      this.host.message('')
      this.change(from.id, { values: { ...from.values, [field.name]: linkedValue(field, this.valueOf(from, field), to.name) } })
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }
}

/** Schnittpunkt der Strecke von `inside` (nahe der Mitte) Richtung `toward` mit dem Rand des Rechtecks. */
function edgePoint(r: Rect, inside: Point, toward: Point): Point {
  const dx = toward.x - inside.x
  const dy = toward.y - inside.y
  const sx = dx === 0 ? Infinity : r.w / 2 / Math.abs(dx)
  const sy = dy === 0 ? Infinity : r.h / 2 / Math.abs(dy)
  const s = Math.min(sx, sy, 1)
  return { x: Math.round(inside.x + dx * s), y: Math.round(inside.y + dy * s) }
}
