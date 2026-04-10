# VisuStruct → Swift (iOS)

Dieses Verzeichnis enthält die **SwiftUI-iOS-App** und das **Swift-Paket** `VisuStructCore` mit Datenmodell, Layout und XML-Import/Export (kompatibel zum Java-Format).

## Wo liegt was?

| Pfad | Inhalt |
|------|--------|
| **`VisuStructCore/`** | **Einzige Quelle** des SPM-Pakets (`Package.swift`, `Sources/VisuStructCore/`). Hier entwickeln und `swift build` ausführen. |
| **`VisuStructXcodeOpen/`** | Xcode-Projekt `VisuStruct.xcodeproj` — bindet das Paket per **lokaler Abhängigkeit** `../VisuStructCore` ein. |
| **`SwiftUIPrototype/`** | Älterer Prototyp ohne vollständiges Projekt (nur zur Einordnung). |

Es gibt **keine** zweite Kopie von `VisuStructCore` mehr unter `VisuStructXcodeOpen/`.

## iOS-App bauen

1. `VisuStructXcodeOpen/VisuStruct.xcodeproj` in Xcode öffnen.
2. Scheme **VisuStruct**, Ziel Simulator oder Gerät wählen, **Run**.

## Paket allein bauen (Terminal)

```bash
cd VisuStructCore
swift build
```

## Java-Referenz

`VisuStruct-Java/VisuStruct-1.07/` — Original Swing/Maven; Elementtypen und XML-Struktur sind mit `VisuStructCore` abgestimmt.

### Elementtypen (`typ` / `VisuStructElementType`)

- 0: `anweisung` — 1: `verzweigung` — 2: `fallauswahl` — 3: `forSchleife` — 4: `whileSchleife`
- 5: `doUntilSchleife` — 6: `endlosschleife` — 7: `aussprung` — 8: `aufruf` — 9: `leerElement`

### XML (Kurzüberblick)

- Root: `<struktogramm fontfamily="…" fontsize="…" fontstyle="…" caption="…">`
- Kinder: `<strelem typ=".." zx=".." zy=".." …>` mit `<text>…</text>`, optional `<schleifeninhalt>`, `<fall fallname="…">`
- Zeichenketten wie in Java codiert (`VisuStructJavaStringCoding`).

## App-Funktionen (Stand)

- Mehrere Diagramme in **Tabs**, Palette, **Drag & Drop**, Text-Inspector, Undo/Redo  
- **Öffnen / Speichern / Speichern unter** (`.visustruct` / XML), PNG **teilen**, **Drucken** (wo verfügbar)  
- **Sprachen:** Deutsch, English, Português (europeu, `pt-PT`) — Auswahl in den **Systemeinstellungen** unter der App (**Settings.bundle**)

## Bekannte Abweichungen zur Java-Oberfläche

- Zeichnung nutzt feste Darstellung; **Dokument-Schrift** und **Kachelfarben** aus dem XML werden im Canvas noch nicht wie in Swing dargestellt (Daten werden aber gelesen/geschrieben).
- Fehlermeldungen aus `VisuStructCore` (`VisuStructEditError`, `VisuStructXMLError`) sind derzeit überwiegend auf **Deutsch** formuliert, unabhängig von der App-Sprache.
