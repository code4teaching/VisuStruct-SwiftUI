---
titel: Motoren und Geschwindigkeit
bereich: VisuBot
kurz: Gas geben, lenken und einer Linie folgen.
---

## Zwei Motoren, zwei Räder

::: mbot2
fokus: motors, wheels
ansicht: unten
:::

Der mBot2 hat zwei [Motoren]{teil=motors}, jeder treibt ein [Rad]{teil=wheels} an. Bisher hast du **fahre vor** und **drehe rechts** benutzt. Diese Befehle fahren eine feste Strecke und warten, bis der mBot2 angekommen ist.

Mit **Räder einzeln** (`mbot.drive(links, rechts)`) gibst du stattdessen Gas: Du sagst, wie stark sich jedes Rad dreht, in Prozent von −100 bis 100. Der mBot2 fährt dann **weiter**, bis du ihm etwas anderes sagst. Mit **anhalten** (`mbot.stop()`) bleibt er stehen.

| Befehl | Was passiert? |
|---|---|
| `mbot.drive(40, 40)` | beide Räder gleich schnell: geradeaus |
| `mbot.drive(-40, -40)` | rückwärts |
| `mbot.drive(10, 40)` | rechts schneller: Kurve nach links |
| `mbot.drive(40, -40)` | Räder gegeneinander: dreht auf der Stelle nach rechts |
| `mbot.stop()` | anhalten |

> Im Simulator fährt `mbot.drive(100, 100)` 20 cm pro Sekunde. Probier es in der [Simulation](#zeige-simulation) aus.

## Gas geben bis zur Wand im Struktogramm

In Lektion 4 ist der mBot2 in 10-cm-Schritten bis zur Wand gefahren. Mit **Räder einzeln** geht das ohne Ruckeln: einmal Gas geben, dann warten, bis die Wand nah ist, dann anhalten.

::: übung vb-gas-bis-wand
titel: Gas geben bis zur Wand
auftrag: Der mBot2 gibt mit 50 % Gas. Solange die Wand mehr als 15 cm entfernt ist, wartet er kurz. Danach hält er an. Es gibt drei Welten.
welt: wand-kurz, wand-mittel, wand-lang
braucht: whileSchleife
tipp: Ganz oben steht `mbot.drive(50, 50)`. Darunter eine While-Schleife mit der Bedingung `mbot.getDistance() > 15`.
tipp: In der Schleife steht nur **kurz warten**. Der mBot2 fährt dabei weiter! Nach der Schleife steht **anhalten**.
lösung: vb-gas-bis-wand-loesung.visustruct
:::

## Der Linienfolger

::: mbot2
fokus: lineSensor
ansicht: unten
:::

Ein Klassiker: Der mBot2 folgt einer schwarzen Linie auf dem Boden. Dafür schaut er auf die beiden mittleren Fühler des [Liniensensors]{teil=lineSensor}:

| Sensor | Text |
|---|---|
| linker mittlerer Fühler sieht Schwarz | `mbot.isLineLeft()` |
| rechter mittlerer Fühler sieht Schwarz | `mbot.isLineRight()` |

Die Idee: Sehen **beide** die Linie, fährt er geradeaus. Sieht nur der **linke** sie, ist die Linie nach links gewandert: Er lenkt nach links, also dreht sich das rechte Rad schneller. Sieht nur der **rechte** sie, lenkt er nach rechts.

## Jetzt in Java: Linienfolger

::: übung vb-java-linienfolger
titel: Linienfolger
code: java
auftrag: Schreibe in Java einen Linienfolger. Solange die Wand mehr als 15 cm entfernt ist, prüft der mBot2 seine beiden Fühler und lenkt. Danach hält er an. In der ersten Welt biegt die Linie nach rechts ab, in der zweiten nach links.
welt: linie-1, linie-2
braucht: whileSchleife, verzweigung
tipp: `while (mbot.getDistance() > 15) { … }` und danach `mbot.stop();`.
tipp: In der Schleife: `if (mbot.isLineLeft() && mbot.isLineRight()) { mbot.drive(40, 40); } else if (mbot.isLineLeft()) { mbot.drive(10, 40); } else if (mbot.isLineRight()) { mbot.drive(40, 10); }`
lösung: vb-java-linienfolger-loesung.visustruct
:::

> Am echten mBot2 klebst du die Linie mit schwarzem Isolierband auf einen hellen Boden. Fahr anfangs langsam, sonst schießt er in der Kurve über die Linie hinaus.

::: quiz
? Was macht `mbot.drive(30, 30)`?
- [ ] Er fährt 30 cm und hält an.
- [x] Er fährt geradeaus und hört nicht auf, bis ein anderer Fahrbefehl kommt.
- [ ] Er dreht sich um 30°.
> **Räder einzeln** gibt nur Gas. Anhalten musst du selbst.
? Der mBot2 soll nach rechts lenken. Welcher Befehl passt?
- [ ] `mbot.drive(10, 40)`
- [x] `mbot.drive(40, 10)`
- [ ] `mbot.drive(-40, -40)`
> Dreht sich das linke Rad schneller, fährt er eine Rechtskurve.
:::

::: checkliste
- Ich kann mit Räder einzeln Gas geben und anhalten. → Zwei Motoren, zwei Räder
- Ich kann fahren, bis ein Sensor etwas meldet. → Gas geben bis zur Wand im Struktogramm
- Ich kann einen Linienfolger in Java schreiben. → Jetzt in Java: Linienfolger
:::
