---
titel: The ultrasonic sensor
bereich: VisuBot
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

For this you need two branches, one inside the other. The outer one checks “too close?”, the inner one in the No branch checks “too far?”.

::: übung vb-abstand-halten
titel: Keep your distance
auftrag: Build a structure chart: if the distance is less than 10, the mBot2 drives back. Otherwise: if the distance is greater than 20, it drives forward. Otherwise it does nothing.
messwerte: getDistance=5 -> backward
messwerte: getDistance=35 -> forward
messwerte: getDistance=15 -> none
braucht: verzweigung
tipp: Drag a branch into the structure chart and the sensor **Distance** onto it. Write `< 10` after it. The Yes branch gets **move back**.
tipp: The No branch gets a second branch with `mbot.getDistance() > 20` and **move forward** in its Yes branch. Its No branch stays empty.
lösung: vb-abstand-halten-loesung.visustruct
:::

> When checking, VisuStruct sets the distance to 5, 35 and 15 cm one after the other and looks at what your mBot2 does.

## Now in Java

In the [Programming](#zeige-codelive) area you already see your structure chart as Java code. A branch is called `if` there, the No branch is `else`:

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

::: quiz
? `mbot.getDistance()` gives `8`. What does the program from “Keep your distance” do?
→ Keep your distance in the structure chart
- [x] It drives back.
- [ ] It drives forward.
- [ ] It stays where it is.
> 8 is less than 10, so the first condition is already true.
? What is the No branch of a branch called in Java?
→ Now in Java
- [ ] `then`
- [x] `else`
- [ ] `otherwise`
> `if` is the start, `else` the No branch.
:::

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain what `mbot.getDistance()` measures. → How does the mBot2 measure distance?
- I can put one branch inside another. → Keep your distance in the structure chart
- I can write a while loop with the distance in Java. → Now in Java
:::
