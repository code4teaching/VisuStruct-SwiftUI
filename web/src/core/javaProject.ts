/**
 * VisuObject: ein Java-Projekt aus mehreren Dateien, wie im Package Explorer von Eclipse.
 * Jede Datei liegt in einem Package (Ordner); die Zeile `package …;` im Code folgt dem Ordner.
 * Das Klassendiagramm zeigt die Klassen aller Dateien.
 */

import { parseClasses, type UmlClass } from './classModel'
import type { UmlInfo } from './umlRelations'

export interface ProjectFile {
  /** Pfad unter `src/`, z. B. `tiere/Hund.java`; ohne Ordner im Standard-Package. */
  path: string
  text: string
}

export interface JavaProject {
  name: string
  files: ProjectFile[]
  /** Auch leere Packages, z. B. gleich nach „+ Package“. */
  packages: string[]
  /** Was nur UML kennt (Aggregation, Name der Beziehung …), siehe `umlRelations.ts`. */
  uml?: UmlInfo
}

/** Klasse mit Datei und Package, für Diagramm und Explorer. */
export interface ProjectClass extends UmlClass {
  path: string
  pkg: string
}

export const packageOf = (path: string) => (path.includes('/') ? path.slice(0, path.lastIndexOf('/')).replace(/\//g, '.') : '')
export const fileNameOf = (path: string) => path.slice(path.lastIndexOf('/') + 1)
export const pathFor = (pkg: string, file: string) => (pkg ? `${pkg.replace(/\./g, '/')}/${file}` : file)

const packageName = /^[a-z_$][\p{L}\p{N}_$]*(\.[a-z_$][\p{L}\p{N}_$]*)*$/u
export const isPackageName = (name: string) => packageName.test(name)

/** Alle Packages: aus den Dateien und die leeren, sortiert; das Standard-Package nur, wenn Dateien darin liegen. */
export function packagesOf(project: JavaProject): string[] {
  const all = new Set(project.packages)
  for (const f of project.files) all.add(packageOf(f.path))
  return [...all].filter((p) => p !== '' || project.files.some((f) => packageOf(f.path) === '')).sort((a, b) => (a === '' ? 1 : b === '' ? -1 : a.localeCompare(b)))
}

export function filesIn(project: JavaProject, pkg: string): ProjectFile[] {
  return project.files.filter((f) => packageOf(f.path) === pkg).sort((a, b) => a.path.localeCompare(b.path))
}

/** `package …;` am Anfang setzen, ändern oder (Standard-Package) entfernen. */
export function withPackageLine(text: string, pkg: string): string {
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
  return project.files.flatMap((f) => parseClasses(f.text).map((c) => ({ ...c, path: f.path, pkg: packageOf(f.path) })))
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
    const uml = umlFromJSON(data.uml)
    if (uml) project.uml = uml
    return project
  } catch {
    return undefined
  }
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
