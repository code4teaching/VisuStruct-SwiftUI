---
titel: A calculator
bereich: Windows with Swing
kurz: Two columns with GridLayout, four arithmetic buttons and catching division by 0.
---

## The goal

We build a small calculator: two text fields for the numbers, four buttons **+**, **-**, **\*** and **/** and a line for the result.

New this time are **two columns** in the GridLayout and **several buttons** that all calculate with the same text fields.

Tick **Real Java (with Swing)** in the [gear](#zeige-einstellungen).

## Two columns

So far `GridLayout(0, 1)` put everything below each other. `GridLayout(0, 2)` gives you two columns. The building blocks fill the cells in the order of the `add` lines, always left first, then right:

| left | right |
|---|---|
| First number: | text field |
| Second number: | text field |
| + | - |
| \* | / |
| Result: | ? |

You won't need the labels on the left later. So you can build them directly inside `add`, without a variable:

```java
window.add(new JLabel("First number:"));
window.add(field1);
```

## The window with the first button

```java
import javax.swing.*;
import java.awt.*;

public class Calculator {
    public static void main(String[] args) {
        JFrame window = new JFrame("Calculator");
        window.setSize(280, 220);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setLayout(new GridLayout(0, 2));

        JTextField field1 = new JTextField();
        JTextField field2 = new JTextField();
        JButton plus = new JButton("+");
        JButton minus = new JButton("-");
        JButton times = new JButton("*");
        JButton divide = new JButton("/");
        JLabel result = new JLabel("?");

        plus.addActionListener(e -> {
            int a = Integer.parseInt(field1.getText());
            int b = Integer.parseInt(field2.getText());
            result.setText("" + (a + b));
        });

        window.add(new JLabel("First number:"));
        window.add(field1);
        window.add(new JLabel("Second number:"));
        window.add(field2);
        window.add(plus);
        window.add(minus);
        window.add(times);
        window.add(divide);
        window.add(new JLabel("Result:"));
        window.add(result);
        window.setVisible(true);
    }
}
```

Type 3 and 4 and click +. The result shows 7.

::: ludwig
Watch the brackets in `"" + (a + b)`. Without them Java works from left to right: `"" + a` gives the text “3”, and `"3" + b` appends the 4. You get “34” instead of 7. The bracket makes sure the calculation happens first.
:::

## The other three buttons

The buttons -, \* and / work the same way. Only the operator in the last line changes:

```java
minus.addActionListener(e -> {
    int a = Integer.parseInt(field1.getText());
    int b = Integer.parseInt(field2.getText());
    result.setText("" + (a - b));
});
```

/ has two special features:

- With `int`, Java cuts off the decimal places when dividing. 7 / 2 gives 3.
- If the second number is 0, Java throws an `ArithmeticException`, as in the task “Dividing safely” in lesson 22.

## Catching division by 0

```java
divide.addActionListener(e -> {
    int a = Integer.parseInt(field1.getText());
    int b = Integer.parseInt(field2.getText());
    try {
        result.setText("" + (a / b));
    } catch (ArithmeticException error) {
        result.setText("Not by 0!");
    }
});
```

::: angeberwissen
With `double` and `Double.parseDouble(…)` you get decimal places: 7 / 2 gives 3.5. In return, Java throws no exception when dividing decimal numbers by 0. The result is then `Infinity`.
:::

## Expert knowledge: a method of your own

This is not in the curriculum, but it makes the code shorter.

::: angeberwissen
Every listener reads the same two fields. You can move this repetition into a method of your own, a subprogram like in lesson 18. It goes in the class next to `main`:

`static int number(JTextField field) { return Integer.parseInt(field.getText()); }`

The listener then just says `result.setText("" + (number(field1) + number(field2)));`.
:::

## Game: What does the calculator show?

::: spiel frage
titel: Game: What does the calculator show?
intro: Ludwig has been tinkering with the calculator. Read the listener and predict what the result shows. Six rounds.

runde:
    plus.addActionListener(e -> {
        int a = Integer.parseInt(field1.getText());
        int b = Integer.parseInt(field2.getText());
        result.setText("" + a + b);
    });
frage: You type 3 and 4 and click +. What does the result show?
- 7
- [x] 34
- 12
> Without brackets Java works from left to right: `"" + 3` is the text "3", and `+ 4` adds the 4 to the end.

runde:
    times.addActionListener(e -> {
        int a = Integer.parseInt(field1.getText());
        int b = Integer.parseInt(field2.getText());
        result.setText("" + a * b);
    });
frage: You type 3 and 4 and click *. What does the result show?
- 34
- [x] 12
- 7
> Multiplication comes before addition here too: Java first works out 3 * 4, then adds the 12 to the text. Plus doesn't get this priority, which is why it needs the brackets.

runde:
    divide.addActionListener(e -> {
        int a = Integer.parseInt(field1.getText());
        int b = Integer.parseInt(field2.getText());
        result.setText("" + (a / b));
    });
frage: You type 7 and 2 and click /. What does the result show?
- 3.5
- [x] 3
- 4
> With `int` Java cuts off the decimal places. It doesn't round.

runde:
    divide.addActionListener(e -> {
        int a = Integer.parseInt(field1.getText());
        int b = Integer.parseInt(field2.getText());
        try {
            result.setText("" + (a / b));
        } catch (ArithmeticException error) {
            result.setText("Not by 0!");
        }
    });
frage: You type 8 and 0 and click /. What does the result show?
- 0
- [x] Not by 0!
- Infinity
> With `int`, dividing by 0 throws an ArithmeticException, and `catch` writes the hint.

runde:
    divide.addActionListener(e -> {
        double a = Double.parseDouble(field1.getText());
        double b = Double.parseDouble(field2.getText());
        result.setText("" + (a / b));
    });
frage: You type 7 and 2 and click /. What does the result show?
- 3
- [x] 3.5
- 3.0
> With `double` the decimal places are kept.

runde:
    divide.addActionListener(e -> {
        double a = Double.parseDouble(field1.getText());
        double b = Double.parseDouble(field2.getText());
        try {
            result.setText("" + (a / b));
        } catch (ArithmeticException error) {
            result.setText("Not by 0!");
        }
    });
frage: You type 8 and 0 and click /. What does the result show?
- Not by 0!
- [x] Infinity
- 0.0
> With `double` there is no exception. The result is `Infinity`, and the `catch` never gets its turn.
:::

## Task: calculator

Finish the calculator:

- all four buttons calculate,
- / reports “Not by 0!” instead of crashing,
- if a field contains “abc” or nothing, “Please enter two numbers” appears.

Extra: a fifth button **C** empties both fields and sets the result back to “?”.

::: ludwig
For “abc” every listener needs a try/catch with `NumberFormatException`. A `try` may also be followed by two `catch` blocks, one for `NumberFormatException` and one for `ArithmeticException`. By the way, an empty field gives the text `""`, and that isn't a number either.
:::

## Checklist

::: checkliste
- I can build two columns with GridLayout(0, 2). → Two columns
- I know why "" + (a + b) needs brackets. → The window with the first button
- All four arithmetic buttons work. → The other three buttons
- My calculator doesn't crash with 0 or “abc”. → Task: calculator
:::

## Quiz

::: quiz
? a is 3 and b is 4. What does "" + a + b give?
- [ ] 7
- [x] 34
- [ ] An error
> Java works from left to right: first the text "3" is created, then the 4 is appended.

? What does 7 / 2 give with int?
- [ ] 3.5
- [x] 3
- [ ] 4

? In which order does GridLayout(0, 2) fill the cells?
- [x] Row by row, left first, then right
- [ ] Column by column, starting top to bottom on the far left
- [ ] Randomly
:::
