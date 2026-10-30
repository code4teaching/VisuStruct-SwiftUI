---
titel: Einzelne LEDs
bereich: VisuBot
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

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann die LEDs über ihre Nummern 0 bis 4 ansprechen. → Jede LED hat eine Nummer
- Ich kann einzelne LEDs in verschiedenen Farben leuchten lassen. → Drei Lichter im Struktogramm
- Ich kann mit einer Schleife ein Lauflicht bauen. → Jetzt in Java: Lauflicht
:::
