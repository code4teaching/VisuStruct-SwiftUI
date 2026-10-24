---
titel: Bis zur Wand
bereich: VisuBot
kurz: Der mBot2 misst den Abstand und hält rechtzeitig an.
---

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
tipp: In der VisuBot-Gruppe gibt es den Kasten **fahre bis zur Wand**. Schau dir an, was darin steht.
tipp: Eine While-Schleife mit der Bedingung `mbot.getDistance() > 15`, darin ein `mbot.forward()`.
lösung: vb-bis-wand-loesung.visustruct
:::

::: ludwig
Eine Schleife, die eine Bedingung prüft, bevor sie fährt, ist wie ich am Futtertrog: Ich frage zuerst, ob noch etwas drin ist, und erst dann fresse ich weiter.
:::

## Was prüft die Schleife?

::: quiz
? Der mBot2 steht 40 cm vor der Wand. Wie oft fährt er mit `while (mbot.getDistance() > 15) mbot.forward();` vor, wenn jede Fahrt 10 cm ist?
- [ ] gar nicht
- [ ] einmal
- [x] so oft, bis die Wand höchstens 15 cm weg ist
- [ ] immer genau fünfmal
> Die While-Schleife prüft vor jeder Fahrt die Bedingung. Ist die Wand nah genug, hört sie auf.
? Warum reicht hier keine For-Schleife mit fester Anzahl?
- [x] Weil die Wand in jeder Welt anders weit weg ist.
- [ ] Weil eine For-Schleife keine Anweisungen enthalten darf.
- [ ] Weil der mBot2 For-Schleifen nicht versteht.
> Die For-Schleife weiß vorher, wie oft sie läuft. Die While-Schleife entscheidet unterwegs.
:::

::: angeberwissen
Die Idee mit den Welten stammt von **Kara**, einem Marienkäfer, mit dem in der Schweiz seit vielen Jahren Programmieren gelernt wird. Kara läuft über ein Raster, weicht Bäumen aus und sammelt Kleeblätter. Auch dort muss ein Programm in mehreren Welten funktionieren.
:::

::: checkliste
- Ich kann mit `mbot.getDistance()` den Abstand abfragen. → Wie weit ist die Wand?
- Ich weiß, wann ich eine While-Schleife statt einer For-Schleife nehme. → Drei Welten, ein Programm
:::
