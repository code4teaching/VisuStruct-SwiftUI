---
titel: Grade calculator in a window
bereich: Windows with Swing
kurz: Enter points, work out the grade with else if and catch wrong input.
---

## The goal

A window turns points into a grade: you type the points of a test (0 to 100), click **Calculate grade**, and the grade appears at the bottom.

This time there is no new Swing building block. What's new is that you combine everything so far: text field, button, `else if` from lesson 20 and try/catch from lesson 22.

Tick **Real Java (with Swing)** in the [gear](#zeige-einstellungen).

## The grading scale

We use this grading scale:

| Points | Grade |
|---|---|
| 90 to 100 | A |
| 80 to 89 | B |
| 70 to 79 | C |
| 60 to 69 | D |
| 0 to 59 | F |

With `else if` you check from top to bottom. The first condition that is true wins:

```
String grade;
if (points >= 90) {
    grade = "A";
} else if (points >= 80) {
    grade = "B";
} else if (points >= 70) {
    grade = "C";
} else if (points >= 60) {
    grade = "D";
} else {
    grade = "F";
}
```

::: ludwig
With 85 points, `points >= 90` is false, but `points >= 80` is true. So grade B, and the remaining conditions are not checked at all. That is why the lower limit is enough each time.
:::

You can try this part without a window in [Live code](#zeige-codelive). Put `int points = 85;` in front of it and `System.out.println("Grade: " + grade);` after it. The structure chart shows you the nested branches.

## The window

```
import javax.swing.*;
import java.awt.*;

public class GradeCalculator {
    public static void main(String[] args) {
        JFrame window = new JFrame("Grade calculator");
        window.setSize(260, 180);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setLayout(new GridLayout(0, 1));

        JLabel question = new JLabel("Points (0 to 100):");
        JTextField field = new JTextField();
        JButton button = new JButton("Calculate grade");
        JLabel result = new JLabel("Grade: ?");

        button.addActionListener(e -> {
            int points = Integer.parseInt(field.getText());
            String grade;
            if (points >= 90) {
                grade = "A";
            } else if (points >= 80) {
                grade = "B";
            } else if (points >= 70) {
                grade = "C";
            } else if (points >= 60) {
                grade = "D";
            } else {
                grade = "F";
            }
            result.setText("Grade: " + grade);
        });

        window.add(question);
        window.add(field);
        window.add(button);
        window.add(result);
        window.setVisible(true);
    }
}
```

Try 100, 85, 60 and 12.

## Catching wrong input

Two things can still go wrong:

1. Someone types “abc”. Then `Integer.parseInt` throws a `NumberFormatException`.
2. Someone types 150 or −5. That is a number, but not a valid score.

You catch the first case with try/catch, the second with an `if` before working out the grade:

```
button.addActionListener(e -> {
    try {
        int points = Integer.parseInt(field.getText());
        if (points < 0 || points > 100) {
            result.setText("Please enter 0 to 100.");
        } else {
            // the grade calculation from above goes here
        }
    } catch (NumberFormatException error) {
        result.setText("That is not a number.");
    }
});
```

::: ludwig
`||` means “or” (lesson 9). The condition is true if the points are too small **or** too big.
:::

## Task: grade calculator

Put the grade calculator together, with both checks from the last step. Test it with 90, 89, 0, 100, 101 and “ten”.

Extra: also write a word for the grade, for example “Grade: B (good)”. The words are excellent, good, satisfactory, poor and fail.

::: ludwig
Always test the limits: 90 must be an A, 89 a B. Most mistakes hide at the limits, for example `>` instead of `>=`.
:::

## Checklist

::: checkliste
- I can turn points into a grade with else if. → The grading scale
- I can show the grade in the window. → The window
- My program reports “abc” and points outside 0 to 100. → Catching wrong input
- I have tested the limits 90 and 89. → Task: grade calculator
:::

## Quiz

::: quiz
? Which grade does the scale give for 70 points?
- [ ] B
- [x] C
- [ ] D
> 70 is the lower limit for a C.

? Why is the lower limit enough in each condition?
- [x] Because else if has already sorted out the higher cases
- [ ] Because Java doesn't know upper limits
- [ ] Because the points are always 100

? Which condition detects invalid points?
- [ ] points < 0 && points > 100
- [x] points < 0 || points > 100
- [ ] points >= 0 || points <= 100
> A number can't be smaller than 0 and bigger than 100 at the same time, so you need or.
:::
