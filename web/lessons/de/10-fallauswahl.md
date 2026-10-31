---
titel: Fallauswahl
bereich: Grundlagen
kurz: Je nach Wert einer Variablen einen von vielen Fällen ausführen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- eine Fallauswahl einfügen, Fälle hinzufügen und Fallnamen ändern
- erklären, wann der Fall default ausgeführt wird
- entscheiden, ob eine Fallauswahl oder eine Verzweigung besser passt
- eine Fallauswahl in Java mit switch schreiben
:::

## Viele Möglichkeiten, eine Variable

Ein Getränkeautomat hat drei Tasten: 1 für Wasser, 2 für Saft, 3 für Kakao. Mit Verzweigungen brauchst du dafür drei ineinander geschachtelte Kästen. Das wird schnell breit und unübersichtlich.

::: diagramm l09-verschachtelt.visustruct
Der Automat mit drei verschachtelten Verzweigungen. Jede Verzweigung prüft wieder dieselbe Variable wahl.
:::

Immer wenn du **eine Variable** mit **mehreren festen Werten** vergleichst, geht es einfacher: mit der **Fallauswahl**.

## So ist die Fallauswahl aufgebaut

Oben im Kasten steht die Variable, nach der ausgewählt wird. Darunter steht für jeden Fall eine eigene Spalte. Über jeder Spalte steht der Wert, zu dem sie gehört.

::: diagramm l09-automat.visustruct
Derselbe Automat als Fallauswahl. Hat wahl den Wert 2, wird nur die Spalte 2 ausgeführt.
:::

- Die Simulation sucht den Fall, dessen Name genau zum Wert passt.
- Passt kein Fall, wird **default** ausgeführt. Dieser Fall steht immer ganz rechts.
- Danach geht es unter der Fallauswahl weiter. Es wird immer nur **ein** Fall ausgeführt.

> Eine neue Fallauswahl hat die Fälle 1, 2 und default. Klicke einen Fall an, um im Objektinspektor seinen **Fallnamen** zu ändern. Mit **Weiteren Fall hinzufügen** bekommst du eine neue Spalte vor default.

## Fälle mit Texten

Die Fälle müssen keine Zahlen sein. Du kannst auch nach dem Inhalt einer `String`-Variablen auswählen. Als Fallname schreibst du dann den Text, zum Beispiel `rot`.

::: diagramm l09-ampel.visustruct
Eine Ampel: Je nach eingegebener Farbe erscheint ein anderer Hinweis. Probiere in der Simulation auch eine Farbe aus, die es nicht gibt.
:::

Groß- und Kleinschreibung zählt: `Rot` passt nicht zum Fall `rot`.

## Übung: Note in Worten

::: übung l09-note
titel: Note in Worten
auftrag: Frage eine Note als ganze Zahl ab und gib sie in Worten aus: 1 sehr gut, 2 gut, 3 befriedigend, 4 ausreichend, 5 mangelhaft, 6 ungenügend.
  Bei jeder anderen Zahl soll **Keine gültige Note** erscheinen.
test: 1 -> sehr gut
test: 4 -> ausreichend
test: 6 -> ungenügend
test: 9 -> Keine gültige Note
braucht: fallauswahl
tipp: Für viele feste Werte ist die Fallauswahl übersichtlicher als viele Verzweigungen. Jede Note bekommt ihren eigenen Fall.
tipp: Füge mit „Weiteren Fall hinzufügen“ so lange Fälle hinzu, bis du die Fälle 1 bis 6 und default hast. Oben in die Fallauswahl schreibst du `note`.
lösung: l09-note-loesung.visustruct
:::

## Übung: Taschenrechner

::: übung l09-rechner
titel: Taschenrechner
auftrag: Frage nacheinander eine ganze Zahl `a`, ein Rechenzeichen als `String` und eine zweite ganze Zahl `b` ab.
  Bei `+`, `-` und `*` gibst du das Ergebnis aus. Bei jedem anderen Zeichen erscheint **Unbekanntes Rechenzeichen**.
test: 3, +, 4 -> 7
test: 10, -, 4 -> 6
test: 6, *, 7 -> 42
test: 1, x, 2 -> Unbekanntes Rechenzeichen
braucht: fallauswahl
tipp: Lies erst alle drei Werte ein. Danach entscheidet eine Fallauswahl über das Rechenzeichen, was gerechnet wird.
tipp: Lege vor der Fallauswahl `int ergebnis = 0` an. In jedem Fall rechnest du zum Beispiel `ergebnis = a + b` und gibst danach `ergebnis` aus. Die Fallnamen sind einfach `+`, `-` und `*`.
lösung: l09-rechner-loesung.visustruct
:::

## Fallauswahl oder Verzweigung?

Die Fallauswahl prüft nur, ob ein Wert **genau gleich** einem Fallnamen ist. Daraus folgt:

- **Fallauswahl:** eine Variable, mehrere feste Werte. Beispiele: Menüauswahl, Wochentag als Zahl, Noten.
- **Verzweigung:** Bereiche und verknüpfte Bedingungen. Beispiele: `alter >= 18`, `temperatur < 0 || temperatur > 30`.

Für „Alter ab 18“ brauchst du also weiter die Verzweigung. Du kannst nicht für jedes mögliche Alter einen eigenen Fall anlegen.

## Jetzt in Java

Der Getränkeautomat sieht in Java so aus:

```java editor
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("1 Wasser, 2 Saft, 3 Kakao");
int wahl = scanner.nextInt();
switch (wahl) {
    case 1 -> {
        System.out.println("Hier ist dein Wasser.");
    }
    case 2 -> {
        System.out.println("Hier ist dein Saft.");
    }
    case 3 -> {
        System.out.println("Hier ist dein Kakao.");
    }
    default -> {
        System.out.println("Diese Taste gibt es nicht.");
    }
}
```

- Nach `switch` steht in runden Klammern die Variable, die verglichen wird.
- Jeder Fall beginnt mit `case`, dem Wert und einem Pfeil `->`. Dahinter steht in geschweiften Klammern, was passieren soll.
- `default` ist der Sonst-Fall. Er läuft, wenn kein Wert passt.

::: angeberwissen
Den Pfeil `case 1 ->` gibt es in Java erst seit 2020 (Java 14). Davor schrieb man `case 1:` und musste jeden Fall mit `break;` beenden. Wer das vergaß, lief einfach in den nächsten Fall weiter. Der Pfeil hat also sehr vielen Programmierern Ärger erspart.
:::

::: übung l10-java-wuerfel
titel: Würfel in Worten
code: java
auftrag: Schreibe ein Java-Programm mit `switch`, das eine Zahl einliest. Bei 1 gibt es **eins** aus, bei 2 **zwei**, bei 3 **drei** und sonst **kenne ich nicht**.
test: 1 -> eins
test: 2 -> zwei
test: 3 -> drei
test: 7 -> kenne ich nicht
braucht: fallauswahl
tipp: Du brauchst drei `case`-Fälle und einen `default`-Fall.
tipp: `switch (zahl) { case 1 -> { System.out.println("eins"); } … default -> { System.out.println("kenne ich nicht"); } }`
lösung: l10-java-wuerfel-loesung.visustruct
:::

## Lückentext: switch

::: lückentext
titel: Monate in Worten
auftrag: Ergänze die fehlenden Wörter und Zeichen der Fallauswahl.
```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Welcher Monat (1 bis 3)?");
int monat = scanner.nextInt();
[[switch]] (monat) {
    [[case]] 1 -> {
        System.out.println("Januar");
    }
    case 2 [[->]] {
        System.out.println("Februar");
    }
    [[case]] 3 -> {
        System.out.println("März");
    }
    [[default]] -> {
        System.out.println("Kenne ich nicht");
    }
}
```
erklärung: Nach `switch` steht die Variable in runden Klammern. Jeder Fall beginnt mit `case`, dem Wert und dem Pfeil `->`. `default` läuft, wenn kein Fall passt.
:::

## Fehler finden: Rechner

::: übung l10-java-fehler
titel: Rechner reparieren
code: java
auftrag: Der Rechner liest zwei Zahlen und eine Wahl ein: 1 plus, 2 minus, 3 mal. Bei 7, 3 und Wahl 2 soll **4** herauskommen, er rechnet aber **-4**.
  „Im Editor öffnen“ zeigt den Code im Bereich Code. Finde den Fehler, repariere ihn und klicke auf Prüfen.
start: l10-java-fehler-start.visustruct
test: 7, 3, 2 -> 4
test: 7, 3, 1 -> 10
test: 7, 3, 3 -> 21
test: 7, 3, 5 -> Gibt es nicht
test: 10, 4, 2 -> 6
braucht: fallauswahl
tipp: Plus und mal stimmen. Schau dir den Fall `case 2` genau an.
tipp: Beim Minus zählt die Reihenfolge: `a - b` statt `b - a`.
lösung: l10-java-fehler-loesung.visustruct
:::

## Spiel: Welcher Fall?

::: spiel frage
titel: Spiel: Welcher Fall?
intro: Ludwig drückt Tasten am Getränkeautomaten und an anderen Fallauswahlen. Was passiert? Sechs Runden.

runde:
    int wahl = 2;
    switch (wahl) {
        case 1 -> { System.out.println("Wasser"); }
        case 2 -> { System.out.println("Saft"); }
        case 3 -> { System.out.println("Kakao"); }
        default -> { System.out.println("Diese Taste gibt es nicht."); }
    }
frage: Was wird ausgegeben?
- Wasser
- [x] Saft
- Diese Taste gibt es nicht.
> wahl ist 2, also läuft genau der Fall `case 2`.

runde:
    int wahl = 4;
    switch (wahl) {
        case 1 -> { System.out.println("Wasser"); }
        case 2 -> { System.out.println("Saft"); }
        case 3 -> { System.out.println("Kakao"); }
        default -> { System.out.println("Diese Taste gibt es nicht."); }
    }
frage: Was wird ausgegeben?
- Kakao
- nichts
- [x] Diese Taste gibt es nicht.
> Kein Fall passt zu 4, also läuft `default`.

runde:
    String tag = "montag";
    switch (tag) {
        case "Montag" -> { System.out.println("Mathe"); }
        case "Dienstag" -> { System.out.println("Sport"); }
        default -> { System.out.println("frei"); }
    }
frage: Was wird ausgegeben?
- Mathe
- Sport
- [x] frei
> Bei Texten zählt jeder Buchstabe: "montag" mit kleinem m ist nicht "Montag".

runde:
    int note = 0;
    switch (note) {
        case 1 -> { System.out.println("sehr gut"); }
        case 2 -> { System.out.println("gut"); }
        case 3 -> { System.out.println("befriedigend"); }
    }
frage: Was wird ausgegeben?
- sehr gut
- [x] nichts
- befriedigend
> Kein Fall passt, und es gibt kein `default`. Dann passiert einfach nichts.

runde:
frage: Du willst prüfen, ob `alter >= 18` ist. Was passt besser?
- [x] eine Verzweigung
- eine Fallauswahl
> Eine Fallauswahl vergleicht nur mit festen Werten. Für „größer oder gleich“ brauchst du eine Verzweigung.

runde:
frage: Ein Würfel zeigt 1 bis 6, und für jede Zahl soll ein anderes Wort erscheinen. Was passt besser?
- eine Verzweigung
- [x] eine Fallauswahl
> Eine Variable, sechs feste Werte: genau dafür ist die Fallauswahl da.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann eine Fallauswahl einfügen, Fälle hinzufügen und Fallnamen ändern. → So ist die Fallauswahl aufgebaut
- Ich kann erklären, wann der Fall default ausgeführt wird. → So ist die Fallauswahl aufgebaut
- Ich kann entscheiden, ob eine Fallauswahl oder eine Verzweigung besser passt. → Fallauswahl oder Verzweigung?
- Ich kann eine Fallauswahl in Java mit switch schreiben. → Jetzt in Java
:::

## Wissenstest

::: quiz
? Die Variable tag hat den Wert 5. Es gibt die Fälle 1, 2, 3 und default. Was wird ausgeführt?
→ So ist die Fallauswahl aufgebaut
- [ ] Gar nichts
- [ ] Der Fall 3
- [x] Der Fall default
> Kein Fallname passt zu 5, deshalb greift default.

? Wie viele Fälle werden bei einem Durchlauf der Fallauswahl ausgeführt?
→ So ist die Fallauswahl aufgebaut
- [x] Genau einer
- [ ] Alle Fälle ab dem passenden
- [ ] Alle Fälle
> Nach dem passenden Fall geht es direkt unter der Fallauswahl weiter.

? Wofür ist eine Fallauswahl NICHT geeignet?
→ Fallauswahl oder Verzweigung?
- [ ] Menüpunkt 1, 2 oder 3 auswählen
- [x] Prüfen, ob eine Temperatur über 30 Grad liegt
- [ ] Eine Farbe wie rot, gelb oder grün auswerten
> „Über 30“ ist ein Bereich. Dafür brauchst du eine Verzweigung mit einem Vergleich.

? Du gibst bei der Ampel `Rot` ein, der Fall heißt `rot`. Was passiert?
→ So ist die Fallauswahl aufgebaut
- [ ] Der Fall rot wird ausgeführt.
- [x] Der Fall default wird ausgeführt.
- [ ] Die Simulation meldet einen Fehler.
> Groß- und Kleinschreibung zählt. Rot und rot sind verschiedene Texte.

? Unter welchem Namen findest du die Fallauswahl auch in Schulbüchern?
→ So ist die Fallauswahl aufgebaut
- [ ] Bedingte Anweisung
- [ ] Sequenz
- [x] Mehrfachauswahl
> Aus vielen Fällen wird einer ausgewählt. Darum heißt sie auch Mehrfachauswahl.

? Wie heißt in Java der Sonst-Fall einer Fallauswahl?
→ Jetzt in Java
- [ ] else
- [x] default
- [ ] case 0
:::
