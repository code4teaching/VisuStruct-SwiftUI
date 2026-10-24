import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { checkExercise, loopDepth, usedElementTypes } from '../src/core/exerciseCheck'
import { ElementType } from '../src/core/model'
import { diagram, lessons, tasks, useContentLanguage, useVisuBotContent } from '../src/learn/content'
import type { Block } from '../src/learn/lessonFormat'

const allBlocks = (): { where: string; block: Block }[] => [
  ...lessons.flatMap((l) => l.steps.flatMap((s) => s.blocks.map((block) => ({ where: `${l.id} / ${s.title}`, block })))),
  ...tasks.flatMap((t) => t.blocks.map((block) => ({ where: t.id, block }))),
]

describe.each(['de', 'en'] as const)('VisuBot-Lektionen (%s)', (lang) => {
  beforeAll(() => {
    useVisuBotContent(true)
    useContentLanguage(lang)
  })
  afterAll(() => useVisuBotContent(false))

  it('zeigt nur die VisuBot-Lektionen, lückenlos nummeriert', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(2)
    lessons.forEach((l, i) => {
      expect(l.number, l.id).toBe(i + 1)
      expect(l.section, l.id).toBe('VisuBot')
    })
    expect(tasks.length).toBeGreaterThanOrEqual(1)
  })

  it('jede Übung prüft eine Fahrt, und die Musterlösung besteht sie', () => {
    let checked = 0
    for (const { where, block } of allBlocks()) {
      if (block.kind !== 'exercise') continue
      const ex = block.exercise
      expect(ex.id.startsWith('vb-'), `${where}: Kennung beginnt mit vb-`).toBe(true)
      expect(ex.tests.some((t) => t.drive), `${where}: fahrt:`).toBe(true)
      expect(ex.hints.length).toBeGreaterThanOrEqual(2)
      const doc = diagram(ex.solution!)!
      expect(doc, `${where}: ${ex.solution}`).toBeDefined()
      for (const o of checkExercise(doc, ex.tests)) expect(o.passed, `${where}: ${JSON.stringify(o.result)}`).toBe(true)
      for (const r of ex.requires) expect(usedElementTypes(doc).has(ElementType[r as keyof typeof ElementType])).toBe(true)
      if (ex.loopDepth) expect(loopDepth(doc.elements)).toBeGreaterThanOrEqual(ex.loopDepth)
      expect(checkExercise({ caption: '', elements: [] }, ex.tests).every((o) => o.passed)).toBe(false)
      checked++
    }
    expect(checked).toBeGreaterThanOrEqual(5)
  })

  it('Checklisten verweisen auf Schritte, das 3D-Modell erklärt alle Teile', () => {
    for (const l of lessons)
      for (const s of l.steps)
        for (const b of s.blocks) {
          if (b.kind === 'checklist') for (const item of b.items) expect(item.step, `${l.id}: ${item.text}`).toBeDefined()
          if (b.kind === 'robotModel') expect(b.parts.map((p) => p.part).sort()).toEqual(['chassis', 'cyberpi', 'lineSensor', 'motors', 'ultrasonic'])
        }
  })
})
