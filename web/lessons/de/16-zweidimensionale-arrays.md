---
titel: Zweidimensionale Arrays
bereich: Grundlagen
kurz: Werte in Zeilen und Spalten speichern, wie die Sitze in einem Kinosaal, und mit zwei verschachtelten Schleifen durchlaufen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- ein 2D-Array anlegen und erklären, was die beiden Zahlen bedeuten
- ein Fach mit Reihe und Platz lesen und schreiben
- `sitze.length` und `sitze[0].length` unterscheiden
- erklären, in welcher Reihenfolge zwei verschachtelte Schleifen die Fächer besuchen
- in Java ein zweidimensionales Array anlegen und durchlaufen
:::

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

## Jetzt in Java

Der Kinosaal sieht in Java so aus:

```java editor
boolean[][] sitze = new boolean[3][5];
sitze[0][2] = true;
sitze[1][1] = true;
sitze[1][2] = true;
System.out.println("Reihen: " + sitze.length);
System.out.println("Plätze pro Reihe: " + sitze[0].length);
System.out.println("Reihe 1, Platz 2 verkauft? " + sitze[1][2]);
```

- Zwei Paar eckige Klammern `[][]` stehen für eine Tabelle: erst die Reihe, dann der Platz.
- `sitze.length` ist die Zahl der Reihen, `sitze[0].length` die Zahl der Plätze in einer Reihe.
- Mit festen Werten schreibst du jede Reihe in eigene geschweifte Klammern: `int[][] t = {{1, 2}, {3, 4}};`

::: übung l16-java-punkte
titel: Punkte zusammenzählen
code: java
auftrag: Drei Spieler haben je zwei Runden gespielt. Lege in Java die Tabelle `punkte` mit den Reihen {3, 5}, {4, 1} und {2, 2} an. Zähle mit zwei verschachtelten For-Schleifen alle Punkte zusammen und gib **Summe: 17** aus.
test: - -> Summe: 17
braucht: forSchleife
tipp: Die äußere Schleife geht durch die Reihen, die innere durch die Plätze einer Reihe.
tipp: `int[][] punkte = {{3, 5}, {4, 1}, {2, 2}};` und in der inneren Schleife `summe = summe + punkte[i][j];`. Die innere Schleife läuft bis `punkte[i].length`.
lösung: l16-java-punkte-loesung.visustruct
:::

## Lückentext: Tabellen

::: lückentext
titel: Alle Felder zusammenzählen
auftrag: Das Programm zählt alle Zahlen in der Tabelle zusammen. Ergänze die fehlenden Wörter und Zeichen.
```java
[[int]][][] feld = {{1, 2, 3}, {4, 5, 6}};
int summe = 0;
for (int r = 0; r < feld.[[length]]; r++) {
    for (int s = 0; s < feld[r].[[length]]; s++) {
        summe = summe [[+]] feld[r][s];
    }
}
System.out.println("Summe: " + summe);
```
erklärung: `int[][]` ist eine Tabelle. `feld.length` ist die Zahl der Reihen (2), `feld[r].length` die Zahl der Felder in Reihe `r` (3). Ausgabe: **Summe: 21**
:::

## Fehler finden: Punkte

::: übung l16-java-fehler
titel: Spieler 2 reparieren
code: java
auftrag: In der Tabelle `punkte` steht jede Reihe für einen Spieler. Das Programm soll die Punkte von Spieler 2 (Reihe 1) zusammenzählen, also **Spieler 2: 11**. Stattdessen meldet es einen Fehler.
  „Im Editor öffnen“ zeigt den Code im Bereich Code. Finde den Fehler, repariere ihn und klicke auf Prüfen.
start: l16-java-fehler-start.visustruct
test: - -> Spieler 2: 11
braucht: forSchleife
tipp: Bei `punkte[a][b]` ist `a` die Reihe und `b` der Platz in der Reihe. Welche Zahl steht für die Reihe von Spieler 2?
tipp: Die Indizes sind vertauscht: `punkte[1][j]` statt `punkte[j][1]`.
lösung: l16-java-fehler-loesung.visustruct
:::

## Warum läuft das nicht?

::: übung l16-java-laeuft-nicht
titel: Spielstand ablesen
code: java
auftrag: In der Tabelle `punkte` steht jede Reihe für einen Spieler, jede Spalte für eine Runde. Das Programm soll die Punkte von Spieler 2 in Runde 1 ausgeben, also **Spieler 2, Runde 1: 4**. Es läuft aber nicht.
  „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: l16-java-laeuft-nicht-start.visustruct
test: - -> Spieler 2, Runde 1: 4
braucht: anweisung
tipp: Die Fächer `[1][0]` stimmen. Schau dir den Namen der Tabelle an.
tipp: Die Tabelle heißt `punkte` mit kleinem p: `punkte[1][0]`
lösung: l16-java-laeuft-nicht-loesung.visustruct
:::

## Spiel: Welcher Platz?

::: spiel frage
titel: Spiel: Welcher Platz?
intro: Ludwig verkauft Kinokarten. Erst die Reihe, dann der Platz, beide ab 0. Sieben Runden.

runde:
    boolean[][] sitze = new boolean[3][5];
    System.out.println(sitze.length);
frage: Was wird ausgegeben?
- [x] 3
- 5
- 15
> `sitze.length` ist die Anzahl der Reihen.

runde:
    boolean[][] sitze = new boolean[3][5];
    System.out.println(sitze[0].length);
frage: Was wird ausgegeben?
- 3
- [x] 5
- 15
> `sitze[0]` ist die Reihe 0. Ihre Länge ist die Anzahl der Plätze in dieser Reihe.

runde:
    int[][] tabelle = new int[4][6];
frage: Wie viele Fächer hat die Tabelle?
- 10
- [x] 24
- 35
> 4 Reihen mit je 6 Plätzen: 4 · 6 = 24.

runde:
    int[][] t = {{1, 2}, {3, 4}};
    System.out.println(t[1][0]);
frage: Was wird ausgegeben?
- 2
- [x] 3
- 4
> Reihe 1 ist `{3, 4}`, darin Platz 0 die 3.

runde:
    boolean[][] sitze = new boolean[3][5];
    sitze[3][0] = true;
frage: Was passiert?
- Der erste Platz in Reihe 3 ist verkauft.
- Der erste Platz in der letzten Reihe ist verkauft.
- [x] Es gibt einen Fehler, denn die Reihen heißen 0, 1 und 2.
> Wie beim normalen Array ist der letzte Index eins weniger als die Länge.

runde:
    int[][] t = {{1, 2, 3}, {4, 5, 6}};
    int summe = 0;
    for (int reihe = 0; reihe < t.length; reihe++) {
        for (int platz = 0; platz < t[reihe].length; platz++) {
            summe = summe + t[reihe][platz];
        }
    }
    System.out.println(summe);
frage: Was wird ausgegeben?
- 6
- 15
- [x] 21
> Die zwei Schleifen besuchen alle sechs Fächer: 1 + 2 + 3 + 4 + 5 + 6 = 21.

runde:
frage: Zwei Schleifen gehen den Saal `new boolean[3][5]` durch. Welches Fach kommt direkt nach `sitze[0][4]`?
- `sitze[0][5]`
- [x] `sitze[1][0]`
- `sitze[1][4]`
> Reihe 0 ist fertig. Die äußere Schleife zählt weiter, und der Platz beginnt wieder bei 0.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann ein 2D-Array anlegen und erklären, was die beiden Zahlen bedeuten. → Ein Kinosaal als Tabelle
- Ich kann ein Fach mit Reihe und Platz lesen und schreiben. → Ein Fach ansprechen
- Ich kann `sitze.length` und `sitze[0].length` unterscheiden. → Ein Fach ansprechen
- Ich kann erklären, in welcher Reihenfolge zwei verschachtelte Schleifen die Fächer besuchen. → Zwei Schleifen ineinander
- Ich kann in Java ein zweidimensionales Array anlegen und durchlaufen. → Jetzt in Java
:::

## Wissenstest

::: quiz
? Wie viele Fächer hat `boolean[][] sitze = new boolean[4][6]`?
→ Ein Kinosaal als Tabelle
- [ ] 10
- [x] 24
- [ ] 46
> 4 Reihen mit je 6 Plätzen: 4 · 6 = 24.

? Was steht nach `new boolean[3][5]` in allen Fächern?
→ Ein Kinosaal als Tabelle
- [ ] true
- [x] false
- [ ] Nichts, die Fächer sind leer
> Ein neues boolean-Array ist mit false gefüllt. Im Kino heißt das: alle Plätze frei.

? Zwei verschachtelte Schleifen laufen über 3 Reihen mit 5 Plätzen. Wie oft wird der Inhalt der **inneren** Schleife ausgeführt?
→ Zwei Schleifen ineinander
- [ ] 3-mal
- [ ] 8-mal
- [x] 15-mal
> Für jede der 3 Reihen läuft die innere Schleife 5-mal: 3 · 5 = 15.

? Ordne zu, was der Ausdruck im Kinosaal bedeutet.
→ Ein Fach ansprechen
= sitze.length -> Anzahl der Reihen
= sitze[0].length -> Anzahl der Plätze in Reihe 0
= sitze[2][4] -> Reihe 2, Platz 4
= sitze[1][0] = true -> In Reihe 1 ist Platz 0 verkauft

? Was gibt `sitze.length` bei `new boolean[3][5]` an?
→ Ein Fach ansprechen
- [x] 3, die Zahl der Reihen
- [ ] 5, die Zahl der Plätze
- [ ] 15, alle Plätze zusammen
:::
