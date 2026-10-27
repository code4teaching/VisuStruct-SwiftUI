---
titel: The maze
nach: 5
stufe: 2
---

The mBot2 is standing in a maze. The goal is a black square with a green flag. The corridors are 30 cm wide.

A simple rule gets it through: **If the way ahead is free, drive forward. Otherwise turn right. If there is a wall there too, turn all the way around.**

How does the mBot2 notice that it has reached the goal? The line sensor underneath sees the black square: `mbot.getLine()` is then no longer `0`.

::: übung vb-labyrinth
titel: The maze
auftrag: Program the mBot2 so that it finds the goal in both mazes without bumping into a wall.
welt: labyrinth-1, labyrinth-2
braucht: whileSchleife, verzweigung
tipp: On the outside a while loop with the condition `mbot.getLine() == 0`. It runs until the mBot2 is on the goal.
tipp: Inside the loop a branch `mbot.getDistance() > 15`: yes → `mbot.forward()`. No → `mbot.turnRight()`, then another branch `mbot.getDistance() < 15` with `mbot.turnRight(180)`.
lösung: vb-labyrinth-loesung.visustruct
:::

::: angeberwissen
With the rule "always keep one hand on the wall" you get out of any maze whose walls are all connected. The ancient Greeks already told of Theseus, who found his way through the Minotaur's labyrinth with a ball of thread.
:::
