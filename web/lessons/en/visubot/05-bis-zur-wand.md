---
titel: Up to the wall
bereich: Sensors and decisions
kurz: The mBot2 measures the distance and stops in time.
---

## Skills I will gain now

::: kompetenzen
- ask for the distance with `mbot.getDistance()`
- decide when to use a while loop instead of a for loop
- find a goal with the line sensor
:::

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

> 📘 **More without the robot:** VisuStruct has the lesson ["While loop"](?visustruct&lektion=11-while-schleife). It opens in a new window.

::: übung vb-fehler-05-bis-zur-wand
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Up to the wall", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-05-bis-zur-wand-start.visustruct
welt: wand-kurz, wand-mittel, wand-lang
tipp: Read the error message carefully. In which box does the simulation stop? Java is case-sensitive.
tipp: It should be `mbot.forward()`.
lösung: vb-bis-wand-loesung.visustruct
:::

## Game: How often does it drive?

::: spiel frage
titel: Game: How often does it drive?
intro: Each drive is 10 cm long. Work out how often the mBot2 drives forward before the loop stops. Six rounds.

runde:
    while (mbot.getDistance() > 15) {
        mbot.forward();
    }
frage: The wall starts 40 cm away. How often does it drive forward?
- 2 times
- [x] 3 times
- 4 times
> 40, 30 and 20 are greater than 15: three drives. At 10 the loop stops.

runde:
    while (mbot.getDistance() > 15) {
        mbot.forward();
    }
frage: The wall starts 15 cm away. How often does it drive forward?
- [x] not at all
- once
- 2 times
> 15 is not greater than 15. The condition is false right at the start.

runde:
    while (mbot.getDistance() > 15) {
        mbot.forward();
    }
frage: The wall starts 50 cm away. Where does it stop?
- 15 cm from the wall
- [x] 10 cm from the wall
- 0 cm, it bumps into it
> 50, 40, 30, 20: four drives. Then the wall is 10 cm away and the loop stops.

runde:
    while (mbot.getLine() == 0) {
        mbot.forward();
    }
frage: The mBot2 is already standing on the black goal. How often does it drive forward?
- [x] not at all
- once
- forever
> On black, `mbot.getLine()` is not 0. The condition is false straight away.

runde:
frage: The mBot2 should drive forward exactly five times. Which loop fits best?
- [x] a for loop
- a while loop with `mbot.getDistance()`
- no loop at all
> The number is known in advance. That is what the for loop is for.

runde:
frage: The mBot2 should drive until it almost touches the wall. Which loop fits?
- a for loop that runs ten times
- [x] a while loop with `mbot.getDistance()`
- no loop at all
> You don't know in advance how far away the wall is. The while loop checks on the way.
:::

## Game: Where does the mBot2 end up?

::: spiel fahrt
titel: Game: Where does the mBot2 end up?
intro: Grey is a wall. Tap the field where the mBot2 is at the end. Each field is 30 cm, and the sensor is at the front of the mBot2. Four rounds.
frage: On which field is the mBot2 at the end?

runde:
    while (mbot.getDistance() > 15) {
        mbot.forward(30);
    }
karte: ##### | ..... | ..... | ..... | ..^..
ziel: 2,1
> It drives as long as more than 15 cm ahead are free. It stops right in front of the wall.

runde:
    while (mbot.getDistance() > 15) {
        mbot.forward(30);
    }
karte: ##### | ..... | ..^..
ziel: 2,1
> However far away the wall is, the while loop stops it right in front of it.

runde:
    while (mbot.getDistance() > 45) {
        mbot.forward(30);
    }
    mbot.turnRight();
    mbot.forward(60);
karte: ##### | ..... | ..... | ..... | ^....
ziel: 2,2
> With more than 45 cm it stops one field earlier, turns and drives two fields to the right.

runde:
    while (mbot.getLine() == 0) {
        mbot.forward(30);
    }
karte: ..=.. | ..... | ..... | ..... | ..^..
ziel: 2,0
> It drives until its line sensor sees black. Then it is standing on the black field.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can ask for the distance with `mbot.getDistance()`. → How far away is the wall?
- I can decide when to use a while loop instead of a for loop. → Three worlds, one program
- I can find a goal with the line sensor. → To the goal
:::

## Quiz

::: quiz
? The mBot2 is 40 cm in front of the wall. How often does it drive forward with `while (mbot.getDistance() > 15) mbot.forward();` if each move is 10 cm?
→ How far away is the wall?
- [ ] not at all
- [ ] once
- [x] until the wall is at most 15 cm away
- [ ] always exactly five times
> The while loop checks the condition before every move. When the wall is close enough, it stops.
? Why is a for loop with a fixed count not enough here?
→ Three worlds, one program
- [x] Because the wall is at a different distance in every world.
- [ ] Because a for loop must not contain statements.
- [ ] Because the mBot2 does not understand for loops.
> The for loop knows beforehand how often it runs. The while loop decides on the way.
:::
