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

// MARK: - ContentView

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

    // MARK: - Aktueller Tab & Metadaten

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

    // MARK: - Tab-Titel, Dateizugriff & Speicher-Baseline

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

    // MARK: - body

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

    // MARK: - Zwischenablage (Diagramm)

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

    // MARK: - Palette

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

    // MARK: - Haupteditor (NavigationStack, Tabs, Fehler)

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

    // MARK: - Diagramm-Reiter (Tabs)

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

    // MARK: - Editor-Ansicht (Bearbeiten vs. Simulation)

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

    // MARK: - Simulations-Ansicht

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

    // MARK: - Canvas (Simulation)

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

    // MARK: - Canvas & Diagrammtitel (Bearbeitung)

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

    // MARK: - Bindings (Dokument, Caption)

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

    // MARK: - Simulation (Modus & Steuerung)

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

    // MARK: - Tab-Titel & Reiter-Synchronisation

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

    // MARK: - Bindings (Auswahl, Zeileneditor)

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

    // MARK: - Fehleranzeige

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

    // MARK: - Export-Dateinamen & Slugs

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

    // MARK: - Diagramm-Reiter verwalten (Tabs öffnen/schließen)

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

    // MARK: - Inspector (unter dem Canvas)

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

    // MARK: - Inspector (iPhone: ein-/ausblendbar)

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

    // MARK: - Tastatur (Overlap unter dem Inspector)

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

    // MARK: - Fallauswahl (Multiway)

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

    // MARK: - Inspector: Zählschleife & Gruppentitel

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

    // MARK: - Lokalisierung Elementtyp (Inspector)

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

    // MARK: - Dokument: Commit, Undo & Redo

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

    // MARK: - Neue Datei & Tab zurücksetzen

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

    // MARK: - Diagramm bearbeiten (Wurzel, Palette, Einfügen)

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

    // MARK: - Auswahl löschen

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

    // MARK: - Zeileneditor (Synchronisation Element ↔ Textfeld)

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

    // MARK: - Export & Teilen (PNG, PDF, Druck, Datei)

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

    // MARK: - Palette Drag-Vorschau

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
