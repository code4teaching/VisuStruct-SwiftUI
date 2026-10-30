---
titel: Der Lagesensor
bereich: VisuBot
kurz: Neigung messen und Schütteln erkennen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- erklären, was der Lagesensor misst
- zwei Bedingungen mit „oder“ verbinden
- mehrere Bedingungen mit „und“ verbinden
:::

## Schief oder gerade?

::: mbot2
fokus: cyberpi
drehen: ja
:::

Im [CyberPi]{teil=cyberpi} steckt ein **Lagesensor** (Gyroskop). Er misst, wie schief der mBot2 steht, in Grad:

| Sensor | Text | Wert |
|---|---|---|
| Neigung vorn/hinten | `mbot.getPitch()` | Nase nach unten: positiv, nach oben: negativ (−90 bis 90) |
| Neigung seitlich | `mbot.getRoll()` | zur einen Seite positiv, zur anderen negativ |
| Geschüttelt? | `mbot.isShaken()` | `true` oder `false` |

Steht der mBot2 flach auf dem Tisch, sind beide Neigungen ungefähr **0**.

> In der Simulation gibt es dafür zwei Regler unter **🎛 Sensoren ausprobieren** und den Knopf **schütteln**. Mit einem echten mBot2 kippst du ihn vorsichtig in der Hand.

## Schräglage-Warnung im Struktogramm

Fährt der mBot2 eine zu steile Rampe hoch oder runter, soll er warnen. Zu steil heißt: mehr als 20° nach vorn **oder** mehr als 20° nach hinten.

::: übung vb-schraeglage
titel: Schräglage-Warnung
auftrag: Ist die Neigung vorn/hinten größer als 20 **oder** kleiner als −20, spielt der mBot2 einen Ton. Sonst tut er nichts.
messwerte: getPitch=30 -> tone
messwerte: getPitch=-30 -> tone
messwerte: getPitch=5 -> noTone
braucht: verzweigung
tipp: „oder“ heißt in einer Bedingung `||`. Zieh den Sensor **Neigung vorn/hinten** zweimal auf die Verzweigung.
tipp: Die Bedingung heißt `mbot.getPitch() > 20 || mbot.getPitch() < -20`, im Ja-Zweig steht **Ton spielen**.
lösung: vb-schraeglage-loesung.visustruct
:::

## Jetzt in Java: Wasserwaage

Eine Wasserwaage zeigt, ob etwas genau gerade ist. Der mBot2 leuchtet grün, wenn beide Neigungen zwischen −5 und 5 liegen.

::: übung vb-java-wasserwaage
titel: Wasserwaage
code: java
auftrag: Schreibe in Java: Liegen `mbot.getPitch()` und `mbot.getRoll()` beide zwischen −5 und 5, leuchten die LEDs grün. Sonst sind sie aus.
messwerte: getPitch=0, getRoll=0 -> ledOn
messwerte: getPitch=0, getRoll=20 -> ledOff
messwerte: getPitch=-10, getRoll=0 -> ledOff
braucht: verzweigung
tipp: „und“ heißt `&&`. Du brauchst vier Vergleiche: `mbot.getPitch() > -5 && mbot.getPitch() < 5 && …`
tipp: Grün ist `mbot.setLed(0, 255, 0);`, im `else` steht `mbot.ledOff();`.
lösung: vb-java-wasserwaage-loesung.visustruct
:::

::: quiz
? Der mBot2 steht flach auf dem Tisch. Was liefert `mbot.getPitch()` ungefähr?
→ Schief oder gerade?
- [x] 0
- [ ] 90
- [ ] 100
? Was macht `mbot.isShaken()`?
→ Schief oder gerade?
- [ ] Es schüttelt den mBot2.
- [x] Es meldet, ob jemand den mBot2 schüttelt.
> Sensoren tun nichts, sie messen nur.
:::

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann erklären, was der Lagesensor misst. → Schief oder gerade?
- Ich kann zwei Bedingungen mit „oder“ verbinden. → Schräglage-Warnung im Struktogramm
- Ich kann mehrere Bedingungen mit „und“ verbinden. → Jetzt in Java: Wasserwaage
:::
