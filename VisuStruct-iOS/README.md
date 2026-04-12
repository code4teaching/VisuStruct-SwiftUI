<p align="center">
  <img src="../website/assets/VisuStruct-icon.png" alt="VisuStruct" width="112" height="112">
</p>

# VisuStruct — SwiftUI (iPad & Mac)

SwiftUI app plus **`VisuStructCore`** (model, layout, XML import/export). **`.visustruct`** matches the **[Java VisuStruct](https://github.com/code4teaching/VisuStruct)**.

**[visustruct.org](https://visustruct.org)**

| Path | Role |
|------|------|
| **`VisuStructCore/`** | SPM package — develop here; `swift build`. |
| **`VisuStructXcodeOpen/`** | Xcode project `VisuStruct.xcodeproj` (local package `../VisuStructCore`). |
| **`SwiftUIPrototype/`** | Older prototype only. |

## Build (Xcode)

1. Open `VisuStructXcodeOpen/VisuStruct.xcodeproj`
2. Scheme **VisuStruct** → run on simulator or device.

## Build (package only)

```bash
cd VisuStructCore
swift build
```

## File format (same as Java VisuStruct)

The open-source **[Java / Swing editor](https://github.com/code4teaching/VisuStruct)** is developed and released only there — that repo is the **authoritative**, up-to-date Java edition. This SwiftUI monorepo does not ship Java sources; `VisuStructCore` keeps **element types** and **XML** compatible with that app.

### Element types (`typ`)

0 `anweisung` · 1 `verzweigung` · 2 `fallauswahl` · 3 `forSchleife` · 4 `whileSchleife` · 5 `doUntilSchleife` · 6 `endlosschleife` · 7 `aussprung` · 8 `aufruf` · 9 `leerElement`

### XML (sketch)

- Root: `<struktogramm fontfamily="…" fontsize="…" fontstyle="…" caption="…">`
- Children: `<strelem typ="…" …>` with `<text>`, optional `<schleifeninhalt>`, `<fall fallname="…">`
- Strings: `VisuStructJavaStringCoding` (Java-compatible).

## Features (current)

- Tabs, palette, **drag & drop**, text inspector, undo/redo  
- Open / save **`.visustruct`**, share **PNG**, **print** where supported  
- UI languages: German, English, Portuguese (`pt-PT`) via **Settings.bundle**

## Differences vs Java UI

- Canvas look is mostly fixed; document font / tile colors from XML are not yet fully matched visually (data round-trips).  
- Some `VisuStructCore` errors are still **German-only**, regardless of app language.
