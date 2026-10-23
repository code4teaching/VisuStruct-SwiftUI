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
