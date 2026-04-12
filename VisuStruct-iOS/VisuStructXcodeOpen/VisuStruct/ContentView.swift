import SwiftUI
import UniformTypeIdentifiers
import VisuStructCore
#if canImport(UIKit)
import QuickLook
import UIKit
#endif

// MARK: - FileDocument (einheitlich .visustruct / XML wie Java)

struct VisuStructFileDocument: FileDocument, Sendable {
    static var readableContentTypes: [UTType] {
        var types: [UTType] = [.xml]
        if let v = UTType(filenameExtension: "visustruct") {
            types.append(v)
        }
        return types
    }

    var document: VisuStructDocument

    init(document: VisuStructDocument) {
        self.document = document
    }

    init(configuration: ReadConfiguration) throws {
        guard let data = configuration.file.regularFileContents else {
            throw CocoaError(.fileReadCorruptFile)
        }
        document = try VisuStructXMLCodec.decode(data: data)
    }

    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper {
        FileWrapper(regularFileWithContents: VisuStructXMLCodec.encode(document))
    }
}

// MARK: - Palette list chrome

/// Optik wie eine abgerundete Schaltfläche (Tipp + Drag aus der Liste).
private struct PaletteListElementButtonStyle: ButtonStyle {
    enum Emphasis {
        case normal
        case destructive
    }

    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    var emphasis: Emphasis = .normal

    func makeBody(configuration: Configuration) -> some View {
        let isCompact = horizontalSizeClass != .regular
        let vPad: CGFloat = isCompact ? 5 : 10
        let hPad: CGFloat = isCompact ? 8 : 12
        let radius: CGFloat = isCompact ? 8 : 10
        let baseStrokeOpacity = configuration.isPressed ? 0.14 : 0.10
        let borderColor: Color = emphasis == .destructive
            ? Color.red.opacity(baseStrokeOpacity + 0.55)
            : Color.primary.opacity(baseStrokeOpacity)
        return configuration.label
            .font(isCompact ? .callout : .body)
            .imageScale(isCompact ? .small : .medium)
            .foregroundStyle(emphasis == .destructive ? Color.red : Color.primary)
            .padding(.vertical, vPad)
            .padding(.horizontal, hPad)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background {
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .fill(configuration.isPressed ? Color(.quaternarySystemFill) : Color(.tertiarySystemFill))
            }
            .overlay {
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .strokeBorder(borderColor, lineWidth: 1)
            }
    }
}

// MARK: - Palette

enum ElementPalette {
    private static func stubAnweisung() -> VisuStructElement {
        VisuStructElement(type: .anweisung, textLines: ["ø"])
    }

    /// Neues Element aus der Palette — **Texte im Diagramm** folgen `lang` (XML: Verzweigung weiter `true`/`false`/`default` wie Java).
    static func element(for kind: PaletteItem, lang: AppLanguage) -> VisuStructElement {
        switch kind {
        case .anweisung:
            return VisuStructElement(type: .anweisung, textLines: [lang.tr("canvas_stub_anweisung")])
        case .verzweigung:
            let stub = stubAnweisung()
            return VisuStructElement(type: .verzweigung, textLines: [lang.tr("canvas_stub_condition")], cases: [
                VisuStructCase(name: "true", elements: [stub]),
                VisuStructCase(name: "false", elements: [stub])
            ])
        case .fallauswahl:
            let stub = stubAnweisung()
            return VisuStructElement(type: .fallauswahl, textLines: [lang.tr("canvas_stub_fallauswahl")], cases: [
                VisuStructCase(name: "1", elements: [stub]),
                VisuStructCase(name: "2", elements: [stub]),
                VisuStructCase(name: "default", elements: [stub])
            ])
        case .forZaehlSchleife:
            return VisuStructElement(type: .forSchleife, textLines: [lang.tr("canvas_stub_for")], loopBody: [stubAnweisung()])
        case .whileSchleife:
            return VisuStructElement(type: .whileSchleife, textLines: [lang.tr("canvas_stub_while")], loopBody: [stubAnweisung()])
        case .doUntilSchleife:
            return VisuStructElement(type: .doUntilSchleife, textLines: [lang.tr("canvas_stub_until")], loopBody: [stubAnweisung()])
        case .endlosschleife:
            return VisuStructElement(type: .endlosschleife, textLines: [lang.tr("canvas_stub_endless")], loopBody: [stubAnweisung()])
        case .aussprung:
            return VisuStructElement(type: .aussprung, textLines: [lang.tr("canvas_stub_break")])
        case .aufruf:
            return VisuStructElement(type: .aufruf, textLines: [lang.tr("canvas_stub_call")])
        }
    }

    enum PaletteItem: String, Identifiable {
        case anweisung, verzweigung, whileSchleife, doUntilSchleife, forZaehlSchleife, fallauswahl, endlosschleife, aussprung, aufruf

        var id: String { rawValue }

        static let paletteOrder: [PaletteItem] = [
            .anweisung, .verzweigung, .whileSchleife, .doUntilSchleife, .forZaehlSchleife,
            .fallauswahl, .endlosschleife, .aussprung, .aufruf
        ]

        func localizedTitle(in lang: AppLanguage) -> String {
            switch self {
            case .anweisung: return lang.tr("element_anweisung")
            case .verzweigung: return lang.tr("element_verzweigung")
            case .whileSchleife: return lang.tr("element_whileSchleife")
            case .doUntilSchleife: return lang.tr("element_doUntilSchleife")
            case .forZaehlSchleife: return lang.tr("element_forSchleife")
            case .fallauswahl: return lang.tr("element_fallauswahl")
            case .endlosschleife: return lang.tr("element_endlosschleife")
            case .aussprung: return lang.tr("element_aussprung")
            case .aufruf: return lang.tr("element_aufruf")
            }
        }

        var symbolName: String {
            switch self {
            case .anweisung: return "square.fill"
            case .verzweigung: return "arrow.triangle.branch"
            case .whileSchleife: return "arrow.triangle.2.circlepath"
            case .doUntilSchleife: return "arrow.uturn.down.circle"
            case .forZaehlSchleife: return "repeat"
            case .fallauswahl: return "list.bullet.indent"
            case .endlosschleife: return "infinity"
            case .aussprung: return "arrow.turn.down.left"
            case .aufruf: return "arrow.right.to.line.compact"
            }
        }
    }

    static func paletteDragIdentifier(_ item: PaletteItem) -> String { "pal:\(item.rawValue)" }

    static func moveDragIdentifier(path: [Int]) -> String {
        "mov:" + path.map(String.init).joined(separator: ",")
    }
}

#if canImport(UIKit)
private struct ActivityShareSheet: UIViewControllerRepresentable {
    let items: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }

    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

/// Damit das Share-Sheet immer ein gültiges `UIImage` hat (kein leeres Sheet durch abweichenden State-Zyklus).
private struct PNGSharePayload: Identifiable {
    let id = UUID()
    let image: UIImage
}

/// Temporäre Datei (.visustruct oder PDF) fürs System-Teilen.
private struct FileURLSharePayload: Identifiable {
    let id = UUID()
    let url: URL
}
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

// MARK: - Code-Generator: Kaufzwang (IAP)

/// Wenn `true`, ist „Code erzeugen“ ohne Kauf/Freischaltung (`visustruct.codegen.unlocked`) nur ein Hinweis-Sheet.
/// Solange es noch nichts Käufliches gibt: `false` — später auf `true` stellen und StoreKit anbinden.
private enum CodeGeneratorPurchaseGate {
    static let requiresPurchase = false
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
    #if canImport(UIKit)
    @State private var pngSharePayload: PNGSharePayload?
    @State private var fileURLSharePayload: FileURLSharePayload?
    /// PDF: Quick Look (System-Vorschau), statt nur Share Sheet.
    @State private var pdfQuickLookURL: URL?
    @State private var keyboardOverlap: CGFloat = 0
    #endif

    init() {
        let startupLang = AppLanguage.currentFromDefaults()
        let first = DiagramSheetTab.makeNew(serial: 1, language: startupLang)
        _sheetTabs = State(initialValue: [first])
        _selectedTabId = State(initialValue: first.id)
        _nextTabSerial = State(initialValue: 2)
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
        Self.stripVisuStructExtension(from: tab.title)
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
        tabs[i].linkedFileBookmarkData = try? url.bookmarkData(
            options: .minimalBookmark,
            includingResourceValuesForKeys: nil,
            relativeTo: nil
        )
        let display = fileDisplayName(from: url)
        tabs[i].linkedFileDisplayName = display.isEmpty ? nil : display
        if let d = tabs[i].linkedFileDisplayName {
            tabs[i].title = d
        }
        sheetTabs = tabs
    }

    private var document: VisuStructDocument {
        sheetTabs[currentTabIndex].document
    }

    private var selectedPath: [Int]? {
        sheetTabs[currentTabIndex].selectedPath
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
        .fileImporter(
            isPresented: $showImporter,
            allowedContentTypes: VisuStructFileDocument.readableContentTypes,
            allowsMultipleSelection: false
        ) { result in
            switch result {
            case .success(let urls):
                guard let url = urls.first else { return }
                Task { @MainActor in
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
                        resetHistoryAndDocument(loaded)
                        var tabs = sheetTabs
                        let i = currentTabIndex
                        tabs[i].selectedPath = tabs[i].document.elements.isEmpty ? nil : [0]
                        tabs[i].errorText = nil
                        let display = fileDisplayName(from: url)
                        tabs[i].linkedFileDisplayName = display.isEmpty ? nil : display
                        tabs[i].title = tabs[i].linkedFileDisplayName ?? tabs[i].title
                        sheetTabs = tabs
                        // Bookmark separat setzen (inkl. Security-Scoped Zugriff für späteres „Speichern“).
                        setLinkedFile(forCurrentTab: url)
                        refreshLineEditor()
                    } catch {
                        setErrorOnCurrentTab(error.localizedDescription)
                    }
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
            contentType: UTType.xml,
            defaultFilename: exportFilenameForCurrentTab()
        ) { result in
            switch result {
            case .success(let url):
                Task { @MainActor in
                    setLinkedFile(forCurrentTab: url)
                    updateSavedBaselineForCurrentTab()
                }
            case .failure(let err):
                let message = err.localizedDescription
                Task { @MainActor in
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
        .sheet(isPresented: $showCodeGeneratorPlaceholder) {
            CodeGeneratorPlaceholderSheet(document: document)
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
        return List {
            Section {
                ForEach(ElementPalette.PaletteItem.paletteOrder) { item in
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
                    .listRowInsets(
                        isCompact
                            ? EdgeInsets(top: 1, leading: 10, bottom: 1, trailing: 10)
                            : EdgeInsets(top: 5, leading: 12, bottom: 5, trailing: 12)
                    )
                    .listRowSeparator(.hidden)
                    .listRowBackground(Color.clear)
                }
            }
            Section {
                Button {
                    exportPNG()
                } label: {
                    Label(lang.tr("action_share_png"), systemImage: "square.and.arrow.up")
                }
                .buttonStyle(PaletteListElementButtonStyle())
                .listRowInsets(
                    isCompact
                        ? EdgeInsets(top: 4, leading: 10, bottom: 3, trailing: 10)
                        : EdgeInsets(top: 8, leading: 12, bottom: 5, trailing: 12)
                )
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
                Button {
                    shareDocumentAsFile()
                } label: {
                    Label(lang.tr("action_share_document"), systemImage: "square.and.arrow.up.on.square")
                }
                .buttonStyle(PaletteListElementButtonStyle())
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
                }
                .buttonStyle(PaletteListElementButtonStyle())
                .listRowInsets(
                    isCompact
                        ? EdgeInsets(top: 3, leading: 10, bottom: 3, trailing: 10)
                        : EdgeInsets(top: 5, leading: 12, bottom: 5, trailing: 12)
                )
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
                Button {
                    if codeGeneratorAccessGranted {
                        showCodeGeneratorPlaceholder = true
                    } else {
                        showCodeGeneratorPaywall = true
                    }
                } label: {
                    HStack(spacing: 10) {
                        Label(lang.tr("action_generate_code"), systemImage: "chevron.left.forwardslash.chevron.right")
                        Spacer(minLength: 8)
                        if !codeGeneratorAccessGranted {
                            Image(systemName: "lock.fill")
                                .font(.body)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
                .buttonStyle(PaletteListElementButtonStyle())
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
                Button(role: .destructive) {
                    deleteSelection()
                } label: {
                    Label(lang.tr("action_delete_selection"), systemImage: "trash")
                }
                .buttonStyle(PaletteListElementButtonStyle(emphasis: .destructive))
                .listRowInsets(
                    isCompact
                        ? EdgeInsets(top: 3, leading: 10, bottom: 3, trailing: 10)
                        : EdgeInsets(top: 5, leading: 12, bottom: 5, trailing: 12)
                )
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
                .disabled(
                    selectedPath.map { path in
                        !VisuStructDocumentEditing.canDeleteElement(at: path, in: document)
                    } ?? true
                )
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
                    Button(lang.tr("toolbar_new"), systemImage: "doc.badge.plus", action: newDocument)
                    Button(action: saveCurrentDocumentToFile) {
                        Label(lang.tr("menu_save"), systemImage: "arrow.down.doc")
                    }
                    .help(lang.tr("menu_save"))
                    .keyboardShortcut("s", modifiers: .command)
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
                    }
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
                    closeDiagramTab(id: tab.id)
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
        VStack(alignment: .leading, spacing: 20) {
            canvasAndCaptionBlock
                .layoutPriority(1)
            inspectorPanelPhoneAware
        }
        .padding(horizontalSizeClass == .regular ? EdgeInsets(top: 16, leading: 18, bottom: 16, trailing: 18) : EdgeInsets(top: 16, leading: 14, bottom: 16, trailing: 14))
        #if canImport(UIKit)
        // iPad: Tastatur kann den Inspector/TextEditor verdecken. Nur ausgleichen, wenn wirklich ein Feld fokussiert ist.
        .padding(.bottom, (horizontalSizeClass == .regular && focusedField != nil) ? keyboardOverlap : 0)
        #endif
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    /// Oberer Bereich: Diagramm-Titel + Canvas — soll den Großteil der Fläche einnehmen.
    private var canvasAndCaptionBlock: some View {
        VStack(alignment: .leading, spacing: 18) {
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

            GeometryReader { geo in
                ScrollView([.horizontal, .vertical]) {
                    DiagramCanvasView(
                        document: documentBinding,
                        selectedPath: selectedPathBinding,
                        errorText: errorTextBinding,
                        insertTarget: $insertTarget,
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
            }
        )
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
                var tabs = sheetTabs
                tabs[currentTabIndex].lineEditorText = newVal
                sheetTabs = tabs
            }
        )
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

    private func exportFilenameForCurrentTab() -> String {
        let raw = Self.stripVisuStructExtension(
            from: sheetTabs[currentTabIndex].linkedFileDisplayName ?? sheetTabs[currentTabIndex].title
        )
        let safe = raw.replacingOccurrences(of: "/", with: "-")
            .replacingOccurrences(of: ":", with: "-")
        return "\(safe).visustruct"
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

    private func closeDiagramTab(id: UUID) {
        guard sheetTabs.count > 1, let idx = sheetTabs.firstIndex(where: { $0.id == id }) else { return }
        let wasSelected = id == selectedTabId
        sheetTabs.remove(at: idx)
        if wasSelected {
            let newIdx = min(idx, sheetTabs.count - 1)
            selectedTabId = sheetTabs[newIdx].id
            refreshLineEditor()
        }
    }

    /// Kompaktes Textfeld unter dem Canvas (typisch 1–2 Zeilen); bei Bedarf per Scrollen mehr.
    private var inspectorPanel: some View {
        let captionFont: Font = horizontalSizeClass == .regular ? .caption2 : .caption
        let editorFont: Font = horizontalSizeClass == .regular ? .callout : .body
        /// Eine Zeile ~22 pt, zwei Zeilen knapp unter 50 pt — bewusst niedrig, Canvas bleibt dominant.
        let editorLineHeight: CGFloat = horizontalSizeClass == .regular ? 24 : 27
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
                if let labelBinding = fallauswahlCaseLabelBinding() {
                    TextField("z. B. 1, ok, default", text: labelBinding)
                        .font(editorFont)
                        .textFieldStyle(.roundedBorder)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled(true)
                        .focused($focusedField, equals: .caseLabel)
                }
                TextEditor(text: lineEditorTextBinding)
                    .font(editorFont)
                    .frame(minHeight: editorMinHeight, maxHeight: editorMaxHeight)
                    .scrollContentBackground(.hidden)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled(true)
                    .overlay(RoundedRectangle(cornerRadius: 6).stroke(.quaternary))
                    .focused($focusedField, equals: .textEditor)
                Button(lang.tr("inspector_apply_text")) {
                    applyLineEditor()
                }
                .disabled(selectedPath == nil)
                if let faPath = fallauswahlAncestorPath(for: selectedPath) {
                    let faCaseCount =
                        (try? VisuStructDocumentEditing.element(at: faPath, in: document))?.cases?.count ?? 0
                    let removeCaseIdx = fallauswahlSelectedCaseIndex(fallPath: faPath, selectedPath: selectedPath)
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

    /// Innerste **Fallauswahl**, die die aktuelle Auswahl enthält (für „Fall hinzufügen“).
    private func fallauswahlAncestorPath(for path: [Int]?) -> [Int]? {
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
    private func fallauswahlSelectedCaseIndex(fallPath: [Int], selectedPath: [Int]?) -> Int? {
        guard let sp = selectedPath, sp.count > fallPath.count else { return nil }
        return sp[fallPath.count]
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
    private func fallauswahlCaseLabelBinding() -> Binding<String>? {
        guard let fa = fallauswahlAncestorPath(for: selectedPath),
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
            let data = VisuStructXMLCodec.encode(document)
            try data.write(to: url, options: .atomic)
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
    }

    private func applyLineEditor() {
        guard let path = selectedPath else { return }
        let raw = sheetTabs[currentTabIndex].lineEditorText.components(separatedBy: "\n")
        let lines = raw.isEmpty ? [""] : raw
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
        let tmp = FileManager.default.temporaryDirectory.appendingPathComponent("\(UUID().uuidString)-\(fileName)")
        do {
            try data.write(to: tmp, options: .atomic)
            fileURLSharePayload = FileURLSharePayload(url: tmp)
        } catch {
            setErrorOnCurrentTab(String(format: lang.tr("err_share_prepare_failed_fmt"), error.localizedDescription))
        }
    }

    private func shareDiagramPDF() {
        guard let img = renderedDiagramUIImage() else {
            setErrorOnCurrentTab(lang.tr("err_diagram_too_small_export"))
            return
        }
        let fileName = pdfFilenameForCurrentTab()
        let tmp = FileManager.default.temporaryDirectory.appendingPathComponent("\(UUID().uuidString)-\(fileName)")
        let bounds = CGRect(origin: .zero, size: img.size)
        var format = UIGraphicsPDFRendererFormat()
        format.documentInfo = [
            kCGPDFContextCreator as String: "VisuStruct",
            kCGPDFContextTitle as String: Self.stripVisuStructExtension(from: sheetTabs[currentTabIndex].title)
        ]
        let renderer = UIGraphicsPDFRenderer(bounds: bounds, format: format)
        do {
            try renderer.writePDF(to: tmp) { ctx in
                ctx.beginPage()
                img.draw(in: bounds)
            }
            pdfQuickLookURL = tmp
        } catch {
            setErrorOnCurrentTab(String(format: lang.tr("err_share_prepare_failed_fmt"), error.localizedDescription))
        }
    }
    #endif

    #if canImport(UIKit)
    /// Gerendertes Struktogramm (gleiche Logik wie PNG-Teilen und Druck).
    private func renderedDiagramUIImage() -> UIImage? {
        let metrics = VisuStructLayoutEngine.diagramDisplayMetrics(isRegularWidth: horizontalSizeClass == .regular)
        let layout = VisuStructLayoutEngine(metrics: metrics).layout(document: document)
        let w = min(1400, max(320, layout.canvasSize.width))
        let h = min(1000, max(320, layout.canvasSize.height))
        let size = CGSize(width: w, height: h)
        guard w > 2, h > 2 else { return nil }
        let diagram = DiagramCanvasView(
            document: .constant(document),
            selectedPath: .constant(nil),
            errorText: .constant(nil),
            insertTarget: .constant(nil)
        )
        .frame(width: w, height: h)
        let exportRoot = ZStack {
            Color(white: 0.98)
            diagram
        }
        .frame(width: w, height: h)
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
        info.jobName = Self.stripVisuStructExtension(from: sheetTabs[currentTabIndex].title)
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

// MARK: - Code-Generator (Oberfläche; IAP folgt)

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

private struct CodeGeneratorPlaceholderSheet: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.appLanguage) private var lang
    let document: VisuStructDocument

    /// Letzte Zielsprache für den Code-Generator (Java/Python); bleibt erhalten bis zur nächsten Umschaltung.
    @AppStorage("visustruct.codegen.target") private var codegenTarget: String = "java"
    @State private var includeDiagramComments = false

    private static let javaTag = "java"
    private static let pythonTag = "python"

    private var target: VisuStructCodeGenerator.Target {
        codegenTarget == Self.pythonTag ? .python : .java
    }

    private var generatedCode: String {
        VisuStructCodeGenerator.generate(
            document: document,
            target: target,
            options: .init(baseIndent: 0, indentPerLevel: 4, includeDiagramTextAsComments: includeDiagramComments)
        )
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Picker("", selection: $codegenTarget) {
                        Text(lang.tr("codegen_target_java")).tag(Self.javaTag)
                        Text(lang.tr("codegen_target_python")).tag(Self.pythonTag)
                    }
                    .pickerStyle(.segmented)
                    .onAppear {
                        if codegenTarget != Self.javaTag, codegenTarget != Self.pythonTag {
                            codegenTarget = Self.javaTag
                        }
                    }

                    Toggle(isOn: $includeDiagramComments) {
                        Text(lang.tr("codegen_option_comments"))
                    }
                    .font(.subheadline)

                    Text(lang.tr("codegen_generated_hint"))
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                        .fixedSize(horizontal: false, vertical: true)

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
                #endif
                ToolbarItem(placement: .confirmationAction) {
                    Button(lang.tr("codegen_gate_ok")) { dismiss() }
                }
            }
        }
        .presentationDragIndicator(.visible)
    }
}

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
    private let webDisplay = "www.sebastiao.org"
    private let webURL = URL(string: "https://www.sebastiao.org")
    private let upstreamDisplay = "kekru/struktogrammeditor"
    private let upstreamURL = URL(string: "https://github.com/kekru/struktogrammeditor")

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
                            }
                            .font(.subheadline)
                        }
                    }

                    Divider()
                        .padding(.vertical, 4)

                    Text(lang.tr("about_intro"))
                        .font(.body)
                        .lineSpacing(5)

                    VStack(alignment: .leading, spacing: 14) {
                        Text(lang.tr("about_features_heading"))
                            .font(.headline)
                        AboutBullet(lang.tr("about_bullet_palette"))
                        AboutBullet(lang.tr("about_bullet_edit"))
                        AboutBullet(lang.tr("about_bullet_tabs"))
                        AboutBullet(lang.tr("about_bullet_file"))
                        AboutBullet(lang.tr("about_bullet_share"))
                    }

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

private struct AboutBullet: View {
    let text: String

    init(_ text: String) { self.text = text }

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Text("•")
                .font(.body.weight(.semibold))
                .frame(width: 14, alignment: .leading)
            Text(text)
                .font(.subheadline)
                .lineSpacing(3)
                .fixedSize(horizontal: false, vertical: true)
        }
    }
}

