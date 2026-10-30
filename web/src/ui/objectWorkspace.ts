/**
 * VisuObject-Workspace wie in Eclipse: ein Ordner, darin ein Ordner je Projekt mit
 * `src/paket/Klasse.java`, daneben `visuobject.json` (UML-Zusatz und Lage der Kästen)
 * sowie `.project` und `.classpath`, damit Eclipse das Projekt direkt importieren kann.
 * Beim Lesen zählt der Ordner unter dem Source Folder als Package, wie in Eclipse.
 * Welche Ordner Source Folders sind (`src`, `test` …), steht in `.classpath`.
 */

import { defaultRoot, isFolderName, notesFromJSON, packageKey, packageOf, packagesOf, pathFor, rootOf, sourceFoldersOf, umlFromJSON, type JavaProject } from '../core/javaProject'
import type { WsDir } from './workspaceStore'

export const workspaceFolderName = 'VisuObject-Workspace'
const umlFile = 'visuobject.json'

export type Positions = Record<string, { x: number; y: number }>

export const safeFolderName = (name: string) => name.replace(/[\\/:*?"<>|]/g, '_').trim() || 'Projekt'

async function tryDir(dir: WsDir, name: string): Promise<WsDir | undefined> {
  try {
    return await dir.dir(name)
  } catch {
    return undefined
  }
}

/** Projektordner im Workspace: alle Ordner mit `src` oder `visuobject.json`, sortiert. */
export async function listProjects(root: WsDir): Promise<string[]> {
  const out: string[] = []
  for (const entry of await root.list()) {
    if (entry.kind !== 'directory') continue
    const dir = await root.dir(entry.name)
    if ((await dir.has('src')) || (await dir.has(umlFile))) out.push(entry.name)
  }
  return out.sort((a, b) => a.localeCompare(b))
}

/** Source Folders aus `.classpath` (`<classpathentry kind="src" path="test"/>`); ohne Datei nur `src`. */
export function classpathRoots(xml: string): string[] {
  const roots = [...xml.matchAll(/<classpathentry\b[^>]*>/g)]
    .map((m) => m[0])
    .filter((tag) => /\bkind\s*=\s*"src"/.test(tag) && !/\bcombineaccessrules\b/.test(tag))
    .map((tag) => /\bpath\s*=\s*"([^"]+)"/.exec(tag)?.[1] ?? '')
    .filter((p) => p && !p.startsWith('/') && !p.includes(':') && p.split('/').every(isFolderName))
  return roots.length ? [...new Set(roots)] : [defaultRoot]
}

/** Source-Einträge in `.classpath` ersetzen, alles andere (z. B. Bibliotheken aus Eclipse) bleibt. */
export function withClasspathRoots(xml: string, roots: string[]): string {
  const entries = roots.map((r) => `\t<classpathentry kind="src" path="${r}"/>\n`).join('')
  const rest = xml.replace(/[ \t]*<classpathentry\b[^>]*\bkind\s*=\s*"src"[^>]*\/>[ \t]*\n?/g, (tag) => (/\bcombineaccessrules\b/.test(tag) ? tag : ''))
  return rest.replace(/(<classpath\b[^>]*>[ \t]*\n?)/, `$1${entries}`)
}

export async function readProject(root: WsDir, name: string): Promise<{ project: JavaProject; positions: Positions }> {
  const dir = await root.dir(name)
  const project: JavaProject = { name, files: [], packages: [] }
  const roots = (await dir.has('.classpath')) ? classpathRoots(await dir.read('.classpath')) : [defaultRoot]
  const walk = async (d: WsDir, sourceFolder: string, pkg: string) => {
    const entries = await d.list()
    const key = packageKey(sourceFolder, pkg)
    if (pkg && !entries.some((x) => x.kind === 'file' && /\.java$/i.test(x.name))) project.packages.push(key)
    for (const entry of entries) {
      if (entry.kind === 'directory') await walk(await d.dir(entry.name), sourceFolder, pkg ? `${pkg}.${entry.name}` : entry.name)
      else if (/\.java$/i.test(entry.name)) project.files.push({ path: pathFor(key, entry.name), text: await d.read(entry.name) })
    }
  }
  for (const r of roots) {
    let d: WsDir | undefined = dir
    for (const part of r.split('/')) d = d && (await tryDir(d, part))
    if (d) await walk(d, r, '')
  }
  const extra = roots.filter((r) => r !== defaultRoot)
  if (extra.length) project.sourceFolders = extra
  // Ein Ordner mit nur Unterordnern (z. B. `de` über `de.tiere`) ist kein eigenes Package.
  project.packages = project.packages.filter((p) => !project.packages.some((q) => q.startsWith(p + '.')) && !project.files.some((f) => packageOf(f.path).startsWith(p + '.')))
  project.files.sort((a, b) => a.path.localeCompare(b.path))
  let positions: Positions = {}
  if (await dir.has(umlFile)) {
    try {
      const data = JSON.parse(await dir.read(umlFile)) as { uml?: unknown; positions?: unknown; notes?: unknown }
      const uml = umlFromJSON(data.uml)
      if (uml) project.uml = uml
      const notes = notesFromJSON(data.notes)
      if (notes) project.notes = notes
      if (data.positions && typeof data.positions === 'object') {
        for (const [cls, p] of Object.entries(data.positions as Record<string, { x?: unknown; y?: unknown }>))
          if (typeof p?.x === 'number' && typeof p?.y === 'number') positions[cls] = { x: p.x, y: p.y }
      }
    } catch {
      positions = {}
    }
  }
  return { project, positions }
}

const eclipseProject = (name: string) => `<?xml version="1.0" encoding="UTF-8"?>
<projectDescription>
	<name>${name.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!)}</name>
	<comment></comment>
	<projects>
	</projects>
	<buildSpec>
		<buildCommand>
			<name>org.eclipse.jdt.core.javabuilder</name>
			<arguments>
			</arguments>
		</buildCommand>
	</buildSpec>
	<natures>
		<nature>org.eclipse.jdt.core.javanature</nature>
	</natures>
</projectDescription>
`

const eclipseClasspath = `<?xml version="1.0" encoding="UTF-8"?>
<classpath>
	<classpathentry kind="con" path="org.eclipse.jdt.launching.JRE_CONTAINER"/>
	<classpathentry kind="output" path="bin"/>
</classpath>
`

/**
 * Projekt in seinen Ordner schreiben. Dateien und Packages, die es nicht mehr gibt, verschwinden;
 * alles andere im Ordner (z. B. `bin` von Eclipse) bleibt.
 */
export async function writeProject(root: WsDir, folder: string, project: JavaProject, positions: Positions): Promise<void> {
  const dir = await root.dir(folder, true)
  const roots = sourceFoldersOf(project)
  const oldClasspath = (await dir.has('.classpath')) ? await dir.read('.classpath') : undefined
  // Source Folders, die es nicht mehr gibt, verschwinden samt Inhalt (nur solche, die `.classpath` kannte).
  for (const old of oldClasspath ? classpathRoots(oldClasspath) : [])
    if (!roots.includes(old) && !old.includes('/') && (await dir.has(old))) await dir.remove(old)
  for (const sourceFolder of roots) {
    let src = dir
    for (const part of sourceFolder.split('/')) src = await src.dir(part, true)
    const files = project.files.filter((f) => rootOf(f.path) === sourceFolder)
    const wanted = new Set(files.map((f) => f.path.slice(f.path.indexOf(':') + 1)))
    const keepDirs = new Set<string>()
    for (const key of packagesOf(project, sourceFolder)) {
      const pkg = key.slice(key.indexOf(':') + 1)
      if (!pkg) continue
      const parts = pkg.split('.')
      for (let i = 1; i <= parts.length; i++) keepDirs.add(parts.slice(0, i).join('/'))
    }
    // Erst aufräumen, dann schreiben: So bleibt keine alte Fassung einer verschobenen Datei liegen.
    const clean = async (d: WsDir, path: string) => {
      for (const entry of await d.list()) {
        const full = path ? `${path}/${entry.name}` : entry.name
        if (entry.kind === 'directory') {
          if (keepDirs.has(full)) await clean(await d.dir(entry.name), full)
          else if (!roots.some((r) => `${sourceFolder}/${full}` === r || r.startsWith(`${sourceFolder}/${full}/`))) await d.remove(entry.name)
        } else if (/\.java$/i.test(entry.name) && !wanted.has(full)) await d.remove(entry.name)
      }
    }
    await clean(src, '')
    for (const key of packagesOf(project, sourceFolder)) {
      const pkg = key.slice(key.indexOf(':') + 1)
      let d = src
      for (const part of pkg ? pkg.split('.') : []) d = await d.dir(part, true)
      for (const f of files.filter((x) => packageOf(x.path) === key)) {
        const name = f.path.slice(f.path.lastIndexOf('/') + 1).slice(f.path.includes('/') ? 0 : f.path.indexOf(':') + 1)
        if (!(await d.has(name)) || (await d.read(name)) !== f.text) await d.write(name, f.text)
      }
    }
  }
  await dir.write(umlFile, JSON.stringify({ format: 'visuobject', version: 1, uml: project.uml ?? {}, ...(project.notes?.length ? { notes: project.notes } : {}), positions }, null, 2) + '\n')
  if (!(await dir.has('.project'))) await dir.write('.project', eclipseProject(project.name))
  const classpath = withClasspathRoots(oldClasspath ?? eclipseClasspath, roots)
  if (classpath !== oldClasspath) await dir.write('.classpath', classpath)
}

/** Freier Projektname im Workspace: `MeinProjekt`, `MeinProjekt2` … */
export function freeProjectName(base: string, taken: string[]): string {
  const lower = new Set(taken.map((n) => n.toLowerCase()))
  let name = base
  for (let n = 2; lower.has(name.toLowerCase()); n++) name = base + n
  return name
}
