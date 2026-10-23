import { t } from './i18n'
import {
  generateLiveCode,
  livePlaceholderEnd,
  livePlaceholderStart,
  type LiveLabels,
  type LiveSpan,
  type LiveTarget,
} from '../core/codeGenerator'
import { parseLiveJava, type JavaProblem, type ParsedJava } from '../core/javaParser'
import { documentFromJava, mergeLiveJava, plainLiveJava } from '../core/liveSource'
import type { VSDocument } from '../core/model'
import { sidebarIcon } from './learnPanel'

/**
 * Ansicht „Code live“: rechts neben dem Struktogramm der Java-, JavaScript- oder Python-Code, der bei jeder Änderung mitwächst.
 * In Java kann man den Code auch selbst tippen: Dann baut sich das Struktogramm mit.
 */

const targetKey = 'visustruct.live.target'

function storedTarget(): LiveTarget {
  try {
    const stored = localStorage.getItem(targetKey)
    return stored === 'javascript' || stored === 'python' ? stored : 'java'
  } catch {
    return 'java'
  }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Eine Codezeile als HTML; Platzhalter grau. */
function lineHTML(line: string): string {
  let out = ''
  let rest = line
  for (;;) {
    const start = rest.indexOf(livePlaceholderStart)
    if (start < 0) break
    const end = rest.indexOf(livePlaceholderEnd, start)
    if (end < 0) break
    out += esc(rest.slice(0, start)) + `<span class="ph">${esc(rest.slice(start + 1, end))}</span>`
    rest = rest.slice(end + 1)
  }
  return out + esc(rest)
}

interface Mark {
  from: number
  to: number
  cls: 'ph' | 'err'
}

/** Getippter Code als HTML-Zeilen mit Markierungen (Platzhalter, Fehler); dieselben Zeichen wie im Textfeld. */
function markedLinesHTML(text: string, marks: Mark[]): string[] {
  const lines: string[] = []
  let offset = 0
  for (const line of text.split('\n')) {
    const end = offset + line.length
    const here = marks
      .filter((m) => m.from < end + 1 && m.to > offset)
      .map((m) => ({ ...m, from: Math.max(m.from, offset) - offset, to: Math.min(m.to, end) - offset }))
    // Zerlegen an allen Grenzen, damit sich Platzhalter und Fehler überlappen dürfen.
    const cuts = [...new Set([0, line.length, ...here.flatMap((m) => [m.from, m.to])])].filter((c) => c >= 0 && c <= line.length).sort((a, b) => a - b)
    let html = ''
    for (let k = 0; k < cuts.length - 1; k++) {
      const [a, b] = [cuts[k], cuts[k + 1]]
      const cls = [...new Set(here.filter((m) => m.from <= a && m.to >= b).map((m) => m.cls))]
      const part = esc(line.slice(a, b))
      html += cls.length ? `<span class="${cls.join(' ')}">${part}</span>` : part
    }
    // Fehlt etwas am Zeilenende, zeigt ein schmaler Strich die Stelle.
    if (here.some((m) => m.cls === 'err' && m.from >= line.length)) html += '<span class="err end"> </span>'
    lines.push(html)
    offset = end + 1
  }
  return lines
}

const samePath = (a: number[], b: number[]) => a.length === b.length && a.every((x, i) => x === b[i])

/** Innerstes Element, zu dem die Zeile gehört. */
function spanAtLine(spans: LiveSpan[], line: number): LiveSpan | undefined {
  let best: LiveSpan | undefined
  for (const s of spans) {
    if (line < s.from || line > s.to) continue
    if (!best || s.to - s.from < best.to - best.from || (s.to - s.from === best.to - best.from && s.path.length > best.path.length)) best = s
  }
  return best
}

const indentStep = '    '
/** Fehler erst nach einer kurzen Pause zeigen: Beim Tippen ist eine Zeile fast immer kurz „falsch“. */
const problemDelay = 900

export interface LiveContext {
  /** Gehört der Code zu diesem Reiter? Getippter Text wird je Reiter gemerkt. */
  owner: object
  /** Unterprogramme aus den anderen Reitern. */
  subprograms: Set<string>
  /** Zeilen anklickbar und Code bearbeitbar (nicht während der Simulation). */
  editable: boolean
}

export class LiveCodePanel {
  readonly element: HTMLElement
  private view!: HTMLElement
  private editor!: HTMLElement
  private input!: HTMLTextAreaElement
  private layer!: HTMLElement
  private problemLine!: HTMLElement
  private hint!: HTMLElement
  private spans: LiveSpan[] = []
  private highlighted?: string
  private html = ''
  private target = storedTarget()
  private last?: { doc: VSDocument; highlight?: number[]; context: LiveContext }
  /** Getippter Code zu einem Dokument (auch für Rückgängig). */
  private textFor = new WeakMap<VSDocument, string>()
  /** Zuletzt gezeigter Code je Reiter: Grundlage, wenn sich das Struktogramm danach ändert. */
  private shown = new WeakMap<object, { doc: VSDocument; text: string }>()
  private parsed?: ParsedJava
  private placeholders: { from: number; to: number }[] = []
  private problems: JavaProblem[] = []
  private problemTimer?: number
  private showProblems = true

  constructor(
    private onHide: () => void,
    /** Klick auf eine Zeile wählt das Element im Struktogramm aus. */
    private onSelect: (path: number[]) => void,
    /** Getippter Code ergab ein neues Struktogramm. */
    private onCode: (doc: VSDocument, select: number[] | undefined) => void,
    private onUndo: (redo: boolean) => void,
  ) {
    this.element = document.createElement('aside')
    this.element.className = 'livecode'
    this.build()
  }

  private get labels(): LiveLabels {
    // Dieselben Wörter wie im Struktogramm und im Objektinspektor.
    return {
      condition: t('canvas_stub_condition'),
      selector: t('web_live_ph_selector'),
      code: t('web_live_ph_code'),
      start: t('inspector_for_init'),
      step: t('inspector_for_step'),
      end: t('web_live_ph_end'),
    }
  }

  /** Neu aufbauen, z. B. nach einem Sprachwechsel. */
  build() {
    this.element.innerHTML = `
      <div class="livecode-head">
        <h2>${esc(t('web_live_title'))}</h2>
        <div class="segmented livecode-target" role="group" aria-label="${esc(t('web_codegen_language'))}">
          <button data-target="java">Java</button><button data-target="javascript">JavaScript</button><button data-target="python">Python</button>
        </div>
        <button class="learn-hide" title="${esc(t('web_live_hide'))}" aria-label="${esc(t('web_live_hide'))}">${sidebarIcon}</button>
      </div>
      <p class="hint"></p>
      <pre class="code-view livecode-view" tabindex="0" dir="ltr"></pre>
      <div class="code-view livecode-editor" dir="ltr">
        <div class="livecode-stack">
          <div class="livecode-layer" aria-hidden="true"></div>
          <textarea class="livecode-input" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off"
            aria-label="${esc(t('web_live_edit_label'))}"></textarea>
        </div>
      </div>
      <p class="livecode-problem" role="status" aria-live="polite"></p>
    `
    this.view = this.element.querySelector('.livecode-view')!
    this.editor = this.element.querySelector('.livecode-editor')!
    this.input = this.element.querySelector('.livecode-input')!
    this.layer = this.element.querySelector('.livecode-layer')!
    this.problemLine = this.element.querySelector('.livecode-problem')!
    this.hint = this.element.querySelector('.hint')!
    this.element.querySelector('.learn-hide')!.addEventListener('click', () => this.onHide())
    this.view.addEventListener('click', (e) => {
      const row = (e.target as HTMLElement).closest<HTMLElement>('.ln')
      if (!row || !this.view.classList.contains('selectable')) return
      const span = spanAtLine(this.spans, Number(row.dataset.line))
      if (span) this.onSelect(span.path)
    })
    for (const b of this.element.querySelectorAll<HTMLButtonElement>('[data-target]')) {
      b.setAttribute('aria-pressed', String(b.dataset.target === this.target))
      b.addEventListener('click', () => this.setTarget(b.dataset.target as LiveTarget))
    }
    this.setupEditor()
    this.highlighted = undefined
    this.html = ''
    this.showMode()
  }

  private setTarget(target: LiveTarget) {
    this.target = target
    try {
      localStorage.setItem(targetKey, target)
    } catch {
      /* ohne Speicher: nur für diese Sitzung */
    }
    for (const b of this.element.querySelectorAll<HTMLButtonElement>('[data-target]')) {
      b.setAttribute('aria-pressed', String(b.dataset.target === target))
    }
    this.showMode()
    if (this.last) this.refresh(this.last.doc, this.last.highlight, this.last.context)
  }

  /** Java: Code selbst tippen. JavaScript und Python: vorerst nur Anzeige. */
  private showMode() {
    const java = this.target === 'java'
    this.view.hidden = java
    this.editor.hidden = !java
    this.problemLine.hidden = !java
    this.hint.textContent = t(java ? 'web_live_hint_edit' : 'web_live_hint')
  }

  /** `highlight`: ausgewähltes Element bzw. Schritt der Simulation. */
  refresh(doc: VSDocument, highlight: number[] | undefined, context: LiveContext) {
    this.last = { doc, highlight, context }
    if (this.target === 'java') this.refreshEditor(doc, highlight, context)
    else this.refreshView(doc, highlight, context.editable)
  }

  private refreshView(doc: VSDocument, highlight: number[] | undefined, selectable: boolean) {
    const live = generateLiveCode(doc, this.target, this.labels)
    this.spans = live.spans
    const span = highlight && live.spans.find((s) => samePath(s.path, highlight))
    this.view.classList.toggle('selectable', selectable)
    const html = live.text
      .split('\n')
      .map((line, i) => {
        const marked = span && i >= span.from && i <= span.to
        return `<div class="ln${marked ? ' sel' : ''}" data-line="${i}">${lineHTML(line) || ' '}</div>`
      })
      .join('')
    // Unverändert nicht neu aufbauen: Sonst geht ein Klick verloren, wenn das Verlassen des Objektinspektors
    // zwischen Drücken und Loslassen neu zeichnet, und markierter Text bleibt markiert.
    if (html !== this.html) this.view.innerHTML = html
    this.html = html
    // Nur scrollen, wenn sich die Markierung bewegt hat, sonst springt die Ansicht beim Tippen.
    const key = span ? `${span.from}-${span.to}` : undefined
    if (key && key !== this.highlighted) {
      this.view.querySelector(`.ln[data-line="${span!.from}"]`)?.scrollIntoView({ block: 'nearest' })
    }
    this.highlighted = key
  }

  // MARK: - Java tippen

  /** Code zum Dokument: selbst getippt, an eine Änderung im Struktogramm angepasst, oder neu erzeugt. */
  private textForDocument(doc: VSDocument, context: LiveContext): string {
    const known = this.textFor.get(doc)
    if (known !== undefined) return known
    const before = this.shown.get(context.owner)
    if (before) return mergeLiveJava(before.text, before.doc, doc, this.labels, { subprograms: context.subprograms })
    return plainLiveJava(doc, this.labels)
  }

  private refreshEditor(doc: VSDocument, highlight: number[] | undefined, context: LiveContext) {
    const text = this.textForDocument(doc, context)
    this.textFor.set(doc, text)
    this.shown.set(context.owner, { doc, text })
    this.input.readOnly = !context.editable
    if (this.input.value !== text) {
      const caret = this.input.selectionStart
      this.input.value = text
      if (document.activeElement === this.input) this.input.setSelectionRange(Math.min(caret, text.length), Math.min(caret, text.length))
      this.analyze(text, context)
    } else if (!this.parsed) this.analyze(text, context)
    // Unverändert erzeugter Code: Zeilen genau wie beim Erzeugen (auch bei Kästen mit mehreren Zeilen).
    this.spans = text === plainLiveJava(doc, this.labels) ? generateLiveCode(doc, 'java', this.labels).spans : (this.parsed?.spans ?? [])
    this.drawLayer(highlight)
  }

  private analyze(text: string, context: LiveContext) {
    this.parsed = parseLiveJava(text, this.labels, { subprograms: context.subprograms })
    this.placeholders = this.parsed.placeholders
    this.problems = this.parsed.problems
  }

  private drawLayer(highlight: number[] | undefined) {
    const span = highlight && this.spans.find((s) => samePath(s.path, highlight))
    const marks: Mark[] = this.placeholders.map((p) => ({ ...p, cls: 'ph' as const }))
    if (this.showProblems) marks.push(...this.problems.map((p) => ({ from: p.from, to: p.to, cls: 'err' as const })))
    this.layer.innerHTML = markedLinesHTML(this.input.value, marks)
      .map((html, i) => `<div class="ln${span && i >= span.from && i <= span.to ? ' sel' : ''}">${html || ' '}</div>`)
      .join('')
    const first = this.showProblems ? this.problems[0] : undefined
    this.problemLine.textContent = first ? t('web_parse_line_fmt', this.lineAt(first.from) + 1, t(first.key, first.arg ?? '')) : ''
    const key = span ? `${span.from}-${span.to}` : undefined
    if (key && key !== this.highlighted && document.activeElement !== this.input) {
      this.layer.children[span!.from]?.scrollIntoView({ block: 'nearest' })
    }
    this.highlighted = key
  }

  private lineAt(offset: number) {
    return this.input.value.slice(0, offset).split('\n').length - 1
  }

  /** Nach jeder Eingabe: Code lesen, Struktogramm neu, Element unter dem Cursor markieren. */
  private codeChanged() {
    const context = this.last?.context
    const doc = this.last?.doc
    if (!context || !doc) return
    const text = this.input.value
    this.analyze(text, context)
    const next = documentFromJava(doc, this.parsed!)
    // Nur Kommentare oder Leerzeichen geändert: Struktogramm bleibt dasselbe.
    const same = JSON.stringify([next.caption, next.elements]) === JSON.stringify([doc.caption, doc.elements])
    const result = same ? doc : next
    this.textFor.set(result, text)
    this.shown.set(context.owner, { doc: result, text })
    this.showProblems = false
    window.clearTimeout(this.problemTimer)
    this.problemTimer = window.setTimeout(() => {
      this.showProblems = true
      this.drawLayer(this.last?.highlight)
    }, problemDelay)
    const line = this.lineAt(this.input.selectionStart)
    const path = spanAtLine(this.parsed!.spans, line)?.path
    if (same) {
      this.spans = this.parsed!.spans
      this.drawLayer(this.last?.highlight)
      if (path) this.onSelect(path)
    } else this.onCode(result, path)
    // Das Textfeld scrollt nicht selbst (es ist so groß wie der Code), also die Zeile mit dem Cursor zeigen.
    this.layer.children[line]?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  /** Cursor in einer Zeile: passendes Element markieren; im Platzhalter das ganze Wort auswählen. */
  private caretMoved() {
    const { selectionStart: s, selectionEnd: e } = this.input
    if (s === e) {
      const ph = this.placeholders.find((p) => s > p.from && s < p.to)
      if (ph) this.input.setSelectionRange(ph.from, ph.to)
    }
    const span = spanAtLine(this.spans, this.lineAt(s))
    const current = this.last?.highlight
    if (span && !this.input.readOnly && !(current && samePath(current, span.path))) this.onSelect(span.path)
  }

  private replace(from: number, to: number, text: string) {
    this.input.setRangeText(text, from, to, 'end')
    this.codeChanged()
  }

  private setupEditor() {
    const input = this.input
    input.addEventListener('input', () => this.codeChanged())
    input.addEventListener('scroll', () => {
      input.scrollTop = 0
      input.scrollLeft = 0
    })
    for (const type of ['click', 'keyup'] as const) input.addEventListener(type, () => this.caretMoved())
    // Platzhalter wie in einem HTML-Formular: Wer hineintippt, ersetzt das ganze graue Wort.
    input.addEventListener('beforeinput', (e) => {
      if (input.readOnly) return
      const { selectionStart: s, selectionEnd: end } = input
      if (s !== end) return
      const ph = this.placeholders.find((p) => s >= p.from && s <= p.to)
      if (!ph) return
      if (e.inputType === 'insertText' || e.inputType === 'insertFromPaste') {
        const data = e.data ?? e.dataTransfer?.getData('text/plain') ?? ''
        e.preventDefault()
        this.replace(ph.from, ph.to, data)
      } else if ((e.inputType === 'deleteContentBackward' && s > ph.from) || (e.inputType === 'deleteContentForward' && s < ph.to)) {
        e.preventDefault()
        this.replace(ph.from, ph.to, '')
      }
    })
    input.addEventListener('keydown', (e) => {
      if (e.isComposing) return
      const mod = e.metaKey || e.ctrlKey
      if (mod && (e.key.toLowerCase() === 'z' || e.key.toLowerCase() === 'y')) {
        // Rückgängig gilt für Code und Struktogramm gemeinsam.
        e.preventDefault()
        this.onUndo(e.key.toLowerCase() === 'y' || e.shiftKey)
        return
      }
      if (input.readOnly || mod || e.altKey) return
      const { selectionStart: s, selectionEnd: end, value } = input
      const lineStart = value.lastIndexOf('\n', s - 1) + 1
      const before = value.slice(lineStart, s)
      const indent = /^[ \t]*/.exec(before)![0]
      if (e.key === 'Enter') {
        // Einrückung der Zeile übernehmen, nach `{` eine Stufe mehr.
        e.preventDefault()
        const opens = /[{:]\s*$|->\s*$/.test(before.replace(/\/\/.*$/, ''))
        this.replace(s, end, '\n' + indent + (opens ? indentStep : ''))
      } else if (e.key === 'Tab') {
        e.preventDefault()
        if (e.shiftKey) {
          const remove = /^( {1,4}|\t)/.exec(value.slice(lineStart))?.[0].length ?? 0
          if (remove) {
            input.setRangeText('', lineStart, lineStart + remove, 'preserve')
            input.setSelectionRange(Math.max(lineStart, s - remove), Math.max(lineStart, end - remove))
            this.codeChanged()
          }
        } else this.replace(s, end, indentStep)
      } else if (e.key === '}' && s === end && before.trim() === '' && before.endsWith(indentStep)) {
        // `}` in einer leeren Zeile rückt eine Stufe aus.
        e.preventDefault()
        this.replace(s - indentStep.length, s, '}')
      } else if (e.key === 'Escape') input.blur()
    })
  }
}
