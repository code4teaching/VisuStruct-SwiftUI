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

```
button.addActionListener(e -> button.setText("I was clicked"));
```

Read from the outside in:

- `button.addActionListener( … )` registers a listener with the button.
- `e` is the event. It contains, for example, when the click happened. You do not need it here, but the name has to be there.
- Read `->` as “then do”.
- `button.setText("I was clicked")` is what happens on a click: the button gets a new label.

The line comes after `new JButton(…)`, because the button has to exist already. And like everything else it comes before `setVisible(true)`.

## The whole program

```
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

```
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

## Expert knowledge: ActionListener is an interface

This is not in the curriculum. If you want to know what is behind the arrow, read on.

::: angeberwissen
`ActionListener` is an **interface**, a kind of contract. It says: whoever wants to be an ActionListener must have a method `actionPerformed(ActionEvent e)`. On every click the button calls exactly this method.

The arrow `e -> …` is a short form (a lambda expression, since Java 8). It works because the interface has only one method. So Java knows which method is meant.
:::

Without the arrow you write the listener as a class without a name that fulfils the contract (an anonymous class):

```
button.addActionListener(new ActionListener() {
    public void actionPerformed(ActionEvent e) {
        button.setText("I was clicked");
    }
});
```

For this you also need `import java.awt.event.*;` at the top. Both ways do exactly the same, the one with the arrow is just shorter.

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
