---
titel: Branch
bereich: Basics
kurz: Use a condition to decide which of two paths runs.
---

## Skills I will gain now

::: kompetenzen
- explain that exactly one path of a branch runs
- use the comparison operators == != < <= > >=
- tell == and = apart
- build a branch with an empty path
- write a branch with if and else in Java
:::

## If, then, else

So far every box always ran. But often a program should **decide**: if a condition is met, do one thing, otherwise do the other.

::: diagramm l07-alter-pruefen.visustruct
Depending on the age typed in, one message or the other appears. Try 17 and 18 in the simulation.
:::

That is what the **branch** is for. The condition sits in the triangle at the top. Below it, the structure chart splits into two paths:

- **true** (left): runs if the condition is true
- **false** (right): runs if the condition is false

Always **exactly one** of the two paths runs. After that, the program continues below the branch.

## Insert a branch

Drag the **Branch** from the Elements area into the structure chart. Click the triangle and type the condition in the Object Inspector, e.g. `age >= 18`. The word `if` is already in front.

Each path starts with a placeholder ø. Drag statements into it. A path may also hold several boxes on top of each other.

## Comparison operators

A condition is usually a **comparison**. Its result is always `true` or `false`.

- `==` equal, e.g. `number == 0`
- `!=` not equal, e.g. `answer != 42`
- `<` less than, `<=` less than or equal
- `>` greater than, `>=` greater than or equal

> Do not mix up `==` and `=`. A single `=` is an assignment and stores a value. To compare, you need two equals signs.

With `%` you check whether a number can be divided by another: `number % 2 == 0` is true if `number` is even.

## Exercise: Even or odd

::: übung l07-gerade
titel: Even or odd
auftrag: Ask for a whole number. Output **even** if it is even, otherwise **odd**.
test: 4 -> even
test: 7 -> odd
test: 0 -> even
braucht: verzweigung
tipp: There are two possibilities here, so you need a branch. How do you recognise an even number?
tipp: A number is even if there is no remainder when you divide it by 2. The condition is `number % 2 == 0`.
lösung: l07-gerade-loesung.visustruct
:::

## Exercise: The larger number

::: übung l07-maximum
titel: The larger number
auftrag: Ask for two whole numbers and output only the larger one. If both are the same, output that number.
test: 3, 8 -> 8
test: 9, 2 -> 9
test: 5, 5 -> 5
braucht: verzweigung
tipp: A branch compares the two numbers. Each path holds exactly one output.
tipp: Compare with `a > b`. In the true path you output `a`, in the false path `b`.
lösung: l07-maximum-loesung.visustruct
:::

## An empty path

Sometimes something should only happen if the condition is true, and otherwise nothing at all. Then the false path stays **empty**. In the structure chart it shows the placeholder **ø**.

::: diagramm l07-rabatt.visustruct
From 50 euros on, you get 5 euros off. Otherwise nothing happens; the false path is empty. The output below runs in both cases.
:::

::: angeberwissen
A single forgotten branch caused a stir across half the internet in 2014: the security hole **Heartbleed** in OpenSSL, a program that many websites use for encryption. A computer could tell the server: “Send me back the word *hat*, it has 500 letters.” The server did not check whether 500 matched the real length of 3 and simply sent back 500 characters from its memory. Sometimes they contained other people's passwords. All that was missing was one if: if the stated length is greater than the real one, then send nothing back. By the way, this had nothing to do with brackets. Baah, check your inputs before you believe them.
:::

## Exercise: Absolute value

::: übung l07-betrag
titel: Absolute value of a number
auftrag: Ask for a whole number. If it is negative, make it positive. Then output the number. So -5 becomes 5, and 7 stays 7.
Use a branch with an empty path and only **one** output below the branch.
test: -5 -> 5
test: 7 -> 7
test: 0 -> 0
test: -12 -> 12
braucht: verzweigung
tipp: Only negative numbers need to be changed. What happens to a number if you multiply it by -1?
tipp: The condition is `number < 0`. In the true path you flip the sign, e.g. with `number = 0 - number`. The false path stays empty.
lösung: l07-betrag-loesung.visustruct
:::

## Now in Java

This is the age check from the start of this lesson in Java:

```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("How old are you?");
int age = scanner.nextInt();
if (age >= 18) {
    System.out.println("You are an adult.");
} else {
    System.out.println("You are not an adult yet.");
}
```

- The condition comes after `if` in **round brackets** `( )`.
- The true branch is in **curly brackets** `{ }`, the false branch follows after `else` in its own curly brackets. There is no semicolon after a curly bracket.
- If the false branch is empty, simply leave out `else { }`.
- Your program needs the first two lines once as soon as it reads input. After that, `scanner.nextInt()` reads a whole number. The question before it is a normal output.

::: angeberwissen
Java has a mascot too: **Duke**, a little black-and-white fellow with a big red nose. He was drawn by the Java team in 1992 and has been waving from conferences and T-shirts ever since. Ludwig thinks a billy goat would have been a better fit.
:::

::: übung l08-java-bestanden
titel: Passed in Java
code: java
auftrag: Write a Java program that asks for the number of points. From 50 points on it outputs **passed**, otherwise **not passed**.
  Type the code in the Programming area and then click Check.
test: 50 -> passed
test: 49 -> not passed
test: 100 -> passed
test: 0 -> not passed
braucht: verzweigung
tipp: Start with the two lines for the scanner. Then ask for the points, read them and compare them with `if`.
tipp: The condition is `points >= 50`. One branch has `System.out.println("passed");`, and after `else` comes `System.out.println("not passed");`.
lösung: l08-java-bestanden-loesung.visustruct
:::

::: angeberwissen
If a branch holds only a single statement, Java even lets you leave out the curly brackets. We never do that, and here is why:

```java
if (age >= 18)
    System.out.println("You are an adult.");
    System.out.println("You may watch the film.");
```

Without brackets only the first line belongs to the if. The second one always runs, even for twelve-year-olds. The indentation is misleading, because Java ignores spaces.

Exactly this kind of mistake was hidden in iPhones and Macs in 2014, known as **“goto fail”**. In the language C, the line `goto fail;` accidentally appeared twice under an if without brackets. The second one always ran and skipped the check of the security certificates. On an open Wi-Fi network, an attacker could have pretended to be your bank, for example. Baah, brackets cost two characters, a security hole costs much more.
:::

## Fill in the gaps: even or odd

::: lückentext
titel: Even or odd
auftrag: Fill in the missing words and symbols. The program should output whether a number is even.
```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Which number?");
int number = scanner.nextInt();
[[if]] (number [[%]] 2 [[==]] 0) [[{]]
    System.out.println("even");
[[}]] [[else]] {
    System.out.println("odd");
}
```
erklärung: `number % 2` is the remainder when dividing by 2. If it is 0, the number is even. To compare you need `==`, a single `=` is an assignment. Both branches are in curly brackets.
:::

## Find the bug: admission

::: übung l08-java-fehler
titel: Fix the admission
code: java
auftrag: At the zoo, children **under** 6 get in for free, everyone else pays 4 euros. But the program also lets six-year-olds in for free.
  “Open in editor” shows the code in the Programming area. Find the bug, fix it and click Check.
start: l08-java-fehler-start.visustruct
test: 5 -> Free entry
test: 6 -> 4 euros
test: 10 -> 4 euros
test: 0 -> Free entry
braucht: verzweigung
tipp: Try the program with 6. Which comparison operator still lets 6 through?
tipp: “Under 6” means `age < 6`. `<=` means “less than or equal to”.
lösung: l08-java-fehler-loesung.visustruct
:::

## Game: Which way?

::: spiel frage
titel: Game: Which way?
intro: Ludwig has written branches in Java. Work out the condition in your head and predict what is output. Seven rounds.

runde:
    int x = 5;
    if (x > 5) {
        System.out.println("big");
    } else {
        System.out.println("small");
    }
frage: What is output?
- big
- [x] small
- nothing
> 5 > 5 is false, because 5 is not greater than 5. So the false branch.

runde:
    int x = 5;
    if (x >= 5) {
        System.out.println("big");
    } else {
        System.out.println("small");
    }
frage: What is output?
- [x] big
- small
- big and small
> `>=` means "greater than or equal". 5 >= 5 is true.

runde:
    int number = 7;
    if (number % 2 == 0) {
        System.out.println("even");
    } else {
        System.out.println("odd");
    }
frage: What is output?
- even
- [x] odd
- 1
> 7 % 2 is the remainder 1, so not 0. The number is odd.

runde:
    int x = -4;
    if (x < 0) {
        x = -x;
    }
    System.out.println(x);
frage: What is output?
- -4
- [x] 4
- nothing
> -4 < 0 is true, so the sign is turned around.

runde:
    int x = 4;
    if (x < 0) {
        x = -x;
    }
    System.out.println(x);
frage: What is output?
- -4
- [x] 4
- nothing
> 4 < 0 is false. The false branch is empty, the program simply carries on below.

runde:
    int grade = 3;
    if (grade != 3) {
        System.out.println("different");
    } else {
        System.out.println("three");
    }
frage: What is output?
- different
- [x] three
- nothing
> `!=` means "not equal". 3 != 3 is false.

runde:
    int a = 8;
    int b = 12;
    if (a > b) {
        System.out.println(a);
    } else {
        System.out.println(b);
    }
frage: What is output?
- 8
- [x] 12
- 20
> The program outputs the bigger of the two numbers.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain that exactly one path of a branch runs. → If, then, else
- I can use the comparison operators == != < <= > >=. → Comparison operators
- I can tell == and = apart. → Comparison operators
- I can build a branch with an empty path. → An empty path
- I can write a branch with if and else in Java. → Now in Java
:::

## Quiz

::: quiz
? Which path runs if the condition is false?
→ If, then, else
- [ ] The true path
- [x] The false path
- [ ] Both paths
- [ ] Neither, the program ends
> With false, the right path runs. After that, the program continues below the branch.

? Which condition checks whether age is exactly 18?
→ Comparison operators
- [ ] age = 18
- [x] age == 18
- [ ] age >= 18
> A single = is an assignment. To compare, you need ==.

? What does ø in a path mean?
→ An empty path
- [x] Nothing happens in this case.
- [ ] The program ends here.
- [ ] The condition is false.

? The condition is `points >= 50`. For which value is it true?
→ Comparison operators
- [ ] 49
- [x] 50
- [ ] 0
> >= means greater than or equal. So 50 is included.

? In textbooks the branch often has another name. Which one?
→ If, then, else
- [ ] Multiple selection
- [x] Conditional statement
- [ ] Iteration
> The statements in a path only run under a condition. That is why it is also called a conditional statement.

? Where does the condition of a branch go in Java?
→ Now in Java
- [x] In round brackets right after if
- [ ] In curly brackets after else
- [ ] After a semicolon
> `if (age >= 18) { … }`: the round brackets belong to the condition, the curly ones to the branch.
:::
