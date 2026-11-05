---
titel: Ausgang finden
nach: 8
stufe: 3
---

Der mBot2 steht unten links und schaut nach rechts. Über ihm liegen Wände. Jede Wand hat genau eine Lücke, und jede Lücke liegt weiter rechts als die darunter. Ganz oben ist das schwarze Ziel.

Der mBot2 fährt nach rechts und schaut in jedem Feld nach oben. Ist dort eine Lücke, fährt er hindurch in den nächsten Gang.

::: übung vbb-ausgang
titel: Ausgang finden
auftrag: Der mBot2 fährt in beiden Welten durch alle Lücken bis zum Ziel, ohne anzustoßen. Ein Feld ist 30 cm groß.
welt: ausgang-1, ausgang-2
braucht: whileSchleife, verzweigung
tipp: Außen eine While-Schleife mit **Linie** **gleich** 0. Darin dreht sich der mBot2 zuerst nach links und schaut: Ist oben frei, misst er mehr als 20 cm.
tipp: **Wenn** frei: 60 vor (durch die Lücke in den nächsten Gang), dann rechts drehen. **Sonst**: rechts drehen und 30 vor.
lösung: vbb-ausgang-loesung.visustruct
:::
