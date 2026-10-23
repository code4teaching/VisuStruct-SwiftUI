---
titel: Simulation and desk check
bereich: Basics
kurz: Run a structure chart step by step, work it out by hand and find mistakes.
---

## Start the simulation

Before branches and loops come along, you get to know your most important tool. From now on you can use the simulation to check every exercise yourself.

With the [▶︎ Simulation](#zeige-simulation) button on the right of the tools, VisuStruct runs your structure chart. While the simulation is running, you cannot edit the diagram. With the pencil icon in the same place you go back to editing.

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

If [Live code](#zeige-codelive) is open on the right, the [console](#zeige-konsole) runs along there as well. It is cleared at the start and then shows output and input just as they would appear in the real program.

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

## Find mistakes

If a structure chart outputs something wrong, do this:

1. **Write down what you expect:** What should come out for a particular input?
2. **Run it step by step:** Start the simulation with **Step** and watch the variables.
3. **Find the spot:** Where does a value first differ from what you expected? That is exactly where the mistake is.

Common mistakes in a sequence are:

- The **order** is wrong: a variable is used before it has a value.
- A value is **overwritten** before it is needed.
- **Brackets** are missing: `a + b / 2` is not the same as `(a + b) / 2`.
- Two whole numbers are divided: `7 / 2` gives `3`, because with `int` everything after the decimal point is dropped.

> Later, branches and loops come along. Then the simulation also shows you which path is taken and how often a loop runs.

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

## Checklist

::: checkliste
- I can start the simulation, pause it, run single steps and stop it. → Start the simulation
- During the simulation I can read the variables, the output and the last step. → What the simulation shows
- I can do a desk check by hand as a table. → The desk check
- I can find a mistake by comparing the values with what I expect. → Find mistakes
:::

## Quiz

::: quiz
? Which button runs exactly one step?
- [ ] Play
- [x] Step
- [ ] Stop
> Play keeps going automatically, Step runs only one step.

? What do you write down after every step in a desk check?
- [ ] Only the output at the end
- [x] The current values of all variables
- [ ] The generated Java code
> That way you see exactly where a value is different from what you expected.

? First `int a = 3`, then `int b = 5`, then `a = b`. What values do a and b have afterwards?
- [ ] a = 5 and b = 3
- [x] a = 5 and b = 5
- [ ] a = 3 and b = 5
> The old value of a has been overwritten. That is why you need a temporary variable when swapping.

? The Last Step field shows `price = 4 * 2.5 -> 10.0`. What does that mean?
- [ ] The variable price now has the value 4.
- [x] 4 * 2.5 was worked out and the result 10.0 was stored in price.
- [ ] The simulation has found a mistake.

? The simulation reports **Unknown variable: sum**. What is a likely reason?
- [x] sum is used before it has been given a value.
- [ ] sum is too big.
- [ ] The structure chart has too many boxes.
:::
