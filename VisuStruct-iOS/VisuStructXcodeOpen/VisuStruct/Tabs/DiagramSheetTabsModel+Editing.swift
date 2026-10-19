import Foundation
import VisuStructCore

// MARK: - Bearbeiten des aktuellen Reiters (Dokument, Verlauf, Auswahl, Fehler)

extension DiagramSheetTabsModel {
    var currentTab: DiagramSheetTab {
        tabs[currentTabIndex]
    }

    /// Ändert den aktuellen Reiter und weist `tabs` genau einmal neu zu.
    func updateCurrentTab(_ change: (inout DiagramSheetTab) -> Void) {
        let i = currentTabIndex
        var copy = tabs
        change(&copy[i])
        tabs = copy
    }

    /// Ersetzt das Dokument und legt einen Undo-Snapshot des bisherigen Zustands ab.
    func commitDocument(_ new: VisuStructDocument) {
        updateCurrentTab { tab in
            guard new != tab.document else { return }
            tab.history.record(tab.document)
            tab.document = new
        }
    }

    /// Neu / Import: Historie verwerfen, Zustand setzen.
    func resetHistoryAndDocument(_ new: VisuStructDocument) {
        updateCurrentTab { tab in
            tab.history.reset()
            tab.document = new
            tab.savedDocumentBaseline = VisuStructXMLCodec.encode(new)
        }
    }

    /// `true`, wenn ein Schritt rückgängig gemacht wurde.
    @discardableResult
    func undo() -> Bool {
        var changed = false
        updateCurrentTab { tab in
            guard let previous = tab.history.undo(from: tab.document) else { return }
            Self.applyHistoryJump(previous, to: &tab)
            changed = true
        }
        return changed
    }

    /// `true`, wenn ein Schritt wiederhergestellt wurde.
    @discardableResult
    func redo() -> Bool {
        var changed = false
        updateCurrentTab { tab in
            guard let next = tab.history.redo(from: tab.document) else { return }
            Self.applyHistoryJump(next, to: &tab)
            changed = true
        }
        return changed
    }

    private static func applyHistoryJump(_ document: VisuStructDocument, to tab: inout DiagramSheetTab) {
        tab.document = document
        tab.errorText = nil
        tab.selectedPath = VisuStructDocumentEditing.sanitizedSelection(tab.selectedPath, in: document)
    }

    /// Neue Auswahl nach einer Einfügung o. Ä.; ein angezeigter Fehler verschwindet.
    func selectAndClearError(_ path: [Int]?) {
        updateCurrentTab { tab in
            tab.selectedPath = path
            tab.errorText = nil
        }
    }

    func setErrorOnCurrentTab(_ message: String?) {
        updateCurrentTab { $0.errorText = message }
    }
}
