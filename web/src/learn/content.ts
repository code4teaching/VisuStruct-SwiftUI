import { decodeDocument } from '../core/xmlCodec'
import type { VSDocument } from '../core/model'
import { parseGlossary, type GlossaryEntry } from './glossary'
import { parseLesson, parseTask, type Lesson, type Task } from './lessonFormat'

/**
 * Lektionen, Aufgaben und Diagramme aus `web/lessons` (werden beim Bauen eingebettet).
 * Deutsch steht in `de/`, Englisch in `en/` (alle anderen Oberflächensprachen zeigen Englisch).
 * Fehlt eine Datei auf Englisch, gilt die deutsche. Diagramme und Bilder mit englischem Text liegen
 * unter gleichem Namen in `diagramme/en/` und `bilder/en/`.
 */

export type ContentLanguage = 'de' | 'en'
export const contentLanguages: ContentLanguage[] = ['de', 'en']

const lessonFiles = import.meta.glob('../../lessons/*/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const taskFiles = import.meta.glob('../../lessons/*/aufgaben/*.md', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>
const diagramFiles = import.meta.glob('../../lessons/diagramme/**/*.visustruct', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>

const imageFiles = import.meta.glob('../../lessons/bilder/**/*.{jpg,png,webp,svg}', { query: '?url', import: 'default', eager: true }) as Record<
  string,
  string
>

const baseName = (path: string) => path.replace(/^.*\//, '')

/** Dateien von `lang`, ergänzt um die deutschen, die es dort nicht gibt. */
function filesFor(files: Record<string, string>, folder: RegExp, lang: ContentLanguage): [string, string][] {
  const pick = (l: string) => new Map(Object.entries(files).filter(([p]) => folder.exec(p)?.[1] === l).map(([p, s]) => [baseName(p), s]))
  const merged = new Map([...pick('de'), ...(lang === 'de' ? [] : pick(lang))])
  return [...merged]
}

/** Inhaltssprache zur Oberflächensprache: Deutsch für Deutsch, sonst Englisch. */
export function contentLanguageFor(uiLanguage: string): ContentLanguage {
  return uiLanguage === 'de' ? 'de' : 'en'
}

export let language: ContentLanguage = 'de'
export let lessons: Lesson[] = []
export let tasks: Task[] = []
export let reference = ''
export let glossary: GlossaryEntry[] = []

/** Wählt die Sprache der Lektionen; die Exporte oben zeigen danach die Inhalte dieser Sprache. */
export function useContentLanguage(lang: ContentLanguage) {
  if (lang === language && lessons.length > 0) return
  language = lang
  const pages = filesFor(lessonFiles, /\/lessons\/([^/]+)\/[^/]+\.md$/, lang)
  lessons = pages
    .filter(([name]) => /^\d+/.test(name))
    .map(([name, source]) => parseLesson(source, `${lang}/${name}`))
    .sort((a, b) => a.number - b.number)
  tasks = filesFor(taskFiles, /\/lessons\/([^/]+)\/aufgaben\/[^/]+\.md$/, lang)
    .map(([name, source]) => parseTask(source, `${lang}/aufgaben/${name}`))
    .sort((a, b) => (a.after ?? 0) - (b.after ?? 0) || a.level - b.level || a.title.localeCompare(b.title, lang))
  reference = pages.find(([name]) => name === 'nachschlagen.md')?.[1] ?? ''
  glossary = parseGlossary(pages.find(([name]) => name === 'begriffe.md')?.[1] ?? '')
}

useContentLanguage('de')

/** Datei unter `folder/<Sprache>/name`, sonst `folder/name`. */
function localized(files: Map<string, string>, file: string): string | undefined {
  return (language === 'de' ? undefined : files.get(`${language}/${file}`)) ?? files.get(file)
}

const relative = (path: string, folder: string) => path.slice(path.indexOf(folder) + folder.length)

const diagrams = new Map(Object.entries(diagramFiles).map(([path, xml]) => [relative(path, '/diagramme/'), xml]))

export function diagram(file: string): VSDocument | undefined {
  const xml = localized(diagrams, file)
  return xml === undefined ? undefined : decodeDocument(xml)
}

const images = new Map(Object.entries(imageFiles).map(([path, url]) => [relative(path, '/bilder/'), url]))

/** Adresse eines Bildes aus `web/lessons/bilder` (auf Englisch aus `bilder/en`, falls vorhanden). */
export function image(file: string): string | undefined {
  return localized(images, file)
}
