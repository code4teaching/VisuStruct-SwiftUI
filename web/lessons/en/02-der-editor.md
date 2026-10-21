---
titel: The editor
bereich: First steps
kurz: Insert elements, type text, move and delete.
---

## The screen

The editor has four areas. Move the mouse over a blue word or tap it, and that area lights up in the editor.

- **At the top, the [toolbar](#zeige-leiste):** New, Open, Save, Export, Undo, Copy and Paste, text size, Code and Simulation.
- **On the left, the [Elements](#zeige-elemente):** Here are all the building blocks you can drag into the structure chart. Some people also call this area the palette.
- **In the middle, the [structure chart](#zeige-struktogramm):** A new diagram contains only an empty placeholder, marked with **ø**.
- **At the bottom, the [Object Inspector](#zeige-objektinspektor):** Here you edit the text of the selected element.

> You can show and hide this learning area at any time with [Learn](#zeige-lernen) in the toolbar. It stays open next to the editor so you can try out right away what you read.

## Insert an element

Drag an element from the **Elements** area onto the structure chart. While you drag, a blue line shows where it will land:

- **Onto the placeholder ø:** The element replaces the placeholder.
- **Onto the top half of a box:** The element goes in front of it.
- **Onto the bottom half of a box:** The element goes after it.

::: grafik l02-einfuegen.svg
Where you drop it decides where the new element lands.
:::

You can also select an element in the Elements area with the keyboard and press **Enter**. Then it is inserted after the selected box.

::: angeberwissen
Grabbing boxes and dragging them around, just like you are doing now, has a fancy name: **direct manipulation**. Ben Shneiderman coined the term in 1982. Yes, the structure chart guy. That man worked harder than I do when I graze. [More about him (in German)](https://visustruct.org/de/angeberwissen.html)
:::

## Type text

Click a box. It gets a blue outline, and its text appears in the Object Inspector below the diagram. Whatever you type there shows up in the diagram straight away.

The box from the Elements area is called a **Statement**. At the top of the Object Inspector you choose what sort of statement it should be:

- **Statement:** calculate or set something, e.g. `int number = 5`. You will learn how in lesson 4.
- **Input:** ask for a value while the chart runs. That comes in lesson 6.
- **Output:** show something. In the diagram it then has `output:` in front, e.g. `output: "Hello"`.

To start with, you only need Output. Texts that should be shown exactly as they are go in **quotation marks**.

::: diagramm l2-ausgabe.visustruct
Two outputs one after the other. Open the diagram in the editor and start the simulation to see the output.
:::

## Move, copy, delete

- **Move:** Drag an existing box to a new place with the mouse.
- **Copy and paste:** Select a box, then press Ctrl+C and Ctrl+V (on a Mac ⌘C and ⌘V). The copy goes after the selected box.
- **Delete:** Select a box and press Del.
- **Undo:** Ctrl+Z undoes the last step, Ctrl+Shift+Z brings it back.

## Exercise: Hello World

::: übung l2-hallo
titel: Hello World
auftrag: Build a structure chart that outputs **Hello World**.
Drag a Statement onto the placeholder, set it to **Output** in the Object Inspector and type `"Hello World"`.
test: - -> Hello World
braucht: anweisung
tipp: You only need one single box. The text that should appear goes into the text field in the Object Inspector.
tipp: Watch out for the quotation marks. Without them, VisuStruct looks for a variable called Hello.
lösung: l2-hallo-loesung.visustruct
:::

Click **Check** when you are done. VisuStruct runs your structure chart and compares the output.

## Exercise: Two lines

::: übung l2-zwei-zeilen
titel: Two lines
auftrag: First output **Hello** and then **I am learning structure charts**, each on its own line.
test: - -> Hello | I am learning structure charts
tipp: Two lines means two outputs. The boxes sit on top of each other and run from top to bottom.
tipp: Every output is a box of its own. Drag the second Statement onto the bottom half of the first one.
lösung: l2-zwei-zeilen-loesung.visustruct
:::

## Checklist

::: checkliste
- I can insert an element from the Elements area and replace a placeholder. → Insert an element
- I can change the text of a box and switch between Statement, Input and Output. → Type text
- I can move, copy and delete boxes and undo steps. → Move, copy, delete
:::

## Quiz

::: quiz
? What does the sign ø in a box mean?
- [ ] The box contains a mistake.
- [x] There is still an empty placeholder here.
- [ ] The program ends here.
> A placeholder is replaced when you drag an element onto it.

? You drag a Statement onto the bottom half of a box. Where does it land?
- [ ] In front of it
- [x] After it
- [ ] The box is replaced.

? How do you output the text Good morning exactly as it is?
- [ ] output: Good morning
- [x] output: "Good morning"
- [ ] input: "Good morning"
> Without quotation marks, Good morning is understood as the name of a variable.
:::
