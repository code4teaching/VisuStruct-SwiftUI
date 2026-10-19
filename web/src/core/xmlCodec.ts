import { decodeJavaString, encodeJavaString } from './javaStringCoding'
import { ElementType, type RGBA, type VSCase, type VSDocument, type VSElement } from './model'

/** XML <-> Modell, kompatibel zu `VisuStructXMLCodec.swift` und Java `XMLLeser`/`Struktogramm.xmlErstellen`. */
export class VisuStructXMLError extends Error {}

export function decodeDocument(xml: string): VSDocument {
  const dom = new DOMParser().parseFromString(xml, 'application/xml')
  if (dom.getElementsByTagName('parsererror').length > 0) {
    throw new VisuStructXMLError('Could not read XML.')
  }
  const root = dom.documentElement
  if (!root || root.tagName !== 'struktogramm') {
    throw new VisuStructXMLError('Invalid XML: root element is not <struktogramm>.')
  }
  const doc: VSDocument = {
    caption: decodeAttr(root, 'caption') ?? '',
    elements: decodeList(root),
  }
  const fontFamily = decodeAttr(root, 'fontfamily')
  if (fontFamily !== undefined) doc.fontFamily = fontFamily
  const fontSize = intAttr(root, 'fontsize')
  if (fontSize !== undefined) doc.fontSize = fontSize
  const fontStyle = intAttr(root, 'fontstyle')
  if (fontStyle !== undefined) doc.fontStyle = fontStyle
  return doc
}

export function encodeDocument(doc: VSDocument): string {
  const attr = (k: string, v: string | undefined) => (v === undefined ? '' : ` ${k}="${escapeAttr(v)}"`)
  let out = '<?xml version="1.0" encoding="UTF-8"?>\n'
  out += '<struktogramm'
  out += attr('fontfamily', doc.fontFamily === undefined ? undefined : encodeJavaString(doc.fontFamily))
  out += attr('fontstyle', doc.fontStyle === undefined ? undefined : String(doc.fontStyle))
  out += attr('fontsize', doc.fontSize === undefined ? undefined : String(doc.fontSize))
  out += attr('caption', encodeJavaString(doc.caption))
  out += '>\n'
  for (const e of doc.elements) out += encodeElement(e, '  ')
  out += '</struktogramm>\n'
  return out
}

// MARK: - Encoding

function encodeElement(e: VSElement, indent: string): string {
  let out = `${indent}<strelem typ="${e.type}" zx="${e.zoomX}" zy="${e.zoomY}"`
  if (e.textColor) out += ` textcolor="${javaColorIntString(e.textColor)}"`
  if (e.backgroundColor) out += ` bgcolor="${javaColorIntString(e.backgroundColor)}"`
  out += '>\n'
  for (const line of e.textLines) {
    out += `${indent}  <text>${escapeText(encodeJavaString(line))}</text>\n`
  }
  if (e.loopBody) {
    out += `${indent}  <schleifeninhalt>\n`
    for (const child of e.loopBody) out += encodeElement(child, indent + '    ')
    out += `${indent}  </schleifeninhalt>\n`
  }
  if (e.cases) {
    for (const c of e.cases) {
      out += `${indent}  <fall fallname="${escapeAttr(encodeJavaString(c.name))}">\n`
      for (const child of c.elements) out += encodeElement(child, indent + '    ')
      out += `${indent}  </fall>\n`
    }
  }
  out += `${indent}</strelem>\n`
  return out
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeText(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Java speichert `Color.getRGB()` als dezimalen, vorzeichenbehafteten 32-bit-ARGB-Int. */
function javaColorIntString(c: RGBA): string {
  return String(((c.a << 24) | (c.r << 16) | (c.g << 8) | c.b) | 0)
}

// MARK: - Decoding

function childElements(parent: Element, tag: string): Element[] {
  return Array.from(parent.children).filter((c) => c.tagName === tag)
}

function decodeList(parent: Element): VSElement[] {
  const out: VSElement[] = []
  for (const node of childElements(parent, 'strelem')) {
    const e = decodeElement(node)
    if (e) out.push(e)
  }
  return out
}

function decodeElement(node: Element): VSElement | undefined {
  const typ = intAttr(node, 'typ')
  if (typ === undefined || ElementType[typ] === undefined) return undefined

  const e: VSElement = {
    type: typ as ElementType,
    zoomX: intAttr(node, 'zx') ?? 0,
    zoomY: intAttr(node, 'zy') ?? 0,
    textLines: childElements(node, 'text').map((t) => decodeJavaString((t.textContent ?? '').trim())),
  }
  const textColor = parseJavaARGB(node.getAttribute('textcolor'))
  if (textColor) e.textColor = textColor
  const bgColor = parseJavaARGB(node.getAttribute('bgcolor'))
  if (bgColor) e.backgroundColor = bgColor
  if (e.textLines.length === 0) e.textLines = ['']

  const loop = childElements(node, 'schleifeninhalt')[0]
  if (loop) {
    const body = decodeList(loop)
    if (body.length > 0) e.loopBody = body
  }
  const cases: VSCase[] = childElements(node, 'fall').map((f) => ({
    name: decodeJavaString(f.getAttribute('fallname') ?? ''),
    elements: decodeList(f),
  }))
  if (cases.length > 0) e.cases = cases
  return e
}

function decodeAttr(node: Element, name: string): string | undefined {
  const v = node.getAttribute(name)
  return v === null ? undefined : decodeJavaString(v)
}

function intAttr(node: Element, name: string): number | undefined {
  const v = node.getAttribute(name)
  if (v === null || !/^[+-]?\d+$/.test(v)) return undefined
  return Number(v)
}

function parseJavaARGB(s: string | null): RGBA | undefined {
  if (s === null || !/^[+-]?\d+$/.test(s)) return undefined
  const i = Number(s)
  if (i < -0x80000000 || i > 0x7fffffff) return undefined
  const u = i >>> 0
  return { a: (u >>> 24) & 0xff, r: (u >>> 16) & 0xff, g: (u >>> 8) & 0xff, b: u & 0xff }
}
