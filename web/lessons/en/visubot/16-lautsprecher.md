---
titel: The speaker
bereich: VisuBot
kurz: Tones, a scale and a siren.
---

## Skills I will gain now

::: kompetenzen
- explain what the two numbers in `playTone` mean
- build a sequence of tones
- calculate with the counting variable in Java
- make the mBot2 show a feeling
:::

## How high, how long?

::: mbot2
focus: cyberpi
view: top
:::

The [CyberPi]{part=cyberpi} has a small speaker. `mbot.playTone(440, 300)` plays a tone:

- The first number is the **pitch** in hertz (vibrations per second). The bigger, the higher.
- The second number is the **length** in milliseconds.

| Note | C | D | E | F | G | A | B | C' |
|---|---|---|---|---|---|---|---|---|
| Hertz | 262 | 294 | 330 | 349 | 392 | 440 | 494 | 523 |

> In the simulation you hear the tones through your computer's speakers. Feel free to turn it down a bit.

## Scale in the structure chart

::: übung vb-tonleiter
titel: Scale
auftrag: The mBot2 plays the notes C, D, E, F, G one after the other, each 300 milliseconds long. The hertz numbers are in the table.
befehle: playTone 262 300, playTone 294 300, playTone 330 300, playTone 349 300, playTone 392 300
tipp: Drag **play a tone** into the structure chart five times.
tipp: The boxes are `mbot.playTone(262, 300)`, `mbot.playTone(294, 300)` and so on.
lösung: vb-tonleiter-loesung.visustruct
:::

::: angeberwissen
The note A at 440 hertz is called **concert pitch**. Orchestras tune their instruments to it. One octave higher has exactly twice as many vibrations: 880 hertz.
:::

## Now in Java: higher and higher

In a for loop you can calculate with the counting variable. That way each tone is higher than the last:

```java
mbot.playTone(i * 200, 200);
```

::: übung vb-java-hoeher
titel: Higher and higher
code: java
auftrag: Write a for loop in Java in which `i` counts from 1 to 5. In each round the mBot2 plays a tone with `i * 200` hertz, 200 milliseconds long.
befehle: playTone 200 200, playTone 400 200, playTone 600 200, playTone 800 200, playTone 1000 200
braucht: forSchleife
tipp: `for (int i = 1; i <= 5; i++) { … }`
tipp: The loop only contains `mbot.playTone(i * 200, 200);`.
lösung: vb-java-hoeher-loesung.visustruct
:::

## Showing feelings

The mBot2 can also be happy, sad or sleepy. With **show a feeling** (`mbot.emotion("smile")`) it plays a little show: the LEDs light up, it makes a sound and wiggles a bit.

| Text | Feeling |
|---|---|
| `mbot.emotion("smile")` | laughs |
| `mbot.emotion("hello")` | says hello |
| `mbot.emotion("sad")` | is sad |
| `mbot.emotion("angry")` | is angry |
| `mbot.emotion("dizzy")` | is dizzy |
| `mbot.emotion("zzz")` | sleeps |

> Try it with the real mBot2. The simulator only shows the command. More feelings are listed under **Reference**.

::: quiz
? Which tone is higher?
→ How high, how long?
- [x] `mbot.playTone(880, 300)`
- [ ] `mbot.playTone(440, 300)`
> More hertz means higher.
? How long does `mbot.playTone(440, 1000)` sound?
→ How high, how long?
- [ ] 440 seconds
- [x] 1 second
- [ ] 1000 seconds
> 1000 milliseconds are one second.
:::

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain what the two numbers in `playTone` mean. → How high, how long?
- I can build a sequence of tones. → Scale in the structure chart
- I can calculate with the counting variable in Java. → Now in Java: higher and higher
- I can make the mBot2 show a feeling. → Showing feelings
:::
