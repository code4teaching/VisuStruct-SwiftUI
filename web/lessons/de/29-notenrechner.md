---
titel: Notenrechner im Fenster
bereich: Fenster mit Swing
kurz: Punkte eingeben, mit else if die Note bestimmen und falsche Eingaben abfangen.
---

## Das Ziel

Ein Fenster rechnet Punkte in eine Note um: Du tippst die Punkte einer Klassenarbeit ein (0 bis 100), klickst auf **Note berechnen**, und unten steht die Note.

Diesmal kommt kein neuer Swing-Baustein dazu. Neu ist, dass du alles Bisherige kombinierst: Textfeld, Knopf, `else if` aus Lektion 20 und try/catch aus Lektion 22.

Schalte im [Zahnrad](#zeige-einstellungen) **Echtes Java (mit Swing)** ein.

## Der Notenschlüssel

Wir nehmen den Notenschlüssel der IHK-Prüfungen:

| Punkte | Note |
|---|---|
| 92 bis 100 | 1 |
| 81 bis 91 | 2 |
| 67 bis 80 | 3 |
| 50 bis 66 | 4 |
| 30 bis 49 | 5 |
| 0 bis 29 | 6 |

Mit `else if` prüfst du von oben nach unten. Die erste Bedingung, die zutrifft, gewinnt:

```
int note;
if (punkte >= 92) {
    note = 1;
} else if (punkte >= 81) {
    note = 2;
} else if (punkte >= 67) {
    note = 3;
} else if (punkte >= 50) {
    note = 4;
} else if (punkte >= 30) {
    note = 5;
} else {
    note = 6;
}
```

::: ludwig
Bei 85 Punkten ist `punkte >= 92` falsch, aber `punkte >= 81` wahr. Also Note 2, und die restlichen Bedingungen werden gar nicht mehr geprüft. Deshalb reicht jeweils die untere Grenze.
:::

Du kannst diesen Teil ohne Fenster im Bereich [Programmieren](#zeige-codelive) ausprobieren. Schreib `int punkte = 85;` davor und `System.out.println("Note: " + note);` dahinter. Das Struktogramm zeigt dir die verschachtelten Verzweigungen.

## Das Fenster

```
import javax.swing.*;
import java.awt.*;

public class Notenrechner {
    public static void main(String[] args) {
        JFrame fenster = new JFrame("Notenrechner");
        fenster.setSize(260, 180);
        fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        fenster.setLayout(new GridLayout(0, 1));

        JLabel frage = new JLabel("Punkte (0 bis 100):");
        JTextField feld = new JTextField();
        JButton knopf = new JButton("Note berechnen");
        JLabel ergebnis = new JLabel("Note: ?");

        knopf.addActionListener(e -> {
            int punkte = Integer.parseInt(feld.getText());
            int note;
            if (punkte >= 92) {
                note = 1;
            } else if (punkte >= 81) {
                note = 2;
            } else if (punkte >= 67) {
                note = 3;
            } else if (punkte >= 50) {
                note = 4;
            } else if (punkte >= 30) {
                note = 5;
            } else {
                note = 6;
            }
            ergebnis.setText("Note: " + note);
        });

        fenster.add(frage);
        fenster.add(feld);
        fenster.add(knopf);
        fenster.add(ergebnis);
        fenster.setVisible(true);
    }
}
```

Probiere 100, 85, 50 und 12 aus.

## Falsche Eingaben abfangen

Zwei Dinge können noch schiefgehen:

1. Jemand tippt „abc“. Dann wirft `Integer.parseInt` eine `NumberFormatException`.
2. Jemand tippt 150 oder −5. Das ist zwar eine Zahl, aber keine gültige Punktzahl.

Den ersten Fall fängst du mit try/catch ab, den zweiten mit einem `if` vor der Notenberechnung:

```
knopf.addActionListener(e -> {
    try {
        int punkte = Integer.parseInt(feld.getText());
        if (punkte < 0 || punkte > 100) {
            ergebnis.setText("Bitte 0 bis 100 eingeben.");
        } else {
            // hier die Notenberechnung von oben
        }
    } catch (NumberFormatException fehler) {
        ergebnis.setText("Das ist keine Zahl.");
    }
});
```

::: ludwig
`||` heißt „oder“ (Lektion 9). Die Bedingung ist wahr, wenn die Punkte zu klein **oder** zu groß sind.
:::

## Aufgabe: Notenrechner

Baue den Notenrechner zusammen, mit beiden Prüfungen aus dem letzten Schritt. Teste ihn mit 92, 91, 0, 100, 101 und „zehn“.

Zusatz: Schreib die Note zusätzlich als Wort hin, zum Beispiel „Note: 2 (gut)“. Die Wörter sind sehr gut, gut, befriedigend, ausreichend, mangelhaft und ungenügend.

::: ludwig
Teste immer die Grenzen: 92 muss eine 1 sein, 91 eine 2. An den Grenzen stecken die meisten Fehler, zum Beispiel `>` statt `>=`.
:::

## Checkliste

::: checkliste
- Ich kann mit else if Punkte in eine Note umrechnen. → Der Notenschlüssel
- Ich kann die Note im Fenster anzeigen. → Das Fenster
- Mein Programm meldet „abc“ und Punkte außerhalb von 0 bis 100. → Falsche Eingaben abfangen
- Ich habe die Grenzen 92 und 91 getestet. → Aufgabe: Notenrechner
:::

## Wissenstest

::: quiz
? Welche Note ergibt der Schlüssel bei 67 Punkten?
- [ ] 2
- [x] 3
- [ ] 4
> 67 ist die untere Grenze für die 3.

? Warum reicht in jeder Bedingung die untere Grenze?
- [x] Weil else if die oberen Fälle schon vorher aussortiert hat
- [ ] Weil Java obere Grenzen nicht kennt
- [ ] Weil die Punkte immer 100 sind

? Welche Bedingung erkennt ungültige Punkte?
- [ ] punkte < 0 && punkte > 100
- [x] punkte < 0 || punkte > 100
- [ ] punkte >= 0 || punkte <= 100
> Eine Zahl kann nicht gleichzeitig kleiner als 0 und größer als 100 sein, deshalb braucht es oder.
:::
