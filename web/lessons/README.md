# Lektionen und Aufgaben

Alles in diesem Ordner erscheint im Lernbereich der Web-App. Nach einer Änderung `npm test` (prüft alle Dateien) und
`npm run build:site` ausführen.

```
lessons/
  de/01-was-ist-ein-struktogramm.md   Lektionen, die Nummer am Anfang bestimmt die Reihenfolge
  de/nachschlagen.md                  Seite „Nachschlagen“
  de/begriffe.md                      Fachbegriffe mit Erklärung (Hovern oder Antippen im Lektionstext)
  de/aufgaben/summe-bilden.md         Aufgaben
  diagramme/l1-tee.visustruct         Diagramme für Lektionen, Startdiagramme und Musterlösungen
```

Diagramme sind normale `.visustruct`-Dateien: in VisuStruct bauen, speichern und hier ablegen.

## Lektion

```markdown
---
titel: Der Editor
bereich: Erste Schritte
kurz: Elemente einfügen, Text eingeben, verschieben und löschen.
---

## Die Oberfläche

Normaler Text mit **fett**, *kursiv*, `Code`, Listen und [Links](https://…).

> Ein Zitat erscheint als hervorgehobener Hinweis.

## Nächster Schritt
…
```

Jede `## Überschrift` beginnt einen neuen Schritt (eine Seite mit „Weiter“). `bereich` gruppiert die Lektionen in der
Übersicht. Innerhalb eines Schritts gehen `###`-Zwischenüberschriften und Codeblöcke mit drei Backticks.

## Bausteine

Ein Diagramm mit Vorschau und Knopf „Im Editor öffnen“, die Zeilen bis `:::` sind die Bildunterschrift:

```
::: diagramm l2-ausgabe.visustruct
Eine Ausgabe mit Text in Anführungszeichen.
:::
```

Eine Übung, die VisuStruct beim Klick auf „Prüfen“ automatisch kontrolliert:

```
::: übung l2-hallo
titel: Hallo Welt
auftrag: Baue ein Struktogramm, das „Hallo Welt“ ausgibt.
  Weitere Zeilen gehören noch zum Auftrag.
start: l2-start.visustruct
test: - -> Hallo Welt
test: 3, 4 -> 7 | fertig
braucht: verzweigung, whileSchleife
tipp: Ziehe eine Anweisung auf den Platzhalter und wähle oben „Ausgabe“.
lösung: l2-hallo-loesung.visustruct
:::
```

- `test:` Eingaben durch Kommas getrennt, dann `->`, dann die erwarteten Ausgabezeilen durch `|` getrennt.
  `-` heißt „keine Eingabe“. Leerzeichen am Rand zählen nicht, `2.0` gilt wie `2`. Mehrere `test:`-Zeilen sind erlaubt.
- `start:` (optional) Diagramm, mit dem die Übung beginnt; sonst ein leeres Diagramm.
- `braucht:` (optional) Elemente, die vorkommen müssen: `anweisung`, `verzweigung`, `fallauswahl`, `forSchleife`,
  `whileSchleife`, `doUntilSchleife`, `endlosschleife`, `aussprung`, `aufruf`.
- `tipp:` (optional) wird erst auf Klick gezeigt.
- `lösung:` (optional) Musterlösung. In Aufgaben kann man sie aufklappen; der Test prüft, dass sie alle Tests besteht.
- `unterprogramm:` (optional) Unterprogramme zur Musterlösung, durch Komma getrennt. Ihr Titel ist der Name im Aufruf. Beim Prüfen findet VisuStruct Unterprogramme in den anderen offenen Reitern.
- Die Kennung (`l2-hallo`) muss überall eindeutig sein, denn unter ihr wird der Fortschritt gespeichert.

Eine Checkliste zum Abhaken:

```
::: checkliste
- Ich kann ein Element einfügen.
- Ich kann einen Kasten löschen. → Verschieben, kopieren, löschen
:::
```

Steht hinter einem Punkt `→` und der Titel eines Schritts dieser Lektion, zeigt die Checkliste daneben **Nachlesen**. Ein Klick springt zu diesem Schritt. Ein falscher Titel fällt beim Bauen und in den Tests auf.

Ein oder mehrere Bilder aus `lessons/bilder/` nebeneinander, die Zeilen bis `:::` sind die Bildunterschrift (dort auch den
Bildnachweis angeben):

```
::: bild ike-nassi.jpg ben-shneiderman.jpg
Links Ike Nassi, rechts Ben Shneiderman (Fotos: …).
:::
```

Eine Erklärgrafik in voller Breite aus `lessons/bilder/`, am besten als SVG (bleibt auf jedem Bildschirm scharf). Die
Zeilen bis `:::` sind die Bildunterschrift:

```
::: grafik l14-array.svg
Fünf Fächer mit den Indizes 0 bis 4.
:::
```

Tabellen schreibst du mit senkrechten Strichen, die zweite Zeile trennt die Überschrift ab:

```
| Schritt | summe | i |
|---|---|---|
| `int summe = 0` | 0 | – |
```

Ein Zeiger auf den Editor ist ein Link auf `#zeige-…`, zum Beispiel `[Palette](#zeige-palette)`. Beim Hovern oder Antippen
leuchtet der Bereich im Editor auf. Bekannte Bereiche: leiste, palette, struktogramm, eingabefeld, reiter, titel, neu,
oeffnen, speichern, exportieren, rueckgaengig, textgroesse, lernen, code, simulation (Liste in `src/ui/termTips.ts`).

Ein Kasten „Angeberwissen mit Ludwig“, in dem unser Maskottchen Ludwig der Geißbock eine Hintergrundgeschichte erzählt.
Der Text darf Markdown und Links enthalten:

```
::: angeberwissen
Ben Shneiderman hatte die Idee 1972. [Mehr dazu](https://visustruct.org/de/angeberwissen.html)
:::
```

Ein Quiz, `[x]` markiert richtige Antworten, `>` ist die Erklärung nach dem Antworten:

```
::: quiz
? Was bedeutet ø?
- [x] Ein leerer Platzhalter
- [ ] Eine Ausgabe
> Den Platzhalter ersetzt du durch ein Element.
:::
```

## Aufgabe

Wie eine Lektion, aber ohne Schritte. `nach` ist die Nummer der Lektion, die man vorher kennen sollte, `stufe` die
Schwierigkeit von 1 bis 3 (Sterne).

```markdown
---
titel: Summe bilden
nach: 2
stufe: 1
---

Kurze Einleitung.

::: übung aufgabe-summe
…
:::
```

## Hinweis zur Ausgabe

In einer Ausgabe hängt `+` Texte aneinander, auch bei Zahlen: `zahl1 + zahl2` gibt bei 3 und 4 „34“ aus. Für eine
Summe zuerst rechnen (`int summe = zahl1 + zahl2`) und dann `summe` ausgeben.

## Fachbegriffe

In `de/begriffe.md` steht jeder Begriff als `### Begriff`, darunter optional `auch: Form, Form` und die Erklärung in ein bis
zwei Sätzen. In den Lektionen und Aufgaben wird jeder Begriff einmal pro Schritt markiert und zeigt beim Hovern oder
Antippen seine Erklärung. Steht der Begriff im Schritt **fett**, wird er dort gerade erklärt und bleibt unmarkiert. Code,
Überschriften und Links werden nie markiert. Unter „Nachschlagen“ erscheinen alle Begriffe als Liste.
