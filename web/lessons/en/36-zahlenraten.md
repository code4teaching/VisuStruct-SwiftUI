---
titel: Guess the number
bereich: Windows with Swing
kurz: A game with a random number, a counter for the guesses and a button that switches itself off at the end.
---

## Skills I will gain now

::: kompetenzen
- create a random whole number from 1 to 100 with Math.random
- decide which variables belong in the class
- switch a button off with setEnabled
- build a guessing game with a “New game” button
:::

## The goal

Time for a game: the computer thinks of a number from 1 to 100. You guess, and the window tells you “too small” or “too big”. Once you have found it, it tells you how many guesses you needed.

New this time are **random numbers** and a button that **switches itself off** at the end.

Tick **Real Java (with Swing)** in the [gear](#zeige-einstellungen).

## A random number

`Math.random()` gives a random decimal number from 0 to just under 1, for example 0.4173. Three steps turn it into a whole number from 1 to 100:

```java
int secret = (int) (Math.random() * 100) + 1;
```

| Step | Example |
|---|---|
| `Math.random()` | 0.4173 |
| `* 100` | 41.73 |
| `(int)` cuts off the decimal places | 41 |
| `+ 1` | 42 |

Without `+ 1` you would get 0 to 99.

Try it in the [Code](#zeige-codelive) area: `int secret = (int) (Math.random() * 100) + 1;` and `System.out.println(secret);`. Every run gives a different number.

::: angeberwissen
Computers can't actually roll dice. `Math.random()` uses a formula to calculate a long sequence of numbers that only **look** random. They are called pseudo-random numbers. For games that is perfectly fine.
:::

## What the game remembers

The game has to remember two things across all clicks: the secret number and the number of guesses. As with the click counter from lesson 32, both go in the class:

```java
static int secret = (int) (Math.random() * 100) + 1;
static int guesses = 0;
```

## The whole program

```java
import javax.swing.*;
import java.awt.*;

public class GuessTheNumber {
    static int secret = (int) (Math.random() * 100) + 1;
    static int guesses = 0;

    public static void main(String[] args) {
        JFrame window = new JFrame("Guess the number");
        window.setSize(320, 180);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setLayout(new GridLayout(0, 1));

        JLabel hint = new JLabel("I'm thinking of a number from 1 to 100.");
        JTextField field = new JTextField();
        JButton button = new JButton("Guess");

        button.addActionListener(e -> {
            int guess = Integer.parseInt(field.getText());
            guesses++;
            if (guess < secret) {
                hint.setText(guess + " is too small.");
            } else if (guess > secret) {
                hint.setText(guess + " is too big.");
            } else {
                hint.setText("Correct! You needed " + guesses + " guesses.");
                button.setEnabled(false);
            }
            field.setText("");
        });

        window.add(hint);
        window.add(field);
        window.add(button);
        window.setVisible(true);
    }
}
```

- `field.setText("")` empties the text field after each guess, so you can type the next one straight away.
- `button.setEnabled(false)` switches the button off. It turns grey and can't be clicked any more. The game is over.

::: ludwig
`setEnabled(true)` switches a button back on. That way you can, for example, only allow a button once something has been entered.
:::

## Expert knowledge: winning in 7 guesses

::: angeberwissen
If you guess cleverly, you never need more than 7 guesses. Always guess the middle of the range that is left: first 50, then 25 or 75 and so on. Each guess halves the range: 100, 50, 25, 13, 7, 4, 2, 1. That is the **binary search** from lesson 19. Because 2 to the power of 7 = 128 is bigger than 100, 7 guesses are enough.
:::

## Task: guess the number

Rebuild the game and improve it:

- An input like “abc” doesn't count as a guess and shows the hint “Please enter a number”.
- A second button **New game** thinks of a new number, sets the guesses to 0, switches the Guess button back on and resets the hint.

Extra: after 7 wrong guesses the game is lost. The window then reveals the secret number.

::: ludwig
For “doesn't count as a guess”, `guesses++` must come **after** `Integer.parseInt`, both in the `try` block. If `parseInt` throws an exception, the line with `guesses++` is skipped.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can create a random whole number from 1 to 100 with Math.random. → A random number
- I can decide which variables belong in the class. → What the game remembers
- I can switch a button off with setEnabled. → The whole program
- I can build a guessing game with a “New game” button. → Task: guess the number
:::

## Quiz

::: quiz
? Which numbers does (int) (Math.random() * 100) + 1 give?
→ A random number
- [ ] 0 to 100
- [x] 1 to 100
- [ ] 1 to 101

? What does button.setEnabled(false) do?
→ The whole program
- [ ] It removes the button from the window.
- [x] The button turns grey and can't be clicked any more.
- [ ] It changes the text on the button.

? With binary search, how many guesses do you need at most for 1 to 100?
→ Task: guess the number
- [ ] 50
- [ ] 10
- [x] 7
> Each guess halves the range, and 2 to the power of 7 = 128 is bigger than 100.
:::
