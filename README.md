<p align="center">
  <a href="https://visustruct.org/" title="VisuStruct">
    <img src="website/assets/VisuStruct-icon.png" alt="VisuStruct" width="128" height="128">
  </a>
</p>

# VisuStruct (SwiftUI)

Visual **Nassi–Shneiderman** structograms for **Mac, iPad, and iPhone**. Same **`.visustruct`** / XML as the open-source **[Java editor](https://github.com/code4teaching/VisuStruct)** — drag-and-drop.

**Localization:** The app ships a large set of UI translations (strings + Settings), with English and German treated as primary “source of truth” strings during development.

**Statements with I/O prefixes:** Instruction text can distinguish **statement / input / output** usage. Prefixes **`input:`** and **`print:`** are interpreted by the code generators (Java / JavaScript / Python targets) while keeping one shared diagram notation.

**[visustruct.org](https://visustruct.org)** · **Build & layout:** [VisuStruct-iOS/README.md](VisuStruct-iOS/README.md) · **Changes:** [CHANGELOG.md](CHANGELOG.md)

The **[Java VisuStruct](https://github.com/code4teaching/VisuStruct)** editor is based on [kekru/struktogrammeditor](https://github.com/kekru/struktogrammeditor) (MIT). **Sources and releases for Java** are maintained only in that repository (always current there). This **SwiftUI** app is a **reimplementation**: same **`.visustruct`** / XML as Java (and it opens legacy **`.strk`** files), not a port of that codebase.

---

## Clone

```bash
git clone https://github.com/code4teaching/VisuStruct-SwiftUI.git
```

**Remote:** [github.com/code4teaching/VisuStruct-SwiftUI](https://github.com/code4teaching/VisuStruct-SwiftUI)

## Website deployment

`website/` is published to visustruct.org (All-Inkl) by the workflow **Webseite veröffentlichen** (`.github/workflows/deploy-website.yml`). It runs the web tests first and then uploads via FTPS, i.e. encrypted FTP (`.github/scripts/deploy-website.sh`).

- **Publish:** push a tag `web-v…` (e.g. `web-v1.0`, also possible via *Releases → Draft a new release*), or start it by hand under *Actions → Webseite veröffentlichen → Run workflow* (with an optional dry run).
- **Secrets** (*Settings → Secrets and variables → Actions*): `SFTP_USER`, `SFTP_PASSWORD`.
- **Optional variables:** `DEPLOY_HOST` (default `w0103087.kasserver.com`), `DEPLOY_DIR` (default: `visustruct.org` or the login's start folder, whichever holds the VisuStruct site), `DEPLOY_PROTOCOL` (default `ftps`; `sftp` or `auto` = try SFTP, then FTPS).
- On the server only files from earlier deployments (listed in `.visustruct-deploy-manifest.txt`) and outdated build files in `app/assets/` are deleted. Other files are left alone.

## Changelog / release notes

Versioned release notes live in **[CHANGELOG.md](CHANGELOG.md)**. On the repository’s **GitHub home page**, only this **README** is shown in full by default; open `CHANGELOG.md` in the file list (or use the **Changes** link at the top) to read the history. The **Releases** tab only shows extra notes if you create [GitHub Releases](https://github.com/code4teaching/VisuStruct-SwiftUI/releases) (optional, in addition to the changelog file).
