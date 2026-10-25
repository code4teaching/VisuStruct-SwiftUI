---
titel: Rückwärts einparken
nach: 14
kurs: 11
stufe: 2
---

Rechts von der Straße parken Autos (die Klötze). Irgendwo ist eine Lücke, und genau davor klebt eine blaue Markierung auf der Straße. Der mBot2 sucht die Lücke und parkt rückwärts ein, wie ein Auto.

Hinten hat er keinen Sensor. Er schaut deshalb nach vorn auf die Wand gegenüber: Je weiter er rückwärts in die Lücke fährt, desto größer wird der Abstand dorthin.

::: übung vb-einparken
titel: Rückwärts einparken
auftrag: Der mBot2 fährt in 10-cm-Schritten vor, bis er auf Blau steht. Dann dreht er sich nach links, sodass sein Heck zur Lücke zeigt. Er fährt rückwärts, solange der Abstand zur Wand vor ihm unter 45 cm ist. Zum Schluss leuchten die LEDs grün und er zeigt **Geparkt!**. Es gibt zwei Straßen mit verschiedenen Lücken.
welt: parken-1 -> ledOn, screen "Geparkt!"
welt: parken-2 -> ledOn, screen "Geparkt!"
braucht: whileSchleife
tipp: Zwei While-Schleifen hintereinander: erst `!mbot.isBlue()` mit `mbot.forward()` darin, dann `mbot.getDistance() < 45` mit `mbot.backward()` darin. Dazwischen steht `mbot.turnLeft()`.
tipp: Am Ende: `mbot.setLed(0, 255, 0)` und `mbot.showText("Geparkt!")`.
lösung: vb-einparken-loesung.visustruct
:::
