import SwiftUI
import VisuStructCore
#if canImport(UIKit)
import UIKit
#endif

private extension [Int] {
    /// Stabiler Schlüssel für Sets / Drop-Zonen (z. B. Platzhalter-Lookup).
    var diagramPathKey: String { map(String.init).joined(separator: ",") }
}

private extension VisuStructLayout.Node {
    /// `ForEach`-Identität (stabiler String statt `[Int]`-Hash).
    var pathKey: String { idPath.diagramPathKey }
}

/// Etwas größere Typo (+2 pt) und kräftigere Kanten im Diagramm-`Canvas`.
private enum DiagramCanvasInk {
    static let extraFontPoints: Double = 2
    static let extraLineHeightPoints: Double = 2
    static let diagramLineWidth: CGFloat = 2
    static let outerFrameLineWidth: CGFloat = 2
    static let selectionLineWidth: CGFloat = 3.5
    /// Außenabstand Rahmen zum Canvas-Rand; innen mehr Luft für Beschriftung.
    static let canvasOuterMargin: CGFloat = 16
    static let cellTextInsetX: CGFloat = 18
    static let cellTextInsetY: CGFloat = 15
    static let cellTextInsetYDoUntil: CGFloat = 20
    static let multiHeaderFirstLineY: CGFloat = 14
    static let branchLabelInsetX: CGFloat = 10
    static let callSideBarInset: CGFloat = 14
    /// Schmaler Streifen **oberhalb** des ersten Wurzelelements: Einfügen / Verschieben an Position 0 ohne oberste „davor“-Zone zu treffen.
    static let rootInsertStripHeight: CGFloat = 14
}

struct DiagramCanvasView: View {
    @Binding var document: VisuStructDocument
    @Binding var selectedPath: [Int]?
    @Binding var errorText: String?

    /// Sichtbarer Bereich des ScrollViews (Fenstergröße). Wenn `.zero`, nur Inhaltsgröße des Layouts.
    var minViewportSize: CGSize = .zero

    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @Environment(\.appLanguage) private var lang

    @State private var dropHighlightKey: String?

    private enum DropBand: String {
        case before
        case on
        case after
    }

    private var rootDropHighlightKey: String { "__root__" }
    private var rootInsertBeforeFirstKey: String { "__root_before_first__" }

    private var layoutMetrics: VisuStructLayoutEngine.Metrics {
        VisuStructLayoutEngine.diagramDisplayMetrics(isRegularWidth: horizontalSizeClass == .regular)
    }

    private var lineHeight: CGFloat { CGFloat(layoutMetrics.lineHeight) }
    private var headerFontSize: CGFloat { CGFloat(layoutMetrics.fontSize) }

    private var captionFontSize: CGFloat {
        (horizontalSizeClass == .regular ? CGFloat(15) : CGFloat(20)) + CGFloat(DiagramCanvasInk.extraFontPoints)
    }

    private var cellFont: Font { .system(size: headerFontSize, weight: .medium) }
    private var captionFont: Font { .system(size: captionFontSize, weight: .medium) }

    /// Gemeinsame Stroke-Farbe für Kacheln und Hilfslinien (eine Allokation pro Frame statt dutzende).
    private var diagramLineColor: Color { Color.gray.opacity(0.85) }
    private var diagramCanvasFill: Color { Color(white: 0.98) }
    private var diagramCellFill: Color { Color.white }

    var body: some View {
        let engine = VisuStructLayoutEngine(metrics: layoutMetrics)
        let layout = engine.layout(document: document)
        let layoutW = CGFloat(layout.canvasSize.width)
        let layoutH = CGFloat(layout.canvasSize.height)
        let vw = minViewportSize.width
        let vh = minViewportSize.height
        let hasViewport = vw > 1 && vh > 1
        /// Canvas mindestens so groß wie Struktur und (wenn bekannt) sichtbares Fenster — kein künstliches 1400×1000-Limit.
        let cw = hasViewport ? max(320, layoutW, vw) : max(320, layoutW)
        let ch = hasViewport ? max(320, layoutH, vh) : max(320, layoutH)
        let flat = layout.flattenedNodesDepthFirst()
        let placeholderPathKeys: Set<String> = Set(flat.compactMap { node in
            VisuStructDocumentEditing.isPlaceholderSlot(at: node.idPath, in: document)
                ? node.idPath.diagramPathKey
                : nil
        })

        ZStack(alignment: .topLeading) {
            if flat.isEmpty {
                emptyDiagramDropPlate(cw: cw, ch: ch)
            } else {
                Color.clear
                    .frame(width: cw, height: ch)
                    .contentShape(Rectangle())
                    .onTapGesture {
                        selectedPath = nil
                    }
                    .overlay {
                        if dropHighlightKey == rootDropHighlightKey {
                            RoundedRectangle(cornerRadius: 8)
                                .strokeBorder(Color.blue.opacity(0.95), lineWidth: 4)
                                .padding(6)
                                .allowsHitTesting(false)
                        }
                    }
                    .dropDestination(for: DiagramDragPayload.self) { items, _ in
                        applyRootDrop(items)
                    } isTargeted: { targeted in
                        updateDropHighlight(rootDropHighlightKey, targeted: targeted)
                    }
            }

            canvasView(layout: layout, cw: cw, ch: ch)
                .allowsHitTesting(false)

            if let firstRoot = layout.elements.first {
                rootInsertBeforeFirstStrip(
                    firstRootFrame: firstRoot.frame,
                    canvasWidth: cw,
                    canvasHeight: ch
                )
            }

            ForEach(flat, id: \.pathKey) { node in
                nodeDropBands(node: node, isPlaceholderNode: placeholderPathKeys.contains(node.idPath.diagramPathKey))
            }
        }
        .animation(.easeInOut(duration: 0.12), value: dropHighlightKey)
        .frame(width: cw, height: ch)
        .clipped()
        .contentShape(Rectangle())
        /// Kein überlagerndes `DragGesture(minimumDistance: 0)` — das blockiert die System-`draggable`-Geste (Palette / Verschieben).
        #if canImport(UIKit)
        .background(ScrollViewDragTouchesForDiagram())
        #endif
    }

    /// Sichtbare, oberste Drop-Fläche, wenn es noch keine Strukturknoten gibt (sonst gewinnt kein Knoten-Drop das Hit-Testing).
    @ViewBuilder
    private func emptyDiagramDropPlate(cw: CGFloat, ch: CGFloat) -> some View {
        ZStack {
            Color(white: 0.96)
                .frame(width: cw, height: ch)
            VStack(spacing: 18) {
                Image(systemName: "square.dashed")
                    .font(.system(size: 36))
                    .foregroundStyle(.tertiary)
                Text(lang.tr("canvas_empty_title"))
                    .font(.headline)
                Text(lang.tr("canvas_empty_hint"))
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 28)
            }
            .allowsHitTesting(false)
        }
        .contentShape(Rectangle())
        .frame(width: cw, height: ch)
        .overlay {
            if dropHighlightKey == rootDropHighlightKey {
                RoundedRectangle(cornerRadius: 10)
                    .strokeBorder(Color.blue.opacity(0.95), lineWidth: 4)
                    .padding(10)
                    .allowsHitTesting(false)
            }
        }
        .dropDestination(for: DiagramDragPayload.self) { items, _ in
            applyRootDrop(items)
        } isTargeted: { targeted in
            updateDropHighlight(rootDropHighlightKey, targeted: targeted)
        }
    }

    @ViewBuilder
    private func nodeDropBands(node: VisuStructLayout.Node, isPlaceholderNode: Bool) -> some View {
        let w = CGFloat(node.frame.width)
        let h = CGFloat(node.frame.height)

        Group {
            if isPlaceholderNode {
                /// Niedrige Kacheln (z. B. ø / leer in einem Zweig): „davor/danach“-Streifen wären je 10 pt, die Mitte nur 1–2 pt — Drops landeten fälschlich auf „danach“ und haben eingefügt statt ersetzt.
                placeholderReplaceDropSurface(node: node, width: w, height: h)
            } else {
                segmentedSiblingDropBands(node: node, width: w, height: h)
            }
        }
        .frame(width: w, height: h)
        .contentShape(Rectangle())
        .offset(x: CGFloat(node.frame.x), y: CGFloat(node.frame.y))
        .onTapGesture {
            selectedPath = node.idPath
        }
        .draggable(DiagramDragPayload(raw: ElementPalette.moveDragIdentifier(path: node.idPath))) {
            nodeDragPreview(for: node)
        }
        .accessibilityHint(
            isPlaceholderNode
                ? lang.tr("a11y_placeholder_drop")
                : lang.tr("a11y_node_drop")
        )
    }

    /// Gesamte Kachel = ein Ziel nur für „ersetzen“ (`.on`-Semantik).
    @ViewBuilder
    private func placeholderReplaceDropSurface(node: VisuStructLayout.Node, width: CGFloat, height: CGFloat) -> some View {
        let key = bandHighlightKey(path: node.idPath, band: .on)
        let showHL = dropHighlightKey == key
        Color.clear
            .frame(width: width, height: height)
            .contentShape(Rectangle())
            .background(showHL ? Color.blue.opacity(0.2) : Color.blue.opacity(0.06))
            .overlay {
                Group {
                    if showHL {
                        RoundedRectangle(cornerRadius: 4)
                            .strokeBorder(Color.blue.opacity(0.95), lineWidth: 3)
                    } else {
                        RoundedRectangle(cornerRadius: 4)
                            .strokeBorder(Color.blue.opacity(0.35), style: StrokeStyle(lineWidth: 1.5, dash: [5, 4]))
                    }
                }
                .padding(2)
            }
            .dropDestination(for: DiagramDragPayload.self) { items, _ in
                applyNodeDrop(items, node: node, band: .on)
            } isTargeted: { targeted in
                updateDropHighlight(key, targeted: targeted)
            }
    }

    @ViewBuilder
    private func segmentedSiblingDropBands(node: VisuStructLayout.Node, width: CGFloat, height: CGFloat) -> some View {
        let strip = siblingDropStripHeight(totalHeight: height)
        let midH = max(height - 2 * strip, 1)
        VStack(spacing: 0) {
            dropBandView(node: node, band: .before, height: strip, width: width)
            dropZoneSeparator(width: width)
            dropBandView(node: node, band: .on, height: midH, width: width)
            dropZoneSeparator(width: width)
            dropBandView(node: node, band: .after, height: strip, width: width)
        }
    }

    private func dropZoneSeparator(width: CGFloat) -> some View {
        Rectangle()
            .fill(Color.secondary.opacity(0.35))
            .frame(width: width, height: 1)
    }

    /// Obere/untere Drop-Streifen: groß genug für den Finger, Mitte bleibt für Tap / Ziel „Mitte“ nutzbar.
    private func siblingDropStripHeight(totalHeight h: CGFloat) -> CGFloat {
        guard h > 2 else { return 1 }
        let minMid: CGFloat = 8
        var strip = min(max(h * 0.22, 11), 34)
        if 2 * strip + minMid > h {
            strip = max((h - minMid) / 2, 4)
        }
        return max(1, strip)
    }

    @ViewBuilder
    private func rootInsertBeforeFirstStrip(firstRootFrame: VisuStructRect, canvasWidth: CGFloat, canvasHeight: CGFloat) -> some View {
        let sh = DiagramCanvasInk.rootInsertStripHeight
        let y = max(0, CGFloat(firstRootFrame.y) - sh - 2)
        if y + sh <= canvasHeight && canvasWidth > 4 {
            let key = rootInsertBeforeFirstKey
            let showHL = dropHighlightKey == key
            Color.clear
                .frame(width: canvasWidth, height: sh)
                .offset(x: 0, y: y)
                .contentShape(Rectangle())
                .background(showHL ? Color.blue.opacity(0.18) : Color.teal.opacity(0.05))
                .overlay(alignment: .center) {
                    if showHL {
                        Capsule()
                            .fill(Color.blue.opacity(0.55))
                            .frame(width: min(canvasWidth - 24, 200), height: 3)
                    }
                }
                .dropDestination(for: DiagramDragPayload.self) { items, _ in
                    applyRootInsertBeforeFirst(items)
                } isTargeted: { targeted in
                    updateDropHighlight(key, targeted: targeted)
                }
        }
    }

    private func bandHighlightKey(path: [Int], band: DropBand) -> String {
        path.map(String.init).joined(separator: ",") + ":" + band.rawValue
    }

    private func updateDropHighlight(_ key: String, targeted: Bool) {
        if targeted {
            dropHighlightKey = key
        } else if dropHighlightKey == key {
            dropHighlightKey = nil
        }
    }

    private func notifyDragDropCommitted() {
        dropHighlightKey = nil
        #if canImport(UIKit)
        let g = UIImpactFeedbackGenerator(style: .light)
        g.prepare()
        g.impactOccurred()
        #endif
    }

    @ViewBuilder
    private func dropBandView(node: VisuStructLayout.Node, band: DropBand, height: CGFloat, width: CGFloat) -> some View {
        let key = bandHighlightKey(path: node.idPath, band: band)
        let showHL = dropHighlightKey == key
        let idleFill: Color = {
            switch band {
            case .before, .after: return Color.teal.opacity(0.09)
            case .on: return Color.orange.opacity(0.06)
            }
        }()
        let bandContent = Color.clear
            .frame(width: width, height: height)
            .contentShape(Rectangle())
            .background(showHL ? Color.blue.opacity(band == .on ? 0.22 : 0.16) : idleFill)
            .overlay {
                if showHL {
                    RoundedRectangle(cornerRadius: 2)
                        .strokeBorder(Color.blue.opacity(0.95), lineWidth: band == .on ? 3.5 : 2.5)
                        .padding(EdgeInsets(top: band == .before ? 1 : 0, leading: 1, bottom: band == .after ? 1 : 0, trailing: 1))
                }
            }
            .dropDestination(for: DiagramDragPayload.self) { items, _ in
                applyNodeDrop(items, node: node, band: band)
            } isTargeted: { targeted in
                updateDropHighlight(key, targeted: targeted)
            }
        bandContent
    }

    private func applyNodeDrop(_ items: [DiagramDragPayload], node: VisuStructLayout.Node, band: DropBand) -> Bool {
        let path = node.idPath
        guard let s = items.first?.raw else { return false }
        if s.hasPrefix("pal:") {
            let raw = String(s.dropFirst(4))
            guard let kind = ElementPalette.PaletteItem(rawValue: raw) else { return false }
            let el = ElementPalette.element(for: kind, lang: lang)
            do {
                switch band {
                case .before, .after:
                    if band == .before {
                        document = try VisuStructDocumentEditing.insertBeforeSibling(document, el, before: path)
                        selectedPath = path
                    } else {
                        document = try VisuStructDocumentEditing.insertAfterSibling(document, el, after: path)
                        selectedPath = pathOfInsertedSibling(after: path)
                    }
                    errorText = nil
                case .on:
                    guard VisuStructDocumentEditing.isPlaceholderSlot(at: path, in: document) else { return false }
                    document = try VisuStructDocumentEditing.replaceAtPath(document, path: path, with: el)
                    errorText = nil
                    selectedPath = path
                }
                notifyDragDropCommitted()
                return true
            } catch {
                errorText = error.localizedDescription
                return false
            }
        }
        if s.hasPrefix("mov:") {
            let from = parsePath(String(s.dropFirst(4)))
            guard from.count >= 1 else { return false }
            do {
                switch band {
                case .before, .after:
                    if band == .before {
                        guard from != path else { return false }
                        document = try VisuStructDocumentEditing.moveBeforeSibling(document, from: from, before: path)
                        errorText = nil
                        selectedPath = path
                    } else {
                        guard from != path else { return false }
                        document = try VisuStructDocumentEditing.moveAfterSibling(document, from: from, after: path)
                        errorText = nil
                        selectedPath = pathOfInsertedSibling(after: path)
                    }
                case .on:
                    guard VisuStructDocumentEditing.isPlaceholderSlot(at: path, in: document) else { return false }
                    guard from != path else { return false }
                    let (updated, newPath) = try VisuStructDocumentEditing.moveReplacingPlaceholder(document, from: from, placeholderPath: path)
                    document = updated
                    errorText = nil
                    selectedPath = newPath
                }
                notifyDragDropCommitted()
                return true
            } catch {
                errorText = error.localizedDescription
                return false
            }
        }
        return false
    }

    private func nodeDragPreview(for node: VisuStructLayout.Node) -> some View {
        let w = min(CGFloat(node.frame.width), 260)
        let h = min(CGFloat(node.frame.height), 180)
        return RoundedRectangle(cornerRadius: 6)
            .strokeBorder(Color.blue.opacity(0.95), lineWidth: 2.5)
            .background(RoundedRectangle(cornerRadius: 6).fill(Color.white.opacity(0.97)))
            .frame(width: w, height: h)
            .shadow(color: .black.opacity(0.28), radius: 10, x: 0, y: 5)
    }

    /// Oberer Wurzel-Streifen: an Index 0 einfügen / dorthin verschieben.
    private func applyRootInsertBeforeFirst(_ items: [DiagramDragPayload]) -> Bool {
        guard document.elements.indices.contains(0) else { return false }
        guard let s = items.first?.raw else { return false }
        if s.hasPrefix("pal:") {
            let raw = String(s.dropFirst(4))
            guard let kind = ElementPalette.PaletteItem(rawValue: raw) else { return false }
            let el = ElementPalette.element(for: kind, lang: lang)
            if VisuStructDocumentEditing.isSingleRootPlaceholder(in: document) {
                do {
                    document = try VisuStructDocumentEditing.replaceAtPath(document, path: [0], with: el)
                    errorText = nil
                    selectedPath = [0]
                    notifyDragDropCommitted()
                    return true
                } catch {
                    errorText = error.localizedDescription
                    return false
                }
            }
            do {
                document = try VisuStructDocumentEditing.insertAt(document, parentPath: [], index: 0, element: el)
                errorText = nil
                selectedPath = [0]
                notifyDragDropCommitted()
                return true
            } catch {
                errorText = error.localizedDescription
                return false
            }
        }
        if s.hasPrefix("mov:") {
            let from = parsePath(String(s.dropFirst(4)))
            guard from.count >= 1 else { return false }
            guard from != [0] else { return false }
            do {
                document = try VisuStructDocumentEditing.moveBeforeSibling(document, from: from, before: [0])
                errorText = nil
                selectedPath = [0]
                notifyDragDropCommitted()
                return true
            } catch {
                errorText = error.localizedDescription
                return false
            }
        }
        return false
    }

    private func applyRootDrop(_ items: [DiagramDragPayload]) -> Bool {
        guard let s = items.first?.raw else { return false }
        if s.hasPrefix("pal:") {
            let raw = String(s.dropFirst(4))
            guard let kind = ElementPalette.PaletteItem(rawValue: raw) else { return false }
            let el = ElementPalette.element(for: kind, lang: lang)
            if VisuStructDocumentEditing.isSingleRootPlaceholder(in: document) {
                do {
                    document = try VisuStructDocumentEditing.replaceAtPath(document, path: [0], with: el)
                    errorText = nil
                    selectedPath = [0]
                    notifyDragDropCommitted()
                    return true
                } catch {
                    errorText = error.localizedDescription
                    return false
                }
            }
            do {
                document = try VisuStructDocumentEditing.insertAt(document, parentPath: [], index: document.elements.count, element: el)
                errorText = nil
                selectedPath = [document.elements.count - 1]
                notifyDragDropCommitted()
                return true
            } catch {
                errorText = error.localizedDescription
                return false
            }
        }
        if s.hasPrefix("mov:") {
            let from = parsePath(String(s.dropFirst(4)))
            guard from.count >= 1 else { return false }
            guard let lastIdx = document.elements.indices.last else { return false }
            do {
                document = try VisuStructDocumentEditing.moveAfterSibling(document, from: from, after: [lastIdx])
                errorText = nil
                selectedPath = pathOfInsertedSibling(after: [lastIdx])
                notifyDragDropCommitted()
                return true
            } catch {
                errorText = error.localizedDescription
                return false
            }
        }
        return false
    }

    private func pathOfInsertedSibling(after siblingPath: [Int]) -> [Int] {
        siblingPath.dropLast() + [siblingPath.last! + 1]
    }

    private func parsePath(_ s: String) -> [Int] {
        s.split(separator: ",").compactMap { Int(String($0).trimmingCharacters(in: .whitespaces)) }
    }

    private func canvasView(layout: VisuStructLayout, cw: CGFloat, ch: CGFloat) -> some View {
        Canvas { context, size in
            context.fill(Path(CGRect(origin: .zero, size: size)), with: .color(diagramCanvasFill))

            let m = DiagramCanvasInk.canvasOuterMargin
            let innerTrim: CGFloat = 1
            let frameRect = CGRect(
                x: m,
                y: m,
                width: CGFloat(layout.canvasSize.width) - 2 * m - innerTrim,
                height: CGFloat(layout.canvasSize.height) - 2 * m - innerTrim
            )
            let outerFramePath = Path(frameRect)
            context.stroke(outerFramePath, with: .color(Color.gray.opacity(0.6)), lineWidth: DiagramCanvasInk.outerFrameLineWidth)

            if !document.caption.isEmpty {
                let cap = captionFontSize
                let captionW = measureText(document.caption, size: cap)
                let cx = m + (CGFloat(layout.canvasSize.width) - 2 * m - innerTrim) / 2 - captionW / 2
                let t = context.resolve(Text(document.caption).font(captionFont))
                context.draw(t, at: CGPoint(x: cx, y: 30), anchor: .topLeading)
            }

            for n in layout.elements {
                drawNode(n, selectedPath: selectedPath, in: &context)
            }
        }
        .frame(width: cw, height: ch)
    }

    private func drawNode(_ node: VisuStructLayout.Node, selectedPath: [Int]?, in context: inout GraphicsContext) {
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

        context.fill(cellPath, with: .color(diagramCellFill))
        context.stroke(cellPath, with: .color(linePaint), lineWidth: DiagramCanvasInk.diagramLineWidth)
        if isMulti {
            let bodyTop = r.minY + headerH
            if bodyTop < r.maxY {
                let body = CGRect(x: r.minX, y: bodyTop, width: r.width, height: r.height - headerH)
                context.stroke(Path(body), with: .color(linePaint), lineWidth: DiagramCanvasInk.diagramLineWidth)
            }
        }

        if isSelected {
            context.stroke(cellPath, with: .color(Color.blue.opacity(0.9)), lineWidth: DiagramCanvasInk.selectionLineWidth)
        }

        switch node.element.type {
        case .aufruf:
            let bar = DiagramCanvasInk.callSideBarInset
            context.stroke(Path { p in
                p.move(to: CGPoint(x: r.minX + bar, y: r.minY))
                p.addLine(to: CGPoint(x: r.minX + bar, y: r.maxY))
                p.move(to: CGPoint(x: r.maxX - bar, y: r.minY))
                p.addLine(to: CGPoint(x: r.maxX - bar, y: r.maxY))
            }, with: .color(linePaint), lineWidth: DiagramCanvasInk.diagramLineWidth)
        case .aussprung:
            let bar = DiagramCanvasInk.callSideBarInset
            context.stroke(Path { p in
                p.move(to: CGPoint(x: r.minX + bar, y: r.minY))
                p.addLine(to: CGPoint(x: r.minX, y: r.midY))
                p.addLine(to: CGPoint(x: r.minX + bar, y: r.maxY))
            }, with: .color(linePaint), lineWidth: DiagramCanvasInk.diagramLineWidth)
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
            }, with: .color(linePaint), lineWidth: DiagramCanvasInk.diagramLineWidth)

            let lines = node.element.textLines
            let ty = DiagramCanvasInk.multiHeaderFirstLineY
            for (i, line) in lines.enumerated() {
                let y = r.minY + ty + CGFloat(i) * lineHeight
                let tw = measureText(line, size: headerFontSize)
                let tx = r.midX - tw / 2
                context.draw(
                    context.resolve(Text(line).font(cellFont)),
                    at: CGPoint(x: tx, y: y),
                    anchor: .topLeading
                )
            }
        } else {
            let lines = node.element.textLines
            let ix = DiagramCanvasInk.cellTextInsetX
            let iy = DiagramCanvasInk.cellTextInsetY
            if node.element.type == .doUntilSchleife {
                var y = r.maxY - DiagramCanvasInk.cellTextInsetYDoUntil
                for line in lines.reversed() {
                    context.draw(
                        context.resolve(Text(line).font(cellFont)),
                        at: CGPoint(x: r.minX + ix, y: y),
                        anchor: .topLeading
                    )
                    y -= lineHeight
                }
            } else {
                var y = r.minY + iy
                for line in lines {
                    context.draw(
                        context.resolve(Text(line).font(cellFont)),
                        at: CGPoint(x: r.minX + ix, y: y),
                        anchor: .topLeading
                    )
                    y += lineHeight
                }
            }
        }

        for c in node.children {
            drawNode(c, selectedPath: selectedPath, in: &context)
        }

        if isMulti, let dividerX = node.dividerX, node.caseColumnFrames.count > 1 {
            let yInset = CGFloat(node.dividerYInset ?? 0)
            let apex = CGPoint(x: dividerX, y: r.minY + headerH + yInset)
            for (idx, col) in node.caseColumnFrames.enumerated() where idx < node.caseColumnFrames.count - 1 {
                let xSep = CGFloat(col.x + col.width)
                let yTop = yOnSwitchHeaderDiagonal(xSep: xSep, rect: r, apex: apex)
                context.stroke(Path { p in
                    p.move(to: CGPoint(x: xSep, y: r.maxY))
                    p.addLine(to: CGPoint(x: xSep, y: yTop))
                }, with: .color(linePaint), lineWidth: DiagramCanvasInk.diagramLineWidth)
            }

            if let cases = node.element.cases, cases.count == node.caseColumnFrames.count {
                let labelY = r.minY + headerH - 6
                let lx = DiagramCanvasInk.branchLabelInsetX
                if node.element.type == .verzweigung && cases.count == 2 {
                    let left = "true"
                    let right = "false"
                    let rw = measureText(right, size: headerFontSize)
                    context.draw(
                        context.resolve(Text(left).font(cellFont)),
                        at: CGPoint(x: r.minX + lx, y: labelY),
                        anchor: .bottomLeading
                    )
                    let rx = node.caseColumnFrames[1].x + node.caseColumnFrames[1].width - lx - rw
                    context.draw(
                        context.resolve(Text(right).font(cellFont)),
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
                            context.resolve(Text(label).font(cellFont)),
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
        let e = node.element
        let lines = max(1, e.textLines.count)
        let baseExtra: Double
        switch e.type {
        case .anweisung, .aussprung, .aufruf, .leerElement:
            baseExtra = 14
        case .fallauswahl:
            baseExtra = 40
        case .verzweigung:
            baseExtra = 20
        case .doUntilSchleife:
            baseExtra = 20
        case .forSchleife, .whileSchleife, .endlosschleife:
            baseExtra = layoutMetrics.baseHeaderExtra + 4
        default:
            baseExtra = layoutMetrics.baseHeaderExtra
        }
        return baseExtra + Double(lines) * layoutMetrics.lineHeight + Double(e.zoomY)
    }

    /// NSString-Messung ist korrekt, aber teuer bei vielen Zeilen — Cache mit begrenzter Größe.
    #if canImport(UIKit)
    private static let textWidthCache: NSCache<NSString, NSNumber> = {
        let c = NSCache<NSString, NSNumber>()
        c.countLimit = 400
        return c
    }()
    #endif

    private func measureText(_ s: String, size: CGFloat) -> CGFloat {
        #if canImport(UIKit)
        let key = "\(Int((size * 1000).rounded()))|\(s)" as NSString
        if let cached = Self.textWidthCache.object(forKey: key) {
            return CGFloat(truncating: cached)
        }
        let w = (s as NSString).size(withAttributes: [
            .font: UIFont.systemFont(ofSize: size, weight: .medium)
        ]).width
        Self.textWidthCache.setObject(NSNumber(value: Double(w)), forKey: key)
        return w
        #else
        return CGFloat(s.count) * size * 0.55
        #endif
    }
}

#if canImport(UIKit)
/// `UIScrollView` verzögert Touch-Weitergabe standardmäßig — dann startet oft Scrollen statt `draggable` (Verschieben im Diagramm).
private struct ScrollViewDragTouchesForDiagram: UIViewRepresentable {
    func makeUIView(context: Context) -> UIView {
        let v = UIView()
        v.isUserInteractionEnabled = false
        v.backgroundColor = .clear
        return v
    }

    func updateUIView(_ uiView: UIView, context: Context) {
        DispatchQueue.main.async {
            var walker: UIView? = uiView.superview
            while let cur = walker {
                if let sc = cur as? UIScrollView {
                    sc.delaysContentTouches = false
                    break
                }
                walker = cur.superview
            }
        }
    }
}
#endif
