---
titel: Verschachteln
bereich: Grundlagen
kurz: Verzweigungen in Schleifen und Schleifen in Schleifen kombinieren.
---

## Bausteine ineinander

Du kennst jetzt alle wichtigen Bausteine: Sequenz, Verzweigung, Fallauswahl und drei Arten von Schleifen. Richtig stark werden sie erst zusammen.

Jeder Zweig und jeder Schleifeninhalt ist selbst wieder eine Sequenz. Dort darfst du jedes Element einsetzen, auch weitere Verzweigungen und Schleifen. Das nennt man **Verschachteln**.

> Ziehe dazu ein Element einfach auf den Platzhalter ø im Inneren einer Schleife oder eines Zweigs.

## Verzweigung in der Schleife

Die Schleife geht alle Zahlen durch, die Verzweigung entscheidet bei jeder einzelnen Zahl, ob etwas passiert. So kannst du zum Beispiel zählen, wie viele gerade Zahlen es von 1 bis n gibt.

::: diagramm l13-gerade-zaehlen.visustruct
Bei jedem Durchlauf prüft die Verzweigung mit i % 2 == 0, ob i gerade ist. Nur dann wird anzahl um 1 erhöht. Der false-Zweig bleibt leer.
:::

Bei n = 7 sind das die Zahlen 2, 4 und 6, also wird 3 ausgegeben.

## Übung: Gerade Eingaben zählen

::: übung l13-gerade-eingaben
titel: Gerade Eingaben zählen
auftrag: Frage nacheinander genau **fünf** ganze Zahlen ab. Gib danach aus, wie viele davon gerade waren.
test: 1, 2, 3, 4, 5 -> 2
test: 2, 4, 6, 8, 10 -> 5
test: 1, 3, 5, 7, 9 -> 0
test: 10, 11, 0, 7, 8 -> 3
braucht: forSchleife, verzweigung
tipp: Fünfmal dasselbe tun heißt: Schleife. In jedem Durchlauf wird eine Zahl eingelesen und geprüft.
tipp: Eine For-Schleife von 1 bis 5. Im Inhalt steht zuerst die Eingabe `input: int zahl "Zahl eingeben"`, darunter eine Verzweigung mit `zahl % 2 == 0`. Im true-Zweig erhöhst du `anzahl` um 1.
lösung: l13-gerade-eingaben-loesung.visustruct
:::

## Schleife in der Schleife

Steht eine Schleife in einer anderen, läuft die **innere Schleife bei jedem Durchlauf der äußeren komplett durch**. Damit kannst du Muster aus Zeilen und Spalten bauen.

::: diagramm l13-dreieck.visustruct
Die äußere Schleife zählt die Zeilen. Die innere hängt so viele Sterne an den Text, wie die Zeilennummer angibt. Bei n = 3 entsteht ein Dreieck aus 1, 2 und 3 Sternen.
:::

Mit `String text = ""` beginnt jede Zeile leer. `text = text + "*"` hängt einen Stern an. Erst wenn die Zeile fertig ist, wird sie ausgegeben.

## Übung: Rechteck

::: übung l13-rechteck
titel: Rechteck
auftrag: Frage eine Breite und eine Höhe ab. Gib ein Rechteck aus `#` aus: so viele Zeilen wie die Höhe, und in jeder Zeile so viele `#` wie die Breite.
test: 3, 2 -> ### | ###
test: 1, 3 -> # | # | #
test: 4, 1 -> ####
test: 2, 2 -> ## | ##
braucht: forSchleife
tipp: Du brauchst zwei Schleifen ineinander: eine für die Zeilen und darin eine für die Zeichen einer Zeile.
tipp: Baue es wie das Dreieck. Der Unterschied: Die innere Schleife zählt immer bis `breite`, nicht bis zur Zeilennummer. Die äußere Schleife zählt bis `hoehe`.
lösung: l13-rechteck-loesung.visustruct
:::

## Den Überblick behalten

Bei verschachtelten Diagrammen hilft dir die Darstellung: Was weiter innen steht, ist eingerückt und von seiner Schleife oder seinem Zweig umschlossen.

- Lies von außen nach innen: Was wiederholt sich? Was wird bei jedem Durchlauf entschieden?
- Gib Zählvariablen sprechende Namen wie `zeile` und `spalte`. Zwei Schleifen dürfen nicht dieselbe Zählvariable verändern.
- Gehe ein Beispiel in der Simulation mit **Schritt** durch und beobachte die Variablen.

::: angeberwissen
Genau dafür wurde das Struktogramm erfunden. Shneiderman fragte sich: Wenn man auf GOTO verzichten soll, warum dann nicht gleich auf die Pfeile im Flussdiagramm? Ergebnis: kein Pfeil-Spaghetti, und jeder Block bleibt brav in seinem Gatter.
:::

## Jetzt in Java

Das Zählen der geraden Zahlen sieht in Java so aus:

```
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Bis zu welcher Zahl?");
int n = scanner.nextInt();
int anzahl = 0;
for (int i = 1; i <= n; i++) {
    if (i % 2 == 0) {
        anzahl++;
    }
}
System.out.println(anzahl);
```

Was im Struktogramm ineinander steckt, steht in Java in geschweiften Klammern ineinander. Jede Ebene ist vier Leerzeichen weiter eingerückt. Ist dein Code durcheinander, hilft der Knopf **Einrücken** oben im Bereich Programmieren.

`anzahl++` ist die Kurzform von `anzahl = anzahl + 1`.

::: übung l14-java-treppe
titel: Treppe aus Sternen
code: java
auftrag: Schreibe ein Java-Programm, das die Anzahl der Stufen einliest und eine Treppe aus Sternchen ausgibt. Bei 3 Stufen also `*`, `**` und `***`, jede Stufe in einer eigenen Zeile.
test: 3 -> * | ** | ***
test: 1 -> *
test: 4 -> * | ** | *** | ****
braucht: forSchleife
tipp: Eine äußere Schleife zählt die Stufen. In jeder Stufe baut eine innere Schleife einen Text aus Sternchen zusammen.
tipp: In der äußeren Schleife: `String zeile = "";`, dann `for (int j = 1; j <= i; j++) { zeile = zeile + "*"; }` und danach `System.out.println(zeile);`.
lösung: l14-java-treppe-loesung.visustruct
:::

## Lückentext: verschachteln

::: lückentext
titel: Rechteck aus Sternen
auftrag: Das Programm gibt ein Rechteck aus 3 Zeilen mit je 4 Sternchen aus. Ergänze die fehlenden Wörter und Zeichen.
```java
for (int zeile = 1; zeile <= 3; zeile++) {
    String text = [[""]];
    [[for]] (int spalte = 1; spalte [[<=]] 4; [[spalte++ | spalte += 1 | spalte = spalte + 1]]) {
        text = text [[+]] "*";
    }
    System.out.[[println]](text);
[[}]]
```
erklärung: Die innere Schleife baut eine Zeile aus 4 Sternchen, die äußere wiederholt das dreimal. Jede Zeile beginnt mit einem leeren Text `""`. Die letzte Klammer schließt die äußere Schleife.
:::

## Fehler finden: durch 3 teilbar

::: übung l14-java-fehler
titel: Zählen reparieren
code: java
auftrag: Das Programm soll zählen, wie viele Zahlen von 1 bis `n` durch 3 teilbar sind, und **einmal** das Ergebnis ausgeben. Bei 10 also nur **Anzahl: 3**. Es gibt aber viel zu viele Zeilen aus.
  „Im Editor öffnen“ zeigt den Code im Bereich Programmieren. Finde den Fehler, repariere ihn und klicke auf Prüfen.
start: l14-java-fehler-start.visustruct
test: 10 -> Anzahl: 3
test: 3 -> Anzahl: 1
test: 2 -> Anzahl: 0
braucht: forSchleife, verzweigung
tipp: Achte auf die geschweiften Klammern: Steht die Ausgabe in der Schleife oder dahinter?
tipp: Verschiebe die Zeile `System.out.println("Anzahl: " + anzahl);` hinter die schließende Klammer der Schleife.
lösung: l14-java-fehler-loesung.visustruct
:::

## Spiel: Innen und außen

::: spiel frage
titel: Spiel: Innen und außen
intro: Ludwig hat Bausteine ineinander gesteckt. Lies von außen nach innen und sag vorher, was passiert. Sechs Runden.

runde:
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 2; j++) {
            System.out.println("*");
        }
    }
frage: Wie viele Sterne werden ausgegeben?
- 3
- 5
- [x] 6
> Die innere Schleife läuft bei jedem der 3 Durchläufe der äußeren komplett durch: 3 · 2 = 6.

runde:
    for (int i = 1; i <= 2; i++) {
        for (int j = 1; j <= 3; j++) {
            System.out.println(i + " " + j);
        }
    }
frage: Welche Zeile wird als vierte ausgegeben?
- 1 4
- [x] 2 1
- 2 2
> Erst läuft j für i = 1 durch: 1 1, 1 2, 1 3. Danach beginnt j wieder bei 1, jetzt mit i = 2.

runde:
    int anzahl = 0;
    for (int i = 1; i <= 10; i++) {
        if (i % 3 == 0) {
            anzahl++;
        }
    }
    System.out.println(anzahl);
frage: Was wird ausgegeben?
- [x] 3
- 10
- 4
> Die Verzweigung zählt nur 3, 6 und 9 mit.

runde:
    for (int i = 1; i <= 4; i++) {
        if (i % 2 == 0) {
            System.out.println("gerade");
        } else {
            System.out.println(i);
        }
    }
frage: Was wird ausgegeben?
- 1\n2\n3\n4
- [x] 1\ngerade\n3\ngerade
- gerade\ngerade
> Bei jeder Zahl entscheidet die Verzweigung neu: ungerade Zahlen selbst, gerade als Wort.

runde:
    for (int i = 1; i <= 3; i++) {
        String zeile = "";
        for (int j = 1; j <= i; j++) {
            zeile = zeile + "*";
        }
        System.out.println(zeile);
    }
frage: Was wird ausgegeben?
- ***\n***\n***
- [x] *\n**\n***
- ***\n**\n*
> Die innere Schleife läuft bis i. Darum wird jede Zeile einen Stern länger.

runde:
    for (int i = 1; i <= 3; i++) {
        for (int i = 1; i <= 3; i++) {
            System.out.println(i);
        }
    }
frage: Was passiert?
- 1 bis 3 wird dreimal ausgegeben.
- 1 bis 3 wird einmal ausgegeben.
- [x] Java meldet einen Fehler.
> Zwei Schleifen ineinander brauchen zwei verschiedene Zählvariablen, zum Beispiel `zeile` und `spalte`.
:::

## Checkliste

::: checkliste
- Ich kann eine Verzweigung in eine Schleife setzen. → Verzweigung in der Schleife
- Ich kann eine Schleife in eine andere Schleife setzen. → Schleife in der Schleife
- Ich weiß, dass die innere Schleife bei jedem Durchlauf der äußeren komplett durchläuft. → Schleife in der Schleife
- Ich kann verschachtelte Schleifen und Verzweigungen in Java schreiben. → Jetzt in Java
:::

## Wissenstest

::: quiz
? Die äußere Schleife läuft 3-mal, die innere 4-mal. Wie oft wird der Inhalt der inneren Schleife insgesamt ausgeführt?
- [ ] 7-mal
- [x] 12-mal
- [ ] 4-mal
> Bei jedem der 3 äußeren Durchläufe läuft die innere Schleife 4-mal, also 3 · 4 = 12.

? Woran erkennst du, ob eine Zahl gerade ist?
- [ ] `zahl / 2 == 0`
- [x] `zahl % 2 == 0`
- [ ] `zahl == 2`
> % liefert den Rest beim Teilen. Bei geraden Zahlen ist der Rest beim Teilen durch 2 null.

? In einer For-Schleife steht eine Verzweigung. Wie oft wird die Bedingung der Verzweigung geprüft?
- [ ] Einmal
- [x] Einmal pro Durchlauf der Schleife
- [ ] Nur wenn sie wahr ist
> Die Verzweigung gehört zum Inhalt und kommt bei jedem Durchlauf dran.

? Woran erkennst du in Java, was zu einer Schleife gehört?
- [ ] An der Farbe
- [x] An den geschweiften Klammern und der Einrückung
- [ ] An den Semikolons
:::
