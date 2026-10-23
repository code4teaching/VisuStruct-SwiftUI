import { entryFor, termPattern, type GlossaryEntry } from '../learn/glossary'

/**
 * Fachbegriffe im Lernbereich: das erste Vorkommen je Schritt wird markiert und zeigt seine Erklärung
 * beim Hovern (Maus), beim Antippen (Tablet) und beim Ansteuern mit der Tastatur.
 */

/** Hier wird nichts markiert: Code, Links, Überschriften, Knöpfe und fett Gesetztes (dort wird der Begriff gerade erklärt). */
const skip = 'code, pre, a, button, h1, h2, h3, h4, strong, .term, .ui-pointer'

/** Markiert in den `.learn-text`-Blöcken unter `root` jeden Begriff höchstens einmal. */
export function markTerms(root: HTMLElement, entries: GlossaryEntry[]) {
  const texts = [...root.querySelectorAll<HTMLElement>('.learn-text')]
  const introduced = new Set<GlossaryEntry>()
  for (const strong of texts.flatMap((t) => [...t.querySelectorAll('strong')])) {
    const pattern = termPattern(entries)
    const found = pattern?.exec(strong.textContent ?? '')
    const entry = found ? entryFor(entries, found[0]) : undefined
    if (entry) introduced.add(entry)
  }
  let open = entries.filter((e) => !introduced.has(e))
  for (const block of texts) {
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT)
    const nodes: Text[] = []
    while (walker.nextNode()) {
      const node = walker.currentNode as Text
      if (!node.parentElement?.closest(skip)) nodes.push(node)
    }
    for (let node of nodes) {
      for (;;) {
        const pattern = termPattern(open)
        const found = pattern?.exec(node.data)
        const entry = found ? entryFor(open, found[0]) : undefined
        if (!found || !entry) break
        const word = node.splitText(found.index)
        node = word.splitText(found[0].length)
        const mark = document.createElement('span')
        mark.className = 'term'
        mark.tabIndex = 0
        mark.setAttribute('role', 'button')
        mark.setAttribute('aria-describedby', 'term-tip')
        mark.dataset.term = entry.term
        mark.dataset.text = entry.text
        word.replaceWith(mark)
        mark.append(word)
        open = open.filter((e) => e !== entry)
      }
    }
  }
}

/** Ein gemeinsames Erklärungsfeld für alle markierten Begriffe in `container`. */
export function attachTermTips(container: HTMLElement) {
  const tip = document.createElement('div')
  tip.id = 'term-tip'
  tip.className = 'term-tip'
  tip.setAttribute('role', 'tooltip')
  tip.hidden = true
  document.body.append(tip)
  let current: HTMLElement | undefined
  let pinned = false

  const show = (term: HTMLElement) => {
    current = term
    tip.replaceChildren()
    const title = document.createElement('strong')
    title.textContent = term.dataset.term ?? ''
    tip.append(title, document.createTextNode(' ' + (term.dataset.text ?? '')))
    tip.hidden = false
    const r = term.getBoundingClientRect()
    const w = tip.offsetWidth
    const ht = tip.offsetHeight
    const left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8))
    const below = r.bottom + 6
    tip.style.left = `${left}px`
    tip.style.top = `${below + ht > window.innerHeight - 8 ? Math.max(8, r.top - ht - 6) : below}px`
    term.setAttribute('aria-expanded', 'true')
  }
  const hide = () => {
    current?.setAttribute('aria-expanded', 'false')
    current = undefined
    pinned = false
    tip.hidden = true
  }
  const termOf = (e: Event) => (e.target as Element | null)?.closest?.<HTMLElement>('.term') ?? undefined

  container.addEventListener('pointerover', (e) => {
    const term = termOf(e)
    if (term && e.pointerType === 'mouse' && !pinned) show(term)
  })
  container.addEventListener('pointerout', (e) => {
    if (termOf(e) && e.pointerType === 'mouse' && !pinned) hide()
  })
  container.addEventListener('click', (e) => {
    const term = termOf(e)
    if (!term) return
    if (pinned && current === term) return hide()
    show(term)
    pinned = true
  })
  container.addEventListener('focusin', (e) => {
    const term = termOf(e)
    if (term && !pinned) show(term)
  })
  container.addEventListener('focusout', (e) => {
    if (termOf(e) && !pinned) hide()
  })
  container.addEventListener('keydown', (e) => {
    const term = termOf(e)
    if (e.key === 'Escape' && current) hide()
    else if (term && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      term.click()
    }
  })
  container.addEventListener('scroll', hide, true)
  document.addEventListener('pointerdown', (e) => {
    if (current && !termOf(e) && !tip.contains(e.target as Node)) hide()
  })
  /** Nach dem Neuzeichnen des Lernbereichs gehört das Feld zu keinem Begriff mehr. */
  return { hide }
}

/**
 * Zeiger auf den Editor: Ein Link `[Elemente](#zeige-elemente)` im Lektionstext hebt beim Hovern oder Antippen
 * den echten Bereich im Editor neben dem Lernbereich hervor.
 */
export const uiTargets: Record<string, string> = {
  leiste: '.topbar > .toolbar',
  werkzeuge: '.diagram-tools',
  // Eingeklappt leuchtet die schmale Leiste, sonst die Spalte.
  dateien: '.files-rail, .files',
  codelive: '.live-rail, .livecode',
  ausfuehren: '[data-run=play]',
  konsole: '.livecode .console',
  elemente: '.palette',
  struktogramm: '.canvas',
  objektinspektor: '.inspector',
  reiter: '.tabs',
  titel: '.caption',
  neu: '[data-action=new]',
  oeffnen: '[data-action=open]',
  speichern: '[data-action=save]',
  exportieren: '[data-action=export]',
  rueckgaengig: '[data-action=undo]',
  // Textgröße und Sprache liegen im Menü hinter dem Zahnrad.
  textgroesse: '[data-action=settings]',
  einstellungen: '[data-action=settings]',
  lernen: '.learn .learn-hide',
  code: '[data-action=code]',
  simulation: '[data-action=simulate]',
}

export function markPointers(root: HTMLElement) {
  for (const a of root.querySelectorAll<HTMLAnchorElement>('a[href^="#zeige-"]')) {
    const key = a.getAttribute('href')!.slice('#zeige-'.length)
    if (!(key in uiTargets)) continue
    const span = document.createElement('span')
    span.className = 'ui-pointer'
    span.tabIndex = 0
    span.setAttribute('role', 'button')
    span.dataset.target = key
    span.append(...a.childNodes)
    a.replaceWith(span)
  }
}

export function attachPointers(container: HTMLElement) {
  let lit: Element | undefined
  let timer: number | undefined
  const off = () => {
    lit?.classList.remove('ui-spot')
    lit = undefined
    window.clearTimeout(timer)
  }
  const on = (pointer: HTMLElement, forAWhile: boolean) => {
    off()
    // Bei mehreren Treffern (Spalte oder eingeklappte Leiste) zählt der sichtbare.
    const target = [...document.querySelectorAll(uiTargets[pointer.dataset.target ?? ''] ?? ':not(*)')].find((el) => el.getClientRects().length > 0)
    if (!target) return
    lit = target
    target.classList.add('ui-spot')
    if (forAWhile) timer = window.setTimeout(off, 2500)
  }
  const pointerOf = (e: Event) => (e.target as Element | null)?.closest?.<HTMLElement>('.ui-pointer') ?? undefined
  container.addEventListener('pointerover', (e) => {
    const p = pointerOf(e)
    if (p && e.pointerType === 'mouse') on(p, false)
  })
  container.addEventListener('pointerout', (e) => {
    if (pointerOf(e) && e.pointerType === 'mouse') off()
  })
  container.addEventListener('click', (e) => {
    const p = pointerOf(e)
    if (p) on(p, true)
  })
  container.addEventListener('focusin', (e) => {
    const p = pointerOf(e)
    if (p) on(p, false)
  })
  container.addEventListener('focusout', (e) => {
    if (pointerOf(e)) off()
  })
  container.addEventListener('keydown', (e) => {
    const p = pointerOf(e)
    if (p && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      on(p, true)
    }
  })
  return { off }
}
