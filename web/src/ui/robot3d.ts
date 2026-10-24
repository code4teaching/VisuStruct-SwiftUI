import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { buildMBot2, type MBot2Model, type RobotPart } from './mbot2Model'
import { CELL, LINE_WIDTH, type Point, type Pose, type RobotWorldSetup } from '../core/robotWorld'

/**
 * 3D-Ansicht des VisuBot-Simulators mit three.js (MIT). Der mBot2 ist aus einfachen Formen nachgebaut
 * (keine Makeblock-Modelldaten). Einheit: 1 = 1 cm. Boden-y der Welt wird zu −z, damit man von hinten auf den Roboter schaut.
 */

const toScene = (p: Point, height = 0) => new THREE.Vector3(p.x, height, -p.y)
const rad = (deg: number) => (deg * Math.PI) / 180

const colors = {
  floor: 0xf4f1ea,
  grid: 0xd6d0c4,
  wall: 0xc9a46b,
  tape: 0x222222,
  trail: 0xe8590c,
}

export type { RobotPart }

/** Abstand der Räder (Mitte zu Mitte) und Radius, damit sich die Räder passend zur Fahrt drehen. */
const TRACK = 11.8
const WHEEL_RADIUS = 3.2

export class Robot3D {
  readonly canvas: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(45, 1, 1, 2000)
  private controls: OrbitControls
  private model: MBot2Model
  private robot: THREE.Group
  /** Spur als flaches Band (Linienbreite lässt WebGL nicht zu): fertige Stücke plus eins, das gerade wächst. */
  private trailGroup = new THREE.Group()
  private trailPiece = new THREE.BoxGeometry(1, 0.15, 1.4)
  private trailMaterial = new THREE.MeshStandardMaterial({ color: colors.trail })
  private liveSegment: THREE.Mesh
  private worldGroup = new THREE.Group()
  private frame?: number
  private sun: THREE.DirectionalLight
  private resize: ResizeObserver
  private shown: Pose = { x: 0, y: 0, heading: 0 }
  private anim?: { from: Pose; to: Pose; start: number; ms: number }
  private trail: Point[] = []
  private wasShown = false
  /** Zuletzt gezeigte Lage, um die Räder mitzudrehen */
  private wheelPose?: Pose
  /** Kamerafahrt zu einem Teil (Tour durch das Modell) */
  private flight?: { from: { pos: THREE.Vector3; target: THREE.Vector3 }; to: { pos: THREE.Vector3; target: THREE.Vector3 }; start: number; ms: number }

  constructor(private host: HTMLElement) {
    this.canvas = document.createElement('canvas')
    this.canvas.className = 'visubot-canvas'
    host.append(this.canvas)
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // Spiegelungen auf Aluminium und Kunststoff aus einer einfachen Raumumgebung
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    this.scene.environmentIntensity = 0.7
    pmrem.dispose()
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8170, 0.9))
    const sun = new THREE.DirectionalLight(0xffffff, 1.8)
    sun.position.set(-40, 90, 50)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    sun.shadow.camera.left = sun.shadow.camera.bottom = -30
    sun.shadow.camera.right = sun.shadow.camera.top = 30
    sun.shadow.camera.far = 300
    sun.shadow.bias = -0.0005
    this.sun = sun
    this.scene.add(sun, sun.target)
    this.scene.add(this.worldGroup)
    this.model = buildMBot2()
    this.robot = this.model.group
    this.scene.add(this.robot)
    this.scene.add(this.trailGroup)
    this.liveSegment = new THREE.Mesh(this.trailPiece, this.trailMaterial)
    this.scene.add(this.liveSegment)
    this.camera.position.set(0, 75, 95)
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.target.set(0, 0, -15)
    // Auch von unten anschauen (dort ist der Boden durchsichtig)
    this.controls.maxPolarAngle = Math.PI - 0.05
    this.controls.minDistance = 12
    this.controls.maxDistance = 600
    this.controls.update()
    // Wer selbst dreht, hält die Kamerafahrt und das langsame Kreisen an.
    this.controls.addEventListener('start', () => {
      this.flight = undefined
      this.controls.autoRotate = false
    })
    this.resize = new ResizeObserver(() => this.fit())
    this.resize.observe(host)
    this.fit()
    this.loop()
  }

  dispose() {
    if (this.frame !== undefined) cancelAnimationFrame(this.frame)
    this.resize.disconnect()
    this.controls.dispose()
    this.renderer.dispose()
    this.renderer.forceContextLoss()
    this.canvas.remove()
  }

  /** Boden, Wände und Klebeband neu aufbauen. */
  setWorld(setup: RobotWorldSetup) {
    this.worldGroup.clear()
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(setup.width, setup.depth), new THREE.MeshStandardMaterial({ color: colors.floor, roughness: 0.9 }))
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    this.worldGroup.add(floor)
    // Raster im Abstand von 10 cm (ein Schritt von mbot.forward()).
    const grid: number[] = []
    for (let x = -setup.width / 2; x <= setup.width / 2 + 1e-6; x += 10) grid.push(x, 0.05, -setup.depth / 2, x, 0.05, setup.depth / 2)
    for (let z = -setup.depth / 2; z <= setup.depth / 2 + 1e-6; z += 10) grid.push(-setup.width / 2, 0.05, z, setup.width / 2, 0.05, z)
    const gridGeometry = new THREE.BufferGeometry()
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(grid, 3))
    this.worldGroup.add(new THREE.LineSegments(gridGeometry, new THREE.LineBasicMaterial({ color: colors.grid })))
    const border = [
      { from: { x: -setup.width / 2, y: -setup.depth / 2 }, to: { x: setup.width / 2, y: -setup.depth / 2 } },
      { from: { x: setup.width / 2, y: -setup.depth / 2 }, to: { x: setup.width / 2, y: setup.depth / 2 } },
      { from: { x: setup.width / 2, y: setup.depth / 2 }, to: { x: -setup.width / 2, y: setup.depth / 2 } },
      { from: { x: -setup.width / 2, y: setup.depth / 2 }, to: { x: -setup.width / 2, y: -setup.depth / 2 } },
    ]
    const wallMaterial = new THREE.MeshStandardMaterial({ color: colors.wall })
    for (const w of [...border.map((b) => ({ ...b, low: true })), ...setup.walls.map((b) => ({ ...b, low: false }))]) {
      const length = Math.hypot(w.to.x - w.from.x, w.to.y - w.from.y)
      const height = w.low ? 4 : 15
      const box = new THREE.Mesh(new THREE.BoxGeometry(length, height, 2), wallMaterial)
      box.position.copy(toScene({ x: (w.from.x + w.to.x) / 2, y: (w.from.y + w.to.y) / 2 }, height / 2))
      box.rotation.y = Math.atan2(w.to.y - w.from.y, w.to.x - w.from.x)
      this.worldGroup.add(box)
    }
    // Wandklötze, schwarze Felder und Ziele aus einer Weltkarte (wie die Bäume und Kleeblätter bei Kara)
    const blockGeometry = new THREE.BoxGeometry(CELL, 12, CELL)
    for (const b of setup.blocks ?? []) {
      const box = new THREE.Mesh(blockGeometry, wallMaterial)
      box.position.copy(toScene(b, 6))
      box.castShadow = box.receiveShadow = true
      this.worldGroup.add(box)
    }
    const cellGeometry = new THREE.BoxGeometry(CELL, 0.1, CELL)
    const markMaterial = new THREE.MeshStandardMaterial({ color: colors.tape })
    for (const m of setup.marks ?? []) {
      const cell = new THREE.Mesh(cellGeometry, markMaterial)
      cell.position.copy(toScene(m, 0.1))
      this.worldGroup.add(cell)
    }
    const goalMaterial = new THREE.MeshStandardMaterial({ color: colors.tape })
    const flagMaterial = new THREE.MeshStandardMaterial({ color: 0x2fb344, emissive: 0x1b7a2c, emissiveIntensity: 0.4 })
    for (const g of setup.goals ?? []) {
      const cell = new THREE.Mesh(cellGeometry, goalMaterial)
      cell.position.copy(toScene(g, 0.1))
      this.worldGroup.add(cell)
      // Kleine Zielfahne in der Ecke, damit man das Ziel von den schwarzen Feldern unterscheidet
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 9, 8), new THREE.MeshStandardMaterial({ color: 0xdddddd }))
      pole.position.copy(toScene({ x: g.x + CELL / 2 - 1, y: g.y + CELL / 2 - 1 }, 4.5))
      const flag = new THREE.Mesh(new THREE.BoxGeometry(4, 2.6, 0.2), flagMaterial)
      flag.position.copy(toScene({ x: g.x + CELL / 2 - 3, y: g.y + CELL / 2 - 1 }, 7.6))
      this.worldGroup.add(pole, flag)
    }
    const tape = new THREE.MeshStandardMaterial({ color: colors.tape })
    for (const line of setup.lines) {
      for (let i = 0; i + 1 < line.length; i++) {
        const a = line[i]
        const b = line[i + 1]
        const length = Math.hypot(b.x - a.x, b.y - a.y) + LINE_WIDTH
        const strip = new THREE.Mesh(new THREE.BoxGeometry(length, 0.1, LINE_WIDTH), tape)
        strip.position.copy(toScene({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, 0.1))
        strip.rotation.y = Math.atan2(b.y - a.y, b.x - a.x)
        this.worldGroup.add(strip)
      }
    }
  }

  /** Roboter sofort an `pose` stellen (Neustart). */
  place(pose: Pose, trail: Point[]) {
    this.anim = undefined
    this.shown = { ...pose }
    this.trail = trail.map((p) => ({ ...p }))
    this.trailGroup.clear()
    this.applyPose(this.shown)
  }

  /** Zu `pose` fahren bzw. drehen, in `ms` Millisekunden; `trail` ist die Spur danach. */
  moveTo(pose: Pose, trail: Point[], ms: number) {
    if (this.anim) this.shown = { ...this.anim.to }
    this.trail = trail.map((p) => ({ ...p }))
    let to = { ...pose }
    // Kürzester Weg beim Drehen, aber volle Umdrehungen (turnRight(360)) bleiben sichtbar.
    const diff = to.heading - this.shown.heading
    if (diff > 180) to = { ...to, heading: to.heading - 360 }
    else if (diff < -180) to = { ...to, heading: to.heading + 360 }
    this.anim = { from: { ...this.shown }, to, start: performance.now(), ms: Math.max(1, ms) }
  }

  /** Nur der Roboter auf einer runden Scheibe, z. B. zum Kennenlernen in einer Lektion. */
  showcase() {
    this.worldGroup.clear()
    const disc = new THREE.Mesh(new THREE.CircleGeometry(16, 48), new THREE.MeshStandardMaterial({ color: 0xe9e4da, roughness: 0.95 }))
    disc.rotation.x = -Math.PI / 2
    disc.receiveShadow = true
    this.worldGroup.add(disc)
    this.place({ x: 0, y: 0, heading: 0 }, [{ x: 0, y: 0 }])
    this.controls.target.set(0, 4, -1)
    this.camera.position.set(-20, 17, -22)
    this.controls.update()
  }

  /** Teile hervorheben (leicht leuchten lassen), leere Liste = keins. */
  highlight(part: RobotPart | RobotPart[] | undefined) {
    const lit = new Set(part === undefined ? [] : Array.isArray(part) ? part : [part])
    for (const [name, group] of Object.entries(this.model.partGroups) as [RobotPart, THREE.Group][]) {
      group.traverse((o) => {
        const mesh = o as THREE.Mesh
        if (!mesh.isMesh) return
        const m = mesh.material as THREE.MeshStandardMaterial
        m.userData.baseEmissive ??= { color: m.emissive.getHex(), intensity: m.emissiveIntensity }
        const base = m.userData.baseEmissive as { color: number; intensity: number }
        if (lit.has(name)) {
          m.emissive.setHex(0xffb000)
          m.emissiveIntensity = Math.max(base.intensity, 0.22)
        } else {
          m.emissive.setHex(base.color)
          m.emissiveIntensity = base.intensity
        }
      })
    }
  }

  /**
   * Kamera fährt zu den Teilen (leer = ganzer Roboter). `view`: Blickrichtung vorn, hinten, oben, unten, seite;
   * sonst schräg von vorn links. `spin`: danach langsam um den Roboter kreisen.
   */
  focusOn(parts: RobotPart[], view = '', spin = false, ms = 900) {
    const box = new THREE.Box3()
    this.robot.updateMatrixWorld(true)
    for (const p of parts) box.expandByObject(this.model.partGroups[p])
    if (box.isEmpty()) box.setFromObject(this.robot)
    const target = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3()).length()
    const direction = new THREE.Vector3(
      ...((
        {
          vorn: [0, 0.35, -1],
          front: [0, 0.35, -1],
          hinten: [0, 0.55, 1],
          back: [0, 0.55, 1],
          oben: [0, 1, 0.12],
          top: [0, 1, 0.12],
          unten: [0.05, -1, -0.3],
          bottom: [0.05, -1, -0.3],
          seite: [-1, 0.5, 0.15],
          side: [-1, 0.5, 0.15],
        } as Record<string, [number, number, number]>
      )[view] ?? [-0.75, 0.6, -0.85]),
    ).normalize()
    const distance = Math.max(14, size * (parts.length ? 1.8 : 1.35) + 6)
    const pos = target.clone().addScaledVector(direction, distance)
    this.flight = {
      from: { pos: this.camera.position.clone(), target: this.controls.target.clone() },
      to: { pos, target },
      start: performance.now(),
      ms,
    }
    this.controls.autoRotate = spin
    this.controls.autoRotateSpeed = 1.2
  }

  /** Farbe der LEDs auf dem CyberPi; `undefined` = aus. */
  setLed(rgb: [number, number, number] | undefined) {
    for (const m of this.model.leds) {
      if (rgb) {
        m.emissive.setRGB(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255)
        m.color.setRGB(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255)
      } else {
        m.emissive.setRGB(0, 0, 0)
        m.color.set(0xdddddd)
      }
    }
  }

  /** Welches Teil liegt unter dem Punkt (Bildschirmkoordinaten)? */
  partAt(clientX: number, clientY: number): RobotPart | undefined {
    const r = this.canvas.getBoundingClientRect()
    const ray = new THREE.Raycaster()
    ray.setFromCamera(new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1), this.camera)
    for (const hit of ray.intersectObject(this.robot, true)) {
      for (let o: THREE.Object3D | null = hit.object; o; o = o.parent) {
        const part = this.model.parts.get(o)
        if (part) return part
      }
    }
    return undefined
  }


  private fit() {
    const w = Math.max(1, this.host.clientWidth)
    const h = Math.max(1, this.host.clientHeight)
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  private loop = () => {
    // Aus der Seite entfernt (z. B. andere Lektion): aufräumen statt weiterzuzeichnen.
    if (this.canvas.isConnected) this.wasShown = true
    else if (this.wasShown) return this.dispose()
    this.frame = requestAnimationFrame(this.loop)
    let current = this.shown
    if (this.anim) {
      const k = Math.min(1, (performance.now() - this.anim.start) / this.anim.ms)
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2
      const { from, to } = this.anim
      current = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, heading: from.heading + (to.heading - from.heading) * e }
      if (k >= 1) {
        this.shown = { ...to }
        this.anim = undefined
      }
    }
    this.applyPose(current)
    const flying = !!this.flight
    if (this.flight) {
      const k = Math.min(1, (performance.now() - this.flight.start) / this.flight.ms)
      const e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2
      const { from, to } = this.flight
      this.controls.target.lerpVectors(from.target, to.target, e)
      // Auf einem Bogen um das Ziel fliegen, nicht quer durch den Roboter
      const a = from.pos.clone().sub(from.target)
      const b = to.pos.clone().sub(to.target)
      const dir = a.clone().normalize().lerp(b.clone().normalize(), e)
      // Genau gegenüber (z. B. von oben nach unten): seitlich vorbei statt durch die Mitte
      if (dir.lengthSq() < 1e-4) dir.set(-1, 0, 0)
      dir.normalize()
      const len = a.length() + (b.length() - a.length()) * e
      this.camera.position.copy(this.controls.target).addScaledVector(dir, len)
      if (k >= 1) this.flight = undefined
    }
    if (flying || this.controls.autoRotate) this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  private applyPose(p: Pose) {
    this.turnWheels(p)
    this.robot.position.copy(toScene(p))
    this.robot.rotation.y = -rad(p.heading)
    // Schatten folgt dem Roboter
    this.sun.target.position.copy(this.robot.position)
    this.sun.position.copy(this.robot.position).add(new THREE.Vector3(-40, 90, 50))
    // Spur bis zur gezeigten Position: das letzte Stück wächst mit, bis der Roboter ankommt.
    const done = this.anim ? this.trail.length - 2 : this.trail.length - 1
    while (this.trailGroup.children.length > Math.max(0, done)) this.trailGroup.remove(this.trailGroup.children[this.trailGroup.children.length - 1])
    for (let i = this.trailGroup.children.length; i < done; i++) {
      const piece = new THREE.Mesh(this.trailPiece, this.trailMaterial)
      this.placeSegment(piece, this.trail[i], this.trail[i + 1])
      this.trailGroup.add(piece)
    }
    const from = this.anim ? this.trail[this.trail.length - 2] : undefined
    this.liveSegment.visible = !!from
    if (from) this.placeSegment(this.liveSegment, from, p)
  }

  /** Räder drehen sich mit: vorwärts beide gleich, beim Drehen gegeneinander. */
  private turnWheels(p: Pose) {
    const last = this.wheelPose
    this.wheelPose = { ...p }
    if (!last) return
    const dx = p.x - last.x
    const dy = p.y - last.y
    const h = rad(last.heading)
    const ds = dx * Math.sin(h) + dy * Math.cos(h)
    const turn = rad(p.heading - last.heading) * (TRACK / 2)
    const left = this.robot.getObjectByName('wheelLeft')
    const right = this.robot.getObjectByName('wheelRight')
    if (left) left.rotation.x -= (ds + turn) / WHEEL_RADIUS
    if (right) right.rotation.x -= (ds - turn) / WHEEL_RADIUS
  }

  private placeSegment(mesh: THREE.Object3D, a: Point, b: Point) {
    const length = Math.hypot(b.x - a.x, b.y - a.y)
    mesh.visible = length > 0.01
    mesh.scale.set(length + 1.4, 1, 1)
    mesh.position.copy(toScene({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, 0.2))
    mesh.rotation.y = Math.atan2(b.y - a.y, b.x - a.x)
  }
}
