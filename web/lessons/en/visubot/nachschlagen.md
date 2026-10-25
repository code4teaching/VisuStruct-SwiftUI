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

### Light and sound

```
mbot.setLed(255, 0, 0)      LEDs red (red, green, blue each 0 to 255)
mbot.ledOff()               LEDs off
mbot.playTone(440, 300)     tone of 440 Hz, 300 ms long
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

### Real mBot2

With **🔌 mBot2** next to "Start simulation" you connect the real robot with a USB cable (only in Chrome or Edge). It then drives every step of the simulation along, and the sensors deliver real values. A second click disconnects it cleanly again.
