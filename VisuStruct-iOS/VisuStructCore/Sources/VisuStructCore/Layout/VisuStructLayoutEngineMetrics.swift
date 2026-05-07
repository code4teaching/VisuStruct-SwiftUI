import Foundation

extension VisuStructLayoutEngine {
    public struct Metrics: Sendable {
        public var fontSize: Double
        public var lineHeight: Double
        public var charWidth: Double

        public var baseHeaderExtra: Double // entspricht grob `obererRandZusatz`
        public var minSidePadding: Double

        public init(
            fontSize: Double = 15,
            lineHeight: Double = 20,
            charWidth: Double = 7,
            baseHeaderExtra: Double = 20,
            minSidePadding: Double = 42
        ) {
            self.fontSize = fontSize
            self.lineHeight = lineHeight
            self.charWidth = charWidth
            self.baseHeaderExtra = baseHeaderExtra
            self.minSidePadding = minSidePadding
        }
    }

    /// Gleiche Typometrie wie in der iOS-`DiagramCanvasView` (Export/Druck und Editor nutzen dieselben Werte).
    public static func diagramDisplayMetrics(isRegularWidth: Bool) -> Metrics {
        let dF: Double = 2
        /// Etwas großzügigere Zeilenabstände im Diagramm (sichtbar + Layout konsistent).
        let dLH: Double = 5
        if isRegularWidth {
            let fontSize = 12 + dF
            let lineHeight = 16 + dLH
            return Metrics(
                fontSize: fontSize,
                lineHeight: lineHeight,
                charWidth: 5.5 * (fontSize / 12),
                baseHeaderExtra: 16 + dLH,
                minSidePadding: 40
            )
        }
        let b = Metrics()
        let fontSize = b.fontSize + dF
        let lineHeight = b.lineHeight + dLH
        return Metrics(
            fontSize: fontSize,
            lineHeight: lineHeight,
            charWidth: b.charWidth * (fontSize / b.fontSize),
            baseHeaderExtra: b.baseHeaderExtra + 2,
            minSidePadding: b.minSidePadding + 8
        )
    }
}

extension VisuStructLayoutEngine.Metrics {
    /// Einheitliche Skalierung für größere/kleinere Diagramm-Darstellung.
    public func scaled(by factor: Double) -> Self {
        guard factor > 0, abs(factor - 1) > 1e-6 else { return self }
        return Self(
            fontSize: fontSize * factor,
            lineHeight: lineHeight * factor,
            charWidth: charWidth * factor,
            baseHeaderExtra: baseHeaderExtra * factor,
            minSidePadding: minSidePadding * factor
        )
    }
}
