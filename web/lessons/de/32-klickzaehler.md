---
titel: Klickzähler mit Reset
bereich: Fenster mit Swing
kurz: Zwei Knöpfe ändern dieselbe Zahl: eine Variable für die ganze Klasse anlegen.
---

## Das Ziel

Ein Fenster zählt Klicks: Oben steht die Zahl, darunter zwei Knöpfe. **+1** zählt eins hoch, **Reset** setzt die Zahl wieder auf 0.

Neu ist diesmal: Zwei Knöpfe arbeiten mit **derselben** Zahl. Dafür brauchst du eine Variable, die beide Zuhörer kennen.

Schalte im [Zahnrad](#zeige-einstellungen) **Echtes Java (mit Swing)** ein.

## Der erste Versuch

Naheliegend wäre, die Zahl wie gewohnt in `main` anzulegen und im Zuhörer hochzuzählen:

```java
int anzahl = 0;
knopf.addActionListener(e -> {
    anzahl++;
    zahl.setText("" + anzahl);
});
```

Führst du das mit echtem Java aus, meldet der Compiler einen Fehler:

```
local variables referenced from a lambda expression must be final or effectively final
```

::: ludwig
Der Zuhörer läuft erst später, bei jedem Klick, wenn `main` längst fertig ist. Deshalb darf er die Variablen aus `main` zwar lesen, aber nicht verändern. Java besteht darauf: Eine Variable aus `main`, die im Pfeil vorkommt, muss gleich bleiben. Für eine Zahl, die sich bei jedem Klick ändert, brauchen wir einen anderen Platz.
:::

## Eine Variable für die ganze Klasse

Die Lösung: Die Variable kommt **nicht** in `main`, sondern direkt in die Klasse, über `main`. Dann gehört sie der ganzen Klasse, und jeder Zuhörer darf sie ändern:

```java
public class Zaehler {
    static int anzahl = 0;

    public static void main(String[] args) {
        // hier wie gewohnt das Fenster
    }
}
```

- `static` heißt: Die Variable gehört zur Klasse selbst. Weil `main` auch `static` ist, braucht es das hier.
- Eine solche Variable nennt man **Attribut** der Klasse. Sie lebt so lange wie das Programm, nicht nur so lange wie `main`.

## Das ganze Programm

```java
import javax.swing.*;
import java.awt.*;

public class Zaehler {
    static int anzahl = 0;

    public static void main(String[] args) {
        JFrame fenster = new JFrame("Klickzähler");
        fenster.setSize(250, 200);
        fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        fenster.setLayout(new GridLayout(0, 1));

        JLabel zahl = new JLabel("0", SwingConstants.CENTER);
        JButton plus = new JButton("+1");
        JButton reset = new JButton("Reset");

        plus.addActionListener(e -> {
            anzahl++;
            zahl.setText("" + anzahl);
        });
        reset.addActionListener(e -> {
            anzahl = 0;
            zahl.setText("0");
        });

        fenster.add(zahl);
        fenster.add(plus);
        fenster.add(reset);
        fenster.setVisible(true);
    }
}
```

`SwingConstants.CENTER` setzt den Text der Beschriftung in die Mitte. Klicke ein paarmal auf +1 und dann auf Reset.

::: angeberwissen
Mit `zahl.setFont(new Font("SansSerif", Font.BOLD, 48));` wird die Zahl groß und fett. `Font` kommt aus `java.awt`, das du schon importiert hast.
:::

## Spiel: Wer zählt mit?

::: spiel zuhoerer
titel: Spiel: Wer zählt mit?
intro: Jetzt rechnen die Zuhörer mit der Variable aus der Klasse. Ludwig zeigt dir Code, Fenster und die Klicks. Welche Zahl steht am Ende da? Danach spielt Ludwig die Klicks ab.
frage: Was steht nach den Klicks in der Beschriftung?

runde:
    static int anzahl = 0;
    JLabel zahl = new JLabel("0");
    JButton plus = new JButton("+1");
    plus.addActionListener(e -> {
        anzahl++;
        zahl.setText("" + anzahl);
    });
klicks: +1, +1, +1
- 1
- [x] 3
- 0
> Die Variable steht in der Klasse und behält ihren Wert zwischen den Klicks. Jeder Klick zählt eins hoch: 1, 2, 3.

runde:
    static int anzahl = 0;
    JLabel zahl = new JLabel("0");
    JButton plus = new JButton("+1");
    JButton reset = new JButton("Reset");
    plus.addActionListener(e -> {
        anzahl++;
        zahl.setText("" + anzahl);
    });
    reset.addActionListener(e -> {
        anzahl = 0;
        zahl.setText("0");
    });
klicks: +1, +1, Reset, +1
- 3
- 0
- [x] 1
> Nach zwei Klicks steht 2 da. Reset setzt die Variable auf 0, und der letzte Klick zählt wieder auf 1.

runde:
    static int anzahl = 0;
    JLabel zahl = new JLabel("0");
    JButton plus = new JButton("+1");
    plus.addActionListener(e -> anzahl++);
klicks: +1, +1
- 2
- [x] 0
- 1
> Die Variable ist danach 2, aber niemand schreibt sie in die Beschriftung. Ohne `zahl.setText(…)` zeigt das Fenster weiter 0. Rechnen und Anzeigen sind zwei verschiedene Dinge.

runde:
    static int anzahl = 0;
    JLabel zahl = new JLabel("Klicks: 0");
    JButton plus = new JButton("+1");
    plus.addActionListener(e -> {
        anzahl++;
        zahl.setText("Klicks: " + anzahl + 1);
    });
klicks: +1
- Klicks: 2
- Klicks: 1
- [x] Klicks: 11
> Die Klammerfalle: Java rechnet von links nach rechts. `"Klicks: " + anzahl` ergibt den Text „Klicks: 1“, und `+ 1` hängt eine weitere 1 an.

runde:
    static int anzahl = 0;
    JLabel zahl = new JLabel("0");
    JButton eins = new JButton("+1");
    JButton zehn = new JButton("+10");
    eins.addActionListener(e -> {
        anzahl++;
        zahl.setText("" + anzahl);
    });
    zehn.addActionListener(e -> {
        anzahl += 10;
        zahl.setText("" + anzahl);
    });
klicks: +10, +1, +10
- 12
- [x] 21
- 111
> Beide Zuhörer ändern dieselbe Variable: 10, dann 11, dann 21. `anzahl += 10` ist die Kurzform von `anzahl = anzahl + 10`.
:::

## Aufgabe: Klickzähler

Baue den Klickzähler nach und erweitere ihn:

- ein Knopf **−1**, der eins herunterzählt,
- die Zahl soll nie unter 0 fallen. Steht sie auf 0, passiert bei −1 nichts.

::: ludwig
Für „nie unter 0“ brauchst du im Zuhörer von −1 ein `if`: Nur wenn `anzahl > 0` ist, wird heruntergezählt.
:::

## Checkliste

::: checkliste
- Ich weiß, warum ein Zuhörer eine Variable aus main nicht ändern darf. → Der erste Versuch
- Ich kann eine static-Variable in der Klasse anlegen. → Eine Variable für die ganze Klasse
- Zwei Knöpfe ändern bei mir dieselbe Zahl. → Das ganze Programm
- Mein Zähler hat −1 und fällt nie unter 0. → Aufgabe: Klickzähler
:::

## Wissenstest

::: quiz
? Warum darf der Zuhörer die Variable anzahl aus main nicht verändern?
- [ ] Weil Zahlen in Swing nicht erlaubt sind
- [x] Weil der Zuhörer erst später läuft und Java Variablen aus main im Pfeil nicht verändern lässt
- [ ] Weil anzahl zu groß wird

? Wo steht static int anzahl = 0;?
- [ ] In main, ganz oben
- [x] In der Klasse, außerhalb von main
- [ ] Im Zuhörer

? Was macht SwingConstants.CENTER bei new JLabel("0", SwingConstants.CENTER)?
- [x] Es setzt den Text in die Mitte der Beschriftung.
- [ ] Es setzt das Fenster in die Mitte des Bildschirms.
- [ ] Es macht die Schrift größer.
:::
