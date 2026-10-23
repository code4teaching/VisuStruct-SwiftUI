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
})

describe('Code-Editor: Einrücken', () => {
  it('rückt den ganzen Code ein, ohne Markierung', () => {
    const editor = editorWith('if (x > 0) {\nx--;\n      }')
    editor.indent()
    expect(editor.text).toBe('if (x > 0) {\n    x--;\n}')
    editor.view.destroy()
  })
})
