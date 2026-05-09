import SwiftUI

/// Gemeinsame Fokus-Markierung für Diagrammtitel, Inspector-Felder und Zeileneditor.
enum DiagramEditorFocusTarget: Hashable {
    case caption
    case caseLabel
    case textEditor
    /// Zählschleife: drei Kopf-Felder (Start / Bedingung / Schritt).
    case forLoopPart(Int)
}
