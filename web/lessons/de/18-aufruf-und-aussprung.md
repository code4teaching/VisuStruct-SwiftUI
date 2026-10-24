---
titel: Aufruf und Aussprung
bereich: Grundlagen
kurz: Große Aufgaben in Unterprogramme zerlegen und Schleifen vorzeitig verlassen.
---

## Große Aufgaben zerlegen

Lange Struktogramme werden schnell unübersichtlich. Deshalb zerlegst du eine große Aufgabe in **Teilprobleme**. Jedes Teilproblem bekommt einen eigenen Namen und ein eigenes Struktogramm, ein **Unterprogramm**.

Ein Quiz besteht zum Beispiel aus drei Teilen: begrüßen, Fragen stellen, Ergebnis zeigen. Das Hauptprogramm nennt nur noch diese drei Teile:

::: diagramm l15-hauptprogramm.visustruct
Das Hauptprogramm besteht nur aus drei Aufrufen. Was in jedem Teil passiert, steht in einem eigenen Struktogramm.
:::

So siehst du auf einen Blick, wie das Programm aufgebaut ist. Die Einzelheiten stehen woanders.

## Der Aufruf

Ein **Aufruf** ist ein Kasten mit doppelten senkrechten Linien links und rechts. Er bedeutet: Führe hier das Unterprogramm mit diesem Namen aus und mache danach weiter.

- Du ziehst **Aufruf** aus dem Bereich Elemente und schreibst den Namen hinein, z. B. `zeigeBegruessung()`.
- Die runden Klammern am Ende zeigen, dass es ein Unterprogramm ist. So schreibt man es auch in Java, Python und JavaScript.
- Das Unterprogramm selbst baust du als eigenes Struktogramm in einem neuen Reiter. Als Titel trägst du denselben Namen ein.

::: diagramm l15-unterprogramm.visustruct
Das Unterprogramm zeigeBegruessung() als eigenes Struktogramm.
:::

> **In der Simulation:** Erreicht die Simulation einen Aufruf, sucht sie unter den offenen Reitern das Struktogramm mit diesem Titel und führt es aus. Danach macht sie im Hauptprogramm weiter. Solange das Unterprogramm läuft, bleibt der Aufruf-Kasten markiert. Ein Unterprogramm wie dieses, nur mit Namen als Titel, teilt sich die Variablen mit dem Hauptprogramm. Wie ein Unterprogramm eigene Variablen bekommt, lernst du gleich. Gibt es keinen passenden Reiter, überspringt die Simulation den Aufruf und zeigt einen Hinweis.

::: angeberwissen
Warum sagt dein Lehrer bei Java immer „Methode“ und nie „Funktion“ oder „Prozedur“? Weil in Java jedes Unterprogramm zu einer Klasse gehören muss, und Unterprogramme einer Klasse heißen Methoden. Den Unterschied gibt es trotzdem: Liefert eine Methode ein Ergebnis zurück, ist sie eigentlich eine Funktion. Steht `void` davor, liefert sie nichts und ist eigentlich eine Prozedur. Java ist da einfach bequem und nennt beide Methode. Ich auch: Meine Methode heißt Fressen.
:::

## Übung: Aufruf einbauen

::: übung l15-titel
titel: Begrüßung mit Aufruf
auftrag: Stell dir vor, das Unterprogramm `zeigeTitel()` gibt es schon. Baue das Hauptprogramm: Es ruft zuerst `zeigeTitel()` auf. Danach fragt es nach dem Namen und gibt **Hallo** und den Namen aus.
  Bei der Eingabe Ada erscheint also **Hallo Ada**.
test: Ada -> Hallo Ada
test: Ben -> Hallo Ben
braucht: aufruf
tipp: Das Hauptprogramm hat drei Teile: den Aufruf, die Eingabe und die Ausgabe.
tipp: Ziehe einen Aufruf aus dem Bereich Elemente ganz nach oben und schreibe `zeigeTitel()` hinein. Darunter kommen die Eingabe `input: String name "Wie heißt du?"` und die Ausgabe.
lösung: l15-titel-loesung.visustruct
:::

## Werte übergeben: Parameter

Oft soll ein Unterprogramm mit Werten arbeiten, die erst beim Aufruf feststehen. Dann bekommt es als Titel eine **Kopfzeile**:

```
void zeigeSumme(int a, int b)
```

- `void` heißt: Das Unterprogramm liefert kein Ergebnis zurück.
- `zeigeSumme` ist der Name.
- In den Klammern stehen die **Parameter**: Variablen mit Datentyp, die beim Aufruf ihre Werte bekommen. Mehrere trennst du mit Komma.

::: diagramm l15-zeige-summe.visustruct
Das Unterprogramm mit der Kopfzeile als Titel. Es rechnet mit a und b, als wären es normale Variablen.
:::

Im Aufruf-Kasten schreibst du die Werte in die Klammern, z. B. `zeigeSumme(3, 4)`. Der erste Wert kommt in `a`, der zweite in `b`. Statt Zahlen gehen auch Variablen und Rechnungen wie `zeigeSumme(x, x + 1)`.

::: diagramm l15-zeige-summe-haupt.visustruct
Das Hauptprogramm ruft zeigeSumme zweimal mit anderen Werten auf. Öffne beide Diagramme und starte hier die Simulation.
:::

> **Lokale Variablen:** Die Parameter und alle Variablen, die im Unterprogramm entstehen, gehören nur dem Unterprogramm. Es bekommt **Kopien** der Werte, mehr dazu weiter unten bei der Wertübergabe (call by value). In der Simulation siehst du während des Aufrufs nur die Variablen des Unterprogramms.

## Ergebnis zurückgeben: return

Ein Unterprogramm kann auch ein Ergebnis liefern, den **Rückgabewert**. Dann steht in der Kopfzeile statt `void` der Datentyp des Ergebnisses:

```
int quadrat(int x)
```

Die Anweisung `return ergebnis` gibt den Wert zurück und beendet das Unterprogramm sofort. Beim Aufruf speicherst du das Ergebnis in einer Variablen: Nach `int q = quadrat(5)` steht in `q` der Wert 25.

::: diagramm l15-quadrat.visustruct
Das Unterprogramm quadrat rechnet und gibt das Ergebnis mit return zurück.
:::

::: diagramm l15-quadrat-haupt.visustruct
Das Hauptprogramm speichert den Rückgabewert in q. Öffne beide Diagramme und probiere die Simulation aus.
:::

> Ein Unterprogramm mit Rückgabewert muss mit `return` enden. Fehlt das return, meldet die Simulation einen Fehler.

In der **Code-Ansicht** wird aus der Kopfzeile eine Java-Methode (`public static int quadrat(int x)`), in Python ein `def` und in JavaScript eine `function`. Sind die Unterprogramme in anderen Reitern offen, stehen sie beim Hauptprogramm mit im Code.

## Übung: Fläche berechnen

::: übung l15-flaeche
titel: Fläche berechnen
auftrag: Baue zwei Diagramme. Das Unterprogramm `int flaeche(int a, int b)` gibt die Fläche eines Rechtecks zurück, also a mal b. Das Hauptprogramm fragt nach Länge und Breite, ruft `flaeche` auf und gibt **Fläche:** und das Ergebnis aus.
  Bei 3 und 4 erscheint **Fläche: 12**.
test: 3, 4 -> Fläche: 12
test: 5, 5 -> Fläche: 25
test: 7, 0 -> Fläche: 0
braucht: aufruf
tipp: Du baust zwei Diagramme: ein Unterprogramm, das nur rechnet und das Ergebnis zurückgibt, und ein Hauptprogramm für Eingabe und Ausgabe.
tipp: Lege mit **+** einen neuen Reiter an und gib ihm den Titel `int flaeche(int a, int b)`. Darin reicht eine Anweisung: `return a * b`. Im Hauptprogramm schreibst du in den Aufruf-Kasten `int f = flaeche(laenge, breite)`.
lösung: l15-flaeche-loesung.visustruct
unterprogramm: l15-flaeche-unterprogramm-loesung.visustruct
:::

## Kopie oder Original: call by value und call by reference

Was passiert, wenn ein Unterprogramm seinen Parameter verändert? Das hängt davon ab, **was** übergeben wird.

**Wertübergabe**, englisch **call by value**: Bei `int`, `double`, `boolean`, `char` und `String` bekommt das Unterprogramm eine **Kopie** des Werts. Ändert es seinen Parameter, bleibt die Variable des Aufrufers, wie sie war.

**Referenzübergabe**, englisch **call by reference**: Bei einem **Array** bekommt das Unterprogramm keine Kopie, sondern einen Verweis auf dasselbe Array. Ändert es ein Fach, ist das Fach auch beim Aufrufer geändert. Die Kopfzeile dafür sieht so aus:

```
void leeren(boolean[] plaetze)
```

::: grafik uebergabe.svg
Oben bekommt verdopple eine Kopie von zahl. Unten zeigen reihe und plaetze auf dasselbe Array.
:::

Probiere beides aus. Öffne die drei Diagramme und starte im Hauptprogramm die Simulation:

::: diagramm uebergabe-verdopple.visustruct
verdopple ändert nur seine Kopie x.
:::

::: diagramm uebergabe-leeren.visustruct
leeren setzt alle Plätze auf false, zum Beispiel wenn eine Vorstellung ausfällt.
:::

::: diagramm uebergabe-haupt.visustruct
zahl ist nach dem Aufruf immer noch 5. Die Plätze in reihe sind nach dem Aufruf dagegen frei.
:::

> Willst du mit einer Zahl aus einem Unterprogramm etwas zurückbekommen, nimmst du `return`, z. B. `zahl = verdopple(zahl)` mit der Kopfzeile `int verdopple(int x)`. Ein Array dagegen kann das Unterprogramm direkt verändern.

::: angeberwissen
Ganz genau genommen kennt Java nur die Wertübergabe, also call by value. Bei einem Array wird aber nicht das ganze Array kopiert, sondern nur seine **Adresse** im Speicher. Mit der kopierten Adresse findet das Unterprogramm dasselbe Array. Das ist so, als würde ich dir eine Kopie meines Schließfachschlüssels geben: Der Schlüssel ist kopiert, das Heu im Fach gibt es nur einmal.
:::

## Übung: Bonuspunkte

::: übung uebergabe-bonus
titel: Bonuspunkte
auftrag: Das Hauptprogramm ruft `bonus(punkte)` auf und gibt danach alle Punkte aus. Baue das Unterprogramm `void bonus(int[] punkte)`, das jede Punktzahl im Array um 1 erhöht. Statt 3, 5 und 8 erscheinen dann **4**, **6** und **9**.
start: uebergabe-bonus-start.visustruct
test: - -> 4 | 6 | 9
braucht: aufruf
tipp: Das Hauptprogramm ist schon fertig. Du baust nur das Unterprogramm in einem neuen Reiter.
tipp: Lege mit **+** einen neuen Reiter mit dem Titel `void bonus(int[] punkte)` an. Darin läuft eine For-Schleife über alle Fächer und rechnet `punkte[i] = punkte[i] + 1`. Ein return brauchst du nicht, denn das Array wird direkt geändert.
lösung: uebergabe-bonus-loesung.visustruct
unterprogramm: uebergabe-bonus-unterprogramm-loesung.visustruct
:::

## Der Aussprung

Manchmal soll eine Schleife **vorzeitig** enden, mitten im Rumpf. Dafür gibt es den **Aussprung**. Er verlässt sofort die Schleife, in der er steht. Das Programm macht mit dem ersten Kasten nach der Schleife weiter. In Java, Python und JavaScript heißt das `break`.

Den Aussprung erkennst du an der Spitze am linken Rand. In den Kasten kannst du einen kurzen Kommentar schreiben, z. B. `Schleife verlassen`. Er erscheint im Code als Kommentar hinter `break`.

Ein Aussprung steht fast immer in einer **Verzweigung**: Nur wenn eine Bedingung zutrifft, wird die Schleife verlassen.

Typisch ist die **Endlosschleife mit Aussprung**. Die Schleife selbst hat keine Bedingung. Sie läuft so lange, bis der Aussprung erreicht wird:

::: diagramm l15-endlos-aussprung.visustruct
Die Schleife fragt immer wieder nach einer Zahl. Bei 0 springt sie heraus, sonst zählt sie die Zahl zur Summe.
:::

Ohne Aussprung würde eine Endlosschleife wirklich nie enden.

## Aussprung in der Simulation

Die Simulation führt den Aussprung aus wie `break`: Sie verlässt die innerste Schleife und macht nach ihr weiter. Steht ein Aussprung außerhalb jeder Schleife, endet das Unterprogramm, im Hauptprogramm das ganze Programm. Dasselbe macht `return`.

Oft geht es auch ganz ohne Aussprung: Du schreibst die Abbruchbedingung direkt in die Schleife. Das ist meist sogar übersichtlicher.

## Übung: Summe bis 0

::: übung l15-bis-null
titel: Summe bis 0
auftrag: Baue das Programm „Summe bis 0“ **ohne** Aussprung nach. Es fragt so lange nach ganzen Zahlen, bis jemand 0 eingibt. Danach gibt es **Summe:** und die Summe aller eingegebenen Zahlen aus.
test: 3, 4, 0 -> Summe: 7
test: 0 -> Summe: 0
test: 10, -2, 5, 0 -> Summe: 13
tipp: Ohne Aussprung muss die Bedingung der Schleife selbst prüfen, ob die 0 eingegeben wurde.
tipp: Frage die erste Zahl schon vor der Schleife ab. Die While-Schleife läuft mit der Bedingung `zahl != 0`. Im Rumpf zählst du die Zahl zur Summe und fragst danach die nächste Zahl ab. Bei der zweiten Eingabe schreibst du nur `input: zahl "…"`, weil es `zahl` schon gibt.
lösung: l15-bis-null-loesung.visustruct
:::

## Jetzt in Java

Ein Unterprogramm heißt in Java **Methode**. Das Quadrat von oben sieht so aus:

```
public static int quadrat(int x) {
    int ergebnis = x * x;
    return ergebnis;
}
```

Das Hauptprogramm ruft die Methode mit ihrem Namen auf und gibt ihr den Wert in runden Klammern mit:

```
int q = quadrat(zahl);
System.out.println("Das Quadrat ist " + q);
```

- In der Kopfzeile steht vor dem Namen, was die Methode zurückgibt (`int`). Gibt sie nichts zurück, steht dort `void`.
- Die Parameter stehen mit Datentyp in den runden Klammern: `(int x)`. Mehrere trennst du mit Komma.
- Im Bereich Programmieren schreibst du jede Methode in einen eigenen Reiter, so wie jedes Unterprogramm ein eigenes Struktogramm hat.
- Der Aussprung heißt in Java `break`. Mit `while (true)` baust du eine Schleife, die nur durch `break` endet.

::: übung l18-java-kasse
titel: Kasse mit break
code: java
auftrag: Schreibe in Java eine Kasse. Sie fragt immer wieder nach einem Preis in ganzen Euro. Bei 0 verlässt sie die Schleife mit `break`. Danach gibt sie aus, wie viele Artikel es waren und was alles zusammen kostet.
  Bei 3, 4 und dann 0 erscheint **Artikel: 2** und **Gesamt: 7**.
test: 3, 4, 0 -> Artikel: 2 | Gesamt: 7
test: 0 -> Artikel: 0 | Gesamt: 0
test: 10, 2, 5, 0 -> Artikel: 3 | Gesamt: 17
braucht: endlosschleife, aussprung
tipp: Du brauchst zwei Variablen, die vor der Schleife mit 0 anfangen: eine für die Summe und eine für die Anzahl.
tipp: In `while (true) { … }` liest du den Preis ein. Gleich danach prüfst du `if (preis == 0) { break; }`. Erst dahinter zählst du den Preis zur Summe und die Anzahl um 1 hoch.
lösung: l18-java-kasse-loesung.visustruct
:::

## Lückentext: Methoden und break

::: lückentext
titel: Methode und Aussprung
auftrag: Ergänze die fehlenden Wörter. Oben steht die Methode, die ein Quadrat ausrechnet. Darunter steht das Hauptprogramm, das sie aufruft. Im Bereich Programmieren stehen beide in eigenen Reitern.
```java
public static [[int]] quadrat(int x) {
    [[return]] x * x;
}
```
```java
int zahl = 1;
while ([[true]]) {
    int q = [[quadrat]](zahl);
    if (q > 50) {
        [[break]];
    }
    System.out.println(q);
    zahl = zahl + 1;
}
```
erklärung: `int` vor dem Methodennamen heißt: Die Methode gibt eine ganze Zahl zurück, und zwar mit `return`. Gibt eine Methode nichts zurück, steht dort `void`. `while (true)` läuft endlos, bis `break` die Schleife verlässt. Ausgabe: 1, 4, 9, 16, 25, 36 und 49.
:::

## Fehler finden: Raten

::: übung l18-java-fehler
titel: Versuche zählen reparieren
code: java
auftrag: Beim Zahlenraten ist die gesuchte Zahl 7. Das Programm fragt so lange nach einem Tipp, bis die 7 kommt, und gibt dann die Zahl der Versuche aus. Bei 3, 5 und 7 waren es 3 Versuche, das Programm sagt aber **Versuche: 2**.
  „Im Editor öffnen“ zeigt den Code im Bereich Programmieren. Finde den Fehler, repariere ihn und klicke auf Prüfen.
start: l18-java-fehler-start.visustruct
test: 3, 5, 7 -> Versuche: 3
test: 7 -> Versuche: 1
test: 1, 2, 3, 7 -> Versuche: 4
braucht: endlosschleife, aussprung
tipp: Was passiert beim richtigen Tipp? Wird er noch mitgezählt, bevor `break` die Schleife verlässt?
tipp: Zähle zuerst hoch und prüfe danach: `versuche = versuche + 1;` gehört vor das `if` mit dem `break`.
lösung: l18-java-fehler-loesung.visustruct
:::

## Spiel: Was kommt zurück?

::: spiel frage
titel: Spiel: Was kommt zurück?
intro: Ludwig ruft Methoden auf und springt aus Schleifen. Sag vorher, was ausgegeben wird. Sieben Runden.

runde:
    public static int quadrat(int x) {
        return x * x;
    }

    int q = quadrat(5);
    System.out.println(q);
frage: Was wird ausgegeben?
- 5
- 10
- [x] 25
> Der Aufruf gibt 5 in x, return liefert 5 · 5 zurück.

runde:
    public static void zeigeSumme(int a, int b) {
        System.out.println(a + b);
    }

    int x = 2;
    zeigeSumme(x, x + 1);
frage: Was wird ausgegeben?
- [x] 5
- 23
- 3
> Der erste Wert 2 kommt in a, der zweite 3 in b. In Java rechnet `a + b` mit Zahlen ganz normal.

runde:
frage: Was liefert eine Methode zurück, vor deren Namen `void` steht?
- eine ganze Zahl
- [x] nichts
- immer 0
> `void` heißt: kein Rückgabewert. Steht dort `int`, kommt eine ganze Zahl zurück.

runde:
    public static void verdopple(int x) {
        x = x * 2;
    }

    int zahl = 5;
    verdopple(zahl);
    System.out.println(zahl);
frage: Was wird ausgegeben?
- [x] 5
- 10
- 0
> Call by value: verdopple bekommt eine Kopie. zahl bleibt 5.

runde:
    public static void leeren(boolean[] plaetze) {
        for (int i = 0; i < plaetze.length; i++) {
            plaetze[i] = false;
        }
    }

    boolean[] reihe = {true, true};
    leeren(reihe);
    System.out.println(reihe[0]);
frage: Was wird ausgegeben?
- true
- [x] false
> Bei einem Array zeigen reihe und plaetze auf dasselbe Array. Die Änderung sieht auch der Aufrufer.

runde:
    int summe = 0;
    for (int i = 1; i <= 10; i++) {
        if (i == 4) {
            break;
        }
        summe = summe + i;
    }
    System.out.println(summe);
frage: Was wird ausgegeben?
- [x] 6
- 10
- 55
> Bei i = 4 springt `break` sofort aus der Schleife. Gezählt sind nur 1 + 2 + 3.

runde:
    int zahl = 1;
    while (true) {
        zahl = zahl * 3;
        if (zahl > 20) {
            break;
        }
    }
    System.out.println(zahl);
frage: Was wird ausgegeben?
- 9
- 20
- [x] 27
> 3, 9, 27. Erst 27 ist größer als 20, dann endet die Endlosschleife mit break.
:::

## Checkliste

::: checkliste
- Ich kann eine große Aufgabe in Teilprobleme zerlegen. → Große Aufgaben zerlegen
- Ich kann einen Aufruf einfügen und ein Unterprogramm in einem eigenen Reiter bauen. → Der Aufruf
- Ich kann einem Unterprogramm mit Parametern Werte übergeben. → Werte übergeben: Parameter
- Ich kann mit return einen Rückgabewert liefern und ihn beim Aufruf speichern. → Ergebnis zurückgeben: return
- Ich kann erklären, warum ein Unterprogramm eine Zahl nicht verändern kann, ein Array aber schon. → Kopie oder Original: call by value und call by reference
- Ich weiß, was ein Aussprung macht und warum er in einer Verzweigung steht. → Der Aussprung
- Ich kann eine Schleife mit einem Aussprung oder über ihre Bedingung beenden. → Aussprung in der Simulation
- Ich erkenne in Java eine Methode und kann eine Schleife mit `break` verlassen. → Jetzt in Java
:::

## Wissenstest

::: quiz
? Was bedeutet ein Aufruf-Kasten mit dem Text `zeigeErgebnis()`?
- [ ] Das Programm endet hier.
- [x] Hier wird das Unterprogramm zeigeErgebnis() ausgeführt, danach geht es weiter.
- [ ] Hier wird das Wort zeigeErgebnis() ausgegeben.

? Wo geht es nach einem Aussprung weiter?
- [ ] Am Anfang der Schleife
- [x] Beim ersten Kasten nach der Schleife
- [ ] Ganz am Anfang des Programms
> Der Aussprung verlässt die Schleife, in der er steht. In Java, Python und JavaScript heißt er break.

? Warum steht ein Aussprung meistens in einer Verzweigung?
- [x] Damit die Schleife nur verlassen wird, wenn eine Bedingung zutrifft
- [ ] Weil ein Aussprung sonst nicht gespeichert werden kann
- [ ] Weil eine Verzweigung selbst eine Schleife ist
> Ohne Verzweigung würde die Schleife schon im ersten Durchlauf verlassen.

? Wo findet die Simulation das Unterprogramm zu einem Aufruf `zeigeErgebnis()`?
- [ ] Es muss im selben Struktogramm stehen.
- [x] In einem offenen Reiter mit dem Titel zeigeErgebnis()
- [ ] Die Simulation kann keine Unterprogramme ausführen.
> Baue jedes Unterprogramm in einem eigenen Reiter und gib ihm als Titel den Namen aus dem Aufruf.

? Das Unterprogramm hat die Kopfzeile `void zeigeSumme(int a, int b)`. Welcher Aufruf passt?
- [ ] zeigeSumme()
- [x] zeigeSumme(3, 4)
- [ ] int s = zeigeSumme(3, 4)
> Zwei Parameter brauchen zwei Werte. Und `void` heißt: Es kommt nichts zurück, das man speichern könnte.

? Nach `int q = quadrat(5)` steht in q die 25. Was steht im Unterprogramm quadrat am Ende?
- [ ] output: x * x
- [x] return x * x
- [ ] q = x * x
> Mit return gibt das Unterprogramm den Wert an den Aufruf zurück. Eine Ausgabe würde ihn nur anzeigen.

? `void verdopple(int x)` rechnet `x = x * 2`. Im Hauptprogramm steht `int zahl = 5` und dann der Aufruf `verdopple(zahl)`. Welchen Wert hat zahl danach?
- [x] 5
- [ ] 10
- [ ] 0
> Wertübergabe (call by value): verdopple hat nur eine Kopie von zahl verändert.

? `void leeren(boolean[] plaetze)` setzt alle Fächer auf false. Was gilt nach `leeren(reihe)` für das Array reihe im Hauptprogramm?
- [ ] Es ist unverändert, weil das Unterprogramm eine Kopie bekommt.
- [x] Alle Fächer sind false, weil plaetze und reihe dasselbe Array sind.
- [ ] Das Array ist gelöscht.
> Referenzübergabe (call by reference): Ein Array wird als Referenz übergeben. Änderungen an den Fächern sieht auch der Aufrufer.

? Wie heißt ein Unterprogramm in Java?
- [ ] Klasse
- [x] Methode
- [ ] Schleife
> In Java ist ein Unterprogramm eine Methode, zum Beispiel die `main`-Methode. Je nach Art sagt man auch Prozedur oder Funktion.

? Viele Bausteine haben in Schulbüchern einen zweiten Namen. Ordne jedem Begriff aus VisuStruct den anderen Namen zu.
= Verzweigung -> Bedingte Anweisung
= Fallauswahl -> Mehrfachauswahl
= Schleife -> Wiederholungsstruktur
= Array -> Feld
= Unterprogramm -> Methode
> Beide Namen meinen dasselbe. Wenn du einen davon kennst, verstehst du auch den anderen.

? Was steht in Java in der Kopfzeile einer Methode, die nichts zurückgibt?
- [ ] int
- [x] void
- [ ] return
> void heißt „leer“: Die Methode macht etwas, gibt aber keinen Wert zurück.
:::
