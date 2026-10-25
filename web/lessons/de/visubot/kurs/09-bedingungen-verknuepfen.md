---
titel: mBot2 mit verknüpften Bedingungen
---

## Gefahr erkennen

Der mBot2 hat einen Farbsensor unter der Nase: `mbot.getColor().equals("rot")` ist wahr, wenn er auf einem roten Feld steht. Rot soll heißen: Stopp!

Jetzt gibt es **zwei** Gründe anzuhalten: die Wand ist nah **oder** er steht auf Rot. Das verknüpfst du mit `||`. Nur wenn beides nicht zutrifft, fährt er weiter.

::: übung vb-k-vorsicht
titel: Vorsicht, Stopp!
auftrag: Ist die Wand näher als 20 cm oder steht der mBot2 auf Rot, leuchten seine LEDs rot (`mbot.setLed(255, 0, 0)`). Sonst fährt er 20 cm vor.
messwerte: getDistance=50, getColor=weiß -> forward 20, ledOff
messwerte: getDistance=10, getColor=weiß -> none, ledOn
messwerte: getDistance=50, getColor=rot -> none, ledOn
braucht: verzweigung
tipp: Die Bedingung lautet `mbot.getDistance() < 20 || mbot.getColor().equals("rot")`.
tipp: Im Ja-Zweig steht `mbot.setLed(255, 0, 0)`, im Nein-Zweig `mbot.forward(20)`.
lösung: vb-k-vorsicht-loesung.visustruct
:::

> Wie sähe die Bedingung für **weiterfahren** aus? Die Wand ist weit weg **und** er steht nicht auf Rot: `mbot.getDistance() >= 20 && !mbot.getColor().equals("rot")`.
