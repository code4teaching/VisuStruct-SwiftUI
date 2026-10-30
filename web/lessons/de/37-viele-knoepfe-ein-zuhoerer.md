---
titel: Viele Knöpfe, ein Zuhörer
bereich: Fenster mit Swing
kurz: Ein Zuhörer für viele Knöpfe, mit getActionCommand und getSource herausfinden, welcher Knopf geklickt wurde.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- einen Zuhörer in einer Variable vom Typ ActionListener speichern und bei mehreren Knöpfen anmelden
- erklären, was getActionCommand und getSource liefern
- Knöpfe in einer Schleife auf ein JPanel setzen
- ein Zahlenschloss bauen, das sich nur mit dem richtigen Code öffnet
:::

## Das Ziel

Seit der Sache mit dem Kuchen will Ludwig seinen Stall abschließen. Er baut ein **Zahlenschloss**: neun Zifferntasten, eine Null, **C** zum Löschen und **OK** zum Prüfen. Nur wer 1234 eintippt, bekommt „Tor offen!“.

Das sind zwölf Knöpfe. Bisher hatte jeder Knopf seinen eigenen Zuhörer, wie beim Taschenrechner in Lektion 35. Heute lernst du, wie **ein** Zuhörer für alle Knöpfe reicht.

Schalte im [Zahnrad](#zeige-einstellungen) **Echtes Java (mit Swing)** ein.

## Neun fast gleiche Zuhörer

So sähe es mit einem Zuhörer pro Taste aus:

```java
eins.addActionListener(e -> anzeige.setText(anzeige.getText() + "1"));
zwei.addActionListener(e -> anzeige.setText(anzeige.getText() + "2"));
drei.addActionListener(e -> anzeige.setText(anzeige.getText() + "3"));
// ... und so weiter bis 9
```

Die Zeilen unterscheiden sich nur in der Ziffer. Wer eine Kleinigkeit ändern will, muss es neunmal tun und vergisst bestimmt eine Zeile.

## Ein Zuhörer als Variable

Ein Zuhörer kann auch in einer **Variable** stehen. Ihr Datentyp ist `ActionListener`, der Vertrag aus Lektion 30. Danach meldest du denselben Zuhörer bei mehreren Knöpfen an:

```java
ActionListener ziffer = e -> anzeige.setText(anzeige.getText() + e.getActionCommand());

eins.addActionListener(ziffer);
zwei.addActionListener(ziffer);
drei.addActionListener(ziffer);
```

`ActionListener` steht im Paket `java.awt.event`. Du brauchst deshalb oben `import java.awt.event.*;`.

Jetzt gibt es den Code nur einmal. Aber woher weiß der Zuhörer, welche Ziffer er anhängen soll?

## Wer hat geklickt?

Das `e` vor dem Pfeil ist das **Ereignis**, ein Objekt vom Typ `ActionEvent`. Der Knopf gibt es bei jedem Klick mit, und darin steht, was passiert ist:

| Aufruf | Liefert | Beispiel |
|---|---|---|
| `e.getActionCommand()` | die Beschriftung des geklickten Knopfs, als Text | `"7"` |
| `e.getSource()` | den geklickten Knopf selbst | der Knopf `ok` |

- `getActionCommand()` ist praktisch, wenn die Beschriftung schon sagt, was zu tun ist, wie bei den Ziffern.
- `getSource()` vergleichst du mit `==` mit einem Knopf: `if (e.getSource() == ok)`. Hier ist `==` richtig, denn es geht um genau dieses eine Objekt, nicht um einen Text.

::: ludwig
Texte vergleichst du mit `equals`, Knöpfe mit `==`. Willst du über die Beschriftung entscheiden, schreibst du `e.getActionCommand().equals("OK")`. Das geht auch, bricht aber, sobald jemand die Beschriftung in „Öffnen“ ändert. `e.getSource() == ok` bleibt richtig.
:::

## Knöpfe in einer Schleife

Mit einem gemeinsamen Zuhörer kannst du die Zifferntasten sogar in einer Schleife bauen. Damit sie ordentlich im Raster stehen, kommen sie auf ein **JPanel**. Ein JPanel ist eine Fläche im Fenster mit einem eigenen Layout:

```java
JPanel tasten = new JPanel(new GridLayout(0, 3));
for (int i = 1; i <= 9; i++) {
    JButton ziffer = new JButton("" + i);
    ziffer.addActionListener(taste);
    tasten.add(ziffer);
}
```

- `"" + i` macht aus der Zahl `i` den Text für die Beschriftung.
- In jedem Durchlauf entsteht ein neuer Knopf. Alle bekommen denselben Zuhörer `taste`.
- `fenster.add(tasten, BorderLayout.CENTER)` setzt die ganze Fläche mit allen Tasten ins Fenster.

## Das ganze Programm

```java
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class Zahlenschloss {
    public static void main(String[] args) {
        JFrame fenster = new JFrame("Zahlenschloss");
        fenster.setSize(240, 300);
        fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        fenster.setLayout(new BorderLayout());

        JLabel anzeige = new JLabel("", SwingConstants.CENTER);
        JPanel tasten = new JPanel(new GridLayout(0, 3));
        JButton loeschen = new JButton("C");
        JButton ok = new JButton("OK");

        ActionListener taste = e -> {
            if (e.getSource() == loeschen) {
                anzeige.setText("");
            } else if (e.getSource() == ok) {
                if (anzeige.getText().equals("1234")) {
                    anzeige.setText("Tor offen!");
                } else {
                    anzeige.setText("Falsch");
                }
            } else {
                anzeige.setText(anzeige.getText() + e.getActionCommand());
            }
        };

        for (int i = 1; i <= 9; i++) {
            JButton ziffer = new JButton("" + i);
            ziffer.addActionListener(taste);
            tasten.add(ziffer);
        }
        JButton nullTaste = new JButton("0");
        nullTaste.addActionListener(taste);
        loeschen.addActionListener(taste);
        ok.addActionListener(taste);
        tasten.add(loeschen);
        tasten.add(nullTaste);
        tasten.add(ok);

        fenster.add(anzeige, BorderLayout.NORTH);
        fenster.add(tasten, BorderLayout.CENTER);
        fenster.setVisible(true);
    }
}
```

- `loeschen` und `ok` werden **vor** dem Zuhörer angelegt, denn der Zuhörer vergleicht mit ihnen.
- Der Zuhörer prüft erst die beiden besonderen Knöpfe. Alle anderen sind Ziffern und hängen ihre Beschriftung an.
- Die Null heißt `nullTaste`, weil `null` in Java schon ein Wort mit fester Bedeutung ist.

::: angeberwissen
Das Zahlenfeld am Telefon hat die 1 oben links, das am Taschenrechner und an der Computertastatur hat die 7 oben links. Warum? Als die Tastentelefone kamen, gab es Tests mit Leuten, die damit wählen sollten. Mit der 1 oben ging es schneller, und Rechenmaschinen hatten ihre Anordnung da schon längst. Ludwigs Schloss macht es wie das Telefon.
:::

## Spiel: Wer hat geklickt?

::: spiel zuhoerer
titel: Spiel: Wer hat geklickt?
intro: In jeder Runde hört **ein** Zuhörer an mehreren Knöpfen. Ludwig zeigt dir Code, Fenster und die Klicks. Was steht am Ende in der Anzeige? Danach spielt Ludwig die Klicks ab.
frage: Was steht nach den Klicks in der Anzeige?

runde:
    JFrame fenster = new JFrame("Buchstaben");
    JLabel anzeige = new JLabel("");
    JButton a = new JButton("A");
    JButton b = new JButton("B");
    ActionListener z = e -> anzeige.setText(anzeige.getText() + e.getActionCommand());
    a.addActionListener(z);
    b.addActionListener(z);
klicks: A, B, A
- A
- AB
- [x] ABA
> Ein Zuhörer, zwei Knöpfe. `e.getActionCommand()` liefert jedes Mal die Beschriftung des geklickten Knopfs, und sie wird hinten angehängt.

runde:
    JFrame fenster = new JFrame("Zähler");
    static int zahl = 0;
    JLabel anzeige = new JLabel("0");
    JButton plus = new JButton("+");
    JButton minus = new JButton("-");
    ActionListener z = e -> {
        if (e.getSource() == plus) {
            zahl++;
        } else {
            zahl--;
        }
        anzeige.setText("" + zahl);
    };
    plus.addActionListener(z);
    minus.addActionListener(z);
klicks: +, +, -
- 3
- [x] 1
- -1
> `e.getSource()` sagt, welcher Knopf es war. Zweimal plus, einmal minus: 0 + 1 + 1 - 1 = 1.

runde:
    JFrame fenster = new JFrame("Buchstaben");
    JLabel anzeige = new JLabel("");
    JButton a = new JButton("A");
    JButton b = new JButton("B");
    JButton c = new JButton("C");
    ActionListener z = e -> anzeige.setText(anzeige.getText() + e.getActionCommand());
    a.addActionListener(z);
    b.addActionListener(z);
klicks: A, C, B
- ACB
- [x] AB
- A
> Der Zuhörer ist nur bei A und B angemeldet. Beim Klick auf C hört niemand zu.

runde:
    JFrame fenster = new JFrame("Tasten");
    JLabel anzeige = new JLabel("");
    JButton eins = new JButton("1");
    JButton zwei = new JButton("2");
    JButton weg = new JButton("C");
    ActionListener z = e -> {
        if (e.getActionCommand().equals("C")) {
            anzeige.setText("");
        } else {
            anzeige.setText(anzeige.getText() + e.getActionCommand());
        }
    };
    eins.addActionListener(z);
    zwei.addActionListener(z);
    weg.addActionListener(z);
klicks: 1, 2, C, 1
- 121
- 12
- [x] 1
> Nach 1 und 2 steht „12“ da. C löscht alles, und die letzte 1 steht allein.

runde:
    JFrame fenster = new JFrame("Schloss");
    JLabel anzeige = new JLabel("");
    JButton vier = new JButton("4");
    JButton zwei = new JButton("2");
    JButton ok = new JButton("OK");
    ActionListener z = e -> {
        if (e.getSource() == ok) {
            if (anzeige.getText().equals("42")) {
                anzeige.setText("Tor offen!");
            } else {
                anzeige.setText("Falsch");
            }
        } else {
            anzeige.setText(anzeige.getText() + e.getActionCommand());
        }
    };
    vier.addActionListener(z);
    zwei.addActionListener(z);
    ok.addActionListener(z);
klicks: 2, 4, OK
- Tor offen!
- [x] Falsch
- 24OK
> Eingetippt ist „24“, das Geheimnis ist aber „42“. Die Reihenfolge der Klicks zählt.
:::

## Aufgabe: Zahlenschloss

Baue das Zahlenschloss nach und probiere es aus.

Dann mach es besser:

- Nach drei falschen Versuchen schaltet sich **OK** ab, wie der Knopf beim Zahlenraten in Lektion 36. Zähle die Versuche in einer `static int`-Variable in der Klasse.
- Zusatz: Die Anzeige zeigt `*` statt der Ziffern. Merke dir die echte Eingabe in einer `static String eingabe = "";` und hänge an die Anzeige nur einen Stern an.

::: ludwig
Auch beim Taschenrechner aus Lektion 35 reicht ein Zuhörer für +, -, \* und /. Prüfe darin mit `e.getActionCommand().equals("+")`, welches Rechenzeichen geklickt wurde.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann einen Zuhörer in einer Variable vom Typ ActionListener speichern und bei mehreren Knöpfen anmelden. → Ein Zuhörer als Variable
- Ich kann erklären, was getActionCommand und getSource liefern. → Wer hat geklickt?
- Ich kann Knöpfe in einer Schleife auf ein JPanel setzen. → Knöpfe in einer Schleife
- Ich kann ein Zahlenschloss bauen, das sich nur mit dem richtigen Code öffnet. → Aufgabe: Zahlenschloss
:::

## Wissenstest

::: quiz
? Was liefert e.getActionCommand() bei einem Klick auf den Knopf new JButton("7")?
→ Wer hat geklickt?
- [ ] die Zahl 7
- [x] den Text "7"
- [ ] den Knopf selbst

? Wie prüfst du, ob der Knopf ok geklickt wurde?
→ Wer hat geklickt?
- [x] e.getSource() == ok
- [ ] e.getSource().equals("ok")
- [ ] ok.getActionCommand()
> getSource liefert den Knopf selbst, und den vergleichst du mit ==.

? Warum steht ein Zuhörer in einer Variable?
→ Ein Zuhörer als Variable
- [ ] Damit er schneller läuft.
- [x] Damit man ihn bei mehreren Knöpfen anmelden kann und den Code nur einmal schreibt.
- [ ] Weil Lambdas sonst nicht erlaubt sind.

? Ordne zu.
→ Wer hat geklickt?
= ActionListener -> Datentyp eines Zuhörers
= ActionEvent -> das Ereignis e mit den Infos zum Klick
= JPanel -> eine Fläche mit eigenem Layout
:::
