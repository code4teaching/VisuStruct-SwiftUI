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

    public func layout(
        document: VisuStructDocument,
        topLeadingContentInset: (left: Double, top: Double) = (28, 28)
    ) -> VisuStructLayout {
        // Entspricht Java `randLinks/randOben`. Der Diagrammtitel (`caption`) steht in der **App** oberhalb des
        // Canvas (Textfeld + Trennlinie) und fließt **nicht** in den Kasten ein — deshalb kein Zusatz-Rand
        // für eingeblendeten Titel-Text im Zeichenbereich.
        let randLinks = topLeadingContentInset.left
        let randOben = topLeadingContentInset.top

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
        // Spitze des Dachs = linke Kante der letzten Spalte (wie Java `xVerschiebungFuerTrennlinie`), nicht nur „Breite − letzte Spalte“ rechnen — Rundung kann sonst mit `caseColumnFrames` kippen.
        n.dividerX = newFrames.last.map { $0.x } ?? (n.frame.x + newWidth - (newFrames.last?.width ?? 0))
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

    /// Nach vereinheitlichter Zeilenhöhe in Verzweigungen: letztes Rumpf-Element von Schleifen bis zur unteren Kante strecken
    /// (z. B. Leerstelle/Anweisung füllt mit, statt weißen Streifen unter dem Schleifen-L).
    private func stretchLoopBodiesVertically(_ node: VisuStructLayout.Node) -> VisuStructLayout.Node {
        var n = node
        if let cols = n.columns, !cols.isEmpty {
            n.columns = cols.map { col in col.map { stretchLoopBodiesVertically($0) } }
            n.children = n.columns!.flatMap { $0 }
            return n
        }

        n.children = n.children.map { stretchLoopBodiesVertically($0) }

        func canAbsorbVerticalGapInLoopBody(_ t: VisuStructElementType) -> Bool {
            switch t {
            case .anweisung, .leerElement, .aufruf, .aussprung,
                 .forSchleife, .whileSchleife, .doUntilSchleife, .endlosschleife:
                return true
            default:
                return false
            }
        }

        switch n.element.type {
        case .forSchleife, .whileSchleife, .endlosschleife:
            let bottomStrip: Double = n.element.type == .endlosschleife ? 40 : 0
            let limitY = n.frame.y + n.frame.height - bottomStrip
            guard let li = n.children.indices.last else { return n }
            var last = n.children[li]
            let gap = limitY - (last.frame.y + last.frame.height)
            if gap > 0.5, canAbsorbVerticalGapInLoopBody(last.element.type) {
                last.frame.height += gap
                last = stretchLoopBodiesVertically(last)
                n.children[li] = last
            }
        case .doUntilSchleife:
            let footer = n.headerBandHeight
            let limitY = n.frame.y + n.frame.height - footer
            guard let li = n.children.indices.last else { return n }
            var last = n.children[li]
            let gap = limitY - (last.frame.y + last.frame.height)
            if gap > 0.5, canAbsorbVerticalGapInLoopBody(last.element.type) {
                last.frame.height += gap
                last = stretchLoopBodiesVertically(last)
                n.children[li] = last
            }
        default:
            break
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
        case .anweisung, .aussprung, .aufruf, .leerElement,
             .forSchleife, .whileSchleife, .doUntilSchleife, .endlosschleife:
            /// Eine Kopfzeile wie Anweisung — nicht die große Mehrfachauswahl-Padding-Heuristik (≥100), sonst werden
            /// Schleifen unnötig breit und Eltern-Spalten / Strecklogik geraten aus dem Gleichgewicht.
            return metrics.minSidePadding
        default:
            return max(100, metrics.minSidePadding * 2.45)
        }
    }

    private func minWidth(for e: VisuStructElement) -> Double {
        let fs = CGFloat(metrics.fontSize)
        let measured = VisuStructLayoutTextMeasurement.maxLineWidth(lines: e.textLines, fontSize: fs)
        let pad = horizontalPaddingInsideCell(for: e.type)
        var w = measured + Double(e.zoomX) + pad

        if e.type == .aufruf {
            /// Wie `DiagramCanvasView`: Seitenbalken bei 14 pt, Text ab 18 pt — Mindestbreite aus echter Messung + Rand.
            let textMargins: Double = 36
            let safety: Double = 8
            w = max(w, measured + Double(e.zoomX) + textMargins + safety)
        }

        let floor: Double
        switch e.type {
        case .leerElement:
            floor = 76
        case .aufruf:
            floor = 104
        default:
            floor = 72
        }
        return max(floor, w)
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
            let innerContentW = max(0, w - leftInset)
            let adjustedChildren = children.map { n in
                var nn = n
                nn.frame.x = x + leftInset
                nn.frame.width = innerContentW
                return stretchDescendantsWidths(nn, parentWidth: innerContentW)
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

        // Children auf finale Schleifen-Innenbreite setzen und Nachkommen rekursiv strecken (Verzweigung/Fallauswahl im Rumpf).
        let innerContentW = max(0, w - leftInset)
        let adjustedChildren = children.map { n in
            var nn = n
            nn.frame.x = x + leftInset
            nn.frame.width = innerContentW
            return stretchDescendantsWidths(nn, parentWidth: innerContentW)
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

        func shiftDescendantsY(_ node: VisuStructLayout.Node, delta: Double) -> VisuStructLayout.Node {
            // Wichtig: Nur Nachkommen verschieben (nicht den Knoten selbst), sonst addieren wir Y doppelt,
            // wenn der Caller bereits `frame.y` gesetzt hat.
            guard abs(delta) > 0.0001 else { return node }
            var n = node
            if let cols = n.columns {
                n.columns = cols.map { $0.map { c in
                    var cc = c
                    cc.frame.y += delta
                    return shiftDescendantsY(cc, delta: delta)
                } }
                n.children = (n.columns ?? []).flatMap { $0 }
            } else {
                n.children = n.children.map { c in
                    var cc = c
                    cc.frame.y += delta
                    return shiftDescendantsY(cc, delta: delta)
                }
            }
            return n
        }

        /// Verzweigung/Fallauswahl: Zeilenhöhen spaltenübergreifend synchronisieren, damit horizontale Trennlinien nicht „stufig“ werden.
        func harmonizeRowHeightsAcrossColumns(
            columns: [[VisuStructLayout.Node]],
            startY: Double
        ) -> (columns: [[VisuStructLayout.Node]], columnHeights: [Double]) {
            guard columns.count >= 2 else {
                let hs = columns.map { $0.reduce(0.0) { $0 + $1.frame.height } }
                return (columns, hs)
            }
            // Java-ähnlicher als „Index-Zeilen“: wir nehmen alle horizontalen Kanten (Unterkanten) aus allen Spalten,
            // bilden daraus gemeinsame Trennlinien und schnappen jede Spalte darauf ein.
            let eps: Double = 0.5

            var lines: [Double] = [startY]
            lines.reserveCapacity(32)
            for col in columns {
                for n in col {
                    lines.append(n.frame.y + n.frame.height)
                }
            }
            // finale Unterkante: Maximum über alle Spalten, damit alle gleich hoch werden können
            let maxBottom = lines.max() ?? startY
            lines.append(maxBottom)

            // sortieren + „nahe“ Werte zusammenfassen (Floating Point / Rundung)
            lines.sort()
            var merged: [Double] = []
            merged.reserveCapacity(lines.count)
            for v in lines {
                if let last = merged.last, abs(v - last) <= eps {
                    continue
                }
                merged.append(v)
            }
            if merged.first.map({ abs($0 - startY) > eps }) ?? true {
                merged.insert(startY, at: 0)
            }
            // Wichtig: Nach eps-Dedupe kann merged.last knapp unter maxBottom liegen (z. B. 99,6 vs 100).
            // Dann würde „abs(last - maxBottom) > eps“ false sein und die finale Kante fehlt — einspaltige Zweige
            // (z. B. eine for-Schleife) wachsen nicht mit mehreren Anweisungen in der anderen Spalte mit.
            if merged.isEmpty {
                merged = [startY, maxBottom]
            } else if merged.last! < maxBottom - 1e-6 {
                merged.append(maxBottom)
            } else {
                merged[merged.count - 1] = maxBottom
            }

            func nextLineIndex(atOrAbove y: Double, minIndex: Int) -> Int {
                var i = max(0, minIndex)
                while i < merged.count, merged[i] < y - eps { i += 1 }
                return min(i, merged.count - 1)
            }

            var outCols: [[VisuStructLayout.Node]] = []
            outCols.reserveCapacity(columns.count)
            var colHeights: [Double] = []
            colHeights.reserveCapacity(columns.count)

            for col in columns {
                guard !col.isEmpty else {
                    outCols.append([])
                    colHeights.append(0)
                    continue
                }
                var newCol: [VisuStructLayout.Node] = []
                newCol.reserveCapacity(col.count)

                var topLineIdx = 0 // merged[topLineIdx] == startY
                for (idx, orig) in col.enumerated() {
                    var n = orig
                    let desiredTop = merged[topLineIdx]
                    let origBottom = orig.frame.y + orig.frame.height

                    // Unterkante auf nächste gemeinsame Trennlinie legen (monoton steigend).
                    // Letztes Element zieht bis zur finalen Unterkante.
                    let bottomLineIdx: Int
                    if idx == col.count - 1 {
                        bottomLineIdx = merged.count - 1
                    } else {
                        bottomLineIdx = nextLineIndex(atOrAbove: origBottom, minIndex: topLineIdx + 1)
                    }
                    let desiredBottom = merged[bottomLineIdx]

                    let newH = max(0, desiredBottom - desiredTop)
                    let deltaY = desiredTop - n.frame.y
                    n.frame.y = desiredTop
                    n.frame.height = newH
                    n = shiftDescendantsY(n, delta: deltaY)
                    newCol.append(n)

                    topLineIdx = bottomLineIdx
                }

                outCols.append(newCol)
                colHeights.append((merged.last ?? startY) - startY)
            }

            return (outCols, colHeights)
        }

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

        // Row-Heights vereinheitlichen (horizontale Linien aneinander ausrichten).
        if !columnChildren.isEmpty {
            let harmonized = harmonizeRowHeightsAcrossColumns(columns: columnChildren, startY: y + header)
            columnChildren = harmonized.columns.map { col in col.map { stretchLoopBodiesVertically($0) } }
            // Frames-Höhen aktualisieren
            for i in 0..<min(columnFrames.count, harmonized.columnHeights.count) {
                columnFrames[i].height = harmonized.columnHeights[i]
            }
            maxColH = harmonized.columnHeights.max() ?? maxColH
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
        node.dividerX = columnFrames.last.map { $0.x } ?? (x + totalW - lastW)
        node.dividerYInset = dividerYInset
        node.columns = columnChildren
        node.children = columnChildren.flatMap { $0 }
        return node
    }
}

extension VisuStructLayoutEngine.Metrics {
    /// Einheitliche Skalierung für größere/kleinere Diagramm-Darstellung.
    public func scaled(by factor: Double) -> Self {
        guard factor > 0, abs(factor - 1) > 1e-6 else { return self }
        return Self(
            fontSize: fontSize * factor,
            lineHeight: lineHeight * factor,
            charWidth: charWidth * factor,
            baseHeaderExtra: baseHeaderExtra * factor,
            minSidePadding: minSidePadding * factor
        )
    }
}
