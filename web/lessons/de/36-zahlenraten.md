---
titel: Zahlenraten
bereich: Fenster mit Swing
kurz: Ein Spiel mit Zufallszahl, Versuchszähler und einem Knopf, der sich am Ende abschaltet.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- mit Math.random eine ganze Zufallszahl von 1 bis 100 erzeugen
- entscheiden, welche Variablen in die Klasse gehören
- einen Knopf mit setEnabled abschalten
- ein Ratespiel mit einem Knopf „Neues Spiel“ bauen
:::

## Das Ziel

Jetzt wird gespielt: Der Computer denkt sich eine Zahl von 1 bis 100 aus. Du rätst, und das Fenster sagt dir „zu klein“ oder „zu groß“. Hast du sie gefunden, verrät es dir, wie viele Versuche du gebraucht hast.

Neu sind diesmal **Zufallszahlen** und ein Knopf, der sich am Ende **abschaltet**.

Schalte im [Zahnrad](#zeige-einstellungen) **Echtes Java (mit Swing)** ein.

## Eine Zufallszahl

`Math.random()` liefert eine zufällige Kommazahl von 0 bis knapp unter 1, zum Beispiel 0.4173. Daraus wird in drei Schritten eine ganze Zahl von 1 bis 100:

```java
int geheim = (int) (Math.random() * 100) + 1;
```

| Schritt | Beispiel |
|---|---|
| `Math.random()` | 0.4173 |
| `* 100` | 41.73 |
| `(int)` schneidet die Nachkommastellen ab | 41 |
| `+ 1` | 42 |

Ohne `+ 1` käme 0 bis 99 heraus.

Probiere es im Bereich [Code](#zeige-codelive) aus: `int geheim = (int) (Math.random() * 100) + 1;` und `System.out.println(geheim);`. Jedes Ausführen liefert eine andere Zahl.

::: angeberwissen
Computer können eigentlich gar nicht würfeln. `Math.random()` rechnet mit einer Formel eine lange Folge von Zahlen aus, die nur zufällig **aussehen**. Man nennt sie Pseudozufallszahlen. Für Spiele reicht das völlig.
:::

## Was sich das Spiel merkt

Zwei Dinge muss sich das Spiel über alle Klicks hinweg merken: die geheime Zahl und die Zahl der Versuche. Wie beim Klickzähler aus Lektion 32 stehen beide in der Klasse:

```java
static int geheim = (int) (Math.random() * 100) + 1;
static int versuche = 0;
```

## Das ganze Programm

```java
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

## Mit 7 Versuchen gewinnen

::: angeberwissen
Wer geschickt rät, braucht nie mehr als 7 Versuche. Rate immer die Mitte des Bereichs, der noch übrig ist: erst 50, dann 25 oder 75 und so weiter. Jeder Tipp halbiert den Bereich: 100, 50, 25, 13, 7, 4, 2, 1. Das ist die **binäre Suche** aus Lektion 19. Weil 2 hoch 7 = 128 größer als 100 ist, reichen 7 Tipps.
:::

## Aufgabe: Zahlenraten

Baue das Spiel nach und mach es besser:

- Eine Eingabe wie „abc“ zählt nicht als Versuch und bringt den Hinweis „Bitte eine Zahl eingeben“.
- Ein zweiter Knopf **Neues Spiel** denkt sich eine neue Zahl aus, setzt die Versuche auf 0, schaltet den Knopf Raten wieder ein und setzt den Hinweis zurück.

Zusatz: Nach 7 Fehlversuchen ist das Spiel verloren. Das Fenster verrät dann die geheime Zahl.

**Du bist fertig, wenn …**

- du bei jedem falschen Tipp „zu klein“ oder „zu groß“ siehst,
- „abc“ den Hinweis „Bitte eine Zahl eingeben“ bringt und die Versuche dabei gleich bleiben,
- **Neues Spiel** die Versuche auf 0 setzt, den Knopf Raten wieder einschaltet und den Hinweis zurücksetzt.

::: ludwig
Für „zählt nicht als Versuch“ muss `versuche++` **hinter** `Integer.parseInt` stehen, beides im `try`-Block. Wirft `parseInt` eine Exception, wird die Zeile mit `versuche++` übersprungen.
:::

## Spiel: Zu klein oder zu groß?

::: spiel frage
titel: Spiel: Zu klein oder zu groß?
intro: Ludwig spielt Zahlenraten. Lies den Code und sag vorher, was passiert. Sieben Runden.

runde:
    // geheim ist 42
    if (tipp < geheim) {
        hinweis.setText(tipp + " ist zu klein.");
    } else if (tipp > geheim) {
        hinweis.setText(tipp + " ist zu groß.");
    } else {
        hinweis.setText("Richtig!");
    }
frage: Ludwig tippt 50. Was steht im Hinweis?
- 50 ist zu klein.
- [x] 50 ist zu groß.
- Richtig!
> 50 ist größer als 42.

runde:
frage: Die Zahl liegt von 1 bis 100. 50 war zu groß, 25 war zu klein. Welche Zahl rät Ludwig klug als Nächstes?
- 26
- [x] 37
- 49
> Übrig sind 26 bis 49. Die Mitte davon ist 37 (oder 38). So halbiert jeder Tipp den Bereich.

runde:
    int wurf = (int) (Math.random() * 6) + 1;
frage: Welche Zahlen kann `wurf` haben?
- 0 bis 6
- [x] 1 bis 6
- 1 bis 7
> `Math.random() * 6` liegt von 0 bis knapp unter 6. `(int)` macht 0 bis 5 daraus, `+ 1` dann 1 bis 6. Ein Würfel!

runde:
    int zahl = (int) (Math.random() * 10);
frage: Welche Zahlen kann `zahl` haben?
- [x] 0 bis 9
- 1 bis 10
- 0 bis 10
> Ohne `+ 1` fängt es bei 0 an, und die 10 wird nie erreicht.

runde:
    // geheim ist 42
    versuche++;
    if (tipp == geheim) {
        hinweis.setText("Richtig! Du hast " + versuche + " Versuche gebraucht.");
    }
frage: Ludwig tippt 50, dann 25, dann 42. Was steht am Ende im Hinweis?
- Richtig! Du hast 2 Versuche gebraucht.
- [x] Richtig! Du hast 3 Versuche gebraucht.
- Richtig! Du hast 42 Versuche gebraucht.
> `versuche++` zählt bei jedem Klick hoch, auch beim Treffer.

runde:
    knopf.setEnabled(false);
frage: Ludwig hat die Zahl gefunden und klickt noch einmal auf **Raten**. Was passiert?
- Das Spiel beginnt von vorn.
- Es zählt einen Versuch mehr.
- [x] Nichts, der Knopf ist grau und lässt sich nicht klicken.
> `setEnabled(false)` schaltet den Knopf ab.

runde:
frage: Die Zahl liegt jetzt von 1 bis 1000. Wie viele Tipps braucht man mit der binären Suche höchstens?
- 7
- [x] 10
- 500
> 2 hoch 10 = 1024 ist größer als 1000. Zehn Halbierungen reichen.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann mit Math.random eine ganze Zufallszahl von 1 bis 100 erzeugen. → Eine Zufallszahl
- Ich kann entscheiden, welche Variablen in die Klasse gehören. → Was sich das Spiel merkt
- Ich kann einen Knopf mit setEnabled abschalten. → Das ganze Programm
- Ich kann ein Ratespiel mit einem Knopf „Neues Spiel“ bauen. → Aufgabe: Zahlenraten
:::

## Wissenstest

::: quiz
? Welche Zahlen liefert (int) (Math.random() * 100) + 1?
→ Eine Zufallszahl
- [ ] 0 bis 100
- [x] 1 bis 100
- [ ] 1 bis 101

? Was macht knopf.setEnabled(false)?
→ Das ganze Programm
- [ ] Es löscht den Knopf aus dem Fenster.
- [x] Der Knopf wird grau und lässt sich nicht mehr klicken.
- [ ] Es ändert die Beschriftung des Knopfs.

? Wie viele Versuche braucht man mit der binären Suche höchstens bei 1 bis 100?
→ Aufgabe: Zahlenraten
- [ ] 50
- [ ] 10
- [x] 7
> Jeder Tipp halbiert den Bereich, und 2 hoch 7 = 128 ist größer als 100.
:::
