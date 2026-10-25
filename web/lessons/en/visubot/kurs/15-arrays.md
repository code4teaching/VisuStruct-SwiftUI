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

## Colours as an array

The five LEDs have the numbers 0 to 4, exactly like the slots of an array with five values. If you store five colours in an array, LED `i` gets the colour from slot `i`: `mbot.led(i).setColor(colours[i])`.

::: übung vb-k-farben
titel: Rainbow
auftrag: Create an array `colours` with the texts `"red"`, `"yellow"`, `"green"`, `"blue"` and `"purple"`. A for loop gives every LED `i` the colour from `colours[i]`.
befehle: ledColor 0 "red", ledColor 1 "yellow", ledColor 2 "green", ledColor 3 "blue", ledColor 4 "purple"
braucht: forSchleife
tipp: `String[] colours = {"red", "yellow", "green", "blue", "purple"}` creates the array.
tipp: The loop runs from `i = 0` while `i < colours.length`. Inside: `mbot.led(i).setColor(colours[i])`.
lösung: vb-k-farben-loesung.visustruct
:::
