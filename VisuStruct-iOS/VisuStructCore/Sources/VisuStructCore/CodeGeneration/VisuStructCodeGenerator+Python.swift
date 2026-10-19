import Foundation

extension VisuStructCodeGenerator {
    // MARK: - Python: Java-Schreibweise aus dem Diagramm in gültiges Python übersetzen

    /// Teile außerhalb von `"…"`-Literalen umwandeln, Literale unverändert lassen.
    static func mapOutsideStringLiterals(_ s: String, _ transform: (String) -> String) -> String {
        let chars = Array(s)
        var out = ""
        var code = ""
        var i = 0
        while i < chars.count {
            if chars[i] != "\"" {
                code.append(chars[i])
                i += 1
                continue
            }
            out += transform(code)
            code = ""
            var j = i + 1
            while j < chars.count, chars[j] != "\"" {
                j += chars[j] == "\\" ? 2 : 1
            }
            out += String(chars[i..<min(j + 1, chars.count)])
            i = j + 1
        }
        return out + transform(code)
    }

    static func regexReplace(_ s: String, _ pattern: String, _ template: String) -> String {
        replaceWithCaptureTemplate(s, pattern: pattern, template: template)
    }

    /// `&&` → `and`, `||` → `or`, `!` → `not`, `true` → `True`, `a.equals(b)` → `a == b`,
    /// `Math.random()` → `random.random()`, `/` zwischen ganzen Zahlen → `//`.
    static func pythonExpression(_ expression: String, intVariables: Set<String>) -> String {
        let withEquals = regexReplace(expression, #"\.equals\(\s*("(?:[^"\\]|\\.)*"|[^()"]*?)\s*\)"#, " == $1")
        func isInt(_ operand: String) -> Bool {
            !operand.isEmpty && (operand.allSatisfy { $0.isASCII && $0.isNumber } || intVariables.contains(operand))
        }
        return mapOutsideStringLiterals(withEquals) { code in
            var c = replaceJavaMathRandomWithPythonRandom(code)
            c = c.replacingOccurrences(of: "===", with: "==")
            c = c.replacingOccurrences(of: "!==", with: "!=")
            c = regexReplace(c, #"\s*&&\s*"#, " and ")
            c = regexReplace(c, #"\s*\|\|\s*"#, " or ")
            c = regexReplace(c, #"!(?!=)\s*"#, "not ")
            c = regexReplace(c, #"\btrue\b"#, "True")
            c = regexReplace(c, #"\bfalse\b"#, "False")
            c = regexReplace(c, #"\bnull\b"#, "None")
            return replaceSimpleRegex(
                c,
                pattern: #"(?<![\w.])([a-zA-Z_]\w*|\d+)\s*/\s*([a-zA-Z_]\w*|\d+)(?![\w.(\[])"#,
                options: [],
                transform: { m, ns in
                    let a = ns.substring(with: m.range(at: 1))
                    let b = ns.substring(with: m.range(at: 2))
                    return isInt(a) && isInt(b) ? "\(a) // \(b)" : ns.substring(with: m.range)
                }
            )
        }
    }

    /// Teile einer Verkettung mit `+` außerhalb von Klammern und Strings.
    static func splitTopLevelPlus(_ expression: String) -> [String] {
        let chars = Array(expression)
        var parts: [String] = []
        var depth = 0
        var current = ""
        var inString = false
        var i = 0
        while i < chars.count {
            let c = chars[i]
            if inString {
                current.append(c)
                if c == "\\", i + 1 < chars.count {
                    i += 1
                    current.append(chars[i])
                } else if c == "\"" {
                    inString = false
                }
                i += 1
                continue
            }
            if c == "\"" {
                inString = true
            } else if c == "(" || c == "[" {
                depth += 1
            } else if c == ")" || c == "]" {
                depth -= 1
            } else if c == "+", depth == 0 {
                parts.append(current.trimmingCharacters(in: .whitespaces))
                current = ""
                i += 1
                continue
            }
            current.append(c)
            i += 1
        }
        parts.append(current.trimmingCharacters(in: .whitespaces))
        return parts
    }

    static func isDoubleQuotedLiteral(_ s: String) -> Bool {
        s.range(of: #"^"(?:[^"\\]|\\.)*"$"#, options: .regularExpression) != nil
    }

    /// `"Summe: " + summe` → `"Summe: " + str(summe)`: Python verkettet Text nicht mit Zahlen. Sonst nur übersetzt.
    static func pythonConcatenation(_ expression: String, intVariables: Set<String>, stringVariables: Set<String>) -> String {
        let parts = splitTopLevelPlus(expression)
        func isText(_ p: String) -> Bool { isDoubleQuotedLiteral(p) || stringVariables.contains(p) }
        if parts.count < 2 || !parts.contains(where: isText) || parts.contains(where: { $0.isEmpty }) {
            return pythonExpression(expression, intVariables: intVariables)
        }
        return parts.map { isText($0) ? $0 : "str(\(pythonExpression($0, intVariables: intVariables)))" }
            .joined(separator: " + ")
    }

    /// Python: `i++` → `i += 1`, `x /= 2` → `x //= 2` (ganze Zahl), Zuweisungen und sonst der Ausdruck übersetzt.
    static func pythonStatementLine(_ raw: String, intVariables: Set<String>, stringVariables: Set<String>) -> String {
        let t = stripTrailingSemicolon(raw).trimmingCharacters(in: .whitespacesAndNewlines)
        if let g = regexGroups(#"^(\w+(?:\[[^\]]*\])?)\s*(\+\+|--)$"#, t) ?? regexGroups(#"^(\+\+|--)\s*(\w+(?:\[[^\]]*\])?)$"#, t) {
            let prefixForm = g[1] == "++" || g[1] == "--"
            let target = prefixForm ? g[2] : g[1]
            let op = prefixForm ? g[1] : g[2]
            return "\(pythonExpression(target, intVariables: intVariables)) \(op == "++" ? "+=" : "-=") 1"
        }
        if let g = regexGroups(#"^(\w+)\s*/=\s*(.+)$"#, t), intVariables.contains(g[1]) {
            return "\(g[1]) //= \(pythonExpression(g[2], intVariables: intVariables))"
        }
        if let g = regexGroups(#"^([\w\[\]. ]+?)\s*(=|\+=|-=|\*=|/=|%=)\s*(.+)$"#, t), !g[3].hasPrefix("=") {
            let target = g[1]
            let op = g[2]
            let rhs = g[3]
            let value: String
            let trimmedRHS = rhs.trimmingCharacters(in: .whitespaces)
            if op == "+=", stringVariables.contains(target.trimmingCharacters(in: .whitespaces)) {
                if isDoubleQuotedLiteral(trimmedRHS) || stringVariables.contains(trimmedRHS) {
                    value = trimmedRHS
                } else if splitTopLevelPlus(rhs).count == 1 {
                    value = "str(\(pythonExpression(rhs, intVariables: intVariables)))"
                } else {
                    value = pythonConcatenation(rhs, intVariables: intVariables, stringVariables: stringVariables)
                }
            } else if op == "=", javaIntCastExpression(rhs) == nil, trimmedRHS != "null" {
                value = pythonConcatenation(rhs, intVariables: intVariables, stringVariables: stringVariables)
            } else if op == "=" {
                value = pythonRhsFromJavaRhs(rhs, intVariables: intVariables)
            } else {
                value = pythonExpression(rhs, intVariables: intVariables)
            }
            return "\(target) \(op) \(value)"
        }
        return pythonExpression(t, intVariables: intVariables)
    }

    // MARK: Zählschleifen

    /// Felder einer `for`-Schleife: drei Zeilen oder eine Zeile `int i = 0; i < n; i++` (auch mit `for (…)`).
    static func forLoopFields(_ lines: [String]) -> (String, String, String)? {
        let raw = lines.map { stripTrailingSemicolon($0).trimmingCharacters(in: .whitespacesAndNewlines) }.filter { !$0.isEmpty }
        var parts = raw
        if raw.count == 1 {
            var one = raw[0]
            if let stripped = stripKeywordPrefix("for", from: one) { one = stripped }
            parts = one.split(separator: ";", omittingEmptySubsequences: false).map {
                $0.trimmingCharacters(in: .whitespacesAndNewlines)
            }
        }
        guard parts.count == 3, !parts.contains(where: { $0.isEmpty }) else { return nil }
        return (parts[0], parts[1], parts[2])
    }

    struct PythonForLoop {
        /// `for i in range(…):` – oder `nil`, wenn nur eine `while`-Schleife passt.
        var rangeLine: String?
        let initLine: String
        let condition: String
        let increment: String
    }

    /// Schrittweite aus `i++`, `i--`, `i += 2`, `i -= 2`, `i = i + 2`, `i = i - 2`.
    static func forLoopStepSize(_ s: String, name: String) -> Int? {
        if let g = regexGroups(#"^\s*(\w+)\s*(\+\+|--)\s*$"#, s) {
            return g[1] == name ? (g[2] == "++" ? 1 : -1) : nil
        }
        if let g = regexGroups(#"^\s*(\+\+|--)\s*(\w+)\s*$"#, s) {
            return g[2] == name ? (g[1] == "++" ? 1 : -1) : nil
        }
        if let g = regexGroups(#"^\s*(\w+)\s*(\+|-)=\s*(\d+)\s*$"#, s), let k = Int(g[3]) {
            return g[1] == name ? (g[2] == "+" ? k : -k) : nil
        }
        if let g = regexGroups(#"^\s*(\w+)\s*=\s*(\w+)\s*(\+|-)\s*(\d+)\s*$"#, s), let k = Int(g[4]) {
            return g[1] == name && g[2] == name ? (g[3] == "+" ? k : -k) : nil
        }
        return nil
    }

    /// `n` → `n + 1`, `10` → `11`.
    static func shiftedBound(_ bound: String, by: Int) -> String {
        if let n = Int(bound) { return String(n + by) }
        let simple = bound.range(of: #"^[\w.()\[\]]+$"#, options: .regularExpression) != nil ? bound : "(\(bound))"
        return by > 0 ? "\(simple) + \(by)" : "\(simple) - \(-by)"
    }

    /// Zählschleife für Python: `range(…)`, wenn Kopf und Schritt passen; sonst Bausteine für `while`.
    static func pythonForLoop(_ lines: [String], intVariables: Set<String>) -> PythonForLoop? {
        guard let fields = forLoopFields(lines) else { return nil }
        let (initS, condS, stepS) = fields
        guard let initG = regexGroups(#"(?i)^\s*(?:integer|int|long|short|byte|double|float)?\s*([a-zA-Z_]\w*)\s*=\s*(.+)$"#, initS) else {
            return nil
        }
        let name = initG[1]
        let start = pythonExpression(initG[2], intVariables: intVariables)
        var loop = PythonForLoop(rangeLine: nil, initLine: "\(name) = \(start)", condition: condS, increment: stepS)
        guard let cond = regexGroups(#"^\s*(\w+)\s*(<=|<|>=|>)\s*(.+)$"#, condS), cond[1] == name,
              let step = forLoopStepSize(stepS, name: name), step != 0 else {
            return loop
        }
        var stop = pythonExpression(cond[3], intVariables: intVariables)
        let op = cond[2]
        if step > 0, op == "<=" {
            stop = shiftedBound(stop, by: 1)
        } else if step < 0, op == ">=" {
            stop = shiftedBound(stop, by: -1)
        } else if !(step > 0 && op == "<") && !(step < 0 && op == ">") {
            return loop
        }
        let args = step == 1 ? (start == "0" ? [stop] : [start, stop]) : [start, stop, String(step)]
        loop.rangeLine = "for \(name) in range(\(args.joined(separator: ", "))):"
        return loop
    }

    // MARK: Typen aus dem Diagramm

    /// Text-Variablen (`String s = …`, `input: String s`): in Python ohne `str(…)` verketten.
    static func inferStringVariables(_ doc: VisuStructDocument) -> Set<String> {
        var out: Set<String> = []
        walkTextLines(doc.elements) { raw in
            let t = raw.trimmingCharacters(in: .whitespacesAndNewlines)
            if t.lowercased().hasPrefix("input:") {
                let rest = String(t.dropFirst(6)).trimmingCharacters(in: .whitespacesAndNewlines)
                if let p = parseInputLineAfterColon(rest), p.type == "String", !p.isIndexedTarget { out.insert(p.name) }
                return
            }
            if let g = regexGroups(#"(?i)^\s*(?:const\s+)?string\s+([a-zA-Z_]\w*)\s*="#, t) { out.insert(g[1]) }
        }
        return out
    }

    /// Elementtyp deklarierter Arrays (`int[] zahlen` → `int`), für Eingaben in `zahlen[i]`.
    static func inferArrayElementTypes(_ doc: VisuStructDocument) -> [String: String] {
        var out: [String: String] = [:]
        let type = "(integer|int|long|float|double|string|boolean|char|bool)"
        walkTextLines(doc.elements) { raw in
            let g = regexGroups(#"(?i)^\s*"# + type + #"\s*\[\s*\]\s*([a-zA-Z_]\w*)"#, raw)
                ?? regexGroups(#"(?i)^\s*"# + type + #"\s+([a-zA-Z_]\w*)\s*\[\s*\]"#, raw)
            if let g { out[g[2]] = normalizeInputTypeKeyword(g[1]) }
        }
        return out
    }

    static func walkTextLines(_ elements: [VisuStructElement], _ visit: (String) -> Void) {
        for e in elements {
            e.textLines.forEach(visit)
            if let body = e.loopBody { walkTextLines(body, visit) }
            for c in e.cases ?? [] { walkTextLines(c.elements, visit) }
        }
    }

    /// `input:`-Zeile; Kurzform `input: zahlen[i]` bekommt den Typ aus der Array-Deklaration statt immer `String`.
    static func inputParse(_ raw: String, arrayTypes: [String: String]) -> InputLineParse? {
        let t = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard t.lowercased().hasPrefix("input:") else { return nil }
        let rest = String(t.dropFirst(6)).trimmingCharacters(in: .whitespacesAndNewlines)
        guard !rest.isEmpty, let p = parseInputLineAfterColon(rest) else { return nil }
        let typed = rest.range(of: #"(?i)^\s*(integer|int|long|float|double|string|boolean|char|bool)\s"#, options: .regularExpression) != nil
        if p.isIndexedTarget, !typed, let bracket = p.name.firstIndex(of: "[") {
            let arrayName = String(p.name[..<bracket]).trimmingCharacters(in: .whitespaces)
            if let declared = arrayTypes[arrayName] {
                return InputLineParse(type: declared, name: p.name, customPrompt: p.customPrompt)
            }
        }
        return p
    }
}
