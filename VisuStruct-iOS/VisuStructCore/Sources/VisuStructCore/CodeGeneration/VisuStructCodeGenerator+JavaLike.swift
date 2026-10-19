import Foundation

extension VisuStructCodeGenerator {
    /// Kopf einer C-`for`-Schleife: mehrere Felder mit `; ` wie `for (int i=0; i<5; i++)`. Eine Zeile bleibt unverändert (Abwärtskompatibel).
    static func cStyleForLoopHeaderText(_ lines: [String]) -> String {
        let parts = lines.map { stripTrailingSemicolon($0) }.filter { !$0.isEmpty }
        if parts.isEmpty { return ";;" }
        if parts.count == 1 { return parts[0] }
        return parts.joined(separator: "; ")
    }

    static func javaScriptForLoopHeaderText(_ lines: [String]) -> String {
        let header = cStyleForLoopHeaderText(lines)
        var parts = header.split(separator: ";", omittingEmptySubsequences: false).map(String.init)
        guard let first = parts.first else { return header }
        if let translatedFirst = javaScriptForInitializerFromJavaTypedDeclaration(first) {
            parts[0] = translatedFirst
        }
        return parts.joined(separator: ";")
    }

    static func javaScriptForInitializerFromJavaTypedDeclaration(_ raw: String) -> String? {
        let pattern = #"(?i)^(\s*)(?:integer|int|long|float|double|string|boolean|char|bool)\s+(\w+)(?:\s*=\s*(.*))?\s*$"#
        guard let g = regexGroups(pattern, raw), g.count >= 3 else { return nil }
        let leading = g[1]
        let name = g[2].trimmingCharacters(in: .whitespacesAndNewlines)
        guard !name.isEmpty else { return nil }
        let rhs = g.count > 3 ? g[3].trimmingCharacters(in: .whitespacesAndNewlines) : ""
        if raw.contains("="), !rhs.isEmpty {
            return leading + "let \(name) = \(rhs)"
        }
        return leading + "let \(name)"
    }

    static func stripTrailingSemicolon(_ s: String) -> String {
        var x = s.trimmingCharacters(in: .whitespacesAndNewlines)
        while x.hasSuffix(";") {
            x = String(x.dropLast()).trimmingCharacters(in: .whitespacesAndNewlines)
        }
        return x
    }

    static func regexGroups(_ pattern: String, _ string: String) -> [String]? {
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

    // MARK: - Java-ähnliche Zuweisungen → JS `let` / Python ohne Typ
    // MARK: - `const Typ name` / `const Typ name = …` (Diagramm) → Java `final` / JS `const` / Python

    struct JavaStyleSimpleAssignmentParse {
        let name: String
        let rhs: String
        let isArray: Bool
    }

    struct ConstTypedLineParse {
        let rawType: String
        let name: String
        let rhs: String?
    }

    /// `const int PIN` bzw. `const double PI = 3.14` (nur mit Schlüsselwort `const`); sonst `nil`.
    static func parseConstTypedLine(_ rawLine: String) -> ConstTypedLineParse? {
        let line = stripTrailingSemicolon(rawLine).trimmingCharacters(in: .whitespacesAndNewlines)
        if line.isEmpty { return nil }
        let pattern =
            #"(?i)^\s*const\s+(integer|int|long|float|double|string|boolean|char|bool)\s+(\w+)(?:\s*=\s*(.*))?$"#
        guard let g = regexGroups(pattern, line), g.count >= 3 else { return nil }
        let rawType = g[1].trimmingCharacters(in: .whitespacesAndNewlines)
        let name = g[2].trimmingCharacters(in: .whitespacesAndNewlines)
        if name.isEmpty { return nil }
        if !line.contains("=") {
            return ConstTypedLineParse(rawType: rawType, name: name, rhs: nil)
        }
        guard g.count > 3 else { return nil }
        let rhsTrim = g[3].trimmingCharacters(in: .whitespacesAndNewlines)
        if rhsTrim.isEmpty { return nil }
        return ConstTypedLineParse(rawType: rawType, name: name, rhs: rhsTrim)
    }

    /// Typbezeichner wie im Diagramm → gültiger Java-Typ (Schul-Set).
    static func javaTypeForConstDeclaration(_ raw: String) -> String {
        let t = raw.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        switch t {
        case "integer", "int": return "int"
        case "long": return "long"
        case "float": return "float"
        case "double": return "double"
        case "string": return "String"
        case "boolean", "bool": return "boolean"
        case "char": return "char"
        default: return raw
        }
    }

    /// `const`-Deklaration: Java `final`, JS `const` bzw. ohne Initialwert `let` + Hinweis, Python Zuweisung / `None`.
    static func emitConstTypedLineIfNeeded(_ raw: String, target: Target, indent: Int, intVariables: Set<String> = []) -> String? {
        guard let p = parseConstTypedLine(raw) else { return nil }
        let jt = javaTypeForConstDeclaration(p.rawType)
        let name = p.name
        let rhsOpt = p.rhs?.trimmingCharacters(in: .whitespacesAndNewlines)
        let hasValue = rhsOpt.map { !$0.isEmpty } ?? false
        switch target {
        case .java:
            let decl: String
            if hasValue, let r = rhsOpt {
                decl = "final \(jt) \(name) = \(r)"
            } else {
                decl = "final \(jt) \(name)"
            }
            return sp(indent) + formatCStyleStatementLine(decl) + "\n"
        case .javascript:
            if hasValue, let r = rhsOpt {
                let inner = "const \(name) = \(r)"
                return sp(indent) + formatCStyleStatementLine(inner) + "\n"
            }
            // `const` verlangt in JS einen Initialwert; `let` erlaubt keine TDZ-„const“-Semantik, aber verständlicher Kompromiss fürs Diagramm
            return sp(indent) + "let \(name);  // from diagram: const \(jt) \(name)\n"
        case .python:
            if hasValue, let r = rhsOpt {
                return sp(indent) + "\(name) = \(pythonRhsFromJavaRhs(r, intVariables: intVariables))  # const \(jt)\n"
            }
            return sp(indent) + "\(name) = None  # const \(jt), uninitialized\n"
        }
    }

    /// Eine Zeile `Typ name = ausdruck` (Schul­syntax). Kein Treffer → `nil`.
    static func parseJavaStyleSimpleAssignment(_ rawLine: String) -> JavaStyleSimpleAssignmentParse? {
        let line = stripTrailingSemicolon(rawLine).trimmingCharacters(in: .whitespacesAndNewlines)
        if line.isEmpty { return nil }
        // Schul­set, case-insensitive: int/Int/INTEGER, integer, long, float, double, String, boolean/bool, char.
        // `integer` vor `int`, damit nicht nur der Präfix `int` von `integer` matched.
        let type = #"(?:integer|int|long|float|double|string|boolean|char|bool)"#
        let pattern = #"(?i)^\s*"# + type + #"(?:\s*\[\s*\]\s+(\w+)|\s+(\w+)(\s*\[\s*\])?)\s*=\s*(.*)$"#
        guard let g = regexGroups(pattern, line), g.count >= 3 else { return nil }
        let name = g[1].isEmpty ? g[2] : g[1]
        let isArray = !g[1].isEmpty || (!g[3].isEmpty)
        let rhs = g[4].trimmingCharacters(in: .whitespacesAndNewlines)
        if rhs.isEmpty { return nil }
        return JavaStyleSimpleAssignmentParse(name: name, rhs: rhs, isArray: isArray)
    }

    static func pythonRhsFromJavaRhs(_ rhs: String, intVariables: Set<String> = []) -> String {
        let t = rhs.trimmingCharacters(in: .whitespacesAndNewlines)
        if t == "null" { return "None" }
        if let cast = javaIntCastExpression(t) {
            return "int(\(pythonRhsFromJavaRhs(cast, intVariables: intVariables)))"
        }
        return pythonExpression(t, intVariables: intVariables)
    }

    static func replaceJavaMathRandomWithPythonRandom(_ s: String) -> String {
        replaceSimpleRegex(
            s,
            pattern: #"(?i)\bMath\.random\s*\(\s*\)"#,
            options: [],
            transform: { _, _ in "random.random()" }
        )
    }

    static func normalizeJavaScriptMathRandomCall(_ s: String) -> String {
        replaceSimpleRegex(
            s,
            pattern: #"(?i)\bMath\.random\b(?!\s*\()"#,
            options: [],
            transform: { _, _ in "Math.random()" }
        )
    }

    static func arrayLiteralFromJavaInitializer(_ rhs: String) -> String {
        let t = rhs.trimmingCharacters(in: .whitespacesAndNewlines)
        guard t.hasPrefix("{"), t.hasSuffix("}") else { return rhs }
        let inner = String(t.dropFirst().dropLast())
        return "[" + inner + "]"
    }

    static func javaNewArraySizeExpression(_ rhs: String) -> String? {
        let pattern = #"(?i)^\s*new\s+(?:byte|short|int|long|float|double|boolean|char|string)\s*\[\s*(.+)\s*\]\s*$"#
        guard let g = regexGroups(pattern, rhs), g.count >= 2 else { return nil }
        let size = g[1].trimmingCharacters(in: .whitespacesAndNewlines)
        return size.isEmpty ? nil : size
    }

    static func javaIntCastExpression(_ rhs: String) -> String? {
        let pattern = #"(?i)^\s*\(\s*int(?:eger)?\s*\)\s*\(?\s*(.+?)\s*\)?\s*$"#
        guard let g = regexGroups(pattern, rhs), g.count >= 2 else { return nil }
        let expression = g[1].trimmingCharacters(in: .whitespacesAndNewlines)
        return expression.isEmpty ? nil : expression
    }

    static func javaScriptRhsFromJavaRhs(_ rhs: String, isArray: Bool) -> String {
        let t = rhs.trimmingCharacters(in: .whitespacesAndNewlines)
        if isArray {
            if let size = javaNewArraySizeExpression(t) {
                return "new Array(\(size))"
            }
            return arrayLiteralFromJavaInitializer(t)
        }
        if let cast = javaIntCastExpression(t) {
            return "Math.floor(\(javaScriptRhsFromJavaRhs(cast, isArray: false)))"
        }
        return normalizeJavaScriptMathRandomCall(t)
    }

    static func pythonRhsFromJavaRhs(_ rhs: String, isArray: Bool, intVariables: Set<String> = []) -> String {
        let t = rhs.trimmingCharacters(in: .whitespacesAndNewlines)
        if isArray {
            if let size = javaNewArraySizeExpression(t) {
                return "[None] * \(size)"
            }
            return pythonExpression(arrayLiteralFromJavaInitializer(t), intVariables: intVariables)
        }
        return pythonRhsFromJavaRhs(t, intVariables: intVariables)
    }

    /// JavaScript: `int x = 5` / `Int x = 5` → `let x = 5;`. Python: `x = 5`. Typen siehe `parseJavaStyleSimpleAssignment`. Java: `nil` (allgemeiner Pfad).
    static func emitTranslatedJavaLikeAssignmentIfNeeded(_ raw: String, target: Target, indent: Int, options: Options) -> String? {
        guard target == .javascript || target == .python else { return nil }
        guard let p = parseJavaStyleSimpleAssignment(raw) else { return nil }
        switch target {
        case .javascript:
            let rhs = javaScriptRhsFromJavaRhs(p.rhs, isArray: p.isArray)
            let inner = "let \(p.name) = \(rhs)"
            let line = formatCStyleStatementLine(inner)
            return sp(indent) + line + "\n"
        case .python:
            let ints = options.jsIntVariables
            let plain = !p.isArray && javaIntCastExpression(p.rhs) == nil && p.rhs.trimmingCharacters(in: .whitespaces) != "null"
            let rhs = plain
                ? pythonConcatenation(p.rhs, intVariables: ints, stringVariables: options.stringVariables)
                : pythonRhsFromJavaRhs(p.rhs, isArray: p.isArray, intVariables: ints)
            return sp(indent) + "\(p.name) = \(rhs)\n"
        case .java:
            return nil
        }
    }

    static func inferIntegerVariablesForJavaScript(_ doc: VisuStructDocument) -> Set<String> {
        func isIntegerType(_ t: String) -> Bool {
            let x = t.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
            return x == "int" || x == "integer" || x == "long" || x == "short" || x == "byte"
        }

        func addFromStatementLine(_ raw: String, into set: inout Set<String>) {
            let t = raw.trimmingCharacters(in: .whitespacesAndNewlines)
            if t.isEmpty { return }
            let lower = t.lowercased()
            if lower.hasPrefix("input:") {
                let rest = String(t.dropFirst(6)).trimmingCharacters(in: .whitespacesAndNewlines)
                if let p = parseInputLineAfterColon(rest), isIntegerType(p.type) {
                    // Array-Targets ignorieren (z. B. a[i]).
                    if !p.name.contains("[") { set.insert(p.name) }
                }
                return
            }
            // `const int x` / `const int x = ...`
            if let c = parseConstTypedLine(t), isIntegerType(c.rawType) {
                set.insert(c.name)
                return
            }
            // `int x = ...` / `Integer x = ...` / `long x = ...`
            let pat = #"(?i)^\s*(integer|int|long|short|byte)\s+([a-zA-Z_]\w*)\s*="#
            if let g = regexGroups(pat, t), g.count >= 3 {
                set.insert(g[2].trimmingCharacters(in: .whitespacesAndNewlines))
            }
        }

        func walk(_ elements: [VisuStructElement], into set: inout Set<String>) {
            for e in elements {
                for line in e.textLines {
                    addFromStatementLine(line, into: &set)
                }
                if let body = e.loopBody {
                    walk(body, into: &set)
                }
                if let cases = e.cases {
                    for c in cases {
                        walk(c.elements, into: &set)
                    }
                }
            }
        }

        var out: Set<String> = []
        walk(doc.elements, into: &out)
        return out
    }

    static func javaScriptIntegerDivisionIfNeeded(_ raw: String, intVariables: Set<String>) -> String? {
        let t = stripTrailingSemicolon(raw).trimmingCharacters(in: .whitespacesAndNewlines)
        if t.isEmpty { return nil }

        // x = x / y  (einfaches Muster, ohne weitere Operatoren)
        let assignPat = #"^\s*([a-zA-Z_]\w*)\s*=\s*([a-zA-Z_]\w*|\d+)\s*/\s*([a-zA-Z_]\w*|\d+)\s*$"#
        if let g = regexGroups(assignPat, t), g.count >= 4 {
            let lhs = g[1]
            let a = g[2]
            let b = g[3]
            guard intVariables.contains(lhs) else { return nil }
            // Nur wenn der LHS auch wirklich der Dividend ist (typischer int-div Update).
            guard lhs == a else { return nil }
            return "\(lhs) = Math.floor(\(a) / \(b))"
        }

        // x /= y
        let divEqPat = #"^\s*([a-zA-Z_]\w*)\s*/=\s*([a-zA-Z_]\w*|\d+)\s*$"#
        if let g2 = regexGroups(divEqPat, t), g2.count >= 3 {
            let lhs = g2[1]
            let b = g2[2]
            guard intVariables.contains(lhs) else { return nil }
            return "\(lhs) = Math.floor(\(lhs) / \(b))"
        }

        return nil
    }
}
