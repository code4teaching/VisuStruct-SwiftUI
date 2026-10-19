import SwiftUI
import VisuStructCore

/// Simulationsmodus: Diagramm (nur Anzeige) und Zustands-Panel; quer nebeneinander, hochkant untereinander.
struct SimulationDetailView<Canvas: View>: View {
    @Bindable var simulation: SimulationController
    @Binding var highlightModeRaw: String
    @ViewBuilder let canvas: Canvas

    var body: some View {
        GeometryReader { geo in
            // Seitenspalte nur im Querformat; hochkant wäre sie gequetscht und unter dem Diagramm bliebe Platz frei.
            let useColumns = geo.size.width >= 760 && geo.size.width > geo.size.height
            // iPad hochkant: Diagramm oben, Steuerfeld darunter über die volle Breite.
            let useWideStack = !useColumns && geo.size.width >= 600 && geo.size.height >= 700
            let panelWidth = min(max(geo.size.width * 0.32, 280), 360)

            if useColumns {
                HStack(alignment: .top, spacing: 16) {
                    canvas
                        .layoutPriority(1)
                    SimulationStatePanel(
                        engine: simulation.engine,
                        isPlaying: simulation.isPlaying,
                        inputText: $simulation.inputText,
                        highlightModeRaw: $highlightModeRaw,
                        onPlay: { simulation.play() },
                        onPause: { simulation.pause() },
                        onStep: { simulation.step() },
                        onSubmitInput: { simulation.submitInput() },
                        onStop: { simulation.reset() }
                    )
                        .frame(width: panelWidth)
                        .frame(maxHeight: .infinity, alignment: .top)
                }
            } else if useWideStack {
                VStack(alignment: .leading, spacing: 16) {
                    canvas
                        .frame(height: geo.size.height * 0.5)
                    SimulationStatePanel(
                        engine: simulation.engine,
                        isPlaying: simulation.isPlaying,
                        inputText: $simulation.inputText,
                        highlightModeRaw: $highlightModeRaw,
                        onPlay: { simulation.play() },
                        onPause: { simulation.pause() },
                        onStep: { simulation.step() },
                        onSubmitInput: { simulation.submitInput() },
                        onStop: { simulation.reset() },
                        usesWideLayout: true
                    )
                    .frame(maxHeight: .infinity)
                }
            } else {
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        canvas
                            .frame(height: max(340, geo.size.height * 0.55))
                        SimulationStatePanel(
                            engine: simulation.engine,
                            isPlaying: simulation.isPlaying,
                            inputText: $simulation.inputText,
                            highlightModeRaw: $highlightModeRaw,
                            onPlay: { simulation.play() },
                            onPause: { simulation.pause() },
                            onStep: { simulation.step() },
                            onSubmitInput: { simulation.submitInput() },
                            onStop: { simulation.reset() }
                        )
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
            }
        }
    }
}
