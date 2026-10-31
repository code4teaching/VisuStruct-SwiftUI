---
titel: Notenrechner im Fenster
bereich: Fenster mit Swing
kurz: Punkte eingeben, mit else if die Note bestimmen und falsche Eingaben abfangen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- mit else if Punkte in eine Note umrechnen
- die Note im Fenster anzeigen
- „abc“ und Punkte außerhalb von 0 bis 100 abfangen und melden
- ein Programm an den Grenzen testen, zum Beispiel mit 92 und 91
:::

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

```java
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

Du kannst diesen Teil ohne Fenster im Bereich [Code](#zeige-codelive) ausprobieren. Schreib `int punkte = 85;` davor und `System.out.println("Note: " + note);` dahinter. Das Struktogramm zeigt dir die verschachtelten Verzweigungen.

## Das Fenster

```java
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

```java
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

## Spiel: Welche Note?

::: spiel frage
titel: Spiel: Welche Note?
intro: Ludwig hat Notenrechner gebaut, aber nicht alle sind richtig. Rechne nach, welche Note herauskommt. Sechs Runden.

runde:
    if (punkte >= 92) {
        note = 1;
    } else if (punkte >= 81) {
        note = 2;
    } else if (punkte >= 67) {
        note = 3;
    } else {
        note = 4;
    }
frage: punkte ist 81. Welche Note kommt heraus?
- 1
- [x] 2
- 3
> 81 >= 92 ist falsch, 81 >= 81 ist wahr. Die Grenze gehört noch zur 2.

runde:
    if (punkte >= 92) {
        note = 1;
    } else if (punkte >= 81) {
        note = 2;
    } else if (punkte >= 67) {
        note = 3;
    } else if (punkte >= 50) {
        note = 4;
    } else {
        note = 5;
    }
frage: punkte ist 66. Welche Note kommt heraus?
- 3
- [x] 4
- 5
> 66 >= 67 ist knapp falsch, 66 >= 50 ist wahr. Also Note 4.

runde:
    if (punkte >= 50) {
        note = 4;
    } else if (punkte >= 92) {
        note = 1;
    } else {
        note = 6;
    }
frage: punkte ist 95. Welche Note kommt heraus?
- 1
- [x] 4
- 6
> Die erste wahre Bedingung gewinnt. 95 >= 50 ist schon wahr, die 1 wird nie erreicht. Deshalb prüft man von den hohen Punkten nach unten.

runde:
    note = 6;
    if (punkte >= 30) {
        note = 5;
    }
    if (punkte >= 50) {
        note = 4;
    }
frage: punkte ist 70. Welche Note steht danach in note?
- 6
- 5
- [x] 4
> Ohne `else` wird jedes `if` geprüft. Beide sind wahr, das letzte setzt die Note 4.

runde:
    // note ist schon berechnet
    if (punkte < 0 || punkte > 100) {
        ergebnis.setText("Bitte 0 bis 100 eingeben.");
    } else {
        ergebnis.setText("Note: " + note);
    }
frage: Im Textfeld steht 100. Was zeigt das Fenster?
- [x] Note: 1
- Bitte 0 bis 100 eingeben.
- Das ist keine Zahl.
> 100 > 100 ist falsch. 100 Punkte sind also gültig und ergeben die Note 1.

runde:
    // note ist schon berechnet
    if (punkte < 0 && punkte > 100) {
        ergebnis.setText("Bitte 0 bis 100 eingeben.");
    } else {
        ergebnis.setText("Note: " + note);
    }
frage: Im Textfeld steht 150. Was zeigt das Fenster?
- Bitte 0 bis 100 eingeben.
- [x] eine Note, obwohl 150 ungültig ist
- Das ist keine Zahl.
> Mit `&&` müssten die Punkte gleichzeitig unter 0 und über 100 sein. Das geht nie, also warnt das Programm nie. Richtig ist `||`.
:::

## Aufgabe: Notenrechner

Baue den Notenrechner zusammen, mit beiden Prüfungen aus dem letzten Schritt. Teste ihn mit 92, 91, 0, 100, 101 und „zehn“.

Zusatz: Schreib die Note zusätzlich als Wort hin, zum Beispiel „Note: 2 (gut)“. Die Wörter sind sehr gut, gut, befriedigend, ausreichend, mangelhaft und ungenügend.

::: ludwig
Teste immer die Grenzen: 92 muss eine 1 sein, 91 eine 2. An den Grenzen stecken die meisten Fehler, zum Beispiel `>` statt `>=`.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann mit else if Punkte in eine Note umrechnen. → Der Notenschlüssel
- Ich kann die Note im Fenster anzeigen. → Das Fenster
- Ich kann „abc“ und Punkte außerhalb von 0 bis 100 abfangen und melden. → Falsche Eingaben abfangen
- Ich kann ein Programm an den Grenzen testen, zum Beispiel mit 92 und 91. → Aufgabe: Notenrechner
:::

## Wissenstest

::: quiz
? Welche Note ergibt der Schlüssel bei 67 Punkten?
→ Der Notenschlüssel
- [ ] 2
- [x] 3
- [ ] 4
> 67 ist die untere Grenze für die 3.

? Warum reicht in jeder Bedingung die untere Grenze?
→ Der Notenschlüssel
- [x] Weil else if die oberen Fälle schon vorher aussortiert hat
- [ ] Weil Java obere Grenzen nicht kennt
- [ ] Weil die Punkte immer 100 sind

? Welche Bedingung erkennt ungültige Punkte?
→ Falsche Eingaben abfangen
- [ ] punkte < 0 && punkte > 100
- [x] punkte < 0 || punkte > 100
- [ ] punkte >= 0 || punkte <= 100
> Eine Zahl kann nicht gleichzeitig kleiner als 0 und größer als 100 sein, deshalb braucht es oder.
:::
