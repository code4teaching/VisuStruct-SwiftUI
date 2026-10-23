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
import { documentFromJava, liveJava, mergeLiveJava, plainLiveJava, type JavaForm } from '../core/liveSource'
import type { VSDocument } from '../core/model'
import { SimulationEngine, type SubprogramResolver } from '../core/simulation'
import { noticeText } from './simulationPanel'
import { JavaEditor, type SnippetWords } from './javaEditor'
import { sidebarIcon } from './learnPanel'

/**
 * Ansicht „Code live“: rechts neben dem Struktogramm der Java-, JavaScript- oder Python-Code, der bei jeder Änderung mitwächst.
 * In Java kann man den Code auch selbst tippen: Dann baut sich das Struktogramm mit.
 */

const targetKey = 'visustruct.live.target'
const javaClassKey = 'visustruct.live.javaClass'
const javaMainKey = 'visustruct.live.javaMain'

function storedFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

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

/** Fehler erst nach einer kurzen Pause zeigen: Beim Tippen ist eine Zeile fast immer kurz „falsch“. */
const problemDelay = 900

export interface LiveContext {
  /** Gehört der Code zu diesem Reiter? Getippter Text wird je Reiter gemerkt. */
  owner: object
  /** Unterprogramme aus den anderen Reitern. */
  subprograms: Set<string>
  /** Zeilen anklickbar und Code bearbeitbar (nicht während der Simulation). */
  editable: boolean
  /** Für „Ausführen“: Unterprogramme in anderen Reitern. */
  resolve: SubprogramResolver
}

/** So viele Schritte am Stück, dann kurz Luft für die Oberfläche (und für „Stopp“ bei Endlosschleifen). */
const runChunk = 2000

export class LiveCodePanel {
  readonly element: HTMLElement
  private view!: HTMLElement
  private editor!: HTMLElement
  private code!: JavaEditor
  private problemLine!: HTMLElement
  private hint!: HTMLElement
  private spans: LiveSpan[] = []
  private highlighted?: string
  private html = ''
  private target = storedTarget()
  private last?: { doc: VSDocument; highlight?: number[]; context: LiveContext }
  /** Getippter Code zu einem Dokument (auch für Rückgängig). */
  private textFor = new WeakMap<VSDocument, string>()
  private form: JavaForm = { asClass: storedFlag(javaClassKey), withMain: storedFlag(javaMainKey) }
  /** Zuletzt gezeigter Code je Reiter: Grundlage, wenn sich das Struktogramm danach ändert. */
  private shown = new WeakMap<object, { doc: VSDocument; text: string }>()
  private parsed?: ParsedJava
  private placeholders: { from: number; to: number }[] = []
  private problems: JavaProblem[] = []
  private problemTimer?: number
  private showProblems = true
  private run?: { engine: SimulationEngine; printed: number; timer?: number }
  private runButton!: HTMLButtonElement
  private stopButton!: HTMLButtonElement
  private console!: HTMLElement
  private consoleLines!: HTMLElement
  private consoleForm!: HTMLFormElement
  private consoleNotice!: HTMLElement

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
        <span class="livecode-lang"></span>
        <button class="livecode-run primary" data-run="play" title="${esc(t('web_live_run_title'))}">▶︎ ${esc(t('web_live_run'))}</button>
        <button class="livecode-run" data-run="stop" disabled>■ ${esc(t('simulation_stop'))}</button>
        <button class="learn-hide" title="${esc(t('web_live_hide'))}" aria-label="${esc(t('web_live_hide'))}">${sidebarIcon}</button>
      </div>
      <p class="hint"></p>
      <pre class="code-view livecode-view" tabindex="0" dir="ltr"></pre>
      <div class="code-view livecode-editor" dir="ltr"></div>
      <p class="livecode-problem" role="status" aria-live="polite"></p>
      <section class="livecode-console" hidden>
        <h3>${esc(t('simulation_output'))}</h3>
        <div class="livecode-console-lines mono" dir="ltr" aria-live="polite"></div>
        <form class="livecode-console-input" hidden>
          <label><span></span><input autocomplete="off" /></label>
          <button type="submit">${esc(t('simulation_input_submit'))}</button>
          <p class="livecode-console-error"></p>
        </form>
        <p class="livecode-console-notice" role="status"></p>
      </section>
    `
    this.view = this.element.querySelector('.livecode-view')!
    this.editor = this.element.querySelector('.livecode-editor')!
    this.problemLine = this.element.querySelector('.livecode-problem')!
    this.hint = this.element.querySelector('.hint')!
    this.element.querySelector('.learn-hide')!.addEventListener('click', () => this.onHide())
    this.runButton = this.element.querySelector('[data-run=play]')!
    this.stopButton = this.element.querySelector('[data-run=stop]')!
    this.console = this.element.querySelector('.livecode-console')!
    this.consoleLines = this.element.querySelector('.livecode-console-lines')!
    this.consoleForm = this.element.querySelector('.livecode-console-input')!
    this.consoleNotice = this.element.querySelector('.livecode-console-notice')!
    this.runButton.addEventListener('click', () => this.startRun())
    this.stopButton.addEventListener('click', () => this.stopRun(true))
    this.consoleForm.addEventListener('submit', (e) => {
      e.preventDefault()
      this.submitInput()
    })
    this.run = undefined
    this.view.addEventListener('click', (e) => {
      const row = (e.target as HTMLElement).closest<HTMLElement>('.ln')
      if (!row || !this.view.classList.contains('selectable')) return
      const span = spanAtLine(this.spans, Number(row.dataset.line))
      if (span) this.onSelect(span.path)
    })
    this.code = new JavaEditor(
      this.editor,
      {
        onChange: () => this.codeChanged(),
        onCaret: () => this.caretMoved(),
        onUndo: (redo) => this.onUndo(redo),
        words: () => this.snippetWords,
      },
      t('web_live_edit_label'),
    )
    this.highlighted = undefined
    this.html = ''
    this.parsed = undefined
    this.showMode()
  }

  /** Java als Snippet, mit `main`, in einer Klasse (Zahnrad-Menü). */
  get javaForm(): JavaForm {
    return this.form
  }

  setJavaForm(form: JavaForm) {
    this.form = form
    try {
      localStorage.setItem(javaClassKey, form.asClass ? '1' : '0')
      localStorage.setItem(javaMainKey, form.withMain ? '1' : '0')
    } catch {
      /* ohne Speicher: nur für diese Sitzung */
    }
    // Neu erzeugen: Der bisherige Text hat noch die alte Form.
    this.textFor = new WeakMap()
    this.shown = new WeakMap()
    this.parsed = undefined
    if (this.last) this.refresh(this.last.doc, this.last.highlight, this.last.context)
  }

  /** Programmiersprache (im Zahnrad-Menü). */
  get language(): LiveTarget {
    return this.target
  }

  setTarget(target: LiveTarget) {
    this.target = target
    try {
      localStorage.setItem(targetKey, target)
    } catch {
      /* ohne Speicher: nur für diese Sitzung */
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
    this.element.querySelector('.livecode-lang')!.textContent = { java: 'Java', javascript: 'JavaScript', python: 'Python' }[this.target]
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

  // MARK: - Ausführen

  /** Das Programm mit der Simulation ausführen, ohne Schritt-für-Schritt-Anzeige: nur Ausgaben und Eingaben. */
  private startRun() {
    if (!this.last) return
    this.stopRun(false)
    this.run = { engine: new SimulationEngine(this.last.doc, this.last.context.resolve), printed: 0 }
    this.console.hidden = false
    this.consoleLines.replaceChildren()
    this.consoleNotice.textContent = ''
    this.consoleNotice.classList.remove('error')
    this.setRunning(true)
    this.continueRun()
  }

  private continueRun() {
    const run = this.run
    if (!run) return
    const { engine } = run
    for (let i = 0; i < runChunk && engine.canStep; i++) engine.step()
    this.printNewLines()
    const state = engine.state
    if (state.inputRequest) return this.askInput()
    if (state.isHalted || !engine.canStep) {
      this.finishRun(state.isHalted && state.notice ? noticeText(state.notice) : t('web_live_run_finished'), state.isHalted)
      return
    }
    run.timer = window.setTimeout(() => this.continueRun(), 0)
  }

  /** `typed`: Eingabezeile mit Frage und der getippten Antwort (farbig). */
  private printNewLines(typed?: { prompt: string; value: string }) {
    const run = this.run
    if (!run) return
    const lines = run.engine.state.outputLines
    for (; run.printed < lines.length; run.printed++) this.consoleLine(lines[run.printed])
    if (typed) {
      const div = this.consoleLine(typed.prompt ? `${typed.prompt} ` : '')
      const value = document.createElement('span')
      value.className = 'typed'
      value.textContent = typed.value
      div.append(value)
    }
    this.consoleLines.scrollTop = this.consoleLines.scrollHeight
  }

  private consoleLine(text: string): HTMLElement {
    const div = document.createElement('div')
    div.textContent = text
    this.consoleLines.append(div)
    return div
  }

  private askInput() {
    const request = this.run!.engine.state.inputRequest!
    const error = this.run!.engine.state.inputErrorNotice
    this.consoleForm.hidden = false
    this.consoleForm.querySelector('span')!.textContent = request.prompt
    const field = this.consoleForm.querySelector('input')!
    field.inputMode = request.valueType === 'string' || request.valueType === 'boolean' ? 'text' : 'decimal'
    const errorLine = this.consoleForm.querySelector<HTMLElement>('.livecode-console-error')!
    errorLine.textContent = error ? noticeText(error) : ''
    errorLine.hidden = !error
    requestAnimationFrame(() => field.focus())
  }

  private submitInput() {
    const run = this.run
    if (!run?.engine.state.inputRequest) return
    const field = this.consoleForm.querySelector('input')!
    const prompt = run.engine.state.inputRequest.prompt
    run.engine.provideInput(field.value)
    if (run.engine.state.inputRequest) return this.askInput()
    this.printNewLines({ prompt, value: field.value })
    field.value = ''
    this.consoleForm.hidden = true
    this.continueRun()
  }

  private stopRun(byUser: boolean) {
    if (!this.run) return
    window.clearTimeout(this.run.timer)
    if (byUser) this.finishRun(t('web_live_run_stopped'), false)
    this.run = undefined
    this.setRunning(false)
  }

  private finishRun(message: string, error: boolean) {
    if (this.run) window.clearTimeout(this.run.timer)
    this.consoleForm.hidden = true
    this.consoleNotice.textContent = message
    this.consoleNotice.classList.toggle('error', error)
    this.run = undefined
    this.setRunning(false)
  }

  private setRunning(on: boolean) {
    this.runButton.disabled = on
    this.stopButton.disabled = !on
    this.element.classList.toggle('running', on)
  }

  // MARK: - Java tippen

  /** Code zum Dokument: selbst getippt, an eine Änderung im Struktogramm angepasst, oder neu erzeugt. */
  private textForDocument(doc: VSDocument, context: LiveContext): string {
    const known = this.textFor.get(doc)
    if (known !== undefined) return known
    const before = this.shown.get(context.owner)
    if (before) return mergeLiveJava(before.text, before.doc, doc, this.labels, { subprograms: context.subprograms }, this.form)
    return plainLiveJava(doc, this.labels, this.form)
  }

  private refreshEditor(doc: VSDocument, highlight: number[] | undefined, context: LiveContext) {
    const text = this.textForDocument(doc, context)
    this.textFor.set(doc, text)
    this.shown.set(context.owner, { doc, text })
    this.code.setReadOnly(!context.editable)
    if (this.code.text !== text) {
      this.code.setText(text)
      this.analyze(text, context)
    } else if (!this.parsed) this.analyze(text, context)
    // Unverändert erzeugter Code: Zeilen genau wie beim Erzeugen (auch bei Kästen mit mehreren Zeilen).
    const generated = liveJava(doc, this.labels, this.form)
    this.spans = text === generated.text ? generated.spans : (this.parsed?.spans ?? [])
    this.drawMarks(highlight)
  }

  private analyze(text: string, context: LiveContext) {
    this.parsed = parseLiveJava(text, this.labels, { subprograms: context.subprograms })
    this.placeholders = this.parsed.placeholders
    this.problems = this.parsed.problems
  }

  private drawMarks(highlight: number[] | undefined) {
    const span = highlight && this.spans.find((s) => samePath(s.path, highlight))
    const key = span ? `${span.from}-${span.to}` : undefined
    this.code.setMarks(
      {
        placeholders: this.placeholders,
        problems: this.showProblems ? this.problems : [],
        lines: span ? { from: span.from, to: span.to } : undefined,
      },
      key !== undefined && key !== this.highlighted && !this.code.hasFocus,
    )
    const first = this.showProblems ? this.problems[0] : undefined
    this.problemLine.textContent = first ? t('web_parse_line_fmt', this.code.lineAt(first.from) + 1, t(first.key, first.arg ?? '')) : ''
    this.highlighted = key
  }

  /** Nach jeder Eingabe: Code lesen, Struktogramm neu, Element unter dem Cursor markieren. */
  private codeChanged() {
    const context = this.last?.context
    const doc = this.last?.doc
    if (!context || !doc) return
    const text = this.code.text
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
      this.drawMarks(this.last?.highlight)
    }, problemDelay)
    const line = this.code.lineAt(this.code.caret)
    const path = spanAtLine(this.parsed!.spans, line)?.path
    if (same) {
      this.spans = this.parsed!.spans
      this.drawMarks(this.last?.highlight)
      if (path) this.onSelect(path)
    } else this.onCode(result, path)
  }

  /** Cursor in einer Zeile: passendes Element im Struktogramm markieren. */
  private caretMoved() {
    const span = spanAtLine(this.spans, this.code.lineAt(this.code.caret))
    const current = this.last?.highlight
    if (span && this.last?.context.editable && !(current && samePath(current, span.path))) this.onSelect(span.path)
  }

  private get snippetWords(): SnippetWords {
    const l = this.labels
    return {
      condition: l.condition,
      selector: l.selector,
      code: l.code,
      start: l.start,
      step: l.step,
      branch: t('element_verzweigung'),
      branchElse: t('element_verzweigung'),
      switchCase: t('element_fallauswahl'),
      forLoop: t('element_forSchleife'),
      whileLoop: t('element_whileSchleife'),
      doLoop: t('element_doUntilSchleife'),
      output: t('inspector_io_mode_output'),
      input: t('inspector_io_mode_input'),
    }
  }
}
