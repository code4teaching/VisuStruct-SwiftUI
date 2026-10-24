---
titel: Check the PIN
nach: 12
stufe: 2
---

At a cash machine you have three tries for your PIN. If you type a wrong PIN three times, the card is blocked.

::: angeberwissen
John Shepherd-Barron, who set up the first cash machine in London in 1967, actually wanted six-digit PINs. But his wife said she could remember four digits at most. That is why your PIN has four digits today.
:::

::: übung aufgabe-pin
titel: Check the PIN
auftrag: The right PIN is 1234. Keep asking for the PIN until it is right or three tries have been used. Then output **PIN correct** or **Card blocked**.
test: 1234 -> PIN correct
test: 1111, 1234 -> PIN correct
test: 1, 2, 1234 -> PIN correct
test: 1, 2, 3 -> Card blocked
braucht: doUntilSchleife, verzweigung
tipp: The loop ends in two cases: when the PIN is right or when three tries have been used. Count the tries.
tipp: The PIN is asked for at least once, so a do-while loop fits. Create `int pin = 0` and `int attempts = 0` before it. The loop repeats as long as `pin != 1234 && attempts < 3`. After the loop, a branch decides what is output.
lösung: aufgabe-pin-loesung.visustruct
:::

And now the same in Java:

::: übung aufgabe-pin-java
titel: Check the PIN in Java
code: java
auftrag: Now solve the task above in Java. The outputs stay exactly the same.
test: 1234 -> PIN correct
test: 1111, 1234 -> PIN correct
test: 1, 2, 1234 -> PIN correct
test: 1, 2, 3 -> Card blocked
braucht: doUntilSchleife, verzweigung
tipp: `do { … } while (…);` asks at least once. There is a semicolon after `while (…)`.
tipp: Create `int pin = 0;` and `int attempts = 0;` first. In the loop: `int entered = scanner.nextInt();`, `pin = entered;` and `attempts++;`. The condition is `pin != 1234 && attempts < 3`.
lösung: aufgabe-pin-java-loesung.visustruct
:::
