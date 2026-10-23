/** Breitenmessung für Layout und Zeichnen — gleiche Systemschrift wie `DiagramCanvasView` (`.medium` / `.bold`). */
export type FontWeight = 'medium' | 'bold'
export type MeasureText = (text: string, fontSize: number, weight: FontWeight) => number

export const diagramFontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'

export function fontCSS(fontSize: number, weight: FontWeight): string {
  return `${weight === 'bold' ? 700 : 500} ${fontSize}px ${diagramFontFamily}`
}

/** Fallback ohne Browser (Tests): wie der `#else`-Zweig in `VisuStructLayoutTextMeasurement.swift`. */
export const approximateMeasure: MeasureText = (text, fontSize, weight) =>
  [...text].length * fontSize * (weight === 'bold' ? 0.68 : 0.62)

/**
 * Unsichtbares SVG-Textelement: misst mit genau der Schrift, mit der das Diagramm gezeichnet wird.
 * Safari löst `system-ui` im Canvas anders auf als im SVG; Canvas-Breiten passten dort nicht zum Bild.
 */
function probeText(): SVGTextElement | undefined {
  if (typeof document === 'undefined' || !document.body) return undefined
  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;overflow:hidden'
  const text = document.createElementNS(ns, 'text')
  text.setAttribute('font-family', diagramFontFamily)
  text.style.whiteSpace = 'pre'
  svg.append(text)
  document.body.append(svg)
  if (typeof text.getComputedTextLength !== 'function' || typeof text.getBBox !== 'function') {
    svg.remove()
    return undefined
  }
  text.textContent = 'Mg'
  text.setAttribute('font-size', '20')
  if (!(text.getComputedTextLength() > 0)) {
    svg.remove()
    return undefined
  }
  return text
}

let probe: SVGTextElement | null | undefined

function sharedProbe(): SVGTextElement | undefined {
  if (probe === undefined) probe = probeText() ?? null
  return probe ?? undefined
}

function setProbeFont(text: SVGTextElement, fontSize: number, weight: FontWeight) {
  text.setAttribute('font-size', String(fontSize))
  text.setAttribute('font-weight', weight === 'bold' ? '700' : '500')
}

/** Ober- und Unterlänge der Diagrammschrift (für Text, der oben oder unten an einer Linie sitzt). */
export function fontExtents(fontSize: number, weight: FontWeight): { ascent: number; descent: number } {
  const key = `${fontSize}|${weight}`
  let e = extentsCache.get(key)
  if (!e) {
    const text = sharedProbe()
    e = { ascent: fontSize * 0.95, descent: fontSize * 0.24 }
    if (text) {
      setProbeFont(text, fontSize, weight)
      text.setAttribute('y', '0')
      text.textContent = 'Mg'
      const box = text.getBBox()
      if (box.height > 0) e = { ascent: -box.y, descent: box.height + box.y }
    }
    extentsCache.set(key, e)
  }
  return e
}
const extentsCache = new Map<string, { ascent: number; descent: number }>()

export function createCanvasMeasure(): MeasureText {
  const svgText = sharedProbe()
  if (svgText) {
    const cache = new Map<string, number>()
    return (text, fontSize, weight) => {
      const key = `${fontSize}|${weight}|${text}`
      let w = cache.get(key)
      if (w === undefined) {
        setProbeFont(svgText, fontSize, weight)
        svgText.textContent = text
        w = text === '' ? 0 : svgText.getComputedTextLength()
        if (cache.size > 2000) cache.clear()
        cache.set(key, w)
      }
      return w
    }
  }
  const ctx = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null
  if (!ctx) return approximateMeasure
  const cache = new Map<string, number>()
  return (text, fontSize, weight) => {
    const key = `${fontSize}|${weight}|${text}`
    let w = cache.get(key)
    if (w === undefined) {
      ctx.font = fontCSS(fontSize, weight)
      w = ctx.measureText(text).width
      if (cache.size > 2000) cache.clear()
      cache.set(key, w)
    }
    return w
  }
}
