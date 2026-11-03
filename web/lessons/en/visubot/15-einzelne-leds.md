---
titel: Single LEDs
bereich: Light, sound and screen
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

::: übung vb-fehler-15-einzelne-leds
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Running light", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-15-einzelne-leds-start.visustruct
befehle: ledColor 0 "blue", pause 200, ledColor 0 "off", ledColor 1 "blue", pause 200, ledColor 1 "off", ledColor 2 "blue", pause 200, ledColor 2 "off", ledColor 3 "blue", pause 200, ledColor 3 "off", ledColor 4 "blue", pause 200, ledColor 4 "off"
tipp: The error message names an unknown variable. What is the variable called where it is created? Java is case-sensitive.
tipp: It should be `mbot.led(i)`.
lösung: vb-java-lauflicht-loesung.visustruct
:::

## Game: Which LED is on?

::: spiel frage
titel: Game: Which LED is on?
intro: Five LEDs numbered 0 to 4. Which ones light up? Six rounds.

runde:
    mbot.led(0).setColor("red");
frage: Which LED lights up red?
- [x] the first one
- the second one
- all of them
> The numbers start at 0. LED 0 is the first one.

runde:
    for (int i = 0; i < 5; i++) {
        mbot.led(i).setColor("blue");
    }
frage: Which LEDs light up blue?
- LEDs 0 to 3
- [x] all five
- only LED 4
> `i` runs from 0 to 4, that is all five.

runde:
    for (int i = 0; i < 5; i = i + 2) {
        mbot.led(i).setColor("green");
    }
frage: Which LEDs light up green?
- LEDs 1 and 3
- [x] LEDs 0, 2 and 4
- LEDs 2 and 4
> `i` jumps in steps of two: 0, 2, 4.

runde:
    mbot.led(2).setColor("yellow");
    mbot.led(2).setColor("off");
frage: Which LED is on at the end?
- LED 2 yellow
- [x] none
- LED 3 yellow
> LED 2 goes on and straight off again.

runde:
    for (int i = 4; i >= 0; i--) {
        mbot.led(i).setColor("red");
        mbot.pause(200);
        mbot.led(i).setColor("off");
    }
frage: At which LED does this running light start?
- LED 0
- [x] LED 4
- LED 5
> `i` starts at 4 and counts down. The light runs the other way round.

runde:
frage: Ludwig writes `mbot.led(5).setColor("red");`. Which LED lights up?
- the fifth one
- the sixth one
- [x] none, there is no LED 5
> The five LEDs are numbered 0 to 4.
:::

## Game: Defuse the bomb

::: spiel bombe
titel: Game: Defuse the bomb
intro: Every program contains **exactly one mistake**, and the bomb is ticking. Tap the wrong line before time runs out. Four rounds, 30 seconds each.
zeit: 30

runde:
    mbot.led(1).setColor("red");
    mbot.led(2).setColor("yellow");
    mbot.led(4).setColor("green");
frage: Should switch LED 0 red, LED 2 yellow and LED 4 green.
fehler: 1
besser: mbot.led(0).setColor("red");
> The first LED has the number 0.

runde:
    for (int i = 1; i <= 5; i++) {
        mbot.led(i).setColor("blue");
    }
frage: Should switch all five LEDs blue.
fehler: 1
besser: for (int i = 0; i < 5; i++) {
> The LEDs are numbered 0 to 4. There is no LED 5.

runde:
    for (int i = 0; i < 5; i++) {
        mbot.led(i).setColor("blue");
        mbot.pause(200);
        mbot.led(0).setColor("off");
    }
frage: Running light: each LED goes blue for a moment and then off again.
fehler: 4
besser: mbot.led(i).setColor("off");
> The same LED `i` should go off, not always LED 0.

runde:
    mbot.led(3).setColor(red);
frage: Should switch LED 3 red.
fehler: 1
besser: mbot.led(3).setColor("red");
> The colour name is a text and needs quotation marks.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can address the LEDs by their numbers 0 to 4. → Every LED has a number
- I can make single LEDs light up in different colours. → Three lights in the structogram
- I can build a running light with a loop. → Now in Java: running light
:::

## Quiz

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
