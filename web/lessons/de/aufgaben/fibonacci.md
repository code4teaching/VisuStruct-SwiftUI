---
titel: Fibonacci-Zahlen
nach: 13
stufe: 2
---

Bei den Fibonacci-Zahlen ist jede Zahl die Summe der beiden Zahlen davor. Die Folge beginnt mit 1 und 1:

1, 1, 2, 3, 5, 8, 13, 21, …

Diese Zahlen findest du erstaunlich oft in der Natur, zum Beispiel bei der Anordnung von Sonnenblumenkernen.

::: übung aufgabe-fibonacci
titel: Fibonacci-Zahlen
auftrag: Frage, wie viele Fibonacci-Zahlen ausgegeben werden sollen. Gib dann genau so viele aus, jede in einer eigenen Zeile. Du kannst davon ausgehen, dass mindestens 2 eingegeben wird.
test: 5 -> 1 | 1 | 2 | 3 | 5
test: 8 -> 1 | 1 | 2 | 3 | 5 | 8 | 13 | 21
test: 2 -> 1 | 1
braucht: forSchleife
tipp: Jede neue Zahl ist die Summe der beiden vorherigen. Du musst dir also immer die letzten zwei Zahlen merken.
tipp: Merke dir die beiden letzten Zahlen in `zahl1` und `zahl2` und gib beide vor der Schleife aus. Die Schleife beginnt bei `int i = 2`. Darin berechnest du `int zahl3 = zahl1 + zahl2`, gibst sie aus und schiebst dann weiter: `zahl1 = zahl2` und `zahl2 = zahl3`.
lösung: aufgabe-fibonacci-loesung.visustruct
:::
