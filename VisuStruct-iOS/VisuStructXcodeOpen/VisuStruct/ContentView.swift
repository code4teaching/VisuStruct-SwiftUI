import SwiftUI
import UniformTypeIdentifiers
import VisuStructCore
#if canImport(UIKit)
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
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding(.vertical, 10)
            .padding(.horizontal, 12)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background {
                RoundedRectangle(cornerRadius: 10, style: .continuous)
                    .fill(configuration.isPressed ? Color(.quaternarySystemFill) : Color(.tertiarySystemFill))
            }
            .overlay {
                RoundedRectangle(cornerRadius: 10, style: .continuous)
                    .strokeBorder(Color.primary.opacity(configuration.isPressed ? 0.14 : 0.10), lineWidth: 1)
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
#endif

// MARK: - Mehrere Struktogramm-Reiter

private struct DiagramSheetTab: Identifiable {
    let id: UUID
    var title: String
    var document: VisuStructDocument
    var undoStack: [VisuStructDocument] = []
    var redoStack: [VisuStructDocument] = []
    var selectedPath: [Int]? = [0]
    var showCanvas: Bool = true
    var lineEditorText: String = ""
    var errorText: String? = nil
    /// Security-Scoped Bookmark der zuletzt geöffneten oder unter „Speichern unter …“ gewählten Datei — für **Speichern** ohne Dialog.
    var linkedFileBookmarkData: Data? = nil

    static func makeNew(serial: Int, id: UUID = UUID(), language: AppLanguage) -> DiagramSheetTab {
        let title = String(
            format: language.tr("tab_title_format"),
            locale: Locale(identifier: language.localeIdentifierForFormatting),
            arguments: [serial as CVarArg]
        )
        return DiagramSheetTab(
            id: id,
            title: title,
            document: VisuStructDocumentEditing.newEmpty(),
            undoStack: [],
            redoStack: [],
            selectedPath: [0],
            showCanvas: true,
            lineEditorText: "",
            errorText: nil,
            linkedFileBookmarkData: nil
        )
    }
}

// MARK: - Hauptansicht

@MainActor
struct ContentView: View {
    @Environment(\.displayScale) private var displayScale
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @Environment(\.appLanguage) private var lang

    @State private var sheetTabs: [DiagramSheetTab]
    @State private var selectedTabId: UUID
    @State private var nextTabSerial: Int

    @State private var showImporter = false
    @State private var showExporter = false
    @State private var showInfo = false
    #if canImport(UIKit)
    @State private var pngSharePayload: PNGSharePayload?
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
                    paletteListPanel
                        .frame(maxHeight: 300, alignment: .top)
                        .background(Color(.secondarySystemGroupedBackground))
                        .clipped()
                    Divider()
                    mainEditorNavigationStack
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            }
        }
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
                        // Kein `.withSecurityScope` — auf iOS unverfügbar; `.minimalBookmark` reicht für Dateizugriff nach Öffnen.
                        tabs[i].linkedFileBookmarkData = try? url.bookmarkData(
                            options: .minimalBookmark,
                            includingResourceValuesForKeys: nil,
                            relativeTo: nil
                        )
                        sheetTabs = tabs
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
                    var tabs = sheetTabs
                    let i = currentTabIndex
                    tabs[i].linkedFileBookmarkData = try? url.bookmarkData(
                        options: .minimalBookmark,
                        includingResourceValuesForKeys: nil,
                        relativeTo: nil
                    )
                    sheetTabs = tabs
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
        #if canImport(UIKit)
        .sheet(item: $pngSharePayload) { payload in
            ActivityShareSheet(items: [payload.image])
        }
        #endif
        .onChange(of: selectedTabId) { _, _ in
            refreshLineEditor()
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
    private var paletteListStackBody: some View {
        List {
            Section {
                ForEach(ElementPalette.PaletteItem.paletteOrder) { item in
                    Button {
                        appendRoot(ElementPalette.element(for: item, lang: lang))
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
                    .listRowInsets(EdgeInsets(top: 5, leading: 12, bottom: 5, trailing: 12))
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
                .buttonStyle(.bordered)
                .frame(maxWidth: .infinity)
                .listRowInsets(EdgeInsets(top: 8, leading: 12, bottom: 6, trailing: 12))
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
                Button(role: .destructive) {
                    deleteSelection()
                } label: {
                    Label(lang.tr("action_delete_selection"), systemImage: "trash")
                }
                .buttonStyle(.bordered)
                .frame(maxWidth: .infinity)
                .listRowInsets(EdgeInsets(top: 6, leading: 12, bottom: 6, trailing: 12))
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
                .buttonStyle(.bordered)
                .frame(maxWidth: .infinity)
                .listRowInsets(EdgeInsets(top: 6, leading: 12, bottom: 8, trailing: 12))
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
            }
        }
        .listStyle(.insetGrouped)
        .listSectionSpacing(18)
        .environment(\.defaultMinListRowHeight, 48)
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
                                description: Text(err)
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
            .navigationTitle(sheetTabs[currentTabIndex].title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarBackground(.regularMaterial, for: .navigationBar)
            .toolbar {
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
                    if document.elements.isEmpty == false {
                        Toggle(isOn: showCanvasBinding) {
                            Image(systemName: "rectangle.on.rectangle")
                        }
                        .accessibilityLabel(lang.tr("a11y_canvas_toggle"))
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
        return HStack(spacing: 2) {
            Button {
                selectedTabId = tab.id
                refreshLineEditor()
            } label: {
                Text(tab.title)
                    .lineLimit(1)
                    .font(.subheadline.weight(selected ? .semibold : .regular))
                    .foregroundStyle(selected ? Color.primary : Color.secondary)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
            }
            .buttonStyle(.plain)
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
            inspectorPanel
        }
        .padding(horizontalSizeClass == .regular ? EdgeInsets(top: 16, leading: 18, bottom: 16, trailing: 18) : EdgeInsets(top: 16, leading: 14, bottom: 16, trailing: 14))
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    /// Oberer Bereich: Diagramm-Titel + Canvas bzw. Listenansicht — soll den Großteil der Fläche einnehmen.
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
            }

            if sheetTabs[currentTabIndex].showCanvas {
                GeometryReader { geo in
                    ScrollView([.horizontal, .vertical]) {
                        DiagramCanvasView(
                            document: documentBinding,
                            selectedPath: selectedPathBinding,
                            errorText: errorTextBinding,
                            minViewportSize: CGSize(width: geo.size.width, height: geo.size.height)
                        )
                        .padding(.vertical, 8)
                    }
                    .scrollBounceBehavior(.basedOnSize, axes: [.horizontal, .vertical])
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                List {
                    if !document.caption.isEmpty {
                        Section(lang.tr("list_section_title")) { Text(document.caption) }
                    }
                    Section(lang.tr("list_section_elements")) {
                        ForEach(Array(document.elements.enumerated()), id: \.offset) { _, e in
                            ElementNodeView(element: e)
                        }
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
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

    private var showCanvasBinding: Binding<Bool> {
        Binding(
            get: { sheetTabs[currentTabIndex].showCanvas },
            set: { newVal in
                var tabs = sheetTabs
                tabs[currentTabIndex].showCanvas = newVal
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
        let raw = sheetTabs[currentTabIndex].title
        let safe = raw.replacingOccurrences(of: "/", with: "-")
            .replacingOccurrences(of: ":", with: "-")
        return "\(safe).visustruct"
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
                    Text(lang.tr("inspector_case_label_help"))
                        .font(captionFont)
                        .foregroundStyle(.secondary)
                        .lineSpacing(3)
                    TextField("z. B. 1, ok, default", text: labelBinding)
                        .font(editorFont)
                        .textFieldStyle(.roundedBorder)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled(true)
                }
                TextEditor(text: lineEditorTextBinding)
                    .font(editorFont)
                    .frame(minHeight: editorMinHeight, maxHeight: editorMaxHeight)
                    .scrollContentBackground(.hidden)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled(true)
                    .overlay(RoundedRectangle(cornerRadius: 6).stroke(.quaternary))
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
        tabs[currentTabIndex].selectedPath = [0]
        tabs[currentTabIndex].errorText = nil
        tabs[currentTabIndex].linkedFileBookmarkData = nil
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
            errorText: .constant(nil)
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
        info.jobName = sheetTabs[currentTabIndex].title
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

private struct ElementNodeView: View {
    @Environment(\.appLanguage) private var lang
    let element: VisuStructElement

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(verbatim: "Typ \(element.type.rawValue)  zx=\(element.zoomX)  zy=\(element.zoomY)")
                .font(.headline)
            ForEach(element.textLines, id: \.self) { line in
                Text(line).font(.body)
            }

            if let loopBody = element.loopBody {
                DisclosureGroup(lang.tr("debug_loop_body")) {
                    ForEach(Array(loopBody.enumerated()), id: \.offset) { _, e in
                        ElementNodeView(element: e)
                    }
                }
            }

            if let cases = element.cases {
                DisclosureGroup(lang.tr("debug_cases")) {
                    ForEach(Array(cases.enumerated()), id: \.offset) { _, c in
                        DisclosureGroup(c.name.isEmpty ? lang.tr("debug_empty_case") : c.name) {
                            ForEach(Array(c.elements.enumerated()), id: \.offset) { _, e in
                                ElementNodeView(element: e)
                            }
                        }
                    }
                }
            }
        }
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
                    Text(lang.tr("about_intro"))
                        .font(.body)
                        .lineSpacing(5)

                    if let webURL = URL(string: "https://visustruct.de") {
                        Link(destination: webURL) {
                            Label("visustruct.de", systemImage: "safari")
                        }
                        .font(.subheadline)
                    }

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

                    Text(versionLine)
                        .font(.subheadline)
                        .monospacedDigit()
                        .foregroundStyle(.secondary)

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

