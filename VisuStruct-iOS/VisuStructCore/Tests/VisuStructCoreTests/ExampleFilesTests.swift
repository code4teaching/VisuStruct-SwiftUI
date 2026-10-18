import XCTest
import VisuStructCore

/// Jede Beispieldatei muss sich laden, verlustfrei speichern und in alle Zielsprachen übersetzen lassen.
final class ExampleFilesTests: XCTestCase {
    func testExampleDirectoryContainsDiagrams() throws {
        XCTAssertFalse(try ExampleFiles.allDiagramURLs().isEmpty, "Keine Beispieldateien gefunden in \(ExampleFiles.directory.path)")
    }

    func testAllExamplesDecodeAndRoundTrip() throws {
        for url in try ExampleFiles.allDiagramURLs() {
            let name = url.lastPathComponent
            let decoded = try VisuStructXMLCodec.decode(url: url)
            XCTAssertFalse(decoded.elements.isEmpty, "\(name): keine Elemente")

            let reencoded = VisuStructXMLCodec.encode(decoded)
            let decodedAgain = try VisuStructXMLCodec.decode(data: reencoded)
            XCTAssertEqual(decodedAgain, decoded, "\(name): Speichern und erneutes Laden verändert das Diagramm")
        }
    }

    func testAllExamplesGenerateCodeForEveryTarget() throws {
        let targets: [VisuStructCodeGenerator.Target] = [.java, .python, .javascript]
        for url in try ExampleFiles.allDiagramURLs() {
            let name = url.lastPathComponent
            let document = try VisuStructXMLCodec.decode(url: url)
            for target in targets {
                let code = VisuStructCodeGenerator.generate(document: document, target: target)
                XCTAssertFalse(
                    code.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
                    "\(name): leerer Code für \(target.rawValue)"
                )
            }
        }
    }
}
