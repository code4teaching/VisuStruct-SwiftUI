---
titel: Zahl verdoppeln im Fenster
bereich: Fenster mit Swing
kurz: Beschriftung, Textfeld und Knopf mit einem GridLayout anordnen und mit dem Text im Textfeld rechnen.
---

## Das Ziel

Wir bauen ein kleines Rechenprogramm mit Fenster: Oben steht eine Beschriftung, darunter ein Textfeld und ein Knopf **Berechne**. Gibst du 2 ein und klickst, steht im Textfeld 4. Klickst du noch einmal, wird daraus 8, dann 16 und so weiter.

Dafür brauchst du zwei neue Bausteine:

- **JLabel**: eine Beschriftung, also einfacher Text im Fenster.
- **JTextField**: ein Textfeld, in das man etwas tippen kann.

Schalte wie in den letzten Lektionen im [Zahnrad](#zeige-einstellungen) **Echtes Java (mit Swing)** ein.

## Drei Bausteine ins Fenster

Wir legen alle drei Bausteine ins Fenster, genau wie den Knopf in Lektion 29:

```java
import javax.swing.*;

public class Verdoppeln {
    public static void main(String[] args) {
        JFrame fenster = new JFrame("Zahl verdoppeln");
        fenster.setSize(250, 150);
        fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JLabel beschriftung = new JLabel("Gib eine Zahl ein:");
        JTextField feld = new JTextField();
        JButton knopf = new JButton("Berechne");
        fenster.add(beschriftung);
        fenster.add(feld);
        fenster.add(knopf);

        fenster.setVisible(true);
    }
}
```

Führe das Programm aus. Hoppla: Man sieht nur den riesigen Knopf. Wo sind die Beschriftung und das Textfeld?

## Warum nur der Knopf zu sehen ist

::: ludwig
Erinnerst du dich an den Riesenknopf? Ein `JFrame` hat ohne eigenes Layout nur **einen** Platz: die Mitte. Jedes `add` legt den neuen Baustein genau dorthin, so groß wie das ganze Fenster. Die drei Bausteine landen also übereinander auf demselben Platz, und das Fenster zeigt nur den zuletzt hineingelegten: den Knopf. Benutzen kannst du das Programm so nicht.
:::

Die Lösung ist wieder ein Layout. Diesmal nehmen wir das **GridLayout**. Es teilt das Fenster in gleich große Zellen wie ein Gitter:

```java
fenster.setLayout(new GridLayout(0, 1));
```

Die beiden Zahlen sind Zeilen und Spalten. `0` Zeilen heißt „so viele wie nötig“, `1` Spalte heißt: alles untereinander. Für `GridLayout` brauchst du oben außerdem `import java.awt.*;`.

| Layout | So ordnet es an |
|---|---|
| ohne Layout | alles in die Mitte, übereinander |
| `FlowLayout` | nebeneinander wie Wörter, Zeilenumbruch wenn nötig |
| `GridLayout(0, 1)` | untereinander, jede Zeile gleich hoch |

## Das Fenster mit GridLayout

```java
import javax.swing.*;
import java.awt.*;

public class Verdoppeln {
    public static void main(String[] args) {
        JFrame fenster = new JFrame("Zahl verdoppeln");
        fenster.setSize(250, 150);
        fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        fenster.setLayout(new GridLayout(0, 1));

        JLabel beschriftung = new JLabel("Gib eine Zahl ein:");
        JTextField feld = new JTextField();
        JButton knopf = new JButton("Berechne");
        fenster.add(beschriftung);
        fenster.add(feld);
        fenster.add(knopf);

        fenster.setVisible(true);
    }
}
```

Jetzt stehen alle drei untereinander. Du kannst ins Textfeld tippen und den Knopf drücken. Rechnen tut das Programm aber noch nicht.

::: angeberwissen
Mit `new GridLayout(2, 3)` bekommst du 2 Zeilen mit je 3 Spalten, also 6 gleich große Zellen. So baut man zum Beispiel die Tasten eines Taschenrechners. Die Bausteine füllen die Zellen in der Reihenfolge der `add`-Zeilen, Zeile für Zeile von links nach rechts.
:::

## Mit dem Text im Textfeld rechnen

Beim Klick soll das Programm die Zahl aus dem Textfeld holen, verdoppeln und wieder hineinschreiben. Das machen drei Methoden:

- `feld.getText()` liefert den Text im Textfeld, zum Beispiel `"2"`.
- `Integer.parseInt(…)` macht daraus die Zahl 2. Das kennst du aus Lektion 22.
- `feld.setText(…)` schreibt einen neuen Text ins Textfeld.

Zusammen mit dem ActionListener aus Lektion 30 sieht das so aus:

```java
knopf.addActionListener(e -> {
    int zahl = Integer.parseInt(feld.getText());
    feld.setText("" + zahl * 2);
});
```

`setText` braucht einen Text. `"" + zahl * 2` hängt das Ergebnis an einen leeren Text und macht so aus der Zahl einen Text.

## Keine Zahl? Kein Absturz!

Tippe „abc“ ins Textfeld und klicke auf Berechne. Das Fenster bleibt, aber es passiert nichts, und in der [Konsole](#zeige-konsole) steht eine `NumberFormatException`. Aus Lektion 22 weißt du, was zu tun ist:

```java
knopf.addActionListener(e -> {
    try {
        int zahl = Integer.parseInt(feld.getText());
        feld.setText("" + zahl * 2);
    } catch (NumberFormatException fehler) {
        beschriftung.setText("Bitte eine ganze Zahl eingeben!");
    }
});
```

Statt eines Fehlers in der Konsole sieht man jetzt einen Hinweis im Fenster.

::: ludwig
Der Pfeil hat schon ein `e` für das Ereignis. Deshalb braucht die Exception im `catch` einen anderen Namen, hier `fehler`. Zwei Variablen mit demselben Namen erlaubt Java nicht.
:::

## Spiel: Was steht danach im Fenster?

::: spiel frage
titel: Spiel: Was steht danach im Fenster?
intro: Ludwig tippt etwas ins Textfeld und klickt auf Berechne. Lies den Zuhörer und sag vorher, was danach im Fenster steht. Sechs Runden.

runde:
    knopf.addActionListener(e -> {
        int zahl = Integer.parseInt(feld.getText());
        feld.setText("" + zahl * 2);
    });
frage: Im Textfeld steht 21. Was steht nach dem Klick darin?
- 2121
- [x] 42
- 21
> `parseInt` macht aus dem Text die Zahl 21. Das Doppelte ist 42.

runde:
    knopf.addActionListener(e -> {
        int zahl = Integer.parseInt(feld.getText());
        feld.setText("" + zahl * 2);
    });
frage: Im Textfeld steht 21. Du klickst zweimal. Was steht danach darin?
- 42
- [x] 84
- 4242
> Jeder Klick verdoppelt, was gerade im Feld steht: 21, 42, 84.

runde:
    knopf.addActionListener(e -> {
        feld.setText(feld.getText() + feld.getText());
    });
frage: Im Textfeld steht 21. Was steht nach dem Klick darin?
- 42
- [x] 2121
- 21
> Ohne `parseInt` bleibt es ein Text, und `+` hängt Texte aneinander.

runde:
    knopf.addActionListener(e -> {
        try {
            int zahl = Integer.parseInt(feld.getText());
            feld.setText("" + zahl * 2);
        } catch (NumberFormatException fehler) {
            beschriftung.setText("Bitte eine ganze Zahl eingeben!");
        }
    });
frage: Im Textfeld steht abc. Was passiert beim Klick?
- [x] Die Beschriftung zeigt „Bitte eine ganze Zahl eingeben!“
- Im Textfeld steht abcabc.
- Das Fenster stürzt ab.
> `parseInt` wirft eine NumberFormatException, und `catch` fängt sie ab.

runde:
    knopf.addActionListener(e -> {
        try {
            int zahl = Integer.parseInt(feld.getText());
            feld.setText("" + zahl * 2);
        } catch (NumberFormatException fehler) {
            beschriftung.setText("Bitte eine ganze Zahl eingeben!");
        }
    });
frage: Im Textfeld steht 2.5. Was passiert beim Klick?
- Im Textfeld steht 5.0.
- Im Textfeld steht 5.
- [x] Die Beschriftung zeigt „Bitte eine ganze Zahl eingeben!“
> `Integer.parseInt` kennt nur ganze Zahlen. 2.5 ist für ihn keine Zahl.

runde:
    knopf.addActionListener(e -> {
        int zahl = Integer.parseInt(feld.getText());
        feld.setText("" + zahl + zahl);
    });
frage: Im Textfeld steht 5. Was steht nach dem Klick darin?
- 10
- [x] 55
- 5
> `"" + zahl` ist schon ein Text, und das zweite `+` hängt die 5 noch einmal an. Mit `"" + (zahl + zahl)` wird zuerst gerechnet.
:::

## Aufgabe: Zahl verdoppeln

Baue das ganze Programm zusammen:

- ein Fenster mit dem Titel „Zahl verdoppeln“, 250 Pixel breit und 150 Pixel hoch,
- untereinander eine Beschriftung, ein Textfeld und ein Knopf „Berechne“,
- jeder Klick verdoppelt die Zahl im Textfeld: 2, 4, 8, 16, …
- bei „abc“ erscheint in der Beschriftung ein Hinweis statt eines Absturzes.

Zusatz: Ein zweiter Knopf „Halbieren“ teilt die Zahl durch 2. Was passiert bei 5?

::: ludwig
Der Knopf „Halbieren“ kommt als vierte Zeile ins GridLayout und bekommt seinen eigenen ActionListener. Bei `int` schneidet Java beim Teilen die Nachkommastellen ab.
:::

## Checkliste

::: checkliste
- Ich kann JLabel und JTextField ins Fenster legen. → Drei Bausteine ins Fenster
- Ich weiß, warum ohne Layout nur der letzte Baustein zu sehen ist. → Warum nur der Knopf zu sehen ist
- Ich kann mit GridLayout(0, 1) alles untereinander anordnen. → Das Fenster mit GridLayout
- Ich kann mit getText, Integer.parseInt und setText rechnen. → Mit dem Text im Textfeld rechnen
- Mein Programm stürzt bei „abc“ nicht ab. → Keine Zahl? Kein Absturz!
:::

## Wissenstest

::: quiz
? Warum ist ohne Layout nur der Knopf zu sehen?
- [ ] Weil Beschriftung und Textfeld fehlen
- [x] Weil alle Bausteine in der Mitte übereinander liegen und der letzte die anderen verdeckt
- [ ] Weil das Fenster zu klein ist

? Was bedeutet new GridLayout(0, 1)?
- [ ] Keine Zeile und eine Spalte, also ist das Fenster leer
- [x] So viele Zeilen wie nötig in einer Spalte, also alles untereinander
- [ ] Eine Zeile, alles nebeneinander

? Was liefert feld.getText()?
- [ ] Immer eine Zahl
- [x] Den Text im Textfeld
- [ ] Den Titel des Fensters
> Für eine Zahl brauchst du noch Integer.parseInt.

? Ordne jedem Baustein seine Aufgabe zu.
= JLabel -> Beschriftung
= JTextField -> Textfeld zum Tippen
= JButton -> Knopf
= GridLayout -> Anordnung im Gitter
:::
