---
titel: Der Nachtwächter
nach: 15
kurs: 11
stufe: 1
---

Der mBot2 ist ein Nachtwächter. Solange es dunkel ist (Helligkeit unter 20), läuft er Streife: 30 cm vor und dann umdrehen. Sobald es hell wird, ist seine Schicht vorbei: Er zeigt **Zzz** auf dem Bildschirm und schläft.

::: übung vb-nachtwaechter
titel: Der Nachtwächter
auftrag: Solange die Helligkeit unter 20 ist, fährt der mBot2 30 cm vor und dreht sich um 180°. Danach zeigt er **Zzz** auf dem Bildschirm.
messwerte: getBrightness=5/80 -> drives, screen "Zzz"
messwerte: getBrightness=80 -> none, screen "Zzz"
braucht: whileSchleife
tipp: Eine While-Schleife mit `mbot.getBrightness() < 20`. Darin `mbot.forward(30)` und `mbot.turnRight(180)`.
tipp: Nach der Schleife steht `mbot.showText("Zzz")`.
lösung: vb-nachtwaechter-loesung.visustruct
:::
