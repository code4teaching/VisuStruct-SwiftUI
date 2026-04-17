# Changelog

All notable changes to this repository will be documented in this file.

The format is loosely inspired by Keep a Changelog.

## [Unreleased]

### Planned / Notes

- Documentation polish only happens when explicitly requested for product/marketing surfaces.

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
