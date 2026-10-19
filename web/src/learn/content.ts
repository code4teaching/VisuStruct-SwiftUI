import { decodeDocument } from '../core/xmlCodec'
import type { VSDocument } from '../core/model'
import { parseLesson, parseTask, type Lesson, type Task } from './lessonFormat'

/** Lektionen, Aufgaben und Diagramme aus `web/lessons` (werden beim Bauen eingebettet). */

const lessonFiles = import.meta.glob('../../lessons/de/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const taskFiles = import.meta.glob('../../lessons/de/aufgaben/*.md', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>
const diagramFiles = import.meta.glob('../../lessons/diagramme/*.visustruct', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>

const baseName = (path: string) => path.replace(/^.*\//, '')

export const lessons: Lesson[] = Object.entries(lessonFiles)
  .filter(([path]) => /\/\d+[^/]*\.md$/.test(path))
  .map(([path, source]) => parseLesson(source, baseName(path)))
  .sort((a, b) => a.number - b.number)

export const tasks: Task[] = Object.entries(taskFiles)
  .map(([path, source]) => parseTask(source, baseName(path)))
  .sort((a, b) => (a.after ?? 0) - (b.after ?? 0) || a.level - b.level || a.title.localeCompare(b.title, 'de'))

export const reference: string = Object.entries(lessonFiles).find(([path]) => path.endsWith('/nachschlagen.md'))?.[1] ?? ''

const diagrams = new Map(Object.entries(diagramFiles).map(([path, xml]) => [baseName(path), xml]))

export function diagram(file: string): VSDocument | undefined {
  const xml = diagrams.get(file)
  return xml === undefined ? undefined : decodeDocument(xml)
}
