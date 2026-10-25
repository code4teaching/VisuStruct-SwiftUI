---
titel: Linienfolger mit Stopp
nach: 16
kurs: 14
stufe: 3
---

Der mBot2 folgt einer schwarzen Linie und hält am roten Feld an ihrem Ende an.

Dafür gibt er mit **Räder einzeln** Gas: `mbot.drive(40, 40)` lässt beide Räder gleich schnell drehen, er fährt geradeaus weiter, bis ein anderer Fahrbefehl kommt. `mbot.drive(10, 40)` macht eine Linkskurve, `mbot.drive(40, 10)` eine Rechtskurve. `mbot.stop()` hält ihn an.

Die beiden mittleren Fühler des Liniensensors fragst du mit `mbot.isLineLeft()` und `mbot.isLineRight()` ab. Sehen beide die Linie, fährt er geradeaus. Sieht nur der linke sie, lenkt er nach links, sieht nur der rechte sie, nach rechts.

::: übung vb-linienfolger-stopp
titel: Linienfolger mit Stopp
auftrag: Solange der mBot2 nicht auf Rot steht, folgt er der Linie. Danach hält er an. In der zweiten Welt schlängelt sich die Linie.
welt: linie-rot-1, linie-rot-2
braucht: whileSchleife, verzweigung
tipp: Außen eine While-Schleife mit `!mbot.getColor().equals("rot")`, danach **anhalten**.
tipp: In der Schleife: Sind `mbot.isLineLeft() && mbot.isLineRight()`, dann `mbot.drive(40, 40)`. Sonst, wenn `mbot.isLineLeft()`, dann `mbot.drive(10, 40)`. Sonst, wenn `mbot.isLineRight()`, dann `mbot.drive(40, 10)`.
lösung: vb-linienfolger-stopp-loesung.visustruct
:::
