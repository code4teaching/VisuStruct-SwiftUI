---
titel: Mehrwertsteuer
nach: 6
stufe: 1
---

Auf fast alles, was du kaufst, kommen 19 % **Mehrwertsteuer**. Der Laden rechnet mit dem Nettopreis (ohne Steuer) und schlägt die Steuer drauf. So entsteht der Bruttopreis, den du an der Kasse zahlst.

Ein Beispiel: Du kaufst ein Falt-Handy, das aufgeklappt zum Tablet wird. Auf dem Preisschild des Händlers stehen 1000 € netto. Dazu kommen 19 %, also 190 €. An der Kasse zahlst du 1190 €. Die 190 € darf der Händler nicht behalten: Er führt sie an das Finanzamt ab.

::: grafik aufgabe-mehrwertsteuer.svg
Nettopreis plus Mehrwertsteuer ergibt den Bruttopreis. Die Mehrwertsteuer geht an das Finanzamt.
:::

::: angeberwissen
Mäh, der Händler hat das Handy ja selbst eingekauft: beim Hersteller für 800 € plus 152 € Mehrwertsteuer. Diese 152 € heißen **Vorsteuer**, und die darf er von den 190 € abziehen. Ans Finanzamt überweist er also nur 38 €. Die ganze Steuer zahlt am Ende nur einer: der Kunde an der Kasse. Also du. Ich zahle übrigens gar keine, ich fresse nur Gras.
:::

Der Steuersatz ändert sich beim Rechnen nie. Darum legst du ihn als **Konstante** an: Das ist eine Variable, deren Wert nach dem Festlegen gleich bleibt. Du schreibst `const` davor, zum Beispiel `const double MWST = 0.19`. Namen von Konstanten schreibt man in Großbuchstaben, dann erkennt man sie sofort. Im Java-Code wird daraus `final double MWST = 0.19;`.

Wenn sich der Steuersatz einmal ändert, musst du nur diese eine Zeile anpassen.

::: übung aufgabe-mehrwertsteuer
titel: Mehrwertsteuer
auftrag: Lege die Konstante `MWST` mit dem Wert 0.19 an. Frage dann nach dem Nettopreis. Gib zuerst die Steuer und danach den Bruttopreis aus, jeweils nur die Zahl.
  Bei einem Nettopreis von 100 lauten die Ausgaben **19** und **119**.
test: 100 -> 19 | 119
test: 50 -> 9.5 | 59.5
test: 0 -> 0 | 0
tipp: Die Steuer ist 19 Prozent vom Nettopreis. Der Bruttopreis ist das, was man am Ende bezahlt.
tipp: Die Steuer ist `nettopreis * MWST`. Den Bruttopreis bekommst du, wenn du die Steuer zum Nettopreis addierst. Beide Werte sind Kommazahlen, also `double`.
lösung: aufgabe-mehrwertsteuer-loesung.visustruct
:::

::: quiz
? Warum legst du den Steuersatz als Konstante an?
- [ ] Weil Konstanten schneller gerechnet werden
- [x] Weil sich sein Wert im Programm nicht ändern soll
- [ ] Weil man Kommazahlen nur als Konstante speichern kann
> Eine Konstante behält ihren Wert. Ändert sich der Steuersatz einmal, passt du nur die eine Zeile mit `const` an.
:::
