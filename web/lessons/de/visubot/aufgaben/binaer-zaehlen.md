---
titel: Binär zählen
nach: 13
kurs: 13
stufe: 3
---

Computer rechnen mit nur zwei Ziffern: 0 und 1. Das heißt **binär**. Mit drei LEDs kannst du die Zahlen 0 bis 7 binär zeigen: LED 0 zählt 1, LED 1 zählt 2 und LED 2 zählt 4. Die Zahl 5 ist 4 + 1, also leuchten LED 2 und LED 0.

| Zahl | LED 2 (4) | LED 1 (2) | LED 0 (1) |
|---|---|---|---|
| 0 | aus | aus | aus |
| 1 | aus | aus | an |
| 2 | aus | an | aus |
| 3 | aus | an | an |
| 5 | an | aus | an |

::: übung vb-binaer-zaehlen
titel: Binär zählen
auftrag: Eine For-Schleife zählt `zahl` von 0 bis 7. Für jede Zahl leuchtet jede der LEDs 0, 1 und 2 grün oder ist aus, genau wie in der Tabelle. Danach wartet der mBot2 1000 Millisekunden. Schalte die LEDs immer in der Reihenfolge 0, 1, 2.
befehle: ledColor 0 "aus", ledColor 1 "aus", ledColor 2 "aus", pause 1000, ledColor 0 "grün", ledColor 1 "aus", ledColor 2 "aus", pause 1000, ledColor 0 "aus", ledColor 1 "grün", ledColor 2 "aus", pause 1000, ledColor 0 "grün", ledColor 1 "grün", ledColor 2 "aus", pause 1000, ledColor 0 "aus", ledColor 1 "aus", ledColor 2 "grün", pause 1000, ledColor 0 "grün", ledColor 1 "aus", ledColor 2 "grün", pause 1000, ledColor 0 "aus", ledColor 1 "grün", ledColor 2 "grün", pause 1000, ledColor 0 "grün", ledColor 1 "grün", ledColor 2 "grün", pause 1000
braucht: forSchleife, verzweigung
tipp: Ob LED 0 an ist, verrät der Rest beim Teilen durch 2: `zahl % 2 == 1`. Für LED 1 teilst du erst durch 2: `zahl / 2 % 2 == 1`. Für LED 2 durch 4: `zahl / 4 % 2 == 1`.
tipp: In der Schleife stehen drei Verzweigungen und danach **kurz warten**. Im Ja-Zweig zum Beispiel `mbot.led(0).setColor("grün")`, im Nein-Zweig `mbot.led(0).setColor("aus")`.
lösung: vb-binaer-zaehlen-loesung.visustruct
:::
