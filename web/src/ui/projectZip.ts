import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate'
import { projectFromFiles, type JavaProject } from '../core/javaProject'

/**
 * VisuObject-Projekt als ZIP wie in Eclipse oder BlueJ: `Name/src/paket/Klasse.java`.
 * Beim Öffnen zählt die Zeile `package …;` in jeder Datei, nicht der Ordner im ZIP.
 */

export function projectToZip(project: JavaProject): Uint8Array {
  const folder = project.name.replace(/[\\/:*?"<>|]/g, '_') || 'Projekt'
  const entries: Record<string, Uint8Array> = {}
  for (const f of project.files) entries[`${folder}/src/${f.path}`] = new Uint8Array(strToU8(f.text)) // eigene Kopie: fflate prüft instanceof Uint8Array
  // Leere Packages als Ordner behalten.
  for (const p of project.packages) {
    const dir = `${folder}/src/${p.replace(/\./g, '/')}/`
    if (!Object.keys(entries).some((k) => k.startsWith(dir))) entries[dir] = new Uint8Array()
  }
  return zipSync(entries, { level: 6 })
}

export function projectFromZip(data: Uint8Array, fallbackName: string): JavaProject {
  const entries = unzipSync(data)
  const javaFiles = Object.entries(entries)
    .filter(([name]) => /\.java$/i.test(name) && !name.startsWith('__MACOSX/'))
    .map(([name, bytes]) => ({ name, text: strFromU8(bytes) }))
  const top = new Set(Object.keys(entries).map((n) => n.split('/')[0]))
  const name = top.size === 1 && Object.keys(entries).some((n) => n.includes('/')) ? [...top][0] : fallbackName
  // Nur Dateinamen weitergeben: Das Package kommt aus dem Code.
  return projectFromFiles(name, javaFiles.map((f) => ({ name: f.name.slice(f.name.lastIndexOf('/') + 1), text: f.text })))
}
