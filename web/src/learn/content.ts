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
// VisuBot mit Block-Ansicht (Holger 5.11.): kurze Lektionen für die 5./6. Klasse in `<Sprache>/visubot/bloecke/`.
const blockLessonFiles = import.meta.glob('../../lessons/*/visubot/bloecke/*.md', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>
// Dazu eigene Aufgaben zum Knobeln in `<Sprache>/visubot/bloecke/aufgaben/` (Holger 5.11.).
const blockTaskFiles = import.meta.glob('../../lessons/*/visubot/bloecke/aufgaben/*.md', { query: '?raw', import: 'default', eager: true }) as Record<
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
 * Zwei Welten (Holger, 27.10.): VisuStruct (`off`, der Kurs ohne Roboter) oder VisuBot (`on`).
 * VisuBot zeigt seit 3.11. nur die Roboter-Lektionen; für reines Java verweisen sie auf VisuStruct.
 */
export type VisuBotMode = 'off' | 'on'
export let visuBot: VisuBotMode = 'off'

/**
 * Block-Ansicht in VisuBot (Holger 5.11.): Sie ist für Jüngere (5./6. Klasse) gedacht. Ist sie an, zeigt der Lernbereich
 * kurze Lektionen zum Ausprobieren aus `visubot/bloecke/` statt der Java-Reihe. Gibt es in der Sprache (und auf Englisch)
 * keine, bleibt es bei der normalen Reihe.
 */
export let blockLessons = false

/**
 * VisuBot Kids (Holger 5.11.): nur die Block-Lektionen und -Aufgaben, nie die normale Reihe. Gibt es sie in der
 * Sprache nicht (bisher nur Deutsch), kommen die deutschen.
 */
export let onlyBlockLessons = false

export function useOnlyBlockLessons() {
  onlyBlockLessons = true
  visuBot = 'on'
  blockLessons = true
  lessons = []
  useContentLanguage(language)
}

/** Block-Lektionen ein- oder ausschalten; `true`, wenn sich der Inhalt dadurch ändert. */
export function useBlockLessons(on: boolean): boolean {
  if (onlyBlockLessons || on === blockLessons) return false
  blockLessons = on
  lessons = []
  useContentLanguage(language)
  return visuBot === 'on'
}

/** Zeigt der Lernbereich gerade die Block-Lektionen? */
export const showingBlockLessons = () => visuBot === 'on' && blockLessons && lessons.some((l) => l.blocks)

/** VisuBot-Modus für den Lernbereich wählen; Nachschlagen und Fachbegriffe bleiben dieselben. */
export function useVisuBotContent(mode: VisuBotMode) {
  if (onlyBlockLessons || mode === visuBot) return
  visuBot = mode
  lessons = []
  useContentLanguage(language)
}

/** Wählt die Sprache der Lektionen; die Exporte oben zeigen danach die Inhalte dieser Sprache. */
const juniorFolder = /\/lessons\/([^/]+)\/visubot\/bloecke\/[^/]+\.md$/
const hasJunior = (files: [string, string][]) => files.some(([name]) => /^\d+/.test(name))

export function useContentLanguage(lang: ContentLanguage) {
  // VisuBot Kids: Gibt es die Block-Lektionen in der Sprache nicht (bisher nur Deutsch), kommen die deutschen.
  if (onlyBlockLessons && !hasJunior(filesFor(blockLessonFiles, juniorFolder, lang))) lang = 'de'
  setMBotColorLanguage(lang)
  if (lang === language && lessons.length > 0) return
  language = lang
  const pages = filesFor(lessonFiles, /\/lessons\/([^/]+)\/[^/]+\.md$/, lang)
  const parseLessons = (files: [string, string][], renumber?: Map<number, number>) =>
    files
      .filter(([name]) => /^\d+/.test(name))
      .map(([name, source]) => parseLesson(renumbered(source, renumber), `${lang}/${name}`))
      .sort((a, b) => a.number - b.number)
  const parseTasks = (files: [string, string][], folder: string, renumber?: Map<number, number>) =>
    files.map(([name, source]) => {
      const task = parseTask(renumbered(source, renumber), `${lang}/${folder}${name}`)
      return renumber && task.after !== undefined ? { ...task, after: renumber.get(task.after) ?? task.after } : task
    })
  const normalTaskFiles = filesFor(taskFiles, /\/lessons\/([^/]+)\/aufgaben\/[^/]+\.md$/, lang)
  const juniorFiles = visuBot === 'on' && blockLessons ? filesFor(blockLessonFiles, juniorFolder, lang) : []
  if (hasJunior(juniorFiles)) {
    // Block-Lektionen: eigene kurze Reihe und eigene, kindgerechte Aufgaben (die normalen sind für Ältere)
    const series = visuBotSeries(juniorFiles)
    lessons = parseLessons(juniorFiles, series.renumber)
      .map((l) => ({ ...l, number: series.number.get(l.id)!, robot: true, blocks: true }))
      .sort((a, b) => a.number - b.number)
    const juniorTaskFiles = filesFor(blockTaskFiles, /\/lessons\/([^/]+)\/visubot\/bloecke\/aufgaben\/[^/]+\.md$/, lang)
    tasks = parseTasks(juniorTaskFiles, 'visubot/bloecke/aufgaben/', series.renumber).map((t) => ({ ...t, robot: true }))
  } else if (visuBot === 'on') {
    // Seit 3.11. (Holger): VisuBot zeigt nur die Roboter-Lektionen und -Aufgaben, normales Java steht in VisuStruct.
    const robotLessonFiles = filesFor(visuBotLessonFiles, /\/lessons\/([^/]+)\/visubot\/[^/]+\.md$/, lang)
    const series = visuBotSeries(robotLessonFiles)
    lessons = parseLessons(robotLessonFiles, series.renumber)
      .map((l) => ({ ...l, number: series.number.get(l.id)!, robot: true }))
      .sort((a, b) => a.number - b.number)
    const robotTaskFiles = filesFor(visuBotTaskFiles, /\/lessons\/([^/]+)\/visubot\/aufgaben\/[^/]+\.md$/, lang)
    tasks = parseTasks(robotTaskFiles, 'visubot/aufgaben/', series.renumber).map((t) => ({ ...t, robot: true }))
  } else {
    // Gleiches Durchzählen wie bei VisuBot: seit 4.11. ist Lektion 1 geteilt (`01-was-ist-…`, `01-weitere-darstellungen`).
    const lessonFiles = pages.filter(([name]) => /^\d+/.test(name))
    const series = visuBotSeries(lessonFiles)
    lessons = parseLessons(lessonFiles, series.renumber)
      .map((l) => ({ ...l, number: series.number.get(l.id)! }))
      .sort((a, b) => a.number - b.number)
    tasks = parseTasks(normalTaskFiles, 'aufgaben/', series.renumber)
  }
  tasks.sort((a, b) => (a.after ?? 0) - (b.after ?? 0) || a.level - b.level || a.title.localeCompare(b.title, lang))
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

/**
 * Nummern der Lektionsreihe (VisuBot und seit 4.11. auch VisuStruct): die Roboter-Lektionen in Dateireihenfolge, durchgezählt ab 1. So kann eine neue Lektion
 * mit gleicher Nummer und späterem Namen (`07-linie.md`, `07-wand-oder-linie.md`) eingeschoben werden, ohne Dateien
 * umzubenennen (Lernstand hängt am Dateinamen). Verweise „Lektion N“ in den Texten meinen die Dateinummer N und
 * werden auf die Nummer in der Reihe umgeschrieben (bei gleicher Nummer zählt die erste Datei).
 */
export function visuBotSeries(files: [string, string][]): { number: Map<string, number>; renumber: Map<number, number> } {
  const names = files
    .map(([name]) => name)
    .filter((name) => /^\d+/.test(name))
    .sort((a, b) => Number(/^\d+/.exec(a)![0]) - Number(/^\d+/.exec(b)![0]) || a.localeCompare(b))
  const number = new Map<string, number>()
  const renumber = new Map<number, number>()
  names.forEach((name, i) => {
    number.set(name.replace(/\.md$/, ''), i + 1)
    const fileNumber = Number(/^\d+/.exec(name)![0])
    if (!renumber.has(fileNumber)) renumber.set(fileNumber, i + 1)
  })
  return { number, renumber }
}

/** Verweise wie „Lektion 5“, „Lektionen 6 bis 13“, „Lesson 5“ oder „lição 5“ auf die neue Nummer umschreiben. */
function renumbered(source: string, map?: Map<number, number>): string {
  if (!map) return source
  return source.replace(
    /\b(Lektion(?:en)?|Lessons?|Li[cç](?:ão|ões))(\s+\d+(?:\s*(?:,|bis|und|and|to|a|e|–|-)\s*\d+)*)/gi,
    (_, word: string, numbers: string) => word + numbers.replace(/\d+/g, (n) => String(map.get(Number(n)) ?? n)),
  )
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
