---
titel: Motors and speed
bereich: Motors and methods
kurz: Step on the gas, steer and follow a line.
---

## Skills I will gain now

::: kompetenzen
- step on the gas with wheels separately and stop
- drive until a sensor reports something
- write a line follower in Java
:::

## Two motors, two wheels

::: mbot2
focus: motors, wheels
view: bottom
:::

The mBot2 has two [motors]{part=motors}, each drives one [wheel]{part=wheels}. So far you have used **move forward** and **turn right**. These commands drive a fixed distance and wait until the mBot2 has arrived.

With **wheels separately** (`mbot.drive(left, right)`) you step on the gas instead: you say how strongly each wheel turns, in percent from −100 to 100. The mBot2 then **keeps going** until you tell it something else. With **stop** (`mbot.stop()`) it stops.

| Command | What happens? |
|---|---|
| `mbot.drive(40, 40)` | both wheels equally fast: straight ahead |
| `mbot.drive(-40, -40)` | backwards |
| `mbot.drive(10, 40)` | right faster: curve to the left |
| `mbot.drive(40, -40)` | wheels against each other: turns right on the spot |
| `mbot.stop()` | stop |

> In the simulator `mbot.drive(100, 100)` drives 20 cm per second. Try it in the [simulation](#zeige-simulation).

## Full speed to the wall in the structure chart

In lesson 5 the mBot2 drove to the wall in steps of 10 cm. With **wheels separately** it works without jerking: step on the gas once, wait until the wall is close, then stop.

::: übung vb-gas-bis-wand
titel: Full speed to the wall
auftrag: The mBot2 steps on the gas with 50 %. As long as the wall is more than 15 cm away, it waits a moment. Then it stops. There are three worlds.
welt: wand-kurz, wand-mittel, wand-lang
braucht: whileSchleife
tipp: At the top is `mbot.drive(50, 50)`. Below it a while loop with the condition `mbot.getDistance() > 15`.
tipp: Inside the loop is only **wait a moment**. The mBot2 keeps driving meanwhile! After the loop is **stop**.
lösung: vb-gas-bis-wand-loesung.visustruct
:::

## The line follower

::: mbot2
focus: lineSensor
view: bottom
:::

A classic: the mBot2 follows a black line on the floor. For this it looks at the two middle probes of the [line sensor]{part=lineSensor}:

| Sensor | Text |
|---|---|
| left middle probe sees black | `mbot.isLineLeft()` |
| right middle probe sees black | `mbot.isLineRight()` |

The idea: if **both** see the line, it drives straight ahead. If only the **left** one sees it, the line has moved to the left: it steers left, so the right wheel turns faster. If only the **right** one sees it, it steers right.

## Now in Java: line follower

::: übung vb-java-linienfolger
titel: Line follower
code: java
auftrag: Write a line follower in Java. As long as the wall is more than 15 cm away, the mBot2 checks its two probes and steers. Then it stops. In the first world the line bends to the right, in the second to the left.
welt: linie-1, linie-2
braucht: whileSchleife, verzweigung
tipp: `while (mbot.getDistance() > 15) { … }` and after it `mbot.stop();`.
tipp: Inside the loop: `if (mbot.isLineLeft() && mbot.isLineRight()) { mbot.drive(40, 40); } else if (mbot.isLineLeft()) { mbot.drive(10, 40); } else if (mbot.isLineRight()) { mbot.drive(40, 10); }`
lösung: vb-java-linienfolger-loesung.visustruct
:::

> For the real mBot2, stick the line with black insulating tape on a light floor. Drive slowly at first, otherwise it shoots past the line in the curve.

::: übung vb-fehler-20-motoren
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Line follower", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-20-motoren-start.visustruct
welt: linie-1, linie-2
tipp: Read the error message carefully. In which box does the simulation stop? Java is case-sensitive.
tipp: It should be `mbot.stop()`.
lösung: vb-java-linienfolger-loesung.visustruct
:::

## Game: Where does it go?

::: spiel frage
titel: Game: Where does it go?
intro: Power for left and right in percent: where does the mBot2 go? Seven rounds.
antworten: straight ahead | backwards | curve to the left | curve to the right | turns on the spot

runde:
    mbot.drive(40, 40);
frage: Where does it go?
richtig: straight ahead
> Both wheels turn at the same speed.

runde:
    mbot.drive(-40, -40);
frage: Where does it go?
richtig: backwards
> Minus means backwards, and both wheels are the same.

runde:
    mbot.drive(10, 40);
frage: Where does it go?
richtig: curve to the left
> The right wheel is faster, so it steers to the left.

runde:
    mbot.drive(40, 10);
frage: Where does it go?
richtig: curve to the right
> The left wheel is faster, so it steers to the right.

runde:
    mbot.drive(40, -40);
frage: Where does it go?
richtig: turns on the spot
> One wheel forward, one back: it turns right without moving from the spot.

runde:
    mbot.drive(-40, 40);
frage: Where does it go?
richtig: turns on the spot
> This time it turns to the left.

runde:
    if (mbot.isLineLeft() && !mbot.isLineRight()) {
        ...
    }
frage: Line follower: only the left sensor sees the line. What goes in the gap?
- `mbot.drive(40, 10);`
- [x] `mbot.drive(10, 40);`
- `mbot.stop();`
> The line has moved to the left. It steers to the left, so the right wheel turns faster.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can step on the gas with wheels separately and stop. → Two motors, two wheels
- I can drive until a sensor reports something. → Full speed to the wall in the structure chart
- I can write a line follower in Java. → Now in Java: line follower
:::

## Quiz

::: quiz
? What does `mbot.drive(30, 30)` do?
→ Two motors, two wheels
- [ ] It drives 30 cm and stops.
- [x] It drives straight ahead and does not stop until another driving command comes.
- [ ] It turns by 30°.
> **wheels separately** only steps on the gas. You have to stop it yourself.
? The mBot2 should steer to the right. Which command fits?
→ Two motors, two wheels
- [ ] `mbot.drive(10, 40)`
- [x] `mbot.drive(40, 10)`
- [ ] `mbot.drive(-40, -40)`
> If the left wheel turns faster, it drives a right curve.
:::
