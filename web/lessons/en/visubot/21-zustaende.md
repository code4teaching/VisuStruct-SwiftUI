---
titel: States: what am I doing right now?
bereich: Motors and methods
kurz: Switch a robo traffic light on with a state variable and a switch.
---

## Skills I will gain now

::: kompetenzen
- explain what a state is
- act depending on the state with a switch and change to the next state
- tell states apart in Java with names and `.equals`
:::

## What is a state?

A traffic light is always in exactly one **state**: red, green or yellow. In each state it knows two things: what do I show? And what comes next?

Our robo traffic light has three states. Each gets a number:

| State | LEDs | next |
|---|---|---|
| 0 | red | 1 |
| 1 | green | 2 |
| 2 | yellow | 0 |

You store the current state in a variable: `int state = 0`. A variable like this is called a **state variable**. A program that jumps from state to state like this is called a **state machine**.

> A real traffic light in Germany has four states: red, red-yellow, green, yellow. Our robo traffic light leaves out red-yellow.

::: angeberwissen
A robot vacuum is a state machine too: vacuuming, avoiding, driving back to the charging station. I only have two states: eating and sleeping.
:::

## The robo traffic light in the structure chart

The switch fits perfectly: there is one case for each state. Each case has two boxes: what do I do? And which state comes next?

::: übung vb-ampel-zustand
titel: Robo traffic light
auftrag: Build a structure chart: create `int state = 0`. A for loop runs six times. Inside it is a switch on `state`. Case 0: LEDs red, `state = 1`. Case 1: LEDs green, `state = 2`. Otherwise: LEDs yellow, `state = 0`. After the switch the mBot2 waits one second.
befehle: 2 x (setLed 255 0 0, pause 1000, setLed 0 255 0, pause 1000, setLed 255 200 0, pause 1000)
braucht: forSchleife, fallauswahl
tipp: You will find the switch among the Elements. Write `state` into it. The cases are called 0, 1 and default.
tipp: The colours are `mbot.setLed(255, 0, 0)` for red, `mbot.setLed(0, 255, 0)` for green and `mbot.setLed(255, 200, 0)` for yellow. Below the switch, still inside the loop, is `mbot.pause(1000)`.
lösung: vb-ampel-zustand-loesung.visustruct
:::

> 📘 **More without the robot:** VisuStruct has the lesson ["Switch"](?visustruct&lektion=10-fallauswahl). It opens in a new window.

## Now in Java: states with names

Numbers are easy to forget. What was state 2 again? Names are easier to read. Then the state is a text:

```java
String state = "red";
...
if (state.equals("red")) {
    mbot.setLed(255, 0, 0);
    state = "green";
} else if (state.equals("green")) {
    ...
```

In Java you compare texts with `.equals("…")`, not with `==`.

::: übung vb-java-ampel-text
titel: Traffic light with names
code: java
auftrag: Write the robo traffic light in Java with `String state = "red";`. Use `if` and `else if` to check which state the light is in: red, then green, then yellow, then red again. The loop runs six times, with a 1 second pause after each pass.
befehle: 2 x (setLed 255 0 0, pause 1000, setLed 0 255 0, pause 1000, setLed 255 200 0, pause 1000)
braucht: forSchleife, verzweigung
tipp: Inside the loop: `if (state.equals("red")) { … } else if (state.equals("green")) { … } else { … }` and then `mbot.pause(1000);`.
tipp: In the red case are `mbot.setLed(255, 0, 0);` and `state = "green";`. Green switches to `"yellow"`, yellow back to `"red"`.
lösung: vb-java-ampel-text-loesung.visustruct
:::

::: übung vb-fehler-21-zustaende
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Traffic light with names", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-21-zustaende-start.visustruct
befehle: 2 x (setLed 255 0 0, pause 1000, setLed 0 255 0, pause 1000, setLed 255 200 0, pause 1000)
tipp: A text belongs in quotation marks. Without them Java looks for a variable with that name.
tipp: It should be `state = "green"`.
lösung: vb-java-ampel-text-loesung.visustruct
:::

## States while driving

The mBot2 can also drive with states. In the state **drive** it drives forward. When it sees a wall, it changes to the state **turn**. There it turns once and changes back to **drive**.

::: diagramm vb-l21z-ausweichen.visustruct
Driving and avoiding with two states. Open the diagram in the editor and try it out in a world.
:::

## Game: which state comes now?

::: spiel frage
titel: Game: which state comes now?
intro: The robo traffic light switches: 0 red → 1 green → 2 yellow → 0 red. Which state comes next? Five rounds.
frage: Which state comes next?
antworten: 0 | 1 | 2

runde:
frage: The light is in state **0** (red) right now.
richtig: 1
> After red comes green.

runde:
frage: The light is in state **2** (yellow) right now.
richtig: 0
> After yellow it starts all over again.

runde:
frage: The light is in state **1** (green) right now.
richtig: 2
> After green comes yellow.

runde:
frage: The light starts in state 0 and switches on **twice**.
richtig: 2
> 0 → 1 → 2.

runde:
frage: The light starts in state 0 and switches on **three times**.
richtig: 0
> 0 → 1 → 2 → 0. After three steps it is back at the start.
:::

::: quiz
? What does a state variable store?
→ What is a state?
- [ ] How often the loop has run
- [x] What the program is doing right now, for example red or green
- [ ] The biggest reading
? What is in each case of the switch?
→ The robo traffic light in the structure chart
- [x] What to do and which state comes next
- [ ] Only a pause
- [ ] A new loop
? How do you check in Java whether `state` contains the text `"red"`?
→ Now in Java: states with names
- [ ] `state == red`
- [x] `state.equals("red")`
- [ ] `state = "red"`
> You compare texts with `.equals`. A single `=` would assign `"red"`.
:::

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain what a state is. → What is a state?
- I can act depending on the state with a switch and change to the next state. → The robo traffic light in the structure chart
- I can tell states apart in Java with names and `.equals`. → Now in Java: states with names
:::
