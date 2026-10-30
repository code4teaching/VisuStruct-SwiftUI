---
titel: Ein Knopf im Fenster
bereich: Fenster mit Swing
kurz: Einen Knopf ins Fenster legen und mit einem Layout ordentlich anordnen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- einen Knopf bauen und mit add ins Fenster legen
- erklären, warum der Knopf vor setVisible(true) hineinkommt
- mit FlowLayout dafür sorgen, dass der Knopf normal groß ist
- ein Fenster mit einem Knopf bauen, den man drücken kann
:::

## Einen Knopf bauen

Ein leeres Fenster ist langweilig. Jetzt kommt ein Knopf hinein. In Swing heißt ein Knopf **JButton** (button ist englisch für Knopf).

Zwei neue Zeilen brauchst du dafür:

```java
JButton knopf = new JButton("Klick mich");
fenster.add(knopf);
```

- `new JButton("Klick mich")` baut einen Knopf. Der Text in Klammern steht später auf dem Knopf.
- `fenster.add(knopf)` legt den Knopf ins Fenster. Ohne `add` gibt es den Knopf zwar, aber er liegt nirgends und du siehst ihn nicht.

## Das ganze Programm

Beide Zeilen kommen **vor** `setVisible(true)`, denn das Fenster soll erst fertig eingerichtet und dann gezeigt werden:

```java
import javax.swing.*;

public class KnopfFenster {
    public static void main(String[] args) {
        JFrame fenster = new JFrame("Knopf");
        fenster.setSize(300, 200);
        fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JButton knopf = new JButton("Klick mich");
        fenster.add(knopf);

        fenster.setVisible(true);
    }
}
```

Führe das Programm aus. Überraschung: Der Knopf ist riesig und füllt das ganze Fenster!

::: ludwig
Die Reihenfolge ist wie beim ersten Fenster: einrichten, Knopf bauen, Knopf hineinlegen und ganz zum Schluss zeigen. Die Leerzeilen im Code helfen dir, diese Teile zu sehen.
:::

## Der Riesenknopf

Wie ein Fenster seine Teile anordnet, bestimmt sein **Layout**. Ein `JFrame` legt ohne weitere Angabe alles in die Mitte und macht es so groß wie das ganze Fenster.

Mit einem anderen Layout bekommt der Knopf seine normale Größe. Das **FlowLayout** stellt alles wie Wörter in einer Zeile nebeneinander, so groß wie nötig:

```java
import javax.swing.*;
import java.awt.*;

public class KnopfFenster {
    public static void main(String[] args) {
        JFrame fenster = new JFrame("Knopf");
        fenster.setSize(300, 200);
        fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        fenster.setLayout(new FlowLayout());

        JButton knopf = new JButton("Klick mich");
        fenster.add(knopf);

        fenster.setVisible(true);
    }
}
```

`FlowLayout` gehört zum älteren Werkzeugkasten AWT. Deshalb steht oben eine zweite Zeile: `import java.awt.*;`.

::: angeberwissen
Beim FlowLayout fließen die Bausteine wie Text: Passt ein Knopf nicht mehr in die Zeile, rutscht er in die nächste. Mach das Fenster schmal und schau zu, wie die Knöpfe umbrechen. Flow ist englisch für Fluss.
:::

## Klicken geht, aber nichts passiert

Klicke auf den Knopf. Er wird kurz dunkler, wenn du ihn drückst. Swing zeigt also, dass er gedrückt wurde. Sonst passiert aber nichts.

Das ist kein Fehler: Du hast dem Programm noch nicht gesagt, **was** beim Klick passieren soll. Das lernst du in der nächsten Lektion.

## Spiel: Bombe entschärfen

::: spiel bombe
titel: Spiel: Bombe entschärfen
intro: In jedem Fensterprogramm steckt **genau ein Fehler**, und die Bombe tickt. Lies, was das Programm tun soll, und tippe auf die falsche Zeile, bevor die Zeit abläuft. Sechs Runden, je 25 Sekunden.
zeit: 25

runde:
    JFrame fenster = new JFrame("Knopf");
    fenster.setSize(300, 200);
    JButton knopf = new JButton(Klick mich);
    fenster.add(knopf);
    fenster.setVisible(true);
frage: Soll einen Knopf „Klick mich“ zeigen.
fehler: 3
besser: JButton knopf = new JButton("Klick mich");
> Die Beschriftung ist ein Text und braucht Anführungszeichen.

runde:
    JFrame fenster = new JFrame("Knopf");
    fenster.setSize(300, 200);
    JButton knopf = new JButton("OK");
    fenster.add(fenster);
    fenster.setVisible(true);
frage: Soll den Knopf „OK“ ins Fenster legen.
fehler: 4
besser: fenster.add(knopf);
> Ins Fenster gehört der Knopf, nicht das Fenster selbst.

runde:
    import java.swing.*;
    import java.awt.*;
frage: Soll Swing und das FlowLayout ins Programm holen.
fehler: 1
besser: import javax.swing.*;
> Swing liegt in `javax.swing`, mit x. Das FlowLayout kommt aus `java.awt`, ohne x.

runde:
    JFrame fenster = new JFrame("Knopf");
    fenster.setSize(300, 200);
    fenster.setLayout(new FlowLayout);
    fenster.add(new JButton("OK"));
    fenster.setVisible(true);
frage: Soll den Knopf in normaler Größe zeigen.
fehler: 3
besser: fenster.setLayout(new FlowLayout());
> Nach `new` und dem Namen kommen immer runde Klammern, auch wenn nichts darin steht.

runde:
    JFrame fenster = new JFrame("Knopf");
    fenster.setSize(300, 200);
    fenster.setLayout(new FlowLayout());
    JButton knopf = new Jbutton("OK");
    fenster.add(knopf);
    fenster.setVisible(true);
frage: Soll einen Knopf „OK“ zeigen.
fehler: 4
besser: JButton knopf = new JButton("OK");
> Java unterscheidet Groß- und Kleinschreibung: `JButton` mit großem B.

runde:
    JFrame fenster = new JFrame("Knopf");
    fenster.setSize(300, 200);
    fenster.setLayout(new FlowLayout());
    fenster.add(new JButton("OK"));
    fenster.setVisible(false);
frage: Soll das Fenster mit dem Knopf zeigen.
fehler: 5
besser: fenster.setVisible(true);
> Mit `false` bleibt das Fenster unsichtbar.
:::

## Aufgabe: Klick mich

Baue ein Fenster mit dem Titel „Knopf-Test“, 300 mal 200 Pixel groß, mit einem Knopf „Klick mich“ in normaler Größe. Der Knopf soll sich drücken lassen, auch wenn noch nichts passiert.

Zusatz: Lege einen zweiten Knopf „Ich auch“ daneben. In welcher Reihenfolge stehen die Knöpfe? Tausche die beiden `add`-Zeilen und probiere es noch einmal.

::: ludwig
Jeder Knopf braucht eine eigene Variable, zum Beispiel `knopf` und `knopf2`, und ein eigenes `add`. Das FlowLayout stellt die Knöpfe in der Reihenfolge der `add`-Zeilen auf.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann einen Knopf bauen und mit add ins Fenster legen. → Einen Knopf bauen
- Ich kann erklären, warum der Knopf vor setVisible(true) hineinkommt. → Das ganze Programm
- Ich kann mit FlowLayout dafür sorgen, dass der Knopf normal groß ist. → Der Riesenknopf
- Ich kann ein Fenster mit einem Knopf bauen, den man drücken kann. → Aufgabe: Klick mich
:::

## Wissenstest

::: quiz
? Was macht fenster.add(knopf)?
→ Einen Knopf bauen
- [ ] Es baut einen neuen Knopf.
- [x] Es legt den Knopf ins Fenster.
- [ ] Es macht den Knopf klickbar.
> Gebaut wird der Knopf mit new JButton(…).

? Warum füllt der Knopf ohne FlowLayout das ganze Fenster?
→ Der Riesenknopf
- [ ] Weil der Text zu lang ist
- [x] Weil das Fenster ohne eigenes Layout alles so groß wie das Fenster macht
- [ ] Weil setSize fehlt

? Welche import-Zeile brauchst du für FlowLayout?
→ Der Riesenknopf
- [ ] import javax.swing.*;
- [x] import java.awt.*;
- [ ] import java.util.*;
> FlowLayout stammt aus dem älteren AWT.

? Was passiert beim Klick auf den Knopf in dieser Lektion?
→ Aufgabe: Klick mich
- [ ] Das Programm endet.
- [x] Der Knopf wird kurz dunkler, sonst passiert nichts.
- [ ] Auf dem Knopf steht „Ich wurde geklickt“.
> Was beim Klick passieren soll, lernst du in der nächsten Lektion.
:::
