---
titel: The biggest value
bereich: Sensors and decisions
kurz: Measure all around and remember the biggest value: where is the most space?
---

## Skills I will gain now

::: kompetenzen
- remember the biggest value so far in a variable
- compare every new reading with the biggest so far in a loop
- find out with the mBot2 in which direction there is the most space
:::

## Remembering the record

In the long jump there is a board showing the **record**. After every jump the referee checks: is the new jump longer than the record? Then it goes on the board. Otherwise the old record stays.

A program finds the biggest value in exactly the same way. The board is a variable `max`:

1. **Before** the loop: `int max = 0`. Nothing is on the board yet.
2. **Inside** the loop: is the new value bigger than `max`? Then `max = value`.
3. **After** the loop, `max` holds the biggest value.

The mBot2 turns four times and measures the distance each time. This is how it looks in a desk check:

| Direction | measured | bigger than `max`? | `max` afterwards |
|---|---|---|---|
| before | | | 0 |
| ahead | 16 | yes | 16 |
| right | 36 | yes | 36 |
| behind | 6 | no | 36 |
| left | 26 | no | 36 |

> Important: the branch only has a yes branch. If the value is not bigger, nothing happens. The old record stays.

## Where is the most space?

::: übung vb-meister-platz
titel: Where is the most space?
auftrag: Build a structure chart: create `int max = 0`. The mBot2 measures the distance four times and turns right after each one. If a distance is bigger than `max`, it remembers it in `max`. At the end it shows, for example, **Farthest: 36 cm**. There are two worlds.
welt: platz-1 -> screen "Farthest: 36 cm"
welt: platz-2 -> screen "Farthest: 46 cm"
braucht: forSchleife, verzweigung
tipp: The for loop runs four times. It contains three boxes: `int distance = mbot.getDistance()`, a branch and **turn right**.
tipp: The branch checks `distance > max`. The yes branch has `max = distance`, the no branch stays empty. After the loop: `mbot.showText("Farthest: " + max + " cm")`.
lösung: vb-meister-platz-loesung.visustruct
:::

::: angeberwissen
Many robot vacuums have a small tower with a laser on top. It spins and measures the distances all around. That way the robot draws a map of the home. Nobody measures anything at my place. I just eat my way through.
:::

## Now in Java: remembering the direction

Now the mBot2 knows **how much** space there is at most. But **where**? For that it also remembers the direction in a second variable. The counter variable `i` tells you which measurement it was: 0 is ahead, 1 is right, 2 is behind and 3 is left.

```java
if (distance > max) {
    max = distance;
    direction = i;
}
```

Both lines are in the yes branch. The direction only changes when there is a new record.

::: übung vb-java-richtung
titel: Remembering the direction
code: java
auftrag: Write "Where is the most space?" in Java. Also remember in `int direction = 0` the number of the measurement with the biggest distance. At the end show, for example, **Direction: 1**.
welt: platz-1 -> screen "Direction: 1"
welt: platz-2 -> screen "Direction: 0"
braucht: forSchleife, verzweigung
tipp: Before the loop are `int max = 0;` and `int direction = 0;`. Inside the loop: `int distance = mbot.getDistance();`, the branch and `mbot.turnRight();`.
tipp: The yes branch has `max = distance;` and `direction = i;`. After the loop: `mbot.showText("Direction: " + direction);`
lösung: vb-java-richtung-loesung.visustruct
:::

::: übung vb-fehler-08-groesster-wert
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Remembering the direction", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-08-groesster-wert-start.visustruct
welt: platz-1 -> screen "Direction: 1"
welt: platz-2 -> screen "Direction: 0"
tipp: The error message names an unknown variable. What is the variable called where it is created? Java is case-sensitive.
tipp: It should be `direction = i`.
lösung: vb-java-richtung-loesung.visustruct
:::

## Game: new record?

::: spiel frage
titel: Game: new record?
intro: The mBot2 measures several distances one after the other. What is in `max` at the end? Five rounds.

runde:
frage: Measured: 20, 50, 30
- 30
- [x] 50
- 100
> 50 is the biggest value. The 30 after it is not a new record.

runde:
frage: Measured: 10, 20, 30, 40
- 10
- [x] 40
- 100
> Every value is a new record. At the end the last one is there.

runde:
frage: Measured: 90, 10, 20, 30
- 30
- [x] 90
- 10
> The record comes right at the start. After that no value is bigger.

runde:
frage: Measured: 15, 15, 15
- 45
- 0
- [x] 15
> 15 is not bigger than 15. `max` stays 15.

runde:
frage: Measured: 25, 60, 60, 5. In which direction (`i`) is the record?
- 0
- [x] 1
- 2
> At `i = 1` the 60 comes. The second 60 is not **bigger**, so `direction` stays at 1.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can remember the biggest value so far in a variable. → Remembering the record
- I can compare every new reading with the biggest so far in a loop. → Where is the most space?
- I can find out with the mBot2 in which direction there is the most space. → Now in Java: remembering the direction
:::

## Quiz

::: quiz
? What does `max` start with before the loop?
→ Remembering the record
- [x] With 0, because nothing has been measured yet
- [ ] With the biggest value
- [ ] With 100
> Every distance is bigger than 0, so the very first reading becomes the record.
? What is in the no branch of the branch `distance > max`?
→ Remembering the record
- [ ] `max = 0`
- [ ] `max = distance`
- [x] Nothing, the old record stays.
? When does `direction` change?
→ Now in Java: remembering the direction
- [ ] In every pass
- [x] Only when there is a new record
- [ ] Only in the last round
:::
