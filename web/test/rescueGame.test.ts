import { describe, expect, it } from 'vitest'
import { contentLanguages, lessons, useContentLanguage } from '../src/learn/content'
import { crosswordGrid, parseCrosswordGame, parseRescueGame, RescueGameError } from '../src/learn/rescueGame'

const game = (extra = '', station = 'zahl: 1\nfeld: 1 2') =>
  `titel: Spiel
intro: Los
station: Eins
    int zahl = "AB".indexOf("B");
frage: Welche Zahl?
${station}
> Weil B bei 1 steht.
kreuzwort: Rätsel
- → 1 1 ABC: Anfang des Alphabets
- ↓ 1 3 CD: Danach
lösung: 1 2, 2 3
${extra}
tor: Tor
    String w = "___";
ende: Frei`.split('\n')

describe('Spiel „Prinzessin retten“', () => {
  it('liest Stationen, Rätsel und Lösungswort', () => {
    const g = parseRescueGame(game(), 'x.md')
    expect(g.stations[0]).toMatchObject({ answer: 1, row: 0, col: 1, code: 'int zahl = "AB".indexOf("B");' })
    expect(g.keyword).toBe('BD')
    expect(g.words.map((w) => w.number)).toEqual([1, 2])
    expect(crosswordGrid(g)).toEqual([
      ['A', 'B', 'C'],
      ['', '', 'D'],
    ])
  })

  it('prüft, ob alphabet.charAt(zahl) ins Feld passt', () => {
    expect(() => parseRescueGame(game('', 'zahl: 2\nfeld: 1 2'), 'x.md')).toThrow(/charAt\(2\) ist C/)
    expect(() => parseRescueGame(game('', 'zahl: 40\nfeld: 1 2'), 'x.md')).toThrow(RescueGameError)
  })

  it('meldet Kreuzungen, die nicht passen', () => {
    const lines = game().map((l) => (l.startsWith('- ↓') ? '- ↓ 1 3 XD: Falsch' : l))
    expect(() => parseRescueGame(lines, 'x.md')).toThrow(/XD passt/)
  })

  it.each(contentLanguages)('Lektion 17 (%s): Das Tor öffnet BREAK', (lang) => {
    useContentLanguage(lang)
    const blocks = lessons.find((l) => l.id.startsWith('17'))!.steps.flatMap((s) => s.blocks)
    const block = blocks.find((b) => b.kind === 'rescueGame')
    expect(block?.kind).toBe('rescueGame')
    if (block?.kind !== 'rescueGame') return
    expect(block.game.keyword).toBe('BREAK')
    expect(block.game.stations).toHaveLength(6)
  })
})

describe('Begriffe-Rätsel (::: spiel kreuzwort)', () => {
  it('legt die Wörter ins Gitter und liest das Lösungswort', () => {
    const game = parseCrosswordGame(['titel: t', 'intro: i', '- → 1 1 SENSOR: misst', '- ↓ 1 1 STOP: hält an', 'lösung: 1 2, 2 1, 1 1'], 't.md')
    expect(game.rows).toBe(4)
    expect(game.cols).toBe(6)
    expect(game.keyword).toBe('ETS')
    expect(game.words.map((w) => w.number)).toEqual([1, 1])
    expect(() => parseCrosswordGame(['titel: t', '- → 1 1 SENSOR: misst', '- ↓ 1 1 AKTOR: tut', 'lösung: 1 1'], 't.md')).toThrow(/passt/)
    expect(() => parseCrosswordGame(['titel: t', '- → 1 1 SENSOR: misst', '- ↓ 1 1 STOP: hält an'], 't.md')).toThrow(/lösung/)
  })
})
