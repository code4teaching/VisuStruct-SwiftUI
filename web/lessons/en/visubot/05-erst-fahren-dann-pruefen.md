---
titel: Drive first, then check
bereich: Sensors and decisions
kurz: The do-while loop always drives at least once and only checks afterwards.
---

## Skills I will gain now

::: kompetenzen
- explain that the do-while loop checks its condition only after the body
- compare a while loop and a do-while loop
- write a do-while loop in Java
:::

## Drive first, then check

The while loop from Lesson 5 checks **first** and then drives. If the wall is already right in front of the mBot2, it does not drive off at all. It is a **pre-test loop**: the condition is at the top, in the head.

The **do-while loop** is a **post-test loop**. The condition is at the bottom, in the foot of the box:

1. Run the body once.
2. Check the condition.
3. If it is true, start again at 1. If it is false, carry on below the loop.

That is why the body **always runs at least once**. When you click the loop, the word `while` is in front of the text field in the Object Inspector: the condition means "repeat as long as …".

| Distance at the start | While loop | Do-while loop |
|---|---|---|
| 50 cm | drives until 15 cm | drives until 15 cm |
| 10 cm | does **not drive at all** | drives 10 cm **once** |

::: übung vb-do-while
titel: At least one step
auftrag: Build a structogram with a do-while loop: the mBot2 drives forward as long as the distance is greater than 15 cm, but **at least once**. Then it plays a tone.
messwerte: getDistance=10 -> forward, tone
welt: wand-kurz -> tone
braucht: doUntilSchleife
tipp: Drag the **do-while loop** from the Elements into the structogram. **Drive forward** goes into the box, the condition `mbot.getDistance() > 15` into the foot.
tipp: Below the loop (not inside it) goes `mbot.playTone(440, 300)`.
lösung: vb-do-while-loesung.visustruct
:::

> When checking, the wall is once only 10 cm in front of the mBot2. A while loop would not drive at all then.

## Now in Java: counting steps

In Java, `do` is at the top and `while (…)` with a semicolon at the bottom:

```java
do {
    mbot.forward();
} while (mbot.getDistance() > 15);
```

::: übung vb-java-schritte-zaehlen
titel: Count the steps
code: java
auftrag: Write in Java: create `int steps = 0`. In a do-while loop the mBot2 drives forward and counts `steps` up by one, as long as the distance is greater than 15 cm. Then the screen shows for example **Steps: 3**.
welt: wand-kurz -> screen "Steps: 3"
messwerte: getDistance=10 -> forward, screen "Steps: 1"
braucht: doUntilSchleife
tipp: `do { mbot.forward(); steps = steps + 1; } while (mbot.getDistance() > 15);`
tipp: After the loop `mbot.showText("Steps: " + steps);`.
lösung: vb-java-schritte-zaehlen-loesung.visustruct
:::

> 📘 **More without the robot:** VisuStruct has the lesson ["Do-while loop"](?visustruct&lektion=12-do-while-schleife). It opens in a new window.

::: übung vb-fehler-05-erst-fahren-dann-pruefen
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Count the steps", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-05-erst-fahren-dann-pruefen-start.visustruct
welt: wand-kurz -> screen "Steps: 3"
messwerte: getDistance=10 -> forward, screen "Steps: 1"
tipp: The error message names an unknown variable. What is the variable called where it is created? Java is case-sensitive.
tipp: It should be `mbot.showText("Steps: " + steps)`.
lösung: vb-java-schritte-zaehlen-loesung.visustruct
:::

## Game: Head or foot?

::: spiel frage
titel: Game: Head or foot?
intro: While or do-while: how often does the mBot2 drive forward? Each drive is 10 cm long. Six rounds.

runde:
    while (mbot.getDistance() > 15) {
        mbot.forward();
    }
frage: The wall is 10 cm in front of the mBot2. How often does it drive forward?
- [x] not at all
- once
- 2 times
> The while loop checks first. 10 is not greater than 15.

runde:
    do {
        mbot.forward();
    } while (mbot.getDistance() > 15);
frage: The wall is 10 cm in front of the mBot2. How often does it drive forward?
- not at all
- [x] once
- 2 times
> The do-while loop drives first and checks afterwards. It always drives once.

runde:
    do {
        mbot.forward();
    } while (mbot.getDistance() > 15);
frage: The wall is 40 cm in front of the mBot2. How often does it drive forward?
- 2 times
- [x] 3 times
- 4 times
> After the first drive it is 30 cm, then 20, then 10. At 10 it stops. Here both loops drive the same number of times.

runde:
    int steps = 0;
    do {
        mbot.forward();
        steps = steps + 1;
    } while (mbot.getDistance() > 15);
    mbot.showText("Steps: " + steps);
frage: The wall is 10 cm in front of the mBot2. What does the screen show?
- Steps: 0
- [x] Steps: 1
- Steps: 2
> The body runs once, so `steps` counts up once.

runde:
frage: Which loop is foot-controlled?
- the while loop
- [x] the do-while loop
- the for loop
> Its condition is at the bottom, in the foot.

runde:
    do {
        mbot.forward();
    } while (mbot.getDistance() > 15)
frage: Why doesn't this code run?
- `do` must be written with a capital letter.
- [x] The semicolon after `while (…)` is missing.
- The condition must be at the top.
> The do-while loop ends with `} while (condition);`.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain that the do-while loop checks its condition only after the body. → Drive first, then check
- I can compare a while loop and a do-while loop. → Drive first, then check
- I can write a do-while loop in Java. → Now in Java: counting steps
:::

## Quiz

::: quiz
? Where is the condition of a do-while loop?
→ Drive first, then check
- [ ] at the top, in the head
- [x] at the bottom, in the foot
- [ ] nowhere
> Post-test means: first the body, then the condition.
? The wall is 10 cm in front of the mBot2. How often does `do { mbot.forward(); } while (mbot.getDistance() > 15);` drive?
→ Drive first, then check
- [ ] not at all
- [x] once
- [ ] until it bumps
> The body always runs at least once. After that the condition is false.
? What comes after `while (…)` at the end of a do-while loop in Java?
→ Now in Java: counting steps
- [x] a semicolon `;`
- [ ] a curly bracket `{`
- [ ] nothing
> `} while (condition);` ends with a semicolon.
:::
