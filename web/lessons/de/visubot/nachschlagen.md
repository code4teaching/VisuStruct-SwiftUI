## 🤖 mBot2-Befehle

### Fahren

Fährt geradeaus. Ohne Zahl ist es ein Schritt von 10 cm.

```
mbot.forward()          10 cm vorwärts
mbot.forward(30)        30 cm vorwärts
mbot.backward(20)       20 cm rückwärts
```

### Drehen

Dreht auf der Stelle. Ohne Zahl sind es 90°.

```
mbot.turnRight()        90° nach rechts
mbot.turnLeft(45)       45° nach links
mbot.turnRight(180)     ganz umdrehen
```

> Bei einem Vieleck dreht sich der mBot2 insgesamt einmal ganz herum: Dreieck 3 × 120°, Quadrat 4 × 90°, Sechseck 6 × 60°.

### Licht, Ton und Bildschirm

```
mbot.setLed(255, 0, 0)      LEDs rot (Rot, Grün, Blau je 0 bis 255)
mbot.ledOff()               LEDs aus
mbot.playTone(440, 300)     Ton mit 440 Hz, 300 ms lang
mbot.showText("Hallo")      Text auf dem Bildschirm
mbot.showText("Abstand: " + mbot.getDistance())
```

### Warten

```
mbot.pause(100)         100 Millisekunden warten
```

## 📡 mBot2-Sensoren

### Abstand

`mbot.getDistance()` misst mit dem Ultraschallsensor den Abstand bis zur nächsten Wand in Zentimetern. Du benutzt ihn wie eine Zahl, meist in einer Bedingung:

```
mbot.getDistance() > 15         vorn ist mehr als 15 cm frei
abstand = mbot.getDistance()    Wert in einer Variable merken
```

### Linie

`mbot.getLine()` sagt, ob der Liniensensor unten etwas Schwarzes sieht. `0` heißt: nichts Schwarzes.

```
mbot.getLine() == 0     kein Schwarz, weiterfahren
mbot.getLine() != 0     auf der Linie oder im Ziel
```

### Farben

Der Quad-RGB-Sensor unten vorn erkennt farbige Felder. Die Antwort ist gleich wahr oder falsch.

```
mbot.isRed()            rot?
mbot.isGreen()          grün?
mbot.isBlue()           blau?
mbot.isYellow()         gelb?
!mbot.isRed()           nicht rot
```

### Tasten und Joystick

```
mbot.isButtonA()        Taste A gedrückt?
mbot.isButtonB()        Taste B gedrückt?
mbot.isJoystickUp()     Joystick oben? (auch Down, Left, Right)
```

### Licht und Lautstärke

```
mbot.getBrightness()    Helligkeit 0 (dunkel) bis 100 (hell)
mbot.getLoudness()      Lautstärke 0 (still) bis 100 (laut)
```

### Neigung und Schütteln

```
mbot.getPitch()         Neigung vorn/hinten in Grad
mbot.getRoll()          Neigung zur Seite in Grad
mbot.isShaken()         wird geschüttelt?
```

> Ohne echten mBot2 stellst du diese Werte in der Simulation unter **🎛 Sensoren ausprobieren** ein.

### Echter mBot2

Mit **🔌 mBot2** neben „Simulation starten“ verbindest du den echten Roboter per USB-Kabel (nur in Chrome oder Edge). Dann fährt er jeden Schritt der Simulation mit, und die Sensoren liefern echte Werte. Ein zweiter Klick trennt ihn wieder sauber.
