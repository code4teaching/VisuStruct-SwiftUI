---
titel: Tafeldienst auslosen
nach: 15
stufe: 2
---

Wer hat diese Woche Tafeldienst? Fünf Namen kommen in ein Array, dann wird eine Losnummer gezogen.

::: übung aufgabe-tafeldienst
titel: Tafeldienst auslosen
auftrag: Lies fünf Namen in ein String-Array ein. Frage danach nach einer Losnummer von 1 bis 5 und gib **Tafeldienst:** und den passenden Namen aus.
  Die Losnummer 1 gehört zum ersten Namen, die 5 zum letzten.
test: Ada, Ben, Cem, Dana, Emil, 3 -> Tafeldienst: Cem
test: Ada, Ben, Cem, Dana, Emil, 1 -> Tafeldienst: Ada
test: Lea, Max, Nia, Ole, Pia, 5 -> Tafeldienst: Pia
braucht: forSchleife
tipp: Mit `String[] namen = new String[5]` legst du das Array an. Achtung: Die Losnummer beginnt bei 1, der Index bei 0. Der Name steht also in `namen[nummer - 1]`.
lösung: aufgabe-tafeldienst-loesung.visustruct
:::

> Mit `int nummer = (int) (Math.random() * 5) + 1` kannst du die Losnummer auch vom Zufall ziehen lassen. Für die automatische Prüfung brauchen wir aber eine feste Eingabe.
