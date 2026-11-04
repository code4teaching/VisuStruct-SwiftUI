---
titel: Reading sensors
bereich: Sensors and decisions
kurz: The mBot2 measures something, and your program decides.
---

## Skills I will gain now

::: kompetenzen
- explain the difference between a command and a sensor
- build a sensor into a condition
:::

## Commands and sensors

So far you have only given the mBot2 **commands**: move forward, turn right. It carried them out without paying attention to its surroundings.

Now the **sensors** join in. Among the [elements](#zeige-elemente) there is a group **mBot2 sensors** for them:

| Sensor | Text | What you get |
|---|---|---|
| Distance | `mbot.getDistance()` | distance to the next wall in cm, e.g. `38` |
| Line | `mbot.getLine()` | `0` if everything under the line sensor is bright, otherwise a number greater than 0 |

The mBot2 has even more sensors: colours, buttons and joystick, light, loudness and tilt. You get to know each of them in lessons 6 to 13, the motors in lesson 20 and the stopwatch and battery in lesson 21.

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
tipp: The true branch contains `mbot.turnRight()`, the false branch `mbot.forward()`.
lösung: vb-wand-vorn-loesung.visustruct
:::

## What does the sensor give you?

A sensor gives you a **value**, just like a variable. When the mBot2 drives on, the value changes: the distance gets smaller as the wall comes closer. Only a **comparison** turns the value into a question with the answer `true` or `false`.

| Condition | Question | Answer at a distance of 38 cm |
|---|---|---|
| `mbot.getDistance() < 20` | Is the wall closer than 20 cm? | `false` |
| `mbot.getDistance() > 30` | Is there more than 30 cm of space? | `true` |
| `mbot.getLine() == 0` | Is everything bright under the mBot2? | depends on the floor |

You can compare with `<` (less than), `>` (greater than), `<=` (less than or equal), `>=` (greater than or equal), `==` (equal) and `!=` (not equal).

> For "equal" you write **two** equals signs: `==`. A single `=` puts a value into a variable, which is something completely different.

> 📘 **More without the robot:** VisuStruct has the lesson ["Branch"](?visustruct&lektion=08-verzweigung). It opens in a new window.

::: übung vb-fehler-04-sensoren
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Wall ahead?", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-04-sensoren-start.visustruct
welt: wand-nah -> turnRight
welt: wand-frei -> forward
tipp: Read the error message carefully. In which box does the simulation stop? Java is case-sensitive.
tipp: It should be `mbot.turnRight()`.
lösung: vb-wand-vorn-loesung.visustruct
:::

## Game: Command or sensor?

::: spiel frage
titel: Game: Command or sensor?
intro: Does the line do something, or does it give a value? Eight rounds.
antworten: command | sensor

runde:
    mbot.forward(30)
frage: Command or sensor?
richtig: command
> It drives 30 cm. That is doing something.

runde:
    mbot.getDistance()
frage: Command or sensor?
richtig: sensor
> It gives the distance in cm, for example 38.

runde:
    mbot.turnRight()
frage: Command or sensor?
richtig: command
> Turning is doing something.

runde:
    mbot.getLine()
frage: Command or sensor?
richtig: sensor
> It gives 0 or a number greater than 0.

runde:
    mbot.playTone(440, 300)
frage: Command or sensor?
richtig: command
> A tone is an output.

runde:
    mbot.isButtonA()
frage: Command or sensor?
richtig: sensor
> It gives true or false: is button A pressed?

runde:
    mbot.showText("Hello")
frage: Command or sensor?
richtig: command
> Showing something is doing something.

runde:
    mbot.getBrightness()
frage: Command or sensor?
richtig: sensor
> It measures how bright it is, from 0 to 100.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain the difference between a command and a sensor. → Commands and sensors
- I can build a sensor into a condition. → Wall ahead?
:::

## Quiz

::: quiz
? The wall is 12 cm away. Is `mbot.getDistance() < 20` true or false?
→ Wall ahead?
- [x] true
- [ ] false
> 12 is less than 20, so the condition is true.
? The mBot2 is standing on a bright floor. What does `mbot.getLine()` give you?
→ Commands and sensors
- [x] 0
- [ ] 15
- [ ] the distance in cm
> 0 means: none of the four probes sees anything dark.
? Why is the sensor not a box of its own in the structure chart?
→ Wall ahead?
- [x] It does nothing, it only gives a value. You need that value in a condition.
- [ ] Because the mBot2 would get too slow otherwise.
- [ ] Because sensors only work in Java.
> Commands are statements. Sensors are values, just like a variable.
:::
