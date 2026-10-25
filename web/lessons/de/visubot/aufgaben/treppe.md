---
titel: Die Treppe
nach: 2
kurs: 13
stufe: 1
---

Der mBot2 steigt eine Treppe hinauf, von oben gesehen: Jede Stufe ist 20 cm tief und 20 cm breit.

::: übung vb-treppe
titel: Die Treppe
auftrag: Lass den mBot2 drei Stufen fahren. Eine Stufe: 20 cm vor, nach links drehen, 20 cm vor, nach rechts drehen. Benutze eine Schleife.
fahrt: 3 x (forward 20, turnLeft, forward 20, turnRight)
braucht: forSchleife
tipp: Schreib zuerst eine Stufe auf. Dann packst du sie in eine For-Schleife, die dreimal läuft.
tipp: In der Schleife: `mbot.forward(20)`, `mbot.turnLeft()`, `mbot.forward(20)`, `mbot.turnRight()`.
lösung: vb-treppe-loesung.visustruct
:::
