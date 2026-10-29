import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate'
import { projectFromFiles, umlFromJSON, type JavaProject } from '../core/javaProject'

/**
 * VisuObject-Projekt als ZIP wie in Eclipse oder BlueJ: `Name/src/paket/Klasse.java`.
 * Beim Öffnen zählt die Zeile `package …;` in jeder Datei, nicht der Ordner im ZIP.
 * Was nur UML kennt (Aggregation, Name der Beziehung …) liegt daneben in `Name/visuobject.json`.
 */

const umlFile = 'visuobject.json'

export function projectToZip(project: JavaProject): Uint8Array {
  const folder = project.name.replace(/[\\/:*?"<>|]/g, '_') || 'Projekt'
  const entries: Record<string, Uint8Array> = {}
  for (const f of project.files) entries[`${folder}/src/${f.path}`] = new Uint8Array(strToU8(f.text)) // eigene Kopie: fflate prüft instanceof Uint8Array
  // Leere Packages als Ordner behalten.
  for (const p of project.packages) {
    const dir = `${folder}/src/${p.replace(/\./g, '/')}/`
    if (!Object.keys(entries).some((k) => k.startsWith(dir))) entries[dir] = new Uint8Array()
  }
  if (project.uml && Object.keys(project.uml).length) entries[`${folder}/${umlFile}`] = new Uint8Array(strToU8(JSON.stringify({ format: 'visuobject', version: 1, uml: project.uml }, null, 2)))
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
  const project = projectFromFiles(name, javaFiles.map((f) => ({ name: f.name.slice(f.name.lastIndexOf('/') + 1), text: f.text })))
  const extra = Object.entries(entries).find(([n]) => n === umlFile || n.endsWith(`/${umlFile}`))
  if (extra) {
    try {
      const uml = umlFromJSON((JSON.parse(strFromU8(extra[1])) as { uml?: unknown }).uml)
      if (uml) project.uml = uml
    } catch {
      /* ohne UML-Zusatz geht es auch */
    }
  }
  return project
}
