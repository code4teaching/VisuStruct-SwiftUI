---
titel: The editor
bereich: First steps
kurz: Insert elements, type text, move and delete.
---

## The screen

VisuStruct has two editors: the **structure chart editor**, which this lesson is about, and on the right the [Programming](#zeige-codelive) area for Java code (from lesson 4). If the structure chart editor is collapsed, this lesson opens it for you.

The structure chart editor has several areas. Move the mouse over a blue word or tap it, and that area lights up in the editor.

- **At the very top, the [toolbar](#zeige-leiste):** New, Open and Save. On the far right, the gear for [Settings](#zeige-einstellungen): text size and language.
- **Below it, the [tools](#zeige-werkzeuge)** above the elements and the structure chart: Undo, Cut, Copy, Paste, Delete, Export, Code and Simulation. The buttons only show icons. Hold the mouse over one and its name appears.
- **On the left, the [Elements](#zeige-elemente):** Here are all the building blocks you can drag into the structure chart. Some people also call this area the palette.
- **In the middle, the [structure chart](#zeige-struktogramm):** A new diagram contains only an empty placeholder, marked with **ø**.
- **At the bottom, the [Object Inspector](#zeige-objektinspektor):** Here you edit the text of the selected element.

> You can collapse this learning area at any time with the [sidebar icon](#zeige-lernen) at the top of this area. Then only the slim “🎓 Learn” strip stays on the left; click it to open the area again. It stays open next to the editor so you can try out right away what you read. In the same way there is the [📁 Files](#zeige-dateien) column on the left for your saved programs (lesson 3) and the [Programming](#zeige-codelive) area on the right for Java (from lesson 4).

## Insert an element

Drag an element from the **Elements** area onto the structure chart. While you drag, a blue line shows where it will land:

- **Onto the placeholder ø:** The element replaces the placeholder.
- **Onto the top half of a box:** The element goes in front of it.
- **Onto the bottom half of a box:** The element goes after it.

::: grafik l02-einfuegen.svg
Where you drop it decides where the new element lands.
:::

It also works without dragging: **click** an element in the Elements area (or tap it). Then it is inserted after the selected box. If the placeholder **ø** is selected, it replaces it.

With the keyboard, press **Tab** to jump to an element and press **Enter**. The new element also goes after the selected box.

::: angeberwissen
Grabbing boxes and dragging them around, just like you are doing now, has a fancy name: **direct manipulation**. Ben Shneiderman coined the term in 1982. Yes, the structure chart guy. That man worked harder than I do when I graze.
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

## Game: Editor pro

::: spiel frage
titel: Game: Editor pro
intro: Ludwig tests whether you have the editor under control. Seven rounds.

runde:
frage: You drag a statement onto the placeholder **ø**. What happens?
- [x] The statement replaces the placeholder.
- The statement goes after the placeholder.
- Nothing, you can't drop anything on ø.
> The placeholder only keeps the place free. The new element takes it.

runde:
frage: You drag an element onto the **top** half of a box. Where does it end up?
- [x] in front of it
- after it
- It replaces the box.
> Top half means in front, bottom half means after. The blue line shows you while dragging.

runde:
frage: You drag an element onto the **bottom** half of a box. Where does it end up?
- in front of it
- [x] after it
- at the very end of the structure chart
> Bottom half means: directly after this box.

runde:
frage: You deleted a box by accident. What brings it back?
- Ctrl+C
- [x] Ctrl+Z
- Ctrl+V
> Ctrl+Z (⌘Z on a Mac) undoes the last step. Ctrl+C copies, Ctrl+V pastes.

runde:
frage: When it runs, exactly **Hello** should appear. What is in the box?
- [x] output: "Hello"
- output: Hello
- "Hello"
> Text that should be shown exactly like that goes in quotation marks. The editor puts `output:` in front when you choose the kind Output.

runde:
frage: Where do you change the text of the selected box?
- in the Elements
- [x] in the Object Inspector
- in the toolbar at the very top
> The Object Inspector below the diagram shows the text of the selected box.

runde:
frage: You click an element in the Elements area without dragging. Where does it end up?
- [x] after the selected box
- at the very beginning
- at the very end
> Without dragging (click, or Tab and Enter) the new element goes after the box that is selected right now.
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
