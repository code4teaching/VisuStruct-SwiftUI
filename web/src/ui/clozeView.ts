import { clozeAnswerRight, type Cloze } from '../learn/cloze'
import { inline } from '../learn/markdown'
import { t } from './i18n'

/** Lückentext im Lernbereich: fertiger Code, die fehlenden Wörter tippt man direkt in die Lücken. */

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

export function renderCloze(cloze: Cloze): HTMLElement {
  const box = h('section', { class: 'learn-cloze' })
  box.append(h('strong', { class: 'learn-cloze-title' }, cloze.title))
  if (cloze.task) box.append(rich('p', {}, cloze.task))
  box.append(h('p', { class: 'learn-cloze-hint' }, t('web_learn_cloze_hint')))

  const gaps: { input: HTMLInputElement; answers: string[] }[] = []
  for (const lines of cloze.blocks) {
    const code = h('pre', { class: 'learn-cloze-code mono', dir: 'ltr' })
    for (const line of lines) {
      const row = h('div', { class: 'ln' })
      for (const part of line) {
        if (typeof part === 'string') {
          row.append(part)
          continue
        }
        const input = h('input', {
          type: 'text',
          class: 'learn-cloze-gap mono',
          autocomplete: 'off',
          autocapitalize: 'off',
          autocorrect: 'off',
          spellcheck: 'false',
          enterkeyhint: 'done',
          'aria-label': `${gaps.length + 1}`,
        }) as HTMLInputElement
        input.style.width = `${Math.max(3, ...part.answers.map((a) => a.length)) + 1}ch`
        gaps.push({ input, answers: part.answers })
        row.append(input)
      }
      // Leere Zeilen sollen ihre Höhe behalten.
      if (!line.length) row.append('\n')
      code.append(row)
    }
    box.append(code)
  }

  const status = h('p', { class: 'learn-cloze-status', role: 'status' })
  const explanation = cloze.explanation ? rich('p', { class: 'learn-explanation' }, cloze.explanation) : undefined
  if (explanation) explanation.hidden = true
  const check = h('button', { class: 'learn-cloze-check' }, t('web_learn_check'))
  const solution = h('button', {}, t('web_learn_cloze_solution'))
  const again = h('button', {}, t('web_learn_cloze_again'))
  solution.hidden = true
  again.hidden = true
  const actions = h('div', { class: 'learn-cloze-actions' }, check, solution, again)
  box.append(actions, status)
  if (explanation) box.append(explanation)

  const runCheck = () => {
    let right = 0
    for (const gap of gaps) {
      const ok = clozeAnswerRight(gap.answers, gap.input.value)
      gap.input.classList.toggle('right', ok)
      gap.input.classList.toggle('wrong', !ok)
      if (ok) right++
    }
    const all = right === gaps.length
    status.textContent = all ? t('web_learn_cloze_all_right') : t('web_learn_cloze_score_fmt', right, gaps.length)
    status.className = `learn-cloze-status ${all ? 'right' : 'wrong'}`
    if (explanation) explanation.hidden = !all
    if (all) {
      gaps.forEach((g) => (g.input.disabled = true))
      check.hidden = true
      again.hidden = false
    } else {
      // Nach einem Fehlversuch darf man sich die Lösung zeigen lassen.
      solution.hidden = false
      gaps.find((g) => g.input.classList.contains('wrong'))?.input.focus()
    }
  }
  check.addEventListener('click', runCheck)
  solution.addEventListener('click', () => {
    for (const gap of gaps) {
      gap.input.value = gap.answers[0]
      gap.input.classList.remove('right', 'wrong')
      gap.input.classList.add('shown')
      gap.input.disabled = true
    }
    status.textContent = ''
    status.className = 'learn-cloze-status'
    if (explanation) explanation.hidden = false
    check.hidden = true
    solution.hidden = true
    again.hidden = false
  })
  again.addEventListener('click', () => {
    for (const gap of gaps) {
      gap.input.value = ''
      gap.input.classList.remove('right', 'wrong', 'shown')
      gap.input.disabled = false
    }
    status.textContent = ''
    status.className = 'learn-cloze-status'
    if (explanation) explanation.hidden = true
    check.hidden = false
    solution.hidden = true
    again.hidden = true
    gaps[0]?.input.focus()
  })
  gaps.forEach((gap, i) => {
    gap.input.addEventListener('input', () => gap.input.classList.remove('right', 'wrong'))
    gap.input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return
      e.preventDefault()
      // Enter springt zur nächsten Lücke, in der letzten wird geprüft.
      if (i < gaps.length - 1) gaps[i + 1].input.focus()
      else runCheck()
    })
  })
  return box
}
