---
titel: The mBot2
bereich: VisuBot
kurz: Get to know the robot you are about to program.
---

## Hello mBot2

::: mbot2
focus:
spin: yes
:::

The **mBot2** is a small robot made by Makeblock. In this lesson you take a tour through all its parts:

- the [CyberPi]{part=cyberpi}, the small computer at the back on top
- the see-through [shield with battery]{part=shield} in the middle
- two [motors]{part=motors} with [wheels]{part=wheels}
- the [ultrasonic sensor]{part=ultrasonic} at the front, which looks like two eyes
- the [line sensor]{part=lineSensor} under the nose
- the turquoise [chassis]{part=chassis} that holds everything together

In VisuBot you program it with structure charts. You can try every program in the simulator first, even without a real robot.

> Move the mouse over a word underlined in yellow and the part lights up in the model. Tap the word and the camera flies there. You can rotate the model with the mouse or your finger and zoom with the mouse wheel.

## The CyberPi

::: mbot2
focus: cyberpi, screen, joystick, buttons, leds, lightSensor, microphone
view: back
:::

The [CyberPi]{part=cyberpi,screen,joystick,buttons,leds,lightSensor,microphone} is the brain of the mBot2: a **microcontroller**, a small computer without a keyboard. It runs your program. It lies crosswise at the back on top of the robot and can be taken off.

A lot is already built in:

- a colour [screen]{part=screen} that shows text and pictures
- a [joystick]{part=joystick} you can push in four directions
- two [buttons]{part=buttons}, one with a triangle and one with a square, and the Home button on the side next to the USB port
- five colourful [LEDs]{part=leds} as a light bar along the back
- a [light sensor]{part=lightSensor} and a [microphone]{part=microphone}

There is also a speaker and a motion sensor that you cannot see from outside. The motion sensor notices when the CyberPi is tilted or turned.

> The model was built from photos. Look at your own mBot2 and compare.

## Screen, LEDs and speaker

::: mbot2
focus: screen, leds
view: back
:::

With the [screen]{part=screen} and the five [LEDs]{part=leds} the mBot2 shows you what it is doing. Each LED can glow in almost any colour because it mixes red, green and blue. That is why they are called **RGB LEDs**.

Later you make the LEDs glow red with `mbot.setLed(255, 0, 0)`. The three numbers are red, green and blue, each from 0 to 255.

The [CyberPi]{part=cyberpi} also has a small **speaker**. With `mbot.playTone(440, 300)` it plays a tone: 440 vibrations per second (hertz), 300 milliseconds long.

## Measuring light and sound

::: mbot2
focus: lightSensor, microphone
view: top
:::

The [light sensor]{part=lightSensor} measures how bright it is. The [microphone]{part=microphone} measures how loud it is. For example, the mBot2 can start driving when you clap your hands.

## Buttons and joystick

::: mbot2
focus: joystick, buttons
view: top
:::

The [buttons]{part=buttons} A and B and the [joystick]{part=joystick} are sensors too: they notice when you press them. Your program can, for example, wait until you press A and only then start driving. With the joystick you steer the mBot2 like with a remote control.

## The motion sensor

::: mbot2
focus: cyberpi
spin: yes
:::

Inside the [CyberPi]{part=cyberpi} there is a sensor you cannot see: the **motion sensor** (a gyroscope with an accelerometer). It notices whether the mBot2 is tilted forward, backward or to the side, how far it has turned and whether someone shakes it. Your phone has such a sensor too: that is why the picture turns when you hold it sideways.

## Power: the shield with battery

::: mbot2
focus: shield, powerSwitch
view: side
:::

The big see-through case is the [mBot2 shield]{part=shield}. Through the lid you see the grey **battery** that powers the robot. At the back of the shield the cables of the motors (M1 and M2) and of the ultrasonic sensor are plugged in.

On the left side is the [power switch]{part=powerSwitch} labelled ON/OFF. Next to it are two sockets S1 and S2 for small servo motors. Switch the mBot2 off when you do not need it, so the battery lasts longer. You charge it with the USB cable on the CyberPi.

## Motors and wheels

::: mbot2
focus: motors, wheels
view: side
:::

Two [motors]{part=motors} drive the two [wheels]{part=wheels}, each its own. You see them from below: silver motors in light blue gearboxes.

- If both wheels turn forward at the same speed, the mBot2 drives **straight**.
- If one wheel turns forward and the other backward, it turns **on the spot**.

The motors are **encoder motors**: they count how far the wheel has turned. That is how the mBot2 knows when it has driven exactly 10 cm or turned exactly 90°.

## The ultrasonic sensor

::: mbot2
focus: ultrasonic
view: front
:::

At the front sits the black [ultrasonic sensor]{part=ultrasonic}. It looks like two eyes but is more like an ear: one circle sends out a very high sound we cannot hear. The other waits for the echo. The longer the echo takes, the farther away the wall is.

That is how the mBot2 measures distances in centimetres. The rings around the circles can also glow blue.

::: angeberwissen
Bats do exactly what the ultrasonic sensor does: they call so high that we cannot hear it and listen for the echo. Sound travels about 343 metres per second. If a wall is one metre in front of the mBot2, the echo is back after just under 6 thousandths of a second.
:::

## Under the robot

::: mbot2
focus: lineSensor, caster
view: bottom
:::

Now you look from below. Right at the front the black board of the [line sensor]{part=lineSensor} sticks out. It has **four** small probes side by side. Each one shines light on the floor and measures how much comes back. A black line reflects little, a bright floor a lot. That is how the mBot2 knows whether it is on a line.

The sensor is called a **quad RGB sensor** because it can do even more: it also recognises **colours**, for example a red or green field on the floor.

The [ball caster]{part=caster} behind it is the third leg. It has no motor and simply rolls along in any direction.

## The chassis

::: mbot2
focus: chassis
:::

The [chassis]{part=chassis} is the turquoise aluminium frame. It holds all the parts together. At the front it has two round "ears", at the back a big **M** for Makeblock. The many holes are there on purpose: you can screw more parts onto them.

## Sensors and actuators

A robot has two kinds of parts:

- **Sensors** measure something: the distance, a line, a colour, the brightness, the loudness, the tilt or whether a button is pressed.
- **Actuators** do something: the motors turn the wheels, the LEDs light up, the screen shows something, the speaker beeps.

The word comes from the Latin *agere*, “to act”: actuators act, sensors (from *sentire*, “to feel”) feel.

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

::: spiel frage
titel: Game: sensor or actuator?
intro: Does the part measure something, or does it do something? Ten rounds.
antworten: Sensor | Actuator

runde:
frage: The ultrasonic sensor measures how far away the wall is.
richtig: Sensor
> It measures something: the distance.

runde:
frage: The motors turn the wheels.
richtig: Actuator
> They do something: they move the mBot2.

runde:
frage: The LEDs glow red.
richtig: Actuator
> Glowing is doing something, not measuring.

runde:
frage: The line sensor recognises the black tape.
richtig: Sensor
> It measures how much light comes back from the floor.

runde:
frage: The speaker beeps.
richtig: Actuator
> It outputs a sound.

runde:
frage: The microphone hears you clap.
richtig: Sensor
> It measures the loudness.

runde:
frage: The screen shows “Hello VisuBot!”.
richtig: Actuator
> Showing something is an output.

runde:
frage: Button A notices that you press it.
richtig: Sensor
> Buttons are sensors: they report whether they are pressed.

runde:
frage: The motion sensor notices that the mBot2 is tilted.
richtig: Sensor
> It measures the tilt.

runde:
frage: The rings on the ultrasonic sensor glow blue.
richtig: Actuator
> Tricky! The part is a sensor, but the glowing rings are an output.
:::

## Find the parts

Your turn: click the part you are looking for in the model. If you are right, the next question appears.

::: mbot2quiz
- ultrasonic: What does the mBot2 use to measure how far away the wall is?
- screen: Where does text from your program appear?
- wheels: What moves the mBot2 forward?
- lineSensor: What detects a black line on the floor? (Hint: rotate the model.)
- powerSwitch: Where do you switch the mBot2 on and off?
- leds: What glows red with `mbot.setLed(255, 0, 0)`?
done: Great, you know your way around the mBot2!
:::

## Commands for the mBot2

In VisuBot the [Elements](#zeige-elemente) have their own group **mBot2 commands**. Each box in it is a command for the robot:

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
tipp: You find the group mBot2 commands below the normal elements.
tipp: Five boxes `mbot.forward()` one below the other. Each drives 10 cm.
lösung: vb-gerade-loesung.visustruct
:::

## Connecting the real mBot2

::: mbot2
focus: cyberpi, powerSwitch, joystick, buttons
view: side
:::

Everything you build in the simulator can also be driven by the real mBot2. This is how you connect it:

1. Plug a **USB-C cable** into your computer (for example a MacBook) and the other end into the USB-C port on the right of the [CyberPi]{part=cyberpi}, next to the Home button.
2. Push the [ON/OFF slide switch]{part=powerSwitch} on the left of the shield to ON. The CyberPi's screen lights up.
3. A menu appears on the screen with **restart** highlighted (on a German CyberPi: „neu starten“). Press the [joystick]{part=joystick} down like a button to confirm it.
4. After the restart it says “Press B to start”. Press **button B**, that is the [button with the triangle]{part=buttons}.
5. Open VisuStruct in **Chrome** or **Edge**. Safari and the iPad cannot talk to USB devices.
6. As soon as the CyberPi has started up, click **🔌 mBot2** at the top (or “Connect mBot2” in the gear menu).
7. Chrome shows a list of ports. Choose the entry **USB Serial** (for example “USB Serial (cu.usbserial-110)”). It is often at the very bottom, so you may have to scroll down. Then click **Connect**.
8. The CyberPi restarts briefly (⏳). Then “Hallo VisuBot!” appears on its screen and the button shows 🟢.

Now the mBot2 drives along with every step of the simulation. Put it on the floor and give it room!

> Finished? Click **🟢 mBot2** once more. It stops, shows “Bis bald!” and releases the port. Only then pull out the cable.

> Want to drive with no cable at all? You learn that in lesson 2 under **Driving without a cable**.

## Testing the mBot2

When the mBot2 is connected, **🔧 Test the mBot2** appears below the world. Open it:

- With the buttons you try each actuator once: LEDs, tone, text on the screen and the wheels. Lift the mBot2 up for this so it does not drive off the table.
- Below are all sensors with their values, and they update live. Hold your hand in front of the ultrasonic sensor, press button A, tilt it, clap your hands or put it on a red sheet of paper.

If a value does not change although you do something, something is wrong. Then tell your teacher before you start programming.

::: checkliste
- I know the parts of the mBot2. → Hello mBot2
- I know how the mBot2 measures distances. → The ultrasonic sensor
- I know how the mBot2 detects a line. → Under the robot
- I know what sensors and actuators are. → Sensors and actuators
- I can control the mBot2 with elements from the group mBot2 commands. → Commands for the mBot2
- I can let the mBot2 drive in the simulator. → First drive
- I can connect the real mBot2 with USB-C and disconnect it again. → Connecting the real mBot2
- I can check that all sensors and actuators work. → Testing the mBot2
:::
