---
titel: For loop
bereich: Basics
kurz: Count a fixed number of passes with Init, Condition and Step.
---

## Skills I will gain now

::: kompetenzen
- name the three parts Init, Condition and Step of the for loop
- explain in which order the three parts run
- count forwards, backwards and in bigger steps with a for loop
- write a for loop in Java and explain its three fields
:::

## Counting with a fixed plan

In the while loop you already counted along: a start value before the loop, a condition in the head, a change inside. The **for loop** puts these three parts together in the head. That way you see at a glance how it counts.

When you click a for loop, it has three fields on the right:

- **Init:** `int i = 1` creates the counter variable.
- **Condition:** `i <= 5` says how long to count.
- **Step:** `i++` increases `i` by 1 after every pass.

::: diagramm l12-eins-bis-fuenf.visustruct
A for loop that outputs the numbers from 1 to 5.
:::

::: angeberwissen
Why is the counting variable almost always called `i`? In maths `i` has long stood for an index. And in FORTRAN, one of the first programming languages from 1957, all variables starting with I to N were automatically whole numbers. Programmers have not broken the habit to this day.
:::

## In which order?

The three parts run at different times:

1. **Init** runs exactly once, right at the start.
2. **Condition** is checked before every pass. If it is false, the loop is finished.
3. After the inside comes the **Step**, then the condition again.

::: grafik l12-for-ablauf.svg
Init only runs once. After that, condition, inside and step repeat.
:::

So the for loop is a pre-test loop, like the while loop. Go through the example in the simulation with **Step** and watch how `i` changes.

> Use the for loop when you know beforehand how often something should happen. If the end depends on something that only happens during the loop, for example an input, the while or do-while loop is better.

## Example: sum from 1 to n

A for loop is good for adding up numbers. Before the loop there is `int sum = 0`. In every pass the current number `i` is added.

::: diagramm l12-summe.visustruct
With n = 4 the loop calculates 0 + 1 + 2 + 3 + 4. At the end, 10 is output.
:::

## Other steps

The step does not always have to be `i++`:

- `i--` counts backwards, for example with Init `int i = 10` and Condition `i >= 1`.
- `i = i + 2` jumps in steps of two, for example 0, 2, 4, 6.

Make sure that Init, Condition and Step fit together. With Init `int i = 1`, Condition `i >= 1` and Step `i++`, the condition never becomes false.

::: übung l12-countdown
titel: Countdown
auftrag: Ask for a whole number `n`. Use a for loop to count backwards from `n` to 1 and output each number. Then output **Go!**.
test: 3 -> 3 | 2 | 1 | Go!
test: 5 -> 5 | 4 | 3 | 2 | 1 | Go!
test: 1 -> 1 | Go!
braucht: forSchleife
tipp: This time the for loop counts backwards. Think about where it starts, when it stops and how it counts.
tipp: Init is `int i = n`, the condition `i >= 1` and the step `i--`. The output Go! goes below the loop, not inside it.
lösung: l12-countdown-loesung.visustruct
:::

## Exercise: Times table

::: übung l12-einmaleins
titel: Times table
auftrag: Ask for a number and output its times table from 1 to 10. Each line looks like this: **3 x 1 = 3**, **3 x 2 = 6** and so on.
test: 3 -> 3 x 1 = 3 | 3 x 2 = 6 | 3 x 3 = 9 | 3 x 4 = 12 | 3 x 5 = 15 | 3 x 6 = 18 | 3 x 7 = 21 | 3 x 8 = 24 | 3 x 9 = 27 | 3 x 10 = 30
test: 7 -> 7 x 1 = 7 | 7 x 2 = 14 | 7 x 3 = 21 | 7 x 4 = 28 | 7 x 5 = 35 | 7 x 6 = 42 | 7 x 7 = 49 | 7 x 8 = 56 | 7 x 9 = 63 | 7 x 10 = 70
braucht: forSchleife
tipp: The loop counts from 1 to 10. In every pass you output one line of the table.
tipp: Inside, first calculate `int product = number * i`. Then output `number + " x " + i + " = " + product`. Remember the spaces inside the quotation marks.
lösung: l12-einmaleins-loesung.visustruct
:::

## Exercise: Fix the sum

::: übung l16-summe
titel: Fix the sum
auftrag: The structure chart should add up all numbers from 1 to n. So with n = 4 the result should be 1 + 2 + 3 + 4 = **10**. But it outputs 6.
  Do a desk check or use **Step** and fix the mistake.
start: l16-summe-start.visustruct
test: 4 -> 10
test: 1 -> 1
test: 5 -> 15
braucht: forSchleife
tipp: Go through the loop with n = 4 in your head or with **Step**. Which numbers are really added?
tipp: Look at the last value of i the loop runs with. With n = 4, i = 4 must be added too.
lösung: l16-summe-loesung.visustruct
:::

## Now in Java

The sum from 1 to n looks like this in Java:

```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Up to which number?");
int n = scanner.nextInt();
int sum = 0;
for (int i = 1; i <= n; i++) {
    sum = sum + i;
}
System.out.println(sum);
```

The round brackets after `for` hold the three fields of the for loop, separated by semicolons:

| Field | In Java | Meaning |
|---|---|---|
| Init | `int i = 1` | `i` starts at 1. |
| Condition | `i <= n` | The loop runs as long as this is true. |
| Step | `i++` | After every pass `i` gets 1 bigger. |

`i++` is short for `i = i + 1`. To count backwards, use `i--`.

::: übung l13-java-quadrate
titel: Square numbers in Java
code: java
auftrag: Write a Java program that reads a whole number `n` and uses a for loop to output the square numbers from 1 to `n`, each on its own line. For 3 that is 1, 4 and 9.
test: 3 -> 1 | 4 | 9
test: 5 -> 1 | 4 | 9 | 16 | 25
test: 1 -> 1
braucht: forSchleife
tipp: The loop counts `i` from 1 to `n`. The square of `i` is `i * i`.
tipp: `for (int i = 1; i <= n; i++) { … }` and in the body `System.out.println(i * i);`.
lösung: l13-java-quadrate-loesung.visustruct
:::

## Fill in the gaps: for

::: lückentext
titel: Counting up and down
auftrag: The first loop adds up the numbers from 1 to 5, the second counts down from 10 to 0. Fill in the missing words and symbols.
```java
int sum = 0;
[[for]] ([[int]] i = 1; i [[<=]] 5; [[i++ | i += 1 | i = i + 1]]) {
    sum = sum + i;
}
System.out.println("Sum: " + sum);
for (int i = 10; i [[>=]] 0; [[i-- | i -= 1 | i = i - 1]]) {
    System.out.println(i);
}
```
erklärung: The round brackets hold the start value, the condition and the step, separated by semicolons. `i++` counts up, `i--` counts down. When counting down to 0 the condition is `i >= 0`.
:::

## Find the bug: times table

::: übung l13-java-fehler
titel: Fix the times table
code: java
auftrag: The program asks for a times table and should output it from 1 times to 10 times, for 7 that is 7, 14, … up to 70. But the 70 is missing.
  “Open in editor” shows the code in the Code area. Find the bug, fix it and click Check.
start: l13-java-fehler-start.visustruct
test: 7 -> 7 | 14 | 21 | 28 | 35 | 42 | 49 | 56 | 63 | 70
test: 3 -> 3 | 6 | 9 | 12 | 15 | 18 | 21 | 24 | 27 | 30
braucht: forSchleife
tipp: How often does the loop run? Count which values `i` takes.
tipp: `i` should also take the value 10: `i <= 10` instead of `i < 10`.
lösung: l13-java-fehler-loesung.visustruct
:::

## Game: Defuse the bomb

::: spiel bombe
titel: Game: Defuse the bomb
intro: Every program hides **exactly one mistake**, and the bomb is ticking. Read what the program should do and tap the wrong line before time runs out. Eight rounds, 25 seconds each.
zeit: 25

runde:
    for (int i = 1; i <= 3; i++) {
        System.out.println(i)
    }
frage: Should output 1, 2 and 3.
fehler: 2
besser: System.out.println(i);
> The semicolon at the end of the statement is missing.

runde:
    for (int i = 1, i <= 5, i++) {
        System.out.println(i);
    }
frage: Should output 1 to 5.
fehler: 1
besser: for (int i = 1; i <= 5; i++) {
> The three fields of the for loop are separated by semicolons, not commas.

runde:
    for (int i = 10; i >= 1; i++) {
        System.out.println(i);
    }
frage: Should count backwards from 10 to 1.
fehler: 1
besser: for (int i = 10; i >= 1; i--) {
> With `i++`, `i` keeps growing and the condition `i >= 1` stays true: an endless loop. To count backwards, use `i--`.

runde:
    int sum = 0;
    for (int i = 1; i <= 4; i++) {
        sum = i;
    }
    System.out.println(sum);
frage: Should output the sum 1 + 2 + 3 + 4 = 10.
fehler: 3
besser: sum = sum + i;
> `sum = i` overwrites the sum in every pass. In the end it only holds 4.

runde:
    for (int i = 0; i <= 5; i++) {
        System.out.println("Baaa");
    }
frage: Should output Baaa exactly five times.
fehler: 1
besser: for (int i = 0; i < 5; i++) {
> From 0 up to and including 5 there are six passes. If you start at 0, use `<`.

runde:
    for (int i = 1; i <= 3; i++) {
        system.out.println(i);
    }
frage: Should output 1, 2 and 3.
fehler: 2
besser: System.out.println(i);
> Java tells upper and lower case apart: `System` is written with a capital S.

runde:
    int number = 7;
    for (int i = 1; i <= 10; i++) {
        System.out.println(number + " x " + i + " = " + number * number);
    }
frage: Should output the 7 times table: 7 x 1 = 7, 7 x 2 = 14 and so on.
fehler: 3
besser: System.out.println(number + " x " + i + " = " + number * i);
> `number * number` is always 49. It has to be `number * i`.

runde:
    for (int i = 2; i <= 10; i + 2) {
        System.out.println(i);
    }
frage: Should output the even numbers 2, 4, 6, 8 and 10.
fehler: 1
besser: for (int i = 2; i <= 10; i = i + 2) {
> `i + 2` only calculates and stores nothing. For `i` to really grow, you need `i = i + 2`.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can name the three parts Init, Condition and Step of the for loop. → Counting with a fixed plan
- I can explain in which order the three parts run. → In which order?
- I can count forwards, backwards and in bigger steps with a for loop. → Other steps
- I can write a for loop in Java and explain its three fields. → Now in Java
:::

## Quiz

::: quiz
? How often does the Init of a for loop run?
→ In which order?
- [x] Exactly once
- [ ] Before every pass
- [ ] After every pass
> Init creates the counter variable once at the start.

? Init `int i = 0`, Condition `i < 3`, Step `i++`. Which values does i have inside the loop?
→ Counting with a fixed plan
- [ ] 1, 2, 3
- [x] 0, 1, 2
- [ ] 0, 1, 2, 3
> With i = 3 the condition is false, so the inside does not run any more.

? Init `int i = 2`, Condition `i <= 10`, Step `i = i + 2`. How often does the inside run?
→ Other steps
- [ ] 4 times
- [x] 5 times
- [ ] 10 times
> i takes the values 2, 4, 6, 8 and 10.

? When does a for loop fit best?
→ Counting with a fixed plan
- [x] When you know beforehand how often to repeat
- [ ] When you keep asking until an input is valid
- [ ] When only a single value is checked

? What does `i++` mean in a for loop?
→ Counting with a fixed plan
- [ ] i is doubled.
- [x] i gets 1 bigger.
- [ ] i is output.
> `i++` is short for `i = i + 1`.
:::
