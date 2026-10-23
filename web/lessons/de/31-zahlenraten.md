---
titel: Zahlenraten
bereich: Fenster mit Swing
kurz: Ein Spiel mit Zufallszahl, Versuchszähler und einem Knopf, der sich am Ende abschaltet.
---

## Das Ziel

Zum Abschluss ein Spiel: Der Computer denkt sich eine Zahl von 1 bis 100 aus. Du rätst, und das Fenster sagt dir „zu klein“ oder „zu groß“. Hast du sie gefunden, verrät es dir, wie viele Versuche du gebraucht hast.

Neu sind diesmal **Zufallszahlen** und ein Knopf, der sich am Ende **abschaltet**.

Schalte im [Zahnrad](#zeige-einstellungen) **Echtes Java (mit Swing)** ein.

## Eine Zufallszahl

`Math.random()` liefert eine zufällige Kommazahl von 0 bis knapp unter 1, zum Beispiel 0.4173. Daraus wird in drei Schritten eine ganze Zahl von 1 bis 100:

```
int geheim = (int) (Math.random() * 100) + 1;
```

| Schritt | Beispiel |
|---|---|
| `Math.random()` | 0.4173 |
| `* 100` | 41.73 |
| `(int)` schneidet die Nachkommastellen ab | 41 |
| `+ 1` | 42 |

Ohne `+ 1` käme 0 bis 99 heraus.

Probiere es im Bereich [Programmieren](#zeige-codelive) aus: `int geheim = (int) (Math.random() * 100) + 1;` und `System.out.println(geheim);`. Jedes Ausführen liefert eine andere Zahl.

::: angeberwissen
Computer können eigentlich gar nicht würfeln. `Math.random()` rechnet mit einer Formel eine lange Folge von Zahlen aus, die nur zufällig **aussehen**. Man nennt sie Pseudozufallszahlen. Für Spiele reicht das völlig.
:::

## Was sich das Spiel merkt

Zwei Dinge muss sich das Spiel über alle Klicks hinweg merken: die geheime Zahl und die Zahl der Versuche. Wie beim Klickzähler aus Lektion 27 stehen beide in der Klasse:

```
static int geheim = (int) (Math.random() * 100) + 1;
static int versuche = 0;
```

## Das ganze Programm

```
import javax.swing.*;
import java.awt.*;

public class Zahlenraten {
    static int geheim = (int) (Math.random() * 100) + 1;
    static int versuche = 0;

    public static void main(String[] args) {
        JFrame fenster = new JFrame("Zahlenraten");
        fenster.setSize(320, 180);
        fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        fenster.setLayout(new GridLayout(0, 1));

        JLabel hinweis = new JLabel("Ich denke mir eine Zahl von 1 bis 100.");
        JTextField feld = new JTextField();
        JButton knopf = new JButton("Raten");

        knopf.addActionListener(e -> {
            int tipp = Integer.parseInt(feld.getText());
            versuche++;
            if (tipp < geheim) {
                hinweis.setText(tipp + " ist zu klein.");
            } else if (tipp > geheim) {
                hinweis.setText(tipp + " ist zu groß.");
            } else {
                hinweis.setText("Richtig! Du hast " + versuche + " Versuche gebraucht.");
                knopf.setEnabled(false);
            }
            feld.setText("");
        });

        fenster.add(hinweis);
        fenster.add(feld);
        fenster.add(knopf);
        fenster.setVisible(true);
    }
}
```

- `feld.setText("")` leert das Textfeld nach jedem Tipp, damit du gleich den nächsten eintippen kannst.
- `knopf.setEnabled(false)` schaltet den Knopf ab. Er wird grau und lässt sich nicht mehr klicken. Das Spiel ist vorbei.

::: ludwig
Mit `setEnabled(true)` schaltest du einen Knopf wieder ein. So kannst du zum Beispiel einen Knopf erst freigeben, wenn etwas eingegeben wurde.
:::

## Profiwissen: mit 7 Versuchen gewinnen

::: angeberwissen
Wer geschickt rät, braucht nie mehr als 7 Versuche. Rate immer die Mitte des Bereichs, der noch übrig ist: erst 50, dann 25 oder 75 und so weiter. Jeder Tipp halbiert den Bereich: 100, 50, 25, 13, 7, 4, 2, 1. Das ist die **binäre Suche** aus Lektion 19. Weil 2 hoch 7 = 128 größer als 100 ist, reichen 7 Tipps.
:::

## Aufgabe: Zahlenraten

Baue das Spiel nach und mach es besser:

- Eine Eingabe wie „abc“ zählt nicht als Versuch und bringt den Hinweis „Bitte eine Zahl eingeben“.
- Ein zweiter Knopf **Neues Spiel** denkt sich eine neue Zahl aus, setzt die Versuche auf 0, schaltet den Knopf Raten wieder ein und setzt den Hinweis zurück.

Zusatz: Nach 7 Fehlversuchen ist das Spiel verloren. Das Fenster verrät dann die geheime Zahl.

::: ludwig
Für „zählt nicht als Versuch“ muss `versuche++` **hinter** `Integer.parseInt` stehen, beides im `try`-Block. Wirft `parseInt` eine Exception, wird die Zeile mit `versuche++` übersprungen.
:::

## Checkliste

::: checkliste
- Ich kann mit Math.random eine ganze Zufallszahl von 1 bis 100 erzeugen. → Eine Zufallszahl
- Ich weiß, welche Variablen in die Klasse gehören. → Was sich das Spiel merkt
- Ich kann einen Knopf mit setEnabled abschalten. → Das ganze Programm
- Mein Spiel hat einen Knopf „Neues Spiel“. → Aufgabe: Zahlenraten
:::

## Wissenstest

::: quiz
? Welche Zahlen liefert (int) (Math.random() * 100) + 1?
- [ ] 0 bis 100
- [x] 1 bis 100
- [ ] 1 bis 101

? Was macht knopf.setEnabled(false)?
- [ ] Es löscht den Knopf aus dem Fenster.
- [x] Der Knopf wird grau und lässt sich nicht mehr klicken.
- [ ] Es ändert die Beschriftung des Knopfs.

? Wie viele Versuche braucht man mit der binären Suche höchstens bei 1 bis 100?
- [ ] 50
- [ ] 10
- [x] 7
> Jeder Tipp halbiert den Bereich, und 2 hoch 7 = 128 ist größer als 100.
:::
