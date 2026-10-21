---
titel: Strings
bereich: Basics
kurz: Work with text: read single characters, cut out parts, search, compare and split.
---

## Text is a row of characters

You already know `String`: `String name = "Ludwig"`. In computer science such a text is called a **string**, because the characters hang one after another like beads on a string. Every character has a place with an index, just like in an array. Here, too, **counting starts at 0**: the first character is 0 steps away from the start.

::: grafik zk-zeichen.svg
The nine characters of “Billygoat” with their indices 0 to 8.
:::

A String comes with **methods**. You write the name of the variable, a dot and the method:

- `word.length()` gives the number of characters, here 9.
- `word.charAt(0)` gives the character with the index 0, here `'B'`.

> With Strings you write `length()` **with** brackets, with arrays `length` **without**. Sadly, that is just how Java is.

In Java a single character has the data type `char`. A `char` goes in **single** quotation marks: `'B'`. A String goes in double ones: `"B"`.

```
char first = word.charAt(0)
char last = word.charAt(word.length() - 1)
```

Just like in an array, the last character has the index `length() - 1`.

## Cut out parts

With `substring` you cut a part out of the text:

- `word.substring(0, 5)` gives the characters from index 0 **up to just before** index 5, so `"Billy"`.
- `word.substring(5)` gives everything from index 5 to the end, so `"goat"`.

The end is **not** included. Handy: `substring(0, 5)` gives exactly 5 characters.

::: diagramm zk-zeichen.visustruct
All the methods from this lesson in one example. Go through it in the simulation and compare every output with the picture.
:::

## Search and compare

More methods you often need:

| Method | Meaning | Example with `"Billygoat"` |
|---|---|---|
| `indexOf("goat")` | Where does the text start? | 5 |
| `indexOf("x")` | not found | -1 |
| `contains("lly")` | Does the text appear? | true |
| `toUpperCase()` | all capitals | BILLYGOAT |
| `toLowerCase()` | all small letters | billygoat |
| `equals("Billygoat")` | same text? | true |

> In Java you compare two Strings with `equals`, not with `==`. Two single characters (`char`), on the other hand, you compare with `==`, e.g. `word.charAt(i) == 'e'`.

::: angeberwissen
Try `"Billygoat".equals("billygoat")`. The answer is false! For a computer, B and b are completely different characters. Inside, every character is stored as a number: B is 66 and b is 98. This numbering is called ASCII and dates from 1963. Baah, so for a computer Ludwig and ludwig are two different goats. I am the one with the capital L.
:::

## Character by character

With a for loop you go through a text character by character. The index `i` runs from 0 to `word.length() - 1`, just like with an array:

::: diagramm zk-zaehlen.visustruct
Counts how often the letter e appears. In the simulation, try “cheese” and watch i and count.
:::

## Split with split

Often several pieces of information sit in one single line, separated by a character, e.g. `"Ludwig;billy goat;7"`. With `split` you cut the line apart at this character. The result is a **String array**:

```
String[] parts = line.split(";")
```

After that, `parts[0]` is `"Ludwig"`, `parts[1]` is `"billy goat"` and `parts[2]` is `"7"`. With `parts.length` you find out how many parts there are.

::: diagramm zk-split.visustruct
The line is split at the semicolon, and every part is output with its index.
:::

> CSV files, which you know from spreadsheets, are built the same way: one line per record, the values separated by a comma or semicolon.

## Exercise: Initials

::: übung zk-initialen
titel: Initials
auftrag: Ask for a first name and a last name and output the initials. So for Ludwig Billygoat that is `L. B.`
test: Ludwig, Billygoat -> L. B.
test: Ada, Lovelace -> A. L.
test: Ben, Shneiderman -> B. S.
braucht: anweisung
tipp: The initial is the first letter of a name. Which method gives the character at a particular place?
tipp: `firstName.charAt(0)` gives the first letter. The output is then `firstName.charAt(0) + ". " + lastName.charAt(0) + "."`
lösung: zk-initialen-loesung.visustruct
:::

## Exercise: Backwards

::: übung zk-rueckwaerts
titel: Backwards
auftrag: Ask for a word and output it backwards. Ludwig becomes `giwduL`.
test: Ludwig -> giwduL
test: Anna -> annA
test: a -> a
braucht: forSchleife
tipp: Go through the word character by character, but from back to front, and build a new text as you go.
tipp: Create `String backwards = ""`. The loop starts at the last index `word.length() - 1` and counts down to 0 with `i--`. In every pass you add `word.charAt(i)` at the end.
lösung: zk-rueckwaerts-loesung.visustruct
:::

## Exercise: Count words

::: übung zk-woerter
titel: Count words
auftrag: Ask for a sentence and output how many words it has, e.g. `Words: 4` for “Ludwig is a goat”. The words are separated by exactly one space.
test: Ludwig is a goat -> Words: 4
test: Hello -> Words: 1
test: I like goats -> Words: 3
braucht: anweisung
tipp: There is always a space between the words. Which method splits a text at a character?
tipp: Split the sentence into a String array with `sentence.split(" ")`. Its length is the number of words.
lösung: zk-woerter-loesung.visustruct
:::

## Checklist

::: checkliste
- I know that the characters of a String are also counted from 0. → Text is a row of characters
- I can work with `length()` and `charAt(i)`. → Text is a row of characters
- I can cut a part out of a text with `substring`. → Cut out parts
- I know `indexOf`, `contains`, `toUpperCase` and `equals`. → Search and compare
- I can go through a text character by character with a loop. → Character by character
- I can split a text into a String array with `split`. → Split with split
:::

## Quiz

::: quiz
? What does `"Ludwig".charAt(1)` give?
- [ ] L
- [x] u
- [ ] d
> Counting starts at 0: L has the index 0, u the index 1.

? What does `"Structure".substring(0, 6)` give?
- [x] Struct
- [ ] Structu
- [ ] tructu
> The characters with the indices 0 to 5. The end 6 is not included.

? A word has 7 characters. Which index does the last character have?
- [ ] 7
- [x] 6
- [ ] 8
> Just like with an array: always one less than the length.

? How do you compare two Strings for the same content in Java?
- [ ] a == b
- [x] a.equals(b)
- [ ] a = b

? Match each method to what it gives for `"Billygoat"`.
= length() -> 9
= charAt(0) -> B
= indexOf("goat") -> 5
= substring(5) -> goat
:::
