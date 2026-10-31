---
titel: For-Schleife
bereich: Grundlagen
kurz: Mit Start, Bedingung und Schritt eine feste Anzahl von Durchläufen zählen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- die drei Teile Start, Bedingung und Schritt der For-Schleife benennen
- erklären, in welcher Reihenfolge die drei Teile ausgeführt werden
- mit einer For-Schleife vorwärts, rückwärts und in größeren Schritten zählen
- eine For-Schleife in Java schreiben und ihre drei Felder erklären
:::

## Zählen mit festem Plan

In der While-Schleife hast du schon mitgezählt: Startwert vor der Schleife, Bedingung im Kopf, Veränderung im Inhalt. Die **For-Schleife** schreibt diese drei Teile zusammen in den Kopf. So siehst du auf einen Blick, wie gezählt wird.

Wenn du eine For-Schleife anklickst, hat sie rechts drei Felder:

- **Start:** `int i = 1` legt die Zählvariable an.
- **Bedingung:** `i <= 5` sagt, wie lange gezählt wird.
- **Schritt:** `i++` erhöht `i` nach jedem Durchlauf um 1.

::: diagramm l12-eins-bis-fuenf.visustruct
Eine For-Schleife, die die Zahlen von 1 bis 5 ausgibt.
:::

::: angeberwissen
Warum heißt die Zählvariable fast immer `i`? In der Mathematik steht `i` schon lange für einen Index. Und in FORTRAN, einer der ersten Programmiersprachen von 1957, waren alle Variablen, die mit I bis N anfingen, automatisch ganze Zahlen. Programmierer haben sich das bis heute nicht abgewöhnt.
:::

## In welcher Reihenfolge?

Die drei Teile kommen zu unterschiedlichen Zeiten dran:

1. **Start** wird genau einmal ausgeführt, ganz am Anfang.
2. **Bedingung** wird vor jedem Durchlauf geprüft. Ist sie falsch, ist die Schleife fertig.
3. Nach dem Inhalt kommt der **Schritt**, dann wieder die Bedingung.

::: grafik l12-for-ablauf.svg
Der Start kommt nur einmal dran. Danach wiederholen sich Bedingung, Inhalt und Schritt.
:::

Die For-Schleife ist also kopfgesteuert wie die While-Schleife. Gehe das Beispiel in der Simulation mit **Schritt** durch und beobachte, wie sich `i` verändert.

> Nimm die For-Schleife, wenn du schon vorher weißt, wie oft etwas passieren soll. Hängt das Ende von etwas ab, das erst während der Schleife passiert, zum Beispiel einer Eingabe, ist die While- oder Do-while-Schleife besser.

## Beispiel: Summe von 1 bis n

Eine For-Schleife eignet sich gut, um Zahlen aufzusummieren. Vor der Schleife steht `int summe = 0`. In jedem Durchlauf kommt die aktuelle Zahl `i` dazu.

::: diagramm l12-summe.visustruct
Bei n = 4 rechnet die Schleife 0 + 1 + 2 + 3 + 4. Am Ende wird 10 ausgegeben.
:::

## Andere Schritte

Der Schritt muss nicht immer `i++` sein:

- `i--` zählt rückwärts, zum Beispiel mit Start `int i = 10` und Bedingung `i >= 1`.
- `i = i + 2` springt in Zweierschritten, zum Beispiel 0, 2, 4, 6.

Achte darauf, dass Start, Bedingung und Schritt zusammenpassen. Mit Start `int i = 1`, Bedingung `i >= 1` und Schritt `i++` wird die Bedingung nie falsch.

::: übung l12-countdown
titel: Countdown
auftrag: Frage eine ganze Zahl `n` ab. Zähle mit einer For-Schleife von `n` rückwärts bis 1 und gib jede Zahl aus. Gib danach **Los!** aus.
test: 3 -> 3 | 2 | 1 | Los!
test: 5 -> 5 | 4 | 3 | 2 | 1 | Los!
test: 1 -> 1 | Los!
braucht: forSchleife
tipp: Diesmal zählt die For-Schleife rückwärts. Überlege, wo sie beginnt, wann sie aufhört und wie sie zählt.
tipp: Start ist `int i = n`, die Bedingung `i >= 1` und der Schritt `i--`. Die Ausgabe Los! steht unter der Schleife, nicht darin.
lösung: l12-countdown-loesung.visustruct
:::

## Übung: Einmaleins

::: übung l12-einmaleins
titel: Einmaleins
auftrag: Frage eine Zahl ab und gib ihre Einmaleins-Reihe von 1 bis 10 aus. Jede Zeile sieht so aus: **3 x 1 = 3**, **3 x 2 = 6** und so weiter.
test: 3 -> 3 x 1 = 3 | 3 x 2 = 6 | 3 x 3 = 9 | 3 x 4 = 12 | 3 x 5 = 15 | 3 x 6 = 18 | 3 x 7 = 21 | 3 x 8 = 24 | 3 x 9 = 27 | 3 x 10 = 30
test: 7 -> 7 x 1 = 7 | 7 x 2 = 14 | 7 x 3 = 21 | 7 x 4 = 28 | 7 x 5 = 35 | 7 x 6 = 42 | 7 x 7 = 49 | 7 x 8 = 56 | 7 x 9 = 63 | 7 x 10 = 70
braucht: forSchleife
tipp: Die Schleife zählt von 1 bis 10. In jedem Durchlauf gibst du eine Zeile der Reihe aus.
tipp: Rechne im Inhalt zuerst `int produkt = zahl * i`. Danach gibst du `zahl + " x " + i + " = " + produkt` aus. Denk an die Leerzeichen innerhalb der Anführungszeichen.
lösung: l12-einmaleins-loesung.visustruct
:::

## Übung: Summe reparieren

::: übung l16-summe
titel: Summe reparieren
auftrag: Das Struktogramm soll alle Zahlen von 1 bis n zusammenzählen. Bei n = 4 soll also 1 + 2 + 3 + 4 = **10** herauskommen. Es gibt aber 6 aus.
  Mache einen Schreibtischtest oder nutze **Schritt** und repariere den Fehler.
start: l16-summe-start.visustruct
test: 4 -> 10
test: 1 -> 1
test: 5 -> 15
braucht: forSchleife
tipp: Gehe die Schleife mit n = 4 im Kopf oder mit **Schritt** durch. Welche Zahlen werden wirklich addiert?
tipp: Schau, mit welchem Wert von i die Schleife zuletzt läuft. Bei n = 4 muss auch i = 4 noch dazugezählt werden.
lösung: l16-summe-loesung.visustruct
:::

## Jetzt in Java

Die Summe von 1 bis n sieht in Java so aus:

```java editor
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Bis zu welcher Zahl?");
int n = scanner.nextInt();
int summe = 0;
for (int i = 1; i <= n; i++) {
    summe = summe + i;
}
System.out.println(summe);
```

In den runden Klammern nach `for` stehen die drei Felder der For-Schleife, getrennt durch Semikolons:

| Feld | In Java | Bedeutung |
|---|---|---|
| Startwert | `int i = 1` | `i` beginnt bei 1. |
| Bedingung | `i <= n` | Die Schleife läuft, solange das gilt. |
| Schritt | `i++` | Nach jedem Durchlauf wird `i` um 1 größer. |

`i++` ist die Kurzform von `i = i + 1`. Rückwärts zählst du mit `i--`.

::: übung l13-java-quadrate
titel: Quadratzahlen in Java
code: java
auftrag: Schreibe ein Java-Programm, das eine ganze Zahl `n` einliest und mit einer For-Schleife die Quadratzahlen von 1 bis `n` ausgibt, jede in einer eigenen Zeile. Bei 3 also 1, 4 und 9.
test: 3 -> 1 | 4 | 9
test: 5 -> 1 | 4 | 9 | 16 | 25
test: 1 -> 1
braucht: forSchleife
tipp: Die Schleife zählt `i` von 1 bis `n`. Die Quadratzahl von `i` ist `i * i`.
tipp: `for (int i = 1; i <= n; i++) { … }` und im Rumpf `System.out.println(i * i);`.
lösung: l13-java-quadrate-loesung.visustruct
:::

## Lückentext: for

::: lückentext
titel: Hoch- und runterzählen
auftrag: Die erste Schleife zählt die Zahlen von 1 bis 5 zusammen, die zweite zählt von 10 bis 0 rückwärts. Ergänze die fehlenden Wörter und Zeichen.
```java
int summe = 0;
[[for]] ([[int]] i = 1; i [[<=]] 5; [[i++ | i += 1 | i = i + 1]]) {
    summe = summe + i;
}
System.out.println("Summe: " + summe);
for (int i = 10; i [[>=]] 0; [[i-- | i -= 1 | i = i - 1]]) {
    System.out.println(i);
}
```
erklärung: In den runden Klammern stehen Startwert, Bedingung und Schritt, getrennt durch Semikolons. `i++` zählt hoch, `i--` zählt runter. Beim Rückwärtszählen bis 0 heißt die Bedingung `i >= 0`.
:::

## Fehler finden: Einmaleins

::: übung l13-java-fehler
titel: Einmaleins reparieren
code: java
auftrag: Das Programm fragt nach einer Reihe und soll sie vom 1-fachen bis zum 10-fachen ausgeben, bei 7 also 7, 14, … bis 70. Die 70 fehlt aber.
  „Im Editor öffnen“ zeigt den Code im Bereich Code. Finde den Fehler, repariere ihn und klicke auf Prüfen.
start: l13-java-fehler-start.visustruct
test: 7 -> 7 | 14 | 21 | 28 | 35 | 42 | 49 | 56 | 63 | 70
test: 3 -> 3 | 6 | 9 | 12 | 15 | 18 | 21 | 24 | 27 | 30
braucht: forSchleife
tipp: Wie oft läuft die Schleife? Zähle nach, welche Werte `i` annimmt.
tipp: `i` soll auch den Wert 10 annehmen: `i <= 10` statt `i < 10`.
lösung: l13-java-fehler-loesung.visustruct
:::

## Spiel: Bombe entschärfen

::: spiel bombe
titel: Spiel: Bombe entschärfen
intro: In jedem Programm steckt **genau ein Fehler**, und die Bombe tickt. Lies, was das Programm tun soll, und tippe auf die falsche Zeile, bevor die Zeit abläuft. Acht Runden, je 25 Sekunden.
zeit: 25

runde:
    for (int i = 1; i <= 3; i++) {
        System.out.println(i)
    }
frage: Soll 1, 2 und 3 ausgeben.
fehler: 2
besser: System.out.println(i);
> Am Ende der Anweisung fehlt das Semikolon.

runde:
    for (int i = 1, i <= 5, i++) {
        System.out.println(i);
    }
frage: Soll 1 bis 5 ausgeben.
fehler: 1
besser: for (int i = 1; i <= 5; i++) {
> Die drei Felder der For-Schleife werden mit Semikolons getrennt, nicht mit Kommas.

runde:
    for (int i = 10; i >= 1; i++) {
        System.out.println(i);
    }
frage: Soll von 10 bis 1 rückwärts zählen.
fehler: 1
besser: for (int i = 10; i >= 1; i--) {
> Mit `i++` wird `i` immer größer, die Bedingung `i >= 1` bleibt wahr: eine Endlosschleife. Rückwärts zählst du mit `i--`.

runde:
    int summe = 0;
    for (int i = 1; i <= 4; i++) {
        summe = i;
    }
    System.out.println(summe);
frage: Soll die Summe 1 + 2 + 3 + 4 = 10 ausgeben.
fehler: 3
besser: summe = summe + i;
> `summe = i` überschreibt die Summe in jedem Durchlauf. Am Ende steht dort nur 4.

runde:
    for (int i = 0; i <= 5; i++) {
        System.out.println("Määäh");
    }
frage: Soll genau fünfmal Määäh ausgeben.
fehler: 1
besser: for (int i = 0; i < 5; i++) {
> Von 0 bis einschließlich 5 sind es sechs Durchläufe. Wer bei 0 anfängt, nimmt `<`.

runde:
    for (int i = 1; i <= 3; i++) {
        system.out.println(i);
    }
frage: Soll 1, 2 und 3 ausgeben.
fehler: 2
besser: System.out.println(i);
> Java unterscheidet Groß- und Kleinbuchstaben: `System` schreibt man mit großem S.

runde:
    int zahl = 7;
    for (int i = 1; i <= 10; i++) {
        System.out.println(zahl + " x " + i + " = " + zahl * zahl);
    }
frage: Soll die Siebenerreihe ausgeben: 7 x 1 = 7, 7 x 2 = 14 und so weiter.
fehler: 3
besser: System.out.println(zahl + " x " + i + " = " + zahl * i);
> `zahl * zahl` ist immer 49. Gerechnet werden muss `zahl * i`.

runde:
    for (int i = 2; i <= 10; i + 2) {
        System.out.println(i);
    }
frage: Soll die geraden Zahlen 2, 4, 6, 8 und 10 ausgeben.
fehler: 1
besser: for (int i = 2; i <= 10; i = i + 2) {
> `i + 2` rechnet nur, speichert aber nichts. Damit `i` wirklich wächst, braucht es `i = i + 2`.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann die drei Teile Start, Bedingung und Schritt der For-Schleife benennen. → Zählen mit festem Plan
- Ich kann erklären, in welcher Reihenfolge die drei Teile ausgeführt werden. → In welcher Reihenfolge?
- Ich kann mit einer For-Schleife vorwärts, rückwärts und in größeren Schritten zählen. → Andere Schritte
- Ich kann eine For-Schleife in Java schreiben und ihre drei Felder erklären. → Jetzt in Java
:::

## Wissenstest

::: quiz
? Wie oft wird der Start einer For-Schleife ausgeführt?
→ In welcher Reihenfolge?
- [x] Genau einmal
- [ ] Vor jedem Durchlauf
- [ ] Nach jedem Durchlauf
> Der Start legt die Zählvariable einmal am Anfang an.

? Start `int i = 0`, Bedingung `i < 3`, Schritt `i++`. Welche Werte hat i im Inhalt?
→ Zählen mit festem Plan
- [ ] 1, 2, 3
- [x] 0, 1, 2
- [ ] 0, 1, 2, 3
> Bei i = 3 ist die Bedingung falsch, deshalb läuft der Inhalt dann nicht mehr.

? Start `int i = 2`, Bedingung `i <= 10`, Schritt `i = i + 2`. Wie oft läuft der Inhalt?
→ Andere Schritte
- [ ] 4-mal
- [x] 5-mal
- [ ] 10-mal
> i nimmt die Werte 2, 4, 6, 8 und 10 an.

? Wann passt eine For-Schleife am besten?
→ Zählen mit festem Plan
- [x] Wenn vorher feststeht, wie oft wiederholt wird
- [ ] Wenn so lange gefragt wird, bis eine Eingabe gültig ist
- [ ] Wenn nur ein einziger Wert geprüft wird

? Was bedeutet `i++` in einer For-Schleife?
→ Zählen mit festem Plan
- [ ] i wird verdoppelt.
- [x] i wird um 1 größer.
- [ ] i wird ausgegeben.
> `i++` ist die Kurzform von `i = i + 1`.
:::
