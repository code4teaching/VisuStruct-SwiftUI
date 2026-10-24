---
titel: Vokabeltrainer
nach: 27
stufe: 3
---

Ludwig lernt Englisch. Seine Vokabeln stehen in einer CSV-Datei, links Deutsch, rechts Englisch:

::: datei vokabeln.csv
Deutsch;Englisch
Ziege;goat
Heu;hay
Wiese;meadow
:::

Weil nur die Datei die Wörter kennt, kannst du später einfach neue Zeilen anhängen, ohne das Programm zu ändern.

::: angeberwissen
Die Lernkartei mit mehreren Fächern hat Sebastian Leitner 1972 bekannt gemacht: Gewusste Karten wandern ein Fach weiter und kommen seltener dran, falsche wandern zurück ins erste Fach. Viele Vokabel-Apps arbeiten bis heute nach diesem Prinzip.
:::

::: übung aufgabe-vokabeln
titel: Vokabeltrainer
code: java
auftrag: Frage jede Vokabel aus der Datei ab: Gib **Was heißt Ziege?** aus und lies die Antwort mit `scanner.next()` ein. Ist sie richtig, gib **Richtig!** aus, sonst zum Beispiel **Falsch, richtig ist goat.**
  Am Ende steht da, wie viele richtig waren, zum Beispiel **2 von 3 richtig**.
start: aufgabe-vokabeln-start.visustruct
test: goat, hay, meadow -> Was heißt Ziege? | Richtig! | Was heißt Heu? | Richtig! | Was heißt Wiese? | Richtig! | 3 von 3 richtig
test: cow, hay, meadow -> Was heißt Ziege? | Falsch, richtig ist goat. | Was heißt Heu? | Richtig! | Was heißt Wiese? | Richtig! | 2 von 3 richtig
test: goat, heu, wiese -> Was heißt Ziege? | Richtig! | Was heißt Heu? | Falsch, richtig ist hay. | Was heißt Wiese? | Falsch, richtig ist meadow. | 1 von 3 richtig
braucht: whileSchleife, verzweigung
tipp: Überspringe die Kopfzeile. In der Schleife zerlegst du jede Zeile mit `split(";")`: `teile[0]` ist das deutsche Wort, `teile[1]` das englische.
tipp: Texte vergleichst du mit `antwort.equals(teile[1])`, nicht mit `==`. Zähle vor der Schleife mit `int richtig = 0;` und `int anzahl = 0;` mit.
lösung: aufgabe-vokabeln-loesung.visustruct
:::
