---
titel: The button reacts
bereich: Windows with Swing
kurz: Use an ActionListener to decide what happens on a click.
---

## A click is an event

In the last lesson you could press the button, but nothing happened. In a window program it is the person who decides when something happens: they click, type or close a window. Each such action is called an **event**.

So your program has to wait for the click and notice it. For this you register a listener with the button, an **ActionListener**. On every click the button calls its listener, and the listener runs your code.

::: ludwig
Until now your program ran from top to bottom, just like the structure chart. The code in the listener only runs later, whenever someone clicks. Nobody knows in advance how often that will be.
:::

## The line with the arrow

This is how you register the listener:

```java
button.addActionListener(e -> button.setText("I was clicked"));
```

Read from the outside in:

- `button.addActionListener( … )` registers a listener with the button.
- `e` is the event. It contains, for example, when the click happened. You do not need it here, but the name has to be there.
- Read `->` as “then do”.
- `button.setText("I was clicked")` is what happens on a click: the button gets a new label.

The line comes after `new JButton(…)`, because the button has to exist already. And like everything else it comes before `setVisible(true)`.

## The whole program

```java
import javax.swing.*;
import java.awt.*;

public class ClickMe {
    public static void main(String[] args) {
        JFrame window = new JFrame("Click me");
        window.setSize(300, 200);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setLayout(new FlowLayout());

        JButton button = new JButton("Click me");
        button.addActionListener(e -> button.setText("I was clicked"));
        window.add(button);

        window.setVisible(true);
    }
}
```

Run it and click the button. Now it says “I was clicked”.

> If the new text is longer than the old one, FlowLayout makes the button wider on its own.

## Several statements on a click

If more than one thing should happen on a click, put curly brackets after the arrow. Inside, every statement has its semicolon, just like in a loop body:

```java
button.addActionListener(e -> {
    button.setText("I was clicked");
    window.setTitle("Thank you!");
    System.out.println("Click!");
});
```

`System.out.println` writes to the [console](#zeige-konsole) as usual. Click several times: every click adds a new line “Click!”. That shows you that the code in the listener really runs on every click.

::: ludwig
Watch the ending: first `}` closes the block, then `)` closes the bracket of `addActionListener`, then comes the semicolon. So `});`. If any of it is missing, a hint appears below the code.
:::

## Game: Who is listening?

::: spiel zuhoerer
titel: Game: Who is listening?
intro: Ludwig shows you code and the window that goes with it. Below it you see which buttons are clicked, one after the other. What happens? After your answer Ludwig plays the clicks: you see which listener hears the event and which lines then run.
frage: What does the label say after the clicks?

runde:
    JFrame window = new JFrame("Greeting");
    JLabel text = new JLabel("Start");
    JButton button = new JButton("Hello");
    button.addActionListener(e -> text.setText("Hello world"));
klicks: Hello
- Start
- [x] Hello world
- Hello
> The button has a listener. On a click it runs `text.setText("Hello world")`, and the label shows “Hello world”.

runde:
    JFrame window = new JFrame("Fruit");
    JLabel text = new JLabel("?");
    JButton a = new JButton("A");
    JButton b = new JButton("B");
    a.addActionListener(e -> text.setText("Apple"));
    b.addActionListener(e -> text.setText("Pear"));
klicks: A, B
- Apple
- [x] Pear
- Apple Pear
> Each button has its own listener. First A writes “Apple”, then B overwrites it with “Pear”. `setText` replaces the old text, it doesn't add anything.

runde:
    JFrame window = new JFrame("Fruit");
    JLabel text = new JLabel("?");
    JButton a = new JButton("A");
    JButton b = new JButton("B");
    a.addActionListener(e -> text.setText("Apple"));
klicks: B
- Apple
- Pear
- [x] ?
> Nobody signed up at button B: there is no `b.addActionListener`. The click is an event, but nobody is listening. So the question mark stays.

runde:
    JFrame window = new JFrame("Colours");
    JLabel text = new JLabel("none");
    JButton red = new JButton("Red");
    JButton blue = new JButton("Blue");
    red.addActionListener(e -> text.setText("Blue"));
    blue.addActionListener(e -> text.setText("Red"));
klicks: Red
- Red
- [x] Blue
- none
> Careful: what happens is decided by the code in the listener, not by the caption of the button. The listener on the button “Red” writes “Blue”.

runde:
    JFrame window = new JFrame("Button");
    JLabel text = new JLabel("Please click");
    JButton button = new JButton("Click me");
    button.addActionListener(e -> {
        button.setText("Thanks!");
        text.setText("Clicked");
    });
klicks: Click me
frage: What does the button say after the click?
- Click me
- [x] Thanks!
- Clicked
> The block after the arrow has two statements. Both run on the click, one after the other: the button gets “Thanks!”, the label “Clicked”.

runde:
    JFrame window = new JFrame("Console");
    JButton button = new JButton("Go");
    button.addActionListener(e -> System.out.println("Click!"));
klicks: Go, Go, Go
frage: How many lines “Click!” are in the console afterwards?
- 1
- [x] 3
- 0
> The listener runs on **every** click, not only on the first one. Three clicks, three lines.
:::

## Expert knowledge: ActionListener is an interface

This is not in the curriculum. If you want to know what is behind the arrow, read on.

::: angeberwissen
`ActionListener` is an **interface**, a kind of contract. It says: whoever wants to be an ActionListener must have a method `actionPerformed(ActionEvent e)`. On every click the button calls exactly this method.
:::

You already know the line with the arrow from step 2:

```java
button.addActionListener(e -> button.setText("I was clicked"));
```

Without the arrow you write the listener as a class without a name that fulfils the contract (an anonymous class):

```java
button.addActionListener(new ActionListener() {
    public void actionPerformed(ActionEvent e) {
        button.setText("I was clicked");
    }
});
```

For this you also need `import java.awt.event.*;` at the top. Both ways do exactly the same. The arrow `e -> …` is the short form (a lambda expression, since Java 8): `e` is the parameter of `actionPerformed`, and after the arrow comes its body. The short form works because the interface has only one method. So Java knows which method is meant.

## Game: Contract fulfilled?

::: spiel vertrag
titel: Game: Contract fulfilled?
intro: The contract `ActionListener` asks for exactly one method: `public void actionPerformed(ActionEvent e)`. Ludwig shows you code. Does it fulfil the contract, so that you can sign it up at a button? Ludwig checked every answer with the real Java compiler.
frage: Does this fulfil the contract ActionListener?
antworten: fulfilled | not fulfilled

runde:
    class Greeting implements ActionListener {
        public void actionPerformed(ActionEvent e) {
            System.out.println("Hello");
        }
    }
richtig: fulfilled
> Everything is there: `implements ActionListener` signs the contract, and the method is called exactly `actionPerformed`, is `public`, returns nothing (`void`) and gets an `ActionEvent`.

runde:
    class Greeting implements ActionListener {
        public void actionPerfomed(ActionEvent e) {
            System.out.println("Hello");
        }
    }
richtig: not fulfilled
> Look closely: `actionPerfomed` instead of `actionPerformed`, an r is missing. For Java that is a completely different method. The compiler reports that `actionPerformed` is missing.

runde:
    class Greeting implements ActionListener {
        public void actionPerformed() {
            System.out.println("Hello");
        }
    }
richtig: not fulfilled
> The parameter is missing. The contract asks for `actionPerformed(ActionEvent e)`, because on a click the button hands over the event.

runde:
    class Greeting implements ActionListener {
        public void actionPerformed(ActionEvent event) {
            System.out.println("Hello");
        }
    }
richtig: fulfilled
> You can choose the name of the parameter freely. Only the type `ActionEvent` matters. So instead of `e` it may also be called `event`.

runde:
    class Greeting implements ActionListener {
        void actionPerformed(ActionEvent e) {
            System.out.println("Hello");
        }
    }
richtig: not fulfilled
> The `public` is missing. All methods of an interface are public, because the button has to be able to call them from outside. Without `public` the compiler reports an error.

runde:
    class Greeting implements ActionListener {
        public int actionPerformed(ActionEvent e) {
            return 0;
        }
    }
richtig: not fulfilled
> The contract says `void`: the method returns nothing. With `int` as the return type it no longer fits.

runde:
    class Greeting implements ActionListener {
        public void actionPerformed(ActionEvent e) {
            sayHello();
        }
        void sayHello() {
            System.out.println("Hello");
        }
    }
richtig: fulfilled
> Extra methods are allowed. The contract only asks that `actionPerformed` is there, not that nothing else is there.

runde:
    class Greeting {
        public void actionPerformed(ActionEvent e) {
            System.out.println("Hello");
        }
    }
    button.addActionListener(new Greeting());
richtig: not fulfilled
> The method is right, but the contract isn't signed: `implements ActionListener` is missing. At a button Java only accepts objects that officially fulfil the contract.

runde:
    button.addActionListener(e -> System.out.println("Hello"));
richtig: fulfilled
> The arrow is the short form. Because the contract has only one method, Java knows: `e` is the parameter of `actionPerformed`, and after the arrow comes its body.

runde:
    button.addActionListener((a, b) -> System.out.println("Hello"));
richtig: not fulfilled
> Here the arrow has two parameters. But `actionPerformed` gets exactly one, the event. So this short form doesn't fit the contract.
:::

## Task: I was clicked

Now you finish the task: build a window with a button “Click me” in normal size. After the click the button says “I was clicked”.

Extra: build two buttons “Red” and “Blue”. Clicking a button writes its name into the window title, for example “You chose Red”.

::: ludwig
Every button gets its own listener with its own `addActionListener`. You change the title with `window.setTitle(…)`.
:::

## Checklist

::: checkliste
- I know what an event is. → A click is an event
- I can use addActionListener to decide what happens on a click. → The line with the arrow
- I can run several statements on a click. → Several statements on a click
- After the click my button says “I was clicked”. → Task: I was clicked
:::

## Quiz

::: quiz
? What is an ActionListener?
- [ ] A button with text
- [x] A listener that runs your code on every click
- [ ] A layout for windows
> You register it with the button using addActionListener.

? When does button.setText("I was clicked") in the listener run?
- [ ] Right when the program starts
- [x] Every time someone clicks the button
- [ ] Only on the first click
> The code in the listener only runs when the event happens.

? How does a listener with curly brackets end?
- [ ] };)
- [x] });
- [ ] );}
> First the block closes, then the bracket of addActionListener, then the semicolon.

? Match each part to its job.
= JButton -> a button
= addActionListener -> register a listener
= setText -> change the label
= setVisible(true) -> show the window
:::
