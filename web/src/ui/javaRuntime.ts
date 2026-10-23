import { textFileEntries } from '../core/simulation'
/**
 * Echtes Java (mit Swing) im Browser über CheerpJ (https://cheerpj.com), nur wenn im Zahnrad-Menü
 * „„Echtes Java (mit Swing)““ an ist. Erst dann werden Laufzeit und Compiler geladen (einmalig, danach Browser-Cache).
 *
 * - Laufzeit: vom CDN des Herstellers (Community-Lizenz: kostenlos für Einzelne und Open Source, nur über dieses CDN).
 * - Compiler: javac aus tools.jar (OpenJDK 8), aus dem JavaFiddle-Repo von Leaning Technologies (Apache-2.0).
 * - Ausgaben von System.out landen in dem Element mit der id „console“ (so macht es CheerpJ).
 */

const loaderURL = 'https://cjrtnc.leaningtech.com/4.3/loader.js'
const toolsURL = 'https://raw.githubusercontent.com/leaningtech/javafiddle/main/static/tools.jar'
const toolsJar = '/str/tools.jar'

/**
 * Startet die Programme der Schüler. Alle Läufe gehen über diese eine Klasse (als Bibliothek geladen),
 * damit sie dieselben Fenster sehen: Ein eigener `cheerpjRunMain` pro Lauf sieht die Fenster des vorigen nicht.
 */
const runnerSource = `public class VisuStructRunner {
    public static void mkdirs(String dir) {
        new java.io.File(dir).mkdirs();
    }

    public static void copy(String from, String to) throws Exception {
        java.nio.file.Files.copy(java.nio.file.Paths.get(from), java.nio.file.Paths.get(to), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
    }

    /** Namen der Dateien im Ordner, durch Zeilenumbrüche getrennt. */
    public static String list(String dir) {
        String[] names = new java.io.File(dir).list();
        return names == null ? "" : String.join("\\n", names);
    }

    public static String read(String path) throws Exception {
        return new String(java.nio.file.Files.readAllBytes(java.nio.file.Paths.get(path)), "UTF-8");
    }

    public static void closeAll() {
        for (java.awt.Window w : java.awt.Window.getWindows()) w.dispose();
    }

    public static int openWindows() {
        // Erst die Ereignisschlange abarbeiten lassen: main öffnet Fenster meist per invokeLater.
        try {
            javax.swing.SwingUtilities.invokeAndWait(() -> {});
        } catch (Exception e) {
        }
        int n = 0;
        for (java.awt.Window w : java.awt.Window.getWindows()) if (w.isShowing()) n++;
        return n;
    }

    public static void run(String dir, String name) {
        closeAll();
        try {
            java.net.URLClassLoader loader = new java.net.URLClassLoader(new java.net.URL[] { new java.io.File(dir).toURI().toURL() });
            loader.loadClass(name).getMethod("main", String[].class).invoke(null, (Object) new String[0]);
        } catch (java.lang.reflect.InvocationTargetException e) {
            e.getCause().printStackTrace();
        } catch (NoSuchMethodException e) {
            System.err.println("Die Klasse " + name + " hat keine Methode public static void main(String[] args).");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
`

interface Runner {
  mkdirs(dir: string): Promise<void>
  copy(from: string, to: string): Promise<void>
  list(dir: string): Promise<string>
  read(path: string): Promise<string>
  closeAll(): Promise<void>
  openWindows(): Promise<number>
  run(dir: string, name: string): Promise<void>
}

declare global {
  function cheerpjInit(options?: object): Promise<void>
  function cheerpjCreateDisplay(width: number, height: number, parent?: HTMLElement): HTMLElement
  function cheerpjRunMain(className: string, classPath: string, ...args: string[]): Promise<number>
  function cheerpjRunLibrary(classPath: string): Promise<Record<string, Promise<unknown>>>
  function cheerpOSAddStringFile(path: string, data: string | Uint8Array): void
}

let ready: Promise<Runner> | undefined
let run = 0

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(src))
    document.head.append(script)
  })
}

/** Laufzeit und Compiler laden; `display`: Fläche für die Swing-Fenster. Mehrfach aufrufbar. */
export function prepareJava(display: HTMLElement): Promise<Runner> {
  ready ??= (async () => {
    await loadScript(loaderURL)
    await cheerpjInit({ status: 'none' })
    cheerpjCreateDisplay(-1, -1, display)
    const response = await fetch(toolsURL)
    if (!response.ok) throw new Error(toolsURL)
    cheerpOSAddStringFile(toolsJar, new Uint8Array(await response.arrayBuffer()))
    cheerpOSAddStringFile('/str/VisuStructRunner.java', runnerSource)
    if ((await cheerpjRunMain('com.sun.tools.javac.Main', toolsJar, '/str/VisuStructRunner.java', '-d', '/files/')) !== 0) {
      throw new Error('javac')
    }
    const lib = await cheerpjRunLibrary('/files/')
    return (await lib.VisuStructRunner) as Runner
  })()
  ready.catch(() => (ready = undefined))
  return ready
}

/** Name der Klasse, die gestartet wird: die öffentliche, sonst die erste. */
export function mainClassName(source: string): string {
  const m = source.match(/public\s+(?:final\s+)?class\s+(\w+)/) ?? source.match(/\bclass\s+(\w+)/)
  return m ? m[1] : 'Main'
}

/** Liest oder schreibt der Code Dateien? */
export function usesFiles(source: string): boolean {
  return /\bFiles\s*\.\s*\w+\s*\(|\bnew\s+(?:File|FileReader|FileWriter|PrintWriter|BufferedReader)\s*\(/.test(source)
}

/** Dateinamen wie `"liste.txt"` im Code: Sie zeigen im Browser in den Ordner `dir`. */
export function filesInto(source: string, dir: string): string {
  return source.replace(/"([\w.-]+\.(?:txt|csv|json))"/g, `"${dir}$1"`)
}

/** Der Compiler hier ist javac 8: `Files.readString` und `Files.writeString` (ab Java 11) werden umgeschrieben. */
export function java8Files(source: string): string {
  source = source.replace(
    /\bFiles\s*\.\s*readString\s*\(\s*(?:Path\s*\.\s*of|Paths\s*\.\s*get)\s*\(\s*("(?:[^"\\]|\\.)*")\s*\)\s*\)/g,
    'new String(java.nio.file.Files.readAllBytes(java.nio.file.Paths.get($1)), "UTF-8")',
  )
  const write = /\bFiles\s*\.\s*writeString\s*\(\s*(?:Path\s*\.\s*of|Paths\s*\.\s*get)\s*\(\s*("(?:[^"\\]|\\.)*")\s*\)\s*,/g
  let out = ''
  let last = 0
  for (let m = write.exec(source); m; m = write.exec(source)) {
    // Das zweite Argument reicht bis zur schließenden Klammer von `writeString(`.
    let depth = 1
    let i = m.index + m[0].length
    let quote = false
    for (; i < source.length && depth > 0; i++) {
      const c = source[i]
      if (quote) {
        if (c === '\\') i++
        else if (c === '"') quote = false
      } else if (c === '"') quote = true
      else if (c === '(') depth++
      else if (c === ')') depth--
    }
    if (depth > 0) break
    const text = source.slice(m.index + m[0].length, i - 1).trim()
    out += source.slice(last, m.index) + `java.nio.file.Files.write(java.nio.file.Paths.get(${m[1]}), (${text}).getBytes("UTF-8"))`
    last = i
    write.lastIndex = i
  }
  return out + source.slice(last)
}

/** Code ohne Klasse (Snippet oder nur Methoden) in eine Klasse mit main packen. */
export function asProgram(source: string): string {
  if (/\bclass\s+\w+/.test(source)) return source
  // Getippte Imports gehören vor die Klasse, nicht in `main`.
  const own: string[] = []
  source = source.replace(/^[ \t]*import\s+[\w.]+(?:\.\*)?\s*;[ \t]*$/gm, (line) => (own.push(line.trim()), ''))
  const imports = [...own, 'import java.util.*;', 'import java.awt.*;', 'import java.awt.event.*;', 'import javax.swing.*;'].join('\n') + '\n\n'
  if (/\bstatic\s+void\s+main\s*\(/.test(source)) return `${imports}public class Main {\n${source}\n}\n`
  // Dateien lesen und schreiben kann eine IOException werfen; ohne `throws` meldet javac einen Fehler.
  const throwsClause = usesFiles(source) ? ' throws Exception' : ''
  return `${imports}public class Main {\n    public static void main(String[] args)${throwsClause} {\n${source}\n    }\n}\n`
}

/** Fenster des vorigen Laufs schließen. */
export async function closeWindows() {
  if (ready) await (await ready).closeAll()
}

/** Geschrieben hat das Programm, was neu ist oder sich geändert hat. */
async function writtenFiles(runner: Runner, data: string, before: Map<string, string>): Promise<Map<string, string>> {
  const written = new Map<string, string>()
  for (const file of (await runner.list(data)).split('\n').filter(Boolean)) {
    const content = await runner.read(data + file)
    if (before.get(file) !== content) written.set(file, content)
  }
  return written
}

/**
 * Ein Swing-Programm läuft nach main weiter und speichert vielleicht erst beim Klick. Solange seine Fenster offen sind
 * und kein neuer Lauf beginnt, meldet `onChange` jede Datei, die danach neu gespeichert wird. Liefert die Funktion zum Beenden.
 */
export function watchWrittenFiles(shown: Map<string, string>, onChange: (files: Map<string, string>) => void): () => void {
  const mine = run
  const data = `/files/run${mine}/data/`
  const before = new Map([...textFileEntries(), ...shown])
  let stopped = false
  const tick = async () => {
    if (stopped || run !== mine || !ready) return
    try {
      const runner = await ready
      const changed = await writtenFiles(runner, data, before)
      for (const [file, content] of changed) before.set(file, content)
      if (changed.size) onChange(changed)
      if ((await runner.openWindows()) === 0) return
    } catch {
      return
    }
    timer = window.setTimeout(tick, 1500)
  }
  let timer = window.setTimeout(tick, 1500)
  return () => {
    stopped = true
    window.clearTimeout(timer)
  }
}

export type RunResult = { result: 'compile-error' | 'windows' | 'finished'; files: Map<string, string> }

/**
 * Kompilieren und starten. `compile-error`: javac meldet Fehler (die stehen dann in der Konsole).
 * Sonst nach dem Ende von main: `windows`, wenn noch Fenster offen sind (das Programm läuft weiter), oder `finished`.
 */
export async function compileAndRun(source: string, onCompiled: () => void): Promise<RunResult> {
  const runner = await ready!
  // Jeder Lauf in ein eigenes Verzeichnis mit eigenem Klassenlader, damit nichts vom vorigen Lauf übrig bleibt.
  const dir = `/files/run${++run}/`
  await runner.mkdirs(dir)
  // Die Textdateien der Lektionen kommen in einen beschreibbaren Ordner des Laufs; `"brief.txt"` im Code zeigt dorthin.
  const data = `${dir}data/`
  const files = new Map(textFileEntries())
  await runner.mkdirs(data)
  for (const [file, content] of files) {
    cheerpOSAddStringFile(`/str/${file}`, content)
    await runner.copy(`/str/${file}`, data + file)
  }
  const program = asProgram(java8Files(filesInto(source, data)))
  const name = mainClassName(program)
  cheerpOSAddStringFile(`/str/${name}.java`, program)
  if ((await cheerpjRunMain('com.sun.tools.javac.Main', toolsJar, `/str/${name}.java`, '-d', dir, '-encoding', 'UTF-8')) !== 0) {
    return { result: 'compile-error', files: new Map() }
  }
  // Die Fensterfläche muss vor dem Start sichtbar sein: Bei 0×0 Pixeln zeichnet Swing nichts.
  onCompiled()
  await runner.run(dir, name)
  const written = await writtenFiles(runner, data, files)
  if ((await runner.openWindows()) > 0) return { result: 'windows', files: written }
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { result: (await runner.openWindows()) > 0 ? 'windows' : 'finished', files: written }
}
