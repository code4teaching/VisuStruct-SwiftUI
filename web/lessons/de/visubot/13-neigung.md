---
titel: Der Lagesensor
bereich: Sensoren und Entscheidungen
kurz: Neigung messen und Schütteln erkennen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- erklären, was der Lagesensor misst
- zwei Bedingungen mit „oder“ verbinden
- mehrere Bedingungen mit „und“ verbinden
:::

## Schief oder gerade?

::: mbot2
fokus: cyberpi
drehen: ja
:::

Im [CyberPi]{teil=cyberpi} steckt ein **Lagesensor** (Gyroskop). Er misst, wie schief der mBot2 steht, in Grad:

| Sensor | Text | Wert |
|---|---|---|
| Neigung vorn/hinten | `mbot.getPitch()` | Nase nach unten: positiv, nach oben: negativ (−90 bis 90) |
| Neigung seitlich | `mbot.getRoll()` | zur einen Seite positiv, zur anderen negativ |
| Geschüttelt? | `mbot.isShaken()` | `true` oder `false` |

Steht der mBot2 flach auf dem Tisch, sind beide Neigungen ungefähr **0**.

> In der Simulation gibt es dafür zwei Regler unter **🎛 Sensoren ausprobieren** und den Knopf **schütteln**. Mit einem echten mBot2 kippst du ihn vorsichtig in der Hand.

## Schräglage-Warnung im Struktogramm

Fährt der mBot2 eine zu steile Rampe hoch oder runter, soll er warnen. Zu steil heißt: mehr als 20° nach vorn **oder** mehr als 20° nach hinten.

::: übung vb-schraeglage
titel: Schräglage-Warnung
auftrag: Ist die Neigung vorn/hinten größer als 20 **oder** kleiner als −20, spielt der mBot2 einen Ton. Sonst tut er nichts.
messwerte: getPitch=30 -> tone
messwerte: getPitch=-30 -> tone
messwerte: getPitch=5 -> noTone
braucht: verzweigung
tipp: „oder“ heißt in einer Bedingung `||`. Zieh den Sensor **Neigung vorn/hinten** zweimal auf die Verzweigung.
tipp: Die Bedingung heißt `mbot.getPitch() > 20 || mbot.getPitch() < -20`, im true-Zweig steht **Ton spielen**.
lösung: vb-schraeglage-loesung.visustruct
:::

## Jetzt in Java: Wasserwaage

Eine Wasserwaage zeigt, ob etwas genau gerade ist. Der mBot2 leuchtet grün, wenn beide Neigungen zwischen −5 und 5 liegen.

::: übung vb-java-wasserwaage
titel: Wasserwaage
code: java
auftrag: Schreibe in Java: Liegen `mbot.getPitch()` und `mbot.getRoll()` beide zwischen −5 und 5, leuchten die LEDs grün. Sonst sind sie aus.
messwerte: getPitch=0, getRoll=0 -> ledOn
messwerte: getPitch=0, getRoll=20 -> ledOff
messwerte: getPitch=-10, getRoll=0 -> ledOff
braucht: verzweigung
tipp: „und“ heißt `&&`. Du brauchst vier Vergleiche: `mbot.getPitch() > -5 && mbot.getPitch() < 5 && …`
tipp: Grün ist `mbot.setLed(0, 255, 0);`, im `else` steht `mbot.ledOff();`.
lösung: vb-java-wasserwaage-loesung.visustruct
:::

::: übung vb-fehler-13-neigung
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Wasserwaage“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-13-neigung-start.visustruct
messwerte: getPitch=0, getRoll=0 -> ledOn
messwerte: getPitch=0, getRoll=20 -> ledOff
messwerte: getPitch=-10, getRoll=0 -> ledOff
tipp: Lies die Fehlermeldung genau. In welchem Kasten bleibt die Simulation stehen? Java unterscheidet Groß- und Kleinschreibung.
tipp: Richtig heißt es `mbot.setLed(0, 255, 0)`.
lösung: vb-java-wasserwaage-loesung.visustruct
:::

## Spiel: Zu schief?

::: spiel frage
titel: Spiel: Zu schief?
intro: Ludwig kippt den mBot2. Was tut er? Sechs Runden.

runde:
    if (mbot.getPitch() > 20 || mbot.getPitch() < -20) {
        mbot.playTone(440, 300);
    }
frage: Die Nase zeigt 30° nach unten, `mbot.getPitch()` liefert 30.
- [x] Er piept.
- Er piept nicht.
> 30 ist größer als 20. Ein wahrer Teil reicht bei `||`.

runde:
    if (mbot.getPitch() > 20 || mbot.getPitch() < -20) {
        mbot.playTone(440, 300);
    }
frage: Die Nase zeigt nach oben, `mbot.getPitch()` liefert −25.
- [x] Er piept.
- Er piept nicht.
> −25 ist kleiner als −20, also ist der zweite Teil wahr.

runde:
    if (mbot.getPitch() > 20 || mbot.getPitch() < -20) {
        mbot.playTone(440, 300);
    }
frage: Eine flache Rampe, `mbot.getPitch()` liefert 10.
- Er piept.
- [x] Er piept nicht.
> 10 liegt zwischen −20 und 20. Beide Teile sind falsch.

runde:
    if (mbot.getPitch() > 20 || mbot.getPitch() < -20) {
        mbot.playTone(440, 300);
    }
frage: `mbot.getPitch()` liefert genau 20.
- Er piept.
- [x] Er piept nicht.
> 20 ist nicht größer als 20.

runde:
    if (mbot.getPitch() > -5 && mbot.getPitch() < 5 && mbot.getRoll() > -5 && mbot.getRoll() < 5) {
        mbot.setLed(0, 255, 0);
    } else {
        mbot.ledOff();
    }
frage: `mbot.getPitch()` liefert 0, `mbot.getRoll()` liefert 3.
- [x] Die LEDs leuchten grün.
- Die LEDs sind aus.
> Alle vier Teile sind wahr. Der mBot2 liegt fast gerade.

runde:
    if (mbot.getPitch() > -5 && mbot.getPitch() < 5 && mbot.getRoll() > -5 && mbot.getRoll() < 5) {
        mbot.setLed(0, 255, 0);
    } else {
        mbot.ledOff();
    }
frage: `mbot.getPitch()` liefert 2, `mbot.getRoll()` liefert −8.
- Die LEDs leuchten grün.
- [x] Die LEDs sind aus.
> −8 ist nicht größer als −5. Bei `&&` macht ein falscher Teil alles falsch.
:::

## Spiel: Begriffe-Rätsel

::: spiel kreuzwort
titel: Spiel: Begriffe-Rätsel
intro: Fülle das Rätsel mit den Fachbegriffen aus diesem Teil. Klick auf einen Hinweis, um zum Wort zu springen. Die gelben Felder ergeben das Lösungswort.
- ↓ 1 7 JOYSTICK: kleiner Hebel auf dem CyberPi
- → 4 1 FALLAUSWAHL: switch: für jeden Wert ein eigener Fall
- → 2 3 SENSOR: Bauteil, das etwas misst
- → 6 1 VERZWEIGUNG: je nach Bedingung das eine oder das andere
- ↓ 6 9 ULTRASCHALL: damit misst der mBot2 den Abstand: ein sehr hoher Ton und sein Echo
- → 8 3 BREAK: Notbremse: verlässt sofort die Schleife
- ↓ 8 3 BEDINGUNG: ist wahr oder falsch, z. B. mbot.getDistance() < 20
- ↓ 1 11 HELLIGKEIT: mbot.getBrightness() misst sie
lösung: 4 7, 6 6, 12 3, 2 6, 2 7, 8 4
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann erklären, was der Lagesensor misst. → Schief oder gerade?
- Ich kann zwei Bedingungen mit „oder“ verbinden. → Schräglage-Warnung im Struktogramm
- Ich kann mehrere Bedingungen mit „und“ verbinden. → Jetzt in Java: Wasserwaage
:::

## Wissenstest

::: quiz
? Der mBot2 steht flach auf dem Tisch. Was liefert `mbot.getPitch()` ungefähr?
→ Schief oder gerade?
- [x] 0
- [ ] 90
- [ ] 100
? Was macht `mbot.isShaken()`?
→ Schief oder gerade?
- [ ] Es schüttelt den mBot2.
- [x] Es meldet, ob jemand den mBot2 schüttelt.
> Sensoren tun nichts, sie messen nur.
:::
