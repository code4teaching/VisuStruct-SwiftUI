---
titel: The screen
bereich: Light, sound and screen
kurz: Show text, numbers and sensor values on the CyberPi.
---

## Skills I will gain now

::: kompetenzen
- show text on the screen
- show several texts one after the other
- show numbers and sensor values
- write a countdown in Java
:::

## Showing text

::: mbot2
focus: screen
view: back
:::

The CyberPi's colour [screen]{part=screen} is an actuator too. With **show text** you write something on it:

```java
mbot.showText("Hello!")
```

The text is in quotation marks, as with `System.out.println`. A new text replaces the old one.

> In the simulation the text appears on the screen of the 3D model and below the world after 📺.

## Greeting in the structure chart

::: übung vb-begruessung
titel: Greeting
auftrag: The mBot2 first shows “Hello!”, waits 1000 milliseconds and then shows “I am VisuBot”.
befehle: showText "Hello!", pause 1000, showText "I am VisuBot"
tipp: Drag **show text** twice and **wait a moment** once into the structure chart.
tipp: `mbot.showText("Hello!")`, `mbot.pause(1000)`, `mbot.showText("I am VisuBot")`.
lösung: vb-begruessung-loesung.visustruct
:::

## Numbers and sensor values

Instead of text you can also show numbers and variables, and with `+` you join everything together:

```java
mbot.showText(i)
mbot.showText("Distance: " + mbot.getDistance())
```

That way the mBot2 shows you what its sensors are measuring right now.

## Now in Java: countdown

::: übung vb-java-countdown
titel: Countdown
code: java
auftrag: Write a countdown in Java: a for loop counts `i` backwards from 3 to 1. In each round the mBot2 shows `i` and waits 1000 milliseconds. After that it shows “Go!”.
befehle: showText "3", pause 1000, showText "2", pause 1000, showText "1", pause 1000, showText "Go!"
braucht: forSchleife
tipp: Counting backwards: `for (int i = 3; i >= 1; i--) { … }`
tipp: Inside the loop: `mbot.showText(i);` and `mbot.pause(1000);`. After the loop `mbot.showText("Go!");`.
lösung: vb-java-countdown-loesung.visustruct
:::

::: übung vb-fehler-18-bildschirm
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Countdown", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-18-bildschirm-start.visustruct
befehle: showText "3", pause 1000, showText "2", pause 1000, showText "1", pause 1000, showText "Go!"
tipp: The error message names an unknown variable. What is the variable called where it is created? Java is case-sensitive.
tipp: It should be `mbot.showText(i)`.
lösung: vb-java-countdown-loesung.visustruct
:::

## Game: What's on the screen?

::: spiel frage
titel: Game: What's on the screen?
intro: Read the code and predict what the screen shows at the end. Six rounds.

runde:
    mbot.showText("Hello!");
    mbot.pause(1000);
    mbot.showText("I am VisuBot");
frage: What is on the screen at the end?
- Hello! I am VisuBot
- [x] I am VisuBot
- Hello!
> A new text replaces the old one.

runde:
    mbot.showText("Distance: " + 25);
frage: What is on the screen?
- [x] Distance: 25
- "Distance: " + 25
- Distance:
> The `+` attaches the number to the text.

runde:
    int i = 3;
    mbot.showText("i");
frage: What is on the screen?
- 3
- [x] i
- "i"
> In quotation marks, `i` is a text, not a variable. The quotation marks themselves don't appear.

runde:
    for (int i = 3; i >= 1; i--) {
        mbot.showText(i);
        mbot.pause(1000);
    }
    mbot.showText("Start!");
frage: Which number is shown just before "Start!"?
- 0
- [x] 1
- 3
> The countdown shows 3, 2, 1. At 0, `i >= 1` is false.

runde:
    mbot.showText("Sum: " + 2 + 3);
frage: What is on the screen?
- Sum: 5
- [x] Sum: 23
- Sum: 2 + 3
> Java works from left to right: first the 2 is attached to the text, then the 3.

runde:
    mbot.showText("Sum: " + (2 + 3));
frage: What is on the screen?
- [x] Sum: 5
- Sum: 23
- Sum: (2 + 3)
> Java works out the brackets first.
:::

## Game: Defuse the bomb

::: spiel bombe
titel: Game: Defuse the bomb
intro: Every program contains **exactly one mistake**, and the bomb is ticking. Tap the wrong line before time runs out. Four rounds, 30 seconds each.
zeit: 30

runde:
    mbot.showText("Hello!");
    mbot.pause(1);
    mbot.showText("I am VisuBot");
frage: Should show "Hello!", wait one second and then show "I am VisuBot".
fehler: 2
besser: mbot.pause(1000);
> `pause` counts in milliseconds. One second is 1000.

runde:
    for (int i = 3; i >= 1; i++) {
        mbot.showText(i);
        mbot.pause(1000);
    }
frage: Countdown: should show 3, 2, 1.
fehler: 1
besser: for (int i = 3; i >= 1; i--) {
> Counting down means `i--`. With `i++` the loop never stops.

runde:
    mbot.showText(Hello!);
frage: Should show "Hello!".
fehler: 1
besser: mbot.showText("Hello!");
> Text goes in quotation marks.

runde:
    mbot.showText("Distance: " - mbot.getDistance());
frage: Should show for example "Distance: 25".
fehler: 1
besser: mbot.showText("Distance: " + mbot.getDistance());
> You join text and number with `+`.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can show text on the screen. → Showing text
- I can show several texts one after the other. → Greeting in the structure chart
- I can show numbers and sensor values. → Numbers and sensor values
- I can write a countdown in Java. → Now in Java: countdown
:::

## Quiz

::: quiz
? What does `mbot.showText("Distance: " + 25)` show?
→ Numbers and sensor values
- [x] Distance: 25
- [ ] "Distance: " + 25
- [ ] 25
> The `+` adds the number to the text.
? What happens to the old text when you show a new one?
→ Showing text
- [x] It is replaced.
- [ ] The new one appears below it.
:::
