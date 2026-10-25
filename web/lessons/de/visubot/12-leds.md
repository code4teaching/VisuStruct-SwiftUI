---
titel: Die LEDs
bereich: VisuBot
kurz: Farben mischen, eine Ampel bauen und blinken lassen.
---

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

::: quiz
? Welche Farbe ergibt `mbot.setLed(0, 255, 0)`?
- [ ] Rot
- [x] Grün
- [ ] Blau
> Die Zahlen sind Rot, Grün, Blau. Nur Grün ist an.
? Warum braucht das Blaulicht **kurz warten**?
- [x] Sonst wechselt es so schnell, dass man kein Blinken sieht.
- [ ] Sonst gehen die LEDs kaputt.
- [ ] Weil `ledOff()` sonst nicht geht.
:::

::: checkliste
- Ich kann eine Farbe aus Rot, Grün und Blau mischen. → Rot, Grün und Blau mischen
- Ich kann Farben mit Pausen nacheinander zeigen. → Ampel im Struktogramm
- Ich kann die LEDs in Java blinken lassen. → Jetzt in Java: Blaulicht
:::
