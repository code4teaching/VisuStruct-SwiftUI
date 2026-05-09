import Foundation
import VisuStructCore

/// Öffnen aus Datei / Recent, Verknüpfung mit Bookmark und Dateiname — gekoppelt an `DiagramSheetTabsModel` und `RecentFilesStore`.
@MainActor
final class DiagramEditorDocumentServices {
    private let tabsModel: DiagramSheetTabsModel
    private let recentFilesStore: RecentFilesStore

    init(tabsModel: DiagramSheetTabsModel, recentFilesStore: RecentFilesStore) {
        self.tabsModel = tabsModel
        self.recentFilesStore = recentFilesStore
    }

    func fileDisplayName(from url: URL) -> String {
        let name = url.deletingPathExtension().lastPathComponent.trimmingCharacters(in: .whitespacesAndNewlines)
        let base = name.isEmpty ? url.deletingPathExtension().lastPathComponent : name
        return DiagramSheetTabsModel.stripVisuStructExtension(from: base)
    }

    func setLinkedFile(forCurrentTab url: URL) {
        var tabs = tabsModel.tabs
        let i = tabsModel.currentTabIndex
        tabs[i].linkedFileBookmarkData = recentFilesStore.makeBookmarkData(for: url)
        let display = fileDisplayName(from: url)
        tabs[i].linkedFileDisplayName = display.isEmpty ? nil : display
        if let d = tabs[i].linkedFileDisplayName {
            tabs[i].title = d
        }
        tabsModel.tabs = tabs
        recentFilesStore.record(url: url, displayName: display)
    }

    func documentWithFilenameCaptionIfNeeded(_ doc: VisuStructDocument, fileURL url: URL) -> VisuStructDocument {
        guard doc.caption.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return doc }
        let display = fileDisplayName(from: url)
        guard !display.isEmpty else { return doc }
        var updated = doc
        updated.caption = display
        return updated
    }

    func applyFilenameCaptionToCurrentDocumentIfNeeded(fileURL url: URL, language: AppLanguage) -> VisuStructDocument {
        let i = tabsModel.currentTabIndex
        let updated = documentWithFilenameCaptionIfNeeded(tabsModel.tabs[i].document, fileURL: url)
        guard updated != tabsModel.tabs[i].document else { return updated }
        var tabs = tabsModel.tabs
        tabs[i].document = updated
        tabs[i].title = tabDisplayTitle(forCaption: updated.caption, language: language)
        tabsModel.tabs = tabs
        return updated
    }

    private func tabDisplayTitle(forCaption caption: String, language: AppLanguage) -> String {
        let t = caption.trimmingCharacters(in: .whitespacesAndNewlines)
        return t.isEmpty ? language.tr("diagram_title_placeholder") : t
    }

    @discardableResult
    func openDocument(
        from url: URL,
        resetHistoryAndDocument: (VisuStructDocument) -> Void,
        refreshLineEditor: () -> Void,
        setError: (String) -> Void
    ) -> Bool {
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
            var tabs = tabsModel.tabs
            let i = tabsModel.currentTabIndex
            tabs[i].selectedPath = tabs[i].document.elements.isEmpty ? nil : [0]
            tabs[i].errorText = nil
            let display = fileDisplayName(from: url)
            tabs[i].linkedFileDisplayName = display.isEmpty ? nil : display
            tabs[i].title = tabs[i].linkedFileDisplayName ?? tabs[i].title
            tabsModel.tabs = tabs
            setLinkedFile(forCurrentTab: url)
            refreshLineEditor()
            return true
        } catch {
            setError(error.localizedDescription)
            return false
        }
    }

    func openRecentFile(
        _ recentFile: RecentVisuStructFile,
        resetHistoryAndDocument: (VisuStructDocument) -> Void,
        refreshLineEditor: () -> Void,
        setError: (String) -> Void
    ) {
        do {
            let url = try recentFilesStore.resolveURL(for: recentFile)
            if openDocument(from: url, resetHistoryAndDocument: resetHistoryAndDocument, refreshLineEditor: refreshLineEditor, setError: setError) {
                recentFilesStore.record(url: url, displayName: fileDisplayName(from: url))
                return
            }
            if let p = recentFile.filePath, p.hasPrefix(NSHomeDirectory()) {
                let fallbackURL = URL(fileURLWithPath: p)
                if openDocument(from: fallbackURL, resetHistoryAndDocument: resetHistoryAndDocument, refreshLineEditor: refreshLineEditor, setError: setError) {
                    recentFilesStore.record(url: fallbackURL, displayName: fileDisplayName(from: fallbackURL))
                    return
                }
            }
            recentFilesStore.remove(id: recentFile.id)
        } catch {
            recentFilesStore.remove(id: recentFile.id)
            setError(error.localizedDescription)
        }
    }
}
