---
titel: The square
bereich: Getting started
kurz: From a long structure chart to a triple nested loop.
---

## Skills I will gain now

::: kompetenzen
- build a sequence without a loop first
- spot repetitions and replace them with a for loop
- nest two loops
- nest three loops
- upload my program to the mBot2 and start it with button A without a cable
:::

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

- Start: `int i = 0`
- Condition: `i < 5`
- Step: `i++`

The body of the loop gets a single **move forward**. The loop counts `i` from 0 to 4, that is five runs.

`i` is a **counter**. The computer uses it to remember which run it is in. Such a named store is called a **variable**; you will get to know it properly in lesson 3. The three parts mean:

| Part | Meaning |
|---|---|
| `int i = 0` | The counter `i` is a whole number (`int`) and starts at 0. |
| `i < 5` | As long as `i` is less than 5, the loop runs once more. |
| `i++` | After every run `i` gets 1 bigger. |

This is how the loop counts:

| Run | 1 | 2 | 3 | 4 | 5 | after that |
|---|---|---|---|---|---|---|
| `i` | 0 | 1 | 2 | 3 | 4 | 5 |
| `i < 5`? | true | true | true | true | true | false, done |

::: übung vb-quadrat-schleife
titel: Sides with a loop
auftrag: In your square, replace each row of five **move forward** with a for loop that drives five times. The mBot2 then drives exactly the same square.
fahrt: 4 x (5 x (forward), turnRight)
braucht: forSchleife
tipp: Start `int i = 0`, condition `i < 5`, step `i++`. The body only contains `mbot.forward()`.
tipp: Four times one below the other: the for loop and then `mbot.turnRight()`.
lösung: vb-quadrat-schleife-loesung.visustruct
:::

## A loop in a loop

Now the same pair appears four times: a for loop and **turn right**. That is a repetition too! Put both into a second for loop that runs four times. A loop inside a loop is called a **nested loop**.

Each loop needs its own counter variable, otherwise the two get in each other's way. The usual way: the outer loop counts with `i`, the inner one with `j`. So rename your inner loop to `j`.

::: übung vb-quadrat-verschachtelt
titel: Nested square
auftrag: Build the square with two nested for loops. The outer one runs four times, once for each side. The inner one runs five times, once for each step.
fahrt: 4 x (5 x (forward), turnRight)
schleifentiefe: 2
tipp: Outside: start `int i = 0`, condition `i < 4`, step `i++`. Inside: `int j = 0`, `j < 5`, `j++`.
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
tipp: Now `i` counts on the very outside (`int i = 0`, `i < 4`, `i++`). The loops inside are then called `j` and `k`. Inside the outer loop goes your square and then `mbot.turnRight()`.
lösung: vb-vier-quadrate-loesung.visustruct
:::

> 📘 **More without the robot:** VisuStruct has the lessons ["For loop"](?visustruct&lektion=13-for-schleife) and ["Nesting"](?visustruct&lektion=14-verschachteln). They open in a new window.

::: quiz
? How often does the mBot2 drive 10 cm forward for the four squares?
→ Four squares
- [ ] 20 times
- [ ] 60 times
- [x] 80 times
> 4 squares · 4 sides · 5 steps = 80. Without loops that would be 80 boxes.
:::

## Driving without a cable

::: mbot2
fokus: cyberpi, buttons
ansicht: oben
:::

So far the mBot2 hangs on the cable while it drives. But you can also **upload your program to the mBot2**. Then it remembers it and drives all by itself, for example through a maze on the floor.

1. Connect the mBot2 with the USB cable and switch it on, as in lesson 1. This only works in **Chrome** or **Edge**.
2. Open your program, for example the four squares.
3. Click **⬆ Upload** at the top and then **Upload now**. Choose **USB Serial** again.
4. Wait until it says “Done!”. The mBot2 restarts and shows **A = Start**.
5. Unplug the cable and put the mBot2 at the start.
6. Press **button A**, that is the [button with the square]{teil=buttons}. Now your program starts.

The program stays saved, even when you switch the mBot2 off and on again. Only the next upload replaces it.

> Afraid it drives off before you are ready? Don't worry: it always waits for button A. If you press A again while it drives, nothing happens. When it has finished, A starts the program again from the beginning.

## Game: How often does it drive?

::: spiel frage
titel: Game: How often does it drive?
intro: Count along without starting the simulation. How often does the mBot2 drive or turn? Six rounds.

runde:
    for (int i = 0; i < 4; i++) {
        mbot.forward();
        mbot.turnRight();
    }
frage: How often does the mBot2 drive forward?
- 3 times
- [x] 4 times
- 5 times
> `i` counts 0, 1, 2 and 3. That is four runs.

runde:
    for (int i = 1; i <= 4; i++) {
        mbot.forward();
    }
frage: How often does the mBot2 drive forward?
- 3 times
- [x] 4 times
- 5 times
> This time `i` counts from 1 to 4 because of `<=`. That is four runs too.

runde:
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 5; j++) {
            mbot.forward();
        }
        mbot.turnRight();
    }
frage: How often does the mBot2 drive forward?
- 8 times
- [x] 15 times
- 5 times
> The inner loop runs five times in each of the three outer runs: 3 · 5 = 15.

runde:
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 5; j++) {
            mbot.forward();
        }
        mbot.turnRight();
    }
frage: How often does the mBot2 turn right?
- [x] 3 times
- 15 times
- 5 times
> `mbot.turnRight()` is in the outer loop, not in the inner one.

runde:
    for (int i = 0; i < 4; i++) {
        mbot.forward(50);
    }
    mbot.turnRight();
frage: Does the mBot2 drive a square?
- Yes, with 50 cm sides.
- [x] No, it drives 200 cm straight ahead and only turns at the end.
- Yes, but only half of one.
> `mbot.turnRight()` is below the loop. It only runs when the loop has finished.

runde:
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 4; j++) {
            mbot.forward(30);
            mbot.turnRight();
        }
        mbot.turnRight();
    }
frage: How many squares does the mBot2 drive?
- [x] 2
- 4
- 8
> The inner loop drives one square. The outer loop repeats that twice.
:::

## Game: Defuse the bomb

::: spiel bombe
titel: Game: Defuse the bomb
intro: Every program contains **exactly one mistake**, and the bomb is ticking. Read what the mBot2 should drive and tap the wrong line before time runs out. Four rounds, 30 seconds each.
zeit: 30

runde:
    for (int i = 0; i < 3; i++) {
        mbot.forward(50);
        mbot.turnRight();
    }
frage: Should drive a square with 50 cm sides.
fehler: 1
besser: for (int i = 0; i < 4; i++) {
> A square has four sides. With `i < 3` it only drives three.

runde:
    for (int i = 0; i < 4; i++) {
        mbot.forward(50);
        mbot.turnRight(180);
    }
frage: Should drive a square with 50 cm sides.
fehler: 3
besser: mbot.turnRight();
> With 180° it turns round and just drives back and forth. A square needs 90°.

runde:
    for (int i = 0; i < 4; i++) {
        for (int i = 0; i < 5; i++) {
            mbot.forward();
        }
        mbot.turnRight();
    }
frage: Should drive a square made of four times five steps.
fehler: 2
besser: for (int j = 0; j < 5; j++) {
> The inner loop needs its own counter `j`.

runde:
    for (int i = 0; i < 4; i++) {
        mbot.forward(30);
        mbot.turnLeft(45);
    }
frage: Should drive a square with 30 cm sides.
fehler: 3
besser: mbot.turnLeft();
> A square needs right angles, so 90°. Without a number it turns 90°.
:::

## Game: Where does the mBot2 end up?

::: spiel fahrt
titel: Game: Where does the mBot2 end up?
intro: Read the program and tap the field where the mBot2 is at the end. Then it drives the route for you. Each field is 30 cm. Four rounds.
frage: On which field is the mBot2 at the end?

runde:
    for (int i = 0; i < 3; i++) {
        mbot.forward(30);
    }
karte: ..... | ..... | ..... | ..^..
ziel: 2,0
> One field forward, three times.

runde:
    for (int i = 0; i < 4; i++) {
        mbot.forward(30);
        mbot.turnRight();
    }
karte: .... | .... | .^..
ziel: 1,2
> A whole square: it arrives exactly where it started.

runde:
    for (int i = 0; i < 3; i++) {
        mbot.forward(30);
        mbot.turnRight();
    }
karte: .... | .... | .^..
ziel: 2,2
> Only three sides: the fourth is missing, so it ends up to the right of the start.

runde:
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2; j++) {
            mbot.forward(30);
        }
        mbot.turnRight();
    }
karte: .... | .... | .... | ^...
ziel: 2,1
> The inner loop drives two fields, then it turns. All that twice: two fields up, two to the right.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can build a sequence without a loop first. → Driving a square
- I can spot repetitions and replace them with a for loop. → Always the same
- I can nest two loops. → A loop in a loop
- I can nest three loops. → Four squares
- I can upload my program to the mBot2 and start it with button A without a cable. → Driving without a cable
:::
