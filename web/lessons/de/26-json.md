---
titel: Daten als JSON
bereich: Dateien
kurz: JSON-Dateien verstehen, Werte mit indexOf und substring herausholen und selbst JSON schreiben.
---

## Daten mit Namen

Der Burgzoo speichert seine Tiere in einer Datei `zoo.json`:

::: datei zoo.json
{
  "zoo": "Burgzoo",
  "tiere": [
    {"name": "Ludwig", "art": "Geißbock", "alter": 7},
    {"name": "Zora", "art": "Ziege", "alter": 6},
    {"name": "Fuchs", "art": "Rotfuchs", "alter": 4},
    {"name": "Hase", "art": "Feldhase", "alter": 2}
  ]
}
:::

Das ist **JSON**, die „JavaScript Object Notation“. Fast jede Web-App und jedes Spiel schickt und speichert Daten so. Anders als in einer CSV-Datei steht vor jedem Wert sein **Name**, der **Schlüssel**.

| Zeichen | Bedeutung | Beispiel |
|---|---|---|
| `{ … }` | ein **Objekt**: Paare aus Schlüssel und Wert | `{"name": "Zora", "alter": 6}` |
| `"schlüssel": wert` | ein Paar, getrennt durch einen Doppelpunkt | `"alter": 6` |
| `[ … ]` | eine **Liste** von Werten, wie ein Array | `"tiere": [ … ]` |
| `,` | trennt die Paare und die Einträge einer Liste | |
| `"…"` | ein Text. Zahlen und `true`/`false` stehen ohne Anführungszeichen. | `"Ziege"`, `6` |

Objekte und Listen lassen sich **verschachteln**: Das ganze Zoo-Objekt enthält die Liste `tiere`, und jedes Tier ist wieder ein Objekt. Wie bei Arrays zählt die Liste ab 0: `tiere[1].name` ist `"Zora"`.

::: angeberwissen
JSON hat Douglas Crockford Anfang der 2000er bekannt gemacht. In die Lizenz seines JSON-Programms schrieb er: „Die Software soll für Gutes verwendet werden, nicht für Böses.“ Die Firma IBM fragte deshalb nach, ob sie es trotzdem benutzen darf. Er antwortete, IBM und seine Kunden dürften es auch für Böses verwenden.
:::

## Einen Wert herausholen

Profis lesen JSON mit einer Bibliothek, zum Beispiel **Gson**. Sie gehört nicht zu Java und muss erst eingebunden werden. Für unsere Zoo-Datei reichen die String-Methoden aus Lektion 17, denn jedes Tier steht in einer eigenen Zeile.

Ein Anführungszeichen im Text schreibst du in Java als `\"`. Der Text `"\"name\": \""` ist also `"name": "`, genau das, was vor jedem Namen steht.

```java
String zeile = "{\"name\": \"Zora\", \"art\": \"Ziege\", \"alter\": 6},";
int start = zeile.indexOf("\"name\": \"") + 9;
int ende = zeile.indexOf("\"", start);
String name = zeile.substring(start, ende);
```

- `indexOf("\"name\": \"")` findet den Anfang von `"name": "`. Das sind 9 Zeichen, also beginnt der Name 9 Zeichen weiter.
- `indexOf("\"", start)` sucht **ab** `start` das nächste Anführungszeichen. Dort endet der Name.
- `substring(start, ende)` schneidet den Namen heraus: `Zora`.

::: diagramm dt-json.visustruct
Den Namen aus einer JSON-Zeile holen.
:::

## Übung: Alle Namen aus dem Zoo

::: übung l26-java-namen
titel: Alle Namen aus dem Zoo
code: java
auftrag: Lies `zoo.json` Zeile für Zeile. Gib in jeder Zeile, die `"name"` enthält, nur den Namen aus.
start: l26-java-namen-start.visustruct
test: - -> Ludwig | Zora | Fuchs | Hase
braucht: whileSchleife, verzweigung
tipp: Prüfe mit `zeile.contains("\"name\"")`, ob in der Zeile ein Name steht. Die anderen Zeilen überspringst du.
tipp: Im if: `int start = zeile.indexOf("\"name\": \"") + 9;`, dann `int ende = zeile.indexOf("\"", start);` und `System.out.println(zeile.substring(start, ende));`.
lösung: l26-java-namen-loesung.visustruct
:::

## JSON schreiben

Zum Schreiben setzt du den Text mit `+` zusammen und schreibst ihn mit dem PrintWriter aus Lektion 23 in die Datei. Texte im JSON brauchen Anführungszeichen, also `\"` im Java-Text, Zahlen nicht:

```java
String name = "Zora";
int punkte = 15;
String eintrag = "{\"name\": \"" + name + "\", \"punkte\": " + punkte + "}";
// eintrag ist {"name": "Zora", "punkte": 15}
```

Bei einer Liste steht zwischen den Einträgen ein Komma, hinter dem letzten aber **keins**. Das prüfst du mit einem if.

::: ludwig
Ein einziges vergessenes Anführungszeichen oder ein Komma zu viel, und kein Programm kann die Datei mehr lesen. JSON ist streng. Darum benutzen Profis zum Schreiben auch eine Bibliothek.
:::

## Übung: Punkte als JSON speichern

::: übung l26-java-schreiben
titel: Punkte als JSON speichern
code: java
auftrag: Speichere die Punkte aus dem Quiz-Turnier als Liste in `punkte.json`. Jede Zeile enthält ein Objekt mit **name** und **punkte**, zwischen den Objekten steht ein Komma. Gib am Ende **3 Einträge gespeichert** aus.
start: l26-java-schreiben-start.visustruct
test: - -> 3 Einträge gespeichert
datei: punkte.json -> [ | {"name": "Ludwig", "punkte": 12}, | {"name": "Zora", "punkte": 15}, | {"name": "Fuchs", "punkte": 9} | ]
braucht: forSchleife, verzweigung
tipp: Gehe mit `for (int i = 0; i < namen.length; i++)` durch die Arrays. Baue den Eintrag mit `"  {\"name\": \"" + namen[i] + "\", \"punkte\": " + punkte[i] + "}"`.
tipp: Ist `i < namen.length - 1`, hängst du noch `","` an. Schreibe nach der Schleife `"]"` und schließe die Datei.
lösung: l26-java-schreiben-loesung.visustruct
:::

## Stärken und Schwächen von JSON

| Gut | Schwierig |
|---|---|
| Jeder Wert hat einen Namen. Man sieht sofort, was `6` bedeutet. | Die Datei ist länger als eine CSV-Datei, weil die Schlüssel in jeder Zeile stehen. |
| Daten lassen sich verschachteln, zum Beispiel eine Liste in einem Objekt. | Java kann JSON nicht von selbst lesen. Man braucht eine Bibliothek wie Gson. |
| JSON ist der Standard im Web. Fast jede Programmiersprache kennt es. | Ein Zeichen zu viel oder zu wenig macht die ganze Datei unlesbar. |

## Spiel: Welcher Schlüssel?

::: spiel frage
titel: Spiel: Welcher Schlüssel?
intro: Ludwig sucht Werte in JSON-Dateien. Lies die Datei und sag, welcher Wert gemeint ist. Fünf Runden.

runde:
    {"name": "Zora", "art": "Ziege", "alter": 6}
frage: Was ist der Wert von **alter**?
- "alter"
- [x] 6
- "Ziege"
> Vor dem Doppelpunkt steht der Schlüssel, dahinter der Wert. Zahlen stehen ohne Anführungszeichen.

runde:
    {
      "tiere": [
        {"name": "Ludwig", "alter": 7},
        {"name": "Zora", "alter": 6},
        {"name": "Fuchs", "alter": 4}
      ]
    }
frage: Was ist **tiere[1].name**?
- Ludwig
- [x] Zora
- Fuchs
> Die Liste zählt wie ein Array ab 0. `tiere[1]` ist das zweite Tier.

runde:
    {
      "zoo": "Burgzoo",
      "chef": {"name": "Ludwig", "art": "Geißbock"}
    }
frage: Wie kommst du an **Geißbock**?
- [x] chef.art
- art
- zoo.chef.art
> `art` steckt im Objekt `chef`. Darum geht der Weg über `chef`.

runde:
    {
      "name": "Hase",
      "lieblingsessen": ["Karotten", "Klee", "Löwenzahn"]
    }
frage: Was ist **lieblingsessen[2]**?
- Klee
- Karotten
- [x] Löwenzahn
> Index 0 ist Karotten, 1 ist Klee, 2 ist Löwenzahn. So etwas passt in CSV nur schwer in eine Zelle.

runde:
    {"name": "Fuchs", "alter": 4, "hungrig": true}
frage: Welcher Schlüssel hat einen Wahrheitswert?
- name
- alter
- [x] hungrig
> `true` und `false` stehen wie Zahlen ohne Anführungszeichen. In Java wäre das ein `boolean`.
:::

## Checkliste

::: checkliste
- Ich kenne Objekte, Schlüssel, Werte und Listen in JSON. → Daten mit Namen
- Ich kann mit indexOf und substring einen Wert aus einer JSON-Zeile holen. → Einen Wert herausholen
- Ich habe alle Namen aus dem Zoo ausgegeben. → Übung: Alle Namen aus dem Zoo
- Ich kann mit + und \" einen JSON-Eintrag bauen und speichern. → JSON schreiben
- Ich habe die Punkte als JSON gespeichert. → Übung: Punkte als JSON speichern
- Ich kenne eine Stärke und eine Schwäche von JSON. → Stärken und Schwächen von JSON
:::

## Wissenstest

::: quiz
? Was steht in JSON vor jedem Wert?
- [ ] seine Zeilennummer
- [x] sein Schlüssel, zum Beispiel "name"
- [ ] ein Semikolon
> Schlüssel und Wert werden durch einen Doppelpunkt getrennt.

? Wie schreibst du ein Anführungszeichen in einem Java-Text?
- [ ] ""
- [x] \"
- [ ] '"'

? Was ist bei {"tiere": [{"name": "Ludwig"}, {"name": "Zora"}]} der Wert von tiere[0].name?
- [x] Ludwig
- [ ] Zora
- [ ] tiere
> Die Liste zählt ab 0.

? Ordne zu.
= { } -> ein Objekt mit Schlüsseln und Werten
= [ ] -> eine Liste
= : -> trennt Schlüssel und Wert
:::
