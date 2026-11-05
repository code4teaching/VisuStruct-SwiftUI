---
titel: Losfahren
bereich: Erste Schritte
kurz: Den mBot2 mit Blöcken fahren und drehen lassen.
---

## Das schaffst du heute

::: kompetenzen
- den mBot2 mit Blöcken fahren lassen
- die Zahl in einem Block ändern
- den mBot2 drehen lassen
:::

Du baust dein Programm aus **Blöcken**, wie aus Bausteinen. Probier ruhig alles aus. Kaputt machen kannst du nichts.

## Dein erster Block

Links unter **Elemente** findest du die Gruppe **🚗 Fahren und Drehen**. Zieh den Block **fahre vor** nach rechts und lass ihn direkt unter **🏁 Wenn das Programm startet** los.

Im Block steht jetzt `mbot.forward( )`. Das ist Englisch: *forward* heißt vorwärts. Ganz rechts unter **mBot2 Live** siehst du sofort, wohin dein mBot2 fährt.

::: übung vbb-erster-block
titel: Der erste Block
auftrag: Zieh einen Block **fahre vor** unter **🏁 Wenn das Programm startet**. Klick dann auf **Simulation starten** und schau zu.
fahrt: forward
tipp: Die Blöcke liegen links unter **Elemente**, in der Gruppe **🚗 Fahren und Drehen**.
tipp: Lass den Block los, wenn er genau unter dem Block mit der Zielflagge 🏁 hängt.
lösung: vbb-erster-block-loesung.visustruct
:::

## Weiter fahren

Ist das weiße Feld im Block leer, fährt der mBot2 nur 10 cm. Das ist eine Kästchenbreite im Gitter. Klick auf das weiße Feld und tipp eine Zahl ein, zum Beispiel **50**. Jetzt fährt er 50 cm.

::: übung vbb-weiter
titel: 50 cm
auftrag: Lass den mBot2 genau 50 cm vorwärts fahren. Benutze dafür nur **einen** Block.
fahrt: forward 50
tipp: Klick in das weiße Feld im Block **fahre vor**.
tipp: Tipp **50** ein und drück Enter. Im Block steht dann `mbot.forward(50)`.
lösung: vbb-weiter-loesung.visustruct
:::

Probier aus: Was passiert bei **200**? Und was bei **fahre zurück**?

## Um die Ecke

Mit **drehe rechts** dreht sich der mBot2 auf der Stelle. Ist das Feld leer, dreht er sich um 90 Grad, also eine Ecke wie bei einem Blatt Papier. Die Blöcke werden von oben nach unten ausgeführt, einer nach dem anderen.

::: übung vbb-ecke
titel: Um die Ecke
auftrag: Der mBot2 fährt 50 cm vor, dreht sich nach rechts und fährt dann noch 30 cm.
fahrt: forward 50, turnRight 90, forward 30
tipp: Du brauchst drei Blöcke: **fahre vor**, **drehe rechts** und noch einmal **fahre vor**.
tipp: Im ersten Block steht 50, im letzten 30. Das Feld von **drehe rechts** bleibt leer.
lösung: vbb-ecke-loesung.visustruct
:::

Jetzt du: Tipp bei **drehe rechts** mal **180** ein. Wohin schaut der mBot2 danach?

::: übung vbb-hin-und-zurueck
titel: Hin und zurück
auftrag: Der mBot2 fährt 50 cm vor, dreht sich um und fährt zurück zum Start.
fahrt: forward 50, turnRight 180, forward 50
tipp: Umdrehen heißt: einmal halb herum, das sind 180 Grad.
tipp: **fahre vor** mit 50, **drehe rechts** mit 180, **fahre vor** mit 50.
lösung: vbb-hin-und-zurueck-loesung.visustruct
:::

::: ludwig
Zwei Blöcke **drehe rechts** mit leerem Feld hintereinander gehen auch. 90 und 90 sind zusammen 180.
:::

## Spiel: Wo landet der mBot2?

::: spiel fahrt
titel: Spiel: Wo landet der mBot2?
intro: Schau dir die Blöcke an und tipp auf das Feld, auf dem der mBot2 am Ende steht. Danach fährt er die Strecke vor. Jedes Feld ist 30 cm groß. Vier Runden.
frage: Auf welchem Feld steht der mBot2 am Ende?

runde:
    mbot.forward(60);
karte: ..... | ..... | ..^..
ziel: 2,0
> 60 cm sind zwei Felder.

runde:
    mbot.forward(30);
    mbot.turnRight();
    mbot.forward(30);
karte: ..... | ..... | ..^..
ziel: 3,1
> Ein Feld nach vorn, nach rechts drehen, ein Feld weiter.

runde:
    mbot.turnLeft();
    mbot.forward(60);
karte: ..... | ..... | ..^..
ziel: 0,2
> Erst dreht er sich nach links, dann fährt er zwei Felder.

runde:
    mbot.forward(30);
    mbot.turnRight(180);
    mbot.forward(60);
karte: ..... | ..^.. | .....
ziel: 2,2
> Ein Feld vor, umdrehen, und dann zwei Felder zurück. Er landet unter dem Start.
:::

## Das hab ich geschafft

Wie gut klappt es schon? ☂️ noch nicht, ⛅ ein bisschen, ☀️ klappt prima. Bei ☂️ und ⛅ bringt dich **Nachlesen** zum passenden Schritt.

::: checkliste
- Ich kann einen Block ins Programm ziehen und starten. → Dein erster Block
- Ich kann die Zahl in einem Block ändern. → Weiter fahren
- Ich kann den mBot2 um die Ecke fahren lassen. → Um die Ecke
:::
