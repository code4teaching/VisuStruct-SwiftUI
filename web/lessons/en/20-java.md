---
titel: Java
bereich: From structure chart to code
kurz: Generate and read Java code from the structure chart, and the other way round, rebuild Java code as a structure chart.
---

## The code view

A structure chart describes a process. For a computer to run it, you need a program in a programming language. VisuStruct writes this code for you.

Click [{ } Code](#zeige-code) in the toolbar. On the right, the **Code generator** appears:

- At the top you choose the language: **Java**, **Python** or **JavaScript**.
- For Java you also choose under **Java output** between **Snippet** (only the statements) and **Class** (a complete Java file).
- **Diagram text as comments** writes the text of every box as a comment above the code.
- **Copy** puts the code on the clipboard, **Save Java…** saves a `.java` file.

The code changes straight away whenever you change something in the structure chart.

::: angeberwissen
Later on, Nassi worked on the programming language Ada and was in charge of software at Apple. So if you invent structure charts, you do not end up in a goat shed, you end up at Apple.
:::

::: diagramm l17-beispiel.visustruct
A small program with an input, a for loop and a branch. Open it and look at the Java code for it.
:::

## This is the example in Java

For the diagram above, VisuStruct generates this code as a **Snippet**:

```
// import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Which times table?");
int number = scanner.nextInt();
for (int i = 1; i <= 3; i++) {
    int result = number * i;
    System.out.println(i + " times " + number + " = " + result);
}
if (number > 10) {
    System.out.println("That was hard!");
} else {
    System.out.println("That was easy.");
}
```

In Java every statement ends with a **semicolon** `;`. Whatever is inside a box goes in **curly brackets** `{ }` in Java. The indentation shows you what belongs together.

## The elements in Java

- **Statement:** `int sum = 0` becomes `int sum = 0;`
- **Output:** `output: sum` becomes `System.out.println(sum);`
- **Input:** `input: int number "Number?"` becomes two lines: `System.out.println("Number?");` and `int number = scanner.nextInt();`. For the `Scanner`, `Scanner scanner = new Scanner(System.in);` is written once at the top.
- **Branch:** `if (condition) { … } else { … }`
- **Switch:** `switch (value) { case 1 -> { … } default -> { … } }`
- **While loop:** `while (condition) { … }`
- **Do-while loop:** `do { … } while (condition);`
- **For loop:** `for (int i = 0; i < 5; i++) { … }`; the three fields go one after another in the brackets, separated by semicolons.
- **Endless loop:** `while (true) { … }`
- **Break:** `break;`
- **Call:** `calculate();`

If the false path of a branch is empty, VisuStruct still generates an `else` part that contains only the comment `// empty element`. If you switch off **Emit empty else branch in code**, the empty `else` part disappears.

## Snippet or Class

You can paste a **Snippet** into the `main` method of an existing Java program. With **Class** you get a complete file that you can compile and run straight away:

```
import java.util.Scanner;

public class TimesTable {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Which times table?");
        int number = scanner.nextInt();
        ...
    }
}
```

The name of the class comes from the **title** of the diagram. The file must have exactly the same name, so here `TimesTable.java`. **Save Java…** takes care of that for you.

> The generated code is a good start, but check it. If you first create a variable and later read it in again with an input, VisuStruct still writes `int pin = scanner.nextInt();`. Java then reports that `pin` already exists. Simply delete the `int` in that line.

## The Java language mode

In the toolbar you can change the language of the interface. Besides English, German and many others there is **Java (Keywords)**. Then the building blocks in the Elements area have the same names as the commands in Java: `if`, `switch`, `for`, `while`, `do`, `while(true)`, `break` and `call`. The rest of the interface is then in English.

This helps you match the boxes to the Java commands. Your diagram itself stays unchanged.

## Exercise: Java as a structure chart

Now the other way round: here is a piece of Java code. Rebuild it as a structure chart.

```
System.out.println("Enter a number");
int n = scanner.nextInt();
int factorial = 1;
for (int i = 1; i <= n; i++) {
    factorial = factorial * i;
}
System.out.println(factorial);
```

::: übung l17-fakultaet
titel: Factorial from Java
auftrag: Rebuild the Java code above as a structure chart. The program reads in a number n and outputs the product 1 · 2 · … · n.
  At the end, check in the code view whether your Java code looks the same.
test: 3 -> 6
test: 5 -> 120
test: 1 -> 1
braucht: forSchleife
tipp: Read the Java code line by line and think about which box fits each line.
tipp: The first two Java lines together are one single input: `input: int n "Enter a number"`. The for loop has the three fields `int i = 1`, `i <= n` and `i++`.
lösung: l17-fakultaet-loesung.visustruct
:::

## Exercise: else if

In Java, several cases are often written as `else if`:

```
if (age < 6) {
    System.out.println("Free entry");
} else if (age < 18) {
    System.out.println("Child ticket: 4 euros");
} else {
    System.out.println("Adult ticket: 8 euros");
}
```

There is no `else if` in a structure chart. There, a second branch sits in the false path of the first one. If the false path holds only this one branch, VisuStruct turns it back into `else if` when it generates the code, and into `elif` in Python.

::: übung l17-ticket
titel: Ticket price
auftrag: Ask for the age as a whole number and rebuild the Java code above as a structure chart.
test: 5 -> Free entry
test: 6 -> Child ticket: 4 euros
test: 17 -> Child ticket: 4 euros
test: 18 -> Adult ticket: 8 euros
braucht: verzweigung
tipp: In the Java code there is another `if` inside an `else`. In the structure chart that is a branch inside a path.
tipp: Drag a second branch with the condition `age < 18` into the false path of the first branch.
lösung: l17-ticket-loesung.visustruct
:::

## Checklist

::: checkliste
- I can open the code view and choose Java as the language. → The code view
- I know what output, input, branches and loops look like in Java. → The elements in Java
- I know the difference between Snippet and Class. → Snippet or Class
- I can rebuild a short Java program as a structure chart. → Exercise: Java as a structure chart
:::

## Quiz

::: quiz
? What does `output: "Hello"` look like in Java?
- [ ] print("Hello")
- [x] System.out.println("Hello");
- [ ] console.log("Hello");
> print is Python, console.log is JavaScript.

? Where does the class name come from with Class?
- [ ] It is always called Main.
- [x] From the title of the diagram
- [ ] From the first box
> Without a title, the class is called Main.

? Which Java code belongs to a do-while loop?
- [ ] while (condition) { … }
- [x] do { … } while (condition);
- [ ] for (;;) { … }
> With do-while the condition is at the end, so the body runs at least once.

? What does a Break become in Java code?
- [x] break;
- [ ] return;
- [ ] exit();
:::
