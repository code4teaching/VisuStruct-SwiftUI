---
titel: Um die Ecke
bereich: Losfahren
kurz: Der mBot2 dreht sich nach rechts und nach links.
---

## Das schaffst du heute

::: kompetenzen
- den mBot2 nach rechts und nach links drehen
- einen Weg um eine Ecke fahren
:::

## Rechts herum

Der Block **drehe rechts** dreht den mBot2 auf der Stelle. Ist das Feld leer, dreht er sich um eine Ecke wie bei einem Blatt Papier.

::: bloecke
    mbot.forward(30);
    mbot.turnRight();
    mbot.forward(30);
> Vor, um die Ecke, wieder vor.
:::

::: übung vbk-rechts
titel: Rechts um die Ecke
auftrag: Bau das Programm vom Bild nach und starte die Simulation.
fahrt: forward 30, turnRight 90, forward 30
tipp: Du brauchst drei Blöcke: **fahre vor**, **drehe rechts**, **fahre vor**.
tipp: In beiden Blöcken **fahre vor** steht **30**. Bei **drehe rechts** bleibt das Feld leer.
lösung: vbk-rechts-loesung.visustruct
:::

## Links herum

Es gibt auch **drehe links**.

::: übung vbk-links
titel: Links um die Ecke
auftrag: Jetzt fährt der mBot2 30 cm vor, dreht sich nach **links** und fährt noch 30 cm.
fahrt: forward 30, turnLeft 90, forward 30
tipp: Nimm dein Programm von eben. Wirf **drehe rechts** in den Papierkorb.
tipp: Hol **drehe links** an dieselbe Stelle.
lösung: vbk-links-loesung.visustruct
:::

## Umdrehen

Tippst du bei **drehe rechts** die Zahl **180** ein, dreht sich der mBot2 halb herum. Dann schaut er nach hinten.

::: bloecke
    mbot.forward(30);
    mbot.turnRight(180);
    mbot.forward(30);
> Hin und zurück, mit Umdrehen.
:::

::: übung vbk-umdrehen
titel: Hin und zurück
auftrag: Bau das Programm vom Bild nach. Der mBot2 steht am Ende wieder am Start.
fahrt: forward 30, turnRight 180, forward 30
tipp: Klick in das Feld von **drehe rechts** und tipp **180** ein.
tipp: Drei Blöcke: **fahre vor** 30, **drehe rechts** 180, **fahre vor** 30.
lösung: vbk-umdrehen-loesung.visustruct
:::

## Spiel: Wo landet der mBot2?

::: spiel fahrt
titel: Spiel: Wo landet der mBot2?
intro: Tipp auf das Feld, auf dem der mBot2 am Ende steht. Ein Feld ist 30 cm groß.
frage: Wo steht der mBot2 am Ende?

runde:
    mbot.forward(30);
    mbot.turnRight();
    mbot.forward(30);
karte: ..... | ..... | ..^..
ziel: 3,1
> Ein Feld vor, nach rechts drehen, ein Feld weiter.

runde:
    mbot.forward(30);
    mbot.turnLeft();
    mbot.forward(30);
karte: ..... | ..... | ..^..
ziel: 1,1
> Diesmal nach links.

runde:
    mbot.turnRight();
    mbot.forward(60);
karte: ..... | ..... | ..^..
ziel: 4,2
> Erst drehen, dann zwei Felder nach rechts.
:::

## Das hab ich geschafft

Wie gut klappt es? ☂️ noch nicht, ⛅ ein bisschen, ☀️ prima.

::: checkliste
- Ich kann den mBot2 nach rechts und links drehen. → Links herum
- Ich kann den mBot2 umdrehen lassen. → Umdrehen
:::
