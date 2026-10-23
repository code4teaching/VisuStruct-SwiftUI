---
titel: Caesar-Verschlüsselung
nach: 17
stufe: 3
---

Schon vor über 2000 Jahren schickte der römische Feldherr Julius Caesar geheime Nachrichten an seine Truppen. Sein Trick war einfach: Er ersetzte jeden Buchstaben durch den Buchstaben, der **drei Stellen weiter** im Alphabet steht. Aus A wird D, aus B wird E und so weiter. Die lesbare Nachricht heißt **Klartext**, die verschlüsselte **Geheimtext**. Um wie viele Stellen verschoben wird, ist der **Schlüssel**, oft kurz `k` genannt.

::: grafik caesar-verschiebung.svg
Verschlüsselung mit dem Schlüssel 3: Jeder Buchstabe oben wird zum Buchstaben darunter. Am Ende geht es von vorn weiter, aus X, Y und Z werden A, B und C.
:::

Aus `HALLO` wird so `KDOOR`. Wer den Schlüssel kennt, schiebt einfach drei Stellen zurück und kann die Nachricht wieder lesen.

### Die Chiffrierscheibe

Damit man nicht jedes Mal abzählen muss, baute man sich eine **Chiffrierscheibe**: zwei Scheiben mit dem Alphabet, eine kleine auf einer großen, in der Mitte drehbar befestigt. Außen steht der Klartext, innen der Geheimtext. Dreht man die innere Scheibe um drei Buchstaben, steht unter jedem Buchstaben außen sein Geheimbuchstabe. Solche Scheiben gibt es seit dem 15. Jahrhundert. Im Amerikanischen Bürgerkrieg (1861–1865) trugen Soldaten kleine Scheiben aus Messing bei sich.

::: grafik caesar-scheibe.svg
Eine Chiffrierscheibe nach dem Vorbild historischer Messingscheiben. Das blaue Fenster zeigt: Mit dem Schlüssel 3 steht unter A das D.
:::

Probiere es selbst aus. Drehe die innere Scheibe, tippe einen Text ein und schau zu, wie der Geheimtext entsteht. Mit **Entschlüsseln** geht es rückwärts.

::: caesar 3
LUDWIG
:::

::: ludwig
Eine echte Scheibe kannst du ganz leicht selbst basteln: zwei Kreise aus Pappe, einer etwas kleiner, je 26 gleich große Felder mit dem Alphabet und in der Mitte eine Musterklammer. Fertig ist dein Geheimdienst-Werkzeug!
:::

::: quiz
? Was wird mit dem Schlüssel 3 aus dem Buchstaben Y?
- [ ] A
- [x] B
- [ ] C
> Nach Y kommen Z, dann geht es von vorn los mit A und B. Drei Stellen weiter ist also B.

? Ein Geheimtext wurde mit dem Schlüssel 5 verschlüsselt. Wie entschlüsselst du ihn?
- [ ] Noch einmal 5 Stellen weiter schieben
- [x] 5 Stellen zurück schieben
- [ ] Die Buchstaben rückwärts lesen
> Entschlüsseln ist das Gegenteil vom Verschlüsseln. Fünf Stellen zurück ist übrigens dasselbe wie 21 Stellen weiter, denn 5 + 21 = 26.
:::

### Das Programm: Es gibt mehr als einen Weg

Wie bringst du dem Computer bei, einen Buchstaben um `k` Stellen zu verschieben? Dafür gibt es nicht *die eine* richtige Lösung. Wir schauen uns zwei Wege an. Beide gehen den Text mit einer For-Schleife Zeichen für Zeichen durch, so wie in der Lektion Zeichenketten. Der Unterschied ist, wie sie einen einzelnen Buchstaben verschieben.

In beiden Wegen hilft der Rest-Operator `%`. Er sorgt dafür, dass es nach Z wieder bei A weitergeht: Die Positionen 0 bis 25 bleiben, wie sie sind, aus 26 wird 0, aus 27 wird 1 und so weiter.

### Weg 1: Das Alphabet in einem Array

Du legst das Alphabet in ein Array `char[] alphabet = {'A', 'B', …, 'Z'}`. Für jeden Buchstaben des Wortes suchst du im Array seine Position `pos`, also seinen Index. Der Geheimbuchstabe steht dann im selben Array an der Stelle `(pos + k) % 26`.

Ein Beispiel mit dem Schlüssel 3: X steht an der Position 23. Dann ist `(23 + 3) % 26 = 0`, und an der Position 0 steht A.

::: übung aufgabe-caesar-array
titel: Caesar mit Array
auftrag: Das Startdiagramm enthält schon das Array `alphabet`. Frage nach einem Wort aus Großbuchstaben und nach dem Schlüssel `k`. Gib dann das verschlüsselte Wort aus. Bei HALLO und 3 also `KDOOR`.
start: aufgabe-caesar-array-start.visustruct
test: HALLO, 3 -> KDOOR
test: ZEBRA, 1 -> AFCSB
test: LUDWIG, 13 -> YHQJVT
braucht: forSchleife, verzweigung
tipp: Lege einen leeren Text `String geheim = ""` an. Gehe das Wort mit einer For-Schleife Zeichen für Zeichen durch. In jedem Durchlauf hängst du einen Geheimbuchstaben hinten an `geheim` an.
tipp: Um die Position eines Buchstabens zu finden, brauchst du eine zweite, innere Schleife über das Array: Ist `alphabet[j] == zeichen`, merkst du dir `pos = j`.
tipp: Nach der inneren Schleife hängst du `alphabet[(pos + k) % 26]` an: `geheim = geheim + alphabet[(pos + k) % 26]`. Nach der äußeren Schleife gibst du `geheim` aus.
lösung: aufgabe-caesar-array-loesung.visustruct
:::

### Weg 2: Rechnen mit der ASCII-Tabelle

Für den Computer ist jedes Zeichen eigentlich eine Zahl. Welche Zahl zu welchem Zeichen gehört, steht in der **ASCII-Tabelle**. Dort hat A den Code 65, B den Code 66 und so weiter bis Z mit 90. In Java wandelst du ein Zeichen mit `(int)` in seinen Code um und einen Code mit `(char)` zurück in ein Zeichen:

```
int code = (int) 'A'
char zeichen = (char) 68
```

Danach ist `code` gleich 65 und `zeichen` gleich `'D'`. So eine Umwandlung von einem Datentyp in einen anderen heißt **Typumwandlung** (englisch *cast*).

Jetzt kannst du mit dem Buchstaben rechnen. Damit der Sprung von Z zurück zu A klappt, ziehst du erst 65 ab. Dann hat A die Position 0 und Z die Position 25, genau wie in Weg 1. Du verschiebst mit `% 26` und zählst am Ende die 65 wieder dazu:

::: grafik caesar-ascii.svg
Oben die Großbuchstaben mit ihren ASCII-Codes. Unten der Rechenweg für X mit dem Schlüssel 3: Heraus kommt A.
:::

::: übung aufgabe-caesar-ascii
titel: Caesar mit ASCII
code: java
auftrag: Schreibe ein Java-Programm, das ein Wort aus Großbuchstaben und den Schlüssel `k` einliest und das verschlüsselte Wort ausgibt. Diesmal ohne Array: Rechne mit `(int)` und `(char)`.
test: HALLO, 3 -> KDOOR
test: ZEBRA, 1 -> AFCSB
test: LUDWIG, 13 -> YHQJVT
braucht: forSchleife
tipp: Gehe das Wort mit einer For-Schleife durch. Den Code des Zeichens an der Stelle `i` bekommst du mit `int code = (int) wort.charAt(i);`.
tipp: Rechne `code = (code - 65 + k) % 26 + 65;` und hänge das Zeichen an: `geheim = geheim + (char) code;`. Vor der Schleife steht `String geheim = "";`, nach der Schleife `System.out.println(geheim);`.
lösung: aufgabe-caesar-ascii-loesung.visustruct
:::

### Welcher Weg ist besser?

**Weg 1: Array.** Die Idee ist, die Position im Array zu suchen.
- Vorteil: leicht zu verstehen, und auch eigene Alphabete gehen, z. B. mit Ä, Ö und Ü.
- Nachteil: Für jeden Buchstaben muss gesucht werden.

**Weg 2: ASCII.** Die Idee ist, mit dem Zeichencode zu rechnen.
- Vorteil: kurz und ohne Suche, darum schneller.
- Nachteil: Man muss die ASCII-Codes kennen.

Beide Programme liefern dasselbe Ergebnis. Genau so ist es oft beim Programmieren: Es gibt mehrere richtige Lösungen, und du wählst die, die am besten zu deiner Aufgabe passt.

::: übung aufgabe-caesar-entschluesseln
titel: Caesar entschlüsseln
code: java
auftrag: Jetzt drehst du den Spieß um. Lies einen Geheimtext aus Großbuchstaben und den Schlüssel `k` ein und gib den Klartext aus. Bei KDOOR und 3 also `HALLO`. Welchen Weg du nimmst, entscheidest du.
test: KDOOR, 3 -> HALLO
test: AFCSB, 1 -> ZEBRA
test: YHQJVT, 13 -> LUDWIG
braucht: forSchleife
tipp: Entschlüsseln heißt: `k` Stellen zurück statt vor. Aus dem `+ k` wird also ein `- k`.
tipp: Vorsicht bei A: `0 - 3` ergibt -3, und `%` macht daraus in Java keine positive Zahl. Zähle darum noch 26 dazu: `code = (code - 65 - k + 26) % 26 + 65;`
lösung: aufgabe-caesar-entschluesseln-loesung.visustruct
:::

::: angeberwissen
Sicher ist Caesar leider nicht. Es gibt nur 25 Schlüssel, die kann man in ein paar Minuten alle ausprobieren. Noch schneller geht es mit einem Trick: Im Deutschen ist E der häufigste Buchstabe. Kommt im Geheimtext H am häufigsten vor, war der Schlüssel wohl 3. Im Internet gibt es übrigens ROT13, das ist Caesar mit dem Schlüssel 13. Zweimal ROT13 ergibt wieder den Klartext, weil 13 + 13 = 26.
:::
