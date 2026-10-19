import SwiftUI
import VisuStructCore
#if canImport(UIKit)
import UIKit
#endif

// MARK: - Zeichnen (Canvas: Kacheln, Linien, Text)

extension DiagramCanvasView {
    func canvasView(layout: VisuStructLayout, cw: CGFloat, ch: CGFloat) -> some View {
        Canvas { context, size in
            context.fill(Path(CGRect(origin: .zero, size: size)), with: .color(diagramCanvasFill))

            let marginBase = exportCanvasOuterMarginPt ?? DiagramCanvasInk.canvasOuterMargin
            let m = ink(marginBase)
            let innerTrim: CGFloat = 1
            let frameRect = CGRect(
                x: m,
                y: m,
                width: CGFloat(layout.canvasSize.width) - 2 * m - innerTrim,
                height: CGFloat(layout.canvasSize.height) - 2 * m - innerTrim
            )
            let outerFramePath = Path(frameRect)
            context.stroke(outerFramePath, with: .color(Color.black), lineWidth: ink(DiagramCanvasInk.outerFrameLineWidth))

            for n in layout.elements {
                drawNode(n, selectedPath: selectedPath, in: &context, parentType: nil)
            }
        }
        .frame(width: cw, height: ch)
    }

    /// Dachspitze + Textgrenze für Verzweigung/Fallauswahl; **zwei** Zeichenphasen müssen dieselbe Spitze nutzen (sonst „springen“ senkrechte Linien).
    struct MultiwayRoofMetrics {
        let apex: CGPoint
        let maxTextBottom: CGFloat
        let roofBottom: CGFloat
    }

    func multiwayRoofMetrics(node: VisuStructLayout.Node, rect r: CGRect, headerH: CGFloat, dividerX: CGFloat) -> MultiwayRoofMetrics {
        let roofBottom = r.minY + headerH
        let yInset = CGFloat(node.dividerYInset ?? 0)
        let lines = node.element.textLines
        let apexPadding: CGFloat = 12
        let blockH = CGFloat(max(lines.count, 1)) * lineHeight
        let topStart = r.minY + ink(DiagramCanvasInk.multiHeaderFirstLineY)

        if node.element.type == .fallauswahl {
            let caseBand = max(ink(DiagramCanvasInk.fallauswahlCaseLabelBand), lineHeight + ink(10))
            let titleBottomLimit = roofBottom - caseBand
            let maxTextBottom = titleBottomLimit - apexPadding
            let idealApexY = roofBottom + yInset
            let apexMaxY = titleBottomLimit - 8
            let apexY = min(idealApexY, apexMaxY)
            let apexClampedY = max(apexY, topStart + blockH + 6)
            return MultiwayRoofMetrics(
                apex: CGPoint(x: dividerX, y: apexClampedY),
                maxTextBottom: maxTextBottom,
                roofBottom: roofBottom
            )
        }
        let apex = CGPoint(x: dividerX, y: roofBottom + yInset)
        return MultiwayRoofMetrics(
            apex: apex,
            maxTextBottom: apex.y - apexPadding,
            roofBottom: roofBottom
        )
    }

    func strokeDiagramCellBorder(
        _ r: CGRect,
        omitting omission: CellBorderOmission,
        in context: inout GraphicsContext,
        linePaint: Color,
        lineWidth: CGFloat
    ) {
        if omission.isEmpty {
            context.stroke(Path(r), with: .color(linePaint), lineWidth: lineWidth)
            return
        }
        if !omission.contains(.top) {
            context.stroke(
                Path { p in
                    p.move(to: CGPoint(x: r.minX, y: r.minY))
                    p.addLine(to: CGPoint(x: r.maxX, y: r.minY))
                },
                with: .color(linePaint),
                lineWidth: lineWidth
            )
        }
        if !omission.contains(.right) {
            context.stroke(
                Path { p in
                    p.move(to: CGPoint(x: r.maxX, y: r.minY))
                    p.addLine(to: CGPoint(x: r.maxX, y: r.maxY))
                },
                with: .color(linePaint),
                lineWidth: lineWidth
            )
        }
        if !omission.contains(.bottom) {
            context.stroke(
                Path { p in
                    p.move(to: CGPoint(x: r.maxX, y: r.maxY))
                    p.addLine(to: CGPoint(x: r.minX, y: r.maxY))
                },
                with: .color(linePaint),
                lineWidth: lineWidth
            )
        }
        if !omission.contains(.left) {
            context.stroke(
                Path { p in
                    p.move(to: CGPoint(x: r.minX, y: r.maxY))
                    p.addLine(to: CGPoint(x: r.minX, y: r.minY))
                },
                with: .color(linePaint),
                lineWidth: lineWidth
            )
        }
    }

    func drawNode(
        _ node: VisuStructLayout.Node,
        selectedPath: [Int]?,
        in context: inout GraphicsContext,
        cellBorderOmission: CellBorderOmission = [],
        parentType: VisuStructElementType? = nil
    ) {
        let r = CGRect(x: node.frame.x, y: node.frame.y, width: node.frame.width, height: node.frame.height)
        let cellPath = Path(r)
        let isMulti = node.element.type == .verzweigung || node.element.type == .fallauswahl
        /// Exakt die Höhe, mit der das Layout die Spaltenkinder nach unten verschiebt (verhindert Überlappung Kopf/Zweig).
        let headerH: CGFloat = {
            guard isMulti else { return 0 }
            let h = node.headerBandHeight > 0 ? node.headerBandHeight : headerHeightApprox(node)
            return CGFloat(h)
        }()
        let isSelected = node.idPath == selectedPath
        let linePaint = diagramLineColor

        context.fill(cellPath, with: .color(isSelected ? (usesSimulationSelectionHighlight ? selectionFillColor : diagramCellFill) : diagramCellFill))
        strokeDiagramCellBorder(
            r,
            omitting: cellBorderOmission,
            in: &context,
            linePaint: linePaint,
            lineWidth: ink(DiagramCanvasInk.diagramLineWidth)
        )
        // Kein zweites Rechteck für Verzweigung/Fallauswahl: dessen Oberkante läge auf Höhe der Dreiecksspitze
        // und würde eine Sehne durch das V zeichnen sowie linke/rechte Kanten doppelt stroken („X“ / Doppellinien).

        switch node.element.type {
        case .aufruf:
            let bar = ink(DiagramCanvasInk.callSideBarInset)
            context.stroke(Path { p in
                p.move(to: CGPoint(x: r.minX + bar, y: r.minY))
                p.addLine(to: CGPoint(x: r.minX + bar, y: r.maxY))
                p.move(to: CGPoint(x: r.maxX - bar, y: r.minY))
                p.addLine(to: CGPoint(x: r.maxX - bar, y: r.maxY))
            }, with: .color(linePaint), lineWidth: ink(DiagramCanvasInk.diagramLineWidth))
        case .aussprung:
            let bar = ink(DiagramCanvasInk.callSideBarInset)
            context.stroke(Path { p in
                p.move(to: CGPoint(x: r.minX + bar, y: r.minY))
                p.addLine(to: CGPoint(x: r.minX, y: r.midY))
                p.addLine(to: CGPoint(x: r.minX + bar, y: r.maxY))
            }, with: .color(linePaint), lineWidth: ink(DiagramCanvasInk.diagramLineWidth))
        default:
            break
        }

        if isMulti, let dividerXRaw = node.dividerX {
            let dividerX = CGFloat(dividerXRaw)
            let roof = multiwayRoofMetrics(node: node, rect: r, headerH: headerH, dividerX: dividerX)
            let lines = displayTextLines(for: node.element)
            let blockH = CGFloat(max(lines.count, 1)) * lineHeight
            let topStart = r.minY + ink(DiagramCanvasInk.multiHeaderFirstLineY)

            context.stroke(Path { p in
                let topLeft = CGPoint(x: r.minX, y: r.minY)
                let topRight = CGPoint(x: r.maxX, y: r.minY)
                p.move(to: topLeft)
                p.addLine(to: roof.apex)
                p.addLine(to: topRight)
            }, with: .color(linePaint), lineWidth: ink(DiagramCanvasInk.diagramLineWidth))

            if node.element.type == .fallauswahl {
                context.stroke(
                    Path { p in
                        p.move(to: CGPoint(x: r.minX, y: roof.roofBottom))
                        p.addLine(to: CGPoint(x: r.maxX, y: roof.roofBottom))
                    },
                    with: .color(linePaint),
                    lineWidth: ink(DiagramCanvasInk.diagramLineWidth)
                )
            }

            // Kopftext: Fallauswahl zentriert zur Gesamtbreite; Verzweigung über der Dachspitze (Zweig-Grenze). Nicht zu nah an die Spitze.
            let maxTextBottom = roof.maxTextBottom
            let firstY: CGFloat
            if topStart + blockH <= maxTextBottom {
                firstY = topStart
            } else {
                let totalH = CGFloat(max(lines.count, 1) - 1) * lineHeight
                firstY = max(r.minY + 2, maxTextBottom - totalH - lineHeight)
            }
            for (i, line) in lines.enumerated() {
                let y = firstY + CGFloat(i) * lineHeight
                let tw: CGFloat = {
                    if let parts = VisuStructDiagramText.keywordSplit(line) {
                        let kwW = measureText(parts.keyword, size: headerFontSize, weight: .bold)
                        let restW = parts.rest.isEmpty ? 0 : measureText(" " + parts.rest, size: headerFontSize, weight: .medium)
                        return kwW + restW
                    }
                    return measureText(line, size: headerFontSize, weight: .medium)
                }()
                /// Verzweigung: Kopf über der **Zweig-Grenze** (Dachspitze), nicht über `midX` — sonst wirkt die Mitte falsch, wenn ein Zweig viel breiter ist (z. B. Fallauswahl im false-Zweig).
                let tx: CGFloat = {
                    if node.element.type == .verzweigung {
                        let ideal = dividerX - tw / 2
                        let lo = r.minX + ink(DiagramCanvasInk.cellTextInsetX)
                        let hi = r.maxX - tw - ink(DiagramCanvasInk.cellTextInsetX)
                        return min(max(ideal, lo), hi)
                    }
                    return r.midX - tw / 2
                }()
                drawKeywordLine(line, elementType: node.element.type, at: CGPoint(x: tx, y: y), in: &context)
            }
        } else {
            let lines = displayTextLines(for: node.element)
            let ix = ink(DiagramCanvasInk.cellTextInsetX)
            let iy = ink(DiagramCanvasInk.cellTextInsetY)
            if node.element.type == .doUntilSchleife {
                /// „do“ wird nach den Rumpf-Kindern gezeichnet — sonst können weiße Kachelflächen den Text überdecken (siehe Block nach `drawNode` der Kinder).
            } else if node.element.type == .anweisung || node.element.type == .aufruf || node.element.type == .aussprung {
                // Anweisung, Aufruf, Aussprung: Text zentriert; bei Aufruf/Aussprung Platz für die seitlichen Striche.
                let bar = ink(DiagramCanvasInk.callSideBarInset)
                let contentLeft: CGFloat
                let contentRight: CGFloat
                switch node.element.type {
                case .aufruf:
                    let callTextInset = ink(DiagramCanvasInk.callTextInsetFromSideBar)
                    contentLeft = r.minX + bar + callTextInset
                    contentRight = r.maxX - bar - callTextInset
                case .aussprung:
                    contentLeft = r.minX + bar + ix
                    contentRight = r.maxX - ix
                default:
                    contentLeft = r.minX + ix
                    contentRight = r.maxX - ix
                }
                let contentWidth = max(0, contentRight - contentLeft)
                let totalTextHeight = CGFloat(max(1, lines.count)) * lineHeight
                var y = r.midY - totalTextHeight / 2
                for line in lines {
                    let tw: CGFloat = {
                        if let parts = VisuStructDiagramText.keywordSplit(line) {
                            let kwW = measureText(parts.keyword, size: headerFontSize, weight: .bold)
                            let restW = parts.rest.isEmpty ? 0 : measureText(" " + parts.rest, size: headerFontSize, weight: .medium)
                            return kwW + restW
                        }
                        return measureText(line, size: headerFontSize, weight: .medium)
                    }()
                    let x = contentLeft + (contentWidth - tw) / 2
                    drawKeywordLine(line, elementType: node.element.type, at: CGPoint(x: x, y: y), in: &context)
                    y += lineHeight
                }
            } else {
                let totalTextHeight = CGFloat(max(1, lines.count)) * lineHeight
                var y = parentType == .doUntilSchleife
                    ? (r.midY - totalTextHeight / 2)
                    : (r.minY + iy)
                for line in lines {
                    drawKeywordLine(line, elementType: node.element.type, at: CGPoint(x: r.minX + ix, y: y), in: &context)
                    y += lineHeight
                }
            }
        }

        for (idx, c) in node.children.enumerated() {
            let childOmission: CellBorderOmission = (node.element.type == .doUntilSchleife && idx == 0) ? [.top, .left] : []
            drawNode(c, selectedPath: selectedPath, in: &context, cellBorderOmission: childOmission, parentType: node.element.type)
        }

        if node.element.type == .doUntilSchleife {
            /// Senkrechte / Rumpf: X = Layout-Kante = `minX` + `loopBodyLeadingInset` (aus **gemessener** Bold-Breite „do“ + Padding in `doUntilBodyLeadingInset()`).
            let dividerX = node.children.first.map { CGFloat($0.frame.x) }
                ?? (r.minX + CGFloat(node.loopBodyLeadingInset > 0 ? node.loopBodyLeadingInset : DiagramCanvasInk.loopBodyLeadingInset))
            let kwFont: Font = .system(size: headerFontSize, weight: .bold)
            let xDo = r.minX + ink(4)
            /// Oben im linken Streifen — nur wenige Punkte unter der Kante (`doUntilDoLabelTopInset`), nicht voller Zellen-Einzug.
            let doTextTop = r.minY + CGFloat(layoutMetrics.doUntilDoLabelTopInset)
            context.draw(
                context.resolve(Text(verbatim: "do").font(kwFont).foregroundStyle(.black)),
                at: CGPoint(x: xDo, y: doTextTop),
                anchor: .topLeading
            )

            let footerH = CGFloat(node.headerBandHeight)
            let ySep = r.maxY - footerH
            /// Rumpf beginnt auf der Oberkante der Schleife — kein separates „do“-Band mehr (`topBandHeight` ≈ 0).
            let bodyTopY = r.minY
            let lw = ink(DiagramCanvasInk.diagramLineWidth)
            context.stroke(
                Path { p in
                    p.move(to: CGPoint(x: dividerX, y: ySep))
                    p.addLine(to: CGPoint(x: r.maxX, y: ySep))
                },
                with: .color(linePaint),
                lineWidth: lw
            )
            context.stroke(
                Path { p in
                    p.move(to: CGPoint(x: dividerX, y: bodyTopY))
                    p.addLine(to: CGPoint(x: dividerX, y: ySep))
                },
                with: .color(linePaint),
                lineWidth: lw
            )
            let lines = displayTextLines(for: node.element)
            let ix = ink(DiagramCanvasInk.cellTextInsetX)
            var y = ySep + CGFloat(layoutMetrics.doUntilFooterTopInset)
            for line in lines {
                drawKeywordLine(line, elementType: node.element.type, at: CGPoint(x: r.minX + ix, y: y), in: &context)
                y += lineHeight
            }
        }

        if isMulti, let dividerXRaw = node.dividerX, node.caseColumnFrames.count > 1 {
            let dividerX = CGFloat(dividerXRaw)
            let roof = multiwayRoofMetrics(node: node, rect: r, headerH: headerH, dividerX: dividerX)
            let apex = roof.apex
            for (idx, col) in node.caseColumnFrames.enumerated() where idx < node.caseColumnFrames.count - 1 {
                let xSep = CGFloat(col.x + col.width)
                let yTopRaw = yOnSwitchHeaderDiagonal(xSep: xSep, rect: r, apex: apex)
                let yTop = yTopRaw.isFinite ? min(max(yTopRaw, r.minY), r.maxY) : r.minY
                context.stroke(Path { p in
                    p.move(to: CGPoint(x: xSep, y: r.maxY))
                    p.addLine(to: CGPoint(x: xSep, y: yTop))
                }, with: .color(linePaint), lineWidth: ink(DiagramCanvasInk.diagramLineWidth))
            }

            if let cases = node.element.cases, cases.count == node.caseColumnFrames.count {
                /// Fallauswahl: etwas höher setzen, damit „1/2/default“ nicht in die Dachkanten rutschen; Verzweigung: knapp über dem Rumpf wie in Java.
                let labelY: CGFloat = {
                    if node.element.type == .fallauswahl {
                        /// Am unteren Rand des Kopfteils (über Rumpf), passend zur waagerechten Linie bei `roofBottom`.
                        return roof.roofBottom - 6
                    }
                    return r.minY + headerH - 8
                }()
                let lx = ink(DiagramCanvasInk.branchLabelInsetX)
                if node.element.type == .verzweigung && cases.count == 2 {
                    let left = "true"
                    let right = "false"
                    let kwFont: Font = .system(size: headerFontSize, weight: .bold)
                    let rw = measureText(right, size: headerFontSize, weight: .bold)
                    context.draw(
                        context.resolve(Text(verbatim: left).font(kwFont).foregroundStyle(.black)),
                        at: CGPoint(x: r.minX + lx, y: labelY),
                        anchor: .bottomLeading
                    )
                    let rx = node.caseColumnFrames[1].x + node.caseColumnFrames[1].width - lx - rw
                    context.draw(
                        context.resolve(Text(verbatim: right).font(kwFont).foregroundStyle(.black)),
                        at: CGPoint(x: rx, y: labelY),
                        anchor: .bottomLeading
                    )
                } else {
                    for (idx, c) in cases.enumerated() {
                        let col = node.caseColumnFrames[idx]
                        let label = c.name
                        let isKeywordLabel = ["default", "true", "false"].contains(label.lowercased())
                        let w: UIFont.Weight = isKeywordLabel ? .bold : .medium
                        let f: Font = .system(size: headerFontSize, weight: isKeywordLabel ? .bold : .medium)
                        let tw = measureText(label, size: headerFontSize, weight: w)
                        let cx = col.x + col.width / 2 - tw / 2
                        context.draw(
                            context.resolve(Text(verbatim: label).font(f).foregroundStyle(.black)),
                            at: CGPoint(x: cx, y: labelY),
                            anchor: .bottomLeading
                        )
                    }
                }
            }
        }

        // Auswahlrahmen IMMER zuletzt zeichnen, damit Kinder/Innenlinien ihn nicht übermalen (v. a. bei verschachtelten Verzweigungen/Fallauswahl).
        if isSelected {
            context.stroke(cellPath, with: .color(selectionStrokeColor), lineWidth: ink(DiagramCanvasInk.selectionLineWidth))
        }
    }

    func yOnSwitchHeaderDiagonal(xSep: CGFloat, rect: CGRect, apex: CGPoint) -> CGFloat {
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

    func headerHeightApprox(_ node: VisuStructLayout.Node) -> Double {
        let e = node.element
        let lines = max(1, e.textLines.count)
        if e.type == .doUntilSchleife {
            return layoutMetrics.doUntilFooterTopInset + Double(lines) * layoutMetrics.lineHeight + layoutMetrics.doUntilFooterBottomInset + Double(e.zoomY)
        }
        let baseExtra: Double
        switch e.type {
        case .anweisung, .aussprung, .aufruf, .leerElement:
            baseExtra = 14
        case .fallauswahl:
            baseExtra = 40
        case .verzweigung:
            baseExtra = 20
        case .doUntilSchleife:
            preconditionFailure("Do-Until-Fuß nur über den dedizierten Zweig oben.")
        case .forSchleife, .whileSchleife, .endlosschleife:
            baseExtra = layoutMetrics.baseHeaderExtra + 4
        @unknown default:
            baseExtra = layoutMetrics.baseHeaderExtra
        }
        return baseExtra + Double(lines) * layoutMetrics.lineHeight + Double(e.zoomY)
    }

    /// NSString-Messung ist korrekt, aber teuer bei vielen Zeilen — Cache mit begrenzter Größe.
    #if canImport(UIKit)
    static let textWidthCache: NSCache<NSString, NSNumber> = {
        let c = NSCache<NSString, NSNumber>()
        c.countLimit = 400
        return c
    }()
    #endif

    func measureText(_ s: String, size: CGFloat, weight: UIFont.Weight = .medium) -> CGFloat {
        #if canImport(UIKit)
        let key = "\(Int((size * 1000).rounded()))|\(weight.rawValue)|\(s)" as NSString
        if let cached = Self.textWidthCache.object(forKey: key) {
            return CGFloat(truncating: cached)
        }
        let w = (s as NSString).size(withAttributes: [
            .font: UIFont.systemFont(ofSize: size, weight: weight)
        ]).width
        Self.textWidthCache.setObject(NSNumber(value: Double(w)), forKey: key)
        return w
        #else
        return CGFloat(s.count) * size * 0.55
        #endif
    }

    func drawKeywordLine(_ line: String, elementType: VisuStructElementType, at origin: CGPoint, in context: inout GraphicsContext) {
        if let parts = VisuStructDiagramText.keywordSplit(line) {
            let kwFont: Font = .system(size: headerFontSize, weight: .bold)
            let kw = parts.keyword
            let rest = parts.rest
            let kwW = measureText(kw, size: headerFontSize, weight: .bold)
            context.draw(
                context.resolve(Text(verbatim: kw).font(kwFont).foregroundStyle(.black)),
                at: origin,
                anchor: .topLeading
            )
            if !rest.isEmpty {
                context.draw(
                    context.resolve(Text(verbatim: " " + rest).font(cellFont).foregroundStyle(.black)),
                    at: CGPoint(x: origin.x + kwW, y: origin.y),
                    anchor: .topLeading
                )
            }
        } else {
            context.draw(
                context.resolve(Text(verbatim: line).font(cellFont).foregroundStyle(.black)),
                at: origin,
                anchor: .topLeading
            )
        }
    }
}
