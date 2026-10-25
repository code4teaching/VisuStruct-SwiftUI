---
titel: mBot2 with arrays
---

## A melody as an array

The mBot2 has a loudspeaker: `mbot.playTone(262, 300)` plays the note C (262 hertz) for 300 milliseconds. A melody is a row of notes. The pitches fit nicely into an array:

| Note | C | D | E | F | G |
|---|---|---|---|---|---|
| Hertz | 262 | 294 | 330 | 349 | 392 |

::: übung vb-k-melodie
titel: Melody
auftrag: Create an array `tones` with the five pitches. A for loop plays them one after the other, each for 300 milliseconds.
befehle: playTone 262 300, playTone 294 300, playTone 330 300, playTone 349 300, playTone 392 300
braucht: forSchleife
tipp: `int[] tones = {262, 294, 330, 349, 392}` creates the array.
tipp: The loop runs from `i = 0` to `i < tones.length`. Inside is `mbot.playTone(tones[i], 300)`.
lösung: vb-k-melodie-loesung.visustruct
:::

> If you want to change the melody, you only change the array. The loop stays the same.
