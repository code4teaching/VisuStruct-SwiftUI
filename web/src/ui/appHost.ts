/**
 * Die Web-App eingebettet in der VisuStruct-App (iPhone, iPad, Mac): Die App setzt vor dem Laden
 * `window.visustructHost`. Im Browser fehlt es, dann ist alles frei wie bisher.
 *
 * In der App kostet nur der Kurs (Holger-Entscheidung 2026-10-23): die ersten Lektionen sind Vorschau,
 * der Rest braucht den In-App-Kauf. „Echtes Java (mit Swing)“ gibt es in der App nicht, weil die
 * CheerpJ-Community-Lizenz keine kommerzielle Nutzung erlaubt.
 */

interface HostInfo {
  courseUnlocked: boolean
  /** Lektionen 1 bis `freeLessons` sind ohne Kauf offen. */
  freeLessons: number
}

declare global {
  interface Window {
    visustructHost?: HostInfo
    /** Ruft die App nach Kauf, Wiederherstellen oder Erstattung auf. */
    visustructSetCourseUnlocked?: (unlocked: boolean) => void
    webkit?: { messageHandlers?: Record<string, { postMessage(message: unknown): void } | undefined> }
  }
}

const host = window.visustructHost
const listeners = new Set<() => void>()

/** `true` in der App, `false` im Browser. */
export const inApp = host !== undefined

/** Lektion (oder Aufgabe nach Lektion `number`) nur mit Kurs-Kauf. */
export function courseLocked(number: number): boolean {
  return host !== undefined && !host.courseUnlocked && number > host.freeLessons
}

/** Kauf-Fenster der App öffnen. */
export function buyCourse() {
  window.webkit?.messageHandlers?.visustruct?.postMessage({ type: 'buyCourse' })
}

/** Neu zeichnen, wenn sich der Kaufstatus ändert. */
export function onCourseChange(listener: () => void) {
  listeners.add(listener)
}

if (host) {
  window.visustructSetCourseUnlocked = (unlocked) => {
    if (host.courseUnlocked === unlocked) return
    host.courseUnlocked = unlocked
    for (const listener of listeners) listener()
  }
}
