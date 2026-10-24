---
titel: Unit converter
nach: 35
stufe: 2
---

Build a window that converts lengths. At the top you type a length in metres, below it there are three buttons:

- **in cm** shows the length in centimetres, 1.5 becomes "150.0 cm",
- **in mm** shows it in millimetres, 1.5 becomes "1500.0 mm",
- **in km** shows it in kilometres, 1500 becomes "1.5 km".

The result is shown in a JLabel below the buttons. If the field doesn't contain a number, it says "Please enter a number", and the program doesn't crash.

You can start like this:

```java
import javax.swing.*;
import java.awt.*;

public class Units {
    public static void main(String[] args) {
        JFrame window = new JFrame("Unit converter");
        window.setSize(300, 200);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setLayout(new GridLayout(0, 1));

        JTextField metres = new JTextField();
        JButton inCm = new JButton("in cm");
        JLabel result = new JLabel("?", SwingConstants.CENTER);

        inCm.addActionListener(e -> {
            double m = Double.parseDouble(metres.getText());
            result.setText((m * 100) + " cm");
        });

        window.add(metres);
        window.add(inCm);
        window.add(result);
        window.setVisible(true);
    }
}
```

Extra: a fourth button **in feet** converts to the imperial unit. One foot is 0.3048 m.

::: ludwig
Tick **Real Java (with Swing)** in the [gear](#zeige-einstellungen). For "abc" in the field, every listener needs a try/catch with `NumberFormatException`, just like the calculator.
:::
