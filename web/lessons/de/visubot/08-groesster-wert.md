---
titel: Der größte Wert
bereich: Sensoren und Entscheidungen
kurz: Rundum messen und sich den größten Wert merken: Wo ist am meisten Platz?
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- mit einer Variablen den bisher größten Wert merken
- in einer Schleife jeden neuen Messwert mit dem bisher größten vergleichen
- mit dem mBot2 herausfinden, in welcher Richtung am meisten Platz ist
:::

## Den Rekord merken

Beim Weitsprung gibt es eine Tafel mit dem **Rekord**. Nach jedem Sprung schaut die Schiedsrichterin: Ist der neue Sprung weiter als der Rekord? Dann kommt er an die Tafel. Sonst bleibt der alte Rekord stehen.

Genau so findet ein Programm den größten Wert. Die Tafel ist eine Variable `max`:

1. **Vor** der Schleife: `int max = 0`. Noch steht nichts an der Tafel.
2. **In** der Schleife: Ist der neue Wert größer als `max`? Dann `max = wert`.
3. **Nach** der Schleife steht in `max` der größte Wert.

Der mBot2 dreht sich viermal und misst jedes Mal den Abstand. So sieht das im Schreibtischtest aus:

| Richtung | gemessen | größer als `max`? | `max` danach |
|---|---|---|---|
| vorher | | | 0 |
| vorn | 16 | ja | 16 |
| rechts | 36 | ja | 36 |
| hinten | 6 | nein | 36 |
| links | 26 | nein | 36 |

> Wichtig: Die Verzweigung hat nur einen Ja-Zweig. Ist der Wert nicht größer, passiert nichts. Der alte Rekord bleibt.

## Wo ist am meisten Platz?

::: übung vb-meister-platz
titel: Wo ist am meisten Platz?
auftrag: Baue ein Struktogramm: Lege `int max = 0` an. Der mBot2 misst viermal den Abstand und dreht sich danach jeweils nach rechts. Ist ein Abstand größer als `max`, merkt er ihn sich in `max`. Zum Schluss zeigt er zum Beispiel **Am weitesten: 36 cm**. Es gibt zwei Welten.
welt: platz-1 -> screen "Am weitesten: 36 cm"
welt: platz-2 -> screen "Am weitesten: 46 cm"
braucht: forSchleife, verzweigung
tipp: Die For-Schleife läuft viermal. In ihr stehen drei Kästen: `int abstand = mbot.getDistance()`, eine Verzweigung und **drehe rechts**.
tipp: Die Verzweigung prüft `abstand > max`. Im Ja-Zweig steht `max = abstand`, der Nein-Zweig bleibt leer. Nach der Schleife: `mbot.showText("Am weitesten: " + max + " cm")`.
lösung: vb-meister-platz-loesung.visustruct
:::

::: angeberwissen
Viele Saugroboter haben oben einen kleinen Turm mit einem Laser. Er dreht sich und misst ringsum die Abstände. So zeichnet der Roboter eine Karte der Wohnung. Bei mir zu Hause misst niemand. Ich fresse mir einfach den Weg frei.
:::

## Jetzt in Java: Die Richtung merken

Jetzt weiß der mBot2, **wie viel** Platz es höchstens gibt. Aber **wo**? Dafür merkt er sich in einer zweiten Variablen auch die Richtung. Die Zählvariable `i` sagt dir, die wievielte Messung es war: 0 ist vorn, 1 ist rechts, 2 ist hinten und 3 ist links.

```java
if (abstand > max) {
    max = abstand;
    richtung = i;
}
```

Beide Zeilen stehen im Ja-Zweig. Nur wenn es einen neuen Rekord gibt, ändert sich auch die Richtung.

::: übung vb-java-richtung
titel: Die Richtung merken
code: java
auftrag: Schreibe „Wo ist am meisten Platz?“ in Java. Merke dir zusätzlich in `int richtung = 0` die Nummer der Messung mit dem größten Abstand. Zeige zum Schluss zum Beispiel **Richtung: 1**.
welt: platz-1 -> screen "Richtung: 1"
welt: platz-2 -> screen "Richtung: 0"
braucht: forSchleife, verzweigung
tipp: Vor der Schleife stehen `int max = 0;` und `int richtung = 0;`. In der Schleife: `int abstand = mbot.getDistance();`, die Verzweigung und `mbot.turnRight();`.
tipp: Im Ja-Zweig stehen `max = abstand;` und `richtung = i;`. Nach der Schleife: `mbot.showText("Richtung: " + richtung);`
lösung: vb-java-richtung-loesung.visustruct
:::

::: übung vb-fehler-08-groesster-wert
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Die Richtung merken“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-08-groesster-wert-start.visustruct
welt: platz-1 -> screen "Richtung: 1"
welt: platz-2 -> screen "Richtung: 0"
tipp: Die Fehlermeldung nennt eine unbekannte Variable. Wie heißt die Variable dort, wo sie angelegt wird? Java unterscheidet Groß- und Kleinschreibung.
tipp: Richtig heißt es `richtung = i`.
lösung: vb-java-richtung-loesung.visustruct
:::

## Spiel: Neuer Rekord?

::: spiel frage
titel: Spiel: Neuer Rekord?
intro: Der mBot2 misst nacheinander mehrere Abstände. Was steht am Ende in `max`? Fünf Runden.

runde:
frage: Gemessen: 20, 50, 30
- 30
- [x] 50
- 100
> 50 ist der größte Wert. Die 30 danach ist kein neuer Rekord.

runde:
frage: Gemessen: 10, 20, 30, 40
- 10
- [x] 40
- 100
> Jeder Wert ist ein neuer Rekord. Am Ende steht der letzte da.

runde:
frage: Gemessen: 90, 10, 20, 30
- 30
- [x] 90
- 10
> Der Rekord kommt gleich am Anfang. Danach ist kein Wert größer.

runde:
frage: Gemessen: 15, 15, 15
- 45
- 0
- [x] 15
> 15 ist nicht größer als 15. `max` bleibt 15.

runde:
frage: Gemessen: 25, 60, 60, 5. In welcher Richtung (`i`) ist der Rekord?
- 0
- [x] 1
- 2
> Bei `i = 1` kommt die 60. Die zweite 60 ist nicht **größer**, also bleibt `richtung` bei 1.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann mit einer Variablen den bisher größten Wert merken. → Den Rekord merken
- Ich kann in einer Schleife jeden neuen Messwert mit dem bisher größten vergleichen. → Wo ist am meisten Platz?
- Ich kann mit dem mBot2 herausfinden, in welcher Richtung am meisten Platz ist. → Jetzt in Java: Die Richtung merken
:::

## Wissenstest

::: quiz
? Womit fängt `max` vor der Schleife an?
→ Den Rekord merken
- [x] Mit 0, weil noch nichts gemessen ist
- [ ] Mit dem größten Wert
- [ ] Mit 100
> Jeder Abstand ist größer als 0, also wird schon der erste Messwert der Rekord.
? Was steht im Nein-Zweig der Verzweigung `abstand > max`?
→ Den Rekord merken
- [ ] `max = 0`
- [ ] `max = abstand`
- [x] Nichts, der alte Rekord bleibt.
? Wann ändert sich `richtung`?
→ Jetzt in Java: Die Richtung merken
- [ ] In jedem Durchgang
- [x] Nur wenn es einen neuen Rekord gibt
- [ ] Nur in der letzten Runde
:::
