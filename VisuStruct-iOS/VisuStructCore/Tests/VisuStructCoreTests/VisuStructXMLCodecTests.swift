import XCTest
import VisuStructCore

final class VisuStructXMLCodecTests: XCTestCase {
    /// Texte stehen wie im Java-Editor als `;`-getrennte Unicode-Codepoints im XML.
    func testDecodesLegacyStruktogrammeditorXML() throws {
        let xml = """
        <?xml version="1.0" encoding="UTF-8"?>
        <struktogramm caption="66;101;105;115;112;105;101;108;">
          <strelem typ="0" zx="0" zy="0">
            <text>120;32;61;32;49;</text>
          </strelem>
        </struktogramm>
        """
        let doc = try VisuStructXMLCodec.decode(data: Data(xml.utf8))
        XCTAssertEqual(doc.caption, "Beispiel")
        XCTAssertEqual(doc.elements.count, 1)
        XCTAssertEqual(doc.elements[0].type, .anweisung)
        XCTAssertEqual(doc.elements[0].textLines, ["x = 1"])
    }
}
