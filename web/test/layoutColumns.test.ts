import { expect, test } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { decodeDocument } from '../src/core/xmlCodec'
import { LayoutEngine, type LayoutNode } from '../src/core/layout'

/** Spalten einer Verzweigung/Fallauswahl müssen die ganze Breite des Kastens füllen
 *  (sonst bleibt rechts Kopffarbe stehen und das if sieht aus wie eine Schleife, Lektion 14). */
test('Spalten füllen die Verzweigung in allen Lektionsdiagrammen', () => {
  const gaps: string[] = []
  const check = (n: LayoutNode, file: string) => {
    if (n.caseColumnFrames.length) {
      const last = n.caseColumnFrames[n.caseColumnFrames.length - 1]
      const end = last.x + last.width
      if (Math.abs(end - (n.frame.x + n.frame.width)) > 1) gaps.push(`${file}: ${n.element.textLines[0]}`)
    }
    n.children.forEach((c) => check(c, file))
  }
  const walk = (dir: string) => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f)
      if (statSync(p).isDirectory()) walk(p)
      else if (p.endsWith('.visustruct')) {
        const doc = decodeDocument(readFileSync(p, 'utf8'))
        new LayoutEngine().layout(doc).elements.forEach((n) => check(n, p))
      }
    }
  }
  walk('lessons/diagramme')
  expect(gaps).toEqual([])
})
