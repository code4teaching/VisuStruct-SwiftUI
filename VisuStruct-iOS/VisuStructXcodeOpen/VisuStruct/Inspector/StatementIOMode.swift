import Foundation

/// Darstellung von Anweisung vs. Ein-/Ausgabe im Inspector (Modus-Picker).
enum StatementIOMode: String, CaseIterable, Hashable {
    case statement
    case input
    case output
}
