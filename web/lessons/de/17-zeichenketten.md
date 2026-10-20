---
titel: Zeichenketten
bereich: Grundlagen
kurz: Mit Texten arbeiten, also einzelne Zeichen lesen, Teile herausschneiden, suchen, vergleichen und zerlegen.
---

## Text ist eine Reihe von Zeichen

Einen `String` kennst du schon: `String name = "Ludwig"`. In der Informatik heißt so ein Text auch **Zeichenkette**, weil die Zeichen wie Perlen an einer Kette hintereinander hängen. Jedes Zeichen hat einen Platz mit einem Index, genau wie bei einem Array. Auch hier wird **ab 0 gezählt**: Das erste Zeichen ist 0 Schritte vom Anfang entfernt.

::: grafik zk-zeichen.svg
Die acht Zeichen von „Geißbock“ mit ihren Indizes 0 bis 7.
:::

Ein String bringt **Methoden** mit. Du schreibst den Namen der Variablen, einen Punkt und die Methode:

- `wort.length()` liefert die Anzahl der Zeichen, hier 8.
- `wort.charAt(0)` liefert das Zeichen mit dem Index 0, hier `'G'`.

> Bei Strings schreibst du `length()` **mit** Klammern, bei Arrays `length` **ohne**. Das ist in Java leider so.

Ein einzelnes Zeichen hat in Java den Datentyp `char`. Ein `char` steht in **einfachen** Anführungszeichen: `'G'`. Ein String steht in doppelten: `"G"`.

```
char erster = wort.charAt(0)
char letzter = wort.charAt(wort.length() - 1)
```

Das letzte Zeichen hat wie beim Array den Index `length() - 1`.

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
tipp: Zerlege den Satz mit `satz.split(" ")` in ein String-Array. Seine Länge ist die Anzahl der Wörter.
lösung: zk-woerter-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich weiß, dass auch die Zeichen eines Strings ab 0 gezählt werden. → Text ist eine Reihe von Zeichen
- Ich kann mit `length()` und `charAt(i)` arbeiten. → Text ist eine Reihe von Zeichen
- Ich kann mit `substring` einen Teil aus einem Text schneiden. → Teile herausschneiden
- Ich kenne `indexOf`, `contains`, `toUpperCase` und `equals`. → Suchen und vergleichen
- Ich kann einen Text mit einer Schleife Zeichen für Zeichen durchgehen. → Zeichen für Zeichen
- Ich kann einen Text mit `split` in ein String-Array zerlegen. → Zerlegen mit split
:::

## Wissenstest

::: quiz
? Was liefert `"Ludwig".charAt(1)`?
- [ ] L
- [x] u
- [ ] d
> Gezählt wird ab 0: L hat den Index 0, u den Index 1.

? Was liefert `"Struktogramm".substring(0, 6)`?
- [x] Strukt
- [ ] Struktog
- [ ] truktog
> Die Zeichen mit den Indizes 0 bis 5. Das Ende 6 gehört nicht mehr dazu.

? Ein Wort hat 7 Zeichen. Welchen Index hat das letzte Zeichen?
- [ ] 7
- [x] 6
- [ ] 8
> Wie beim Array: immer eins weniger als die Länge.

? Wie vergleichst du in Java zwei Strings auf gleichen Inhalt?
- [ ] a == b
- [x] a.equals(b)
- [ ] a = b

? Ordne jeder Methode zu, was sie bei `"Geißbock"` liefert.
= length() -> 8
= charAt(0) -> G
= indexOf("bock") -> 4
= substring(4) -> bock
:::
