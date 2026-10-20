---
titel: Mehrwertsteuer
nach: 6
stufe: 1
---

Auf fast alles, was du kaufst, kommen 19 % **Mehrwertsteuer**. Der Laden rechnet mit dem Nettopreis (ohne Steuer) und schlägt die Steuer drauf. So entsteht der Bruttopreis, den du an der Kasse zahlst.

Der Steuersatz ändert sich beim Rechnen nie. Darum legst du ihn als **Konstante** an: Das ist eine Variable, deren Wert nach dem Festlegen gleich bleibt. Du schreibst `const` davor, zum Beispiel `const double MWST = 0.19`. Namen von Konstanten schreibt man in Großbuchstaben, dann erkennt man sie sofort. Im Java-Code wird daraus `final double MWST = 0.19;`.

Wenn sich der Steuersatz einmal ändert, musst du nur diese eine Zeile anpassen.

::: übung aufgabe-mehrwertsteuer
titel: Mehrwertsteuer
auftrag: Lege die Konstante `MWST` mit dem Wert 0.19 an. Frage dann nach dem Nettopreis. Gib zuerst die Steuer und danach den Bruttopreis aus, jeweils nur die Zahl.
  Bei einem Nettopreis von 100 lauten die Ausgaben **19** und **119**.
test: 100 -> 19 | 119
test: 50 -> 9.5 | 59.5
test: 0 -> 0 | 0
tipp: Die Steuer ist `nettopreis * MWST`. Den Bruttopreis bekommst du, wenn du die Steuer zum Nettopreis addierst. Beide Werte sind Kommazahlen, also `double`.
lösung: aufgabe-mehrwertsteuer-loesung.visustruct
:::
