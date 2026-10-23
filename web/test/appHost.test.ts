import { afterEach, describe, expect, it, vi } from 'vitest'

async function load(host?: { courseUnlocked: boolean; freeLessons: number }) {
  vi.resetModules()
  window.visustructHost = host
  return import('../src/ui/appHost')
}

describe('Kurs in der App (appHost)', () => {
  afterEach(() => {
    delete window.visustructHost
    delete window.visustructSetCourseUnlocked
  })

  it('im Browser ist alles frei', async () => {
    const m = await load()
    expect(m.inApp).toBe(false)
    expect(m.courseLocked(20)).toBe(false)
  })

  it('in der App ohne Kauf nur die Vorschau-Lektionen', async () => {
    const m = await load({ courseUnlocked: false, freeLessons: 3 })
    expect(m.inApp).toBe(true)
    expect(m.courseLocked(3)).toBe(false)
    expect(m.courseLocked(4)).toBe(true)
  })

  it('nach dem Kauf ist alles frei und die Ansicht wird neu gezeichnet', async () => {
    const m = await load({ courseUnlocked: false, freeLessons: 3 })
    const redraw = vi.fn()
    m.onCourseChange(redraw)
    window.visustructSetCourseUnlocked!(true)
    expect(m.courseLocked(20)).toBe(false)
    expect(redraw).toHaveBeenCalledOnce()
  })

  it('Kaufen schickt eine Nachricht an die App', async () => {
    const m = await load({ courseUnlocked: false, freeLessons: 3 })
    const postMessage = vi.fn()
    window.webkit = { messageHandlers: { visustruct: { postMessage } } }
    m.buyCourse()
    expect(postMessage).toHaveBeenCalledWith({ type: 'buyCourse' })
    delete window.webkit
  })
})
