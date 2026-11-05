---
titel: Disco
nach: 5
stufe: 1
---

Der mBot2 macht Party! Seine LEDs wechseln die Farbe: rot, grün, blau, immer wieder.

::: übung vbb-disco
titel: Disco
auftrag: Die LEDs leuchten nacheinander rot, grün und blau, jede Farbe eine halbe Sekunde lang. Das Ganze dreimal. Danach gehen die LEDs aus.
befehle: 3 x (setLed 255 0 0, pause 500, setLed 0 255 0, pause 500, setLed 0 0 255, pause 500), ledOff
braucht: forSchleife
tipp: In **wiederhole 3 mal** liegen drei Blöcke **LEDs an**, nach jedem ein **kurz warten** mit 500.
tipp: Rot ist `255, 0, 0`, grün `0, 255, 0`, blau `0, 0, 255`. **LEDs aus** liegt unter der Schleife.
lösung: vbb-disco-loesung.visustruct
:::

Probier aus: Mach eine eigene Farbe, zum Beispiel lila mit `255, 0, 255`.
