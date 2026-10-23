import { describe, expect, it } from 'vitest'
import { evaluate, explain, makeRound, parseBoolGame } from '../src/learn/boolGame'

describe('Spiel „Wahr oder falsch?“', () => {
  it('wertet Vergleiche, &&, || und ! wie Java aus', () => {
    expect(evaluate('alter >= 12 && alter < 18', { alter: 15 })).toBe(true)
    expect(evaluate('alter >= 12 && alter < 18', { alter: 18 })).toBe(false)
    expect(evaluate('tag == 6 || tag == 7', { tag: 7 })).toBe(true)
    expect(evaluate('!(note >= 1 && note <= 6)', { note: 0 })).toBe(true)
    expect(evaluate('a || b && c', { a: false, b: true, c: false })).toBe(false)
    expect(evaluate('(alter >= 12 && alter < 18) || schueler', { alter: 30, schueler: true })).toBe(true)
    expect(evaluate('!schueler', { schueler: false })).toBe(true)
  })

  it('erklärt die Auswertung in Schritten', () => {
    expect(explain('alter >= 12 && alter < 18', { alter: 15 })).toEqual(['alter >= 12 && alter < 18', '15 >= 12 && 15 < 18', 'true && true', 'true'])
    expect(explain('!schueler', { schueler: true })).toEqual(['!schueler', '!true', 'false'])
  })

  it('liest den Block und erzeugt Runden vom leichten zum schweren', () => {
    const game = parseBoolGame(['alter: 8..20', 'schueler: boolean', '? alter >= 18', '? alter >= 12 && schueler'], 'x.md')
    expect(game.vars).toHaveLength(2)
    expect(makeRound(game, 0, 10, () => 0).condition).toBe('alter >= 18')
    const last = makeRound(game, 9, 10, () => 0.9)
    expect(last.condition).toBe('alter >= 12 && schueler')
    expect(last.answer).toBe(evaluate(last.condition, last.values))
  })

  it('meldet Fehler im Block', () => {
    expect(() => parseBoolGame(['? x > 1'], 'x.md')).toThrow(/Unbekannte Variable/)
    expect(() => parseBoolGame(['alter: viel'], 'x.md')).toThrow(/Unbekannte Zeile/)
  })
})
