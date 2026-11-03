---
titel: Your own methods
bereich: VisuBot
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
Are the 20.4 cm really true for **your** mBot2? Professionals don't trust a number they haven't measured. Measure the wheel diameter and run `mbot.forward(5, "rotations")`: the expected distance is 102.1 cm. This is how software systems are tested: every **test case** has an expected result and an actual (measured) result. You test several times and write everything into a **test record**. Here is your [test record to print (PDF)](https://visustruct.org/visubot/test-record-wheel-rotation.pdf). Give it to your teacher, so they can see whether all robots drive the same distance.
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

::: quiz
? Which method does `mbot.forward(3, "rotations")` call?
→ Same name, different parameters: overloading
- [ ] `forward()`
- [ ] `forward(int cm)`
- [x] `forward(int value, String unit)`
> Java picks the version whose parameters fit: two parameters, a number and a text.
:::

## Now without the robot: a method with a return value

A method can also **calculate** something and give the result back. Instead of `void`, the header then names the data type of the result, and `return` gives the value back:

```java
static int twice(int x) {
  return 2 * x;
}
```

The call `int d = twice(4);` then puts 8 into `d`.

::: übung vb-ohne-quadratzahl
titel: Square numbers
auftrag: Build a subprogram `int squareNumber(int x)` that returns `x * x`. The main program calls it with 3 and with 5 and prints both results: first **9**, then **25**. No `mbot` at all!
test: - -> 9 | 25
braucht: aufruf
tipp: New tab with the title `int squareNumber(int x)`. One statement is enough inside: `return x * x`.
tipp: In the main program: call `int a = squareNumber(3)`, call `int b = squareNumber(5)`, then the outputs `a` and `b`.
lösung: vb-ohne-quadratzahl-loesung.visustruct
unterprogramm: vb-ohne-quadratzahl-unterprogramm-loesung.visustruct
:::

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can build and call a subprogram with a parameter. → A subprogram for the square
- I can recognise methods in Java. → Methods in Java
- I can recognise and call an overloaded method. → Same name, different parameters: overloading
- I can write a method with a return value. → Now without the robot: a method with a return value
:::
