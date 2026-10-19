import Foundation

extension VisuStructDocumentEditing {
    /// Auswahl nach Undo/Redo oder Löschen: leeres Dokument → keine Auswahl; fehlende oder ungültige Auswahl → erstes Element.
    public static func sanitizedSelection(_ path: [Int]?, in doc: VisuStructDocument) -> [Int]? {
        if doc.elements.isEmpty { return nil }
        guard let path else { return [0] }
        if (try? element(at: path, in: doc)) == nil { return [0] }
        return path
    }
}
