import Foundation

/// Entspricht dem Root-Tag `<struktogramm ...>` aus dem Java-Projekt.
public struct VisuStructDocument: Equatable, Sendable {
    public var fontFamily: String?
    public var fontSize: Int?
    public var fontStyle: Int? // Java Font style (PLAIN=0, BOLD=1, ITALIC=2, ...)

    /// Diagramm-Titel (`caption`-Attribut im XML / .visustruct).
    public var caption: String

    /// Root-Liste (enthält `<strelem>` als Kinder des Root-Tags).
    public var elements: [VisuStructElement]

    /// Nicht im XML gespeichert: erhöhen, wenn ein `replace` inhaltlich identisch bleibt (z. B. Anweisung auf ø), damit SwiftUI den Zustand dennoch aktualisiert.
    public var uiGeneration: UInt = 0

    public init(
        fontFamily: String? = nil,
        fontSize: Int? = nil,
        fontStyle: Int? = nil,
        caption: String = "",
        elements: [VisuStructElement] = [],
        uiGeneration: UInt = 0
    ) {
        self.fontFamily = fontFamily
        self.fontSize = fontSize
        self.fontStyle = fontStyle
        self.caption = caption
        self.elements = elements
        self.uiGeneration = uiGeneration
    }
}

