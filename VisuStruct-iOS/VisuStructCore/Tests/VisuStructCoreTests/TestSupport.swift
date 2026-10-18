import Foundation
import XCTest
import VisuStructCore

/// Beispieldiagramme im Repo-Ordner `VisuStruct-Dateien` (relativ zu dieser Datei aufgelöst).
enum ExampleFiles {
    static let directory: URL = URL(fileURLWithPath: #filePath)
        .deletingLastPathComponent() // VisuStructCoreTests
        .deletingLastPathComponent() // Tests
        .deletingLastPathComponent() // VisuStructCore
        .deletingLastPathComponent() // VisuStruct-iOS
        .deletingLastPathComponent() // Repo-Wurzel
        .appendingPathComponent("VisuStruct-Dateien", isDirectory: true)

    /// Alle `.visustruct`-Dateien, rekursiv, sortiert.
    static func allDiagramURLs() throws -> [URL] {
        guard let enumerator = FileManager.default.enumerator(at: directory, includingPropertiesForKeys: nil) else {
            return []
        }
        return enumerator
            .compactMap { $0 as? URL }
            .filter { $0.pathExtension == "visustruct" }
            .sorted { $0.path < $1.path }
    }

    static func document(named name: String) throws -> VisuStructDocument {
        try VisuStructXMLCodec.decode(url: directory.appendingPathComponent(name))
    }

    static func text(named name: String) throws -> String {
        try String(contentsOf: directory.appendingPathComponent(name), encoding: .utf8)
    }
}

/// Lässt die Simulation bis zum Ende laufen und beantwortet `input:`-Anfragen der Reihe nach.
func runSimulation(
    _ document: VisuStructDocument,
    inputs: [String] = [],
    maxSteps: Int = 10_000,
    file: StaticString = #filePath,
    line: UInt = #line
) -> VisuStructSimulationState {
    var engine = VisuStructSimulationEngine(document: document)
    var remainingInputs = inputs[...]
    var stepsTaken = 0
    while stepsTaken < maxSteps {
        if engine.state.inputRequest != nil {
            guard let next = remainingInputs.popFirst() else {
                XCTFail("Simulation wartet auf Eingabe, aber es sind keine Eingaben mehr übrig.", file: file, line: line)
                return engine.state
            }
            engine.provideInput(next)
            continue
        }
        guard engine.canStep else { break }
        engine.step()
        stepsTaken += 1
    }
    XCTAssertLessThan(stepsTaken, maxSteps, "Simulation endet nicht.", file: file, line: line)
    return engine.state
}
