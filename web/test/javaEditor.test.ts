import { describe, expect, it } from 'vitest'
import { completions, JavaEditor } from '../src/ui/javaEditor'
import { parseLiveJava } from '../src/core/javaParser'
import type { LiveLabels } from '../src/core/codeGenerator'

const labels: LiveLabels = { condition: 'Bedingung', selector: 'Wert', code: 'Dein Code', start: 'Startwert', step: 'Schritt', end: 'Ende' }
const hooks = { onChange() {}, onCaret() {}, onUndo() {}, words: () => ({}) as never, breakpointLine: (line: number) => line, onBreakpoints() {} }

function editorWith(text: string) {
  const editor = new JavaEditor(document.createElement('div'), hooks, 'Code')
  editor.setText(text)
  editor.setMarks({ placeholders: parseLiveJava(text, labels).placeholders, problems: [] }, false)
  return editor
}

describe('Code-Editor: Platzhalter', () => {
  it('Einfügen hinter „// Dein Code“ ersetzt den Platzhalter', () => {
    const editor = editorWith('// Dein Code')
    const end = editor.text.length
    editor.view.dispatch({ changes: { from: end, insert: 'import javax.swing.*;\n' }, userEvent: 'input.paste' })
    expect(editor.text).toBe('import javax.swing.*;\n')
    editor.view.destroy()
  })

  it('Einfügen an anderer Stelle lässt den Text stehen', () => {
    const editor = editorWith('int x = 1;')
    editor.view.dispatch({ changes: { from: 0, insert: '// a\n' }, userEvent: 'input.paste' })
    expect(editor.text).toBe('// a\nint x = 1;')
    editor.view.destroy()
  })
})

describe('Code-Editor: Kürzel', () => {
  it('syso, sout und main stehen in den Vorschlägen', () => {
    const words = { condition: 'Bedingung', selector: 'Wert', code: 'Dein Code', start: '', step: '', branch: '', branchElse: '', switchCase: '', forLoop: '', whileLoop: '', doLoop: '', output: 'Ausgabe', input: 'Eingabe' }
    const labels = completions(words).map((c) => c.label)
    expect(labels).toEqual(expect.arrayContaining(['syso', 'sysout', 'sout', 'main', 'psvm']))
  })

  it('Schlüsselwörter für Klassen und Methoden stehen in den Vorschlägen', () => {
    const words = { condition: 'Bedingung', selector: 'Wert', code: 'Dein Code', start: '', step: '', branch: '', branchElse: '', switchCase: '', forLoop: '', whileLoop: '', doLoop: '', output: 'Ausgabe', input: 'Eingabe' }
    const labels = completions(words).map((c) => c.label)
    expect(labels).toEqual(expect.arrayContaining(['public', 'private', 'static', 'void', 'class', 'public class', 'try … catch', 'JButton']))
    expect(new Set(labels).size).toBe(labels.length)
  })
})

describe('Code-Editor: Einrücken', () => {
  it('rückt den ganzen Code ein, ohne Markierung', () => {
    const editor = editorWith('if (x > 0) {\nx--;\n      }')
    editor.indent()
    expect(editor.text).toBe('if (x > 0) {\n    x--;\n}')
    editor.view.destroy()
  })
})

describe('Code-Editor: Scanner-Zeile', () => {
  const words = { condition: 'Bedingung', selector: 'Wert', code: 'Dein Code', start: '', step: '', branch: '', branchElse: '', switchCase: '', forLoop: '', whileLoop: '', doLoop: '', output: 'Ausgabe', input: 'Eingabe' }
  const scannerLine = () => completions(words).find((c) => c.label === 'Scanner scanner = new Scanner(System.in);')!
  const accept = (text: string) => {
    const editor = editorWith(text)
    const from = editor.text.indexOf('Scanner')
    const apply = scannerLine().apply as (view: unknown, c: unknown, from: number, to: number) => void
    apply(editor.view, scannerLine(), from, from + 'Scanner'.length)
    const result = editor.text
    editor.view.destroy()
    return result
  }

  it('ergänzt die Zeile und den fehlenden Import', () => {
    expect(accept('public class Main {\n    public static void main(String[] args) {\n        Scanner\n    }\n}')).toBe(
      'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n    }\n}',
    )
  })

  it('lässt einen vorhandenen Import stehen', () => {
    expect(accept('import java.util.*;\n\nScanner')).toBe('import java.util.*;\n\nScanner scanner = new Scanner(System.in);')
  })

  it('setzt den Import zu den anderen Imports', () => {
    expect(accept('import javax.swing.*;\n\nScanner')).toBe('import java.util.Scanner;\nimport javax.swing.*;\n\nScanner scanner = new Scanner(System.in);')
  })

  it('der erzeugte Code hat keinen Fehler', () => {
    const code = accept('public class Main {\n    public static void main(String[] args) {\n        Scanner\n        int zahl = scanner.nextInt();\n    }\n}')
    expect(parseLiveJava(code, labels).problems).toEqual([])
  })
})
