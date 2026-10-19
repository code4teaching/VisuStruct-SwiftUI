import Foundation

extension VisuStructCodeGenerator {
    /// Diagramm-Präfixe für Ausgabe: `output:` (UI) bzw. älteres `print:` — Codeziel bleibt `println`/`log`/`print`.
    static func expressionAfterOutputDiagramPrefix(_ raw: String) -> String? {
        let t = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        let lower = t.lowercased()
        let expr: String
        if lower.hasPrefix("output:") {
            expr = String(t.dropFirst(7)).trimmingCharacters(in: .whitespacesAndNewlines)
        } else if lower.hasPrefix("print:") {
            expr = String(t.dropFirst(6)).trimmingCharacters(in: .whitespacesAndNewlines)
        } else {
            return nil
        }
        if expr.isEmpty { return nil }
        return expr
    }

    static func emitJavaPrintLineIfNeeded(_ raw: String, indent: Int) -> String? {
        guard let expr = expressionAfterOutputDiagramPrefix(raw) else { return nil }
        return sp(indent) + "System.out.println(" + expr + ");\n"
    }

    struct InputLineParse {
        let type: String
        let name: String
        /// Optionaler Eingabe-Hinweis in `"…"` hinter `Typ name` oder in Kurzform `name "…"`.
        let customPrompt: String?

        var isIndexedTarget: Bool {
            name.contains("[") && name.contains("]")
        }
    }

    /// `input:`-Rest: `int pin`, `int pin "Hinweis"`, Kurzform `pin "Hinweis"` (implizit `int`), bisher `zahl` / `int zahl` ohne Anführungszeichen.
    static func parseInputLineAfterColon(_ rest: String) -> InputLineParse? {
        let trimmed = rest.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty { return nil }
        // 1) `int name` oder `int name "Hinweis"`
        let typedWithPrompt =
            #"(?i)^\s*(integer|int|long|float|double|string|boolean|char|bool)\s+([a-zA-Z_]\w*(?:\s*\[[^\]]+\])?)(?:\s+"([^"]*)")?\s*$"#
        if let g = regexGroups(typedWithPrompt, trimmed), g.count >= 3 {
            let typRaw = g[1]
            let n = g[2].replacingOccurrences(of: " ", with: "")
            if n.isEmpty { return nil }
            let c = g.count > 3 ? g[3].trimmingCharacters(in: .whitespacesAndNewlines) : ""
            return InputLineParse(
                type: normalizeInputTypeKeyword(typRaw),
                name: n,
                customPrompt: c.isEmpty ? nil : c
            )
        }
        // 2) `name "Hinweis"` (implizit int) bzw. `array[i] "Hinweis"` (implizit String für Textfelder).
        let nameQuoted = #"(?i)^\s*([a-zA-Z_]\w*(?:\s*\[[^\]]+\])?)\s+"([^"]*)"\s*$"#
        if let g2 = regexGroups(nameQuoted, trimmed), g2.count >= 2 {
            let target = g2[1].replacingOccurrences(of: " ", with: "")
            let w = target.lowercased()
            let notNameShorthand: Set<String> = [
                "int", "integer", "long", "float", "double", "string", "boolean", "char", "bool", "void",
            ]
            if notNameShorthand.contains(w) { return nil }
            let inferredType = target.contains("[") ? "String" : "int"
            return InputLineParse(type: inferredType, name: target, customPrompt: g2[2].trimmingCharacters(in: .whitespacesAndNewlines))
        }
        // 3) bisher: `input: zahl` / `int zahl` (nur Trennzeichen)
        if let pair = parseInputTypeAndName(afterInputColon: trimmed) {
            return InputLineParse(type: normalizeInputTypeKeyword(pair.0), name: pair.1, customPrompt: nil)
        }
        return nil
    }

    static func normalizeInputTypeKeyword(_ raw: String) -> String {
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

    /// Nach `input:`: `int zahl` wie bisher, oder Kurzform **`zahl`** → Typ **`int`** (Diagramm ohne Typ, z. B. „input: zahl“).
    static func parseInputTypeAndName(afterInputColon rest: String) -> (type: String, name: String)? {
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

    /// Ohne `output:`/`print:`-Präfix: Zeile beginnt mit `"…"` → Ausgabe (Java/JS/Python), z. B. `"Summe: " + summe`.
    static func emitBareLeadingStringAsPrintIfNeeded(_ raw: String, target: Target, indent: Int, options: Options) -> String? {
        guard target == .java || target == .javascript || target == .python else { return nil }
        let t = stripTrailingSemicolon(raw).trimmingCharacters(in: .whitespacesAndNewlines)
        guard t.hasPrefix("\"") else { return nil }
        switch target {
        case .java:
            return sp(indent) + "System.out.println(" + t + ");\n"
        case .javascript:
            return sp(indent) + "console.log(" + t + ");\n"
        case .python:
            let argument = pythonConcatenation(t, intVariables: options.jsIntVariables, stringVariables: options.stringVariables)
            return sp(indent) + "print(" + argument + ")\n"
        }
    }

    /// Zeichenkette für Java-`"…"`-Literale (z. B. in `System.out.println`).
    static func javaEscapeForDoubleQuotedLiteral(_ s: String) -> String {
        s.replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "\"", with: "\\\"")
            .replacingOccurrences(of: "\n", with: "\\n")
            .replacingOccurrences(of: "\r", with: "\\r")
    }

    static func emitJavaInputLineIfNeeded(_ raw: String, indent: Int, arrayTypes: [String: String] = [:]) -> String? {
        guard let p = inputParse(raw, arrayTypes: arrayTypes) else { return nil }
        let type = p.type
        let name = p.name
        let promptOut: String = {
            if let c = p.customPrompt, !c.isEmpty {
                let esc = javaEscapeForDoubleQuotedLiteral(c)
                return sp(indent) + "System.out.println(\"" + esc + "\");\n"
            }
            let label = javaEscapeForDoubleQuotedLiteral(name + ": ")
            return sp(indent) + "System.out.println(\"" + label + "\");\n"
        }()

        switch type {
        case "int":
            let target = p.isIndexedTarget ? name : "int \(name)"
            return promptOut + sp(indent) + "\(target) = scanner.nextInt();\n"
        case "double":
            let target = p.isIndexedTarget ? name : "double \(name)"
            return promptOut + sp(indent) + "\(target) = scanner.nextDouble();\n"
        case "String":
            // `next()` statt `nextLine()` (vermeidet typische Newline-Falle nach `nextInt()` im Unterricht).
            let target = p.isIndexedTarget ? name : "String \(name)"
            return promptOut + sp(indent) + "\(target) = scanner.next();\n"
        case "boolean":
            let target = p.isIndexedTarget ? name : "boolean \(name)"
            return promptOut + sp(indent) + "\(target) = scanner.nextBoolean();\n"
        default:
            return nil
        }
    }

    /// Zeichenkette für JS-`"…"`-Literale (z. B. `console.log`, `prompt`).
    static func javaScriptEscapeForDoubleQuotedLiteral(_ s: String) -> String {
        s.replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "\"", with: "\\\"")
            .replacingOccurrences(of: "\n", with: "\\n")
            .replacingOccurrences(of: "\r", with: "\\r")
    }

    static func jsPromptExpr(label: String, fallback: String) -> String {
        // prompt() kann `null` liefern -> mit ?? auf String-Fallback bringen.
        // Label wie bei Java-`println`: `"name: "`.
        let esc = javaScriptEscapeForDoubleQuotedLiteral(label + ": ")
        return "(\( "prompt(\"" + esc + "\")" ) ?? \"\(fallback)\")"
    }

    static func jsPromptExprCustomPromptText(_ custom: String, fallback: String) -> String {
        let esc = javaScriptEscapeForDoubleQuotedLiteral(custom)
        return "(\( "prompt(\"" + esc + "\")" ) ?? \"\(fallback)\")"
    }

    static func emitJavaScriptPrintLineIfNeeded(_ raw: String, indent: Int) -> String? {
        guard let expr = expressionAfterOutputDiagramPrefix(raw) else { return nil }
        return sp(indent) + "console.log(" + expr + ");\n"
    }

    static func emitJavaScriptInputLineIfNeeded(_ raw: String, indent: Int, arrayTypes: [String: String] = [:]) -> String? {
        guard let pz = inputParse(raw, arrayTypes: arrayTypes) else { return nil }
        let type = pz.type
        let name = pz.name
        let useCustom = pz.customPrompt.map { !$0.isEmpty } ?? false
        let consoleHint: String? = {
            if useCustom { return nil } // `prompt`/`input` trägt den Text; kein doppeltes `console.log`/`print`
            let logLabel = javaScriptEscapeForDoubleQuotedLiteral(name + ": ")
            return sp(indent) + "console.log(\"" + logLabel + "\");\n"
        }()

        switch type {
        case "int":
            let p: String
            if useCustom, let c = pz.customPrompt {
                p = jsPromptExprCustomPromptText(c, fallback: "0")
            } else {
                p = jsPromptExpr(label: name, fallback: "0")
            }
            let target = pz.isIndexedTarget ? name : "let \(name)"
            return (consoleHint ?? "") + sp(indent) + "\(target) = parseInt(\(p), 10);\n"
        case "double":
            let p: String
            if useCustom, let c = pz.customPrompt {
                p = jsPromptExprCustomPromptText(c, fallback: "0")
            } else {
                p = jsPromptExpr(label: name, fallback: "0")
            }
            let target = pz.isIndexedTarget ? name : "let \(name)"
            return (consoleHint ?? "") + sp(indent) + "\(target) = Number(\(p));\n"
        case "String":
            let p: String
            if useCustom, let c = pz.customPrompt {
                p = jsPromptExprCustomPromptText(c, fallback: "")
            } else {
                p = jsPromptExpr(label: name, fallback: "")
            }
            let target = pz.isIndexedTarget ? name : "let \(name)"
            return (consoleHint ?? "") + sp(indent) + "\(target) = \(p);\n"
        case "boolean":
            let p: String
            if useCustom, let c = pz.customPrompt {
                p = jsPromptExprCustomPromptText(c, fallback: "")
            } else {
                p = jsPromptExpr(label: name, fallback: "")
            }
            let target = pz.isIndexedTarget ? name : "let \(name)"
            return (consoleHint ?? "") + sp(indent) + "\(target) = \(p).trim().toLowerCase() === \"true\";\n"
        default:
            return nil
        }
    }

    /// Zeichenkette für Python-`"…"`-Literale (`print`, `input`-Prompt).
    static func pythonEscapeForDoubleQuotedLiteral(_ s: String) -> String {
        s.replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "\"", with: "\\\"")
            .replacingOccurrences(of: "\n", with: "\\n")
            .replacingOccurrences(of: "\r", with: "\\r")
    }

    static func pyInputExpr(promptLabel: String) -> String {
        // Prompt wie bei Java/JS: `"name: "`.
        let esc = pythonEscapeForDoubleQuotedLiteral(promptLabel + ": ")
        return "input(\"" + esc + "\")"
    }

    static func pyInputExprCustomPrompt(_ fullPrompt: String) -> String {
        let esc = pythonEscapeForDoubleQuotedLiteral(fullPrompt)
        return "input(\"" + esc + "\")"
    }

    static func emitPythonPrintLineIfNeeded(_ raw: String, indent: Int, options: Options) -> String? {
        guard let expr = expressionAfterOutputDiagramPrefix(raw) else { return nil }
        let argument = pythonConcatenation(expr, intVariables: options.jsIntVariables, stringVariables: options.stringVariables)
        return sp(indent) + "print(" + argument + ")\n"
    }

    static func emitPythonInputLineIfNeeded(_ raw: String, indent: Int, arrayTypes: [String: String] = [:]) -> String? {
        guard let pz = inputParse(raw, arrayTypes: arrayTypes) else { return nil }
        let type = pz.type
        let name = pz.name
        let useCustom = pz.customPrompt.map { !$0.isEmpty } ?? false
        let printHint: String? = {
            if useCustom { return nil }
            let logLabel = pythonEscapeForDoubleQuotedLiteral(name + ": ")
            return sp(indent) + "print(\"" + logLabel + "\")\n"
        }()

        switch type {
        case "int":
            if useCustom, let c = pz.customPrompt {
                return (printHint ?? "") + sp(indent) + "\(name) = int(\(pyInputExprCustomPrompt(c)))\n"
            }
            return (printHint ?? "") + sp(indent) + "\(name) = int(\(pyInputExpr(promptLabel: name)))\n"
        case "double":
            if useCustom, let c = pz.customPrompt {
                return (printHint ?? "") + sp(indent) + "\(name) = float(\(pyInputExprCustomPrompt(c)))\n"
            }
            return (printHint ?? "") + sp(indent) + "\(name) = float(\(pyInputExpr(promptLabel: name)))\n"
        case "String":
            if useCustom, let c = pz.customPrompt {
                return (printHint ?? "") + sp(indent) + "\(name) = \(pyInputExprCustomPrompt(c))\n"
            }
            return (printHint ?? "") + sp(indent) + "\(name) = \(pyInputExpr(promptLabel: name))\n"
        case "boolean":
            let input = useCustom ? pyInputExprCustomPrompt(pz.customPrompt ?? "") : pyInputExpr(promptLabel: name)
            return (printHint ?? "") + sp(indent) + "\(name) = \(input).strip().lower() in (\"true\", \"wahr\")\n"
        default:
            return nil
        }
    }
}
