---
titel: Das Labyrinth
nach: 4
kurs: 11
stufe: 2
---

Der mBot2 steht in einem Labyrinth. Das Ziel ist ein schwarzes Feld mit grüner Fahne. Die Gänge sind 30 cm breit.

Eine einfache Regel bringt ihn hindurch: **Ist vorn frei, fahr vor. Sonst dreh dich nach rechts. Ist dort auch eine Wand, dreh dich ganz um.**

Woran merkt der mBot2, dass er im Ziel ist? Der Liniensensor unten sieht das schwarze Feld: `mbot.getLine()` ist dann nicht mehr `0`.

::: übung vb-labyrinth
titel: Das Labyrinth
auftrag: Programmiere den mBot2 so, dass er in beiden Labyrinthen ins Ziel findet, ohne anzustoßen.
welt: labyrinth-1, labyrinth-2
braucht: whileSchleife, verzweigung
tipp: Außen eine While-Schleife mit der Bedingung `mbot.getLine() == 0`. Sie läuft, bis der mBot2 auf dem Ziel steht.
tipp: In der Schleife eine Verzweigung `mbot.getDistance() > 15`: Ja → `mbot.forward()`. Nein → `mbot.turnRight()`, danach noch eine Verzweigung `mbot.getDistance() < 15` mit `mbot.turnRight(180)`.
lösung: vb-labyrinth-loesung.visustruct
:::

::: angeberwissen
Mit der Regel „Hand immer an der Wand“ findet man aus jedem Labyrinth, dessen Wände alle zusammenhängen. Schon die Griechen erzählten von Theseus, der sich im Labyrinth des Minotaurus mit einem Wollfaden half.
:::
