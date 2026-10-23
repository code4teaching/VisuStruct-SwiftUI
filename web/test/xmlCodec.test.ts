import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { decodeJavaString, encodeJavaString } from '../src/core/javaStringCoding'
import { decodeDocument, encodeDocument } from '../src/core/xmlCodec'

const examplesDir = join(__dirname, '..', '..', 'VisuStruct-Dateien')

function allDiagramFiles(dir: string): string[] {
  return readdirSync(dir)
    .flatMap((name) => {
      const p = join(dir, name)
      if (statSync(p).isDirectory()) return allDiagramFiles(p)
      return /\.(visustruct|strk)$/.test(name) ? [p] : []
    })
    .sort()
}

describe('Java-Zeichenkodierung', () => {
  it('kodiert wie Java encodeS', () => {
    expect(encodeJavaString('')).toBe('-1;')
    expect(encodeJavaString('a ä')).toBe('97;32;228;')
    expect(encodeJavaString('😀')).toBe('128512;')
  })
  it('dekodiert wie Java decodeS', () => {
    expect(decodeJavaString('-1;')).toBe('')
    expect(decodeJavaString('97;32;228;')).toBe('a ä')
    expect(decodeJavaString('128512;')).toBe('😀')
  })
})

describe('Beispieldateien aus VisuStruct-Dateien', () => {
  const files = allDiagramFiles(examplesDir)

  it('findet Beispieldateien', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  for (const file of files) {
    const name = relative(examplesDir, file)
    it(`${name}: Laden und Speichern ergibt dieselbe Datei wie die Swift-App`, () => {
      const original = readFileSync(file, 'utf8')
      const doc = decodeDocument(original)
      expect(doc.elements.length).toBeGreaterThan(0)
      const reencoded = encodeDocument(doc)
      // Verlustfrei: erneutes Laden ergibt dasselbe Modell …
      expect(decodeDocument(reencoded)).toEqual(doc)
      // … und die Bytes entsprechen dem Swift-Encoder (der die Beispieldateien geschrieben hat).
      // Unter Windows gespeicherte Dateien haben CRLF; Swift schreibt wie wir LF.
      expect(reencoded).toBe(original.replace(/\r\n/g, '\n'))
    })
  }
})

describe('Pseudocode-Markierung', () => {
  it('bleibt beim Speichern erhalten und fehlt sonst', () => {
    const marked = { caption: 'Tee', pseudocode: true, elements: [] }
    const xml = encodeDocument(marked)
    expect(xml).toContain('pseudocode="true"')
    expect(decodeDocument(xml).pseudocode).toBe(true)
    const plain = encodeDocument({ caption: 'Tee', elements: [] })
    expect(plain).not.toContain('pseudocode')
    expect(decodeDocument(plain).pseudocode).toBeUndefined()
  })
})
