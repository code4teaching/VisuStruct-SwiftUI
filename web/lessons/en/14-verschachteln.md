---
titel: Nesting
bereich: Basics
kurz: Combine branches inside loops and loops inside loops.
---

## Skills I will gain now

::: kompetenzen
- put a branch inside a loop
- put a loop inside another loop
- explain that the inner loop runs all the way through in every pass of the outer one
- write nested loops and branches in Java
:::

## Building blocks inside each other

You now know all the important building blocks: sequence, branch, switch and three kinds of loops. They only get really powerful together.

Every path and every loop body is a sequence itself. You may put any element there, including more branches and loops. This is called **nesting**.

> To do this, simply drag an element onto the placeholder ø inside a loop or a path.

## A branch inside a loop

The loop goes through all the numbers, and the branch decides for each single number whether something happens. That way you can count, for example, how many even numbers there are from 1 to n.

::: diagramm l13-gerade-zaehlen.visustruct
In every pass the branch checks with i % 2 == 0 whether i is even. Only then is count increased by 1. The false path stays empty.
:::

With n = 7 these are the numbers 2, 4 and 6, so 3 is output.

## Exercise: Count even inputs

::: übung l13-gerade-eingaben
titel: Count even inputs
auftrag: Ask for exactly **five** whole numbers, one after another. Then output how many of them were even.
test: 1, 2, 3, 4, 5 -> 2
test: 2, 4, 6, 8, 10 -> 5
test: 1, 3, 5, 7, 9 -> 0
test: 10, 11, 0, 7, 8 -> 3
braucht: forSchleife, verzweigung
tipp: Doing the same thing five times means: loop. In every pass a number is read in and checked.
tipp: A for loop from 1 to 5. Inside, first comes the input `input: int number "Enter a number"`, below it a branch with `number % 2 == 0`. In the true path you increase `count` by 1.
lösung: l13-gerade-eingaben-loesung.visustruct
:::

## A loop inside a loop

If one loop sits inside another, the **inner loop runs all the way through in every pass of the outer one**. With this you can build patterns of rows and columns.

::: diagramm l13-dreieck.visustruct
The outer loop counts the lines. The inner one adds as many stars to the text as the line number says. With n = 3 you get a triangle of 1, 2 and 3 stars.
:::

With `String text = ""` every line starts empty. `text = text + "*"` adds a star. Only when the line is finished is it output.

## Exercise: Rectangle

::: übung l13-rechteck
titel: Rectangle
auftrag: Ask for a width and a height. Output a rectangle made of `#`: as many lines as the height, and in each line as many `#` as the width.
test: 3, 2 -> ### | ###
test: 1, 3 -> # | # | #
test: 4, 1 -> ####
test: 2, 2 -> ## | ##
braucht: forSchleife
tipp: You need two loops inside each other: one for the lines and inside it one for the characters of a line.
tipp: Build it like the triangle. The difference: the inner loop always counts up to `width`, not up to the line number. The outer loop counts up to `height`.
lösung: l13-rechteck-loesung.visustruct
:::

## Keep track

With nested diagrams, the drawing helps you: whatever is further inside is indented and surrounded by its loop or path.

- Read from the outside in: what repeats? What is decided in every pass?
- Give counter variables meaningful names such as `line` and `column`. Two loops must not change the same counter variable.
- Go through an example in the simulation with **Step** and watch the variables.

::: angeberwissen
This is exactly what the structure chart was invented for. Shneiderman asked himself: if we are supposed to do without GOTO, why not do without the arrows in the flowchart as well? The result: no arrow spaghetti, and every block stays nicely in its pen.
:::

## Now in Java

Counting the even numbers looks like this in Java:

```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Up to which number?");
int n = scanner.nextInt();
int count = 0;
for (int i = 1; i <= n; i++) {
    if (i % 2 == 0) {
        count++;
    } // end if
} // end for
System.out.println(count);
```

What is nested in the structure chart is nested in curly brackets in Java. Every level is indented four spaces further. If your code gets messy, the **Indent** button at the top of the Programming area helps.

With many closing brackets `}` it is easy to lose track: which bracket belongs to which block? A comment after it tells you, for example `} // end if` and `} // end for`. This also helps when you carry on later.

`count++` is short for `count = count + 1`.

::: übung l14-java-treppe
titel: Stairs of stars
code: java
auftrag: Write a Java program that reads the number of steps and outputs stairs made of stars. For 3 steps that is `*`, `**` and `***`, each step on its own line.
test: 3 -> * | ** | ***
test: 1 -> *
test: 4 -> * | ** | *** | ****
braucht: forSchleife
tipp: An outer loop counts the steps. In each step an inner loop builds a text of stars.
tipp: In the outer loop: `String line = "";`, then `for (int j = 1; j <= i; j++) { line = line + "*"; }` and after that `System.out.println(line);`.
lösung: l14-java-treppe-loesung.visustruct
:::

## Fill in the gaps: nesting

::: lückentext
titel: Rectangle of stars
auftrag: The program outputs a rectangle of 3 lines with 4 stars each. Fill in the missing words and symbols.
```java
for (int line = 1; line <= 3; line++) {
    String text = [[""]];
    [[for]] (int column = 1; column [[<=]] 4; [[column++ | column += 1 | column = column + 1]]) {
        text = text [[+]] "*";
    }
    System.out.[[println]](text);
[[}]]
```
erklärung: The inner loop builds one line of 4 stars, the outer loop repeats that three times. Each line starts with an empty text `""`. The last bracket closes the outer loop.
:::

## Find the bug: divisible by 3

::: übung l14-java-fehler
titel: Fix the counting
code: java
auftrag: The program should count how many numbers from 1 to `n` are divisible by 3 and output the result **once**. For 10 that is just **Count: 3**. But it outputs far too many lines.
  “Open in editor” shows the code in the Programming area. Find the bug, fix it and click Check.
start: l14-java-fehler-start.visustruct
test: 10 -> Count: 3
test: 3 -> Count: 1
test: 2 -> Count: 0
braucht: forSchleife, verzweigung
tipp: Look at the curly brackets: is the output inside the loop or after it?
tipp: Move the line `System.out.println("Count: " + count);` after the closing bracket of the loop.
lösung: l14-java-fehler-loesung.visustruct
:::

## Game: Inside and outside

::: spiel frage
titel: Game: Inside and outside
intro: Ludwig has put building blocks inside each other. Read from the outside in and predict what happens. Six rounds.

runde:
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 2; j++) {
            System.out.println("*");
        }
    }
frage: How many stars are output?
- 3
- 5
- [x] 6
> The inner loop runs completely in each of the 3 runs of the outer loop: 3 · 2 = 6.

runde:
    for (int i = 1; i <= 2; i++) {
        for (int j = 1; j <= 3; j++) {
            System.out.println(i + " " + j);
        }
    }
frage: Which line is output fourth?
- 1 4
- [x] 2 1
- 2 2
> First j runs through for i = 1: 1 1, 1 2, 1 3. Then j starts again at 1, now with i = 2.

runde:
    int count = 0;
    for (int i = 1; i <= 10; i++) {
        if (i % 3 == 0) {
            count++;
        }
    }
    System.out.println(count);
frage: What is output?
- [x] 3
- 10
- 4
> The branch only counts 3, 6 and 9.

runde:
    for (int i = 1; i <= 4; i++) {
        if (i % 2 == 0) {
            System.out.println("even");
        } else {
            System.out.println(i);
        }
    }
frage: What is output?
- 1\n2\n3\n4
- [x] 1\neven\n3\neven
- even\neven
> For every number the branch decides again: odd numbers themselves, even ones as a word.

runde:
    for (int i = 1; i <= 3; i++) {
        String line = "";
        for (int j = 1; j <= i; j++) {
            line = line + "*";
        }
        System.out.println(line);
    }
frage: What is output?
- ***\n***\n***
- [x] *\n**\n***
- ***\n**\n*
> The inner loop runs up to i. That's why every line gets one star longer.

runde:
    for (int i = 1; i <= 3; i++) {
        for (int i = 1; i <= 3; i++) {
            System.out.println(i);
        }
    }
frage: What happens?
- 1 to 3 is output three times.
- 1 to 3 is output once.
- [x] Java reports an error.
> Two loops inside each other need two different counter variables, for example `row` and `column`.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can put a branch inside a loop. → A branch inside a loop
- I can put a loop inside another loop. → A loop inside a loop
- I can explain that the inner loop runs all the way through in every pass of the outer one. → A loop inside a loop
- I can write nested loops and branches in Java. → Now in Java
:::

## Quiz

::: quiz
? The outer loop runs 3 times, the inner one 4 times. How often does the inside of the inner loop run in total?
→ A loop inside a loop
- [ ] 7 times
- [x] 12 times
- [ ] 4 times
> In each of the 3 outer passes, the inner loop runs 4 times, so 3 · 4 = 12.

? How can you tell whether a number is even?
→ A branch inside a loop
- [ ] `number / 2 == 0`
- [x] `number % 2 == 0`
- [ ] `number == 2`
> % gives the remainder of a division. For even numbers, the remainder when dividing by 2 is zero.

? There is a branch inside a for loop. How often is the condition of the branch checked?
→ A branch inside a loop
- [ ] Once
- [x] Once per pass of the loop
- [ ] Only if it is true
> The branch is part of the inside and runs in every pass.

? How can you tell in Java what belongs to a loop?
→ Now in Java
- [ ] By the colour
- [x] By the curly brackets and the indentation
- [ ] By the semicolons
:::
