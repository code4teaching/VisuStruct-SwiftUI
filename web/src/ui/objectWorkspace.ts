/**
 * VisuObject-Workspace wie in Eclipse: ein Ordner, darin ein Ordner je Projekt mit
 * `src/paket/Klasse.java`, daneben `visuobject.json` (UML-Zusatz und Lage der Kästen)
 * sowie `.project` und `.classpath`, damit Eclipse das Projekt direkt importieren kann.
 * Beim Lesen zählt der Ordner unter `src/` als Package, wie in Eclipse.
 */

import { packageOf, packagesOf, pathFor, umlFromJSON, type JavaProject } from '../core/javaProject'
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

export async function readProject(root: WsDir, name: string): Promise<{ project: JavaProject; positions: Positions }> {
  const dir = await root.dir(name)
  const project: JavaProject = { name, files: [], packages: [] }
  const src = await tryDir(dir, 'src')
  const walk = async (d: WsDir, pkg: string) => {
    const entries = await d.list()
    if (pkg && !entries.some((x) => x.kind === 'file' && /\.java$/i.test(x.name))) project.packages.push(pkg)
    for (const entry of entries) {
      if (entry.kind === 'directory') await walk(await d.dir(entry.name), pkg ? `${pkg}.${entry.name}` : entry.name)
      else if (/\.java$/i.test(entry.name)) project.files.push({ path: pathFor(pkg, entry.name), text: await d.read(entry.name) })
    }
  }
  if (src) await walk(src, '')
  // Ein Ordner mit nur Unterordnern (z. B. `de` über `de.tiere`) ist kein eigenes Package.
  project.packages = project.packages.filter((p) => !project.packages.some((q) => q.startsWith(p + '.')) && !project.files.some((f) => packageOf(f.path).startsWith(p + '.')))
  project.files.sort((a, b) => a.path.localeCompare(b.path))
  let positions: Positions = {}
  if (await dir.has(umlFile)) {
    try {
      const data = JSON.parse(await dir.read(umlFile)) as { uml?: unknown; positions?: unknown }
      const uml = umlFromJSON(data.uml)
      if (uml) project.uml = uml
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
	<classpathentry kind="src" path="src"/>
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
  const src = await dir.dir('src', true)
  const wanted = new Map(project.files.map((f) => [f.path, f.text]))
  const keepDirs = new Set<string>()
  for (const pkg of packagesOf(project).filter(Boolean)) {
    const parts = pkg.split('.')
    for (let i = 1; i <= parts.length; i++) keepDirs.add(parts.slice(0, i).join('/'))
  }
  // Erst aufräumen, dann schreiben: So bleibt keine alte Fassung einer verschobenen Datei liegen.
  const clean = async (d: WsDir, path: string) => {
    for (const entry of await d.list()) {
      const full = path ? `${path}/${entry.name}` : entry.name
      if (entry.kind === 'directory') {
        if (keepDirs.has(full)) await clean(await d.dir(entry.name), full)
        else await d.remove(entry.name)
      } else if (/\.java$/i.test(entry.name) && !wanted.has(full)) await d.remove(entry.name)
    }
  }
  await clean(src, '')
  for (const pkg of packagesOf(project)) {
    let d = src
    for (const part of pkg ? pkg.split('.') : []) d = await d.dir(part, true)
    for (const f of project.files.filter((x) => packageOf(x.path) === pkg)) {
      const name = f.path.slice(f.path.lastIndexOf('/') + 1)
      if (!(await d.has(name)) || (await d.read(name)) !== f.text) await d.write(name, f.text)
    }
  }
  await dir.write(umlFile, JSON.stringify({ format: 'visuobject', version: 1, uml: project.uml ?? {}, positions }, null, 2) + '\n')
  if (!(await dir.has('.project'))) await dir.write('.project', eclipseProject(project.name))
  if (!(await dir.has('.classpath'))) await dir.write('.classpath', eclipseClasspath)
}

/** Freier Projektname im Workspace: `MeinProjekt`, `MeinProjekt2` … */
export function freeProjectName(base: string, taken: string[]): string {
  const lower = new Set(taken.map((n) => n.toLowerCase()))
  let name = base
  for (let n = 2; lower.has(name.toLowerCase()); n++) name = base + n
  return name
}
