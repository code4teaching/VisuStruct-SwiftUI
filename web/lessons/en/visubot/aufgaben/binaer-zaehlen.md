---
titel: Counting in binary
nach: 13
stufe: 3
---

Computers calculate with only two digits: 0 and 1. That is called **binary**. With three LEDs you can show the numbers 0 to 7 in binary: LED 0 counts 1, LED 1 counts 2 and LED 2 counts 4. The number 5 is 4 + 1, so LED 2 and LED 0 light up.

| Number | LED 2 (4) | LED 1 (2) | LED 0 (1) |
|---|---|---|---|
| 0 | off | off | off |
| 1 | off | off | on |
| 2 | off | on | off |
| 3 | off | on | on |
| 5 | on | off | on |

::: übung vb-binaer-zaehlen
titel: Counting in binary
auftrag: A for loop counts `number` from 0 to 7. For each number, each of the LEDs 0, 1 and 2 lights up green or is off, exactly as in the table. Then the mBot2 waits 1000 milliseconds. Always switch the LEDs in the order 0, 1, 2.
befehle: ledColor 0 "off", ledColor 1 "off", ledColor 2 "off", pause 1000, ledColor 0 "green", ledColor 1 "off", ledColor 2 "off", pause 1000, ledColor 0 "off", ledColor 1 "green", ledColor 2 "off", pause 1000, ledColor 0 "green", ledColor 1 "green", ledColor 2 "off", pause 1000, ledColor 0 "off", ledColor 1 "off", ledColor 2 "green", pause 1000, ledColor 0 "green", ledColor 1 "off", ledColor 2 "green", pause 1000, ledColor 0 "off", ledColor 1 "green", ledColor 2 "green", pause 1000, ledColor 0 "green", ledColor 1 "green", ledColor 2 "green", pause 1000
braucht: forSchleife, verzweigung
tipp: Whether LED 0 is on is given by the remainder when dividing by 2: `number % 2 == 1`. For LED 1 you first divide by 2: `number / 2 % 2 == 1`. For LED 2 by 4: `number / 4 % 2 == 1`.
tipp: The loop contains three branches and then **wait a moment**. In the yes branch, for example, `mbot.led(0).setColor("green")`, in the no branch `mbot.led(0).setColor("off")`.
lösung: vb-binaer-zaehlen-loesung.visustruct
:::
