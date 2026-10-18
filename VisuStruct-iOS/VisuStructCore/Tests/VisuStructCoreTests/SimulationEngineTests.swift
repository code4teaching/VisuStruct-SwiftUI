import XCTest
import VisuStructCore

final class SimulationEngineTests: XCTestCase {
    func testCollatzExampleOutputsSequence() throws {
        let state = runSimulation(try ExampleFiles.document(named: "Collatz.visustruct"))
        XCTAssertEqual(
            state.outputLines,
            ["58", "29", "88", "44", "22", "11", "34", "17", "52", "26", "13", "40", "20", "10", "5", "16", "8", "4", "2", "1"]
        )
        XCTAssertEqual(state.variables["number"], .int(1))
    }

    func testFibonacciExampleOutputsFirstTenNumbers() throws {
        let state = runSimulation(try ExampleFiles.document(named: "Fibonacci.visustruct"))
        XCTAssertEqual(state.outputLines, ["1", "1", "2", "3", "5", "8", "13", "21", "34", "55"])
    }

    func testNumberEvenExampleUsesInput() throws {
        let document = try ExampleFiles.document(named: "2026-04-23-NumberEven.visustruct")
        XCTAssertEqual(runSimulation(document, inputs: ["4"]).outputLines, ["number is even"])
        XCTAssertEqual(runSimulation(document, inputs: ["7"]).outputLines, ["number is odd"])
    }

    func testInvalidIntegerInputIsRejectedAndCanBeRetried() {
        let document = VisuStructDocument(elements: [
            VisuStructElement(type: .anweisung, textLines: ["input: int n"]),
            VisuStructElement(type: .anweisung, textLines: ["print: n * 2"]),
        ])
        var engine = VisuStructSimulationEngine(document: document)
        engine.step()
        XCTAssertEqual(engine.state.inputRequest?.variableName, "n")

        engine.provideInput("abc")
        XCTAssertNotNil(engine.state.inputError)
        XCTAssertNotNil(engine.state.inputRequest)

        engine.provideInput("21")
        XCTAssertNil(engine.state.inputRequest)
        engine.step()
        XCTAssertEqual(engine.state.outputLines, ["42"])
    }

    func testCountingLoops() {
        let forLoop = VisuStructDocument(elements: [
            VisuStructElement(type: .anweisung, textLines: ["int sum = 0"]),
            VisuStructElement(
                type: .forSchleife,
                textLines: ["int i = 1", "i <= 4", "i++"],
                loopBody: [VisuStructElement(type: .anweisung, textLines: ["sum += i"])]
            ),
        ])
        XCTAssertEqual(runSimulation(forLoop).variables["sum"], .int(10))

        let doUntil = VisuStructDocument(elements: [
            VisuStructElement(type: .anweisung, textLines: ["int k = 0"]),
            VisuStructElement(
                type: .doUntilSchleife,
                textLines: ["k < 3"],
                loopBody: [VisuStructElement(type: .anweisung, textLines: ["k++"])]
            ),
        ])
        XCTAssertEqual(runSimulation(doUntil).variables["k"], .int(3))
    }

    func testSwitchFallsBackToDefaultCase() {
        func document(day: Int) -> VisuStructDocument {
            VisuStructDocument(elements: [
                VisuStructElement(type: .anweisung, textLines: ["int day = \(day)"]),
                VisuStructElement(
                    type: .fallauswahl,
                    textLines: ["day"],
                    cases: [
                        VisuStructCase(name: "1", elements: [VisuStructElement(type: .anweisung, textLines: ["print: \"Montag\""])]),
                        VisuStructCase(name: "2", elements: [VisuStructElement(type: .anweisung, textLines: ["print: \"Dienstag\""])]),
                        VisuStructCase(name: "default", elements: [VisuStructElement(type: .anweisung, textLines: ["print: \"anderer Tag\""])]),
                    ]
                ),
            ])
        }
        XCTAssertEqual(runSimulation(document(day: 2)).outputLines, ["Dienstag"])
        XCTAssertEqual(runSimulation(document(day: 5)).outputLines, ["anderer Tag"])
    }

    func testBooleanOperatorsInConditions() {
        func document(_ condition: String) -> VisuStructDocument {
            VisuStructDocument(elements: [
                VisuStructElement(type: .anweisung, textLines: ["int a = 5"]),
                VisuStructElement(
                    type: .verzweigung,
                    textLines: [condition],
                    cases: [
                        VisuStructCase(name: "true", elements: [VisuStructElement(type: .anweisung, textLines: ["print: \"ja\""])]),
                        VisuStructCase(name: "false", elements: [VisuStructElement(type: .anweisung, textLines: ["print: \"nein\""])]),
                    ]
                ),
            ])
        }
        XCTAssertEqual(runSimulation(document("a > 3 && a < 10")).outputLines, ["ja"])
        XCTAssertEqual(runSimulation(document("a < 3 || a == 5")).outputLines, ["ja"])
        XCTAssertEqual(runSimulation(document("a != 5")).outputLines, ["nein"])
    }

    func testDivisionByZeroReportsError() {
        let document = VisuStructDocument(elements: [
            VisuStructElement(type: .anweisung, textLines: ["int x = 1 / 0"]),
        ])
        var engine = VisuStructSimulationEngine(document: document)
        engine.step()
        XCTAssertEqual(engine.state.message, "Division by zero.")
        XCTAssertNil(engine.state.variables["x"])
    }
}
