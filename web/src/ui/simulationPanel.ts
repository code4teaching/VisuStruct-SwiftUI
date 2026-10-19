import type { VSDocument } from '../core/model'
import { describeValue, noticeGerman, SimulationEngine } from '../core/simulation'

/** Port von `SimulationController.swift` und `SimulationPanels.swift`: Steuerung, Eingabe, Variablen, Ausgabe. */

type HighlightMode = 'lastExecuted' | 'nextToExecute'

const delayOptions = ['0.2', '0.5', '1.0', '1.5', '2.0']
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
  private notice!: HTMLElement

  constructor(
    private currentDocument: () => VSDocument,
    /** Markierung des aktuellen Schritts im Diagramm. */
    private onHighlight: (path: number[] | undefined) => void,
  ) {
    this.engine = new SimulationEngine(currentDocument())
    this.element = document.createElement('aside')
    this.element.className = 'simpanel'
    this.build()
  }

  // MARK: - Modus

  begin() {
    this.pause()
    this.restartEngine()
  }

  end() {
    this.pause()
  }

  // MARK: - Steuerung

  step() {
    if (!this.engine.canStep) {
      this.pause()
      return
    }
    const wasPlaying = this.isPlaying
    const lastExecutedPath = this.engine.currentStepPath
    this.engine.step()
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
    const tick = () => {
      this.playTimer = undefined
      if (!this.isPlaying) return
      this.step()
      if (this.isPlaying && this.engine.canStep) {
        this.playTimer = window.setTimeout(tick, Number(this.delay) * 1000)
      } else {
        this.isPlaying = false
        this.update()
      }
    }
    tick()
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
    this.engine.provideInput(field.value)
    if (!this.engine.state.inputRequest) field.value = ''
    this.onHighlight(this.engine.currentStepPath)
    if (shouldResume && this.engine.canStep) {
      this.wasPlayingBeforeInput = false
      this.play()
    }
    this.update()
  }

  private restartEngine() {
    this.engine = new SimulationEngine(this.currentDocument())
    this.wasPlayingBeforeInput = false
    this.onHighlight(this.engine.currentStepPath)
    this.update()
  }

  // MARK: - Ansicht

  private build() {
    this.element.innerHTML = `
      <section>
        <h2>Steuerung</h2>
        <div class="sim-buttons">
          <button data-sim="play">▶︎ Start</button>
          <button data-sim="pause">⏸︎ Pause</button>
          <button data-sim="step">→ Schritt</button>
          <button data-sim="stop">■ Stopp</button>
        </div>
        <label class="sim-option">Markierung
          <select data-sim="highlight">
            <option value="lastExecuted">Letzter Schritt</option>
            <option value="nextToExecute">Nächster Schritt</option>
          </select>
        </label>
        <label class="sim-option">Pause pro Schritt
          <select data-sim="delay">${delayOptions.map((d) => `<option value="${d}">${d.replace('.', ',')} s</option>`).join('')}</select>
        </label>
      </section>
      <p class="sim-notice" role="status"></p>
      <section class="sim-input"><h2>Eingabe</h2><div></div></section>
      <section><h2>Letzter Schritt</h2><div class="sim-trace mono"></div></section>
      <section><h2>Variablen</h2><div class="sim-vars"></div></section>
      <section><h2>Ausgabe</h2><div class="sim-output mono"></div></section>
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

  private update() {
    if (!this.buttons) return
    const { state, canStep } = this.engine
    this.buttons.play.disabled = this.isPlaying || !canStep
    this.buttons.pause.disabled = !this.isPlaying
    this.buttons.step.disabled = this.isPlaying || !canStep

    this.notice.textContent = state.notice ? noticeGerman(state.notice) : ''
    this.notice.hidden = !state.notice
    this.notice.classList.toggle('error', state.isHalted)

    this.updateInput()

    this.trace.textContent = state.lastTrace ?? 'Noch kein Schritt ausgeführt.'
    this.trace.classList.toggle('placeholder', !state.lastTrace)

    const names = [...state.variables.keys()].sort((a, b) => a.localeCompare(b))
    if (names.length === 0) {
      this.variables.innerHTML = '<p class="placeholder">Noch keine Variablen.</p>'
    } else {
      const table = document.createElement('table')
      for (const name of names) {
        const row = table.insertRow()
        row.insertCell().textContent = name
        row.insertCell().textContent = describeValue(state.variables.get(name)!)
      }
      this.variables.replaceChildren(table)
    }

    if (state.outputLines.length === 0) {
      this.output.innerHTML = '<p class="placeholder">Noch keine Ausgabe.</p>'
    } else {
      this.output.replaceChildren(
        ...state.outputLines.map((line) => {
          const div = document.createElement('div')
          div.textContent = line
          return div
        }),
      )
      this.output.scrollTop = this.output.scrollHeight
    }
  }

  private updateInput() {
    const request = this.engine.state.inputRequest
    const host = this.inputSection
    host.parentElement!.classList.toggle('active', !!request)
    if (!request) {
      host.innerHTML = '<p class="placeholder">Keine Eingabe erforderlich.</p>'
      return
    }
    // Feld behalten, damit Tippen und Fokus nicht verloren gehen.
    let form = host.querySelector('form')
    if (!form) {
      form = document.createElement('form')
      form.innerHTML = `<p class="sim-prompt"></p><div class="sim-input-row"><input autocomplete="off" /><button type="submit">OK</button></div><p class="sim-input-error"></p>`
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
    field.inputMode = request.valueType === 'string' ? 'text' : 'decimal'
    const error = this.engine.state.inputErrorNotice
    const errorLine = form.querySelector<HTMLElement>('.sim-input-error')!
    errorLine.textContent = error ? noticeGerman(error) : ''
    errorLine.hidden = !error
  }
}
