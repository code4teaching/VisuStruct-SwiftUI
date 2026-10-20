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

    func testBranchAloneInFalseBranchBecomesElseIf() {
        let statement = { (text: String) in VisuStructElement(type: .anweisung, textLines: [text]) }
        let branch = { (condition: String, yes: String, no: [VisuStructElement]) in
            VisuStructElement(type: .verzweigung, textLines: [condition], cases: [
                VisuStructCase(name: "true", elements: [statement(yes)]),
                VisuStructCase(name: "false", elements: no),
            ])
        }
        let chain = branch("wahl == 1", "output: \"Wasser\"", [branch("wahl == 2", "output: \"Saft\"", [statement("output: \"Kakao\"")])])
        let document = VisuStructDocument(elements: [statement("int wahl = 2"), chain])

        let java = VisuStructCodeGenerator.generate(document: document, target: .java)
        XCTAssertTrue(java.contains("if (wahl == 1) {\n    System.out.println(\"Wasser\");\n} else if (wahl == 2) {\n    System.out.println(\"Saft\");\n} else {\n    System.out.println(\"Kakao\");\n}"), java)
        let javaScript = VisuStructCodeGenerator.generate(document: document, target: .javascript)
        XCTAssertTrue(javaScript.contains("} else if (wahl == 2) {"), javaScript)
        let python = VisuStructCodeGenerator.generate(document: document, target: .python)
        XCTAssertTrue(python.contains("if wahl == 1:\n    print(\"Wasser\")\nelif wahl == 2:\n    print(\"Saft\")\nelse:\n    print(\"Kakao\")"), python)

        // Steht noch etwas neben der inneren Verzweigung, bleibt der Block verschachtelt.
        let mixed = branch("wahl == 1", "output: \"Wasser\"", [statement("output: \"Moment\""), branch("wahl == 2", "output: \"Saft\"", [statement("ø")])])
        let nested = VisuStructCodeGenerator.generate(document: VisuStructDocument(elements: [statement("int wahl = 2"), mixed]), target: .java)
        XCTAssertTrue(nested.contains("} else {\n    System.out.println(\"Moment\");\n    if (wahl == 2) {"), nested)
    }

    func testJavaScriptTruncatesIntegerDivision() {
        let statement = { (text: String) in VisuStructElement(type: .anweisung, textLines: [text]) }
        let document = VisuStructDocument(elements: [
            statement("int a = 7"),
            statement("int b = 2"),
            statement("int q = a / b"),
            statement("q /= 2"),
            statement("double e = a / 2.0"),
            statement("print: \"x/y \" + a / b"),
        ])
        let js = VisuStructCodeGenerator.generate(document: document, target: .javascript)
        XCTAssertTrue(js.contains("let q = Math.trunc(a / b);"), js)
        XCTAssertTrue(js.contains("q = Math.trunc(q / 2);"), js)
        XCTAssertTrue(js.contains("a / 2.0"), js)
        XCTAssertTrue(js.contains("\"x/y \" + Math.trunc(a / b)"), js)
    }

    func testPythonTranslatesJavaSyntax() {
        let statement = { (text: String) in VisuStructElement(type: .anweisung, textLines: [text]) }
        let document = VisuStructDocument(elements: [
            statement("int n = 7"),
            statement("boolean ok = true"),
            statement("String text = \"\""),
            VisuStructElement(type: .forSchleife, textLines: ["int i = 1", "i <= n", "i++"], loopBody: [statement("n--")]),
            VisuStructElement(type: .forSchleife, textLines: ["int k = n", "k >= 0", "k = k - 2"], loopBody: [statement("text = k + text")]),
            VisuStructElement(
                type: .verzweigung,
                textLines: ["n > 2 && !ok || n == 0"],
                cases: [
                    VisuStructCase(name: "true", elements: [statement("print: \"Hälfte: \" + n / 2")]),
                    VisuStructCase(name: "false", elements: [statement("ø")]),
                ]
            ),
            statement("input: boolean weiter"),
        ])
        let python = VisuStructCodeGenerator.generate(document: document, target: .python)
        XCTAssertTrue(python.contains("ok = True"), python)
        XCTAssertTrue(python.contains("for i in range(1, n + 1):\n    n -= 1"), python)
        XCTAssertTrue(python.contains("for k in range(n, -1, -2):\n    text = str(k) + text"), python)
        XCTAssertTrue(python.contains("if n > 2 and not ok or n == 0:"), python)
        XCTAssertTrue(python.contains("print(\"Hälfte: \" + str(n // 2))"), python)
        XCTAssertTrue(python.contains("else:\n    # empty element\n    pass"), python)
        XCTAssertTrue(python.contains("weiter = input(\"weiter: \").strip().lower() in (\"true\", \"wahr\")"), python)
    }

    func testPythonForLoopWithoutMatchingRangeBecomesWhile() {
        let document = VisuStructDocument(elements: [
            VisuStructElement(
                type: .forSchleife,
                textLines: ["int i = 1", "i < 100", "i = i * 2"],
                loopBody: [VisuStructElement(type: .anweisung, textLines: ["print: i"])]
            ),
        ])
        let python = VisuStructCodeGenerator.generate(document: document, target: .python)
        XCTAssertEqual(python, "i = 1\nwhile i < 100:\n    print(i)\n    i = i * 2")
    }

    func testPseudocodeNoteAndXMLAttribute() throws {
        let document = VisuStructDocument(
            caption: "Tee",
            isPseudocode: true,
            elements: [VisuStructElement(type: .anweisung, textLines: ["input: int n"])]
        )
        let options = VisuStructCodeGenerator.Options(pseudocodeNote: "Pseudocode")
        let python = VisuStructCodeGenerator.generate(document: document, target: .python, options: options)
        XCTAssertTrue(python.hasPrefix("# Pseudocode\n\n"), python)
        let javaClass = VisuStructCodeGenerator.generateJavaClassFile(document: document, options: options, className: "Tee")
        XCTAssertEqual(javaClass.components(separatedBy: "new Scanner(System.in)").count - 1, 1, javaClass)
        XCTAssertTrue(javaClass.contains("        // Pseudocode\n"), javaClass)

        let xml = VisuStructXMLCodec.encode(document)
        XCTAssertTrue(String(decoding: xml, as: UTF8.self).contains("pseudocode=\"true\""))
        XCTAssertTrue(try VisuStructXMLCodec.decode(data: xml).isPseudocode)
        let plain = VisuStructXMLCodec.encode(VisuStructDocument(caption: "Tee"))
        XCTAssertFalse(String(decoding: plain, as: UTF8.self).contains("pseudocode"))
        XCTAssertFalse(try VisuStructXMLCodec.decode(data: plain).isPseudocode)
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
