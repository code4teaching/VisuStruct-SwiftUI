import type { Lesson } from '../src/learn/lessonFormat'

const GAMES = ['game', 'roundGame', 'rescueGame', 'driveGame', 'crosswordGame']

/**
 * Jede Lektion endet so (Holger 2026-11-03): vorher mindestens ein Spiel, dann die Checkliste, zuletzt der Wissenstest. Checkliste und Wissenstest stehen nie im selben Schritt und nie zusammen mit anderem Inhalt.
 * Liefert die Verstöße als lesbare Sätze, leer heißt alles in Ordnung.
 */
export function lessonEndProblems(lesson: Lesson): string[] {
  const kinds = lesson.steps.map((s) => s.blocks.map((b) => b.kind as string))
  const where = (i: number) => `${lesson.id} / ${lesson.steps[i]?.title ?? '–'}`
  const lists = kinds.flatMap((k, i) => (k.includes('checklist') ? [i] : []))
  if (lists.length !== 1) return [`${lesson.id}: ${lists.length} Checklisten statt einer`]
  const ci = lists[0]
  const last = kinds.length - 1
  const only = (i: number, kind: string) => kinds[i].includes(kind) && kinds[i].every((k) => k === kind || k === 'markdown')
  const problems: string[] = []
  if (!only(ci, 'checklist')) problems.push(`${where(ci)}: Im Schritt der Checkliste steht noch anderes (${kinds[ci].join(', ')})`)
  if (ci !== last - 1) problems.push(`${where(ci)}: Nach der Checkliste muss genau ein Schritt folgen, der Wissenstest`)
  if (!only(last, 'quiz')) problems.push(`${where(last)}: Der letzte Schritt muss der Wissenstest sein, nur mit Fragen (${kinds[last].join(', ')})`)
  const games = kinds.flatMap((k, i) => (k.some((x) => GAMES.includes(x)) ? [i] : []))
  if (!games.some((i) => i < ci)) problems.push(`${lesson.id}: Vor der Checkliste fehlt ein Spiel`)
  return problems
}
