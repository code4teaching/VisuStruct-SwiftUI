import { ElementType, type VSElement } from './model'

/** Texte, wie sie im Diagramm angezeigt werden (`VisuStructDiagramText.swift`). `undefined` = kein Text → Platzhalter. */
export function displayLines(element: VSElement): string[] | undefined {
  const raw = element.textLines
  if (raw.every((l) => l.trim() === '')) return undefined
  switch (element.type) {
    case ElementType.forSchleife:
      return raw.length <= 1 ? raw : [forLoopSingleLine(raw)]
    case ElementType.verzweigung:
      return withLeadingKeyword('if', raw)
    case ElementType.whileSchleife:
      return withLeadingKeyword('while', raw)
    case ElementType.doUntilSchleife:
      return withLeadingKeyword('while', normalizedDoUntilConditionLines(raw))
    case ElementType.fallauswahl:
      return withLeadingKeyword('switch', raw)
    default:
      return raw
  }
}

/** Entfernt ein führendes `until`, damit die Anzeige einheitlich `while …` nutzt. */
export function normalizedDoUntilConditionLines(raw: string[]): string[] {
  if (raw.length === 0) return raw
  const t = raw[0].trim()
  const lower = t.toLowerCase()
  const o = [...raw]
  if (lower === 'until') o[0] = ''
  else if (lower.startsWith('until ')) o[0] = t.slice(6).trim()
  else if (lower.startsWith('until(')) o[0] = t.slice(5)
  else return raw
  return o
}

/** `while i < 3` → `{ keyword: 'while', rest: 'i < 3' }` (Schlüsselwort fett). */
export function keywordSplit(line: string): { keyword: string; rest: string } | undefined {
  const keywords = new Set(['if', 'for', 'while', 'until', 'switch'])
  const colonKeywords = ['input:', 'output:', 'print:']
  const trimmed = line.trim()
  const lower = trimmed.toLowerCase()
  for (const prefix of colonKeywords) {
    if (lower === prefix) return { keyword: trimmed, rest: '' }
    if (lower.startsWith(prefix + ' ')) {
      return { keyword: trimmed.slice(0, prefix.length), rest: trimmed.slice(prefix.length).trim() }
    }
  }
  const firstSpace = trimmed.indexOf(' ')
  if (firstSpace < 0) return undefined
  const head = trimmed.slice(0, firstSpace)
  if (!keywords.has(head.toLowerCase())) return undefined
  return { keyword: head, rest: trimmed.slice(firstSpace + 1).trim() }
}

function withLeadingKeyword(keyword: string, lines: string[]): string[] {
  if (lines.length === 0) return lines
  const trimmed = lines[0].trim()
  const lower = trimmed.toLowerCase()
  if (lower === keyword || lower.startsWith(keyword + ' ')) return lines
  const out = [...lines]
  out[0] = keyword + ' ' + trimmed
  return out
}

/** Zählschleife einzeilig: `for (init; cond; step)` → `for init; cond; step`. */
export function forLoopSingleLine(textLines: string[]): string {
  let parts = [...textLines]
  while (parts.length < 3) parts.push('')
  parts = parts.slice(0, 3)
  const strip = (s: string) => {
    let x = s.trim()
    while (x.endsWith(';')) x = x.slice(0, -1).trim()
    return x
  }
  const joined = parts.map(strip).join('; ').trim()
  return joined === '' ? 'for' : 'for ' + joined
}

/** Platzhaltertexte für leere Elemente (deutsche Werte aus `de.lproj/Localizable.strings`). */
export const stubTexts: Record<ElementType, string> = {
  [ElementType.anweisung]: 'Anweisung',
  [ElementType.verzweigung]: 'Bedingung',
  [ElementType.fallauswahl]: 'Fallauswahl',
  [ElementType.forSchleife]: 'for 0 < i < anzahl',
  [ElementType.whileSchleife]: 'while …',
  [ElementType.doUntilSchleife]: 'while …',
  [ElementType.endlosschleife]: 'endless',
  [ElementType.aussprung]: 'break',
  [ElementType.aufruf]: 'Aufruf()',
  [ElementType.leerElement]: 'ø',
}

/** Wie `DiagramCanvasView.displayTextLines`. */
export function setCanvasStubTexts(texts: Partial<Record<ElementType, string>>) {
  Object.assign(stubTexts, texts)
}

export function canvasTextLines(element: VSElement): string[] {
  return displayLines(element) ?? [stubTexts[element.type]]
}
