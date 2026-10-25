---
titel: Reverse parking
nach: 14
kurs: 11
stufe: 2
---

To the right of the road there are parked cars (the blocks). Somewhere there is a gap, and right in front of it a blue marking is stuck on the road. The mBot2 looks for the gap and reverses into it, like a car.

It has no sensor at the back. So it looks forward at the wall opposite: the further it reverses into the gap, the bigger the distance to that wall gets.

::: übung vb-einparken
titel: Reverse parking
auftrag: The mBot2 drives forward in steps of 10 cm until it is on blue. Then it turns left, so its rear points to the gap. It reverses as long as the distance to the wall in front of it is below 45 cm. Finally the LEDs light up green and it shows **Parked!**. There are two roads with different gaps.
welt: parken-1 -> ledOn, screen "Parked!"
welt: parken-2 -> ledOn, screen "Parked!"
braucht: whileSchleife
tipp: Two while loops one after the other: first `!mbot.isBlue()` with `mbot.forward()` inside, then `mbot.getDistance() < 45` with `mbot.backward()` inside. In between is `mbot.turnLeft()`.
tipp: At the end: `mbot.setLed(0, 255, 0)` and `mbot.showText("Parked!")`.
lösung: vb-einparken-loesung.visustruct
:::
