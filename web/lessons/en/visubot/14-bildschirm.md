---
titel: The screen
bereich: VisuBot
kurz: Show text, numbers and sensor values on the CyberPi.
---

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

::: quiz
? What does `mbot.showText("Distance: " + 25)` show?
- [x] Distance: 25
- [ ] "Distance: " + 25
- [ ] 25
> The `+` adds the number to the text.
? What happens to the old text when you show a new one?
- [x] It is replaced.
- [ ] The new one appears below it.
:::

::: checkliste
- I can show text on the screen. → Showing text
- I can show several texts one after the other. → Greeting in the structure chart
- I can show numbers and sensor values. → Numbers and sensor values
- I can write a countdown in Java. → Now in Java: countdown
:::
