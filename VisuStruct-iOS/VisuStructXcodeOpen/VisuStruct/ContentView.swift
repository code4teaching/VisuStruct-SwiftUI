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
    @State private var simulation: SimulationController
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

    init() {
        let startupLang = AppLanguage.currentFromDefaults()
        let model = DiagramSheetTabsModel.makeInitial(language: startupLang)
        let recentStore = RecentFilesStore.shared
        _tabsModel = State(initialValue: model)
        _recentFilesStore = ObservedObject(wrappedValue: recentStore)
        _documentServices = State(initialValue: DiagramEditorDocumentServices(tabsModel: model, recentFilesStore: recentStore))
        _simulation = State(initialValue: SimulationController(tabsModel: model))
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

    /// Finder / Dateien: Doppelklick bzw. „Öffnen mit“ auf `.visustruct` oder `.strk`.
    private func openIncomingDocument(from url: URL) {
        guard url.isFileURL else { return }
        guard VisuStructDiagramFile.isOpenableDiagram(url: url) else { return }
        if isSimulationMode {
            endSimulationMode()
        }
        let tab = tabsModel.currentTab
        if tabsModel.tabHasUnsavedChanges(tab) || tab.linkedFileBookmarkData != nil {
            addDiagramTab()
        }
        _ = openDocument(from: url)
    }

    private var document: VisuStructDocument {
        tabsModel.currentTab.document
    }

    private var selectedPath: [Int]? {
        tabsModel.currentTab.selectedPath
    }

    private func replaceSelectedPathOnCurrentTab(_ path: [Int]?) {
        tabsModel.updateCurrentTab { $0.selectedPath = path }
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
        .background {
            Button(lang.tr("menu_open")) {
                guard !isSimulationMode else { return }
                showImporter = true
            }
            .keyboardShortcut("o", modifiers: .command)
            .opacity(0.001)
            .accessibilityHidden(true)
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
            canUndo: !isTyping && tabsModel.currentTab.history.canUndo,
            canRedo: !isTyping && tabsModel.currentTab.history.canRedo,
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
                    tabsModel.selectAndClearError(path)
                    refreshLineEditor()
                    return
                }
                if (try? VisuStructDocumentEditing.element(at: path, in: doc)) != nil {
                    commitDocument(try VisuStructDocumentEditing.insertAfterSibling(doc, clip, after: path))
                    let newPath = Array(path.dropLast()) + [path.last! + 1]
                    tabsModel.selectAndClearError(newPath)
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
    private var paletteListStackBody: some View {
        PaletteActionList(
            isSimulationMode: isSimulationMode,
            canDeleteSelection: selectedPath.map { path in
                VisuStructDocumentEditing.canDeleteElement(at: path, in: document)
            } ?? false,
            codeGeneratorAccessGranted: codeGeneratorAccessGranted,
            onInsertItem: insertPaletteItem,
            onDeleteSelection: deleteSelection,
            onToggleSimulation: toggleSimulationMode,
            onGenerateCode: openCodeGenerator,
            onSharePNG: exportPNG,
            onShareDocument: shareDocumentAsFile,
            onExportPDF: shareDiagramPDF,
            onShowAbout: { showInfo = true }
        )
    }

    private func toggleSimulationMode() {
        if !isSimulationMode {
            applyLineEditorRespectingTextFocus()
            DispatchQueue.main.async {
                beginSimulationMode()
            }
        } else {
            endSimulationMode()
        }
    }

    private func openCodeGenerator() {
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
                        if let err = tabsModel.currentTab.errorText {
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
                .navigationTitle(tabsModel.diagramTabDisplayTitle(tabsModel.currentTab, language: lang))
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
        let tab = tabsModel.currentTab
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
            canUndo: !isTyping && tab.history.canUndo,
            canRedo: !isTyping && tab.history.canRedo,
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

    private var simulationDetailView: some View {
        SimulationDetailView(
            simulation: simulation,
            highlightModeRaw: $simulationHighlightModeRaw
        ) {
            simulationCanvasBlock
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

    // MARK: - Simulation (Modus & Steuerung) → `SimulationController`

    private var isSimulationMode: Bool { simulation.isActive }

    private func beginSimulationMode() { simulation.begin() }

    private func endSimulationMode() { simulation.end() }

    // MARK: - Tab-Titel (Platzhalter)

    private func tabDisplayTitle(forCaption caption: String) -> String {
        let t = caption.trimmingCharacters(in: .whitespacesAndNewlines)
        return t.isEmpty ? lang.tr("diagram_title_placeholder") : t
    }

    // MARK: - Bindings (Auswahl, Zeileneditor)

    private var selectedPathBinding: Binding<[Int]?> {
        Binding(
            get: { tabsModel.currentTab.selectedPath },
            set: { newVal in
                tabsModel.updateCurrentTab { $0.selectedPath = newVal }
                refreshLineEditor()
            }
        )
    }

    private var lineEditorTextBinding: Binding<String> {
        Binding(
            get: { tabsModel.currentTab.lineEditorText },
            set: { newVal in
                let normalized = VisuStructLineEditorText.normalizingQuotes(newVal)
                tabsModel.updateCurrentTab { $0.lineEditorText = normalized }
            }
        )
    }

    private var lineEditorVisibleTextBinding: Binding<String> {
        Binding(
            get: {
                let text = tabsModel.currentTab.lineEditorText
                guard let labelPrefix = lineEditorFixedPrefixLabel else { return text }
                return VisuStructLineEditorText.strippingPrefixForEditing(labelPrefix, from: text)
            },
            set: { newVal in
                let normalized = VisuStructLineEditorText.normalizingQuotes(newVal)
                let text: String
                if let labelPrefix = lineEditorFixedPrefixLabel {
                    text = VisuStructLineEditorText.prefixingForEditing(labelPrefix, to: VisuStructLineEditorText.strippingPrefixForEditing(labelPrefix, from: normalized))
                } else {
                    text = normalized
                }
                tabsModel.updateCurrentTab { $0.lineEditorText = text }
            }
        )
    }

    private var lineEditorFixedPrefixLabel: String? {
        guard let path = selectedPath,
              let el = try? VisuStructDocumentEditing.element(at: path, in: document) else { return nil }

        switch el.type {
        case .anweisung:
            switch VisuStructLineEditorText.ioMode(of: tabsModel.currentTab.lineEditorText) {
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
            get: { tabsModel.currentTab.errorText },
            set: { newVal in
                tabsModel.setErrorOnCurrentTab(newVal)
            }
        )
    }

    private func setErrorOnCurrentTab(_ message: String) {
        tabsModel.setErrorOnCurrentTab(message)
    }

    private func clearErrorOnCurrentTab() {
        tabsModel.setErrorOnCurrentTab(nil)
    }

    // MARK: - Export-Dateinamen & Slugs

    private func exportFilenameForCurrentTab() -> String {
        DiagramExportFilename.visustructFilename(
            for: tabsModel.currentTab,
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

    private var selectedElement: VisuStructElement? {
        guard let path = selectedPath else { return nil }
        return try? VisuStructDocumentEditing.element(at: path, in: document)
    }

    private var inspectorFallauswahlToolbar: InspectorFallauswahlToolbarContext? {
        guard let faPath = VisuStructDocumentEditing.multiwayAncestorPath(for: selectedPath, in: document) else { return nil }
        let faCaseCount =
            (try? VisuStructDocumentEditing.element(at: faPath, in: document))?.cases?.count ?? 0
        let removeCaseIdx = VisuStructDocumentEditing.caseIndex(of: selectedPath, inMultiwayAt: faPath)
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
            inspectorConditionEditorHintLine: selectedElement.flatMap { InspectorElementHints.conditionHintLine(for: $0.type) },
            inspectorLineEditorPlaceholder: selectedElement.flatMap {
                InspectorElementHints.lineEditorPlaceholder(
                    for: $0.type,
                    ioMode: VisuStructLineEditorText.ioMode(of: tabsModel.currentTab.lineEditorText),
                    lang: lang
                )
            },
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
                VisuStructLineEditorText.ioMode(of: tabsModel.currentTab.lineEditorText)
            },
            set: { newMode in
                tabsModel.updateCurrentTab { tab in
                    tab.lineEditorText = VisuStructLineEditorText.applyingIOMode(newMode, to: tab.lineEditorText)
                }
                applyLineEditorRespectingTextFocus()
            }
        )
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

    private func addCaseToFallauswahl(at fallPath: [Int]) {
        do {
            let (updated, newPath) = try VisuStructDocumentEditing.appendCaseToFallauswahl(document, fallauswahlPath: fallPath)
            commitDocument(updated)
            tabsModel.selectAndClearError(newPath)
            refreshLineEditor()
        } catch {
            setErrorOnCurrentTab(error.localizedDescription)
        }
    }

    private func removeCaseFromFallauswahl(at fallPath: [Int], caseIndex: Int) {
        do {
            let (updated, newPath) = try VisuStructDocumentEditing.removeCaseFromFallauswahl(
                document, fallauswahlPath: fallPath, caseIndex: caseIndex
            )
            commitDocument(updated)
            tabsModel.selectAndClearError(newPath)
            refreshLineEditor()
        } catch {
            setErrorOnCurrentTab(error.localizedDescription)
        }
    }

    /// Bindung für den **Fallnamen**, wenn die Auswahl in einer Spalte einer Fallauswahl liegt (nicht beim bloßen Kopf `[n]` ohne Folgeindex).
    private func multiwayCaseLabelBinding() -> Binding<String>? {
        guard let fa = VisuStructDocumentEditing.multiwayAncestorPath(for: selectedPath, in: document),
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
                let padded = VisuStructLineEditorText.paddedForLoopParts(el.textLines)
                return padded[index]
            },
            set: { newVal in
                guard (0 ..< 3).contains(index), let path = selectedPath else { return }
                guard let el = try? VisuStructDocumentEditing.element(at: path, in: document),
                      el.type == .forSchleife else { return }
                var lines = VisuStructLineEditorText.paddedForLoopParts(el.textLines)
                lines[index] = VisuStructLineEditorText.normalizedForLoopPart(newVal)
                do {
                    commitDocument(try VisuStructDocumentEditing.setTextLines(document, path: path, lines: lines))
                    // `lineEditorText` wird bei den drei For-Feldern nicht mitgetippt; sonst würde z. B.
                    // „Code erzeugen“ veralteten Puffer per `applyLineEditor` ins Element schreiben.
                    tabsModel.updateCurrentTab { $0.lineEditorText = lines.joined(separator: "\n") }
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

    // MARK: - Dokument: Commit, Undo & Redo

    /// Ersetzt das Dokument und legt einen Undo-Snapshot des bisherigen Zustands ab.
    private func commitDocument(_ new: VisuStructDocument) {
        tabsModel.commitDocument(new)
    }

    /// Neu / Import: Historie verwerfen, Zustand setzen.
    private func resetHistoryAndDocument(_ new: VisuStructDocument) {
        tabsModel.resetHistoryAndDocument(new)
    }

    private func performUndo() {
        guard tabsModel.undo() else { return }
        tabsModel.syncTabTitleWithDocumentCaption(tabIndex: tabsModel.currentTabIndex, language: lang)
        refreshLineEditor()
    }

    private func performRedo() {
        guard tabsModel.redo() else { return }
        tabsModel.syncTabTitleWithDocumentCaption(tabIndex: tabsModel.currentTabIndex, language: lang)
        refreshLineEditor()
    }

    // MARK: - Neue Datei & Tab zurücksetzen

    private func newDocument() {
        resetHistoryAndDocument(VisuStructDocumentEditing.newEmpty())
        let current = tabsModel.currentTab
        let hadLinkedFile = current.linkedFileDisplayName != nil || current.linkedFileBookmarkData != nil
        // Wenn vorher eine Datei geöffnet/gespeichert war, soll „Neu“ wieder einen unbenannten Titel bekommen.
        var untitledTitle: String?
        if hadLinkedFile {
            let serial = tabsModel.nextTabSerial
            tabsModel.nextTabSerial += 1
            untitledTitle = String(
                format: lang.tr("tab_title_format"),
                locale: Locale(identifier: lang.localeIdentifierForFormatting),
                arguments: [serial as CVarArg]
            )
        }
        tabsModel.updateCurrentTab { tab in
            tab.selectedPath = [0]
            tab.errorText = nil
            tab.linkedFileBookmarkData = nil
            tab.linkedFileDisplayName = nil
            if let untitledTitle { tab.title = untitledTitle }
        }
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
                tabsModel.selectAndClearError([0])
                refreshLineEditor()
            } catch {
                setErrorOnCurrentTab(error.localizedDescription)
            }
        } else {
            commitDocument(VisuStructDocumentEditing.appendRoot(doc, element))
            tabsModel.selectAndClearError([tabsModel.currentTab.document.elements.count - 1])
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
                    tabsModel.selectAndClearError(path)
                case .before(let path):
                    commitDocument(try VisuStructDocumentEditing.insertBeforeSibling(doc, el, before: path))
                    tabsModel.selectAndClearError(path)
                case .after(let path):
                    commitDocument(try VisuStructDocumentEditing.insertAfterSibling(doc, el, after: path))
                    let newPath = Array(path.dropLast()) + [path.last! + 1]
                    tabsModel.selectAndClearError(newPath)
                case .rootInsertAt0:
                    if VisuStructDocumentEditing.isSingleRootPlaceholder(in: doc) {
                        commitDocument(try VisuStructDocumentEditing.replaceAtPath(doc, path: [0], with: el))
                        tabsModel.selectAndClearError([0])
                    } else {
                        commitDocument(try VisuStructDocumentEditing.insertAt(doc, parentPath: [], index: 0, element: el))
                        tabsModel.selectAndClearError([0])
                    }
                case .rootAppend:
                    if VisuStructDocumentEditing.isSingleRootPlaceholder(in: doc) {
                        commitDocument(try VisuStructDocumentEditing.replaceAtPath(doc, path: [0], with: el))
                        tabsModel.selectAndClearError([0])
                    } else {
                        let idx = doc.elements.count
                        commitDocument(try VisuStructDocumentEditing.insertAt(doc, parentPath: [], index: idx, element: el))
                        tabsModel.selectAndClearError([idx])
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
        if let path = tabsModel.currentTab.selectedPath,
           VisuStructDocumentEditing.isPlaceholderSlot(at: path, in: doc) {
            do {
                commitDocument(try VisuStructDocumentEditing.replaceAtPath(doc, path: path, with: el))
                tabsModel.selectAndClearError(path)
                refreshLineEditor()
            } catch {
                setErrorOnCurrentTab(error.localizedDescription)
            }
            return
        }
        // Ausgewählt ist ein „echtes“ Element: neues Palette-Element als Geschwister **direkt darunter**
        // (z. B. in der while-Schleife: nach dem if noch i++ einfügen).
        if let path = tabsModel.currentTab.selectedPath,
           (try? VisuStructDocumentEditing.element(at: path, in: doc)) != nil,
           !VisuStructDocumentEditing.isPlaceholderSlot(at: path, in: doc) {
            do {
                commitDocument(try VisuStructDocumentEditing.insertAfterSibling(doc, el, after: path))
                let newPath = Array(path.dropLast()) + [path.last! + 1]
                tabsModel.selectAndClearError(newPath)
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
            tabsModel.updateCurrentTab { tab in
                tab.selectedPath = VisuStructDocumentEditing.sanitizedSelection(path, in: tab.document)
                tab.errorText = nil
            }
            refreshLineEditor()
        } catch {
            if let editErr = error as? VisuStructEditError, editErr == .cannotDeleteLastRootElement {
                return
            }
            setErrorOnCurrentTab(error.localizedDescription)
        }
    }

    // MARK: - Zeileneditor (Synchronisation Element ↔ Textfeld)

    private func refreshLineEditor() {
        let tab = tabsModel.currentTab
        guard let path = tab.selectedPath,
              let el = try? VisuStructDocumentEditing.element(at: path, in: tab.document) else {
            tabsModel.updateCurrentTab { $0.lineEditorText = "" }
            return
        }
        tabsModel.updateCurrentTab { $0.lineEditorText = el.textLines.joined(separator: "\n") }

        if DiagramInspectorAutoFocus.shouldFocusOnSelection,
           focusedField == nil,
           el.type != .forSchleife {
            focusedField = .textEditor
            editorFocusToken = UUID()
        }
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
        let editorText = tabsModel.currentTab.lineEditorText
        let storedText: String
        if let labelPrefix = lineEditorFixedPrefixLabel {
            storedText = VisuStructLineEditorText.prefixingForEditing(labelPrefix, to: VisuStructLineEditorText.strippingPrefixForEditing(labelPrefix, from: editorText))
        } else {
            storedText = editorText
        }
        let raw = storedText.components(separatedBy: "\n")
        let lines = (raw.isEmpty ? [""] : raw).map(VisuStructLineEditorText.normalizingQuotes)
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
}
