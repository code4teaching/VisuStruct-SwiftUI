---
titel: A traffic light with colours
bereich: Windows with Swing
kurz: Set background colours and switch a traffic light on with a state variable.
---

## The goal

We build a traffic light: a large area lights up red. Each click on **Next** switches it on: red, green, yellow and red again.

New this time are **colours** and a **state**: the program has to remember which colour is currently showing.

Tick **Real Java (with Swing)** in the [gear](#zeige-einstellungen).

## Colours in Swing

Colours live in the class `Color` from `java.awt`. Ready-made colours are, for example, `Color.RED`, `Color.GREEN`, `Color.YELLOW`, `Color.ORANGE` and `Color.WHITE`.

This is how you colour a label:

```
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

So that the traffic light knows what comes next, it remembers its state in a number: 0 means red, 1 means green, 2 means yellow. As with the click counter from lesson 27, the variable is in the class so that the listener may change it:

```
static int phase = 0;
```

On every click the phase moves on by one. After yellow (2) comes red (0) again:

```
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

```
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
BorderLayout is the layout a `JFrame` uses when you don't give it one. An `add` without a place lands in `CENTER`. That is why all the building blocks lay on top of each other in lesson 26.
:::

::: angeberwissen
Professionals switch on in one line: `phase = (phase + 1) % 3;`. The remainder operator `%` gives the remainder of a division. 3 % 3 is 0, so after 2 it starts at 0 again.
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

::: checkliste
- I can colour a label with setOpaque and setBackground. → Colours in Swing
- I can remember a state with a static variable. → Remembering the colour
- With BorderLayout I can put something big in the middle and something narrow at the bottom. → The whole program
- My traffic light has four phases. → Task: traffic light
:::

## Quiz

::: quiz
? Why does the colour stay invisible without setOpaque(true)?
- [ ] Because Color.RED doesn't exist
- [x] Because a label is transparent otherwise
- [ ] Because the window is too small

? Which place in the BorderLayout gets the space that is left?
- [ ] NORTH
- [ ] SOUTH
- [x] CENTER

? phase is 2 and the listener runs phase++ and then if (phase > 2) { phase = 0; }. What is phase afterwards?
- [x] 0
- [ ] 2
- [ ] 3
> After phase++ it is 3, which is greater than 2, so it becomes 0.
:::
