---
titel: Tabellen als CSV
bereich: Dateien
kurz: Eine Tabelle als CSV-Datei lesen, jede Zeile mit split zerlegen und mit den Zahlen rechnen.
---

## Eine Tabelle in einer Textdatei

Frau Ziege, die Lehrerin der Burgschule, hat die Noten ihrer Klasse als Tabelle gespeichert:

| Name | Mathe | Deutsch | Englisch |
|---|---|---|---|
| Ludwig | 2 | 3 | 1 |
| Zora | 1 | 2 | 2 |
| Fuchs | 4 | 3 | 5 |
| Hase | 2 | 1 | 3 |

In der Datei sieht die Tabelle so aus:

::: datei klasse.csv
Name;Mathe;Deutsch;Englisch
Ludwig;2;3;1
Zora;1;2;2
Fuchs;4;3;5
Hase;2;1;3
:::

Das ist eine **CSV-Datei**. CSV heißt „Comma-Separated Values“, also „durch Kommas getrennte Werte“. Jede Zeile ist eine Zeile der Tabelle, die Spalten sind durch ein Trennzeichen getrennt. In Deutschland nimmt man meist das **Semikolon** `;`, weil das Komma schon in Zahlen wie `2,5` steckt.

- Die erste Zeile ist die **Kopfzeile**. Sie sagt, was in den Spalten steht.
- Jede weitere Zeile ist ein **Datensatz**, hier eine Schülerin oder ein Schüler.
- Excel, LibreOffice und Numbers öffnen CSV-Dateien direkt als Tabelle.

## Eine Zeile zerlegen mit split

`split(";")` kennst du aus Lektion 17. Es zerlegt einen Text an jedem Semikolon und liefert ein Array:

```
String zeile = "Zora;1;2;2";
String[] teile = zeile.split(";");
// teile[0] ist "Zora", teile[1] ist "1", teile[2] ist "2", teile[3] ist "2"
```

Die Noten sind danach noch **Text**. Rechnen kannst du erst, wenn du sie mit `Integer.parseInt` in eine Zahl verwandelst:

```
int mathe = Integer.parseInt(teile[1]);
```

::: diagramm dt-csv.visustruct
Eine CSV-Zeile zerlegen und die Mathenote als Zahl lesen.
:::

## Die ganze Datei lesen

Für die ganze Datei kombinierst du den BufferedReader aus Lektion 24 mit `split`. Die Kopfzeile enthält keine Noten, deshalb liest du sie vor der Schleife und überspringst sie:

```
BufferedReader leser = new BufferedReader(new FileReader("klasse.csv"));
String zeile = leser.readLine();   // Kopfzeile
zeile = leser.readLine();          // erster Datensatz
while (zeile != null) {
    String[] teile = zeile.split(";");
    System.out.println(teile[0] + ": Mathe " + teile[1]);
    zeile = leser.readLine();
}
leser.close();
```

::: ludwig
Ohne das zweite `readLine()` vor der Schleife landet die Kopfzeile in der Schleife. Dann versucht `Integer.parseInt("Mathe")` aus dem Wort eine Zahl zu machen, und Java bricht mit einer `NumberFormatException` ab.
:::

## Übung: Notenschnitt in Mathe

::: übung l25-java-schnitt
titel: Notenschnitt in Mathe
code: java
auftrag: Berechne den Notenschnitt in Mathe. Überspringe die Kopfzeile, addiere die Mathenoten (Spalte 1) und teile durch die Anzahl der Datensätze. Gib **Schnitt Mathe:** und den Schnitt aus.
start: l25-java-schnitt-start.visustruct
test: - -> Schnitt Mathe: 2.25
braucht: whileSchleife
tipp: Lege vor der Schleife `double summe = 0;` und `int anzahl = 0;` an. Mit `double` wird beim Teilen nichts abgeschnitten.
tipp: In der Schleife: `String[] teile = zeile.split(";");`, dann `summe = summe + Integer.parseInt(teile[1]);` und `anzahl++;`.
lösung: l25-java-schnitt-loesung.visustruct
:::

## Übung: Beste Note in Englisch

::: übung l25-java-beste
titel: Beste Note in Englisch
code: java
auftrag: Wer hat die beste Note in Englisch (Spalte 3)? Gib **Beste Note in Englisch:**, den Namen und in Klammern die Note aus.
start: l25-java-beste-start.visustruct
test: - -> Beste Note in Englisch: Ludwig (1)
braucht: whileSchleife, verzweigung
tipp: Merke dir die bisher beste Note in `int besteNote = 7;` und den Namen in `String besterName = "";`. Jede echte Note ist besser als 7.
tipp: Ist `note < besteNote`, merkst du dir die neue Note und `teile[0]` als Namen.
lösung: l25-java-beste-loesung.visustruct
:::

## Stärken und Schwächen von CSV

| Gut | Schwierig |
|---|---|
| Tabellen brauchen wenig Platz. | Steht das Trennzeichen im Text, zum Beispiel `Hase;sehr gut; fleißig`, zerfällt die Zeile in zu viele Teile. |
| Excel und andere Programme öffnen die Datei direkt. | Alles ist eine flache Tabelle. Hat ein Tier mehrere Lieblingsessen, passt das nicht gut in eine Zelle. |
| Jedes Programm kann sie mit `split` lesen. | Die Datei sagt nicht, ob `1` eine Zahl oder ein Text ist. |

::: ludwig
Excel speichert CSV-Dateien in Deutschland mit Semikolon, in England und den USA mit Komma. Wer eine Datei aus dem Ausland öffnet, sieht deshalb manchmal alles in einer einzigen Spalte.
:::

## Spiel: Kaputte Zeile

::: spiel bombe
titel: Spiel: Kaputte Zeile
intro: In jeder CSV-Datei ist **genau eine Zeile kaputt**, und die Bombe tickt. Vergleiche jede Zeile mit der Kopfzeile und tippe auf die kaputte Zeile, bevor die Zeit abläuft. Fünf Runden, je 20 Sekunden.
zeit: 20
daten: csv

runde:
    Name;Mathe;Deutsch;Englisch
    Ludwig;2;3;1
    Zora;1
    Fuchs;4;3;5
frage: Jede Zeile braucht vier Spalten.
fehler: 3
besser: Zora;1;2;2
> Bei Zora fehlen zwei Noten. `teile[3]` gibt es dann nicht, und Java bricht mit einer `ArrayIndexOutOfBoundsException` ab.

runde:
    Name;Note;Bemerkung
    Ludwig;2;arbeitet gut mit
    Hase;1;sehr gut; fleißig
    Zora;1;liest viel
frage: Jede Zeile braucht drei Spalten.
fehler: 3
besser: Hase;1;sehr gut, fleißig
> Das Semikolon in der Bemerkung trennt eine vierte Spalte ab. Im Text darf das Trennzeichen nicht vorkommen.

runde:
    Name;Mathe;Deutsch;Englisch
    Ludwig;2;3;1
    Zora;1;2;2
    Fuchs,4,3,5
frage: Getrennt wird mit Semikolon.
fehler: 4
besser: Fuchs;4;3;5
> Hier stehen Kommas statt Semikolons. `split(";")` findet kein Semikolon und liefert die ganze Zeile als ein einziges Teil.

runde:
    Name;Mathe;Deutsch;Englisch
    Hase;2;1;3
    Fuchs;vier;3;5
    Ludwig;2;3;1
frage: Noten sind Zahlen.
fehler: 3
besser: Fuchs;4;3;5
> `Integer.parseInt("vier")` kann aus dem Wort keine Zahl machen und wirft eine `NumberFormatException`.

runde:
    Name;Mathe;Deutsch;Englisch
    Zora;1;2;2
    Hase;2;1;3
    Ludwig;2;;1
frage: Kein Feld darf leer sein.
fehler: 4
besser: Ludwig;2;3;1
> Zwischen den beiden Semikolons steht nichts. `Integer.parseInt("")` wirft eine `NumberFormatException`.
:::

## Checkliste

::: checkliste
- Ich weiß, wie eine CSV-Datei aufgebaut ist: Kopfzeile, Datensätze, Trennzeichen. → Eine Tabelle in einer Textdatei
- Ich kann eine Zeile mit split zerlegen und mit Integer.parseInt eine Zahl daraus machen. → Eine Zeile zerlegen mit split
- Ich überspringe die Kopfzeile, bevor ich rechne. → Die ganze Datei lesen
- Ich habe den Notenschnitt in Mathe berechnet. → Übung: Notenschnitt in Mathe
- Ich habe die beste Englischnote gefunden. → Übung: Beste Note in Englisch
- Ich kenne eine Stärke und eine Schwäche von CSV. → Stärken und Schwächen von CSV
:::

## Wissenstest

::: quiz
? Was liefert "Hase;2;1;3".split(";")[2]?
- [ ] "2"
- [x] "1"
- [ ] 1
> Die Zählung beginnt bei 0. Und das Ergebnis ist ein Text, keine Zahl.

? Warum liest das Programm vor der Schleife zweimal readLine()?
- [ ] Damit die Datei schneller gelesen wird.
- [x] Die erste Zeile ist die Kopfzeile ohne Noten. Sie wird übersprungen.
- [ ] Weil readLine immer zwei Zeilen braucht.

? Was passiert bei Integer.parseInt("Mathe")?
- [ ] Es liefert 0.
- [x] Java wirft eine NumberFormatException.
- [ ] Es liefert die Länge des Wortes.

? Ordne zu.
= Kopfzeile -> sagt, was in den Spalten steht
= Datensatz -> eine Zeile mit Werten
= Trennzeichen -> trennt die Spalten, meist ;
:::
