---
titel: Avoid obstacles
nach: 13
kurs: 14
stufe: 2
---

On the way to the red field there are blocks in the way. The mBot2 drives forward in steps of 10 cm. If a block shows up (closer than 20 cm), it warns with light and sound and drives around it: turn right, 30 cm forward, turn left. Then it carries on straight ahead.

::: übung vb-hindernis
titel: Avoid obstacles
auftrag: The mBot2 drives as long as it is not on red. If a block is closer than 20 cm, the LEDs light up orange (`mbot.setLed(255, 128, 0)`), it beeps and drives around it. Then the LEDs go off. Otherwise it drives forward 10 cm. There are two worlds.
welt: hindernis-1 -> tone
welt: hindernis-2 -> tone
braucht: whileSchleife, verzweigung
tipp: On the outside a while loop with `!mbot.isRed()`, inside a branch with `mbot.getDistance() < 20`.
tipp: In the yes branch: `mbot.setLed(255, 128, 0)`, `mbot.playTone(880, 200)`, `mbot.turnRight()`, `mbot.forward(30)`, `mbot.turnLeft()`, `mbot.ledOff()`. In the no branch: `mbot.forward()`.
lösung: vb-hindernis-loesung.visustruct
:::
