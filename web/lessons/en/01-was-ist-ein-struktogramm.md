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
- read a flowchart and build one myself
- explain why jumps in a flowchart lead to mistakes
- read a simple algorithm as pseudocode
:::

## An algorithm is an exact set of instructions

An **algorithm** describes step by step how to solve a task. Every step must be so clear that someone can carry it out without asking, a person just as well as a computer.

You know algorithms from everyday life: a recipe, directions to a place or the instructions for building a wardrobe.

::: diagramm l1-tee.visustruct
Making tea as a structure chart: every box is one step.
:::

## How to read a structure chart

You read a structure chart **from top to bottom**. Every box is one step. Only when a step is finished does the next one start.

This way of drawing was invented by **Isaac Nassi and Ben Shneiderman** (1973). That is why it is also called a Nassi-Shneiderman diagram. In Germany it is standardised as DIN 66261.

::: bild ike-nassi.jpg ben-shneiderman.jpg
Left: Isaac “Ike” Nassi (photo: [Ed Schipul](https://commons.wikimedia.org/wiki/File:Me_with_Ike_Nassi!!!!!_%286893328729%29.jpg), [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), cropped), right: Ben Shneiderman (photo: [Robert Kosara](https://commons.wikimedia.org/wiki/File:Ben_Shneiderman_at_UNCC_%283x4_cropped%29.jpg), CC0).
:::

> A structure chart always has exactly one start (at the top) and one end (at the bottom). There are no arrows and no jumps all over the place. Programs that jump all over the place are called **spaghetti code**, because their flow gets tangled like noodles on a plate. More on this in step 10.

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

## Other ways to draw it: the flowchart

There are two more ways to show an algorithm: the **flowchart** and **pseudocode**. You will meet both in class.

Here you see our structure chart for drinking tea from “All three together” once more. Next we look at the flowchart, using the same example.

::: diagramm l1-grundbausteine.visustruct
The tea example as a structure chart: first the cup, then the branch for the sugar, then the loop.
:::

### The same algorithm as a flowchart

::: grafik l01-pap.svg
The tea example as a flowchart. The arrow from “Wait 1 minute” back up forms the loop.
:::

### The symbols

A flowchart is made of a few symbols joined by **arrows**. It is standardised as DIN 66001 (ISO 5807).

- **Oval:** start or end. Every flowchart has exactly one start and one end.
- **Rectangle:** a statement, for example *Put a cup on the table*.
- **Diamond:** a decision. The diamond holds a question, and two arrows lead out of it: **yes** and **no**.
- **Parallelogram:** an input or output. The tea example does not have one.
- **Arrow:** shows which step comes next.

A loop has no symbol of its own in a flowchart. You recognise it by an arrow that leads **back up**.

### The advantages

- **Very easy to read**, even for people who have never seen a flowchart. You simply follow the arrows with your finger.
- Flowcharts are not only used in programming but wherever a process is explained: in user manuals, for troubleshooting (“Is the lamp on? No: is it plugged in?”) or in companies for work processes.

## Exercise: Baking a cake as a flowchart

Now you build a flowchart yourself. Ludwig bakes a cake like this:

He puts the ingredients in the bowl and stirs the batter. If the batter is not smooth yet, he keeps stirring. Once it is smooth, he pours the batter into the tin and bakes the cake for 30 minutes. Then he checks with a wooden skewer: if batter still sticks to it, he bakes for 5 more minutes and checks again. Once the skewer comes out clean, he takes the cake out and calls: “The cake is ready!”

::: pap
titel: Exercise: Baking a cake as a flowchart
auftrag: The places in the chart are empty. Put each element in its place. The shape of the place helps you.
start: Start
anweisung: Put ingredients in the bowl
anweisung: Stir the batter
frage: Batter smooth? | nein -> Stir the batter
anweisung: Pour batter into the tin
anweisung: Bake for 30 minutes
frage: Skewer clean? | nein: Bake 5 more minutes
anweisung: Take the cake out
ausgabe: “The cake is ready!”
ende: End
erklärung: Two loops, two arrows back up: when stirring, the arrow leads back to “Stir the batter”; when baking, it leads from “Bake 5 more minutes” back to the question. The output sits in the parallelogram.
legende: ja
:::

## Drawbacks of the flowchart: jumps

An arrow in a flowchart may lead from any symbol to any other. That sounds handy, but it is dangerous.

In the old days, programs were written exactly like that. Every line had a **number**, and the command **GOTO** jumped to a line number. Every GOTO is an arrow from the flowchart. Our tea example would look like this:

```
10 Put a cup on the table
20 IF no sugar wanted, GOTO 40
30 Add sugar
40 IF tea not too hot, GOTO 70
50 Wait 1 minute
60 GOTO 40
70 Drink the tea
```

### One more line, and the jumps go wrong

Now you improve the algorithm: after the sugar, the tea bag should come out. You insert the new line 40, and all lines below move down one number. But the jumps still point to the old numbers:

```
10 Put a cup on the table
20 IF no sugar wanted, GOTO 40
30 Add sugar
40 Take out the tea bag
50 IF tea not too hot, GOTO 70
60 Wait 1 minute
70 GOTO 40
80 Drink the tea
```

Play it through: line 70 no longer sends you to the check in line 50 but to the tea bag. And when the tea is cool enough, line 50 jumps to line 70 instead of *Drink the tea*. So you keep taking out the tea bag and never drink. With every change you have to check every GOTO. In a big program with hundreds of jumps, something easily goes wrong.

### All over the place: spaghetti code

With arrows you can also jump out of the middle of a loop, or from outside into the middle of a loop. Such jumps quickly make the chart confusing. With many jumps the arrows cross until the chart looks like a plate of spaghetti. That is why it is called **spaghetti code**. You can hardly follow the flow any more, and mistakes hide well.

A structure chart has no arrows. If you insert a box, everything below simply moves down with it, and no jump can point to the wrong place. For leaving a loop early there is a separate, tidy box, the break. You will meet it in lesson 18.

::: angeberwissen
In 1968 the computer scientist Edsger Dijkstra wrote a famous letter: “Go To Statement Considered Harmful”. Since then, programs are built only from sequence, branch and loop. In Java, `goto` is still a reserved word today, but you are not allowed to use it. Baah, I would rather eat spaghetti than program it.
:::

## Pseudocode and comparison

**Pseudocode** is text that looks like a program but is written in plain language. Fixed words such as IF and WHILE show the building blocks, and the **indentation** shows what belongs to them. There are no jumps here either. This is our tea example:

```
Put a cup on the table
IF sugar wanted THEN
    Add sugar
END IF
WHILE tea still too hot
    Wait 1 minute
END WHILE
Drink the tea
```

Pseudocode has **no fixed notation**. Some people write WHEN instead of IF, others use an arrow for assignment (`number ← 5`) or leave out the END lines. All of that is fine. What matters is that anyone can understand it without an explanation. So pseudocode is not another programming language you have to learn.

::: angeberwissen
Does pseudocode look familiar? The programming language Python looks very similar, and that is on purpose: its inventor Guido van Rossum wanted programs to read almost like plain text. Python also uses indentation to show what belongs together. But careful: Python is a real programming language with strict rules. One space too many and the computer complains. Pseudocode is more relaxed, just like me at breakfast.
:::

### Compared

- **Structure chart:** boxes inside boxes, the loop is an upside-down L. You see the structure at a glance, and wild jumps are impossible.
- **Flowchart:** symbols with arrows, the loop is an arrow back up. Very easy to picture, but big charts quickly get confusing, and jumps all over the place are possible.
- **Pseudocode:** text with indentation, the loop sits between WHILE and END WHILE. Quick to write and already close to program code.

> All three describe the same algorithm. Once you can read one form, you learn the others quickly.

::: angeberwissen
Nassi and Shneiderman were out to get the arrows! Their 1973 article was called “Flowchart Techniques for Structured Programming”. With arrows you can jump all over the place until the chart looks like a plate of spaghetti. In a structure chart that is simply impossible. Baah, that is how I like it: tidy, like my stable.
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
- I can name the symbols of a flowchart and read a simple flowchart. → Other ways to draw it: the flowchart
- I can build a simple algorithm as a flowchart myself. → Exercise: Baking a cake as a flowchart
- I can explain why jumps with GOTO lead to mistakes and spaghetti code. → Drawbacks of the flowchart: jumps
- I can read a simple algorithm as pseudocode. → Pseudocode and comparison
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

? How do you recognise a loop in a flowchart?
→ Other ways to draw it: the flowchart
- [ ] By an upside-down L
- [x] By an arrow that leads back up
- [ ] By the word WHILE
> The upside-down L belongs to the structure chart, and WHILE to pseudocode.

? Match each flowchart symbol to its meaning.
→ Other ways to draw it: the flowchart
= Oval -> Start or end
= Rectangle -> Statement
= Diamond -> Decision
= Parallelogram -> Input or output
> The diamond has two exits: yes and no.

? You insert a new line into a program with GOTO. What can happen?
→ Drawbacks of the flowchart: jumps
- [x] The jumps point to the wrong lines because the numbers have moved
- [ ] Nothing, the jumps adjust by themselves
- [ ] The program automatically gets faster
> Every GOTO points to a fixed line number. If the lines move down, the program jumps to the wrong place.

? In pseudocode, what shows which lines belong to a loop?
→ Pseudocode and comparison
- [ ] The colour
- [x] The indentation and the END WHILE
- [ ] An arrow
> Everything between WHILE and END WHILE is indented and is repeated.
:::
