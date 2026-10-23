import { t } from './i18n'

/** Digitale Caesar-Scheibe im Lernbereich: innere Scheibe drehen, Text live ver- und entschlüsseln. */

const letters = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
const step = 360 / letters.length
const svgNS = 'http://www.w3.org/2000/svg'

function h(tag: string, attrs: Record<string, string> = {}, ...children: (Node | string)[]): HTMLElement {
  const e = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v)
  e.append(...children)
  return e
}

function s(tag: string, attrs: Record<string, string | number> = {}, text?: string): SVGElement {
  const e = document.createElementNS(svgNS, tag)
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v))
  if (text !== undefined) e.textContent = text
  return e
}

/** Verschiebt Buchstaben A–Z (groß und klein) um `key` Stellen, alles andere bleibt. */
export function caesar(text: string, key: number): string {
  const k = ((key % 26) + 26) % 26
  return Array.from(text)
    .map((c) => {
      const code = c.charCodeAt(0)
      if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + k) % 26) + 65)
      if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + k) % 26) + 97)
      return c
    })
    .join('')
}

/** Ein Ring mit 26 Buchstaben auf dem Radius `r`, Buchstabe 0 oben. */
function ring(r: number, cls: string): { group: SVGElement; cells: SVGElement[] } {
  const group = s('g', { class: cls })
  const cells = letters.map((letter, i) => {
    const cell = s('g', { transform: `rotate(${i * step})` })
    cell.append(s('text', { x: 0, y: -r, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, letter))
    group.append(cell)
    return cell
  })
  return { group, cells }
}

export function renderCaesarDisc(startKey: number, startText: string): HTMLElement {
  let key = startKey
  let decrypt = false
  let rotation = -key * step

  const box = h('section', { class: 'learn-game learn-caesar' })
  box.append(h('div', { class: 'learn-game-head' }, h('strong', {}, t('web_learn_caesar_title'))))
  box.append(h('p', { class: 'learn-game-status' }, t('web_learn_caesar_hint')))

  const svg = s('svg', { viewBox: '-200 -200 400 400', class: 'learn-caesar-disc', role: 'img' }) as SVGSVGElement
  svg.append(s('circle', { r: 196, class: 'outer-disc' }))
  // Sichtfenster oben: Dieses Buchstabenpaar gehört zusammen
  svg.append(s('path', { d: arcWedge(196, 92, step / 2), class: 'window' }))
  const outer = ring(168, 'outer-letters')
  svg.append(outer.group)
  for (let i = 0; i < letters.length; i++) {
    svg.append(s('line', { x1: 0, y1: -144, x2: 0, y2: -196, transform: `rotate(${(i + 0.5) * step})`, class: 'tick' }))
  }
  const inner = s('g', { class: 'inner' })
  inner.append(s('circle', { r: 142, class: 'inner-disc' }))
  const innerRing = ring(118, 'inner-letters')
  inner.append(innerRing.group)
  for (let i = 0; i < letters.length; i++) {
    inner.append(s('line', { x1: 0, y1: -94, x2: 0, y2: -142, transform: `rotate(${(i + 0.5) * step})`, class: 'tick' }))
  }
  inner.append(s('circle', { r: 94, class: 'hub' }))
  svg.append(inner)
  const keyText = s('text', { x: 0, y: 6, 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'key' })
  svg.append(keyText)
  svg.append(s('text', { x: 0, y: -30, 'text-anchor': 'middle', class: 'key-label' }, 'k'))

  const minus = h('button', { type: 'button', 'aria-label': t('web_learn_caesar_back') }, '−1')
  const plus = h('button', { type: 'button', 'aria-label': t('web_learn_caesar_forward') }, '+1')
  const controls = h('div', { class: 'learn-caesar-controls' }, minus, plus)

  const mode = h('div', { class: 'learn-caesar-mode', role: 'group' })
  const encButton = h('button', { type: 'button' }, t('web_learn_caesar_encrypt'))
  const decButton = h('button', { type: 'button' }, t('web_learn_caesar_decrypt'))
  mode.append(encButton, decButton)

  const inputLabel = h('span')
  const input = h('input', { type: 'text', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false' }) as HTMLInputElement
  input.value = startText || 'LUDWIG'
  const outputLabel = h('span')
  const output = h('output', { class: 'learn-caesar-output' })
  const fields = h('div', { class: 'learn-caesar-fields' }, h('label', {}, inputLabel, input), h('div', {}, outputLabel, output))

  box.append(h('div', { class: 'learn-caesar-stage' }, svg, controls), mode, fields)

  const mark = (index?: number) => {
    outer.cells.forEach((c, i) => c.classList.toggle('marked', i === index))
    innerRing.cells.forEach((c, i) => c.classList.toggle('marked', index !== undefined && i === (index + key) % 26))
  }

  const update = () => {
    keyText.textContent = String(key)
    inner.setAttribute('transform', `rotate(${rotation})`)
    svg.setAttribute('aria-label', t('web_learn_caesar_key_fmt', key))
    inputLabel.textContent = t(decrypt ? 'web_learn_caesar_secret' : 'web_learn_caesar_plain')
    outputLabel.textContent = t(decrypt ? 'web_learn_caesar_plain' : 'web_learn_caesar_secret')
    encButton.classList.toggle('active', !decrypt)
    decButton.classList.toggle('active', decrypt)
    output.textContent = caesar(input.value, decrypt ? -key : key) || ' '
    // Das zuletzt getippte Zeichen auf der Scheibe zeigen: außen Klartext, innen Geheimtext
    const last = Array.from(input.value.toUpperCase()).reverse().find((c) => letters.includes(c))
    if (last === undefined) return mark()
    const index = letters.indexOf(last)
    mark(decrypt ? (index - key + 26) % 26 : index)
  }

  const setKey = (k: number) => {
    key = ((k % 26) + 26) % 26
    rotation = -key * step
    update()
  }

  minus.addEventListener('click', () => setKey(key - 1))
  plus.addEventListener('click', () => setKey(key + 1))
  encButton.addEventListener('click', () => {
    if (decrypt) input.value = output.textContent?.trim() ?? ''
    decrypt = false
    update()
  })
  decButton.addEventListener('click', () => {
    if (!decrypt) input.value = output.textContent?.trim() ?? ''
    decrypt = true
    update()
  })
  input.addEventListener('input', update)
  outer.cells.forEach((cell, i) => cell.addEventListener('click', () => mark(i)))

  // Innere Scheibe mit Maus oder Finger drehen, beim Loslassen rastet sie auf einem Buchstaben ein
  let dragFrom: number | undefined
  const angleAt = (e: PointerEvent) => {
    const r = svg.getBoundingClientRect()
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI
  }
  inner.addEventListener('pointerdown', (e) => {
    const pe = e as PointerEvent
    dragFrom = angleAt(pe) - rotation
    inner.classList.add('dragging')
    svg.setPointerCapture(pe.pointerId)
    pe.preventDefault()
  })
  svg.addEventListener('pointermove', (e) => {
    if (dragFrom === undefined) return
    rotation = angleAt(e) - dragFrom
    inner.setAttribute('transform', `rotate(${rotation})`)
    const k = Math.round(-rotation / step)
    if (((k % 26) + 26) % 26 !== key) {
      key = ((k % 26) + 26) % 26
      const keep = rotation
      update()
      rotation = keep
      inner.setAttribute('transform', `rotate(${rotation})`)
    }
  })
  const release = () => {
    if (dragFrom === undefined) return
    dragFrom = undefined
    inner.classList.remove('dragging')
    setKey(key)
  }
  svg.addEventListener('pointerup', release)
  svg.addEventListener('pointercancel', release)

  update()
  return box
}

/** Keil um die obere Mitte, von Radius `r1` bis `r2`, halbe Breite `half` Grad. */
function arcWedge(r1: number, r2: number, half: number): string {
  const p = (r: number, a: number) => {
    const rad = ((a - 90) * Math.PI) / 180
    return `${(r * Math.cos(rad)).toFixed(2)} ${(r * Math.sin(rad)).toFixed(2)}`
  }
  return `M ${p(r1, -half)} A ${r1} ${r1} 0 0 1 ${p(r1, half)} L ${p(r2, half)} A ${r2} ${r2} 0 0 0 ${p(r2, -half)} Z`
}
