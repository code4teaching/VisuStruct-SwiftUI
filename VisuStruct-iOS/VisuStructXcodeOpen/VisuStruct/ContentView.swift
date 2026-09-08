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
    @EnvironmentObject private var incomingDocuments: IncomingDocumentOpener

    private var isPhone: Bool {
        #if canImport(UIKit)
        return UIDevice.current.userInterfaceIdiom == .phone
        #else
        return false
        #endif
    }

    @FocusState private var focusedField: DiagramEditorFocusTarget?

    @State private var tabsModel: DiagramSheetTabsModel
    @State private var documentServices: DiagramEditorDocumentServices

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
    @ObservedObject private var recentFilesStore: RecentFilesStore
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
        let model = DiagramSheetTabsModel.makeInitial(language: startupLang)
        let recentStore = RecentFilesStore.shared
        _tabsModel = State(initialValue: model)
        _recentFilesStore = ObservedObject(wrappedValue: recentStore)
        _documentServices = State(initialValue: DiagramEditorDocumentServices(tabsModel: model, recentFilesStore: recentStore))
        _simulationEngine = State(initialValue: VisuStructSimulationEngine(document: model.tabs[0].document))
    }

    // MARK: - Tab-Titel & Dokument öffnen

    @discardableResult
    private func openDocument(from url: URL) -> Bool {
        documentServices.openDocument(
            from: url,
            resetHistoryAndDocument: resetHistoryAndDocument,
            refreshLineEditor: refreshLineEditor,
            setError: setErrorOnCurrentTab
        )
    }

    private func openRecentFile(_ recentFile: RecentVisuStructFile) {
        documentServices.openRecentFile(
            recentFile,
            resetHistoryAndDocument: resetHistoryAndDocument,
            refreshLineEditor: refreshLineEditor,
            setError: setErrorOnCurrentTab
        )
    }

    /// Finder / Dateien: Doppelklick bzw. „Öffnen mit“ auf `.visustruct`.
    private func openIncomingDocument(from url: URL) {
        guard url.isFileURL else { return }
        let ext = url.pathExtension.lowercased()
        guard ext == "visustruct" || ext == "xml" else { return }
        if isSimulationMode {
            endSimulationMode()
        }
        let tab = tabsModel.tabs[tabsModel.currentTabIndex]
        if tabsModel.tabHasUnsavedChanges(tab) || tab.linkedFileBookmarkData != nil {
            addDiagramTab()
        }
        _ = openDocument(from: url)
    }

    private var document: VisuStructDocument {
        tabsModel.tabs[tabsModel.currentTabIndex].document
    }

    private var selectedPath: [Int]? {
        tabsModel.tabs[tabsModel.currentTabIndex].selectedPath
    }

    private func replaceSelectedPathOnCurrentTab(_ path: [Int]?) {
        var tabs = tabsModel.tabs
        let i = tabsModel.currentTabIndex
        tabs[i].selectedPath = path
        tabsModel.tabs = tabs
    }

    private var unsavedCloseAlertBinding: Binding<Bool> {
        Binding(
            get: { tabsModel.pendingCloseTabId != nil },
            set: { if !$0 { tabsModel.pendingCloseTabId = nil } }
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
            DiagramCommandCenter.shared.update(file: diagramFileActions, edit: diagramEditActions)
            if let url = incomingDocuments.pendingURL {
                incomingDocuments.pendingURL = nil
                openIncomingDocument(from: url)
            }
        }
        .onReceive(NotificationCenter.default.publisher(for: DiagramMenuNotification.newDocument)) { _ in
            guard !isSimulationMode else { return }
            addDiagramTab()
        }
        .onReceive(NotificationCenter.default.publisher(for: DiagramMenuNotification.open)) { _ in
            guard !isSimulationMode else { return }
            showImporter = true
        }
        .onReceive(NotificationCenter.default.publisher(for: DiagramMenuNotification.save)) { _ in
            guard !isSimulationMode else { return }
            performPrimarySave()
        }
        .onReceive(NotificationCenter.default.publisher(for: DiagramMenuNotification.saveAs)) { _ in
            guard !isSimulationMode else { return }
            showExporter = true
        }
        .onReceive(NotificationCenter.default.publisher(for: DiagramMenuNotification.printDocument)) { _ in
            guard !isSimulationMode else { return }
            #if canImport(UIKit)
            printDiagram()
            #endif
        }
        .onReceive(NotificationCenter.default.publisher(for: DiagramMenuNotification.close)) { _ in
            guard !isSimulationMode else { return }
            requestCloseDiagramTab(id: tabsModel.selectedTabId)
        }
        .onReceive(NotificationCenter.default.publisher(for: DiagramMenuNotification.openRecent)) { note in
            guard !isSimulationMode else { return }
            guard let id = note.userInfo?[DiagramMenuNotification.recentFileIDKey] as? String,
                  let file = recentFilesStore.files.first(where: { $0.id == id }) else { return }
            openRecentFile(file)
        }
        .onChange(of: isSimulationMode) { _, _ in
            DiagramCommandCenter.shared.update(file: diagramFileActions, edit: diagramEditActions)
        }
        .onChange(of: incomingDocuments.pendingURL) { _, url in
            guard let url else { return }
            incomingDocuments.pendingURL = nil
            openIncomingDocument(from: url)
        }
        .alert(lang.tr("close_unsaved_title"), isPresented: unsavedCloseAlertBinding) {
            Button(lang.tr("menu_save")) {
                savePendingCloseTab()
            }
            Button(lang.tr("close_unsaved_discard"), role: .destructive) {
                discardPendingCloseTab()
            }
            Button(lang.tr("close_unsaved_cancel"), role: .cancel) {
                tabsModel.pendingCloseTabId = nil
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
                    guard documentServices.finalizeExporterSave(to: url, language: lang, setError: setErrorOnCurrentTab) else { return }
                    if let pendingId = tabsModel.closeTabAfterSuccessfulExportId {
                        tabsModel.closeTabAfterSuccessfulExportId = nil
                        performCloseDiagramTab(id: pendingId)
                    }
                }
            case .failure(let err):
                let message = err.localizedDescription
                Task { @MainActor in
                    tabsModel.closeTabAfterSuccessfulExportId = nil
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
        .onChange(of: tabsModel.selectedTabId) { _, _ in
            refreshLineEditor()
            DiagramCommandCenter.shared.update(file: diagramFileActions, edit: diagramEditActions)
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
        .background {
            DiagramMenuCommandSync(
                fileActions: diagramFileActions,
                editActions: diagramEditActions,
                refreshToken: "\(tabsModel.selectedTabId.uuidString)-\(isSimulationMode)"
            )
        }
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
            canUndo: !isTyping && !tabsModel.tabs[tabsModel.currentTabIndex].undoStack.isEmpty,
            canRedo: !isTyping && !tabsModel.tabs[tabsModel.currentTabIndex].redoStack.isEmpty,
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

    private var diagramFileActions: DiagramFileActions {
        let fileEnabled = !isSimulationMode
        return DiagramFileActions(
            canNew: fileEnabled,
            canOpen: fileEnabled,
            canSave: fileEnabled,
            canSaveAs: fileEnabled,
            canPrint: fileEnabled,
            canClose: fileEnabled && tabsModel.tabs.count > 1,
            newDocument: { addDiagramTab() },
            open: { showImporter = true },
            save: { performPrimarySave() },
            saveAs: { showExporter = true },
            printDocument: {
                #if canImport(UIKit)
                printDiagram()
                #endif
            },
            close: { requestCloseDiagramTab(id: tabsModel.selectedTabId) },
            recentFiles: recentFilesStore.files,
            openRecent: openRecentFile,
            clearRecent: { recentFilesStore.clear() }
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
                    var tabs = tabsModel.tabs
                    tabs[tabsModel.currentTabIndex].selectedPath = path
                    tabs[tabsModel.currentTabIndex].errorText = nil
                    tabsModel.tabs = tabs
                    refreshLineEditor()
                    return
                }
                if (try? VisuStructDocumentEditing.element(at: path, in: doc)) != nil {
                    commitDocument(try VisuStructDocumentEditing.insertAfterSibling(doc, clip, after: path))
                    let newPath = Array(path.dropLast()) + [path.last! + 1]
                    var tabs = tabsModel.tabs
                    tabs[tabsModel.currentTabIndex].selectedPath = newPath
                    tabs[tabsModel.currentTabIndex].errorText = nil
                    tabsModel.tabs = tabs
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
                    DiagramTabStrip(
                        tabs: tabsModel.tabs,
                        selectedTabId: tabsModel.selectedTabId,
                        displayTitle: { tabsModel.diagramTabDisplayTitle($0, language: lang) },
                        hasUnsavedChanges: { tabsModel.tabHasUnsavedChanges($0) },
                        onSelectTab: { id in
                            tabsModel.selectedTabId = id
                            refreshLineEditor()
                        },
                        onAddTab: addDiagramTab,
                        onRequestCloseTab: { requestCloseDiagramTab(id: $0) }
                    )
                    Group {
                        if let err = tabsModel.tabs[tabsModel.currentTabIndex].errorText {
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
                .navigationTitle(tabsModel.diagramTabDisplayTitle(tabsModel.tabs[tabsModel.currentTabIndex], language: lang))
                .navigationBarTitleDisplayMode(.inline)
                .toolbarBackground(.visible, for: .navigationBar)
                .toolbarBackground(.regularMaterial, for: .navigationBar)
                .toolbar {
                    mainEditorToolbarItems()
                }
            }
        }
        .background(Color(.systemGroupedBackground))
    }

    private func mainEditorToolbarItems() -> DiagramMainEditorToolbar {
        let tab = tabsModel.tabs[tabsModel.currentTabIndex]
        let displayTitle = tabsModel.diagramTabDisplayTitle(tab, language: lang)
        let unsaved = tabsModel.tabHasUnsavedChanges(tab)
        let isTyping: Bool = {
            switch focusedField {
            case .none: return false
            case .caption, .caseLabel, .textEditor, .forLoopPart(_): return true
            }
        }()
        #if canImport(UIKit)
        let printAction: (() -> Void)? = { printDiagram() }
        #else
        let printAction: (() -> Void)? = nil
        #endif
        return DiagramMainEditorToolbar(
            principalTitle: displayTitle,
            principalShowsUnsaved: unsaved,
            principalAccessibilityLabel: unsaved ? "\(displayTitle), \(lang.tr("a11y_unsaved_changes"))" : displayTitle,
            canUndo: !isTyping && !tab.undoStack.isEmpty,
            canRedo: !isTyping && !tab.redoStack.isEmpty,
            onUndo: performUndo,
            onRedo: performRedo,
            isSimulationMode: isSimulationMode,
            isPhone: isPhone,
            onTogglePalettePhone: {
                withAnimation(.easeInOut(duration: 0.15)) {
                    showPaletteOnPhone.toggle()
                }
            },
            recentFiles: recentFilesStore.files,
            onOpenImporter: { showImporter = true },
            onPickRecent: openRecentFile,
            onClearRecent: { recentFilesStore.clear() },
            onSave: performPrimarySave,
            onSaveAs: { showExporter = true },
            onPrint: printAction,
            onKeyboardDismiss: {
                focusedField = nil
                if isPhone { hideInspectorOnPhone = true }
            }
        )
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
                tabsModel.syncCurrentTabTitleWithCaption(newCaption, language: lang)
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
        replaceSelectedPathOnCurrentTab(engine.currentStepPath)
        withAnimation(.easeInOut(duration: 0.18)) {
            isSimulationMode = true
        }
    }

    private func endSimulationMode() {
        pauseSimulation()
        withAnimation(.easeInOut(duration: 0.18)) {
            isSimulationMode = false
        }
        if tabsModel.tabs[tabsModel.currentTabIndex].selectedPath == nil, !document.elements.isEmpty {
            replaceSelectedPathOnCurrentTab([0])
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
            replaceSelectedPathOnCurrentTab(engine.currentStepPath)
        } else {
            // lastExecuted (oder Ende/Input): letztes ausgeführtes Element bleibt markiert.
            replaceSelectedPathOnCurrentTab(lastExecutedPath ?? engine.currentStepPath)
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
        replaceSelectedPathOnCurrentTab(engine.currentStepPath)
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
        replaceSelectedPathOnCurrentTab(engine.currentStepPath)

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

    // MARK: - Tab-Titel (Platzhalter)

    private func tabDisplayTitle(forCaption caption: String) -> String {
        let t = caption.trimmingCharacters(in: .whitespacesAndNewlines)
        return t.isEmpty ? lang.tr("diagram_title_placeholder") : t
    }

    // MARK: - Bindings (Auswahl, Zeileneditor)

    private var selectedPathBinding: Binding<[Int]?> {
        Binding(
            get: { tabsModel.tabs[tabsModel.currentTabIndex].selectedPath },
            set: { newVal in
                var tabs = tabsModel.tabs
                tabs[tabsModel.currentTabIndex].selectedPath = newVal
                tabsModel.tabs = tabs
                refreshLineEditor()
            }
        )
    }

    private var lineEditorTextBinding: Binding<String> {
        Binding(
            get: { tabsModel.tabs[tabsModel.currentTabIndex].lineEditorText },
            set: { newVal in
                let normalized = normalizeQuotesForCode(newVal)
                var tabs = tabsModel.tabs
                tabs[tabsModel.currentTabIndex].lineEditorText = normalized
                tabsModel.tabs = tabs
            }
        )
    }

    private var lineEditorVisibleTextBinding: Binding<String> {
        Binding(
            get: {
                let text = tabsModel.tabs[tabsModel.currentTabIndex].lineEditorText
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
                var tabs = tabsModel.tabs
                tabs[tabsModel.currentTabIndex].lineEditorText = text
                tabsModel.tabs = tabs
            }
        )
    }

    private var lineEditorFixedPrefixLabel: String? {
        guard let path = selectedPath,
              let el = try? VisuStructDocumentEditing.element(at: path, in: document) else { return nil }

        switch el.type {
        case .anweisung:
            switch statementIOMode(for: tabsModel.tabs[tabsModel.currentTabIndex].lineEditorText) {
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
            return "while"
        case .fallauswahl:
            return "switch"
        default:
            return nil
        }
    }

    // MARK: - Fehleranzeige

    private var errorTextBinding: Binding<String?> {
        Binding(
            get: { tabsModel.tabs[tabsModel.currentTabIndex].errorText },
            set: { newVal in
                var tabs = tabsModel.tabs
                tabs[tabsModel.currentTabIndex].errorText = newVal
                tabsModel.tabs = tabs
            }
        )
    }

    private func setErrorOnCurrentTab(_ message: String) {
        var tabs = tabsModel.tabs
        tabs[tabsModel.currentTabIndex].errorText = message
        tabsModel.tabs = tabs
    }

    private func clearErrorOnCurrentTab() {
        var tabs = tabsModel.tabs
        tabs[tabsModel.currentTabIndex].errorText = nil
        tabsModel.tabs = tabs
    }

    // MARK: - Export-Dateinamen & Slugs

    private func exportFilenameForCurrentTab() -> String {
        DiagramExportFilename.visustructFilename(
            for: tabsModel.tabs[tabsModel.currentTabIndex],
            style: exportFilenameStyle
        )
    }

    private func pdfFilenameForCurrentTab() -> String {
        DiagramExportFilename.pdfFilename(fromVisustructFilename: exportFilenameForCurrentTab())
    }

    // MARK: - Diagramm-Reiter verwalten (Tabs öffnen/schließen)

    private func addDiagramTab() {
        tabsModel.addDiagramTab(language: lang)
        refreshLineEditor()
    }

    private func requestCloseDiagramTab(id: UUID) {
        if tabsModel.requestCloseDiagramTab(id: id) {
            refreshLineEditor()
        }
    }

    private func performCloseDiagramTab(id: UUID) {
        if tabsModel.closeDiagramTab(id: id) {
            refreshLineEditor()
        }
    }

    private func discardPendingCloseTab() {
        if tabsModel.discardPendingCloseTab() {
            refreshLineEditor()
        }
    }

    private func savePendingCloseTab() {
        guard let id = tabsModel.pendingCloseTabId,
              let idx = tabsModel.tabs.firstIndex(where: { $0.id == id }) else {
            tabsModel.pendingCloseTabId = nil
            return
        }
        tabsModel.pendingCloseTabId = nil
        tabsModel.selectedTabId = id
        refreshLineEditor()
        tabsModel.closeTabAfterSuccessfulExportId = id

        if tabsModel.tabs[idx].linkedFileBookmarkData == nil {
            showExporter = true
            return
        }

        performPrimarySave()
        if let tab = tabsModel.tabs.first(where: { $0.id == id }), !tabsModel.tabHasUnsavedChanges(tab) {
            tabsModel.closeTabAfterSuccessfulExportId = nil
            performCloseDiagramTab(id: id)
        } else if !showExporter {
            tabsModel.closeTabAfterSuccessfulExportId = nil
        }
    }

    // MARK: - Inspector (unter dem Canvas)

    private var inspectorFallauswahlToolbar: InspectorFallauswahlToolbarContext? {
        guard let faPath = multiwayAncestorPath(for: selectedPath) else { return nil }
        let faCaseCount =
            (try? VisuStructDocumentEditing.element(at: faPath, in: document))?.cases?.count ?? 0
        let removeCaseIdx = selectedCaseIndex(multiwayPath: faPath, selectedPath: selectedPath)
        return InspectorFallauswahlToolbarContext(
            caseCount: faCaseCount,
            removeCaseIndex: removeCaseIdx,
            onAdd: { addCaseToFallauswahl(at: faPath) },
            onRemove: {
                if let idx = removeCaseIdx {
                    removeCaseFromFallauswahl(at: faPath, caseIndex: idx)
                }
            }
        )
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
        let editorLineHeight: CGFloat = (horizontalSizeClass == .regular ? 24 : 27) * inScale
        let editorMinHeight: CGFloat = editorLineHeight + 20
        let editorMaxHeight: CGFloat = editorLineHeight * 2 + 28

        return InspectorPanelBody(
            focusedField: $focusedField,
            selectedPath: selectedPath,
            captionFont: captionFont,
            inspectorHintFont: inspectorHintFont,
            editorFont: editorFont,
            editorMonoPt: editorMonoPt,
            editorMinHeight: editorMinHeight,
            editorMaxHeight: editorMaxHeight,
            ioModeBinding: statementIOModeBindingIfApplicable(),
            caseLabelBinding: multiwayCaseLabelBinding(),
            inspectorShowsForLoopThreeFields: inspectorShowsForLoopThreeFields,
            forLoopColumn: { i, cap, ed in
                forLoopInspectorColumn(i, captionFont: cap, editorFont: ed)
            },
            lineEditorVisibleTextBinding: lineEditorVisibleTextBinding,
            editorFocusToken: editorFocusToken,
            lineEditorFixedPrefixLabel: lineEditorFixedPrefixLabel,
            inspectorConditionEditorHintLine: inspectorConditionEditorHintLine(),
            inspectorLineEditorPlaceholder: inspectorLineEditorPlaceholder(),
            fallauswahl: inspectorFallauswahlToolbar,
            onApplyLineEditor: applyLineEditor,
            onApplyRespectingFocus: applyLineEditorRespectingTextFocus,
            groupBoxTitle: inspectorGroupBoxTitle
        )
    }

    private func statementIOModeBindingIfApplicable() -> Binding<StatementIOMode>? {
        guard let path = selectedPath,
              let el = try? VisuStructDocumentEditing.element(at: path, in: document),
              el.type == .anweisung else { return nil }

        return Binding(
            get: {
                statementIOMode(for: tabsModel.tabs[tabsModel.currentTabIndex].lineEditorText)
            },
            set: { newMode in
                var tabs = tabsModel.tabs
                let i = tabsModel.currentTabIndex
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
                tabsModel.tabs = tabs
                applyLineEditorRespectingTextFocus()
            }
        )
    }

    private func statementIOModeIfApplicable() -> StatementIOMode? {
        guard let path = selectedPath,
              let el = try? VisuStructDocumentEditing.element(at: path, in: document),
              el.type == .anweisung else { return nil }

        return statementIOMode(for: tabsModel.tabs[tabsModel.currentTabIndex].lineEditorText)
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
        let stripped = stripKeywordPrefixPreservingEditingWhitespace(p, from: s)
        if p == "while", stripped == s {
            let legacy = stripKeywordPrefixPreservingEditingWhitespace("until", from: s)
            if legacy != s { return legacy }
        }
        return stripped
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
            switch statementIOMode(for: tabsModel.tabs[tabsModel.currentTabIndex].lineEditorText) {
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

    private var inspectorPanelPhoneAware: some View {
        InspectorPhoneChrome(
            isPhone: isPhone,
            insertTargetActive: insertTarget != nil,
            hideInspectorOnPhone: hideInspectorOnPhone,
            onCancelInsert: { insertTarget = nil },
            onShowInspector: { hideInspectorOnPhone = false }
        ) {
            inspectorPanel
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
            var tabs = tabsModel.tabs
            let i = tabsModel.currentTabIndex
            tabs[i].selectedPath = newPath
            tabs[i].errorText = nil
            tabsModel.tabs = tabs
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
            var tabs = tabsModel.tabs
            let i = tabsModel.currentTabIndex
            tabs[i].selectedPath = newPath
            tabs[i].errorText = nil
            tabsModel.tabs = tabs
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
        return InspectorElementTypeLocalization.title(for: el.type, lang: lang)
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
                    var tabs = tabsModel.tabs
                    let i = tabsModel.currentTabIndex
                    tabs[i].lineEditorText = lines.joined(separator: "\n")
                    tabsModel.tabs = tabs
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

    private static let maxUndoSteps = 80

    // MARK: - Dokument: Commit, Undo & Redo

    /// Ersetzt das Dokument und legt einen Undo-Snapshot des bisherigen Zustands ab.
    private func commitDocument(_ new: VisuStructDocument) {
        let i = tabsModel.currentTabIndex
        var tabs = tabsModel.tabs
        var tab = tabs[i]
        guard new != tab.document else { return }
        tab.undoStack.append(tab.document)
        while tab.undoStack.count > Self.maxUndoSteps {
            tab.undoStack.removeFirst()
        }
        tab.redoStack.removeAll()
        tab.document = new
        tabs[i] = tab
        tabsModel.tabs = tabs
    }

    /// Neu / Import: Historie verwerfen, Zustand setzen.
    private func resetHistoryAndDocument(_ new: VisuStructDocument) {
        let i = tabsModel.currentTabIndex
        var tabs = tabsModel.tabs
        tabs[i].undoStack.removeAll()
        tabs[i].redoStack.removeAll()
        tabs[i].document = new
        tabs[i].savedDocumentBaseline = VisuStructXMLCodec.encode(new)
        tabsModel.tabs = tabs
    }

    private func performUndo() {
        let i = tabsModel.currentTabIndex
        var tabs = tabsModel.tabs
        var tab = tabs[i]
        guard let previous = tab.undoStack.popLast() else { return }
        tab.redoStack.append(tab.document)
        tab.document = previous
        tab.errorText = nil
        tabs[i] = tab
        tabsModel.tabs = tabs
        tabsModel.syncTabTitleWithDocumentCaption(tabIndex: i, language: lang)
        sanitizeSelectionAfterHistoryJump()
        refreshLineEditor()
    }

    private func performRedo() {
        let i = tabsModel.currentTabIndex
        var tabs = tabsModel.tabs
        var tab = tabs[i]
        guard let next = tab.redoStack.popLast() else { return }
        tab.undoStack.append(tab.document)
        while tab.undoStack.count > Self.maxUndoSteps {
            tab.undoStack.removeFirst()
        }
        tab.document = next
        tab.errorText = nil
        tabs[i] = tab
        tabsModel.tabs = tabs
        tabsModel.syncTabTitleWithDocumentCaption(tabIndex: i, language: lang)
        sanitizeSelectionAfterHistoryJump()
        refreshLineEditor()
    }

    private func sanitizeSelectionAfterHistoryJump() {
        let i = tabsModel.currentTabIndex
        var tabs = tabsModel.tabs
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
        tabsModel.tabs = tabs
    }

    // MARK: - Neue Datei & Tab zurücksetzen

    private func newDocument() {
        resetHistoryAndDocument(VisuStructDocumentEditing.newEmpty())
        var tabs = tabsModel.tabs
        let i = tabsModel.currentTabIndex
        let hadLinkedFile = tabs[i].linkedFileDisplayName != nil || tabs[i].linkedFileBookmarkData != nil
        tabs[i].selectedPath = [0]
        tabs[i].errorText = nil
        tabs[i].linkedFileBookmarkData = nil
        tabs[i].linkedFileDisplayName = nil
        // Wenn vorher eine Datei geöffnet/gespeichert war, soll „Neu“ wieder einen unbenannten Titel bekommen.
        if hadLinkedFile {
            let serial = tabsModel.nextTabSerial
            tabsModel.nextTabSerial += 1
            tabs[i].title = String(
                format: lang.tr("tab_title_format"),
                locale: Locale(identifier: lang.localeIdentifierForFormatting),
                arguments: [serial as CVarArg]
            )
        }
        tabsModel.tabs = tabs
        refreshLineEditor()
    }

    /// Speichern auf die verknüpfte Datei; ohne Verknüpfung → Export-Sheet. Zentral für Menü/⌘S und „Schließen mit Speichern“.
    private func performPrimarySave() {
        documentServices.saveCurrentDocumentToFile(
            language: lang,
            onNeedsSaveAs: { showExporter = true },
            setError: setErrorOnCurrentTab,
            clearErrorOnCurrentTab: clearErrorOnCurrentTab
        )
    }

    // MARK: - Diagramm bearbeiten (Wurzel, Palette, Einfügen)

    private func appendRoot(_ element: VisuStructElement) {
        let doc = document
        if VisuStructDocumentEditing.isSingleRootPlaceholder(in: doc) {
            do {
                commitDocument(try VisuStructDocumentEditing.replaceAtPath(doc, path: [0], with: element))
                var tabs = tabsModel.tabs
                tabs[tabsModel.currentTabIndex].selectedPath = [0]
                tabs[tabsModel.currentTabIndex].errorText = nil
                tabsModel.tabs = tabs
                refreshLineEditor()
            } catch {
                setErrorOnCurrentTab(error.localizedDescription)
            }
        } else {
            commitDocument(VisuStructDocumentEditing.appendRoot(doc, element))
            var tabs = tabsModel.tabs
            tabs[tabsModel.currentTabIndex].selectedPath = [tabs[tabsModel.currentTabIndex].document.elements.count - 1]
            tabs[tabsModel.currentTabIndex].errorText = nil
            tabsModel.tabs = tabs
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
                    var tabs = tabsModel.tabs
                    tabs[tabsModel.currentTabIndex].selectedPath = path
                    tabs[tabsModel.currentTabIndex].errorText = nil
                    tabsModel.tabs = tabs
                case .before(let path):
                    commitDocument(try VisuStructDocumentEditing.insertBeforeSibling(doc, el, before: path))
                    var tabs = tabsModel.tabs
                    tabs[tabsModel.currentTabIndex].selectedPath = path
                    tabs[tabsModel.currentTabIndex].errorText = nil
                    tabsModel.tabs = tabs
                case .after(let path):
                    commitDocument(try VisuStructDocumentEditing.insertAfterSibling(doc, el, after: path))
                    let newPath = Array(path.dropLast()) + [path.last! + 1]
                    var tabs = tabsModel.tabs
                    tabs[tabsModel.currentTabIndex].selectedPath = newPath
                    tabs[tabsModel.currentTabIndex].errorText = nil
                    tabsModel.tabs = tabs
                case .rootInsertAt0:
                    if VisuStructDocumentEditing.isSingleRootPlaceholder(in: doc) {
                        commitDocument(try VisuStructDocumentEditing.replaceAtPath(doc, path: [0], with: el))
                        var tabs = tabsModel.tabs
                        tabs[tabsModel.currentTabIndex].selectedPath = [0]
                        tabs[tabsModel.currentTabIndex].errorText = nil
                        tabsModel.tabs = tabs
                    } else {
                        commitDocument(try VisuStructDocumentEditing.insertAt(doc, parentPath: [], index: 0, element: el))
                        var tabs = tabsModel.tabs
                        tabs[tabsModel.currentTabIndex].selectedPath = [0]
                        tabs[tabsModel.currentTabIndex].errorText = nil
                        tabsModel.tabs = tabs
                    }
                case .rootAppend:
                    if VisuStructDocumentEditing.isSingleRootPlaceholder(in: doc) {
                        commitDocument(try VisuStructDocumentEditing.replaceAtPath(doc, path: [0], with: el))
                        var tabs = tabsModel.tabs
                        tabs[tabsModel.currentTabIndex].selectedPath = [0]
                        tabs[tabsModel.currentTabIndex].errorText = nil
                        tabsModel.tabs = tabs
                    } else {
                        let idx = doc.elements.count
                        commitDocument(try VisuStructDocumentEditing.insertAt(doc, parentPath: [], index: idx, element: el))
                        var tabs = tabsModel.tabs
                        tabs[tabsModel.currentTabIndex].selectedPath = [idx]
                        tabs[tabsModel.currentTabIndex].errorText = nil
                        tabsModel.tabs = tabs
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
        if let path = tabsModel.tabs[tabsModel.currentTabIndex].selectedPath,
           VisuStructDocumentEditing.isPlaceholderSlot(at: path, in: doc) {
            do {
                commitDocument(try VisuStructDocumentEditing.replaceAtPath(doc, path: path, with: el))
                var tabs = tabsModel.tabs
                tabs[tabsModel.currentTabIndex].selectedPath = path
                tabs[tabsModel.currentTabIndex].errorText = nil
                tabsModel.tabs = tabs
                refreshLineEditor()
            } catch {
                setErrorOnCurrentTab(error.localizedDescription)
            }
            return
        }
        // Ausgewählt ist ein „echtes“ Element: neues Palette-Element als Geschwister **direkt darunter**
        // (z. B. in der while-Schleife: nach dem if noch i++ einfügen).
        if let path = tabsModel.tabs[tabsModel.currentTabIndex].selectedPath,
           (try? VisuStructDocumentEditing.element(at: path, in: doc)) != nil,
           !VisuStructDocumentEditing.isPlaceholderSlot(at: path, in: doc) {
            do {
                commitDocument(try VisuStructDocumentEditing.insertAfterSibling(doc, el, after: path))
                let newPath = Array(path.dropLast()) + [path.last! + 1]
                var tabs = tabsModel.tabs
                tabs[tabsModel.currentTabIndex].selectedPath = newPath
                tabs[tabsModel.currentTabIndex].errorText = nil
                tabsModel.tabs = tabs
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
            var tabs = tabsModel.tabs
            let i = tabsModel.currentTabIndex
            let newDoc = tabs[i].document
            if newDoc.elements.isEmpty {
                tabs[i].selectedPath = nil
            } else if (try? VisuStructDocumentEditing.element(at: path, in: newDoc)) == nil {
                tabs[i].selectedPath = [0]
            }
            tabs[i].errorText = nil
            tabsModel.tabs = tabs
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
        let i = tabsModel.currentTabIndex
        var tabs = tabsModel.tabs
        let tab = tabs[i]
        guard let path = tab.selectedPath,
              let el = try? VisuStructDocumentEditing.element(at: path, in: tab.document) else {
            tabs[i].lineEditorText = ""
            tabsModel.tabs = tabs
            return
        }
        tabs[i].lineEditorText = el.textLines.joined(separator: "\n")
        tabsModel.tabs = tabs

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
        let editorText = tabsModel.tabs[tabsModel.currentTabIndex].lineEditorText
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
        guard let img = DiagramSnapshotExport.renderedDiagramUIImage(
            document: document,
            horizontalSizeClass: horizontalSizeClass,
            canvasScaleStep: canvasScaleStep,
            lang: lang,
            displayScale: displayScale
        ) else {
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
        do {
            let url = try DiagramSnapshotExport.writeTemporaryVisustructFile(data: data, fileName: fileName)
            fileURLSharePayload = FileURLSharePayload(url: url)
        } catch {
            setErrorOnCurrentTab(String(format: lang.tr("err_share_prepare_failed_fmt"), error.localizedDescription))
        }
    }

    private func shareDiagramPDF() {
        guard let img = DiagramSnapshotExport.renderedDiagramUIImage(
            document: document,
            horizontalSizeClass: horizontalSizeClass,
            canvasScaleStep: canvasScaleStep,
            lang: lang,
            displayScale: displayScale
        ) else {
            setErrorOnCurrentTab(lang.tr("err_diagram_too_small_export"))
            return
        }
        let fileName = pdfFilenameForCurrentTab()
        let metaTitle = DiagramSnapshotExport.exportVisibleDiagramTitle(document: document, lang: lang)
        do {
            let url = try DiagramSnapshotExport.writeTemporaryDiagramPDF(
                image: img,
                fileName: fileName,
                pdfMetadataTitle: metaTitle
            )
            pdfQuickLookURL = url
        } catch {
            setErrorOnCurrentTab(String(format: lang.tr("err_share_prepare_failed_fmt"), error.localizedDescription))
        }
    }
    #endif

    #if canImport(UIKit)
    private func printDiagram() {
        guard let img = DiagramSnapshotExport.renderedDiagramUIImage(
            document: document,
            horizontalSizeClass: horizontalSizeClass,
            canvasScaleStep: canvasScaleStep,
            lang: lang,
            displayScale: displayScale
        ) else {
            setErrorOnCurrentTab(lang.tr("err_diagram_too_small_print"))
            return
        }
        guard UIPrintInteractionController.isPrintingAvailable else {
            setErrorOnCurrentTab(lang.tr("err_print_unavailable"))
            return
        }
        let info = UIPrintInfo(dictionary: nil)
        info.outputType = .photo
        info.jobName = DiagramSnapshotExport.exportVisibleDiagramTitle(document: document, lang: lang)
        let controller = UIPrintInteractionController.shared
        controller.printInfo = info
        controller.printingItem = img
        controller.present(animated: true)
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
