import { t } from './i18n'
import { generateCode, generateJavaClassFile, sanitizedJavaClassName, type CodeTarget } from '../core/codeGenerator'
import { subprogramName } from '../core/simulation'
import type { VSDocument } from '../core/model'

/** Port von `CodeGeneratorPanels.swift` und `Runner/JavaScriptRunner.swift`: Code ansehen, kopieren, speichern, JavaScript ausführen. */

const keys = {
  target: 'visustruct.codegen.target',
  javaMode: 'visustruct.codegen.javaOutputMode',
  comments: 'visustruct.codegen.includeDiagramComments',
  emptyElse: 'visustruct.codegen.includeEmptyElse',
}

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
    /* ohne Speicher: nur für diese Sitzung */
  }
}

const stopMessage = () => t('web_run_stopped_loop')
const cancelMessage = () => t('web_run_cancelled')
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Wie `javaScriptWithEndlessLoopGuard` in Swift: `while (true)` bricht nach 100 000 Durchläufen ab. */
export function javaScriptWithEndlessLoopGuard(js: string): string {
  let index = 0
  return js.replace(/^(\s*)while\s*\(\s*true\s*\)(?:\s*\/\*.*?\*\/)?\s*\{/gm, (_m, indent: string) => {
    const g = `__visuStructLoopGuard${index++}`
    return `${indent}for (let ${g} = 0; ${g} < 100000 || (() => { throw new Error(${JSON.stringify(stopMessage())}); })(); ${g}++) {`
  })
}

/** `prompt(…)` wird zu einer Eingabe im Fenster; dafür läuft der Code als `async`-Funktion. */
export function javaScriptRunnerCode(js: string): string {
  return javaScriptWithEndlessLoopGuard(js).replace(/\bprompt\s*\(/g, 'await __visuStructPrompt(')
}

/** Läuft im Worker: `console.log` und `prompt` gehen per Nachricht an die Seite. */
const workerSource = `
let answer
let lines = []
// Text von \`process.stdout.write\` ohne neue Zeile (wie \`System.out.print\`).
let partial = ''
const flush = (all) => {
  if (all && partial) {
    lines.push(partial)
    partial = ''
  }
  if (lines.length) postMessage({ type: 'log', lines })
  lines = []
}
const send = (type, text) => {
  flush(true)
  postMessage({ type, text })
}
const fmt = (a) => (typeof a === 'string' ? a : JSON.stringify(a))
// Ausgaben gesammelt senden, sonst bremsen viele kleine Nachrichten (z. B. in Endlosschleifen) die Seite aus.
console.log = (...args) => {
  lines.push(partial + args.map(fmt).join(' '))
  partial = ''
  if (lines.length >= 500) flush()
}
const process = { stdout: { write: (text) => {
  const parts = (partial + String(text)).split('\\n')
  partial = parts.pop()
  lines.push(...parts)
  if (lines.length >= 500) flush()
} } }
setInterval(flush, 50)
const __visuStructPrompt = (label) => new Promise((resolve, reject) => {
  answer = (value) => (value === null ? reject(new Error(${JSON.stringify(cancelMessage())})) : resolve(value))
  send('prompt', String(label ?? ''))
})
onmessage = async (e) => {
  if (e.data.type === 'answer') return answer && answer(e.data.value)
  try {
    const AsyncFunction = (async () => {}).constructor
    await new AsyncFunction('__visuStructPrompt', e.data.code)(__visuStructPrompt)
    send('done')
  } catch (err) {
    send('error', String(err))
  }
}
`

type RunnerMessage = { type: 'log' | 'prompt' | 'error' | 'done'; text?: string; lines?: string[] }

/** Höchstens so viele Zeilen anzeigen (Endlosschleifen erzeugen sonst riesige Ausgaben). */
const maxOutputLines = 2000

export class CodePanel {
  readonly element: HTMLElement
  private target: CodeTarget
  private javaMode: 'snippet' | 'class'
  private comments: boolean
  private emptyElse: boolean
  private code = ''

  private codeView!: HTMLElement
  private javaModeRow!: HTMLElement
  private runButton!: HTMLButtonElement
  private saveButton!: HTMLButtonElement
  private copyButton!: HTMLButtonElement
  private runner!: HTMLElement
  private runOutput!: HTMLElement
  private runInput!: HTMLFormElement
  private pseudocodeBox!: HTMLInputElement
  private pseudocodeHint!: HTMLElement
  private worker?: Worker
  private outputLines: string[] = []
  private droppedLines = 0
  private outputFrame?: number

  constructor(
    private currentDocument: () => VSDocument,
    private saveFile: (filename: string, text: string) => void,
    private onClose: () => void,
    private setPseudocode: (on: boolean) => void,
    /** Unterprogramme aus den anderen Reitern, die in den Code gehören. */
    private subprograms: () => VSDocument[] = () => [],
  ) {
    const t = stored(keys.target)
    this.target = t === 'python' || t === 'javascript' ? t : 'java'
    this.javaMode = stored(keys.javaMode) === 'class' ? 'class' : 'snippet'
    this.comments = stored(keys.comments) === 'true'
    this.emptyElse = stored(keys.emptyElse) !== 'false'
    this.element = document.createElement('aside')
    this.element.className = 'codepanel'
    this.build()
  }

  /** Neu erzeugen, z. B. nach jeder Änderung am Diagramm. */
  refresh() {
    const doc = this.currentDocument()
    const options = this.options()
    this.code =
      this.target === 'java' && this.javaMode === 'class'
        ? generateJavaClassFile(doc, this.classStem(), options, this.subprograms())
        : generateCode(doc, this.target, options, this.subprograms())
    this.codeView.textContent = this.code
    this.javaModeRow.hidden = this.target !== 'java'
    this.saveButton.hidden = this.target !== 'java'
    // Pseudocode ist kein Programm: nicht ausführen.
    this.runButton.hidden = this.target !== 'javascript' || !!doc.pseudocode
    if (this.runButton.hidden) this.stopRun(true)
    this.pseudocodeBox.checked = !!doc.pseudocode
    this.pseudocodeHint.hidden = !doc.pseudocode
    for (const b of this.element.querySelectorAll<HTMLButtonElement>('[data-target]')) {
      b.setAttribute('aria-pressed', String(b.dataset.target === this.target))
    }
    for (const b of this.element.querySelectorAll<HTMLButtonElement>('[data-java-mode]')) {
      b.setAttribute('aria-pressed', String(b.dataset.javaMode === this.javaMode))
    }
  }

  close() {
    this.stopRun(true)
  }

  private options() {
    return {
      includeDiagramTextAsComments: this.comments,
      includeEmptyElseBranch: this.emptyElse,
      pseudocodeNote: t('codegen_pseudocode_note'),
    }
  }

  private classStem(): string {
    return subprogramName(this.currentDocument().caption) || 'Main'
  }

  private build() {
    this.element.innerHTML = `
      <div class="code-head">
        <h2>${esc(t('codegen_placeholder_title'))}</h2>
        <button class="code-close" title="${esc(t('menu_close'))}" aria-label="${esc(t('menu_close'))}">✕</button>
      </div>
      <div class="segmented" role="group" aria-label="${esc(t('web_codegen_language'))}">
        <button data-target="java">Java</button><button data-target="python">Python</button><button data-target="javascript">JavaScript</button>
      </div>
      <div class="segmented java-mode" role="group" aria-label="${esc(t('codegen_java_output_mode'))}">
        <button data-java-mode="snippet">${esc(t('codegen_java_output_snippet'))}</button><button data-java-mode="class">${esc(t('codegen_java_output_class'))}</button>
      </div>
      <label class="check"><input type="checkbox" data-opt="comments" /> ${esc(t('web_codegen_comments'))}</label>
      <label class="check"><input type="checkbox" data-opt="emptyElse" /> ${esc(t('web_codegen_empty_else'))}</label>
      <label class="check"><input type="checkbox" data-opt="pseudocode" /> ${esc(t('codegen_pseudocode_toggle'))}</label>
      <p class="hint pseudocode-hint" hidden>${esc(t('codegen_pseudocode_hint'))}</p>
      <div class="code-actions">
        <button data-act="copy">${esc(t('codegen_copy'))}</button>
        <button data-act="save">${esc(t('codegen_save_java'))}</button>
        <button data-act="run" class="primary">${esc(t('codegen_run_in_browser'))}</button>
      </div>
      <pre class="code-view" tabindex="0" dir="ltr"></pre>
      <div class="runner" hidden>
        <div class="runner-head"><h2>${esc(t('simulation_output'))}</h2><button data-act="stop">${esc(t('simulation_stop'))}</button></div>
        <pre class="runner-out" dir="ltr"></pre>
        <form class="runner-input" hidden>
          <label></label>
          <div class="sim-input-row"><input autocomplete="off" /><button type="submit">${esc(t('simulation_input_submit'))}</button><button type="button" data-act="cancel">${esc(t('close_unsaved_cancel'))}</button></div>
        </form>
      </div>
      <p class="hint">${esc(t('codegen_generated_hint'))}</p>
    `
    const q = <T extends Element>(s: string) => this.element.querySelector(s) as T
    this.codeView = q('.code-view')
    this.javaModeRow = q('.java-mode')
    this.runButton = q('[data-act=run]')
    this.saveButton = q('[data-act=save]')
    this.copyButton = q('[data-act=copy]')
    this.runner = q('.runner')
    this.runOutput = q('.runner-out')
    this.runInput = q('.runner-input')
    this.pseudocodeBox = q('[data-opt=pseudocode]')
    this.pseudocodeHint = q('.pseudocode-hint')
    this.pseudocodeBox.addEventListener('change', () => this.setPseudocode(this.pseudocodeBox.checked))

    q('.code-close').addEventListener('click', () => this.onClose())
    for (const b of this.element.querySelectorAll<HTMLButtonElement>('[data-target]')) {
      b.addEventListener('click', () => {
        this.target = b.dataset.target as CodeTarget
        store(keys.target, this.target)
        this.refresh()
      })
    }
    for (const b of this.element.querySelectorAll<HTMLButtonElement>('[data-java-mode]')) {
      b.addEventListener('click', () => {
        this.javaMode = b.dataset.javaMode as 'snippet' | 'class'
        store(keys.javaMode, this.javaMode)
        this.refresh()
      })
    }
    const comments = q<HTMLInputElement>('[data-opt=comments]')
    comments.checked = this.comments
    comments.addEventListener('change', () => {
      this.comments = comments.checked
      store(keys.comments, String(this.comments))
      this.refresh()
    })
    const emptyElse = q<HTMLInputElement>('[data-opt=emptyElse]')
    emptyElse.checked = this.emptyElse
    emptyElse.addEventListener('change', () => {
      this.emptyElse = emptyElse.checked
      store(keys.emptyElse, String(this.emptyElse))
      this.refresh()
    })

    this.copyButton.addEventListener('click', () => this.copy())
    this.saveButton.addEventListener('click', () => {
      // Die Klasse muss so heißen wie die Datei; deshalb immer die vollständige Klasse speichern.
      const className = sanitizedJavaClassName(this.classStem())
      const source = generateJavaClassFile(this.currentDocument(), this.classStem(), this.options())
      this.saveFile(`${className}.java`, source)
    })
    this.runButton.addEventListener('click', () => this.run())
    q('[data-act=stop]').addEventListener('click', () => this.stopRun(false))
    q('[data-act=cancel]').addEventListener('click', () => this.answer(null))
    this.runInput.addEventListener('submit', (e) => {
      e.preventDefault()
      this.answer(this.runInput.querySelector('input')!.value)
    })
  }

  private async copy() {
    let ok = false
    try {
      await navigator.clipboard.writeText(this.code)
      ok = true
    } catch {
      // Ohne Zwischenablage-Recht: Code markieren, damit Strg+C reicht.
      const range = document.createRange()
      range.selectNodeContents(this.codeView)
      const sel = getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
      ok = document.execCommand?.('copy') ?? false
    }
    this.copyButton.textContent = t(ok ? 'web_copied_check' : 'web_copy_manual')
    setTimeout(() => (this.copyButton.textContent = t('codegen_copy')), 2000)
  }

  // MARK: - JavaScript ausführen

  private run() {
    this.stopRun(true)
    this.runner.hidden = false
    this.runOutput.textContent = ''
    this.outputLines = []
    this.droppedLines = 0
    this.runOutput.classList.remove('error')
    const code = javaScriptRunnerCode(this.code)
    const onMessage = (m: RunnerMessage) => this.onRunnerMessage(m)
    try {
      const url = URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' }))
      const worker = new Worker(url)
      URL.revokeObjectURL(url)
      worker.onmessage = (e) => onMessage(e.data as RunnerMessage)
      worker.onerror = (e) => {
        e.preventDefault()
        onMessage({ type: 'error', text: e.message || t('web_run_error') })
      }
      worker.postMessage({ type: 'run', code })
      this.worker = worker
    } catch {
      this.runInPage(code, onMessage)
    }
    this.setRunning(true)
  }

  /** Falls Worker gesperrt sind: im Fenster selbst ausführen (Endlosschleifen-Schutz wie in der App). */
  private runInPage(code: string, onMessage: (m: RunnerMessage) => void) {
    const fakeConsole = {
      log: (...args: unknown[]) =>
        onMessage({ type: 'log', lines: [args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')] }),
    }
    const prompt = (label: string) =>
      new Promise<string>((resolve, reject) => {
        this.pendingAnswer = (v) => (v === null ? reject(new Error(cancelMessage())) : resolve(v))
        onMessage({ type: 'prompt', text: label })
      })
    const AsyncFunction = (async () => {}).constructor as new (...args: string[]) => (...a: unknown[]) => Promise<void>
    new AsyncFunction('__visuStructPrompt', 'console', code)(prompt, fakeConsole)
      .then(() => onMessage({ type: 'done' }))
      .catch((err: unknown) => onMessage({ type: 'error', text: String(err) }))
  }

  private pendingAnswer?: (value: string | null) => void

  private onRunnerMessage(m: RunnerMessage) {
    switch (m.type) {
      case 'log':
        this.appendOutput(m.lines ?? [])
        break
      case 'prompt': {
        this.runInput.hidden = false
        this.runInput.querySelector('label')!.textContent = m.text ?? ''
        const field = this.runInput.querySelector('input')!
        field.value = ''
        field.focus()
        break
      }
      case 'error':
        this.appendOutput([m.text ?? ''])
        this.runOutput.classList.add('error')
        this.stopRun(false)
        break
      case 'done':
        this.stopRun(false)
        break
    }
  }

  private appendOutput(lines: string[]) {
    this.outputLines.push(...lines)
    if (this.outputLines.length > maxOutputLines) {
      this.droppedLines += this.outputLines.length - maxOutputLines
      this.outputLines.splice(0, this.outputLines.length - maxOutputLines)
    }
    if (this.outputFrame !== undefined) return
    this.outputFrame = requestAnimationFrame(() => {
      this.outputFrame = undefined
      const head = this.droppedLines > 0 ? t('web_run_dropped_fmt', this.droppedLines) + '\n' : ''
      this.runOutput.textContent = head + this.outputLines.join('\n') + (this.outputLines.length ? '\n' : '')
      this.runOutput.scrollTop = this.runOutput.scrollHeight
    })
  }

  private answer(value: string | null) {
    this.runInput.hidden = true
    if (this.worker) this.worker.postMessage({ type: 'answer', value })
    else this.pendingAnswer?.(value)
    this.pendingAnswer = undefined
  }

  private stopRun(hide: boolean) {
    this.worker?.terminate()
    this.worker = undefined
    this.pendingAnswer = undefined
    if (this.runInput) this.runInput.hidden = true
    if (hide && this.runner) this.runner.hidden = true
    this.setRunning(false)
  }

  private setRunning(running: boolean) {
    const stop = this.element.querySelector<HTMLButtonElement>('[data-act=stop]')
    if (stop) stop.disabled = !running
  }
}
