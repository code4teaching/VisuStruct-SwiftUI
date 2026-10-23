---
titel: Der Knopf reagiert
bereich: Fenster mit Swing
kurz: Mit einem ActionListener festlegen, was beim Klick passiert.
---

## Ein Klick ist ein Ereignis

In der letzten Lektion ließ sich der Knopf drücken, aber nichts geschah. Bei einem Fensterprogramm bestimmt nämlich der Mensch, wann etwas passiert: Er klickt, tippt oder schließt ein Fenster. Jede solche Aktion heißt **Ereignis**.

Dein Programm muss deshalb auf den Klick warten und ihn bemerken. Dafür meldest du beim Knopf einen Zuhörer an, einen **ActionListener** (englisch für „Aktions-Zuhörer“). Bei jedem Klick ruft der Knopf seinen Zuhörer, und der führt deinen Code aus.

::: ludwig
Bisher lief dein Programm von oben nach unten durch, wie im Struktogramm. Der Code im Zuhörer läuft dagegen erst später, nämlich immer dann, wenn jemand klickt. Wie oft das ist, weiß vorher niemand.
:::

## Die Zeile mit dem Pfeil

So meldest du den Zuhörer an:

```
knopf.addActionListener(e -> knopf.setText("Ich wurde geklickt"));
```

Von außen nach innen gelesen:

- `knopf.addActionListener( … )` meldet beim Knopf einen Zuhörer an.
- `e` ist das Ereignis. Darin steht zum Beispiel, wann geklickt wurde. Hier brauchst du es nicht, aber der Name muss dastehen.
- `->` liest du als „dann mach“.
- `knopf.setText("Ich wurde geklickt")` ist das, was beim Klick passiert: Der Knopf bekommt eine neue Beschriftung.

Die Zeile steht nach `new JButton(…)`, denn den Knopf muss es schon geben. Und wie alles andere kommt sie vor `setVisible(true)`.

## Das ganze Programm

```
import javax.swing.*;
import java.awt.*;

public class KlickMich {
    public static void main(String[] args) {
        JFrame fenster = new JFrame("Klick mich");
        fenster.setSize(300, 200);
        fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        fenster.setLayout(new FlowLayout());

        JButton knopf = new JButton("Klick mich");
        knopf.addActionListener(e -> knopf.setText("Ich wurde geklickt"));
        fenster.add(knopf);

        fenster.setVisible(true);
    }
}
```

Führe es aus und klicke auf den Knopf. Jetzt steht darauf „Ich wurde geklickt“.

> Ist der neue Text länger als der alte, macht das FlowLayout den Knopf von selbst breiter.

## Mehrere Anweisungen beim Klick

Soll beim Klick mehr als eine Sache passieren, setzt du hinter den Pfeil geschweifte Klammern. Darin steht jede Anweisung mit Semikolon, wie in einem Schleifenrumpf:

```
knopf.addActionListener(e -> {
    knopf.setText("Ich wurde geklickt");
    fenster.setTitle("Danke!");
    System.out.println("Klick!");
});
```

`System.out.println` schreibt wie gewohnt in die [Konsole](#zeige-konsole). Klicke mehrmals: Bei jedem Klick erscheint eine neue Zeile „Klick!“. So siehst du, dass der Code im Zuhörer wirklich bei jedem Klick läuft.

::: ludwig
Achte auf das Ende: Erst schließt `}` den Block, dann `)` die Klammer von `addActionListener`, dann kommt das Semikolon. Also `});`. Fehlt etwas davon, steht unter dem Code ein Hinweis.
:::

## Spiel: Wer hört zu?

::: spiel zuhoerer
titel: Spiel: Wer hört zu?
intro: Ludwig zeigt dir Code und das Fenster dazu. Darunter steht, welche Knöpfe nacheinander geklickt werden. Was passiert? Nach deiner Antwort spielt Ludwig die Klicks ab: Du siehst, welcher Zuhörer das Ereignis hört und welche Zeilen dann laufen.
frage: Was steht nach den Klicks in der Beschriftung?

runde:
    JFrame fenster = new JFrame("Gruß");
    JLabel text = new JLabel("Start");
    JButton knopf = new JButton("Hallo");
    knopf.addActionListener(e -> text.setText("Hallo Welt"));
klicks: Hallo
- Start
- [x] Hallo Welt
- Hallo
> Der Knopf hat einen Zuhörer. Beim Klick führt er `text.setText("Hallo Welt")` aus, und die Beschriftung zeigt „Hallo Welt“.

runde:
    JFrame fenster = new JFrame("Obst");
    JLabel text = new JLabel("?");
    JButton a = new JButton("A");
    JButton b = new JButton("B");
    a.addActionListener(e -> text.setText("Apfel"));
    b.addActionListener(e -> text.setText("Birne"));
klicks: A, B
- Apfel
- [x] Birne
- Apfel Birne
> Jeder Knopf hat seinen eigenen Zuhörer. Erst schreibt A „Apfel“ hinein, dann überschreibt B das mit „Birne“. `setText` ersetzt den alten Text, es hängt nichts an.

runde:
    JFrame fenster = new JFrame("Obst");
    JLabel text = new JLabel("?");
    JButton a = new JButton("A");
    JButton b = new JButton("B");
    a.addActionListener(e -> text.setText("Apfel"));
klicks: B
- Apfel
- Birne
- [x] ?
> Beim Knopf B hat sich niemand angemeldet: Es gibt kein `b.addActionListener`. Der Klick ist ein Ereignis, aber niemand hört zu. Deshalb bleibt das Fragezeichen stehen.

runde:
    JFrame fenster = new JFrame("Farben");
    JLabel text = new JLabel("keine");
    JButton rot = new JButton("Rot");
    JButton blau = new JButton("Blau");
    rot.addActionListener(e -> text.setText("Blau"));
    blau.addActionListener(e -> text.setText("Rot"));
klicks: Rot
- Rot
- [x] Blau
- keine
> Aufgepasst: Was passiert, entscheidet der Code im Zuhörer, nicht die Beschriftung des Knopfs. Der Zuhörer am Knopf „Rot“ schreibt „Blau“ hinein.

runde:
    JFrame fenster = new JFrame("Knopf");
    JLabel text = new JLabel("Bitte klicken");
    JButton knopf = new JButton("Klick mich");
    knopf.addActionListener(e -> {
        knopf.setText("Danke!");
        text.setText("Geklickt");
    });
klicks: Klick mich
frage: Was steht nach dem Klick auf dem Knopf?
- Klick mich
- [x] Danke!
- Geklickt
> Im Block hinter dem Pfeil stehen zwei Anweisungen. Beide laufen beim Klick nacheinander: Der Knopf bekommt „Danke!“, die Beschriftung „Geklickt“.

runde:
    JFrame fenster = new JFrame("Konsole");
    JButton knopf = new JButton("Los");
    knopf.addActionListener(e -> System.out.println("Klick!"));
klicks: Los, Los, Los
frage: Wie viele Zeilen „Klick!“ stehen danach in der Konsole?
- 1
- [x] 3
- 0
> Der Zuhörer läuft bei **jedem** Klick, nicht nur beim ersten. Drei Klicks, drei Zeilen.
:::

## Profiwissen: ActionListener ist ein Interface

Das steht nicht im Lehrplan. Wenn du wissen willst, was hinter dem Pfeil steckt, lies weiter.

::: angeberwissen
`ActionListener` ist ein **Interface**, eine Art Vertrag. Darin steht: Wer ein ActionListener sein will, muss eine Methode `actionPerformed(ActionEvent e)` haben. Der Knopf ruft bei jedem Klick genau diese Methode auf.
:::

Die Zeile mit dem Pfeil kennst du schon aus Schritt 2:

```
knopf.addActionListener(e -> knopf.setText("Ich wurde geklickt"));
```

Ohne Pfeil schreibt man den Zuhörer als Klasse ohne Namen, die den Vertrag erfüllt (eine anonyme Klasse):

```
knopf.addActionListener(new ActionListener() {
    public void actionPerformed(ActionEvent e) {
        knopf.setText("Ich wurde geklickt");
    }
});
```

Dafür brauchst du oben noch `import java.awt.event.*;`. Beide Schreibweisen machen genau dasselbe. Der Pfeil `e -> …` ist die Kurzform (ein Lambda-Ausdruck, seit Java 8): `e` ist der Parameter von `actionPerformed`, und hinter dem Pfeil steht ihr Rumpf. Die Kurzform geht, weil das Interface nur eine einzige Methode hat. Java weiß also, welche Methode gemeint ist.

## Spiel: Vertrag erfüllt?

::: spiel vertrag
titel: Spiel: Vertrag erfüllt?
intro: Der Vertrag `ActionListener` verlangt genau eine Methode: `public void actionPerformed(ActionEvent e)`. Ludwig zeigt dir Code. Erfüllt er den Vertrag, sodass man ihn beim Knopf anmelden kann? Jede Antwort hat Ludwig mit dem echten Java-Compiler geprüft.
frage: Erfüllt das den Vertrag ActionListener?
antworten: erfüllt | nicht erfüllt

runde:
    class Gruss implements ActionListener {
        public void actionPerformed(ActionEvent e) {
            System.out.println("Hallo");
        }
    }
richtig: erfüllt
> Alles da: `implements ActionListener` unterschreibt den Vertrag, und die Methode heißt genau `actionPerformed`, ist `public`, gibt nichts zurück (`void`) und bekommt ein `ActionEvent`.

runde:
    class Gruss implements ActionListener {
        public void actionPerfomed(ActionEvent e) {
            System.out.println("Hallo");
        }
    }
richtig: nicht erfüllt
> Schau genau hin: `actionPerfomed` statt `actionPerformed`, ein r fehlt. Für Java ist das eine ganz andere Methode. Der Compiler meldet, dass `actionPerformed` fehlt.

runde:
    class Gruss implements ActionListener {
        public void actionPerformed() {
            System.out.println("Hallo");
        }
    }
richtig: nicht erfüllt
> Der Parameter fehlt. Der Vertrag verlangt `actionPerformed(ActionEvent e)`, denn der Knopf übergibt beim Klick das Ereignis.

runde:
    class Gruss implements ActionListener {
        public void actionPerformed(ActionEvent ereignis) {
            System.out.println("Hallo");
        }
    }
richtig: erfüllt
> Der Name des Parameters ist frei wählbar. Wichtig ist nur der Typ `ActionEvent`. Statt `e` darf er also auch `ereignis` heißen.

runde:
    class Gruss implements ActionListener {
        void actionPerformed(ActionEvent e) {
            System.out.println("Hallo");
        }
    }
richtig: nicht erfüllt
> Das `public` fehlt. Alle Methoden eines Interfaces sind öffentlich, denn der Knopf muss sie von außen aufrufen können. Ohne `public` meldet der Compiler einen Fehler.

runde:
    class Gruss implements ActionListener {
        public int actionPerformed(ActionEvent e) {
            return 0;
        }
    }
richtig: nicht erfüllt
> Der Vertrag sagt `void`: Die Methode gibt nichts zurück. Mit `int` als Rückgabetyp passt sie nicht mehr.

runde:
    class Gruss implements ActionListener {
        public void actionPerformed(ActionEvent e) {
            sagHallo();
        }
        void sagHallo() {
            System.out.println("Hallo");
        }
    }
richtig: erfüllt
> Zusätzliche Methoden sind erlaubt. Der Vertrag verlangt nur, dass `actionPerformed` da ist, nicht, dass sonst nichts da ist.

runde:
    class Gruss {
        public void actionPerformed(ActionEvent e) {
            System.out.println("Hallo");
        }
    }
    knopf.addActionListener(new Gruss());
richtig: nicht erfüllt
> Die Methode stimmt, aber der Vertrag ist nicht unterschrieben: Es fehlt `implements ActionListener`. Java nimmt beim Knopf nur Objekte an, die den Vertrag offiziell erfüllen.

runde:
    knopf.addActionListener(e -> System.out.println("Hallo"));
richtig: erfüllt
> Der Pfeil ist die Kurzform. Weil der Vertrag nur eine Methode hat, weiß Java: `e` ist der Parameter von `actionPerformed`, und hinter dem Pfeil steht ihr Rumpf.

runde:
    knopf.addActionListener((a, b) -> System.out.println("Hallo"));
richtig: nicht erfüllt
> Hier hat der Pfeil zwei Parameter. `actionPerformed` bekommt aber genau einen, das Ereignis. Darum passt diese Kurzform nicht zum Vertrag.
:::

## Aufgabe: Ich wurde geklickt

Jetzt machst du die Aufgabe fertig: Baue ein Fenster mit einem Knopf „Klick mich“ in normaler Größe. Nach dem Klick steht auf dem Knopf „Ich wurde geklickt“.

Zusatz: Baue zwei Knöpfe „Rot“ und „Blau“. Ein Klick auf einen Knopf schreibt seinen Namen in den Titel des Fensters, zum Beispiel „Du hast Rot gewählt“.

::: ludwig
Jeder Knopf bekommt seinen eigenen Zuhörer mit eigenem `addActionListener`. Den Titel änderst du mit `fenster.setTitle(…)`.
:::

## Checkliste

::: checkliste
- Ich weiß, was ein Ereignis ist. → Ein Klick ist ein Ereignis
- Ich kann mit addActionListener festlegen, was beim Klick passiert. → Die Zeile mit dem Pfeil
- Ich kann beim Klick mehrere Anweisungen ausführen. → Mehrere Anweisungen beim Klick
- Mein Knopf zeigt nach dem Klick „Ich wurde geklickt“. → Aufgabe: Ich wurde geklickt
:::

## Wissenstest

::: quiz
? Was ist ein ActionListener?
- [ ] Ein Knopf mit Text
- [x] Ein Zuhörer, der bei jedem Klick deinen Code ausführt
- [ ] Ein Layout für Fenster
> Du meldest ihn mit addActionListener beim Knopf an.

? Wann läuft knopf.setText("Ich wurde geklickt") im Zuhörer?
- [ ] Sofort beim Start des Programms
- [x] Jedes Mal, wenn jemand auf den Knopf klickt
- [ ] Nur beim ersten Klick
> Der Code im Zuhörer läuft erst, wenn das Ereignis eintritt.

? Wie endet ein Zuhörer mit geschweiften Klammern?
- [ ] };)
- [x] });
- [ ] );}
> Erst schließt der Block, dann die Klammer von addActionListener, dann das Semikolon.

? Ordne jedem Teil seine Aufgabe zu.
= JButton -> ein Knopf
= addActionListener -> Zuhörer anmelden
= setText -> Beschriftung ändern
= setVisible(true) -> Fenster zeigen
:::
