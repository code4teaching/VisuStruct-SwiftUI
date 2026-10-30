---
titel: Single LEDs
bereich: VisuBot
kurz: Each of the five LEDs gets its own colour, all the way to a running light.
---

## Skills I will gain now

::: kompetenzen
- address the LEDs by their numbers 0 to 4
- make single LEDs light up in different colours
- build a running light with a loop
:::

## Every LED has a number

::: mbot2
focus: leds
view: back
:::

So far all five [LEDs]{part=leds} showed the same colour. But you can also address each LED on its own. For that, every LED has a **number**. As with arrays, counting starts at **0**: the five LEDs are called 0, 1, 2, 3 and 4.

| Command | Box | What happens |
|---|---|---|
| `mbot.led(0).setColor("green")` | **set LED colour** | LED 0 lights up green |
| `mbot.led(3).setColor("off")` | **set LED colour** | LED 3 goes off |

You write the colour as a name in quotes:

| Colour name | Colour name | Colour name |
|---|---|---|
| `"red"` | `"orange"` | `"yellow"` |
| `"green"` | `"cyan"` | `"blue"` |
| `"purple"` | `"pink"` | `"white"` |

With `"off"` you switch an LED off.

> The number can also be a variable: `mbot.led(i).setColor("red")`. That way a loop can switch on one LED after the other.

## Three lights in the structogram

::: übung vb-drei-lichter
titel: Three lights
auftrag: Switch LED 0 red, LED 2 yellow and LED 4 green. LEDs 1 and 3 stay off.
befehle: ledColor 0 "red", ledColor 2 "yellow", ledColor 4 "green"
tipp: Drag **set LED colour** into the structogram three times.
tipp: Change number and colour: `mbot.led(0).setColor("red")`, `mbot.led(2).setColor("yellow")`, `mbot.led(4).setColor("green")`.
lösung: vb-drei-lichter-loesung.visustruct
:::

## Now in Java: running light

In a running light, a light moves from one LED to the next. The loop variable `i` is the number of the LED.

::: übung vb-java-lauflicht
titel: Running light
code: java
auftrag: Write a for loop in Java in which `i` runs from 0 to 4. Inside, LED `i` turns blue, the mBot2 waits 200 milliseconds, and LED `i` goes off again.
befehle: ledColor 0 "blue", pause 200, ledColor 0 "off", ledColor 1 "blue", pause 200, ledColor 1 "off", ledColor 2 "blue", pause 200, ledColor 2 "off", ledColor 3 "blue", pause 200, ledColor 3 "off", ledColor 4 "blue", pause 200, ledColor 4 "off"
braucht: forSchleife
tipp: `for (int i = 0; i < 5; i++) { … }`
tipp: Inside the loop: `mbot.led(i).setColor("blue");`, `mbot.pause(200);`, `mbot.led(i).setColor("off");`.
lösung: vb-java-lauflicht-loesung.visustruct
:::

::: quiz
? Which number does the first LED have?
→ Every LED has a number
- [x] 0
- [ ] 1
- [ ] 5
> As with arrays, you count from 0. The five LEDs have the numbers 0 to 4.
? What does `mbot.led(4).setColor("off")` do?
→ Three lights in the structogram
- [ ] All LEDs go off.
- [x] Only LED 4 goes off.
- [ ] Four LEDs go off.
:::

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can address the LEDs by their numbers 0 to 4. → Every LED has a number
- I can make single LEDs light up in different colours. → Three lights in the structogram
- I can build a running light with a loop. → Now in Java: running light
:::
