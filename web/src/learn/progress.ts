/** Fortschritt im Lernbereich, nur in diesem Browser (wie bei PicoJavaGoat). */

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

function load(): Store {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const s = JSON.parse(raw) as Partial<Store>
      return { lessons: s.lessons ?? {}, exercises: s.exercises ?? {}, view: s.view }
    }
  } catch {
    /* ohne Speicher oder kaputte Daten: neu anfangen */
  }
  return { lessons: {}, exercises: {} }
}

let store = load()

function save() {
  try {
    localStorage.setItem(key, JSON.stringify(store))
  } catch {
    /* nur für diese Sitzung */
  }
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
  /** Für Tests. */
  reload() {
    store = load()
  },
}
