---
titel: Model View Controller
bereich: Fenster mit Swing
kurz: Den Klickzähler in Model, View und Controller zerlegen und verstehen, wer mit wem redet.
---

## Das Ziel

Große Programme mit Fenstern haben fast immer denselben Aufbau. Er heißt **Model View Controller**, kurz **MVC**:

- Das **Model** hält die Daten und kennt ihre Regeln.
- Die **View** zeigt die Daten nur an.
- Der **Controller** reagiert auf Klicks und gibt Bescheid.

Du lernst MVC am Klickzähler aus Lektion 32. Er wird Schritt für Schritt in drei Teile zerlegt. Am Ende zeigt er denselben Zählerstand zweimal an: als Zahl und als Balken.

Schalte im [Zahnrad](#zeige-einstellungen) **Echtes Java (mit Swing)** ein.

## Alles in einer Klasse

So sah der Klickzähler bisher aus, alles steckt in `main` und einer Variable der Klasse:

```
static int anzahl = 0;

public static void main(String[] args) {
    // ... Fenster bauen ...
    JLabel zahl = new JLabel("0", SwingConstants.CENTER);
    JButton plus = new JButton("+1");
    plus.addActionListener(e -> {
        anzahl++;
        zahl.setText("" + anzahl);
    });
}
```

Das läuft. Aber stell dir vor, der Zählerstand soll zusätzlich als Balken erscheinen, später noch in einem zweiten Fenster und in einer Datei. Dann muss jeder Zuhörer an alle Anzeigen denken. Rechnen und Anzeigen sind ineinander verknotet, und mit jeder Anzeige wird der Knoten größer.

MVC löst den Knoten: Jede Aufgabe bekommt ihre eigene Klasse.

## Das Model

Das Model ist der Zähler selbst, ganz ohne Swing:

```
class Zaehler {
    int wert = 0;

    void erhoehen() {
        wert++;
    }

    int getWert() {
        return wert;
    }
}
```

- Diesmal steht vor `wert` und den Methoden kein `static`. Dann gehören sie zu einem **Objekt**: `new Zaehler()` baut einen Zähler mit eigenem `wert`, so wie `new JButton("+1")` einen Knopf mit eigener Beschriftung baut.
- `model.erhoehen()` ruft die Methode dieses einen Zählers auf, genau wie `knopf.setText(…)`.
- Wer den Wert wissen will, fragt mit `getWert()`. Ändern geht nur über `erhoehen()`.

Weil das Model kein Fenster braucht, kannst du es ganz ohne Fenster ausprobieren:

```
public class ZaehlerTest {
    public static void main(String[] args) {
        Zaehler model = new Zaehler();
        model.erhoehen();
        model.erhoehen();
        System.out.println(model.getWert());
    }
}

class Zaehler {
    int wert = 0;

    void erhoehen() {
        wert++;
    }

    int getWert() {
        return wert;
    }
}
```

Die Ausgabe ist 2. Mehrere Klassen dürfen in einer Datei stehen. Nur eine davon ist `public`, und die enthält `main`.

## Die View

Die View zeigt den Wert an und macht sonst nichts. Sie rechnet nicht und weiß nicht, woher die Zahl kommt:

```
class ZahlAnzeige {
    JLabel zahl = new JLabel("0", SwingConstants.CENTER);

    void aktualisieren(int wert) {
        zahl.setText("" + wert);
    }
}
```

- Die View bekommt den Wert mit `aktualisieren(int wert)` geliefert und schreibt ihn in ihr JLabel.
- Fenster und Knopf baust du wie immer in `main`. Mit `fenster.add(view.zahl)` kommt das JLabel der View ins Fenster.

## Der Controller

Der Controller ist der Zuhörer am Knopf. Er verbindet Model und View:

```
Zaehler model = new Zaehler();
ZahlAnzeige view = new ZahlAnzeige();

plus.addActionListener(e -> {
    model.erhoehen();
    view.aktualisieren(model.getWert());
});
```

- Erst ändert er das Model, dann holt er den neuen Wert und gibt ihn der View.
- Das Problem aus Lektion 32 ist weg: Die Variable `model` ändert sich nie, sie zeigt immer auf denselben Zähler. Nur der `wert` darin ändert sich. Deshalb darf das Lambda `model` benutzen, ganz ohne `static`.

## Wer redet mit wem?

Bei jedem Klick laufen vier Nachrichten, immer in derselben Reihenfolge:

::: grafik mvc-klick.svg
Die Pfeile leuchten der Reihe nach auf. Das Model zählt beim zweiten Pfeil hoch, die Anzeige erst beim vierten.
:::

1. Der Knopf meldet den Klick an den Controller (`actionPerformed`).
2. Der Controller sagt dem Model: `erhoehen()`.
3. Der Controller fragt das Model nach dem neuen Wert: `getWert()`.
4. Der Controller gibt den Wert an die View: `aktualisieren(wert)`.

Das Model redet mit niemandem. Es wartet, bis es gefragt wird.

::: ludwig
Merk dir: Das Model weiß nichts von Fenstern. In `Zaehler` steht kein einziges `JLabel` und kein `import javax.swing`. Wenn du dort Swing brauchst, gehört der Code in die View.
:::

## Der Gewinn: eine zweite View

Jetzt soll der Zählerstand zusätzlich als Balken erscheinen. Dafür kommt eine zweite View dazu. Ein `JProgressBar` ist ein Balken, der sich füllt, hier von 0 bis 10:

```
class BalkenAnzeige {
    JProgressBar balken = new JProgressBar(0, 10);

    void aktualisieren(int wert) {
        balken.setValue(wert);
    }
}
```

Der Controller bekommt eine Zeile mehr. Das Model bleibt genau, wie es war:

```
plus.addActionListener(e -> {
    model.erhoehen();
    view.aktualisieren(model.getWert());
    balken.aktualisieren(model.getWert());
});
```

Genau das ist der Gewinn von MVC: Du kannst Anzeigen dazubauen oder austauschen, ohne das Model anzufassen.

## Das ganze Programm

```
import javax.swing.*;
import java.awt.*;

class Zaehler {
    int wert = 0;

    void erhoehen() {
        wert++;
    }

    int getWert() {
        return wert;
    }
}

class ZahlAnzeige {
    JLabel zahl = new JLabel("0", SwingConstants.CENTER);

    void aktualisieren(int wert) {
        zahl.setText("" + wert);
    }
}

class BalkenAnzeige {
    JProgressBar balken = new JProgressBar(0, 10);

    void aktualisieren(int wert) {
        balken.setValue(wert);
    }
}

public class KlickZaehler {
    public static void main(String[] args) {
        Zaehler model = new Zaehler();
        ZahlAnzeige view = new ZahlAnzeige();
        BalkenAnzeige balken = new BalkenAnzeige();

        JFrame fenster = new JFrame("Klickzähler");
        fenster.setSize(250, 200);
        fenster.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        fenster.setLayout(new GridLayout(0, 1));

        JButton plus = new JButton("+1");
        plus.addActionListener(e -> {
            model.erhoehen();
            view.aktualisieren(model.getWert());
            balken.aktualisieren(model.getWert());
        });

        fenster.add(view.zahl);
        fenster.add(balken.balken);
        fenster.add(plus);
        fenster.setVisible(true);
    }
}
```

Klick ein paar Mal auf +1 und sieh zu, wie Zahl und Balken gemeinsam wachsen.

::: angeberwissen
MVC hat sich der Norweger Trygve Reenskaug 1979 ausgedacht, im Forschungszentrum Xerox PARC in Kalifornien. Dort standen damals schon Computer mit Fenstern und Maus. Im selben Jahr besuchte Steve Jobs das Labor und war so begeistert, dass Apple danach Computer mit Fenstern und Maus baute.
:::

## Spiel: Wohin gehört der Code?

::: spiel frage
titel: Spiel: Wohin gehört der Code?
intro: Ludwig hat Code aus einem MVC-Programm auf einen Haufen geworfen. Sortier jedes Stück ein. Acht Runden.
frage: Wohin gehört dieser Code?
antworten: Model | View | Controller

runde:
    int wert = 0;
richtig: Model
> Der Zählerstand sind die Daten. Daten wohnen im Model.

runde:
    zahl.setText("" + wert);
richtig: View
> Etwas auf dem Bildschirm anzeigen ist die Aufgabe der View.

runde:
    plus.addActionListener(e -> model.erhoehen());
richtig: Controller
> Auf einen Klick reagieren und dem Model Bescheid geben: Das macht der Controller.

runde:
    void erhoehen() {
        wert++;
    }
richtig: Model
> Das Model weiß selbst, wie es seine Daten ändert.

runde:
    balken.setValue(wert);
richtig: View
> Ein Balken, der sich füllt, zeigt nur an. Also View.

runde:
    void erhoehen() {
        if (wert < 10) {
            wert++;
        }
    }
richtig: Model
> „Höchstens 10“ ist eine Regel für die Daten. Regeln gehören ins Model, dann gelten sie für jeden Knopf und jede View.

runde:
    view.aktualisieren(model.getWert());
richtig: Controller
> Den Wert beim Model abholen und der View geben: Das ist der Controller in der Mitte.

runde:
    JLabel zahl = new JLabel("0", SwingConstants.CENTER);
richtig: View
> Ein JLabel ist ein Baustein der Oberfläche. Im Model steht kein Swing.
:::

## Spiel: Wer ist dran?

::: spiel reihenfolge
titel: Spiel: Wer ist dran?
intro: Nach einem Klick reden Model, View und Controller miteinander, aber nur in einer Reihenfolge funktioniert es. Bring die Schritte in die richtige Reihenfolge. Fünf Runden.

runde:
frage: Du klickst im Klickzähler auf +1. Was passiert der Reihe nach?
- Du klickst auf +1.
- Der Controller bekommt `actionPerformed`.
- Der Controller ruft `model.erhoehen()` auf.
- Das Model zählt `wert` hoch.
- Der Controller holt `model.getWert()`.
- Die View zeigt die neue Zahl.
> Klick, Controller, Model ändern, Wert holen, anzeigen. Das sind die vier Pfeile aus der Grafik, mit dem Hochzählen in der Mitte.

runde:
    plus.addActionListener(e -> {
        model.erhoehen();
        view.aktualisieren(model.getWert());
        balken.aktualisieren(model.getWert());
    });
frage: Was passiert nach einem Klick auf +1 der Reihe nach?
- Der Klick auf +1
- `model.erhoehen()`
- Die Zahl zeigt den neuen Wert.
- Der Balken wächst.
> Der Zuhörer arbeitet seine Zeilen von oben nach unten ab: erst das Model, dann die Zahl, dann der Balken.

runde:
frage: Bring den Controller in die richtige Reihenfolge, damit die View die neue Zahl zeigt.
- `plus.addActionListener(e -> {`
- `model.erhoehen();`
- `view.aktualisieren(model.getWert());`
- `});`
> Erst ändern, dann anzeigen. Andersherum zeigt die View noch den alten Wert.

runde:
    reset.addActionListener(e -> {
        model.zuruecksetzen();
        view.aktualisieren(model.getWert());
    });
frage: Der Zähler steht auf 5. Du klickst auf Reset. Was passiert der Reihe nach?
- Du klickst auf Reset.
- Das Model setzt `wert` auf 0.
- `model.getWert()` liefert 0.
- Die View zeigt 0.
> Auch Reset läuft über den Controller ins Model. Die View erfährt den neuen Wert erst ganz am Schluss.

runde:
frage: Ein Test ohne Fenster soll 1 ausgeben. In welcher Reihenfolge stehen die Zeilen in main?
- `Zaehler model = new Zaehler();`
- `model.erhoehen();`
- `System.out.println(model.getWert());`
> Erst das Objekt bauen, dann damit arbeiten, zum Schluss nachsehen. Das Model lässt sich ganz ohne Fenster testen.
:::

## Aufgabe: Ein Zähler mit Grenzen

Baue das ganze Programm und probier es aus.

Dann mach es besser:

- Ein Knopf **−1** zählt herunter. Das Model bekommt dafür eine Methode `verringern()`, der Controller einen zweiten Zuhörer.
- Ein Knopf **Reset** setzt den Zähler mit `zuruecksetzen()` auf 0.
- Das Model achtet selbst auf die Grenzen: nie unter 0 und nie über 10, denn dann ist der Balken voll.
- Extra: eine dritte View `KonsolenAnzeige`, deren `aktualisieren` mit `System.out.println` „Neuer Wert: 3“ ausgibt. Eine View muss kein Fenster sein.

## Checkliste

::: checkliste
- Ich kann sagen, was Model, View und Controller jeweils tun. → Das Ziel
- Ich kann ein Model ohne Swing schreiben und ohne Fenster testen. → Das Model
- Ich weiß, was new Zaehler() baut und warum dort kein static steht. → Das Model
- Ich kenne die vier Nachrichten nach einem Klick. → Wer redet mit wem?
- Ich kann eine zweite View dazubauen, ohne das Model zu ändern. → Der Gewinn: eine zweite View
- Mein Zähler hat −1, Reset und Grenzen im Model. → Aufgabe: Ein Zähler mit Grenzen
:::

## Wissenstest

::: quiz
? Wo steht die Regel „Der Zähler geht nie über 10“?
- [x] im Model
- [ ] in der View
- [ ] im Controller
> Regeln über die Daten gehören ins Model. Dann gelten sie, egal welcher Knopf drückt.

? Was macht die View?
- [ ] Sie rechnet den neuen Wert aus.
- [x] Sie zeigt den Wert an, den sie bekommt.
- [ ] Sie hört auf Klicks.

? Warum darf das Lambda model benutzen, obwohl model eine Variable von main ist?
- [ ] Weil Zaehler public ist.
- [x] Weil model immer auf denselben Zähler zeigt; nur der wert darin ändert sich.
- [ ] Weil Lambdas alle Variablen ändern dürfen.

? Was musst du am Model ändern, wenn eine zweite View dazukommt?
- [x] nichts
- [ ] eine zweite Methode erhoehen
- [ ] ein zweites JLabel

? Ordne zu.
= Zaehler mit wert und erhoehen() -> Model
= ZahlAnzeige mit aktualisieren(int wert) -> View
= der Zuhörer am Knopf -> Controller
:::
