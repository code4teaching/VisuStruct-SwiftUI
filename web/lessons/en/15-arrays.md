---
titel: Arrays
bereich: Basics
kurz: Store many values under one name, reach them with the index and go through them with a loop.
---

## Many values under one name

Imagine you want to store the points from five tests. With five variables `points1` to `points5` that quickly gets confusing. An **array** is a row of slots that all have the same name and the same data type.

You create an array with a statement. After the data type you write square brackets `[]`:

```
int[] numbers = {2, 4, 6, 8, 10}
String[] names = {"Ada", "Ben", "Cem"}
```

The values in the curly brackets go straight into the slots. You can also create an empty array with a fixed number of slots:

```
int[] points = new int[5]
String[] names = new String[3]
```

With `new int[5]` all five slots hold zeros at first, with `new String[3]` empty texts.

## The index starts at 0

Every slot has a number, the **index**. Counting starts at **0**. So with `int[] numbers = {2, 4, 6, 8, 10}`:

- `numbers[0]` is 2
- `numbers[1]` is 4
- `numbers[4]` is 10

::: grafik l14-array.svg
Five slots with the indices 0 to 4. The index is above the slot, the value inside it.
:::

**Why start at 0?** In computer science the index is not “which slot” but the **distance from the start**. The first slot is right at the start, so 0 steps away. The second is 1 step away, the third 2 steps. You know this from a lift: the ground floor is **0**, and the first floor is one level above it.

This gives you a rule worth remembering: with 5 slots the **last index is 4**, always one less than the number of slots.

::: angeberwissen
Counting from 0 is pretty old. The programming language C from 1972 already works like this: the computer knows the address of the first slot, and for `numbers[i]` it simply calculates “start plus i slots further”. With i = 0 it stays at the start, which saves a calculation. Java, Python and JavaScript took this over. By the way, I count my horns from 0 as well: horn 0 on the left, horn 1 on the right.
:::

With the index you read a value or write a new one into it:

```
output: numbers[0]
numbers[1] = 99
```

> An array with 5 slots has the indices 0 to 4. `numbers[5]` does not exist. The simulation then reports an invalid expression.

## The length of an array

`numbers.length` tells you how many slots an array has. With five values it is 5. So the **last** index is always `numbers.length - 1`:

```
output: numbers.length
output: numbers[numbers.length - 1]
```

The second line outputs the last value, however long the array is. VisuStruct also understands `numbers.length()`.

::: übung l14-erster-letzter
titel: First and last value
auftrag: Create the array `int[] values = {4, 8, 15, 16, 23, 42}`. Then output on three lines: the first value, the last value and the number of values.
  For the last value, use the length and do not simply write the index 5.
test: - -> 4 | 42 | 6
braucht: anweisung
tipp: Counting starts at 0, so the first slot has the index 0. And what is the index of the last slot?
tipp: The first value is `values[0]`. The last one is `values[values.length - 1]`. The number of values is `values.length`.
lösung: l14-erster-letzter-loesung.visustruct
:::

## Go through an array with a loop

An array shows its strength together with a **for loop**. The counter variable `i` runs from 0 to the last index and is used as the index:

```
int i = 0
i < numbers.length
i++
```

In the first pass `i` is 0, in the last one 4. Because the condition is `i < numbers.length`, the loop fits any length.

::: diagramm l14-array-durchlaufen.visustruct
The for loop outputs all five values one after another. Under Variables in the simulation, watch i count from 0 to 4.
:::

This is also how you fill an empty array with inputs. As the target of the input you write the slot `names[i]`:

::: diagramm l14-namen-eingeben.visustruct
Three names are asked for and written into the slots 0, 1 and 2.
:::

::: übung l14-rueckwaerts
titel: Print backwards
auftrag: Create an array for 4 whole numbers and read in the 4 numbers with a loop. Then output them in **reverse** order, each on its own line.
test: 1, 2, 3, 4 -> 4 | 3 | 2 | 1
test: 7, 0, 5, 9 -> 9 | 5 | 0 | 7
braucht: forSchleife
tipp: You need two loops: one for reading in from front to back and one for outputting from back to front.
tipp: You create the array with `int[] numbers = new int[4]`. The input is `input: numbers[i] "Enter a number"`. For the second loop you start at `int i = numbers.length - 1`, check `i >= 0` and count down with `i--`.
lösung: l14-rueckwaerts-loesung.visustruct
:::

## Sum and maximum

Two tasks come up with arrays again and again:

- **Sum:** You start with `sum = 0` and add every value in the loop.
- **Maximum:** First you remember the value in slot 0 as the largest so far. In the loop you check every value. If it is larger, it becomes the new maximum.

::: diagramm l14-summe-maximum.visustruct
Sum and maximum in one single pass. The maximum starts with points[0] and not with 0, so that it is also right for negative numbers.
:::

::: übung l14-summe-max
titel: Sum and maximum
auftrag: Read 5 whole numbers into an array. Then output **Sum: …** and on the next line **Maximum: …**.
test: 3, 9, 2, 9, 1 -> Sum: 24 | Maximum: 9
test: 10, 20, 30, 40, 50 -> Sum: 150 | Maximum: 50
test: -5, -2, -9, -1, -3 -> Sum: -20 | Maximum: -1
braucht: forSchleife, verzweigung
tipp: Go through the array with a loop. Add every value to the sum and remember the largest value seen so far.
tipp: Calculate the sum and the maximum in variables of their own and only output them at the end, e.g. with `output: "Sum: " + sum`. If your maximum starts at 0, the third test fails.
lösung: l14-summe-max-loesung.visustruct
:::

## Now in Java

Going through an array looks like this in Java:

```
int[] numbers = {2, 4, 6, 8, 10};
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}
```

- `int[]` means “array of whole numbers”. The values are in curly brackets.
- You create an empty array with 5 slots with `new int[5]`.
- `numbers[i]` is the slot with index `i`, `numbers.length` is the length.

::: übung l15-java-noten
titel: Sum of grades in Java
code: java
auftrag: Create the array `grades` in Java with the values 2, 3, 1 and 4. Add up all grades with a for loop and output **Sum: 10**.
test: - -> Sum: 10
braucht: forSchleife
tipp: Create `int sum = 0;` before the loop. The loop runs from 0 to `grades.length - 1`.
tipp: `int[] grades = {2, 3, 1, 4};`, then `for (int i = 0; i < grades.length; i++) { sum = sum + grades[i]; }` and finally `System.out.println("Sum: " + sum);`.
lösung: l15-java-noten-loesung.visustruct
:::

## Checklist

::: checkliste
- I can create an array with values or with `new int[5]`. → Many values under one name
- I know that the index starts at 0 and that the last index is `length - 1`. → The index starts at 0
- I can go through and fill an array with a for loop. → Go through an array with a loop
- I can calculate the sum and the maximum of an array. → Sum and maximum
- I can create an array in Java and go through it with a loop. → Now in Java
:::

## Quiz

::: quiz
? What does `output: numbers[2]` output with `int[] numbers = {5, 10, 15, 20}`?
- [ ] 10
- [x] 15
- [ ] 20
> Counting starts at 0: numbers[0] is 5, numbers[1] is 10, numbers[2] is 15.

? An array has 8 slots. Which index is the last one?
- [ ] 8
- [x] 7
- [ ] 9
> The last index is always length - 1.

? Which condition fits a for loop that goes through all values of `numbers` and starts at `int i = 0`?
- [x] i < numbers.length
- [ ] i <= numbers.length
- [ ] i > numbers.length
> With <= the loop would also read numbers[length], and that slot does not exist.

? What should the maximum start with before the loop begins?
- [ ] Always with 0
- [x] With the first value of the array
- [ ] With the length of the array
> If it starts with 0, then with only negative numbers the result would be 0, although 0 is not in the array at all.

? What does `output: numbers.length` output with `int[] numbers = {5, 10, 15, 20}`?
- [ ] 3
- [x] 4
- [ ] 20
> length is the number of slots, not the last index and not the last value.

? Which line creates an array with three numbers in Java?
- [x] int[] numbers = {1, 2, 3};
- [ ] int numbers = [1, 2, 3];
- [ ] array numbers = (1, 2, 3);
:::
