---
titel: Nesting
bereich: Basics
kurz: Combine branches inside loops and loops inside loops.
---

## Building blocks inside each other

You now know all the important building blocks: sequence, branch, switch and three kinds of loops. They only get really powerful together.

Every path and every loop body is a sequence itself. You may put any element there, including more branches and loops. This is called **nesting**.

> To do this, simply drag an element onto the placeholder ø inside a loop or a path.

## A branch inside a loop

The loop goes through all the numbers, and the branch decides for each single number whether something happens. That way you can count, for example, how many even numbers there are from 1 to n.

::: diagramm l13-gerade-zaehlen.visustruct
In every pass the branch checks with i % 2 == 0 whether i is even. Only then is count increased by 1. The false path stays empty.
:::

With n = 7 these are the numbers 2, 4 and 6, so 3 is output.

## Exercise: Count even inputs

::: übung l13-gerade-eingaben
titel: Count even inputs
auftrag: Ask for exactly **five** whole numbers, one after another. Then output how many of them were even.
test: 1, 2, 3, 4, 5 -> 2
test: 2, 4, 6, 8, 10 -> 5
test: 1, 3, 5, 7, 9 -> 0
test: 10, 11, 0, 7, 8 -> 3
braucht: forSchleife, verzweigung
tipp: Doing the same thing five times means: loop. In every pass a number is read in and checked.
tipp: A for loop from 1 to 5. Inside, first comes the input `input: int number "Enter a number"`, below it a branch with `number % 2 == 0`. In the true path you increase `count` by 1.
lösung: l13-gerade-eingaben-loesung.visustruct
:::

## A loop inside a loop

If one loop sits inside another, the **inner loop runs all the way through in every pass of the outer one**. With this you can build patterns of rows and columns.

::: diagramm l13-dreieck.visustruct
The outer loop counts the lines. The inner one adds as many stars to the text as the line number says. With n = 3 you get a triangle of 1, 2 and 3 stars.
:::

With `String text = ""` every line starts empty. `text = text + "*"` adds a star. Only when the line is finished is it output.

## Exercise: Rectangle

::: übung l13-rechteck
titel: Rectangle
auftrag: Ask for a width and a height. Output a rectangle made of `#`: as many lines as the height, and in each line as many `#` as the width.
test: 3, 2 -> ### | ###
test: 1, 3 -> # | # | #
test: 4, 1 -> ####
test: 2, 2 -> ## | ##
braucht: forSchleife
tipp: You need two loops inside each other: one for the lines and inside it one for the characters of a line.
tipp: Build it like the triangle. The difference: the inner loop always counts up to `width`, not up to the line number. The outer loop counts up to `height`.
lösung: l13-rechteck-loesung.visustruct
:::

## Keep track

With nested diagrams, the drawing helps you: whatever is further inside is indented and surrounded by its loop or path.

- Read from the outside in: what repeats? What is decided in every pass?
- Give counter variables meaningful names such as `line` and `column`. Two loops must not change the same counter variable.
- Go through an example in the simulation with **Step** and watch the variables.

::: angeberwissen
This is exactly what the structure chart was invented for. Shneiderman asked himself: if we are supposed to do without GOTO, why not do without the arrows in the flowchart as well? The result: no arrow spaghetti, and every block stays nicely in its pen. [The whole story](https://visustruct.org/en/angeberwissen.html)
:::

## Checklist

::: checkliste
- I can put a branch inside a loop. → A branch inside a loop
- I can put a loop inside another loop. → A loop inside a loop
- I know that the inner loop runs all the way through in every pass of the outer one. → A loop inside a loop
:::

## Quiz

::: quiz
? The outer loop runs 3 times, the inner one 4 times. How often does the inside of the inner loop run in total?
- [ ] 7 times
- [x] 12 times
- [ ] 4 times
> In each of the 3 outer passes, the inner loop runs 4 times, so 3 · 4 = 12.

? How can you tell whether a number is even?
- [ ] `number / 2 == 0`
- [x] `number % 2 == 0`
- [ ] `number == 2`
> % gives the remainder of a division. For even numbers, the remainder when dividing by 2 is zero.

? There is a branch inside a for loop. How often is the condition of the branch checked?
- [ ] Once
- [x] Once per pass of the loop
- [ ] Only if it is true
> The branch is part of the inside and runs in every pass.
:::
