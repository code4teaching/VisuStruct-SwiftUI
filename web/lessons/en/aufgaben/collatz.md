---
titel: Collatz sequence
nach: 11
stufe: 2
---

The Collatz sequence is a famous puzzle in mathematics. You start with a number and apply the same rule again and again:

- If the number is **even**, you divide it by 2.
- If it is **odd**, you multiply it by 3 and add 1.

So far, for every start number anyone has tried, the sequence ends at 1 at some point. Whether this is true for all numbers, nobody knows to this day.

::: übung aufgabe-collatz
titel: Collatz sequence
auftrag: Ask for a start number. Apply the rule until the number is 1, and output the new number after every step. Count the steps as you go and output **Steps:** and the count at the end.
  With the start number 6 the sequence is 3, 10, 5, 16, 8, 4, 2, 1. That is 8 steps.
test: 6 -> 3 | 10 | 5 | 16 | 8 | 4 | 2 | 1 | Steps: 8
test: 3 -> 10 | 5 | 16 | 8 | 4 | 2 | 1 | Steps: 7
test: 1 -> Steps: 0
braucht: whileSchleife, verzweigung
tipp: You do not know how many steps there will be. That is why a while loop fits better than a for loop.
tipp: The while loop runs as long as `number != 1`. You check whether a number is even with `number % 2 == 0`. The output and `steps++` come after the branch, but still inside the loop.
lösung: aufgabe-collatz-loesung.visustruct
:::

::: angeberwissen
This task could make you rich! The mathematician Paul Erdős offered 500 dollars for a proof. In 2021 the Japanese company Bakuage added quite a bit more: 120 million yen, about a million dollars at the time, for a proof or a counterexample. Nobody has collected the money yet. By the way, the puzzle was invented by the German mathematician Lothar Collatz in 1937. I am going to start calculating right now; that much money buys a lot of hay.
:::
