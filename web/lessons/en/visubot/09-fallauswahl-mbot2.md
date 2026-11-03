---
titel: Case selection with colours
bereich: Sensors and decisions
kurz: Do something different for each colour or line, with one case selection instead of many branches.
---

## Skills I will gain now

::: kompetenzen
- build a case selection with texts
- write a case selection with numbers in Java
- show a different text on the screen depending on a number
:::

## Many colours, many cases

The mBot2 should react differently to each colour: turn right on red, drive forward a bit on green, beep on blue. With branches you would need three inside each other. A **case selection** is clearer, in Java `switch`:

```java
switch (mbot.getColor()) {
  case "red" -> {
    mbot.turnRight();
  }
  case "green" -> {
    mbot.forward(20);
  }
  default -> {
    mbot.forward(10);
  }
}
```

- The value being checked goes in the brackets at the top, here the colour.
- Each `case` is one **case**. If the value matches, exactly this case runs.
- `default` is the case for **everything else**.

In the structogram the case selection is a box with several columns, one for each case.

::: übung vb-farbweiche
titel: Colour switch
auftrag: Build a case selection on `mbot.getColor()`. For `"red"` the mBot2 turns right. For `"green"` it drives forward 20 cm. For `"blue"` it plays a tone of 880 hertz for 200 milliseconds. In all other cases it drives forward 10 cm.
messwerte: getColor=red -> turnRight
messwerte: getColor=green -> forward 20
messwerte: getColor=blue -> none, tone
messwerte: getColor=white -> forward 10
braucht: fallauswahl
tipp: Drag a case selection into the structogram. At the top goes `mbot.getColor()`, the cases are `"red"`, `"green"` and `"blue"`, plus the case for everything else.
tipp: For red `mbot.turnRight()`, for green `mbot.forward(20)`, for blue `mbot.playTone(880, 200)`, otherwise `mbot.forward(10)`.
lösung: vb-farbweiche-loesung.visustruct
:::

## Now in Java: line patterns

A number can also be the value of a case selection. `mbot.getLine()` from lesson 7 gives for example:

| Value | Meaning |
|---|---|
| `0` | no line |
| `6` | the two middle sensors see the line: it is right on it |
| `15` | all four see black: a cross line |

For numbers you write the case without quotation marks: `case 6 -> { … }`.

::: übung vb-linienmuster
titel: Line patterns
code: java
auftrag: Write a case selection on `mbot.getLine()` in Java. For 6 the mBot2 drives forward 10 cm. For 0 it turns right. For 15 it shows **Cross line!** on its screen. In all other cases it drives forward 5 cm.
messwerte: getLine=6 -> forward 10
messwerte: getLine=0 -> turnRight
messwerte: getLine=15 -> none, screen "Cross line!"
messwerte: getLine=4 -> forward 5
braucht: fallauswahl
tipp: `switch (mbot.getLine()) { case 6 -> { … } case 0 -> { … } case 15 -> { … } default -> { … } }`
tipp: For 6 `mbot.forward(10);`, for 0 `mbot.turnRight();`, for 15 `mbot.showText("Cross line!");`, otherwise `mbot.forward(5);`.
lösung: vb-linienmuster-loesung.visustruct
:::

## Now in Java: start signal

Before a race the mBot2 shows three texts one after the other and then drives off. A for loop counts the rounds 1, 2 and 3. The case selection finds the right text for each round:

```java
for (int round = 1; round <= 3; round++) {
    switch (round) {
        case 1 -> { mbot.showText("On your marks"); }
        ...
    }
    mbot.pause(1000);
}
```

::: übung vb-startsignal
titel: Start signal
code: java
auftrag: Write in Java: a loop counts `round` from 1 to 3. In round 1 the screen shows **On your marks**, in round 2 **Get set**, otherwise **Go!**. After each text the mBot2 waits one second. After the loop it drives 50 cm forward.
befehle: showText "On your marks", pause 1000, showText "Get set", pause 1000, showText "Go!", pause 1000
fahrt: forward 50
braucht: fallauswahl
tipp: The loop is `for (int round = 1; round <= 3; round++) { … }`. Inside it is `switch (round) { … }` and after that `mbot.pause(1000);`.
tipp: `case 1 -> { mbot.showText("On your marks"); }`, `case 2 -> { … }` and `default -> { mbot.showText("Go!"); }`. After the loop `mbot.forward(50);`.
lösung: vb-startsignal-loesung.visustruct
:::

> 📘 **More without the robot:** VisuStruct has the lesson ["Switch"](?visustruct&lektion=10-fallauswahl). It opens in a new window.

::: übung vb-fehler-09-fallauswahl-mbot2
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Line patterns", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-09-fallauswahl-mbot2-start.visustruct
messwerte: getLine=6 -> forward 10
messwerte: getLine=0 -> turnRight
messwerte: getLine=15 -> none, screen "Cross line!"
messwerte: getLine=4 -> forward 5
tipp: Read the error message carefully. Is the command spelled correctly? After `mbot.` the editor suggests all commands.
tipp: It should be `mbot.turnRight()`.
lösung: vb-linienmuster-loesung.visustruct
:::

## Game: Which case runs?

::: spiel frage
titel: Game: Which case runs?
intro: Read the switch and predict what the mBot2 does. Six rounds.

runde:
    switch (mbot.getColor()) {
        case "red" -> { mbot.turnRight(); }
        case "green" -> { mbot.forward(20); }
        case "blue" -> { mbot.playTone(880, 300); }
        default -> { mbot.forward(10); }
    }
frage: The mBot2 is standing on green. What does it do?
- It turns right.
- [x] It drives forward 20 cm.
- It drives forward 10 cm.
> The case `"green"` matches, so exactly that one runs.

runde:
    switch (mbot.getColor()) {
        case "red" -> { mbot.turnRight(); }
        case "green" -> { mbot.forward(20); }
        case "blue" -> { mbot.playTone(880, 300); }
        default -> { mbot.forward(10); }
    }
frage: The mBot2 is standing on yellow. What does it do?
- Nothing at all.
- It beeps.
- [x] It drives forward 10 cm.
> There is no case for yellow, so `default` runs.

runde:
    switch (mbot.getColor()) {
        case "red" -> { mbot.turnRight(); }
        case "green" -> { mbot.forward(20); }
        case "blue" -> { mbot.playTone(880, 300); }
        default -> { mbot.forward(10); }
    }
frage: The mBot2 is standing on blue. What does it do?
- [x] It beeps.
- It beeps and then drives forward 10 cm.
- It turns right.
> Only the matching case runs. `default` only runs when no other case matches.

runde:
    switch (mbot.getLine()) {
        case 6 -> { mbot.forward(10); }
        case 0 -> { mbot.turnRight(); }
        case 15 -> { mbot.showText("Cross line!"); }
        default -> { mbot.stop(); }
    }
frage: All four sensors see black. What does the mBot2 do?
- It drives forward 10 cm.
- [x] It shows **Cross line!**
- It stops.
> Four sensors on black give 15.

runde:
    switch (mbot.getLine()) {
        case 6 -> { mbot.forward(10); }
        case 0 -> { mbot.turnRight(); }
        case 15 -> { mbot.showText("Cross line!"); }
        default -> { mbot.stop(); }
    }
frage: Everything under the mBot2 is white. What does it do?
- It drives forward 10 cm.
- [x] It turns right.
- It stops.
> No sensor sees black, so `mbot.getLine()` gives 0.

runde:
    for (int round = 1; round <= 3; round++) {
        switch (round) {
            case 1 -> { mbot.showText("On your marks"); }
            case 2 -> { mbot.showText("Get set"); }
            default -> { mbot.showText("Go!"); }
        }
    }
frage: What does the screen show in round 3?
- Get set
- [x] Go!
- On your marks
> There is no case of its own for 3, so `default` runs.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can build a case selection with texts. → Many colours, many cases
- I can write a case selection with numbers in Java. → Now in Java: line patterns
- I can show a different text on the screen depending on a number. → Now in Java: start signal
:::

## Quiz

::: quiz
? The mBot2 is on yellow. Which case of the colour switch runs?
→ Many colours, many cases
- [ ] the case `"red"`
- [ ] none at all
- [x] `default`
> There is no case of its own for yellow. So the case for everything else runs.
? How do you write the case for the number 6?
→ Now in Java: line patterns
- [x] `case 6 -> { … }`
- [ ] `case "6" -> { … }`
- [ ] `if 6 -> { … }`
> Numbers have no quotation marks, texts like `"red"` do.
:::
