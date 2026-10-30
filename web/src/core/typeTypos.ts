/** Vertippte Datentypen erkennen, für den Code-Editor (`javaParser`) und den VisuObject-Debugger (`miniJava`). */

const primitiveTypes = ['boolean', 'int', 'double', 'String', 'char', 'long', 'float', 'short', 'byte']
/** Gültige Java-Typen, die einem Grundtyp ähneln (`Boolean`, `Integer`) und deshalb nie gemeldet werden. */
const validTypes = new Set([...primitiveTypes, 'Boolean', 'Integer', 'Double', 'Character', 'Long', 'Float', 'Short', 'Byte', 'var', 'void'])

/** Vertippter Grundtyp (`booelan`, `Int`, `string`) → richtige Schreibweise; sonst `undefined`. */
export function similarType(word: string): string | undefined {
  if (validTypes.has(word)) return undefined
  const lower = word.toLowerCase()
  for (const type of primitiveTypes) {
    // Kurze Typen nur mit einem Fehler, sonst wäre eine Klasse `Kind` schon ein vertipptes `int`.
    if (typoDistance(lower, type.toLowerCase()) <= (type.length >= 6 ? 2 : 1)) return type
  }
  return undefined
}

/** Tippfehler-Abstand: Buchstabe fehlt, zu viel, falsch oder zwei vertauscht (Damerau-Levenshtein). */
function typoDistance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)))
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
    }
  }
  return d[a.length][b.length]
}
