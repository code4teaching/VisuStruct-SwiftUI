---
titel: Many buttons, one listener
bereich: Windows with Swing
kurz: One listener for many buttons, and finding out with getActionCommand and getSource which button was clicked.
---

## Skills I will gain now

::: kompetenzen
- store a listener in a variable of type ActionListener and sign it up at several buttons
- explain what getActionCommand and getSource return
- put buttons onto a JPanel in a loop
- build a code lock that only opens with the right code
:::

## The goal

Since the business with the cake, Ludwig wants to lock his stable. He builds a **code lock**: nine digit keys, a zero, **C** to clear and **OK** to check. Only someone who types 1234 gets "Gate open!".

That's twelve buttons. Until now every button had its own listener, as with the calculator in lesson 35. Today you learn how **one** listener is enough for all buttons.

Tick **Real Java (with Swing)** in the [gear](#zeige-einstellungen).

## Nine almost identical listeners

With one listener per key it would look like this:

```java
one.addActionListener(e -> display.setText(display.getText() + "1"));
two.addActionListener(e -> display.setText(display.getText() + "2"));
three.addActionListener(e -> display.setText(display.getText() + "3"));
// ... and so on up to 9
```

The lines only differ in the digit. If you want to change a small detail, you have to do it nine times and are bound to forget one line.

## A listener as a variable

A listener can also be stored in a **variable**. Its data type is `ActionListener`, the contract from lesson 30. Then you sign up the same listener at several buttons:

```java
ActionListener digit = e -> display.setText(display.getText() + e.getActionCommand());

one.addActionListener(digit);
two.addActionListener(digit);
three.addActionListener(digit);
```

`ActionListener` is in the package `java.awt.event`. So you need `import java.awt.event.*;` at the top.

Now the code exists only once. But how does the listener know which digit to add?

## Who clicked?

The `e` before the arrow is the **event**, an object of type `ActionEvent`. The button passes it along with every click, and it contains what happened:

| Call | Returns | Example |
|---|---|---|
| `e.getActionCommand()` | the caption of the clicked button, as text | `"7"` |
| `e.getSource()` | the clicked button itself | the button `ok` |

- `getActionCommand()` is handy when the caption already says what to do, as with the digits.
- You compare `getSource()` with a button using `==`: `if (e.getSource() == ok)`. Here `==` is right, because it is about exactly this one object, not about a text.

::: ludwig
You compare texts with `equals` and buttons with `==`. If you want to decide by the caption, you write `e.getActionCommand().equals("OK")`. That works too, but breaks as soon as someone changes the caption to "Open". `e.getSource() == ok` stays correct.
:::

## Buttons in a loop

With a shared listener you can even build the digit keys in a loop. So that they line up neatly in a grid, they go onto a **JPanel**. A JPanel is an area in the window with its own layout:

```java
JPanel keys = new JPanel(new GridLayout(0, 3));
for (int i = 1; i <= 9; i++) {
    JButton digit = new JButton("" + i);
    digit.addActionListener(key);
    keys.add(digit);
}
```

- `"" + i` turns the number `i` into the text for the caption.
- Each pass creates a new button. All of them get the same listener `key`.
- `window.add(keys, BorderLayout.CENTER)` puts the whole area with all the keys into the window.

## The whole program

```java
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class CodeLock {
    public static void main(String[] args) {
        JFrame window = new JFrame("Code lock");
        window.setSize(240, 300);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setLayout(new BorderLayout());

        JLabel display = new JLabel("", SwingConstants.CENTER);
        JPanel keys = new JPanel(new GridLayout(0, 3));
        JButton clear = new JButton("C");
        JButton ok = new JButton("OK");

        ActionListener key = e -> {
            if (e.getSource() == clear) {
                display.setText("");
            } else if (e.getSource() == ok) {
                if (display.getText().equals("1234")) {
                    display.setText("Gate open!");
                } else {
                    display.setText("Wrong");
                }
            } else {
                display.setText(display.getText() + e.getActionCommand());
            }
        };

        for (int i = 1; i <= 9; i++) {
            JButton digit = new JButton("" + i);
            digit.addActionListener(key);
            keys.add(digit);
        }
        JButton zeroKey = new JButton("0");
        zeroKey.addActionListener(key);
        clear.addActionListener(key);
        ok.addActionListener(key);
        keys.add(clear);
        keys.add(zeroKey);
        keys.add(ok);

        window.add(display, BorderLayout.NORTH);
        window.add(keys, BorderLayout.CENTER);
        window.setVisible(true);
    }
}
```

- `clear` and `ok` are created **before** the listener, because the listener compares with them.
- The listener first checks the two special buttons. All the others are digits and add their caption.

::: angeberwissen
The keypad on a phone has the 1 at the top left, the one on a calculator and a computer keyboard has the 7 at the top left. Why? When push-button phones came along, there were tests with people who had to dial with them. With the 1 at the top they were faster, and calculating machines had their layout long before that. Ludwig's lock does it like the phone.
:::

## Game: Who clicked?

::: spiel zuhoerer
titel: Game: Who clicked?
intro: In every round **one** listener listens at several buttons. Ludwig shows you code, the window and the clicks. What does the display say at the end? Afterwards Ludwig plays the clicks.
frage: What does the display say after the clicks?

runde:
    JFrame window = new JFrame("Letters");
    JLabel display = new JLabel("");
    JButton a = new JButton("A");
    JButton b = new JButton("B");
    ActionListener z = e -> display.setText(display.getText() + e.getActionCommand());
    a.addActionListener(z);
    b.addActionListener(z);
klicks: A, B, A
- A
- AB
- [x] ABA
> One listener, two buttons. Each time, `e.getActionCommand()` returns the caption of the clicked button, and it is added at the end.

runde:
    JFrame window = new JFrame("Counter");
    static int number = 0;
    JLabel display = new JLabel("0");
    JButton plus = new JButton("+");
    JButton minus = new JButton("-");
    ActionListener z = e -> {
        if (e.getSource() == plus) {
            number++;
        } else {
            number--;
        }
        display.setText("" + number);
    };
    plus.addActionListener(z);
    minus.addActionListener(z);
klicks: +, +, -
- 3
- [x] 1
- -1
> `e.getSource()` tells you which button it was. Plus twice, minus once: 0 + 1 + 1 - 1 = 1.

runde:
    JFrame window = new JFrame("Letters");
    JLabel display = new JLabel("");
    JButton a = new JButton("A");
    JButton b = new JButton("B");
    JButton c = new JButton("C");
    ActionListener z = e -> display.setText(display.getText() + e.getActionCommand());
    a.addActionListener(z);
    b.addActionListener(z);
klicks: A, C, B
- ACB
- [x] AB
- A
> The listener is only signed up at A and B. Nobody is listening when C is clicked.

runde:
    JFrame window = new JFrame("Keys");
    JLabel display = new JLabel("");
    JButton one = new JButton("1");
    JButton two = new JButton("2");
    JButton del = new JButton("C");
    ActionListener z = e -> {
        if (e.getActionCommand().equals("C")) {
            display.setText("");
        } else {
            display.setText(display.getText() + e.getActionCommand());
        }
    };
    one.addActionListener(z);
    two.addActionListener(z);
    del.addActionListener(z);
klicks: 1, 2, C, 1
- 121
- 12
- [x] 1
> After 1 and 2 the display says "12". C clears everything, and the last 1 stands alone.

runde:
    JFrame window = new JFrame("Lock");
    JLabel display = new JLabel("");
    JButton four = new JButton("4");
    JButton two = new JButton("2");
    JButton ok = new JButton("OK");
    ActionListener z = e -> {
        if (e.getSource() == ok) {
            if (display.getText().equals("42")) {
                display.setText("Gate open!");
            } else {
                display.setText("Wrong");
            }
        } else {
            display.setText(display.getText() + e.getActionCommand());
        }
    };
    four.addActionListener(z);
    two.addActionListener(z);
    ok.addActionListener(z);
klicks: 2, 4, OK
- Gate open!
- [x] Wrong
- 24OK
> "24" was typed, but the secret is "42". The order of the clicks matters.
:::

## Task: Code lock

Build the code lock and try it out.

Then make it better:

- After three wrong attempts, **OK** switches itself off, like the button in Guess the number in lesson 36. Count the attempts in a `static int` variable in the class.
- Extra: the display shows `*` instead of the digits. Remember the real input in a `static String input = "";` and only add a star to the display.

::: ludwig
For the calculator from lesson 35, one listener is enough for +, -, \* and / too. Check inside it with `e.getActionCommand().equals("+")` which operator was clicked.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can store a listener in a variable of type ActionListener and sign it up at several buttons. → A listener as a variable
- I can explain what getActionCommand and getSource return. → Who clicked?
- I can put buttons onto a JPanel in a loop. → Buttons in a loop
- I can build a code lock that only opens with the right code. → Task: Code lock
:::

## Quiz

::: quiz
? What does e.getActionCommand() return for a click on the button new JButton("7")?
→ Who clicked?
- [ ] the number 7
- [x] the text "7"
- [ ] the button itself

? How do you check whether the button ok was clicked?
→ Who clicked?
- [x] e.getSource() == ok
- [ ] e.getSource().equals("ok")
- [ ] ok.getActionCommand()
> getSource returns the button itself, and you compare it with ==.

? Why is a listener stored in a variable?
→ A listener as a variable
- [ ] So that it runs faster.
- [x] So that you can sign it up at several buttons and write the code only once.
- [ ] Because lambdas aren't allowed otherwise.

? Match.
→ Who clicked?
= ActionListener -> data type of a listener
= ActionEvent -> the event e with the information about the click
= JPanel -> an area with its own layout
:::
