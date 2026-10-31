---
titel: Sequence
bereich: Basics
kurz: Run steps one after another, watch the order and swap values.
---

## Skills I will gain now

::: kompetenzen
- explain that a sequence runs from top to bottom
- explain why the order of the steps matters
- swap two values with a temporary variable
- write a sequence in Java
:::

## Step by step

A **sequence** is a series of steps that run exactly once and in exactly this order. In the structure chart the boxes simply sit on top of each other.

Each box only starts when the box above it is finished. Nothing is skipped and nothing is repeated.

::: diagramm l05-sequenz.visustruct
A sequence of four boxes: first `length` and `width` get their values, then the area is calculated, and finally it is output. Each box runs exactly once, from top to bottom. Output: 15.
:::

> The sequence is the simplest of the three basic building blocks. Almost every structure chart is mostly made of sequences.

## Order matters

When you make tea, you notice straight away if the order is wrong. With calculations it is just the same, only it is harder to spot.

::: diagramm l04-rechnen.visustruct
First double, then add 1: the result is 7. If you swap the two middle boxes, you get 8.
:::

The statement `number = number * 2` means: take the value of `number`, multiply it by 2 and store the result in `number` again. So what is in `number` depends on what happened before.

::: angeberwissen
Structure charts are not just school stuff. According to Shneiderman, companies like IBM and Siemens planned their programs with them too. So you are learning pro stuff here. Baaa-mazing!
:::

## Exercise: Put in order

::: übung l04-reihenfolge
titel: Put in order
auftrag: The start diagram has the right boxes, but in the wrong order. Move them so that **20** is output at the end.
start: l04-reihenfolge-start.visustruct
test: - -> 20
braucht: anweisung
tipp: Read each box and ask yourself: which variable does it need, and where does that variable get its value?
tipp: A variable has to be created before you calculate with it. The output comes right at the end. Check in your head: (2 + 3) · 4 = 20.
lösung: l04-reihenfolge-loesung.visustruct
:::

## Swap two values

Imagine two glasses: one with juice, one with water. If you want to swap what is in them, you need a third, empty glass.

It is exactly the same with variables. If you simply write `a = b` and then `b = a`, the old value of `a` is already lost. In the end both variables have the same value.

The solution is a **temporary variable** that keeps the old value for a short time:

::: grafik l05-tauschen.svg
Three steps with an empty glass: first the juice into temp, then the water to the left, then the juice from temp to the right.
:::

::: diagramm l04-tauschen.visustruct
First a is kept in temp. Then a gets the value of b, and b gets the kept value from temp.
:::

## Exercise: Swap glasses

::: übung l04-glaeser-tauschen
titel: Swap glasses
auftrag: The left glass holds juice, the right one water. Swap the contents of the variables `left` and `right` before they are output.
Do not change the first two boxes. Insert new statements between them instead.
start: l04-tauschen-start.visustruct
test: - -> Left: water | Right: juice
braucht: anweisung
tipp: How do you swap two full glasses in real life? You need a third, empty glass.
tipp: Create a temporary variable with `String temp = left`. After that you need two more assignments.
lösung: l04-tauschen-loesung.visustruct
:::

## Now in Java

As in lesson 4, you can also write a sequence directly in Java. The swap from above looks like this:

```java editor
int a = 5;
int b = 9;
int temp = a;
a = b;
b = temp;
System.out.println("a = " + a);
System.out.println("b = " + b);
```

- Every box becomes one line. The lines run from top to bottom, just like the boxes.
- Every statement ends with a **semicolon** `;`.
- An output is called `System.out.println(…)` in Java. Mind the capital S in `System`: Java tells upper and lower case apart.

You type Java in the [Code](#zeige-codelive) area to the right of the structure chart. While you type, VisuStruct builds the structure chart along with it. So you see straight away which box belongs to which line.

::: übung l05-java-kino
titel: Cinema tickets in Java
code: java
auftrag: A cinema ticket costs 9 euros. Write a Java program that calculates the price of 3 tickets and outputs **Total: 27**.
  “Open in editor” also opens the Code area on the right. Type your code there; the structure chart builds itself. Then click Check.
test: - -> Total: 27
braucht: anweisung
tipp: You need three variables: the price, the number of tickets and the result. Every line ends with a semicolon.
tipp: `int price = 9;` and `int count = 3;` create the variables. `int total = price * count;` calculates, and `System.out.println("Total: " + total);` outputs the result.
lösung: l05-java-kino-loesung.visustruct
:::

## Fill in the gaps: swapping glasses

::: lückentext
titel: Swap two values
auftrag: The values of `a` and `b` should be swapped. Fill in the missing words.
```java
int a = 3;
int b = 8;
[[int]] temp = [[a]];
a = [[b]];
b = [[temp]];
System.out.println("a = " + a + ", b = " + b);
```
erklärung: First you save `a` in the helper variable, then `a` gets the value of `b`, and finally `b` gets the saved value. Output: **a = 8, b = 3**
:::

## Find the bug: credit

::: übung l05-java-fehler
titel: Fix the credit
code: java
auftrag: The canteen card holds 20 euros. A meal costs 7 euros. The program should output the credit **after** paying, so **Left: 13**. But it outputs **Left: 20**.
  “Open in editor” shows the code in the Code area. Find the bug, fix it and click Check.
start: l05-java-fehler-start.visustruct
test: - -> Left: 13
braucht: anweisung
tipp: All lines are right, only their order is not. When is the credit output, and when is the meal paid?
tipp: Swap the last two lines: first `credit = credit - price;`, then the output.
lösung: l05-java-fehler-loesung.visustruct
:::

## Why doesn’t it run?

::: übung l05-java-laeuft-nicht
titel: Share a pizza
code: java
auftrag: A pizza has 8 slices and 4 friends share it. The program should output **Everyone gets 2 slices.** But it doesn’t run.
  “Open in editor” shows the code in the Code area. Click “Run” and read the error message. Fix the bug and click Check.
start: l05-java-laeuft-nicht-start.visustruct
test: - -> Everyone gets 2 slices.
braucht: anweisung
tipp: Compare the name in the output letter by letter with the name created in the third line.
tipp: The variable is called `perPerson` with a capital P (camelCase). Write it exactly like that in the output.
lösung: l05-java-laeuft-nicht-loesung.visustruct
:::

## Game: Sort the boxes

::: spiel reihenfolge
titel: Game: Sort the boxes
intro: Ludwig has mixed up the boxes. Put them in the right order. Four rounds.

runde:
frage: At the end, **7** should be output.
- `int number = 3`
- `number = number * 2`
- `number = number + 1`
- `output: number`
> First double, then add 1: 3 · 2 + 1 = 7. The other way round you'd get (3 + 1) · 2 = 8.

runde:
frage: At the end, **8** should be output.
- `int number = 3`
- `number = number + 1`
- `number = number * 2`
- `output: number`
> The same boxes, a different order, a different result: (3 + 1) · 2 = 8.

runde:
    int a = 3
    int b = 5
frage: a and b should swap their values.
- `int temp = a`
- `a = b`
- `b = temp`
- `output: a + " " + b`
> First a is saved in temp. Otherwise the old value is gone as soon as a gets the value of b.

runde:
frage: Ludwig makes tea.
- Fill the kettle with water
- Switch the kettle on
- Wait until the water boils
- Pour the water over the tea bag
- Let the tea brew
> Every step needs the one before. Just like in a structure chart.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain that a sequence runs from top to bottom. → Step by step
- I can explain why the order of the steps matters. → Order matters
- I can swap two values with a temporary variable. → Swap two values
- I can write a sequence in Java. → Now in Java
:::

## Quiz

::: quiz
? How often does each box of a sequence run?
→ Step by step
- [ ] Until a condition is false
- [x] Exactly once
- [ ] Not at all if it is empty
> In a sequence nothing is repeated and nothing is skipped. Loops are there for repetition.

? At the start a = 5 and b = 9. Then `a = b` runs and after that `b = a`. What is in the variables at the end?
→ Swap two values
- [ ] a = 9 and b = 5
- [x] a = 9 and b = 9
- [ ] a = 5 and b = 5
> After `a = b` the old value 5 is lost. `b = a` then only copies the 9 back.

? Why do you need a temporary variable when swapping?
→ Swap two values
- [x] So that a value is not overwritten before it is needed
- [ ] So that the structure chart gets longer
- [ ] Because otherwise you cannot output variables

? What does the sequence `int x = 4`, `x = x + 1`, `x = x * 3`, `output: x` output?
→ Order matters
- [ ] 13
- [x] 15
- [ ] 4
> First x becomes 5, then 15.

? What does every statement end with in Java?
→ Now in Java
- [ ] With a full stop .
- [x] With a semicolon ;
- [ ] With a colon :
> If the semicolon is missing, VisuStruct shows a hint below the code.
:::
