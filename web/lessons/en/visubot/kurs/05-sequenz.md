---
titel: mBot2 in the sequence
---

## The mBot2 joins in

::: mbot2
fokus:
drehen: ja
:::

This is the **mBot2**, a small robot. Among the elements you now find the group **🤖 mBot2 commands**: drive forward, drive backward, turn right, turn left and more. They are normal statements and stand one below the other like any sequence.

Inside the brackets you write how far it should drive: `mbot.forward(50)` drives 50 cm. `mbot.turnRight()` turns it 90° to the right.

> You don't need a real robot. Start the [simulation](#zeige-simulation): the mBot2 then drives in a 3D world.

::: übung vb-k-quadrat
titel: Drive a square
auftrag: Let the mBot2 drive a square with 50 cm sides: 50 cm forward, turn right. And that four times.
fahrt: 4 x (forward 50, turnRight)
tipp: One side consists of two boxes: **drive forward** with `50` in the brackets and then **turn right**.
tipp: Altogether there are eight boxes one below the other: `mbot.forward(50)`, `mbot.turnRight()`, `mbot.forward(50)`, `mbot.turnRight()` …
lösung: vb-k-quadrat-loesung.visustruct
:::

## Around the corners to the goal

In this world two walls are in the way. The goal is the black square with the green flag. One square is 30 cm.

Here you see why the order matters: if you swap two boxes, the mBot2 drives into a wall.

::: übung vb-k-ecke
titel: Around the corners
auftrag: Get the mBot2 to the goal with a sequence, without bumping into anything. At the start it faces up.
welt: ecke
tipp: First drive two squares (60 cm) up. Then the way is free to the left and right.
tipp: To the right up to the gap it is three squares (90 cm). Then two squares up and three to the left.
lösung: vb-k-ecke-loesung.visustruct
:::
