---
titel: Farben erkennen
bereich: VisuBot
kurz: Der Quad-RGB-Sensor sagt, auf welcher Farbe der mBot2 steht.
---

## Ein Sensor, der Farben sieht

::: mbot2
fokus: lineSensor
ansicht: unten
:::

Der [Liniensensor]{teil=lineSensor} heißt eigentlich **Quad-RGB-Sensor**. „Quad“ heißt vier (vier Fühler), „RGB“ steht für Rot, Grün und Blau. Er leuchtet den Boden in diesen drei Farben an und misst, welche Farbe zurückkommt. So erkennt er farbige Felder.

`mbot.getColor()` liefert den Namen der Farbe unter dem mBot2, und zwar als **Text**:

| Boden | `mbot.getColor()` |
|---|---|
| rotes Feld | `"rot"` |
| grünes Feld | `"grün"` |
| blaues Feld | `"blau"` |
| gelbes Feld | `"gelb"` |
| schwarzes Feld oder Linie | `"schwarz"` |
| heller Boden | `"weiß"` |

Ob es eine bestimmte Farbe ist, fragst du mit `.equals(…)`: `mbot.getColor().equals("rot")` ist **wahr**, wenn der mBot2 auf Rot steht, sonst **falsch**. Das ist also schon eine fertige Bedingung.

> Texte vergleichst du in Java immer mit `.equals(…)`, **nicht** mit `==`. Das `==` sieht richtig aus, klappt bei Texten aber oft nicht.

> Mit dem `!` davor drehst du eine Bedingung um: `!mbot.getColor().equals("rot")` heißt „**nicht** rot“.

## Fahre bis Rot im Struktogramm

::: übung vb-bis-rot
titel: Fahre bis Rot
auftrag: Der mBot2 fährt vor, solange er **nicht** auf einem roten Feld steht. In der zweiten Welt liegt vorher ein grünes Feld, das soll ihn nicht stören.
welt: farbe-1 -> forward 20
welt: farbe-2 -> forward 50
braucht: whileSchleife
tipp: Zieh eine While-Schleife ins Struktogramm und den Sensor **Farbe ist rot?** darauf. Schreib ein `!` vor `mbot.getColor().equals("rot")`.
tipp: Die Bedingung heißt `!mbot.getColor().equals("rot")`, in der Schleife steht **fahre vor**.
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
tipp: Außen steht `while (!mbot.getColor().equals("blau")) { … }`. Darin zuerst `mbot.forward();`.
tipp: Danach, noch in der Schleife: `if (mbot.getColor().equals("grün")) { mbot.playTone(880, 200); }`.
lösung: vb-java-blau-gruen-loesung.visustruct
:::

::: quiz
? Der mBot2 steht auf einem roten Feld. Was ist `!mbot.getColor().equals("rot")`?
- [ ] wahr
- [x] falsch
> `mbot.getColor().equals("rot")` ist wahr, das `!` macht daraus falsch. Die Schleife hört also auf.
? Womit vergleichst du die Farbe mit `"grün"`?
- [x] `mbot.getColor().equals("grün")`
- [ ] `mbot.getColor() == "grün"`
- [ ] `mbot.getColor() = "grün"`
> `mbot.getColor()` liefert einen Text, und Texte vergleicht man mit `.equals(…)`. Ein einzelnes `=` ist eine Zuweisung, gar kein Vergleich.
:::

::: checkliste
- Ich kann mit `mbot.getColor().equals(…)` eine Farbe abfragen. → Ein Sensor, der Farben sieht
- Ich kann mit `!` eine Bedingung umdrehen. → Fahre bis Rot im Struktogramm
- Ich kann eine Verzweigung in eine Schleife schreiben. → Jetzt in Java: bei Grün piepen
:::
