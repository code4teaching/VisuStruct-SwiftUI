---
titel: Erst fahren, dann prüfen
bereich: Sensoren und Entscheidungen
kurz: Die Do-while-Schleife fährt immer mindestens einmal und prüft erst danach.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- erklären, dass die Do-while-Schleife ihre Bedingung erst nach dem Inhalt prüft
- eine While- und eine Do-while-Schleife vergleichen
- eine Do-while-Schleife in Java schreiben
:::

## Erst fahren, dann prüfen

Die While-Schleife aus Lektion 5 prüft **zuerst** und fährt dann. Steht die Wand schon direkt vor dem mBot2, fährt er gar nicht los. Sie ist **kopfgesteuert**: Die Bedingung steht oben im Kopf.

Die **Do-while-Schleife** ist **fußgesteuert**. Die Bedingung steht unten im Fuß des Kastens:

1. Den Inhalt einmal ausführen.
2. Die Bedingung prüfen.
3. Ist sie wahr, wieder bei 1 anfangen. Ist sie falsch, geht es unter der Schleife weiter.

Deshalb läuft der Inhalt **immer mindestens einmal**. Wenn du die Schleife anklickst, steht im Objektinspektor vor dem Textfeld `while`: Die Bedingung heißt „wiederhole, solange …“.

| Abstand am Anfang | While-Schleife | Do-while-Schleife |
|---|---|---|
| 50 cm | fährt bis 15 cm | fährt bis 15 cm |
| 10 cm | fährt **gar nicht** | fährt **einmal** 10 cm |

::: übung vb-do-while
titel: Mindestens ein Schritt
auftrag: Baue ein Struktogramm mit einer Do-while-Schleife: Der mBot2 fährt vor, solange der Abstand größer als 15 cm ist, aber **mindestens einmal**. Danach spielt er einen Ton.
messwerte: getDistance=10 -> forward, tone
welt: wand-kurz -> tone
braucht: doUntilSchleife
tipp: Zieh die **Do-while-Schleife** aus den Elementen ins Struktogramm. In den Kasten kommt **fahre vor**, in den Fuß die Bedingung `mbot.getDistance() > 15`.
tipp: Unter die Schleife (nicht hinein) kommt `mbot.playTone(440, 300)`.
lösung: vb-do-while-loesung.visustruct
:::

> Beim Prüfen steht die Wand einmal nur 10 cm vor dem mBot2. Eine While-Schleife würde dann gar nicht fahren.

## Jetzt in Java: Schritte zählen

In Java steht `do` oben und `while (…)` mit Semikolon unten:

```java
do {
    mbot.forward();
} while (mbot.getDistance() > 15);
```

::: übung vb-java-schritte-zaehlen
titel: Schritte zählen
code: java
auftrag: Schreibe in Java: Lege `int schritte = 0` an. In einer Do-while-Schleife fährt der mBot2 vor und zählt `schritte` um eins hoch, solange der Abstand größer als 15 cm ist. Danach zeigt der Bildschirm zum Beispiel **Schritte: 3**.
welt: wand-kurz -> screen "Schritte: 3"
messwerte: getDistance=10 -> forward, screen "Schritte: 1"
braucht: doUntilSchleife
tipp: `do { mbot.forward(); schritte = schritte + 1; } while (mbot.getDistance() > 15);`
tipp: Nach der Schleife `mbot.showText("Schritte: " + schritte);`.
lösung: vb-java-schritte-zaehlen-loesung.visustruct
:::

> 📘 **Mehr dazu ohne Roboter:** In VisuStruct gibt es die Lektion [„Do-while-Schleife“](?visustruct&lektion=12-do-while-schleife). Sie öffnet sich in einem neuen Fenster.

::: übung vb-fehler-05-erst-fahren-dann-pruefen
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Schritte zählen“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-05-erst-fahren-dann-pruefen-start.visustruct
welt: wand-kurz -> screen "Schritte: 3"
messwerte: getDistance=10 -> forward, screen "Schritte: 1"
tipp: Die Fehlermeldung nennt eine unbekannte Variable. Wie heißt die Variable dort, wo sie angelegt wird? Java unterscheidet Groß- und Kleinschreibung.
tipp: Richtig heißt es `mbot.showText("Schritte: " + schritte)`.
lösung: vb-java-schritte-zaehlen-loesung.visustruct
:::

::: quiz
? Wo steht bei der Do-while-Schleife die Bedingung?
→ Erst fahren, dann prüfen
- [ ] oben im Kopf
- [x] unten im Fuß
- [ ] gar nicht
> Fußgesteuert heißt: erst der Inhalt, dann die Bedingung.
? Die Wand steht 10 cm vor dem mBot2. Wie oft fährt `do { mbot.forward(); } while (mbot.getDistance() > 15);`?
→ Erst fahren, dann prüfen
- [ ] gar nicht
- [x] einmal
- [ ] bis er anstößt
> Der Inhalt läuft immer mindestens einmal. Danach ist die Bedingung falsch.
? Was gehört in Java hinter `while (…)` am Ende der Do-while-Schleife?
→ Jetzt in Java: Schritte zählen
- [x] ein Semikolon `;`
- [ ] eine geschweifte Klammer `{`
- [ ] nichts
> `} while (Bedingung);` endet mit einem Semikolon.
:::

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann erklären, dass die Do-while-Schleife ihre Bedingung erst nach dem Inhalt prüft. → Erst fahren, dann prüfen
- Ich kann eine While- und eine Do-while-Schleife vergleichen. → Erst fahren, dann prüfen
- Ich kann eine Do-while-Schleife in Java schreiben. → Jetzt in Java: Schritte zählen
:::
