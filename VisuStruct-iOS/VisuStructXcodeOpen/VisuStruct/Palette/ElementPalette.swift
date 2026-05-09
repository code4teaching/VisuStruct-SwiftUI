import SwiftUI
import VisuStructCore
#if canImport(UIKit)
import UIKit
#endif

// MARK: - Palette list chrome

/// Optik wie eine abgerundete Schaltfläche (Tipp + Drag aus der Liste).
struct PaletteListElementButtonStyle: ButtonStyle {
    enum Emphasis {
        case normal
        case destructive
    }

    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    var emphasis: Emphasis = .normal

    func makeBody(configuration: Configuration) -> some View {
        let isCompact = horizontalSizeClass != .regular
        let vPad: CGFloat = isCompact ? 5 : 10
        let hPad: CGFloat = isCompact ? 8 : 12
        let radius: CGFloat = isCompact ? 8 : 10
        let baseStrokeOpacity = configuration.isPressed ? 0.14 : 0.10
        let borderColor: Color = emphasis == .destructive
            ? Color.red.opacity(baseStrokeOpacity + 0.55)
            : Color.primary.opacity(baseStrokeOpacity)
        return configuration.label
            .font(isCompact ? .callout : .body)
            .imageScale(isCompact ? .small : .medium)
            .foregroundStyle(emphasis == .destructive ? Color.red : Color.primary)
            .padding(.vertical, vPad)
            .padding(.horizontal, hPad)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background {
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .fill(configuration.isPressed ? Color(.quaternarySystemFill) : Color(.tertiarySystemFill))
            }
            .overlay {
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .strokeBorder(borderColor, lineWidth: 1)
            }
    }
}

// MARK: - Palette

enum ElementPalette {
    private static func stubAnweisung() -> VisuStructElement {
        VisuStructElement(type: .anweisung, textLines: ["ø"])
    }

    /// Neues Element aus der Palette — **Texte im Diagramm** folgen `lang` (XML: Verzweigung weiter `true`/`false`/`default` wie Java).
    static func element(for kind: PaletteItem, lang: AppLanguage) -> VisuStructElement {
        switch kind {
        case .anweisung:
            return VisuStructElement(type: .anweisung, textLines: [""])
        case .verzweigung:
            let stub = stubAnweisung()
            return VisuStructElement(type: .verzweigung, textLines: [""], cases: [
                VisuStructCase(name: "true", elements: [stub]),
                VisuStructCase(name: "false", elements: [stub])
            ])
        case .fallauswahl:
            let stub = stubAnweisung()
            return VisuStructElement(type: .fallauswahl, textLines: [""], cases: [
                VisuStructCase(name: "1", elements: [stub]),
                VisuStructCase(name: "2", elements: [stub]),
                VisuStructCase(name: "default", elements: [stub])
            ])
        case .forZaehlSchleife:
            return VisuStructElement(type: .forSchleife, textLines: ["", "", ""], loopBody: [stubAnweisung()])
        case .whileSchleife:
            return VisuStructElement(type: .whileSchleife, textLines: [""], loopBody: [stubAnweisung()])
        case .doUntilSchleife:
            return VisuStructElement(type: .doUntilSchleife, textLines: [""], loopBody: [stubAnweisung()])
        case .endlosschleife:
            return VisuStructElement(type: .endlosschleife, textLines: [""], loopBody: [stubAnweisung()])
        case .aussprung:
            return VisuStructElement(type: .aussprung, textLines: [""])
        case .aufruf:
            return VisuStructElement(type: .aufruf, textLines: [""])
        }
    }

    enum PaletteItem: String, Identifiable {
        case anweisung, verzweigung, whileSchleife, doUntilSchleife, forZaehlSchleife, fallauswahl, endlosschleife, aussprung, aufruf

        var id: String { rawValue }

        static let paletteOrder: [PaletteItem] = [
            .anweisung, .verzweigung, .whileSchleife, .doUntilSchleife, .forZaehlSchleife,
            .fallauswahl, .endlosschleife, .aussprung, .aufruf
        ]

        func localizedTitle(in lang: AppLanguage) -> String {
            switch self {
            case .anweisung: return lang.tr("element_anweisung")
            case .verzweigung: return lang.tr("element_verzweigung")
            case .whileSchleife: return lang.tr("element_whileSchleife")
            case .doUntilSchleife: return lang.tr("element_doUntilSchleife")
            case .forZaehlSchleife: return lang.tr("element_forSchleife")
            case .fallauswahl: return lang.tr("element_fallauswahl")
            case .endlosschleife: return lang.tr("element_endlosschleife")
            case .aussprung: return lang.tr("element_aussprung")
            case .aufruf: return lang.tr("element_aufruf")
            }
        }

        var symbolName: String {
            switch self {
            case .anweisung: return "square.fill"
            case .verzweigung: return "arrow.triangle.branch"
            case .whileSchleife: return "arrow.triangle.2.circlepath"
            case .doUntilSchleife: return "arrow.uturn.down.circle"
            case .forZaehlSchleife: return "repeat"
            case .fallauswahl: return "list.bullet.indent"
            case .endlosschleife: return "infinity"
            case .aussprung: return "arrow.turn.down.left"
            case .aufruf: return "arrow.right.to.line.compact"
            }
        }
    }

    static func paletteDragIdentifier(_ item: PaletteItem) -> String { "pal:\(item.rawValue)" }

    static func moveDragIdentifier(path: [Int]) -> String {
        "mov:" + path.map(String.init).joined(separator: ",")
    }
}

#if canImport(UIKit)
struct ActivityShareSheet: UIViewControllerRepresentable {
    let items: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }

    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

/// Damit das Share-Sheet immer ein gültiges `UIImage` hat (kein leeres Sheet durch abweichenden State-Zyklus).
struct PNGSharePayload: Identifiable {
    let id = UUID()
    let image: UIImage
}

/// Temporäre Datei (.visustruct oder PDF) fürs System-Teilen.
struct FileURLSharePayload: Identifiable {
    let id = UUID()
    let url: URL
}
#endif
