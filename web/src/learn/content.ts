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
 * Zwei Welten (Holger, 27.10.): VisuStruct (`off`, der Kurs ohne Roboter) oder VisuBot (`on`).
 * VisuBot zeigt seit 30.10. eine durchgehende Reihe: alle VisuStruct-Lektionen mit den VisuBot-Lektionen dazwischen.
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
  if (visuBot === 'on') {
    const robotLessonFiles = filesFor(visuBotLessonFiles, /\/lessons\/([^/]+)\/visubot\/[^/]+\.md$/, lang)
    const series = visuBotSeries(lessonNumbers(pages), lessonNumbers(robotLessonFiles))
    const normal = parseLessons(pages, series.normal)
    const sectionBefore = (n: number) => [...normal].reverse().find((l) => series.normal.get(l.number)! < n)?.section ?? ''
    lessons = [
      ...normal.map((l) => ({ ...l, number: series.normal.get(l.number)! })),
      ...parseLessons(robotLessonFiles, series.robot).map((l) => {
        const number = series.robot.get(l.number)!
        return { ...l, number, section: sectionBefore(number), robot: true }
      }),
    ].sort((a, b) => a.number - b.number)
    const robotTaskFiles = filesFor(visuBotTaskFiles, /\/lessons\/([^/]+)\/visubot\/aufgaben\/[^/]+\.md$/, lang)
    tasks = [...parseTasks(normalTaskFiles, 'aufgaben/', series.normal), ...parseTasks(robotTaskFiles, 'visubot/aufgaben/', series.robot).map((t) => ({ ...t, robot: true }))]
  } else {
    lessons = parseLessons(pages)
    tasks = parseTasks(normalTaskFiles, 'aufgaben/')
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
 * Platz der VisuBot-Lektionen in der durchgehenden Reihe (Holger, 30.10.): VisuBot-Lektion → VisuStruct-Lektion,
 * nach der sie kommt (jeweils die zum selben Thema). Fehlt eine Nummer, kommt die Lektion ans Ende der Grundlagen.
 */
const visuBotPlaces: Record<number, number> = {
  1: 3, // Der mBot2 nach Speichern, Öffnen, Exportieren
  2: 5, // Das Quadrat nach Sequenz
  3: 5, // Variablen und Ausgabe
  4: 8, // Sensoren nach Verzweigung
  5: 11, // Bis zur Wand bis Einzelne LEDs nach der while-Schleife
  6: 11,
  7: 11,
  8: 11,
  9: 11,
  10: 11,
  11: 11,
  12: 11,
  13: 11,
  14: 11,
  15: 11,
  16: 14, // Lautsprecher nach Verschachteln
  17: 15, // Arrays und Melodien, Bildschirm nach Arrays
  18: 15,
  19: 17, // Zeichenketten, Motoren, Stoppuhr und Akku nach Zeichenketten
  20: 17,
  21: 17,
  22: 18, // Eigene Methoden nach Aufruf und Aussprung
}

const lessonNumbers = (files: [string, string][]) =>
  files.map(([name]) => Number(/^(\d+)/.exec(name)?.[1])).filter(Number.isFinite).sort((a, b) => a - b)

/** Die durchgehende VisuBot-Reihe: für beide Teile die Umrechnung alte Nummer → Nummer in der Reihe. */
function visuBotSeries(normal: number[], robot: number[]): { normal: Map<number, number>; robot: Map<number, number> } {
  const lastBasic = [...normal].reverse().find((n) => n <= 19) ?? normal.at(-1) ?? 0
  const place = (n: number) => (normal.includes(visuBotPlaces[n]) ? visuBotPlaces[n] : lastBasic)
  const normalMap = new Map<number, number>()
  const robotMap = new Map<number, number>()
  let next = 1
  for (const n of normal) {
    normalMap.set(n, next++)
    for (const r of robot.filter((r) => place(r) === n)) robotMap.set(r, next++)
  }
  return { normal: normalMap, robot: robotMap }
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
