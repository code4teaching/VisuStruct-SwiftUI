import type { MBotAction } from './mbot'

/**
 * Die Welt des VisuBot-Simulators von oben: Boden in Zentimetern, x nach rechts, y nach vorn (weg vom Betrachter).
 * Blickrichtung in Grad, 0 = nach vorn, positiv im Uhrzeigersinn (wie `mbot2.turn`).
 * Abstand und Liniensensor rechnen hier, damit Programme ohne echten Roboter dieselben Werte sehen.
 */

export interface Point {
  x: number
  y: number
}

export interface Pose extends Point {
  heading: number
}

export interface Wall {
  from: Point
  to: Point
}

export interface RobotWorldSetup {
  /** Breite und Tiefe des Bodens in cm; die Mitte ist (0, 0). */
  width: number
  depth: number
  start: Pose
  walls: Wall[]
  /** Schwarze Klebeband-Linien (je ein Linienzug). */
  lines: Point[][]
  /** Wandklötze von 10 × 10 cm (Mitte) aus einer Weltkarte, wie die Bäume bei Kara. */
  blocks?: Point[]
  /** Schwarze Felder von 10 × 10 cm (Mitte); der Liniensensor sieht sie. */
  marks?: Point[]
  /** Zielfelder von 10 × 10 cm (Mitte); sie sind ebenfalls schwarz. */
  goals?: Point[]
  /** Haltefelder von 10 × 10 cm (Mitte): Ziel, das der Liniensensor nicht sieht; die Radachse muss darauf stehen. */
  targets?: Point[]
}

/** Größe eines Feldes in einer Weltkarte (cm). */
export const CELL = 10

/**
 * Weltkarte als Text, ein Zeichen = 10 cm, oben ist hinten (weg vom Betrachter):
 * `#` Wand, `=` schwarzes Feld, `Z` Ziel (auch schwarz), `o` Haltefeld (unsichtbares Ziel),
 * `^ > v <` Start mit Blickrichtung, sonst freier Boden.
 * Zeilen mit `//` am Anfang sind Kommentare. Um die Karte kommt automatisch der Rahmen.
 * Eine Zeile `raster: 3` vorweg macht aus jedem Zeichen 3 × 3 Felder (30 cm wie ein Kara-Feld, so breit wie der mBot2);
 * der Start liegt dann in der Mitte seines großen Feldes.
 */
export function parseWorldMap(text: string): RobotWorldSetup {
  let rows = text.replace(/\r/g, '').split('\n').filter((l) => !l.startsWith('//'))
  const rasterLine = rows.findIndex((l) => /^raster:\s*\d+\s*$/.test(l))
  if (rasterLine >= 0) {
    const n = Number(rows[rasterLine].split(':')[1])
    rows.splice(rasterLine, 1)
    rows = rows.flatMap((row) =>
      Array.from({ length: n }, (_, i) =>
        Array.from(row)
          .map((ch) => Array.from({ length: n }, (_, j) => ('^>v<'.includes(ch) ? (i === (n >> 1) && j === (n >> 1) ? ch : '.') : ch)).join(''))
          .join(''),
      ),
    )
  }
  while (rows.length && rows[rows.length - 1].trim() === '') rows.pop()
  while (rows.length && rows[0].trim() === '') rows.shift()
  const cols = Math.max(...rows.map((r) => r.length))
  const width = cols * CELL
  const depth = rows.length * CELL
  const center = (c: number, r: number): Point => ({ x: -width / 2 + (c + 0.5) * CELL, y: depth / 2 - (r + 0.5) * CELL })
  const setup: RobotWorldSetup = { width, depth, start: { x: 0, y: 0, heading: 0 }, walls: [], lines: [], blocks: [], marks: [], goals: [], targets: [] }
  let starts = 0
  rows.forEach((row, r) => {
    Array.from(row).forEach((ch, c) => {
      const p = center(c, r)
      if (ch === '#') setup.blocks!.push(p)
      else if (ch === '=') setup.marks!.push(p)
      else if (ch === 'Z') setup.goals!.push(p)
      else if (ch === 'o') setup.targets!.push(p)
      else if ('^>v<'.includes(ch)) {
        starts++
        setup.start = { ...p, heading: { '^': 0, '>': 90, v: 180, '<': 270 }[ch]! }
      }
    })
  })
  if (starts !== 1) throw new Error(`Die Weltkarte braucht genau einen Start (^ > v <), gefunden: ${starts}`)
  return setup
}

const inCell = (p: Point, cell: Point) => Math.abs(p.x - cell.x) <= CELL / 2 && Math.abs(p.y - cell.y) <= CELL / 2

/** Abstand von der Radachse bis vorn (Sensoren, Ohren): so weit vorher hält der mBot2 vor einer Wand. Die Lage (x, y) ist die Mitte der Radachse. */
export const ROBOT_RADIUS = 10
/** Ultraschall sitzt vorn, so weit vor der Mitte. */
const SONAR_OFFSET = 9
/** Ultraschall misst höchstens so weit (mbuild ultrasonic2: 300 cm). */
export const SONAR_MAX = 300
/** Liniensensor: Abstand vor der Mitte und seitliche Lage der vier Fühler (L2, L1, R1, R2). */
const LINE_OFFSET = 8
const LINE_PROBES = [-3.6, -1.2, 1.2, 3.6]
export const LINE_WIDTH = 2.5

export const emptyWorld: RobotWorldSetup = { width: 200, depth: 200, start: { x: 0, y: 0, heading: 0 }, walls: [], lines: [] }

const rad = (deg: number) => (deg * Math.PI) / 180
const forwardOf = (heading: number): Point => ({ x: Math.sin(rad(heading)), y: Math.cos(rad(heading)) })

export class RobotWorld {
  pose: Pose
  /** Gefahrene Strecke (Stift unten), beginnt an der Startposition. */
  trail: Point[]
  /** Wie oft der Roboter an eine Wand oder den Rand gestoßen ist. */
  bumps = 0
  led: [number, number, number] | undefined

  constructor(readonly setup: RobotWorldSetup = emptyWorld) {
    this.pose = { ...setup.start }
    this.trail = [{ x: setup.start.x, y: setup.start.y }]
  }

  reset() {
    this.pose = { ...this.setup.start }
    this.trail = [{ x: this.pose.x, y: this.pose.y }]
    this.bumps = 0
    this.led = undefined
  }

  /** Alle Wände einschließlich Rand des Bodens. */
  get allWalls(): Wall[] {
    const w = this.setup.width / 2
    const d = this.setup.depth / 2
    const c = [{ x: -w, y: -d }, { x: w, y: -d }, { x: w, y: d }, { x: -w, y: d }]
    return [...this.setup.walls, ...c.map((from, i) => ({ from, to: c[(i + 1) % 4] })), ...this.blockWalls]
  }

  /** Kanten der Wandklötze (einmal berechnet). */
  private get blockWalls(): Wall[] {
    this.blockWallCache ??= (this.setup.blocks ?? []).flatMap((b) => {
      const h = CELL / 2
      const c = [{ x: b.x - h, y: b.y - h }, { x: b.x + h, y: b.y - h }, { x: b.x + h, y: b.y + h }, { x: b.x - h, y: b.y + h }]
      return c.map((from, i) => ({ from, to: c[(i + 1) % 4] }))
    })
    return this.blockWallCache
  }

  private blockWallCache?: Wall[]

  /** Ist der Roboter im Ziel? Ja, wenn seine Mitte oder sein Liniensensor über einem Zielfeld ist oder seine Mitte auf einem Haltefeld. */
  atGoal(): boolean {
    const dir = forwardOf(this.pose.heading)
    const probe = { x: this.pose.x + dir.x * LINE_OFFSET, y: this.pose.y + dir.y * LINE_OFFSET }
    return (this.setup.goals ?? []).some((g) => inCell(this.pose, g) || inCell(probe, g)) || (this.setup.targets ?? []).some((t) => inCell(this.pose, t))
  }

  apply(action: MBotAction) {
    switch (action.method) {
      case 'forward': return this.drive(action.args[0])
      case 'backward': return this.drive(-action.args[0])
      case 'turnRight': return this.turn(action.args[0])
      case 'turnLeft': return this.turn(-action.args[0])
      case 'setLed': this.led = [action.args[0], action.args[1], action.args[2]]; return
      case 'ledOff': this.led = undefined; return
    }
  }

  turn(degrees: number) {
    this.pose = { ...this.pose, heading: normalizeHeading(this.pose.heading + degrees) }
  }

  /** Fährt `cm` weit (negativ = rückwärts) und hält vor einer Wand an. */
  drive(cm: number) {
    const dir = forwardOf(this.pose.heading)
    const sign = Math.sign(cm)
    const dirMoving = { x: dir.x * sign, y: dir.y * sign }
    const free = this.freeDistance(this.pose, dirMoving)
    const distance = Math.min(Math.abs(cm), Math.max(0, free - ROBOT_RADIUS))
    if (distance < Math.abs(cm) - 1e-9) this.bumps += 1
    this.pose = { ...this.pose, x: this.pose.x + dirMoving.x * distance, y: this.pose.y + dirMoving.y * distance }
    this.trail.push({ x: this.pose.x, y: this.pose.y })
  }

  /** Abstand des Ultraschallsensors bis zur nächsten Wand in cm (wie der echte Sensor ganzzahlig). */
  distance(): number {
    const dir = forwardOf(this.pose.heading)
    const origin = { x: this.pose.x + dir.x * SONAR_OFFSET, y: this.pose.y + dir.y * SONAR_OFFSET }
    return Math.min(SONAR_MAX, Math.round(this.freeDistance(origin, dir)))
  }

  /** Liniensensor wie `get_line_sta`: Bit 3 = ganz links … Bit 0 = ganz rechts; 0 = keine Linie, 15 = alle vier. */
  lineState(): number {
    const dir = forwardOf(this.pose.heading)
    const right = { x: dir.y, y: -dir.x }
    let bits = 0
    LINE_PROBES.forEach((side, i) => {
      const p = {
        x: this.pose.x + dir.x * LINE_OFFSET + right.x * side,
        y: this.pose.y + dir.y * LINE_OFFSET + right.y * side,
      }
      const dark = [...(this.setup.marks ?? []), ...(this.setup.goals ?? [])].some((cell) => inCell(p, cell))
      if (dark || this.setup.lines.some((line) => distanceToPolyline(p, line) <= LINE_WIDTH / 2)) bits |= 1 << (3 - i)
    })
    return bits
  }

  sensors(): Record<string, number> {
    return { getDistance: this.distance(), getLine: this.lineState() }
  }

  /** Strecke von `origin` in Richtung `dir`, bis ein Strahl eine Wand trifft. */
  private freeDistance(origin: Point, dir: Point): number {
    let best = Infinity
    for (const wall of this.allWalls) {
      const t = rayHitsSegment(origin, dir, wall.from, wall.to)
      if (t !== undefined && t < best) best = t
    }
    return best
  }
}

export function normalizeHeading(deg: number): number {
  const h = ((deg % 360) + 360) % 360
  return Math.abs(h - 360) < 1e-9 ? 0 : h
}

function rayHitsSegment(o: Point, d: Point, a: Point, b: Point): number | undefined {
  const e = { x: b.x - a.x, y: b.y - a.y }
  const denom = d.x * e.y - d.y * e.x
  if (Math.abs(denom) < 1e-12) return undefined
  const ao = { x: a.x - o.x, y: a.y - o.y }
  const t = (ao.x * e.y - ao.y * e.x) / denom
  const u = (ao.x * d.y - ao.y * d.x) / denom
  return t >= 0 && u >= 0 && u <= 1 ? t : undefined
}

function distanceToPolyline(p: Point, line: Point[]): number {
  let best = Infinity
  for (let i = 0; i + 1 < line.length; i++) best = Math.min(best, distanceToSegment(p, line[i], line[i + 1]))
  return best
}

function distanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len2 = dx * dx + dy * dy
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2))
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy))
}
