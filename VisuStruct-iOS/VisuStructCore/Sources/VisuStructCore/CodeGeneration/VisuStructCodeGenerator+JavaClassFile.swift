import Foundation

extension VisuStructCodeGenerator {
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
        // Das Trimmen oben entfernt auch den `_` vor einer führenden Ziffer.
        if let first = result.unicodeScalars.first, CharacterSet.decimalDigits.contains(first) {
            result = "_" + result
        }
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
    static func stripJavaSnippetScannerPrelude(_ snippet: String) -> String {
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
