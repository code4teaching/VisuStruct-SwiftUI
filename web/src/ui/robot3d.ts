import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { LINE_WIDTH, type Point, type Pose, type RobotWorldSetup } from '../core/robotWorld'

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
  chassis: 0x2f7bd8,
  tire: 0x2b2b2b,
  hub: 0x2f7bd8,
  board: 0x1f2a36,
  screen: 0x39c5bb,
  sonar: 0xe9eef3,
  sonarRing: 0x2f7bd8,
  sensor: 0x333a42,
}

/** Teile des Modells, die eine Lektion antippbar macht. */
export type RobotPart = 'cyberpi' | 'motors' | 'ultrasonic' | 'lineSensor' | 'chassis'

export class Robot3D {
  readonly canvas: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(45, 1, 1, 2000)
  private controls: OrbitControls
  private robot = new THREE.Group()
  private leds: THREE.MeshStandardMaterial[] = []
  /** Spur als flaches Band (Linienbreite lässt WebGL nicht zu): fertige Stücke plus eins, das gerade wächst. */
  private trailGroup = new THREE.Group()
  private trailPiece = new THREE.BoxGeometry(1, 0.15, 1.4)
  private trailMaterial = new THREE.MeshStandardMaterial({ color: colors.trail })
  private liveSegment: THREE.Mesh
  private worldGroup = new THREE.Group()
  private frame?: number
  private resize: ResizeObserver
  private shown: Pose = { x: 0, y: 0, heading: 0 }
  private anim?: { from: Pose; to: Pose; start: number; ms: number }
  private trail: Point[] = []
  private parts = new Map<THREE.Object3D, RobotPart>()
  private wasShown = false

  constructor(private host: HTMLElement) {
    this.canvas = document.createElement('canvas')
    this.canvas.className = 'visubot-canvas'
    host.append(this.canvas)
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8170, 1.6))
    const sun = new THREE.DirectionalLight(0xffffff, 1.6)
    sun.position.set(-80, 160, 120)
    this.scene.add(sun)
    this.scene.add(this.worldGroup)
    this.buildRobot()
    this.scene.add(this.robot)
    this.scene.add(this.trailGroup)
    this.liveSegment = new THREE.Mesh(this.trailPiece, this.trailMaterial)
    this.scene.add(this.liveSegment)
    this.camera.position.set(0, 75, 95)
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.target.set(0, 0, -15)
    this.controls.maxPolarAngle = rad(85)
    this.controls.minDistance = 25
    this.controls.maxDistance = 600
    this.controls.update()
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
    this.canvas.remove()
  }

  /** Boden, Wände und Klebeband neu aufbauen. */
  setWorld(setup: RobotWorldSetup) {
    this.worldGroup.clear()
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(setup.width, setup.depth), new THREE.MeshStandardMaterial({ color: colors.floor }))
    floor.rotation.x = -Math.PI / 2
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

  /** Farbe der LEDs auf dem CyberPi; `undefined` = aus. */
  setLed(rgb: [number, number, number] | undefined) {
    for (const m of this.leds) {
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
        const part = this.parts.get(o)
        if (part) return part
      }
    }
    return undefined
  }

  /** Kamera nah an den Roboter (zum Kennenlernen). */
  closeUp() {
    this.controls.target.copy(this.robot.position).add(new THREE.Vector3(0, 4, 0))
    this.camera.position.copy(this.robot.position).add(new THREE.Vector3(28, 26, 34))
    this.controls.update()
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
    this.renderer.render(this.scene, this.camera)
  }

  private applyPose(p: Pose) {
    this.robot.position.copy(toScene(p))
    this.robot.rotation.y = -rad(p.heading)
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

  private placeSegment(mesh: THREE.Object3D, a: Point, b: Point) {
    const length = Math.hypot(b.x - a.x, b.y - a.y)
    mesh.visible = length > 0.01
    mesh.scale.set(length + 1.4, 1, 1)
    mesh.position.copy(toScene({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, 0.2))
    mesh.rotation.y = Math.atan2(b.y - a.y, b.x - a.x)
  }

  /** mBot2 aus Grundformen: Vorderseite zeigt nach −z. */
  private buildRobot() {
    const mat = (color: number, extra: THREE.MeshStandardMaterialParameters = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.55, ...extra })
    const add = (mesh: THREE.Object3D, part?: RobotPart, parent: THREE.Object3D = this.robot) => {
      parent.add(mesh)
      if (part) this.parts.set(mesh, part)
      return mesh
    }

    const chassis = new THREE.Group()
    const base = new THREE.Mesh(new THREE.BoxGeometry(11, 3, 15), mat(colors.chassis, { metalness: 0.5, roughness: 0.35 }))
    base.position.set(0, 3.6, 0.5)
    chassis.add(base)
    const nose = new THREE.Mesh(new THREE.BoxGeometry(9, 2, 3), mat(colors.chassis, { metalness: 0.5, roughness: 0.35 }))
    nose.position.set(0, 3.1, -8)
    chassis.add(nose)
    add(chassis, 'chassis')

    // Zwei Antriebsräder hinten mit Gummireifen, vorn eine Kugel.
    const motors = new THREE.Group()
    for (const side of [-1, 1]) {
      const wheel = new THREE.Group()
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 2.4, 28), mat(colors.tire, { roughness: 0.9 }))
      tire.rotation.z = Math.PI / 2
      wheel.add(tire)
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 2.6, 20), mat(colors.hub, { metalness: 0.4 }))
      hub.rotation.z = Math.PI / 2
      wheel.add(hub)
      wheel.position.set(side * 7, 3.4, 3)
      motors.add(wheel)
      const motor = new THREE.Mesh(new THREE.BoxGeometry(3, 2.6, 5), mat(0x9aa4ad, { metalness: 0.6 }))
      motor.position.set(side * 4.2, 2.6, 3)
      motors.add(motor)
    }
    add(motors, 'motors')
    const caster = new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 12), mat(0xb8c0c8, { metalness: 0.7 }))
    caster.position.set(0, 1.1, -7)
    add(caster)

    // CyberPi oben auf dem Gehäuse: Platine, Bildschirm, fünf LEDs vorn.
    const cyberpi = new THREE.Group()
    const board = new THREE.Mesh(new THREE.BoxGeometry(6.8, 1, 9), mat(colors.board))
    cyberpi.add(board)
    const screen = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.2, 3.2), mat(colors.screen, { emissive: colors.screen, emissiveIntensity: 0.35 }))
    screen.position.set(0, 0.6, 0.4)
    cyberpi.add(screen)
    for (let i = 0; i < 5; i++) {
      const led = new THREE.MeshStandardMaterial({ color: 0xdddddd, emissiveIntensity: 1.4 })
      this.leds.push(led)
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 8), led)
      dot.position.set(-2.4 + i * 1.2, 0.6, -3.6)
      cyberpi.add(dot)
    }
    for (const side of [-1, 1]) {
      const button = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.4, 12), mat(0xf0f0f0))
      button.position.set(side * 2.5, 0.6, 2.8)
      cyberpi.add(button)
    }
    cyberpi.position.set(0, 5.7, 1.5)
    add(cyberpi, 'cyberpi')

    // Ultraschallsensor vorn auf einer Halterung: zwei „Augen“ mit blauem Ring.
    const sonar = new THREE.Group()
    const plate = new THREE.Mesh(new THREE.BoxGeometry(7.6, 2.8, 1), mat(colors.sensor))
    sonar.add(plate)
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 1.6, 24), mat(colors.sonar, { metalness: 0.3 }))
      eye.rotation.x = Math.PI / 2
      eye.position.set(side * 2, 0, -0.9)
      sonar.add(eye)
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.22, 8, 24), mat(colors.sonarRing, { emissive: colors.sonarRing, emissiveIntensity: 0.6 }))
      ring.position.set(side * 2, 0, -1.6)
      sonar.add(ring)
    }
    sonar.position.set(0, 6.4, -8.6)
    add(sonar, 'ultrasonic')

    // Quad-RGB-Liniensensor unter der Nase.
    const line = new THREE.Group()
    const lineBoard = new THREE.Mesh(new THREE.BoxGeometry(7, 0.5, 2), mat(colors.sensor))
    line.add(lineBoard)
    for (let i = 0; i < 4; i++) {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.3, 0.7), mat(0xffffff, { emissive: 0xffffff, emissiveIntensity: 0.4 }))
      eye.position.set(-3.6 + i * 2.4, -0.35, 0)
      line.add(eye)
    }
    line.position.set(0, 1.4, -9.2)
    add(line, 'lineSensor')
  }
}
