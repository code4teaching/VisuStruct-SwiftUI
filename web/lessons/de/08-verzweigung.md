---
titel: Verzweigung
bereich: Grundlagen
kurz: Mit einer Bedingung entscheiden, welcher von zwei Wegen ausgeführt wird.
---

## Wenn, dann, sonst

Bisher wurden alle Kästen immer ausgeführt. Oft soll ein Programm aber **entscheiden**: Wenn eine Bedingung erfüllt ist, tue das eine, sonst das andere.

Dafür gibt es die **Verzweigung**. Oben im Dreieck steht die Bedingung. Darunter teilt sich das Struktogramm in zwei Zweige:

- **true** (links): wird ausgeführt, wenn die Bedingung wahr ist
- **false** (rechts): wird ausgeführt, wenn die Bedingung falsch ist

Es wird immer **genau einer** der beiden Zweige ausgeführt. Danach geht es unter der Verzweigung weiter.

::: diagramm l07-alter-pruefen.visustruct
Je nach eingegebenem Alter erscheint die eine oder die andere Meldung. Probiere in der Simulation 17 und 18 aus.
:::

## Eine Verzweigung einfügen

Ziehe die **Verzweigung** aus dem Bereich Elemente ins Struktogramm. Klicke das Dreieck an und schreibe im Objektinspektor die Bedingung, z. B. `alter >= 18`. Das Wort `if` steht schon davor.

In jedem Zweig liegt zuerst ein Platzhalter ø. Ziehe dort Anweisungen hinein. In einem Zweig dürfen auch mehrere Kästen untereinander stehen.

## Vergleichsoperatoren

Eine Bedingung ist meistens ein **Vergleich**. Sein Ergebnis ist immer `true` oder `false`.

- `==` gleich, z. B. `zahl == 0`
- `!=` ungleich, z. B. `antwort != 42`
- `<` kleiner, `<=` kleiner oder gleich
- `>` größer, `>=` größer oder gleich

> Verwechsle `==` nicht mit `=`. Ein einzelnes `=` ist eine Zuweisung und speichert einen Wert. Zum Vergleichen brauchst du zwei Gleichheitszeichen.

Mit `%` prüfst du, ob eine Zahl durch eine andere teilbar ist: `zahl % 2 == 0` ist wahr, wenn `zahl` gerade ist.

## Übung: Gerade oder ungerade

::: übung l07-gerade
titel: Gerade oder ungerade
auftrag: Frage eine ganze Zahl ab. Gib **gerade** aus, wenn sie gerade ist, und sonst **ungerade**.
test: 4 -> gerade
test: 7 -> ungerade
test: 0 -> gerade
braucht: verzweigung
tipp: Hier gibt es zwei Möglichkeiten, also brauchst du eine Verzweigung. Woran erkennst du eine gerade Zahl?
tipp: Eine Zahl ist gerade, wenn beim Teilen durch 2 kein Rest bleibt. Die Bedingung lautet `zahl % 2 == 0`.
lösung: l07-gerade-loesung.visustruct
:::

## Übung: Die größere Zahl

::: übung l07-maximum
titel: Die größere Zahl
auftrag: Frage zwei ganze Zahlen ab und gib nur die größere von beiden aus. Sind beide gleich, gib diese Zahl aus.
test: 3, 8 -> 8
test: 9, 2 -> 9
test: 5, 5 -> 5
braucht: verzweigung
tipp: Eine Verzweigung vergleicht die beiden Zahlen. In jedem Zweig steht genau eine Ausgabe.
tipp: Vergleiche mit `a > b`. Im true-Zweig gibst du `a` aus, im false-Zweig `b`.
lösung: l07-maximum-loesung.visustruct
:::

## Ein leerer Zweig

Manchmal soll nur dann etwas passieren, wenn die Bedingung wahr ist, und sonst gar nichts. Dann bleibt der false-Zweig **leer**. Im Struktogramm steht dort der Platzhalter **ø**.

::: diagramm l07-rabatt.visustruct
Ab 50 Euro gibt es 5 Euro Rabatt. Sonst passiert nichts, der false-Zweig ist leer. Die Ausgabe darunter wird in beiden Fällen ausgeführt.
:::

## Übung: Betrag

::: übung l07-betrag
titel: Betrag einer Zahl
auftrag: Frage eine ganze Zahl ab. Ist sie negativ, mache sie positiv. Gib danach die Zahl aus. Aus -5 wird also 5, und 7 bleibt 7.
Nutze eine Verzweigung mit einem leeren Zweig und nur **einer** Ausgabe unter der Verzweigung.
test: -5 -> 5
test: 7 -> 7
test: 0 -> 0
test: -12 -> 12
braucht: verzweigung
tipp: Nur negative Zahlen müssen verändert werden. Was passiert mit einer Zahl, wenn du sie mal -1 nimmst?
tipp: Die Bedingung ist `zahl < 0`. Im true-Zweig drehst du das Vorzeichen um, z. B. mit `zahl = 0 - zahl`. Der false-Zweig bleibt leer.
lösung: l07-betrag-loesung.visustruct
:::

## Jetzt in Java

So sieht die Altersprüfung vom Anfang dieser Lektion in Java aus:

```
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Wie alt bist du?");
int alter = scanner.nextInt();
if (alter >= 18) {
    System.out.println("Du bist volljährig.");
} else {
    System.out.println("Du bist noch nicht volljährig.");
}
```

- Die Bedingung steht nach `if` in **runden Klammern** `( )`.
- Der true-Zweig steht in **geschweiften Klammern** `{ }`, der false-Zweig folgt nach `else` in eigenen geschweiften Klammern. Hinter einer geschweiften Klammer steht kein Semikolon.
- Ist der false-Zweig leer, lässt du `else { }` einfach weg.
- Die ersten beiden Zeilen braucht dein Programm einmal, sobald es etwas einliest. Danach liest `scanner.nextInt()` eine ganze Zahl ein. Die Frage davor ist eine normale Ausgabe.

::: übung l08-java-bestanden
titel: Bestanden in Java
code: java
auftrag: Schreibe ein Java-Programm, das nach der Punktzahl fragt. Ab 50 Punkten gibt es **bestanden** aus, sonst **nicht bestanden**.
  Tippe den Code im Bereich Programmieren und klicke dann auf Prüfen.
test: 50 -> bestanden
test: 49 -> nicht bestanden
test: 100 -> bestanden
test: 0 -> nicht bestanden
braucht: verzweigung
tipp: Fang mit den beiden Zeilen für den Scanner an. Dann fragst du nach den Punkten, liest sie ein und vergleichst sie mit `if`.
tipp: Die Bedingung lautet `punkte >= 50`. In den Zweigen steht `System.out.println("bestanden");` und nach `else` `System.out.println("nicht bestanden");`.
lösung: l08-java-bestanden-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich weiß, dass bei einer Verzweigung genau ein Zweig ausgeführt wird. → Wenn, dann, sonst
- Ich kenne die Vergleichsoperatoren == != < <= > >=. → Vergleichsoperatoren
- Ich kann == und = unterscheiden. → Vergleichsoperatoren
- Ich kann eine Verzweigung mit einem leeren Zweig bauen. → Ein leerer Zweig
- Ich kann eine Verzweigung mit if und else in Java schreiben. → Jetzt in Java
:::

## Wissenstest

::: quiz
? Welcher Zweig wird ausgeführt, wenn die Bedingung falsch ist?
- [ ] Der true-Zweig
- [x] Der false-Zweig
- [ ] Beide Zweige
- [ ] Keiner, das Programm endet
> Bei false wird der rechte Zweig ausgeführt. Danach geht es unter der Verzweigung weiter.

? Mit welcher Bedingung prüfst du, ob alter genau 18 ist?
- [ ] alter = 18
- [x] alter == 18
- [ ] alter >= 18
> Ein einzelnes = ist eine Zuweisung. Zum Vergleichen brauchst du ==.

? Was bedeutet ø in einem Zweig?
- [x] In diesem Fall passiert nichts.
- [ ] Das Programm endet hier.
- [ ] Die Bedingung ist falsch.

? Die Bedingung lautet `punkte >= 50`. Bei welchem Wert ist sie wahr?
- [ ] 49
- [x] 50
- [ ] 0
> >= heißt größer oder gleich. 50 gehört also dazu.

? In Schulbüchern hat die Verzweigung oft noch einen anderen Namen. Welchen?
- [ ] Mehrfachauswahl
- [x] Bedingte Anweisung
- [ ] Wiederholungsstruktur
> Die Anweisungen in einem Zweig werden nur unter einer Bedingung ausgeführt. Darum heißt sie auch bedingte Anweisung.

? Wo steht in Java die Bedingung einer Verzweigung?
- [x] In runden Klammern direkt nach if
- [ ] In geschweiften Klammern nach else
- [ ] Hinter einem Semikolon
> `if (alter >= 18) { … }`: Die runden Klammern gehören zur Bedingung, die geschweiften zum Zweig.
:::
