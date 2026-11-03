---
titel: Notbremse mit break
bereich: Sensoren und Entscheidungen
kurz: Eine Endlosschleife mit Aussprung: Der mBot2 fährt immer weiter, bis die Notbremse greift.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- eine Endlosschleife mit einem Aussprung beenden
- erklären, warum der Aussprung in einer Verzweigung steht
- in Java eine Schleife mit `while (true)` und `break` schreiben
:::

## Endlosschleife mit Aussprung

Viele Roboter-Programme laufen „für immer“: Der mBot2 fährt, misst, fährt, misst … Dafür gibt es die **Endlosschleife**. Sie hat keine Bedingung und hört von selbst nie auf.

Damit der mBot2 trotzdem anhalten kann, brauchst du eine **Notbremse**: den **Aussprung**. Er verlässt sofort die Schleife, in der er steht. Das Programm macht mit dem ersten Kasten **nach** der Schleife weiter. Du erkennst ihn an der Spitze am linken Rand. In den Kasten schreibst du einen kurzen Kommentar, zum Beispiel `Schleife verlassen`.

Ein Aussprung steht fast immer in einer **Verzweigung**. Sonst würde die Schleife schon beim ersten Durchgang enden.

::: übung vb-notbremse
titel: Notbremse an der Wand
auftrag: Baue eine Endlosschleife. Darin prüft eine Verzweigung: Ist der Abstand kleiner als 15 cm, kommt ein Aussprung. Danach (unter der Verzweigung, noch in der Schleife) fährt der mBot2 vor. Nach der Schleife spielt er einen Ton.
welt: wand-kurz -> tone
welt: wand-mittel -> tone
braucht: endlosschleife, aussprung
tipp: Zieh die **Endlosschleife** ins Struktogramm. In die Schleife kommt zuerst eine Verzweigung mit `mbot.getDistance() < 15`, im Ja-Zweig der **Aussprung**, der Nein-Zweig bleibt leer.
tipp: Unter die Verzweigung (in der Schleife) kommt **fahre vor**, unter die Schleife `mbot.playTone(440, 300)`.
lösung: vb-notbremse-loesung.visustruct
:::

## Jetzt in Java: Stopp mit Taste A

In Java ist die Endlosschleife `while (true)`. Der Aussprung heißt `break`:

```java
while (true) {
    if (mbot.isButtonA()) {
        break;
    }
    mbot.forward();
}
```

::: übung vb-java-taste-stopp
titel: Stopp mit Taste A
code: java
auftrag: Schreibe in Java: Der mBot2 fährt in einer Endlosschleife immer weiter vor. Wird Taste A gedrückt, verlässt er die Schleife mit `break`. Danach zeigt der Bildschirm **Gestoppt**.
messwerte: isButtonA=true -> none, screen "Gestoppt"
messwerte: isButtonA=false/true -> drives, screen "Gestoppt"
braucht: endlosschleife, aussprung
tipp: `while (true) { … }` mit `if (mbot.isButtonA()) { break; }` und danach `mbot.forward();`.
tipp: Nach der Schleife `mbot.showText("Gestoppt");`.
lösung: vb-java-taste-stopp-loesung.visustruct
:::

> 📘 **Mehr dazu ohne Roboter:** In VisuStruct gibt es die Lektion [„Aufruf und Aussprung“](?visustruct&lektion=18-aufruf-und-aussprung). Sie öffnet sich in einem neuen Fenster.

::: übung vb-fehler-10-unterbrechen-mit-break
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Stopp mit Taste A“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-10-unterbrechen-mit-break-start.visustruct
messwerte: isButtonA=true -> none, screen "Gestoppt"
messwerte: isButtonA=false/true -> drives, screen "Gestoppt"
tipp: Ein Text gehört in Anführungszeichen. Ohne sie sucht Java eine Variable mit diesem Namen.
tipp: Richtig heißt es `mbot.showText("Gestoppt")`.
lösung: vb-java-taste-stopp-loesung.visustruct
:::

## Spiel: Notbremse

::: spiel frage
titel: Spiel: Notbremse
intro: Wann greift der Aussprung, und was passiert danach? Jede Fahrt ist 10 cm lang. Fünf Runden.

runde:
    while (true) {
        if (mbot.getDistance() < 15) {
            break;
        }
        mbot.forward();
    }
    mbot.playTone(440, 300);
frage: Die Wand ist am Anfang 40 cm entfernt. Wie oft fährt er vor?
- 2-mal
- [x] 3-mal
- immer weiter
> Bei 40, 30 und 20 fährt er. Bei 10 greift die Notbremse.

runde:
    while (true) {
        if (mbot.getDistance() < 15) {
            break;
        }
        mbot.forward();
    }
    mbot.playTone(440, 300);
frage: Was passiert direkt nach `break`?
- Die Schleife beginnt von vorn.
- Er fährt noch einmal vor.
- [x] Er piept.
> `break` verlässt die Schleife. Weiter geht es mit dem ersten Befehl danach.

runde:
    while (true) {
        mbot.forward();
        break;
    }
frage: Wie oft fährt der mBot2 vor?
- [x] 1-mal
- gar nicht
- immer weiter
> Der Aussprung steht nicht in einer Verzweigung. Die Schleife endet schon im ersten Durchgang.

runde:
    while (true) {
        mbot.forward();
    }
frage: Wann hört diese Schleife auf?
- nach 10 Fahrten
- an der Wand
- [x] nie
> Ohne `break` ist `while (true)` wirklich endlos.

runde:
    while (true) {
        if (mbot.isButtonA()) {
            break;
        }
        mbot.forward();
    }
frage: Du drückst Taste A, nachdem er zweimal vorgefahren ist. Wie oft ist er vorgefahren?
- [x] 2-mal
- 3-mal
- gar nicht
> Beim nächsten Durchgang merkt er die Taste und springt aus der Schleife.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann eine Endlosschleife mit einem Aussprung beenden. → Endlosschleife mit Aussprung
- Ich kann erklären, warum der Aussprung in einer Verzweigung steht. → Endlosschleife mit Aussprung
- Ich kann in Java eine Schleife mit `while (true)` und `break` schreiben. → Jetzt in Java: Stopp mit Taste A
:::

## Wissenstest

::: quiz
? Wo macht das Programm nach einem Aussprung weiter?
→ Endlosschleife mit Aussprung
- [ ] am Anfang der Schleife
- [x] beim ersten Kasten nach der Schleife
- [ ] ganz am Anfang des Programms
> Der Aussprung verlässt die Schleife sofort.
? Warum steht der Aussprung in einer Verzweigung?
→ Endlosschleife mit Aussprung
- [x] Sonst endet die Schleife schon im ersten Durchgang.
- [ ] Sonst fährt der mBot2 rückwärts.
- [ ] Das ist nur schöner.
> Nur wenn die Bedingung zutrifft, soll die Notbremse greifen.
? Wie heißt die Endlosschleife in Java?
→ Jetzt in Java: Stopp mit Taste A
- [ ] `while (false)`
- [x] `while (true)`
- [ ] `for (;;) break;`
> `true` ist immer wahr, die Schleife hört nur mit `break` auf.
:::
