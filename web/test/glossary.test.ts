// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { glossary, lessons } from '../src/learn/content'
import { markdownToHTML } from '../src/learn/markdown'
import { parseGlossary } from '../src/learn/glossary'
import { markPointers, markTerms, uiTargets } from '../src/ui/termTips'

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

describe('Zeiger auf den Editor', () => {
  it('jeder Zeiger in einer Lektion nennt einen bekannten Bereich', () => {
    for (const l of lessons)
      for (const s of l.steps)
        for (const b of s.blocks)
          if (b.kind === 'markdown')
            for (const m of b.text.matchAll(/\(#zeige-([^)]*)\)/g)) expect(Object.keys(uiTargets), `${l.id} / ${s.title}`).toContain(m[1])
  })

  it('macht aus dem Link einen Zeiger und lässt ihn bei den Fachbegriffen aus', () => {
    const root = document.createElement('div')
    root.innerHTML = `<div class="learn-text">${markdownToHTML('Links die [Elemente](#zeige-elemente) und eine Variable.')}</div>`
    markPointers(root)
    markTerms(root, entries)
    expect(root.querySelector('a')).toBeNull()
    expect(root.querySelector<HTMLElement>('.ui-pointer')?.dataset.target).toBe('elemente')
    expect([...root.querySelectorAll('.term')].map((m) => m.textContent)).toEqual(['Variable'])
  })
})

describe('Tabellen im Lektionstext', () => {
  it('wird zu einer HTML-Tabelle', () => {
    const html = markdownToHTML('| Schritt | i |\n|---|---|\n| `i = 1` | 1 |\n| `i++` | 2 |')
    expect(html).toContain('<th>Schritt</th>')
    expect(html).toContain('<td><code>i = 1</code></td><td>1</td>')
    expect(html.match(/<tr>/g)?.length).toBe(3)
  })
})
