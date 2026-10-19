---
titel: Taschenrechner
nach: 9
stufe: 2
---

Ein kleiner Taschenrechner: zwei Zahlen und ein Rechenzeichen eingeben, das Ergebnis erscheint.

::: übung aufgabe-rechner
titel: Taschenrechner
auftrag: Frage nach zwei ganzen Zahlen und danach nach einem Rechenzeichen als Text: `+`, `-` oder `*`. Gib das Ergebnis aus. Bei einem anderen Zeichen gib **Unbekanntes Rechenzeichen** aus.
test: 3, 4, + -> 7
test: 10, 4, - -> 6
test: 6, 7, * -> 42
test: 1, 2, x -> Unbekanntes Rechenzeichen
braucht: fallauswahl
tipp: Das Rechenzeichen liest du mit `input: String zeichen "Rechenzeichen"` ein. Die Fallauswahl prüft `zeichen`, die Fälle heißen `"+"`, `"-"` und `"*"`, der letzte Fall ist `default`. Rechne in jedem Fall erst in einer Variablen und gib sie dann aus, sonst hängt `+` die Zahlen nur aneinander.
lösung: aufgabe-rechner-loesung.visustruct
:::
