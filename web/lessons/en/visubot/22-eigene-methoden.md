---
titel: Your own methods
bereich: Motors and methods
kurz: Write and call your own commands with parameters and return values.
---

## Skills I will gain now

::: kompetenzen
- build and call a subprogram with a parameter
- recognise methods in Java
- recognise and call an overloaded method
- write a method with a return value
:::

## A subprogram for the square

The mBot2 can already drive a square. Now it should drive two squares of different sizes. Instead of building the loop twice, you write a **subprogram**. In Java it is called a **method**. It is a command of your own that you can call as often as you like.

The header `void square(int side)` says:

- `void`: the method gives no result back, it only **does** something.
- `square`: that is the name of your new command.
- `int side`: when you call it, you pass a number, the **parameter**.

::: übung vb-quadrat-methode
titel: Two squares
auftrag: Build a subprogram `void square(int side)` that drives a square with side length `side`. The main program calls it twice: first with 30, then with 50.
fahrt: 4 x (forward 30, turnRight), 4 x (forward 50, turnRight)
braucht: aufruf
tipp: Create a new tab with **+** and give it the title `void square(int side)`. Inside is a for loop that runs `mbot.forward(side)` and `mbot.turnRight()` four times.
tipp: The main program contains two call boxes: `square(30)` and `square(50)`.
lösung: vb-quadrat-methode-loesung.visustruct
unterprogramm: vb-quadrat-unterprogramm-loesung.visustruct
:::

## Methods in Java

In Java every method lives in a class. The program always starts in the method `main`. From there `square` is called:

```java
public class Squares {
  public static void main(String[] args) {
    square(30);
    square(50);
  }

  static void square(int side) {
    for (int i = 0; i < 4; i++) {
      mbot.forward(side);
      mbot.turnRight();
    }
  }
}
```

In [Code](#zeige-codelive) you see each method in its own tab, just like in the structogram.

::: quiz
? What does `void` mean in `void square(int side)`?
→ Methods in Java
- [ ] The method has no parameter.
- [x] The method gives no result back.
- [ ] The method may only be called once.
> `void` means "empty": no value comes back. The parameter is in the brackets.
? With which value for `side` does `square(50)` run?
→ A subprogram for the square
- [ ] 30
- [x] 50
- [ ] with none
> The value in the brackets of the call becomes the parameter `side`.
:::

## Same name, different parameters: overloading

You know `mbot.forward()` and `mbot.forward(30)`. These are **two different methods with the same name**. Java can tell from the call which one is meant: by the **number** and the **type** of the parameters. This is called **overloading**.

There is a third `forward` method. It has two parameters: a number and a **unit** as text.

```java
mbot.forward();                  // 10 cm (default)
mbot.forward(30);                // 30 cm
mbot.forward(30, "cm");          // 30 cm, unit written out
mbot.forward(2, "rotations");    // the wheels turn twice
```

One wheel rotation is as far as the wheel's circumference: π · 6.5 cm ≈ 20.4 cm. So two rotations are about 40.8 cm. `mbot.backward` has the same three versions.

These are the three headers. The method name is the same, the parameter lists are different:

```java
void forward()
void forward(int cm)
void forward(int value, String unit)
```

You already know overloading: `System.out.println` exists for `int`, for `double`, for `String` and more. That is why you can simply put any of these values in the brackets.

::: angeberwissen
Are the 20.4 cm really true for **your** mBot2? Professionals don't trust a number they haven't measured. Measure the wheel diameter and run `mbot.forward(5, "rotations")`: the expected distance is 102.1 cm. This is how software systems are tested: every **test case** has an expected result and an actual (measured) result. You test several times and write everything into a **test record**. Here is your [test record to print (PDF)](https://visubot.visucode.de/test-record-wheel-rotation.pdf). Give it to your teacher, so they can see whether all robots drive the same distance.
:::

::: übung vb-ueberladung-umdrehung
titel: Square with rotations
auftrag: Drive a square in which every side is exactly **one wheel rotation** long. Use the overloaded method `mbot.forward(1, "rotations")`.
fahrt: 4 x (forward 20.42, turnRight)
braucht: forSchleife
tipp: A for loop with `int i = 0`, `i < 4`, `i++`.
tipp: Inside are `mbot.forward(1, "rotations")` and `mbot.turnRight()`.
lösung: vb-ueberladung-umdrehung-loesung.visustruct
:::

::: übung vb-java-rechteck-umdrehungen
titel: Rectangle with rotations
code: java
auftrag: Write in Java: the mBot2 drives a rectangle. The long sides are **two** wheel rotations long, the short ones **one**. Use `mbot.forward(2, "rotations")` and `mbot.forward(1, "rotations")`.
fahrt: 2 x (forward 40.84, turnRight, forward 20.42, turnRight)
braucht: forSchleife
tipp: A for loop that runs twice: `for (int i = 0; i < 2; i++) { … }`.
tipp: Inside the loop: `mbot.forward(2, "rotations");`, `mbot.turnRight();`, `mbot.forward(1, "rotations");`, `mbot.turnRight();`
lösung: vb-java-rechteck-umdrehungen-loesung.visustruct
:::

::: quiz
? Which method does `mbot.forward(3, "rotations")` call?
→ Same name, different parameters: overloading
- [ ] `forward()`
- [ ] `forward(int cm)`
- [x] `forward(int value, String unit)`
> Java picks the version whose parameters fit: two parameters, a number and a text.
:::

## A method with a return value

A method can also **work something out** and give the result back. Instead of `void`, the header then has the data type of the result, and `return` gives the value back:

```java
static int centimetres(int rotations) {
  return rotations * 20;
}
```

One wheel rotation is about 20 cm. So the call `int distance = centimetres(3);` puts 60 into `distance`.

::: übung vb-zentimeter
titel: Rotations into centimetres
auftrag: Build a subprogram `int centimetres(int rotations)` that returns `rotations * 20`. The main program calls it with 3, drives the distance and shows **Distance: 60 cm** on the screen.
fahrt: forward 60
befehle: showText "Distance: 60 cm"
braucht: aufruf
tipp: A new tab with the title `int centimetres(int rotations)`. One statement is enough inside: `return rotations * 20`.
tipp: In the main program: call `int distance = centimetres(3)`, then `mbot.forward(distance)` and `mbot.showText("Distance: " + distance + " cm")`.
lösung: vb-zentimeter-loesung.visustruct
unterprogramm: vb-zentimeter-unterprogramm-loesung.visustruct
:::

> 📘 **More without the robot:** VisuStruct has the lesson ["Call and break"](?visustruct&lektion=18-aufruf-und-aussprung). It opens in a new window.

::: übung vb-fehler-22-eigene-methoden
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Rectangle with rotations", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-22-eigene-methoden-start.visustruct
fahrt: 2 x (forward 40.84, turnRight, forward 20.42, turnRight)
tipp: A text belongs in quotation marks. Without them Java looks for a variable with that name.
tipp: It should be `mbot.forward(1, "rotations")`.
lösung: vb-java-rechteck-umdrehungen-loesung.visustruct
:::

## Game: Which method?

::: spiel frage
titel: Game: Which method?
intro: Same name, different parameters: which method does Java call, and what comes out? Six rounds.

runde:
    mbot.forward(30, "cm");
frage: Which `forward` method runs?
- `forward()`
- `forward(int cm)`
- [x] `forward(int value, String unit)`
> Two parameters, a number and a text: that only fits the third one.

runde:
    mbot.forward();
frage: How far does the mBot2 drive?
- [x] 10 cm
- not at all, the number is missing
- one wheel rotation
> Without a parameter, `forward` drives 10 cm. That is the version with no parameters.

runde:
    mbot.forward(2, "rotations");
frage: Roughly how far does the mBot2 drive?
- 2 cm
- 20 cm
- [x] 41 cm
> One wheel rotation is about 20.4 cm, so two are about 40.8 cm.

runde:
    static int centimetres(int rotations) {
        return rotations * 20;
    }
frage: What does `centimetres(4)` give?
- 4
- 24
- [x] 80
> The parameter `rotations` is 4, and `return` gives back 4 · 20.

runde:
    public static void main(String[] args) {
        square(30);
        square(50);
    }
frage: How many squares does the mBot2 drive, and how big is the second one?
- one with 80 cm
- [x] two, the second with 50 cm sides
- two, both with 30 cm sides
> Each call drives one square. The value in the brackets becomes `side`.

runde:
frage: Which header fits a method that gives back a number?
- `void centimetres(int rotations)`
- [x] `int centimetres(int rotations)`
- `centimetres(int rotations)`
> The data type of the result comes before the name. `void` means: no result.
:::

## Game: Defuse the bomb

::: spiel bombe
titel: Game: Defuse the bomb
intro: Every program contains **exactly one mistake**, and the bomb is ticking. Tap the wrong line before time runs out. Four rounds, 30 seconds each.
zeit: 30

runde:
    static void square(int side) {
        for (int i = 0; i < 4; i++) {
            mbot.forward(30);
            mbot.turnRight();
        }
    }
frage: Should drive a square with sides of length `side`.
fehler: 3
besser: mbot.forward(side);
> With `30` every square is the same size, whatever you pass in.

runde:
    static void centimetres(int rotations) {
        return rotations * 20;
    }
frage: Should give back the distance in cm.
fehler: 1
besser: static int centimetres(int rotations) {
> A method that gives something back needs the data type of the result instead of `void`.

runde:
    static int centimetres(int rotations) {
        int cm = rotations * 20;
    }
frage: Should give back the distance in cm.
fehler: 2
besser: return rotations * 20;
> The method calculates but gives nothing back. `return` is missing.

runde:
    mbot.forward(2, rotations);
frage: Should drive two wheel rotations.
fehler: 1
besser: mbot.forward(2, "rotations");
> The unit is a text and needs quotation marks.
:::

## Game: Terms crossword

::: spiel kreuzwort
titel: Game: Terms crossword
intro: Fill in the crossword with the technical terms from this part. Click a clue to jump to its word. The yellow fields spell the answer word.
- → 7 1 PARAMETER: value you write in the brackets when you call a method
- ↓ 5 7 METHOD: your own command with a name, e.g. square(30)
- ↓ 1 4 OVERLOADING: same method name, different parameters
- ↓ 2 9 BATTERY: mbot.getBattery() tells you how full it is
- → 2 4 VOID: in the header: the method gives nothing back
- ↓ 2 2 STOPWATCH: mbot.getTimer() reads it
- → 5 7 MOTOR: each wheel has its own
- ↓ 1 11 RETURN: gives a result back from a method
lösung: 7 5, 6 9, 5 9, 10 2, 5 8, 8 4
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can build and call a subprogram with a parameter. → A subprogram for the square
- I can recognise methods in Java. → Methods in Java
- I can recognise and call an overloaded method. → Same name, different parameters: overloading
- I can write a method with a return value. → A method with a return value
:::
