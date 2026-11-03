---
titel: Fallauswahl mit Farben
bereich: Sensoren und Entscheidungen
kurz: Je nach Farbe oder Linie etwas anderes tun, mit einer Fallauswahl statt vieler Verzweigungen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- eine Fallauswahl mit Texten bauen
- eine Fallauswahl mit Zahlen in Java schreiben
- je nach Zahl einen anderen Text auf dem Bildschirm zeigen
:::

## Viele Farben, viele Fälle

Der mBot2 soll auf jede Farbe anders reagieren: bei Rot rechts abbiegen, bei Grün ein Stück vorfahren, bei Blau piepen. Mit Verzweigungen bräuchtest du drei ineinander. Übersichtlicher ist die **Fallauswahl**, in Java `switch`:

```java
switch (mbot.getColor()) {
  case "rot" -> {
    mbot.turnRight();
  }
  case "grün" -> {
    mbot.forward(20);
  }
  default -> {
    mbot.forward(10);
  }
}
```

- Oben in den Klammern steht der Wert, der geprüft wird, hier die Farbe.
- Jeder `case` ist ein **Fall**. Passt der Wert, läuft genau dieser Fall.
- `default` ist der Fall für **alles andere**.

Im Struktogramm ist die Fallauswahl ein Kasten mit mehreren Spalten, für jeden Fall eine.

::: übung vb-farbweiche
titel: Farbweiche
auftrag: Baue eine Fallauswahl über `mbot.getColor()`. Bei `"rot"` dreht sich der mBot2 nach rechts. Bei `"grün"` fährt er 20 cm vor. Bei `"blau"` spielt er einen Ton mit 880 Hertz, 200 Millisekunden lang. In allen anderen Fällen fährt er 10 cm vor.
messwerte: getColor=rot -> turnRight
messwerte: getColor=grün -> forward 20
messwerte: getColor=blau -> none, tone
messwerte: getColor=weiß -> forward 10
braucht: fallauswahl
tipp: Zieh eine Fallauswahl ins Struktogramm. Oben steht `mbot.getColor()`, die Fälle heißen `"rot"`, `"grün"` und `"blau"`, dazu der Fall für alles andere.
tipp: Bei Rot `mbot.turnRight()`, bei Grün `mbot.forward(20)`, bei Blau `mbot.playTone(880, 200)`, sonst `mbot.forward(10)`.
lösung: vb-farbweiche-loesung.visustruct
:::

## Jetzt in Java: Linienmuster

Auch eine Zahl kann der Wert einer Fallauswahl sein. `mbot.getLine()` aus Lektion 7 liefert zum Beispiel:

| Wert | Bedeutung |
|---|---|
| `0` | keine Linie |
| `6` | die beiden mittleren Fühler sehen die Linie: Er steht genau drauf |
| `15` | alle vier sehen Schwarz: eine Querlinie |

Bei Zahlen schreibst du den Fall ohne Anführungszeichen: `case 6 -> { … }`.

::: übung vb-linienmuster
titel: Linienmuster
code: java
auftrag: Schreibe in Java eine Fallauswahl über `mbot.getLine()`. Bei 6 fährt der mBot2 10 cm vor. Bei 0 dreht er sich nach rechts. Bei 15 zeigt er **Querlinie!** auf dem Bildschirm. In allen anderen Fällen fährt er 5 cm vor.
messwerte: getLine=6 -> forward 10
messwerte: getLine=0 -> turnRight
messwerte: getLine=15 -> none, screen "Querlinie!"
messwerte: getLine=4 -> forward 5
braucht: fallauswahl
tipp: `switch (mbot.getLine()) { case 6 -> { … } case 0 -> { … } case 15 -> { … } default -> { … } }`
tipp: Bei 6 `mbot.forward(10);`, bei 0 `mbot.turnRight();`, bei 15 `mbot.showText("Querlinie!");`, sonst `mbot.forward(5);`.
lösung: vb-linienmuster-loesung.visustruct
:::

## Jetzt in Java: Startsignal

Vor einem Rennen zeigt der mBot2 nacheinander drei Texte und fährt dann los. Eine For-Schleife zählt die Runden 1, 2 und 3. Die Fallauswahl sucht zu jeder Runde den passenden Text:

```java
for (int runde = 1; runde <= 3; runde++) {
    switch (runde) {
        case 1 -> { mbot.showText("Auf die Plätze"); }
        ...
    }
    mbot.pause(1000);
}
```

::: übung vb-startsignal
titel: Startsignal
code: java
auftrag: Schreibe in Java: Eine Schleife zählt `runde` von 1 bis 3. In Runde 1 zeigt der Bildschirm **Auf die Plätze**, in Runde 2 **Fertig**, sonst **Los!**. Nach jedem Text wartet der mBot2 eine Sekunde. Nach der Schleife fährt er 50 cm vor.
befehle: showText "Auf die Plätze", pause 1000, showText "Fertig", pause 1000, showText "Los!", pause 1000
fahrt: forward 50
braucht: fallauswahl
tipp: Die Schleife heißt `for (int runde = 1; runde <= 3; runde++) { … }`. Darin steht `switch (runde) { … }` und danach `mbot.pause(1000);`.
tipp: `case 1 -> { mbot.showText("Auf die Plätze"); }`, `case 2 -> { … }` und `default -> { mbot.showText("Los!"); }`. Nach der Schleife `mbot.forward(50);`.
lösung: vb-startsignal-loesung.visustruct
:::

> 📘 **Mehr dazu ohne Roboter:** In VisuStruct gibt es die Lektion [„Fallauswahl“](?visustruct&lektion=10-fallauswahl). Sie öffnet sich in einem neuen Fenster.

::: übung vb-fehler-09-fallauswahl-mbot2
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Linienmuster“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-09-fallauswahl-mbot2-start.visustruct
messwerte: getLine=6 -> forward 10
messwerte: getLine=0 -> turnRight
messwerte: getLine=15 -> none, screen "Querlinie!"
messwerte: getLine=4 -> forward 5
tipp: Lies die Fehlermeldung genau. Ist der Befehl richtig geschrieben? Nach `mbot.` schlägt dir der Editor alle Befehle vor.
tipp: Richtig heißt es `mbot.turnRight()`.
lösung: vb-linienmuster-loesung.visustruct
:::

## Spiel: Welcher Fall läuft?

::: spiel frage
titel: Spiel: Welcher Fall läuft?
intro: Lies die Fallauswahl und sag vorher, was der mBot2 tut. Sechs Runden.

runde:
    switch (mbot.getColor()) {
        case "rot" -> { mbot.turnRight(); }
        case "grün" -> { mbot.forward(20); }
        case "blau" -> { mbot.playTone(880, 300); }
        default -> { mbot.forward(10); }
    }
frage: Der mBot2 steht auf Grün. Was tut er?
- Er dreht sich nach rechts.
- [x] Er fährt 20 cm vor.
- Er fährt 10 cm vor.
> Der Fall `"grün"` passt, also läuft genau dieser.

runde:
    switch (mbot.getColor()) {
        case "rot" -> { mbot.turnRight(); }
        case "grün" -> { mbot.forward(20); }
        case "blau" -> { mbot.playTone(880, 300); }
        default -> { mbot.forward(10); }
    }
frage: Der mBot2 steht auf Gelb. Was tut er?
- Gar nichts.
- Er piept.
- [x] Er fährt 10 cm vor.
> Für Gelb gibt es keinen Fall, also läuft `default`.

runde:
    switch (mbot.getColor()) {
        case "rot" -> { mbot.turnRight(); }
        case "grün" -> { mbot.forward(20); }
        case "blau" -> { mbot.playTone(880, 300); }
        default -> { mbot.forward(10); }
    }
frage: Der mBot2 steht auf Blau. Was tut er?
- [x] Er piept.
- Er piept und fährt dann 10 cm vor.
- Er dreht sich nach rechts.
> Es läuft nur der passende Fall. `default` kommt nur dran, wenn kein anderer Fall passt.

runde:
    switch (mbot.getLine()) {
        case 6 -> { mbot.forward(10); }
        case 0 -> { mbot.turnRight(); }
        case 15 -> { mbot.showText("Querlinie!"); }
        default -> { mbot.stop(); }
    }
frage: Alle vier Fühler sehen Schwarz. Was tut der mBot2?
- Er fährt 10 cm vor.
- [x] Er zeigt **Querlinie!**
- Er hält an.
> Vier Fühler auf Schwarz ergeben 15.

runde:
    switch (mbot.getLine()) {
        case 6 -> { mbot.forward(10); }
        case 0 -> { mbot.turnRight(); }
        case 15 -> { mbot.showText("Querlinie!"); }
        default -> { mbot.stop(); }
    }
frage: Unter dem mBot2 ist alles weiß. Was tut er?
- Er fährt 10 cm vor.
- [x] Er dreht sich nach rechts.
- Er hält an.
> Kein Fühler sieht Schwarz, also liefert `mbot.getLine()` 0.

runde:
    for (int runde = 1; runde <= 3; runde++) {
        switch (runde) {
            case 1 -> { mbot.showText("Auf die Plätze"); }
            case 2 -> { mbot.showText("Fertig"); }
            default -> { mbot.showText("Los!"); }
        }
    }
frage: Was zeigt der Bildschirm in Runde 3?
- Fertig
- [x] Los!
- Auf die Plätze
> Für 3 gibt es keinen eigenen Fall, also läuft `default`.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann eine Fallauswahl mit Texten bauen. → Viele Farben, viele Fälle
- Ich kann eine Fallauswahl mit Zahlen in Java schreiben. → Jetzt in Java: Linienmuster
- Ich kann je nach Zahl einen anderen Text auf dem Bildschirm zeigen. → Jetzt in Java: Startsignal
:::

## Wissenstest

::: quiz
? Der mBot2 steht auf Gelb. Welcher Fall der Farbweiche läuft?
→ Viele Farben, viele Fälle
- [ ] der Fall `"rot"`
- [ ] gar keiner
- [x] `default`
> Für Gelb gibt es keinen eigenen Fall. Dann läuft der Fall für alles andere.
? Wie schreibst du den Fall für die Zahl 6?
→ Jetzt in Java: Linienmuster
- [x] `case 6 -> { … }`
- [ ] `case "6" -> { … }`
- [ ] `if 6 -> { … }`
> Zahlen stehen ohne Anführungszeichen, Texte wie `"rot"` mit.
:::
