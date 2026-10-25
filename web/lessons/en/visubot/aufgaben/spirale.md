---
titel: The spiral
nach: 2
kurs: 13
stufe: 2
---

The mBot2 should drive a square spiral: the first side is 10 cm long, the second 20 cm, the third 30 cm and so on. After each side it turns right.

You can also use the counter variable of a for loop inside the loop, for example in the brackets of **drive forward**. A calculation is allowed there too, such as `mbot.forward(i * 5)`.

::: übung vb-spirale
titel: The spiral
auftrag: Let the mBot2 drive a spiral with 8 sides: 10 cm, 20 cm, 30 cm … up to 80 cm. After each side it turns right.
fahrt: forward 10, turnRight, forward 20, turnRight, forward 30, turnRight, forward 40, turnRight, forward 50, turnRight, forward 60, turnRight, forward 70, turnRight, forward 80, turnRight
braucht: forSchleife
tipp: Let the counter variable run from 1 to 8. How long is the side in each pass then?
tipp: The brackets of **drive forward** contain a calculation with the counter variable.
lösung: vb-spirale-loesung.visustruct
:::
