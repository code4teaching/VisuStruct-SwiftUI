---
titel: The square
bereich: VisuBot
kurz: From a long structure chart to a triple nested loop.
---

## Driving a square

The mBot2 should drive a square with sides of 50 cm. You already know one side: **move forward** five times. Then it turns right, and the next side begins.

::: übung vb-quadrat
titel: The square
auftrag: Build a structure chart that makes the mBot2 drive a square: **move forward** five times, then **turn right**. And all of that four times.
fahrt: 4 x (5 x (forward), turnRight)
tipp: One side is five times move forward and once turn right.
tipp: That makes 24 boxes: four times five `mbot.forward()`, each followed by `mbot.turnRight()`.
lösung: vb-quadrat-loesung.visustruct
:::

Quite a lot of boxes, right? If you miscount, the mBot2 no longer drives a square.

## Always the same

Look closely at your structure chart: five times **move forward** appears four times. When something repeats, you use a **loop**. We know exactly how often to drive, five times. The for loop fits that.

Drag a for loop into the structure chart and give it these three parts:

- Start: `int k = 0`
- Condition: `k < 5`
- Step: `k++`

The body of the loop gets a single **move forward**. The loop counts `k` from 0 to 4, that is five runs.

::: übung vb-quadrat-schleife
titel: Sides with a loop
auftrag: In your square, replace each row of five **move forward** with a for loop that drives five times. The mBot2 then drives exactly the same square.
fahrt: 4 x (5 x (forward), turnRight)
braucht: forSchleife
tipp: Start `int k = 0`, condition `k < 5`, step `k++`. The body only contains `mbot.forward()`.
tipp: Four times one below the other: the for loop and then `mbot.turnRight()`.
lösung: vb-quadrat-schleife-loesung.visustruct
:::

## A loop in a loop

Now the same pair appears four times: a for loop and **turn right**. That is a repetition too! Put both into a second for loop that runs four times. A loop inside a loop is called a **nested loop**.

Give the outer loop its own counter variable, for example `side`. Otherwise the two loops get in each other's way.

::: übung vb-quadrat-verschachtelt
titel: Nested square
auftrag: Build the square with two nested for loops. The outer one runs four times, once for each side. The inner one runs five times, once for each step.
fahrt: 4 x (5 x (forward), turnRight)
schleifentiefe: 2
tipp: Outside: start `int side = 0`, condition `side < 4`, step `side++`.
tipp: The outer loop contains the inner loop with `mbot.forward()` and below it `mbot.turnRight()`.
lösung: vb-quadrat-verschachtelt-loesung.visustruct
:::

24 boxes have become four. Step through the program in the simulation with **Step** and watch the variables.

::: quiz
? How often does the mBot2 run `mbot.forward()` in the nested square?
- [ ] 9 times
- [x] 20 times
- [ ] 5 times
> The inner loop runs five times, in each of the four runs of the outer loop: 4 · 5 = 20.
:::

## Four squares

Now it gets really nice: the mBot2 should drive four squares. After each square it turns right once. That makes a big window with a cross.

You could copy your square four times and add a **turn right** after each square. Go ahead and try it! Notice something? Again the same thing appears four times.

::: ludwig
Whenever you copy boxes, ask yourself: does something repeat here? Then a loop fits.
:::

::: übung vb-vier-quadrate
titel: Four squares
auftrag: Let the mBot2 drive four squares. After each square it turns right once. Use three nested loops.
fahrt: 4 x (4 x (5 x (forward), turnRight), turnRight)
schleifentiefe: 3
tipp: Put a third for loop that runs four times around your nested square.
tipp: Outside `int square = 0`, `square < 4`, `square++`. Inside your square and then `mbot.turnRight()`.
lösung: vb-vier-quadrate-loesung.visustruct
:::

::: quiz
? How often does the mBot2 drive 10 cm forward for the four squares?
- [ ] 20 times
- [ ] 60 times
- [x] 80 times
> 4 squares · 4 sides · 5 steps = 80. Without loops that would be 80 boxes.
:::

::: checkliste
- I can build a sequence without a loop first. → Driving a square
- I spot repetitions and replace them with a for loop. → Always the same
- I can nest two loops. → A loop in a loop
- I can nest three loops. → Four squares
:::
