import type { VSDocument } from '../core/model'
import { describeValue, SimulationEngine, type SimNotice, type SimValue, type SubprogramResolver } from '../core/simulation'
import { currentLanguage, t } from './i18n'
import { writtenFilesView } from './textFileView'
import type { VisuBotView } from './visubotView'

/** Was eine Konsole zeigen würde: Ausgaben, Eingaben mit Antwort, offene Frage, Ende oder Fehler. */
export interface ConsoleTranscript {
  lines: { text: string; typed?: string }[]
  /** Frage einer Eingabe, auf die die Simulation gerade wartet. */
  pending?: string
  notice?: string
  error: boolean
}

/** `sim_notice_*` aus Localizable.strings. */
export function noticeText(n: SimNotice): string {
  switch (n.kind) {
    case 'finished': return t('sim_notice_finished')
    case 'infiniteLoopWithoutBody': return t('sim_notice_infinite_loop_empty')
    case 'unsupportedStatement': return t('sim_notice_unsupported_statement_fmt', n.text)
    case 'invalidExpression': return t('sim_notice_invalid_expression_fmt', n.text)
    case 'unknownVariable': return t('sim_notice_unknown_variable_fmt', n.text)
    case 'divisionByZero': return t('sim_notice_division_by_zero')
    case 'wholeNumberExpected': return t('sim_notice_whole_number_expected')
    case 'numberExpected': return t('sim_notice_number_expected')
    case 'booleanExpected': return t('sim_notice_boolean_expected')
    case 'subprogramNotFound': return t('sim_notice_subprogram_not_found_fmt', n.text)
    case 'callTooDeep': return t('sim_notice_call_too_deep')
    case 'callArguments': return t('web_sim_call_arguments_fmt', n.text)
    case 'missingReturn': return t('web_sim_missing_return_fmt', n.text)
    case 'fileNotFound': return t('web_sim_file_not_found_fmt', n.text)
    case 'endOfFile': return t('web_sim_end_of_file_fmt', n.text)
    case 'nullValue': return t('web_sim_null_value_fmt', n.text)
    case 'other': return n.text
  }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Port von `SimulationController.swift` und `SimulationPanels.swift`: Steuerung, Eingabe, Variablen, Ausgabe. */

type HighlightMode = 'lastExecuted' | 'nextToExecute'

const delayOptions = ['0.2', '0.5', '1.0', '1.5', '2.0']
const decimal = (d: string) => Number(d).toLocaleString(currentLanguage() === 'java' ? 'en' : currentLanguage(), { minimumFractionDigits: 1 })
const delayKey = 'visustruct.simulation.stepDelay'
const highlightKey = 'visustruct.simulation.highlightMode'

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

export class SimulationPanel {
  readonly element: HTMLElement
  private engine: SimulationEngine
  private isPlaying = false
  private playTimer?: number
  private wasPlayingBeforeInput = false
  private delay = delayOptions.includes(stored(delayKey) ?? '') ? stored(delayKey)! : '0.5'
  private highlightMode: HighlightMode = stored(highlightKey) === 'nextToExecute' ? 'nextToExecute' : 'lastExecuted'

  private buttons!: Record<'play' | 'pause' | 'step' | 'stop', HTMLButtonElement>
  private inputSection!: HTMLElement
  private trace!: HTMLElement
  private variables!: HTMLElement
  private output!: HTMLElement
  private transcript: ConsoleTranscript['lines'] = []
  private printed = 0
  private notice!: HTMLElement
  private editButton!: HTMLButtonElement
  /** VisuBot: Roboter-Welt, die bei jedem Schritt mitfährt. */
  private robot?: VisuBotView
  /** Echter mBot2 fährt gerade einen Schritt. */
  private liveBusy = false

  constructor(
    private currentDocument: () => VSDocument,
    /** Markierung des aktuellen Schritts im Diagramm. */
    private onHighlight: (path: number[] | undefined) => void,
    /** Diagramm zu einem Aufruf-Kasten, z. B. ein anderer offener Reiter. */
    private findSubprogram: SubprogramResolver = () => undefined,
    /** Simulation beenden und weiter bearbeiten. */
    private onEdit: () => void = () => {},
    /** Konsole in Code live: zeigt dieselben Ausgaben und Eingaben wie beim Ausführen. */
    private onTranscript: (transcript: ConsoleTranscript) => void = () => {},
  ) {
    this.engine = new SimulationEngine(currentDocument(), findSubprogram)
    this.element = document.createElement('aside')
    this.element.className = 'simpanel'
    this.build()
  }

  // MARK: - Modus

  /** VisuBot ein- oder ausschalten: die Welt steht unter der Steuerung. */
  setRobot(robot: VisuBotView | undefined) {
    if (this.robot === robot) return
    this.robot?.element.remove()
    this.robot = robot
    if (robot) {
      this.element.querySelector('section')!.after(robot.element)
      robot.onWorldChange = () => this.restartEngine()
      robot.reset()
    }
  }

  /** Beim Öffnen der Simulation sichtbar: erst dann wird die 3D-Ansicht gebaut. */
  showRobot() {
    this.robot?.show()
  }

  begin() {
    this.pause()
    this.restartEngine()
    this.showRobot()
  }

  end() {
    this.pause()
  }

  // MARK: - Steuerung

  step() {
    if (this.robot?.live) {
      void this.stepLive()
      return
    }
    if (!this.engine.canStep) {
      this.pause()
      return
    }
    const wasPlaying = this.isPlaying
    const lastExecutedPath = this.engine.currentStepPath
    this.robot?.prepare(this.engine)
    this.engine.step()
    this.robot?.follow(this.engine.state.robotActions, wasPlaying ? Number(this.delay) * 850 : 450)
    this.afterStep(wasPlaying, lastExecutedPath)
  }

  /** Echter mBot2: Sensoren lesen, Schritt ausführen, warten bis er fertig gefahren ist. */
  private async stepLive() {
    if (this.liveBusy) return
    if (!this.engine.canStep) {
      this.pause()
      return
    }
    this.liveBusy = true
    const robot = this.robot!
    const wasPlaying = this.isPlaying
    const lastExecutedPath = this.engine.currentStepPath
    try {
      await robot.prepareLive(this.engine)
      this.engine.step()
      robot.follow(this.engine.state.robotActions, 450)
      await robot.drive(this.engine.state.robotActions)
    } catch (e) {
      robot.liveFailed(e)
      this.isPlaying = false
    } finally {
      this.liveBusy = false
    }
    this.afterStep(wasPlaying, lastExecutedPath)
  }

  private afterStep(wasPlaying: boolean, lastExecutedPath: number[] | undefined) {
    this.collectOutput()
    if (this.highlightMode === 'nextToExecute' && this.engine.canStep) {
      this.onHighlight(this.engine.currentStepPath)
    } else {
      // Letztes ausgeführtes Element bleibt markiert (auch am Ende oder bei einer Eingabe).
      this.onHighlight(lastExecutedPath ?? this.engine.currentStepPath)
    }
    // Eingabe angefordert: Abspielen pausieren, nach OK automatisch weiterlaufen.
    if (this.engine.state.inputRequest && wasPlaying) this.wasPlayingBeforeInput = true
    if (!this.engine.canStep) this.pause()
    this.update()
  }

  reset() {
    this.pause()
    this.restartEngine()
  }

  play() {
    if (this.isPlaying || !this.engine.canStep) return
    this.isPlaying = true
    const tick = async () => {
      this.playTimer = undefined
      if (!this.isPlaying) return
      if (this.robot?.live) await this.stepLive()
      else this.step()
      if (this.isPlaying && this.engine.canStep) {
        this.playTimer = window.setTimeout(() => void tick(), Number(this.delay) * 1000)
      } else {
        this.isPlaying = false
        this.update()
      }
    }
    void tick()
  }

  pause() {
    if (this.playTimer !== undefined) window.clearTimeout(this.playTimer)
    this.playTimer = undefined
    this.isPlaying = false
    this.update()
  }

  private submitInput(field: HTMLInputElement) {
    const shouldResume = this.isPlaying || this.wasPlayingBeforeInput
    this.pause()
    const prompt = this.engine.state.inputRequest?.prompt ?? ''
    this.engine.provideInput(field.value)
    if (!this.engine.state.inputRequest) {
      this.transcript.push({ text: prompt ? `${prompt} ` : '', typed: field.value })
      field.value = ''
    }
    this.onHighlight(this.engine.currentStepPath)
    if (shouldResume && this.engine.canStep) {
      this.wasPlayingBeforeInput = false
      this.play()
    }
    this.update()
  }

  private restartEngine() {
    this.engine = new SimulationEngine(this.currentDocument(), this.findSubprogram)
    this.transcript = []
    this.printed = 0
    this.wasPlayingBeforeInput = false
    this.robot?.reset()
    this.onHighlight(this.engine.currentStepPath)
    this.update()
  }

  // MARK: - Ansicht

  private build() {
    this.element.innerHTML = `
      <section>
        <h2>${esc(t('simulation_controls'))}</h2>
        <div class="sim-buttons">
          <button data-sim="play">▶︎ ${esc(t('simulation_play'))}</button>
          <button data-sim="pause">⏸︎ ${esc(t('simulation_pause'))}</button>
          <button data-sim="step">→ ${esc(t('simulation_step'))}</button>
          <button data-sim="stop">■ ${esc(t('simulation_stop'))}</button>
        </div>
        <label class="sim-option">${esc(t('simulation_highlight_label'))}
          <select data-sim="highlight">
            <option value="lastExecuted">${esc(t('simulation_highlight_last'))}</option>
            <option value="nextToExecute">${esc(t('simulation_highlight_next'))}</option>
          </select>
        </label>
        <label class="sim-option">${esc(t('web_sim_delay'))}
          <select data-sim="delay">${delayOptions.map((d) => `<option value="${d}">${esc(t('web_sim_delay_value_fmt', decimal(d)))}</option>`).join('')}</select>
        </label>
      </section>
      <p class="sim-notice" role="status"></p>
      <button class="sim-edit primary" title="${esc(t('web_simulation_end_title'))}" hidden>${esc(t('web_simulation_end'))}</button>
      <section class="sim-input"><h2>${esc(t('simulation_input'))}</h2><div></div></section>
      <section><h2>${esc(t('simulation_trace'))}</h2><div class="sim-trace mono" dir="ltr"></div></section>
      <section><h2>${esc(t('simulation_variables'))}</h2><div class="sim-vars" dir="ltr"></div></section>
      <section><h2>${esc(t('simulation_output'))}</h2><div class="sim-output mono" dir="ltr"></div></section>
    `
    const q = <T extends Element>(s: string) => this.element.querySelector(s) as T
    this.buttons = {
      play: q('[data-sim=play]'),
      pause: q('[data-sim=pause]'),
      step: q('[data-sim=step]'),
      stop: q('[data-sim=stop]'),
    }
    this.buttons.play.addEventListener('click', () => this.play())
    this.buttons.pause.addEventListener('click', () => this.pause())
    this.buttons.step.addEventListener('click', () => this.step())
    this.buttons.stop.addEventListener('click', () => this.reset())
    this.editButton = q('.sim-edit')
    this.editButton.addEventListener('click', () => this.onEdit())

    const highlight = q<HTMLSelectElement>('[data-sim=highlight]')
    highlight.value = this.highlightMode
    highlight.addEventListener('change', () => {
      this.highlightMode = highlight.value as HighlightMode
      store(highlightKey, this.highlightMode)
    })
    const delay = q<HTMLSelectElement>('[data-sim=delay]')
    delay.value = this.delay
    delay.addEventListener('change', () => {
      this.delay = delay.value
      store(delayKey, this.delay)
    })

    this.inputSection = q('.sim-input > div')
    this.trace = q('.sim-trace')
    this.variables = q('.sim-vars')
    this.output = q('.sim-output')
    this.notice = q('.sim-notice')
  }

  private collectOutput() {
    const lines = this.engine.state.outputLines
    for (; this.printed < lines.length; this.printed++) this.transcript.push({ text: lines[this.printed] })
  }

  private update() {
    if (!this.buttons) return
    const { state, canStep } = this.engine
    this.onTranscript({
      lines: this.transcript,
      pending: state.inputRequest?.prompt,
      notice: state.notice ? noticeText(state.notice) : undefined,
      error: state.isHalted,
    })
    this.buttons.play.disabled = this.isPlaying || !canStep
    this.buttons.pause.disabled = !this.isPlaying
    this.buttons.step.disabled = this.isPlaying || !canStep

    this.notice.textContent = state.notice ? noticeText(state.notice) : ''
    this.notice.hidden = !state.notice
    this.notice.classList.toggle('error', state.isHalted)
    // Nach einem Fehler geht es nur mit Bearbeiten weiter; der Knopf steht direkt unter der Meldung.
    this.editButton.hidden = !state.isHalted

    this.updateInput()

    this.trace.textContent = state.lastTrace ?? t('simulation_trace_placeholder')
    this.trace.classList.toggle('placeholder', !state.lastTrace)

    const names = [...state.variables.keys()].sort((a, b) => a.localeCompare(b))
    if (names.length === 0) {
      this.variables.innerHTML = `<p class="placeholder">${esc(t('simulation_variables_placeholder'))}</p>`
    } else {
      const table = document.createElement('table')
      for (const name of names) {
        const row = table.insertRow()
        row.insertCell().textContent = name
        const value = state.variables.get(name)!
        const cell = row.insertCell()
        // 2D-Array wie eine Tabelle: jede Zeile in einer eigenen Zeile
        if (value.kind === 'grid') {
          cell.append(gridTable(value))
        } else {
          cell.textContent = describeValue(value)
        }
      }
      this.variables.replaceChildren(table)
    }

    if (state.outputLines.length === 0 && state.files.size === 0) {
      this.output.innerHTML = `<p class="placeholder">${esc(t('simulation_output_placeholder'))}</p>`
    } else {
      this.output.replaceChildren(
        ...state.outputLines.map((line) => {
          const div = document.createElement('div')
          div.textContent = line
          return div
        }),
        ...writtenFilesView(state.files),
      )
      this.output.scrollTop = this.output.scrollHeight
    }
  }

  private updateInput() {
    const request = this.engine.state.inputRequest
    const host = this.inputSection
    host.parentElement!.classList.toggle('active', !!request)
    if (!request) {
      host.innerHTML = `<p class="placeholder">${esc(t('simulation_input_placeholder'))}</p>`
      return
    }
    // Feld behalten, damit Tippen und Fokus nicht verloren gehen.
    let form = host.querySelector('form')
    if (!form) {
      form = document.createElement('form')
      form.innerHTML = `<p class="sim-prompt"></p><div class="sim-input-row"><input autocomplete="off" /><button type="submit">${esc(t('simulation_input_submit'))}</button></div><p class="sim-input-error"></p>`
      const field = form.querySelector('input')!
      form.addEventListener('submit', (e) => {
        e.preventDefault()
        this.submitInput(field)
      })
      host.replaceChildren(form)
      requestAnimationFrame(() => field.focus())
    }
    form.querySelector('.sim-prompt')!.textContent = request.prompt
    const field = form.querySelector('input')!
    field.inputMode = request.valueType === 'string' || request.valueType === 'boolean' ? 'text' : 'decimal'
    const error = this.engine.state.inputErrorNotice
    const errorLine = form.querySelector<HTMLElement>('.sim-input-error')!
    errorLine.textContent = error ? noticeText(error) : ''
    errorLine.hidden = !error
  }
}

/** Ein 2D-Array als kleine Tabelle: eine Tabellenzeile pro Zeile des Arrays. */
export function gridTable(value: SimValue & { kind: 'grid' }): HTMLTableElement {
  const table = document.createElement('table')
  table.className = 'sim-grid'
  for (const row of value.value) {
    const tr = table.insertRow()
    for (const x of row) {
      const td = tr.insertCell()
      td.textContent = String(x)
      if (x === true) td.className = 'sim-grid-true'
    }
  }
  return table
}
