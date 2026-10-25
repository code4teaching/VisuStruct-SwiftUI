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

### Licht und Ton

```
mbot.setLed(255, 0, 0)      LEDs rot (Rot, Grün, Blau je 0 bis 255)
mbot.ledOff()               LEDs aus
mbot.playTone(440, 300)     Ton mit 440 Hz, 300 ms lang
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

### Echter mBot2

Mit **🔌 mBot2** neben „Simulation starten“ verbindest du den echten Roboter per USB-Kabel (nur in Chrome oder Edge). Dann fährt er jeden Schritt der Simulation mit, und die Sensoren liefern echte Werte. Ein zweiter Klick trennt ihn wieder sauber.
