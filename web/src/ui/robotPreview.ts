import type { VSDocument } from '../core/model'
import { previewRun, type PreviewFrame, type PreviewResult } from '../core/robotPreview'
import { emptyWorld, type RobotWorldSetup } from '../core/robotWorld'
import type { SubprogramResolver } from '../core/simulation'
import { t } from './i18n'
import { icons } from './icons'
import { sidebarIcon } from './learnPanel'
import type { Robot3D } from './robot3d'
import { noticeText } from './simulationPanel'
import { playTone } from './visubotView'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Zeit je Bild beim Abspielen. */
const frameMs = 300

/**
 * VisuBot: „mBot2 live“ neben dem Bearbeiten. Nach jeder Änderung rechnet es das Programm im Hintergrund durch
 * und zeigt, wo der mBot2 am Ende steht und welche Spur er fährt; ▶ spielt die Fahrt ab.
 * Steht als eigene Spalte oder unter dem Code in „Code“ (`stacked`).
 */
export class RobotPreviewPanel {
  readonly element: HTMLElement
  /** Eingeklappt: schmale Leiste am rechten Rand. */
  readonly rail: HTMLButtonElement
  /** Waagrechte Trennlinie über dem Fenster, wenn es unter dem Code steht. */
  readonly heightBar: HTMLElement
  onHide = () => {}
  onToggleStacked = () => {}
  private stage: HTMLElement
  private status: HTMLElement
  private picker: HTMLElement
  private playButton: HTMLButtonElement
  private stackButton: HTMLButtonElement
  private view?: Robot3D
  private loading?: Promise<void>
  private worlds: RobotWorldSetup[] = []
  private worldsKey?: string
  private setup: RobotWorldSetup = emptyWorld
  private result?: PreviewResult
  private lastKey?: string
  private pending?: number
  private playTimer?: number
  private input?: { doc: VSDocument; resolve?: SubprogramResolver }
  /** Während der Simulation: deren 3D-Ansicht mit Welten und Messwerten statt der eigenen. */
  private simulation?: HTMLElement

  constructor() {
    this.element = document.createElement('aside')
    this.element.className = 'robotpreview'
    this.element.innerHTML = `
      <div class="robotpreview-height" role="separator" aria-orientation="horizontal" tabindex="0" title="${esc(t('web_visubot_preview_resize'))}"></div>
      <div class="livecode-head">
        <h2>🤖 ${esc(t('web_visubot_preview_title'))}</h2>
        <button class="icon primary robotpreview-play" data-tip="${esc(t('web_visubot_preview_play'))}" aria-label="${esc(t('web_visubot_preview_play'))}">${icons.play}</button>
        <button class="robotpreview-stack"></button>
        <button class="learn-hide" title="${esc(t('web_visubot_preview_hide'))}" aria-label="${esc(t('web_visubot_preview_hide'))}">${sidebarIcon}</button>
      </div>
      <p class="hint">${esc(t('web_visubot_preview_hint'))}</p>
      <div class="visubot-worlds" hidden></div>
      <div class="visubot-stage robotpreview-stage"></div>
      <p class="visubot-status robotpreview-status" role="status"></p>`
    const q = <T extends Element>(s: string) => this.element.querySelector(s) as T
    this.heightBar = q('.robotpreview-height')
    this.stage = q('.robotpreview-stage')
    this.status = q('.robotpreview-status')
    this.picker = q('.visubot-worlds')
    this.playButton = q('.robotpreview-play')
    this.stackButton = q('.robotpreview-stack')
    this.playButton.addEventListener('click', () => (this.playTimer === undefined ? this.play() : this.stopPlaying(true)))
    this.stackButton.addEventListener('click', () => this.onToggleStacked())
    q('.learn-hide').addEventListener('click', () => this.onHide())
    this.rail = document.createElement('button')
    this.rail.className = 'learn-rail robotpreview-rail'
    this.setStacked(false)
    this.relabel()
  }

  /**
   * Simulation läuft: ihre 3D-Ansicht (`viewport` aus dem Simulationspanel) hier zeigen, die eigene Vorschau ruht.
   * `undefined`: wieder die Vorschau (die Ansicht der Simulation hängt der Aufrufer zurück).
   */
  hostSimulation(viewport: HTMLElement | undefined) {
    if (viewport === this.simulation) return
    this.simulation?.remove()
    this.simulation = viewport
    this.element.classList.toggle('simulation', !!viewport)
    if (viewport) {
      this.pause()
      this.status.after(viewport)
    }
    this.relabel()
  }

  /** Nach einem Sprachwechsel: Beschriftungen neu. */
  relabel() {
    const q = <T extends Element>(s: string) => this.element.querySelector(s) as T
    const sim = !!this.simulation
    q('h2').textContent = `🤖 ${t(sim ? 'web_visubot_preview_sim_title' : 'web_visubot_preview_title')}`
    q('.hint').textContent = t(sim ? 'web_visubot_preview_sim_hint' : 'web_visubot_preview_hint')
    this.heightBar.title = t('web_visubot_preview_resize')
    const hide = q<HTMLButtonElement>('.learn-hide')
    hide.title = t('web_visubot_preview_hide')
    hide.setAttribute('aria-label', t('web_visubot_preview_hide'))
    this.rail.title = t('web_visubot_preview_show')
    this.rail.innerHTML = `${sidebarIcon}<span>🤖 ${esc(t('web_visubot_preview_title'))}</span>`
    this.setStacked(this.stackButton.textContent === '▥')
    this.stopPlaying(false)
    this.worldsKey = undefined
    this.lastKey = undefined
  }

  /** Beschriftung des Knopfs zum Umstellen: unter den Code bzw. wieder als eigene Spalte. */
  setStacked(stacked: boolean) {
    const key = stacked ? 'web_visubot_preview_side' : 'web_visubot_preview_stack'
    this.stackButton.innerHTML = stacked ? '▥' : '⬓'
    this.stackButton.className = 'icon robotpreview-stack'
    this.stackButton.dataset.tip = t(key)
    this.stackButton.setAttribute('aria-label', t(key))
  }

  /** 3D-Ansicht erst bauen, wenn das Fenster sichtbar ist. */
  private show() {
    this.loading ??= import('./robot3d')
      .then(({ Robot3D }) => {
        this.view = new Robot3D(this.stage)
        this.view.setWorld(this.setup)
        this.showFrame(this.result?.frames.at(-1))
      })
      .catch(() => {
        this.stage.textContent = t('web_visubot_no_3d')
      })
  }

  /**
   * Nach einer Änderung (nur wenn das Fenster offen ist): Programm neu durchrechnen, kurz verzögert,
   * damit schnelles Tippen nicht bremst. `worlds`: Welten der geöffneten Übung (leer = freie Fläche).
   */
  update(doc: VSDocument, resolve: SubprogramResolver | undefined, worlds: RobotWorldSetup[], worldsKey: string, allDocs: VSDocument[]) {
    if (this.simulation) return
    this.show()
    if (worldsKey !== this.worldsKey) {
      this.worldsKey = worldsKey
      this.setWorlds(worlds)
    }
    this.input = { doc, resolve }
    const key = JSON.stringify(allDocs) + '\n' + JSON.stringify(doc)
    if (key === this.lastKey) return
    this.lastKey = key
    window.clearTimeout(this.pending)
    this.pending = window.setTimeout(() => this.recompute(), 120)
  }

  private setWorlds(worlds: RobotWorldSetup[]) {
    this.worlds = worlds
    this.picker.replaceChildren()
    this.picker.hidden = worlds.length < 2
    worlds.forEach((setup, i) => {
      const b = document.createElement('button')
      b.textContent = t('web_visubot_world_fmt', i + 1)
      b.addEventListener('click', () => this.useWorld(setup))
      this.picker.append(b)
    })
    this.useWorld(worlds[0] ?? emptyWorld)
  }

  private useWorld(setup: RobotWorldSetup) {
    this.worlds.forEach((w, i) => this.picker.children[i]?.classList.toggle('active', w === setup))
    if (setup === this.setup && this.result) return
    this.setup = setup
    this.view?.setWorld(setup)
    this.recompute()
  }

  private recompute() {
    this.pending = undefined
    this.stopPlaying(false)
    if (!this.input) return
    try {
      this.result = previewRun(this.input.doc, this.input.resolve, this.setup)
    } catch {
      this.result = undefined
    }
    this.showFrame(this.result?.frames.at(-1))
    this.updateStatus()
  }

  private showFrame(frame: PreviewFrame | undefined, ms = 0) {
    if (!this.view) return
    const f = frame ?? { pose: { ...this.setup.start }, trail: [{ x: this.setup.start.x, y: this.setup.start.y }], leds: Array<undefined>(5).fill(undefined), screen: undefined }
    if (ms > 0) this.view.moveTo(f.pose, f.trail, ms)
    else this.view.place(f.pose, f.trail)
    this.view.setLeds(f.leds)
    this.view.setScreen(f.screen)
  }

  /** ▶: die Fahrt Bild für Bild vom Start an zeigen. */
  play() {
    const frames = this.result?.frames
    if (!frames || frames.length < 2 || !this.view) return
    this.stopPlaying(false)
    let i = 0
    this.showFrame(frames[0])
    this.playButton.innerHTML = icons.stop
    this.playButton.dataset.tip = t('web_visubot_preview_stop')
    this.playButton.setAttribute('aria-label', t('web_visubot_preview_stop'))
    const next = () => {
      i++
      if (i >= frames.length) {
        this.stopPlaying(false)
        return
      }
      const f = frames[i]
      if (f.tone) playTone(f.tone[0], f.tone[1])
      this.showFrame(f, frameMs - 30)
      this.playTimer = window.setTimeout(next, frameMs)
    }
    this.playTimer = window.setTimeout(next, frameMs)
  }

  /** Abspielen beenden; `showEnd`: gleich das Ende der Fahrt zeigen. */
  private stopPlaying(showEnd: boolean) {
    if (this.playTimer !== undefined) window.clearTimeout(this.playTimer)
    this.playTimer = undefined
    this.playButton.innerHTML = icons.play
    this.playButton.dataset.tip = t('web_visubot_preview_play')
    this.playButton.setAttribute('aria-label', t('web_visubot_preview_play'))
    if (showEnd) this.showFrame(this.result?.frames.at(-1))
  }

  private updateStatus() {
    const r = this.result
    this.playButton.disabled = !r || r.frames.length < 2
    if (!r) {
      this.status.textContent = ''
      return
    }
    const parts = [t('web_visubot_preview_distance_fmt', r.distance)]
    if (r.bumps > 0) parts.push(`⚠︎ ${t('web_visubot_bumps')}: ${r.bumps}`)
    if (r.stop === 'input') parts.push(t('web_visubot_preview_input'))
    else if (r.stop === 'limit') parts.push(t('web_visubot_preview_limit'))
    else if (r.stop === 'error' && r.notice) parts.push(`⚠︎ ${noticeText(r.notice)}`)
    this.status.textContent = parts.join(' · ')
  }

  /** Beim Schließen: Abspielen und Rechnen anhalten. */
  pause() {
    window.clearTimeout(this.pending)
    this.pending = undefined
    this.lastKey = undefined
    this.stopPlaying(false)
  }
}
