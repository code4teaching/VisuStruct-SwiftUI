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
        /// Wenn `true` (Standard): `else` wird auch ausgegeben, wenn der **Nein**-Zweig nur leer (ø) ist — analog zum Struktogramm. Wenn `false`, entfällt in diesem Fall `else` (kompakterer Code; alle Zielsprachen).
        public var includeEmptyElseBranch: Bool

        public init(
            baseIndent: Int = 0,
            indentPerLevel: Int = 4,
            includeDiagramTextAsComments: Bool = false,
            includeEmptyElseBranch: Bool = true
        ) {
            self.baseIndent = baseIndent
            self.indentPerLevel = indentPerLevel
            self.includeDiagramTextAsComments = includeDiagramTextAsComments
            self.includeEmptyElseBranch = includeEmptyElseBranch
        }
    }

    public static func generate(document: VisuStructDocument, target: Target, options: Options = Options()) -> String {
        var out = ""
        if target == .javascript {
            // Schul-tauglich: Strict-Modus immer am Anfang des Snippets (wie vereinbart).
            out += "\"use strict\";\n\n"
        }
        if target == .java, documentContainsJavaInput(document) {
            // Snippet-Modus: Import als Kommentar (damit es auch beim Einfügen in `main` nicht „falsch“ steht).
            out += "// import java.util.Scanner;\n"
            out += "Scanner scanner = new Scanner(System.in);\n\n"
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
        case .java, .javascript:
            return forEmpty ? "// empty element" : ""
        case .python:
            return forEmpty ? "# empty element" : ""
        }
    }

    /// Kachel-Platzhalter bzw. Anweisungstext `ø` — im generierten Code als fester englischer Kommentar.
    private static func isDiagramEmptyPlaceholderText(_ s: String) -> Bool {
        s.trimmingCharacters(in: .whitespacesAndNewlines) == "ø"
    }

    private static func emptyElementCommentLine(indent: Int, target: Target) -> String {
        switch target {
        case .java, .javascript:
            return sp(indent) + "// empty element\n"
        case .python:
            return sp(indent) + "# empty element\n"
        }
    }

    /// Nein-Zweig der Verzweigung nur „leer“: kein Inhalt, nur `leerElement` bzw. Anweisung/Aufruf ausschließlich mit `ø` (und leeren Zeilen).
    private static func isIfElseFalseBranchVisuallyEmpty(_ elements: [VisuStructElement]) -> Bool {
        if elements.isEmpty { return true }
        return elements.allSatisfy { isElementVisuallyEmptyPlaceholderOnly($0) }
    }

    private static func isElementVisuallyEmptyPlaceholderOnly(_ el: VisuStructElement) -> Bool {
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

    /// Kopf einer C-`for`-Schleife: mehrere Felder mit `; ` wie `for (int i=0; i<5; i++)`. Eine Zeile bleibt unverändert (Abwärtskompatibel).
    private static func cStyleForLoopHeaderText(_ lines: [String]) -> String {
        let parts = lines.map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }.filter { !$0.isEmpty }
        if parts.isEmpty { return ";;" }
        if parts.count == 1 { return parts[0] }
        return parts.joined(separator: "; ")
    }

    // MARK: - Python: Java-ähnliche For-Köpfe → `range`

    private struct JavaForInitParse {
        let name: String
        let value: Int
    }

    private struct JavaForCondParse {
        /// Obergrenze für `range` (exklusiv), passend zu `< n` bzw. `<= n`.
        let stopExclusive: Int
    }

    private static func stripTrailingSemicolon(_ s: String) -> String {
        var x = s.trimmingCharacters(in: .whitespacesAndNewlines)
        while x.hasSuffix(";") {
            x = String(x.dropLast()).trimmingCharacters(in: .whitespacesAndNewlines)
        }
        return x
    }

    private static func regexGroups(_ pattern: String, _ string: String) -> [String]? {
        guard let re = try? NSRegularExpression(pattern: pattern, options: []) else { return nil }
        let ns = string as NSString
        let full = NSRange(location: 0, length: ns.length)
        guard let m = re.firstMatch(in: string, options: [], range: full), m.numberOfRanges >= 1 else { return nil }
        var out: [String] = []
        for i in 0..<m.numberOfRanges {
            let r = m.range(at: i)
            if r.location == NSNotFound {
                out.append("")
            } else {
                out.append(ns.substring(with: r))
            }
        }
        return out
    }

    private static func parseJavaStyleForInit(_ s: String) -> JavaForInitParse? {
        let pats = [
            #"^\s*(?:int|long)\s+(\w+)\s*=\s*(-?\d+)\s*$"#,
            #"^\s*(\w+)\s*=\s*(-?\d+)\s*$"#,
        ]
        for p in pats {
            guard let g = regexGroups(p, s), g.count >= 3, let v = Int(g[2]) else { continue }
            return JavaForInitParse(name: g[1], value: v)
        }
        return nil
    }

    private static func parseJavaStyleForCondition(_ s: String, expectedVar: String) -> JavaForCondParse? {
        if let g = regexGroups(#"^\s*(\w+)\s*<\s*(\d+)\s*$"#, s), g.count >= 3, g[1] == expectedVar, let n = Int(g[2]) {
            return JavaForCondParse(stopExclusive: n)
        }
        if let g = regexGroups(#"^\s*(\w+)\s*<=\s*(\d+)\s*$"#, s), g.count >= 3, g[1] == expectedVar, let n = Int(g[2]) {
            return JavaForCondParse(stopExclusive: n + 1)
        }
        return nil
    }

    private static func isJavaStyleSimpleIncrement(_ s: String, varName: String) -> Bool {
        if let g = regexGroups(#"^\s*(\w+)\s*\+\+\s*$"#, s), g.count >= 2 { return g[1] == varName }
        if let g = regexGroups(#"^\s*(\w+)\s*\+=\s*1\s*$"#, s), g.count >= 2 { return g[1] == varName }
        return false
    }

    /// Aus drei Java-ähnlichen Zeilen → `for name in range(…):` wenn die Heuristik passt; sonst `nil` (Fallback: bisheriges `for …` mit `conditionText`).
    private static func pythonForLineFromJavaLikeLoopFields(_ lines: [String]) -> String? {
        let raw = lines.map { stripTrailingSemicolon($0) }.map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
        let nonEmpty = raw.filter { !$0.isEmpty }
        if nonEmpty.count <= 1 { return nil }

        var parts = raw
        while parts.count < 3 { parts.append("") }
        if parts.count > 3 { parts = Array(parts.prefix(3)) }

        let initS = parts[0]
        let condS = parts[1]
        let stepS = parts[2]
        if initS.isEmpty || condS.isEmpty || stepS.isEmpty { return nil }

        guard let initP = parseJavaStyleForInit(initS) else { return nil }
        guard let condP = parseJavaStyleForCondition(condS, expectedVar: initP.name) else { return nil }
        guard isJavaStyleSimpleIncrement(stepS, varName: initP.name) else { return nil }

        let start = initP.value
        let stop = condP.stopExclusive
        if start == 0 {
            return "for \(initP.name) in range(\(stop)):"
        }
        return "for \(initP.name) in range(\(start), \(stop)):"
    }

    // MARK: - Java-ähnliche Zuweisungen → JS `let` / Python ohne Typ

    private struct JavaStyleSimpleAssignmentParse {
        let name: String
        let rhs: String
    }

    /// Eine Zeile `Typ name = ausdruck` (Schul­syntax). Kein Treffer → `nil`.
    private static func parseJavaStyleSimpleAssignment(_ rawLine: String) -> JavaStyleSimpleAssignmentParse? {
        let line = stripTrailingSemicolon(rawLine).trimmingCharacters(in: .whitespacesAndNewlines)
        if line.isEmpty { return nil }
        // Schul­set, case-insensitive: int/Int/INTEGER, integer, long, float, double, String, boolean/bool, char.
        // `integer` vor `int`, damit nicht nur der Präfix `int` von `integer` matched.
        let pattern = #"(?i)^\s*(?:integer|int|long|float|double|string|boolean|char|bool)\s+(\w+)\s*=\s*(.*)$"#
        guard let g = regexGroups(pattern, line), g.count >= 3 else { return nil }
        let rhs = g[2].trimmingCharacters(in: .whitespacesAndNewlines)
        if rhs.isEmpty { return nil }
        return JavaStyleSimpleAssignmentParse(name: g[1], rhs: rhs)
    }

    private static func pythonRhsFromJavaRhs(_ rhs: String) -> String {
        let t = rhs.trimmingCharacters(in: .whitespacesAndNewlines)
        if t == "null" { return "None" }
        return rhs
    }

    /// JavaScript: `int x = 5` / `Int x = 5` → `let x = 5;`. Python: `x = 5`. Typen siehe `parseJavaStyleSimpleAssignment`. Java: `nil` (allgemeiner Pfad).
    private static func emitTranslatedJavaLikeAssignmentIfNeeded(_ raw: String, target: Target, indent: Int) -> String? {
        guard target == .javascript || target == .python else { return nil }
        guard let p = parseJavaStyleSimpleAssignment(raw) else { return nil }
        switch target {
        case .javascript:
            let inner = "let \(p.name) = \(p.rhs)"
            let line = formatCStyleStatementLine(inner)
            return sp(indent) + line + "\n"
        case .python:
            return sp(indent) + "\(p.name) = \(pythonRhsFromJavaRhs(p.rhs))\n"
        case .java:
            return nil
        }
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
            if let s = emitTranslatedJavaLikeAssignmentIfNeeded(raw, target: target, indent: indent) {
                out += s
                continue
            }
            if let s = emitBareLeadingStringAsPrintIfNeeded(raw, target: target, indent: indent) {
                out += s
                continue
            }
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
                let cond = cStyleForLoopHeaderText(element.textLines)
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

    private static func documentContainsJavaInput(_ doc: VisuStructDocument) -> Bool {
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

    private static func emitJavaPrintLineIfNeeded(_ raw: String, indent: Int) -> String? {
        let t = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        let lower = t.lowercased()
        guard lower.hasPrefix("print:") else { return nil }
        let expr = String(t.dropFirst(6)).trimmingCharacters(in: .whitespacesAndNewlines)
        if expr.isEmpty { return nil }
        return sp(indent) + "System.out.println(" + expr + ");\n"
    }

    /// Nach `input:`: `int zahl` wie bisher, oder Kurzform **`zahl`** → Typ **`int`** (Diagramm ohne Typ, z. B. „input: zahl“).
    private static func parseInputTypeAndName(afterInputColon rest: String) -> (type: String, name: String)? {
        let parts = rest.split(whereSeparator: { $0 == " " || $0 == "\t" }).map(String.init)
        if parts.isEmpty { return nil }
        if parts.count >= 2 { return (parts[0], parts[1]) }
        let only = parts[0]
        let onlyLower = only.lowercased()
        let incompleteIfAlone: Set<String> = [
            "int", "double", "string", "boolean", "char", "long", "float", "short", "byte", "void", "bool", "integer",
        ]
        if incompleteIfAlone.contains(onlyLower) { return nil }
        return ("int", only)
    }

    /// Ohne `print:`: Zeile beginnt mit `"…"` → Ausgabe (Java/JS/Python), z. B. `"Summe: " + summe`.
    private static func emitBareLeadingStringAsPrintIfNeeded(_ raw: String, target: Target, indent: Int) -> String? {
        guard target == .java || target == .javascript || target == .python else { return nil }
        let t = stripTrailingSemicolon(raw).trimmingCharacters(in: .whitespacesAndNewlines)
        guard t.hasPrefix("\"") else { return nil }
        switch target {
        case .java:
            return sp(indent) + "System.out.println(" + t + ");\n"
        case .javascript:
            return sp(indent) + "console.log(" + t + ");\n"
        case .python:
            return sp(indent) + "print(" + t + ")\n"
        default:
            return nil
        }
    }

    /// Zeichenkette für Java-`"…"`-Literale (z. B. in `System.out.println`).
    private static func javaEscapeForDoubleQuotedLiteral(_ s: String) -> String {
        s.replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "\"", with: "\\\"")
            .replacingOccurrences(of: "\n", with: "\\n")
            .replacingOccurrences(of: "\r", with: "\\r")
    }

    private static func emitJavaInputLineIfNeeded(_ raw: String, indent: Int) -> String? {
        let t = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        let lower = t.lowercased()
        guard lower.hasPrefix("input:") else { return nil }
        let rest = String(t.dropFirst(6)).trimmingCharacters(in: .whitespacesAndNewlines)
        guard !rest.isEmpty else { return nil }
        guard let pair = parseInputTypeAndName(afterInputColon: rest) else { return nil }
        let type = pair.type
        let name = pair.name

        let label = javaEscapeForDoubleQuotedLiteral(name + ": ")
        let promptOut = sp(indent) + "System.out.println(\"" + label + "\");\n"

        switch type {
        case "int":
            return promptOut + sp(indent) + "int \(name) = scanner.nextInt();\n"
        case "double":
            return promptOut + sp(indent) + "double \(name) = scanner.nextDouble();\n"
        case "String":
            // `next()` statt `nextLine()` (vermeidet typische Newline-Falle nach `nextInt()` im Unterricht).
            return promptOut + sp(indent) + "String \(name) = scanner.next();\n"
        default:
            return nil
        }
    }

    /// Zeichenkette für JS-`"…"`-Literale (z. B. `console.log`, `prompt`).
    private static func javaScriptEscapeForDoubleQuotedLiteral(_ s: String) -> String {
        s.replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "\"", with: "\\\"")
            .replacingOccurrences(of: "\n", with: "\\n")
            .replacingOccurrences(of: "\r", with: "\\r")
    }

    private static func jsPromptExpr(label: String, fallback: String) -> String {
        // prompt() kann `null` liefern -> mit ?? auf String-Fallback bringen.
        // Label wie bei Java-`println`: `"name: "`.
        let esc = javaScriptEscapeForDoubleQuotedLiteral(label + ": ")
        return "(\( "prompt(\"" + esc + "\")" ) ?? \"\(fallback)\")"
    }

    private static func emitJavaScriptPrintLineIfNeeded(_ raw: String, indent: Int) -> String? {
        let t = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        let lower = t.lowercased()
        guard lower.hasPrefix("print:") else { return nil }
        let expr = String(t.dropFirst(6)).trimmingCharacters(in: .whitespacesAndNewlines)
        guard !expr.isEmpty else { return nil }
        return sp(indent) + "console.log(" + expr + ");\n"
    }

    private static func emitJavaScriptInputLineIfNeeded(_ raw: String, indent: Int) -> String? {
        let t = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        let lower = t.lowercased()
        guard lower.hasPrefix("input:") else { return nil }
        let rest = String(t.dropFirst(6)).trimmingCharacters(in: .whitespacesAndNewlines)
        guard !rest.isEmpty else { return nil }
        guard let pair = parseInputTypeAndName(afterInputColon: rest) else { return nil }
        let type = pair.type
        let name = pair.name

        let logLabel = javaScriptEscapeForDoubleQuotedLiteral(name + ": ")
        let consoleHint = sp(indent) + "console.log(\"" + logLabel + "\");\n"

        switch type {
        case "int":
            // parseInt mit Basis 10; bei Cancel/leer -> "0"
            let p = jsPromptExpr(label: name, fallback: "0")
            return consoleHint + sp(indent) + "let \(name) = parseInt(\(p), 10);\n"
        case "double":
            let p = jsPromptExpr(label: name, fallback: "0")
            return consoleHint + sp(indent) + "let \(name) = Number(\(p));\n"
        case "String":
            let p = jsPromptExpr(label: name, fallback: "")
            return consoleHint + sp(indent) + "let \(name) = \(p);\n"
        default:
            return nil
        }
    }

    /// Zeichenkette für Python-`"…"`-Literale (`print`, `input`-Prompt).
    private static func pythonEscapeForDoubleQuotedLiteral(_ s: String) -> String {
        s.replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "\"", with: "\\\"")
            .replacingOccurrences(of: "\n", with: "\\n")
            .replacingOccurrences(of: "\r", with: "\\r")
    }

    private static func pyInputExpr(promptLabel: String) -> String {
        // Prompt wie bei Java/JS: `"name: "`.
        let esc = pythonEscapeForDoubleQuotedLiteral(promptLabel + ": ")
        return "input(\"" + esc + "\")"
    }

    private static func emitPythonPrintLineIfNeeded(_ raw: String, indent: Int) -> String? {
        let t = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        let lower = t.lowercased()
        guard lower.hasPrefix("print:") else { return nil }
        let expr = String(t.dropFirst(6)).trimmingCharacters(in: .whitespacesAndNewlines)
        guard !expr.isEmpty else { return nil }
        return sp(indent) + "print(" + expr + ")\n"
    }

    private static func emitPythonInputLineIfNeeded(_ raw: String, indent: Int) -> String? {
        let t = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        let lower = t.lowercased()
        guard lower.hasPrefix("input:") else { return nil }
        let rest = String(t.dropFirst(6)).trimmingCharacters(in: .whitespacesAndNewlines)
        guard !rest.isEmpty else { return nil }
        guard let pair = parseInputTypeAndName(afterInputColon: rest) else { return nil }
        let type = pair.type
        let name = pair.name

        let logLabel = pythonEscapeForDoubleQuotedLiteral(name + ": ")
        let printHint = sp(indent) + "print(\"" + logLabel + "\")\n"

        switch type {
        case "int":
            return printHint + sp(indent) + "\(name) = int(\(pyInputExpr(promptLabel: name)))\n"
        case "double":
            // Python: float entspricht Java double im Einsteigerkontext.
            return printHint + sp(indent) + "\(name) = float(\(pyInputExpr(promptLabel: name)))\n"
        case "String":
            return printHint + sp(indent) + "\(name) = \(pyInputExpr(promptLabel: name))\n"
        default:
            return nil
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

    // MARK: - Java: vollständige Klasse (.java)

    /// Gültiger Java-Klassenname aus freiem Text (z. B. Diagrammtitel).
    public static func sanitizedJavaClassName(_ raw: String) -> String {
        let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty { return "Main" }
        var result = ""
        for (idx, scalar) in trimmed.unicodeScalars.enumerated() {
            let ch = Character(scalar)
            if idx == 0 {
                if CharacterSet.letters.contains(scalar) || scalar == "_" || scalar == "$" {
                    result.append(ch)
                } else if CharacterSet.decimalDigits.contains(scalar) {
                    result.append("_")
                    result.append(ch)
                } else {
                    result.append("_")
                }
            } else if CharacterSet.alphanumerics.contains(scalar) || scalar == "_" || scalar == "$" {
                result.append(ch)
            } else {
                result.append("_")
            }
        }
        while result.contains("__") {
            result = result.replacingOccurrences(of: "__", with: "_")
        }
        result = result.trimmingCharacters(in: CharacterSet(charactersIn: "_"))
        if result.isEmpty { return "Main" }
        let reserved: Set<String> = [
            "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "const",
            "continue", "default", "do", "double", "else", "enum", "extends", "final", "finally",
            "float", "for", "goto", "if", "implements", "import", "instanceof", "int", "interface",
            "long", "native", "new", "package", "private", "protected", "public", "return", "short",
            "static", "strictfp", "super", "switch", "synchronized", "this", "throw", "throws",
            "transient", "try", "void", "volatile", "while", "true", "false", "null", "var", "record",
            "sealed", "permits", "yield", "module", "open", "opens", "requires", "exports", "to",
            "uses", "provides", "with", "transitive",
        ]
        if reserved.contains(result.lowercased()) {
            result = "_" + result
        }
        return result
    }

    /// Vollständige `.java`-Datei: `public class` mit `main`, erzeugtes Snippet eingerückt im Rumpf.
    /// Bei Diagrammen mit `input:`: `import java.util.Scanner;` und `Scanner scanner = …` als erste Zeilen in `main`, danach der Rest des Snippets.
    public static func generateJavaClassFile(
        document: VisuStructDocument,
        options: Options = Options(),
        className raw: String
    ) -> String {
        let className = sanitizedJavaClassName(raw)
        let snippet = generate(document: document, target: .java, options: options)
        let innerBase = options.indentPerLevel * 2
        let bodyNoPrelude = documentContainsJavaInput(document)
            ? stripJavaSnippetScannerPrelude(snippet)
            : snippet
        let prefix = sp(innerBase)
        let indentedBody: String
        if bodyNoPrelude.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            indentedBody = ""
        } else {
            indentedBody = bodyNoPrelude.split(separator: "\n", omittingEmptySubsequences: false)
                .map { line in
                    if line.trimmingCharacters(in: .whitespaces).isEmpty { return prefix }
                    return prefix + String(line)
                }
                .joined(separator: "\n")
        }

        var out = ""
        if documentContainsJavaInput(document) {
            out += "import java.util.Scanner;\n\n"
        }
        out += "public class \(className) {\n"
        out += sp(options.indentPerLevel) + "public static void main(String[] args) {\n"
        if documentContainsJavaInput(document) {
            out += sp(innerBase) + "Scanner scanner = new Scanner(System.in);\n"
            if !indentedBody.isEmpty {
                out += "\n"
            }
        }
        out += indentedBody
        if !indentedBody.isEmpty && !indentedBody.hasSuffix("\n") {
            out += "\n"
        }
        out += sp(options.indentPerLevel) + "}\n"
        out += "}\n"
        return out
    }

    /// Entfernt die im Snippet-Modus vorangestellte Scanner-Zeile (und den Kommentar-„Import“), damit `main` genau eine `Scanner`-Zeile erhält.
    private static func stripJavaSnippetScannerPrelude(_ snippet: String) -> String {
        let lines = snippet.split(separator: "\n", omittingEmptySubsequences: false)
        guard !lines.isEmpty else { return snippet }
        var idx = 0
        if idx < lines.count, lines[idx] == "// import java.util.Scanner;" {
            idx += 1
        }
        while idx < lines.count, lines[idx].trimmingCharacters(in: .whitespaces).isEmpty {
            idx += 1
        }
        if idx < lines.count, lines[idx] == "Scanner scanner = new Scanner(System.in);" {
            idx += 1
        }
        while idx < lines.count, lines[idx].trimmingCharacters(in: .whitespaces).isEmpty {
            idx += 1
        }
        if idx >= lines.count { return "" }
        return lines[idx...].joined(separator: "\n")
    }
}
