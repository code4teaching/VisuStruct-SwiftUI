import Foundation

#if canImport(UIKit)
import UIKit
#endif
#if canImport(AppKit) && !canImport(UIKit)
import AppKit
#endif

/// Breitenmessung für Layout — gleiche System-Schrift (.medium) wie `DiagramCanvasView` (`cellFont`).
enum VisuStructLayoutTextMeasurement: Sendable {
    /// Maximale Zeilenbreite in Punkt (aufgerundet).
    static func maxLineWidth(lines: [String], fontSize: CGFloat) -> Double {
        guard !lines.isEmpty else { return 0 }
        return lines.map { lineWidth($0, fontSize: fontSize) }.max() ?? 0
    }

    static func lineWidth(_ text: String, fontSize: CGFloat) -> Double {
        #if canImport(UIKit)
        let font = UIFont.systemFont(ofSize: fontSize, weight: .medium)
        let w = (text as NSString).size(withAttributes: [.font: font]).width
        return Double(ceil(w))
        #elseif canImport(AppKit)
        let font = NSFont.systemFont(ofSize: fontSize, weight: .medium)
        let w = (text as NSString).size(withAttributes: [.font: font]).width
        return Double(ceil(w))
        #else
        return Double(text.count) * Double(fontSize) * 0.62
        #endif
    }
}

/// Eine Anzeigezeile für `forSchleife` im Struktogramm: Init, Bedingung, Schritt nebeneinander wie `for (a; b; c)` — getrennt mit `; `.
public enum VisuStructForLoopDiagramDisplay: Sendable {
    public static func singleLine(from textLines: [String]) -> String {
        var parts = textLines
        while parts.count < 3 { parts.append("") }
        if parts.count > 3 { parts = Array(parts.prefix(3)) }
        return parts
            .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
            .joined(separator: "; ")
    }
}
