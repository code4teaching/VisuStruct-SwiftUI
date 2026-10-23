---
titel: Click counter with reset
bereich: Windows with Swing
kurz: Two buttons change the same number: create a variable for the whole class.
---

## The goal

A window counts clicks: the number is at the top, two buttons below it. **+1** counts up by one, **Reset** sets the number back to 0.

What's new this time: two buttons work with the **same** number. For that you need a variable that both listeners know.

Tick **Real Java (with Swing)** in the [gear](#zeige-einstellungen).

## The first attempt

The obvious idea is to create the number in `main` as usual and count it up in the listener:

```
int count = 0;
button.addActionListener(e -> {
    count++;
    number.setText("" + count);
});
```

If you run this with real Java, the compiler reports an error:

```
local variables referenced from a lambda expression must be final or effectively final
```

::: ludwig
The listener only runs later, on every click, long after `main` has finished. That is why it may read the variables from `main`, but not change them. Java insists: a variable from `main` that appears in the arrow must stay the same. For a number that changes on every click, we need a different place.
:::

## A variable for the whole class

The solution: the variable does **not** go into `main`, but directly into the class, above `main`. Then it belongs to the whole class, and every listener may change it:

```
public class Counter {
    static int count = 0;

    public static void main(String[] args) {
        // the window as usual
    }
}
```

- `static` means: the variable belongs to the class itself. Because `main` is `static` too, it is needed here.
- A variable like this is called a **field** of the class. It lives as long as the program, not just as long as `main`.

## The whole program

```
import javax.swing.*;
import java.awt.*;

public class Counter {
    static int count = 0;

    public static void main(String[] args) {
        JFrame window = new JFrame("Click counter");
        window.setSize(250, 200);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setLayout(new GridLayout(0, 1));

        JLabel number = new JLabel("0", SwingConstants.CENTER);
        JButton plus = new JButton("+1");
        JButton reset = new JButton("Reset");

        plus.addActionListener(e -> {
            count++;
            number.setText("" + count);
        });
        reset.addActionListener(e -> {
            count = 0;
            number.setText("0");
        });

        window.add(number);
        window.add(plus);
        window.add(reset);
        window.setVisible(true);
    }
}
```

`SwingConstants.CENTER` puts the text of the label in the middle. Click +1 a few times and then Reset.

::: angeberwissen
With `number.setFont(new Font("SansSerif", Font.BOLD, 48));` the number becomes big and bold. `Font` comes from `java.awt`, which you have already imported.
:::

## Task: click counter

Rebuild the click counter and extend it:

- a button **−1** that counts down by one,
- the number should never go below 0. If it is 0, −1 does nothing.

::: ludwig
For “never below 0” the listener of −1 needs an `if`: only if `count > 0` does it count down.
:::

## Checklist

::: checkliste
- I know why a listener may not change a variable from main. → The first attempt
- I can create a static variable in the class. → A variable for the whole class
- Two of my buttons change the same number. → The whole program
- My counter has −1 and never goes below 0. → Task: click counter
:::

## Quiz

::: quiz
? Why may the listener not change the variable count from main?
- [ ] Because numbers are not allowed in Swing
- [x] Because the listener runs later and Java doesn't let the arrow change variables from main
- [ ] Because count gets too big

? Where does static int count = 0; go?
- [ ] In main, at the very top
- [x] In the class, outside main
- [ ] In the listener

? What does SwingConstants.CENTER do in new JLabel("0", SwingConstants.CENTER)?
- [x] It puts the text in the middle of the label.
- [ ] It puts the window in the middle of the screen.
- [ ] It makes the font bigger.
:::
