---
titel: Searching and sorting
bereich: Basics
kurz: Use playing cards to understand how linear search, binary search and bubble sort work, and why some methods are much faster.
---

## Skills I will gain now

::: kompetenzen
- explain how linear search goes through an array
- build a linear search as a structure chart
- explain why binary search only works with sorted values
- explain why binary search is much faster with many values
- show one round of bubble sort with playing cards
- search an array in Java and count matches
:::

## Look for a card

A pile of playing cards lies face down in a row in front of you. You are looking for the 9. What do you do? You turn over one card after another until you find the 9 or have turned over all the cards.

::: grafik ss-lineare-suche.svg
The cards are mixed up. Every card you turn over is one comparison: is this the 9?
:::

This is exactly how **linear search** works: it goes through the array from index 0 to the end and compares every slot with the value it is looking for. It always works, even if the values are mixed up.

In the array our cards are numbers. We leave out jack, queen and king.

::: diagramm ss-lineare-suche.visustruct
The loop runs until the card is found or there is no slot left. The variable comparisons counts how often a comparison was made. In the simulation, look for the 2, the 27 and the 4.
:::

> If the card is not there, `position` stays at **-1**. There is no index -1, so here -1 means “not found”.

## Exercise: Find a card

::: übung ss-karte-suchen
titel: Find a card
auftrag: Create the array `int[] cards = {8, 4, 11, 4, 6}` and ask for a card. Output the position of the **first** matching card, e.g. `Position: 1` for the 4. If the card is not there, output `Not found`.
test: 4 -> Position: 1
test: 6 -> Position: 4
test: 8 -> Position: 0
test: 9 -> Not found
braucht: whileSchleife, verzweigung
tipp: Go through the array from front to back and compare every card with the one you are looking for.
tipp: Rebuild the example above. You do not need the variable comparisons here. The loop has to stop as soon as `position` is no longer -1, otherwise for the 4 you find the second one instead of the first.
lösung: ss-karte-suchen-loesung.visustruct
:::

## Binary search: sorted is faster

Now the cards lie in front of you **sorted**, from small to large. You are looking for the 27. You no longer turn over the first card at the front, but the **middle** one:

- If it is the one you are looking for, you are done.
- If it is smaller, the card you are looking for can only be on the right. The whole left half drops out.
- If it is larger, the right half drops out.

You do the same again with the rest. With every comparison the pile is halved.

::: grafik ss-binaere-suche.svg
Three comparisons instead of fourteen: with every middle, half of the remaining cards drop out.
:::

In the structure chart, two variables remember the range that is still being searched: `left` and `right`. The middle is `(left + right) / 2`. Because this is whole-number division, the result is always a whole index.

::: diagramm ss-binaere-suche.visustruct
The same array as for the linear search. In the simulation, look for the 27 again and compare the output Comparisons with the linear search.
:::

> Binary search **only works with sorted values**. With mixed-up cards, after looking at the middle you do not know which half to keep searching in.

::: angeberwissen
I think of a number from 1 to 100. You may guess, and I only say “higher” or “lower”. With binary search you need at most **7** guesses. For a number up to a million it is at most 20, for a billion 30. Every doubling costs only one single extra guess. This is how databases search millions of entries in a fraction of a second. I search linearly, by the way: I eat the meadow from left to right.
:::

## How fast is it?

How good a method is gets measured by the number of comparisons it needs **in the worst case**. For linear search, that is the case where the card is right at the back or missing.

::: grafik ss-vergleiche.svg
With 100 cards, linear search needs up to 100 comparisons, binary search at most 7.
:::

| Number of cards | Linear search | Binary search |
|---|---|---|
| 10 | 10 | 4 |
| 100 | 100 | 7 |
| 1,000 | 1,000 | 10 |
| 1,000,000 | 1,000,000 | 20 |

Linear search grows at the same rate as the number of cards. With binary search, twice as many cards add only **one** comparison.

## Sorting with bubble sort

For binary search the values must be sorted. One of the simplest ways of sorting is **bubble sort**. You go through the row from left to right and always compare **two neighbours**. If the larger card is on the left, you swap the two.

::: grafik ss-bubblesort.svg
After one round, the largest card is on the far right.
:::

After the first round the largest card is on the far right, like an air bubble rising to the top. That is where the name comes from. Then you repeat the round for the remaining cards. With 5 cards you need 4 rounds.

The structure chart has two for loops inside each other. The outer one counts the rounds, the inner one compares the neighbours `cards[i]` and `cards[i + 1]`. You already know how to swap: it needs a **temporary variable**.

::: diagramm ss-bubblesort.visustruct
The inner loop gets shorter with every round, because the largest cards on the right are already in the right place. Go through it in the simulation with Step and watch the array under Variables.
:::

Bubble sort is easy to understand, but slow. With n cards it needs up to n · (n − 1) / 2 comparisons: with 10 cards 45, with 100 cards already 4,950 and with 1,000 cards almost half a million. You may get to know faster methods such as quicksort later.

## Exercise: Sort descending

::: übung ss-absteigend
titel: Sort descending
auftrag: The start diagram reads in 5 cards and sorts them with bubble sort **ascending**, that is from small to large. Change it so that the cards are output **descending**, the largest first.
start: ss-absteigend-start.visustruct
test: 3, 1, 4, 1, 5 -> 5 | 4 | 3 | 1 | 1
test: 10, 20, 30, 40, 50 -> 50 | 40 | 30 | 20 | 10
test: 2, 9, 2, 7, 6 -> 9 | 7 | 6 | 2 | 2
braucht: forSchleife, verzweigung
tipp: Look at the condition in the branch. It decides when two neighbours are swapped.
tipp: You only need to change one single character. When should two neighbours be swapped if the larger card is supposed to go to the left?
lösung: ss-absteigend-loesung.visustruct
:::

## Now in Java

The linear search from the exercise looks like this in Java:

```java editor
int[] cards = {8, 4, 11, 4, 6};
int wanted = 4;
int position = -1;
int i = 0;
while (position == -1 && i < cards.length) {
    if (cards[i] == wanted) {
        position = i;
    }
    i = i + 1;
}
System.out.println("Position: " + position);
```

- `&&` means “and”: the loop only runs while nothing has been found **and** there are still cards left.
- If the false branch is empty, you simply leave out `else`.
- The swap in bubble sort needs a helper variable in Java too: `int temp = cards[i];`

::: übung l19-java-zaehlen
titel: Count cards
code: java
auftrag: The cards {8, 4, 11, 4, 6} are in an array. Write a Java program that asks for a card and counts how often it appears. It outputs **Count:** and the number.
  For 4 you see **Count: 2**.
test: 4 -> Count: 2
test: 8 -> Count: 1
test: 9 -> Count: 0
braucht: forSchleife, verzweigung
tipp: Unlike the search, you do not stop at the first match. A for loop goes through all cards.
tipp: `for (int i = 0; i < cards.length; i++)` and inside it `if (cards[i] == wanted) { count = count + 1; }`. `count` starts at 0 before the loop.
lösung: l19-java-zaehlen-loesung.visustruct
:::

## Fill in the gaps: bubble sort

::: lückentext
titel: Sorting cards
auftrag: The program sorts the cards in ascending order with bubble sort. Fill in the missing words and symbols.
```java
int[] cards = {5, 2, 8, 1};
for (int round = 0; round < cards.[[length]] - 1; round++) {
    for (int i = 0; i < cards.length - 1; i++) {
        if (cards[i] [[>]] cards[i + 1]) {
            [[int]] temp = cards[i];
            cards[i] = cards[i + 1];
            cards[i + 1] = [[temp]];
        }
    }
}
for (int i = 0; i < cards.length; i++) {
    System.out.println(cards[i]);
}
```
erklärung: If a card is larger than its right neighbour, the two are swapped, with a helper variable as when swapping glasses. After `length - 1` rounds everything is sorted: 1, 2, 5, 8.
:::

## Find the bug: search

::: übung l19-java-fehler
titel: Fix the linear search
code: java
auftrag: The cards {8, 4, 11, 4, 6} are in an array. The program should output the **first** position of the card you are looking for, so for 4 **Position: 1**. But it outputs **Position: 3**.
  “Open in editor” shows the code in the Code area. Find the bug, fix it and click Check.
start: l19-java-fehler-start.visustruct
test: 4 -> Position: 1
test: 6 -> Position: 4
test: 9 -> Position: -1
test: 8 -> Position: 0
braucht: whileSchleife, verzweigung
tipp: The loop always runs up to the last card. What happens when the 4 comes a second time?
tipp: The loop should stop as soon as something has been found: `while (position == -1 && i < cards.length)`.
lösung: l19-java-fehler-loesung.visustruct
:::

## Why doesn’t it run?

::: übung l19-java-laeuft-nicht
titel: Find a card
code: java
auftrag: The cards {8, 4, 11, 4, 6} are in an array. The program searches for the 11 and should output **Position: 2**. But it doesn’t run.
  “Open in editor” shows the code in the Code area. Click “Run” and read the error message. Fix the bug and click Check.
start: l19-java-laeuft-nicht-start.visustruct
test: - -> Position: 2
braucht: forSchleife, verzweigung
tipp: Compare the names in the condition with the names created above.
tipp: The card you are looking for is in `wanted` with a small w: `if (cards[i] == wanted) {`
lösung: l19-java-laeuft-nicht-loesung.visustruct
:::

## Game: Search pro

::: spiel frage
titel: Game: Search pro
intro: Ludwig searches and sorts cards. How fast is it, and what comes out? Seven rounds.

runde:
    int[] cards = {8, 4, 11, 4, 6};
    int wanted = 4;
    int position = -1;
    int i = 0;
    while (position == -1 && i < cards.length) {
        if (cards[i] == wanted) {
            position = i;
        }
        i = i + 1;
    }
    System.out.println("Position: " + position);
frage: What is output?
- [x] Position: 1
- Position: 3
- Position: 2
> The search stops at the first 4. It lies in slot 1, counting from 0.

runde:
    int[] cards = {8, 4, 11, 4, 6};
    int wanted = 7;
frage: With the same linear search: what is in position afterwards?
- 0
- 5
- [x] -1
> The 7 isn't there. position stays -1, which means "not found".

runde:
frage: For which cards does binary search work?
- for all of them
- [x] only for sorted ones
- only for fewer than 100
> Only if the cards are sorted do you know, after looking at the middle, in which half to keep searching.

runde:
frage: How many comparisons does binary search need at most for 100 cards?
- 50
- [x] 7
- 100
> Every comparison halves the pile. Halving 7 times is enough for up to 128 cards, so for 100 as well.

runde:
frage: Instead of 1,000 cards there are now 2,000. How many more comparisons does binary search need at most?
- [x] one
- twice as many
- 1,000
> The first comparison halves 2,000 to 1,000. After that it goes on as before.

runde:
    int[] cards = {5, 3, 8, 1};
frage: One pass of bubble sort compares two neighbours at a time, from left to right. What is the order of the cards afterwards?
- 1, 3, 5, 8
- [x] 3, 5, 1, 8
- 3, 5, 8, 1
> 5 and 3 swap, 5 and 8 stay, 8 and 1 swap. The biggest card is on the far right.

runde:
frage: Bubble sort swaps `cards[i]` and `cards[i + 1]`. What does it need for that?
- [x] a temporary variable
- a second array
- a binary search
> Just like swapping two variables: `int temp = cards[i];`, otherwise a value gets lost.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain how linear search goes through an array. → Look for a card
- I can build a linear search as a structure chart. → Exercise: Find a card
- I can explain why binary search only works with sorted values. → Binary search: sorted is faster
- I can explain why binary search is much faster with many values. → How fast is it?
- I can show one round of bubble sort with playing cards. → Sorting with bubble sort
- I can search an array in Java and count matches. → Now in Java
:::

## Quiz

::: quiz
? What does binary search need?
→ Binary search: sorted is faster
- [ ] The array must have exactly 100 slots.
- [x] The values must be sorted.
- [ ] The value you are looking for must be there.
> Only with sorted values do you know, after looking at the middle, which half to keep searching in.

? A sorted array has 1,000 values. How many comparisons does binary search need at most?
→ How fast is it?
- [ ] 500
- [ ] 100
- [x] 10
> 1,000 → 500 → 250 → 125 → 63 → 32 → 16 → 8 → 4 → 2 → 1: after about 10 halvings, one value is left.

? What does bubble sort compare in every step?
→ Sorting with bubble sort
- [ ] The first and the last card
- [x] Two neighbouring cards
- [ ] Every card with the middle
> If the larger card is on the left, the neighbours are swapped.

? Where is the largest card after the first round of bubble sort?
→ Sorting with bubble sort
- [ ] On the far left
- [ ] In the middle
- [x] On the far right
> It is swapped on with every comparison and rises to the right like a bubble.

? What does `position = -1` mean in linear search?
→ Look for a card
- [x] The card has not been found (yet).
- [ ] The card is right at the back.
- [ ] The array is empty.

? Match each method to the right description.
→ Look for a card
= Linear search -> look at one card after another
= Binary search -> look at the middle and drop one half
= Bubble sort -> compare neighbours and swap them

? Why do you use a for loop for counting and not a search that stops at the first match?
→ Now in Java
- [ ] A for loop is always faster.
- [x] You have to look at every card, otherwise later matches are missing.
- [ ] A while loop cannot go through arrays.
> The card can appear several times. That is why you go through all cards to the end.
:::
