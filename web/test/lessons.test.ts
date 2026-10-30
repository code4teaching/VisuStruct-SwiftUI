import { beforeAll, describe, expect, it } from 'vitest'
import { checkExercise, runWithInputs, usedElementTypes } from '../src/core/exerciseCheck'
import type { LiveLabels } from '../src/core/codeGenerator'
import { parseLiveJava } from '../src/core/javaParser'
import { documentFromJava, plainLiveJava } from '../src/core/liveSource'
import { ElementType, makeElement, type VSElement } from '../src/core/model'
import { subprogramName } from '../src/core/simulation'
import { contentLanguages, diagram, image, lessons, reference, tasks, useContentLanguage } from '../src/learn/content'
import { parseBlocks, parseLesson, parseTest, type Block } from '../src/learn/lessonFormat'
import { markdownToHTML } from '../src/learn/markdown'
import { clozeAnswerRight, clozeGaps, type Cloze } from '../src/learn/cloze'
import { papFits, papLayout, parsePap } from '../src/learn/pap'
import { parseRoundGame, parseSwingWindow, simulate } from '../src/learn/roundGame'

const allBlocks = (): { where: string; block: Block }[] => [
  ...lessons.flatMap((l) => l.steps.flatMap((s) => s.blocks.map((block) => ({ where: `${l.id} / ${s.title}`, block })))),
  ...tasks.flatMap((t) => t.blocks.map((block) => ({ where: t.id, block }))),
]

describe.each(contentLanguages)('Lernbereich: Inhalte (%s)', (lang) => {
  beforeAll(() => useContentLanguage(lang))

  it('Lektionen sind lückenlos nummeriert und haben Schritte', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(3)
    lessons.forEach((l, i) => {
      expect(l.number, l.id).toBe(i + 1)
      expect(l.steps.length, l.id).toBeGreaterThan(1)
      expect(l.section, l.id).not.toBe('')
    })
    expect(reference).toContain({ de: '### Verzweigung', en: '### Branch', pt: '### Decisão' }[lang])
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

  it('Java-Übungen (code: java) lassen sich in Java lösen', () => {
    const labels: LiveLabels = { condition: 'Bedingung', selector: 'Wert', code: 'Dein Code', start: 'Startwert', step: 'Schritt', end: 'Ende' }
    let checked = 0
    for (const { where, block } of allBlocks()) {
      if (block.kind !== 'exercise' || block.exercise.code !== 'java') continue
      const ex = block.exercise
      expect(ex.solution, `${where}: ${ex.id} braucht eine Musterlösung`).toBeDefined()
      // Die Musterlösung so, wie man sie in Java tippen würde, und daraus wieder das Struktogramm
      const parsed = parseLiveJava(plainLiveJava(diagram(ex.solution!)!, labels), labels)
      expect(parsed.problems, `${where}: ${ex.id}`).toEqual([])
      const doc = documentFromJava({ caption: '', elements: [] }, parsed)
      for (const outcome of checkExercise(doc, ex.tests)) expect(outcome.passed, `${where}: ${ex.id} ${JSON.stringify(outcome)}`).toBe(true)
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

describe.each(['en', 'pt'] as const)('Lernbereich: Übersetzung (%s)', (lang) => {
  const lessonFiles = import.meta.glob('../lessons/*/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
  const taskFiles = import.meta.glob('../lessons/*/aufgaben/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
  const names = (files: Record<string, string>, lang: string) =>
    Object.keys(files).filter((p) => p.includes(`/lessons/${lang}/`)).map((p) => p.slice(p.indexOf(`/${lang}/`) + lang.length + 2)).sort()

  it('jede deutsche Lektion und Aufgabe gibt es auch übersetzt', () => {
    expect(names(lessonFiles, lang)).toEqual(names(lessonFiles, 'de'))
    expect(names(taskFiles, lang)).toEqual(names(taskFiles, 'de'))
  })

  it('beide Sprachen haben dieselben Übungen mit gleich vielen Tests', () => {
    const exercises = (l: 'de' | 'en' | 'pt') => {
      useContentLanguage(l)
      return allBlocks().flatMap(({ block }) =>
        block.kind === 'exercise' ? [`${block.exercise.id}: ${block.exercise.tests.length}`] : [],
      ).sort()
    }
    const de = exercises('de')
    expect(exercises(lang)).toEqual(de)
    useContentLanguage('de')
  })

  it('beide Sprachen haben gleich viele Lückentexte mit gleich vielen Lücken', () => {
    const clozes = (l: 'de' | 'en' | 'pt') => {
      useContentLanguage(l)
      return allBlocks().flatMap(({ where, block }) => (block.kind === 'cloze' ? [`${where.split(' / ')[0]}: ${clozeGaps(block.cloze).length}`] : []))
    }
    const de = clozes('de')
    expect(clozes(lang)).toEqual(de)
    useContentLanguage('de')
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

  it('liest Lückentexte', () => {
    const [block] = parseBlocks(
      '::: lückentext\ntitel: T\nauftrag: Ergänze.\n```java\n    [[int]] x = 1;\n    if (a [[||]] b) x[[++ | += 1]];\n```\nerklärung: E\n:::',
      'x.md',
    )
    expect(block).toEqual({
      kind: 'cloze',
      cloze: {
        title: 'T',
        task: 'Ergänze.',
        blocks: [[[{ answers: ['int'] }, ' x = 1;'], ['if (a ', { answers: ['||'] }, ' b) x', { answers: ['++', '+= 1'] }, ';']]],
        explanation: 'E',
      },
    })
    expect(clozeAnswerRight(['i = i + 1'], 'i=i+1')).toBe(true)
    expect(clozeAnswerRight(['int'], 'Int')).toBe(false)
    expect(clozeAnswerRight(['int'], ' ')).toBe(false)
    expect(() => parseBlocks('::: lückentext\ntitel: T\n```\nint x;\n```\n:::', 'x.md')).toThrow(/mindestens eine Lücke/)
    expect(() => parseBlocks('::: lückentext\ntitel: T\n```\n[[int]] x;\n:::', 'x.md')).toThrow(/nicht mit/)
  })

  it('Markdown maskiert HTML', () => {
    expect(markdownToHTML('<b>x</b> **fett** `a<b`')).toBe('<p>&lt;b&gt;x&lt;/b&gt; <strong>fett</strong> <code>a&lt;b</code></p>')
    expect(markdownToHTML('[x](javascript:alert(1))')).toContain('href="#"')
    expect(markdownToHTML('[**Sequenz**]{.blau} und [rot]{.rot}')).toBe('<p><mark class="learn-mark blau"><strong>Sequenz</strong></mark> und [rot]{.rot}</p>')
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
  const svgs = import.meta.glob('../lessons/bilder/**/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

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

describe('Lückentexte', () => {
  const labels: LiveLabels = { condition: 'Bedingung', selector: 'Wert', code: 'Dein Code', start: 'Startwert', step: 'Schritt', end: 'Ende' }
  /** Jeder Codeblock mit der ersten Antwort in jeder Lücke, nur Lücke `gap` bekommt Antwort `answer`. */
  const filled = (cloze: Cloze, gap = -1, answer = 0) => {
    let n = 0
    return cloze.blocks.map((lines) => lines.map((l) => l.map((p) => (typeof p === 'string' ? p : p.answers[n++ === gap ? answer : 0])).join('')).join('\n'))
  }
  const problems = (cloze: Cloze, gap = -1, answer = 0) => filled(cloze, gap, answer).flatMap((code) => parseLiveJava(code, labels).problems)
  it.each(contentLanguages)('mit jeder richtigen Antwort ist der Java-Code fehlerfrei (%s)', (lang) => {
    useContentLanguage(lang)
    let checked = 0
    for (const { where, block } of allBlocks()) {
      if (block.kind !== 'cloze') continue
      const cloze = block.cloze
      clozeGaps(cloze).forEach((answers, gi) =>
        answers.forEach((_, ai) => expect(problems(cloze, gi, ai), `${where}\n${filled(cloze, gi, ai).join('\n')}`).toEqual([])),
      )
      checked++
    }
    expect(checked).toBeGreaterThanOrEqual(8)
    useContentLanguage('de')
  })
})

describe('Bombe entschärfen', () => {
  it.each(contentLanguages)('mit der verbesserten Zeile meldet Java keinen Fehler mehr (%s)', (lang) => {
    useContentLanguage(lang)
    const labels: LiveLabels = { condition: 'Bedingung', selector: 'Wert', code: 'Dein Code', start: 'Startwert', step: 'Schritt', end: 'Ende' }
    let checked = 0
    for (const block of lessons.flatMap((l) => l.steps.flatMap((s) => s.blocks))) {
      if (block.kind !== 'roundGame' || block.game.kind !== 'bombe') continue
      for (const round of block.game.rounds) {
        const lines = round.code.split('\n')
        const wrong = lines[round.wrongLine! - 1]
        expect(round.fix!.trim(), round.code).not.toBe(wrong.trim())
        lines[round.wrongLine! - 1] = wrong.match(/^\s*/)![0] + round.fix!.trim()
        // CSV: Die richtige Zeile hat so viele Felder wie die Kopfzeile, die falsche nicht.
        if (block.game.data === 'csv') {
          const fields = (line: string) => line.split(';').length
          expect(lines.every((l) => fields(l) === fields(lines[0])), lines.join('\n')).toBe(true)
          expect(fields(wrong) === fields(lines[0]) && wrong.split(';').slice(1).every((v) => /^\d+$/.test(v.trim())), round.code).toBe(false)
        } else expect(parseLiveJava(lines.join('\n'), labels).problems, lines.join('\n')).toEqual([])
        checked++
      }
    }
    expect(checked).toBeGreaterThanOrEqual(8)
  })
})

describe('Rundenspiele (Swing)', () => {
  it('„reihenfolge“: Schritte stehen der Reihe nach da, ohne [x] und mindestens drei', () => {
    const game = parseRoundGame('reihenfolge', ['titel: Spiel: Wer ist dran?', 'runde:', 'frage: Was zuerst?', '- Klick', '- `model.erhoehen()`', '- Anzeige', '> So.'], 't.md')
    expect(game.rounds[0].options.map((o) => o.text)).toEqual(['Klick', '`model.erhoehen()`', 'Anzeige'])
    expect(game.rounds[0].code).toBe('')
    expect(() => parseRoundGame('reihenfolge', ['titel: x', 'runde:', 'frage: ?', '- a', '- b'], 't.md')).toThrow(/mindestens drei/)
    expect(() => parseRoundGame('reihenfolge', ['titel: x', 'runde:', 'frage: ?', '- a', '- [x] b', '- c'], 't.md')).toThrow(/kein \[x\]/)
    expect(() => parseRoundGame('reihenfolge', ['titel: x', 'runde:', 'frage: ?', '- a', '- a', '- c'], 't.md')).toThrow(/gleich/)
  })

  it('ein Zuhörer für mehrere Knöpfe mit getActionCommand, getSource und if/else', () => {
    const win = parseSwingWindow(
      [
        'JLabel anzeige = new JLabel("");',
        'JButton eins = new JButton("1");',
        'JButton zwei = new JButton("2");',
        'JButton weg = new JButton("C");',
        'ActionListener taste = e -> {',
        '    if (e.getSource() == weg) {',
        '        anzeige.setText("");',
        '    } else if (e.getActionCommand().equals("2")) anzeige.setText(anzeige.getText() + "zwei");',
        '    else anzeige.setText(anzeige.getText() + e.getActionCommand());',
        '};',
        'eins.addActionListener(taste);',
        'zwei.addActionListener(taste);',
        'weg.addActionListener(taste);',
      ].join('\n'),
    )
    expect(win.listeners.map((l) => [l.button, l.from, l.to])).toEqual([['eins', 4, 9], ['zwei', 4, 9], ['weg', 4, 9]])
    const steps = simulate(win, ['1', '2', '1'])
    expect(steps.at(-1)!.texts.anzeige).toBe('1zwei1')
    expect(simulate(win, ['1', 'C', '1']).at(-1)!.texts.anzeige).toBe('1')
  })

  it.each(contentLanguages)('„Wer hört zu?“: die richtige Antwort ergibt sich beim Nachspielen (%s)', (lang) => {
    useContentLanguage(lang)
    let checked = 0
    for (const block of lessons.flatMap((l) => l.steps.flatMap((s) => s.blocks))) {
      if (block.kind !== 'roundGame' || block.game.kind !== 'zuhoerer') continue
      for (const round of block.game.rounds) {
        const steps = simulate(parseSwingWindow(round.code), round.clicks)
        const last = steps.at(-1)!
        const results = [...Object.values(last.texts), String(steps.flatMap((s) => s.console).length)]
        const right = round.options.find((o) => o.right)!.text
        expect(results, `${round.code}\n→ ${right}`).toContain(right)
        checked++
      }
    }
    expect(checked).toBeGreaterThan(5)
  })
})

describe('PAP bauen', () => {
  const lines = (text: string) => text.trim().split('\n').map((l) => l.trim())

  it('liest Rücksprung und Seitenkasten', () => {
    const pap = parsePap(
      lines(`
        titel: Test
        start: Start
        anweisung: Rühren
        frage: Glatt? | nein -> Rühren
        frage: Fertig? | nein: Warten
        ende: Ende
      `),
      't.md',
    )
    expect(pap.nodes.map((n) => n.shape)).toEqual(['oval', 'rechteck', 'raute', 'raute', 'rechteck', 'oval'])
    expect(pap.nodes[2].backTo).toBe(1)
    expect(pap.nodes[3].side).toBe(4)
    expect(pap.nodes[4].isSide).toBe(true)
    const { boxes } = papLayout(pap)
    expect(boxes).toHaveLength(6)
    expect(boxes[4].y).toBe(boxes[3].y)
  })

  it('meldet Rücksprung ohne Ziel und Fragen ohne zweiten Ausgang', () => {
    expect(() => parsePap(['titel: x', 'start: S', 'frage: F? | nein -> Gibt es nicht', 'ende: E'], 't.md')).toThrow(/Rücksprung/)
    expect(() => parsePap(['titel: x', 'start: S', 'frage: F?', 'ende: E'], 't.md')).toThrow(/zweiten Ausgang|braucht/)
  })

  it('gleiche Elemente sind austauschbar', () => {
    const pap = parsePap(['titel: x', 'start: S', 'anweisung: A', 'anweisung: A', 'ende: E'], 't.md')
    expect(papFits(pap, 1, 2)).toBe(true)
    expect(papFits(pap, 0, 3)).toBe(false)
  })

  it('jede Sprache hat in Lektion 1 einen PAP zum Bauen', () => {
    for (const lang of contentLanguages) {
      useContentLanguage(lang)
      const paps = allBlocks().filter(({ block }) => block.kind === 'pap')
      expect(paps.length, lang).toBe(1)
    }
  })
})
