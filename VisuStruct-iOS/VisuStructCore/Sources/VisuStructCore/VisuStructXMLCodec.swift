import Foundation

public enum VisuStructXMLError: Error, LocalizedError {
    case invalidRoot
    case parseFailed(String)

    public var errorDescription: String? {
        switch self {
        case .invalidRoot: "Ungültiges XML: Root-Element ist nicht <struktogramm>."
        case .parseFailed(let s): "XML konnte nicht gelesen werden: \(s)"
        }
    }
}

/// XML <-> Model kompatibel zu `XMLLeser`/`Struktogramm.xmlErstellen` (Java).
public enum VisuStructXMLCodec {
    public static func decode(data: Data) throws -> VisuStructDocument {
        let parser = XMLParser(data: data)
        let delegate = Decoder()
        parser.delegate = delegate
        if !parser.parse() {
            throw VisuStructXMLError.parseFailed(parser.parserError?.localizedDescription ?? "Unbekannter Fehler")
        }
        guard let doc = delegate.document else { throw VisuStructXMLError.invalidRoot }
        return doc
    }

    public static func decode(url: URL) throws -> VisuStructDocument {
        try decode(data: Data(contentsOf: url))
    }

    public static func encode(_ doc: VisuStructDocument) -> Data {
        var out = ""
        out.reserveCapacity(16_384)

        func attr(_ k: String, _ v: String?) -> String {
            guard let v else { return "" }
            return " \(k)=\"\(escapeAttr(v))\""
        }

        out += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
        out += "<struktogramm"
        out += attr("fontfamily", doc.fontFamily.map(VisuStructJavaStringCoding.encode))
        out += attr("fontstyle", doc.fontStyle.map(String.init))
        out += attr("fontsize", doc.fontSize.map(String.init))
        out += attr("caption", VisuStructJavaStringCoding.encode(doc.caption))
        out += ">\n"

        for e in doc.elements {
            out += encodeElement(e, indent: "  ")
        }

        out += "</struktogramm>\n"
        return Data(out.utf8)
    }

    // MARK: - Encoding helpers

    private static func encodeElement(_ e: VisuStructElement, indent: String) -> String {
        var out = ""
        out += "\(indent)<strelem typ=\"\(e.type.rawValue)\" zx=\"\(e.zoomX)\" zy=\"\(e.zoomY)\""
        if let tc = e.textColor {
            out += " textcolor=\"\(javaColorIntString(tc))\""
        }
        if let bc = e.backgroundColor {
            out += " bgcolor=\"\(javaColorIntString(bc))\""
        }
        out += ">\n"

        for line in e.textLines {
            out += "\(indent)  <text>\(escapeText(VisuStructJavaStringCoding.encode(line)))</text>\n"
        }

        if let loopBody = e.loopBody {
            out += "\(indent)  <schleifeninhalt>\n"
            for child in loopBody {
                out += encodeElement(child, indent: indent + "    ")
            }
            out += "\(indent)  </schleifeninhalt>\n"
        }

        if let cases = e.cases {
            for c in cases {
                out += "\(indent)  <fall fallname=\"\(escapeAttr(VisuStructJavaStringCoding.encode(c.name)))\">\n"
                for child in c.elements {
                    out += encodeElement(child, indent: indent + "    ")
                }
                out += "\(indent)  </fall>\n"
            }
        }

        out += "\(indent)</strelem>\n"
        return out
    }

    private static func escapeAttr(_ s: String) -> String {
        s
            .replacingOccurrences(of: "&", with: "&amp;")
            .replacingOccurrences(of: "\"", with: "&quot;")
            .replacingOccurrences(of: "<", with: "&lt;")
            .replacingOccurrences(of: ">", with: "&gt;")
    }

    private static func escapeText(_ s: String) -> String {
        s
            .replacingOccurrences(of: "&", with: "&amp;")
            .replacingOccurrences(of: "<", with: "&lt;")
            .replacingOccurrences(of: ">", with: "&gt;")
    }

    /// Java speichert `Color.getRGB()` als dezimalen Int-String (kann negativ sein).
    /// Wir erzeugen denselben 32-bit ARGB Int.
    private static func javaColorIntString(_ c: VisuStructRGBA) -> String {
        let argb: UInt32 =
            (UInt32(c.a) << 24) |
            (UInt32(c.r) << 16) |
            (UInt32(c.g) << 8)  |
            UInt32(c.b)
        let i = Int32(bitPattern: argb)
        return String(i)
    }

    // MARK: - Decoder (stackbasiert, kompatibel zu Java XMLLeser)

    private final class Decoder: NSObject, XMLParserDelegate {
        final class ElementList {
            var elements: [VisuStructElement] = []
        }

        final class ElementBuilder {
            var element: VisuStructElement
            var loopBody: ElementList? = nil
            var cases: [VisuStructCase] = []

            init(element: VisuStructElement) {
                self.element = element
            }
        }

        var document: VisuStructDocument?

        private var rootFontFamily: String?
        private var rootFontSize: Int?
        private var rootFontStyle: Int?
        private var rootCaption: String = ""

        private let rootList = ElementList()
        private var appendTargetStack: [ElementList] = []
        private var elementBuilderStack: [ElementBuilder] = []

        private var textBuffer = ""
        private var inTextTag = false

        private var caseNameStack: [String] = []
        private var caseListStack: [ElementList] = []

        override init() {
            super.init()
            appendTargetStack = [rootList]
        }

        func parser(_ parser: XMLParser, didStartElement elementName: String, namespaceURI: String?, qualifiedName qName: String?, attributes attributeDict: [String: String]) {
            switch elementName {
            case "struktogramm":
                rootFontFamily = attributeDict["fontfamily"].map(VisuStructJavaStringCoding.decode)
                rootFontSize = attributeDict["fontsize"].flatMap(Int.init)
                rootFontStyle = attributeDict["fontstyle"].flatMap(Int.init)
                rootCaption = attributeDict["caption"].map(VisuStructJavaStringCoding.decode) ?? ""

            case "strelem":
                guard let tStr = attributeDict["typ"],
                      let tInt = Int(tStr),
                      let t = VisuStructElementType(rawValue: tInt)
                else { return }

                let zx = attributeDict["zx"].flatMap(Int.init) ?? 0
                let zy = attributeDict["zy"].flatMap(Int.init) ?? 0
                let textColor = attributeDict["textcolor"].flatMap(parseJavaARGBIntString)
                let bgColor = attributeDict["bgcolor"].flatMap(parseJavaARGBIntString)

                let e = VisuStructElement(
                    type: t,
                    zoomX: zx,
                    zoomY: zy,
                    textColor: textColor,
                    backgroundColor: bgColor,
                    textLines: []
                )
                elementBuilderStack.append(ElementBuilder(element: e))

            case "text":
                inTextTag = true
                textBuffer = ""

            case "schleifeninhalt":
                guard let top = elementBuilderStack.last else { return }
                let list = ElementList()
                top.loopBody = list
                appendTargetStack.append(list)

            case "fall":
                guard let top = elementBuilderStack.last else { return }
                let nameCoded = attributeDict["fallname"] ?? ""
                let name = VisuStructJavaStringCoding.decode(nameCoded)
                caseNameStack.append(name)
                let list = ElementList()
                caseListStack.append(list)
                appendTargetStack.append(list)
                // Cases werden beim Schließen von </fall> an `top.cases` gehängt.
                _ = top // nur zur Klarheit

            default:
                break
            }
        }

        func parser(_ parser: XMLParser, foundCharacters string: String) {
            guard inTextTag else { return }
            textBuffer += string
        }

        func parser(_ parser: XMLParser, didEndElement elementName: String, namespaceURI: String?, qualifiedName qName: String?) {
            switch elementName {
            case "text":
                inTextTag = false
                let coded = textBuffer.trimmingCharacters(in: .whitespacesAndNewlines)
                let decoded = VisuStructJavaStringCoding.decode(coded)
                guard let top = elementBuilderStack.last else { return }
                top.element.textLines.append(decoded)

            case "schleifeninhalt":
                _ = appendTargetStack.popLast()

            case "fall":
                _ = appendTargetStack.popLast()
                guard let name = caseNameStack.popLast(),
                      let list = caseListStack.popLast(),
                      let top = elementBuilderStack.last
                else { return }
                top.cases.append(VisuStructCase(name: name, elements: list.elements))

            case "strelem":
                guard let builder = elementBuilderStack.popLast() else { return }
                var e = builder.element
                if e.textLines.isEmpty { e.textLines = [""] }
                if let loop = builder.loopBody, !loop.elements.isEmpty {
                    e.loopBody = loop.elements
                }
                if !builder.cases.isEmpty {
                    e.cases = builder.cases
                }
                appendTargetStack.last?.elements.append(e)

            case "struktogramm":
                document = VisuStructDocument(
                    fontFamily: rootFontFamily,
                    fontSize: rootFontSize,
                    fontStyle: rootFontStyle,
                    caption: rootCaption,
                    elements: rootList.elements
                )

            default:
                break
            }
        }

        private func parseJavaARGBIntString(_ s: String) -> VisuStructRGBA? {
            guard let i32 = Int32(s) else { return nil }
            let u = UInt32(bitPattern: i32)
            let a = UInt8((u >> 24) & 0xFF)
            let r = UInt8((u >> 16) & 0xFF)
            let g = UInt8((u >> 8) & 0xFF)
            let b = UInt8(u & 0xFF)
            return VisuStructRGBA(r: r, g: g, b: b, a: a)
        }
    }
}

