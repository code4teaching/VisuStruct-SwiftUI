---
titel: A traffic light with colours
bereich: Windows with Swing
kurz: Set background colours and switch a traffic light on with a state variable.
---

## Skills I will gain now

::: kompetenzen
- colour a label with setOpaque and setBackground
- remember a state with a static variable
- use BorderLayout to put something big in the middle and something narrow at the bottom
- explain what FlowLayout, GridLayout and BorderLayout are good for
- program a traffic light with four phases
:::

## The goal

We build a traffic light: a large area lights up red. Each click on **Next** switches it on: red, green, yellow and red again.

New this time are **colours** and a **state**: the program has to remember which colour is currently showing.

Tick **Real Java (with Swing)** in the [gear](#zeige-einstellungen).

## Colours in Swing

Colours live in the class `Color` from `java.awt`. Ready-made colours are, for example, `Color.RED`, `Color.GREEN`, `Color.YELLOW`, `Color.ORANGE` and `Color.WHITE`.

This is how you colour a label:

```java
JLabel light = new JLabel("", SwingConstants.CENTER);
light.setOpaque(true);
light.setBackground(Color.RED);
```

- `setBackground(…)` sets the background colour.
- A `JLabel` also needs `setOpaque(true)`. Without this line the background is transparent and the colour stays invisible.

::: ludwig
`opaque` means “not see-through”. A label is normally transparent, like writing on a pane of glass. Only with `setOpaque(true)` does it get its own area that can be painted.
:::

## Remembering the colour

So that the traffic light knows what comes next, it remembers its state in a number: 0 means red, 1 means green, 2 means yellow. As with the click counter from lesson 32, the variable is in the class so that the listener may change it:

```java
static int phase = 0;
```

On every click the phase moves on by one. After yellow (2) comes red (0) again:

```java
next.addActionListener(e -> {
    phase++;
    if (phase > 2) {
        phase = 0;
    }
    if (phase == 0) {
        light.setBackground(Color.RED);
    } else if (phase == 1) {
        light.setBackground(Color.GREEN);
    } else {
        light.setBackground(Color.YELLOW);
    }
});
```

## The whole program

```java
import javax.swing.*;
import java.awt.*;

public class TrafficLight {
    static int phase = 0;

    public static void main(String[] args) {
        JFrame window = new JFrame("Traffic light");
        window.setSize(200, 300);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setLayout(new BorderLayout());

        JLabel light = new JLabel("", SwingConstants.CENTER);
        light.setOpaque(true);
        light.setBackground(Color.RED);
        JButton next = new JButton("Next");

        next.addActionListener(e -> {
            phase++;
            if (phase > 2) {
                phase = 0;
            }
            if (phase == 0) {
                light.setBackground(Color.RED);
            } else if (phase == 1) {
                light.setBackground(Color.GREEN);
            } else {
                light.setBackground(Color.YELLOW);
            }
        });

        window.add(light, BorderLayout.CENTER);
        window.add(next, BorderLayout.SOUTH);
        window.setVisible(true);
    }
}
```

This uses a new layout, the **BorderLayout**. It has five places: `NORTH` (top), `SOUTH` (bottom), `WEST` (left), `EAST` (right) and `CENTER` (middle). The middle gets all the space that is left. So the light becomes big, and the button stays narrow at the bottom.

::: angeberwissen
BorderLayout is the layout a `JFrame` uses when you don't give it one. An `add` without a place lands in `CENTER`. That is why all the building blocks lay on top of each other in lesson 31.
:::

::: angeberwissen
Professionals switch on in one line: `phase = (phase + 1) % 3;`. The remainder operator `%` gives the remainder of a division. 3 % 3 is 0, so after 2 it starts at 0 again.
:::

## Which layout for what?

You now know three layouts. Each one arranges the building blocks differently:

| Layout | How it arranges | Good for |
|---|---|---|
| `FlowLayout` (lesson 29) | next to each other like words in a line, each block as big as needed | a few buttons in a row |
| `GridLayout` (lesson 31) | a grid of cells of the same size, filled row by row | forms, keypads like on a calculator |
| `BorderLayout` (this lesson) | five places: top, bottom, left, right and the middle, which gets the rest | something big in the middle, such as a picture or a display, with buttons at the edge |

Without `setLayout` a window uses the BorderLayout. That is why everything then lands in the middle.

::: ludwig
Ask yourself when planning: should all parts be the same size? Then GridLayout. Should one part be big and the rest narrow at the edge? Then BorderLayout. Should the parts simply keep their normal size? Then FlowLayout.
:::

## Game: Where does the button go?

::: spiel layout
titel: Game: Where does the button go?
intro: You now know three layouts and the window with no layout at all. Ludwig shows you code with the buttons A, B, C … What does the window look like? Tap the right picture.
frage: What does the window look like?

runde:
    window.add(new JButton("A"));
    window.add(new JButton("B"));
    window.add(new JButton("C"));
- flow: A B C
- grid: A / B / C
- [x] border: C=C
> Without a layout of its own, every `add` lands in the centre, as big as the window. The three lie on top of each other, and you only see the last one: C.

runde:
    window.setLayout(new FlowLayout());
    window.add(new JButton("A"));
    window.add(new JButton("B"));
    window.add(new JButton("C"));
- [x] flow: A B C
- grid: A B C
- border: C=C
> FlowLayout puts the buttons next to each other at their normal size, like words in a line, and centres them.

runde:
    window.setLayout(new GridLayout(0, 1));
    window.add(new JButton("A"));
    window.add(new JButton("B"));
    window.add(new JButton("C"));
- flow: A B C
- [x] grid: A / B / C
- grid: A B C
> One column, as many rows as needed: everything below each other, every row the same height and as wide as the window.

runde:
    window.setLayout(new GridLayout(0, 2));
    window.add(new JButton("A"));
    window.add(new JButton("B"));
    window.add(new JButton("C"));
    window.add(new JButton("D"));
- grid: A C / B D
- [x] grid: A B / C D
- grid: A / B / C / D
> Two columns. The cells are filled row by row, always left first, then right: A B, then C D.

runde:
    window.setLayout(new GridLayout(2, 3));
    window.add(new JButton("A"));
    window.add(new JButton("B"));
    window.add(new JButton("C"));
    window.add(new JButton("D"));
    window.add(new JButton("E"));
    window.add(new JButton("F"));
- grid: A B / C D / E F
- [x] grid: A B C / D E F
- flow: A B C D E F
> Rows come first, then columns: 2 rows with 3 columns each.

runde:
    window.setLayout(new GridLayout(0, 2));
    window.add(new JButton("A"));
    window.add(new JButton("B"));
    window.add(new JButton("C"));
- [x] grid: A B / C
- grid: A B C
- grid: A / B C
> Two columns, three buttons: the first row is full, in the second C is on the left, and the cell on the right stays empty.

runde:
    window.setLayout(new BorderLayout());
    window.add(new JButton("A"), BorderLayout.NORTH);
    window.add(new JButton("B"), BorderLayout.CENTER);
    window.add(new JButton("C"), BorderLayout.SOUTH);
- grid: A / B / C
- [x] border: N=A C=B S=C
- border: N=C C=B S=A
> NORTH is at the top, SOUTH at the bottom. The centre gets all the remaining space, which is why B is big.

runde:
    window.setLayout(new BorderLayout());
    window.add(new JButton("A"), BorderLayout.WEST);
    window.add(new JButton("B"));
    window.add(new JButton("C"), BorderLayout.EAST);
- flow: A B C
- border: N=A C=B S=C
- [x] border: W=A C=B E=C
> WEST is on the left, EAST on the right. B has no place given, so it lands in CENTER.
:::

## Task: traffic light

Rebuild the traffic light and make it more realistic. In the UK and Germany, red and amber light up together briefly after red. So add a fourth phase:

- 0: red
- 1: red and amber (use `Color.ORANGE`)
- 2: green
- 3: amber (yellow)

Extra: in each phase, also write with `light.setText(…)` what the light means, for example “Stop” or “Go”.

::: ludwig
With four phases, 0 comes after 3. So change the number in `if (phase > 2)`.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can colour a label with setOpaque and setBackground. → Colours in Swing
- I can remember a state with a static variable. → Remembering the colour
- I can use BorderLayout to put something big in the middle and something narrow at the bottom. → The whole program
- I can explain what FlowLayout, GridLayout and BorderLayout are good for. → Which layout for what?
- I can program a traffic light with four phases. → Task: traffic light
:::

## Quiz

::: quiz
? Why does the colour stay invisible without setOpaque(true)?
→ Colours in Swing
- [ ] Because Color.RED doesn't exist
- [x] Because a label is transparent otherwise
- [ ] Because the window is too small

? Which place in the BorderLayout gets the space that is left?
→ The whole program
- [ ] NORTH
- [ ] SOUTH
- [x] CENTER

? phase is 2 and the listener runs phase++ and then if (phase > 2) { phase = 0; }. What is phase afterwards?
→ Remembering the colour
- [x] 0
- [ ] 2
- [ ] 3
> After phase++ it is 3, which is greater than 2, so it becomes 0.
:::
