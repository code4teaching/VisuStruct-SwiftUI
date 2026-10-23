import { afterEach, describe, expect, it } from 'vitest'
import { preferredLanguage, setCodeKeywords, setLanguage, storedCodeKeywords, t } from '../src/ui/i18n'

describe('Code-Keywords (unabhängig von der Sprache)', () => {
  afterEach(() => localStorage.clear())

  it('ersetzt nur die Elementnamen durch Java-Keywords', async () => {
    await setLanguage('de', false)
    await setCodeKeywords(true, false)
    expect(t('element_verzweigung')).toBe('if')
    expect(t('element_whileSchleife')).toBe('while')
    expect(t('element_anweisung')).toBe('Anweisung')
    expect(t('settings_language_title')).toBe('Sprache')
    await setCodeKeywords(false, false)
    expect(t('element_verzweigung')).toBe('Verzweigung')
  })

  it('macht aus der alten Sprache „Java (Keywords)“ Englisch mit Code-Keywords', () => {
    localStorage.setItem('appLanguageCode', 'java')
    expect(preferredLanguage()).toBe('en')
    expect(storedCodeKeywords()).toBe(true)
  })
})
