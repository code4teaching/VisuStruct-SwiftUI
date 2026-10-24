---
titel: Line by line with BufferedReader
bereich: Files
kurz: Read with BufferedReader and readLine until null comes, and read a whole file at once with Files.
---

## The cake is gone!

The morning after the party, Ludwig's cake has disappeared. Luckily the castle keeps a logbook. Every line starts with the day and the time:

::: datei logbook.txt
Mo 08:15 Ludwig feeds the goats
Mo 12:30 Zora reads in the tower
Mo 18:00 Fox sneaks past the gate
Tu 09:00 Ludwig bakes a cake
Tu 14:45 Hare brings carrots
Tu 16:20 Fox asks for the recipe
Tu 23:55 The cake is gone
We 07:00 Zora finds crumbs at Fox's den
:::

You could already read it with the Scanner from lesson 23. For files, though, professionals often use the **BufferedReader**.

## Reading with BufferedReader

```
import java.io.*;

BufferedReader reader = new BufferedReader(new FileReader("logbook.txt"));
String line = reader.readLine();
while (line != null) {
    System.out.println(line);
    line = reader.readLine();
}
reader.close();
```

- `new FileReader("logbook.txt")` opens the file, and `new BufferedReader(…)` puts a buffer around it. It fetches the file in large chunks and is therefore faster for long files.
- `readLine()` returns the next line. When there are no more lines, it returns **null**.
- That is why the loop runs as long as `line != null`. At the end of each pass it reads the next line.

::: diagramm dt-buffered.visustruct
First read a line, then check, then read the next one at the end of the pass.
:::

**null** means "nothing at all". It is not the empty text `""`, but no text. A variable holding `null` has no methods: `line.length()` then stops with a `NullPointerException`. So always check `line != null` first.

| | Scanner | BufferedReader |
|---|---|---|
| Create | `new Scanner(new File(…))` | `new BufferedReader(new FileReader(…))` |
| Is there another line? | `hasNextLine()` | `readLine()` returns `null` |
| Next line | `nextLine()` | `readLine()` |
| Strength | can also read numbers (`nextInt()`) | fast, even with large files |

::: ludwig
The loop looks different from the Scanner one: the first line is read **before** the loop, every further one **at the end** of the pass. If you forget the read at the end, the program reads the same line again and again and never stops.
:::

::: angeberwissen
Where a line ends is not the same everywhere: Windows writes two invisible characters, “carriage return” and “line feed”, Linux and macOS only the line feed. The names come from the typewriter, where the carriage moved back and the paper moved up one line. `readLine()` copes with both.
:::

## Exercise: How often does the fox appear?

::: übung l24-java-fuchs
titel: How often does the fox appear?
code: java
auftrag: Read the logbook with the BufferedReader and count the lines that contain **Fox**. At the end, print **Fox:** and the count.
start: l24-java-fuchs-start.visustruct
test: - -> Fox: 3
braucht: whileSchleife, verzweigung
tipp: Create `int count = 0;` before the loop. In the loop, check `line.contains("Fox")`.
tipp: The `line = reader.readLine();` belongs at the end of the loop, after the if.
lösung: l24-java-fuchs-loesung.visustruct
:::

## Closing automatically

So that `close()` isn't forgotten even after an exception, there is a short form of try: whatever is created in the round brackets after `try` is closed by Java on its own at the end.

```
try (BufferedReader reader = new BufferedReader(new FileReader("logbook.txt"))) {
    String line = reader.readLine();
    while (line != null) {
        System.out.println(line);
        line = reader.readLine();
    }
} catch (IOException e) {
    System.out.println("The logbook is missing.");
}
```

This is called **try-with-resources**. `IOException` catches all errors while reading and writing, including a missing file.

> Like try and catch, try-with-resources only runs with real Java (lesson 22). In the simulation, you write `close()` yourself.

## The shortcut: Files

Since Java 11 it is even shorter. `Files.readString` reads the whole file at once, as you know from lesson 17. With `split("\n")` you split the text into an array of lines:

```
import java.nio.file.*;

String text = Files.readString(Path.of("logbook.txt"));
String[] lines = text.split("\n");
for (int i = 0; i < lines.length; i++) {
    System.out.println(lines[i]);
}
```

Now all lines are in the array. You can look at them in any order, for example backwards or only every second one.

| Way | Good for |
|---|---|
| `Scanner` | small files, reading numbers and words |
| `BufferedReader` | large files, line by line |
| `Files.readString` | small files that fit into the program as a whole |

::: ludwig
A file with a million lines is better read line by line with the BufferedReader. With `Files.readString` the whole file would have to go into memory at once.
:::

## Exercise: The longest entry

::: übung l24-java-laengster
titel: The longest entry
code: java
auftrag: In the start code, the lines of the logbook are already in the array `lines`. Find the longest line and print it like this: **Longest entry:** followed by the line.
start: l24-java-laengster-start.visustruct
test: - -> Longest entry: We 07:00 Zora finds crumbs at Fox's den
braucht: forSchleife, verzweigung
tipp: Remember the longest line so far in `String longest = lines[0];` and go through the other lines with a for loop.
tipp: If `lines[i].length() > longest.length()`, then `lines[i]` becomes the new longest.
lösung: l24-java-laengster-loesung.visustruct
:::

## Game: File detective

::: spiel frage
titel: Game: File detective
intro: Who took the cake? Each program searches the **logbook** from the top. Predict what it prints and collect the clues. Five rounds.
frage: What does the program print?

runde:
    String line = reader.readLine();
    line = reader.readLine();
    System.out.println(line.substring(9));
- Ludwig feeds the goats
- [x] Zora reads in the tower
- Mo 12:30 Zora reads in the tower
> The second `readLine()` returns the second line. The text after the time starts at index 9.

runde:
    int n = 0;
    String line = reader.readLine();
    while (line != null) {
        if (line.startsWith("Tu")) n++;
        line = reader.readLine();
    }
    System.out.println(n);
- 3
- [x] 4
- 8
> Four entries are from Tuesday.

runde:
    String line = reader.readLine();
    while (line != null) {
        if (line.contains("cake")) {
            System.out.println(line.substring(3, 8));
        }
        line = reader.readLine();
    }
- [x] 09:00\n23:55
- 09:00
- Tu\nTu
> Two lines contain "cake". `substring(3, 8)` cuts out the time.

runde:
    String line = reader.readLine();
    String last = "";
    while (line != null) {
        if (line.contains("Fox")) last = line;
        line = reader.readLine();
    }
    System.out.println(last);
- Tu 16:20 Fox asks for the recipe
- [x] We 07:00 Zora finds crumbs at Fox's den
- Mo 18:00 Fox sneaks past the gate
> `last` is overwritten at every match. At the end it holds the last match. "Fox's den" contains "Fox" too.

runde:
    String line = reader.readLine();
    while (line != null) {
        if (line.contains("crumbs")) {
            int at = line.indexOf("at ");
            System.out.println(line.substring(at + 3));
        }
        line = reader.readLine();
    }
- [x] Fox's den
- at Fox's den
- crumbs
> The crumbs are at Fox's den. The fox asked for the recipe, and at 23:55 the cake was gone. Case solved!
:::

## Checklist

::: checkliste
- I can read a file with BufferedReader and readLine. → Reading with BufferedReader
- I know that readLine returns null at the end, and I check line != null. → Reading with BufferedReader
- I counted how often the fox appears in the logbook. → Exercise: How often does the fox appear?
- I can read a whole file with Files.readString and split it into lines with split. → The shortcut: Files
- I found the longest entry. → Exercise: The longest entry
:::

## Quiz

::: quiz
? What does readLine() return when the file has ended?
- [ ] ""
- [x] null
- [ ] -1
> null means: there is no more text.

? Why is there another line = reader.readLine() at the end of the loop?
- [ ] So that the file is closed.
- [x] Otherwise line never changes and the loop never stops.
- [ ] So that the first line is printed twice.

? What does try-with-resources do?
- [ ] It reads the file faster.
- [x] It closes the file on its own at the end.
- [ ] It prevents every exception.

? Match each way to what it is good for.
= BufferedReader -> large files, line by line
= Files.readString -> small files all at once
= Scanner -> reading numbers and words
:::
