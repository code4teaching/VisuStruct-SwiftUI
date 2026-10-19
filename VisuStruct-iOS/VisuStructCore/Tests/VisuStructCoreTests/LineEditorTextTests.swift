import XCTest
import VisuStructCore

final class LineEditorTextTests: XCTestCase {
    func testIOMode() {
        XCTAssertEqual(VisuStructLineEditorText.ioMode(of: "input: int age"), .input)
        XCTAssertEqual(VisuStructLineEditorText.ioMode(of: "  OUTPUT: x"), .output)
        XCTAssertEqual(VisuStructLineEditorText.ioMode(of: "print: x"), .output)
        XCTAssertEqual(VisuStructLineEditorText.ioMode(of: "x = 1"), .statement)
    }

    func testApplyingIOModeSwapsPrefixAndKeepsContent() {
        XCTAssertEqual(VisuStructLineEditorText.applyingIOMode(.input, to: "print: age"), "input: age")
        XCTAssertEqual(VisuStructLineEditorText.applyingIOMode(.output, to: "age"), "output: age")
        XCTAssertEqual(VisuStructLineEditorText.applyingIOMode(.statement, to: "input:  age "), "age")
        XCTAssertEqual(VisuStructLineEditorText.applyingIOMode(.input, to: ""), "input: ")
    }

    func testStrippingPrefixForEditingKeepsTypedWhitespace() {
        XCTAssertEqual(VisuStructLineEditorText.strippingPrefixForEditing("input:", from: "input: age "), "age ")
        XCTAssertEqual(VisuStructLineEditorText.strippingPrefixForEditing("if", from: "if (a > 3)"), "a > 3")
        XCTAssertEqual(VisuStructLineEditorText.strippingPrefixForEditing("if", from: "if a > 3 "), "a > 3 ")
        XCTAssertEqual(VisuStructLineEditorText.strippingPrefixForEditing("while", from: "until x == 1"), "x == 1")
        XCTAssertEqual(VisuStructLineEditorText.strippingPrefixForEditing("if", from: "iffy"), "iffy")
    }

    func testPrefixingForEditing() {
        XCTAssertEqual(VisuStructLineEditorText.prefixingForEditing("while", to: ""), "while ")
        XCTAssertEqual(VisuStructLineEditorText.prefixingForEditing("while", to: "i < 3"), "while i < 3")
    }

    func testNormalizingQuotes() {
        XCTAssertEqual(VisuStructLineEditorText.normalizingQuotes("print: „Hallo“ ‚x’"), "print: \"Hallo\" 'x'")
    }

    func testForLoopParts() {
        XCTAssertEqual(VisuStructLineEditorText.paddedForLoopParts([]), ["", "", ""])
        XCTAssertEqual(VisuStructLineEditorText.paddedForLoopParts(["a", "b", "c", "d"]), ["a", "b", "c"])
        XCTAssertEqual(VisuStructLineEditorText.normalizedForLoopPart("int i = 0;; "), "int i = 0")
    }
}
