import { describe, expect, it } from 'vitest'
import { mergeProgress } from '../src/learn/progress'

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
