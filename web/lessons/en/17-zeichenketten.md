---
titel: Strings
bereich: Basics
kurz: Work with text: read single characters, cut out parts, search, compare and split.
---

## Skills I will gain now

::: kompetenzen
- explain that the characters of a String are also counted from 0
- work with `length()` and `charAt(i)`
- cut a part out of a text with `substring`
- use `indexOf`, `contains`, `toUpperCase` and `equals`
- go through a text character by character with a loop
- split a text into a String array with `split`
- read a text in Java and compare it with `equals`
- use more methods such as `lastIndexOf`, `replace`, `compareTo` and `Integer.parseInt`
- split a text from a file into lines with `split("\n")`
- look up a method in the Java API and read its description
:::

## Text is a row of characters

You already know `String`: `String name = "Ludwig"`. In computer science such a text is called a **string**, because the characters hang one after another like beads on a string. Every character has a place with an index, just like in an array. Here, too, **counting starts at 0**: the first character is 0 steps away from the start.

::: grafik zk-zeichen.svg
The nine characters of “Billygoat” with their indices 0 to 8.
:::

A String comes with **methods**. You write the name of the variable, a dot and the method:

- `word.length()` gives the number of characters, here 9.
- `word.charAt(0)` gives the character with the index 0, here `'B'`.

> With Strings you write `length()` **with** brackets, with arrays `length` **without**. Sadly, that is just how Java is.

Just like in an array, the last character has the index `length() - 1`.

## A single character: char

Java has its own data type for a single character: **char**, short for *character*. A `char` goes in **single** quotation marks, a String in double ones:

- `'C'` is a `char`: exactly one character.
- `"C"` is a String: a text that is only one character long.
- A `char` always holds exactly one character. There is no empty `char` like `''`, but there is an empty String `""`.

`charAt` gives you such a character from a text:

```
char first = word.charAt(0)
char last = word.charAt(word.length() - 1)
```

You compare two `char` values with `==`: `word.charAt(0) == 'B'` is `true`.

Behind every character there is a number, its **character code**. Which number belongs to which character is listed in the ASCII table: `'A'` has the code 65, `'B'` 66, `'C'` 67 and so on up to `'Z'` with 90. With `(int)` you get the code of a character, with `(char)` a code turns back into a character:

```
int code = (int) 'C'
code = code + 1
char next = (char) code
```

After that `code` is 68 and `next` is `'D'`. This is how you shift a letter in the alphabet, and that is exactly what you will need later for the Caesar cipher.

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

## Now in Java

The methods in this lesson already are Java. A whole program with a text looks like this:

```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("What is your name?");
String name = scanner.next();
System.out.println("Hello " + name.toUpperCase() + "!");
System.out.println("Your name has " + name.length() + " letters.");
```

- `scanner.next()` reads one word, that is text up to the next space. For numbers you keep using `scanner.nextInt()`.
- Text goes in **double** quotes `"Ludwig"`, a single character in **single** quotes `'L'`.
- `length()`, `toUpperCase()` and the other methods always have round brackets after them, even when nothing is inside.
- You compare two texts with `equals`. Every letter counts: `"Ludwig".equals("ludwig")` is false.

::: übung l17-java-passwort
titel: Check the password
code: java
auftrag: Write a Java program that asks for the password. If it is **Ludwig**, it outputs **Welcome!**, otherwise **Wrong password**.
  Mind upper and lower case: `ludwig` is wrong.
test: Ludwig -> Welcome!
test: ludwig -> Wrong password
test: Geißbock -> Wrong password
braucht: verzweigung
tipp: Read the password with `scanner.next()` into a String variable. Then compare it in a selection.
tipp: The condition is `input.equals("Ludwig")`. In Java, `==` does not reliably compare texts.
lösung: l17-java-passwort-loesung.visustruct
:::

## Fill in the gaps: texts

::: lückentext
titel: Examining a word
auftrag: Fill in the missing methods and words.
```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("A word?");
[[String]] word = scanner.next();
System.out.println("Length: " + word.[[length]]());
System.out.println("Capitals: " + word.[[toUpperCase]]());
System.out.println("First letter: " + word.[[charAt]](0));
if (word.[[equals]]("Ludwig")) {
    System.out.println("Hello Ludwig!");
}
```
erklärung: `length()` counts the characters, `toUpperCase()` makes everything upper case, `charAt(0)` gives the first character. You compare texts with `equals`, not with `==`.
:::

## Find the bug: initials

::: übung l17-java-fehler
titel: Fix the initials
code: java
auftrag: The program reads a first name and a last name and should output the initials. For Ludwig Geißbock that is **L. G.** But it outputs **u. e.**
  “Open in editor” shows the code in the Programming area. Find the bug, fix it and click Check.
start: l17-java-fehler-start.visustruct
test: Ludwig, Geißbock -> L. G.
test: Mia, Meyer -> M. M.
test: Ada, Lovelace -> A. L.
braucht: anweisung
tipp: At which index does Java start counting?
tipp: The first character has the index 0: `first.charAt(0)` and `last.charAt(0)`.
lösung: l17-java-fehler-loesung.visustruct
:::

## Even more methods

A String can do much more. You will often need these methods too:

| Method | Meaning | Example | Result |
|---|---|---|---|
| `lastIndexOf("l")` | Where is the last l? | `"Billygoat".lastIndexOf("l")` | 3 |
| `isEmpty()` | Is the text empty? | `"".isEmpty()` | true |
| `equalsIgnoreCase(…)` | same text, whether upper or lower case? | `"Billygoat".equalsIgnoreCase("BILLYGOAT")` | true |
| `replace(old, new)` | replaces every occurrence | `"Billygoat".replace("Billy", "Nanny")` | Nannygoat |
| `repeat(n)` | the text n times in a row | `"Baa".repeat(3)` | BaaBaaBaa |
| `concat(…)` | adds text to the end, like `+` | `"Billy".concat("goat")` | Billygoat |
| `compareTo(…)` | Which comes first in the alphabet? | `"Anna".compareTo("Ben")` | -1 |

`compareTo` returns a number: **negative** if the text comes earlier in the alphabet, **0** if both are the same, and **positive** if it comes later. You can use it to sort names.

Two methods do not belong to a text but to a class. That is why the class name comes first:

- `Integer.parseInt("7")` turns the text "7" into the number 7. You can calculate with it.
- `String.valueOf(7)` turns the number 7 into the text "7".

::: diagramm zk-mehr.visustruct
All the new methods in one example. Go through it in the simulation and compare every output with the table.
:::

## Text from a file

Programs often get their text from a **file**. Princess Zora has written Ludwig a letter. It is ready as the file `letter.txt`:

::: datei letter.txt
Dear Ludwig,
the fox has locked me in his tower.
The door has a lock with a secret word.
You can only find the word with Java.
Please help me!
Yours, Princess Zora
:::

These lines read the whole file into a String:

```
import java.nio.file.*;

String letter = Files.readString(Path.of("letter.txt"));
```

You will learn exactly how reading works later, in a lesson of its own about files. For now this is enough: afterwards the whole letter is in `letter`, with all its lines.

At the end of every line there is an invisible character for the **line break**. In Java you write it as `"\n"`. So `letter.split("\n")` splits the letter into its lines.

::: übung l17-java-brief
titel: Where is the fox?
code: java
auftrag: The start code already reads the letter. Split it into lines and output **Lines:** and the number of lines. Then find the line that contains **fox** and output **Fox in line** and its number. The first line has the number 1.
start: l17-java-brief-start.visustruct
test: - -> Lines: 6 | Fox in line 2
braucht: forSchleife, verzweigung
tipp: `String[] lines = letter.split("\n");` splits the letter. Then a for loop goes through all the lines.
tipp: In the loop you check `lines[i].contains("fox")`. The index starts at 0, so you output `(i + 1)`. You need the brackets so that Java calculates instead of adding 1 to the text.
lösung: l17-java-brief-loesung.visustruct
:::

## The Java API

Nobody knows all methods by heart, not even professionals. They look them up in the **Java API**. API stands for Application Programming Interface. It means the description of everything Java already brings along.

You can find all methods of String here: [String in the Java API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html)

Scroll down to the table **Method Summary**. Each row describes one method:

| Column | Example | Meaning |
|---|---|---|
| Modifier and Type | `int` | What the method returns |
| Method | `lastIndexOf(String str)` | Name and parameters with their data type |
| Description | Returns the index within this string of the last occurrence … | What the method does |

::: ludwig
The page is very long. Press Ctrl+F (on a Mac ⌘+F) and search for the name of the method to get there at once.
:::

Look up these methods. They are not in this lesson:

::: quiz
? Look up `strip()`. What does the method do?
- [ ] It removes all spaces in the text.
- [x] It removes the spaces at the beginning and the end.
- [ ] It cuts off the last character.
> Like `trim()`. But `strip()` also knows special spaces from other writing systems.

? Look up `isBlank()`. What does `"   ".isBlank()` return?
- [x] true
- [ ] false
- [ ] 3
> isBlank checks whether the text is empty or only contains spaces. `"   ".isEmpty()`, on the other hand, would be false.

? Look up `toCharArray()`. Which data type does the method return?
- [ ] String
- [ ] String[]
- [x] char[]
> An array with all characters of the text, one element for each character.

? Look up `indexOf` with two parameters. What does `"Billygoat".indexOf("l", 3)` return?
- [ ] 2
- [x] 3
- [ ] -1
> The search only starts at index 3. The first l from there is at index 3.

? Look up `startsWith`. Which data type does the method return?
- [x] boolean
- [ ] int
- [ ] String
> The column “Modifier and Type” says boolean: the answer is true or false.
:::

## Game: Rescue the princess

Now you help Ludwig. The fox has locked Princess Zora in his tower, and the gate only opens with a secret word.

::: spiel prinzessin
titel: Game: Rescue the princess
intro: On the way to the tower Ludwig comes to **six stations**. Each one has a piece of Java code, and a number comes out. `alphabet.charAt(number)` turns the number into a letter that goes into the **crossword**. Solve the crossword, and the yellow squares spell the secret word for the gate.

station: At the moat
    String name = "   Zora   ";
    int number = name.trim().length();
frage: Which number is in `number`?
zahl: 4
feld: 5 1
tipp: `trim()` cuts off the spaces at the front and the back. Then count the characters.
> After `trim()` only `"Zora"` is left, and that is 4 characters.

station: In the fox forest
    String place = "Fox lair";
    int number = place.length();
frage: Which number is in `number`?
zahl: 8
feld: 4 4
tipp: `length()` counts every character, the space too.
> F-o-x, the space and l-a-i-r make 8 characters.

station: At the goat rock
    String text = "Ludwig the goat";
    int number = text.indexOf(" ");
frage: Which number is in `number`?
zahl: 6
feld: 4 6
tipp: `indexOf` returns the position of the first space. The L has index 0.
> L u d w i g has the indexes 0 to 5, so the first space is at index 6.

station: On the tower stairs
    String word = "Princess";
    int number = word.indexOf("s", 7);
frage: Which number is in `number`? Look up `indexOf(String str, int fromIndex)` in the Java API.
zahl: 7
feld: 6 6
tipp: The search starts at index 7, and index 7 itself counts. Write the indexes under the letters.
> P r i n c e s s has the indexes 0 to 7. Searching from index 7, the first “s” is right at 7.

station: In front of the fox den
    int number = "Zora".compareTo("Zoe");
frage: Which number is in `number`?
zahl: 13
feld: 1 9
tipp: `compareTo` looks for the first position where the texts differ and subtracts the character codes. `'r'` is 114, `'e'` is 101.
> “Zo” is the same, then `'r'` meets `'e'`: 114 − 101 = 13.

station: At the tower gate
    int number = Integer.parseInt("1" + "1") / 5;
frage: Which number is in `number`?
zahl: 2
feld: 6 5
tipp: First the texts are joined, then they become a number. With `int`, division drops the remainder.
> `"1" + "1"` is `"11"`, `parseInt` makes 11 of it, and 11 / 5 is 2 for whole numbers.

kreuzwort: You already have the blue letters. Fill the other squares with Java terms. Click a clue to jump to its word.
- → 1 3 BOOLEAN: Data type for true or false
- → 4 1 STRING: Data type for text
- → 6 5 CHAR: Data type for a single character
- ↓ 1 6 LENGTH: Method that counts the characters of a string
- ↓ 2 1 ELSE: The “otherwise” part of a branch
- ↓ 3 3 BREAK: Jumps straight out of a loop
lösung: 1 3, 4 3, 2 6, 6 7, 7 3

tor: Ludwig stands in front of the gate. The lock compares your word with `equals`. Enter the secret word.
    String word = "___";
    if (word.equals(secretWord)) {
        gate.open();
    }
ende: Zora is free, and the fox has run off. The secret word was `BREAK`: with `break` you get out of any loop, and Zora gets out of the tower.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain that the characters of a String are also counted from 0. → Text is a row of characters
- I can work with `length()` and `charAt(i)`. → Text is a row of characters
- I can cut a part out of a text with `substring`. → Cut out parts
- I can use `indexOf`, `contains`, `toUpperCase` and `equals`. → Search and compare
- I can go through a text character by character with a loop. → Character by character
- I can split a text into a String array with `split`. → Split with split
- I can read a text in Java and compare it with `equals`. → Now in Java
- I can use more methods such as `lastIndexOf`, `replace`, `compareTo` and `Integer.parseInt`. → Even more methods
- I can split a text from a file into lines with `split("\n")`. → Text from a file
- I can look up a method in the Java API and read its description. → The Java API
:::

## Quiz

::: quiz
? What does `"Ludwig".charAt(1)` give?
→ Text is a row of characters
- [ ] L
- [x] u
- [ ] d
> Counting starts at 0: L has the index 0, u the index 1.

? What does `"Structure".substring(0, 6)` give?
→ Cut out parts
- [x] Struct
- [ ] Structu
- [ ] tructu
> The characters with the indices 0 to 5. The end 6 is not included.

? A word has 7 characters. Which index does the last character have?
→ Text is a row of characters
- [ ] 7
- [x] 6
- [ ] 8
> Just like with an array: always one less than the length.

? How do you compare two Strings for the same content in Java?
→ Search and compare
- [ ] a == b
- [x] a.equals(b)
- [ ] a = b

? Match each method to what it gives for `"Billygoat"`.
→ Search and compare
= length() -> 9
= charAt(0) -> B
= indexOf("goat") -> 5
= substring(5) -> goat

? Which condition checks in Java whether `input` contains the text Ludwig?
→ Now in Java
- [ ] input = "Ludwig"
- [ ] input == 'Ludwig'
- [x] input.equals("Ludwig")
> You compare texts with equals. Single quotes are only for a single character.

? What does `Integer.parseInt("12") + 1` return?
→ Even more methods
- [ ] "121"
- [x] 13
- [ ] an error message
> parseInt turns the text into a number. After that Java calculates as usual.
:::
