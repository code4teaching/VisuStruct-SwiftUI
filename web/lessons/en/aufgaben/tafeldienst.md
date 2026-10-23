---
titel: Draw for board duty
nach: 15
stufe: 2
---

Who is on board duty this week, cleaning the board? Five names go into an array, then a number is drawn.

::: übung aufgabe-tafeldienst
titel: Draw for board duty
auftrag: Read five names into a String array. Then ask for a draw number from 1 to 5 and output **Board duty:** and the matching name.
  Draw number 1 belongs to the first name, 5 to the last one.
test: Ada, Ben, Cem, Dana, Emil, 3 -> Board duty: Cem
test: Ada, Ben, Cem, Dana, Emil, 1 -> Board duty: Ada
test: Lea, Max, Nia, Ole, Pia, 5 -> Board duty: Pia
braucht: forSchleife
tipp: First a loop reads in the five names. After that you do not need a loop any more, just one look into a slot.
tipp: You create the array with `String[] names = new String[5]`. Careful: the draw number starts at 1, the index at 0. So the name is in `names[pick - 1]`.
lösung: aufgabe-tafeldienst-loesung.visustruct
:::

And now the same in Java:

::: übung aufgabe-tafeldienst-java
titel: Draw for board duty in Java
code: java
auftrag: Now solve the task above in Java. The outputs stay exactly the same.
test: Ada, Ben, Cem, Dana, Emil, 3 -> Board duty: Cem
test: Ada, Ben, Cem, Dana, Emil, 1 -> Board duty: Ada
test: Lea, Max, Nia, Ole, Pia, 5 -> Board duty: Pia
braucht: forSchleife
tipp: Create an array for five names with `String[] names = new String[5];`.
tipp: In the loop: `names[i] = scanner.next();`. Ticket number 1 belongs to slot 0, so you output `names[pick - 1]`.
lösung: aufgabe-tafeldienst-loesung.visustruct
:::

> With `int pick = (int) (Math.random() * 5) + 1` you can also let chance draw the number. But for the automatic check we need a fixed input.
