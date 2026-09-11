import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

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
    var printDocument: () -> Void
    var close: () -> Void

    var recentFiles: [RecentVisuStructFile]
    var openRecent: (RecentVisuStructFile) -> Void
    var clearRecent: () -> Void
}

enum DiagramMenuNotification {
    static let newDocument = Notification.Name("visustruct.menu.newDocument")
    static let open = Notification.Name("visustruct.menu.open")
    static let save = Notification.Name("visustruct.menu.save")
    static let saveAs = Notification.Name("visustruct.menu.saveAs")
    static let printDocument = Notification.Name("visustruct.menu.print")
    static let close = Notification.Name("visustruct.menu.close")
    static let openRecent = Notification.Name("visustruct.menu.openRecent")

    static let recentFileIDKey = "id"
}

/// Menüleiste: nicht über `FocusedValue`. Commands halten dort oft eine leere Kopie,
/// sodass Ablage → Öffnen ausgegraut bleibt. Dateibefehle gehen per Notification
/// an den Editor; Freigaben kommen aus diesem Store.
@MainActor
final class DiagramCommandCenter: ObservableObject {
    static let shared = DiagramCommandCenter()

    /// Dateibefehle sind ab Start aktiv (Editor-Modus). Die Simulation stellt sie auf `false`.
    @Published private(set) var canNew = true
    @Published private(set) var canOpen = true
    @Published private(set) var canSave = true
    @Published private(set) var canSaveAs = true
    @Published private(set) var canPrint = true
    @Published private(set) var canClose = false
    @Published private(set) var canUndo = false
    @Published private(set) var canRedo = false
    @Published private(set) var canCopy = false
    @Published private(set) var canCut = false
    @Published private(set) var canPaste = false
    @Published private(set) var canDelete = false

    private var editActions: DiagramEditActions?

    private init() {}

    func update(file: DiagramFileActions, edit: DiagramEditActions) {
        editActions = edit

        let fileFlags = (file.canNew, file.canOpen, file.canSave, file.canSaveAs, file.canPrint, file.canClose)
        if (canNew, canOpen, canSave, canSaveAs, canPrint, canClose) != fileFlags {
            canNew = file.canNew
            canOpen = file.canOpen
            canSave = file.canSave
            canSaveAs = file.canSaveAs
            canPrint = file.canPrint
            canClose = file.canClose
        }

        let editFlags = (edit.canUndo, edit.canRedo, edit.canCopy, edit.canCut, edit.canPaste, edit.canDelete)
        if (canUndo, canRedo, canCopy, canCut, canPaste, canDelete) != editFlags {
            canUndo = edit.canUndo
            canRedo = edit.canRedo
            canCopy = edit.canCopy
            canCut = edit.canCut
            canPaste = edit.canPaste
            canDelete = edit.canDelete
        }
    }

    func newDocument() {
        NotificationCenter.default.post(name: DiagramMenuNotification.newDocument, object: nil)
    }

    func open() {
        NotificationCenter.default.post(name: DiagramMenuNotification.open, object: nil)
    }

    func save() {
        NotificationCenter.default.post(name: DiagramMenuNotification.save, object: nil)
    }

    func saveAs() {
        NotificationCenter.default.post(name: DiagramMenuNotification.saveAs, object: nil)
    }

    func printDocument() {
        NotificationCenter.default.post(name: DiagramMenuNotification.printDocument, object: nil)
    }

    func close() {
        NotificationCenter.default.post(name: DiagramMenuNotification.close, object: nil)
    }

    func openRecent(_ file: RecentVisuStructFile) {
        NotificationCenter.default.post(
            name: DiagramMenuNotification.openRecent,
            object: nil,
            userInfo: [DiagramMenuNotification.recentFileIDKey: file.id]
        )
    }

    func undo() { editActions?.undo() }
    func redo() { editActions?.redo() }
    func copy() { editActions?.copy() }
    func cut() { editActions?.cut() }
    func paste() { editActions?.paste() }
    func delete() { editActions?.delete() }
}

/// Hält Freigaben und Edit-Aktionen aktuell. Volle Fläche, damit `.task` wirklich läuft
/// (eine 0×0-View wird oft nie erscheinen und Öffnen bleibt dann ausgegraut).
struct DiagramMenuCommandSync: View {
    let fileActions: DiagramFileActions
    let editActions: DiagramEditActions
    let refreshToken: String

    var body: some View {
        Color.clear
            .accessibilityHidden(true)
            .allowsHitTesting(false)
            .task(id: "\(capabilityToken)-\(refreshToken)") {
                DiagramCommandCenter.shared.update(file: fileActions, edit: editActions)
            }
    }

    private var capabilityToken: String {
        [
            fileActions.canNew, fileActions.canOpen, fileActions.canSave,
            fileActions.canSaveAs, fileActions.canPrint, fileActions.canClose,
            editActions.canUndo, editActions.canRedo, editActions.canCopy,
            editActions.canCut, editActions.canPaste, editActions.canDelete
        ].map { $0 ? "1" : "0" }.joined()
    }
}

@MainActor
final class IncomingDocumentOpener: ObservableObject {
    @Published var pendingURL: URL?

    func queue(_ url: URL) {
        pendingURL = url
    }
}

#if canImport(UIKit)
/// Ablage → Öffnen auf dem Mac (Designed for iPad): SwiftUI-`Button` mit ⌘O wird vom System
/// als Dokument-Open geschluckt und erscheint dann gar nicht. `UIAction` mit eigener ID bleibt sichtbar.
final class VisuStructAppDelegate: UIResponder, UIApplicationDelegate {
    override func buildMenu(with builder: UIMenuBuilder) {
        super.buildMenu(with: builder)
        guard builder.system == .main else { return }

        builder.remove(menu: .open)

        let title = AppLanguage.currentFromDefaults().tr("menu_open")
        let open = UIAction(
            title: title,
            image: UIImage(systemName: "square.and.arrow.down"),
            identifier: UIAction.Identifier("org.visustruct.menu.open")
        ) { _ in
            NotificationCenter.default.post(name: DiagramMenuNotification.open, object: nil)
        }
        let group = UIMenu(
            title: "",
            identifier: UIMenu.Identifier("org.visustruct.menu.open.group"),
            options: .displayInline,
            children: [open]
        )
        if builder.menu(for: .newScene) != nil {
            builder.insertSibling(group, afterMenu: .newScene)
        } else {
            builder.insertChild(group, atStartOfMenu: .file)
        }
    }
}
#endif

@main
struct VisuStructApp: App {
    #if canImport(UIKit)
    @UIApplicationDelegateAdaptor(VisuStructAppDelegate.self) private var appDelegate
    #endif

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
    @ObservedObject private var commandCenter = DiagramCommandCenter.shared
    /// Nicht über `FocusedValue`: SwiftUI Commands speichern dort oft eine leere Kopie.
    @ObservedObject private var recentFilesStore = RecentFilesStore.shared
    @AppStorage(AppLanguage.storageKey) private var languageCode: String = AppLanguage.english.rawValue

    private var lang: AppLanguage {
        AppLanguage(rawValue: languageCode) ?? .english
    }

    var body: some Commands {
        CommandGroup(replacing: .newItem) {
            Button(lang.tr("menu_new")) {
                commandCenter.newDocument()
            }
            .keyboardShortcut("n", modifiers: .command)
            .disabled(!commandCenter.canNew)
            Divider()
            if recentFilesStore.files.isEmpty {
                Button(lang.tr("recent_files_empty")) {}
                    .disabled(true)
            } else {
                ForEach(recentFilesStore.files) { file in
                    Button(file.displayName) {
                        commandCenter.openRecent(file)
                    }
                    .disabled(!commandCenter.canOpen)
                }
                Divider()
                Button(lang.tr("recent_files_clear")) {
                    recentFilesStore.clear()
                }
                .disabled(!commandCenter.canOpen)
            }
        }
        CommandGroup(replacing: .saveItem) {
            Button(lang.tr("menu_save")) {
                commandCenter.save()
            }
            .keyboardShortcut("s", modifiers: .command)
            .disabled(!commandCenter.canSave)
            Button(lang.tr("menu_save_as")) {
                commandCenter.saveAs()
            }
            .keyboardShortcut("s", modifiers: [.command, .shift])
            .disabled(!commandCenter.canSaveAs)
            Divider()
            Button(lang.tr("menu_print")) {
                commandCenter.printDocument()
            }
            .keyboardShortcut("p", modifiers: .command)
            .disabled(!commandCenter.canPrint)
            Divider()
            Button(lang.tr("menu_close")) {
                commandCenter.close()
            }
            .keyboardShortcut("w", modifiers: .command)
            .disabled(!commandCenter.canClose)
        }
        CommandGroup(replacing: .undoRedo) {
            Button(lang.tr("toolbar_undo")) {
                commandCenter.undo()
            }
            .keyboardShortcut("z", modifiers: .command)
            .disabled(!commandCenter.canUndo)
            Button(lang.tr("toolbar_redo")) {
                commandCenter.redo()
            }
            .keyboardShortcut("z", modifiers: [.command, .shift])
            .disabled(!commandCenter.canRedo)
        }
        CommandGroup(replacing: .pasteboard) {
            Button(lang.tr("ctx_copy")) {
                commandCenter.copy()
            }
            .keyboardShortcut("c", modifiers: .command)
            .disabled(!commandCenter.canCopy)
            Button(lang.tr("ctx_cut")) {
                commandCenter.cut()
            }
            .keyboardShortcut("x", modifiers: .command)
            .disabled(!commandCenter.canCut)
            Button(lang.tr("ctx_paste")) {
                commandCenter.paste()
            }
            .keyboardShortcut("v", modifiers: .command)
            .disabled(!commandCenter.canPaste)
        }
        CommandGroup(after: .pasteboard) {
            Button(lang.tr("action_delete_selection")) {
                commandCenter.delete()
            }
            .keyboardShortcut(.delete, modifiers: [])
            .disabled(!commandCenter.canDelete)
        }
    }
}

/// Synchronisiert `UserDefaults` mit den iOS-**Systemeinstellungen** (VisuStruct), sobald die App wieder aktiv wird.
private struct AppRootView: View {
    @StateObject private var incomingDocuments = IncomingDocumentOpener()
    @AppStorage(AppLanguage.storageKey) private var languageCode: String = AppLanguage.english.rawValue
    @AppStorage(VisuStructUIScaleStep.appStorageKeyCanvas) private var scaleCanvas: String = VisuStructUIScaleStep.small.rawValue
    @AppStorage(VisuStructUIScaleStep.appStorageKeyInspector) private var scaleInspector: String = VisuStructUIScaleStep.small.rawValue
    @AppStorage("visustruct.export.filenameStyle") private var exportFilenameStyle: String = "dateTitle"
    @AppStorage("visustruct.codegen.includeEmptyElse") private var codegenEmptyElse = true
    @AppStorage("visustruct.codegen.includeDiagramComments") private var codegenDiagramComments = false
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        ContentView()
            .environmentObject(incomingDocuments)
            .environment(\.appLanguage, AppLanguage(rawValue: languageCode) ?? .english)
            .onOpenURL { incomingDocuments.queue($0) }
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
