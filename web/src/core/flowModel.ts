/**
 * VisuFlow: Programmablaufplan (PAP, englisch flowchart) nach DIN 66001 frei zeichnen.
 * Nur Zeichnen: keine Simulation, kein Code. Ein Plan besteht aus Symbolen (Mittelpunkt x/y)
 * und Pfeilen vom Ausgang eines Symbols zum Eingang (oben) eines anderen.
 */

export type FlowShape = 'start' | 'ende' | 'anweisung' | 'ein' | 'verzweigung' | 'unterprogramm'

/** Ausgang eines Symbols: `out` unten, bei der Raute `ja` und `nein`. */
export type FlowPort = 'out' | 'ja' | 'nein'

export interface FlowNode {
  id: string
  shape: FlowShape
  x: number
  y: number
  text: string
}

export interface FlowEdge {
  id: string
  from: string
  port: FlowPort
  to: string
}

export interface FlowDoc {
  title: string
  nodes: FlowNode[]
  edges: FlowEdge[]
  /** Raute: `true` = „ja“ geht nach rechts, „nein“ nach unten (Standard umgekehrt). */
  yesRight?: string[]
}

export const FLOW_SHAPES: FlowShape[] = ['start', 'anweisung', 'ein', 'verzweigung', 'unterprogramm', 'ende']

export const FLOW_GRID = 20

/** Füllfarben wie im Lernbaustein „PAP bauen“ (papView.ts). */
export const FLOW_FILL: Record<FlowShape, string> = {
  start: '#d1f2d9',
  ende: '#d1f2d9',
  anweisung: '#e5f0ff',
  ein: '#f2e6ff',
  verzweigung: '#fff4d6',
  unterprogramm: '#e5f0ff',
}

export type Measure = (text: string) => number

export interface FlowBox {
  x: number
  y: number
  w: number
  h: number
  lines: string[]
}

export const FLOW_LINE_HEIGHT = 16
const MAX_TEXT = 170

/** Text auf Zeilen umbrechen (an Leerzeichen, harte Umbrüche bleiben). */
export function flowLines(text: string, max: number, measure: Measure): string[] {
  const out: string[] = []
  for (const para of text.split('\n')) {
    let line = ''
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word
      if (line && measure(next) > max) {
        out.push(line)
        line = word
      } else line = next
    }
    out.push(line)
  }
  return out.length ? out : ['']
}

const snap = (v: number) => Math.round(v / FLOW_GRID) * FLOW_GRID

/** Größe eines Symbols aus seinem Text; Breite und Höhe auf das Raster gerundet. */
export function flowBox(node: FlowNode, measure: Measure): FlowBox {
  const lines = flowLines(node.text, MAX_TEXT, measure)
  const textW = Math.max(0, ...lines.map(measure))
  const textH = lines.length * FLOW_LINE_HEIGHT
  let w: number
  let h: number
  if (node.shape === 'verzweigung') {
    // Raute: Text passt in das innere Rechteck, wenn Breite und Höhe doppelt so groß sind.
    w = Math.max(140, textW * 1.7 + 30)
    h = Math.max(80, textH * 1.8 + 24)
  } else {
    const pad = node.shape === 'ein' ? 44 : node.shape === 'unterprogramm' ? 40 : node.shape === 'anweisung' ? 24 : 36
    w = Math.max(node.shape === 'start' || node.shape === 'ende' ? 100 : 120, textW + pad)
    h = Math.max(40, textH + 18)
  }
  return { x: node.x, y: node.y, w: Math.ceil(w / FLOW_GRID) * FLOW_GRID, h: Math.ceil(h / FLOW_GRID) * FLOW_GRID, lines }
}

/** Welche Ausgänge ein Symbol hat. */
export function flowPorts(shape: FlowShape): FlowPort[] {
  if (shape === 'ende') return []
  if (shape === 'verzweigung') return ['ja', 'nein']
  return ['out']
}

export const hasInput = (shape: FlowShape) => shape !== 'start'

type Side = 'bottom' | 'right'

/** Seite eines Ausgangs. Raute: Standard „ja“ unten, „nein“ rechts; umschaltbar. */
export function portSide(doc: FlowDoc, node: FlowNode, port: FlowPort): Side {
  if (port === 'out') return 'bottom'
  const yesRight = doc.yesRight?.includes(node.id) ?? false
  return (port === 'ja') === yesRight ? 'right' : 'bottom'
}

export function portPoint(box: FlowBox, side: Side): [number, number] {
  return side === 'bottom' ? [box.x, box.y + box.h / 2] : [box.x + box.w / 2, box.y]
}

export const inputPoint = (box: FlowBox): [number, number] => [box.x, box.y - box.h / 2]

/**
 * Rechtwinkliger Weg eines Pfeils vom Ausgang zum Eingang oben. Geht es nach oben zurück (Schleife),
 * läuft der Pfeil rechts an beiden Symbolen vorbei.
 */
export function routeEdge(from: FlowBox, side: Side, to: FlowBox, lane = 0): [number, number][] {
  const [sx, sy] = portPoint(from, side)
  const [tx, ty] = inputPoint(to)
  const gap = FLOW_GRID
  const outside = Math.max(from.x + from.w / 2, to.x + to.w / 2) + gap * (1.5 + lane)
  if (side === 'bottom') {
    if (ty >= sy + gap) {
      if (sx === tx) return [[sx, sy], [tx, ty]]
      const my = sy + gap
      return [[sx, sy], [sx, my], [tx, my], [tx, ty]]
    }
    return [[sx, sy], [sx, sy + gap], [outside, sy + gap], [outside, ty - gap], [tx, ty - gap], [tx, ty]]
  }
  // Ausgang rechts; liegt das Ziel rechts daneben auf gleicher Höhe, endet der Pfeil links an seiner Seite.
  const left = to.x - to.w / 2
  if (left >= sx + gap && Math.abs(to.y - sy) < to.h / 2) return [[sx, sy], [left, sy]]
  if (ty >= sy + gap) {
    if (tx >= sx + gap) return [[sx, sy], [tx, sy], [tx, ty]]
    const rx = sx + gap
    return [[sx, sy], [rx, sy], [rx, ty - gap], [tx, ty - gap], [tx, ty]]
  }
  const rx = Math.max(sx + gap, outside)
  return [[sx, sy], [rx, sy], [rx, ty - gap], [tx, ty - gap], [tx, ty]]
}

// MARK: - Bearbeiten (immer neue Objekte, damit Rückgängig einfach den alten Stand behält)

export function emptyFlow(title = ''): FlowDoc {
  return { title, nodes: [], edges: [] }
}

export function nextId(doc: FlowDoc, prefix: 'n' | 'e'): string {
  const used = new Set([...doc.nodes.map((n) => n.id), ...doc.edges.map((e) => e.id)])
  let i = 1
  while (used.has(`${prefix}${i}`)) i++
  return `${prefix}${i}`
}

export function addNode(doc: FlowDoc, shape: FlowShape, x: number, y: number, text: string): { doc: FlowDoc; id: string } {
  const id = nextId(doc, 'n')
  return { doc: { ...doc, nodes: [...doc.nodes, { id, shape, x: snap(x), y: snap(y), text }] }, id }
}

export function moveNode(doc: FlowDoc, id: string, x: number, y: number): FlowDoc {
  return { ...doc, nodes: doc.nodes.map((n) => (n.id === id ? { ...n, x: Math.max(FLOW_GRID * 4, snap(x)), y: Math.max(FLOW_GRID * 2, snap(y)) } : n)) }
}

export function setText(doc: FlowDoc, id: string, text: string): FlowDoc {
  return { ...doc, nodes: doc.nodes.map((n) => (n.id === id ? { ...n, text } : n)) }
}

/** Pfeil ziehen: Ein Ausgang hat höchstens einen Pfeil, ein neuer ersetzt den alten. */
export function connect(doc: FlowDoc, from: string, port: FlowPort, to: string): FlowDoc {
  const a = doc.nodes.find((n) => n.id === from)
  const b = doc.nodes.find((n) => n.id === to)
  if (!a || !b || from === to || !flowPorts(a.shape).includes(port) || !hasInput(b.shape)) return doc
  const edges = doc.edges.filter((e) => !(e.from === from && e.port === port))
  return { ...doc, edges: [...edges, { id: nextId(doc, 'e'), from, port, to }] }
}

export function freePort(doc: FlowDoc, node: FlowNode): FlowPort | undefined {
  return flowPorts(node.shape).find((p) => !doc.edges.some((e) => e.from === node.id && e.port === p))
}

export function removeNode(doc: FlowDoc, id: string): FlowDoc {
  return {
    ...doc,
    nodes: doc.nodes.filter((n) => n.id !== id),
    edges: doc.edges.filter((e) => e.from !== id && e.to !== id),
    yesRight: doc.yesRight?.filter((n) => n !== id),
  }
}

export function removeEdge(doc: FlowDoc, id: string): FlowDoc {
  return { ...doc, edges: doc.edges.filter((e) => e.id !== id) }
}

/** Raute: „ja“ und „nein“ tauschen die Seiten (die Pfeile bleiben an ihrem Ausgang). */
export function swapYesNo(doc: FlowDoc, id: string): FlowDoc {
  const set = new Set(doc.yesRight ?? [])
  if (set.has(id)) set.delete(id)
  else set.add(id)
  return { ...doc, yesRight: [...set] }
}

// MARK: - Datei (.visuflow, JSON)

export function flowToJSON(doc: FlowDoc): string {
  return JSON.stringify({ format: 'visuflow', version: 1, ...doc }, null, 2)
}

export function flowFromJSON(text: string): FlowDoc | undefined {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return undefined
  }
  if (!raw || typeof raw !== 'object') return undefined
  const r = raw as Record<string, unknown>
  if (!Array.isArray(r.nodes) || !Array.isArray(r.edges)) return undefined
  const nodes: FlowNode[] = []
  for (const n of r.nodes as Record<string, unknown>[]) {
    if (!n || typeof n.id !== 'string' || !FLOW_SHAPES.includes(n.shape as FlowShape)) continue
    if (!Number.isFinite(n.x) || !Number.isFinite(n.y) || nodes.some((m) => m.id === n.id)) continue
    nodes.push({ id: n.id, shape: n.shape as FlowShape, x: n.x as number, y: n.y as number, text: typeof n.text === 'string' ? n.text : '' })
  }
  let doc: FlowDoc = { title: typeof r.title === 'string' ? r.title : '', nodes, edges: [] }
  for (const e of r.edges as Record<string, unknown>[]) {
    if (!e || typeof e.from !== 'string' || typeof e.to !== 'string' || typeof e.port !== 'string') continue
    doc = connect(doc, e.from, e.port as FlowPort, e.to)
  }
  if (Array.isArray(r.yesRight)) doc.yesRight = (r.yesRight as unknown[]).filter((id): id is string => typeof id === 'string' && nodes.some((n) => n.id === id))
  return doc
}
