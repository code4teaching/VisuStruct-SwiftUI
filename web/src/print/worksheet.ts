/**
 * Arbeitsblätter zum Ausdrucken und Einlaminieren (VisuBot Kids): eine Lektion oder Aufgabe als A4-Seite(n).
 * Aufruf: `arbeitsblatt.html?stufe=34&lektion=03-wiederhole` oder `…&aufgabe=kids-alarm`.
 * PDFs baut `node scripts/arbeitsblaetter.mjs` (Dev-Server + Playwright).
 */
import '../ui/styles.css'
import './worksheet.css'
import { parseLiveJava } from '../core/javaParser'
import { documentFromJava } from '../core/liveSource'
import type { VSDocument } from '../core/model'
import { decodeDocument } from '../core/xmlCodec'
import type { DriveRound } from '../learn/driveGame'
import { parseLesson, parseTask, type Block, type Step } from '../learn/lessonFormat'
import { inline, markdownToHTML } from '../learn/markdown'
import { blockViewLabels } from '../ui/blockPicture'
import { BlockView } from '../ui/blockView'
import { setLanguage } from '../ui/i18n'
import ludwigURL from '../ui/ludwig-kids.webp'

const lessonFiles = import.meta.glob('../../lessons/de/visubot/{bloecke,bloecke34}/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const taskFiles = import.meta.glob('../../lessons/de/visubot/{bloecke,bloecke34}/aufgaben/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const diagrams = import.meta.glob('../../lessons/diagramme/vb[bk]-*.visustruct', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const labels = { condition: 'Bedingung', selector: 'Wert', code: 'Dein Code', start: 'Startwert', step: 'Schritt', end: 'Ende' }

function blocksOf(doc: VSDocument): HTMLElement {
  const view = new BlockView({ press: () => {}, editValue: () => {}, labels: { ...blockViewLabels(), hint: '' } })
  view.render(doc, undefined, true)
  view.element.hidden = false
  view.element.classList.add('bk-picture')
  const box = document.createElement('div')
  box.className = 'ws-blocks'
  box.append(view.element)
  return box
}

function blocksFromJava(java: string): HTMLElement | undefined {
  const parsed = parseLiveJava(java, labels as never)
  if (parsed.problems.length > 0 || parsed.elements.length === 0) return undefined
  return blocksOf(documentFromJava({ caption: '', elements: [] }, parsed))
}

function el(tag: string, cls: string, html = ''): HTMLElement {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (html) e.innerHTML = html
  return e
}

/** Karte von „Wo landet der mBot2?“: Felder zum Ankreuzen mit dem Folienstift. */
function driveMap(round: DriveRound): HTMLElement {
  const grid = el('div', 'ws-map')
  const cols = Math.max(...round.map.map((r) => r.length))
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`
  for (const row of round.map) {
    for (const ch of row.padEnd(cols, '.')) {
      const cell = el('div', 'ws-cell' + (ch === '#' ? ' wall' : ''))
      if ('^>v<'.includes(ch)) cell.innerHTML = `<span class="ws-robot" style="transform: rotate(${'^>v<'.indexOf(ch) * 90}deg)">▲</span>`
      grid.append(cell)
    }
  }
  return grid
}

let exerciseNo = 0

function renderBlock(block: Block): HTMLElement | undefined {
  switch (block.kind) {
    case 'markdown':
      return el('div', 'ws-text', markdownToHTML(block.text))
    case 'blockPicture': {
      const fig = el('figure', 'ws-figure')
      const pic = blocksFromJava(block.java)
      if (pic) fig.append(pic)
      if (block.caption) fig.append(el('figcaption', '', inline(block.caption)))
      return fig
    }
    case 'competences':
      return el('div', 'ws-goal', `<ul>${block.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`)
    case 'exercise': {
      const ex = block.exercise
      exerciseNo++
      const box = el('section', 'ws-exercise')
      box.append(el('h3', '', `<span class="ws-num">${exerciseNo}</span> ${inline(ex.title)}<span class="ws-done">geschafft ☐</span>`))
      box.append(el('p', 'ws-task', inline(ex.task)))
      if (ex.start) {
        const src = diagrams[`../../lessons/diagramme/${ex.start}`]
        if (src) {
          const fig = el('figure', 'ws-figure small')
          fig.append(blocksOf(decodeDocument(src)))
          fig.append(el('figcaption', '', 'So fängt es an. Das liegt schon in der App.'))
          box.append(fig)
        }
      }
      if (ex.hints.length) {
        box.append(el('div', 'ws-hints', ex.hints.map((h, i) => `<p><strong>Tipp ${i + 1}:</strong> ${inline(h)}</p>`).join('')))
      }
      return box
    }
    case 'brag':
      return el('aside', 'ws-ludwig', `<img src="${ludwigURL}" alt=""><div>${markdownToHTML(block.text)}</div>`)
    case 'driveGame': {
      const box = el('section', 'ws-game')
      box.append(el('h3', '', '🎲 ' + inline(block.game.title)))
      box.append(el('p', '', inline(block.game.intro) + ' Mal das Feld mit dem Stift an.'))
      const rounds = el('div', 'ws-rounds')
      block.game.rounds.forEach((r, i) => {
        const round = el('div', 'ws-round')
        round.append(el('div', 'ws-round-no', `Runde ${i + 1}`))
        const pic = blocksFromJava(r.code)
        if (pic) round.append(pic)
        round.append(driveMap(r))
        rounds.append(round)
      })
      box.append(rounds)
      return box
    }
    case 'roundGame': {
      const box = el('section', 'ws-game')
      box.append(el('h3', '', '🎲 ' + inline(block.game.title)))
      if (block.game.intro) box.append(el('p', '', inline(block.game.intro) + ' Kreuz die richtige Antwort an.'))
      const rounds = el('div', 'ws-rounds')
      block.game.rounds.forEach((r, i) => {
        const round = el('div', 'ws-round')
        round.append(el('div', 'ws-round-no', `Runde ${i + 1}`))
        const pic = r.code ? blocksFromJava(r.code) : undefined
        if (pic) round.append(pic)
        if (r.question) round.append(el('p', 'ws-question', inline(r.question)))
        round.append(el('ul', 'ws-options', r.options.map((o) => `<li>☐ ${inline(o.text)}</li>`).join('')))
        rounds.append(round)
      })
      box.append(rounds)
      return box
    }
    case 'checklist':
      return el(
        'table',
        'ws-check',
        `<tr><th></th><th>☂️</th><th>⛅</th><th>☀️</th></tr>` +
          block.items.map((i) => `<tr><td>${inline(i.text)}</td><td>○</td><td>○</td><td>○</td></tr>`).join(''),
      )
    default:
      return undefined
  }
}

function renderSteps(root: HTMLElement, steps: Step[]) {
  for (const step of steps) {
    const sec = el('section', 'ws-step')
    const isCheck = step.blocks.some((b) => b.kind === 'checklist')
    sec.append(el('h2', '', inline(step.title)))
    for (const b of step.blocks) {
      // Hinweis auf „Nachlesen“ gibt es nur in der App.
      if (isCheck && b.kind === 'markdown') {
        sec.append(el('p', 'ws-text', 'Wie gut klappt es? Mal einen Kreis aus: ☂️ noch nicht, ⛅ ein bisschen, ☀️ prima.'))
        continue
      }
      const out = renderBlock(b)
      if (out) sec.append(out)
    }
    if (sec.childElementCount > 1) root.append(sec)
  }
}

async function main() {
  await setLanguage('de', false)
  const q = new URLSearchParams(location.search)
  const level = q.get('stufe') === '57' ? '57' : '34'
  const folder = level === '34' ? 'bloecke34' : 'bloecke'
  const levelName = level === '34' ? 'Klasse 3–4' : 'Klasse 5–7'
  const root = document.getElementById('sheet')!
  const head = el('header', 'ws-head')
  const lessonId = q.get('lektion')
  const taskId = q.get('aufgabe')
  if (lessonId) {
    const src = lessonFiles[`../../lessons/de/visubot/${folder}/${lessonId}.md`]
    const lesson = parseLesson(src, `de/${lessonId}.md`)
    head.innerHTML = `<div class="ws-brand">VisuBot Kids · ${levelName}</div><h1><span class="ws-lno">${q.get('nr') ?? lesson.number}</span> ${inline(lesson.title)}</h1><p>${inline(lesson.summary)}</p>`
    root.append(head)
    renderSteps(root, lesson.steps)
  } else if (taskId) {
    const src = taskFiles[`../../lessons/de/visubot/${folder}/aufgaben/${taskId}.md`]
    const task = parseTask(src, `de/${taskId}.md`)
    head.innerHTML = `<div class="ws-brand">VisuBot Kids · ${levelName} · Aufgabe${task.after ? ` nach Lektion ${task.after}` : ''}</div><h1>⭐ ${inline(task.title)}</h1>`
    root.append(head)
    const sec = el('section', 'ws-step')
    for (const b of task.blocks) {
      const out = renderBlock(b)
      if (out) sec.append(out)
    }
    root.append(sec)
  }
  root.append(el('footer', 'ws-foot', 'Löse die Aufgaben in der App: <strong>visubotkids.visucode.de</strong>'))
  document.body.dataset.ready = '1'
}

void main()

/** Liste für das PDF-Skript. */
;(window as unknown as { worksheetList: unknown }).worksheetList = {
  lessons: Object.keys(lessonFiles).map((k) => k.replace('../../lessons/de/visubot/', '').replace('.md', '')),
  tasks: Object.keys(taskFiles).map((k) => k.replace('../../lessons/de/visubot/', '').replace('.md', '')),
}
