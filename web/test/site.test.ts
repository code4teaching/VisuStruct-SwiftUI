import { describe, expect, it } from 'vitest'
import { hostWorld, siteLanguage, worldHomeURL } from '../src/ui/site'

describe('Webseiten auf visucode.de', () => {
  it('erkennt die Welt an der Subdomain', () => {
    expect(hostWorld('visubot.visucode.de')).toBe('visubot')
    expect(hostWorld('VisuStruct.visucode.de')).toBe('visustruct')
    expect(hostWorld('visuobject.visucode.de')).toBe('visuobject')
    expect(hostWorld('visucode.de')).toBeUndefined()
    expect(hostWorld('localhost')).toBeUndefined()
    expect(hostWorld('visubot.visucode.de.example.com')).toBeUndefined()
  })

  it('nimmt de, en oder pt als Sprachordner', () => {
    expect(siteLanguage('de')).toBe('de')
    expect(siteLanguage('pt-PT')).toBe('pt')
    expect(siteLanguage('fr')).toBe('en')
  })

  it('verlinkt die Startseite relativ nur auf der eigenen Subdomain', () => {
    const bot = { hostname: 'visubot.visucode.de', pathname: '/app/index.html' }
    expect(worldHomeURL('visubot', 'de', undefined, bot)).toBe('../de/index.html')
    expect(worldHomeURL('visubot', 'pt-PT', 'privacy', bot)).toBe('../pt/index.html#privacy')
    expect(worldHomeURL('visustruct', 'de', 'contact', bot)).toBe('https://visustruct.visucode.de/de/#contact')
    const preview = { hostname: 'localhost', pathname: '/' }
    expect(worldHomeURL('visuobject', 'en', undefined, preview)).toBe('https://visuobject.visucode.de/en/')
  })
})
