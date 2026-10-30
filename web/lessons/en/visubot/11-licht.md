---
titel: The light sensor
bereich: VisuBot
kurz: Bright or dark? The mBot2 becomes a night light.
---

## Skills I will gain now

::: kompetenzen
- ask for the brightness
- switch the LEDs with a branch
- write several commands in one branch
:::

## How bright is it?

::: mbot2
focus: lightSensor
view: top
:::

The [light sensor]{part=lightSensor} is on the CyberPi. `mbot.getBrightness()` gives a number from **0** (pitch dark) to **100** (very bright).

| Sensor | Text | Value |
|---|---|---|
| Brightness | `mbot.getBrightness()` | 0 to 100 |

> In the simulation you set the brightness with the slider under **🎛 Try the sensors**. With a real mBot2 you simply hold your hand over the CyberPi.

## Night light in the structure chart

::: übung vb-nachtlicht
titel: Night light
auftrag: If the brightness is less than 30, the LEDs glow white (`mbot.setLed(255, 255, 255)`). Otherwise the LEDs go off (`mbot.ledOff()`).
messwerte: getBrightness=10 -> ledOn
messwerte: getBrightness=80 -> ledOff
braucht: verzweigung
tipp: Drag a branch into the structure chart and the sensor **Brightness** onto it. Write `< 30` after it.
tipp: The Yes branch gets **LEDs on** with `mbot.setLed(255, 255, 255)`, the No branch **LEDs off**.
lösung: vb-nachtlicht-loesung.visustruct
:::

::: angeberwissen
Street lights do the same: a light sensor notices when it gets dark and switches them on. That is why they come on earlier in winter than in summer, without anyone changing a clock.
:::

## Now in Java: night light with sound

::: übung vb-java-nachtlicht-ton
titel: Night light with sound
code: java
auftrag: Write the night light in Java, but with two changes: in the dark the LEDs glow yellow (`mbot.setLed(255, 200, 0)`) **and** the mBot2 plays a tone. In the light the LEDs go off, without a tone.
messwerte: getBrightness=10 -> ledOn, tone
messwerte: getBrightness=80 -> ledOff, noTone
braucht: verzweigung
tipp: `if (mbot.getBrightness() < 30) { … } else { … }`
tipp: The `if` part has two lines: `mbot.setLed(255, 200, 0);` and `mbot.playTone(440, 300);`.
lösung: vb-java-nachtlicht-ton-loesung.visustruct
:::

::: quiz
? `mbot.getBrightness()` gives 45. What does the night light do?
→ Night light in the structure chart
- [ ] The LEDs glow.
- [x] The LEDs go off.
> 45 is not less than 30.
? What range do the light sensor's values have?
→ How bright is it?
- [ ] 0 to 255
- [x] 0 to 100
- [ ] -100 to 100
:::

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can ask for the brightness. → How bright is it?
- I can switch the LEDs with a branch. → Night light in the structure chart
- I can write several commands in one branch. → Now in Java: night light with sound
:::
