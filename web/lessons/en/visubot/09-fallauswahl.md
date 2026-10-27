---
titel: Case selection with colours
bereich: VisuBot
kurz: Do something different for each colour or line, with one case selection instead of many branches.
---

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

## Now without the robot: grades in words

You don't only need the case selection for robots. This program reads a number that the user types in the [console](#zeige-konsole):

```java
Scanner scanner = new Scanner(System.in);
int grade = scanner.nextInt();
```

::: übung vb-ohne-noten
titel: Grades in words
code: java
auftrag: Read a grade as a number. For 1 print **very good**, for 2 **good**, for 3 **satisfactory** and for all other numbers **other grade**. No `mbot` at all!
test: 1 -> very good
test: 2 -> good
test: 3 -> satisfactory
test: 5 -> other grade
braucht: fallauswahl
tipp: First `Scanner scanner = new Scanner(System.in);` and `int grade = scanner.nextInt();`. Then comes `switch (grade) { … }`.
tipp: `case 1 -> { System.out.println("very good"); }` and so on, finally `default -> { System.out.println("other grade"); }`.
lösung: vb-ohne-noten-loesung.visustruct
:::

::: quiz
? The mBot2 is on yellow. Which case of the colour switch runs?
- [ ] the case `"red"`
- [ ] none at all
- [x] `default`
> There is no case of its own for yellow. So the case for everything else runs.
? How do you write the case for the number 6?
- [x] `case 6 -> { … }`
- [ ] `case "6" -> { … }`
- [ ] `if 6 -> { … }`
> Numbers have no quotation marks, texts like `"red"` do.
:::

::: checkliste
- I can build a case selection with texts. → Many colours, many cases
- I can write a case selection with numbers in Java. → Now in Java: line patterns
- I can read a number and print something depending on its value. → Now without the robot: grades in words
:::
