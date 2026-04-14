import Foundation

/// Quellcode-Erzeugung aus dem Struktogramm — angelehnt an `CodeErzeuger` / `quellcodeGenerieren` im Java-Desktop (1.0.7).
public enum VisuStructCodeGenerator: Sendable {

    public enum Target: String, Sendable {
        case java
        case python
        case javascript
    }

    public struct Options: Sendable {
        public var baseIndent: Int
        public var indentPerLevel: Int
        /// Wenn `true`: Diagramm-Texte zusätzlich als Kommentar (`/* … */` bzw. `""" … """`).
        public var includeDiagramTextAsComments: Bool

        public init(baseIndent: Int = 0, indentPerLevel: Int = 4, includeDiagramTextAsComments: Bool = false) {
            self.baseIndent = baseIndent
            self.indentPerLevel = indentPerLevel
            self.includeDiagramTextAsComments = includeDiagramTextAsComments
        }
    }

    public static func generate(document: VisuStructDocument, target: Target, options: Options = Options()) -> String {
        var out = ""
        if target == .javascript {
            // Schul-tauglich: Strict-Modus immer am Anfang des Snippets (wie vereinbart).
            out += "\"use strict\";\n\n"
        }
        for el in document.elements {
            emit(element: el, target: target, options: options, indent: options.baseIndent, into: &out)
        }
        if out.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            let empty = commentPrefix(target: target, forEmpty: true)
            if target == .javascript {
                return "\"use strict\";\n\n" + empty
            }
            return empty
        }
        return out.trimmingCharacters(in: .newlines)
    }

    // MARK: - Private

    private static func sp(_ n: Int) -> String {
        guard n > 0 else { return "" }
        return String(repeating: " ", count: n)
    }

    private static func commentPrefix(target: Target, forEmpty: Bool) -> String {
        switch target {
        case .java:
            return forEmpty ? "// (leer)" : ""
        case .python:
            return forEmpty ? "# (leer)" : ""
        case .javascript:
            return forEmpty ? "// (leer)" : ""
        }
    }

    private static func blockComment(lines: [String], target: Target, indent: Int) -> String {
        let trimmed = lines.map { $0.trimmingCharacters(in: .whitespaces) }.filter { !$0.isEmpty }
        guard !trimmed.isEmpty else { return "" }
        switch target {
        case .java:
            if trimmed.count == 1 {
                return sp(indent) + "/* " + trimmed[0] + " */\n"
            }
            var s = sp(indent) + "/*\n"
            for t in trimmed {
                s += sp(indent) + " * " + t + "\n"
            }
            s += sp(indent) + " */\n"
            return s
        case .python:
            var s = sp(indent) + "\"\"\"\n"
            for t in trimmed {
                s += sp(indent) + t + "\n"
            }
            s += sp(indent) + "\"\"\"\n"
            return s
        case .javascript:
            // Wie Java: `/* … */` — gut lesbar und „klassisch“.
            if trimmed.count == 1 {
                return sp(indent) + "/* " + trimmed[0] + " */\n"
            }
            var s = sp(indent) + "/*\n"
            for t in trimmed {
                s += sp(indent) + " * " + t + "\n"
            }
            s += sp(indent) + " */\n"
            return s
        }
    }

    private static func isCStyleSemicolonTarget(_ target: Target) -> Bool {
        target == .java || target == .javascript
    }

    /// Semikolon-Heuristik für Java/JavaScript: ergänzt `;`, wenn sinnvoll und noch nicht vorhanden.
    private static func formatCStyleStatementLine(_ rawLine: String) -> String {
        let line = rawLine.trimmingCharacters(in: .whitespacesAndNewlines)
        if line.isEmpty { return "" }

        // Kommentare / Präprozessor / Blöcke: nicht anfassen
        if line.hasPrefix("//") || line.hasPrefix("/*") || line.hasPrefix("*") || line.hasPrefix("#") { return line }
        if line.hasPrefix("{") || line == "}" || line.hasPrefix("}") { return line }
        if line.hasSuffix("{") { return line }

        // Schließende Klammern am Ende (z. B. `};`) nicht doppeln
        if line.hasSuffix(";") { return line }

        // Häufige Kontrollfluss-Keywords ohne Semikolon am Ende (Header)
        let lower = line.lowercased()
        if lower.hasPrefix("if ") || lower.hasPrefix("else") || lower.hasPrefix("for ") || lower.hasPrefix("while ") ||
            lower.hasPrefix("do ") || lower.hasPrefix("switch ") || lower.hasPrefix("case ") || lower.hasPrefix("default") {
            return line
        }

        return line + ";"
    }

    /// Bedingung/Ausdruck für Klammern: mehrzeilig mit Leerzeichen zusammenfassen (schul­tauglich, gültige Syntax).
    private static func conditionText(_ lines: [String]) -> String {
        let parts = lines.map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }.filter { !$0.isEmpty }
        return parts.isEmpty ? "true" : parts.joined(separator: " ")
    }

    private static func emitInstructionLike(
        textLines: [String],
        target: Target,
        options: Options,
        indent: Int,
        into out: inout String
    ) {
        let body = textLines.map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
        let nonEmpty = body.filter { !$0.isEmpty }
        if nonEmpty.isEmpty { return }

        if options.includeDiagramTextAsComments {
            out += blockComment(lines: body, target: target, indent: indent)
        }
        for raw in body {
            if raw.isEmpty { continue }
            let line: String = {
                if isCStyleSemicolonTarget(target) { return formatCStyleStatementLine(raw) }
                return raw
            }()
            if line.isEmpty { continue }
            out += sp(indent) + line + "\n"
        }
    }

    private static func emitConditionHeader(
        prefix: String,
        suffix: String,
        textLines: [String],
        target: Target,
        options: Options,
        indent: Int,
        into out: inout String
    ) {
        let cond = conditionText(textLines)
        if options.includeDiagramTextAsComments {
            out += blockComment(lines: textLines, target: target, indent: indent)
        }
        switch target {
        case .java:
            out += sp(indent) + prefix + cond + suffix
        case .python:
            out += sp(indent) + prefix + cond + suffix
        case .javascript:
            out += sp(indent) + prefix + cond + suffix
        }
    }

    private static func emit(
        element: VisuStructElement,
        target: Target,
        options: Options,
        indent: Int,
        into out: inout String
    ) {
        let step = options.indentPerLevel

        switch element.type {
        case .leerElement:
            return

        case .anweisung, .aufruf:
            emitInstructionLike(textLines: element.textLines, target: target, options: options, indent: indent, into: &out)

        case .aussprung:
            let hint = conditionText(element.textLines)
            if options.includeDiagramTextAsComments, !element.textLines.filter({ !$0.trimmingCharacters(in: .whitespaces).isEmpty }).isEmpty {
                out += blockComment(lines: element.textLines, target: target, indent: indent)
            }
            switch target {
            case .java:
                out += sp(indent) + (hint.isEmpty ? "break;\n" : "break; // \(hint)\n")
            case .python:
                out += sp(indent) + (hint.isEmpty ? "break\n" : "break  # \(hint)\n")
            case .javascript:
                out += sp(indent) + (hint.isEmpty ? "break;\n" : "break; // \(hint)\n")
            }

        case .verzweigung:
            guard let cases = element.cases, cases.count >= 2 else { return }
            let trueBranch = cases[0].elements
            let falseBranch = cases[1].elements
            switch target {
            case .java:
                emitConditionHeader(
                    prefix: "if (",
                    suffix: ") {\n",
                    textLines: element.textLines,
                    target: target,
                    options: options,
                    indent: indent,
                    into: &out
                )
                emitBlockBody(trueBranch, target: target, options: options, indent: indent + step, into: &out)
                out += sp(indent) + "} else {\n"
                emitBlockBody(falseBranch, target: target, options: options, indent: indent + step, into: &out)
                out += sp(indent) + "}\n"
            case .python:
                emitConditionHeader(
                    prefix: "if ",
                    suffix: ":\n",
                    textLines: element.textLines,
                    target: target,
                    options: options,
                    indent: indent,
                    into: &out
                )
                emitBlockBody(trueBranch, target: target, options: options, indent: indent + step, into: &out)
                out += sp(indent) + "else:\n"
                emitBlockBody(falseBranch, target: target, options: options, indent: indent + step, into: &out)
            case .javascript:
                emitConditionHeader(
                    prefix: "if (",
                    suffix: ") {\n",
                    textLines: element.textLines,
                    target: target,
                    options: options,
                    indent: indent,
                    into: &out
                )
                emitBlockBody(trueBranch, target: target, options: options, indent: indent + step, into: &out)
                out += sp(indent) + "} else {\n"
                emitBlockBody(falseBranch, target: target, options: options, indent: indent + step, into: &out)
                out += sp(indent) + "}\n"
            }

        case .fallauswahl:
            guard let cases = element.cases, !cases.isEmpty else { return }
            switch target {
            case .java:
                emitConditionHeader(
                    prefix: "switch (",
                    suffix: ") {\n",
                    textLines: element.textLines,
                    target: target,
                    options: options,
                    indent: indent,
                    into: &out
                )
                for (i, c) in cases.enumerated() {
                    let isLast = i == cases.count - 1
                    let label: String
                    if isLast {
                        label = "default -> { " + forcedCaseComment(name: c.name, target: target) + "\n"
                    } else {
                        label = "case " + caseLabelToken(c.name, target: target) + " -> {\n"
                    }
                    out += sp(indent + step) + label
                    emitBlockBody(c.elements, target: target, options: options, indent: indent + step * 2, into: &out)
                    if target == .java {
                        out += sp(indent + step) + "}\n"
                    }
                }
                out += sp(indent) + "}\n"
            case .python:
                emitConditionHeader(
                    prefix: "match ",
                    suffix: ":\n",
                    textLines: element.textLines,
                    target: target,
                    options: options,
                    indent: indent,
                    into: &out
                )
                for (i, c) in cases.enumerated() {
                    let isLast = i == cases.count - 1
                    let line: String
                    if isLast {
                        line = "case _:" + forcedCaseComment(name: c.name, target: target) + "\n"
                    } else {
                        line = "case " + caseLabelToken(c.name, target: target) + ":\n"
                    }
                    out += sp(indent + step) + line
                    emitBlockBody(c.elements, target: target, options: options, indent: indent + step * 2, into: &out)
                }
            case .javascript:
                emitConditionHeader(
                    prefix: "switch (",
                    suffix: ") {\n",
                    textLines: element.textLines,
                    target: target,
                    options: options,
                    indent: indent,
                    into: &out
                )
                for (i, c) in cases.enumerated() {
                    let isLast = i == cases.count - 1
                    if isLast {
                        out += sp(indent + step) + "default:" + forcedCaseComment(name: c.name, target: target) + "\n"
                    } else {
                        out += sp(indent + step) + "case " + caseLabelToken(c.name, target: target) + ":\n"
                    }
                    emitBlockBody(c.elements, target: target, options: options, indent: indent + step * 2, into: &out)
                    // Anfänger:innen-tauglich: immer `break;` — kein Fallthrough (JS hat keine `case ->` Syntax wie Java).
                    out += sp(indent + step * 2) + "break;\n"
                }
                out += sp(indent) + "}\n"
            }

        case .forSchleife:
            switch target {
            case .java:
                emitConditionHeader(prefix: "for (", suffix: ") {\n", textLines: element.textLines, target: target, options: options, indent: indent, into: &out)
            case .python:
                emitConditionHeader(prefix: "for ", suffix: ":\n", textLines: element.textLines, target: target, options: options, indent: indent, into: &out)
            case .javascript:
                emitConditionHeader(prefix: "for (", suffix: ") {\n", textLines: element.textLines, target: target, options: options, indent: indent, into: &out)
            }
            emitBlockBody(element.loopBody ?? [], target: target, options: options, indent: indent + step, into: &out)
            if target == .java || target == .javascript { out += sp(indent) + "}\n" }

        case .whileSchleife:
            switch target {
            case .java:
                emitConditionHeader(prefix: "while (", suffix: ") {\n", textLines: element.textLines, target: target, options: options, indent: indent, into: &out)
            case .python:
                emitConditionHeader(prefix: "while ", suffix: ":\n", textLines: element.textLines, target: target, options: options, indent: indent, into: &out)
            case .javascript:
                emitConditionHeader(prefix: "while (", suffix: ") {\n", textLines: element.textLines, target: target, options: options, indent: indent, into: &out)
            }
            emitBlockBody(element.loopBody ?? [], target: target, options: options, indent: indent + step, into: &out)
            if target == .java || target == .javascript { out += sp(indent) + "}\n" }

        case .doUntilSchleife:
            let cond = conditionText(element.textLines)
            switch target {
            case .java:
                out += sp(indent) + "do {\n"
                emitBlockBody(element.loopBody ?? [], target: target, options: options, indent: indent + step, into: &out)
                if options.includeDiagramTextAsComments {
                    out += blockComment(lines: element.textLines, target: target, indent: indent)
                }
                out += sp(indent) + "} while (" + cond + ");\n"
            case .python:
                out += sp(indent) + "while True:\n"
                let bodyStart = indent + step
                emitBlockBody(element.loopBody ?? [], target: target, options: options, indent: bodyStart, into: &out)
                if options.includeDiagramTextAsComments {
                    out += blockComment(lines: element.textLines, target: target, indent: bodyStart)
                }
                out += sp(bodyStart) + "if not (" + cond + "):\n"
                out += sp(bodyStart + step) + "break\n"
            case .javascript:
                out += sp(indent) + "do {\n"
                emitBlockBody(element.loopBody ?? [], target: target, options: options, indent: indent + step, into: &out)
                if options.includeDiagramTextAsComments {
                    out += blockComment(lines: element.textLines, target: target, indent: indent)
                }
                out += sp(indent) + "} while (" + cond + ");\n"
            }

        case .endlosschleife:
            let extra = conditionText(element.textLines)
            switch target {
            case .java:
                if extra.isEmpty || extra == "true" {
                    out += sp(indent) + "while (true) {\n"
                } else {
                    if options.includeDiagramTextAsComments {
                        out += blockComment(lines: element.textLines, target: target, indent: indent)
                    }
                    out += sp(indent) + "while (true) /* " + extra + " */ {\n"
                }
            case .python:
                if extra.isEmpty || extra == "true" {
                    out += sp(indent) + "while True:\n"
                } else {
                    if options.includeDiagramTextAsComments {
                        out += blockComment(lines: element.textLines, target: target, indent: indent)
                    }
                    out += sp(indent) + "while True:  # " + extra + "\n"
                }
            case .javascript:
                if extra.isEmpty || extra == "true" {
                    out += sp(indent) + "while (true) {\n"
                } else {
                    if options.includeDiagramTextAsComments {
                        out += blockComment(lines: element.textLines, target: target, indent: indent)
                    }
                    out += sp(indent) + "while (true) /* " + extra + " */ {\n"
                }
            }
            emitBlockBody(element.loopBody ?? [], target: target, options: options, indent: indent + step, into: &out)
            if target == .java || target == .javascript { out += sp(indent) + "}\n" }
        }
    }

    private static func caseLabelToken(_ name: String, target: Target) -> String {
        let t = name.trimmingCharacters(in: .whitespacesAndNewlines)
        if t.isEmpty {
            if target == .python { return "\"\"" }
            if target == .javascript { return "0" }
            return "0"
        }
        if target == .python {
            if t.allSatisfy({ $0.isNumber }) { return t }
            return "\"" + t.replacingOccurrences(of: "\"", with: "\\\"") + "\""
        }
        if target == .javascript {
            if t.allSatisfy({ $0.isNumber }) { return t }
            return "\"" + t.replacingOccurrences(of: "\"", with: "\\\"") + "\""
        }
        return t
    }

    private static func forcedCaseComment(name: String, target: Target) -> String {
        let t = name.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !t.isEmpty else { return "" }
        switch target {
        case .java:
            return "/* " + t + " */"
        case .python:
            return "  # " + t
        case .javascript:
            return " /* " + t + " */"
        }
    }

    private static func emitList(
        _ elements: [VisuStructElement],
        target: Target,
        options: Options,
        indent: Int,
        into out: inout String
    ) {
        for el in elements {
            emit(element: el, target: target, options: options, indent: indent, into: &out)
        }
    }

    /// Leere Blöcke: Python braucht `pass`, Java `{ }` darf leer sein.
    private static func emitBlockBody(
        _ elements: [VisuStructElement],
        target: Target,
        options: Options,
        indent: Int,
        into out: inout String
    ) {
        if elements.isEmpty {
            if target == .python {
                out += sp(indent) + "pass\n"
            }
            return
        }
        emitList(elements, target: target, options: options, indent: indent, into: &out)
    }
}
