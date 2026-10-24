---
titel: Model View Controller
bereich: Windows with Swing
kurz: Split the click counter into model, view and controller and understand who talks to whom.
---

## The goal

Big programs with windows almost always share the same structure. It is called **Model View Controller**, **MVC** for short:

- The **model** holds the data and knows its rules.
- The **view** only shows the data.
- The **controller** reacts to clicks and passes the word on.

You learn MVC with the click counter from lesson 32. It is split into three parts, step by step. In the end it shows the same count twice: as a number and as a bar.

Tick **Real Java (with Swing)** in the [gear](#zeige-einstellungen).

## Everything in one class

This is what the click counter looked like so far, everything sits in `main` and in one variable of the class:

```java
static int count = 0;

public static void main(String[] args) {
    // ... build the window ...
    JLabel number = new JLabel("0", SwingConstants.CENTER);
    JButton plus = new JButton("+1");
    plus.addActionListener(e -> {
        count++;
        number.setText("" + count);
    });
}
```

That works. But imagine the count should also show up as a bar, later in a second window and in a file as well. Then every listener has to think of every display. Counting and showing are tied up in a knot, and with every display the knot gets bigger.

MVC unties the knot: every job gets its own class.

## The model

The model is the counter itself, without any Swing:

```java
class Counter {
    int value = 0;

    void increase() {
        value++;
    }

    int getValue() {
        return value;
    }
}
```

- This time there is no `static` in front of `value` and the methods. That makes them belong to an **object**: `new Counter()` builds a counter with its own `value`, just as `new JButton("+1")` builds a button with its own caption.
- `model.increase()` calls the method of this one counter, just like `button.setText(…)`.
- Whoever wants to know the value asks with `getValue()`. It can only be changed through `increase()`.

As the model needs no window, you can try it out without a window at all:

```java
public class CounterTest {
    public static void main(String[] args) {
        Counter model = new Counter();
        model.increase();
        model.increase();
        System.out.println(model.getValue());
    }
}

class Counter {
    int value = 0;

    void increase() {
        value++;
    }

    int getValue() {
        return value;
    }
}
```

The output is 2. Several classes may stand in one file. Only one of them is `public`, and that one contains `main`.

## The view

The view shows the value and does nothing else. It doesn't calculate, and it doesn't know where the number comes from:

```java
class NumberView {
    JLabel number = new JLabel("0", SwingConstants.CENTER);

    void update(int value) {
        number.setText("" + value);
    }
}
```

- The view is handed the value with `update(int value)` and writes it into its JLabel.
- You build the window and the button in `main`, as always. `window.add(view.number)` puts the view's JLabel into the window.

## The controller

The controller is the listener at the button. It connects model and view:

```java
Counter model = new Counter();
NumberView view = new NumberView();

plus.addActionListener(e -> {
    model.increase();
    view.update(model.getValue());
});
```

- First it changes the model, then it fetches the new value and hands it to the view.
- The problem from lesson 32 is gone: the variable `model` never changes, it always points to the same counter. Only the `value` inside it changes. That's why the lambda may use `model`, without any `static`.

## Who talks to whom?

With every click four messages run, always in the same order:

::: grafik mvc-klick.svg
The arrows light up one after the other. The model counts up at the second arrow, the display only at the fourth.
:::

1. The button reports the click to the controller (`actionPerformed`).
2. The controller tells the model: `increase()`.
3. The controller asks the model for the new value: `getValue()`.
4. The controller hands the value to the view: `update(value)`.

The model talks to nobody. It waits until it is asked.

::: ludwig
Remember: the model knows nothing about windows. In `Counter` there isn't a single `JLabel` and no `import javax.swing`. If you need Swing there, the code belongs in the view.
:::

## The pay-off: a second view

Now the count should also show up as a bar. For that a second view joins in. A `JProgressBar` is a bar that fills up, here from 0 to 10:

```java
class BarView {
    JProgressBar bar = new JProgressBar(0, 10);

    void update(int value) {
        bar.setValue(value);
    }
}
```

The controller gets one more line. The model stays exactly as it was:

```java
plus.addActionListener(e -> {
    model.increase();
    view.update(model.getValue());
    bar.update(model.getValue());
});
```

That is exactly the pay-off of MVC: you can add or swap displays without touching the model.

## The whole program

```java
import javax.swing.*;
import java.awt.*;

class Counter {
    int value = 0;

    void increase() {
        value++;
    }

    int getValue() {
        return value;
    }
}

class NumberView {
    JLabel number = new JLabel("0", SwingConstants.CENTER);

    void update(int value) {
        number.setText("" + value);
    }
}

class BarView {
    JProgressBar bar = new JProgressBar(0, 10);

    void update(int value) {
        bar.setValue(value);
    }
}

public class ClickCounter {
    public static void main(String[] args) {
        Counter model = new Counter();
        NumberView view = new NumberView();
        BarView bar = new BarView();

        JFrame window = new JFrame("Click counter");
        window.setSize(250, 200);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setLayout(new GridLayout(0, 1));

        JButton plus = new JButton("+1");
        plus.addActionListener(e -> {
            model.increase();
            view.update(model.getValue());
            bar.update(model.getValue());
        });

        window.add(view.number);
        window.add(bar.bar);
        window.add(plus);
        window.setVisible(true);
    }
}
```

Click +1 a few times and watch the number and the bar grow together.

::: angeberwissen
MVC was invented in 1979 by the Norwegian Trygve Reenskaug, at the research centre Xerox PARC in California. Back then there were already computers with windows and a mouse there. In the same year Steve Jobs visited the lab and was so excited that Apple went on to build computers with windows and a mouse.
:::

## Game: Where does the code belong?

::: spiel frage
titel: Game: Where does the code belong?
intro: Ludwig has thrown code from an MVC program onto a pile. Sort every piece. Eight rounds.
frage: Where does this code belong?
antworten: Model | View | Controller

runde:
    int value = 0;
richtig: Model
> The count is the data. Data lives in the model.

runde:
    number.setText("" + value);
richtig: View
> Showing something on the screen is the view's job.

runde:
    plus.addActionListener(e -> model.increase());
richtig: Controller
> Reacting to a click and telling the model: that's what the controller does.

runde:
    void increase() {
        value++;
    }
richtig: Model
> The model itself knows how to change its data.

runde:
    bar.setValue(value);
richtig: View
> A bar that fills up only shows something. So: view.

runde:
    void increase() {
        if (value < 10) {
            value++;
        }
    }
richtig: Model
> "At most 10" is a rule for the data. Rules belong in the model, then they hold for every button and every view.

runde:
    view.update(model.getValue());
richtig: Controller
> Fetching the value from the model and handing it to the view: that's the controller in the middle.

runde:
    JLabel number = new JLabel("0", SwingConstants.CENTER);
richtig: View
> A JLabel is a building block of the screen. There is no Swing in the model.
:::

## Game: Whose turn is it?

::: spiel reihenfolge
titel: Game: Whose turn is it?
intro: After a click, model, view and controller talk to each other, but it only works in one order. Put the steps in the right order. Five rounds.

runde:
frage: You click +1 in the click counter. What happens, one after the other?
- You click +1.
- The controller gets `actionPerformed`.
- The controller calls `model.increase()`.
- The model counts `value` up.
- The controller fetches `model.getValue()`.
- The view shows the new number.
> Click, controller, change the model, fetch the value, show it. Those are the four arrows from the picture, with counting up in the middle.

runde:
    plus.addActionListener(e -> {
        model.increase();
        view.update(model.getValue());
        bar.update(model.getValue());
    });
frage: What happens after a click on +1, one after the other?
- The click on +1
- `model.increase()`
- The number shows the new value.
- The bar grows.
> The listener works through its lines from top to bottom: first the model, then the number, then the bar.

runde:
frage: Put the controller in the right order so that the view shows the new number.
- `plus.addActionListener(e -> {`
- `model.increase();`
- `view.update(model.getValue());`
- `});`
> First change, then show. The other way round, the view still shows the old value.

runde:
    reset.addActionListener(e -> {
        model.reset();
        view.update(model.getValue());
    });
frage: The counter is at 5. You click Reset. What happens, one after the other?
- You click Reset.
- The model sets `value` to 0.
- `model.getValue()` returns 0.
- The view shows 0.
> Reset also runs through the controller into the model. The view only learns about the new value at the very end.

runde:
frage: A test without a window should print 1. In which order do the lines stand in main?
- `Counter model = new Counter();`
- `model.increase();`
- `System.out.println(model.getValue());`
> First build the object, then work with it, and look at the result last. The model can be tested without any window.
:::

## Task: A counter with limits

Build the whole program and try it out.

Then make it better:

- A button **−1** counts down. The model gets a method `decrease()` for it, the controller a second listener.
- A button **Reset** sets the counter back to 0 with `reset()`.
- The model itself takes care of the limits: never below 0 and never above 10, because then the bar is full.
- Extra: a third view `ConsoleView` whose `update` prints "New value: 3" with `System.out.println`. A view doesn't have to be a window.

## Checklist

::: checkliste
- I can say what model, view and controller each do. → The goal
- I can write a model without Swing and test it without a window. → The model
- I know what new Counter() builds and why there is no static. → The model
- I know the four messages after a click. → Who talks to whom?
- I can add a second view without changing the model. → The pay-off: a second view
- My counter has −1, Reset and limits in the model. → Task: A counter with limits
:::

## Quiz

::: quiz
? Where does the rule "The counter never goes above 10" belong?
- [x] in the model
- [ ] in the view
- [ ] in the controller
> Rules about the data belong in the model. Then they hold no matter which button is pressed.

? What does the view do?
- [ ] It calculates the new value.
- [x] It shows the value it is given.
- [ ] It listens for clicks.

? Why may the lambda use model, even though model is a variable of main?
- [ ] Because Counter is public.
- [x] Because model always points to the same counter; only the value inside it changes.
- [ ] Because lambdas may change any variable.

? What do you have to change in the model when a second view joins in?
- [x] nothing
- [ ] a second method increase
- [ ] a second JLabel

? Match.
= Counter with value and increase() -> model
= NumberView with update(int value) -> view
= the listener at the button -> controller
:::
