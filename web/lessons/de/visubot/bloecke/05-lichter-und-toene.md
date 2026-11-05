---
titel: Lichter und Töne
bereich: Licht und Ton
kurz: LEDs in allen Farben leuchten lassen, blinken und Töne spielen.
---

## Das schaffst du heute

::: kompetenzen
- die LEDs in einer Farbe leuchten lassen
- die LEDs blinken lassen
- Töne spielen
:::

## Licht an

Hinten auf dem mBot2 sitzt eine Leiste mit fünf bunten **LEDs**. Das sind kleine Lampen.

::: mbot2
fokus: leds
ansicht: oben
:::

Zieh aus der Gruppe **💡 Licht** den Block **LEDs an** unter 🏁. Im Block stehen drei Zahlen: wie viel **Rot**, wie viel **Grün** und wie viel **Blau** die LEDs mischen. Jede Zahl geht von **0** (gar nicht) bis **255** (ganz hell). `mbot.setLed(255, 0, 0)` ist also ganz rot.

::: übung vbb-licht-gruen
titel: Grünes Licht
auftrag: Lass die LEDs grün leuchten.
befehle: setLed 0 255 0
tipp: Rot und Blau brauchst du nicht, sie bekommen eine 0.
tipp: Im Block steht dann `mbot.setLed(0, 255, 0)`.
lösung: vbb-licht-gruen-loesung.visustruct
:::

Probier aus: Welche Farbe gibt `255, 255, 0`? Und `255, 0, 255`? Findest du Orange?

## Blinken

Ein Blinklicht geht an, wartet, geht aus und wartet wieder. Und das immer wieder. Den Block **kurz warten** findest du in der Gruppe **⏱️ Warten und Stoppuhr**. Die Zahl darin sind **Millisekunden**: 1000 Millisekunden sind eine Sekunde, 500 also eine halbe.

::: übung vbb-blinken
titel: Blinklicht
auftrag: Die LEDs blinken dreimal rot: eine halbe Sekunde an, eine halbe Sekunde aus.
befehle: 3 x (setLed 255 0 0, pause 500, ledOff, pause 500)
braucht: forSchleife
tipp: Du brauchst **wiederhole 3 mal** und darin vier Blöcke: **LEDs an**, **kurz warten**, **LEDs aus**, **kurz warten**.
tipp: In beiden Blöcken **kurz warten** steht **500**.
lösung: vbb-blinken-loesung.visustruct
:::

::: ludwig
Ohne **kurz warten** geht das Licht so schnell an und aus, dass du gar nichts siehst. Der mBot2 ist viel schneller als deine Augen!
:::

## Töne

Mit **Ton spielen** aus der Gruppe **🔊 Ton** piept der mBot2. Die erste Zahl sagt, wie **hoch** der Ton ist: 200 ist tief, 1000 ist hoch. Die zweite Zahl sagt, wie **lange** er klingt, wieder in Millisekunden.

::: übung vbb-sirene
titel: Sirene
auftrag: Baue eine Sirene: dreimal hintereinander ein hoher Ton mit 800 und ein tiefer mit 600, jeder 300 Millisekunden lang.
befehle: 3 x (playTone 800 300, playTone 600 300)
braucht: forSchleife
tipp: Leg zwei Blöcke **Ton spielen** in **wiederhole 3 mal**.
tipp: Im ersten steht `mbot.playTone(800, 300)`, im zweiten `mbot.playTone(600, 300)`.
lösung: vbb-sirene-loesung.visustruct
:::

Jetzt du: Bau eine **Lichtshow**. Lass die LEDs abwechselnd in verschiedenen Farben leuchten und spiel bei jeder Farbe einen anderen Ton. Je mehr Farben, desto besser!

## Spiel: Was passiert?

::: spiel frage
titel: Spiel: Was passiert?
intro: Schau dir die Blöcke an. Was macht der mBot2? Fünf Runden.

runde:
    mbot.setLed(0, 0, 255);
frage: Welche Farbe leuchtet?
- rot
- grün
- [x] blau
> Rot 0, Grün 0, Blau 255: nur Blau leuchtet.

runde:
    mbot.setLed(255, 255, 0);
frage: Welche Farbe leuchtet?
- [x] gelb
- lila
- weiß
> Rot und Grün zusammen ergeben bei Licht Gelb.

runde:
    for (int i = 0; i < 4; i++) {
        mbot.playTone(440, 300);
    }
frage: Wie oft piept der mBot2?
- 1-mal
- 3-mal
- [x] 4-mal
> Der Block **Ton spielen** liegt in **wiederhole 4 mal**.

runde:
    for (int i = 0; i < 2; i++) {
        mbot.setLed(255, 0, 0);
        mbot.pause(500);
        mbot.ledOff();
        mbot.pause(500);
    }
frage: Wie lange dauert das Programm?
- eine Sekunde
- [x] zwei Sekunden
- vier Sekunden
> Jede Runde dauert 500 + 500 Millisekunden, also eine Sekunde. Zwei Runden sind zwei Sekunden.

runde:
    mbot.playTone(1000, 200);
    mbot.playTone(200, 200);
frage: Wie klingt das?
- erst tief, dann hoch
- [x] erst hoch, dann tief
- zweimal gleich
> 1000 ist ein hoher Ton, 200 ein tiefer.
:::

## Das hab ich geschafft

Wie gut klappt es schon? ☂️ noch nicht, ⛅ ein bisschen, ☀️ klappt prima. Bei ☂️ und ⛅ bringt dich **Nachlesen** zum passenden Schritt.

::: checkliste
- Ich kann die LEDs in einer Farbe leuchten lassen. → Licht an
- Ich kann die LEDs blinken lassen. → Blinken
- Ich kann Töne spielen. → Töne
:::
