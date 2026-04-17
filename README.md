<p align="center">
  <a href="https://visustruct.org/" title="VisuStruct">
    <img src="website/assets/VisuStruct-icon.png" alt="VisuStruct" width="128" height="128">
  </a>
</p>

# VisuStruct (SwiftUI)

Visual **Nassi–Shneiderman** structograms for **iPad** and **Apple silicon Mac**. Same **`.visustruct`** / XML as the open-source **[Java editor](https://github.com/code4teaching/VisuStruct)** — drag-and-drop.

**Localization:** The app ships a large set of UI translations (strings + Settings), with English and German treated as primary “source of truth” strings during development.

**Statements with I/O prefixes:** Instruction text can distinguish **statement / input / output** usage. Prefixes **`input:`** and **`print:`** are interpreted by the code generators (Java / JavaScript / Python targets) while keeping one shared diagram notation.

**[visustruct.org](https://visustruct.org)** · **Build & layout:** [VisuStruct-iOS/README.md](VisuStruct-iOS/README.md) · **Changes:** [CHANGELOG.md](CHANGELOG.md)

The **[Java VisuStruct](https://github.com/code4teaching/VisuStruct)** editor is based on [kekru/struktogrammeditor](https://github.com/kekru/struktogrammeditor) (MIT). **Sources and releases for Java** are maintained only in that repository (always current there). This **SwiftUI** app is a **reimplementation**: same **`.visustruct`** / XML as Java, not a port of that codebase.

---

## Clone

```bash
git clone https://github.com/code4teaching/VisuStruct-SwiftUI.git
```

**Remote:** [github.com/code4teaching/VisuStruct-SwiftUI](https://github.com/code4teaching/VisuStruct-SwiftUI)

---

## GitHub „About“ (Metadaten)

Die **Kurzbeschreibung**, **Website** und **Topics** auf GitHub werden nicht aus dieser Datei übernommen — sie müssen im Repo unter **About** (Zahnrad) bzw. **Settings → General** eingetragen werden. Zum Kopieren:

| Feld | Inhalt |
|------|--------|
| **Description** | Nassi–Shneiderman structogram editor for iPad & Apple silicon Mac (SwiftUI). Broad UI localization; statement modes with input:/print: prefixes and Java, JavaScript & Python code generation. Same .visustruct/XML as github.com/code4teaching/VisuStruct. |
| **Website** | `https://visustruct.org` |
| **Topics** (Vorschlag) | `swift` `swiftui` `ipad` `macos` `structogram` `nassi-shneiderman` `education` `algorithm` `diagram` `visustruct` |

<!-- GitHub “About” (eine Zeile): Nassi–Shneiderman structograms — iPad & Mac (SwiftUI); localized UI; input:/print: codegen (Java/JS/Python); shares .visustruct with code4teaching/VisuStruct -->
