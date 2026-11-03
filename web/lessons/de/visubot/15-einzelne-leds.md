---
titel: Einzelne LEDs
bereich: Licht, Ton und Bildschirm
kurz: Jede der fünf LEDs bekommt ihre eigene Farbe, bis zum Lauflicht.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- die LEDs über ihre Nummern 0 bis 4 ansprechen
- einzelne LEDs in verschiedenen Farben leuchten lassen
- mit einer Schleife ein Lauflicht bauen
:::

## Jede LED hat eine Nummer

::: mbot2
fokus: leds
ansicht: hinten
:::

Bisher haben alle fünf [LEDs]{teil=leds} dieselbe Farbe gezeigt. Du kannst aber auch jede LED einzeln ansprechen. Dafür hat jede LED eine **Nummer**. Wie bei Arrays fängt das Zählen bei **0** an: Die fünf LEDs heißen 0, 1, 2, 3 und 4.

| Befehl | Kasten | Was passiert |
|---|---|---|
| `mbot.led(0).setColor("grün")` | **LED-Farbe setzen** | LED 0 leuchtet grün |
| `mbot.led(3).setColor("aus")` | **LED-Farbe setzen** | LED 3 geht aus |

Die Farbe schreibst du als Namen in Anführungszeichen:

| Farbname | Farbname | Farbname |
|---|---|---|
| `"rot"` | `"orange"` | `"gelb"` |
| `"grün"` | `"türkis"` | `"blau"` |
| `"lila"` | `"pink"` | `"weiß"` |

Mit `"aus"` schaltest du eine LED aus.

> Die Nummer darf auch eine Variable sein: `mbot.led(i).setColor("rot")`. So kann eine Schleife eine LED nach der anderen einschalten.

## Drei Lichter im Struktogramm

::: übung vb-drei-lichter
titel: Drei Lichter
auftrag: Schalte LED 0 rot, LED 2 gelb und LED 4 grün. Die LEDs 1 und 3 bleiben aus.
befehle: ledColor 0 "rot", ledColor 2 "gelb", ledColor 4 "grün"
tipp: Zieh dreimal **LED-Farbe setzen** ins Struktogramm.
tipp: Ändere Nummer und Farbe: `mbot.led(0).setColor("rot")`, `mbot.led(2).setColor("gelb")`, `mbot.led(4).setColor("grün")`.
lösung: vb-drei-lichter-loesung.visustruct
:::

## Jetzt in Java: Lauflicht

Bei einem Lauflicht wandert ein Licht von einer LED zur nächsten. Die Schleifenvariable `i` ist dabei die Nummer der LED.

::: übung vb-java-lauflicht
titel: Lauflicht
code: java
auftrag: Schreibe in Java eine For-Schleife, in der `i` von 0 bis 4 läuft. Darin geht LED `i` blau an, der mBot2 wartet 200 Millisekunden, und LED `i` geht wieder aus.
befehle: ledColor 0 "blau", pause 200, ledColor 0 "aus", ledColor 1 "blau", pause 200, ledColor 1 "aus", ledColor 2 "blau", pause 200, ledColor 2 "aus", ledColor 3 "blau", pause 200, ledColor 3 "aus", ledColor 4 "blau", pause 200, ledColor 4 "aus"
braucht: forSchleife
tipp: `for (int i = 0; i < 5; i++) { … }`
tipp: In der Schleife: `mbot.led(i).setColor("blau");`, `mbot.pause(200);`, `mbot.led(i).setColor("aus");`.
lösung: vb-java-lauflicht-loesung.visustruct
:::

::: übung vb-fehler-15-einzelne-leds
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Lauflicht“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-15-einzelne-leds-start.visustruct
befehle: ledColor 0 "blau", pause 200, ledColor 0 "aus", ledColor 1 "blau", pause 200, ledColor 1 "aus", ledColor 2 "blau", pause 200, ledColor 2 "aus", ledColor 3 "blau", pause 200, ledColor 3 "aus", ledColor 4 "blau", pause 200, ledColor 4 "aus"
tipp: Die Fehlermeldung nennt eine unbekannte Variable. Wie heißt die Variable dort, wo sie angelegt wird? Java unterscheidet Groß- und Kleinschreibung.
tipp: Richtig heißt es `mbot.led(i)`.
lösung: vb-java-lauflicht-loesung.visustruct
:::

## Spiel: Welche LED leuchtet?

::: spiel frage
titel: Spiel: Welche LED leuchtet?
intro: Fünf LEDs mit den Nummern 0 bis 4. Welche leuchten? Sechs Runden.

runde:
    mbot.led(0).setColor("rot");
frage: Welche LED leuchtet rot?
- [x] die erste
- die zweite
- alle
> Die Nummern fangen bei 0 an. LED 0 ist die erste.

runde:
    for (int i = 0; i < 5; i++) {
        mbot.led(i).setColor("blau");
    }
frage: Welche LEDs leuchten blau?
- LED 0 bis 3
- [x] alle fünf
- nur LED 4
> `i` läuft von 0 bis 4, das sind alle fünf.

runde:
    for (int i = 0; i < 5; i = i + 2) {
        mbot.led(i).setColor("grün");
    }
frage: Welche LEDs leuchten grün?
- LED 1 und 3
- [x] LED 0, 2 und 4
- LED 2 und 4
> `i` springt in Zweierschritten: 0, 2, 4.

runde:
    mbot.led(2).setColor("gelb");
    mbot.led(2).setColor("aus");
frage: Welche LED leuchtet am Ende?
- LED 2 gelb
- [x] keine
- LED 3 gelb
> LED 2 geht an und gleich wieder aus.

runde:
    for (int i = 4; i >= 0; i--) {
        mbot.led(i).setColor("rot");
        mbot.pause(200);
        mbot.led(i).setColor("aus");
    }
frage: Bei welcher LED beginnt dieses Lauflicht?
- LED 0
- [x] LED 4
- LED 5
> `i` beginnt bei 4 und zählt rückwärts. Das Licht läuft andersherum.

runde:
frage: Ludwig schreibt `mbot.led(5).setColor("rot");`. Welche LED leuchtet?
- die fünfte
- die sechste
- [x] keine, eine LED 5 gibt es nicht
> Die fünf LEDs haben die Nummern 0 bis 4.
:::

## Spiel: Bombe entschärfen

::: spiel bombe
titel: Spiel: Bombe entschärfen
intro: In jedem Programm steckt **genau ein Fehler**, und die Bombe tickt. Tippe auf die falsche Zeile, bevor die Zeit abläuft. Vier Runden, je 30 Sekunden.
zeit: 30

runde:
    mbot.led(1).setColor("rot");
    mbot.led(2).setColor("gelb");
    mbot.led(4).setColor("grün");
frage: Soll LED 0 rot, LED 2 gelb und LED 4 grün schalten.
fehler: 1
besser: mbot.led(0).setColor("rot");
> Die erste LED hat die Nummer 0.

runde:
    for (int i = 1; i <= 5; i++) {
        mbot.led(i).setColor("blau");
    }
frage: Soll alle fünf LEDs blau schalten.
fehler: 1
besser: for (int i = 0; i < 5; i++) {
> Die LEDs haben die Nummern 0 bis 4. Eine LED 5 gibt es nicht.

runde:
    for (int i = 0; i < 5; i++) {
        mbot.led(i).setColor("blau");
        mbot.pause(200);
        mbot.led(0).setColor("aus");
    }
frage: Lauflicht: Jede LED geht kurz blau an und wieder aus.
fehler: 4
besser: mbot.led(i).setColor("aus");
> Ausgehen soll dieselbe LED `i`, nicht immer LED 0.

runde:
    mbot.led(3).setColor(rot);
frage: Soll LED 3 rot schalten.
fehler: 1
besser: mbot.led(3).setColor("rot");
> Der Farbname ist ein Text und braucht Anführungszeichen.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann die LEDs über ihre Nummern 0 bis 4 ansprechen. → Jede LED hat eine Nummer
- Ich kann einzelne LEDs in verschiedenen Farben leuchten lassen. → Drei Lichter im Struktogramm
- Ich kann mit einer Schleife ein Lauflicht bauen. → Jetzt in Java: Lauflicht
:::

## Wissenstest

::: quiz
? Welche Nummer hat die erste LED?
→ Jede LED hat eine Nummer
- [x] 0
- [ ] 1
- [ ] 5
> Wie bei Arrays zählt man ab 0. Die fünf LEDs haben die Nummern 0 bis 4.
? Was macht `mbot.led(4).setColor("aus")`?
→ Drei Lichter im Struktogramm
- [ ] Alle LEDs gehen aus.
- [x] Nur LED 4 geht aus.
- [ ] Vier LEDs gehen aus.
:::
