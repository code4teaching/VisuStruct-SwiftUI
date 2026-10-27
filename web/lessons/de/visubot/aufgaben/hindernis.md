---
titel: Hindernis ausweichen
nach: 14
stufe: 2
---

Auf dem Weg zum roten Feld stehen Klötze im Weg. Der mBot2 fährt in 10-cm-Schritten vor. Taucht ein Klotz auf (näher als 20 cm), warnt er mit Licht und Ton und fährt außen herum: nach rechts drehen, 30 cm vor, nach links drehen. Dann geht es weiter geradeaus.

::: übung vb-hindernis
titel: Hindernis ausweichen
auftrag: Der mBot2 fährt, solange er nicht auf Rot steht. Ist ein Klotz näher als 20 cm, leuchten die LEDs orange (`mbot.setLed(255, 128, 0)`), er piept und weicht aus. Danach gehen die LEDs aus. Sonst fährt er 10 cm vor. Es gibt zwei Welten.
welt: hindernis-1 -> tone
welt: hindernis-2 -> tone
braucht: whileSchleife, verzweigung
tipp: Außen eine While-Schleife mit `!mbot.getColor().equals("rot")`, darin eine Verzweigung mit `mbot.getDistance() < 20`.
tipp: Im Ja-Zweig: `mbot.setLed(255, 128, 0)`, `mbot.playTone(880, 200)`, `mbot.turnRight()`, `mbot.forward(30)`, `mbot.turnLeft()`, `mbot.ledOff()`. Im Nein-Zweig: `mbot.forward()`.
lösung: vb-hindernis-loesung.visustruct
:::
