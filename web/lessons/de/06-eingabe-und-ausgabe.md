---
titel: Eingabe und Ausgabe
bereich: Grundlagen
kurz: Werte abfragen, Ergebnisse anzeigen und das EVA-Prinzip anwenden.
---

## Das EVA-Prinzip

Viele Programme arbeiten in drei Teilen:

1. **Eingabe:** Das Programm fragt Werte ab, z. B. zwei Zahlen.
2. **Verarbeitung:** Es rechnet mit den Werten.
3. **Ausgabe:** Es zeigt das Ergebnis an.

Die Anfangsbuchstaben ergeben **EVA**. Bisher standen die Werte fest im Struktogramm. Mit einer Eingabe kann bei jedem Durchlauf ein anderer Wert verwendet werden.

::: diagramm l06-eva.visustruct
Oben die Eingabe, in der Mitte die Verarbeitung, unten die Ausgabe. Starte die Simulation und probiere verschiedene Zahlen aus.
:::

## Eingabe mit input:

Eine Eingabe fragt beim Ausführen einen Wert ab und speichert ihn in einer Variablen. Du schreibst den **Datentyp**, den **Namen** und eine **Frage** in Anführungszeichen:

```
input: int alter "Wie alt bist du?"
input: double preis "Preis in Euro?"
input: String name "Wie heißt du?"
```

Im Editor wählst du bei einer Anweisung oben die Art **Eingabe**. Das Wort `input:` steht dann schon davor, und du tippst nur noch `int alter "Wie alt bist du?"`.

> Der Datentyp entscheidet, was eingegeben werden darf. Bei `int` meldet die Simulation einen Fehler, wenn jemand 2.5 oder Hallo eintippt.

## Ausgabe mit output:

Eine Ausgabe zeigt Text und Werte an. Text steht in Anführungszeichen, Variablen ohne. Mit `+` hängst du die Teile **aneinander**:

```
output: "Hallo " + name + "!"
output: "Du bist " + alter + " Jahre alt."
```

Achte auf die Leerzeichen innerhalb der Anführungszeichen. Ohne sie klebt alles zusammen, und du siehst `HalloMia!` statt `Hallo Mia!`.

## Übung: Begrüßung

::: übung l06-begruessung
titel: Begrüßung
auftrag: Frage nach dem Namen und begrüße die Person. Bei der Eingabe Ada soll **Hallo Ada!** ausgegeben werden.
test: Ada -> Hallo Ada!
test: Ben -> Hallo Ben!
braucht: anweisung
tipp: Zuerst kommt eine Eingabe für den Namen, danach eine Ausgabe, die den Namen benutzt.
tipp: Der Name ist Text, die Eingabe braucht also den Typ `String`. In der Ausgabe verbindest du `"Hallo "`, die Variable und `"!"` mit `+`.
lösung: l06-begruessung-loesung.visustruct
:::

## Vorsicht mit + in der Ausgabe

In einer Ausgabe hängt `+` die Teile **immer** aneinander, auch bei Zahlen. Sind `a` gleich 3 und `b` gleich 4, dann zeigt

```
output: a + b
```

nicht 7, sondern **34**. Rechne deshalb vorher in einer Variablen und gib dann die Variable aus:

```
int summe = a + b
output: "Summe: " + summe
```

Das passt auch zum EVA-Prinzip: Gerechnet wird in der Verarbeitung, nicht in der Ausgabe.

## Vom Aufgabentext zum Struktogramm

Bevor du den ersten Kasten ziehst, liest du die Aufgabe genau und zerlegst sie. Das nennt man **Problemanalyse**. Drei Fragen helfen dir dabei:

1. **Was ist gegeben?** Diese Werte werden zur **Eingabe**. Überlege auch den Datentyp.
2. **Was ist gesucht?** Das wird zur **Ausgabe**.
3. **Wie kommt man vom Gegebenen zum Gesuchten?** Das ist die **Verarbeitung**, oft eine Formel.

Ein Beispiel: *Eine Kinokarte kostet 9 €. Das Programm fragt, wie viele Karten jemand kauft, und zeigt den Gesamtpreis an.*

- Gegeben: die Anzahl der Karten → `input: int anzahl "Wie viele Karten?"`
- Gesucht: der Gesamtpreis → `output: "Gesamtpreis: " + gesamt`
- Weg: Anzahl mal 9 → `int gesamt = anzahl * 9`

Jetzt musst du die drei Teile nur noch in der Reihenfolge E, V, A untereinander setzen.

> Achte im Aufgabentext auf Signalwörter: *fragt*, *liest ein* oder *gibt ein* deuten auf eine Eingabe. *Zeigt*, *gibt aus* oder *meldet* deuten auf eine Ausgabe.

## Übung: Rechner

::: übung l06-rechner
titel: Summe und Produkt
auftrag: Frage zwei ganze Zahlen ab. Gib danach ihre Summe und ihr Produkt aus, jeweils in einer eigenen Zeile.
Bei 3 und 4 sieht das so aus: `Summe: 7` und `Produkt: 12`.
test: 3, 4 -> Summe: 7 | Produkt: 12
test: 10, -2 -> Summe: 8 | Produkt: -20
test: 0, 5 -> Summe: 5 | Produkt: 0
braucht: anweisung
tipp: Plane die Reihenfolge: erst beide Zahlen einlesen, dann rechnen, dann ausgeben.
tipp: Du brauchst zwei Eingaben, zwei Anweisungen zum Rechnen und zwei Ausgaben. Rechne die Summe in einer eigenen Variablen, sonst hängt `+` die Zahlen aneinander.
lösung: l06-rechner-loesung.visustruct
:::

## Übung: Mittelwert

::: übung l06-mittelwert
titel: Mittelwert
auftrag: Frage zwei Zahlen ab, die auch Kommazahlen sein dürfen. Gib ihren Mittelwert aus, bei 2 und 3 also `Mittelwert: 2.5`.
test: 2, 3 -> Mittelwert: 2.5
test: 4, 6 -> Mittelwert: 5.0
test: 1.5, 2 -> Mittelwert: 1.75
braucht: anweisung
tipp: Den Mittelwert zweier Zahlen bekommst du, wenn du sie addierst und das Ergebnis halbierst.
tipp: Für Kommazahlen nimmst du den Typ `double`. Der Mittelwert ist die Summe geteilt durch 2. Denk an die Klammern: `(x + y) / 2`.
lösung: l06-mittelwert-loesung.visustruct
:::

## Jetzt in Java

So sieht das EVA-Beispiel vom Anfang in Java aus:

```
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Erste Zahl?");
int a = scanner.nextInt();
System.out.println("Zweite Zahl?");
int b = scanner.nextInt();
int summe = a + b;
System.out.println("Summe: " + summe);
```

- Für Eingaben braucht Java einen **Scanner**. Die ersten beiden Zeilen schreibst du einmal ganz oben, dann kannst du beliebig oft einlesen.
- `scanner.nextInt()` liest eine ganze Zahl, `scanner.nextDouble()` eine Kommazahl und `scanner.next()` ein Wort.
- Die Frage an den Benutzer ist eine normale Ausgabe direkt davor. VisuStruct macht aus beiden Zeilen zusammen einen Eingabe-Kasten.

::: angeberwissen
Java sollte ursprünglich kleine Geräte steuern, und das tut es heute noch: Auf vielen SIM-Karten im Handy und auf Bankkarten läuft eine Mini-Version namens **Java Card**. Gut möglich, dass du gerade Java in der Hosentasche hast.
:::

::: übung l06-java-tage
titel: Alter in Tagen
code: java
auftrag: Schreibe ein Java-Programm, das nach dem Alter in Jahren fragt und ausgibt, wie viele Tage das ungefähr sind. Rechne mit 365 Tagen pro Jahr. Bei 2 Jahren erscheint **Das sind etwa 730 Tage.**
test: 2 -> Das sind etwa 730 Tage.
test: 10 -> Das sind etwa 3650 Tage.
test: 1 -> Das sind etwa 365 Tage.
braucht: anweisung
tipp: Erst die beiden Scanner-Zeilen, dann Frage und Eingabe, dann rechnen, dann ausgeben.
tipp: `int jahre = scanner.nextInt();` liest ein. `int tage = jahre * 365;` rechnet, und `System.out.println("Das sind etwa " + tage + " Tage.");` gibt aus.
lösung: l06-java-tage-loesung.visustruct
:::

## Spiel: Was wird ausgegeben?

::: spiel frage
titel: Spiel: Was wird ausgegeben?
intro: Ludwig hat Ein- und Ausgaben gebaut. Sag vorher, was passiert. Sieben Runden.

runde:
    int a = 3
    int b = 4
    output: a + b
frage: Was wird ausgegeben?
- 7
- [x] 34
- a + b
> In einer Ausgabe hängt `+` die Teile immer aneinander, auch bei Zahlen.

runde:
    int a = 3
    int b = 4
    int summe = a + b
    output: "Summe: " + summe
frage: Was wird ausgegeben?
- [x] Summe: 7
- Summe: 34
- Summe: summe
> Gerechnet wird vorher in einer Variablen. Die Ausgabe hängt nur noch Text und Ergebnis aneinander.

runde:
    input: String name "Wie heißt du?"
    output: "Hallo" + name + "!"
frage: Du tippst Mia. Was wird ausgegeben?
- Hallo Mia!
- [x] HalloMia!
- Hallo name!
> Im Text `"Hallo"` fehlt das Leerzeichen am Ende. Darum klebt alles zusammen.

runde:
    input: int alter "Wie alt bist du?"
frage: Du tippst 2.5. Was passiert?
- alter ist 2.
- alter ist 2.5.
- [x] Die Simulation meldet einen Fehler.
> Der Datentyp `int` erlaubt nur ganze Zahlen.

runde:
    input: double preis "Preis in Euro?"
frage: Zu welchem Teil von EVA gehört dieser Kasten?
- [x] Eingabe
- Verarbeitung
- Ausgabe
> `input:` fragt einen Wert ab. Das ist die Eingabe.

runde:
    double mittel = (a + b) / 2.0
frage: Zu welchem Teil von EVA gehört dieser Kasten?
- Eingabe
- [x] Verarbeitung
- Ausgabe
> Hier wird gerechnet. Das ist die Verarbeitung.

runde:
    output: "Mittelwert: " + mittel
frage: Zu welchem Teil von EVA gehört dieser Kasten?
- Eingabe
- Verarbeitung
- [x] Ausgabe
> `output:` zeigt das Ergebnis an. Das ist die Ausgabe.
:::

## Checkliste

::: checkliste
- Ich kann das EVA-Prinzip erklären. → Das EVA-Prinzip
- Ich kann eine Eingabe mit Datentyp, Namen und Frage schreiben. → Eingabe mit input:
- Ich kann Text und Variablen in einer Ausgabe mit + verbinden. → Vorsicht mit + in der Ausgabe
- Ich rechne vor der Ausgabe in einer Variablen. → Vorsicht mit + in der Ausgabe
- Ich kann aus einem Aufgabentext Eingabe, Verarbeitung und Ausgabe herauslesen. → Vom Aufgabentext zum Struktogramm
- Ich kann in Java mit dem Scanner Zahlen einlesen. → Jetzt in Java
:::

## Wissenstest

::: quiz
? Wofür steht EVA?
- [x] Eingabe, Verarbeitung, Ausgabe
- [ ] Eingabe, Variable, Anweisung
- [ ] Erst Variablen anlegen
> Viele Programme fragen erst Werte ab, verarbeiten sie und zeigen dann das Ergebnis.

? Die Variablen a und b haben die Werte 3 und 4. Was zeigt `output: a + b`?
- [ ] 7
- [x] 34
- [ ] a + b
> In der Ausgabe hängt + die Teile aneinander. Rechne die Summe vorher in einer Variablen aus.

? Welche Eingabe passt, wenn ein Preis wie 4.99 eingegeben werden soll?
- [ ] input: int preis "Preis?"
- [x] input: double preis "Preis?"
- [ ] input: String "Preis?"
> 4.99 ist eine Kommazahl, also double. Außerdem braucht jede Eingabe einen Variablennamen.

? Was zeigt `output: "Alter: " + alter`, wenn alter den Wert 12 hat?
- [x] Alter: 12
- [ ] "Alter: " + 12
- [ ] Alter: alter

? Aufgabe: *Das Programm fragt nach dem Radius eines Kreises und zeigt seinen Umfang an.* Ordne jedem Teil des Textes zu, wohin er im EVA-Prinzip gehört.
= fragt nach dem Radius -> Eingabe
= Umfang = 2 * 3.14 * Radius -> Verarbeitung
= zeigt seinen Umfang an -> Ausgabe
> Gegeben ist der Radius, gesucht der Umfang. Die Formel verbindet beides.

? Was liest `scanner.nextInt()` ein?
- [x] Eine ganze Zahl
- [ ] Eine Kommazahl
- [ ] Einen ganzen Satz
> Für Kommazahlen gibt es `scanner.nextDouble()`, für ein Wort `scanner.next()`.
:::
