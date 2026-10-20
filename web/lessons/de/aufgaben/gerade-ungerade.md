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
tipp: Die Bedingung lautet `zahl % 2 == 0`. In der Ausgabe verbindest du die Zahl und den Text mit `+`, z. B. `zahl + " ist gerade"`.
lösung: aufgabe-gerade-loesung.visustruct
:::
