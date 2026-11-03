---
titel: Variables and output
bereich: Getting started
kurz: Store values in variables, drive the mBot2 with them and show results on the screen.
---

## Skills I will gain now

::: kompetenzen
- create and use a variable
- tell the data types `int`, `double`, `String` and `boolean` apart
- drive a rectangle in Java with two variables
- show a result on the screen with `mbot.showText`
:::

## A variable for the side

With `mbot.forward(30)` the mBot2 drives 30 cm in one go. If you drive a square with it and no loop, the 30 appears four times in your program. To make the square bigger, you have to change it in four places. It is better to store the side length **once** and then use it everywhere.

That is what **variables** are for. A variable is a box with a name that holds a value:

```java
int side = 30;
mbot.forward(side);
```

- `int` is the **data type**: a whole number.
- `side` is the **name**. You may choose it yourself.
- `30` is the **value**. The `=` puts it into the box.

Wherever `side` appears afterwards, the computer uses its value. So `mbot.forward(side)` drives 30 cm.

::: übung vb-variable-seite
titel: Square with a variable
auftrag: In one statement, create the variable `int side = 30`. After that the mBot2 drives a square: four times `side` centimetres forward and turn right.
fahrt: 4 x (forward 30, turnRight)
braucht: forSchleife
tipp: The first statement is `int side = 30`. Below it comes a for loop that runs four times.
tipp: Inside the loop are `mbot.forward(side)` and `mbot.turnRight()`.
lösung: vb-variable-seite-loesung.visustruct
:::

> Now change only the 30 to 60 and start the simulation. The whole square becomes twice as big.

## Which data types are there?

Every variable has a data type. It decides which values fit inside:

| Data type | What fits inside? | Example |
|---|---|---|
| `int` | whole numbers | `int side = 30;` |
| `double` | decimal numbers, written with a point | `double wheelCircumference = 20.4;` |
| `String` | text in quotation marks | `String name = "Ludwig";` |
| `boolean` | true or false | `boolean wallNear = mbot.getDistance() < 20;` |

One wheel rotation takes the mBot2 about 20.4 cm, which is a decimal number. `wallNear` holds `true` if the wall is closer than 20 cm. You will meet the distance sensor in Lesson 4.

You can also calculate with variables: `int distance = 4 * side;` works out the whole distance around the square.

## Now in Java: rectangle

A rectangle has two different sides. So you need two variables.

::: übung vb-java-rechteck
titel: Rectangle with variables
code: java
auftrag: Write in Java: create `int length = 60` and `int width = 30`. The mBot2 drives a rectangle: length, turn right, width, turn right, and all that twice.
fahrt: 2 x (forward 60, turnRight, forward 30, turnRight)
braucht: forSchleife
tipp: Two variables at the top: `int length = 60;` and `int width = 30;`. Below them a for loop that runs twice.
tipp: Inside the loop: `mbot.forward(length);`, `mbot.turnRight();`, `mbot.forward(width);`, `mbot.turnRight();`
lösung: vb-java-rechteck-loesung.visustruct
:::

## Result on the screen

The mBot2 can do more than drive, it can also show you something. With `mbot.showText(…)` a text appears on the CyberPi's [screen]{teil=screen}. With `+` you join text and values:

```java
int side = 30;
int distance = 4 * side;
mbot.showText("Distance: " + distance + " cm");
```

The screen then shows **Distance: 120 cm**. You will learn more about the screen in Lesson 18.

::: übung vb-strecke-anzeigen
titel: How far does it drive?
code: java
auftrag: Create `int length = 60` and `int width = 30` and drive the rectangle as before. Then work out in a variable `distance` how far the mBot2 drove all the way round, and show **Distance: 180 cm** on the screen.
fahrt: 2 x (forward 60, turnRight, forward 30, turnRight)
befehle: showText "Distance: 180 cm"
braucht: forSchleife
tipp: All the way round is twice the length and twice the width: `int distance = 2 * length + 2 * width;`
tipp: After the loop: `mbot.showText("Distance: " + distance + " cm");`
lösung: vb-strecke-anzeigen-loesung.visustruct
:::

> 📘 **More without the robot:** VisuStruct has the lesson ["Input and output"](?visustruct&lektion=06-eingabe-und-ausgabe). It opens in a new window. There you print results to the console with `System.out.println`.

## Game: Which data type?

::: spiel frage
titel: Game: Which data type?
intro: Ludwig has wiped out the data types. Which one fits the gap? Seven rounds.
antworten: int | double | String | boolean

runde:
    ___ side = 30;
frage: Which data type fits?
richtig: int
> 30 is a whole number.

runde:
    ___ wheelCircumference = 20.4;
frage: Which data type fits?
richtig: double
> 20.4 is a decimal number, written with a point in Java.

runde:
    ___ name = "Ludwig";
frage: Which data type fits?
richtig: String
> Text in quotation marks is a `String`.

runde:
    ___ wallNear = mbot.getDistance() < 20;
frage: Which data type fits?
richtig: boolean
> A comparison is true or false, so `boolean`.

runde:
    ___ distance = mbot.getDistance();
frage: Which data type fits?
richtig: int
> The distance sensor gives whole centimetres, for example 38.

runde:
    ___ greeting = "Hello " + "class";
frage: Which data type fits?
richtig: String
> Two texts joined with `+` give a text again.

runde:
    ___ average = 120 / 5.0;
frage: Which data type fits?
richtig: double
> With `5.0`, Java calculates with decimal numbers. The result is 24.0.
:::

## Game: Where does the mBot2 end up?

::: spiel fahrt
titel: Game: Where does the mBot2 end up?
intro: Read the program and tap the field where the mBot2 is at the end. Watch the values in the variables. Each field is 30 cm. Four rounds.
frage: On which field is the mBot2 at the end?

runde:
    int side = 60;
    mbot.forward(side);
    mbot.turnRight();
    mbot.forward(side);
karte: ... | ... | ^..
ziel: 2,0
> `side` is 60, so two fields up and two to the right.

runde:
    int a = 30;
    int b = a * 3;
    mbot.forward(b);
karte: ... | ... | ... | ^..
ziel: 0,0
> `b` is 3 · 30 = 90 cm, so three fields.

runde:
    int distance = 30 * 2;
    mbot.backward(distance);
karte: ..^.. | ..... | .....
ziel: 2,2
> `backward` drives in reverse: it faces up but drives 60 cm down.

runde:
    int side = 30;
    for (int i = 0; i < 2; i++) {
        mbot.forward(side);
        mbot.turnRight();
        side = side + 30;
    }
karte: .... | .... | .... | ^...
ziel: 2,2
> First 30 cm up, then `side` grows to 60: two fields to the right.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can create and use a variable. → A variable for the side
- I can tell the data types `int`, `double`, `String` and `boolean` apart. → Which data types are there?
- I can drive a rectangle in Java with two variables. → Now in Java: rectangle
- I can show a result on the screen with `mbot.showText`. → Result on the screen
:::

## Quiz

::: quiz
? What does `mbot.forward(side)` drive if `int side = 40;` comes first?
→ A variable for the side
- [ ] 4 cm
- [x] 40 cm
- [ ] nothing, `side` is not a command
> Wherever `side` appears, Java uses the value 40.
? Which data type fits `"Ludwig"`?
→ Which data types are there?
- [ ] `int`
- [ ] `double`
- [x] `String`
> Text in quotation marks is a `String`.
? What does `mbot.showText("Side: " + 30);` show on the screen?
→ Result on the screen
- [x] Side: 30
- [ ] "Side: " + 30
- [ ] 30
> The `+` joins the text and the number.
:::
