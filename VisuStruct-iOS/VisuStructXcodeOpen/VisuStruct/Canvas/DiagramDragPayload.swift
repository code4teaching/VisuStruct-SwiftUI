import CoreTransferable
import Foundation
import UniformTypeIdentifiers

/// Einheitlicher Drag-Typ für Palette und Verschieben im Diagramm (stabiler als nacktes `String` zwischen `List` und Canvas).
struct DiagramDragPayload: Transferable, Equatable, Hashable, Sendable {
    let raw: String

    static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(contentType: .plainText) { item in
            Data(item.raw.utf8)
        } importing: { data in
            DiagramDragPayload(raw: String(decoding: data, as: UTF8.self))
        }
    }
}
