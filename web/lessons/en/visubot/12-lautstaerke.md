---
titel: The microphone
bereich: VisuBot
kurz: Clap to start, and a noise light for the classroom.
---

## Skills I will gain now

::: kompetenzen
- ask for the loudness
- wait until something happens
- write a noise light in Java
:::

## How loud is it?

::: mbot2
focus: microphone
view: top
:::

The CyberPi's [microphone]{part=microphone} measures the loudness. `mbot.getLoudness()` gives **0** (silent) to **100** (very loud). A clap nearby gives about 60 to 90.

| Sensor | Text | Value |
|---|---|---|
| Loudness | `mbot.getLoudness()` | 0 to 100 |

## Clap to start in the structure chart

Just like waiting for button A: a loop waits as long as it is quiet. Only then does the mBot2 drive off.

::: übung vb-klatschen
titel: Clap to start
auftrag: The mBot2 waits as long as the loudness is less than 50. Then it drives forward 30 cm.
messwerte: getLoudness=0/80 -> forward 30
messwerte: getLoudness=90 -> forward 30
braucht: whileSchleife
tipp: A while loop with the condition `mbot.getLoudness() < 50`, with **wait a moment** inside.
tipp: After the loop: `mbot.forward(30)`.
lösung: vb-klatschen-loesung.visustruct
:::

> In the simulation you push the **Loudness** slider to the right while the program is waiting.

## Now in Java: noise light

::: übung vb-java-laermampel
titel: Noise light
code: java
auftrag: Write in Java: if the loudness is greater than 60, the LEDs glow red. Otherwise they are off.
messwerte: getLoudness=80 -> ledOn
messwerte: getLoudness=20 -> ledOff
braucht: verzweigung
tipp: `if (mbot.getLoudness() > 60) { … } else { … }`
tipp: Red is `mbot.setLed(255, 0, 0);`, off is `mbot.ledOff();`.
lösung: vb-java-laermampel-loesung.visustruct
:::

::: angeberwissen
Loudness is really measured in **decibels** (dB). Whispering is about 30 dB, a classroom 60 to 70 dB, a pneumatic drill 100 dB. The CyberPi turns that into a simple number from 0 to 100.
:::

::: quiz
? The clap loop is `while (mbot.getLoudness() < 50)`. The loudness is 30. What happens?
→ Clap to start in the structure chart
- [x] The mBot2 keeps waiting.
- [ ] The mBot2 drives off.
> 30 is less than 50, the condition is true, the loop keeps running.
:::

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can ask for the loudness. → How loud is it?
- I can wait until something happens. → Clap to start in the structure chart
- I can write a noise light in Java. → Now in Java: noise light
:::
