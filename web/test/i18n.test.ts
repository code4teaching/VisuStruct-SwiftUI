// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { languages, parseStrings } from '../src/ui/i18n'

const appDir = join(__dirname, '../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct')
const webDir = join(__dirname, '../src/i18n')
const read = (p: string) => parseStrings(readFileSync(p, 'utf8'))
const placeholders = (s: string) => (s.match(/%(\d+\$)?[@d]/g) ?? []).sort().join()

describe('Sprachen (AppLanguage.swift)', () => {
  const english = new Map([...read(join(appDir, 'en.lproj/Localizable.strings')), ...read(join(webDir, 'en.strings'))])
  const webEnglish = read(join(webDir, 'en.strings'))

  it('jeder Schlüssel im Code hat einen englischen Text', () => {
    const srcDir = join(__dirname, '../src/ui')
    const used = new Set<string>()
    for (const f of readdirSync(srcDir).filter((f) => f.endsWith('.ts'))) {
      for (const m of readFileSync(join(srcDir, f), 'utf8').matchAll(/\bt\(\s*'([a-z0-9_]+)'/g)) used.add(m[1])
    }
    expect(used.size).toBeGreaterThan(50)
    expect([...used].filter((k) => !english.has(k))).toEqual([])
  })

  it('jede Sprache hat alle Web-Texte mit denselben Platzhaltern', () => {
    for (const { code } of languages) {
      if (code === 'java') continue
      const web = read(join(webDir, `${code}.strings`))
      // Den Lernbereich gibt es vorerst nur auf Deutsch; seine Texte fallen in anderen Sprachen auf Englisch zurück.
      const required = [...webEnglish.keys()].filter((k) => !k.startsWith('web_learn_'))
      expect(required.filter((k) => !web.has(k)), code).toEqual([])
      for (const [k, v] of web) expect(placeholders(v), `${code} ${k}`).toBe(placeholders(webEnglish.get(k)!))
    }
  })

  it('liest Escapes wie Apple', () => {
    const m = parseStrings('/* x */\n"a" = "Zeile\\nzwei \\"q\\"";\n// y\n"b"="c";')
    expect(m.get('a')).toBe('Zeile\nzwei "q"')
    expect(m.get('b')).toBe('c')
  })
})
