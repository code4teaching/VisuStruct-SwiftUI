import type { MBotAction, MBotColor } from './mbot'

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
  /** Farbige Felder von 10 × 10 cm (Mitte); der Farbsensor erkennt sie, der Liniensensor nicht. */
  colors?: { at: Point; color: MBotColor }[]
}

/** Größe eines Feldes in einer Weltkarte (cm). */
export const CELL = 10

/**
 * Weltkarte als Text, ein Zeichen = 10 cm, oben ist hinten (weg vom Betrachter):
 * `#` Wand, `=` schwarzes Feld, `Z` Ziel (auch schwarz), `o` Haltefeld (unsichtbares Ziel),
 * `r g b y` rotes, grünes, blaues, gelbes Feld,
 * `^ > v <` Start mit Blickrichtung, sonst freier Boden.
 * Zeilen mit `//` am Anfang sind Kommentare. Um die Karte kommt automatisch der Rahmen.
 * Eine Zeile `linie: 2,8 2,2 7,2` legt eine schwarze Klebeband-Linie durch die Mitten dieser Felder (Spalte,Zeile ab 0, Kommazahlen erlaubt).
 * Eine Zeile `raster: 3` vorweg macht aus jedem Zeichen 3 × 3 Felder (30 cm wie ein Kara-Feld, so breit wie der mBot2);
 * der Start liegt dann in der Mitte seines großen Feldes.
 */
export function parseWorldMap(text: string): RobotWorldSetup {
  let rows = text.replace(/\r/g, '').split('\n').filter((l) => !l.startsWith('//'))
  const lineSpecs = rows.filter((l) => /^linie:/.test(l)).map((l) => l.slice(6).trim())
  rows = rows.filter((l) => !/^linie:/.test(l))
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
  const setup: RobotWorldSetup = { width, depth, start: { x: 0, y: 0, heading: 0 }, walls: [], lines: [], blocks: [], marks: [], goals: [], targets: [], colors: [] }
  let starts = 0
  rows.forEach((row, r) => {
    Array.from(row).forEach((ch, c) => {
      const p = center(c, r)
      if (ch === '#') setup.blocks!.push(p)
      else if (ch === '=') setup.marks!.push(p)
      else if (ch === 'Z') setup.goals!.push(p)
      else if (ch === 'o') setup.targets!.push(p)
      else if (ch in FIELD_COLORS) setup.colors!.push({ at: p, color: FIELD_COLORS[ch] })
      else if ('^>v<'.includes(ch)) {
        starts++
        setup.start = { ...p, heading: { '^': 0, '>': 90, v: 180, '<': 270 }[ch]! }
      }
    })
  })
  for (const spec of lineSpecs) {
    setup.lines.push(
      spec.split(/\s+/).map((pair) => {
        const [c, r] = pair.split(',').map(Number)
        if (!Number.isFinite(c) || !Number.isFinite(r)) throw new Error(`Linie: „${pair}“ ist kein Feld (Spalte,Zeile).`)
        return center(c, r)
      }),
    )
  }
  if (starts !== 1) throw new Error(`Die Weltkarte braucht genau einen Start (^ > v <), gefunden: ${starts}`)
  return setup
}

const FIELD_COLORS: Record<string, MBotColor> = { r: 'red', g: 'green', b: 'blue', y: 'yellow' }

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
/** `mbot.drive(100, 100)` fährt so viele cm pro Sekunde (im Simulator). */
export const MAX_SPEED = 20
/** Abstand der beiden Räder in cm (zum Drehen mit `mbot.drive`). */
const WHEEL_BASE = 12
/** So viel Zeit vergeht im Simulator bei jedem Schritt des Programms (ms). */
export const ROBOT_STEP_MS = 100

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
  /** Text auf dem Bildschirm des CyberPi (`mbot.showText`). */
  screen: string | undefined
  /** Leistung der Räder in Prozent (`mbot.drive`); der Roboter fährt damit in `tick` weiter. */
  wheels: [number, number] = [0, 0]
  /** Zeit seit dem Start in ms und Stand beim letzten `resetTimer()` */
  time = 0
  private timerStart = 0
  /** Steht er gerade an einer Wand an (zählt `bumps` nur einmal pro Anstoßen)? */
  private blocked = false

  constructor(readonly setup: RobotWorldSetup = emptyWorld) {
    this.pose = { ...setup.start }
    this.trail = [{ x: setup.start.x, y: setup.start.y }]
  }

  reset() {
    this.pose = { ...this.setup.start }
    this.trail = [{ x: this.pose.x, y: this.pose.y }]
    this.bumps = 0
    this.led = undefined
    this.screen = undefined
    this.wheels = [0, 0]
    this.time = 0
    this.timerStart = 0
    this.blocked = false
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
      case 'forward': this.wheels = [0, 0]; return this.drive(action.args[0])
      case 'backward': this.wheels = [0, 0]; return this.drive(-action.args[0])
      case 'turnRight': this.wheels = [0, 0]; return this.turn(action.args[0])
      case 'turnLeft': this.wheels = [0, 0]; return this.turn(-action.args[0])
      case 'stop': this.wheels = [0, 0]; return
      case 'drive': this.wheels = [clampPower(action.args[0]), clampPower(action.args[1])]; return
      case 'pause': return this.tick(action.args[0])
      case 'resetTimer': this.timerStart = this.time; return
      case 'setLed': this.led = [action.args[0], action.args[1], action.args[2]]; return
      case 'ledOff': this.led = undefined; return
      case 'showText': this.screen = action.text; return
    }
  }

  /**
   * Zeit vergeht: Mit `mbot.drive` gestartete Räder bewegen den Roboter weiter (Kurve, wenn sie verschieden schnell sind).
   * Vor einer Wand bleibt er stehen und zählt einmal als angestoßen.
   */
  tick(ms: number) {
    if (ms <= 0) return
    this.time += ms
    const [l, r] = this.wheels.map((p) => (p / 100) * MAX_SPEED)
    if (l === 0 && r === 0) return
    const parts = Math.ceil(ms / 10)
    const dt = ms / 1000 / parts
    let moved = false
    for (let i = 0; i < parts; i++) {
      const v = ((l + r) / 2) * dt
      // rechts schneller → Linkskurve, also kleinerer Kurs
      this.pose = { ...this.pose, heading: normalizeHeading(this.pose.heading - (((r - l) / WHEEL_BASE) * dt * 180) / Math.PI) }
      if (Math.abs(v) < 1e-9) continue
      const dir = forwardOf(this.pose.heading)
      const sign = Math.sign(v)
      const free = this.freeDistance(this.pose, { x: dir.x * sign, y: dir.y * sign }) - ROBOT_RADIUS
      const step = Math.min(Math.abs(v), Math.max(0, free))
      if (step < Math.abs(v) - 1e-9) {
        if (!this.blocked) this.bumps += 1
        this.blocked = true
      } else this.blocked = false
      this.pose = { ...this.pose, x: this.pose.x + dir.x * sign * step, y: this.pose.y + dir.y * sign * step }
      moved = true
    }
    if (moved) this.trail.push({ x: this.pose.x, y: this.pose.y })
  }

  /** Stoppuhr in Sekunden (eine Nachkommastelle), wie `cyberpi.timer.get()` */
  get timer(): number {
    return Math.round((this.time - this.timerStart) / 100) / 10
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

  /** Farbe unter dem Liniensensor (Mitte vorn); `undefined` auf hellem oder schwarzem Boden. */
  colorUnder(): MBotColor | undefined {
    const dir = forwardOf(this.pose.heading)
    const probe = { x: this.pose.x + dir.x * LINE_OFFSET, y: this.pose.y + dir.y * LINE_OFFSET }
    return (this.setup.colors ?? []).find((c) => inCell(probe, c.at))?.color
  }

  sensors(): Record<string, number | boolean> {
    const color = this.colorUnder()
    const line = this.lineState()
    return {
      getDistance: this.distance(),
      getLine: line,
      isRed: color === 'red',
      isGreen: color === 'green',
      isBlue: color === 'blue',
      isYellow: color === 'yellow',
      isLineLeft: (line & 0b0100) !== 0,
      isLineRight: (line & 0b0010) !== 0,
      getTimer: this.timer,
    }
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

const clampPower = (p: number) => Math.max(-100, Math.min(100, p))

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
