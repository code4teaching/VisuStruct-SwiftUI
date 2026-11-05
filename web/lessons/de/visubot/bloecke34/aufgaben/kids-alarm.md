---
titel: Alarm!
nach: 5
stufe: 1
---

Der mBot2 passt auf deine Süßigkeiten auf. Drückt jemand auf seine Taste A, schlägt er Alarm.

::: übung vbk-alarm
titel: Alarm!
auftrag: Ist Taste A gedrückt, leuchten die LEDs rot und der mBot2 piept hoch mit 800. Sonst leuchten die LEDs grün.
messwerte: isButtonA=true -> none, tone, ledOn
messwerte: isButtonA=false -> none, noTone, ledOn
braucht: verzweigung
tipp: Unter **wenn** liegen zwei Blöcke: **LEDs an** mit 255, 0, 0 und **Ton spielen** mit 800.
tipp: Unter **sonst** liegt **LEDs an** mit 0, 255, 0.
lösung: vbk-alarm-loesung.visustruct
:::

Probier aus: Lass den Alarm dreimal piepen.
