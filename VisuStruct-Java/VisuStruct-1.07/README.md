# VisuStruct

[![Build-Status](https://github.com/code4teaching/VisuStruct/actions/workflows/maven-build.yml/badge.svg?branch=master)](https://github.com/code4teaching/VisuStruct/actions)

**VisuStruct** ist ein **Struktogramm-Editor** für **Nassi-Shneiderman-Diagramme**.

Die **Benutzeroberfläche** kann unter **Einstellungen → Sprachen** auf **Deutsch**, **Englisch** oder **Portugiesisch** gestellt werden (technisch `uilanguage`: `en`, `de`, `pt_PT`); wenige Hilfsdialoge können noch teils englische Beschriftungen haben.

*Herkunft:* Das Programm basiert auf dem Open-Source-Projekt [kekru/struktogrammeditor](https://github.com/kekru/struktogrammeditor) (Kevin Krummenauer, MIT). Details und Copyright stehen in der [LICENSE](LICENSE).

**Website:** [visustruct.de](https://visustruct.de)  
**Repository:** [github.com/code4teaching/VisuStruct](https://github.com/code4teaching/VisuStruct)

### English

**VisuStruct** is a **structure-chart editor** for **Nassi–Shneiderman diagrams**.

Under **Settings → Languages** the **user interface** can be set to **English**, **German**, or **Portuguese** (stored as `en`, `de`, or `pt_PT` in `visustruct.properties`); a few auxiliary dialogs may still use English labels.

*Lineage:* Built on the open-source project [kekru/struktogrammeditor](https://github.com/kekru/struktogrammeditor) (Kevin Krummenauer, MIT). See [LICENSE](LICENSE) for copyright and terms.

**Website:** [visustruct.de](https://visustruct.de) — **Repository:** [github.com/code4teaching/VisuStruct](https://github.com/code4teaching/VisuStruct)

```bash
git clone https://github.com/code4teaching/VisuStruct.git
```

## Änderungen in Version 1.0.7 (Auszug)

- **Quellcode-Generator:** **Delphi/Pascal** entfernt; **Python** ergänzt (**3.10+**, `match`/`case` für Mehrfachauswahl); Dialog **mehrsprachig**; gewählte Zielsprache in **`visustruct.properties`** (`celanguage`: `0` Java, `1` Python).
- **Mehrfachauswahl (Java):** Standardbeschriftung der letzten Spalte **`default`** statt „Else“ (I18n `structure.multiway.defaultCaseLabel`).
- **API:** `XMLLeser`-Methoden **`ladeXML`** (früher falsch `ladeXLM`).
- **Code:** ungenutzte Markierungs-/Kästchen-Reste aus dem Upstream entfernt (`Struktogramm`, `StruktogrammElement`).
- **Build:** Maven **`de.visustruct:visustruct:1.0.7`**, Fat-JAR **`visustruct-1.0.7.jar`**.

*Ausführliche Liste (Deutsch/Englisch):* [`release-notes/v1.0.7.md`](release-notes/v1.0.7.md).

## Änderungen in Version 1.0.6 (Auszug)

- **Oberfläche & Thema:** Menüs bereinigt; **hell/dunkel** wechselbar **ohne Neustart**; dunkler Modus lesbarer.
- **Sprachen:** **Einstellungen → Sprachen** zeigt **Englisch**, **Deutsch**, **Portugiesisch** (ohne Länderzusätze); Speicherung in **`visustruct.properties`** (`uilanguage`). Ohne Eintrag: Vorgabe aus **JVM-Locale**.
- **I18n:** Menü, zentrale **Melde- und Sicherheitsdialoge** (u. a. Beenden, Tab schließen, Überschreiben, Speichern, PNG-Export), **JFileChooser**-Beschriftungen, **Kontextmenü**, Palette (u. a. PNG, Info, Papierkorb); **Englisch** wird nicht mehr durch die OS-Locale überschrieben.
- **Struktogramm-Beschriftung:** Preset **„Java (Standard)“** / engl. **„Java (Default)“** zuerst im Dialog, danach didaktisches Preset passend zur UI-Sprache, dann die deutsch fest codierten Pakete; **Vorschau** mit didaktischen Zeilenüberschriften; **Palette**: beim Java-Preset **Schlüsselwörter** auf den Buttons (`if`, `switch`, `while`, …), Standardtexte in neuen Blöcken unverändert syntaxnah.
- **Tabs:** neuer Diagramm-Reiter **„Ohne Titel“** (bzw. lokalisiert), nicht mehr fest „Untitled“.
- **Build / `build.properties`:** Leere `timestamp`/`revision` lösen keinen Fehler mehr beim Start.
- **Build:** Maven **`de.visustruct:visustruct:1.0.6`**, Fat-JAR **`visustruct-1.0.6.jar`**.

*Ausführliche Liste (Deutsch/Englisch):* [`release-notes/v1.0.6.md`](release-notes/v1.0.6.md).

## Änderungen in Version 1.0.5 (Auszug)

- **Zeichenfläche:** Farben an VisuStruct-Hellesthetik angepasst (**`CanvasStyle`**: weicher Hintergrund, graue Kanten, Markierung in Blauton, dezentere Drag-Vorschau)
- **Speichern / Tabs:** Titel und `*`-Markierung gehören zum **richtigen** Diagramm; Speichern mit **UTF-8** und **Fehlermeldung** bei Schreibfehlern
- **macOS:** Menü **im Fenster** (wie Windows/Linux), damit **Save** mit FlatLaf zuverlässig funktioniert; **FlatLaf 3.7.1**; Speicherdialog nach Tab-Umbenennung erst nach kurzer Verzögerung
- **Menüfarben (hell):** **`VisuStructTheme`** ergänzt für lesbare Menüeinträge

## Änderungen in Version 1.0.4 (Release-Notizen)

Diese Version richtet **Marke und technische Identität** an **VisuStruct** aus. **Projektdateien** (`.visustruct` / XML) sind unverändert lesbar; im XML werden Elementtypen weiterhin numerisch gespeichert.

- **Java-Paket:** Quellcode unter **`de.visustruct`** (`control`, `view`, `other`, `struktogrammelemente`) statt `de.kekru.struktogrammeditor`.
- **Maven:** Koordinaten **`de.visustruct:visustruct:1.0.4`** (`artifactId` **visustruct**). Wer das Projekt als Abhängigkeit einbindet, muss **groupId**, **artifactId** und ggf. **version** anpassen. Fat-JAR-Name: **`visustruct-1.0.4.jar`** (über `finalName` / `version` in der `pom.xml`). Der Release-Workflow liefert zusätzlich **`visustruct.jar`** mit festem Dateinamen.
- **Einstellungen (Benutzer):** Standarddatei im Arbeitsverzeichnis **`visustruct.properties`**. Existiert nur noch **`struktogrammeditor.properties`**, werden die Werte beim Start übernommen; beim nächsten Speichern der Einstellungen schreibt die App **`visustruct.properties`** und entfernt die alte Datei, sofern möglich.
- **macOS (`.app`):** **Bundle-Identifier** und **UTI** für Dokumenttypen sind auf **`de.visustruct.*`** umgestellt. Nach dem Wechsel der App ggf. **„Öffnen mit“** für `.visustruct` erneut zuordnen. **jpackage**-Skripte verwenden **`de.visustruct.control.Main`**.
- **Herkunft / Lizenz:** Verweise auf das **Upstream-Projekt** [kekru/struktogrammeditor](https://github.com/kekru/struktogrammeditor) bleiben in README und Infodialog (Attribution, MIT).

### English (summary for 1.0.4)

- Java packages moved to **`de.visustruct.*`**; Maven coordinates **`de.visustruct:visustruct:1.0.4`**. Main class **`de.visustruct.control.Main`**.
- Settings file is now **`visustruct.properties`**, with one-time migration from **`struktogrammeditor.properties`** on save.
- macOS bundle ID / document UTI updated to **`de.visustruct`**; you may need to re-assign **Open With** for `.visustruct`.
- **`.visustruct` / XML project files** remain compatible; upstream **kekru/struktogrammeditor** remains credited in README and the about dialog.

## Änderungen in Version 1.0.3 (Auszug)

- **Build:** **Apache Maven Wrapper** **3.3.4** (*only-script*, ohne eingecheckte `maven-wrapper.jar`), gebündeltes Maven **3.9.9**; `maven-compiler-plugin` **3.14.1**, `maven-assembly-plugin` **3.7.1**; Kompilierung mit **`-Xlint:deprecation`**
- **Code / APIs:** moderne Swing-Modifier (`getModifiersEx`, `SwingUtilities` für Maustasten, `getMenuShortcutKeyMaskEx`); **Generics** bei `JListEasy`, `FontChooser`; `Double`/`Integer`-Deprecations in `JNumberField` bereinigt

## Änderungen in Version 1.0.2 (Auszug)

- **Quellcode-Generator:** schnellere Ausgabe (gepuffertes Schreiben), effizientere String-Verarbeitung; bei Option „Struktogrammtext als Kommentare“ stehen Bedingungen lesbarer (Kommentarzeile, Klartext in den Klammern)
- **Textvorlagen für neue Elemente:** Einstellungsdialog mit Presets (u. a. englisch/Java-nah mit `condition`, `selector`, …)
- **Marke / Dateien:** u. a. Anpassungen für **VisuStruct** und **`.visustruct`** (Filter, Assoziationen)
- **Logo** und weitere kleinere UI-Anpassungen

## Technische Basis (1.0.1 und früher)

- **Java 17** als Zielversion (mit JDK 17 oder höher bauen und ausführen)
- **FlatLaf** mit Farben wie auf **[VisuStruct](https://visustruct.de)** (hell: `style.css`, dunkel: Layout-Farben aus `styles.css`), unter *Einstellungen → Look and Feel:* „Modern · hell“ / „Modern · dunkel“
- **JDOM2** statt JDOM 1, keine veraltete Bibliothek „AppleJavaExtensions“ mehr; Einbindung von macOS über die üblichen **Java-Schnittstellen**
- Der frühere **Motif**-Stil entfällt (in neueren JDKs nicht mehr enthalten); stattdessen **Metal** und FlatLaf
- Gebaute Datei: **`visustruct-1.0.7.jar`** (eine startfertige Datei **mit** allen Programmbibliotheken)

## Fertiges Programm herunterladen (ohne selbst zu bauen)

**Für den Unterricht:** Schülerinnen und Schüler brauchen **kein Maven** – nur **Java 17** (oder neuer) zum Starten.

**Direkter Download der neuesten veröffentlichten Version** (fester Dateiname, immer die aktuelle Release):

**[➜ visustruct.jar herunterladen](https://github.com/code4teaching/VisuStruct/releases/latest/download/visustruct.jar)**

Danach z. B. im Ordner, in dem die Datei liegt:

```bash
java -jar visustruct.jar
```

Unter **Windows** reicht oft ein Doppelklick, wenn `.jar` mit Java verknüpft ist.

Alle **veröffentlichten Versionen** und Hinweise zum Wechsel stehen unter:  
[github.com/code4teaching/VisuStruct/releases](https://github.com/code4teaching/VisuStruct/releases)

**Release auf GitHub aktualisieren:** Unter *Releases* eine **neue Version** anlegen, Tag z. B. **`v1.0.7`** auf den passenden Commit setzen und veröffentlichen. Die Workflow-Datei [`.github/workflows/release-assets.yml`](.github/workflows/release-assets.yml) baut dann die JARs und hängt u. a. **`visustruct.jar`** (fester Download-Link oben) an die Release an.

## Voraussetzungen

- [JDK 17](https://adoptium.net/) oder neuer (zum **Ausführen** der JAR; zum **Selbstbauen** siehe unten)
- **Nur beim Selbstbauen:** Internet beim ersten Mal, damit **Maven** die Bibliotheken laden kann

## Lauffähige Programmdatei (JAR) selbst erzeugen

Das Projekt herunterladen oder klonen und im Projektordner ein Terminal öffnen.

**Windows (PowerShell):**

```powershell
.\mvnw.cmd clean package
```

**Linux oder macOS:**

```bash
chmod +x mvnw
./mvnw clean package
```

Die fertige Datei befindet sich hier:

```text
target/visustruct-1.0.7.jar
```

## Programm starten

```bash
java -jar target/visustruct-1.0.7.jar
```

Auf vielen Rechnern genügt auch ein **Doppelklick** auf die JAR-Datei, wenn der Dateityp `.jar` mit Java verknüpft ist.

## Upstream (Basis-Projekt) und Git-Synchronisation

- **Basis-Repo auf GitHub:** [github.com/kekru/struktogrammeditor](https://github.com/kekru/struktogrammeditor)  
- **Git – `upstream` einrichten** (einmalig, falls noch nicht geschehen):

  ```bash
  git remote add upstream https://github.com/kekru/struktogrammeditor.git
  ```

  **Änderungen von `upstream` übernehmen** (vereinfacht):

  ```bash
  git fetch upstream
  git merge upstream/master
  ```

## Mitmachen

Verbesserungsvorschläge und **Fehlerbeschreibungen** sind willkommen – über [**Issues** und **Pull requests**](https://github.com/code4teaching/VisuStruct) dieses Repositories.

Für **Commits** und **Programm-Kommentare** kann **Englisch** verwendet werden.  
Neue **sichtbare UI-Texte** in **`Messages*.properties`** (und ggf. **`structure.*`**) für **en**, **de** und **pt_PT** pflegen; bei neuen Schlüsseln oder unklarer Formulierung gerne vorher im Issue kurz abstimmen.

## Lizenz

**MIT** – siehe [LICENSE](LICENSE). Das **Urheberrecht** am ursprünglichen Programmcode liegt bei Kevin Krummenauer (steht auch in der LICENSE-Datei).

## Historische Webseite zur Basis-Software

[whiledo.de – Struktogrammeditor](https://whiledo.de/index.php?p=struktogrammeditor) (zum ursprünglichen Editor von Kevin Krummenauer)
