---
titel: Zwei Reiter
bereich: Fenster mit Swing
kurz: Ein Fenster mit zwei Reitern bauen, Daten von einem Reiter zum anderen bringen und die Liste als Textdatei speichern.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- ein Fenster mit zwei Reitern bauen
- mit append Zeilen an eine JTextArea anhängen
- erklären, warum ein Zuhörer Bausteine auf beiden Reitern benutzen kann
- im Zuhörer mit try und catch eine Datei speichern
- eine Einkaufsliste bauen, die mitzählt, wie viele Dinge darauf stehen
:::

## Das Ziel

Ludwigs Einkaufsliste aus Lektion 23 bekommt ein Fenster. Es hat zwei **Reiter**, wie die Tabs im Browser:

- Im Reiter **Eingabe** tippst du ein, was du brauchst, und klickst auf **Hinzufügen**.
- Im Reiter **Liste** steht alles, was du eingegeben hast. Ein Knopf **Speichern** schreibt die Liste in eine Textdatei.

Neu sind die Reiter (`JTabbedPane`), ein Textbereich mit mehreren Zeilen (`JTextArea`) und das Speichern aus einem Zuhörer heraus.

Schalte im [Zahnrad](#zeige-einstellungen) **Echtes Java (mit Swing)** ein.

## Reiter mit JTabbedPane

Jeder Reiter zeigt eine eigene Fläche. Die Flächen sind JPanels, wie das Tastenfeld beim Zahlenschloss in Lektion 37:

```java
JTabbedPane reiter = new JTabbedPane();
JPanel eingabe = new JPanel(new GridLayout(0, 1));
JPanel liste = new JPanel(new BorderLayout());

reiter.addTab("Eingabe", eingabe);
reiter.addTab("Liste", liste);
fenster.add(reiter);
```

| Aufruf | Bedeutung |
|---|---|
| `addTab("Eingabe", eingabe)` | neuer Reiter mit der Beschriftung „Eingabe“, er zeigt das JPanel `eingabe` |
| `setSelectedIndex(1)` | wechselt zum zweiten Reiter, gezählt wird ab 0 |
| `setTitleAt(1, "Liste (3)")` | ändert die Beschriftung des zweiten Reiters |

Beim Start ist der Reiter offen, der zuerst hinzugefügt wurde.

## Ein Textbereich mit mehreren Zeilen

Ein `JTextField` hat nur eine Zeile. Für die Liste brauchst du eine `JTextArea`:

```java
JTextArea bereich = new JTextArea();
bereich.setEditable(false);
bereich.append("Heu\n");
```

- `append` hängt Text hinten an. Das `"\n"` beginnt danach eine neue Zeile, wie beim Zerlegen mit `split("\n")` in Lektion 24.
- `setEditable(false)` verhindert, dass man in der Liste selbst herumtippt.
- `getText()` liefert den ganzen Text mit allen Zeilen.

## Von einem Reiter zum anderen

Der Knopf **Hinzufügen** steht im Reiter Eingabe, der Textbereich im Reiter Liste. Trotzdem kann der Zuhörer beide benutzen. Alle Bausteine sind Variablen in `main`, und das Lambda sieht sie alle, egal auf welchem Reiter sie später angezeigt werden:

```java
hinzufuegen.addActionListener(e -> {
    bereich.append(feld.getText() + "\n");
    info.setText(feld.getText() + " steht auf der Liste.");
    feld.setText("");
});
```

::: ludwig
Ein Baustein kann nur auf **einer** Fläche liegen. Fügst du denselben Knopf erst zu `eingabe` und dann zu `liste` hinzu, nimmt Swing ihn bei `eingabe` wieder weg. Er erscheint nur im Reiter Liste.
:::

## Speichern im Zuhörer

Zum Speichern nimmst du den `PrintWriter` aus Lektion 23. Im Zuhörer gibt es aber einen Haken: Den Ausweg `throws Exception` aus Lektion 23 gibt es hier nicht. Das Lambda ist eine eigene Methode, `actionPerformed`, und die darf laut Vertrag keine `FileNotFoundException` weiterwerfen. Darum steht das Speichern in try und catch:

```java
speichern.addActionListener(e -> {
    try {
        PrintWriter aus = new PrintWriter("einkaufsliste.txt");
        aus.print(bereich.getText());
        aus.close();
        info.setText("Gespeichert in einkaufsliste.txt");
        reiter.setSelectedIndex(0);
    } catch (FileNotFoundException ex) {
        info.setText("Speichern ging nicht.");
    }
});
```

- Die Exception heißt hier `ex`, weil der Name `e` schon für das Ereignis vergeben ist.
- Nach dem Speichern springt das Fenster mit `setSelectedIndex(0)` zurück zum Reiter Eingabe, wo die Meldung steht.
- VisuStruct zeigt die gespeicherte Datei unter der Konsole, sobald du auf Speichern geklickt hast.

## Das ganze Programm

```java
import javax.swing.*;
import java.awt.*;
import java.io.*;

public class Einkaufsliste {
    public static void main(String[] args) {
        JFrame fenster = new JFrame("Einkaufsliste");
        fenster.setSize(300, 250);
        fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JTabbedPane reiter = new JTabbedPane();

        JPanel eingabe = new JPanel(new GridLayout(0, 1));
        JTextField feld = new JTextField();
        JButton hinzufuegen = new JButton("Hinzufügen");
        JLabel info = new JLabel("Noch nichts auf der Liste.");
        eingabe.add(new JLabel("Was brauchst du?"));
        eingabe.add(feld);
        eingabe.add(hinzufuegen);
        eingabe.add(info);

        JPanel liste = new JPanel(new BorderLayout());
        JTextArea bereich = new JTextArea();
        bereich.setEditable(false);
        JButton speichern = new JButton("Speichern");
        liste.add(bereich, BorderLayout.CENTER);
        liste.add(speichern, BorderLayout.SOUTH);

        reiter.addTab("Eingabe", eingabe);
        reiter.addTab("Liste", liste);

        hinzufuegen.addActionListener(e -> {
            bereich.append(feld.getText() + "\n");
            info.setText(feld.getText() + " steht auf der Liste.");
            feld.setText("");
        });

        speichern.addActionListener(e -> {
            try {
                PrintWriter aus = new PrintWriter("einkaufsliste.txt");
                aus.print(bereich.getText());
                aus.close();
                info.setText("Gespeichert in einkaufsliste.txt");
                reiter.setSelectedIndex(0);
            } catch (FileNotFoundException ex) {
                info.setText("Speichern ging nicht.");
            }
        });

        fenster.add(reiter);
        fenster.setVisible(true);
    }
}
```

Tippe Heu ein, klicke auf Hinzufügen, dann Äpfel und noch einmal Hinzufügen. Wechsle zum Reiter Liste und klicke auf Speichern.

## Spiel: Wo landet es?

::: spiel frage
titel: Spiel: Wo landet es?
intro: Ludwig baut Fenster mit Reitern. Lies den Code und sag voraus, was du siehst. Sechs Runden.

runde:
    reiter.addTab("Eingabe", eingabe);
    reiter.addTab("Liste", liste);
frage: Welcher Reiter ist beim Start offen?
- [x] Eingabe
- Liste
- keiner
> Beim Start ist der Reiter offen, der zuerst hinzugefügt wurde.

runde:
    reiter.addTab("Liste", liste);
    reiter.addTab("Eingabe", eingabe);
frage: Welcher Reiter ist beim Start offen?
- Eingabe
- [x] Liste
- beide
> Diesmal kommt Liste zuerst. Die Reihenfolge von `addTab` bestimmt die Reihenfolge der Reiter.

runde:
    reiter.addTab("Eingabe", eingabe);
    reiter.addTab("Liste", liste);
    reiter.addTab("Hilfe", hilfe);
    reiter.setSelectedIndex(1);
frage: Welcher Reiter ist offen?
- Eingabe
- [x] Liste
- Hilfe
> Gezählt wird ab 0: 0 ist Eingabe, 1 ist Liste, 2 ist Hilfe.

runde:
    hinzufuegen.addActionListener(e -> {
        bereich.append(feld.getText() + "\n");
        feld.setText("");
    });
    // Du tippst Heu, klickst Hinzufügen, tippst Äpfel, klickst Hinzufügen.
frage: Was steht danach im Reiter Liste?
- Äpfel
- HeuÄpfel
- [x] Heu\nÄpfel
> `append` hängt an, und jedes `"\n"` beginnt eine neue Zeile.

runde:
    JButton knopf = new JButton("OK");
    eingabe.add(knopf);
    liste.add(knopf);
frage: Wo erscheint der Knopf OK?
- in beiden Reitern
- nur im Reiter Eingabe
- [x] nur im Reiter Liste
> Ein Baustein kann nur auf einer Fläche liegen. Beim zweiten `add` nimmt Swing ihn von `eingabe` weg.

runde:
    speichern.addActionListener(e -> {
        bereich.setText("");
        reiter.setTitleAt(1, "Liste (leer)");
        reiter.setSelectedIndex(0);
    });
    // Der Knopf speichern liegt im Reiter Liste.
frage: Was siehst du nach dem Klick?
- den leeren Reiter Liste
- [x] den Reiter Eingabe, und der zweite Reiter heißt „Liste (leer)“
- den Reiter Eingabe, der zweite Reiter heißt weiter „Liste“
> Der Zuhörer leert den Bereich, benennt den Reiter um und wechselt zu Reiter 0. Alles passiert bei einem Klick.
:::

## Aufgabe: Einkaufsliste mit Reitern

Baue das Programm nach und probiere es aus.

Dann mach es besser:

- Leere Eingaben kommen nicht auf die Liste. Prüfe vorher `feld.getText().isEmpty()` (Lektion 17).
- Der Reiter Liste zeigt in seinem Titel, wie viele Dinge auf der Liste stehen: „Liste (3)“. Zähle in einer `static int`-Variable mit und benutze `setTitleAt`.
- Zusatz: Ein dritter Reiter **Hilfe** mit einem JLabel, das erklärt, wie das Programm geht.

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann ein Fenster mit zwei Reitern bauen. → Reiter mit JTabbedPane
- Ich kann mit append Zeilen an eine JTextArea anhängen. → Ein Textbereich mit mehreren Zeilen
- Ich kann erklären, warum ein Zuhörer Bausteine auf beiden Reitern benutzen kann. → Von einem Reiter zum anderen
- Ich kann im Zuhörer mit try und catch eine Datei speichern. → Speichern im Zuhörer
- Ich kann eine Einkaufsliste bauen, die mitzählt, wie viele Dinge darauf stehen. → Aufgabe: Einkaufsliste mit Reitern
:::

## Wissenstest

::: quiz
? Welcher Reiter ist nach reiter.setSelectedIndex(0) offen?
→ Reiter mit JTabbedPane
- [x] der erste
- [ ] der zweite
- [ ] keiner

? Warum steht das Speichern im Zuhörer in try und catch?
→ Speichern im Zuhörer
- [ ] Weil PrintWriter nur in try funktioniert.
- [x] Weil actionPerformed keine FileNotFoundException weiterwerfen darf.
- [ ] Weil main kein throws hat.

? Was ist der Unterschied zwischen JTextField und JTextArea?
→ Ein Textbereich mit mehreren Zeilen
- [ ] Es gibt keinen.
- [x] JTextArea kann mehrere Zeilen zeigen.
- [ ] JTextField kann man nicht beschreiben.

? Ordne zu.
→ Reiter mit JTabbedPane
= JTabbedPane -> eine Fläche mit Reitern
= JPanel -> die Fläche eines Reiters
= JTextArea -> ein Textbereich mit mehreren Zeilen
:::
