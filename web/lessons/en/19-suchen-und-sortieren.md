---
titel: Searching and sorting
bereich: Basics
kurz: Use playing cards to understand how linear search, binary search and bubble sort work, and why some methods are much faster.
---

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

## Checklist

::: checkliste
- I can explain how linear search goes through an array. → Look for a card
- I can build a linear search as a structure chart. → Exercise: Find a card
- I know why binary search only works with sorted values. → Binary search: sorted is faster
- I can explain why binary search is much faster with many values. → How fast is it?
- I can show one round of bubble sort with playing cards. → Sorting with bubble sort
:::

## Quiz

::: quiz
? What does binary search need?
- [ ] The array must have exactly 100 slots.
- [x] The values must be sorted.
- [ ] The value you are looking for must be there.
> Only with sorted values do you know, after looking at the middle, which half to keep searching in.

? A sorted array has 1,000 values. How many comparisons does binary search need at most?
- [ ] 500
- [ ] 100
- [x] 10
> 1,000 → 500 → 250 → 125 → 63 → 32 → 16 → 8 → 4 → 2 → 1: after about 10 halvings, one value is left.

? What does bubble sort compare in every step?
- [ ] The first and the last card
- [x] Two neighbouring cards
- [ ] Every card with the middle
> If the larger card is on the left, the neighbours are swapped.

? Where is the largest card after the first round of bubble sort?
- [ ] On the far left
- [ ] In the middle
- [x] On the far right
> It is swapped on with every comparison and rises to the right like a bubble.

? What does `position = -1` mean in linear search?
- [x] The card has not been found (yet).
- [ ] The card is right at the back.
- [ ] The array is empty.

? Match each method to the right description.
= Linear search -> look at one card after another
= Binary search -> look at the middle and drop one half
= Bubble sort -> compare neighbours and swap them
:::
