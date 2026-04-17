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

## Changelog / release notes

Versioned release notes live in **[CHANGELOG.md](CHANGELOG.md)**. On the repository’s **GitHub home page**, only this **README** is shown in full by default; open `CHANGELOG.md` in the file list (or use the **Changes** link at the top) to read the history. The **Releases** tab only shows extra notes if you create [GitHub Releases](https://github.com/code4teaching/VisuStruct-SwiftUI/releases) (optional, in addition to the changelog file).
