---
titel: The mBot2
bereich: VisuBot
kurz: Get to know the robot you are about to program.
---

## Hello mBot2

The **mBot2** is a small robot made by Makeblock. It has two wheels, sensors to notice its surroundings, and a small computer that runs your program.

In VisuBot you program it with structure charts. You can try every program in the simulator first, even without a real robot.

::: mbot2
cyberpi: **CyberPi** – the brain. A small computer with a screen, five coloured LEDs, a speaker and two buttons. It runs your program.
motors: **Motors and wheels** – two motors drive the wheels. If both turn at the same speed, the mBot2 drives straight. If they turn in opposite directions, it turns on the spot.
ultrasonic: **Ultrasonic sensor** – the “eyes” at the front. It sends out sound and measures how long the echo takes. That is how the mBot2 knows how far away the next wall is.
lineSensor: **Line sensor** – four small sensors under the nose. They detect whether there is a dark line underneath.
chassis: **Chassis** – the blue aluminium frame holds everything together.
:::

## Sensors and actuators

A robot has two kinds of parts:

- **Sensors** measure something: the distance, a line, the brightness or the loudness.
- **Actuators** do something: motors move, LEDs light up, the speaker beeps.

Your program reads the sensors and controls the actuators. You already know this as input, processing and output.

::: quiz
? Match each part to its job.
= Ultrasonic sensor -> measures the distance
= Motors -> move the wheels
= CyberPi -> runs the program
= Line sensor -> detects a dark line
? Which parts are actuators?
- [x] Motors
- [ ] Ultrasonic sensor
- [x] LEDs
- [ ] Line sensor
> Actuators do something, sensors measure something.
:::

::: angeberwissen
Bats do exactly what the ultrasonic sensor does: they call so high that we cannot hear it and listen for the echo. Sound travels about 343 metres per second. If a wall is one metre in front of the mBot2, the echo is back after just under 6 thousandths of a second.
:::

## Commands for the mBot2

In VisuBot the [Elements](#zeige-elemente) have their own group **VisuBot**. Each box in it is a command for the robot:

| Element | Text in the box | What happens |
|---|---|---|
| move forward | `mbot.forward()` | 10 cm forward |
| move back | `mbot.backward()` | 10 cm back |
| turn right | `mbot.turnRight()` | turn 90° to the right |
| turn left | `mbot.turnLeft()` | turn 90° to the left |
| LEDs on | `mbot.setLed(255, 0, 0)` | the LEDs light up red |

You may also put a number in the brackets: `mbot.forward(30)` drives 30 cm, `mbot.turnRight(45)` turns only 45°.

> The commands are real Java. `mbot` is the robot, and after the dot comes what it should do.

## First drive

After building, start the [simulation](#zeige-simulation). The VisuBot world with the mBot2 appears on the right. The grid on the floor has squares of 10 cm, exactly one **move forward**.

::: übung vb-gerade
titel: Straight ahead
auftrag: Drag **move forward** into the structure chart five times. Then start the simulation and watch the mBot2 drive 50 cm straight ahead.
fahrt: 5 x (forward)
tipp: You find the VisuBot group below the normal elements.
tipp: Five boxes `mbot.forward()` one below the other. Each drives 10 cm.
lösung: vb-gerade-loesung.visustruct
:::

::: checkliste
- I know the parts of the mBot2. → Hello mBot2
- I know what sensors and actuators are. → Sensors and actuators
- I can control the mBot2 with elements from the VisuBot group. → Commands for the mBot2
- I can let the mBot2 drive in the simulator. → First drive
:::
