---
titel: Doubling a number in a window
bereich: Windows with Swing
kurz: Arrange a label, a text field and a button with a GridLayout and calculate with the text in the text field.
---

## The goal

We build a small calculator with a window: at the top there is a label, below it a text field and a button **Calculate**. If you type 2 and click, the text field shows 4. Click again and it becomes 8, then 16 and so on.

For this you need two new building blocks:

- **JLabel**: a label, simply text in the window.
- **JTextField**: a text field you can type into.

As in the last lessons, tick **Real Java (with Swing)** in the [gear](#zeige-einstellungen).

## Three building blocks in the window

We put all three building blocks into the window, just like the button in lesson 29:

```
import javax.swing.*;

public class Doubling {
    public static void main(String[] args) {
        JFrame window = new JFrame("Double the number");
        window.setSize(250, 150);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JLabel label = new JLabel("Enter a number:");
        JTextField field = new JTextField();
        JButton button = new JButton("Calculate");
        window.add(label);
        window.add(field);
        window.add(button);

        window.setVisible(true);
    }
}
```

Run the program. Oops: all you can see is the giant button. Where are the label and the text field?

## Why only the button shows

::: ludwig
Remember the giant button? Without a layout of its own, a `JFrame` has only **one** place: the middle. Every `add` puts the new building block exactly there, as big as the whole window. So the three building blocks land on top of each other in the same place, and the window only shows the last one you put in: the button. You can't use the program like this.
:::

The solution is a layout again. This time we use the **GridLayout**. It divides the window into cells of equal size, like a grid:

```
window.setLayout(new GridLayout(0, 1));
```

The two numbers are rows and columns. `0` rows means “as many as needed”, `1` column means: everything below each other. For `GridLayout` you also need `import java.awt.*;` at the top.

| Layout | How it arranges things |
|---|---|
| no layout | everything in the middle, on top of each other |
| `FlowLayout` | side by side like words, with a line break when needed |
| `GridLayout(0, 1)` | below each other, every row the same height |

## The window with GridLayout

```
import javax.swing.*;
import java.awt.*;

public class Doubling {
    public static void main(String[] args) {
        JFrame window = new JFrame("Double the number");
        window.setSize(250, 150);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setLayout(new GridLayout(0, 1));

        JLabel label = new JLabel("Enter a number:");
        JTextField field = new JTextField();
        JButton button = new JButton("Calculate");
        window.add(label);
        window.add(field);
        window.add(button);

        window.setVisible(true);
    }
}
```

Now all three are below each other. You can type into the text field and press the button. But the program doesn't calculate anything yet.

::: angeberwissen
With `new GridLayout(2, 3)` you get 2 rows with 3 columns each, so 6 cells of the same size. That is how you build the keys of a calculator, for example. The building blocks fill the cells in the order of the `add` lines, row by row from left to right.
:::

## Calculating with the text in the text field

On a click, the program should take the number from the text field, double it and write it back. Three methods do this:

- `field.getText()` gives you the text in the text field, for example `"2"`.
- `Integer.parseInt(…)` turns it into the number 2. You know this from lesson 22.
- `field.setText(…)` writes a new text into the text field.

Together with the ActionListener from lesson 30 it looks like this:

```
button.addActionListener(e -> {
    int number = Integer.parseInt(field.getText());
    field.setText("" + number * 2);
});
```

`setText` needs a text. `"" + number * 2` appends the result to an empty text and so turns the number into a text.

## Not a number? No crash!

Type “abc” into the text field and click Calculate. The window stays, but nothing happens, and the [console](#zeige-konsole) shows a `NumberFormatException`. From lesson 22 you know what to do:

```
button.addActionListener(e -> {
    try {
        int number = Integer.parseInt(field.getText());
        field.setText("" + number * 2);
    } catch (NumberFormatException error) {
        label.setText("Please enter a whole number!");
    }
});
```

Instead of an error in the console, you now see a hint in the window.

::: ludwig
The arrow already has an `e` for the event. That is why the exception in `catch` needs a different name, here `error`. Java doesn't allow two variables with the same name.
:::

## Task: doubling a number

Put the whole program together:

- a window with the title “Double the number”, 250 pixels wide and 150 pixels high,
- below each other a label, a text field and a button “Calculate”,
- every click doubles the number in the text field: 2, 4, 8, 16, …
- with “abc” a hint appears in the label instead of a crash.

Extra: a second button “Halve” divides the number by 2. What happens with 5?

::: ludwig
The “Halve” button goes into the GridLayout as the fourth row and gets its own ActionListener. With `int`, Java cuts off the decimal places when dividing.
:::

## Checklist

::: checkliste
- I can put a JLabel and a JTextField into the window. → Three building blocks in the window
- I know why only the last building block shows without a layout. → Why only the button shows
- I can arrange everything below each other with GridLayout(0, 1). → The window with GridLayout
- I can calculate with getText, Integer.parseInt and setText. → Calculating with the text in the text field
- My program doesn't crash with “abc”. → Not a number? No crash!
:::

## Quiz

::: quiz
? Why does only the button show without a layout?
- [ ] Because the label and the text field are missing
- [x] Because all building blocks lie on top of each other in the middle and the last one hides the others
- [ ] Because the window is too small

? What does new GridLayout(0, 1) mean?
- [ ] No row and one column, so the window is empty
- [x] As many rows as needed in one column, so everything below each other
- [ ] One row, everything side by side

? What does field.getText() give you?
- [ ] Always a number
- [x] The text in the text field
- [ ] The title of the window
> For a number you still need Integer.parseInt.

? Match each building block to its job.
= JLabel -> label
= JTextField -> text field for typing
= JButton -> button
= GridLayout -> arrangement in a grid
:::
