---
titel: Testing step by step
bereich: Getting started
kurz: Use the simulation and a desk check to find out what your program really does.
---

## Skills I will gain now

::: kompetenzen
- control the simulation with Play, Step and Stop
- watch the variables in the simulation
- do a desk check with a table
- find and fix a mistake with the simulation
:::

## Controlling the simulation

With the [▶︎ Start simulation](#zeige-simulation) button on the right of the tools, VisuStruct runs your structogram. In the VisuBot world the mBot2 drives along. On the right, the **Controls** appear:

- **Play** runs the program automatically, step by step. You set how fast under **Pause per step**.
- **Pause** stops for a moment. Then you carry on with Play or Step.
- **Step** runs exactly one box. That way you can watch calmly.
- **Stop** cancels and puts the mBot2 back at the start.

During the simulation one box is highlighted. **Last step** shows what has just happened, **Variables** shows all variables with their values.

::: diagramm vb-l03-wachsend-loesung.visustruct
Each side gets 10 cm longer. Open the diagram in the editor and go through it with **Step**. Watch `side` and `i`.
:::

## The desk check

In a **desk check** you play the computer yourself. You go through the structogram with pen and paper and write down the values of the variables after every step. For the diagram above the table looks like this:

| Step | `i` | `side` | The mBot2 … |
|---|---|---|---|
| `int side = 20` | – | 20 | |
| `mbot.forward(side)` | 0 | 20 | drives 20 cm |
| `mbot.turnRight()` | 0 | 20 | turns right |
| `side = side + 10` | 0 | 30 | |
| `mbot.forward(side)` | 1 | 30 | drives 30 cm |
| … | … | … | … |

Then compare your table with the simulation. Do the values under **Variables** match after every step?

::: angeberwissen
"Computer" used to be a job: people who calculated with pen and paper. One of the best was Katherine Johnson at NASA. In 1962 the astronaut John Glenn only wanted to fly once she had checked the new IBM computer's orbit by hand: "If she says they're good, I'm ready to go."
:::

## Finding mistakes with the simulation

Ludwig wanted to build the spiral from above: 20 cm, 30 cm, 40 cm. But his mBot2 drives 30, 40 and 50 cm. The program runs without an error message, it just does the wrong thing. This kind of mistake is called a **logic error**. You find it best with **Step** and the variables.

::: übung vb-spirale-falsch
titel: Fix the spiral
auftrag: "Open in editor" loads Ludwig's structogram. Go through it with **Step** and watch `side`. Find out why the first side is 30 cm long and fix it. The mBot2 should drive 20, 30 and 40 cm and turn right after each side.
start: vb-spirale-falsch-start.visustruct
fahrt: forward 20, turnRight, forward 30, turnRight, forward 40, turnRight
braucht: forSchleife
tipp: Look at the value of `side` when `mbot.forward(side)` comes up. Is the order inside the loop right?
tipp: `side = side + 10` must come **after** `mbot.forward(side)` and `mbot.turnRight()`. Drag the box to the end of the loop.
lösung: vb-spirale-falsch-loesung.visustruct
:::

> 📘 **More without the robot:** VisuStruct has the lesson ["Simulation and desk check"](?visustruct&lektion=07-simulation-und-schreibtischtest). It opens in a new window.

::: quiz
? Which button runs exactly one box?
→ Controlling the simulation
- [ ] Play
- [x] Step
- [ ] Stop
> With Step you go box by box. Play carries on by itself.
? How far does the mBot2 drive in the second pass of "Growing sides"?
→ The desk check
- [ ] 20 cm
- [x] 30 cm
- [ ] 40 cm
> After the first pass `side` has grown by 10, so it is 30.
? The program runs without a message, but the mBot2 drives the wrong way. What kind of mistake is it?
→ Finding mistakes with the simulation
- [ ] a typo
- [x] a logic error
- [ ] a fault in the robot
> The program does exactly what it says, just not what was meant.
:::

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can control the simulation with Play, Step and Stop. → Controlling the simulation
- I can watch the variables in the simulation. → Controlling the simulation
- I can do a desk check with a table. → The desk check
- I can find and fix a mistake with the simulation. → Finding mistakes with the simulation
:::
