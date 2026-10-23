---
titel: Reading and saving text
bereich: Files
kurz: Read a text file line by line with Scanner and save a file with PrintWriter.
---

## Why files?

Everything stored in variables is gone as soon as the program ends. If a program should remember something, for example a game score, a list or grades, it saves the data in a **file**. The next time it starts, it reads the file again.

Zora is free, and Ludwig is planning a party. His shopping list is ready in the file `shopping.txt`:

::: datei shopping.txt
Hay
Apples
Carrots
Dandelions
:::

A file ending in `.txt` contains only text, line by line. You can open it with any editor, for example Notepad on Windows or TextEdit on a Mac.

## Reading a file with Scanner

You already know the `Scanner`: `new Scanner(System.in)` reads from the keyboard. If you give it a file instead of `System.in`, it reads from the file:

```
import java.io.*;
import java.util.Scanner;

Scanner file = new Scanner(new File("shopping.txt"));
while (file.hasNextLine()) {
    String line = file.nextLine();
    System.out.println(line);
}
file.close();
```

| Method | Meaning |
|---|---|
| `new File("shopping.txt")` | the file with this name |
| `hasNextLine()` | Is there another line? `true` or `false` |
| `nextLine()` | returns the next line and moves on by one line |
| `close()` | closes the file when you are done |

The loop runs as long as there is another line. In each pass, `nextLine()` fetches the next line. `File` belongs to the package `java.io`, so you need `import java.io.*;`.

::: diagramm dt-lesen.visustruct
This is what reading looks like in a structure chart. Try it in the simulation.
:::

::: ludwig
Imagine the Scanner as a finger pointing at a line. `nextLine()` reads the line under the finger and moves the finger down one line. Once the finger is below the last line, `hasNextLine()` returns `false`.
:::

## What if the file is missing?

If the file does not exist, Java cannot read it and throws a `FileNotFoundException`. Java insists that your program is prepared for this. Either you catch it with try and catch, as in lesson 22:

```
try {
    Scanner file = new Scanner(new File("shopping.txt"));
    // ... read ...
    file.close();
} catch (FileNotFoundException e) {
    System.out.println("The file shopping.txt is missing!");
}
```

Or you write `throws Exception` after `main`. It means: "This method may throw an exception, I won't deal with it." Then the program stops if the file is missing.

```
public static void main(String[] args) throws Exception {
```

> VisuStruct adds `throws Exception` after `main` automatically as soon as your program works with files. In the simulation, VisuStruct reports a missing file with "There is no file called …".

## Exercise: Numbering the shopping list

::: übung l23-java-nummern
titel: Numbering the shopping list
code: java
auftrag: Read `shopping.txt` line by line and print each line with its number: **1. Hay**, **2. Apples** and so on.
start: l23-java-nummern-start.visustruct
test: - -> 1. Hay | 2. Apples | 3. Carrots | 4. Dandelions
braucht: whileSchleife
tipp: Create `int number = 1;` before the loop and increase the number at the end of each pass.
tipp: The output is `System.out.println(number + ". " + line);`
lösung: l23-java-nummern-loesung.visustruct
:::

## Writing to a file with PrintWriter

For writing there is the `PrintWriter`. Its methods have the same names as those of `System.out`:

```
PrintWriter out = new PrintWriter("greeting.txt");
out.println("Hello Zora!");
out.println("See you tomorrow, Ludwig");
out.close();
```

Afterwards `greeting.txt` contains:

```
Hello Zora!
See you tomorrow, Ludwig
```

- `println` writes the text and then starts a new line, `print` writes without a new line.
- If the file already exists, it is **overwritten**. The old content is gone.
- After the run, VisuStruct shows below the output what was saved in the file.

::: ludwig
Don't forget `close()`! The PrintWriter first collects the text in a buffer and only writes it to the file when it is closed. Without `close()` the file stays empty. I once lost a whole story that way.
:::

## Exercise: Adding to the shopping list

::: übung l23-java-ergaenzen
titel: Adding to the shopping list
code: java
auftrag: Ludwig still needs cake. Read `shopping.txt` and write each line to the new file `shopping-new.txt`. Then add **Cake** as the last line. At the end, print how many lines were saved: **5 lines saved**.
start: l23-java-ergaenzen-start.visustruct
test: - -> 5 lines saved
datei: shopping-new.txt -> Hay | Apples | Carrots | Dandelions | Cake
braucht: whileSchleife
tipp: In the loop, read a line with `file.nextLine()` and write it straight out again with `out.println(line)`.
tipp: After the loop comes `out.println("Cake");`. Close both files with `close()`, otherwise `shopping-new.txt` stays empty.
lösung: l23-java-ergaenzen-loesung.visustruct
:::

## Game: What is in the file?

::: spiel frage
titel: Game: What is in the file?
intro: Ludwig writes files with the PrintWriter. Read the code and predict what is in the file afterwards. Six rounds.
frage: What is in the file afterwards?

runde:
    PrintWriter out = new PrintWriter("greeting.txt");
    out.println("Hello");
    out.println("Zora");
    out.close();
- [x] Hello\nZora
- HelloZora
- Zora
> `println` starts a new line after each text.

runde:
    PrintWriter out = new PrintWriter("word.txt");
    out.print("He");
    out.print("llo");
    out.println("!");
    out.close();
- He\nllo\n!
- [x] Hello!
- He llo !
> `print` carries on without a new line, so the parts are joined directly.

runde:
    PrintWriter out = new PrintWriter("secret.txt");
    out.println("The treasure is in the tower");
- The treasure is in the tower
- [x] Nothing, the file stays empty.
- Java reports an error.
> Without `close()` the text never reaches the file. It stays in the buffer.

runde:
    // Before, note.txt contains: Old
    PrintWriter out = new PrintWriter("note.txt");
    out.println("New");
    out.close();
- Old\nNew
- [x] New
- New\nOld
> A new PrintWriter overwrites the file. The old content is gone.

runde:
    PrintWriter out = new PrintWriter("numbers.txt");
    for (int i = 1; i <= 3; i++) {
        out.println(i * 2);
    }
    out.close();
- 1\n2\n3
- 246
- [x] 2\n4\n6
> The loop writes 2, 4 and 6, each number on its own line.

runde:
    // shopping.txt contains: Hay, Apples (one per line)
    Scanner file = new Scanner(new File("shopping.txt"));
    PrintWriter out = new PrintWriter("big.txt");
    while (file.hasNextLine()) {
        out.println(file.nextLine().toUpperCase());
    }
    file.close();
    out.close();
- Hay\nApples
- [x] HAY\nAPPLES
- HAYAPPLES
> Each line is read, turned into capital letters and written on its own line.
:::

## Checklist

::: checkliste
- I know why programs save data in files. → Why files?
- I can read a text file line by line with Scanner, hasNextLine and nextLine. → Reading a file with Scanner
- I know why Java requires try and catch or throws for files. → What if the file is missing?
- I can write a file with PrintWriter and don't forget close(). → Writing to a file with PrintWriter
- My shopping list is numbered and complete. → Exercise: Adding to the shopping list
:::

## Quiz

::: quiz
? What does hasNextLine() return?
- [ ] the next line
- [x] true if there is another line, otherwise false
- [ ] the number of lines
> With hasNextLine() the loop checks whether to carry on.

? What happens if you call new PrintWriter("list.txt") for a file that already exists?
- [ ] The new text is added at the end.
- [x] The file is overwritten.
- [ ] Java reports an error.

? Why does a file stay empty even though println was called?
- [ ] Because println only writes to the console.
- [x] Because close() is missing.
- [ ] Because the file name ends in .txt.
> Only close() writes the buffer into the file.

? Match each method to its job.
= nextLine() -> reads the next line
= println(text) -> writes a line
= close() -> closes the file
:::
