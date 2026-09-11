# Changelog

All notable changes to this repository will be documented in this file.

The format is loosely inspired by Keep a Changelog.

## [Unreleased]

### Planned / Notes

- Documentation polish for product/marketing surfaces only when explicitly requested.

## [1.5.3] - 2026-09-06

### Added

- **File menu:** New, Open, Open Recent, Save, Save As, Print, and Close on the menu bar / keyboard (`Cmd+N/O/S/Shift+S/P/W`), including on Mac (Designed for iPad). Open Recent uses the same list as the toolbar.
- **Files:** double-click or Open With a `.visustruct` or `.strk` file in Finder / Files opens it in VisuStruct (same XML as the Java Struktogrammeditor). The simulation layout is unchanged.

### Fixed

- **Tabs:** warn before closing diagrams with unsaved changes, offering to save, discard, or cancel.
- **File menu:** recently used files show up again under Ablage / File. Nested Open Recent stayed empty because SwiftUI Commands snapshot `FocusedValue`; the list now comes from the shared recents store and is listed directly in Ablage.
- **File menu:** Open, New, Save, and the other Ablage items are enabled after launch. Commands kept a frozen empty `FocusedValue`, so those entries stayed grayed out. Ablage now posts notifications the editor handles, and Open starts enabled instead of waiting on a FocusedValue snapshot.
- **File menu:** Open was missing entirely on Mac (Designed for iPad) because SwiftUI’s Open command with ⌘O is absorbed as the system document-open item and then dropped. Ablage → Öffnen is now a UIKit `UIAction` in the File menu.
- **File menu:** recent files sit under **Zuletzt verwendet** again instead of filling Ablage; the nested list is built when that submenu opens.

## [1.2.1] - 2026-04-20

### Added

- **Code generator (iPad & Mac):** movable floating panel with a drag handle so the structogram stays visible; **iPhone** still uses a full-screen sheet.
- **UI scale:** independent text scaling for the **diagram canvas** vs the **inspector** (`VisuStructUIScale`, wired through Settings / app storage).
- **Switch block:** short inspector hint for the selector expression (code-style example: `day`).

### Changed

- **Inspector hints:** removed the long for-loop explainer (columns and placeholders carry the UX); removed `e.g.` prefixes from inline examples; removed the endless-loop hint line; **break** placeholder copy now describes an **optional comment** (empty field still emits a plain `break` in generated code).
- **Canvas:** **break** and **method call** tiles center label text vertically and horizontally inside the drawable area (accounting for side bars), consistent with statement blocks.
- **`VisuStructCore`:** layout and code-generator adjustments supporting the above; localized string updates across locales.

## [1.2] - 2026-04-17

### Added

- Broad localization coverage across app strings + Settings bundle integration where applicable.
- Diagram clipboard UX (copy/cut/paste) plus keyboard/menu shortcuts on platforms where supported.
- Statement modes for structured diagram authoring:
  - Output prefix `print:` with codegen mappings per language target.
  - Input prefix `input:` with codegen mappings per language target (starter typing stays uniform across languages).
- JavaScript runner improvements for web-based execution (`prompt()` supported in `WKWebView`).

### Changed

- Diagram layout/rendering refinements for multi-way blocks and selection overlay ordering.
- Editor typography improvements for code entry on iPad/Mac.
- Version metadata aligned for release workflow (marketing version / build numbers in Xcode project).

### Fixed

- Issues where diagram sizing/selection visuals could diverge when using placeholder/display text.
- Various UX polish items discovered during multilingual rollout.
