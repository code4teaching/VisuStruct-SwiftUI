import { describe, expect, it } from 'vitest'
import { makeMBotAction } from '../src/core/mbot'
import { RobotWorld } from '../src/core/robotWorld'

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
    expect(w.distance()).toBe(93)
    act(w, 'forward', 500)
    expect(w.pose.y).toBeCloseTo(91)
    expect(w.bumps).toBe(1)
  })

  it('sieht eine Wand vor sich', () => {
    const w = new RobotWorld({ width: 200, depth: 200, start: { x: 0, y: 0, heading: 0 }, walls: [{ from: { x: -20, y: 40 }, to: { x: 20, y: 40 } }], lines: [] })
    expect(w.distance()).toBe(33)
    act(w, 'turnLeft', 90)
    expect(w.distance()).toBe(93)
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
