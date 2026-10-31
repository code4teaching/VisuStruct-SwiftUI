---
titel: Switch
bereich: Basics
kurz: Run one of many cases, depending on the value of a variable.
---

## Skills I will gain now

::: kompetenzen
- insert a switch, add cases and change case names
- explain when the case default runs
- decide whether a switch or a branch fits better
- write a case selection in Java with switch
:::

## Many possibilities, one variable

A drinks machine has three buttons: 1 for water, 2 for juice, 3 for cocoa. With branches you need three boxes nested inside each other. That quickly gets wide and confusing.

::: diagramm l09-verschachtelt.visustruct
The machine with three nested branches. Each branch checks the same variable choice again.
:::

Whenever you compare **one variable** with **several fixed values**, there is an easier way: the **switch**.

## How a switch is built

At the top of the box is the variable that decides. Below it there is a column of its own for every case. Above each column is the value it belongs to.

::: diagramm l09-automat.visustruct
The same machine as a switch. If choice has the value 2, only column 2 runs.
:::

- The simulation looks for the case whose name matches the value exactly.
- If no case matches, **default** runs. This case is always on the far right.
- After that, the program continues below the switch. Only **one** case ever runs.

> A new switch has the cases 1, 2 and default. Click a case to change its **Case name** in the Object Inspector. With **Add Case** you get a new column in front of default.

## Cases with text

The cases do not have to be numbers. You can also choose by the content of a `String` variable. Then you write the text as the case name, for example `red`.

::: diagramm l09-ampel.visustruct
A traffic light: depending on the colour typed in, a different message appears. In the simulation, also try a colour that does not exist.
:::

Upper and lower case matter: `Red` does not match the case `red`.

## Exercise: Grade in words

::: übung l09-note
titel: Grade in words
auftrag: Ask for a grade as a whole number and output it in words: 1 very good, 2 good, 3 satisfactory, 4 sufficient, 5 poor, 6 fail.
  For any other number, **Not a valid grade** should appear.
test: 1 -> very good
test: 4 -> sufficient
test: 6 -> fail
test: 9 -> Not a valid grade
braucht: fallauswahl
tipp: For many fixed values, a switch is clearer than lots of branches. Every grade gets a case of its own.
tipp: Keep using “Add Case” until you have the cases 1 to 6 and default. At the top of the switch you write `grade`.
lösung: l09-note-loesung.visustruct
:::

## Exercise: Calculator

::: übung l09-rechner
titel: Calculator
auftrag: Ask, one after another, for a whole number `a`, an operator as a `String` and a second whole number `b`.
  For `+`, `-` and `*` you output the result. For any other sign, **Unknown operator** appears.
test: 3, +, 4 -> 7
test: 10, -, 4 -> 6
test: 6, *, 7 -> 42
test: 1, x, 2 -> Unknown operator
braucht: fallauswahl
tipp: First read in all three values. After that, a switch on the operator decides what is calculated.
tipp: Before the switch, create `int result = 0`. In each case you calculate, for example, `result = a + b` and then output `result`. The case names are simply `+`, `-` and `*`.
lösung: l09-rechner-loesung.visustruct
:::

## Switch or branch?

The switch only checks whether a value is **exactly equal** to a case name. So:

- **Switch:** one variable, several fixed values. Examples: choosing from a menu, day of the week as a number, grades.
- **Branch:** ranges and combined conditions. Examples: `age >= 18`, `temperature < 0 || temperature > 30`.

So for “age 18 or older” you still need the branch. You cannot create a case of its own for every possible age.

## Now in Java

The drinks machine looks like this in Java:

```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("1 water, 2 juice, 3 cocoa");
int choice = scanner.nextInt();
switch (choice) {
    case 1 -> {
        System.out.println("Here is your water.");
    }
    case 2 -> {
        System.out.println("Here is your juice.");
    }
    case 3 -> {
        System.out.println("Here is your cocoa.");
    }
    default -> {
        System.out.println("This button does not exist.");
    }
}
```

- After `switch`, the variable being compared is in round brackets.
- Every case starts with `case`, the value and an arrow `->`. After it, curly brackets hold what should happen.
- `default` is the otherwise case. It runs when no value matches.

::: angeberwissen
The arrow `case 1 ->` has only existed in Java since 2020 (Java 14). Before that you wrote `case 1:` and had to end every case with `break;`. If you forgot it, the program simply ran on into the next case. So the arrow has saved a lot of programmers a lot of trouble.
:::

::: übung l10-java-wuerfel
titel: Dice in words
code: java
auftrag: Write a Java program with `switch` that reads a number. For 1 it outputs **one**, for 2 **two**, for 3 **three** and otherwise **unknown**.
test: 1 -> one
test: 2 -> two
test: 3 -> three
test: 7 -> unknown
braucht: fallauswahl
tipp: You need three `case` branches and one `default` branch.
tipp: `switch (number) { case 1 -> { System.out.println("one"); } … default -> { System.out.println("unknown"); } }`
lösung: l10-java-wuerfel-loesung.visustruct
:::

## Fill in the gaps: switch

::: lückentext
titel: Months in words
auftrag: Fill in the missing words and symbols of the case selection.
```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Which month (1 to 3)?");
int month = scanner.nextInt();
[[switch]] (month) {
    [[case]] 1 -> {
        System.out.println("January");
    }
    case 2 [[->]] {
        System.out.println("February");
    }
    [[case]] 3 -> {
        System.out.println("March");
    }
    [[default]] -> {
        System.out.println("Unknown");
    }
}
```
erklärung: After `switch` the variable is in round brackets. Each case starts with `case`, the value and the arrow `->`. `default` runs when no case matches.
:::

## Find the bug: calculator

::: übung l10-java-fehler
titel: Fix the calculator
code: java
auftrag: The calculator reads two numbers and a choice: 1 plus, 2 minus, 3 times. For 7, 3 and choice 2 the result should be **4**, but it calculates **-4**.
  “Open in editor” shows the code in the Code area. Find the bug, fix it and click Check.
start: l10-java-fehler-start.visustruct
test: 7, 3, 2 -> 4
test: 7, 3, 1 -> 10
test: 7, 3, 3 -> 21
test: 7, 3, 5 -> Not an option
test: 10, 4, 2 -> 6
braucht: fallauswahl
tipp: Plus and times are right. Take a close look at `case 2`.
tipp: With minus the order matters: `a - b` instead of `b - a`.
lösung: l10-java-fehler-loesung.visustruct
:::

## Game: Which case?

::: spiel frage
titel: Game: Which case?
intro: Ludwig presses buttons on the drinks machine and other case selections. What happens? Six rounds.

runde:
    int choice = 2;
    switch (choice) {
        case 1 -> { System.out.println("water"); }
        case 2 -> { System.out.println("juice"); }
        case 3 -> { System.out.println("cocoa"); }
        default -> { System.out.println("There is no such button."); }
    }
frage: What is output?
- water
- [x] juice
- There is no such button.
> choice is 2, so exactly `case 2` runs.

runde:
    int choice = 4;
    switch (choice) {
        case 1 -> { System.out.println("water"); }
        case 2 -> { System.out.println("juice"); }
        case 3 -> { System.out.println("cocoa"); }
        default -> { System.out.println("There is no such button."); }
    }
frage: What is output?
- cocoa
- nothing
- [x] There is no such button.
> No case fits 4, so `default` runs.

runde:
    String day = "monday";
    switch (day) {
        case "Monday" -> { System.out.println("maths"); }
        case "Tuesday" -> { System.out.println("sports"); }
        default -> { System.out.println("free"); }
    }
frage: What is output?
- maths
- sports
- [x] free
> With texts every letter counts: "monday" with a small m is not "Monday".

runde:
    int grade = 0;
    switch (grade) {
        case 1 -> { System.out.println("very good"); }
        case 2 -> { System.out.println("good"); }
        case 3 -> { System.out.println("satisfactory"); }
    }
frage: What is output?
- very good
- [x] nothing
- satisfactory
> No case fits, and there is no `default`. Then simply nothing happens.

runde:
frage: You want to check whether `age >= 18`. What fits better?
- [x] a branch
- a case selection
> A case selection only compares with fixed values. For "greater than or equal" you need a branch.

runde:
frage: A dice shows 1 to 6, and for every number a different word should appear. What fits better?
- a branch
- [x] a case selection
> One variable, six fixed values: that's exactly what the case selection is for.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can insert a switch, add cases and change case names. → How a switch is built
- I can explain when the case default runs. → How a switch is built
- I can decide whether a switch or a branch fits better. → Switch or branch?
- I can write a case selection in Java with switch. → Now in Java
:::

## Quiz

::: quiz
? The variable day has the value 5. There are the cases 1, 2, 3 and default. What runs?
→ How a switch is built
- [ ] Nothing at all
- [ ] The case 3
- [x] The case default
> No case name matches 5, so default applies.

? How many cases run each time the switch runs?
→ How a switch is built
- [x] Exactly one
- [ ] All cases from the matching one on
- [ ] All cases
> After the matching case, the program continues straight below the switch.

? What is a switch NOT suitable for?
→ Switch or branch?
- [ ] Choosing menu item 1, 2 or 3
- [x] Checking whether a temperature is above 30 degrees
- [ ] Handling a colour such as red, yellow or green
> “Above 30” is a range. For that you need a branch with a comparison.

? At the traffic light you type `Red`, and the case is called `red`. What happens?
→ How a switch is built
- [ ] The case red runs.
- [x] The case default runs.
- [ ] The simulation reports an error.
> Upper and lower case matter. Red and red are different texts.

? Under which name do you also find the switch in textbooks?
→ How a switch is built
- [ ] Conditional statement
- [ ] Sequence
- [x] Multiple selection
> One of many cases is selected. That is why it is also called multiple selection.

? What is the otherwise case of a switch called in Java?
→ Now in Java
- [ ] else
- [x] default
- [ ] case 0
:::
