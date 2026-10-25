---
titel: mBot2 in the branch
---

## Wall close? Then beep

The mBot2 decides by itself what to do: if the wall is closer than 20 cm, it beeps. Otherwise it drives forward 20 cm. The condition compares the distance `mbot.getDistance()` with a number, just like in any other branch.

> Without a real mBot2, the check tests your program with different distances.

::: übung vb-k-wand-piep
titel: Wall close?
auftrag: If the distance is less than 20 cm, the mBot2 plays a tone (`mbot.playTone(880, 300)`). Otherwise it drives forward 20 cm.
messwerte: getDistance=10 -> none, tone
messwerte: getDistance=50 -> forward 20, noTone
braucht: verzweigung
tipp: The branch gets the condition `mbot.getDistance() < 20`.
tipp: The yes branch contains `mbot.playTone(880, 300)`, the no branch `mbot.forward(20)`.
lösung: vb-k-wand-piep-loesung.visustruct
:::
