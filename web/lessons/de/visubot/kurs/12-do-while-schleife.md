---
titel: mBot2 in der Do-While-Schleife
---

## Erst fahren, dann schauen

Der mBot2 steht am Start auf hellem Boden und soll bis zu einem roten Feld fahren. `mbot.isRed()` ist wahr, wenn sein Farbsensor Rot sieht.

Weil er am Anfang sicher nicht auf Rot steht, kann er **erst** fahren und **dann** prüfen: eine Do-While-Schleife. Sie wiederholt, solange er **nicht** auf Rot steht.

::: übung vb-k-bis-rot
titel: Bis Rot
auftrag: Baue eine Do-While-Schleife: Der mBot2 fährt 10 cm vor, solange er nicht auf Rot steht.
welt: farbe-1 -> forward 20
welt: farbe-2 -> forward 50
braucht: doUntilSchleife
tipp: In die Schleife kommt `mbot.forward()`. Die Bedingung steht unten.
tipp: Die Bedingung lautet `!mbot.isRed()`. Das `!` heißt „nicht“.
lösung: vb-k-bis-rot-loesung.visustruct
:::
