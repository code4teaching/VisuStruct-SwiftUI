import { generateLiveCode, livePlaceholderEnd, livePlaceholderStart, type LiveLabels } from './codeGenerator'
import { parseLiveJava, type JavaParseOptions, type ParsedJava } from './javaParser'
import type { VSDocument, VSElement } from './model'
import { parseSubprogramHeader } from './simulation'

/**
 * Getippter Java-Code und Struktogramm gehören zusammen: Ändert man danach das Struktogramm,
 * werden nur die Zeilen der geänderten Elemente neu geschrieben. Eigene Kommentare, Leerzeilen
 * und Einrückungen im übrigen Code bleiben so, wie man sie getippt hat.
 */

/** Erzeugter Java-Code der Ansicht „Code live“ als reiner Text (Platzhalter ohne Markierung). */
export function plainLiveJava(doc: VSDocument, labels: LiveLabels): string {
  return generateLiveCode(doc, 'java', labels).text.replaceAll(livePlaceholderStart, '').replaceAll(livePlaceholderEnd, '')
}

/** Zum Vergleichen: ohne Leerraum, Kommentar am Zeilenende weg (ganze Kommentarzeilen bleiben). */
function normalized(line: string): string {
  const code = splitTrailingComment(line).code
  return (code.trim() === '' ? line : code).replace(/\s+/g, '')
}

/** `x++; // zählen` → Code und Kommentar (Zeichenketten werden übersprungen). */
function splitTrailingComment(line: string): { code: string; comment: string } {
  let quote = ''
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (quote) {
      if (c === '\\') i++
      else if (c === quote) quote = ''
    } else if (c === '"' || c === "'") quote = c
    else if (c === '/' && line[i + 1] === '/') return { code: line.slice(0, i).replace(/\s+$/, ''), comment: line.slice(i) }
  }
  return { code: line, comment: '' }
}

type Op = { kind: 'keep'; a: number; b: number } | { kind: 'del'; a: number } | { kind: 'ins'; b: number }

/** Zeilenweiser Vergleich (längste gemeinsame Teilfolge). */
function diff(a: string[], b: string[], eq: (x: string, y: string) => boolean): Op[] {
  const n = a.length
  const m = b.length
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) lcs[i][j] = eq(a[i], b[j]) ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1])
  }
  const ops: Op[] = []
  let i = 0
  let j = 0
  while (i < n || j < m) {
    if (i < n && j < m && eq(a[i], b[j])) ops.push({ kind: 'keep', a: i++, b: j++ })
    // Bei Gleichstand erst löschen, dann einfügen: So landet die neue Zeile an der Stelle der alten.
    else if (i < n && (j === m || lcs[i + 1][j] >= lcs[i][j + 1])) ops.push({ kind: 'del', a: i++ })
    else ops.push({ kind: 'ins', b: j++ })
  }
  return ops
}

/**
 * `userText` gehört zu `oldDoc`; das Struktogramm wurde zu `newDoc` geändert.
 * Ergebnis: `userText` mit den Änderungen. Lässt sich das nicht sicher übertragen, der neu erzeugte Code.
 */
export function mergeLiveJava(userText: string, oldDoc: VSDocument, newDoc: VSDocument, labels: LiveLabels, opts: JavaParseOptions = {}): string {
  const generatedNew = plainLiveJava(newDoc, labels)
  const generatedOld = plainLiveJava(oldDoc, labels)
  if (userText === generatedOld) return generatedNew
  const oldLines = generatedOld.split('\n')
  const newLines = generatedNew.split('\n')
  const user = userText.split('\n')
  // Welche Zeile des getippten Codes entspricht welcher erzeugten Zeile?
  const where = new Array<number>(oldLines.length).fill(-1)
  for (const op of diff(oldLines, user, (x, y) => normalized(x) !== '' && normalized(x) === normalized(y))) {
    if (op.kind === 'keep') where[op.a] = op.b
  }
  const out: string[] = []
  let u = 0
  let comment = ''
  const copyUntil = (end: number) => {
    while (u < end) out.push(user[u++])
  }
  for (const op of diff(oldLines, newLines, (x, y) => x === y)) {
    if (op.kind === 'keep') {
      if (where[op.a] >= 0) {
        copyUntil(where[op.a] + 1)
        comment = ''
      }
    } else if (op.kind === 'del') {
      const at = where[op.a]
      if (at < 0) continue
      copyUntil(at)
      comment ||= splitTrailingComment(user[at]).comment
      u = at + 1
    } else {
      const line = newLines[op.b]
      out.push(comment && line.trim() !== '' ? `${line} ${comment}` : line)
      if (line.trim() !== '') comment = ''
    }
  }
  copyUntil(user.length)
  const merged = out.join('\n')
  // Nur übernehmen, wenn der Code wirklich das neue Struktogramm ergibt.
  const parsed = parseLiveJava(merged, labels, opts)
  return plainLiveJava(documentFromJava(newDoc, parsed), labels) === generatedNew ? merged : generatedNew
}

/**
 * Neues Dokument aus getipptem Code. Titel, Schrift und die Farben/Größen der Kästen bleiben,
 * soweit an derselben Stelle noch dieselbe Art Element steht.
 */
export function documentFromJava(prev: VSDocument, parsed: ParsedJava): VSDocument {
  const caption = parsed.caption ?? (parseSubprogramHeader(prev.caption) ? '' : prev.caption)
  return { ...prev, caption, elements: carryLooks(prev.elements, parsed.elements) }
}

function carryLooks(old: VSElement[], next: VSElement[]): VSElement[] {
  return next.map((e, i) => {
    const o = old[i]
    if (!o || o.type !== e.type) return e
    const out: VSElement = { ...e, zoomX: o.zoomX, zoomY: o.zoomY }
    if (o.textColor) out.textColor = o.textColor
    if (o.backgroundColor) out.backgroundColor = o.backgroundColor
    if (e.loopBody) out.loopBody = carryLooks(o.loopBody ?? [], e.loopBody)
    if (e.cases) out.cases = e.cases.map((c, k) => ({ ...c, elements: carryLooks(o.cases?.[k]?.elements ?? [], c.elements) }))
    return out
  })
}
