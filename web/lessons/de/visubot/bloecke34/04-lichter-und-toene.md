---
titel: Lichter und Töne
bereich: Licht und Ton
kurz: Bunte Lichter, Blinken und Piepen.
---

## Das schaffst du heute

::: kompetenzen
- die Lichter des mBot2 in Farben leuchten lassen
- den mBot2 piepen lassen
:::

## Bunte Lichter

Der mBot2 hat fünf kleine Lichter, die **LEDs**. Der Block **LEDs an** hat drei Zahlen: **rot**, **grün** und **blau**. 255 heißt ganz hell, 0 heißt aus.

::: bloecke
    mbot.setLed(255, 0, 0);
> Rot ist 255, Grün und Blau sind 0: Die LEDs leuchten rot.
:::

::: übung vbk-rot
titel: Rotes Licht
auftrag: Bau das Programm vom Bild nach. Die LEDs leuchten rot.
befehle: setLed 255 0 0
tipp: **LEDs an** liegt in der Gruppe **💡 Licht**.
tipp: Im Block stehen die Zahlen **255**, **0**, **0**.
lösung: vbk-rot-loesung.visustruct
:::

::: übung vbk-blau
titel: Blaues Licht
auftrag: Jetzt leuchten die LEDs blau.
befehle: setLed 0 0 255
tipp: Blau ist die dritte Zahl.
tipp: Die Zahlen sind **0**, **0**, **255**.
lösung: vbk-blau-loesung.visustruct
:::

## Blinken

Ein Blinklicht geht an und aus, immer wieder. Dazwischen wartet der mBot2 kurz. 500 heißt eine halbe Sekunde.

::: bloecke
    for (int i = 0; i < 3; i++) {
        mbot.setLed(255, 255, 0);
        mbot.pause(500);
        mbot.ledOff();
        mbot.pause(500);
    }
> Dreimal gelb an, warten, aus, warten.
:::

::: übung vbk-blinken
titel: Blinklicht
auftrag: Bau das Blinklicht vom Bild nach.
befehle: 3 x (setLed 255 255 0, pause 500, ledOff, pause 500)
braucht: forSchleife
tipp: Im Maul von **wiederhole 3 mal** liegen vier Blöcke.
tipp: **kurz warten** liegt in der Gruppe **⏱️ Warten**. Tipp dort **500** ein.
lösung: vbk-blinken-loesung.visustruct
:::

## Piep, piep!

Der Block **Ton spielen** hat zwei Zahlen: Die erste sagt, wie hoch der Ton ist. Die zweite sagt, wie lange er klingt.

::: übung vbk-piep
titel: Dreimal piepen
auftrag: Der mBot2 piept dreimal mit dem Ton 440, jedes Mal 300 lang.
befehle: 3 x (playTone 440 300)
braucht: forSchleife
tipp: Leg **Ton spielen** in **wiederhole 3 mal**.
tipp: Im Block steht `mbot.playTone(440, 300)`.
lösung: vbk-piep-loesung.visustruct
:::

::: ludwig
Probier aus: Ein hoher Ton ist 800, ein tiefer Ton ist 300. Kannst du eine kleine Melodie bauen?
:::

## Spiel: Was passiert?

::: spiel frage
titel: Spiel: Was passiert?
intro: Schau dir die Blöcke an. Was macht der mBot2?

runde:
    mbot.setLed(0, 255, 0);
frage: Welche Farbe leuchtet?
- rot
- [x] grün
- blau
> Nur die zweite Zahl ist 255: grün.

runde:
    for (int i = 0; i < 5; i++) {
        mbot.playTone(440, 300);
    }
frage: Wie oft piept der mBot2?
- 1-mal
- 3-mal
- [x] 5-mal
> **Ton spielen** liegt in **wiederhole 5 mal**.

runde:
    mbot.setLed(255, 0, 0);
    mbot.pause(500);
    mbot.ledOff();
frage: Was ist am Ende?
- [x] Die LEDs sind aus.
- Die LEDs leuchten rot.
- Die LEDs blinken.
> Der letzte Block ist **LEDs aus**.
:::

## Das hab ich geschafft

Wie gut klappt es? ☂️ noch nicht, ⛅ ein bisschen, ☀️ prima.

::: checkliste
- Ich kann die LEDs in einer Farbe leuchten lassen. → Bunte Lichter
- Ich kann ein Blinklicht bauen. → Blinken
- Ich kann den mBot2 piepen lassen. → Piep, piep!
:::
