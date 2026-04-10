import SwiftUI
import UniformTypeIdentifiers
import VisuStructCore

/// Minimaler SwiftUI-Viewer: lädt eine `.visustruct`/`.xml` Datei und zeigt eine Baum-Ansicht (Text) an.
/// Rendering als Diagramm (Canvas/CoreGraphics) ist der nächste Schritt.
struct ContentView: View {
    @State private var document: VisuStructDocument?
    @State private var errorText: String?
    @State private var showImporter = false
    @State private var showCanvas = true

    var body: some View {
        NavigationStack {
            Group {
                if let errorText {
                    ContentUnavailableView(
                        "Fehler beim Laden",
                        systemImage: "exclamationmark.triangle",
                        description: Text(errorText)
                    )
                } else if let document {
                    if showCanvas {
                        ScrollView([.horizontal, .vertical]) {
                            DiagramCanvasView(document: document)
                                .padding()
                        }
                    } else {
                        List {
                            if !document.caption.isEmpty {
                                Section("Caption") { Text(document.caption) }
                            }
                            Section("Elemente") {
                                ForEach(Array(document.elements.enumerated()), id: \.offset) { _, e in
                                    ElementNodeView(element: e)
                                }
                            }
                        }
                    }
                } else {
                    ContentUnavailableView(
                        "Keine Datei geladen",
                        systemImage: "doc",
                        description: Text("Importiere eine .visustruct-Datei über „Import“.")
                    )
                }
            }
            .navigationTitle("VisuStruct (Prototype)")
            .toolbar {
                Button("Import") { showImporter = true }
                if document != nil {
                    Toggle(isOn: $showCanvas) {
                        Text("Canvas")
                    }
                }
            }
        }
        .fileImporter(
            isPresented: $showImporter,
            allowedContentTypes: [.xml, UTType(filenameExtension: "visustruct")].compactMap { $0 },
            allowsMultipleSelection: false
        ) { result in
            do {
                let url = try result.get().first!
                let doc = try VisuStructXMLCodec.decode(url: url)
                document = doc
                errorText = nil
            } catch {
                errorText = error.localizedDescription
            }
        }
    }
}

private struct ElementNodeView: View {
    let element: VisuStructElement

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(verbatim: "Typ \(element.type.rawValue)  zx=\(element.zoomX)  zy=\(element.zoomY)")
                .font(.headline)
            ForEach(element.textLines, id: \.self) { line in
                Text(line).font(.body)
            }

            if let loopBody = element.loopBody {
                DisclosureGroup("Schleifeninhalt") {
                    ForEach(Array(loopBody.enumerated()), id: \.offset) { _, e in
                        ElementNodeView(element: e)
                    }
                }
            }

            if let cases = element.cases {
                DisclosureGroup("Fälle") {
                    ForEach(Array(cases.enumerated()), id: \.offset) { _, c in
                        DisclosureGroup(c.name.isEmpty ? "(leer)" : c.name) {
                            ForEach(Array(c.elements.enumerated()), id: \.offset) { _, e in
                                ElementNodeView(element: e)
                            }
                        }
                    }
                }
            }
        }
    }
}

