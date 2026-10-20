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
        XCTAssertEqual(engine.state.inputErrorNotice, .wholeNumberExpected)
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

    func testPlaceholderStatementsAreSkipped() {
        func document(a: Int) -> VisuStructDocument {
            VisuStructDocument(elements: [
                VisuStructElement(type: .anweisung, textLines: ["ø"]),
                VisuStructElement(type: .anweisung, textLines: ["int a = \(a)"]),
                VisuStructElement(
                    type: .verzweigung,
                    textLines: ["a > 3"],
                    cases: [
                        VisuStructCase(name: "true", elements: [VisuStructElement(type: .anweisung, textLines: ["print: \"groß\""])]),
                        VisuStructCase(name: "false", elements: [VisuStructElement(type: .anweisung, textLines: ["ø"])]),
                    ]
                ),
            ])
        }
        XCTAssertEqual(runSimulation(document(a: 5)).outputLines, ["groß"])
        let small = runSimulation(document(a: 1))
        XCTAssertEqual(small.outputLines, [])
        XCTAssertEqual(small.notice, .finished)
    }

    func testBooleanVariables() {
        let statement = { (text: String) in VisuStructElement(type: .anweisung, textLines: [text]) }
        let document = VisuStructDocument(elements: [
            statement("int i = 0"),
            statement("boolean fertig = false"),
            VisuStructElement(
                type: .whileSchleife,
                textLines: ["!fertig"],
                loopBody: [statement("i++"), statement("fertig = i >= 3")]
            ),
            statement("bool gross = i > 2 && fertig"),
            statement("print: \"fertig: \" + fertig"),
            VisuStructElement(
                type: .verzweigung,
                textLines: ["gross == true"],
                cases: [
                    VisuStructCase(name: "true", elements: [statement("print: \"ja\"")]),
                    VisuStructCase(name: "false", elements: [statement("print: \"nein\"")]),
                ]
            ),
            statement("gross = !gross"),
            statement("print: gross"),
        ])
        let state = runSimulation(document)
        XCTAssertEqual(state.variables["i"], .int(3))
        XCTAssertEqual(state.outputLines, ["fertig: true", "ja", "false"])
        XCTAssertEqual(state.notice, .finished)
    }

    func testIntegerDivisionLikeJava() {
        let statement = { (text: String) in VisuStructElement(type: .anweisung, textLines: [text]) }
        let document = VisuStructDocument(elements: [
            statement("int a = 7"),
            statement("int b = 2"),
            statement("int q = a / b"),
            statement("double d = a / b"),
            statement("double e = a / 2.0"),
            statement("int n = -7 / 2"),
            statement("print: \"q=\" + a / b + \" d=\" + d + \" e=\" + e + \" n=\" + n"),
            statement("double[] w = {1.5, 2.5}"),
            statement("double m = (w[0] + w[1]) / 2"),
            statement("int k = 10 / 4 * 2"),
        ])
        let state = runSimulation(document)
        XCTAssertEqual(state.variables["q"], .int(3))
        XCTAssertEqual(state.variables["d"], .double(3))
        XCTAssertEqual(state.variables["e"], .double(3.5))
        XCTAssertEqual(state.variables["n"], .int(-3))
        XCTAssertEqual(state.variables["m"], .double(2))
        XCTAssertEqual(state.variables["k"], .int(4))
        XCTAssertEqual(state.outputLines, ["q=3 d=3.0 e=3.5 n=-3"])
    }

    func testBooleanInput() {
        let document = VisuStructDocument(elements: [
            VisuStructElement(type: .anweisung, textLines: ["input: boolean ok \"Okay?\""]),
            VisuStructElement(type: .anweisung, textLines: ["print: ok"]),
        ])
        var engine = VisuStructSimulationEngine(document: document)
        engine.step()
        XCTAssertEqual(engine.state.inputRequest?.valueType, .bool)
        engine.provideInput("vielleicht")
        XCTAssertEqual(engine.state.inputErrorNotice, .booleanExpected)
        engine.provideInput("Wahr")
        engine.step()
        XCTAssertEqual(engine.state.outputLines, ["true"])
    }

    func testDivisionByZeroReportsError() {
        let document = VisuStructDocument(elements: [
            VisuStructElement(type: .anweisung, textLines: ["int x = 1 / 0"]),
        ])
        var engine = VisuStructSimulationEngine(document: document)
        engine.step()
        XCTAssertEqual(engine.state.notice, .divisionByZero)
        XCTAssertEqual(engine.state.message, "Division by zero.")
        XCTAssertNil(engine.state.variables["x"])
    }

    func testFinishedNoticeAfterLastStep() {
        let document = VisuStructDocument(elements: [
            VisuStructElement(type: .anweisung, textLines: ["int x = 1"]),
        ])
        var engine = VisuStructSimulationEngine(document: document)
        engine.step()
        XCTAssertEqual(engine.state.notice, .finished)
        XCTAssertEqual(engine.state.message, "Simulation finished.")
    }
}
