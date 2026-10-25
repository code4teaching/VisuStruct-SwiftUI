---
titel: mBot2 in the case selection
---

## What does the line sensor see?

Under the mBot2 there is a line sensor with four probes. `mbot.getLine()` gives a number that says which probes see a black line:

| Value | Meaning |
|---|---|
| `0` | no line |
| `6` | the two middle ones see the line: it is right on top of it |
| `15` | all four see black: a cross line |

Many possible values of one number: that is a job for the case selection.

::: übung vb-k-linienmuster
titel: Line patterns
auftrag: Build a case selection on `mbot.getLine()`. For 6 the mBot2 drives forward 10 cm. For 0 it turns right. For 15 it shows **Cross line!** on its screen. In all other cases it drives forward 5 cm.
messwerte: getLine=6 -> forward 10
messwerte: getLine=0 -> turnRight
messwerte: getLine=15 -> none, screen "Cross line!"
messwerte: getLine=4 -> forward 5
braucht: fallauswahl
tipp: At the top of the case selection goes `mbot.getLine()`. Then add the cases `6`, `0` and `15`, plus the case for everything else.
tipp: For 6: `mbot.forward(10)`, for 0: `mbot.turnRight()`, for 15: `mbot.showText("Cross line!")`, otherwise: `mbot.forward(5)`.
lösung: vb-k-linienmuster-loesung.visustruct
:::
