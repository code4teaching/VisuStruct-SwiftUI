/**
 * Fortschritt im Lernbereich. Er steht nur in `learnProgress.json` im Workspace; der Browser merkt sich
 * ihn nicht (nur den Ordner). Ohne Workspace gilt er bis zum Neuladen.
 */

export interface LessonProgress {
  step: number
  done?: boolean
  checks?: Record<string, boolean>
  /** Gewählte Antwort je Frage („Block-Frage“ → Antwortindex). */
  quiz?: Record<string, number>
}

export interface ExerciseProgress {
  done?: boolean
  /** Letzter Stand des Diagramms als .visustruct-XML. */
  xml?: string
}

interface Store {
  lessons: Record<string, LessonProgress>
  exercises: Record<string, ExerciseProgress>
  /** Zuletzt geöffnete Ansicht. */
  view?: { tab: string; lesson?: string; task?: string }
}

/** Früher lag der Lernstand zusätzlich im Browser; dieser Rest wird beim Start gelöscht. */
const legacyKey = 'visustruct.learn.progress'

/** Umbenannte Lektionen (alte Kennung → neue), damit der Fortschritt erhalten bleibt. */
const renamedLessons: Record<string, string> = {
  '04-sequenz': '05-sequenz',
  '05-variablen-und-datentypen': '04-variablen-und-datentypen',
  '07-verzweigung': '08-verzweigung',
  '08-bedingungen-verknuepfen': '09-bedingungen-verknuepfen',
  '09-fallauswahl': '10-fallauswahl',
  '10-while-schleife': '11-while-schleife',
  '11-do-while-schleife': '12-do-while-schleife',
  '12-for-schleife': '13-for-schleife',
  '13-verschachteln': '14-verschachteln',
  '14-arrays': '15-arrays',
  '15-aufruf-und-aussprung': '18-aufruf-und-aussprung',
  '16-aufruf-und-aussprung': '18-aufruf-und-aussprung',
  '17-aufruf-und-aussprung': '18-aufruf-und-aussprung',
  '17-suchen-und-sortieren': '19-suchen-und-sortieren',
  '18-suchen-und-sortieren': '19-suchen-und-sortieren',
  '16-simulation-und-schreibtischtest': '07-simulation-und-schreibtischtest',
  '17-java': '20-java',
  '18-java': '20-java',
  '19-java': '20-java',
  '18-python-und-javascript': '21-python-und-javascript',
  '19-python-und-javascript': '21-python-und-javascript',
  '20-python-und-javascript': '21-python-und-javascript',
  '22-erstes-fenster': '28-erstes-fenster',
  '23-knopf-im-fenster': '29-knopf-im-fenster',
  '24-der-knopf-reagiert': '30-der-knopf-reagiert',
  '23-erstes-fenster': '28-erstes-fenster',
  '24-knopf-im-fenster': '29-knopf-im-fenster',
  '25-der-knopf-reagiert': '30-der-knopf-reagiert',
  '26-zahl-verdoppeln': '31-zahl-verdoppeln',
  '27-klickzaehler': '32-klickzaehler',
  '28-ampel': '33-ampel',
  '29-notenrechner': '34-notenrechner',
  '30-taschenrechner': '35-taschenrechner',
  '31-zahlenraten': '36-zahlenraten',
  // VisuBot ab 0.4.4 (neue Lektion 13 Einzelne LEDs) und ab 0.5 (Grundlagen-Lektionen 3, 9, 17, 19, 22)
  '13-lautsprecher': '16-lautsprecher',
  '14-bildschirm': '18-bildschirm',
  '15-motoren': '20-motoren',
  '16-stoppuhr-akku': '21-stoppuhr-akku',
  '03-sensoren': '04-sensoren',
  '04-bis-zur-wand': '05-bis-zur-wand',
  '05-abstand': '06-abstand',
  '06-linie': '07-linie',
  '07-farben': '08-farben',
  '08-tasten-joystick': '10-tasten-joystick',
  '09-licht': '11-licht',
  '10-lautstaerke': '12-lautstaerke',
  '11-neigung': '13-neigung',
  '12-leds': '14-leds',
  '13-einzelne-leds': '15-einzelne-leds',
  '14-lautsprecher': '16-lautsprecher',
  '15-bildschirm': '18-bildschirm',
  '16-motoren': '20-motoren',
  '17-stoppuhr-akku': '21-stoppuhr-akku',
}

function migrate(s: Store): Store {
  const lessons = { ...s.lessons }
  for (const [old, now] of Object.entries(renamedLessons)) {
    if (s.lessons[old] && !s.lessons[now]) lessons[now] = s.lessons[old]
    if (s.lessons[old]) delete lessons[old]
  }
  const view = s.view?.lesson && renamedLessons[s.view.lesson] ? { ...s.view, lesson: renamedLessons[s.view.lesson] } : s.view
  return { ...s, lessons, view }
}

function forgetLegacy() {
  try {
    localStorage.removeItem(legacyKey)
  } catch {
    /* ohne Speicher: nichts zu löschen */
  }
}

const empty = (): Store => ({ lessons: {}, exercises: {} })

forgetLegacy()
let store = empty()
const listeners = new Set<() => void>()

function save() {
  for (const f of listeners) f()
}

/** Kennung der Lernstand-Datei, damit eine fremde JSON-Datei nicht eingelesen wird. */
export const progressFormat = 'visustruct-lernstand'

function or(a?: boolean, b?: boolean): boolean | undefined {
  return a || b || undefined
}

function mergeLesson(mine: LessonProgress | undefined, theirs: LessonProgress): LessonProgress {
  if (!mine) return theirs
  const checks = { ...theirs.checks }
  for (const [k, v] of Object.entries(mine.checks ?? {})) checks[k] = v || !!checks[k]
  return {
    step: Math.max(mine.step ?? 0, theirs.step ?? 0),
    done: or(mine.done, theirs.done),
    checks: Object.keys(checks).length ? checks : undefined,
    quiz: mine.quiz || theirs.quiz ? { ...theirs.quiz, ...mine.quiz } : undefined,
  }
}

/** Zwei Stände zusammenführen: erledigt bleibt erledigt, der weiteste Schritt zählt, eigene Diagramme gehen vor. */
export function mergeProgress(mine: Pick<Store, 'lessons' | 'exercises'>, theirs: Pick<Store, 'lessons' | 'exercises'>) {
  const lessons = { ...mine.lessons }
  for (const [id, l] of Object.entries(theirs.lessons)) lessons[id] = mergeLesson(mine.lessons[id], l)
  const exercises = { ...mine.exercises }
  for (const [id, e] of Object.entries(theirs.exercises)) {
    const m = mine.exercises[id]
    exercises[id] = m ? { done: or(m.done, e.done), xml: m.xml ?? e.xml } : e
  }
  return { lessons, exercises }
}

export const progress = {
  lesson(id: string): LessonProgress {
    return store.lessons[id] ?? { step: 0 }
  },
  updateLesson(id: string, change: Partial<LessonProgress>) {
    store.lessons[id] = { ...progress.lesson(id), ...change }
    save()
  },
  exercise(id: string): ExerciseProgress {
    return store.exercises[id] ?? {}
  },
  updateExercise(id: string, change: Partial<ExerciseProgress>) {
    store.exercises[id] = { ...progress.exercise(id), ...change }
    save()
  },
  resetExercise(id: string) {
    delete store.exercises[id]
    save()
  },
  view() {
    return store.view
  },
  /** Schon etwas gelernt oder geübt (z. B. für die Warnung beim Schließen ohne Ordner)? */
  hasContent(): boolean {
    return Object.values(store.lessons).some((l) => l.step > 0 || l.done || l.checks || l.quiz) || Object.keys(store.exercises).length > 0
  },
  setView(view: Store['view']) {
    store.view = view
    save()
  },
  /** Bei jeder Änderung, z. B. um die Datei im Workspace nachzuziehen. */
  onChange(f: () => void): () => void {
    listeners.add(f)
    return () => listeners.delete(f)
  },
  /** Inhalt von `learnProgress.json`. */
  toFile(): string {
    return JSON.stringify({ format: progressFormat, version: 1, saved: new Date().toISOString(), lessons: store.lessons, exercises: store.exercises, view: store.view }, null, 2)
  },
  /**
   * `learnProgress.json` übernehmen: Die Datei ersetzt den Stand, nur mit `keepSession` kommt hinzu, was in dieser
   * Sitzung vor dem Öffnen des Workspace gelernt wurde. Falsche Dateien bleiben unbeachtet.
   */
  loadFile(text: string, keepSession = false): boolean {
    let data: Partial<Store> & { format?: string }
    try {
      data = JSON.parse(text) as typeof data
    } catch {
      return false
    }
    if (data?.format !== progressFormat) return false
    const file = migrate({ lessons: data.lessons ?? {}, exercises: data.exercises ?? {}, view: data.view })
    store = keepSession ? { ...mergeProgress(store, file), view: file.view ?? store.view } : file
    return true
  },
  /** Neuer Workspace ohne Datei: mit leerem Lernstand beginnen (bzw. den dieser Sitzung behalten). */
  clear() {
    store = empty()
  },
}
