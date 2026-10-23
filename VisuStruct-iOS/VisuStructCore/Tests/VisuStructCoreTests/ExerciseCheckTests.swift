import Foundation
import XCTest
import VisuStructCore

final class ExerciseCheckTests: XCTestCase {
    private func document(_ lines: [String]) -> VisuStructDocument {
        VisuStructDocument(elements: lines.map { VisuStructElement(type: .anweisung, textLines: [$0]) })
    }

    func testPassesWithMatchingOutput() {
        let doc = document(["input: int n", "output: n * 2"])
        let outcomes = VisuStructExerciseCheck.check(doc, tests: [
            .init(inputs: ["3"], expected: ["6"]),
            .init(inputs: ["5"], expected: ["11"]),
        ])
        XCTAssertEqual(outcomes.map(\.passed), [true, false])
        XCTAssertEqual(outcomes[1].result.outputs, ["10"])
    }

    func testMissingAndUnusedInputs() {
        let doc = document(["input: int n", "output: n"])
        let missing = VisuStructExerciseCheck.run(doc, inputs: [])
        XCTAssertTrue(missing.missingInput)
        let unused = VisuStructExerciseCheck.run(doc, inputs: ["1", "2"])
        XCTAssertEqual(unused.unusedInputs, 1)
        XCTAssertEqual(unused.outputs, ["1"])
    }

    func testInfiniteLoopStops() {
        let doc = VisuStructDocument(elements: [
            VisuStructElement(type: .endlosschleife, textLines: [""], loopBody: [VisuStructElement(type: .anweisung, textLines: ["int x = 1"])]),
        ])
        XCTAssertTrue(VisuStructExerciseCheck.run(doc, inputs: []).tooManySteps)
    }

    func testOutputComparisonIgnoresSpacingAndTrailingZeros() {
        XCTAssertTrue(VisuStructExerciseCheck.sameOutput(["  Summe:   7.0 "], ["Summe: 7.0"]))
        XCTAssertTrue(VisuStructExerciseCheck.sameOutput(["7.0"], ["7"]))
        XCTAssertFalse(VisuStructExerciseCheck.sameOutput(["7.5"], ["7"]))
        XCTAssertFalse(VisuStructExerciseCheck.sameOutput(["1"], ["1", "2"]))
    }

    func testUsedElementTypesFindsNestedElements() {
        let doc = VisuStructDocument(elements: [
            VisuStructElement(
                type: .whileSchleife,
                textLines: ["true"],
                loopBody: [VisuStructElement(type: .verzweigung, textLines: ["x > 1"], cases: [
                    VisuStructCase(name: "true", elements: [VisuStructElement(type: .aussprung, textLines: [""])]),
                    VisuStructCase(name: "false", elements: []),
                ])]
            ),
        ])
        XCTAssertEqual(VisuStructExerciseCheck.usedElementTypes(doc), [.whileSchleife, .verzweigung, .aussprung])
    }

    /// Musterlösungen aus dem Kurs der App: Welche Übungen kann die Swift-Simulation schon prüfen?
    /// Die App blendet „Prüfen“ bei den anderen aus. Die Liste erscheint als Hinweis im CI-Protokoll.
    func testCourseSolutionsInSwiftSimulation() throws {
        let url = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent() // VisuStructCoreTests
            .deletingLastPathComponent() // Tests
            .deletingLastPathComponent() // VisuStructCore
            .appendingPathComponent("../VisuStructXcodeOpen/VisuStruct/Course/Content/course-de.json")
            .standardizedFileURL
        let course = try XCTUnwrap(JSONSerialization.jsonObject(with: Data(contentsOf: url)) as? [String: Any])
        let diagrams = try XCTUnwrap(course["diagrams"] as? [String: String])

        var exercises: [[String: Any]] = []
        func collect(_ blocks: [[String: Any]]) {
            for block in blocks where block["type"] as? String == "exercise" {
                if let exercise = block["exercise"] as? [String: Any] { exercises.append(exercise) }
            }
        }
        for lesson in course["lessons"] as? [[String: Any]] ?? [] {
            for step in lesson["steps"] as? [[String: Any]] ?? [] { collect(step["blocks"] as? [[String: Any]] ?? []) }
        }
        for task in course["tasks"] as? [[String: Any]] ?? [] { collect(task["blocks"] as? [[String: Any]] ?? []) }

        var passed: [String] = []
        var failed: [String] = []
        for exercise in exercises {
            let id = exercise["id"] as? String ?? "?"
            guard exercise["java"] == nil, let solution = exercise["solution"] as? String, let xml = diagrams[solution] else { continue }
            let tests = (exercise["tests"] as? [[String: Any]] ?? []).map {
                VisuStructExerciseCheck.Test(inputs: $0["inputs"] as? [String] ?? [], expected: $0["expected"] as? [String] ?? [])
            }
            if (exercise["tests"] as? [[String: Any]] ?? []).contains(where: { $0["files"] != nil }) {
                failed.append("\(id) (Dateien)")
                continue
            }
            var subprograms: [String: VisuStructDocument] = [:]
            for file in exercise["subprograms"] as? [String] ?? [] {
                guard let subXML = diagrams[file], let sub = try? VisuStructXMLCodec.decode(data: Data(subXML.utf8)) else { continue }
                for name in [sub.caption, file.replacingOccurrences(of: ".visustruct", with: "")] {
                    let key = VisuStructSimulationEngine.subprogramKey(name)
                    if !key.isEmpty, subprograms[key] == nil { subprograms[key] = sub }
                }
            }
            let doc = try VisuStructXMLCodec.decode(data: Data(xml.utf8))
            let outcomes = VisuStructExerciseCheck.check(doc, tests: tests, subprograms: subprograms)
            if outcomes.allSatisfy(\.passed) {
                passed.append(id)
            } else {
                let first = outcomes.first { !$0.passed }
                let why = first?.result.error?.englishText ?? first.map { "\($0.result.outputs.prefix(3))" } ?? ""
                failed.append("\(id) (\(why))")
            }
        }
        print("::notice::Swift-Simulation prüft \(passed.count) Musterlösungen richtig, \(failed.count) noch nicht.")
        if !failed.isEmpty {
            print("::warning::Noch nicht prüfbar in der App: \(failed.joined(separator: "; "))")
        }
        XCTAssertGreaterThan(passed.count, 20)
    }
}
