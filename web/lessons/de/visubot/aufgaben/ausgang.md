---
titel: Labyrinth mit Ausgängen
nach: 4
kurs: 11
stufe: 3
---

Der mBot2 steht unten links und schaut nach rechts. Über ihm liegen Wandreihen. Jede hat genau eine Lücke, und jede Lücke liegt weiter rechts als die darunter. Ganz oben ist das Ziel.

Der mBot2 fährt nach rechts und schaut in jedem Feld nach oben. Ist dort eine Lücke, fährt er hindurch in den nächsten Gang.

::: übung vb-ausgang
titel: Labyrinth mit Ausgängen
auftrag: Programmiere den mBot2 so, dass er in beiden Welten durch alle Lücken bis zum Ziel fährt, ohne anzustoßen. Ein Feld ist 30 cm groß.
welt: ausgang-1, ausgang-2
braucht: whileSchleife, verzweigung
tipp: In jedem Durchlauf dreht sich der mBot2 zuerst nach links und misst. Ist oben frei, sind es mehr als 20 cm.
tipp: Durch die Lücke sind es zwei Felder bis in den nächsten Gang. Danach soll er wieder nach rechts schauen. Ist oben eine Wand, dreht er sich zurück und fährt ein Feld weiter.
lösung: vb-ausgang-loesung.visustruct
:::
