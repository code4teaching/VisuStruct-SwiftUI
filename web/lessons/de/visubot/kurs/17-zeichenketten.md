---
titel: mBot2 mit Zeichenketten
---

## Buchstabe für Buchstabe

Der mBot2 soll seinen Namen auf dem Bildschirm aufbauen, ein Buchstabe nach dem anderen: erst **V**, dann **Vi**, dann **Vis** und so weiter bis **VisuBot**. `wort.substring(0, i)` liefert die ersten `i` Zeichen.

::: übung vb-k-buchstaben
titel: Name aufbauen
auftrag: Lege `String wort = "VisuBot"` an. Eine For-Schleife zählt `i` von 1 bis `wort.length()`. Darin zeigt der mBot2 `wort.substring(0, i)` und wartet 300 Millisekunden.
befehle: showText "V", pause 300, showText "Vi", pause 300, showText "Vis", pause 300, showText "Visu", pause 300, showText "VisuB", pause 300, showText "VisuBo", pause 300, showText "VisuBot", pause 300
braucht: forSchleife
tipp: Die Schleife beginnt bei `int i = 1` und läuft, solange `i <= wort.length()`.
tipp: In der Schleife: `mbot.showText(wort.substring(0, i))` und `mbot.pause(300)`.
lösung: vb-k-buchstaben-loesung.visustruct
:::
