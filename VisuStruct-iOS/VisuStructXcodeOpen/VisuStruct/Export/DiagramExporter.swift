#if canImport(UIKit)
import SwiftUI
import UIKit
import VisuStructCore

/// PNG, Datei, PDF und Druck für das aktuelle Diagramm. Fehler gehen als lokalisierter Text an `setError`.
@MainActor
struct DiagramExporter {
    let document: VisuStructDocument
    let horizontalSizeClass: UserInterfaceSizeClass?
    let canvasScaleStep: VisuStructUIScaleStep
    let lang: AppLanguage
    let displayScale: CGFloat
    let setError: (String) -> Void

    /// Bild für „PNG teilen“; `nil` mit Fehlermeldung, wenn das Diagramm zu klein ist.
    func pngImage() -> UIImage? {
        renderedImage(tooSmallErrorKey: "err_diagram_too_small_export")
    }

    /// Temporäre `.visustruct`-Datei zum Teilen.
    func temporaryDocumentFile(named fileName: String) -> URL? {
        let data = VisuStructXMLCodec.encode(document)
        do {
            return try DiagramSnapshotExport.writeTemporaryVisustructFile(data: data, fileName: fileName)
        } catch {
            setError(String(format: lang.tr("err_share_prepare_failed_fmt"), error.localizedDescription))
            return nil
        }
    }

    /// Temporäre PDF-Datei für die Vorschau.
    func temporaryPDF(named fileName: String) -> URL? {
        guard let img = renderedImage(tooSmallErrorKey: "err_diagram_too_small_export") else { return nil }
        let metaTitle = DiagramSnapshotExport.exportVisibleDiagramTitle(document: document, lang: lang)
        do {
            return try DiagramSnapshotExport.writeTemporaryDiagramPDF(
                image: img,
                fileName: fileName,
                pdfMetadataTitle: metaTitle
            )
        } catch {
            setError(String(format: lang.tr("err_share_prepare_failed_fmt"), error.localizedDescription))
            return nil
        }
    }

    func printDiagram() {
        guard let img = renderedImage(tooSmallErrorKey: "err_diagram_too_small_print") else { return }
        guard UIPrintInteractionController.isPrintingAvailable else {
            setError(lang.tr("err_print_unavailable"))
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

    private func renderedImage(tooSmallErrorKey: String) -> UIImage? {
        guard let img = DiagramSnapshotExport.renderedDiagramUIImage(
            document: document,
            horizontalSizeClass: horizontalSizeClass,
            canvasScaleStep: canvasScaleStep,
            lang: lang,
            displayScale: displayScale
        ) else {
            setError(lang.tr(tooSmallErrorKey))
            return nil
        }
        return img
    }
}
#endif
