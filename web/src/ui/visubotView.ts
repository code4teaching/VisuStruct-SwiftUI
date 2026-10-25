import type { MBotAction } from '../core/mbot'
import { ElementType, makeElement, type VSElement } from '../core/model'
import { emptyWorld, RobotWorld, type RobotWorldSetup } from '../core/robotWorld'
import type { SimulationEngine } from '../core/simulation'
import { t } from './i18n'
import type { VisuBotMode } from '../learn/content'
import type { Robot3D } from './robot3d'

/**
 * VisuBot (mBot2-Modus), gespeichert im Browser: aus, im Kurs (normale Lektionen mit zusätzlichen mBot2-Schritten)
 * oder als eigene Reihe (nur die VisuBot-Lektionen, für Klassen, die den Kurs schon kennen).
 */
const modeKey = 'visustruct.visubot'
// '1' war früher der einzige Modus (eigene Reihe)
const stored: Record<VisuBotMode, string> = { off: '0', course: 'kurs', series: '1' }

export function visuBotMode(): VisuBotMode {
  try {
    const value = localStorage.getItem(modeKey)
    return (Object.keys(stored) as VisuBotMode[]).find((m) => stored[m] === value) ?? 'off'
  } catch {
    return 'off'
  }
}

export function setVisuBotMode(mode: VisuBotMode) {
  try {
    localStorage.setItem(modeKey, stored[mode])
  } catch {
    /* ohne Speicher nur für diese Sitzung */
  }
}

/** Gibt es mBot2-Kästen und den 3D-Simulator? (Im Kurs und in der eigenen Reihe.) */
export const visuBotEnabled = () => visuBotMode() !== 'off'

/**
 * Simulator-Bereich im Simulationspanel: Welt von oben/schräg in 3D, darunter Sensorwerte.
 * three.js wird erst geladen, wenn der Bereich das erste Mal gebraucht wird.
 */
export class VisuBotView {
  readonly element: HTMLElement
  world: RobotWorld
  private view?: Robot3D
  private loading?: Promise<void>
  private status: HTMLElement
  private stage: HTMLElement
  private picker: HTMLElement
  private applied = 0
  /** Nach dem Umschalten der Welt: Simulation von vorn (setzt das Simulationspanel). */
  onWorldChange?: () => void

  constructor(setup: RobotWorldSetup = emptyWorld) {
    this.world = new RobotWorld(setup)
    this.element = document.createElement('section')
    this.element.className = 'visubot'
    this.element.innerHTML = `<h2>${t('web_visubot_world')}</h2><div class="visubot-worlds" hidden></div><div class="visubot-stage"></div><p class="visubot-status mono" dir="ltr"></p>`
    this.stage = this.element.querySelector('.visubot-stage')!
    this.picker = this.element.querySelector('.visubot-worlds')!
    this.status = this.element.querySelector('.visubot-status')!
    this.updateStatus()
  }

  /** 3D-Ansicht aufbauen (beim ersten Einblenden). */
  show() {
    this.loading ??= import('./robot3d').then(({ Robot3D }) => {
      this.view = new Robot3D(this.stage)
      this.view.setWorld(this.world.setup)
      this.view.place(this.world.pose, this.world.trail)
      this.view.setLed(this.world.led)
    }).catch(() => {
      this.stage.textContent = t('web_visubot_no_3d')
    })
  }

  /**
   * Welten einer Übung (Labyrinth usw.): Knöpfe zum Umschalten über der Ansicht; leer = freie Fläche.
   * Programme laufen in der gewählten Welt.
   */
  setWorlds(worlds: RobotWorldSetup[]) {
    this.picker.replaceChildren()
    this.picker.hidden = worlds.length < 2
    worlds.forEach((setup, i) => {
      const b = document.createElement('button')
      b.textContent = t('web_visubot_world_fmt', i + 1)
      b.addEventListener('click', () => this.useWorld(setup, b))
      this.picker.append(b)
    })
    this.useWorld(worlds[0] ?? emptyWorld, this.picker.firstElementChild as HTMLElement | null)
  }

  private useWorld(setup: RobotWorldSetup, button: HTMLElement | null) {
    for (const b of this.picker.children) b.classList.toggle('active', b === button)
    if (setup === this.world.setup) return
    this.world = new RobotWorld(setup)
    this.applied = 0
    this.view?.setWorld(setup)
    this.view?.place(this.world.pose, this.world.trail)
    this.view?.setLed(undefined)
    this.updateStatus()
    this.onWorldChange?.()
  }

  reset() {
    this.world.reset()
    this.applied = 0
    this.view?.place(this.world.pose, this.world.trail)
    this.view?.setLed(undefined)
    this.updateStatus()
  }

  /** Vor einem Schritt: Sensorwerte der Welt an die Simulation geben. */
  prepare(engine: SimulationEngine) {
    engine.robotSensors = this.world.sensors()
  }

  /** Nach einem Schritt: neue Befehle ausführen und in `ms` Millisekunden zeigen. */
  follow(actions: MBotAction[], ms: number) {
    for (; this.applied < actions.length; this.applied++) {
      const action = actions[this.applied]
      this.world.apply(action)
      this.view?.moveTo(this.world.pose, this.world.trail, ms)
      this.view?.setLed(this.world.led)
    }
    this.updateStatus()
  }

  dispose() {
    this.view?.dispose()
    this.view = undefined
    this.loading = undefined
  }

  private updateStatus() {
    const line = this.world.lineState().toString(2).padStart(4, '0')
    const parts = [
      `${t('web_visubot_distance')}: ${this.world.distance()} cm`,
      `${t('web_visubot_line')}: ${line}`,
    ]
    if (this.world.bumps > 0) parts.push(`⚠︎ ${t('web_visubot_bumps')}: ${this.world.bumps}`)
    this.status.textContent = parts.join(' · ')
  }
}

/** Zusätzliche Elemente im VisuBot-Modus: fertig beschriftete Kästen zum Reinziehen. */
export interface VisuBotTemplate {
  /** Schlüssel des Namens in der Palette */
  key: string
  type: ElementType
  make: () => VSElement
}

const statement = (text: string) => () => makeElement(ElementType.anweisung, { textLines: [text] })

export const visuBotTemplates: VisuBotTemplate[] = [
  { key: 'web_visubot_el_forward', type: ElementType.anweisung, make: statement('mbot.forward()') },
  { key: 'web_visubot_el_backward', type: ElementType.anweisung, make: statement('mbot.backward()') },
  { key: 'web_visubot_el_right', type: ElementType.anweisung, make: statement('mbot.turnRight()') },
  { key: 'web_visubot_el_left', type: ElementType.anweisung, make: statement('mbot.turnLeft()') },
  { key: 'web_visubot_el_led', type: ElementType.anweisung, make: statement('mbot.setLed(255, 0, 0)') },
  { key: 'web_visubot_el_tone', type: ElementType.anweisung, make: statement('mbot.playTone(440, 300)') },
]

/** Sensoren: Werte, die die Schüler selbst in eine Bedingung einbauen (`mbot.getDistance() < 20`). */
export const visuBotSensors: { key: string; text: string }[] = [
  { key: 'web_visubot_sensor_distance', text: 'mbot.getDistance()' },
  { key: 'web_visubot_sensor_line', text: 'mbot.getLine()' },
]
