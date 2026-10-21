---
titel: Binary number
nach: 11
stufe: 3
---

Computers calculate with only two digits: 0 and 1. This is how you convert a number into the **binary system**:

1. Divide the number by 2 and remember the remainder (0 or 1).
2. Carry on with the result without the remainder.
3. Repeat this until the number is 0.

The remainders read **from bottom to top** give the binary number. For 6 the remainders are 0, 1, 1, so the binary number is 110.

::: übung aufgabe-binaer
titel: Binary number
auftrag: Ask for a whole number greater than 0 and output it as a binary number. For 6 the output is **110**, for 13 **1101**.
test: 6 -> 110
test: 13 -> 1101
test: 1 -> 1
test: 8 -> 1000
braucht: whileSchleife
tipp: Keep dividing the number by 2 and remember every remainder. The remainders read backwards give the binary number.
tipp: Collect the digits in a text: `String binary = ""`. In the loop you calculate `int remainder = number % 2` and add the remainder at the **front**: `binary = remainder + binary`. After that, `number = number / 2`. Because number is a whole number, the remainder is dropped.
lösung: aufgabe-binaer-loesung.visustruct
:::
