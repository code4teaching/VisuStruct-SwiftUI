/**
 * Tooltips für Symbolknöpfe: Name aus `data-tip`, erscheint kurz nach dem Überfahren oder beim Fokus mit der Tastatur.
 * Ein einziges schwebendes Element, damit es am Fensterrand nicht abgeschnitten wird.
 */

let tip: HTMLElement | undefined
let timer: number | undefined
let current: HTMLElement | undefined

function show(target: HTMLElement) {
  const text = target.dataset.tip
  if (!text) return
  tip ??= Object.assign(document.createElement('div'), { className: 'tooltip', role: 'tooltip' })
  if (!tip.isConnected) document.body.append(tip)
  tip.textContent = text
  tip.hidden = false
  const r = target.getBoundingClientRect()
  const w = tip.offsetWidth
  const h = tip.offsetHeight
  const left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8)
  const below = r.bottom + 6 + h < window.innerHeight
  tip.style.left = `${left}px`
  tip.style.top = `${below ? r.bottom + 6 : r.top - h - 6}px`
}

function hide() {
  window.clearTimeout(timer)
  timer = undefined
  current = undefined
  if (tip) tip.hidden = true
}

export function installTooltips() {
  document.addEventListener('pointerover', (e) => {
    if (e.pointerType === 'touch') return
    const target = (e.target as Element).closest<HTMLElement>('[data-tip]')
    if (target === current) return
    hide()
    if (!target) return
    current = target
    timer = window.setTimeout(() => show(target), 350)
  })
  document.addEventListener('focusin', (e) => {
    const target = (e.target as Element).closest<HTMLElement>('[data-tip]')
    hide()
    if (target?.matches(':focus-visible')) show(target)
  })
  for (const type of ['pointerdown', 'focusout', 'scroll', 'keydown']) document.addEventListener(type, hide, true)
}
