import SwiftUI
#if canImport(GameController)
import GameController
#endif
#if canImport(UIKit)
import UIKit
#endif

/// Gemeinsame Fokus-Markierung für Diagrammtitel, Inspector-Felder und Zeileneditor.
enum DiagramEditorFocusTarget: Hashable {
    case caption
    case caseLabel
    case textEditor
    /// Zählschleife: drei Kopf-Felder (Start / Bedingung / Schritt).
    case forLoopPart(Int)
}

/// Ob der Inspector nach einer Zeilenauswahl automatisch den Cursor bekommt.
///
/// Auf dem iPhone nie (zu wenig Platz). Auf dem Mac (Designed for iPad) immer.
/// Auf dem iPad nur, wenn eine Hardware-Tastatur verbunden ist — sonst würde die
/// Software-Tastatur das Diagramm verdecken.
enum DiagramInspectorAutoFocus {
    static var shouldFocusOnSelection: Bool {
        if ProcessInfo.processInfo.isiOSAppOnMac {
            return true
        }
        #if canImport(UIKit)
        switch UIDevice.current.userInterfaceIdiom {
        case .phone:
            return false
        case .pad:
            #if canImport(GameController)
            return GCKeyboard.coalesced != nil
            #else
            return false
            #endif
        default:
            return false
        }
        #else
        return false
        #endif
    }
}
