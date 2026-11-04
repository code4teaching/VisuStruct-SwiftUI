---
titel: What is a structure chart?
bereich: First steps
kurz: Show and read algorithms as a series of clear steps.
---

## Skills I will gain now

::: kompetenzen
- explain what an algorithm is
- read a structure chart
- recognise the three basic building blocks: sequence, branch and loop
:::

## An algorithm is an exact set of instructions

An **algorithm** describes step by step how to solve a task. Every step must be so clear that someone can carry it out without asking, a person just as well as a computer.

You know algorithms from everyday life: a recipe, directions to a place or the instructions for building a wardrobe.

::: diagramm l1-tee.visustruct
Making tea as a structure chart: every box is one step.
:::

::: angeberwissen
Baaah, who wrote the first program? A woman, back in 1843, long before the first computer! **Ada Lovelace** described step by step how Charles Babbage's *Analytical Engine* should calculate the so-called Bernoulli numbers. That was a real algorithm for a machine. The instructions were meant to be stored on punched cards (more on this in lesson 3). However, the machine was never built.

Ada had another brilliant idea: a machine like this can do more than calculate. It could also work with letters, symbols or even music. That is exactly what computers do today. A programming language called **Ada** is named after her.
:::

::: bild ada-lovelace.jpg
Ada Lovelace (1815–1852), mathematician (picture: watercolour by Alfred Edward Chalon, around 1840, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ada_Lovelace_portrait.jpg), public domain).
:::

## How to read a structure chart

You read a structure chart **from top to bottom**. Every box is one step. Only when a step is finished does the next one start.

This way of drawing was invented by **Isaac Nassi and Ben Shneiderman** (1973). That is why it is also called a Nassi-Shneiderman diagram. In Germany it is standardised as DIN 66261.

::: bild ike-nassi.jpg ben-shneiderman.jpg
Left: Isaac “Ike” Nassi (photo: [Ed Schipul](https://commons.wikimedia.org/wiki/File:Me_with_Ike_Nassi!!!!!_%286893328729%29.jpg), [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), cropped), right: Ben Shneiderman (photo: [Robert Kosara](https://commons.wikimedia.org/wiki/File:Ben_Shneiderman_at_UNCC_%283x4_cropped%29.jpg), CC0).
:::

> A structure chart always has exactly one start (at the top) and one end (at the bottom). There are no arrows and no jumps all over the place. Programs that jump all over the place are called **spaghetti code**, because their flow gets tangled like noodles on a plate. More on this in the next lesson.

::: angeberwissen
Baaah, listen up! In 1972 Nassi and Shneiderman were still PhD students at Stony Brook University near New York. Shneiderman was about 25 and Nassi about 23. So basically two students who wrote computer science history on the side.
:::

## Building block 1: the sequence

Every algorithm can be built from just **three basic building blocks**: **sequence**, [**branch**]{.blau} and [**loop**]{.rosa}. The colours help you match them: [statements]{.gelb} are yellow, branches blue, loops pink. The sequence has no colour of its own, it is simply the row of statements one below the other. You see the same colours in the editor and later in the code. You can switch them off in the settings under “Colored blocks”. In this step and the next two you get to know them one by one.

The **sequence** is the simplest building block: several statements run **one after another**, each exactly once.

This is what it looks like:

- Every statement is a **simple rectangle**.
- The rectangles sit **on top of each other** without a gap.
- They run from top to bottom, one statement after the other.

::: diagramm l1-sequenz.visustruct
Four statements as a sequence. First you get up, then you brush your teeth, and so on.
:::

> The tea example above is a sequence, too.

::: angeberwissen
15 minutes! That is how long Shneiderman needed for the first sketch with sequence, branch and loop. I need longer than that to choose between hay and clover.
:::

## Building block 2: the branch

Often the next step depends on a **condition**. A condition is a question you can only answer with **yes or no**, for example *Is it raining?* In VisuStruct yes is **true** and no is **false**.

For decisions like this there is the **branch**. This is what it looks like:

- At the top, the condition sits in a **triangle**.
- Below it, the box splits into **two columns**: on the left the path for **true**, on the right the path for **false**.
- **Only one** of the two paths ever runs. After that, both paths continue together below the branch.

::: diagramm l1-verzweigung.visustruct
If it is raining, the left path runs, otherwise the right one. After that, both cases continue with “Leave”.
:::

> If nothing should happen in one case, that path stays empty. The sign **ø** shows this.

::: angeberwissen
Spelling alert! It is Shneiderman, with no c. Anyone who writes “Schneiderman” gets a gentle nudge from my horns. He himself points out that people keep sneaking a c into his name.
:::

## Building block 3: the loop

If something should happen **several times**, you do not write it down several times. Instead you use a **loop**, also called repetition.

This is what it looks like:

- At the top is the condition, for example *Plate not empty*.
- The steps that are repeated are **indented** below it. At the top and on the left, the box forms an **upside-down L** around them.
- Before every pass the condition is checked. As long as it is **true**, the steps inside the upside-down L run once more. If it is **false**, the program continues below the loop.

::: diagramm l1-wiederholung.visustruct
As long as the plate is not empty, you take a bite. After that, the plate is cleared.
:::

> There are more kinds of loops. You will meet them in later lessons.

## All three together

The building blocks become really useful when you combine them. This diagram contains all three: a sequence from top to bottom, a [branch]{.blau} and a [loop]{.rosa}. The yellow boxes are simple [statements]{.gelb}. The statements inside a branch or a loop are yellow too. Strictly speaking, the whole diagram is a sequence, because the branch and the loop also stand in the row from top to bottom.

::: diagramm l1-grundbausteine.visustruct
You recognise the branch by its triangle and the loop by its upside-down L. Everything together sits in a sequence.
:::

The boxes can also be **nested** inside each other: a loop or a path can contain sequences, branches and loops again.

::: angeberwissen
Comfort for anyone who has messed up a test: the famous journal *Communications of the ACM* rejected the structure chart article. According to Nassi, the reviewer even said they should collect every copy and burn it. Ouch! It then appeared in 1973 in a smaller journal and today it is quoted thousands of times. Ha!
:::

## Structure first, then code

When you program, two things happen at once: you have to think about the steps and pay attention to how the programming language is written. A structure chart lets you keep the two apart.

1. First you think about the **logic**: which steps, which conditions, which repetitions?
2. Then you translate the finished structure into **Java, Python or JavaScript**. VisuStruct can even generate the code for you.

With the **simulation** you can also run your structure chart step by step and check whether it really does what it should.

## Game: Which building block?

::: spiel frage
titel: Game: Which building block?
intro: Ludwig describes things from his everyday life. Which of the three building blocks is hidden in each? Eight rounds.
antworten: sequence | branch | loop

runde:
frage: "Toothpaste on the brush, brush your teeth, rinse your mouth."
richtig: sequence
> Three steps, each exactly once and always in this order.

runde:
frage: "If it rains, take the umbrella, otherwise the sunglasses."
richtig: branch
> A condition decides which of the two ways is taken.

runde:
frage: "Stir until the dough is smooth."
richtig: loop
> Stirring is repeated as long as the dough isn't smooth yet.

runde:
frage: "Run ten laps around the sports field."
richtig: loop
> The same lap is run ten times.

runde:
frage: "Shoes on, jacket on, door open, off you go."
richtig: sequence
> One step after the other, nothing is skipped or repeated.

runde:
frage: "If the light is green, you cross the street."
richtig: branch
> Even without "otherwise" it is a branch. The otherwise branch is simply empty.

runde:
frage: "Roll the dice until you get a six."
richtig: loop
> You don't know beforehand how often. You roll until the condition is met.

runde:
frage: "If someone says 'Come in', you go in. Otherwise you wait at the door."
richtig: branch
> The answer decides between two ways: go in or wait.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain what an algorithm is. → An algorithm is an exact set of instructions
- I can read a structure chart from top to bottom. → How to read a structure chart
- I can name the three basic building blocks: sequence, branch and loop. → Building block 1: the sequence
- I can recognise every building block in a structure chart by its shape. → All three together
:::

## Quiz

::: quiz
? In which direction do you read a structure chart?
→ How to read a structure chart
- [ ] From left to right
- [x] From top to bottom
- [ ] From bottom to top
> Every box is one step, and the steps follow each other from top to bottom.

? Which building block is NOT one of the three basic building blocks?
→ Building block 1: the sequence
- [ ] Sequence
- [ ] Branch
- [x] Jump
- [ ] Loop
> There are no jumps in a structure chart. Sequence, branch and loop are enough for every algorithm.

? How do you recognise a branch in a structure chart?
→ All three together
- [ ] By an upside-down L
- [x] By a triangle with the condition and two columns below it
- [ ] By several rectangles on top of each other
> The upside-down L belongs to the loop, and rectangles on top of each other are a sequence.

? When does the inside of a loop run once more?
→ All three together
- [x] As long as the condition is true
- [ ] Only if the condition is false
- [ ] Always exactly twice
> The condition is checked before every pass. If it is false, the program continues below the loop.

? What is an algorithm?
→ An algorithm is an exact set of instructions
- [x] Clear step-by-step instructions for solving a task
- [ ] A particular program in Java
- [ ] A picture that explains a program
> An algorithm does not depend on a programming language. A structure chart is one way to write it down.
:::
