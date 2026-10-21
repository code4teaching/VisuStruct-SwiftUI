---
titel: Even or odd
nach: 8
stufe: 1
---

A number is even if there is no remainder when you divide it by 2. You calculate the remainder with `%`: `8 % 2` is 0, `7 % 2` is 1.

::: übung aufgabe-gerade
titel: Even or odd
auftrag: Ask for a whole number. Output whether it is even or odd. For 4 the output is **4 is even**, for 7 **7 is odd**.
test: 4 -> 4 is even
test: 7 -> 7 is odd
test: 0 -> 0 is even
test: 15 -> 15 is odd
braucht: verzweigung
tipp: A branch decides between even and odd. Even means: can be divided by 2 without a remainder.
tipp: The condition is `number % 2 == 0`. In the output you join the number and the text with `+`, e.g. `number + " is even"`.
lösung: aufgabe-gerade-loesung.visustruct
:::
