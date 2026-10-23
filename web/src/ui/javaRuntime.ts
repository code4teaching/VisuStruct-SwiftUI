/**
 * Echtes Java (mit Swing) im Browser über CheerpJ (https://cheerpj.com), nur wenn im Zahnrad-Menü
 * „Swing-Unterstützung“ an ist. Erst dann werden Laufzeit und Compiler geladen (einmalig, danach Browser-Cache).
 *
 * - Laufzeit: vom CDN des Herstellers (Community-Lizenz: kostenlos für Einzelne und Open Source, nur über dieses CDN).
 * - Compiler: javac aus tools.jar (OpenJDK 8), aus dem JavaFiddle-Repo von Leaning Technologies (Apache-2.0).
 * - Ausgaben von System.out landen in dem Element mit der id „console“ (so macht es CheerpJ).
 */

const loaderURL = 'https://cjrtnc.leaningtech.com/4.3/loader.js'
const toolsURL = 'https://raw.githubusercontent.com/leaningtech/javafiddle/main/static/tools.jar'
const toolsJar = '/str/tools.jar'

/**
 * Schließt die Fenster des vorigen Laufs und legt das Ausgabeverzeichnis für den nächsten an
 * (javac legt es mit `-d` nicht selbst an).
 */
const resetSource = `public class VisuStructReset {
    public static void main(String[] args) {
        for (java.awt.Window w : java.awt.Window.getWindows()) w.dispose();
        for (String dir : args) new java.io.File(dir).mkdirs();
    }
}
`

declare global {
  function cheerpjInit(options?: object): Promise<void>
  function cheerpjCreateDisplay(width: number, height: number, parent?: HTMLElement): HTMLElement
  function cheerpjRunMain(className: string, classPath: string, ...args: string[]): Promise<number>
  function cheerpjAddStringFile(path: string, data: string | Uint8Array): void
}

let ready: Promise<void> | undefined
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
export function prepareJava(display: HTMLElement): Promise<void> {
  ready ??= (async () => {
    await loadScript(loaderURL)
    await cheerpjInit({ status: 'none' })
    cheerpjCreateDisplay(-1, -1, display)
    const response = await fetch(toolsURL)
    if (!response.ok) throw new Error(toolsURL)
    cheerpjAddStringFile(toolsJar, new Uint8Array(await response.arrayBuffer()))
    cheerpjAddStringFile('/str/VisuStructReset.java', resetSource)
    if ((await cheerpjRunMain('com.sun.tools.javac.Main', toolsJar, '/str/VisuStructReset.java', '-d', '/files/')) !== 0) {
      throw new Error('javac')
    }
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
  const imports = 'import java.util.*;\nimport java.awt.*;\nimport java.awt.event.*;\nimport javax.swing.*;\n\n'
  if (/\bstatic\s+void\s+main\s*\(/.test(source)) return `${imports}public class Main {\n${source}\n}\n`
  return `${imports}public class Main {\n    public static void main(String[] args) {\n${source}\n    }\n}\n`
}

/** Fenster des vorigen Laufs schließen und ggf. Verzeichnisse anlegen. */
export async function closeWindows(...dirs: string[]) {
  if (ready) await cheerpjRunMain('VisuStructReset', '/files/', ...dirs)
}

/** Kompilieren und starten. `false`, wenn javac Fehler meldet (die stehen dann in der Konsole). */
export async function compileAndRun(source: string): Promise<boolean> {
  const program = asProgram(source)
  const name = mainClassName(program)
  // Jeder Lauf in ein eigenes Verzeichnis, damit keine Klasse vom vorigen Lauf übrig bleibt.
  const dir = `/files/run${++run}/`
  await closeWindows(dir)
  cheerpjAddStringFile(`/str/${name}.java`, program)
  if ((await cheerpjRunMain('com.sun.tools.javac.Main', toolsJar, `/str/${name}.java`, '-d', dir, '-encoding', 'UTF-8')) !== 0) {
    return false
  }
  // main kehrt bei Swing sofort zurück, die Fenster bleiben offen; darum nicht auf das Ende warten.
  void cheerpjRunMain(name, `${dir}:${toolsJar}`)
  return true
}
