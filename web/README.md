# VisuStruct Web (Prototyp)

Erster Prototyp von VisuStruct im Browser: `.visustruct`-Dateien öffnen, als Struktogramm zeichnen,
Elemente per Drag & Drop einfügen oder verschieben, Texte bearbeiten, Schritt für Schritt simulieren
und wieder speichern.
Läuft komplett im Browser, ohne Server.

## Ausprobieren

```bash
cd web
npm install
npm run dev      # http://localhost:5173
npm test         # Dateiformat-, Bearbeitungs- und Simulationstests
npm run build    # statische Dateien in web/dist/ (relative Pfade, z. B. für website/app/)
npm run build:single  # eine einzelne, eigenständige index.html in web/dist-single/
```

## Aufbau

Der Kern ist eine Datei-für-Datei-Übertragung von `VisuStruct-iOS/VisuStructCore` nach TypeScript,
damit Änderungen in Swift leicht nachgezogen werden können:

| TypeScript | Swift-Vorlage |
| --- | --- |
| `src/core/model.ts` | `VisuStructElement.swift`, `VisuStructDocument.swift` |
| `src/core/javaStringCoding.ts` | `VisuStructJavaStringCoding.swift` |
| `src/core/xmlCodec.ts` | `VisuStructXMLCodec.swift` |
| `src/core/layout.ts` | `VisuStructLayout.swift`, `Layout/VisuStructLayoutEngineMetrics.swift` |
| `src/core/diagramText.ts` | `Layout/VisuStructDiagramText.swift`, `VisuStructLayoutTextMeasurement.swift` |
| `src/core/editing.ts` | `VisuStructDocumentEditing.swift` |
| `src/core/palette.ts` | `Palette/ElementPalette.swift` |
| `src/core/simulation.ts` | `VisuStructSimulationEngine.swift` |
| `src/ui/renderer.ts` | `Canvas/DiagramCanvasRenderer.swift` (als SVG) |
| `src/ui/simulationPanel.ts` | `Simulation/SimulationController.swift`, `Simulation/SimulationPanels.swift` |

`test/simulation.test.ts` überträgt `SimulationEngineTests.swift` und `SimulationConditionTests.swift`.

`test/xmlCodec.test.ts` lädt jede Datei aus `VisuStruct-Dateien`, speichert sie wieder und verlangt
**byte-gleiche** Ausgabe zum Swift-Encoder (nur CRLF aus Windows wird zu LF, wie in Swift).

Drag & Drop nutzt Zeiger-Ereignisse statt HTML5-Drag-and-Drop, damit Maus, Stift und Finger gleich funktionieren.

## Noch nicht enthalten

Codegenerierung, Mehrsprachigkeit (UI ist deutsch), Export als Bild/PDF, Fälle einer
Fallauswahl hinzufügen/umbenennen, Verschieben vorhandener Elemente mit dem Finger.
