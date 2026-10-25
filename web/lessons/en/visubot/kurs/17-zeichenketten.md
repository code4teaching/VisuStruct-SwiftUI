---
titel: mBot2 with strings
---

## Letter by letter

The mBot2 should build up its name on the screen, one letter after another: first **V**, then **Vi**, then **Vis** and so on up to **VisuBot**. `word.substring(0, i)` gives the first `i` characters.

::: übung vb-k-buchstaben
titel: Build the name
auftrag: Create `String word = "VisuBot"`. A for loop counts `i` from 1 to `word.length()`. Inside, the mBot2 shows `word.substring(0, i)` and waits 300 milliseconds.
befehle: showText "V", pause 300, showText "Vi", pause 300, showText "Vis", pause 300, showText "Visu", pause 300, showText "VisuB", pause 300, showText "VisuBo", pause 300, showText "VisuBot", pause 300
braucht: forSchleife
tipp: The loop starts at `int i = 1` and runs as long as `i <= word.length()`.
tipp: Inside the loop: `mbot.showText(word.substring(0, i))` and `mbot.pause(300)`.
lösung: vb-k-buchstaben-loesung.visustruct
:::
