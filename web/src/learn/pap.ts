/**
 * PAP bauen: Ein Programmablaufplan mit leeren Plätzen, die fertigen Elemente legt man selbst hinein.
 *
 *     ::: pap
 *     titel: Übung: Kuchen backen als PAP
 *     auftrag: Lege jedes Element an seinen Platz.
 *     start: Start
 *     anweisung: Teig rühren
 *     frage: Teig glatt? | nein -> Teig rühren
 *     frage: Stäbchen sauber? | nein: 5 Minuten weiterbacken
 *     ausgabe: „Fertig!“
 *     ende: Ende
 *     erklärung: Wird gezeigt, wenn alles stimmt.
 *     :::
 *
 * Die Zeilen stehen von oben nach unten in der Hauptspalte. Eine Frage (Raute) hat zwei Ausgänge: Einer geht nach unten
 * weiter, der andere steht hinter `|`. `nein -> Text` führt mit einem Pfeil zurück nach oben zu dem Element mit diesem
 * Text. `nein: Text` führt zu einer Anweisung rechts daneben, von dort geht ein Pfeil zurück zur Raute (Schleife wie
 * „1 Minute warten“ in Lektion 1). Statt `nein` geht auch `ja`; der andere Ausgang ist dann der nach unten.
 */
export type PapShape = 'oval' | 'rechteck' | 'raute' | 'parallelogramm'

export interface PapNode {
  shape: PapShape
  text: string
  /** Nur Raute: welcher Ausgang zur Seite geht. */
  sideExit?: 'ja' | 'nein'
  /** Rücksprung nach oben: Index des Ziels in `nodes`. */
  backTo?: number
  /** Anweisung rechts neben der Raute (Schleife), Index in `nodes`. */
  side?: number
  /** Steht rechts neben einer Raute statt in der Hauptspalte. */
  isSide?: boolean
}

export interface Pap {
  title: string
  task: string
  nodes: PapNode[]
  explanation?: string
}

const shapeOf: Record<string, PapShape> = {
  start: 'oval',
  ende: 'oval',
  anweisung: 'rechteck',
  eingabe: 'parallelogramm',
  ausgabe: 'parallelogramm',
  frage: 'raute',
}

export function parsePap(inner: string[], file: string): Pap {
  const pap: Pap = { title: '', task: '', nodes: [] }
  const pending: { node: number; target: string; line: string }[] = []
  for (const raw of inner) {
    const line = raw.trim()
    if (!line) continue
    const m = /^([a-zäöü]+):\s*(.*)$/i.exec(line)
    if (!m) throw new Error(`${file}: Unbekannte Zeile im PAP: „${line}“.`)
    const key = m[1].toLowerCase()
    const value = m[2].trim()
    if (key === 'titel') pap.title = value
    else if (key === 'auftrag') pap.task = value
    else if (key === 'erklärung' || key === 'erklaerung') pap.explanation = value
    else if (key in shapeOf) {
      const [text, exit] = value.split(/\s+\|\s+/)
      if (!text) throw new Error(`${file}: Leeres Element im PAP: „${line}“.`)
      const node: PapNode = { shape: shapeOf[key], text: text.trim() }
      pap.nodes.push(node)
      if (key !== 'frage') {
        if (exit) throw new Error(`${file}: Nur eine Frage hat einen zweiten Ausgang: „${line}“.`)
        continue
      }
      const e = /^(ja|nein)\s*(->|:)\s*(.+)$/i.exec(exit ?? '')
      if (!e) throw new Error(`${file}: Eine Frage braucht „| nein -> Text“ oder „| nein: Text“: „${line}“.`)
      node.sideExit = e[1].toLowerCase() as 'ja' | 'nein'
      if (e[2] === ':') {
        node.side = pap.nodes.length
        pap.nodes.push({ shape: 'rechteck', text: e[3].trim(), isSide: true })
      } else {
        pending.push({ node: pap.nodes.length - 1, target: e[3].trim(), line })
      }
    } else throw new Error(`${file}: Unbekannter Schlüssel „${m[1]}“ im PAP.`)
  }
  for (const p of pending) {
    const target = pap.nodes.findIndex((n, i) => i < p.node && !n.isSide && n.text === p.target)
    if (target < 0) throw new Error(`${file}: Rücksprung zu „${p.target}“: kein Element mit diesem Text weiter oben („${p.line}“).`)
    pap.nodes[p.node].backTo = target
  }
  if (!pap.title) throw new Error(`${file}: Ein PAP braucht einen Titel.`)
  if (pap.nodes.length < 3) throw new Error(`${file}: PAP „${pap.title}“ braucht mindestens drei Elemente.`)
  return pap
}

/** Ein Element passt auf einen Platz, wenn Form und Text stimmen (zwei gleiche Elemente sind austauschbar). */
export function papFits(pap: Pap, slot: number, card: number): boolean {
  const a = pap.nodes[slot]
  const b = pap.nodes[card]
  return a.shape === b.shape && a.text === b.text
}

/** Lage im Bild (viewBox 400 breit): Mittelpunkt, Breite, Höhe. */
export interface PapBox {
  x: number
  y: number
  w: number
  h: number
}

export const PAP_WIDTH = 400
const MAIN_X = 140
const MAIN_W = 180
const SIDE_X = 327
const SIDE_W = 130
const GAP = 24

export function papHeight(shape: PapShape): number {
  return shape === 'raute' ? 56 : shape === 'oval' ? 30 : 36
}

/** Plätze der Elemente und Gesamthöhe; Seitenkästen stehen auf Höhe ihrer Raute. */
export function papLayout(pap: Pap): { boxes: PapBox[]; height: number } {
  const boxes: PapBox[] = []
  let y = 10
  pap.nodes.forEach((n, i) => {
    if (n.isSide) return
    const h = papHeight(n.shape)
    // Platz für den Pfeil, der von oben in eine Schleife zurückkommt.
    if (pap.nodes.some((o) => o.backTo === i) || n.side !== undefined) y += 12
    boxes[i] = { x: MAIN_X, y: y + h / 2, w: n.shape === 'raute' ? 170 : n.shape === 'oval' ? 110 : MAIN_W, h }
    if (n.side !== undefined) boxes[n.side] = { x: SIDE_X, y: y + h / 2, w: SIDE_W, h: 40 }
    y += h + GAP
  })
  return { boxes, height: y - GAP + 10 }
}

/** Text auf höchstens zwei Zeilen umbrechen, wenn er bei Schriftgröße 13 nicht in `width` passt. */
export function papLines(text: string, width: number): string[] {
  const fits = (s: string) => s.length * 6.6 <= width
  if (fits(text)) return [text]
  const words = text.split(' ')
  let best: string[] = [text]
  let bestLong = Infinity
  for (let i = 1; i < words.length; i++) {
    const lines = [words.slice(0, i).join(' '), words.slice(i).join(' ')]
    const long = Math.max(...lines.map((l) => l.length))
    if (long < bestLong) {
      best = lines
      bestLong = long
    }
  }
  return best
}
