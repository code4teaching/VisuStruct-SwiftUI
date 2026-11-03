---
titel: Arrays and melodies
bereich: Light, sound and screen
kurz: Store many values in one array and work through them with a loop.
---

## Skills I will gain now

::: kompetenzen
- create an array and play it with a loop
- use an array of texts in Java
- collect measurements in an array and work out the average
:::

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

## Now in Java: measurement series

Sensors never measure exactly. Hold your hand in front of the ultrasonic sensor: the number always jumps around a little. That is why professionals measure several times and work out the **average**.

The measurements go into an array. `new int[5]` creates an array with five empty slots:

```java
int[] values = new int[5];
for (int i = 0; i < values.length; i++) {
    values[i] = mbot.getDistance();
    mbot.pause(100);
}
```

Then you add up all the values. For that you need a variable that starts at 0 and grows in every pass:

```java
int sum = 0;
for (int i = 0; i < values.length; i++) {
    sum = sum + values[i];
}
```

The average is the sum divided by the number of values. Write `5.0` instead of `5`, then Java calculates with decimal numbers: `double average = sum / 5.0;`

::: übung vb-messreihe
titel: Measurement series
code: java
auftrag: Measure the distance five times into an array `int[] values = new int[5]`, with a 100 ms pause in between. Then add up all values, work out the average and show for example **Average: 40.0** on the screen.
messwerte: getDistance=40 -> screen "Average: 40.0"
messwerte: getDistance=25 -> screen "Average: 25.0"
braucht: forSchleife
tipp: Two for loops: the first fills the array with `values[i] = mbot.getDistance();`, the second calculates `sum = sum + values[i];`.
tipp: Then `double average = sum / 5.0;` and `mbot.showText("Average: " + average);`.
lösung: vb-messreihe-loesung.visustruct
:::

> 📘 **More without the robot:** VisuStruct has the lesson ["Arrays"](?visustruct&lektion=15-arrays). It opens in a new window.

::: quiz
? What is `tones[1]` if `int[] tones = {262, 294, 330};`?
→ A melody as an array
- [ ] 262
- [x] 294
- [ ] 1
> The slots count from 0. So slot 1 is the second one.
? How many slots does `{262, 294, 330}` have, so what is `tones.length`?
→ A melody as an array
- [ ] 2
- [x] 3
- [ ] 330
> `length` counts the slots, here three. That is why the last slot has the number 2.
:::

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can create an array and play it with a loop. → A melody as an array
- I can use an array of texts in Java. → Now in Java: rainbow
- I can collect measurements in an array and work out the average. → Now in Java: measurement series
:::
