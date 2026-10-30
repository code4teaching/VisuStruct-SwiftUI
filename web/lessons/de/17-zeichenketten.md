---
titel: Zeichenketten
bereich: Grundlagen
kurz: Mit Texten arbeiten, also einzelne Zeichen lesen, Teile herausschneiden, suchen, vergleichen und zerlegen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- erklären, dass auch die Zeichen eines Strings ab 0 gezählt werden
- mit `length()` und `charAt(i)` arbeiten
- mit `substring` einen Teil aus einem Text schneiden
- `indexOf`, `contains`, `toUpperCase` und `equals` anwenden
- einen Text mit einer Schleife Zeichen für Zeichen durchgehen
- einen Text mit `split` in ein String-Array zerlegen
- in Java einen Text einlesen und mit `equals` vergleichen
- weitere Methoden wie `lastIndexOf`, `replace`, `compareTo` und `Integer.parseInt` anwenden
- einen Text aus einer Datei mit `split("\n")` in Zeilen zerlegen
- eine Methode in der Java-API nachschlagen und ihre Beschreibung lesen
:::

## Text ist eine Reihe von Zeichen

Einen `String` kennst du schon: `String name = "Ludwig"`. In der Informatik heißt so ein Text auch **Zeichenkette**, weil die Zeichen wie Perlen an einer Kette hintereinander hängen. Jedes Zeichen hat einen Platz mit einem Index, genau wie bei einem Array. Auch hier wird **ab 0 gezählt**: Das erste Zeichen ist 0 Schritte vom Anfang entfernt.

::: grafik zk-zeichen.svg
Die acht Zeichen von „Geißbock“ mit ihren Indizes 0 bis 7.
:::

Ein String bringt **Methoden** mit. Du schreibst den Namen der Variablen, einen Punkt und die Methode:

- `wort.length()` liefert die Anzahl der Zeichen, hier 8.
- `wort.charAt(0)` liefert das Zeichen mit dem Index 0, hier `'G'`.

> Bei Strings schreibst du `length()` **mit** Klammern, bei Arrays `length` **ohne**. Das ist in Java leider so.

Das letzte Zeichen hat wie beim Array den Index `length() - 1`.

## Ein einzelnes Zeichen: char

Für ein einzelnes Zeichen hat Java einen eigenen Datentyp: **char**, kurz für englisch *character* (Zeichen). Ein `char` steht in **einfachen** Anführungszeichen, ein String in doppelten:

- `'C'` ist ein `char`: genau ein Zeichen.
- `"C"` ist ein String: ein Text, der nur ein Zeichen lang ist.
- Ein `char` hat immer genau ein Zeichen. Einen leeren `char` wie `''` gibt es nicht, einen leeren String `""` schon.

`charAt` liefert dir so ein Zeichen aus einem Text:

```
char erster = wort.charAt(0)
char letzter = wort.charAt(wort.length() - 1)
```

Zwei `char` vergleichst du mit `==`: `wort.charAt(0) == 'G'` ist `true`.

Hinter jedem Zeichen steckt eine Zahl, sein **Zeichencode**. Welche Zahl zu welchem Zeichen gehört, steht in der ASCII-Tabelle: `'A'` hat den Code 65, `'B'` 66, `'C'` 67 und so weiter bis `'Z'` mit 90. Mit `(int)` bekommst du den Code eines Zeichens, mit `(char)` wird aus einem Code wieder ein Zeichen:

```
int code = (int) 'C'
code = code + 1
char naechstes = (char) code
```

Danach ist `code` 68 und `naechstes` ist `'D'`. So verschiebst du einen Buchstaben im Alphabet, und genau das brauchst du später bei der Caesar-Verschlüsselung.

## Teile herausschneiden

Mit `substring` schneidest du einen Teil aus dem Text:

- `wort.substring(0, 4)` liefert die Zeichen von Index 0 **bis vor** Index 4, also `"Geiß"`.
- `wort.substring(4)` liefert alles ab Index 4 bis zum Ende, also `"bock"`.

Das Ende gehört **nicht** mehr dazu. Praktisch ist: `substring(0, 4)` liefert genau 4 Zeichen.

::: diagramm zk-zeichen.visustruct
Alle Methoden aus dieser Lektion an einem Beispiel. Gehe es in der Simulation durch und vergleiche jede Ausgabe mit der Grafik.
:::

## Suchen und vergleichen

Weitere Methoden, die du oft brauchst:

| Methode | Bedeutung | Beispiel mit `"Geißbock"` |
|---|---|---|
| `indexOf("bock")` | Wo beginnt der Text? | 4 |
| `indexOf("x")` | nicht gefunden | -1 |
| `contains("eiß")` | Kommt der Text vor? | true |
| `toUpperCase()` | alles groß | GEISSBOCK |
| `toLowerCase()` | alles klein | geißbock |
| `equals("Geißbock")` | gleicher Text? | true |

> Zwei Strings vergleichst du in Java mit `equals`, nicht mit `==`. Zwei einzelne Zeichen (`char`) vergleichst du dagegen mit `==`, z. B. `wort.charAt(i) == 'e'`.

::: angeberwissen
Probier mal `"Geißbock".toUpperCase()` aus. Heraus kommt GEISSBOCK, und das Wort ist plötzlich ein Zeichen **länger**! Ein großes ß gab es auf Schreibmaschinen nie, darum wird es zu SS. Erst seit 2017 ist das große ẞ offiziell erlaubt, aber Java bleibt beim SS. In meinem Namen kommt zum Glück kein ß vor, nur im Wort Geißbock.
:::

## Zeichen für Zeichen

Mit einer For-Schleife gehst du einen Text Zeichen für Zeichen durch. Der Index `i` läuft von 0 bis `wort.length() - 1`, genau wie bei einem Array:

::: diagramm zk-zaehlen.visustruct
Zählt, wie oft der Buchstabe e vorkommt. Probiere in der Simulation „Kaffeebecher“ aus und beobachte i und anzahl.
:::

## Zerlegen mit split

Oft stehen mehrere Angaben in einer einzigen Zeile, getrennt durch ein Zeichen, z. B. `"Ludwig;Geißbock;7"`. Mit `split` zerlegst du die Zeile an diesem Zeichen. Heraus kommt ein **String-Array**:

```
String[] teile = zeile.split(";")
```

Danach ist `teile[0]` gleich `"Ludwig"`, `teile[1]` gleich `"Geißbock"` und `teile[2]` gleich `"7"`. Mit `teile.length` erfährst du, wie viele Teile es sind.

::: diagramm zk-split.visustruct
Die Zeile wird am Semikolon zerlegt und jeder Teil mit seinem Index ausgegeben.
:::

> So sind auch CSV-Dateien aufgebaut, die du aus Tabellenkalkulationen kennst: eine Zeile pro Datensatz, die Werte durch Semikolon getrennt.

## Übung: Initialen

::: übung zk-initialen
titel: Initialen
auftrag: Frage nach Vorname und Nachname und gib die Initialen aus. Bei Ludwig Geißbock also `L. G.`
test: Ludwig, Geißbock -> L. G.
test: Ada, Lovelace -> A. L.
test: Ben, Shneiderman -> B. S.
braucht: anweisung
tipp: Die Initiale ist der erste Buchstabe eines Namens. Welche Methode liefert ein Zeichen an einer bestimmten Stelle?
tipp: Den ersten Buchstaben liefert `vorname.charAt(0)`. Die Ausgabe ist dann `vorname.charAt(0) + ". " + nachname.charAt(0) + "."`
lösung: zk-initialen-loesung.visustruct
:::

## Übung: Rückwärts

::: übung zk-rueckwaerts
titel: Rückwärts
auftrag: Frage nach einem Wort und gib es rückwärts aus. Aus Ludwig wird `giwduL`.
test: Ludwig -> giwduL
test: Anna -> annA
test: a -> a
braucht: forSchleife
tipp: Gehe das Wort Zeichen für Zeichen durch, aber von hinten nach vorn, und baue dabei einen neuen Text zusammen.
tipp: Lege `String rueckwaerts = ""` an. Die Schleife beginnt beim letzten Index `wort.length() - 1` und zählt mit `i--` bis 0 herunter. In jedem Durchlauf hängst du `wort.charAt(i)` hinten an.
lösung: zk-rueckwaerts-loesung.visustruct
:::

## Übung: Wörter zählen

::: übung zk-woerter
titel: Wörter zählen
auftrag: Frage nach einem Satz und gib aus, wie viele Wörter er hat, z. B. `Wörter: 4` bei „Ludwig ist ein Geißbock“. Die Wörter sind durch genau ein Leerzeichen getrennt.
test: Ludwig ist ein Geißbock -> Wörter: 4
test: Hallo -> Wörter: 1
test: Struktogramme machen Spaß -> Wörter: 3
braucht: anweisung
tipp: Zwischen den Wörtern steht immer ein Leerzeichen. Welche Methode zerlegt einen Text an einem Zeichen?
tipp: Zerlege den Satz mit `satz.split(" ")` in ein String-Array. Seine Länge ist die Anzahl der Wörter.
lösung: zk-woerter-loesung.visustruct
:::

## Jetzt in Java

Die Methoden in dieser Lektion sind schon Java. Ein ganzes Programm mit einem Text sieht so aus:

```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Wie heißt du?");
String name = scanner.next();
System.out.println("Hallo " + name.toUpperCase() + "!");
System.out.println("Dein Name hat " + name.length() + " Buchstaben.");
```

- `scanner.next()` liest ein Wort, also Text bis zum nächsten Leerzeichen. Für Zahlen nimmst du weiter `scanner.nextInt()`.
- Text steht in **doppelten** Anführungszeichen `"Ludwig"`, ein einzelnes Zeichen in **einfachen** `'L'`.
- Hinter `length()`, `toUpperCase()` und den anderen Methoden stehen immer runde Klammern, auch wenn nichts darin steht.
- Zwei Texte vergleichst du mit `equals`. Dabei zählt jeder Buchstabe: `"Ludwig".equals("ludwig")` ist false.

::: übung l17-java-passwort
titel: Passwort prüfen
code: java
auftrag: Schreibe in Java ein Programm, das nach dem Passwort fragt. Ist es **Ludwig**, gibt es **Willkommen!** aus, sonst **Falsches Passwort**.
  Achte auf Groß- und Kleinschreibung: `ludwig` ist falsch.
test: Ludwig -> Willkommen!
test: ludwig -> Falsches Passwort
test: Geißbock -> Falsches Passwort
braucht: verzweigung
tipp: Lies das Passwort mit `scanner.next()` in eine String-Variable. Dann vergleichst du in einer Verzweigung.
tipp: Die Bedingung heißt `eingabe.equals("Ludwig")`. Mit `==` klappt der Vergleich von Texten in Java nicht zuverlässig.
lösung: l17-java-passwort-loesung.visustruct
:::

## Lückentext: Texte

::: lückentext
titel: Ein Wort untersuchen
auftrag: Ergänze die fehlenden Methoden und Wörter.
```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Ein Wort?");
[[String]] wort = scanner.next();
System.out.println("Länge: " + wort.[[length]]());
System.out.println("Groß: " + wort.[[toUpperCase]]());
System.out.println("Erster Buchstabe: " + wort.[[charAt]](0));
if (wort.[[equals]]("Ludwig")) {
    System.out.println("Hallo Ludwig!");
}
```
erklärung: `length()` zählt die Zeichen, `toUpperCase()` macht alles groß, `charAt(0)` liefert das erste Zeichen. Texte vergleichst du mit `equals`, nicht mit `==`.
:::

## Fehler finden: Initialen

::: übung l17-java-fehler
titel: Initialen reparieren
code: java
auftrag: Das Programm liest Vor- und Nachnamen ein und soll die Initialen ausgeben. Bei Ludwig Geißbock also **L. G.** Es gibt aber **u. e.** aus.
  „Im Editor öffnen“ zeigt den Code im Bereich Programmieren. Finde den Fehler, repariere ihn und klicke auf Prüfen.
start: l17-java-fehler-start.visustruct
test: Ludwig, Geißbock -> L. G.
test: Mia, Meyer -> M. M.
test: Ada, Lovelace -> A. L.
braucht: anweisung
tipp: Bei welchem Index beginnt Java zu zählen?
tipp: Das erste Zeichen hat den Index 0: `vorname.charAt(0)` und `nachname.charAt(0)`.
lösung: l17-java-fehler-loesung.visustruct
:::

## Noch mehr Methoden

Ein String kann noch viel mehr. Diese Methoden brauchst du auch oft:

| Methode | Bedeutung | Beispiel | Ergebnis |
|---|---|---|---|
| `lastIndexOf("e")` | Wo steht das letzte e? | `"Ziegenbock".lastIndexOf("e")` | 4 |
| `isEmpty()` | Ist der Text leer? | `"".isEmpty()` | true |
| `equalsIgnoreCase(…)` | gleicher Text, egal ob groß oder klein? | `"Ziegenbock".equalsIgnoreCase("ZIEGENBOCK")` | true |
| `replace(alt, neu)` | ersetzt jede Stelle | `"Ziegenbock".replace("bock", "käse")` | Ziegenkäse |
| `repeat(n)` | den Text n-mal hintereinander | `"Mäh".repeat(3)` | MähMähMäh |
| `concat(…)` | hängt Text an, wie `+` | `"Ziegen".concat("bock")` | Ziegenbock |
| `compareTo(…)` | Wer kommt im Alphabet zuerst? | `"Anna".compareTo("Ben")` | -1 |

`compareTo` liefert eine Zahl: **negativ**, wenn der Text im Alphabet vorher kommt, **0**, wenn beide gleich sind, und **positiv**, wenn er danach kommt. Damit kannst du Namen sortieren.

Zwei Methoden gehören nicht zu einem Text, sondern zu einer Klasse. Davor steht deshalb der Name der Klasse:

- `Integer.parseInt("7")` macht aus dem Text "7" die Zahl 7. Mit ihr kannst du rechnen.
- `String.valueOf(7)` macht aus der Zahl 7 den Text "7".

::: diagramm zk-mehr.visustruct
Alle neuen Methoden an einem Beispiel. Gehe es in der Simulation durch und vergleiche jede Ausgabe mit der Tabelle.
:::

## Text aus einer Datei

Programme bekommen Text oft aus einer **Datei**. Prinzessin Zora hat Ludwig einen Brief geschrieben. Er liegt als Datei `brief.txt` bereit:

::: datei brief.txt
Lieber Ludwig,
der Fuchs hat mich in seinen Turm gesperrt.
Die Tür hat ein Schloss mit einem geheimen Wort.
Das Wort findest du nur mit Java.
Bitte hilf mir!
Deine Prinzessin Zora
:::

Diese Zeilen lesen die ganze Datei in einen String:

```
import java.nio.file.*;

String brief = Files.readString(Path.of("brief.txt"));
```

Wie das Lesen genau funktioniert, lernst du später in einer eigenen Lektion über Dateien. Hier reicht: Danach steht der ganze Brief in `brief`, mit allen Zeilen.

Am Ende jeder Zeile steht ein unsichtbares Zeichen für den **Zeilenumbruch**. In Java schreibst du es als `"\n"`. Mit `brief.split("\n")` zerlegst du den Brief deshalb in seine Zeilen.

::: übung l17-java-brief
titel: Wo steckt der Fuchs?
code: java
auftrag: Im Startcode wird der Brief schon gelesen. Zerlege ihn in Zeilen und gib **Zeilen:** und die Anzahl aus. Suche dann die Zeile, in der **Fuchs** steht, und gib **Fuchs in Zeile** und ihre Nummer aus. Die erste Zeile hat die Nummer 1.
start: l17-java-brief-start.visustruct
test: - -> Zeilen: 6 | Fuchs in Zeile 2
braucht: forSchleife, verzweigung
tipp: `String[] zeilen = brief.split("\n");` zerlegt den Brief. Mit einer For-Schleife gehst du dann alle Zeilen durch.
tipp: In der Schleife prüfst du `zeilen[i].contains("Fuchs")`. Der Index beginnt bei 0, deshalb gibst du `(i + 1)` aus. Die Klammern brauchst du, damit Java rechnet und nicht 1 an den Text hängt.
lösung: l17-java-brief-loesung.visustruct
:::

## Die Java-API

Niemand kennt alle Methoden auswendig, auch Profis nicht. Sie schlagen nach, in der **Java-API**. API heißt Application Programming Interface. Gemeint ist die Beschreibung von allem, was Java schon mitbringt.

Alle Methoden von String findest du hier: [String in der Java-API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html)

Scrolle dort zur Tabelle **Method Summary**. Jede Zeile beschreibt eine Methode:

| Spalte | Beispiel | Bedeutung |
|---|---|---|
| Modifier and Type | `int` | Was die Methode zurückgibt |
| Method | `lastIndexOf(String str)` | Name und Parameter mit ihrem Datentyp |
| Description | Returns the index within this string of the last occurrence … | Was die Methode macht |

Die API ist auf Englisch. Dein Browser kann die Seite übersetzen. Die Namen der Methoden bleiben englisch, denn so schreibst du sie auch in Java.

::: ludwig
Die Seite ist sehr lang. Mit Strg+F (am Mac ⌘+F) suchst du nach dem Namen der Methode und bist sofort da.
:::

Schlag diese Methoden nach. Sie stehen nicht in dieser Lektion:

::: quiz
? Schlag `strip()` nach. Was macht die Methode?
- [ ] Sie entfernt alle Leerzeichen im Text.
- [x] Sie entfernt die Leerzeichen am Anfang und am Ende.
- [ ] Sie schneidet das letzte Zeichen ab.
> Wie `trim()`. `strip()` kennt aber auch besondere Leerzeichen aus anderen Schriften.

? Schlag `isBlank()` nach. Was liefert `"   ".isBlank()`?
- [x] true
- [ ] false
- [ ] 3
> isBlank prüft, ob der Text leer ist oder nur aus Leerzeichen besteht. `"   ".isEmpty()` wäre dagegen false.

? Schlag `toCharArray()` nach. Welchen Datentyp liefert die Methode?
- [ ] String
- [ ] String[]
- [x] char[]
> Ein Array mit allen Zeichen des Textes, für jedes Zeichen ein Fach.

? Schlag `indexOf` mit zwei Parametern nach. Was liefert `"Ziegenbock".indexOf("e", 3)`?
- [ ] 2
- [x] 4
- [ ] -1
> Die Suche beginnt erst bei Index 3. Das erste e ab dort steht bei Index 4.

? Schlag `startsWith` nach. Welchen Datentyp liefert die Methode?
- [x] boolean
- [ ] int
- [ ] String
> In der Spalte „Modifier and Type“ steht boolean: Die Antwort ist true oder false.
:::

## Spiel: Prinzessin retten

Jetzt hilfst du Ludwig. Der Fuchs hat Prinzessin Zora in seinen Turm gesperrt, und das Tor öffnet sich nur mit einem geheimen Wort.

::: spiel prinzessin
titel: Spiel: Prinzessin retten
intro: Auf dem Weg zum Turm kommt Ludwig an **sechs Stationen**. An jeder steht ein Stück Java-Code, und heraus kommt eine Zahl. Mit `alphabet.charAt(zahl)` wird aus der Zahl ein Buchstabe, der im **Kreuzworträtsel** landet. Löst du das Rätsel, ergeben die gelben Felder das geheime Wort für das Tor.

station: Am Burggraben
    String name = "   Zora   ";
    int zahl = name.trim().length();
frage: Welche Zahl steht in `zahl`?
zahl: 4
feld: 5 1
tipp: `trim()` schneidet die Leerzeichen vorne und hinten ab. Zähle danach die Zeichen.
> Nach `trim()` bleibt `"Zora"` übrig, und das sind 4 Zeichen.

station: Im Fuchswald
    String ort = "Fuchsbau";
    int zahl = ort.length();
frage: Welche Zahl steht in `zahl`?
zahl: 8
feld: 4 4
tipp: `length()` zählt alle Zeichen. Zähle F-u-c-h-s-b-a-u.
> „Fuchsbau“ hat 8 Zeichen.

station: Am Ziegenfelsen
    String wort = "Ziegenbock";
    int zahl = wort.indexOf("bock");
frage: Welche Zahl steht in `zahl`?
zahl: 6
feld: 4 6
tipp: `indexOf` gibt die Stelle zurück, an der „bock“ anfängt. Das Z hat den Index 0.
> Z i e g e n hat die Indizes 0 bis 5, also beginnt „bock“ bei Index 6.

station: Auf der Turmtreppe
    String wort = "Prinzessin";
    int zahl = wort.indexOf("s", 7);
frage: Welche Zahl steht in `zahl`? Schlag `indexOf(String str, int fromIndex)` in der Java-API nach.
zahl: 7
feld: 6 6
tipp: Die Suche beginnt bei Index 7, und Index 7 zählt schon mit. Schreib dir die Indizes unter die Buchstaben.
> P r i n z e s s i n hat die Indizes 0 bis 9. Ab Index 7 gesucht, steht das erste „s“ genau bei 7.

station: Vor der Fuchshöhle
    int zahl = "Zora".compareTo("Zoe");
frage: Welche Zahl steht in `zahl`?
zahl: 13
feld: 1 9
tipp: `compareTo` sucht die erste Stelle, an der sich die Texte unterscheiden, und rechnet die Differenz der Zeichencodes aus. `'r'` ist 114, `'e'` ist 101.
> „Zo“ ist gleich, dann kommt `'r'` gegen `'e'`: 114 − 101 = 13.

station: Am Turmtor
    int zahl = Integer.parseInt("1" + "1") / 5;
frage: Welche Zahl steht in `zahl`?
zahl: 2
feld: 6 5
tipp: Zuerst werden die Texte verbunden, dann wird daraus eine Zahl. Bei `int` wird beim Teilen der Rest weggelassen.
> `"1" + "1"` ist `"11"`, `parseInt` macht daraus 11, und 11 / 5 ist bei ganzen Zahlen 2.

kreuzwort: Die blauen Buchstaben hast du schon. Fülle die anderen Felder mit Fachbegriffen aus Java. Klick auf einen Hinweis, um zum Wort zu springen.
- → 1 3 BOOLEAN: Datentyp für wahr oder falsch
- → 4 1 STRING: Datentyp für Text, also für eine Zeichenkette
- → 6 5 CHAR: Datentyp für ein einzelnes Zeichen
- ↓ 1 6 LENGTH: Methode, die die Zeichen eines Strings zählt
- ↓ 2 1 ELSE: Der „sonst“-Teil einer Verzweigung
- ↓ 3 3 BREAK: Springt sofort aus einer Schleife heraus
lösung: 1 3, 4 3, 2 6, 6 7, 7 3

tor: Ludwig steht vor dem Tor. Das Schloss vergleicht dein Wort mit `equals`. Trag das geheime Wort ein.
    String wort = "___";
    if (wort.equals(geheimesWort)) {
        tor.oeffnen();
    }
ende: Zora ist frei, und der Fuchs ist schnell davongelaufen. Das geheime Wort war `BREAK`: Mit `break` kommt man aus jeder Schleife heraus, und Zora aus dem Turm.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann erklären, dass auch die Zeichen eines Strings ab 0 gezählt werden. → Text ist eine Reihe von Zeichen
- Ich kann mit `length()` und `charAt(i)` arbeiten. → Text ist eine Reihe von Zeichen
- Ich kann mit `substring` einen Teil aus einem Text schneiden. → Teile herausschneiden
- Ich kann `indexOf`, `contains`, `toUpperCase` und `equals` anwenden. → Suchen und vergleichen
- Ich kann einen Text mit einer Schleife Zeichen für Zeichen durchgehen. → Zeichen für Zeichen
- Ich kann einen Text mit `split` in ein String-Array zerlegen. → Zerlegen mit split
- Ich kann in Java einen Text einlesen und mit `equals` vergleichen. → Jetzt in Java
- Ich kann weitere Methoden wie `lastIndexOf`, `replace`, `compareTo` und `Integer.parseInt` anwenden. → Noch mehr Methoden
- Ich kann einen Text aus einer Datei mit `split("\n")` in Zeilen zerlegen. → Text aus einer Datei
- Ich kann eine Methode in der Java-API nachschlagen und ihre Beschreibung lesen. → Die Java-API
:::

## Wissenstest

::: quiz
? Was liefert `"Ludwig".charAt(1)`?
→ Text ist eine Reihe von Zeichen
- [ ] L
- [x] u
- [ ] d
> Gezählt wird ab 0: L hat den Index 0, u den Index 1.

? Was liefert `"Struktogramm".substring(0, 6)`?
→ Teile herausschneiden
- [x] Strukt
- [ ] Struktog
- [ ] truktog
> Die Zeichen mit den Indizes 0 bis 5. Das Ende 6 gehört nicht mehr dazu.

? Ein Wort hat 7 Zeichen. Welchen Index hat das letzte Zeichen?
→ Text ist eine Reihe von Zeichen
- [ ] 7
- [x] 6
- [ ] 8
> Wie beim Array: immer eins weniger als die Länge.

? Wie vergleichst du in Java zwei Strings auf gleichen Inhalt?
→ Suchen und vergleichen
- [ ] a == b
- [x] a.equals(b)
- [ ] a = b

? Ordne jeder Methode zu, was sie bei `"Geißbock"` liefert.
→ Suchen und vergleichen
= length() -> 8
= charAt(0) -> G
= indexOf("bock") -> 4
= substring(4) -> bock

? Welche Bedingung prüft in Java, ob in `eingabe` der Text Ludwig steht?
→ Jetzt in Java
- [ ] eingabe = "Ludwig"
- [ ] eingabe == 'Ludwig'
- [x] eingabe.equals("Ludwig")
> Texte vergleichst du mit equals. Einfache Anführungszeichen sind nur für ein einzelnes Zeichen.

? Was liefert `Integer.parseInt("12") + 1`?
→ Noch mehr Methoden
- [ ] "121"
- [x] 13
- [ ] eine Fehlermeldung
> parseInt macht aus dem Text eine Zahl. Danach rechnet Java ganz normal.
:::
