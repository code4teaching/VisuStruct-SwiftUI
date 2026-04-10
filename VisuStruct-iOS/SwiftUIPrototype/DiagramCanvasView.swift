import SwiftUI
import VisuStructCore
#if canImport(UIKit)
import UIKit
#endif

struct DiagramCanvasView: View {
    let document: VisuStructDocument

    @State private var scale: CGFloat = 1
    @State private var pan: CGSize = .zero

    private let lineHeight: CGFloat = 20
    private let headerFontSize: CGFloat = 15

    var body: some View {
        let engine = VisuStructLayoutEngine()
        let layout = engine.layout(document: document)

        Canvas { context, size in
            let bg = Color(white: 0.98)
            context.fill(Path(CGRect(origin: .zero, size: size)), with: .color(bg))

            context.translateBy(x: pan.width, y: pan.height)
            context.scaleBy(x: scale, y: scale)

            // Rahmen wie Java (10px)
            let frameRect = CGRect(x: 10, y: 10, width: layout.canvasSize.width - 21, height: layout.canvasSize.height - 21)
            context.stroke(Path(frameRect), with: .color(.gray.opacity(0.6)), lineWidth: 1)

            if !document.caption.isEmpty {
                let captionW = measureText(document.caption, size: 20)
                let cx = 10 + (layout.canvasSize.width - 21) / 2 - captionW / 2
                let t = context.resolve(Text(document.caption).font(.system(size: 20, weight: .regular)))
                context.draw(t, at: CGPoint(x: cx, y: 30), anchor: .topLeading)
            }

            for n in layout.elements {
                drawNode(n, in: &context)
            }
        }
        .frame(
            width: min(1400, max(320, layout.canvasSize.width)),
            height: min(1000, max(320, layout.canvasSize.height))
        )
        .clipped()
        .gesture(
            SimultaneousGesture(
                DragGesture()
                    .onChanged { value in
                        pan = CGSize(width: pan.width + value.translation.width, height: pan.height + value.translation.height)
                    },
                MagnifyGesture()
                    .onChanged { value in
                        scale = max(0.25, min(4.0, scale * value.magnification))
                    }
            )
        )
    }

    private func drawNode(_ node: VisuStructLayout.Node, in context: inout GraphicsContext) {
        let r = CGRect(x: node.frame.x, y: node.frame.y, width: node.frame.width, height: node.frame.height)
        let isMulti = node.element.type == .verzweigung || node.element.type == .fallauswahl
        let headerH: CGFloat = {
            guard isMulti else { return 0 }
            let h = node.headerBandHeight > 0 ? node.headerBandHeight : headerHeightApprox(node)
            return CGFloat(h)
        }()

        if !isMulti {
            context.fill(Path(r), with: .color(Color(white: 1.0)))
            context.stroke(Path(r), with: .color(.gray.opacity(0.85)), lineWidth: 1)
        } else {
            // Außenrahmen wie Java (`drawRect` über gesamten `bereich`)
            context.fill(Path(r), with: .color(Color(white: 1.0)))
            context.stroke(Path(r), with: .color(.gray.opacity(0.85)), lineWidth: 1)
            let bodyTop = r.minY + headerH
            if bodyTop < r.maxY {
                let body = CGRect(x: r.minX, y: bodyTop, width: r.width, height: r.height - headerH)
                context.stroke(Path(body), with: .color(.gray.opacity(0.85)), lineWidth: 1)
            }
        }

        switch node.element.type {
        case .aufruf:
            context.stroke(Path { p in
                p.move(to: CGPoint(x: r.minX + 10, y: r.minY))
                p.addLine(to: CGPoint(x: r.minX + 10, y: r.maxY))
                p.move(to: CGPoint(x: r.maxX - 10, y: r.minY))
                p.addLine(to: CGPoint(x: r.maxX - 10, y: r.maxY))
            }, with: .color(.gray.opacity(0.85)), lineWidth: 1)
        case .aussprung:
            context.stroke(Path { p in
                p.move(to: CGPoint(x: r.minX + 10, y: r.minY))
                p.addLine(to: CGPoint(x: r.minX, y: r.midY))
                p.addLine(to: CGPoint(x: r.minX + 10, y: r.maxY))
            }, with: .color(.gray.opacity(0.85)), lineWidth: 1)
        default:
            break
        }

        if isMulti, let dividerX = node.dividerX {
            let yInset = CGFloat(node.dividerYInset ?? 0)
            context.stroke(Path { p in
                let topLeft = CGPoint(x: r.minX, y: r.minY)
                let apex = CGPoint(x: dividerX, y: r.minY + headerH + yInset)
                let topRight = CGPoint(x: r.maxX, y: r.minY)
                p.move(to: topLeft)
                p.addLine(to: apex)
                p.addLine(to: topRight)
            }, with: .color(.gray.opacity(0.85)), lineWidth: 1)

            let lines = node.element.textLines
            for (i, line) in lines.enumerated() {
                let y = r.minY + 8 + CGFloat(i) * lineHeight
                let tw = measureText(line, size: headerFontSize)
                let tx = r.midX - tw / 2
                context.draw(
                    context.resolve(Text(line).font(.system(size: headerFontSize))),
                    at: CGPoint(x: tx, y: y),
                    anchor: .topLeading
                )
            }
        } else {
            let lines = node.element.textLines
            if node.element.type == .doUntilSchleife {
                var y = r.maxY - 15.0
                for line in lines.reversed() {
                    context.draw(
                        context.resolve(Text(line).font(.system(size: headerFontSize))),
                        at: CGPoint(x: r.minX + 12, y: y),
                        anchor: .topLeading
                    )
                    y -= lineHeight
                }
            } else {
                var y = r.minY + 8
                for line in lines {
                    context.draw(
                        context.resolve(Text(line).font(.system(size: headerFontSize))),
                        at: CGPoint(x: r.minX + 12, y: y),
                        anchor: .topLeading
                    )
                    y += lineHeight
                }
            }
        }

        for c in node.children {
            drawNode(c, in: &context)
        }

        if isMulti, let dividerX = node.dividerX, node.caseColumnFrames.count > 1 {
            let yInset = CGFloat(node.dividerYInset ?? 0)
            let apex = CGPoint(x: dividerX, y: r.minY + headerH + yInset)
            let lineColor = Color.gray.opacity(0.85)
            for (idx, col) in node.caseColumnFrames.enumerated() where idx < node.caseColumnFrames.count - 1 {
                let xSep = CGFloat(col.x + col.width)
                let yTop = yOnSwitchHeaderDiagonal(xSep: xSep, rect: r, apex: apex)
                context.stroke(Path { p in
                    p.move(to: CGPoint(x: xSep, y: r.maxY))
                    p.addLine(to: CGPoint(x: xSep, y: yTop))
                }, with: .color(lineColor), lineWidth: 1)
            }

            if let cases = node.element.cases, cases.count == node.caseColumnFrames.count {
                let labelY = r.minY + headerH - 5
                if node.element.type == .verzweigung && cases.count == 2 {
                    let left = "true"
                    let right = "false"
                    let rw = measureText(right, size: headerFontSize)
                    context.draw(
                        context.resolve(Text(left).font(.system(size: headerFontSize))),
                        at: CGPoint(x: r.minX + 5, y: labelY),
                        anchor: .bottomLeading
                    )
                    let rx = node.caseColumnFrames[1].x + node.caseColumnFrames[1].width - 5 - rw
                    context.draw(
                        context.resolve(Text(right).font(.system(size: headerFontSize))),
                        at: CGPoint(x: rx, y: labelY),
                        anchor: .bottomLeading
                    )
                } else {
                    for (idx, c) in cases.enumerated() {
                        let col = node.caseColumnFrames[idx]
                        let label = c.name
                        let tw = measureText(label, size: headerFontSize)
                        let cx = col.x + col.width / 2 - tw / 2
                        context.draw(
                            context.resolve(Text(label).font(.system(size: headerFontSize))),
                            at: CGPoint(x: cx, y: labelY),
                            anchor: .bottomLeading
                        )
                    }
                }
            }
        }
    }

    private func yOnSwitchHeaderDiagonal(xSep: CGFloat, rect: CGRect, apex: CGPoint) -> CGFloat {
        let topY = rect.minY
        let leftX = rect.minX
        if xSep <= apex.x {
            let run = apex.x - leftX
            if abs(run) < 0.5 { return apex.y }
            let slope = (apex.y - topY) / run
            return topY + slope * (xSep - leftX)
        }
        let run = rect.maxX - apex.x
        if abs(run) < 0.5 { return apex.y }
        let slope = (topY - apex.y) / run
        return apex.y + slope * (xSep - apex.x)
    }

    private func headerHeightApprox(_ node: VisuStructLayout.Node) -> Double {
        let lines = max(1, node.element.textLines.count)
        let base: Double
        switch node.element.type {
        case .fallauswahl: base = 40
        case .verzweigung: base = 20
        case .anweisung, .aussprung, .aufruf, .leerElement: base = 10
        default: base = 20
        }
        return base + Double(lines) * Double(lineHeight) + Double(node.element.zoomY)
    }

    private func measureText(_ s: String, size: CGFloat) -> CGFloat {
        #if canImport(UIKit)
        return (s as NSString).size(withAttributes: [.font: UIFont.systemFont(ofSize: size)]).width
        #else
        return CGFloat(s.count) * size * 0.55
        #endif
    }
}
