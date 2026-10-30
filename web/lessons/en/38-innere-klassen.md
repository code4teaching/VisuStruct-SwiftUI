---
titel: Inner classes
bereich: Windows with Swing
kurz: Write a listener as a named inner class, as an anonymous class and as a lambda, and know who can see what.
---

## Skills I will gain now

::: kompetenzen
- write a listener as a named inner class
- write a listener as an anonymous class
- explain what is left out in a lambda
- explain which way of writing sees which variables
- build a counter with three buttons written in three ways
:::

## The goal

You already know the click counter from lesson 32. Today you write its listener in **three ways**, all of which do exactly the same:

1. as a **named inner class**, the way it was mostly done before Java 8,
2. as an **anonymous class**, which you know from the expert knowledge in lesson 30,
3. as a **lambda** with the arrow, as before.

In other people's code, in books and on the internet you will meet all three. After this lesson you will recognise them.

Tick **Real Java (with Swing)** in the [gear](#zeige-einstellungen).

## Reminder: the contract

A listener is anything that fulfils the contract `ActionListener`. It contains exactly one method:

```
public void actionPerformed(ActionEvent e)
```

The button calls it with every click. The three ways of writing are three ways of providing this one method.

## 1. The named inner class

An **inner class** is a class inside another class. It has a name, here `Plus`, and fulfils the contract with `implements ActionListener`:

```java
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class Counter {
    static int count = 0;
    static JLabel number = new JLabel("0", SwingConstants.CENTER);

    static class Plus implements ActionListener {
        public void actionPerformed(ActionEvent e) {
            count++;
            number.setText("" + count);
        }
    }

    public static void main(String[] args) {
        JFrame window = new JFrame("Click counter");
        window.setSize(250, 200);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setLayout(new GridLayout(0, 1));

        JButton plus = new JButton("+1");
        JButton again = new JButton("Also +1");
        plus.addActionListener(new Plus());
        again.addActionListener(new Plus());

        window.add(number);
        window.add(plus);
        window.add(again);
        window.setVisible(true);
    }
}
```

- `new Plus()` creates an object of the class `Plus`. That is the listener the button gets.
- Because the class has a name, you can use it for several buttons, here for `plus` and `again`.
- The class is **outside** `main`. So it only sees what is in the class `Counter`: `count` and `number`. That's why `number` is a variable of the class this time and not of `main`.
- You need `static class` because `main` is static. Without `static`, javac reports "non-static variable this cannot be referenced from a static context".

## 2. The anonymous class

If you only need the listener in one place, you can write the class right where the object is needed. Then it gets no name:

```java
plus.addActionListener(new ActionListener() {
    public void actionPerformed(ActionEvent e) {
        count++;
        number.setText("" + count);
    }
});
```

- `new ActionListener() { … }` means: "a new object that fulfils the contract ActionListener, like this: …".
- At the end there is `});`: the curly bracket closes the class, the round one closes the call to `addActionListener`.
- The anonymous class is **inside** `main`. So it also sees the variables of `main`, as long as they don't change any more.

## 3. The lambda

The lambda is the short form of the anonymous class, since Java 8:

```java
plus.addActionListener(e -> {
    count++;
    number.setText("" + count);
});
```

Everything Java knows anyway is left out: `new ActionListener()`, the name `actionPerformed`, `public void` and the type `ActionEvent`. What remains is the parameter `e`, the arrow and the body. This only works because the contract has exactly **one** method.

## The three compared

| | named inner class | anonymous class | lambda |
|---|---|---|---|
| has a name | yes, e.g. `Plus` | no | no |
| stands | in the class, outside `main` | right at the button | right at the button |
| for several buttons | yes, `new Plus()` | no | yes, in a variable (lesson 37) |
| sees variables of `main` | no | yes, if they don't change | yes, if they don't change |
| length | longest | medium | shortest |

::: ludwig
If a variable of `main` should change in the listener, like `count++`, it has to go into the class, whichever way you write the listener. That was the problem from lesson 32.
:::

::: angeberwissen
After compiling, look into the folder with the `.class` files. javac creates one file for every class: `Counter.class`, `Counter$Plus.class` for the inner class and `Counter$1.class` for the anonymous class. As it has no name, it gets a number. A lambda gets no file of its own, Java only builds it when the program starts.
:::

## Game: Which way of writing?

::: spiel frage
titel: Game: Which way of writing?
intro: Ludwig shows you listeners from other people's programs. Which way of writing is it? Six rounds.
frage: Which way of writing is this?
antworten: named inner class | anonymous class | lambda

runde:
    button.addActionListener(e -> text.setText("Hello"));
richtig: lambda
> The arrow `->` gives the lambda away.

runde:
    button.addActionListener(new ActionListener() {
        public void actionPerformed(ActionEvent e) {
            text.setText("Hello");
        }
    });
richtig: anonymous class
> `new ActionListener() {` followed by a whole method: a class without a name is being written here.

runde:
    static class Greeting implements ActionListener {
        public void actionPerformed(ActionEvent e) {
            text.setText("Hello");
        }
    }
richtig: named inner class
> The class is called `Greeting` and fulfils the contract with `implements ActionListener`.

runde:
    button.addActionListener(new Greeting());
richtig: named inner class
> `new Greeting()` creates an object of the class `Greeting`. The class itself is somewhere else and has a name.

runde:
    ActionListener key = e -> {
        display.setText(display.getText() + e.getActionCommand());
    };
richtig: lambda
> A lambda in a variable, as with the code lock in lesson 37. The arrow gives it away.

runde:
    ActionListener key = new ActionListener() {
        public void actionPerformed(ActionEvent e) {
            display.setText(display.getText() + e.getActionCommand());
        }
    };
richtig: anonymous class
> An anonymous class can be stored in a variable too. Then it can be signed up at several buttons, just like the lambda.
:::

## Task: One counter, three ways

Build the click counter with three buttons:

- **+1** gets the named inner class `Plus`.
- **-1** gets an anonymous class.
- **Reset** gets a lambda.

Check that all three buttons count as expected. Then remove the `static` from the class `Plus` and read javac's error message.

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can write a listener as a named inner class. → 1. The named inner class
- I can write a listener as an anonymous class. → 2. The anonymous class
- I can explain what is left out in a lambda. → 3. The lambda
- I can explain which way of writing sees which variables. → The three compared
- I can build a counter with three buttons written in three ways. → Task: One counter, three ways
:::

## Quiz

::: quiz
? Why does the short form with the arrow work for ActionListener?
→ 3. The lambda
- [ ] Because ActionListener is a class.
- [x] Because the contract has exactly one method.
- [ ] Because the button demands it.

? Which way of writing can you use with new Plus() for several buttons without storing it in a variable?
→ 1. The named inner class
- [x] the named inner class
- [ ] the anonymous class
- [ ] the lambda

? Why is there static in front of class Plus?
→ 1. The named inner class
- [ ] So that the class is faster.
- [x] Because main is static and couldn't create an object of Plus otherwise.
- [ ] Because every class has to be static.

? Match.
→ The three compared
= class Plus implements ActionListener -> named inner class
= new ActionListener() { … } -> anonymous class
= the arrow after e -> lambda
:::
