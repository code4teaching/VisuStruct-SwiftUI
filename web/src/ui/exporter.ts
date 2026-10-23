import { LayoutEngine, type Metrics } from '../core/layout'
import type { VSDocument } from '../core/model'
import type { MeasureText } from '../core/textMeasurement'
import { diagramFontFamily } from '../core/textMeasurement'
import { t as tr } from './i18n'
import { DiagramRenderer, displayElement, el } from './renderer'

/** Port von `Export/DiagramSnapshotAndExport.swift` und `DiagramExporter.swift`: Bild, PDF und Druck. */

const exportInset = { left: 12, top: 10 }
const exportOuterMargin = 8
const exportPixelCap = 8000
const titleFontSize = 16
const titlePadX = 12
const background = '#fafafa'

/** Wie `exportVisibleDiagramTitle`: leerer Titel → Platzhalter wie im Titelfeld. */
export function exportVisibleDiagramTitle(doc: VSDocument): string {
  const t = doc.caption.trim()
  return t === '' ? tr('diagram_title_placeholder') : t
}

/** Wie `sanitizedExportFilenameSlug` (Stil „Ohne Datum“). */
export function exportFilenameSlug(raw: string): string {
  let s = raw.trim().replace(/\.visustruct$/i, '')
  if (s === '') return ''
  s = s.replace(/\s/g, '-').replace(/[/:\\*?"<>|]/g, '-')
  while (s.includes('--')) s = s.replace(/--/g, '-')
  s = s.replace(/^-+|-+$/g, '')
  if (s.length > 120) s = s.slice(0, 120).replace(/^-+|-+$/g, '')
  return s
}

export function exportFilenameBase(doc: VSDocument, tabTitle: string): string {
  return exportFilenameSlug(doc.caption) || exportFilenameSlug(tabTitle) || 'VisuStruct'
}

/** Titel auf höchstens zwei Zeilen umbrechen (`lineLimit(2)`). */
function wrapTitle(title: string, width: number, measure: MeasureText): string[] {
  const words = title.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const next = line ? `${line} ${w}` : w
    if (line && measure(next, titleFontSize, 'bold') > width) {
      lines.push(line)
      line = w
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  if (lines.length > 2) {
    let last = lines.slice(1).join(' ')
    while (last.length > 1 && measure(last + '…', titleFontSize, 'bold') > width) last = last.slice(0, -1)
    return [lines[0], last + '…']
  }
  return lines
}

export interface ExportImage {
  svg: SVGSVGElement
  width: number
  height: number
}

/**
 * Diagramm mit sichtbarem Titel, ohne Auswahl (gleiche Grundlage für PNG, SVG, PDF und Druck).
 * `minSize` wie in der App 320; die Vorschau im Lernbereich nimmt 0, damit kein Leerraum entsteht.
 */
export function renderExportSVG(doc: VSDocument, metrics: Metrics, measure: MeasureText, minSize = 320): ExportImage | undefined {
  const displayDoc: VSDocument = { ...doc, elements: doc.elements.map(displayElement) }
  const layout = new LayoutEngine(metrics, measure).layout(displayDoc, exportInset)
  const w = Math.min(exportPixelCap, Math.max(minSize, layout.canvasSize.width))
  const h = Math.min(exportPixelCap, Math.max(minSize, layout.canvasSize.height))
  if (w <= 2 || h <= 2) return undefined

  const lines = wrapTitle(exportVisibleDiagramTitle(doc), w - 2 * titlePadX, measure)
  const lineHeight = Math.ceil(titleFontSize * 1.2)
  const titleH = Math.min(56, lines.length * lineHeight + 2)
  const total = titleH + h

  const diagram = new DiagramRenderer(metrics, measure).render(layout, { width: w, height: h }, undefined, exportOuterMargin)
  diagram.setAttribute('y', String(titleH))
  diagram.removeAttribute('class')

  const svg = el('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: w,
    height: total,
    viewBox: `0 0 ${w} ${total}`,
  })
  svg.append(el('rect', { x: 0, y: 0, width: w, height: total, fill: background }))
  const text = el('text', {
    x: titlePadX,
    y: 0,
    'font-family': diagramFontFamily,
    'font-size': titleFontSize,
    'font-weight': 600,
    fill: 'black',
  })
  lines.forEach((line, i) => {
    const span = el('tspan', { x: titlePadX, y: i * lineHeight + titleFontSize })
    span.textContent = line
    text.append(span)
  })
  svg.append(text, diagram)
  return { svg, width: w, height: total }
}

export function svgMarkup(image: ExportImage): string {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(image.svg)
}

/** Rastert das Export-SVG (Faktor wie `displayScale`, begrenzt auf 8000 Pixel pro Seite). */
export async function rasterize(image: ExportImage, scale: number): Promise<HTMLCanvasElement> {
  const s = Math.max(1, Math.min(scale, exportPixelCap / image.width, exportPixelCap / image.height))
  const url = URL.createObjectURL(new Blob([svgMarkup(image)], { type: 'image/svg+xml' }))
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(image.width * s)
    canvas.height = Math.round(image.height * s)
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return canvas
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function canvasToPNG(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG konnte nicht erzeugt werden.'))), 'image/png'),
  )
}

// MARK: - PDF (A4, eine Seite)

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/** Wie `A4SinglePageLayout.pageAndImageDrawRect`: Hoch- oder Querformat, je nachdem, wo das Bild größer wird. */
export function a4PageAndImageRect(imageWidth: number, imageHeight: number): { page: { width: number; height: number }; draw: Rect } {
  const margin = 32
  const fudge = 0.98
  const iw = Math.max(1, imageWidth)
  const ih = Math.max(1, imageHeight)
  const fit = (page: { width: number; height: number }) => {
    const cw = page.width - 2 * margin
    const ch = page.height - 2 * margin
    const s = Math.min(cw / iw, ch / ih) * fudge
    return { s, cw, ch }
  }
  const portrait = { width: 595, height: 842 }
  const landscape = { width: 842, height: 595 }
  const p = fit(portrait)
  const l = fit(landscape)
  const [page, f] = l.s > p.s ? [landscape, l] : [portrait, p]
  const sw = iw * f.s
  const sh = ih * f.s
  return { page, draw: { x: margin + (f.cw - sw) / 2, y: margin + (f.ch - sh) / 2, width: sw, height: sh } }
}

async function deflate(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([data as BlobPart]).stream().pipeThrough(new CompressionStream('deflate'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

/** PDF-Literal-String (UTF-16BE mit BOM, damit Umlaute im Titel stimmen). */
function pdfTextString(s: string): string {
  let hex = 'FEFF'
  for (let i = 0; i < s.length; i++) hex += s.charCodeAt(i).toString(16).padStart(4, '0').toUpperCase()
  return `<${hex}>`
}

/**
 * Einseitiges PDF mit dem Diagramm als verlustfreiem Rasterbild (wie `writeTemporaryDiagramPDF`).
 * `rgb` enthält 3 Byte pro Pixel, Zeile für Zeile von oben.
 */
export async function buildDiagramPDF(rgb: Uint8Array, pixelWidth: number, pixelHeight: number, imageSize: { width: number; height: number }, title: string): Promise<Blob> {
  const { page, draw } = a4PageAndImageRect(imageSize.width, imageSize.height)
  const image = await deflate(rgb)
  const fmt = (n: number) => (Math.round(n * 100) / 100).toString()
  // PDF-Ursprung unten links.
  const content = `q ${fmt(draw.width)} 0 0 ${fmt(draw.height)} ${fmt(draw.x)} ${fmt(page.height - draw.y - draw.height)} cm /Im0 Do Q`
  const enc = new TextEncoder()
  const objects: (string | Uint8Array)[][] = [
    ['<< /Type /Catalog /Pages 2 0 R >>'],
    ['<< /Type /Pages /Kids [3 0 R] /Count 1 >>'],
    [`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${page.width} ${page.height}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`],
    [
      `<< /Type /XObject /Subtype /Image /Width ${pixelWidth} /Height ${pixelHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${image.length} >>\nstream\n`,
      image,
      '\nendstream',
    ],
    [`<< /Length ${content.length} >>\nstream\n${content}\nendstream`],
    [`<< /Creator ${pdfTextString('VisuStruct')} /Title ${pdfTextString(title)} >>`],
  ]
  const parts: Uint8Array[] = []
  let offset = 0
  const push = (p: string | Uint8Array) => {
    const bytes = typeof p === 'string' ? enc.encode(p) : p
    parts.push(bytes)
    offset += bytes.length
  }
  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')
  const offsets: number[] = []
  objects.forEach((obj, i) => {
    offsets.push(offset)
    push(`${i + 1} 0 obj\n`)
    obj.forEach(push)
    push('\nendobj\n')
  })
  const xref = offset
  push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`)
  for (const o of offsets) push(`${String(o).padStart(10, '0')} 00000 n \n`)
  push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info ${objects.length} 0 R >>\nstartxref\n${xref}\n%%EOF\n`)
  return new Blob(parts as BlobPart[], { type: 'application/pdf' })
}

export function canvasRGB(canvas: HTMLCanvasElement): Uint8Array {
  const { data } = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height)
  const rgb = new Uint8Array(canvas.width * canvas.height * 3)
  for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
    rgb[j] = data[i]
    rgb[j + 1] = data[i + 1]
    rgb[j + 2] = data[i + 2]
  }
  return rgb
}
