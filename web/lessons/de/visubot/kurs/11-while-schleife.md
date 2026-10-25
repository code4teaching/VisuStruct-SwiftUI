---
titel: mBot2 in der While-Schleife
---

## Bis zur Wand

Der mBot2 soll bis zur Wand fahren. Wie weit das ist, weiß er vorher nicht. Also fährt er, **solange** die Wand noch weit genug weg ist: eine While-Schleife mit dem Abstand `mbot.getDistance()` in der Bedingung.

::: übung vb-k-bis-wand
titel: Bis zur Wand
auftrag: Der mBot2 fährt in 10-cm-Schritten vor, solange die Wand mehr als 15 cm entfernt ist. Dein Programm muss in allen drei Welten klappen. Über der Simulation wählst du, welche Welt du siehst.
welt: wand-kurz, wand-mittel, wand-lang
braucht: whileSchleife
tipp: Eine While-Schleife mit der Bedingung `mbot.getDistance() > 15`.
tipp: In der Schleife steht nur `mbot.forward()`. Ohne Zahl fährt er 10 cm.
lösung: vb-bis-wand-loesung.visustruct
:::

> Was passiert, wenn du die Schleife vergisst und nur einmal `mbot.forward(50)` schreibst? In der kurzen Welt stößt er an, in der langen kommt er nicht an.
