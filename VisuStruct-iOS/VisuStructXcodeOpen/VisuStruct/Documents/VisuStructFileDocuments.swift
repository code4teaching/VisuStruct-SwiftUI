import SwiftUI
import UniformTypeIdentifiers
import VisuStructCore

// MARK: - FileDocument (einheitlich .visustruct / XML wie Java)

struct VisuStructFileDocument: FileDocument, Sendable {
    /// Export/Speichern: eigene Endung, damit der Dialog nicht zusätzlich `.xml` anhängt.
    static var preferredExportContentType: UTType {
        if let v = UTType(filenameExtension: "visustruct") {
            return v
        }
        return .xml
    }

    static var readableContentTypes: [UTType] {
        if let v = UTType(filenameExtension: "visustruct") {
            return [v, .xml]
        }
        return [.xml]
    }

    static var writableContentTypes: [UTType] { readableContentTypes }

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

/// Export des erzeugten Java-Quelltexts als `.java` (nicht `.class` — das erzeugt `javac`).
struct JavaSourceExportDocument: FileDocument, Sendable {
    static var readableContentTypes: [UTType] {
        if let java = UTType(filenameExtension: "java") {
            return [java, .plainText]
        }
        return [.plainText]
    }

    var source: String

    init(source: String) {
        self.source = source
    }

    init(configuration: ReadConfiguration) throws {
        guard let data = configuration.file.regularFileContents else {
            source = ""
            return
        }
        source = String(decoding: data, as: UTF8.self)
    }

    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper {
        FileWrapper(regularFileWithContents: Data(source.utf8))
    }
}
