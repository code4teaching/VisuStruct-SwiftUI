---
titel: Roboter-Disco
nach: 4
stufe: 1
---

Party! Der mBot2 macht Licht und Musik. Erst leuchtet er rot und piept tief, dann leuchtet er blau und piept hoch.

::: übung vbk-disco
titel: Roboter-Disco
auftrag: Zweimal hintereinander: LEDs rot, Ton 400, LEDs blau, Ton 800. Jeder Ton ist 300 lang. Am Ende gehen die LEDs aus.
befehle: 2 x (setLed 255 0 0, playTone 400 300, setLed 0 0 255, playTone 800 300), ledOff
braucht: forSchleife
tipp: Im Maul von **wiederhole 2 mal** liegen vier Blöcke: **LEDs an**, **Ton spielen**, **LEDs an**, **Ton spielen**.
tipp: **LEDs aus** liegt unter dem Maul, nicht darin.
lösung: vbk-disco-loesung.visustruct
:::

Probier aus: Lass den mBot2 beim Tanzen auch noch drehen!
