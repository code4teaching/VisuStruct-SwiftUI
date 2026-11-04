---
titel: Flowcharts and pseudocode
bereich: Getting started
kurz: Write the plan for the square as a flowchart and as pseudocode and compare them with the structure chart.
---

## Skills I will gain now

::: kompetenzen
- read a flowchart for the mBot2 and build one myself
- read a plan written as pseudocode
- compare structure chart, flowchart and pseudocode
:::

## Three ways to write down a plan

You know the plan for the square as a **structure chart**: a loop that runs four times, with driving one side and turning right inside it.

There are two more ways to write down the same plan. You will meet both often, in class and on the internet:

- the **flowchart**,
- **pseudocode**, a plan made of text in plain language.

You can't control the mBot2 with them directly. But with all three you can write down a plan before you build it as a structure chart or in Java.

## The flowchart

A flowchart is made of a few symbols connected by **arrows**:

- **Oval:** start or end.
- **Rectangle:** a statement, for example *drive forward 50 cm*.
- **Diamond:** a question with two exits: **yes** and **no**.
- **Parallelogram:** an input or output, for example a text on the screen.
- **Arrow:** shows which step comes next.

A loop has no symbol of its own in a flowchart. You recognise it by an arrow that leads **back up**. As long as the answer in the diamond is **no**, it goes back and the steps run again.

> Careful: in a flowchart an arrow may point anywhere, even all over the place. In big charts this quickly becomes confusing. This is called **spaghetti code**. It can't happen in a structure chart, because there are no arrows.

## Exercise: The square as a flowchart

The mBot2 drives one side, turns right and counts the side. After four sides it shows "Square done!" on the screen.

::: pap
titel: Exercise: The square as a flowchart
auftrag: The places in the chart are empty. Put each element in its place. The shape of the place helps you.
start: Start
anweisung: Drive forward 50 cm
anweisung: Turn right
anweisung: Count the side
frage: 4 sides driven? | nein -> Drive forward 50 cm
ausgabe: Show “Square done!”
ende: End
erklärung: As long as four sides have not been driven yet, the arrow leads from the diamond back to “Drive forward 50 cm”. That is the loop. Showing a text on the screen is an output, so it sits in the parallelogram.
legende: ja
:::

## Pseudocode

**Pseudocode** is text that is laid out like a program but written in plain language. Fixed words like REPEAT, IF and WHILE show the building blocks, and the **indentation** shows what belongs to them. The square looks like this:

```
REPEAT 4 times
    drive forward 50 cm
    turn right
END REPEAT
show "Square done!"
```

And this is the same plan in Java:

```java
for (int i = 0; i < 4; i++) {
    mbot.forward(50);
    mbot.turnRight();
}
mbot.showText("Square done!");
```

Pseudocode has **no fixed way of writing**. Some people write FOR i FROM 1 TO 4, others REPEAT 4 times. All that matters is that anyone can understand it without an explanation. You can't control the computer with it, for that you need Java.

### Comparison

- **Structure chart:** boxes inside each other, the loop is an upside-down L. You see the structure at a glance.
- **Flowchart:** symbols with arrows, the loop is an arrow back up. Very clear, but big charts get confusing.
- **Pseudocode:** text with indentation, the loop sits between REPEAT and END REPEAT. Quick to write and already close to Java.

::: angeberwissen
Baah, who invented flowcharts? A woman and her husband: **Lillian and Frank Gilbreth** presented their "process charts" in 1921, long before the first computer. They used them to draw work steps in factories so they could make them simpler. Lillian Gilbreth had a doctorate in psychology and in 1965 became the first woman elected to the American National Academy of Engineering. Programmers later took over the idea for their plans.
:::

> 📘 **More without the robot:** VisuStruct has the lesson ["Flowcharts and pseudocode"](?visustruct&lektion=01-weitere-darstellungen) with baking a cake as a flowchart and the GOTO command. It opens in a new window.

## Game: Which way of drawing?

::: spiel frage
titel: Game: Which way of drawing?
intro: Ludwig describes a plan for the mBot2 without saying how it is written down. Is it the structure chart, the flowchart or pseudocode? Six rounds.
antworten: structure chart | flowchart | pseudocode

runde:
frage: "An arrow leads from the diamond back to 'Drive forward 50 cm'."
richtig: flowchart
> You recognise a loop in a flowchart by the arrow back up.

runde:
frage: "The loop looks like an upside-down L, with drive forward and turn right inside."
richtig: structure chart
> The upside-down L is the loop in a structure chart.

runde:
frage: "REPEAT 4 times, with two indented lines below."
richtig: pseudocode
> Fixed words and indentation: that is pseudocode.

runde:
frage: "'Square done!' sits in a slanted box."
richtig: flowchart
> The slanted box is the parallelogram for input and output.

runde:
frage: "There are no arrows. If you insert a box, everything below simply moves down."
richtig: structure chart
> Without arrows, no jump in a structure chart can point to the wrong place.

runde:
frage: "Some write FOR i FROM 1 TO 4, others REPEAT 4 times. Both are right."
richtig: pseudocode
> Pseudocode has no fixed way of writing.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can name the elements of a flowchart. → The flowchart
- I can build the square as a flowchart myself. → Exercise: The square as a flowchart
- I can read a plan written as pseudocode. → Pseudocode
- I can compare structure chart, flowchart and pseudocode. → Three ways to write down a plan
:::

## Quiz

::: quiz
? How do you recognise a loop in a flowchart?
→ The flowchart
- [ ] By an upside-down L
- [x] By an arrow that leads back up
- [ ] By the word REPEAT
> The upside-down L belongs to the structure chart, REPEAT to pseudocode.

? Match each flowchart symbol to its meaning.
→ The flowchart
= Oval -> Start or end
= Rectangle -> Statement
= Diamond -> Question with yes and no
= Parallelogram -> Input or output
> "Drive forward 50 cm" is a statement, showing "Square done!" is an output.

? In the square flowchart, the diamond says "4 sides driven?". Where does the arrow lead for **no**?
→ Exercise: The square as a flowchart
- [x] Back to "Drive forward 50 cm"
- [ ] To the end
- [ ] To showing "Square done!"
> With no, the square isn't finished yet, so the mBot2 drives the next side.

? In pseudocode, what shows which lines belong to the loop?
→ Pseudocode
- [ ] An arrow
- [x] The indentation and the END REPEAT
- [ ] The colour
> Everything between REPEAT and END REPEAT is indented and repeated.

? Can the mBot2 run pseudocode directly?
→ Three ways to write down a plan
- [ ] Yes, like Java
- [x] No, pseudocode is only a plan for people
> The mBot2 can run the structure chart or Java. Pseudocode helps with planning.
:::
