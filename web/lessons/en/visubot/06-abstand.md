---
titel: The ultrasonic sensor
bereich: Sensors and decisions
kurz: Measure the distance, keep your distance, and do it all in Java.
---

## Skills I will gain now

::: kompetenzen
- explain what `mbot.getDistance()` measures
- put one branch inside another
- write a while loop with the distance in Java
:::

## How does the mBot2 measure distance?

::: mbot2
focus: ultrasonic
view: front
:::

The [ultrasonic sensor]{part=ultrasonic} sends out a very high sound and waits for the echo. The longer the echo takes, the further away the wall is. `mbot.getDistance()` gives you the distance in **centimetres**, from about 3 to 300.

| Sensor | Text | Value |
|---|---|---|
| Distance | `mbot.getDistance()` | whole number in cm, e.g. `38` |

> In the [simulation](#zeige-simulation) the current distance is always shown below the world. With a real mBot2 you can hold your hand in front of the sensor and watch the number change.

## Keep your distance in the structure chart

The mBot2 should behave like a dog on a lead: if your hand is too close (under 10 cm), it backs away. If it is too far away (over 20 cm), it comes closer. In between, it stays where it is.

For this you need two branches, one inside the other. The outer one checks “too close?”, the inner one in the false branch checks “too far?”.

::: übung vb-abstand-halten
titel: Keep your distance
auftrag: Build a structure chart: if the distance is less than 10, the mBot2 drives back. Otherwise: if the distance is greater than 20, it drives forward. Otherwise it does nothing.
messwerte: getDistance=5 -> backward
messwerte: getDistance=35 -> forward
messwerte: getDistance=15 -> none
braucht: verzweigung
tipp: Drag a branch into the structure chart and the sensor **Distance** onto it. Write `< 10` after it. The true branch gets **move back**.
tipp: The false branch gets a second branch with `mbot.getDistance() > 20` and **move forward** in its true branch. Its false branch stays empty.
lösung: vb-abstand-halten-loesung.visustruct
:::

> When checking, VisuStruct sets the distance to 5, 35 and 15 cm one after the other and looks at what your mBot2 does.

## Now in Java

In the [Code](#zeige-codelive) area you already see your structure chart as Java code. A branch is called `if` there, the false branch is `else`:

```java
if (mbot.getDistance() < 10) {
    mbot.backward();
} else {
    ...
}
```

You type a sensor like a command: `mbot.` and then `getDistance()`. After the dot the editor suggests all commands and sensors.

::: übung vb-java-wand-piep
titel: To the wall and beep
code: java
auftrag: Write in Java: the mBot2 drives forward as long as the wall is more than 15 cm away. Then it plays a tone. There are three worlds.
welt: wand-kurz -> tone
welt: wand-mittel -> tone
welt: wand-lang -> tone
braucht: whileSchleife
tipp: A while loop in Java is `while (condition) { … }`. The condition is `mbot.getDistance() > 15`.
tipp: Inside the loop is `mbot.forward();`, after the loop `mbot.playTone(440, 300);`.
lösung: vb-java-wand-piep-loesung.visustruct
:::

::: übung vb-fehler-06-abstand
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "To the wall and beep", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-06-abstand-start.visustruct
welt: wand-kurz -> tone
welt: wand-mittel -> tone
welt: wand-lang -> tone
tipp: Count the numbers in the brackets. How many does the command need? You can find it under **Reference**.
tipp: It should be `mbot.playTone(440, 300)`.
lösung: vb-java-wand-piep-loesung.visustruct
:::

## Game: Defuse the bomb

::: spiel bombe
titel: Game: Defuse the bomb
intro: Every program contains **exactly one mistake**, and the bomb is ticking. Read what the mBot2 should do and tap the wrong line before time runs out. Six rounds, 30 seconds each.
zeit: 30

runde:
    if (mbot.getDistance() < 10) {
        mbot.forward();
    }
    if (mbot.getDistance() > 20) {
        mbot.forward();
    }
frage: Under 10 cm it should drive back, over 20 cm forward.
fehler: 2
besser: mbot.backward();
> If the hand is too close, it has to go back, not forward.

runde:
    while (mbot.getDistance() < 15) {
        mbot.forward();
    }
    mbot.playTone(440, 300);
frage: Should drive forward as long as the wall is more than 15 cm away, then beep.
fehler: 1
besser: while (mbot.getDistance() > 15) {
> "More than 15 cm away" means `> 15`.

runde:
    while (mbot.getDistance > 15) {
        mbot.forward();
    }
    mbot.playTone(440, 300);
frage: Should drive to the wall and then beep.
fehler: 1
besser: while (mbot.getDistance() > 15) {
> A sensor is a method. Without brackets, Java can't find it.

runde:
    if (mbot.getDistance() < 10) {
        mbot.backward();
    } els {
        mbot.forward();
    }
frage: Under 10 cm it should drive back, otherwise forward.
fehler: 3
besser: } else {
> The false branch is called `else`.

runde:
    while (mbot.getDistance() > 15) {
        mbot.turnRight();
    }
    mbot.playTone(440, 300);
frage: Should drive to the wall and then beep.
fehler: 2
besser: mbot.forward();
> It should drive forward, not turn.

runde:
    if (mbot.getDistance() < 10) {
        mbot.backward();
    } else {
        if (mbot.getDistance() < 20) {
            mbot.forward();
        }
    }
frage: Under 10 cm back, over 20 cm forward, in between stand still.
fehler: 4
besser: if (mbot.getDistance() > 20) {
> It should only drive forward if the hand is more than 20 cm away.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain what `mbot.getDistance()` measures. → How does the mBot2 measure distance?
- I can put one branch inside another. → Keep your distance in the structure chart
- I can write a while loop with the distance in Java. → Now in Java
:::

## Quiz

::: quiz
? `mbot.getDistance()` gives `8`. What does the program from “Keep your distance” do?
→ Keep your distance in the structure chart
- [x] It drives back.
- [ ] It drives forward.
- [ ] It stays where it is.
> 8 is less than 10, so the first condition is already true.
? What is the false branch of a branch called in Java?
→ Now in Java
- [ ] `then`
- [x] `else`
- [ ] `otherwise`
> `if` is the start, `else` the false branch.
:::
