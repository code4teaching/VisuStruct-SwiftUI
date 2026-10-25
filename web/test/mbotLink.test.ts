import { describe, expect, it } from 'vitest'
import { ASK, pythonFrame, readAnswers, RUN } from '../src/core/mbotLink'

const bytes = (hex: string) => hex.split(' ').map((h) => parseInt(h, 16))
const hex = (a: Uint8Array) => Array.from(a, (b) => b.toString(16).padStart(2, '0')).join(' ')

// Rahmen aus Holgers Protokoll mit dem echten mBot2 (25.10.2026)
describe('mBot2 über USB', () => {
  it('verpackt Python-Zeilen wie die Firmware sie erwartet', () => {
    expect(hex(pythonFrame('mbot2.turn(90)', RUN, 8))).toBe('f3 07 14 00 28 04 08 00 0e 00 6d 62 6f 74 32 2e 74 75 72 6e 28 39 30 29 d7 f4')
    expect(hex(pythonFrame('mbuild.ultrasonic2.get(1)', ASK, 10))).toBe(
      'f3 12 1f 00 28 01 0a 00 19 00 6d 62 75 69 6c 64 2e 75 6c 74 72 61 73 6f 6e 69 63 32 2e 67 65 74 28 31 29 5d f4',
    )
  })

  it('liest Antworten, auch zerstückelt und nach Textmüll', () => {
    const answer = (body: string) => {
      const b = bytes(body)
      const len = b.length
      return [0xf3, (0xf3 + len) & 0xff, len, 0, ...b, b.reduce((x, y) => x + y, 0) & 0xff, 0xf4]
    }
    const distance = answer('28 01 0a 00 0c 00 7b 22 72 65 74 22 3a 39 33 2e 39 7d')
    const none = answer('28 01 02 00 0c 00 7b 22 72 65 74 22 3a 4e 6f 6e 65 7d')
    const ping = answer('0d 00 00')
    const rx = [0x29, 0x81, ...ping, ...distance.slice(0, 7)]
    expect(readAnswers(rx)).toEqual([])
    rx.push(...distance.slice(7), ...none)
    expect(readAnswers(rx)).toEqual([
      { idx: 10, value: 93.9 },
      { idx: 2, value: null },
    ])
    expect(rx).toEqual([])
  })
})
