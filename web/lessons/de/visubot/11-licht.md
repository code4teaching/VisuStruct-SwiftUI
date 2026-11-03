---
titel: Der Lichtsensor
bereich: Sensoren und Entscheidungen
kurz: Hell oder dunkel? Der mBot2 wird zum Nachtlicht.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- die Helligkeit abfragen
- mit einer Verzweigung die LEDs schalten
- mehrere Befehle in einen Zweig schreiben
:::

## Wie hell ist es?

::: mbot2
fokus: lightSensor
ansicht: oben
:::

Der [Lichtsensor]{teil=lightSensor} sitzt auf dem CyberPi. `mbot.getBrightness()` liefert eine Zahl von **0** (stockdunkel) bis **100** (sehr hell).

| Sensor | Text | Wert |
|---|---|---|
| Helligkeit | `mbot.getBrightness()` | 0 bis 100 |

> In der Simulation stellst du die Helligkeit mit dem Regler unter **🎛 Sensoren ausprobieren** ein. Mit einem echten mBot2 hältst du einfach die Hand über den CyberPi.

## Nachtlicht im Struktogramm

::: übung vb-nachtlicht
titel: Nachtlicht
auftrag: Ist die Helligkeit kleiner als 30, leuchten die LEDs weiß (`mbot.setLed(255, 255, 255)`). Sonst gehen die LEDs aus (`mbot.ledOff()`).
messwerte: getBrightness=10 -> ledOn
messwerte: getBrightness=80 -> ledOff
braucht: verzweigung
tipp: Zieh eine Verzweigung ins Struktogramm und den Sensor **Helligkeit** darauf. Schreib `< 30` dahinter.
tipp: Im Ja-Zweig steht **LEDs an** mit `mbot.setLed(255, 255, 255)`, im Nein-Zweig **LEDs aus**.
lösung: vb-nachtlicht-loesung.visustruct
:::

::: angeberwissen
Straßenlaternen machen es genauso: Ein Lichtsensor merkt, wann es dämmert, und schaltet sie ein. Darum gehen sie im Winter früher an als im Sommer, ohne dass jemand eine Uhr umstellt.
:::

## Jetzt in Java: Nachtlicht mit Ton

::: übung vb-java-nachtlicht-ton
titel: Nachtlicht mit Ton
code: java
auftrag: Schreibe das Nachtlicht in Java, aber mit zwei Änderungen: Im Dunkeln leuchten die LEDs gelb (`mbot.setLed(255, 200, 0)`) **und** der mBot2 spielt einen Ton. Im Hellen gehen die LEDs aus, ohne Ton.
messwerte: getBrightness=10 -> ledOn, tone
messwerte: getBrightness=80 -> ledOff, noTone
braucht: verzweigung
tipp: `if (mbot.getBrightness() < 30) { … } else { … }`
tipp: Im `if`-Teil stehen zwei Zeilen: `mbot.setLed(255, 200, 0);` und `mbot.playTone(440, 300);`.
lösung: vb-java-nachtlicht-ton-loesung.visustruct
:::

::: übung vb-fehler-11-licht
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Nachtlicht mit Ton“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-11-licht-start.visustruct
messwerte: getBrightness=10 -> ledOn, tone
messwerte: getBrightness=80 -> ledOff, noTone
tipp: Zähle die Zahlen in der Klammer. Wie viele braucht der Befehl? Das steht unter **Nachschlagen**.
tipp: Richtig heißt es `mbot.setLed(255, 200, 0)`.
lösung: vb-java-nachtlicht-ton-loesung.visustruct
:::

## Spiel: Licht an oder aus?

::: spiel frage
titel: Spiel: Licht an oder aus?
intro: Wie hell ist es, und was tun die LEDs? Sechs Runden.
antworten: LEDs an | LEDs aus

runde:
    if (mbot.getBrightness() < 30) {
        mbot.setLed(255, 255, 255);
    } else {
        mbot.ledOff();
    }
frage: Es ist fast dunkel, die Helligkeit ist 10.
richtig: LEDs an
> 10 ist kleiner als 30.

runde:
    if (mbot.getBrightness() < 30) {
        mbot.setLed(255, 255, 255);
    } else {
        mbot.ledOff();
    }
frage: Die Helligkeit ist 45.
richtig: LEDs aus
> 45 ist nicht kleiner als 30.

runde:
    if (mbot.getBrightness() < 30) {
        mbot.setLed(255, 255, 255);
    } else {
        mbot.ledOff();
    }
frage: Die Helligkeit ist genau 30.
richtig: LEDs aus
> 30 ist nicht kleiner als 30. Für „bis einschließlich 30“ bräuchtest du `<=`.

runde:
    if (mbot.getBrightness() < 30) {
        mbot.setLed(255, 255, 255);
    } else {
        mbot.ledOff();
    }
frage: Die Helligkeit ist 29.
richtig: LEDs an
> 29 ist gerade noch kleiner als 30.

runde:
    if (mbot.getBrightness() > 70) {
        mbot.ledOff();
    } else {
        mbot.setLed(255, 200, 0);
    }
frage: Die Helligkeit ist 50.
richtig: LEDs an
> Achtung, hier ist es umgekehrt: 50 ist nicht größer als 70, also läuft der Nein-Zweig. Die LEDs leuchten gelb.

runde:
    if (mbot.getBrightness() > 70) {
        mbot.ledOff();
    } else {
        mbot.setLed(255, 200, 0);
    }
frage: Die Sonne scheint, die Helligkeit ist 100.
richtig: LEDs aus
> 100 ist größer als 70, also läuft der Ja-Zweig.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann die Helligkeit abfragen. → Wie hell ist es?
- Ich kann mit einer Verzweigung die LEDs schalten. → Nachtlicht im Struktogramm
- Ich kann mehrere Befehle in einen Zweig schreiben. → Jetzt in Java: Nachtlicht mit Ton
:::

## Wissenstest

::: quiz
? `mbot.getBrightness()` liefert 45. Was tut das Nachtlicht?
→ Nachtlicht im Struktogramm
- [ ] Die LEDs leuchten.
- [x] Die LEDs gehen aus.
> 45 ist nicht kleiner als 30.
? In welchem Bereich liegen die Werte des Lichtsensors?
→ Wie hell ist es?
- [ ] 0 bis 255
- [x] 0 bis 100
- [ ] -100 bis 100
:::
