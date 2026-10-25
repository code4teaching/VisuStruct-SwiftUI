---
titel: Farben erkennen
bereich: VisuBot
kurz: Der Quad-RGB-Sensor sieht rote, grüne, blaue und gelbe Felder.
---

## Ein Sensor, der Farben sieht

::: mbot2
fokus: lineSensor
ansicht: unten
:::

Der [Liniensensor]{teil=lineSensor} heißt eigentlich **Quad-RGB-Sensor**. „Quad“ heißt vier (vier Fühler), „RGB“ steht für Rot, Grün und Blau. Er leuchtet den Boden in diesen drei Farben an und misst, welche Farbe zurückkommt. So erkennt er farbige Felder.

| Sensor | Text | Wert |
|---|---|---|
| Rot? | `mbot.isRed()` | `true` oder `false` |
| Grün? | `mbot.isGreen()` | `true` oder `false` |
| Blau? | `mbot.isBlue()` | `true` oder `false` |
| Gelb? | `mbot.isYellow()` | `true` oder `false` |

Diese Sensoren liefern keine Zahl, sondern gleich **wahr** oder **falsch**. Darum brauchst du keinen Vergleich: `mbot.isRed()` ist schon eine fertige Bedingung.

> Mit dem `!` davor drehst du eine Bedingung um: `!mbot.isRed()` heißt „**nicht** rot“.

## Fahre bis Rot im Struktogramm

::: übung vb-bis-rot
titel: Fahre bis Rot
auftrag: Der mBot2 fährt vor, solange er **nicht** auf einem roten Feld steht. In der zweiten Welt liegt vorher ein grünes Feld, das soll ihn nicht stören.
welt: farbe-1 -> forward 20
welt: farbe-2 -> forward 50
braucht: whileSchleife
tipp: Zieh eine While-Schleife ins Struktogramm und den Sensor **Farbe rot?** darauf. Schreib ein `!` vor `mbot.isRed()`.
tipp: Die Bedingung heißt `!mbot.isRed()`, in der Schleife steht **fahre vor**.
lösung: vb-bis-rot-loesung.visustruct
:::

## Jetzt in Java: bei Grün piepen

Jetzt kombinierst du eine Schleife mit einer Verzweigung: Der mBot2 fährt bis Blau. Kommt er unterwegs über ein grünes Feld, piept er.

::: übung vb-java-blau-gruen
titel: Bis Blau, bei Grün piepen
code: java
auftrag: Schreibe in Java: Der mBot2 fährt vor, solange er nicht auf Blau steht. Nach jedem Schritt prüft er: Steht er auf Grün, spielt er einen Ton. In der zweiten Welt gibt es kein grünes Feld, da darf er nicht piepen.
welt: farbe-3 -> forward 30, tone
welt: farbe-4 -> forward 30, noTone
braucht: whileSchleife, verzweigung
tipp: Außen steht `while (!mbot.isBlue()) { … }`. Darin zuerst `mbot.forward();`.
tipp: Danach, noch in der Schleife: `if (mbot.isGreen()) { mbot.playTone(880, 200); }`.
lösung: vb-java-blau-gruen-loesung.visustruct
:::

::: quiz
? Der mBot2 steht auf einem roten Feld. Was ist `!mbot.isRed()`?
- [ ] wahr
- [x] falsch
> `mbot.isRed()` ist wahr, das `!` macht daraus falsch. Die Schleife hört also auf.
? Warum schreibst du bei `mbot.isGreen()` kein `== true` dahinter?
- [x] Der Sensor liefert schon wahr oder falsch, das ist bereits eine Bedingung.
- [ ] Weil Java `true` nicht kennt.
- [ ] Weil Farben keine Zahlen sind.
> `if (mbot.isGreen() == true)` geht auch, ist aber doppelt gemoppelt.
:::

::: checkliste
- Ich kenne die vier Farbsensoren. → Ein Sensor, der Farben sieht
- Ich kann mit `!` eine Bedingung umdrehen. → Fahre bis Rot im Struktogramm
- Ich kann eine Verzweigung in eine Schleife schreiben. → Jetzt in Java: bei Grün piepen
:::
