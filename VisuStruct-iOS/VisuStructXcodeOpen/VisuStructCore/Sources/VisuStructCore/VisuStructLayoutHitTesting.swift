import Foundation
import CoreGraphics

extension VisuStructLayout {
    /// Alle Layout-Knoten, Eltern vor Kindern (zeichnen-Reihenfolge).
    public func flattenedNodesDepthFirst() -> [Node] {
        var out: [Node] = []
        func walk(_ nodes: [Node]) {
            for n in nodes {
                out.append(n)
                walk(n.children)
            }
        }
        walk(elements)
        return out
    }

    /// Treffer mit kleinster Kachel-Fläche (= möglichst tiefer/tiefgestellter Knoten).
    public func hitTest(layoutPoint: CGPoint) -> Node? {
        let px = Double(layoutPoint.x)
        let py = Double(layoutPoint.y)
        let hits = flattenedNodesDepthFirst().filter { n in
            let r = n.frame
            return px >= r.x && py >= r.y && px <= r.x + r.width && py <= r.y + r.height
        }
        return hits.min(by: {
            area($0.frame) < area($1.frame)
        })
    }

    private func area(_ r: VisuStructRect) -> Double {
        max(0, r.width) * max(0, r.height)
    }
}
