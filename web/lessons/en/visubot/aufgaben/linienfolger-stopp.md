---
titel: Line follower with stop
nach: 20
stufe: 3
---

The mBot2 follows a black line and stops at the red field at its end.

For this it steps on the gas with **wheels separately**: `mbot.drive(40, 40)` turns both wheels equally fast, it keeps driving straight ahead until another driving command comes. `mbot.drive(10, 40)` makes a left curve, `mbot.drive(40, 10)` a right curve. `mbot.stop()` stops it.

You ask the two middle probes of the line sensor with `mbot.isLineLeft()` and `mbot.isLineRight()`. If both see the line, it drives straight ahead. If only the left one sees it, it steers left, if only the right one sees it, right.

::: übung vb-linienfolger-stopp
titel: Line follower with stop
auftrag: As long as the mBot2 is not on red, it follows the line. Then it stops. In the second world the line winds about.
welt: linie-rot-1, linie-rot-2
braucht: whileSchleife, verzweigung
tipp: On the outside a while loop with `!mbot.getColor().equals("red")`, after it **stop**.
tipp: Inside the loop: if `mbot.isLineLeft() && mbot.isLineRight()`, then `mbot.drive(40, 40)`. Otherwise, if `mbot.isLineLeft()`, then `mbot.drive(10, 40)`. Otherwise, if `mbot.isLineRight()`, then `mbot.drive(40, 10)`.
lösung: vb-linienfolger-stopp-loesung.visustruct
:::
