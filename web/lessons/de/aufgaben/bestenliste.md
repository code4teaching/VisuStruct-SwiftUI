---
titel: Bestenliste
nach: 19
stufe: 2
---

Fünf Ziegen sind beim Hindernislauf gestartet. Jetzt soll die Bestenliste an die Stalltür: die meisten Punkte oben, die wenigsten unten.

::: übung aufgabe-bestenliste
titel: Bestenliste
auftrag: Lies 5 Punktzahlen in ein Array ein. Sortiere das Array mit Bubblesort **absteigend**, also die größte Zahl zuerst. Gib danach die Liste mit Platz aus, zum Beispiel **1. 9**, in der nächsten Zeile **2. 9** und so weiter.
test: 3, 9, 2, 9, 1 -> 1. 9 | 2. 9 | 3. 3 | 4. 2 | 5. 1
test: 10, 20, 30, 40, 50 -> 1. 50 | 2. 40 | 3. 30 | 4. 20 | 5. 10
test: 5, 4, 3, 2, 1 -> 1. 5 | 2. 4 | 3. 3 | 4. 2 | 5. 1
braucht: forSchleife, verzweigung
tipp: Bubblesort aus Lektion 19 sortiert aufsteigend. Für absteigend drehst du nur den Vergleich der Nachbarn um.
tipp: Getauscht wird, wenn `punkte[i] < punkte[i + 1]` ist, mit einer Hilfsvariablen. Für die Ausgabe rechnest du zuerst `int platz = i + 1` aus und gibst dann `platz + ". " + punkte[i]` aus.
lösung: aufgabe-bestenliste-loesung.visustruct
:::
