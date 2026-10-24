---
titel: Fibonacci-Zahlen
nach: 13
stufe: 2
---

Bei den Fibonacci-Zahlen ist jede Zahl die Summe der beiden Zahlen davor. Die Folge beginnt mit 1 und 1:

1, 1, 2, 3, 5, 8, 13, 21, …

Diese Zahlen findest du erstaunlich oft in der Natur, zum Beispiel bei der Anordnung von Sonnenblumenkernen.

::: ludwig
Erinnerst du dich ans **Tauschen** aus Lektion 5? Dort brauchtest du eine Hilfsvariable, weil `a = b` den alten Wert von `a` überschreibt. Hier ist es genauso: Bevor `zahl2` die neue Zahl bekommt, muss ihr alter Wert in `zahl1` gerettet sein. Achte also auf die **Reihenfolge**: erst `zahl1 = zahl2`, dann `zahl2 = zahl3`. Dieses Weiterschieben und Tauschen brauchst du später wieder, zum Beispiel beim Sortieren in Lektion 19.
:::

::: angeberwissen
Leonardo von Pisa, genannt Fibonacci, stellte 1202 in seinem Rechenbuch eine Aufgabe über Kaninchen: Jedes Kaninchenpaar bekommt ab dem zweiten Monat jeden Monat ein neues Paar. Wie viele Paare gibt es nach einem Jahr? Die Antwort ist diese Zahlenfolge. Ziegen kamen in dem Buch leider nicht vor.
:::

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

Und jetzt dasselbe in Java:

::: übung aufgabe-fibonacci-java
titel: Fibonacci-Zahlen in Java
code: java
auftrag: Löse die Aufgabe von oben jetzt in Java. Die Ausgaben bleiben genau dieselben.
test: 5 -> 1 | 1 | 2 | 3 | 5
test: 8 -> 1 | 1 | 2 | 3 | 5 | 8 | 13 | 21
test: 2 -> 1 | 1
braucht: forSchleife
tipp: Die ersten beiden Zahlen gibst du vor der Schleife aus. Die `for`-Schleife beginnt dann bei `int i = 2`.
tipp: Im Rumpf: `int zahl3 = zahl1 + zahl2;`, ausgeben, dann `zahl1 = zahl2;` und `zahl2 = zahl3;`.
lösung: aufgabe-fibonacci-loesung.visustruct
:::

::: quiz
? Warum muss in der Schleife `zahl1 = zahl2` vor `zahl2 = zahl3` stehen?
- [ ] Weil Java die Zuweisungen sonst nicht erlaubt
- [x] Weil sonst der alte Wert von zahl2 überschrieben ist, bevor zahl1 ihn bekommt
- [ ] Die Reihenfolge ist egal
> Andersherum hätten zahl1 und zahl2 danach denselben Wert. Wie beim Tauschen gilt: Erst retten, dann überschreiben.
:::
