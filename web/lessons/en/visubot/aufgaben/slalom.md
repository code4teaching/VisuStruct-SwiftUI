---
titel: Slalom
nach: 2
stufe: 2
---

Four cones stand in a row in front of the mBot2. It drives a slalom: past the first cone on the top side, past the second on the bottom side, then top and bottom again. Behind the last cone is the goal.

In this world one square is 30 cm, as wide as the mBot2. One step from square to square is therefore `mbot.forward(30)`.

::: übung vb-slalom
titel: Slalom
auftrag: Drive the slalom to the goal without touching a cone. Use a loop.
welt: slalom
braucht: forSchleife
tipp: First think about how the mBot2 drives around a single cone on the top side: afterwards it is two squares further along in the same row and faces right again.
tipp: Around the bottom works the same way, only with left and right swapped. "Top, then bottom" repeats twice.
lösung: vb-slalom-loesung.visustruct
:::

::: angeberwissen
This task originally comes from **Kara**, the ladybird from Switzerland (SwissEduc, ETH Zurich). There Kara drives a slalom around trees, back and forth forever.
:::
