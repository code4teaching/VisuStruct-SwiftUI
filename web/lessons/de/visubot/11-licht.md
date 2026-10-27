---
titel: Der Lichtsensor
bereich: VisuBot
kurz: Hell oder dunkel? Der mBot2 wird zum Nachtlicht.
---

## Wie hell ist es?

::: mbot2
fokus: lightSensor
ansicht: oben
:::

Der [Lichtsensor]{teil=lightSensor} sitzt auf dem CyberPi. `mbot.getBrightness()` liefert eine Zahl von **0** (stockdunkel) bis **100** (sehr hell).

| Sensor | Text | Wert |
|---|---|---|
| Helligkeit | `mbot.getBrightness()` | 0 bis 100 |

> In der Simulation stellst du die Helligkeit mit dem Regler unter **🎛 Sensoren ausprobieren** ein. Mit einem echten mBot2 hältst du einfach die Hand über den CyberPi.

## Nachtlicht im Struktogramm

::: übung vb-nachtlicht
titel: Nachtlicht
auftrag: Ist die Helligkeit kleiner als 30, leuchten die LEDs weiß (`mbot.setLed(255, 255, 255)`). Sonst gehen die LEDs aus (`mbot.ledOff()`).
messwerte: getBrightness=10 -> ledOn
messwerte: getBrightness=80 -> ledOff
braucht: verzweigung
tipp: Zieh eine Verzweigung ins Struktogramm und den Sensor **Helligkeit** darauf. Schreib `< 30` dahinter.
tipp: Im Ja-Zweig steht **LEDs an** mit `mbot.setLed(255, 255, 255)`, im Nein-Zweig **LEDs aus**.
lösung: vb-nachtlicht-loesung.visustruct
:::

::: angeberwissen
Straßenlaternen machen es genauso: Ein Lichtsensor merkt, wann es dämmert, und schaltet sie ein. Darum gehen sie im Winter früher an als im Sommer, ohne dass jemand eine Uhr umstellt.
:::

## Jetzt in Java: Nachtlicht mit Ton

::: übung vb-java-nachtlicht-ton
titel: Nachtlicht mit Ton
code: java
auftrag: Schreibe das Nachtlicht in Java, aber mit zwei Änderungen: Im Dunkeln leuchten die LEDs gelb (`mbot.setLed(255, 200, 0)`) **und** der mBot2 spielt einen Ton. Im Hellen gehen die LEDs aus, ohne Ton.
messwerte: getBrightness=10 -> ledOn, tone
messwerte: getBrightness=80 -> ledOff, noTone
braucht: verzweigung
tipp: `if (mbot.getBrightness() < 30) { … } else { … }`
tipp: Im `if`-Teil stehen zwei Zeilen: `mbot.setLed(255, 200, 0);` und `mbot.playTone(440, 300);`.
lösung: vb-java-nachtlicht-ton-loesung.visustruct
:::

::: quiz
? `mbot.getBrightness()` liefert 45. Was tut das Nachtlicht?
- [ ] Die LEDs leuchten.
- [x] Die LEDs gehen aus.
> 45 ist nicht kleiner als 30.
? In welchem Bereich liegen die Werte des Lichtsensors?
- [ ] 0 bis 255
- [x] 0 bis 100
- [ ] -100 bis 100
:::

::: checkliste
- Ich kann die Helligkeit abfragen. → Wie hell ist es?
- Ich kann mit einer Verzweigung die LEDs schalten. → Nachtlicht im Struktogramm
- Ich kann mehrere Befehle in einen Zweig schreiben. → Jetzt in Java: Nachtlicht mit Ton
:::
