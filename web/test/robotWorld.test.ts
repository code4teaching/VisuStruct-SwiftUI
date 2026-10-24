import { describe, expect, it } from 'vitest'
import { makeMBotAction, mbotArguments } from '../src/core/mbot'
import { world } from '../src/learn/content'
import { RobotWorld, parseWorldMap } from '../src/core/robotWorld'

const act = (w: RobotWorld, method: string, ...args: number[]) => w.apply(makeMBotAction(method, args))

describe('VisuBot-Welt', () => {
  it('fährt ein Quadrat zurück zum Start', () => {
    const w = new RobotWorld()
    for (let i = 0; i < 4; i++) {
      act(w, 'forward', 50)
      act(w, 'turnRight', 90)
    }
    expect(w.pose.x).toBeCloseTo(0)
    expect(w.pose.y).toBeCloseTo(0)
    expect(w.pose.heading).toBeCloseTo(0)
    expect(w.trail[1]).toEqual({ x: 0, y: 50 })
    expect(w.trail[2].x).toBeCloseTo(50)
  })

  it('misst den Abstand zum Rand und hält vor der Wand', () => {
    const w = new RobotWorld()
    expect(w.distance()).toBe(91)
    act(w, 'forward', 500)
    expect(w.pose.y).toBeCloseTo(90)
    expect(w.bumps).toBe(1)
  })

  it('sieht eine Wand vor sich', () => {
    const w = new RobotWorld({ width: 200, depth: 200, start: { x: 0, y: 0, heading: 0 }, walls: [{ from: { x: -20, y: 40 }, to: { x: 20, y: 40 } }], lines: [] })
    expect(w.distance()).toBe(31)
    act(w, 'turnLeft', 90)
    expect(w.distance()).toBe(91)
  })

  it('erkennt eine Linie unter dem Sensor', () => {
    const line = [{ x: 0, y: -100 }, { x: 0, y: 100 }]
    const w = new RobotWorld({ width: 200, depth: 200, start: { x: 0, y: 0, heading: 0 }, walls: [], lines: [line] })
    expect(w.lineState()).toBe(0b0110)
    w.pose = { x: 3, y: 0, heading: 0 }
    expect(w.lineState() & 0b1000).toBe(0b1000)
    w.pose = { x: 30, y: 0, heading: 0 }
    expect(w.lineState()).toBe(0)
  })
})

describe('Weltkarten', () => {
  const step = (method: string, args: number[] = []) => ({ method, args: mbotArguments(method, args)!, label: method })

  it('liest Wände, Felder, Ziel und Start', () => {
    const w = parseWorldMap('// Kommentar\n#.=\n.Z.\n.>.\n')
    expect(w.width).toBe(30)
    expect(w.depth).toBe(30)
    expect(w.start).toEqual({ x: 0, y: -10, heading: 90 })
    expect(w.blocks).toEqual([{ x: -10, y: 10 }])
    expect(w.marks).toEqual([{ x: 10, y: 10 }])
    expect(w.goals).toEqual([{ x: 0, y: 0 }])
    expect(() => parseWorldMap('...\n')).toThrow(/Start/)
    expect(() => parseWorldMap('^^\n')).toThrow(/Start/)
  })

  it('Wandklötze bremsen und werden gemessen', () => {
    const r = new RobotWorld(parseWorldMap('.#.\n...\n...\n.^.\n'))
    expect(r.distance()).toBe(25 - 9)
    r.apply(step('forward', [30]))
    expect(r.bumps).toBe(1)
    expect(r.pose.y).toBeCloseTo(-15 + 25 - 10, 5)
  })

  // Die Musterlösungen der Lektionen, hier direkt in TypeScript: so passen Karten und Schwellen zusammen.
  const untilWall = (r: RobotWorld) => {
    for (let i = 0; i < 200 && r.distance() > 15; i++) r.apply(step('forward'))
  }
  const maze = (r: RobotWorld) => {
    for (let i = 0; i < 500 && r.lineState() === 0; i++) {
      if (r.distance() > 15) r.apply(step('forward'))
      else {
        r.apply(step('turnRight'))
        if (r.distance() < 15) r.apply(step('turnRight', [180]))
      }
    }
  }

  it.each(['wand-kurz', 'wand-mittel', 'wand-lang'])('%s: bis zur Wand endet im Ziel', (name) => {
    const r = new RobotWorld(world(name)!)
    untilWall(r)
    expect(r.atGoal()).toBe(true)
    expect(r.bumps).toBe(0)
  })

  it.each(['labyrinth-1', 'labyrinth-2'])('%s: Wand-Regel findet das Ziel ohne Anstoßen', (name) => {
    const r = new RobotWorld(world(name)!)
    maze(r)
    expect(r.atGoal()).toBe(true)
    expect(r.bumps).toBe(0)
    // Nur geradeaus ohne Sensor kommt nicht an
    const blind = new RobotWorld(world(name)!)
    blind.apply(step('forward', [100]))
    expect(blind.atGoal()).toBe(false)
  })

  it('Raster 3: ein Zeichen wird 30 cm groß, Start in der Mitte, Haltefeld unsichtbar', () => {
    const w = parseWorldMap('raster: 3\n#o\n>.\n')
    expect(w.width).toBe(60)
    expect(w.depth).toBe(60)
    expect(w.start).toEqual({ x: -15, y: -15, heading: 90 })
    expect(w.blocks).toHaveLength(9)
    expect(w.targets).toHaveLength(9)
    const r = new RobotWorld(w)
    expect(r.atGoal()).toBe(false)
    r.apply(step('turnLeft'))
    expect(r.distance()).toBe(6)
    r.apply(step('turnRight'))
    r.apply(step('forward', [30]))
    r.apply(step('turnLeft'))
    expect(r.lineState()).toBe(0)
    expect(r.atGoal()).toBe(false)
    r.apply(step('forward', [30]))
    expect(r.atGoal()).toBe(true)
    expect(r.bumps).toBe(0)
  })

  // Kara-Aufgaben: ein Feld = 30 cm, Baum im Nachbarfeld heißt Abstand < 20.
  const go = (r: RobotWorld, ...moves: [string, number?][]) => moves.forEach(([m, a]) => r.apply(step(m, a === undefined ? [] : [a])))
  const around = (r: RobotWorld) => go(r, ['turnLeft'], ['forward', 30], ['turnRight'], ['forward', 60], ['turnRight'], ['forward', 30], ['turnLeft'])
  const aroundRight = (r: RobotWorld) => go(r, ['turnRight'], ['forward', 30], ['turnLeft'], ['forward', 60], ['turnLeft'], ['forward', 30], ['turnRight'])

  it('slalom: abwechselnd oben und unten herum ins Ziel', () => {
    const r = new RobotWorld(world('slalom')!)
    for (let i = 0; i < 2; i++) {
      around(r)
      aroundRight(r)
    }
    expect(r.atGoal()).toBe(true)
    expect(r.bumps).toBe(0)
    const straight = new RobotWorld(world('slalom')!)
    straight.apply(step('forward', [240]))
    expect(straight.bumps).toBe(1)
  })

  it.each(['wald-1', 'wald-2'])('%s: Bäume umfahren bis zum Ziel', (name) => {
    const r = new RobotWorld(world(name)!)
    for (let i = 0; i < 50 && r.lineState() === 0; i++) {
      if (r.distance() < 20) around(r)
      else r.apply(step('forward', [30]))
    }
    expect(r.atGoal()).toBe(true)
    expect(r.bumps).toBe(0)
  })

  it.each(['tunnel-1', 'tunnel-2'])('%s: hält im ersten Tunnelfeld', (name) => {
    const r = new RobotWorld(world(name)!)
    let left = 99
    let right = 99
    for (let i = 0; i < 50 && !(left < 20 && right < 20); i++) {
      r.apply(step('forward', [30]))
      r.apply(step('turnLeft'))
      left = r.distance()
      r.apply(step('turnRight', [180]))
      right = r.distance()
      r.apply(step('turnLeft'))
    }
    expect(r.atGoal()).toBe(true)
    expect(r.bumps).toBe(0)
    // Nur eine Seite prüfen reicht nicht
    const half = new RobotWorld(world(name)!)
    for (let i = 0; i < 50; i++) {
      half.apply(step('forward', [30]))
      half.apply(step('turnLeft'))
      const d = half.distance()
      half.apply(step('turnRight'))
      if (d < 20) break
    }
    expect(half.atGoal()).toBe(false)
  })

  it.each(['ausgang-1', 'ausgang-2'])('%s: durch jede Lücke nach oben ins Ziel', (name) => {
    const r = new RobotWorld(world(name)!)
    for (let i = 0; i < 100 && r.lineState() === 0; i++) {
      r.apply(step('turnLeft'))
      if (r.distance() > 20) {
        r.apply(step('forward', [60]))
        r.apply(step('turnRight'))
      } else {
        r.apply(step('turnRight'))
        r.apply(step('forward', [30]))
      }
    }
    expect(r.atGoal()).toBe(true)
    expect(r.bumps).toBe(0)
  })
})
