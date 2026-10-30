import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate'
import { barePackage, declaredPackage, defaultRoot, diskPath, isFolderName, packageKey, pathFor, notesFromJSON, projectFromFiles, rootOf, sourceFoldersOf, umlFromJSON, type JavaProject } from '../core/javaProject'

/**
 * VisuObject-Projekt als ZIP wie in Eclipse oder BlueJ: `Name/src/paket/Klasse.java`.
 * Beim Öffnen zählt die Zeile `package …;` in jeder Datei, nicht der Ordner im ZIP.
 * Was nur UML kennt (Aggregation, Name der Beziehung …) liegt daneben in `Name/visuobject.json`.
 */

const umlFile = 'visuobject.json'

export function projectToZip(project: JavaProject): Uint8Array {
  const folder = project.name.replace(/[\\/:*?"<>|]/g, '_') || 'Projekt'
  const entries: Record<string, Uint8Array> = {}
  for (const f of project.files) entries[`${folder}/${diskPath(f.path)}`] = new Uint8Array(strToU8(f.text)) // eigene Kopie: fflate prüft instanceof Uint8Array
  // Leere Packages und Source Folders als Ordner behalten.
  const dirs = [...project.packages.map((p) => `${folder}/${rootOf(p)}/${barePackage(p).replace(/\./g, '/')}/`), ...sourceFoldersOf(project).map((r) => `${folder}/${r}/`)]
  for (const dir of dirs) if (!Object.keys(entries).some((k) => k.startsWith(dir))) entries[dir.replace(/\/\/$/, '/')] = new Uint8Array()
  if ((project.uml && Object.keys(project.uml).length) || project.notes?.length)
    entries[`${folder}/${umlFile}`] = new Uint8Array(strToU8(JSON.stringify({ format: 'visuobject', version: 1, uml: project.uml ?? {}, ...(project.notes?.length ? { notes: project.notes } : {}) }, null, 2)))
  return zipSync(entries, { level: 6 })
}

export function projectFromZip(data: Uint8Array, fallbackName: string): JavaProject {
  const entries = unzipSync(data)
  const javaFiles = Object.entries(entries)
    .filter(([name]) => /\.java$/i.test(name) && !name.startsWith('__MACOSX/'))
    .map(([name, bytes]) => ({ name, text: strFromU8(bytes) }))
  const top = new Set(Object.keys(entries).map((n) => n.split('/')[0]))
  const name = top.size === 1 && Object.keys(entries).some((n) => n.includes('/')) ? [...top][0] : fallbackName
  // Nur Dateinamen weitergeben: Das Package kommt aus dem Code. Der Source Folder ist der Ordner über den Package-Ordnern.
  const single = name !== fallbackName
  const project = projectFromFiles(name, [])
  for (const f of javaFiles) {
    const one = projectFromFiles(name, [{ name: f.name.slice(f.name.lastIndexOf('/') + 1), text: f.text }]).files[0]
    const dirs = f.name.split('/').slice(single ? 1 : 0, -1)
    const pkgDirs = declaredPackage(one.text).split('.').filter(Boolean)
    const tail = dirs.slice(dirs.length - pkgDirs.length).join('/')
    const root = tail === pkgDirs.join('/') ? dirs.slice(0, dirs.length - pkgDirs.length).join('/') : ''
    const sourceFolder = root && root !== defaultRoot && root.split('/').every(isFolderName) && !root.includes(':') ? root : defaultRoot
    const path = pathFor(packageKey(sourceFolder, declaredPackage(one.text)), one.path.slice(one.path.lastIndexOf('/') + 1))
    project.files = [...project.files.filter((x) => x.path !== path), { ...one, path }]
    if (sourceFolder !== defaultRoot && !project.sourceFolders?.includes(sourceFolder)) project.sourceFolders = [...(project.sourceFolders ?? []), sourceFolder]
  }
  const extra = Object.entries(entries).find(([n]) => n === umlFile || n.endsWith(`/${umlFile}`))
  if (extra) {
    try {
      const data = JSON.parse(strFromU8(extra[1])) as { uml?: unknown; notes?: unknown }
      const uml = umlFromJSON(data.uml)
      if (uml) project.uml = uml
      const notes = notesFromJSON(data.notes)
      if (notes) project.notes = notes
    } catch {
      /* ohne UML-Zusatz geht es auch */
    }
  }
  return project
}
