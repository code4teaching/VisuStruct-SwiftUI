---
titel: Volljährig?
nach: 8
stufe: 1
---

Im Kino, beim Führerschein oder bei der Wahl: Oft kommt es darauf an, ob jemand schon 18 ist.

::: übung aufgabe-volljaehrig
titel: Volljährig?
auftrag: Frage nach dem Alter. Ist die Person 18 oder älter, gib **volljährig** aus, sonst **minderjährig**.
test: 18 -> volljährig
test: 35 -> volljährig
test: 17 -> minderjährig
test: 6 -> minderjährig
braucht: verzweigung
tipp: Es gibt zwei mögliche Ausgaben, also brauchst du eine Verzweigung.
tipp: Lies das Alter mit `input: int alter "Wie alt bist du?"` ein. Die Bedingung der Verzweigung lautet `alter >= 18`. Achte darauf, dass 18 schon volljährig ist.
lösung: aufgabe-volljaehrig-loesung.visustruct
:::

Und jetzt dasselbe in Java:

::: übung aufgabe-volljaehrig-java
titel: Volljährig? in Java
code: java
auftrag: Löse die Aufgabe von oben jetzt in Java. Die Ausgaben bleiben genau dieselben.
test: 18 -> volljährig
test: 35 -> volljährig
test: 17 -> minderjährig
test: 6 -> minderjährig
braucht: verzweigung
tipp: Lies das Alter mit `int alter = scanner.nextInt();` ein.
tipp: `if (alter >= 18) { … } else { … }`, in jedem Zweig ein `System.out.println(…)`.
lösung: aufgabe-volljaehrig-loesung.visustruct
:::
