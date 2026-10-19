import Foundation
import Observation
import VisuStructCore

/// Mehrere Diagramm-Reiter: Tabs, Auswahl, Serial, Schließen inkl. „ungespeichert“-Dialog.
/// Bearbeiten des aktuellen Reiters (Dokument, Undo/Redo, Auswahl): `DiagramSheetTabsModel+Editing.swift`.
/// UI-Nebenwirkungen (z. B. `refreshLineEditor`, Fokus) bleiben in `ContentView`.
@MainActor
@Observable
final class DiagramSheetTabsModel {
    var tabs: [DiagramSheetTab]
    var selectedTabId: UUID
    var nextTabSerial: Int
    var pendingCloseTabId: UUID?
    var closeTabAfterSuccessfulExportId: UUID?

    var currentTabIndex: Int {
        tabs.firstIndex(where: { $0.id == selectedTabId }) ?? 0
    }

    init(tabs: [DiagramSheetTab], selectedTabId: UUID, nextTabSerial: Int) {
        self.tabs = tabs
        self.selectedTabId = selectedTabId
        self.nextTabSerial = nextTabSerial
        self.pendingCloseTabId = nil
        self.closeTabAfterSuccessfulExportId = nil
    }

    static func makeInitial(language: AppLanguage) -> DiagramSheetTabsModel {
        let first = DiagramSheetTab.makeNew(serial: 1, language: language)
        return DiagramSheetTabsModel(tabs: [first], selectedTabId: first.id, nextTabSerial: 2)
    }

    /// Reiter- und Titelleiste: ohne `.visustruct` / `.strk`; auch als Basis für Export.
    static func stripVisuStructExtension(from name: String) -> String {
        VisuStructDiagramFile.stripKnownExtension(from: name)
    }

    func tabHasUnsavedChanges(_ tab: DiagramSheetTab) -> Bool {
        VisuStructXMLCodec.encode(tab.document) != tab.savedDocumentBaseline
    }

    private func tabDisplayTitle(forCaption caption: String, language: AppLanguage) -> String {
        let t = caption.trimmingCharacters(in: .whitespacesAndNewlines)
        return t.isEmpty ? language.tr("diagram_title_placeholder") : t
    }

    func diagramTabDisplayTitle(_ tab: DiagramSheetTab, language: AppLanguage) -> String {
        let raw = Self.stripVisuStructExtension(from: tab.title)
        if raw.isEmpty { return tabDisplayTitle(forCaption: tab.document.caption, language: language) }
        return raw
    }

    func syncTabTitleWithDocumentCaption(tabIndex i: Int, language: AppLanguage) {
        guard tabs.indices.contains(i) else { return }
        var copy = tabs
        copy[i].title = tabDisplayTitle(forCaption: copy[i].document.caption, language: language)
        tabs = copy
    }

    func syncCurrentTabTitleWithCaption(_ caption: String, language: AppLanguage) {
        let i = currentTabIndex
        var copy = tabs
        copy[i].title = tabDisplayTitle(forCaption: caption, language: language)
        tabs = copy
    }

    func addDiagramTab(language: AppLanguage) {
        let serial = nextTabSerial
        nextTabSerial += 1
        let tab = DiagramSheetTab.makeNew(serial: serial, language: language)
        tabs.append(tab)
        selectedTabId = tab.id
    }

    /// Ungespeichert → `pendingCloseTabId`; sonst sofort schließen. `true` = selektierter Tab gewechselt → Aufrufer soll z. B. Zeileneditor refreshen.
    @discardableResult
    func requestCloseDiagramTab(id: UUID) -> Bool {
        guard tabs.count > 1, let idx = tabs.firstIndex(where: { $0.id == id }) else { return false }
        if tabHasUnsavedChanges(tabs[idx]) {
            pendingCloseTabId = id
            return false
        }
        return closeDiagramTab(id: id)
    }

    /// Entfernt einen Reiter. `true`, wenn die Auswahl gewechselt wurde.
    @discardableResult
    func closeDiagramTab(id: UUID) -> Bool {
        guard tabs.count > 1, let idx = tabs.firstIndex(where: { $0.id == id }) else { return false }
        let wasSelected = id == selectedTabId
        tabs.remove(at: idx)
        if wasSelected {
            let newIdx = min(idx, tabs.count - 1)
            selectedTabId = tabs[newIdx].id
            return true
        }
        return false
    }

    /// Nach Alert „Verwerfen“.
    @discardableResult
    func discardPendingCloseTab() -> Bool {
        guard let id = pendingCloseTabId else { return false }
        pendingCloseTabId = nil
        return closeDiagramTab(id: id)
    }
}
