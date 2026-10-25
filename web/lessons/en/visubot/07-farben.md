---
titel: Recognising colours
bereich: VisuBot
kurz: The quad RGB sensor sees red, green, blue and yellow fields.
---

## A sensor that sees colours

::: mbot2
focus: lineSensor
view: bottom
:::

The [line sensor]{part=lineSensor} is really called a **quad RGB sensor**. “Quad” means four (four probes), “RGB” stands for red, green and blue. It shines these three colours on the floor and measures which colour comes back. That is how it recognises coloured fields.

| Sensor | Text | Value |
|---|---|---|
| Red? | `mbot.isRed()` | `true` or `false` |
| Green? | `mbot.isGreen()` | `true` or `false` |
| Blue? | `mbot.isBlue()` | `true` or `false` |
| Yellow? | `mbot.isYellow()` | `true` or `false` |

These sensors don't give a number but straight away **true** or **false**. So you don't need a comparison: `mbot.isRed()` is already a complete condition.

> With a `!` in front you turn a condition round: `!mbot.isRed()` means “**not** red”.

## Drive to red in the structure chart

::: übung vb-bis-rot
titel: Drive to red
auftrag: The mBot2 drives forward as long as it is **not** on a red field. In the second world there is a green field first, which should not bother it.
welt: farbe-1 -> forward 20
welt: farbe-2 -> forward 50
braucht: whileSchleife
tipp: Drag a while loop into the structure chart and the sensor **Colour red?** onto it. Write a `!` in front of `mbot.isRed()`.
tipp: The condition is `!mbot.isRed()`, inside the loop is **move forward**.
lösung: vb-bis-rot-loesung.visustruct
:::

## Now in Java: beep on green

Now you combine a loop with a branch: the mBot2 drives to blue. If it passes over a green field on the way, it beeps.

::: übung vb-java-blau-gruen
titel: To blue, beep on green
code: java
auftrag: Write in Java: the mBot2 drives forward as long as it is not on blue. After each step it checks: if it is on green, it plays a tone. In the second world there is no green field, so it must not beep there.
welt: farbe-3 -> forward 30, tone
welt: farbe-4 -> forward 30, noTone
braucht: whileSchleife, verzweigung
tipp: Outside is `while (!mbot.isBlue()) { … }`. Inside, first `mbot.forward();`.
tipp: After that, still inside the loop: `if (mbot.isGreen()) { mbot.playTone(880, 200); }`.
lösung: vb-java-blau-gruen-loesung.visustruct
:::

::: quiz
? The mBot2 is on a red field. What is `!mbot.isRed()`?
- [ ] true
- [x] false
> `mbot.isRed()` is true, the `!` turns it into false. So the loop stops.
? Why don't you write `== true` after `mbot.isGreen()`?
- [x] The sensor already gives true or false, that is already a condition.
- [ ] Because Java doesn't know `true`.
- [ ] Because colours are not numbers.
> `if (mbot.isGreen() == true)` works too, but says the same thing twice.
:::

::: checkliste
- I know the four colour sensors. → A sensor that sees colours
- I can turn a condition round with `!`. → Drive to red in the structure chart
- I can put a branch inside a loop. → Now in Java: beep on green
:::
