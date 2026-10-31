---
titel: Bedingungen verknüpfen
bereich: Grundlagen
kurz: Mehrere Bedingungen mit und, oder und nicht verbinden und Wertebereiche prüfen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- erklären, wann eine Verknüpfung mit && wahr ist
- erklären, wann eine Verknüpfung mit || wahr ist
- eine Bedingung mit ! umdrehen
- prüfen, ob ein Wert in einem Bereich wie 1 bis 6 liegt
- die Wahrheitstabelle für &&, || und ! lesen
- das Ergebnis einer Bedingung in einer boolean-Variablen speichern
- zusammengesetzte Bedingungen sicher auswerten
- Bedingungen in Java mit && und || verknüpfen
:::

## Und: &&

Manchmal reicht ein einzelner Vergleich nicht. Ein Jugendticket gibt es zum Beispiel nur, wenn jemand **mindestens 12 und jünger als 18** ist.

Mit `&&` (und) verbindest du zwei Bedingungen. Das Ergebnis ist nur dann `true`, wenn **beide** Bedingungen wahr sind.

::: diagramm l08-jugendticket.visustruct
Beide Vergleiche müssen stimmen. Probiere in der Simulation 11, 12, 17 und 18 aus.
:::

## Oder: ||

Mit `||` (oder) ist das Ergebnis `true`, wenn **mindestens eine** der Bedingungen wahr ist. Es dürfen auch beide wahr sein.

```
tag == 6 || tag == 7
```

Diese Bedingung ist wahr, wenn `tag` den Wert 6 oder den Wert 7 hat, also am Samstag oder Sonntag.

> Die beiden senkrechten Striche `|` tippst du auf vielen Tastaturen mit AltGr und der Taste `<`, am Mac mit Option und 7.

## Übung: Wochenende

::: übung l08-wochenende
titel: Wochenende
auftrag: Frage einen Wochentag als Zahl ab (1 ist Montag, 7 ist Sonntag). Gib **Wochenende** aus, wenn es Samstag oder Sonntag ist, sonst **Werktag**.
test: 6 -> Wochenende
test: 7 -> Wochenende
test: 1 -> Werktag
test: 5 -> Werktag
braucht: verzweigung
tipp: Wochenende ist, wenn der Tag 6 **oder** 7 ist. Dafür brauchst du zwei Vergleiche in einer Bedingung.
tipp: Samstag ist 6, Sonntag ist 7. Verbinde die beiden Vergleiche mit `||`.
lösung: l08-wochenende-loesung.visustruct
:::

## Wertebereiche prüfen

Schulnoten gehen von 1 bis 6. Ob eine Note **im Bereich** liegt, prüfst du mit zwei Vergleichen und `&&`:

```
note >= 1 && note <= 6
```

::: grafik l08-zahlenstrahl.svg
Gültig ist der grüne Bereich von 1 bis 6, beide Ränder gehören dazu.
:::

Umgekehrt ist eine Note **außerhalb** des Bereichs, wenn sie zu klein **oder** zu groß ist:

::: diagramm l08-note.visustruct
Eine Note kleiner als 1 oder größer als 6 gibt es nicht.
:::

> Die Schreibweise aus Mathe `1 <= note <= 6` funktioniert nicht. Du musst sie in zwei Vergleiche aufteilen und mit `&&` verbinden.

## Übung: Gültige Note

::: übung l08-note-gueltig
titel: Gültige Note
auftrag: Frage eine Note als ganze Zahl ab. Gib **gültig** aus, wenn sie zwischen 1 und 6 liegt (1 und 6 gehören dazu), sonst **ungültig**.
test: 1 -> gültig
test: 6 -> gültig
test: 3 -> gültig
test: 0 -> ungültig
test: 7 -> ungültig
braucht: verzweigung
tipp: Eine gültige Note muss zwei Dinge gleichzeitig erfüllen: nicht zu klein **und** nicht zu groß.
tipp: Die Note muss größer oder gleich 1 und gleichzeitig kleiner oder gleich 6 sein.
lösung: l08-gueltig-loesung.visustruct
:::

## Nicht und Klammern

Mit `!` (nicht) drehst du eine Bedingung um: Aus `true` wird `false` und umgekehrt.

```
!(note >= 1 && note <= 6)
```

Das ist wahr, wenn die Note **nicht** im Bereich liegt, und bedeutet dasselbe wie `note < 1 || note > 6`.

Kommen `&&` und `||` zusammen vor, wird `&&` zuerst ausgewertet, so wie Punkt vor Strich. Setze lieber **Klammern**, dann ist klar, was zusammengehört:

```
(alter >= 12 && alter < 18) || schueler == 1
```

## Die Wahrheitstabelle

Eine **Wahrheitstabelle** zeigt auf einen Blick, was bei `&&`, `||` und `!` herauskommt. Links stehen alle vier Möglichkeiten für zwei Bedingungen `a` und `b`, rechts das Ergebnis:

::: grafik l09-wahrheitstabelle.svg
Grün ist true, rot ist false. Bei && gibt es nur eine grüne Zeile, bei || nur eine rote.
:::

Merksätze:

- `a && b` ist nur wahr, wenn **beide** wahr sind.
- `a || b` ist nur falsch, wenn **beide** falsch sind.
- `!a` dreht den Wert um.

::: angeberwissen
Der Datentyp `boolean` heißt nach **George Boole**. Der Engländer hat schon 1847 gezeigt, dass man mit wahr und falsch rechnen kann wie mit Zahlen, fast hundert Jahre bevor es den ersten Computer gab. Heute steckt seine Logik in jedem Chip.
:::

## Wahrheitswerte in Variablen

Das Ergebnis einer Bedingung ist ein **Wahrheitswert** vom Typ `boolean`. Du kannst ihn wie eine Zahl in einer Variablen speichern und später benutzen:

```
boolean wochenende = tag == 6 || tag == 7
```

In der Verzweigung steht dann nur noch `wochenende`. Das liest sich fast wie ein Satz: „Wenn Wochenende, dann …“. Schreibe nicht `wochenende == true`, denn `wochenende` ist ja schon true oder false.

Mit `!wochenende` fragst du nach dem Gegenteil, also nach einem Werktag.

::: ludwig
Lange Bedingungen werden übersichtlich, wenn du Teile davon in boolean-Variablen mit sprechenden Namen packst, zum Beispiel `boolean jugendlich = alter >= 12 && alter < 18`.
:::

## Spiel: Wahr oder falsch?

Jetzt bist du dran. Rechne jede Bedingung im Kopf aus. Nach jeder Antwort siehst du, wie VisuStruct sie Schritt für Schritt auswertet.

::: spiel
alter: 8..20
tag: 1..7
note: 0..7
schueler: boolean
wochenende: boolean
? alter >= 18
? tag == 6
? note != 3
? alter >= 12 && alter < 18
? tag == 6 || tag == 7
? schueler && wochenende
? !schueler
? note >= 1 && note <= 6
? !(alter < 18)
? schueler || alter >= 18
? (alter >= 12 && alter < 18) || schueler
? !(note >= 1 && note <= 6)
? !wochenende && tag != 3
? alter >= 12 && alter < 18 && !schueler
:::

## Übung: Schaltjahr

::: übung l08-schaltjahr
titel: Schaltjahr
auftrag: Ein Jahr ist ein Schaltjahr, wenn es durch 4 teilbar ist, aber nicht durch 100. Jahre, die durch 400 teilbar sind, sind trotzdem Schaltjahre.
Frage eine Jahreszahl ab und gib **Schaltjahr** oder **kein Schaltjahr** aus.
test: 2024 -> Schaltjahr
test: 2023 -> kein Schaltjahr
test: 1900 -> kein Schaltjahr
test: 2000 -> Schaltjahr
braucht: verzweigung
tipp: Prüfe die Regel zuerst an Beispielen: 2024 ist ein Schaltjahr, 1900 nicht, 2000 schon. Teilbar heißt: Der Rest ist 0.
tipp: Teilbar durch 4 heißt `jahr % 4 == 0`, nicht teilbar durch 100 heißt `jahr % 100 != 0`. Verbinde diese beiden mit `&&`, setze Klammern darum und hänge mit `||` den Fall für 400 an.
lösung: l08-schaltjahr-loesung.visustruct
:::

## Jetzt in Java

Das Jugendticket vom Anfang sieht in Java so aus:

```java editor
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Wie alt bist du?");
int alter = scanner.nextInt();
if (alter >= 12 && alter < 18) {
    System.out.println("Jugendticket");
} else {
    System.out.println("Kein Jugendticket");
}
```

Die Zeichen `&&`, `||` und `!` sind genau die, die du schon im Struktogramm benutzt. Sie kommen aus Java. Die ganze Bedingung steht wie immer in den runden Klammern nach `if`.

::: übung l09-java-schule
titel: Schule oder Freizeit
code: java
auftrag: Schreibe ein Java-Programm, das nach der Stunde fragt (0 bis 23). Von 8 bis einschließlich 15 Uhr gibt es **Schule** aus, sonst **Freizeit**.
test: 8 -> Schule
test: 15 -> Schule
test: 16 -> Freizeit
test: 7 -> Freizeit
braucht: verzweigung
tipp: Die Stunde muss zwei Bedingungen gleichzeitig erfüllen. Welcher Operator heißt „und“?
tipp: `if (stunde >= 8 && stunde <= 15) { … } else { … }`
lösung: l09-java-schule-loesung.visustruct
:::

## Lückentext: Bedingungen

::: lückentext
titel: Note und Wochenende
auftrag: Ergänze die fehlenden Operatoren und Wörter.
```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Welche Note?");
int note = scanner.nextInt();
if (note >= 1 [[&&]] note [[<=]] 6) {
    System.out.println("gültige Note");
} else {
    System.out.println("ungültige Note");
}
System.out.println("Welcher Tag (1 bis 7)?");
int tag = scanner.nextInt();
[[boolean]] wochenende = tag == 6 [[||]] tag == 7;
if ([[!]]wochenende) {
    System.out.println("Schultag");
}
```
erklärung: Eine Note ist gültig, wenn **beide** Bedingungen stimmen, also `&&`. Wochenende ist, wenn **eine** der beiden stimmt, also `||`. Das Ergebnis passt in eine `boolean`-Variable, und `!` dreht es um.
:::

## Fehler finden: Schulfrei

::: übung l09-java-fehler
titel: Schulfrei reparieren
code: java
auftrag: Das Programm soll bei Tag 6 (Samstag) und Tag 7 (Sonntag) **schulfrei** ausgeben, sonst **Schule**. Es gibt aber immer **Schule** aus.
  „Im Editor öffnen“ zeigt den Code im Bereich Code. Finde den Fehler, repariere ihn und klicke auf Prüfen.
start: l09-java-fehler-start.visustruct
test: 6 -> schulfrei
test: 7 -> schulfrei
test: 3 -> Schule
test: 1 -> Schule
braucht: verzweigung
tipp: Kann `tag` gleichzeitig 6 **und** 7 sein?
tipp: Es reicht, wenn eine der beiden Bedingungen stimmt: `tag == 6 || tag == 7`.
lösung: l09-java-fehler-loesung.visustruct
:::

## Warum läuft das nicht?

::: übung l09-java-laeuft-nicht
titel: Wochenende reparieren
code: java
auftrag: Tag 6 ist Samstag, Tag 7 ist Sonntag. Heute ist Tag 7, also soll **schulfrei** erscheinen. Das Programm läuft aber nicht.
  „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: l09-java-laeuft-nicht-start.visustruct
test: - -> schulfrei
braucht: verzweigung
tipp: Die Bedingung besteht aus zwei Teilen. Vergleiche in beiden Teilen den Namen der Variablen.
tipp: Auch im zweiten Teil heißt die Variable `tag` mit kleinem t: `if (tag == 6 || tag == 7) {`
lösung: l09-java-laeuft-nicht-loesung.visustruct
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann erklären, wann eine Verknüpfung mit && wahr ist. → Und: &&
- Ich kann erklären, wann eine Verknüpfung mit || wahr ist. → Oder: ||
- Ich kann eine Bedingung mit ! umdrehen. → Nicht und Klammern
- Ich kann prüfen, ob ein Wert in einem Bereich wie 1 bis 6 liegt. → Wertebereiche prüfen
- Ich kann die Wahrheitstabelle für &&, || und ! lesen. → Die Wahrheitstabelle
- Ich kann das Ergebnis einer Bedingung in einer boolean-Variablen speichern. → Wahrheitswerte in Variablen
- Ich kann zusammengesetzte Bedingungen sicher auswerten (im Spiel mindestens 8 von 10 richtig). → Spiel: Wahr oder falsch?
- Ich kann Bedingungen in Java mit && und || verknüpfen. → Jetzt in Java
:::

## Wissenstest

::: quiz
? Wann ist `a && b` wahr?
→ Und: &&
- [ ] Wenn a oder b wahr ist
- [x] Nur wenn a und b beide wahr sind
- [ ] Wenn genau eins von beiden wahr ist
> Bei && müssen beide Teile stimmen. Ist einer falsch, ist das Ganze falsch.

? Die Variable tag hat den Wert 6. Was ergibt `tag == 6 || tag == 7`?
→ Oder: ||
- [x] true
- [ ] false
> Bei || reicht es, wenn eine Seite wahr ist.

? Mit welcher Bedingung prüfst du, ob zahl zwischen 10 und 20 liegt (beide eingeschlossen)?
→ Wertebereiche prüfen
- [ ] 10 <= zahl <= 20
- [ ] zahl >= 10 || zahl <= 20
- [x] zahl >= 10 && zahl <= 20
> Mit || wäre jede Zahl erlaubt, denn jede Zahl ist größer als 10 oder kleiner als 20.

? Was ergibt `!(5 > 3)`?
→ Nicht und Klammern
- [ ] true
- [x] false
> 5 > 3 ist wahr, und ! dreht das um.

? Wie schreibst du in Java „alter ist mindestens 12 und kleiner als 18“?
→ Jetzt in Java
- [ ] if (12 <= alter < 18)
- [x] if (alter >= 12 && alter < 18)
- [ ] if (alter >= 12 || alter < 18)
> Jeder Vergleich steht für sich, verbunden mit `&&`.
:::
