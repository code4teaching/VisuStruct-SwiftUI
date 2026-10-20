---
titel: Verleih-Menü
nach: 18
stufe: 2
---

Am Verleih-Automaten kannst du nacheinander mehrere Fahrzeuge buchen. Das Menü erscheint immer wieder, bis du **0** für Ende wählst.

::: übung aufgabe-verleih
titel: Verleih-Menü
auftrag: Frage immer wieder nach einer Auswahl: 1 = E-Bike, 2 = E-Scooter, 0 = Ende. Gib bei 1 **E-Bike gebucht** und bei 2 **E-Scooter gebucht** aus, bei jeder anderen Zahl **Ungültige Auswahl**.
  Bei 0 gibt das Programm **Tschüss** aus und verlässt die Schleife mit einem Aussprung.
test: 0 -> Tschüss
test: 1, 2, 0 -> E-Bike gebucht | E-Scooter gebucht | Tschüss
test: 2, 5, 1, 0 -> E-Scooter gebucht | Ungültige Auswahl | E-Bike gebucht | Tschüss
braucht: endlosschleife, aussprung
tipp: Nimm eine Endlosschleife. Darin steht zuerst die Eingabe `input: int wahl "1 = E-Bike, 2 = E-Scooter, 0 = Ende"`, danach eine Fallauswahl über `wahl` mit den Fällen `0`, `1`, `2` und `default`. Im Fall `0` stehen die Ausgabe und darunter der Aussprung.
lösung: aufgabe-verleih-loesung.visustruct
:::
