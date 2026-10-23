---
titel: Einheitenrechner
nach: 35
stufe: 2
---

Baue ein Fenster, das Längen umrechnet. Oben tippst du eine Länge in Metern ein, darunter stehen drei Knöpfe:

- **in cm** zeigt die Länge in Zentimetern, aus 1.5 wird „150.0 cm“,
- **in mm** zeigt sie in Millimetern, aus 1.5 wird „1500.0 mm“,
- **in km** zeigt sie in Kilometern, aus 1500 wird „1.5 km“.

Das Ergebnis steht in einem JLabel unter den Knöpfen. Steht im Feld keine Zahl, erscheint dort „Bitte eine Zahl eingeben“, und das Programm stürzt nicht ab.

So kannst du anfangen:

```
import javax.swing.*;
import java.awt.*;

public class Einheiten {
    public static void main(String[] args) {
        JFrame fenster = new JFrame("Einheitenrechner");
        fenster.setSize(300, 200);
        fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        fenster.setLayout(new GridLayout(0, 1));

        JTextField meter = new JTextField();
        JButton inCm = new JButton("in cm");
        JLabel ergebnis = new JLabel("?", SwingConstants.CENTER);

        inCm.addActionListener(e -> {
            double m = Double.parseDouble(meter.getText());
            ergebnis.setText((m * 100) + " cm");
        });

        fenster.add(meter);
        fenster.add(inCm);
        fenster.add(ergebnis);
        fenster.setVisible(true);
    }
}
```

Zusatz: Ein vierter Knopf **in Fuß** rechnet in die englische Einheit um. Ein Fuß sind 0.3048 m.

::: ludwig
Tick im [Zahnrad](#zeige-einstellungen) **Echtes Java (mit Swing)** an. Für „abc“ im Feld brauchst du in jedem Zuhörer ein try/catch mit `NumberFormatException`, wie beim Taschenrechner.
:::
