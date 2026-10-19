import Foundation

/// Undo-/Redo-Verlauf eines Diagramms: Schnappschüsse des Dokuments vor jeder Änderung.
public struct VisuStructEditHistory: Equatable, Sendable {
    public static let defaultMaxSteps = 80

    public private(set) var undoStack: [VisuStructDocument] = []
    public private(set) var redoStack: [VisuStructDocument] = []
    public let maxSteps: Int

    public init(maxSteps: Int = VisuStructEditHistory.defaultMaxSteps) {
        self.maxSteps = maxSteps
    }

    public var canUndo: Bool { !undoStack.isEmpty }
    public var canRedo: Bool { !redoStack.isEmpty }

    /// Vor einer Änderung: bisherigen Zustand ablegen, Redo verwerfen.
    public mutating func record(_ current: VisuStructDocument) {
        pushUndo(current)
        redoStack.removeAll()
    }

    /// Liefert den vorherigen Zustand und legt `current` für Redo ab; `nil`, wenn nichts rückgängig zu machen ist.
    public mutating func undo(from current: VisuStructDocument) -> VisuStructDocument? {
        guard let previous = undoStack.popLast() else { return nil }
        redoStack.append(current)
        return previous
    }

    /// Liefert den wiederhergestellten Zustand und legt `current` für Undo ab; `nil`, wenn nichts wiederherzustellen ist.
    public mutating func redo(from current: VisuStructDocument) -> VisuStructDocument? {
        guard let next = redoStack.popLast() else { return nil }
        pushUndo(current)
        return next
    }

    public mutating func reset() {
        undoStack.removeAll()
        redoStack.removeAll()
    }

    private mutating func pushUndo(_ document: VisuStructDocument) {
        undoStack.append(document)
        while undoStack.count > maxSteps {
            undoStack.removeFirst()
        }
    }
}
