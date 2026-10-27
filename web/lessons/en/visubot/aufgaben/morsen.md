---
titel: Morse code
nach: 13
stufe: 2
---

Ships used to send messages with light, in **Morse code**: every letter is made of short and long signals. The best-known distress call is **SOS**: S is three short, O is three long.

::: übung vb-morsen
titel: Morse SOS
auftrag: LED 2 sends SOS in white. Short means: on for 200 milliseconds, then off for 200. Long means: on for 600 milliseconds, then off for 200. Between the letters the mBot2 waits another 400 milliseconds. Use a loop for each letter.
befehle: 3 x (ledColor 2 "white", pause 200, ledColor 2 "off", pause 200), pause 400, 3 x (ledColor 2 "white", pause 600, ledColor 2 "off", pause 200), pause 400, 3 x (ledColor 2 "white", pause 200, ledColor 2 "off", pause 200)
braucht: forSchleife
tipp: Three for loops one after the other, each runs three times. Between them there is **wait a moment** with 400.
tipp: In the first and third loop: `mbot.led(2).setColor("white")`, `mbot.pause(200)`, `mbot.led(2).setColor("off")`, `mbot.pause(200)`. In the middle one it waits 600 after switching on.
lösung: vb-morsen-loesung.visustruct
:::
