<p align="center">
  <img src="../../website/assets/VisuStruct-icon.png" alt="VisuStruct" width="112" height="112">
</p>

# VisuStruct (Java)

[![Build](https://github.com/code4teaching/VisuStruct/actions/workflows/maven-build.yml/badge.svg?branch=master)](https://github.com/code4teaching/VisuStruct/actions)

Visual **Nassi–Shneiderman** structogram editor for **Windows, macOS, and Linux** (Java **17**). **Settings → Languages:** English, German, Portuguese (`en` / `de` / `pt_PT` in `visustruct.properties`). Same **`.visustruct`** XML as the **[SwiftUI app](https://github.com/code4teaching/VisuStruct-SwiftUI)**.

**[visustruct.org](https://visustruct.org)** · **[Download latest JAR](https://github.com/code4teaching/VisuStruct/releases/latest/download/visustruct.jar)**

Based on [kekru/struktogrammeditor](https://github.com/kekru/struktogrammeditor) (MIT) — see [LICENSE](LICENSE).

```bash
git clone https://github.com/code4teaching/VisuStruct.git
```

## Changes in 1.0.7 (summary)

- **Code generator:** Delphi/Pascal removed; **Python 3.10+** added (`match` / `case`); dialog localized; target stored as `celanguage` (`0` Java, `1` Python) in `visustruct.properties`.
- **Multi-way (Java):** default column label **`default`** (i18n `structure.multiway.defaultCaseLabel`).
- **`XMLLeser`:** public load methods renamed **`ladeXML`** (fixes typo `ladeXLM`).
- **Cleanup:** removed unused selection/size-box leftovers in `Struktogramm` / `StruktogrammElement`.
- **Build:** Maven **`de.visustruct:visustruct:1.0.7`**, fat JAR **`visustruct-1.0.7.jar`**.

Full notes: [`release-notes/v1.0.7.md`](release-notes/v1.0.7.md)

## Changes in 1.0.6 (summary)

- **UI / theme:** cleaner menus; **light/dark FlatLaf** without restart; improved dark readability.
- **Languages:** Settings → Languages (EN / DE / PT); `uilanguage` in `visustruct.properties`; JVM locale fallback.
- **i18n:** menus, dialogs, `JFileChooser`, context menu, palette; English no longer overridden by OS locale.
- **Labels / palette:** presets and preview; tab title **“Untitled”** localized; empty `build.properties` timestamp/revision no longer errors on start.
- **Build:** **`de.visustruct:visustruct:1.0.6`**, **`visustruct-1.0.6.jar`**.

Full notes: [`release-notes/v1.0.6.md`](release-notes/v1.0.6.md)

## Changes in 1.0.5 (summary)

- **Canvas:** `CanvasStyle` colors aligned with VisuStruct palette.
- **Save / tabs:** correct diagram for title and dirty `*`; UTF-8 XML; error dialog on write failure.
- **macOS:** menu bar **inside the window** for reliable FlatLaf **Save**; FlatLaf **3.7.1**; `invokeLater` after tab rename for save dialog.
- **Light theme:** `VisuStructTheme` for readable menu items.
- **Build:** **`de.visustruct:visustruct:1.0.5`**, **`visustruct-1.0.5.jar`**.

## Changes in 1.0.4 (summary)

Rebranded to **VisuStruct**; **`.visustruct` / XML** remains compatible (numeric `typ` values unchanged).

- Java packages **`de.visustruct.*`**; Maven **`de.visustruct:visustruct:1.0.4`**; main **`de.visustruct.control.Main`**.
- Settings file **`visustruct.properties`** with migration from **`struktogrammeditor.properties`**.
- macOS bundle ID / document UTI **`de.visustruct.*`** — re-assign **Open With** for `.visustruct` if needed.
- Upstream [kekru/struktogrammeditor](https://github.com/kekru/struktogrammeditor) still credited (MIT).

## Changes in 1.0.3 (summary)

- Maven Wrapper **3.3.4**, Maven **3.9.9**; compiler / assembly plugin bumps; `-Xlint:deprecation`.
- Swing API cleanups (`getModifiersEx`, generics in `JListEasy` / `FontChooser`, `JNumberField` deprecations).

## Changes in 1.0.2 (summary)

- Faster code generator output; clearer comments when “structogram text as comments” is enabled.
- Preset dialog for new-element templates (e.g. English/Java-style `condition`, `selector`, …).
- **VisuStruct** / **`.visustruct`** file filters and associations; logo and minor UI tweaks.

## Technical baseline (1.0.1 and earlier)

- **Java 17** target; build/run with JDK 17+.
- **FlatLaf** light/dark themes aligned with **[visustruct.org](https://visustruct.org)** styling; **Settings → Look and feel:** “Modern · light” / “Modern · dark”.
- **JDOM2** (no legacy JDOM / AppleJavaExtensions); **Metal** + FlatLaf (Motif removed in newer JDKs).
- Output JAR: **`visustruct-1.0.7.jar`** (fat JAR with dependencies).

## Download (no build)

Students only need **Java 17+** — no Maven required.

**[Download visustruct.jar (latest release)](https://github.com/code4teaching/VisuStruct/releases/latest/download/visustruct.jar)**

```bash
java -jar visustruct.jar
```

On **Windows**, double-click often works if `.jar` is associated with Java.

All releases: [github.com/code4teaching/VisuStruct/releases](https://github.com/code4teaching/VisuStruct/releases)

**Maintainers:** create a release with tag e.g. **`v1.0.7`** — workflow [`.github/workflows/release-assets.yml`](.github/workflows/release-assets.yml) attaches **`visustruct.jar`** among other assets.

## Requirements

- [JDK 17](https://adoptium.net/) or newer (to **run** the JAR; to **build**, see below)
- **Building:** internet on first run so **Maven** can fetch dependencies

## Build the JAR

Clone the repo and open a terminal in the project folder.

**Windows (PowerShell):**

```powershell
.\mvnw.cmd clean package
```

**Linux or macOS:**

```bash
chmod +x mvnw
./mvnw clean package
```

Output:

```text
target/visustruct-1.0.7.jar
```

## Run

```bash
java -jar target/visustruct-1.0.7.jar
```

Double-click may work if `.jar` is linked to Java.

## Upstream and Git

- **Upstream:** [github.com/kekru/struktogrammeditor](https://github.com/kekru/struktogrammeditor)
- **Add `upstream` remote** (once):

  ```bash
  git remote add upstream https://github.com/kekru/struktogrammeditor.git
  ```

- **Merge upstream changes** (simplified):

  ```bash
  git fetch upstream
  git merge upstream/master
  ```

## Contributing

Suggestions and bug reports welcome via [**Issues** and **Pull requests**](https://github.com/code4teaching/VisuStruct).

Use **English** for commits and code comments where practical. New UI strings belong in **`Messages*.properties`** (and **`structure.*`**) for **en**, **de**, and **pt_PT**; discuss new keys in an issue first if unsure.

## License

**MIT** — see [LICENSE](LICENSE). Original program copyright: **Kevin Krummenauer** (also stated in LICENSE).

## Historical upstream page

[whiledo.de — Struktogrammeditor](https://whiledo.de/index.php?p=struktogrammeditor) (original editor by Kevin Krummenauer)
