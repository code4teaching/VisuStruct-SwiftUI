---
titel: Check the PIN
nach: 12
stufe: 2
---

At a cash machine you have three tries for your PIN. If you type a wrong PIN three times, the card is blocked.

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
