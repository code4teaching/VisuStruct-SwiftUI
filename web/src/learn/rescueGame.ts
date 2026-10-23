/**
 * Spiel „Prinzessin retten“ (Block `::: spiel prinzessin`): An jeder Station kommt eine Zahl heraus,
 * `alphabet.charAt(zahl)` macht daraus einen Buchstaben, der ein Feld im Kreuzworträtsel füllt. Die markierten
 * Felder des Rätsels ergeben das geheime Wort, das am Ende das Tor öffnet.
 *
 * Format (Schlüsselwörter auf Deutsch, auch in den Übersetzungen):
 *
 *     titel: Spiel: Prinzessin retten
 *     intro: Der Fuchs hat …
 *     alphabet: ABCDEFGHIJKLMNOPQRSTUVWXYZ    (ohne Angabe A bis Z)
 *
 *     station: Am Burggraben                    (Name der Station)
 *         String name = "   Zora   ";          (Code, mit vier Leerzeichen eingerückt)
 *     frage: Welche Zahl steht in `zahl`?
 *     zahl: 4
 *     feld: 5 1                                (Zeile und Spalte im Rätsel, ab 1)
 *     tipp: …                                  (nach einer falschen Antwort)
 *     > Erklärung
 *
 *     kreuzwort: Löse das Rätsel …             (Text über dem Rätsel)
 *     - → 1 3 BOOLEAN: Datentyp für wahr oder falsch     (→ waagrecht, ↓ senkrecht, Zeile, Spalte)
 *     lösung: 1 3, 4 3                         (Felder des geheimen Worts in seiner Reihenfolge)
 *
 *     tor: Vor dir ist das Tor …               (Text vor dem Schloss)
 *         if (eingabe.equals("???")) {         (Code, ___ wird zum Eingabefeld)
 *     ende: Zora ist frei!
 */

export interface RescueStation {
  name: string
  code: string
  question: string
  answer: number
  /** Feld im Rätsel (ab 0). */
  row: number
  col: number
  hint: string
  explanation: string
}

export interface CrosswordWord {
  /** Nummer im Rätsel, wie sie im Feld steht. */
  number: number
  across: boolean
  row: number
  col: number
  word: string
  clue: string
}

export interface RescueGame {
  title: string
  intro: string
  alphabet: string
  stations: RescueStation[]
  crosswordText: string
  rows: number
  cols: number
  words: CrosswordWord[]
  /** Felder des geheimen Worts (ab 0). */
  solution: { row: number; col: number }[]
  keyword: string
  gateText: string
  gateCode: string
  end: string
}

export class RescueGameError extends Error {}

export const gatePlaceholder = '___'

/** Das Rätsel als Gitter: `grid[zeile][spalte]` ist der Buchstabe oder `''`. */
export function crosswordGrid(game: Pick<RescueGame, 'rows' | 'cols' | 'words'>): string[][] {
  const grid = Array.from({ length: game.rows }, () => Array<string>(game.cols).fill(''))
  for (const w of game.words) [...w.word].forEach((c, k) => (grid[w.row + (w.across ? 0 : k)][w.col + (w.across ? k : 0)] = c))
  return grid
}

export function parseRescueGame(lines: string[], file: string): RescueGame {
  const fail = (msg: string): never => {
    throw new RescueGameError(`${file}: ${msg}`)
  }
  const cell = (text: string, where: string) => {
    const m = /^(\d+)\s+(\d+)$/.exec(text.trim())
    if (!m || Number(m[1]) < 1 || Number(m[2]) < 1) return fail(`${where}: „${text}“ ist kein Feld (Zeile Spalte, ab 1).`)
    return { row: Number(m[1]) - 1, col: Number(m[2]) - 1 }
  }
  let title = ''
  let intro = ''
  let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let crosswordText = ''
  let gateText = ''
  let gateCode = ''
  let end = ''
  const stations: (Omit<RescueStation, 'answer' | 'row' | 'col'> & { answer?: number; row?: number; col?: number })[] = []
  const raw: { across: boolean; row: number; col: number; word: string; clue: string }[] = []
  let solution: { row: number; col: number }[] = []
  /** Wohin eingerückte Zeilen gehören. */
  let codeTarget: 'station' | 'gate' | undefined
  let section: 'start' | 'station' | 'crossword' | 'gate' = 'start'
  for (const line of lines) {
    const text = line.trim()
    if (codeTarget && (/^( {4}|\t)/.test(line) || text === '')) {
      const code = line.replace(/^( {4}|\t)/, '')
      if (codeTarget === 'station') {
        const s = stations[stations.length - 1]
        s.code += (s.code ? '\n' : '') + code
      } else gateCode += (gateCode ? '\n' : '') + code
      continue
    }
    codeTarget = undefined
    if (!text) continue
    const key = /^(titel|intro|alphabet|station|frage|zahl|feld|tipp|kreuzwort|lösung|loesung|tor|ende):\s*(.*)$/.exec(text)
    if (key) {
      const [, name, value] = key
      if (name === 'station') {
        stations.push({ name: value, code: '', question: '', hint: '', explanation: '' })
        section = 'station'
        codeTarget = 'station'
      } else if (name === 'kreuzwort') {
        crosswordText = value
        section = 'crossword'
      } else if (name === 'tor') {
        gateText = value
        section = 'gate'
        codeTarget = 'gate'
      } else if (name === 'titel') title = value
      else if (name === 'intro') intro = value
      else if (name === 'alphabet') alphabet = value
      else if (name === 'ende') end = value
      else if (name === 'lösung' || name === 'loesung') {
        if (section !== 'crossword') fail('„lösung:“ gehört zum Kreuzworträtsel.')
        solution = value.split(',').map((c) => cell(c, 'lösung'))
      } else {
        if (section !== 'station') fail(`„${name}:“ gehört in eine Station.`)
        const s = stations[stations.length - 1]
        if (name === 'frage') s.question = value
        else if (name === 'tipp') s.hint = value
        else if (name === 'zahl') s.answer = /^-?\d+$/.test(value) ? Number(value) : fail(`Station „${s.name}“: „zahl:“ muss eine ganze Zahl sein.`)
        else Object.assign(s, cell(value, `Station „${s.name}“`))
      }
      continue
    }
    if (section === 'crossword') {
      const m = /^-\s+([→↓])\s+(\d+)\s+(\d+)\s+([A-ZÄÖÜ]+):\s*(.+)$/u.exec(text)
      if (!m) fail(`Kreuzworträtsel: „${text}“ verstehe ich nicht (z. B. „- → 1 3 STRING: Hinweis“).`)
      raw.push({ across: m![1] === '→', row: Number(m![2]) - 1, col: Number(m![3]) - 1, word: m![4], clue: m![5] })
      continue
    }
    if (section === 'station' && text.startsWith('>')) {
      const s = stations[stations.length - 1]
      s.explanation += (s.explanation ? ' ' : '') + text.slice(1).trim()
      continue
    }
    fail(`Unbekannte Zeile im Spiel: „${text}“`)
  }

  if (!title) fail('Das Spiel braucht eine Zeile „titel:“.')
  if (!stations.length) fail('Das Spiel braucht mindestens eine „station:“.')
  if (!raw.length) fail('Das Spiel braucht ein „kreuzwort:“ mit Wörtern.')
  if (!solution.length) fail('Das Kreuzworträtsel braucht eine Zeile „lösung:“.')
  if (!gateCode.includes(gatePlaceholder)) fail(`Der Code bei „tor:“ braucht ${gatePlaceholder} für das Eingabefeld.`)
  if (new Set(alphabet).size !== alphabet.length) fail('Im Alphabet kommt ein Zeichen doppelt vor.')

  // Wörter ins Gitter legen: Kreuzungen müssen passen.
  const rows = Math.max(...raw.map((w) => w.row + (w.across ? 1 : w.word.length)))
  const cols = Math.max(...raw.map((w) => w.col + (w.across ? w.word.length : 1)))
  const grid = Array.from({ length: rows }, () => Array<string>(cols).fill(''))
  for (const w of raw) {
    ;[...w.word].forEach((c, k) => {
      const r = w.row + (w.across ? 0 : k)
      const col = w.col + (w.across ? k : 0)
      if (grid[r][col] && grid[r][col] !== c) fail(`Kreuzworträtsel: ${w.word} passt in Zeile ${r + 1}, Spalte ${col + 1} nicht (dort steht ${grid[r][col]}).`)
      grid[r][col] = c
    })
  }
  // Nummern wie in der Zeitung: von oben nach unten, links nach rechts; zwei Wörter im selben Feld teilen sich eine.
  const starts = [...new Set(raw.map((w) => w.row * cols + w.col))].sort((a, b) => a - b)
  const words: CrosswordWord[] = raw.map((w) => ({ ...w, number: starts.indexOf(w.row * cols + w.col) + 1 }))
  const letterAt = (r: number, c: number) => grid[r]?.[c] ?? ''

  const keyword = solution
    .map(({ row, col }) => letterAt(row, col) || fail(`lösung: In Zeile ${row + 1}, Spalte ${col + 1} ist kein Feld.`))
    .join('')

  const checked = stations.map((s) => {
    if (!s.code) fail(`Station „${s.name}“: Code fehlt.`)
    if (!s.question) fail(`Station „${s.name}“: „frage:“ fehlt.`)
    if (s.answer === undefined) fail(`Station „${s.name}“: „zahl:“ fehlt.`)
    if (s.row === undefined) fail(`Station „${s.name}“: „feld:“ fehlt.`)
    const letter = alphabet.charAt(s.answer!)
    if (!letter) fail(`Station „${s.name}“: alphabet.charAt(${s.answer}) gibt es nicht.`)
    const target = letterAt(s.row!, s.col!)
    if (target !== letter) fail(`Station „${s.name}“: alphabet.charAt(${s.answer}) ist ${letter}, im Feld ${s.row! + 1} ${s.col! + 1} steht aber „${target}“.`)
    s.code = s.code.replace(/\n+$/, '')
    return s as RescueStation
  })
  return { title, intro, alphabet, stations: checked, crosswordText, rows, cols, words, solution, keyword, gateText, gateCode: gateCode.replace(/\n+$/, ''), end }
}
