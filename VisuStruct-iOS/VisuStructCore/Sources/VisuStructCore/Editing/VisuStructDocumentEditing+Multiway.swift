import Foundation

extension VisuStructDocumentEditing {
    /// Innerste **Fallauswahl** (`multiway`), die `path` enthält (oder selbst ist) — für „Fall hinzufügen/entfernen“.
    public static func multiwayAncestorPath(for path: [Int]?, in doc: VisuStructDocument) -> [Int]? {
        guard let path, !path.isEmpty else { return nil }
        for len in stride(from: path.count, through: 1, by: -1) {
            let prefix = Array(path.prefix(len))
            if let el = try? element(at: prefix, in: doc),
               el.type == .fallauswahl {
                return prefix
            }
        }
        return nil
    }

    /// Spaltenindex der Fallauswahl, wenn die Auswahl **in** einer Spalte liegt (`[…, fall, spalte, …]`).
    public static func caseIndex(of selectedPath: [Int]?, inMultiwayAt multiwayPath: [Int]) -> Int? {
        guard let sp = selectedPath, sp.count > multiwayPath.count else { return nil }
        return sp[multiwayPath.count]
    }
}
