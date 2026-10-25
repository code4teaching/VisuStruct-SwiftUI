---
titel: mBot2 in the while loop
---

## Up to the wall

The mBot2 should drive up to the wall. It does not know beforehand how far that is. So it drives **as long as** the wall is still far enough away: a while loop with the distance `mbot.getDistance()` in the condition.

::: übung vb-k-bis-wand
titel: Up to the wall
auftrag: The mBot2 drives forward in steps of 10 cm as long as the wall is more than 15 cm away. Your program must work in all three worlds. Above the simulation you choose which world you see.
welt: wand-kurz, wand-mittel, wand-lang
braucht: whileSchleife
tipp: A while loop with the condition `mbot.getDistance() > 15`.
tipp: Inside the loop there is only `mbot.forward()`. Without a number it drives 10 cm.
lösung: vb-bis-wand-loesung.visustruct
:::

> What happens if you forget the loop and just write `mbot.forward(50)` once? In the short world it bumps into the wall, in the long one it does not get there.
