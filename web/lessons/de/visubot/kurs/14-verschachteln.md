---
titel: mBot2 mit verschachtelten Schleifen
---

## Ein Kleeblatt aus Quadraten

In Lektion 13 hat der mBot2 ein Quadrat mit einer For-Schleife gefahren. Fährt er danach eine Vierteldrehung und wieder ein Quadrat, und das viermal, entsteht ein Kleeblatt aus vier Quadraten. Das Quadrat steckt dann in einer zweiten Schleife.

::: übung vb-k-kleeblatt
titel: Kleeblatt
auftrag: Lass den mBot2 vier Quadrate mit 30 cm Seitenlänge fahren. Nach jedem Quadrat dreht er sich einmal nach rechts. Benutze zwei ineinander geschachtelte For-Schleifen.
fahrt: 4 x (4 x (forward 30, turnRight), turnRight)
schleifentiefe: 2
tipp: Die innere Schleife fährt ein Quadrat: viermal `mbot.forward(30)` und `mbot.turnRight()`.
tipp: Die äußere Schleife läuft auch viermal. Darin stehen die innere Schleife und danach `mbot.turnRight()`. Gib den Schleifen verschiedene Zähler, zum Beispiel `i` und `j`.
lösung: vb-k-kleeblatt-loesung.visustruct
:::
