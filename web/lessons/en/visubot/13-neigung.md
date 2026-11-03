---
titel: The motion sensor
bereich: Sensors and decisions
kurz: Measure tilt and detect shaking.
---

## Skills I will gain now

::: kompetenzen
- explain what the motion sensor measures
- join two conditions with “or”
- join several conditions with “and”
:::

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

::: übung vb-fehler-13-neigung
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Spirit level", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-13-neigung-start.visustruct
messwerte: getPitch=0, getRoll=0 -> ledOn
messwerte: getPitch=0, getRoll=20 -> ledOff
messwerte: getPitch=-10, getRoll=0 -> ledOff
tipp: Read the error message carefully. In which box does the simulation stop? Java is case-sensitive.
tipp: It should be `mbot.setLed(0, 255, 0)`.
lösung: vb-java-wasserwaage-loesung.visustruct
:::

## Game: Too steep?

::: spiel frage
titel: Game: Too steep?
intro: Ludwig tilts the mBot2. What does it do? Six rounds.

runde:
    if (mbot.getPitch() > 20 || mbot.getPitch() < -20) {
        mbot.playTone(440, 300);
    }
frage: The nose points 30° down, `mbot.getPitch()` gives 30.
- [x] It beeps.
- It doesn't beep.
> 30 is greater than 20. One true part is enough for `||`.

runde:
    if (mbot.getPitch() > 20 || mbot.getPitch() < -20) {
        mbot.playTone(440, 300);
    }
frage: The nose points up, `mbot.getPitch()` gives −25.
- [x] It beeps.
- It doesn't beep.
> −25 is less than −20, so the second part is true.

runde:
    if (mbot.getPitch() > 20 || mbot.getPitch() < -20) {
        mbot.playTone(440, 300);
    }
frage: A gentle ramp, `mbot.getPitch()` gives 10.
- It beeps.
- [x] It doesn't beep.
> 10 is between −20 and 20. Both parts are false.

runde:
    if (mbot.getPitch() > 20 || mbot.getPitch() < -20) {
        mbot.playTone(440, 300);
    }
frage: `mbot.getPitch()` gives exactly 20.
- It beeps.
- [x] It doesn't beep.
> 20 is not greater than 20.

runde:
    if (mbot.getPitch() > -5 && mbot.getPitch() < 5 && mbot.getRoll() > -5 && mbot.getRoll() < 5) {
        mbot.setLed(0, 255, 0);
    } else {
        mbot.ledOff();
    }
frage: `mbot.getPitch()` gives 0, `mbot.getRoll()` gives 3.
- [x] The LEDs light up green.
- The LEDs are off.
> All four parts are true. The mBot2 is almost level.

runde:
    if (mbot.getPitch() > -5 && mbot.getPitch() < 5 && mbot.getRoll() > -5 && mbot.getRoll() < 5) {
        mbot.setLed(0, 255, 0);
    } else {
        mbot.ledOff();
    }
frage: `mbot.getPitch()` gives 2, `mbot.getRoll()` gives −8.
- The LEDs light up green.
- [x] The LEDs are off.
> −8 is not greater than −5. With `&&`, one false part makes everything false.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain what the motion sensor measures. → Tilted or level?
- I can join two conditions with “or”. → Tilt warning in the structure chart
- I can join several conditions with “and”. → Now in Java: spirit level
:::

## Quiz

::: quiz
? The mBot2 is lying flat on the table. What does `mbot.getPitch()` give, roughly?
→ Tilted or level?
- [x] 0
- [ ] 90
- [ ] 100
? What does `mbot.isShaken()` do?
→ Tilted or level?
- [ ] It shakes the mBot2.
- [x] It reports whether someone is shaking the mBot2.
> Sensors don't do anything, they only measure.
:::
