---
titel: Structure chart and editor
bereich: Getting started
kurz: What a structure chart is, how to use the editor and how to save your programs.
---

## Skills I will gain now

::: kompetenzen
- explain what an algorithm and a structure chart are
- recognise the three building blocks sequence, branch and repetition
- insert, move and delete elements in the editor
- save a structure chart and open it again
:::

## A plan for the robot

A robot does not think for itself. It does exactly what is in its program, no more and no less. So before you program it, you need an exact plan. Such an exact step-by-step instruction is called an **algorithm**.

A **structure chart** draws the plan as boxes. You read it from top to bottom. Each box is one step. It was invented in 1973 by Isaac Nassi and Ben Shneiderman, which is why it is also called a **Nassi-Shneiderman diagram**.

::: diagramm vb-l00-sequenz-loesung.visustruct
Drive forward, turn right, drive forward: three boxes, from top to bottom.
:::

::: angeberwissen
Ada Lovelace wrote the first program for a machine back in 1843, for a calculating machine that was never finished. Even then she guessed that such machines would one day do more than calculate, for example make music. Your mBot2 can do both.
:::

## Three building blocks

Every program, including one for a robot, is made of only three building blocks:

| Building block | What it does | Example with the mBot2 |
|---|---|---|
| **Sequence** | steps one after the other | drive forward, turn, drive forward |
| **Branch** | one thing or the other, depending on a condition | Is the wall close? Then turn, otherwise drive forward. |
| **Repetition** | steps several times | do the same thing four times |

In a structure chart you see the building blocks straight away: the branch has a triangle and two columns: **true** on the left, **false** on the right. The repetition (loop) wraps around its boxes like a tilted L.

::: diagramm vb-l00-bausteine-loesung.visustruct
All three building blocks: first a box, then a loop, inside it a branch.
:::

## The editor

The [structure chart editor](#zeige-editor) has several areas. Move the mouse over a blue word or tap it, and the area lights up:

- **On the left the [Elements](#zeige-elemente):** all building blocks to drag in. The group **mBot2 commands** has the commands for the mBot2 such as **drive forward** and **turn right**.
- **In the middle the [structure chart](#zeige-struktogramm):** a new diagram only contains an empty placeholder, shown as **ø**.
- **Below it the [Object Inspector](#zeige-objektinspektor):** here you change the text of the selected box, for example `mbot.forward(30)` instead of `mbot.forward()`. You can drag the line with the grip above it up or down.
- **Above it the [tools](#zeige-werkzeuge):** undo, copy, delete, export and, on the right, the **simulation**.

This is how you build:

- **Insert:** drag an element from the Elements onto the structure chart. On the placeholder **ø** it replaces it. On the top half of a box it goes before it, on the bottom half after it. A blue line shows you where it lands.
- **Change text:** double-click a box, or double-tap it on a tablet. Then you type right in the structure chart, **Enter** takes it.
- **Move:** drag a box to another place.
- **Delete:** click the box and press Delete, or click the [trash can](#zeige-loeschen).
- **Undo:** Ctrl+Z, on a Mac ⌘Z.

> 🧩 **Prefer blocks like in Scratch?** Set the switch in the tools to [Beginner](#zeige-bloecke). Then you see the same program as blocks that snap together, plus short lessons to try things out. You type numbers right into the white fields and drag sensors in. **Pro** takes you back to the structure chart and these lessons. It stays the same program, so you can switch at any time.

::: übung vb-erster-plan
titel: Round the corner
auftrag: Build a structure chart: the mBot2 drives forward, turns right, drives forward, turns left and drives forward once more. Then start the simulation and watch.
fahrt: forward, turnRight, forward, turnLeft, forward
braucht: anweisung
tipp: Drag **drive forward** onto the placeholder ø. Drag each next command onto the bottom half of the last box.
tipp: From top to bottom: **drive forward**, **turn right**, **drive forward**, **turn left**, **drive forward**.
lösung: vb-erster-plan-loesung.visustruct
:::

> When you are done, click **Check** in the exercise. VisuStruct then runs your structure chart and checks whether the mBot2 drives exactly as required. Later it often checks your program in several worlds, for example once with a wall and once without. If it doesn't work, the **hints** help you.

## Saving and opening

- **[Save](#zeige-speichern)** (Ctrl+S, on a Mac ⌘S): the structure chart is saved as a file ending in `.visustruct`. The [title](#zeige-titel) above the structure chart suggests the file name.
- **[Open](#zeige-oeffnen)** (Ctrl+O, on a Mac ⌘O): load a saved file again.

In the column [📁 Files](#zeige-dateien) you set up a folder once, your **workspace**. All your programs and your learning progress go there. You can take the folder with you and carry on at home.

> 📘 **More without the robot:** VisuStruct has the lessons ["What is a structure chart?"](?visustruct&lektion=01-was-ist-ein-struktogramm), ["The editor"](?visustruct&lektion=02-der-editor) and ["Save, open, export"](?visustruct&lektion=03-speichern-oeffnen-exportieren). They open in a new window.

## Game: Which building block?

::: spiel frage
titel: Game: Which building block?
intro: Ludwig describes what his mBot2 should do. Is it a sequence, a branch or a loop? Six rounds.
antworten: sequence | branch | loop

runde:
frage: The mBot2 drives forward, turns right and drives forward again.
richtig: sequence
> Three steps one after another, each exactly once.

runde:
frage: If the wall is close, it turns. Otherwise it drives forward.
richtig: branch
> Depending on the condition, one thing or the other happens.

runde:
frage: It drives forward 10 cm four times.
richtig: loop
> The same step happens several times.

runde:
frage: As long as no line comes, it keeps driving.
richtig: loop
> "As long as" means: again and again until the condition is no longer true.

runde:
frage: If it is standing on red, it beeps.
richtig: branch
> It only beeps if the condition is true.

runde:
frage: It shows "Hello" on the screen and then plays a tone.
richtig: sequence
> Two steps one after another, with no condition and no repetition.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain what an algorithm and a structure chart are. → A plan for the robot
- I can recognise the three building blocks sequence, branch and repetition. → Three building blocks
- I can insert, move and delete elements in the editor. → The editor
- I can save a structure chart and open it again. → Saving and opening
:::

## Quiz

::: quiz
? What is an algorithm?
→ A plan for the robot
- [ ] a part of the mBot2
- [x] an exact step-by-step instruction
- [ ] a programming language
> An algorithm says exactly what happens in which order. The structure chart draws it.
? Which building block decides depending on a condition?
→ Three building blocks
- [ ] the sequence
- [x] the branch
- [ ] the repetition
> The branch has a triangle and two columns for true and false.
? You drag **drive forward** onto the bottom half of a box. Where does it land?
→ The editor
- [ ] before it
- [x] after it
- [ ] it replaces the box
> Top half means before, bottom half means after.
? Which ending does a saved structure chart file have?
→ Saving and opening
- [ ] `.java`
- [x] `.visustruct`
- [ ] `.png`
> `.png` is a picture to pass on. You can only keep editing the `.visustruct` file.
:::
