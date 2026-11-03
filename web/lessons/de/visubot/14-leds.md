---
titel: Die LEDs
bereich: Licht, Ton und Bildschirm
kurz: Farben mischen, eine Ampel bauen und blinken lassen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- eine Farbe aus Rot, Grün und Blau mischen
- Farben mit Pausen nacheinander zeigen
- die LEDs in Java blinken lassen
:::

## Rot, Grün und Blau mischen

::: mbot2
fokus: leds
ansicht: hinten
:::

Die fünf [LEDs]{teil=leds} sind ein **Aktor**: Sie tun etwas, sie leuchten. Jede LED mischt ihre Farbe aus Rot, Grün und Blau, jeweils von 0 (aus) bis 255 (ganz hell).

| Befehl | Kasten | Was passiert |
|---|---|---|
| `mbot.setLed(255, 0, 0)` | **LEDs an** | alle LEDs rot |
| `mbot.ledOff()` | **LEDs aus** | alle LEDs aus |
| `mbot.pause(1000)` | **kurz warten** | 1000 Millisekunden (1 Sekunde) warten |

| Farbe | Rot | Grün | Blau |
|---|---|---|---|
| Rot | 255 | 0 | 0 |
| Gelb | 255 | 200 | 0 |
| Grün | 0 | 255 | 0 |
| Blau | 0 | 0 | 255 |
| Weiß | 255 | 255 | 255 |
| Lila | 160 | 0 | 255 |

> Ohne **kurz warten** schaltet der mBot2 die Farben so schnell um, dass du nur die letzte siehst. In der Simulation siehst du die Farbe an den LEDs des 3D-Modells.

## Ampel im Struktogramm

::: übung vb-ampel
titel: Ampel
auftrag: Die LEDs zeigen nacheinander Rot, Gelb und Grün wie eine Ampel. Zwischen den Farben wartet der mBot2 jeweils 1000 Millisekunden. Gelb ist `255, 200, 0`.
befehle: setLed 255 0 0, pause 1000, setLed 255 200 0, pause 1000, setLed 0 255 0
tipp: Zieh dreimal **LEDs an** und zweimal **kurz warten** ins Struktogramm, abwechselnd.
tipp: Ändere die Zahlen: `mbot.setLed(255, 0, 0)`, `mbot.pause(1000)`, `mbot.setLed(255, 200, 0)`, `mbot.pause(1000)`, `mbot.setLed(0, 255, 0)`.
lösung: vb-ampel-loesung.visustruct
:::

## Jetzt in Java: Blaulicht

Blinken heißt: an, warten, aus, warten, und das immer wieder. Das „immer wieder“ ist eine Schleife.

::: übung vb-java-blinken
titel: Blaulicht
code: java
auftrag: Schreibe in Java eine For-Schleife, die dreimal läuft. Darin gehen die LEDs blau an, der mBot2 wartet 500 Millisekunden, die LEDs gehen aus, und er wartet wieder 500 Millisekunden.
befehle: 3 x (setLed 0 0 255, pause 500, ledOff, pause 500)
braucht: forSchleife
tipp: `for (int i = 0; i < 3; i++) { … }`
tipp: In der Schleife: `mbot.setLed(0, 0, 255);`, `mbot.pause(500);`, `mbot.ledOff();`, `mbot.pause(500);`.
lösung: vb-java-blinken-loesung.visustruct
:::

::: übung vb-fehler-14-leds
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Blaulicht“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-14-leds-start.visustruct
befehle: 3 x (setLed 0 0 255, pause 500, ledOff, pause 500)
tipp: Lies die Fehlermeldung genau. In welchem Kasten bleibt die Simulation stehen? Java unterscheidet Groß- und Kleinschreibung.
tipp: Richtig heißt es `mbot.pause(500)`.
lösung: vb-java-blinken-loesung.visustruct
:::

## Spiel: Welche Farbe?

::: spiel frage
titel: Spiel: Welche Farbe?
intro: Rot, Grün und Blau gemischt: Welche Farbe zeigen die LEDs? Sieben Runden.

runde:
    mbot.setLed(255, 0, 0);
frage: Welche Farbe leuchtet?
- [x] Rot
- Grün
- Blau
> Nur der erste Wert, Rot, ist an.

runde:
    mbot.setLed(0, 0, 255);
frage: Welche Farbe leuchtet?
- Rot
- Grün
- [x] Blau
> Die Reihenfolge ist immer Rot, Grün, Blau. Nur Blau ist an.

runde:
    mbot.setLed(255, 255, 255);
frage: Welche Farbe leuchtet?
- Gelb
- [x] Weiß
- aus
> Alle drei Farben ganz hell ergeben Weiß.

runde:
    mbot.setLed(255, 200, 0);
frage: Welche Farbe leuchtet?
- [x] Gelb
- Lila
- Weiß
> Rot und Grün zusammen ergeben Gelb.

runde:
    mbot.setLed(160, 0, 255);
frage: Welche Farbe leuchtet?
- Gelb
- [x] Lila
- Grün
> Rot und Blau zusammen ergeben Lila.

runde:
    mbot.setLed(0, 0, 0);
frage: Welche Farbe leuchtet?
- Weiß
- Schwarz
- [x] keine, die LEDs sind aus
> Alle drei Werte sind 0. Eine LED kann nicht schwarz leuchten.

runde:
    mbot.setLed(255, 0, 0);
    mbot.setLed(0, 255, 0);
    mbot.pause(1000);
frage: Welche Farbe siehst du eine Sekunde lang?
- Rot
- [x] Grün
- erst Rot, dann Grün
> Ohne **kurz warten** zwischen den Farben ist Rot sofort wieder weg.
:::

## Spiel: Bombe entschärfen

::: spiel bombe
titel: Spiel: Bombe entschärfen
intro: In jedem Programm steckt **genau ein Fehler**, und die Bombe tickt. Tippe auf die falsche Zeile, bevor die Zeit abläuft. Vier Runden, je 30 Sekunden.
zeit: 30

runde:
    mbot.setLed(255, 0, 0);
    mbot.pause(1000);
    mbot.setLed(255, 200, 0);
    mbot.pause(1000);
    mbot.setLed(0, 0, 255);
frage: Soll wie eine Ampel Rot, Gelb und Grün zeigen.
fehler: 5
besser: mbot.setLed(0, 255, 0);
> Grün ist `0, 255, 0`. `0, 0, 255` ist Blau.

runde:
    for (int i = 0; i < 3; i++) {
        mbot.setLed(0, 0, 255);
        mbot.pause(500);
        mbot.ledOff;
        mbot.pause(500);
    }
frage: Soll dreimal blau blinken.
fehler: 4
besser: mbot.ledOff();
> Auch ein Befehl ohne Zahl braucht seine Klammern.

runde:
    mbot.setLed(0, 0, 300);
    mbot.pause(1000);
    mbot.ledOff();
frage: Soll eine Sekunde ganz hell blau leuchten.
fehler: 1
besser: mbot.setLed(0, 0, 255);
> Jede Farbe geht nur von 0 bis 255.

runde:
    mbot.setLed(255, 255, 255);
    mbot.pause(1000);
    mbot.setLed(0, 0, 0, 0);
frage: Soll eine Sekunde weiß leuchten und dann ausgehen.
fehler: 3
besser: mbot.ledOff();
> `setLed` hat genau drei Zahlen: Rot, Grün, Blau. Zum Ausschalten gibt es `mbot.ledOff()`.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann eine Farbe aus Rot, Grün und Blau mischen. → Rot, Grün und Blau mischen
- Ich kann Farben mit Pausen nacheinander zeigen. → Ampel im Struktogramm
- Ich kann die LEDs in Java blinken lassen. → Jetzt in Java: Blaulicht
:::

## Wissenstest

::: quiz
? Welche Farbe ergibt `mbot.setLed(0, 255, 0)`?
→ Rot, Grün und Blau mischen
- [ ] Rot
- [x] Grün
- [ ] Blau
> Die Zahlen sind Rot, Grün, Blau. Nur Grün ist an.
? Warum braucht das Blaulicht **kurz warten**?
→ Jetzt in Java: Blaulicht
- [x] Sonst wechselt es so schnell, dass man kein Blinken sieht.
- [ ] Sonst gehen die LEDs kaputt.
- [ ] Weil `ledOff()` sonst nicht geht.
:::
