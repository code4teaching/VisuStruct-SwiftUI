import Foundation

/// Automatische Prüfung einer Übung aus dem Lernbereich: Diagramm mit festen Eingaben simulieren und die Ausgabe vergleichen.
/// Gleiche Regeln wie `web/src/core/exerciseCheck.ts`.
public enum VisuStructExerciseCheck {
    /// Abbruch nach so vielen Schritten (vermutlich eine Endlosschleife).
    public static let maxSteps = 100_000

    public struct Test: Equatable, Sendable {
        public var inputs: [String]
        public var expected: [String]

        public init(inputs: [String], expected: [String]) {
            self.inputs = inputs
            self.expected = expected
        }
    }

    public struct RunResult: Equatable, Sendable {
        public var outputs: [String] = []
        /// Fehler der Simulation (z. B. unbekannte Variable).
        public var error: VisuStructSimulationNotice?
        /// Das Diagramm wollte mehr Eingaben, als der Test hat.
        public var missingInput = false
        /// Eingaben blieben übrig.
        public var unusedInputs = 0
        public var tooManySteps = false
    }

    public struct Outcome: Equatable, Sendable {
        public var test: Test
        public var result: RunResult
        public var passed: Bool
    }

    public static func run(
        _ document: VisuStructDocument,
        inputs: [String],
        subprograms: [String: VisuStructDocument] = [:]
    ) -> RunResult {
        var engine = VisuStructSimulationEngine(document: document, subprograms: subprograms)
        var queue = inputs[...]
        for _ in 0..<maxSteps {
            let state = engine.state
            if state.inputRequest != nil {
                guard let next = queue.popFirst() else {
                    return RunResult(outputs: state.outputLines, missingInput: true)
                }
                engine.provideInput(next)
                if let notice = engine.state.inputErrorNotice {
                    return RunResult(outputs: engine.state.outputLines, error: notice)
                }
                continue
            }
            if state.isHalted {
                return RunResult(outputs: state.outputLines, error: state.notice)
            }
            if !engine.canStep {
                return RunResult(outputs: state.outputLines, unusedInputs: queue.count)
            }
            engine.step()
        }
        return RunResult(outputs: engine.state.outputLines, tooManySteps: true)
    }

    /// Gleiche Ausgabe: Zeile für Zeile, Leerraum am Rand egal, `1.0` gleich `1`.
    public static func sameOutput(_ actual: [String], _ expected: [String]) -> Bool {
        actual.count == expected.count && zip(actual, expected).allSatisfy { normalize($0) == normalize($1) }
    }

    static func normalize(_ line: String) -> String {
        let t = line
            .split(whereSeparator: \.isWhitespace)
            .joined(separator: " ")
        if t.range(of: #"^-?\d+\.0+$"#, options: .regularExpression) != nil,
           let dot = t.firstIndex(of: ".") {
            return String(t[..<dot])
        }
        return t
    }

    public static func check(
        _ document: VisuStructDocument,
        tests: [Test],
        subprograms: [String: VisuStructDocument] = [:]
    ) -> [Outcome] {
        tests.map { test in
            let result = run(document, inputs: test.inputs, subprograms: subprograms)
            let passed = result.error == nil && !result.missingInput && !result.tooManySteps
                && sameOutput(result.outputs, test.expected)
            return Outcome(test: test, result: result, passed: passed)
        }
    }

    /// Welche Elementarten im Diagramm vorkommen (für „braucht: verzweigung“).
    public static func usedElementTypes(_ document: VisuStructDocument) -> Set<VisuStructElementType> {
        var found = Set<VisuStructElementType>()
        func visit(_ elements: [VisuStructElement]) {
            for element in elements {
                found.insert(element.type)
                if let body = element.loopBody { visit(body) }
                for c in element.cases ?? [] { visit(c.elements) }
            }
        }
        visit(document.elements)
        return found
    }

    /// Schlüssel aus `braucht:` (wie die Fälle von `VisuStructElementType`, z. B. `verzweigung`).
    public static func elementType(forKey key: String) -> VisuStructElementType? {
        switch key {
        case "anweisung": return .anweisung
        case "verzweigung": return .verzweigung
        case "fallauswahl": return .fallauswahl
        case "forSchleife", "forZaehlSchleife": return .forSchleife
        case "whileSchleife": return .whileSchleife
        case "doUntilSchleife": return .doUntilSchleife
        case "endlosschleife": return .endlosschleife
        case "aussprung": return .aussprung
        case "aufruf": return .aufruf
        default: return nil
        }
    }
}
