---
titel: Grade average
nach: 13
stufe: 2
---

How did you do lately? The average is the sum of all grades divided by how many there are.

::: übung aufgabe-durchschnitt
titel: Grade average
auftrag: First ask how many grades will be typed in. Then read in exactly that many grades and output the average, only the number.
  For the grades 1 and 2 the average is **1.5**.
test: 2, 1, 2 -> 1.5
test: 3, 1, 2, 3 -> 2
test: 4, 2, 2, 3, 4 -> 2.75
braucht: forSchleife
tipp: You need the sum of all grades and how many there are. The average is the sum divided by the count.
tipp: The for loop runs from `int i = 0` while `i < count`. Inside it you read in a grade and add it to the sum. You store the average as a decimal number: `double average = sum * 1.0 / count`. The `* 1.0` makes sure that Java does not do whole-number division either.
lösung: aufgabe-durchschnitt-loesung.visustruct
:::

And now the same in Java:

::: übung aufgabe-durchschnitt-java
titel: Grade average in Java
code: java
auftrag: Now solve the task above in Java. The outputs stay exactly the same.
test: 2, 1, 2 -> 1.5
test: 3, 1, 2, 3 -> 2
test: 4, 2, 2, 3, 4 -> 2.75
braucht: forSchleife
tipp: `for (int i = 0; i < count; i++)` reads exactly as many grades as were given before.
tipp: Divide with `double average = sum * 1.0 / count;`. Without `* 1.0`, Java divides two `int` values as whole numbers, and 1.5 becomes 1.
lösung: aufgabe-durchschnitt-loesung.visustruct
:::
