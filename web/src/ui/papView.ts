import { inline } from '../learn/markdown'
import { papFits, papLayout, papLines, type Pap, type PapBox, type PapShape } from '../learn/pap'
import { t } from './i18n'

/**
 * PAP bauen im Lernbereich: Der Plan steht mit leeren Plätzen da, darunter liegen die fertigen Elemente gemischt.
 * Element antippen und dann den Platz (oder Element auf den Platz ziehen). Ein belegter Platz gibt sein Element beim
 * Antippen zurück.
 */

const SVG = 'http://www.w3.org/2000/svg'
let papCount = 0
const FILL: Record<PapShape, string> = { oval: '#d1f2d9', rechteck: '#e5f0ff', raute: '#fff4d6', parallelogramm: '#f2e6ff' }

function h(tag: string, attrs: Record<string, string> = {}, ...children: (Node | string)[]): HTMLElement {
  const e = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v)
  e.append(...children)
  return e
}

function s(tag: string, attrs: Record<string, string | number> = {}): SVGElement {
  const e = document.createElementNS(SVG, tag)
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v))
  return e
}

function shapeEl(shape: PapShape, b: PapBox): SVGElement {
  const l = b.x - b.w / 2
  const r = b.x + b.w / 2
  const t0 = b.y - b.h / 2
  const t1 = b.y + b.h / 2
  if (shape === 'raute') return s('path', { d: `M${b.x} ${t0} L${r} ${b.y} L${b.x} ${t1} L${l} ${b.y} Z` })
  if (shape === 'parallelogramm') return s('path', { d: `M${l + 10} ${t0} L${r} ${t0} L${r - 10} ${t1} L${l} ${t1} Z` })
  return s('rect', { x: l, y: t0, width: b.w, height: b.h, rx: shape === 'oval' ? b.h / 2 : 0 })
}

function textEl(text: string, b: PapBox, shape: PapShape): SVGElement {
  const lines = papLines(text, b.w - (shape === 'raute' ? 50 : 14))
  const g = s('text', { 'text-anchor': 'middle', 'font-size': lines.length > 1 ? 12 : 13 })
  lines.forEach((line, i) => {
    const span = s('tspan', { x: b.x, y: b.y + 4.5 + (i - (lines.length - 1) / 2) * 14 })
    span.textContent = line
    g.append(span)
  })
  return g
}

function arrow(points: [number, number][], id: string): SVGElement {
  return s('polyline', { points: points.map((p) => p.join(',')).join(' '), fill: 'none', 'marker-end': `url(#${id})` })
}

function label(text: string, x: number, y: number, yes: boolean): SVGElement {
  const e = s('text', { x, y, 'font-size': 12, 'font-weight': 600, fill: yes ? '#248a3d' : '#d70015' })
  e.textContent = text
  return e
}

/** Element als kleines Bild für die Ablage unten. */
function cardSVG(shape: PapShape, text: string): SVGElement {
  const lines = papLines(text, 110)
  const long = Math.max(...lines.map((l) => l.length))
  const w = Math.max(70, long * 6.6 + (shape === 'raute' ? 56 : 26))
  const hgt = shape === 'raute' ? 48 : lines.length > 1 ? 40 : 30
  const svg = s('svg', { viewBox: `0 0 ${w + 4} ${hgt + 4}`, width: w + 4, height: hgt + 4, 'aria-hidden': 'true' })
  const b = { x: (w + 4) / 2, y: (hgt + 4) / 2, w, h: hgt }
  const shapeE = shapeEl(shape, b)
  shapeE.setAttribute('fill', FILL[shape])
  shapeE.setAttribute('stroke', '#1c1c1e')
  shapeE.setAttribute('stroke-width', '1.5')
  svg.append(shapeE, textEl(text, { ...b, w: lines.length > 1 ? 124 : w }, shape))
  return svg
}

function shuffled(n: number): number[] {
  const order = [...Array(n).keys()]
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  // Nie schon in der richtigen Reihenfolge anbieten.
  if (n > 1 && order.every((v, i) => v === i)) order.reverse()
  return order
}

/** Legende: Symbol und Bedeutung für alle vier Formen. */
function legend(): HTMLElement {
  const list = h('dl', { class: 'learn-pap-legend' })
  const items: [PapShape, string][] = [
    ['oval', 'web_learn_pap_legend_oval'],
    ['rechteck', 'web_learn_pap_legend_rect'],
    ['raute', 'web_learn_pap_legend_diamond'],
    ['parallelogramm', 'web_learn_pap_legend_para'],
  ]
  for (const [shape, key] of items) {
    const w = shape === 'raute' ? 44 : 40
    const svg = s('svg', { viewBox: `0 0 ${w + 4} 28`, width: w + 4, height: 28, 'aria-hidden': 'true' })
    const el = shapeEl(shape, { x: (w + 4) / 2, y: 14, w, h: shape === 'raute' ? 24 : 18 })
    el.setAttribute('fill', FILL[shape])
    el.setAttribute('stroke', '#1c1c1e')
    el.setAttribute('stroke-width', '1.5')
    svg.append(el)
    list.append(h('dt', {}, svg), h('dd', {}, t(key)))
  }
  return list
}

export function renderPap(pap: Pap): HTMLElement {
  const box = h('section', { class: 'learn-pap' })
  box.append(h('strong', { class: 'learn-pap-title' }, pap.title))
  if (pap.task) {
    const p = h('p')
    p.innerHTML = inline(pap.task)
    box.append(p)
  }
  box.append(h('p', { class: 'learn-pap-hint' }, t('web_learn_pap_hint')))

  const { boxes, height } = papLayout(pap)
  // Nur so breit wie der Inhalt, damit der Plan in der schmalen Lernspalte möglichst groß wird.
  const shown = boxes.filter(Boolean)
  const minX = Math.min(...shown.map((b) => b.x - b.w / 2)) - 4
  const hasRaute = pap.nodes.some((n) => n.shape === 'raute')
  const maxX = Math.max(...shown.map((b) => b.x + b.w / 2), hasRaute ? Math.max(...shown.map((b) => b.x)) + 85 + 40 : 0) + 4
  const svg = s('svg', { viewBox: `${minX} 0 ${maxX - minX} ${height}`, class: 'learn-pap-plan', role: 'group', 'aria-label': pap.title })
  const arrowId = `pap-arrow-${++papCount}`
  svg.innerHTML =
    `<defs><marker id="${arrowId}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#1c1c1e"/></marker></defs>`
  const lines = s('g', { stroke: '#1c1c1e', 'stroke-width': 2 })
  const labels = s('g')
  const yes = t('web_learn_pap_yes')
  const no = t('web_learn_pap_no')
  const top = (i: number) => boxes[i].y - boxes[i].h / 2
  const bottom = (i: number) => boxes[i].y + boxes[i].h / 2
  const main = pap.nodes.map((_, i) => i).filter((i) => !pap.nodes[i].isSide)
  main.forEach((i, k) => {
    const n = pap.nodes[i]
    const b = boxes[i]
    const next = main[k + 1]
    if (next !== undefined) {
      lines.append(arrow([[b.x, bottom(i)], [b.x, top(next) - 2]], arrowId))
      if (n.shape === 'raute') labels.append(label(n.sideExit === 'nein' ? yes : no, b.x + 6, bottom(i) + 13, n.sideExit === 'nein'))
    }
    if (n.shape !== 'raute') return
    const right = b.x + b.w / 2
    labels.append(label(n.sideExit === 'ja' ? yes : no, right + 5, b.y - 6, n.sideExit === 'ja'))
    if (n.backTo !== undefined) {
      const y = top(n.backTo) - 14
      lines.append(arrow([[right, b.y], [right + 22, b.y], [right + 22, y], [b.x, y]], arrowId))
    } else if (n.side !== undefined) {
      const sb = boxes[n.side]
      const y = top(i) - 14
      lines.append(arrow([[right, b.y], [sb.x - sb.w / 2 - 2, b.y]], arrowId))
      lines.append(arrow([[sb.x, sb.y - sb.h / 2], [sb.x, y], [b.x, y]], arrowId))
    }
  })
  svg.append(lines, labels)

  const placed: (number | undefined)[] = pap.nodes.map(() => undefined)
  const slots: SVGElement[] = []
  const cards: HTMLButtonElement[] = []
  let selected: number | undefined

  const status = h('p', { class: 'learn-pap-status', role: 'status' })
  const explanation = pap.explanation ? h('p', { class: 'learn-explanation' }) : undefined
  if (explanation) {
    explanation.innerHTML = inline(pap.explanation!)
    explanation.hidden = true
  }
  let locked = false

  const clearMarks = () => {
    slots.forEach((g) => g.classList.remove('right', 'wrong'))
    status.textContent = ''
    status.className = 'learn-pap-status'
  }

  const drawSlot = (i: number) => {
    const g = slots[i]
    g.replaceChildren()
    const n = pap.nodes[i]
    const card = placed[i]
    const shape = shapeEl(n.shape, boxes[i])
    shape.setAttribute('class', 'learn-pap-shape')
    if (card === undefined) {
      shape.setAttribute('fill', '#f7f7f9')
      shape.setAttribute('stroke-dasharray', '6 4')
      g.append(shape)
      g.setAttribute('aria-label', t('web_learn_pap_empty'))
    } else {
      const c = pap.nodes[card]
      shape.setAttribute('fill', FILL[c.shape])
      g.append(shape, textEl(c.text, boxes[i], n.shape))
      g.setAttribute('aria-label', c.text)
    }
  }

  const refresh = () => {
    pap.nodes.forEach((_, i) => drawSlot(i))
    cards.forEach((c, i) => {
      c.hidden = placed.includes(i)
      c.classList.toggle('selected', selected === i)
    })
  }

  const place = (slot: number, card: number) => {
    if (locked) return
    const before = placed.indexOf(card)
    if (before >= 0) placed[before] = undefined
    placed[slot] = card
    selected = undefined
    clearMarks()
    refresh()
  }

  pap.nodes.forEach((_, i) => {
    const g = s('g', { class: 'learn-pap-slot', 'data-slot': i, tabindex: 0, role: 'button' })
    const activate = () => {
      if (locked) return
      if (selected !== undefined) place(i, selected)
      else if (placed[i] !== undefined) {
        placed[i] = undefined
        clearMarks()
        refresh()
      }
    }
    g.addEventListener('click', activate)
    g.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key !== 'Enter' && (e as KeyboardEvent).key !== ' ') return
      e.preventDefault()
      activate()
    })
    slots.push(g)
    svg.append(g)
  })

  const tray = h('div', { class: 'learn-pap-tray' })
  let dragged = false
  for (const i of shuffled(pap.nodes.length)) {
    const n = pap.nodes[i]
    const card = h('button', { class: 'learn-pap-card', type: 'button', 'aria-label': n.text }, cardSVG(n.shape, n.text)) as HTMLButtonElement
    cards[i] = card
    card.addEventListener('click', () => {
      if (dragged || locked) return
      selected = selected === i ? undefined : i
      refresh()
    })
    // Ziehen mit Maus, Stift oder Finger.
    card.addEventListener('pointerdown', (down) => {
      if (locked) return
      dragged = false
      let ghost: HTMLElement | undefined
      const move = (e: PointerEvent) => {
        if (!ghost && Math.hypot(e.clientX - down.clientX, e.clientY - down.clientY) < 6) return
        if (!ghost) {
          dragged = true
          ghost = card.cloneNode(true) as HTMLElement
          ghost.classList.add('learn-pap-ghost')
          document.body.append(ghost)
          card.classList.add('dragging')
        }
        ghost.style.left = `${e.clientX}px`
        ghost.style.top = `${e.clientY}px`
        slots.forEach((g) => g.classList.remove('over'))
        target(e)?.classList.add('over')
      }
      const target = (e: PointerEvent) => {
        if (ghost) ghost.style.display = 'none'
        const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-slot]') as SVGElement | null
        if (ghost) ghost.style.display = ''
        return el && slots.includes(el) ? el : undefined
      }
      const up = (e: PointerEvent) => {
        card.removeEventListener('pointermove', move)
        card.removeEventListener('pointerup', up)
        card.removeEventListener('pointercancel', up)
        slots.forEach((g) => g.classList.remove('over'))
        card.classList.remove('dragging')
        if (!ghost) return
        const slot = e.type === 'pointerup' ? target(e) : undefined
        ghost.remove()
        if (slot) place(Number(slot.getAttribute('data-slot')), i)
        // Der Klick nach dem Loslassen soll nichts auswählen.
        setTimeout(() => (dragged = false))
      }
      card.setPointerCapture(down.pointerId)
      card.addEventListener('pointermove', move)
      card.addEventListener('pointerup', up)
      card.addEventListener('pointercancel', up)
    })
    tray.append(card)
  }

  const check = h('button', { class: 'learn-pap-check' }, t('web_learn_check'))
  const solution = h('button', {}, t('web_learn_cloze_solution'))
  const again = h('button', {}, t('web_learn_cloze_again'))
  solution.hidden = true
  again.hidden = true

  const finish = () => {
    locked = true
    check.hidden = true
    solution.hidden = true
    again.hidden = false
    tray.hidden = true
    work.classList.add('done')
    if (explanation) explanation.hidden = false
  }

  check.addEventListener('click', () => {
    const missing = placed.filter((p) => p === undefined).length
    let right = 0
    placed.forEach((card, i) => {
      const ok = card !== undefined && papFits(pap, i, card)
      slots[i].classList.toggle('right', ok)
      slots[i].classList.toggle('wrong', card !== undefined && !ok)
      if (ok) right++
    })
    const all = right === pap.nodes.length
    status.textContent = all
      ? t('web_learn_pap_all_right')
      : missing
        ? t('web_learn_pap_missing_fmt', missing)
        : t('web_learn_pap_score_fmt', right, pap.nodes.length)
    status.className = `learn-pap-status ${all ? 'right' : 'wrong'}`
    if (all) finish()
    else if (!missing) solution.hidden = false
  })
  solution.addEventListener('click', () => {
    pap.nodes.forEach((_, i) => (placed[i] = i))
    selected = undefined
    refresh()
    clearMarks()
    slots.forEach((g) => g.classList.add('shown'))
    finish()
  })
  again.addEventListener('click', () => {
    pap.nodes.forEach((_, i) => (placed[i] = undefined))
    locked = false
    selected = undefined
    slots.forEach((g) => g.classList.remove('shown'))
    clearMarks()
    refresh()
    check.hidden = false
    again.hidden = true
    tray.hidden = false
    work.classList.remove('done')
    if (explanation) explanation.hidden = true
  })

  refresh()
  // Plan links, Bausteine rechts daneben: so sieht man am Laptop beides zugleich.
  const plan = h('div', { class: 'learn-pap-left' })
  plan.append(svg)
  if (pap.legend) plan.append(legend())
  const work = h('div', { class: 'learn-pap-work' }, plan, tray)
  box.append(work, h('div', { class: 'learn-pap-actions' }, check, solution, again), status)
  if (explanation) box.append(explanation)
  return box
}
