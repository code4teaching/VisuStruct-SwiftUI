---
titel: Calculator
nach: 10
stufe: 2
---

A small calculator: type in two numbers and an operator, and the result appears.

::: übung aufgabe-rechner
titel: Calculator
auftrag: Ask for two whole numbers and then for an operator as text: `+`, `-` or `*`. Output the result. For any other sign output **Unknown operator**.
test: 3, 4, + -> 7
test: 10, 4, - -> 6
test: 6, 7, * -> 42
test: 1, 2, x -> Unknown operator
braucht: fallauswahl
tipp: Read in all three values. A switch on the operator then decides what is calculated.
tipp: You read in the operator with `input: String operator "Operator"`. The switch checks `operator`, the cases are called `"+"`, `"-"` and `"*"`, and the last case is `default`. In every case, first calculate in a variable and then output it, otherwise `+` only joins the numbers together.
lösung: aufgabe-rechner-loesung.visustruct
:::
