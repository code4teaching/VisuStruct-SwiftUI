import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import type { MBotPart } from '../core/mbot'

/**
 * Der mBot2 aus Grundformen nachgebaut (keine Modelldaten von Makeblock). Maße in cm, ungefähr wie das Original:
 * Aluminium-Chassis mit Lochraster, Akku-Shield, CyberPi mit Bildschirm, Joystick und fünf LEDs, Ultraschallsensor 2
 * mit blauen Ringen an einer Halterung vorn, zwei Encoder-Motoren mit Rädern hinten, Kugelrolle und Quad-RGB-Sensor unten.
 * Vorn ist −z, oben +y, der Boden liegt bei y = 0.
 */

export type RobotPart = MBotPart

export interface MBot2Model {
  group: THREE.Group
  parts: Map<THREE.Object3D, RobotPart>
  /** Teilgruppen, z. B. zum Hervorheben */
  partGroups: Record<RobotPart, THREE.Group>
  leds: THREE.MeshStandardMaterial[]
  /** Bildschirm des CyberPi (Canvas, kann neu bemalt werden) */
  screen: { canvas: HTMLCanvasElement; texture: THREE.CanvasTexture }
}

const blueAlu = 0x1f6fd6

function material(color: number, extra: THREE.MeshStandardMaterialParameters = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.5, ...extra })
}

/** Abgerundetes Rechteck als Umriss (Mitte im Ursprung). */
function roundedRect(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

/** Blech mit Lochraster: liegt in der x/z-Ebene, Dicke nach oben. */
function perforatedPlate(w: number, d: number, thickness: number, mat: THREE.Material, holes: { cols: number; rows: number; r: number; marginX: number; marginZ: number }) {
  const shape = roundedRect(w, d, 1.2)
  const { cols, rows, r, marginX, marginZ } = holes
  for (let c = 0; c < cols; c++) {
    for (let k = 0; k < rows; k++) {
      const hx = -w / 2 + marginX + (cols === 1 ? 0 : (c * (w - 2 * marginX)) / (cols - 1))
      const hz = -d / 2 + marginZ + (rows === 1 ? 0 : (k * (d - 2 * marginZ)) / (rows - 1))
      const hole = new THREE.Path()
      hole.absarc(hx, hz, r, 0, Math.PI * 2, true)
      shape.holes.push(hole)
    }
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2, curveSegments: 10 })
  geo.rotateX(Math.PI / 2)
  geo.translate(0, thickness, 0)
  return new THREE.Mesh(geo, mat)
}

function drawScreen(canvas: HTMLCanvasElement) {
  const g = canvas.getContext('2d')
  if (!g) return
  const s = canvas.width
  const bg = g.createLinearGradient(0, 0, 0, s)
  bg.addColorStop(0, '#0f2f5c')
  bg.addColorStop(1, '#09182e')
  g.fillStyle = bg
  g.fillRect(0, 0, s, s)
  // Freundliches Gesicht wie beim Start des CyberPi
  g.fillStyle = '#5ee7ff'
  for (const x of [0.33, 0.67]) {
    g.beginPath()
    g.ellipse(s * x, s * 0.4, s * 0.08, s * 0.12, 0, 0, Math.PI * 2)
    g.fill()
  }
  g.strokeStyle = '#5ee7ff'
  g.lineWidth = s * 0.045
  g.lineCap = 'round'
  g.beginPath()
  g.arc(s / 2, s * 0.55, s * 0.18, Math.PI * 0.2, Math.PI * 0.8)
  g.stroke()
  g.fillStyle = '#ffffff'
  g.font = `bold ${Math.round(s * 0.11)}px system-ui, sans-serif`
  g.textAlign = 'center'
  g.fillText('VisuBot', s / 2, s * 0.9)
}

export function buildMBot2(): MBot2Model {
  const group = new THREE.Group()
  const parts = new Map<THREE.Object3D, RobotPart>()
  const partGroups = {} as Record<RobotPart, THREE.Group>
  const part = (name: RobotPart, parent: THREE.Object3D = group) => {
    const g = new THREE.Group()
    g.name = name
    partGroups[name] = g
    parts.set(g, name)
    parent.add(g)
    return g
  }
  const alu = material(blueAlu, { metalness: 0.75, roughness: 0.32 })
  const black = material(0x1b1d21, { roughness: 0.6 })
  const darkPlastic = material(0x2a2e35, { roughness: 0.45 })
  const silver = material(0xc9ced6, { metalness: 0.9, roughness: 0.25 })
  const rubber = material(0x151515, { roughness: 0.95 })
  const lightGrey = material(0xe4e7eb, { roughness: 0.55 })

  // Chassis: Bodenblech mit Lochraster, zwei Seitenwangen, vorn die hochgebogene Halterung für den Ultraschallsensor.
  const chassis = part('chassis')
  const plate = perforatedPlate(9.6, 14.5, 0.25, alu, { cols: 5, rows: 8, r: 0.22, marginX: 1.1, marginZ: 1.2 })
  plate.position.set(0, 2.3, -0.4)
  chassis.add(plate)
  for (const side of [-1, 1]) {
    const wall = perforatedPlate(2.2, 12, 0.22, alu, { cols: 1, rows: 6, r: 0.22, marginX: 1.1, marginZ: 1.3 })
    wall.rotation.z = (side * Math.PI) / 2
    wall.position.set(side * 4.8, 1.3, 0.2)
    chassis.add(wall)
  }
  const bracket = perforatedPlate(6.2, 5.2, 0.25, alu, { cols: 3, rows: 2, r: 0.22, marginX: 1.2, marginZ: 1.4 })
  bracket.rotation.x = -Math.PI / 2
  bracket.position.set(0, 2.4 + 2.6, -7.6)
  chassis.add(bracket)
  const brace = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.25, 1.2), alu)
  brace.position.set(0, 2.42, -7.2)
  chassis.add(brace)
  // Schrauben
  for (const [x, z] of [[-4, -6.6], [4, -6.6], [-4, 5.8], [4, 5.8]]) {
    const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 12), silver)
    screw.position.set(x, 2.64, z)
    chassis.add(screw)
  }

  // Akku-Shield mit Schalter, darauf der CyberPi
  const shield = new THREE.Mesh(new RoundedBoxGeometry(7.6, 1.7, 8.4, 3, 0.35), black)
  shield.position.set(0, 2.55 + 0.85, 1.6)
  part('shield').add(shield)
  const powerSwitch = part('powerSwitch')
  const switchSlot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 1.2), darkPlastic)
  switchSlot.position.set(3.85, 3.3, 3.6)
  powerSwitch.add(switchSlot)
  const switchKnob = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 0.45), material(0xf2f2f2))
  switchKnob.position.set(3.9, 3.3, 3.35)
  powerSwitch.add(switchKnob)

  // Der CyberPi besteht aus mehreren Teilen, die gemeinsam auf dem Shield sitzen.
  const cyberpiBody = new THREE.Group()
  group.add(cyberpiBody)
  const cyberpi = part('cyberpi', cyberpiBody)
  const screenPart = part('screen', cyberpiBody)
  const joystick = part('joystick', cyberpiBody)
  const buttons = part('buttons', cyberpiBody)
  const ledPart = part('leds', cyberpiBody)
  const shell = new THREE.Mesh(new RoundedBoxGeometry(7.2, 0.6, 5.2, 3, 0.28), lightGrey)
  cyberpi.add(shell)
  const face = new THREE.Mesh(new RoundedBoxGeometry(6.9, 0.35, 4.9, 3, 0.22), darkPlastic)
  face.position.y = 0.3
  cyberpi.add(face)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  drawScreen(canvas)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.1, 3.1), material(0x050608, { roughness: 0.2 }))
  bezel.position.set(-0.5, 0.5, 0.15)
  screenPart.add(bezel)
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.7, 2.7),
    new THREE.MeshStandardMaterial({ map: texture, emissive: 0xffffff, emissiveMap: texture, emissiveIntensity: 0.9, roughness: 0.15 }),
  )
  screen.rotation.x = -Math.PI / 2
  screen.position.set(-0.5, 0.56, 0.15)
  screenPart.add(screen)
  // Joystick rechts, Home-Taste links, Tasten A und B hinten
  const stickBase = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.12, 20), material(0x50555c))
  stickBase.position.set(2.45, 0.5, 0.4)
  joystick.add(stickBase)
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.35, 20), material(0x111214, { roughness: 0.8 }))
  stick.position.set(2.45, 0.72, 0.4)
  joystick.add(stick)
  const home = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.14, 16), material(0x6b7178))
  home.position.set(-2.75, 0.52, 0.4)
  buttons.add(home)
  for (const [x, color] of [[-1.6, 0xf2f2f2], [1.6, 0xf2f2f2]] as const) {
    const button = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.35, 0.5, 2, 0.12), material(color))
    button.position.set(x, 0.2, 2.75)
    buttons.add(button)
  }
  // Fünf RGB-LEDs vorn hinter einer milchigen Leiste
  const ledBar = new THREE.Mesh(new RoundedBoxGeometry(5.2, 0.25, 0.55, 2, 0.1), material(0xf4f4f4, { transparent: true, opacity: 0.55, roughness: 0.2 }))
  ledBar.position.set(0, 0.5, -1.9)
  ledPart.add(ledBar)
  const leds: THREE.MeshStandardMaterial[] = []
  for (let i = 0; i < 5; i++) {
    const led = new THREE.MeshStandardMaterial({ color: 0xdddddd, emissiveIntensity: 2.2, roughness: 0.3 })
    leds.push(led)
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), led)
    dot.position.set(-2 + i, 0.5, -1.9)
    ledPart.add(dot)
  }
  // Lichtsensor und Mikrofon als kleine Punkte
  for (const [x, name] of [[1.4, 'lightSensor'], [2.0, 'microphone']] as const) {
    const dot = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.08, 10), material(0x0a0a0a, { roughness: 0.2 }))
    dot.position.set(x, 0.5, -1.15)
    part(name, cyberpiBody).add(dot)
  }
  cyberpiBody.position.set(0, 4.55, 1.5)

  // Ultraschallsensor 2: schwarzes Gehäuse, zwei silberne Schallwandler, blaue Leuchtringe
  const ultrasonic = part('ultrasonic')
  const housing = new THREE.Mesh(new RoundedBoxGeometry(6.0, 2.5, 1.5, 3, 0.4), black)
  ultrasonic.add(housing)
  for (const side of [-1, 1]) {
    const can = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 1.2, 28), silver)
    can.rotation.x = Math.PI / 2
    can.position.set(side * 1.55, 0, -0.75)
    ultrasonic.add(can)
    const mesh = new THREE.Mesh(new THREE.CircleGeometry(0.85, 28), material(0x2b2f36, { roughness: 0.9 }))
    mesh.position.set(side * 1.55, 0, -1.36)
    mesh.rotation.y = Math.PI
    ultrasonic.add(mesh)
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.1, 0.13, 10, 32),
      new THREE.MeshStandardMaterial({ color: 0x3aa0ff, emissive: 0x2f8cff, emissiveIntensity: 1.6, roughness: 0.3 }),
    )
    ring.position.set(side * 1.55, 0, -0.8)
    ultrasonic.add(ring)
  }
  const plug = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 0.6), lightGrey)
  plug.position.set(0, 1.3, 0.4)
  ultrasonic.add(plug)
  ultrasonic.position.set(0, 6.1, -8.65)

  // Antrieb: zwei Encoder-Motoren, Räder mit Profil und hellgrauer Felge
  const motors = part('motors')
  const wheels = part('wheels')
  for (const side of [-1, 1]) {
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 3.4, 24), black)
    motor.rotation.z = Math.PI / 2
    motor.position.set(side * 2.6, 1.6, 3.2)
    motors.add(motor)
    const gearbox = new THREE.Mesh(new RoundedBoxGeometry(1.4, 2.4, 3.2, 2, 0.25), material(0x30343a))
    gearbox.position.set(side * 4.1, 1.7, 3.2)
    motors.add(gearbox)
    const wheel = new THREE.Group()
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 1.8, 40), rubber)
    tire.rotation.z = Math.PI / 2
    wheel.add(tire)
    for (let k = 0; k < 28; k++) {
      const a = (k / 28) * Math.PI * 2
      const tread = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.18, 0.35), rubber)
      tread.position.set(0, Math.cos(a) * 3.22, Math.sin(a) * 3.22)
      tread.rotation.x = a
      wheel.add(tread)
    }
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(2.25, 2.25, 1.9, 32), lightGrey)
    rim.rotation.z = Math.PI / 2
    wheel.add(rim)
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.95, 12), material(0x8c939b))
      hole.rotation.z = Math.PI / 2
      hole.position.set(0, Math.cos(a) * 1.35, Math.sin(a) * 1.35)
      wheel.add(hole)
    }
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 2.0, 20), material(blueAlu, { metalness: 0.6, roughness: 0.3 }))
    cap.rotation.z = Math.PI / 2
    wheel.add(cap)
    wheel.position.set(side * 5.9, 3.2, 3.2)
    wheel.name = side < 0 ? 'wheelLeft' : 'wheelRight'
    wheels.add(wheel)
  }

  // Kugelrolle vorn unter dem Blech
  const casterHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.75, 1.4, 20), black)
  casterHousing.position.set(0, 1.6, -5.6)
  const caster = part('caster')
  caster.add(casterHousing)
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.75, 20, 14), silver)
  ball.position.set(0, 0.75, -5.6)
  caster.add(ball)

  // Quad-RGB-Liniensensor unter der Nase: vier Fühler mit Licht
  const lineSensor = part('lineSensor')
  const pcb = new THREE.Mesh(new RoundedBoxGeometry(7.2, 0.25, 2.0, 2, 0.1), material(0x15171a))
  lineSensor.add(pcb)
  for (let i = 0; i < 4; i++) {
    const x = -3.6 + i * 2.4
    const sensor = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.2, 0.75), material(0xf5f5f5, { emissive: 0xffffff, emissiveIntensity: 0.6 }))
    sensor.position.set(x, -0.2, 0)
    lineSensor.add(sensor)
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), material(0xff4040, { emissive: 0xff2a2a, emissiveIntensity: 1.5 }))
    light.position.set(x, -0.18, 0.6)
    lineSensor.add(light)
  }
  for (const x of [-2.2, 2.2]) {
    const standoff = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.9, 8), silver)
    standoff.position.set(x, 0.55, 0)
    lineSensor.add(standoff)
  }
  lineSensor.position.set(0, 1.25, -7.0)

  // Jedes Teil bekommt eigene Materialien, damit beim Hervorheben nur dieses Teil leuchtet (LEDs bleiben geteilt).
  group.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.castShadow = true
    mesh.receiveShadow = true
    const m = mesh.material as THREE.MeshStandardMaterial
    if (!leds.includes(m)) mesh.material = m.clone()
  })
  return { group, parts, partGroups, leds, screen: { canvas, texture } }
}
