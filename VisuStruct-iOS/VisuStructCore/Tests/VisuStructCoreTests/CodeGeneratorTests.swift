import XCTest
import VisuStructCore

final class CodeGeneratorTests: XCTestCase {
    /// Die mitgelieferten `.java`-Dateien sind der erwartete Export der zugehörigen Diagramme.
    func testJavaClassFileMatchesExamples() throws {
        for name in ["Collatz", "Fibonacci"] {
            let document = try ExampleFiles.document(named: "\(name).visustruct")
            let generated = VisuStructCodeGenerator.generateJavaClassFile(document: document, className: name)
            XCTAssertEqual(generated, try ExampleFiles.text(named: "\(name).java"), name)
        }
    }

    func testJavaClassFileWithInputImportsScannerOnce() throws {
        let document = try ExampleFiles.document(named: "2026-04-23-NumberEven.visustruct")
        let generated = VisuStructCodeGenerator.generateJavaClassFile(document: document, className: "NumberEven")
        XCTAssertTrue(generated.hasPrefix("import java.util.Scanner;\n\npublic class NumberEven {\n"))
        XCTAssertEqual(generated.components(separatedBy: "new Scanner(System.in)").count - 1, 1)
        XCTAssertTrue(generated.contains("if (number % 2 == 0) {"))
    }

    func testCollatzInPythonAndJavaScript() throws {
        let document = try ExampleFiles.document(named: "Collatz.visustruct")

        let python = VisuStructCodeGenerator.generate(document: document, target: .python)
        XCTAssertTrue(python.contains("while number != 1:"), python)
        XCTAssertTrue(python.contains("print(number)"), python)
        XCTAssertFalse(python.contains("{"), python)

        let javaScript = VisuStructCodeGenerator.generate(document: document, target: .javascript)
        XCTAssertTrue(javaScript.hasPrefix("\"use strict\";"), javaScript)
        XCTAssertTrue(javaScript.contains("while (number != 1) {"), javaScript)
        XCTAssertTrue(javaScript.contains("console.log(number);"), javaScript)
    }

    func testSanitizedJavaClassName() {
        XCTAssertEqual(VisuStructCodeGenerator.sanitizedJavaClassName("Fibonacci"), "Fibonacci")
        let sanitized = VisuStructCodeGenerator.sanitizedJavaClassName("2 Summe bilden!")
        XCTAssertFalse(sanitized.isEmpty)
        XCTAssertFalse(sanitized.contains(" "))
        XCTAssertFalse(sanitized.first?.isNumber ?? true)
    }

    func testEmptyDocumentProducesNonEmptyPlaceholder() {
        for target in [VisuStructCodeGenerator.Target.java, .python, .javascript] {
            let code = VisuStructCodeGenerator.generate(document: VisuStructDocument(), target: target)
            XCTAssertFalse(code.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty, target.rawValue)
        }
    }
}
