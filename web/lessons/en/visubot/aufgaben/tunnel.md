---
titel: The tunnel finder
nach: 5
stufe: 3
---

The mBot2 should stop in the first **tunnel square**: a square with a wall on the left **and** a wall on the right. Squares with only one wall don't count. In the simulation the right square is light green, but the line sensor can't see it.

The ultrasonic sensor only looks forward. To look left, the mBot2 turns left, measures and turns back again.

You remember the measured value in a **variable**, for example with a statement `left = mbot.getDistance()`. At the start you create it: `int left = 99`.

::: übung vb-tunnel
titel: The tunnel finder
auftrag: Program the mBot2 so that it stops in the first tunnel square in both worlds. One square is 30 cm.
welt: tunnel-1, tunnel-2
braucht: doUntilSchleife
tipp: In each pass the mBot2 drives one square forward and then looks left and right. Remember both distances in variables. At the end it faces forward again.
tipp: A loop that drives first and checks afterwards fits here. It keeps going as long as at least 20 cm are free on the left **or** on the right: `left >= 20 || right >= 20`.
lösung: vb-tunnel-loesung.visustruct
:::
