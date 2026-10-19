import SwiftUI
import VisuStructCore
#if canImport(UIKit)
import UIKit
#endif

// MARK: - Drop-Zonen (Drag & Drop, Tap-Einfügen)

extension DiagramCanvasView {
    /// Sichtbare, oberste Drop-Fläche, wenn es noch keine Strukturknoten gibt (sonst gewinnt kein Knoten-Drop das Hit-Testing).
    @ViewBuilder
    func emptyDiagramDropPlate(cw: CGFloat, ch: CGFloat) -> some View {
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
    func nodeDropBands(node: VisuStructLayout.Node, isPlaceholderNode: Bool) -> some View {
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
        // VoiceOver: ein Element pro Block (statt der unbeschrifteten Drop-Streifen darin).
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(accessibilityLabel(for: node))
        .accessibilityAddTraits(selectedPath == node.idPath ? [.isButton, .isSelected] : .isButton)
        .accessibilityAction {
            selectedPath = node.idPath
        }
        .accessibilityHint(
            isPlaceholderNode
                ? lang.tr("a11y_placeholder_drop")
                : lang.tr("a11y_node_drop")
        )
    }

    /// Vorgelesener Name eines Blocks: Elementart und Text, z. B. „Anweisung: int x = 5“.
    func accessibilityLabel(for node: VisuStructLayout.Node) -> String {
        // Schlüssel wie in der Palette: element_anweisung, element_verzweigung, …
        let kind = lang.tr("element_\(node.element.type)")
        let text = node.element.textLines
            .joined(separator: " ")
            .trimmingCharacters(in: .whitespacesAndNewlines)
        return text.isEmpty ? kind : "\(kind): \(text)"
    }

    /// Gesamte Kachel = ein Ziel nur für „ersetzen“ (`.on`-Semantik).
    @ViewBuilder
    func placeholderReplaceDropSurface(node: VisuStructLayout.Node, width: CGFloat, height: CGFloat) -> some View {
        let key = bandHighlightKey(path: node.idPath, band: .on)
        let showHL = dropHighlightKey == key || (insertTarget.map(highlightKey(for:)) == key)
        let isSelected = selectedPath == node.idPath
        Color.clear
            .frame(width: width, height: height)
            .contentShape(Rectangle())
            // Im Normalzustand keine farbigen Drop-Flächen rendern (wirkt sonst wie ein Verlauf).
            .background(showHL ? Color.blue.opacity(0.2) : (isSelected ? selectionFillColor : Color.clear))
            .overlay {
                Group {
                    if showHL {
                        RoundedRectangle(cornerRadius: 4)
                            .strokeBorder(Color.blue.opacity(0.95), lineWidth: 3)
                    } else if isSelected {
                        // Platzhalterflächen haben immer eine gestrichelte Rahmen-Overlay.
                        // Wenn selektiert, soll die blaue Auswahl sichtbar sein (sonst überdeckt der gestrichelte Rahmen die Canvas-Auswahl).
                        RoundedRectangle(cornerRadius: 4)
                            .strokeBorder(selectionStrokeColor, lineWidth: ink(DiagramCanvasInk.selectionLineWidth))
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
    func segmentedSiblingDropBands(node: VisuStructLayout.Node, width: CGFloat, height: CGFloat) -> some View {
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
    func dropZoneSeparator(width: CGFloat) -> some View {
        Color.clear.frame(width: width, height: 1)
    }

    /// Obere/untere Drop-Streifen: groß genug für den Finger, Mitte bleibt für Tap / Ziel „Mitte“ nutzbar.
    func siblingDropStripHeight(totalHeight h: CGFloat) -> CGFloat {
        guard h > 2 else { return 1 }
        let minMid: CGFloat = 8
        var strip = min(max(h * 0.22, 11), 34)
        if 2 * strip + minMid > h {
            strip = max((h - minMid) / 2, 4)
        }
        return max(1, strip)
    }

    @ViewBuilder
    func rootInsertBeforeFirstStrip(firstRootFrame: VisuStructRect, canvasWidth: CGFloat, canvasHeight: CGFloat) -> some View {
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

    func bandHighlightKey(path: [Int], band: DropBand) -> String {
        path.map(String.init).joined(separator: ",") + ":" + band.rawValue
    }

    func updateDropHighlight(_ key: String, targeted: Bool) {
        if targeted {
            dropHighlightKey = key
        } else if dropHighlightKey == key {
            dropHighlightKey = nil
        }
    }

    func notifyDragDropCommitted() {
        dropHighlightKey = nil
        #if canImport(UIKit)
        let g = UIImpactFeedbackGenerator(style: .light)
        g.prepare()
        g.impactOccurred()
        #endif
    }

    @ViewBuilder
    func dropBandView(node: VisuStructLayout.Node, band: DropBand, height: CGFloat, width: CGFloat) -> some View {
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

    func applyNodeDrop(_ items: [DiagramDragPayload], node: VisuStructLayout.Node, band: DropBand) -> Bool {
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
                        selectedPath = VisuStructDocumentEditing.adjustPathAfterRemoving(path: path, removedPath: from)
                    } else {
                        guard from != path else { return false }
                        document = try VisuStructDocumentEditing.moveAfterSibling(document, from: from, after: path)
                        errorText = nil
                        selectedPath = pathOfInsertedSibling(after: VisuStructDocumentEditing.adjustPathAfterRemoving(path: path, removedPath: from))
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

    func nodeDragPreview(for node: VisuStructLayout.Node) -> some View {
        let w = min(CGFloat(node.frame.width), 260)
        let h = min(CGFloat(node.frame.height), 180)
        return RoundedRectangle(cornerRadius: 6)
            .strokeBorder(Color.blue.opacity(0.95), lineWidth: 2.5)
            .background(RoundedRectangle(cornerRadius: 6).fill(Color.white.opacity(0.97)))
            .frame(width: w, height: h)
            .shadow(color: .black.opacity(0.28), radius: 10, x: 0, y: 5)
    }

    /// Oberer Wurzel-Streifen: an Index 0 einfügen / dorthin verschieben.
    func applyRootInsertBeforeFirst(_ items: [DiagramDragPayload]) -> Bool {
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

    func applyRootDrop(_ items: [DiagramDragPayload]) -> Bool {
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

    func pathOfInsertedSibling(after siblingPath: [Int]) -> [Int] {
        Array(siblingPath.dropLast()) + [siblingPath.last! + 1]
    }

    func parsePath(_ s: String) -> [Int] {
        s.split(separator: ",").compactMap { Int(String($0).trimmingCharacters(in: .whitespaces)) }
    }
}
