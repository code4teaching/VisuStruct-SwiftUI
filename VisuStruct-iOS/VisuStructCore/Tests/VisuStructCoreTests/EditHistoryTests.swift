import XCTest
import VisuStructCore

final class EditHistoryTests: XCTestCase {
    private func document(_ texts: String...) -> VisuStructDocument {
        var doc = VisuStructDocumentEditing.newEmpty()
        doc.elements = texts.map { VisuStructElement(type: .anweisung, textLines: [$0]) }
        return doc
    }

    func testUndoAndRedoRestoreSnapshots() {
        let a = document("a"), b = document("b"), c = document("c")
        var history = VisuStructEditHistory()
        XCTAssertFalse(history.canUndo)
        history.record(a)
        history.record(b)
        XCTAssertEqual(history.undo(from: c), b)
        XCTAssertEqual(history.undo(from: b), a)
        XCTAssertNil(history.undo(from: a))
        XCTAssertEqual(history.redo(from: a), b)
        XCTAssertEqual(history.redo(from: b), c)
        XCTAssertNil(history.redo(from: c))
    }

    func testRecordClearsRedo() {
        var history = VisuStructEditHistory()
        history.record(document("a"))
        _ = history.undo(from: document("b"))
        XCTAssertTrue(history.canRedo)
        history.record(document("a"))
        XCTAssertFalse(history.canRedo)
    }

    func testUndoStackIsLimited() {
        var history = VisuStructEditHistory(maxSteps: 3)
        for i in 0..<5 { history.record(document("\(i)")) }
        XCTAssertEqual(history.undoStack, [document("2"), document("3"), document("4")])
        XCTAssertEqual(VisuStructEditHistory().maxSteps, 80)
    }

    func testRedoAlsoRespectsLimit() {
        var history = VisuStructEditHistory(maxSteps: 2)
        history.record(document("0"))
        history.record(document("1"))
        _ = history.undo(from: document("2"))
        history.record(document("x"))
        history.record(document("y"))
        XCTAssertEqual(history.undoStack.count, 2)
    }

    func testReset() {
        var history = VisuStructEditHistory()
        history.record(document("a"))
        _ = history.undo(from: document("b"))
        history.record(document("c"))
        history.reset()
        XCTAssertFalse(history.canUndo)
        XCTAssertFalse(history.canRedo)
    }

    func testSanitizedSelection() {
        let doc = document("a", "b")
        XCTAssertEqual(VisuStructDocumentEditing.sanitizedSelection([1], in: doc), [1])
        XCTAssertEqual(VisuStructDocumentEditing.sanitizedSelection([5], in: doc), [0])
        XCTAssertEqual(VisuStructDocumentEditing.sanitizedSelection(nil, in: doc), [0])
        var empty = doc
        empty.elements = []
        XCTAssertNil(VisuStructDocumentEditing.sanitizedSelection([0], in: empty))
    }
}
