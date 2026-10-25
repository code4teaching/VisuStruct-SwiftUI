---
titel: mBot2 with nested loops
---

## A cloverleaf of squares

In lesson 13 the mBot2 drove a square with a for loop. If it then makes a quarter turn and drives another square, four times, you get a cloverleaf of four squares. The square then sits inside a second loop.

::: übung vb-k-kleeblatt
titel: Cloverleaf
auftrag: Let the mBot2 drive four squares with sides of 30 cm. After each square it turns right once. Use two nested for loops.
fahrt: 4 x (4 x (forward 30, turnRight), turnRight)
schleifentiefe: 2
tipp: The inner loop drives a square: four times `mbot.forward(30)` and `mbot.turnRight()`.
tipp: The outer loop also runs four times. Inside are the inner loop and after it `mbot.turnRight()`. Give the loops different counters, for example `i` and `j`.
lösung: vb-k-kleeblatt-loesung.visustruct
:::
