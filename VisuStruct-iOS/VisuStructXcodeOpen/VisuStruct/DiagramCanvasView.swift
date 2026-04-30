import SwiftUI
import VisuStructCore
#if canImport(UIKit)
import UIKit
#endif

/// Ziel für Tap-Einfügen (iPhone): entspricht den Drop-Semantiken (ähnlich wie Drag&Drop-Bänder).
enum DiagramInsertTarget: Equatable, Sendable {
    case before([Int])
    case after([Int])
    case replace([Int])   // Platzhalter ersetzen
    case rootInsertAt0
    case rootAppend
}

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
    /// Platz unter dem Titel „Fallauswahl“ bis zur Kopf-/Rumpf-Grenze — Fall-Labels (1/2/…) sitzen in diesem Streifen; Dachspitze darf nicht hineinragen.
    static let fallauswahlCaseLabelBand: CGFloat = 26
    static let callSideBarInset: CGFloat = 14
    static let callTextInsetFromSideBar: CGFloat = 20
    /// Schmaler Streifen **oberhalb** des ersten Wurzelelements: Einfügen / Verschieben an Position 0 ohne oberste „davor“-Zone zu treffen.
    static let rootInsertStripHeight: CGFloat = 14
}

struct DiagramCanvasView: View {
    @Binding var document: VisuStructDocument
    @Binding var selectedPath: [Int]?
    @Binding var errorText: String?
    /// iPhone: Einfügeposition per Tap markieren, dann aus Palette einfügen.
    @Binding var insertTarget: DiagramInsertTarget?
    /// In-App Zwischenablage: Kopieren/Ausschneiden/Einfügen von Elementen.
    @Binding var elementClipboard: VisuStructElement?

    /// Einstellungen: Struktogramm-Schrift und -Maße (klein / mittel / groß).
    var canvasScaleStep: VisuStructUIScaleStep = .small

    /// Sichtbarer Bereich des ScrollViews (Fenstergröße). Wenn `.zero`, nur Inhaltsgröße des Layouts.
    var minViewportSize: CGSize = .zero
    /// Optional: engerer Layout-Rand (z. B. PDF/PNG/Druck — weniger Leerraum unter dem freien Titel).
    var layoutTopLeadingInset: (left: Double, top: Double)? = nil
    /// Optional: schmalerer grauer Rahmen zum Blattrand (nur Export; Standard `canvasOuterMargin` = 16).
    var exportCanvasOuterMarginPt: CGFloat? = nil

    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @Environment(\.appLanguage) private var lang

    private var isPhone: Bool {
        #if canImport(UIKit)
        return UIDevice.current.userInterfaceIdiom == .phone
        #else
        return false
        #endif
    }

    @State private var dropHighlightKey: String?

    private enum DropBand: String {
        case before
        case on
        case after
    }

    private var rootDropHighlightKey: String { "__root__" }
    private var rootInsertBeforeFirstKey: String { "__root_before_first__" }
    private var rootAppendKey: String { "__root_append__" }

    private func highlightKey(for target: DiagramInsertTarget) -> String {
        switch target {
        case .before(let p): p.map(String.init).joined(separator: ",") + ":" + DropBand.before.rawValue
        case .after(let p): p.map(String.init).joined(separator: ",") + ":" + DropBand.after.rawValue
        case .replace(let p): p.map(String.init).joined(separator: ",") + ":" + DropBand.on.rawValue
        case .rootInsertAt0: rootInsertBeforeFirstKey
        case .rootAppend: rootAppendKey
        }
    }

    private var canvasScale: CGFloat { CGFloat(canvasScaleStep.multiplier) }

    private var layoutMetrics: VisuStructLayoutEngine.Metrics {
        let base = VisuStructLayoutEngine.diagramDisplayMetrics(isRegularWidth: horizontalSizeClass == .regular)
        return base.scaled(by: Double(canvasScale))
    }

    private var lineHeight: CGFloat { CGFloat(layoutMetrics.lineHeight) }
    private var headerFontSize: CGFloat { CGFloat(layoutMetrics.fontSize) }

    /// Skaliert feste Abstände/Linien im Canvas mit der Diagramm-Stufe.
    private func ink(_ v: CGFloat) -> CGFloat { v * canvasScale }

    private var cellFont: Font { .system(size: headerFontSize, weight: .medium) }

    private func displayDocumentForLayout(_ doc: VisuStructDocument) -> VisuStructDocument {
        func mapElement(_ e: VisuStructElement) -> VisuStructElement {
            let mappedLoop = e.loopBody?.map(mapElement)
            let mappedCases = e.cases?.map { c in
                VisuStructCase(name: c.name, elements: c.elements.map(mapElement))
            }
            return VisuStructElement(
                type: e.type,
                zoomX: e.zoomX,
                zoomY: e.zoomY,
                textColor: e.textColor,
                backgroundColor: e.backgroundColor,
                textLines: displayTextLines(for: e),
                loopBody: mappedLoop,
                cases: mappedCases
            )
        }

        var out = doc
        out.elements = doc.elements.map(mapElement)
        return out
    }

    private func displayTextLines(for element: VisuStructElement) -> [String] {
        let raw = element.textLines
        let isEffectivelyEmpty = raw.allSatisfy { $0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
        if element.type == .forSchleife, !isEffectivelyEmpty {
            if raw.count <= 1 { return raw }
            return [VisuStructForLoopDiagramDisplay.singleLine(from: raw)]
        }
        guard isEffectivelyEmpty else { return raw }

        switch element.type {
        case .anweisung:
            return [lang.tr("canvas_stub_anweisung")]
        case .verzweigung:
            return [lang.tr("canvas_stub_condition")]
        case .fallauswahl:
            return [lang.tr("canvas_stub_fallauswahl")]
        case .forSchleife:
            return [lang.tr("canvas_stub_for")]
        case .whileSchleife:
            return [lang.tr("canvas_stub_while")]
        case .doUntilSchleife:
            return [lang.tr("canvas_stub_until")]
        case .endlosschleife:
            return [lang.tr("canvas_stub_endless")]
        case .aussprung:
            return [lang.tr("canvas_stub_break")]
        case .aufruf:
            return [lang.tr("canvas_stub_call")]
        case .leerElement:
            return ["ø"]
        }
    }

    /// Gemeinsame Stroke-Farbe für Kacheln und Hilfslinien (eine Allokation pro Frame statt dutzende).
    private var diagramLineColor: Color { Color.gray.opacity(0.85) }
    private var diagramCanvasFill: Color { Color(white: 0.98) }
    private var diagramCellFill: Color { Color.white }

    var body: some View {
        let engine = VisuStructLayoutEngine(metrics: layoutMetrics)
        let displayDoc = displayDocumentForLayout(document)
        let layout = layoutTopLeadingInset.map { ins in
            engine.layout(document: displayDoc, topLeadingContentInset: ins)
        } ?? engine.layout(document: displayDoc)
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
                        // iPhone: Einfügemarke durch Tap auf leeren Bereich löschen.
                        if isPhone {
                            insertTarget = nil
                        }
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
        .onTapGesture {
            // iPhone: leeres Dokument → Einfügen ans Root (ersetzt Platzhalter).
            if isPhone {
                insertTarget = .rootAppend
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
            if isPhone, let target = insertTarget {
                // Falls bereits ein Ziel gesetzt ist: Tap auf Kachel selektiert normal (zum Text bearbeiten).
                // Einfügemarke bleibt.
                selectedPath = node.idPath
                _ = target
            } else if isPhone {
                // iPhone: Tap markiert Einfügeziel. Für Platzhalter = replace, sonst "on" ist nicht zulässig.
                if isPlaceholderNode {
                    insertTarget = .replace(node.idPath)
                } else {
                    // Default: Einfügen NACH dem Element (am häufigsten sinnvoll beim Tippen).
                    insertTarget = .after(node.idPath)
                }
                selectedPath = node.idPath
            } else {
                selectedPath = node.idPath
            }
        }
        .contextMenu {
            Button(lang.tr("ctx_copy")) {
                copyElement(at: node.idPath)
            }
            Button(lang.tr("ctx_cut")) {
                cutElement(at: node.idPath)
            }
            .disabled(!VisuStructDocumentEditing.canDeleteElement(at: node.idPath, in: document))
            Button(lang.tr("ctx_paste")) {
                pasteClipboard(relativeTo: node.idPath)
            }
            .disabled(elementClipboard == nil)
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

    private func copyElement(at path: [Int]) {
        guard let el = try? VisuStructDocumentEditing.element(at: path, in: document) else { return }
        elementClipboard = el
    }

    private func cutElement(at path: [Int]) {
        guard let el = try? VisuStructDocumentEditing.element(at: path, in: document) else { return }
        elementClipboard = el
        do {
            document = try VisuStructDocumentEditing.deleteAtPath(document, path: path)
            errorText = nil
            // Selektion nach dem Löschen sanitizen.
            if document.elements.isEmpty {
                selectedPath = nil
            } else if let sp = selectedPath, (try? VisuStructDocumentEditing.element(at: sp, in: document)) == nil {
                selectedPath = [0]
            }
        } catch {
            errorText = error.localizedDescription
        }
    }

    private func pasteClipboard(relativeTo path: [Int]?) {
        guard let clip = elementClipboard else { return }
        do {
            if let targetPath = path {
                if VisuStructDocumentEditing.isPlaceholderSlot(at: targetPath, in: document) {
                    document = try VisuStructDocumentEditing.replaceAtPath(document, path: targetPath, with: clip)
                    selectedPath = targetPath
                } else if (try? VisuStructDocumentEditing.element(at: targetPath, in: document)) != nil {
                    document = try VisuStructDocumentEditing.insertAfterSibling(document, clip, after: targetPath)
                    let newPath = Array(targetPath.dropLast()) + [targetPath.last! + 1]
                    selectedPath = newPath
                } else {
                    document = VisuStructDocumentEditing.appendRoot(document, clip)
                    selectedPath = [document.elements.count - 1]
                }
            } else if let sp = selectedPath {
                // Paste ohne expliziten Knoten: am aktuellen Selection-Context orientieren.
                pasteClipboard(relativeTo: sp)
                return
            } else {
                document = VisuStructDocumentEditing.appendRoot(document, clip)
                selectedPath = [document.elements.count - 1]
            }
            errorText = nil
        } catch {
            errorText = error.localizedDescription
        }
    }

    /// Gesamte Kachel = ein Ziel nur für „ersetzen“ (`.on`-Semantik).
    @ViewBuilder
    private func placeholderReplaceDropSurface(node: VisuStructLayout.Node, width: CGFloat, height: CGFloat) -> some View {
        let key = bandHighlightKey(path: node.idPath, band: .on)
        let showHL = dropHighlightKey == key || (insertTarget.map(highlightKey(for:)) == key)
        let isSelected = selectedPath == node.idPath
        Color.clear
            .frame(width: width, height: height)
            .contentShape(Rectangle())
            // Im Normalzustand keine farbigen Drop-Flächen rendern (wirkt sonst wie ein Verlauf).
            .background(showHL ? Color.blue.opacity(0.2) : Color.clear)
            .overlay {
                Group {
                    if showHL {
                        RoundedRectangle(cornerRadius: 4)
                            .strokeBorder(Color.blue.opacity(0.95), lineWidth: 3)
                    } else if isSelected {
                        // Platzhalterflächen haben immer eine gestrichelte Rahmen-Overlay.
                        // Wenn selektiert, soll die blaue Auswahl sichtbar sein (sonst überdeckt der gestrichelte Rahmen die Canvas-Auswahl).
                        RoundedRectangle(cornerRadius: 4)
                            .strokeBorder(Color.blue.opacity(0.9), lineWidth: ink(DiagramCanvasInk.selectionLineWidth))
                    } else {
                        RoundedRectangle(cornerRadius: 4)
                            .strokeBorder(Color.blue.opacity(0.35), style: StrokeStyle(lineWidth: 1.5, dash: [5, 4]))
                    }
                }
                .padding(2)
            }
            // Kein eigener Tap hier: auf iPad/Mac wäre der Body leer, SwiftUI würde den Tap trotzdem schlucken —
            // dann feuert der äußere Tap in `nodeDropBands` nicht mehr (keine Auswahl / kein Ersatz-Ziel).
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

    /// Nur Layout-Hilfe zwischen den Drop-Streifen — **keine** sichtbare Linie (sonst volle Knotenbreite, wirkt wie kaputtes Raster / schneidet Verzweigung & Fallauswahl).
    private func dropZoneSeparator(width: CGFloat) -> some View {
        Color.clear.frame(width: width, height: 1)
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
        let sh = ink(DiagramCanvasInk.rootInsertStripHeight)
        let y = max(0, CGFloat(firstRootFrame.y) - sh - 2)
        if y + sh <= canvasHeight && canvasWidth > 4 {
            let key = rootInsertBeforeFirstKey
            let showHL = dropHighlightKey == key || (insertTarget.map(highlightKey(for:)) == key)
            let stripCore = Color.clear
                .frame(width: canvasWidth, height: sh)
                .offset(x: 0, y: y)
                .contentShape(Rectangle())
                .background(showHL ? Color.blue.opacity(0.18) : Color.clear)
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
            if isPhone {
                stripCore.onTapGesture {
                    insertTarget = .rootInsertAt0
                }
            } else {
                stripCore
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
        let showHL = dropHighlightKey == key || (insertTarget.map(highlightKey(for:)) == key)
        let bandCore = Color.clear
            .frame(width: width, height: height)
            .contentShape(Rectangle())
            // Drop-Zonen nur beim tatsächlichen Drag-Target visuell zeigen.
            .background(showHL ? Color.blue.opacity(band == .on ? 0.22 : 0.16) : Color.clear)
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
        // Tap nur auf dem iPhone anhängen: sonst schluckt `onTapGesture` den Klick auf iPad/Mac,
        // obwohl der Body sofort returnt — der äußere Tap in `nodeDropBands` kommt nicht an.
        if isPhone {
            bandCore.onTapGesture {
                switch band {
                case .before:
                    insertTarget = .before(node.idPath)
                case .after:
                    insertTarget = .after(node.idPath)
                case .on:
                    if VisuStructDocumentEditing.isPlaceholderSlot(at: node.idPath, in: document) {
                        insertTarget = .replace(node.idPath)
                    }
                }
                selectedPath = node.idPath
            }
        } else {
            bandCore
        }
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
        Array(siblingPath.dropLast()) + [siblingPath.last! + 1]
    }

    private func parsePath(_ s: String) -> [Int] {
        s.split(separator: ",").compactMap { Int(String($0).trimmingCharacters(in: .whitespaces)) }
    }

    private func canvasView(layout: VisuStructLayout, cw: CGFloat, ch: CGFloat) -> some View {
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
            context.stroke(outerFramePath, with: .color(Color.gray.opacity(0.6)), lineWidth: ink(DiagramCanvasInk.outerFrameLineWidth))

            for n in layout.elements {
                drawNode(n, selectedPath: selectedPath, in: &context)
            }
        }
        .frame(width: cw, height: ch)
    }

    /// Dachspitze + Textgrenze für Verzweigung/Fallauswahl; **zwei** Zeichenphasen müssen dieselbe Spitze nutzen (sonst „springen“ senkrechte Linien).
    private struct MultiwayRoofMetrics {
        let apex: CGPoint
        let maxTextBottom: CGFloat
        let roofBottom: CGFloat
    }

    private func multiwayRoofMetrics(node: VisuStructLayout.Node, rect r: CGRect, headerH: CGFloat, dividerX: CGFloat) -> MultiwayRoofMetrics {
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
        context.stroke(cellPath, with: .color(linePaint), lineWidth: ink(DiagramCanvasInk.diagramLineWidth))
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
                let tw = measureText(line, size: headerFontSize)
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
                context.draw(
                    context.resolve(Text(verbatim: line).font(cellFont).foregroundStyle(.black)),
                    at: CGPoint(x: tx, y: y),
                    anchor: .topLeading
                )
            }
        } else {
            let lines = displayTextLines(for: node.element)
            let ix = ink(DiagramCanvasInk.cellTextInsetX)
            let iy = ink(DiagramCanvasInk.cellTextInsetY)
            if node.element.type == .doUntilSchleife {
                var y = r.maxY - ink(DiagramCanvasInk.cellTextInsetYDoUntil)
                for line in lines.reversed() {
                    context.draw(
                        context.resolve(Text(verbatim: line).font(cellFont).foregroundStyle(.black)),
                        at: CGPoint(x: r.minX + ix, y: y),
                        anchor: .topLeading
                    )
                    y -= lineHeight
                }
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
                    let tw = measureText(line, size: headerFontSize)
                    let x = contentLeft + (contentWidth - tw) / 2
                    context.draw(
                        context.resolve(Text(verbatim: line).font(cellFont).foregroundStyle(.black)),
                        at: CGPoint(x: x, y: y),
                        anchor: .topLeading
                    )
                    y += lineHeight
                }
            } else {
                var y = r.minY + iy
                for line in lines {
                    context.draw(
                        context.resolve(Text(verbatim: line).font(cellFont).foregroundStyle(.black)),
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
                    let rw = measureText(right, size: headerFontSize)
                    context.draw(
                        context.resolve(Text(verbatim: left).font(cellFont).foregroundStyle(.black)),
                        at: CGPoint(x: r.minX + lx, y: labelY),
                        anchor: .bottomLeading
                    )
                    let rx = node.caseColumnFrames[1].x + node.caseColumnFrames[1].width - lx - rw
                    context.draw(
                        context.resolve(Text(verbatim: right).font(cellFont).foregroundStyle(.black)),
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
                            context.resolve(Text(verbatim: label).font(cellFont).foregroundStyle(.black)),
                            at: CGPoint(x: cx, y: labelY),
                            anchor: .bottomLeading
                        )
                    }
                }
            }
        }

        // Auswahlrahmen IMMER zuletzt zeichnen, damit Kinder/Innenlinien ihn nicht übermalen (v. a. bei verschachtelten Verzweigungen/Fallauswahl).
        if isSelected {
            context.stroke(cellPath, with: .color(Color.blue.opacity(0.9)), lineWidth: ink(DiagramCanvasInk.selectionLineWidth))
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
        @unknown default:
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
