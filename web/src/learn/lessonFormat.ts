import type { ExerciseTest } from '../core/exerciseCheck'

/**
 * Lektionen und Aufgaben als Markdown mit Kopfzeilen und `:::`-Blöcken (siehe `lessons/README.md`).
 * Jede `## Überschrift` beginnt einen neuen Schritt.
 */

export type Block =
  | { kind: 'markdown'; text: string }
  | { kind: 'diagram'; file: string; caption: string }
  | { kind: 'exercise'; exercise: Exercise }
  | { kind: 'checklist'; items: ChecklistItem[] }
  | { kind: 'quiz'; questions: QuizQuestion[] }
  | { kind: 'brag'; text: string }
  | { kind: 'images'; files: string[]; caption: string }
  | { kind: 'graphic'; file: string; caption: string }

export interface Exercise {
  id: string
  title: string
  task: string
  /** Startdiagramm (Datei in `lessons/diagramme`); sonst leeres Diagramm. */
  start?: string
  tests: ExerciseTest[]
  /** Elementarten, die vorkommen müssen (Schlüssel wie in der Palette, z. B. `verzweigung`). */
  requires: string[]
  hint?: string
  /** Musterlösung (Datei in `lessons/diagramme`), in Aufgaben zum Ansehen. */
  solution?: string
  /** Unterprogramme zur Musterlösung (Dateien in `lessons/diagramme`), je eins pro Reiter. */
  subprograms: string[]
}

export interface ChecklistItem {
  text: string
  /** Titel des Schritts, in dem der Punkt erklärt wird (`- Text → Schritt`). */
  ref?: string
  /** Index dieses Schritts in der Lektion, von `parseLesson` aufgelöst. */
  step?: number
}

export interface QuizQuestion {
  question: string
  options: { text: string; correct: boolean }[]
  explanation?: string
}

export interface Step {
  title: string
  blocks: Block[]
}

export interface Lesson {
  id: string
  number: number
  title: string
  section: string
  summary: string
  steps: Step[]
}

export interface Task {
  id: string
  title: string
  /** Nummer der Lektion, die man vorher abgeschlossen haben sollte. */
  after?: number
  level: number
  blocks: Block[]
}

export class FormatError extends Error {}

function frontMatter(source: string, file: string): { meta: Map<string, string>; body: string } {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(source.replace(/\r\n/g, '\n'))
  if (!m) throw new FormatError(`${file}: Kopfzeilen (--- … ---) fehlen.`)
  const meta = new Map<string, string>()
  for (const line of m[1].split('\n')) {
    const kv = /^([a-zäöüß]+):\s*(.*)$/i.exec(line.trim())
    if (kv) meta.set(kv[1].toLowerCase(), kv[2].trim())
  }
  return { meta, body: source.replace(/\r\n/g, '\n').slice(m[0].length) }
}

/** `3, 4 -> 7 | 8` = Eingaben 3 und 4, erwartete Ausgabezeilen 7 und 8. */
export function parseTest(spec: string, file: string): ExerciseTest {
  const parts = spec.split(/\s*(?:->|→)\s*/)
  if (parts.length !== 2) throw new FormatError(`${file}: Test „${spec}“ braucht genau ein „->“.`)
  const list = (s: string, sep: RegExp) => (s.trim() === '' || s.trim() === '-' ? [] : s.split(sep).map((x) => x.trim()))
  return { inputs: list(parts[0], /\s*,\s*/), expected: list(parts[1], /\s*\|\s*/) }
}

function parseExercise(id: string, lines: string[], file: string): Exercise {
  const ex: Exercise = { id, title: '', task: '', tests: [], requires: [], subprograms: [] }
  let last: 'task' | 'hint' | undefined
  for (const raw of lines) {
    const kv = /^(titel|auftrag|start|test|braucht|tipp|lösung|loesung|unterprogramm):\s*(.*)$/i.exec(raw.trim())
    if (kv) {
      const [, key, value] = kv
      last = undefined
      switch (key.toLowerCase()) {
        case 'titel': ex.title = value; break
        case 'auftrag': ex.task = value; last = 'task'; break
        case 'start': ex.start = value; break
        case 'test': ex.tests.push(parseTest(value, file)); break
        case 'braucht': ex.requires.push(...value.split(/\s*,\s*/).filter(Boolean)); break
        case 'tipp': ex.hint = value; last = 'hint'; break
        case 'lösung':
        case 'loesung': ex.solution = value; break
        case 'unterprogramm': ex.subprograms.push(...value.split(/\s*,\s*/).filter(Boolean)); break
      }
    } else if (last && raw.trim() !== '') {
      // Fortsetzungszeilen für Auftrag und Tipp
      if (last === 'task') ex.task += '\n' + raw.trim()
      else ex.hint += '\n' + raw.trim()
    } else if (raw.trim() === '' && last === 'task') {
      ex.task += '\n'
    }
  }
  if (!ex.title) throw new FormatError(`${file}: Übung „${id}“ hat keinen Titel.`)
  if (!ex.task.trim()) throw new FormatError(`${file}: Übung „${id}“ hat keinen Auftrag.`)
  ex.task = ex.task.trim()
  return ex
}

function parseQuiz(lines: string[], file: string): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  for (const raw of lines) {
    const line = raw.trim()
    if (line.startsWith('?')) {
      questions.push({ question: line.slice(1).trim(), options: [] })
    } else if (/^- \[[ xX]\]/.test(line)) {
      const q = questions.at(-1)
      if (!q) throw new FormatError(`${file}: Antwort ohne Frage im Quiz.`)
      q.options.push({ text: line.slice(5).trim(), correct: line[3].toLowerCase() === 'x' })
    } else if (line.startsWith('>')) {
      const q = questions.at(-1)
      if (q) q.explanation = ((q.explanation ? q.explanation + ' ' : '') + line.slice(1).trim()).trim()
    }
  }
  for (const q of questions) {
    if (q.options.length < 2 || !q.options.some((o) => o.correct)) {
      throw new FormatError(`${file}: Quizfrage „${q.question}“ braucht mindestens zwei Antworten, davon eine richtige.`)
    }
  }
  return questions
}

/** Text in Blöcke zerlegen: normales Markdown und `::: art …` bis `:::`. */
export function parseBlocks(body: string, file: string): Block[] {
  const blocks: Block[] = []
  const lines = body.split('\n')
  let markdown: string[] = []
  const flush = () => {
    const text = markdown.join('\n').trim()
    if (text) blocks.push({ kind: 'markdown', text })
    markdown = []
  }
  for (let i = 0; i < lines.length; i++) {
    const open = /^:::\s*([a-zäöüß]+)\s*(.*)$/i.exec(lines[i].trim())
    if (!open) {
      markdown.push(lines[i])
      continue
    }
    flush()
    const inner: string[] = []
    let j = i + 1
    while (j < lines.length && lines[j].trim() !== ':::') inner.push(lines[j++])
    if (j >= lines.length) throw new FormatError(`${file}: Block „::: ${open[1]}“ wird nicht mit „:::“ geschlossen.`)
    const kind = open[1].toLowerCase()
    const arg = open[2].trim()
    switch (kind) {
      case 'diagramm':
        if (!arg) throw new FormatError(`${file}: „::: diagramm“ braucht einen Dateinamen.`)
        blocks.push({ kind: 'diagram', file: arg, caption: inner.join(' ').trim() })
        break
      case 'übung':
      case 'uebung':
        if (!arg) throw new FormatError(`${file}: „::: übung“ braucht eine Kennung.`)
        blocks.push({ kind: 'exercise', exercise: parseExercise(arg, inner, file) })
        break
      case 'checkliste':
        blocks.push({ kind: 'checklist', items: inner.map((l) => l.trim()).filter((l) => l.startsWith('- ')).map((l) => checklistItem(l.slice(2).trim())) })
        break
      case 'quiz':
        blocks.push({ kind: 'quiz', questions: parseQuiz(inner, file) })
        break
      case 'bild':
        if (!arg) throw new FormatError(`${file}: „::: bild“ braucht einen Dateinamen.`)
        blocks.push({ kind: 'images', files: arg.split(/\s+/), caption: inner.join(' ').trim() })
        break
      case 'grafik':
        if (!arg) throw new FormatError(`${file}: „::: grafik“ braucht einen Dateinamen.`)
        blocks.push({ kind: 'graphic', file: arg, caption: inner.join(' ').trim() })
        break
      case 'angeberwissen':
        blocks.push({ kind: 'brag', text: inner.join('\n').trim() })
        break
      default:
        throw new FormatError(`${file}: Unbekannter Block „::: ${open[1]}“.`)
    }
    i = j
  }
  flush()
  return blocks
}

function checklistItem(line: string): ChecklistItem {
  const m = /^(.*?)\s+→\s+(.+)$/.exec(line)
  return m ? { text: m[1], ref: m[2].trim() } : { text: line }
}

/** Verweise aus Checklisten auf den erklärenden Schritt auflösen. */
function resolveChecklistRefs(steps: Step[], file: string) {
  const index = new Map(steps.map((s, i) => [s.title.toLowerCase(), i]))
  for (const block of steps.flatMap((s) => s.blocks)) {
    if (block.kind !== 'checklist') continue
    for (const item of block.items) {
      if (item.ref === undefined) continue
      item.step = index.get(item.ref.toLowerCase())
      if (item.step === undefined) throw new FormatError(`${file}: Checkliste verweist auf unbekannten Schritt „${item.ref}“.`)
    }
  }
}

export function parseLesson(source: string, file: string): Lesson {
  const { meta, body } = frontMatter(source, file)
  const name = file.replace(/^.*\//, '').replace(/\.md$/, '')
  const number = Number(/^(\d+)/.exec(name)?.[1])
  if (!Number.isFinite(number)) throw new FormatError(`${file}: Dateiname muss mit der Nummer beginnen (z. B. 01-…).`)
  const steps: Step[] = []
  let intro: string[] = []
  let current: { title: string; lines: string[] } | undefined
  const close = () => {
    if (current) steps.push({ title: current.title, blocks: parseBlocks(current.lines.join('\n'), file) })
  }
  for (const line of body.split('\n')) {
    const h = /^##\s+(.*)$/.exec(line)
    if (h) {
      close()
      current = { title: h[1].trim(), lines: [] }
    } else if (current) {
      current.lines.push(line)
    } else {
      intro.push(line)
    }
  }
  close()
  if (steps.length === 0) throw new FormatError(`${file}: Keine Schritte (## Überschrift) gefunden.`)
  resolveChecklistRefs(steps, file)
  const title = meta.get('titel')
  if (!title) throw new FormatError(`${file}: „titel:“ fehlt.`)
  return {
    id: name,
    number,
    title,
    section: meta.get('bereich') ?? '',
    summary: meta.get('kurz') ?? intro.join(' ').trim(),
    steps,
  }
}

export function parseTask(source: string, file: string): Task {
  const { meta, body } = frontMatter(source, file)
  const title = meta.get('titel')
  if (!title) throw new FormatError(`${file}: „titel:“ fehlt.`)
  const after = meta.get('nach')
  return {
    id: file.replace(/^.*\//, '').replace(/\.md$/, ''),
    title,
    after: after ? Number(after) : undefined,
    level: Number(meta.get('stufe') ?? '1') || 1,
    blocks: parseBlocks(body, file),
  }
}
