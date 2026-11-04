---
titel: What's next?
bereich: Outlook
kurz: Look back at what you learned with the mBot2 and see what is still waiting for you in VisuStruct.
---

## Skills I will gain now

::: kompetenzen
- say which programming basics I learned with the mBot2
- find and fix a mistake in a robot program on my own
- name the topics that are still waiting for me in VisuStruct
:::

## What you can do now

Congratulations, you have finished all the robot lessons! With the mBot2 you learned the **basics of structured programming**:

- reading and building a **structure chart** and checking it with a **desk check**, writing a plan as a **flowchart** and as **pseudocode**,
- **sequence**, **branch** and **switch**, conditions with **and**, **or** and **not**,
- the loops **for**, **while** and **do-while**, also nested, and leaving a loop with **break**,
- **variables**, **data types** and **constants** with `final`, counting, adding up and finding the largest value,
- **arrays** and **strings**,
- your own **methods** with parameters and a return value.

All of this is not just for robots. Every Java program is built from exactly these building blocks, even a game or an app.

::: angeberwissen
Baah, do you know what you actually built with the mBot2? An **embedded system**: a small computer inside a device that measures its surroundings with sensors. Such systems are in washing machines, cars and pacemakers. A modern car has more than a hundred of them. And they are programmed with exactly the building blocks you know now.
:::

## Once more: Why doesn't it run?

One last bug hunt to finish. This time it is a mistake that even professionals often make.

::: übung vb-fehler-23-wie-geht-es-weiter
titel: Why doesn't it run?
code: java
auftrag: The program should drive up to just before the wall, but it doesn't run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-23-wie-geht-es-weiter-start.visustruct
welt: wand-kurz, wand-mittel, wand-lang
tipp: Read the error message carefully. Compare the sensor with the other commands: what comes after `mbot.forward`?
tipp: A command is always followed by round brackets, even if there is nothing inside them. It should be `mbot.getDistance() > 15`.
lösung: vb-bis-wand-loesung.visustruct
:::

## What is still missing

Some programming topics have little to do with the robot. You will find them in **VisuStruct**, the world without the robot. Because you already know the basics, you will make quick progress there. The links open in a new window.

- **Keyboard input:** asking for values while the program runs, in ["Input and output"](?visustruct&lektion=06-eingabe-und-ausgabe).
- **Tables in memory:** arrays with rows and columns, for example for a cinema, in ["Two-dimensional arrays"](?visustruct&lektion=16-zweidimensionale-arrays).
- **Searching and sorting:** finding a value quickly and putting a list in order, in ["Searching and sorting"](?visustruct&lektion=19-suchen-und-sortieren).
- **Other languages:** the same program in Python and JavaScript, in ["Python and JavaScript"](?visustruct&lektion=21-python-und-javascript).
- **Catching crashes:** what happens when someone types "abc" instead of a number, in ["When the program crashes: try and catch"](?visustruct&lektion=22-try-und-catch).
- **Files:** reading and saving text, tables and data, from ["Reading and saving text"](?visustruct&lektion=23-text-einlesen-und-speichern) via ["Tables as CSV"](?visustruct&lektion=25-tabellen-als-csv) to ["Data as JSON"](?visustruct&lektion=26-json).
- **Windows with buttons:** your own programs with a window, a text field and a button, from ["Your first window"](?visustruct&lektion=28-erstes-fenster) to ["Model View Controller"](?visustruct&lektion=40-model-view-controller).

> You don't need the mBot2 for this. But you can come back at any time and teach it new tricks.

## Game: Which world?

::: spiel frage
titel: Game: Which world?
intro: Ludwig has ideas for new programs. Do you learn this with the mBot2 in VisuBot or without the robot in VisuStruct? Eight rounds.
antworten: VisuBot | VisuStruct

runde:
frage: "Drive up to the wall and then beep."
richtig: VisuBot
> Distance sensor, motors and speaker: that is a job for the mBot2.

runde:
frage: "A window with a button that counts to 10."
richtig: VisuStruct
> You build windows with buttons with Swing in VisuStruct.

runde:
frage: "Play a melody that is stored in an array."
richtig: VisuBot
> You learned arrays and melodies with the mBot2's speaker.

runde:
frage: "Read the class's marks from a CSV file."
richtig: VisuStruct
> You learn to read and save files in VisuStruct.

runde:
frage: "If someone types 'abc' instead of a number, the program should not crash."
richtig: VisuStruct
> You catch crashes with try and catch. That is in VisuStruct.

runde:
frage: "Follow a black line with the line sensor."
richtig: VisuBot
> The line sensor sits under the mBot2.

runde:
frage: "Sort ten numbers by size."
richtig: VisuStruct
> Searching and sorting is in VisuStruct. But you can already find the largest value.

runde:
frage: "Save the high score list in a file."
richtig: VisuStruct
> You learn to write files in VisuStruct in "Reading and saving text".
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can say which programming basics I learned with the mBot2. → What you can do now
- I can find and fix a mistake in a robot program on my own. → Once more: Why doesn't it run?
- I can name the topics that are still waiting for me in VisuStruct. → What is still missing
:::

## Quiz

::: quiz
? Do the building blocks from the robot lessons also work for programs without a robot?
→ What you can do now
- [x] Yes, every Java program is built from sequence, branch, loop, variables and methods
- [ ] No, without a robot you need completely different commands
- [ ] Only the loops
> Only the `mbot.` commands belong to the robot. Everything else is ordinary Java.

? Why doesn't `mbot.getDistance > 15` run?
→ Once more: Why doesn't it run?
- [ ] Because 15 is too small
- [x] Because the round brackets after the command are missing
- [ ] Because you have to write `<`
> Without brackets, Java looks for a variable `getDistance` and finds none.

? Where do you learn how a program catches crashes with try and catch?
→ What is still missing
- [ ] In VisuBot
- [x] In VisuStruct
> That is where the lesson "When the program crashes: try and catch" is.

? Which topics do you find in VisuStruct? Choose the right list.
→ What is still missing
- [x] Sorting, files and windows with buttons
- [ ] Line sensor, LEDs and motors
- [ ] Only the for loop
> Line sensor, LEDs and motors belong to the mBot2, and you already know the for loop.
:::
