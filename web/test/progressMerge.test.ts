import { describe, expect, it } from 'vitest'
import { mergeProgress, progress } from '../src/learn/progress'

describe('Lernstand zusammenführen', () => {
  it('erledigt bleibt erledigt, der weiteste Schritt zählt', () => {
    const mine = { lessons: { a: { step: 2, checks: { x: true } } }, exercises: { e: { xml: '<mine/>' } } }
    const theirs = { lessons: { a: { step: 5, done: true, checks: { x: false, y: true } }, b: { step: 1 } }, exercises: { e: { done: true, xml: '<theirs/>' }, f: { done: true } } }
    const m = mergeProgress(mine, theirs)
    expect(m.lessons.a).toEqual({ step: 5, done: true, checks: { x: true, y: true }, quiz: undefined })
    expect(m.lessons.b).toEqual({ step: 1 })
    expect(m.exercises.e).toEqual({ done: true, xml: '<mine/>' })
    expect(m.exercises.f).toEqual({ done: true })
  })

  it('übernimmt die Datei, wenn im Browser nichts ist', () => {
    const theirs = { lessons: { a: { step: 3, done: true } }, exercises: { e: { done: true, xml: '<x/>' } } }
    expect(mergeProgress({ lessons: {}, exercises: {} }, theirs)).toEqual(theirs)
  })
})

describe('Lernstand aus der Datei', () => {
  const file = (lessons: object, extra: object = {}) => JSON.stringify({ format: 'visustruct-lernstand', version: 1, lessons, exercises: {}, ...extra })

  it('die Datei ersetzt den Stand, alte Reste verschwinden', () => {
    expect(progress.loadFile(file({ a: { step: 4, done: true } }))).toBe(true)
    progress.updateLesson('b', { step: 2 })
    expect(progress.loadFile(file({ c: { step: 1 } }))).toBe(true)
    expect(progress.lesson('c').step).toBe(1)
    expect(progress.lesson('a').step).toBe(0)
    expect(JSON.parse(progress.toFile()).lessons.b).toBeUndefined()
  })

  it('behält auf Wunsch, was in der Sitzung vor dem Öffnen gelernt wurde, und übernimmt die Ansicht', () => {
    progress.clear()
    progress.updateLesson('a', { step: 3 })
    progress.loadFile(file({ b: { step: 2 } }, { view: { tab: 'tasks' } }), true)
    expect(progress.lesson('a').step).toBe(3)
    expect(progress.lesson('b').step).toBe(2)
    expect(progress.view()).toEqual({ tab: 'tasks' })
  })

  it('übernimmt umbenannte VisuBot-Lektionen und ignoriert fremde Dateien', () => {
    progress.loadFile(file({ '13-lautsprecher': { step: 5 } }))
    expect(progress.lesson('14-lautsprecher').step).toBe(5)
    expect(progress.loadFile('{"lessons":{}}')).toBe(false)
  })

  it('merkt sich nichts im Browser', () => {
    progress.updateLesson('x', { step: 1 })
    expect(localStorage.getItem('visustruct.learn.progress')).toBeNull()
  })
})
