// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { glossary } from '../src/learn/content'
import { parseGlossary } from '../src/learn/glossary'
import { markTerms } from '../src/ui/termTips'

const entries = parseGlossary(`Vorspann wird ignoriert.

### Variable
auch: Variablen
Eine beschriftete Kiste.

### Schleife
auch: Schleifen
Wiederholt Schritte.
`)

function step(html: string): HTMLElement {
  const root = document.createElement('div')
  root.innerHTML = html
  markTerms(root, entries)
  return root
}

describe('Fachbegriffe', () => {
  it('liest Begriffe, Formen und Erklärung', () => {
    expect(entries).toEqual([
      { term: 'Variable', forms: ['Variable', 'Variablen'], text: 'Eine beschriftete Kiste.' },
      { term: 'Schleife', forms: ['Schleife', 'Schleifen'], text: 'Wiederholt Schritte.' },
    ])
  })

  it('jeder Begriff in begriffe.md hat eine Erklärung', () => {
    expect(glossary.length).toBeGreaterThan(10)
    for (const e of glossary) expect(e.text, e.term).not.toBe('')
  })

  it('markiert nur das erste Vorkommen je Schritt', () => {
    const root = step('<div class="learn-text"><p>Zwei Variablen und noch eine Variable.</p></div><div class="learn-text"><p>Variable</p></div>')
    const marks = [...root.querySelectorAll('.term')]
    expect(marks.map((m) => m.textContent)).toEqual(['Variablen'])
    expect((marks[0] as HTMLElement).dataset.text).toBe('Eine beschriftete Kiste.')
  })

  it('lässt fett erklärte Begriffe, Code und Zusammensetzungen aus', () => {
    const root = step('<div class="learn-text"><p>Eine <strong>Variable</strong> ist … `x` ist eine Variable. <code>Schleife</code> While-Schleife Schleifenzähler</p></div>')
    expect(root.querySelectorAll('.term').length).toBe(0)
  })

  it('markiert nur in Lektionstexten', () => {
    const root = step('<p>Variable</p><div class="learn-text"><p>Eine Schleife.</p></div>')
    expect([...root.querySelectorAll('.term')].map((m) => m.textContent)).toEqual(['Schleife'])
  })
})
