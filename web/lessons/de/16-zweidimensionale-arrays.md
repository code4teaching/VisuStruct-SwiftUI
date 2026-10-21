---
titel: Zweidimensionale Arrays
bereich: Grundlagen
kurz: Werte in Zeilen und Spalten speichern, wie die Sitze in einem Kinosaal, und mit zwei verschachtelten Schleifen durchlaufen.
---

## Ein Kinosaal als Tabelle

Ein Kinosaal hat mehrere **Reihen**, und jede Reihe hat mehrere **Plätze**. Für jeden Sitz wollen wir uns merken, ob die Karte schon verkauft ist. Das ist eine Ja-oder-nein-Frage, also passt der Datentyp `boolean`: `true` heißt verkauft, `false` heißt frei.

Ein normales Array ist eine einzige Reihe von Fächern. Für den Saal brauchen wir eine **Tabelle** mit Zeilen und Spalten. Das ist ein **zweidimensionales Array**, kurz 2D-Array. Du schreibst dafür zwei Paar eckige Klammern:

```
boolean[][] sitze = new boolean[3][5]
```

Das ergibt 3 Reihen mit je 5 Plätzen, also 15 Fächer. Am Anfang steht in allen Fächern `false`: Alle Plätze sind frei.

::: grafik kino-saal.svg
Der erste Index ist die Reihe, der zweite der Platz. Beide werden ab 0 gezählt.
:::

## Ein Fach ansprechen

Für ein Fach brauchst du jetzt **zwei** Indizes: zuerst die Reihe, dann den Platz.

```
sitze[1][2] = true
```

Damit ist in Reihe 1 der Platz 2 verkauft. Gelesen wird genauso: `sitze[1][2]` ist jetzt `true`.

Auch die Größe kannst du abfragen:

- `sitze.length` ist die Anzahl der **Reihen**, hier 3.
- `sitze[0].length` ist die Anzahl der **Plätze** in Reihe 0, hier 5.

::: diagramm kino-verkaufen.visustruct
Drei Karten werden verkauft. Danach gibt das Diagramm die Größe des Saals aus und ob Reihe 1, Platz 2 verkauft ist. Schau in der Simulation unter Variablen zu: sitze wird Zeile für Zeile angezeigt.
:::

> Wie beim normalen Array gibt es kein Fach `sitze[3][0]`, denn die Reihen heißen 0, 1 und 2. Die Simulation meldet dann einen ungültigen Ausdruck.

## Zwei Schleifen ineinander

Um **alle** Plätze anzusehen, brauchst du zwei For-Schleifen ineinander:

- Die **äußere Schleife** zählt die Reihe: `reihe` läuft von 0 bis 2.
- Die **innere Schleife** zählt den Platz: `platz` läuft von 0 bis 4.

::: grafik kino-schleifen.svg
Blau ist die äußere Schleife, Orange die innere. Die Zahlen zeigen, in welcher Reihenfolge die Plätze drankommen.
:::

Für jede Reihe läuft die innere Schleife einmal **komplett** durch. Erst wenn `platz` alle fünf Plätze besucht hat, zählt die äußere Schleife `reihe` um eins weiter. Danach beginnt `platz` wieder bei 0. So kommen alle 3 · 5 = 15 Plätze genau einmal dran.

Die Bedingungen lauten `reihe < sitze.length` und `platz < sitze[reihe].length`. So passen die Schleifen zu jeder Saalgröße.

::: diagramm kino-saalplan.visustruct
Der Saalplan: Für jede Reihe wird eine Zeile aus X (verkauft) und O (frei) zusammengesetzt und ausgegeben. Gehe es mit Schritt durch und beobachte, wie platz immer wieder von vorn beginnt, während reihe nur langsam weiterzählt.
:::

::: angeberwissen
Jedes Handyfoto ist ein 2D-Array! Ein Foto mit 4000 · 3000 Pixeln hat 3000 Zeilen mit je 4000 Fächern, also 12 Millionen Pixel. In jedem Fach steht die Farbe eines Punkts. Wenn du ein Foto heller machst, läuft das Handy mit zwei verschachtelten Schleifen über alle Pixel. Mein Profilbild hat übrigens nur ein Fach: braun.
:::

## Übung: Freie Plätze zählen

::: übung kino-frei
titel: Freie Plätze zählen
auftrag: Im Startdiagramm sind schon drei Karten verkauft. Zähle mit zwei verschachtelten Schleifen, wie viele Plätze noch **frei** sind, und gib z. B. `Frei: 12` aus.
start: kino-frei-start.visustruct
test: - -> Frei: 12
braucht: forSchleife, verzweigung
tipp: Du gehst wie beim Saalplan mit zwei Schleifen über alle Plätze. Statt etwas auszugeben, zählst du mit.
tipp: Lege vor den Schleifen `int frei = 0` an. Ein Platz ist frei, wenn `sitze[reihe][platz]` falsch ist. Die Bedingung dafür lautet `!sitze[reihe][platz]`.
lösung: kino-frei-loesung.visustruct
:::

## Übung: Karte verkaufen

::: übung kino-karte
titel: Karte verkaufen
auftrag: Das Startdiagramm fragt nach Reihe und Platz. Ist der Platz schon verkauft, gib `Schon verkauft` aus. Sonst markiere ihn als verkauft und gib z. B. `Verkauft: Reihe 0, Platz 4` aus.
start: kino-karte-start.visustruct
test: 1, 2 -> Schon verkauft
test: 0, 4 -> Verkauft: Reihe 0, Platz 4
test: 2, 0 -> Verkauft: Reihe 2, Platz 0
braucht: verzweigung
tipp: Zuerst wird geprüft, ob der Platz verkauft ist. Je nach Antwort passiert etwas anderes.
tipp: Hier brauchst du keine Schleife. Eine Verzweigung mit der Bedingung `sitze[reihe][platz]` genügt. Im false-Zweig setzt du das Fach auf `true`.
lösung: kino-karte-loesung.visustruct
:::

## Übung: Einmaleins-Tabelle

::: übung kino-einmaleins
titel: Einmaleins-Tabelle
auftrag: Lege `int[][] tabelle = new int[10][10]` an und fülle sie mit zwei Schleifen mit dem kleinen Einmaleins. Frage danach zwei Zahlen von 1 bis 10 ab und lies das Ergebnis aus der Tabelle, z. B. `3 · 4 = 12`.
test: 3, 4 -> 3 · 4 = 12
test: 7, 8 -> 7 · 8 = 56
test: 10, 10 -> 10 · 10 = 100
braucht: forSchleife
tipp: Erst füllen zwei verschachtelte Schleifen die Tabelle, danach liest du nur ein einziges Fach aus.
tipp: Die Indizes laufen von 0 bis 9, die Zahlen aber von 1 bis 10. Darum steht im Fach `tabelle[i][j]` der Wert `(i + 1) * (j + 1)`, und für 3 · 4 liest du `tabelle[a - 1][b - 1]`.
lösung: kino-einmaleins-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann ein 2D-Array anlegen und weiß, was die beiden Zahlen bedeuten. → Ein Kinosaal als Tabelle
- Ich kann ein Fach mit Reihe und Platz lesen und schreiben. → Ein Fach ansprechen
- Ich kenne den Unterschied zwischen `sitze.length` und `sitze[0].length`. → Ein Fach ansprechen
- Ich kann erklären, in welcher Reihenfolge zwei verschachtelte Schleifen die Fächer besuchen. → Zwei Schleifen ineinander
:::

## Wissenstest

::: quiz
? Wie viele Fächer hat `boolean[][] sitze = new boolean[4][6]`?
- [ ] 10
- [x] 24
- [ ] 46
> 4 Reihen mit je 6 Plätzen: 4 · 6 = 24.

? Was steht nach `new boolean[3][5]` in allen Fächern?
- [ ] true
- [x] false
- [ ] Nichts, die Fächer sind leer
> Ein neues boolean-Array ist mit false gefüllt. Im Kino heißt das: alle Plätze frei.

? Zwei verschachtelte Schleifen laufen über 3 Reihen mit 5 Plätzen. Wie oft wird der Inhalt der **inneren** Schleife ausgeführt?
- [ ] 3-mal
- [ ] 8-mal
- [x] 15-mal
> Für jede der 3 Reihen läuft die innere Schleife 5-mal: 3 · 5 = 15.

? Ordne zu, was der Ausdruck im Kinosaal bedeutet.
= sitze.length -> Anzahl der Reihen
= sitze[0].length -> Anzahl der Plätze in Reihe 0
= sitze[2][4] -> Reihe 2, Platz 4
= sitze[1][0] = true -> In Reihe 1 ist Platz 0 verkauft
:::
