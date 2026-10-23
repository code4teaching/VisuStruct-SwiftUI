/** Java `XMLLeser.encodeS/decodeS`: Unicode-Codepoints als `;`-getrennte Zahlen. */
export function encodeJavaString(s: string): string {
  if (s === '') return '-1;'
  let out = ''
  for (const ch of s) out += ch.codePointAt(0)! + ';'
  return out
}

export function decodeJavaString(coded: string): string {
  const parts = coded.split(';').filter((p) => p !== '')
  if (parts.length === 1 && parts[0] === '-1') return ''
  let out = ''
  for (const p of parts) {
    if (!/^[+-]?\d+$/.test(p)) continue
    const i = Number(p)
    // Java: -1 => leere Zeile
    if (i === -1) continue
    // Wie Swift `UnicodeScalar(i)`: keine Surrogate, nichts außerhalb des Unicode-Bereichs.
    if (i < 0 || i > 0x10ffff || (i >= 0xd800 && i <= 0xdfff)) continue
    out += String.fromCodePoint(i)
  }
  return out
}
