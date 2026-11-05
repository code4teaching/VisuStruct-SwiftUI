<p align="center">
  <a href="https://visustruct.org/" title="VisuStruct">
    <img src="website/assets/VisuStruct-icon.png" alt="VisuStruct" width="128" height="128">
  </a>
</p>

# VisuStruct (SwiftUI)

Visual **Nassi–Shneiderman** structograms for **Mac, iPad, and iPhone**, and as a web app in the browser (`web/`, with VisuBot for the mBot2 robot, including a Scratch-like block view). Same **`.visustruct`** / XML as the open-source **[Java editor](https://github.com/code4teaching/VisuStruct)** — drag-and-drop.

**Localization:** The app ships a large set of UI translations (strings + Settings), with English and German treated as primary “source of truth” strings during development.

**Statements with I/O prefixes:** Instruction text can distinguish **statement / input / output** usage. Prefixes **`input:`** and **`print:`** are interpreted by the code generators (Java / JavaScript / Python targets) while keeping one shared diagram notation.

**[visucode.de](https://visucode.de)** · **Build & layout:** [VisuStruct-iOS/README.md](VisuStruct-iOS/README.md) · **Changes:** [CHANGELOG.md](CHANGELOG.md)

The **[Java VisuStruct](https://github.com/code4teaching/VisuStruct)** editor is based on [kekru/struktogrammeditor](https://github.com/kekru/struktogrammeditor) (MIT). **Sources and releases for Java** are maintained only in that repository (always current there). This **SwiftUI** app is a **reimplementation**: same **`.visustruct`** / XML as Java (and it opens legacy **`.strk`** files), not a port of that codebase.

---

## Clone

```bash
git clone https://github.com/code4teaching/VisuStruct-SwiftUI.git
```

**Remote:** [github.com/code4teaching/VisuStruct-SwiftUI](https://github.com/code4teaching/VisuStruct-SwiftUI)

## Web app and website

The web app in `web/` (VisuStruct, VisuBot, VisuObject, VisuFlow) is built with `npm run build:site` into `website/app/`. Since 2026-11-03 it is published on **[visucode.de](https://visucode.de)**, one subdomain per world: [visustruct.visucode.de](https://visustruct.visucode.de), [visubot.visucode.de](https://visubot.visucode.de), [visuobject.visucode.de](https://visuobject.visucode.de). The website itself lives in a separate GitLab repository (`visucode/website`); its script `app-aktualisieren.sh` copies the built app from here, and a push to its `main` branch deploys it.

The workflow **Webseite veröffentlichen** (`.github/workflows/deploy-website.yml`) for the old site visustruct.org is no longer used for new releases.

## Changelog / release notes

Versioned release notes live in **[CHANGELOG.md](CHANGELOG.md)**. On the repository’s **GitHub home page**, only this **README** is shown in full by default; open `CHANGELOG.md` in the file list (or use the **Changes** link at the top) to read the history. The **Releases** tab only shows extra notes if you create [GitHub Releases](https://github.com/code4teaching/VisuStruct-SwiftUI/releases) (optional, in addition to the changelog file).

## License

VisuStruct is open source under the **[MIT License](LICENSE)**. Third-party parts keep their own licenses (e.g. CodeMirror: MIT). The optional Swing support in the web app loads [CheerpJ](https://cheerpj.com) by Leaning Technologies from its CDN at runtime (Community License, not part of this repository).
