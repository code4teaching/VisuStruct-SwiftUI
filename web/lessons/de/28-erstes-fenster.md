---
titel: Dein erstes Fenster
bereich: Fenster mit Swing
kurz: Mit Java und Swing ein eigenes Fenster öffnen, Zeile für Zeile erklärt.
---

## Programme mit Fenstern

Bisher haben deine Programme Text in die Konsole geschrieben. Die meisten Programme, die du kennst, haben aber **Fenster** mit Knöpfen und Textfeldern. Das nennt man eine grafische Oberfläche.

Java bringt dafür einen Werkzeugkasten mit: **Swing**. In VisuStruct schaltest du ihn so ein:

1. Öffne rechts den Bereich [Programmieren](#zeige-codelive).
2. Klicke oben rechts auf das [Zahnrad](#zeige-einstellungen) und wähle als **Programmiersprache** Java.
3. Setze darunter im Abschnitt Java den Haken bei **Echtes Java (mit Swing)**.

Beim ersten [▶︎ Ausführen](#zeige-ausfuehren) lädt VisuStruct einmalig etwa 40 MB, das dauert einen Moment. Danach läuft dein Code als echtes Java, und deine Fenster erscheinen im Bereich Programmieren im Feld **Java-Fenster** über der Konsole.

> Mit „Echtes Java“ funktionieren Eingaben über die Konsole (`Scanner`) noch nicht. Für Programme mit Eingabe schaltest du den Haken wieder aus.

::: angeberwissen
Swing gibt es seit 1998. Davor hatte Java nur das ältere AWT mit einer Klasse `Frame`. Damit man die neuen Bausteine nicht verwechselt, beginnen in Swing fast alle Namen mit **J**: `JFrame`, `JButton`, `JLabel`. Am J erkennst du Swing also sofort.
:::

## Das ganze Programm

So sieht das kleinste Programm aus, das ein Fenster öffnet. Tippe es im Bereich Programmieren ab und klicke auf [▶︎ Ausführen](#zeige-ausfuehren):

```java
import javax.swing.*;

public class MeinFenster {
    public static void main(String[] args) {
        JFrame fenster = new JFrame("Mein erstes Fenster");
        fenster.setSize(300, 200);
        fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        fenster.setVisible(true);
    }
}
```

Ein leeres graues Fenster mit dem Titel „Mein erstes Fenster“ erscheint. Mehr nicht, aber es ist dein eigenes Fenster!

Den Rahmen mit `public class` und `main` kennst du schon aus der Lektion Java. Neu sind die erste Zeile und die vier Zeilen in `main`. Die schauen wir uns jetzt einzeln an.

::: ludwig
Schau dir das Struktogramm neben dem Code an: Jede Zeile in `main` ist ein Kasten, alle untereinander. Ein Fensterprogramm ist am Anfang also nur eine Sequenz.
:::

## Zeile für Zeile

| Zeile | Was sie macht |
|---|---|
| `import javax.swing.*;` | Holt den Werkzeugkasten Swing ins Programm. Ohne diese Zeile kennt Java `JFrame` nicht. |
| `JFrame fenster = new JFrame("Mein erstes Fenster");` | Baut ein neues Fenster. Der Text in Klammern ist der Titel oben im Fensterrahmen. Über die Variable `fenster` sprichst du es danach an. |
| `fenster.setSize(300, 200);` | Das Fenster wird 300 Pixel breit und 200 Pixel hoch. |
| `fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);` | Schließt jemand das Fenster, endet auch das Programm. |
| `fenster.setVisible(true);` | Jetzt erst wird das Fenster sichtbar. |

Der Punkt in `fenster.setSize(…)` bedeutet: „Fenster, mach das!“ Vor dem Punkt steht, wer etwas tun soll, dahinter, was es tun soll.

> Ohne `setDefaultCloseOperation` versteckt Java das Fenster beim Schließen nur. Das Programm läuft dann unsichtbar weiter.

## Warum setVisible am Ende steht

`setVisible(true)` zeigt das Fenster so, wie es in diesem Moment ist. Deshalb richtest du zuerst alles ein: Titel, Größe, später auch Knöpfe. Erst ganz am Ende machst du das Fenster sichtbar.

Was du erst nach `setVisible(true)` ins Fenster legst, erscheint oft nicht. Java zeichnet das Fenster nämlich nicht von selbst neu. Manchmal taucht es erst auf, wenn man die Größe des Fensters ändert. Solche Fehler sind schwer zu finden.

::: ludwig
Erst einrichten, dann zeigen. Wie im Theater: Der Vorhang geht erst auf, wenn die Bühne fertig aufgebaut ist.
:::

Probier es aus: Lösche die Zeile mit `setVisible(true)` und führe das Programm noch einmal aus. Das Programm läuft, aber du siehst kein Fenster.

## Profiwissen: Klassen und Objekte

Das steht nicht im Lehrplan, hilft dir aber, Swing zu verstehen.

::: angeberwissen
Java ist eigentlich eine **objektorientierte** Sprache. `JFrame` ist eine Klasse, also ein Bauplan für Fenster. Mit `new JFrame(…)` baut Java nach diesem Bauplan ein echtes Fenster, ein **Objekt**. Du könntest mit zwei `new` auch zwei Fenster bauen, beide nach demselben Bauplan.

`setSize` und `setVisible` sind Methoden, die jedes Fenster-Objekt kann. Deshalb schreibst du `fenster.setSize(…)`: Das Objekt `fenster` führt seine Methode aus. Auch dein Programm selbst ist eine Klasse, nämlich `MeinFenster`.
:::

## Spiel: Was passiert?

::: spiel frage
titel: Spiel: Was passiert?
intro: Ludwig hat am Fensterprogramm herumgebastelt. Lies die Zeilen und sag vorher, was passiert. Sechs Runden.

runde:
    JFrame fenster = new JFrame("Hallo");
    fenster.setSize(300, 200);
    fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
frage: Was siehst du nach dem Ausführen?
- ein Fenster mit dem Titel „Hallo“
- [x] gar kein Fenster
- eine Fehlermeldung
> `setVisible(true)` fehlt. Das Fenster ist gebaut, bleibt aber unsichtbar.

runde:
    JFrame fenster = new JFrame("Hallo");
    fenster.setSize(200, 300);
    fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    fenster.setVisible(true);
frage: Wie sieht das Fenster aus?
- breiter als hoch
- [x] höher als breit
- quadratisch
> Die erste Zahl ist die Breite, die zweite die Höhe: 200 breit, 300 hoch.

runde:
    JFrame fenster = new JFrame("Hallo");
    fenster.setSize(300, 200);
    fenster.setVisible(true);
frage: Du schließt das Fenster. Was passiert mit dem Programm?
- Es endet.
- [x] Es läuft unsichtbar weiter.
- Das Fenster geht sofort wieder auf.
> Ohne `setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE)` versteckt Java das Fenster nur.

runde:
    JFrame fenster = new JFrame();
    fenster.setSize(300, 200);
    fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    fenster.setVisible(true);
frage: Was steht oben im Fensterrahmen?
- fenster
- JFrame
- [x] nichts, der Titel ist leer
> Ohne Text in den Klammern hat das Fenster keinen Titel. Der Variablenname `fenster` erscheint nie im Fenster.

runde:
    public class Test {
        public static void main(String[] args) {
            JFrame fenster = new JFrame("Test");
            fenster.setVisible(true);
        }
    }
frage: Was meldet javac?
- [x] cannot find symbol: class JFrame
- nichts, das Fenster erscheint
- missing return statement
> Die Zeile `import javax.swing.*;` fehlt. Ohne sie kennt Java `JFrame` nicht.

runde:
    JFrame a = new JFrame("Eins");
    JFrame b = new JFrame("Zwei");
    a.setSize(300, 200);
    b.setSize(300, 200);
    a.setVisible(true);
frage: Was siehst du?
- [x] ein Fenster mit dem Titel „Eins“
- zwei Fenster
- ein Fenster mit dem Titel „Zwei“
> Zwei Fenster nach demselben Bauplan, aber nur `a` wird sichtbar gemacht.
:::

## Aufgabe: Dein eigenes Fenster

Ändere das Programm so, dass

- im Titel „Hallo“ und dein Name steht,
- das Fenster 400 Pixel breit und 300 Pixel hoch ist,
- das Programm endet, wenn du das Fenster schließt.

Führe es aus und prüfe alle drei Punkte.

::: ludwig
Du willst nicht so viel tippen? Mit „Echtes Java“ darfst du im Bereich Programmieren auch nur die vier Zeilen aus `main` schreiben. VisuStruct packt sie dann selbst in eine Klasse und ergänzt die `import`-Zeilen. In einer richtigen Java-Entwicklungsumgebung brauchst du aber das ganze Programm.
:::

## Checkliste

::: checkliste
- Ich kann im Bereich Programmieren „Echtes Java“ einschalten. → Programme mit Fenstern
- Ich kann ein Fenster mit Titel und Größe öffnen. → Das ganze Programm
- Ich weiß, was jede Zeile des Fensterprogramms macht. → Zeile für Zeile
- Ich weiß, warum setVisible(true) am Ende steht. → Warum setVisible am Ende steht
:::

## Wissenstest

::: quiz
? Welche Zeile macht das Fenster sichtbar?
- [ ] fenster.setSize(300, 200);
- [x] fenster.setVisible(true);
- [ ] new JFrame("Hallo");
> Ohne setVisible(true) bleibt das Fenster unsichtbar.

? Wo steht fenster.setVisible(true) am besten?
- [ ] Ganz am Anfang von main
- [x] Am Ende, wenn das Fenster fertig eingerichtet ist
- [ ] Das ist egal.
> Was nach setVisible(true) dazukommt, erscheint oft nicht.

? Was bewirkt setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE)?
- [ ] Das Fenster schließt sich sofort.
- [x] Schließt man das Fenster, endet das Programm.
- [ ] Das Fenster lässt sich nicht mehr schließen.

? Woran erkennst du Bausteine aus Swing?
- [x] Ihr Name beginnt mit J, z. B. JFrame.
- [ ] Sie stehen in geschweiften Klammern.
- [ ] Sie enden mit Window.
:::
