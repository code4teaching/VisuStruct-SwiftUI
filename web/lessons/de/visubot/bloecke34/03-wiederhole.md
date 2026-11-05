---
titel: Wiederhole
bereich: Losfahren
kurz: Ein Quadrat fahren und mit „wiederhole“ Blöcke sparen.
---

## Das schaffst du heute

::: kompetenzen
- den mBot2 ein Quadrat fahren lassen
- mit „wiederhole“ Blöcke sparen
:::

## Ein Quadrat

Ein Quadrat hat vier gleiche Seiten und vier Ecken. Für jede Seite fährt der mBot2 vor und dreht sich nach rechts.

::: bloecke
    mbot.forward(30);
    mbot.turnRight();
    mbot.forward(30);
    mbot.turnRight();
    mbot.forward(30);
    mbot.turnRight();
    mbot.forward(30);
    mbot.turnRight();
> Acht Blöcke: viermal **fahre vor** und **drehe rechts**.
:::

::: übung vbk-quadrat
titel: Das Quadrat
auftrag: Bau das Quadrat vom Bild nach. Am Ende steht der mBot2 wieder am Start.
fahrt: 4 x (forward 30, turnRight 90)
tipp: Es sind immer dieselben zwei Blöcke: **fahre vor** mit 30 und **drehe rechts**.
tipp: Bau die zwei Blöcke viermal untereinander.
lösung: vbk-quadrat-loesung.visustruct
:::

Puh, das war viel Arbeit! Das geht auch kürzer.

## Der Block wiederhole

In der Gruppe **Steuerung** liegt **wiederhole 10 mal**. Er sieht aus wie ein Maul. Was im Maul liegt, macht der mBot2 so oft, wie die Zahl sagt.

::: bloecke
    for (int i = 0; i < 4; i++) {
        mbot.forward(30);
        mbot.turnRight();
    }
> Dasselbe Quadrat mit nur drei Blöcken.
:::

::: übung vbk-quadrat-kurz
titel: Quadrat mit wiederhole
auftrag: Bau das Quadrat mit **wiederhole** nach.
fahrt: 4 x (forward 30, turnRight 90)
braucht: forSchleife
tipp: Zieh **wiederhole 10 mal** unter 🏁. Leg **fahre vor** und **drehe rechts** in das Maul.
tipp: Klick auf die 10 und tipp **4** ein.
lösung: vbk-quadrat-kurz-loesung.visustruct
:::

## Der Tanzschritt

Jetzt du! Ändere die Zahlen und die Blöcke im Maul.

::: übung vbk-hin-und-her
titel: Der Tanzschritt
auftrag: Der mBot2 tanzt: zwei Schritte vor, einen zurück. Dreimal fährt er 30 cm vor und 10 cm zurück.
fahrt: 3 x (forward 30, backward 10)
braucht: forSchleife
tipp: Im Maul von **wiederhole** liegen **fahre vor** und **fahre zurück**.
tipp: **wiederhole 3 mal**, bei **fahre vor** steht **30**, bei **fahre zurück** steht **10**.
lösung: vbk-hin-und-her-loesung.visustruct
:::

::: ludwig
Probier aus: **wiederhole 3 mal** und **drehe rechts** mit **120**. Was fährt der mBot2 jetzt?
:::

## Spiel: Wo landet der mBot2?

::: spiel fahrt
titel: Spiel: Wo landet der mBot2?
intro: Tipp auf das Feld, auf dem der mBot2 am Ende steht. Ein Feld ist 30 cm groß.
frage: Wo steht der mBot2 am Ende?

runde:
    for (int i = 0; i < 2; i++) {
        mbot.forward(30);
    }
karte: ..... | ..... | ..^..
ziel: 2,0
> Zweimal ein Feld vor.

runde:
    for (int i = 0; i < 4; i++) {
        mbot.forward(30);
        mbot.turnRight();
    }
karte: ..... | ..... | ..^..
ziel: 2,2
> Ein Quadrat: Am Ende ist er wieder am Start.

runde:
    for (int i = 0; i < 2; i++) {
        mbot.forward(30);
        mbot.turnRight();
    }
karte: ..... | ..... | ..^..
ziel: 3,1
> Vor, rechts, vor, rechts: Er steht rechts neben dem Feld über dem Start.
:::

## Das hab ich geschafft

Wie gut klappt es? ☂️ noch nicht, ⛅ ein bisschen, ☀️ prima.

::: checkliste
- Ich kann den mBot2 ein Quadrat fahren lassen. → Ein Quadrat
- Ich kann mit „wiederhole“ Blöcke sparen. → Der Block wiederhole
:::
