---
titel: Kleeblatt im Wald
nach: 4
kurs: 11
stufe: 2
---

Das Ziel liegt geradeaus. Auf dem Weg stehen Bäume, aber nie zwei direkt hintereinander. Steht ein Baum vor dem mBot2, fährt er außen herum und dann weiter geradeaus.

Ein Feld ist 30 cm groß. Steht ein Baum im nächsten Feld, misst der Ultraschallsensor weniger als 20 cm.

::: übung vb-wald
titel: Kleeblatt im Wald
auftrag: Der mBot2 soll in beiden Welten bis zum Ziel fahren und dabei jeden Baum umfahren, ohne anzustoßen.
welt: wald-1, wald-2
braucht: whileSchleife, verzweigung
tipp: Wie bei „Fahre bis zum Ziel“ läuft außen eine Schleife, bis der Liniensensor das Ziel sieht. In jedem Durchlauf gibt es zwei Möglichkeiten: Baum vorn oder frei.
tipp: Um einen Baum herum: nach links drehen, ein Feld vor, nach rechts drehen, zwei Felder vor, nach rechts drehen, ein Feld vor, nach links drehen.
lösung: vb-wald-loesung.visustruct
:::
