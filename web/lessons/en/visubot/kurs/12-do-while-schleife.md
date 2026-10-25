---
titel: mBot2 in the do-while loop
---

## Drive first, then look

At the start the mBot2 stands on a light floor and should drive to a red field. `mbot.getColor().equals("red")` is true when its colour sensor sees red.

Because it is certainly not on red at the beginning, it can **first** drive and **then** check: a do-while loop. It repeats as long as it is **not** on red.

::: übung vb-k-bis-rot
titel: Until red
auftrag: Build a do-while loop: the mBot2 drives forward 10 cm as long as it is not on red.
welt: farbe-1 -> forward 20
welt: farbe-2 -> forward 50
braucht: doUntilSchleife
tipp: Inside the loop goes `mbot.forward()`. The condition is at the bottom.
tipp: The condition is `!mbot.getColor().equals("red")`. The `!` means “not”.
lösung: vb-k-bis-rot-loesung.visustruct
:::
