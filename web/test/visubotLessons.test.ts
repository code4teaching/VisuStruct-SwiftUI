import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { checkExercise, loopDepth, usedElementTypes } from '../src/core/exerciseCheck'
import { ElementType } from '../src/core/model'
import { diagram, lessons, reference, tasks, useContentLanguage, useVisuBotContent, world } from '../src/learn/content'
import type { Block, Exercise } from '../src/learn/lessonFormat'
import { subprogramName } from '../src/core/simulation'
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

  it('zeigt eine durchgehende Reihe: VisuStruct-Lektionen mit den VisuBot-Lektionen dazwischen, lückenlos nummeriert', () => {
    expect(robotLessons().length).toBeGreaterThanOrEqual(22)
    expect(lessons.length - robotLessons().length).toBeGreaterThanOrEqual(40)
    lessons.forEach((l, i) => {
      expect(l.number, l.id).toBe(i + 1)
      expect(l.section, l.id).not.toBe('VisuBot')
    })
    // Erst der Editor, dann der Roboter; jede VisuBot-Lektion nach ihrem Thema
    const at = (id: string) => lessons.findIndex((l) => l.id === id)
    expect(at('01-der-mbot2')).toBe(at('03-speichern-oeffnen-exportieren') + 1)
    expect(at('02-das-quadrat')).toBeGreaterThan(at('05-sequenz'))
    expect(at('05-bis-zur-wand')).toBeGreaterThan(at('11-while-schleife'))
    expect(at('22-eigene-methoden')).toBeGreaterThan(at('18-aufruf-und-aussprung'))
    expect(at('22-eigene-methoden')).toBeLessThan(at('20-java'))
    expect(tasks.some((t) => t.robot)).toBe(true)
    expect(tasks.some((t) => !t.robot)).toBe(true)
    for (const t of tasks) if (t.after !== undefined) expect(lessons.some((l) => l.number === t.after), t.id).toBe(true)
  })

  it('Verweise auf Lektionen zeigen auf die neue Nummer', () => {
    const quadrat = lessons.find((l) => l.id === '02-das-quadrat')!
    const tour = lessons.find((l) => l.id === '01-der-mbot2')!
    const word = { de: 'Lektion', en: 'Lesson' }[lang]
    expect(JSON.stringify(tour.steps).toLowerCase()).toContain(`${word} ${quadrat.number}`.toLowerCase())
  })

  it('jede Übung prüft eine Fahrt (ohne Roboter: eine Ausgabe), und die Musterlösung besteht sie', () => {
    let checked = 0
    let withoutRobot = 0
    for (const { where, block } of allBlocks()) {
      if (block.kind !== 'exercise') continue
      const ex = block.exercise
      expect(ex.id.startsWith('vb-'), `${where}: Kennung beginnt mit vb-`).toBe(true)
      const robot = ex.tests.some((t) => t.drive || t.world || t.sensors || t.actions)
      const doc = diagram(ex.solution!)!
      expect(doc, `${where}: ${ex.solution}`).toBeDefined()
      if (ex.id.startsWith('vb-ohne-')) {
        // „Jetzt ohne Roboter“: reines Java, geprüft wird die Ausgabe
        expect(robot, `${where}: ohne Roboter`).toBe(false)
        expect(ex.tests.every((t) => t.expected.length > 0), where).toBe(true)
        expect(JSON.stringify([doc, ex.subprograms.map((f) => diagram(f))]), where).not.toContain('mbot.')
        withoutRobot++
      } else expect(robot, `${where}: fahrt:, befehle:, welt: oder messwerte:`).toBe(true)
      expect(ex.hints.length).toBeGreaterThanOrEqual(2)
      for (const o of checkExercise(doc, ex.tests, resolver(ex), world)) expect(o.passed, `${where}: ${JSON.stringify(o.result)}`).toBe(true)
      for (const r of ex.requires) expect(usedElementTypes(doc).has(ElementType[r as keyof typeof ElementType])).toBe(true)
      if (ex.loopDepth) expect(loopDepth(doc.elements)).toBeGreaterThanOrEqual(ex.loopDepth)
      expect(checkExercise({ caption: '', elements: [] }, ex.tests, undefined, world).every((o) => o.passed)).toBe(false)
      checked++
    }
    expect(checked).toBeGreaterThanOrEqual(5)
    expect(withoutRobot).toBeGreaterThanOrEqual(5)
  })

  it('Checklisten verweisen auf Schritte', () => {
    for (const l of robotLessons())
      for (const s of l.steps)
        for (const b of s.blocks) if (b.kind === 'checklist') for (const item of b.items) expect(item.step, `${l.id}: ${item.text}`).toBeDefined()
  })

  it('Lektion 1 ist eine Tour durch alle Teile, jedes gezeigte Teil ist im Text verlinkt', () => {
    const tour = robotLessons()[0]
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

describe.each(['de', 'en'] as const)('VisuStruct ohne Roboter, VisuBot mit der ganzen Reihe (%s)', (lang) => {
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

  it('VisuBot zeigt alle Lektionen und Aufgaben, Nachschlagen mit den mBot2-Kategorien', () => {
    useVisuBotContent('on')
    expect(lessons.filter((l) => l.robot).length).toBeGreaterThanOrEqual(22)
    expect(lessons.filter((l) => !l.robot).length).toBeGreaterThanOrEqual(40)
    expect(tasks.map((t) => t.id)).toEqual(expect.arrayContaining(robotTasks))
    expect(tasks.filter((t) => !t.robot).length).toBeGreaterThanOrEqual(10)
    expect(reference).toContain('## 🤖 mBot2')
    expect(reference).toContain('## 📡 mBot2')
    expect(reference).toContain('### ' + { de: 'Verzweigung', en: 'Branch' }[lang])
  })
})
