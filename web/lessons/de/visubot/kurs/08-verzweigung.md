---
titel: mBot2 in der Verzweigung
---

## Wand nah? Dann piepen

Der mBot2 entscheidet selbst, was er tut: Ist die Wand näher als 20 cm, piept er. Sonst fährt er 20 cm vor. Die Bedingung vergleicht den Abstand `mbot.getDistance()` mit einer Zahl, genau wie bei jeder anderen Verzweigung.

> Ohne echten mBot2 testet die Prüfung dein Programm mit verschiedenen Abständen.

::: übung vb-k-wand-piep
titel: Wand nah?
auftrag: Ist der Abstand kleiner als 20 cm, spielt der mBot2 einen Ton (`mbot.playTone(880, 300)`). Sonst fährt er 20 cm vor.
messwerte: getDistance=10 -> none, tone
messwerte: getDistance=50 -> forward 20, noTone
braucht: verzweigung
tipp: In die Verzweigung kommt die Bedingung `mbot.getDistance() < 20`.
tipp: Im Ja-Zweig steht `mbot.playTone(880, 300)`, im Nein-Zweig `mbot.forward(20)`.
lösung: vb-k-wand-piep-loesung.visustruct
:::
