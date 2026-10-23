---
titel: When the program crashes: try and catch
bereich: Catching errors
kurz: Use real Java to read error messages and catch crashes with try and catch.
---

## Crashed!

This program should print three grades. Type it into [Live code](#zeige-codelive) and click [▶︎ Run](#zeige-ausfuehren):

```
int[] grades = {2, 3, 1};
System.out.println("First grade: " + grades[0]);
System.out.println("Fourth grade: " + grades[3]);
System.out.println("Done!");
```

The first grade appears, then it stops. VisuStruct reports “Invalid expression: grades[3]”, and “Done!” never shows up. The array only has the slots 0, 1 and 2; there is no slot 3.

::: ludwig
Has this ever happened to you? One small mistake, and the whole program is gone. It happened to me so often that I cried in front of the screen. But there is a solution, and it is called **try** and **catch**.
:::

::: angeberwissen
In 1947 Grace Hopper's team found a moth in the Mark II computer at Harvard University that had caused a fault. They taped it into the logbook and wrote: “First actual case of bug being found”. Since then, program errors have been called **bugs**.
:::

## Switching on real Java

Live code normally calculates with the same simulation as the structure chart. It simply stops when there is an error. To see what real Java does, switch on real Java:

1. Click the [gear](#zeige-einstellungen) at the top right and choose Java as the **Programming language**.
2. In the Java section, tick **Real Java (with Swing)**.

The first time you run a program, VisuStruct downloads about 40 MB once. After that your code is compiled and run just like in a real Java development environment.

> With real Java, input from the console (`Scanner`) does not work yet. That is why our examples work without input.

Now write the program as a whole class, so that the line numbers match, and run it:

```
public class Grades {
    public static void main(String[] args) {
        int[] grades = {2, 3, 1};
        System.out.println("First grade: " + grades[0]);
        System.out.println("Fourth grade: " + grades[3]);
        System.out.println("Done!");
    }
}
```

The [console](#zeige-konsole) now shows:

```
First grade: 2
java.lang.ArrayIndexOutOfBoundsException: 3
	at Grades.main(Grades.java:5)
```

## Reading the error message

A message like this looks scary at first. But it tells you exactly what is going on:

| Part | Meaning |
|---|---|
| `ArrayIndexOutOfBoundsException` | The kind of error: the index is outside the array. |
| `3` | The wrong index. |
| `Grades.java:5` | The line where it happened: line 5. |

Java calls an error like this, at run time, an **exception**. We say: Java *throws* an exception. If nobody catches it, the program stops. That is why “Done!” does not appear.

::: ludwig
Always read error messages from the top: first the name of the exception, then the line number. In Live code the line numbers are on the left next to the code.
:::

## try and catch

With **try** and **catch** you catch the exception. Change the line with `grades[3]` like this:

```
try {
    System.out.println("Fourth grade: " + grades[3]);
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("This grade does not exist.");
}
System.out.println("Done!");
```

- `try` means “give it a go”. Java runs the block in curly brackets as usual.
- If a line in it throws an exception, Java jumps straight into the `catch` block. The rest of the `try` block is skipped.
- The brackets after `catch` say which exception is caught, plus a name for it, usually `e`.
- After that the program carries on as normal. Now “Done!” appears too.

If everything in the `try` block goes well, the `catch` block is simply skipped.

::: ludwig
try and catch are like the net under the trapeze at the circus: as long as everything works, you don't notice it. If someone falls, the net catches them and the show goes on.
:::

> The structure chart has no box for try and catch. So VisuStruct shows the whole block as one statement. You can only run it with real Java.

## Turning text into a number

Often a number is text at first, for example later in a text field in a window. `Integer.parseInt` turns text into a whole number:

```
String input = "twelve";
try {
    int number = Integer.parseInt(input);
    System.out.println("Double: " + number * 2);
} catch (NumberFormatException e) {
    System.out.println("That is not a number: " + input);
}
```

Java cannot convert “twelve” and throws a `NumberFormatException`. The program prints “That is not a number: twelve”. Change the first line to `String input = "12";` and run it again: now “Double: 24” appears.

## Expert knowledge: exceptions are objects

This is not in the curriculum, but it is useful to know.

::: angeberwissen
Every exception is an object of its own class, for example `ArithmeticException` for dividing by 0. `e.getMessage()` gives you its message, such as `/ by zero`.

A `try` may be followed by several `catch` blocks, one for each kind of error. `catch (Exception e)` catches all exceptions, but then tells you less about what happened. And a `finally { … }` block at the end always runs, whether there was an error or not.
:::

## Task: dividing safely

This program crashes:

```
int cake = 12;
int people = 0;
System.out.println("Everyone gets " + cake / people + " pieces.");
System.out.println("Enjoy!");
```

1. Run it with real Java and read the error message. Which exception is it?
2. Catch it with try and catch. Instead of the crash, “You can't share without people.” should appear, and “Enjoy!” should still be printed.
3. Set `people` to 4 and check that “Everyone gets 3 pieces.” appears.

::: ludwig
The exception is called `ArithmeticException`. Only put the line that can crash into the `try` block.
:::

## Checklist

::: checkliste
- I can switch on real Java in Live code. → Switching on real Java
- I can read the exception and the line from an error message. → Reading the error message
- I can catch an exception with try and catch. → try and catch
- I can turn text into a number with Integer.parseInt and catch the NumberFormatException. → Turning text into a number
- My program divides safely, even by 0. → Task: dividing safely
:::

## Quiz

::: quiz
? What happens if an exception is not caught?
- [ ] Java skips the line and carries on.
- [x] The program stops.
- [ ] The computer restarts.
> That is why “Done!” does not appear in the first example.

? What happens in the try block after the line that throws an exception?
- [ ] The remaining lines run anyway.
- [x] The rest is skipped and Java jumps into the catch block.
- [ ] Java starts the try block again.

? Which exception does Integer.parseInt("twelve") throw?
- [ ] ArithmeticException
- [ ] ArrayIndexOutOfBoundsException
- [x] NumberFormatException
> “twelve” is not in a number format that Java understands.

? Match each exception to its cause.
= ArrayIndexOutOfBoundsException -> index outside the array
= ArithmeticException -> dividing by 0
= NumberFormatException -> text is not a number
:::
