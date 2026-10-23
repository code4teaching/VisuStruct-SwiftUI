---
titel: A button in the window
bereich: Windows with Swing
kurz: Put a button into the window and arrange it neatly with a layout.
---

## Building a button

An empty window is boring. Now a button goes in. In Swing a button is called **JButton**.

You need two new lines for it:

```
JButton button = new JButton("Click me");
window.add(button);
```

- `new JButton("Click me")` builds a button. The text in brackets will be written on the button.
- `window.add(button)` puts the button into the window. Without `add` the button exists, but it is not placed anywhere and you cannot see it.

## The whole program

Both lines go **before** `setVisible(true)`, because the window should be set up completely first and then shown:

```
import javax.swing.*;

public class ButtonWindow {
    public static void main(String[] args) {
        JFrame window = new JFrame("Button");
        window.setSize(300, 200);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JButton button = new JButton("Click me");
        window.add(button);

        window.setVisible(true);
    }
}
```

Run the program. Surprise: the button is huge and fills the whole window!

::: ludwig
The order is the same as with your first window: set up, build the button, put the button in and show everything at the very end. The empty lines in the code help you see these parts.
:::

## The giant button

How a window arranges its parts is decided by its **layout**. Without further instructions, a `JFrame` puts everything in the middle and makes it as big as the whole window.

With a different layout the button gets its normal size. The **FlowLayout** places everything side by side like words in a line, only as big as needed:

```
import javax.swing.*;
import java.awt.*;

public class ButtonWindow {
    public static void main(String[] args) {
        JFrame window = new JFrame("Button");
        window.setSize(300, 200);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setLayout(new FlowLayout());

        JButton button = new JButton("Click me");
        window.add(button);

        window.setVisible(true);
    }
}
```

`FlowLayout` belongs to the older AWT toolbox. That is why there is a second line at the top: `import java.awt.*;`.

::: angeberwissen
With FlowLayout the building blocks flow like text: if a button no longer fits into the line, it moves to the next one. Make the window narrow and watch the buttons wrap. That is where the name comes from.
:::

## Clicking works, but nothing happens

Click the button. It turns a little darker while you press it. So Swing shows that it was pressed. Apart from that, nothing happens.

That is not a mistake: you have not told the program **what** should happen on a click yet. You will learn that in the next lesson.

## Task: click me

Build a window with the title “Button test”, 300 by 200 pixels, with a button “Click me” in normal size. It should be possible to press the button, even though nothing happens yet.

Extra: put a second button “Me too” next to it. In which order are the buttons? Swap the two `add` lines and try again.

::: ludwig
Every button needs its own variable, for example `button` and `button2`, and its own `add`. FlowLayout places the buttons in the order of the `add` lines.
:::

## Checklist

::: checkliste
- I can build a button and put it into the window with add. → Building a button
- I know why the button goes in before setVisible(true). → The whole program
- I can use FlowLayout so that the button has its normal size. → The giant button
- I have built a window with a button you can press. → Task: click me
:::

## Quiz

::: quiz
? What does window.add(button) do?
- [ ] It builds a new button.
- [x] It puts the button into the window.
- [ ] It makes the button clickable.
> The button is built with new JButton(…).

? Why does the button fill the whole window without FlowLayout?
- [ ] Because the text is too long
- [x] Because without its own layout the window makes everything as big as the window
- [ ] Because setSize is missing

? Which import line do you need for FlowLayout?
- [ ] import javax.swing.*;
- [x] import java.awt.*;
- [ ] import java.util.*;
> FlowLayout comes from the older AWT.

? What happens when you click the button in this lesson?
- [ ] The program ends.
- [x] The button turns darker for a moment, nothing else happens.
- [ ] The button says “I was clicked”.
> What should happen on a click is what you learn in the next lesson.
:::
