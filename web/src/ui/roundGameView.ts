import { inline } from '../learn/markdown'
import { click, clickButton, parseLayoutPicture, parseSwingWindow, startState, type ClickStep, type RoundGame, type SwingWindow } from '../learn/roundGame'
import { t } from './i18n'

/** Rundenspiele „Wer hört zu?“, „Vertrag erfüllt?“ und „Wo landet der Knopf?“ im Lernbereich. */

function h(tag: string, attrs: Record<string, string> = {}, ...children: (Node | string)[]): HTMLElement {
  const e = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v)
  e.append(...children)
  return e
}

function rich(tag: string, attrs: Record<string, string>, markdown: string): HTMLElement {
  const e = h(tag, attrs)
  e.innerHTML = inline(markdown)
  return e
}

const stepDelay = 1100

export function renderRoundGame(game: RoundGame, ludwigURL: string): HTMLElement {
  const box = h('section', { class: `learn-game learn-round-game ${game.kind}` })
  const head = h('div', { class: 'learn-game-head' })
  head.append(h('img', { src: ludwigURL, alt: '', width: '40', height: '40' }), h('strong', {}, game.title))
  const status = h('p', { class: 'learn-game-status' })
  const stage = h('div', { class: 'learn-game-stage' })
  box.append(head, status, stage)
  const total = game.rounds.length
  let index = 0
  let score = 0
  let timers: number[] = []
  const clearTimers = () => {
    timers.forEach((id) => window.clearTimeout(id))
    timers = []
  }
  const showStatus = () => {
    status.textContent = `${t('web_game_round_fmt', index + 1, total)} · ${t('web_game_score_fmt', score)}`
  }

  const showRound = () => {
    clearTimers()
    const round = game.rounds[index]
    showStatus()
    const code = codeView(round.code)
    const parts: HTMLElement[] = []
    let swing: ReturnType<typeof swingView> | undefined
    if (game.kind === 'zuhoerer') {
      swing = swingView(parseSwingWindow(round.code), code)
      parts.push(h('div', { class: 'learn-swing-row' }, code.element, swing.element))
      if (round.clicks.length) parts.push(h('p', { class: 'learn-swing-clicks' }, `${t('web_game_clicks')} `, ...round.clicks.flatMap((c, i) => [...(i ? [' → '] : []), h('code', {}, c)])))
    } else parts.push(code.element)
    parts.push(rich('p', { class: 'learn-game-question' }, round.question))
    const answers = h('div', { class: `learn-game-options ${game.kind === 'layout' ? 'pictures' : ''}` })
    const feedback = h('div', { class: 'learn-game-feedback', role: 'status' })
    const buttons = round.options.map((option) => {
      const b = h('button', {}) as HTMLButtonElement
      if (game.kind === 'layout') b.append(layoutPicture(option.text))
      else b.innerHTML = inline(option.text)
      b.addEventListener('click', () => answer(option.right, b))
      answers.append(b)
      return b
    })
    const answer = (right: boolean, chosen: HTMLButtonElement) => {
      buttons.forEach((b, i) => {
        b.disabled = true
        if (round.options[i].right) b.classList.add('right')
      })
      if (!right) chosen.classList.add('wrong')
      if (right) score++
      showStatus()
      feedback.className = `learn-game-feedback ${right ? 'right' : 'wrong'}`
      const next = h('button', { class: 'primary' }, index + 1 < total ? t('web_game_next') : t('web_game_finish'))
      next.addEventListener('click', () => {
        index++
        if (index < total) showRound()
        else showEnd()
      })
      feedback.replaceChildren(h('p', {}, right ? t('web_game_right') : t('web_game_wrong_short')), rich('div', { class: 'learn-game-explain' }, round.explanation))
      feedback.append(next)
      if (swing) timers = swing.replay(round.clicks, () => next.before(h('p', { class: 'learn-swing-try' }, t('web_game_try'))))
      next.focus({ preventScroll: true })
    }
    stage.replaceChildren(...parts, answers, feedback)
  }

  const showEnd = () => {
    clearTimers()
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

function codeView(code: string) {
  const lines = code.split('\n').map((line) => h('div', { class: 'ln' }, line || ' '))
  const element = h('pre', { class: 'learn-game-code mono', dir: 'ltr' }, ...lines)
  return {
    element,
    highlight(from?: number, to?: number) {
      lines.forEach((l, i) => l.classList.toggle('hit', from !== undefined && i >= from && i <= (to ?? from)))
    },
  }
}

/** Nachgebautes Fenster mit Knöpfen und Beschriftungen; spielt Klicks ab. */
function swingView(win: SwingWindow, code: ReturnType<typeof codeView>) {
  const state = startState(win)
  const element = h('div', { class: 'learn-swing-window', dir: 'ltr' })
  element.append(h('div', { class: 'learn-swing-title' }, win.title || ' '))
  const body = h('div', { class: 'learn-swing-body' })
  const views = new Map<string, HTMLElement>()
  for (const l of win.labels) {
    const v = h('div', { class: 'learn-swing-label' }, state.texts[l.name])
    views.set(l.name, v)
    body.append(v)
  }
  const buttons = win.buttons.map((b) => {
    const v = h('button', { class: 'learn-swing-button', disabled: '' }, state.texts[b.name]) as HTMLButtonElement
    views.set(b.name, v)
    body.append(v)
    return v
  })
  const event = h('p', { class: 'learn-swing-event', role: 'status' })
  const consoleBox = h('pre', { class: 'learn-swing-console mono', hidden: '' })
  element.append(body, event, consoleBox)

  const show = (step: ClickStep) => {
    const view = views.get(step.button)!
    view.classList.add('pressed')
    window.setTimeout(() => view.classList.remove('pressed'), 350)
    code.highlight(step.listener?.from, step.listener?.to)
    event.textContent = step.listener ? t('web_game_event_fmt', view.textContent ?? '') : t('web_game_nobody')
    event.className = `learn-swing-event ${step.listener ? 'heard' : 'nobody'}`
    for (const [name, text] of Object.entries(step.texts)) {
      const v = views.get(name)
      if (v && v.textContent !== text) {
        v.textContent = text
        v.classList.remove('changed')
        void v.offsetWidth // Animation neu starten
        v.classList.add('changed')
      }
    }
    if (step.console.length) {
      consoleBox.hidden = false
      consoleBox.textContent += step.console.map((l) => `${l}\n`).join('')
    }
  }
  const press = (caption: string) => show(click(win, state, caption))

  return {
    element,
    /** Die Klicks der Runde nacheinander abspielen, danach die Knöpfe zum Ausprobieren freigeben. */
    replay(clicks: string[], done: () => void): number[] {
      const ids = clicks.map((c, i) => window.setTimeout(() => press(c), (i + 0.3) * stepDelay))
      ids.push(
        window.setTimeout(() => {
          win.buttons.forEach((b, i) => {
            buttons[i].disabled = false
            buttons[i].addEventListener('click', () => show(clickButton(win, state, b.name)))
          })
          done()
        }, (clicks.length + 0.3) * stepDelay),
      )
      return ids
    },
  }
}

/** Kleines Fenster als Antwort: GridLayout, FlowLayout oder BorderLayout. */
function layoutPicture(text: string): HTMLElement {
  const pic = parseLayoutPicture(text)
  const frame = h('div', { class: 'learn-layout-window', dir: 'ltr' }, h('div', { class: 'learn-layout-title' }))
  const body = h('div', { class: `learn-layout-body ${pic.kind}` })
  const cell = (name: string, area?: string) => h('span', { class: 'learn-layout-cell', ...(area ? { style: `grid-area:${area}` } : {}) }, name)
  if (pic.kind === 'border') {
    for (const [area, name] of Object.entries(pic.areas)) body.append(cell(name!, area))
  } else if (pic.kind === 'grid') {
    const cols = Math.max(...pic.rows.map((r) => r.length))
    body.style.gridTemplateColumns = `repeat(${cols}, 1fr)`
    for (const row of pic.rows) for (let i = 0; i < cols; i++) body.append(row[i] ? cell(row[i]) : h('span', {}))
  } else {
    for (const row of pic.rows) body.append(h('div', { class: 'learn-layout-row' }, ...row.map((n) => cell(n))))
  }
  frame.append(body)
  return frame
}

