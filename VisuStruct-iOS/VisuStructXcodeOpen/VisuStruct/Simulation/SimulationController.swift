import SwiftUI
import Observation
import VisuStructCore

/// Simulationsmodus: Engine, Abspielen/Pause, Eingabe. Die Markierung des aktuellen Schritts ist die Auswahl im aktuellen Reiter.
@MainActor
@Observable
final class SimulationController {
    private(set) var isActive = false
    private(set) var engine: VisuStructSimulationEngine
    private(set) var isPlaying = false
    var inputText = ""

    @ObservationIgnored private var playTask: Task<Void, Never>? = nil
    @ObservationIgnored private var wasPlayingBeforeInput = false
    @ObservationIgnored private let tabsModel: DiagramSheetTabsModel

    init(tabsModel: DiagramSheetTabsModel) {
        self.tabsModel = tabsModel
        self.engine = VisuStructSimulationEngine(document: tabsModel.currentTab.document)
    }

    /// Die anderen offenen Reiter, nach Titel und Diagrammtitel, damit ein Aufruf wie `zeigeTitel()` sie findet.
    private var subprograms: [String: VisuStructDocument] {
        var result: [String: VisuStructDocument] = [:]
        for (index, tab) in tabsModel.tabs.enumerated() where index != tabsModel.currentTabIndex {
            for name in [tab.document.caption, tab.title] {
                let key = VisuStructSimulationEngine.subprogramKey(name)
                if !key.isEmpty, result[key] == nil { result[key] = tab.document }
            }
        }
        return result
    }

    /// Wie `@AppStorage` in den Einstellungen; bei jedem Schritt neu gelesen, damit Änderungen während des Abspielens greifen.
    private var stepDelay: SimulationStepDelayOption {
        SimulationStepDelayOption.fromStored(
            UserDefaults.standard.string(forKey: SimulationStepDelayOption.appStorageKey) ?? SimulationStepDelayOption.defaultRawValue
        )
    }

    private var highlightMode: SimulationHighlightMode {
        SimulationHighlightMode.fromStored(
            UserDefaults.standard.string(forKey: SimulationHighlightMode.appStorageKey) ?? SimulationHighlightMode.defaultRawValue
        )
    }

    private func select(_ path: [Int]?) {
        tabsModel.updateCurrentTab { $0.selectedPath = path }
    }

    // MARK: - Modus

    func begin() {
        pause()
        restartEngine()
        withAnimation(.easeInOut(duration: 0.18)) {
            isActive = true
        }
    }

    func end() {
        pause()
        withAnimation(.easeInOut(duration: 0.18)) {
            isActive = false
        }
        let tab = tabsModel.currentTab
        if tab.selectedPath == nil, !tab.document.elements.isEmpty {
            select([0])
        }
    }

    // MARK: - Steuerung

    func step() {
        guard engine.canStep else {
            pause()
            return
        }
        let wasPlaying = isPlaying
        let lastExecutedPath = engine.currentStepPath
        var next = engine
        next.step()
        engine = next
        if highlightMode == .nextToExecute, next.canStep {
            select(next.currentStepPath)
        } else {
            // lastExecuted (oder Ende/Input): letztes ausgeführtes Element bleibt markiert.
            select(lastExecutedPath ?? next.currentStepPath)
        }
        // Wenn ein Input als Ergebnis des Steps angefordert wurde, Play pausieren,
        // aber merken, dass wir nach OK automatisch weiterlaufen sollen.
        if next.state.inputRequest != nil, wasPlaying {
            wasPlayingBeforeInput = true
        }
        if !next.canStep {
            pause()
        }
    }

    func reset() {
        pause()
        restartEngine()
    }

    func submitInput() {
        let shouldResume = isPlaying || wasPlayingBeforeInput
        pause()
        var next = engine
        next.provideInput(inputText)
        engine = next
        if next.state.inputRequest == nil {
            inputText = ""
        }
        select(next.currentStepPath)

        if shouldResume, isActive, next.canStep {
            wasPlayingBeforeInput = false
            play()
        }
    }

    func play() {
        guard !isPlaying, engine.canStep else { return }
        isPlaying = true
        playTask?.cancel()
        playTask = Task { @MainActor in
            while !Task.isCancelled && isActive && engine.canStep {
                step()
                guard !Task.isCancelled, isActive, engine.canStep else { break }
                try? await Task.sleep(nanoseconds: stepDelay.nanoseconds)
            }
            if !Task.isCancelled {
                isPlaying = false
                playTask = nil
            }
        }
    }

    func pause() {
        playTask?.cancel()
        playTask = nil
        isPlaying = false
    }

    /// Neue Engine für das aktuelle Dokument, Markierung auf den ersten Schritt.
    private func restartEngine() {
        var fresh = VisuStructSimulationEngine(document: tabsModel.currentTab.document, subprograms: subprograms)
        fresh.reset()
        engine = fresh
        inputText = ""
        select(fresh.currentStepPath)
    }
}
