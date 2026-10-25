---
titel: mBot2 in the for loop
---

## The square with a loop

Do you remember the square from lesson 5? Eight boxes, and the same pair repeats again and again: **drive forward** and **turn right**. That is exactly what the for loop is for.

::: übung vb-k-quadrat-schleife
titel: Square with a loop
auftrag: Let the mBot2 drive a square with 50 cm sides again. This time only two mBot2 boxes are in the diagram, inside a for loop.
fahrt: 4 x (forward 50, turnRight)
braucht: forSchleife
tipp: The loop runs four times, once for each side.
tipp: Start `int i = 0`, condition `i < 4`, step `i++`. The body contains `mbot.forward(50)` and `mbot.turnRight()`.
lösung: vb-k-quadrat-schleife-loesung.visustruct
:::

## A hexagon

Inside the brackets of **turn right** you can write how far it should turn: `mbot.turnRight(45)` turns only 45°. For every polygon the mBot2 turns all the way around once in total, that is 360°.

::: übung vb-k-sechseck
titel: The hexagon
auftrag: Let the mBot2 drive a hexagon with 30 cm sides. Use a for loop.
fahrt: 6 x (forward 30, turnRight 60)
braucht: forSchleife
tipp: Six corners share the 360° of a full turn. How much is that per corner?
tipp: The loop runs six times. In the body: `mbot.forward(30)` and `mbot.turnRight(60)`.
lösung: vb-k-sechseck-loesung.visustruct
:::

Under **Exercises** more shapes are waiting for the mBot2: staircase, triangle, spiral and slalom.

## A running light

Each of the five LEDs has a number from 0 to 4: `mbot.led(2).setColor("blue")` switches LED 2 blue, `mbot.led(2).setColor("off")` switches it off again. The number can also be the loop's counter. That way a light moves from LED to LED.

::: übung vb-k-lauflicht
titel: Running light
auftrag: A for loop counts `i` from 0 to 4. Inside, LED `i` turns blue, the mBot2 waits 200 milliseconds, and LED `i` goes off again.
befehle: ledColor 0 "blue", pause 200, ledColor 0 "off", ledColor 1 "blue", pause 200, ledColor 1 "off", ledColor 2 "blue", pause 200, ledColor 2 "off", ledColor 3 "blue", pause 200, ledColor 3 "off", ledColor 4 "blue", pause 200, ledColor 4 "off"
braucht: forSchleife
tipp: The loop runs from `i = 0` while `i < 5`. Inside there are three boxes: **set LED colour**, **wait a moment**, **set LED colour**.
tipp: `mbot.led(i).setColor("blue")`, `mbot.pause(200)`, `mbot.led(i).setColor("off")`.
lösung: vb-java-lauflicht-loesung.visustruct
:::
