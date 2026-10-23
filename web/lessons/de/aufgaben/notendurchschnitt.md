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
tipp: Du brauchst die Summe aller Noten und ihre Anzahl. Der Durchschnitt ist die Summe geteilt durch die Anzahl.
tipp: Die For-Schleife läuft von `int i = 0` bis `i < anzahl`. Darin liest du eine Note ein und zählst sie zur Summe. Den Durchschnitt speicherst du als Kommazahl: `double schnitt = summe * 1.0 / anzahl`. Das `* 1.0` sorgt dafür, dass auch in Java nicht ganzzahlig geteilt wird.
lösung: aufgabe-durchschnitt-loesung.visustruct
:::

Und jetzt dasselbe in Java:

::: übung aufgabe-durchschnitt-java
titel: Notendurchschnitt in Java
code: java
auftrag: Löse die Aufgabe von oben jetzt in Java. Die Ausgaben bleiben genau dieselben.
test: 2, 1, 2 -> 1.5
test: 3, 1, 2, 3 -> 2
test: 4, 2, 2, 3, 4 -> 2.75
braucht: forSchleife
tipp: `for (int i = 0; i < anzahl; i++)` liest genau so viele Noten ein, wie vorher angegeben.
tipp: Teile mit `double schnitt = summe * 1.0 / anzahl;`. Ohne `* 1.0` teilt Java zwei `int` ganzzahlig, und aus 1.5 wird 1.
lösung: aufgabe-durchschnitt-loesung.visustruct
:::
