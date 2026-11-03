import { afterAll, describe, expect, it } from 'vitest'
import { lessons, useContentLanguage, useVisuBotContent } from '../src/learn/content'
import { driveRound, parseDriveGame } from '../src/learn/driveGame'

describe('Spiel „Wo landet der mBot2?“', () => {
  it('liest Runden und meldet Fehler im Format', () => {
    const game = parseDriveGame(['titel: t', 'frage: Wo?', 'runde:', '    mbot.forward(60);', 'karte: ... | ... | .^.', 'ziel: 1,0', '> Zwei Felder.'], 't.md')
    expect(game.field).toBe(30)
    expect(game.rounds[0]).toMatchObject({ code: 'mbot.forward(60);', map: ['...', '...', '.^.'], target: { col: 1, row: 0 }, question: 'Wo?', explanation: 'Zwei Felder.' })
    expect(() => parseDriveGame(['titel: t', 'frage: Wo?', 'runde:', '    mbot.forward();', 'karte: ... | ...', 'ziel: 1,0'], 't.md')).toThrow(/Start/)
    expect(() => parseDriveGame(['titel: t', 'frage: Wo?', 'runde:', '    mbot.forward();', 'karte: .^.', 'ziel: 5,0'], 't.md')).toThrow(/außerhalb/)
    expect(() => parseDriveGame(['titel: t', 'feld: 25', 'runde:'], 't.md')).toThrow(/feld/)
  })

  it('rechnet die Fahrt mit der Simulation, auch mit Wänden', () => {
    const game = parseDriveGame(
      ['titel: t', 'frage: Wo?', 'runde:', '    while (mbot.getDistance() > 15) {', '        mbot.forward(30);', '    }', 'karte: ### | ... | ... | .^.', 'ziel: 1,1'],
      't.md',
    )
    const result = driveRound(game.rounds[0], game.field)
    expect(result.cell).toEqual({ col: 1, row: 1 })
    expect(result.run.bumps).toBe(0)
  })

  describe.each(['de', 'en'] as const)('in den VisuBot-Lektionen (%s)', (lang) => {
    afterAll(() => useVisuBotContent('off'))
    it('jede Runde endet ohne Anstoßen mitten auf dem angegebenen Feld', () => {
      useVisuBotContent('on')
      useContentLanguage(lang)
      let checked = 0
      for (const lesson of lessons) {
        for (const block of lesson.steps.flatMap((s) => s.blocks)) {
          if (block.kind !== 'driveGame') continue
          for (const [i, round] of block.game.rounds.entries()) {
            const where = `${lesson.id}, Runde ${i + 1}`
            const result = driveRound(round, block.game.field)
            expect(result.problems, where).toEqual([])
            expect(result.run.stop, where).toBe('end')
            expect(result.run.bumps, where).toBe(0)
            expect(result.cell, where).toEqual(round.target)
            const F = block.game.field
            const cx = -(round.map[0].length * F) / 2 + (round.target.col + 0.5) * F
            const cy = (round.map.length * F) / 2 - (round.target.row + 0.5) * F
            expect(Math.hypot(result.end.x - cx, result.end.y - cy), `${where}: nicht mitten im Feld`).toBeLessThan(1)
            checked++
          }
        }
      }
      expect(checked).toBeGreaterThanOrEqual(20)
    })
  })
})
