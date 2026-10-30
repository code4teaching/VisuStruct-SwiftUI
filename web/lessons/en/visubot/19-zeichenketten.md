---
titel: Strings
bereich: VisuBot
kurz: Work with texts, pick out letters and show them on the screen.
---

## Skills I will gain now

::: kompetenzen
- work with `length()` and `substring(…)`
- join texts and numbers with `+`
- get single characters with `charAt(…)`
:::

## Letter by letter

In Java a text is called a **string** or `String`. It consists of single characters, numbered from **0** just like an array:

| Character | V | i | s | u | B | o | t |
|---|---|---|---|---|---|---|---|
| Number | 0 | 1 | 2 | 3 | 4 | 5 | 6 |

- `word.length()` gives the number of characters, here 7.
- `word.substring(0, 3)` gives the first 3 characters: `"Vis"`.

The mBot2 should build its name on the [screen]{part=screen}: first **V**, then **Vi**, then **Vis** and so on up to **VisuBot**.

::: übung vb-buchstaben
titel: Build the name
auftrag: Create `String word = "VisuBot"`. A for loop counts `i` from 1 to `word.length()`. Inside, the mBot2 shows `word.substring(0, i)` and waits 300 milliseconds.
befehle: showText "V", pause 300, showText "Vi", pause 300, showText "Vis", pause 300, showText "Visu", pause 300, showText "VisuB", pause 300, showText "VisuBo", pause 300, showText "VisuBot", pause 300
braucht: forSchleife
tipp: The loop starts at `int i = 1` and runs as long as `i <= word.length()`.
tipp: Inside the loop: `mbot.showText(word.substring(0, i))` and `mbot.pause(300)`.
lösung: vb-buchstaben-loesung.visustruct
:::

## Now in Java: text and length

With `+` you join texts and numbers. This way the mBot2 shows a text followed by its length.

::: übung vb-java-textlaenge
titel: How long is the text?
code: java
auftrag: Write in Java: create `String text = "Hello class"`. The mBot2 shows the text and its length in brackets, so **Hello class (11)**.
befehle: showText "Hello class (11)"
tipp: `text.length()` gives the length. The space counts too.
tipp: `mbot.showText(text + " (" + text.length() + ")");`
lösung: vb-java-textlaenge-loesung.visustruct
:::

## Now without the robot: read it backwards

`word.charAt(i)` gives the character with the number `i`. If you put every character at the **front** of a new text, the word ends up backwards:

| Round | Character | new text |
|---|---|---|
| 1 | L | L |
| 2 | u | uL |
| 3 | d | duL |

::: übung vb-ohne-rueckwaerts
titel: Ludwig backwards
code: java
auftrag: Create `String word = "Ludwig"` and `String backwards = ""`. A loop puts every character of `word` at the front of `backwards`. Finally you print **giwduL**. No `mbot` at all!
test: - -> giwduL
braucht: forSchleife
tipp: The loop runs from `i = 0` while `i < word.length()`.
tipp: Inside the loop: `backwards = word.charAt(i) + backwards;`. After the loop: `System.out.println(backwards);`.
lösung: vb-ohne-rueckwaerts-loesung.visustruct
:::

::: quiz
? What does `"VisuBot".substring(0, 4)` give?
→ Letter by letter
- [ ] `"VisuB"`
- [x] `"Visu"`
- [ ] `"uBot"`
> `substring(0, 4)` takes the characters 0, 1, 2 and 3, so four of them.
? What does `"Ludwig".charAt(0)` give?
→ Now without the robot: read it backwards
- [x] `L`
- [ ] `u`
- [ ] `g`
> Characters are counted from 0. Character 0 is the first one.
:::

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can work with `length()` and `substring(…)`. → Letter by letter
- I can join texts and numbers with `+`. → Now in Java: text and length
- I can get single characters with `charAt(…)`. → Now without the robot: read it backwards
:::
