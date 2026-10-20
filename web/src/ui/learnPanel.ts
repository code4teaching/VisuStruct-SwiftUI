import { checkExercise, usedElementTypes, type TestOutcome } from '../core/exerciseCheck'
import { isPlaceholderElement } from '../core/editing'
import { ElementType, makeElement, type VSDocument } from '../core/model'
import { decodeDocument } from '../core/xmlCodec'
import { diagram, lessons, reference, tasks } from '../learn/content'
import type { Block, ChecklistItem, Exercise, Lesson, QuizQuestion, Task } from '../learn/lessonFormat'
import { inline, markdownToHTML } from '../learn/markdown'
import { progress } from '../learn/progress'
import { t } from './i18n'
import { noticeText } from './simulationPanel'

/**
 * Lernbereich neben dem Editor (Vorbild: PicoJavaGoat): Lektionen in kurzen Schritten mit Übungen,
 * Checkliste und Wissenstest, dazu Aufgaben und Nachschlagen. Übungen prüft die Simulation.
 */

export interface LearnHost {
  /** Übung im Editor öffnen (vorhandenen Reiter wählen oder neuen anlegen). */
  openExercise(exercise: Exercise, doc: VSDocument): void
  /** Beispieldiagramm in einem neuen Reiter öffnen. */
  openDiagram(doc: VSDocument, fileName: string): void
  /** Diagramm des Reiters, in dem die Übung offen ist. */
  exerciseDocument(id: string): VSDocument | undefined
  /** Reiter einer Übung auf den Startzustand setzen (falls offen). */
  resetExercise(id: string, doc: VSDocument): void
  preview(doc: VSDocument): SVGSVGElement | undefined
}

type TabName = 'lessons' | 'tasks' | 'reference'

const sections = (): { name: string; lessons: Lesson[] }[] => {
  const out: { name: string; lessons: Lesson[] }[] = []
  for (const l of lessons) {
    const last = out.at(-1)
    if (last && last.name === l.section) last.lessons.push(l)
    else out.push({ name: l.section, lessons: [l] })
  }
  return out
}

function h(tag: string, attrs: Record<string, string> = {}, ...children: (Node | string)[]): HTMLElement {
  const e = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v)
  e.append(...children)
  return e
}

function html(tag: string, attrs: Record<string, string>, markup: string): HTMLElement {
  const e = h(tag, attrs)
  e.innerHTML = markup
  return e
}

const typeName = (type: ElementType) => t(`element_${ElementType[type]}`)

function emptyDocument(title: string): VSDocument {
  return { caption: title, elements: [makeElement(ElementType.anweisung, { textLines: ['ø'] })] }
}

export function startDocument(ex: Exercise): VSDocument {
  const start = ex.start ? diagram(ex.start) : undefined
  return start ? { ...start, caption: start.caption || ex.title } : emptyDocument(ex.title)
}

export class LearnPanel {
  readonly element: HTMLElement
  private tab: TabName = 'lessons'
  /** Wohin „Zurück zur Checkliste“ nach dem Nachlesen führt. */
  private returnTo?: { lesson: string; step: number; scroll: number }
  private lessonId?: string
  private taskId?: string
  private body!: HTMLElement

  constructor(private host: LearnHost) {
    this.element = h('aside', { class: 'learn', 'aria-label': t('web_learn_title') })
    const view = progress.view()
    if (view) {
      this.tab = (['lessons', 'tasks', 'reference'] as const).find((x) => x === view.tab) ?? 'lessons'
      this.lessonId = lessons.some((l) => l.id === view.lesson) ? view.lesson : undefined
      this.taskId = tasks.some((x) => x.id === view.task) ? view.task : undefined
    }
    this.render()
  }

  /** Neu aufbauen (z. B. nach einem Sprachwechsel). */
  render() {
    const tabs = h('div', { class: 'segmented learn-tabs', role: 'tablist' })
    for (const [name, label] of [
      ['lessons', t('web_learn_lessons')],
      ['tasks', t('web_learn_tasks')],
      ['reference', t('web_learn_reference')],
    ] as const) {
      const b = h('button', { role: 'tab', 'aria-pressed': String(this.tab === name), 'data-learn-tab': name }, label)
      b.addEventListener('click', () => {
        if (this.tab === name) {
          // Zweiter Klick: zurück zur Übersicht
          if (name === 'lessons') this.lessonId = undefined
          if (name === 'tasks') this.taskId = undefined
        }
        this.tab = name
        this.persist()
        this.render()
      })
      tabs.append(b)
    }
    this.body = h('div', { class: 'learn-body' })
    this.element.replaceChildren(tabs, this.body)
    if (this.tab === 'lessons') {
      const lesson = lessons.find((l) => l.id === this.lessonId)
      if (lesson) this.renderLesson(lesson)
      else this.renderLessonList()
    } else if (this.tab === 'tasks') {
      const task = tasks.find((x) => x.id === this.taskId)
      if (task) this.renderTask(task)
      else this.renderTaskList()
    } else {
      this.body.append(html('div', { class: 'learn-text learn-reference' }, markdownToHTML(reference)))
    }
  }

  private persist() {
    progress.setView({ tab: this.tab, lesson: this.lessonId, task: this.taskId })
  }

  private openLesson(id: string | undefined) {
    this.tab = 'lessons'
    this.lessonId = id
    this.returnTo = undefined
    this.persist()
    this.render()
    this.body.scrollTop = 0
  }

  // MARK: - Lektionen

  private renderLessonList() {
    this.body.append(h('p', { class: 'hint' }, t('web_learn_intro')))
    for (const section of sections()) {
      this.body.append(h('h3', { class: 'learn-section' }, section.name))
      const list = h('ol', { class: 'learn-list' })
      for (const l of section.lessons) {
        const p = progress.lesson(l.id)
        const status = p.done ? '✓' : p.step > 0 ? t('web_learn_step_of_fmt', p.step + 1, l.steps.length) : ''
        const item = h(
          'button',
          { class: 'learn-item' + (p.done ? ' done' : ''), 'data-lesson': l.id },
          h('span', { class: 'learn-num' }, String(l.number)),
          h('span', { class: 'learn-item-text' }, h('strong', {}, l.title), h('small', {}, l.summary)),
          h('span', { class: 'learn-status' }, status),
        )
        item.addEventListener('click', () => this.openLesson(l.id))
        list.append(h('li', {}, item))
      }
      this.body.append(list)
    }
  }

  private renderLesson(lesson: Lesson) {
    const p = progress.lesson(lesson.id)
    const index = Math.min(p.step, lesson.steps.length - 1)
    const step = lesson.steps[index]

    const back = h('button', { class: 'learn-back' }, `← ${t('web_learn_all_lessons')}`)
    back.addEventListener('click', () => this.openLesson(undefined))
    const bar = h('div', { class: 'learn-progress', role: 'progressbar', 'aria-valuemin': '1', 'aria-valuemax': String(lesson.steps.length), 'aria-valuenow': String(index + 1) })
    bar.append(...lesson.steps.map((_, i) => h('span', { class: i < index ? 'past' : i === index ? 'current' : '' })))
    this.body.append(
      back,
      h('p', { class: 'learn-kicker' }, `${t('web_learn_lesson_fmt', lesson.number)} · ${lesson.section}`),
      h('h2', { class: 'learn-title' }, lesson.title),
      bar,
      h('h3', { class: 'learn-step-title' }, `${index + 1}. ${step.title}`),
    )
    const ret = this.returnTo?.lesson === lesson.id && this.returnTo.step !== index ? this.returnTo : undefined
    const backToChecklist = () => {
      const b = h('button', { class: 'learn-return' }, `↩ ${t('web_learn_back_to_checklist')}`)
      b.addEventListener('click', () => {
        this.returnTo = undefined
        this.goToStep(lesson, ret!.step)
        this.body.scrollTop = ret!.scroll
      })
      return b
    }
    if (ret) this.body.append(backToChecklist())
    step.blocks.forEach((block, bi) => this.body.append(this.renderBlock(block, `${index}-${bi}`, lesson)))

    const nav = h('div', { class: 'learn-nav' })
    const prev = h('button', {}, `← ${t('web_learn_back')}`) as HTMLButtonElement
    prev.disabled = index === 0
    prev.addEventListener('click', () => this.goToStep(lesson, index - 1))
    nav.append(prev)
    if (index < lesson.steps.length - 1) {
      const next = h('button', { class: 'primary' }, `${t('web_learn_next')} →`)
      next.addEventListener('click', () => this.goToStep(lesson, index + 1))
      nav.append(next)
    } else {
      const finish = h('button', { class: 'primary' }, p.done ? `✓ ${t('web_learn_done')}` : t('web_learn_finish'))
      finish.addEventListener('click', () => {
        progress.updateLesson(lesson.id, { done: true })
        const following = lessons.find((l) => l.number === lesson.number + 1)
        this.openLesson(following?.id)
      })
      nav.append(finish)
    }
    this.body.append(nav)
    if (ret) this.body.append(backToChecklist())
  }

  private goToStep(lesson: Lesson, step: number) {
    progress.updateLesson(lesson.id, { step })
    this.render()
    this.body.scrollTop = 0
  }

  // MARK: - Aufgaben

  private renderTaskList() {
    this.body.append(h('p', { class: 'hint' }, t('web_learn_tasks_intro')))
    const list = h('ul', { class: 'learn-list' })
    for (const task of tasks) {
      const done = this.taskExercises(task).every((ex) => progress.exercise(ex.id).done)
      const after = lessons.find((l) => l.number === task.after)
      const item = h(
        'button',
        { class: 'learn-item' + (done ? ' done' : ''), 'data-task': task.id },
        h('span', { class: 'learn-num', 'aria-label': t('web_learn_level_fmt', task.level) }, '★'.repeat(task.level)),
        h(
          'span',
          { class: 'learn-item-text' },
          h('strong', {}, task.title),
          h('small', {}, after ? t('web_learn_after_fmt', after.number, after.title) : ''),
        ),
        h('span', { class: 'learn-status' }, done ? '✓' : ''),
      )
      item.addEventListener('click', () => {
        this.taskId = task.id
        this.persist()
        this.render()
        this.body.scrollTop = 0
      })
      list.append(h('li', {}, item))
    }
    this.body.append(list)
  }

  private taskExercises(task: Task): Exercise[] {
    return task.blocks.flatMap((b) => (b.kind === 'exercise' ? [b.exercise] : []))
  }

  private renderTask(task: Task) {
    const back = h('button', { class: 'learn-back' }, `← ${t('web_learn_all_tasks')}`)
    back.addEventListener('click', () => {
      this.taskId = undefined
      this.persist()
      this.render()
    })
    const after = lessons.find((l) => l.number === task.after)
    this.body.append(back, h('h2', { class: 'learn-title' }, task.title))
    if (after) {
      const link = h('button', { class: 'link-button' }, t('web_learn_after_fmt', after.number, after.title))
      link.addEventListener('click', () => this.openLesson(after.id))
      this.body.append(h('p', { class: 'learn-kicker' }, link))
    }
    task.blocks.forEach((block, i) => this.body.append(this.renderBlock(block, `task-${i}`, undefined, true)))
  }

  // MARK: - Blöcke

  private renderBlock(block: Block, key: string, lesson?: Lesson, showSolution = false): HTMLElement {
    switch (block.kind) {
      case 'markdown':
        return html('div', { class: 'learn-text' }, markdownToHTML(block.text))
      case 'diagram':
        return this.renderDiagram(block.file, block.caption)
      case 'exercise':
        return this.renderExercise(block.exercise, showSolution)
      case 'checklist':
        return this.renderChecklist(block.items, key, lesson)
      case 'quiz':
        return this.renderQuiz(block.questions, key, lesson)
    }
  }

  private renderDiagram(file: string, caption: string): HTMLElement {
    const doc = diagram(file)
    const figure = h('figure', { class: 'learn-figure' })
    if (!doc) return figure
    const svg = this.host.preview(doc)
    if (svg) figure.append(h('div', { class: 'learn-preview', dir: 'ltr' }, svg))
    if (caption) figure.append(html('figcaption', {}, inline(caption)))
    const open = h('button', {}, t('web_learn_open_in_editor'))
    open.addEventListener('click', () => this.host.openDiagram(doc, file))
    figure.append(open)
    return figure
  }

  private renderExercise(ex: Exercise, showSolution: boolean): HTMLElement {
    const card = h('section', { class: 'learn-exercise', 'data-exercise': ex.id })
    const state = () => progress.exercise(ex.id)
    const badge = h('span', { class: 'learn-badge' }, `✓ ${t('web_learn_solved')}`)
    badge.hidden = !state().done
    card.append(h('h4', {}, `${t('web_learn_exercise')}: ${ex.title}`, badge), html('div', { class: 'learn-text' }, markdownToHTML(ex.task)))

    const result = h('div', { class: 'learn-result', role: 'status' })
    const hint = html('aside', { class: 'lesson-note' }, markdownToHTML(ex.hint ?? ''))
    hint.hidden = true

    const actions = h('div', { class: 'group' })
    const open = h('button', { class: 'primary' }, t('web_learn_open_exercise'))
    open.addEventListener('click', () => {
      const saved = state().xml
      let doc = startDocument(ex)
      if (saved) {
        try {
          doc = decodeDocument(saved)
        } catch {
          /* gespeicherter Stand unlesbar: von vorn */
        }
      }
      this.host.openExercise(ex, doc)
    })
    const check = h('button', {}, t('web_learn_check'))
    check.addEventListener('click', () => {
      const doc = this.host.exerciseDocument(ex.id)
      if (!doc) {
        result.className = 'learn-result info'
        result.textContent = t('web_learn_open_first')
        return
      }
      if (doc.elements.every(isPlaceholderElement)) {
        result.className = 'learn-result info'
        result.textContent = t('web_learn_empty')
        return
      }
      const outcomes = checkExercise(doc, ex.tests)
      const used = usedElementTypes(doc)
      const missing = ex.requires
        .map((r) => (r === 'forZaehlSchleife' ? 'forSchleife' : r))
        .filter((r) => r in ElementType && !used.has(ElementType[r as keyof typeof ElementType]))
      const passed = outcomes.every((o) => o.passed) && missing.length === 0
      this.showResult(result, outcomes, missing, passed)
      if (passed) {
        progress.updateExercise(ex.id, { done: true })
        badge.hidden = false
      }
    })
    actions.append(open, check)
    if (ex.hint) {
      const tip = h('button', { 'aria-expanded': 'false' }, t('web_learn_hint'))
      tip.addEventListener('click', () => {
        hint.hidden = !hint.hidden
        tip.setAttribute('aria-expanded', String(!hint.hidden))
      })
      actions.append(tip)
    }
    const reset = h('button', { class: 'danger-text' }, t('web_learn_reset'))
    reset.addEventListener('click', () => {
      if (reset.dataset.confirm !== '1') {
        reset.dataset.confirm = '1'
        reset.textContent = t('web_learn_reset_confirm')
        setTimeout(() => {
          reset.dataset.confirm = ''
          reset.textContent = t('web_learn_reset')
        }, 4000)
        return
      }
      progress.resetExercise(ex.id)
      this.host.resetExercise(ex.id, startDocument(ex))
      badge.hidden = true
      result.replaceChildren()
      result.className = 'learn-result'
      reset.dataset.confirm = ''
      reset.textContent = t('web_learn_reset')
    })
    actions.append(reset)
    card.append(actions, hint, result)

    if (showSolution && ex.solution) {
      const solution = diagram(ex.solution)
      if (solution) {
        const details = h('details', { class: 'learn-solution' }, h('summary', {}, t('web_learn_solution'))) as HTMLDetailsElement
        details.addEventListener('toggle', () => {
          if (!details.open || details.querySelector('.learn-preview')) return
          const svg = this.host.preview(solution)
          if (svg) details.append(h('div', { class: 'learn-preview', dir: 'ltr' }, svg))
          const openSolution = h('button', {}, t('web_learn_open_in_editor'))
          openSolution.addEventListener('click', () => this.host.openDiagram(solution, ex.solution!))
          details.append(openSolution)
        })
        card.append(details)
      }
    }
    return card
  }

  private showResult(box: HTMLElement, outcomes: TestOutcome[], missing: string[], passed: boolean) {
    box.className = 'learn-result ' + (passed ? 'ok' : 'fail')
    box.replaceChildren(h('p', { class: 'learn-result-head' }, passed ? `🎉 ${t('web_learn_passed')}` : t('web_learn_failed')))
    for (const m of missing) box.append(h('p', {}, `✗ ${t('web_learn_missing_fmt', typeName(ElementType[m as keyof typeof ElementType]))}`))
    const list = h('ul', { class: 'learn-tests', dir: 'auto' })
    for (const o of outcomes) {
      const input = o.test.inputs.length ? t('web_learn_input_fmt', o.test.inputs.join(', ')) : t('web_learn_no_input')
      const lines: (string | Node)[] = [`${o.passed ? '✓' : '✗'} ${input}`]
      const detail = h('div', { class: 'learn-test-detail' })
      detail.append(
        h('span', {}, `${t('web_learn_expected')}: `, h('code', {}, o.test.expected.join(' | ') || '–')),
        h('span', {}, `${t('web_learn_actual')}: `, h('code', {}, o.result.outputs.join(' | ') || '–')),
      )
      if (o.result.error) detail.append(h('span', { class: 'learn-error' }, noticeText(o.result.error)))
      if (o.result.missingInput) detail.append(h('span', { class: 'learn-error' }, t('web_learn_missing_input')))
      if (o.result.tooManySteps) detail.append(h('span', { class: 'learn-error' }, t('web_learn_too_many_steps')))
      if (!o.passed && o.result.unusedInputs) detail.append(h('span', { class: 'learn-error' }, t('web_learn_unused_input')))
      list.append(h('li', { class: o.passed ? 'ok' : 'fail' }, ...lines, detail))
    }
    box.append(list)
  }

  private renderChecklist(items: ChecklistItem[], key: string, lesson?: Lesson): HTMLElement {
    const box = h('ul', { class: 'learn-checklist' })
    items.forEach((item, i) => {
      const id = `${key}-${i}`
      const input = h('input', { type: 'checkbox' }) as HTMLInputElement
      input.checked = !!(lesson && progress.lesson(lesson.id).checks?.[id])
      input.addEventListener('change', () => {
        if (!lesson) return
        const checks = { ...(progress.lesson(lesson.id).checks ?? {}), [id]: input.checked }
        progress.updateLesson(lesson.id, { checks })
      })
      const label = h('label', {}, input)
      label.insertAdjacentHTML('beforeend', ' ' + inline(item.text))
      const li = h('li', {}, label)
      if (lesson && item.step !== undefined) {
        const step = item.step
        const where = t('web_learn_step_fmt', step + 1, lesson.steps[step].title)
        const link = h('button', { class: 'link-button learn-check-link', title: where, 'aria-label': `${t('web_learn_review')}: ${where}` }, t('web_learn_review'))
        link.addEventListener('click', () => {
          this.returnTo = { lesson: lesson.id, step: progress.lesson(lesson.id).step, scroll: this.body.scrollTop }
          this.goToStep(lesson, step)
        })
        li.append(link)
      }
      box.append(li)
    })
    return box
  }

  private renderQuiz(questions: QuizQuestion[], key: string, lesson?: Lesson): HTMLElement {
    const box = h('div', { class: 'learn-quiz' })
    const score = h('p', { class: 'learn-score', role: 'status' })
    const answers = () => (lesson ? progress.lesson(lesson.id).quiz ?? {} : {})
    const updateScore = () => {
      const a = answers()
      const answered = questions.filter((_, qi) => a[`${key}-${qi}`] !== undefined).length
      const right = questions.filter((q, qi) => q.options[a[`${key}-${qi}`]]?.correct).length
      score.textContent = answered === questions.length ? t('web_learn_score_fmt', right, questions.length) : ''
    }
    questions.forEach((q, qi) => {
      const id = `${key}-${qi}`
      const fieldset = h('fieldset', {}, html('legend', {}, inline(q.question)))
      const explanation = html('p', { class: 'learn-explanation' }, inline(q.explanation ?? ''))
      const showAnswer = (chosen: number | undefined) => {
        fieldset.querySelectorAll<HTMLButtonElement>('button').forEach((b, oi) => {
          b.classList.toggle('right', chosen !== undefined && q.options[oi].correct)
          b.classList.toggle('wrong', chosen === oi && !q.options[oi].correct)
          b.setAttribute('aria-pressed', String(chosen === oi))
        })
        explanation.hidden = chosen === undefined || !q.explanation
      }
      q.options.forEach((o, oi) => {
        const b = html('button', { class: 'learn-option' }, inline(o.text))
        b.addEventListener('click', () => {
          if (lesson) progress.updateLesson(lesson.id, { quiz: { ...answers(), [id]: oi } })
          showAnswer(oi)
          updateScore()
        })
        fieldset.append(b)
      })
      fieldset.append(explanation)
      showAnswer(answers()[id])
      box.append(fieldset)
    })
    box.append(score)
    updateScore()
    return box
  }
}
