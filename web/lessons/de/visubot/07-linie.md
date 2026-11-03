---
titel: Der Liniensensor
bereich: Sensoren und Entscheidungen
kurz: Dunkle Linien auf dem Boden erkennen und nicht vom Tisch fallen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- erklären, was die Zahl von `mbot.getLine()` bedeutet
- bis zu einer Linie fahren
- in Java mit einer Variable Schritte zählen
:::

## Vier Fühler unter der Nase

::: mbot2
fokus: lineSensor
ansicht: unten
:::

Der [Liniensensor]{teil=lineSensor} hat vier Fühler nebeneinander. Jeder leuchtet den Boden an und misst, wie viel Licht zurückkommt. Schwarz schluckt das Licht, Weiß wirft es zurück.

| Sensor | Text | Wert |
|---|---|---|
| Linie | `mbot.getLine()` | `0` = alles hell, größer als `0` = mindestens ein Fühler sieht Schwarz |

Für den Anfang reicht dir: **`mbot.getLine() == 0` heißt „keine Linie“**, `mbot.getLine() != 0` heißt „Linie gefunden“.

::: angeberwissen
`mbot.getLine()` ist eigentlich eine Binärzahl mit vier Stellen, eine für jeden Fühler: `1111` (also 15) heißt „alle vier sehen Schwarz“, `0110` (6) „nur die mittleren“. Damit kann ein mBot2 sogar einer Linie folgen.
:::

## Am Rand umkehren im Struktogramm

Stell dir einen Tisch mit schwarzem Klebeband am Rand vor. Der mBot2 soll vorfahren, bis er das Band sieht, und dann umkehren, damit er nicht herunterfällt.

::: übung vb-rand
titel: Am Rand umkehren
auftrag: Der mBot2 fährt vor, solange `mbot.getLine() == 0` ist. Danach dreht er sich um 180°. Es gibt zwei Welten mit unterschiedlich weitem Weg.
welt: rand-1 -> forward 20, turnRight 180
welt: rand-2 -> forward 50, turnRight 180
braucht: whileSchleife
tipp: Zieh eine While-Schleife ins Struktogramm und den Sensor **Linie** darauf. Schreib `== 0` dahinter. In die Schleife kommt **fahre vor**.
tipp: Nach der Schleife (darunter, nicht darin) steht `mbot.turnRight(180)`.
lösung: vb-rand-loesung.visustruct
:::

## Jetzt in Java: hin und zurück

Jetzt soll der mBot2 nach dem Umkehren genau bis zum Start zurückfahren. Dafür zählt er mit einer **Variable**, wie oft er vorgefahren ist.

```java
int schritte = 0;
while (mbot.getLine() == 0) {
    mbot.forward();
    schritte = schritte + 1;
}
```

::: übung vb-java-rand
titel: Bis zur Linie und zurück
code: java
auftrag: Schreibe in Java: Der mBot2 fährt bis zur Linie und zählt dabei seine Schritte. Dann dreht er sich um 180° und fährt mit einer For-Schleife genauso viele Schritte zurück.
welt: rand-1 -> forward 20, turnRight 180, forward 20
welt: rand-2 -> forward 50, turnRight 180, forward 50
braucht: whileSchleife, forSchleife
tipp: Nach der While-Schleife: `mbot.turnRight(180);` und dann `for (int i = 0; i < schritte; i++) { … }`.
tipp: In der For-Schleife steht nur `mbot.forward();`.
lösung: vb-java-rand-loesung.visustruct
:::

::: übung vb-fehler-07-linie
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Bis zur Linie und zurück“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-07-linie-start.visustruct
welt: rand-1 -> forward 20, turnRight 180, forward 20
welt: rand-2 -> forward 50, turnRight 180, forward 50
tipp: Die Fehlermeldung nennt eine unbekannte Variable. Wie heißt die Variable dort, wo sie angelegt wird? Java unterscheidet Groß- und Kleinschreibung.
tipp: Richtig heißt es `schritte = schritte + 1`.
lösung: vb-java-rand-loesung.visustruct
:::

## Spiel: Linie oder nicht?

::: spiel frage
titel: Spiel: Linie oder nicht?
intro: Wo steht der mBot2, und ist die Bedingung wahr oder falsch? Sechs Runden.
antworten: wahr | falsch

runde:
    mbot.getLine() == 0
frage: Der mBot2 steht auf weißem Papier. Ist die Bedingung wahr?
richtig: wahr
> Kein Fühler sieht Schwarz, also liefert `mbot.getLine()` 0.

runde:
    mbot.getLine() == 0
frage: Die beiden mittleren Fühler stehen auf dem schwarzen Klebeband. Ist die Bedingung wahr?
richtig: falsch
> Zwei Fühler sehen Schwarz, also ist `mbot.getLine()` größer als 0.

runde:
    mbot.getLine() != 0
frage: Nur der äußere linke Fühler sieht Schwarz. Ist die Bedingung wahr?
richtig: wahr
> Ein Fühler reicht schon, dann ist der Wert nicht mehr 0.

runde:
    mbot.getLine() != 0
frage: Der mBot2 steht auf weißem Boden. Ist die Bedingung wahr?
richtig: falsch
> Auf Weiß ist der Wert 0, und `0 != 0` ist falsch.

runde:
    mbot.getLine() == 15
frage: Eine Querlinie: Alle vier Fühler sehen Schwarz. Ist die Bedingung wahr?
richtig: wahr
> Alle vier Fühler ergeben die Binärzahl `1111`, also 15.

runde:
    int schritte = 0;
    while (mbot.getLine() == 0) {
        mbot.forward();
        schritte = schritte + 1;
    }
frage: Die Linie ist 30 cm entfernt, jede Fahrt ist 10 cm lang. Ist danach `schritte == 3`?
richtig: wahr
> Nach drei Fahrten steht er auf der Linie, und die Schleife hört auf.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann erklären, was die Zahl von `mbot.getLine()` bedeutet. → Vier Fühler unter der Nase
- Ich kann bis zu einer Linie fahren. → Am Rand umkehren im Struktogramm
- Ich kann in Java mit einer Variable Schritte zählen. → Jetzt in Java: hin und zurück
:::

## Wissenstest

::: quiz
? Der mBot2 steht auf weißem Papier. Was liefert `mbot.getLine()`?
→ Vier Fühler unter der Nase
- [x] 0
- [ ] 15
- [ ] 1
> Kein Fühler sieht Schwarz, also 0.
? Welche Bedingung heißt „Linie gefunden“?
→ Am Rand umkehren im Struktogramm
- [ ] `mbot.getLine() == 0`
- [x] `mbot.getLine() != 0`
- [ ] `mbot.getLine() < 0`
> `!=` heißt „ungleich“.
:::
