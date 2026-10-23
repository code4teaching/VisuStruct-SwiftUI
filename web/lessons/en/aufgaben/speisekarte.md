---
titel: Menu
nach: 10
stufe: 1
---

In the school canteen you order by number. The program tells you which dish belongs to the number.

::: übung aufgabe-speisekarte
titel: Menu
auftrag: Ask for a number. For 1 output **Greek salad**, for 2 **Rice bowl** and for 3 **Falafel wrap**. For any other number output **Please choose a valid number**.
test: 1 -> Greek salad
test: 2 -> Rice bowl
test: 3 -> Falafel wrap
test: 7 -> Please choose a valid number
braucht: fallauswahl
tipp: A switch fits several fixed numbers. What happens with all the other numbers?
tipp: Read in the number with `input: int pick "Which dish?"`. The switch checks `pick`, and the cases are called `1`, `2` and `3`. All other numbers end up in the case `default`.
lösung: aufgabe-speisekarte-loesung.visustruct
:::

And now the same in Java:

::: übung aufgabe-speisekarte-java
titel: Menu in Java
code: java
auftrag: Now solve the task above in Java. The outputs stay exactly the same.
test: 1 -> Greek salad
test: 2 -> Rice bowl
test: 3 -> Falafel wrap
test: 7 -> Please choose a valid number
braucht: fallauswahl
tipp: In Java this is a switch: `switch (pick) { … }`.
tipp: Every case looks like this: `case 1 -> { System.out.println("…"); }`. All other numbers go to `default -> { … }`.
lösung: aufgabe-speisekarte-loesung.visustruct
:::
