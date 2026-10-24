/**
 * Lückentext: fertiger Code, in dem einzelne Wörter fehlen.
 *
 *     ::: lückentext
 *     titel: Lückentext: Zählschleife
 *     auftrag: Ergänze die fehlenden Wörter.
 *     ```java
 *     for ([[int]] i = 1; i [[<=]] 10; [[i++ | i += 1 | i = i + 1]]) {
 *     ```
 *     erklärung: Wird gezeigt, wenn alle Lücken stimmen.
 *     :::
 *
 * `[[a]]` ist eine Lücke. Weitere richtige Antworten stehen mit ` | ` (Leerzeichen davor und danach)
 * dahinter, damit `||` und `|` selbst als Antwort gehen: `[[i++ | i += 1]]`.
 */
export interface Cloze {
  title: string
  task: string
  /** Codezeilen; jede Zeile besteht aus Text und Lücken. */
  lines: ClozePart[][]
  explanation?: string
}

export type ClozePart = string | { answers: string[] }

const gapPattern = /\[\[(.+?)\]\]/g

export function parseCloze(inner: string[], file: string): Cloze {
  const cloze: Cloze = { title: '', task: '', lines: [] }
  let code: string[] | undefined
  let inCode = false
  for (const raw of inner) {
    if (/^\s*```/.test(raw)) {
      if (inCode) inCode = false
      else if (code) throw new Error(`${file}: Ein Lückentext hat nur einen Codeblock.`)
      else {
        code = []
        inCode = true
      }
      continue
    }
    if (inCode) {
      code!.push(raw.replace(/\s+$/, ''))
      continue
    }
    const line = raw.trim()
    if (!line) continue
    const m = /^([a-zäöü]+):\s*(.*)$/i.exec(line)
    if (!m) throw new Error(`${file}: Unbekannte Zeile im Lückentext: „${line}“.`)
    const value = m[2].trim()
    switch (m[1].toLowerCase()) {
      case 'titel': cloze.title = value; break
      case 'auftrag': cloze.task = value; break
      case 'erklärung':
      case 'erklaerung': cloze.explanation = value; break
      default: throw new Error(`${file}: Unbekannter Schlüssel „${m[1]}“ im Lückentext.`)
    }
  }
  if (inCode) throw new Error(`${file}: Der Codeblock im Lückentext wird nicht mit \`\`\` geschlossen.`)
  if (!cloze.title) throw new Error(`${file}: Ein Lückentext braucht einen Titel.`)
  if (!code?.length) throw new Error(`${file}: Lückentext „${cloze.title}“ braucht einen Codeblock.`)
  // Gemeinsame Einrückung entfernen, damit der Code links beginnt.
  const indent = Math.min(...code.filter((l) => l.trim()).map((l) => /^ */.exec(l)![0].length))
  cloze.lines = code.map((l) => splitGaps(l.slice(indent), file, cloze.title))
  if (!cloze.lines.some((l) => l.some((p) => typeof p !== 'string'))) {
    throw new Error(`${file}: Lückentext „${cloze.title}“ braucht mindestens eine Lücke [[…]].`)
  }
  return cloze
}

function splitGaps(line: string, file: string, title: string): ClozePart[] {
  const parts: ClozePart[] = []
  let at = 0
  for (const m of line.matchAll(gapPattern)) {
    if (m.index! > at) parts.push(line.slice(at, m.index))
    const answers = m[1].split(/\s+\|\s+/).map((a) => a.trim()).filter(Boolean)
    if (!answers.length) throw new Error(`${file}: Leere Lücke im Lückentext „${title}“.`)
    parts.push({ answers })
    at = m.index! + m[0].length
  }
  if (at < line.length) parts.push(line.slice(at))
  if (parts.some((p) => typeof p === 'string' && (p.includes('[[') || p.includes(']]')))) {
    throw new Error(`${file}: Unvollständige Lücke im Lückentext „${title}“: „${line}“.`)
  }
  return parts
}

/** Alle Lücken in Reihenfolge. */
export function clozeGaps(cloze: Cloze): string[][] {
  return cloze.lines.flatMap((l) => l.flatMap((p) => (typeof p === 'string' ? [] : [p.answers])))
}

/** Leerzeichen zählen nicht: `i = i + 1` und `i=i+1` sind gleich. Groß/klein zählt (wie in Java). */
export function clozeAnswerRight(answers: string[], input: string): boolean {
  const norm = (s: string) => s.replace(/\s+/g, '')
  return norm(input) !== '' && answers.some((a) => norm(a) === norm(input))
}
