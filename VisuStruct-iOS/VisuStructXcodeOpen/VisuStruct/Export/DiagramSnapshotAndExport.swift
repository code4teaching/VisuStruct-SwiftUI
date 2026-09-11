import Foundation
import SwiftUI
import VisuStructCore

// MARK: - Export: Dateiname (.visustruct / .pdf)

enum DiagramExportFilename {
    /// Gleiche Semantik wie `DiagramSheetTabsModel.stripVisuStructExtension` — hier freistehend,
    /// damit Dateinamen-Helfer nicht `@MainActor`-isolierte Typen aufrufen müssen.
    private static func stripVisuStructExtension(from name: String) -> String {
        VisuStructDiagramFile.stripKnownExtension(from: name)
    }

    /// Vorschlag für „Speichern unter …“ / Teilen — je nach Einstellung nur Titel oder `yyyy-MM-dd-<Titel>`.
    static func visustructFilename(for tab: DiagramSheetTab, style: ExportFilenameStyle) -> String {
        let caption = tab.document.caption.trimmingCharacters(in: .whitespacesAndNewlines)
        let baseRaw: String
        if !caption.isEmpty {
            baseRaw = caption
        } else if let linked = tab.linkedFileDisplayName?.trimmingCharacters(in: .whitespacesAndNewlines), !linked.isEmpty {
            baseRaw = Self.stripVisuStructExtension(from: linked)
        } else {
            baseRaw = Self.stripVisuStructExtension(from: tab.title)
        }
        let slug = sanitizedExportFilenameSlug(baseRaw)
        let body: String
        switch style {
        case .titleOnly:
            if slug.isEmpty {
                let fallback = sanitizedExportFilenameSlug(
                    Self.stripVisuStructExtension(from: tab.title)
                )
                body = fallback.isEmpty ? "VisuStruct" : fallback
            } else {
                body = slug
            }
        case .dateAndTitle:
            if slug.isEmpty {
                body = String(isoDatePrefixForExportFilename().dropLast())
            } else if hasISODatePrefix(slug) {
                body = slug
            } else {
                body = "\(isoDatePrefixForExportFilename())\(slug)"
            }
        }
        return "\(body).visustruct"
    }

    static func pdfFilename(fromVisustructFilename v: String) -> String {
        let suffix = ".visustruct"
        if v.lowercased().hasSuffix(suffix) {
            return String(v.dropLast(suffix.count)) + ".pdf"
        }
        return v + ".pdf"
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
        s = Self.stripVisuStructExtension(from: s)
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
}

#if canImport(UIKit)
import UIKit

// MARK: - PDF (A4)

private enum A4SinglePageLayout {
    private static let portrait = CGSize(width: 595, height: 842)
    private static let landscape = CGSize(width: 842, height: 595)
    private static let margin: CGFloat = 32
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

// MARK: - Raster + temporäre Export-Dateien

@MainActor
enum DiagramSnapshotExport {
    /// Text für PDF/PNG/Druck: bei leerem Caption der lokalisierte Platzhalter (wie im Titelfeld).
    static func exportVisibleDiagramTitle(document: VisuStructDocument, lang: AppLanguage) -> String {
        let t = document.caption.trimmingCharacters(in: .whitespacesAndNewlines)
        return t.isEmpty ? lang.tr("diagram_title_placeholder") : t
    }

    /// Titelhöhe für den Raster-Export: keine künstlich hohe `maxHeight` — sonst bei einer Zeile großer Leerraum bis zum Kasten.
    static func exportRasterTitleBlockHeight(rasterWidth: CGFloat, exportTitle: String) -> CGFloat {
        let hPad: CGFloat = 12 * 2
        let textW = max(1, rasterWidth - hPad)
        let title = exportTitle as NSString
        let font = UIFont.systemFont(ofSize: 16, weight: .semibold)
        let h = title.boundingRect(
            with: CGSize(width: textW, height: 10_000),
            options: [.usesLineFragmentOrigin, .usesFontLeading],
            attributes: [.font: font],
            context: nil
        ).height
        return min(56, ceil(h) + 2)
    }

    /// Gerendertes Struktogramm inkl. **sichtbarem** Diagrammtitel (gleiche Logik für PNG, PDF, Druck).
    static func renderedDiagramUIImage(
        document: VisuStructDocument,
        horizontalSizeClass: UserInterfaceSizeClass?,
        canvasScaleStep: VisuStructUIScaleStep,
        lang: AppLanguage,
        displayScale: CGFloat
    ) -> UIImage? {
        let metrics = VisuStructLayoutEngine.diagramDisplayMetrics(isRegularWidth: horizontalSizeClass == .regular)
            .scaled(by: canvasScaleStep.multiplier)
        let exportInset: (left: Double, top: Double) = (12, 10)
        let layout = VisuStructLayoutEngine(metrics: metrics).layout(document: document, topLeadingContentInset: exportInset)
        let exportPixelCap: CGFloat = 8000
        let w = min(exportPixelCap, max(320, CGFloat(layout.canvasSize.width)))
        let h = min(exportPixelCap, max(320, CGFloat(layout.canvasSize.height)))
        let titleText = exportVisibleDiagramTitle(document: document, lang: lang)
        let titleBlockH = exportRasterTitleBlockHeight(rasterWidth: w, exportTitle: titleText)
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
            Text(titleText)
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

        return renderDiagramToUIImage(content: exportRoot, size: size, scale: displayScale)
    }

    /// Schreibt `.visustruct`-Daten in eine **temporäre** Datei (wie zuvor in `ContentView`).
    static func writeTemporaryVisustructFile(data: Data, fileName: String) throws -> URL {
        let dir = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString, isDirectory: true)
        let tmp = dir.appendingPathComponent(fileName)
        try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        try data.write(to: tmp, options: .atomic)
        return tmp
    }

    /// Einseitiges PDF mit Diagramm-Rasterbild; temporäre Datei unter `temporaryDirectory`.
    static func writeTemporaryDiagramPDF(image: UIImage, fileName: String, pdfMetadataTitle: String) throws -> URL {
        let dir = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString, isDirectory: true)
        let tmp = dir.appendingPathComponent(fileName)
        let (pageBounds, imageDrawRect) = A4SinglePageLayout.pageAndImageDrawRect(imageSize: image.size)
        let format = UIGraphicsPDFRendererFormat()
        format.documentInfo = [
            kCGPDFContextCreator as String: "VisuStruct",
            kCGPDFContextTitle as String: pdfMetadataTitle
        ]
        let renderer = UIGraphicsPDFRenderer(bounds: pageBounds, format: format)
        try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        try renderer.writePDF(to: tmp) { ctx in
            ctx.beginPage()
            image.draw(in: imageDrawRect)
        }
        return tmp
    }

    /// `ImageRenderer` liefert bei `Canvas` manchmal `nil` oder leer — Fallback über `UIHostingController` + `drawHierarchy`.
    static func renderDiagramToUIImage<V: View>(content: V, size: CGSize, scale: CGFloat) -> UIImage? {
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
}
#endif
