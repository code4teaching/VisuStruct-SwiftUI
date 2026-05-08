import Foundation

extension VisuStructCodeGenerator {
    // MARK: - Private

    static func sp(_ n: Int) -> String {
        guard n > 0 else { return "" }
        return String(repeating: " ", count: n)
    }

    static func commentPrefix(target: Target, forEmpty: Bool) -> String {
        switch target {
        case .java, .javascript:
            return forEmpty ? "// empty element" : ""
        case .python:
            return forEmpty ? "# empty element" : ""
        }
    }

    /// Kachel-Platzhalter bzw. Anweisungstext `ø` — im generierten Code als fester englischer Kommentar.
    static func isDiagramEmptyPlaceholderText(_ s: String) -> Bool {
        s.trimmingCharacters(in: .whitespacesAndNewlines) == "ø"
    }

    static func emptyElementCommentLine(indent: Int, target: Target) -> String {
        switch target {
        case .java, .javascript:
            return sp(indent) + "// empty element\n"
        case .python:
            return sp(indent) + "# empty element\n"
        }
    }

    /// Nein-Zweig der Verzweigung nur „leer“: kein Inhalt, nur `leerElement` bzw. Anweisung/Aufruf ausschließlich mit `ø` (und leeren Zeilen).
    static func isIfElseFalseBranchVisuallyEmpty(_ elements: [VisuStructElement]) -> Bool {
        if elements.isEmpty { return true }
        return elements.allSatisfy { isElementVisuallyEmptyPlaceholderOnly($0) }
    }

    static func isElementVisuallyEmptyPlaceholderOnly(_ el: VisuStructElement) -> Bool {
        switch el.type {
        case .leerElement:
            return true
        case .anweisung, .aufruf:
            let body = el.textLines.map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
            for line in body where !line.isEmpty {
                if !isDiagramEmptyPlaceholderText(line) { return false }
            }
            return true
        default:
            return false
        }
    }

    static func blockComment(lines: [String], target: Target, indent: Int) -> String {
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

    static func isCStyleSemicolonTarget(_ target: Target) -> Bool {
        target == .java || target == .javascript
    }

    /// Semikolon-Heuristik für Java/JavaScript: ergänzt `;`, wenn sinnvoll und noch nicht vorhanden.
    static func formatCStyleStatementLine(_ rawLine: String) -> String {
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
    static func conditionText(_ lines: [String]) -> String {
        let parts = lines.map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }.filter { !$0.isEmpty }
        let text = parts.isEmpty ? "true" : parts.joined(separator: " ")
        return stripStructureKeywordPrefix(from: text)
    }

    static func stripStructureKeywordPrefix(from text: String) -> String {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        for keyword in ["if", "while", "until", "switch"] {
            if let stripped = stripKeywordPrefix(keyword, from: trimmed) {
                return stripped.isEmpty ? "true" : stripped
            }
        }
        return trimmed
    }

    static func stripKeywordPrefix(_ keyword: String, from text: String) -> String? {
        let lower = text.lowercased()
        guard lower.hasPrefix(keyword) else { return nil }

        let afterKeyword = text.dropFirst(keyword.count)
        guard afterKeyword.isEmpty || afterKeyword.first?.isWhitespace == true || afterKeyword.first == "(" else {
            return nil
        }

        var content = String(afterKeyword).trimmingCharacters(in: .whitespacesAndNewlines)
        if content.hasPrefix("("), content.hasSuffix(")"), content.count >= 2 {
            content.removeFirst()
            content.removeLast()
            content = content.trimmingCharacters(in: .whitespacesAndNewlines)
        }
        return content
    }

    static func emitInstructionLike(
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
            let forDiagram = body.filter { !$0.isEmpty && !isDiagramEmptyPlaceholderText($0) }
            if !forDiagram.isEmpty {
                out += blockComment(lines: forDiagram, target: target, indent: indent)
            }
        }
        for raw in body {
            if raw.isEmpty { continue }
            if isDiagramEmptyPlaceholderText(raw) {
                out += emptyElementCommentLine(indent: indent, target: target)
                continue
            }
            if target == .java {
                if let s = emitJavaInputLineIfNeeded(raw, indent: indent) {
                    out += s
                    continue
                }
                if let s = emitJavaPrintLineIfNeeded(raw, indent: indent) {
                    out += s
                    continue
                }
            }
            if target == .javascript {
                if let s = emitJavaScriptInputLineIfNeeded(raw, indent: indent) {
                    out += s
                    continue
                }
                if let s = emitJavaScriptPrintLineIfNeeded(raw, indent: indent) {
                    out += s
                    continue
                }
            }
            if target == .python {
                if let s = emitPythonInputLineIfNeeded(raw, indent: indent) {
                    out += s
                    continue
                }
                if let s = emitPythonPrintLineIfNeeded(raw, indent: indent) {
                    out += s
                    continue
                }
            }
            if let s = emitConstTypedLineIfNeeded(raw, target: target, indent: indent) {
                out += s
                continue
            }
            if let s = emitTranslatedJavaLikeAssignmentIfNeeded(raw, target: target, indent: indent) {
                out += s
                continue
            }
            if let s = emitBareLeadingStringAsPrintIfNeeded(raw, target: target, indent: indent) {
                out += s
                continue
            }
            let line: String = {
                if isCStyleSemicolonTarget(target) {
                    if target == .javascript,
                       let transformed = javaScriptIntegerDivisionIfNeeded(raw, intVariables: options.jsIntVariables) {
                        return formatCStyleStatementLine(transformed)
                    }
                    return formatCStyleStatementLine(raw)
                }
                return raw
            }()
            if line.isEmpty { continue }
            out += sp(indent) + line + "\n"
        }
    }

    static func emitConditionHeader(
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

    static func emit(
        element: VisuStructElement,
        target: Target,
        options: Options,
        indent: Int,
        into out: inout String
    ) {
        let step = options.indentPerLevel

        switch element.type {
        case .leerElement:
            out += emptyElementCommentLine(indent: indent, target: target)

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
            let omitElse = !options.includeEmptyElseBranch && isIfElseFalseBranchVisuallyEmpty(falseBranch)
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
                if omitElse {
                    out += sp(indent) + "}\n"
                } else {
                    out += sp(indent) + "} else {\n"
                    emitBlockBody(falseBranch, target: target, options: options, indent: indent + step, into: &out)
                    out += sp(indent) + "}\n"
                }
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
                if !omitElse {
                    out += sp(indent) + "else:\n"
                    emitBlockBody(falseBranch, target: target, options: options, indent: indent + step, into: &out)
                }
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
                if omitElse {
                    out += sp(indent) + "}\n"
                } else {
                    out += sp(indent) + "} else {\n"
                    emitBlockBody(falseBranch, target: target, options: options, indent: indent + step, into: &out)
                    out += sp(indent) + "}\n"
                }
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
                let cond = cStyleForLoopHeaderText(element.textLines)
                if options.includeDiagramTextAsComments {
                    out += blockComment(lines: element.textLines, target: target, indent: indent)
                }
                out += sp(indent) + "for (" + cond + ") {\n"
            case .python:
                if let pyLine = pythonForLineFromJavaLikeLoopFields(element.textLines) {
                    if options.includeDiagramTextAsComments {
                        out += blockComment(lines: element.textLines, target: target, indent: indent)
                    }
                    out += sp(indent) + pyLine + "\n"
                } else {
                    emitConditionHeader(prefix: "for ", suffix: ":\n", textLines: element.textLines, target: target, options: options, indent: indent, into: &out)
                }
            case .javascript:
                let cond = javaScriptForLoopHeaderText(element.textLines)
                if options.includeDiagramTextAsComments {
                    out += blockComment(lines: element.textLines, target: target, indent: indent)
                }
                out += sp(indent) + "for (" + cond + ") {\n"
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

    static func documentContainsJavaInput(_ doc: VisuStructDocument) -> Bool {
        func elementHasInput(_ e: VisuStructElement) -> Bool {
            if e.type == .anweisung {
                if e.textLines.contains(where: { $0.trimmingCharacters(in: .whitespacesAndNewlines).lowercased().hasPrefix("input:") }) {
                    return true
                }
            }
            if let body = e.loopBody, body.contains(where: elementHasInput) { return true }
            if let cases = e.cases, cases.contains(where: { c in c.elements.contains(where: elementHasInput) }) { return true }
            return false
        }
        return doc.elements.contains(where: elementHasInput)
    }

    static func documentContainsJavaMathRandom(_ doc: VisuStructDocument) -> Bool {
        func elementHasMathRandom(_ e: VisuStructElement) -> Bool {
            if e.textLines.contains(where: { $0.range(of: #"(?i)\bMath\.random\s*\("#, options: .regularExpression) != nil }) {
                return true
            }
            if let body = e.loopBody, body.contains(where: elementHasMathRandom) { return true }
            if let cases = e.cases, cases.contains(where: { c in c.elements.contains(where: elementHasMathRandom) }) { return true }
            return false
        }
        return doc.elements.contains(where: elementHasMathRandom)
    }

    static func caseLabelToken(_ name: String, target: Target) -> String {
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

    static func forcedCaseComment(name: String, target: Target) -> String {
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

    static func emitList(
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
    static func emitBlockBody(
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
