/** Fachbegriffe aus `lessons/<Sprache>/begriffe.md`: `### Begriff`, optional `auch: Form, Form` (englisch `also:`), danach die Erklärung. */

export interface GlossaryEntry {
  term: string
  /** Alle Schreibweisen, die im Text erkannt werden (der Begriff selbst zuerst). */
  forms: string[]
  text: string
}

export function parseGlossary(source: string): GlossaryEntry[] {
  const entries: GlossaryEntry[] = []
  for (const line of source.replace(/\r\n/g, '\n').split('\n')) {
    const heading = /^###\s+(.+)$/.exec(line)
    const entry = entries.at(-1)
    if (heading) {
      const term = heading[1].trim()
      entries.push({ term, forms: [term], text: '' })
    } else if (entry && /^(auch|also):/i.test(line)) {
      entry.forms.push(...line.replace(/^(auch|also):/i, '').split(',').map((f) => f.trim()).filter(Boolean))
    } else if (entry && line.trim() !== '') {
      entry.text = (entry.text + ' ' + line.trim()).trim()
    }
  }
  return entries.filter((e) => e.text !== '')
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Findet ganze Wörter (nicht Teil eines längeren Worts oder einer Bindestrich-Zusammensetzung). */
export function termPattern(entries: GlossaryEntry[]): RegExp | undefined {
  const forms = entries.flatMap((e) => e.forms).sort((a, b) => b.length - a.length)
  if (forms.length === 0) return undefined
  return new RegExp(`(?<![\\p{L}\\p{N}_-])(?:${forms.map(escapeRegExp).join('|')})(?![\\p{L}\\p{N}_-])`, 'u')
}

export function entryFor(entries: GlossaryEntry[], word: string): GlossaryEntry | undefined {
  return entries.find((e) => e.forms.includes(word))
}
