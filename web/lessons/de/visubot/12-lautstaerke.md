---
titel: Das Mikrofon
bereich: VisuBot
kurz: Klatschen zum Losfahren und eine Lärmampel für das Klassenzimmer.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- die Lautstärke abfragen
- warten, bis etwas passiert
- eine Lärmampel in Java schreiben
:::

## Wie laut ist es?

::: mbot2
fokus: microphone
ansicht: oben
:::

Das [Mikrofon]{teil=microphone} des CyberPi misst die Lautstärke. `mbot.getLoudness()` liefert **0** (still) bis **100** (sehr laut). Ein Klatschen in der Nähe ergibt ungefähr 60 bis 90.

| Sensor | Text | Wert |
|---|---|---|
| Lautstärke | `mbot.getLoudness()` | 0 bis 100 |

## Klatschen zum Losfahren im Struktogramm

Wie beim Warten auf Taste A: Eine Schleife wartet, solange es leise ist. Erst dann fährt der mBot2 los.

::: übung vb-klatschen
titel: Klatschen zum Losfahren
auftrag: Der mBot2 wartet, solange die Lautstärke kleiner als 50 ist. Danach fährt er 30 cm vor.
messwerte: getLoudness=0/80 -> forward 30
messwerte: getLoudness=90 -> forward 30
braucht: whileSchleife
tipp: Eine While-Schleife mit der Bedingung `mbot.getLoudness() < 50`, darin **kurz warten**.
tipp: Nach der Schleife: `mbot.forward(30)`.
lösung: vb-klatschen-loesung.visustruct
:::

> In der Simulation schiebst du den Regler **Lautstärke** nach rechts, während das Programm wartet.

## Jetzt in Java: Lärmampel

::: übung vb-java-laermampel
titel: Lärmampel
code: java
auftrag: Schreibe in Java: Ist die Lautstärke größer als 60, leuchten die LEDs rot. Sonst sind sie aus.
messwerte: getLoudness=80 -> ledOn
messwerte: getLoudness=20 -> ledOff
braucht: verzweigung
tipp: `if (mbot.getLoudness() > 60) { … } else { … }`
tipp: Rot ist `mbot.setLed(255, 0, 0);`, aus ist `mbot.ledOff();`.
lösung: vb-java-laermampel-loesung.visustruct
:::

::: angeberwissen
Lautstärke misst man eigentlich in **Dezibel** (dB). Flüstern hat etwa 30 dB, ein Klassenzimmer 60 bis 70 dB, ein Presslufthammer 100 dB. Der CyberPi rechnet das in eine einfache Zahl von 0 bis 100 um.
:::

::: quiz
? Die Klatsch-Schleife lautet `while (mbot.getLoudness() < 50)`. Es ist 30 laut. Was passiert?
→ Klatschen zum Losfahren im Struktogramm
- [x] Der mBot2 wartet weiter.
- [ ] Der mBot2 fährt los.
> 30 ist kleiner als 50, die Bedingung ist wahr, die Schleife läuft weiter.
:::

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann die Lautstärke abfragen. → Wie laut ist es?
- Ich kann warten, bis etwas passiert. → Klatschen zum Losfahren im Struktogramm
- Ich kann eine Lärmampel in Java schreiben. → Jetzt in Java: Lärmampel
:::
