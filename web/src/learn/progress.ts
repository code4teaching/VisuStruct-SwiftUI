/** Fortschritt im Lernbereich: im Browser und, wenn eingerichtet, als `learnProgress.json` im Workspace. */

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

const key = 'visustruct.learn.progress'

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

function load(): Store {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const s = JSON.parse(raw) as Partial<Store>
      return migrate({ lessons: s.lessons ?? {}, exercises: s.exercises ?? {}, view: s.view })
    }
  } catch {
    /* ohne Speicher oder kaputte Daten: neu anfangen */
  }
  return { lessons: {}, exercises: {} }
}

let store = load()
const listeners = new Set<() => void>()

function save() {
  try {
    localStorage.setItem(key, JSON.stringify(store))
  } catch {
    /* nur für diese Sitzung */
  }
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
    return (store.lessons[id] ??= { step: 0 })
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
    return JSON.stringify({ format: progressFormat, version: 1, saved: new Date().toISOString(), lessons: store.lessons, exercises: store.exercises }, null, 2)
  },
  /** `learnProgress.json` einlesen und mit dem Stand im Browser zusammenführen. Falsche Dateien bleiben unbeachtet. */
  mergeFile(text: string): boolean {
    let data: Partial<Store> & { format?: string }
    try {
      data = JSON.parse(text) as typeof data
    } catch {
      return false
    }
    if (data?.format !== progressFormat) return false
    const theirs = migrate({ lessons: data.lessons ?? {}, exercises: data.exercises ?? {} })
    const merged = mergeProgress(store, theirs)
    const changed = JSON.stringify(merged) !== JSON.stringify({ lessons: store.lessons, exercises: store.exercises })
    store = { ...store, ...merged }
    if (changed) save()
    return changed
  },
  /** Für Tests. */
  reload() {
    store = load()
  },
}
