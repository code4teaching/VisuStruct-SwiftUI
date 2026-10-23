---
titel: Tables as CSV
bereich: Files
kurz: Read a table as a CSV file, split each line with split and calculate with the numbers.
---

## A table in a text file

Mrs Goat, the teacher at the castle school, has saved her class's grades as a table. As in Germany, 1 is the best grade and 6 the worst:

| Name | Maths | German | English |
|---|---|---|---|
| Ludwig | 2 | 3 | 1 |
| Zora | 1 | 2 | 2 |
| Fox | 4 | 3 | 5 |
| Hare | 2 | 1 | 3 |

In the file, the table looks like this:

::: datei class.csv
Name;Maths;German;English
Ludwig;2;3;1
Zora;1;2;2
Fox;4;3;5
Hare;2;1;3
:::

This is a **CSV file**. CSV stands for "Comma-Separated Values". Each line is a row of the table, and the columns are separated by a separator character. In English-speaking countries this is usually a comma, in Germany and many other countries a **semicolon** `;`, because the comma is already used in numbers like `2,5`. We use the semicolon.

- The first line is the **header**. It says what is in the columns.
- Every further line is a **record**, here one pupil.
- Excel, LibreOffice and Numbers open CSV files directly as a table.

## Splitting a line with split

You know `split(";")` from lesson 17. It splits a text at every semicolon and returns an array:

```
String line = "Zora;1;2;2";
String[] parts = line.split(";");
// parts[0] is "Zora", parts[1] is "1", parts[2] is "2", parts[3] is "2"
```

Afterwards the grades are still **text**. You can only calculate with them once you have turned them into a number with `Integer.parseInt`:

```
int maths = Integer.parseInt(parts[1]);
```

::: diagramm dt-csv.visustruct
Split a CSV line and read the maths grade as a number.
:::

## Reading the whole file

For the whole file, you combine the BufferedReader from lesson 24 with `split`. The header contains no grades, so you read it before the loop and skip it:

```
BufferedReader reader = new BufferedReader(new FileReader("class.csv"));
String line = reader.readLine();   // header
line = reader.readLine();          // first record
while (line != null) {
    String[] parts = line.split(";");
    System.out.println(parts[0] + ": Maths " + parts[1]);
    line = reader.readLine();
}
reader.close();
```

::: ludwig
Without the second `readLine()` before the loop, the header ends up in the loop. Then `Integer.parseInt("Maths")` tries to make a number out of the word, and Java stops with a `NumberFormatException`.
:::

## Exercise: Maths average

::: übung l25-java-schnitt
titel: Maths average
code: java
auftrag: Calculate the average maths grade. Skip the header, add up the maths grades (column 1) and divide by the number of records. Print **Maths average:** and the average.
start: l25-java-schnitt-start.visustruct
test: - -> Maths average: 2.25
braucht: whileSchleife
tipp: Create `double sum = 0;` and `int count = 0;` before the loop. With `double`, nothing is cut off when dividing.
tipp: In the loop: `String[] parts = line.split(";");`, then `sum = sum + Integer.parseInt(parts[1]);` and `count++;`.
lösung: l25-java-schnitt-loesung.visustruct
:::

## Exercise: Best grade in English

::: übung l25-java-beste
titel: Best grade in English
code: java
auftrag: Who has the best grade in English (column 3)? Print **Best grade in English:**, the name and the grade in brackets.
start: l25-java-beste-start.visustruct
test: - -> Best grade in English: Ludwig (1)
braucht: whileSchleife, verzweigung
tipp: Remember the best grade so far in `int bestGrade = 7;` and the name in `String bestName = "";`. Every real grade is better than 7.
tipp: If `grade < bestGrade`, remember the new grade and `parts[0]` as the name.
lösung: l25-java-beste-loesung.visustruct
:::

## Strengths and weaknesses of CSV

| Good | Tricky |
|---|---|
| Tables take up little space. | If the separator appears in the text, for example `Hare;very good; hard-working`, the line falls apart into too many parts. |
| Excel and other programs open the file directly. | Everything is a flat table. If an animal has several favourite foods, that doesn't fit well into one cell. |
| Every program can read it with `split`. | The file doesn't say whether `1` is a number or a text. |

::: ludwig
Excel saves CSV files with semicolons in Germany and with commas in England and the USA. That is why someone opening a file from another country sometimes sees everything in one single column.
:::

## Game: Broken line

::: spiel bombe
titel: Game: Broken line
intro: In every CSV file **exactly one line is broken**, and the bomb is ticking. Compare each line with the header and tap the broken line before time runs out. Five rounds, 20 seconds each.
zeit: 20
daten: csv

runde:
    Name;Maths;German;English
    Ludwig;2;3;1
    Zora;1
    Fox;4;3;5
frage: Every line needs four columns.
fehler: 3
besser: Zora;1;2;2
> Two grades are missing for Zora. Then there is no `parts[3]`, and Java stops with an `ArrayIndexOutOfBoundsException`.

runde:
    Name;Grade;Comment
    Ludwig;2;works well with others
    Hare;1;very good; hard-working
    Zora;1;reads a lot
frage: Every line needs three columns.
fehler: 3
besser: Hare;1;very good, hard-working
> The semicolon in the comment splits off a fourth column. The separator must not appear in the text.

runde:
    Name;Maths;German;English
    Ludwig;2;3;1
    Zora;1;2;2
    Fox,4,3,5
frage: The separator is a semicolon.
fehler: 4
besser: Fox;4;3;5
> Here there are commas instead of semicolons. `split(";")` finds no semicolon and returns the whole line as a single part.

runde:
    Name;Maths;German;English
    Hare;2;1;3
    Fox;four;3;5
    Ludwig;2;3;1
frage: Grades are numbers.
fehler: 3
besser: Fox;4;3;5
> `Integer.parseInt("four")` cannot make a number out of the word and throws a `NumberFormatException`.

runde:
    Name;Maths;German;English
    Zora;1;2;2
    Hare;2;1;3
    Ludwig;2;;1
frage: No field may be empty.
fehler: 4
besser: Ludwig;2;3;1
> There is nothing between the two semicolons. `Integer.parseInt("")` throws a `NumberFormatException`.
:::

## Checklist

::: checkliste
- I know how a CSV file is built: header, records, separator. → A table in a text file
- I can split a line with split and make a number out of it with Integer.parseInt. → Splitting a line with split
- I skip the header before calculating. → Reading the whole file
- I calculated the maths average. → Exercise: Maths average
- I found the best English grade. → Exercise: Best grade in English
- I know one strength and one weakness of CSV. → Strengths and weaknesses of CSV
:::

## Quiz

::: quiz
? What does "Hare;2;1;3".split(";")[2] return?
- [ ] "2"
- [x] "1"
- [ ] 1
> Counting starts at 0. And the result is a text, not a number.

? Why does the program call readLine() twice before the loop?
- [ ] So that the file is read faster.
- [x] The first line is the header without grades. It is skipped.
- [ ] Because readLine always needs two lines.

? What happens with Integer.parseInt("Maths")?
- [ ] It returns 0.
- [x] Java throws a NumberFormatException.
- [ ] It returns the length of the word.

? Match.
= header -> says what is in the columns
= record -> a line with values
= separator -> separates the columns, often ;
:::
