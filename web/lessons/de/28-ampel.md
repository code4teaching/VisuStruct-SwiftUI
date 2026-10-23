---
titel: Eine Ampel mit Farben
bereich: Fenster mit Swing
kurz: Hintergrundfarben setzen und mit einer Zustandsvariable eine Ampel weiterschalten.
---

## Das Ziel

Wir bauen eine Ampel: Eine große Fläche leuchtet rot. Bei jedem Klick auf **Weiter** schaltet sie um: Rot, Grün, Gelb und wieder Rot.

Neu sind diesmal **Farben** und ein **Zustand**: Das Programm muss sich merken, welche Farbe gerade dran ist.

Schalte im [Zahnrad](#zeige-einstellungen) **Echtes Java (mit Swing)** ein.

## Farben in Swing

Farben stehen in der Klasse `Color` aus `java.awt`. Fertige Farben sind zum Beispiel `Color.RED`, `Color.GREEN`, `Color.YELLOW`, `Color.ORANGE` und `Color.WHITE`.

Eine Beschriftung färbst du so:

```
JLabel licht = new JLabel("", SwingConstants.CENTER);
licht.setOpaque(true);
licht.setBackground(Color.RED);
```

- `setBackground(…)` legt die Hintergrundfarbe fest.
- `setOpaque(true)` braucht ein `JLabel` dazu. Ohne diese Zeile ist der Hintergrund durchsichtig, und die Farbe bleibt unsichtbar.

::: ludwig
`opaque` ist englisch für „undurchsichtig“. Eine Beschriftung ist normalerweise durchsichtig wie Schrift auf einer Glasscheibe. Erst mit `setOpaque(true)` bekommt sie eine eigene Fläche, die man anmalen kann.
:::

## Sich die Farbe merken

Damit die Ampel weiß, was als Nächstes kommt, merkt sie sich ihren Zustand in einer Zahl: 0 heißt Rot, 1 heißt Grün, 2 heißt Gelb. Wie beim Klickzähler aus Lektion 27 steht die Variable in der Klasse, damit der Zuhörer sie ändern darf:

```
static int phase = 0;
```

Bei jedem Klick geht die Phase eins weiter. Nach Gelb (2) kommt wieder Rot (0):

```
weiter.addActionListener(e -> {
    phase++;
    if (phase > 2) {
        phase = 0;
    }
    if (phase == 0) {
        licht.setBackground(Color.RED);
    } else if (phase == 1) {
        licht.setBackground(Color.GREEN);
    } else {
        licht.setBackground(Color.YELLOW);
    }
});
```

## Das ganze Programm

```
import javax.swing.*;
import java.awt.*;

public class Ampel {
    static int phase = 0;

    public static void main(String[] args) {
        JFrame fenster = new JFrame("Ampel");
        fenster.setSize(200, 300);
        fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        fenster.setLayout(new BorderLayout());

        JLabel licht = new JLabel("", SwingConstants.CENTER);
        licht.setOpaque(true);
        licht.setBackground(Color.RED);
        JButton weiter = new JButton("Weiter");

        weiter.addActionListener(e -> {
            phase++;
            if (phase > 2) {
                phase = 0;
            }
            if (phase == 0) {
                licht.setBackground(Color.RED);
            } else if (phase == 1) {
                licht.setBackground(Color.GREEN);
            } else {
                licht.setBackground(Color.YELLOW);
            }
        });

        fenster.add(licht, BorderLayout.CENTER);
        fenster.add(weiter, BorderLayout.SOUTH);
        fenster.setVisible(true);
    }
}
```

Hier kommt ein neues Layout zum Einsatz, das **BorderLayout**. Es hat fünf Plätze: `NORTH` (oben), `SOUTH` (unten), `WEST` (links), `EAST` (rechts) und `CENTER` (Mitte). Die Mitte bekommt allen Platz, der übrig bleibt. So wird das Licht groß, und der Knopf bleibt unten schmal.

::: angeberwissen
Das BorderLayout ist das Layout, das ein `JFrame` ohne eigenes Layout benutzt. Ein `add` ohne Platzangabe landet in `CENTER`. Deshalb lagen in Lektion 26 alle Bausteine übereinander.
:::

::: angeberwissen
Profis schreiben das Weiterschalten in einer Zeile: `phase = (phase + 1) % 3;`. Der Rest-Operator `%` liefert den Rest beim Teilen. 3 % 3 ist 0, also beginnt es nach 2 wieder bei 0.
:::

## Spiel: Wo landet der Knopf?

::: spiel layout
titel: Spiel: Wo landet der Knopf?
intro: Du kennst jetzt drei Layouts und das Fenster ganz ohne Layout. Ludwig zeigt dir Code mit den Knöpfen A, B, C … Wie sieht das Fenster aus? Tippe auf das richtige Bild.
frage: Wie sieht das Fenster aus?

runde:
    fenster.add(new JButton("A"));
    fenster.add(new JButton("B"));
    fenster.add(new JButton("C"));
- flow: A B C
- grid: A / B / C
- [x] border: C=C
> Ohne eigenes Layout landet jedes `add` in der Mitte, so groß wie das Fenster. Die drei liegen übereinander, man sieht nur den letzten: C.

runde:
    fenster.setLayout(new FlowLayout());
    fenster.add(new JButton("A"));
    fenster.add(new JButton("B"));
    fenster.add(new JButton("C"));
- [x] flow: A B C
- grid: A B C
- border: C=C
> FlowLayout setzt die Knöpfe in normaler Größe nebeneinander, wie Wörter in einer Zeile, und zentriert sie.

runde:
    fenster.setLayout(new GridLayout(0, 1));
    fenster.add(new JButton("A"));
    fenster.add(new JButton("B"));
    fenster.add(new JButton("C"));
- flow: A B C
- [x] grid: A / B / C
- grid: A B C
> Eine Spalte, so viele Zeilen wie nötig: alles untereinander, jede Zeile gleich hoch und so breit wie das Fenster.

runde:
    fenster.setLayout(new GridLayout(0, 2));
    fenster.add(new JButton("A"));
    fenster.add(new JButton("B"));
    fenster.add(new JButton("C"));
    fenster.add(new JButton("D"));
- grid: A C / B D
- [x] grid: A B / C D
- grid: A / B / C / D
> Zwei Spalten. Die Zellen werden Zeile für Zeile gefüllt, immer erst links, dann rechts: A B, dann C D.

runde:
    fenster.setLayout(new GridLayout(2, 3));
    fenster.add(new JButton("A"));
    fenster.add(new JButton("B"));
    fenster.add(new JButton("C"));
    fenster.add(new JButton("D"));
    fenster.add(new JButton("E"));
    fenster.add(new JButton("F"));
- grid: A B / C D / E F
- [x] grid: A B C / D E F
- flow: A B C D E F
> Erst kommen die Zeilen, dann die Spalten: 2 Zeilen mit je 3 Spalten.

runde:
    fenster.setLayout(new GridLayout(0, 2));
    fenster.add(new JButton("A"));
    fenster.add(new JButton("B"));
    fenster.add(new JButton("C"));
- [x] grid: A B / C
- grid: A B C
- grid: A / B C
> Zwei Spalten, drei Knöpfe: Die erste Zeile ist voll, in der zweiten steht C links, und rechts bleibt die Zelle leer.

runde:
    fenster.setLayout(new BorderLayout());
    fenster.add(new JButton("A"), BorderLayout.NORTH);
    fenster.add(new JButton("B"), BorderLayout.CENTER);
    fenster.add(new JButton("C"), BorderLayout.SOUTH);
- grid: A / B / C
- [x] border: N=A C=B S=C
- border: N=C C=B S=A
> NORTH ist oben, SOUTH unten. Die Mitte bekommt den ganzen übrigen Platz, darum ist B groß.

runde:
    fenster.setLayout(new BorderLayout());
    fenster.add(new JButton("A"), BorderLayout.WEST);
    fenster.add(new JButton("B"));
    fenster.add(new JButton("C"), BorderLayout.EAST);
- flow: A B C
- border: N=A C=B S=C
- [x] border: W=A C=B E=C
> WEST ist links, EAST rechts. B hat keine Platzangabe und landet deshalb in CENTER.
:::

## Aufgabe: Ampel

Baue die Ampel nach und mach sie echter. In Deutschland leuchten nach Rot kurz Rot und Gelb zusammen. Nimm deshalb eine vierte Phase dazu:

- 0: Rot
- 1: Rot-Gelb (nimm dafür `Color.ORANGE`)
- 2: Grün
- 3: Gelb

Zusatz: Schreib in jeder Phase zusätzlich mit `licht.setText(…)`, was die Ampel bedeutet, zum Beispiel „Stehen“ oder „Gehen“.

::: ludwig
Mit vier Phasen kommt nach 3 wieder 0. Pass also die Zahl in `if (phase > 2)` an.
:::

## Checkliste

::: checkliste
- Ich kann mit setOpaque und setBackground eine Beschriftung färben. → Farben in Swing
- Ich kann mir mit einer static-Variable einen Zustand merken. → Sich die Farbe merken
- Ich kann mit BorderLayout etwas groß in die Mitte und etwas schmal nach unten setzen. → Das ganze Programm
- Meine Ampel hat vier Phasen. → Aufgabe: Ampel
:::

## Wissenstest

::: quiz
? Warum bleibt die Farbe ohne setOpaque(true) unsichtbar?
- [ ] Weil Color.RED nicht existiert
- [x] Weil eine Beschriftung sonst durchsichtig ist
- [ ] Weil das Fenster zu klein ist

? Welcher Platz im BorderLayout bekommt den übrigen Platz?
- [ ] NORTH
- [ ] SOUTH
- [x] CENTER

? phase ist 2 und der Zuhörer führt phase++ und dann if (phase > 2) { phase = 0; } aus. Welchen Wert hat phase danach?
- [x] 0
- [ ] 2
- [ ] 3
> Nach phase++ ist sie 3, das ist größer als 2, also wird sie 0.
:::
