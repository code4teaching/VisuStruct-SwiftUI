---
titel: Strings
bereich: Light, sound and screen
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

## Now in Java: scrolling text

`word.charAt(i)` gives the character with the number `i`. If you show the characters one after the other with a pause, the word runs across the screen letter by letter:

```java
String word = "Ludwig";
for (int i = 0; i < word.length(); i++) {
    mbot.showText(word.charAt(i));
    mbot.pause(500);
}
```

| Pass | `i` | Screen |
|---|---|---|
| 1 | 0 | L |
| 2 | 1 | u |
| 3 | 2 | d |

::: übung vb-laufschrift
titel: Ludwig backwards
code: java
auftrag: Create `String word = "Ludwig"`. Show the word **backwards** letter by letter on the screen, so g, i, w, d, u, L, with a 500 ms pause after each letter.
befehle: showText "g", pause 500, showText "i", pause 500, showText "w", pause 500, showText "d", pause 500, showText "u", pause 500, showText "L", pause 500
braucht: forSchleife
tipp: The last character has the number `word.length() - 1`. The loop counts backwards: `for (int i = word.length() - 1; i >= 0; i--)`.
tipp: Inside the loop: `mbot.showText(word.charAt(i));` and `mbot.pause(500);`.
lösung: vb-laufschrift-loesung.visustruct
:::

> 📘 **More without the robot:** VisuStruct has the lesson ["Strings"](?visustruct&lektion=17-zeichenketten). It opens in a new window.

::: übung vb-fehler-19-zeichenketten
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "How long is the text?", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-19-zeichenketten-start.visustruct
befehle: showText "Hello class (11)"
tipp: The error message names an unknown variable. What is the variable called where it is created? Java is case-sensitive.
tipp: It should be `mbot.showText(text +`.
lösung: vb-java-textlaenge-loesung.visustruct
:::

## Game: Defuse the bomb

::: spiel bombe
titel: Game: Defuse the bomb
intro: Every program contains **exactly one mistake**, and the bomb is ticking. Read what the mBot2 should show and tap the wrong line before time runs out. Five rounds, 30 seconds each.
zeit: 30

runde:
    String word = "VisuBot";
    for (int i = 1; i <= word.length(); i++) {
        mbot.showText(word.substring(1, i));
        mbot.pause(300);
    }
frage: Should show V, Vi, Vis and so on up to VisuBot.
fehler: 3
besser: mbot.showText(word.substring(0, i));
> The first character has the number 0. With `substring(1, i)` the V is missing.

runde:
    String text = "Hello class";
    mbot.showText(text + " (" + text.length + ")");
frage: Should show **Hello class (11)**.
fehler: 2
besser: mbot.showText(text + " (" + text.length() + ")");
> For a String, `length()` is a method and needs brackets. Only arrays have `length` without brackets.

runde:
    String word = "Ludwig";
    for (int i = 0; i <= word.length(); i++) {
        mbot.showText(word.charAt(i));
        mbot.pause(500);
    }
frage: Should show L, u, d, w, i, g.
fehler: 2
besser: for (int i = 0; i < word.length(); i++) {
> The last character has the number 5. At `i = 6` there is no character left.

runde:
    String word = "Ludwig";
    for (int i = word.length(); i >= 0; i--) {
        mbot.showText(word.charAt(i));
        mbot.pause(500);
    }
frage: Should show the word backwards: g, i, w, d, u, L.
fehler: 2
besser: for (int i = word.length() - 1; i >= 0; i--) {
> Backwards you start at the last character, and that has the number `word.length() - 1`.

runde:
    String name = 'Ludwig';
    mbot.showText("Hello " + name);
frage: Should show **Hello Ludwig**.
fehler: 1
besser: String name = "Ludwig";
> Texts go in double quotation marks. Single ones are only for a single character (`char`).
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can work with `length()` and `substring(…)`. → Letter by letter
- I can join texts and numbers with `+`. → Now in Java: text and length
- I can get single characters with `charAt(…)`. → Now in Java: scrolling text
:::

## Quiz

::: quiz
? What does `"VisuBot".substring(0, 4)` give?
→ Letter by letter
- [ ] `"VisuB"`
- [x] `"Visu"`
- [ ] `"uBot"`
> `substring(0, 4)` takes the characters 0, 1, 2 and 3, so four of them.
? What does `"Ludwig".charAt(0)` give?
→ Now in Java: scrolling text
- [x] `L`
- [ ] `u`
- [ ] `g`
> Characters are counted from 0. Character 0 is the first one.
:::
