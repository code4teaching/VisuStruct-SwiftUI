import type { MBotPart } from '../core/mbot'
import { markdownToHTML } from '../learn/markdown'
import { t } from './i18n'
import type { Robot3D } from './robot3d'

/**
 * Tour durch den mBot2 wie bei JavaPicoGoat: Jeder Schritt einer Lektion zeigt das Modell, die Kamera fährt zu den Teilen,
 * um die es geht. Gelb unterstrichene Wörter im Text lassen ihr Teil aufleuchten, Fahren mit der Maus zeigt den Namen.
 */

export const partName = (part: MBotPart) => t(`web_visubot_part_${part}`)

interface ModelView {
  box: HTMLElement
  /** Das Modell, sobald three.js geladen ist */
  ready: Promise<Robot3D | undefined>
  /** Teile, die der Schritt zeigt (leuchten, wenn sonst nichts gewählt ist) */
  focus: MBotPart[]
  view?: string
}

const models = new WeakMap<HTMLElement, ModelView>()

/** Bühne mit dem Modell; `onPick` bekommt das angeklickte Teil. */
function modelStage(focus: MBotPart[], view: string | undefined, spin: boolean, onPick?: (part: MBotPart) => void): ModelView {
  const box = document.createElement('div')
  box.className = 'visubot-model'
  const stage = document.createElement('div')
  stage.className = 'visubot-stage'
  const label = document.createElement('div')
  label.className = 'visubot-part-label'
  label.hidden = true
  stage.append(label)
  const showLabel = (part: MBotPart, x: number, y: number) => {
    label.hidden = false
    label.textContent = partName(part)
    label.style.left = `${Math.min(x + 12, stage.clientWidth - 140)}px`
    label.style.top = `${y + 12}px`
  }
  const hint = document.createElement('p')
  hint.className = 'visubot-model-hint hint'
  hint.textContent = t('web_visubot_tap_part')
  hint.hidden = !!onPick
  box.append(stage, hint)
  const ready = import('./robot3d')
    .then(({ Robot3D }) => {
      const robot = new Robot3D(stage)
      robot.showcase()
      robot.highlight(focus)
      // Zuerst etwas weiter weg, dann zu den Teilen fliegen: so sieht man, wo sie am Roboter sitzen.
      robot.focusOn([], view === 'unten' || view === 'bottom' ? '' : view, false, 1)
      robot.focusOn(focus, view, spin)
      let down: { x: number; y: number } | undefined
      stage.addEventListener('pointerdown', (e) => (down = { x: e.clientX, y: e.clientY }))
      stage.addEventListener('pointerup', (e) => {
        if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) return
        const part = robot.partAt(e.clientX, e.clientY)
        if (!part) return
        if (onPick) return onPick(part)
        // Antippen zeigt das Teil und seinen Namen (auch ohne Maus)
        robot.highlight(part)
        const r = stage.getBoundingClientRect()
        showLabel(part, e.clientX - r.left, e.clientY - r.top)
      })
      // Name des Teils unter der Maus
      stage.addEventListener('pointermove', (e) => {
        // Im Suchspiel verrät der Name die Antwort.
        if (e.pointerType !== 'mouse' || onPick) return
        const part = robot.partAt(e.clientX, e.clientY)
        label.hidden = !part
        if (!part) return
        const r = stage.getBoundingClientRect()
        showLabel(part, e.clientX - r.left, e.clientY - r.top)
      })
      stage.addEventListener('pointerleave', () => (label.hidden = true))
      return robot
    })
    .catch(() => {
      stage.textContent = t('web_visubot_no_3d')
      return undefined
    })
  const model: ModelView = { box, ready, focus, view }
  models.set(box, model)
  return model
}

/** Lektionsblock `::: mbot2`. */
export function renderRobotModel(focus: MBotPart[], view?: string, spin = false): HTMLElement {
  return modelStage(focus, view, spin).box
}

/**
 * Gelb unterstrichene Wörter (`[Wort]{teil=…}`) mit dem Modell im selben Schritt verbinden:
 * Zeigen lässt das Teil aufleuchten, Antippen fährt die Kamera hin.
 */
export function wireRobotLinks(root: HTMLElement) {
  const box = root.querySelector<HTMLElement>('.visubot-model')
  const model = box && models.get(box)
  for (const link of root.querySelectorAll<HTMLElement>('[data-robot-part]')) {
    const parts = (link.dataset.robotPart ?? '').split(',').filter(Boolean) as MBotPart[]
    link.title = parts.map(partName).join(', ')
    if (!model) continue
    const show = () => void model.ready.then((r) => r?.highlight(parts))
    const back = () => void model.ready.then((r) => r?.highlight(model.focus))
    link.addEventListener('mouseenter', show)
    link.addEventListener('focus', show)
    link.addEventListener('mouseleave', back)
    link.addEventListener('blur', back)
    link.addEventListener('click', () => {
      void model.ready.then((r) => {
        r?.highlight(parts)
        r?.focusOn(parts, model.view)
      })
      model.box.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    })
  }
}

/** Lektionsblock `::: mbot2quiz`: nacheinander das gesuchte Teil im Modell anklicken. */
export function renderRobotQuiz(tasks: { part: MBotPart; question: string }[], done?: string): HTMLElement {
  let index = 0
  const question = document.createElement('div')
  question.className = 'visubot-quiz-question'
  const feedback = document.createElement('p')
  feedback.className = 'visubot-quiz-feedback'
  feedback.setAttribute('aria-live', 'polite')
  const ask = () => {
    question.innerHTML = markdownToHTML(`**${index + 1}/${tasks.length}** ${tasks[index].question}`)
  }
  const model = modelStage([], undefined, false, (part) => {
    if (index >= tasks.length) return
    void model.ready.then((r) => r?.highlight(part))
    if (part !== tasks[index].part) {
      feedback.className = 'visubot-quiz-feedback wrong'
      feedback.textContent = t('web_visubot_quiz_wrong_fmt', partName(part))
      return
    }
    index++
    feedback.className = 'visubot-quiz-feedback right'
    if (index < tasks.length) {
      feedback.textContent = `✓ ${t('web_visubot_quiz_right')}`
      ask()
    } else {
      feedback.textContent = ''
      question.innerHTML = markdownToHTML(`✓ ${done ?? t('web_visubot_quiz_right')}`)
      question.classList.add('done')
    }
  })
  ask()
  const box = document.createElement('div')
  box.className = 'visubot-quiz'
  box.append(question, model.box, feedback)
  return box
}
