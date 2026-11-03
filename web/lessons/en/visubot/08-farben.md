---
titel: Recognising colours
bereich: Sensors and decisions
kurz: The quad RGB sensor tells you which colour the mBot2 is standing on.
---

## Skills I will gain now

::: kompetenzen
- ask for a colour with `mbot.getColor().equals(…)`
- turn a condition round with `!`
- put a branch inside a loop
:::

## A sensor that sees colours

::: mbot2
focus: lineSensor
view: bottom
:::

The [line sensor]{part=lineSensor} is really called a **quad RGB sensor**. “Quad” means four (four probes), “RGB” stands for red, green and blue. It shines these three colours on the floor and measures which colour comes back. That is how it recognises coloured fields.

`mbot.getColor()` gives the name of the colour under the mBot2, as **text**:

| Floor | `mbot.getColor()` |
|---|---|
| red field | `"red"` |
| green field | `"green"` |
| blue field | `"blue"` |
| yellow field | `"yellow"` |
| black field or line | `"black"` |
| light floor | `"white"` |

You ask whether it is a certain colour with `.equals(…)`: `mbot.getColor().equals("red")` is **true** when the mBot2 stands on red, otherwise **false**. So it is already a complete condition.

> In Java you always compare texts with `.equals(…)`, **not** with `==`. The `==` looks right but often doesn't work with texts.

> With a `!` in front you turn a condition round: `!mbot.getColor().equals("red")` means “**not** red”.

## Drive to red in the structure chart

::: übung vb-bis-rot
titel: Drive to red
auftrag: The mBot2 drives forward as long as it is **not** on a red field. In the second world there is a green field first, which should not bother it.
welt: farbe-1 -> forward 20
welt: farbe-2 -> forward 50
braucht: whileSchleife
tipp: Drag a while loop into the structure chart and the sensor **Colour is red?** onto it. Write a `!` in front of `mbot.getColor().equals("red")`.
tipp: The condition is `!mbot.getColor().equals("red")`, inside the loop is **move forward**.
lösung: vb-bis-rot-loesung.visustruct
:::

## Now in Java: beep on green

Now you combine a loop with a branch: the mBot2 drives to blue. If it passes over a green field on the way, it beeps.

::: übung vb-java-blau-gruen
titel: To blue, beep on green
code: java
auftrag: Write in Java: the mBot2 drives forward as long as it is not on blue. After each step it checks: if it is on green, it plays a tone. In the second world there is no green field, so it must not beep there.
welt: farbe-3 -> forward 30, tone
welt: farbe-4 -> forward 30, noTone
braucht: whileSchleife, verzweigung
tipp: Outside is `while (!mbot.getColor().equals("blue")) { … }`. Inside, first `mbot.forward();`.
tipp: After that, still inside the loop: `if (mbot.getColor().equals("green")) { mbot.playTone(880, 200); }`.
lösung: vb-java-blau-gruen-loesung.visustruct
:::

::: übung vb-fehler-08-farben
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "To blue, beep on green", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-08-farben-start.visustruct
welt: farbe-3 -> forward 30, tone
welt: farbe-4 -> forward 30, noTone
tipp: A text belongs in quotation marks. Without them Java looks for a variable with that name.
tipp: It should be `equals("green")`.
lösung: vb-java-blau-gruen-loesung.visustruct
:::

## Game: Defuse the bomb

::: spiel bombe
titel: Game: Defuse the bomb
intro: Every program contains **exactly one mistake**, and the bomb is ticking. Read what the mBot2 should do and tap the wrong line before time runs out. Five rounds, 30 seconds each.
zeit: 30

runde:
    while (mbot.getColor().equals("red")) {
        mbot.forward();
    }
frage: Should drive forward until it is standing on red.
fehler: 1
besser: while (!mbot.getColor().equals("red")) {
> It should drive as long as it is **not** on red. The `!` is missing.

runde:
    if (mbot.getColor() == "green") {
        mbot.playTone(440, 300);
    }
frage: Should beep when it is standing on green.
fehler: 1
besser: if (mbot.getColor().equals("green")) {
> You compare texts with `.equals(…)`, not with `==`.

runde:
    while (!mbot.getColor().equals("blue")) {
        mbot.forward();
        if (mbot.getColor().equals("green")) {
            mbot.turnRight();
        }
    }
frage: Should drive to blue and beep on green.
fehler: 4
besser: mbot.playTone(440, 300);
> On green it should beep, not turn.

runde:
    if (mbot.getColor().equals(red)) {
        mbot.turnRight();
    }
frage: Should turn right on red.
fehler: 1
besser: if (mbot.getColor().equals("red")) {
> Without quotation marks, Java looks for a variable called `red`. The colour name is a text.

runde:
    while (!mbot.getColor().equals("red")) {
        mbot.forward();
    }
    mbot.playTone(440, 300)
frage: Should drive to red and then beep.
fehler: 4
besser: mbot.playTone(440, 300);
> The semicolon at the end of the statement is missing.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can ask for a colour with `mbot.getColor().equals(…)`. → A sensor that sees colours
- I can turn a condition round with `!`. → Drive to red in the structure chart
- I can put a branch inside a loop. → Now in Java: beep on green
:::

## Quiz

::: quiz
? The mBot2 is on a red field. What is `!mbot.getColor().equals("red")`?
→ Drive to red in the structure chart
- [ ] true
- [x] false
> `mbot.getColor().equals("red")` is true, the `!` turns it into false. So the loop stops.
? How do you compare the colour with `"green"`?
→ A sensor that sees colours
- [x] `mbot.getColor().equals("green")`
- [ ] `mbot.getColor() == "green"`
- [ ] `mbot.getColor() = "green"`
> `mbot.getColor()` gives a text, and texts are compared with `.equals(…)`. A single `=` is an assignment, not a comparison at all.
:::
