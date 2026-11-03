---
titel: The line sensor
bereich: Sensors and decisions
kurz: Detect dark lines on the floor and don't fall off the table.
---

## Skills I will gain now

::: kompetenzen
- explain what the number from `mbot.getLine()` means
- drive up to a line
- count steps with a variable in Java
:::

## Four probes under the nose

::: mbot2
focus: lineSensor
view: bottom
:::

The [line sensor]{part=lineSensor} has four probes side by side. Each one shines light on the floor and measures how much comes back. Black swallows the light, white reflects it.

| Sensor | Text | Value |
|---|---|---|
| Line | `mbot.getLine()` | `0` = all bright, greater than `0` = at least one probe sees black |

To start with, this is all you need: **`mbot.getLine() == 0` means “no line”**, `mbot.getLine() != 0` means “line found”.

::: angeberwissen
`mbot.getLine()` is really a binary number with four digits, one for each probe: `1111` (that is 15) means “all four see black”, `0110` (6) “only the middle two”. With that an mBot2 can even follow a line.
:::

## Turn round at the edge in the structure chart

Imagine a table with black tape along the edge. The mBot2 should drive forward until it sees the tape and then turn round so it doesn't fall off.

::: übung vb-rand
titel: Turn round at the edge
auftrag: The mBot2 drives forward as long as `mbot.getLine() == 0`. Then it turns 180°. There are two worlds with different distances.
welt: rand-1 -> forward 20, turnRight 180
welt: rand-2 -> forward 50, turnRight 180
braucht: whileSchleife
tipp: Drag a while loop into the structure chart and the sensor **Line** onto it. Write `== 0` after it. **move forward** goes inside the loop.
tipp: After the loop (below it, not inside) is `mbot.turnRight(180)`.
lösung: vb-rand-loesung.visustruct
:::

## Now in Java: there and back

Now the mBot2 should drive exactly back to the start after turning round. To do that it counts with a **variable** how often it drove forward.

```java
int steps = 0;
while (mbot.getLine() == 0) {
    mbot.forward();
    steps = steps + 1;
}
```

::: übung vb-java-rand
titel: To the line and back
code: java
auftrag: Write in Java: the mBot2 drives to the line and counts its steps. Then it turns 180° and uses a for loop to drive the same number of steps back.
welt: rand-1 -> forward 20, turnRight 180, forward 20
welt: rand-2 -> forward 50, turnRight 180, forward 50
braucht: whileSchleife, forSchleife
tipp: After the while loop: `mbot.turnRight(180);` and then `for (int i = 0; i < steps; i++) { … }`.
tipp: The for loop only contains `mbot.forward();`.
lösung: vb-java-rand-loesung.visustruct
:::

::: übung vb-fehler-07-linie
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "To the line and back", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-07-linie-start.visustruct
welt: rand-1 -> forward 20, turnRight 180, forward 20
welt: rand-2 -> forward 50, turnRight 180, forward 50
tipp: The error message names an unknown variable. What is the variable called where it is created? Java is case-sensitive.
tipp: It should be `steps = steps + 1`.
lösung: vb-java-rand-loesung.visustruct
:::

## Game: Line or no line?

::: spiel frage
titel: Game: Line or no line?
intro: Where is the mBot2 standing, and is the condition true or false? Six rounds.
antworten: true | false

runde:
    mbot.getLine() == 0
frage: The mBot2 is standing on white paper. Is the condition true?
richtig: true
> No sensor sees black, so `mbot.getLine()` gives 0.

runde:
    mbot.getLine() == 0
frage: The two middle sensors are on the black tape. Is the condition true?
richtig: false
> Two sensors see black, so `mbot.getLine()` is greater than 0.

runde:
    mbot.getLine() != 0
frage: Only the outer left sensor sees black. Is the condition true?
richtig: true
> One sensor is enough, then the value is no longer 0.

runde:
    mbot.getLine() != 0
frage: The mBot2 is standing on a white floor. Is the condition true?
richtig: false
> On white the value is 0, and `0 != 0` is false.

runde:
    mbot.getLine() == 15
frage: A cross line: all four sensors see black. Is the condition true?
richtig: true
> All four sensors give the binary number `1111`, which is 15.

runde:
    int steps = 0;
    while (mbot.getLine() == 0) {
        mbot.forward();
        steps = steps + 1;
    }
frage: The line is 30 cm away, each drive is 10 cm long. Is `steps == 3` afterwards?
richtig: true
> After three drives it is on the line, and the loop stops.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain what the number from `mbot.getLine()` means. → Four probes under the nose
- I can drive up to a line. → Turn round at the edge in the structure chart
- I can count steps with a variable in Java. → Now in Java: there and back
:::

## Quiz

::: quiz
? The mBot2 is on white paper. What does `mbot.getLine()` give?
→ Four probes under the nose
- [x] 0
- [ ] 15
- [ ] 1
> No probe sees black, so 0.
? Which condition means “line found”?
→ Turn round at the edge in the structure chart
- [ ] `mbot.getLine() == 0`
- [x] `mbot.getLine() != 0`
- [ ] `mbot.getLine() < 0`
> `!=` means “not equal”.
:::
