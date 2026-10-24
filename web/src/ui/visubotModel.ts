import { markdownToHTML } from '../learn/markdown'
import { t } from './i18n'
import type { RobotPart } from './robot3d'

/** Lektionsblock `::: mbot2`: der Roboter zum Drehen und Antippen, darunter die Erklärung des gewählten Teils. */
export function renderRobotModel(parts: { part: string; text: string }[]): HTMLElement {
  const box = document.createElement('div')
  box.className = 'visubot-model'
  const stage = document.createElement('div')
  stage.className = 'visubot-stage'
  const info = document.createElement('div')
  info.className = 'visubot-part-info'
  info.textContent = t('web_visubot_tap_part')
  const buttons = document.createElement('div')
  buttons.className = 'visubot-part-buttons'
  const show = (part: string) => {
    const entry = parts.find((p) => p.part === part)
    if (!entry) return
    info.innerHTML = markdownToHTML(entry.text)
    for (const b of buttons.children) b.classList.toggle('active', (b as HTMLElement).dataset.part === part)
  }
  for (const { part, text } of parts) {
    const b = document.createElement('button')
    b.dataset.part = part
    // Name = erstes fett gedrucktes Wort der Erklärung
    b.textContent = /\*\*(.+?)\*\*/.exec(text)?.[1] ?? part
    b.addEventListener('click', () => show(part))
    buttons.append(b)
  }
  box.append(stage, buttons, info)
  void import('./robot3d')
    .then(({ Robot3D }) => {
      const view = new Robot3D(stage)
      view.setWorld({ width: 60, depth: 60, start: { x: 0, y: 0, heading: 0 }, walls: [], lines: [] })
      view.place({ x: 0, y: 0, heading: 0 }, [{ x: 0, y: 0 }])
      view.closeUp()
      let down: { x: number; y: number } | undefined
      stage.addEventListener('pointerdown', (e) => (down = { x: e.clientX, y: e.clientY }))
      // Antippen ohne Drehen wählt ein Teil.
      stage.addEventListener('pointerup', (e) => {
        if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) return
        const part: RobotPart | undefined = view.partAt(e.clientX, e.clientY)
        if (part) show(part)
      })
    })
    .catch(() => {
      stage.textContent = t('web_visubot_no_3d')
    })
  return box
}
