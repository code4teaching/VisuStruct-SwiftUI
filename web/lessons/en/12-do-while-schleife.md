---
titel: Do-while loop
bereich: Basics
kurz: Run first, check afterwards: loops with at least one pass.
---

## Skills I will gain now

::: kompetenzen
- explain that the do-while loop only checks its condition after the inside
- explain why the inside runs at least once
- repeat an input until it is valid
- write a do-while loop in Java
:::

## Do first, check afterwards

The **do-while loop** is a **post-test loop**. The condition is at the bottom, in the foot of the box. This is how it runs:

1. Run the inside once.
2. Check the condition.
3. If it is true, start again at 1. If it is false, the program continues below the loop.

::: grafik l11-vergleich.svg
On the left, the while loop checks first; on the right, the do-while loop runs first.
:::

At the top of the box is `do`, and the condition is in the foot. When you click the loop, the word `while` is in front of the text field in the Object Inspector: the condition means “repeat as long as …”.

> Just like with the while loop, the condition says **when the loop repeats**. As long as it is true, the loop keeps running.

::: angeberwissen
Python has no do-while loop at all. If you want “do first, check later” there, you write `while True:` and leave the loop with `break`. Java, C and JavaScript, on the other hand, have had `do … while` for decades.
:::

## At least one pass

Because the condition is only checked at the end, the inside **always runs at least once**. That is the most important difference from the while loop.

::: diagramm l11-einmal.visustruct
i is 10 and so it is not less than 5. Still, 10 is output once, because the check only comes afterwards.
:::

With a while loop and the same condition `i < 5`, nothing at all would be output here.

## Typical use: repeat an input

The do-while loop fits whenever something has to happen first before you can check it. The best example is an input: only after someone has typed something do you know whether it is valid.

::: diagramm l11-eingabe-pruefen.visustruct
The question comes again until a number from 1 to 10 has been typed in. In the simulation, first try 0 and then 12.
:::

Here the condition describes the **invalid** input: `number < 1 || number > 10`. As long as the input is invalid, the question is asked again.

## Exercise: Valid grade

::: übung l11-note
titel: Valid grade
auftrag: Ask for a grade. If it is not between 1 and 6, ask again. If it is valid, output it, for example **Your grade: 3**.
test: 3 -> Your grade: 3
test: 0, 7, 2 -> Your grade: 2
test: 9, 6 -> Your grade: 6
test: -1, 1 -> Your grade: 1
braucht: doUntilSchleife
tipp: The grade is asked for at least once. After that, the condition decides whether to ask again.
tipp: Before the loop, create `int grade = 0`. The input `input: grade "Grade from 1 to 6"` goes inside the loop. The condition is `grade < 1 || grade > 6`.
lösung: l11-note-loesung.visustruct
:::

## Exercise: Sum until 0

::: übung l11-summe
titel: Sum until 0
auftrag: Keep asking for numbers until a 0 is typed in. Then output the sum of all the numbers typed in.
test: 3, 4, 0 -> 7
test: 10, 0 -> 10
test: 5, 5, 5, 0 -> 15
test: 0 -> 0
braucht: doUntilSchleife
tipp: You need a variable for the sum that starts at 0 before the loop. In every pass the new number is added.
tipp: Before the loop, create `int sum = 0` and `int number = 0`. In the loop you ask for `number` and calculate `sum = sum + number`. Adding the 0 does no harm. The loop keeps running as long as `number != 0`.
lösung: l11-summe-loesung.visustruct
:::

## Now in Java

The loop that still runs once looks like this in Java:

```java
int i = 10;
do {
    System.out.println(i);
    i = i + 1;
} while (i < 5);
```

- The body is between `do {` and `}`, the condition only comes afterwards.
- Here there is a **semicolon** after `while (…)`. That is different from the while loop.

::: übung l12-java-verdoppeln
titel: Double at least once
code: java
auftrag: Write a Java program that reads a start number. A do-while loop doubles it and outputs it as long as it is less than 100. A number of 100 or more is still doubled at least once: 200 becomes 400.
test: 30 -> 60 | 120
test: 200 -> 400
test: 13 -> 26 | 52 | 104
braucht: doUntilSchleife
tipp: In the body you double the number and output it. The condition comes at the end.
tipp: `do { number = number * 2; System.out.println(number); } while (number < 100);`
lösung: l12-java-verdoppeln-loesung.visustruct
:::

## Fill in the gaps: do-while

::: lückentext
titel: Tripling
auftrag: The number is tripled and output as long as it is less than 100. Fill in the missing words and symbols.
```java
int number = 1;
[[do]] {
    number = number * 3;
    System.out.println(number);
} [[while]] (number [[<]] 100)[[;]]
```
erklärung: The body is between `do {` and `}`, the condition only comes afterwards. In a do-while loop there is a semicolon after `while (…)`. Output: 3, 9, 27, 81 and 243.
:::

## Find the bug: halving

::: übung l12-java-fehler
titel: Fix the halving
code: java
auftrag: The program reads a start number and keeps dividing it by 2 (whole-number division) with a do-while loop. Every result is output until **0** is reached. For 10 that is 5, 2, 1 and 0. But the 0 is missing.
  “Open in editor” shows the code in the Programming area. Find the bug, fix it and click Check.
start: l12-java-fehler-start.visustruct
test: 10 -> 5 | 2 | 1 | 0
test: 1 -> 0
test: 7 -> 3 | 1 | 0
test: 20 -> 10 | 5 | 2 | 1 | 0
braucht: doUntilSchleife
tipp: What value does `number` have after the 1 has been output? Does the loop run once more then?
tipp: The loop should keep going as long as the number is greater than 0: `while (number > 0);`
lösung: l12-java-fehler-loesung.visustruct
:::

## Game: At least once?

::: spiel frage
titel: Game: At least once?
intro: While or do-while? Ludwig shows you loops. Predict what happens. Six rounds.

runde:
    int i = 10;
    do {
        System.out.println(i);
        i = i + 1;
    } while (i < 5);
frage: What is output?
- nothing
- [x] 10
- 10 to 4
> First do, then check: the body runs once, after that 11 < 5 is false.

runde:
    int i = 10;
    while (i < 5) {
        System.out.println(i);
        i = i + 1;
    }
frage: What is output?
- [x] nothing
- 10
- 11
> In a while loop the condition comes first. 10 < 5 is false, so nothing runs at all.

runde:
    int number = 200;
    do {
        number = number * 2;
    } while (number < 100);
    System.out.println(number);
frage: What is output?
- 200
- [x] 400
- 800
> It is doubled once no matter what. After that 400 < 100 is false.

runde:
    int number = 30;
    do {
        number = number * 2;
        System.out.println(number);
    } while (number < 100);
frage: What is output?
- 60
- [x] 60\n120
- 60\n120\n240
> After 60, 60 < 100 is true, so it goes on. After 120 it stops.

runde:
frage: Which line ends a do-while loop in Java correctly?
- [x] `} while (i < 5);`
- `} while (i < 5)`
- `while (i < 5) {`
> After the `while (…)` of a do-while loop there is a semicolon.

runde:
frage: What is a do-while loop typically used for?
- [x] repeating an input until it is valid
- counting from 1 to 10
- swapping two values
> The question is asked at least once. Only after that do you know whether the input was valid.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain that the do-while loop only checks its condition after the inside. → Do first, check afterwards
- I can explain why the inside runs at least once. → At least one pass
- I can repeat an input until it is valid. → Typical use: repeat an input
- I can write a do-while loop in Java. → Now in Java
:::

## Quiz

::: quiz
? What does post-test loop mean?
→ Do first, check afterwards
- [ ] The condition is checked before every pass.
- [x] The condition is checked after every pass.
- [ ] The loop has no condition.
> The condition is in the foot, at the bottom, and is worked out after the inside.

? The condition of a do-while loop is false from the start. How often does the inside run?
→ At least one pass
- [ ] Not at all
- [x] Exactly once
- [ ] Forever
> The inside runs first. Only then does the loop notice that it should stop.

? You want to ask for a number from 1 to 10. Which condition goes in the foot?
→ Typical use: repeat an input
- [ ] `number >= 1 && number <= 10`
- [x] `number < 1 || number > 10`
- [ ] `number == 10`
> The loop repeats as long as the input is invalid, that is, less than 1 or greater than 10.

? When is a do-while loop better than a while loop?
→ At least one pass
- [x] When the inside has to run at least once, e.g. for an input
- [ ] When the loop might not need to run at all
- [ ] When you want to count exactly to 10

? What comes at the end of a do-while loop in Java?
→ Now in Java
- [ ] } while (condition) {
- [x] } while (condition);
- [ ] } until (condition);
> A semicolon follows the condition.
:::
