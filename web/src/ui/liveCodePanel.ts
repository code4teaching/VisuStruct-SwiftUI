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
import { describeValue, SimulationEngine, type SimStep, type SubprogramResolver } from '../core/simulation'
import { gridTable, noticeText, type ConsoleTranscript } from './simulationPanel'
import { JavaEditor, type SnippetWords } from './javaEditor'
import { icons } from './icons'
import { indentJava } from '../core/javaIndent'
import { sidebarIcon } from './learnPanel'
import { closeWindows, compileAndRun, prepareJava } from './javaRuntime'

/**
 * Ansicht „Code live“: rechts neben dem Struktogramm der Java-, JavaScript- oder Python-Code, der bei jeder Änderung mitwächst.
 * In Java kann man den Code auch selbst tippen: Dann baut sich das Struktogramm mit.
 */

const targetKey = 'visustruct.live.target'
const javaClassKey = 'visustruct.live.javaClass'
const javaMainKey = 'visustruct.live.javaMain'
const swingKey = 'visustruct.live.swing'
const consoleHeightKey = 'visustruct.console.height'

function storedFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return false
  }
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
  /**
   * Laufendes Programm. `paused`: Debugger hält vor einer Zeile an (Haltepunkt oder Einzelschritt).
   * `stepping`: nach einer Eingabe wieder anhalten statt weiterlaufen.
   */
  private run?: {
    engine: SimulationEngine
    doc: VSDocument
    printed: number
    timer?: number
    paused: boolean
    stepping: boolean
    /** Einmal angehalten: Variablen bleiben bis zum Ende sichtbar. */
    debugged: boolean
    /** Werte beim letzten Anhalten, um Änderungen hervorzuheben. */
    values?: Map<string, string>
  }
  /** Zeile, die als Nächstes ausgeführt wird (gelb), solange der Debugger anhält. */
  private debugLine?: number
  private breakpoints = new Set<number>()
  /** Swing-Unterstützung (Zahnrad-Menü): Java läuft dann als echtes Java mit CheerpJ. */
  private swing = storedFlag(swingKey)
  /** Fläche für die Swing-Fenster; bleibt über `build()` hinweg bestehen, weil CheerpJ sie einmal übernimmt. */
  private swingElement: HTMLElement
  private swingDisplay: HTMLElement
  private runButton!: HTMLButtonElement
  private stepButton!: HTMLButtonElement
  private stopButton!: HTMLButtonElement
  private indentButton!: HTMLButtonElement
  private debugPanel!: HTMLElement
  private debugVars!: HTMLElement
  /** Konsole unter dem Code, darüber eine Trennlinie zum Verschieben. */
  private consoleElement: HTMLElement
  private consoleResizer: HTMLElement
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
    this.consoleElement = document.createElement('section')
    this.consoleElement.className = 'console'
    this.consoleElement.hidden = true
    this.consoleResizer = this.makeConsoleResizer()
    this.swingElement = document.createElement('section')
    this.swingElement.className = 'console livecode-swing'
    this.swingElement.hidden = true
    this.swingDisplay = document.createElement('div')
    this.swingDisplay.className = 'livecode-swing-display'
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
    if (this.run) window.clearTimeout(this.run.timer)
    this.element.innerHTML = `
      <div class="livecode-head">
        <h2>${esc(t('web_live_title'))}</h2>
        <span class="livecode-lang"></span>
        <button class="icon livecode-run livecode-indent" data-tip="${esc(t('web_live_indent_title'))}" aria-label="${esc(t('web_live_indent'))}">${icons.indent}</button>
        <button class="icon livecode-run primary" data-run="play" data-tip="${esc(t('web_live_run_title'))}" aria-label="${esc(t('web_live_run'))}">${icons.play}</button>
        <button class="icon livecode-run" data-run="step" data-tip="${esc(t('web_debug_step_title'))}" aria-label="${esc(t('web_debug_step'))}">${icons.step}</button>
        <button class="icon livecode-run" data-run="stop" data-tip="${esc(t('simulation_stop'))}" aria-label="${esc(t('simulation_stop'))}" disabled>${icons.stop}</button>
        <button class="learn-hide" title="${esc(t('web_live_hide'))}" aria-label="${esc(t('web_live_hide'))}">${sidebarIcon}</button>
      </div>
      <p class="hint"></p>
      <pre class="code-view livecode-view" tabindex="0" dir="ltr"></pre>
      <div class="code-view livecode-editor" dir="ltr"></div>
      <p class="livecode-problem" role="status" aria-live="polite"></p>
      <section class="livecode-debug" hidden>
        <h2>${esc(t('simulation_variables'))}</h2>
        <div class="sim-vars livecode-vars" dir="ltr"></div>
      </section>
    `
    this.consoleElement.innerHTML = `
      <div class="console-head">
        <h2>${esc(t('web_console'))}</h2>
        <button class="console-hide" title="${esc(t('web_console_hide'))}" aria-label="${esc(t('web_console_hide'))}">▾</button>
      </div>
      <div class="livecode-console-lines mono" dir="ltr" aria-live="polite"></div>
      <form class="livecode-console-input" hidden>
        <label><span></span><input autocomplete="off" /></label>
        <button type="submit">${esc(t('simulation_input_submit'))}</button>
        <p class="livecode-console-error"></p>
      </form>
      <p class="livecode-console-notice" role="status"></p>
    `
    this.view = this.element.querySelector('.livecode-view')!
    this.editor = this.element.querySelector('.livecode-editor')!
    this.problemLine = this.element.querySelector('.livecode-problem')!
    this.hint = this.element.querySelector('.hint')!
    this.element.querySelector('.learn-hide')!.addEventListener('click', () => this.onHide())
    this.runButton = this.element.querySelector('[data-run=play]')!
    this.stepButton = this.element.querySelector('[data-run=step]')!
    this.stopButton = this.element.querySelector('[data-run=stop]')!
    this.indentButton = this.element.querySelector('.livecode-indent')!
    this.indentButton.addEventListener('click', () => this.code.indent())
    this.debugPanel = this.element.querySelector('.livecode-debug')!
    this.debugVars = this.element.querySelector('.livecode-vars')!
    this.swingElement.innerHTML = `
      <div class="console-head">
        <h2>${esc(t('web_live_swing_windows'))}</h2>
        <button class="console-hide" title="${esc(t('web_live_swing_hide'))}" aria-label="${esc(t('web_live_swing_hide'))}">▾</button>
      </div>
    `
    this.swingElement.append(this.swingDisplay)
    this.swingElement.querySelector('.console-hide')!.addEventListener('click', () => {
      this.swingElement.hidden = true
      void closeWindows()
    })
    const c = this.consoleElement
    this.consoleResizer.title = t('web_console_resize')
    this.element.append(this.swingElement, this.consoleResizer, c)
    this.consoleLines = c.querySelector('.livecode-console-lines')!
    this.consoleForm = c.querySelector('.livecode-console-input')!
    this.consoleNotice = c.querySelector('.livecode-console-notice')!
    c.querySelector('.console-hide')!.addEventListener('click', () => this.hideConsole())
    this.runButton.addEventListener('click', () => (this.run?.paused ? this.resume() : this.startRun(false)))
    this.stepButton.addEventListener('click', () => (this.run?.paused ? this.stepOnce() : this.startRun(true)))
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
        breakpointLine: (line) => spanAtLine(this.spans, line)?.from,
        onBreakpoints: () => (this.breakpoints = this.code.breakpoints),
      },
      t('web_live_edit_label'),
    )
    this.editor.querySelector<HTMLElement>('.cm-gutters')!.title = t('web_debug_gutter_title')
    this.breakpoints = new Set()
    this.debugLine = undefined
    this.highlighted = undefined
    this.html = ''
    this.parsed = undefined
    this.showMode()
  }

  /** Java-Code zum Speichern: wie in Code live (mit getippten Kommentaren), sonst neu erzeugt. */
  javaFor(doc: VSDocument, owner: object): string {
    const known = this.textFor.get(doc)
    if (known !== undefined) return known
    const before = this.shown.get(owner)
    if (before) return mergeLiveJava(before.text, before.doc, doc, this.labels, {}, this.form)
    return plainLiveJava(doc, this.labels, this.form)
  }

  /** Gespeicherten Code (.java) zum geöffneten Struktogramm übernehmen, samt Kommentaren. */
  adoptJava(doc: VSDocument, text: string) {
    this.textFor.set(doc, text)
    this.parsed = undefined
    if (this.last) this.refresh(this.last.doc, this.last.highlight, this.last.context)
  }

  /** Struktogramm aus einer .java-Datei ohne passendes .visustruct. */
  documentFromJavaText(text: string): VSDocument {
    return documentFromJava({ caption: '', elements: [] }, parseLiveJava(text, this.labels))
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

  /** Swing-Unterstützung (Zahnrad-Menü): erst beim nächsten Ausführen wird Java geladen. */
  get swingSupport(): boolean {
    return this.swing
  }

  setSwingSupport(on: boolean) {
    this.swing = on
    try {
      localStorage.setItem(swingKey, on ? '1' : '0')
    } catch {
      /* ohne Speicher: nur für diese Sitzung */
    }
    if (!on) this.swingElement.hidden = true
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
    this.indentButton.hidden = !java
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

  /**
   * Das Programm mit der Simulation ausführen: Ausgaben und Eingaben in der Konsole.
   * Es hält an Haltepunkten an; `stepping`: gleich vor der ersten Zeile anhalten (Einzelschritt).
   */
  private startRun(stepping: boolean) {
    // Debuggen geht nur mit der Simulation; ohne Haltepunkt und Einzelschritt läuft Swing-Code als echtes Java.
    if (this.swing && this.target === 'java' && !stepping && this.code.breakpoints.size === 0) return void this.startJavaRun()
    if (!this.last) return
    this.stopRun(false)
    this.run = {
      engine: new SimulationEngine(this.last.doc, this.last.context.resolve),
      doc: this.last.doc,
      printed: 0,
      paused: false,
      stepping,
      debugged: false,
    }
    this.breakpoints = this.code.breakpoints
    this.debugPanel.hidden = true
    this.setConsoleVisible(true)
    this.consoleLines.replaceChildren()
    this.consoleNotice.textContent = ''
    this.consoleNotice.classList.remove('error')
    this.setRunning(true)
    if (stepping) this.pause()
    else this.continueRun(false)
  }

  /** Mit Swing-Unterstützung: den getippten Java-Code mit javac übersetzen und als echtes Java starten. */
  private async startJavaRun() {
    this.stopRun(false)
    this.setConsoleVisible(true)
    this.consoleLines.replaceChildren()
    // CheerpJ schreibt System.out in das Element mit dieser id.
    this.consoleLines.id = 'console'
    this.consoleForm.hidden = true
    this.consoleNotice.classList.remove('error')
    this.runButton.disabled = this.stepButton.disabled = true
    try {
      this.consoleNotice.textContent = t('web_live_swing_loading')
      await prepareJava(this.swingDisplay)
      this.consoleNotice.textContent = t('web_live_swing_compiling')
      const result = await compileAndRun(this.code.text, () => (this.swingElement.hidden = false))
      this.consoleNotice.textContent = t(
        { 'compile-error': 'web_live_swing_compile_failed', windows: 'web_live_swing_running', finished: 'web_live_run_finished' }[result],
      )
      this.consoleNotice.classList.toggle('error', result === 'compile-error')
      // Ohne offenes Fenster braucht es die Fensterfläche nicht.
      this.swingElement.hidden = result !== 'windows'
    } catch {
      this.consoleNotice.textContent = t('web_live_swing_failed')
      this.consoleNotice.classList.add('error')
    }
    this.runButton.disabled = this.stepButton.disabled = false
  }

  /** `fromPause`: Der erste Schritt läuft auch auf einem Haltepunkt, sonst bliebe „Weiter“ dort stehen. */
  private continueRun(fromPause: boolean) {
    const run = this.run
    if (!run) return
    const { engine } = run
    for (let i = 0; i < runChunk && engine.canStep; i++) {
      if (!(fromPause && i === 0) && this.atBreakpoint(engine.steps[engine.state.stepIndex])) {
        this.printNewLines()
        return this.pause()
      }
      engine.step()
    }
    if (this.afterSteps()) return
    run.timer = window.setTimeout(() => this.continueRun(false), 0)
  }

  /** Ausgaben zeigen; Eingabe, Ende oder Fehler behandeln. `true`: Es geht nicht von selbst weiter. */
  private afterSteps(): boolean {
    const run = this.run!
    const state = run.engine.state
    this.printNewLines()
    if (state.inputRequest) {
      this.askInput()
      return true
    }
    if (state.isHalted || !run.engine.canStep) {
      this.finishRun(state.isHalted && state.notice ? noticeText(state.notice) : t('web_live_run_finished'), state.isHalted)
      return true
    }
    return false
  }

  /** Haltepunkt vor diesem Schritt? Im Unterprogramm nicht (dessen Zeilen stehen nicht hier), bei `for` nur vor der Bedingung. */
  private atBreakpoint(step: SimStep | undefined): boolean {
    if (!step || step.callPath || step.kind === 'forLoopIncrement' || step.kind === 'forLoopStart' || step.kind === 'callEnd') return false
    const line = this.lineOf(step.path)
    return line !== undefined && this.breakpoints.has(line)
  }

  private lineOf(path: number[] | undefined): number | undefined {
    return path && this.spans.find((s) => samePath(s.path, path))?.from
  }

  /** Debugger hält an: Zeile gelb, Element im Struktogramm ausgewählt, Variablen zeigen. */
  private pause() {
    const run = this.run!
    run.paused = true
    run.debugged = true
    const path = run.engine.currentStepPath
    this.debugLine = this.lineOf(path)
    this.consoleNotice.classList.remove('error')
    this.consoleNotice.textContent = this.debugLine === undefined ? '' : t('web_debug_paused_fmt', this.debugLine + 1)
    this.showVariables()
    this.setRunning(true)
    const current = this.last?.highlight
    if (path && !(current && samePath(current, path))) this.onSelect(path)
    else this.drawMarks(this.last?.highlight)
  }

  /** Weiter bis zum nächsten Haltepunkt oder zum Ende. */
  private resume() {
    const run = this.run
    if (!run?.paused) return
    run.paused = false
    run.stepping = false
    this.leavePause()
    this.continueRun(true)
  }

  /** Einzelschritt: einen Schritt ausführen und wieder anhalten. */
  private stepOnce() {
    const run = this.run
    if (!run?.paused) return
    run.paused = false
    run.stepping = true
    this.leavePause()
    const { engine } = run
    const kind = engine.steps[engine.state.stepIndex]?.kind
    engine.step()
    // `for`: Zählen bzw. Anfangswert und Prüfen der Bedingung sind ein Schritt (dieselbe Zeile).
    if ((kind === 'forLoopStart' || kind === 'forLoopIncrement') && engine.canStep && engine.steps[engine.state.stepIndex]?.kind === 'forLoopCondition') {
      engine.step()
    }
    if (!this.afterSteps()) this.pause()
  }

  private leavePause() {
    this.debugLine = undefined
    this.consoleNotice.textContent = ''
    this.setRunning(true)
    this.drawMarks(this.last?.highlight)
  }

  /** Variablen wie in der Simulation; seit dem letzten Anhalten geänderte Werte leuchten kurz auf. */
  private showVariables() {
    const run = this.run!
    const variables = run.engine.state.variables
    this.debugPanel.hidden = false
    const names = [...variables.keys()].sort((a, b) => a.localeCompare(b))
    if (names.length === 0) {
      this.debugVars.innerHTML = `<p class="placeholder">${esc(t('simulation_variables_placeholder'))}</p>`
    } else {
      const table = document.createElement('table')
      for (const name of names) {
        const value = variables.get(name)!
        const text = describeValue(value)
        const row = table.insertRow()
        row.insertCell().textContent = name
        const cell = row.insertCell()
        if (value.kind === 'grid') cell.append(gridTable(value))
        else cell.textContent = text
        if (run.values && run.values.get(name) !== text) row.classList.add('changed')
      }
      this.debugVars.replaceChildren(table)
    }
    // Beim ersten Anhalten ist alles neu: dann nichts hervorheben.
    run.values = new Map(names.map((name) => [name, describeValue(variables.get(name)!)]))
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
    if (!run.stepping) return this.continueRun(false)
    if (!this.afterSteps()) this.pause()
  }

  private stopRun(byUser: boolean) {
    if (!this.run) return
    window.clearTimeout(this.run.timer)
    if (byUser) this.finishRun(t('web_live_run_stopped'), false)
    this.run = undefined
    this.debugLine = undefined
    this.debugPanel.hidden = true
    this.setRunning(false)
    this.drawMarks(this.last?.highlight)
  }

  private finishRun(message: string, error: boolean) {
    if (this.run) window.clearTimeout(this.run.timer)
    this.consoleForm.hidden = true
    this.consoleNotice.textContent = message
    this.consoleNotice.classList.toggle('error', error)
    // Nach dem Debuggen die Werte am Ende zeigen.
    if (this.run?.debugged) this.showVariables()
    else this.debugPanel.hidden = true
    this.run = undefined
    this.debugLine = undefined
    this.setRunning(false)
    this.drawMarks(this.last?.highlight)
  }

  /** Während der Simulation: Konsole zeigt deren Ausgaben und Eingaben (beim Start leer). */
  showTranscript(transcript: ConsoleTranscript) {
    this.stopRun(false)
    this.setConsoleVisible(true)
    this.consoleForm.hidden = true
    this.consoleLines.replaceChildren()
    for (const line of transcript.lines) {
      const div = this.consoleLine(line.text)
      if (line.typed !== undefined) {
        const value = document.createElement('span')
        value.className = 'typed'
        value.textContent = line.typed
        div.append(value)
      }
    }
    if (transcript.pending !== undefined) this.consoleLine(transcript.pending).classList.add('pending')
    this.consoleLines.scrollTop = this.consoleLines.scrollHeight
    this.consoleNotice.textContent = transcript.notice ?? ''
    this.consoleNotice.classList.toggle('error', transcript.error)
  }

  /** Konsole schließen; ein laufendes Programm hält dabei an. */
  hideConsole() {
    this.stopRun(false)
    this.setConsoleVisible(false)
  }

  private setConsoleVisible(on: boolean) {
    if (this.consoleElement.hidden === !on) return
    this.consoleElement.hidden = !on
    this.consoleResizer.hidden = !on
  }

  /** Waagrechte Trennlinie zwischen Code und Konsole: nach oben ziehen macht die Konsole höher. */
  private makeConsoleResizer(): HTMLElement {
    const bar = document.createElement('div')
    bar.className = 'console-resizer'
    bar.hidden = true
    bar.tabIndex = 0
    bar.setAttribute('role', 'separator')
    bar.setAttribute('aria-orientation', 'horizontal')
    const panel = this.consoleElement
    const clamp = (height: number) => Math.round(Math.max(80, Math.min(height, this.element.getBoundingClientRect().height - 160)))
    const apply = (height: number | undefined, remember: boolean) => {
      panel.style.height = height === undefined ? '' : `${clamp(height)}px`
      if (remember) storeValue(consoleHeightKey, height === undefined ? '' : String(clamp(height)))
    }
    const saved = Number(storedValue(consoleHeightKey))
    if (saved > 0) panel.style.height = `${saved}px`
    bar.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return
      e.preventDefault()
      bar.setPointerCapture(e.pointerId)
      const startY = e.clientY
      const startHeight = panel.getBoundingClientRect().height
      bar.classList.add('dragging')
      const move = (ev: PointerEvent) => apply(startHeight - (ev.clientY - startY), false)
      const up = (ev: PointerEvent) => {
        bar.removeEventListener('pointermove', move)
        bar.removeEventListener('pointerup', up)
        bar.removeEventListener('pointercancel', up)
        bar.classList.remove('dragging')
        apply(startHeight - (ev.clientY - startY), true)
      }
      bar.addEventListener('pointermove', move)
      bar.addEventListener('pointerup', up)
      bar.addEventListener('pointercancel', up)
    })
    bar.addEventListener('dblclick', () => apply(undefined, true))
    bar.addEventListener('keydown', (e) => {
      const step = e.key === 'ArrowUp' ? 20 : e.key === 'ArrowDown' ? -20 : 0
      if (!step) return
      e.preventDefault()
      apply(panel.getBoundingClientRect().height + step, true)
    })
    return bar
  }

  private setRunning(on: boolean) {
    const paused = !!this.run?.paused
    this.runButton.disabled = on && !paused
    this.stepButton.disabled = on && !paused
    this.stopButton.disabled = !on
    this.indentButton.disabled = on
    const tip = t(paused ? 'web_debug_continue' : 'web_live_run_title')
    this.runButton.dataset.tip = tip
    this.runButton.setAttribute('aria-label', paused ? tip : t('web_live_run'))
    this.element.classList.toggle('running', on && !paused)
    this.element.classList.toggle('debugging', paused)
    // Während das Programm läuft, bleibt der Code, wie er ist.
    this.code.setReadOnly(on || !this.last?.context.editable)
  }

  // MARK: - Java tippen

  /** Code zum Dokument: selbst getippt, an eine Änderung im Struktogramm angepasst, oder neu erzeugt. */
  private textForDocument(doc: VSDocument, context: LiveContext): string {
    const known = this.textFor.get(doc)
    if (known !== undefined) return known
    const before = this.shown.get(context.owner)
    if (before) return indentChanged(before.text, mergeLiveJava(before.text, before.doc, doc, this.labels, { subprograms: context.subprograms }, this.form))
    return plainLiveJava(doc, this.labels, this.form)
  }

  private refreshEditor(doc: VSDocument, highlight: number[] | undefined, context: LiveContext) {
    const text = this.textForDocument(doc, context)
    this.textFor.set(doc, text)
    this.shown.set(context.owner, { doc, text })
    // Struktogramm geändert oder anderer Reiter: Das laufende Programm passt nicht mehr dazu.
    if (this.run && this.run.doc !== doc) this.stopRun(false)
    this.code.setReadOnly(!context.editable || !!this.run)
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
        current: this.debugLine,
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

/** Nach einer Änderung im Struktogramm: nur die geänderten Zeilen passend zum getippten Code einrücken. */
function indentChanged(before: string, after: string): string {
  const a = before.split('\n')
  const b = after.split('\n')
  let start = 0
  while (start < a.length && start < b.length && a[start] === b[start]) start++
  if (start === b.length && a.length === b.length) return after
  let end = 0
  while (end < a.length - start && end < b.length - start && a[a.length - 1 - end] === b[b.length - 1 - end]) end++
  return b.length - end > start ? indentJava(after, start + 1, b.length - end) : after
}
