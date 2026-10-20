---
titel: Arrays
bereich: Grundlagen
kurz: Viele Werte unter einem Namen speichern, mit dem Index darauf zugreifen und sie mit einer Schleife durchlaufen.
---

## Viele Werte unter einem Namen

Stell dir vor, du willst die Punkte von fünf Tests speichern. Mit fünf Variablen `punkte1` bis `punkte5` wird das schnell unübersichtlich. Ein **Array** ist eine Reihe von Fächern, die alle denselben Namen und denselben Datentyp haben.

Du legst ein Array mit einer Anweisung an. Hinter den Datentyp schreibst du eckige Klammern `[]`:

```
int[] zahlen = {2, 4, 6, 8, 10}
String[] namen = {"Ada", "Ben", "Cem"}
```

Die Werte in den geschweiften Klammern stehen gleich in den Fächern. Du kannst auch ein leeres Array mit einer festen Anzahl von Fächern anlegen:

```
int[] punkte = new int[5]
String[] namen = new String[3]
```

Bei `new int[5]` stehen in allen fünf Fächern zuerst Nullen, bei `new String[3]` leere Texte.

## Der Index beginnt bei 0

Jedes Fach hat eine Nummer, den **Index**. Gezählt wird ab **0**. Bei `int[] zahlen = {2, 4, 6, 8, 10}` gilt also:

- `zahlen[0]` ist 2
- `zahlen[1]` ist 4
- `zahlen[4]` ist 10

Mit dem Index liest du einen Wert oder schreibst einen neuen hinein:

```
output: zahlen[0]
zahlen[1] = 99
```

> Ein Array mit 5 Fächern hat die Indizes 0 bis 4. `zahlen[5]` gibt es nicht. Die Simulation meldet dann einen ungültigen Ausdruck.

## Die Länge eines Arrays

Wie viele Fächer ein Array hat, verrät `zahlen.length`. Bei fünf Werten ist das 5. Der **letzte** Index ist deshalb immer `zahlen.length - 1`:

```
output: zahlen.length
output: zahlen[zahlen.length - 1]
```

Die zweite Zeile gibt den letzten Wert aus, egal wie lang das Array ist. VisuStruct versteht auch die Schreibweise `zahlen.length()`.

::: übung l14-erster-letzter
titel: Erster und letzter Wert
auftrag: Lege das Array `int[] werte = {4, 8, 15, 16, 23, 42}` an. Gib danach in drei Zeilen aus: den ersten Wert, den letzten Wert und die Anzahl der Werte.
  Für den letzten Wert sollst du die Länge benutzen und nicht einfach den Index 5 hinschreiben.
test: - -> 4 | 42 | 6
braucht: anweisung
tipp: Der erste Wert ist `werte[0]`. Der letzte ist `werte[werte.length - 1]`. Die Anzahl ist `werte.length`.
lösung: l14-erster-letzter-loesung.visustruct
:::

## Ein Array mit der Schleife durchlaufen

Seine Stärke zeigt ein Array zusammen mit einer **For-Schleife**. Die Zählvariable `i` läuft von 0 bis zum letzten Index und dient als Index:

```
int i = 0
i < zahlen.length
i++
```

Im ersten Durchlauf ist `i` gleich 0, im letzten gleich 4. Weil die Bedingung `i < zahlen.length` lautet, passt die Schleife zu jeder Länge.

::: diagramm l14-array-durchlaufen.visustruct
Die For-Schleife gibt alle fünf Werte nacheinander aus. Schau in der Simulation unter Variablen zu, wie i von 0 bis 4 zählt.
:::

So füllst du ein leeres Array auch mit Eingaben. Als Ziel der Eingabe schreibst du das Fach `namen[i]`:

::: diagramm l14-namen-eingeben.visustruct
Drei Namen werden abgefragt und in die Fächer 0, 1 und 2 geschrieben.
:::

::: übung l14-rueckwaerts
titel: Rückwärts ausgeben
auftrag: Lege ein Array für 4 ganze Zahlen an und lies die 4 Zahlen mit einer Schleife ein. Gib sie danach in **umgekehrter** Reihenfolge aus, jede in einer eigenen Zeile.
test: 1, 2, 3, 4 -> 4 | 3 | 2 | 1
test: 7, 0, 5, 9 -> 9 | 5 | 0 | 7
braucht: forSchleife
tipp: Mit `int[] zahlen = new int[4]` legst du das Array an. Die Eingabe lautet `input: zahlen[i] "Zahl eingeben"`. Für die zweite Schleife beginnst du bei `int i = zahlen.length - 1`, prüfst `i >= 0` und zählst mit `i--` herunter.
lösung: l14-rueckwaerts-loesung.visustruct
:::

## Summe und Maximum

Zwei Aufgaben kommen bei Arrays immer wieder vor:

- **Summe:** Du beginnst mit `summe = 0` und zählst in der Schleife jeden Wert dazu.
- **Maximum:** Du merkst dir zuerst den Wert im Fach 0 als bisher größten. In der Schleife prüfst du jeden Wert. Ist er größer, wird er das neue Maximum.

::: diagramm l14-summe-maximum.visustruct
Summe und Maximum in einem einzigen Durchlauf. Das Maximum beginnt mit punkte[0] und nicht mit 0, damit es auch bei negativen Zahlen stimmt.
:::

::: übung l14-summe-max
titel: Summe und Maximum
auftrag: Lies 5 ganze Zahlen in ein Array ein. Gib danach **Summe: …** und in der nächsten Zeile **Maximum: …** aus.
test: 3, 9, 2, 9, 1 -> Summe: 24 | Maximum: 9
test: 10, 20, 30, 40, 50 -> Summe: 150 | Maximum: 50
test: -5, -2, -9, -1, -3 -> Summe: -20 | Maximum: -1
braucht: forSchleife, verzweigung
tipp: Rechne Summe und Maximum in eigenen Variablen aus und gib sie erst am Ende aus, z. B. mit `output: "Summe: " + summe`. Beginnt dein Maximum bei 0, scheitert der dritte Test.
lösung: l14-summe-max-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann ein Array mit Werten oder mit `new int[5]` anlegen. → Viele Werte unter einem Namen
- Ich weiß, dass der Index bei 0 beginnt und der letzte Index `length - 1` ist. → Der Index beginnt bei 0
- Ich kann ein Array mit einer For-Schleife durchlaufen und füllen. → Ein Array mit der Schleife durchlaufen
- Ich kann die Summe und das Maximum eines Arrays berechnen. → Summe und Maximum
:::

## Wissenstest

::: quiz
? Was gibt `output: zahlen[2]` bei `int[] zahlen = {5, 10, 15, 20}` aus?
- [ ] 10
- [x] 15
- [ ] 20
> Gezählt wird ab 0: zahlen[0] ist 5, zahlen[1] ist 10, zahlen[2] ist 15.

? Ein Array hat 8 Fächer. Welcher Index ist der letzte?
- [ ] 8
- [x] 7
- [ ] 9
> Der letzte Index ist immer length - 1.

? Welche Bedingung passt in eine For-Schleife, die alle Werte von `zahlen` durchläuft und bei `int i = 0` beginnt?
- [x] i < zahlen.length
- [ ] i <= zahlen.length
- [ ] i > zahlen.length
> Mit <= würde die Schleife auch zahlen[length] lesen, und dieses Fach gibt es nicht.

? Womit sollte das Maximum beginnen, bevor die Schleife startet?
- [ ] Immer mit 0
- [x] Mit dem ersten Wert des Arrays
- [ ] Mit der Länge des Arrays
> Beginnt es mit 0, wäre bei lauter negativen Zahlen 0 das Ergebnis, obwohl 0 gar nicht im Array steht.
:::
