---
titel: Arrays and melodies
bereich: VisuBot
kurz: Store many values in one array and work through them with a loop.
---

## A melody as an array

A melody is a row of tones. Instead of five variables `tone1`, `tone2`, … you use an **array**. An array is a row of slots under **one** name:

```java
int[] tones = {262, 294, 330, 349, 392};
```

- `int[]` means: an array of whole numbers.
- The slots are numbered from **0**. `tones[0]` is 262, `tones[4]` is 392.
- `tones.length` tells you how many slots there are, here 5.

A for loop with `i` from 0 to `tones.length - 1` reaches every slot.

::: übung vb-melodie
titel: Melody
auftrag: Create an array `tones` with the pitches 262, 294, 330, 349 and 392. A for loop plays them one after the other, each for 300 milliseconds.
befehle: playTone 262 300, playTone 294 300, playTone 330 300, playTone 349 300, playTone 392 300
braucht: forSchleife
tipp: `int[] tones = {262, 294, 330, 349, 392}` creates the array.
tipp: The loop runs from `i = 0` while `i < tones.length`. Inside is `mbot.playTone(tones[i], 300)`.
lösung: vb-melodie-loesung.visustruct
:::

> If you want a different melody, you only change the array. The loop stays the same.

## Now in Java: rainbow

The five LEDs have the numbers 0 to 4, just like the slots of an array with five values. An array can hold texts too: `String[] colours = {"red", "yellow"};`. LED `i` then gets the colour from slot `i`: `mbot.led(i).setColor(colours[i])`.

::: übung vb-farben
titel: Rainbow
code: java
auftrag: Write in Java: create an array `colours` with the texts `"red"`, `"yellow"`, `"green"`, `"blue"` and `"purple"`. A for loop gives every LED `i` the colour from `colours[i]`.
befehle: ledColor 0 "red", ledColor 1 "yellow", ledColor 2 "green", ledColor 3 "blue", ledColor 4 "purple"
braucht: forSchleife
tipp: `String[] colours = {"red", "yellow", "green", "blue", "purple"};` creates the array.
tipp: `for (int i = 0; i < colours.length; i++) { mbot.led(i).setColor(colours[i]); }`
lösung: vb-farben-loesung.visustruct
:::

## Now without the robot: sum of the grades

With a loop you can also add up all the values of an array. You need a variable that starts at 0 and grows in every round:

```java
int sum = 0;
for (int i = 0; i < grades.length; i++) {
  sum = sum + grades[i];
}
```

::: übung vb-ohne-summe
titel: Sum of the grades
code: java
auftrag: Create `int[] grades = {2, 1, 3, 2}`. Add up all grades in a loop and then print **Sum: 8** and on a second line **Count: 4**. The count comes from `grades.length`. No `mbot` at all!
test: - -> Sum: 8 | Count: 4
braucht: forSchleife
tipp: Before the loop `int sum = 0;`, inside the loop `sum = sum + grades[i];`.
tipp: After the loop `System.out.println("Sum: " + sum);` and `System.out.println("Count: " + grades.length);`.
lösung: vb-ohne-summe-loesung.visustruct
:::

::: quiz
? What is `tones[1]` if `int[] tones = {262, 294, 330};`?
- [ ] 262
- [x] 294
- [ ] 1
> The slots count from 0. So slot 1 is the second one.
? How many slots does `{262, 294, 330}` have, so what is `tones.length`?
- [ ] 2
- [x] 3
- [ ] 330
> `length` counts the slots, here three. That is why the last slot has the number 2.
:::

::: checkliste
- I can create an array and play it with a loop. → A melody as an array
- I can use an array of texts in Java. → Now in Java: rainbow
- I can add up all values of an array. → Now without the robot: sum of the grades
:::
