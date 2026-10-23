import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap, snippetCompletion, type Completion, type CompletionContext } from '@codemirror/autocomplete'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { java } from '@codemirror/lang-java'
import { bracketMatching, HighlightStyle, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language'
import { Annotation, Compartment, EditorSelection, EditorState, Prec, RangeSetBuilder, StateEffect, StateField, type Extension } from '@codemirror/state'
import { Decoration, EditorView, highlightActiveLineGutter, keymap, lineNumbers, type DecorationSet } from '@codemirror/view'
import { tags } from '@lezer/highlight'

/**
 * Code-Editor der Ansicht „Code live“ (CodeMirror 6): farbige Java-Syntax, Vorschläge beim Tippen
 * (Vorlagen für `if`, `for`, … mit Platzhaltern) und Markierungen, die `liveCodePanel` vorgibt.
 */

export interface EditorMarks {
  /** Graue Platzhalter-Wörter (Zeichenpositionen). */
  placeholders: { from: number; to: number }[]
  /** Rote Wellenlinie: was noch fehlt oder zu viel ist. */
  problems: { from: number; to: number }[]
  /** Zeilen des ausgewählten Elements (ab 0, einschließlich). */
  lines?: { from: number; to: number }
}

/** Wörter der Vorlagen in der Sprache der Oberfläche. */
export interface SnippetWords {
  condition: string
  selector: string
  code: string
  start: string
  step: string
  /** Erklärung je Vorlage, z. B. „Verzweigung“. */
  branch: string
  branchElse: string
  switchCase: string
  forLoop: string
  whileLoop: string
  doLoop: string
  output: string
  input: string
}

export interface JavaEditorHooks {
  /** Getippter Text hat sich geändert. */
  onChange(): void
  /** Cursor bewegt (ohne Textänderung). */
  onCaret(): void
  /** ⌘Z / ⌘⇧Z: gilt für Code und Struktogramm gemeinsam. */
  onUndo(redo: boolean): void
  words(): SnippetWords
}

/** Eigene Textänderungen (z. B. nach einer Änderung im Struktogramm) lösen kein `onChange` aus. */
const fromOutside = Annotation.define<boolean>()
const setMarks = StateEffect.define<EditorMarks>()

const phMark = Decoration.mark({ class: 'cm-ph' })
const errMark = Decoration.mark({ class: 'cm-err' })
const selLine = Decoration.line({ class: 'cm-sel' })

interface MarkState {
  marks: EditorMarks
  decorations: DecorationSet
}

function buildDecorations(state: EditorState, marks: EditorMarks): DecorationSet {
  const len = state.doc.length
  const ranges: { from: number; to: number; deco: Decoration }[] = []
  if (marks.lines) {
    const last = Math.min(marks.lines.to + 1, state.doc.lines)
    for (let n = marks.lines.from + 1; n <= last; n++) {
      const line = state.doc.line(n)
      ranges.push({ from: line.from, to: line.from, deco: selLine })
    }
  }
  for (const p of marks.placeholders) if (p.to <= len && p.from < p.to) ranges.push({ from: p.from, to: p.to, deco: phMark })
  for (const p of marks.problems) {
    const from = Math.min(p.from, len)
    const to = Math.min(Math.max(p.to, from), len)
    if (from < to) ranges.push({ from, to, deco: errMark })
  }
  // Zeilen-Dekorationen vor Markierungen an derselben Stelle.
  ranges.sort((a, b) => a.from - b.from || Number(b.deco === selLine) - Number(a.deco === selLine) || a.to - b.to)
  const builder = new RangeSetBuilder<Decoration>()
  for (const r of ranges) builder.add(r.from, r.to, r.deco)
  return builder.finish()
}

const marksField = StateField.define<MarkState>({
  create: () => ({ marks: { placeholders: [], problems: [] }, decorations: Decoration.none }),
  update(value, tr) {
    for (const e of tr.effects) if (e.is(setMarks)) return { marks: e.value, decorations: buildDecorations(tr.state, e.value) }
    if (!tr.docChanged) return value
    // Bis zur nächsten Auswertung mit dem Text mitwandern.
    const map = (r: { from: number; to: number }) => ({ from: tr.changes.mapPos(r.from, 1), to: tr.changes.mapPos(r.to, -1) })
    const marks = { ...value.marks, placeholders: value.marks.placeholders.map(map).filter((r) => r.from < r.to), problems: [] }
    return { marks, decorations: buildDecorations(tr.state, marks) }
  },
  provide: (f) => EditorView.decorations.from(f, (v) => v.decorations),
})

/** Platzhalter am Cursor (auch direkt davor oder dahinter). */
function placeholderAt(state: EditorState, pos: number) {
  return state.field(marksField).marks.placeholders.find((p) => pos >= p.from && pos <= p.to)
}

/** Wie in einem HTML-Formular: Wer in einen grauen Platzhalter tippt, ersetzt das ganze Wort. */
const placeholderTyping = EditorView.inputHandler.of((view, from, to, text) => {
  if (from !== to) return false
  const ph = placeholderAt(view.state, from)
  if (!ph) return false
  view.dispatch({ changes: { from: ph.from, to: ph.to, insert: text }, selection: { anchor: ph.from + text.length }, userEvent: 'input.type' })
  return true
})

const deletePlaceholder = (forward: boolean) => (view: EditorView) => {
  const sel = view.state.selection.main
  if (!sel.empty) return false
  const ph = placeholderAt(view.state, sel.head)
  if (!ph || (forward ? sel.head >= ph.to : sel.head <= ph.from)) return false
  view.dispatch({ changes: { from: ph.from, to: ph.to }, selection: { anchor: ph.from }, userEvent: 'delete' })
  return true
}

/** Klick mitten in einen Platzhalter wählt das ganze Wort aus. */
const placeholderClick = EditorView.updateListener.of((u) => {
  if (!u.selectionSet || u.docChanged || !u.transactions.some((t) => t.isUserEvent('select.pointer'))) return
  const sel = u.state.selection.main
  if (!sel.empty) return
  const ph = u.state.field(marksField).marks.placeholders.find((p) => sel.head > p.from && sel.head < p.to)
  // Nicht während der laufenden Aktualisierung neu auslösen.
  if (ph) queueMicrotask(() => u.view.dispatch({ selection: EditorSelection.range(ph.from, ph.to) }))
})

const highlight = HighlightStyle.define([
  { tag: [tags.keyword, tags.controlKeyword, tags.definitionKeyword, tags.modifier, tags.operatorKeyword], color: 'var(--syn-keyword)', fontWeight: '600' },
  { tag: [tags.typeName, tags.standard(tags.typeName)], color: 'var(--syn-type)' },
  { tag: [tags.string, tags.character], color: 'var(--syn-string)' },
  { tag: [tags.number, tags.bool, tags.null], color: 'var(--syn-number)' },
  { tag: [tags.lineComment, tags.blockComment], color: 'var(--muted)', fontStyle: 'italic' },
])

/** Vorlagen und Wörter für die Vorschläge. */
function completions(words: SnippetWords): Completion[] {
  const w = words
  // `${…}` = Feld zum Ausfüllen (Tab springt weiter); stehen gelassen bleibt es ein grauer Platzhalter.
  const body = `\${// ${w.code}}`
  const snippet = (label: string, template: string, detail: string, boost = 0) =>
    snippetCompletion(template, { label, detail, type: 'keyword', boost })
  return [
    snippet('if', `if (\${${w.condition}}) {\n\t${body}\n}`, w.branch, 2),
    snippet('if … else', `if (\${${w.condition}}) {\n\t${body}\n} else {\n\t\${// ${w.code}}\n}`, w.branchElse, 1),
    snippet('for', `for (int \${i} = \${0}; \${i} < \${10}; \${i}++) {\n\t${body}\n}`, w.forLoop, 2),
    snippet('while', `while (\${${w.condition}}) {\n\t${body}\n}`, w.whileLoop, 2),
    snippet('do … while', `do {\n\t${body}\n} while (\${${w.condition}});`, w.doLoop, 1),
    snippet('switch', `switch (\${${w.selector}}) {\n\tcase \${1} -> {\n\t\t${body}\n\t}\n\tdefault -> {\n\t\t\${// ${w.code}}\n\t}\n}`, w.switchCase, 1),
    snippet('System.out.println', 'System.out.println(${});', w.output, 3),
    snippet('scanner.nextInt', 'int ${zahl} = scanner.nextInt();', w.input, 1),
    snippet('scanner.next', 'String ${text} = scanner.next();', w.input),
    snippet('scanner.nextDouble', 'double ${wert} = scanner.nextDouble();', w.input),
    ...['int', 'double', 'String', 'boolean', 'char', 'final', 'break;', 'return', 'true', 'false', 'else'].map((label) => ({
      label,
      type: 'keyword',
      boost: -1,
    })),
    ...['Math.random()', 'Math.abs(', 'Math.sqrt(', 'Math.max(', 'Math.min(', '.length()', '.equals('].map((label) => ({ label, type: 'function', boost: -2 })),
  ]
}

/** Variablen aus dem eigenen Code: `int zahl = …`, `String[] namen`, Parameter. */
function declaredNames(text: string): Completion[] {
  const names = new Set<string>()
  for (const m of text.matchAll(/\b(?:int|long|double|float|boolean|char|String|Scanner)(?:\s*\[\s*\])*\s+([A-Za-z_]\w*)/g)) names.add(m[1])
  return [...names].map((label) => ({ label, type: 'variable', boost: 1 }))
}

export class JavaEditor {
  readonly view: EditorView
  private readOnly = new Compartment()

  constructor(parent: HTMLElement, hooks: JavaEditorHooks, label: string) {
    const source = (context: CompletionContext) => {
      const word = context.matchBefore(/[\w.]+/)
      if (!word || (word.from === word.to && !context.explicit)) return null
      // In Zeichenketten und Kommentaren nichts vorschlagen.
      const line = context.state.doc.lineAt(context.pos)
      const before = line.text.slice(0, context.pos - line.from)
      if (/\/\//.test(before) || (before.match(/"/g)?.length ?? 0) % 2 === 1) return null
      return {
        from: word.from,
        options: [...completions(hooks.words()), ...declaredNames(context.state.doc.toString())],
        validFor: /^[\w.]*$/,
      }
    }
    const extensions: Extension[] = [
      lineNumbers(),
      highlightActiveLineGutter(),
      java(),
      syntaxHighlighting(highlight),
      indentUnit.of('    '),
      EditorState.tabSize.of(4),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      marksField,
      placeholderTyping,
      placeholderClick,
      this.readOnly.of(EditorState.readOnly.of(false)),
      autocompletion({ override: [source], icons: false }),
      Prec.highest(
        keymap.of([
          { key: 'Mod-z', run: () => (hooks.onUndo(false), true), preventDefault: true },
          { key: 'Mod-Shift-z', run: () => (hooks.onUndo(true), true), preventDefault: true },
          { key: 'Mod-y', run: () => (hooks.onUndo(true), true), preventDefault: true },
          { key: 'Backspace', run: deletePlaceholder(false) },
          { key: 'Delete', run: deletePlaceholder(true) },
        ]),
      ),
      keymap.of([...closeBracketsKeymap, ...completionKeymap, indentWithTab, ...defaultKeymap]),
      EditorView.contentAttributes.of({ 'aria-label': label, autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' }),
      EditorView.updateListener.of((u) => {
        // Danach, denn die Rückmeldung zeichnet den Editor neu (Markierungen).
        if (u.docChanged && !u.transactions.some((t) => t.annotation(fromOutside))) queueMicrotask(() => hooks.onChange())
        else if (u.selectionSet && !u.docChanged) queueMicrotask(() => hooks.onCaret())
      }),
    ]
    this.view = new EditorView({ parent, state: EditorState.create({ doc: '', extensions }) })
  }

  get text(): string {
    return this.view.state.doc.toString()
  }

  get caret(): number {
    return this.view.state.selection.main.head
  }

  get hasFocus(): boolean {
    return this.view.hasFocus
  }

  lineAt(offset: number): number {
    return this.view.state.doc.lineAt(Math.min(offset, this.view.state.doc.length)).number - 1
  }

  /** Text von außen setzen (Struktogramm geändert, Rückgängig); der Cursor bleibt möglichst an seiner Stelle. */
  setText(text: string) {
    const caret = Math.min(this.caret, text.length)
    this.view.dispatch({
      changes: { from: 0, to: this.view.state.doc.length, insert: text },
      selection: { anchor: caret },
      annotations: fromOutside.of(true),
    })
  }

  setMarks(marks: EditorMarks, scrollToSelection: boolean) {
    const effects: StateEffect<unknown>[] = [setMarks.of(marks)]
    if (scrollToSelection && marks.lines && marks.lines.from < this.view.state.doc.lines) {
      effects.push(EditorView.scrollIntoView(this.view.state.doc.line(marks.lines.from + 1).from, { y: 'nearest' }))
    }
    this.view.dispatch({ effects })
  }

  setReadOnly(readOnly: boolean) {
    this.view.dispatch({ effects: this.readOnly.reconfigure(EditorState.readOnly.of(readOnly)) })
  }
}
