---
titel: Counting and adding up
bereich: Sensors and decisions
kurz: Count along with a variable and add values together.
---

## Skills I will gain now

::: kompetenzen
- create a counter variable and count it up in a loop
- build a sum in a loop
- show the result on the screen after the loop
:::

## Counting along

How many steps does the mBot2 drive to the wall? You don't know in advance, the world is different every time. So the mBot2 should **count along**. You need three boxes for that:

1. **Before** the loop: `int steps = 0`. At the start nothing has been counted yet.
2. **Inside** the loop: `steps = steps + 1`. One more after every step.
3. **After** the loop: show the result, for example with `mbot.showText("Steps: " + steps)`.

Read `steps = steps + 1` from right to left: take the old value of `steps`, add 1 and store the result in `steps` again. A variable like this is called a **counter variable**, or counter for short.

> Careful: if `int steps = 0` is **inside** the loop, the counter starts again at 0 in every pass. Then the result is always 1.

::: angeberwissen
Your phone counts your steps exactly like this: with every step it calculates `steps = steps + 1`. I prefer counting my blades of grass. I'm at 4 million.
:::

::: übung vb-schritte-welt
titel: Steps to the wall
auftrag: Build a structure chart: the mBot2 drives forward as long as the distance is greater than 15. It counts its steps along the way. Then it shows, for example, **Steps: 3** on the screen. There are three worlds.
welt: wand-kurz -> screen "Steps: 3"
welt: wand-mittel -> screen "Steps: 7"
welt: wand-lang -> screen "Steps: 12"
braucht: whileSchleife
tipp: The first box is `int steps = 0`. Then comes the while loop with `mbot.getDistance() > 15`.
tipp: Inside the loop are **drive forward** and `steps = steps + 1`. After the loop is `mbot.showText("Steps: " + steps)`.
lösung: vb-schritte-welt-loesung.visustruct
:::

## Adding up

A counter always grows by 1. A **sum** grows by different values. The mBot2 drives a spiral: first 10 cm, then 20, then 30, then 40. How far has it driven in total?

| Pass | `side` | `total` afterwards |
|---|---|---|
| before | 10 | 0 |
| 1 | 10 | 0 + 10 = 10 |
| 2 | 20 | 10 + 20 = 30 |
| 3 | 30 | 30 + 30 = 60 |
| 4 | 40 | 60 + 40 = 100 |

The pattern is the same as for counting. Only instead of 1 you now add the value that comes in: `total = total + side`.

## Now in Java: spiral with distance

::: übung vb-java-spirale-strecke
titel: Spiral with distance
code: java
auftrag: Write in Java: create `int side = 10` and `int total = 0`. Four times: drive `side` cm forward, turn right, add `side` to `total`, make `side` 10 bigger. Then show **Distance: 100 cm** on the screen.
fahrt: forward 10, turnRight, forward 20, turnRight, forward 30, turnRight, forward 40, turnRight
befehle: showText "Distance: 100 cm"
braucht: forSchleife
tipp: The for loop has four lines: `mbot.forward(side);`, `mbot.turnRight();`, `total = total + side;` and `side = side + 10;`.
tipp: After the loop comes `mbot.showText("Distance: " + total + " cm");`.
lösung: vb-java-spirale-strecke-loesung.visustruct
:::

::: übung vb-fehler-05-zaehlen-und-summieren
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Spiral with distance", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-05-zaehlen-und-summieren-start.visustruct
fahrt: forward 10, turnRight, forward 20, turnRight, forward 30, turnRight, forward 40, turnRight
befehle: showText "Distance: 100 cm"
tipp: The error message names an unknown variable. What is the variable called where it is created? Java is case-sensitive.
tipp: It should be `total = total + side`.
lösung: vb-java-spirale-strecke-loesung.visustruct
:::

## Game: what is in the variable at the end?

::: spiel frage
titel: Game: what is in the variable at the end?
intro: Ludwig has written small programs. Work them out in your head. Five rounds.

runde:
frage: `int z = 0`, then three times `z = z + 1`. What is `z`?
- 1
- [x] 3
- 0
> Each pass adds 1: 1, 2, 3.

runde:
frage: `int sum = 0`, then `sum = sum + 5` and `sum = sum + 7`. What is `sum`?
- 7
- [x] 12
- 5
> 0 + 5 = 5, then 5 + 7 = 12.

runde:
frage: A loop runs four times. Inside it are `int z = 0` and `z = z + 1`. What is `z` at the end?
- 4
- [x] 1
- 0
> The counter is set back to 0 in every pass. It belongs before the loop.

runde:
frage: `int total = 0`. The mBot2 drives 20, 20 and 30 cm and adds each one. What is `total`?
- 30
- 20
- [x] 70
> 20 + 20 + 30 = 70.

runde:
frage: `int steps = 10`, then twice `steps = steps + 1`. What is `steps`?
- 2
- [x] 12
- 11
> Here the counter starts at 10, not at 0.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can create a counter variable and count it up in a loop. → Counting along
- I can build a sum in a loop. → Adding up
- I can show the result on the screen after the loop. → Now in Java: spiral with distance
:::

## Quiz

::: quiz
? Where do you create the counter variable `int steps = 0`?
→ Counting along
- [x] Before the loop
- [ ] Inside the loop
- [ ] After the loop
> Inside the loop it would become 0 again in every pass.
? What does `steps = steps + 1` do?
→ Counting along
- [ ] It compares steps with steps + 1.
- [x] It takes the old value, adds 1 and stores the result.
- [ ] It sets steps to 1.
? How do you add the side length `side` to the sum `total`?
→ Adding up
- [ ] `total = side`
- [ ] `side = total + side`
- [x] `total = total + side`
:::
