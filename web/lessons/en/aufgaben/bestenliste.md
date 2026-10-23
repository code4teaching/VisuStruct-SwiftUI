---
titel: Leaderboard
nach: 19
stufe: 2
---

Five goats have run the obstacle race. Now the leaderboard goes on the stable door: most points at the top, fewest at the bottom.

::: übung aufgabe-bestenliste
titel: Leaderboard
auftrag: Read 5 scores into an array. Sort the array with bubble sort in **descending** order, so the biggest number comes first. Then output the list with places, for example **1. 9**, on the next line **2. 9** and so on.
test: 3, 9, 2, 9, 1 -> 1. 9 | 2. 9 | 3. 3 | 4. 2 | 5. 1
test: 10, 20, 30, 40, 50 -> 1. 50 | 2. 40 | 3. 30 | 4. 20 | 5. 10
test: 5, 4, 3, 2, 1 -> 1. 5 | 2. 4 | 3. 3 | 4. 2 | 5. 1
braucht: forSchleife, verzweigung
tipp: Bubble sort from lesson 19 sorts in ascending order. For descending order you only turn round the comparison of the neighbours.
tipp: Swap when `points[i] < points[i + 1]`, using a temporary variable. For the output, first work out `int place = i + 1` and then output `place + ". " + points[i]`.
lösung: aufgabe-bestenliste-loesung.visustruct
:::

And now the same in Java:

::: übung aufgabe-bestenliste-java
titel: Leaderboard in Java
code: java
auftrag: Now solve the task above in Java. The outputs stay exactly the same.
test: 3, 9, 2, 9, 1 -> 1. 9 | 2. 9 | 3. 3 | 4. 2 | 5. 1
test: 10, 20, 30, 40, 50 -> 1. 50 | 2. 40 | 3. 30 | 4. 20 | 5. 10
test: 5, 4, 3, 2, 1 -> 1. 5 | 2. 4 | 3. 3 | 4. 2 | 5. 1
braucht: forSchleife, verzweigung
tipp: Read each number into a variable first and then put it into the array: `int number = scanner.nextInt();` and `points[i] = number;`.
tipp: The swap needs a temporary variable in Java too: `int temp = points[i]; points[i] = points[i + 1]; points[i + 1] = temp;`.
lösung: aufgabe-bestenliste-loesung.visustruct
:::
