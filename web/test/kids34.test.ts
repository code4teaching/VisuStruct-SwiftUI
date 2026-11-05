import { beforeAll, describe, expect, it } from 'vitest'
import { checkExercise, usedElementTypes } from '../src/core/exerciseCheck'
import { ElementType } from '../src/core/model'
import { driveRound } from '../src/learn/driveGame'
import { diagram, lessons, tasks, useContentLanguage, useOnlyBlockLessons, world } from '../src/learn/content'
import { parseLiveJava } from '../src/core/javaParser'

/**
 * VisuBot Kids, Klasse 3–4 (Holger 5.11.): nur „wiederhole n mal“ und „wenn/sonst“, keine anderen Schleifen, kein switch;
 * Sensoren nur als Ja/Nein-Fragen. Jede Übung zeigt vorher ein Bild der Blöcke zum Nachbauen.
 */
describe('VisuBot Kids, Klasse 3–4', () => {
  beforeAll(() => {
    useContentLanguage('de')
    useOnlyBlockLessons('34')
  })

  it('hat 8 Lektionen und 4 eigene Aufgaben', () => {
    expect(lessons.map((l) => l.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(lessons.every((l) => l.blocks)).toBe(true)
    expect(tasks.length).toBe(4)
    expect(tasks.every((t) => t.id.startsWith('kids-'))).toBe(true)
  })

  it('ist kurz und hat Kompetenzen, ein Spiel und die Checkliste, keinen Wissenstest', () => {
    for (const l of lessons) {
      const kinds = l.steps.map((s) => s.blocks.map((b) => b.kind as string))
      expect(l.steps.length, l.id).toBeLessThanOrEqual(7)
      expect(l.steps[0].title, l.id).toBe('Das schaffst du heute')
      expect(kinds[0], l.id).toContain('competences')
      expect(l.steps[l.steps.length - 1].title, l.id).toBe('Das hab ich geschafft')
      expect(kinds.flat(), l.id).not.toContain('quiz')
      expect(kinds.slice(0, -1).flat().some((k) => k === 'driveGame' || k === 'roundGame'), `${l.id}: Spiel`).toBe(true)
    }
  })

  it('zeigt vor jeder Übung in den Lektionen ein Bild zum Nachbauen, und das Bild ist gültiges Java', () => {
    for (const l of lessons) {
      const blocks = l.steps.flatMap((s) => s.blocks)
      const firstExercise = blocks.findIndex((b) => b.kind === 'exercise')
      const firstPicture = blocks.findIndex((b) => b.kind === 'blockPicture')
      expect(firstPicture, l.id).toBeGreaterThanOrEqual(0)
      expect(firstPicture, l.id).toBeLessThan(firstExercise)
      for (const b of blocks) if (b.kind === 'blockPicture') expect(parseLiveJava(b.java, {} as never).problems, l.id).toEqual([])
    }
  })

  it('benutzt nur wiederhole n mal und wenn/sonst, jede Übung prüft den mBot2 und die Musterlösung besteht', () => {
    const allowed = new Set([ElementType.anweisung, ElementType.verzweigung, ElementType.forSchleife])
    let checked = 0
    const sources = [...lessons.map((l) => ({ id: l.id, blocks: l.steps.flatMap((s) => s.blocks) })), ...tasks.map((t) => ({ id: t.id, blocks: t.blocks }))]
    for (const s of sources) {
      for (const block of s.blocks) {
        if (block.kind === 'blockPicture') expect(block.java, s.id).not.toMatch(/\b(while|do|switch|break)\b/)
        if (block.kind !== 'exercise') continue
        const ex = block.exercise
        const where = `${s.id}: ${ex.id}`
        expect(ex.id.startsWith('vbk-'), where).toBe(true)
        expect(ex.hints.length, where).toBeGreaterThanOrEqual(2)
        const doc = diagram(ex.solution!)!
        expect(doc, where).toBeDefined()
        for (const type of usedElementTypes(doc)) expect(allowed.has(type), `${where}: ${ElementType[type]}`).toBe(true)
        for (const o of checkExercise(doc, ex.tests, undefined, world)) expect(o.passed, `${where}: ${JSON.stringify(o.result)}`).toBe(true)
        for (const r of ex.requires) expect(usedElementTypes(doc).has(ElementType[r as keyof typeof ElementType]), where).toBe(true)
        expect(checkExercise({ caption: '', elements: [] }, ex.tests, undefined, world).every((o) => o.passed), where).toBe(false)
        checked++
      }
    }
    expect(checked).toBeGreaterThanOrEqual(24)
  })

  it('jede Runde von „Wo landet der mBot2?“ endet auf dem angegebenen Feld', () => {
    for (const l of lessons)
      for (const block of l.steps.flatMap((s) => s.blocks)) {
        if (block.kind !== 'driveGame') continue
        for (const [i, round] of block.game.rounds.entries()) {
          const result = driveRound(round, block.game.field)
          expect(result.problems, `${l.id} ${i + 1}`).toEqual([])
          expect(result.run.bumps, `${l.id} ${i + 1}`).toBe(0)
          expect(result.cell, `${l.id} ${i + 1}`).toEqual(round.target)
        }
      }
  })
})
