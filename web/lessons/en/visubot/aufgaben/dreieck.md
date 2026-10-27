---
titel: The triangle
nach: 2
stufe: 1
---

For the square the mBot2 turns four times by 90°. Together that is 360°, one full turn. For a triangle it also turns all the way around once, but in only three corners.

Inside the brackets of **turn right** you can write how far it should turn: `mbot.turnRight(45)` turns only 45°.

::: übung vb-dreieck
titel: The triangle
auftrag: Let the mBot2 drive a triangle with three sides of equal length. Each side is 30 cm long. Use a loop.
fahrt: 3 x (forward 30, turnRight 120)
braucht: forSchleife
tipp: How many degrees must one corner be so that three corners add up to a full turn (360°)?
tipp: In the loop the mBot2 drives one side and then turns by 120°.
lösung: vb-dreieck-loesung.visustruct
:::

::: angeberwissen
The idea of drawing shapes with a driving robot is more than 50 years old: the language **Logo** was created in the late 1960s. Children used it to steer a "turtle" that rolled across paper with a pen.
:::
