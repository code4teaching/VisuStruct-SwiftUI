import Foundation

public struct VisuStructRect: Equatable, Sendable, Codable {
    public var x: Double
    public var y: Double
    public var width: Double
    public var height: Double

    public init(x: Double, y: Double, width: Double, height: Double) {
        self.x = x
        self.y = y
        self.width = width
        self.height = height
    }
}

/// Layout-Ergebnis für Rendering/Hit-Testing.
public struct VisuStructLayout: Equatable, Sendable {
    public struct CanvasSize: Equatable, Sendable, Codable {
        public var width: Double
        public var height: Double

        public init(width: Double, height: Double) {
            self.width = width
            self.height = height
        }
    }

    public var canvasSize: CanvasSize
    public var elements: [Node]

    public init(canvasSize: CanvasSize, elements: [Node]) {
        self.canvasSize = canvasSize
        self.elements = elements
    }

    public struct Node: Equatable, Sendable {
        public var idPath: [Int]              // stabiler Pfad im Baum (für Auswahl)
        public var element: VisuStructElement // Originaldaten
        public var frame: VisuStructRect

        /// Höhe des Kopfbands wie beim Layout (Verzweigung/Fallauswahl: Trennung zu Spalteninhalten). Muss mit `DiagramCanvasView` übereinstimmen.
        public var headerBandHeight: Double

        /// Für spezielle Zeichnung (Fallauswahl/Verzweigung).
        public var caseColumnFrames: [VisuStructRect] = []
        public var dividerX: Double? = nil   // xVerschiebungFuerTrennlinie (Verzweigung/Fallauswahl)
        public var dividerYInset: Double? = nil // yVerschiebungFuerTrennLinie (Fallauswahl)

        /// Fallauswahl/Verzweigung: Kinder pro Spalte (für Streckung gleicher Elternbreite).
        public var columns: [[Node]]? = nil

        public var children: [Node] = []

        public init(idPath: [Int], element: VisuStructElement, frame: VisuStructRect, headerBandHeight: Double = 0) {
            self.idPath = idPath
            self.element = element
            self.frame = frame
            self.headerBandHeight = headerBandHeight
        }
    }
}

/// Näherung an Java-Layout (Pixelwerte sind an iOS-Schriftmetrics gebunden; hier bewusst pragmatisch).
public struct VisuStructLayoutEngine: Sendable {
    public struct Metrics: Sendable {
        public var fontSize: Double
        public var lineHeight: Double
        public var charWidth: Double

        public var baseHeaderExtra: Double // entspricht grob `obererRandZusatz`
        public var minSidePadding: Double

        public init(
            fontSize: Double = 15,
            lineHeight: Double = 20,
            charWidth: Double = 7,
            baseHeaderExtra: Double = 20,
            minSidePadding: Double = 42
        ) {
            self.fontSize = fontSize
            self.lineHeight = lineHeight
            self.charWidth = charWidth
            self.baseHeaderExtra = baseHeaderExtra
            self.minSidePadding = minSidePadding
        }
    }

    public var metrics: Metrics

    public init(metrics: Metrics = Metrics()) {
        self.metrics = metrics
    }

    /// Gleiche Typometrie wie in der iOS-`DiagramCanvasView` (Export/Druck und Editor nutzen dieselben Werte).
    public static func diagramDisplayMetrics(isRegularWidth: Bool) -> Metrics {
        let dF: Double = 2
        /// Etwas großzügigere Zeilenabstände im Diagramm (sichtbar + Layout konsistent).
        let dLH: Double = 5
        if isRegularWidth {
            let fontSize = 12 + dF
            let lineHeight = 16 + dLH
            return Metrics(
                fontSize: fontSize,
                lineHeight: lineHeight,
                charWidth: 5.5 * (fontSize / 12),
                baseHeaderExtra: 16 + dLH,
                minSidePadding: 40
            )
        }
        let b = Metrics()
        let fontSize = b.fontSize + dF
        let lineHeight = b.lineHeight + dLH
        return Metrics(
            fontSize: fontSize,
            lineHeight: lineHeight,
            charWidth: b.charWidth * (fontSize / b.fontSize),
            baseHeaderExtra: b.baseHeaderExtra + 2,
            minSidePadding: b.minSidePadding + 8
        )
    }

    public func layout(document: VisuStructDocument) -> VisuStructLayout {
        // Entspricht Java `randLinks/randOben` + Caption-Offsets in `Struktogramm.zeichenbereichAktualisieren`.
        let hasCaption = !document.caption.isEmpty
        let randLinks: Double = 28 + (hasCaption ? 24 : 0)
        let randOben: Double = 28 + (hasCaption ? 48 : 0)

        let nodes = layoutList(
            elements: document.elements,
            atX: randLinks,
            atY: randOben,
            idBase: []
        )

        // Canvas: gesamten Baum einbeziehen (nicht nur Root), sonst können tiefe Kinder über den Rand zeichnen.
        let (maxX, maxY) = subtreeContentMax(nodes)
        let canvasW = maxX + randLinks
        let canvasH = maxY + randOben

        return VisuStructLayout(canvasSize: .init(width: canvasW, height: canvasH), elements: nodes)
    }

    private func subtreeContentMax(_ nodes: [VisuStructLayout.Node]) -> (Double, Double) {
        var mx = 0.0
        var my = 0.0
        func walk(_ n: VisuStructLayout.Node) {
            mx = max(mx, n.frame.x + n.frame.width)
            my = max(my, n.frame.y + n.frame.height)
            for c in n.children { walk(c) }
        }
        for n in nodes { walk(n) }
        return (mx, my)
    }

    // MARK: - Private

    private func layoutList(elements: [VisuStructElement], atX x: Double, atY y: Double, idBase: [Int]) -> [VisuStructLayout.Node] {
        var out: [VisuStructLayout.Node] = []
        var curY = y
        for (i, e) in elements.enumerated() {
            let idPath = idBase + [i]
            let node = layoutElement(e, atX: x, atY: curY, idPath: idPath)
            out.append(node)
            curY += node.frame.height
        }

        // Alle Nodes auf gleiche Breite wie die breiteste (Java: `breiteDerUnterelementeSetzen`).
        let maxW = out.map { $0.frame.width }.max() ?? 0
        if maxW > 0 {
            out = out.map { stretchNodeTreeToWidth($0, newWidth: maxW) }
        }
        return out
    }

    /// Verzweigung/Fallauswahl: Spalten proportional, Kindknoten **pro Spalte** strecken (nie volle Kastenbreite auf jedes Kind).
    private func stretchMultiwayNodeToWidth(_ node: VisuStructLayout.Node, newWidth: Double) -> VisuStructLayout.Node {
        var n = node
        let oldW = n.frame.width
        guard oldW > 0, !n.caseColumnFrames.isEmpty else { return n }
        let scale = newWidth / oldW
        n.frame.width = newWidth
        var xCursor = n.frame.x
        var newFrames: [VisuStructRect] = []
        newFrames.reserveCapacity(n.caseColumnFrames.count)
        for col in n.caseColumnFrames {
            let nw = col.width * scale
            newFrames.append(VisuStructRect(x: xCursor, y: col.y, width: nw, height: col.height))
            xCursor += nw
        }
        n.caseColumnFrames = newFrames
        let lastW = newFrames.last?.width ?? 0
        n.dividerX = n.frame.x + newWidth - lastW
        if let grid = n.columns, grid.count == newFrames.count {
            var newCols: [[VisuStructLayout.Node]] = []
            for (idx, colNodes) in grid.enumerated() {
                let col = newFrames[idx]
                let stretchedCol = colNodes.map { cn in
                    var c = cn
                    c.frame.x = col.x
                    c.frame.width = col.width
                    return stretchDescendantsWidths(c, parentWidth: col.width)
                }
                newCols.append(stretchedCol)
            }
            n.columns = newCols
            n.children = newCols.flatMap { $0 }
        }
        return n
    }

    /// Streckt einen Knoten auf `newWidth` (u. a. Verzweigung/Fallauswahl proportional nach Java `setzeBreite`).
    private func stretchNodeTreeToWidth(_ node: VisuStructLayout.Node, newWidth: Double) -> VisuStructLayout.Node {
        var n = node
        let oldW = n.frame.width
        guard oldW > 0 else { return n }

        if n.element.type == .fallauswahl || n.element.type == .verzweigung, !n.caseColumnFrames.isEmpty {
            return stretchMultiwayNodeToWidth(n, newWidth: newWidth)
        }

        guard abs(newWidth - oldW) > 0.5 else {
            n.frame.width = newWidth
            // Schleifen: Rumpf-Breite = Gesamtbreite − linker Rand (wie im `switch` unten). Sonst würde
            // `stretchDescendantsWidths(..., parentWidth: newWidth)` den Inhalt zu breit machen → rechte Kante bricht aus.
            switch n.element.type {
            case .forSchleife, .whileSchleife, .doUntilSchleife, .endlosschleife:
                let leftInset: Double = 20
                let innerW = max(0, newWidth - leftInset)
                n.children = n.children.map { child in
                    var c = child
                    c.frame.x = n.frame.x + leftInset
                    c.frame.width = innerW
                    return stretchDescendantsWidths(c, parentWidth: innerW)
                }
            default:
                n.children = n.children.map { stretchDescendantsWidths($0, parentWidth: newWidth) }
            }
            return n
        }
        n.frame.width = newWidth

        switch n.element.type {
        case .forSchleife, .whileSchleife, .doUntilSchleife, .endlosschleife:
            let leftInset: Double = 20
            let innerW = max(0, newWidth - leftInset)
            n.children = n.children.map { child in
                var c = child
                c.frame.x = n.frame.x + leftInset
                c.frame.width = innerW
                return stretchDescendantsWidths(c, parentWidth: innerW)
            }

        default:
            n.children = n.children.map { stretchDescendantsWidths($0, parentWidth: newWidth) }
        }

        return n
    }

    /// Rekursiv Kinderbreiten an Eltern-Breite anpassen (Listen: gleiche Breite wie Eltern-Inhalt).
    private func stretchDescendantsWidths(_ node: VisuStructLayout.Node, parentWidth: Double) -> VisuStructLayout.Node {
        var n = node
        switch n.element.type {
        case .fallauswahl, .verzweigung:
            n = stretchNodeTreeToWidth(n, newWidth: parentWidth)
        case .forSchleife, .whileSchleife, .doUntilSchleife, .endlosschleife:
            let leftInset: Double = 20
            let innerW = max(0, parentWidth - leftInset)
            n.frame.width = parentWidth
            n.children = n.children.map { c in
                var cc = c
                cc.frame.x = n.frame.x + leftInset
                cc.frame.width = innerW
                return stretchDescendantsWidths(cc, parentWidth: innerW)
            }
        default:
            n.frame.width = parentWidth
            n.children = n.children.map { stretchDescendantsWidths($0, parentWidth: parentWidth) }
        }
        return n
    }

    private func headerHeight(for e: VisuStructElement) -> Double {
        let lines = max(1, e.textLines.count)
        // Java: obererRand = obererRandZusatz + lines*texthoehe, plus ggf. zoomY.
        let baseExtra: Double
        switch e.type {
        case .anweisung, .aussprung, .aufruf, .leerElement:
            baseExtra = 14
        case .fallauswahl:
            baseExtra = 40
        case .verzweigung:
            baseExtra = 20
        case .doUntilSchleife:
            // DoUntil hat Text unten; hier nutzen wir die gleiche Höhe als „bottom header“.
            baseExtra = 20
        case .forSchleife, .whileSchleife, .endlosschleife:
            // +4 pt: größerer Text-Obenabstand im Canvas (`cellTextInsetY`), Kopf/Rumpf-Grenze bleibt unter der Bedingung.
            baseExtra = metrics.baseHeaderExtra + 4
        default:
            baseExtra = metrics.baseHeaderExtra
        }
        return baseExtra + Double(lines) * metrics.lineHeight + Double(e.zoomY)
    }

    private func horizontalPaddingInsideCell(for type: VisuStructElementType) -> Double {
        switch type {
        case .anweisung, .aussprung, .aufruf, .leerElement:
            return metrics.minSidePadding
        default:
            return max(100, metrics.minSidePadding * 2.45)
        }
    }

    private func minWidth(for e: VisuStructElement) -> Double {
        let maxLineChars = e.textLines.map { $0.count }.max() ?? 0
        let textW = Double(maxLineChars) * metrics.charWidth
        return textW + Double(e.zoomX) + horizontalPaddingInsideCell(for: e.type)
    }

    private func layoutElement(_ e: VisuStructElement, atX x: Double, atY y: Double, idPath: [Int]) -> VisuStructLayout.Node {
        switch e.type {
        case .fallauswahl, .verzweigung:
            return layoutMultiway(e, atX: x, atY: y, idPath: idPath)
        case .forSchleife, .whileSchleife, .doUntilSchleife, .endlosschleife:
            return layoutLoop(e, atX: x, atY: y, idPath: idPath)
        default:
            let h = headerHeight(for: e)
            let w = minWidth(for: e)
            var node = VisuStructLayout.Node(
                idPath: idPath,
                element: e,
                frame: VisuStructRect(x: x, y: y, width: w, height: h),
                headerBandHeight: h
            )
            node.children = []
            return node
        }
    }

    private func layoutLoop(_ e: VisuStructElement, atX x: Double, atY y: Double, idPath: [Int]) -> VisuStructLayout.Node {
        // Wie Java `Schleife.linkerRand` (20) — Schleifenrumpf beginnt dort.
        let leftInset: Double = 20

        // Java `DoUntilSchleife`: Kopf oben = 0, Bedingungstext im unteren Rand (`getUntererRand`), Schleifenrumpf oben.
        if e.type == .doUntilSchleife {
            let footerH = headerHeight(for: e)
            let body = e.loopBody ?? []
            let children = layoutList(elements: body, atX: x + leftInset, atY: y, idBase: idPath + [0])
            let bodyW = children.map { $0.frame.width }.max() ?? 0
            let bodyH = children.reduce(0.0) { $0 + $1.frame.height }
            let w = max(minWidth(for: e), bodyW + leftInset)
            let h = bodyH + footerH
            let adjustedChildren = children.map { n in
                var nn = n
                nn.frame.x = x + leftInset
                nn.frame.width = max(0, w - leftInset)
                return nn
            }
            var node = VisuStructLayout.Node(
                idPath: idPath,
                element: e,
                frame: VisuStructRect(x: x, y: y, width: w, height: h),
                headerBandHeight: footerH
            )
            node.children = adjustedChildren
            return node
        }

        let header = headerHeight(for: e)
        let bottom: Double = (e.type == .endlosschleife) ? 40 : 0

        let body = e.loopBody ?? []
        let children = layoutList(elements: body, atX: x + leftInset, atY: y + header, idBase: idPath + [0])
        let bodyW = children.map { $0.frame.width }.max() ?? 0
        let bodyH = children.reduce(0.0) { $0 + $1.frame.height }

        let w = max(minWidth(for: e), bodyW + leftInset)
        let h = header + bottom + bodyH

        // Children auf neue Breite strecken (Java macht das); wir passen nur X/Y, Breite auf bodyW.
        let adjustedChildren = children.map { n in
            var nn = n
            nn.frame.x = x + leftInset
            nn.frame.width = max(0, w - leftInset)
            return nn
        }

        var node = VisuStructLayout.Node(
            idPath: idPath,
            element: e,
            frame: VisuStructRect(x: x, y: y, width: w, height: h),
            headerBandHeight: header
        )
        node.children = adjustedChildren
        return node
    }

    private func layoutMultiway(_ e: VisuStructElement, atX x: Double, atY y: Double, idPath: [Int]) -> VisuStructLayout.Node {
        let header = headerHeight(for: e)
        let cases = e.cases ?? []
        let colCount = max(1, cases.count)
        let colWidthGuess = max(minWidth(for: e) / Double(colCount), 132)

        var columnFrames: [VisuStructRect] = []
        var columnChildren: [[VisuStructLayout.Node]] = []

        var totalW: Double = 0
        var maxColH: Double = 0

        for (i, c) in cases.enumerated() {
            let colX = x + totalW
            let listNodes = layoutList(elements: c.elements, atX: colX, atY: y + header, idBase: idPath + [i])
            let contentW = listNodes.map { $0.frame.width }.max() ?? 0
            // Java `Fallauswahl.zeichenbereichAktualisieren`: Spaltenbreite = natürlicher Inhalt.
            // `Verzweigung`: keine künstliche Mindestbreite pro Spalte aus Header — sonst wirkt der false-Zweig zu breit.
            let colW: Double
            if e.type == .verzweigung && colCount == 2 {
                let branchLabel = i == 0 ? "true" : "false"
                let minForLabel = Double(branchLabel.count) * metrics.charWidth + 24
                colW = max(contentW, minForLabel)
            } else {
                colW = max(colWidthGuess, contentW)
            }
            let colH = listNodes.reduce(0.0) { $0 + $1.frame.height }
            maxColH = max(maxColH, colH)

            // Strecken in Spaltenbreite (inkl. tiefer Strukturen — wie im `minWidth`-Scale-Zweig unten).
            let stretched = listNodes.map { n in
                var nn = n
                nn.frame.x = colX
                nn.frame.width = colW
                return stretchDescendantsWidths(nn, parentWidth: colW)
            }

            columnFrames.append(VisuStructRect(x: colX, y: y + header, width: colW, height: colH))
            columnChildren.append(stretched)
            totalW += colW
        }

        var w = max(totalW, minWidth(for: e))
        // `minWidth` kann die Gesamtbreite erhöhen, während die Spalten noch `totalW` einnehmen.
        // Ohne Nachziehen endet `stretchNodeTreeToWidth` bei newWidth == oldWidth früh — Spalten füllen den Kasten dann nicht (Linien/Overflow).
        if totalW > 0.5, w > totalW + 0.5 {
            let scale = w / totalW
            var newFrames: [VisuStructRect] = []
            var newCols: [[VisuStructLayout.Node]] = []
            var xCursor = x
            for i in 0..<columnFrames.count {
                let col = columnFrames[i]
                let nw = col.width * scale
                let nh = col.height
                let yCol = col.y
                let stretchedNodes = columnChildren[i].map { cn -> VisuStructLayout.Node in
                    var c = cn
                    c.frame.x = xCursor
                    c.frame.width = nw
                    return stretchDescendantsWidths(c, parentWidth: nw)
                }
                newFrames.append(VisuStructRect(x: xCursor, y: yCol, width: nw, height: nh))
                newCols.append(stretchedNodes)
                xCursor += nw
            }
            columnFrames = newFrames
            columnChildren = newCols
            totalW = xCursor - x
            w = totalW
        }

        // Divider wie Java: xVerschiebungFuerTrennlinie = Gesamtbreite - Breite letzte Spalte (default/else)
        let lastW = columnFrames.last?.width ?? (totalW / Double(colCount))
        let dividerYInset: Double = (e.type == .fallauswahl) ? -20 : 0

        let h = header + maxColH

        var node = VisuStructLayout.Node(
            idPath: idPath,
            element: e,
            frame: VisuStructRect(x: x, y: y, width: w, height: h),
            headerBandHeight: header
        )
        node.caseColumnFrames = columnFrames
        node.dividerX = x + totalW - lastW
        node.dividerYInset = dividerYInset
        node.columns = columnChildren
        node.children = columnChildren.flatMap { $0 }
        return node
    }
}

