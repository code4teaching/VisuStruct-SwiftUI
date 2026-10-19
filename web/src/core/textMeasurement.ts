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

export function createCanvasMeasure(): MeasureText {
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
