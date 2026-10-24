import { checkExercise, fileLines, usedElementTypes, type TestOutcome } from '../core/exerciseCheck'
import { isPlaceholderElement } from '../core/editing'
import { ElementType, makeElement, type VSDocument } from '../core/model'
import type { SubprogramResolver } from '../core/simulation'
import { decodeDocument } from '../core/xmlCodec'
import { explain, makeRound, usedValues, type BoolGame } from '../learn/boolGame'
import { contentLanguageFor, diagram, glossary, image, lessons, reference, tasks, useContentLanguage } from '../learn/content'
import type { Block, ChecklistItem, Exercise, Lesson, QuizQuestion, Task } from '../learn/lessonFormat'
import { inline, markdownToHTML } from '../learn/markdown'
import ludwigURL from './ludwig.webp'
import { progress } from '../learn/progress'
import { isTeacher, lockTeacher, unlockTeacher } from '../learn/teacher'
import { currentLanguage, t } from './i18n'
import { noticeText } from './simulationPanel'
import { renderCaesarDisc } from './caesarDisc'
import { renderRoundGame } from './roundGameView'
import { renderRescueGame } from './rescueGameView'
import { renderCloze } from './clozeView'
import { textFileView } from './textFileView'
import { attachPointers, attachTermTips, markPointers, markTerms } from './termTips'

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
  /** Unterprogramme für Aufrufe in der Übung: die anderen offenen Reiter. */
  subprogramsFor(id: string): SubprogramResolver
  /** Simulation beenden, damit man nach dem Prüfen gleich korrigieren kann. */
  stopSimulation(): void
  /** Reiter einer Übung auf den Startzustand setzen (falls offen). */
  resetExercise(id: string, doc: VSDocument): void
  preview(doc: VSDocument): SVGSVGElement | undefined
  /** Lernbereich zur schmalen Leiste einklappen. */
  collapse(): void
}

/** Seitenleisten-Symbol wie in Finder, Mail und Safari (kein ✕: Einklappen ist kein Schließen). */
export const sidebarIcon =
  '<svg viewBox="0 0 20 16" width="18" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="18" height="14" rx="3"/><path d="M7.5 1v14"/><path d="M3.5 4.5h2M3.5 7h2M3.5 9.5h2" stroke-linecap="round"/></svg>'

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
  private tips: { hide(): void }
  private pointers: { off(): void }

  constructor(private host: LearnHost) {
    this.element = h('aside', { class: 'learn', 'aria-label': t('web_learn_title') })
    this.tips = attachTermTips(this.element)
    this.pointers = attachPointers(this.element)
    useContentLanguage(contentLanguageFor(currentLanguage()))
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
    this.tips.hide()
    this.pointers.off()
    useContentLanguage(contentLanguageFor(currentLanguage()))
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
    const hide = html('button', { class: 'learn-hide', title: t('web_learn_hide'), 'aria-label': t('web_learn_hide') }, sidebarIcon)
    hide.addEventListener('click', () => this.host.collapse())
    const head = h('div', { class: 'learn-head' }, tabs, hide)
    this.body = h('div', { class: 'learn-body' })
    this.element.replaceChildren(head, this.body)
    if (this.tab === 'lessons') {
      const lesson = lessons.find((l) => l.id === this.lessonId)
      if (lesson) this.renderLesson(lesson)
      else this.renderLessonList()
    } else if (this.tab === 'tasks') {
      const task = tasks.find((x) => x.id === this.taskId)
      if (task) this.renderTask(task)
      else this.renderTaskList()
    } else {
      const terms = glossary.map((e) => `- **${e.term}:** ${e.text}`).join('\n')
      this.body.append(html('div', { class: 'learn-text learn-reference' }, markdownToHTML(`${reference}\n\n### ${t('web_learn_terms')}\n\n${terms}`)))
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
    this.body.append(this.renderTeacherBox())
  }

  private renderLesson(lesson: Lesson) {
    const p = progress.lesson(lesson.id)
    const index = Math.min(p.step, lesson.steps.length - 1)
    const step = lesson.steps[index]

    const back = h('button', { class: 'learn-back' }, `← ${t('web_learn_all_lessons')}`)
    back.addEventListener('click', () => this.openLesson(undefined))
    const bar = h('nav', { class: 'learn-progress', 'aria-label': t('web_learn_step_of_fmt', index + 1, lesson.steps.length) })
    bar.append(
      ...lesson.steps.map((s, i) => {
        const where = t('web_learn_step_fmt', i + 1, s.title)
        const b = h('button', { class: i < index ? 'past' : i === index ? 'current' : '', title: where, 'aria-label': where }, String(i + 1))
        if (i === index) b.setAttribute('aria-current', 'step')
        b.addEventListener('click', () => this.goToStep(lesson, i))
        return b
      }),
    )
    this.body.append(
      back,
      h('p', { class: 'learn-kicker' }, `${t('web_learn_lesson_fmt', lesson.number)} · ${lesson.section}`),
      // Dieselbe Nummer wie in der Liste, gut sichtbar neben dem Titel.
      h('h2', { class: 'learn-title' }, h('span', { class: 'learn-num', 'aria-hidden': 'true' }, String(lesson.number)), lesson.title),
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
    markPointers(this.body)
    markTerms(this.body, glossary)

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
      // Aufgaben ohne geprüfte Übung (z. B. Swing) gelten nie als erledigt.
      const exercises = this.taskExercises(task)
      const done = exercises.length > 0 && exercises.every((ex) => progress.exercise(ex.id).done)
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
    this.body.append(list, this.renderTeacherBox())
  }

  /** Lehrkräfte schalten mit dem Lehrercode die Musterlösungen frei. */
  private renderTeacherBox(): HTMLElement {
    const box = h('details', { class: 'learn-teacher' }, h('summary', {}, t('web_learn_teacher')))
    if (isTeacher()) {
      box.setAttribute('open', '')
      const off = h('button', {}, t('web_learn_teacher_off'))
      off.addEventListener('click', () => {
        lockTeacher()
        this.render()
      })
      box.append(h('p', {}, t('web_learn_teacher_on')), off)
      return box
    }
    const input = h('input', { type: 'password', autocomplete: 'off', 'aria-label': t('web_learn_teacher_code'), placeholder: t('web_learn_teacher_code') }) as HTMLInputElement
    const status = h('p', { class: 'learn-result', role: 'status' })
    const form = h('form', { class: 'group' }, input, h('button', { type: 'submit' }, t('web_learn_teacher_unlock')))
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      if (await unlockTeacher(input.value)) this.render()
      else {
        status.className = 'learn-result info'
        status.textContent = t('web_learn_teacher_wrong')
      }
    })
    box.append(h('p', { class: 'hint' }, t('web_learn_teacher_intro')), form, status)
    return box
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
    task.blocks.forEach((block, i) => this.body.append(this.renderBlock(block, `task-${i}`)))
    markPointers(this.body)
    markTerms(this.body, glossary)
  }

  // MARK: - Blöcke

  private renderBlock(block: Block, key: string, lesson?: Lesson): HTMLElement {
    switch (block.kind) {
      case 'markdown':
        return html('div', { class: 'learn-text' }, markdownToHTML(block.text))
      case 'diagram':
        return this.renderDiagram(block.file, block.caption)
      case 'exercise':
        return this.renderExercise(block.exercise)
      case 'checklist':
        return this.renderChecklist(block.items, key, lesson)
      case 'quiz':
        return this.renderQuiz(block.questions, key, lesson)
      case 'brag':
        return this.renderBrag(block.text, block.tip)
      case 'images':
        return this.renderImages(block.files, block.caption)
      case 'graphic':
        return this.renderGraphic(block.file, block.caption)
      case 'game':
        return this.renderGame(block.game)
      case 'roundGame':
        return renderRoundGame(block.game, ludwigURL)
      case 'rescueGame':
        return renderRescueGame(block.game, ludwigURL)
      case 'caesar':
        return renderCaesarDisc(block.key, block.text)
      case 'cloze':
        return renderCloze(block.cloze)
      case 'textFile':
        return textFileView(block.name, block.content)
    }
  }

  /** Ludwig der Geißbock erzählt etwas zum Angeben oder gibt einen Tipp. */
  private renderBrag(text: string, tip = false): HTMLElement {
    const box = h('aside', { class: 'learn-brag' })
    box.append(h('img', { src: ludwigURL, alt: '', width: '48', height: '48' }))
    const body = h('div', {}, h('p', { class: 'learn-brag-title' }, t(tip ? 'web_learn_ludwig_tip' : 'web_learn_brag')))
    body.append(html('div', { class: 'learn-text' }, markdownToHTML(text)))
    box.append(body)
    return box
  }

  /** Spiel „Wahr oder falsch?“: zehn Runden, die Bedingungen werden schwerer. */
  private renderGame(game: BoolGame): HTMLElement {
    const rounds = 10
    const box = h('section', { class: 'learn-game' })
    const head = h('div', { class: 'learn-game-head' })
    head.append(h('img', { src: ludwigURL, alt: '', width: '40', height: '40' }), h('strong', {}, t('web_game_title')))
    const status = h('p', { class: 'learn-game-status' })
    const stage = h('div', { class: 'learn-game-stage' })
    box.append(head, status, stage)
    let index = 0
    let score = 0

    const showRound = () => {
      const round = makeRound(game, index, rounds)
      status.textContent = `${t('web_game_round_fmt', index + 1, rounds)} · ${t('web_game_score_fmt', score)}`
      const values = h('div', { class: 'learn-game-values mono' })
      for (const [name, value] of usedValues(round)) values.append(h('code', {}, `${name} = ${value}`))
      const answers = h('div', { class: 'group learn-game-answers' })
      const yes = h('button', { class: 'learn-game-true' }, `✓ ${t('web_game_true')}`) as HTMLButtonElement
      const no = h('button', { class: 'learn-game-false' }, `✗ ${t('web_game_false')}`) as HTMLButtonElement
      answers.append(yes, no)
      const feedback = h('div', { class: 'learn-game-feedback', role: 'status' })
      const answer = (guess: boolean) => {
        yes.disabled = no.disabled = true
        const right = guess === round.answer
        if (right) score++
        status.textContent = `${t('web_game_round_fmt', index + 1, rounds)} · ${t('web_game_score_fmt', score)}`
        feedback.className = `learn-game-feedback ${right ? 'right' : 'wrong'}`
        const steps = h('div', { class: 'learn-game-steps mono' })
        explain(round.condition, round.values).forEach((s, i) => steps.append(h('div', {}, `${i ? '→ ' : ''}${s}`)))
        const next = h('button', { class: 'primary' }, index + 1 < rounds ? t('web_game_next') : t('web_game_finish'))
        next.addEventListener('click', () => {
          index++
          if (index < rounds) showRound()
          else showEnd()
        })
        feedback.replaceChildren(h('p', {}, right ? t('web_game_right') : t('web_game_wrong')), steps, next)
        next.focus()
      }
      yes.addEventListener('click', () => answer(true))
      no.addEventListener('click', () => answer(false))
      stage.replaceChildren(values, h('div', { class: 'learn-game-condition mono' }, round.condition), answers, feedback)
    }
    const showEnd = () => {
      status.textContent = ''
      const again = h('button', { class: 'primary' }, t('web_game_again'))
      again.addEventListener('click', () => {
        index = score = 0
        showRound()
      })
      stage.replaceChildren(
        h('p', { class: 'learn-game-result' }, t('web_game_done_fmt', score, rounds)),
        h('p', {}, t(score === rounds ? 'web_game_perfect' : score >= rounds * 0.7 ? 'web_game_good' : 'web_game_practice')),
        again,
      )
    }
    const start = h('button', { class: 'primary' }, t('web_game_start'))
    start.addEventListener('click', showRound)
    stage.append(h('p', {}, t('web_game_intro')), start)
    return box
  }

  private renderImages(files: string[], caption: string): HTMLElement {
    const figure = h('figure', { class: 'learn-figure' })
    const row = h('div', { class: 'learn-images' })
    for (const f of files) {
      const src = image(f)
      if (src) row.append(h('img', { src, alt: '', loading: 'lazy' }))
    }
    figure.append(row)
    if (caption) figure.append(html('figcaption', {}, inline(caption)))
    return figure
  }

  /** Erklärgrafik in voller Breite (meist SVG aus `lessons/bilder`). */
  private renderGraphic(file: string, caption: string): HTMLElement {
    const figure = h('figure', { class: 'learn-figure' })
    const src = image(file)
    if (src) figure.append(h('img', { class: 'learn-graphic', src, alt: '', loading: 'lazy' }))
    if (caption) figure.append(html('figcaption', {}, inline(caption)))
    return figure
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

  private renderExercise(ex: Exercise): HTMLElement {
    const card = h('section', { class: 'learn-exercise', 'data-exercise': ex.id })
    const state = () => progress.exercise(ex.id)
    const badge = h('span', { class: 'learn-badge' }, `✓ ${t('web_learn_solved')}`)
    badge.hidden = !state().done
    card.append(h('h4', {}, `${t('web_learn_exercise')}: ${ex.title}`, badge), html('div', { class: 'learn-text' }, markdownToHTML(ex.task)))

    const result = h('div', { class: 'learn-result', role: 'status' })
    // Tipps nacheinander aufdecken, vom allgemeinen zum genauen. Die Lösung gibt es nur im Lehrermodus.
    const hints = h('div', { class: 'learn-hints' })

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
      this.host.stopSimulation()
      const outcomes = checkExercise(doc, ex.tests, this.host.subprogramsFor(ex.id))
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
    if (ex.hints.length > 0) {
      const tip = h('button', {}, t('web_learn_hint'))
      tip.addEventListener('click', () => {
        const shown = hints.children.length
        if (shown >= ex.hints.length) return
        const label = ex.hints.length > 1 ? `**${t('web_learn_hint_fmt', shown + 1, ex.hints.length)}:** ` : ''
        hints.append(html('aside', { class: 'lesson-note' }, markdownToHTML(label + ex.hints[shown])))
        tip.textContent = t('web_learn_hint_more')
        tip.toggleAttribute('disabled', shown + 1 >= ex.hints.length)
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
    card.append(actions, hints, result)

    if (isTeacher() && ex.solution) {
      const solution = diagram(ex.solution)
      if (solution) {
        const details = h('details', { class: 'learn-solution' }, h('summary', {}, t('web_learn_solution'))) as HTMLDetailsElement
        details.addEventListener('toggle', () => {
          if (!details.open || details.querySelector('.learn-preview')) return
          const svg = this.host.preview(solution)
          if (svg) details.append(h('div', { class: 'learn-preview', dir: 'ltr' }, svg))
          const openSolution = h('button', {}, t('web_learn_open_in_editor'))
          openSolution.addEventListener('click', () => {
            this.host.openDiagram(solution, ex.solution!)
            for (const file of ex.subprograms) {
              const sub = diagram(file)
              if (sub) this.host.openDiagram(sub, file)
            }
          })
          for (const file of ex.subprograms) {
            const sub = diagram(file)
            const subSvg = sub && this.host.preview(sub)
            if (subSvg) details.append(h('div', { class: 'learn-preview', dir: 'ltr' }, subSvg))
          }
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
      for (const f of o.test.files ?? []) {
        detail.append(
          h('span', {}, `📄 ${f.name}, ${t('web_learn_expected')}: `, h('code', {}, f.lines.join(' | ') || '–')),
          h('span', {}, `📄 ${f.name}, ${t('web_learn_actual')}: `, h('code', {}, fileLines(o.result.files?.get(f.name)).join(' | ') || '–')),
        )
      }
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
      const chosen = (q: QuizQuestion, qi: number) =>
        q.pairs ? q.pairs.every((_, pi) => a[`${key}-${qi}-${pi}`] !== undefined) : a[`${key}-${qi}`] !== undefined
      const correct = (q: QuizQuestion, qi: number) =>
        q.pairs ? q.pairs.every((_, pi) => matchOrder(q)[a[`${key}-${qi}-${pi}`]] === q.pairs![pi].right) : q.options[a[`${key}-${qi}`]]?.correct
      const answered = questions.filter(chosen).length
      const right = questions.filter(correct).length
      score.textContent = answered === questions.length ? t('web_learn_score_fmt', right, questions.length) : ''
    }
    questions.forEach((q, qi) => {
      const id = `${key}-${qi}`
      const fieldset = h('fieldset', {}, html('legend', {}, inline(q.question)))
      const explanation = html('p', { class: 'learn-explanation' }, inline(q.explanation ?? ''))
      if (q.pairs) {
        fieldset.append(this.renderMatch(q, id, answers, lesson, explanation, updateScore), explanation)
        box.append(fieldset)
        return
      }
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

  /** Zuordnung: neben jedem linken Begriff eine Auswahl mit allen rechten Begriffen. */
  private renderMatch(
    q: QuizQuestion,
    id: string,
    answers: () => Record<string, number>,
    lesson: Lesson | undefined,
    explanation: HTMLElement,
    updateScore: () => void,
  ): HTMLElement {
    const pairs = q.pairs!
    const order = matchOrder(q)
    const grid = h('div', { class: 'learn-match' })
    // Ohne Lektion (Aufgaben) merkt sich die Zuordnung ihre Antworten nur, solange sie angezeigt wird.
    let local: Record<string, number> = {}
    const read = () => (lesson ? answers() : local)
    const write = (next: Record<string, number>) => (lesson ? progress.updateLesson(lesson.id, { quiz: next }) : (local = next))
    const value = (pi: number) => read()[`${id}-${pi}`]
    const selects = pairs.map((p) => {
      const select = h('select', { class: 'learn-match-select' }) as HTMLSelectElement
      select.append(h('option', { value: '' }, '–'))
      order.forEach((text, oi) => select.append(h('option', { value: String(oi) }, text)))
      const label = html('label', { class: 'learn-match-left' }, inline(p.left))
      label.append(select)
      grid.append(label)
      return select
    })
    const show = () => {
      const complete = pairs.every((_, pi) => value(pi) !== undefined)
      selects.forEach((select, pi) => {
        const v = value(pi)
        select.value = v === undefined ? '' : String(v)
        select.classList.toggle('right', complete && order[v] === pairs[pi].right)
        select.classList.toggle('wrong', complete && order[v] !== pairs[pi].right)
      })
      explanation.hidden = !complete || !q.explanation
    }
    selects.forEach((select, pi) =>
      select.addEventListener('change', () => {
        const next = { ...read() }
        if (select.value === '') delete next[`${id}-${pi}`]
        else next[`${id}-${pi}`] = Number(select.value)
        write(next)
        show()
        updateScore()
      }),
    )
    show()
    return grid
  }
}

/** Rechte Seiten einer Zuordnung in fester, alphabetischer Reihenfolge, damit die Auswahl nichts verrät. */
function matchOrder(q: QuizQuestion): string[] {
  return (q.pairs ?? []).map((p) => p.right).sort((a, b) => a.localeCompare(b, 'de'))
}
