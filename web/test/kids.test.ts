import { describe, expect, it } from 'vitest'
import { language, lessons, showingBlockLessons, tasks, useBlockLessons, useContentLanguage, useOnlyBlockLessons, useVisuBotContent } from '../src/learn/content'
import { hostWorld, kidsWanted, worldHomeURL } from '../src/ui/site'

/**
 * VisuBot Kids (Holger 5.11.): dieselbe App auf visubotkids.visucode.de, nur mit Blöcken und den Block-Lektionen.
 */
describe('VisuBot Kids', () => {
  it('läuft auf visubotkids.visucode.de und mit ?kids, sonst nicht', () => {
    expect(hostWorld('visubotkids.visucode.de')).toBe('visubotkids')
    expect(hostWorld('visubot.visucode.de')).toBe('visubot')
    expect(kidsWanted('visubotkids.visucode.de', '')).toBe(true)
    expect(kidsWanted('localhost', '?kids')).toBe(true)
    expect(kidsWanted('visubot.visucode.de', '')).toBe(false)
    expect(worldHomeURL('visubotkids', 'de', undefined, { hostname: 'visubotkids.visucode.de', pathname: '/app/' })).toBe('../de/index.html')
    expect(worldHomeURL('visubotkids', 'en', undefined, { hostname: 'localhost', pathname: '/' })).toBe('https://visubotkids.visucode.de/en/')
  })

  it('zeigt nur die Block-Lektionen und -Aufgaben, auch wenn jemand umschalten will', () => {
    useContentLanguage('de')
    useOnlyBlockLessons()
    expect(showingBlockLessons()).toBe(true)
    const count = lessons.length
    expect(count).toBeGreaterThanOrEqual(8)
    expect(tasks.length).toBeGreaterThanOrEqual(4)
    expect(tasks.every((t) => t.id.startsWith('block-'))).toBe(true)
    expect(useBlockLessons(false)).toBe(false)
    useVisuBotContent('off')
    expect(showingBlockLessons()).toBe(true)
    expect(lessons.length).toBe(count)
  })

  it('nimmt die deutschen Block-Lektionen, wenn es sie in der Sprache noch nicht gibt', () => {
    useContentLanguage('en')
    expect(showingBlockLessons()).toBe(true)
    expect(language).toBe('de')
    expect(lessons.every((l) => l.blocks)).toBe(true)
  })
})
