---
titel: Hallo mBot2
bereich: Losfahren
kurz: Der mBot2 fährt vor und wieder zurück.
---

## Das schaffst du heute

::: kompetenzen
- den mBot2 vorwärts fahren lassen
- den mBot2 rückwärts fahren lassen
:::

## Der erste Block

Das ist der mBot2. Er ist ein kleiner Roboter. Du sagst ihm mit **Blöcken**, was er tun soll.

Links bei **Elemente** liegen die Blöcke. Zieh den Block **fahre vor** unter die grüne Flagge 🏁. Klick in das weiße Feld und tipp **30** ein.

::: bloecke
    mbot.forward(30);
> So sieht dein Programm aus. Bau es nach.
:::

::: übung vbk-vor
titel: Los geht's
auftrag: Bau das Programm vom Bild nach. Klick dann auf **Simulation starten** und schau zu.
fahrt: forward 30
tipp: Der Block **fahre vor** liegt in der Gruppe **🚗 Fahren und Drehen**.
tipp: Klick in das weiße Feld im Block und tipp **30** ein.
lösung: vbk-vor-loesung.visustruct
:::

Die Zahl sagt, wie weit er fährt: 30 Zentimeter. Das ist ungefähr so lang wie ein Lineal.

## Und wieder zurück

Unter einen Block kannst du noch einen Block hängen. Der mBot2 macht alles nacheinander, von oben nach unten.

::: bloecke
    mbot.forward(60);
    mbot.backward(30);
> Erst 60 vor, dann 30 zurück.
:::

::: übung vbk-vor-zurueck
titel: Vor und zurück
auftrag: Bau das Programm vom Bild nach. Wo steht der mBot2 am Ende?
fahrt: forward 60, backward 30
tipp: Zieh **fahre zurück** genau unter **fahre vor**.
tipp: Bei **fahre vor** steht **60**, bei **fahre zurück** steht **30**.
lösung: vbk-vor-zurueck-loesung.visustruct
:::

Jetzt du: Ändere nur die Zahlen.

::: übung vbk-weit
titel: Weit weg
auftrag: Der mBot2 fährt 90 cm vor und dann 60 cm zurück.
fahrt: forward 90, backward 60
tipp: Klick auf die Zahlen in deinen Blöcken.
tipp: Bei **fahre vor** steht **90**, bei **fahre zurück** steht **60**.
lösung: vbk-weit-loesung.visustruct
:::

## Spiel: Wo landet der mBot2?

::: spiel fahrt
titel: Spiel: Wo landet der mBot2?
intro: Schau dir die Blöcke an. Tipp auf das Feld, auf dem der mBot2 am Ende steht. Ein Feld ist 30 cm groß.
frage: Wo steht der mBot2 am Ende?

runde:
    mbot.forward(30);
karte: ..... | ..... | ..^..
ziel: 2,1
> Einmal 30 cm vor, das ist ein Feld.

runde:
    mbot.forward(60);
karte: ..... | ..... | ..^..
ziel: 2,0
> 60 cm sind zwei Felder.

runde:
    mbot.forward(60);
    mbot.backward(30);
karte: ..... | ..... | ..^..
ziel: 2,1
> Zwei Felder vor, eins zurück.
:::

## Das hab ich geschafft

Wie gut klappt es? ☂️ noch nicht, ⛅ ein bisschen, ☀️ prima.

::: checkliste
- Ich kann den mBot2 vorwärts fahren lassen. → Der erste Block
- Ich kann den mBot2 zurück fahren lassen. → Und wieder zurück
:::
