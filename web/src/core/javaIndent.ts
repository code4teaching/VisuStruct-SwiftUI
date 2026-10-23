/**
 * Java-Code einrücken wie Eclipse oder IntelliJ: vier Leerzeichen je Ebene, `case` eine Ebene tiefer als
 * `switch`, die Anweisungen eines klassischen `case …:` noch eine tiefer. Zählt nur Klammern, damit auch
 * halbfertiger Code und Pseudocode wie `if (Alter über 18?)` sauber eingerückt werden.
 */

const unit = '    '

interface Open {
  /** Zeile, in der die Klammer aufgeht: Mehrere Klammern in einer Zeile ergeben nur eine Ebene. */
  line: number
  char: string
  /** `{` eines klassischen `switch`, in dem gerade ein `case …:` offen ist. */
  inCase?: boolean
}

/** Klammern einer Zeile ohne Zeichenketten und Kommentare; `comment` sagt, ob ein Blockkommentar offen bleibt. */
function brackets(text: string, inComment: boolean): { chars: string; comment: boolean } {
  let chars = ''
  let comment = inComment
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (comment) {
      if (c === '*' && text[i + 1] === '/') {
        comment = false
        i++
      }
    } else if (c === '/' && text[i + 1] === '/') break
    else if (c === '/' && text[i + 1] === '*') {
      comment = true
      i++
    } else if (c === '"' || c === "'") {
      for (i++; i < text.length && text[i] !== c; i++) if (text[i] === '\\') i++
    } else if ('{}()[]'.includes(c)) chars += c
  }
  return { chars, comment }
}

/** Ebene: wie viele verschiedene Zeilen noch offene Klammern haben, plus ein offenes `case`. */
function level(stack: Open[]): number {
  let n = 0
  let last = -1
  for (const open of stack) {
    if (open.line !== last) n++
    last = open.line
    if (open.inCase) n++
  }
  return n
}

const caseLabel = /^(case\b|default\b)/
const classicCase = /^(case\b.*|default\s*):\s*(\/\/.*)?$/

/** Zeilen `fromLine`…`toLine` (ab 1) neu einrücken; die übrigen bleiben, wie sie sind. */
export function indentJava(text: string, fromLine = 1, toLine = Number.MAX_SAFE_INTEGER): string {
  const stack: Open[] = []
  let comment = false
  return text
    .split('\n')
    .map((line, i) => {
      const trimmed = line.trim()
      const inComment = comment
      const { chars, comment: stillComment } = brackets(line, comment)
      comment = stillComment
      // Schließende Klammern am Zeilenanfang gehören schon zur äußeren Ebene.
      const lead = inComment ? 0 : (/^[}\])\s]*/.exec(trimmed)![0].match(/[}\])]/g)?.length ?? 0)
      const outer = stack.slice(0, Math.max(0, stack.length - lead))
      if (caseLabel.test(trimmed) && outer.at(-1)?.inCase) outer.at(-1)!.inCase = false
      const depth = level(outer)
      for (const c of chars) {
        if ('{[('.includes(c)) stack.push({ line: i, char: c })
        else stack.pop()
      }
      const top = stack.at(-1)
      if (top?.line === i && top.char === '{' && /^switch\b/.test(trimmed)) top.char = 'switch'
      if (top?.char === 'switch' && classicCase.test(trimmed)) top.inCase = true
      const n = i + 1
      // Zeilen in einem Blockkommentar bleiben, wie sie sind.
      if (n < fromLine || n > toLine || (inComment && !trimmed.startsWith('*'))) return line
      if (trimmed === '') return ''
      return unit.repeat(depth) + (inComment ? ' ' : '') + trimmed
    })
    .join('\n')
}
