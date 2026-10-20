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
tipp: Die PIN wird mindestens einmal abgefragt, deshalb passt eine Do-while-Schleife. Lege vorher `int pin = 0` und `int versuche = 0` an. Die Schleife wiederholt sich, solange `pin != 1234 && versuche < 3` gilt. Nach der Schleife entscheidet eine Verzweigung, was ausgegeben wird.
lösung: aufgabe-pin-loesung.visustruct
:::
