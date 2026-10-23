import { ElementType, type VSDocument, type VSElement } from './model'
import { approximateMeasure, type MeasureText } from './textMeasurement'

/**
 * Port von `VisuStructLayout.swift` / `VisuStructLayoutEngineMetrics.swift` (Näherung an das Java-Layout).
 * Die Struktur folgt bewusst dem Swift-Code, damit Änderungen dort leicht nachgezogen werden können.
 */

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface LayoutNode {
  /** Stabiler Pfad im Baum (für Auswahl und Bearbeitung). */
  idPath: number[]
  element: VSElement
  frame: Rect
  /** Höhe des Kopfbands (Verzweigung/Fallauswahl), bzw. Fuß bei Do-Until. */
  headerBandHeight: number
  topBandHeight: number
  loopBodyLeadingInset: number
  caseColumnFrames: Rect[]
  dividerX?: number
  dividerYInset?: number
  /** Verzweigung/Fallauswahl: Kinder pro Spalte. */
  columns?: LayoutNode[][]
  children: LayoutNode[]
}

export interface Layout {
  canvasSize: { width: number; height: number }
  elements: LayoutNode[]
}

export interface Metrics {
  fontSize: number
  lineHeight: number
  charWidth: number
  baseHeaderExtra: number
  minSidePadding: number
  cellTextInsetY: number
  doUntilDoLabelTopInset: number
  doUntilFooterTopInset: number
  doUntilFooterBottomInset: number
}

const defaultMetrics: Metrics = {
  fontSize: 15,
  lineHeight: 20,
  charWidth: 7,
  baseHeaderExtra: 20,
  minSidePadding: 42,
  cellTextInsetY: 15,
  doUntilDoLabelTopInset: 2,
  doUntilFooterTopInset: 6,
  doUntilFooterBottomInset: 8,
}

/** Gleiche Typometrie wie in der iOS-`DiagramCanvasView`. */
export function diagramDisplayMetrics(isRegularWidth: boolean): Metrics {
  const dF = 2
  const dLH = 5
  if (isRegularWidth) {
    const fontSize = 12 + dF
    return {
      ...defaultMetrics,
      fontSize,
      lineHeight: 16 + dLH,
      charWidth: 5.5 * (fontSize / 12),
      baseHeaderExtra: 16 + dLH,
      minSidePadding: 40,
    }
  }
  const b = defaultMetrics
  const fontSize = b.fontSize + dF
  return {
    ...defaultMetrics,
    fontSize,
    lineHeight: b.lineHeight + dLH,
    charWidth: b.charWidth * (fontSize / b.fontSize),
    baseHeaderExtra: b.baseHeaderExtra + 2,
    minSidePadding: b.minSidePadding + 8,
  }
}

export function scaleMetrics(m: Metrics, factor: number): Metrics {
  if (factor <= 0 || Math.abs(factor - 1) <= 1e-6) return m
  const out = { ...m }
  for (const k of Object.keys(out) as (keyof Metrics)[]) out[k] = m[k] * factor
  return out
}

const isLoopType = (t: ElementType) =>
  t === ElementType.forSchleife ||
  t === ElementType.whileSchleife ||
  t === ElementType.doUntilSchleife ||
  t === ElementType.endlosschleife

const isMultiType = (t: ElementType) => t === ElementType.fallauswahl || t === ElementType.verzweigung

function newNode(idPath: number[], element: VSElement, frame: Rect, headerBandHeight = 0): LayoutNode {
  return {
    idPath,
    element,
    frame,
    headerBandHeight,
    topBandHeight: 0,
    loopBodyLeadingInset: 0,
    caseColumnFrames: [],
    children: [],
  }
}

/** Flache Kopie mit eigenem `frame` (Swift-Structs sind Werttypen). */
function copy(n: LayoutNode): LayoutNode {
  return { ...n, frame: { ...n.frame } }
}

export class LayoutEngine {
  constructor(
    public metrics: Metrics = defaultMetrics,
    private measure: MeasureText = approximateMeasure,
  ) {}

  layout(document: VSDocument, inset: { left: number; top: number } = { left: 28, top: 28 }): Layout {
    const rawNodes = this.layoutList(document.elements, inset.left, inset.top, [])
    const nodes = rawNodes.map((n) => this.stretchLoopBodiesVertically(n))
    let maxX = 0
    let maxY = 0
    const walk = (n: LayoutNode) => {
      maxX = Math.max(maxX, n.frame.x + n.frame.width)
      maxY = Math.max(maxY, n.frame.y + n.frame.height)
      n.children.forEach(walk)
    }
    nodes.forEach(walk)
    return { canvasSize: { width: maxX + inset.left, height: maxY + inset.top }, elements: nodes }
  }

  private lineWidth(text: string): number {
    return Math.ceil(this.measure(text, this.metrics.fontSize, 'medium'))
  }

  private lineWidthBold(text: string): number {
    return Math.ceil(this.measure(text, this.metrics.fontSize, 'bold'))
  }

  private layoutList(elements: VSElement[], x: number, y: number, idBase: number[]): LayoutNode[] {
    let out: LayoutNode[] = []
    let curY = y
    elements.forEach((e, i) => {
      const node = this.layoutElement(e, x, curY, [...idBase, i])
      out.push(node)
      curY += node.frame.height
    })
    // Alle Nodes auf gleiche Breite wie die breiteste (Java: `breiteDerUnterelementeSetzen`).
    const maxW = Math.max(0, ...out.map((n) => n.frame.width))
    if (maxW > 0) out = out.map((n) => this.stretchNodeTreeToWidth(n, maxW))
    return out
  }

  private stretchMultiwayNodeToWidth(node: LayoutNode, newWidth: number): LayoutNode {
    const n = copy(node)
    const oldW = n.frame.width
    if (!(oldW > 0) || n.caseColumnFrames.length === 0) return n
    const scale = newWidth / oldW
    n.frame.width = newWidth
    let xCursor = n.frame.x
    const newFrames: Rect[] = n.caseColumnFrames.map((col) => {
      const nw = col.width * scale
      const r = { x: xCursor, y: col.y, width: nw, height: col.height }
      xCursor += nw
      return r
    })
    n.caseColumnFrames = newFrames
    n.dividerX = newFrames.length > 0 ? newFrames[newFrames.length - 1].x : n.frame.x + newWidth
    if (n.columns && n.columns.length === newFrames.length) {
      n.columns = n.columns.map((colNodes, idx) => {
        const col = newFrames[idx]
        return colNodes.map((cn) => {
          const c = copy(cn)
          c.frame.x = col.x
          c.frame.width = col.width
          return this.stretchDescendantsWidths(c, col.width)
        })
      })
      n.children = n.columns.flat()
    }
    return n
  }

  private stretchLoopChildren(n: LayoutNode, newWidth: number): void {
    const lead = this.effectiveLoopBodyLeading(n)
    const innerW = Math.max(0, newWidth - lead)
    n.children = n.children.map((child) => {
      const c = copy(child)
      c.frame.x = n.frame.x + lead
      c.frame.width = innerW
      return this.stretchDescendantsWidths(c, innerW)
    })
  }

  private stretchNodeTreeToWidth(node: LayoutNode, newWidth: number): LayoutNode {
    const n = copy(node)
    const oldW = n.frame.width
    if (!(oldW > 0)) return n
    if (isMultiType(n.element.type) && n.caseColumnFrames.length > 0) {
      return this.stretchMultiwayNodeToWidth(n, newWidth)
    }
    n.frame.width = newWidth
    if (isLoopType(n.element.type)) {
      this.stretchLoopChildren(n, newWidth)
    } else {
      n.children = n.children.map((c) => this.stretchDescendantsWidths(c, newWidth))
    }
    return n
  }

  private stretchDescendantsWidths(node: LayoutNode, parentWidth: number): LayoutNode {
    let n = copy(node)
    if (isMultiType(n.element.type)) {
      n = this.stretchNodeTreeToWidth(n, parentWidth)
    } else if (isLoopType(n.element.type)) {
      n.frame.width = parentWidth
      this.stretchLoopChildren(n, parentWidth)
    } else {
      n.frame.width = parentWidth
      n.children = n.children.map((c) => this.stretchDescendantsWidths(c, parentWidth))
    }
    return n
  }

  /** Letztes Rumpf-Element von Schleifen bis zur unteren Kante strecken (verhindert weiße Streifen). */
  private stretchLoopBodiesVertically(node: LayoutNode): LayoutNode {
    const n = copy(node)
    if (n.columns && n.columns.length > 0) {
      n.columns = n.columns.map((col) => col.map((c) => this.stretchLoopBodiesVertically(c)))
      n.children = n.columns.flat()
      return n
    }
    n.children = n.children.map((c) => this.stretchLoopBodiesVertically(c))

    const canAbsorb = (t: ElementType) =>
      t === ElementType.anweisung ||
      t === ElementType.leerElement ||
      t === ElementType.aufruf ||
      t === ElementType.aussprung ||
      isLoopType(t)

    let limitY: number | undefined
    switch (n.element.type) {
      case ElementType.forSchleife:
      case ElementType.whileSchleife:
      case ElementType.endlosschleife: {
        const bottomStrip = n.element.type === ElementType.endlosschleife ? 40 : 0
        limitY = n.frame.y + n.frame.height - bottomStrip
        break
      }
      case ElementType.doUntilSchleife:
        limitY = n.frame.y + n.frame.height - n.headerBandHeight
        break
    }
    if (limitY !== undefined && n.children.length > 0) {
      const li = n.children.length - 1
      let last = copy(n.children[li])
      const gap = limitY - (last.frame.y + last.frame.height)
      if (gap > 0.5 && canAbsorb(last.element.type)) {
        last.frame.height += gap
        last = this.stretchLoopBodiesVertically(last)
        n.children = [...n.children.slice(0, li), last]
      }
    }
    return n
  }

  private headerHeight(e: VSElement): number {
    const m = this.metrics
    const lines = Math.max(1, e.textLines.length)
    if (e.type === ElementType.doUntilSchleife) {
      return m.doUntilFooterTopInset + lines * m.lineHeight + m.doUntilFooterBottomInset + e.zoomY
    }
    let baseExtra: number
    switch (e.type) {
      case ElementType.fallauswahl:
        baseExtra = 40
        break
      case ElementType.verzweigung:
        baseExtra = 20
        break
      case ElementType.forSchleife:
      case ElementType.whileSchleife:
      case ElementType.endlosschleife:
        baseExtra = m.baseHeaderExtra + 4
        break
      default:
        baseExtra = 14
    }
    return baseExtra + lines * m.lineHeight + e.zoomY
  }

  private doUntilBodyLeadingInset(): number {
    return Math.max(20, this.lineWidthBold('do') + 12)
  }

  private effectiveLoopBodyLeading(node: LayoutNode): number {
    if (node.element.type === ElementType.doUntilSchleife) {
      return node.loopBodyLeadingInset > 0 ? node.loopBodyLeadingInset : this.doUntilBodyLeadingInset()
    }
    return 20
  }

  private horizontalPaddingInsideCell(t: ElementType): number {
    if (isMultiType(t)) return Math.max(100, this.metrics.minSidePadding * 2.45)
    return this.metrics.minSidePadding
  }

  private minWidth(e: VSElement): number {
    const measured = e.textLines.length === 0 ? 0 : Math.max(...e.textLines.map((l) => this.lineWidth(l)))
    let w = measured + e.zoomX + this.horizontalPaddingInsideCell(e.type)
    if (e.type === ElementType.aufruf) {
      const callMargins = Math.max(68, this.metrics.minSidePadding * 1.7)
      const breathingRoom = Math.max(8, this.metrics.minSidePadding * 0.2)
      w = Math.max(w, measured + e.zoomX + callMargins + breathingRoom)
    }
    const floor = e.type === ElementType.leerElement ? 76 : e.type === ElementType.aufruf ? 104 : 72
    return Math.max(floor, w)
  }

  private layoutElement(e: VSElement, x: number, y: number, idPath: number[]): LayoutNode {
    if (isMultiType(e.type)) return this.layoutMultiway(e, x, y, idPath)
    if (isLoopType(e.type)) return this.layoutLoop(e, x, y, idPath)
    const h = this.headerHeight(e)
    return newNode(idPath, e, { x, y, width: this.minWidth(e), height: h }, h)
  }

  private layoutLoop(e: VSElement, x: number, y: number, idPath: number[]): LayoutNode {
    const sumH = (ns: LayoutNode[]) => ns.reduce((s, n) => s + n.frame.height, 0)
    const maxW = (ns: LayoutNode[]) => Math.max(0, ...ns.map((n) => n.frame.width))
    const body = e.loopBody ?? []

    if (e.type === ElementType.doUntilSchleife) {
      const bodyLeading = this.doUntilBodyLeadingInset()
      const doBand = e.zoomY
      const footerH = this.headerHeight(e)
      const children = this.layoutList(body, x + bodyLeading, y + doBand, [...idPath, 0])
      const w = Math.max(this.minWidth(e), maxW(children) + bodyLeading)
      const h = sumH(children) + footerH + doBand
      const innerW = Math.max(0, w - bodyLeading)
      const node = newNode(idPath, e, { x, y, width: w, height: h }, footerH)
      node.topBandHeight = doBand
      node.loopBodyLeadingInset = bodyLeading
      node.children = children.map((c) => {
        const nn = copy(c)
        nn.frame.x = x + bodyLeading
        nn.frame.width = innerW
        return this.stretchDescendantsWidths(nn, innerW)
      })
      return node
    }

    const leftInset = 20
    const header = this.headerHeight(e)
    const bottom = e.type === ElementType.endlosschleife ? 40 : 0
    const children = this.layoutList(body, x + leftInset, y + header, [...idPath, 0])
    const w = Math.max(this.minWidth(e), maxW(children) + leftInset)
    const h = header + bottom + sumH(children)
    const innerW = Math.max(0, w - leftInset)
    const node = newNode(idPath, e, { x, y, width: w, height: h }, header)
    node.children = children.map((c) => {
      const nn = copy(c)
      nn.frame.x = x + leftInset
      nn.frame.width = innerW
      return this.stretchDescendantsWidths(nn, innerW)
    })
    return node
  }

  private layoutMultiway(e: VSElement, x: number, y: number, idPath: number[]): LayoutNode {
    const header = this.headerHeight(e)
    const cases = e.cases ?? []
    const colCount = Math.max(1, cases.length)
    const colWidthGuess = Math.max(this.minWidth(e) / colCount, 132)

    let columnFrames: Rect[] = []
    let columnChildren: LayoutNode[][] = []
    let totalW = 0
    let maxColH = 0

    cases.forEach((c, i) => {
      const colX = x + totalW
      const listNodes = this.layoutList(c.elements, colX, y + header, [...idPath, i])
      const contentW = Math.max(0, ...listNodes.map((n) => n.frame.width))
      let colW: number
      if (e.type === ElementType.verzweigung && colCount === 2) {
        const branchLabel = i === 0 ? 'true' : 'false'
        colW = Math.max(contentW, branchLabel.length * this.metrics.charWidth + 24)
      } else {
        colW = Math.max(colWidthGuess, contentW)
      }
      const colH = listNodes.reduce((s, n) => s + n.frame.height, 0)
      maxColH = Math.max(maxColH, colH)
      columnFrames.push({ x: colX, y: y + header, width: colW, height: colH })
      columnChildren.push(
        listNodes.map((n) => {
          const nn = copy(n)
          nn.frame.x = colX
          nn.frame.width = colW
          return this.stretchDescendantsWidths(nn, colW)
        }),
      )
      totalW += colW
    })

    // Zweiarmige Verzweigung: beide Spalten gleich breit.
    if (e.type === ElementType.verzweigung && colCount === 2 && columnFrames.length === 2) {
      const target = Math.max(columnFrames[0].width, columnFrames[1].width)
      const xLeft = x
      const xRight = x + target
      const deltaRight = xRight - columnFrames[1].x
      columnFrames[0] = { ...columnFrames[0], x: xLeft, width: target }
      columnFrames[1] = { ...columnFrames[1], x: xRight, width: target }
      totalW = target * 2
      columnChildren[0] = columnChildren[0].map((cn) => {
        const c = copy(cn)
        c.frame.x = xLeft
        c.frame.width = target
        return this.stretchDescendantsWidths(c, target)
      })
      columnChildren[1] = columnChildren[1].map((cn) => {
        const c = shiftTreeX(cn, deltaRight)
        c.frame.width = target
        return this.stretchDescendantsWidths(c, target)
      })
    }

    if (columnChildren.length > 0) {
      const harmonized = harmonizeRowHeightsAcrossColumns(columnChildren, y + header)
      columnChildren = harmonized.columns.map((col) => col.map((c) => this.stretchLoopBodiesVertically(c)))
      for (let i = 0; i < Math.min(columnFrames.length, harmonized.columnHeights.length); i++) {
        columnFrames[i] = { ...columnFrames[i], height: harmonized.columnHeights[i] }
      }
      maxColH = harmonized.columnHeights.length > 0 ? Math.max(...harmonized.columnHeights) : maxColH
    }

    let w = Math.max(totalW, this.minWidth(e))
    if (totalW > 0.5 && w > totalW + 0.5) {
      const scale = w / totalW
      let xCursor = x
      const newFrames: Rect[] = []
      const newCols: LayoutNode[][] = []
      columnFrames.forEach((col, i) => {
        const nw = col.width * scale
        newCols.push(
          columnChildren[i].map((cn) => {
            const c = copy(cn)
            c.frame.x = xCursor
            c.frame.width = nw
            return this.stretchDescendantsWidths(c, nw)
          }),
        )
        newFrames.push({ x: xCursor, y: col.y, width: nw, height: col.height })
        xCursor += nw
      })
      columnFrames = newFrames
      columnChildren = newCols
      totalW = xCursor - x
      w = totalW
    }

    const lastW = columnFrames.length > 0 ? columnFrames[columnFrames.length - 1].width : totalW / colCount
    const node = newNode(idPath, e, { x, y, width: w, height: header + maxColH }, header)
    node.caseColumnFrames = columnFrames
    node.dividerX = columnFrames.length > 0 ? columnFrames[columnFrames.length - 1].x : x + totalW - lastW
    node.dividerYInset = e.type === ElementType.fallauswahl ? -20 : 0
    node.columns = columnChildren
    node.children = columnChildren.flat()
    return node
  }
}

function shiftDescendantsY(node: LayoutNode, delta: number): LayoutNode {
  if (Math.abs(delta) <= 0.0001) return node
  const n = copy(node)
  const shift = (c: LayoutNode) => {
    const cc = copy(c)
    cc.frame.y += delta
    return shiftDescendantsY(cc, delta)
  }
  if (n.columns) {
    n.columns = n.columns.map((col) => col.map(shift))
    n.children = n.columns.flat()
  } else {
    n.children = n.children.map(shift)
  }
  return n
}

function shiftTreeX(node: LayoutNode, delta: number): LayoutNode {
  if (Math.abs(delta) <= 0.0001) return node
  const n = copy(node)
  n.frame.x += delta
  if (n.columns) {
    n.columns = n.columns.map((col) => col.map((c) => shiftTreeX(c, delta)))
    n.children = n.columns.flat()
  } else {
    n.children = n.children.map((c) => shiftTreeX(c, delta))
  }
  return n
}

/** Zeilenhöhen spaltenübergreifend synchronisieren, damit horizontale Trennlinien nicht „stufig“ werden. */
function harmonizeRowHeightsAcrossColumns(
  columns: LayoutNode[][],
  startY: number,
): { columns: LayoutNode[][]; columnHeights: number[] } {
  if (columns.length < 2) {
    return { columns, columnHeights: columns.map((c) => c.reduce((s, n) => s + n.frame.height, 0)) }
  }
  const eps = 0.5
  const lines: number[] = [startY]
  for (const col of columns) for (const n of col) lines.push(n.frame.y + n.frame.height)
  const maxBottom = Math.max(...lines)
  lines.push(maxBottom)
  lines.sort((a, b) => a - b)

  let merged: number[] = []
  for (const v of lines) {
    if (merged.length > 0 && Math.abs(v - merged[merged.length - 1]) <= eps) continue
    merged.push(v)
  }
  if (merged.length === 0 || Math.abs(merged[0] - startY) > eps) merged.unshift(startY)
  if (merged.length === 0) merged = [startY, maxBottom]
  else if (merged[merged.length - 1] < maxBottom - 1e-6) merged.push(maxBottom)
  else merged[merged.length - 1] = maxBottom

  const nextLineIndex = (y: number, minIndex: number) => {
    let i = Math.max(0, minIndex)
    while (i < merged.length && merged[i] < y - eps) i++
    return Math.min(i, merged.length - 1)
  }

  const outCols: LayoutNode[][] = []
  const colHeights: number[] = []
  for (const col of columns) {
    if (col.length === 0) {
      outCols.push([])
      colHeights.push(0)
      continue
    }
    const newCol: LayoutNode[] = []
    let topLineIdx = 0
    col.forEach((orig, idx) => {
      let n = copy(orig)
      const desiredTop = merged[topLineIdx]
      const origBottom = orig.frame.y + orig.frame.height
      const bottomLineIdx = idx === col.length - 1 ? merged.length - 1 : nextLineIndex(origBottom, topLineIdx + 1)
      const desiredBottom = merged[bottomLineIdx]
      const deltaY = desiredTop - n.frame.y
      n.frame.y = desiredTop
      n.frame.height = Math.max(0, desiredBottom - desiredTop)
      n = shiftDescendantsY(n, deltaY)
      newCol.push(n)
      topLineIdx = bottomLineIdx
    })
    outCols.push(newCol)
    colHeights.push(merged[merged.length - 1] - startY)
  }
  return { columns: outCols, columnHeights: colHeights }
}
