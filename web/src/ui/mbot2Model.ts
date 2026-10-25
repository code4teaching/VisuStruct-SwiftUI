import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import type { MBotPart } from '../core/mbot'

/**
 * Der mBot2 aus Grundformen nachgebaut (keine Modelldaten von Makeblock), nach Fotos von Holgers Roboter. Maße in cm:
 * türkises Aluminium-Chassis (Wanne mit Seitenwangen, vorn runde „Ohren“, hinten Platte mit „M“), darauf das
 * durchsichtige Shield mit Akku, quer hinten oben der CyberPi, vorn der schwarze Ultraschallsensor 2. Unten hellblaue
 * Getriebe mit silbernen Motoren, Kugelrolle und vorn der Quad-RGB-Sensor.
 * Ursprung ist die Mitte der Radachse auf dem Boden (um sie dreht sich der Roboter). Vorn ist −z, oben +y.
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

const blueAlu = 0x0fa3c6

function material(color: number, extra: THREE.MeshStandardMaterialParameters = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.5, ...extra })
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

/** Etikett als Textur (Akku, Shield). */
function labelTexture(lines: { text: string; size: number; bold?: boolean }[], w: number, h: number, fg: string, bg: string | undefined) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const g = canvas.getContext('2d')
  if (g) {
    if (bg) {
      g.fillStyle = bg
      g.fillRect(0, 0, w, h)
    }
    g.fillStyle = fg
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    lines.forEach((l, i) => {
      g.font = `${l.bold ? 'bold ' : ''}${l.size}px system-ui, sans-serif`
      g.fillText(l.text, w / 2, (h * (i + 0.5)) / lines.length)
    })
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/** Radkappe mit dem Gittermuster des mBot2-Rads (Kreise und Quadrate). */
function rimTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const g = canvas.getContext('2d')
  if (g) {
    g.fillStyle = '#16181b'
    g.fillRect(0, 0, 256, 256)
    g.strokeStyle = '#2c3036'
    g.lineWidth = 9
    for (let i = 0; i < 6; i++)
      for (let k = 0; k < 6; k++) {
        const x = 38 + i * 36
        const y = 38 + k * 36
        g.beginPath()
        if ((i + k) % 2) g.arc(x, y, 12, 0, Math.PI * 2)
        else g.rect(x - 11, y - 11, 22, 22)
        g.stroke()
      }
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/** Seitenwange des Chassis in der z/y-Ebene: Rechteck, vorn ein rundes Ohr mit Lochkreis, hinten ein schräger Arm. */
function sideWallShape(): THREE.Shape {
  const s = new THREE.Shape()
  s.moveTo(-7.2, 1.4)
  s.lineTo(4.8, 1.4)
  // hinterer Arm schräg nach oben
  s.lineTo(9.6, 4.6)
  s.lineTo(8.8, 5.9)
  s.lineTo(4.6, 3.6)
  s.lineTo(4.6, 4.7)
  s.lineTo(-6.6, 4.7)
  // vorderes Ohr
  s.absarc(-8.4, 3.1, 1.9, Math.PI * 0.35, Math.PI * 1.55, false)
  s.lineTo(-7.2, 1.4)
  const hole = (z: number, y: number, r: number) => {
    const p = new THREE.Path()
    p.absarc(z, y, r, 0, Math.PI * 2, true)
    s.holes.push(p)
  }
  hole(-8.4, 3.1, 0.55)
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2
    if (Math.cos(a) > 0.6) continue
    hole(-8.4 + Math.cos(a) * 1.25, 3.1 + Math.sin(a) * 1.25, 0.22)
  }
  for (let c = 0; c < 4; c++) for (let r = 0; r < 3; r++) hole(-5.6 + c * 0.95, 2.1 + r * 0.95, 0.25)
  for (let k = 0; k < 3; k++) hole(6.0 + k * 1.05, 4.0 + k * 0.7, 0.22)
  return s
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
  const mesh = (geometry: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D) => {
    const m = new THREE.Mesh(geometry, mat)
    m.position.set(x, y, z)
    parent.add(m)
    return m
  }
  const alu = material(blueAlu, { metalness: 0.7, roughness: 0.3 })
  const black = material(0x1b1d21, { roughness: 0.6 })
  const darkPlastic = material(0x2a2e35, { roughness: 0.45 })
  const silver = material(0xc9ced6, { metalness: 0.9, roughness: 0.25 })
  const rubber = material(0x141414, { roughness: 0.9 })
  const greyButton = material(0x9aa0a7, { roughness: 0.55 })
  const white = material(0xf2f2f2, { roughness: 0.5 })
  const pcb = material(0x1d2226, { roughness: 0.7 })
  // Rauchglas-Gehäuse von Shield und CyberPi
  const smoke = new THREE.MeshPhysicalMaterial({ color: 0x262c31, transparent: true, opacity: 0.55, roughness: 0.12, metalness: 0.1, clearcoat: 1, depthWrite: false })

  // Chassis: Wanne aus Blech, zwei Seitenwangen mit Ohren und Armen, vorn und hinten eine Platte
  const chassis = part('chassis')
  const floor = new THREE.Shape()
  floor.moveTo(-4.9, -7.2)
  floor.lineTo(4.9, -7.2)
  floor.lineTo(4.9, 4.8)
  floor.lineTo(-4.9, 4.8)
  // Ausschnitt in der Mitte: Von unten sieht man die Motoren.
  const opening = new THREE.Path()
  opening.moveTo(-3.6, -3.4)
  opening.lineTo(-3.6, 2.8)
  opening.lineTo(3.6, 2.8)
  opening.lineTo(3.6, -3.4)
  floor.holes.push(opening)
  const floorGeo = new THREE.ExtrudeGeometry(floor, { depth: 0.22, bevelEnabled: false })
  floorGeo.rotateX(Math.PI / 2)
  mesh(floorGeo, alu, 0, 1.62, 0, chassis)
  const wallGeo = new THREE.ExtrudeGeometry(sideWallShape(), { depth: 0.22, bevelEnabled: false, curveSegments: 16 })
  wallGeo.rotateY(-Math.PI / 2)
  for (const side of [-1, 1]) mesh(wallGeo, alu, side * 4.9 + (side > 0 ? 0.22 : 0), 0, 0, chassis)
  // Vorderplatte mit Lächeln
  mesh(new THREE.BoxGeometry(9.8, 3.3, 0.22), alu, 0, 3.05, -7.2, chassis)
  const smile = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.16, 6, 20, Math.PI * 0.8), black)
  smile.rotation.z = Math.PI * 1.1
  smile.position.set(0, 2.9, -7.33)
  chassis.add(smile)
  // Hinterplatte schräg mit „M“-Ausschnitt
  const back = new THREE.Shape()
  back.moveTo(-4.9, 0)
  back.lineTo(4.9, 0)
  back.lineTo(4.9, 3.4)
  back.lineTo(-4.9, 3.4)
  const m = new THREE.Path()
  m.moveTo(-1.1, 0.6)
  m.lineTo(-1.1, 2.6)
  m.lineTo(-0.5, 2.6)
  m.lineTo(0, 1.9)
  m.lineTo(0.5, 2.6)
  m.lineTo(1.1, 2.6)
  m.lineTo(1.1, 0.6)
  m.lineTo(0.6, 0.6)
  m.lineTo(0.6, 1.8)
  m.lineTo(0, 1.1)
  m.lineTo(-0.6, 1.8)
  m.lineTo(-0.6, 0.6)
  back.holes.push(m)
  const backPlate = new THREE.Mesh(new THREE.ExtrudeGeometry(back, { depth: 0.22, bevelEnabled: false }), alu)
  backPlate.rotation.x = -0.35
  backPlate.position.set(0, 1.5, 4.8)
  chassis.add(backPlate)

  // Antrieb: hellblaue Getriebe an den Rädern, silberne Motoren quer und gegeneinander versetzt
  const motors = part('motors')
  const gearMat = material(0x8cc4ea, { roughness: 0.55 })
  for (const side of [-1, 1]) {
    mesh(new RoundedBoxGeometry(2.0, 2.8, 3.0, 2, 0.2), gearMat, side * 3.7, 3.3, 0, motors)
    const motor = mesh(new THREE.CylinderGeometry(0.75, 0.75, 2.8, 20), silver, side * 1.55, 3.0, side * 0.8, motors)
    motor.rotation.z = Math.PI / 2
    const cap = mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.5, 20), gearMat, side * 2.6, 3.0, side * 0.8, motors)
    cap.rotation.z = Math.PI / 2
  }

  // Räder: schwarzer Reifen, schwarze Felge mit Gittermuster
  const wheels = part('wheels')
  const rim = material(0xffffff, { map: rimTexture(), roughness: 0.6 })
  for (const side of [-1, 1]) {
    const wheel = new THREE.Group()
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(3.3, 3.3, 2.2, 44), rubber)
    tire.rotation.z = Math.PI / 2
    wheel.add(tire)
    const lip = new THREE.Mesh(new THREE.TorusGeometry(2.75, 0.32, 10, 44), rubber)
    lip.rotation.y = Math.PI / 2
    lip.position.x = side * 1.1
    wheel.add(lip)
    const face = new THREE.Mesh(new THREE.CircleGeometry(2.6, 40), rim)
    face.rotation.y = (side * Math.PI) / 2
    face.position.x = side * 1.0
    wheel.add(face)
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.3, 12), silver)
    hub.rotation.z = Math.PI / 2
    hub.position.x = side * 1.05
    wheel.add(hub)
    wheel.position.set(side * 6.45, 3.3, 0)
    wheel.name = side < 0 ? 'wheelLeft' : 'wheelRight'
    wheels.add(wheel)
  }

  // Kugelrolle vorn unter dem Boden
  const caster = part('caster')
  const casterHousing = mesh(new THREE.SphereGeometry(1.3, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), black, 0, 0.75, -4.6, caster)
  casterHousing.scale.set(1.3, 0.7, 1)
  mesh(new THREE.SphereGeometry(0.75, 20, 14), black, 0, 0.75, -4.6, caster)
  for (const x of [-0.9, 0.9]) mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.2, 12), silver, x, 1.28, -5.6, caster)

  // Quad-RGB-Liniensensor: schwarze Platine, die vorn unter der Vorderplatte herausschaut
  const lineSensor = part('lineSensor')
  mesh(new RoundedBoxGeometry(8.0, 0.3, 2.4, 2, 0.1), pcb, 0, 1.25, -8.0, lineSensor)
  for (let i = 0; i < 4; i++) {
    const x = -3.3 + i * 2.2
    mesh(new THREE.BoxGeometry(0.6, 0.12, 0.6), material(0xf5f5f5, { emissive: 0xffffff, emissiveIntensity: 0.5 }), x, 1.06, -8.3, lineSensor)
    mesh(new THREE.SphereGeometry(0.13, 8, 6), material(0xff4040, { emissive: 0xff2a2a, emissiveIntensity: 1.4 }), x, 1.06, -7.6, lineSensor)
  }

  // Shield: durchsichtiges Gehäuse, darin Platine und Akku
  const shield = part('shield')
  const shell = new THREE.Mesh(new RoundedBoxGeometry(9.4, 3.4, 11.2, 3, 0.5), smoke)
  shell.position.set(0, 6.5, -1.4)
  shell.renderOrder = 1
  shield.add(shell)
  mesh(new THREE.BoxGeometry(9.0, 0.16, 10.8), pcb, 0, 5.1, -1.4, shield)
  for (const [x, z] of [[-2, -4], [1.5, -3.6], [-1.6, -2.2], [1.8, -2.4]]) mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.4, 14), black, x, 5.35, z, shield)
  const batteryLabel = labelTexture(
    [
      { text: 'makeblock', size: 56, bold: true },
      { text: 'mBot2  One Robot Per Child', size: 30 },
    ],
    512,
    160,
    '#e9edf0',
    '#777d84',
  )
  const battery = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 7.0, 28), new THREE.MeshStandardMaterial({ map: batteryLabel, roughness: 0.4, metalness: 0.3 }))
  battery.rotation.z = Math.PI / 2
  battery.rotation.x = -Math.PI / 2
  battery.position.set(0, 6.3, 0.6)
  shield.add(battery)
  // Hinten: Motoranschlüsse M1, M2 und zwei mBuild-Buchsen mit Kabeln
  for (const x of [-3.2, -2.3]) mesh(new THREE.BoxGeometry(0.6, 0.5, 0.3), white, x, 5.6, 4.25, shield)
  for (const x of [0.4, 2.2]) {
    mesh(new THREE.BoxGeometry(1.5, 0.45, 0.35), white, x, 5.6, 4.25, shield)
    const cable = mesh(new THREE.TorusGeometry(0.7, 0.12, 6, 12, Math.PI), black, x, 5.0, 4.5, shield)
    cable.rotation.y = Math.PI / 2
  }
  // Links: Schalter ON/OFF und die Servo-Anschlüsse S1, S2
  const powerSwitch = part('powerSwitch')
  mesh(new THREE.BoxGeometry(0.2, 0.5, 1.2), darkPlastic, -4.72, 5.8, -3.4, powerSwitch)
  mesh(new THREE.BoxGeometry(0.3, 0.38, 0.45), white, -4.8, 5.8, -3.6, powerSwitch)
  const switchLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, 0.4),
    new THREE.MeshBasicMaterial({ map: labelTexture([{ text: 'ON/OFF', size: 44, bold: true }], 256, 72, '#e9edf0', undefined), transparent: true }),
  )
  switchLabel.rotation.y = -Math.PI / 2
  switchLabel.position.set(-4.76, 5.25, -3.4)
  powerSwitch.add(switchLabel)
  for (const z of [-1.9, -0.9]) mesh(new THREE.BoxGeometry(0.3, 0.45, 0.7), white, -4.6, 5.8, z, shield)

  // CyberPi quer hinten oben: Joystick links, Bildschirm in der Mitte, zwei Tasten rechts
  const cyberpiBody = new THREE.Group()
  group.add(cyberpiBody)
  const cyberpi = part('cyberpi', cyberpiBody)
  const case_ = new THREE.Mesh(new RoundedBoxGeometry(7.9, 1.0, 3.1, 3, 0.25), smoke)
  case_.renderOrder = 1
  cyberpi.add(case_)
  mesh(new THREE.BoxGeometry(7.6, 0.12, 2.9), pcb, 0, -0.1, 0, cyberpi)
  const nameLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 0.4),
    new THREE.MeshBasicMaterial({ map: labelTexture([{ text: 'CyberPi', size: 44 }], 256, 64, '#c9d1d8', undefined), transparent: true }),
  )
  nameLabel.position.set(-2.6, 0, 1.56)
  cyberpi.add(nameLabel)
  // USB-C rechts an der Stirnseite (daneben die Home-Taste, siehe Tasten)
  mesh(new THREE.BoxGeometry(0.12, 0.3, 0.9), black, 3.98, 0.05, -0.7, cyberpi)

  const screenPart = part('screen', cyberpiBody)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  drawScreen(canvas)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  mesh(new THREE.BoxGeometry(3.0, 0.08, 2.6), material(0xdfe3e6), 0.1, 0.47, 0, screenPart)
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.7, 2.3),
    new THREE.MeshStandardMaterial({ map: texture, emissive: 0xffffff, emissiveMap: texture, emissiveIntensity: 0.9, roughness: 0.15 }),
  )
  screen.rotation.x = -Math.PI / 2
  screen.position.set(0.1, 0.52, 0)
  screenPart.add(screen)

  const joystick = part('joystick', cyberpiBody)
  mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.12, 24), material(0x8a9096), -2.75, 0.52, 0, joystick)
  mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.5, 12), material(0x6c7278), -2.75, 0.75, 0, joystick)
  mesh(new THREE.CylinderGeometry(0.55, 0.6, 0.32, 24), greyButton, -2.75, 1.05, 0, joystick)

  // Tasten: Quadrat (zur Fahrtrichtung) und Dreieck; Home sitzt an der Seite
  const buttons = part('buttons', cyberpiBody)
  mesh(new RoundedBoxGeometry(0.85, 0.3, 0.85, 2, 0.15), greyButton, 2.6, 0.58, -0.62, buttons)
  const triangle = mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.3, 3), greyButton, 2.6, 0.58, 0.68, buttons)
  triangle.rotation.y = Math.PI / 2
  mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.22, 14).rotateZ(Math.PI / 2), greyButton, 3.98, 0.05, 0.5, buttons)

  // Fünf RGB-LEDs als Lichtleiste an der hinteren Längskante des CyberPi (Foto IMG_4737)
  const ledPart = part('leds', cyberpiBody)
  mesh(new THREE.BoxGeometry(6.6, 0.3, 0.06), material(0xeeeeee, { transparent: true, opacity: 0.3, roughness: 0.2 }), 0, -0.12, 1.68, ledPart)
  const leds: THREE.MeshStandardMaterial[] = []
  for (let i = 0; i < 5; i++) {
    const led = new THREE.MeshStandardMaterial({ color: 0xdddddd, emissiveIntensity: 1, roughness: 0.3, toneMapped: false })
    leds.push(led)
    mesh(new THREE.BoxGeometry(0.7, 0.22, 0.08), led, -2.8 + i * 1.4, -0.12, 1.63, ledPart)
  }
  // Lichtsensor und Mikrofon neben dem Joystick
  for (const [x, name] of [[-1.75, 'lightSensor'], [-1.75, 'microphone']] as const) {
    const z = name === 'lightSensor' ? -1.05 : 1.05
    mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 10), material(0x0a0a0a, { roughness: 0.2 }), x, 0.52, z, part(name, cyberpiBody))
  }
  cyberpiBody.position.set(0, 8.55, 3.15)

  // Ultraschallsensor 2 vorn: schwarzes Gehäuse, zwei schwarze Schallwandler mit grauem Ring
  const ultrasonic = part('ultrasonic')
  mesh(new RoundedBoxGeometry(6.4, 2.8, 1.3, 3, 0.4), black, 0, 0, 0, ultrasonic)
  for (const side of [-1, 1]) {
    const can = mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.3, 32), black, side * 1.6, 0, -1.1, ultrasonic)
    can.rotation.x = Math.PI / 2
    const ring = mesh(new THREE.TorusGeometry(0.98, 0.17, 10, 32), material(0x9ea4aa, { metalness: 0.5, roughness: 0.35 }), side * 1.6, 0, -1.76, ultrasonic)
    ring.name = 'sonarRing'
    const grid = mesh(new THREE.CircleGeometry(0.85, 28), material(0x3a3f45, { roughness: 0.9 }), side * 1.6, 0, -1.7, ultrasonic)
    grid.rotation.y = Math.PI
  }
  // Halterung mit zwei Schrauben unter dem Sensor
  mesh(new RoundedBoxGeometry(2.6, 1.5, 0.3, 2, 0.12), black, 0, -1.6, -0.3, ultrasonic)
  for (const x of [-0.7, 0.7]) mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 12).rotateX(Math.PI / 2), silver, x, -1.75, -0.5, ultrasonic)
  ultrasonic.position.set(0, 6.4, -8.0)

  // Jedes Teil bekommt eigene Materialien, damit beim Hervorheben nur dieses Teil leuchtet (LEDs bleiben geteilt).
  group.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    const transparent = (mesh.material as THREE.Material).transparent
    mesh.castShadow = !transparent
    mesh.receiveShadow = true
    const m = mesh.material as THREE.MeshStandardMaterial
    if (!leds.includes(m)) mesh.material = m.clone()
  })
  return { group, parts, partGroups, leds, screen: { canvas, texture } }
}
