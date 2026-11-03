---
titel: Emergency brake with break
bereich: Sensors and decisions
kurz: An endless loop with a Break: the mBot2 keeps driving until the emergency brake kicks in.
---

## Skills I will gain now

::: kompetenzen
- end an endless loop with a Break
- explain why the Break sits inside a branch
- write a loop with `while (true)` and `break` in Java
:::

## Endless loop with a Break

Many robot programs run "forever": the mBot2 drives, measures, drives, measures … That is what the **endless loop** is for. It has no condition and never stops by itself.

So that the mBot2 can still stop, you need an **emergency brake**: the **Break**. It leaves the loop it is in straight away. The program carries on with the first box **after** the loop. You recognise it by the point on its left edge. In the box you write a short comment, for example `leave the loop`.

A Break almost always sits inside a **branch**. Otherwise the loop would end in the very first pass.

::: übung vb-notbremse
titel: Emergency brake at the wall
auftrag: Build an endless loop. Inside it a branch checks: if the distance is less than 15 cm, there is a Break. After that (below the branch, still inside the loop) the mBot2 drives forward. After the loop it plays a tone.
welt: wand-kurz -> tone
welt: wand-mittel -> tone
braucht: endlosschleife, aussprung
tipp: Drag the **endless loop** into the structogram. First a branch with `mbot.getDistance() < 15` goes into the loop, the **Break** into its yes branch, the no branch stays empty.
tipp: Below the branch (inside the loop) goes **drive forward**, below the loop `mbot.playTone(440, 300)`.
lösung: vb-notbremse-loesung.visustruct
:::

## Now in Java: stop with button A

In Java the endless loop is `while (true)`. The Break is called `break`:

```java
while (true) {
    if (mbot.isButtonA()) {
        break;
    }
    mbot.forward();
}
```

::: übung vb-java-taste-stopp
titel: Stop with button A
code: java
auftrag: Write in Java: the mBot2 keeps driving forward in an endless loop. When button A is pressed, it leaves the loop with `break`. Then the screen shows **Stopped**.
messwerte: isButtonA=true -> none, screen "Stopped"
messwerte: isButtonA=false/true -> drives, screen "Stopped"
braucht: endlosschleife, aussprung
tipp: `while (true) { … }` with `if (mbot.isButtonA()) { break; }` and then `mbot.forward();`.
tipp: After the loop `mbot.showText("Stopped");`.
lösung: vb-java-taste-stopp-loesung.visustruct
:::

> 📘 **More without the robot:** VisuStruct has the lesson ["Call and break"](?visustruct&lektion=18-aufruf-und-aussprung). It opens in a new window.

::: übung vb-fehler-10-unterbrechen-mit-break
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Stop with button A", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-10-unterbrechen-mit-break-start.visustruct
messwerte: isButtonA=true -> none, screen "Stopped"
messwerte: isButtonA=false/true -> drives, screen "Stopped"
tipp: A text belongs in quotation marks. Without them Java looks for a variable with that name.
tipp: It should be `mbot.showText("Stopped")`.
lösung: vb-java-taste-stopp-loesung.visustruct
:::

## Game: Emergency brake

::: spiel frage
titel: Game: Emergency brake
intro: When does the break kick in, and what happens afterwards? Each drive is 10 cm long. Five rounds.

runde:
    while (true) {
        if (mbot.getDistance() < 15) {
            break;
        }
        mbot.forward();
    }
    mbot.playTone(440, 300);
frage: The wall starts 40 cm away. How often does it drive forward?
- 2 times
- [x] 3 times
- forever
> At 40, 30 and 20 it drives. At 10 the emergency brake kicks in.

runde:
    while (true) {
        if (mbot.getDistance() < 15) {
            break;
        }
        mbot.forward();
    }
    mbot.playTone(440, 300);
frage: What happens straight after `break`?
- The loop starts again.
- It drives forward once more.
- [x] It beeps.
> `break` leaves the loop. The program carries on with the first command after it.

runde:
    while (true) {
        mbot.forward();
        break;
    }
frage: How often does the mBot2 drive forward?
- [x] once
- not at all
- forever
> The break isn't inside a branch. The loop ends in its first run.

runde:
    while (true) {
        mbot.forward();
    }
frage: When does this loop stop?
- after 10 drives
- at the wall
- [x] never
> Without `break`, `while (true)` really is endless.

runde:
    while (true) {
        if (mbot.isButtonA()) {
            break;
        }
        mbot.forward();
    }
frage: You press button A after it has driven forward twice. How often has it driven forward?
- [x] 2 times
- 3 times
- not at all
> In the next run it notices the button and jumps out of the loop.
:::

## Game: Defuse the bomb

::: spiel bombe
titel: Game: Defuse the bomb
intro: Every program contains **exactly one mistake**, and the bomb is ticking. Tap the wrong line before time runs out. Four rounds, 30 seconds each.
zeit: 30

runde:
    while (true) {
        if (mbot.getDistance() > 15) {
            break;
        }
        mbot.forward();
    }
frage: Should drive forward and stop at the wall with the emergency brake.
fehler: 2
besser: if (mbot.getDistance() < 15) {
> The emergency brake should kick in when the wall is **close**.

runde:
    while (true) {
        if (mbot.isButtonB()) {
            break;
        }
        mbot.forward();
    }
    mbot.showText("Stopped");
frage: Should drive forward until button A is pressed, then show "Stopped".
fehler: 2
besser: if (mbot.isButtonA()) {
> The brake should be button A, not B.

runde:
    while (true) {
        if (mbot.isButtonA()) {
            brake;
        }
        mbot.forward();
    }
frage: Should drive forward until button A is pressed.
fehler: 3
besser: break;
> The exit is called `break`, not `brake`.

runde:
    while (false) {
        if (mbot.isButtonA()) {
            break;
        }
        mbot.forward();
    }
frage: Should drive in an endless loop until button A is pressed.
fehler: 1
besser: while (true) {
> The endless loop is `while (true)`. With `false` it doesn't run even once.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can end an endless loop with a Break. → Endless loop with a Break
- I can explain why the Break sits inside a branch. → Endless loop with a Break
- I can write a loop with `while (true)` and `break` in Java. → Now in Java: stop with button A
:::

## Quiz

::: quiz
? Where does the program carry on after a Break?
→ Endless loop with a Break
- [ ] at the start of the loop
- [x] at the first box after the loop
- [ ] at the very start of the program
> The Break leaves the loop straight away.
? Why does the Break sit inside a branch?
→ Endless loop with a Break
- [x] Otherwise the loop ends in the first pass.
- [ ] Otherwise the mBot2 drives backwards.
- [ ] It just looks nicer.
> The emergency brake should only kick in when the condition is true.
? What is the endless loop called in Java?
→ Now in Java: stop with button A
- [ ] `while (false)`
- [x] `while (true)`
- [ ] `for (;;) break;`
> `true` is always true, the loop only stops with `break`.
:::
