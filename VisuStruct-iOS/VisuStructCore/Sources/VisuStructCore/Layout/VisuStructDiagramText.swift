import Foundation

/// Texte, wie sie im Diagramm angezeigt werden (Schlüsselwörter ergänzt, Zählschleife einzeilig).
public enum VisuStructDiagramText {
    /// Anzeigezeilen eines Elements; `nil`, wenn das Element keinen Text hat (dann zeigt der Canvas einen Platzhalter).
    public static func displayLines(for element: VisuStructElement) -> [String]? {
        let raw = element.textLines
        let isEffectivelyEmpty = raw.allSatisfy { $0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
        guard !isEffectivelyEmpty else { return nil }

        switch element.type {
        case .forSchleife:
            if raw.count <= 1 { return raw }
            return [VisuStructForLoopDiagramDisplay.singleLine(from: raw)]
        case .verzweigung:
            return withLeadingKeyword("if", raw)
        case .whileSchleife:
            return withLeadingKeyword("while", raw)
        case .doUntilSchleife:
            return withLeadingKeyword("while", normalizedDoUntilConditionLines(raw))
        case .fallauswahl:
            return withLeadingKeyword("switch", raw)
        default:
            return raw
        }
    }

    /// Entfernt ein führendes `until` aus gespeicherten Diagrammen, damit die Anzeige einheitlich `while …` nutzt (wie Java `do {} while`).
    public static func normalizedDoUntilConditionLines(_ raw: [String]) -> [String] {
        guard let first = raw.first else { return raw }
        let t = first.trimmingCharacters(in: .whitespacesAndNewlines)
        let lower = t.lowercased()
        if lower == "until" {
            var o = raw
            o[0] = ""
            return o
        }
        if lower.hasPrefix("until ") {
            var o = raw
            o[0] = String(t.dropFirst(6)).trimmingCharacters(in: .whitespacesAndNewlines)
            return o
        }
        if lower.hasPrefix("until(") {
            var o = raw
            o[0] = String(t.dropFirst(5))
            return o
        }
        return raw
    }

    /// Teilt eine Anzeigezeile in fett gedrucktes Schlüsselwort und Rest (`while i < 3` → `while`, `i < 3`).
    public static func keywordSplit(_ line: String) -> (keyword: String, rest: String)? {
        let keywords: Set<String> = ["if", "for", "while", "until", "switch"]
        let colonKeywords: [String] = ["input:", "output:", "print:"]
        let trimmed = line.trimmingCharacters(in: .whitespacesAndNewlines)

        let lower = trimmed.lowercased()
        for prefix in colonKeywords {
            if lower == prefix {
                return (trimmed, "")
            }
            if lower.hasPrefix(prefix + " ") {
                let rest = String(trimmed.dropFirst(prefix.count)).trimmingCharacters(in: .whitespacesAndNewlines)
                let kw = String(trimmed.prefix(prefix.count))
                return (kw, rest)
            }
        }

        guard let firstSpace = trimmed.firstIndex(of: " ") else { return nil }
        let head = String(trimmed[..<firstSpace])
        guard keywords.contains(head.lowercased()) else { return nil }
        let rest = String(trimmed[trimmed.index(after: firstSpace)...]).trimmingCharacters(in: .whitespacesAndNewlines)
        return (head, rest)
    }

    private static func withLeadingKeyword(_ keyword: String, _ lines: [String]) -> [String] {
        guard let first = lines.first else { return lines }
        let trimmed = first.trimmingCharacters(in: .whitespacesAndNewlines)
        let lower = trimmed.lowercased()
        let k = keyword.lowercased()
        if lower == k || lower.hasPrefix(k + " ") { return lines }
        var out = lines
        out[0] = keyword + " " + trimmed
        return out
    }
}
