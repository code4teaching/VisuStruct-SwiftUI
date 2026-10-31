---
titel: Two-dimensional arrays
bereich: Basics
kurz: Store values in rows and columns, like the seats in a cinema, and go through them with two nested loops.
---

## Skills I will gain now

::: kompetenzen
- create a 2D array and explain what the two numbers mean
- read and write a slot with a row and a seat
- tell `seats.length` and `seats[0].length` apart
- explain in which order two nested loops visit the slots
- create and go through a two-dimensional array in Java
:::

## A cinema as a table

A cinema has several **rows**, and every row has several **seats**. For every seat we want to remember whether its ticket has already been sold. That is a yes-or-no question, so the data type `boolean` fits: `true` means sold, `false` means free.

A normal array is one single row of slots. For the cinema we need a **table** with rows and columns. That is a **two-dimensional array**, 2D array for short. You write two pairs of square brackets for it:

```
boolean[][] seats = new boolean[3][5]
```

That gives 3 rows with 5 seats each, so 15 slots. At the start every slot holds `false`: all seats are free.

::: grafik kino-saal.svg
The first index is the row, the second the seat. Both are counted from 0.
:::

## Reach a slot

For a slot you now need **two** indices: first the row, then the seat.

```
seats[1][2] = true
```

Now seat 2 in row 1 is sold. Reading works the same way: `seats[1][2]` is now `true`.

You can also ask for the size:

- `seats.length` is the number of **rows**, here 3.
- `seats[0].length` is the number of **seats** in row 0, here 5.

::: diagramm kino-verkaufen.visustruct
Three tickets are sold. After that, the diagram outputs the size of the cinema and whether row 1, seat 2 is sold. Watch under Variables in the simulation: seats is shown row by row.
:::

> Just like with a normal array, there is no slot `seats[3][0]`, because the rows are called 0, 1 and 2. The simulation then reports an invalid expression.

## Two loops inside each other

To look at **all** seats, you need two for loops inside each other:

- The **outer loop** counts the row: `row` runs from 0 to 2.
- The **inner loop** counts the seat: `seat` runs from 0 to 4.

::: grafik kino-schleifen.svg
Blue is the outer loop, orange the inner one. The numbers show the order in which the seats come up.
:::

For every row, the inner loop runs **all the way** through once. Only when `seat` has visited all five seats does the outer loop move `row` on by one. Then `seat` starts at 0 again. That way all 3 · 5 = 15 seats come up exactly once.

The conditions are `row < seats.length` and `seat < seats[row].length`. That way the loops fit a cinema of any size.

::: diagramm kino-saalplan.visustruct
The seating plan: for every row, a line of X (sold) and O (free) is put together and output. Go through it with Step and watch how seat keeps starting again from the beginning while row only slowly counts on.
:::

::: angeberwissen
Every phone photo is a 2D array! A photo with 4000 · 3000 pixels has 3000 rows with 4000 slots each, so 12 million pixels. Every slot holds the colour of one dot. When you make a photo brighter, the phone runs over all the pixels with two nested loops. My profile picture, by the way, has only one slot: brown.
:::

## Exercise: Count free seats

::: übung kino-frei
titel: Count free seats
auftrag: In the start diagram three tickets have already been sold. Use two nested loops to count how many seats are still **free**, and output e.g. `Free: 12`.
start: kino-frei-start.visustruct
test: - -> Free: 12
braucht: forSchleife, verzweigung
tipp: Just like for the seating plan, you go over all seats with two loops. Instead of outputting something, you count.
tipp: Before the loops, create `int free = 0`. A seat is free if `seats[row][seat]` is false. The condition for that is `!seats[row][seat]`.
lösung: kino-frei-loesung.visustruct
:::

## Exercise: Sell a ticket

::: übung kino-karte
titel: Sell a ticket
auftrag: The start diagram asks for a row and a seat. If the seat is already sold, output `Already sold`. Otherwise mark it as sold and output e.g. `Sold: row 0, seat 4`.
start: kino-karte-start.visustruct
test: 1, 2 -> Already sold
test: 0, 4 -> Sold: row 0, seat 4
test: 2, 0 -> Sold: row 2, seat 0
braucht: verzweigung
tipp: First check whether the seat is sold. Depending on the answer, something different happens.
tipp: You do not need a loop here. A branch with the condition `seats[row][seat]` is enough. In the false path you set the slot to `true`.
lösung: kino-karte-loesung.visustruct
:::

## Exercise: Times table grid

::: übung kino-einmaleins
titel: Times table grid
auftrag: Create `int[][] table = new int[10][10]` and fill it with the times tables up to 10 using two loops. Then ask for two numbers from 1 to 10 and read the result from the table, e.g. `3 · 4 = 12`.
test: 3, 4 -> 3 · 4 = 12
test: 7, 8 -> 7 · 8 = 56
test: 10, 10 -> 10 · 10 = 100
braucht: forSchleife
tipp: First two nested loops fill the table; after that you read only one single slot.
tipp: The indices run from 0 to 9, but the numbers from 1 to 10. That is why the slot `table[i][j]` holds the value `(i + 1) * (j + 1)`, and for 3 · 4 you read `table[a - 1][b - 1]`.
lösung: kino-einmaleins-loesung.visustruct
:::

## Now in Java

The cinema looks like this in Java:

```java editor
boolean[][] seats = new boolean[3][5];
seats[0][2] = true;
seats[1][1] = true;
seats[1][2] = true;
System.out.println("Rows: " + seats.length);
System.out.println("Seats per row: " + seats[0].length);
System.out.println("Row 1, seat 2 sold? " + seats[1][2]);
```

- Two pairs of square brackets `[][]` stand for a table: first the row, then the seat.
- `seats.length` is the number of rows, `seats[0].length` the number of seats in one row.
- With fixed values you write every row in its own curly brackets: `int[][] t = {{1, 2}, {3, 4}};`

::: übung l16-java-punkte
titel: Add up the points
code: java
auftrag: Three players have played two rounds each. Create the table `points` in Java with the rows {3, 5}, {4, 1} and {2, 2}. Add up all points with two nested for loops and output **Sum: 17**.
test: - -> Sum: 17
braucht: forSchleife
tipp: The outer loop goes through the rows, the inner one through the seats of a row.
tipp: `int[][] points = {{3, 5}, {4, 1}, {2, 2}};` and in the inner loop `sum = sum + points[i][j];`. The inner loop runs up to `points[i].length`.
lösung: l16-java-punkte-loesung.visustruct
:::

## Fill in the gaps: tables

::: lückentext
titel: Adding up all fields
auftrag: The program adds up all numbers in the table. Fill in the missing words and symbols.
```java
[[int]][][] grid = {{1, 2, 3}, {4, 5, 6}};
int sum = 0;
for (int r = 0; r < grid.[[length]]; r++) {
    for (int c = 0; c < grid[r].[[length]]; c++) {
        sum = sum [[+]] grid[r][c];
    }
}
System.out.println("Sum: " + sum);
```
erklärung: `int[][]` is a table. `grid.length` is the number of rows (2), `grid[r].length` the number of fields in row `r` (3). Output: **Sum: 21**
:::

## Find the bug: points

::: übung l16-java-fehler
titel: Fix player 2
code: java
auftrag: In the table `points` each row stands for one player. The program should add up the points of player 2 (row 1), so **Player 2: 11**. Instead it reports an error.
  “Open in editor” shows the code in the Code area. Find the bug, fix it and click Check.
start: l16-java-fehler-start.visustruct
test: - -> Player 2: 11
braucht: forSchleife
tipp: In `points[a][b]`, `a` is the row and `b` the place in the row. Which number stands for the row of player 2?
tipp: The indices are swapped: `points[1][j]` instead of `points[j][1]`.
lösung: l16-java-fehler-loesung.visustruct
:::

## Why doesn’t it run?

::: übung l16-java-laeuft-nicht
titel: Read the score
code: java
auftrag: In the table `points` each row is a player and each column a round. The program should output player 2’s points in round 1, so **Player 2, round 1: 4**. But it doesn’t run.
  “Open in editor” shows the code in the Code area. Click “Run” and read the error message. Fix the bug and click Check.
start: l16-java-laeuft-nicht-start.visustruct
test: - -> Player 2, round 1: 4
braucht: anweisung
tipp: The cells `[1][0]` are right. Look at the name of the table.
tipp: The table is called `points` with a small p: `points[1][0]`
lösung: l16-java-laeuft-nicht-loesung.visustruct
:::

## Game: Which seat?

::: spiel frage
titel: Game: Which seat?
intro: Ludwig is selling cinema tickets. First the row, then the seat, both from 0. Seven rounds.

runde:
    boolean[][] seats = new boolean[3][5];
    System.out.println(seats.length);
frage: What is output?
- [x] 3
- 5
- 15
> `seats.length` is the number of rows.

runde:
    boolean[][] seats = new boolean[3][5];
    System.out.println(seats[0].length);
frage: What is output?
- 3
- [x] 5
- 15
> `seats[0]` is row 0. Its length is the number of seats in this row.

runde:
    int[][] table = new int[4][6];
frage: How many slots does the table have?
- 10
- [x] 24
- 35
> 4 rows with 6 seats each: 4 · 6 = 24.

runde:
    int[][] t = {{1, 2}, {3, 4}};
    System.out.println(t[1][0]);
frage: What is output?
- 2
- [x] 3
- 4
> Row 1 is `{3, 4}`, and seat 0 in it is the 3.

runde:
    boolean[][] seats = new boolean[3][5];
    seats[3][0] = true;
frage: What happens?
- The first seat in row 3 is sold.
- The first seat in the last row is sold.
- [x] There is an error, because the rows are called 0, 1 and 2.
> Just like with a normal array, the last index is one less than the length.

runde:
    int[][] t = {{1, 2, 3}, {4, 5, 6}};
    int sum = 0;
    for (int row = 0; row < t.length; row++) {
        for (int seat = 0; seat < t[row].length; seat++) {
            sum = sum + t[row][seat];
        }
    }
    System.out.println(sum);
frage: What is output?
- 6
- 15
- [x] 21
> The two loops visit all six slots: 1 + 2 + 3 + 4 + 5 + 6 = 21.

runde:
frage: Two loops go through the cinema `new boolean[3][5]`. Which slot comes right after `seats[0][4]`?
- `seats[0][5]`
- [x] `seats[1][0]`
- `seats[1][4]`
> Row 0 is done. The outer loop counts on, and the seat starts again at 0.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can create a 2D array and explain what the two numbers mean. → A cinema as a table
- I can read and write a slot with a row and a seat. → Reach a slot
- I can tell `seats.length` and `seats[0].length` apart. → Reach a slot
- I can explain in which order two nested loops visit the slots. → Two loops inside each other
- I can create and go through a two-dimensional array in Java. → Now in Java
:::

## Quiz

::: quiz
? How many slots does `boolean[][] seats = new boolean[4][6]` have?
→ A cinema as a table
- [ ] 10
- [x] 24
- [ ] 46
> 4 rows with 6 seats each: 4 · 6 = 24.

? What is in all slots after `new boolean[3][5]`?
→ A cinema as a table
- [ ] true
- [x] false
- [ ] Nothing, the slots are empty
> A new boolean array is filled with false. In the cinema that means: all seats are free.

? Two nested loops run over 3 rows with 5 seats. How often does the inside of the **inner** loop run?
→ Two loops inside each other
- [ ] 3 times
- [ ] 8 times
- [x] 15 times
> For each of the 3 rows the inner loop runs 5 times: 3 · 5 = 15.

? Match what each expression means in the cinema.
→ Reach a slot
= seats.length -> Number of rows
= seats[0].length -> Number of seats in row 0
= seats[2][4] -> Row 2, seat 4
= seats[1][0] = true -> Seat 0 in row 1 is sold

? What does `seats.length` give for `new boolean[3][5]`?
→ Reach a slot
- [x] 3, the number of rows
- [ ] 5, the number of seats
- [ ] 15, all seats together
:::
