---
titel: Clover in the forest
nach: 5
stufe: 2
---

The goal is straight ahead. There are trees on the way, but never two directly behind each other. If a tree stands in front of the mBot2, it drives around it and then continues straight ahead.

One square is 30 cm. If there is a tree in the next square, the ultrasonic sensor measures less than 20 cm.

::: übung vb-wald
titel: Clover in the forest
auftrag: In both worlds the mBot2 should drive to the goal and go around every tree without bumping into it.
welt: wald-1, wald-2
braucht: whileSchleife, verzweigung
tipp: As in "Drive to the goal", a loop on the outside runs until the line sensor sees the goal. In each pass there are two possibilities: tree ahead or free.
tipp: Around a tree: turn left, one square forward, turn right, two squares forward, turn right, one square forward, turn left.
lösung: vb-wald-loesung.visustruct
:::
