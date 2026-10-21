---
titel: Schiffe versenken
nach: 16
stufe: 2
---

Beim Spiel Schiffe versenken ist das Meer ein Gitter. Die Spalten heißen A bis E, die Reihen 1 bis 5. Im Startdiagramm steht das Meer als 2D-Array `meer`: `true` heißt, auf diesem Feld liegt ein Teil eines Schiffs.

::: grafik schiffe-versenken.svg
Grau heißt `true`: Hier liegt ein Schiff. Die kleinen grauen Zahlen sind die Indizes im Array, sie beginnen bei 0. Im Spiel heißen die Felder dagegen A bis E und 1 bis 5.
:::

::: übung aufgabe-schiffe
titel: Schiffe versenken
auftrag: Gib alle Felder aus, auf denen ein Schiff liegt, jedes Feld in einer eigenen Zeile, z. B. **B1**. Gehe dafür mit zwei verschachtelten Schleifen Reihe für Reihe durch das Meer.
  Für das Startdiagramm erscheinen **B1**, **C1**, **D1**, **E3**, **E4** und **A5**.
start: aufgabe-schiffe-start.visustruct
test: - -> B1 | C1 | D1 | E3 | E4 | A5
braucht: forSchleife, verzweigung
tipp: Gehe das Meer wie den Kinosaal mit zwei verschachtelten Schleifen durch. Gib nur die Felder aus, auf denen `true` steht.
tipp: Die äußere Schleife zählt `reihe`, die innere `spalte`, beide ab 0. Liegt auf `meer[reihe][spalte]` ein Schiff, gibst du den Buchstaben aus `spalten[spalte]` und die Reihennummer aus: `output: spalten[spalte] + (reihe + 1)`. Das `+ 1` braucht es, weil das Spiel bei 1 zu zählen beginnt.
lösung: aufgabe-schiffe-loesung.visustruct
:::
