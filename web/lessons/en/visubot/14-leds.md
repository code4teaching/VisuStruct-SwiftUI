---
titel: The LEDs
bereich: Light, sound and screen
kurz: Mix colours, build a traffic light and make it blink.
---

## Skills I will gain now

::: kompetenzen
- mix a colour from red, green and blue
- show colours one after the other with pauses
- make the LEDs blink in Java
:::

## Mixing red, green and blue

::: mbot2
focus: leds
view: back
:::

The five [LEDs]{part=leds} are an **actuator**: they do something, they light up. Each LED mixes its colour from red, green and blue, each from 0 (off) to 255 (fully bright).

| Command | Box | What happens |
|---|---|---|
| `mbot.setLed(255, 0, 0)` | **LEDs on** | all LEDs red |
| `mbot.ledOff()` | **LEDs off** | all LEDs off |
| `mbot.pause(1000)` | **wait a moment** | wait 1000 milliseconds (1 second) |

| Colour | Red | Green | Blue |
|---|---|---|---|
| Red | 255 | 0 | 0 |
| Yellow | 255 | 200 | 0 |
| Green | 0 | 255 | 0 |
| Blue | 0 | 0 | 255 |
| White | 255 | 255 | 255 |
| Purple | 160 | 0 | 255 |

> Without **wait a moment** the mBot2 switches the colours so fast that you only see the last one. In the simulation you see the colour on the LEDs of the 3D model.

## Traffic light in the structure chart

::: übung vb-ampel
titel: Traffic light
auftrag: The LEDs show red, yellow and green one after the other like a traffic light. Between the colours the mBot2 waits 1000 milliseconds each time. Yellow is `255, 200, 0`.
befehle: setLed 255 0 0, pause 1000, setLed 255 200 0, pause 1000, setLed 0 255 0
tipp: Drag **LEDs on** three times and **wait a moment** twice into the structure chart, taking turns.
tipp: Change the numbers: `mbot.setLed(255, 0, 0)`, `mbot.pause(1000)`, `mbot.setLed(255, 200, 0)`, `mbot.pause(1000)`, `mbot.setLed(0, 255, 0)`.
lösung: vb-ampel-loesung.visustruct
:::

## Now in Java: blue light

Blinking means: on, wait, off, wait, again and again. “Again and again” is a loop.

::: übung vb-java-blinken
titel: Blue light
code: java
auftrag: Write a for loop in Java that runs three times. Inside, the LEDs go blue, the mBot2 waits 500 milliseconds, the LEDs go off, and it waits 500 milliseconds again.
befehle: 3 x (setLed 0 0 255, pause 500, ledOff, pause 500)
braucht: forSchleife
tipp: `for (int i = 0; i < 3; i++) { … }`
tipp: Inside the loop: `mbot.setLed(0, 0, 255);`, `mbot.pause(500);`, `mbot.ledOff();`, `mbot.pause(500);`.
lösung: vb-java-blinken-loesung.visustruct
:::

::: übung vb-fehler-14-leds
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Blue light", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-14-leds-start.visustruct
befehle: 3 x (setLed 0 0 255, pause 500, ledOff, pause 500)
tipp: Read the error message carefully. In which box does the simulation stop? Java is case-sensitive.
tipp: It should be `mbot.pause(500)`.
lösung: vb-java-blinken-loesung.visustruct
:::

## Game: Which colour?

::: spiel frage
titel: Game: Which colour?
intro: Red, green and blue mixed together: which colour do the LEDs show? Seven rounds.

runde:
    mbot.setLed(255, 0, 0);
frage: Which colour lights up?
- [x] red
- green
- blue
> Only the first value, red, is on.

runde:
    mbot.setLed(0, 0, 255);
frage: Which colour lights up?
- red
- green
- [x] blue
> The order is always red, green, blue. Only blue is on.

runde:
    mbot.setLed(255, 255, 255);
frage: Which colour lights up?
- yellow
- [x] white
- off
> All three colours at full brightness make white.

runde:
    mbot.setLed(255, 200, 0);
frage: Which colour lights up?
- [x] yellow
- purple
- white
> Red and green together make yellow.

runde:
    mbot.setLed(160, 0, 255);
frage: Which colour lights up?
- yellow
- [x] purple
- green
> Red and blue together make purple.

runde:
    mbot.setLed(0, 0, 0);
frage: Which colour lights up?
- white
- black
- [x] none, the LEDs are off
> All three values are 0. An LED can't shine black.

runde:
    mbot.setLed(255, 0, 0);
    mbot.setLed(0, 255, 0);
    mbot.pause(1000);
frage: Which colour do you see for one second?
- red
- [x] green
- first red, then green
> Without **wait a moment** between the colours, red is gone immediately.
:::

## Game: Defuse the bomb

::: spiel bombe
titel: Game: Defuse the bomb
intro: Every program contains **exactly one mistake**, and the bomb is ticking. Tap the wrong line before time runs out. Four rounds, 30 seconds each.
zeit: 30

runde:
    mbot.setLed(255, 0, 0);
    mbot.pause(1000);
    mbot.setLed(255, 200, 0);
    mbot.pause(1000);
    mbot.setLed(0, 0, 255);
frage: Should show red, yellow and green like a traffic light.
fehler: 5
besser: mbot.setLed(0, 255, 0);
> Green is `0, 255, 0`. `0, 0, 255` is blue.

runde:
    for (int i = 0; i < 3; i++) {
        mbot.setLed(0, 0, 255);
        mbot.pause(500);
        mbot.ledOff;
        mbot.pause(500);
    }
frage: Should flash blue three times.
fehler: 4
besser: mbot.ledOff();
> A command without a number still needs its brackets.

runde:
    mbot.setLed(0, 0, 300);
    mbot.pause(1000);
    mbot.ledOff();
frage: Should shine bright blue for one second.
fehler: 1
besser: mbot.setLed(0, 0, 255);
> Each colour only goes from 0 to 255.

runde:
    mbot.setLed(255, 255, 255);
    mbot.pause(1000);
    mbot.setLed(0, 0, 0, 0);
frage: Should shine white for one second and then go off.
fehler: 3
besser: mbot.ledOff();
> `setLed` has exactly three numbers: red, green, blue. To switch off there is `mbot.ledOff()`.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can mix a colour from red, green and blue. → Mixing red, green and blue
- I can show colours one after the other with pauses. → Traffic light in the structure chart
- I can make the LEDs blink in Java. → Now in Java: blue light
:::

## Quiz

::: quiz
? Which colour does `mbot.setLed(0, 255, 0)` give?
→ Mixing red, green and blue
- [ ] Red
- [x] Green
- [ ] Blue
> The numbers are red, green, blue. Only green is on.
? Why does the blue light need **wait a moment**?
→ Now in Java: blue light
- [x] Otherwise it changes so fast that you can't see any blinking.
- [ ] Otherwise the LEDs break.
- [ ] Because `ledOff()` doesn't work otherwise.
:::
