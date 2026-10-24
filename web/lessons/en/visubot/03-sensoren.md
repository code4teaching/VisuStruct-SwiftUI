---
titel: Reading sensors
bereich: VisuBot
kurz: The mBot2 measures something, and your program decides.
---

## Commands and sensors

So far you have only given the mBot2 **commands**: move forward, turn right. It carried them out without paying attention to its surroundings.

Now the **sensors** join in. Among the [elements](#zeige-elemente) there is a group **mBot2 sensors** for them:

| Sensor | Text | What you get |
|---|---|---|
| Distance | `mbot.getDistance()` | distance to the next wall in cm, e.g. `38` |
| Line | `mbot.getLine()` | `0` if everything under the line sensor is bright, otherwise a number greater than 0 |

A sensor is **not a box of its own**. It gives you a number, and with that number you build a **condition**:

```java
mbot.getDistance() < 20
```

This means: "Is the wall closer than 20 cm?" The answer is true or false.

> How to build it: first drag a **branch** into the structure chart. Then drag the sensor **Distance** onto the branch. The condition now says `mbot.getDistance()`. You add the comparison `< 20` yourself.

## Wall ahead?

The mBot2 should decide by itself: if there is a wall ahead, it turns right. If the way is free, it drives forward a bit.

This exercise has **two worlds**: in one the wall is right in front of it, in the other there is plenty of space. Your program must do the right thing in both.

::: übung vb-wand-vorn
titel: Wall ahead?
auftrag: Build a branch with the condition `mbot.getDistance() < 20`. If **true**, the mBot2 turns right; if **false**, it moves forward.
welt: wand-nah -> turnRight
welt: wand-frei -> forward
braucht: verzweigung
tipp: Drag a branch into the structure chart and then the sensor **Distance** onto the branch. Write `< 20` after it.
tipp: The yes branch contains `mbot.turnRight()`, the no branch `mbot.forward()`.
lösung: vb-wand-vorn-loesung.visustruct
:::

## What does the sensor give you?

::: quiz
? The wall is 12 cm away. Is `mbot.getDistance() < 20` true or false?
- [x] true
- [ ] false
> 12 is less than 20, so the condition is true.
? The mBot2 is standing on a bright floor. What does `mbot.getLine()` give you?
- [x] 0
- [ ] 15
- [ ] the distance in cm
> 0 means: none of the four probes sees anything dark.
? Why is the sensor not a box of its own in the structure chart?
- [x] It does nothing, it only gives a value. You need that value in a condition.
- [ ] Because the mBot2 would get too slow otherwise.
- [ ] Because sensors only work in Java.
> Commands are statements. Sensors are values, just like a variable.
:::

::: checkliste
- I know the difference between a command and a sensor. → Commands and sensors
- I can build a sensor into a condition. → Wall ahead?
:::
