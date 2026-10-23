---
titel: PIN prüfen
nach: 12
stufe: 2
---

Am Geldautomaten hast du drei Versuche für deine PIN. Gibst du dreimal eine falsche PIN ein, wird die Karte gesperrt.

::: übung aufgabe-pin
titel: PIN prüfen
auftrag: Die richtige PIN ist 1234. Frage so lange nach der PIN, bis sie richtig ist oder drei Versuche verbraucht sind. Gib danach **PIN richtig** oder **Karte gesperrt** aus.
test: 1234 -> PIN richtig
test: 1111, 1234 -> PIN richtig
test: 1, 2, 1234 -> PIN richtig
test: 1, 2, 3 -> Karte gesperrt
braucht: doUntilSchleife, verzweigung
tipp: Die Schleife endet in zwei Fällen: wenn die PIN stimmt oder wenn drei Versuche verbraucht sind. Zähle die Versuche mit.
tipp: Die PIN wird mindestens einmal abgefragt, deshalb passt eine Do-while-Schleife. Lege vorher `int pin = 0` und `int versuche = 0` an. Die Schleife wiederholt sich, solange `pin != 1234 && versuche < 3` gilt. Nach der Schleife entscheidet eine Verzweigung, was ausgegeben wird.
lösung: aufgabe-pin-loesung.visustruct
:::

Und jetzt dasselbe in Java:

::: übung aufgabe-pin-java
titel: PIN prüfen in Java
code: java
auftrag: Löse die Aufgabe von oben jetzt in Java. Die Ausgaben bleiben genau dieselben.
test: 1234 -> PIN richtig
test: 1111, 1234 -> PIN richtig
test: 1, 2, 1234 -> PIN richtig
test: 1, 2, 3 -> Karte gesperrt
braucht: doUntilSchleife, verzweigung
tipp: `do { … } while (…);` fragt mindestens einmal. Hinter `while (…)` steht ein Semikolon.
tipp: Lege vorher `int pin = 0;` und `int versuche = 0;` an. In der Schleife: `int eingabe = scanner.nextInt();`, `pin = eingabe;` und `versuche++;`. Die Bedingung ist `pin != 1234 && versuche < 3`.
lösung: aufgabe-pin-java-loesung.visustruct
:::
