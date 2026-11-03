---
titel: Fixed values with final
bereich: Sensors and decisions
kurz: Create a constant so that an important number appears in only one place.
---

## Skills I will gain now

::: kompetenzen
- explain what a constant is
- create a constant in the structure chart and in Java
- use a constant in a condition and in a command
:::

## One number in many places

Ludwig has written a program for the hallway: the mBot2 drives up to 20 cm from the wall, turns around and drives up to 20 cm from the other wall.

::: diagramm vb-l06k-ohne.visustruct
There and back. The number 20 appears in two places.
:::

Now the mBot2 should stop at 30 cm instead. Ludwig has to find and change every 20. If he forgets one, the mBot2 stops once at 30 and once at 20 cm. In long programs this happens quickly.

::: angeberwissen
Professionals call a number that just sits in the program a **magic number**. Magic, because nobody remembers what it means. The only magic I like is magic grass.
:::

## Creating a constant

A **constant** is better. It is a variable whose value stays the same once it is set. You create it once at the very top and after that you only use its name.

| | Structure chart | Java |
|---|---|---|
| create | `const int DISTANCE = 20` | `final int DISTANCE = 20;` |
| use | `mbot.getDistance() > DISTANCE` | `mbot.getDistance() > DISTANCE` |

In the structure chart you write `const` in front, in Java `final`. Both mean: this value does not change any more. Names of constants are written in **capital letters**, so you can spot them right away.

::: diagramm vb-l06k-mit.visustruct
The same program with the constant DISTANCE. For 30 cm you only change the first line.
:::

::: übung vb-konstante-wand
titel: Wall with a constant
auftrag: Create the constant `DISTANCE` with the value 20. The mBot2 drives forward as long as the distance is greater than `DISTANCE`. Then it plays a tone. There are three worlds.
welt: wand-kurz -> tone
welt: wand-mittel -> tone
welt: wand-lang -> tone
braucht: whileSchleife
tipp: The first box is a statement with `const int DISTANCE = 20`. Below it comes a while loop.
tipp: The loop condition is `mbot.getDistance() > DISTANCE`. Inside the loop is **drive forward**, after the loop **play tone**.
lösung: vb-konstante-wand-loesung.visustruct
:::

## Now in Java: square with a constant

A constant also fits into a command. With `final int SIDE = 30;`, `mbot.forward(SIDE);` drives exactly 30 cm. If the square should get bigger, you only change that one line.

::: übung vb-java-konstante-seite
titel: Square with a constant
code: java
auftrag: Write in Java: create the constant `SIDE` with the value 30. Then use a for loop to drive a square with side length `SIDE`.
fahrt: 4 x (forward 30, turnRight)
braucht: forSchleife
tipp: The first line is `final int SIDE = 30;`. Then comes `for (int i = 0; i < 4; i++) { … }`.
tipp: Inside the loop are `mbot.forward(SIDE);` and `mbot.turnRight();`.
lösung: vb-java-konstante-seite-loesung.visustruct
:::

::: übung vb-fehler-06-konstanten-final
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Square with a constant", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-06-konstanten-final-start.visustruct
fahrt: 4 x (forward 30, turnRight)
tipp: The error message names an unknown variable. What is the constant called where it is created? Constants are written in capital letters.
tipp: It should be `mbot.forward(SIDE)`.
lösung: vb-java-konstante-seite-loesung.visustruct
:::

## Game: constant or variable?

::: spiel frage
titel: Game: constant or variable?
intro: Ludwig is sorting values. If the value stays the same in the whole program, it is a constant. If it changes, it is a variable. Six rounds.
frage: Constant or variable?
antworten: Constant | Variable

runde:
frage: The number of corners of a square
richtig: Constant
> A square always has four corners.

runde:
frage: The distance the ultrasonic sensor is measuring right now
richtig: Variable
> When the mBot2 drives, the distance changes all the time.

runde:
frage: The minimum distance at which the mBot2 should always stop
richtig: Constant
> You set it once, for example `final int DISTANCE = 20;`.

runde:
frage: The number of steps the mBot2 has already driven
richtig: Variable
> It grows by 1 after every step.

runde:
frage: The pitch of the warning tone, always 440 Hz
richtig: Constant
> The warning tone always sounds the same.

runde:
frage: The battery level in percent
richtig: Variable
> The battery slowly runs down while driving.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain what a constant is. → Creating a constant
- I can create a constant in the structure chart and in Java. → Creating a constant
- I can use a constant in a condition and in a command. → Now in Java: square with a constant
:::

## Quiz

::: quiz
? What is a constant?
→ Creating a constant
- [ ] A variable that changes in every pass
- [x] A variable whose value stays the same once it is set
- [ ] A sensor that always measures the same value
> You set a constant once. After that you only use its name.
? How do you create the constant `DISTANCE` with the value 20 in Java?
→ Creating a constant
- [ ] `const DISTANCE = 20;`
- [x] `final int DISTANCE = 20;`
- [ ] `int final = 20;`
> In Java, `final` comes before the data type. In the structure chart you write `const`.
? Why is a constant better than the number 20 in many places?
→ Creating a constant
- [ ] Because the program drives faster
- [x] Because you only have to change the value in one place
- [ ] Because the sensor measures more precisely
:::
