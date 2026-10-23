---
titel: Innere Klassen
bereich: Fenster mit Swing
kurz: Einen Zuhörer als benannte innere Klasse, als anonyme Klasse und als Lambda schreiben und wissen, wer was sehen darf.
---

## Das Ziel

Den Klickzähler aus Lektion 32 kennst du schon. Heute schreibst du seinen Zuhörer auf **drei Arten**, die alle genau dasselbe tun:

1. als **benannte innere Klasse**, wie man es vor Java 8 meistens gemacht hat,
2. als **anonyme Klasse**, die du aus dem Profiwissen in Lektion 30 kennst,
3. als **Lambda** mit dem Pfeil, so wie bisher.

In fremdem Code, in Büchern und im Internet triffst du alle drei Schreibweisen. Nach dieser Lektion erkennst du sie.

Schalte im [Zahnrad](#zeige-einstellungen) **Echtes Java (mit Swing)** ein.

## Erinnerung: der Vertrag

Ein Zuhörer ist alles, was den Vertrag `ActionListener` erfüllt. Darin steht genau eine Methode:

```
public void actionPerformed(ActionEvent e)
```

Der Knopf ruft sie bei jedem Klick auf. Die drei Schreibweisen sind drei Wege, diese eine Methode zu liefern.

## 1. Die benannte innere Klasse

Eine **innere Klasse** steht innerhalb einer anderen Klasse. Sie hat einen Namen, hier `Plus`, und erfüllt den Vertrag mit `implements ActionListener`:

```
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class Zaehler {
    static int anzahl = 0;
    static JLabel zahl = new JLabel("0", SwingConstants.CENTER);

    static class Plus implements ActionListener {
        public void actionPerformed(ActionEvent e) {
            anzahl++;
            zahl.setText("" + anzahl);
        }
    }

    public static void main(String[] args) {
        JFrame fenster = new JFrame("Klickzähler");
        fenster.setSize(250, 200);
        fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        fenster.setLayout(new GridLayout(0, 1));

        JButton plus = new JButton("+1");
        JButton nochmal = new JButton("Auch +1");
        plus.addActionListener(new Plus());
        nochmal.addActionListener(new Plus());

        fenster.add(zahl);
        fenster.add(plus);
        fenster.add(nochmal);
        fenster.setVisible(true);
    }
}
```

- `new Plus()` erzeugt ein Objekt der Klasse `Plus`. Das ist der Zuhörer, den der Knopf bekommt.
- Weil die Klasse einen Namen hat, kannst du sie bei mehreren Knöpfen benutzen, hier bei `plus` und `nochmal`.
- Die Klasse steht **außerhalb** von `main`. Darum sieht sie nur, was in der Klasse `Zaehler` steht: `anzahl` und `zahl`. Deshalb ist `zahl` diesmal eine Variable der Klasse und nicht von `main`.
- `static class` brauchst du, weil `main` static ist. Ohne `static` meldet javac „non-static variable this cannot be referenced from a static context“.

## 2. Die anonyme Klasse

Brauchst du den Zuhörer nur an einer Stelle, kannst du die Klasse direkt dort schreiben, wo das Objekt gebraucht wird. Sie bekommt dann keinen Namen:

```
plus.addActionListener(new ActionListener() {
    public void actionPerformed(ActionEvent e) {
        anzahl++;
        zahl.setText("" + anzahl);
    }
});
```

- `new ActionListener() { … }` heißt: „ein neues Objekt, das den Vertrag ActionListener erfüllt, und zwar so: …“.
- Am Ende steht `});`: die geschweifte Klammer schließt die Klasse, die runde den Aufruf von `addActionListener`.
- Die anonyme Klasse steht **in** `main`. Sie sieht deshalb auch die Variablen von `main`, solange diese sich nicht mehr ändern.

## 3. Das Lambda

Das Lambda ist die Kurzform der anonymen Klasse, seit Java 8:

```
plus.addActionListener(e -> {
    anzahl++;
    zahl.setText("" + anzahl);
});
```

Weggelassen wird alles, was Java sowieso weiß: `new ActionListener()`, der Name `actionPerformed`, `public void` und der Typ `ActionEvent`. Übrig bleiben der Parameter `e`, der Pfeil und der Rumpf. Das geht nur, weil der Vertrag genau **eine** Methode hat.

## Die drei im Vergleich

| | benannte innere Klasse | anonyme Klasse | Lambda |
|---|---|---|---|
| hat einen Namen | ja, z. B. `Plus` | nein | nein |
| steht | in der Klasse, außerhalb von `main` | direkt beim Knopf | direkt beim Knopf |
| für mehrere Knöpfe | ja, `new Plus()` | nein | ja, in einer Variable (Lektion 37) |
| sieht Variablen von `main` | nein | ja, wenn sie sich nicht ändern | ja, wenn sie sich nicht ändern |
| Länge | am längsten | mittel | am kürzesten |

::: ludwig
Wenn sich eine Variable von `main` im Zuhörer ändern soll, wie `anzahl++`, muss sie in die Klasse, egal welche Schreibweise du nimmst. Das war das Problem aus Lektion 32.
:::

::: angeberwissen
Schau nach dem Übersetzen in den Ordner mit den `.class`-Dateien. Für jede Klasse legt javac eine Datei an: `Zaehler.class`, für die innere Klasse `Zaehler$Plus.class` und für die anonyme Klasse `Zaehler$1.class`. Weil sie keinen Namen hat, bekommt sie eine Nummer. Für ein Lambda gibt es keine eigene Datei, Java baut es erst beim Start.
:::

## Spiel: Welche Schreibweise?

::: spiel frage
titel: Spiel: Welche Schreibweise?
intro: Ludwig zeigt dir Zuhörer aus fremden Programmen. Welche Schreibweise ist das? Sechs Runden.
frage: Welche Schreibweise ist das?
antworten: benannte innere Klasse | anonyme Klasse | Lambda

runde:
    knopf.addActionListener(e -> text.setText("Hallo"));
richtig: Lambda
> Der Pfeil `->` verrät das Lambda.

runde:
    knopf.addActionListener(new ActionListener() {
        public void actionPerformed(ActionEvent e) {
            text.setText("Hallo");
        }
    });
richtig: anonyme Klasse
> `new ActionListener() {` und dahinter eine ganze Methode: Hier wird eine Klasse ohne Namen geschrieben.

runde:
    static class Gruss implements ActionListener {
        public void actionPerformed(ActionEvent e) {
            text.setText("Hallo");
        }
    }
richtig: benannte innere Klasse
> Die Klasse heißt `Gruss` und erfüllt den Vertrag mit `implements ActionListener`.

runde:
    knopf.addActionListener(new Gruss());
richtig: benannte innere Klasse
> `new Gruss()` erzeugt ein Objekt der Klasse `Gruss`. Die Klasse selbst steht woanders, sie hat einen Namen.

runde:
    ActionListener taste = e -> {
        anzeige.setText(anzeige.getText() + e.getActionCommand());
    };
richtig: Lambda
> Ein Lambda in einer Variable, wie beim Zahlenschloss in Lektion 37. Der Pfeil verrät es.

runde:
    ActionListener taste = new ActionListener() {
        public void actionPerformed(ActionEvent e) {
            anzeige.setText(anzeige.getText() + e.getActionCommand());
        }
    };
richtig: anonyme Klasse
> Auch eine anonyme Klasse kann in einer Variable stehen. Dann kann man sie wie das Lambda bei mehreren Knöpfen anmelden.
:::

## Aufgabe: Ein Zähler, drei Schreibweisen

Baue den Klickzähler mit drei Knöpfen:

- **+1** bekommt die benannte innere Klasse `Plus`.
- **-1** bekommt eine anonyme Klasse.
- **Reset** bekommt ein Lambda.

Probiere aus, ob alle drei Knöpfe wie erwartet zählen. Lass dann bei der Klasse `Plus` das `static` weg und lies die Fehlermeldung von javac.

## Checkliste

::: checkliste
- Ich kann einen Zuhörer als benannte innere Klasse schreiben. → 1. Die benannte innere Klasse
- Ich kann einen Zuhörer als anonyme Klasse schreiben. → 2. Die anonyme Klasse
- Ich weiß, was beim Lambda weggelassen wird. → 3. Das Lambda
- Ich weiß, welche Schreibweise welche Variablen sieht. → Die drei im Vergleich
- Mein Zähler hat drei Knöpfe mit drei Schreibweisen. → Aufgabe: Ein Zähler, drei Schreibweisen
:::

## Wissenstest

::: quiz
? Warum geht die Kurzform mit dem Pfeil bei ActionListener?
- [ ] Weil ActionListener eine Klasse ist.
- [x] Weil der Vertrag genau eine Methode hat.
- [ ] Weil der Knopf es so verlangt.

? Welche Schreibweise kannst du mit new Plus() bei mehreren Knöpfen benutzen, ohne sie in eine Variable zu speichern?
- [x] die benannte innere Klasse
- [ ] die anonyme Klasse
- [ ] das Lambda

? Warum steht static vor class Plus?
- [ ] Damit die Klasse schneller ist.
- [x] Weil main static ist und sonst kein Objekt von Plus erzeugen kann.
- [ ] Weil jede Klasse static sein muss.

? Ordne zu.
= class Plus implements ActionListener -> benannte innere Klasse
= new ActionListener() { … } -> anonyme Klasse
= der Pfeil hinter e -> Lambda
:::
