---
titel: Kleeblatt im Wald
nach: 7
stufe: 3
---

Ganz hinten im Wald liegt ein Kleeblatt auf einem schwarzen Feld. Auf dem Weg dorthin stehen Bäume, aber nie zwei direkt hintereinander. Steht ein Baum vor dem mBot2, fährt er außen herum und dann weiter geradeaus.

Ein Feld ist 30 cm groß. Steht ein Baum im nächsten Feld, misst der Abstandssensor weniger als 20 cm.

::: übung vbb-wald
titel: Kleeblatt im Wald
auftrag: Der mBot2 fährt in beiden Welten bis zum schwarzen Feld und umfährt dabei jeden Baum, ohne anzustoßen.
welt: wald-1, wald-2
braucht: whileSchleife, verzweigung
tipp: Außen eine While-Schleife mit **Linie** **gleich** 0, so wie beim Rand in Lektion 7. Darin eine Verzweigung: **wenn** **Abstand** **kleiner als** 20, **sonst** **fahre vor** mit 30.
tipp: Um einen Baum herum: links drehen, 30 vor, rechts drehen, 60 vor, rechts drehen, 30 vor, links drehen.
lösung: vbb-wald-loesung.visustruct
:::
