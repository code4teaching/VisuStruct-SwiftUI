---
titel: Speisekarte
nach: 9
stufe: 1
---

In der Mensa bestellst du über eine Nummer. Das Programm sagt dir, welches Gericht zu der Nummer gehört.

::: übung aufgabe-speisekarte
titel: Speisekarte
auftrag: Frage nach einer Nummer. Gib bei 1 **Griechischer Salat**, bei 2 **Reis-Bowl** und bei 3 **Falafel-Wrap** aus. Bei jeder anderen Nummer gib **Bitte eine gültige Nummer wählen** aus.
test: 1 -> Griechischer Salat
test: 2 -> Reis-Bowl
test: 3 -> Falafel-Wrap
test: 7 -> Bitte eine gültige Nummer wählen
braucht: fallauswahl
tipp: Lies die Nummer mit `input: int nummer "Welches Gericht?"` ein. Die Fallauswahl prüft `nummer`, die Fälle heißen `1`, `2` und `3`. Alle anderen Nummern landen im Fall `default`.
lösung: aufgabe-speisekarte-loesung.visustruct
:::
