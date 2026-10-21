import { describe, expect, it } from 'vitest'
import { checkExercise, runWithInputs, usedElementTypes } from '../src/core/exerciseCheck'
import { ElementType, makeElement, type VSElement } from '../src/core/model'
import { subprogramName } from '../src/core/simulation'
import { diagram, image, lessons, reference, tasks } from '../src/learn/content'
import { parseBlocks, parseLesson, parseTest, type Block } from '../src/learn/lessonFormat'
import { markdownToHTML } from '../src/learn/markdown'

const allBlocks = (): { where: string; block: Block }[] => [
  ...lessons.flatMap((l) => l.steps.flatMap((s) => s.blocks.map((block) => ({ where: `${l.id} / ${s.title}`, block })))),
  ...tasks.flatMap((t) => t.blocks.map((block) => ({ where: t.id, block }))),
]

describe('Lernbereich: Inhalte', () => {
  it('Lektionen sind lückenlos nummeriert und haben Schritte', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(3)
    lessons.forEach((l, i) => {
      expect(l.number, l.id).toBe(i + 1)
      expect(l.steps.length, l.id).toBeGreaterThan(1)
      expect(l.section, l.id).not.toBe('')
    })
    expect(reference).toContain('### Verzweigung')
  })

  it('jedes verwendete Diagramm existiert und lässt sich laden', () => {
    for (const { where, block } of allBlocks()) {
      const files =
        block.kind === 'diagram' ? [block.file] : block.kind === 'exercise' ? [block.exercise.start, block.exercise.solution, ...block.exercise.subprograms] : []
      for (const f of files.filter(Boolean)) expect(diagram(f!), `${where}: ${f}`).toBeDefined()
    }
  })

  it('jede Übung hat mindestens zwei gestufte Tipps', () => {
    const few = allBlocks().flatMap(({ where, block }) => (block.kind === 'exercise' && block.exercise.hints.length < 2 ? [`${where}: ${block.exercise.id}`] : []))
    expect(few).toEqual([])
  })

  it('jedes verwendete Bild existiert', () => {
    for (const { where, block } of allBlocks()) {
      if (block.kind === 'images') for (const f of block.files) expect(image(f), `${where}: ${f}`).toBeDefined()
      if (block.kind === 'graphic') expect(image(block.file), `${where}: ${block.file}`).toBeDefined()
    }
  })

  it('keine Schleife in einem Diagramm ist leer (Inhalt gehört in <schleifeninhalt>)', () => {
    const loops = [ElementType.forSchleife, ElementType.whileSchleife, ElementType.doUntilSchleife, ElementType.endlosschleife]
    const check = (els: VSElement[], where: string) => {
      for (const e of els) {
        if (loops.includes(e.type)) expect(e.loopBody?.length ?? 0, `${where}: ${e.textLines.join(' ')}`).toBeGreaterThan(0)
        if (e.loopBody) check(e.loopBody, where)
        for (const c of e.cases ?? []) check(c.elements, where)
      }
    }
    for (const { where, block } of allBlocks()) {
      const files =
        block.kind === 'diagram' ? [block.file] : block.kind === 'exercise' ? [block.exercise.start, block.exercise.solution] : []
      for (const f of files.filter(Boolean)) {
        const d = diagram(f!)
        if (d) check(d.elements, `${where}: ${f}`)
      }
    }
  })

  it('jeder Punkt einer Checkliste verweist auf den Schritt, der ihn erklärt', () => {
    for (const l of lessons)
      for (const s of l.steps)
        for (const b of s.blocks)
          if (b.kind === 'checklist') for (const item of b.items) expect(item.step, `${l.id}: ${item.text}`).toBeDefined()
  })

  it('Kennungen von Übungen sind eindeutig', () => {
    const ids = allBlocks().flatMap(({ block }) => (block.kind === 'exercise' ? [block.exercise.id] : []))
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('jede Musterlösung besteht ihre eigenen Tests', () => {
    let checked = 0
    for (const { where, block } of allBlocks()) {
      if (block.kind !== 'exercise') continue
      const ex = block.exercise
      expect(ex.tests.length, `${where}: ${ex.id} hat keinen Test`).toBeGreaterThan(0)
      for (const r of ex.requires) expect(r in ElementType || r === 'forZaehlSchleife', `${where}: braucht ${r}`).toBe(true)
      if (!ex.solution) continue
      const doc = diagram(ex.solution)!
      const subs = ex.subprograms.map((f) => diagram(f)!)
      const resolve = (name: string) => subs.find((s) => subprogramName(s.caption).toLowerCase() === subprogramName(name).toLowerCase())
      for (const outcome of checkExercise(doc, ex.tests, resolve)) {
        expect(outcome.passed, `${where}: ${ex.id} ${JSON.stringify(outcome)}`).toBe(true)
      }
      for (const r of ex.requires) expect(usedElementTypes(doc).has(ElementType[r as keyof typeof ElementType])).toBe(true)
      checked++
    }
    expect(checked).toBeGreaterThanOrEqual(4)
  })

  it('ein leeres Startdiagramm besteht keine Übung', () => {
    for (const { block } of allBlocks()) {
      if (block.kind !== 'exercise') continue
      const start = block.exercise.start ? diagram(block.exercise.start)! : { caption: '', elements: [] }
      expect(checkExercise(start, block.exercise.tests).every((o) => o.passed), block.exercise.id).toBe(false)
    }
  })
})

describe('Lernbereich: Format', () => {
  it('liest Tests mit Eingaben und mehreren Ausgabezeilen', () => {
    expect(parseTest('3, 4 -> 7 | fertig', 'x')).toEqual({ inputs: ['3', '4'], expected: ['7', 'fertig'] })
    expect(parseTest('- -> Hallo', 'x')).toEqual({ inputs: [], expected: ['Hallo'] })
  })

  it('liest Angeberwissen-Kästen', () => {
    expect(parseBlocks('::: angeberwissen\nZeile eins\nZeile zwei\n:::', 'x.md')).toEqual([{ kind: 'brag', text: 'Zeile eins\nZeile zwei' }])
  })

  it('meldet fehlerhafte Blöcke verständlich', () => {
    expect(() => parseBlocks('::: diagramm a.visustruct\n', 'x.md')).toThrow(/nicht mit „:::“ geschlossen/)
    expect(() => parseBlocks('::: quiz\n? Frage\n- [ ] a\n- [ ] b\n:::', 'x.md')).toThrow(/eine richtige/)
    expect(() => parseBlocks('::: tabelle\n:::', 'x.md')).toThrow(/Unbekannter Block/)
  })

  it('liest Zuordnungen im Quiz', () => {
    const [block] = parseBlocks('::: quiz\n? Ordne zu.\n= Fallauswahl -> Mehrfachauswahl\n= Schleife -> Wiederholungsstruktur\n> Erklärung\n:::', 'x.md')
    expect(block).toEqual({
      kind: 'quiz',
      questions: [{
        question: 'Ordne zu.',
        options: [],
        pairs: [{ left: 'Fallauswahl', right: 'Mehrfachauswahl' }, { left: 'Schleife', right: 'Wiederholungsstruktur' }],
        explanation: 'Erklärung',
      }],
    })
    expect(() => parseBlocks('::: quiz\n? Ordne zu.\n= a -> b\n:::', 'x.md')).toThrow(/mindestens zwei Paare/)
    expect(() => parseBlocks('::: quiz\n? Ordne zu.\n= a -> b\n= c -> b\n:::', 'x.md')).toThrow(/verschiedenen rechten/)
    expect(() => parseBlocks('::: quiz\n? Ordne zu.\n= a b\n:::', 'x.md')).toThrow(/links -> rechts/)
  })

  it('löst Checklisten-Verweise auf und meldet unbekannte Schritte', () => {
    const source = (ref: string) => `---\ntitel: T\n---\n## Erster Schritt\nText\n## Checkliste\n::: checkliste\n- Ich kann es. → ${ref}\n- Ohne Verweis\n:::\n`
    const block = parseLesson(source('erster schritt'), '01-t.md').steps[1].blocks[0]
    expect(block).toEqual({ kind: 'checklist', items: [{ text: 'Ich kann es.', ref: 'erster schritt', step: 0 }, { text: 'Ohne Verweis' }] })
    expect(() => parseLesson(source('Gibt es nicht'), '01-t.md')).toThrow(/unbekannten Schritt/)
  })

  it('Markdown maskiert HTML', () => {
    expect(markdownToHTML('<b>x</b> **fett** `a<b`')).toBe('<p>&lt;b&gt;x&lt;/b&gt; <strong>fett</strong> <code>a&lt;b</code></p>')
    expect(markdownToHTML('[x](javascript:alert(1))')).toContain('href="#"')
  })
})

describe('Prüfen mit der Simulation', () => {
  const doc = (lines: string[]) => ({
    caption: '',
    elements: lines.map((t) => makeElement(ElementType.anweisung, { textLines: [t] })),
  })

  it('gibt Eingaben der Reihe nach und vergleicht die Ausgabe', () => {
    const d = doc(['input: int a "a"', 'input: int b "b"', 'int s = a + b', 'output: s'])
    expect(runWithInputs(d, ['3', '4']).outputs).toEqual(['7'])
    expect(checkExercise(d, [{ inputs: ['3', '4'], expected: ['7'] }])[0].passed).toBe(true)
    expect(checkExercise(d, [{ inputs: ['3', '4'], expected: ['8'] }])[0].passed).toBe(false)
    expect(runWithInputs(d, ['3']).missingInput).toBe(true)
  })

  it('erkennt Fehler und vergleicht 2.0 wie 2', () => {
    expect(runWithInputs(doc(['output: x']), []).error?.kind).toBe('unknownVariable')
    expect(checkExercise(doc(['double x = 4.0 / 2', 'output: x']), [{ inputs: [], expected: ['2'] }])[0].passed).toBe(true)
  })
})

describe('Lernbereich: Grafiken', () => {
  // Als <img> geladen, zeigt der Browser ein SVG nur an, wenn es gültiges XML ist (z. B. `&lt;` statt `<`).
  const svgs = import.meta.glob('../lessons/bilder/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

  it.each(Object.keys(svgs))('%s ist gültiges XML', (file) => {
    const parsed = new DOMParser().parseFromString(svgs[file], 'image/svg+xml')
    expect(parsed.getElementsByTagName('parsererror').length).toBe(0)
  })
})

describe('Lehrermodus', () => {
  // Der richtige Code steht absichtlich nirgends im Repository, auch nicht hier.
  it('bleibt mit einem falschen Code aus', async () => {
    const { isTeacher, lockTeacher, unlockTeacher } = await import('../src/learn/teacher')
    lockTeacher()
    expect(await unlockTeacher('falsch')).toBe(false)
    expect(await unlockTeacher('')).toBe(false)
    expect(isTeacher()).toBe(false)
  })
})
