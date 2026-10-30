---
titel: Structure chart and code
bereich: From structure chart to code
kurz: All elements in Java at a glance, generate code, write Java in the Programming area, run it and find mistakes.
---

## Skills I will gain now

::: kompetenzen
- open the code view and choose Java as the language
- recognise output, input, branches and loops in Java
- explain the difference between Snippet and Class
- explain how Java code runs on every operating system with the compiler, bytecode and the JVM
- tell the JDK and the JRE apart
- explain why a C++ program has to be compiled again for every operating system but a Java program does not
- rebuild a short Java program as a structure chart
- type Java in the Programming area and read the structure chart that is built
- run a program with ▶︎ and use input and output in the console
- set breakpoints and follow a program step by step
:::

## The code view

In lessons 4 to 19 you have already written every element in Java. Here you see everything at a glance and learn how VisuStruct turns a whole structure chart into a Java program.

A structure chart describes a process. For a computer to run it, you need a program in a programming language. VisuStruct writes this code for you.

Click [Code](#zeige-code) in the tools (icon with angle brackets). On the right, the **Code generator** appears:

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

| Element | Java | Lesson |
|---|---|---|
| Statement | `int sum = 0;` | 4, 5 |
| Output | `System.out.println(sum);` | 6 |
| Input | `int number = scanner.nextInt();` | 6 |
| Branch | `if (condition) { … } else { … }` | 8, 9 |
| Switch | `switch (value) { case 1 -> { … } default -> { … } }` | 10 |
| While loop | `while (condition) { … }` | 11 |
| Do-while loop | `do { … } while (condition);` | 12 |
| For loop | `for (int i = 0; i < 5; i++) { … }` | 13 |
| Endless loop | `while (true) { … }` | 11, 18 |
| Break | `break;` | 18 |
| Call | `calculate();` | 18 |
| Array | `int[] numbers = new int[5];` | 15, 16 |
| Text (String) | `String name = scanner.next();` | 17 |

For input, `import java.util.Scanner;` and `Scanner scanner = new Scanner(System.in);` are written once at the very top. Before every input VisuStruct outputs the question with `System.out.println(…)`.

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
    } // end main
} // end class
```

The comments `// end main` and `// end class` after the last two brackets are not needed, but very helpful: you see at once which bracket closes what, and you don't forget one.

The name of the class comes from the **title** of the diagram. The file must have exactly the same name, so here `TimesTable.java`. **Save Java…** takes care of that for you.

> The generated code is a good start, but check it. If you first create a variable and later read it in again with an input, VisuStruct still writes `int pin = scanner.nextInt();`. Java then reports that `pin` already exists. Simply delete the `int` in that line.

## How Java runs on every computer

Your file `TimesTable.java` is **source code**: text for people. The processor in your computer cannot understand it directly. That is why Java runs in two steps:

1. The **compiler** `javac` translates the source code into **bytecode**. The result is the file `TimesTable.class`.
2. The **JVM** (Java Virtual Machine) reads the bytecode and, while running it, translates it into **machine code**: instructions for the processor in your computer.

::: grafik l20-jvm.svg

There is only one bytecode. But there is a JVM for Windows, macOS, Linux and many other systems. That is why the same `.class` file runs on every computer that has a JVM installed. This is called **platform independent**. The slogan for it is **“Write once, run anywhere”**.

Compare this with **C++**: there the compiler translates the source code directly into machine code for exactly one processor and one operating system. The finished program only runs there. For Windows, macOS and Linux you have to compile it again each time.

::: grafik l20-cpp.svg

| | C++ | Java |
|---|---|---|
| The compiler creates | machine code | bytecode |
| How often do you compile? | again for every system | once |
| What does the computer need to run it? | nothing else | a JVM |

Does that make Java slower? Hardly. Parts of a program that run often, loops for example, are translated completely into machine code once by the JVM’s **JIT compiler** (“just in time”). After that they run almost as fast as C++.

> Think of the JVM as a small computer made of software, almost like an operating system of its own just for Java programs. Strictly speaking it is not an operating system, though, but a **virtual machine**: a program that itself runs on Windows, macOS or Linux and pretends to be a computer inside it.

When you install Java you meet two abbreviations:

| Abbreviation | What is inside? | What for? |
|---|---|---|
| **JRE** (Java Runtime Environment) | the JVM and ready-made building blocks such as `Scanner` | running Java programs |
| **JDK** (Java Development Kit) | the JRE plus the compiler `javac` and other tools | writing and compiling Java programs |

So to program you need the JDK. Today you usually only download the JDK, the JRE is inside it. For VisuStruct in the browser you don't need to install any of this.

::: angeberwissen
Every compiled Java file (`.class`) starts with the same four bytes, written in hexadecimal: `CA FE BA BE`. That is how the computer recognises it as Java. James Gosling came up with this “cafe babe”, to go with the coffee in the name.
:::

## The Java language mode

Under the [gear](#zeige-einstellungen) at the top right you can switch on **Code keywords**. Then the building blocks in the Elements area have the same names as the commands in Java: `if`, `switch`, `for`, `while`, `do`, `while(true)`, `break` and `call`. The rest of the interface stays in your language.

This helps you match the boxes to the Java commands. Your diagram itself stays unchanged.

## Write Java directly

So far you drew the structure chart first and then looked at the code. In the [Programming](#zeige-codelive) area it also works the other way round. Click the slim **Programming** strip on the right. Next to the structure chart a column appears where you type Java yourself.

- **Structure chart to code:** When you change something in the structure chart, the Java code changes right away.
- **Code to structure chart:** When you type Java, VisuStruct builds the structure chart as you type. If something is still missing, for example a closing bracket `}`, a hint appears below the code.
- **Suggestions:** While you type, VisuStruct suggests templates, for example for `if`, `for` or `while`. Press Enter to accept a template. Simply replace the grey placeholders with your own text.
- **Indent:** If your code has got messy, click the **Indent** button at the top of the Programming area. Every level then sits four spaces deeper, as in Eclipse or IntelliJ. If you have selected lines, VisuStruct only indents those.

So you can try both ways. Drawing the structure chart first is good for planning a process. Writing code directly is faster when you already know what you want. The structure chart then helps you check your code.

## Run the program

At the top of the Programming area, [▶︎ Run](#zeige-ausfuehren) starts your program and **■ Stop** ends it, for example in an endless loop. What your program outputs appears below in the [console](#zeige-konsole). If it asks for input, type it there and press Enter.

You can drag the border between code and console up or down with the mouse.

> The Programming area understands the Java commands that also exist as boxes in the structure chart. It does not know your own classes and objects yet. Windows with Swing work anyway: turn on **Real Java (with Swing)** under the gear (lesson “Your first window”).

::: angeberwissen
Professionals call a program where you write code, run it and look for mistakes an **IDE** (Integrated Development Environment). With the Programming area, VisuStruct is a small IDE with a built-in structure chart.
:::

## Find mistakes with the debugger

Sometimes a program runs but calculates something wrong. Then the **debugger** helps: it runs your program slowly while you watch.

- **Breakpoint:** Click a line number on the left. A red dot appears. [▶︎ Run](#zeige-ausfuehren) pauses before this line. Click again to remove the dot.
- **Yellow line:** This line runs next. The matching box is selected in the structure chart.
- **Variables:** Below the code you see the current value of every variable. Whatever changed since the last pause lights up yellow for a moment.
- **Step:** The [Step](#zeige-einzelschritt) button next to ▶︎ runs exactly one line and pauses again. Without a breakpoint it starts the program and pauses before the first line.
- **Continue:** ▶︎ runs to the next breakpoint or to the end. **■ Stop** ends it.

Try it with this program. Set a breakpoint on line 3 and press ▶︎ several times. How do `i` and `summe` grow?

```
int summe = 0;
for (int i = 1; i <= 4; i++) {
    summe = summe + i;
}
System.out.println("Summe: " + summe);
```

::: ludwig
This is a desk check, except the computer takes the notes for you. Before each step, think about which value the variable should have next. When the table doesn't match your guess, you have found the place with the mistake.
:::

## Exercise: Code first, then the structure chart

This time you don't draw. Open the Programming area and type in this Java code:

```
System.out.println("Start number?");
int zahl = scanner.nextInt();
while (zahl > 0) {
    System.out.println(zahl);
    zahl = zahl - 1;
}
System.out.println("Start!");
```

::: übung l20-countdown
titel: Countdown
auftrag: Type the Java code above into the Programming area. Run it with ▶︎ and enter a start number in the console.
  Then look at the structure chart that was built and click Check.
test: 3 -> 3 | 2 | 1 | Start!
test: 1 -> 1 | Start!
test: 0 -> Start!
braucht: whileSchleife
tipp: Open the Programming area with the slim strip on the far right and just start typing.
tipp: Watch out for the semicolon at the end of every statement and the curly brackets of the while loop. A hint below the code tells you when something is still missing.
lösung: l20-countdown-loesung.visustruct
:::

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

## Game: Which box?

::: spiel frage
titel: Game: Which box?
intro: Ludwig shows you Java. Which box from the structure chart is behind it? Eight rounds.
frage: Which box is this?

runde:
    do {
        number = number * 2;
    } while (number < 100);
- While loop
- [x] Do-while loop
- For loop
> The condition is at the bottom. So the body runs at least once.

runde:
    switch (choice) {
        case 1 -> { System.out.println("water"); }
        default -> { System.out.println("There is no such button."); }
    }
- Branch
- [x] Switch
- Call
> One variable is compared with fixed values: that is the switch.

runde:
    break;
- Call
- Endless loop
- [x] Break
> `break` leaves the loop it stands in straight away.

runde:
    calculate();
- [x] Call
- Output
- Statement
> A name with round brackets: a subprogram is called here.

runde:
    int number = scanner.nextInt();
- Output
- [x] Input
- Call
> The scanner reads in a value. That is an input.

runde:
    while (true) {
        System.out.println("Hello");
    }
- While loop with a condition
- [x] Endless loop
- Do-while loop
> `while (true)` has no real condition. Only a break could end it.

runde:
frage: You want a complete Java file that you can compile and run straight away. What do you choose in the code view?
- Snippet
- [x] Class
> A snippet is only the statements for the `main` method. Class creates the whole file.

runde:
frage: In the debugger, a line is yellow. What does that mean?
- It has a mistake.
- [x] It runs next.
- There is a breakpoint there.
> Yellow is the next line. A breakpoint is a red dot at the line number.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can open the code view and choose Java as the language. → The code view
- I can recognise output, input, branches and loops in Java. → The elements in Java
- I can explain the difference between Snippet and Class. → Snippet or Class
- I can explain how Java code runs on every operating system with the compiler, bytecode and the JVM. → How Java runs on every computer
- I can tell the JDK and the JRE apart. → How Java runs on every computer
- I can explain why a C++ program has to be compiled again for every operating system but a Java program does not. → How Java runs on every computer
- I can rebuild a short Java program as a structure chart. → Exercise: Java as a structure chart
- I can type Java in the Programming area and read the structure chart that is built. → Write Java directly
- I can run a program with ▶︎ and use input and output in the console. → Run the program
- I can set breakpoints and follow a program step by step. → Find mistakes with the debugger
:::

## Quiz

::: quiz
? What does `output: "Hello"` look like in Java?
→ The elements in Java
- [ ] print("Hello")
- [x] System.out.println("Hello");
- [ ] console.log("Hello");
> print is Python, console.log is JavaScript.

? Where does the class name come from with Class?
→ Snippet or Class
- [ ] It is always called Main.
- [x] From the title of the diagram
- [ ] From the first box
> Without a title, the class is called Main.

? Which Java code belongs to a do-while loop?
→ The elements in Java
- [ ] while (condition) { … }
- [x] do { … } while (condition);
- [ ] for (;;) { … }
> With do-while the condition is at the end, so the body runs at least once.

? What does a Break become in Java code?
→ The elements in Java
- [x] break;
- [ ] return;
- [ ] exit();

? What happens at a red dot before the line number?
→ Find mistakes with the debugger
- [ ] The line is skipped.
- [x] The program pauses before this line.
- [ ] The line contains a mistake.
> That is a breakpoint. Continue with ▶︎ or Step.

? Why does the same `.class` file run on Windows, macOS and Linux?
→ How Java runs on every computer
- [ ] The compiler creates a separate file for every operating system.
- [x] On every operating system a JVM runs the same bytecode.
- [ ] Java programs don't need an operating system.
> The bytecode stays the same. Only the JVM exists separately for each system.

? What do you need to write and compile Java programs?
→ How Java runs on every computer
- [ ] only the JRE
- [x] the JDK
- [ ] only the JVM
> The JRE is enough to run programs. The compiler `javac` only comes with the JDK.

? You want to use your program on Windows and on a Mac. What is true?
→ How Java runs on every computer
- [ ] You have to compile Java again for every system, but not C++.
- [x] You have to compile C++ again for every system, but not Java.
- [ ] You only compile both once.
> C++ becomes machine code for one system directly. Java becomes bytecode, and the JVM runs it on every system.
:::
