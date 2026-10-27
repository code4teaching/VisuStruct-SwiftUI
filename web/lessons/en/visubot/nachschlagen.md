## 🤖 mBot2 commands

A command tells the mBot2 what to **do**. Every command starts with `mbot.` and ends with brackets. Often you write a number in the brackets.

### Driving and turning

The mBot2 drives straight or turns on the spot.

```
mbot.forward()          drives 10 cm forward
mbot.forward(30)        drives 30 cm forward
mbot.backward(20)       drives 20 cm back
mbot.turnRight()        turns to the right (90°)
mbot.turnLeft()         turns to the left (90°)
mbot.turnLeft(45)       turns just a little to the left (45°)
mbot.turnRight(180)     turns all the way round
```

> Without a number it drives 10 cm or turns 90°. 90° is a right angle, like the corner of a sheet of paper.

> For a polygon it turns all the way round once in total: triangle 3 × 120°, square 4 × 90°, hexagon 6 × 60°.

### Wheels separately

Here you give each wheel gas yourself. The numbers are percent: 100 is full gas, 0 is standing still, a number with a minus drives backwards. The mBot2 keeps going until another driving command comes.

```
mbot.drive(40, 40)      both wheels the same: straight ahead
mbot.drive(10, 40)      left slower: curve to the left
mbot.drive(40, -40)     one wheel forward, one back: it turns
mbot.stop()             stops
```

### Light, sound and screen

The mBot2 can light up, beep and show text.

```
mbot.setLed(255, 0, 0)          all LEDs light up red
mbot.ledOff()                   all LEDs off
mbot.led(0).setColor("green")   only LED 0 lights up green
mbot.led(0).setColor("off")     only LED 0 off
mbot.playTone(440, 300)         plays a tone
mbot.showText("Hello")          shows Hello on the screen
```

- **LEDs:** There are five LEDs with the numbers 0 to 4. With `setLed` you mix red, green and blue, each from 0 (off) to 255 (very bright).
- **Tone:** The first number is the pitch. The bigger, the higher. The second number is the length in milliseconds (1000 milliseconds are 1 second).
- **Screen:** With `+` you join text and numbers: `mbot.showText("Distance: " + mbot.getDistance())`.

### Emotions

The mBot2 shows a feeling with light, sound and wiggling. You only see it on the real mBot2.

```
mbot.emotion("smile")   laughs
mbot.emotion("sad")     is sad
mbot.emotion("wow")     is amazed
```

More feelings: hello, yeah, proud, yummy, naughty, uh_oh, hurt, angry, startle, shiver, dizzy, sleepy, zzz, wake_up, blink, yes, no, look_up, look_down, look_left, look_right, look_around

### Waiting and stopwatch

```
mbot.pause(1000)        waits 1 second
mbot.resetTimer()       sets the stopwatch to 0
```

You read the stopwatch time with the sensor `mbot.getTimer()` (below under **Stopwatch and battery**).

## 📡 mBot2 sensors

A sensor **measures** something and gives you a value back. You use the value in a condition, for example in a loop or a branch. Some sensors give a **number**, some **true or false**, one gives a **text**.

### Distance

The ultrasonic sensor at the front measures how far away the next wall is, in centimetres.

```
mbot.getDistance()              distance in cm, e.g. 25
mbot.getDistance() > 15         is there more than 15 cm free ahead?
int distance = mbot.getDistance()   remember the distance in a variable
```

### Line

Under the mBot2 there are four probes. They see whether the floor is black.

```
mbot.getLine()          number: 0 means no probe sees black
mbot.getLine() == 0     no black, keep driving
mbot.getLine() != 0     a probe sees black
mbot.isLineLeft()       does the left middle probe see black?
mbot.isLineRight()      does the right middle probe see black?
```

### Colours

The same sensor underneath also recognises colours. `mbot.getColor()` gives you the name of the colour as text: `"red"`, `"green"`, `"blue"`, `"yellow"`, `"white"` or `"black"`.

```
mbot.getColor().equals("red")     is it standing on red?
!mbot.getColor().equals("red")    is it not standing on red?
```

> You compare texts with `.equals(…)`, not with `==`. The `!` in front means **not**.

### Buttons and joystick

On the CyberPi there are the buttons A and B and a small joystick. Each sensor says **true** while it is being pressed.

```
mbot.isButtonA()        is button A pressed?
mbot.isButtonB()        is button B pressed?
mbot.isJoystickUp()     joystick pushed up?
mbot.isJoystickDown()   joystick pushed down?
mbot.isJoystickLeft()   joystick pushed left?
mbot.isJoystickRight()  joystick pushed right?
```

### Light and loudness

```
mbot.getBrightness()    how bright? 0 is dark, 100 is bright
mbot.getLoudness()      how loud? 0 is silent, 100 is loud
```

### Tilt and shaking

```
mbot.getPitch()         tipped forward or back? (in degrees)
mbot.getRoll()          tipped to the side? (in degrees)
mbot.isShaken()         is it being shaken?
```

> When the mBot2 lies flat, both tilts are 0. In the simulation you set these values under **🎛 Try the sensors**.

### Stopwatch and battery

```
mbot.getTimer()         seconds since the start or since resetTimer()
mbot.getBattery()       how full is the battery? (in percent)
```

### Real mBot2

With **🔌 mBot2** next to "Start simulation" you connect the real robot with the USB cable. This only works in Chrome or Edge. Then it drives every step of the simulation along, and the sensors measure real values. A second click disconnects it again.
