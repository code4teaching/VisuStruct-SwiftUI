---
titel: The alarm system
nach: 13
kurs: 11
stufe: 2
---

The mBot2 guards your room. If someone comes closer than 20 cm **or** it gets loud (loudness above 60), it raises the alarm: the LEDs light up red and it beeps. Otherwise the LEDs are off. With button B you switch the alarm system off.

::: übung vb-alarmanlage
titel: The alarm system
auftrag: As long as button B is not pressed, the mBot2 checks again and again: if the distance is below 20 cm or the loudness above 60, the LEDs light up red and it plays a tone. Otherwise the LEDs go off. Then it waits a moment.
messwerte: getDistance=10, isButtonB=false/true -> none, tone
messwerte: getLoudness=80, isButtonB=false/true -> none, tone
messwerte: getDistance=100, getLoudness=0, isButtonB=false/true -> none, noTone, ledOff
braucht: whileSchleife, verzweigung
tipp: On the outside is a while loop with `!mbot.isButtonB()`. Inside a branch and after it **wait a moment**.
tipp: The condition of the branch: `mbot.getDistance() < 20 || mbot.getLoudness() > 60`. In the yes branch `mbot.setLed(255, 0, 0)` and `mbot.playTone(880, 200)`, in the no branch `mbot.ledOff()`.
lösung: vb-alarmanlage-loesung.visustruct
:::
