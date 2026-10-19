import { canvasTextLines } from '../core/diagramText'
import {
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
  replaceAtPath,
  setTextLines,
  tryElementAt,
} from '../core/editing'
import { diagramDisplayMetrics, LayoutEngine, type Layout, type LayoutNode, type Rect } from '../core/layout'
import { ElementType, type VSDocument, type VSElement } from '../core/model'
import { paletteElement, paletteItems, type PaletteItem } from '../core/palette'
import { createCanvasMeasure } from '../core/textMeasurement'
import { decodeDocument, encodeDocument } from '../core/xmlCodec'
import { examples } from './examples'
import { DiagramRenderer, displayElement, el, flattenNodes, samePath } from './renderer'

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
const pickerTypes = [{ description: 'VisuStruct-Struktogramm', accept: { 'application/xml': ['.visustruct', '.strk'] } }]

const typeNames: Record<ElementType, string> = {
  [ElementType.anweisung]: 'Anweisung',
  [ElementType.verzweigung]: 'Verzweigung',
  [ElementType.fallauswahl]: 'Fallauswahl',
  [ElementType.forSchleife]: 'For-Schleife',
  [ElementType.whileSchleife]: 'While-Schleife',
  [ElementType.doUntilSchleife]: 'Do-while-Schleife',
  [ElementType.endlosschleife]: 'Endlosschleife',
  [ElementType.aussprung]: 'Aussprung',
  [ElementType.aufruf]: 'Aufruf',
  [ElementType.leerElement]: 'Leeres Element',
}

const typeHints: Partial<Record<ElementType, string>> = {
  [ElementType.anweisung]: 'Eine Zeile pro Anweisung. „input:“ und „print:“ werden als Ein-/Ausgabe erkannt.',
  [ElementType.verzweigung]: 'Bedingung, z. B. „zahl % 2 == 0“.',
  [ElementType.fallauswahl]: 'Ausdruck, nach dem unterschieden wird.',
  [ElementType.forSchleife]: 'Drei Zeilen: Start, Bedingung, Schritt (z. B. „int i = 0“, „i < 10“, „i++“).',
  [ElementType.whileSchleife]: 'Bedingung, solange die Schleife läuft.',
  [ElementType.doUntilSchleife]: 'Bedingung, die nach jedem Durchlauf geprüft wird.',
}

export class App {
  private doc: VSDocument = newEmptyDocument()
  private fileName = 'Struktogramm.visustruct'
  private fileHandle?: FileHandle
  private dirty = false
  private undoStack: VSDocument[] = []
  private redoStack: VSDocument[] = []
  private selected?: number[]

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
    this.buildUI()
    this.render()
    window.addEventListener('pointermove', (e) => this.onPointerMove(e))
    window.addEventListener('pointerup', (e) => this.onPointerUp(e))
    window.addEventListener('pointercancel', () => this.endDrag())
    window.addEventListener('keydown', (e) => this.onKeyDown(e))
    window.addEventListener('beforeunload', (e) => {
      if (this.dirty) e.preventDefault()
    })
    this.setupFileDrop()
    new ResizeObserver(() => this.renderDiagramOnly()).observe(this.canvasHost)
    const claude = (window as { claude?: { use(name: string): Promise<unknown> } }).claude
    claude?.use('downloads').then((d) => (this.downloads = d as App['downloads']))
  }

  // MARK: - UI

  private buildUI() {
    this.root.className = 'app'
    this.root.innerHTML = `
      <header class="toolbar">
        <div class="brand"><span class="logo"></span>VisuStruct <small>Web · Prototyp</small></div>
        <div class="group">
          <button data-action="new" title="Neues Struktogramm">Neu</button>
          <button data-action="open" title="Datei öffnen (Strg+O)">Öffnen…</button>
          <select data-action="example" title="Beispiel laden"><option value="">Beispiel…</option></select>
          <button data-action="save" title="Speichern (Strg+S)">Speichern</button>
        </div>
        <div class="group">
          <button data-action="undo" title="Rückgängig (Strg+Z)">↶</button>
          <button data-action="redo" title="Wiederholen (Strg+Umschalt+Z)">↷</button>
          <button data-action="delete" title="Auswahl löschen (Entf)">Löschen</button>
        </div>
      </header>
      <aside class="palette">
        <h2>Elemente</h2>
        <p class="hint">Ins Struktogramm ziehen</p>
        <ul></ul>
      </aside>
      <main class="workspace">
        <input class="caption" placeholder="Titel des Struktogramms" />
        <div class="canvas"></div>
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

    const list = $<HTMLUListElement>('.palette ul')
    for (const { item, label } of paletteItems) {
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

    const select = $<HTMLSelectElement>('[data-action=example]')
    for (const ex of examples) select.append(new Option(ex.name, ex.name))
    select.addEventListener('change', () => {
      const ex = examples.find((x) => x.name === select.value)
      select.value = ''
      if (ex) this.confirmDiscard().then((ok) => ok && this.loadXML(ex.xml, ex.name + '.visustruct'))
    })

    const fileInput = $<HTMLInputElement>('input[type=file]')
    fileInput.addEventListener('change', async () => {
      const f = fileInput.files?.[0]
      fileInput.value = ''
      if (f) this.loadXML(await f.text(), f.name)
    })

    $('[data-action=new]').addEventListener('click', async () => {
      if (!(await this.confirmDiscard())) return
      this.doc = newEmptyDocument()
      this.fileName = 'Struktogramm.visustruct'
      this.fileHandle = undefined
      this.resetHistory()
    })
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
    const size = {
      width: Math.max(320, this.layout.canvasSize.width, this.canvasHost.clientWidth),
      height: Math.max(240, this.layout.canvasSize.height + 60, this.canvasHost.clientHeight),
    }
    this.svg = this.renderer.render(this.layout, size, this.selected)
    this.overlay = el('g', { class: 'drop-overlay' })
    this.svg.append(this.overlay)
    this.canvasHost.replaceChildren(this.svg)

    if (document.activeElement !== this.captionInput) this.captionInput.value = this.doc.caption
    this.undoButton.disabled = this.undoStack.length === 0
    this.redoButton.disabled = this.redoStack.length === 0
    this.deleteButton.disabled = !this.selected || !canDeleteElement(this.doc, this.selected)
    this.renderInspector()
    this.updateStatus()
  }

  private updateStatus() {
    document.title = `${this.dirty ? '• ' : ''}${this.fileName} – VisuStruct Web`
    this.statusLine.textContent = `${this.fileName}${this.dirty ? ' (geändert)' : ''}`
  }

  private renderInspector() {
    const path = this.selected
    const element = path ? tryElementAt(this.doc, path) : undefined
    if (!path || !element) {
      this.inspector.innerHTML = `<h2>Eigenschaften</h2><p class="hint">Element anklicken, um den Text zu bearbeiten.<br><br>Elemente aus der Palette auf eine Kachel ziehen: oben = davor, unten = dahinter, auf „ø“ = ersetzen. Vorhandene Elemente lassen sich mit der Maus verschieben.<br><br>Dateien können auch einfach ins Fenster gezogen werden.</p>`
      return
    }
    this.inspector.innerHTML = `<h2>${typeNames[element.type]}</h2><label>Text</label><textarea rows="5" spellcheck="false"></textarea><p class="hint"></p>`
    const ta = this.inspector.querySelector('textarea')!
    this.inspector.querySelector('p.hint')!.textContent = typeHints[element.type] ?? ''
    ta.value = element.textLines.join('\n')
    ta.placeholder = canvasTextLines(element).join('\n')
    let before: VSDocument | undefined
    ta.addEventListener('focus', () => (before = this.doc))
    ta.addEventListener('input', () => {
      this.doc = setTextLines(this.doc, path, ta.value.split('\n'))
      this.dirty = true
      this.renderDiagramOnly()
    })
    ta.addEventListener('blur', () => {
      if (before && before !== this.doc) this.pushUndo(before)
      before = undefined
      this.render()
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
    if (this.undoStack.length > 200) this.undoStack.shift()
    this.redoStack = []
  }

  private undo() {
    const prev = this.undoStack.pop()
    if (!prev) return
    this.redoStack.push(this.doc)
    this.doc = prev
    this.dirty = true
    this.render()
  }

  private redo() {
    const next = this.redoStack.pop()
    if (!next) return
    this.undoStack.push(this.doc)
    this.doc = next
    this.dirty = true
    this.render()
  }

  private resetHistory() {
    this.undoStack = []
    this.redoStack = []
    this.selected = undefined
    this.dirty = false
    this.render()
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
      box.innerHTML = `<div class="confirm-card" role="alertdialog" aria-label="Änderungen verwerfen?">
        <p><strong>Ungespeicherte Änderungen verwerfen?</strong></p>
        <p class="hint">Die Änderungen an „${escapeHTML(this.fileName)}“ gehen verloren.</p>
        <div class="group"><button data-r="0">Abbrechen</button><button data-r="1" class="danger">Verwerfen</button></div>
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

  private loadXML(xml: string, name: string, handle?: FileHandle) {
    try {
      this.doc = decodeDocument(xml)
    } catch (err) {
      this.showMessage(`„${name}“ ist keine lesbare VisuStruct-Datei (${(err as Error).message})`)
      return
    }
    this.fileName = name.replace(/\.(strk|xml)$/i, '.visustruct')
    this.fileHandle = handle && /\.visustruct$/i.test(name) ? handle : undefined
    this.resetHistory()
  }

  private async open(fallback: HTMLInputElement) {
    if (!(await this.confirmDiscard())) return
    const w = window as PickerWindow
    if (!w.showOpenFilePicker || this.inViewer) return fallback.click()
    try {
      const [handle] = await w.showOpenFilePicker({ types: pickerTypes })
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
        this.dirty = false
        this.showMessage(`Gespeichert als „${filename}“. Zum Öffnen in der App die Endung .txt entfernen.`)
        return
      }
      if (!this.fileHandle && w.showSaveFilePicker && !this.inViewer) {
        this.fileHandle = await w.showSaveFilePicker({ suggestedName: this.fileName, types: pickerTypes })
        this.fileName = this.fileHandle.name
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
      this.dirty = false
      this.updateStatus()
    } catch {
      /* abgebrochen */
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
      if (await this.confirmDiscard()) this.loadXML(await f.text(), f.name)
    })
  }

  private onKeyDown(e: KeyboardEvent) {
    const mod = e.metaKey || e.ctrlKey
    const typing = e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement
    if (mod && e.key.toLowerCase() === 's') {
      e.preventDefault()
      this.save()
    } else if (mod && e.key.toLowerCase() === 'o') {
      e.preventDefault()
      this.open(this.root.querySelector('input[type=file]')!)
    } else if (typing) {
      return
    } else if (mod && e.key.toLowerCase() === 'z') {
      e.preventDefault()
      if (e.shiftKey) this.redo()
      else this.undo()
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
    return { x, y }
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
    if (e.button !== 0) return
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
      g.textContent = `${typeNames[e.type]}: ${canvasTextLines(e)[0]}`
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

function escapeHTML(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
}
