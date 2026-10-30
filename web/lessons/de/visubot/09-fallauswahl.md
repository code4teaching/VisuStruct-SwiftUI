---
titel: Fallauswahl mit Farben
bereich: VisuBot
kurz: Je nach Farbe oder Linie etwas anderes tun, mit einer Fallauswahl statt vieler Verzweigungen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- eine Fallauswahl mit Texten bauen
- eine Fallauswahl mit Zahlen in Java schreiben
- eine Zahl einlesen und je nach Wert etwas ausgeben
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

## Jetzt ohne Roboter: Noten in Worten

Die Fallauswahl brauchst du nicht nur für Roboter. Dieses Programm liest eine Zahl ein, die der Benutzer in der [Konsole](#zeige-konsole) tippt:

```java
Scanner scanner = new Scanner(System.in);
int note = scanner.nextInt();
```

::: übung vb-ohne-noten
titel: Noten in Worten
code: java
auftrag: Lies eine Note als Zahl ein. Gib bei 1 **sehr gut** aus, bei 2 **gut**, bei 3 **befriedigend** und bei allen anderen Zahlen **andere Note**. Ganz ohne `mbot`!
test: 1 -> sehr gut
test: 2 -> gut
test: 3 -> befriedigend
test: 5 -> andere Note
braucht: fallauswahl
tipp: Zuerst `Scanner scanner = new Scanner(System.in);` und `int note = scanner.nextInt();`. Danach kommt `switch (note) { … }`.
tipp: `case 1 -> { System.out.println("sehr gut"); }` und so weiter, zum Schluss `default -> { System.out.println("andere Note"); }`.
lösung: vb-ohne-noten-loesung.visustruct
:::

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

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann eine Fallauswahl mit Texten bauen. → Viele Farben, viele Fälle
- Ich kann eine Fallauswahl mit Zahlen in Java schreiben. → Jetzt in Java: Linienmuster
- Ich kann eine Zahl einlesen und je nach Wert etwas ausgeben. → Jetzt ohne Roboter: Noten in Worten
:::
