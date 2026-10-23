---
titel: Rolling dice with MVC
nach: 40
stufe: 3
---

Build a dice game with Model View Controller. A button **Roll** rolls the dice, and two views show the result.

The model is already finished. It rolls and counts how often it was rolled and how many sixes came up:

```
class Dice {
    int pips = 1;
    int rolls = 0;
    int sixes = 0;

    void roll() {
        pips = (int) (Math.random() * 6) + 1;
        rolls++;
        if (pips == 6) {
            sixes++;
        }
    }
}
```

Your task:

1. Test the model without a window first: roll ten times in `main` and then output `rolls` and `sixes`.
2. Write the view `PipsView`. It shows the number rolled in a big JLabel, for example "4".
3. Write the view `StatsView`. It shows for example "Sixes: 2 of 10 rolls".
4. The controller is the listener at the button: it lets the model roll and hands the new values to both views.

Extra: a button **New game** resets everything. The method for that belongs in the model.

::: ludwig
Remember the rule from lesson 40: there isn't a single `JLabel` in the model. If you change the font size when rolling, that belongs in the view.
:::
