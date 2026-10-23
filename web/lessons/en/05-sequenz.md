---
titel: Sequence
bereich: Basics
kurz: Run steps one after another, watch the order and swap values.
---

## Step by step

A **sequence** is a series of steps that run exactly once and in exactly this order. In the structure chart the boxes simply sit on top of each other.

Each box only starts when the box above it is finished. Nothing is skipped and nothing is repeated.

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

A structure chart is a plan. For a computer to carry it out, you write it down in a programming language, for example in **Java**. The swap from above looks like this in Java:

```
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

You type Java in the [Programming](#zeige-codelive) area to the right of the structure chart. While you type, VisuStruct builds the structure chart along with it. So you see straight away which box belongs to which line.

::: übung l05-java-kino
titel: Cinema tickets in Java
code: java
auftrag: A cinema ticket costs 9 euros. Write a Java program that calculates the price of 3 tickets and outputs **Total: 27**.
  “Open in editor” also opens the Programming area on the right. Type your code there; the structure chart builds itself. Then click Check.
test: - -> Total: 27
braucht: anweisung
tipp: You need three variables: the price, the number of tickets and the result. Every line ends with a semicolon.
tipp: `int price = 9;` and `int count = 3;` create the variables. `int total = price * count;` calculates, and `System.out.println("Total: " + total);` outputs the result.
lösung: l05-java-kino-loesung.visustruct
:::

## Checklist

::: checkliste
- I know that a sequence runs from top to bottom. → Step by step
- I can explain why the order of the steps matters. → Order matters
- I can swap two values with a temporary variable. → Swap two values
- I can write a sequence in Java. → Now in Java
:::

## Quiz

::: quiz
? How often does each box of a sequence run?
- [ ] Until a condition is false
- [x] Exactly once
- [ ] Not at all if it is empty
> In a sequence nothing is repeated and nothing is skipped. Loops are there for repetition.

? At the start a = 5 and b = 9. Then `a = b` runs and after that `b = a`. What is in the variables at the end?
- [ ] a = 9 and b = 5
- [x] a = 9 and b = 9
- [ ] a = 5 and b = 5
> After `a = b` the old value 5 is lost. `b = a` then only copies the 9 back.

? Why do you need a temporary variable when swapping?
- [x] So that a value is not overwritten before it is needed
- [ ] So that the structure chart gets longer
- [ ] Because otherwise you cannot output variables

? What does the sequence `int x = 4`, `x = x + 1`, `x = x * 3`, `output: x` output?
- [ ] 13
- [x] 15
- [ ] 4
> First x becomes 5, then 15.

? What does every statement end with in Java?
- [ ] With a full stop .
- [x] With a semicolon ;
- [ ] With a colon :
> If the semicolon is missing, VisuStruct shows a hint below the code.
:::
