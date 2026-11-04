---
titel: Flowcharts and pseudocode
bereich: First steps
kurz: Show algorithms as a flowchart and as pseudocode, and compare them with the structure chart.
---

## Skills I will gain now

::: kompetenzen
- read a flowchart and build one myself
- explain why jumps in a flowchart lead to mistakes
- read a simple algorithm as pseudocode
:::

## Other ways to draw it: the flowchart

There are two more ways to show an algorithm: the **flowchart** and **pseudocode**. You will meet both in class.

Here you see our structure chart for drinking tea from the last lesson once more. Next we look at the flowchart, using the same example.

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

## Game: Which way of drawing?

::: spiel frage
titel: Game: Which way of drawing?
intro: Ludwig describes a way of drawing an algorithm without saying its name. Is it the structure chart, the flowchart or pseudocode? Eight rounds.
antworten: structure chart | flowchart | pseudocode

runde:
frage: “When something is repeated, one of my arrows points back up.”
richtig: flowchart
> A flowchart has no special symbol for a loop. An arrow leads back up.

runde:
frage: “My loop looks like an upside-down L.”
richtig: structure chart
> The box wraps around the repeated steps at the top and on the left.

runde:
frage: “I am made of words like IF and WHILE, and the indentation shows what belongs together.”
richtig: pseudocode
> Pseudocode is text in plain language that is laid out like a program.

runde:
frage: “My branch is a diamond with the exits yes and no.”
richtig: flowchart
> In a structure chart, the condition sits in a triangle instead.

runde:
frage: “My arrows can get tangled all over the place like spaghetti.”
richtig: flowchart
> Because arrows may lead anywhere, spaghetti code is possible in a flowchart.

runde:
frage: “I have no fixed way of writing. You may write WHEN instead of IF.”
richtig: pseudocode
> All that matters is that anyone can understand it without an explanation.

runde:
frage: “The condition sits at the top in a triangle, and below it I split into two columns.”
richtig: structure chart
> This is how a branch looks in a structure chart: true on the left, false on the right.

runde:
frage: “If you insert a box, everything below simply moves down with it. No jump can go wrong.”
richtig: structure chart
> A structure chart has no arrows and no jumps, so nothing can point to the wrong place.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can name the symbols of a flowchart and read a simple flowchart. → Other ways to draw it: the flowchart
- I can build a simple algorithm as a flowchart myself. → Exercise: Baking a cake as a flowchart
- I can explain why jumps with GOTO lead to mistakes and spaghetti code. → Drawbacks of the flowchart: jumps
- I can read a simple algorithm as pseudocode. → Pseudocode and comparison
:::

## Quiz

::: quiz
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
