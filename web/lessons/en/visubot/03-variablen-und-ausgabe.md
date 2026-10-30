---
titel: Variables and output
bereich: VisuBot
kurz: Store values in variables, drive the mBot2 with them and print results.
---

## Skills I will gain now

::: kompetenzen
- create and use a variable
- tell the data types `int`, `double`, `String` and `boolean` apart
- drive a rectangle in Java with two variables
- print something with `System.out.println`
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
| `double` | decimal numbers, written with a point | `double speed = 1.5;` |
| `String` | text in quotation marks | `String name = "Visu";` |
| `boolean` | true or false | `boolean done = false;` |

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

## Now without the robot: output

Not every result has to be driven by the robot. With `System.out.println(…)` a Java program prints text in the [console](#zeige-konsole). With `+` you join text and values:

```java
int side = 30;
int distance = 4 * side;
System.out.println("Distance: " + distance + " cm");
```

The console then shows **Distance: 120 cm**.

::: übung vb-ohne-strecke
titel: How far does it drive?
code: java
auftrag: A rectangle is 60 cm long and 30 cm wide. Create `length` and `width` as variables. Calculate in a variable `distance` how far the mBot2 drives once all the way round, and print **Distance: 180 cm**. No `mbot` at all!
test: - -> Distance: 180 cm
braucht: anweisung
tipp: Once round is twice the length plus twice the width.
tipp: `int distance = 2 * length + 2 * width;` and then `System.out.println("Distance: " + distance + " cm");`
lösung: vb-ohne-strecke-loesung.visustruct
:::

::: quiz
? What does `mbot.forward(side)` drive if `int side = 40;` comes first?
→ A variable for the side
- [ ] 4 cm
- [x] 40 cm
- [ ] nothing, `side` is not a command
> Wherever `side` appears, Java uses the value 40.
? Which data type fits `"Visu"`?
→ Which data types are there?
- [ ] `int`
- [ ] `double`
- [x] `String`
> Text in quotation marks is a `String`.
? What does `System.out.println("Side: " + 30);` print?
→ Now without the robot: output
- [x] Side: 30
- [ ] "Side: " + 30
- [ ] 30
> The `+` joins the text and the number.
:::

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can create and use a variable. → A variable for the side
- I can tell the data types `int`, `double`, `String` and `boolean` apart. → Which data types are there?
- I can drive a rectangle in Java with two variables. → Now in Java: rectangle
- I can print something with `System.out.println`. → Now without the robot: output
:::
