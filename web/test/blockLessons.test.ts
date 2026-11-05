import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { checkExercise, usedElementTypes } from '../src/core/exerciseCheck'
import { ElementType } from '../src/core/model'
import { driveRound } from '../src/learn/driveGame'
import { diagram, lessons, showingBlockLessons, tasks, useBlockLessons, useContentLanguage, useVisuBotContent, world } from '../src/learn/content'

/**
 * Block-Lektionen für die 5./6. Klasse (Holger 5.11.): Ist in VisuBot die Block-Ansicht an, zeigt der Lernbereich diese
 * kurzen Lektionen. Statt Wissenstest gibt es nur „Das schaffst du heute“, Ausprobieren, ein Spiel und „Das hab ich geschafft“.
 */
describe('Block-Lektionen (de)', () => {
  beforeAll(() => {
    useVisuBotContent('on')
    useContentLanguage('de')
    useBlockLessons(true)
  })
  afterAll(() => {
    useBlockLessons(false)
    useVisuBotContent('off')
  })

  it('erscheinen nur mit Block-Ansicht in VisuBot, ohne Aufgaben', () => {
    expect(showingBlockLessons()).toBe(true)
    expect(lessons.length).toBeGreaterThanOrEqual(7)
    expect(lessons.every((l) => l.blocks && l.robot)).toBe(true)
    lessons.forEach((l, i) => expect(l.number, l.id).toBe(i + 1))
    expect(tasks).toEqual([])
    useBlockLessons(false)
    expect(lessons.some((l) => l.blocks)).toBe(false)
    expect(lessons.length).toBeGreaterThan(20)
    useVisuBotContent('off')
    useBlockLessons(true)
    expect(showingBlockLessons()).toBe(false)
    useVisuBotContent('on')
    expect(showingBlockLessons()).toBe(true)
  })

  it('sind kurz: Kompetenzen vorn, ein Spiel, die Checkliste am Ende, kein Wissenstest', () => {
    for (const l of lessons) {
      const kinds = l.steps.map((s) => s.blocks.map((b) => b.kind as string))
      expect(l.steps.length, l.id).toBeLessThanOrEqual(7)
      expect(l.steps[0].title, l.id).toBe('Das schaffst du heute')
      expect(kinds[0], l.id).toContain('competences')
      expect(l.steps[l.steps.length - 1].title, l.id).toBe('Das hab ich geschafft')
      expect(kinds[kinds.length - 1], l.id).toContain('checklist')
      expect(kinds.flat().filter((k) => k === 'checklist').length, l.id).toBe(1)
      expect(kinds.flat(), l.id).not.toContain('quiz')
      expect(kinds.slice(0, -1).flat().some((k) => k === 'driveGame' || k === 'game' || k === 'roundGame'), `${l.id}: Spiel`).toBe(true)
    }
  })

  it('jede Übung prüft den mBot2, und die Musterlösung besteht sie', () => {
    let checked = 0
    for (const l of lessons) {
      for (const block of l.steps.flatMap((s) => s.blocks)) {
        if (block.kind !== 'exercise') continue
        const ex = block.exercise
        const where = `${l.id}: ${ex.id}`
        expect(ex.id.startsWith('vbb-'), where).toBe(true)
        expect(ex.tests.some((t) => t.drive || t.world || t.sensors || t.actions), where).toBe(true)
        expect(ex.hints.length, where).toBeGreaterThanOrEqual(2)
        const doc = diagram(ex.solution!)!
        expect(doc, where).toBeDefined()
        for (const o of checkExercise(doc, ex.tests, undefined, world)) expect(o.passed, `${where}: ${JSON.stringify(o.result)}`).toBe(true)
        for (const r of ex.requires) expect(usedElementTypes(doc).has(ElementType[r as keyof typeof ElementType]), where).toBe(true)
        expect(checkExercise({ caption: '', elements: [] }, ex.tests, undefined, world).every((o) => o.passed), where).toBe(false)
        checked++
      }
    }
    expect(checked).toBeGreaterThanOrEqual(17)
  })

  it('jede Runde von „Wo landet der mBot2?“ endet auf dem angegebenen Feld', () => {
    let checked = 0
    for (const l of lessons) {
      for (const block of l.steps.flatMap((s) => s.blocks)) {
        if (block.kind !== 'driveGame') continue
        for (const [i, round] of block.game.rounds.entries()) {
          const where = `${l.id}, Runde ${i + 1}`
          const result = driveRound(round, block.game.field)
          expect(result.problems, where).toEqual([])
          expect(result.run.bumps, where).toBe(0)
          expect(result.cell, where).toEqual(round.target)
          checked++
        }
      }
    }
    expect(checked).toBeGreaterThanOrEqual(16)
  })
})
