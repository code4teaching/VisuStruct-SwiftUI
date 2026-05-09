import SwiftUI
import UniformTypeIdentifiers
import VisuStructCore
#if canImport(UIKit)
import QuickLook
import UIKit
#endif
#if canImport(WebKit)
import WebKit
#endif
#if canImport(AppKit)
import AppKit
#endif

// MARK: - Mehrere Struktogramm-Reiter

private struct DiagramSheetTab: Identifiable {
    let id: UUID
    var title: String
    var document: VisuStructDocument
    var undoStack: [VisuStructDocument] = []
    var redoStack: [VisuStructDocument] = []
    var selectedPath: [Int]? = [0]
    var lineEditorText: String = ""
    var errorText: String? = nil
    /// Security-Scoped Bookmark der zuletzt geöffneten oder unter „Speichern unter …“ gewählten Datei — für **Speichern** ohne Dialog.
    var linkedFileBookmarkData: Data? = nil
    /// Dateiname (ohne Endung) für Titelanzeige; `nil` bedeutet „unbenannt“ (z. B. „Struktogramm 1“).
    var linkedFileDisplayName: String? = nil
    /// Encodiertes Dokument zuletzt als „sauber“ betrachtet (nach Öffnen/Speichern) — für den Punkt wie in VS Code.
    var savedDocumentBaseline: Data

    static func makeNew(serial: Int, id: UUID = UUID(), language: AppLanguage) -> DiagramSheetTab {
        let title = String(
            format: language.tr("tab_title_format"),
            locale: Locale(identifier: language.localeIdentifierForFormatting),
            arguments: [serial as CVarArg]
        )
        let doc = VisuStructDocumentEditing.newEmpty()
        return DiagramSheetTab(
            id: id,
            title: title,
            document: doc,
            undoStack: [],
            redoStack: [],
            selectedPath: [0],
            lineEditorText: "",
            errorText: nil,
            linkedFileBookmarkData: nil,
            linkedFileDisplayName: nil,
            savedDocumentBaseline: VisuStructXMLCodec.encode(doc)
        )
    }
}

// MARK: - Export: Dateiname (Einstellung)

private enum ExportFilenameStyle: String, CaseIterable, Identifiable {
    /// `yyyy-MM-dd-<Titel>.visustruct`
    case dateAndTitle = "dateTitle"
    /// `<Titel>.visustruct`
    case titleOnly = "titleOnly"

    var id: String { rawValue }

    static let appStorageKey = "visustruct.export.filenameStyle"

    static func fromStored(_ raw: String) -> Self {
        Self(rawValue: raw) ?? .dateAndTitle
    }
}

// MARK: - Code-Generator: Kaufzwang (IAP)

/// Wenn `true`, ist „Code erzeugen“ ohne Kauf/Freischaltung (`visustruct.codegen.unlocked`) nur ein Hinweis-Sheet.
/// Solange es noch nichts Käufliches gibt: `false` — später auf `true` stellen und StoreKit anbinden.
private enum CodeGeneratorPurchaseGate {
    static let requiresPurchase = false
}

private enum SimulationStepDelayOption: String, CaseIterable, Identifiable {
    case seconds02 = "0.2"
    case seconds05 = "0.5"
    case seconds10 = "1.0"
    case seconds15 = "1.5"
    case seconds20 = "2.0"

    var id: String { rawValue }

    static let appStorageKey = "visustruct.simulation.stepDelay"
    static let defaultRawValue = Self.seconds05.rawValue

    static func fromStored(_ raw: String) -> Self {
        Self(rawValue: raw) ?? .seconds05
    }

    var nanoseconds: UInt64 {
        switch self {
        case .seconds02: return 200_000_000
        case .seconds05: return 500_000_000
        case .seconds10: return 1_000_000_000
        case .seconds15: return 1_500_000_000
        case .seconds20: return 2_000_000_000
        }
    }
}

private enum SimulationHighlightMode: String, CaseIterable, Identifiable {
    case lastExecuted
    case nextToExecute

    var id: String { rawValue }

    static let appStorageKey = "visustruct.simulation.highlightMode"
    static let defaultRawValue = Self.lastExecuted.rawValue

    static func fromStored(_ raw: String) -> Self {
        Self(rawValue: raw) ?? .lastExecuted
    }
}

// MARK: - Hauptansicht

@MainActor
struct ContentView: View {
    @Environment(\.displayScale) private var displayScale
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @Environment(\.appLanguage) private var lang

    private var isPhone: Bool {
        #if canImport(UIKit)
        return UIDevice.current.userInterfaceIdiom == .phone
        #else
        return false
        #endif
    }

    private enum FocusTarget: Hashable {
        case caption
        case caseLabel
        case textEditor
        /// Zählschleife: drei Kopf-Felder (Start / Bedingung / Schritt).
        case forLoopPart(Int)
    }

    private enum StatementIOMode: String, CaseIterable, Hashable {
        case statement
        case input
        case output
    }

    @FocusState private var focusedField: FocusTarget?

    @State private var sheetTabs: [DiagramSheetTab]
    @State private var selectedTabId: UUID
    @State private var nextTabSerial: Int

    @State private var showImporter = false
    @State private var showExporter = false
    @State private var showInfo = false
    @State private var showCodeGeneratorPaywall = false
    @State private var showCodeGeneratorPlaceholder = false
    @State private var isSimulationMode = false
    @State private var simulationEngine: VisuStructSimulationEngine
    @State private var simulationPlayTask: Task<Void, Never>? = nil
    @State private var isSimulationPlaying = false
    @State private var simulationWasPlayingBeforeInput = false
    @State private var simulationInputText = ""
    @StateObject private var recentFilesStore: RecentFilesStore
    @State private var pendingCloseTabId: UUID? = nil
    @State private var closeTabAfterSuccessfulExportId: UUID? = nil
    /// Erhöhen bei jedem Tipp auf „Code erzeugen“, damit die Anzeige neu aufgebaut wird (auch wenn der Dialog schon offen ist).
    @State private var codeGeneratorRegenerationToken: Int = 0
    /// Wenn `CodeGeneratorPurchaseGate.requiresPurchase`: nach erfolgreichem Kauf auf `true` (StoreKit / `UserDefaults`).
    @AppStorage("visustruct.codegen.unlocked") private var codeGeneratorUnlocked = false

    /// Freigabe für die Code-Generator-UI: ohne Kaufzwang immer offen; mit Kaufzwang nur nach Freischaltung.
    private var codeGeneratorAccessGranted: Bool {
        !CodeGeneratorPurchaseGate.requiresPurchase || codeGeneratorUnlocked
    }
    // iPhone UX: Einfügemarke + Inspector einklappen beim Einfügen.
    @State private var insertTarget: DiagramInsertTarget? = nil
    @State private var hideInspectorOnPhone: Bool = false
    // iPhone UX: Palette automatisch einklappen beim Text-Editieren.
    @State private var showPaletteOnPhone: Bool = true
    // In-App Zwischenablage für Diagramm-Elemente (Copy/Cut/Paste).
    @State private var elementClipboard: VisuStructElement? = nil
    #if canImport(UIKit)
    @State private var pngSharePayload: PNGSharePayload?
    @State private var fileURLSharePayload: FileURLSharePayload?
    /// PDF: Quick Look (System-Vorschau), statt nur Share Sheet.
    @State private var pdfQuickLookURL: URL?
    @State private var keyboardOverlap: CGFloat = 0
    #endif

    @AppStorage(ExportFilenameStyle.appStorageKey) private var exportFilenameStyleRaw: String = ExportFilenameStyle.dateAndTitle.rawValue
    @AppStorage(VisuStructUIScaleStep.appStorageKeyCanvas) private var canvasScaleRaw: String = VisuStructUIScaleStep.small.rawValue
    @AppStorage(VisuStructUIScaleStep.appStorageKeyInspector) private var inspectorScaleRaw: String = VisuStructUIScaleStep.small.rawValue
    @State private var editorFocusToken = UUID()
    @AppStorage(SimulationStepDelayOption.appStorageKey) private var simulationStepDelayRaw: String = SimulationStepDelayOption.defaultRawValue
    @AppStorage(SimulationHighlightMode.appStorageKey) private var simulationHighlightModeRaw: String = SimulationHighlightMode.defaultRawValue

    private var canvasScaleStep: VisuStructUIScaleStep {
        VisuStructUIScaleStep(rawValue: canvasScaleRaw) ?? .small
    }

    private var inspectorScaleStep: VisuStructUIScaleStep {
        VisuStructUIScaleStep(rawValue: inspectorScaleRaw) ?? .small
    }

    private var exportFilenameStyle: ExportFilenameStyle {
        ExportFilenameStyle.fromStored(exportFilenameStyleRaw)
    }

    private var simulationStepDelay: SimulationStepDelayOption {
        SimulationStepDelayOption.fromStored(simulationStepDelayRaw)
    }

    private var simulationHighlightMode: SimulationHighlightMode {
        SimulationHighlightMode.fromStored(simulationHighlightModeRaw)
    }

    init() {
        let startupLang = AppLanguage.currentFromDefaults()
        let first = DiagramSheetTab.makeNew(serial: 1, language: startupLang)
        _sheetTabs = State(initialValue: [first])
        _selectedTabId = State(initialValue: first.id)
        _nextTabSerial = State(initialValue: 2)
        _simulationEngine = State(initialValue: VisuStructSimulationEngine(document: first.document))
        _recentFilesStore = StateObject(wrappedValue: RecentFilesStore())
    }

    private var currentTabIndex: Int {
        sheetTabs.firstIndex(where: { $0.id == selectedTabId }) ?? 0
    }

    /// Reiter- und Titelleiste: ohne `.visustruct`; auch als Basis für Export, falls der Titel die Endung enthält.
    private static func stripVisuStructExtension(from name: String) -> String {
        let t = name.trimmingCharacters(in: .whitespacesAndNewlines)
        let suffix = ".visustruct"
        if t.lowercased().hasSuffix(suffix) {
            return String(t.dropLast(suffix.count)).trimmingCharacters(in: .whitespacesAndNewlines)
        }
        return t
    }

    private func diagramTabDisplayTitle(_ tab: DiagramSheetTab) -> String {
        let raw = Self.stripVisuStructExtension(from: tab.title)
        // Ohne sichtbaren Titel: gleicher Sinn wie im Titelfeld (Platzhalter aus Caption / Sprache), nie leerer String in der Leiste.
        if raw.isEmpty { return tabDisplayTitle(forCaption: tab.document.caption) }
        return raw
    }

    private func fileDisplayName(from url: URL) -> String {
        let name = url.deletingPathExtension().lastPathComponent.trimmingCharacters(in: .whitespacesAndNewlines)
        let base = name.isEmpty ? url.deletingPathExtension().lastPathComponent : name
        return Self.stripVisuStructExtension(from: base)
    }

    /// `true`, wenn sich das Diagramm gegenüber der letzten Speicher-Baseline geändert hat (inkl. Rückgängig bis zum gespeicherten Stand).
    private func tabHasUnsavedChanges(_ tab: DiagramSheetTab) -> Bool {
        VisuStructXMLCodec.encode(tab.document) != tab.savedDocumentBaseline
    }

    @ViewBuilder
    private func unsavedChangeIndicatorDot() -> some View {
        Circle()
            .fill(Color.accentColor)
            .frame(width: 7, height: 7)
            .accessibilityHidden(true)
    }

    private func updateSavedBaselineForCurrentTab() {
        var tabs = sheetTabs
        let i = currentTabIndex
        tabs[i].savedDocumentBaseline = VisuStructXMLCodec.encode(tabs[i].document)
        sheetTabs = tabs
    }

    private func setLinkedFile(forCurrentTab url: URL) {
        var tabs = sheetTabs
        let i = currentTabIndex
        tabs[i].linkedFileBookmarkData = recentFilesStore.makeBookmarkData(for: url)
        let display = fileDisplayName(from: url)
        tabs[i].linkedFileDisplayName = display.isEmpty ? nil : display
        if let d = tabs[i].linkedFileDisplayName {
            tabs[i].title = d
        }
        sheetTabs = tabs
        recentFilesStore.record(url: url, displayName: display)
    }

    @discardableResult
    private func openDocument(from url: URL) -> Bool {
        let didAccess = url.startAccessingSecurityScopedResource()
        defer {
            if didAccess { url.stopAccessingSecurityScopedResource() }
        }
        do {
            let data = try Data(contentsOf: url)
            var loaded = try VisuStructXMLCodec.decode(data: data)
            if loaded.elements.isEmpty {
                loaded = VisuStructDocumentEditing.newEmpty()
            }
            loaded = documentWithFilenameCaptionIfNeeded(loaded, fileURL: url)
            resetHistoryAndDocument(loaded)
            var tabs = sheetTabs
            let i = currentTabIndex
            tabs[i].selectedPath = tabs[i].document.elements.isEmpty ? nil : [0]
            tabs[i].errorText = nil
            let display = fileDisplayName(from: url)
            tabs[i].linkedFileDisplayName = display.isEmpty ? nil : display
            tabs[i].title = tabs[i].linkedFileDisplayName ?? tabs[i].title
            sheetTabs = tabs
            setLinkedFile(forCurrentTab: url)
            refreshLineEditor()
            return true
        } catch {
            setErrorOnCurrentTab(error.localizedDescription)
            return false
        }
    }

    private func openRecentFile(_ recentFile: RecentVisuStructFile) {
        do {
            let url = try recentFilesStore.resolveURL(for: recentFile)
            if openDocument(from: url) {
                recentFilesStore.record(url: url, displayName: fileDisplayName(from: url))
                return
            }
            if let p = recentFile.filePath, p.hasPrefix(NSHomeDirectory()) {
                let fallbackURL = URL(fileURLWithPath: p)
                if openDocument(from: fallbackURL) {
                    recentFilesStore.record(url: fallbackURL, displayName: fileDisplayName(from: fallbackURL))
                    return
                }
            }
            recentFilesStore.remove(id: recentFile.id)
        } catch {
            recentFilesStore.remove(id: recentFile.id)
            setErrorOnCurrentTab(error.localizedDescription)
        }
    }

    private func documentWithFilenameCaptionIfNeeded(_ doc: VisuStructDocument, fileURL url: URL) -> VisuStructDocument {
        guard doc.caption.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return doc }
        let display = fileDisplayName(from: url)
        guard !display.isEmpty else { return doc }
        var updated = doc
        updated.caption = display
        return updated
    }

    @discardableResult
    private func applyFilenameCaptionToCurrentDocumentIfNeeded(fileURL url: URL) -> VisuStructDocument {
        let i = currentTabIndex
        let updated = documentWithFilenameCaptionIfNeeded(sheetTabs[i].document, fileURL: url)
        guard updated != sheetTabs[i].document else { return updated }
        var tabs = sheetTabs
        tabs[i].document = updated
        tabs[i].title = tabDisplayTitle(forCaption: updated.caption)
        sheetTabs = tabs
        return updated
    }

    private var document: VisuStructDocument {
        sheetTabs[currentTabIndex].document
    }

    private var selectedPath: [Int]? {
        sheetTabs[currentTabIndex].selectedPath
    }

    private var unsavedCloseAlertBinding: Binding<Bool> {
        Binding(
            get: { pendingCloseTabId != nil },
            set: { if !$0 { pendingCloseTabId = nil } }
        )
    }

    var body: some View {
        Group {
            if horizontalSizeClass == .regular {
                NavigationSplitView {
                    iPadPaletteSidebarColumn
                } detail: {
                    mainEditorNavigationStack
                }
                .navigationSplitViewStyle(.balanced)
            } else {
                VStack(spacing: 0) {
                    if !isPhone || showPaletteOnPhone {
                        paletteListPanel
                            .frame(maxHeight: 300, alignment: .top)
                            .background(Color(.secondarySystemGroupedBackground))
                            .clipped()
                    }
                    Divider()
                    mainEditorNavigationStack
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            }
        }
        #if canImport(UIKit)
        .onReceive(NotificationCenter.default.publisher(for: UIResponder.keyboardWillChangeFrameNotification)) { n in
            updateKeyboardOverlap(from: n)
        }
        .onReceive(NotificationCenter.default.publisher(for: UIResponder.keyboardWillHideNotification)) { _ in
            keyboardOverlap = 0
        }
        #endif
        .onAppear {
            refreshLineEditor()
        }
        .alert(lang.tr("close_unsaved_title"), isPresented: unsavedCloseAlertBinding) {
            Button(lang.tr("menu_save")) {
                savePendingCloseTab()
            }
            Button(lang.tr("close_unsaved_discard"), role: .destructive) {
                discardPendingCloseTab()
            }
            Button(lang.tr("close_unsaved_cancel"), role: .cancel) {
                pendingCloseTabId = nil
            }
        } message: {
            Text(lang.tr("close_unsaved_message"))
        }
        .fileImporter(
            isPresented: $showImporter,
            allowedContentTypes: VisuStructFileDocument.readableContentTypes,
            allowsMultipleSelection: false
        ) { result in
            switch result {
            case .success(let urls):
                guard let url = urls.first else { return }
                Task { @MainActor in
                    openDocument(from: url)
                }
            case .failure(let err):
                let message = err.localizedDescription
                Task { @MainActor in
                    setErrorOnCurrentTab(message)
                }
            }
        }
        .fileExporter(
            isPresented: $showExporter,
            document: VisuStructFileDocument(document: document),
            contentType: VisuStructFileDocument.preferredExportContentType,
            defaultFilename: exportFilenameForCurrentTab()
        ) { result in
            switch result {
            case .success(let url):
                Task { @MainActor in
                    let docToSave = applyFilenameCaptionToCurrentDocumentIfNeeded(fileURL: url)
                    do {
                        try VisuStructXMLCodec.encode(docToSave).write(to: url, options: .atomic)
                    } catch {
                        setErrorOnCurrentTab(String(format: lang.tr("err_save_failed_fmt"), error.localizedDescription))
                        return
                    }
                    setLinkedFile(forCurrentTab: url)
                    updateSavedBaselineForCurrentTab()
                    if let pendingId = closeTabAfterSuccessfulExportId {
                        closeTabAfterSuccessfulExportId = nil
                        performCloseDiagramTab(id: pendingId)
                    }
                }
            case .failure(let err):
                let message = err.localizedDescription
                Task { @MainActor in
                    closeTabAfterSuccessfulExportId = nil
                    setErrorOnCurrentTab(message)
                }
            }
        }
        .sheet(isPresented: $showInfo) {
            AboutVisuStructView()
        }
        .sheet(isPresented: $showCodeGeneratorPaywall) {
            CodeGeneratorPaywallSheet()
        }
        .sheet(isPresented: Binding(
            get: { isPhone && showCodeGeneratorPlaceholder },
            set: { if !$0 { showCodeGeneratorPlaceholder = false } }
        )) {
            CodeGeneratorPlaceholderSheet(
                document: documentBinding,
                regenerationToken: codeGeneratorRegenerationToken
            )
        }
        .overlay {
            if !isPhone && showCodeGeneratorPlaceholder {
                DraggableCodeGeneratorFloatingPanel(
                    isPresented: $showCodeGeneratorPlaceholder,
                    document: documentBinding,
                    regenerationToken: codeGeneratorRegenerationToken
                )
                .transition(.opacity)
            }
        }
        #if canImport(UIKit)
        .sheet(item: $pngSharePayload) { payload in
            ActivityShareSheet(items: [payload.image])
        }
        .sheet(item: $fileURLSharePayload) { payload in
            ActivityShareSheet(items: [payload.url])
        }
        .quickLookPreview($pdfQuickLookURL)
        #endif
        .onChange(of: selectedTabId) { _, _ in
            refreshLineEditor()
        }
        .onChange(of: focusedField) { _, newVal in
            // iPhone: Sobald Textbearbeitung startet, Palette einklappen für mehr Platz.
            guard isPhone else { return }
            if newVal != nil {
                withAnimation(.easeInOut(duration: 0.15)) {
                    showPaletteOnPhone = false
                }
            }
        }
        .focusedSceneValue(\.diagramEditActions, diagramEditActions)
    }

    private var diagramEditActions: DiagramEditActions {
        let isTyping: Bool = {
            switch focusedField {
            case .none: return false
            case .caption, .caseLabel, .textEditor, .forLoopPart(_): return true
            }
        }()
        let hasSelection = selectedPath != nil
        let canCopy = !isTyping && hasSelection
        let canPaste = !isTyping && elementClipboard != nil
        let canCut = canCopy && (selectedPath.map { VisuStructDocumentEditing.canDeleteElement(at: $0, in: document) } ?? false)
        let canDelete = !isTyping && (selectedPath.map { VisuStructDocumentEditing.canDeleteElement(at: $0, in: document) } ?? false)
        return DiagramEditActions(
            canUndo: !isTyping && !sheetTabs[currentTabIndex].undoStack.isEmpty,
            canRedo: !isTyping && !sheetTabs[currentTabIndex].redoStack.isEmpty,
            canCopy: canCopy,
            canCut: canCut,
            canPaste: canPaste,
            canDelete: canDelete,
            undo: { performUndo() },
            redo: { performRedo() },
            copy: { copySelectionToClipboard() },
            cut: { cutSelectionToClipboard() },
            paste: { pasteClipboardAtSelectionOrRoot() },
            delete: { deleteSelection() }
        )
    }

    private func copySelectionToClipboard() {
        guard let path = selectedPath,
              let el = try? VisuStructDocumentEditing.element(at: path, in: document) else { return }
        elementClipboard = el
    }

    private func cutSelectionToClipboard() {
        guard let path = selectedPath,
              let el = try? VisuStructDocumentEditing.element(at: path, in: document) else { return }
        elementClipboard = el
        deleteSelection()
    }

    private func pasteClipboardAtSelectionOrRoot() {
        guard let clip = elementClipboard else { return }
        let doc = document
        do {
            if let path = selectedPath {
                if VisuStructDocumentEditing.isPlaceholderSlot(at: path, in: doc) {
                    commitDocument(try VisuStructDocumentEditing.replaceAtPath(doc, path: path, with: clip))
                    var tabs = sheetTabs
                    tabs[currentTabIndex].selectedPath = path
                    tabs[currentTabIndex].errorText = nil
                    sheetTabs = tabs
                    refreshLineEditor()
                    return
                }
                if (try? VisuStructDocumentEditing.element(at: path, in: doc)) != nil {
                    commitDocument(try VisuStructDocumentEditing.insertAfterSibling(doc, clip, after: path))
                    let newPath = Array(path.dropLast()) + [path.last! + 1]
                    var tabs = sheetTabs
                    tabs[currentTabIndex].selectedPath = newPath
                    tabs[currentTabIndex].errorText = nil
                    sheetTabs = tabs
                    refreshLineEditor()
                    return
                }
            }
            appendRoot(clip)
        } catch {
            setErrorOnCurrentTab(error.localizedDescription)
        }
    }

    /// iPad: Sidebar-Spalte mit System-Split (ein-/ausblendbar, Standardbreiten).
    private var iPadPaletteSidebarColumn: some View {
        NavigationStack {
            paletteListStackBody
                .navigationTitle(lang.tr("palette_header"))
                .navigationBarTitleDisplayMode(.inline)
                .toolbarBackground(.visible, for: .navigationBar)
                .toolbarBackground(Color(.secondarySystemGroupedBackground), for: .navigationBar)
        }
        .background(Color(.secondarySystemGroupedBackground))
        .navigationSplitViewColumnWidth(min: 220, ideal: 288, max: 400)
    }

    /// iPhone: Überschrift im Panel + Liste (kein doppelter Titel wie in der Sidebar).
    private var paletteListPanel: some View {
        VStack(spacing: 0) {
            Text(lang.tr("palette_header"))
                .font(.headline)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 16)
                .padding(.top, 10)
                .padding(.bottom, 8)
            paletteListStackBody
        }
    }

    /// Gemeinsamer List-Inhalt für Palette + Aktionen.
    @ViewBuilder
    private var paletteListStackBody: some View {
        let isCompact = horizontalSizeClass != .regular
        List {
            Section {
                ForEach(ElementPalette.PaletteItem.paletteOrder) { item in
                    paletteStructureRow(item, isCompact: isCompact)
                }
            }
            Section {
                Button {
                    deleteSelection()
                } label: {
                    Label(lang.tr("action_delete_selection"), systemImage: "trash")
                }
                .buttonStyle(PaletteListElementButtonStyle(emphasis: .destructive))
                .disabledAndDimmed(isSimulationMode)
                .listRowInsets(
                    isCompact
                        ? EdgeInsets(top: 4, leading: 10, bottom: 3, trailing: 10)
                        : EdgeInsets(top: 8, leading: 12, bottom: 5, trailing: 12)
                )
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
                .disabled(
                    isSimulationMode || (selectedPath.map { path in
                        !VisuStructDocumentEditing.canDeleteElement(at: path, in: document)
                    } ?? true)
                )
                Button {
                    if !isSimulationMode {
                        applyLineEditorRespectingTextFocus()
                        DispatchQueue.main.async {
                            beginSimulationMode()
                        }
                    } else {
                        endSimulationMode()
                    }
                } label: {
                    Label(
                        isSimulationMode ? lang.tr("action_diagram") : lang.tr("action_simulation"),
                        systemImage: isSimulationMode ? "rectangle.split.3x1" : "play.circle"
                    )
                }
                .buttonStyle(PaletteListElementButtonStyle())
                .listRowInsets(
                    isCompact
                        ? EdgeInsets(top: 3, leading: 10, bottom: 3, trailing: 10)
                        : EdgeInsets(top: 5, leading: 12, bottom: 5, trailing: 12)
                )
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
                .accessibilityLabel(isSimulationMode ? lang.tr("action_diagram") : lang.tr("action_simulation"))
                Button {
                    if codeGeneratorAccessGranted {
                        // Wichtig: Text im Inspector ist nicht immer sofort ins Dokument geschrieben (Button „Text übernehmen“).
                        // Für Code-Generierung wollen wir immer den aktuell sichtbaren Stand verwenden.
                        applyLineEditorRespectingTextFocus()
                        DispatchQueue.main.async {
                            codeGeneratorRegenerationToken &+= 1
                            showCodeGeneratorPlaceholder = true
                        }
                    } else {
                        showCodeGeneratorPaywall = true
                    }
                } label: {
                    HStack(spacing: 10) {
                        Label(lang.tr("action_generate_code"), systemImage: "chevron.left.forwardslash.chevron.right")
                            .foregroundStyle(isSimulationMode ? .tertiary : .primary)
                        Spacer(minLength: 8)
                        if !codeGeneratorAccessGranted {
                            Image(systemName: "lock.fill")
                                .font(.body)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
                .buttonStyle(PaletteListElementButtonStyle())
                .disabledAndDimmed(isSimulationMode)
                .listRowInsets(
                    isCompact
                        ? EdgeInsets(top: 3, leading: 10, bottom: 3, trailing: 10)
                        : EdgeInsets(top: 5, leading: 12, bottom: 5, trailing: 12)
                )
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
                .accessibilityLabel(
                    codeGeneratorAccessGranted ? lang.tr("a11y_generate_code") : lang.tr("a11y_generate_code_locked")
                )
                Button {
                    exportPNG()
                } label: {
                    Label(lang.tr("action_share_png"), systemImage: "square.and.arrow.up")
                        .foregroundStyle(isSimulationMode ? .tertiary : .primary)
                }
                .buttonStyle(PaletteListElementButtonStyle())
                .disabledAndDimmed(isSimulationMode)
                .listRowInsets(
                    isCompact
                        ? EdgeInsets(top: 3, leading: 10, bottom: 3, trailing: 10)
                        : EdgeInsets(top: 5, leading: 12, bottom: 5, trailing: 12)
                )
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
                Button {
                    shareDocumentAsFile()
                } label: {
                    Label(lang.tr("action_share_document"), systemImage: "square.and.arrow.up.on.square")
                        .foregroundStyle(isSimulationMode ? .tertiary : .primary)
                }
                .buttonStyle(PaletteListElementButtonStyle())
                .disabledAndDimmed(isSimulationMode)
                .listRowInsets(
                    isCompact
                        ? EdgeInsets(top: 3, leading: 10, bottom: 3, trailing: 10)
                        : EdgeInsets(top: 5, leading: 12, bottom: 5, trailing: 12)
                )
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
                Button {
                    shareDiagramPDF()
                } label: {
                    Label(lang.tr("action_export_pdf"), systemImage: "doc.text.magnifyingglass")
                        .foregroundStyle(isSimulationMode ? .tertiary : .primary)
                }
                .buttonStyle(PaletteListElementButtonStyle())
                .disabledAndDimmed(isSimulationMode)
                .listRowInsets(
                    isCompact
                        ? EdgeInsets(top: 3, leading: 10, bottom: 3, trailing: 10)
                        : EdgeInsets(top: 5, leading: 12, bottom: 5, trailing: 12)
                )
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)

                Button {
                    showInfo = true
                } label: {
                    Label(lang.tr("action_about"), systemImage: "info.circle")
                }
                .buttonStyle(PaletteListElementButtonStyle())
                .listRowInsets(
                    isCompact
                        ? EdgeInsets(top: 3, leading: 10, bottom: 4, trailing: 10)
                        : EdgeInsets(top: 5, leading: 12, bottom: 8, trailing: 12)
                )
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
            }
        }
        .listStyle(.insetGrouped)
        .listSectionSpacing(isCompact ? 8 : 18)
        .environment(\.defaultMinListRowHeight, isCompact ? 34 : 48)
        .scrollContentBackground(.hidden)
    }

    private var mainEditorNavigationStack: some View {
        NavigationStack {
            ZStack(alignment: .topLeading) {
                VStack(spacing: 0) {
                    diagramTabStrip
                    Group {
                        if let err = sheetTabs[currentTabIndex].errorText {
                            VStack(spacing: 20) {
                                ContentUnavailableView(
                                    lang.tr("error_title"),
                                    systemImage: "exclamationmark.triangle",
                                    description: Text(verbatim: err)
                                )
                                Button(lang.tr("error_back_editor")) {
                                    clearErrorOnCurrentTab()
                                }
                                .buttonStyle(.borderedProminent)
                            }
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                        } else {
                            editorDetail
                        }
                    }
                }
                // Explizit `navigationTitle` setzen, nicht nur `ToolbarItem(placement: .principal)`: sonst reserviert SwiftUI
                // in der Navigationsleiste oft keinen sichtbaren Mittelbereich (Titel wirkend „invisible“ / Breite 0, bes. iPhone).
                .navigationTitle(diagramTabDisplayTitle(sheetTabs[currentTabIndex]))
                .navigationBarTitleDisplayMode(.inline)
                .toolbarBackground(.visible, for: .navigationBar)
                .toolbarBackground(.regularMaterial, for: .navigationBar)
                .toolbar {
                    ToolbarItem(placement: .principal) {
                        let tab = sheetTabs[currentTabIndex]
                        let displayTitle = diagramTabDisplayTitle(tab)
                        HStack(spacing: 6) {
                            Text(verbatim: displayTitle)
                                .lineLimit(1)
                                .minimumScaleFactor(0.65)
                                .font(.headline)
                            if tabHasUnsavedChanges(tab) {
                                unsavedChangeIndicatorDot()
                            }
                        }
                        .accessibilityElement(children: .combine)
                        .accessibilityLabel(
                            tabHasUnsavedChanges(tab)
                                ? "\(displayTitle), \(lang.tr("a11y_unsaved_changes"))"
                                : displayTitle
                        )
                    }
                    ToolbarItemGroup(placement: .topBarLeading) {
                        Button(lang.tr("toolbar_undo"), systemImage: "arrow.uturn.backward", action: performUndo)
                            .disabled(sheetTabs[currentTabIndex].undoStack.isEmpty)
                            .help(lang.tr("toolbar_undo"))
                            .keyboardShortcut("z", modifiers: .command)
                        Button(lang.tr("toolbar_redo"), systemImage: "arrow.uturn.forward", action: performRedo)
                            .disabled(sheetTabs[currentTabIndex].redoStack.isEmpty)
                            .help(lang.tr("toolbar_redo"))
                            .keyboardShortcut("z", modifiers: [.command, .shift])
                    }
                    ToolbarItemGroup(placement: .topBarTrailing) {
                        Button(action: saveCurrentDocumentToFile) {
                            Label(lang.tr("menu_save"), systemImage: "arrow.down.doc")
                                .foregroundStyle(isSimulationMode ? .tertiary : .primary)
                        }
                        .help(lang.tr("menu_save"))
                        .keyboardShortcut("s", modifiers: .command)
                        .disabledAndDimmed(isSimulationMode)
                        if isPhone {
                            Button {
                                withAnimation(.easeInOut(duration: 0.15)) {
                                    showPaletteOnPhone.toggle()
                                }
                            } label: {
                                Label(lang.tr("palette_header"), systemImage: "square.grid.2x2")
                            }
                            .labelStyle(.iconOnly)
                            .accessibilityLabel(lang.tr("palette_header"))
                        }
                        Menu {
                            Button {
                                showImporter = true
                            } label: {
                                Label(lang.tr("menu_open"), systemImage: "square.and.arrow.down")
                                    .foregroundStyle(isSimulationMode ? .tertiary : .primary)
                            }
                            Menu {
                                if recentFilesStore.files.isEmpty {
                                    Text(lang.tr("recent_files_empty"))
                                } else {
                                    ForEach(recentFilesStore.files) { file in
                                        Button {
                                            openRecentFile(file)
                                        } label: {
                                            Label(file.displayName, systemImage: "clock.arrow.circlepath")
                                        }
                                    }
                                    Divider()
                                    Button(role: .destructive) {
                                        recentFilesStore.clear()
                                    } label: {
                                        Label(lang.tr("recent_files_clear"), systemImage: "trash")
                                    }
                                }
                            } label: {
                                Label(lang.tr("recent_files_menu"), systemImage: "clock")
                            }
                            Divider()
                            Button(action: saveCurrentDocumentToFile) {
                                Label(lang.tr("menu_save"), systemImage: "arrow.down.doc")
                            }
                            Button {
                                showExporter = true
                            } label: {
                                Label(lang.tr("menu_save_as"), systemImage: "square.and.arrow.up")
                            }
                            #if canImport(UIKit)
                            Divider()
                            Button(action: printDiagram) {
                                Label(lang.tr("menu_print"), systemImage: "printer")
                            }
                            #endif
                        } label: {
                            Label(lang.tr("menu_file"), systemImage: "folder")
                                .foregroundStyle(isSimulationMode ? .tertiary : .primary)
                        }
                        .disabledAndDimmed(isSimulationMode)
                    }
                    #if canImport(UIKit)
                    ToolbarItemGroup(placement: .keyboard) {
                        Spacer()
                        Button(lang.tr("about_done")) {
                            focusedField = nil
                            // iPhone: Inspector wieder einklappen, damit Canvas sichtbar ist.
                            if isPhone {
                                hideInspectorOnPhone = true
                            }
                        }
                    }
                    #endif
                }
            }
        }
        .background(Color(.systemGroupedBackground))
    }

    private var diagramTabStrip: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(sheetTabs) { tab in
                    diagramTabPill(tab)
                }
                Button {
                    addDiagramTab()
                } label: {
                    Image(systemName: "plus.circle.fill")
                        .font(.title3)
                        .foregroundStyle(Color.accentColor)
                        .symbolRenderingMode(.hierarchical)
                }
                .buttonStyle(.borderless)
                .accessibilityLabel(lang.tr("a11y_new_diagram_tab"))
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 11)
        }
        .frame(maxWidth: .infinity)
        .background(Color(.secondarySystemGroupedBackground))
    }

    private func diagramTabPill(_ tab: DiagramSheetTab) -> some View {
        let selected = tab.id == selectedTabId
        let displayTitle = diagramTabDisplayTitle(tab)
        return HStack(spacing: 2) {
            Button {
                selectedTabId = tab.id
                refreshLineEditor()
            } label: {
                HStack(spacing: 6) {
                    Text(verbatim: displayTitle)
                        .lineLimit(1)
                    if tabHasUnsavedChanges(tab) {
                        unsavedChangeIndicatorDot()
                    }
                }
                .font(.subheadline.weight(selected ? .semibold : .regular))
                .foregroundStyle(selected ? Color.primary : Color.secondary)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
            }
            .buttonStyle(.plain)
            .accessibilityLabel(
                tabHasUnsavedChanges(tab)
                    ? "\(displayTitle), \(lang.tr("a11y_unsaved_changes"))"
                    : displayTitle
            )
            if sheetTabs.count > 1 {
                Button {
                    requestCloseDiagramTab(id: tab.id)
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .font(.caption)
                        .foregroundStyle(.tertiary)
                }
                .buttonStyle(.plain)
                .padding(.trailing, 6)
                .accessibilityLabel(lang.tr("a11y_close_tab"))
            }
        }
        .background(selected ? Color.blue.opacity(0.2) : Color(.tertiarySystemFill))
        .clipShape(Capsule())
    }

    @ViewBuilder
    private var editorDetail: some View {
        Group {
            if isSimulationMode {
                simulationDetailView
            } else {
                VStack(alignment: .leading, spacing: 20) {
                    canvasAndCaptionBlock
                        .layoutPriority(1)
                    inspectorPanelPhoneAware
                }
            }
        }
        .padding(horizontalSizeClass == .regular ? EdgeInsets(top: 16, leading: 18, bottom: 16, trailing: 18) : EdgeInsets(top: 16, leading: 14, bottom: 16, trailing: 14))
        #if canImport(UIKit)
        // iPad: Tastatur kann den Inspector/TextEditor verdecken. Nur im Bearbeitungsmodus ausgleichen.
        .padding(.bottom, (!isSimulationMode && horizontalSizeClass == .regular && focusedField != nil) ? keyboardOverlap : 0)
        #endif
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    @ViewBuilder
    private var simulationDetailView: some View {
        GeometryReader { geo in
            let useColumns = geo.size.width >= 760
            let panelWidth = min(max(geo.size.width * 0.32, 280), 360)

            if useColumns {
                HStack(alignment: .top, spacing: 16) {
                    simulationCanvasBlock
                        .layoutPriority(1)
                    SimulationStatePanel(
                        engine: simulationEngine,
                        isPlaying: isSimulationPlaying,
                        inputText: $simulationInputText,
                        highlightModeRaw: $simulationHighlightModeRaw,
                        onPlay: playSimulation,
                        onPause: pauseSimulation,
                        onStep: stepSimulation,
                        onSubmitInput: submitSimulationInput,
                        onStop: resetSimulation
                    )
                        .frame(width: panelWidth)
                        .frame(maxHeight: .infinity, alignment: .top)
                }
            } else {
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        simulationCanvasBlock
                            .frame(height: max(340, geo.size.height * 0.55))
                        SimulationStatePanel(
                            engine: simulationEngine,
                            isPlaying: isSimulationPlaying,
                            inputText: $simulationInputText,
                            highlightModeRaw: $simulationHighlightModeRaw,
                            onPlay: playSimulation,
                            onPause: pauseSimulation,
                            onStep: stepSimulation,
                            onSubmitInput: submitSimulationInput,
                            onStop: resetSimulation
                        )
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
            }
        }
    }

    private var simulationCanvasBlock: some View {
        let diagramPaper = Color(white: 0.98)
        let blockCorner: CGFloat = horizontalSizeClass == .regular ? 14 : 12

        return GeometryReader { geo in
            ScrollView([.horizontal, .vertical]) {
                DiagramCanvasView(
                    document: documentBinding,
                    selectedPath: selectedPathBinding,
                    errorText: errorTextBinding,
                    insertTarget: $insertTarget,
                    elementClipboard: $elementClipboard,
                    canvasScaleStep: canvasScaleStep,
                    minViewportSize: CGSize(width: geo.size.width, height: geo.size.height),
                    usesSimulationSelectionHighlight: true
                )
                .padding(.vertical, 8)
                .fixedSize(horizontal: true, vertical: false)
                .allowsHitTesting(false)
            }
            .scrollBounceBehavior(isPhone ? .always : .basedOnSize, axes: [.horizontal, .vertical])
            .scrollIndicators(.automatic)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background {
            RoundedRectangle(cornerRadius: blockCorner, style: .continuous)
                .fill(diagramPaper)
        }
        .clipShape(RoundedRectangle(cornerRadius: blockCorner, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: blockCorner, style: .continuous)
                .strokeBorder(Color.primary.opacity(0.08), lineWidth: 1)
        }
    }

    /// Oberer Bereich: Diagramm-Titel + Canvas in **einer** visuellen Einheit (gleiche Fläche wie `diagramCanvasFill` in `DiagramCanvasView`).
    private var canvasAndCaptionBlock: some View {
        let diagramPaper = Color(white: 0.98)
        let blockCorner: CGFloat = horizontalSizeClass == .regular ? 14 : 12

        return VStack(alignment: .leading, spacing: 0) {
            VStack(alignment: .leading, spacing: 8) {
                Text(lang.tr("diagram_title_label"))
                    .font(horizontalSizeClass == .regular ? .caption : .subheadline)
                    .foregroundStyle(.secondary)
                TextField(lang.tr("diagram_title_placeholder"), text: captionBinding)
                    .font(horizontalSizeClass == .regular ? .subheadline : .body)
                    .textFieldStyle(.roundedBorder)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled(true)
                    .focused($focusedField, equals: .caption)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 14)
            .padding(.top, 8)
            .padding(.bottom, 6)
            // Innerer Trennstrich — Titel zählt zum Diagramm-„Blatt“, nicht als losgelöster Bereich oberhalb.
            Rectangle()
                .fill(Color.primary.opacity(0.1))
                .frame(height: 1)
                .padding(.horizontal, 10)

            GeometryReader { geo in
                ScrollView([.horizontal, .vertical]) {
                    DiagramCanvasView(
                        document: documentBinding,
                        selectedPath: selectedPathBinding,
                        errorText: errorTextBinding,
                        insertTarget: $insertTarget,
                        elementClipboard: $elementClipboard,
                        canvasScaleStep: canvasScaleStep,
                        minViewportSize: CGSize(width: geo.size.width, height: geo.size.height)
                    )
                    .padding(.vertical, 8)
                    // WICHTIG: horizontal nicht komprimieren lassen → sonst hat der ScrollView keine Content-Breite zum Scrollen.
                    .fixedSize(horizontal: true, vertical: false)
                }
                // iPhone: horizontales Scrollen muss zuverlässig funktionieren, sobald das Diagramm breiter als der Viewport ist.
                .scrollBounceBehavior(isPhone ? .always : .basedOnSize, axes: [.horizontal, .vertical])
                .scrollIndicators(.automatic)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .background {
            RoundedRectangle(cornerRadius: blockCorner, style: .continuous)
                .fill(diagramPaper)
        }
        .clipShape(RoundedRectangle(cornerRadius: blockCorner, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: blockCorner, style: .continuous)
                .strokeBorder(Color.primary.opacity(0.08), lineWidth: 1)
        }
    }

    private var documentBinding: Binding<VisuStructDocument> {
        Binding(
            get: { document },
            set: { commitDocument($0) }
        )
    }

    private var captionBinding: Binding<String> {
        Binding(
            get: { document.caption },
            set: { newCaption in
                var d = document
                d.caption = newCaption
                commitDocument(d)
                syncCurrentTabTitleWithCaption(newCaption)
            }
        )
    }

    private func beginSimulationMode() {
        pauseSimulation()
        var engine = VisuStructSimulationEngine(document: document)
        engine.reset()
        simulationEngine = engine
        simulationInputText = ""
        sheetTabs[currentTabIndex].selectedPath = engine.currentStepPath
        withAnimation(.easeInOut(duration: 0.18)) {
            isSimulationMode = true
        }
    }

    private func endSimulationMode() {
        pauseSimulation()
        withAnimation(.easeInOut(duration: 0.18)) {
            isSimulationMode = false
        }
        if sheetTabs[currentTabIndex].selectedPath == nil, !document.elements.isEmpty {
            sheetTabs[currentTabIndex].selectedPath = [0]
        }
    }

    private func stepSimulation() {
        guard simulationEngine.canStep else {
            pauseSimulation()
            return
        }
        let wasPlaying = isSimulationPlaying
        let lastExecutedPath = simulationEngine.currentStepPath
        var engine = simulationEngine
        engine.step()
        simulationEngine = engine
        if simulationHighlightMode == .nextToExecute, engine.canStep {
            sheetTabs[currentTabIndex].selectedPath = engine.currentStepPath
        } else {
            // lastExecuted (oder Ende/Input): letztes ausgeführtes Element bleibt markiert.
            sheetTabs[currentTabIndex].selectedPath = lastExecutedPath ?? engine.currentStepPath
        }
        // Wenn ein Input als Ergebnis des Steps angefordert wurde, Play pausieren,
        // aber merken, dass wir nach OK automatisch weiterlaufen sollen.
        if engine.state.inputRequest != nil, wasPlaying {
            simulationWasPlayingBeforeInput = true
        }
        if !engine.canStep {
            pauseSimulation()
        }
    }

    private func resetSimulation() {
        pauseSimulation()
        var engine = VisuStructSimulationEngine(document: document)
        engine.reset()
        simulationEngine = engine
        simulationInputText = ""
        sheetTabs[currentTabIndex].selectedPath = engine.currentStepPath
    }

    private func submitSimulationInput() {
        let shouldResume = isSimulationPlaying || simulationWasPlayingBeforeInput
        pauseSimulation()
        var engine = simulationEngine
        engine.provideInput(simulationInputText)
        simulationEngine = engine
        if engine.state.inputRequest == nil {
            simulationInputText = ""
        }
        sheetTabs[currentTabIndex].selectedPath = engine.currentStepPath

        if shouldResume, isSimulationMode, engine.canStep {
            simulationWasPlayingBeforeInput = false
            playSimulation()
        }
    }

    private func playSimulation() {
        guard !isSimulationPlaying, simulationEngine.canStep else { return }
        isSimulationPlaying = true
        simulationPlayTask?.cancel()
        simulationPlayTask = Task { @MainActor in
            while !Task.isCancelled && isSimulationMode && simulationEngine.canStep {
                stepSimulation()
                guard !Task.isCancelled, isSimulationMode, simulationEngine.canStep else { break }
                try? await Task.sleep(nanoseconds: simulationStepDelay.nanoseconds)
            }
            if !Task.isCancelled {
                isSimulationPlaying = false
                simulationPlayTask = nil
            }
        }
    }

    private func pauseSimulation() {
        simulationPlayTask?.cancel()
        simulationPlayTask = nil
        isSimulationPlaying = false
    }

    /// Reiter-Bezeichnung an den Diagrammtitel anpassen (leer → Platzhalter wie im Titelfeld).
    private func syncCurrentTabTitleWithCaption(_ caption: String) {
        var tabs = sheetTabs
        let i = currentTabIndex
        tabs[i].title = tabDisplayTitle(forCaption: caption)
        sheetTabs = tabs
    }

    private func tabDisplayTitle(forCaption caption: String) -> String {
        let t = caption.trimmingCharacters(in: .whitespacesAndNewlines)
        return t.isEmpty ? lang.tr("diagram_title_placeholder") : t
    }

    private func syncTabTitleWithDocumentCaption(tabIndex i: Int) {
        var tabs = sheetTabs
        tabs[i].title = tabDisplayTitle(forCaption: tabs[i].document.caption)
        sheetTabs = tabs
    }

    private var selectedPathBinding: Binding<[Int]?> {
        Binding(
            get: { sheetTabs[currentTabIndex].selectedPath },
            set: { newVal in
                var tabs = sheetTabs
                tabs[currentTabIndex].selectedPath = newVal
                sheetTabs = tabs
                refreshLineEditor()
            }
        )
    }

    private var lineEditorTextBinding: Binding<String> {
        Binding(
            get: { sheetTabs[currentTabIndex].lineEditorText },
            set: { newVal in
                let normalized = normalizeQuotesForCode(newVal)
                var tabs = sheetTabs
                tabs[currentTabIndex].lineEditorText = normalized
                sheetTabs = tabs
            }
        )
    }

    private var lineEditorVisibleTextBinding: Binding<String> {
        Binding(
            get: {
                let text = sheetTabs[currentTabIndex].lineEditorText
                guard let labelPrefix = lineEditorFixedPrefixLabel else { return text }
                return stripLineEditorPrefixForEditing(labelPrefix, from: text)
            },
            set: { newVal in
                let normalized = normalizeQuotesForCode(newVal)
                let text: String
                if let labelPrefix = lineEditorFixedPrefixLabel {
                    text = prefixPreservingEditingWhitespace(labelPrefix, to: stripLineEditorPrefixForEditing(labelPrefix, from: normalized))
                } else {
                    text = normalized
                }
                var tabs = sheetTabs
                tabs[currentTabIndex].lineEditorText = text
                sheetTabs = tabs
            }
        )
    }

    private var lineEditorFixedPrefixLabel: String? {
        guard let path = selectedPath,
              let el = try? VisuStructDocumentEditing.element(at: path, in: document) else { return nil }

        switch el.type {
        case .anweisung:
            switch statementIOMode(for: sheetTabs[currentTabIndex].lineEditorText) {
            case .input:
                return "input:"
            case .output:
                return "output:"
            case .statement:
                return nil
            }
        case .verzweigung:
            return "if"
        case .whileSchleife:
            return "while"
        case .doUntilSchleife:
            return "until"
        case .fallauswahl:
            return "switch"
        default:
            return nil
        }
    }

    private var errorTextBinding: Binding<String?> {
        Binding(
            get: { sheetTabs[currentTabIndex].errorText },
            set: { newVal in
                var tabs = sheetTabs
                tabs[currentTabIndex].errorText = newVal
                sheetTabs = tabs
            }
        )
    }

    private func setErrorOnCurrentTab(_ message: String) {
        var tabs = sheetTabs
        tabs[currentTabIndex].errorText = message
        sheetTabs = tabs
    }

    private func clearErrorOnCurrentTab() {
        var tabs = sheetTabs
        tabs[currentTabIndex].errorText = nil
        sheetTabs = tabs
    }

    /// Vorschlag für „Speichern unter …“ / Teilen — je nach Einstellung nur Titel oder `yyyy-MM-dd-<Titel>`.
    private func exportFilenameForCurrentTab() -> String {
        let tab = sheetTabs[currentTabIndex]
        let caption = tab.document.caption.trimmingCharacters(in: .whitespacesAndNewlines)
        let baseRaw: String
        if !caption.isEmpty {
            baseRaw = caption
        } else if let linked = tab.linkedFileDisplayName?.trimmingCharacters(in: .whitespacesAndNewlines), !linked.isEmpty {
            baseRaw = Self.stripVisuStructExtension(from: linked)
        } else {
            baseRaw = Self.stripVisuStructExtension(from: tab.title)
        }
        let slug = Self.sanitizedExportFilenameSlug(baseRaw)
        let body: String
        switch exportFilenameStyle {
        case .titleOnly:
            if slug.isEmpty {
                let fallback = Self.sanitizedExportFilenameSlug(
                    Self.stripVisuStructExtension(from: tab.title)
                )
                body = fallback.isEmpty ? "VisuStruct" : fallback
            } else {
                body = slug
            }
        case .dateAndTitle:
            if slug.isEmpty {
                body = String(Self.isoDatePrefixForExportFilename().dropLast())
            } else if Self.hasISODatePrefix(slug) {
                body = slug
            } else {
                body = "\(Self.isoDatePrefixForExportFilename())\(slug)"
            }
        }
        return "\(body).visustruct"
    }

    private static func hasISODatePrefix(_ s: String) -> Bool {
        let chars = Array(s)
        guard chars.count >= 11 else { return false }
        let digitPositions: Set<Int> = [0, 1, 2, 3, 5, 6, 8, 9]
        for i in 0..<10 {
            if digitPositions.contains(i) {
                guard chars[i].isNumber else { return false }
            } else {
                guard chars[i] == "-" else { return false }
            }
        }
        return chars[10] == "-"
    }

    private static func isoDatePrefixForExportFilename() -> String {
        let f = DateFormatter()
        f.calendar = Calendar.current
        f.timeZone = TimeZone.current
        f.locale = Locale(identifier: "en_US_POSIX")
        f.dateFormat = "yyyy-MM-dd"
        return "\(f.string(from: Date()))-"
    }

    private static func sanitizedExportFilenameSlug(_ raw: String) -> String {
        var s = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        if s.isEmpty { return "" }
        s = stripVisuStructExtension(from: s)
        // Leerzeichen & Zeilenumbruch → Bindestrich (Vorschlagsname ohne Spaces, z. B. für Skripte/Uploads).
        s = String(s.map { $0.isWhitespace ? Character("-") : $0 })
        for ch in ["/", ":", "\\", "*", "?", "\"", "<", ">", "|"] {
            s = s.replacingOccurrences(of: String(ch), with: "-")
        }
        while s.contains("--") {
            s = s.replacingOccurrences(of: "--", with: "-")
        }
        s = s.trimmingCharacters(in: CharacterSet(charactersIn: "-"))
        if s.count > 120 {
            s = String(s.prefix(120)).trimmingCharacters(in: CharacterSet(charactersIn: "-"))
        }
        return s
    }

    private func pdfFilenameForCurrentTab() -> String {
        let v = exportFilenameForCurrentTab()
        let suffix = ".visustruct"
        if v.lowercased().hasSuffix(suffix) {
            return String(v.dropLast(suffix.count)) + ".pdf"
        }
        return v + ".pdf"
    }

    private func addDiagramTab() {
        let serial = nextTabSerial
        nextTabSerial += 1
        let tab = DiagramSheetTab.makeNew(serial: serial, language: lang)
        sheetTabs.append(tab)
        selectedTabId = tab.id
        refreshLineEditor()
    }

    private func requestCloseDiagramTab(id: UUID) {
        guard sheetTabs.count > 1, let idx = sheetTabs.firstIndex(where: { $0.id == id }) else { return }
        if tabHasUnsavedChanges(sheetTabs[idx]) {
            pendingCloseTabId = id
        } else {
            performCloseDiagramTab(id: id)
        }
    }

    private func performCloseDiagramTab(id: UUID) {
        guard sheetTabs.count > 1, let idx = sheetTabs.firstIndex(where: { $0.id == id }) else { return }
        let wasSelected = id == selectedTabId
        sheetTabs.remove(at: idx)
        if wasSelected {
            let newIdx = min(idx, sheetTabs.count - 1)
            selectedTabId = sheetTabs[newIdx].id
            refreshLineEditor()
        }
    }

    private func discardPendingCloseTab() {
        guard let id = pendingCloseTabId else { return }
        pendingCloseTabId = nil
        performCloseDiagramTab(id: id)
    }

    private func savePendingCloseTab() {
        guard let id = pendingCloseTabId,
              let idx = sheetTabs.firstIndex(where: { $0.id == id }) else {
            pendingCloseTabId = nil
            return
        }
        pendingCloseTabId = nil
        selectedTabId = id
        refreshLineEditor()
        closeTabAfterSuccessfulExportId = id

        if sheetTabs[idx].linkedFileBookmarkData == nil {
            showExporter = true
            return
        }

        saveCurrentDocumentToFile()
        if let tab = sheetTabs.first(where: { $0.id == id }), !tabHasUnsavedChanges(tab) {
            closeTabAfterSuccessfulExportId = nil
            performCloseDiagramTab(id: id)
        } else if !showExporter {
            closeTabAfterSuccessfulExportId = nil
        }
    }

    /// Kompaktes Textfeld unter dem Canvas (typisch 1–2 Zeilen); bei Bedarf per Scrollen mehr.
    private var inspectorPanel: some View {
        let inScale = CGFloat(inspectorScaleStep.multiplier)
        let captionFont: Font = .system(
            size: (horizontalSizeClass == .regular ? 11 : 12) * inScale,
            weight: .regular
        )
        let inspectorHintFont: Font = .system(
            size: (ProcessInfo.processInfo.isiOSAppOnMac ? 15 : 12) * inScale,
            weight: .regular
        )
        let editorMonoPt = (horizontalSizeClass == .regular ? 16 : 17) * inScale
        let editorFont: Font = .system(size: editorMonoPt, weight: .regular)
        /// Eine Zeile ~22 pt, zwei Zeilen knapp unter 50 pt — bewusst niedrig, Canvas bleibt dominant.
        let editorLineHeight: CGFloat = (horizontalSizeClass == .regular ? 24 : 27) * inScale
        let editorMinHeight: CGFloat = editorLineHeight + 20
        let editorMaxHeight: CGFloat = editorLineHeight * 2 + 28

        return GroupBox {
            VStack(alignment: .leading, spacing: 12) {
                if selectedPath == nil {
                    Text(lang.tr("inspector_no_selection"))
                        .foregroundStyle(.secondary)
                        .font(captionFont)
                        .lineSpacing(3)
                }
                if let ioModeBinding = statementIOModeBindingIfApplicable() {
                    VStack(alignment: .leading, spacing: 6) {
                        Picker("", selection: ioModeBinding) {
                            Text(lang.tr("inspector_io_mode_statement")).tag(StatementIOMode.statement)
                            Text(lang.tr("inspector_io_mode_input")).tag(StatementIOMode.input)
                            Text(lang.tr("inspector_io_mode_output")).tag(StatementIOMode.output)
                        }
                        #if canImport(AppKit)
                        .pickerStyle(.radioGroup)
                        #else
                        .pickerStyle(.segmented)
                        #endif
                        .labelsHidden()
                        // Java-ähnliche Beispiele: absichtlich immer Englisch (Identifier wie number/text), unabhängig von der UI-Sprache — ohne „e.g.“-Präfix, der Hinweis reicht.
                        if ioModeBinding.wrappedValue == .statement {
                            // Ein `Text`: eine Zeile wenn Platz, sonst umbrechen (kein erzwungenes Zweizeiler-Layout).
                            Text(verbatim: "int number = 5  |  double x = 1.5  |  String text = \"Your text\"  |  boolean ok = true  |  char letter = 'A'  |  const double PI = 3.14")
                                .font(inspectorHintFont)
                                .foregroundStyle(.secondary)
                                .fixedSize(horizontal: false, vertical: true)
                        } else if ioModeBinding.wrappedValue == .input {
                            Text(verbatim: "input: int age \"Enter age\" | input: double price \"Enter price\" | input: String name \"Enter name\"")
                                .font(inspectorHintFont)
                                .foregroundStyle(.secondary)
                        } else if ioModeBinding.wrappedValue == .output {
                            Text(verbatim: "output: number  |  output: \"Your text\"  |  output: \"Your age: \" + age")
                                .font(inspectorHintFont)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .padding(.bottom, 2)
                }
                if let labelBinding = multiwayCaseLabelBinding() {
                    TextField("z. B. 1, ok, default", text: labelBinding)
                        .font(editorFont)
                        .textFieldStyle(.roundedBorder)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled(true)
                        .focused($focusedField, equals: .caseLabel)
                }
                if inspectorShowsForLoopThreeFields {
                    if horizontalSizeClass == .regular {
                        HStack(alignment: .top, spacing: 12) {
                            ForEach(0 ..< 3, id: \.self) { i in
                                forLoopInspectorColumn(i, captionFont: captionFont, editorFont: editorFont)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                            }
                        }
                    } else {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(alignment: .top, spacing: 12) {
                                ForEach(0 ..< 3, id: \.self) { i in
                                    forLoopInspectorColumn(i, captionFont: captionFont, editorFont: editorFont)
                                        .frame(minWidth: 128, alignment: .leading)
                                }
                            }
                        }
                    }
                } else {
                    VStack(alignment: .leading, spacing: 6) {
                        if let condHint = inspectorConditionEditorHintLine() {
                            Text(verbatim: condHint)
                                .font(inspectorHintFont)
                                .foregroundStyle(.secondary)
                                .fixedSize(horizontal: false, vertical: true)
                        }
                        HStack(alignment: .top, spacing: 8) {
                            if let prefixLabel = lineEditorFixedPrefixLabel {
                                Text(verbatim: prefixLabel)
                                    .font(.system(size: editorMonoPt, weight: .regular, design: .monospaced))
                                    .foregroundStyle(.secondary)
                                    .padding(.top, 10)
                                    .allowsHitTesting(false)
                            }
                            ZStack(alignment: .topLeading) {
                                CodeLineEditor(
                                    text: lineEditorVisibleTextBinding,
                                    minHeight: editorMinHeight,
                                    maxHeight: editorMaxHeight,
                                    focusToken: editorFocusToken,
                                    onCommit: applyLineEditor,
                                    monospacedFontSize: editorMonoPt
                                )
                                .scrollContentBackground(.hidden)
                                .textInputAutocapitalization(.never)
                                .autocorrectionDisabled(true)
                                .overlay(RoundedRectangle(cornerRadius: 6).stroke(.quaternary))
                                .focused($focusedField, equals: .textEditor)

                                if selectedPath != nil,
                                   lineEditorVisibleTextBinding.wrappedValue.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
                                   let placeholder = inspectorLineEditorPlaceholder() {
                                    Text(placeholder)
                                        .font(inspectorHintFont)
                                        .foregroundStyle(.secondary)
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 10)
                                        .allowsHitTesting(false)
                                }
                            }
                            .frame(maxWidth: .infinity)
                        }
                    }
                    Button(lang.tr("inspector_apply_text")) {
                        applyLineEditorRespectingTextFocus()
                    }
                    .disabled(selectedPath == nil)
                }
                if let faPath = multiwayAncestorPath(for: selectedPath) {
                    let faCaseCount =
                        (try? VisuStructDocumentEditing.element(at: faPath, in: document))?.cases?.count ?? 0
                    let removeCaseIdx = selectedCaseIndex(multiwayPath: faPath, selectedPath: selectedPath)
                    HStack(spacing: 16) {
                        Button {
                            addCaseToFallauswahl(at: faPath)
                        } label: {
                            Label(lang.tr("inspector_add_case"), systemImage: "plus.rectangle.on.rectangle")
                        }
                        .buttonStyle(.bordered)
                        Button(role: .destructive) {
                            if let idx = removeCaseIdx {
                                removeCaseFromFallauswahl(at: faPath, caseIndex: idx)
                            }
                        } label: {
                            Label(lang.tr("inspector_remove_case"), systemImage: "minus.rectangle")
                        }
                        .buttonStyle(.bordered)
                        .disabled(faCaseCount <= 2 || removeCaseIdx == nil)
                    }
                }
            }
        } label: {
            Text(inspectorGroupBoxTitle)
                .font(.headline)
        }
    }

    private func statementIOModeBindingIfApplicable() -> Binding<StatementIOMode>? {
        guard let path = selectedPath,
              let el = try? VisuStructDocumentEditing.element(at: path, in: document),
              el.type == .anweisung else { return nil }

        return Binding(
            get: {
                statementIOMode(for: sheetTabs[currentTabIndex].lineEditorText)
            },
            set: { newMode in
                var tabs = sheetTabs
                let i = currentTabIndex
                let current = tabs[i].lineEditorText
                let stripped = stripIOPrefixes(from: current)
                let updated: String
                switch newMode {
                case .statement:
                    updated = stripped
                case .input:
                    updated = prefix("input:", to: stripped)
                case .output:
                    updated = prefix("output:", to: stripped)
                }
                tabs[i].lineEditorText = updated
                sheetTabs = tabs
                applyLineEditorRespectingTextFocus()
            }
        )
    }

    private func statementIOModeIfApplicable() -> StatementIOMode? {
        guard let path = selectedPath,
              let el = try? VisuStructDocumentEditing.element(at: path, in: document),
              el.type == .anweisung else { return nil }

        return statementIOMode(for: sheetTabs[currentTabIndex].lineEditorText)
    }

    private func statementIOMode(for text: String) -> StatementIOMode {
        let t = text.trimmingCharacters(in: .whitespacesAndNewlines)
        if t.lowercased().hasPrefix("input:") { return .input }
        if t.lowercased().hasPrefix("output:") { return .output }
        if t.lowercased().hasPrefix("print:") { return .output }
        return .statement
    }

    private func stripIOPrefixes(from s: String) -> String {
        let trimmed = s.trimmingCharacters(in: .whitespacesAndNewlines)
        let lower = trimmed.lowercased()
        if lower.hasPrefix("input:") {
            return String(trimmed.dropFirst(6)).trimmingCharacters(in: .whitespacesAndNewlines)
        }
        if lower.hasPrefix("output:") {
            return String(trimmed.dropFirst(7)).trimmingCharacters(in: .whitespacesAndNewlines)
        }
        if lower.hasPrefix("print:") {
            return String(trimmed.dropFirst(6)).trimmingCharacters(in: .whitespacesAndNewlines)
        }
        return s
    }

    private func stripLineEditorPrefix(_ p: String, from s: String) -> String {
        if p == "input:" || p == "output:" {
            return stripIOPrefixes(from: s)
        }
        return stripKeywordPrefix(p, from: s)
    }

    private func stripLineEditorPrefixForEditing(_ p: String, from s: String) -> String {
        if p == "input:" || p == "output:" {
            return stripIOPrefixPreservingEditingWhitespace(from: s)
        }
        return stripKeywordPrefixPreservingEditingWhitespace(p, from: s)
    }

    private func stripIOPrefixPreservingEditingWhitespace(from s: String) -> String {
        let leadingTrimmed = String(s.drop(while: { $0.isWhitespace }))
        let lower = leadingTrimmed.lowercased()
        if lower.hasPrefix("input:") {
            return dropOneLeadingWhitespace(String(leadingTrimmed.dropFirst(6)))
        }
        if lower.hasPrefix("output:") {
            return dropOneLeadingWhitespace(String(leadingTrimmed.dropFirst(7)))
        }
        if lower.hasPrefix("print:") {
            return dropOneLeadingWhitespace(String(leadingTrimmed.dropFirst(6)))
        }
        return s
    }

    private func stripKeywordPrefix(_ keyword: String, from s: String) -> String {
        let trimmed = s.trimmingCharacters(in: .whitespacesAndNewlines)
        let lower = trimmed.lowercased()
        let key = keyword.lowercased()
        guard lower.hasPrefix(key) else { return s }

        let afterKeyword = trimmed.dropFirst(keyword.count)
        guard afterKeyword.isEmpty || afterKeyword.first?.isWhitespace == true || afterKeyword.first == "(" else {
            return s
        }

        var content = String(afterKeyword).trimmingCharacters(in: .whitespacesAndNewlines)
        if content.hasPrefix("("), content.hasSuffix(")"), content.count >= 2 {
            content.removeFirst()
            content.removeLast()
            content = content.trimmingCharacters(in: .whitespacesAndNewlines)
        }
        return content
    }

    private func stripKeywordPrefixPreservingEditingWhitespace(_ keyword: String, from s: String) -> String {
        let leadingTrimmed = String(s.drop(while: { $0.isWhitespace }))
        let lower = leadingTrimmed.lowercased()
        let key = keyword.lowercased()
        guard lower.hasPrefix(key) else { return s }

        let afterKeyword = leadingTrimmed.dropFirst(keyword.count)
        guard afterKeyword.isEmpty || afterKeyword.first?.isWhitespace == true || afterKeyword.first == "(" else {
            return s
        }

        let content = dropOneLeadingWhitespace(String(afterKeyword))
        if content.hasPrefix("("), content.hasSuffix(")"), content.count >= 2 {
            return String(content.dropFirst().dropLast())
        }
        return content
    }

    private func dropOneLeadingWhitespace(_ s: String) -> String {
        guard let first = s.first, first.isWhitespace else { return s }
        return String(s.dropFirst())
    }

    private func prefix(_ p: String, to content: String) -> String {
        let c = content.trimmingCharacters(in: .whitespacesAndNewlines)
        if c.isEmpty { return "\(p) " }
        return "\(p) \(c)"
    }

    private func prefixPreservingEditingWhitespace(_ p: String, to content: String) -> String {
        if content.isEmpty { return "\(p) " }
        return "\(p) \(content)"
    }

    /// Placeholder for the line editor, shown only when empty (grau im Feld). Code-Beispiele als Hilfe: `inspectorConditionEditorHintLine()` darüber.
    private func inspectorLineEditorPlaceholder() -> String? {
        guard let path = selectedPath,
              let el = try? VisuStructDocumentEditing.element(at: path, in: document) else { return nil }

        switch el.type {
        case .anweisung:
            switch statementIOMode(for: sheetTabs[currentTabIndex].lineEditorText) {
            case .statement:
                return lang.tr("inspector_placeholder_statement")
            case .input:
                return "int age \"Enter age\""
            case .output:
                return "\"Your age: \" + age"
            }
        case .forSchleife:
            return nil
        case .verzweigung, .whileSchleife, .doUntilSchleife, .endlosschleife:
            return lang.tr("inspector_placeholder_condition")
        case .fallauswahl:
            return lang.tr("inspector_placeholder_selector")
        case .aufruf:
            return lang.tr("inspector_placeholder_call")
        case .aussprung:
            return lang.tr("inspector_placeholder_break")
        case .leerElement:
            return nil
        }
    }

    /// Sichtbare Hilfszeile über dem Bedingungs-Editor (wie Statement-Hinweis unter dem Modus-Picker) — Englisch, code-like.
    private func inspectorConditionEditorHintLine() -> String? {
        guard let path = selectedPath,
              let el = try? VisuStructDocumentEditing.element(at: path, in: document) else { return nil }
        switch el.type {
        case .verzweigung:
            return "age >= 18"
        case .whileSchleife:
            return "i < 10"
        case .doUntilSchleife:
            return "again == 1"
        case .fallauswahl:
            // Ausdruck in Klammern: switch (day) { … } — gleicher Stil wie die anderen Hinweise (englisch, code-nah).
            return "day"
        default:
            return nil
        }
    }

    @ViewBuilder
    private var inspectorPanelPhoneAware: some View {
        if !isPhone {
            inspectorPanel
        } else {
            if insertTarget != nil {
                Button {
                    insertTarget = nil
                } label: {
                    Label(lang.tr("phone_insert_cancel"), systemImage: "xmark.circle")
                }
                .buttonStyle(.bordered)
            } else if hideInspectorOnPhone {
                Button {
                    hideInspectorOnPhone = false
                } label: {
                    Label(lang.tr("phone_show_text_editor"), systemImage: "chevron.up")
                }
                .buttonStyle(.bordered)
            } else {
                inspectorPanel
            }
        }
    }

    #if canImport(UIKit)
    private func updateKeyboardOverlap(from notification: Notification) {
        guard let frameValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue else {
            keyboardOverlap = 0
            return
        }
        let endFrame = frameValue.cgRectValue
        keyboardOverlap = Self.keyboardOverlapHeight(endFrame: endFrame)
    }

    private static func keyboardOverlapHeight(endFrame: CGRect) -> CGFloat {
        // Floating keyboard on iPad may not cover the bottom edge at all.
        guard let scene = UIApplication.shared.connectedScenes.first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene,
              let window = scene.windows.first(where: { $0.isKeyWindow }) else {
            let h = max(0, UIScreen.main.bounds.maxY - endFrame.minY)
            return h
        }
        let endInWindow = window.convert(endFrame, from: nil)
        let overlap = max(0, window.bounds.maxY - endInWindow.minY)
        return overlap
    }
    #endif

    /// Innerste **Fallauswahl** (`multiway`), die die aktuelle Auswahl enthält (für „Fall hinzufügen“).
    private func multiwayAncestorPath(for path: [Int]?) -> [Int]? {
        guard let path, !path.isEmpty else { return nil }
        let doc = document
        for len in stride(from: path.count, through: 1, by: -1) {
            let prefix = Array(path.prefix(len))
            if let el = try? VisuStructDocumentEditing.element(at: prefix, in: doc),
               el.type == .fallauswahl {
                return prefix
            }
        }
        return nil
    }

    private func addCaseToFallauswahl(at fallPath: [Int]) {
        do {
            let (updated, newPath) = try VisuStructDocumentEditing.appendCaseToFallauswahl(document, fallauswahlPath: fallPath)
            commitDocument(updated)
            var tabs = sheetTabs
            let i = currentTabIndex
            tabs[i].selectedPath = newPath
            tabs[i].errorText = nil
            sheetTabs = tabs
            refreshLineEditor()
        } catch {
            setErrorOnCurrentTab(error.localizedDescription)
        }
    }

    /// Spaltenindex der Fallauswahl, wenn die Auswahl **in** einer Spalte liegt (`[…, fall, spalte, …]`).
    private func selectedCaseIndex(multiwayPath: [Int], selectedPath: [Int]?) -> Int? {
        guard let sp = selectedPath, sp.count > multiwayPath.count else { return nil }
        return sp[multiwayPath.count]
    }

    private func removeCaseFromFallauswahl(at fallPath: [Int], caseIndex: Int) {
        do {
            let (updated, newPath) = try VisuStructDocumentEditing.removeCaseFromFallauswahl(
                document, fallauswahlPath: fallPath, caseIndex: caseIndex
            )
            commitDocument(updated)
            var tabs = sheetTabs
            let i = currentTabIndex
            tabs[i].selectedPath = newPath
            tabs[i].errorText = nil
            sheetTabs = tabs
            refreshLineEditor()
        } catch {
            setErrorOnCurrentTab(error.localizedDescription)
        }
    }

    /// Bindung für den **Fallnamen**, wenn die Auswahl in einer Spalte einer Fallauswahl liegt (nicht beim bloßen Kopf `[n]` ohne Folgeindex).
    private func multiwayCaseLabelBinding() -> Binding<String>? {
        guard let fa = multiwayAncestorPath(for: selectedPath),
              let sp = selectedPath,
              sp.count > fa.count else { return nil }
        let caseIdx = sp[fa.count]
        return Binding(
            get: {
                let d = self.document
                guard let e = try? VisuStructDocumentEditing.element(at: fa, in: d),
                      let c = e.cases, caseIdx >= 0, caseIdx < c.count else { return "" }
                return c[caseIdx].name
            },
            set: { newVal in
                let t = newVal.trimmingCharacters(in: .whitespacesAndNewlines)
                guard !t.isEmpty else { return }
                applyFallauswahlCaseName(fallPath: fa, caseIndex: caseIdx, name: newVal)
            }
        )
    }

    private func applyFallauswahlCaseName(fallPath: [Int], caseIndex: Int, name: String) {
        do {
            let updated = try VisuStructDocumentEditing.setFallauswahlCaseName(
                document, fallauswahlPath: fallPath, caseIndex: caseIndex, name: name
            )
            commitDocument(updated)
        } catch {
            setErrorOnCurrentTab(error.localizedDescription)
        }
    }

    /// Titel der Textbox: Kacheltyp statt generischem „ausgewähltes Element“ (Diagramm-Titel steht oben separat).
    private var inspectorGroupBoxTitle: String {
        guard let path = selectedPath,
              let el = try? VisuStructDocumentEditing.element(at: path, in: document) else {
            return lang.tr("inspector_group_element")
        }
        return Self.localizedElementTypeName(el.type, lang: lang)
    }

    private func padForLoopTextLines(_ lines: [String]) -> [String] {
        var a = lines.isEmpty ? [""] : lines
        while a.count < 3 { a.append("") }
        if a.count > 3 { return Array(a.prefix(3)) }
        return a
    }

    private func normalizeForLoopPart(_ s: String) -> String {
        var x = normalizeQuotesForCode(s)
        while true {
            let trimmedEnd = x.trimmingCharacters(in: .whitespacesAndNewlines)
            guard trimmedEnd.hasSuffix(";") else { return x }
            x = String(trimmedEnd.dropLast()).trimmingCharacters(in: .whitespacesAndNewlines)
        }
    }

    private var inspectorShowsForLoopThreeFields: Bool {
        guard let path = selectedPath,
              let el = try? VisuStructDocumentEditing.element(at: path, in: document) else { return false }
        return el.type == .forSchleife
    }

    private func forLoopPartBinding(part index: Int) -> Binding<String> {
        Binding(
            get: {
                guard (0 ..< 3).contains(index),
                      let path = selectedPath,
                      let el = try? VisuStructDocumentEditing.element(at: path, in: document) else { return "" }
                let padded = padForLoopTextLines(el.textLines)
                return padded[index]
            },
            set: { newVal in
                guard (0 ..< 3).contains(index), let path = selectedPath else { return }
                guard let el = try? VisuStructDocumentEditing.element(at: path, in: document),
                      el.type == .forSchleife else { return }
                var lines = padForLoopTextLines(el.textLines)
                lines[index] = normalizeForLoopPart(newVal)
                do {
                    commitDocument(try VisuStructDocumentEditing.setTextLines(document, path: path, lines: lines))
                    // `lineEditorText` wird bei den drei For-Feldern nicht mitgetippt; sonst würde z. B.
                    // „Code erzeugen“ veralteten Puffer per `applyLineEditor` ins Element schreiben.
                    var tabs = sheetTabs
                    let i = currentTabIndex
                    tabs[i].lineEditorText = lines.joined(separator: "\n")
                    sheetTabs = tabs
                } catch {
                    setErrorOnCurrentTab(error.localizedDescription)
                }
            }
        )
    }

    private func forLoopInspectorColumn(_ index: Int, captionFont: Font, editorFont: Font) -> some View {
        let label: String
        let placeholder: String
        switch index {
        case 0:
            label = lang.tr("inspector_for_init")
            placeholder = lang.tr("inspector_for_placeholder_init")
        case 1:
            label = lang.tr("inspector_for_condition")
            placeholder = lang.tr("inspector_for_placeholder_condition")
        default:
            label = lang.tr("inspector_for_step")
            placeholder = lang.tr("inspector_for_placeholder_step")
        }
        return VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(captionFont)
                .foregroundStyle(.secondary)
            TextField("", text: forLoopPartBinding(part: index), prompt: Text(placeholder))
                .font(editorFont)
                .textFieldStyle(.roundedBorder)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled(true)
                .focused($focusedField, equals: .forLoopPart(index))
        }
    }

    private static func localizedElementTypeName(_ type: VisuStructElementType, lang: AppLanguage) -> String {
        switch type {
        case .anweisung: return lang.tr("element_anweisung")
        case .verzweigung: return lang.tr("element_verzweigung")
        case .fallauswahl: return lang.tr("element_fallauswahl")
        case .forSchleife: return lang.tr("element_forSchleife")
        case .whileSchleife: return lang.tr("element_whileSchleife")
        case .doUntilSchleife: return lang.tr("element_doUntilSchleife")
        case .endlosschleife: return lang.tr("element_endlosschleife")
        case .aussprung: return lang.tr("element_aussprung")
        case .aufruf: return lang.tr("element_aufruf")
        case .leerElement: return lang.tr("element_leerElement")
        }
    }

    private static let maxUndoSteps = 80

    /// Ersetzt das Dokument und legt einen Undo-Snapshot des bisherigen Zustands ab.
    private func commitDocument(_ new: VisuStructDocument) {
        let i = currentTabIndex
        var tabs = sheetTabs
        var tab = tabs[i]
        guard new != tab.document else { return }
        tab.undoStack.append(tab.document)
        while tab.undoStack.count > Self.maxUndoSteps {
            tab.undoStack.removeFirst()
        }
        tab.redoStack.removeAll()
        tab.document = new
        tabs[i] = tab
        sheetTabs = tabs
    }

    /// Neu / Import: Historie verwerfen, Zustand setzen.
    private func resetHistoryAndDocument(_ new: VisuStructDocument) {
        let i = currentTabIndex
        var tabs = sheetTabs
        tabs[i].undoStack.removeAll()
        tabs[i].redoStack.removeAll()
        tabs[i].document = new
        tabs[i].savedDocumentBaseline = VisuStructXMLCodec.encode(new)
        sheetTabs = tabs
    }

    private func performUndo() {
        let i = currentTabIndex
        var tabs = sheetTabs
        var tab = tabs[i]
        guard let previous = tab.undoStack.popLast() else { return }
        tab.redoStack.append(tab.document)
        tab.document = previous
        tab.errorText = nil
        tabs[i] = tab
        sheetTabs = tabs
        syncTabTitleWithDocumentCaption(tabIndex: i)
        sanitizeSelectionAfterHistoryJump()
        refreshLineEditor()
    }

    private func performRedo() {
        let i = currentTabIndex
        var tabs = sheetTabs
        var tab = tabs[i]
        guard let next = tab.redoStack.popLast() else { return }
        tab.undoStack.append(tab.document)
        while tab.undoStack.count > Self.maxUndoSteps {
            tab.undoStack.removeFirst()
        }
        tab.document = next
        tab.errorText = nil
        tabs[i] = tab
        sheetTabs = tabs
        syncTabTitleWithDocumentCaption(tabIndex: i)
        sanitizeSelectionAfterHistoryJump()
        refreshLineEditor()
    }

    private func sanitizeSelectionAfterHistoryJump() {
        let i = currentTabIndex
        var tabs = sheetTabs
        var tab = tabs[i]
        let doc = tab.document
        if doc.elements.isEmpty {
            tab.selectedPath = nil
        } else if tab.selectedPath == nil {
            tab.selectedPath = [0]
        } else if let path = tab.selectedPath,
                  (try? VisuStructDocumentEditing.element(at: path, in: doc)) == nil {
            tab.selectedPath = [0]
        }
        tabs[i] = tab
        sheetTabs = tabs
    }

    private func newDocument() {
        resetHistoryAndDocument(VisuStructDocumentEditing.newEmpty())
        var tabs = sheetTabs
        let i = currentTabIndex
        let hadLinkedFile = tabs[i].linkedFileDisplayName != nil || tabs[i].linkedFileBookmarkData != nil
        tabs[i].selectedPath = [0]
        tabs[i].errorText = nil
        tabs[i].linkedFileBookmarkData = nil
        tabs[i].linkedFileDisplayName = nil
        // Wenn vorher eine Datei geöffnet/gespeichert war, soll „Neu“ wieder einen unbenannten Titel bekommen.
        if hadLinkedFile {
            let serial = nextTabSerial
            nextTabSerial += 1
            tabs[i].title = String(
                format: lang.tr("tab_title_format"),
                locale: Locale(identifier: lang.localeIdentifierForFormatting),
                arguments: [serial as CVarArg]
            )
        }
        sheetTabs = tabs
        refreshLineEditor()
    }

    /// Schreibt in die verknüpfte Datei; ohne Verknüpfung öffnet sich **Speichern unter …**.
    private func saveCurrentDocumentToFile() {
        guard let bookmark = sheetTabs[currentTabIndex].linkedFileBookmarkData else {
            showExporter = true
            return
        }
        var stale = false
        do {
            let url = try URL(
                resolvingBookmarkData: bookmark,
                options: [],
                relativeTo: nil,
                bookmarkDataIsStale: &stale
            )
            if stale {
                var tabs = sheetTabs
                tabs[currentTabIndex].linkedFileBookmarkData = nil
                sheetTabs = tabs
                showExporter = true
                return
            }
            guard url.startAccessingSecurityScopedResource() else {
                showExporter = true
                return
            }
            defer { url.stopAccessingSecurityScopedResource() }
            let docToSave = applyFilenameCaptionToCurrentDocumentIfNeeded(fileURL: url)
            let data = VisuStructXMLCodec.encode(docToSave)
            try data.write(to: url, options: .atomic)
            recentFilesStore.record(url: url, displayName: fileDisplayName(from: url))
            updateSavedBaselineForCurrentTab()
            clearErrorOnCurrentTab()
        } catch {
            setErrorOnCurrentTab(String(format: lang.tr("err_save_failed_fmt"), error.localizedDescription))
        }
    }

    private func appendRoot(_ element: VisuStructElement) {
        let doc = document
        if VisuStructDocumentEditing.isSingleRootPlaceholder(in: doc) {
            do {
                commitDocument(try VisuStructDocumentEditing.replaceAtPath(doc, path: [0], with: element))
                var tabs = sheetTabs
                tabs[currentTabIndex].selectedPath = [0]
                tabs[currentTabIndex].errorText = nil
                sheetTabs = tabs
                refreshLineEditor()
            } catch {
                setErrorOnCurrentTab(error.localizedDescription)
            }
        } else {
            commitDocument(VisuStructDocumentEditing.appendRoot(doc, element))
            var tabs = sheetTabs
            tabs[currentTabIndex].selectedPath = [tabs[currentTabIndex].document.elements.count - 1]
            tabs[currentTabIndex].errorText = nil
            sheetTabs = tabs
            refreshLineEditor()
        }
    }

    private func insertPaletteItem(_ item: ElementPalette.PaletteItem) {
        if isPhone {
            hideInspectorOnPhone = true
        }
        let el = ElementPalette.element(for: item, lang: lang)
        let doc = document
        do {
            if let t = insertTarget, isPhone {
                switch t {
                case .replace(let path):
                    commitDocument(try VisuStructDocumentEditing.replaceAtPath(doc, path: path, with: el))
                    var tabs = sheetTabs
                    tabs[currentTabIndex].selectedPath = path
                    tabs[currentTabIndex].errorText = nil
                    sheetTabs = tabs
                case .before(let path):
                    commitDocument(try VisuStructDocumentEditing.insertBeforeSibling(doc, el, before: path))
                    var tabs = sheetTabs
                    tabs[currentTabIndex].selectedPath = path
                    tabs[currentTabIndex].errorText = nil
                    sheetTabs = tabs
                case .after(let path):
                    commitDocument(try VisuStructDocumentEditing.insertAfterSibling(doc, el, after: path))
                    let newPath = Array(path.dropLast()) + [path.last! + 1]
                    var tabs = sheetTabs
                    tabs[currentTabIndex].selectedPath = newPath
                    tabs[currentTabIndex].errorText = nil
                    sheetTabs = tabs
                case .rootInsertAt0:
                    if VisuStructDocumentEditing.isSingleRootPlaceholder(in: doc) {
                        commitDocument(try VisuStructDocumentEditing.replaceAtPath(doc, path: [0], with: el))
                        var tabs = sheetTabs
                        tabs[currentTabIndex].selectedPath = [0]
                        tabs[currentTabIndex].errorText = nil
                        sheetTabs = tabs
                    } else {
                        commitDocument(try VisuStructDocumentEditing.insertAt(doc, parentPath: [], index: 0, element: el))
                        var tabs = sheetTabs
                        tabs[currentTabIndex].selectedPath = [0]
                        tabs[currentTabIndex].errorText = nil
                        sheetTabs = tabs
                    }
                case .rootAppend:
                    if VisuStructDocumentEditing.isSingleRootPlaceholder(in: doc) {
                        commitDocument(try VisuStructDocumentEditing.replaceAtPath(doc, path: [0], with: el))
                        var tabs = sheetTabs
                        tabs[currentTabIndex].selectedPath = [0]
                        tabs[currentTabIndex].errorText = nil
                        sheetTabs = tabs
                    } else {
                        let idx = doc.elements.count
                        commitDocument(try VisuStructDocumentEditing.insertAt(doc, parentPath: [], index: idx, element: el))
                        var tabs = sheetTabs
                        tabs[currentTabIndex].selectedPath = [idx]
                        tabs[currentTabIndex].errorText = nil
                        sheetTabs = tabs
                    }
                }
                insertTarget = nil
                refreshLineEditor()
                return
            }
        } catch {
            setErrorOnCurrentTab(error.localizedDescription)
            insertTarget = nil
            return
        }
        // iPad/Mac (ohne Tap-Einfügemarke): Ist ein Platzhalter (ø) ausgewählt, ersetzen — wie Drop auf die Mitte.
        // Sonst landet z. B. eine Verzweigung fälschlich als neues Wurzelelement unter der Schleife.
        if let path = sheetTabs[currentTabIndex].selectedPath,
           VisuStructDocumentEditing.isPlaceholderSlot(at: path, in: doc) {
            do {
                commitDocument(try VisuStructDocumentEditing.replaceAtPath(doc, path: path, with: el))
                var tabs = sheetTabs
                tabs[currentTabIndex].selectedPath = path
                tabs[currentTabIndex].errorText = nil
                sheetTabs = tabs
                refreshLineEditor()
            } catch {
                setErrorOnCurrentTab(error.localizedDescription)
            }
            return
        }
        // Ausgewählt ist ein „echtes“ Element: neues Palette-Element als Geschwister **direkt darunter**
        // (z. B. in der while-Schleife: nach dem if noch i++ einfügen).
        if let path = sheetTabs[currentTabIndex].selectedPath,
           (try? VisuStructDocumentEditing.element(at: path, in: doc)) != nil,
           !VisuStructDocumentEditing.isPlaceholderSlot(at: path, in: doc) {
            do {
                commitDocument(try VisuStructDocumentEditing.insertAfterSibling(doc, el, after: path))
                let newPath = Array(path.dropLast()) + [path.last! + 1]
                var tabs = sheetTabs
                tabs[currentTabIndex].selectedPath = newPath
                tabs[currentTabIndex].errorText = nil
                sheetTabs = tabs
                refreshLineEditor()
            } catch {
                setErrorOnCurrentTab(error.localizedDescription)
            }
            return
        }
        appendRoot(el)
    }

    private func deleteSelection() {
        guard let path = selectedPath else { return }
        let doc = document
        guard VisuStructDocumentEditing.canDeleteElement(at: path, in: doc) else { return }
        do {
            commitDocument(try VisuStructDocumentEditing.deleteAtPath(doc, path: path))
            var tabs = sheetTabs
            let i = currentTabIndex
            let newDoc = tabs[i].document
            if newDoc.elements.isEmpty {
                tabs[i].selectedPath = nil
            } else if (try? VisuStructDocumentEditing.element(at: path, in: newDoc)) == nil {
                tabs[i].selectedPath = [0]
            }
            tabs[i].errorText = nil
            sheetTabs = tabs
            refreshLineEditor()
        } catch {
            if let editErr = error as? VisuStructEditError, editErr == .cannotDeleteLastRootElement {
                return
            }
            setErrorOnCurrentTab(error.localizedDescription)
        }
    }

    @ViewBuilder
    private func paletteStructureRow(_ item: ElementPalette.PaletteItem, isCompact: Bool) -> some View {
        let rowInsets = isCompact
            ? EdgeInsets(top: 1, leading: 10, bottom: 1, trailing: 10)
            : EdgeInsets(top: 5, leading: 12, bottom: 5, trailing: 12)

        if isSimulationMode {
            Button {
                insertPaletteItem(item)
            } label: {
                Label(item.localizedTitle(in: lang), systemImage: item.symbolName)
                    .foregroundStyle(.tertiary)
                    .multilineTextAlignment(.leading)
            }
            .buttonStyle(PaletteListElementButtonStyle())
            .accessibilityAddTraits(.isButton)
            .disabled(true)
            .opacity(0.55)
            .listRowInsets(rowInsets)
            .listRowSeparator(.hidden)
            .listRowBackground(Color.clear)
        } else {
            Button {
                insertPaletteItem(item)
            } label: {
                Label(item.localizedTitle(in: lang), systemImage: item.symbolName)
                    .foregroundStyle(.primary)
                    .multilineTextAlignment(.leading)
            }
            .buttonStyle(PaletteListElementButtonStyle())
            .draggable(DiagramDragPayload(raw: ElementPalette.paletteDragIdentifier(item))) {
                paletteDragPreview(for: item)
            }
            .accessibilityAddTraits(.isButton)
            .listRowInsets(rowInsets)
            .listRowSeparator(.hidden)
            .listRowBackground(Color.clear)
        }
    }

    private func refreshLineEditor() {
        let i = currentTabIndex
        var tabs = sheetTabs
        let tab = tabs[i]
        guard let path = tab.selectedPath,
              let el = try? VisuStructDocumentEditing.element(at: path, in: tab.document) else {
            tabs[i].lineEditorText = ""
            sheetTabs = tabs
            return
        }
        tabs[i].lineEditorText = el.textLines.joined(separator: "\n")
        sheetTabs = tabs

        if !isPhone, focusedField == nil, el.type != .forSchleife {
            focusedField = .textEditor
            editorFocusToken = UUID()
        }
    }

    private func normalizeQuotesForCode(_ s: String) -> String {
        // iOS/macOS Eingaben ersetzen typografische Anführungszeichen teils automatisch.
        // Für Code wollen wir immer gerade Quotes.
        return s
            .replacingOccurrences(of: "“", with: "\"")
            .replacingOccurrences(of: "”", with: "\"")
            .replacingOccurrences(of: "„", with: "\"")
            .replacingOccurrences(of: "«", with: "\"")
            .replacingOccurrences(of: "»", with: "\"")
            .replacingOccurrences(of: "’", with: "'")
            .replacingOccurrences(of: "‘", with: "'")
            .replacingOccurrences(of: "‚", with: "'")
            .replacingOccurrences(of: "´", with: "'")
    }

    #if canImport(UIKit)
    /// Verlässt die aktive Eingabe im Key-Window, damit `UITextView` (Zeileneditor) sicher
    /// `textViewDidEndEditing` liefert und `lineEditorText` dem sichtbaren Inhalt entspricht.
    private func endKeyWindowEditing() {
        guard let scene = UIApplication.shared.connectedScenes
            .first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene,
            let w = scene.windows.first(where: { $0.isKeyWindow }) else { return }
        w.endEditing(true)
    }
    #endif

    /// Wendet den Zeileneditor an. Hat das Codefeld den SwiftUI-Fokus, zuerst Fokus lösen —
    /// sonst kann der letzte Tastatur-Stand auf iOS noch nicht in `lineEditorText` stehen
    /// (wie zuvor nur nach „Fertig“). Zusätzlich: Key-Window `endEditing`, falls `UITextView` und
    /// `@FocusState` kurz auseinanderlaufen.
    private func applyLineEditorRespectingTextFocus() {
        #if canImport(UIKit)
        endKeyWindowEditing()
        #endif
        if focusedField == .textEditor {
            focusedField = nil
            DispatchQueue.main.async {
                applyLineEditor()
            }
        } else {
            applyLineEditor()
        }
    }

    private func applyLineEditor() {
        guard let path = selectedPath else { return }
        if let el = try? VisuStructDocumentEditing.element(at: path, in: document), el.type == .forSchleife { return }
        let editorText = sheetTabs[currentTabIndex].lineEditorText
        let storedText: String
        if let labelPrefix = lineEditorFixedPrefixLabel {
            storedText = prefixPreservingEditingWhitespace(labelPrefix, to: stripLineEditorPrefixForEditing(labelPrefix, from: editorText))
        } else {
            storedText = editorText
        }
        let raw = storedText.components(separatedBy: "\n")
        let lines = (raw.isEmpty ? [""] : raw).map(normalizeQuotesForCode)
        do {
            commitDocument(try VisuStructDocumentEditing.setTextLines(document, path: path, lines: lines))
        } catch {
            setErrorOnCurrentTab(error.localizedDescription)
        }
    }

    private func exportPNG() {
        #if canImport(UIKit)
        guard let img = renderedDiagramUIImage() else {
            setErrorOnCurrentTab(lang.tr("err_diagram_too_small_export"))
            return
        }
        pngSharePayload = PNGSharePayload(image: img)
        #endif
    }

    #if canImport(UIKit)
    private func shareDocumentAsFile() {
        let data = VisuStructXMLCodec.encode(document)
        let fileName = exportFilenameForCurrentTab()
        let dir = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString, isDirectory: true)
        let tmp = dir.appendingPathComponent(fileName)
        do {
            try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
            try data.write(to: tmp, options: .atomic)
            fileURLSharePayload = FileURLSharePayload(url: tmp)
        } catch {
            setErrorOnCurrentTab(String(format: lang.tr("err_share_prepare_failed_fmt"), error.localizedDescription))
        }
    }

    /// DIN A4 in PDF-Punkten (72 pt/in); Inhalt per **AspectFit** in den bedruckbaren Rand skalieren.
    private enum A4SinglePageLayout {
        private static let portrait = CGSize(width: 595, height: 842)
        private static let landscape = CGSize(width: 842, height: 595)
        private static let margin: CGFloat = 32
        /// Etwas kleiner skalieren, damit randnahe Inhalte in PDF-Viewern/Druck sicher in die Seite passen.
        private static let scaleFudge: CGFloat = 0.98

        static func pageAndImageDrawRect(imageSize: CGSize) -> (pageBounds: CGRect, drawRect: CGRect) {
            let m = margin
            let iw = max(1, imageSize.width)
            let ih = max(1, imageSize.height)

            func maxScaleIn(content: CGSize) -> CGFloat {
                min(content.width / iw, content.height / ih) * Self.scaleFudge
            }

            let pContent = CGSize(width: portrait.width - 2 * m, height: portrait.height - 2 * m)
            let lContent = CGSize(width: landscape.width - 2 * m, height: landscape.height - 2 * m)
            let sPortrait = maxScaleIn(content: pContent)
            let sLandscape = maxScaleIn(content: lContent)

            if sLandscape > sPortrait {
                let cw = lContent.width
                let ch = lContent.height
                let s = sLandscape
                let sw = iw * s
                let sh = ih * s
                let x = m + (cw - sw) * 0.5
                let y = m + (ch - sh) * 0.5
                return (CGRect(origin: .zero, size: landscape), CGRect(x: x, y: y, width: sw, height: sh))
            } else {
                let cw = pContent.width
                let ch = pContent.height
                let s = sPortrait
                let sw = iw * s
                let sh = ih * s
                let x = m + (cw - sw) * 0.5
                let y = m + (ch - sh) * 0.5
                return (CGRect(origin: .zero, size: portrait), CGRect(x: x, y: y, width: sw, height: sh))
            }
        }
    }

    private func shareDiagramPDF() {
        guard let img = renderedDiagramUIImage() else {
            setErrorOnCurrentTab(lang.tr("err_diagram_too_small_export"))
            return
        }
        let fileName = pdfFilenameForCurrentTab()
        // Eigenes Temp-Verzeichnis + sauberer Dateiname, damit Quick Look nicht „UUID-…pdf“ als Titel zeigt.
        let dir = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString, isDirectory: true)
        let tmp = dir.appendingPathComponent(fileName)
        let (pageBounds, imageDrawRect) = A4SinglePageLayout.pageAndImageDrawRect(imageSize: img.size)
        let format = UIGraphicsPDFRendererFormat()
        format.documentInfo = [
            kCGPDFContextCreator as String: "VisuStruct",
            // Sichtbarer Titel steht im gerenderten Bild; Metadaten gleich mitzeichnen (Quick Look / PDF-Reader).
            kCGPDFContextTitle as String: exportVisibleDiagramTitle()
        ]
        let renderer = UIGraphicsPDFRenderer(bounds: pageBounds, format: format)
        do {
            try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
            // `UIGraphicsPDFRenderer` liefert einen Kontext, der `UIImage.draw(in:)` erwartet (Oben-Links) —
            // kein manuelles translate/scale(1,-1), sonst doppelt gedreht ≈ steht auf dem Kopf.
            try renderer.writePDF(to: tmp) { ctx in
                ctx.beginPage()
                img.draw(in: imageDrawRect)
            }
            pdfQuickLookURL = tmp
        } catch {
            setErrorOnCurrentTab(String(format: lang.tr("err_share_prepare_failed_fmt"), error.localizedDescription))
        }
    }
    #endif

    #if canImport(UIKit)
    /// Text für PDF/PNG/Druck: bei leerem Caption der lokalisierte Platzhalter (wie im Titelfeld).
    private func exportVisibleDiagramTitle() -> String {
        let t = document.caption.trimmingCharacters(in: .whitespacesAndNewlines)
        return t.isEmpty ? lang.tr("diagram_title_placeholder") : t
    }

    /// Titelhöhe für den Raster-Export: keine künstlich hohe `maxHeight` — sonst bei einer Zeile großer Leerraum bis zum Kasten.
    private func exportRasterTitleBlockHeight(rasterWidth: CGFloat) -> CGFloat {
        let hPad: CGFloat = 12 * 2
        let textW = max(1, rasterWidth - hPad)
        let title = exportVisibleDiagramTitle() as NSString
        let font = UIFont.systemFont(ofSize: 16, weight: .semibold)
        let h = title.boundingRect(
            with: CGSize(width: textW, height: 10_000),
            options: [.usesLineFragmentOrigin, .usesFontLeading],
            attributes: [.font: font],
            context: nil
        ).height
        // 2pt unter dem Text bis zum Blatt, max. 2 Zeilen auffangen (Sicherheits-Deckel).
        return min(56, ceil(h) + 2)
    }

    /// Gerendertes Struktogramm inkl. **sichtbarem** Diagrammtitel (gleiche Logik für PNG, PDF, Druck).
    private func renderedDiagramUIImage() -> UIImage? {
        let metrics = VisuStructLayoutEngine.diagramDisplayMetrics(isRegularWidth: horizontalSizeClass == .regular)
            .scaled(by: canvasScaleStep.multiplier)
        // Kompakt für PDF/PNG/Druck: engerer Layout-Rand, damit unter dem Titel weniger Leerraum bis zum Kasten entsteht.
        let exportInset: (left: Double, top: Double) = (12, 10)
        let layout = VisuStructLayoutEngine(metrics: metrics).layout(document: document, topLeadingContentInset: exportInset)
        // Volle logische Größe — früher 1400×1000: breite Struktogramme wurden rechts/unten hart abgeschnitten; A4-Downscale greift voll.
        let exportPixelCap: CGFloat = 8000
        let w = min(exportPixelCap, max(320, CGFloat(layout.canvasSize.width)))
        let h = min(exportPixelCap, max(320, CGFloat(layout.canvasSize.height)))
        let titleBlockH = exportRasterTitleBlockHeight(rasterWidth: w)
        let totalH = titleBlockH + h
        let size = CGSize(width: w, height: totalH)
        guard w > 2, h > 2, totalH > 2 else { return nil }
        let diagram = DiagramCanvasView(
            document: .constant(document),
            selectedPath: .constant(nil),
            errorText: .constant(nil),
            insertTarget: .constant(nil),
            elementClipboard: .constant(nil),
            canvasScaleStep: canvasScaleStep,
            layoutTopLeadingInset: exportInset,
            exportCanvasOuterMarginPt: 8
        )
        .frame(width: w, height: h)
        let exportRoot = VStack(alignment: .leading, spacing: 0) {
            Text(exportVisibleDiagramTitle())
                .font(.system(size: 16, weight: .semibold))
                .foregroundStyle(Color.primary)
                .lineLimit(2)
                .multilineTextAlignment(.leading)
                .fixedSize(horizontal: false, vertical: true)
                .frame(maxWidth: .infinity, alignment: .topLeading)
                .padding(.horizontal, 12)
                .padding(.bottom, 2)
            ZStack {
                Color(white: 0.98)
                diagram
            }
            .frame(width: w, height: h)
        }
        .frame(width: w, height: totalH, alignment: .topLeading)
        .background(Color(white: 0.98))
        .environment(\.horizontalSizeClass, horizontalSizeClass)
        .environment(\.appLanguage, lang)
        return Self.renderDiagramToUIImage(content: exportRoot, size: size, scale: displayScale)
    }

    private func printDiagram() {
        guard let img = renderedDiagramUIImage() else {
            setErrorOnCurrentTab(lang.tr("err_diagram_too_small_print"))
            return
        }
        guard UIPrintInteractionController.isPrintingAvailable else {
            setErrorOnCurrentTab(lang.tr("err_print_unavailable"))
            return
        }
        let info = UIPrintInfo(dictionary: nil)
        info.outputType = .photo
        info.jobName = exportVisibleDiagramTitle()
        let controller = UIPrintInteractionController.shared
        controller.printInfo = info
        controller.printingItem = img
        controller.present(animated: true)
    }
    #endif

    #if canImport(UIKit)
    /// `ImageRenderer` liefert bei `Canvas` manchmal `nil` oder leer — Fallback über `UIHostingController` + `drawHierarchy`.
    private static func renderDiagramToUIImage<V: View>(content: V, size: CGSize, scale: CGFloat) -> UIImage? {
        let renderer = ImageRenderer(content: content)
        renderer.proposedSize = ProposedViewSize(width: size.width, height: size.height)
        renderer.scale = scale
        if let ui = renderer.uiImage, ui.size.width > 2, ui.size.height > 2 {
            return ui
        }
        let hosting = UIHostingController(rootView: content)
        hosting.view.bounds = CGRect(origin: .zero, size: size)
        hosting.view.backgroundColor = UIColor(white: 0.98, alpha: 1)
        hosting.view.setNeedsLayout()
        hosting.view.layoutIfNeeded()
        let format = UIGraphicsImageRendererFormat()
        format.scale = scale
        let imgRenderer = UIGraphicsImageRenderer(size: size, format: format)
        return imgRenderer.image { _ in
            hosting.view.drawHierarchy(in: hosting.view.bounds, afterScreenUpdates: true)
        }
    }
    #endif

    @ViewBuilder
    private func paletteDragPreview(for item: ElementPalette.PaletteItem) -> some View {
        HStack(spacing: 8) {
            Image(systemName: item.symbolName)
            Text(item.localizedTitle(in: lang))
                .font(.callout.weight(.medium))
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 8))
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .strokeBorder(Color.blue.opacity(0.9), lineWidth: 2)
        )
        .shadow(color: .black.opacity(0.22), radius: 8, x: 0, y: 4)
    }
}

// MARK: - Simulation UI helpers

private extension View {
    func disabledAndDimmed(_ disabled: Bool, opacity: Double = 0.55) -> some View {
        self.disabled(disabled).opacity(disabled ? opacity : 1.0)
    }
}

// MARK: - Code-Generator (Oberfläche; IAP folgt)

private extension View {
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

/// iPad / Mac (nicht iPhone): Code-Generator als schwebendes, per Zieh-Leiste verschiebbares Panel — Diagramm bleibt sichtbar.
private struct DraggableCodeGeneratorFloatingPanel: View {
    @Binding var isPresented: Bool
    @Binding var document: VisuStructDocument
    /// Bei jeder erneuten „Code erzeugen“-Aktion hochzählen — Anzeige soll den aktuellen Stand reflektieren.
    var regenerationToken: Int

    @State private var dragOffset: CGSize = .zero
    @State private var dragBase: CGSize = .zero
    @State private var isDraggingPanel = false

    private let dragBarHeight: CGFloat = 28

    var body: some View {
        GeometryReader { geo in
            let panelW = min(620, geo.size.width - 40)
            let panelH = min(geo.size.height * 0.82, geo.size.height - 48)
            let margin: CGFloat = 10
            let maxOffsetX = max(0, geo.size.width / 2 - margin - panelW / 2)
            let maxOffsetY = max(0, geo.size.height / 2 - margin - panelH / 2)

            ZStack {
                Color.black.opacity(0.22)
                    .ignoresSafeArea()
                    .contentShape(Rectangle())
                    .onTapGesture { isPresented = false }

                VStack(spacing: 0) {
                    RoundedRectangle(cornerRadius: 2.5, style: .continuous)
                        .fill(Color.secondary.opacity(0.45))
                        .frame(width: 40, height: 5)
                        .padding(.vertical, (dragBarHeight - 5) / 2)
                        .frame(maxWidth: .infinity)
                        .contentShape(Rectangle())
                        .accessibilityLabel("Panel verschieben")
                        .gesture(
                            DragGesture()
                                .onChanged { value in
                                    let nx = dragBase.width + value.translation.width
                                    let ny = dragBase.height + value.translation.height
                                    var transaction = Transaction()
                                    transaction.animation = nil
                                    withTransaction(transaction) {
                                        isDraggingPanel = true
                                        dragOffset = CGSize(
                                            width: min(maxOffsetX, max(-maxOffsetX, nx)),
                                            height: min(maxOffsetY, max(-maxOffsetY, ny))
                                        )
                                    }
                                }
                                .onEnded { _ in
                                    var transaction = Transaction()
                                    transaction.animation = nil
                                    withTransaction(transaction) {
                                        dragBase = dragOffset
                                        isDraggingPanel = false
                                    }
                                }
                        )

                    CodeGeneratorPlaceholderSheet(
                        document: $document,
                        regenerationToken: regenerationToken,
                        onDismissExternal: { isPresented = false },
                        isInFloatingPanel: true
                    )
                    .frame(width: panelW, height: panelH - dragBarHeight)
                    .clipped()
                }
                .frame(width: panelW, height: panelH)
                .background(Color(.systemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                .shadow(color: .black.opacity(0.28), radius: 22, y: 10)
                .opacity(isDraggingPanel ? 0.08 : 1)
                .offset(dragBase)
                .transaction { transaction in
                    transaction.animation = nil
                }

                if isDraggingPanel {
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .fill(Color(.systemBackground).opacity(0.12))
                        .overlay(
                            RoundedRectangle(cornerRadius: 16, style: .continuous)
                                .strokeBorder(Color.accentColor.opacity(0.9), lineWidth: 2)
                        )
                        .shadow(color: .black.opacity(0.16), radius: 10, y: 4)
                        .frame(width: panelW, height: panelH)
                        .offset(dragOffset)
                        .allowsHitTesting(false)
                        .transaction { transaction in
                            transaction.animation = nil
                        }
                }
            }
        }
        .onChange(of: isPresented) { _, on in
            if on {
                dragOffset = .zero
                dragBase = .zero
                isDraggingPanel = false
            }
        }
    }
}

private struct CodeGeneratorPaywallSheet: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.appLanguage) private var lang

    var body: some View {
        NavigationStack {
            ScrollView {
                Text(lang.tr("codegen_gate_body"))
                    .font(.body)
                    .lineSpacing(5)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(24)
            }
            .navigationTitle(lang.tr("codegen_gate_title"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button(lang.tr("codegen_gate_ok")) { dismiss() }
                }
            }
        }
        .presentationDragIndicator(.visible)
    }
}

private struct SimulationStatePanel: View {
    @Environment(\.appLanguage) private var lang
    let engine: VisuStructSimulationEngine
    let isPlaying: Bool
    @Binding var inputText: String
    @Binding var highlightModeRaw: String
    let onPlay: () -> Void
    let onPause: () -> Void
    let onStep: () -> Void
    let onSubmitInput: () -> Void
    let onStop: () -> Void

    private var sortedVariables: [(String, VisuStructSimulationValue)] {
        engine.state.variables
            .map { ($0.key, $0.value) }
            .sorted { $0.0.localizedStandardCompare($1.0) == .orderedAscending }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            VStack(alignment: .leading, spacing: 10) {
                Label(lang.tr("simulation_controls"), systemImage: "slider.horizontal.3")
                    .font(.headline)

                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                    SimulationControlButton(title: lang.tr("simulation_play"), systemImage: "play.fill", isDisabled: isPlaying || !engine.canStep, action: onPlay)
                    SimulationControlButton(title: lang.tr("simulation_pause"), systemImage: "pause.fill", isDisabled: !isPlaying, action: onPause)
                    SimulationControlButton(title: lang.tr("simulation_step"), systemImage: "arrow.right.circle", isDisabled: isPlaying || !engine.canStep, action: onStep)
                    SimulationControlButton(title: lang.tr("simulation_stop"), systemImage: "stop.fill", isDisabled: false, action: onStop)
                }

                VStack(alignment: .leading, spacing: 6) {
                    Text(lang.tr("simulation_highlight_label"))
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Picker(lang.tr("simulation_highlight_label"), selection: $highlightModeRaw) {
                        Text(lang.tr("simulation_highlight_last")).tag(SimulationHighlightMode.lastExecuted.rawValue)
                        Text(lang.tr("simulation_highlight_next")).tag(SimulationHighlightMode.nextToExecute.rawValue)
                    }
                    .pickerStyle(.segmented)
                }
            }

            SimulationPlaceholderCard(
                title: lang.tr("simulation_input"),
                systemImage: "keyboard",
                minHeight: engine.state.inputRequest == nil ? 86 : 112
            ) {
                if let request = engine.state.inputRequest {
                    VStack(alignment: .leading, spacing: 10) {
                        Text(request.prompt)
                            .font(.body)
                            .fixedSize(horizontal: false, vertical: true)
                        HStack(spacing: 8) {
                            TextField(request.variableName, text: $inputText)
                                .textFieldStyle(.roundedBorder)
                                .keyboardType(simulationInputKeyboardType(for: request.valueType))
                                .onSubmit(onSubmitInput)
                            Button(lang.tr("simulation_input_submit"), action: onSubmitInput)
                                .buttonStyle(.borderedProminent)
                        }
                        if let inputError = engine.state.inputError {
                            Text(inputError)
                                .font(.caption)
                                .foregroundStyle(.red)
                                .fixedSize(horizontal: false, vertical: true)
                        }
                    }
                } else {
                    Text(lang.tr("simulation_input_placeholder"))
                        .font(.body)
                        .foregroundStyle(.secondary)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }

            SimulationPlaceholderCard(
                title: lang.tr("simulation_trace"),
                systemImage: "arrow.left.arrow.right"
            ) {
                if let trace = engine.state.lastTrace {
                    Text(trace)
                        .font(.body.monospaced())
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .fixedSize(horizontal: false, vertical: true)
                } else {
                    Text(lang.tr("simulation_trace_placeholder"))
                        .font(.body)
                        .foregroundStyle(.secondary)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }

            SimulationPlaceholderCard(
                title: lang.tr("simulation_variables"),
                systemImage: "curlybraces",
                minHeight: 190,
                contentFillsHeight: true
            ) {
                if sortedVariables.isEmpty {
                    Text(lang.tr("simulation_variables_placeholder"))
                        .font(.body)
                        .foregroundStyle(.secondary)
                        .fixedSize(horizontal: false, vertical: true)
                } else {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 8) {
                            ForEach(sortedVariables, id: \.0) { name, value in
                                HStack(alignment: .firstTextBaseline) {
                                    Text(name)
                                        .font(.body.monospaced().weight(.semibold))
                                    Spacer(minLength: 12)
                                    Text(value.description)
                                        .font(.body.monospaced())
                                        .foregroundStyle(.secondary)
                                }
                            }
                        }
                        .padding(.trailing, 14)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                }
            }

            SimulationPlaceholderCard(
                title: lang.tr("simulation_output"),
                systemImage: "terminal",
                minHeight: 170,
                contentFillsHeight: true
            ) {
                if engine.state.outputLines.isEmpty {
                    Text(lang.tr("simulation_output_placeholder"))
                        .font(.body)
                        .foregroundStyle(.secondary)
                        .fixedSize(horizontal: false, vertical: true)
                } else {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 6) {
                            ForEach(Array(engine.state.outputLines.enumerated()), id: \.offset) { _, line in
                                Text(line)
                                    .font(.body.monospaced())
                                    .frame(maxWidth: .infinity, alignment: .leading)
                            }
                        }
                        .padding(.trailing, 4)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                }
            }
            .layoutPriority(1)

            if let message = engine.state.message {
                Text(message)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .background {
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(Color(.secondarySystemBackground))
        }
        .overlay {
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .strokeBorder(Color.primary.opacity(0.08), lineWidth: 1)
        }
    }

    private func simulationInputKeyboardType(for valueType: VisuStructSimulationValueType) -> UIKeyboardType {
        switch valueType {
        case .int:
            return .numberPad
        case .double:
            return .decimalPad
        case .string:
            return .default
        }
    }
}

private struct SimulationControlButton: View {
    let title: String
    let systemImage: String
    let isDisabled: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Label(title, systemImage: systemImage)
                .font(.subheadline.weight(.medium))
                .frame(maxWidth: .infinity, minHeight: 34)
        }
        .buttonStyle(.bordered)
        .disabled(isDisabled)
    }
}

private struct SimulationPlaceholderCard<Content: View>: View {
    let title: String
    let systemImage: String
    let minHeight: CGFloat
    let contentFillsHeight: Bool
    @ViewBuilder var content: () -> Content

    init(
        title: String,
        systemImage: String,
        minHeight: CGFloat = 130,
        contentFillsHeight: Bool = false,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.title = title
        self.systemImage = systemImage
        self.minHeight = minHeight
        self.contentFillsHeight = contentFillsHeight
        self.content = content
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label(title, systemImage: systemImage)
                .font(.headline)
            content()
                .frame(maxHeight: contentFillsHeight ? .infinity : nil, alignment: .topLeading)
            if !contentFillsHeight {
                Spacer(minLength: 0)
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, minHeight: minHeight, alignment: .topLeading)
        .background {
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .fill(Color(.tertiarySystemBackground))
        }
        .overlay {
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .strokeBorder(Color.primary.opacity(0.06), lineWidth: 1)
        }
    }
}

private struct CodeGeneratorPlaceholderSheet: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.appLanguage) private var lang
    @Binding var document: VisuStructDocument
    /// Wird bei jedem Tipp auf „Code erzeugen“ erhöht, damit der Text erneut aus dem aktuellen Dokument erzeugt wird.
    var regenerationToken: Int
    /// Wenn gesetzt (schwebendes Panel): schließt die äußere Präsentation statt `dismiss()`.
    var onDismissExternal: (() -> Void)? = nil
    /// `true`: kein Sheet-Ziehharmonika-Indikator (nur relevant im Vollbild-Sheet).
    var isInFloatingPanel: Bool = false

    /// Letzte Zielsprache für den Code-Generator (Java/Python/JavaScript); bleibt erhalten bis zur nächsten Umschaltung.
    @AppStorage("visustruct.codegen.target") private var codegenTarget: String = "java"
    @AppStorage("visustruct.codegen.javaOutputMode") private var javaOutputMode: String = "snippet"
    /// Wie in den iOS-Systemeinstellungen → VisuStruct (gleicher `UserDefaults`-Key).
    @AppStorage("visustruct.codegen.includeDiagramComments") private var includeDiagramComments = false
    @AppStorage("visustruct.codegen.includeEmptyElse") private var includeEmptyElse = true

    @State private var generatedCode = ""
    private static let javaTag = "java"
    private static let pythonTag = "python"
    private static let javascriptTag = "javascript"
    private static let javaSnippetTag = "snippet"
    private static let javaClassTag = "class"

    private var target: VisuStructCodeGenerator.Target {
        switch codegenTarget {
        case Self.pythonTag:
            return .python
        case Self.javascriptTag:
            return .javascript
        default:
            return .java
        }
    }

    private var codegenOptions: VisuStructCodeGenerator.Options {
        .init(
            baseIndent: 0,
            indentPerLevel: 4,
            includeDiagramTextAsComments: includeDiagramComments,
            includeEmptyElseBranch: includeEmptyElse
        )
    }

    @State private var showJavaScriptRunner = false
    @State private var javaScriptRunnerHTML = ""
    @State private var showJavaExporter = false
    @State private var javaExportDocument = JavaSourceExportDocument(source: "")
    @State private var javaExportDefaultName = "Main.java"

    private func normalizeCodegenTarget() {
        if codegenTarget != Self.javaTag,
           codegenTarget != Self.pythonTag,
           codegenTarget != Self.javascriptTag {
            codegenTarget = Self.javaTag
        }
    }

    private func normalizeJavaOutputMode() {
        if javaOutputMode != Self.javaSnippetTag,
           javaOutputMode != Self.javaClassTag {
            javaOutputMode = Self.javaSnippetTag
        }
    }

    private func refreshGeneratedCode() {
        normalizeJavaOutputMode()
        if target == .java, javaOutputMode == Self.javaClassTag {
            generatedCode = VisuStructCodeGenerator.generateJavaClassFile(
                document: document,
                options: codegenOptions,
                className: stemForJavaClassName()
            )
        } else {
            generatedCode = VisuStructCodeGenerator.generate(
                document: document,
                target: target,
                options: codegenOptions
            )
        }
    }

    private func stemForJavaClassName() -> String {
        let c = document.caption.trimmingCharacters(in: .whitespacesAndNewlines)
        if !c.isEmpty { return c }
        return "Main"
    }

    private func beginJavaExport() {
        let stem = stemForJavaClassName()
        let className = VisuStructCodeGenerator.sanitizedJavaClassName(stem)
        javaExportDocument = JavaSourceExportDocument(source: generatedCode)
        javaExportDefaultName = "\(className).java"
        showJavaExporter = true
    }

    /// Chrome für den eingebetteten JS-Runner: **Deutsch** nur bei App-Sprache Deutsch, sonst **Englisch** (alle anderen Locales / Java-Preset). Button: **Run** (einheitlich).
    private func javaScriptRunnerPageChrome() -> (htmlLang: String, title: String, heading: String, hintHTML: String) {
        if lang == .german {
            return (
                "de",
                "VisuStruct – JavaScript-Test",
                "VisuStruct – JavaScript-Test",
                #"Der Code läuft im Browser. <code>console.log</code> wird unten angezeigt. Endlosschleifen werden im Testlauf automatisch gestoppt."#
            )
        }
        return (
            "en",
            "VisuStruct – JavaScript Test",
            "VisuStruct – JavaScript Test",
            #"The code runs in the browser. <code>console.log</code> output appears below. Endless loops are stopped automatically during test runs."#
        )
    }

    private func javaScriptRunnerExecutableCode(_ js: String) -> String {
        let guardedJS = javaScriptWithEndlessLoopGuard(js)
        return javaScriptWithPromptCancelGuard(guardedJS)
    }

    private func javaScriptWithEndlessLoopGuard(_ js: String) -> String {
        let pattern = #"(?m)^(\s*)while\s*\(\s*true\s*\)(?:\s*/\*.*?\*/)?\s*\{"#
        guard let regex = try? NSRegularExpression(pattern: pattern) else { return js }

        let ns = js as NSString
        let matches = regex.matches(in: js, range: NSRange(location: 0, length: ns.length))
        guard !matches.isEmpty else { return js }

        let stopMessage = lang == .german
            ? "Ausführung gestoppt: mögliche Endlosschleife."
            : "Execution stopped: possible endless loop."
        var result = ""
        var last = 0

        for (index, match) in matches.enumerated() {
            result += ns.substring(with: NSRange(location: last, length: match.range.location - last))
            let indent = match.numberOfRanges > 1 ? ns.substring(with: match.range(at: 1)) : ""
            result += "\(indent)for (let __visuStructLoopGuard\(index) = 0; __visuStructLoopGuard\(index) < 100000 || (() => { throw new Error(\"\(stopMessage)\"); })(); __visuStructLoopGuard\(index)++) {"
            last = match.range.location + match.range.length
        }

        result += ns.substring(from: last)
        return result
    }

    private func javaScriptWithPromptCancelGuard(_ js: String) -> String {
        guard let regex = try? NSRegularExpression(pattern: #"\bprompt\s*\("#) else { return js }
        return regex.stringByReplacingMatches(
            in: js,
            range: NSRange(location: 0, length: (js as NSString).length),
            withTemplate: "__visuStructPrompt("
        )
    }

    private func openJavaScriptRunner(_ js: String) {
        // In-App Runner (WKWebView): zuverlässiger als Safari/data: auf iOS.
        let chrome = javaScriptRunnerPageChrome()
        let runnerJS = javaScriptRunnerExecutableCode(js)
        javaScriptRunnerHTML = """
        <!doctype html>
        <html lang="\(chrome.htmlLang)">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>\(chrome.title)</title>
          <style>
            body { margin: 0; font-family: -apple-system, system-ui, sans-serif; background: #0b1220; color: #e5e7eb; }
            header { padding: 14px 16px; background: #111827; border-bottom: 1px solid rgba(255,255,255,.08); }
            h1 { margin: 0; font-size: 14px; font-weight: 700; letter-spacing: .01em; }
            main { padding: 14px 16px; display: grid; gap: 12px; }
            pre { margin: 0; padding: 12px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; overflow: auto; }
            button { padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,.12); background: rgba(59,130,246,.22); color: #fff; font-weight: 700; }
            .hint { font-size: 12px; color: rgba(229,231,235,.75); line-height: 1.45; }
          </style>
        </head>
        <body>
          <header><h1>\(chrome.heading)</h1></header>
          <main>
            <div class="hint">\(chrome.hintHTML)</div>
            <button id="run">Run</button>
            <pre id="out"></pre>
            <script>
              const out = document.getElementById('out');
              const print = (s) => { out.textContent += s + "\\n"; };
              const old = console.log;
              console.log = (...args) => { old(...args); print(args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ')); };
              const __visuStructPrompt = (...args) => {
                const value = prompt(...args);
                if (value === null) { throw new Error("Execution cancelled."); }
                return value;
              };
            </script>
            <script id="usercode" type="text/plain">
        \(runnerJS)
            </script>
            <script>
              document.getElementById('run').addEventListener('click', () => {
                out.textContent = '';
                try {
                  // Re-run by evaluating the code block again
                  (0, eval)(document.getElementById('usercode').textContent);
                } catch (e) {
                  print(String(e));
                }
              });
            </script>
          </main>
        </body>
        </html>
        """
        showJavaScriptRunner = true
    }

    private func dismissPanel() {
        if let onDismissExternal {
            onDismissExternal()
        } else {
            dismiss()
        }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Picker("", selection: $codegenTarget) {
                        Text(lang.tr("codegen_target_java")).tag(Self.javaTag)
                        Text(lang.tr("codegen_target_python")).tag(Self.pythonTag)
                        Text(lang.tr("codegen_target_javascript")).tag(Self.javascriptTag)
                    }
                    .pickerStyle(.segmented)
                    .onAppear {
                        normalizeCodegenTarget()
                        normalizeJavaOutputMode()
                        refreshGeneratedCode()
                    }

                    if target == .java {
                        Picker(lang.tr("codegen_java_output_mode"), selection: $javaOutputMode) {
                            Text(lang.tr("codegen_java_output_snippet")).tag(Self.javaSnippetTag)
                            Text(lang.tr("codegen_java_output_class")).tag(Self.javaClassTag)
                        }
                        .pickerStyle(.segmented)
                        .accessibilityLabel(lang.tr("codegen_java_output_mode"))
                    }

                    Text(verbatim: generatedCode)
                        .font(.system(.body, design: .monospaced))
                        .textSelection(.enabled)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(12)
                        .background(Color(uiColor: .secondarySystemGroupedBackground), in: RoundedRectangle(cornerRadius: 10, style: .continuous))
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(24)
            }
            .navigationTitle(lang.tr("codegen_placeholder_title"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                #if canImport(UIKit)
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        UIPasteboard.general.string = generatedCode
                    } label: {
                        Label(lang.tr("codegen_copy"), systemImage: "doc.on.doc")
                    }
                }
                if target == .java {
                    ToolbarItem(placement: .primaryAction) {
                        Button {
                            beginJavaExport()
                        } label: {
                            Label(lang.tr("codegen_save_java"), systemImage: "square.and.arrow.down")
                        }
                    }
                }
                if target == .javascript {
                    ToolbarItem(placement: .primaryAction) {
                        Button {
                            openJavaScriptRunner(generatedCode)
                        } label: {
                            Label(lang.tr("codegen_run_in_browser"), systemImage: "globe")
                        }
                    }
                }
                #endif
                ToolbarItem(placement: .confirmationAction) {
                    Button(lang.tr("codegen_gate_ok")) { dismissPanel() }
                }
            }
        }
        .codeGeneratorPresentationChrome(isFloatingPanel: isInFloatingPanel)
        .fileExporter(
            isPresented: $showJavaExporter,
            document: javaExportDocument,
            contentType: .plainText,
            defaultFilename: javaExportDefaultName
        ) { _ in }
        .sheet(isPresented: $showJavaScriptRunner) {
            JavaScriptRunnerSheet(html: javaScriptRunnerHTML)
        }
        .onChange(of: regenerationToken) { _, _ in
            refreshGeneratedCode()
        }
        .onChange(of: codegenTarget) { _, _ in
            normalizeCodegenTarget()
            refreshGeneratedCode()
        }
        .onChange(of: javaOutputMode) { _, _ in
            normalizeJavaOutputMode()
            refreshGeneratedCode()
        }
        .onChange(of: includeDiagramComments) { _, _ in
            refreshGeneratedCode()
        }
        .onChange(of: includeEmptyElse) { _, _ in
            refreshGeneratedCode()
        }
    }
}

// MARK: - JavaScript Runner (In-App)

private struct JavaScriptRunnerSheet: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.appLanguage) private var lang
    let html: String

    var body: some View {
        NavigationStack {
            JavaScriptRunnerWebView(html: html)
                .navigationTitle(lang.tr("codegen_run_in_browser"))
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .confirmationAction) {
                        Button(lang.tr("about_done")) { dismiss() }
                    }
                }
        }
        .presentationDragIndicator(.visible)
    }
}

#if canImport(UIKit) && canImport(WebKit)
private struct JavaScriptRunnerWebView: UIViewRepresentable {
    let html: String
    
    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> WKWebView {
        let cfg = WKWebViewConfiguration()
        cfg.defaultWebpagePreferences.allowsContentJavaScript = true
        cfg.preferences.javaScriptCanOpenWindowsAutomatically = true
        let v = WKWebView(frame: .zero, configuration: cfg)
        v.uiDelegate = context.coordinator
        v.isOpaque = false
        v.backgroundColor = .clear
        v.scrollView.backgroundColor = .clear
        return v
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        webView.loadHTMLString(html, baseURL: nil)
    }
    
    final class Coordinator: NSObject, WKUIDelegate {
        func webView(
            _ webView: WKWebView,
            runJavaScriptAlertPanelWithMessage message: String,
            initiatedByFrame frame: WKFrameInfo,
            completionHandler: @escaping () -> Void
        ) {
            presentAlert(on: webView, title: "Alert", message: message, completion: completionHandler)
        }
        
        func webView(
            _ webView: WKWebView,
            runJavaScriptConfirmPanelWithMessage message: String,
            initiatedByFrame frame: WKFrameInfo,
            completionHandler: @escaping (Bool) -> Void
        ) {
            presentConfirm(on: webView, title: "Confirm", message: message, completion: completionHandler)
        }
        
        func webView(
            _ webView: WKWebView,
            runJavaScriptTextInputPanelWithPrompt prompt: String,
            defaultText: String?,
            initiatedByFrame frame: WKFrameInfo,
            completionHandler: @escaping (String?) -> Void
        ) {
            presentPrompt(on: webView, title: prompt, defaultText: defaultText, completion: completionHandler)
        }
        
        private func topViewController() -> UIViewController? {
            guard let scene = UIApplication.shared.connectedScenes
                .compactMap({ $0 as? UIWindowScene })
                .first(where: { $0.activationState == .foregroundActive }) else { return nil }
            return scene.windows.first(where: { $0.isKeyWindow })?.rootViewController?.topMostPresented()
        }
        
        private func presentAlert(on webView: WKWebView, title: String, message: String, completion: @escaping () -> Void) {
            DispatchQueue.main.async {
                let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completion() })
                self.topViewController()?.present(alert, animated: true, completion: nil)
            }
        }
        
        private func presentConfirm(on webView: WKWebView, title: String, message: String, completion: @escaping (Bool) -> Void) {
            DispatchQueue.main.async {
                let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "Cancel", style: .cancel) { _ in completion(false) })
                alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completion(true) })
                self.topViewController()?.present(alert, animated: true, completion: nil)
            }
        }
        
        private func presentPrompt(on webView: WKWebView, title: String, defaultText: String?, completion: @escaping (String?) -> Void) {
            DispatchQueue.main.async {
                let alert = UIAlertController(title: title, message: nil, preferredStyle: .alert)
                alert.addTextField { tf in
                    tf.text = defaultText
                    tf.autocorrectionType = .no
                    tf.autocapitalizationType = .none
                }
                alert.addAction(UIAlertAction(title: "Cancel", style: .cancel) { _ in completion(nil) })
                alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
                    completion(alert.textFields?.first?.text)
                })
                self.topViewController()?.present(alert, animated: true, completion: nil)
            }
        }
    }
}
#else
private struct JavaScriptRunnerWebView: View {
    let html: String
    var body: some View {
        Text("WebView not available.")
    }
}
#endif

#if canImport(UIKit)
private extension UIViewController {
    func topMostPresented() -> UIViewController {
        var top: UIViewController = self
        while let presented = top.presentedViewController {
            top = presented
        }
        if let nav = top as? UINavigationController, let visible = nav.visibleViewController {
            return visible.topMostPresented()
        }
        if let tab = top as? UITabBarController, let sel = tab.selectedViewController {
            return sel.topMostPresented()
        }
        return top
    }
}
#endif

// MARK: - Über VisuStruct

private struct AboutVisuStructView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.appLanguage) private var lang

    private var versionLine: String {
        let short = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "—"
        let build = Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String ?? "—"
        return String(format: lang.tr("about_version_fmt"), short, build)
    }

    private let authorName = "Holger Sebastiao"
    // Öffentliches Java-Repo: maßgebliche Quelle & Releases (aktueller als dieses SwiftUI-Repo).
    private let projectDisplay = "code4teaching/VisuStruct"
    private let projectURL = URL(string: "https://github.com/code4teaching/VisuStruct")
    private let webDisplay = "www.visustruct.org"
    private let webURL = URL(string: "https://www.visustruct.org")
    private let developerDisplay = "www.sebastiao.org"
    private let developerURL = URL(string: "https://www.sebastiao.org")
    // Java-Referenzrepo (aktuell gepflegt): code4teaching/VisuStruct
    private let upstreamDisplay = "code4teaching/VisuStruct"
    private let upstreamURL = URL(string: "https://github.com/code4teaching/VisuStruct")

    /// Erklärtext mit hervorgehobener Endung `.visustruct`.
    private var aboutDateiformatExplainer: Text {
        Text(lang.tr("about_dateiformat_part1"))
            .font(.subheadline)
            .foregroundStyle(.secondary)
            + Text(".visustruct")
            .font(.subheadline.monospaced().weight(.semibold))
            .foregroundStyle(.primary)
            + Text(lang.tr("about_dateiformat_part2"))
            .font(.subheadline)
            .foregroundStyle(.secondary)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 28) {
                    HStack(alignment: .top, spacing: 16) {
                        Image(systemName: "info.circle.fill")
                            .font(.system(size: 42))
                            .foregroundStyle(Color.accentColor)
                            .padding(.top, 2)
                        VStack(alignment: .leading, spacing: 10) {
                            Text("VisuStruct")
                                .font(.title2.weight(.semibold))
                            Text(versionLine)
                                .font(.subheadline)
                                .monospacedDigit()
                                .foregroundStyle(.secondary)
                            Text(authorName)
                                .font(.title3.weight(.semibold))
                                .foregroundStyle(.primary)
                                .padding(.top, 2)

                            VStack(alignment: .leading, spacing: 6) {
                                if let projectURL {
                                    HStack(alignment: .firstTextBaseline, spacing: 8) {
                                        Text(lang.tr("about_project_github_label"))
                                            .foregroundStyle(.secondary)
                                        Link(projectDisplay, destination: projectURL)
                                    }
                                }
                                if let webURL {
                                    HStack(alignment: .firstTextBaseline, spacing: 8) {
                                        Text(lang.tr("about_web_label"))
                                            .foregroundStyle(.secondary)
                                        Link(webDisplay, destination: webURL)
                                    }
                                }
                                if let developerURL {
                                    HStack(alignment: .firstTextBaseline, spacing: 8) {
                                        Text(lang.tr("about_developer_label"))
                                            .foregroundStyle(.secondary)
                                        Link(developerDisplay, destination: developerURL)
                                    }
                                }
                            }
                            .font(.subheadline)
                        }
                    }

                    Divider()
                        .padding(.vertical, 4)

                    VStack(alignment: .leading, spacing: 12) {
                        Text(lang.tr("about_dateiformat_heading"))
                            .font(.headline)
                        aboutDateiformatExplainer
                    }

                    Divider()
                        .padding(.vertical, 8)

                    VStack(alignment: .leading, spacing: 10) {
                        Text(lang.tr("about_lineage_heading"))
                            .font(.headline)
                        Text(lang.tr("about_lineage_body"))
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                            .lineSpacing(4)
                        if let upstreamURL {
                            HStack(alignment: .firstTextBaseline, spacing: 6) {
                                Text(lang.tr("about_lineage_upstream_label"))
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                                Link(upstreamDisplay, destination: upstreamURL)
                                    .font(.subheadline)
                            }
                        }
                    }

                    Text(lang.tr("about_copyright"))
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                        .padding(.top, 8)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(28)
                .padding(.bottom, 16)
            }
            .navigationTitle(lang.tr("about_nav_title"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button(lang.tr("about_done")) { dismiss() }
                }
            }
        }
        .presentationDragIndicator(.visible)
    }
}

