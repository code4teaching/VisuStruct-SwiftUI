// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { addNode, connect, emptyFlow, flowBox, flowFromJSON, flowToJSON, freePort, portSide, removeNode, routeEdge, swapYesNo } from '../src/core/flowModel'

const measure = (s: string) => s.length * 7

function sample() {
  let doc = emptyFlow('Test')
  const ids: string[] = []
  for (const [shape, y] of [['start', 60], ['verzweigung', 200], ['anweisung', 340], ['ende', 460]] as const) {
    const r = addNode(doc, shape, 240, y, shape)
    doc = r.doc
    ids.push(r.id)
  }
  return { doc, ids }
}

describe('VisuFlow (PAP)', () => {
  it('verbindet Ausgänge mit Eingängen, ein Pfeil pro Ausgang', () => {
    const { doc, ids } = sample()
    let d = connect(doc, ids[0], 'out', ids[1])
    d = connect(d, ids[1], 'ja', ids[2])
    d = connect(d, ids[1], 'ja', ids[3])
    expect(d.edges.filter((e) => e.from === ids[1])).toEqual([expect.objectContaining({ port: 'ja', to: ids[3] })])
    expect(freePort(d, d.nodes[1])).toBe('nein')
    // Start hat keinen Eingang, Ende keinen Ausgang, kein Pfeil auf sich selbst.
    expect(connect(d, ids[2], 'out', ids[0])).toBe(d)
    expect(connect(d, ids[3], 'out', ids[2])).toBe(d)
    expect(connect(d, ids[2], 'out', ids[2])).toBe(d)
  })

  it('Löschen nimmt die Pfeile mit, Datei geht hin und zurück', () => {
    const { doc, ids } = sample()
    let d = connect(connect(doc, ids[0], 'out', ids[1]), ids[1], 'nein', ids[2])
    d = swapYesNo(d, ids[1])
    const back = flowFromJSON(flowToJSON(d))!
    expect(back.title).toBe('Test')
    expect(back.nodes).toEqual(d.nodes)
    expect(back.edges.map((e) => [e.from, e.port, e.to])).toEqual(d.edges.map((e) => [e.from, e.port, e.to]))
    expect(portSide(back, back.nodes[1], 'ja')).toBe('right')
    expect(removeNode(d, ids[1]).edges).toEqual([])
    expect(flowFromJSON('kein json')).toBeUndefined()
  })

  it('Pfeil zurück nach oben läuft rechts an beiden Symbolen vorbei', () => {
    const { doc } = sample()
    const top = flowBox(doc.nodes[1], measure)
    const low = flowBox(doc.nodes[2], measure)
    const down = routeEdge(top, 'bottom', low)
    expect(down).toEqual([[240, top.y + top.h / 2], [240, low.y - low.h / 2]])
    const up = routeEdge(low, 'bottom', top)
    const right = Math.max(top.x + top.w / 2, low.x + low.w / 2)
    expect(up.some(([x]) => x > right)).toBe(true)
    expect(up.at(-1)).toEqual([240, top.y - top.h / 2])
  })
})
