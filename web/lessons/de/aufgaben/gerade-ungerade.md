---
titel: Gerade oder ungerade
nach: 8
stufe: 1
---

Eine Zahl ist gerade, wenn beim Teilen durch 2 kein Rest bleibt. Den Rest berechnest du mit `%`: `8 % 2` ist 0, `7 % 2` ist 1.

::: übung aufgabe-gerade
titel: Gerade oder ungerade
auftrag: Frage nach einer ganzen Zahl. Gib aus, ob sie gerade oder ungerade ist. Bei 4 lautet die Ausgabe **4 ist gerade**, bei 7 **7 ist ungerade**.
test: 4 -> 4 ist gerade
test: 7 -> 7 ist ungerade
test: 0 -> 0 ist gerade
test: 15 -> 15 ist ungerade
braucht: verzweigung
tipp: Eine Verzweigung entscheidet zwischen gerade und ungerade. Gerade heißt: durch 2 teilbar ohne Rest.
tipp: Die Bedingung lautet `zahl % 2 == 0`. In der Ausgabe verbindest du die Zahl und den Text mit `+`, z. B. `zahl + " ist gerade"`.
lösung: aufgabe-gerade-loesung.visustruct
:::

Und jetzt dasselbe in Java:

::: übung aufgabe-gerade-java
titel: Gerade oder ungerade in Java
code: java
auftrag: Löse die Aufgabe von oben jetzt in Java. Die Ausgaben bleiben genau dieselben.
test: 4 -> 4 ist gerade
test: 7 -> 7 ist ungerade
test: 0 -> 0 ist gerade
test: 15 -> 15 ist ungerade
braucht: verzweigung
tipp: Eine Zahl liest du mit `int zahl = scanner.nextInt();` ein. Vorher fragst du mit `System.out.println(…)`.
tipp: `if (zahl % 2 == 0) { … } else { … }`. Die Ausgabe ist `System.out.println(zahl + " ist gerade");`.
lösung: aufgabe-gerade-loesung.visustruct
:::
