/** Kleines Markdown für Lektionstexte: Absätze, ## bis ####, Listen, Zitat als Hinweis, Code, Tabellen, **fett**, *kursiv*, `code`, [Link](url),
 * [Wort]{.blau} als farbige Markierung (blau, orange, gruen) passend zu farbigen Kästen, [Wort]{teil=cyberpi} zeigt auf ein Teil des mBot2. */

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function inline(text: string): string {
  const codes: string[] = []
  let s = escape(text).replace(/`([^`]+)`/g, (_, c: string) => {
    codes.push(c)
    return `\u0000${codes.length - 1}\u0000`
  })
  s = s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label: string, url: string) => {
      const safe = /^(https?:|mailto:|#|\.{0,2}\/)/.test(url) ? url : '#'
      const external = /^https?:/.test(safe) ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${safe}"${external}>${label}</a>`
    })
    .replace(/\[([^\]]+)\]\{\.(blau|orange|gruen)\}/g, '<mark class="learn-mark $2">$1</mark>')
    // VisuBot: [Ultraschallsensor]{teil=ultrasonic} leuchtet im 3D-Modell auf, wenn man darauf zeigt.
    .replace(/\[([^\]]+)\]\{(?:teil|part)=([\w,]+)\}/g, '<span class="robot-part-link" data-robot-part="$2" tabindex="0">$1</span>')
  return s.replace(/\u0000(\d+)\u0000/g, (_, i: string) => `<code>${codes[Number(i)]}</code>`)
}

export function markdownToHTML(source: string): string {
  const out: string[] = []
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === '') {
      i++
      continue
    }
    if (line.startsWith('```')) {
      const java = line.slice(3).trim() === 'java'
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++])
      i++
      out.push(`<pre class="lesson-code"${java ? ' data-lang="java"' : ''} dir="ltr"><code>${escape(code.join('\n'))}</code></pre>`)
      continue
    }
    const heading = /^(#{2,4})\s+(.*)$/.exec(line)
    if (heading) {
      const level = heading[1].length
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`)
      i++
      continue
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line)
      const items: string[] = []
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        let item = lines[i].replace(/^\s*([-*]|\d+\.)\s+/, '')
        i++
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*]|\d+\.)\s+/.test(lines[i])) item += ' ' + lines[i++].trim()
        items.push(`<li>${inline(item)}</li>`)
      }
      out.push(ordered ? `<ol>${items.join('')}</ol>` : `<ul>${items.join('')}</ul>`)
      continue
    }
    if (line.startsWith('|') && /^\|?[\s:|-]*-{3,}[\s:|-]*$/.test(lines[i + 1] ?? '')) {
      const cells = (row: string) => row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => inline(c.trim()))
      const head = cells(line)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && lines[i].startsWith('|')) rows.push(cells(lines[i++]))
      out.push(
        `<div class="lesson-table"><table><thead><tr>${head.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows
          .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
          .join('')}</tbody></table></div>`,
      )
      continue
    }
    if (line.startsWith('>')) {
      const quote: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) quote.push(lines[i++].replace(/^>\s?/, ''))
      out.push(`<aside class="lesson-note">${markdownToHTML(quote.join('\n'))}</aside>`)
      continue
    }
    const para: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(```|#{3,4}\s|>|\||\s*([-*]|\d+\.)\s+)/.test(lines[i])
    ) {
      para.push(lines[i++].trim())
    }
    out.push(`<p>${inline(para.join(' '))}</p>`)
  }
  return out.join('\n')
}
