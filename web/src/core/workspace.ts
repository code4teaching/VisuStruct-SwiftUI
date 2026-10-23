/** Workspace in der Spalte „Dateien“: Klasse → Tagesordner → Programme. Reine Hilfsfunktionen, ohne Dateizugriff. */

/** Ordnername für den Tag, z. B. `2026-10-23` (Ortszeit, nicht UTC). */
export function todayFolder(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Tagesordner werden neueste zuerst gezeigt, alles andere alphabetisch. */
export const isDayFolder = (name: string) => /^\d{4}-\d{2}-\d{2}$/.test(name)

export function compareEntries(a: { kind: string; name: string }, b: { kind: string; name: string }): number {
  if (a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1
  if (isDayFolder(a.name) && isDayFolder(b.name)) return b.name.localeCompare(a.name)
  return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
}

/** Dateiname aus dem Titel: ohne Zeichen, die Windows oder macOS nicht erlauben. */
export function programBaseName(title: string, fallback: string): string {
  const cleaned = title
    .replace(/\.(visustruct|strk|java)$/i, '')
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\.+/, '')
  return cleaned || fallback
}

/** Freier Name im Ordner: `Rechner`, sonst `Rechner 2`, `Rechner 3` … (für .visustruct und .java gemeinsam). */
export function uniqueBaseName(base: string, taken: Iterable<string>): string {
  const names = new Set([...taken].map((n) => n.toLowerCase()))
  const free = (b: string) => !names.has(`${b}.visustruct`.toLowerCase()) && !names.has(`${b}.java`.toLowerCase())
  if (free(base)) return base
  for (let i = 2; ; i++) if (free(`${base} ${i}`)) return `${base} ${i}`
}

/** Ordnername, den man anlegen darf. */
export function validFolderName(name: string): string | undefined {
  const cleaned = name.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '').trim()
  return cleaned && cleaned !== '.' && cleaned !== '..' ? cleaned : undefined
}
