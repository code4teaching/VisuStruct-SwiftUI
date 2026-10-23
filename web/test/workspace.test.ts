import { describe, expect, it } from 'vitest'
import { compareEntries, programBaseName, todayFolder, uniqueBaseName, validFolderName } from '../src/core/workspace'

describe('Workspace', () => {
  it('Tagesordner in Ortszeit', () => {
    expect(todayFolder(new Date(2026, 9, 23, 23, 30))).toBe('2026-10-23')
    expect(todayFolder(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('Ordner vor Dateien, Tage neueste zuerst', () => {
    const entries = [
      { kind: 'file', name: 'lernstand.json' },
      { kind: 'directory', name: '2026-10-22' },
      { kind: 'directory', name: '2026-10-23' },
      { kind: 'directory', name: '11FI2' },
      { kind: 'directory', name: '11FI10' },
    ]
    expect(entries.sort(compareEntries).map((e) => e.name)).toEqual(['11FI2', '11FI10', '2026-10-23', '2026-10-22', 'lernstand.json'])
  })

  it('Dateiname aus dem Titel', () => {
    expect(programBaseName('Rechner', 'Programm')).toBe('Rechner')
    expect(programBaseName('  Ja/Nein: Test?  ', 'Programm')).toBe('Ja-Nein- Test-')
    expect(programBaseName('', 'Programm')).toBe('Programm')
    expect(programBaseName('Alt.visustruct', 'Programm')).toBe('Alt')
  })

  it('freier Name für Struktogramm und Code', () => {
    expect(uniqueBaseName('Rechner', ['Andere.visustruct'])).toBe('Rechner')
    expect(uniqueBaseName('Rechner', ['rechner.visustruct', 'Rechner 2.java'])).toBe('Rechner 3')
  })

  it('Ordnernamen', () => {
    expect(validFolderName(' 11FI1 ')).toBe('11FI1')
    expect(validFolderName('a/b')).toBe('ab')
    expect(validFolderName('..')).toBeUndefined()
    expect(validFolderName('  ')).toBeUndefined()
  })
})
