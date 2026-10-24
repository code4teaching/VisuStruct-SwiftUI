---
titel: Slalom
nach: 2
stufe: 2
---

Vor dem mBot2 stehen vier Pylonen in einer Reihe. Er fährt Slalom: am ersten Pylon oben vorbei, am zweiten unten, dann wieder oben und unten. Hinter dem letzten Pylon ist das Ziel.

In dieser Welt ist ein Feld 30 cm groß, so breit wie der mBot2. Ein Schritt von Feld zu Feld ist also `mbot.forward(30)`.

::: übung vb-slalom
titel: Slalom
auftrag: Fahre den Slalom bis ins Ziel, ohne einen Pylon zu berühren. Benutze eine Schleife.
welt: slalom
braucht: forSchleife
tipp: Überlege zuerst, wie der mBot2 oben um einen einzigen Pylon herumfährt: Er steht danach zwei Felder weiter in derselben Reihe und schaut wieder nach rechts.
tipp: Unten herum geht genauso, nur mit links und rechts vertauscht. „Oben herum, dann unten herum“ wiederholt sich zweimal.
lösung: vb-slalom-loesung.visustruct
:::
