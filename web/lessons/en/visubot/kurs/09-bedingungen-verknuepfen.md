---
titel: mBot2 with combined conditions
---

## Spotting danger

The mBot2 has a colour sensor under its nose: `mbot.isRed()` is true when it stands on a red field. Red should mean: stop!

Now there are **two** reasons to stop: the wall is close **or** it stands on red. You combine them with `||`. Only if neither is true does it drive on.

::: übung vb-k-vorsicht
titel: Careful, stop!
auftrag: If the wall is closer than 20 cm or the mBot2 stands on red, its LEDs light up red (`mbot.setLed(255, 0, 0)`). Otherwise it drives forward 20 cm.
messwerte: getDistance=50, isRed=false -> forward 20, ledOff
messwerte: getDistance=10, isRed=false -> none, ledOn
messwerte: getDistance=50, isRed=true -> none, ledOn
braucht: verzweigung
tipp: The condition is `mbot.getDistance() < 20 || mbot.isRed()`.
tipp: The yes branch contains `mbot.setLed(255, 0, 0)`, the no branch `mbot.forward(20)`.
lösung: vb-k-vorsicht-loesung.visustruct
:::

> What would the condition for **driving on** look like? The wall is far away **and** it is not on red: `mbot.getDistance() >= 20 && !mbot.isRed()`.
