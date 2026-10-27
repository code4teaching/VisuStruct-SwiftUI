---
titel: The motion sensor
bereich: VisuBot
kurz: Measure tilt and detect shaking.
---

## Tilted or level?

::: mbot2
focus: cyberpi
spin: yes
:::

Inside the [CyberPi]{part=cyberpi} there is a **motion sensor** (gyroscope). It measures how tilted the mBot2 is, in degrees:

| Sensor | Text | Value |
|---|---|---|
| Tilt forward/back | `mbot.getPitch()` | nose down: positive, nose up: negative (−90 to 90) |
| Tilt sideways | `mbot.getRoll()` | positive to one side, negative to the other |
| Shaken? | `mbot.isShaken()` | `true` or `false` |

When the mBot2 is lying flat on the table, both tilts are about **0**.

> In the simulation there are two sliders for this under **🎛 Try the sensors** and the button **shake**. With a real mBot2 you tilt it carefully in your hand.

## Tilt warning in the structure chart

If the mBot2 drives up or down a ramp that is too steep, it should warn you. Too steep means: more than 20° forward **or** more than 20° back.

::: übung vb-schraeglage
titel: Tilt warning
auftrag: If the forward/back tilt is greater than 20 **or** less than −20, the mBot2 plays a tone. Otherwise it does nothing.
messwerte: getPitch=30 -> tone
messwerte: getPitch=-30 -> tone
messwerte: getPitch=5 -> noTone
braucht: verzweigung
tipp: “or” in a condition is `||`. Drag the sensor **Tilt forward/back** onto the branch twice.
tipp: The condition is `mbot.getPitch() > 20 || mbot.getPitch() < -20`, the Yes branch gets **play a tone**.
lösung: vb-schraeglage-loesung.visustruct
:::

## Now in Java: spirit level

A spirit level shows whether something is exactly level. The mBot2 glows green when both tilts are between −5 and 5.

::: übung vb-java-wasserwaage
titel: Spirit level
code: java
auftrag: Write in Java: if `mbot.getPitch()` and `mbot.getRoll()` are both between −5 and 5, the LEDs glow green. Otherwise they are off.
messwerte: getPitch=0, getRoll=0 -> ledOn
messwerte: getPitch=0, getRoll=20 -> ledOff
messwerte: getPitch=-10, getRoll=0 -> ledOff
braucht: verzweigung
tipp: “and” is `&&`. You need four comparisons: `mbot.getPitch() > -5 && mbot.getPitch() < 5 && …`
tipp: Green is `mbot.setLed(0, 255, 0);`, the `else` has `mbot.ledOff();`.
lösung: vb-java-wasserwaage-loesung.visustruct
:::

::: quiz
? The mBot2 is lying flat on the table. What does `mbot.getPitch()` give, roughly?
- [x] 0
- [ ] 90
- [ ] 100
? What does `mbot.isShaken()` do?
- [ ] It shakes the mBot2.
- [x] It reports whether someone is shaking the mBot2.
> Sensors don't do anything, they only measure.
:::

::: checkliste
- I know what the motion sensor measures. → Tilted or level?
- I can join two conditions with “or”. → Tilt warning in the structure chart
- I can join several conditions with “and”. → Now in Java: spirit level
:::
