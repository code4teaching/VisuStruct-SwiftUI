import Foundation

public struct VisuStructRect: Equatable, Sendable, Codable {
    public var x: Double
    public var y: Double
    public var width: Double
    public var height: Double

    public init(x: Double, y: Double, width: Double, height: Double) {
        self.x = x
        self.y = y
        self.width = width
        self.height = height
    }
}

/// Layout-Ergebnis für Rendering/Hit-Testing.
public struct VisuStructLayout: Equatable, Sendable {
    public struct CanvasSize: Equatable, Sendable, Codable {
        public var width: Double
        public var height: Double

        public init(width: Double, height: Double) {
            self.width = width
            self.height = height
        }
    }

    public var canvasSize: CanvasSize
    public var elements: [Node]

    public init(canvasSize: CanvasSize, elements: [Node]) {
        self.canvasSize = canvasSize
        self.elements = elements
    }

    public struct Node: Equatable, Sendable {
        public var idPath: [Int]              // stabiler Pfad im Baum (für Auswahl)
        public var element: VisuStructElement // Originaldaten
        public var frame: VisuStructRect

        /// Höhe des Kopfbands wie beim Layout (Verzweigung/Fallauswahl: Trennung zu Spalteninhalten). Muss mit `DiagramCanvasView` übereinstimmen.
        public var headerBandHeight: Double

        /// Für spezielle Zeichnung (Fallauswahl/Verzweigung).
        public var caseColumnFrames: [VisuStructRect] = []
        public var dividerX: Double? = nil   // xVerschiebungFuerTrennlinie (Verzweigung/Fallauswahl)
        public var dividerYInset: Double? = nil // yVerschiebungFuerTrennLinie (Fallauswahl)

        /// Fallauswahl/Verzweigung: Kinder pro Spalte (für Streckung gleicher Elternbreite).
        public var columns: [[Node]]? = nil

        public var children: [Node] = []

        public init(idPath: [Int], element: VisuStructElement, frame: VisuStructRect, headerBandHeight: Double = 0) {
            self.idPath = idPath
            self.element = element
            self.frame = frame
            self.headerBandHeight = headerBandHeight
        }
    }
}
