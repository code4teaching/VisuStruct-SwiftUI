---
titel: Ein Taschenrechner
bereich: Fenster mit Swing
kurz: Zwei Spalten mit GridLayout, vier Rechenknöpfe und die Division durch 0 abfangen.
---

## Das Ziel

Wir bauen einen kleinen Taschenrechner: zwei Textfelder für die Zahlen, vier Knöpfe **+**, **-**, **\*** und **/** und eine Zeile für das Ergebnis.

Neu sind diesmal **zwei Spalten** im GridLayout und **mehrere Knöpfe**, die alle mit denselben Textfeldern rechnen.

Schalte im [Zahnrad](#zeige-einstellungen) **Echtes Java (mit Swing)** ein.

## Zwei Spalten

Bisher stand mit `GridLayout(0, 1)` alles untereinander. Mit `GridLayout(0, 2)` gibt es zwei Spalten. Die Bausteine füllen die Zellen in der Reihenfolge der `add`-Zeilen, immer erst links, dann rechts:

| links | rechts |
|---|---|
| Erste Zahl: | Textfeld |
| Zweite Zahl: | Textfeld |
| + | - |
| \* | / |
| Ergebnis: | ? |

Die Beschriftungen links brauchst du später nicht mehr. Du kannst sie deshalb direkt in `add` bauen, ohne Variable:

```
fenster.add(new JLabel("Erste Zahl:"));
fenster.add(feld1);
```

## Das Fenster mit dem ersten Knopf

```
import javax.swing.*;
import java.awt.*;

public class Rechner {
    public static void main(String[] args) {
        JFrame fenster = new JFrame("Rechner");
        fenster.setSize(280, 220);
        fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        fenster.setLayout(new GridLayout(0, 2));

        JTextField feld1 = new JTextField();
        JTextField feld2 = new JTextField();
        JButton plus = new JButton("+");
        JButton minus = new JButton("-");
        JButton mal = new JButton("*");
        JButton geteilt = new JButton("/");
        JLabel ergebnis = new JLabel("?");

        plus.addActionListener(e -> {
            int a = Integer.parseInt(feld1.getText());
            int b = Integer.parseInt(feld2.getText());
            ergebnis.setText("" + (a + b));
        });

        fenster.add(new JLabel("Erste Zahl:"));
        fenster.add(feld1);
        fenster.add(new JLabel("Zweite Zahl:"));
        fenster.add(feld2);
        fenster.add(plus);
        fenster.add(minus);
        fenster.add(mal);
        fenster.add(geteilt);
        fenster.add(new JLabel("Ergebnis:"));
        fenster.add(ergebnis);
        fenster.setVisible(true);
    }
}
```

Tippe 3 und 4 ein und klicke auf +. Unten steht 7.

::: ludwig
Achte auf die Klammern in `"" + (a + b)`. Ohne sie rechnet Java von links nach rechts: `"" + a` ergibt den Text „3“, und `"3" + b` hängt die 4 hinten an. Heraus kommt „34“ statt 7. Die Klammer sorgt dafür, dass zuerst gerechnet wird.
:::

## Die anderen drei Knöpfe

Die Knöpfe -, \* und / funktionieren genauso. Nur das Rechenzeichen in der letzten Zeile ändert sich:

```
minus.addActionListener(e -> {
    int a = Integer.parseInt(feld1.getText());
    int b = Integer.parseInt(feld2.getText());
    ergebnis.setText("" + (a - b));
});
```

Bei / gibt es zwei Besonderheiten:

- Mit `int` schneidet Java beim Teilen die Nachkommastellen ab. 7 / 2 ergibt 3.
- Bei 0 als zweiter Zahl wirft Java eine `ArithmeticException`, wie bei der Aufgabe „Sicher teilen“ in Lektion 22.

## Division durch 0 abfangen

```
geteilt.addActionListener(e -> {
    int a = Integer.parseInt(feld1.getText());
    int b = Integer.parseInt(feld2.getText());
    try {
        ergebnis.setText("" + (a / b));
    } catch (ArithmeticException fehler) {
        ergebnis.setText("Nicht durch 0!");
    }
});
```

::: angeberwissen
Mit `double` und `Double.parseDouble(…)` gibt es Nachkommastellen: 7 / 2 ergibt 3.5. Dafür wirft Java bei Kommazahlen keine Exception beim Teilen durch 0. Das Ergebnis heißt dann `Infinity`, also „unendlich“.
:::

## Profiwissen: eine eigene Methode

Das steht nicht im Lehrplan, macht den Code aber kürzer.

::: angeberwissen
Jeder Zuhörer liest dieselben zwei Felder. Diese Wiederholung kannst du in eine eigene Methode auslagern, ein Unterprogramm wie in Lektion 18. Sie steht in der Klasse neben `main`:

`static int zahl(JTextField feld) { return Integer.parseInt(feld.getText()); }`

Im Zuhörer heißt es dann nur noch `ergebnis.setText("" + (zahl(feld1) + zahl(feld2)));`.
:::

## Spiel: Was zeigt der Rechner?

::: spiel frage
titel: Spiel: Was zeigt der Rechner?
intro: Ludwig hat am Taschenrechner geschraubt. Lies den Zuhörer und sag vorher, was im Ergebnis steht. Sechs Runden.

runde:
    plus.addActionListener(e -> {
        int a = Integer.parseInt(feld1.getText());
        int b = Integer.parseInt(feld2.getText());
        ergebnis.setText("" + a + b);
    });
frage: Du tippst 3 und 4 und klickst auf +. Was steht im Ergebnis?
- 7
- [x] 34
- 12
> Ohne Klammern rechnet Java von links nach rechts: `"" + 3` ist der Text „3“, und `+ 4` hängt die 4 an.

runde:
    mal.addActionListener(e -> {
        int a = Integer.parseInt(feld1.getText());
        int b = Integer.parseInt(feld2.getText());
        ergebnis.setText("" + a * b);
    });
frage: Du tippst 3 und 4 und klickst auf *. Was steht im Ergebnis?
- 34
- [x] 12
- 7
> Punkt vor Strich gilt auch hier: Erst rechnet Java 3 * 4, dann hängt es die 12 an den Text. Beim Plus fehlt dieser Vorrang, darum braucht es dort die Klammern.

runde:
    geteilt.addActionListener(e -> {
        int a = Integer.parseInt(feld1.getText());
        int b = Integer.parseInt(feld2.getText());
        ergebnis.setText("" + (a / b));
    });
frage: Du tippst 7 und 2 und klickst auf /. Was steht im Ergebnis?
- 3.5
- [x] 3
- 4
> Mit `int` schneidet Java die Nachkommastellen ab. Es wird nicht gerundet.

runde:
    geteilt.addActionListener(e -> {
        int a = Integer.parseInt(feld1.getText());
        int b = Integer.parseInt(feld2.getText());
        try {
            ergebnis.setText("" + (a / b));
        } catch (ArithmeticException fehler) {
            ergebnis.setText("Nicht durch 0!");
        }
    });
frage: Du tippst 8 und 0 und klickst auf /. Was steht im Ergebnis?
- 0
- [x] Nicht durch 0!
- Infinity
> Bei `int` wirft das Teilen durch 0 eine ArithmeticException, und `catch` schreibt den Hinweis.

runde:
    geteilt.addActionListener(e -> {
        double a = Double.parseDouble(feld1.getText());
        double b = Double.parseDouble(feld2.getText());
        ergebnis.setText("" + (a / b));
    });
frage: Du tippst 7 und 2 und klickst auf /. Was steht im Ergebnis?
- 3
- [x] 3.5
- 3.0
> Mit `double` bleiben die Nachkommastellen erhalten.

runde:
    geteilt.addActionListener(e -> {
        double a = Double.parseDouble(feld1.getText());
        double b = Double.parseDouble(feld2.getText());
        try {
            ergebnis.setText("" + (a / b));
        } catch (ArithmeticException fehler) {
            ergebnis.setText("Nicht durch 0!");
        }
    });
frage: Du tippst 8 und 0 und klickst auf /. Was steht im Ergebnis?
- Nicht durch 0!
- [x] Infinity
- 0.0
> Bei `double` gibt es keine Exception. Das Ergebnis ist `Infinity`, also „unendlich“, und das `catch` kommt nie dran.
:::

## Aufgabe: Taschenrechner

Baue den Rechner fertig:

- alle vier Knöpfe rechnen,
- / meldet „Nicht durch 0!“ statt abzustürzen,
- steht in einem Feld „abc“ oder nichts, erscheint „Bitte zwei Zahlen eingeben“.

Zusatz: Ein fünfter Knopf **C** leert beide Felder und setzt das Ergebnis wieder auf „?“.

::: ludwig
Für „abc“ brauchst du in jedem Zuhörer ein try/catch mit `NumberFormatException`. Hinter einem `try` dürfen auch zwei `catch` stehen, einer für `NumberFormatException` und einer für `ArithmeticException`. Ein leeres Feld liefert übrigens den Text `""`, und auch der ist keine Zahl.
:::

## Checkliste

::: checkliste
- Ich kann mit GridLayout(0, 2) zwei Spalten bauen. → Zwei Spalten
- Ich weiß, warum "" + (a + b) Klammern braucht. → Das Fenster mit dem ersten Knopf
- Alle vier Rechenknöpfe funktionieren. → Die anderen drei Knöpfe
- Mein Rechner stürzt bei 0 und bei „abc“ nicht ab. → Aufgabe: Taschenrechner
:::

## Wissenstest

::: quiz
? a ist 3 und b ist 4. Was ergibt "" + a + b?
- [ ] 7
- [x] 34
- [ ] Einen Fehler
> Java rechnet von links nach rechts: Erst entsteht der Text "3", dann wird die 4 angehängt.

? Was ergibt 7 / 2 mit int?
- [ ] 3.5
- [x] 3
- [ ] 4

? In welcher Reihenfolge füllt GridLayout(0, 2) die Zellen?
- [x] Zeile für Zeile, jeweils erst links, dann rechts
- [ ] Spalte für Spalte, erst ganz links von oben nach unten
- [ ] Zufällig
:::
