---
titel: Your first window
bereich: Windows with Swing
kurz: Open your own window with Java and Swing, explained line by line.
---

## Programs with windows

So far your programs have written text to the console. Most programs you know, however, have **windows** with buttons and text fields. This is called a graphical user interface.

Java comes with a toolbox for this: **Swing**. In VisuStruct you switch it on like this:

1. Open the [Programming](#zeige-codelive) area on the right.
2. Click the [gear](#zeige-einstellungen) at the top right and choose Java as the **Programming language**.
3. Below that, in the Java section, tick **Real Java (with Swing)**.

The first time you click [▶︎ Run](#zeige-ausfuehren), VisuStruct downloads about 40 MB once, which takes a moment. After that your code runs as real Java, and your windows appear in the Programming area in the **Java windows** box above the console.

> With “Real Java”, input from the console (`Scanner`) does not work yet. For programs with input, untick the box again.

::: angeberwissen
Swing has been around since 1998. Before that, Java only had the older AWT with a class called `Frame`. So that nobody mixes up the new building blocks, almost all names in Swing start with **J**: `JFrame`, `JButton`, `JLabel`. The J tells you straight away that it is Swing.
:::

## The whole program

This is the smallest program that opens a window. Type it into the Programming area and click [▶︎ Run](#zeige-ausfuehren):

```
import javax.swing.*;

public class MyWindow {
    public static void main(String[] args) {
        JFrame window = new JFrame("My first window");
        window.setSize(300, 200);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setVisible(true);
    }
}
```

An empty grey window with the title “My first window” appears. That's all, but it is your very own window!

You already know the frame with `public class` and `main` from the Java lesson. The first line and the four lines inside `main` are new. Let's look at them one by one.

::: ludwig
Look at the structure chart next to the code: every line in `main` is a box, one below the other. So at the start, a window program is just a sequence.
:::

## Line by line

| Line | What it does |
|---|---|
| `import javax.swing.*;` | Brings the Swing toolbox into the program. Without this line Java does not know `JFrame`. |
| `JFrame window = new JFrame("My first window");` | Builds a new window. The text in brackets is the title at the top of the window frame. After that you talk to it through the variable `window`. |
| `window.setSize(300, 200);` | The window becomes 300 pixels wide and 200 pixels high. |
| `window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);` | When someone closes the window, the program ends too. |
| `window.setVisible(true);` | Only now does the window become visible. |

The dot in `window.setSize(…)` means: “Window, do this!” Before the dot is who should do something, after it is what they should do.

> Without `setDefaultCloseOperation`, Java only hides the window when it is closed. The program then keeps running invisibly.

## Why setVisible comes last

`setVisible(true)` shows the window exactly as it is at that moment. So you set everything up first: title, size, and later buttons too. Only at the very end do you make the window visible.

Things you put into the window after `setVisible(true)` often do not appear. Java does not redraw the window on its own. Sometimes they only show up when you resize the window. Mistakes like that are hard to find.

::: ludwig
Set up first, then show. Like in the theatre: the curtain only goes up once the stage is ready.
:::

Try it: delete the line with `setVisible(true)` and run the program again. The program runs, but you do not see a window.

## Expert knowledge: classes and objects

This is not in the curriculum, but it helps you understand Swing.

::: angeberwissen
Java is really an **object-oriented** language. `JFrame` is a class, a blueprint for windows. With `new JFrame(…)` Java builds a real window from this blueprint, an **object**. With two `new` you could build two windows, both from the same blueprint.

`setSize` and `setVisible` are methods that every window object has. That is why you write `window.setSize(…)`: the object `window` runs its method. Your program itself is a class too, namely `MyWindow`.
:::

## Game: What happens?

::: spiel frage
titel: Game: What happens?
intro: Ludwig has been tinkering with the window program. Read the lines and predict what happens. Six rounds.

runde:
    JFrame window = new JFrame("Hello");
    window.setSize(300, 200);
    window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
frage: What do you see after running it?
- a window with the title "Hello"
- [x] no window at all
- an error message
> `setVisible(true)` is missing. The window is built, but it stays invisible.

runde:
    JFrame window = new JFrame("Hello");
    window.setSize(200, 300);
    window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    window.setVisible(true);
frage: What does the window look like?
- wider than high
- [x] higher than wide
- square
> The first number is the width, the second the height: 200 wide, 300 high.

runde:
    JFrame window = new JFrame("Hello");
    window.setSize(300, 200);
    window.setVisible(true);
frage: You close the window. What happens to the program?
- It ends.
- [x] It keeps running invisibly.
- The window opens again right away.
> Without `setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE)` Java only hides the window.

runde:
    JFrame window = new JFrame();
    window.setSize(300, 200);
    window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    window.setVisible(true);
frage: What is written at the top of the window frame?
- window
- JFrame
- [x] nothing, the title is empty
> Without text in the brackets the window has no title. The variable name `window` never shows up in the window.

runde:
    public class Test {
        public static void main(String[] args) {
            JFrame window = new JFrame("Test");
            window.setVisible(true);
        }
    }
frage: What does javac report?
- [x] cannot find symbol: class JFrame
- nothing, the window appears
- missing return statement
> The line `import javax.swing.*;` is missing. Without it Java doesn't know `JFrame`.

runde:
    JFrame a = new JFrame("One");
    JFrame b = new JFrame("Two");
    a.setSize(300, 200);
    b.setSize(300, 200);
    a.setVisible(true);
frage: What do you see?
- [x] one window with the title "One"
- two windows
- one window with the title "Two"
> Two windows from the same blueprint, but only `a` is made visible.
:::

## Task: your own window

Change the program so that

- the title says “Hello” and your name,
- the window is 400 pixels wide and 300 pixels high,
- the program ends when you close the window.

Run it and check all three points.

::: ludwig
Don't feel like typing so much? With “Real Java” you may type just the four lines from `main` into the Programming area. VisuStruct then wraps them in a class itself and adds the `import` lines. In a real Java development environment, though, you need the whole program.
:::

## Checklist

::: checkliste
- I can switch on “Real Java” in the Programming area. → Programs with windows
- I can open a window with a title and a size. → The whole program
- I know what each line of the window program does. → Line by line
- I know why setVisible(true) comes last. → Why setVisible comes last
:::

## Quiz

::: quiz
? Which line makes the window visible?
- [ ] window.setSize(300, 200);
- [x] window.setVisible(true);
- [ ] new JFrame("Hello");
> Without setVisible(true) the window stays invisible.

? Where is the best place for window.setVisible(true)?
- [ ] At the very start of main
- [x] At the end, once the window is set up
- [ ] It does not matter.
> Things added after setVisible(true) often do not appear.

? What does setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE) do?
- [ ] The window closes immediately.
- [x] When you close the window, the program ends.
- [ ] The window can no longer be closed.

? How do you recognise building blocks from Swing?
- [x] Their name starts with J, e.g. JFrame.
- [ ] They are in curly brackets.
- [ ] They end in Window.
:::
