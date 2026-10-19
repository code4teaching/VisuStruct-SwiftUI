import VisuStructCore

/// Hilfetexte im Inspector je nach Elementtyp.
enum InspectorElementHints {
    /// Placeholder for the line editor, shown only when empty (grau im Feld). Code-Beispiele als Hilfe: `conditionHintLine(for:)` darüber.
    static func lineEditorPlaceholder(for type: VisuStructElementType, ioMode: StatementIOMode, lang: AppLanguage) -> String? {
        switch type {
        case .anweisung:
            switch ioMode {
            case .statement:
                return lang.tr("inspector_placeholder_statement")
            case .input:
                return "int age \"Enter age\""
            case .output:
                return "\"Your age: \" + age"
            }
        case .forSchleife:
            return nil
        case .verzweigung, .whileSchleife, .doUntilSchleife, .endlosschleife:
            return lang.tr("inspector_placeholder_condition")
        case .fallauswahl:
            return lang.tr("inspector_placeholder_selector")
        case .aufruf:
            return lang.tr("inspector_placeholder_call")
        case .aussprung:
            return lang.tr("inspector_placeholder_break")
        case .leerElement:
            return nil
        }
    }

    /// Sichtbare Hilfszeile über dem Bedingungs-Editor (wie Statement-Hinweis unter dem Modus-Picker) — Englisch, code-like.
    static func conditionHintLine(for type: VisuStructElementType) -> String? {
        switch type {
        case .verzweigung:
            return "age >= 18"
        case .whileSchleife:
            return "i < 10"
        case .doUntilSchleife:
            return "again == 1"
        case .fallauswahl:
            // Ausdruck in Klammern: switch (day) { … } — gleicher Stil wie die anderen Hinweise (englisch, code-nah).
            return "day"
        default:
            return nil
        }
    }
}
