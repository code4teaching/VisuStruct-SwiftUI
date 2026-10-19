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
        /// Kommentar über dem Code, wenn das Diagramm als Pseudocode markiert ist.
        public var pseudocodeNote: String
        /// Interner Heuristik-Kontext für JavaScript und Python (z. B. Ganzzahldivision).
        var jsIntVariables: Set<String> = []
        /// Text-Variablen: In Python ohne `str(…)` verketten.
        var stringVariables: Set<String> = []
        /// Elementtyp deklarierter Arrays (`int[] zahlen` → `int`), für Eingaben in `zahlen[i]`.
        var arrayElementTypes: [String: String] = [:]

        public init(
            baseIndent: Int = 0,
            indentPerLevel: Int = 4,
            includeDiagramTextAsComments: Bool = false,
            includeEmptyElseBranch: Bool = true,
            pseudocodeNote: String = "Pseudocode – not a runnable program"
        ) {
            self.baseIndent = baseIndent
            self.indentPerLevel = indentPerLevel
            self.includeDiagramTextAsComments = includeDiagramTextAsComments
            self.includeEmptyElseBranch = includeEmptyElseBranch
            self.pseudocodeNote = pseudocodeNote
            self.jsIntVariables = []
        }
    }

    public static func generate(document: VisuStructDocument, target: Target, options: Options = Options()) -> String {
        var out = ""
        var opts = options
        opts.arrayElementTypes = inferArrayElementTypes(document)
        opts.stringVariables = inferStringVariables(document)
        if target == .python {
            opts.jsIntVariables = inferIntegerVariablesForJavaScript(document)
        }
        if target == .javascript {
            // Schul-tauglich: Strict-Modus immer am Anfang des Snippets (wie vereinbart).
            out += "\"use strict\";\n\n"
            opts.jsIntVariables = inferIntegerVariablesForJavaScript(document)
        }
        if target == .python, documentContainsJavaMathRandom(document) {
            out += "import random\n\n"
        }
        if target == .java, documentContainsJavaInput(document) {
            // Snippet-Modus: Import als Kommentar (damit es auch beim Einfügen in `main` nicht „falsch“ steht).
            out += "// import java.util.Scanner;\n"
            out += "Scanner scanner = new Scanner(System.in);\n\n"
        }
        // Nach Import/Scanner, damit die Java-Klasse den Vorspann weiterhin erkennt.
        if document.isPseudocode {
            out += (target == .python ? "# " : "// ") + opts.pseudocodeNote + "\n\n"
        }
        for el in document.elements {
            emit(element: el, target: target, options: opts, indent: opts.baseIndent, into: &out)
        }
        if out.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            let empty = commentPrefix(target: target, forEmpty: true)
            if target == .javascript {
                return "\"use strict\";\n\n" + empty
            }
            return empty
        }
        return postProcessLengthSyntaxInGeneratedCode(out.trimmingCharacters(in: .newlines), target: target)
    }
}
