/**
 * Lehrermodus: Mit dem Lehrercode werden die Musterlösungen sichtbar.
 * Im Code steht nur der SHA-256-Hash des Lehrercodes. Das hält Schüler ab, ist aber kein echter Schutz,
 * denn alles läuft im Browser.
 */

const codeHash = 'f4ecc8e489ae7865308288c7d0fa313333cf2be3ff529b23bc214bee010310e0'
const storageKey = 'visustruct.learn.teacher'
/** Gilt auch, wenn der Browser nichts speichern darf, dann bis zum Neuladen. */
let unlocked = false

export function isTeacher(): boolean {
  if (unlocked) return true
  try {
    return localStorage.getItem(storageKey) === codeHash
  } catch {
    return false
  }
}

async function sha256(text: string): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Prüft den Code und merkt sich den Lehrermodus im Browser. */
export async function unlockTeacher(code: string): Promise<boolean> {
  let ok = false
  try {
    ok = (await sha256(code.trim())) === codeHash
  } catch {
    return false
  }
  if (ok) {
    unlocked = true
    try {
      localStorage.setItem(storageKey, codeHash)
    } catch {
      /* ohne Speicher gilt der Lehrermodus bis zum Neuladen */
    }
  }
  return ok
}

export function lockTeacher(): void {
  unlocked = false
  try {
    localStorage.removeItem(storageKey)
  } catch {
    /* nichts zu tun */
  }
}
