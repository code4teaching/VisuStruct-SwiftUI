import XCTest
import VisuStructCore

final class DiagramTextTests: XCTestCase {
    func testKeywordsAreAddedForControlStructures() {
        XCTAssertEqual(VisuStructDiagramText.displayLines(for: VisuStructElement(type: .verzweigung, textLines: ["a > 3"])), ["if a > 3"])
        XCTAssertEqual(VisuStructDiagramText.displayLines(for: VisuStructElement(type: .verzweigung, textLines: ["if a > 3"])), ["if a > 3"])
        XCTAssertEqual(VisuStructDiagramText.displayLines(for: VisuStructElement(type: .whileSchleife, textLines: ["i < 3"])), ["while i < 3"])
        XCTAssertEqual(VisuStructDiagramText.displayLines(for: VisuStructElement(type: .doUntilSchleife, textLines: ["until x == 1"])), ["while x == 1"])
        XCTAssertEqual(VisuStructDiagramText.displayLines(for: VisuStructElement(type: .fallauswahl, textLines: ["day"])), ["switch day"])
        XCTAssertEqual(VisuStructDiagramText.displayLines(for: VisuStructElement(type: .anweisung, textLines: ["x = 1"])), ["x = 1"])
    }

    func testEmptyElementsHaveNoDisplayLines() {
        XCTAssertNil(VisuStructDiagramText.displayLines(for: VisuStructElement(type: .anweisung, textLines: ["  "])))
        XCTAssertNil(VisuStructDiagramText.displayLines(for: VisuStructElement(type: .forSchleife, textLines: ["", "", ""])))
    }

    func testForLoopIsShownOnOneLine() {
        let lines = VisuStructDiagramText.displayLines(for: VisuStructElement(type: .forSchleife, textLines: ["int i = 0", "i < 3", "i++"]))
        XCTAssertEqual(lines?.count, 1)
    }

    func testKeywordSplit() {
        XCTAssertEqual(VisuStructDiagramText.keywordSplit("while i < 3")?.keyword, "while")
        XCTAssertEqual(VisuStructDiagramText.keywordSplit("while i < 3")?.rest, "i < 3")
        XCTAssertEqual(VisuStructDiagramText.keywordSplit("print: x")?.keyword, "print:")
        XCTAssertEqual(VisuStructDiagramText.keywordSplit("print: x")?.rest, "x")
        XCTAssertNil(VisuStructDiagramText.keywordSplit("x = 1"))
    }
}
