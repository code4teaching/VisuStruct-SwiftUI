/** Port von `Editing/VisuStructLineEditorText.swift`: Textumformungen für den Zeileneditor (ohne UI). */

export type StatementIOMode = 'statement' | 'input' | 'output'

const isWs = (c: string | undefined) => c !== undefined && /\s/.test(c)

export function ioMode(text: string): StatementIOMode {
  const t = text.trim().toLowerCase()
  if (t.startsWith('input:')) return 'input'
  if (t.startsWith('output:') || t.startsWith('print:')) return 'output'
  return 'statement'
}

/** Entfernt `input:` / `output:` / `print:` und umgebende Leerzeichen; ohne Präfix bleibt der Text unverändert. */
export function strippingIOPrefix(s: string): string {
  const trimmed = s.trim()
  const lower = trimmed.toLowerCase()
  if (lower.startsWith('input:')) return trimmed.slice(6).trim()
  if (lower.startsWith('output:')) return trimmed.slice(7).trim()
  if (lower.startsWith('print:')) return trimmed.slice(6).trim()
  return s
}

function prefixing(p: string, content: string): string {
  const c = content.trim()
  return c === '' ? `${p} ` : `${p} ${c}`
}

/** Text nach Wechsel der Art: Präfix tauschen, Inhalt behalten. */
export function applyingIOMode(mode: StatementIOMode, text: string): string {
  const stripped = strippingIOPrefix(text)
  switch (mode) {
    case 'statement': return stripped
    case 'input': return prefixing('input:', stripped)
    case 'output': return prefixing('output:', stripped)
  }
}

const dropOneLeadingWhitespace = (s: string) => (isWs(s[0]) ? s.slice(1) : s)

function strippingIOPrefixPreservingEditingWhitespace(s: string): string {
  const lead = s.replace(/^\s+/, '')
  const lower = lead.toLowerCase()
  if (lower.startsWith('input:')) return dropOneLeadingWhitespace(lead.slice(6))
  if (lower.startsWith('output:')) return dropOneLeadingWhitespace(lead.slice(7))
  if (lower.startsWith('print:')) return dropOneLeadingWhitespace(lead.slice(6))
  return s
}

function strippingKeywordPrefixPreservingEditingWhitespace(keyword: string, s: string): string {
  const lead = s.replace(/^\s+/, '')
  if (!lead.toLowerCase().startsWith(keyword.toLowerCase())) return s
  const after = lead.slice(keyword.length)
  if (!(after === '' || isWs(after[0]) || after[0] === '(')) return s
  const content = dropOneLeadingWhitespace(after)
  if (content.startsWith('(') && content.endsWith(')') && content.length >= 2) return content.slice(1, -1)
  return content
}

/** Wie `strippingIOPrefix` bzw. Schlüsselwort-Entfernung, aber Leerzeichen beim Tippen bleiben erhalten. */
export function strippingPrefixForEditing(p: string, s: string): string {
  if (p === 'input:' || p === 'output:') return strippingIOPrefixPreservingEditingWhitespace(s)
  const stripped = strippingKeywordPrefixPreservingEditingWhitespace(p, s)
  if (p === 'while' && stripped === s) {
    const legacy = strippingKeywordPrefixPreservingEditingWhitespace('until', s)
    if (legacy !== s) return legacy
  }
  return stripped
}

export function prefixingForEditing(p: string, content: string): string {
  return content === '' ? `${p} ` : `${p} ${content}`
}

/** Typografische Anführungszeichen (z. B. von der Tastatur) werden zu geraden Quotes. */
export function normalizingQuotes(s: string): string {
  return s.replace(/[“”„«»]/g, '"').replace(/[’‘‚´]/g, "'")
}

/** Genau drei Felder (Start, Bedingung, Schritt) der Zählschleife. */
export function paddedForLoopParts(lines: string[]): string[] {
  const a = lines.length === 0 ? [''] : lines.slice(0, 3)
  while (a.length < 3) a.push('')
  return a
}

/** Ein Feld der Zählschleife: gerade Quotes, ohne abschließende `;`. */
export function normalizedForLoopPart(s: string): string {
  let x = normalizingQuotes(s)
  for (;;) {
    const t = x.trim()
    if (!t.endsWith(';')) return x
    x = t.slice(0, -1).trim()
  }
}
