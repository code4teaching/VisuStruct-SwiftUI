---
titel: The staircase
nach: 2
stufe: 1
---

The mBot2 climbs a staircase, seen from above: each step is 20 cm deep and 20 cm wide.

::: übung vb-treppe
titel: The staircase
auftrag: Let the mBot2 drive three steps. One step: 20 cm forward, turn left, 20 cm forward, turn right. Use a loop.
fahrt: 3 x (forward 20, turnLeft, forward 20, turnRight)
braucht: forSchleife
tipp: Write down one step first. Then put it into a for loop that runs three times.
tipp: Inside the loop: `mbot.forward(20)`, `mbot.turnLeft()`, `mbot.forward(20)`, `mbot.turnRight()`.
lösung: vb-treppe-loesung.visustruct
:::
