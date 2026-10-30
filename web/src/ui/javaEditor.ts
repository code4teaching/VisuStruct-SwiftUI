import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap, snippetCompletion, type Completion, type CompletionContext } from '@codemirror/autocomplete'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { java } from '@codemirror/lang-java'
import { bracketMatching, HighlightStyle, indentOnInput, indentUnit, syntaxHighlighting, syntaxTree } from '@codemirror/language'
import { Annotation, type ChangeSpec, Compartment, countColumn, EditorSelection, EditorState, Prec, RangeSet, RangeSetBuilder, StateEffect, StateField, type Extension } from '@codemirror/state'
import { Decoration, EditorView, gutter, GutterMarker, highlightActiveLineGutter, keymap, layer, lineNumbers, RectangleMarker, type BlockInfo, type DecorationSet } from '@codemirror/view'
import { tags } from '@lezer/highlight'
import { indentJava } from '../core/javaIndent'
import { memberCompletionsAt, type JavaMember, type MemberLanguage, type OwnTypes } from '../core/javaMembers'
import { currentLanguage } from './i18n'

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
  /** Debugger: Zeile, die als Nächstes ausgeführt wird (ab 0, gelb). */
  current?: number
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
  /** Klick auf die Zeilennummer: Zeile für den Haltepunkt (Anfang des Elements) oder keine. */
  breakpointLine(line: number): number | undefined
  /** Haltepunkte geändert. */
  onBreakpoints(): void
  /** Eigene Klassen für Vorschläge nach dem Punkt (VisuObject); `pos` = Cursor. */
  ownTypes?(pos: number): OwnTypes | undefined
}

/** Eigene Textänderungen (z. B. nach einer Änderung im Struktogramm) lösen kein `onChange` aus. */
const fromOutside = Annotation.define<boolean>()
const setMarks = StateEffect.define<EditorMarks>()

const phMark = Decoration.mark({ class: 'cm-ph' })
const errMark = Decoration.mark({ class: 'cm-err' })
const currentLine = Decoration.line({ class: 'cm-debug-line' })

interface MarkState {
  marks: EditorMarks
  decorations: DecorationSet
}

function buildDecorations(state: EditorState, marks: EditorMarks): DecorationSet {
  const len = state.doc.length
  const ranges: { from: number; to: number; deco: Decoration }[] = []
  if (marks.current !== undefined && marks.current < state.doc.lines) {
    ranges.push({ from: state.doc.line(marks.current + 1).from, to: state.doc.line(marks.current + 1).from, deco: currentLine })
  }
  for (const p of marks.placeholders) if (p.to <= len && p.from < p.to) ranges.push({ from: p.from, to: p.to, deco: phMark })
  for (const p of marks.problems) {
    const from = Math.min(p.from, len)
    const to = Math.min(Math.max(p.to, from), len)
    if (from < to) ranges.push({ from, to, deco: errMark })
  }
  // Zeilen-Dekorationen vor Markierungen an derselben Stelle.
  const isLine = (d: Decoration) => d === currentLine
  ranges.sort((a, b) => a.from - b.from || Number(isLine(b.deco)) - Number(isLine(a.deco)) || a.to - b.to)
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

// MARK: - Farbige Blöcke wie in BlueJ

/** Art des Blocks → Farbe (`cm-scope-…` in styles.css). */
const scopeKinds: Record<string, string> = {
  ClassDeclaration: 'class',
  InterfaceDeclaration: 'class',
  EnumDeclaration: 'class',
  MethodDeclaration: 'method',
  ConstructorDeclaration: 'method',
  ForStatement: 'loop',
  EnhancedForStatement: 'loop',
  WhileStatement: 'loop',
  DoStatement: 'loop',
  IfStatement: 'if',
  SwitchStatement: 'if',
  TryStatement: 'try',
}

/**
 * Jeder Block (Klasse, Methode, Schleife, Verzweigung …) bekommt einen eigenen Kasten, der bei seiner
 * Einrückung beginnt; die Kästen liegen ineinander. Das ausgewählte Element bekommt einen Rahmen darüber.
 */
function scopeMarkers(view: EditorView): RectangleMarker[] {
  const { state } = view
  const doc = state.doc
  const lineElt = view.contentDOM.querySelector('.cm-line')
  if (!lineElt) return []
  const style = getComputedStyle(lineElt)
  const scroller = view.scrollDOM.getBoundingClientRect()
  const content = view.contentDOM.getBoundingClientRect()
  const baseLeft = scroller.left - view.scrollDOM.scrollLeft
  const baseTop = scroller.top - view.scrollDOM.scrollTop
  const textLeft = content.left - baseLeft + parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth)
  const right = content.right - baseLeft - 6
  const top0 = view.documentTop - baseTop
  const tabSize = state.tabSize
  const charWidth = view.defaultCharacterWidth
  const box = (className: string, fromLine: number, toLine: number, inset: number) => {
    const first = doc.line(fromLine)
    const col = countColumn(/^\s*/.exec(first.text)![0], tabSize)
    const left = textLeft + col * charWidth - 7
    const top = view.lineBlockAt(first.from).top + top0 + inset
    const bottom = view.lineBlockAt(doc.line(toLine).from).bottom + top0 - inset
    return new RectangleMarker(className, left, top, Math.max(right - left, 20), Math.max(bottom - top, 4))
  }
  const markers: RectangleMarker[] = []
  // Äußere Blöcke zuerst: Die inneren liegen darüber.
  syntaxTree(state).iterate({
    from: view.viewport.from,
    to: view.viewport.to,
    enter: (node) => {
      const kind = scopeKinds[node.name]
      if (!kind) return
      // `else if` gehört zum Kasten des ersten `if`.
      if (node.name === 'IfStatement' && node.node.parent?.name === 'IfStatement') return
      markers.push(box(`cm-scope cm-scope-${kind}`, doc.lineAt(node.from).number, doc.lineAt(node.to).number, 1))
    },
  })
  const sel = state.field(marksField).marks.lines
  if (sel && sel.from < doc.lines) markers.push(box('cm-scope cm-scope-sel', sel.from + 1, Math.min(sel.to + 1, doc.lines), 0))
  return markers
}

const codeScopesKey = 'visustruct.code.scopes'

/** Einstellung „Codeblöcke farbig“: ohne Speicher eingeschaltet. */
export function codeScopes(): boolean {
  try {
    return localStorage.getItem(codeScopesKey) !== '0'
  } catch {
    return true
  }
}

/** Schaltet die farbigen Kästen in allen Code-Editoren um (der Rahmen der Auswahl bleibt). */
export function setCodeScopes(on: boolean) {
  try {
    localStorage.setItem(codeScopesKey, on ? '1' : '0')
  } catch {
    /* ohne Speicher: nur für diese Sitzung */
  }
  document.documentElement.classList.toggle('no-code-scopes', !on)
}

if (typeof document !== 'undefined') document.documentElement.classList.toggle('no-code-scopes', !codeScopes())

const scopeLayer = layer({
  above: false,
  class: 'cm-scopeLayer',
  markers: scopeMarkers,
  update: (u) =>
    u.docChanged ||
    u.viewportChanged ||
    u.geometryChanged ||
    syntaxTree(u.state) !== syntaxTree(u.startState) ||
    u.transactions.some((t) => t.effects.some((e) => e.is(setMarks))),
})

// MARK: - Haltepunkte

/** Roter Punkt vor der Zeilennummer: Hier hält „Ausführen“ an. */
class BreakpointMarker extends GutterMarker {
  toDOM() {
    const dot = document.createElement('span')
    dot.className = 'cm-breakpoint'
    return dot
  }
}
const breakpointMarker = new BreakpointMarker()
const toggleBreakpoint = StateEffect.define<number>()
const resetBreakpoints = StateEffect.define<number[]>()

/** Haltepunkte als Positionen am Zeilenanfang: Sie wandern beim Tippen mit ihrer Zeile mit. */
const breakpointsField = StateField.define<RangeSet<GutterMarker>>({
  create: () => RangeSet.empty,
  update(set, tr) {
    set = set.map(tr.changes)
    for (const e of tr.effects) {
      if (e.is(resetBreakpoints)) set = RangeSet.of(e.value.map((from) => breakpointMarker.range(from)), true)
      if (!e.is(toggleBreakpoint)) continue
      let has = false
      set.between(e.value, e.value, () => {
        has = true
      })
      set = has ? set.update({ filter: (from) => from !== e.value }) : set.update({ add: [breakpointMarker.range(e.value)] })
    }
    return set
  },
})

function breakpointGutter(hooks: JavaEditorHooks): Extension {
  const toggle = (view: EditorView, block: BlockInfo) => {
    const line = hooks.breakpointLine(view.state.doc.lineAt(block.from).number - 1)
    if (line === undefined || line >= view.state.doc.lines) return false
    view.dispatch({ effects: toggleBreakpoint.of(view.state.doc.line(line + 1).from) })
    queueMicrotask(() => hooks.onBreakpoints())
    return true
  }
  const handlers = { mousedown: toggle }
  return [
    breakpointsField,
    gutter({
      class: 'cm-breakpoint-gutter',
      markers: (v) => v.state.field(breakpointsField),
      initialSpacer: () => breakpointMarker,
      domEventHandlers: handlers,
    }),
    lineNumbers({ domEventHandlers: handlers }),
  ]
}

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

/** Einfügen und Hineinziehen ersetzen den Platzhalter genauso (sonst bleibt z. B. `// Dein Code` vor dem Text stehen). */
const placeholderPaste = EditorState.transactionFilter.of((tr) => {
  if (!tr.docChanged || !(tr.isUserEvent('input.paste') || tr.isUserEvent('input.drop'))) return tr
  const changes: { from: number; to: number; text: string }[] = []
  tr.changes.iterChanges((from, to, _fromB, _toB, inserted) => changes.push({ from, to, text: inserted.toString() }))
  if (changes.length !== 1 || changes[0].from !== changes[0].to) return tr
  const ph = placeholderAt(tr.startState, changes[0].from)
  if (!ph) return tr
  const { text } = changes[0]
  return { changes: { from: ph.from, to: ph.to, insert: text }, selection: { anchor: ph.from + text.length }, userEvent: 'input.paste', scrollIntoView: true }
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
  // Wie in Eclipse: int, boolean … sowie true, false und null sind Schlüsselwörter; Klassennamen bleiben schwarz.
  { tag: [tags.keyword, tags.controlKeyword, tags.definitionKeyword, tags.modifier, tags.operatorKeyword, tags.standard(tags.typeName), tags.bool, tags.null], color: 'var(--syn-keyword)', fontWeight: '600' },
  { tag: [tags.string, tags.character], color: 'var(--syn-string)' },
  { tag: tags.number, color: 'var(--syn-number)' },
  { tag: [tags.lineComment, tags.blockComment], color: 'var(--syn-comment)', fontStyle: 'italic' },
])

/** Vorlagen und Wörter für die Vorschläge. */
export function completions(words: SnippetWords): Completion[] {
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
    // Kürzel wie in Eclipse (`syso`, `sysout`) und IntelliJ/NetBeans (`sout`, `psvm`).
    ...['syso', 'sysout', 'sout'].map((label) => snippet(label, 'System.out.println(${});', `System.out.println · ${w.output}`, 2)),
    ...['main', 'psvm'].map((label) => snippet(label, `public static void main(String[] args) {\n\t${body}\n}`, 'public static void main(String[] args)', 2)),
    snippet('scanner.nextInt', 'int ${zahl} = scanner.nextInt();', w.input, 1),
    snippet('scanner.next', 'String ${text} = scanner.next();', w.input),
    snippet('scanner.nextDouble', 'double ${wert} = scanner.nextDouble();', w.input),
    snippet('try … catch', `try {\n\t${body}\n} catch (\${Exception} e) {\n\t\${// ${w.code}}\n}`, 'try … catch', 1),
    snippet('public class', `public class \${Main} {\n\t${body}\n}`, 'public class', -2),
    // Bei `import` gleich die üblichen Zeilen anbieten.
    ...['import java.util.Scanner;', 'import javax.swing.*;', 'import java.awt.*;', 'import java.awt.event.*;'].map((label, i) =>
      snippet(label, label, 'import', 1 - i),
    ),
    // Schlüsselwörter, auch für Klassen und Methoden (z. B. `pu` → public).
    ...['int', 'double', 'String', 'boolean', 'char', 'long', 'final', 'break;', 'continue;', 'return', 'true', 'false', 'else', 'null', 'new',
      'public', 'private', 'static', 'void', 'class', 'extends', 'implements', 'interface', 'this'].map((label) => ({
      label,
      type: 'keyword',
      boost: -1,
    })),
    ...['Scanner', 'Math', 'JFrame', 'JButton', 'JLabel', 'JTextField', 'ActionListener', 'ActionEvent', 'Color', 'FlowLayout', 'GridLayout', 'BorderLayout'].map((label) => ({
      label,
      type: 'type',
      boost: -2,
    })),
    ...['Math.random()', 'Math.abs(', 'Math.sqrt(', 'Math.max(', 'Math.min(', '.length()', '.equals('].map((label) => ({ label, type: 'function', boost: -2 })),
  ]
}

/** Vorschlag hinter dem Punkt: Methoden mit Klammern (Cursor dazwischen, wenn Werte nötig sind), Felder wie `length` ohne. */
export function memberCompletion(member: JavaMember): Completion {
  const label = member.kind === 'field' ? member.name : `${member.name}(${member.params ? '…' : ''})`
  const completion: Completion = {
    label,
    detail: member.returns === 'void' || !member.returns ? member.description : member.description ? `${member.returns} · ${member.description}` : member.returns,
    type: member.kind === 'field' ? 'property' : 'method',
  }
  if (member.kind === 'field') return { ...completion, apply: member.name }
  return member.params ? snippetCompletion(`${member.name}(\${})`, completion) : { ...completion, apply: `${member.name}()` }
}

function memberLanguage(): MemberLanguage {
  const lang = currentLanguage()
  return lang === 'de' ? 'de' : lang === 'pt-PT' ? 'pt' : 'en'
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
      // Hinter `variable.` die Methoden ihres Typs (aus der Deklaration im Code), z. B. `eingabe.` → nextInt().
      // Reihenfolge wie in der Liste (das Häufigste zuerst) statt alphabetisch.
      const members = memberCompletionsAt(context.state.doc.toString(), context.pos, memberLanguage(), hooks.ownTypes?.(context.pos))
      if (members) return { from: members.from, options: members.members.map((m, i) => ({ ...memberCompletion(m), boost: 50 - i })), validFor: /^\w*$/ }
      // Hinter `void` tippt man den Namen der Methode selbst: keine main-Vorlage anbieten.
      const afterVoid = /\bvoid\s+[\w.]*$/.test(before)
      const options = completions(hooks.words()).filter((c) => !(afterVoid && (c.label === 'main' || c.label === 'psvm')))
      return {
        from: word.from,
        options: [...options, ...declaredNames(context.state.doc.toString())],
        // Ohne Punkt: beim Tippen von `.` neu fragen, damit die Methoden des Typs kommen.
        validFor: /^\w*$/,
      }
    }
    const extensions: Extension[] = [
      breakpointGutter(hooks),
      highlightActiveLineGutter(),
      java(),
      syntaxHighlighting(highlight),
      indentUnit.of('    '),
      EditorState.tabSize.of(4),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      marksField,
      scopeLayer,
      placeholderTyping,
      placeholderPaste,
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

  /** Zeilen mit Haltepunkt (ab 0). */
  get breakpoints(): Set<number> {
    const lines = new Set<number>()
    const doc = this.view.state.doc
    this.view.state.field(breakpointsField).between(0, doc.length, (from) => {
      lines.add(doc.lineAt(from).number - 1)
    })
    return lines
  }

  /** Haltepunkte einer anderen Datei zeigen (Zeilen ab 0). */
  setBreakpoints(lines: Iterable<number>) {
    const doc = this.view.state.doc
    const from = [...new Set(lines)].filter((l) => l >= 0 && l < doc.lines).map((l) => doc.line(l + 1).from)
    this.view.dispatch({ effects: resetBreakpoints.of(from) })
  }

  lineAt(offset: number): number {
    return this.view.state.doc.lineAt(Math.min(offset, this.view.state.doc.length)).number - 1
  }

  /** Text von außen setzen (Struktogramm geändert, Rückgängig); der Cursor bleibt möglichst an seiner Stelle. */
  setText(text: string) {
    const caret = Math.min(this.caret, text.length)
    // Nur den geänderten Teil ersetzen: Haltepunkte davor und danach bleiben an ihrer Zeile.
    const old = this.text
    let start = 0
    while (start < old.length && start < text.length && old[start] === text[start]) start++
    let end = 0
    while (end < old.length - start && end < text.length - start && old[old.length - 1 - end] === text[text.length - 1 - end]) end++
    this.view.dispatch({
      changes: { from: start, to: old.length - end, insert: text.slice(start, text.length - end) },
      selection: { anchor: caret },
      annotations: fromOutside.of(true),
    })
  }

  /** Knopf „Einrücken“: die markierten Zeilen, ohne Markierung den ganzen Code. */
  indent() {
    const doc = this.view.state.doc
    const sel = this.view.state.selection.main
    const from = sel.empty ? 1 : doc.lineAt(sel.from).number
    const to = sel.empty ? doc.lines : doc.lineAt(sel.to).number
    // Nur die Leerzeichen am Zeilenanfang ändern: Haltepunkte und Cursor bleiben in ihrer Zeile.
    const changes: ChangeSpec[] = []
    indentJava(doc.toString(), from, to)
      .split('\n')
      .forEach((text, i) => {
        const line = doc.line(i + 1)
        const old = /^\s*/.exec(line.text)![0]
        const now = /^\s*/.exec(text)![0]
        if (old !== now) changes.push({ from: line.from, to: line.from + old.length, insert: now })
      })
    if (changes.length > 0) this.view.dispatch({ changes, userEvent: 'input.indent' })
    this.view.focus()
  }

  setMarks(marks: EditorMarks, scrollToSelection: boolean) {
    const effects: StateEffect<unknown>[] = [setMarks.of(marks)]
    if (marks.current !== undefined && marks.current < this.view.state.doc.lines) {
      effects.push(EditorView.scrollIntoView(this.view.state.doc.line(marks.current + 1).from, { y: 'nearest' }))
    } else if (scrollToSelection && marks.lines && marks.lines.from < this.view.state.doc.lines) {
      effects.push(EditorView.scrollIntoView(this.view.state.doc.line(marks.lines.from + 1).from, { y: 'nearest' }))
    }
    this.view.dispatch({ effects })
  }

  setReadOnly(readOnly: boolean) {
    this.view.dispatch({ effects: this.readOnly.reconfigure(EditorState.readOnly.of(readOnly)) })
  }
}
