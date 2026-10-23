---
titel: Collatz-Folge
nach: 11
stufe: 2
---

Die Collatz-Folge ist ein berühmtes Rätsel der Mathematik. Du beginnst mit einer Zahl und wendest immer wieder dieselbe Regel an:

- Ist die Zahl **gerade**, teilst du sie durch 2.
- Ist sie **ungerade**, rechnest du mal 3 plus 1.

Bisher endet die Folge bei jeder ausprobierten Startzahl irgendwann bei 1. Ob das für alle Zahlen gilt, weiß bis heute niemand.

::: übung aufgabe-collatz
titel: Collatz-Folge
auftrag: Frage nach einer Startzahl. Wende die Regel so lange an, bis die Zahl 1 ist, und gib nach jedem Schritt die neue Zahl aus. Zähle dabei die Schritte mit und gib am Ende **Schritte:** und die Anzahl aus.
  Bei der Startzahl 6 lautet die Folge 3, 10, 5, 16, 8, 4, 2, 1. Das sind 8 Schritte.
test: 6 -> 3 | 10 | 5 | 16 | 8 | 4 | 2 | 1 | Schritte: 8
test: 3 -> 10 | 5 | 16 | 8 | 4 | 2 | 1 | Schritte: 7
test: 1 -> Schritte: 0
braucht: whileSchleife, verzweigung
tipp: Du weißt nicht, wie viele Schritte es werden. Darum passt eine While-Schleife besser als eine For-Schleife.
tipp: Die While-Schleife läuft, solange `zahl != 1` gilt. Ob eine Zahl gerade ist, prüfst du mit `zahl % 2 == 0`. Die Ausgabe und `schritte++` kommen nach der Verzweigung, aber noch in die Schleife.
lösung: aufgabe-collatz-loesung.visustruct
:::

Und jetzt dasselbe in Java:

::: übung aufgabe-collatz-java
titel: Collatz-Folge in Java
code: java
auftrag: Löse die Aufgabe von oben jetzt in Java. Die Ausgaben bleiben genau dieselben.
test: 6 -> 3 | 10 | 5 | 16 | 8 | 4 | 2 | 1 | Schritte: 8
test: 3 -> 10 | 5 | 16 | 8 | 4 | 2 | 1 | Schritte: 7
test: 1 -> Schritte: 0
braucht: whileSchleife, verzweigung
tipp: Eine `while`-Schleife läuft, solange `zahl != 1` ist. Darin entscheidet ein `if` mit `zahl % 2 == 0`.
tipp: Im Rumpf: halbieren oder `zahl = zahl * 3 + 1;`, dann `System.out.println(zahl);` und `schritte++;`. Nach der Schleife kommt `"Schritte: " + schritte`.
lösung: aufgabe-collatz-loesung.visustruct
:::

::: angeberwissen
Mit dieser Aufgabe kann man reich werden! Der Mathematiker Paul Erdős setzte für einen Beweis 500 Dollar aus. 2021 legte die japanische Firma Bakuage noch einiges drauf: 120 Millionen Yen, damals umgerechnet rund eine Million Dollar, für einen Beweis oder ein Gegenbeispiel. Abgeholt hat das Geld bis heute niemand. Erfunden hat das Rätsel übrigens der deutsche Mathematiker Lothar Collatz im Jahr 1937. Ich rechne gleich mal los, für so viel Geld gibt es eine Menge Heu.
:::
