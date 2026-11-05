import { blockPicture } from './blockPicture'
import { inline } from '../learn/markdown'
import { driveRound, driveWorld, type DriveGame } from '../learn/driveGame'
import type { Pose } from '../core/robotWorld'
import { t } from './i18n'

/** Spiel „Wo landet der mBot2?“: Code lesen, Zielfeld antippen, dann fährt der mBot2 die Strecke auf der Karte vor. */

const SVG = 'http://www.w3.org/2000/svg'

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

function rich(tag: string, attrs: Record<string, string>, markdown: string): HTMLElement {
  const e = h(tag, attrs)
  e.innerHTML = inline(markdown)
  return e
}

const FIELD_FILL: Record<string, string> = { '#': '#6b7280', '=': '#111827', r: '#ef4444', g: '#22c55e', b: '#3b82f6', y: '#facc15' }
/** Millisekunden je Bild der Fahrt. */
const frameMs = 450

/** `asBlocks`: Code der Runde als Blöcke zeigen (Block-Lektionen für Jüngere), sonst als Java. */
export function renderDriveGame(game: DriveGame, ludwigURL: string, asBlocks = false): HTMLElement {
  const box = h('section', { class: 'learn-game learn-round-game learn-drive-game' })
  const head = h('div', { class: 'learn-game-head' })
  head.append(h('img', { src: ludwigURL, alt: '', width: '40', height: '40' }), h('strong', {}, game.title))
  const status = h('p', { class: 'learn-game-status' })
  const stage = h('div', { class: 'learn-game-stage' })
  box.append(head, status, stage)
  const total = game.rounds.length
  const F = game.field
  let index = 0
  let score = 0
  let timer = 0
  const showStatus = () => {
    status.textContent = `${t('web_game_round_fmt', index + 1, total)} · ${t('web_game_score_fmt', score)}`
  }
  const next = () => {
    const b = h('button', { class: 'primary' }, index + 1 < total ? t('web_game_next') : t('web_game_finish'))
    b.addEventListener('click', () => {
      index++
      if (index < total) showRound()
      else showEnd()
    })
    return b
  }

  const showRound = () => {
    window.clearInterval(timer)
    showStatus()
    const round = game.rounds[index]
    const cols = round.map[0].length
    const rows = round.map.length
    const width = cols * F
    const depth = rows * F
    // Weltkoordinaten (Mitte 0,0, y nach hinten) → SVG (oben links 0,0, y nach unten)
    const sx = (x: number) => x + width / 2
    const sy = (y: number) => depth / 2 - y
    const world = driveWorld(round, F)
    const result = driveRound(round, F)
    const svg = s('svg', { viewBox: `-2 -2 ${width + 4} ${depth + 4}`, class: 'learn-drive-map', role: 'group', 'aria-label': round.question })
    const cells: SVGElement[][] = []
    round.map.forEach((line, r) => {
      cells.push([])
      Array.from(line).forEach((ch, c) => {
        const cell = s('rect', { x: c * F, y: r * F, width: F, height: F, class: 'cell', fill: FIELD_FILL[ch] ?? '#ffffff', tabindex: 0, role: 'button', 'aria-label': `${c + 1}, ${r + 1}` })
        const pick = () => choose(c, r)
        cell.addEventListener('click', pick)
        cell.addEventListener('keydown', (e) => {
          if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
            e.preventDefault()
            pick()
          }
        })
        svg.append(cell)
        cells[r].push(cell)
      })
    })
    const trail = s('polyline', { class: 'trail', points: '', fill: 'none' })
    const robot = s('g', { class: 'robot' })
    const body = Math.min(F * 0.7, 20)
    robot.append(
      s('rect', { x: -body / 2, y: -body / 2, width: body, height: body, rx: body / 5, class: 'body' }),
      s('path', { d: `M ${-body / 3} ${body / 6} L 0 ${-body / 2.4} L ${body / 3} ${body / 6} Z`, class: 'nose' }),
    )
    // Kurs ohne Sprung von 359° auf 0°, damit die Drehung den kurzen Weg nimmt
    let heading = world.start.heading
    const place = (pose: Pose) => {
      heading += ((((pose.heading - heading) % 360) + 540) % 360) - 180
      robot.style.transform = `translate(${sx(pose.x)}px, ${sy(pose.y)}px) rotate(${heading}deg)`
    }
    place(world.start)
    svg.append(trail, robot)
    const feedback = h('div', { class: 'learn-game-feedback', role: 'status' })
    const code =
      (asBlocks && blockPicture(round.code)) ||
      h('pre', { class: 'learn-game-code mono', dir: 'ltr' }, ...round.code.split('\n').map((l) => h('div', { class: 'ln' }, l || ' ')))
    let chosen = false
    const choose = (c: number, r: number) => {
      if (chosen) return
      chosen = true
      svg.classList.add('done')
      const right = c === round.target.col && r === round.target.row
      cells[r][c].classList.add(right ? 'right' : 'wrong')
      if (right) score++
      showStatus()
      // Jetzt fährt der mBot2 vor; danach leuchtet das richtige Feld.
      const frames = result.run.frames
      let f = 0
      const points: string[] = [`${sx(world.start.x)},${sy(world.start.y)}`]
      const step = () => {
        f++
        if (f >= frames.length) {
          window.clearInterval(timer)
          cells[round.target.row][round.target.col].classList.add('right')
          const n = next()
          feedback.className = `learn-game-feedback ${right ? 'right' : 'wrong'}`
          feedback.replaceChildren(h('p', {}, right ? t('web_game_right') : t('web_game_wrong_short')), rich('div', { class: 'learn-game-explain' }, round.explanation), n)
          n.focus({ preventScroll: true })
          return
        }
        const pose = frames[f].pose
        place(pose)
        points.push(`${sx(pose.x)},${sy(pose.y)}`)
        trail.setAttribute('points', points.join(' '))
      }
      timer = window.setInterval(() => {
        if (!box.isConnected) return window.clearInterval(timer)
        step()
      }, frameMs)
    }
    stage.replaceChildren(code, rich('p', { class: 'learn-game-question' }, round.question), svg, feedback)
  }

  const showEnd = () => {
    window.clearInterval(timer)
    status.textContent = ''
    const again = h('button', { class: 'primary' }, t('web_game_again'))
    again.addEventListener('click', () => {
      index = score = 0
      showRound()
    })
    stage.replaceChildren(
      h('p', { class: 'learn-game-result' }, t('web_game_done_fmt', score, total)),
      h('p', {}, t(score === total ? 'web_game_perfect' : score >= total * 0.7 ? 'web_game_good' : 'web_game_practice_short')),
      again,
    )
  }
  const start = h('button', { class: 'primary' }, t('web_game_start'))
  start.addEventListener('click', showRound)
  stage.append(rich('p', {}, game.intro), start)
  return box
}
