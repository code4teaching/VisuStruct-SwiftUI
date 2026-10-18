import XCTest
import VisuStructCore

/// Bedingungen in Verzweigungen und Schleifen.
final class SimulationConditionTests: XCTestCase {
    /// Verzweigung mit `condition`, davor die Anweisungen `setup`; Ausgabe "ja" oder "nein".
    private func branch(_ condition: String, setup: [String] = ["int a = 5", "String name = \"Anna\""]) -> VisuStructDocument {
        VisuStructDocument(elements: setup.map { VisuStructElement(type: .anweisung, textLines: [$0]) } + [
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

    private func assertCondition(_ condition: String, is expected: Bool, file: StaticString = #filePath, line: UInt = #line) {
        let state = runSimulation(branch(condition), file: file, line: line)
        XCTAssertNil(state.message.flatMap { $0 == "Simulation finished." ? nil : $0 }, condition, file: file, line: line)
        XCTAssertEqual(state.outputLines, [expected ? "ja" : "nein"], condition, file: file, line: line)
    }

    func testStringComparisons() {
        assertCondition("name == \"Anna\"", is: true)
        assertCondition("name != \"Anna\"", is: false)
        assertCondition("\"Anna\" == name", is: true)
        assertCondition("name.equals(\"Anna\")", is: true)
        assertCondition("!name.equals(\"Bob\")", is: true)
        assertCondition("name == \"Anna\" && a == 5", is: true)
    }

    func testOperatorsInsideStringLiteralsAreText() {
        let state = runSimulation(branch("text == \"a && b || c\"", setup: ["String text = \"a && b || c\""]))
        XCTAssertEqual(state.outputLines, ["ja"])
    }

    func testParenthesesAndNegation() {
        assertCondition("(a < 3 || a == 5) && a > 0", is: true)
        assertCondition("(a < 3 || a > 10) && a > 0", is: false)
        assertCondition("!(a > 3)", is: false)
        assertCondition("!(a > 3 && a < 4)", is: true)
        assertCondition("(a + 1) * 2 > 11", is: true)
        assertCondition("((a == 5))", is: true)
    }

    func testConditionKeywordWithSeparatelyBracketedParts() {
        assertCondition("if (a > 3) && (a < 10)", is: true)
        assertCondition("if (a > 3) && (a > 10)", is: false)
    }

    func testWhileLoopWithStringCondition() {
        let document = VisuStructDocument(elements: [
            VisuStructElement(type: .anweisung, textLines: ["String answer = \"nein\""]),
            VisuStructElement(type: .anweisung, textLines: ["int tries = 0"]),
            VisuStructElement(
                type: .whileSchleife,
                textLines: ["answer != \"ja\""],
                loopBody: [
                    VisuStructElement(type: .anweisung, textLines: ["input: answer"]),
                    VisuStructElement(type: .anweisung, textLines: ["tries++"]),
                ]
            ),
        ])
        let state = runSimulation(document, inputs: ["vielleicht", "ja"])
        XCTAssertEqual(state.variables["tries"], .int(2))
    }

    func testComparingStringWithNumberIsAnError() {
        let state = runSimulation(branch("name == 5"))
        XCTAssertTrue(state.isHalted)
        XCTAssertEqual(state.outputLines, [])
    }

    func testSimulationStopsAtFailingStep() {
        let document = VisuStructDocument(elements: [
            VisuStructElement(type: .anweisung, textLines: ["print: \"vorher\""]),
            VisuStructElement(type: .anweisung, textLines: ["int x = 1 / 0"]),
            VisuStructElement(type: .anweisung, textLines: ["print: \"danach\""]),
        ])
        var engine = VisuStructSimulationEngine(document: document)
        engine.step()
        engine.step()
        XCTAssertTrue(engine.state.isHalted)
        XCTAssertFalse(engine.canStep)
        XCTAssertEqual(engine.currentStepPath, [1])
        XCTAssertEqual(engine.state.message, "Division by zero.")

        engine.step()
        XCTAssertEqual(engine.state.outputLines, ["vorher"])
        XCTAssertEqual(engine.state.message, "Division by zero.")

        engine.reset()
        XCTAssertFalse(engine.state.isHalted)
        XCTAssertTrue(engine.canStep)
    }
}
