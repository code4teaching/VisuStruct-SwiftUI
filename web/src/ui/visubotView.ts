import { MBOT_SENSORS, mbotColorName, type MBotAction, type MBotSensorValues } from '../core/mbot'
import { HELLO, mbotLink, showLabel } from '../core/mbotLink'
import { ElementType, makeElement, type VSElement } from '../core/model'
import { emptyWorld, ROBOT_STEP_MS, RobotWorld, type RobotWorldSetup } from '../core/robotWorld'
import type { SimulationEngine } from '../core/simulation'
import { t } from './i18n'
import type { VisuBotMode } from '../learn/content'
import type { Robot3D } from './robot3d'
import visuBotLogoURL from './visubot.webp'

/**
 * Welt, gespeichert im Browser: VisuStruct (`0`) oder VisuBot (`1`).
 * Der frühere Modus „Im Kurs“ (`kurs`) gilt jetzt als VisuBot.
 */
const modeKey = 'visustruct.visubot'

function storedMode(): string | null {
  try {
    return localStorage.getItem(modeKey)
  } catch {
    return null
  }
}

export function visuBotMode(): VisuBotMode {
  const value = storedMode()
  return value === '1' || value === 'kurs' ? 'on' : 'off'
}

/** Hat man schon einmal zwischen VisuStruct und VisuBot gewählt? Sonst fragt der Start-Dialog. */
export const worldChosen = () => storedMode() !== null

export function setVisuBotMode(mode: VisuBotMode) {
  try {
    localStorage.setItem(modeKey, mode === 'on' ? '1' : '0')
  } catch {
    /* ohne Speicher nur für diese Sitzung */
  }
}

/** Kopfzeile im VisuBot-Modus: der Roboter aus dem VisuBot-Logo und „Visu“ + orangefarbenes „Bot“. */
export const visuBotBrand = `<img class="visubot-logo" src="${visuBotLogoURL}" width="55" height="32" alt="">Visu<span class="visubot-bot">Bot</span>`

/** Gibt es mBot2-Kästen und den 3D-Simulator? (Nur in der Welt VisuBot.) */
export const visuBotEnabled = () => visuBotMode() !== 'off'

const escapeHTML = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

/** Auswahl „VisuStruct | VisuBot“ für Zahnrad und Start-Dialog; die Knöpfe tragen `data-world`. */
export function worldChooserHTML(): string {
  const on = visuBotMode() === 'on'
  const button = (mode: VisuBotMode, label: string, pressed: boolean) =>
    `<button type="button" data-world="${mode}" aria-pressed="${pressed}">${label}</button>`
  return `<div class="segmented world-chooser" role="group" aria-label="${escapeHTML(t('web_visubot_world_title'))}">
      ${button('off', 'VisuStruct', !on)}${button('on', '🤖 VisuBot', on)}
    </div>
    <small class="world-hint">${escapeHTML(t(on ? 'web_visubot_world_visubot_hint' : 'web_visubot_world_visustruct_hint'))}</small>`
}

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
  /** Befehle, die der echte mBot2 schon gefahren ist. */
  private sent = 0
  private liveStatus: HTMLElement
  private stopListening: () => void
  private realSensors?: MBotSensorValues
  /** Regler und Knöpfe „Sensoren ausprobieren“: Werte, die keine Welt liefert. */
  private controls: MBotSensorValues = { getBrightness: 50, getLoudness: 0, getPitch: 0, getRoll: 0 }
  private pressTimers = new Map<string, number>()
  /** „mBot2 testen“: alle Sensoren live und Knöpfe für die Aktoren (nur mit echtem mBot2) */
  private check: HTMLDetailsElement
  private checking = false
  /** Nach dem Umschalten der Welt: Simulation von vorn (setzt das Simulationspanel). */
  onWorldChange?: () => void

  constructor(setup: RobotWorldSetup = emptyWorld) {
    this.world = new RobotWorld(setup)
    this.element = document.createElement('section')
    this.element.className = 'visubot'
    this.element.innerHTML = `<h2>${t('web_visubot_world')}</h2><p class="visubot-live"></p><div class="visubot-worlds" hidden></div><div class="visubot-stage"></div><p class="visubot-status mono" dir="ltr"></p>${controlsHTML()}${checkHTML()}`
    this.stage = this.element.querySelector('.visubot-stage')!
    this.picker = this.element.querySelector('.visubot-worlds')!
    this.status = this.element.querySelector('.visubot-status')!
    this.liveStatus = this.element.querySelector('.visubot-live')!
    this.stopListening = mbotLink.listen(() => this.updateLive())
    this.setupControls()
    this.check = this.element.querySelector('.visubot-check')!
    this.setupCheck()
    this.updateLive()
    this.updateStatus()
  }

  /** 3D-Ansicht aufbauen (beim ersten Einblenden). */
  show() {
    this.loading ??= import('./robot3d').then(({ Robot3D }) => {
      this.view = new Robot3D(this.stage)
      this.view.setWorld(this.world.setup)
      this.view.place(this.world.pose, this.world.trail)
      this.view.setLeds(this.world.leds)
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
    this.sent = 0
    this.view?.setWorld(setup)
    this.view?.place(this.world.pose, this.world.trail)
    this.view?.setLed(undefined)
    this.view?.setScreen(undefined)
    this.updateStatus()
    this.onWorldChange?.()
  }

  reset() {
    this.world.reset()
    this.applied = 0
    this.sent = 0
    this.realSensors = undefined
    this.view?.place(this.world.pose, this.world.trail)
    this.view?.setLed(undefined)
    this.view?.setScreen(undefined)
    this.updateStatus()
  }

  /** Vor einem Schritt: Sensorwerte der Welt und der Regler an die Simulation geben. */
  prepare(engine: SimulationEngine) {
    engine.robotSensors = { ...this.controls, ...this.world.sensors() }
  }

  private setupControls() {
    for (const range of this.element.querySelectorAll<HTMLInputElement>('.visubot-controls input[type=range]')) {
      const out = range.parentElement!.querySelector('output')!
      const update = () => {
        this.controls[range.name] = Number(range.value)
        out.textContent = range.value
      }
      range.addEventListener('input', update)
      update()
    }
    // Tasten, Joystick, Schütteln: eine Sekunde lang „gedrückt“, damit die Simulation es im nächsten Schritt sieht
    for (const button of this.element.querySelectorAll<HTMLButtonElement>('.visubot-controls button[name]')) {
      button.addEventListener('click', () => {
        const name = button.name
        this.controls[name] = true
        button.classList.add('pressed')
        window.clearTimeout(this.pressTimers.get(name))
        this.pressTimers.set(
          name,
          window.setTimeout(() => {
            this.controls[name] = false
            button.classList.remove('pressed')
          }, 1000),
        )
      })
    }
  }

  private setupCheck() {
    for (const button of this.check.querySelectorAll<HTMLButtonElement>('button[data-py]')) {
      button.addEventListener('click', () => {
        // `data-after`: nach `data-wait` Millisekunden zurück (Räder anhalten, wieder „Hallo VisuBot!“ zeigen)
        const { after, wait } = button.dataset
        void mbotLink
          .run(button.dataset.py!)
          .then(() => (after ? new Promise((r) => setTimeout(r, Number(wait))).then(() => mbotLink.run(after)) : undefined))
          .catch((e: Error) => this.liveFailed(e))
      })
    }
    this.check.addEventListener('toggle', () => void this.readCheck())
  }

  /** Solange „mBot2 testen“ offen ist: alle Sensoren reihum lesen und zeigen. */
  private async readCheck() {
    if (this.checking) return
    this.checking = true
    try {
      while (this.check.open && mbotLink.connected) {
        for (const cell of this.check.querySelectorAll<HTMLElement>('[data-sensor]')) {
          if (!this.check.open || !mbotLink.connected) break
          const name = cell.dataset.sensor!
          const value = await mbotLink.ask(MBOT_SENSORS[name].python).catch(() => undefined)
          if (value === undefined) continue
          cell.textContent =
            typeof MBOT_SENSORS[name].simulated === 'boolean'
              ? value === true || (typeof value === 'number' && value !== 0) ? '✓' : '–'
              : String(typeof value === 'number' ? Math.round(value * 10) / 10 : value)
        }
        await new Promise((r) => setTimeout(r, 200))
      }
    } finally {
      this.checking = false
    }
  }

  /** Fährt der echte mBot2 mit? */
  get live(): boolean {
    return mbotLink.connected
  }

  /**
   * Vor einem Schritt mit dem echten mBot2: seine Sensoren lesen (statt Welt und Reglern).
   * Abstand und Linie immer, die übrigen nur, wenn das Programm sie benutzt (`used`), damit ein Schritt schnell bleibt.
   */
  async prepareLive(engine: SimulationEngine, used: string[] = []) {
    const values: MBotSensorValues = {}
    for (const name of new Set(['getDistance', 'getLine', ...used])) {
      const value = await mbotLink.ask(MBOT_SENSORS[name].python)
      // Ja/Nein-Sensoren antworten mit 0 oder 1 statt False/True (getestet am echten mBot2).
      if (typeof MBOT_SENSORS[name].simulated === 'boolean') values[name] = value === true || (typeof value === 'number' && value !== 0)
      else if (typeof MBOT_SENSORS[name].simulated === 'string') values[name] = typeof value === 'string' ? value : String(MBOT_SENSORS[name].simulated)
      else values[name] = typeof value === 'number' ? (name === 'getDistance' ? Math.round(value) : value) : 0
    }
    this.realSensors = values
    engine.robotSensors = { ...this.controls, ...this.world.sensors(), ...values }
  }

  /** Nach einem Schritt: neue Befehle an den echten mBot2; kehrt zurück, wenn er fertig gefahren ist. */
  async drive(actions: MBotAction[]) {
    for (; this.sent < actions.length; this.sent++) {
      const action = actions[this.sent]
      if (action.python) await mbotLink.run(action.python)
      else if (action.method === 'pause') await new Promise((r) => setTimeout(r, action.args[0]))
    }
  }

  /** Nach einem Fehler der Verbindung: trennen und Grund zeigen. */
  liveFailed(error: unknown) {
    void mbotLink.disconnect(error instanceof Error ? error.message : String(error))
  }

  private updateLive() {
    this.liveStatus.textContent = mbotLinkText()
    this.liveStatus.classList.toggle('connected', mbotLink.connected)
    this.check.hidden = !mbotLink.connected
    if (!mbotLink.connected) this.check.open = false
    this.updateStatus()
  }

  /** Nach einem Schritt: neue Befehle ausführen und in `ms` Millisekunden zeigen. */
  follow(actions: MBotAction[], ms: number) {
    for (; this.applied < actions.length; this.applied++) {
      const action = actions[this.applied]
      this.world.apply(action)
      // Ton im Browser hören (der echte mBot2 spielt ihn selbst)
      if (action.method === 'playTone' && !this.live) playTone(action.args[0], action.args[1])
      this.view?.moveTo(this.world.pose, this.world.trail, ms)
      this.view?.setLeds(this.world.leds)
      this.view?.setScreen(this.world.screen)
    }
    // Mit `mbot.drive` fährt er auch ohne neuen Befehl weiter
    const moving = this.world.wheels.some((p) => p !== 0)
    this.world.tick(ROBOT_STEP_MS)
    if (moving) this.view?.moveTo(this.world.pose, this.world.trail, ms)
    this.updateStatus()
  }

  dispose() {
    this.stopListening()
    for (const timer of this.pressTimers.values()) window.clearTimeout(timer)
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
    if (this.world.screen !== undefined) parts.push(`📺 ${this.world.screen}`)
    if (this.realSensors && mbotLink.connected)
      parts.push(`🤖 ${t('web_visubot_distance')}: ${this.realSensors.getDistance} cm · ${t('web_visubot_line')}: ${Number(this.realSensors.getLine).toString(2).padStart(4, '0')}`)
    this.status.textContent = parts.join(' · ')
  }
}

let audio: AudioContext | undefined

/** Kurzer Ton über die Lautsprecher des Computers, wie der Lautsprecher des CyberPi. */
function playTone(hz: number, ms: number) {
  try {
    audio ??= new AudioContext()
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    osc.type = 'square'
    osc.frequency.value = Math.max(20, Math.min(20000, hz))
    gain.gain.value = 0.05
    osc.connect(gain).connect(audio.destination)
    const end = audio.currentTime + Math.min(Math.max(ms, 0), 5000) / 1000
    osc.start()
    osc.stop(end)
  } catch {
    /* ohne Ton weiter */
  }
}

/** Regler und Knöpfe für Sensoren, die keine Welt liefert (Licht, Lautstärke, Neigung, Tasten, Joystick, Schütteln). */
function controlsHTML(): string {
  const range = (name: string, key: string, min: number, max: number, value: number) =>
    `<label><span>${t(key)}</span><input type="range" name="${name}" min="${min}" max="${max}" value="${value}"><output></output></label>`
  const press = (name: string, text: string, key: string) => `<button type="button" name="${name}" title="${t(key)}" aria-label="${t(key)}">${text}</button>`
  return `<details class="visubot-controls"><summary>🎛 ${t('web_visubot_controls')}</summary>
    <p class="hint">${t('web_visubot_controls_hint')}</p>
    ${range('getBrightness', 'web_visubot_sensor_brightness', 0, 100, 50)}
    ${range('getLoudness', 'web_visubot_sensor_loudness', 0, 100, 0)}
    ${range('getPitch', 'web_visubot_sensor_pitch', -90, 90, 0)}
    ${range('getRoll', 'web_visubot_sensor_roll', -90, 90, 0)}
    <div class="visubot-presses">
      ${press('isButtonA', 'A', 'web_visubot_sensor_button_a')}${press('isButtonB', 'B', 'web_visubot_sensor_button_b')}
      ${press('isJoystickUp', '↑', 'web_visubot_sensor_joy_up')}${press('isJoystickDown', '↓', 'web_visubot_sensor_joy_down')}
      ${press('isJoystickLeft', '←', 'web_visubot_sensor_joy_left')}${press('isJoystickRight', '→', 'web_visubot_sensor_joy_right')}
      ${press('isShaken', `〰 ${t('web_visubot_shake')}`, 'web_visubot_sensor_shake')}
    </div>
  </details>`
}

/** „mBot2 testen“: jeden Aktor einmal auslösen, jeden Sensor live ablesen (wie die Labor-Seite). */
function checkHTML(): string {
  const attr = (py: string) => py.replace(/"/g, '&quot;')
  const act = (py: string, key: string, after?: string, wait = 1000) =>
    `<button type="button" data-py="${attr(py)}"${after ? ` data-after="${attr(after)}" data-wait="${wait}"` : ''}>${t(key)}</button>`
  const stop = "mbot2.EM_stop('ALL')"
  const sensors = visuBotSensors
    .map((s) => `<tr><th>${t(s.key)}</th><td data-sensor="${s.text.replace(/^mbot\.|\(\)$/g, '')}">…</td></tr>`)
    .join('')
  return `<details class="visubot-check" hidden><summary>🔧 ${t('web_visubot_check')}</summary>
    <p class="hint">${t('web_visubot_check_hint')}</p>
    <div class="visubot-presses">
      ${act('cyberpi.led.on(255, 0, 0)', 'web_visubot_el_led')}${act('cyberpi.led.off()', 'web_visubot_el_led_off')}
      ${act('cyberpi.audio.play_tone(440, 0.3)', 'web_visubot_el_tone')}
      ${act(showLabel('Test'), 'web_visubot_el_text', HELLO, 2000)}
      ${act('cyberpi.emotion.smile()', 'web_visubot_el_emotion')}
      ${act('mbot2.drive_power(30, -30)', 'web_visubot_check_forward', stop)}${act('mbot2.drive_power(30, 30)', 'web_visubot_check_spin', stop)}
    </div>
    <table class="visubot-check-sensors">${sensors}</table>
  </details>`
}

/** Kurzer Zustand der Verbindung zum echten mBot2 (leer, wenn nicht verbunden und kein Fehler). */
export function mbotLinkText(): string {
  if (mbotLink.connecting) return t('web_visubot_connecting')
  if (mbotLink.connected) return `✓ ${t('web_visubot_connected')}`
  return mbotLink.error ? `⚠︎ ${t('web_visubot_link_error')}: ${mbotLink.error}` : ''
}

/** Mit dem echten mBot2 verbinden bzw. trennen (Knopf in der Werkzeugleiste und in den Einstellungen). */
export async function toggleMBotLink() {
  if (mbotLink.connected || mbotLink.connecting) return mbotLink.disconnect()
  try {
    await mbotLink.connect()
  } catch (e) {
    // Abbrechen der Auswahl ist kein Fehler
    await mbotLink.disconnect((e as Error).name === 'NotFoundError' ? undefined : (e as Error).message)
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
  { key: 'web_visubot_el_drive', type: ElementType.anweisung, make: statement('mbot.drive(30, 30)') },
  { key: 'web_visubot_el_stop', type: ElementType.anweisung, make: statement('mbot.stop()') },
  { key: 'web_visubot_el_led', type: ElementType.anweisung, make: statement('mbot.setLed(255, 0, 0)') },
  { key: 'web_visubot_el_led_off', type: ElementType.anweisung, make: statement('mbot.ledOff()') },
  { key: 'web_visubot_el_led_color', type: ElementType.anweisung, make: statement('mbot.led(0).setColor("grün")') },
  { key: 'web_visubot_el_tone', type: ElementType.anweisung, make: statement('mbot.playTone(440, 300)') },
  { key: 'web_visubot_el_wait', type: ElementType.anweisung, make: statement('mbot.pause(100)') },
  { key: 'web_visubot_el_text', type: ElementType.anweisung, make: statement('mbot.showText("Hallo")') },
  { key: 'web_visubot_el_emotion', type: ElementType.anweisung, make: statement('mbot.emotion("smile")') },
  { key: 'web_visubot_el_timer', type: ElementType.anweisung, make: statement('mbot.resetTimer()') },
]

/** Sensoren: Werte, die die Schüler selbst in eine Bedingung einbauen (`mbot.getDistance() < 20`). */
export const visuBotSensors: { key: string; text: string }[] = [
  { key: 'web_visubot_sensor_distance', text: 'mbot.getDistance()' },
  { key: 'web_visubot_sensor_line', text: 'mbot.getLine()' },
  { key: 'web_visubot_sensor_line_left', text: 'mbot.isLineLeft()' },
  { key: 'web_visubot_sensor_line_right', text: 'mbot.isLineRight()' },
  // Farbname in der Sprache der Lektionen ("rot" oder "red")
  { key: 'web_visubot_sensor_color', get text() { return `mbot.getColor().equals("${mbotColorName('red')}")` } },
  { key: 'web_visubot_sensor_button_a', text: 'mbot.isButtonA()' },
  { key: 'web_visubot_sensor_button_b', text: 'mbot.isButtonB()' },
  { key: 'web_visubot_sensor_joy_up', text: 'mbot.isJoystickUp()' },
  { key: 'web_visubot_sensor_joy_down', text: 'mbot.isJoystickDown()' },
  { key: 'web_visubot_sensor_joy_left', text: 'mbot.isJoystickLeft()' },
  { key: 'web_visubot_sensor_joy_right', text: 'mbot.isJoystickRight()' },
  { key: 'web_visubot_sensor_brightness', text: 'mbot.getBrightness()' },
  { key: 'web_visubot_sensor_loudness', text: 'mbot.getLoudness()' },
  { key: 'web_visubot_sensor_pitch', text: 'mbot.getPitch()' },
  { key: 'web_visubot_sensor_roll', text: 'mbot.getRoll()' },
  { key: 'web_visubot_sensor_shake', text: 'mbot.isShaken()' },
  { key: 'web_visubot_sensor_timer', text: 'mbot.getTimer()' },
  { key: 'web_visubot_sensor_battery', text: 'mbot.getBattery()' },
]
