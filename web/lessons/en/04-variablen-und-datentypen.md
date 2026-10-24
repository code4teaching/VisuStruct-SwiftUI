---
titel: Variables and data types
bereich: Basics
kurz: Store values, get to know the data types int, double, String and boolean, and calculate.
---

## What is a variable?

A **variable** is like a labelled box. It has a **name**, a **data type** and a **value**.

```
int age = 14
```

Here the variable is called `age`, its data type is `int` (whole number), and its value is 14. You can use the value again later through its name.

::: grafik l04-variable.svg
The variable as a box: the name on the label, the data type as a sticker, the value inside.
:::

> Variable names start with a letter and contain no spaces. Good names say what is inside: `price` is better than `p`.

## The four data types

The data type says what kind of value may be stored in the variable.

- **int:** whole numbers, e.g. `int count = 3` or `int temperature = -5`
- **double:** decimal numbers, e.g. `double price = 2.5`. You write a **point**, never a comma.
- **String:** text, e.g. `String name = "Mia"`. Text goes in quotation marks.
- **boolean:** truth values, only `true` or `false`

::: diagramm l05-datentypen.visustruct
Three variables with different data types. Open the diagram and start the simulation.
:::

You mostly meet truth values in **conditions**: `age >= 18` is either `true` or `false`. That is what lesson 8 is about. You can also store the result of a condition in a variable:

```
int age = 15
boolean adult = age >= 18
```

After that, `adult` holds the value `false`.

## Assignment with =

The sign `=` is called an **assignment**. It does not mean “equals” as in maths. It means: work out the right-hand side and store the result in the variable on the left.

```
int points = 10
points = points + 5
```

In maths the second line would be wrong, because no number equals itself plus 5. In programming you read it like this: take the old value 10, add 5 and store 15 in `points`. You only write the data type the first time, when the variable is created.

::: grafik l04-zuweisung.svg
First the right-hand side is calculated, then the result lands in the variable on the left.
:::

## Calculating

You can calculate with numbers:

- `+` plus, `-` minus, `*` times, `/` divided by
- `%` remainder of a division, e.g. `17 % 5` is 2

**Multiplication and division come before addition and subtraction**, and brackets are worked out first: `2 * (3 + 4)` is 14.

## Exercise: Rectangle

::: übung l05-rechteck
titel: Work out a rectangle
auftrag: A rectangle is 7 long and 4 wide. Create the variables `length` and `width`. Calculate the area and the perimeter in variables of their own and output both, like this:
`Area: 28` and on the next line `Perimeter: 22`.
test: - -> Area: 28 | Perimeter: 22
braucht: anweisung
tipp: First think about which variables you need: two for the measurements and two for the results. They are all whole numbers.
tipp: The area is length times width, the perimeter is 2 times (length plus width). For the output you write e.g. `output: "Area: " + area`. The `+` joins the text and the value of the variable together.
lösung: l05-rechteck-loesung.visustruct
:::

## Whole-number division

If you divide two whole numbers and store the result in an `int` variable, everything after the decimal point is dropped. It is **not rounded**.

```
int x = 7 / 2      gives 3
int r = 7 % 2      gives 1 (the remainder)
double d = 7.0 / 2 gives 3.5
```

With `/` and `%` together you can convert things nicely, for example minutes into hours and minutes:

::: diagramm l05-division.visustruct
135 minutes are 2 hours (135 / 60) with 15 minutes left over (135 % 60).
:::

## Exercise: Convert seconds

::: übung l05-sekunden
titel: Convert seconds
auftrag: 200 seconds should be output as minutes and seconds. The first and the last statement are already there. Insert statements between them that calculate `minutes` and `remainder`.
start: l05-sekunden-start.visustruct
test: - -> 3 minutes and 20 seconds
braucht: anweisung
tipp: How many whole minutes fit into 200 seconds, and how many seconds are left over? Work it out in your head first.
tipp: A minute has 60 seconds. Use `/` for the whole minutes and `%` for the remainder. Both variables have the type `int`.
lösung: l05-sekunden-loesung.visustruct
:::

## Exercise: Shopping

::: übung l05-einkauf
titel: Shopping
auftrag: You buy 3 exercise books at 2.5 euros each. Create `count` as an `int` and `price` as a `double`, calculate the total price in a variable `total` and output `Total: 7.5 euros`.
test: - -> Total: 7.5 euros
braucht: anweisung
tipp: The count times the price gives the total price. For each variable, think about whether it is a whole number or a decimal number.
tipp: The total price is a decimal number, so `total` needs the type `double`.
lösung: l05-einkauf-loesung.visustruct
:::

## Now in Java

A structure chart is a plan. For a computer to carry it out, you write it down in a programming language, for example in **Java**. The variables from above look like this in Java:

```
int age = 14;
double height = 1.62;
String name = "Mia";
System.out.println(name + " is " + age + " years old.");
System.out.println("Height: " + height + " m");
```

- You create a variable in Java just like in the box: first the data type, then the name, then the value.
- Every statement ends with a **semicolon** `;`.
- `String` starts with a capital letter, `int`, `double` and `boolean` are lower case. Java tells upper and lower case apart.
- An output is called `System.out.println(…)` in Java.

You type Java in the [Programming](#zeige-codelive) area to the right of the structure chart. While you type, VisuStruct builds the structure chart along with it. So you see straight away which box belongs to which line.

::: übung l04-java-steckbrief
titel: Profile in Java
code: java
auftrag: Write a profile of Ludwig the billy goat. Create three variables: the name **Ludwig**, the age **7** and the height **1.2**. Then output these two lines:
  **Ludwig is 7 years old.** and **Height: 1.2 m**
  “Open in editor” also opens the Programming area on the right. Type your code there; the structure chart builds itself. Then click Check.
test: - -> Ludwig is 7 years old. | Height: 1.2 m
braucht: anweisung
tipp: You need a `String`, an `int` and a `double`. Every line ends with a semicolon.
tipp: `String name = "Ludwig";`, `int age = 7;` and `double height = 1.2;`. You join the output with `+`: `System.out.println(name + " is " + age + " years old.");`
lösung: l04-java-steckbrief-loesung.visustruct
:::

## Fill in the gaps: data types

::: lückentext
titel: Profile in Java
auftrag: Fill in the missing words. On the outside is the frame that every Java program in its own file needs. The variables go inside it.
```java
[[public]] class Profile {
    public static [[void]] main(String[] args) {
        [[int]] age = 14;
        [[double]] height = 1.62;
        [[String]] name = "Mia";
        [[boolean]] hasPet = true;
        System.out.[[println]](name + " is " + age + " years old.");
    }
}
```
erklärung: Whole numbers are `int`, decimal numbers `double`, texts `String` (with a capital S) and truth values `boolean`. `public class` and `public static void main` make up the frame. In the Programming area you may leave it out, more on this in the lesson “Java”.
:::

## Find the bug: seconds

::: übung l04-java-fehler
titel: Fix the seconds
code: java
auftrag: The program should convert 200 seconds into minutes and seconds and output **3 min 20 s**. But it outputs **20 min 3 s**.
  “Open in editor” shows the code in the Programming area. Find the bug, fix it and click Check.
start: l04-java-fehler-start.visustruct
test: - -> 3 min 20 s
braucht: anweisung
tipp: `/` divides without a remainder, `%` gives the remainder. Which one do you need for the minutes, which one for the seconds left over?
tipp: The two operators are swapped: `int minutes = seconds / 60;` and `int rest = seconds % 60;`
lösung: l04-java-fehler-loesung.visustruct
:::

## Game: Which data type?

::: spiel frage
titel: Game: Which data type?
intro: Ludwig has collected values. Which data type fits each value? Eight rounds.
antworten: int | double | String | boolean

runde:
frage: Which data type fits `17`?
richtig: int
> A whole number without a decimal point is an `int`.

runde:
frage: Which data type fits `3.5`?
richtig: double
> Numbers with a decimal point are `double`.

runde:
frage: Which data type fits `"Hello"`?
richtig: String
> Text in quotation marks is a `String`.

runde:
frage: Which data type fits `true`?
richtig: boolean
> `true` and `false` are the two truth values, data type `boolean`.

runde:
frage: Which data type fits `"17"`?
richtig: String
> Careful, quotation marks! Here 17 is a text you can't calculate with.

runde:
frage: Which data type fits `-4`?
richtig: int
> Negative whole numbers are `int` as well.

runde:
frage: Which data type fits `0.0`?
richtig: double
> The point makes it a decimal number, even if there is only a 0 behind it.

runde:
frage: Which data type fits `"false"`?
richtig: String
> In quotation marks, false is just a text too. The truth value has no quotation marks.
:::

## Checklist

::: checkliste
- I can create a variable with a data type, a name and a value. → What is a variable?
- I know the data types int, double, String and boolean. → The four data types
- I know that = is an assignment and not a comparison. → Assignment with =
- I can calculate with + - * / % and know whole-number division. → Calculating
- I can create and output variables in Java. → Now in Java
:::

## Quiz

::: quiz
? Which data type fits the value 3.75?
- [ ] int
- [x] double
- [ ] String
- [ ] boolean
> Decimal numbers have the type double. In VisuStruct you write them with a point.

? What value does x have after `int x = 17 / 5`?
- [ ] 3.4
- [x] 3
- [ ] 4
> With whole numbers, everything after the decimal point is dropped. It is not rounded.

? What does `17 % 5` give?
- [x] 2
- [ ] 3
- [ ] 3.4
> 17 divided by 5 is 3, remainder 2. The operator % gives the remainder.

? At the start, `int points = 10`. What is in points after `points = points * 2`?
- [ ] 10
- [ ] 12
- [x] 20
> The right-hand side is calculated with the old value 10, and the result 20 is stored in points.

? Which line correctly creates a decimal number in Java?
- [ ] double price = 2,5;
- [x] double price = 2.5;
- [ ] Double price = 2.5
> Decimal numbers use a point, and the line ends with a semicolon.
:::
