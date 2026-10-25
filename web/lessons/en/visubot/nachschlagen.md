## 🤖 mBot2 commands

### Driving

Drives straight. Without a number it is one step of 10 cm.

```
mbot.forward()          10 cm forward
mbot.forward(30)        30 cm forward
mbot.backward(20)       20 cm backward
```

### Turning

Turns on the spot. Without a number it is 90°.

```
mbot.turnRight()        90° to the right
mbot.turnLeft(45)       45° to the left
mbot.turnRight(180)     turn all the way around
```

> For a polygon the mBot2 turns all the way around once in total: triangle 3 × 120°, square 4 × 90°, hexagon 6 × 60°.

### Light, sound and screen

```
mbot.setLed(255, 0, 0)      LEDs red (red, green, blue each 0 to 255)
mbot.ledOff()               LEDs off
mbot.playTone(440, 300)     tone of 440 Hz, 300 ms long
mbot.showText("Hello")      text on the screen
mbot.showText("Distance: " + mbot.getDistance())
```

### Waiting

```
mbot.pause(100)         wait 100 milliseconds
```

## 📡 mBot2 sensors

### Distance

`mbot.getDistance()` measures the distance to the next wall in centimetres with the ultrasonic sensor. You use it like a number, usually in a condition:

```
mbot.getDistance() > 15         more than 15 cm free ahead
distance = mbot.getDistance()   remember the value in a variable
```

### Line

`mbot.getLine()` tells whether the line sensor underneath sees something black. `0` means: nothing black.

```
mbot.getLine() == 0     no black, keep driving
mbot.getLine() != 0     on the line or at the goal
```

### Colours

The quad RGB sensor at the front underneath recognises coloured fields. The answer is straight away true or false.

```
mbot.isRed()            red?
mbot.isGreen()          green?
mbot.isBlue()           blue?
mbot.isYellow()         yellow?
!mbot.isRed()           not red
```

### Buttons and joystick

```
mbot.isButtonA()        button A pressed?
mbot.isButtonB()        button B pressed?
mbot.isJoystickUp()     joystick up? (also Down, Left, Right)
```

### Light and loudness

```
mbot.getBrightness()    brightness 0 (dark) to 100 (bright)
mbot.getLoudness()      loudness 0 (silent) to 100 (loud)
```

### Tilt and shaking

```
mbot.getPitch()         tilt forward/back in degrees
mbot.getRoll()          tilt sideways in degrees
mbot.isShaken()         being shaken?
```

> Without a real mBot2 you set these values in the simulation under **🎛 Try the sensors**.

### Real mBot2

With **🔌 mBot2** next to "Start simulation" you connect the real robot with a USB cable (only in Chrome or Edge). It then drives every step of the simulation along, and the sensors deliver real values. A second click disconnects it cleanly again.
