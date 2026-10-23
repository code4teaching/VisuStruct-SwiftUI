import { inline } from '../learn/markdown'
import { crosswordGrid, gatePlaceholder, type RescueGame } from '../learn/rescueGame'
import { t } from './i18n'

/** Spiel „Prinzessin retten“: Stationen mit Zahlen, Kreuzworträtsel und das Tor mit dem geheimen Wort. */

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

function codeBlock(code: string): HTMLElement {
  return h('pre', { class: 'learn-game-code mono', dir: 'ltr' }, ...code.split('\n').map((line) => h('div', { class: 'ln' }, line || ' ')))
}

export function renderRescueGame(game: RescueGame, ludwigURL: string): HTMLElement {
  const box = h('section', { class: 'learn-game learn-rescue' })
  const head = h('div', { class: 'learn-game-head' })
  head.append(h('img', { src: ludwigURL, alt: '', width: '40', height: '40' }), h('strong', {}, game.title))
  const total = game.stations.length

  // Der Weg zum Turm: Ludwig rückt mit jeder gelösten Station weiter.
  const dots = game.stations.map(() => h('span', { class: 'learn-rescue-dot' }))
  const ludwig = h('img', { class: 'learn-rescue-ludwig', src: ludwigURL, alt: '', width: '32', height: '32' })
  const tower = h('span', { class: 'learn-rescue-tower', 'aria-hidden': 'true' }, '🏰', h('span', { class: 'learn-rescue-zora' }, '🐐'), h('span', { class: 'learn-rescue-fox' }, '🦊'))
  const zoraFree = h('span', { class: 'learn-rescue-free' }, '🐐')
  const path = h('div', { class: 'learn-rescue-path', 'aria-hidden': 'true' }, ludwig, ...dots, tower)
  const status = h('p', { class: 'learn-game-status' })
  const stage = h('div', { class: 'learn-game-stage' })
  const crossword = crosswordView(game)
  box.append(head, path, status, stage)

  let solved = 0
  const moveLudwig = () => {
    dots.forEach((d, i) => d.classList.toggle('done', i < solved))
    // Ludwig steht hinter dem letzten gelösten Punkt.
    if (solved) dots[solved - 1].after(ludwig)
    else path.prepend(ludwig)
  }

  const alphabetView = () => {
    const cells = [...game.alphabet].map((c, i) => h('span', { class: 'learn-rescue-letter' }, h('b', {}, c), h('small', {}, String(i))))
    return { element: h('div', { class: 'learn-rescue-alphabet mono', dir: 'ltr' }, ...cells), cells }
  }

  const showStation = (index: number) => {
    const station = game.stations[index]
    status.textContent = t('web_learn_rescue_station_fmt', index + 1, total, station.name)
    const alphabet = alphabetView()
    const input = h('input', { type: 'text', inputmode: 'numeric', autocomplete: 'off', class: 'learn-rescue-number mono', 'aria-label': t('web_learn_rescue_number') }) as HTMLInputElement
    const check = h('button', { class: 'primary' }, t('web_learn_check')) as HTMLButtonElement
    const feedback = h('div', { class: 'learn-game-feedback', role: 'status' })
    const submit = () => {
      const value = input.value.trim()
      if (!/^-?\d+$/.test(value)) {
        feedback.className = 'learn-game-feedback wrong'
        feedback.replaceChildren(h('p', {}, t('web_learn_rescue_not_number')))
        return
      }
      if (Number(value) !== station.answer) {
        feedback.className = 'learn-game-feedback wrong'
        feedback.replaceChildren(h('p', {}, t('web_learn_rescue_wrong')), ...(station.hint ? [rich('div', { class: 'learn-game-explain' }, `**${t('web_learn_hint')}:** ${station.hint}`)] : []))
        input.select()
        return
      }
      input.disabled = check.disabled = true
      const letter = game.alphabet.charAt(station.answer)
      alphabet.cells[station.answer].classList.add('hit')
      crossword.give(station.row, station.col, letter)
      solved++
      moveLudwig()
      const last = index + 1 === total
      const next = h('button', { class: 'primary' }, last ? t('web_learn_rescue_to_crossword') : t('web_game_next'))
      next.addEventListener('click', () => (last ? showCrossword() : showStation(index + 1)))
      feedback.className = 'learn-game-feedback right'
      feedback.replaceChildren(
        h('p', {}, t('web_game_right')),
        h('p', { class: 'learn-rescue-charat mono', dir: 'ltr' }, `alphabet.charAt(${station.answer})`, h('span', { 'aria-hidden': 'true' }, ' → '), h('code', {}, `'${letter}'`)),
        rich('div', { class: 'learn-game-explain' }, station.explanation),
        h('p', { class: 'learn-rescue-moved' }, t('web_learn_rescue_letter_moved')),
        next,
      )
      next.focus({ preventScroll: true })
    }
    check.addEventListener('click', submit)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submit()
    })
    stage.replaceChildren(
      codeBlock(station.code),
      rich('p', { class: 'learn-game-question' }, station.question),
      h('div', { class: 'learn-rescue-answer' }, input, check),
      feedback,
      h('p', { class: 'learn-rescue-label' }, t('web_learn_rescue_alphabet')),
      codeBlock(`String alphabet = "${game.alphabet}";`),
      alphabet.element,
      crossword.element,
    )
    input.focus({ preventScroll: true })
  }

  const showCrossword = () => {
    status.textContent = t('web_learn_rescue_crossword')
    const feedback = h('div', { class: 'learn-game-feedback', role: 'status' })
    const check = h('button', { class: 'primary' }, t('web_learn_check')) as HTMLButtonElement
    check.addEventListener('click', () => {
      if (!crossword.check()) {
        feedback.className = 'learn-game-feedback wrong'
        feedback.replaceChildren(h('p', {}, t('web_learn_rescue_cw_wrong')))
        return
      }
      check.disabled = true
      crossword.lock()
      const next = h('button', { class: 'primary' }, t('web_learn_rescue_to_gate'))
      next.addEventListener('click', showGate)
      feedback.className = 'learn-game-feedback right'
      feedback.replaceChildren(h('p', {}, t('web_learn_rescue_cw_done')), next)
      next.focus({ preventScroll: true })
    })
    crossword.unlock()
    stage.replaceChildren(rich('p', {}, game.crosswordText), crossword.element, check, feedback)
    crossword.focusFirst()
  }

  const showGate = () => {
    status.textContent = t('web_learn_rescue_gate')
    const input = h('input', { type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', class: 'learn-rescue-word mono', size: String(game.keyword.length + 2), 'aria-label': t('web_learn_rescue_word') }) as HTMLInputElement
    const lines = game.gateCode.split('\n').map((line) => {
      const at = line.indexOf(gatePlaceholder)
      if (at < 0) return h('div', { class: 'ln' }, line || ' ')
      return h('div', { class: 'ln' }, line.slice(0, at), input, line.slice(at + gatePlaceholder.length))
    })
    const open = h('button', { class: 'primary' }, t('web_learn_rescue_open')) as HTMLButtonElement
    const feedback = h('div', { class: 'learn-game-feedback', role: 'status' })
    const submit = () => {
      const value = input.value.trim()
      if (value !== game.keyword) {
        const almost = value.toUpperCase() === game.keyword.toUpperCase()
        feedback.className = 'learn-game-feedback wrong'
        feedback.replaceChildren(h('p', {}, t(almost ? 'web_learn_rescue_gate_case' : 'web_learn_rescue_gate_wrong')))
        input.select()
        return
      }
      input.disabled = open.disabled = true
      box.classList.add('freed')
      ludwig.after(zoraFree)
      status.textContent = ''
      const again = h('button', {}, t('web_game_again'))
      again.addEventListener('click', restart)
      feedback.className = 'learn-game-feedback right'
      feedback.replaceChildren(h('p', {}, t('web_learn_rescue_freed')), rich('div', { class: 'learn-game-explain' }, game.end), again)
    }
    open.addEventListener('click', submit)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submit()
    })
    stage.replaceChildren(rich('p', {}, game.gateText), h('div', { class: 'learn-game-code mono learn-rescue-gate', dir: 'ltr' }, ...lines), open, feedback)
    input.focus({ preventScroll: true })
  }

  const restart = () => {
    solved = 0
    box.classList.remove('freed')
    zoraFree.remove()
    crossword.reset()
    moveLudwig()
    showStation(0)
  }

  const start = h('button', { class: 'primary' }, t('web_game_start'))
  start.addEventListener('click', restart)
  stage.append(rich('p', {}, game.intro), start)
  return box
}

/** Das Kreuzworträtsel: erst nur zum Anschauen, dann zum Ausfüllen. */
function crosswordView(game: RescueGame) {
  const grid = crosswordGrid(game)
  const keyCells = new Map(game.solution.map((s, i) => [`${s.row} ${s.col}`, i]))
  const numbers = new Map<string, number>()
  for (const w of game.words) numbers.set(`${w.row} ${w.col}`, w.number)
  const inputs = new Map<string, HTMLInputElement>()
  const board = h('div', { class: 'learn-cw-grid', dir: 'ltr' })
  board.style.gridTemplateColumns = `repeat(${game.cols}, var(--cw-cell))`
  /** Richtung beim Tippen: waagrecht, außer das Feld gehört nur zu einem senkrechten Wort. */
  let across = true
  const wordsAt = (r: number, c: number) =>
    game.words.filter((w) => (w.across ? w.row === r && c >= w.col && c < w.col + w.word.length : w.col === c && r >= w.row && r < w.row + w.word.length))
  const step = (r: number, c: number, d: number) => {
    const next = across ? `${r} ${c + d}` : `${r + d} ${c}`
    inputs.get(next)?.focus()
  }
  grid.forEach((row, r) =>
    row.forEach((letter, c) => {
      if (!letter) return board.append(h('span', { class: 'learn-cw-empty' }))
      const key = `${r} ${c}`
      const input = h('input', { type: 'text', maxlength: '1', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', 'aria-label': t('web_learn_rescue_cell_fmt', r + 1, c + 1) }) as HTMLInputElement
      input.disabled = true
      input.addEventListener('focus', () => {
        const ws = wordsAt(r, c)
        if (!ws.some((w) => w.across === across)) across = ws[0].across
        input.select()
      })
      input.addEventListener('input', () => {
        input.value = input.value.slice(-1).toUpperCase()
        input.classList.remove('wrong')
        updateKeyword()
        if (input.value) step(r, c, 1)
      })
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value) step(r, c, -1)
        else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          across = true
          step(r, c, e.key === 'ArrowRight' ? 1 : -1)
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          across = false
          step(r, c, e.key === 'ArrowDown' ? 1 : -1)
        } else return
        e.preventDefault()
      })
      inputs.set(key, input)
      const keyIndex = keyCells.get(key)
      const cell = h('span', { class: `learn-cw-cell${keyIndex !== undefined ? ' key' : ''}` })
      const number = numbers.get(key)
      if (number) cell.append(h('small', { class: 'learn-cw-number' }, String(number)))
      if (keyIndex !== undefined) cell.append(h('small', { class: 'learn-cw-keyindex' }, String(keyIndex + 1)))
      cell.append(input)
      board.append(cell)
    }),
  )
  const clueList = (isAcross: boolean) => {
    const list = h('ol', { class: 'learn-cw-clues' })
    for (const w of game.words.filter((w) => w.across === isAcross).sort((a, b) => a.number - b.number)) {
      const item = rich('li', { value: String(w.number) }, `${w.clue} (${w.word.length})`)
      item.addEventListener('click', () => {
        across = w.across
        inputs.get(`${w.row} ${w.col}`)?.focus()
      })
      list.append(item)
    }
    return h('div', {}, h('strong', {}, t(isAcross ? 'web_learn_rescue_across' : 'web_learn_rescue_down')), list)
  }
  const keyBoxes = game.solution.map(() => h('span', { class: 'learn-cw-keybox' }))
  const updateKeyword = () => game.solution.forEach((s, i) => (keyBoxes[i].textContent = inputs.get(`${s.row} ${s.col}`)!.value || ' '))
  const element = h(
    'div',
    { class: 'learn-cw' },
    h('div', { class: 'learn-cw-board' }, board, h('p', { class: 'learn-cw-keyword' }, `${t('web_learn_rescue_keyword')} `, h('span', { class: 'mono', dir: 'ltr' }, ...keyBoxes))),
    h('div', { class: 'learn-cw-cluebox' }, clueList(true), clueList(false)),
  )
  const given = new Set<string>()
  return {
    element,
    /** Buchstabe aus einer Station: steht fest im Feld. */
    give(r: number, c: number, letter: string) {
      const input = inputs.get(`${r} ${c}`)!
      input.value = letter
      input.parentElement!.classList.add('given', 'arrived')
      given.add(`${r} ${c}`)
      updateKeyword()
    },
    unlock() {
      for (const [key, input] of inputs) input.disabled = given.has(key)
    },
    lock() {
      for (const input of inputs.values()) input.disabled = true
    },
    focusFirst() {
      ;[...inputs].find(([key]) => !given.has(key))?.[1].focus({ preventScroll: true })
    },
    /** Markiert falsche Felder; `true`, wenn alles stimmt. */
    check(): boolean {
      let right = true
      for (const [key, input] of inputs) {
        const [r, c] = key.split(' ').map(Number)
        const bad = input.value !== grid[r][c]
        input.classList.toggle('wrong', bad)
        if (bad) right = false
      }
      return right
    },
    reset() {
      given.clear()
      for (const input of inputs.values()) {
        input.value = ''
        input.disabled = true
        input.classList.remove('wrong')
        input.parentElement!.classList.remove('given', 'arrived')
      }
      updateKeyword()
    },
  }
}
