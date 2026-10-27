## 🤖 mBot2-Befehle

Ein Befehl sagt dem mBot2, was er **tun** soll. Jeder Befehl beginnt mit `mbot.` und endet mit Klammern. In die Klammern schreibst du oft eine Zahl.

### Fahren und Drehen

Der mBot2 fährt geradeaus oder dreht sich auf der Stelle.

```
mbot.forward()          fährt 10 cm nach vorn
mbot.forward(30)        fährt 30 cm nach vorn
mbot.backward(20)       fährt 20 cm zurück
mbot.turnRight()        dreht sich nach rechts (90°)
mbot.turnLeft()         dreht sich nach links (90°)
mbot.turnLeft(45)       dreht sich nur ein bisschen nach links (45°)
mbot.turnRight(180)     dreht sich ganz um
```

> Ohne Zahl fährt er 10 cm oder dreht sich 90°. 90° ist ein rechter Winkel, wie die Ecke von einem Blatt Papier.

> Für ein Vieleck dreht er sich insgesamt einmal ganz herum: Dreieck 3 × 120°, Quadrat 4 × 90°, Sechseck 6 × 60°.

### Räder einzeln

Hier gibst du jedem Rad selbst Gas. Die Zahlen sind Prozent: 100 ist volles Gas, 0 ist Stillstand, eine Zahl mit Minus fährt rückwärts. Der mBot2 fährt so lange weiter, bis ein anderer Fahrbefehl kommt.

```
mbot.drive(40, 40)      beide Räder gleich: geradeaus
mbot.drive(10, 40)      links langsamer: Kurve nach links
mbot.drive(40, -40)     ein Rad vor, eins zurück: dreht sich
mbot.stop()             hält an
```

### Licht, Ton und Bildschirm

Der mBot2 kann leuchten, piepen und Text zeigen.

```
mbot.setLed(255, 0, 0)          alle LEDs leuchten rot
mbot.ledOff()                   alle LEDs aus
mbot.led(0).setColor("grün")    nur LED 0 leuchtet grün
mbot.led(0).setColor("aus")     nur LED 0 aus
mbot.playTone(440, 300)         spielt einen Ton
mbot.showText("Hallo")          zeigt Hallo auf dem Bildschirm
```

- **LEDs:** Es gibt fünf LEDs mit den Nummern 0 bis 4. Bei `setLed` mischst du Rot, Grün und Blau, jedes von 0 (aus) bis 255 (ganz hell).
- **Ton:** Die erste Zahl ist die Tonhöhe. Je größer, desto höher. Die zweite Zahl ist die Länge in Millisekunden (1000 Millisekunden sind 1 Sekunde).
- **Bildschirm:** Mit `+` hängst du Text und Zahlen aneinander: `mbot.showText("Abstand: " + mbot.getDistance())`.

### Gefühle

Der mBot2 zeigt ein Gefühl mit Licht, Ton und Wackeln. Das siehst du nur am echten mBot2.

```
mbot.emotion("smile")   lacht
mbot.emotion("sad")     ist traurig
mbot.emotion("wow")     staunt
```

Weitere Gefühle: hello, yeah, proud, yummy, naughty, uh_oh, hurt, angry, startle, shiver, dizzy, sleepy, zzz, wake_up, blink, yes, no, look_up, look_down, look_left, look_right, look_around

### Warten und Stoppuhr

```
mbot.pause(1000)        wartet 1 Sekunde
mbot.resetTimer()       stellt die Stoppuhr auf 0
```

Die Zeit der Stoppuhr liest du mit dem Sensor `mbot.getTimer()` (unten bei **Stoppuhr und Akku**).

## 📡 mBot2-Sensoren

Ein Sensor **misst** etwas und gibt dir einen Wert zurück. Den Wert benutzt du in einer Bedingung, zum Beispiel in einer Schleife oder Verzweigung. Manche Sensoren liefern eine **Zahl**, manche **wahr oder falsch**, einer einen **Text**.

### Abstand

Der Ultraschallsensor vorn misst, wie weit die nächste Wand weg ist, in Zentimetern.

```
mbot.getDistance()              Abstand in cm, z. B. 25
mbot.getDistance() > 15         ist vorn mehr als 15 cm frei?
int abstand = mbot.getDistance()   Abstand in einer Variablen merken
```

### Linie

Unter dem mBot2 sitzen vier Fühler. Sie sehen, ob der Boden schwarz ist.

```
mbot.getLine()          Zahl: 0 heißt, kein Fühler sieht Schwarz
mbot.getLine() == 0     kein Schwarz, weiterfahren
mbot.getLine() != 0     ein Fühler sieht Schwarz
mbot.isLineLeft()       sieht der linke mittlere Fühler Schwarz?
mbot.isLineRight()      sieht der rechte mittlere Fühler Schwarz?
```

### Farben

Derselbe Sensor unten erkennt auch Farben. `mbot.getColor()` gibt dir den Namen der Farbe als Text: `"rot"`, `"grün"`, `"blau"`, `"gelb"`, `"weiß"` oder `"schwarz"`.

```
mbot.getColor().equals("rot")     steht er auf Rot?
!mbot.getColor().equals("rot")    steht er nicht auf Rot?
```

> Texte vergleichst du mit `.equals(…)`, nicht mit `==`. Das `!` davor heißt **nicht**.

### Tasten und Joystick

Auf dem CyberPi gibt es die Tasten A und B und einen kleinen Joystick. Jeder Sensor sagt **wahr**, solange gedrückt wird.

```
mbot.isButtonA()        wird Taste A gedrückt?
mbot.isButtonB()        wird Taste B gedrückt?
mbot.isJoystickUp()     Joystick nach oben gedrückt?
mbot.isJoystickDown()   Joystick nach unten gedrückt?
mbot.isJoystickLeft()   Joystick nach links gedrückt?
mbot.isJoystickRight()  Joystick nach rechts gedrückt?
```

### Licht und Lautstärke

```
mbot.getBrightness()    wie hell? 0 ist dunkel, 100 ist hell
mbot.getLoudness()      wie laut? 0 ist still, 100 ist laut
```

### Neigung und Schütteln

```
mbot.getPitch()         nach vorn oder hinten gekippt? (in Grad)
mbot.getRoll()          zur Seite gekippt? (in Grad)
mbot.isShaken()         wird er geschüttelt?
```

> Liegt der mBot2 flach, sind beide Neigungen 0. In der Simulation stellst du diese Werte unter **🎛 Sensoren ausprobieren** ein.

### Stoppuhr und Akku

```
mbot.getTimer()         Sekunden seit dem Start oder seit resetTimer()
mbot.getBattery()       wie voll ist der Akku? (in Prozent)
```

### Echter mBot2

Mit **🔌 mBot2** neben „Simulation starten“ verbindest du den echten Roboter mit dem USB-Kabel. Das geht nur in Chrome oder Edge. Dann fährt er jeden Schritt der Simulation mit, und die Sensoren messen echte Werte. Ein zweiter Klick trennt ihn wieder.
