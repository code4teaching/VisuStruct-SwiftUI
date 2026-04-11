import Foundation

/// iOS-/Swift-Abbild der Java Typnummern in `Struktogramm` (typAnweisung..typLeerElement).
public enum VisuStructElementType: Int, Codable, Sendable {
    case anweisung = 0
    case verzweigung = 1
    case fallauswahl = 2
    case forSchleife = 3
    case whileSchleife = 4
    case doUntilSchleife = 5
    case endlosschleife = 6
    case aussprung = 7
    case aufruf = 8
    case leerElement = 9
}

public struct VisuStructRGBA: Equatable, Sendable, Codable {
    public var r: UInt8
    public var g: UInt8
    public var b: UInt8
    public var a: UInt8

    public init(r: UInt8, g: UInt8, b: UInt8, a: UInt8 = 255) {
        self.r = r
        self.g = g
        self.b = b
        self.a = a
    }
}

/// Ein `<strelem>` inkl. Unterstrukturen:
/// - Schleifen: `<schleifeninhalt><strelem .../></schleifeninhalt>`
/// - Fallauswahl/Verzweigung: mehrere `<fall fallname="..."> ... </fall>`
public struct VisuStructElement: Equatable, Sendable {
    public var type: VisuStructElementType

    /// Entspricht Java `xVergroesserung`/`yVergroesserung` (`zx`/`zy` Attribute).
    public var zoomX: Int
    public var zoomY: Int

    /// Optional: explizite Farben aus XML (`textcolor`, `bgcolor` Attribute).
    public var textColor: VisuStructRGBA?
    public var backgroundColor: VisuStructRGBA?

    /// Entspricht den `<text>`-Kindern (Java speichert jede Zeile codiert).
    public var textLines: [String]

    /// Schleifen-Unterliste (nur für Schleifen-Typen gesetzt).
    public var loopBody: [VisuStructElement]?

    /// Fälle (nur für Fallauswahl/Verzweigung gesetzt). Letzter Fall ist i. d. R. „default“.
    public var cases: [VisuStructCase]?

    public init(
        type: VisuStructElementType,
        zoomX: Int = 0,
        zoomY: Int = 0,
        textColor: VisuStructRGBA? = nil,
        backgroundColor: VisuStructRGBA? = nil,
        textLines: [String] = [""],
        loopBody: [VisuStructElement]? = nil,
        cases: [VisuStructCase]? = nil
    ) {
        self.type = type
        self.zoomX = zoomX
        self.zoomY = zoomY
        self.textColor = textColor
        self.backgroundColor = backgroundColor
        self.textLines = textLines
        self.loopBody = loopBody
        self.cases = cases
    }
}

public struct VisuStructCase: Equatable, Sendable {
    /// Entspricht `fallname` (Java: `encodeS(list.beschreibung)`).
    public var name: String
    public var elements: [VisuStructElement]

    public init(name: String, elements: [VisuStructElement]) {
        self.name = name
        self.elements = elements
    }
}

