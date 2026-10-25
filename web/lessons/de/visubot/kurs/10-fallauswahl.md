---
titel: mBot2 in der Fallauswahl
---

## Was sieht der Liniensensor?

Unter dem mBot2 sitzt ein Liniensensor mit vier Fühlern. `mbot.getLine()` liefert eine Zahl, die sagt, welche Fühler eine schwarze Linie sehen:

| Wert | Bedeutung |
|---|---|
| `0` | keine Linie |
| `6` | die beiden mittleren sehen die Linie: Er steht genau drauf |
| `15` | alle vier sehen Schwarz: eine Querlinie |

Viele mögliche Werte einer Zahl: Das ist ein Fall für die Fallauswahl.

::: übung vb-k-linienmuster
titel: Linienmuster
auftrag: Baue eine Fallauswahl über `mbot.getLine()`. Bei 6 fährt der mBot2 10 cm vor. Bei 0 dreht er sich nach rechts. Bei 15 zeigt er **Querlinie!** auf dem Bildschirm. In allen anderen Fällen fährt er 5 cm vor.
messwerte: getLine=6 -> forward 10
messwerte: getLine=0 -> turnRight
messwerte: getLine=15 -> none, screen "Querlinie!"
messwerte: getLine=4 -> forward 5
braucht: fallauswahl
tipp: Oben in die Fallauswahl kommt `mbot.getLine()`. Dann legst du die Fälle `6`, `0` und `15` an, dazu den Fall für alles andere.
tipp: Bei 6: `mbot.forward(10)`, bei 0: `mbot.turnRight()`, bei 15: `mbot.showText("Querlinie!")`, sonst: `mbot.forward(5)`.
lösung: vb-k-linienmuster-loesung.visustruct
:::
