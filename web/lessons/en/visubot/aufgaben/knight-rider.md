---
titel: Knight Rider
nach: 13
kurs: 13
stufe: 2
---

In the TV series “Knight Rider”, the talking car KITT has a red light at the front that keeps running back and forth. You rebuild it with the five LEDs.

::: übung vb-knight-rider
titel: Knight Rider
auftrag: A red light runs from LED 0 to LED 4 and back to LED 1. Each LED lights up for 100 milliseconds and then goes off. Use two for loops: one counts up, one counts down.
befehle: ledColor 0 "red", pause 100, ledColor 0 "off", ledColor 1 "red", pause 100, ledColor 1 "off", ledColor 2 "red", pause 100, ledColor 2 "off", ledColor 3 "red", pause 100, ledColor 3 "off", ledColor 4 "red", pause 100, ledColor 4 "off", ledColor 3 "red", pause 100, ledColor 3 "off", ledColor 2 "red", pause 100, ledColor 2 "off", ledColor 1 "red", pause 100, ledColor 1 "off"
braucht: forSchleife
tipp: The first loop counts `i` up from 0 to 4. The second starts at 3 and counts down with `i--` as long as `i > 0`.
tipp: In both loops: `mbot.led(i).setColor("red")`, `mbot.pause(100)`, `mbot.led(i).setColor("off")`.
lösung: vb-knight-rider-loesung.visustruct
:::
