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

struct DiagramFileActions {
    var canNew: Bool
    var canOpen: Bool
    var canSave: Bool
    var canSaveAs: Bool
    var canPrint: Bool
    var canClose: Bool

    var newDocument: () -> Void
    var open: () -> Void
    var save: () -> Void
    var saveAs: () -> Void
    var print: () -> Void
    var close: () -> Void
}

private struct DiagramEditActionsKey: FocusedValueKey {
    typealias Value = DiagramEditActions
}

private struct DiagramFileActionsKey: FocusedValueKey {
    typealias Value = DiagramFileActions
}

extension FocusedValues {
    var diagramEditActions: DiagramEditActions? {
        get { self[DiagramEditActionsKey.self] }
        set { self[DiagramEditActionsKey.self] = newValue }
    }

    var diagramFileActions: DiagramFileActions? {
        get { self[DiagramFileActionsKey.self] }
        set { self[DiagramFileActionsKey.self] = newValue }
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
        .commands {
            VisuStructCommands()
        }
    }
}

/// Menüleiste / Tastatur: gilt auch für die iPad-App auf dem Mac (`os(macOS)` wäre dort falsch).
/// `.delete` gibt es nur auf macOS, daher Löschen hinter `.pasteboard`.
private struct VisuStructCommands: Commands {
    @FocusedValue(\.diagramEditActions) private var editActions
    @FocusedValue(\.diagramFileActions) private var fileActions
    @AppStorage(AppLanguage.storageKey) private var languageCode: String = AppLanguage.english.rawValue

    private var lang: AppLanguage {
        AppLanguage(rawValue: languageCode) ?? .english
    }

    var body: some Commands {
        CommandGroup(replacing: .newItem) {
            Button(lang.tr("menu_new")) {
                fileActions?.newDocument()
            }
            .keyboardShortcut("n", modifiers: .command)
            .disabled(!(fileActions?.canNew ?? false))
            Button(lang.tr("menu_open")) {
                fileActions?.open()
            }
            .keyboardShortcut("o", modifiers: .command)
            .disabled(!(fileActions?.canOpen ?? false))
        }
        CommandGroup(replacing: .saveItem) {
            Button(lang.tr("menu_save")) {
                fileActions?.save()
            }
            .keyboardShortcut("s", modifiers: .command)
            .disabled(!(fileActions?.canSave ?? false))
            Button(lang.tr("menu_save_as")) {
                fileActions?.saveAs()
            }
            .keyboardShortcut("s", modifiers: [.command, .shift])
            .disabled(!(fileActions?.canSaveAs ?? false))
            Divider()
            Button(lang.tr("menu_print")) {
                fileActions?.print()
            }
            .keyboardShortcut("p", modifiers: .command)
            .disabled(!(fileActions?.canPrint ?? false))
            Divider()
            Button(lang.tr("menu_close")) {
                fileActions?.close()
            }
            .keyboardShortcut("w", modifiers: .command)
            .disabled(!(fileActions?.canClose ?? false))
        }
        CommandGroup(replacing: .undoRedo) {
            Button(lang.tr("toolbar_undo")) {
                editActions?.undo()
            }
            .keyboardShortcut("z", modifiers: .command)
            .disabled(!(editActions?.canUndo ?? false))
            Button(lang.tr("toolbar_redo")) {
                editActions?.redo()
            }
            .keyboardShortcut("z", modifiers: [.command, .shift])
            .disabled(!(editActions?.canRedo ?? false))
        }
        CommandGroup(replacing: .pasteboard) {
            Button(lang.tr("ctx_copy")) {
                editActions?.copy()
            }
            .keyboardShortcut("c", modifiers: .command)
            .disabled(!(editActions?.canCopy ?? false))
            Button(lang.tr("ctx_cut")) {
                editActions?.cut()
            }
            .keyboardShortcut("x", modifiers: .command)
            .disabled(!(editActions?.canCut ?? false))
            Button(lang.tr("ctx_paste")) {
                editActions?.paste()
            }
            .keyboardShortcut("v", modifiers: .command)
            .disabled(!(editActions?.canPaste ?? false))
        }
        CommandGroup(after: .pasteboard) {
            Button(lang.tr("action_delete_selection")) {
                editActions?.delete()
            }
            .keyboardShortcut(.delete, modifiers: [])
            .disabled(!(editActions?.canDelete ?? false))
        }
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
