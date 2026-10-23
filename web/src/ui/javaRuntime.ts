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

/** Code ohne Klasse (Snippet oder nur Methoden) in eine Klasse mit main packen. */
export function asProgram(source: string): string {
  if (/\bclass\s+\w+/.test(source)) return source
  // Getippte Imports gehören vor die Klasse, nicht in `main`.
  const own: string[] = []
  source = source.replace(/^[ \t]*import\s+[\w.]+(?:\.\*)?\s*;[ \t]*$/gm, (line) => (own.push(line.trim()), ''))
  const imports = [...own, 'import java.util.*;', 'import java.awt.*;', 'import java.awt.event.*;', 'import javax.swing.*;'].join('\n') + '\n\n'
  if (/\bstatic\s+void\s+main\s*\(/.test(source)) return `${imports}public class Main {\n${source}\n}\n`
  return `${imports}public class Main {\n    public static void main(String[] args) {\n${source}\n    }\n}\n`
}

/** Fenster des vorigen Laufs schließen. */
export async function closeWindows() {
  if (ready) await (await ready).closeAll()
}

export type RunResult = 'compile-error' | 'windows' | 'finished'

/**
 * Kompilieren und starten. `compile-error`: javac meldet Fehler (die stehen dann in der Konsole).
 * Sonst nach dem Ende von main: `windows`, wenn noch Fenster offen sind (das Programm läuft weiter), oder `finished`.
 */
export async function compileAndRun(source: string, onCompiled: () => void): Promise<RunResult> {
  const runner = await ready!
  const program = asProgram(source)
  const name = mainClassName(program)
  // Jeder Lauf in ein eigenes Verzeichnis mit eigenem Klassenlader, damit nichts vom vorigen Lauf übrig bleibt.
  const dir = `/files/run${++run}/`
  await runner.mkdirs(dir)
  cheerpOSAddStringFile(`/str/${name}.java`, program)
  if ((await cheerpjRunMain('com.sun.tools.javac.Main', toolsJar, `/str/${name}.java`, '-d', dir, '-encoding', 'UTF-8')) !== 0) {
    return 'compile-error'
  }
  // Die Fensterfläche muss vor dem Start sichtbar sein: Bei 0×0 Pixeln zeichnet Swing nichts.
  onCompiled()
  await runner.run(dir, name)
  if ((await runner.openWindows()) > 0) return 'windows'
  await new Promise((resolve) => setTimeout(resolve, 500))
  return (await runner.openWindows()) > 0 ? 'windows' : 'finished'
}
