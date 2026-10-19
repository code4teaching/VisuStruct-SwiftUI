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

extension [Int] {
    /// Stabiler Schlüssel für Sets / Drop-Zonen (z. B. Platzhalter-Lookup).
    var diagramPathKey: String { map(String.init).joined(separator: ",") }
}

extension VisuStructLayout.Node {
    /// `ForEach`-Identität (stabiler String statt `[Int]`-Hash).
    var pathKey: String { idPath.diagramPathKey }
}

/// Etwas größere Typo (+2 pt) und kräftigere Kanten im Diagramm-`Canvas`.
enum DiagramCanvasInk {
    static let extraFontPoints: Double = 2
    static let extraLineHeightPoints: Double = 2
    static let diagramLineWidth: CGFloat = 2
    static let outerFrameLineWidth: CGFloat = 2
    static let selectionLineWidth: CGFloat = 3.5
    /// Außenabstand Rahmen zum Canvas-Rand; innen mehr Luft für Beschriftung.
    static let canvasOuterMargin: CGFloat = 16
    static let cellTextInsetX: CGFloat = 18
    static let cellTextInsetY: CGFloat = 15
    static let multiHeaderFirstLineY: CGFloat = 14
    static let branchLabelInsetX: CGFloat = 10
    /// Platz unter dem Titel „Fallauswahl“ bis zur Kopf-/Rumpf-Grenze — Fall-Labels (1/2/…) sitzen in diesem Streifen; Dachspitze darf nicht hineinragen.
    static let fallauswahlCaseLabelBand: CGFloat = 26
    static let callSideBarInset: CGFloat = 14
    static let callTextInsetFromSideBar: CGFloat = 20
    /// Schmaler Streifen **oberhalb** des ersten Wurzelelements: Einfügen / Verschieben an Position 0 ohne oberste „davor“-Zone zu treffen.
    static let rootInsertStripHeight: CGFloat = 14
    /// Gleich `VisuStructLayoutEngine` / `layoutLoop`: Schleifenrumpf beginnt hier (px, vor Canvas-Skalierung — Layout-Koordinaten).
    static let loopBodyLeadingInset: CGFloat = 20
}

/// Teilweise fehlende Rechteckkanten (z. B. Do-Until: erster Rumpf ohne obere/linke Linie — gemeinsam mit senkrechter Trennlinie).
struct CellBorderOmission: OptionSet {
    let rawValue: Int
    static let top = CellBorderOmission(rawValue: 1 << 0)
    static let left = CellBorderOmission(rawValue: 1 << 1)
    static let bottom = CellBorderOmission(rawValue: 1 << 2)
    static let right = CellBorderOmission(rawValue: 1 << 3)
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
    /// Im Simulationsmodus bedeutet die Markierung „aktueller Schritt“ statt Bearbeitungsauswahl.
    var usesSimulationSelectionHighlight: Bool = false

    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @Environment(\.appLanguage) var lang

    var isPhone: Bool {
        #if canImport(UIKit)
        return UIDevice.current.userInterfaceIdiom == .phone
        #else
        return false
        #endif
    }

    @State var dropHighlightKey: String?

    enum DropBand: String {
        case before
        case on
        case after
    }

    var rootDropHighlightKey: String { "__root__" }
    var rootInsertBeforeFirstKey: String { "__root_before_first__" }
    var rootAppendKey: String { "__root_append__" }

    func highlightKey(for target: DiagramInsertTarget) -> String {
        switch target {
        case .before(let p): p.map(String.init).joined(separator: ",") + ":" + DropBand.before.rawValue
        case .after(let p): p.map(String.init).joined(separator: ",") + ":" + DropBand.after.rawValue
        case .replace(let p): p.map(String.init).joined(separator: ",") + ":" + DropBand.on.rawValue
        case .rootInsertAt0: rootInsertBeforeFirstKey
        case .rootAppend: rootAppendKey
        }
    }

    var canvasScale: CGFloat { CGFloat(canvasScaleStep.multiplier) }

    var layoutMetrics: VisuStructLayoutEngine.Metrics {
        let base = VisuStructLayoutEngine.diagramDisplayMetrics(isRegularWidth: horizontalSizeClass == .regular)
        return base.scaled(by: Double(canvasScale))
    }

    var lineHeight: CGFloat { CGFloat(layoutMetrics.lineHeight) }
    var headerFontSize: CGFloat { CGFloat(layoutMetrics.fontSize) }

    /// Skaliert feste Abstände/Linien im Canvas mit der Diagramm-Stufe.
    func ink(_ v: CGFloat) -> CGFloat { v * canvasScale }

    var cellFont: Font { .system(size: headerFontSize, weight: .medium) }

    func displayDocumentForLayout(_ doc: VisuStructDocument) -> VisuStructDocument {
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

    func displayTextLines(for element: VisuStructElement) -> [String] {
        if let lines = VisuStructDiagramText.displayLines(for: element) { return lines }

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
            return [lang.tr("canvas_stub_while")]
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
    var diagramLineColor: Color { Color.black }
    var diagramCanvasFill: Color { Color(white: 0.98) }
    var diagramCellFill: Color { Color.white }
    var selectionFillColor: Color {
        usesSimulationSelectionHighlight ? Color(red: 0.78, green: 0.90, blue: 1.0).opacity(0.55) : Color.clear
    }
    var selectionStrokeColor: Color {
        usesSimulationSelectionHighlight ? Color(red: 0.26, green: 0.55, blue: 0.95).opacity(0.78) : Color.blue.opacity(0.9)
    }

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
                    .accessibilityHidden(true)
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
                // Gezeichnete Fläche; VoiceOver liest stattdessen die Blöcke darüber.
                .accessibilityHidden(true)

            if let firstRoot = layout.elements.first {
                rootInsertBeforeFirstStrip(
                    firstRootFrame: firstRoot.frame,
                    canvasWidth: cw,
                    canvasHeight: ch
                )
                .accessibilityHidden(true)
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

    func copyElement(at path: [Int]) {
        guard let el = try? VisuStructDocumentEditing.element(at: path, in: document) else { return }
        elementClipboard = el
    }

    func cutElement(at path: [Int]) {
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

    func pasteClipboard(relativeTo path: [Int]?) {
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
