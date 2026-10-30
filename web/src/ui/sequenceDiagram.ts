/**
 * VisuObject: Sequenzdiagramm aus dem Ablauf des Debuggers. Jedes Objekt (bzw. jede Klasse bei
 * static) hat eine Lebenslinie; Aufrufe sind Pfeile mit gefüllter Spitze, Rückgaben gestrichelt,
 * `new` ein gestrichelter «create»-Pfeil zum Kasten, der erst dort beginnt. Aktivierungsbalken
 * zeigen, solange eine Methode läuft.
 */

import type { SeqEvent, SeqParticipant } from '../core/miniJava'

const e = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

const colW = 180
const left = 30
const top = 12
const headH = 30
const rowH = 34
const barW = 10

export interface SequenceData {
  participants: SeqParticipant[]
  events: SeqEvent[]
  truncated: boolean
}

/** Etwa die Breite eines Texts in 12px-Schrift (für Kästen und Schleifen). */
const textWidth = (s: string) => s.length * 7 + 16

/** Diagramm als SVG; `current` = Nummer des zuletzt ausgeführten Ereignisses (gelb). */
export function sequenceSVG(data: SequenceData, current?: number): { svg: string; width: number; height: number } {
  const index = new Map(data.participants.map((p, i) => [p.key, i]))
  const cx = (key: string) => left + (index.get(key) ?? 0) * colW + colW / 2
  const created = new Map<string, number>()
  const parts: string[] = []
  const bars: string[] = []
  const heads: string[] = []
  // Offene Aktivierungen: Teilnehmer, Aufrufer, Beginn, Ebene (verschachtelt auf derselben Linie).
  const open: { key: string; caller: string; y: number; level: number }[] = []
  const mainKey = data.participants[0]?.isStatic ? data.participants[0].key : ''
  // Ebene der Aktivierung; main hat seinen Balken von Anfang an.
  const level = (key: string) => open.filter((a) => a.key === key).length + (key === mainKey ? 1 : 0)
  const barX = (key: string, lv: number) => cx(key) - barW / 2 + Math.max(0, lv - 1) * 6
  let y = top + headH + 24
  data.events.forEach((ev, i) => {
    const on = i === current ? ' current' : ''
    if (ev.k === 'return') {
      const a = open.pop()
      if (!a) return
      if (ev.hidden) {
        bars.push(`<rect class="vo-seq-bar" x="${barX(a.key, a.level)}" y="${a.y}" width="${barW}" height="${Math.max(8, y - 10 - a.y)}"/>`)
        return
      }
      const from = barX(a.key, a.level)
      const toLevel = level(a.caller)
      const toX = a.caller === a.key ? barX(a.caller, toLevel) + barW : toLevel ? barX(a.caller, toLevel) + (cx(a.caller) < cx(a.key) ? barW : 0) : cx(a.caller)
      const x1 = cx(a.caller) < cx(a.key) ? from : from + barW
      bars.push(`<rect class="vo-seq-bar" x="${from}" y="${a.y}" width="${barW}" height="${Math.max(8, y - a.y)}"/>`)
      if (a.caller !== a.key)
        parts.push(
          `<g class="vo-seq-msg return${ev.label === '⚡' ? ' exception' : ''}${on}" data-ev="${i}"><line x1="${x1}" y1="${y}" x2="${toX}" y2="${y}"/>${arrowOpen(toX, y, toX < x1 ? -1 : 1)}${ev.label ? `<text x="${(x1 + toX) / 2}" y="${y - 6}" text-anchor="middle">${e(ev.label)}</text>` : ''}</g>`,
        )
      y += rowH
      return
    }
    const fromLevel = level(ev.from)
    const self = ev.from === ev.to
    // Neuer Kasten braucht Platz: Pfeil in seine Mitte, darüber Luft für die Beschriftung.
    if (ev.k === 'create') {
      y += headH / 2 + 8
      created.set(ev.to, y)
    }
    const toLevel = level(ev.to) + 1
    const fx = fromLevel ? barX(ev.from, fromLevel) + (cx(ev.to) >= cx(ev.from) ? barW : 0) : cx(ev.from)
    if (self) {
      const x = fx
      const bx = barX(ev.to, toLevel) + barW
      parts.push(
        `<g class="vo-seq-msg${on}" data-ev="${i}"><path d="M${x} ${y - 10} H${x + 34} V${y + 4} H${bx}" fill="none"/>${arrowFilled(bx, y + 4, -1)}<text x="${x + 40}" y="${y - 4}">${e(ev.label)}</text></g>`,
      )
      open.push({ key: ev.to, caller: ev.from, y: y + 4 - 6, level: toLevel })
      y += rowH
      return
    }
    const right = cx(ev.to) > cx(ev.from)
    const tx = ev.k === 'create' ? cx(ev.to) + (right ? -textWidth(labelOf(data, ev.to)) / 2 : textWidth(labelOf(data, ev.to)) / 2) : barX(ev.to, toLevel) + (right ? 0 : barW)
    const cls = ev.k === 'create' ? ' create' : ''
    const label = ev.k === 'create' ? `«create» ${ev.label}` : ev.label
    parts.push(
      `<g class="vo-seq-msg${cls}${on}" data-ev="${i}"><line x1="${fx}" y1="${y}" x2="${tx}" y2="${y}"/>${ev.k === 'create' ? arrowOpen(tx, y, right ? 1 : -1) : arrowFilled(tx, y, right ? 1 : -1)}${ev.k === 'create' ? `<text x="${right ? fx + 8 : fx - 8}" y="${y - headH / 2 - 2}" text-anchor="${right ? 'start' : 'end'}">${e(label)}</text>` : `<text x="${(fx + tx) / 2}" y="${y - 6}" text-anchor="middle">${e(label)}</text>`}</g>`,
    )
    open.push({ key: ev.to, caller: ev.from, y: ev.k === 'create' ? y + headH / 2 : y, level: toLevel })
    y += ev.k === 'create' ? rowH + headH / 2 : rowH
  })
  // Noch laufende Methoden (angehalten): Balken bis unten.
  for (const a of open) bars.push(`<rect class="vo-seq-bar running" x="${barX(a.key, a.level)}" y="${a.y}" width="${barW}" height="${Math.max(8, y - a.y)}"/>`)
  const bottom = y + 10
  // main läuft die ganze Zeit: Balken auf der ersten Lebenslinie.
  const main = data.participants[0]
  if (main?.isStatic) bars.unshift(`<rect class="vo-seq-bar" x="${cx(main.key) - barW / 2}" y="${top + headH + 8}" width="${barW}" height="${bottom - top - headH - 18}"/>`)
  for (const p of data.participants) {
    const x = cx(p.key)
    const head = created.get(p.key)
    const hy = head !== undefined ? head - headH / 2 : top
    const w = Math.min(colW - 12, textWidth(p.label))
    heads.push(
      `<g class="vo-seq-head${p.isStatic ? ' static' : ''}"><line class="vo-seq-life" x1="${x}" y1="${hy + headH}" x2="${x}" y2="${bottom}"/><rect x="${x - w / 2}" y="${hy}" width="${w}" height="${headH}"/><text x="${x}" y="${hy + headH / 2}" text-anchor="middle" dominant-baseline="central">${e(p.label)}</text></g>`,
    )
  }
  const width = left * 2 + data.participants.length * colW
  const height = bottom + 20
  return { svg: `${heads.join('')}${bars.join('')}${parts.join('')}`, width, height }
}

function labelOf(data: SequenceData, key: string) {
  return data.participants.find((p) => p.key === key)?.label ?? ''
}

function arrowFilled(x: number, y: number, dir: number) {
  return `<path class="head filled" d="M${x} ${y} L${x - dir * 9} ${y - 4.5} L${x - dir * 9} ${y + 4.5} Z"/>`
}

function arrowOpen(x: number, y: number, dir: number) {
  return `<path class="head" d="M${x - dir * 9} ${y - 4.5} L${x} ${y} L${x - dir * 9} ${y + 4.5}" fill="none"/>`
}
