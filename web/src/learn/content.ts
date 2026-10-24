import { registerTextFile } from '../core/simulation'
import { decodeDocument } from '../core/xmlCodec'
import type { VSDocument } from '../core/model'
import { parseGlossary, type GlossaryEntry } from './glossary'
import { parseLesson, parseTask, type Lesson, type Task } from './lessonFormat'

/**
 * Lektionen, Aufgaben und Diagramme aus `web/lessons` (werden beim Bauen eingebettet).
 * Deutsch steht in `de/`, Englisch in `en/`, Portugiesisch (Portugal) in `pt/`; alle anderen Oberflächensprachen
 * zeigen Englisch. Fehlt eine Datei in einer Sprache, gilt die englische (Holger-Entscheidung: Rückfall immer Englisch).
 * Diagramme und Bilder mit übersetztem Text liegen unter gleichem Namen in `diagramme/<Sprache>/` und `bilder/<Sprache>/`.
 */

export type ContentLanguage = 'de' | 'en' | 'pt'
export const contentLanguages: ContentLanguage[] = ['de', 'en', 'pt']

const lessonFiles = import.meta.glob('../../lessons/*/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const taskFiles = import.meta.glob('../../lessons/*/aufgaben/*.md', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>
// VisuBot (mBot2-Modus): eigene Lektionen und Aufgaben in `<Sprache>/visubot/`, die normalen bleiben unberührt.
const visuBotLessonFiles = import.meta.glob('../../lessons/*/visubot/*.md', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>
const visuBotTaskFiles = import.meta.glob('../../lessons/*/visubot/aufgaben/*.md', { query: '?raw', import: 'default', eager: true }) as Record<
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

/** Dateien von `lang`, ergänzt um die englischen, die es dort nicht gibt. */
function filesFor(files: Record<string, string>, folder: RegExp, lang: ContentLanguage): [string, string][] {
  const pick = (l: string) => new Map(Object.entries(files).filter(([p]) => folder.exec(p)?.[1] === l).map(([p, s]) => [baseName(p), s]))
  const merged = new Map([...pick('en'), ...(lang === 'en' ? [] : pick(lang))])
  return [...merged]
}

/** Inhaltssprache zur Oberflächensprache: Deutsch für Deutsch, Portugiesisch für Portugiesisch, sonst Englisch. */
export function contentLanguageFor(uiLanguage: string): ContentLanguage {
  return uiLanguage === 'de' ? 'de' : uiLanguage === 'pt-PT' ? 'pt' : 'en'
}

export let language: ContentLanguage = 'en'
export let lessons: Lesson[] = []
export let tasks: Task[] = []
export let reference = ''
export let glossary: GlossaryEntry[] = []
/** Zeigt der Lernbereich die VisuBot-Lektionen statt der normalen? */
export let visuBot = false

/** Zwischen normalen und VisuBot-Lektionen umschalten; Nachschlagen und Fachbegriffe bleiben dieselben. */
export function useVisuBotContent(on: boolean) {
  if (on === visuBot) return
  visuBot = on
  lessons = []
  useContentLanguage(language)
}

/** Wählt die Sprache der Lektionen; die Exporte oben zeigen danach die Inhalte dieser Sprache. */
export function useContentLanguage(lang: ContentLanguage) {
  if (lang === language && lessons.length > 0) return
  language = lang
  const pages = filesFor(lessonFiles, /\/lessons\/([^/]+)\/[^/]+\.md$/, lang)
  const lessonPages = visuBot ? filesFor(visuBotLessonFiles, /\/lessons\/([^/]+)\/visubot\/[^/]+\.md$/, lang) : pages
  lessons = lessonPages
    .filter(([name]) => /^\d+/.test(name))
    .map(([name, source]) => parseLesson(source, `${lang}/${name}`))
    .sort((a, b) => a.number - b.number)
  tasks = (visuBot
    ? filesFor(visuBotTaskFiles, /\/lessons\/([^/]+)\/visubot\/aufgaben\/[^/]+\.md$/, lang)
    : filesFor(taskFiles, /\/lessons\/([^/]+)\/aufgaben\/[^/]+\.md$/, lang))
    .map(([name, source]) => parseTask(source, `${lang}/aufgaben/${name}`))
    .sort((a, b) => (a.after ?? 0) - (b.after ?? 0) || a.level - b.level || a.title.localeCompare(b.title, lang))
  // Textdateien aus den Lektionen kann die Simulation mit `Files.readString(Path.of("name"))` lesen.
  for (const block of [...lessons.flatMap((l) => l.steps.flatMap((s) => s.blocks)), ...tasks.flatMap((t) => t.blocks)]) {
    if (block.kind === 'textFile') registerTextFile(block.name, block.content)
  }
  reference = pages.find(([name]) => name === 'nachschlagen.md')?.[1] ?? ''
  glossary = parseGlossary(pages.find(([name]) => name === 'begriffe.md')?.[1] ?? '')
}

useContentLanguage('en')

/** Deutsch: `folder/name`, sonst die englische Fassung. Sonst `folder/<Sprache>/name`, dann `folder/en/name`, dann `folder/name`. */
function localized(files: Map<string, string>, file: string): string | undefined {
  if (language === 'de') return files.get(file) ?? files.get(`en/${file}`)
  return (language === 'en' ? undefined : files.get(`${language}/${file}`)) ?? files.get(`en/${file}`) ?? files.get(file)
}

const relative = (path: string, folder: string) => path.slice(path.indexOf(folder) + folder.length)

const diagrams = new Map(Object.entries(diagramFiles).map(([path, xml]) => [relative(path, '/diagramme/'), xml]))

export function diagram(file: string): VSDocument | undefined {
  const xml = localized(diagrams, file)
  return xml === undefined ? undefined : decodeDocument(xml)
}

const images = new Map(Object.entries(imageFiles).map(([path, url]) => [relative(path, '/bilder/'), url]))

/** Adresse eines Bildes aus `web/lessons/bilder` (übersetzt aus `bilder/<Sprache>`, falls vorhanden). */
export function image(file: string): string | undefined {
  return localized(images, file)
}
