import { describe, expect, it } from 'vitest'
import type { LiveLabels } from '../src/core/codeGenerator'
import { parseLiveJava } from '../src/core/javaParser'
import { documentFromJava } from '../src/core/liveSource'
import { previewRun } from '../src/core/robotPreview'
import { emptyWorld } from '../src/core/robotWorld'

const labels: LiveLabels = { condition: 'Bedingung', selector: 'Wert', code: 'Dein Code', start: 'Startwert', step: 'Schritt', end: 'Ende' }
const doc = (java: string) => documentFromJava({ caption: '', elements: [] }, parseLiveJava(java, labels))

describe('mBot2-Vorschau beim Bearbeiten', () => {
  it('rechnet das ganze Programm durch und merkt sich jedes Bild der Fahrt', () => {
    const r = previewRun(doc('for (int i = 0; i < 4; i++) {\n  mbot.forward(30);\n  mbot.turnRight();\n}'), undefined, emptyWorld)
    expect(r.stop).toBe('end')
    expect(r.frames).toHaveLength(9)
    expect(r.distance).toBe(120)
    const last = r.frames.at(-1)!
    expect(last.pose.x).toBeCloseTo(0)
    expect(last.pose.y).toBeCloseTo(0)
  })

  it('leeres Programm: der mBot2 bleibt am Start', () => {
    const r = previewRun(doc(''), undefined, emptyWorld)
    expect(r.stop).toBe('end')
    expect(r.frames).toHaveLength(1)
    expect(r.distance).toBe(0)
  })

  it('Sensoren kommen aus der Welt: bis zur Wand und nicht weiter', () => {
    const r = previewRun(doc('while (mbot.getDistance() > 10) {\n  mbot.forward();\n}'), undefined, emptyWorld)
    expect(r.stop).toBe('end')
    expect(r.bumps).toBe(0)
    expect(r.frames.at(-1)!.pose.y).toBeGreaterThan(70)
  })

  it('merkt Töne, LEDs und Bildschirm', () => {
    const r = previewRun(doc('mbot.playTone(440, 200);\nmbot.setLed(255, 0, 0);\nmbot.showText("Hallo");'), undefined, emptyWorld)
    expect(r.frames[1].tone).toEqual([440, 200])
    expect(r.frames.at(-1)!.leds.some((c) => c !== undefined)).toBe(true)
    expect(r.frames.at(-1)!.screen).toBe('Hallo')
  })

  it('hält bei einer Eingabe und bei einer Endlosschleife an', () => {
    expect(previewRun(doc('Scanner scanner = new Scanner(System.in);\nint n = scanner.nextInt();\nmbot.forward(n);'), undefined, emptyWorld).stop).toBe('input')
    expect(previewRun(doc('while (true) {\n  mbot.turnRight();\n}'), undefined, emptyWorld).stop).toBe('limit')
  })
})
