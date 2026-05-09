import Foundation

public enum VisuStructEditError: Error, LocalizedError, Sendable, Equatable {
    case invalidPath
    case cannotDeleteLastRootElement
    /// Switch: at least two cases (columns) must remain.
    case cannotRemoveFallauswahlCaseMinimum

    public var errorDescription: String? {
        switch self {
        case .invalidPath: "Invalid element path."
        case .cannotDeleteLastRootElement: "The last root element cannot be deleted."
        case .cannotRemoveFallauswahlCaseMinimum:
            "A switch statement must keep at least two cases — no further case can be removed."
        }
    }
}

/// Mutationen am Dokument — Swift-nativ; Pfade wie im Layout (`idPath`).
public enum VisuStructDocumentEditing: Sendable {

    private static func placeholderElement() -> VisuStructElement {
        // Konsistent zum Startdokument und zu den Java-kompatiblen Platzhaltern.
        VisuStructElement(type: .anweisung, textLines: ["ø"])
    }

    public static func newEmpty() -> VisuStructDocument {
        VisuStructDocument(caption: "", elements: [
            placeholderElement()
        ])
    }

    /// Leeres Startdokument: genau ein Wurzel-Anweisungselement mit Text „ø“ (Platzhalter für die erste Struktur).
    public static func isStarterPlaceholder(in doc: VisuStructDocument) -> Bool {
        isSingleRootPlaceholder(in: doc)
    }

    /// Genau ein Wurzelelement, das als leerer Platzhalter gilt (ø, leere Zeile, `leerElement`).
    public static func isSingleRootPlaceholder(in doc: VisuStructDocument) -> Bool {
        doc.elements.count == 1 && isPlaceholderSlot(at: [0], in: doc)
    }

    /// Darf per Drag & Drop auf der Kachelmitte ersetzt werden (ø, leer — nicht der Palette-Text „Anweisung“, sonst kein zweites Wurzelelement möglich).
    public static func isPlaceholderElement(_ el: VisuStructElement) -> Bool {
        if el.type == .leerElement { return true }
        if el.type == .anweisung {
            let t = el.textLines
            // Platzhalter ist bewusst **nur** der explizite Slot-Stub "ø" (oder ein komplett fehlender Text).
            // Eine echte Anweisung darf leer sein ([""]) ohne als Platzhalter zu gelten – sonst würden Palette-Klicks
            // das erste Element ersetzen statt dahinter einzufügen.
            if t.isEmpty || t == ["ø"] { return true }
        }
        return false
    }

    public static func isPlaceholderSlot(at path: [Int], in doc: VisuStructDocument) -> Bool {
        guard let el = try? element(at: path, in: doc) else { return false }
        return isPlaceholderElement(el)
    }

    /// Ob an diesem Pfad gelöscht werden darf (das letzte Wurzelelement nie — sonst fehlt der Canvas).
    public static func canDeleteElement(at path: [Int], in doc: VisuStructDocument) -> Bool {
        guard !path.isEmpty else { return false }
        if path.count == 1 {
            // Wenn nur ein Root-Element existiert, darf es gelöscht werden, **sofern** es kein Platzhalter ist.
            // Statt "kein Element" wird dann wieder ein einzelner Platzhalter (ø) eingesetzt.
            if doc.elements.count > 1 { return true }
            return !isPlaceholderSlot(at: path, in: doc)
        }
        return true
    }

    public static func appendRoot(_ doc: VisuStructDocument, _ element: VisuStructElement) -> VisuStructDocument {
        var d = doc
        d.elements.append(element)
        return d
    }

    public static func appendAnweisungRoot(_ doc: VisuStructDocument) -> VisuStructDocument {
        appendRoot(doc, placeholderElement())
    }

    public static func element(at path: [Int], in doc: VisuStructDocument) throws -> VisuStructElement {
        guard let i = path.first else { throw VisuStructEditError.invalidPath }
        guard i >= 0, i < doc.elements.count else { throw VisuStructEditError.invalidPath }
        if path.count == 1 { return doc.elements[i] }
        return try elementInside(doc.elements[i], path: Array(path.dropFirst()))
    }

    public static func setTextLines(_ doc: VisuStructDocument, path: [Int], lines: [String]) throws -> VisuStructDocument {
        var el = try element(at: path, in: doc)
        el.textLines = lines.isEmpty ? [""] : lines
        return try replaceAtPath(doc, path: path, with: el)
    }

    public static func replaceAtPath(_ doc: VisuStructDocument, path: [Int], with newElement: VisuStructElement) throws -> VisuStructDocument {
        guard let i = path.first else { throw VisuStructEditError.invalidPath }
        guard i >= 0, i < doc.elements.count else { throw VisuStructEditError.invalidPath }
        var d = doc
        if path.count == 1 {
            d.elements[i] = newElement
        } else {
            var parent = d.elements[i]
            try replaceInside(&parent, path: Array(path.dropFirst()), with: newElement)
            d.elements[i] = parent
        }
        // Gleicher Inhalt wie zuvor → Equatable bleibt true; SwiftUI würde nicht neu zeichnen (z. B. Anweisung auf bereits ø-Anweisung).
        if d == doc {
            d.uiGeneration = doc.uiGeneration &+ 1
        }
        return d
    }

    public static func deleteAtPath(_ doc: VisuStructDocument, path: [Int]) throws -> VisuStructDocument {
        guard let i = path.first else { throw VisuStructEditError.invalidPath }
        guard i >= 0, i < doc.elements.count else { throw VisuStructEditError.invalidPath }
        var d = doc
        if path.count == 1 {
            if d.elements.count == 1 {
                // Letztes Root-Element: echtes Element → durch Platzhalter ersetzen; Platzhalter selbst bleibt unlöschbar.
                guard !isPlaceholderElement(d.elements[i]) else { throw VisuStructEditError.cannotDeleteLastRootElement }
                d.elements[i] = placeholderElement()
                return d
            }
            d.elements.remove(at: i)
            return d
        }
        var parent = d.elements[i]
        try deleteInside(&parent, path: Array(path.dropFirst()))
        d.elements[i] = parent
        return d
    }

    /// Neues Element in die Kinder-Liste unter `parentPath` einfügen (`parentPath` leer = Wurzel). `index` clamped auf `0...count`.
    public static func insertAt(_ doc: VisuStructDocument, parentPath: [Int], index: Int, element: VisuStructElement) throws -> VisuStructDocument {
        var d = doc
        if parentPath.isEmpty {
            let i = min(max(0, index), d.elements.count)
            d.elements.insert(element, at: i)
            return d
        }
        let p0 = parentPath[0]
        guard p0 >= 0, p0 < d.elements.count else { throw VisuStructEditError.invalidPath }
        var node = d.elements[p0]
        try insertInside(&node, path: Array(parentPath.dropFirst()), index: index, element: element)
        d.elements[p0] = node
        return d
    }

    /// Einfügen direkt **hinter** dem Geschwister `siblingPath` (gleiche Eltern-Liste).
    public static func insertAfterSibling(_ doc: VisuStructDocument, _ element: VisuStructElement, after siblingPath: [Int]) throws -> VisuStructDocument {
        guard !siblingPath.isEmpty else { throw VisuStructEditError.invalidPath }
        let parent = Array(siblingPath.dropLast())
        let idx = siblingPath.last! + 1
        return try insertAt(doc, parentPath: parent, index: idx, element: element)
    }

    /// Einfügen direkt **vor** dem Geschwister `siblingPath`.
    public static func insertBeforeSibling(_ doc: VisuStructDocument, _ element: VisuStructElement, before siblingPath: [Int]) throws -> VisuStructDocument {
        guard !siblingPath.isEmpty else { throw VisuStructEditError.invalidPath }
        let parent = Array(siblingPath.dropLast())
        let idx = siblingPath.last!
        return try insertAt(doc, parentPath: parent, index: idx, element: element)
    }

    /// Verschiebt den Knoten **vor** `beforePath` (gleiche Eltern-Liste).
    public static func moveBeforeSibling(_ doc: VisuStructDocument, from fromPath: [Int], before beforePath: [Int]) throws -> VisuStructDocument {
        guard !fromPath.isEmpty, !beforePath.isEmpty else { throw VisuStructEditError.invalidPath }
        if fromPath == beforePath { return doc }
        if isStrictAncestor(ancestor: fromPath, of: beforePath) { throw VisuStructEditError.invalidPath }
        let moving = try element(at: fromPath, in: doc)
        let d = try deleteAtPath(doc, path: fromPath)
        let target = adjustPathAfterRemoving(path: beforePath, removedPath: fromPath)
        return try insertBeforeSibling(d, moving, before: target)
    }

    /// Verschiebt `fromPath` auf einen Platzhalter (ersetzt diesen). `newPath` ist der Pfad des verschobenen Knotens danach.
    public static func moveReplacingPlaceholder(_ doc: VisuStructDocument, from fromPath: [Int], placeholderPath: [Int]) throws -> (VisuStructDocument, newPath: [Int]) {
        guard isPlaceholderSlot(at: placeholderPath, in: doc) else { throw VisuStructEditError.invalidPath }
        if fromPath == placeholderPath { return (doc, fromPath) }
        if isStrictAncestor(ancestor: fromPath, of: placeholderPath) { throw VisuStructEditError.invalidPath }
        let moving = try element(at: fromPath, in: doc)
        let d = try deleteAtPath(doc, path: fromPath)
        let ph = adjustPathAfterRemoving(path: placeholderPath, removedPath: fromPath)
        let updated = try replaceAtPath(d, path: ph, with: moving)
        return (updated, ph)
    }

    /// Knoten an neuer Position: direkt **hinter** `afterPath` einordnen (`fromPath` wird entfernt und eingefügt).
    public static func moveAfterSibling(_ doc: VisuStructDocument, from fromPath: [Int], after afterPath: [Int]) throws -> VisuStructDocument {
        guard !fromPath.isEmpty, !afterPath.isEmpty else { throw VisuStructEditError.invalidPath }
        if fromPath == afterPath { return doc }
        if isStrictAncestor(ancestor: fromPath, of: afterPath) { throw VisuStructEditError.invalidPath }
        let moving = try element(at: fromPath, in: doc)
        let d = try deleteAtPath(doc, path: fromPath)
        let target = adjustPathAfterRemoving(path: afterPath, removedPath: fromPath)
        return try insertAfterSibling(d, moving, after: target)
    }

    /// Passt einen bestehenden Pfad an, nachdem `removedPath` aus seiner Geschwisterliste entfernt wurde.
    /// Beispiel: Entfernt `[0]`, dann wird ein Ziel in `[1,0,0]` zu `[0,0,0]`.
    ///
    /// Diese Methode ist **nicht-werfend** und eignet sich auch für UI-Berechnungen (z. B. Selektion nach Drag&Drop).
    public static func adjustPathAfterRemoving(path: [Int], removedPath: [Int]) -> [Int] {
        guard let removedIndex = removedPath.last else { return path }
        let removedParent = Array(removedPath.dropLast())
        guard path.count > removedParent.count,
              Array(path.prefix(removedParent.count)) == removedParent else {
            return path
        }

        let affectedIndexPosition = removedParent.count
        let targetIndex = path[affectedIndexPosition]
        guard targetIndex > removedIndex else { return path }

        var adjusted = path
        adjusted[affectedIndexPosition] = targetIndex - 1
        return adjusted
    }

    /// Neuer Fall für eine **Fallauswahl** (nicht Verzweigung): ein Platzhalter „ø“, Name automatisch (`3` vor `default` usw.).
    /// - Returns: Aktualisiertes Dokument und Pfad zum neuen Platzhalter-Kindelement.
    public static func appendCaseToFallauswahl(
        _ doc: VisuStructDocument,
        fallauswahlPath: [Int]
    ) throws -> (VisuStructDocument, newSelectionPath: [Int]) {
        var parent = try element(at: fallauswahlPath, in: doc)
        guard parent.type == .fallauswahl, var cases = parent.cases, !cases.isEmpty else {
            throw VisuStructEditError.invalidPath
        }
        let stub = placeholderElement()
        let insertIndex: Int
        let newCaseName: String
        if let last = cases.last, last.name.lowercased() == "default" {
            insertIndex = cases.count - 1
            newCaseName = "\(cases.dropLast().count + 1)"
        } else {
            insertIndex = cases.count
            newCaseName = "\(cases.count + 1)"
        }
        cases.insert(VisuStructCase(name: newCaseName, elements: [stub]), at: insertIndex)
        parent.cases = cases
        let updated = try replaceAtPath(doc, path: fallauswahlPath, with: parent)
        let newSelectionPath = fallauswahlPath + [insertIndex, 0]
        return (updated, newSelectionPath)
    }

    /// Entfernt einen Fall der **Fallauswahl** (nicht Verzweigung). Es bleiben mindestens **zwei** Fälle übrig.
    /// - Returns: Aktualisiertes Dokument und Pfad zum ersten Element der Spalte, auf die die Auswahl nach dem Entfernen fällt.
    public static func removeCaseFromFallauswahl(
        _ doc: VisuStructDocument,
        fallauswahlPath: [Int],
        caseIndex: Int
    ) throws -> (VisuStructDocument, newSelectionPath: [Int]) {
        var parent = try element(at: fallauswahlPath, in: doc)
        guard parent.type == .fallauswahl, var cases = parent.cases else {
            throw VisuStructEditError.invalidPath
        }
        guard cases.count > 2 else {
            throw VisuStructEditError.cannotRemoveFallauswahlCaseMinimum
        }
        guard caseIndex >= 0, caseIndex < cases.count else {
            throw VisuStructEditError.invalidPath
        }
        cases.remove(at: caseIndex)
        parent.cases = cases
        let updated = try replaceAtPath(doc, path: fallauswahlPath, with: parent)
        let newCaseIdx = min(caseIndex, cases.count - 1)
        let newSelectionPath = fallauswahlPath + [newCaseIdx, 0]
        return (updated, newSelectionPath)
    }

    /// Beschriftung eines Falls der **Fallauswahl** (beliebiger Text wie in Java `fallname`, z. B. `1`, `ok`, `default`).
    public static func setFallauswahlCaseName(
        _ doc: VisuStructDocument,
        fallauswahlPath: [Int],
        caseIndex: Int,
        name: String
    ) throws -> VisuStructDocument {
        var parent = try element(at: fallauswahlPath, in: doc)
        guard parent.type == .fallauswahl, var cases = parent.cases else {
            throw VisuStructEditError.invalidPath
        }
        guard caseIndex >= 0, caseIndex < cases.count else { throw VisuStructEditError.invalidPath }
        let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { throw VisuStructEditError.invalidPath }
        cases[caseIndex].name = trimmed
        parent.cases = cases
        return try replaceAtPath(doc, path: fallauswahlPath, with: parent)
    }

    // MARK: - Private

    private static func isStrictAncestor(ancestor: [Int], of path: [Int]) -> Bool {
        ancestor.count < path.count && Array(path.prefix(ancestor.count)) == ancestor
    }

    private static func insertInside(_ el: inout VisuStructElement, path: [Int], index: Int, element: VisuStructElement) throws {
        guard let head = path.first else {
            switch el.type {
            case .forSchleife, .whileSchleife, .doUntilSchleife, .endlosschleife:
                var b = el.loopBody ?? []
                let i = min(max(0, index), b.count)
                b.insert(element, at: i)
                el.loopBody = b
            case .fallauswahl, .verzweigung:
                throw VisuStructEditError.invalidPath
            default:
                throw VisuStructEditError.invalidPath
            }
            return
        }
        let tail = Array(path.dropFirst())
        switch el.type {
        case .forSchleife, .whileSchleife, .doUntilSchleife, .endlosschleife:
            guard head == 0, var body = el.loopBody else { throw VisuStructEditError.invalidPath }
            if tail.isEmpty {
                let i = min(max(0, index), body.count)
                body.insert(element, at: i)
                el.loopBody = body
            } else {
                try insert(in: &body, path: tail, at: index, element: element)
                el.loopBody = body
            }
        case .fallauswahl, .verzweigung:
            guard var cases = el.cases, head >= 0, head < cases.count else { throw VisuStructEditError.invalidPath }
            var elems = cases[head].elements
            if tail.isEmpty {
                let i = min(max(0, index), elems.count)
                elems.insert(element, at: i)
                cases[head].elements = elems
                el.cases = cases
            } else {
                try insert(in: &elems, path: tail, at: index, element: element)
                cases[head].elements = elems
                el.cases = cases
            }
        default:
            throw VisuStructEditError.invalidPath
        }
    }

    private static func insert(in list: inout [VisuStructElement], path: [Int], at index: Int, element: VisuStructElement) throws {
        if path.isEmpty {
            let i = min(max(0, index), list.count)
            list.insert(element, at: i)
            return
        }
        guard let j = path.first else { throw VisuStructEditError.invalidPath }
        guard j >= 0, j < list.count else { throw VisuStructEditError.invalidPath }
        if path.count == 1 {
            var node = list[j]
            try insertInside(&node, path: [], index: index, element: element)
            list[j] = node
            return
        }
        var node = list[j]
        try insertInside(&node, path: Array(path.dropFirst()), index: index, element: element)
        list[j] = node
    }

    private static func elementInside(_ el: VisuStructElement, path: [Int]) throws -> VisuStructElement {
        guard let head = path.first else { throw VisuStructEditError.invalidPath }
        let tail = Array(path.dropFirst())
        switch el.type {
        case .forSchleife, .whileSchleife, .doUntilSchleife, .endlosschleife:
            guard head == 0, let body = el.loopBody, !tail.isEmpty else { throw VisuStructEditError.invalidPath }
            let j = tail[0]
            guard j >= 0, j < body.count else { throw VisuStructEditError.invalidPath }
            if tail.count == 1 { return body[j] }
            return try elementInside(body[j], path: Array(tail.dropFirst()))
        case .fallauswahl, .verzweigung:
            guard let cases = el.cases, head >= 0, head < cases.count, !tail.isEmpty else { throw VisuStructEditError.invalidPath }
            let elems = cases[head].elements
            let j = tail[0]
            guard j >= 0, j < elems.count else { throw VisuStructEditError.invalidPath }
            if tail.count == 1 { return elems[j] }
            return try elementInside(elems[j], path: Array(tail.dropFirst()))
        default:
            throw VisuStructEditError.invalidPath
        }
    }

    private static func replaceInside(_ el: inout VisuStructElement, path: [Int], with newElement: VisuStructElement) throws {
        guard let head = path.first else { throw VisuStructEditError.invalidPath }
        let tail = Array(path.dropFirst())
        switch el.type {
        case .forSchleife, .whileSchleife, .doUntilSchleife, .endlosschleife:
            guard head == 0, var body = el.loopBody, !tail.isEmpty else { throw VisuStructEditError.invalidPath }
            if tail.count == 1 {
                let j = tail[0]
                guard j >= 0, j < body.count else { throw VisuStructEditError.invalidPath }
                body[j] = newElement
            } else {
                try replace(in: &body, path: tail, with: newElement)
            }
            el.loopBody = body
        case .fallauswahl, .verzweigung:
            guard var cases = el.cases, head >= 0, head < cases.count, !tail.isEmpty else { throw VisuStructEditError.invalidPath }
            var elems = cases[head].elements
            if tail.count == 1 {
                let j = tail[0]
                guard j >= 0, j < elems.count else { throw VisuStructEditError.invalidPath }
                elems[j] = newElement
            } else {
                try replace(in: &elems, path: tail, with: newElement)
            }
            cases[head].elements = elems
            el.cases = cases
        default:
            throw VisuStructEditError.invalidPath
        }
    }

    private static func replace(in list: inout [VisuStructElement], path: [Int], with newElement: VisuStructElement) throws {
        guard let i = path.first else { throw VisuStructEditError.invalidPath }
        guard i >= 0, i < list.count else { throw VisuStructEditError.invalidPath }
        if path.count == 1 {
            list[i] = newElement
            return
        }
        var node = list[i]
        try replaceInside(&node, path: Array(path.dropFirst()), with: newElement)
        list[i] = node
    }

    private static func deleteInside(_ el: inout VisuStructElement, path: [Int]) throws {
        guard let head = path.first else { throw VisuStructEditError.invalidPath }
        let tail = Array(path.dropFirst())
        switch el.type {
        case .forSchleife, .whileSchleife, .doUntilSchleife, .endlosschleife:
            guard head == 0, var body = el.loopBody, !tail.isEmpty else { throw VisuStructEditError.invalidPath }
            let j = tail[0]
            guard j >= 0, j < body.count else { throw VisuStructEditError.invalidPath }
            if tail.count == 1 {
                body.remove(at: j)
                if body.isEmpty { body = [placeholderElement()] }
            } else {
                try delete(in: &body, path: tail)
                if body.isEmpty { body = [placeholderElement()] }
            }
            el.loopBody = body
        case .fallauswahl, .verzweigung:
            guard var cases = el.cases, head >= 0, head < cases.count, !tail.isEmpty else { throw VisuStructEditError.invalidPath }
            var elems = cases[head].elements
            let j = tail[0]
            guard j >= 0, j < elems.count else { throw VisuStructEditError.invalidPath }
            if tail.count == 1 {
                elems.remove(at: j)
                if elems.isEmpty { elems = [placeholderElement()] }
            } else {
                try delete(in: &elems, path: tail)
                if elems.isEmpty { elems = [placeholderElement()] }
            }
            cases[head].elements = elems
            el.cases = cases
        default:
            throw VisuStructEditError.invalidPath
        }
    }

    private static func delete(in list: inout [VisuStructElement], path: [Int]) throws {
        guard let i = path.first else { throw VisuStructEditError.invalidPath }
        guard i >= 0, i < list.count else { throw VisuStructEditError.invalidPath }
        if path.count == 1 {
            list.remove(at: i)
            return
        }
        var node = list[i]
        try deleteInside(&node, path: Array(path.dropFirst()))
        list[i] = node
    }
}
