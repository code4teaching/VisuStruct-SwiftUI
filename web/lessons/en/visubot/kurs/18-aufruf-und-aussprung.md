---
titel: mBot2 with subprograms
---

## A subprogram for the square

The mBot2 can already drive a square. Now it should drive two squares of different sizes. Instead of building the loop twice, you write a subprogram `void square(int side)`. The side length is the parameter.

::: übung vb-k-quadrat-methode
titel: Two squares
auftrag: Build a subprogram `void square(int side)` that drives a square with side length `side`. The main program calls it twice: first with 30, then with 50.
fahrt: 4 x (forward 30, turnRight), 4 x (forward 50, turnRight)
braucht: aufruf
tipp: Create a new tab with **+** and give it the title `void square(int side)`. Inside is a for loop that runs `mbot.forward(side)` and `mbot.turnRight()` four times.
tipp: The main program contains two call boxes: `square(30)` and `square(50)`.
lösung: vb-k-quadrat-methode-loesung.visustruct
unterprogramm: vb-k-quadrat-unterprogramm-loesung.visustruct
:::
