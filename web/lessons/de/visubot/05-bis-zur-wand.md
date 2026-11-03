---
titel: Bis zur Wand
bereich: Sensoren und Entscheidungen
kurz: Der mBot2 misst den Abstand und hält rechtzeitig an.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- mit `mbot.getDistance()` den Abstand abfragen
- entscheiden, wann ich eine While-Schleife statt einer For-Schleife nehme
- mit dem Liniensensor ein Ziel finden
:::

## Wie weit ist die Wand?

Bisher hast du genau gesagt, wie weit der mBot2 fahren soll. Jetzt soll er selbst merken, wann er anhalten muss.

Dafür gibt es den Ultraschallsensor. `mbot.getDistance()` liefert den Abstand bis zur nächsten Wand in Zentimetern, zum Beispiel `38`. Du kannst ihn wie eine Zahl benutzen:

```java
mbot.getDistance() > 15
```

Das ist eine **Bedingung**: Sie ist wahr, solange die Wand mehr als 15 cm entfernt ist.

> Starte die [Simulation](#zeige-simulation): Unter der Welt steht immer der aktuelle Abstand. Fährt der mBot2 näher an die Wand, wird die Zahl kleiner.

## Drei Welten, ein Programm

Diese Übung hat **drei Welten**. In jeder steht die Wand woanders, und der mBot2 soll jedes Mal im Ziel mit der grünen Fahne anhalten, ohne anzustoßen.

Mit einer festen Anzahl **fahre vor** klappt das nur in einer Welt. Du brauchst eine Schleife, die so lange fährt, wie die Bedingung wahr ist: die **While-Schleife**.

::: übung vb-bis-wand
titel: Bis zur Wand
auftrag: Der mBot2 soll vorwärts fahren, bis die Wand höchstens 15 cm entfernt ist. Dein Programm muss in allen drei Welten funktionieren. Über der Simulation wählst du, welche Welt du siehst.
welt: wand-kurz, wand-mittel, wand-lang
braucht: whileSchleife
tipp: Zieh eine While-Schleife ins Struktogramm und den Sensor **Abstand** auf die Schleife. Dann fehlt nur noch der Vergleich.
tipp: Eine While-Schleife mit der Bedingung `mbot.getDistance() > 15`, darin ein `mbot.forward()`.
lösung: vb-bis-wand-loesung.visustruct
:::

::: ludwig
Eine Schleife, die eine Bedingung prüft, bevor sie fährt, ist wie ich am Futtertrog: Ich frage zuerst, ob noch etwas drin ist, und erst dann fresse ich weiter.
:::

## Bis zum Ziel

Jetzt kommt der zweite Sensor dran. Das Ziel ist ein schwarzes Feld mit grüner Fahne. Fährt der mBot2 darauf, sieht es sein Liniensensor: `mbot.getLine()` ist dann nicht mehr `0`.

::: übung vb-bis-ziel
titel: Fahre bis zum Ziel
auftrag: Der mBot2 soll so lange vorwärts fahren, bis er auf dem Ziel steht. Auch hier gibt es zwei Welten.
welt: ziel-kurz, ziel-lang
braucht: whileSchleife
tipp: Die Schleife soll laufen, solange der Liniensensor **nichts** sieht. Zieh den Sensor **Linie** auf die While-Schleife.
tipp: Die Bedingung heißt `mbot.getLine() == 0`. In der Schleife steht `mbot.forward()`.
lösung: vb-bis-ziel-loesung.visustruct
:::

## Was prüft die Schleife?

> 📘 **Mehr dazu ohne Roboter:** In VisuStruct gibt es die Lektion [„While-Schleife“](?visustruct&lektion=11-while-schleife). Sie öffnet sich in einem neuen Fenster.

::: übung vb-fehler-05-bis-zur-wand
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Bis zur Wand“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-05-bis-zur-wand-start.visustruct
welt: wand-kurz, wand-mittel, wand-lang
tipp: Lies die Fehlermeldung genau. In welchem Kasten bleibt die Simulation stehen? Java unterscheidet Groß- und Kleinschreibung.
tipp: Richtig heißt es `mbot.forward()`.
lösung: vb-bis-wand-loesung.visustruct
:::

## Spiel: Wie oft fährt er?

::: spiel frage
titel: Spiel: Wie oft fährt er?
intro: Jede Fahrt ist 10 cm lang. Rechne aus, wie oft der mBot2 vorfährt, bevor die Schleife aufhört. Sechs Runden.

runde:
    while (mbot.getDistance() > 15) {
        mbot.forward();
    }
frage: Die Wand ist am Anfang 40 cm entfernt. Wie oft fährt er vor?
- 2-mal
- [x] 3-mal
- 4-mal
> 40, 30 und 20 sind größer als 15: drei Fahrten. Bei 10 hört die Schleife auf.

runde:
    while (mbot.getDistance() > 15) {
        mbot.forward();
    }
frage: Die Wand ist am Anfang 15 cm entfernt. Wie oft fährt er vor?
- [x] gar nicht
- 1-mal
- 2-mal
> 15 ist nicht größer als 15. Die Bedingung ist gleich am Anfang falsch.

runde:
    while (mbot.getDistance() > 15) {
        mbot.forward();
    }
frage: Die Wand ist am Anfang 50 cm entfernt. Wo hält er an?
- 15 cm vor der Wand
- [x] 10 cm vor der Wand
- 0 cm, er stößt an
> 50, 40, 30, 20: viermal vor. Dann ist die Wand 10 cm weg, und die Schleife hört auf.

runde:
    while (mbot.getLine() == 0) {
        mbot.forward();
    }
frage: Der mBot2 steht schon auf dem schwarzen Ziel. Wie oft fährt er vor?
- [x] gar nicht
- 1-mal
- immer weiter
> Auf Schwarz ist `mbot.getLine()` nicht 0. Die Bedingung ist sofort falsch.

runde:
frage: Der mBot2 soll genau fünfmal vorfahren. Welche Schleife passt am besten?
- [x] eine For-Schleife
- eine While-Schleife mit `mbot.getDistance()`
- gar keine Schleife
> Die Anzahl steht vorher fest. Dafür ist die For-Schleife da.

runde:
frage: Der mBot2 soll fahren, bis er die Wand fast berührt. Welche Schleife passt?
- eine For-Schleife, die zehnmal läuft
- [x] eine While-Schleife mit `mbot.getDistance()`
- gar keine Schleife
> Wie weit die Wand weg ist, weiß man vorher nicht. Die While-Schleife fragt unterwegs nach.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann mit `mbot.getDistance()` den Abstand abfragen. → Wie weit ist die Wand?
- Ich kann entscheiden, wann ich eine While-Schleife statt einer For-Schleife nehme. → Drei Welten, ein Programm
- Ich kann mit dem Liniensensor ein Ziel finden. → Bis zum Ziel
:::

## Wissenstest

::: quiz
? Der mBot2 steht 40 cm vor der Wand. Wie oft fährt er mit `while (mbot.getDistance() > 15) mbot.forward();` vor, wenn jede Fahrt 10 cm ist?
→ Wie weit ist die Wand?
- [ ] gar nicht
- [ ] einmal
- [x] so oft, bis die Wand höchstens 15 cm weg ist
- [ ] immer genau fünfmal
> Die While-Schleife prüft vor jeder Fahrt die Bedingung. Ist die Wand nah genug, hört sie auf.
? Warum reicht hier keine For-Schleife mit fester Anzahl?
→ Drei Welten, ein Programm
- [x] Weil die Wand in jeder Welt anders weit weg ist.
- [ ] Weil eine For-Schleife keine Anweisungen enthalten darf.
- [ ] Weil der mBot2 For-Schleifen nicht versteht.
> Die For-Schleife weiß vorher, wie oft sie läuft. Die While-Schleife entscheidet unterwegs.
:::
