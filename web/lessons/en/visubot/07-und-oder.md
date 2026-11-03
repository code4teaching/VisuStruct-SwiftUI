---
titel: And, or, not
bereich: Sensors and decisions
kurz: Check two sensors in one condition: and, or, not.
---

## Skills I will gain now

::: kompetenzen
- combine two conditions with `&&` (and)
- combine two conditions with `||` (or)
- turn a condition around with `!` (not)
- write a combined condition in a Java loop
:::

## Wall and line: and

The mBot2 should only drive forward if the way ahead is clear **and** there is no line under it. Two sensors, one condition. In Java, **and** is written `&&`:

```java
mbot.getDistance() > 15 && mbot.getLine() == 0
```

The whole condition is only true if **both** parts are true:

| clear ahead? | no line? | clear `&&` no line |
|---|---|---|
| true | true | **true** |
| true | false | false |
| false | true | false |
| false | false | false |

A table like this is called a **truth table**.

::: übung vb-und
titel: Clear and no line
auftrag: Build a structogram with a branch: if the distance is greater than 15 **and** `mbot.getLine() == 0`, the mBot2 drives forward. Otherwise it does nothing.
messwerte: getDistance=50, getLine=0 -> forward
messwerte: getDistance=10, getLine=0 -> none
messwerte: getDistance=50, getLine=6 -> none
braucht: verzweigung
tipp: Drag the **distance** sensor onto the branch and write `> 15` after it. Then type ` && ` and the second part `mbot.getLine() == 0`.
tipp: The yes branch contains **drive forward**, the no branch stays empty.
lösung: vb-und-loesung.visustruct
:::

> When checking, VisuStruct sets the distance and the line to different values. Only if both fit may the mBot2 drive.

## Button A or button B: or

Now the mBot2 should beep when you press button A **or** button B. It is enough if one of them is pressed. In Java, **or** is written `||`.

| Button A? | Button B? | A or B |
|---|---|---|
| true | true | **true** |
| true | false | **true** |
| false | true | **true** |
| false | false | false |

::: übung vb-oder
titel: Button A or B
auftrag: Build a structogram: if button A **or** button B is pressed, the mBot2 plays a tone. Otherwise it does nothing.
messwerte: isButtonA=true, isButtonB=false -> tone
messwerte: isButtonA=false, isButtonB=true -> tone
messwerte: isButtonA=false, isButtonB=false -> noTone
braucht: verzweigung
tipp: The condition of the branch is `mbot.isButtonA() || mbot.isButtonB()`.
tipp: The yes branch contains `mbot.playTone(440, 300)`, the no branch stays empty.
lösung: vb-oder-loesung.visustruct
:::

## Not: the opposite

Sometimes you want the opposite of a condition. That is what `!` is for, read as **not**. `mbot.isButtonA()` is true when button A is pressed. `!mbot.isButtonA()` is true when it is **not** pressed.

```java
while (!mbot.isButtonA()) {
    mbot.pause(100);
}
mbot.forward(30);
```

The mBot2 waits as long as button A is not pressed. Then it drives off.

## Now in Java: drive safely

Now everything comes together. The mBot2 drives as long as the way is clear **and** no line comes. Whatever comes first, the wall or the edge: it stops and beeps.

::: übung vb-java-sicher-fahren
titel: Drive safely
code: java
auftrag: Write in Java: the mBot2 drives forward as long as the distance is greater than 15 **and** `mbot.getLine() == 0`. Then it plays a tone. In two worlds a wall is waiting, in two worlds a black edge.
welt: wand-kurz -> tone
welt: wand-mittel -> tone
welt: rand-1 -> forward 20, tone
welt: rand-2 -> forward 50, tone
braucht: whileSchleife
tipp: `while (mbot.getDistance() > 15 && mbot.getLine() == 0) { … }`
tipp: Inside the loop is `mbot.forward();`, after the loop `mbot.playTone(440, 300);`.
lösung: vb-java-sicher-fahren-loesung.visustruct
:::

> 📘 **More without the robot:** VisuStruct has the lesson ["Combining conditions"](?visustruct&lektion=09-bedingungen-verknuepfen). It opens in a new window.

::: quiz
? The distance is 50 and `mbot.getLine()` gives 6. Does the mBot2 drive in "Clear and no line"?
→ Wall and line: and
- [ ] Yes, the way ahead is clear.
- [x] No, because with `&&` both parts must be true.
- [ ] Only half as far.
> It is standing on a line. So one part is false, and so is the whole condition.
? Only button B is pressed. Is `mbot.isButtonA() || mbot.isButtonB()` true?
→ Button A or button B: or
- [x] Yes
- [ ] No
> With `||` it is enough if one part is true.
? Button A is pressed. What is `!mbot.isButtonA()`?
→ Not: the opposite
- [ ] true
- [x] false
> `!` turns the value around: true becomes false.
? Which condition stops the mBot2 at the wall **and** at the edge?
→ Now in Java: drive safely
- [x] `while (mbot.getDistance() > 15 && mbot.getLine() == 0)`
- [ ] `while (mbot.getDistance() > 15 || mbot.getLine() == 0)`
- [ ] `while (mbot.getDistance() > 15)`
> With `||` it would keep driving as long as just one part is true, for example over the edge.
:::

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can combine two conditions with `&&` (and). → Wall and line: and
- I can combine two conditions with `||` (or). → Button A or button B: or
- I can turn a condition around with `!` (not). → Not: the opposite
- I can write a combined condition in a Java loop. → Now in Java: drive safely
:::
