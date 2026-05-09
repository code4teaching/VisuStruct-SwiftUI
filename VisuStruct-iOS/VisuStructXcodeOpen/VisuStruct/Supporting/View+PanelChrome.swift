import SwiftUI

// MARK: - Simulation UI helpers

extension View {
    func disabledAndDimmed(_ disabled: Bool, opacity: Double = 0.55) -> some View {
        self.disabled(disabled).opacity(disabled ? opacity : 1.0)
    }
}

// MARK: - Code-Generator (Oberfläche; IAP folgt)

extension View {
    /// Schwebendes Panel: kein Sheet-Ziehharmonika-Indikator; Vollbild-Sheet auf dem iPhone: Indikator wie bisher.
    @ViewBuilder
    func codeGeneratorPresentationChrome(isFloatingPanel: Bool) -> some View {
        if isFloatingPanel {
            self
        } else {
            self.presentationDragIndicator(.visible)
        }
    }
}
