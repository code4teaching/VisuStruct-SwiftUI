// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { a4PageAndImageRect, buildDiagramPDF, exportFilenameSlug } from '../src/ui/exporter'

describe('Export (DiagramSnapshotAndExport.swift)', () => {
  it('bildet Dateinamen wie sanitizedExportFilenameSlug', () => {
    expect(exportFilenameSlug('  Summe bilden / Teil 2  ')).toBe('Summe-bilden-Teil-2')
    expect(exportFilenameSlug('Collatz.visustruct')).toBe('Collatz')
    expect(exportFilenameSlug('a: b?')).toBe('a-b')
    expect(exportFilenameSlug('   ')).toBe('')
  })

  it('wählt Hoch- oder Querformat wie A4SinglePageLayout', () => {
    const tall = a4PageAndImageRect(300, 800)
    expect(tall.page).toEqual({ width: 595, height: 842 })
    const wide = a4PageAndImageRect(1200, 400)
    expect(wide.page).toEqual({ width: 842, height: 595 })
    // Zentriert innerhalb von 32 pt Rand, Seitenverhältnis bleibt.
    expect(wide.draw.x).toBeGreaterThanOrEqual(32)
    expect(wide.draw.width / wide.draw.height).toBeCloseTo(3, 5)
    expect(wide.draw.x * 2 + wide.draw.width).toBeCloseTo(842, 5)
  })

  it('schreibt ein gültiges einseitiges PDF', async () => {
    const rgb = new Uint8Array(4 * 2 * 3).fill(200)
    const blob = await buildDiagramPDF(rgb, 4, 2, { width: 400, height: 200 }, 'Prüfung')
    const bytes = new Uint8Array(await blob.arrayBuffer())
    const text = new TextDecoder('latin1').decode(bytes)
    expect(text.startsWith('%PDF-1.4')).toBe(true)
    expect(text.trimEnd().endsWith('%%EOF')).toBe(true)
    expect(text).toContain('/MediaBox [0 0 842 595]')
    // Jeder xref-Eintrag zeigt auf den Anfang seines Objekts.
    const xrefAt = Number(/startxref\n(\d+)/.exec(text)![1])
    expect(text.slice(xrefAt, xrefAt + 4)).toBe('xref')
    const entries = text.slice(xrefAt).split('\n').slice(3, 9)
    entries.forEach((line, i) => {
      const off = Number(line.slice(0, 10))
      expect(text.slice(off, off + `${i + 1} 0 obj`.length)).toBe(`${i + 1} 0 obj`)
    })
    // Titel als UTF-16 („ü“ = 00FC).
    expect(text).toContain('/Title <FEFF0050007200FC')
  })
})
