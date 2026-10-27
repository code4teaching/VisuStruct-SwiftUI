---
titel: The night watchman
nach: 15
stufe: 1
---

The mBot2 is a night watchman. As long as it is dark (brightness below 20), it goes on patrol: 30 cm forward and then turn around. As soon as it gets light, its shift is over: it shows **Zzz** on its screen and sleeps.

::: übung vb-nachtwaechter
titel: The night watchman
auftrag: As long as the brightness is below 20, the mBot2 drives forward 30 cm and turns by 180°. Then it shows **Zzz** on its screen.
messwerte: getBrightness=5/80 -> drives, screen "Zzz"
messwerte: getBrightness=80 -> none, screen "Zzz"
braucht: whileSchleife
tipp: A while loop with `mbot.getBrightness() < 20`. Inside `mbot.forward(30)` and `mbot.turnRight(180)`.
tipp: After the loop is `mbot.showText("Zzz")`.
lösung: vb-nachtwaechter-loesung.visustruct
:::
