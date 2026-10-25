---
titel: mBot2 mit Arrays
---

## Eine Melodie als Array

Der mBot2 hat einen Lautsprecher: `mbot.playTone(262, 300)` spielt den Ton c (262 Hertz) 300 Millisekunden lang. Eine Melodie ist eine Reihe von Tönen. Die Tonhöhen passen gut in ein Array:

| Ton | c | d | e | f | g |
|---|---|---|---|---|---|
| Hertz | 262 | 294 | 330 | 349 | 392 |

::: übung vb-k-melodie
titel: Melodie
auftrag: Lege ein Array `toene` mit den fünf Tonhöhen an. Eine For-Schleife spielt sie nacheinander, jeden 300 Millisekunden lang.
befehle: playTone 262 300, playTone 294 300, playTone 330 300, playTone 349 300, playTone 392 300
braucht: forSchleife
tipp: `int[] toene = {262, 294, 330, 349, 392}` legt das Array an.
tipp: Die Schleife läuft von `i = 0` bis `i < toene.length`. Darin steht `mbot.playTone(toene[i], 300)`.
lösung: vb-k-melodie-loesung.visustruct
:::

> Wenn du die Melodie ändern willst, änderst du nur das Array. Die Schleife bleibt gleich.
