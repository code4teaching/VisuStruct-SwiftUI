---
titel: Python und JavaScript
bereich: Vom Struktogramm zum Code
kurz: Python- und JavaScript-Code aus dem Struktogramm erzeugen und JavaScript direkt im Browser ausführen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- Python und JavaScript in der Code-Ansicht auswählen und vergleichen
- erklären, dass Python Blöcke durch Einrückung bildet und keine Datentypen braucht
- erklären, was VisuStruct beim Übersetzen nach Python anpasst
- JavaScript mit Im Browser testen ausführen
:::

## Dasselbe Diagramm, drei Sprachen

In der Code-Ansicht ([Code](#zeige-code) bei den Werkzeugen) wählst du oben die Sprache. Das Struktogramm bleibt gleich, nur die Schreibweise ändert sich. So kannst du die Sprachen gut vergleichen.

::: diagramm l18-beispiel.visustruct
Eine Zahl wird so lange um 3 verkleinert, bis sie nicht mehr größer als 0 ist.
:::

## Python

Für das Diagramm oben erzeugt VisuStruct diesen Python-Code:

```
zahl = int(input("Startwert?"))
while zahl > 0:
    print(zahl)
    zahl = zahl - 3
print("Ende")
```

Was in Python anders ist als in Java:

- Es gibt **keine Semikolons** und **keine geschweiften Klammern**. Was zu einer Schleife oder Verzweigung gehört, erkennt Python allein an der **Einrückung**. Hinter `while`, `if` und `else` steht ein Doppelpunkt.
- Variablen bekommen **keinen Datentyp**: aus `int zahl = 5` wird `zahl = 5`.
- Die Ausgabe heißt `print(…)`, die Eingabe `input(…)`. Für eine Zahl steht `int(…)` darum herum.
- Arrays heißen in Python **Listen**: aus `int[] zahlen = {2, 4, 6}` wird `zahlen = [2, 4, 6]`, und aus `zahlen.length` wird `len(zahlen)`.
- Eine einfache For-Schleife wie `int i = 0`, `i < 5`, `i++` wird zu `for i in range(5):`.

## Worauf du bei Python achten musst

Python ist an einigen Stellen strenger als Java. VisuStruct übersetzt die Java-Schreibweise beim Export deshalb gleich mit:

- **Text und Zahl mit +:** `"Summe: " + summe` wird zu `"Summe: " + str(summe)`. Ohne `str(…)` bricht Python ab.
- **i++ gibt es nicht:** daraus wird `i += 1`.
- **&&, || und !** heißen in Python `and`, `or` und `not`, `true` und `false` werden zu `True` und `False`.
- **Ganzzahlige Division:** In Python ergibt `7 / 2` immer 3.5. Teilt das Struktogramm zwei `int`-Werte, schreibt VisuStruct deshalb `7 // 2`, das ergibt wie in Java 3.
- **For-Schleifen:** Zählschleifen werden zu `for … in range(…)`, auch mit `i <= n`, Rückwärtszählen oder Schritten wie `i = i + 2`. Passt eine Schleife nicht dazu, wird daraus eine `while`-Schleife.
- **do-while gibt es nicht:** daraus wird `while True:` mit `if not (…): break` am Ende.

Ist ein Diagramm als **Pseudocode** markiert, steht nur ein Hinweis über dem Code. Dann ist der Text eine Skizze und kein lauffähiges Programm.

## JavaScript

Dasselbe Diagramm in JavaScript:

```
"use strict";

let zahl = parseInt((prompt("Startwert?") ?? "0"), 10);
while (zahl > 0) {
    console.log(zahl);
    zahl = zahl - 3;
}
console.log("Ende");
```

JavaScript sieht Java ähnlich: geschweifte Klammern, Semikolons, `while (…)` und `if (…)`. Die Unterschiede:

- Variablen werden mit `let` angelegt, ohne Datentyp. Konstanten mit `const`.
- Die Ausgabe heißt `console.log(…)`, die Eingabe `prompt(…)`. Mit `parseInt(…)` wird aus der Eingabe eine ganze Zahl.
- Arrays stehen in eckigen Klammern: `let zahlen = [2, 4, 6];`.
- `"use strict";` ganz oben sorgt dafür, dass JavaScript bei Tippfehlern in Variablennamen meckert.
- JavaScript kennt nur einen Zahlentyp. Teilt das Struktogramm zwei `int`-Werte, schreibt VisuStruct `Math.trunc(a / b)`. Dann fallen die Nachkommastellen wie in Java weg.

::: angeberwissen
JavaScript hat mit Java fast nichts zu tun. Brendan Eich hat es 1995 in nur zehn Tagen für den Browser Netscape gebaut. Erst hieß es Mocha, dann LiveScript. Weil Java gerade alle begeisterte, wurde es kurz vor dem Start aus Werbegründen in JavaScript umbenannt. Seitdem werden die beiden ständig verwechselt, bis heute. Programmierer sagen dazu: Java und JavaScript haben so viel gemeinsam wie Auto und Autogramm.
:::

## JavaScript im Browser ausführen

JavaScript ist die Sprache der Browser. Deshalb kann VisuStruct den Code **sofort ausführen**:

::: angeberwissen
Warum sind Links im Browser eigentlich blau? Ben Shneidermans Team hat 1985 untersucht, welche Farbe man gut sieht und die beim Lesen nicht stört. Gewonnen hat Hellblau. Rot fiel zwar mehr auf, aber man konnte sich den Text danach schlechter merken.
:::

1. Wähle in der Code-Ansicht **JavaScript**.
2. Klicke auf **Im Browser testen**.
3. Unter **Ausgabe** erscheint, was `console.log` ausgibt. Fragt das Programm mit `prompt` nach einem Wert, tippst du ihn ein und klickst auf **OK**.
4. Mit **Stopp** brichst du das Programm ab.

Eine Endlosschleife `while (true)` hält VisuStruct nach 100 000 Durchläufen von selbst an und meldet **Ausführung gestoppt: mögliche Endlosschleife.**

> Ein **Aufruf** braucht im JavaScript-Code ein Unterprogramm mit diesem Namen, sonst meldet JavaScript einen Fehler. Anders als die Simulation sucht der Browser nicht in den anderen Reitern.

## Übung: Python als Struktogramm

Dieses Python-Programm gibt alle geraden Zahlen von 0 bis zu einer Grenze aus:

```
grenze = int(input("Bis wohin?"))
for i in range(0, grenze + 1, 2):
    print(i)
```

`range(0, grenze + 1, 2)` heißt: bei 0 anfangen, vor `grenze + 1` aufhören, in Zweierschritten zählen.

::: übung l18-python
titel: Gerade Zahlen
auftrag: Baue das Python-Programm oben als Struktogramm mit einer For-Schleife nach. Bei der Grenze 7 gibt es 0, 2, 4 und 6 aus.
test: 7 -> 0 | 2 | 4 | 6
test: 4 -> 0 | 2 | 4
test: 0 -> 0
braucht: forSchleife
tipp: `range(0, grenze + 1, 2)` zählt von 0 bis zur Grenze in Zweierschritten. Das ist eine For-Schleife.
tipp: Die drei Felder der For-Schleife sind `int i = 0`, `i <= grenze` und `i = i + 2`.
lösung: l18-python-loesung.visustruct
:::

## Übung: JavaScript als Struktogramm

```
let alter = parseInt((prompt("Wie alt bist du?") ?? "0"), 10);
if (alter >= 16) {
    console.log("Du darfst wählen.");
} else {
    let jahre = 16 - alter;
    console.log("Noch " + jahre + " Jahre warten.");
}
```

::: übung l18-js
titel: Wählen ab 16
auftrag: Baue den JavaScript-Code oben als Struktogramm nach. Teste danach in der Code-Ansicht mit **JavaScript** und **Im Browser testen**, ob dein Code dasselbe ausgibt wie die Simulation.
test: 12 -> Noch 4 Jahre warten.
test: 16 -> Du darfst wählen.
test: 13 -> Noch 3 Jahre warten.
test: 40 -> Du darfst wählen.
braucht: verzweigung
tipp: Lies den Code Zeile für Zeile. `if` und `else` werden zu einer Verzweigung.
tipp: `prompt` und `parseInt` sind zusammen eine Eingabe: `input: int alter "Wie alt bist du?"`. Im false-Zweig stehen zwei Kästen: erst `int jahre = 16 - alter`, dann die Ausgabe.
lösung: l18-js-loesung.visustruct
:::

## Spiel: Welche Sprache?

::: spiel frage
titel: Spiel: Welche Sprache?
intro: Ludwig hat Zeilen aus drei Sprachen gemischt. Erkennst du, woher jede stammt? Acht Runden.
frage: In welcher Sprache ist das geschrieben?
antworten: Java | Python | JavaScript

runde:
    print(zahl)
richtig: Python
> Die Ausgabe heißt in Python `print(…)`, ohne Semikolon.

runde:
    console.log(zahl);
richtig: JavaScript
> `console.log` ist die Ausgabe in JavaScript.

runde:
    System.out.println(zahl);
richtig: Java
> Die lange Ausgabe mit `System.out` gibt es nur in Java.

runde:
    let zahlen = [2, 4, 6];
richtig: JavaScript
> `let` und eckige Klammern: ein Array in JavaScript.

runde:
    for i in range(5):
richtig: Python
> Doppelpunkt statt geschweifter Klammern und `range`: typisch Python.

runde:
    int[] zahlen = {2, 4, 6};
richtig: Java
> Nur Java schreibt den Datentyp `int[]` davor.

runde:
    zahl = int(input("Startwert?"))
richtig: Python
> Kein Datentyp vor der Variablen, kein Semikolon, und `int(…)` um die Eingabe.

runde:
    let zahl = parseInt(prompt("Startwert?"), 10);
richtig: JavaScript
> `prompt` fragt im Browser nach einem Wert, `parseInt` macht eine Zahl daraus.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann Python und JavaScript in der Code-Ansicht auswählen und vergleichen. → Dasselbe Diagramm, drei Sprachen
- Ich kann erklären, dass Python Blöcke durch Einrückung bildet und keine Datentypen braucht. → Python
- Ich kann erklären, was VisuStruct beim Übersetzen nach Python anpasst. → Worauf du bei Python achten musst
- Ich kann JavaScript mit Im Browser testen ausführen. → JavaScript im Browser ausführen
:::

## Wissenstest

::: quiz
? Woran erkennt Python, welche Zeilen zu einer Schleife gehören?
→ Python
- [ ] An den geschweiften Klammern
- [x] An der Einrückung
- [ ] Am Semikolon am Zeilenende

? Wie heißt `output: summe` in JavaScript?
→ Dasselbe Diagramm, drei Sprachen
- [ ] print(summe)
- [ ] System.out.println(summe);
- [x] console.log(summe);

? Welche Sprache kann VisuStruct direkt im Browser ausführen?
→ JavaScript im Browser ausführen
- [ ] Java
- [ ] Python
- [x] JavaScript
> Jeder Browser kann JavaScript ausführen. Für Java und Python brauchst du ein eigenes Programm.

? Was passiert in Python bei `print("Summe: " + summe)`, wenn summe die Zahl 7 ist?
→ Worauf du bei Python achten musst
- [ ] Es wird Summe: 7 ausgegeben.
- [x] Python meldet einen Fehler, weil Text und Zahl nicht mit + verbunden werden können.
- [ ] Es wird Summe: ausgegeben.
> Mit str(summe) wird aus der Zahl ein Text.
:::
