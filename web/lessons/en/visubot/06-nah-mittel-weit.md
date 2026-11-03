---
titel: Near, medium or far?
bereich: Sensors and decisions
kurz: Build a branch with three cases and write it in Java with else if.
---

## Skills I will gain now

::: kompetenzen
- build a branch with three cases
- read and write `else if` in Java
- check the conditions in the right order
:::

## Three cases instead of two

Many cars have a **parking aid**. If the wall is far away, everything is free. When it gets closer, it says: slow. When it is very close: stop!

A branch has only two branches, yes and no. For three cases you put a second branch into the no branch of the first one:

1. Is the distance less than 10? Then **Stop**.
2. Otherwise: is the distance less than 30? Then **Slow**.
3. Otherwise: **Free**.

::: diagramm vb-l06n-einparkhilfe.visustruct
The parking aid. The second question is only asked if the answer to the first one was no.
:::

Try it in the [simulation](#zeige-simulation): open the diagram in the editor and set the distance to 5, 20 and 50 cm.

> 📘 **More without the robot:** VisuStruct has the lesson ["Branch"](?visustruct&lektion=08-verzweigung). It opens in a new window.

## Speed by distance in the structure chart

::: übung vb-tempo-abstand
titel: Speed by distance
auftrag: Build a structure chart with three cases: if the distance is less than 10, the mBot2 drives 5 cm backward. Otherwise: if the distance is less than 30, it drives 5 cm forward. Otherwise it drives 20 cm forward.
messwerte: getDistance=5 -> backward 5
messwerte: getDistance=20 -> forward 5
messwerte: getDistance=50 -> forward 20
braucht: verzweigung
tipp: Build it like the parking aid: a branch with `mbot.getDistance() < 10` and in its no branch a second one with `mbot.getDistance() < 30`.
tipp: The commands are `mbot.backward(5)`, `mbot.forward(5)` and `mbot.forward(20)`. The last one goes into the no branch of the second branch.
lösung: vb-tempo-abstand-loesung.visustruct
:::

> When checking, VisuStruct sets the distance to 5, 20 and 50 cm one after the other.

## Now in Java: else if

Look at the [Code](#zeige-codelive) area. The branch inside the no branch looks like this:

```java
if (mbot.getDistance() < 10) {
    mbot.showText("Stop");
} else {
    if (mbot.getDistance() < 30) {
        mbot.showText("Slow");
    } else {
        mbot.showText("Free");
    }
}
```

In Java you may write this more briefly. The `if` moves right behind the `else`:

```java
if (mbot.getDistance() < 10) {
    mbot.showText("Stop");
} else if (mbot.getDistance() < 30) {
    mbot.showText("Slow");
} else {
    mbot.showText("Free");
}
```

Both mean exactly the same. With `else if` it is easier to read, though. You still always write the curly brackets `{ }`.

::: übung vb-java-tageszeit
titel: Day or night?
code: java
auftrag: Write in Java with `else if`: if the brightness is less than 20, the mBot2 shows **Night**. Otherwise: if it is less than 60, it shows **Dusk**. Otherwise it shows **Day**.
messwerte: getBrightness=10 -> none, screen "Night"
messwerte: getBrightness=40 -> none, screen "Dusk"
messwerte: getBrightness=80 -> none, screen "Day"
braucht: verzweigung
tipp: You read the brightness with `mbot.getBrightness()`. The first condition is `mbot.getBrightness() < 20`.
tipp: `if (…) { mbot.showText("Night"); } else if (mbot.getBrightness() < 60) { mbot.showText("Dusk"); } else { mbot.showText("Day"); }`
lösung: vb-java-tageszeit-loesung.visustruct
:::

::: übung vb-fehler-06-nah-mittel-weit
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Day or night?", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-06-nah-mittel-weit-start.visustruct
messwerte: getBrightness=10 -> none, screen "Night"
messwerte: getBrightness=40 -> none, screen "Dusk"
messwerte: getBrightness=80 -> none, screen "Day"
tipp: A text belongs in quotation marks. Without them Java looks for a variable with that name.
tipp: It should be `mbot.showText("Night")`.
lösung: vb-java-tageszeit-loesung.visustruct
:::

## The order matters

Ludwig rebuilt the parking aid and swapped the questions:

```java
if (mbot.getDistance() < 30) {
    mbot.showText("Slow");
} else if (mbot.getDistance() < 10) {
    mbot.showText("Stop");
}
```

At 5 cm his mBot2 shows **Slow** instead of **Stop**. That is because 5 is also less than 30. The first condition is already true, so the second one is never checked. **Stop** never appears.

> Remember: with `<`, check the smallest value first, then the next bigger one.

::: spiel frage
titel: Game: what does the parking aid show?
intro: Ludwig's parking aid from above: under 10 cm **Stop**, under 30 cm **Slow**, otherwise **Free**. What does it show? Six rounds.
frage: What does the parking aid show?
antworten: Stop | Slow | Free

runde:
frage: The distance is **5 cm**.
richtig: Stop
> 5 is less than 10. The very first question is true.

runde:
frage: The distance is **25 cm**.
richtig: Slow
> 25 is not less than 10, but it is less than 30.

runde:
frage: The distance is **80 cm**.
richtig: Free
> Both questions are false, so the last no branch is left.

runde:
frage: The distance is exactly **10 cm**.
richtig: Slow
> 10 is not less than 10. The first question is false, the second true.

runde:
frage: The distance is exactly **30 cm**.
richtig: Free
> 30 is not less than 30. Both questions are false.

runde:
frage: The distance is **9 cm**.
richtig: Stop
> 9 is less than 10.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can build a branch with three cases. → Three cases instead of two
- I can read and write `else if` in Java. → Now in Java: else if
- I can check the conditions in the right order. → The order matters
:::

## Quiz

::: quiz
? How many branches do you need in the structure chart for three cases?
→ Three cases instead of two
- [ ] One
- [x] Two, the second in the no branch of the first
- [ ] Three side by side
> Each branch splits into two. The second one splits the no branch again.
? What does `else if` mean in Java?
→ Now in Java: else if
- [x] Otherwise, check another condition
- [ ] Repeat the condition
- [ ] Check both conditions at the same time
> `else if` is the short way of writing an `if` inside the `else` branch.
? Ludwig checks `< 30` first and then `< 10`. What happens at 5 cm?
→ The order matters
- [ ] Stop appears.
- [x] Slow appears.
- [ ] Nothing appears.
> 5 is also less than 30. The second condition is no longer checked.
:::
