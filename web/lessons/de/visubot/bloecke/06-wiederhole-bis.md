---
titel: Mache … solange
bereich: Sensoren und Entscheidungen
kurz: Erst machen, dann prüfen: die Schleife „mache … solange“.
---

## Das schaffst du heute

::: kompetenzen
- die Schleife „mache … solange“ benutzen
- den Unterschied zu „solange“ erklären
:::

## Erst machen, dann prüfen

Du kennst schon **solange**: Der mBot2 prüft **zuerst** die Frage und macht dann, was im Maul liegt.

Bei **mache … solange** ist es umgekehrt. Der mBot2 macht **zuerst**, was im Maul liegt. Erst danach prüft er unten die Frage. Ist die Antwort ja, geht es wieder nach oben.

::: bloecke
    do {
        mbot.forward(10);
    } while (mbot.getDistance() > 20);
> Erst 10 cm fahren, dann schauen: Ist die Wand noch weiter weg als 20 cm? Dann noch einmal.
:::

::: übung vbb-mache-solange
titel: Bis zur Wand
auftrag: Bau das Programm vom Bild nach. Der mBot2 fährt in Stücken von 10 cm bis kurz vor die Wand. Es wird in zwei Welten geprüft.
welt: wand-mittel -> forward 60
welt: wand-lang -> forward 110
braucht: doUntilSchleife
tipp: **Do-while-Schleife** liegt bei **Elemente**. Im Block heißt sie **mache … solange**.
tipp: Zieh **größer als** aus **Operatoren** an die Frage unten. Links kommt **Abstand** hinein, rechts tippst du **20**.
lösung: vbb-mache-solange-loesung.visustruct
:::

## Vorsicht, mindestens einmal!

Steht die Wand schon ganz nah, fährt der mBot2 trotzdem einmal los, denn er prüft ja erst danach. Probier es in der Simulation aus: Stell ihn direkt vor eine Wand. Mit **solange** wäre das nicht passiert.

**mache … solange** passt also, wenn etwas **auf jeden Fall einmal** passieren soll. Zum Beispiel: Piepen, bis jemand die Taste drückt.

::: übung vbb-piep-bis-taste
titel: Wecker
auftrag: Der mBot2 piept mit 600, jedes Mal 300 lang. Er hört erst auf, wenn Taste A gedrückt ist. Einmal piept er auf jeden Fall.
messwerte: isButtonA=false/false/true -> none, tone
messwerte: isButtonA=true -> none, tone
braucht: doUntilSchleife
tipp: Ins Maul von **mache** kommt **Ton spielen** mit 600 und 300.
tipp: Unten bei **solange** steht **nicht Taste A gedrückt?**. Zieh dafür **nicht** aus **Operatoren** und leg **Taste A gedrückt?** hinein.
lösung: vbb-piep-bis-taste-loesung.visustruct
:::

## Spiel: Wo landet der mBot2?

::: spiel fahrt
titel: Spiel: Wo landet der mBot2?
intro: Die grauen Felder sind Wände. Jedes Feld ist 30 cm groß. Achtung bei **mache … solange**: erst fahren, dann prüfen!
frage: Wo steht der mBot2 am Ende?

runde:
    while (mbot.getDistance() > 20) {
        mbot.forward(30);
    }
karte: ..#.. | ..^.. | .....
ziel: 2,1
> **solange** prüft zuerst. Die Wand ist schon nah, also fährt er gar nicht.

runde:
    do {
        mbot.forward(30);
    } while (mbot.getDistance() > 20);
karte: ..#.. | ..... | ..... | ..^..
ziel: 2,1
> **mache** zuerst: Er fährt ein Feld. Dann prüft er: noch Platz? Ja, also noch ein Feld. Jetzt ist die Wand nah: Schluss.
:::

## Das hab ich geschafft

Wie gut klappt es schon? ☂️ noch nicht, ⛅ ein bisschen, ☀️ klappt prima. Bei ☂️ und ⛅ bringt dich **Nachlesen** zum passenden Schritt.

::: checkliste
- Ich kann die Schleife „mache … solange“ benutzen. → Erst machen, dann prüfen
- Ich kann erklären, warum „mache … solange“ mindestens einmal läuft. → Vorsicht, mindestens einmal!
:::
