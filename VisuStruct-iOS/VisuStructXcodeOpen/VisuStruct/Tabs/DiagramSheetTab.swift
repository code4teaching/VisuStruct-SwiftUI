import SwiftUI
import VisuStructCore

// MARK: - Mehrere Struktogramm-Reiter

struct DiagramSheetTab: Identifiable {
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
