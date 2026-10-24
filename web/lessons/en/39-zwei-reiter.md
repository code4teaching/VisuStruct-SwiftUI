---
titel: Two tabs
bereich: Windows with Swing
kurz: Build a window with two tabs, bring data from one tab to the other and save the list as a text file.
---

## The goal

Ludwig's shopping list from lesson 23 gets a window. It has two **tabs**, like the tabs in a browser:

- In the tab **Input** you type what you need and click **Add**.
- The tab **List** shows everything you have entered. A button **Save** writes the list into a text file.

New are the tabs (`JTabbedPane`), a text area with several lines (`JTextArea`) and saving from inside a listener.

Tick **Real Java (with Swing)** in the [gear](#zeige-einstellungen).

## Tabs with JTabbedPane

Each tab shows its own area. The areas are JPanels, like the keypad of the code lock in lesson 37:

```java
JTabbedPane tabs = new JTabbedPane();
JPanel input = new JPanel(new GridLayout(0, 1));
JPanel list = new JPanel(new BorderLayout());

tabs.addTab("Input", input);
tabs.addTab("List", list);
window.add(tabs);
```

| Call | Meaning |
|---|---|
| `addTab("Input", input)` | a new tab with the caption "Input", it shows the JPanel `input` |
| `setSelectedIndex(1)` | switches to the second tab, counting starts at 0 |
| `setTitleAt(1, "List (3)")` | changes the caption of the second tab |

At the start, the tab that was added first is open.

## A text area with several lines

A `JTextField` has only one line. For the list you need a `JTextArea`:

```java
JTextArea area = new JTextArea();
area.setEditable(false);
area.append("Hay\n");
```

- `append` adds text at the end. The `"\n"` then starts a new line, as when splitting with `split("\n")` in lesson 24.
- `setEditable(false)` stops people from typing into the list itself.
- `getText()` returns the whole text with all lines.

## From one tab to the other

The button **Add** is on the tab Input, the text area on the tab List. Still, the listener can use both. All building blocks are variables in `main`, and the lambda sees all of them, no matter on which tab they are shown later:

```java
add.addActionListener(e -> {
    area.append(field.getText() + "\n");
    info.setText(field.getText() + " is on the list.");
    field.setText("");
});
```

::: ludwig
A building block can only lie on **one** area. If you add the same button first to `input` and then to `list`, Swing takes it away from `input`. It only shows up on the tab List.
:::

## Saving inside the listener

To save, you use the `PrintWriter` from lesson 23. Inside the listener there is a catch, though: the way out with `throws Exception` from lesson 23 doesn't exist here. The lambda is a method of its own, `actionPerformed`, and according to the contract it must not pass on a `FileNotFoundException`. That's why saving goes into try and catch:

```java
save.addActionListener(e -> {
    try {
        PrintWriter out = new PrintWriter("shoppinglist.txt");
        out.print(area.getText());
        out.close();
        info.setText("Saved in shoppinglist.txt");
        tabs.setSelectedIndex(0);
    } catch (FileNotFoundException ex) {
        info.setText("Saving didn't work.");
    }
});
```

- The exception is called `ex` here, because the name `e` is already taken by the event.
- After saving, the window jumps back to the tab Input with `setSelectedIndex(0)`, where the message is.
- VisuStruct shows the saved file below the console as soon as you have clicked Save.

## The whole program

```java
import javax.swing.*;
import java.awt.*;
import java.io.*;

public class ShoppingList {
    public static void main(String[] args) {
        JFrame window = new JFrame("Shopping list");
        window.setSize(300, 250);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JTabbedPane tabs = new JTabbedPane();

        JPanel input = new JPanel(new GridLayout(0, 1));
        JTextField field = new JTextField();
        JButton add = new JButton("Add");
        JLabel info = new JLabel("Nothing on the list yet.");
        input.add(new JLabel("What do you need?"));
        input.add(field);
        input.add(add);
        input.add(info);

        JPanel list = new JPanel(new BorderLayout());
        JTextArea area = new JTextArea();
        area.setEditable(false);
        JButton save = new JButton("Save");
        list.add(area, BorderLayout.CENTER);
        list.add(save, BorderLayout.SOUTH);

        tabs.addTab("Input", input);
        tabs.addTab("List", list);

        add.addActionListener(e -> {
            area.append(field.getText() + "\n");
            info.setText(field.getText() + " is on the list.");
            field.setText("");
        });

        save.addActionListener(e -> {
            try {
                PrintWriter out = new PrintWriter("shoppinglist.txt");
                out.print(area.getText());
                out.close();
                info.setText("Saved in shoppinglist.txt");
                tabs.setSelectedIndex(0);
            } catch (FileNotFoundException ex) {
                info.setText("Saving didn't work.");
            }
        });

        window.add(tabs);
        window.setVisible(true);
    }
}
```

Type Hay, click Add, then Apples and Add again. Switch to the tab List and click Save.

## Game: Where does it end up?

::: spiel frage
titel: Game: Where does it end up?
intro: Ludwig builds windows with tabs. Read the code and predict what you see. Six rounds.

runde:
    tabs.addTab("Input", input);
    tabs.addTab("List", list);
frage: Which tab is open at the start?
- [x] Input
- List
- none
> At the start, the tab that was added first is open.

runde:
    tabs.addTab("List", list);
    tabs.addTab("Input", input);
frage: Which tab is open at the start?
- Input
- [x] List
- both
> This time List comes first. The order of `addTab` decides the order of the tabs.

runde:
    tabs.addTab("Input", input);
    tabs.addTab("List", list);
    tabs.addTab("Help", help);
    tabs.setSelectedIndex(1);
frage: Which tab is open?
- Input
- [x] List
- Help
> Counting starts at 0: 0 is Input, 1 is List, 2 is Help.

runde:
    add.addActionListener(e -> {
        area.append(field.getText() + "\n");
        field.setText("");
    });
    // You type Hay, click Add, type Apples, click Add.
frage: What is on the tab List afterwards?
- Apples
- HayApples
- [x] Hay\nApples
> `append` adds at the end, and each `"\n"` starts a new line.

runde:
    JButton button = new JButton("OK");
    input.add(button);
    list.add(button);
frage: Where does the button OK show up?
- on both tabs
- only on the tab Input
- [x] only on the tab List
> A building block can only lie on one area. With the second `add`, Swing takes it away from `input`.

runde:
    save.addActionListener(e -> {
        area.setText("");
        tabs.setTitleAt(1, "List (empty)");
        tabs.setSelectedIndex(0);
    });
    // The button save is on the tab List.
frage: What do you see after the click?
- the empty tab List
- [x] the tab Input, and the second tab is called "List (empty)"
- the tab Input, the second tab is still called "List"
> The listener empties the area, renames the tab and switches to tab 0. All of it happens with one click.
:::

## Task: Shopping list with tabs

Build the program and try it out.

Then make it better:

- Empty inputs don't go onto the list. Check `field.getText().isEmpty()` first (lesson 17).
- The tab List shows in its title how many things are on the list: "List (3)". Count along in a `static int` variable and use `setTitleAt`.
- Extra: a third tab **Help** with a JLabel that explains how the program works.

## Checklist

::: checkliste
- I can build a window with two tabs. → Tabs with JTabbedPane
- I can add lines to a JTextArea with append. → A text area with several lines
- I know why a listener can use building blocks on both tabs. → From one tab to the other
- I can save a file inside a listener with try and catch. → Saving inside the listener
- My shopping list counts how many things are on it. → Task: Shopping list with tabs
:::

## Quiz

::: quiz
? Which tab is open after tabs.setSelectedIndex(0)?
- [x] the first one
- [ ] the second one
- [ ] none

? Why is saving inside the listener in try and catch?
- [ ] Because PrintWriter only works inside try.
- [x] Because actionPerformed must not pass on a FileNotFoundException.
- [ ] Because main has no throws.

? What is the difference between JTextField and JTextArea?
- [ ] There is none.
- [x] JTextArea can show several lines.
- [ ] You can't write into a JTextField.

? Match.
= JTabbedPane -> an area with tabs
= JPanel -> the area of a tab
= JTextArea -> a text area with several lines
:::
