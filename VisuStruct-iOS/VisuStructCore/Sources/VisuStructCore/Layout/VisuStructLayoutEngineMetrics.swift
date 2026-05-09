import Foundation

extension VisuStructLayoutEngine {
    public struct Metrics: Sendable {
        public var fontSize: Double
        public var lineHeight: Double
        public var charWidth: Double

        public var baseHeaderExtra: Double // entspricht grob `obererRandZusatz`
        public var minSidePadding: Double
        /// Entspricht `DiagramCanvasInk.cellTextInsetY` — oberer Innenrand für einzeilige Kopftexte; wird mit Diagramm-Zoom skaliert.
        public var cellTextInsetY: Double
        /// Abstand **Schleifen-Oberkante** → Text „do“ (klein, näher am blauen Rand als `cellTextInsetY`); nur für die Do-Until-Beschriftung.
        public var doUntilDoLabelTopInset: Double

        /// Abstand Trennlinie → erster Fußtext („while …“); mit Diagramm-Zoom skaliert.
        public var doUntilFooterTopInset: Double
        /// Unterer Innenrand unter „while …“ — kleiner als `cellTextInsetY`, damit der Fußstreifen nicht wie „zu viel Luft nach unten“ wirkt (vergleichbar mit Zeilen-Oberrand bei einzeiligen Zellen ~14).
        public var doUntilFooterBottomInset: Double
        public init(
            fontSize: Double = 15,
            lineHeight: Double = 20,
            charWidth: Double = 7,
            baseHeaderExtra: Double = 20,
            minSidePadding: Double = 42,
            cellTextInsetY: Double = 15,
            doUntilDoLabelTopInset: Double = 2,
            doUntilFooterTopInset: Double = 6,
            doUntilFooterBottomInset: Double = 8
        ) {
            self.fontSize = fontSize
            self.lineHeight = lineHeight
            self.charWidth = charWidth
            self.baseHeaderExtra = baseHeaderExtra
            self.minSidePadding = minSidePadding
            self.cellTextInsetY = cellTextInsetY
            self.doUntilDoLabelTopInset = doUntilDoLabelTopInset
            self.doUntilFooterTopInset = doUntilFooterTopInset
            self.doUntilFooterBottomInset = doUntilFooterBottomInset
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
            minSidePadding: minSidePadding * factor,
            cellTextInsetY: cellTextInsetY * factor,
            doUntilDoLabelTopInset: doUntilDoLabelTopInset * factor,
            doUntilFooterTopInset: doUntilFooterTopInset * factor,
            doUntilFooterBottomInset: doUntilFooterBottomInset * factor
        )
    }
}
