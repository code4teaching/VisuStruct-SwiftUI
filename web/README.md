# VisuStruct Web (Prototyp)

Erster Prototyp von VisuStruct im Browser: `.visustruct`-Dateien öffnen, als Struktogramm zeichnen,
Elemente per Drag & Drop einfügen oder verschieben, Texte bearbeiten, Schritt für Schritt simulieren,
Java-, Python- oder JavaScript-Code erzeugen (JavaScript direkt im Browser ausführen) und wieder speichern.
Läuft komplett im Browser, ohne Server.

## Ausprobieren

```bash
cd web
npm install
npm run dev      # http://localhost:5173
npm test         # Dateiformat-, Bearbeitungs-, Simulations- und Codegenerator-Tests
npm run build    # statische Dateien in web/dist/ (relative Pfade, z. B. für website/app/)
npm run build:single  # eine einzelne, eigenständige index.html in web/dist-single/
npm run build:site    # baut die App nach website/app/ (wird mit der Webseite veröffentlicht)
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
| `src/core/lineEditorText.ts` | `Editing/VisuStructLineEditorText.swift`, `Inspector/StatementIOMode.swift` |
| `src/core/palette.ts` | `Palette/ElementPalette.swift` |
| `src/core/simulation.ts` | `VisuStructSimulationEngine.swift` |
| `src/core/codeGenerator.ts` | `VisuStructCodeGenerator.swift`, `CodeGeneration/*.swift` |
| `src/ui/renderer.ts` | `Canvas/DiagramCanvasRenderer.swift` (als SVG) |
| `src/ui/exporter.ts` | `Export/DiagramSnapshotAndExport.swift`, `Export/DiagramExporter.swift` |
| `src/ui/i18n.ts` | `AppLanguage.swift` mit `*.lproj/Localizable.strings` und `Java.strings` |
| `src/ui/codePanel.ts` | `CodeGeneration/CodeGeneratorPanels.swift`, `Runner/JavaScriptRunner.swift` |
| `src/ui/simulationPanel.ts` | `Simulation/SimulationController.swift`, `Simulation/SimulationPanels.swift` |

`test/editingParity.test.ts` überträgt `MultiwayPathTests.swift` und `LineEditorTextTests.swift`,
`test/simulation.test.ts` überträgt `SimulationEngineTests.swift` und `SimulationConditionTests.swift`,
`test/codeGenerator.test.ts` überträgt `CodeGeneratorTests.swift` (die erzeugten `.java`-Dateien für Collatz und
Fibonacci müssen byte-gleich zu denen in `VisuStruct-Dateien` sein).

JavaScript läuft beim Testen in einem Web Worker: `prompt()` wird zu einem Eingabefeld, `while (true)` bricht wie in der
App nach 100 000 Durchläufen ab, und „Stopp“ beendet jeden Lauf.

`test/xmlCodec.test.ts` lädt jede Datei aus `VisuStruct-Dateien`, speichert sie wieder und verlangt
**byte-gleiche** Ausgabe zum Swift-Encoder (nur CRLF aus Windows wird zu LF, wie in Swift).

Mehrere Diagramme sind als Reiter offen (wie `Tabs/` in der App); jeder Reiter hat eigenes Rückgängig.
Kopieren/Ausschneiden/Einfügen, Textgröße und das Feld für Fallnamen folgen der Mac-App.

„Exportieren…“ speichert das Diagramm mit Titel als PNG, SVG oder einseitiges A4-PDF (Hoch- oder Querformat wie in
der App, ohne zusätzliche Bibliothek) oder druckt es (Strg+P). `test/exporter.test.ts` prüft Dateinamen, Seitenformat
und den Aufbau der PDF-Datei.

Die Oberfläche spricht dieselben 21 Sprachen wie die App (plus „Java (Keywords)“). Die Texte kommen direkt aus den
`Localizable.strings` der App; nur Texte, die es nur im Web gibt, stehen in `src/i18n/<Sprache>.strings`. Fehlt ein Text,
gilt wie in der App der englische. Beim ersten Start wird die Browsersprache gewählt; Arabisch und Hebräisch laufen von
rechts nach links, das Struktogramm und der Code bleiben links nach rechts. `test/i18n.test.ts` prüft, dass jeder im Code
benutzte Schlüssel einen englischen Text hat und jede Sprache alle Web-Texte mit denselben Platzhaltern enthält.

## Veröffentlichen

Die App liegt fertig gebaut in `website/app/` und wird mit der übrigen Webseite hochgeladen; sie ist dann unter
`visustruct.org/app/` erreichbar. Die Download-Karten auf der Webseite verlinken sie mit `?lang=…` in der Sprache der Seite.
Nach Änderungen in `web/` oder an den `Localizable.strings` der App `npm run build:site` ausführen und `website/app/`
mitcommitten; der CI-Schritt „website/app ist aktuell“ schlägt sonst fehl. Es gibt keinen Server: Dateien werden nur im
Browser geöffnet und gespeichert.

Drag & Drop nutzt Zeiger-Ereignisse statt HTML5-Drag-and-Drop, damit Maus, Stift und Finger gleich funktionieren.

## Noch nicht enthalten

Verschieben vorhandener Elemente mit dem Finger.
