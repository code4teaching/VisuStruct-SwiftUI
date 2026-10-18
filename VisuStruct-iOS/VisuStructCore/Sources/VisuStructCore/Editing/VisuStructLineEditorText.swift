import Foundation

/// Darstellung von Anweisung vs. Ein-/Ausgabe im Inspector (Modus-Picker).
public enum VisuStructStatementIOMode: String, CaseIterable, Hashable, Sendable {
    case statement
    case input
    case output
}

/// Textumformungen für den Zeileneditor im Inspector (ohne UI, daher testbar).
public enum VisuStructLineEditorText {
    public static func ioMode(of text: String) -> VisuStructStatementIOMode {
        let t = text.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        if t.hasPrefix("input:") { return .input }
        if t.hasPrefix("output:") { return .output }
        if t.hasPrefix("print:") { return .output }
        return .statement
    }

    /// Entfernt `input:` / `output:` / `print:` und umgebende Leerzeichen; ohne Präfix bleibt der Text unverändert.
    public static func strippingIOPrefix(from s: String) -> String {
        let trimmed = s.trimmingCharacters(in: .whitespacesAndNewlines)
        let lower = trimmed.lowercased()
        if lower.hasPrefix("input:") {
            return String(trimmed.dropFirst(6)).trimmingCharacters(in: .whitespacesAndNewlines)
        }
        if lower.hasPrefix("output:") {
            return String(trimmed.dropFirst(7)).trimmingCharacters(in: .whitespacesAndNewlines)
        }
        if lower.hasPrefix("print:") {
            return String(trimmed.dropFirst(6)).trimmingCharacters(in: .whitespacesAndNewlines)
        }
        return s
    }

    /// Text nach Wechsel im Modus-Picker: Präfix tauschen, Inhalt behalten.
    public static func applyingIOMode(_ mode: VisuStructStatementIOMode, to text: String) -> String {
        let stripped = strippingIOPrefix(from: text)
        switch mode {
        case .statement:
            return stripped
        case .input:
            return prefixing("input:", to: stripped)
        case .output:
            return prefixing("output:", to: stripped)
        }
    }

    /// Wie `strippingIOPrefix` bzw. Schlüsselwort-Entfernung, aber Leerzeichen beim Tippen bleiben erhalten.
    public static func strippingPrefixForEditing(_ p: String, from s: String) -> String {
        if p == "input:" || p == "output:" {
            return strippingIOPrefixPreservingEditingWhitespace(from: s)
        }
        let stripped = strippingKeywordPrefixPreservingEditingWhitespace(p, from: s)
        if p == "while", stripped == s {
            let legacy = strippingKeywordPrefixPreservingEditingWhitespace("until", from: s)
            if legacy != s { return legacy }
        }
        return stripped
    }

    public static func prefixingForEditing(_ p: String, to content: String) -> String {
        if content.isEmpty { return "\(p) " }
        return "\(p) \(content)"
    }

    /// iOS/macOS ersetzen beim Tippen teils typografische Anführungszeichen; für Code immer gerade Quotes.
    public static func normalizingQuotes(_ s: String) -> String {
        s
            .replacingOccurrences(of: "“", with: "\"")
            .replacingOccurrences(of: "”", with: "\"")
            .replacingOccurrences(of: "„", with: "\"")
            .replacingOccurrences(of: "«", with: "\"")
            .replacingOccurrences(of: "»", with: "\"")
            .replacingOccurrences(of: "’", with: "'")
            .replacingOccurrences(of: "‘", with: "'")
            .replacingOccurrences(of: "‚", with: "'")
            .replacingOccurrences(of: "´", with: "'")
    }

    /// Genau drei Felder (Start, Bedingung, Schritt) der Zählschleife.
    public static func paddedForLoopParts(_ lines: [String]) -> [String] {
        var a = lines.isEmpty ? [""] : lines
        while a.count < 3 { a.append("") }
        if a.count > 3 { return Array(a.prefix(3)) }
        return a
    }

    /// Ein Feld der Zählschleife: gerade Quotes, ohne abschließende `;`.
    public static func normalizedForLoopPart(_ s: String) -> String {
        var x = normalizingQuotes(s)
        while true {
            let trimmedEnd = x.trimmingCharacters(in: .whitespacesAndNewlines)
            guard trimmedEnd.hasSuffix(";") else { return x }
            x = String(trimmedEnd.dropLast()).trimmingCharacters(in: .whitespacesAndNewlines)
        }
    }

    private static func prefixing(_ p: String, to content: String) -> String {
        let c = content.trimmingCharacters(in: .whitespacesAndNewlines)
        if c.isEmpty { return "\(p) " }
        return "\(p) \(c)"
    }

    private static func strippingIOPrefixPreservingEditingWhitespace(from s: String) -> String {
        let leadingTrimmed = String(s.drop(while: { $0.isWhitespace }))
        let lower = leadingTrimmed.lowercased()
        if lower.hasPrefix("input:") {
            return droppingOneLeadingWhitespace(String(leadingTrimmed.dropFirst(6)))
        }
        if lower.hasPrefix("output:") {
            return droppingOneLeadingWhitespace(String(leadingTrimmed.dropFirst(7)))
        }
        if lower.hasPrefix("print:") {
            return droppingOneLeadingWhitespace(String(leadingTrimmed.dropFirst(6)))
        }
        return s
    }

    private static func strippingKeywordPrefixPreservingEditingWhitespace(_ keyword: String, from s: String) -> String {
        let leadingTrimmed = String(s.drop(while: { $0.isWhitespace }))
        let lower = leadingTrimmed.lowercased()
        let key = keyword.lowercased()
        guard lower.hasPrefix(key) else { return s }

        let afterKeyword = leadingTrimmed.dropFirst(keyword.count)
        guard afterKeyword.isEmpty || afterKeyword.first?.isWhitespace == true || afterKeyword.first == "(" else {
            return s
        }

        let content = droppingOneLeadingWhitespace(String(afterKeyword))
        if content.hasPrefix("("), content.hasSuffix(")"), content.count >= 2 {
            return String(content.dropFirst().dropLast())
        }
        return content
    }

    private static func droppingOneLeadingWhitespace(_ s: String) -> String {
        guard let first = s.first, first.isWhitespace else { return s }
        return String(s.dropFirst())
    }
}
