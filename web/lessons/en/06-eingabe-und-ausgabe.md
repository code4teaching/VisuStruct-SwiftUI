---
titel: Input and output
bereich: Basics
kurz: Ask for values, show results and use the IPO model.
---

## Skills I will gain now

::: kompetenzen
- explain the IPO model
- write an input with a data type, a name and a question
- join text and variables in an output with +
- work out a result first and store it in a variable, then output that variable, e.g. `int sum = a + b`, then `output: sum`
- pick out input, process and output from a task
- read numbers in Java with the scanner
:::

## The IPO model

Many programs work in three parts:

1. **Input:** The program asks for values, e.g. two numbers.
2. **Process:** It calculates with the values.
3. **Output:** It shows the result.

The first letters give **IPO**. So far the values were fixed in the structure chart. With an input, a different value can be used every time the chart runs.

::: diagramm l06-eva.visustruct
Input at the top, process in the middle, output at the bottom. Start the simulation and try different numbers.
:::

## Input with input:

An input asks for a value while the chart runs and stores it in a variable. You write the **data type**, the **name** and a **question** in quotation marks:

```
input: int age "How old are you?"
input: double price "Price in euros?"
input: String name "What is your name?"
```

In the editor you choose the kind **Input** at the top of a Statement. The word `input:` is then already in front, and you only type `int age "How old are you?"`.

> The data type decides what may be typed in. With `int`, the simulation reports an error if someone types 2.5 or Hello.

## Output with output:

An output shows text and values. Text goes in quotation marks, variables do not. With `+` you **join** the parts together:

```
output: "Hello " + name + "!"
output: "You are " + age + " years old."
```

Watch out for the spaces inside the quotation marks. Without them everything sticks together, and you see `HelloMia!` instead of `Hello Mia!`.

## Exercise: Greeting

::: übung l06-begruessung
titel: Greeting
auftrag: Ask for a name and greet the person. When Ada is typed in, **Hello Ada!** should be output.
test: Ada -> Hello Ada!
test: Ben -> Hello Ben!
braucht: anweisung
tipp: First comes an input for the name, then an output that uses the name.
tipp: The name is text, so the input needs the type `String`. In the output you join `"Hello "`, the variable and `"!"` with `+`.
lösung: l06-begruessung-loesung.visustruct
:::

## Careful with + in an output

In an output, `+` **always** joins the parts together, even with numbers. If `a` is 3 and `b` is 4, then

```
output: a + b
```

does not show 7 but **34**. So calculate in a variable first and then output the variable:

```
int sum = a + b
output: "Sum: " + sum
```

That also fits the IPO model: you calculate in the process part, not in the output.

## From the task to the structure chart

Before you drag the first box, read the task carefully and take it apart. This is called **problem analysis**. Three questions help you:

1. **What is given?** These values become the **input**. Also think about the data type.
2. **What are you looking for?** That becomes the **output**.
3. **How do you get from what is given to what you are looking for?** That is the **process**, often a formula.

An example: *A cinema ticket costs 9 euros. The program asks how many tickets someone buys and shows the total price.*

- Given: the number of tickets → `input: int count "How many tickets?"`
- Looking for: the total price → `output: "Total price: " + total`
- Way: count times 9 → `int total = count * 9`

Now you only have to put the three parts on top of each other in the order I, P, O.

> Look out for signal words in the task: *asks*, *reads in* or *enters* point to an input. *Shows*, *outputs* or *reports* point to an output.

## Exercise: Calculator

::: übung l06-rechner
titel: Sum and product
auftrag: Ask for two whole numbers. Then output their sum and their product, each on its own line.
With 3 and 4 it looks like this: `Sum: 7` and `Product: 12`.
test: 3, 4 -> Sum: 7 | Product: 12
test: 10, -2 -> Sum: 8 | Product: -20
test: 0, 5 -> Sum: 5 | Product: 0
braucht: anweisung
tipp: Plan the order: first read in both numbers, then calculate, then output.
tipp: You need two inputs, two statements for calculating and two outputs. Calculate the sum in a variable of its own, otherwise `+` joins the numbers together.
lösung: l06-rechner-loesung.visustruct
:::

## Exercise: Mean

::: übung l06-mittelwert
titel: Mean
auftrag: Ask for two numbers, which may also be decimal numbers. Output their mean, so for 2 and 3 that is `Mean: 2.5`.
test: 2, 3 -> Mean: 2.5
test: 4, 6 -> Mean: 5.0
test: 1.5, 2 -> Mean: 1.75
braucht: anweisung
tipp: You get the mean of two numbers by adding them and halving the result.
tipp: For decimal numbers you use the type `double`. The mean is the sum divided by 2. Remember the brackets: `(x + y) / 2`.
lösung: l06-mittelwert-loesung.visustruct
:::

## Now in Java

This is the IPO example from the start in Java:

```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("First number?");
int a = scanner.nextInt();
System.out.println("Second number?");
int b = scanner.nextInt();
int sum = a + b;
System.out.println("Sum: " + sum);
```

- For input, Java needs a **Scanner**. You write the first two lines once at the very top, then you can read as often as you like.
- `scanner.nextInt()` reads a whole number, `scanner.nextDouble()` a decimal number and `scanner.next()` a word.
- The question to the user is a normal output right before it. VisuStruct turns both lines together into one input box.

::: angeberwissen
Java was originally meant to control small devices, and it still does: many SIM cards in phones and many bank cards run a mini version called **Java Card**. Quite possibly you have Java in your pocket right now.
:::

::: übung l06-java-tage
titel: Age in days
code: java
auftrag: Write a Java program that asks for the age in years and outputs roughly how many days that is. Use 365 days per year. For 2 years it shows **That is about 730 days.**
test: 2 -> That is about 730 days.
test: 10 -> That is about 3650 days.
test: 1 -> That is about 365 days.
braucht: anweisung
tipp: First the two scanner lines, then the question and the input, then the calculation, then the output.
tipp: `int years = scanner.nextInt();` reads. `int days = years * 365;` calculates, and `System.out.println("That is about " + days + " days.");` outputs.
lösung: l06-java-tage-loesung.visustruct
:::

## Fill in the gaps: input

::: lückentext
titel: Read a name and an age
auftrag: Fill in the missing words so that the program reads a name and an age.
```java
import java.util.[[Scanner]];
Scanner scanner = [[new]] Scanner(System.[[in]]);

System.out.println("What is your name?");
[[String]] name = scanner.[[next]]();
System.out.println("How old are you?");
int age = scanner.[[nextInt]]();
System.out.println("Hello " + name + ", next year you will be " + [[(age + 1)]] + ".");
```
erklärung: `scanner.next()` reads a word, `scanner.nextInt()` a whole number. The brackets around `age + 1` matter: without them Java first appends `age` and then `1` to the text, and 14 would become **141**.
:::

## Find the bug: sum

::: übung l06-java-fehler
titel: Fix the sum
code: java
auftrag: The program reads two numbers and should output their sum. For 3 and 4, however, it shows **Sum: 34** instead of **Sum: 7**.
  “Open in editor” shows the code in the Code area. Find the bug, fix it and click Check.
start: l06-java-fehler-start.visustruct
test: 3, 4 -> Sum: 7
test: 10, 5 -> Sum: 15
test: 0, 9 -> Sum: 9
braucht: anweisung
tipp: Read the output from left to right: what is `"Sum: " + a`? And what happens when `+ b` comes after it?
tipp: Add brackets so that Java calculates first: `System.out.println("Sum: " + (a + b));`
lösung: l06-java-fehler-loesung.visustruct
:::

## Game: What is output?

::: spiel frage
titel: Game: What is output?
intro: Ludwig has built inputs and outputs. Predict what happens. Seven rounds.

runde:
    int a = 3
    int b = 4
    output: a + b
frage: What is output?
- 7
- [x] 34
- a + b
> In an output, `+` always joins the parts together, even numbers.

runde:
    int a = 3
    int b = 4
    int sum = a + b
    output: "Sum: " + sum
frage: What is output?
- [x] Sum: 7
- Sum: 34
- Sum: sum
> The calculating happens before, in a variable. The output only joins text and result.

runde:
    input: String name "What is your name?"
    output: "Hello" + name + "!"
frage: You type Mia. What is output?
- Hello Mia!
- [x] HelloMia!
- Hello name!
> The text `"Hello"` has no space at the end. That's why everything sticks together.

runde:
    input: int age "How old are you?"
frage: You type 2.5. What happens?
- age is 2.
- age is 2.5.
- [x] The simulation reports an error.
> The data type `int` only allows whole numbers.

runde:
    input: double price "Price in euros?"
frage: Which part of IPO does this box belong to?
- [x] Input
- Process
- Output
> `input:` asks for a value. That is the input.

runde:
    double mean = (a + b) / 2.0
frage: Which part of IPO does this box belong to?
- Input
- [x] Process
- Output
> Here something is calculated. That is the process.

runde:
    output: "Mean: " + mean
frage: Which part of IPO does this box belong to?
- Input
- Process
- [x] Output
> `output:` shows the result. That is the output.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can explain the IPO model. → The IPO model
- I can write an input with a data type, a name and a question. → Input with input:
- I can join text and variables in an output with +. → Careful with + in an output
- I can work out a result first and store it in a variable, then output that variable, e.g. `int sum = a + b`, then `output: sum`. → Careful with + in an output
- I can pick out input, process and output from a task. → From the task to the structure chart
- I can read numbers in Java with the scanner. → Now in Java
:::

## Quiz

::: quiz
? What does IPO stand for?
→ The IPO model
- [x] Input, process, output
- [ ] Input, program, order
- [ ] Insert, paste, open
> Many programs first ask for values, process them and then show the result.

? The variables a and b have the values 3 and 4. What does `output: a + b` show?
→ Careful with + in an output
- [ ] 7
- [x] 34
- [ ] a + b
> In an output, + joins the parts together. Calculate the sum in a variable first.

? Which input fits if a price such as 4.99 should be typed in?
→ Input with input:
- [ ] input: int price "Price?"
- [x] input: double price "Price?"
- [ ] input: String "Price?"
> 4.99 is a decimal number, so double. Also, every input needs a variable name.

? What does `output: "Age: " + age` show if age has the value 12?
→ Careful with + in an output
- [x] Age: 12
- [ ] "Age: " + 12
- [ ] Age: age

? Task: *The program asks for the radius of a circle and shows its circumference.* Match each part of the text to where it belongs in the IPO model.
→ From the task to the structure chart
= asks for the radius -> Input
= circumference = 2 * 3.14 * radius -> Process
= shows its circumference -> Output
> The radius is given, the circumference is what you are looking for. The formula connects the two.

? What does `scanner.nextInt()` read?
→ Now in Java
- [x] A whole number
- [ ] A decimal number
- [ ] A whole sentence
> For decimal numbers there is `scanner.nextDouble()`, for a word `scanner.next()`.
:::
