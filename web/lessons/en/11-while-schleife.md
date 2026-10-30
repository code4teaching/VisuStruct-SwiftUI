---
titel: While loop
bereich: Basics
kurz: Repeat steps as long as a condition is true.
---

## Skills I will gain now

::: kompetenzen
- explain that the while loop checks its condition before every pass
- use a counter variable with a start value, a condition and a change
- notice when a loop never ends and fix the mistake
- follow a loop pass by pass in a desk check
- write a while loop in Java
:::

## Repeat as long as something holds

Often a program should do something several times. Instead of writing the same box five times, you use a **loop**.

The **while loop** repeats its inside **as long as** its condition is true. The condition is at the top, in the head of the box. The inside is indented below it, framed by a bracket on the left.

::: diagramm l10-countdown.visustruct
A countdown: as long as number is greater than 0, number is output and gets smaller by 1. After that, Start! appears.
:::

## The condition comes first

The while loop is a **pre-test loop**. Before **every** pass, the condition is checked:

1. Check the condition.
2. If it is true, run the inside once and start again at 1.
3. If it is false, the program continues below the loop.

::: grafik l10-kopfgesteuert.svg
After every pass it goes back to the condition. Only when it is false does the program continue below the loop.
:::

In the countdown the condition is checked four times: with 3, 2 and 1 it is true, with 0 it is false.

> If the condition is already false the first time it is checked, the inside runs **not even once**. Start the countdown with `int number = 0` and only Start! appears.

## A counter variable

Many loops count along. For that you need three things:

- **A start value before the loop**, e.g. `int i = 1`
- **A condition in the head**, e.g. `i <= 5`
- **A change inside**, e.g. `i = i + 1` (short: `i++`)

If one of these parts is missing, the loop counts wrongly or not at all.

::: angeberwissen
Counting loops are ancient! In their 1973 article, Nassi and Shneiderman showed their idea using the **factorial**, among other things: 5! = 1 · 2 · 3 · 4 · 5 = 120. Here is my goat version of it. Try it with **Step** in the simulation and watch `factorial` grow. Baaah, that goes fast!
:::

::: diagramm l10-fakultaet.visustruct
The factorial with a counter variable `i`, rebuilt from an example in the 1973 article.
:::

## Exercise: Count to n

::: übung l10-bis-n
titel: Count to n
auftrag: Ask for a whole number `n` and output all numbers from 1 to `n`, each on its own line.
test: 3 -> 1 | 2 | 3
test: 5 -> 1 | 2 | 3 | 4 | 5
test: 1 -> 1
braucht: whileSchleife
tipp: You need a counter variable that starts at 1 and grows by 1 in every pass.
tipp: Before the loop, create `int i = 1`. The condition is `i <= n`. Inside, you output `i` and then increase `i` by 1.
lösung: l10-bis-n-loesung.visustruct
:::

## Watch out: endless loop

If nothing inside the loop changes the condition, it stays true forever. The loop never stops. This is called an **endless loop**.

::: diagramm l10-endlos.visustruct
Here number = number - 1 is missing. The loop outputs 3 again and again and never reaches Start!
:::

Ask yourself for every loop: **What inside makes sure that the condition becomes false at some point?** When an exercise is checked, VisuStruct stops after a very large number of steps and reports a possible endless loop.

## Exercise: Double up to 100

::: übung l10-verdoppeln
titel: Double up to 100
auftrag: Ask for a whole number. Keep doubling it until it is at least 100.
  At the end, output **how often** you doubled it.
test: 10 -> 4
test: 30 -> 2
test: 1 -> 7
test: 100 -> 0
braucht: whileSchleife
tipp: The loop runs as long as the number is still too small. Count along how often it has run.
tipp: You need a second variable `int steps = 0`. The condition is `number < 100`. Inside, you double the number with `number = number * 2` and increase `steps` by 1. If the number is already 100, the loop does not run at all.
lösung: l10-verdoppeln-loesung.visustruct
:::

## Loops in a desk check

With a loop, the **desk check** is especially valuable. You see exactly how often the loop runs and with which value it stops. Every check of the condition gets a row of its own.

::: diagramm l16-schreibtisch.visustruct
A while loop adds up the numbers 1, 2 and 3.
:::

| Step | sum | i | Output |
|---|---|---|---|
| `int sum = 0` | 0 | – | |
| `int i = 1` | 0 | 1 | |
| `i <= 3` → true | 0 | 1 | |
| `sum = sum + i` | 1 | 1 | |
| `i = i + 1` | 1 | 2 | |
| `i <= 3` → true | 1 | 2 | |
| `sum = sum + i` | 3 | 2 | |
| `i = i + 1` | 3 | 3 | |
| `i <= 3` → true | 3 | 3 | |
| `sum = sum + i` | 6 | 3 | |
| `i = i + 1` | 6 | 4 | |
| `i <= 3` → false | 6 | 4 | |
| `output: sum` | 6 | 4 | 6 |

Common mistakes in loops are:

- The loop runs **once too often or once too few**, e.g. `<` instead of `<=`.
- A variable is **not changed** in the loop, or changed in the wrong direction. Then the loop never ends.
- A variable gets its start value **inside** the loop instead of before it and is reset in every pass.

## Exercise: Fix the countdown

::: übung l16-countdown
titel: Fix the countdown
auftrag: The countdown should count down from the start value and output **Go!** at the end. So with 3: 3, 2, 1, Go!
  The start diagram has two mistakes. Find and fix both.
start: l16-countdown-start.visustruct
test: 3 -> 3 | 2 | 1 | Go!
test: 1 -> 1 | Go!
test: 0 -> Go!
tipp: There are two mistakes. One is about counting, the other about the output at the end.
tipp: Start the simulation with start value 3 and watch i under Variables. Does i get smaller? Also compare the last output carefully with the task.
lösung: l16-countdown-loesung.visustruct
:::

## Now in Java

The countdown from the start of this lesson looks like this in Java:

```java
int number = 3;
while (number > 0) {
    System.out.println(number);
    number = number - 1;
}
System.out.println("Start!");
```

- After `while` the condition is in round brackets, as with `if`.
- Everything that is repeated is in curly brackets. That is the body of the loop.
- The body is indented. As in the structure chart, you can see what belongs to the loop.

::: übung l11-java-gerade
titel: Even numbers in Java
code: java
auftrag: Write a Java program that reads a whole number `n` and uses a while loop to output all even numbers from 2 up to at most `n`. For 7 that is 2, 4 and 6.
test: 7 -> 2 | 4 | 6
test: 8 -> 2 | 4 | 6 | 8
test: 2 -> 2
braucht: whileSchleife
tipp: You need a counter variable that starts at 2. The loop runs as long as it is not greater than `n`.
tipp: `int number = 2;` before the loop, then `while (number <= n) { … }`. In the body you output `number` and increase it with `number = number + 2;`.
lösung: l11-java-gerade-loesung.visustruct
:::

## Fill in the gaps: while

::: lückentext
titel: Sum from 1 to 10
auftrag: The program should add up the numbers from 1 to 10. Fill in the missing words and symbols.
```java
int sum = 0;
int number = 1;
[[while]] (number [[<=]] 10) [[{]]
    sum = sum + [[number]];
    [[number]] = number + 1;
}
System.out.println("Sum: " + sum);
```
erklärung: The loop runs as long as `number` is at most 10. In each pass `number` is added to the sum, then `number` goes up by 1. Without that line it would be an endless loop. Output: **Sum: 55**
:::

## Find the bug: saving

::: übung l11-java-fehler
titel: Fix the savings plan
code: java
auftrag: Ludwig saves 5 euros every week. The program asks for the savings goal and should output after how many weeks he has reached it. For 50 euros that is 10 weeks, but the program says **Weeks: 11**.
  Go through the code with Step and watch `money` and `weeks`. Fix the bug and click Check.
start: l11-java-fehler-start.visustruct
test: 50 -> Weeks: 10
test: 12 -> Weeks: 3
test: 5 -> Weeks: 1
test: 1 -> Weeks: 1
braucht: whileSchleife
tipp: How much money does Ludwig have when the loop runs for the last time? Does he really need to save for another week?
tipp: He only saves as long as the goal has **not been reached** yet: `while (money < goal)`.
lösung: l11-java-fehler-loesung.visustruct
:::

## Game: How often?

::: spiel frage
titel: Game: How often?
intro: Ludwig has written while loops. Do the desk check in your head. Six rounds.

runde:
    int number = 3;
    while (number > 0) {
        System.out.println(number);
        number = number - 1;
    }
    System.out.println("Go!");
frage: What is output?
- [x] 3\n2\n1\nGo!
- 3\n2\n1\n0\nGo!
- Go!
> When number is 0, `number > 0` is false, so the 0 is not output any more.

runde:
    int i = 10;
    while (i < 5) {
        System.out.println(i);
        i = i + 1;
    }
frage: What is output?
- [x] nothing
- 10
- 10 to 4
> The condition is checked first. 10 < 5 is false, the body doesn't run even once.

runde:
    int i = 1;
    while (i <= 3) {
        System.out.println(i);
    }
frage: What happens?
- 1, 2 and 3 are output.
- [x] The loop never stops.
- Nothing is output.
> i never gets bigger in the body. The condition always stays true: an endless loop.

runde:
    int number = 1;
    while (number < 100) {
        number = number * 2;
    }
    System.out.println(number);
frage: What is output?
- 64
- 100
- [x] 128
> 1, 2, 4, 8, 16, 32, 64, 128. Only at 128 is `number < 100` false.

runde:
    int i = 0;
    while (i < 5) {
        i = i + 2;
    }
    System.out.println(i);
frage: What is output?
- 4
- 5
- [x] 6
> i runs 0, 2, 4, 6. At 6, `i < 5` is false. The 5 is skipped.

runde:
    int i = 1;
    while (i <= 10) {
        i = i + 3;
    }
frage: How often does the body run?
- 3 times
- [x] 4 times
- 10 times
> The body runs at i = 1, 4, 7 and 10. After that i is 13.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain that the while loop checks its condition before every pass. → The condition comes first
- I can use a counter variable with a start value, a condition and a change. → A counter variable
- I can notice when a loop never ends and fix the mistake. → Watch out: endless loop
- I can follow a loop pass by pass in a desk check. → Loops in a desk check
- I can write a while loop in Java. → Now in Java
:::

## Quiz

::: quiz
? What does pre-test loop mean?
→ The condition comes first
- [x] The condition is checked before every pass.
- [ ] The condition is checked after every pass.
- [ ] The loop always runs exactly once.
> The head with the condition is at the top and is worked out first.

? `int i = 5`, then a while loop with the condition `i < 3`. How often does the inside run?
→ The condition comes first
- [x] Not at all
- [ ] Once
- [ ] Three times
> The very first time it is checked, 5 < 3 is false.

? Why does a loop with the condition `number > 0` never end if the inside only contains `output: number`?
→ Watch out: endless loop
- [ ] Because output makes the number bigger
- [x] Because number never changes and the condition stays true
- [ ] Because the condition is written wrongly
> Something has to happen inside that makes the condition false at some point.

? What else are loops called in textbooks?
→ The condition comes first
- [x] Iteration or repetition
- [ ] Branches
- [ ] Subprograms
> A loop repeats statements. That is why it is also called iteration or repetition.

? A loop should count from 1 to 5, but it only goes up to 4. What is the likely mistake?
→ A counter variable
- [x] The condition says i < 5 instead of i <= 5.
- [ ] The loop is a while loop.
- [ ] The variable i has the wrong name.

? Which line starts a while loop correctly in Java?
→ Now in Java
- [ ] while number > 0 {
- [x] while (number > 0) {
- [ ] while (number > 0);
> The condition is in round brackets, then `{` opens the body.
:::
