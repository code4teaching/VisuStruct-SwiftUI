import Foundation

/// Java `XMLLeser.encodeS/decodeS`: Unicode-Codepoints als `;`-getrennte Zahlen.
enum VisuStructJavaStringCoding {
    static func encode(_ s: String) -> String {
        if s.isEmpty { return "-1;" }
        var out = ""
        out.reserveCapacity(s.count * 3)
        for scalar in s.unicodeScalars {
            out.append(String(scalar.value))
            out.append(";")
        }
        return out
    }

    static func decode(_ coded: String) -> String {
        // Java split(";") liefert am Ende oft ein leeres Segment -> ignorieren wir.
        let parts = coded.split(separator: ";", omittingEmptySubsequences: true)
        if parts.count == 1, parts.first == "-1" { return "" }

        var scalars: [UnicodeScalar] = []
        scalars.reserveCapacity(parts.count)
        for p in parts {
            guard let i = Int(p) else { continue }
            // Java: -1 => leere Zeile
            if i == -1 { continue }
            guard let u = UnicodeScalar(i) else { continue }
            scalars.append(u)
        }
        return String(String.UnicodeScalarView(scalars))
    }
}

