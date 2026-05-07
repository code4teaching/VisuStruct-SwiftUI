import Foundation

extension VisuStructCodeGenerator {
    // MARK: - Länge: `.length` / `.length()` → zielsprachentauglich (Heuristik, kein echter Typ-Check)

    static func postProcessLengthSyntaxInGeneratedCode(_ s: String, target: Target) -> String {
        switch target {
        case .javascript:
            // `String`/`Array` in JS: `.length` (Eigenschaft), nicht wie in Java `length()`.
            return replaceSimpleRegex(
                s,
                pattern: #"\.length\(\)"#,
                options: [],
                transform: { _, _ in ".length" }
            )
        case .python:
            // Weder `.length` noch `.length()`: sinnvoll ist `len(name)`.
            return replaceWithCaptureTemplate(s, pattern: #"\b([a-zA-Z_][\w]*)\.length(?:\(\))?\b"#, template: "len($1)")
        case .java:
            // `String`: `s.length()`; Array: `a.length` (Feld) — nur wenn `a` im generierten Code als Array deklariert ist.
            return replaceIdentifierDotLengthWithParensInJava(s)
        }
    }

    static func replaceSimpleRegex(
        _ s: String,
        pattern: String,
        options: NSRegularExpression.Options,
        transform: (NSTextCheckingResult, NSString) -> String
    ) -> String {
        guard let re = try? NSRegularExpression(pattern: pattern, options: options) else { return s }
        let ns = s as NSString
        let full = NSRange(location: 0, length: ns.length)
        let matches = re.matches(in: s, options: [], range: full)
        if matches.isEmpty { return s }
        var out = ""
        var last = 0
        for m in matches {
            out += ns.substring(with: NSRange(location: last, length: m.range.location - last))
            out += transform(m, ns)
            last = m.range.location + m.range.length
        }
        out += ns.substring(from: last)
        return out
    }

    static func replaceWithCaptureTemplate(_ s: String, pattern: String, template: String) -> String {
        guard let re = try? NSRegularExpression(pattern: pattern, options: []) else { return s }
        let ns = s as NSString
        let n = ns.length
        let out = re.stringByReplacingMatches(in: s, options: [], range: NSRange(location: 0, length: n), withTemplate: template)
        return out
    }

    static func javaArrayDeclarationNames(in s: String) -> Set<String> {
        let type = #"(?:byte|short|int|long|float|double|boolean|char|String)"#
        let patterns = [
            #"\b(?:final\s+)?"# + type + #"\s*\[\s*\]\s+([a-zA-Z_]\w*)\b"#,
            #"\b(?:final\s+)?"# + type + #"\s+([a-zA-Z_]\w*)\s*\[\s*\]"#,
        ]
        var names: Set<String> = []
        let ns = s as NSString
        let full = NSRange(location: 0, length: ns.length)
        for pattern in patterns {
            guard let re = try? NSRegularExpression(pattern: pattern, options: []) else { continue }
            for m in re.matches(in: s, options: [], range: full) where m.numberOfRanges >= 2 {
                let r = m.range(at: 1)
                if r.location != NSNotFound {
                    names.insert(ns.substring(with: r).lowercased())
                }
            }
        }
        return names
    }

    static func replaceIdentifierDotLengthWithParensInJava(_ s: String) -> String {
        guard let re = try? NSRegularExpression(pattern: #"\b([a-zA-Z_][\w]*)\.length(?!\()"#, options: []) else { return s }
        let ns = s as NSString
        let n = ns.length
        let full = NSRange(location: 0, length: n)
        let matches = re.matches(in: s, options: [], range: full)
        if matches.isEmpty { return s }
        let arrayDeclarationNames = javaArrayDeclarationNames(in: s)
        var out = ""
        var last = 0
        for m in matches {
            out += ns.substring(with: NSRange(location: last, length: m.range.location - last))
            if m.numberOfRanges >= 2 {
                let idRange = m.range(at: 1)
                if idRange.location != NSNotFound {
                    let id = ns.substring(with: idRange)
                    let lowerID = id.lowercased()
                    if arrayDeclarationNames.contains(lowerID) {
                        out += ns.substring(with: m.range)
                    } else {
                        out += id
                        out += ".length()"
                    }
                    last = m.range.location + m.range.length
                    continue
                }
            }
            out += ns.substring(with: m.range)
            last = m.range.location + m.range.length
        }
        out += ns.substring(from: last)
        return out
    }
}
