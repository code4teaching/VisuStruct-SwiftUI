import XCTest
import VisuStructCore

final class VisuStructXMLCodecTests: XCTestCase {
    func testDecodesLegacyStruktogrammeditorXML() throws {
        let xml = """
        <?xml version="1.0" encoding="UTF-8"?>
        <struktogramm caption="Beispiel">
          <strelem typ="0" zx="0" zy="0">
            <text>x = 1</text>
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
