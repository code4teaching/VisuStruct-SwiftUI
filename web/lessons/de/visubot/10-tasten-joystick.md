---
titel: Tasten und Joystick
bereich: VisuBot
kurz: Der mBot2 wartet auf dich und lässt sich fernsteuern.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- die Sensoren für Tasten und Joystick abfragen
- auf eine Taste warten
- den mBot2 mit dem Joystick steuern
:::

## Drücken als Sensor

::: mbot2
fokus: joystick, buttons
ansicht: oben
:::

Auf dem CyberPi sitzen zwei [Tasten]{teil=buttons} (A und B) und ein [Joystick]{teil=joystick}. Für dein Programm sind das Sensoren: Sie liefern **wahr**, solange du drückst.

| Sensor | Text |
|---|---|
| Taste A / B gedrückt? | `mbot.isButtonA()`, `mbot.isButtonB()` |
| Joystick nach oben / unten | `mbot.isJoystickUp()`, `mbot.isJoystickDown()` |
| Joystick nach links / rechts | `mbot.isJoystickLeft()`, `mbot.isJoystickRight()` |

> Ohne echten mBot2 klappst du in der [Simulation](#zeige-simulation) unter der Welt **🎛 Sensoren ausprobieren** auf. Dort gibt es die Knöpfe A, B und die Pfeile für den Joystick. Ein Klick hält sie eine Sekunde lang gedrückt.

## Warten auf Taste A im Struktogramm

Ein Roboter soll nicht sofort losfahren, wenn das Programm startet. Besser: Er wartet, bis du A drückst.

Warten heißt: eine Schleife, die so lange läuft, wie A **nicht** gedrückt ist. Damit sie nicht ganz leer ist, wartet der mBot2 darin kurz mit **kurz warten** (`mbot.pause(100)`, also 100 Millisekunden).

::: übung vb-start-a
titel: Start mit Taste A
auftrag: Der mBot2 wartet, bis Taste A gedrückt ist. Dann fährt er 30 cm vor.
messwerte: isButtonA=false/true -> forward 30
messwerte: isButtonA=true -> forward 30
braucht: whileSchleife
tipp: Eine While-Schleife mit der Bedingung `!mbot.isButtonA()`. Darin steht **kurz warten**.
tipp: Nach der Schleife steht `mbot.forward(30)`.
lösung: vb-start-a-loesung.visustruct
:::

> Beim Prüfen ist Taste A erst eine Weile nicht gedrückt und dann gedrückt. Fährt dein mBot2 zu früh los, fällt das auf.

## Jetzt in Java: Fernsteuerung

Mit dem Joystick lenkst du den mBot2. Das Programm fragt fünfmal nacheinander den Joystick ab: nach oben heißt vorfahren, nach unten zurückfahren.

::: übung vb-java-joystick
titel: Fernsteuerung
code: java
auftrag: Schreibe in Java eine For-Schleife, die fünfmal läuft. Darin: Ist der Joystick oben, fährt der mBot2 vor. Sonst: Ist er unten, fährt er zurück.
messwerte: isJoystickUp=true -> forward 50
messwerte: isJoystickDown=true -> backward 50
messwerte: isJoystickUp=false -> none
braucht: forSchleife, verzweigung
tipp: `for (int i = 0; i < 5; i++) { … }` und darin `if (mbot.isJoystickUp()) { … } else { … }`.
tipp: Im `else` steht noch eine Verzweigung: `if (mbot.isJoystickDown()) { mbot.backward(); }`.
lösung: vb-java-joystick-loesung.visustruct
:::

::: quiz
? Was liefert `mbot.isButtonB()`, wenn niemand drückt?
→ Drücken als Sensor
- [ ] 0
- [x] false
- [ ] B
> Tasten liefern wahr oder falsch.
? Warum steht in der Warteschleife **kurz warten**?
→ Warten auf Taste A im Struktogramm
- [x] Damit die Schleife nicht leer ist und der CyberPi nicht unnötig schnell im Kreis rennt.
- [ ] Damit die Taste länger leuchtet.
- [ ] Ohne Pause fährt der mBot2 rückwärts.
> Die Schleife fragt alle 100 Millisekunden nach, das reicht völlig.
:::

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann die Sensoren für Tasten und Joystick abfragen. → Drücken als Sensor
- Ich kann auf eine Taste warten. → Warten auf Taste A im Struktogramm
- Ich kann den mBot2 mit dem Joystick steuern. → Jetzt in Java: Fernsteuerung
:::
