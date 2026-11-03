---
titel: A flag with boolean
bereich: Sensors and decisions
kurz: Use a variable of type boolean to remember whether something happened.
---

## Skills I will gain now

::: kompetenzen
- create a variable of type `boolean`
- use a flag to remember whether something happened
- check a flag in a condition after the loop
:::

## True or false

A variable of type `boolean` knows only two values: `true` and `false`. You already know this from the sensors: `mbot.isButtonA()` gives you `true` or `false`. A comparison like `mbot.getDistance() < 10` is also `true` or `false` in the end.

| Code | Meaning |
|---|---|
| `boolean dark = false` | It has not been dark yet. |
| `dark = true` | Now it has been dark. |
| `if (dark)` | Is `dark` true? |

With `if (dark)` you don't need `== true`. The variable itself is already true or false.

## The flag

The mBot2 should keep watch for three seconds. It measures the brightness again and again. Afterwards it should say whether it was dark **at any point**.

For this you use a **flag**: a `boolean` variable that starts with `false`. When it gets dark, you set it to `true`. After that nobody sets it back. So after the loop you know: was it dark even just once?

::: übung vb-wurde-es-dunkel
titel: Did it get dark?
auftrag: Build a structure chart: create `boolean dark = false`. In a for loop, check 30 times: if the brightness is less than 20, `dark` becomes true. Wait 100 ms in every pass. Then show **It was dark** or **Always bright**.
messwerte: getBrightness=80/10/80 -> none, screen "It was dark"
messwerte: getBrightness=80 -> none, screen "Always bright"
braucht: forSchleife, verzweigung
tipp: Inside the loop is a branch with `mbot.getBrightness() < 20`. The yes branch has `dark = true`, the no branch stays empty. Then comes `mbot.pause(100)`.
tipp: After the loop comes a second branch with the condition `dark`. Yes: `mbot.showText("It was dark")`, no: `mbot.showText("Always bright")`.
lösung: vb-wurde-es-dunkel-loesung.visustruct
:::

> When checking, it gets dark for a moment in the middle of the watch and then bright again. Does your mBot2 still show **It was dark**?

## Now in Java: was there a clap?

In Java the flag looks like this:

```java
boolean loud = false;
for (int i = 0; i < 30; i++) {
    if (mbot.getLoudness() > 60) {
        loud = true;
    }
    mbot.pause(100);
}
```

In Java you always write `true` and `false` in lower case.

::: übung vb-java-klatsch-merker
titel: Was there a clap?
code: java
auftrag: Write in Java: the mBot2 listens for three seconds (30 times with a 100 ms pause). If the loudness is ever greater than 60, it remembers this in `boolean loud`. Then it shows **Clap!** or **All quiet**.
messwerte: getLoudness=0/90/0 -> none, screen "Clap!"
messwerte: getLoudness=0 -> none, screen "All quiet"
braucht: forSchleife, verzweigung
tipp: Take the code above and then write `if (loud) { … } else { … }`.
tipp: The branches get `mbot.showText("Clap!");` and `mbot.showText("All quiet");`.
lösung: vb-java-klatsch-merker-loesung.visustruct
:::

::: übung vb-fehler-11-merker-boolean
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Was there a clap?", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-11-merker-boolean-start.visustruct
messwerte: getLoudness=0/90/0 -> none, screen "Clap!"
messwerte: getLoudness=0 -> none, screen "All quiet"
tipp: The error message names an unknown variable. How do you write true and false in Java? Java is case-sensitive.
tipp: It should be `loud = true`.
lösung: vb-java-klatsch-merker-loesung.visustruct
:::

## Game: true or false?

::: spiel frage
titel: Game: true or false?
intro: Ludwig asks what the condition comes out as. Six rounds.
frage: Is it true or false?
antworten: true | false

runde:
frage: `mbot.getDistance() < 10`, the distance is 25 cm.
richtig: false
> 25 is not less than 10.

runde:
frage: `mbot.isButtonA()`, and you are pressing button A right now.
richtig: true
> The sensor reports: pressed.

runde:
frage: `boolean dark = false`. It never gets dark in the loop. What is `dark` afterwards?
richtig: false
> Nobody set the flag to `true`.

runde:
frage: `boolean dark = false`. It gets dark once in the loop, then bright again. What is `dark` afterwards?
richtig: true
> A flag stays `true` once it has been set.

runde:
frage: `mbot.getBrightness() > 50`, the brightness is 50.
richtig: false
> 50 is not greater than 50.

runde:
frage: `!mbot.isButtonA()`, and you are not pressing button A.
richtig: true
> Button A is not pressed, so `false`. The `!` turns it around: `true`.
:::

::: quiz
? Which values can a variable of type `boolean` have?
→ True or false
- [ ] Any whole number
- [x] Only `true` and `false`
- [ ] Only 0 and 1
? What does a flag start with?
→ The flag
- [x] With `false`, because nothing has happened yet
- [ ] With `true`
- [ ] With the first reading
> Only when the event happens does it become `true`.
? How do you check in Java whether the flag `loud` is true?
→ Now in Java: was there a clap?
- [x] `if (loud)`
- [ ] `if (loud = true)`
- [ ] `if loud`
> `loud` itself is already true or false. A single `=` would be an assignment.
:::

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can create a variable of type `boolean`. → True or false
- I can use a flag to remember whether something happened. → The flag
- I can check a flag in a condition after the loop. → Now in Java: was there a clap?
:::
