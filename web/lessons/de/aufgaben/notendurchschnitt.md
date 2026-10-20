---
titel: Notendurchschnitt
nach: 13
stufe: 2
---

Wie gut war die letzte Zeit? Der Durchschnitt ist die Summe aller Noten geteilt durch ihre Anzahl.

::: übung aufgabe-durchschnitt
titel: Notendurchschnitt
auftrag: Frage zuerst, wie viele Noten eingegeben werden. Lies dann genau so viele Noten ein und gib den Durchschnitt aus, nur die Zahl.
  Bei den Noten 1 und 2 ist der Durchschnitt **1.5**.
test: 2, 1, 2 -> 1.5
test: 3, 1, 2, 3 -> 2
test: 4, 2, 2, 3, 4 -> 2.75
braucht: forSchleife
tipp: Die For-Schleife läuft von `int i = 0` bis `i < anzahl`. Darin liest du eine Note ein und zählst sie zur Summe. Den Durchschnitt speicherst du als Kommazahl: `double schnitt = summe * 1.0 / anzahl`. Das `* 1.0` sorgt dafür, dass auch in Java nicht ganzzahlig geteilt wird.
lösung: aufgabe-durchschnitt-loesung.visustruct
:::
