import { registerTextFile } from '../core/simulation'
import { decodeDocument } from '../core/xmlCodec'
import { parseWorldMap, type RobotWorldSetup } from '../core/robotWorld'
import { setMBotColorLanguage } from '../core/mbot'
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
// VisuBot im Kurs: zusätzliche Schritte für normale Lektionen, Dateiname beginnt mit deren Nummer (`13-for-schleife.md`).
const visuBotTaskFiles = import.meta.glob('../../lessons/*/visubot/aufgaben/*.md', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>
const diagramFiles = import.meta.glob('../../lessons/diagramme/**/*.visustruct', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>

// VisuBot: Weltkarten für Übungen (`welt: labyrinth`), Zeichen wie in `parseWorldMap`.
const worldFiles = import.meta.glob('../../lessons/welten/*.txt', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

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
/**
 * Zwei getrennte Welten (Holger, 27.10.): VisuStruct (`off`, der Kurs ohne Roboter)
 * oder VisuBot (`on`, nur die VisuBot-Lektionen und -Aufgaben).
 */
export type VisuBotMode = 'off' | 'on'
export let visuBot: VisuBotMode = 'off'

/** VisuBot-Modus für den Lernbereich wählen; Nachschlagen und Fachbegriffe bleiben dieselben. */
export function useVisuBotContent(mode: VisuBotMode) {
  if (mode === visuBot) return
  visuBot = mode
  lessons = []
  useContentLanguage(language)
}

/** Wählt die Sprache der Lektionen; die Exporte oben zeigen danach die Inhalte dieser Sprache. */
export function useContentLanguage(lang: ContentLanguage) {
  setMBotColorLanguage(lang)
  if (lang === language && lessons.length > 0) return
  language = lang
  const pages = filesFor(lessonFiles, /\/lessons\/([^/]+)\/[^/]+\.md$/, lang)
  const lessonPages = visuBot === 'on' ? filesFor(visuBotLessonFiles, /\/lessons\/([^/]+)\/visubot\/[^/]+\.md$/, lang) : pages
  lessons = lessonPages
    .filter(([name]) => /^\d+/.test(name))
    .map(([name, source]) => parseLesson(source, `${lang}/${name}`))
    .sort((a, b) => a.number - b.number)
  const robotTasks = () =>
    filesFor(visuBotTaskFiles, /\/lessons\/([^/]+)\/visubot\/aufgaben\/[^/]+\.md$/, lang).map(([name, source]) =>
      parseTask(source, `${lang}/visubot/aufgaben/${name}`),
    )
  const normalTasks = () =>
    filesFor(taskFiles, /\/lessons\/([^/]+)\/aufgaben\/[^/]+\.md$/, lang).map(([name, source]) => parseTask(source, `${lang}/aufgaben/${name}`))
  tasks = (visuBot === 'on' ? robotTasks() : normalTasks()).sort((a, b) => (a.after ?? 0) - (b.after ?? 0) || a.level - b.level || a.title.localeCompare(b.title, lang))
  // Textdateien aus den Lektionen kann die Simulation mit `Files.readString(Path.of("name"))` lesen.
  for (const block of [...lessons.flatMap((l) => l.steps.flatMap((s) => s.blocks)), ...tasks.flatMap((t) => t.blocks)]) {
    if (block.kind === 'textFile') registerTextFile(block.name, block.content)
  }
  reference = pages.find(([name]) => name === 'nachschlagen.md')?.[1] ?? ''
  // VisuBot: mBot2-Befehle und -Sensoren als eigene Kategorien
  if (visuBot !== 'off') {
    const robotReference = filesFor(visuBotLessonFiles, /\/lessons\/([^/]+)\/visubot\/[^/]+\.md$/, lang).find(([name]) => name === 'nachschlagen.md')?.[1]
    if (robotReference) reference = `${reference.trimEnd()}\n\n${robotReference}`
  }
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

const worldMaps = new Map(Object.entries(worldFiles).map(([path, text]) => [baseName(path).replace(/\.txt$/, ''), text]))
const parsedWorlds = new Map<string, RobotWorldSetup>()

/** Welt aus `web/lessons/welten/<name>.txt`; `undefined`, wenn es sie nicht gibt. */
export function world(name: string): RobotWorldSetup | undefined {
  const text = worldMaps.get(name)
  if (text === undefined) return undefined
  let setup = parsedWorlds.get(name)
  if (!setup) parsedWorlds.set(name, (setup = parseWorldMap(text)))
  return setup
}

export const worldNames = () => [...worldMaps.keys()]
