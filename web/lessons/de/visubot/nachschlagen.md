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

### Räder einzeln

Gibt Gas, links und rechts in Prozent (−100 bis 100). Der mBot2 fährt weiter, bis ein anderer Fahrbefehl oder `mbot.stop()` kommt.

```
mbot.drive(40, 40)      geradeaus
mbot.drive(10, 40)      Linkskurve
mbot.drive(40, -40)     auf der Stelle rechts drehen
mbot.stop()             anhalten
```

### Licht, Ton und Bildschirm

```
mbot.setLed(255, 0, 0)      LEDs rot (Rot, Grün, Blau je 0 bis 255)
mbot.ledOff()               LEDs aus
mbot.led(0).setColor("grün")  LED 0 grün (LEDs 0 bis 4; "aus" schaltet aus)
mbot.playTone(440, 300)     Ton mit 440 Hz, 300 ms lang
mbot.showText("Hallo")      Text auf dem Bildschirm
mbot.showText("Abstand: " + mbot.getDistance())
```

### Gefühle

Eine kleine Vorführung mit LEDs, Ton und Wackeln (nur am echten mBot2 zu sehen):

```
mbot.emotion("smile")   lacht
mbot.emotion("sad")     ist traurig
```

Alle Gefühle: smile, hello, yeah, proud, wow, yummy, naughty, uh_oh, hurt, sad, angry, startle, shiver, dizzy, sleepy, zzz, wake_up, blink, yes, no, look_up, look_down, look_left, look_right, look_around

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
mbot.isLineLeft()       linker mittlerer Fühler sieht Schwarz
mbot.isLineRight()      rechter mittlerer Fühler sieht Schwarz
```

### Farben

Der Quad-RGB-Sensor unten vorn erkennt farbige Felder. `mbot.getColor()` liefert den Farbnamen als Text. Texte vergleichst du mit `.equals(…)`, nicht mit `==`.

```
mbot.getColor()                       "rot", "grün", "blau", "gelb",
                                      "weiß" oder "schwarz"
mbot.getColor().equals("rot")         rot?
!mbot.getColor().equals("rot")        nicht rot
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

### Stoppuhr und Akku

```
mbot.resetTimer()       Stoppuhr auf 0
mbot.getTimer()         Sekunden seit dem Start oder resetTimer()
mbot.getBattery()       Akku in Prozent
```

### Echter mBot2

Mit **🔌 mBot2** neben „Simulation starten“ verbindest du den echten Roboter per USB-Kabel (nur in Chrome oder Edge). Dann fährt er jeden Schritt der Simulation mit, und die Sensoren liefern echte Werte. Ein zweiter Klick trennt ihn wieder sauber.
