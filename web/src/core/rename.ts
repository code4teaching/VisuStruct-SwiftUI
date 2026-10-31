import type { VSDocument, VSElement } from './model'

/**
 * Umbenennen (Refactoring): eine Variable an allen Stellen umbenennen, im Java-Code und im Struktogramm.
 * Genau dieselbe Schreibweise (`zahl` ≠ `Zahl`), nur ganze Wörter; Text in "…"/'…' und Kommentare bleiben.
 */

export const javaKeywords = new Set(
  (
    'abstract assert boolean break byte case catch char class const continue default do double else enum extends final ' +
    'finally float for goto if implements import instanceof int interface long native new package private protected public ' +
    'return short static strictfp super switch synchronized this throw throws transient try void volatile while ' +
    'true false null var record yield'
  ).split(' '),
)

const wordChar = /[\p{L}\p{N}_$]/u
const wordStart = /[\p{L}_$]/u

export interface Word {
  from: number
  to: number
  name: string
}

/** Alle Wörter im Code außerhalb von Zeichenketten, Zeichen und Kommentaren. */
export function codeWords(text: string): Word[] {
  const words: Word[] = []
  let i = 0
  while (i < text.length) {
    const c = text[i]
    if (c === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i++
    } else if (c === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2)
      i = end < 0 ? text.length : end + 2
    } else if (c === '"' || c === "'") {
      i++
      while (i < text.length && text[i] !== c && text[i] !== '\n') i += text[i] === '\\' ? 2 : 1
      i++
    } else if (wordStart.test(c)) {
      const from = i
      while (i < text.length && wordChar.test(text[i])) i++
      words.push({ from, to: i, name: text.slice(from, i) })
    } else if (/\d/.test(c)) {
      // Zahlen wie 1e5 oder 10L gehören nicht zu einem Namen.
      while (i < text.length && wordChar.test(text[i])) i++
    } else i++
  }
  return words
}

/** Stellen, an denen die Variable `name` vorkommt (nicht hinter einem Punkt: `feld.length` ist keine Variable `length`). */
export function nameRanges(text: string, name: string): Word[] {
  return codeWords(text).filter((w) => w.name === name && !afterDot(text, w.from))
}

function afterDot(text: string, from: number): boolean {
  let i = from - 1
  while (i >= 0 && (text[i] === ' ' || text[i] === '\t')) i--
  return text[i] === '.'
}

/** Wort unter dem Cursor (auch direkt dahinter), wenn es ein umbenennbarer Name ist. */
export function nameAt(text: string, pos: number): Word | undefined {
  const w = codeWords(text).find((w) => pos >= w.from && pos <= w.to)
  if (!w || javaKeywords.has(w.name) || afterDot(text, w.from)) return undefined
  return w
}

/** Text mit umbenannter Variable und Anzahl der geänderten Stellen. */
export function renameInText(text: string, from: string, to: string): { text: string; count: number } {
  const ranges = nameRanges(text, from)
  let out = ''
  let last = 0
  for (const r of ranges) {
    out += text.slice(last, r.from) + to
    last = r.to
  }
  return { text: out + text.slice(last), count: ranges.length }
}

/** Alle Texte des Struktogramms (Kopfzeile, Elemente, Fallnamen). */
function documentTexts(doc: VSDocument): string[] {
  const texts = [doc.caption]
  const walk = (elements: VSElement[]) => {
    for (const el of elements) {
      texts.push(el.textLines.join('\n'))
      if (el.loopBody) walk(el.loopBody)
      for (const c of el.cases ?? []) {
        texts.push(c.name)
        walk(c.elements)
      }
    }
  }
  walk(doc.elements)
  return texts
}

export function renameInDocument(doc: VSDocument, from: string, to: string): { doc: VSDocument; count: number } {
  let count = 0
  const rename = (s: string) => {
    const r = renameInText(s, from, to)
    count += r.count
    return r.text
  }
  const walk = (elements: VSElement[]): VSElement[] =>
    elements.map((el) => ({
      ...el,
      textLines: rename(el.textLines.join('\n')).split('\n'),
      ...(el.loopBody ? { loopBody: walk(el.loopBody) } : {}),
      ...(el.cases ? { cases: el.cases.map((c) => ({ name: rename(c.name), elements: walk(c.elements) })) } : {}),
    }))
  const next = { ...doc, caption: rename(doc.caption), elements: walk(doc.elements) }
  return { doc: next, count }
}

/**
 * Namen, die wie Variablen aussehen: keine Schlüsselwörter, keine Methoden `name(`, keine Klassen
 * (`Scanner sc`, `Math.max`) und nichts hinter einem Punkt. Reihenfolge wie im Text.
 */
export function variableNames(texts: string[]): string[] {
  const names = new Set<string>()
  const skip = new Set<string>()
  const declared = new Set<string>()
  for (const text of texts) {
    const words = codeWords(text).filter((w) => !afterDot(text, w.from))
    words.forEach((w, i) => {
      // „ø“ = leere Anweisung im Struktogramm, kein Name.
      if (javaKeywords.has(w.name) || w.name === 'ø') return
      const rest = text.slice(w.to)
      const next = words[i + 1]
      const between = next ? text.slice(w.to, next.from) : ''
      // `Scanner sc`, `String[] namen`: das erste Wort ist ein Typ, das zweite die Variable.
      const isType = next !== undefined && !javaKeywords.has(next.name) && /^(?:\s*\[\s*\])*[ \t]+$/.test(between)
      if (isType && /^\s*(?:[=;,):]|$)/.test(text.slice(next.to))) declared.add(next.name)
      const isClass = /^\p{Lu}/u.test(w.name) && /^\s*\./.test(rest)
      if (/^\s*\(/.test(rest) || isClass || isType) skip.add(w.name)
      else names.add(w.name)
    })
  }
  return [...names].filter((n) => !skip.has(n) || declared.has(n))
}

/** Alle Wörter im Struktogramm, auch Methoden und Klassen: Der neue Name soll keinen davon treffen. */
export function documentWords(doc: VSDocument): string[] {
  return documentTexts(doc).flatMap((t) => codeWords(t).map((w) => w.name))
}

export function countInDocument(doc: VSDocument, name: string): number {
  return documentTexts(doc).reduce((n, t) => n + nameRanges(t, name).length, 0)
}

export function documentVariableNames(doc: VSDocument): string[] {
  return variableNames(documentTexts(doc))
}

export function elementVariableNames(el: VSElement): string[] {
  return variableNames([el.textLines.join('\n')])
}

export type RenameCheck = { ok: true; warning?: 'exists' } | { ok: false; reason: 'empty' | 'same' | 'invalid' | 'keyword' }

/** Neuen Namen prüfen; `existing` = Namen, die schon vorkommen. */
export function checkNewName(from: string, to: string, existing: Iterable<string>): RenameCheck {
  if (to === '') return { ok: false, reason: 'empty' }
  if (to === from) return { ok: false, reason: 'same' }
  if (!/^[\p{L}_$][\p{L}\p{N}_$]*$/u.test(to)) return { ok: false, reason: 'invalid' }
  if (javaKeywords.has(to)) return { ok: false, reason: 'keyword' }
  for (const n of existing) if (n === to) return { ok: true, warning: 'exists' }
  return { ok: true }
}
