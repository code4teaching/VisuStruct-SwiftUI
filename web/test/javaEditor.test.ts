import { describe, expect, it } from 'vitest'
import { JavaEditor } from '../src/ui/javaEditor'
import { parseLiveJava } from '../src/core/javaParser'
import type { LiveLabels } from '../src/core/codeGenerator'

const labels: LiveLabels = { condition: 'Bedingung', selector: 'Wert', code: 'Dein Code', start: 'Startwert', step: 'Schritt', end: 'Ende' }
const hooks = { onChange() {}, onCaret() {}, onUndo() {}, words: () => ({}) as never }

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
