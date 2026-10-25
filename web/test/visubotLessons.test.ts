import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { checkExercise, loopDepth, usedElementTypes } from '../src/core/exerciseCheck'
import { ElementType } from '../src/core/model'
import { diagram, lessons, reference, tasks, useContentLanguage, useVisuBotContent, world } from '../src/learn/content'
import type { Block, Exercise } from '../src/learn/lessonFormat'
import { subprogramName } from '../src/core/simulation'
import { isMBotPart, MBOT_PARTS } from '../src/core/mbot'

/** Unterprogramme einer Übung (`unterprogramm:`) für Aufrufe in der Musterlösung */
const resolver = (ex: Exercise) => {
  const subs = ex.subprograms.map((f) => diagram(f)!)
  return (name: string) => subs.find((s) => subprogramName(s.caption).toLowerCase() === subprogramName(name).toLowerCase())
}

const allBlocks = (): { where: string; block: Block }[] => [
  ...lessons.flatMap((l) => l.steps.flatMap((s) => s.blocks.map((block) => ({ where: `${l.id} / ${s.title}`, block })))),
  ...tasks.flatMap((t) => t.blocks.map((block) => ({ where: t.id, block }))),
]

describe.each(['de', 'en'] as const)('VisuBot-Lektionen (%s)', (lang) => {
  beforeAll(() => {
    useVisuBotContent('series')
    useContentLanguage(lang)
  })
  afterAll(() => useVisuBotContent('off'))

  it('zeigt nur die VisuBot-Lektionen, lückenlos nummeriert', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(2)
    lessons.forEach((l, i) => {
      expect(l.number, l.id).toBe(i + 1)
      expect(l.section, l.id).toBe('VisuBot')
    })
    expect(tasks.length).toBeGreaterThanOrEqual(1)
  })

  it('jede Übung prüft eine Fahrt, und die Musterlösung besteht sie', () => {
    let checked = 0
    for (const { where, block } of allBlocks()) {
      if (block.kind !== 'exercise') continue
      const ex = block.exercise
      expect(ex.id.startsWith('vb-'), `${where}: Kennung beginnt mit vb-`).toBe(true)
      expect(ex.tests.some((t) => t.drive || t.world || t.sensors || t.actions), `${where}: fahrt:, befehle:, welt: oder messwerte:`).toBe(true)
      expect(ex.hints.length).toBeGreaterThanOrEqual(2)
      const doc = diagram(ex.solution!)!
      expect(doc, `${where}: ${ex.solution}`).toBeDefined()
      for (const o of checkExercise(doc, ex.tests, resolver(ex), world)) expect(o.passed, `${where}: ${JSON.stringify(o.result)}`).toBe(true)
      for (const r of ex.requires) expect(usedElementTypes(doc).has(ElementType[r as keyof typeof ElementType])).toBe(true)
      if (ex.loopDepth) expect(loopDepth(doc.elements)).toBeGreaterThanOrEqual(ex.loopDepth)
      expect(checkExercise({ caption: '', elements: [] }, ex.tests, undefined, world).every((o) => o.passed)).toBe(false)
      checked++
    }
    expect(checked).toBeGreaterThanOrEqual(5)
  })

  it('Checklisten verweisen auf Schritte', () => {
    for (const l of lessons)
      for (const s of l.steps)
        for (const b of s.blocks) if (b.kind === 'checklist') for (const item of b.items) expect(item.step, `${l.id}: ${item.text}`).toBeDefined()
  })

  it('Lektion 1 ist eine Tour durch alle Teile, jedes gezeigte Teil ist im Text verlinkt', () => {
    const tour = lessons[0]
    const blocks = tour.steps.flatMap((s) => s.blocks)
    const shown = new Set(blocks.flatMap((b) => (b.kind === 'robotModel' ? b.focus : b.kind === 'robotQuiz' ? b.tasks.map((t) => t.part) : [])))
    expect([...shown].sort()).toEqual([...MBOT_PARTS].sort())
    expect(blocks.some((b) => b.kind === 'robotQuiz')).toBe(true)
    for (const step of tour.steps) {
      const text = JSON.stringify(step.blocks)
      const linked = new Set([...text.matchAll(/\{(?:teil|part)=([\w,]+)\}/g)].flatMap((m) => m[1].split(',')))
      for (const b of step.blocks) if (b.kind === 'robotModel') for (const p of b.focus) expect(linked, `${step.title}: ${p}`).toContain(p)
      for (const p of linked) expect(isMBotPart(p), `${step.title}: ${p}`).toBe(true)
    }
  })
})

describe.each(['de', 'en'] as const)('VisuBot im Kurs (%s)', (lang) => {
  beforeAll(() => {
    useVisuBotContent('course')
    useContentLanguage(lang)
  })
  afterAll(() => useVisuBotContent('off'))

  it('hängt 🤖-Schritte vor die Checkliste normaler Lektionen, deren mBot2-Übungen bestehen', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(40)
    const withRobot = lessons.filter((l) => l.steps.some((s) => s.title.startsWith('🤖')))
    expect(withRobot.map((l) => l.number)).toEqual(expect.arrayContaining([5, 13]))
    for (const l of withRobot) {
      const robot = l.steps.findIndex((s) => s.title.startsWith('🤖'))
      const checklist = l.steps.findIndex((s) => s.blocks.some((b) => b.kind === 'checklist'))
      if (checklist >= 0) expect(robot, l.id).toBeLessThan(checklist)
    }
    let checked = 0
    for (const l of withRobot)
      for (const s of l.steps.filter((s) => s.title.startsWith('🤖')))
        for (const b of s.blocks) {
          if (b.kind !== 'exercise') continue
          expect(b.exercise.id.startsWith('vb-')).toBe(true)
          const doc = diagram(b.exercise.solution!)!
          expect(doc, b.exercise.solution).toBeDefined()
          for (const o of checkExercise(doc, b.exercise.tests, resolver(b.exercise), world)) expect(o.passed, `${l.id}: ${b.exercise.id} ${JSON.stringify(o.result)}`).toBe(true)
          checked++
        }
    expect(checked).toBeGreaterThanOrEqual(4)
  })

  it('zeigt die mBot2-Tour als Lektion 0 vorn, mit derselben Kennung wie in der eigenen Reihe', () => {
    expect(lessons[0].number).toBe(0)
    expect(lessons[0].section).toBe('VisuBot')
    const tourId = lessons[0].id
    useVisuBotContent('series')
    expect(lessons[0].id).toBe(tourId)
    useVisuBotContent('course')
    expect(lessons[1].number).toBe(1)
  })

  it('Nachschlagen hat die mBot2-Kategorien, ohne VisuBot nicht', () => {
    expect(reference).toContain('## 🤖 mBot2')
    expect(reference).toContain('## 📡 mBot2')
    expect(reference).toContain('### ' + { de: 'Verzweigung', en: 'Branch' }[lang])
    useVisuBotContent('off')
    expect(reference).not.toContain('mBot2')
    useVisuBotContent('course')
  })

  it('zeigt normale Aufgaben und mBot2-Aufgaben mit kurs:', () => {
    expect(tasks.some((t) => t.id === 'treppe' && t.after === 13)).toBe(true)
    expect(tasks.some((t) => t.id === 'tunnel' && t.after === 12)).toBe(true)
    expect(tasks.some((t) => t.id === 'labyrinth' && t.after === 11)).toBe(true)
    expect(tasks.length).toBeGreaterThan(20)
  })
})
