---
titel: Simulation und Schreibtischtest
bereich: Grundlagen
kurz: Ein Struktogramm Schritt für Schritt ausführen, von Hand nachrechnen und Fehler finden.
---

## Die Simulation starten

Bevor es mit Verzweigungen und Schleifen weitergeht, lernst du dein wichtigstes Werkzeug kennen. Mit der Simulation prüfst du ab jetzt jede Übung selbst.

Mit [▶︎ Simulation](#zeige-simulation) in der Leiste führt VisuStruct dein Struktogramm aus. Solange die Simulation läuft, kannst du das Diagramm nicht bearbeiten. Mit **✎ Diagramm** an derselben Stelle kehrst du zum Bearbeiten zurück.

Rechts erscheint die **Steuerung**:

- **Start** führt das Diagramm automatisch Schritt für Schritt aus. Wie lange zwischen zwei Schritten gewartet wird, stellst du bei **Pause pro Schritt** ein.
- **Pause** hält an. Danach geht es mit Start oder Schritt weiter.
- **Schritt** führt genau einen Schritt aus. So kannst du in Ruhe zuschauen.
- **Stopp** bricht ab und setzt alles auf den Anfang zurück.

Öffne das folgende Diagramm im Editor und gehe es mit **Schritt** durch:

::: diagramm sim-tausch.visustruct
Die Werte von a und b werden vertauscht. Die Variable hilf merkt sich dabei einen Wert.
:::

## Was die Simulation anzeigt

- **Markierung:** Ein Kasten im Diagramm ist farbig hervorgehoben. Bei **Letzter Schritt** ist es der Kasten, der gerade ausgeführt wurde. Bei **Nächster Schritt** ist es der Kasten, der als Nächstes drankommt.
- **Eingabe:** Fragt das Diagramm nach einem Wert, tippst du ihn hier ein und bestätigst mit **OK**.
- **Letzter Schritt:** Hier steht, was gerade passiert ist, z. B. `a = 5 -> 5` nach dem Kasten `a = b`. Links sind die Variablen schon durch ihre Werte ersetzt, rechts vom Pfeil steht das Ergebnis.
- **Variablen:** Alle Variablen mit ihren aktuellen Werten.
- **Ausgabe:** Alles, was mit `output:` ausgegeben wurde.

Am Ende erscheint **Simulation beendet**. Geht etwas schief, bleibt die Simulation auf dem fehlerhaften Kasten stehen und zeigt eine Meldung, z. B. **Unbekannte Variable: gesamt**.

## Der Schreibtischtest

Beim **Schreibtischtest** spielst du selbst den Computer. Du gehst das Struktogramm mit Stift und Papier durch und schreibst nach jedem Schritt die Werte der Variablen auf. Am besten machst du eine Tabelle: eine Spalte für den Schritt, eine für jede Variable und eine für die Ausgabe.

Für das Diagramm oben sieht die Tabelle so aus:

| Schritt | a | b | hilf | Ausgabe |
|---|---|---|---|---|
| `int a = 3` | 3 | – | – | |
| `int b = 5` | 3 | 5 | – | |
| `int hilf = a` | 3 | 5 | 3 | |
| `a = b` | 5 | 5 | 3 | |
| `b = hilf` | 5 | 3 | 3 | |
| `output: "a = " + a` | 5 | 3 | 3 | a = 5 |
| `output: "b = " + b` | 5 | 3 | 3 | b = 3 |

Vergleiche danach deine Tabelle mit der Simulation. Stimmen die Werte unter **Variablen** nach jedem Schritt mit deiner Zeile überein?

> Der Schreibtischtest lohnt sich besonders in Prüfungen. Dort hast du keinen Computer, aber du kannst trotzdem zeigen, was dein Struktogramm tut.

## Fehler finden

Gibt ein Struktogramm etwas Falsches aus, gehst du so vor:

1. **Erwartung aufschreiben:** Was soll bei einer bestimmten Eingabe herauskommen?
2. **Schritt für Schritt ausführen:** Starte die Simulation mit **Schritt** und beobachte die Variablen.
3. **Die Stelle finden:** Wo weicht ein Wert zum ersten Mal von deiner Erwartung ab? Genau dort steckt der Fehler.

Häufige Fehler in einer Sequenz sind:

- Die **Reihenfolge** stimmt nicht: Eine Variable wird benutzt, bevor sie einen Wert hat.
- Ein Wert wird **überschrieben**, bevor er gebraucht wird.
- **Klammern** fehlen: `a + b / 2` ist etwas anderes als `(a + b) / 2`.
- Zwei ganze Zahlen werden geteilt: `7 / 2` ergibt `3`, weil bei `int` die Nachkommastellen wegfallen.

> Später kommen Verzweigungen und Schleifen dazu. Dann zeigt dir die Simulation auch, welcher Weg genommen wird und wie oft eine Schleife läuft.

## Übung: Tauschen reparieren

::: übung sim-tausch
titel: Tauschen reparieren
auftrag: Das Struktogramm soll zwei Zahlen einlesen und sie vertauscht wieder ausgeben. Bei 3 und 5 soll also erst **5** und dann **3** erscheinen. Es gibt aber zweimal 5 aus.
  Mache einen Schreibtischtest oder nutze **Schritt** und repariere den Fehler.
start: sim-tausch-start.visustruct
test: 3, 5 -> 5 | 3
test: 1, 2 -> 2 | 1
test: 7, 7 -> 7 | 7
braucht: anweisung
tipp: Gehe das Diagramm mit **Schritt** durch und schreibe nach jedem Schritt die Werte von a und b auf. Wo verschwindet die 3?
tipp: Schau dir a nach dem Schritt `a = b` an. Wo ist der alte Wert von a geblieben? Merke ihn dir vorher in einer Hilfsvariablen, wie im Beispiel oben.
lösung: sim-tausch-loesung.visustruct
:::

## Übung: Kinokarten reparieren

::: übung sim-kino
titel: Kinokarten reparieren
auftrag: Eine Kinokarte kostet 8.50 €. Das Struktogramm soll nach der Anzahl fragen und den Gesamtpreis ausgeben, bei 2 Karten also `Gesamt: 17.0`.
  Starte die Simulation. Sie bleibt mit einer Fehlermeldung stehen. Finde heraus, warum, und repariere das Struktogramm.
start: sim-kino-start.visustruct
test: 2 -> Gesamt: 17.0
test: 3 -> Gesamt: 25.5
test: 0 -> Gesamt: 0.0
braucht: anweisung
tipp: Lies die Fehlermeldung der Simulation genau. Welche Variable kennt sie noch nicht?
tipp: Die Simulation führt die Kästen von oben nach unten aus. Hat gesamt schon einen Wert, wenn die Ausgabe drankommt? Du kannst Kästen mit der Maus verschieben.
lösung: sim-kino-loesung.visustruct
:::

> Läuft eine Simulation endlos weiter, klicke auf **Stopp**. Beim **Prüfen** einer Übung bricht VisuStruct nach sehr vielen Schritten von selbst ab.

## Checkliste

::: checkliste
- Ich kann die Simulation starten, anhalten, einzelne Schritte ausführen und stoppen. → Die Simulation starten
- Ich kann während der Simulation Variablen, Ausgabe und den letzten Schritt ablesen. → Was die Simulation anzeigt
- Ich kann einen Schreibtischtest als Tabelle von Hand durchführen. → Der Schreibtischtest
- Ich kann einen Fehler finden, indem ich die Werte mit meiner Erwartung vergleiche. → Fehler finden
:::

## Wissenstest

::: quiz
? Mit welchem Knopf führst du genau einen Schritt aus?
- [ ] Start
- [x] Schritt
- [ ] Stopp
> Start läuft automatisch weiter, Schritt führt nur einen Schritt aus.

? Was schreibst du beim Schreibtischtest nach jedem Schritt auf?
- [ ] Nur die Ausgabe am Ende
- [x] Die aktuellen Werte aller Variablen
- [ ] Den erzeugten Java-Code
> So siehst du genau, an welcher Stelle ein Wert anders ist als erwartet.

? Erst `int a = 3`, dann `int b = 5`, dann `a = b`. Welche Werte haben a und b danach?
- [ ] a = 5 und b = 3
- [x] a = 5 und b = 5
- [ ] a = 3 und b = 5
> Der alte Wert von a ist überschrieben. Darum braucht man beim Tauschen eine Hilfsvariable.

? Im Feld Letzter Schritt steht `preis = 4 * 2.5 -> 10.0`. Was bedeutet das?
- [ ] Die Variable preis hat jetzt den Wert 4.
- [x] 4 * 2.5 wurde ausgerechnet und das Ergebnis 10.0 in preis gespeichert.
- [ ] Die Simulation hat einen Fehler gefunden.

? Die Simulation meldet **Unbekannte Variable: summe**. Was ist ein wahrscheinlicher Grund?
- [x] summe wird benutzt, bevor sie einen Wert bekommen hat.
- [ ] summe ist zu groß.
- [ ] Das Struktogramm hat zu viele Kästen.
:::
