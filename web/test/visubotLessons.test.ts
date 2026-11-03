import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { checkExercise, loopDepth, usedElementTypes } from '../src/core/exerciseCheck'
import { ElementType } from '../src/core/model'
import { diagram, lessons, reference, tasks, useContentLanguage, useVisuBotContent, world } from '../src/learn/content'
import type { Block, Exercise } from '../src/learn/lessonFormat'
import { subprogramName } from '../src/core/simulation'
import type { LiveLabels } from '../src/core/codeGenerator'
import { parseLiveJava } from '../src/core/javaParser'
import { documentFromJava, plainLiveJava } from '../src/core/liveSource'
import { isMBotPart, MBOT_PARTS } from '../src/core/mbot'

/** Unterprogramme einer Übung (`unterprogramm:`) für Aufrufe in der Musterlösung */
const resolver = (ex: Exercise) => {
  const subs = ex.subprograms.map((f) => diagram(f)!)
  return (name: string) => subs.find((s) => subprogramName(s.caption).toLowerCase() === subprogramName(name).toLowerCase())
}

const robotLessons = () => lessons.filter((l) => l.robot)

const allBlocks = (): { where: string; block: Block }[] => [
  ...robotLessons().flatMap((l) => l.steps.flatMap((s) => s.blocks.map((block) => ({ where: `${l.id} / ${s.title}`, block })))),
  ...tasks.filter((t) => t.robot).flatMap((t) => t.blocks.map((block) => ({ where: t.id, block }))),
]

describe.each(['de', 'en'] as const)('VisuBot-Lektionen (%s)', (lang) => {
  beforeAll(() => {
    useVisuBotContent('on')
    useContentLanguage(lang)
  })
  afterAll(() => useVisuBotContent('off'))

  it('zeigt nur die Roboter-Lektionen und -Aufgaben, lückenlos nummeriert, in Teilen', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(33)
    expect(lessons.every((l) => l.robot)).toBe(true)
    lessons.forEach((l, i) => {
      expect(l.number, l.id).toBe(i + 1)
      expect(l.section, l.id).not.toBe('VisuBot')
    })
    expect(new Set(lessons.map((l) => l.section)).size).toBe(4)
    // die neue Lektion „Und, oder, nicht“ steht nach der Linie, ohne dass Dateien umbenannt werden
    const at = (id: string) => lessons.findIndex((l) => l.id === id)
    expect(at('07-und-oder')).toBe(at('07-linie') + 1)
    expect(at('08-farben')).toBe(at('07-und-oder') + 1)
    // Einstieg vorn, Testen nach den Variablen, do-while nach der While-Schleife, break nach den Tasten
    expect(at('00-struktogramm-und-editor')).toBe(0)
    expect(at('03-zeile-fuer-zeile-testen')).toBe(at('03-variablen-und-ausgabe') + 1)
    expect(at('05-erst-fahren-dann-pruefen')).toBe(at('05-bis-zur-wand') + 1)
    expect(at('10-unterbrechen-mit-break')).toBe(at('10-tasten-joystick') + 1)
    // Grundlagen kleinschrittig: Zählen, Konstanten, else if, Maximum, Merker, Zustände
    expect(at('05-zaehlen-und-summieren')).toBe(at('05-erst-fahren-dann-pruefen') + 1)
    expect(at('06-konstanten-final')).toBe(at('06-abstand') + 1)
    expect(at('06-nah-mittel-weit')).toBe(at('06-konstanten-final') + 1)
    expect(at('08-groesster-wert')).toBe(at('08-farben') + 1)
    expect(at('11-merker-boolean')).toBe(at('11-licht') + 1)
    expect(at('21-zustaende')).toBe(at('21-stoppuhr-akku') + 1)
    expect(tasks.length).toBeGreaterThanOrEqual(16)
    expect(tasks.every((t) => t.robot)).toBe(true)
    for (const t of tasks) if (t.after !== undefined) expect(lessons.some((l) => l.number === t.after), t.id).toBe(true)
  })

  it('Verweise auf VisuStruct zeigen auf vorhandene Lektionen', () => {
    const targets = lessons.flatMap((l) => [...JSON.stringify(l.steps).matchAll(/\?visustruct&lektion=([\w-]+)/g)].map((m) => ({ lesson: l.id, target: m[1] })))
    expect(targets.length).toBeGreaterThanOrEqual(9)
    useVisuBotContent('off')
    const ids = new Set(lessons.map((l) => l.id))
    useVisuBotContent('on')
    for (const { lesson, target } of targets) expect(ids.has(target), `${lesson} → ${target}`).toBe(true)
  })

  it('Verweise auf Lektionen zeigen auf die neue Nummer', () => {
    const quadrat = lessons.find((l) => l.id === '02-das-quadrat')!
    const tour = lessons.find((l) => l.id === '01-der-mbot2')!
    const word = { de: 'Lektion', en: 'Lesson' }[lang]
    expect(JSON.stringify(tour.steps).toLowerCase()).toContain(`${word} ${quadrat.number}`.toLowerCase())
    // eingeschobene Lektionen verschieben die Nummern: Motoren (Datei 20) ist Lektion 30
    const motoren = lessons.find((l) => l.id === '20-motoren')!
    const sensoren = lessons.find((l) => l.id === '04-sensoren')!
    expect(motoren.number).toBe(30)
    expect(JSON.stringify(sensoren.steps).toLowerCase()).toContain(`${word} ${motoren.number}`.toLowerCase())
  })

  it('jede Übung prüft eine Fahrt (ohne Roboter: eine Ausgabe), und die Musterlösung besteht sie', () => {
    let checked = 0
    for (const { where, block } of allBlocks()) {
      if (block.kind !== 'exercise') continue
      const ex = block.exercise
      expect(ex.id.startsWith('vb-'), `${where}: Kennung beginnt mit vb-`).toBe(true)
      const robot = ex.tests.some((t) => t.drive || t.world || t.sensors || t.actions)
      const doc = diagram(ex.solution!)!
      expect(doc, `${where}: ${ex.solution}`).toBeDefined()
      expect(robot, `${where}: fahrt:, befehle:, welt: oder messwerte:`).toBe(true)
      expect(ex.hints.length).toBeGreaterThanOrEqual(2)
      for (const o of checkExercise(doc, ex.tests, resolver(ex), world)) expect(o.passed, `${where}: ${JSON.stringify(o.result)}`).toBe(true)
      for (const r of ex.requires) expect(usedElementTypes(doc).has(ElementType[r as keyof typeof ElementType])).toBe(true)
      if (ex.loopDepth) expect(loopDepth(doc.elements)).toBeGreaterThanOrEqual(ex.loopDepth)
      expect(checkExercise({ caption: '', elements: [] }, ex.tests, undefined, world).every((o) => o.passed)).toBe(false)
      checked++
    }
    expect(checked).toBeGreaterThanOrEqual(5)
  })

  it('Java-Übungen (code: java) lassen sich in Java tippen und bestehen', () => {
    const labels: LiveLabels = { condition: 'Bedingung', selector: 'Wert', code: 'Dein Code', start: 'Startwert', step: 'Schritt', end: 'Ende' }
    let checked = 0
    for (const { where, block } of allBlocks()) {
      if (block.kind !== 'exercise' || block.exercise.code !== 'java') continue
      const parsed = parseLiveJava(plainLiveJava(diagram(block.exercise.solution!)!, labels), labels)
      expect(parsed.problems, where).toEqual([])
      const doc = documentFromJava({ caption: '', elements: [] }, parsed)
      for (const o of checkExercise(doc, block.exercise.tests, undefined, world)) expect(o.passed, `${where}: ${JSON.stringify(o.result)}`).toBe(true)
      checked++
    }
    expect(checked).toBeGreaterThanOrEqual(20)
  })

  it('ab Lektion 4 hat jede Roboter-Lektion eine Übung „Warum läuft das nicht?“, deren Start die Tests nicht besteht', () => {
    for (const l of robotLessons().filter((l) => Number(/^\d+/.exec(l.id)![0]) >= 4)) {
      const blocks = l.steps.flatMap((s) => s.blocks)
      const ex = blocks.find((b) => b.kind === 'exercise' && b.exercise.id === `vb-fehler-${l.id}`)
      expect(ex, l.id).toBeDefined()
    }
    for (const { where, block } of allBlocks()) {
      if (block.kind !== 'exercise' || !block.exercise.start) continue
      const start = diagram(block.exercise.start)
      expect(start, `${where}: ${block.exercise.start}`).toBeDefined()
      expect(checkExercise(start!, block.exercise.tests, resolver(block.exercise), world).every((o) => o.passed), where).toBe(false)
    }
  })

  it('Checklisten verweisen auf Schritte', () => {
    for (const l of robotLessons())
      for (const s of l.steps)
        for (const b of s.blocks) if (b.kind === 'checklist') for (const item of b.items) expect(item.step, `${l.id}: ${item.text}`).toBeDefined()
  })

  it('Lektion 1 ist eine Tour durch alle Teile, jedes gezeigte Teil ist im Text verlinkt', () => {
    const tour = robotLessons().find((l) => l.id === '01-der-mbot2')!
    const blocks = tour.steps.flatMap((s) => s.blocks)
    const shown = new Set(blocks.flatMap((b) => (b.kind === 'robotModel' ? b.focus : b.kind === 'robotQuiz' ? b.tasks.map((t) => t.part) : [])))
    expect([...shown].sort()).toEqual([...MBOT_PARTS].sort())
    expect(blocks.some((b) => b.kind === 'robotQuiz')).toBe(true)
    for (const step of tour.steps) {
      const text = JSON.stringify(step.blocks)
      const linked = new Set([...text.matchAll(/\{(?:teil|part)=([\w,]+)\}/g)].flatMap((m) => m[1].split(',')))
      for (const b of step.blocks) if (b.kind === 'robotModel') for (const p of b.focus) expect(linked, `${step.title}: ${p}`).toContain(p)
      for (const p of linked) expect(isMBotPart(p), `${step.title}: ${p}`).toBe(true)
    }
  })
})

describe.each(['de', 'en'] as const)('VisuStruct ohne Roboter, VisuBot nur mit Roboter (%s)', (lang) => {
  const robotTasks = ['treppe', 'labyrinth', 'knight-rider', 'morsen']
  beforeAll(() => useContentLanguage(lang))
  afterAll(() => useVisuBotContent('off'))

  it('VisuStruct zeigt keine Roboter-Lektionen, -Aufgaben oder -Befehle', () => {
    useVisuBotContent('off')
    expect(lessons.length).toBeGreaterThanOrEqual(40)
    expect(lessons.some((l) => l.section === 'VisuBot' || l.steps.some((s) => s.title.includes('🤖')))).toBe(false)
    expect(tasks.some((t) => robotTasks.includes(t.id))).toBe(false)
    expect(reference).not.toContain('mBot2')
  })

  it('VisuBot zeigt nur Roboter-Lektionen und -Aufgaben, Nachschlagen mit den mBot2-Kategorien', () => {
    useVisuBotContent('on')
    expect(lessons.filter((l) => l.robot).length).toBeGreaterThanOrEqual(33)
    expect(lessons.filter((l) => !l.robot)).toEqual([])
    expect(tasks.map((t) => t.id)).toEqual(expect.arrayContaining(robotTasks))
    expect(tasks.filter((t) => !t.robot)).toEqual([])
    expect(reference).toContain('## 🤖 mBot2')
    expect(reference).toContain('## 📡 mBot2')
    expect(reference).toContain('### ' + { de: 'Verzweigung', en: 'Branch' }[lang])
  })
})
