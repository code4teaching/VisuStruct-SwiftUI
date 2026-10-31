---
titel: Simulation and desk check
bereich: Basics
kurz: Run a structure chart step by step, work it out by hand and find mistakes.
---

## Skills I will gain now

::: kompetenzen
- start the simulation, pause it, run single steps and stop it
- read the variables, the output and the last step during the simulation
- do a desk check by hand as a table
- tell syntax errors, runtime errors and logic errors apart
- find a mistake by comparing the values with what I expect
- follow Java code with Step and breakpoints
:::

## Start the simulation

Before branches and loops come along, you get to know your most important tool. From now on you can use the simulation to check every exercise yourself.

With the [▶︎ Start simulation](#zeige-simulation) button on the right of the tools, VisuStruct runs your structure chart. While the simulation is running, you cannot edit the diagram. The same button is then called **■ End simulation**; it takes you back to editing.

On the right, the **Controls** appear:

- **Play** runs the diagram automatically, step by step. You set how long it waits between two steps under **Pause per step**.
- **Pause** stops for a moment. Then you carry on with Play or Step.
- **Step** runs exactly one step. That way you can watch calmly.
- **Stop** cancels and resets everything to the start.

Open the following diagram in the editor and go through it with **Step**:

::: diagramm sim-tausch.visustruct
The values of a and b are swapped. The variable temp keeps one value meanwhile.
:::

## What the simulation shows

- **Highlight:** One box in the diagram is coloured. With **Last step** it is the box that has just run. With **Next step** it is the box that comes next.
- **Input:** If the diagram asks for a value, you type it in here and confirm with **OK**.
- **Last Step:** Here you see what has just happened, e.g. `a = 5 -> 5` after the box `a = b`. On the left, the variables have already been replaced by their values; to the right of the arrow is the result.
- **Variables:** All variables with their current values.
- **Output:** Everything that was output with `output:`.

If the [Code](#zeige-codelive) area is open on the right, the [console](#zeige-konsole) runs along there as well. It is cleared at the start and then shows output and input just as they would appear in the real program.

At the end, **Simulation finished.** appears. If something goes wrong, the simulation stops on the faulty box and shows a message, e.g. **Unknown variable: total**.

## The desk check

In a **desk check** you play the computer yourself. You go through the structure chart with pen and paper and write down the values of the variables after every step. It is best to make a table: one column for the step, one for each variable and one for the output.

For the diagram above, the table looks like this:

| Step | a | b | temp | Output |
|---|---|---|---|---|
| `int a = 3` | 3 | – | – | |
| `int b = 5` | 3 | 5 | – | |
| `int temp = a` | 3 | 5 | 3 | |
| `a = b` | 5 | 5 | 3 | |
| `b = temp` | 5 | 3 | 3 | |
| `output: "a = " + a` | 5 | 3 | 3 | a = 5 |
| `output: "b = " + b` | 5 | 3 | 3 | b = 3 |

Then compare your table with the simulation. Do the values under **Variables** match your row after every step?

> A desk check is especially useful in tests. There you have no computer, but you can still show what your structure chart does.

::: angeberwissen
“Computer” used to be a job: people who did calculations with pencil, paper and a calculating machine. One of the best was the mathematician Katherine Johnson at NASA. She calculated flight paths for space capsules, and later also for the Apollo 11 flight to the Moon.

In 1962 John Glenn was to become the first American to orbit the Earth. A new IBM computer had calculated the flight path. Glenn did not fully trust the machine and said: “Get the girl to check the numbers. If she says they’re good, I’m ready to go.” Katherine Johnson checked everything by hand, a real desk check. Her numbers were right, and Glenn flew.

Katherine Johnson was Black, and at that time laws in the US state of Virginia separated Black and white people. In the film “Hidden Figures” (2016) she has to run across the whole site every time she needs the toilet. The film exaggerates this: separate toilets really existed, but Katherine Johnson said she simply ignored the sign.

Her colleague Dorothy Vaughan saw early on that the IBM computers would take over the calculating work. She taught herself and her whole team the programming language FORTRAN. That is how human computers became programmers.
:::

::: bild katherine-johnson.jpg
Katherine Johnson (1918–2020), mathematician at NASA (photo: [NASA](https://commons.wikimedia.org/wiki/File:Katherine_Johnson_1983.jpg), public domain).
:::

## Three kinds of errors

Errors are part of programming, even for professionals. There are three kinds, and you find each of them in a different way:

- **Syntax error**: The text breaks the rules of the language, e.g. a `;` is missing at the end. The program does not start at all.
- **Runtime error**: The program starts but stops at one point, e.g. when it divides by 0.
- **Logic error**: The program runs to the end, but the result is wrong, e.g. because brackets are missing: `a + b / 2` instead of `(a + b) / 2`.

This is how VisuStruct shows you the errors:

- **Syntax error:** They happen less often in a structure chart, because the boxes give you the shape. In the [Code](#zeige-codelive) area the spot is underlined in red, the line number turns red, and you read e.g. **Line 2: Still missing here: ;**.
- **Runtime error:** The simulation stops on the box and reports e.g. **Division by zero.** In the Code area the line number turns red, and the [console](#zeige-konsole) names the line: **Line 3: Division by zero.**
- **Logic error:** Nobody reports anything here. The computer does not know what you actually wanted. Only you know the right result, so the desk check helps here.

> A red line number shows an error. The round red dot in front of the line number is something else: a breakpoint. You will meet it below in “Now in Java”.

## Find mistakes

If a structure chart outputs something wrong, that is a logic error. Then do this:

1. **Write down what you expect:** What should come out for a particular input?
2. **Run it step by step:** Start the simulation with **Step** and watch the variables.
3. **Find the spot:** Where does a value first differ from what you expected? That is exactly where the mistake is.

Common mistakes in a sequence are:

- The **order** is wrong: a variable is used before it has a value.
- A value is **overwritten** before it is needed.
- **Brackets** are missing: `a + b / 2` is not the same as `(a + b) / 2`.
- Two whole numbers are divided: `7 / 2` gives `3`, because with `int` everything after the decimal point is dropped.

> Later, branches and loops come along. Then the simulation also shows you which path is taken and how often a loop runs.

::: angeberwissen
On 9 September 1947 Grace Hopper’s team found a real moth stuck between two contacts in the Harvard Mark II computer. They taped it into the logbook and wrote: “First actual case of bug being found.” Today the moth is in a museum in Washington.

Grace Hopper was one of the first programmers in the world. In 1952 she built one of the first **compilers**: a program that translates code into machine code. She believed people should be able to give computers instructions in almost normal English. This led to the programming language COBOL, which many banks still use today. She even became an admiral in the US Navy.
:::

::: bild grace-hopper.jpg
Grace Hopper (1906–1992), computer scientist and admiral (photo: [U.S. Navy](https://commons.wikimedia.org/wiki/File:Commodore_Grace_M._Hopper,_USN_(covered).jpg), public domain).
:::

## Exercise: Fix the swap

::: übung sim-tausch
titel: Fix the swap
auftrag: The structure chart should read in two numbers and output them swapped. So with 3 and 5, first **5** and then **3** should appear. But it outputs 5 twice.
  Do a desk check or use **Step** and fix the mistake.
start: sim-tausch-start.visustruct
test: 3, 5 -> 5 | 3
test: 1, 2 -> 2 | 1
test: 7, 7 -> 7 | 7
braucht: anweisung
tipp: Go through the diagram with **Step** and write down the values of a and b after every step. Where does the 3 disappear?
tipp: Look at a after the step `a = b`. Where did the old value of a go? Keep it in a temporary variable first, as in the example above.
lösung: sim-tausch-loesung.visustruct
:::

## Exercise: Fix the cinema tickets

::: übung sim-kino
titel: Fix the cinema tickets
auftrag: A cinema ticket costs 8.50 euros. The structure chart should ask for the number of tickets and output the total price, so for 2 tickets `Total: 17.0`.
  Start the simulation. It stops with an error message. Find out why and fix the structure chart.
start: sim-kino-start.visustruct
test: 2 -> Total: 17.0
test: 3 -> Total: 25.5
test: 0 -> Total: 0.0
braucht: anweisung
tipp: Read the error message of the simulation carefully. Which variable does it not know yet?
tipp: The simulation runs the boxes from top to bottom. Does total already have a value when the output comes? You can move boxes with the mouse.
lösung: sim-kino-loesung.visustruct
:::

> If a simulation keeps running forever, click **Stop**. When you **Check** an exercise, VisuStruct stops by itself after a very large number of steps.

## Now in Java

You can run Java code step by step too. In the [Code](#zeige-codelive) area the tool for this is called the **debugger**:

- Click a line number on the left. A red dot appears: that is a **breakpoint**. [▶︎ Run](#zeige-ausfuehren) pauses before this line.
- The [Step](#zeige-einzelschritt) button runs exactly one line, like **Step** in the simulation.
- Below the code you see the current value of every variable. That is your desk check, except that the computer writes it down for you.

::: übung l07-java-pizza
titel: Fix the pizza order
code: java
auftrag: A pizza costs 8 euros, extra cheese 2 euros. For 3 pizzas with extra cheese the program should output **Total: 30**. But it outputs 14.
  Go through the Java code with Step and watch `total`. Find the mistake and fix it in the code.
start: l07-java-pizza-start.visustruct
test: - -> Total: 30
braucht: anweisung
tipp: What value is in `total` after the fourth line? Work out in your head what Java calculates first.
tipp: As in maths, multiplication comes before addition: `price + cheese * count` is `8 + 6`. Add brackets: `(price + cheese) * count`.
lösung: l07-java-pizza-loesung.visustruct
:::

## Fill in the gaps: desk check

::: lückentext
titel: What is in the variables?
auftrag: Do a desk check in your head. After each line, write down the value the variable has afterwards, and in the last line what is output.
```java
int a = 5;
int b = 2;
a = a + b;      // a is now [[7]]
b = a * 2;      // b is now [[14]]
a = b - a;      // a is now [[7]]
System.out.println(a + b);      // output: [[21]]
```
erklärung: Each line calculates with the values that are in the variables right now: a = 5 + 2 = 7, b = 7 · 2 = 14, a = 14 − 7 = 7, output 7 + 14 = 21. You can check it with Step in the Code area.
:::

## Find the bug: score

::: übung l07-java-fehler
titel: Fix the score
code: java
auftrag: In a game Ludwig first gets 10 points, then 5 points, then he loses 3 points. At the end **Points: 12** should appear. But **Points: 3** appears.
  Go through the code with Step and watch `points`. Fix the wrong line and click Check.
start: l07-java-fehler-start.visustruct
test: - -> Points: 12
braucht: anweisung
tipp: After which line does `points` suddenly have the value 3? What should actually happen in that line?
tipp: Ludwig loses 3 points, so 3 is subtracted from the old value: `points = points - 3;`
lösung: l07-java-fehler-loesung.visustruct
:::

## Game: Defuse the bomb

::: spiel bombe
titel: Game: Defuse the bomb
intro: Every program contains **exactly one mistake**, and the bomb is ticking. Do the desk check in your head and tap the wrong line before time runs out. The programs are in Java, but every line is a box like in the structure chart. Six rounds, 30 seconds each.
zeit: 30

runde:
    int a = 3;
    int b = 5;
    int temp = a;
    a = b;
    b = a;
frage: Should swap the values of a and b.
fehler: 5
besser: b = temp;
> a already holds the value of b. The old value of a is in temp.

runde:
    int a = 4;
    int b = 6;
    double mean = a + b / 2;
    System.out.println(mean);
frage: Should output the mean 5.0.
fehler: 3
besser: double mean = (a + b) / 2.0;
> Without brackets the division comes first: 4 + 6 / 2 = 7.

runde:
    int tickets = 3;
    double price = 8.5;
    double total = tickets + price;
    System.out.println("Total: " + total);
frage: Should output the price for 3 cinema tickets at €8.50 each.
fehler: 3
besser: double total = tickets * price;
> For the total price you multiply, you don't add.

runde:
    int minutes = 135;
    int hours = minutes / 60;
    int rest = minutes / 60;
    System.out.println(hours + " h " + rest + " min");
frage: Should output 2 h 15 min.
fehler: 3
besser: int rest = minutes % 60;
> `%` gives the remainder of a division. With `/` rest would hold a 2 as well.

runde:
    String name = "Ada";
    System.out.println("Hello " + "name" + "!");
frage: Should output "Hello Ada!".
fehler: 2
besser: System.out.println("Hello " + name + "!");
> In quotation marks, name is just a text. The variable has no quotation marks.

runde:
    double price = 100;
    price = price * 0.1;
    System.out.println(price);
frage: Should raise the price by 10 %, so output 110.0.
fehler: 2
besser: price = price + price * 0.1;
> Times 0.1 only gives the 10 %, so 10.0. That has to be added to the old price.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can start the simulation, pause it, run single steps and stop it. → Start the simulation
- I can read the variables, the output and the last step during the simulation. → What the simulation shows
- I can do a desk check by hand as a table. → The desk check
- I can tell syntax errors, runtime errors and logic errors apart. → Three kinds of errors
- I can find a mistake by comparing the values with what I expect. → Find mistakes
- I can follow Java code with Step and breakpoints. → Now in Java
:::

## Quiz

::: quiz
? Which button runs exactly one step?
→ Start the simulation
- [ ] Play
- [x] Step
- [ ] Stop
> Play keeps going automatically, Step runs only one step.

? What do you write down after every step in a desk check?
→ The desk check
- [ ] Only the output at the end
- [x] The current values of all variables
- [ ] The generated Java code
> That way you see exactly where a value is different from what you expected.

? First `int a = 3`, then `int b = 5`, then `a = b`. What values do a and b have afterwards?
→ The desk check
- [ ] a = 5 and b = 3
- [x] a = 5 and b = 5
- [ ] a = 3 and b = 5
> The old value of a has been overwritten. That is why you need a temporary variable when swapping.

? The Last Step field shows `price = 4 * 2.5 -> 10.0`. What does that mean?
→ What the simulation shows
- [ ] The variable price now has the value 4.
- [x] 4 * 2.5 was worked out and the result 10.0 was stored in price.
- [ ] The simulation has found a mistake.

? The simulation reports **Unknown variable: sum**. What is a likely reason?
→ Find mistakes
- [x] sum is used before it has been given a value.
- [ ] sum is too big.
- [ ] The structure chart has too many boxes.

? What does a red dot in front of a line number in the Code area do?
→ Now in Java
- [ ] It marks an error.
- [x] The program pauses before this line.
- [ ] The line is skipped.
> That is a breakpoint. ▶︎ or Step carries on.
? Match each error to its kind.
→ Three kinds of errors
= The semicolon at the end of the line is missing. -> Syntax error
= The program divides by 0 and stops. -> Runtime error
= The average is too big because brackets are missing. -> Logic error

? The program runs to the end without any message but prints 12 instead of 21. What kind of error is that?
→ Three kinds of errors
- [ ] Syntax error
- [ ] Runtime error
- [x] Logic error
> There is no message, but the result is still wrong. You only find an error like this with your expectation and a desk check.
:::
