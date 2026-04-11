import Foundation

/// Quellcode-Erzeugung aus dem Struktogramm — angelehnt an `CodeErzeuger` / `quellcodeGenerieren` im Java-Desktop (1.0.7).
public enum VisuStructCodeGenerator: Sendable {

    public enum Target: String, Sendable {
        case java
        case python
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
        for el in document.elements {
            emit(element: el, target: target, options: options, indent: options.baseIndent, into: &out)
        }
        if out.isEmpty {
            return commentPrefix(target: target, forEmpty: true)
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
        }
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
        for line in body {
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
            }

        case .forSchleife:
            switch target {
            case .java:
                emitConditionHeader(prefix: "for (", suffix: ") {\n", textLines: element.textLines, target: target, options: options, indent: indent, into: &out)
            case .python:
                emitConditionHeader(prefix: "for ", suffix: ":\n", textLines: element.textLines, target: target, options: options, indent: indent, into: &out)
            }
            emitBlockBody(element.loopBody ?? [], target: target, options: options, indent: indent + step, into: &out)
            if target == .java { out += sp(indent) + "}\n" }

        case .whileSchleife:
            switch target {
            case .java:
                emitConditionHeader(prefix: "while (", suffix: ") {\n", textLines: element.textLines, target: target, options: options, indent: indent, into: &out)
            case .python:
                emitConditionHeader(prefix: "while ", suffix: ":\n", textLines: element.textLines, target: target, options: options, indent: indent, into: &out)
            }
            emitBlockBody(element.loopBody ?? [], target: target, options: options, indent: indent + step, into: &out)
            if target == .java { out += sp(indent) + "}\n" }

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
            }
            emitBlockBody(element.loopBody ?? [], target: target, options: options, indent: indent + step, into: &out)
            if target == .java { out += sp(indent) + "}\n" }
        }
    }

    private static func caseLabelToken(_ name: String, target: Target) -> String {
        let t = name.trimmingCharacters(in: .whitespacesAndNewlines)
        if t.isEmpty {
            return target == .python ? "\"\"" : "0"
        }
        if target == .python {
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
