/**
 * VisuObject: ein Java-Projekt aus mehreren Dateien, wie im Package Explorer von Eclipse.
 * Jede Datei liegt in einem Package (Ordner); die Zeile `package …;` im Code folgt dem Ordner.
 * Das Klassendiagramm zeigt die Klassen aller Dateien.
 */

import { parseClasses, type UmlClass } from './classModel'
import type { UmlInfo } from './umlRelations'

export interface ProjectFile {
  /**
   * Pfad unter `src/`, z. B. `tiere/Hund.java`; ohne Ordner im Standard-Package.
   * In einem anderen Source Folder steht er davor mit Doppelpunkt: `test:tiere/HundTest.java`.
   */
  path: string
  text: string
}

export interface JavaProject {
  name: string
  files: ProjectFile[]
  /** Auch leere Packages, z. B. gleich nach „+ Package“ (in anderen Source Folders als `test:tiere`). */
  packages: string[]
  /** Source Folders außer `src`, z. B. `test`, wie in Eclipse; auch leere. */
  sourceFolders?: string[]
  /** Was nur UML kennt (Aggregation, Name der Beziehung …), siehe `umlRelations.ts`. */
  uml?: UmlInfo
  /** Notizen im Klassendiagramm (Kasten mit Eselsohr), evtl. gestrichelt an Klassen geheftet. */
  notes?: UmlNote[]
}

export interface UmlNote {
  id: string
  text: string
  x: number
  y: number
  /** Klassen, an die die Notiz mit gestrichelter Linie geheftet ist. */
  attach?: string[]
}

/** Klasse mit Datei und Package, für Diagramm und Explorer. */
export interface ProjectClass extends UmlClass {
  path: string
  /** Java-Package ohne Source Folder (wie in `package …;`). */
  pkg: string
  /** Source Folder, meist `src`. */
  root: string
}

export const defaultRoot = 'src'

/** `test:tiere/X.java` → `test` und `tiere/X.java`; ohne Doppelpunkt `src`. Genauso für Package-Schlüssel. */
export function splitRoot(key: string): { root: string; rest: string } {
  const i = key.indexOf(':')
  return i < 0 ? { root: defaultRoot, rest: key } : { root: key.slice(0, i), rest: key.slice(i + 1) }
}
const withRoot = (root: string, rest: string) => (root === defaultRoot ? rest : `${root}:${rest}`)

/** Schlüssel des Packages im Explorer: `tiere`, in anderen Source Folders `test:tiere`. */
export const packageKey = (root: string, pkg: string) => withRoot(root, pkg)
/** Java-Package ohne Source Folder. */
export const barePackage = (key: string) => splitRoot(key).rest
export const rootOf = (key: string) => splitRoot(key).root

export const packageOf = (path: string) => {
  const { root, rest } = splitRoot(path)
  return withRoot(root, rest.includes('/') ? rest.slice(0, rest.lastIndexOf('/')).replace(/\//g, '.') : '')
}
export const fileNameOf = (path: string) => {
  const rest = splitRoot(path).rest
  return rest.slice(rest.lastIndexOf('/') + 1)
}
export const pathFor = (pkg: string, file: string) => {
  const { root, rest } = splitRoot(pkg)
  return withRoot(root, rest ? `${rest.replace(/\./g, '/')}/${file}` : file)
}
/** Pfad wie auf der Festplatte, z. B. `test/tiere/HundTest.java`. */
export const diskPath = (path: string) => {
  const { root, rest } = splitRoot(path)
  return `${root}/${rest}`
}

const folderName = /^[\p{L}\p{N}_$-][\p{L}\p{N}_$.-]*$/u
export const isFolderName = (name: string) => folderName.test(name) && !name.includes('..')

/** Alle Source Folders: `src` zuerst, dann die übrigen (auch leere und solche, die nur aus Dateien bekannt sind). */
export function sourceFoldersOf(project: JavaProject): string[] {
  const all = new Set([defaultRoot, ...(project.sourceFolders ?? [])])
  for (const f of project.files) all.add(rootOf(f.path))
  for (const p of project.packages) all.add(rootOf(p))
  return [...all].sort((a, b) => (a === defaultRoot ? -1 : b === defaultRoot ? 1 : a.localeCompare(b)))
}

const packageName = /^[a-z_$][\p{L}\p{N}_$]*(\.[a-z_$][\p{L}\p{N}_$]*)*$/u
export const isPackageName = (name: string) => packageName.test(name)

/**
 * Alle Packages als Schlüssel: aus den Dateien und die leeren, sortiert nach Source Folder;
 * das Standard-Package nur, wenn Dateien darin liegen. Mit `root` nur die aus diesem Source Folder.
 */
export function packagesOf(project: JavaProject, root?: string): string[] {
  const all = new Set(project.packages)
  for (const f of project.files) all.add(packageOf(f.path))
  const roots = sourceFoldersOf(project)
  return [...all]
    .filter((p) => barePackage(p) !== '' || project.files.some((f) => packageOf(f.path) === p))
    .filter((p) => root === undefined || rootOf(p) === root)
    .sort((a, b) => {
      const ra = roots.indexOf(rootOf(a)) - roots.indexOf(rootOf(b))
      if (ra) return ra
      const [x, y] = [barePackage(a), barePackage(b)]
      return x === '' ? 1 : y === '' ? -1 : x.localeCompare(y)
    })
}

export function filesIn(project: JavaProject, pkg: string): ProjectFile[] {
  return project.files.filter((f) => packageOf(f.path) === pkg).sort((a, b) => a.path.localeCompare(b.path))
}

/** `package …;` am Anfang setzen, ändern oder (Standard-Package) entfernen. */
export function withPackageLine(text: string, key: string): string {
  const pkg = barePackage(key)
  const line = /^(\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*)*)package\s+[\w.]+\s*;[ \t]*\n?/
  const match = line.exec(text)
  if (match) {
    if (!pkg) return match[1] + text.slice(match[0].length).replace(/^\n/, '')
    return `${match[1]}package ${pkg};\n` + text.slice(match[0].length)
  }
  if (!pkg) return text
  return `package ${pkg};\n\n${text.replace(/^\n+/, '')}`
}

/** Package aus der Zeile `package …;` lesen (für geöffnete Dateien). */
export function declaredPackage(text: string): string {
  return /^\s*(?:(?:\/\/[^\n]*|\/\*[\s\S]*?\*\/)\s*)*package\s+([\w.]+)\s*;/.exec(text)?.[1] ?? ''
}

export function projectClasses(project: JavaProject): ProjectClass[] {
  return project.files.flatMap((f) => parseClasses(f.text).map((c) => ({ ...c, path: f.path, pkg: barePackage(packageOf(f.path)), root: rootOf(f.path) })))
}

export function updateFile(project: JavaProject, path: string, text: string): JavaProject {
  return { ...project, files: project.files.map((f) => (f.path === path ? { ...f, text } : f)) }
}

export function addFile(project: JavaProject, path: string, text: string): JavaProject {
  return { ...project, files: [...project.files.filter((f) => f.path !== path), { path, text }] }
}

export function removeFile(project: JavaProject, path: string): JavaProject {
  // Das Package bleibt sichtbar, auch wenn es jetzt leer ist.
  const pkg = packageOf(path)
  return { ...project, files: project.files.filter((f) => f.path !== path), packages: pkg && !project.packages.includes(pkg) ? [...project.packages, pkg] : project.packages }
}

/** Datei umbenennen oder in ein anderes Package schieben; die `package`-Zeile passt sich an. */
export function moveFile(project: JavaProject, path: string, to: string): JavaProject {
  const pkg = packageOf(to)
  return {
    ...project,
    files: project.files.map((f) => (f.path === path ? { path: to, text: packageOf(path) === pkg ? f.text : withPackageLine(f.text, pkg) } : f)),
  }
}

export function addPackage(project: JavaProject, pkg: string): JavaProject {
  return project.packages.includes(pkg) ? project : { ...project, packages: [...project.packages, pkg] }
}

/** Package umbenennen (auch Unter-Packages wie `tiere.haus`). */
export function renamePackage(project: JavaProject, from: string, to: string): JavaProject {
  const rename = (p: string) => (p === from ? to : p.startsWith(from + '.') ? to + p.slice(from.length) : p)
  return {
    ...project,
    packages: [...new Set(project.packages.map(rename))],
    files: project.files.map((f) => {
      const pkg = packageOf(f.path)
      const next = rename(pkg)
      return next === pkg ? f : { path: pathFor(next, fileNameOf(f.path)), text: withPackageLine(f.text, next) }
    }),
  }
}

/** Neuer, leerer Source Folder wie `test`. */
export function addSourceFolder(project: JavaProject, name: string): JavaProject {
  return sourceFoldersOf(project).includes(name) ? project : { ...project, sourceFolders: [...(project.sourceFolders ?? []), name] }
}

/** Source Folder umbenennen; Dateien und Packages ziehen mit (`src` bleibt). */
export function renameSourceFolder(project: JavaProject, from: string, to: string): JavaProject {
  const move = (key: string) => (rootOf(key) === from ? withRoot(to, barePackage(key)) : key)
  return {
    ...project,
    sourceFolders: (project.sourceFolders ?? []).map((r) => (r === from ? to : r)).filter((r) => r !== defaultRoot),
    packages: project.packages.map(move),
    files: project.files.map((f) => (rootOf(f.path) === from ? { ...f, path: withRoot(to, splitRoot(f.path).rest) } : f)),
  }
}

/** Source Folder samt Packages und Dateien löschen (`src` nicht). */
export function removeSourceFolder(project: JavaProject, root: string): JavaProject {
  if (root === defaultRoot) return project
  return {
    ...project,
    sourceFolders: (project.sourceFolders ?? []).filter((r) => r !== root),
    packages: project.packages.filter((p) => rootOf(p) !== root),
    files: project.files.filter((f) => rootOf(f.path) !== root),
  }
}

/** Package samt Dateien löschen. */
export function removePackage(project: JavaProject, pkg: string): JavaProject {
  return { ...project, packages: project.packages.filter((p) => p !== pkg), files: project.files.filter((f) => packageOf(f.path) !== pkg) }
}

/** Neue Datei für eine Klasse: `package …;` und ein leerer Rumpf. */
export function classFileText(pkg: string, name: string, kind: 'class' | 'interface'): string {
  return withPackageLine(`public ${kind} ${name} {\n}\n`, pkg)
}

/** Eine einzelne Datei (z. B. aus Stufe 1 oder ein geöffnetes `.java`) als Projekt. */
export function projectFromFiles(name: string, files: { name: string; text: string }[]): JavaProject {
  const out: ProjectFile[] = []
  for (const f of files) {
    const text = f.text.replace(/\r\n/g, '\n')
    const pkg = declaredPackage(text)
    const publicClass = /\bpublic\s+(?:abstract\s+|final\s+)*(?:class|interface|enum)\s+(\w+)/.exec(text)?.[1]
    const fileName = /\.java$/i.test(f.name) ? fileNameOf(f.name) : `${publicClass ?? parseClasses(text)[0]?.name ?? 'Main'}.java`
    out.push({ path: pathFor(pkg, fileName), text })
  }
  return { name, files: out, packages: [] }
}

/** Speichern im Browser und als `.visuobject`-Datei. */
export function projectToJSON(project: JavaProject): string {
  return JSON.stringify({ format: 'visuobject', version: 1, ...project })
}

export function projectFromJSON(json: string): JavaProject | undefined {
  try {
    const data = JSON.parse(json) as Partial<JavaProject>
    if (!Array.isArray(data.files)) return undefined
    const files = data.files.filter((f): f is ProjectFile => typeof f?.path === 'string' && typeof f?.text === 'string')
    const project: JavaProject = { name: typeof data.name === 'string' && data.name ? data.name : 'Projekt', files, packages: Array.isArray(data.packages) ? data.packages.filter((p) => typeof p === 'string') : [] }
    const roots = Array.isArray(data.sourceFolders) ? data.sourceFolders.filter((r): r is string => typeof r === 'string' && isFolderName(r) && r !== defaultRoot) : []
    if (roots.length) project.sourceFolders = roots
    const uml = umlFromJSON(data.uml)
    if (uml) project.uml = uml
    const notes = notesFromJSON(data.notes)
    if (notes) project.notes = notes
    return project
  } catch {
    return undefined
  }
}

/** Notizen aus einer Datei prüfen: nur Einträge mit Text und Lage. */
export function notesFromJSON(data: unknown): UmlNote[] | undefined {
  if (!Array.isArray(data)) return undefined
  const out: UmlNote[] = []
  for (const n of data as Partial<UmlNote>[]) {
    if (!n || typeof n.id !== 'string' || typeof n.text !== 'string' || typeof n.x !== 'number' || typeof n.y !== 'number') continue
    const attach = Array.isArray(n.attach) ? n.attach.filter((a): a is string => typeof a === 'string') : []
    out.push({ id: n.id, text: n.text, x: n.x, y: n.y, ...(attach.length ? { attach } : {}) })
  }
  return out.length ? out : undefined
}

/** Nur Einträge mit Objekt als Wert übernehmen (Datei kann von außen kommen). */
export function umlFromJSON(data: unknown): UmlInfo | undefined {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return undefined
  const out: UmlInfo = {}
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) if (value && typeof value === 'object' && !Array.isArray(value)) out[key] = value as UmlInfo[string]
  return Object.keys(out).length ? out : undefined
}

// MARK: - Beispiel

/** Beispiel wie im Spickzettel Java OOP & UML: Tier und Hund im Package `tiere`, Besitzer in `personen`. */
export function exampleProject(): JavaProject {
  return {
    name: 'Zoo',
    packages: [],
    uml: { 'Besitzer.hunde': { kind: 'aggregation', name: 'führt aus', reading: 'forward', sourceMultiplicity: '1' } },
    files: [
      {
        path: 'tiere/Tier.java',
        text: `package tiere;

public class Tier {
    private String name;
    private int alter;

    public Tier(String name, int alter) {
        this.name = name;
        this.alter = alter;
    }

    public String getName() {
        return name;
    }

    public void lautGeben() {
        System.out.println("...");
    }
}
`,
      },
      {
        path: 'tiere/Hund.java',
        text: `package tiere;

public class Hund extends Tier {
    private String rasse;

    public Hund(String name, int alter, String rasse) {
        super(name, alter);
        this.rasse = rasse;
    }

    public void lautGeben() {
        System.out.println("Wuff");
    }
}
`,
      },
      {
        path: 'personen/Besitzer.java',
        text: `package personen;

import java.util.ArrayList;
import tiere.Hund;

public class Besitzer {
    private String name;
    private ArrayList<Hund> hunde = new ArrayList<>();

    public void gassiGehen() {
        for (Hund h : hunde) {
            h.lautGeben();
        }
    }
}
`,
      },
    ],
  }
}
