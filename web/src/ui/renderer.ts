import { canvasTextLines, keywordSplit } from '../core/diagramText'
import type { Layout, LayoutNode, Metrics, Rect } from '../core/layout'
import { ElementType, type VSElement } from '../core/model'
import { diagramFontFamily, type MeasureText } from '../core/textMeasurement'

/** SVG-Port von `DiagramCanvasRenderer.swift` (Kacheln, Linien, Text). */

const SVG_NS = 'http://www.w3.org/2000/svg'

/** `DiagramCanvasInk` (bei Diagramm-Stufe „klein“, Faktor 1). */
const Ink = {
  diagramLineWidth: 2,
  outerFrameLineWidth: 2,
  selectionLineWidth: 3.5,
  canvasOuterMargin: 16,
  cellTextInsetX: 18,
  cellTextInsetY: 15,
  multiHeaderFirstLineY: 14,
  branchLabelInsetX: 10,
  fallauswahlCaseLabelBand: 26,
  callSideBarInset: 14,
  callTextInsetFromSideBar: 20,
  loopBodyLeadingInset: 20,
}

type Omission = { top?: boolean; left?: boolean; bottom?: boolean; right?: boolean }

export function el<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(SVG_NS, tag)
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v))
  return e
}

export class DiagramRenderer {
  constructor(
    private metrics: Metrics,
    private measure: MeasureText,
  ) {}

  private get lineHeight() {
    return this.metrics.lineHeight
  }
  private get fontSize() {
    return this.metrics.fontSize
  }

  /** Im Simulationsmodus bedeutet die Markierung „aktueller Schritt“ statt Bearbeitungsauswahl. */
  usesSimulationHighlight = false

  render(layout: Layout, size: { width: number; height: number }, selectedPath?: number[]): SVGSVGElement {
    const svg = el('svg', {
      width: size.width,
      height: size.height,
      viewBox: `0 0 ${size.width} ${size.height}`,
      'font-family': diagramFontFamily,
      'font-size': this.fontSize,
      class: 'diagram',
    })
    svg.append(el('rect', { x: 0, y: 0, width: size.width, height: size.height, fill: '#fafafa' }))
    const m = Ink.canvasOuterMargin
    svg.append(
      el('rect', {
        x: m,
        y: m,
        width: layout.canvasSize.width - 2 * m - 1,
        height: layout.canvasSize.height - 2 * m - 1,
        fill: 'none',
        stroke: 'black',
        'stroke-width': Ink.outerFrameLineWidth,
      }),
    )
    const g = el('g')
    for (const n of layout.elements) this.drawNode(n, g, selectedPath, {}, undefined)
    svg.append(g)
    return svg
  }

  private line(g: SVGElement, points: [number, number][]) {
    g.append(
      el('polyline', {
        points: points.map((p) => p.join(',')).join(' '),
        fill: 'none',
        stroke: 'black',
        'stroke-width': Ink.diagramLineWidth,
        'stroke-linejoin': 'miter',
      }),
    )
  }

  private strokeCellBorder(g: SVGElement, r: Rect, o: Omission) {
    const x0 = r.x
    const y0 = r.y
    const x1 = r.x + r.width
    const y1 = r.y + r.height
    if (!o.top && !o.left && !o.bottom && !o.right) {
      g.append(el('rect', { x: x0, y: y0, width: r.width, height: r.height, fill: 'none', stroke: 'black', 'stroke-width': Ink.diagramLineWidth }))
      return
    }
    if (!o.top) this.line(g, [[x0, y0], [x1, y0]])
    if (!o.right) this.line(g, [[x1, y0], [x1, y1]])
    if (!o.bottom) this.line(g, [[x1, y1], [x0, y1]])
    if (!o.left) this.line(g, [[x0, y1], [x0, y0]])
  }

  private textWidth(line: string): number {
    const parts = keywordSplit(line)
    if (parts) {
      const kw = this.measure(parts.keyword, this.fontSize, 'bold')
      return kw + (parts.rest === '' ? 0 : this.measure(' ' + parts.rest, this.fontSize, 'medium'))
    }
    return this.measure(line, this.fontSize, 'medium')
  }

  /** Zeile mit fett gedrucktem Schlüsselwort, Ursprung oben links (`anchor: .topLeading`). */
  private drawKeywordLine(g: SVGElement, line: string, x: number, y: number) {
    const t = el('text', { x, y, 'dominant-baseline': 'text-before-edge', 'font-weight': 500 })
    t.style.whiteSpace = 'pre'
    const parts = keywordSplit(line)
    if (parts) {
      const kw = el('tspan', { 'font-weight': 700 })
      kw.textContent = parts.keyword
      t.append(kw)
      if (parts.rest !== '') {
        const rest = el('tspan', { x: x + this.measure(parts.keyword, this.fontSize, 'bold') })
        rest.textContent = ' ' + parts.rest
        t.append(rest)
      }
    } else {
      t.textContent = line
    }
    g.append(t)
  }

  private drawLabel(g: SVGElement, text: string, x: number, y: number, bold: boolean, baseline: 'top' | 'bottom') {
    const t = el('text', {
      x,
      y,
      'dominant-baseline': baseline === 'top' ? 'text-before-edge' : 'text-after-edge',
      'font-weight': bold ? 700 : 500,
    })
    t.style.whiteSpace = 'pre'
    t.textContent = text
    g.append(t)
  }

  private roofMetrics(node: LayoutNode, r: Rect, headerH: number, dividerX: number) {
    const roofBottom = r.y + headerH
    const yInset = node.dividerYInset ?? 0
    const apexPadding = 12
    const blockH = Math.max(node.element.textLines.length, 1) * this.lineHeight
    const topStart = r.y + Ink.multiHeaderFirstLineY
    if (node.element.type === ElementType.fallauswahl) {
      const caseBand = Math.max(Ink.fallauswahlCaseLabelBand, this.lineHeight + 10)
      const titleBottomLimit = roofBottom - caseBand
      const apexY = Math.min(roofBottom + yInset, titleBottomLimit - 8)
      const apexClampedY = Math.max(apexY, topStart + blockH + 6)
      return { apex: { x: dividerX, y: apexClampedY }, maxTextBottom: titleBottomLimit - apexPadding, roofBottom }
    }
    const apex = { x: dividerX, y: roofBottom + yInset }
    return { apex, maxTextBottom: apex.y - apexPadding, roofBottom }
  }

  private drawNode(node: LayoutNode, g: SVGElement, selectedPath: number[] | undefined, omission: Omission, parentType?: ElementType) {
    const r = node.frame
    const e = node.element
    const maxX = r.x + r.width
    const maxY = r.y + r.height
    const isMulti = e.type === ElementType.verzweigung || e.type === ElementType.fallauswahl
    const headerH = isMulti ? node.headerBandHeight : 0
    const isSelected = selectedPath !== undefined && samePath(node.idPath, selectedPath)
    const lines = canvasTextLines(e)

    const cell = el('g', { 'data-path': node.idPath.join(',') })
    g.append(cell)
    const sim = this.usesSimulationHighlight
    const fill = isSelected && sim ? 'rgba(199, 230, 255, 0.55)' : 'white'
    cell.append(el('rect', { x: r.x, y: r.y, width: r.width, height: r.height, fill }))
    this.strokeCellBorder(cell, r, omission)

    const bar = Ink.callSideBarInset
    if (e.type === ElementType.aufruf) {
      this.line(cell, [[r.x + bar, r.y], [r.x + bar, maxY]])
      this.line(cell, [[maxX - bar, r.y], [maxX - bar, maxY]])
    } else if (e.type === ElementType.aussprung) {
      this.line(cell, [[r.x + bar, r.y], [r.x, r.y + r.height / 2], [r.x + bar, maxY]])
    }

    if (isMulti && node.dividerX !== undefined) {
      const dividerX = node.dividerX
      const roof = this.roofMetrics(node, r, headerH, dividerX)
      const blockH = Math.max(lines.length, 1) * this.lineHeight
      const topStart = r.y + Ink.multiHeaderFirstLineY
      this.line(cell, [[r.x, r.y], [roof.apex.x, roof.apex.y], [maxX, r.y]])
      if (e.type === ElementType.fallauswahl) this.line(cell, [[r.x, roof.roofBottom], [maxX, roof.roofBottom]])

      let firstY: number
      if (topStart + blockH <= roof.maxTextBottom) firstY = topStart
      else firstY = Math.max(r.y + 2, roof.maxTextBottom - (Math.max(lines.length, 1) - 1) * this.lineHeight - this.lineHeight)
      lines.forEach((line, i) => {
        const tw = this.textWidth(line)
        let tx: number
        if (e.type === ElementType.verzweigung) {
          const lo = r.x + Ink.cellTextInsetX
          const hi = maxX - tw - Ink.cellTextInsetX
          tx = Math.min(Math.max(dividerX - tw / 2, lo), hi)
        } else {
          tx = r.x + r.width / 2 - tw / 2
        }
        this.drawKeywordLine(cell, line, tx, firstY + i * this.lineHeight)
      })
    } else if (e.type === ElementType.doUntilSchleife) {
      // „do“ und Fuß werden nach den Kindern gezeichnet.
    } else if (e.type === ElementType.anweisung || e.type === ElementType.aufruf || e.type === ElementType.aussprung) {
      const ix = Ink.cellTextInsetX
      let contentLeft = r.x + ix
      let contentRight = maxX - ix
      if (e.type === ElementType.aufruf) {
        contentLeft = r.x + bar + Ink.callTextInsetFromSideBar
        contentRight = maxX - bar - Ink.callTextInsetFromSideBar
      } else if (e.type === ElementType.aussprung) {
        contentLeft = r.x + bar + ix
      }
      const contentWidth = Math.max(0, contentRight - contentLeft)
      let y = r.y + r.height / 2 - (Math.max(1, lines.length) * this.lineHeight) / 2
      for (const line of lines) {
        this.drawKeywordLine(cell, line, contentLeft + (contentWidth - this.textWidth(line)) / 2, y)
        y += this.lineHeight
      }
    } else {
      const total = Math.max(1, lines.length) * this.lineHeight
      let y = parentType === ElementType.doUntilSchleife ? r.y + r.height / 2 - total / 2 : r.y + Ink.cellTextInsetY
      for (const line of lines) {
        this.drawKeywordLine(cell, line, r.x + Ink.cellTextInsetX, y)
        y += this.lineHeight
      }
    }

    node.children.forEach((c, idx) => {
      const childOmission: Omission = e.type === ElementType.doUntilSchleife && idx === 0 ? { top: true, left: true } : {}
      this.drawNode(c, g, selectedPath, childOmission, e.type)
    })

    // Ab hier über den Kindern zeichnen.
    const over = el('g')
    g.append(over)

    if (e.type === ElementType.doUntilSchleife) {
      const dividerX = node.children[0]?.frame.x ?? r.x + (node.loopBodyLeadingInset > 0 ? node.loopBodyLeadingInset : Ink.loopBodyLeadingInset)
      this.drawLabel(over, 'do', r.x + 4, r.y + this.metrics.doUntilDoLabelTopInset, true, 'top')
      const ySep = maxY - node.headerBandHeight
      this.line(over, [[dividerX, ySep], [maxX, ySep]])
      this.line(over, [[dividerX, r.y], [dividerX, ySep]])
      let y = ySep + this.metrics.doUntilFooterTopInset
      for (const line of lines) {
        this.drawKeywordLine(over, line, r.x + Ink.cellTextInsetX, y)
        y += this.lineHeight
      }
    }

    if (isMulti && node.dividerX !== undefined && node.caseColumnFrames.length > 1) {
      const roof = this.roofMetrics(node, r, headerH, node.dividerX)
      const apex = roof.apex
      node.caseColumnFrames.forEach((col, idx) => {
        if (idx >= node.caseColumnFrames.length - 1) return
        const xSep = col.x + col.width
        const yRaw = yOnHeaderDiagonal(xSep, r, apex)
        const yTop = Number.isFinite(yRaw) ? Math.min(Math.max(yRaw, r.y), maxY) : r.y
        this.line(over, [[xSep, maxY], [xSep, yTop]])
      })
      const cases = e.cases
      if (cases && cases.length === node.caseColumnFrames.length) {
        const labelY = e.type === ElementType.fallauswahl ? roof.roofBottom - 6 : r.y + headerH - 8
        const lx = Ink.branchLabelInsetX
        if (e.type === ElementType.verzweigung && cases.length === 2) {
          this.drawLabel(over, 'true', r.x + lx, labelY, true, 'bottom')
          const right = node.caseColumnFrames[1]
          const rw = this.measure('false', this.fontSize, 'bold')
          this.drawLabel(over, 'false', right.x + right.width - lx - rw, labelY, true, 'bottom')
        } else {
          cases.forEach((c, idx) => {
            const col = node.caseColumnFrames[idx]
            const bold = ['default', 'true', 'false'].includes(c.name.toLowerCase())
            const tw = this.measure(c.name, this.fontSize, bold ? 'bold' : 'medium')
            this.drawLabel(over, c.name, col.x + col.width / 2 - tw / 2, labelY, bold, 'bottom')
          })
        }
      }
    }

    if (isSelected) {
      over.append(
        el('rect', {
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
          fill: 'none',
          stroke: sim ? 'rgba(66, 140, 242, 0.78)' : 'rgba(0, 122, 255, 0.9)',
          'stroke-width': Ink.selectionLineWidth,
        }),
      )
    }
  }
}

function yOnHeaderDiagonal(xSep: number, rect: Rect, apex: { x: number; y: number }): number {
  const topY = rect.y
  if (xSep <= apex.x) {
    const run = apex.x - rect.x
    if (Math.abs(run) < 0.5) return apex.y
    return topY + ((apex.y - topY) / run) * (xSep - rect.x)
  }
  const run = rect.x + rect.width - apex.x
  if (Math.abs(run) < 0.5) return apex.y
  return apex.y + ((topY - apex.y) / run) * (xSep - apex.x)
}

export function samePath(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

/** Alle Knoten in Zeichenreihenfolge (Eltern vor Kindern). */
export function flattenNodes(nodes: LayoutNode[]): LayoutNode[] {
  const out: LayoutNode[] = []
  const walk = (n: LayoutNode) => {
    out.push(n)
    n.children.forEach(walk)
  }
  nodes.forEach(walk)
  return out
}

/** Wie `displayDocumentForLayout`: Layout rechnet mit den angezeigten Zeilen (Schlüsselwörter, Platzhalter). */
export function displayElement(e: VSElement): VSElement {
  return {
    ...e,
    textLines: canvasTextLines(e),
    loopBody: e.loopBody?.map(displayElement),
    cases: e.cases?.map((c) => ({ name: c.name, elements: c.elements.map(displayElement) })),
  }
}
