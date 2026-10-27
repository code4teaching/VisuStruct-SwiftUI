---
titel: Die Alarmanlage
nach: 16
stufe: 2
---

Der mBot2 bewacht dein Zimmer. Kommt jemand näher als 20 cm **oder** wird es laut (Lautstärke über 60), schlägt er Alarm: Die LEDs leuchten rot und er piept. Sonst sind die LEDs aus. Mit Taste B schaltest du die Alarmanlage ab.

::: übung vb-alarmanlage
titel: Die Alarmanlage
auftrag: Solange Taste B nicht gedrückt ist, prüft der mBot2 immer wieder: Ist der Abstand unter 20 cm oder die Lautstärke über 60, leuchten die LEDs rot und er spielt einen Ton. Sonst gehen die LEDs aus. Danach wartet er kurz.
messwerte: getDistance=10, isButtonB=false/true -> none, tone
messwerte: getLoudness=80, isButtonB=false/true -> none, tone
messwerte: getDistance=100, getLoudness=0, isButtonB=false/true -> none, noTone, ledOff
braucht: whileSchleife, verzweigung
tipp: Außen steht eine While-Schleife mit `!mbot.isButtonB()`. Darin eine Verzweigung und danach **kurz warten**.
tipp: Die Bedingung der Verzweigung: `mbot.getDistance() < 20 || mbot.getLoudness() > 60`. Im Ja-Zweig `mbot.setLed(255, 0, 0)` und `mbot.playTone(880, 200)`, im Nein-Zweig `mbot.ledOff()`.
lösung: vb-alarmanlage-loesung.visustruct
:::
