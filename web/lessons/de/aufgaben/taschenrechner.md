---
titel: Taschenrechner
nach: 10
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
tipp: Lies alle drei Werte ein. Eine Fallauswahl über das Rechenzeichen entscheidet dann, was gerechnet wird.
tipp: Das Rechenzeichen liest du mit `input: String zeichen "Rechenzeichen"` ein. Die Fallauswahl prüft `zeichen`, die Fälle heißen `"+"`, `"-"` und `"*"`, der letzte Fall ist `default`. Rechne in jedem Fall erst in einer Variablen und gib sie dann aus, sonst hängt `+` die Zahlen nur aneinander.
lösung: aufgabe-rechner-loesung.visustruct
:::

Und jetzt dasselbe in Java:

::: übung aufgabe-rechner-java
titel: Taschenrechner in Java
code: java
auftrag: Löse die Aufgabe von oben jetzt in Java. Die Ausgaben bleiben genau dieselben.
test: 3, 4, + -> 7
test: 10, 4, - -> 6
test: 6, 7, * -> 42
test: 1, 2, x -> Unbekanntes Rechenzeichen
braucht: fallauswahl
tipp: Das Rechenzeichen ist ein Text. Du liest es mit `String zeichen = scanner.next();` ein.
tipp: `switch (zeichen) { case "+" -> { … } … default -> { … } }`. Bei Texten stehen die Fälle in Anführungszeichen.
lösung: aufgabe-rechner-loesung.visustruct
:::
