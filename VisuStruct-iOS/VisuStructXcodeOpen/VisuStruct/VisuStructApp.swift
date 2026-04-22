import SwiftUI

struct DiagramEditActions {
    var canUndo: Bool
    var canRedo: Bool
    var canCopy: Bool
    var canCut: Bool
    var canPaste: Bool
    var canDelete: Bool

    var undo: () -> Void
    var redo: () -> Void
    var copy: () -> Void
    var cut: () -> Void
    var paste: () -> Void
    var delete: () -> Void
}

private struct DiagramEditActionsKey: FocusedValueKey {
    typealias Value = DiagramEditActions
}

extension FocusedValues {
    var diagramEditActions: DiagramEditActions? {
        get { self[DiagramEditActionsKey.self] }
        set { self[DiagramEditActionsKey.self] = newValue }
    }
}

@main
struct VisuStructApp: App {
    init() {
        UserDefaults.standard.register(defaults: [
            "visustruct.ui.scale.canvas": "small",
            "visustruct.ui.scale.inspector": "small",
            "visustruct.export.filenameStyle": "dateTitle",
            "visustruct.codegen.includeEmptyElse": true,
            "visustruct.codegen.includeDiagramComments": false
        ])
    }

    // Hinweis: Kein `UITextField.appearance().smartQuotesType` / `UITextView.appearance()` hier —
    // unter SwiftUI kann das zu Laufzeitfehlern führen („setSmartQuotesType: … off the main thread“ / UIKit-Assertion).
    // Gerade Anführungszeichen im Diagramm erreichen wir mit `Text(verbatim:)` im Canvas; Eingaben ggf. Systemeinstellung.

    var body: some Scene {
        WindowGroup {
            AppRootView()
        }
        #if os(macOS)
        .commands {
            CommandGroup(replacing: .undoRedo) {
                Button("Undo") { focused(\.diagramEditActions)?.undo() }
                    .keyboardShortcut("z", modifiers: .command)
                    .disabled(!(focused(\.diagramEditActions)?.canUndo ?? false))
                Button("Redo") { focused(\.diagramEditActions)?.redo() }
                    .keyboardShortcut("z", modifiers: [.command, .shift])
                    .disabled(!(focused(\.diagramEditActions)?.canRedo ?? false))
            }
            CommandGroup(replacing: .pasteboard) {
                Button("Copy") { focused(\.diagramEditActions)?.copy() }
                    .keyboardShortcut("c", modifiers: .command)
                    .disabled(!(focused(\.diagramEditActions)?.canCopy ?? false))
                Button("Cut") { focused(\.diagramEditActions)?.cut() }
                    .keyboardShortcut("x", modifiers: .command)
                    .disabled(!(focused(\.diagramEditActions)?.canCut ?? false))
                Button("Paste") { focused(\.diagramEditActions)?.paste() }
                    .keyboardShortcut("v", modifiers: .command)
                    .disabled(!(focused(\.diagramEditActions)?.canPaste ?? false))
            }
            CommandGroup(replacing: .delete) {
                Button("Delete") { focused(\.diagramEditActions)?.delete() }
                    .keyboardShortcut(.delete, modifiers: [])
                    .disabled(!(focused(\.diagramEditActions)?.canDelete ?? false))
            }
        }
        #endif
    }
}

/// Synchronisiert `UserDefaults` mit den iOS-**Systemeinstellungen** (VisuStruct), sobald die App wieder aktiv wird.
private struct AppRootView: View {
    @AppStorage(AppLanguage.storageKey) private var languageCode: String = AppLanguage.english.rawValue
    @AppStorage(VisuStructUIScaleStep.appStorageKeyCanvas) private var scaleCanvas: String = VisuStructUIScaleStep.small.rawValue
    @AppStorage(VisuStructUIScaleStep.appStorageKeyInspector) private var scaleInspector: String = VisuStructUIScaleStep.small.rawValue
    @AppStorage("visustruct.export.filenameStyle") private var exportFilenameStyle: String = "dateTitle"
    @AppStorage("visustruct.codegen.includeEmptyElse") private var codegenEmptyElse = true
    @AppStorage("visustruct.codegen.includeDiagramComments") private var codegenDiagramComments = false
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        ContentView()
            .environment(\.appLanguage, AppLanguage(rawValue: languageCode) ?? .english)
            .onChange(of: scenePhase) { _, phase in
                guard phase == .active else { return }
                let lang = UserDefaults.standard.string(forKey: AppLanguage.storageKey) ?? AppLanguage.english.rawValue
                if lang != languageCode { languageCode = lang }
                let c = UserDefaults.standard.string(forKey: VisuStructUIScaleStep.appStorageKeyCanvas) ?? VisuStructUIScaleStep.small.rawValue
                if c != scaleCanvas { scaleCanvas = c }
                let i = UserDefaults.standard.string(forKey: VisuStructUIScaleStep.appStorageKeyInspector) ?? VisuStructUIScaleStep.small.rawValue
                if i != scaleInspector { scaleInspector = i }
                let e = UserDefaults.standard.string(forKey: "visustruct.export.filenameStyle") ?? "dateTitle"
                if e != exportFilenameStyle { exportFilenameStyle = e }
                let el = UserDefaults.standard.object(forKey: "visustruct.codegen.includeEmptyElse") as? Bool ?? true
                if el != codegenEmptyElse { codegenEmptyElse = el }
                let dc = UserDefaults.standard.object(forKey: "visustruct.codegen.includeDiagramComments") as? Bool ?? false
                if dc != codegenDiagramComments { codegenDiagramComments = dc }
            }
    }
}
