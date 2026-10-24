---
titel: Up to the wall
bereich: VisuBot
kurz: The mBot2 measures the distance and stops in time.
---

## How far away is the wall?

So far you told the mBot2 exactly how far to drive. Now it should notice by itself when to stop.

That is what the ultrasonic sensor is for. `mbot.getDistance()` gives the distance to the next wall in centimetres, for example `38`. You can use it like a number:

```java
mbot.getDistance() > 15
```

This is a **condition**: it is true as long as the wall is more than 15 cm away.

> Start the [simulation](#zeige-simulation): below the world you always see the current distance. When the mBot2 gets closer to the wall, the number gets smaller.

## Three worlds, one program

This exercise has **three worlds**. In each one the wall is somewhere else, and the mBot2 should stop at the goal with the green flag every time, without bumping into it.

A fixed number of **move forward** only works in one world. You need a loop that keeps driving as long as the condition is true: the **while loop**.

::: übung vb-bis-wand
titel: Up to the wall
auftrag: The mBot2 should drive forward until the wall is at most 15 cm away. Your program must work in all three worlds. Above the simulation you choose which world you see.
welt: wand-kurz, wand-mittel, wand-lang
braucht: whileSchleife
tipp: Drag a while loop into the structure chart and the sensor **Distance** onto the loop. Then only the comparison is missing.
tipp: A while loop with the condition `mbot.getDistance() > 15`, with `mbot.forward()` inside.
lösung: vb-bis-wand-loesung.visustruct
:::

::: ludwig
A loop that checks a condition before it drives is like me at the feeding trough: first I check whether there is anything left, and only then do I keep eating.
:::

## To the goal

Now it is the second sensor's turn. The goal is a black square with a green flag. When the mBot2 drives onto it, its line sensor sees it: `mbot.getLine()` is then no longer `0`.

::: übung vb-bis-ziel
titel: Drive to the goal
auftrag: The mBot2 should keep driving forward until it is on the goal. Again there are two worlds.
welt: ziel-kurz, ziel-lang
braucht: whileSchleife
tipp: The loop should run as long as the line sensor sees **nothing**. Drag the sensor **Line** onto the while loop.
tipp: The condition is `mbot.getLine() == 0`. Inside the loop is `mbot.forward()`.
lösung: vb-bis-ziel-loesung.visustruct
:::

## What does the loop check?

::: quiz
? The mBot2 is 40 cm in front of the wall. How often does it drive forward with `while (mbot.getDistance() > 15) mbot.forward();` if each move is 10 cm?
- [ ] not at all
- [ ] once
- [x] until the wall is at most 15 cm away
- [ ] always exactly five times
> The while loop checks the condition before every move. When the wall is close enough, it stops.
? Why is a for loop with a fixed count not enough here?
- [x] Because the wall is at a different distance in every world.
- [ ] Because a for loop must not contain statements.
- [ ] Because the mBot2 does not understand for loops.
> The for loop knows beforehand how often it runs. The while loop decides on the way.
:::

::: angeberwissen
The idea with the worlds comes from **Kara**, a ladybird that Swiss students have used for many years to learn programming. Kara walks across a grid, avoids trees and collects clover leaves. There, too, a program has to work in several worlds.
:::

::: checkliste
- I can ask for the distance with `mbot.getDistance()`. → How far away is the wall?
- I know when to use a while loop instead of a for loop. → Three worlds, one program
- I can find a goal with the line sensor. → To the goal
:::
