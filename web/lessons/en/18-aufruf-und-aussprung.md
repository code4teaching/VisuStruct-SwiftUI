---
titel: Call and break
bereich: Basics
kurz: Split big tasks into subprograms and leave loops early.
---

## Split big tasks

Long structure charts quickly get confusing. That is why you split a big task into **smaller problems**. Every smaller problem gets a name of its own and a structure chart of its own, a **subprogram**.

A quiz, for example, has three parts: greet, ask questions, show the result. The main program only names these three parts:

::: diagramm l15-hauptprogramm.visustruct
The main program is made of just three calls. What happens in each part is in a structure chart of its own.
:::

That way you see at a glance how the program is built. The details are somewhere else.

## The call

A **call** is a box with double vertical lines on the left and right. It means: run the subprogram with this name here, then carry on.

- You drag **Call** from the Elements area and type the name into it, e.g. `showGreeting()`.
- The round brackets at the end show that it is a subprogram. That is how you write it in Java, Python and JavaScript, too.
- You build the subprogram itself as a structure chart of its own in a new tab. As the title you type the same name.

::: diagramm l15-unterprogramm.visustruct
The subprogram showGreeting() as a structure chart of its own.
:::

> **In the simulation:** When the simulation reaches a call, it looks among the open tabs for the structure chart with this title and runs it. Then it carries on in the main program. While the subprogram is running, the call box stays highlighted. A subprogram like this one, with only a name as its title, shares its variables with the main program. You will soon learn how a subprogram gets variables of its own. If there is no matching tab, the simulation skips the call and shows a note.

::: angeberwissen
Why does your teacher always say “method” in Java and never “function” or “procedure”? Because in Java every subprogram has to belong to a class, and the subprograms of a class are called methods. The difference still exists, though: if a method hands back a result, it is really a function. If it has `void` in front, it hands back nothing and is really a procedure. Java just keeps it simple and calls both methods. So do I: my method is called Munching.
:::

## Exercise: Add a call

::: übung l15-titel
titel: Greeting with a call
auftrag: Imagine the subprogram `showTitle()` already exists. Build the main program: first it calls `showTitle()`. Then it asks for a name and outputs **Hello** and the name.
  So when Ada is typed in, **Hello Ada** appears.
test: Ada -> Hello Ada
test: Ben -> Hello Ben
braucht: aufruf
tipp: The main program has three parts: the call, the input and the output.
tipp: Drag a Call from the Elements area right to the top and type `showTitle()` into it. Below it come the input `input: String name "What is your name?"` and the output.
lösung: l15-titel-loesung.visustruct
:::

## Pass values: parameters

Often a subprogram should work with values that are only known when it is called. Then it gets a **header line** as its title:

```
void showSum(int a, int b)
```

- `void` means: the subprogram does not hand back a result.
- `showSum` is the name.
- The brackets hold the **parameters**: variables with a data type that get their values when the subprogram is called. You separate several of them with commas.

::: diagramm l15-zeige-summe.visustruct
The subprogram with the header line as its title. It calculates with a and b as if they were normal variables.
:::

In the call box you write the values in the brackets, e.g. `showSum(3, 4)`. The first value goes into `a`, the second into `b`. Instead of numbers you can also use variables and calculations such as `showSum(x, x + 1)`.

::: diagramm l15-zeige-summe-haupt.visustruct
The main program calls showSum twice with different values. Open both diagrams and start the simulation here.
:::

> **Local variables:** The parameters and all variables created in the subprogram belong only to the subprogram. It gets **copies** of the values; more on that below under call by value. During the call, the simulation only shows the variables of the subprogram.

## Hand back a result: return

A subprogram can also hand back a result, the **return value**. Then the header line has the data type of the result instead of `void`:

```
int square(int x)
```

The statement `return result` hands back the value and ends the subprogram straight away. When you call it, you store the result in a variable: after `int q = square(5)`, `q` holds the value 25.

::: diagramm l15-quadrat.visustruct
The subprogram square calculates and hands back the result with return.
:::

::: diagramm l15-quadrat-haupt.visustruct
The main program stores the return value in q. Open both diagrams and try the simulation.
:::

> A subprogram with a return value has to end with `return`. If the return is missing, the simulation reports an error.

In the **code view**, the header line becomes a Java method (`public static int square(int x)`), a `def` in Python and a `function` in JavaScript. If the subprograms are open in other tabs, they appear in the code together with the main program.

## Exercise: Calculate the area

::: übung l15-flaeche
titel: Calculate the area
auftrag: Build two diagrams. The subprogram `int area(int a, int b)` hands back the area of a rectangle, that is a times b. The main program asks for the length and the width, calls `area` and outputs **Area:** and the result.
  With 3 and 4, **Area: 12** appears.
test: 3, 4 -> Area: 12
test: 5, 5 -> Area: 25
test: 7, 0 -> Area: 0
braucht: aufruf
tipp: You build two diagrams: a subprogram that only calculates and hands back the result, and a main program for input and output.
tipp: Open a new tab with **+** and give it the title `int area(int a, int b)`. One statement is enough inside: `return a * b`. In the main program you type `int f = area(length, width)` into the call box.
lösung: l15-flaeche-loesung.visustruct
unterprogramm: l15-flaeche-unterprogramm-loesung.visustruct
:::

## Copy or original: call by value and call by reference

What happens if a subprogram changes its parameter? That depends on **what** is passed.

**Call by value:** With `int`, `double`, `boolean`, `char` and `String`, the subprogram gets a **copy** of the value. If it changes its parameter, the caller's variable stays as it was.

**Call by reference:** With an **array**, the subprogram does not get a copy but a reference to the same array. If it changes a slot, the slot is changed for the caller too. The header line for this looks like this:

```
void clear(boolean[] seats)
```

::: grafik uebergabe.svg
At the top, doubleIt gets a copy of number. At the bottom, row and seats point to the same array.
:::

Try out both. Open the three diagrams and start the simulation in the main program:

::: diagramm uebergabe-verdopple.visustruct
doubleIt only changes its copy x.
:::

::: diagramm uebergabe-leeren.visustruct
clear sets all seats to false, for example when a showing is cancelled.
:::

::: diagramm uebergabe-haupt.visustruct
number is still 5 after the call. The seats in row, on the other hand, are free after the call.
:::

> If you want to get a number back from a subprogram, use `return`, e.g. `number = doubleIt(number)` with the header line `int doubleIt(int x)`. An array, on the other hand, can be changed by the subprogram directly.

::: angeberwissen
Strictly speaking, Java only knows call by value. But with an array, the whole array is not copied, only its **address** in memory. With the copied address, the subprogram finds the same array. It is as if I gave you a copy of my locker key: the key is copied, but the hay in the locker only exists once.
:::

## Exercise: Bonus points

::: übung uebergabe-bonus
titel: Bonus points
auftrag: The main program calls `bonus(points)` and then outputs all the points. Build the subprogram `void bonus(int[] points)` that increases every score in the array by 1. Instead of 3, 5 and 8 you then see **4**, **6** and **9**.
start: uebergabe-bonus-start.visustruct
test: - -> 4 | 6 | 9
braucht: aufruf
tipp: The main program is already finished. You only build the subprogram in a new tab.
tipp: Open a new tab with **+** and the title `void bonus(int[] points)`. Inside, a for loop runs over all slots and calculates `points[i] = points[i] + 1`. You do not need a return, because the array is changed directly.
lösung: uebergabe-bonus-loesung.visustruct
unterprogramm: uebergabe-bonus-unterprogramm-loesung.visustruct
:::

## The break

Sometimes a loop should end **early**, in the middle of its body. That is what the **Break** is for. It leaves the loop it is in straight away. The program carries on with the first box after the loop. In Java, Python and JavaScript this is called `break`.

You recognise the Break by the point on its left edge. You can write a short comment into the box, e.g. `Leave the loop`. It appears in the code as a comment after `break`.

A Break almost always sits in a **branch**: the loop is only left if a condition is met.

A typical case is the **endless loop with a Break**. The loop itself has no condition. It runs until the Break is reached:

::: diagramm l15-endlos-aussprung.visustruct
The loop keeps asking for a number. With 0 it jumps out, otherwise it adds the number to the sum.
:::

Without a Break, an endless loop would really never end.

## Break in the simulation

The simulation runs the Break like `break`: it leaves the innermost loop and carries on after it. If a Break is outside every loop, the subprogram ends; in the main program, the whole program ends. `return` does the same.

Often you can do without a Break altogether: you write the stop condition straight into the loop. That is usually even clearer.

## Exercise: Sum until 0

::: übung l15-bis-null
titel: Sum until 0
auftrag: Rebuild the program “Sum until 0” **without** a Break. It keeps asking for whole numbers until someone types 0. Then it outputs **Sum:** and the sum of all the numbers typed in.
test: 3, 4, 0 -> Sum: 7
test: 0 -> Sum: 0
test: 10, -2, 5, 0 -> Sum: 13
tipp: Without a Break, the condition of the loop itself has to check whether 0 was typed in.
tipp: Ask for the first number before the loop. The while loop runs with the condition `number != 0`. In the body you add the number to the sum and then ask for the next number. For the second input you only write `input: number "…"`, because `number` already exists.
lösung: l15-bis-null-loesung.visustruct
:::

## Now in Java

In Java a subprogram is called a **method**. The square from above looks like this:

```
public static int square(int x) {
    int result = x * x;
    return result;
}
```

The main program calls the method by its name and passes the value in round brackets:

```
int q = square(number);
System.out.println("The square is " + q);
```

- In the header, what the method returns (`int`) comes before the name. If it returns nothing, it says `void`.
- The parameters go in the round brackets with their data type: `(int x)`. You separate several with commas.
- In the Programming area you write every method in its own tab, just as every subprogram has its own structure chart.
- In Java the exit is called `break`. With `while (true)` you build a loop that only ends through `break`.

::: übung l18-java-kasse
titel: Till with break
code: java
auftrag: Write a till in Java. It keeps asking for a price in whole euros. At 0 it leaves the loop with `break`. Then it outputs how many items there were and what they cost altogether.
  For 3, 4 and then 0 you see **Items: 2** and **Total: 7**.
test: 3, 4, 0 -> Items: 2 | Total: 7
test: 0 -> Items: 0 | Total: 0
test: 10, 2, 5, 0 -> Items: 3 | Total: 17
braucht: endlosschleife, aussprung
tipp: You need two variables that start at 0 before the loop: one for the sum and one for the count.
tipp: Inside `while (true) { … }` you read the price. Right after that you check `if (price == 0) { break; }`. Only after that do you add the price to the sum and increase the count by 1.
lösung: l18-java-kasse-loesung.visustruct
:::

## Game: What comes back?

::: spiel frage
titel: Game: What comes back?
intro: Ludwig calls methods and jumps out of loops. Predict what is output. Seven rounds.

runde:
    public static int square(int x) {
        return x * x;
    }

    int q = square(5);
    System.out.println(q);
frage: What is output?
- 5
- 10
- [x] 25
> The call puts 5 into x, and return gives back 5 · 5.

runde:
    public static void showSum(int a, int b) {
        System.out.println(a + b);
    }

    int x = 2;
    showSum(x, x + 1);
frage: What is output?
- [x] 5
- 23
- 3
> The first value 2 goes into a, the second value 3 into b. In Java, `a + b` calculates with numbers as usual.

runde:
frage: What does a method return when `void` stands in front of its name?
- a whole number
- [x] nothing
- always 0
> `void` means: no return value. With `int` there, a whole number comes back.

runde:
    public static void doubleIt(int x) {
        x = x * 2;
    }

    int number = 5;
    doubleIt(number);
    System.out.println(number);
frage: What is output?
- [x] 5
- 10
- 0
> Call by value: doubleIt gets a copy. number stays 5.

runde:
    public static void clear(boolean[] seats) {
        for (int i = 0; i < seats.length; i++) {
            seats[i] = false;
        }
    }

    boolean[] row = {true, true};
    clear(row);
    System.out.println(row[0]);
frage: What is output?
- true
- [x] false
> With an array, row and seats point to the same array. The caller sees the change too.

runde:
    int sum = 0;
    for (int i = 1; i <= 10; i++) {
        if (i == 4) {
            break;
        }
        sum = sum + i;
    }
    System.out.println(sum);
frage: What is output?
- [x] 6
- 10
- 55
> At i = 4, `break` jumps out of the loop straight away. Only 1 + 2 + 3 have been added.

runde:
    int number = 1;
    while (true) {
        number = number * 3;
        if (number > 20) {
            break;
        }
    }
    System.out.println(number);
frage: What is output?
- 9
- 20
- [x] 27
> 3, 9, 27. Only 27 is greater than 20, then the endless loop ends with break.
:::

## Checklist

::: checkliste
- I can split a big task into smaller problems. → Split big tasks
- I can insert a call and build a subprogram in a tab of its own. → The call
- I can pass values to a subprogram with parameters. → Pass values: parameters
- I can hand back a return value with return and store it when calling. → Hand back a result: return
- I can explain why a subprogram cannot change a number but can change an array. → Copy or original: call by value and call by reference
- I know what a Break does and why it sits in a branch. → The break
- I can end a loop with a Break or through its condition. → Break in the simulation
- I recognise a method in Java and can leave a loop with `break`. → Now in Java
:::

## Quiz

::: quiz
? What does a call box with the text `showResult()` mean?
- [ ] The program ends here.
- [x] The subprogram showResult() runs here, and then the program carries on.
- [ ] The word showResult() is output here.

? Where does the program carry on after a Break?
- [ ] At the start of the loop
- [x] At the first box after the loop
- [ ] Right at the start of the program
> The Break leaves the loop it is in. In Java, Python and JavaScript it is called break.

? Why does a Break usually sit in a branch?
- [x] So that the loop is only left if a condition is met
- [ ] Because otherwise a Break cannot be saved
- [ ] Because a branch is a loop itself
> Without a branch, the loop would be left in the very first pass.

? Where does the simulation find the subprogram for a call `showResult()`?
- [ ] It has to be in the same structure chart.
- [x] In an open tab with the title showResult()
- [ ] The simulation cannot run subprograms.
> Build every subprogram in a tab of its own and give it the name from the call as its title.

? The subprogram has the header line `void showSum(int a, int b)`. Which call fits?
- [ ] showSum()
- [x] showSum(3, 4)
- [ ] int s = showSum(3, 4)
> Two parameters need two values. And `void` means nothing comes back that you could store.

? After `int q = square(5)`, q holds 25. What is at the end of the subprogram square?
- [ ] output: x * x
- [x] return x * x
- [ ] q = x * x
> With return the subprogram hands the value back to the call. An output would only show it.

? `void doubleIt(int x)` calculates `x = x * 2`. The main program has `int number = 5` and then the call `doubleIt(number)`. What value does number have afterwards?
- [x] 5
- [ ] 10
- [ ] 0
> Call by value: doubleIt only changed a copy of number.

? `void clear(boolean[] seats)` sets all slots to false. What is true for the array row in the main program after `clear(row)`?
- [ ] It is unchanged, because the subprogram gets a copy.
- [x] All slots are false, because seats and row are the same array.
- [ ] The array is deleted.
> Call by reference: an array is passed as a reference. The caller sees changes to the slots too.

? What is a subprogram called in Java?
- [ ] Class
- [x] Method
- [ ] Loop
> In Java a subprogram is a method, for example the `main` method. Depending on its kind, it is also called a procedure or a function.

? Many building blocks have a second name in textbooks. Match each term from VisuStruct to its other name.
= Branch -> Conditional statement
= Switch -> Multiple selection
= Loop -> Iteration
= Subprogram -> Method
> Both names mean the same thing. If you know one of them, you understand the other as well.

? What is written in the header of a Java method that returns nothing?
- [ ] int
- [x] void
- [ ] return
> void means “empty”: the method does something but returns no value.
:::
