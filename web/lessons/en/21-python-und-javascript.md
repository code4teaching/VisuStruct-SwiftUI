---
titel: Python and JavaScript
bereich: From structure chart to code
kurz: Generate Python and JavaScript code from the structure chart and run JavaScript straight in the browser.
---

## Skills I will gain now

::: kompetenzen
- choose and compare Python and JavaScript in the code view
- explain that Python forms blocks by indentation and needs no data types
- explain what VisuStruct adjusts when translating to Python
- run JavaScript with Test in browser
:::

## The same diagram, three languages

In the code view ([Code](#zeige-code) in the tools) you choose the language at the top. The structure chart stays the same; only the way it is written changes. That way you can compare the languages easily.

::: diagramm l18-beispiel.visustruct
A number is made smaller by 3 again and again until it is no longer greater than 0.
:::

## Python

For the diagram above, VisuStruct generates this Python code:

```
number = int(input("Start value?"))
while number > 0:
    print(number)
    number = number - 3
print("End")
```

What is different in Python compared with Java:

- There are **no semicolons** and **no curly brackets**. Python recognises what belongs to a loop or a branch by the **indentation** alone. After `while`, `if` and `else` there is a colon.
- Variables get **no data type**: `int number = 5` becomes `number = 5`.
- Output is called `print(…)`, input `input(…)`. For a number, `int(…)` goes around it.
- In Python, arrays are called **lists**: `int[] numbers = {2, 4, 6}` becomes `numbers = [2, 4, 6]`, and `numbers.length` becomes `len(numbers)`.
- A simple for loop such as `int i = 0`, `i < 5`, `i++` becomes `for i in range(5):`.

## What to watch out for in Python

In some places Python is stricter than Java. That is why VisuStruct translates the Java way of writing things when it exports:

- **Text and number with +:** `"Sum: " + sum` becomes `"Sum: " + str(sum)`. Without `str(…)`, Python stops with an error.
- **There is no i++:** it becomes `i += 1`.
- **&&, || and !** are called `and`, `or` and `not` in Python, and `true` and `false` become `True` and `False`.
- **Whole-number division:** In Python, `7 / 2` always gives 3.5. If the structure chart divides two `int` values, VisuStruct writes `7 // 2`, which gives 3, just like in Java.
- **For loops:** Counting loops become `for … in range(…)`, also with `i <= n`, counting backwards or steps such as `i = i + 2`. If a loop does not fit that pattern, it becomes a `while` loop.
- **There is no do-while:** it becomes `while True:` with `if not (…): break` at the end.

If a diagram is marked as **pseudocode**, only a note appears above the code. Then the text is a sketch and not a runnable program.

## JavaScript

The same diagram in JavaScript:

```
"use strict";

let number = parseInt((prompt("Start value?") ?? "0"), 10);
while (number > 0) {
    console.log(number);
    number = number - 3;
}
console.log("End");
```

JavaScript looks similar to Java: curly brackets, semicolons, `while (…)` and `if (…)`. The differences:

- Variables are created with `let`, without a data type. Constants with `const`.
- Output is called `console.log(…)`, input `prompt(…)`. `parseInt(…)` turns the input into a whole number.
- Arrays go in square brackets: `let numbers = [2, 4, 6];`.
- `"use strict";` at the very top makes JavaScript complain about typos in variable names.
- JavaScript has only one number type. If the structure chart divides two `int` values, VisuStruct writes `Math.trunc(a / b)`. Then the digits after the decimal point are dropped, just like in Java.

::: angeberwissen
JavaScript has almost nothing to do with Java. Brendan Eich built it in 1995 in just ten days for the Netscape browser. First it was called Mocha, then LiveScript. Because everyone was excited about Java at the time, it was renamed JavaScript shortly before launch, for advertising reasons. People have been mixing the two up ever since. Programmers say: Java is to JavaScript as car is to carpet.
:::

## Run JavaScript in the browser

JavaScript is the language of browsers. That is why VisuStruct can **run the code straight away**:

::: angeberwissen
Why are links in the browser blue, anyway? In 1985 Ben Shneiderman's team tested which colour is easy to see but does not get in the way when you read. Light blue won. Red stood out more, but people remembered the text less well afterwards.
:::

1. Choose **JavaScript** in the code view.
2. Click **Test in browser**.
3. Whatever `console.log` outputs appears under **Output**. If the program asks for a value with `prompt`, type it in and click **OK**.
4. **Stop** cancels the program.

VisuStruct stops an endless loop `while (true)` by itself after 100,000 passes and reports **Execution stopped: possible infinite loop.**

> In JavaScript code, a **Call** needs a subprogram with that name, otherwise JavaScript reports an error. Unlike the simulation, the browser does not look in the other tabs.

## Exercise: Python as a structure chart

This Python program outputs all even numbers from 0 up to a limit:

```
limit = int(input("Up to which number?"))
for i in range(0, limit + 1, 2):
    print(i)
```

`range(0, limit + 1, 2)` means: start at 0, stop before `limit + 1`, count in steps of two.

::: übung l18-python
titel: Even numbers
auftrag: Rebuild the Python program above as a structure chart with a for loop. With the limit 7 it outputs 0, 2, 4 and 6.
test: 7 -> 0 | 2 | 4 | 6
test: 4 -> 0 | 2 | 4
test: 0 -> 0
braucht: forSchleife
tipp: `range(0, limit + 1, 2)` counts from 0 up to the limit in steps of two. That is a for loop.
tipp: The three fields of the for loop are `int i = 0`, `i <= limit` and `i = i + 2`.
lösung: l18-python-loesung.visustruct
:::

## Exercise: JavaScript as a structure chart

```
let age = parseInt((prompt("How old are you?") ?? "0"), 10);
if (age >= 16) {
    console.log("You may vote.");
} else {
    let years = 16 - age;
    console.log("Wait " + years + " more years.");
}
```

::: übung l18-js
titel: Voting from 16
auftrag: Rebuild the JavaScript code above as a structure chart. Then test in the code view with **JavaScript** and **Test in browser** whether your code outputs the same as the simulation.
test: 12 -> Wait 4 more years.
test: 16 -> You may vote.
test: 13 -> Wait 3 more years.
test: 40 -> You may vote.
braucht: verzweigung
tipp: Read the code line by line. `if` and `else` become a branch.
tipp: `prompt` and `parseInt` together are one input: `input: int age "How old are you?"`. The false path holds two boxes: first `int years = 16 - age`, then the output.
lösung: l18-js-loesung.visustruct
:::

## Game: Which language?

::: spiel frage
titel: Game: Which language?
intro: Ludwig has mixed up lines from three languages. Can you tell where each comes from? Eight rounds.
frage: Which language is this written in?
antworten: Java | Python | JavaScript

runde:
    print(number)
richtig: Python
> In Python the output is called `print(…)`, without a semicolon.

runde:
    console.log(number);
richtig: JavaScript
> `console.log` is the output in JavaScript.

runde:
    System.out.println(number);
richtig: Java
> The long output with `System.out` only exists in Java.

runde:
    let numbers = [2, 4, 6];
richtig: JavaScript
> `let` and square brackets: an array in JavaScript.

runde:
    for i in range(5):
richtig: Python
> A colon instead of curly brackets, and `range`: typical Python.

runde:
    int[] numbers = {2, 4, 6};
richtig: Java
> Only Java writes the data type `int[]` in front.

runde:
    number = int(input("Start value?"))
richtig: Python
> No data type in front of the variable, no semicolon, and `int(…)` around the input.

runde:
    let number = parseInt(prompt("Start value?"), 10);
richtig: JavaScript
> `prompt` asks for a value in the browser, `parseInt` turns it into a number.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can choose and compare Python and JavaScript in the code view. → The same diagram, three languages
- I can explain that Python forms blocks by indentation and needs no data types. → Python
- I can explain what VisuStruct adjusts when translating to Python. → What to watch out for in Python
- I can run JavaScript with Test in browser. → Run JavaScript in the browser
:::

## Quiz

::: quiz
? How does Python recognise which lines belong to a loop?
→ Python
- [ ] By the curly brackets
- [x] By the indentation
- [ ] By the semicolon at the end of the line

? What is `output: sum` in JavaScript?
→ The same diagram, three languages
- [ ] print(sum)
- [ ] System.out.println(sum);
- [x] console.log(sum);

? Which language can VisuStruct run straight in the browser?
→ Run JavaScript in the browser
- [ ] Java
- [ ] Python
- [x] JavaScript
> Every browser can run JavaScript. For Java and Python you need a program of its own.

? What happens in Python with `print("Sum: " + sum)` if sum is the number 7?
→ What to watch out for in Python
- [ ] Sum: 7 is output.
- [x] Python reports an error, because text and a number cannot be joined with +.
- [ ] Sum: is output.
> str(sum) turns the number into text.
:::
