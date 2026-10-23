---
titel: Battleship
nach: 16
stufe: 2
---

In the game Battleship the sea is a grid. The columns are called A to E, the rows 1 to 5. In the start diagram the sea is the 2D array `sea`: `true` means that part of a ship is on this square.

::: grafik schiffe-versenken.svg
Grey means `true`: there is a ship here. The small grey numbers are the indices in the array; they start at 0. In the game, on the other hand, the squares are called A to E and 1 to 5.
:::

::: übung aufgabe-schiffe
titel: Battleship
auftrag: Output all squares that have a ship on them, each square on its own line, e.g. **B1**. Go through the sea row by row with two nested loops.
  For the start diagram, **B1**, **C1**, **D1**, **E3**, **E4** and **A5** appear.
start: aufgabe-schiffe-start.visustruct
test: - -> B1 | C1 | D1 | E3 | E4 | A5
braucht: forSchleife, verzweigung
tipp: Go through the sea with two nested loops, just like the cinema. Only output the squares that hold `true`.
tipp: The outer loop counts `row`, the inner one `column`, both from 0. If there is a ship on `sea[row][column]`, you output the letter from `columns[column]` and the row number: `output: columns[column] + (row + 1)`. You need the `+ 1` because the game starts counting at 1.
lösung: aufgabe-schiffe-loesung.visustruct
:::
