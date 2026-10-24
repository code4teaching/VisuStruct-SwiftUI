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

::: grafik l14-array.svg
Fünf Fächer mit den Indizes 0 bis 4. Der Index steht über dem Fach, der Wert darin.
:::

**Warum beginnt man bei 0?** In der Informatik ist der Index kein „wievieltes Fach“, sondern der **Abstand vom Anfang**. Das erste Fach liegt direkt am Anfang, also 0 Schritte entfernt. Das zweite liegt 1 Schritt entfernt, das dritte 2 Schritte. Du kennst das aus dem Aufzug: Das Erdgeschoss ist die **0**, der erste Stock liegt eine Etage darüber.

Daraus folgt eine Regel, die du dir merken solltest: Bei 5 Fächern ist der **letzte Index 4**, also immer eins weniger als die Anzahl.

::: angeberwissen
Dass ab 0 gezählt wird, ist ziemlich alt. Schon die Programmiersprache C von 1972 rechnet so: Der Computer kennt die Adresse des ersten Fachs und rechnet für `zahlen[i]` einfach „Anfang plus i Fächer weiter“. Bei i = 0 bleibt er am Anfang stehen, das spart eine Rechnung. Java, Python und JavaScript haben das übernommen. Ich zähle meine Hörner übrigens auch ab 0: Horn 0 links, Horn 1 rechts.
:::

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
tipp: Gezählt wird ab 0. Das erste Fach hat also den Index 0. Und wie heißt der Index des letzten Fachs?
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
tipp: Du brauchst zwei Schleifen: eine zum Einlesen von vorn nach hinten und eine zum Ausgeben von hinten nach vorn.
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
tipp: Gehe das Array mit einer Schleife durch. Zähle jeden Wert zur Summe und merke dir den größten bisher gesehenen Wert.
tipp: Rechne Summe und Maximum in eigenen Variablen aus und gib sie erst am Ende aus, z. B. mit `output: "Summe: " + summe`. Beginnt dein Maximum bei 0, scheitert der dritte Test.
lösung: l14-summe-max-loesung.visustruct
:::

## Jetzt in Java

Das Durchlaufen eines Arrays sieht in Java so aus:

```
int[] zahlen = {2, 4, 6, 8, 10};
for (int i = 0; i < zahlen.length; i++) {
    System.out.println(zahlen[i]);
}
```

- `int[]` heißt „Array aus ganzen Zahlen“. Die Werte stehen in geschweiften Klammern.
- Ein leeres Array mit 5 Fächern legst du mit `new int[5]` an.
- `zahlen[i]` ist das Fach mit dem Index `i`, `zahlen.length` die Länge.

::: übung l15-java-noten
titel: Notensumme in Java
code: java
auftrag: Lege in Java das Array `noten` mit den Werten 2, 3, 1 und 4 an. Zähle alle Noten mit einer For-Schleife zusammen und gib **Summe: 10** aus.
test: - -> Summe: 10
braucht: forSchleife
tipp: Lege vor der Schleife `int summe = 0;` an. Die Schleife läuft von 0 bis `noten.length - 1`.
tipp: `int[] noten = {2, 3, 1, 4};`, dann `for (int i = 0; i < noten.length; i++) { summe = summe + noten[i]; }` und zum Schluss `System.out.println("Summe: " + summe);`.
lösung: l15-java-noten-loesung.visustruct
:::

## Lückentext: Arrays

::: lückentext
titel: Das Maximum suchen
auftrag: Das Programm sucht den größten Wert im Array. Ergänze die fehlenden Wörter und Zeichen.
```java
[[int]][] werte = {3, 7, 1, 9, 4};
int max = werte[0];
[[for]] (int i = 1; i < werte.[[length]]; i++) {
    if (werte[i] [[>]] max) {
        max = werte[i];
    }
}
System.out.println("Maximum: " + max);
```
erklärung: `int[]` ist ein Array aus ganzen Zahlen, `werte.length` seine Länge. `max` beginnt mit dem ersten Wert, die Schleife vergleicht alle weiteren damit. Ausgabe: **Maximum: 9**
:::

## Fehler finden: Temperaturen

::: übung l15-java-fehler
titel: Höchste Temperatur reparieren
code: java
auftrag: Im Januar wurden die Temperaturen -5, -2, -8 und -3 Grad gemessen. Das Programm soll die höchste ausgeben, also **Höchste Temperatur: -2**. Es behauptet aber 0 Grad, obwohl es so warm nie war.
  „Im Editor öffnen“ zeigt den Code im Bereich Programmieren. Finde den Fehler, repariere ihn und klicke auf Prüfen.
start: l15-java-fehler-start.visustruct
test: - -> Höchste Temperatur: -2
braucht: forSchleife, verzweigung
tipp: Mit welchem Wert beginnt `max`? Ist irgendeine der Temperaturen größer als dieser Startwert?
tipp: `max` muss mit einem Wert aus dem Array beginnen: `int max = temperaturen[0];`
lösung: l15-java-fehler-loesung.visustruct
:::

## Spiel: Bombe entschärfen

::: spiel bombe
titel: Spiel: Bombe entschärfen
intro: In jedem Programm steckt **genau ein Fehler** rund um Arrays, und die Bombe tickt. Tippe auf die falsche Zeile, bevor die Zeit abläuft. Sechs Runden, je 30 Sekunden.
zeit: 30

runde:
    int[] zahlen = {2, 4, 6, 8, 10};
    for (int i = 0; i <= zahlen.length; i++) {
        System.out.println(zahlen[i]);
    }
frage: Soll alle fünf Werte ausgeben.
fehler: 2
besser: for (int i = 0; i < zahlen.length; i++) {
> Mit `<=` läuft i bis 5. Das Fach `zahlen[5]` gibt es nicht.

runde:
    String[] namen = {"Ada", "Ben", "Cem"};
    System.out.println(namen[1]);
frage: Soll den ersten Namen ausgeben, also Ada.
fehler: 2
besser: System.out.println(namen[0]);
> Gezählt wird ab 0. `namen[1]` ist schon Ben.

runde:
    int[] zahlen = {2, 4, 6, 8, 10};
    System.out.println(zahlen[zahlen.length]);
frage: Soll den letzten Wert ausgeben, also 10.
fehler: 2
besser: System.out.println(zahlen[zahlen.length - 1]);
> Der letzte Index ist immer eins weniger als die Länge.

runde:
    int[] punkte = {3, 9, 2};
    int summe = 0;
    for (int i = 0; i < punkte.length; i++) {
        summe = punkte[i];
    }
    System.out.println(summe);
frage: Soll die Summe 14 ausgeben.
fehler: 4
besser: summe = summe + punkte[i];
> So überschreibt jeder Wert den vorigen, am Ende steht nur 2 in summe.

runde:
    int[] punkte = {-5, -2, -9};
    int max = 0;
    for (int i = 0; i < punkte.length; i++) {
        if (punkte[i] > max) {
            max = punkte[i];
        }
    }
    System.out.println(max);
frage: Soll das Maximum -2 ausgeben.
fehler: 2
besser: int max = punkte[0];
> Keine der Zahlen ist größer als 0, also bliebe max bei 0. Das Maximum beginnt deshalb mit dem ersten Fach.

runde:
    int[] zahlen = {2, 4, 6, 8, 10};
    for (int i = zahlen.length; i >= 0; i--) {
        System.out.println(zahlen[i]);
    }
frage: Soll die Werte rückwärts ausgeben, von 10 bis 2.
fehler: 2
besser: for (int i = zahlen.length - 1; i >= 0; i--) {
> Rückwärts beginnt man beim letzten Index, und der ist `zahlen.length - 1`.
:::

## Checkliste

::: checkliste
- Ich kann ein Array mit Werten oder mit `new int[5]` anlegen. → Viele Werte unter einem Namen
- Ich weiß, dass der Index bei 0 beginnt und der letzte Index `length - 1` ist. → Der Index beginnt bei 0
- Ich kann ein Array mit einer For-Schleife durchlaufen und füllen. → Ein Array mit der Schleife durchlaufen
- Ich kann die Summe und das Maximum eines Arrays berechnen. → Summe und Maximum
- Ich kann in Java ein Array anlegen und mit einer Schleife durchlaufen. → Jetzt in Java
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

? Welches deutsche Wort wird oft für Array benutzt?
- [ ] Zweig
- [x] Feld
- [ ] Fall
> Ein Array heißt auf Deutsch oft Feld. Gemeint ist dasselbe: viele Fächer unter einem Namen.

? Welche Zeile legt in Java ein Array mit drei Zahlen an?
- [x] int[] zahlen = {1, 2, 3};
- [ ] int zahlen = [1, 2, 3];
- [ ] array zahlen = (1, 2, 3);
:::
