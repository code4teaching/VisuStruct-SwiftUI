---
titel: Fibonacci numbers
nach: 13
stufe: 2
---

With the Fibonacci numbers, every number is the sum of the two numbers before it. The sequence starts with 1 and 1:

1, 1, 2, 3, 5, 8, 13, 21, …

You find these numbers surprisingly often in nature, for example in the way sunflower seeds are arranged.

::: ludwig
Do you remember **swapping** from lesson 5? There you needed a helper variable, because `a = b` overwrites the old value of `a`. It is the same here: before `number2` gets the new number, its old value must be saved in `number1`. So watch the **order**: first `number1 = number2`, then `number2 = number3`. You will need this moving on and swapping again later, for example when sorting in lesson 19.
:::

::: übung aufgabe-fibonacci
titel: Fibonacci numbers
auftrag: Ask how many Fibonacci numbers should be output. Then output exactly that many, each on its own line. You can assume that at least 2 is typed in.
test: 5 -> 1 | 1 | 2 | 3 | 5
test: 8 -> 1 | 1 | 2 | 3 | 5 | 8 | 13 | 21
test: 2 -> 1 | 1
braucht: forSchleife
tipp: Every new number is the sum of the two before it. So you always have to remember the last two numbers.
tipp: Keep the last two numbers in `number1` and `number2` and output both before the loop. The loop starts at `int i = 2`. Inside it you calculate `int number3 = number1 + number2`, output it and then move on: `number1 = number2` and `number2 = number3`.
lösung: aufgabe-fibonacci-loesung.visustruct
:::

::: quiz
? Why must `number1 = number2` come before `number2 = number3` in the loop?
- [ ] Because otherwise Java does not allow the assignments
- [x] Because otherwise the old value of number2 is overwritten before number1 gets it
- [ ] The order does not matter
> The other way round, number1 and number2 would have the same value afterwards. Just like swapping: first save, then overwrite.
:::
