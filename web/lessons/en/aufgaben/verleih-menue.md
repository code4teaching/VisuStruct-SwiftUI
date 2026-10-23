---
titel: Rental menu
nach: 18
stufe: 2
---

At the rental machine you can book several vehicles one after another. The menu keeps coming back until you choose **0** to quit.

::: übung aufgabe-verleih
titel: Rental menu
auftrag: Keep asking for a choice: 1 = e-bike, 2 = e-scooter, 0 = quit. For 1 output **E-bike booked**, for 2 **E-scooter booked**, and for any other number **Invalid choice**.
  For 0 the program outputs **Bye** and leaves the loop with a Break.
test: 0 -> Bye
test: 1, 2, 0 -> E-bike booked | E-scooter booked | Bye
test: 2, 5, 1, 0 -> E-scooter booked | Invalid choice | E-bike booked | Bye
braucht: endlosschleife, aussprung
tipp: The menu runs again and again until someone chooses 0. An endless loop with a Break is good for that.
tipp: Use an endless loop. Inside it, first comes the input `input: int choice "1 = e-bike, 2 = e-scooter, 0 = quit"`, then a switch on `choice` with the cases `0`, `1`, `2` and `default`. The case `0` holds the output and, below it, the Break.
lösung: aufgabe-verleih-loesung.visustruct
:::

And now the same in Java:

::: übung aufgabe-verleih-java
titel: Rental menu in Java
code: java
auftrag: Now solve the task above in Java. The outputs stay exactly the same.
test: 0 -> Bye
test: 1, 2, 0 -> E-bike booked | E-scooter booked | Bye
test: 2, 5, 1, 0 -> E-scooter booked | Invalid choice | E-bike booked | Bye
braucht: endlosschleife, aussprung
tipp: `while (true) { … }` runs forever until a `break;` comes.
tipp: In Java, use `if`/`else if` here instead of `switch`: a `break;` inside a `switch` only leaves the `switch`, not the loop. `if (choice == 0) { System.out.println("Bye"); break; } else if (choice == 1) { … }`.
lösung: aufgabe-verleih-java-loesung.visustruct
:::
