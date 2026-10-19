import XCTest
import VisuStructCore

final class MultiwayPathTests: XCTestCase {
    /// `[0]` Anweisung, `[1]` Fallauswahl mit zwei Fällen; im zweiten Fall eine innere Fallauswahl `[1, 1, 0]`.
    private func document() -> VisuStructDocument {
        let statement = VisuStructElement(type: .anweisung, textLines: ["x = 1"])
        let inner = VisuStructElement(
            type: .fallauswahl,
            textLines: ["y"],
            cases: [
                VisuStructCase(name: "1", elements: [statement]),
                VisuStructCase(name: "default", elements: [statement]),
            ]
        )
        let outer = VisuStructElement(
            type: .fallauswahl,
            textLines: ["x"],
            cases: [
                VisuStructCase(name: "1", elements: [statement]),
                VisuStructCase(name: "default", elements: [inner]),
            ]
        )
        var doc = VisuStructDocumentEditing.newEmpty()
        doc.elements = [statement, outer]
        return doc
    }

    func testAncestorIsInnermostFallauswahl() {
        let doc = document()
        XCTAssertNil(VisuStructDocumentEditing.multiwayAncestorPath(for: nil, in: doc))
        XCTAssertNil(VisuStructDocumentEditing.multiwayAncestorPath(for: [0], in: doc))
        XCTAssertEqual(VisuStructDocumentEditing.multiwayAncestorPath(for: [1], in: doc), [1])
        XCTAssertEqual(VisuStructDocumentEditing.multiwayAncestorPath(for: [1, 0, 0], in: doc), [1])
        XCTAssertEqual(VisuStructDocumentEditing.multiwayAncestorPath(for: [1, 1, 0], in: doc), [1, 1, 0])
        XCTAssertEqual(VisuStructDocumentEditing.multiwayAncestorPath(for: [1, 1, 0, 1, 0], in: doc), [1, 1, 0])
    }

    func testCaseIndex() {
        XCTAssertNil(VisuStructDocumentEditing.caseIndex(of: [1], inMultiwayAt: [1]))
        XCTAssertNil(VisuStructDocumentEditing.caseIndex(of: nil, inMultiwayAt: [1]))
        XCTAssertEqual(VisuStructDocumentEditing.caseIndex(of: [1, 1, 0], inMultiwayAt: [1]), 1)
    }
}
