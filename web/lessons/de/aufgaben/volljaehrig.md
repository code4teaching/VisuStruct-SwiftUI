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
tipp: Lies das Alter mit `input: int alter "Wie alt bist du?"` ein. Die Bedingung der Verzweigung lautet `alter >= 18`. Achte darauf, dass 18 schon volljährig ist.
lösung: aufgabe-volljaehrig-loesung.visustruct
:::
