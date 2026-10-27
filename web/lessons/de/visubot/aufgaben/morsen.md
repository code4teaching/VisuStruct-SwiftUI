---
titel: Morsen
nach: 13
stufe: 2
---

Früher haben Schiffe mit Licht Nachrichten geschickt, im **Morsecode**: Jeder Buchstabe besteht aus kurzen und langen Signalen. Der bekannteste Notruf ist **SOS**: S ist dreimal kurz, O ist dreimal lang.

::: übung vb-morsen
titel: SOS morsen
auftrag: LED 2 morst SOS in Weiß. Kurz heißt: 200 Millisekunden an, dann 200 aus. Lang heißt: 600 Millisekunden an, dann 200 aus. Zwischen den Buchstaben wartet der mBot2 zusätzlich 400 Millisekunden. Benutze für jeden Buchstaben eine Schleife.
befehle: 3 x (ledColor 2 "weiß", pause 200, ledColor 2 "aus", pause 200), pause 400, 3 x (ledColor 2 "weiß", pause 600, ledColor 2 "aus", pause 200), pause 400, 3 x (ledColor 2 "weiß", pause 200, ledColor 2 "aus", pause 200)
braucht: forSchleife
tipp: Drei For-Schleifen hintereinander, jede läuft dreimal. Dazwischen steht jeweils **kurz warten** mit 400.
tipp: In der ersten und dritten Schleife: `mbot.led(2).setColor("weiß")`, `mbot.pause(200)`, `mbot.led(2).setColor("aus")`, `mbot.pause(200)`. In der mittleren wartet er nach dem Einschalten 600.
lösung: vb-morsen-loesung.visustruct
:::
