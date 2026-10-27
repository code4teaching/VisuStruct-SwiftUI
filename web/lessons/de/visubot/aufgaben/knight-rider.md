---
titel: Knight Rider
nach: 15
stufe: 2
---

In der Fernsehserie „Knight Rider“ hat das sprechende Auto KITT vorn ein rotes Licht, das immer hin und her läuft. Das baust du mit den fünf LEDs nach.

::: übung vb-knight-rider
titel: Knight Rider
auftrag: Ein rotes Licht läuft von LED 0 bis LED 4 und wieder zurück bis LED 1. Jede LED leuchtet 100 Millisekunden und geht dann aus. Benutze zwei For-Schleifen: eine zählt hoch, eine zählt runter.
befehle: ledColor 0 "rot", pause 100, ledColor 0 "aus", ledColor 1 "rot", pause 100, ledColor 1 "aus", ledColor 2 "rot", pause 100, ledColor 2 "aus", ledColor 3 "rot", pause 100, ledColor 3 "aus", ledColor 4 "rot", pause 100, ledColor 4 "aus", ledColor 3 "rot", pause 100, ledColor 3 "aus", ledColor 2 "rot", pause 100, ledColor 2 "aus", ledColor 1 "rot", pause 100, ledColor 1 "aus"
braucht: forSchleife
tipp: Die erste Schleife zählt `i` von 0 bis 4 hoch. Die zweite startet bei 3 und zählt mit `i--` runter, solange `i > 0`.
tipp: In beiden Schleifen: `mbot.led(i).setColor("rot")`, `mbot.pause(100)`, `mbot.led(i).setColor("aus")`.
lösung: vb-knight-rider-loesung.visustruct
:::
