---
titel: Maze with exits
nach: 4
stufe: 3
---

The mBot2 stands at the bottom left and faces right. Above it are rows of walls. Each has exactly one gap, and each gap lies further right than the one below. The goal is at the very top.

The mBot2 drives to the right and looks up in every square. If there is a gap, it drives through into the next corridor.

::: übung vb-ausgang
titel: Maze with exits
auftrag: Program the mBot2 so that in both worlds it drives through all gaps to the goal without bumping into anything. One square is 30 cm.
welt: ausgang-1, ausgang-2
braucht: whileSchleife, verzweigung
tipp: In each pass the mBot2 first turns left and measures. If the way up is free, it is more than 20 cm.
tipp: Through the gap it is two squares into the next corridor. Afterwards it should face right again. If there is a wall above, it turns back and drives one square further.
lösung: vb-ausgang-loesung.visustruct
:::
