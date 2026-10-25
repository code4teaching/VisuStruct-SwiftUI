---
titel: Buttons and joystick
bereich: VisuBot
kurz: The mBot2 waits for you and can be remote controlled.
---

## Pressing as a sensor

::: mbot2
focus: joystick, buttons
view: top
:::

On the CyberPi there are two [buttons]{part=buttons} (A and B) and a [joystick]{part=joystick}. For your program these are sensors: they give **true** as long as you press them.

| Sensor | Text |
|---|---|
| Button A / B pressed? | `mbot.isButtonA()`, `mbot.isButtonB()` |
| Joystick up / down | `mbot.isJoystickUp()`, `mbot.isJoystickDown()` |
| Joystick left / right | `mbot.isJoystickLeft()`, `mbot.isJoystickRight()` |

> Without a real mBot2, open **🎛 Try the sensors** below the world in the [simulation](#zeige-simulation). There you find the buttons A, B and the arrows for the joystick. A click keeps them pressed for one second.

## Waiting for button A in the structure chart

A robot should not drive off as soon as the program starts. Better: it waits until you press A.

Waiting means: a loop that runs as long as A is **not** pressed. So that it is not completely empty, the mBot2 waits briefly inside with **wait a moment** (`mbot.pause(100)`, that is 100 milliseconds).

::: übung vb-start-a
titel: Start with button A
auftrag: The mBot2 waits until button A is pressed. Then it drives forward 30 cm.
messwerte: isButtonA=false/true -> forward 30
messwerte: isButtonA=true -> forward 30
braucht: whileSchleife
tipp: A while loop with the condition `!mbot.isButtonA()`. Inside is **wait a moment**.
tipp: After the loop is `mbot.forward(30)`.
lösung: vb-start-a-loesung.visustruct
:::

> When checking, button A is not pressed for a while and then pressed. If your mBot2 drives off too early, it shows.

## Now in Java: remote control

With the joystick you steer the mBot2. The program asks the joystick five times in a row: up means drive forward, down means drive back.

::: übung vb-java-joystick
titel: Remote control
code: java
auftrag: Write a for loop in Java that runs five times. Inside: if the joystick is up, the mBot2 drives forward. Otherwise: if it is down, it drives back.
messwerte: isJoystickUp=true -> forward 50
messwerte: isJoystickDown=true -> backward 50
messwerte: isJoystickUp=false -> none
braucht: forSchleife, verzweigung
tipp: `for (int i = 0; i < 5; i++) { … }` and inside `if (mbot.isJoystickUp()) { … } else { … }`.
tipp: The `else` contains another branch: `if (mbot.isJoystickDown()) { mbot.backward(); }`.
lösung: vb-java-joystick-loesung.visustruct
:::

::: quiz
? What does `mbot.isButtonB()` give when nobody presses it?
- [ ] 0
- [x] false
- [ ] B
> Buttons give true or false.
? Why is there **wait a moment** in the waiting loop?
- [x] So the loop is not empty and the CyberPi doesn't race round in circles for nothing.
- [ ] So the button glows longer.
- [ ] Without a pause the mBot2 drives backwards.
> The loop checks every 100 milliseconds, that is plenty.
:::

::: checkliste
- I know the sensors for buttons and joystick. → Pressing as a sensor
- I can wait for a button. → Waiting for button A in the structure chart
- I can steer the mBot2 with the joystick. → Now in Java: remote control
:::
